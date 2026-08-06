<?php
/**
 * Password reset confirmation.
 *
 * Overrides woocommerce/myaccount/lost-password-confirmation.php.
 *
 * @package NorthSpecsLabs
 */

defined( 'ABSPATH' ) || exit;

do_action( 'woocommerce_before_lost_password_confirmation_message' );
?>
<div class="nsl-recovery nsl-recovery--confirmation">
	<header>
		<?php nsl_eyebrow( 'Account recovery' ); ?>
		<h1><?php esc_html_e( 'Check your inbox', 'north-specs-labs' ); ?></h1>
		<p>
			<?php
			echo esc_html(
				apply_filters(
					'woocommerce_lost_password_confirmation_message',
					esc_html__( 'A reset link has been sent to the address on file for this account. Institutional mail filters can delay it by several minutes.', 'north-specs-labs' )
				)
			);
			?>
		</p>
	</header>
	<div class="nsl-recovery__next">
		<p><?php esc_html_e( 'The link works once and expires shortly. Wait at least ten minutes before requesting another. If nothing arrives, check spam and quarantine, then contact research support.', 'north-specs-labs' ); ?></p>
		<div class="nsl-button-group">
			<a class="nsl-button" href="<?php echo esc_url( wc_get_page_permalink( 'myaccount' ) ); ?>"><?php esc_html_e( 'Back to sign in', 'north-specs-labs' ); ?><?php echo nsl_icon( 'arrow' ); ?></a>
			<a class="nsl-text-link" href="<?php echo esc_url( nsl_page_url( 'contact', '/contact/' ) ); ?>"><?php esc_html_e( 'Contact research support', 'north-specs-labs' ); ?><?php echo nsl_icon( 'arrow' ); ?></a>
		</div>
	</div>
</div>
<?php do_action( 'woocommerce_after_lost_password_confirmation_message' ); ?>
