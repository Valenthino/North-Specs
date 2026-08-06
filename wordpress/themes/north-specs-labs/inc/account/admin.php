<?php
/**
 * Fulfilment-side administration: per-item lots, shipment tracking, settings.
 *
 * @package NorthSpecsLabs
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** The order edit screen identifier under HPOS or legacy post storage. */
function nsl_order_admin_screen(): string {
	if ( class_exists( '\Automattic\WooCommerce\Utilities\OrderUtil' ) && \Automattic\WooCommerce\Utilities\OrderUtil::custom_orders_table_usage_is_enabled() ) {
		return wc_get_page_screen_id( 'shop-order' );
	}

	return 'shop_order';
}

/* -------------------------------------------------------------------------
 * Per-item lot capture
 * ---------------------------------------------------------------------- */

/** A lot field on every order line, editable at any order status. */
add_action(
	'woocommerce_after_order_itemmeta',
	function ( $item_id, $item ): void {
		if ( ! $item instanceof WC_Order_Item_Product || ! current_user_can( 'edit_shop_orders' ) ) {
			return;
		}

		$lot        = nsl_order_item_lot( $item );
		$product_id = (int) $item->get_product_id();
		$document   = $lot ? nsl_find_batch_document( $product_id, $lot ) : null;
		?>
		<div class="nsl-admin-lot" style="margin-top:8px;padding-top:8px;border-top:1px solid #eee">
			<label for="nsl-lot-<?php echo esc_attr( (string) $item_id ); ?>" style="display:block;font-weight:600;margin-bottom:3px">
				<?php esc_html_e( 'Supplied lot / batch', 'north-specs-labs' ); ?>
			</label>
			<input
				type="text"
				id="nsl-lot-<?php echo esc_attr( (string) $item_id ); ?>"
				name="nsl_item_lot[<?php echo esc_attr( (string) $item_id ); ?>]"
				value="<?php echo esc_attr( $lot ); ?>"
				placeholder="<?php esc_attr_e( 'Exactly as printed on the label', 'north-specs-labs' ); ?>"
				style="width:100%;max-width:260px">
			<p style="margin:5px 0 0;font-size:11px;line-height:1.5;color:#646970">
				<?php if ( $document ) : ?>
					<span style="color:#1b573a;font-weight:600">&#10003; <?php esc_html_e( 'Matched to a published batch document.', 'north-specs-labs' ); ?></span>
					<a href="<?php echo esc_url( get_edit_post_link( $document->ID ) ); ?>"><?php esc_html_e( 'Open record', 'north-specs-labs' ); ?></a>
				<?php elseif ( $lot ) : ?>
					<span style="color:#8a6d1f"><?php esc_html_e( 'No published batch document carries this lot for this product yet. Nothing is shown to the customer until one does.', 'north-specs-labs' ); ?></span>
				<?php else : ?>
					<?php esc_html_e( 'Leave blank until the lot is picked. Customers only ever see a document when this lot matches a published record.', 'north-specs-labs' ); ?>
				<?php endif; ?>
			</p>
		</div>
		<?php
	},
	10,
	2
);

/* -------------------------------------------------------------------------
 * Shipment tracking box
 * ---------------------------------------------------------------------- */

add_action(
	'add_meta_boxes',
	function (): void {
		add_meta_box(
			'nsl-shipments',
			__( 'Shipment tracking (customer visible)', 'north-specs-labs' ),
			'nsl_render_shipments_meta_box',
			nsl_order_admin_screen(),
			'side',
			'default'
		);
	},
	20
);

/** Manual tracking entry for shipments that never pass through ShipStation. */
function nsl_render_shipments_meta_box( $post_or_order ): void {
	$order = $post_or_order instanceof WC_Order ? $post_or_order : wc_get_order( $post_or_order->ID ?? 0 );
	if ( ! $order instanceof WC_Order ) {
		return;
	}

	$shipments = nsl_order_shipments( $order );
	wp_nonce_field( 'nsl_save_shipments', 'nsl_shipments_nonce' );
	?>
	<?php if ( $shipments ) : ?>
		<ul style="margin:0 0 12px;padding:0;list-style:none">
			<?php foreach ( $shipments as $shipment ) : ?>
				<li style="padding:8px 0;border-bottom:1px solid #f0f0f1">
					<strong><?php echo esc_html( $shipment['carrier_label'] ); ?></strong><br>
					<code><?php echo esc_html( $shipment['number'] ); ?></code><br>
					<small>
						<?php echo esc_html( $shipment['shipped_at'] ? date_i18n( get_option( 'date_format' ), $shipment['shipped_at'] ) : __( 'Date not recorded', 'north-specs-labs' ) ); ?>
						&middot; <?php echo esc_html( $shipment['source'] ); ?>
					</small><br>
					<label style="font-size:11px">
						<input type="checkbox" name="nsl_remove_shipment[]" value="<?php echo esc_attr( $shipment['number'] ); ?>">
						<?php esc_html_e( 'Remove on save', 'north-specs-labs' ); ?>
					</label>
				</li>
			<?php endforeach; ?>
		</ul>
	<?php else : ?>
		<p style="margin-top:0"><?php esc_html_e( 'No tracking recorded. ShipStation notifications are captured automatically; add a number here for shipments dispatched another way.', 'north-specs-labs' ); ?></p>
	<?php endif; ?>

	<p>
		<label for="nsl-new-carrier" style="display:block;font-weight:600"><?php esc_html_e( 'Carrier', 'north-specs-labs' ); ?></label>
		<select id="nsl-new-carrier" name="nsl_new_carrier" style="width:100%">
			<option value=""><?php esc_html_e( 'Select a carrier', 'north-specs-labs' ); ?></option>
			<?php foreach ( nsl_carriers() as $definition ) : ?>
				<option value="<?php echo esc_attr( $definition['label'] ); ?>"><?php echo esc_html( $definition['label'] ); ?></option>
			<?php endforeach; ?>
		</select>
	</p>
	<p>
		<label for="nsl-new-tracking" style="display:block;font-weight:600"><?php esc_html_e( 'Tracking number', 'north-specs-labs' ); ?></label>
		<input type="text" id="nsl-new-tracking" name="nsl_new_tracking" style="width:100%" placeholder="<?php esc_attr_e( 'Paste the carrier number', 'north-specs-labs' ); ?>">
	</p>
	<p style="margin-bottom:0;font-size:11px;color:#646970">
		<?php esc_html_e( 'Saved tracking appears in the customer account, the guest tracking page and the order timeline.', 'north-specs-labs' ); ?>
	</p>
	<?php
}

/** Persist lots, added tracking and removals with one order save. */
add_action(
	'woocommerce_process_shop_order_meta',
	function ( $order_id ): void {
		if ( ! current_user_can( 'edit_shop_orders' ) ) {
			return;
		}

		$order = wc_get_order( $order_id );
		if ( ! $order instanceof WC_Order ) {
			return;
		}

		// phpcs:disable WordPress.Security.NonceVerification.Missing -- WooCommerce verifies its order nonce before this hook fires.
		if ( isset( $_POST['nsl_item_lot'] ) && is_array( $_POST['nsl_item_lot'] ) ) {
			foreach ( wp_unslash( $_POST['nsl_item_lot'] ) as $item_id => $lot ) {
				$item = $order->get_item( absint( $item_id ) );
				if ( ! $item ) {
					continue;
				}
				$clean = sanitize_text_field( (string) $lot );
				if ( '' === $clean ) {
					$item->delete_meta_data( NSL_LOT_ITEM_META );
				} else {
					$item->update_meta_data( NSL_LOT_ITEM_META, $clean );
				}
				$item->save();
			}
		}

		if ( isset( $_POST['nsl_shipments_nonce'] ) && wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nsl_shipments_nonce'] ) ), 'nsl_save_shipments' ) ) {
			foreach ( (array) ( $_POST['nsl_remove_shipment'] ?? array() ) as $number ) {
				nsl_remove_order_shipment( $order, sanitize_text_field( wp_unslash( $number ) ) );
			}

			$number = sanitize_text_field( wp_unslash( $_POST['nsl_new_tracking'] ?? '' ) );
			if ( '' !== $number ) {
				nsl_add_order_shipment( $order, $number, sanitize_text_field( wp_unslash( $_POST['nsl_new_carrier'] ?? '' ) ), time(), 'manual' );
			}
		}
		// phpcs:enable
	},
	60
);

/* -------------------------------------------------------------------------
 * Settings
 * ---------------------------------------------------------------------- */

add_action(
	'admin_menu',
	function (): void {
		add_submenu_page(
			'woocommerce',
			__( 'Account & Security', 'north-specs-labs' ),
			__( 'Account & Security', 'north-specs-labs' ),
			'manage_woocommerce',
			'nsl-account-security',
			'nsl_render_account_settings'
		);
	},
	20
);

function nsl_render_account_settings(): void {
	if ( ! current_user_can( 'manage_woocommerce' ) ) {
		return;
	}

	$turnstile = nsl_turnstile_keys();
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'Researcher accounts & security', 'north-specs-labs' ); ?></h1>
		<?php if ( isset( $_GET['nsl_backfilled'] ) ) : // phpcs:ignore WordPress.Security.NonceVerification.Recommended ?>
			<div class="notice notice-success"><p>
				<?php echo esc_html( sprintf( __( '%d shipment(s) recovered from ShipStation order notes.', 'north-specs-labs' ), absint( $_GET['nsl_backfilled'] ) ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended ?>
			</p></div>
		<?php endif; ?>

		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
			<input type="hidden" name="action" value="nsl_save_account_settings">
			<?php wp_nonce_field( 'nsl_account_settings', 'nsl_account_settings_nonce' ); ?>

			<h2><?php esc_html_e( 'Bot protection', 'north-specs-labs' ); ?></h2>
			<p><?php esc_html_e( 'Cloudflare Turnstile protects sign-in, registration and password reset. It stays completely inactive until both keys are saved.', 'north-specs-labs' ); ?></p>
			<table class="form-table">
				<tr>
					<th><label for="nsl-turnstile-site"><?php esc_html_e( 'Turnstile site key', 'north-specs-labs' ); ?></label></th>
					<td><input id="nsl-turnstile-site" name="turnstile_site_key" class="regular-text" value="<?php echo esc_attr( $turnstile['site'] ); ?>"></td>
				</tr>
				<tr>
					<th><label for="nsl-turnstile-secret"><?php esc_html_e( 'Turnstile secret key', 'north-specs-labs' ); ?></label></th>
					<td>
						<input id="nsl-turnstile-secret" name="turnstile_secret_key" class="regular-text" type="password" value="<?php echo esc_attr( $turnstile['secret'] ); ?>" autocomplete="off">
						<p class="description"><?php echo esc_html( nsl_turnstile_active() ? __( 'Active on all account forms.', 'north-specs-labs' ) : __( 'Inactive — both keys are required.', 'north-specs-labs' ) ); ?></p>
					</td>
				</tr>
			</table>

			<h2><?php esc_html_e( 'Administrator two-factor', 'north-specs-labs' ); ?></h2>
			<p><?php esc_html_e( 'Researcher accounts stay simple: email, password, reset. Only accounts that can change the store are challenged, and only when this is enabled.', 'north-specs-labs' ); ?></p>
			<table class="form-table">
				<tr>
					<th><?php esc_html_e( 'Email sign-in codes', 'north-specs-labs' ); ?></th>
					<td>
						<label>
							<input type="checkbox" name="admin_2fa" value="yes" <?php checked( 'yes', get_option( 'nsl_admin_2fa', 'no' ) ); ?>>
							<?php esc_html_e( 'Require a six-digit emailed code for administrator and shop-manager sign-ins', 'north-specs-labs' ); ?>
						</label>
						<p class="description"><?php esc_html_e( 'Confirm that outgoing email is delivering reliably before enabling this. Customers are never affected.', 'north-specs-labs' ); ?></p>
					</td>
				</tr>
			</table>

			<?php submit_button( __( 'Save account settings', 'north-specs-labs' ) ); ?>
		</form>

		<hr>
		<h2><?php esc_html_e( 'Recover tracking from ShipStation notes', 'north-specs-labs' ); ?></h2>
		<p><?php esc_html_e( 'Orders shipped before structured tracking existed still carry the ShipStation note. This reads those notes and makes the tracking visible in the customer account. It is safe to run more than once.', 'north-specs-labs' ); ?></p>
		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
			<input type="hidden" name="action" value="nsl_backfill_shipments">
			<?php wp_nonce_field( 'nsl_backfill_shipments', 'nsl_backfill_nonce' ); ?>
			<?php submit_button( __( 'Recover tracking now', 'north-specs-labs' ), 'secondary', 'submit', false ); ?>
		</form>
	</div>
	<?php
}

add_action(
	'admin_post_nsl_save_account_settings',
	function (): void {
		if ( ! current_user_can( 'manage_woocommerce' ) || ! isset( $_POST['nsl_account_settings_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nsl_account_settings_nonce'] ) ), 'nsl_account_settings' ) ) {
			wp_die( esc_html__( 'You are not allowed to update these settings.', 'north-specs-labs' ) );
		}

		update_option( 'nsl_turnstile_site_key', sanitize_text_field( wp_unslash( $_POST['turnstile_site_key'] ?? '' ) ) );
		update_option( 'nsl_turnstile_secret_key', sanitize_text_field( wp_unslash( $_POST['turnstile_secret_key'] ?? '' ) ) );
		update_option( 'nsl_admin_2fa', empty( $_POST['admin_2fa'] ) ? 'no' : 'yes' );

		wp_safe_redirect( admin_url( 'admin.php?page=nsl-account-security&updated=true' ) );
		exit;
	}
);

add_action(
	'admin_post_nsl_backfill_shipments',
	function (): void {
		if ( ! current_user_can( 'manage_woocommerce' ) || ! isset( $_POST['nsl_backfill_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nsl_backfill_nonce'] ) ), 'nsl_backfill_shipments' ) ) {
			wp_die( esc_html__( 'You are not allowed to run this task.', 'north-specs-labs' ) );
		}

		$restored = nsl_backfill_shipments_from_notes();
		wp_safe_redirect( admin_url( 'admin.php?page=nsl-account-security&nsl_backfilled=' . $restored ) );
		exit;
	}
);
