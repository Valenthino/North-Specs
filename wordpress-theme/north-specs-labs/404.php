<?php
/** 404 page. @package NorthSpecsLabs */
get_header();
?>
<section class="nsl-not-found"><div class="nsl-shell"><p class="nsl-not-found__code">404 / NOT FOUND</p><h1><?php esc_html_e( 'That page is outside the current assay.', 'north-specs-labs' ); ?></h1><p><?php esc_html_e( 'The link may have changed. Return to the research catalogue or search for a compound.', 'north-specs-labs' ); ?></p><div class="nsl-button-group"><a class="nsl-button" href="<?php echo esc_url( nsl_shop_url() ); ?>"><?php esc_html_e( 'Browse compounds', 'north-specs-labs' ); ?><?php echo nsl_icon( 'arrow' ); ?></a><button class="nsl-text-link" type="button" data-search-open><?php esc_html_e( 'Search the catalogue', 'north-specs-labs' ); ?><?php echo nsl_icon( 'search' ); ?></button></div></div></section>
<?php get_footer(); ?>
