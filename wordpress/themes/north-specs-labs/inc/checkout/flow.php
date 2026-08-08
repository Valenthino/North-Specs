<?php
/**
 * Staged checkout.
 *
 * The single checkout form is presented as three steps — delivery, billing and
 * research details, then payment — with a progress indicator. The form still
 * posts once, so WooCommerce validation, the AJAX order review and the payment
 * gateways all behave exactly as they do on the stock checkout.
 *
 * Without JavaScript every panel is visible and the checkout degrades to the
 * ordinary single-page form.
 *
 * @package NorthSpecsLabs
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Address components copied from shipping to billing when the customer says the
 * two are the same. Email and phone are deliberately absent: they are contact
 * details, collected once, and have no shipping counterpart.
 *
 * @return string[]
 */
function nsl_address_parts(): array {
	return array( 'first_name', 'last_name', 'company', 'address_1', 'address_2', 'city', 'state', 'postcode', 'country' );
}

/** The staged checkout always collects a shipping address of its own. */
add_filter( 'woocommerce_ship_to_different_address_checked', '__return_true' );

/** Guest checkout is permitted; an account is offered, never demanded. */
add_filter( 'woocommerce_checkout_registration_required', '__return_false' );
add_filter( 'woocommerce_checkout_registration_enabled', '__return_true' );

/**
 * Order the delivery step so it reads top to bottom: who, then where.
 *
 * @param array<string,array<string,mixed>> $fields Checkout fields.
 * @return array<string,array<string,mixed>>
 */
add_filter(
	'woocommerce_checkout_fields',
	function ( array $fields ): array {
		$priorities = array(
			'first_name' => 10,
			'last_name'  => 20,
			'country'    => 30,
			'address_1'  => 40,
			'address_2'  => 50,
			'city'       => 60,
			'state'      => 70,
			'postcode'   => 80,
		);

		foreach ( array( 'billing', 'shipping' ) as $group ) {
			foreach ( $priorities as $part => $priority ) {
				if ( isset( $fields[ $group ][ $group . '_' . $part ] ) ) {
					$fields[ $group ][ $group . '_' . $part ]['priority'] = $priority;
				}
			}
		}

		if ( isset( $fields['billing']['billing_email'] ) ) {
			$fields['billing']['billing_email']['priority'] = 5;
			$fields['billing']['billing_email']['label']    = __( 'Email address', 'north-specs-labs' );
			$fields['billing']['billing_email']['description'] = __( 'Order confirmation, batch documentation and tracking are sent here.', 'north-specs-labs' );
		}

		if ( isset( $fields['billing']['billing_phone'] ) ) {
			$fields['billing']['billing_phone']['priority'] = 6;
			$fields['billing']['billing_phone']['label']    = __( 'Phone', 'north-specs-labs' );
			$fields['billing']['billing_phone']['description'] = __( 'Used by the carrier for delivery questions only.', 'north-specs-labs' );
		}

		// Research identity belongs with billing, after the address.
		foreach ( array( 'billing_research_organization' => 200, 'billing_research_role' => 210 ) as $field => $priority ) {
			if ( isset( $fields['billing'][ $field ] ) ) {
				$fields['billing'][ $field ]['priority'] = $priority;
			}
		}

		return $fields;
	},
	20
);

/**
 * The "billing address is the same" control, at the head of the billing step.
 */
add_action(
	'woocommerce_before_checkout_billing_form',
	function (): void {
		$same = ! isset( $_POST['nsl_billing_same'] ) || '' !== wc_clean( wp_unslash( (string) ( $_POST['nsl_billing_same'] ?? '1' ) ) ); // phpcs:ignore WordPress.Security.NonceVerification.Missing
		?>
		<div class="nsl-billing-same">
			<label for="nsl_billing_same">
				<input type="checkbox" name="nsl_billing_same" id="nsl_billing_same" value="1" <?php checked( $same ); ?> />
				<span><?php esc_html_e( 'My billing address is the same as my delivery address', 'north-specs-labs' ); ?></span>
			</label>
			<p class="nsl-billing-same__hint"><?php esc_html_e( 'Clear this only if your card or bank statement uses a different address.', 'north-specs-labs' ); ?></p>
		</div>
		<?php
	},
	5
);

/**
 * Mirror the delivery address onto billing when the customer says they match.
 *
 * Done server-side so the order is correct even if the browser copy never ran.
 *
 * @param array<string,mixed> $data Posted checkout data.
 * @return array<string,mixed>
 */
add_filter(
	'woocommerce_checkout_posted_data',
	function ( array $data ): array {
		if ( empty( $_POST['nsl_billing_same'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Missing
			return $data;
		}

		foreach ( nsl_address_parts() as $part ) {
			if ( isset( $data[ 'shipping_' . $part ] ) ) {
				$data[ 'billing_' . $part ] = $data[ 'shipping_' . $part ];
			}
		}

		return $data;
	},
	20
);

/** Checkout assets. */
add_action(
	'wp_enqueue_scripts',
	function (): void {
		if ( ! function_exists( 'is_checkout' ) || ! is_checkout() || is_order_received_page() ) {
			return;
		}

		$css = NSL_THEME_DIR . '/assets/css/checkout.css';
		$js  = NSL_THEME_DIR . '/assets/js/checkout.js';

		wp_enqueue_style(
			'nsl-checkout',
			NSL_THEME_URI . '/assets/css/checkout.css',
			array( 'nsl-main' ),
			file_exists( $css ) ? (string) filemtime( $css ) : NSL_THEME_VERSION
		);

		wp_enqueue_script(
			'nsl-checkout',
			NSL_THEME_URI . '/assets/js/checkout.js',
			array( 'jquery' ),
			file_exists( $js ) ? (string) filemtime( $js ) : NSL_THEME_VERSION,
			true
		);

		$data = apply_filters(
			'nsl_checkout_script_data',
			array(
				'steps'   => array(
					array(
						'title' => __( 'Delivery', 'north-specs-labs' ),
						'hint'  => __( 'Where the order ships', 'north-specs-labs' ),
					),
					array(
						'title' => __( 'Billing and research', 'north-specs-labs' ),
						'hint'  => __( 'Who the order is for', 'north-specs-labs' ),
					),
					array(
						'title' => __( 'Payment', 'north-specs-labs' ),
						'hint'  => __( 'Review and pay', 'north-specs-labs' ),
					),
				),
				'i18n'    => array(
					'continue'   => __( 'Continue', 'north-specs-labs' ),
					'back'       => __( 'Back', 'north-specs-labs' ),
					'stepOf'     => __( 'Step %1$d of %2$d', 'north-specs-labs' ),
					'incomplete' => __( 'Complete the highlighted fields to continue.', 'north-specs-labs' ),
					'edit'       => __( 'Edit', 'north-specs-labs' ),
					'required'   => __( 'This field is required.', 'north-specs-labs' ),
					'email'      => __( 'Enter a valid email address.', 'north-specs-labs' ),
				),
				'parts'   => nsl_address_parts(),
			)
		);

		wp_localize_script( 'nsl-checkout', 'nslCheckout', $data );
	},
	20
);
