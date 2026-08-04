<?php
/** Research library index. @package NorthSpecsLabs */
get_header();
?>
<section class="nsl-page-hero nsl-page-hero--library"><div class="nsl-shell"><?php nsl_eyebrow( 'Research notes & methods' ); ?><h1><?php esc_html_e( 'The North Specs research library', 'north-specs-labs' ); ?></h1><p><?php esc_html_e( 'Long-form educational briefings on peptide research, laboratory methodology and the evolving research landscape across Canada, the United States and Europe.', 'north-specs-labs' ); ?></p><div class="nsl-ruo-note"><?php echo nsl_icon( 'flask' ); ?><?php esc_html_e( 'Educational material for qualified researchers. Nothing in this library is medical advice or a use protocol for humans or animals.', 'north-specs-labs' ); ?></div></div></section>
<section class="nsl-section"><div class="nsl-shell">
	<div class="nsl-library-filters" aria-label="<?php esc_attr_e( 'Research topics', 'north-specs-labs' ); ?>"><a class="is-active" href="<?php echo esc_url( get_permalink( get_option( 'page_for_posts' ) ) ); ?>"><?php esc_html_e( 'All briefings', 'north-specs-labs' ); ?></a><?php foreach ( get_categories( array( 'hide_empty' => true, 'number' => 6 ) ) as $category ) : ?><a href="<?php echo esc_url( get_category_link( $category ) ); ?>"><?php echo esc_html( $category->name ); ?></a><?php endforeach; ?></div>
	<div class="nsl-article-grid nsl-article-grid--library">
		<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); get_template_part( 'template-parts/article', 'card' ); endwhile; else : ?><p><?php esc_html_e( 'Research briefings are being prepared.', 'north-specs-labs' ); ?></p><?php endif; ?>
	</div>
	<?php the_posts_pagination( array( 'prev_text' => __( 'Previous', 'north-specs-labs' ), 'next_text' => __( 'Next', 'north-specs-labs' ) ) ); ?>
</div></section>
<?php get_footer(); ?>
