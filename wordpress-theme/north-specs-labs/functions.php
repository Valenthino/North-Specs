<?php
/**
 * North Specs Labs theme bootstrap.
 *
 * @package NorthSpecsLabs
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'NSL_THEME_VERSION', '1.0.3' );
define( 'NSL_THEME_DIR', get_template_directory() );
define( 'NSL_THEME_URI', get_template_directory_uri() );

require_once NSL_THEME_DIR . '/inc/helpers.php';
require_once NSL_THEME_DIR . '/inc/setup.php';
require_once NSL_THEME_DIR . '/inc/woocommerce.php';
require_once NSL_THEME_DIR . '/inc/tracking.php';
