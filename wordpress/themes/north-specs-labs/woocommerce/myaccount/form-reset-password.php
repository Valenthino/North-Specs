<?php
/**
 * Set a new password.
 *
 * Overrides woocommerce/myaccount/form-reset-password.php.
 *
 * @package NorthSpecsLabs
 */

defined( 'ABSPATH' ) || exit;

do_action( 'woocommerce_before_reset_password_form' );
?>

<div class="nsl-recovery">
	<header>
		<?php nsl_eyebrow( 'Account recovery' ); ?>
		<h1><?php esc_html_e( 'Choose a new password', 'north-specs-labs' ); ?></h1>
		<p><?php esc_html_e( 'Use at least 12 characters that you do not use on any other service. You will be signed in as soon as it is saved.', 'north-specs-labs' ); ?></p>
	</header>

	<form method="post" class="woocommerce-ResetPassword lost_reset_password nsl-recovery__form">
		<p class="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
			<label for="password_1"><?php esc_html_e( 'New password', 'north-specs-labs' ); ?>&nbsp;<span class="required" aria-hidden="true">*</span></label>
			<input type="password" class="woocommerce-Input woocommerce-Input--text input-text" name="password_1" id="password_1" autocomplete="new-password" required>
		</p>
		<p class="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
			<label for="password_2"><?php esc_html_e( 'Re-enter new password', 'north-specs-labs' ); ?>&nbsp;<span class="required" aria-hidden="true">*</span></label>
			<input type="password" class="woocommerce-Input woocommerce-Input--text input-text" name="password_2" id="password_2" autocomplete="new-password" required>
		</p>

		<input type="hidden" name="reset_key" value="<?php echo esc_attr( $args['key'] ); ?>">
		<input type="hidden" name="reset_login" value="<?php echo esc_attr( $args['login'] ); ?>">

		<?php do_action( 'woocommerce_resetpassword_form' ); ?>

		<p class="woocommerce-form-row form-row">
			<input type="hidden" name="wc_reset_password" value="true">
			<button type="submit" class="nsl-button" value="<?php esc_attr_e( 'Save new password', 'north-specs-labs' ); ?>"><?php esc_html_e( 'Save new password', 'north-specs-labs' ); ?><?php echo nsl_icon( 'arrow' ); ?></button>
		</p>

		<?php wp_nonce_field( 'reset_password', 'woocommerce-reset-password-nonce' ); ?>
	</form>
</div>

<?php do_action( 'woocommerce_after_reset_password_form' ); ?>
