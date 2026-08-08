<?php
/**
 * Delivery address fields.
 *
 * The stock template gates these behind a "Ship to a different address?"
 * checkbox because WooCommerce treats billing as the primary address. Here the
 * delivery address is the primary one and is always collected; the billing
 * address is the optional variation, offered on the next step.
 *
 * @package NorthSpecsLabs
 */

defined( 'ABSPATH' ) || exit;
?>
<div class="woocommerce-shipping-fields nsl-shipping-fields">
	<?php if ( true === WC()->cart->needs_shipping_address() ) : ?>

		<h3 class="nsl-fieldset-title" id="ship-to-different-address"><?php esc_html_e( 'Delivery address', 'north-specs-labs' ); ?></h3>

		<?php
		/*
		 * WooCommerce reads this checkbox to decide whether to store a separate
		 * shipping address. It is always on here, so it is submitted as a hidden
		 * value rather than shown as a question the customer cannot answer.
		 */
		?>
		<input type="hidden" name="ship_to_different_address" value="1" />

		<div class="shipping_address">

			<?php do_action( 'woocommerce_before_checkout_shipping_form', $checkout ); ?>

			<div class="woocommerce-shipping-fields__field-wrapper">
				<?php
				$fields = $checkout->get_checkout_fields( 'shipping' );

				foreach ( $fields as $key => $field ) {
					woocommerce_form_field( $key, $field, $checkout->get_value( $key ) );
				}
				?>
			</div>

			<?php do_action( 'woocommerce_after_checkout_shipping_form', $checkout ); ?>

		</div>

	<?php endif; ?>
</div>

<div class="woocommerce-additional-fields">
	<?php do_action( 'woocommerce_before_order_notes', $checkout ); ?>

	<?php if ( apply_filters( 'woocommerce_enable_order_notes_field', 'yes' === get_option( 'woocommerce_enable_order_comments', 'yes' ) ) ) : ?>

		<?php if ( ! WC()->cart->needs_shipping() || wc_ship_to_billing_address_only() ) : ?>
			<h3 class="nsl-fieldset-title"><?php esc_html_e( 'Additional information', 'north-specs-labs' ); ?></h3>
		<?php endif; ?>

		<div class="woocommerce-additional-fields__field-wrapper">
			<?php foreach ( $checkout->get_checkout_fields( 'order' ) as $key => $field ) : ?>
				<?php woocommerce_form_field( $key, $field, $checkout->get_value( $key ) ); ?>
			<?php endforeach; ?>
		</div>

	<?php endif; ?>

	<?php do_action( 'woocommerce_after_order_notes', $checkout ); ?>
</div>
