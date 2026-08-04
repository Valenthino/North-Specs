<?php
/** Premium storefront front page. @package NorthSpecsLabs */
get_header();

$banner_id  = (int) get_option( 'northspecs_hero_banner_attachment_id', 0 );
$banner_url = $banner_id ? wp_get_attachment_image_url( $banner_id, 'full' ) : '';
$products   = function_exists( 'wc_get_products' ) ? wc_get_products( array( 'status' => 'publish', 'limit' => 4, 'orderby' => 'popularity', 'order' => 'DESC' ) ) : array();
if ( function_exists( 'wc_get_products' ) && count( $products ) < 4 ) {
	$products = wc_get_products( array( 'status' => 'publish', 'limit' => 4, 'orderby' => 'date', 'order' => 'DESC' ) );
}
?>

<section class="nsl-hero<?php echo $banner_url ? ' nsl-hero--image' : ''; ?>"<?php echo $banner_url ? ' style="--nsl-hero-image:url(' . esc_url( $banner_url ) . ')"' : ''; ?>>
	<div class="nsl-shell nsl-hero__inner">
		<div class="nsl-hero__copy">
			<?php nsl_eyebrow( 'Canadian research supply • RUO' ); ?>
			<h1><?php esc_html_e( 'Research compounds, sourced with scientific discipline.', 'north-specs-labs' ); ?></h1>
			<p><?php esc_html_e( 'Premium peptide research materials supported by transparent batch documentation, responsible handling standards and a research-first service model.', 'north-specs-labs' ); ?></p>
			<div class="nsl-button-group">
				<a class="nsl-button" href="<?php echo esc_url( nsl_shop_url() ); ?>"><?php esc_html_e( 'Browse compounds', 'north-specs-labs' ); ?><?php echo nsl_icon( 'arrow' ); ?></a>
				<a class="nsl-text-link" href="<?php echo esc_url( nsl_page_url( 'quality', '/quality/' ) ); ?>"><?php esc_html_e( 'Explore our standards', 'north-specs-labs' ); ?><?php echo nsl_icon( 'arrow' ); ?></a>
			</div>
			<p class="nsl-hero__disclaimer"><?php echo nsl_icon( 'flask' ); ?><?php esc_html_e( 'For qualified laboratory research only. Not for human or veterinary use.', 'north-specs-labs' ); ?></p>
		</div>
	</div>
</section>

<section class="nsl-trust-rail" aria-label="<?php esc_attr_e( 'Service assurances', 'north-specs-labs' ); ?>">
	<div class="nsl-shell nsl-trust-rail__grid">
		<div><?php echo nsl_icon( 'file' ); ?><span><strong><?php esc_html_e( 'Batch documentation', 'north-specs-labs' ); ?></strong><?php esc_html_e( 'Quality records by lot', 'north-specs-labs' ); ?></span></div>
		<div><?php echo nsl_icon( 'package' ); ?><span><strong><?php esc_html_e( 'Canadian dispatch', 'north-specs-labs' ); ?></strong><?php esc_html_e( 'Protected research packaging', 'north-specs-labs' ); ?></span></div>
		<div><?php echo nsl_icon( 'lock' ); ?><span><strong><?php esc_html_e( 'Secure checkout', 'north-specs-labs' ); ?></strong><?php esc_html_e( 'Encrypted and account-ready', 'north-specs-labs' ); ?></span></div>
		<div><?php echo nsl_icon( 'flask' ); ?><span><strong><?php esc_html_e( 'Researcher support', 'north-specs-labs' ); ?></strong><?php esc_html_e( 'Documentation-led assistance', 'north-specs-labs' ); ?></span></div>
	</div>
</section>

<?php if ( $products ) : ?>
<section class="nsl-section">
	<div class="nsl-shell">
		<div class="nsl-section-heading">
			<div><?php nsl_eyebrow( 'The research catalogue' ); ?><h2><?php esc_html_e( 'Frequently requested compounds', 'north-specs-labs' ); ?></h2></div>
			<a class="nsl-text-link" href="<?php echo esc_url( nsl_shop_url() ); ?>"><?php esc_html_e( 'View all compounds', 'north-specs-labs' ); ?><?php echo nsl_icon( 'arrow' ); ?></a>
		</div>
		<div class="nsl-product-grid">
			<?php foreach ( $products as $product ) { nsl_product_card( $product ); } ?>
		</div>
	</div>
</section>
<?php endif; ?>

<section class="nsl-section nsl-section--muted">
	<div class="nsl-shell">
		<div class="nsl-section-heading nsl-section-heading--center">
			<div><?php nsl_eyebrow( 'Research pathways' ); ?><h2><?php esc_html_e( 'Browse by area of investigation', 'north-specs-labs' ); ?></h2><p><?php esc_html_e( 'A clear catalogue structure for qualified research teams.', 'north-specs-labs' ); ?></p></div>
		</div>
		<div class="nsl-category-grid">
			<?php
			$categories = array(
				'metabolic-research'           => array( 'M', 'Metabolic research', 'Incretin, signalling and energy-balance models' ),
				'tissue-repair-recovery'       => array( 'R', 'Tissue repair & recovery', 'Regeneration and cytoprotection research' ),
				'growth-hormone-secretagogues' => array( 'G', 'Growth hormone secretagogues', 'GHRH and ghrelin-receptor models' ),
				'longevity-cellular-health'    => array( 'L', 'Longevity & cellular health', 'Mitochondrial and bioregulator research' ),
				'neuro-cognitive'              => array( 'N', 'Neuro & cognitive', 'Neuroprotection and plasticity models' ),
				'bioregulation-signalling'     => array( 'B', 'Bioregulation & signalling', 'Melanocortin and signalling-peptide models' ),
			);
			foreach ( $categories as $slug => $data ) :
				$term = get_term_by( 'slug', $slug, 'product_cat' );
				$url  = $term && ! is_wp_error( $term ) ? get_term_link( $term ) : nsl_shop_url();
				?>
				<a class="nsl-category-card" href="<?php echo esc_url( $url ); ?>"><span class="nsl-category-card__mark"><?php echo esc_html( $data[0] ); ?></span><strong><?php echo esc_html( $data[1] ); ?></strong><small><?php echo esc_html( $data[2] ); ?></small><?php echo nsl_icon( 'arrow' ); ?></a>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<section class="nsl-section">
	<div class="nsl-shell nsl-tool-feature">
		<div class="nsl-tool-feature__copy">
			<?php nsl_eyebrow( 'Interactive research tool' ); ?>
			<h2><?php esc_html_e( 'Plan reconstitution calculations with precision', 'north-specs-labs' ); ?></h2>
			<p><?php esc_html_e( 'Enter vial quantity, diluent volume, syringe capacity and target mass. The dynamic syringe visual translates the calculation into a clear laboratory reference.', 'north-specs-labs' ); ?></p>
			<ul class="nsl-check-list"><li><?php echo nsl_icon( 'check' ); ?><?php esc_html_e( 'Live concentration and volume calculation', 'north-specs-labs' ); ?></li><li><?php echo nsl_icon( 'check' ); ?><?php esc_html_e( 'Dynamic syringe capacity warning', 'north-specs-labs' ); ?></li><li><?php echo nsl_icon( 'check' ); ?><?php esc_html_e( 'Research-only methodology notes', 'north-specs-labs' ); ?></li></ul>
			<a class="nsl-button" href="<?php echo esc_url( nsl_page_url( 'reconstitution-calculator', '/reconstitution-calculator/' ) ); ?>"><?php esc_html_e( 'Open the calculator', 'north-specs-labs' ); ?><?php echo nsl_icon( 'arrow' ); ?></a>
		</div>
		<div class="nsl-tool-preview" aria-hidden="true">
			<div class="nsl-tool-preview__readout"><span><?php esc_html_e( 'PULL TO', 'north-specs-labs' ); ?></span><strong>5.00</strong><small><?php esc_html_e( 'syringe units', 'north-specs-labs' ); ?></small></div>
			<svg viewBox="0 0 210 360"><defs><linearGradient id="preview-liquid" x1="0" x2="1"><stop stop-color="#58a67b"/><stop offset="1" stop-color="#1b573a"/></linearGradient></defs><path d="M105 8v38" stroke="#65786a" stroke-width="3"/><path d="M91 45h28l-5 24H96z" fill="#d8eee1" stroke="#758777"/><rect x="78" y="68" width="54" height="232" rx="5" fill="#fff" stroke="#9ead9f" stroke-width="2"/><rect x="79" y="69" width="52" height="43" fill="url(#preview-liquid)"/><path d="M82 112h46v18H82z" fill="#26382d"/><path d="M105 130v191" stroke="#9ead9f" stroke-width="12"/><path d="M69 321h72" stroke="#65786a" stroke-width="12" stroke-linecap="round"/><g stroke="#4b5a4c"><?php for ( $i = 0; $i < 10; $i++ ) { $y = 80 + ( $i * 21 ); echo '<path d="M112 ' . esc_attr( (string) $y ) . 'h19"/>'; } ?></g><path d="M38 112h40" stroke="#b3936c" stroke-width="2" stroke-dasharray="4 3"/><rect x="17" y="98" width="46" height="28" rx="6" fill="#b3936c"/><text x="40" y="117" fill="#fff" text-anchor="middle" font-size="12" font-weight="700">5.00</text></svg>
		</div>
	</div>
</section>

<section class="nsl-quality-band">
	<div class="nsl-shell nsl-quality-band__grid">
		<div><?php nsl_eyebrow( 'The North Specs standard', true ); ?><h2><?php esc_html_e( 'Documentation before decoration.', 'north-specs-labs' ); ?></h2><p><?php esc_html_e( 'A premium research supplier should make product identity, lot-level records, handling expectations and responsible-use limitations easy to find, not hide them in fine print.', 'north-specs-labs' ); ?></p><a class="nsl-button nsl-button--light" href="<?php echo esc_url( nsl_page_url( 'quality', '/quality/' ) ); ?>"><?php esc_html_e( 'Review our quality framework', 'north-specs-labs' ); ?><?php echo nsl_icon( 'arrow' ); ?></a></div>
		<dl><div><dt>01</dt><dd><strong><?php esc_html_e( 'Identity', 'north-specs-labs' ); ?></strong><span><?php esc_html_e( 'Compound and lot traceability', 'north-specs-labs' ); ?></span></dd></div><div><dt>02</dt><dd><strong><?php esc_html_e( 'Documentation', 'north-specs-labs' ); ?></strong><span><?php esc_html_e( 'Clear quality records', 'north-specs-labs' ); ?></span></dd></div><div><dt>03</dt><dd><strong><?php esc_html_e( 'Handling', 'north-specs-labs' ); ?></strong><span><?php esc_html_e( 'Research-first storage guidance', 'north-specs-labs' ); ?></span></dd></div><div><dt>04</dt><dd><strong><?php esc_html_e( 'Responsibility', 'north-specs-labs' ); ?></strong><span><?php esc_html_e( 'Visible RUO controls', 'north-specs-labs' ); ?></span></dd></div></dl>
	</div>
</section>

<section class="nsl-section">
	<div class="nsl-shell">
		<div class="nsl-section-heading"><div><?php nsl_eyebrow( 'Research notes' ); ?><h2><?php esc_html_e( 'From the research library', 'north-specs-labs' ); ?></h2></div><a class="nsl-text-link" href="<?php echo esc_url( nsl_page_url( 'research-library', '/research-library/' ) ); ?>"><?php esc_html_e( 'View the library', 'north-specs-labs' ); ?><?php echo nsl_icon( 'arrow' ); ?></a></div>
		<div class="nsl-article-grid">
			<?php
			$articles = new WP_Query( array( 'post_type' => 'post', 'post_status' => 'publish', 'posts_per_page' => 3, 'ignore_sticky_posts' => true ) );
			if ( $articles->have_posts() ) : while ( $articles->have_posts() ) : $articles->the_post();
				get_template_part( 'template-parts/article', 'card' );
			endwhile; wp_reset_postdata(); else :
				foreach ( array( 'Peptide research methods and reproducibility', 'Reading peptide batch documentation', 'The research landscape across North America' ) as $index => $title ) : ?>
					<article class="nsl-article-card nsl-article-card--placeholder"><div class="nsl-article-card__placeholder"><span><?php echo esc_html( str_pad( (string) ( $index + 1 ), 2, '0', STR_PAD_LEFT ) ); ?></span></div><div><p class="nsl-article-card__meta"><?php esc_html_e( 'Research briefing', 'north-specs-labs' ); ?></p><h3><?php echo esc_html( $title ); ?></h3><p><?php esc_html_e( 'An evidence-aware overview prepared for qualified laboratory researchers.', 'north-specs-labs' ); ?></p></div></article>
				<?php endforeach;
			endif;
			?>
		</div>
	</div>
</section>

<section class="nsl-section nsl-section--muted">
	<div class="nsl-shell nsl-faq-preview">
		<div><?php nsl_eyebrow( 'Researcher FAQ' ); ?><h2><?php esc_html_e( 'Clear answers for responsible procurement', 'north-specs-labs' ); ?></h2><p><?php esc_html_e( 'Start with the essentials, then visit the full FAQ for ordering, documentation, storage, accounts and Research Use Only requirements.', 'north-specs-labs' ); ?></p><a class="nsl-text-link" href="<?php echo esc_url( nsl_page_url( 'faq', '/faq/' ) ); ?>"><?php esc_html_e( 'View every question', 'north-specs-labs' ); ?><?php echo nsl_icon( 'arrow' ); ?></a></div>
		<div class="nsl-accordion">
			<details open><summary><?php esc_html_e( 'Who may purchase North Specs products?', 'north-specs-labs' ); ?></summary><p><?php esc_html_e( 'Qualified researchers, laboratories and research institutions that understand and accept the strict Research Use Only designation.', 'north-specs-labs' ); ?></p></details>
			<details><summary><?php esc_html_e( 'Are the products intended for human use?', 'north-specs-labs' ); ?></summary><p><?php esc_html_e( 'No. They are not for human or veterinary use and are not intended to diagnose, treat, cure or prevent any condition.', 'north-specs-labs' ); ?></p></details>
			<details><summary><?php esc_html_e( 'Where can I find batch documentation?', 'north-specs-labs' ); ?></summary><p><?php esc_html_e( 'Use the batch archive or contact research support with the product and lot identifier shown on the vial.', 'north-specs-labs' ); ?></p></details>
		</div>
	</div>
</section>

<?php get_footer(); ?>
