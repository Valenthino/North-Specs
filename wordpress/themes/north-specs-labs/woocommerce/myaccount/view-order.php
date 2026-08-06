<?php
/**
 * Single order detail.
 *
 * Overrides woocommerce/myaccount/view-order.php. The timeline, tracking,
 * actions and batch documents are attached to woocommerce_view_order.
 *
 * @package NorthSpecsLabs
 */

defined( 'ABSPATH' ) || exit;

$nsl_notes = $order->get_customer_order_notes();
?>

<div class="nsl-order-detail">
	<header class="nsl-order-detail__head">
		<div>
			<p class="nsl-mono nsl-order-detail__number"><?php echo esc_html( '#' . $order->get_order_number() ); ?></p>
			<h2><?php echo esc_html( sprintf( __( 'Placed on %s', 'north-specs-labs' ), wc_format_datetime( $order->get_date_created() ) ) ); ?></h2>
		</div>
		<?php nsl_render_status_badge( $order ); ?>
	</header>

	<?php do_action( 'woocommerce_view_order', $order_id ); ?>

	<?php if ( $nsl_notes ) : ?>
		<section class="nsl-order-updates" aria-labelledby="nsl-order-updates-title">
			<h2 id="nsl-order-updates-title"><?php esc_html_e( 'Order updates', 'north-specs-labs' ); ?></h2>
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
</div>
