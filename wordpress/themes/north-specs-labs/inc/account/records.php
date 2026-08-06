<?php
/**
 * Order-linked batch records.
 *
 * A lot identifier is recorded against each fulfilled order item. A published
 * batch document is only ever shown against an order when the lot on that
 * order item matches the lot on the document AND both refer to the same
 * product. Nothing is inferred, guessed or matched by "current lot".
 *
 * @package NorthSpecsLabs
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const NSL_LOT_ITEM_META = '_nsl_lot';

/** Read the recorded lot for one order line item. */
function nsl_order_item_lot( WC_Order_Item $item ): string {
	return trim( (string) $item->get_meta( NSL_LOT_ITEM_META, true ) );
}

/** Normalise a lot identifier for comparison without altering what is displayed. */
function nsl_normalize_lot( string $lot ): string {
	return strtoupper( preg_replace( '/[^A-Z0-9]/i', '', $lot ) );
}

/**
 * Find the published batch document explicitly associated with a product + lot.
 *
 * Returns null unless a published nsl_coa record carries both the same product
 * and the same lot identifier. There is no fallback to a "current" lot.
 */
function nsl_find_batch_document( int $product_id, string $lot ): ?WP_Post {
	$lot = trim( $lot );
	if ( ! $product_id || '' === $lot ) {
		return null;
	}

	$candidates = get_posts(
		array(
			'post_type'        => 'nsl_coa',
			'post_status'      => 'publish',
			'numberposts'      => 20,
			'suppress_filters' => false,
			'meta_query'       => array(
				array(
					'key'   => '_nsl_coa_product_id',
					'value' => $product_id,
				),
			),
		)
	);

	$needle = nsl_normalize_lot( $lot );
	foreach ( $candidates as $candidate ) {
		if ( nsl_normalize_lot( (string) get_post_meta( $candidate->ID, '_nsl_coa_lot', true ) ) === $needle ) {
			return $candidate;
		}
	}

	return null;
}

/** Flatten one batch document into the fields the account pages render. */
function nsl_batch_document_data( WP_Post $document ): array {
	return array(
		'id'         => $document->ID,
		'lot'        => (string) get_post_meta( $document->ID, '_nsl_coa_lot', true ),
		'product_id' => (int) get_post_meta( $document->ID, '_nsl_coa_product_id', true ),
		'test_date'  => (string) get_post_meta( $document->ID, '_nsl_coa_test_date', true ),
		'lab'        => (string) get_post_meta( $document->ID, '_nsl_coa_lab', true ),
		'methods'    => (string) get_post_meta( $document->ID, '_nsl_coa_methods', true ),
		'result'     => (string) get_post_meta( $document->ID, '_nsl_coa_result', true ),
		'pdf_url'    => (string) get_post_meta( $document->ID, '_nsl_coa_pdf_url', true ),
		'note'       => (string) $document->post_content,
	);
}

/**
 * Batch records for one order.
 *
 * Every purchased line is returned so a researcher can see which lines carry a
 * recorded lot and which do not. `document` is null unless the association is
 * explicit and published.
 */
function nsl_order_batch_records( WC_Order $order ): array {
	$records = array();

	foreach ( $order->get_items() as $item ) {
		if ( ! $item instanceof WC_Order_Item_Product ) {
			continue;
		}

		$product_id = (int) $item->get_product_id();
		$lot        = nsl_order_item_lot( $item );
		$document   = $lot ? nsl_find_batch_document( $product_id, $lot ) : null;

		$records[] = array(
			'order_id'   => $order->get_id(),
			'order'      => $order,
			'item_id'    => $item->get_id(),
			'item_name'  => $item->get_name(),
			'product_id' => $product_id,
			'quantity'   => (int) $item->get_quantity(),
			'lot'        => $lot,
			'document'   => $document ? nsl_batch_document_data( $document ) : null,
		);
	}

	return $records;
}

/** True when at least one line on the order has a published document behind it. */
function nsl_order_has_batch_documents( WC_Order $order ): bool {
	foreach ( nsl_order_batch_records( $order ) as $record ) {
		if ( $record['document'] ) {
			return true;
		}
	}

	return false;
}

/**
 * Every recorded lot across a customer's orders, newest order first.
 *
 * Lines without a recorded lot are omitted here: this archive is a record of
 * what was actually supplied, not a list of everything ordered.
 */
function nsl_customer_batch_records( int $user_id, int $limit = 100 ): array {
	if ( ! $user_id ) {
		return array();
	}

	$orders = wc_get_orders(
		array(
			'customer_id' => $user_id,
			'limit'       => $limit,
			'orderby'     => 'date',
			'order'       => 'DESC',
			'status'      => array_diff( array_keys( wc_get_order_statuses() ), array( 'wc-checkout-draft' ) ),
		)
	);

	$records = array();
	foreach ( $orders as $order ) {
		if ( ! $order instanceof WC_Order ) {
			continue;
		}
		foreach ( nsl_order_batch_records( $order ) as $record ) {
			if ( '' !== $record['lot'] ) {
				$records[] = $record;
			}
		}
	}

	return $records;
}

/** Public archive URL filtered to one product and lot. */
function nsl_batch_archive_url( int $product_id = 0, string $lot = '' ): string {
	$args    = array();
	$product = $product_id ? wc_get_product( $product_id ) : null;
	if ( $product ) {
		$args['product'] = $product->get_slug();
	}
	if ( '' !== $lot ) {
		$args['lot'] = $lot;
	}

	return add_query_arg( $args, nsl_page_url( 'certificates-of-analysis', '/certificates-of-analysis/' ) );
}

/** Prefilled documentation-request URL for a lot with no published record yet. */
function nsl_batch_request_url( array $record ): string {
	$order     = $record['order'] instanceof WC_Order ? $record['order'] : null;
	$reference = $order ? sprintf( 'Order #%s', $order->get_order_number() ) : '';
	if ( '' !== $record['lot'] ) {
		$reference = trim( $reference . ' / Lot ' . $record['lot'] );
	}

	return add_query_arg(
		array_filter(
			array(
				'request_type' => 'Documentation request',
				'products'     => $record['item_name'],
				'reference'    => $reference,
			)
		),
		nsl_page_url( 'institutional-procurement', '/institutional-procurement/' )
	);
}
