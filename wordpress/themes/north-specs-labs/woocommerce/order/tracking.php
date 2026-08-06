<?php
/**
 * Guest order tracking result.
 *
 * Overrides woocommerce/order/tracking.php. The timeline, tracking panel and
 * support route are attached to woocommerce_view_order.
 *
 * @package NorthSpecsLabs
 */

defined( 'ABSPATH' ) || exit;

$nsl_notes = $order->get_customer_order_notes();
?>

<div class="nsl-tracking-result">
	<header class="nsl-order-detail__head">
		<div>
			<p class="nsl-mono nsl-order-detail__number"><?php echo esc_html( '#' . $order->get_order_number() ); ?></p>
			<h2><?php echo esc_html( sprintf( __( 'Placed on %s', 'north-specs-labs' ), wc_format_datetime( $order->get_date_created() ) ) ); ?></h2>
		</div>
		<?php nsl_render_status_badge( $order ); ?>
	</header>

	<?php do_action( 'woocommerce_view_order', $order->get_id() ); ?>

	<?php if ( $nsl_notes ) : ?>
		<section class="nsl-order-updates" aria-labelledby="nsl-tracking-updates-title">
			<h2 id="nsl-tracking-updates-title"><?php esc_html_e( 'Order updates', 'north-specs-labs' ); ?></h2>
			<ol class="woocommerce-OrderUpdates">
				<?php foreach ( $nsl_notes as $nsl_note ) : ?>
					<li>
						<time datetime="<?php echo esc_attr( gmdate( 'c', strtotime( $nsl_note->comment_date_gmt ) ) ); ?>"><?php echo esc_html( date_i18n( get_option( 'date_format' ) . ', ' . get_option( 'time_format' ), strtotime( $nsl_note->comment_date ) ) ); ?></time>
						<div><?php echo wp_kses_post( wpautop( wptexturize( $nsl_note->comment_content ) ) ); ?></div>
					</li>
				<?php endforeach; ?>
			</ol>
		</section>
	<?php endif; ?>

	<?php if ( ! is_user_logged_in() ) : ?>
		<section class="nsl-tracking-signin" aria-labelledby="nsl-tracking-signin-title">
			<?php echo nsl_icon( 'user' ); ?>
			<div>
				<h2 id="nsl-tracking-signin-title"><?php esc_html_e( 'See every past order in one place', 'north-specs-labs' ); ?></h2>
				<p><?php esc_html_e( 'Signing in to your researcher account shows all orders, live tracking, printable receipts and the batch document for each supplied lot — without a lookup each time.', 'north-specs-labs' ); ?></p>
			</div>
			<a class="nsl-button" href="<?php echo esc_url( wc_get_page_permalink( 'myaccount' ) ); ?>"><?php esc_html_e( 'Sign in', 'north-specs-labs' ); ?><?php echo nsl_icon( 'arrow' ); ?></a>
		</section>
	<?php else : ?>
		<p class="nsl-tracking-result__account">
			<a class="nsl-text-link" href="<?php echo esc_url( wc_get_account_endpoint_url( 'orders' ) ); ?>"><?php esc_html_e( 'Open your full order history', 'north-specs-labs' ); ?><?php echo nsl_icon( 'arrow' ); ?></a>
		</p>
	<?php endif; ?>
</div>
