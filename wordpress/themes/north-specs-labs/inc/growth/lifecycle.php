<?php
/**
 * Researcher lifecycle messaging: cart recovery, review requests, reordering.
 *
 * Canada's anti-spam law is the binding constraint here, not deliverability.
 * Every message in this file is sent only to a signed-in researcher with an
 * existing business relationship with the store, is factual rather than
 * promotional, names the sender, and carries a working one-click opt-out.
 * Anonymous visitors are never emailed, because there is no lawful basis and
 * no consent record for it.
 *
 * @package NorthSpecsLabs
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const NSL_OPTOUT_META  = 'nsl_lifecycle_optout';
const NSL_CART_TOUCHED = '_nsl_cart_touched';
const NSL_CART_SIGNAL  = '_nsl_cart_signature';
const NSL_CART_NUDGED  = '_nsl_cart_nudged';

/** Whether a lifecycle message type is switched on. */
function nsl_lifecycle_enabled( string $type ): bool {
	return 'yes' === get_option( 'nsl_lifecycle_' . $type, 'yes' );
}

/** A researcher who opted out is never messaged again by this module. */
function nsl_lifecycle_opted_out( int $user_id ): bool {
	return 'yes' === get_user_meta( $user_id, NSL_OPTOUT_META, true );
}

/** Signed opt-out link. No login required to honour a withdrawal of consent. */
function nsl_lifecycle_optout_url( int $user_id ): string {
	return add_query_arg(
		array(
			'nsl_optout' => $user_id,
			'token'      => substr( hash_hmac( 'sha256', 'optout|' . $user_id, wp_salt( 'auth' ) ), 0, 32 ),
		),
		home_url( '/' )
	);
}

add_action(
	'template_redirect',
	function (): void {
		// phpcs:disable WordPress.Security.NonceVerification.Recommended -- signed token, must work from an email client.
		if ( ! isset( $_GET['nsl_optout'], $_GET['token'] ) ) {
			return;
		}

		$user_id = absint( wp_unslash( $_GET['nsl_optout'] ) );
		$token   = sanitize_text_field( wp_unslash( $_GET['token'] ) );
		// phpcs:enable

		$expected = substr( hash_hmac( 'sha256', 'optout|' . $user_id, wp_salt( 'auth' ) ), 0, 32 );
		if ( ! $user_id || ! hash_equals( $expected, $token ) ) {
			return;
		}

		update_user_meta( $user_id, NSL_OPTOUT_META, 'yes' );
		wp_safe_redirect( add_query_arg( 'lifecycle', 'stopped', wc_get_page_permalink( 'myaccount' ) ) );
		exit;
	},
	1
);

/** Confirm the withdrawal whether the researcher lands signed in or signed out. */
function nsl_lifecycle_optout_notice(): void {
	// phpcs:ignore WordPress.Security.NonceVerification.Recommended
	if ( isset( $_GET['lifecycle'] ) && 'stopped' === sanitize_key( wp_unslash( $_GET['lifecycle'] ) ) ) {
		wc_print_notice( esc_html__( 'You will no longer receive cart, review or reordering reminders. Order confirmations and dispatch notices still apply.', 'north-specs-labs' ), 'success' );
	}
}
add_action( 'woocommerce_before_customer_login_form', 'nsl_lifecycle_optout_notice', 4 );
add_action( 'woocommerce_before_account_navigation', 'nsl_lifecycle_optout_notice', 4 );

/** Shared email chrome, including the opt-out required for every message here. */
function nsl_lifecycle_send( int $user_id, string $subject, string $title, string $intro, string $body, string $button_url = '', string $button_label = '' ): bool {
	$user = get_userdata( $user_id );
	if ( ! $user || ! is_email( $user->user_email ) || nsl_lifecycle_opted_out( $user_id ) ) {
		return false;
	}

	$footer = sprintf(
		'<p style="margin-top:26px;padding-top:14px;border-top:1px solid #ddd6c7;color:#4B5A4C;font-size:12px;line-height:1.6">%s<br><a href="%s" style="color:#1B573A">%s</a></p>',
		esc_html__( 'You are receiving this because you hold a North Specs researcher account. Products are supplied strictly for controlled in-vitro laboratory research.', 'north-specs-labs' ),
		esc_url( nsl_lifecycle_optout_url( $user_id ) ),
		esc_html__( 'Stop these reminders', 'north-specs-labs' )
	);

	$html = function_exists( 'nsl_growth_email_html' )
		? nsl_growth_email_html( $title, $intro, $body . $footer, $button_url, $button_label )
		: '<div>' . $intro . $body . $footer . '</div>';

	add_filter( 'wp_mail_content_type', 'nsl_email_content_type_html' );
	$sent = wp_mail( $user->user_email, $subject, $html );
	remove_filter( 'wp_mail_content_type', 'nsl_email_content_type_html' );

	return (bool) $sent;
}

/* -------------------------------------------------------------------------
 * Cart recovery
 * ---------------------------------------------------------------------- */

/** A stable fingerprint of what is in the cart right now. */
function nsl_cart_signature(): string {
	if ( ! function_exists( 'WC' ) || ! WC()->cart ) {
		return '';
	}

	$parts = array();
	foreach ( WC()->cart->get_cart() as $item ) {
		$parts[] = ( $item['variation_id'] ?: $item['product_id'] ) . 'x' . $item['quantity'];
	}
	sort( $parts );

	return $parts ? md5( implode( '|', $parts ) ) : '';
}

/** Remember when a signed-in researcher last touched their cart. */
function nsl_touch_cart(): void {
	$user_id = get_current_user_id();
	if ( ! $user_id || is_admin() ) {
		return;
	}

	$signature = nsl_cart_signature();
	if ( '' === $signature ) {
		delete_user_meta( $user_id, NSL_CART_TOUCHED );
		delete_user_meta( $user_id, NSL_CART_SIGNAL );

		return;
	}

	// A changed cart is fresh intent, so it earns a new reminder window.
	if ( get_user_meta( $user_id, NSL_CART_SIGNAL, true ) !== $signature ) {
		update_user_meta( $user_id, NSL_CART_SIGNAL, $signature );
		delete_user_meta( $user_id, NSL_CART_NUDGED );
	}

	update_user_meta( $user_id, NSL_CART_TOUCHED, time() );
}

add_action( 'woocommerce_add_to_cart', 'nsl_touch_cart', 30 );
add_action( 'woocommerce_cart_item_removed', 'nsl_touch_cart', 30 );
add_action( 'woocommerce_after_cart_item_quantity_update', 'nsl_touch_cart', 30 );

/** Clear the recovery state the moment an order exists. */
function nsl_clear_cart_state( $order_id ): void {
	$order = wc_get_order( $order_id );
	$user  = $order instanceof WC_Order ? $order->get_customer_id() : 0;
	if ( ! $user ) {
		return;
	}

	delete_user_meta( $user, NSL_CART_TOUCHED );
	delete_user_meta( $user, NSL_CART_SIGNAL );
	delete_user_meta( $user, NSL_CART_NUDGED );
}
add_action( 'woocommerce_checkout_order_processed', 'nsl_clear_cart_state', 10 );
add_action( 'woocommerce_store_api_checkout_order_processed', 'nsl_clear_cart_state', 10 );

/** Hourly sweep for carts left behind. */
add_action(
	'init',
	function (): void {
		if ( ! wp_next_scheduled( 'nsl_cart_sweep' ) ) {
			wp_schedule_event( time() + HOUR_IN_SECONDS, 'hourly', 'nsl_cart_sweep' );
		}
	},
	45
);

add_action(
	'nsl_cart_sweep',
	function (): void {
		if ( ! nsl_lifecycle_enabled( 'cart' ) ) {
			return;
		}

		global $wpdb;
		$cutoff = time() - (int) apply_filters( 'nsl_cart_reminder_delay', 4 * HOUR_IN_SECONDS );

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$candidates = $wpdb->get_col(
			$wpdb->prepare(
				"SELECT user_id FROM {$wpdb->usermeta} WHERE meta_key = %s AND CAST(meta_value AS UNSIGNED) < %d LIMIT 50",
				NSL_CART_TOUCHED,
				$cutoff
			)
		);

		foreach ( array_map( 'absint', (array) $candidates ) as $user_id ) {
			nsl_maybe_send_cart_reminder( $user_id );
		}
	}
);

/** One reminder per distinct abandoned cart, never a sequence. */
function nsl_maybe_send_cart_reminder( int $user_id ): void {
	$signature = (string) get_user_meta( $user_id, NSL_CART_SIGNAL, true );
	if ( '' === $signature || get_user_meta( $user_id, NSL_CART_NUDGED, true ) === $signature || nsl_lifecycle_opted_out( $user_id ) ) {
		return;
	}

	$cart = get_user_meta( $user_id, '_woocommerce_persistent_cart_' . get_current_blog_id(), true );
	$rows = array();
	foreach ( (array) ( $cart['cart'] ?? array() ) as $item ) {
		$product_id = absint( $item['variation_id'] ?? 0 ) ?: absint( $item['product_id'] ?? 0 );
		$product    = $product_id ? wc_get_product( $product_id ) : null;
		if ( $product && $product->is_purchasable() && $product->is_in_stock() ) {
			$rows[] = sprintf(
				'<tr><td style="padding:8px 0;border-bottom:1px solid #ddd6c7">%s</td><td style="padding:8px 0;border-bottom:1px solid #ddd6c7;text-align:right">&times;%d</td></tr>',
				esc_html( $product->get_name() ),
				absint( $item['quantity'] ?? 1 )
			);
		}
	}

	// Nothing left that can actually be bought is not worth an email.
	if ( ! $rows ) {
		delete_user_meta( $user_id, NSL_CART_TOUCHED );

		return;
	}

	$sent = nsl_lifecycle_send(
		$user_id,
		__( 'Your North Specs cart is still saved', 'north-specs-labs' ),
		__( 'Your cart is still saved', 'north-specs-labs' ),
		__( 'The items below are held in your researcher account. Nothing has been ordered and nothing has been charged.', 'north-specs-labs' ),
		'<table style="width:100%;border-collapse:collapse;margin:18px 0;font-size:14px">' . implode( '', $rows ) . '</table>'
		. '<p style="font-size:13px;color:#4B5A4C">Availability and pricing are confirmed at checkout. If you were waiting on batch documentation for a specific lot, reply and research support will send it.</p>',
		wc_get_cart_url(),
		__( 'Open my cart', 'north-specs-labs' )
	);

	if ( $sent ) {
		update_user_meta( $user_id, NSL_CART_NUDGED, $signature );
		nsl_funnel_record( 'cart_reminder_sent', 1, true );
	}
}

/* -------------------------------------------------------------------------
 * Post-purchase: reviews and reordering
 * ---------------------------------------------------------------------- */

add_action(
	'woocommerce_order_status_completed',
	function ( $order_id ): void {
		if ( ! function_exists( 'as_schedule_single_action' ) ) {
			return;
		}

		if ( nsl_lifecycle_enabled( 'review' ) ) {
			as_schedule_single_action( time() + 10 * DAY_IN_SECONDS, 'nsl_review_request', array( (int) $order_id ), 'north-specs' );
		}
		if ( nsl_lifecycle_enabled( 'reorder' ) ) {
			as_schedule_single_action( time() + 75 * DAY_IN_SECONDS, 'nsl_reorder_nudge', array( (int) $order_id ), 'north-specs' );
		}
	},
	30
);

add_action(
	'nsl_review_request',
	function ( $order_id ): void {
		$order = wc_get_order( $order_id );
		if ( ! $order instanceof WC_Order || ! $order->get_customer_id() ) {
			return;
		}

		$links = array();
		foreach ( $order->get_items() as $item ) {
			$product = $item instanceof WC_Order_Item_Product ? $item->get_product() : null;
			if ( $product ) {
				$links[] = sprintf(
					'<li style="margin-bottom:6px"><a href="%s" style="color:#1B573A">%s</a></li>',
					esc_url( $product->get_permalink() . '#reviews' ),
					esc_html( $product->get_name() )
				);
			}
		}

		if ( ! $links ) {
			return;
		}

		nsl_lifecycle_send(
			$order->get_customer_id(),
			__( 'How did the material perform in your laboratory?', 'north-specs-labs' ),
			__( 'A short note on your last order', 'north-specs-labs' ),
			sprintf(
				/* translators: %s: order number. */
				__( 'Order #%s was completed. If the material has been through your workflow, a factual note on handling, solubility or analytical results helps other researchers evaluate the same lot.', 'north-specs-labs' ),
				$order->get_order_number()
			),
			'<ul style="padding-left:18px;margin:16px 0">' . implode( '', $links ) . '</ul>'
			. '<p style="font-size:13px;color:#4B5A4C">Reviews are published from verified purchases only and are moderated. Please keep notes to laboratory observations — we cannot publish anything describing human or veterinary use.</p>'
		);
		nsl_funnel_record( 'review_request_sent', 1, true );
	}
);

add_action(
	'nsl_reorder_nudge',
	function ( $order_id ): void {
		$order = wc_get_order( $order_id );
		if ( ! $order instanceof WC_Order || ! $order->get_customer_id() ) {
			return;
		}

		// A researcher who has already ordered since does not need reminding.
		$created = $order->get_date_created();
		$later   = $created ? wc_get_orders(
			array(
				'customer_id'  => $order->get_customer_id(),
				'limit'        => 1,
				'return'       => 'ids',
				'exclude'      => array( $order->get_id() ),
				'date_created' => '>' . $created->getTimestamp(),
			)
		) : array();
		if ( $later ) {
			return;
		}

		$rows = array();
		foreach ( $order->get_items() as $item ) {
			$product = $item instanceof WC_Order_Item_Product ? $item->get_product() : null;
			if ( $product && $product->is_purchasable() && $product->is_in_stock() ) {
				$rows[] = sprintf( '<li style="margin-bottom:6px">%s</li>', esc_html( $item->get_name() ) );
			}
		}

		if ( ! $rows ) {
			return;
		}

		nsl_lifecycle_send(
			$order->get_customer_id(),
			__( 'Reordering from your last North Specs batch', 'north-specs-labs' ),
			__( 'Time to restock?', 'north-specs-labs' ),
			__( 'Your last order was about eleven weeks ago. Everything below is still catalogued and in stock, and reordering keeps your laboratory and billing details as they are.', 'north-specs-labs' ),
			'<ul style="padding-left:18px;margin:16px 0">' . implode( '', $rows ) . '</ul>',
			// The reorder action itself is nonce-protected, so the email links to
			// the order where that button lives rather than carrying a stale nonce.
			$order->get_view_order_url(),
			__( 'Open the order and reorder', 'north-specs-labs' )
		);
		nsl_funnel_record( 'reorder_nudge_sent', 1, true );
	}
);
