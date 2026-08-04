<?php
/** WooCommerce wrapper. @package NorthSpecsLabs */
get_header();
?>
<?php if ( is_shop() || is_product_taxonomy() ) : ?>
	<section class="nsl-commerce-hero">
		<div class="nsl-shell">
			<?php nsl_eyebrow( 'Research catalogue' ); ?>
			<h1><?php echo esc_html( is_shop() ? 'Peptides for laboratory research' : single_term_title( '', false ) ); ?></h1>
			<p><?php esc_html_e( 'Browse independently documented research compounds. Every item is designated strictly for qualified laboratory research use only.', 'north-specs-labs' ); ?></p>
		</div>
	</section>
<?php endif; ?>
<div class="nsl-shell nsl-woocommerce-wrap"><?php woocommerce_content(); ?></div>
<?php get_footer(); ?>
