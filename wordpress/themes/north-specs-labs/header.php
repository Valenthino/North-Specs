<?php
/** Site header. @package NorthSpecsLabs */
$nsl_account = nsl_account_link_data();
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="theme-color" content="#123d28">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="nsl-skip-link" href="#main-content"><?php esc_html_e( 'Skip to content', 'north-specs-labs' ); ?></a>

<div class="nsl-utility">
	<div class="nsl-shell nsl-utility__inner">
		<p><span class="nsl-utility__dot"></span><?php esc_html_e( 'Strictly for laboratory Research Use Only', 'north-specs-labs' ); ?></p>
		<nav aria-label="<?php esc_attr_e( 'Utility navigation', 'north-specs-labs' ); ?>">
			<a href="<?php echo esc_url( nsl_page_url( 'certificates-of-analysis', '/certificates-of-analysis/' ) ); ?>"><?php esc_html_e( 'Verify a batch', 'north-specs-labs' ); ?></a>
			<a href="<?php echo esc_url( nsl_page_url( 'track-order', '/track-order/' ) ); ?>"><?php esc_html_e( 'Track order', 'north-specs-labs' ); ?></a>
			<a href="<?php echo esc_url( nsl_page_url( 'contact', '/contact/' ) ); ?>"><?php esc_html_e( 'Research support', 'north-specs-labs' ); ?></a>
		</nav>
	</div>
</div>

<header class="nsl-header" data-site-header>
	<div class="nsl-shell nsl-header__inner">
		<button class="nsl-mobile-trigger" type="button" aria-expanded="false" aria-controls="nsl-primary-nav" data-menu-trigger>
			<?php echo nsl_icon( 'menu', 'nsl-menu-open' ); ?><?php echo nsl_icon( 'close', 'nsl-menu-close' ); ?><span class="screen-reader-text"><?php esc_html_e( 'Toggle navigation', 'north-specs-labs' ); ?></span>
		</button>

		<?php nsl_brand(); ?>

		<nav id="nsl-primary-nav" class="nsl-primary-nav" aria-label="<?php esc_attr_e( 'Primary navigation', 'north-specs-labs' ); ?>" data-primary-nav>
			<?php
			wp_nav_menu(
				array(
					'theme_location' => 'primary',
					'container'      => false,
					'menu_class'     => 'nsl-menu',
					'fallback_cb'    => 'nsl_primary_menu_fallback',
					'depth'          => 2,
				)
			);
			?>
		</nav>

		<div class="nsl-header-actions">
			<button class="nsl-icon-button" type="button" data-search-open aria-haspopup="dialog">
				<?php echo nsl_icon( 'search' ); ?><span class="screen-reader-text"><?php esc_html_e( 'Search catalogue', 'north-specs-labs' ); ?></span>
			</button>
			<a class="nsl-icon-button nsl-account-link" href="<?php echo esc_url( $nsl_account['url'] ); ?>">
				<?php echo nsl_icon( 'user' ); ?><span class="nsl-action-label" aria-hidden="true"><?php echo esc_html( $nsl_account['label'] ); ?></span><span class="screen-reader-text"><?php echo esc_html( $nsl_account['sr_label'] ); ?></span>
			</a>
			<a class="nsl-icon-button nsl-cart-link" href="<?php echo esc_url( function_exists( 'wc_get_cart_url' ) ? wc_get_cart_url() : nsl_page_url( 'cart', '/cart/' ) ); ?>">
				<?php echo nsl_icon( 'cart' ); ?><span class="nsl-action-label" aria-hidden="true"><?php esc_html_e( 'Cart', 'north-specs-labs' ); ?></span><span class="screen-reader-text"><?php esc_html_e( 'Cart', 'north-specs-labs' ); ?></span><span class="nsl-cart-count" aria-label="<?php echo esc_attr( sprintf( _n( '%d item in cart', '%d items in cart', nsl_cart_count(), 'north-specs-labs' ), nsl_cart_count() ) ); ?>"><?php echo esc_html( (string) nsl_cart_count() ); ?></span>
			</a>
		</div>
	</div>
</header>

<dialog class="nsl-search-dialog" data-search-dialog aria-labelledby="nsl-search-title">
	<div class="nsl-search-dialog__bar">
		<div>
			<?php nsl_eyebrow( 'Catalogue search' ); ?>
			<h2 id="nsl-search-title"><?php esc_html_e( 'Find a research compound', 'north-specs-labs' ); ?></h2>
		</div>
		<button class="nsl-icon-button" type="button" data-search-close><?php echo nsl_icon( 'close' ); ?><span class="screen-reader-text"><?php esc_html_e( 'Close search', 'north-specs-labs' ); ?></span></button>
	</div>
	<form class="nsl-search-form" role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>">
		<label class="screen-reader-text" for="nsl-product-search"><?php esc_html_e( 'Search products', 'north-specs-labs' ); ?></label>
		<input id="nsl-product-search" name="s" type="search" placeholder="<?php esc_attr_e( 'Search by compound name or SKU', 'north-specs-labs' ); ?>" autocomplete="off" aria-controls="nsl-search-suggestions" aria-expanded="false">
		<input type="hidden" name="post_type" value="product">
		<button class="nsl-button" type="submit"><?php esc_html_e( 'Search', 'north-specs-labs' ); ?><?php echo nsl_icon( 'arrow' ); ?></button>
	</form>
	<div id="nsl-search-suggestions" class="nsl-search-suggestions" data-search-suggestions hidden aria-live="polite"></div>
</dialog>

<main id="main-content" class="nsl-main">
