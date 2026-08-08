<?php
/**
 * Staged checkout form.
 *
 * One form, posted once, presented as three panels. The progress indicator and
 * the panel navigation are added by assets/js/checkout.js; with scripting off
 * every panel is open and this is the ordinary WooCommerce checkout.
 *
 * @package NorthSpecsLabs
 */

defined( 'ABSPATH' ) || exit;

do_action( 'woocommerce_before_checkout_form', $checkout );

if ( ! $checkout->is_registration_enabled() && $checkout->is_registration_required() && ! is_user_logged_in() ) {
	echo esc_html( apply_filters( 'woocommerce_checkout_must_be_logged_in_message', __( 'You must be logged in to checkout.', 'woocommerce' ) ) );
	return;
}
?>
<form name="checkout" method="post" class="checkout woocommerce-checkout nsl-checkout" action="<?php echo esc_url( wc_get_checkout_url() ); ?>" enctype="multipart/form-data" aria-label="<?php esc_attr_e( 'Checkout', 'north-specs-labs' ); ?>">

	<div class="nsl-checkout__progress" data-nsl-progress hidden></div>

	<?php if ( $checkout->get_checkout_fields() ) : ?>

		<?php do_action( 'woocommerce_checkout_before_customer_details' ); ?>

		<section class="nsl-step" data-nsl-step="1" aria-labelledby="nsl-step-1-title">
			<h2 class="nsl-step__title" id="nsl-step-1-title"><?php esc_html_e( 'Delivery details', 'north-specs-labs' ); ?></h2>
			<p class="nsl-step__lede"><?php esc_html_e( 'Where should this order ship, and how do we reach you about it?', 'north-specs-labs' ); ?></p>

			<div class="nsl-step__contact" data-nsl-contact>
				<h3 class="nsl-fieldset-title"><?php esc_html_e( 'Contact', 'north-specs-labs' ); ?></h3>
				<div class="nsl-contact-slot" data-nsl-contact-slot></div>
			</div>

			<?php do_action( 'woocommerce_checkout_shipping' ); ?>

			<div class="nsl-step__nav" data-nsl-nav="1"></div>
		</section>

		<section class="nsl-step" data-nsl-step="2" aria-labelledby="nsl-step-2-title">
			<h2 class="nsl-step__title" id="nsl-step-2-title"><?php esc_html_e( 'Billing and research details', 'north-specs-labs' ); ?></h2>
			<p class="nsl-step__lede"><?php esc_html_e( 'Confirm the billing address and the laboratory this order is for.', 'north-specs-labs' ); ?></p>

			<?php do_action( 'woocommerce_checkout_billing' ); ?>

			<div class="nsl-step__nav" data-nsl-nav="2"></div>
		</section>

		<?php do_action( 'woocommerce_checkout_after_customer_details' ); ?>

	<?php endif; ?>

	<section class="nsl-step" data-nsl-step="3" aria-labelledby="order_review_heading">

		<?php do_action( 'woocommerce_checkout_before_order_review_heading' ); ?>

		<h2 class="nsl-step__title" id="order_review_heading"><?php esc_html_e( 'Review and payment', 'north-specs-labs' ); ?></h2>
		<p class="nsl-step__lede"><?php esc_html_e( 'Check the order, confirm the research-use terms, then pay.', 'north-specs-labs' ); ?></p>

		<div class="nsl-step__summary" data-nsl-summary></div>

		<?php do_action( 'woocommerce_checkout_before_order_review' ); ?>

		<div id="order_review" class="woocommerce-checkout-review-order">
			<?php do_action( 'woocommerce_checkout_order_review' ); ?>
		</div>

		<?php do_action( 'woocommerce_checkout_after_order_review' ); ?>

		<div class="nsl-step__nav" data-nsl-nav="3"></div>
	</section>

</form>

<?php do_action( 'woocommerce_after_checkout_form', $checkout ); ?>
