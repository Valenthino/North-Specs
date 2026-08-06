<?php
/**
 * The researcher account: entrance, workspace, order history and batch archive.
 *
 * @package NorthSpecsLabs
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* -------------------------------------------------------------------------
 * Entrance
 * ---------------------------------------------------------------------- */

/**
 * Label, URL and accessible name for the header account control.
 *
 * Signed-out researchers are offered a sign-in; signed-in researchers are shown
 * their account. The accessible name is always explicit because the visible
 * label is hidden on small screens.
 */
function nsl_account_link_data(): array {
	$url = function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'myaccount' ) : nsl_page_url( 'my-account', '/my-account/' );

	if ( is_user_logged_in() ) {
		return array(
			'url'      => $url,
			'label'    => __( 'My account', 'north-specs-labs' ),
			'sr_label' => __( 'My account: orders, tracking and batch documents', 'north-specs-labs' ),
		);
	}

	return array(
		'url'      => $url,
		'label'    => __( 'Sign in', 'north-specs-labs' ),
		'sr_label' => __( 'Sign in to your researcher account', 'north-specs-labs' ),
	);
}

/** The benefits of holding a researcher account, used on the sign-in page. */
function nsl_account_benefits(): array {
	return array(
		array( 'package', __( 'Order history', 'north-specs-labs' ), __( 'Every laboratory order in one place, with plain-language status.', 'north-specs-labs' ) ),
		array( 'search', __( 'Shipment tracking', 'north-specs-labs' ), __( 'Carrier and tracking number as soon as a parcel is dispatched.', 'north-specs-labs' ) ),
		array( 'file', __( 'Printable receipts', 'north-specs-labs' ), __( 'A procurement-ready record for expense and purchase-order files.', 'north-specs-labs' ) ),
		array( 'flask', __( 'Batch records', 'north-specs-labs' ), __( 'The batch document for the exact lot supplied on your order.', 'north-specs-labs' ) ),
		array( 'check', __( 'Faster reordering', 'north-specs-labs' ), __( 'Repeat a previous order without re-entering laboratory details.', 'north-specs-labs' ) ),
		array( 'lock', __( 'Saved addresses', 'north-specs-labs' ), __( 'Institution and shipping details stored for the next purchase.', 'north-specs-labs' ) ),
	);
}

/* -------------------------------------------------------------------------
 * Account navigation
 * ---------------------------------------------------------------------- */

/** A researcher-shaped menu: no downloads, plus a batch-document archive. */
add_filter(
	'woocommerce_account_menu_items',
	function ( array $items ): array {
		unset( $items['downloads'] );

		$ordered = array(
			'dashboard'       => __( 'Workspace', 'north-specs-labs' ),
			'orders'          => __( 'Orders', 'north-specs-labs' ),
			'batch-documents' => __( 'Batch documents', 'north-specs-labs' ),
			'edit-address'    => __( 'Laboratory addresses', 'north-specs-labs' ),
			'edit-account'    => __( 'Profile & security', 'north-specs-labs' ),
			'customer-logout' => __( 'Sign out', 'north-specs-labs' ),
		);

		$menu = array();
		foreach ( $ordered as $endpoint => $label ) {
			if ( 'batch-documents' === $endpoint || isset( $items[ $endpoint ] ) ) {
				$menu[ $endpoint ] = $label;
			}
		}

		// Preserve any endpoint another plugin added that we did not position.
		foreach ( $items as $endpoint => $label ) {
			if ( ! isset( $menu[ $endpoint ] ) ) {
				$menu[ $endpoint ] = $label;
			}
		}

		return $menu;
	},
	20
);

/** Register the batch-document endpoint alongside the WooCommerce ones. */
add_action(
	'init',
	function (): void {
		add_rewrite_endpoint( 'batch-documents', EP_ROOT | EP_PAGES );
	},
	11
);

add_filter(
	'woocommerce_get_query_vars',
	function ( array $vars ): array {
		$vars['batch-documents'] = 'batch-documents';
		unset( $vars['downloads'] );

		return $vars;
	}
);

add_filter(
	'woocommerce_endpoint_batch-documents_title',
	fn(): string => __( 'Batch documents', 'north-specs-labs' )
);

add_action(
	'woocommerce_account_batch-documents_endpoint',
	'nsl_account_render_batch_documents'
);

/** The downloads endpoint is retired: send any bookmarked URL to the workspace. */
add_action(
	'template_redirect',
	function (): void {
		if ( function_exists( 'is_wc_endpoint_url' ) && is_wc_endpoint_url( 'downloads' ) ) {
			wp_safe_redirect( wc_get_account_endpoint_url( 'dashboard' ) );
			exit;
		}
	}
);

/* -------------------------------------------------------------------------
 * Shared order presentation helpers
 * ---------------------------------------------------------------------- */

/** Printable-receipt URL for an order. */
function nsl_order_receipt_url( WC_Order $order, bool $with_key = false ): string {
	$url = home_url( '/order-receipt/' . $order->get_id() . '/' );

	return $with_key ? add_query_arg( 'key', $order->get_order_key(), $url ) : $url;
}

/** Nonce-protected reorder URL using the WooCommerce order-again handler. */
function nsl_order_reorder_url( WC_Order $order ): string {
	return wp_nonce_url( add_query_arg( 'order_again', $order->get_id(), wc_get_cart_url() ), 'woocommerce-order_again' );
}

/** True when at least one line on an order can still be bought today. */
function nsl_order_is_reorderable( WC_Order $order ): bool {
	if ( in_array( $order->get_status(), array( 'cancelled', 'failed' ), true ) ) {
		return false;
	}

	foreach ( $order->get_items() as $item ) {
		$product = $item instanceof WC_Order_Item_Product ? $item->get_product() : null;
		if ( $product && $product->is_purchasable() && $product->is_in_stock() ) {
			return true;
		}
	}

	return false;
}

/** Research-support URL with the order number already filled in. */
function nsl_order_support_url( WC_Order $order, string $topic = 'Order support' ): string {
	return add_query_arg(
		array(
			'topic'     => rawurlencode( $topic ),
			'reference' => rawurlencode( '#' . $order->get_order_number() ),
		),
		nsl_page_url( 'contact', '/contact/' )
	) . '#nsl-contact-form';
}

/** The prominent actions offered for an order, in priority order. */
function nsl_order_actions( WC_Order $order ): array {
	$actions = array(
		'view' => array(
			'url'   => $order->get_view_order_url(),
			'label' => __( 'View order', 'north-specs-labs' ),
			'icon'  => 'package',
			'style' => 'primary',
		),
	);

	if ( nsl_order_shipments( $order ) ) {
		$actions['track'] = array(
			'url'   => $order->get_view_order_url() . '#nsl-tracking',
			'label' => __( 'Track shipment', 'north-specs-labs' ),
			'icon'  => 'search',
			'style' => 'outline',
		);
	}

	if ( nsl_order_awaiting_payment( $order ) && $order->needs_payment() ) {
		$actions['pay'] = array(
			'url'   => $order->get_checkout_payment_url(),
			'label' => __( 'Complete payment', 'north-specs-labs' ),
			'icon'  => 'lock',
			'style' => 'primary',
		);
	}

	$actions['receipt'] = array(
		'url'    => nsl_order_receipt_url( $order ),
		'label'  => __( 'Print receipt', 'north-specs-labs' ),
		'icon'   => 'file',
		'style'  => 'outline',
		'target' => '_blank',
		'event'  => 'order_receipt_open',
	);

	if ( nsl_order_is_reorderable( $order ) ) {
		$actions['reorder'] = array(
			'url'   => nsl_order_reorder_url( $order ),
			'label' => __( 'Reorder', 'north-specs-labs' ),
			'icon'  => 'cart',
			'style' => 'outline',
			'event' => 'order_reorder_click',
		);
	}

	return $actions;
}

/** Render a row of order actions. */
function nsl_render_order_actions( WC_Order $order, array $only = array() ): void {
	$actions = nsl_order_actions( $order );
	if ( $only ) {
		$actions = array_intersect_key( $actions, array_flip( $only ) );
	}
	if ( ! $actions ) {
		return;
	}

	echo '<div class="nsl-order-actions">';
	foreach ( $actions as $action ) {
		printf(
			'<a class="nsl-button%1$s" href="%2$s"%3$s%4$s>%5$s<span>%6$s</span></a>',
			'outline' === $action['style'] ? ' nsl-button--outline' : '',
			esc_url( $action['url'] ),
			empty( $action['target'] ) ? '' : ' target="' . esc_attr( $action['target'] ) . '" rel="noopener"',
			empty( $action['event'] ) ? '' : ' data-nsl-event="' . esc_attr( $action['event'] ) . '"',
			nsl_icon( $action['icon'] ),
			esc_html( $action['label'] )
		);
	}
	echo '</div>';
}

/** A status pill carrying the plain-language label. */
function nsl_render_status_badge( WC_Order $order ): void {
	$meaning = nsl_order_status_meaning( $order->get_status() );
	printf(
		'<span class="nsl-status-badge nsl-status-badge--%1$s">%2$s</span>',
		esc_attr( $meaning['tone'] ),
		esc_html( $meaning['label'] )
	);
}

/* -------------------------------------------------------------------------
 * Dashboard: the researcher workspace
 * ---------------------------------------------------------------------- */

/** Orders for the current customer, newest first. */
function nsl_customer_orders( int $user_id, int $limit = 250 ): array {
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

	return array_values( array_filter( $orders, static fn( $order ): bool => $order instanceof WC_Order ) );
}

/** Distinct products the researcher has previously ordered, newest first. */
function nsl_recently_ordered_products( array $orders, int $limit = 4 ): array {
	$products = array();

	foreach ( $orders as $order ) {
		foreach ( $order->get_items() as $item ) {
			if ( ! $item instanceof WC_Order_Item_Product ) {
				continue;
			}
			$product = $item->get_product();
			if ( ! $product || isset( $products[ $product->get_id() ] ) ) {
				continue;
			}
			$products[ $product->get_id() ] = $product;
			if ( count( $products ) >= $limit ) {
				return array_values( $products );
			}
		}
	}

	return array_values( $products );
}

/** The researcher workspace shown on the account landing page. */
function nsl_account_render_dashboard(): void {
	$user    = wp_get_current_user();
	$orders  = nsl_customer_orders( $user->ID );
	$latest  = $orders[0] ?? null;
	$pending = array_values( array_filter( $orders, 'nsl_order_awaiting_payment' ) );
	$records = nsl_customer_batch_records( $user->ID );
	$documented = array_values( array_filter( $records, static fn( array $record ): bool => (bool) $record['document'] ) );
	$organization = (string) get_user_meta( $user->ID, 'research_organization', true );
	$role         = (string) get_user_meta( $user->ID, 'research_role', true );
	?>
	<div class="nsl-workspace">
		<header class="nsl-workspace__intro">
			<div>
				<?php nsl_eyebrow( 'Researcher workspace' ); ?>
				<h2><?php echo esc_html( sprintf( __( 'Welcome back, %s', 'north-specs-labs' ), $user->display_name ) ); ?></h2>
				<p><?php echo esc_html( $organization ? sprintf( __( 'Signed in for %s. Orders, tracking, batch records and receipts are below.', 'north-specs-labs' ), $organization ) : __( 'Orders, tracking, batch records and receipts are below.', 'north-specs-labs' ) ); ?></p>
			</div>
			<dl class="nsl-workspace__stats">
				<div><dt><?php esc_html_e( 'Orders', 'north-specs-labs' ); ?></dt><dd><?php echo esc_html( (string) count( $orders ) ); ?></dd></div>
				<div><dt><?php esc_html_e( 'Awaiting payment', 'north-specs-labs' ); ?></dt><dd><?php echo esc_html( (string) count( $pending ) ); ?></dd></div>
				<div><dt><?php esc_html_e( 'Batch documents', 'north-specs-labs' ); ?></dt><dd><?php echo esc_html( (string) count( $documented ) ); ?></dd></div>
			</dl>
		</header>

		<?php if ( $pending ) : ?>
			<section class="nsl-workspace-notice nsl-workspace-notice--warning" aria-labelledby="nsl-pending-title">
				<?php echo nsl_icon( 'lock' ); ?>
				<div>
					<h3 id="nsl-pending-title"><?php echo esc_html( sprintf( _n( '%d order is awaiting payment', '%d orders are awaiting payment', count( $pending ), 'north-specs-labs' ), count( $pending ) ) ); ?></h3>
					<p><?php esc_html_e( 'Nothing is dispatched until payment clears or institutional terms are approved. Bank-transfer instructions were included with your order confirmation.', 'north-specs-labs' ); ?></p>
					<ul>
						<?php foreach ( array_slice( $pending, 0, 3 ) as $order ) : ?>
							<li>
								<a href="<?php echo esc_url( $order->get_view_order_url() ); ?>"><?php echo esc_html( sprintf( __( 'Order #%s', 'north-specs-labs' ), $order->get_order_number() ) ); ?></a>
								<span><?php echo wp_kses_post( $order->get_formatted_order_total() ); ?> &middot; <?php echo esc_html( wc_format_datetime( $order->get_date_created() ) ); ?></span>
								<?php if ( $order->needs_payment() ) : ?>
									<a class="nsl-text-link" href="<?php echo esc_url( $order->get_checkout_payment_url() ); ?>"><?php esc_html_e( 'Complete payment', 'north-specs-labs' ); ?><?php echo nsl_icon( 'arrow' ); ?></a>
								<?php endif; ?>
							</li>
						<?php endforeach; ?>
					</ul>
				</div>
			</section>
		<?php endif; ?>

		<div class="nsl-workspace-grid">
			<section class="nsl-workspace-card nsl-workspace-card--wide" aria-labelledby="nsl-latest-title">
				<h3 id="nsl-latest-title"><?php esc_html_e( 'Most recent order', 'north-specs-labs' ); ?></h3>
				<?php if ( $latest ) : ?>
					<?php $meaning = nsl_order_status_meaning( $latest->get_status() ); ?>
					<div class="nsl-workspace-order">
						<div class="nsl-workspace-order__head">
							<p class="nsl-mono"><?php echo esc_html( '#' . $latest->get_order_number() ); ?></p>
							<?php nsl_render_status_badge( $latest ); ?>
						</div>
						<p class="nsl-workspace-order__meaning"><?php echo esc_html( $meaning['note'] ); ?></p>
						<ul class="nsl-workspace-order__items">
							<?php foreach ( $latest->get_items() as $item ) : ?>
								<li><span><?php echo esc_html( $item->get_name() ); ?></span><span class="nsl-mono">&times;<?php echo esc_html( (string) $item->get_quantity() ); ?></span></li>
							<?php endforeach; ?>
						</ul>
						<p class="nsl-workspace-order__total"><?php echo wp_kses_post( $latest->get_formatted_order_total() ); ?> &middot; <?php echo esc_html( wc_format_datetime( $latest->get_date_created() ) ); ?></p>
						<?php nsl_render_order_actions( $latest ); ?>
					</div>
				<?php else : ?>
					<p class="nsl-workspace-empty"><?php esc_html_e( 'No orders yet. Your first laboratory order will appear here with its status, tracking and batch records.', 'north-specs-labs' ); ?></p>
					<a class="nsl-button" href="<?php echo esc_url( nsl_shop_url() ); ?>"><?php esc_html_e( 'Browse the catalogue', 'north-specs-labs' ); ?><?php echo nsl_icon( 'arrow' ); ?></a>
				<?php endif; ?>
			</section>

			<section class="nsl-workspace-card" aria-labelledby="nsl-track-title">
				<?php echo nsl_icon( 'search' ); ?>
				<h3 id="nsl-track-title"><?php esc_html_e( 'Track a shipment', 'north-specs-labs' ); ?></h3>
				<?php
				$tracked = null;
				foreach ( $orders as $order ) {
					if ( nsl_order_shipments( $order ) ) {
						$tracked = $order;
						break;
					}
				}
				?>
				<?php if ( $tracked ) : ?>
					<?php $shipment = nsl_order_shipments( $tracked )[0]; ?>
					<p><?php echo esc_html( sprintf( __( 'Order #%1$s shipped with %2$s.', 'north-specs-labs' ), $tracked->get_order_number(), $shipment['carrier_label'] ) ); ?></p>
					<p class="nsl-mono nsl-tracking-number"><?php echo esc_html( $shipment['number'] ); ?></p>
					<?php if ( $shipment['url'] ) : ?>
						<a class="nsl-button" href="<?php echo esc_url( $shipment['url'] ); ?>" target="_blank" rel="noopener" data-nsl-event="order_tracking_click" data-nsl-carrier="<?php echo esc_attr( $shipment['carrier_slug'] ); ?>"><?php esc_html_e( 'Open carrier tracking', 'north-specs-labs' ); ?><?php echo nsl_icon( 'arrow' ); ?></a>
					<?php endif; ?>
					<a class="nsl-text-link" href="<?php echo esc_url( $tracked->get_view_order_url() . '#nsl-tracking' ); ?>"><?php esc_html_e( 'See the full timeline', 'north-specs-labs' ); ?><?php echo nsl_icon( 'arrow' ); ?></a>
				<?php else : ?>
					<p><?php esc_html_e( 'No parcel is in transit right now. Tracking appears here the moment a carrier reports a dispatch.', 'north-specs-labs' ); ?></p>
					<a class="nsl-text-link" href="<?php echo esc_url( nsl_page_url( 'track-order', '/track-order/' ) ); ?>"><?php esc_html_e( 'Look up any order', 'north-specs-labs' ); ?><?php echo nsl_icon( 'arrow' ); ?></a>
				<?php endif; ?>
			</section>

			<section class="nsl-workspace-card" aria-labelledby="nsl-history-title">
				<?php echo nsl_icon( 'package' ); ?>
				<h3 id="nsl-history-title"><?php esc_html_e( 'Order history', 'north-specs-labs' ); ?></h3>
				<p><?php esc_html_e( 'Search by order number or compound, filter by status and date, and print any receipt.', 'north-specs-labs' ); ?></p>
				<a class="nsl-text-link" href="<?php echo esc_url( wc_get_account_endpoint_url( 'orders' ) ); ?>"><?php esc_html_e( 'Open order history', 'north-specs-labs' ); ?><?php echo nsl_icon( 'arrow' ); ?></a>
			</section>

			<section class="nsl-workspace-card" aria-labelledby="nsl-profile-title">
				<?php echo nsl_icon( 'user' ); ?>
				<h3 id="nsl-profile-title"><?php esc_html_e( 'Laboratory profile', 'north-specs-labs' ); ?></h3>
				<dl class="nsl-workspace-profile">
					<div><dt><?php esc_html_e( 'Organization', 'north-specs-labs' ); ?></dt><dd><?php echo esc_html( $organization ?: __( 'Not recorded', 'north-specs-labs' ) ); ?></dd></div>
					<div><dt><?php esc_html_e( 'Role', 'north-specs-labs' ); ?></dt><dd><?php echo esc_html( $role ?: __( 'Not recorded', 'north-specs-labs' ) ); ?></dd></div>
				</dl>
				<div class="nsl-workspace-links">
					<a class="nsl-text-link" href="<?php echo esc_url( wc_get_account_endpoint_url( 'edit-address' ) ); ?>"><?php esc_html_e( 'Addresses', 'north-specs-labs' ); ?><?php echo nsl_icon( 'arrow' ); ?></a>
					<a class="nsl-text-link" href="<?php echo esc_url( wc_get_account_endpoint_url( 'edit-account' ) ); ?>"><?php esc_html_e( 'Profile & security', 'north-specs-labs' ); ?><?php echo nsl_icon( 'arrow' ); ?></a>
				</div>
			</section>

			<section class="nsl-workspace-card" aria-labelledby="nsl-docs-title">
				<?php echo nsl_icon( 'file' ); ?>
				<h3 id="nsl-docs-title"><?php esc_html_e( 'Batch documents', 'north-specs-labs' ); ?></h3>
				<p>
					<?php
					echo esc_html(
						$records
							? sprintf( _n( '%d supplied lot recorded against your orders.', '%d supplied lots recorded against your orders.', count( $records ), 'north-specs-labs' ), count( $records ) )
							: __( 'Lots are recorded against each line as orders are fulfilled, then matched to their published record.', 'north-specs-labs' )
					);
					?>
				</p>
				<a class="nsl-text-link" href="<?php echo esc_url( wc_get_account_endpoint_url( 'batch-documents' ) ); ?>"><?php esc_html_e( 'Open the batch archive', 'north-specs-labs' ); ?><?php echo nsl_icon( 'arrow' ); ?></a>
			</section>

			<section class="nsl-workspace-card" aria-labelledby="nsl-support-title">
				<?php echo nsl_icon( 'flask' ); ?>
				<h3 id="nsl-support-title"><?php esc_html_e( 'Research support', 'north-specs-labs' ); ?></h3>
				<p><?php esc_html_e( 'Order, documentation and procurement questions. Support never covers human or veterinary use.', 'north-specs-labs' ); ?></p>
				<a class="nsl-text-link" href="<?php echo esc_url( $latest ? nsl_order_support_url( $latest ) : nsl_page_url( 'contact', '/contact/' ) ); ?>">
					<?php echo esc_html( $latest ? sprintf( __( 'Ask about order #%s', 'north-specs-labs' ), $latest->get_order_number() ) : __( 'Contact research support', 'north-specs-labs' ) ); ?>
					<?php echo nsl_icon( 'arrow' ); ?>
				</a>
			</section>
		</div>

		<?php $recent_products = nsl_recently_ordered_products( $orders ); ?>
		<?php if ( $recent_products ) : ?>
			<section class="nsl-workspace-reorder" aria-labelledby="nsl-reorder-title">
				<div class="nsl-workspace-reorder__head">
					<h3 id="nsl-reorder-title"><?php esc_html_e( 'Recently ordered compounds', 'north-specs-labs' ); ?></h3>
					<p><?php esc_html_e( 'Availability and pricing are checked live. Anything discontinued or out of stock cannot be added.', 'north-specs-labs' ); ?></p>
				</div>
				<div class="nsl-product-grid nsl-product-grid--compact">
					<?php foreach ( $recent_products as $product ) : ?>
						<?php nsl_product_card( $product ); ?>
					<?php endforeach; ?>
				</div>
			</section>
		<?php endif; ?>
	</div>
	<?php
}

/* -------------------------------------------------------------------------
 * Order history
 * ---------------------------------------------------------------------- */

/** Read and sanitise the order-history filter state from the request. */
function nsl_order_history_filters(): array {
	// phpcs:disable WordPress.Security.NonceVerification.Recommended -- read-only filtering of the signed-in customer's own orders.
	$statuses = array_keys( wc_get_order_statuses() );
	$status   = isset( $_GET['order_status'] ) ? sanitize_key( wp_unslash( $_GET['order_status'] ) ) : '';

	return array(
		'search' => isset( $_GET['order_search'] ) ? sanitize_text_field( wp_unslash( $_GET['order_search'] ) ) : '',
		'status' => in_array( 'wc-' . $status, $statuses, true ) ? $status : '',
		'from'   => isset( $_GET['order_from'] ) && preg_match( '/^\d{4}-\d{2}-\d{2}$/', (string) wp_unslash( $_GET['order_from'] ) ) ? sanitize_text_field( wp_unslash( $_GET['order_from'] ) ) : '',
		'to'     => isset( $_GET['order_to'] ) && preg_match( '/^\d{4}-\d{2}-\d{2}$/', (string) wp_unslash( $_GET['order_to'] ) ) ? sanitize_text_field( wp_unslash( $_GET['order_to'] ) ) : '',
	);
	// phpcs:enable
}

/** Apply the search, status and date filters to a customer's orders. */
function nsl_filter_orders( array $orders, array $filters ): array {
	$search = strtolower( trim( $filters['search'] ) );
	$from   = $filters['from'] ? (int) strtotime( $filters['from'] . ' 00:00:00' ) : 0;
	$to     = $filters['to'] ? (int) strtotime( $filters['to'] . ' 23:59:59' ) : 0;

	return array_values(
		array_filter(
			$orders,
			static function ( WC_Order $order ) use ( $search, $filters, $from, $to ): bool {
				if ( $filters['status'] && $order->get_status() !== $filters['status'] ) {
					return false;
				}

				$created = $order->get_date_created();
				$time    = $created ? $created->getTimestamp() : 0;
				if ( $from && $time < $from ) {
					return false;
				}
				if ( $to && $time > $to ) {
					return false;
				}

				if ( '' === $search ) {
					return true;
				}

				$needle = ltrim( $search, '#' );
				if ( str_contains( strtolower( (string) $order->get_order_number() ), $needle ) ) {
					return true;
				}

				foreach ( $order->get_items() as $item ) {
					if ( str_contains( strtolower( $item->get_name() ), $search ) ) {
						return true;
					}
					$product = $item instanceof WC_Order_Item_Product ? $item->get_product() : null;
					if ( $product && str_contains( strtolower( (string) $product->get_sku() ), $search ) ) {
						return true;
					}
				}

				return false;
			}
		)
	);
}

/** The searchable, filterable order history. */
function nsl_account_render_orders(): void {
	$user     = wp_get_current_user();
	$all      = nsl_customer_orders( $user->ID );
	$filters  = nsl_order_history_filters();
	$orders   = nsl_filter_orders( $all, $filters );
	$filtered = $filters['search'] || $filters['status'] || $filters['from'] || $filters['to'];

	$per_page = 10;
	$current  = max( 1, (int) get_query_var( 'orders', 1 ) );
	$pages    = max( 1, (int) ceil( count( $orders ) / $per_page ) );
	$current  = min( $current, $pages );
	$page     = array_slice( $orders, ( $current - 1 ) * $per_page, $per_page );

	$statuses = array();
	foreach ( $all as $order ) {
		$statuses[ $order->get_status() ] = nsl_order_status_meaning( $order->get_status() )['label'];
	}
	ksort( $statuses );
	?>
	<div class="nsl-orders">
		<header class="nsl-orders__head">
			<div>
				<h2><?php esc_html_e( 'Order history', 'north-specs-labs' ); ?></h2>
				<p><?php esc_html_e( 'Every laboratory order placed on this account, with plain-language status, tracking, receipts and reordering.', 'north-specs-labs' ); ?></p>
			</div>
		</header>

		<?php if ( $all ) : ?>
			<form class="nsl-orders-filter" method="get" action="<?php echo esc_url( wc_get_account_endpoint_url( 'orders' ) ); ?>" role="search">
				<label>
					<span><?php esc_html_e( 'Order number or compound', 'north-specs-labs' ); ?></span>
					<input type="search" name="order_search" value="<?php echo esc_attr( $filters['search'] ); ?>" placeholder="<?php esc_attr_e( 'e.g. 348 or BPC-157', 'north-specs-labs' ); ?>">
				</label>
				<label>
					<span><?php esc_html_e( 'Status', 'north-specs-labs' ); ?></span>
					<select name="order_status">
						<option value=""><?php esc_html_e( 'Any status', 'north-specs-labs' ); ?></option>
						<?php foreach ( $statuses as $slug => $label ) : ?>
							<option value="<?php echo esc_attr( $slug ); ?>" <?php selected( $filters['status'], $slug ); ?>><?php echo esc_html( $label ); ?></option>
						<?php endforeach; ?>
					</select>
				</label>
				<label>
					<span><?php esc_html_e( 'From', 'north-specs-labs' ); ?></span>
					<input type="date" name="order_from" value="<?php echo esc_attr( $filters['from'] ); ?>">
				</label>
				<label>
					<span><?php esc_html_e( 'To', 'north-specs-labs' ); ?></span>
					<input type="date" name="order_to" value="<?php echo esc_attr( $filters['to'] ); ?>">
				</label>
				<div class="nsl-orders-filter__actions">
					<button class="nsl-button" type="submit"><?php esc_html_e( 'Filter', 'north-specs-labs' ); ?></button>
					<?php if ( $filtered ) : ?>
						<a class="nsl-text-link" href="<?php echo esc_url( wc_get_account_endpoint_url( 'orders' ) ); ?>"><?php esc_html_e( 'Clear', 'north-specs-labs' ); ?></a>
					<?php endif; ?>
				</div>
			</form>

			<p class="nsl-orders-count" aria-live="polite">
				<?php echo esc_html( sprintf( _n( '%1$d of %2$d order shown', '%1$d of %2$d orders shown', count( $all ), 'north-specs-labs' ), count( $orders ), count( $all ) ) ); ?>
			</p>
		<?php endif; ?>

		<?php if ( $page ) : ?>
			<ul class="nsl-order-list">
				<?php foreach ( $page as $order ) : ?>
					<?php
					$meaning   = nsl_order_status_meaning( $order->get_status() );
					$shipments = nsl_order_shipments( $order );
					?>
					<li class="nsl-order-row">
						<div class="nsl-order-row__main">
							<div class="nsl-order-row__head">
								<a class="nsl-mono nsl-order-row__number" href="<?php echo esc_url( $order->get_view_order_url() ); ?>" aria-label="<?php echo esc_attr( sprintf( __( 'View order number %s', 'north-specs-labs' ), $order->get_order_number() ) ); ?>"><?php echo esc_html( '#' . $order->get_order_number() ); ?></a>
								<?php nsl_render_status_badge( $order ); ?>
								<time datetime="<?php echo esc_attr( $order->get_date_created() ? $order->get_date_created()->date( 'c' ) : '' ); ?>"><?php echo esc_html( wc_format_datetime( $order->get_date_created() ) ); ?></time>
							</div>
							<p class="nsl-order-row__meaning"><?php echo esc_html( $meaning['note'] ); ?></p>
							<ul class="nsl-order-row__items">
								<?php foreach ( $order->get_items() as $item ) : ?>
									<li><?php echo esc_html( $item->get_name() ); ?> <span class="nsl-mono">&times;<?php echo esc_html( (string) $item->get_quantity() ); ?></span></li>
								<?php endforeach; ?>
							</ul>
							<?php if ( $shipments ) : ?>
								<p class="nsl-order-row__tracking"><?php echo nsl_icon( 'package' ); ?><?php echo esc_html( sprintf( __( '%1$s tracking %2$s', 'north-specs-labs' ), $shipments[0]['carrier_label'], $shipments[0]['number'] ) ); ?></p>
							<?php endif; ?>
						</div>
						<div class="nsl-order-row__side">
							<p class="nsl-order-row__total"><?php echo wp_kses_post( $order->get_formatted_order_total() ); ?></p>
							<?php nsl_render_order_actions( $order ); ?>
						</div>
					</li>
				<?php endforeach; ?>
			</ul>

			<?php if ( $pages > 1 ) : ?>
				<nav class="nsl-orders-pagination" aria-label="<?php esc_attr_e( 'Order history pages', 'north-specs-labs' ); ?>">
					<?php
					$query_args = array_filter(
						array(
							'order_search' => $filters['search'],
							'order_status' => $filters['status'],
							'order_from'   => $filters['from'],
							'order_to'     => $filters['to'],
						)
					);
					?>
					<?php if ( $current > 1 ) : ?>
						<a class="nsl-button nsl-button--outline" href="<?php echo esc_url( add_query_arg( $query_args, wc_get_endpoint_url( 'orders', (string) ( $current - 1 ) ) ) ); ?>"><?php esc_html_e( 'Previous', 'north-specs-labs' ); ?></a>
					<?php endif; ?>
					<span><?php echo esc_html( sprintf( __( 'Page %1$d of %2$d', 'north-specs-labs' ), $current, $pages ) ); ?></span>
					<?php if ( $current < $pages ) : ?>
						<a class="nsl-button nsl-button--outline" href="<?php echo esc_url( add_query_arg( $query_args, wc_get_endpoint_url( 'orders', (string) ( $current + 1 ) ) ) ); ?>"><?php esc_html_e( 'Next', 'north-specs-labs' ); ?></a>
					<?php endif; ?>
				</nav>
			<?php endif; ?>

		<?php elseif ( $filtered ) : ?>
			<div class="nsl-workspace-empty-panel">
				<h3><?php esc_html_e( 'No orders match those filters', 'north-specs-labs' ); ?></h3>
				<p><?php esc_html_e( 'Try a shorter search term, widen the date range, or clear the status filter.', 'north-specs-labs' ); ?></p>
				<a class="nsl-button nsl-button--outline" href="<?php echo esc_url( wc_get_account_endpoint_url( 'orders' ) ); ?>"><?php esc_html_e( 'Clear filters', 'north-specs-labs' ); ?></a>
			</div>
		<?php else : ?>
			<div class="nsl-workspace-empty-panel">
				<h3><?php esc_html_e( 'No orders yet', 'north-specs-labs' ); ?></h3>
				<p><?php esc_html_e( 'Once you place a laboratory order it appears here with status, tracking, receipts and its batch records.', 'north-specs-labs' ); ?></p>
				<a class="nsl-button" href="<?php echo esc_url( nsl_shop_url() ); ?>"><?php esc_html_e( 'Browse the catalogue', 'north-specs-labs' ); ?><?php echo nsl_icon( 'arrow' ); ?></a>
			</div>
		<?php endif; ?>
	</div>
	<?php
}

/* -------------------------------------------------------------------------
 * Batch documents
 * ---------------------------------------------------------------------- */

/** Render one batch record card. */
function nsl_render_batch_record( array $record, bool $show_order = true ): void {
	$document = $record['document'];
	?>
	<article class="nsl-batch-record">
		<header>
			<div>
				<p class="nsl-batch-record__product"><?php echo esc_html( $record['item_name'] ); ?></p>
				<h4 class="nsl-mono"><?php echo esc_html( $record['lot'] ?: __( 'Lot not yet recorded', 'north-specs-labs' ) ); ?></h4>
			</div>
			<?php if ( $document ) : ?>
				<span class="nsl-status-badge nsl-status-badge--complete"><?php esc_html_e( 'Record published', 'north-specs-labs' ); ?></span>
			<?php elseif ( $record['lot'] ) : ?>
				<span class="nsl-status-badge nsl-status-badge--warning"><?php esc_html_e( 'Record on request', 'north-specs-labs' ); ?></span>
			<?php endif; ?>
		</header>

		<?php if ( $show_order && $record['order'] instanceof WC_Order ) : ?>
			<p class="nsl-batch-record__order">
				<?php echo nsl_icon( 'package' ); ?>
				<a href="<?php echo esc_url( $record['order']->get_view_order_url() ); ?>"><?php echo esc_html( sprintf( __( 'Supplied on order #%s', 'north-specs-labs' ), $record['order']->get_order_number() ) ); ?></a>
				<span><?php echo esc_html( wc_format_datetime( $record['order']->get_date_created() ) ); ?></span>
			</p>
		<?php endif; ?>

		<?php if ( $document ) : ?>
			<dl>
				<div><dt><?php esc_html_e( 'Test date', 'north-specs-labs' ); ?></dt><dd><?php echo esc_html( $document['test_date'] ?: __( 'See report', 'north-specs-labs' ) ); ?></dd></div>
				<div><dt><?php esc_html_e( 'Laboratory', 'north-specs-labs' ); ?></dt><dd><?php echo esc_html( $document['lab'] ?: __( 'See report', 'north-specs-labs' ) ); ?></dd></div>
				<div><dt><?php esc_html_e( 'Methods', 'north-specs-labs' ); ?></dt><dd><?php echo esc_html( $document['methods'] ?: __( 'See report', 'north-specs-labs' ) ); ?></dd></div>
				<div><dt><?php esc_html_e( 'Summary', 'north-specs-labs' ); ?></dt><dd><?php echo esc_html( $document['result'] ?: __( 'See report', 'north-specs-labs' ) ); ?></dd></div>
			</dl>
			<?php if ( $document['pdf_url'] ) : ?>
				<a class="nsl-button" href="<?php echo esc_url( $document['pdf_url'] ); ?>" target="_blank" rel="noopener" data-nsl-event="batch_document_access" data-nsl-source="<?php echo esc_attr( $show_order ? 'account_archive' : 'order_detail' ); ?>">
					<?php esc_html_e( 'Open the verified report', 'north-specs-labs' ); ?><?php echo nsl_icon( 'arrow' ); ?>
				</a>
			<?php else : ?>
				<p class="nsl-batch-record__note"><?php esc_html_e( 'This record is published without an attached file. Request a copy from research support.', 'north-specs-labs' ); ?></p>
			<?php endif; ?>
		<?php elseif ( $record['lot'] ) : ?>
			<p class="nsl-batch-record__note"><?php esc_html_e( 'No public record has been published for this lot yet. A missing public record is not evidence of a test result — request the exact document for this lot.', 'north-specs-labs' ); ?></p>
			<a class="nsl-button nsl-button--outline" href="<?php echo esc_url( nsl_batch_request_url( $record ) ); ?>"><?php esc_html_e( 'Request this record', 'north-specs-labs' ); ?></a>
		<?php else : ?>
			<p class="nsl-batch-record__note"><?php esc_html_e( 'The supplied lot is recorded against this line once the order is picked and dispatched.', 'north-specs-labs' ); ?></p>
		<?php endif; ?>
	</article>
	<?php
}

/** The account batch-document archive. */
function nsl_account_render_batch_documents(): void {
	$records = nsl_customer_batch_records( get_current_user_id() );
	?>
	<div class="nsl-batch-archive">
		<header class="nsl-orders__head">
			<div>
				<h2><?php esc_html_e( 'Batch documents', 'north-specs-labs' ); ?></h2>
				<p><?php esc_html_e( 'The lots actually supplied on your orders, each shown with the published record for that exact lot. A document is never displayed unless its lot is associated with your order.', 'north-specs-labs' ); ?></p>
			</div>
		</header>

		<?php if ( $records ) : ?>
			<div class="nsl-batch-list">
				<?php foreach ( $records as $record ) : ?>
					<?php nsl_render_batch_record( $record ); ?>
				<?php endforeach; ?>
			</div>
		<?php else : ?>
			<div class="nsl-workspace-empty-panel">
				<h3><?php esc_html_e( 'No supplied lots recorded yet', 'north-specs-labs' ); ?></h3>
				<p><?php esc_html_e( 'Lot identifiers are recorded against each order line as it is picked and dispatched. Once recorded, the matching batch document appears here and inside the order.', 'north-specs-labs' ); ?></p>
				<a class="nsl-button nsl-button--outline" href="<?php echo esc_url( nsl_page_url( 'certificates-of-analysis', '/certificates-of-analysis/' ) ); ?>"><?php esc_html_e( 'Search the public batch archive', 'north-specs-labs' ); ?></a>
			</div>
		<?php endif; ?>
	</div>
	<?php
}

/* -------------------------------------------------------------------------
 * Order detail
 * ---------------------------------------------------------------------- */

/** The full order timeline, tracking panel and support route. */
function nsl_render_order_timeline( WC_Order $order ): void {
	$meaning   = nsl_order_status_meaning( $order->get_status() );
	$steps     = nsl_order_timeline_steps( $order );
	$shipments = nsl_order_shipments( $order );
	?>
	<section class="nsl-order-timeline" id="nsl-tracking" aria-labelledby="nsl-timeline-title">
		<header class="nsl-order-timeline__head">
			<h2 id="nsl-timeline-title"><?php esc_html_e( 'Order progress', 'north-specs-labs' ); ?></h2>
			<?php nsl_render_status_badge( $order ); ?>
		</header>
		<p class="nsl-order-timeline__status"><?php echo esc_html( $meaning['note'] ); ?></p>

		<ol>
			<?php foreach ( $steps as $step ) : ?>
				<li class="<?php echo $step['done'] ? 'is-complete' : ''; ?>">
					<span><?php echo nsl_icon( 'check' ); ?></span>
					<strong><?php echo esc_html( $step['label'] ); ?></strong>
					<?php if ( $step['time'] ) : ?>
						<time class="nsl-mono" datetime="<?php echo esc_attr( gmdate( 'c', $step['time'] ) ); ?>"><?php echo esc_html( date_i18n( get_option( 'date_format' ), $step['time'] ) ); ?></time>
					<?php endif; ?>
					<small><?php echo esc_html( $step['note'] ); ?></small>
				</li>
			<?php endforeach; ?>
		</ol>

		<?php if ( $shipments ) : ?>
			<div class="nsl-order-tracking">
				<h3><?php esc_html_e( 'Shipment tracking', 'north-specs-labs' ); ?></h3>
				<?php foreach ( $shipments as $shipment ) : ?>
					<div class="nsl-order-tracking__item">
						<div>
							<p class="nsl-order-tracking__carrier"><?php echo esc_html( $shipment['carrier_label'] ); ?></p>
							<p class="nsl-mono nsl-tracking-number"><?php echo esc_html( $shipment['number'] ); ?></p>
							<?php if ( $shipment['shipped_at'] ) : ?>
								<p class="nsl-order-tracking__date"><?php echo esc_html( sprintf( __( 'Dispatched %s', 'north-specs-labs' ), date_i18n( get_option( 'date_format' ), $shipment['shipped_at'] ) ) ); ?></p>
							<?php endif; ?>
						</div>
						<?php if ( $shipment['url'] ) : ?>
							<a class="nsl-button" href="<?php echo esc_url( $shipment['url'] ); ?>" target="_blank" rel="noopener" data-nsl-event="order_tracking_click" data-nsl-carrier="<?php echo esc_attr( $shipment['carrier_slug'] ); ?>">
								<?php esc_html_e( 'Track with the carrier', 'north-specs-labs' ); ?><?php echo nsl_icon( 'arrow' ); ?>
							</a>
						<?php else : ?>
							<p class="nsl-order-tracking__manual"><?php esc_html_e( 'Enter this number on the carrier’s own tracking page.', 'north-specs-labs' ); ?></p>
						<?php endif; ?>
					</div>
				<?php endforeach; ?>
			</div>
		<?php elseif ( ! in_array( $order->get_status(), array( 'cancelled', 'failed', 'refunded' ), true ) ) : ?>
			<p class="nsl-order-timeline__pending"><?php esc_html_e( 'Tracking appears here as soon as the carrier reports the dispatch. Nothing is shown before then.', 'north-specs-labs' ); ?></p>
		<?php endif; ?>

		<div class="nsl-order-timeline__support">
			<a class="nsl-text-link" href="<?php echo esc_url( nsl_order_support_url( $order ) ); ?>">
				<?php echo esc_html( sprintf( __( 'Ask research support about order #%s', 'north-specs-labs' ), $order->get_order_number() ) ); ?>
				<?php echo nsl_icon( 'arrow' ); ?>
			</a>
		</div>
	</section>
	<?php
}

/** Batch records shown inside a single order. */
function nsl_render_order_batch_panel( WC_Order $order ): void {
	$records = nsl_order_batch_records( $order );
	if ( ! $records ) {
		return;
	}
	?>
	<section class="nsl-order-batch" aria-labelledby="nsl-order-batch-title">
		<h2 id="nsl-order-batch-title"><?php esc_html_e( 'Batch documents for this order', 'north-specs-labs' ); ?></h2>
		<p class="nsl-order-batch__intro"><?php esc_html_e( 'Each record below belongs to the exact lot supplied on this order.', 'north-specs-labs' ); ?></p>
		<div class="nsl-batch-list">
			<?php foreach ( $records as $record ) : ?>
				<?php nsl_render_batch_record( $record, false ); ?>
			<?php endforeach; ?>
		</div>
	</section>
	<?php
}

/** The action row and receipt route on the order-detail page. */
function nsl_render_order_detail_actions( WC_Order $order ): void {
	?>
	<section class="nsl-order-detail-actions">
		<?php nsl_render_order_actions( $order, array( 'pay', 'receipt', 'reorder' ) ); ?>
		<a class="nsl-text-link" href="<?php echo esc_url( nsl_invoice_request_url( $order ) ); ?>"><?php esc_html_e( 'Request an institutional invoice', 'north-specs-labs' ); ?><?php echo nsl_icon( 'arrow' ); ?></a>
	</section>
	<?php
}

/* -------------------------------------------------------------------------
 * Wiring
 * ---------------------------------------------------------------------- */

add_action( 'woocommerce_view_order', function ( $order_id ): void {
	$order = wc_get_order( $order_id );
	if ( $order instanceof WC_Order ) {
		nsl_render_order_timeline( $order );
	}
}, 8 );

add_action( 'woocommerce_view_order', function ( $order_id ): void {
	$order = wc_get_order( $order_id );
	if ( $order instanceof WC_Order ) {
		nsl_render_order_detail_actions( $order );
		nsl_render_order_batch_panel( $order );
	}
}, 12 );

add_action( 'woocommerce_thankyou', function ( $order_id ): void {
	$order = wc_get_order( $order_id );
	if ( $order instanceof WC_Order ) {
		nsl_render_order_timeline( $order );
	}
}, 8 );

/** Record the order-detail view for analytics, without identifying the viewer. */
add_action(
	'woocommerce_account_view-order_endpoint',
	function ( $order_id ): void {
		$order = wc_get_order( $order_id );
		if ( $order instanceof WC_Order ) {
			nsl_analytics_order_view( $order, 'account' );
		}
	},
	1
);
