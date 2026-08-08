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

/** Card2Crypto channel that backs the "Debit/Credit Cards" choice. */
const NSL_GATEWAY_CARD = 'card2crypto-instant-payment-gateway-hostedcard2crypto';

/** Card2Crypto channel that backs the "Interac" choice. */
const NSL_GATEWAY_INTERAC = 'card2crypto-instant-payment-gateway-interac';

/** Offline gateways that must never appear again. */
const NSL_GATEWAYS_RETIRED = array( 'bacs', 'cheque', 'cod' );

/**
 * The provider rejects Interac orders below this amount inside process_payment,
 * which would strand the customer on an error after they press Place order.
 * Mirrored here so the method is withdrawn before it can be chosen.
 */
const NSL_INTERAC_MINIMUM = 100.0;

/**
 * One-time payment configuration.
 *
 * Written through the options API so the values stay editable in
 * WooCommerce > Settings > Payments. Bump the version to re-apply.
 */
add_action(
	'init',
	function (): void {
		if ( '2.0.0' === get_option( 'nsl_payments_version' ) ) {
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
				'title'       => __( 'Debit/Credit Cards', 'north-specs-labs' ),
				'description' => __( 'Pay by Visa, Mastercard or American Express. You are taken to our payment provider to enter your card details, then returned here.', 'north-specs-labs' ),
			)
		);

		$configure(
			NSL_GATEWAY_INTERAC,
			array(
				'enabled'     => 'yes',
				'title'       => __( 'Interac', 'north-specs-labs' ),
				'description' => __( 'Pay from a Canadian bank account by Interac e-Transfer. Available on orders of CA$100 or more.', 'north-specs-labs' ),
			)
		);

		// Retire the Stripe and MoonPay channels: the card choice is the router.
		foreach ( array( 'card2crypto-instant-payment-gateway-stripe', 'card2crypto-instant-payment-gateway-moonpay' ) as $gateway ) {
			$configure( $gateway, array( 'enabled' => 'no' ) );
		}

		// Retire the offline methods.
		foreach ( NSL_GATEWAYS_RETIRED as $gateway ) {
			$configure( $gateway, array( 'enabled' => 'no' ) );
		}

		update_option(
			'woocommerce_gateway_order',
			array(
				NSL_GATEWAY_CARD    => 0,
				NSL_GATEWAY_INTERAC => 1,
			)
		);

		update_option( 'nsl_payments_version', '2.0.0', false );
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

		if ( is_admin() && ! wp_doing_ajax() ) {
			return $gateways;
		}

		if ( isset( $gateways[ NSL_GATEWAY_INTERAC ] ) && nsl_checkout_total() < nsl_interac_minimum() ) {
			unset( $gateways[ NSL_GATEWAY_INTERAC ] );
		}

		return $gateways;
	},
	20
);

/**
 * The Interac floor, filterable so it can follow the provider if it changes.
 */
function nsl_interac_minimum(): float {
	return (float) apply_filters( 'nsl_interac_minimum', NSL_INTERAC_MINIMUM );
}

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
 * Explain the withheld Interac option rather than letting it vanish silently.
 *
 * Shown only when the basket is close enough that topping up is realistic.
 */
add_action(
	'woocommerce_review_order_after_payment',
	function (): void {
		$total = nsl_checkout_total();
		$floor = nsl_interac_minimum();

		if ( $total <= 0 || $total >= $floor ) {
			return;
		}

		printf(
			'<p class="nsl-payment-note">%s</p>',
			esc_html(
				sprintf(
					/* translators: %s: formatted currency shortfall, e.g. CA$100.00 */
					__( 'Interac e-Transfer becomes available on orders of %s or more.', 'north-specs-labs' ),
					html_entity_decode( wp_strip_all_tags( wc_price( $floor ) ), ENT_QUOTES, 'UTF-8' )
				)
			)
		);
	}
);
