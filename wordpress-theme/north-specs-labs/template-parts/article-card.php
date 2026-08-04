<?php
/** Article card. @package NorthSpecsLabs */
?>
<article <?php post_class( 'nsl-article-card' ); ?>>
	<a class="nsl-article-card__image" href="<?php the_permalink(); ?>" tabindex="-1" aria-hidden="true">
		<?php if ( has_post_thumbnail() ) { the_post_thumbnail( 'large', array( 'loading' => 'lazy' ) ); } else { echo '<span>' . esc_html( strtoupper( substr( get_the_title(), 0, 2 ) ) ) . '</span>'; } ?>
	</a>
	<div>
		<p class="nsl-article-card__meta"><?php echo esc_html( get_the_date( 'M j, Y' ) ); ?> <span>•</span> <?php echo esc_html( (string) nsl_reading_time() ); ?> <?php esc_html_e( 'min read', 'north-specs-labs' ); ?></p>
		<h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
		<p><?php echo esc_html( wp_trim_words( get_the_excerpt(), 22 ) ); ?></p>
		<a class="nsl-text-link" href="<?php the_permalink(); ?>"><?php esc_html_e( 'Read briefing', 'north-specs-labs' ); ?><?php echo nsl_icon( 'arrow' ); ?></a>
	</div>
</article>
