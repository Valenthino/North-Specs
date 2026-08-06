<?php
/** Guest order lookup and tracking. @package NorthSpecsLabs */
get_header();
?>
<section class="nsl-page-hero nsl-page-hero--track">
	<div class="nsl-shell">
		<?php nsl_eyebrow( 'Order lookup' ); ?>
		<h1><?php esc_html_e( 'Track a laboratory order', 'north-specs-labs' ); ?></h1>
		<p><?php esc_html_e( 'Enter the order number and the billing email address used at checkout. You will see the full order timeline, carrier tracking when a parcel is in transit, and a direct route to research support.', 'north-specs-labs' ); ?></p>
	</div>
</section>

<section class="nsl-section">
	<div class="nsl-shell nsl-track-layout">
		<div class="nsl-track-main">
			<?php
			while ( have_posts() ) :
				the_post();
				the_content();
			endwhile;
			?>
		</div>

		<aside class="nsl-track-aside">
			<h2><?php esc_html_e( 'What each stage means', 'north-specs-labs' ); ?></h2>
			<ol>
				<li><strong><?php esc_html_e( 'Order received', 'north-specs-labs' ); ?></strong><span><?php esc_html_e( 'Recorded with your researcher attestations. Nothing ships at this stage.', 'north-specs-labs' ); ?></span></li>
				<li><strong><?php esc_html_e( 'Payment confirmed', 'north-specs-labs' ); ?></strong><span><?php esc_html_e( 'Cleared payment or approved institutional terms release the order to the laboratory.', 'north-specs-labs' ); ?></span></li>
				<li><strong><?php esc_html_e( 'Dispatched', 'north-specs-labs' ); ?></strong><span><?php esc_html_e( 'Packed and handed to the carrier. The tracking number appears as soon as the carrier reports it.', 'north-specs-labs' ); ?></span></li>
				<li><strong><?php esc_html_e( 'Completed', 'north-specs-labs' ); ?></strong><span><?php esc_html_e( 'Keep the receipt and batch record with your receiving documentation.', 'north-specs-labs' ); ?></span></li>
			</ol>

			<?php if ( ! is_user_logged_in() ) : ?>
				<div class="nsl-ruo-card">
					<?php echo nsl_icon( 'user' ); ?>
					<strong><?php esc_html_e( 'Ordered before?', 'north-specs-labs' ); ?></strong>
					<p><?php esc_html_e( 'Signing in shows every order, receipt and batch document without a lookup each time.', 'north-specs-labs' ); ?></p>
					<a href="<?php echo esc_url( function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'myaccount' ) : nsl_page_url( 'my-account', '/my-account/' ) ); ?>"><?php esc_html_e( 'Sign in to your account', 'north-specs-labs' ); ?></a>
				</div>
			<?php endif; ?>

			<a class="nsl-text-link" href="<?php echo esc_url( nsl_page_url( 'contact', '/contact/' ) ); ?>"><?php esc_html_e( 'Contact research support', 'north-specs-labs' ); ?><?php echo nsl_icon( 'arrow' ); ?></a>
		</aside>
	</div>
</section>
<?php get_footer(); ?>
