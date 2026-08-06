<?php
/**
 * First-party conversion measurement.
 *
 * The theme already pushes a GA4-shaped data layer, but that only produces
 * numbers once a tag manager container exists. This records the same funnel
 * server-side into daily counters so the store has usable data today, with no
 * third party involved and nothing about an individual visitor stored: one row
 * per day per event name, holding a count and nothing else.
 *
 * @package NorthSpecsLabs
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Counter table name. */
function nsl_funnel_table(): string {
	global $wpdb;

	return $wpdb->prefix . 'nsl_funnel';
}

/** Create or update the counter table once per schema version. */
add_action(
	'init',
	function (): void {
		if ( '1.0.0' === get_option( 'nsl_funnel_schema' ) ) {
			return;
		}

		global $wpdb;
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';

		$charset = $wpdb->get_charset_collate();
		$table   = nsl_funnel_table();

		dbDelta(
			"CREATE TABLE {$table} (
				day date NOT NULL,
				event varchar(64) NOT NULL,
				hits bigint(20) unsigned NOT NULL DEFAULT 0,
				PRIMARY KEY  (day,event)
			) {$charset};"
		);

		update_option( 'nsl_funnel_schema', '1.0.0', false );
	},
	12
);

/** Requests that must never be counted as researcher activity. */
function nsl_funnel_should_skip(): bool {
	if ( wp_doing_cron() || wp_doing_ajax() || is_admin() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) ) {
		return true;
	}

	// Store staff browsing their own catalogue would distort every ratio.
	if ( current_user_can( 'manage_woocommerce' ) ) {
		return true;
	}

	$agent = strtolower( (string) ( $_SERVER['HTTP_USER_AGENT'] ?? '' ) );
	if ( '' === $agent ) {
		return true;
	}

	foreach ( array( 'bot', 'crawl', 'spider', 'slurp', 'headless', 'preview', 'monitor', 'pingdom', 'lighthouse', 'curl/', 'wget' ) as $needle ) {
		if ( str_contains( $agent, $needle ) ) {
			return true;
		}
	}

	return false;
}

/** Add one (or more) to a day's counter for an event. */
function nsl_funnel_record( string $event, int $hits = 1, bool $force = false ): void {
	if ( ! $force && nsl_funnel_should_skip() ) {
		return;
	}

	global $wpdb;
	$table = nsl_funnel_table();
	$event = substr( sanitize_key( $event ), 0, 64 );
	if ( '' === $event || $hits < 1 ) {
		return;
	}

	// phpcs:ignore WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL.InterpolatedNotPrepared
	$wpdb->query(
		$wpdb->prepare(
			"INSERT INTO {$table} (day, event, hits) VALUES (%s, %s, %d) ON DUPLICATE KEY UPDATE hits = hits + %d",
			current_time( 'Y-m-d' ),
			$event,
			$hits,
			$hits
		)
	);
}

/** Count an event at most once per visitor session. */
function nsl_funnel_record_once( string $event ): void {
	if ( ! function_exists( 'WC' ) || ! WC()->session ) {
		nsl_funnel_record( $event );

		return;
	}

	$key = 'nsl_seen_' . sanitize_key( $event );
	if ( WC()->session->get( $key ) ) {
		return;
	}

	WC()->session->set( $key, 1 );
	nsl_funnel_record( $event );
}

/* -------------------------------------------------------------------------
 * Funnel capture
 * ---------------------------------------------------------------------- */

add_action(
	'template_redirect',
	function (): void {
		if ( ! function_exists( 'is_product' ) ) {
			return;
		}

		if ( is_product() ) {
			nsl_funnel_record( 'product_view' );
			nsl_funnel_record_once( 'session_reached_product' );
		} elseif ( is_shop() || is_product_taxonomy() ) {
			nsl_funnel_record_once( 'catalogue_view' );
		} elseif ( is_cart() ) {
			nsl_funnel_record_once( 'cart_view' );
		} elseif ( is_checkout() && ! is_order_received_page() ) {
			nsl_funnel_record_once( 'checkout_start' );
		}
	},
	50
);

add_action(
	'woocommerce_add_to_cart',
	function (): void {
		nsl_funnel_record( 'add_to_cart' );
	},
	20
);

/** Submitted and paid are counted separately: an unpaid order is not revenue. */
add_action(
	'woocommerce_thankyou',
	function ( $order_id ): void {
		$order = wc_get_order( $order_id );
		if ( ! $order instanceof WC_Order || 'yes' === $order->get_meta( '_nsl_funnel_submitted' ) ) {
			return;
		}

		nsl_funnel_record( 'order_submitted', 1, true );
		nsl_funnel_record( 'order_' . str_replace( '-', '_', $order->get_payment_method() ?: 'unknown' ), 1, true );
		$order->update_meta_data( '_nsl_funnel_submitted', 'yes' );
		$order->save_meta_data();
	},
	5
);

add_action(
	'woocommerce_payment_complete',
	function ( $order_id ): void {
		$order = wc_get_order( $order_id );
		if ( ! $order instanceof WC_Order || 'yes' === $order->get_meta( '_nsl_funnel_paid' ) ) {
			return;
		}

		nsl_funnel_record( 'order_paid', 1, true );
		$order->update_meta_data( '_nsl_funnel_paid', 'yes' );
		$order->save_meta_data();
	}
);

/** Account and self-service events reuse the existing privacy-safe queue. */
add_action(
	'wp_footer',
	function (): void {
		$events = isset( $GLOBALS['nsl_analytics_events'] ) && is_array( $GLOBALS['nsl_analytics_events'] ) ? $GLOBALS['nsl_analytics_events'] : array();
		foreach ( $events as $event ) {
			if ( ! empty( $event['event'] ) ) {
				nsl_funnel_record( (string) $event['event'] );
			}
		}
	},
	97
);

/* -------------------------------------------------------------------------
 * Reporting
 * ---------------------------------------------------------------------- */

/** Totals per event over a window, newest day inclusive. */
function nsl_funnel_totals( int $days = 30 ): array {
	global $wpdb;
	$table = nsl_funnel_table();
	$since = gmdate( 'Y-m-d', time() - ( max( 1, $days ) * DAY_IN_SECONDS ) );

	// phpcs:ignore WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL.InterpolatedNotPrepared
	$rows = $wpdb->get_results( $wpdb->prepare( "SELECT event, SUM(hits) AS hits FROM {$table} WHERE day >= %s GROUP BY event", $since ), ARRAY_A );

	$totals = array();
	foreach ( (array) $rows as $row ) {
		$totals[ $row['event'] ] = (int) $row['hits'];
	}

	return $totals;
}

/** The ordered funnel steps the dashboard renders. */
function nsl_funnel_steps(): array {
	return array(
		'catalogue_view'  => __( 'Catalogue viewed', 'north-specs-labs' ),
		'product_view'    => __( 'Product viewed', 'north-specs-labs' ),
		'add_to_cart'     => __( 'Added to cart', 'north-specs-labs' ),
		'cart_view'       => __( 'Cart viewed', 'north-specs-labs' ),
		'checkout_start'  => __( 'Checkout started', 'north-specs-labs' ),
		'order_submitted' => __( 'Order submitted', 'north-specs-labs' ),
		'order_paid'      => __( 'Payment cleared', 'north-specs-labs' ),
	);
}
