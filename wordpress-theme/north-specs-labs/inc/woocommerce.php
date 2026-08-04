<?php
/**
 * WooCommerce presentation, researcher registration and checkout safeguards.
 *
 * @package NorthSpecsLabs
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_filter( 'woocommerce_enqueue_styles', '__return_empty_array' );
add_filter( 'woocommerce_show_page_title', '__return_false' );
add_filter( 'woocommerce_output_related_products_args', function ( array $args ): array {
	$args['posts_per_page'] = 3;
	$args['columns']        = 3;
	return $args;
} );
add_filter( 'loop_shop_columns', fn(): int => 3 );
add_filter( 'loop_shop_per_page', fn(): int => 12 );

remove_action( 'woocommerce_sidebar', 'woocommerce_get_sidebar', 10 );
remove_action( 'woocommerce_before_main_content', 'woocommerce_breadcrumb', 20 );
remove_action( 'woocommerce_before_shop_loop_item_title', 'woocommerce_show_product_loop_sale_flash', 10 );

add_action(
	'woocommerce_before_shop_loop_item_title',
	function (): void {
		echo '<span class="nsl-product-ruo">RUO</span>';
	},
	8
);

add_action(
	'woocommerce_after_shop_loop_item_title',
	function (): void {
		echo '<span class="nsl-product-proof">' . nsl_icon( 'file' ) . esc_html__( ' Batch documentation', 'north-specs-labs' ) . '</span>';
	},
	7
);

add_action(
	'woocommerce_single_product_summary',
	function (): void {
		?>
		<div class="nsl-product-assurance">
			<p><?php echo nsl_icon( 'flask' ); ?><span><strong><?php esc_html_e( 'Research Use Only', 'north-specs-labs' ); ?></strong><?php esc_html_e( 'Not for human or veterinary use.', 'north-specs-labs' ); ?></span></p>
			<p><?php echo nsl_icon( 'file' ); ?><span><strong><?php esc_html_e( 'Batch documentation', 'north-specs-labs' ); ?></strong><?php esc_html_e( 'Quality records available by lot.', 'north-specs-labs' ); ?></span></p>
			<p><?php echo nsl_icon( 'package' ); ?><span><strong><?php esc_html_e( 'Protected dispatch', 'north-specs-labs' ); ?></strong><?php esc_html_e( 'Securely packed in Canada.', 'north-specs-labs' ); ?></span></p>
		</div>
		<?php
	},
	29
);

add_action(
	'woocommerce_after_single_product_summary',
	function (): void {
		?>
		<section class="nsl-product-ruo-panel">
			<div>
				<?php nsl_eyebrow( 'Responsible procurement', true ); ?>
				<h2><?php esc_html_e( 'Strictly for controlled laboratory research', 'north-specs-labs' ); ?></h2>
			</div>
			<p><?php esc_html_e( 'Purchasers confirm that they are qualified researchers, laboratories or research institutions and understand that North Specs Labs products are not intended for human consumption, diagnostic, therapeutic or medical use.', 'north-specs-labs' ); ?></p>
		</section>
		<?php
	},
	5
);

/** Keep the header cart count current after AJAX add-to-cart. */
add_filter(
	'woocommerce_add_to_cart_fragments',
	function ( array $fragments ): array {
		$fragments['.nsl-cart-count'] = '<span class="nsl-cart-count" aria-label="' . esc_attr( sprintf( _n( '%d item in cart', '%d items in cart', nsl_cart_count(), 'north-specs-labs' ), nsl_cart_count() ) ) . '">' . esc_html( (string) nsl_cart_count() ) . '</span>';
		return $fragments;
	}
);

/** Researcher fields on account registration. */
add_action(
	'woocommerce_register_form',
	function (): void {
		?>
		<p class="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
			<label for="reg_research_organization"><?php esc_html_e( 'Laboratory or organization', 'north-specs-labs' ); ?>&nbsp;<span class="required" aria-hidden="true">*</span></label>
			<input type="text" class="woocommerce-Input woocommerce-Input--text input-text" name="research_organization" id="reg_research_organization" autocomplete="organization" value="<?php echo isset( $_POST['research_organization'] ) ? esc_attr( wp_unslash( $_POST['research_organization'] ) ) : ''; ?>" required>
		</p>
		<p class="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
			<label for="reg_research_role"><?php esc_html_e( 'Research role', 'north-specs-labs' ); ?>&nbsp;<span class="required" aria-hidden="true">*</span></label>
			<select name="research_role" id="reg_research_role" required>
				<option value=""><?php esc_html_e( 'Select your role', 'north-specs-labs' ); ?></option>
				<?php foreach ( array( 'Principal investigator', 'Laboratory manager', 'Research scientist', 'Procurement', 'Academic researcher', 'Other qualified researcher' ) as $role ) : ?>
					<option value="<?php echo esc_attr( $role ); ?>" <?php selected( isset( $_POST['research_role'] ) ? wp_unslash( $_POST['research_role'] ) : '', $role ); ?>><?php echo esc_html( $role ); ?></option>
				<?php endforeach; ?>
			</select>
		</p>
		<p class="form-row validate-required nsl-consent-field">
			<label class="woocommerce-form__label woocommerce-form__label-for-checkbox checkbox">
				<input class="woocommerce-form__input woocommerce-form__input-checkbox" name="research_use_consent" type="checkbox" id="reg_research_use_consent" value="1" <?php checked( ! empty( $_POST['research_use_consent'] ) ); ?> required>
				<span><?php esc_html_e( 'I confirm that I am a qualified researcher and that all products will be used strictly for laboratory research, never for human or veterinary use.', 'north-specs-labs' ); ?></span>
			</label>
		</p>
		<?php
	}
);

add_filter(
	'woocommerce_registration_errors',
	function ( WP_Error $errors ): WP_Error {
		if ( empty( $_POST['research_organization'] ) ) {
			$errors->add( 'research_organization_error', __( 'Please enter your laboratory or organization.', 'north-specs-labs' ) );
		}
		if ( empty( $_POST['research_role'] ) ) {
			$errors->add( 'research_role_error', __( 'Please select your research role.', 'north-specs-labs' ) );
		}
		if ( empty( $_POST['research_use_consent'] ) ) {
			$errors->add( 'research_consent_error', __( 'Research Use Only confirmation is required.', 'north-specs-labs' ) );
		}
		return $errors;
	}
);

add_action(
	'woocommerce_created_customer',
	function ( int $customer_id ): void {
		if ( isset( $_POST['research_organization'] ) ) {
			update_user_meta( $customer_id, 'research_organization', sanitize_text_field( wp_unslash( $_POST['research_organization'] ) ) );
		}
		if ( isset( $_POST['research_role'] ) ) {
			update_user_meta( $customer_id, 'research_role', sanitize_text_field( wp_unslash( $_POST['research_role'] ) ) );
		}
		if ( ! empty( $_POST['research_use_consent'] ) ) {
			update_user_meta( $customer_id, 'research_use_attested_at', gmdate( 'c' ) );
		}
	}
);

/** Collect laboratory identity on every checkout, including guest orders. */
add_filter(
	'woocommerce_checkout_fields',
	function ( array $fields ): array {
		$fields['billing']['billing_research_organization'] = array(
			'type'         => 'text',
			'label'        => __( 'Laboratory or organization', 'north-specs-labs' ),
			'placeholder'  => __( 'Institution or registered laboratory', 'north-specs-labs' ),
			'required'     => true,
			'class'        => array( 'form-row-wide' ),
			'priority'     => 35,
			'autocomplete' => 'organization',
			'default'      => get_current_user_id() ? get_user_meta( get_current_user_id(), 'research_organization', true ) : '',
		);
		$fields['billing']['billing_research_role'] = array(
			'type'     => 'select',
			'label'    => __( 'Research or procurement role', 'north-specs-labs' ),
			'required' => true,
			'class'    => array( 'form-row-wide' ),
			'priority' => 36,
			'options'  => array(
				''                          => __( 'Select your role', 'north-specs-labs' ),
				'Principal investigator'    => __( 'Principal investigator', 'north-specs-labs' ),
				'Laboratory manager'        => __( 'Laboratory manager', 'north-specs-labs' ),
				'Research scientist'        => __( 'Research scientist', 'north-specs-labs' ),
				'Procurement'               => __( 'Procurement', 'north-specs-labs' ),
				'Academic researcher'       => __( 'Academic researcher', 'north-specs-labs' ),
				'Other qualified researcher'=> __( 'Other qualified researcher', 'north-specs-labs' ),
			),
			'default' => get_current_user_id() ? get_user_meta( get_current_user_id(), 'research_role', true ) : '',
		);
		return $fields;
	}
);

add_action(
	'woocommerce_checkout_create_order',
	function ( WC_Order $order ): void {
		if ( isset( $_POST['billing_research_organization'] ) ) {
			$order->update_meta_data( '_billing_research_organization', sanitize_text_field( wp_unslash( $_POST['billing_research_organization'] ) ) );
		}
		if ( isset( $_POST['billing_research_role'] ) ) {
			$order->update_meta_data( '_billing_research_role', sanitize_text_field( wp_unslash( $_POST['billing_research_role'] ) ) );
		}
	},
	10
);

add_action(
	'woocommerce_checkout_update_user_meta',
	function ( int $customer_id ): void {
		if ( isset( $_POST['billing_research_organization'] ) ) {
			update_user_meta( $customer_id, 'research_organization', sanitize_text_field( wp_unslash( $_POST['billing_research_organization'] ) ) );
		}
		if ( isset( $_POST['billing_research_role'] ) ) {
			update_user_meta( $customer_id, 'research_role', sanitize_text_field( wp_unslash( $_POST['billing_research_role'] ) ) );
		}
	}
);

/** Mandatory RUO attestation at checkout. */
add_action(
	'woocommerce_review_order_before_submit',
	function (): void {
		woocommerce_form_field(
			'nsl_ruo_attestation',
			array(
				'type'     => 'checkbox',
				'class'    => array( 'form-row-wide', 'validate-required', 'nsl-checkout-attestation' ),
				'required' => true,
				'label'    => __( 'I confirm that I am purchasing on behalf of a qualified researcher, laboratory or institution. I understand these materials are strictly for laboratory Research Use Only and are not for human or veterinary use.', 'north-specs-labs' ),
			),
			isset( $_POST['nsl_ruo_attestation'] ) ? '1' : ''
		);
	},
	20
);

add_action(
	'woocommerce_checkout_process',
	function (): void {
		if ( empty( $_POST['nsl_ruo_attestation'] ) ) {
			wc_add_notice( __( 'Please confirm the Research Use Only terms before placing your order.', 'north-specs-labs' ), 'error' );
		}
	}
);

add_action(
	'woocommerce_checkout_create_order',
	function ( WC_Order $order ): void {
		if ( ! empty( $_POST['nsl_ruo_attestation'] ) ) {
			$order->update_meta_data( '_nsl_ruo_attested', 'yes' );
			$order->update_meta_data( '_nsl_ruo_attested_at', gmdate( 'c' ) );
			$order->update_meta_data( '_nsl_ruo_attested_user', get_current_user_id() );
		}
	},
	20
);

add_action(
	'woocommerce_admin_order_data_after_billing_address',
	function ( WC_Order $order ): void {
		$organization = $order->get_meta( '_billing_research_organization' );
		$role         = $order->get_meta( '_billing_research_role' );
		if ( $organization || $role ) {
			echo '<p><strong>' . esc_html__( 'Research entity:', 'north-specs-labs' ) . '</strong><br>' . esc_html( $organization ) . ( $role ? '<br>' . esc_html( $role ) : '' ) . '</p>';
		}
		if ( 'yes' === $order->get_meta( '_nsl_ruo_attested' ) ) {
			echo '<p><strong>' . esc_html__( 'Research Use Only attestation:', 'north-specs-labs' ) . '</strong><br>' . esc_html( $order->get_meta( '_nsl_ruo_attested_at' ) ) . '</p>';
		}
	}
);

/** A useful researcher dashboard instead of the default greeting-only view. */
remove_action( 'woocommerce_account_dashboard', 'woocommerce_account_dashboard' );
add_action(
	'woocommerce_account_dashboard',
	function (): void {
		$user = wp_get_current_user();
		?>
		<div class="nsl-account-welcome">
			<?php nsl_eyebrow( 'Researcher account' ); ?>
			<h2><?php echo esc_html( sprintf( __( 'Welcome back, %s', 'north-specs-labs' ), $user->display_name ) ); ?></h2>
			<p><?php esc_html_e( 'Review orders, manage laboratory details and access support from your secure workspace.', 'north-specs-labs' ); ?></p>
		</div>
		<div class="nsl-account-actions">
			<a href="<?php echo esc_url( wc_get_account_endpoint_url( 'orders' ) ); ?>"><?php echo nsl_icon( 'package' ); ?><strong><?php esc_html_e( 'Order history', 'north-specs-labs' ); ?></strong><span><?php esc_html_e( 'Status, details and reorder tools', 'north-specs-labs' ); ?></span></a>
			<a href="<?php echo esc_url( nsl_page_url( 'track-order', '/track-order/' ) ); ?>"><?php echo nsl_icon( 'search' ); ?><strong><?php esc_html_e( 'Track an order', 'north-specs-labs' ); ?></strong><span><?php esc_html_e( 'Find a guest or laboratory order', 'north-specs-labs' ); ?></span></a>
			<a href="<?php echo esc_url( nsl_page_url( 'contact', '/contact/' ) ); ?>"><?php echo nsl_icon( 'flask' ); ?><strong><?php esc_html_e( 'Research support', 'north-specs-labs' ); ?></strong><span><?php esc_html_e( 'Contact our documentation team', 'north-specs-labs' ); ?></span></a>
		</div>
		<?php
	}
);

/** Visual order timeline on thank-you and order detail pages. */
function nsl_order_timeline( int $order_id ): void {
	$order = wc_get_order( $order_id );
	if ( ! $order ) {
		return;
	}
	$status = $order->get_status();
	$rank   = array( 'pending' => 0, 'on-hold' => 1, 'processing' => 1, 'completed' => 3, 'cancelled' => -1, 'failed' => -1, 'refunded' => -1 );
	$active = $rank[ $status ] ?? 1;
	?>
	<section class="nsl-order-timeline" aria-label="<?php esc_attr_e( 'Order progress', 'north-specs-labs' ); ?>">
		<h2><?php esc_html_e( 'Order progress', 'north-specs-labs' ); ?></h2>
		<ol>
			<?php foreach ( array( 'Order received', 'Payment confirmed', 'Laboratory dispatch', 'Completed' ) as $index => $label ) : ?>
				<li class="<?php echo $index <= $active ? 'is-complete' : ''; ?>"><span><?php echo nsl_icon( 'check' ); ?></span><strong><?php echo esc_html( $label ); ?></strong></li>
			<?php endforeach; ?>
		</ol>
	</section>
	<?php
}
add_action( 'woocommerce_thankyou', 'nsl_order_timeline', 8 );
add_action( 'woocommerce_view_order', 'nsl_order_timeline', 8 );
