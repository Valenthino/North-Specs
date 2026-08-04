<?php
/** Research article. @package NorthSpecsLabs */
get_header();
while ( have_posts() ) : the_post();
	?>
	<article <?php post_class( 'nsl-single-article' ); ?>>
		<header class="nsl-article-hero"><div class="nsl-shell nsl-article-hero__inner"><div><?php nsl_eyebrow( 'Research briefing' ); ?><h1><?php the_title(); ?></h1><p class="nsl-article-byline"><?php echo esc_html( get_the_date( 'F j, Y' ) ); ?> <span>•</span> <?php echo esc_html( (string) nsl_reading_time() ); ?> <?php esc_html_e( 'minute read', 'north-specs-labs' ); ?> <span>•</span> <?php esc_html_e( 'Editorial research team', 'north-specs-labs' ); ?></p></div><div class="nsl-article-code"><span>NSL / RESEARCH NOTE</span><strong><?php echo esc_html( str_pad( (string) get_the_ID(), 4, '0', STR_PAD_LEFT ) ); ?></strong></div></div></header>
		<div class="nsl-shell nsl-article-layout">
			<aside class="nsl-article-sidebar"><div class="nsl-ruo-card"><?php echo nsl_icon( 'flask' ); ?><strong><?php esc_html_e( 'Research Use Only', 'north-specs-labs' ); ?></strong><p><?php esc_html_e( 'This briefing is educational and intended for qualified research audiences. It is not medical advice, a treatment recommendation or a protocol for human or animal use.', 'north-specs-labs' ); ?></p></div><a class="nsl-text-link" href="<?php echo esc_url( nsl_page_url( 'research-library', '/research-library/' ) ); ?>"><?php esc_html_e( 'Back to the library', 'north-specs-labs' ); ?></a></aside>
			<div class="nsl-prose nsl-article-content"><?php the_content(); ?><div class="nsl-article-review"><strong><?php esc_html_e( 'Editorial standard', 'north-specs-labs' ); ?></strong><p><?php esc_html_e( 'North Specs separates research education from product claims. Readers should review primary literature and institutional requirements before designing laboratory work.', 'north-specs-labs' ); ?></p></div></div>
		</div>
	</article>
	<?php
endwhile;
get_footer();
