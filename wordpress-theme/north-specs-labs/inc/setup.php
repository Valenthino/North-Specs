<?php
/**
 * Theme setup, assets and activation tasks.
 *
 * @package NorthSpecsLabs
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action(
	'after_setup_theme',
	function (): void {
		load_theme_textdomain( 'north-specs-labs', NSL_THEME_DIR . '/languages' );
		add_theme_support( 'title-tag' );
		add_theme_support( 'post-thumbnails' );
		add_theme_support( 'responsive-embeds' );
		add_theme_support( 'align-wide' );
		add_theme_support( 'woocommerce' );
		add_theme_support( 'wc-product-gallery-zoom' );
		add_theme_support( 'wc-product-gallery-lightbox' );
		add_theme_support( 'wc-product-gallery-slider' );
		add_theme_support(
			'html5',
			array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' )
		);

		register_nav_menus(
			array(
				'primary'    => __( 'Primary navigation', 'north-specs-labs' ),
				'footer-one' => __( 'Footer: Explore', 'north-specs-labs' ),
				'footer-two' => __( 'Footer: Support', 'north-specs-labs' ),
			)
		);
	},
	5
);

add_action(
	'wp_enqueue_scripts',
	function (): void {
		$css_path = NSL_THEME_DIR . '/assets/css/main.css';
		$js_path  = NSL_THEME_DIR . '/assets/js/theme.js';
		wp_enqueue_style( 'nsl-main', NSL_THEME_URI . '/assets/css/main.css', array(), file_exists( $css_path ) ? (string) filemtime( $css_path ) : NSL_THEME_VERSION );
		wp_enqueue_script( 'nsl-theme', NSL_THEME_URI . '/assets/js/theme.js', array(), file_exists( $js_path ) ? (string) filemtime( $js_path ) : NSL_THEME_VERSION, true );
		wp_script_add_data( 'nsl-theme', 'defer', true );

		if ( is_page( 'reconstitution-calculator' ) ) {
			$calc_path = NSL_THEME_DIR . '/assets/js/calculator.js';
			wp_enqueue_script( 'nsl-calculator', NSL_THEME_URI . '/assets/js/calculator.js', array(), file_exists( $calc_path ) ? (string) filemtime( $calc_path ) : NSL_THEME_VERSION, true );
			wp_script_add_data( 'nsl-calculator', 'defer', true );
		}

		wp_localize_script(
			'nsl-theme',
			'NorthSpecs',
			array(
				'ajaxUrl'   => admin_url( 'admin-ajax.php' ),
				'cartCount' => nsl_cart_count(),
				'cartUrl'   => function_exists( 'wc_get_cart_url' ) ? wc_get_cart_url() : home_url( '/cart/' ),
				'currency'  => function_exists( 'get_woocommerce_currency' ) ? get_woocommerce_currency() : 'CAD',
			)
		);
	},
	20
);

add_filter(
	'body_class',
	function ( array $classes ): array {
		$classes[] = 'nsl-site';
		if ( function_exists( 'is_woocommerce' ) && ( is_woocommerce() || is_cart() || is_checkout() || is_account_page() ) ) {
			$classes[] = 'nsl-commerce';
		}
		return $classes;
	}
);

add_filter( 'use_default_gallery_style', '__return_false' );
add_filter( 'should_load_separate_core_block_assets', '__return_true' );

/** Safe navigation fallback before the activation menu is available. */
function nsl_primary_menu_fallback(): void {
	$links = array(
		'Shop'             => nsl_shop_url(),
		'Research Tools'   => nsl_page_url( 'reconstitution-calculator', '/reconstitution-calculator/' ),
		'Research Library' => nsl_page_url( 'research-library', '/research-library/' ),
		'Quality'          => nsl_page_url( 'quality', '/quality/' ),
		'About'            => nsl_page_url( 'about', '/about/' ),
		'Contact'          => nsl_page_url( 'contact', '/contact/' ),
	);
	echo '<ul class="nsl-menu">';
	foreach ( $links as $label => $url ) {
		printf( '<li class="menu-item"><a href="%1$s">%2$s</a></li>', esc_url( $url ), esc_html( $label ) );
	}
	echo '</ul>';
}

/** Create a page if it does not already exist. */
function nsl_ensure_page( string $title, string $slug, string $content = '', int $parent = 0 ): int {
	$existing = get_page_by_path( $slug );
	if ( $existing instanceof WP_Post ) {
		return (int) $existing->ID;
	}

	return (int) wp_insert_post(
		array(
			'post_type'    => 'page',
			'post_status'  => 'publish',
			'post_title'   => $title,
			'post_name'    => $slug,
			'post_content' => $content,
			'post_parent'  => $parent,
		)
	);
}

/** Build a complete navigation and essential commerce pages on first activation. */
function nsl_activate_theme(): void {
	$shop_id = function_exists( 'wc_get_page_id' ) ? (int) wc_get_page_id( 'shop' ) : nsl_ensure_page( 'Shop', 'shop' );
	$blog_id = nsl_ensure_page( 'Research Library', 'research-library' );
	$calc_id = nsl_ensure_page( 'Reconstitution Calculator', 'reconstitution-calculator' );
	$faq_id  = nsl_ensure_page( 'Researcher FAQ', 'faq' );
	$track_id = nsl_ensure_page( 'Track an Order', 'track-order', '[woocommerce_order_tracking]' );
	nsl_ensure_page( 'Certificates of Analysis', 'certificates-of-analysis' );

	update_option( 'woocommerce_enable_myaccount_registration', 'yes' );
	update_option( 'woocommerce_enable_checkout_login_reminder', 'yes' );
	update_option( 'woocommerce_enable_signup_and_login_from_checkout', 'yes' );
	update_option( 'woocommerce_checkout_phone_field', 'optional' );
	update_option( 'page_for_posts', $blog_id );

	$menu_name = 'North Specs Premium Navigation';
	$menu      = wp_get_nav_menu_object( $menu_name );
	$menu_id   = $menu ? (int) $menu->term_id : (int) wp_create_nav_menu( $menu_name );

	if ( $menu_id && ! is_wp_error( $menu_id ) ) {
		$items = wp_get_nav_menu_items( $menu_id );
		if ( empty( $items ) ) {
			$shop_item = wp_update_nav_menu_item( $menu_id, 0, array( 'menu-item-title' => 'Shop', 'menu-item-object-id' => $shop_id, 'menu-item-object' => 'page', 'menu-item-type' => 'post_type', 'menu-item-status' => 'publish' ) );
			wp_update_nav_menu_item( $menu_id, 0, array( 'menu-item-title' => 'All Research Compounds', 'menu-item-url' => nsl_shop_url(), 'menu-item-parent-id' => $shop_item, 'menu-item-status' => 'publish' ) );

			if ( taxonomy_exists( 'product_cat' ) ) {
				$categories = get_terms( array( 'taxonomy' => 'product_cat', 'hide_empty' => true, 'number' => 5 ) );
				if ( ! is_wp_error( $categories ) ) {
					foreach ( $categories as $category ) {
						wp_update_nav_menu_item( $menu_id, 0, array( 'menu-item-title' => $category->name, 'menu-item-object-id' => $category->term_id, 'menu-item-object' => 'product_cat', 'menu-item-type' => 'taxonomy', 'menu-item-parent-id' => $shop_item, 'menu-item-status' => 'publish' ) );
					}
				}
			}

			$tools_item = wp_update_nav_menu_item( $menu_id, 0, array( 'menu-item-title' => 'Research Tools', 'menu-item-object-id' => $calc_id, 'menu-item-object' => 'page', 'menu-item-type' => 'post_type', 'menu-item-status' => 'publish' ) );
			wp_update_nav_menu_item( $menu_id, 0, array( 'menu-item-title' => 'Reconstitution Calculator', 'menu-item-object-id' => $calc_id, 'menu-item-object' => 'page', 'menu-item-type' => 'post_type', 'menu-item-parent-id' => $tools_item, 'menu-item-status' => 'publish' ) );
			wp_update_nav_menu_item( $menu_id, 0, array( 'menu-item-title' => 'Batch COA Archive', 'menu-item-url' => nsl_page_url( 'certificates-of-analysis', '/certificates-of-analysis/' ), 'menu-item-parent-id' => $tools_item, 'menu-item-status' => 'publish' ) );
			wp_update_nav_menu_item( $menu_id, 0, array( 'menu-item-title' => 'Quality Standards', 'menu-item-url' => nsl_page_url( 'quality', '/quality/' ), 'menu-item-parent-id' => $tools_item, 'menu-item-status' => 'publish' ) );

			$library_item = wp_update_nav_menu_item( $menu_id, 0, array( 'menu-item-title' => 'Research Library', 'menu-item-object-id' => $blog_id, 'menu-item-object' => 'page', 'menu-item-type' => 'post_type', 'menu-item-status' => 'publish' ) );
			wp_update_nav_menu_item( $menu_id, 0, array( 'menu-item-title' => 'All Research Briefings', 'menu-item-object-id' => $blog_id, 'menu-item-object' => 'page', 'menu-item-type' => 'post_type', 'menu-item-parent-id' => $library_item, 'menu-item-status' => 'publish' ) );
			wp_update_nav_menu_item( $menu_id, 0, array( 'menu-item-title' => 'Researcher FAQ', 'menu-item-object-id' => $faq_id, 'menu-item-object' => 'page', 'menu-item-type' => 'post_type', 'menu-item-parent-id' => $library_item, 'menu-item-status' => 'publish' ) );

			foreach ( array( 'Quality' => 'quality', 'About' => 'about', 'Contact' => 'contact' ) as $label => $slug ) {
				wp_update_nav_menu_item( $menu_id, 0, array( 'menu-item-title' => $label, 'menu-item-url' => nsl_page_url( $slug, '/' . $slug . '/' ), 'menu-item-status' => 'publish' ) );
			}
		}

		$locations            = get_theme_mod( 'nav_menu_locations', array() );
		$locations['primary'] = $menu_id;
		set_theme_mod( 'nav_menu_locations', $locations );
	}

	flush_rewrite_rules();
}
add_action( 'after_switch_theme', 'nsl_activate_theme' );

/** Handle the first-party research support form. */
function nsl_handle_contact_form(): void {
	$redirect = nsl_page_url( 'contact', '/contact/' );
	if ( ! isset( $_POST['nsl_contact_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nsl_contact_nonce'] ) ), 'nsl_contact' ) || ! empty( $_POST['website'] ) ) {
		wp_safe_redirect( add_query_arg( 'contact', 'error', $redirect ) );
		exit;
	}

	$name         = sanitize_text_field( wp_unslash( $_POST['name'] ?? '' ) );
	$email        = sanitize_email( wp_unslash( $_POST['email'] ?? '' ) );
	$organization = sanitize_text_field( wp_unslash( $_POST['organization'] ?? '' ) );
	$topic        = sanitize_text_field( wp_unslash( $_POST['topic'] ?? '' ) );
	$reference    = sanitize_text_field( wp_unslash( $_POST['reference'] ?? '' ) );
	$message      = sanitize_textarea_field( wp_unslash( $_POST['message'] ?? '' ) );

	if ( ! $name || ! is_email( $email ) || ! $organization || ! $topic || ! $message || empty( $_POST['ruo'] ) ) {
		wp_safe_redirect( add_query_arg( 'contact', 'error', $redirect ) );
		exit;
	}

	$body = "Name: {$name}\nEmail: {$email}\nOrganization: {$organization}\nTopic: {$topic}\nReference: {$reference}\nRUO acknowledged: Yes\n\nMessage:\n{$message}";
	$sent = wp_mail( get_option( 'admin_email' ), '[North Specs Research Support] ' . $topic, $body, array( 'Reply-To: ' . $name . ' <' . $email . '>' ) );
	wp_safe_redirect( add_query_arg( 'contact', $sent ? 'sent' : 'error', $redirect ) );
	exit;
}
add_action( 'admin_post_nsl_contact', 'nsl_handle_contact_form' );
add_action( 'admin_post_nopriv_nsl_contact', 'nsl_handle_contact_form' );

/** Store explicit research-notes consent without requiring a third-party platform. */
function nsl_handle_research_notes(): void {
	$redirect = home_url( '/#research-notes' );
	$nonce    = isset( $_POST['nsl_research_notes_nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['nsl_research_notes_nonce'] ) ) : '';
	$email    = isset( $_POST['email'] ) ? sanitize_email( wp_unslash( $_POST['email'] ) ) : '';
	if ( ! wp_verify_nonce( $nonce, 'nsl_research_notes' ) || ! is_email( $email ) || ! empty( $_POST['organization_url'] ) ) {
		wp_safe_redirect( add_query_arg( 'notes', 'error', $redirect ) );
		exit;
	}

	$subscribers = get_option( 'nsl_research_notes_subscribers', array() );
	if ( ! is_array( $subscribers ) ) {
		$subscribers = array();
	}
	$key = hash( 'sha256', strtolower( $email ) );
	$subscribers[ $key ] = array( 'email' => $email, 'consented_at' => gmdate( 'c' ), 'source' => 'website_footer' );
	update_option( 'nsl_research_notes_subscribers', $subscribers, false );
	wp_safe_redirect( add_query_arg( 'notes', 'joined', $redirect ) );
	exit;
}
add_action( 'admin_post_nsl_research_notes', 'nsl_handle_research_notes' );
add_action( 'admin_post_nopriv_nsl_research_notes', 'nsl_handle_research_notes' );

/** Preserve legacy legal URLs while consolidating on the expanded policies. */
add_action(
	'template_redirect',
	function (): void {
		$path = trim( (string) wp_parse_url( wp_unslash( $_SERVER['REQUEST_URI'] ?? '' ), PHP_URL_PATH ), '/' );
		$map  = array(
			'legal/terms'               => 'terms-of-use',
			'legal/privacy'             => 'privacy-policy',
			'legal/shipping-2'          => 'shipping',
			'legal/research-use-only-2' => 'research-use-only',
		);
		if ( isset( $map[ $path ] ) ) {
			wp_safe_redirect( nsl_page_url( $map[ $path ], '/' ), 301 );
			exit;
		}
	},
	1
);
