<?php
/**
 * Password recovery request.
 *
 * Overrides woocommerce/myaccount/form-lost-password.php.
 *
 * @package NorthSpecsLabs
 */

defined( 'ABSPATH' ) || exit;

do_action( 'woocommerce_before_lost_password_form' );
?>

<div class="nsl-recovery">
	<header>
		<?php nsl_eyebrow( 'Account recovery' ); ?>
		<h1><?php esc_html_e( 'Reset your password', 'north-specs-labs' ); ?></h1>
		<p><?php esc_html_e( 'Enter the email address on your researcher account. We send a single-use link that expires shortly — nothing about your account changes until you follow it.', 'north-specs-labs' ); ?></p>
	</header>

	<form method="post" class="woocommerce-ResetPassword lost_reset_password nsl-recovery__form">
		<p class="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
			<label for="user_login"><?php esc_html_e( 'Email address', 'north-specs-labs' ); ?>&nbsp;<span class="required" aria-hidden="true">*</span></label>
			<input class="woocommerce-Input woocommerce-Input--text input-text" type="text" name="user_login" id="user_login" autocomplete="username" required>
		</p>

		<?php do_action( 'woocommerce_lostpassword_form' ); ?>

		<p class="woocommerce-form-row form-row">
			<input type="hidden" name="wc_reset_password" value="true">
			<button type="submit" class="nsl-button" value="<?php esc_attr_e( 'Send reset link', 'north-specs-labs' ); ?>"><?php esc_html_e( 'Send reset link', 'north-specs-labs' ); ?><?php echo nsl_icon( 'arrow' ); ?></button>
		</p>

		<?php wp_nonce_field( 'lost_password', 'woocommerce-lost-password-nonce' ); ?>
	</form>

	<aside class="nsl-recovery__aside">
		<h2><?php esc_html_e( 'If the email does not arrive', 'north-specs-labs' ); ?></h2>
		<ol>
			<li><strong><?php esc_html_e( 'Check spam and quarantine', 'north-specs-labs' ); ?></strong><span><?php esc_html_e( 'Institutional mail filters often hold automated messages.', 'north-specs-labs' ); ?></span></li>
			<li><strong><?php esc_html_e( 'Confirm the address', 'north-specs-labs' ); ?></strong><span><?php esc_html_e( 'Use the address that received your order confirmation.', 'north-specs-labs' ); ?></span></li>
			<li><strong><?php esc_html_e( 'Ask research support', 'north-specs-labs' ); ?></strong><span><?php esc_html_e( 'We can confirm which address holds the account. We never send or ask for passwords.', 'north-specs-labs' ); ?></span></li>
		</ol>
		<a class="nsl-text-link" href="<?php echo esc_url( nsl_page_url( 'contact', '/contact/' ) ); ?>"><?php esc_html_e( 'Contact research support', 'north-specs-labs' ); ?><?php echo nsl_icon( 'arrow' ); ?></a>
	</aside>
</div>

<?php do_action( 'woocommerce_after_lost_password_form' ); ?>
