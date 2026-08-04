<?php
/** Site footer. @package NorthSpecsLabs */
?>
</main>

<section class="nsl-research-cta">
	<div class="nsl-shell nsl-research-cta__inner">
		<div>
			<?php nsl_eyebrow( 'Institutional research', true ); ?>
			<h2><?php esc_html_e( 'Need documentation or volume support?', 'north-specs-labs' ); ?></h2>
			<p><?php esc_html_e( 'Talk with our research support team about batch records, institutional procurement and catalogue availability.', 'north-specs-labs' ); ?></p>
		</div>
		<a class="nsl-button nsl-button--light" href="<?php echo esc_url( nsl_page_url( 'contact', '/contact/' ) ); ?>"><?php esc_html_e( 'Contact research support', 'north-specs-labs' ); ?><?php echo nsl_icon( 'arrow' ); ?></a>
	</div>
</section>

<footer class="nsl-footer">
	<div class="nsl-shell nsl-footer__grid">
		<div class="nsl-footer__brand">
			<?php nsl_brand(); ?>
			<p><?php esc_html_e( 'Premium research compounds and scientific resources for qualified laboratories and research institutions.', 'north-specs-labs' ); ?></p>
			<div class="nsl-ruo-seal"><?php echo nsl_icon( 'flask' ); ?><span><strong><?php esc_html_e( 'Research Use Only', 'north-specs-labs' ); ?></strong><?php esc_html_e( 'Not for human or veterinary use', 'north-specs-labs' ); ?></span></div>
		</div>

		<nav class="nsl-footer__nav" aria-label="<?php esc_attr_e( 'Explore', 'north-specs-labs' ); ?>">
			<h3><?php esc_html_e( 'Explore', 'north-specs-labs' ); ?></h3>
			<ul>
				<li><a href="<?php echo esc_url( nsl_shop_url() ); ?>"><?php esc_html_e( 'Shop all compounds', 'north-specs-labs' ); ?></a></li>
				<li><a href="<?php echo esc_url( nsl_page_url( 'research-library', '/research-library/' ) ); ?>"><?php esc_html_e( 'Research library', 'north-specs-labs' ); ?></a></li>
				<li><a href="<?php echo esc_url( nsl_page_url( 'reconstitution-calculator', '/reconstitution-calculator/' ) ); ?>"><?php esc_html_e( 'Reconstitution calculator', 'north-specs-labs' ); ?></a></li>
				<li><a href="<?php echo esc_url( nsl_page_url( 'quality', '/quality/' ) ); ?>"><?php esc_html_e( 'Quality standards', 'north-specs-labs' ); ?></a></li>
				<li><a href="<?php echo esc_url( nsl_page_url( 'about', '/about/' ) ); ?>"><?php esc_html_e( 'About North Specs', 'north-specs-labs' ); ?></a></li>
				<li><a href="<?php echo esc_url( nsl_page_url( 'faq', '/faq/' ) ); ?>"><?php esc_html_e( 'Researcher FAQ', 'north-specs-labs' ); ?></a></li>
			</ul>
		</nav>

		<nav class="nsl-footer__nav" aria-label="<?php esc_attr_e( 'Orders and support', 'north-specs-labs' ); ?>">
			<h3><?php esc_html_e( 'Orders & support', 'north-specs-labs' ); ?></h3>
			<ul>
				<li><a href="<?php echo esc_url( nsl_page_url( 'track-order', '/track-order/' ) ); ?>"><?php esc_html_e( 'Track an order', 'north-specs-labs' ); ?></a></li>
				<li><a href="<?php echo esc_url( function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'myaccount' ) : nsl_page_url( 'my-account', '/my-account/' ) ); ?>"><?php esc_html_e( 'Researcher account', 'north-specs-labs' ); ?></a></li>
				<li><a href="<?php echo esc_url( nsl_page_url( 'certificates-of-analysis', '/certificates-of-analysis/' ) ); ?>"><?php esc_html_e( 'Certificates of Analysis', 'north-specs-labs' ); ?></a></li>
				<li><a href="<?php echo esc_url( nsl_page_url( 'shipping', '/shipping/' ) ); ?>"><?php esc_html_e( 'Shipping information', 'north-specs-labs' ); ?></a></li>
				<li><a href="<?php echo esc_url( nsl_page_url( 'returns', '/returns/' ) ); ?>"><?php esc_html_e( 'Returns & refunds', 'north-specs-labs' ); ?></a></li>
				<li><a href="<?php echo esc_url( nsl_page_url( 'contact', '/contact/' ) ); ?>"><?php esc_html_e( 'Contact support', 'north-specs-labs' ); ?></a></li>
			</ul>
		</nav>

		<div class="nsl-footer__newsletter">
			<h3><?php esc_html_e( 'Research notes', 'north-specs-labs' ); ?></h3>
			<p><?php esc_html_e( 'Receive catalogue updates and new research briefings. No clinical or consumer guidance.', 'north-specs-labs' ); ?></p>
			<?php if ( isset( $_GET['notes'] ) && 'joined' === sanitize_key( wp_unslash( $_GET['notes'] ) ) ) : ?><p class="nsl-newsletter-success" role="status"><?php esc_html_e( 'You are on the research-notes list.', 'north-specs-labs' ); ?></p><?php endif; ?>
			<form id="research-notes" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post">
				<label class="screen-reader-text" for="nsl-footer-email"><?php esc_html_e( 'Email address', 'north-specs-labs' ); ?></label>
				<input id="nsl-footer-email" name="email" type="email" placeholder="name@laboratory.org" required>
				<input class="nsl-honeypot" name="organization_url" type="text" tabindex="-1" autocomplete="off" aria-hidden="true">
				<input type="hidden" name="action" value="nsl_research_notes">
				<?php wp_nonce_field( 'nsl_research_notes', 'nsl_research_notes_nonce' ); ?>
				<button type="submit" aria-label="<?php esc_attr_e( 'Join research notes', 'north-specs-labs' ); ?>"><?php echo nsl_icon( 'arrow' ); ?></button>
			</form>
			<p class="nsl-footer__privacy"><?php echo wp_kses_post( sprintf( __( 'By subscribing, you agree to our <a href="%s">Privacy Policy</a>.', 'north-specs-labs' ), esc_url( nsl_page_url( 'privacy-policy', '/privacy-policy/' ) ) ) ); ?></p>
		</div>
	</div>

	<div class="nsl-shell nsl-footer__bottom">
		<p>&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?> <?php esc_html_e( 'North Specs Labs. All rights reserved.', 'north-specs-labs' ); ?></p>
		<nav aria-label="<?php esc_attr_e( 'Legal', 'north-specs-labs' ); ?>">
			<a href="<?php echo esc_url( nsl_page_url( 'terms-of-use', '/terms-of-use/' ) ); ?>"><?php esc_html_e( 'Terms of Use', 'north-specs-labs' ); ?></a>
			<a href="<?php echo esc_url( nsl_page_url( 'privacy-policy', '/privacy-policy/' ) ); ?>"><?php esc_html_e( 'Privacy', 'north-specs-labs' ); ?></a>
			<a href="<?php echo esc_url( nsl_page_url( 'research-use-only', '/research-use-only/' ) ); ?>"><?php esc_html_e( 'Research Use Only', 'north-specs-labs' ); ?></a>
			<a href="<?php echo esc_url( nsl_page_url( 'cookies', '/cookies/' ) ); ?>"><?php esc_html_e( 'Cookies', 'north-specs-labs' ); ?></a>
		</nav>
	</div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
