<?php
/**
 * Sign-in, sign-up and guest identity.
 *
 * Nextend Social Login renders its Google button through hooks that the
 * theme's custom account templates never call, so the button is placed here
 * explicitly, using the plugin's own shortcode as the public API.
 *
 * Checkout no longer demands an account. A guest can complete an order and is
 * offered one afterwards; account creation has a page of its own.
 *
 * @package NorthSpecsLabs
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Slug of the dedicated account-creation page. */
const NSL_ACCOUNT_PAGE_SLUG = 'create-account';

/**
 * Google (and any other enabled provider) buttons, or an empty string.
 *
 * @param string $context Where the buttons appear, for the wrapper class.
 */
function nsl_social_buttons( string $context = 'login' ): string {
	if ( is_user_logged_in() || ! shortcode_exists( 'nextend_social_login' ) ) {
		return '';
	}

	$buttons = do_shortcode( '[nextend_social_login]' );

	if ( '' === trim( $buttons ) ) {
		return '';
	}

	return sprintf(
		'<div class="nsl-identity nsl-identity--%1$s"><div class="nsl-identity__buttons">%2$s</div><p class="nsl-identity__divider"><span>%3$s</span></p></div>',
		esc_attr( $context ),
		$buttons,
		esc_html__( 'or use your email address', 'north-specs-labs' )
	);
}

/** Print the buttons above the sign-in form. */
add_action(
	'woocommerce_login_form_start',
	function (): void {
		echo nsl_social_buttons( 'login' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- provider markup, escaped at source.
	},
	5
);

/** And above the registration form. */
add_action(
	'woocommerce_register_form_start',
	function (): void {
		echo nsl_social_buttons( 'register' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- provider markup, escaped at source.
	},
	5
);

/** And on the checkout identity band, via the hook the theme already exposes. */
add_action(
	'nsl_checkout_social_login',
	function (): void {
		echo nsl_social_buttons( 'checkout' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- provider markup, escaped at source.
	}
);

/**
 * The checkout identity band: sign in, create an account, or carry on as a guest.
 *
 * Replaces the old "an account is required" notice now that guests may buy.
 */
add_action(
	'woocommerce_before_checkout_form',
	function (): void {
		if ( is_user_logged_in() || ! function_exists( 'WC' ) || ! WC()->cart || WC()->cart->is_empty() ) {
			return;
		}

		$checkout_url = wc_get_checkout_url();
		?>
		<section class="nsl-identity-band" aria-labelledby="nsl-identity-band-title">
			<div class="nsl-identity-band__intro">
				<h2 id="nsl-identity-band-title"><?php esc_html_e( 'Checking out as a guest', 'north-specs-labs' ); ?></h2>
				<p><?php esc_html_e( 'No account needed. Sign in instead if you would like this order to join your order history, batch records and tracking.', 'north-specs-labs' ); ?></p>
			</div>
			<div class="nsl-identity-band__actions">
				<a class="nsl-button nsl-button--secondary" href="<?php echo esc_url( add_query_arg( 'redirect_to', rawurlencode( $checkout_url ), wc_get_page_permalink( 'myaccount' ) ) ); ?>">
					<?php esc_html_e( 'Sign in', 'north-specs-labs' ); ?>
				</a>
				<a class="nsl-identity-band__link" href="<?php echo esc_url( nsl_account_page_url() ); ?>">
					<?php esc_html_e( 'Create a researcher account', 'north-specs-labs' ); ?>
				</a>
			</div>
		</section>
		<?php
	},
	3
);

/**
 * Offer the account after the order rather than demanding it before.
 *
 * A guest has just typed their name, address and email; turning that into an
 * account is one password, and the order is claimed automatically.
 */
add_action(
	'woocommerce_thankyou',
	function ( int $order_id ): void {
		if ( is_user_logged_in() || ! $order_id ) {
			return;
		}

		$order = wc_get_order( $order_id );

		if ( ! $order || $order->get_customer_id() ) {
			return;
		}
		?>
		<section class="nsl-identity-after" aria-labelledby="nsl-identity-after-title">
			<h2 id="nsl-identity-after-title"><?php esc_html_e( 'Keep the records for this order', 'north-specs-labs' ); ?></h2>
			<p><?php esc_html_e( 'Create a researcher account with this email address and this order, its batch documentation and its tracking are added to your workspace automatically.', 'north-specs-labs' ); ?></p>
			<a class="nsl-button" href="<?php echo esc_url( add_query_arg( 'email', rawurlencode( $order->get_billing_email() ), nsl_account_page_url() ) ); ?>">
				<?php esc_html_e( 'Create an account', 'north-specs-labs' ); ?>
			</a>
		</section>
		<?php
	},
	20
);

/** URL of the account-creation page, falling back to My Account. */
function nsl_account_page_url(): string {
	$page = get_page_by_path( NSL_ACCOUNT_PAGE_SLUG );

	if ( $page instanceof WP_Post ) {
		return (string) get_permalink( $page );
	}

	return (string) wc_get_page_permalink( 'myaccount' );
}

/**
 * The account-creation page content.
 *
 * WooCommerce's own registration handler processes the post, so the account
 * behaves identically to one created from My Account.
 */
add_shortcode(
	'nsl_create_account',
	function (): string {
		if ( is_user_logged_in() ) {
			return sprintf(
				'<div class="nsl-identity-done"><p>%1$s</p><p><a class="nsl-button" href="%2$s">%3$s</a></p></div>',
				esc_html__( 'You are already signed in.', 'north-specs-labs' ),
				esc_url( wc_get_page_permalink( 'myaccount' ) ),
				esc_html__( 'Go to your workspace', 'north-specs-labs' )
			);
		}

		ob_start();
		?>
		<div class="nsl-create-account">
			<div class="nsl-create-account__form">
				<?php echo nsl_social_buttons( 'register' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>

				<form method="post" class="woocommerce-form woocommerce-form-register register">
					<?php do_action( 'woocommerce_register_form_start' ); ?>

					<p class="woocommerce-form-row form-row">
						<label for="nsl-reg-email"><?php esc_html_e( 'Email address', 'north-specs-labs' ); ?>&nbsp;<span class="required">*</span></label>
						<input type="email" class="woocommerce-Input input-text" name="email" id="nsl-reg-email" autocomplete="email" required
							value="<?php echo esc_attr( wp_unslash( $_GET['email'] ?? '' ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended ?>" />
					</p>

					<p class="woocommerce-form-row form-row">
						<label for="nsl-reg-password"><?php esc_html_e( 'Password', 'north-specs-labs' ); ?>&nbsp;<span class="required">*</span></label>
						<input type="password" class="woocommerce-Input input-text" name="password" id="nsl-reg-password" autocomplete="new-password" required />
						<span class="nsl-create-account__hint"><?php esc_html_e( 'Use at least 12 characters.', 'north-specs-labs' ); ?></span>
					</p>

					<?php do_action( 'woocommerce_register_form' ); ?>

					<p class="woocommerce-form-row form-row">
						<?php wp_nonce_field( 'woocommerce-register', 'woocommerce-register-nonce' ); ?>
						<button type="submit" class="woocommerce-Button nsl-button" name="register" value="<?php esc_attr_e( 'Create account', 'north-specs-labs' ); ?>">
							<?php esc_html_e( 'Create account', 'north-specs-labs' ); ?>
						</button>
					</p>

					<?php do_action( 'woocommerce_register_form_end' ); ?>
				</form>

				<p class="nsl-create-account__signin">
					<?php
					printf(
						/* translators: %s: link to the sign-in page */
						esc_html__( 'Already have an account? %s', 'north-specs-labs' ),
						'<a href="' . esc_url( wc_get_page_permalink( 'myaccount' ) ) . '">' . esc_html__( 'Sign in', 'north-specs-labs' ) . '</a>'
					);
					?>
				</p>
			</div>

			<aside class="nsl-create-account__aside">
				<h2><?php esc_html_e( 'What an account gives you', 'north-specs-labs' ); ?></h2>
				<ul>
					<li><?php esc_html_e( 'Order history and reorder in one step.', 'north-specs-labs' ); ?></li>
					<li><?php esc_html_e( 'Batch documentation tied to the exact lot you received.', 'north-specs-labs' ); ?></li>
					<li><?php esc_html_e( 'Live dispatch tracking and printable procurement receipts.', 'north-specs-labs' ); ?></li>
					<li><?php esc_html_e( 'Saved laboratory addresses for faster checkout.', 'north-specs-labs' ); ?></li>
				</ul>
				<p class="nsl-create-account__note"><?php esc_html_e( 'An account is never required to place an order.', 'north-specs-labs' ); ?></p>
			</aside>
		</div>
		<?php
		return (string) ob_get_clean();
	}
);

/** Create the account page once. */
add_action(
	'init',
	function (): void {
		if ( '1.0.0' === get_option( 'nsl_identity_version' ) ) {
			return;
		}

		if ( ! get_page_by_path( NSL_ACCOUNT_PAGE_SLUG ) ) {
			wp_insert_post(
				array(
					'post_title'   => __( 'Create your researcher account', 'north-specs-labs' ),
					'post_name'    => NSL_ACCOUNT_PAGE_SLUG,
					'post_content' => '[nsl_create_account]',
					'post_status'  => 'publish',
					'post_type'    => 'page',
				)
			);
		}

		update_option( 'nsl_identity_version', '1.0.0', false );
	},
	30
);

/** Identity styling rides along with the checkout and account stylesheets. */
add_action(
	'wp_enqueue_scripts',
	function (): void {
		$page = get_page_by_path( NSL_ACCOUNT_PAGE_SLUG );
		$here = ( function_exists( 'is_account_page' ) && is_account_page() )
			|| ( function_exists( 'is_checkout' ) && is_checkout() )
			|| ( $page && is_page( $page->ID ) );

		if ( ! $here ) {
			return;
		}

		$css = NSL_THEME_DIR . '/assets/css/identity.css';

		wp_enqueue_style(
			'nsl-identity',
			NSL_THEME_URI . '/assets/css/identity.css',
			array( 'nsl-main' ),
			file_exists( $css ) ? (string) filemtime( $css ) : NSL_THEME_VERSION
		);
	},
	21
);
