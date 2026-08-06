<?php
/**
 * Searchable, filterable order history.
 *
 * Overrides woocommerce/myaccount/orders.php. Filtering and pagination are
 * handled in nsl_account_render_orders() so the WooCommerce query arguments
 * stay untouched.
 *
 * @package NorthSpecsLabs
 */

defined( 'ABSPATH' ) || exit;

do_action( 'woocommerce_before_account_orders', $has_orders );

nsl_account_render_orders();

do_action( 'woocommerce_after_account_orders', $has_orders );
