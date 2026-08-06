<?php
/**
 * Account security: throttling, recovery, bot protection and administrator 2FA.
 *
 * Researcher accounts stay deliberately simple — email, password, reset. The
 * stronger second factor is reserved for accounts that can change the store,
 * and it stays disabled until an administrator turns it on.
 *
 * @package NorthSpecsLabs
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* -------------------------------------------------------------------------
 * Rate limiting
 * ---------------------------------------------------------------------- */

/** A salted, non-reversible bucket key. Raw addresses are never stored. */
function nsl_security_key( string $scope, string $subject ): string {
	return 'nsl_sec_' . substr( hash_hmac( 'sha256', $scope . '|' . strtolower( trim( $subject ) ), wp_salt( 'auth' ) ), 0, 32 );
}

/** The requesting address, trusted only as a throttling hint. */
function nsl_request_ip(): string {
	return (string) ( $_SERVER['REMOTE_ADDR'] ?? '' );
}

/** Current attempt count for a bucket. */
function nsl_security_attempts( string $scope, string $subject ): int {
	return absint( get_transient( nsl_security_key( $scope, $subject ) ) );
}

/** Register one attempt against a bucket. */
function nsl_security_record_attempt( string $scope, string $subject, int $window = 900 ): int {
	$key   = nsl_security_key( $scope, $subject );
	$count = absint( get_transient( $key ) ) + 1;
	set_transient( $key, $count, $window );

	return $count;
}

/** Clear a bucket after a legitimate success. */
function nsl_security_clear( string $scope, string $subject ): void {
	delete_transient( nsl_security_key( $scope, $subject ) );
}

/** Thresholds, filterable so operations can tune them without editing code. */
function nsl_security_limits(): array {
	return (array) apply_filters(
		'nsl_security_limits',
		array(
			'login_user'   => 6,
			'login_ip'     => 20,
			'reset_email'  => 4,
			'reset_ip'     => 10,
			'window'       => 15 * MINUTE_IN_SECONDS,
			'lockout'      => 15 * MINUTE_IN_SECONDS,
		)
	);
}

/** Block sign-in attempts once a bucket is exhausted. */
add_filter(
	'authenticate',
	function ( $user, $username ) {
		if ( '' === (string) $username ) {
			return $user;
		}

		$limits = nsl_security_limits();
		$ip     = nsl_request_ip();

		if ( nsl_security_attempts( 'login-user', $ip . '|' . $username ) >= $limits['login_user'] || nsl_security_attempts( 'login-ip', $ip ) >= $limits['login_ip'] ) {
			return new WP_Error(
				'nsl_login_throttled',
				sprintf(
					/* translators: %d: minutes to wait. */
					esc_html__( 'Too many sign-in attempts. For account safety, try again in about %d minutes or reset your password.', 'north-specs-labs' ),
					(int) ceil( $limits['lockout'] / MINUTE_IN_SECONDS )
				)
			);
		}

		return $user;
	},
	5,
	2
);

add_action(
	'wp_login_failed',
	function ( $username ): void {
		$limits = nsl_security_limits();
		$ip     = nsl_request_ip();
		nsl_security_record_attempt( 'login-user', $ip . '|' . (string) $username, $limits['window'] );
		nsl_security_record_attempt( 'login-ip', $ip, $limits['window'] );
	}
);

add_action(
	'wp_login',
	function ( $username ): void {
		$ip = nsl_request_ip();
		nsl_security_clear( 'login-user', $ip . '|' . (string) $username );
		nsl_security_clear( 'login-ip', $ip );
	},
	5
);

/** Throttle password-reset requests from both the account form and wp-login. */
add_action(
	'lostpassword_post',
	function ( $errors ): void {
		if ( ! $errors instanceof WP_Error ) {
			return;
		}

		$limits = nsl_security_limits();
		$ip     = nsl_request_ip();
		// phpcs:ignore WordPress.Security.NonceVerification.Missing -- WordPress and WooCommerce verify their own nonces before this hook.
		$login = isset( $_POST['user_login'] ) ? sanitize_text_field( wp_unslash( $_POST['user_login'] ) ) : '';

		if ( nsl_security_attempts( 'reset-email', $login ) >= $limits['reset_email'] || nsl_security_attempts( 'reset-ip', $ip ) >= $limits['reset_ip'] ) {
			$errors->add( 'nsl_reset_throttled', esc_html__( 'Too many reset requests for now. Check your inbox and spam folder, then try again shortly.', 'north-specs-labs' ) );

			return;
		}

		nsl_security_record_attempt( 'reset-email', $login, $limits['window'] );
		nsl_security_record_attempt( 'reset-ip', $ip, $limits['window'] );
	}
);

/* -------------------------------------------------------------------------
 * Recovery journey
 * ---------------------------------------------------------------------- */

/** Keep researchers inside the account experience rather than wp-login. */
add_action(
	'login_form_lostpassword',
	function (): void {
		if ( 'GET' !== ( $_SERVER['REQUEST_METHOD'] ?? 'GET' ) || is_user_logged_in() ) {
			return;
		}
		wp_safe_redirect( wc_lostpassword_url() );
		exit;
	}
);

/** Branded, factual reset notification for the WooCommerce recovery flow. */
add_filter(
	'woocommerce_email_subject_customer_reset_password',
	fn(): string => __( 'Reset your North Specs researcher password', 'north-specs-labs' )
);

add_filter(
	'woocommerce_email_heading_customer_reset_password',
	fn(): string => __( 'Password reset request', 'north-specs-labs' )
);

add_filter(
	'woocommerce_email_additional_content_customer_reset_password',
	fn(): string => __( 'This link can only be used once and expires shortly. If you did not request a reset, no action is needed and your password stays unchanged. Research support will never ask you for your password.', 'north-specs-labs' )
);

/* -------------------------------------------------------------------------
 * Cloudflare Turnstile (activates the moment keys are saved)
 * ---------------------------------------------------------------------- */

/** Configured Turnstile keys, or empty strings when not yet provisioned. */
function nsl_turnstile_keys(): array {
	return array(
		'site'   => trim( (string) get_option( 'nsl_turnstile_site_key', '' ) ),
		'secret' => trim( (string) get_option( 'nsl_turnstile_secret_key', '' ) ),
	);
}

/** Bot protection is only active once both keys exist. */
function nsl_turnstile_active(): bool {
	$keys = nsl_turnstile_keys();

	return '' !== $keys['site'] && '' !== $keys['secret'];
}

/** Render the widget. A no-op until keys are available. */
function nsl_turnstile_field(): void {
	if ( ! nsl_turnstile_active() ) {
		return;
	}

	$keys = nsl_turnstile_keys();
	wp_enqueue_script( 'nsl-turnstile', 'https://challenges.cloudflare.com/turnstile/v0/api.js', array(), null, true );
	printf(
		'<div class="nsl-turnstile cf-turnstile" data-sitekey="%s" data-theme="light" data-action="account"></div>',
		esc_attr( $keys['site'] )
	);
}

/** Verify the submitted token against Cloudflare. */
function nsl_turnstile_passed(): bool {
	if ( ! nsl_turnstile_active() ) {
		return true;
	}

	// phpcs:ignore WordPress.Security.NonceVerification.Missing -- host forms verify their own nonces first.
	$token = isset( $_POST['cf-turnstile-response'] ) ? sanitize_text_field( wp_unslash( $_POST['cf-turnstile-response'] ) ) : '';
	if ( '' === $token ) {
		return false;
	}

	$keys     = nsl_turnstile_keys();
	$response = wp_remote_post(
		'https://challenges.cloudflare.com/turnstile/v0/siteverify',
		array(
			'timeout' => 8,
			'body'    => array(
				'secret'   => $keys['secret'],
				'response' => $token,
				'remoteip' => nsl_request_ip(),
			),
		)
	);

	if ( is_wp_error( $response ) ) {
		// A Cloudflare outage must not lock qualified researchers out of their account.
		return true;
	}

	$body = json_decode( (string) wp_remote_retrieve_body( $response ), true );

	return ! empty( $body['success'] );
}

add_action( 'woocommerce_login_form', 'nsl_turnstile_field', 20 );
add_action( 'woocommerce_register_form', 'nsl_turnstile_field', 20 );
add_action( 'woocommerce_lostpassword_form', 'nsl_turnstile_field', 20 );

add_filter(
	'woocommerce_process_login_errors',
	function ( $errors ) {
		if ( $errors instanceof WP_Error && ! nsl_turnstile_passed() ) {
			$errors->add( 'nsl_turnstile', esc_html__( 'Please complete the verification challenge and try again.', 'north-specs-labs' ) );
		}

		return $errors;
	},
	20
);

add_filter(
	'woocommerce_registration_errors',
	function ( $errors ) {
		if ( $errors instanceof WP_Error && ! nsl_turnstile_passed() ) {
			$errors->add( 'nsl_turnstile', esc_html__( 'Please complete the verification challenge and try again.', 'north-specs-labs' ) );
		}

		return $errors;
	},
	20
);

add_action(
	'lostpassword_post',
	function ( $errors ): void {
		if ( $errors instanceof WP_Error && ! nsl_turnstile_passed() ) {
			$errors->add( 'nsl_turnstile', esc_html__( 'Please complete the verification challenge and try again.', 'north-specs-labs' ) );
		}
	},
	20
);

/* -------------------------------------------------------------------------
 * Administrator two-factor (email code)
 * ---------------------------------------------------------------------- */

/** Only accounts that can change the store are ever challenged. */
function nsl_requires_second_factor( WP_User $user ): bool {
	if ( 'yes' !== get_option( 'nsl_admin_2fa', 'no' ) ) {
		return false;
	}

	return user_can( $user, 'manage_options' ) || user_can( $user, 'manage_woocommerce' );
}

/** Issue and email a one-time code. */
function nsl_issue_second_factor( WP_User $user ): void {
	$code = str_pad( (string) wp_rand( 0, 999999 ), 6, '0', STR_PAD_LEFT );
	update_user_meta( $user->ID, '_nsl_2fa_hash', wp_hash_password( $code ) );
	update_user_meta( $user->ID, '_nsl_2fa_expires', time() + 10 * MINUTE_IN_SECONDS );

	$body = function_exists( 'nsl_growth_email_html' )
		? nsl_growth_email_html(
			__( 'Administrator sign-in code', 'north-specs-labs' ),
			__( 'A sign-in to a North Specs administrative account was requested.', 'north-specs-labs' ),
			'<p style="font-family:monospace;font-size:30px;letter-spacing:.22em;margin:18px 0"><strong>' . esc_html( $code ) . '</strong></p><p>This code expires in 10 minutes. If you did not request it, change the account password immediately.</p>'
		)
		: sprintf( "Your North Specs administrator sign-in code is %s. It expires in 10 minutes.", $code );

	add_filter( 'wp_mail_content_type', 'nsl_email_content_type_html' );
	wp_mail( $user->user_email, __( 'North Specs administrator sign-in code', 'north-specs-labs' ), $body );
	remove_filter( 'wp_mail_content_type', 'nsl_email_content_type_html' );
}

/** Content type helper used for the code email only. */
function nsl_email_content_type_html(): string {
	return 'text/html';
}

/** Verify a submitted code. */
function nsl_verify_second_factor( WP_User $user, string $code ): bool {
	$hash    = (string) get_user_meta( $user->ID, '_nsl_2fa_hash', true );
	$expires = (int) get_user_meta( $user->ID, '_nsl_2fa_expires', true );

	if ( '' === $hash || $expires < time() ) {
		return false;
	}

	if ( ! wp_check_password( $code, $hash, $user->ID ) ) {
		return false;
	}

	delete_user_meta( $user->ID, '_nsl_2fa_hash' );
	delete_user_meta( $user->ID, '_nsl_2fa_expires' );

	return true;
}

add_filter(
	'authenticate',
	function ( $user ) {
		if ( ! $user instanceof WP_User || ! nsl_requires_second_factor( $user ) ) {
			return $user;
		}

		// phpcs:ignore WordPress.Security.NonceVerification.Missing -- WordPress verifies the login form before authentication runs.
		$code = isset( $_POST['nsl_2fa_code'] ) ? preg_replace( '/\D/', '', (string) wp_unslash( $_POST['nsl_2fa_code'] ) ) : '';

		if ( '' !== $code ) {
			return nsl_verify_second_factor( $user, $code )
				? $user
				: new WP_Error( 'nsl_2fa_invalid', esc_html__( 'That sign-in code was not correct or has expired. Request a new one by signing in again.', 'north-specs-labs' ) );
		}

		nsl_issue_second_factor( $user );

		return new WP_Error( 'nsl_2fa_required', esc_html__( 'A six-digit sign-in code has been emailed to this administrator account. Enter it below to continue.', 'north-specs-labs' ) );
	},
	40
);

/**
 * The code field, offered on both sign-in surfaces so an administrator is never
 * stranded on whichever form they happened to use. Customers never see it.
 */
function nsl_second_factor_field( bool $account_styling = false ): void {
	if ( 'yes' !== get_option( 'nsl_admin_2fa', 'no' ) ) {
		return;
	}
	?>
	<p class="<?php echo $account_styling ? 'woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide nsl-2fa-field' : ''; ?>">
		<label for="nsl_2fa_code<?php echo $account_styling ? '_account' : ''; ?>"><?php esc_html_e( 'Administrator sign-in code', 'north-specs-labs' ); ?></label>
		<input type="text" name="nsl_2fa_code" id="nsl_2fa_code<?php echo $account_styling ? '_account' : ''; ?>" class="input input-text" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]*" value="">
		<small><?php esc_html_e( 'Only administrator accounts need this. Leave it blank on your first attempt — a code is emailed if one is required.', 'north-specs-labs' ); ?></small>
	</p>
	<?php
}

add_action( 'login_form', 'nsl_second_factor_field' );
add_action( 'woocommerce_login_form', function (): void { nsl_second_factor_field( true ); }, 15 );
