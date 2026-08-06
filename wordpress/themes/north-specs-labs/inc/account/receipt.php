<?php
/**
 * Printable order receipts and the institutional invoice-request route.
 *
 * The receipt is a self-contained procurement record: organization, order
 * reference, payment state, line items with supplied lots, addresses and
 * totals. Internal order notes, attribution data, staff notes and analytics
 * metadata are never included.
 *
 * @package NorthSpecsLabs
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Pretty receipt URL: /order-receipt/{id}/ */
add_action(
	'init',
	function (): void {
		add_rewrite_rule( '^order-receipt/([0-9]+)/?$', 'index.php?nsl_order_receipt=$matches[1]', 'top' );
	},
	11
);

add_filter(
	'query_vars',
	function ( array $vars ): array {
		$vars[] = 'nsl_order_receipt';

		return $vars;
	}
);

/**
 * Decide whether the current request may see an order.
 *
 * Signed-in owners (and staff) are allowed. Guests must present the order key
 * that was issued with their confirmation email.
 */
function nsl_can_view_order( WC_Order $order ): bool {
	if ( is_user_logged_in() && current_user_can( 'view_order', $order->get_id() ) ) {
		return true;
	}

	// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- the order key is the credential here.
	$key = isset( $_GET['key'] ) ? sanitize_text_field( wp_unslash( $_GET['key'] ) ) : '';

	return '' !== $key && hash_equals( (string) $order->get_order_key(), $key );
}

/** Serve the printable receipt. */
add_action(
	'template_redirect',
	function (): void {
		$order_id = absint( get_query_var( 'nsl_order_receipt' ) );
		if ( ! $order_id ) {
			return;
		}

		$order = wc_get_order( $order_id );
		if ( ! $order instanceof WC_Order ) {
			wp_die( esc_html__( 'That order could not be found.', 'north-specs-labs' ), '', array( 'response' => 404 ) );
		}

		if ( ! nsl_can_view_order( $order ) ) {
			wp_safe_redirect( add_query_arg( 'receipt', 'signin', wc_get_page_permalink( 'myaccount' ) ) );
			exit;
		}

		nsl_render_order_receipt( $order );
		exit;
	}
);

/** Order-linked invoice request URL. */
function nsl_invoice_request_url( WC_Order $order ): string {
	return add_query_arg(
		array_filter(
			array(
				'request_type' => 'Invoice request',
				'reference'    => '#' . $order->get_order_number(),
				'organization' => (string) $order->get_meta( '_billing_research_organization' ),
			)
		),
		nsl_page_url( 'institutional-procurement', '/institutional-procurement/' )
	);
}

/** A single self-contained printable page. */
function nsl_render_order_receipt( WC_Order $order ): void {
	$organization = (string) $order->get_meta( '_billing_research_organization' );
	$role         = (string) $order->get_meta( '_billing_research_role' );
	$paid_date    = $order->get_date_paid();
	$meaning      = nsl_order_status_meaning( $order->get_status() );
	$records      = array();
	foreach ( nsl_order_batch_records( $order ) as $record ) {
		$records[ $record['item_id'] ] = $record['lot'];
	}

	nocache_headers();
	status_header( 200 );
	header( 'Content-Type: text/html; charset=' . get_bloginfo( 'charset' ) );
	?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="robots" content="noindex, nofollow">
	<title><?php echo esc_html( sprintf( __( 'Receipt for order #%s — North Specs Labs', 'north-specs-labs' ), $order->get_order_number() ) ); ?></title>
	<style>
		:root{--ink:#141f18;--copy:#4b5a4c;--accent:#1b573a;--soft:#d8eee1;--border:#ddd6c7;--bg:#f7f4ed}
		*{box-sizing:border-box}
		body{margin:0;padding:32px 20px 64px;background:var(--bg);color:var(--ink);font:15px/1.6 "Public Sans",Arial,Helvetica,sans-serif}
		.sheet{max-width:840px;margin:0 auto;padding:40px;background:#fff;border:1px solid var(--border);border-radius:12px}
		.mono{font-family:"JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.02em}
		header.masthead{display:flex;align-items:flex-start;justify-content:space-between;gap:24px;padding-bottom:24px;border-bottom:1px solid var(--border)}
		.brand{display:flex;align-items:center;gap:12px}
		.brand svg{width:38px;height:44px;color:var(--accent)}
		.brand strong{display:block;font-size:19px;letter-spacing:.14em}
		.brand span{display:block;color:var(--copy);font-size:10px;letter-spacing:.24em;text-transform:uppercase}
		.doc-type{text-align:right}
		.doc-type h1{margin:0;font-size:20px;letter-spacing:.02em}
		.doc-type p{margin:4px 0 0;color:var(--copy);font-size:12px}
		.summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0;margin:24px 0;border:1px solid var(--border);border-radius:6px;overflow:hidden}
		.summary div{padding:12px 14px;border-left:1px solid var(--border)}
		.summary div:first-child{border-left:0}
		.summary dt{margin:0;color:var(--copy);font-size:9px;letter-spacing:.1em;text-transform:uppercase}
		.summary dd{margin:5px 0 0;font-size:13px;font-weight:600}
		.badge{display:inline-block;padding:3px 9px;border-radius:999px;background:var(--soft);color:#123d28;font-size:11px;font-weight:700}
		.parties{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin:24px 0}
		.parties h2{margin:0 0 8px;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--copy)}
		.parties address{font-style:normal;font-size:13px;line-height:1.55}
		table{width:100%;border-collapse:collapse;margin:8px 0 0}
		th,td{padding:11px 8px;text-align:left;border-bottom:1px solid var(--border);font-size:13px;vertical-align:top}
		th{color:var(--copy);font-size:10px;letter-spacing:.08em;text-transform:uppercase;border-bottom:1px solid var(--ink)}
		td.num,th.num{text-align:right;white-space:nowrap}
		tfoot td{border-bottom:0;padding-top:8px;padding-bottom:4px}
		tfoot tr:last-child td{padding-top:12px;border-top:1px solid var(--ink);font-size:15px;font-weight:700}
		.lot{display:block;margin-top:4px;color:var(--copy);font-size:11px}
		.notice{margin:28px 0 0;padding:14px 16px;background:var(--soft);border-radius:6px;font-size:12px;line-height:1.55}
		footer.foot{margin-top:28px;padding-top:18px;border-top:1px solid var(--border);color:var(--copy);font-size:11px;line-height:1.6}
		.actions{max-width:840px;margin:0 auto 18px;display:flex;gap:10px;flex-wrap:wrap}
		.actions a,.actions button{display:inline-flex;align-items:center;min-height:42px;padding:10px 16px;border:1px solid var(--accent);border-radius:6px;background:var(--accent);color:#fff;font:700 13px/1 "Public Sans",Arial,sans-serif;text-decoration:none;cursor:pointer}
		.actions a.secondary{background:transparent;color:var(--accent)}
		@media print{body{padding:0;background:#fff}.sheet{max-width:none;border:0;border-radius:0;padding:0}.actions{display:none}}
		@media (max-width:640px){.sheet{padding:20px}.summary{grid-template-columns:1fr 1fr}.summary div:nth-child(3){border-left:0}.parties{grid-template-columns:1fr}header.masthead{flex-direction:column}.doc-type{text-align:left}}
	</style>
</head>
<body>
	<div class="actions">
		<button type="button" onclick="window.print()"><?php esc_html_e( 'Print or save as PDF', 'north-specs-labs' ); ?></button>
		<a class="secondary" href="<?php echo esc_url( $order->get_view_order_url() ); ?>"><?php esc_html_e( 'Back to the order', 'north-specs-labs' ); ?></a>
		<a class="secondary" href="<?php echo esc_url( nsl_invoice_request_url( $order ) ); ?>"><?php esc_html_e( 'Request an institutional invoice', 'north-specs-labs' ); ?></a>
	</div>

	<div class="sheet">
		<header class="masthead">
			<div class="brand">
				<svg viewBox="0 0 52 60" aria-hidden="true" fill="none"><path d="M26 1.8 49 15v30L26 58.2 3 45V15z" stroke="currentColor" stroke-width="3"/><path d="M13.5 42V18l7-4 13.5 21V18l5-3v27l-7 4-13.5-21v14z" fill="currentColor"/></svg>
				<div><strong>NORTH SPECS</strong><span>Labs &middot; <?php echo esc_html( wp_parse_url( home_url(), PHP_URL_HOST ) ); ?></span></div>
			</div>
			<div class="doc-type">
				<h1><?php esc_html_e( 'Order receipt', 'north-specs-labs' ); ?></h1>
				<p class="mono"><?php echo esc_html( '#' . $order->get_order_number() ); ?></p>
			</div>
		</header>

		<dl class="summary">
			<div><dt><?php esc_html_e( 'Order reference', 'north-specs-labs' ); ?></dt><dd class="mono"><?php echo esc_html( '#' . $order->get_order_number() ); ?></dd></div>
			<div><dt><?php esc_html_e( 'Order date', 'north-specs-labs' ); ?></dt><dd><?php echo esc_html( wc_format_datetime( $order->get_date_created() ) ); ?></dd></div>
			<div><dt><?php esc_html_e( 'Payment state', 'north-specs-labs' ); ?></dt><dd><span class="badge"><?php echo esc_html( $order->is_paid() ? __( 'Paid', 'north-specs-labs' ) : $meaning['label'] ); ?></span></dd></div>
			<div><dt><?php esc_html_e( 'Payment method', 'north-specs-labs' ); ?></dt><dd><?php echo esc_html( $order->get_payment_method_title() ?: __( 'Not recorded', 'north-specs-labs' ) ); ?></dd></div>
		</dl>

		<div class="parties">
			<div>
				<h2><?php esc_html_e( 'Purchasing organization', 'north-specs-labs' ); ?></h2>
				<address>
					<?php if ( $organization ) : ?><strong><?php echo esc_html( $organization ); ?></strong><br><?php endif; ?>
					<?php if ( $role ) : ?><?php echo esc_html( $role ); ?><br><?php endif; ?>
					<?php echo wp_kses_post( $order->get_formatted_billing_address( esc_html__( 'Not recorded', 'north-specs-labs' ) ) ); ?>
				</address>
			</div>
			<div>
				<h2><?php esc_html_e( 'Delivered to', 'north-specs-labs' ); ?></h2>
				<address>
					<?php echo wp_kses_post( $order->get_formatted_shipping_address( $order->get_formatted_billing_address( esc_html__( 'Not recorded', 'north-specs-labs' ) ) ) ); ?>
				</address>
			</div>
		</div>

		<table>
			<thead>
				<tr>
					<th scope="col"><?php esc_html_e( 'Item', 'north-specs-labs' ); ?></th>
					<th scope="col" class="num"><?php esc_html_e( 'Qty', 'north-specs-labs' ); ?></th>
					<th scope="col" class="num"><?php esc_html_e( 'Amount', 'north-specs-labs' ); ?></th>
				</tr>
			</thead>
			<tbody>
				<?php foreach ( $order->get_items() as $item_id => $item ) : ?>
					<tr>
						<td>
							<?php echo esc_html( $item->get_name() ); ?>
							<?php
							$product = $item instanceof WC_Order_Item_Product ? $item->get_product() : null;
							if ( $product && $product->get_sku() ) :
								?>
								<span class="lot mono"><?php echo esc_html( sprintf( __( 'SKU %s', 'north-specs-labs' ), $product->get_sku() ) ); ?></span>
							<?php endif; ?>
							<?php if ( ! empty( $records[ $item_id ] ) ) : ?>
								<span class="lot mono"><?php echo esc_html( sprintf( __( 'Lot %s', 'north-specs-labs' ), $records[ $item_id ] ) ); ?></span>
							<?php endif; ?>
						</td>
						<td class="num"><?php echo esc_html( (string) $item->get_quantity() ); ?></td>
						<td class="num"><?php echo wp_kses_post( $order->get_formatted_line_subtotal( $item ) ); ?></td>
					</tr>
				<?php endforeach; ?>
			</tbody>
			<tfoot>
				<?php foreach ( $order->get_order_item_totals() as $total ) : ?>
					<tr>
						<td colspan="2" class="num"><?php echo esc_html( $total['label'] ); ?></td>
						<td class="num"><?php echo wp_kses_post( $total['value'] ); ?></td>
					</tr>
				<?php endforeach; ?>
			</tfoot>
		</table>

		<?php if ( ! $order->is_paid() ) : ?>
			<p class="notice"><strong><?php esc_html_e( 'This is not a paid invoice.', 'north-specs-labs' ); ?></strong> <?php echo esc_html( $meaning['note'] ); ?></p>
		<?php elseif ( $paid_date ) : ?>
			<p class="notice"><strong><?php esc_html_e( 'Payment received.', 'north-specs-labs' ); ?></strong> <?php echo esc_html( sprintf( __( 'Recorded on %s.', 'north-specs-labs' ), wc_format_datetime( $paid_date ) ) ); ?></p>
		<?php endif; ?>

		<footer class="foot">
			<p><strong><?php esc_html_e( 'Research Use Only.', 'north-specs-labs' ); ?></strong> <?php esc_html_e( 'All items supplied are strictly for controlled in-vitro laboratory research. They are not for use in or on humans or animals, consumption, administration, diagnosis or treatment.', 'north-specs-labs' ); ?></p>
			<p><?php echo esc_html( sprintf( __( 'Receipt generated %s. Retain with your receiving documentation.', 'north-specs-labs' ), date_i18n( get_option( 'date_format' ) . ' ' . get_option( 'time_format' ) ) ) ); ?></p>
		</footer>
	</div>
	<script>
		window.dataLayer = window.dataLayer || [];
		window.dataLayer.push(<?php echo wp_json_encode( array( 'event' => 'order_receipt_download', 'order_status' => $order->get_status(), 'paid' => $order->is_paid() ) ); ?>);
	</script>
</body>
</html>
	<?php
}

/** A signed-out visitor who followed a receipt link needs an explanation. */
add_action(
	'woocommerce_before_customer_login_form',
	function (): void {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( isset( $_GET['receipt'] ) && 'signin' === sanitize_key( wp_unslash( $_GET['receipt'] ) ) ) {
			wc_print_notice( esc_html__( 'Sign in to open that receipt, or use the link in your order confirmation email.', 'north-specs-labs' ), 'notice' );
		}
	},
	5
);
