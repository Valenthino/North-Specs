<?php
/**
 * The researcher account entrance.
 *
 * Four clear paths: sign in, create an account, recover a password, or track a
 * guest order. Overrides woocommerce/myaccount/form-login.php.
 *
 * @package NorthSpecsLabs
 */

defined( 'ABSPATH' ) || exit;

do_action( 'woocommerce_before_customer_login_form' );

$nsl_registration = 'yes' === get_option( 'woocommerce_enable_myaccount_registration' );
// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- presentation only.
$nsl_open_register = $nsl_registration && ( isset( $_GET['action'] ) && 'register' === sanitize_key( wp_unslash( $_GET['action'] ) ) );
?>

<div class="nsl-signin">
	<header class="nsl-signin__intro">
		<?php nsl_eyebrow( 'Researcher account' ); ?>
		<h1><?php esc_html_e( 'Sign in to your laboratory workspace', 'north-specs-labs' ); ?></h1>
		<p><?php esc_html_e( 'Your account holds every order, shipment, receipt and batch record in one place. Accounts are for qualified researchers, laboratories and institutional procurement teams.', 'north-specs-labs' ); ?></p>
	</header>

	<div class="nsl-signin__layout">
		<div class="nsl-signin__forms">
			<section class="nsl-signin-panel" aria-labelledby="nsl-signin-title" id="nsl-signin">
				<h2 id="nsl-signin-title"><?php echo nsl_icon( 'lock' ); ?><?php esc_html_e( 'Sign in', 'north-specs-labs' ); ?></h2>
				<p class="nsl-signin-panel__lede"><?php esc_html_e( 'Returning researchers: use the email address on your last order.', 'north-specs-labs' ); ?></p>

				<form class="woocommerce-form woocommerce-form-login login" method="post" novalidate>
					<?php do_action( 'woocommerce_login_form_start' ); ?>

					<p class="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
						<label for="username"><?php esc_html_e( 'Email address', 'north-specs-labs' ); ?>&nbsp;<span class="required" aria-hidden="true">*</span><span class="screen-reader-text"><?php esc_html_e( 'Required', 'north-specs-labs' ); ?></span></label>
						<input type="text" class="woocommerce-Input woocommerce-Input--text input-text" name="username" id="username" autocomplete="username" value="<?php echo ( ! empty( $_POST['username'] ) && is_string( $_POST['username'] ) ) ? esc_attr( wp_unslash( $_POST['username'] ) ) : ''; // phpcs:ignore ?>" required aria-required="true">
					</p>
					<p class="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
						<label for="password"><?php esc_html_e( 'Password', 'north-specs-labs' ); ?>&nbsp;<span class="required" aria-hidden="true">*</span><span class="screen-reader-text"><?php esc_html_e( 'Required', 'north-specs-labs' ); ?></span></label>
						<input class="woocommerce-Input woocommerce-Input--text input-text" type="password" name="password" id="password" autocomplete="current-password" required aria-required="true">
					</p>

					<?php do_action( 'woocommerce_login_form' ); ?>

					<p class="form-row nsl-signin-panel__submit">
						<label class="woocommerce-form__label woocommerce-form__label-for-checkbox woocommerce-form-login__rememberme">
							<input class="woocommerce-form__input woocommerce-form__input-checkbox" name="rememberme" type="checkbox" id="rememberme" value="forever"> <span><?php esc_html_e( 'Keep me signed in', 'north-specs-labs' ); ?></span>
						</label>
						<?php wp_nonce_field( 'woocommerce-login', 'woocommerce-login-nonce' ); ?>
						<button type="submit" class="nsl-button woocommerce-form-login__submit" name="login" value="<?php esc_attr_e( 'Sign in', 'north-specs-labs' ); ?>"><?php esc_html_e( 'Sign in', 'north-specs-labs' ); ?><?php echo nsl_icon( 'arrow' ); ?></button>
					</p>
					<p class="woocommerce-LostPassword lost_password">
						<a href="<?php echo esc_url( wc_lostpassword_url() ); ?>"><?php esc_html_e( 'Forgot your password?', 'north-specs-labs' ); ?></a>
					</p>

					<?php do_action( 'woocommerce_login_form_end' ); ?>
				</form>
			</section>

			<?php if ( $nsl_registration ) : ?>
				<section class="nsl-signin-panel" aria-labelledby="nsl-register-title" id="nsl-register">
					<h2 id="nsl-register-title"><?php echo nsl_icon( 'user' ); ?><?php esc_html_e( 'Create a researcher account', 'north-specs-labs' ); ?></h2>
					<p class="nsl-signin-panel__lede"><?php esc_html_e( 'New to North Specs? Register your laboratory once, then order without re-entering institutional details.', 'north-specs-labs' ); ?></p>

					<details class="nsl-register-disclosure" <?php echo $nsl_open_register ? 'open' : ''; ?>>
						<summary><?php esc_html_e( 'Open the registration form', 'north-specs-labs' ); ?><?php echo nsl_icon( 'arrow' ); ?></summary>

						<form method="post" class="woocommerce-form woocommerce-form-register register" <?php do_action( 'woocommerce_register_form_tag' ); ?>>
							<?php do_action( 'woocommerce_register_form_start' ); ?>

							<?php if ( 'no' === get_option( 'woocommerce_registration_generate_username' ) ) : ?>
								<p class="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
									<label for="reg_username"><?php esc_html_e( 'Username', 'north-specs-labs' ); ?>&nbsp;<span class="required" aria-hidden="true">*</span></label>
									<input type="text" class="woocommerce-Input woocommerce-Input--text input-text" name="username" id="reg_username" autocomplete="username" value="<?php echo ( ! empty( $_POST['username'] ) ) ? esc_attr( wp_unslash( $_POST['username'] ) ) : ''; // phpcs:ignore ?>" required aria-required="true">
								</p>
							<?php endif; ?>

							<p class="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
								<label for="reg_email"><?php esc_html_e( 'Work email address', 'north-specs-labs' ); ?>&nbsp;<span class="required" aria-hidden="true">*</span></label>
								<input type="email" class="woocommerce-Input woocommerce-Input--text input-text" name="email" id="reg_email" autocomplete="email" value="<?php echo ( ! empty( $_POST['email'] ) ) ? esc_attr( wp_unslash( $_POST['email'] ) ) : ''; // phpcs:ignore ?>" required aria-required="true">
							</p>

							<?php if ( 'no' === get_option( 'woocommerce_registration_generate_password' ) ) : ?>
								<p class="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
									<label for="reg_password"><?php esc_html_e( 'Password', 'north-specs-labs' ); ?>&nbsp;<span class="required" aria-hidden="true">*</span></label>
									<input type="password" class="woocommerce-Input woocommerce-Input--text input-text" name="password" id="reg_password" autocomplete="new-password" required aria-required="true">
									<small><?php esc_html_e( 'Use at least 12 characters that you do not use anywhere else.', 'north-specs-labs' ); ?></small>
								</p>
							<?php else : ?>
								<p><?php esc_html_e( 'A link to set a new password will be sent to your email address.', 'north-specs-labs' ); ?></p>
							<?php endif; ?>

							<?php do_action( 'woocommerce_register_form' ); ?>

							<p class="woocommerce-form-row form-row">
								<?php wp_nonce_field( 'woocommerce-register', 'woocommerce-register-nonce' ); ?>
								<button type="submit" class="nsl-button woocommerce-form-register__submit" name="register" value="<?php esc_attr_e( 'Create account', 'north-specs-labs' ); ?>"><?php esc_html_e( 'Create account', 'north-specs-labs' ); ?><?php echo nsl_icon( 'arrow' ); ?></button>
							</p>

							<?php do_action( 'woocommerce_register_form_end' ); ?>
						</form>
					</details>
				</section>
			<?php endif; ?>

			<div class="nsl-signin-alt">
				<section class="nsl-signin-alt__card">
					<?php echo nsl_icon( 'lock' ); ?>
					<h3><?php esc_html_e( 'Recover your password', 'north-specs-labs' ); ?></h3>
					<p><?php esc_html_e( 'We email a single-use link that expires shortly. Support never asks for your password.', 'north-specs-labs' ); ?></p>
					<a class="nsl-text-link" href="<?php echo esc_url( wc_lostpassword_url() ); ?>"><?php esc_html_e( 'Send a reset link', 'north-specs-labs' ); ?><?php echo nsl_icon( 'arrow' ); ?></a>
				</section>
				<section class="nsl-signin-alt__card">
					<?php echo nsl_icon( 'search' ); ?>
					<h3><?php esc_html_e( 'Track an order without signing in', 'north-specs-labs' ); ?></h3>
					<p><?php esc_html_e( 'Have the order number and the billing email? Look the order up directly.', 'north-specs-labs' ); ?></p>
					<a class="nsl-text-link" href="<?php echo esc_url( nsl_page_url( 'track-order', '/track-order/' ) ); ?>"><?php esc_html_e( 'Open order lookup', 'north-specs-labs' ); ?><?php echo nsl_icon( 'arrow' ); ?></a>
				</section>
			</div>
		</div>

		<aside class="nsl-signin-benefits" aria-labelledby="nsl-benefits-title">
			<h2 id="nsl-benefits-title"><?php esc_html_e( 'What an account gives you', 'north-specs-labs' ); ?></h2>
			<ul>
				<?php foreach ( nsl_account_benefits() as $benefit ) : ?>
					<li>
						<span><?php echo nsl_icon( $benefit[0] ); ?></span>
						<div><strong><?php echo esc_html( $benefit[1] ); ?></strong><span><?php echo esc_html( $benefit[2] ); ?></span></div>
					</li>
				<?php endforeach; ?>
			</ul>
			<p class="nsl-signin-benefits__note"><?php esc_html_e( 'Accounts are for controlled laboratory research procurement only. Every order requires 18+, researcher-status and Research Use Only confirmations.', 'north-specs-labs' ); ?></p>
		</aside>
	</div>
</div>

<?php do_action( 'woocommerce_after_customer_login_form' ); ?>
