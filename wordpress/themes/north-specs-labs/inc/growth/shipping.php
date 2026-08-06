<?php
/**
 * Free-dispatch threshold and the progress a researcher can see.
 *
 * A flat $20 dispatch charge is a third of the price of the cheapest vial, and
 * it is only revealed at checkout. A stated threshold does two things: it makes
 * the charge avoidable, and it gives a reason to add the second vial.
 *
 * @package NorthSpecsLabs
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** The configured threshold, or 0 when the incentive is switched off. */
function nsl_free_shipping_threshold(): float {
	return (float) get_option( 'nsl_free_shipping_threshold', 150 );
}

/** Ensure the Canada zone actually carries a matching free-shipping method. */
function nsl_sync_free_shipping(): void {
	if ( ! class_exists( 'WC_Shipping_Zones' ) ) {
		return;
	}

	$threshold = nsl_free_shipping_threshold();
	$zone      = null;

	foreach ( WC_Shipping_Zones::get_zones() as $zone_data ) {
		$candidate = WC_Shipping_Zones::get_zone( (int) $zone_data['id'] );
		if ( $candidate && 'Canada' === $candidate->get_zone_name() ) {
			$zone = $candidate;
			break;
		}
	}

	if ( ! $zone ) {
		return;
	}

	$existing = null;
	foreach ( $zone->get_shipping_methods() as $method ) {
		if ( 'free_shipping' === $method->id ) {
			$existing = $method;
			break;
		}
	}

	if ( $threshold <= 0 ) {
		if ( $existing ) {
			$existing->update_option( 'enabled', 'no' );
			$zone->save();
		}

		return;
	}

	if ( ! $existing ) {
		$instance_id = $zone->add_shipping_method( 'free_shipping' );
		$zone->save();
		$existing = WC_Shipping_Zones::get_shipping_method( $instance_id );
	}

	if ( ! $existing ) {
		return;
	}

	$existing->instance_settings['title']            = __( 'Free laboratory dispatch', 'north-specs-labs' );
	$existing->instance_settings['requires']         = 'min_amount';
	$existing->instance_settings['min_amount']       = (string) $threshold;
	$existing->instance_settings['ignore_discounts'] = 'no';
	update_option( $existing->get_instance_option_key(), $existing->instance_settings );
}

/** Re-sync whenever the threshold changes, and once on release. */
add_action(
	'init',
	function (): void {
		$signature = NSL_THEME_VERSION . '|' . nsl_free_shipping_threshold();
		if ( get_option( 'nsl_free_shipping_signature' ) === $signature ) {
			return;
		}

		nsl_sync_free_shipping();
		update_option( 'nsl_free_shipping_signature', $signature, false );
	},
	40
);

/**
 * Once free dispatch is earned, the paid rate is noise.
 *
 * Leaving both on screen invites a researcher to pick the $20 option by
 * accident and feel misled afterwards.
 */
add_filter(
	'woocommerce_package_rates',
	function ( array $rates ): array {
		$free = array();
		foreach ( $rates as $key => $rate ) {
			if ( 'free_shipping' === $rate->get_method_id() ) {
				$free[ $key ] = $rate;
			}
		}

		return $free ? $free : $rates;
	},
	100
);

/** How far the cart is from free dispatch. */
function nsl_free_shipping_progress(): ?array {
	$threshold = nsl_free_shipping_threshold();
	if ( $threshold <= 0 || ! function_exists( 'WC' ) || ! WC()->cart || WC()->cart->is_empty() ) {
		return null;
	}

	// Compare on the same basis the shipping method uses: subtotal after discounts.
	$subtotal = (float) WC()->cart->get_displayed_subtotal();
	if ( WC()->cart->display_prices_including_tax() ) {
		$subtotal = round( $subtotal - (float) WC()->cart->get_discount_tax(), wc_get_price_decimals() );
	}
	$subtotal -= (float) WC()->cart->get_discount_total();

	$remaining = max( 0, $threshold - $subtotal );

	return array(
		'threshold' => $threshold,
		'subtotal'  => $subtotal,
		'remaining' => $remaining,
		'earned'    => $remaining <= 0,
		'percent'   => $threshold > 0 ? min( 100, ( $subtotal / $threshold ) * 100 ) : 0,
	);
}

/** The progress bar shown on the cart and checkout. */
function nsl_render_free_shipping_progress(): void {
	$progress = nsl_free_shipping_progress();
	if ( ! $progress ) {
		return;
	}
	?>
	<div class="nsl-ship-progress <?php echo $progress['earned'] ? 'is-earned' : ''; ?>" role="status">
		<p>
			<?php echo nsl_icon( $progress['earned'] ? 'check' : 'package' ); ?>
			<span>
				<?php if ( $progress['earned'] ) : ?>
					<strong><?php esc_html_e( 'Free dispatch applied.', 'north-specs-labs' ); ?></strong>
					<?php esc_html_e( 'This order ships at no additional charge.', 'north-specs-labs' ); ?>
				<?php else : ?>
					<strong><?php echo wp_kses_post( sprintf( __( '%s from free dispatch.', 'north-specs-labs' ), wc_price( $progress['remaining'] ) ) ); ?></strong>
					<?php echo esc_html( sprintf( __( 'Orders over %s ship free across Canada.', 'north-specs-labs' ), wp_strip_all_tags( wc_price( $progress['threshold'] ) ) ) ); ?>
				<?php endif; ?>
			</span>
		</p>
		<div class="nsl-ship-progress__track" aria-hidden="true">
			<span style="width:<?php echo esc_attr( (string) round( $progress['percent'] ) ); ?>%"></span>
		</div>
	</div>
	<?php
}

add_action( 'woocommerce_before_cart_table', 'nsl_render_free_shipping_progress', 5 );
add_action( 'woocommerce_before_checkout_form', 'nsl_render_free_shipping_progress', 5 );

/** State the threshold on the product page, before the cart is even started. */
add_action(
	'woocommerce_single_product_summary',
	function (): void {
		$threshold = nsl_free_shipping_threshold();
		if ( $threshold <= 0 ) {
			return;
		}
		?>
		<p class="nsl-ship-hint">
			<?php echo nsl_icon( 'package' ); ?>
			<span><?php echo esc_html( sprintf( __( 'Free dispatch across Canada on orders over %s.', 'north-specs-labs' ), wp_strip_all_tags( wc_price( $threshold ) ) ) ); ?></span>
		</p>
		<?php
	},
	28
);

/** Keep the bar accurate when the cart is updated over AJAX. */
add_filter(
	'woocommerce_add_to_cart_fragments',
	function ( array $fragments ): array {
		ob_start();
		echo '<div class="nsl-ship-progress-slot">';
		nsl_render_free_shipping_progress();
		echo '</div>';
		$fragments['.nsl-ship-progress-slot'] = ob_get_clean();

		return $fragments;
	}
);
