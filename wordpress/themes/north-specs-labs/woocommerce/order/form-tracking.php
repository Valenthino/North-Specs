<?php
/**
 * Guest order lookup form.
 *
 * Overrides woocommerce/order/form-tracking.php.
 *
 * @package NorthSpecsLabs
 */

defined( 'ABSPATH' ) || exit;

global $post;

// phpcs:disable WordPress.Security.NonceVerification.Recommended -- presentation only; WooCommerce verifies the lookup itself.
$nsl_attempted = isset( $_REQUEST['orderid'] ) || isset( $_REQUEST['order_email'] );
$nsl_order_id  = isset( $_REQUEST['orderid'] ) ? esc_attr( wp_unslash( $_REQUEST['orderid'] ) ) : '';
$nsl_email     = isset( $_REQUEST['order_email'] ) ? esc_attr( wp_unslash( $_REQUEST['order_email'] ) ) : '';
// phpcs:enable

// Reaching this template after an attempt means the lookup did not resolve.
if ( $nsl_attempted && function_exists( 'nsl_analytics_order_lookup' ) ) {
	nsl_analytics_order_lookup( 'failure', 'no_match' );
}
?>

<form action="<?php echo esc_url( get_permalink( $post->ID ) ); ?>" method="post" class="woocommerce-form woocommerce-form-track-order track_order nsl-tracking-form">

	<?php do_action( 'woocommerce_order_tracking_form_start' ); ?>

	<div class="nsl-tracking-form__fields">
		<p class="form-row">
			<label for="orderid"><?php esc_html_e( 'Order number', 'north-specs-labs' ); ?></label>
			<input class="input-text" type="text" name="orderid" id="orderid" value="<?php echo $nsl_order_id; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped above. ?>" inputmode="numeric" placeholder="<?php esc_attr_e( 'e.g. 348', 'north-specs-labs' ); ?>" autocomplete="off">
			<small><?php esc_html_e( 'Shown at the top of your order confirmation email, with or without the # sign.', 'north-specs-labs' ); ?></small>
		</p>
		<p class="form-row">
			<label for="order_email"><?php esc_html_e( 'Billing email address', 'north-specs-labs' ); ?></label>
			<input class="input-text" type="email" name="order_email" id="order_email" value="<?php echo $nsl_email; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped above. ?>" autocomplete="email" placeholder="<?php esc_attr_e( 'The address used at checkout', 'north-specs-labs' ); ?>">
			<small><?php esc_html_e( 'Must match the billing address on the order exactly.', 'north-specs-labs' ); ?></small>
		</p>
	</div>

	<?php do_action( 'woocommerce_order_tracking_form' ); ?>

	<p class="form-row nsl-tracking-form__submit">
		<button type="submit" class="nsl-button" name="track" value="<?php esc_attr_e( 'Find my order', 'north-specs-labs' ); ?>"><?php esc_html_e( 'Find my order', 'north-specs-labs' ); ?><?php echo nsl_icon( 'arrow' ); ?></button>
	</p>
	<?php wp_nonce_field( 'woocommerce-order_tracking', 'woocommerce-order-tracking-nonce' ); ?>

	<?php do_action( 'woocommerce_order_tracking_form_end' ); ?>

</form>

<?php if ( $nsl_attempted ) : ?>
	<div class="nsl-tracking-help" role="note">
		<h3><?php esc_html_e( 'If the lookup did not find your order', 'north-specs-labs' ); ?></h3>
		<ul>
			<li><?php esc_html_e( 'Use the order number exactly as it appears in your confirmation email — not the payment or invoice reference.', 'north-specs-labs' ); ?></li>
			<li><?php esc_html_e( 'Use the billing email address entered at checkout, which may differ from the delivery contact.', 'north-specs-labs' ); ?></li>
			<li><?php esc_html_e( 'Orders placed on a shared laboratory account are visible by signing in rather than by lookup.', 'north-specs-labs' ); ?></li>
		</ul>
		<a class="nsl-text-link" href="<?php echo esc_url( nsl_page_url( 'contact', '/contact/' ) ); ?>"><?php esc_html_e( 'Ask research support to locate the order', 'north-specs-labs' ); ?><?php echo nsl_icon( 'arrow' ); ?></a>
	</div>
<?php endif; ?>
