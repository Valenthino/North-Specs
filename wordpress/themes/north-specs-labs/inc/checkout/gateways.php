<?php
/**
 * Payment method lineup.
 *
 * North Specs settles through Card2Crypto. Two methods are offered:
 * a card rail and Interac. Offline methods (direct bank transfer, cheque,
 * purchase order / cash on delivery) are retired everywhere.
 *
 * The card rail is backed by Card2Crypto's hosted smart router rather than its
 * Stripe channel: the Stripe channel is documented USA-only and converts the
 * basket to USD, while the router geo-routes each buyer and keeps the charge in
 * the store currency (CAD).
 *
 * @package NorthSpecsLabs
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** The single checkout method: Card2Crypto's hosted smart router. */
const NSL_GATEWAY_CARD = 'card2crypto-instant-payment-gateway-hostedcard2crypto';

/**
 * Every other gateway. Checkout offers one choice, so all of these are off:
 * the offline methods are retired outright, and the individual Card2Crypto
 * channels are reached through the hosted page rather than as separate rows.
 */
const NSL_GATEWAYS_RETIRED = array(
	'bacs',
	'cheque',
	'cod',
	'card2crypto-instant-payment-gateway-interac',
	'card2crypto-instant-payment-gateway-stripe',
	'card2crypto-instant-payment-gateway-moonpay',
	'card2crypto-instant-payment-gateway-revolut',
	'card2crypto-instant-payment-gateway-paypalcom',
	'card2crypto-instant-payment-gateway-rampnetwork',
	'card2crypto-instant-payment-gateway-transak',
	'card2crypto-instant-payment-gateway-banxa',
	'card2crypto-instant-payment-gateway-utorg',
	'card2crypto-instant-payment-gateway-transfi',
	'card2crypto-instant-payment-gateway-sardine',
	'card2crypto-instant-payment-gateway-topper',
	'card2crypto-instant-payment-gateway-bitnovo',
	'card2crypto-instant-payment-gateway-robinhood',
	'card2crypto-instant-payment-gateway-upi',
	'card2crypto-instant-payment-gateway-simplex',
	'card2crypto-instant-payment-gateway-binance',
	'card2crypto-instant-payment-gateway-customprovider',
	'card2crypto-payment-gateway-dynamic',
);

/**
 * One-time payment configuration.
 *
 * Written through the options API so the values stay editable in
 * WooCommerce > Settings > Payments. Bump the version to re-apply.
 */
add_action(
	'init',
	function (): void {
		if ( '3.0.0' === get_option( 'nsl_payments_version' ) ) {
			return;
		}

		$configure = static function ( string $gateway, array $changes ): void {
			$option   = 'woocommerce_' . $gateway . '_settings';
			$settings = get_option( $option );
			if ( ! is_array( $settings ) ) {
				$settings = array();
			}
			update_option( $option, array_merge( $settings, $changes ) );
		};

		$configure(
			NSL_GATEWAY_CARD,
			array(
				'enabled'     => 'yes',
				'title'       => __( 'Secure Checkout', 'north-specs-labs' ),
				'description' => __( 'Pay by card, Interac or cryptocurrency. You are taken to our secure payment page to choose how you pay, then returned here.', 'north-specs-labs' ),
			)
		);

		foreach ( NSL_GATEWAYS_RETIRED as $gateway ) {
			$configure( $gateway, array( 'enabled' => 'no' ) );
		}

		update_option( 'woocommerce_gateway_order', array( NSL_GATEWAY_CARD => 0 ) );

		update_option( 'nsl_payments_version', '3.0.0', false );
	},
	20
);

/**
 * Withdraw retired and unavailable methods at runtime.
 *
 * Belt and braces: the one-time write above disables them in settings, and this
 * removes them from the checkout even if a setting is flipped back by hand.
 *
 * @param array<string,WC_Payment_Gateway> $gateways Available gateways.
 * @return array<string,WC_Payment_Gateway>
 */
add_filter(
	'woocommerce_available_payment_gateways',
	function ( array $gateways ): array {
		foreach ( NSL_GATEWAYS_RETIRED as $gateway ) {
			unset( $gateways[ $gateway ] );
		}

		return $gateways;
	},
	20
);

/**
 * Order total currently being paid, whether from the cart or a pay-for-order page.
 */
function nsl_checkout_total(): float {
	$order_id = absint( get_query_var( 'order-pay' ) );
	if ( $order_id ) {
		$order = wc_get_order( $order_id );
		if ( $order ) {
			return (float) $order->get_total();
		}
	}

	if ( function_exists( 'WC' ) && WC()->cart ) {
		return (float) WC()->cart->get_total( 'edit' );
	}

	return 0.0;
}

/**
 * Say what happens next, since the single method leaves the site to pay.
 */
add_action(
	'woocommerce_review_order_after_payment',
	function (): void {
		printf(
			'<p class="nsl-payment-note">%s</p>',
			esc_html__( 'You will be taken to our secure payment page to choose how you pay, then returned here with your order confirmation.', 'north-specs-labs' )
		);
	}
);
