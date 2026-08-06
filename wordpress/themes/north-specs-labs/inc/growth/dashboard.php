<?php
/**
 * Conversion report and the controls behind it.
 *
 * @package NorthSpecsLabs
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action(
	'admin_menu',
	function (): void {
		add_submenu_page(
			'woocommerce',
			__( 'Conversion', 'north-specs-labs' ),
			__( 'Conversion', 'north-specs-labs' ),
			'manage_woocommerce',
			'nsl-conversion',
			'nsl_render_conversion_dashboard'
		);
	},
	21
);

function nsl_render_conversion_dashboard(): void {
	if ( ! current_user_can( 'manage_woocommerce' ) ) {
		return;
	}

	// phpcs:ignore WordPress.Security.NonceVerification.Recommended
	$days   = isset( $_GET['days'] ) ? max( 1, min( 365, absint( $_GET['days'] ) ) ) : 30;
	$totals = nsl_funnel_totals( $days );
	$steps  = nsl_funnel_steps();
	$top    = 0;
	foreach ( $steps as $key => $label ) {
		$top = max( $top, $totals[ $key ] ?? 0 );
		unset( $label );
	}
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'Conversion', 'north-specs-labs' ); ?></h1>
		<p><?php esc_html_e( 'Recorded first-party, on this server. Counts are per day per event with nothing stored about any individual visitor. Store staff and known bots are excluded.', 'north-specs-labs' ); ?></p>

		<p>
			<?php foreach ( array( 7, 30, 90 ) as $window ) : ?>
				<a class="button<?php echo $days === $window ? ' button-primary' : ''; ?>" href="<?php echo esc_url( admin_url( 'admin.php?page=nsl-conversion&days=' . $window ) ); ?>">
					<?php echo esc_html( sprintf( __( 'Last %d days', 'north-specs-labs' ), $window ) ); ?>
				</a>
			<?php endforeach; ?>
		</p>

		<h2><?php esc_html_e( 'Purchase funnel', 'north-specs-labs' ); ?></h2>
		<?php if ( ! $top ) : ?>
			<div class="notice notice-info inline"><p><?php esc_html_e( 'No traffic recorded in this window yet. Counting starts from the moment this was deployed, so give it a few days.', 'north-specs-labs' ); ?></p></div>
		<?php else : ?>
			<table class="widefat striped" style="max-width:820px">
				<thead><tr>
					<th><?php esc_html_e( 'Step', 'north-specs-labs' ); ?></th>
					<th style="width:110px"><?php esc_html_e( 'Count', 'north-specs-labs' ); ?></th>
					<th style="width:120px"><?php esc_html_e( 'Of previous', 'north-specs-labs' ); ?></th>
					<th style="width:220px"></th>
				</tr></thead>
				<tbody>
				<?php
				$previous = 0;
				foreach ( $steps as $key => $label ) :
					$value = (int) ( $totals[ $key ] ?? 0 );
					$rate  = $previous > 0 ? ( $value / $previous ) * 100 : null;
					$width = $top > 0 ? ( $value / $top ) * 100 : 0;
					?>
					<tr>
						<td><strong><?php echo esc_html( $label ); ?></strong></td>
						<td><?php echo esc_html( number_format_i18n( $value ) ); ?></td>
						<td><?php echo null === $rate ? '&mdash;' : esc_html( number_format_i18n( $rate, 1 ) . '%' ); ?></td>
						<td><span style="display:block;height:14px;border-radius:3px;background:#1B573A;width:<?php echo esc_attr( (string) round( $width ) ); ?>%"></span></td>
					</tr>
					<?php
					$previous = $value;
				endforeach;
				?>
				</tbody>
			</table>
			<?php
			$submitted = (int) ( $totals['order_submitted'] ?? 0 );
			$paid      = (int) ( $totals['order_paid'] ?? 0 );
			if ( $submitted > 0 && 0 === $paid ) :
				?>
				<div class="notice notice-warning inline" style="max-width:820px;margin-top:14px"><p>
					<strong><?php esc_html_e( 'Orders are being submitted but none are clearing payment.', 'north-specs-labs' ); ?></strong>
					<?php esc_html_e( 'Bank transfer and purchase order are the only enabled gateways, so every order waits on a manual step. Enabling card payment is the single largest lever available.', 'north-specs-labs' ); ?>
				</p></div>
			<?php endif; ?>
		<?php endif; ?>

		<h2><?php esc_html_e( 'Self-service and lifecycle', 'north-specs-labs' ); ?></h2>
		<table class="widefat striped" style="max-width:560px"><tbody>
			<?php
			$other = array(
				'account_sign_in'                  => __( 'Sign-ins', 'north-specs-labs' ),
				'account_registration'             => __( 'Registrations', 'north-specs-labs' ),
				'account_password_reset_requested' => __( 'Password resets requested', 'north-specs-labs' ),
				'order_lookup'                     => __( 'Guest order lookups', 'north-specs-labs' ),
				'order_detail_view'                => __( 'Order details viewed', 'north-specs-labs' ),
				'order_tracking_click'             => __( 'Tracking links opened', 'north-specs-labs' ),
				'order_receipt_download'           => __( 'Receipts opened', 'north-specs-labs' ),
				'batch_document_access'            => __( 'Batch documents opened', 'north-specs-labs' ),
				'order_reorder'                    => __( 'Reorders', 'north-specs-labs' ),
				'cart_reminder_sent'               => __( 'Cart reminders sent', 'north-specs-labs' ),
				'review_request_sent'              => __( 'Review requests sent', 'north-specs-labs' ),
				'reorder_nudge_sent'               => __( 'Reorder reminders sent', 'north-specs-labs' ),
			);
			foreach ( $other as $key => $label ) :
				?>
				<tr><td><?php echo esc_html( $label ); ?></td><td style="width:90px"><?php echo esc_html( number_format_i18n( (int) ( $totals[ $key ] ?? 0 ) ) ); ?></td></tr>
			<?php endforeach; ?>
		</tbody></table>

		<h2 style="margin-top:28px"><?php esc_html_e( 'Settings', 'north-specs-labs' ); ?></h2>
		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
			<input type="hidden" name="action" value="nsl_save_conversion_settings">
			<?php wp_nonce_field( 'nsl_conversion_settings', 'nsl_conversion_nonce' ); ?>
			<table class="form-table">
				<tr>
					<th><label for="nsl-threshold"><?php esc_html_e( 'Free dispatch over', 'north-specs-labs' ); ?></label></th>
					<td>
						<input id="nsl-threshold" name="free_shipping_threshold" type="number" min="0" step="1" class="small-text" value="<?php echo esc_attr( (string) nsl_free_shipping_threshold() ); ?>">
						<?php echo esc_html( get_woocommerce_currency() ); ?>
						<p class="description"><?php esc_html_e( 'Applies to the Canada shipping zone. Set to 0 to remove free dispatch entirely and go back to flat rate on every order. Saving re-syncs the shipping method immediately.', 'north-specs-labs' ); ?></p>
					</td>
				</tr>
				<tr>
					<th><?php esc_html_e( 'Lifecycle reminders', 'north-specs-labs' ); ?></th>
					<td>
						<?php
						$toggles = array(
							'cart'    => __( 'Saved-cart reminder, once per cart, four hours after it is left', 'north-specs-labs' ),
							'review'  => __( 'Review request, ten days after an order completes', 'north-specs-labs' ),
							'reorder' => __( 'Reorder reminder, seventy-five days after an order completes', 'north-specs-labs' ),
						);
						foreach ( $toggles as $key => $label ) :
							?>
							<label style="display:block;margin-bottom:6px">
								<input type="checkbox" name="lifecycle_<?php echo esc_attr( $key ); ?>" value="yes" <?php checked( true, nsl_lifecycle_enabled( $key ) ); ?>>
								<?php echo esc_html( $label ); ?>
							</label>
						<?php endforeach; ?>
						<p class="description">
							<?php esc_html_e( 'Sent only to signed-in researchers with an existing order relationship, never to anonymous visitors, and every message carries a one-click opt-out. This is what keeps the reminders on the right side of Canadian anti-spam law.', 'north-specs-labs' ); ?>
						</p>
					</td>
				</tr>
			</table>
			<?php submit_button( __( 'Save conversion settings', 'north-specs-labs' ) ); ?>
		</form>
	</div>
	<?php
}

add_action(
	'admin_post_nsl_save_conversion_settings',
	function (): void {
		if ( ! current_user_can( 'manage_woocommerce' ) || ! isset( $_POST['nsl_conversion_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nsl_conversion_nonce'] ) ), 'nsl_conversion_settings' ) ) {
			wp_die( esc_html__( 'You are not allowed to update these settings.', 'north-specs-labs' ) );
		}

		update_option( 'nsl_free_shipping_threshold', max( 0, (float) ( $_POST['free_shipping_threshold'] ?? 0 ) ) );
		foreach ( array( 'cart', 'review', 'reorder' ) as $key ) {
			update_option( 'nsl_lifecycle_' . $key, empty( $_POST[ 'lifecycle_' . $key ] ) ? 'no' : 'yes' );
		}

		nsl_sync_free_shipping();
		delete_option( 'nsl_free_shipping_signature' );

		wp_safe_redirect( admin_url( 'admin.php?page=nsl-conversion&updated=true' ) );
		exit;
	}
);
