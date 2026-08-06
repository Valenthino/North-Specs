<?php
/**
 * Researcher workspace.
 *
 * Overrides woocommerce/myaccount/dashboard.php.
 *
 * @package NorthSpecsLabs
 */

defined( 'ABSPATH' ) || exit;

nsl_account_render_dashboard();

/**
 * Kept so plugins that attach to the WooCommerce dashboard still render.
 */
do_action( 'woocommerce_account_dashboard' );
