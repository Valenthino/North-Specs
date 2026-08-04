<?php
/** Fallback index. @package NorthSpecsLabs */
get_header();
?>
<section class="nsl-page-hero"><div class="nsl-shell"><?php nsl_eyebrow( 'North Specs Labs' ); ?><h1><?php bloginfo( 'name' ); ?></h1></div></section>
<div class="nsl-shell nsl-content-layout">
	<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
		<article <?php post_class( 'nsl-entry' ); ?>><h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2><?php the_excerpt(); ?></article>
	<?php endwhile; the_posts_pagination(); else : ?><p><?php esc_html_e( 'No content was found.', 'north-specs-labs' ); ?></p><?php endif; ?>
</div>
<?php get_footer(); ?>
