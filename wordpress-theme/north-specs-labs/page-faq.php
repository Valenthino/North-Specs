<?php
/** Extensive researcher FAQ. @package NorthSpecsLabs */
get_header();
$faq_groups = array(
	'Research Use Only' => array(
		array( 'Who may purchase from North Specs Labs?', 'Purchases are intended for qualified researchers, laboratories, educational institutions and legitimate research organizations that can understand, handle and document Research Use Only materials responsibly.' ),
		array( 'What does Research Use Only mean?', 'Research Use Only, or RUO, means the material is supplied strictly for controlled laboratory investigation. It is not a medicine, food, cosmetic, diagnostic product or therapeutic product and must not be used in or on humans or animals.' ),
		array( 'Are your products intended for human or veterinary use?', 'No. North Specs products are not for human consumption or veterinary use and are not intended to diagnose, treat, cure, prevent or mitigate any disease or condition.' ),
		array( 'Can your team provide dosage or treatment guidance?', 'No. We do not provide dosage, administration, treatment, medical or veterinary guidance. Our support is limited to catalogue information, lot documentation, order support and general laboratory handling references.' ),
		array( 'Why is an RUO attestation required?', 'The registration and checkout attestations create a clear record that the purchaser understands the product designation and accepts responsibility for lawful, institutionally appropriate laboratory use.' ),
	),
	'Products & documentation' => array(
		array( 'How do I identify the correct batch document?', 'Match the product name and lot identifier on the vial to the same identifiers on the document. A result for one lot must not be assumed to represent a different lot.' ),
		array( 'Where can I request a Certificate of Analysis?', 'Use the Certificate of Analysis archive where available. If a record is not yet displayed, contact research support with the full product name and lot identifier.' ),
		array( 'What does a purity percentage represent?', 'Purity is method-dependent and typically describes the relative proportion of detected chromatographic components under the stated analytical conditions. Review the complete report, method, identity evidence and limitations.' ),
		array( 'Does a COA make a material suitable for clinical use?', 'No. Analytical documentation does not change the intended use. North Specs products remain strictly for laboratory research regardless of any reported result.' ),
		array( 'Why might product appearance vary?', 'Lyophilized research materials can present differently depending on formulation, fill mass, container geometry, handling and storage. Appearance alone is not a substitute for identity or analytical records.' ),
	),
	'Ordering & accounts' => array(
		array( 'Do I need a researcher account to order?', 'Guest checkout may be available, but a researcher account provides order history, saved details and a clearer support trail. All purchasers must complete the Research Use Only attestation.' ),
		array( 'What information is saved with my account?', 'Core contact and order information is stored along with the laboratory or organization, research role and RUO acknowledgement supplied during registration. Review the Privacy Policy for full details.' ),
		array( 'Can institutions request volume support?', 'Yes. Contact research support with your organization, procurement role, anticipated compounds and approximate volume. Availability and terms are reviewed individually.' ),
		array( 'How can I track an order?', 'Signed-in researchers can review orders from My Account. Guest purchasers can use the Track an Order page with the order number and billing email.' ),
		array( 'Can I change an order after placing it?', 'Contact support immediately with the order number. Changes are not guaranteed once processing or dispatch has begun.' ),
	),
	'Shipping, storage & returns' => array(
		array( 'Where does North Specs ship?', 'Available destinations and service levels are shown during checkout and may change based on carrier access, product requirements and applicable law. The purchaser is responsible for confirming local authority to acquire and possess the material.' ),
		array( 'How are research materials packaged?', 'Orders are prepared in protective packaging appropriate to the catalogue item and service selected. Specific packaging is not a guarantee against carrier delay or exposure after delivery.' ),
		array( 'What should I do when a package arrives?', 'Inspect the external package and items promptly, verify the product and lot identifiers against the order, document any visible damage and follow your laboratory’s receiving and storage procedures.' ),
		array( 'Where can I find storage information?', 'Review the product label, product page, accompanying documentation and your institution’s validated procedures. Contact support when a product-specific document is required.' ),
		array( 'What if an item arrives damaged or incorrect?', 'Do not use the item. Photograph the external package, vial and label, retain all materials and contact support promptly with the order number and a clear description.' ),
		array( 'Can research materials be returned?', 'Because research materials can be sensitive to custody and storage conditions, returns are restricted. Review the Returns and Refunds policy and contact support before sending anything back.' ),
	),
	'Calculator & research library' => array(
		array( 'What does the reconstitution calculator do?', 'It performs arithmetic using the entered vial mass, diluent volume, target mass and selected insulin-syringe capacity. The visual syringe updates to show the calculated unit mark.' ),
		array( 'Does the calculator recommend a dose?', 'No. It does not recommend a dose, protocol, route, frequency or use. It is a mathematics reference for qualified laboratory researchers who provide their own institutionally approved inputs.' ),
		array( 'What does an over-capacity warning mean?', 'The calculated volume is greater than the selected syringe capacity. Recheck all units and inputs under your laboratory procedure. The warning is not a direction to change an experimental protocol.' ),
		array( 'Are research-library articles medical advice?', 'No. Articles are educational summaries for research audiences. They are not medical advice, treatment recommendations or substitutes for primary literature, institutional review and professional scientific judgment.' ),
		array( 'How are research articles maintained?', 'North Specs aims to distinguish preclinical, clinical and methodological evidence, avoid consumer claims and direct readers toward primary literature. Research evolves, so readers should verify current sources.' ),
	),
);
?>
<section class="nsl-page-hero nsl-page-hero--faq"><div class="nsl-shell"><?php nsl_eyebrow( 'Researcher support' ); ?><h1><?php esc_html_e( 'Frequently asked questions', 'north-specs-labs' ); ?></h1><p><?php esc_html_e( 'Ordering, documentation, laboratory handling, accounts and Research Use Only responsibilities, organized for quick review.', 'north-specs-labs' ); ?></p><label class="nsl-faq-search"><span class="screen-reader-text"><?php esc_html_e( 'Search frequently asked questions', 'north-specs-labs' ); ?></span><?php echo nsl_icon( 'search' ); ?><input type="search" placeholder="<?php esc_attr_e( 'Search questions…', 'north-specs-labs' ); ?>" data-faq-search></label></div></section>
<section class="nsl-section">
	<div class="nsl-shell nsl-faq-layout">
		<nav class="nsl-faq-toc" aria-label="<?php esc_attr_e( 'FAQ sections', 'north-specs-labs' ); ?>">
			<?php foreach ( array_keys( $faq_groups ) as $index => $group ) : ?>
				<a href="#faq-<?php echo esc_attr( (string) $index ); ?>"><?php echo esc_html( $group ); ?></a>
			<?php endforeach; ?>
			<div class="nsl-ruo-card"><?php echo nsl_icon( 'flask' ); ?><strong><?php esc_html_e( 'Still need help?', 'north-specs-labs' ); ?></strong><p><?php esc_html_e( 'Our team can help with orders and documentation, never medical or human-use guidance.', 'north-specs-labs' ); ?></p><a href="<?php echo esc_url( nsl_page_url( 'contact', '/contact/' ) ); ?>"><?php esc_html_e( 'Contact support', 'north-specs-labs' ); ?></a></div>
		</nav>
		<div class="nsl-faq-groups" data-faq-list>
			<?php $faq_counter = 0; ?>
			<?php foreach ( $faq_groups as $group_name => $questions ) : ?>
				<section id="faq-<?php echo esc_attr( (string) $faq_counter ); ?>" data-faq-group>
					<div class="nsl-faq-group-heading"><span><?php echo esc_html( str_pad( (string) ( $faq_counter + 1 ), 2, '0', STR_PAD_LEFT ) ); ?></span><h2><?php echo esc_html( $group_name ); ?></h2></div>
					<div class="nsl-accordion"><?php foreach ( $questions as $question ) : ?><details data-faq-item><summary><?php echo esc_html( $question[0] ); ?></summary><p><?php echo esc_html( $question[1] ); ?></p></details><?php endforeach; ?></div>
				</section>
				<?php ++$faq_counter; ?>
			<?php endforeach; ?>
			<p class="nsl-faq-empty" data-faq-empty hidden><?php esc_html_e( 'No questions match that search. Contact research support for help.', 'north-specs-labs' ); ?></p>
		</div>
	</div>
</section>
<?php get_footer(); ?>
