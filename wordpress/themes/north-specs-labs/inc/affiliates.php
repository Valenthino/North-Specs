<?php
/**
 * Affiliate and referral programme.
 *
 * Affiliates for WooCommerce owns the data: referral tokens, visits,
 * commissions and payouts. This file does three things around it — sets the
 * programme up once, gives the affiliate area the site's own visual language,
 * and puts a referral panel in the researcher account so the programme is
 * discoverable rather than hidden behind a URL.
 *
 * @package NorthSpecsLabs
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * The plugin's affiliate helper, or null when the plugin is inactive.
 *
 * @return object|null
 */
function nsl_affiliate_helper() {
	static $helper = false;

	if ( false !== $helper ) {
		return $helper;
	}

	$class = 'DDWCAffiliates\\Helper\\Affiliate\\DDWCAF_Affiliate_Helper';

	// The helper needs the plugin's configuration array, which the plugin
	// publishes as a global once it has booted.
	$configuration = $GLOBALS['ddwcaf_configuration'] ?? null;

	if ( ! class_exists( $class ) || ! is_array( $configuration ) ) {
		$helper = null;
		return $helper;
	}

	try {
		$helper = new $class( $configuration );
	} catch ( \Throwable $e ) {
		$helper = null;
	}

	return $helper;
}

/** Whether a user is an approved affiliate. */
function nsl_is_affiliate( int $user_id = 0 ): bool {
	$helper = nsl_affiliate_helper();

	if ( ! $helper || ! method_exists( $helper, 'ddwcaf_is_user_affiliate' ) ) {
		return false;
	}

	return (bool) $helper->ddwcaf_is_user_affiliate( $user_id ?: get_current_user_id() );
}

/** A user's referral URL, or an empty string. */
function nsl_referral_url( int $user_id = 0 ): string {
	$helper = nsl_affiliate_helper();

	if ( ! $helper || ! method_exists( $helper, 'ddwcaf_get_affiliate_referral_url' ) ) {
		return '';
	}

	return (string) $helper->ddwcaf_get_affiliate_referral_url( $user_id ?: get_current_user_id() );
}

/** Where the affiliate area lives. */
function nsl_affiliate_dashboard_url(): string {
	$page_id = (int) get_option( '_ddwcaf_affiliate_dashboard_page_id' );

	return $page_id ? (string) get_permalink( $page_id ) : '';
}

/**
 * A referring researcher's own performance, straight from the plugin's tables.
 *
 * @param int $user_id Affiliate user ID.
 * @return array{visits:int,orders:int,earned:float,pending:float}
 */
function nsl_referral_stats( int $user_id ): array {
	global $wpdb;

	$visits = (int) $wpdb->get_var(
		$wpdb->prepare( "SELECT COUNT(*) FROM {$wpdb->prefix}ddwcaf_visits WHERE affiliate_id = %d", $user_id )
	);

	$orders = (int) $wpdb->get_var(
		$wpdb->prepare( "SELECT COUNT(DISTINCT order_id) FROM {$wpdb->prefix}ddwcaf_commissions WHERE affiliate_id = %d", $user_id )
	);

	$earned = (float) $wpdb->get_var(
		$wpdb->prepare(
			"SELECT COALESCE( SUM( commission - refund ), 0 ) FROM {$wpdb->prefix}ddwcaf_commissions WHERE affiliate_id = %d AND status = %s",
			$user_id,
			'paid'
		)
	);

	$pending = (float) $wpdb->get_var(
		$wpdb->prepare(
			"SELECT COALESCE( SUM( commission - refund ), 0 ) FROM {$wpdb->prefix}ddwcaf_commissions WHERE affiliate_id = %d AND status IN ( %s, %s )",
			$user_id,
			'pending',
			'unpaid'
		)
	);

	return array(
		'visits'  => $visits,
		'orders'  => $orders,
		'earned'  => $earned,
		'pending' => $pending,
	);
}

/**
 * One-time programme configuration.
 *
 * Commission rate and cookie window stay editable in the plugin's own screens;
 * this only establishes sensible starting values and the referral slug.
 */
add_action(
	'init',
	function (): void {
		if ( '1.1.0' === get_option( 'nsl_affiliates_version' ) ) {
			return;
		}

		update_option( '_ddwcaf_enabled', 'yes' );

		// A 90-day window suits laboratory procurement, where a referral is
		// evaluated and budgeted long before it is bought.
		if ( (int) get_option( '_ddwcaf_referral_cookie_expires' ) < 90 ) {
			update_option( '_ddwcaf_referral_cookie_expires', 90 );
		}

		// "ref" is shorter to share and to say out loud than "referral".
		update_option( '_ddwcaf_query_variable_name', 'ref' );

		// The plugin ships a blue accent; the site has exactly one accent.
		update_option( '_ddwcaf_primary_color', '#1b573a' );

		update_option( 'nsl_affiliates_version', '1.1.0', false );
	},
	25
);

/** Affiliate area styling, loaded only where the programme is on screen. */
add_action(
	'wp_enqueue_scripts',
	function (): void {
		$page_id = (int) get_option( '_ddwcaf_affiliate_dashboard_page_id' );
		$here    = ( $page_id && is_page( $page_id ) ) || ( function_exists( 'is_account_page' ) && is_account_page() );

		if ( ! $here ) {
			return;
		}

		$css = NSL_THEME_DIR . '/assets/css/affiliates.css';

		wp_enqueue_style(
			'nsl-affiliates',
			NSL_THEME_URI . '/assets/css/affiliates.css',
			array( 'nsl-main' ),
			file_exists( $css ) ? (string) filemtime( $css ) : NSL_THEME_VERSION
		);
	},
	20
);

/**
 * The account endpoint the affiliate plugin owns, e.g. "affiliate-dashboard".
 */
function nsl_affiliate_endpoint(): string {
	$configuration = $GLOBALS['ddwcaf_configuration'] ?? array();

	return (string) ( $configuration['my_account_endpoint'] ?? 'affiliate-dashboard' );
}

/**
 * Give the affiliate account tab a plain-language name.
 *
 * The plugin's own dashboard stays exactly where it is; only the label in the
 * account navigation changes, so a researcher who has never heard the word
 * "affiliate" still recognises what the tab is for.
 *
 * @param array<string,string> $items Account menu items.
 * @return array<string,string>
 */
add_filter(
	'woocommerce_account_menu_items',
	function ( array $items ): array {
		$endpoint = nsl_affiliate_endpoint();

		if ( isset( $items[ $endpoint ] ) ) {
			$items[ $endpoint ] = __( 'Refer a researcher', 'north-specs-labs' );
		}

		return $items;
	},
	20
);

/**
 * Lead the affiliate tab with the referral link, the figures that matter and a
 * plain explanation, then let the plugin render its full dashboard beneath.
 */
add_action(
	'init',
	function (): void {
		add_action(
			'woocommerce_account_' . nsl_affiliate_endpoint() . '_endpoint',
			function (): void {
				$user_id = get_current_user_id();

				if ( nsl_is_affiliate( $user_id ) ) {
					nsl_render_referral_panel( $user_id );
					return;
				}

				nsl_render_referral_invitation();
			},
			5
		);
	},
	30
);

/**
 * The referral panel for an approved referring researcher.
 *
 * @param int $user_id Affiliate user ID.
 */
function nsl_render_referral_panel( int $user_id ): void {
	$link  = nsl_referral_url( $user_id );
	$stats = nsl_referral_stats( $user_id );
	$rate  = (float) get_option( '_ddwcaf_default_commission_rate', 0 );
	$days  = (int) get_option( '_ddwcaf_referral_cookie_expires', 30 );
	?>
	<section class="nsl-referral">
		<header class="nsl-referral__head">
			<h2><?php esc_html_e( 'Refer a researcher', 'north-specs-labs' ); ?></h2>
			<p>
				<?php
				printf(
					/* translators: 1: commission rate, 2: number of days the referral is credited for */
					esc_html__( 'Share your link with colleagues and laboratories. You earn %1$s%% of every order they place, credited for %2$d days after their first visit.', 'north-specs-labs' ),
					esc_html( (string) $rate ),
					absint( $days )
				);
				?>
			</p>
		</header>

		<?php if ( $link ) : ?>
			<div class="nsl-referral__link">
				<label for="nsl-referral-url"><?php esc_html_e( 'Your referral link', 'north-specs-labs' ); ?></label>
				<div class="nsl-referral__copy">
					<input type="text" id="nsl-referral-url" value="<?php echo esc_attr( $link ); ?>" readonly onfocus="this.select()" />
					<button type="button" class="nsl-referral__button" data-nsl-copy="#nsl-referral-url"><?php esc_html_e( 'Copy', 'north-specs-labs' ); ?></button>
				</div>
			</div>
		<?php endif; ?>

		<dl class="nsl-referral__stats">
			<div>
				<dt><?php esc_html_e( 'Visits', 'north-specs-labs' ); ?></dt>
				<dd><?php echo esc_html( number_format_i18n( $stats['visits'] ) ); ?></dd>
			</div>
			<div>
				<dt><?php esc_html_e( 'Orders referred', 'north-specs-labs' ); ?></dt>
				<dd><?php echo esc_html( number_format_i18n( $stats['orders'] ) ); ?></dd>
			</div>
			<div>
				<dt><?php esc_html_e( 'Awaiting payout', 'north-specs-labs' ); ?></dt>
				<dd><?php echo wp_kses_post( wc_price( $stats['pending'] ) ); ?></dd>
			</div>
			<div>
				<dt><?php esc_html_e( 'Paid to date', 'north-specs-labs' ); ?></dt>
				<dd><?php echo wp_kses_post( wc_price( $stats['earned'] ) ); ?></dd>
			</div>
		</dl>

		<?php $dashboard = nsl_affiliate_dashboard_url(); ?>
		<?php if ( $dashboard ) : ?>
			<p class="nsl-referral__more">
				<a class="nsl-button nsl-button--secondary" href="<?php echo esc_url( $dashboard ); ?>">
					<?php esc_html_e( 'Open the full affiliate dashboard', 'north-specs-labs' ); ?>
				</a>
			</p>
		<?php endif; ?>
	</section>
	<?php
}

/** The invitation shown to a researcher who has not joined yet. */
function nsl_render_referral_invitation(): void {
	$rate      = (float) get_option( '_ddwcaf_default_commission_rate', 0 );
	$dashboard = nsl_affiliate_dashboard_url();
	?>
	<section class="nsl-referral nsl-referral--invite">
		<header class="nsl-referral__head">
			<h2><?php esc_html_e( 'Refer a researcher', 'north-specs-labs' ); ?></h2>
			<p>
				<?php
				printf(
					/* translators: %s: commission rate */
					esc_html__( 'Colleagues ask where you source your peptides. Join the referral programme and earn %s%% of every order placed through your link.', 'north-specs-labs' ),
					esc_html( (string) $rate )
				);
				?>
			</p>
		</header>

		<ul class="nsl-referral__points">
			<li><?php esc_html_e( 'A single link you can share by email or put in a protocol appendix.', 'north-specs-labs' ); ?></li>
			<li><?php esc_html_e( 'Commission on every qualifying order, tracked automatically.', 'north-specs-labs' ); ?></li>
			<li><?php esc_html_e( 'Referred colleagues get the same batch documentation and dispatch you do.', 'north-specs-labs' ); ?></li>
		</ul>

		<?php if ( $dashboard ) : ?>
			<p>
				<a class="nsl-button" href="<?php echo esc_url( $dashboard ); ?>">
					<?php esc_html_e( 'Apply to the referral programme', 'north-specs-labs' ); ?>
				</a>
			</p>
		<?php endif; ?>
	</section>
	<?php
}

/** Copy-to-clipboard for the referral link. */
add_action(
	'wp_footer',
	function (): void {
		if ( ! function_exists( 'is_account_page' ) || ! is_account_page() ) {
			return;
		}
		?>
		<script>
		( function () {
			document.addEventListener( 'click', function ( event ) {
				var button = event.target.closest( '[data-nsl-copy]' );
				if ( ! button ) {
					return;
				}
				var field = document.querySelector( button.dataset.nslCopy );
				if ( ! field || ! navigator.clipboard ) {
					return;
				}
				navigator.clipboard.writeText( field.value ).then( function () {
					var was = button.textContent;
					button.textContent = <?php echo wp_json_encode( __( 'Copied', 'north-specs-labs' ) ); ?>;
					button.classList.add( 'is-copied' );
					window.setTimeout( function () {
						button.textContent = was;
						button.classList.remove( 'is-copied' );
					}, 2000 );
				} );
			} );
		} )();
		</script>
		<?php
	}
);

/**
 * Credit the referring researcher's own account page too.
 *
 * A researcher who lands on the account dashboard sees the programme once,
 * rather than only discovering it if they open the tab.
 */
add_action(
	'woocommerce_account_dashboard',
	function (): void {
		if ( ! nsl_affiliate_helper() || ! nsl_is_affiliate() ) {
			return;
		}

		$link = nsl_referral_url();

		if ( ! $link ) {
			return;
		}

		printf(
			'<p class="nsl-referral__nudge">%1$s <a href="%2$s">%3$s</a></p>',
			esc_html__( 'Your referral link is ready to share.', 'north-specs-labs' ),
			esc_url( wc_get_account_endpoint_url( nsl_affiliate_endpoint() ) ),
			esc_html__( 'Open referrals', 'north-specs-labs' )
		);
	},
	20
);
