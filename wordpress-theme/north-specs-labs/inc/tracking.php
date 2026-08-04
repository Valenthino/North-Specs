<?php
/**
 * Consent-friendly analytics data layer and first-party order attribution.
 *
 * @package NorthSpecsLabs
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Capture standard campaign parameters in the WooCommerce session. */
add_action(
	'wp_loaded',
	function (): void {
		if ( ! function_exists( 'WC' ) || ! WC()->session ) {
			return;
		}
		$keys = array( 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid' );
		foreach ( $keys as $key ) {
			if ( isset( $_GET[ $key ] ) ) {
				WC()->session->set( 'nsl_' . $key, sanitize_text_field( wp_unslash( $_GET[ $key ] ) ) );
			}
		}
		if ( ! WC()->session->get( 'nsl_landing_page' ) ) {
			WC()->session->set( 'nsl_landing_page', esc_url_raw( home_url( wp_unslash( $_SERVER['REQUEST_URI'] ?? '/' ) ) ) );
			WC()->session->set( 'nsl_referrer', isset( $_SERVER['HTTP_REFERER'] ) ? esc_url_raw( wp_unslash( $_SERVER['HTTP_REFERER'] ) ) : '' );
		}
	},
	20
);

add_action(
	'woocommerce_checkout_create_order',
	function ( WC_Order $order ): void {
		if ( ! function_exists( 'WC' ) || ! WC()->session ) {
			return;
		}
		foreach ( array( 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'landing_page', 'referrer' ) as $key ) {
			$value = WC()->session->get( 'nsl_' . $key );
			if ( $value ) {
				$order->update_meta_data( '_nsl_' . $key, $value );
			}
		}
	},
	30
);

/** Emit privacy-neutral GA4/GTM-ready events; a consent platform can gate the consumer. */
add_action(
	'wp_head',
	function (): void {
		echo "<script>window.dataLayer=window.dataLayer||[];</script>\n";
	},
	1
);

add_action(
	'wp_footer',
	function (): void {
		if ( ! function_exists( 'WC' ) ) {
			return;
		}
		$event = null;
		if ( is_cart() ) {
			$event = array( 'event' => 'view_cart', 'ecommerce' => array( 'currency' => get_woocommerce_currency(), 'value' => WC()->cart ? (float) WC()->cart->get_total( 'edit' ) : 0 ) );
		} elseif ( is_checkout() && ! is_order_received_page() ) {
			$event = array( 'event' => 'begin_checkout', 'ecommerce' => array( 'currency' => get_woocommerce_currency(), 'value' => WC()->cart ? (float) WC()->cart->get_total( 'edit' ) : 0 ) );
		} elseif ( is_product() ) {
			$product = wc_get_product( get_the_ID() );
			if ( $product ) {
				$event = array( 'event' => 'view_item', 'ecommerce' => array( 'currency' => get_woocommerce_currency(), 'value' => (float) $product->get_price(), 'items' => array( array( 'item_id' => (string) $product->get_id(), 'item_name' => $product->get_name(), 'price' => (float) $product->get_price() ) ) ) );
			}
		}
		if ( $event ) {
			echo '<script>window.dataLayer.push(' . wp_json_encode( $event ) . ');</script>';
		}
		if ( isset( $_GET['notes'] ) && 'joined' === sanitize_key( wp_unslash( $_GET['notes'] ) ) ) {
			echo '<script>window.dataLayer.push({event:"generate_lead",lead_type:"research_notes"});</script>';
		}
	},
	99
);

add_action(
	'woocommerce_thankyou',
	function ( int $order_id ): void {
		$order = wc_get_order( $order_id );
		if ( ! $order ) {
			return;
		}
		$items = array();
		foreach ( $order->get_items() as $item ) {
			$product = $item->get_product();
			$items[] = array( 'item_id' => $product ? (string) $product->get_id() : '', 'item_name' => $item->get_name(), 'price' => (float) $order->get_item_total( $item ), 'quantity' => (int) $item->get_quantity() );
		}
		$event = array( 'event' => 'purchase', 'ecommerce' => array( 'transaction_id' => (string) $order->get_order_number(), 'currency' => $order->get_currency(), 'value' => (float) $order->get_total(), 'tax' => (float) $order->get_total_tax(), 'shipping' => (float) $order->get_shipping_total(), 'items' => $items ) );
		echo '<script>window.dataLayer=window.dataLayer||[];window.dataLayer.push(' . wp_json_encode( $event ) . ');</script>';
	},
	99
);
