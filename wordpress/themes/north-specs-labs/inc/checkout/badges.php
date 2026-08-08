<?php
/**
 * Accepted payment marks.
 *
 * Checkout offers a single "Secure Checkout" method, so the marks are what
 * tell a buyer what they can actually pay with before they commit. They are
 * inline SVG: no external requests, they stay sharp at any size, and they
 * inherit the page's own colours where a brand does not dictate one.
 *
 * Card scheme marks are reproduced only to indicate acceptance, which is what
 * they exist for. Swap any of them for an official asset through the
 * `nsl_payment_marks` filter without touching this file.
 *
 * @package NorthSpecsLabs
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * The marks shown, in order.
 *
 * @return array<string,array{label:string,svg:string}>
 */
function nsl_payment_marks(): array {
	$marks = array(
		'visa'       => array(
			'label' => __( 'Visa', 'north-specs-labs' ),
			'svg'   => '<svg viewBox="0 0 48 30" role="img" aria-hidden="true" focusable="false">'
				. '<rect width="48" height="30" rx="4" fill="#fff" stroke="#DDD6C7"/>'
				. '<path fill="#1434CB" d="M20.4 20.3h-2.6l1.6-9.6h2.6l-1.6 9.6Zm9.4-9.4a6.6 6.6 0 0 0-2.3-.4c-2.6 0-4.4 1.3-4.4 3.2 0 1.4 1.3 2.2 2.4 2.6 1 .5 1.4.8 1.4 1.2 0 .6-.8.9-1.5.9a5.2 5.2 0 0 1-2.4-.5l-.3-.2-.4 2.2c.6.3 1.7.5 2.9.5 2.7 0 4.5-1.3 4.5-3.3 0-1.1-.7-2-2.3-2.7-1-.5-1.6-.8-1.6-1.2 0-.4.5-.8 1.6-.8.9 0 1.5.2 2 .4l.3.1.4-2Zm6.7-.2h-2c-.6 0-1.1.2-1.4.9l-3.9 8.7h2.7l.6-1.5h3.4l.3 1.5h2.4l-2.1-9.6Zm-3.3 6.2 1.1-2.9.4-1 .2 1 .6 2.9h-2.3ZM16.2 10.7l-2.6 6.6-.3-1.4a7.4 7.4 0 0 0-3.5-4l2.4 8.4h2.7l4-9.6h-2.7Z"/>'
				. '<path fill="#F7B600" d="M11.3 10.7H7.2l-.1.3c3.2.8 5.3 2.7 6.2 5l-.9-4.4c-.1-.6-.6-.9-1.1-.9Z"/>'
				. '</svg>',
		),
		'mastercard' => array(
			'label' => __( 'Mastercard', 'north-specs-labs' ),
			'svg'   => '<svg viewBox="0 0 48 30" role="img" aria-hidden="true" focusable="false">'
				. '<rect width="48" height="30" rx="4" fill="#fff" stroke="#DDD6C7"/>'
				. '<circle cx="19" cy="15" r="7.5" fill="#EB001B"/>'
				. '<circle cx="29" cy="15" r="7.5" fill="#F79E1B"/>'
				. '<path fill="#FF5F00" d="M24 9.2a7.5 7.5 0 0 0 0 11.6 7.5 7.5 0 0 0 0-11.6Z"/>'
				. '</svg>',
		),
		'amex'       => array(
			'label' => __( 'American Express', 'north-specs-labs' ),
			'svg'   => '<svg viewBox="0 0 48 30" role="img" aria-hidden="true" focusable="false">'
				. '<rect width="48" height="30" rx="4" fill="#1F72CD"/>'
				. '<path fill="#fff" d="M9.6 11.4h3.1l.7 1.7v-1.7h3.9l.6 1.7.6-1.7h9.7v.8c.5-.5 1.2-.8 2.1-.8h3.4l.7 1.7v-1.7h3.3l.9 1.4v-1.4h3.3v7.2h-3.3l-.9-1.5v1.5h-4.6l-.5-1.2h-1.2l-.5 1.2h-3.3c-.9 0-1.6-.3-2.1-.8v.8h-5l-.5-1.2h-1.2l-.5 1.2H9.6l3-7.2Zm2 1.5-1.7 4.2h1.2l.4-1h2.1l.4 1h1.2l-1.7-4.2h-1.9Zm.3 2.3.6-1.5.6 1.5h-1.2Zm5 1.9v-4.2h1.8l1 2.8 1-2.8h1.8v4.2h-1.1v-3l-1.2 3h-1l-1.2-3v3h-1.1Zm7.2 0v-4.2h3.5v1h-2.4v.6h2.3v1h-2.3v.6h2.4v1h-3.5Zm5-4.2h2.4c1 0 1.6.5 1.6 1.3 0 .6-.4 1-.9 1.2l1.1 1.7h-1.3l-.9-1.5h-.9v1.5h-1.1v-4.2Zm1.1 1v.8h1.1c.4 0 .6-.2.6-.4 0-.3-.2-.4-.6-.4h-1.1Zm4.8-1-1.7 4.2h1.2l.4-1h2.1l.4 1h1.2l-1.7-4.2h-1.9Zm.3 2.3.6-1.5.6 1.5h-1.2Z"/>'
				. '</svg>',
		),
		'interac'    => array(
			'label' => __( 'Interac', 'north-specs-labs' ),
			'svg'   => '<svg viewBox="0 0 48 30" role="img" aria-hidden="true" focusable="false">'
				. '<rect width="48" height="30" rx="4" fill="#fff" stroke="#DDD6C7"/>'
				. '<path fill="#FFB400" d="M33.6 9.6c2.9 0 5.2 1.3 5.2 3.4 0 2.4-2.6 3.9-5.6 5.3l-1-1.8c2.2-1 3.9-2 3.9-3.1 0-.8-.9-1.3-2.2-1.3-1 0-1.9.2-2.7.6l-.8-1.9a9 9 0 0 1 3.2-1.2Z"/>'
				. '<path fill="#1F1F1F" d="M9.2 11h2.4v8.4H9.2V11Zm4 8.4V11h2.3l3.2 4.9V11h2.3v8.4h-2.2l-3.3-5v5h-2.3Zm10.4 0V11h6v1.9h-3.7v1.3h3.5V16h-3.5v1.5h3.8v1.9h-6.1Z"/>'
				. '</svg>',
		),
		'crypto'     => array(
			'label' => __( 'Cryptocurrency', 'north-specs-labs' ),
			'svg'   => '<svg viewBox="0 0 48 30" role="img" aria-hidden="true" focusable="false">'
				. '<rect width="48" height="30" rx="4" fill="#fff" stroke="#DDD6C7"/>'
				. '<circle cx="19.5" cy="15" r="6.5" fill="#F7931A"/>'
				. '<path fill="#fff" d="M22.3 14.1c.1-.8-.5-1.2-1.3-1.5l.3-1-.7-.2-.2 1-.5-.1.2-1-.6-.2-.3 1-1.2-.3-.2.7s.5.1.4.1c.2.1.3.2.2.4l-.7 2.8c0 .1-.1.2-.3.1 0 0-.4-.1-.4-.1l-.4.8 1.2.3-.3 1 .6.2.3-1 .5.1-.3 1 .7.2.2-1c1.1.2 2 .1 2.3-.9.3-.8 0-1.3-.6-1.6.4-.1.7-.4.8-1Zm-1.5 2.2c-.2.8-1.5.4-2 .3l.3-1.4c.5.2 1.9.3 1.7 1.1Zm.2-2.2c-.2.8-1.3.4-1.7.3l.3-1.3c.4.1 1.6.3 1.4 1Z"/>'
				. '<circle cx="30" cy="15" r="6.5" fill="#627EEA"/>'
				. '<path fill="#fff" fill-opacity=".7" d="m30 10.2-.1.4v5.1l.1.1 2.6-1.5-2.6-4.1Z"/>'
				. '<path fill="#fff" d="m30 10.2-2.6 4.1 2.6 1.5v-5.6Z"/>'
				. '<path fill="#fff" fill-opacity=".7" d="m30 16.9-.1.1v1.8l.1.2 2.6-3.7-2.6 1.6Z"/>'
				. '<path fill="#fff" d="M30 19v-2.1l-2.6-1.6L30 19Z"/>'
				. '</svg>',
		),
	);

	return (array) apply_filters( 'nsl_payment_marks', $marks );
}

/**
 * The strip itself.
 *
 * @param string $heading Optional heading above the marks.
 */
function nsl_payment_marks_html( string $heading = '' ): string {
	$marks = nsl_payment_marks();

	if ( ! $marks ) {
		return '';
	}

	$items = '';

	foreach ( $marks as $key => $mark ) {
		$items .= sprintf(
			'<li class="nsl-marks__item nsl-marks__item--%1$s"><span class="nsl-marks__art">%2$s</span><span class="screen-reader-text">%3$s</span></li>',
			esc_attr( $key ),
			$mark['svg'],
			esc_html( $mark['label'] )
		);
	}

	return sprintf(
		'<div class="nsl-marks">%1$s<ul class="nsl-marks__list" aria-label="%2$s">%3$s</ul></div>',
		$heading ? '<p class="nsl-marks__heading">' . esc_html( $heading ) . '</p>' : '',
		esc_attr__( 'Accepted payment methods', 'north-specs-labs' ),
		$items
	);
}

/** Under the payment method, where the decision is being made. */
add_action(
	'woocommerce_review_order_after_payment',
	function (): void {
		echo nsl_payment_marks_html( __( 'Accepted at our secure payment page', 'north-specs-labs' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- built from escaped parts.
	},
	20
);

/** And on the cart, before they commit to checking out. */
add_action(
	'woocommerce_after_cart_totals',
	function (): void {
		echo nsl_payment_marks_html( __( 'Accepted at checkout', 'north-specs-labs' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- built from escaped parts.
	},
	20
);

/** Available anywhere else through a shortcode. */
add_shortcode(
	'nsl_payment_marks',
	function ( $atts ): string {
		$atts = shortcode_atts( array( 'heading' => '' ), $atts, 'nsl_payment_marks' );

		return nsl_payment_marks_html( (string) $atts['heading'] );
	}
);

/** The marks appear on cart and checkout, so ride along with those styles. */
add_action(
	'wp_enqueue_scripts',
	function (): void {
		if ( ! function_exists( 'is_cart' ) || ( ! is_cart() && ! is_checkout() ) ) {
			return;
		}

		$css = NSL_THEME_DIR . '/assets/css/checkout.css';

		wp_enqueue_style(
			'nsl-checkout',
			NSL_THEME_URI . '/assets/css/checkout.css',
			array( 'nsl-main' ),
			file_exists( $css ) ? (string) filemtime( $css ) : NSL_THEME_VERSION
		);
	},
	22
);
