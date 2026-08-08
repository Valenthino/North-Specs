<?php
/**
 * North Specs Labs theme bootstrap.
 *
 * @package NorthSpecsLabs
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'NSL_THEME_VERSION', '1.7.0' );
define( 'NSL_THEME_DIR', get_template_directory() );
define( 'NSL_THEME_URI', get_template_directory_uri() );

require_once NSL_THEME_DIR . '/inc/helpers.php';
require_once NSL_THEME_DIR . '/inc/access-gate.php';
require_once NSL_THEME_DIR . '/inc/setup.php';
require_once NSL_THEME_DIR . '/inc/editorial.php';
require_once NSL_THEME_DIR . '/inc/woocommerce.php';
require_once NSL_THEME_DIR . '/inc/tracking.php';
require_once NSL_THEME_DIR . '/inc/growth.php';

// Researcher account: entrance, workspace, orders, batch records, tracking,
// receipts, security and self-service analytics.
require_once NSL_THEME_DIR . '/inc/account/analytics.php';
require_once NSL_THEME_DIR . '/inc/account/records.php';
require_once NSL_THEME_DIR . '/inc/account/shipments.php';
require_once NSL_THEME_DIR . '/inc/account/experience.php';
require_once NSL_THEME_DIR . '/inc/account/receipt.php';
require_once NSL_THEME_DIR . '/inc/account/security.php';

// Checkout: payment lineup, staged flow and address assistance.
require_once NSL_THEME_DIR . '/inc/checkout/gateways.php';
require_once NSL_THEME_DIR . '/inc/checkout/flow.php';
require_once NSL_THEME_DIR . '/inc/checkout/address.php';

// Affiliate and referral programme.
require_once NSL_THEME_DIR . '/inc/affiliates.php';

// Conversion: measurement first, since the other two record through it.
require_once NSL_THEME_DIR . '/inc/growth/measurement.php';
require_once NSL_THEME_DIR . '/inc/growth/shipping.php';
require_once NSL_THEME_DIR . '/inc/growth/lifecycle.php';

if ( is_admin() ) {
	require_once NSL_THEME_DIR . '/inc/account/admin.php';
	require_once NSL_THEME_DIR . '/inc/growth/dashboard.php';
}
