<?php
/**
 * Theme helpers.
 *
 * @package NorthSpecsLabs
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Return a page URL by slug, with a safe fallback. */
function nsl_page_url( string $slug, string $fallback = '/' ): string {
	$page = get_page_by_path( $slug );
	if ( ! $page instanceof WP_Post ) {
		$matches = get_posts(
			array(
				'post_type'      => 'page',
				'post_status'    => 'publish',
				'name'           => sanitize_title( $slug ),
				'posts_per_page' => 1,
				'orderby'        => 'ID',
				'order'          => 'DESC',
			)
		);
		$page = $matches ? $matches[0] : null;
	}
	return $page instanceof WP_Post ? get_permalink( $page ) : home_url( $fallback );
}

/** Return the WooCommerce shop URL when available. */
function nsl_shop_url(): string {
	return function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'shop' ) : home_url( '/shop/' );
}

/** Return the current cart count without requiring WooCommerce to be active. */
function nsl_cart_count(): int {
	return function_exists( 'WC' ) && WC()->cart ? (int) WC()->cart->get_cart_contents_count() : 0;
}

/** Render the North Specs brand mark. */
function nsl_brand( bool $compact = false ): void {
	$label = $compact ? 'North Specs' : 'North Specs Labs';
	?>
	<a class="nsl-brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="<?php echo esc_attr( $label . ' home' ); ?>">
		<svg class="nsl-brand__mark" viewBox="0 0 52 60" aria-hidden="true" focusable="false">
			<path d="M26 1.8 49 15v30L26 58.2 3 45V15z" fill="none" stroke="currentColor" stroke-width="3"/>
			<path d="M13.5 42V18l7-4 13.5 21V18l5-3v27l-7 4-13.5-21v14z" fill="currentColor"/>
		</svg>
		<span class="nsl-brand__type"><strong>NORTH</strong><span>SPECS LABS</span></span>
	</a>
	<?php
}

/** Small inline icons used throughout the theme. */
function nsl_icon( string $name, string $class = '' ): string {
	$icons = array(
		'arrow'   => '<path d="M5 12h14M13 6l6 6-6 6"/>',
		'cart'    => '<path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L20 7H6M10 20h.01M17 20h.01"/>',
		'user'    => '<circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/>',
		'search'  => '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
		'menu'    => '<path d="M4 7h16M4 12h16M4 17h16"/>',
		'close'   => '<path d="m6 6 12 12M18 6 6 18"/>',
		'flask'   => '<path d="M9 3h6M10 3v6l-5.5 9.2A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-2.8L14 9V3M8 15h8"/>',
		'check'   => '<path d="m5 12 4 4L19 6"/>',
		'package' => '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9"/>',
		'file'    => '<path d="M6 3h8l4 4v14H6zM14 3v5h4M9 13h6M9 17h6"/>',
		'lock'    => '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
		'calendar'=> '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
	);

	if ( ! isset( $icons[ $name ] ) ) {
		return '';
	}

	return sprintf(
		'<svg class="nsl-icon %1$s" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">%2$s</svg>',
		esc_attr( $class ),
		$icons[ $name ]
	);
}

/** Detect legacy Divi content so raw builder shortcodes never reach visitors. */
function nsl_has_legacy_builder_content( string $content ): bool {
	return str_contains( $content, '[et_pb_' ) || str_contains( $content, 'et_pb_section' );
}

/** Render an eyebrow label. */
function nsl_eyebrow( string $text, bool $light = false ): void {
	printf( '<p class="nsl-eyebrow%2$s">%1$s</p>', esc_html( $text ), $light ? ' nsl-eyebrow--light' : '' );
}

/** Estimate reading time for an article. */
function nsl_reading_time( int $post_id = 0 ): int {
	$post_id = $post_id ?: get_the_ID();
	$stored  = absint( get_post_meta( $post_id, '_nsl_reading_minutes', true ) );
	if ( $stored ) {
		return $stored;
	}
	$words   = str_word_count( wp_strip_all_tags( (string) get_post_field( 'post_content', $post_id ) ) );
	return max( 1, (int) ceil( $words / 220 ) );
}

/** Render a consistent custom product card on editorial pages. */
function nsl_product_card( WC_Product $product ): void {
	$url       = $product->get_permalink();
	$image_id  = $product->get_image_id();
	$cart_url  = $product->is_purchasable() && $product->is_in_stock() ? $product->add_to_cart_url() : $url;
	$cart_text = $product->is_purchasable() && $product->is_in_stock() ? __( 'Add to cart', 'north-specs-labs' ) : __( 'View compound', 'north-specs-labs' );
	?>
	<article class="nsl-product-card" data-product-id="<?php echo esc_attr( (string) $product->get_id() ); ?>">
		<a class="nsl-product-card__image" href="<?php echo esc_url( $url ); ?>">
			<span class="nsl-product-ruo">RUO</span>
			<?php echo $image_id ? wp_get_attachment_image( $image_id, 'woocommerce_thumbnail', false, array( 'loading' => 'lazy', 'alt' => $product->get_name() ) ) : wc_placeholder_img( 'woocommerce_thumbnail' ); ?>
		</a>
		<div class="nsl-product-card__body">
			<p class="nsl-product-card__meta"><?php echo nsl_icon( 'file' ); ?><?php esc_html_e( 'Batch documentation', 'north-specs-labs' ); ?></p>
			<h3><a href="<?php echo esc_url( $url ); ?>"><?php echo esc_html( $product->get_name() ); ?></a></h3>
			<div class="nsl-product-card__footer">
				<span class="price"><?php echo wp_kses_post( $product->get_price_html() ); ?></span>
				<a class="nsl-card-cart <?php echo esc_attr( implode( ' ', array_filter( array( 'button', 'product_type_' . $product->get_type(), $product->supports( 'ajax_add_to_cart' ) ? 'add_to_cart_button ajax_add_to_cart' : '' ) ) ) ); ?>" href="<?php echo esc_url( $cart_url ); ?>" data-quantity="1" data-product_id="<?php echo esc_attr( (string) $product->get_id() ); ?>" aria-label="<?php echo esc_attr( $cart_text . ': ' . $product->get_name() ); ?>">
					<?php echo nsl_icon( 'cart' ); ?><span><?php echo esc_html( $cart_text ); ?></span>
				</a>
			</div>
		</div>
	</article>
	<?php
}
