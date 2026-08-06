<?php
/**
 * Shipment tracking storage and presentation.
 *
 * The ShipStation integration only writes an order note when the WooCommerce
 * Shipment Tracking extension is absent, so tracking never reaches the
 * customer account. This module captures the ShipStation ship-notify payload
 * into structured order meta, backfills tracking already recorded in notes,
 * and exposes it to the account, tracking and receipt views.
 *
 * @package NorthSpecsLabs
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const NSL_SHIPMENTS_META = '_nsl_shipments';

/** Known carriers and their public tracking endpoints. */
function nsl_carriers(): array {
	return array(
		'canada-post' => array(
			'label'   => __( 'Canada Post', 'north-specs-labs' ),
			'match'   => array( 'canada post', 'canadapost', 'postes canada', 'poste canada' ),
			'url'     => 'https://www.canadapost-postescanada.ca/track-reperage/en#/resultList?searchFor=%s',
		),
		'purolator'   => array(
			'label' => __( 'Purolator', 'north-specs-labs' ),
			'match' => array( 'purolator' ),
			'url'   => 'https://www.purolator.com/en/shipping/tracker?pin=%s',
		),
		'ups'         => array(
			'label' => __( 'UPS', 'north-specs-labs' ),
			'match' => array( 'ups' ),
			'url'   => 'https://www.ups.com/track?loc=en_CA&tracknum=%s',
		),
		'fedex'       => array(
			'label' => __( 'FedEx', 'north-specs-labs' ),
			'match' => array( 'fedex', 'federal express' ),
			'url'   => 'https://www.fedex.com/fedextrack/?trknbr=%s',
		),
		'dhl'         => array(
			'label' => __( 'DHL', 'north-specs-labs' ),
			'match' => array( 'dhl' ),
			'url'   => 'https://www.dhl.com/ca-en/home/tracking/tracking-express.html?submit=1&tracking-id=%s',
		),
		'canpar'      => array(
			'label' => __( 'Canpar Express', 'north-specs-labs' ),
			'match' => array( 'canpar' ),
			'url'   => 'https://www.canpar.com/en/track/TrackingAction.do?locale=en&type=0&reference=%s',
		),
		'gls'         => array(
			'label' => __( 'GLS Canada', 'north-specs-labs' ),
			'match' => array( 'gls', 'dicom' ),
			'url'   => 'https://gls-group.com/CA/en/parcel-tracking?match=%s',
		),
		'intelcom'    => array(
			'label' => __( 'Intelcom / Dragonfly', 'north-specs-labs' ),
			'match' => array( 'intelcom', 'dragonfly' ),
			'url'   => 'https://intelcomexpress.com/en/tracking/?tracking_number=%s',
		),
		'usps'        => array(
			'label' => __( 'USPS', 'north-specs-labs' ),
			'match' => array( 'usps', 'united states postal' ),
			'url'   => 'https://tools.usps.com/go/TrackConfirmAction?tLabels=%s',
		),
	);
}

/**
 * Resolve a free-text carrier name to a known carrier.
 *
 * Unknown carriers keep their supplied label and get no tracking link: a wrong
 * carrier link is worse than no link on a laboratory delivery record.
 */
function nsl_resolve_carrier( string $carrier ): array {
	$needle = strtolower( trim( $carrier ) );

	foreach ( nsl_carriers() as $slug => $definition ) {
		foreach ( $definition['match'] as $fragment ) {
			if ( '' !== $needle && str_contains( $needle, $fragment ) ) {
				return array(
					'slug'  => $slug,
					'label' => $definition['label'],
					'url'   => $definition['url'],
				);
			}
		}
	}

	return array(
		'slug'  => $needle ? sanitize_title( $needle ) : 'unknown',
		'label' => '' !== trim( $carrier ) ? trim( $carrier ) : __( 'Carrier not stated', 'north-specs-labs' ),
		'url'   => '',
	);
}

/** Public tracking URL for a carrier and number, or an empty string. */
function nsl_carrier_tracking_url( string $carrier, string $number ): string {
	$resolved = nsl_resolve_carrier( $carrier );
	if ( ! $resolved['url'] || '' === trim( $number ) ) {
		return '';
	}

	return sprintf( $resolved['url'], rawurlencode( trim( $number ) ) );
}

/**
 * Record a shipment against an order.
 *
 * Idempotent on tracking number so a repeated ShipStation notification, a
 * backfill pass and a manual entry cannot produce duplicates.
 */
function nsl_add_order_shipment( WC_Order $order, string $number, string $carrier = '', int $shipped_at = 0, string $source = 'manual' ): bool {
	$number = trim( wc_clean( $number ) );
	if ( '' === $number ) {
		return false;
	}

	$shipments = nsl_stored_shipments( $order );
	foreach ( $shipments as $shipment ) {
		if ( strcasecmp( (string) $shipment['number'], $number ) === 0 ) {
			return false;
		}
	}

	$shipments[] = array(
		'number'     => $number,
		'carrier'    => trim( wc_clean( $carrier ) ),
		'shipped_at' => $shipped_at ?: time(),
		'source'     => sanitize_key( $source ),
	);

	$order->update_meta_data( NSL_SHIPMENTS_META, $shipments );
	$order->save_meta_data();

	return true;
}

/** Remove a shipment by tracking number. */
function nsl_remove_order_shipment( WC_Order $order, string $number ): void {
	$shipments = array_values(
		array_filter(
			nsl_stored_shipments( $order ),
			static fn( array $shipment ): bool => strcasecmp( (string) $shipment['number'], trim( $number ) ) !== 0
		)
	);

	$order->update_meta_data( NSL_SHIPMENTS_META, $shipments );
	$order->save_meta_data();
}

/** Raw stored shipments, normalised to the expected shape. */
function nsl_stored_shipments( WC_Order $order ): array {
	$stored = $order->get_meta( NSL_SHIPMENTS_META );
	if ( ! is_array( $stored ) ) {
		return array();
	}

	$shipments = array();
	foreach ( $stored as $shipment ) {
		if ( ! is_array( $shipment ) || empty( $shipment['number'] ) ) {
			continue;
		}
		$shipments[] = array(
			'number'     => (string) $shipment['number'],
			'carrier'    => (string) ( $shipment['carrier'] ?? '' ),
			'shipped_at' => (int) ( $shipment['shipped_at'] ?? 0 ),
			'source'     => (string) ( $shipment['source'] ?? 'manual' ),
		);
	}

	return $shipments;
}

/**
 * Every shipment on an order, ready for display.
 *
 * Reads our own store first, then the meta written by the WooCommerce Shipment
 * Tracking extension in case it is ever installed alongside this theme.
 */
function nsl_order_shipments( WC_Order $order ): array {
	$raw = nsl_stored_shipments( $order );

	$legacy_items = $order->get_meta( '_wc_shipment_tracking_items' );
	if ( is_array( $legacy_items ) ) {
		foreach ( $legacy_items as $legacy ) {
			$raw[] = array(
				'number'     => (string) ( $legacy['tracking_number'] ?? '' ),
				'carrier'    => (string) ( $legacy['tracking_provider'] ?? $legacy['custom_tracking_provider'] ?? '' ),
				'shipped_at' => (int) ( $legacy['date_shipped'] ?? 0 ),
				'source'     => 'shipment-tracking',
			);
		}
	}

	$legacy_number = trim( (string) $order->get_meta( '_tracking_number' ) );
	if ( '' !== $legacy_number ) {
		$raw[] = array(
			'number'     => $legacy_number,
			'carrier'    => (string) $order->get_meta( '_tracking_provider' ),
			'shipped_at' => (int) $order->get_meta( '_date_shipped' ),
			'source'     => 'shipment-tracking',
		);
	}

	$shipments = array();
	$seen      = array();
	foreach ( $raw as $shipment ) {
		$number = trim( (string) $shipment['number'] );
		$key    = strtolower( $number );
		if ( '' === $number || isset( $seen[ $key ] ) ) {
			continue;
		}
		$seen[ $key ] = true;

		$carrier     = nsl_resolve_carrier( (string) $shipment['carrier'] );
		$shipments[] = array(
			'number'        => $number,
			'carrier_slug'  => $carrier['slug'],
			'carrier_label' => $carrier['label'],
			'url'           => nsl_carrier_tracking_url( (string) $shipment['carrier'], $number ),
			'shipped_at'    => (int) $shipment['shipped_at'],
			'source'        => (string) $shipment['source'],
		);
	}

	return $shipments;
}

/** Capture tracking the moment ShipStation reports a shipment. */
add_action(
	'woocommerce_shipstation_shipnotify',
	function ( $order, $tracking_data ): void {
		if ( ! $order instanceof WC_Order || ! is_array( $tracking_data ) ) {
			return;
		}

		$shipped_at = 0;
		if ( ! empty( $tracking_data['ship_date'] ) ) {
			$shipped_at = is_numeric( $tracking_data['ship_date'] ) ? (int) $tracking_data['ship_date'] : (int) strtotime( (string) $tracking_data['ship_date'] );
		}

		nsl_add_order_shipment(
			$order,
			(string) ( $tracking_data['tracking_number'] ?? '' ),
			(string) ( $tracking_data['carrier'] ?? '' ),
			$shipped_at,
			'shipstation'
		);
	},
	10,
	2
);

/**
 * Recover tracking already delivered by ShipStation into order notes.
 *
 * ShipStation writes "… shipped via CARRIER on DATE with tracking number NUMBER"
 * whenever the Shipment Tracking extension is unavailable. That note is the
 * authoritative record, so it is parsed rather than re-requested.
 */
function nsl_backfill_shipments_from_notes( int $limit = 200 ): int {
	$orders   = wc_get_orders(
		array(
			'limit'   => $limit,
			'orderby' => 'date',
			'order'   => 'DESC',
			'status'  => array_diff( array_keys( wc_get_order_statuses() ), array( 'wc-checkout-draft' ) ),
		)
	);
	$restored = 0;

	foreach ( $orders as $order ) {
		if ( ! $order instanceof WC_Order ) {
			continue;
		}

		foreach ( wc_get_order_notes( array( 'order_id' => $order->get_id(), 'limit' => 50 ) ) as $note ) {
			if ( ! preg_match( '/shipped via (.+?) on .+? with tracking number ([A-Za-z0-9\-]+)/i', (string) $note->content, $matches ) ) {
				continue;
			}
			if ( nsl_add_order_shipment( $order, $matches[2], $matches[1], (int) strtotime( (string) $note->date_created ), 'shipstation-note' ) ) {
				++$restored;
			}
		}
	}

	return $restored;
}

/** Plain-language meaning for each order status a researcher can encounter. */
function nsl_order_status_meaning( string $status ): array {
	$meanings = array(
		'pending'    => array(
			'label' => __( 'Awaiting payment', 'north-specs-labs' ),
			'note'  => __( 'The order is recorded but no payment has been received yet. Nothing is dispatched at this stage.', 'north-specs-labs' ),
			'tone'  => 'warning',
		),
		'on-hold'    => array(
			'label' => __( 'Awaiting payment or approval', 'north-specs-labs' ),
			'note'  => __( 'The order is confirmed and reserved. It is waiting on cleared payment or approved institutional terms before dispatch.', 'north-specs-labs' ),
			'tone'  => 'warning',
		),
		'processing' => array(
			'label' => __( 'Being prepared', 'north-specs-labs' ),
			'note'  => __( 'Payment is confirmed. The order is being picked, packed and prepared for laboratory dispatch.', 'north-specs-labs' ),
			'tone'  => 'active',
		),
		'completed'  => array(
			'label' => __( 'Dispatched', 'north-specs-labs' ),
			'note'  => __( 'The order has been dispatched. Tracking is shown below when the carrier has reported it.', 'north-specs-labs' ),
			'tone'  => 'complete',
		),
		'cancelled'  => array(
			'label' => __( 'Cancelled', 'north-specs-labs' ),
			'note'  => __( 'This order was cancelled and will not be dispatched.', 'north-specs-labs' ),
			'tone'  => 'closed',
		),
		'refunded'   => array(
			'label' => __( 'Refunded', 'north-specs-labs' ),
			'note'  => __( 'This order is recorded as refunded. Contact research support if the procurement record needs clarification.', 'north-specs-labs' ),
			'tone'  => 'closed',
		),
		'failed'     => array(
			'label' => __( 'Payment failed', 'north-specs-labs' ),
			'note'  => __( 'Payment was not completed. Contact research support before attempting another payment.', 'north-specs-labs' ),
			'tone'  => 'danger',
		),
	);

	return $meanings[ $status ] ?? array(
		'label' => wc_get_order_status_name( $status ),
		'note'  => __( 'Contact research support if you need this status clarified.', 'north-specs-labs' ),
		'tone'  => 'active',
	);
}

/** True when the order is waiting on money rather than on the laboratory. */
function nsl_order_awaiting_payment( WC_Order $order ): bool {
	return in_array( $order->get_status(), array( 'pending', 'on-hold', 'failed' ), true ) && ! $order->is_paid();
}

/**
 * The four-stage order timeline with the real timestamps behind each stage.
 */
function nsl_order_timeline_steps( WC_Order $order ): array {
	$status    = $order->get_status();
	$shipments = nsl_order_shipments( $order );
	$closed    = in_array( $status, array( 'cancelled', 'refunded', 'failed' ), true );

	$created   = $order->get_date_created();
	$paid      = $order->get_date_paid();
	$completed = $order->get_date_completed();

	$dispatched_at = 0;
	foreach ( $shipments as $shipment ) {
		if ( $shipment['shipped_at'] && ( ! $dispatched_at || $shipment['shipped_at'] < $dispatched_at ) ) {
			$dispatched_at = $shipment['shipped_at'];
		}
	}
	if ( ! $dispatched_at && 'completed' === $status && $completed ) {
		$dispatched_at = $completed->getTimestamp();
	}

	$paid_done = (bool) $paid || in_array( $status, array( 'processing', 'completed' ), true );

	return array(
		array(
			'label' => __( 'Order received', 'north-specs-labs' ),
			'note'  => __( 'Recorded with your researcher attestations.', 'north-specs-labs' ),
			'done'  => true,
			'time'  => $created ? $created->getTimestamp() : 0,
		),
		array(
			'label' => __( 'Payment confirmed', 'north-specs-labs' ),
			'note'  => $paid_done ? __( 'Cleared and released to the laboratory.', 'north-specs-labs' ) : __( 'Waiting on cleared payment or approved terms.', 'north-specs-labs' ),
			'done'  => $paid_done && ! $closed,
			'time'  => $paid ? $paid->getTimestamp() : 0,
		),
		array(
			'label' => __( 'Dispatched', 'north-specs-labs' ),
			'note'  => $shipments ? __( 'Handed to the carrier. Tracking is available below.', 'north-specs-labs' ) : __( 'Packed and released to the carrier at this stage.', 'north-specs-labs' ),
			'done'  => ( (bool) $shipments || 'completed' === $status ) && ! $closed,
			'time'  => $dispatched_at,
		),
		array(
			'label' => __( 'Completed', 'north-specs-labs' ),
			'note'  => __( 'Retain this record with your receiving documentation.', 'north-specs-labs' ),
			'done'  => 'completed' === $status,
			'time'  => $completed ? $completed->getTimestamp() : 0,
		),
	);
}
