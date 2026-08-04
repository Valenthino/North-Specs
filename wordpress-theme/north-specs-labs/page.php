<?php
/** Standard full-width page. @package NorthSpecsLabs */
get_header();
while ( have_posts() ) : the_post();
	$content = (string) get_the_content();
	$legacy  = nsl_has_legacy_builder_content( $content );
	?>
	<section class="nsl-page-hero"><div class="nsl-shell"><?php nsl_eyebrow( 'North Specs Labs' ); ?><h1><?php the_title(); ?></h1><?php if ( has_excerpt() ) : ?><p><?php echo esc_html( get_the_excerpt() ); ?></p><?php endif; ?></div></section>
	<div class="nsl-shell nsl-prose-wrap">
		<?php if ( $legacy ) : ?>
			<div class="nsl-editorial-intro"><p><?php esc_html_e( 'This page is being presented in the new North Specs experience. For immediate documentation or ordering support, contact our research team.', 'north-specs-labs' ); ?></p><a class="nsl-button" href="<?php echo esc_url( nsl_page_url( 'contact', '/contact/' ) ); ?>"><?php esc_html_e( 'Contact research support', 'north-specs-labs' ); ?><?php echo nsl_icon( 'arrow' ); ?></a></div>
		<?php else : ?><article class="nsl-prose"><?php the_content(); ?></article><?php endif; ?>
	</div>
	<?php
endwhile;
get_footer();
