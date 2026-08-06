<?php
/**
 * Privacy-safe self-service analytics.
 *
 * Every event describes what happened, never who it happened to. No email,
 * name, organization, role, address, order number, lot identifier or document
 * title is ever placed on the data layer. Deferred events (those that survive
 * a redirect) are held in a short transient keyed by a salted hash so no
 * identifier is stored either.
 *
 * @package NorthSpecsLabs
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Queue an event for the current page render. */
function nsl_analytics_push( string $event, array $params = array() ): void {
	if ( ! isset( $GLOBALS['nsl_analytics_events'] ) || ! is_array( $GLOBALS['nsl_analytics_events'] ) ) {
		$GLOBALS['nsl_analytics_events'] = array();
	}

	$GLOBALS['nsl_analytics_events'][] = array_merge( array( 'event' => $event ), nsl_analytics_clean_params( $params ) );
}

/**
 * Parameter names that must never reach an analytics platform, whatever a
 * future call site passes. The guard is deliberately broader than the events
 * this theme emits today so a later addition cannot quietly leak.
 */
function nsl_analytics_blocked_keys(): array {
	return array(
		'address', 'city', 'company', 'customer', 'customer_id', 'email', 'first_name', 'ip',
		'last_name', 'lot', 'name', 'order_id', 'order_key', 'order_number', 'organization',
		'phone', 'postcode', 'reference', 'role', 'sku', 'tracking', 'tracking_number',
		'user', 'user_id', 'username',
	);
}

/** Only scalar, non-identifying values reach the data layer. */
function nsl_analytics_clean_params( array $params ): array {
	$blocked = nsl_analytics_blocked_keys();
	$clean   = array();

	foreach ( $params as $key => $value ) {
		$key = sanitize_key( (string) $key );
		if ( 'event' === $key || ! is_scalar( $value ) || in_array( $key, $blocked, true ) ) {
			continue;
		}

		if ( is_bool( $value ) ) {
			$clean[ $key ] = $value;
			continue;
		}

		if ( is_numeric( $value ) ) {
			$clean[ $key ] = $value + 0;
			continue;
		}

		$text = sanitize_text_field( (string) $value );

		// Anything shaped like a contact detail is dropped rather than trimmed.
		if ( is_email( $text ) || preg_match( '/[\w.+-]+@[\w-]+\.[\w.]+/', $text ) || preg_match( '/\d{7,}/', $text ) ) {
			continue;
		}

		$clean[ $key ] = $text;
	}

	return $clean;
}

/** Anonymous, salted bucket used only to carry an event across one redirect. */
function nsl_analytics_bucket(): string {
	$user_id = get_current_user_id();
	$seed    = $user_id ? 'u' . $user_id : 'a' . ( $_SERVER['REMOTE_ADDR'] ?? '' ) . ( $_SERVER['HTTP_USER_AGENT'] ?? '' );

	return 'nsl_ev_' . substr( hash_hmac( 'sha256', $seed, wp_salt( 'nonce' ) ), 0, 24 );
}

/** Queue an event to fire on the next page load, surviving a redirect. */
function nsl_analytics_push_next( string $event, array $params = array() ): void {
	$bucket  = nsl_analytics_bucket();
	$pending = get_transient( $bucket );
	$pending = is_array( $pending ) ? $pending : array();

	$pending[] = array_merge( array( 'event' => $event ), nsl_analytics_clean_params( $params ) );
	set_transient( $bucket, array_slice( $pending, -5 ), 5 * MINUTE_IN_SECONDS );
}

/** Flush queued and deferred events onto the shared data layer. */
add_action(
	'wp_footer',
	function (): void {
		$events = isset( $GLOBALS['nsl_analytics_events'] ) && is_array( $GLOBALS['nsl_analytics_events'] ) ? $GLOBALS['nsl_analytics_events'] : array();

		$bucket   = nsl_analytics_bucket();
		$deferred = get_transient( $bucket );
		if ( is_array( $deferred ) && $deferred ) {
			$events = array_merge( $deferred, $events );
			delete_transient( $bucket );
		}

		if ( ! $events ) {
			return;
		}

		echo '<script>window.dataLayer=window.dataLayer||[];' . "\n";
		foreach ( $events as $event ) {
			echo 'window.dataLayer.push(' . wp_json_encode( $event ) . ');';
		}
		echo '</script>' . "\n";

		$GLOBALS['nsl_analytics_events'] = array();
	},
	98
);

/* -------------------------------------------------------------------------
 * Server-side events
 * ---------------------------------------------------------------------- */

/** Sign-in completion. Fires for the account form, checkout and wp-login alike. */
add_action(
	'wp_login',
	function ( string $user_login, WP_User $user ): void {
		nsl_analytics_push_next(
			'account_sign_in',
			array(
				'method'       => 'password',
				'is_customer'  => in_array( 'customer', (array) $user->roles, true ),
				'is_privileged' => user_can( $user, 'manage_woocommerce' ),
			)
		);
	},
	10,
	2
);

/** Registration completion, distinguishing the account page from checkout. */
add_action(
	'woocommerce_created_customer',
	function ( int $customer_id, array $new_customer_data, bool $password_generated ): void {
		nsl_analytics_push_next(
			'account_registration',
			array(
				'source'             => is_checkout() ? 'checkout' : 'account_page',
				'password_generated' => $password_generated,
			)
		);
	},
	20,
	3
);

/** Password-reset request, from either the account form or wp-login. */
add_action(
	'retrieve_password_key',
	function (): void {
		nsl_analytics_push_next( 'account_password_reset_requested', array( 'source' => is_account_page() ? 'account_page' : 'wp_login' ) );
	},
	10,
	0
);

/** Guest order lookup outcome on the tracking page. */
function nsl_analytics_order_lookup( string $result, string $reason = '' ): void {
	nsl_analytics_push(
		'order_lookup',
		array_filter(
			array(
				'result' => $result,
				'reason' => $reason,
			)
		)
	);
}

add_action(
	'woocommerce_track_order',
	function ( $order_id ): void {
		nsl_analytics_order_lookup( 'success' );
		$order = wc_get_order( $order_id );
		if ( $order instanceof WC_Order ) {
			nsl_analytics_order_view( $order, 'guest_tracking' );
		}
	}
);

/** Order-detail view, from the account or from a guest tracking lookup. */
function nsl_analytics_order_view( WC_Order $order, string $surface ): void {
	nsl_analytics_push(
		'order_detail_view',
		array(
			'surface'              => $surface,
			'order_status'         => $order->get_status(),
			'awaiting_payment'     => nsl_order_awaiting_payment( $order ),
			'has_tracking'         => (bool) nsl_order_shipments( $order ),
			'has_batch_documents'  => nsl_order_has_batch_documents( $order ),
			'item_count'           => (int) $order->get_item_count(),
		)
	);
}

/** Reorder completion, emitted after WooCommerce refills the cart. */
add_action(
	'woocommerce_ordered_again',
	function ( $order_id ): void {
		$order = wc_get_order( $order_id );
		nsl_analytics_push_next(
			'order_reorder',
			array(
				'item_count'   => $order instanceof WC_Order ? (int) $order->get_item_count() : 0,
				'order_status' => $order instanceof WC_Order ? $order->get_status() : '',
			)
		);
	}
);
