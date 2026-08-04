<?php
/** Search results. @package NorthSpecsLabs */
get_header();
?>
<section class="nsl-page-hero"><div class="nsl-shell"><?php nsl_eyebrow( 'Search' ); ?><h1><?php echo esc_html( sprintf( __( 'Results for “%s”', 'north-specs-labs' ), get_search_query() ) ); ?></h1></div></section>
<section class="nsl-section"><div class="nsl-shell"><div class="nsl-article-grid"><?php if ( have_posts() ) : while ( have_posts() ) : the_post(); if ( 'product' === get_post_type() && function_exists( 'wc_get_product' ) ) { $product = wc_get_product( get_the_ID() ); if ( $product ) { nsl_product_card( $product ); } } else { get_template_part( 'template-parts/article', 'card' ); } endwhile; else : ?><p><?php esc_html_e( 'No matching compounds or research briefings were found.', 'north-specs-labs' ); ?></p><?php endif; ?></div><?php the_posts_pagination(); ?></div></section>
<?php get_footer(); ?>
