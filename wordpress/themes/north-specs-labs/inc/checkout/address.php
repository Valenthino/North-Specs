<?php
/**
 * Address assistance for Canadian and United States addresses.
 *
 * Two layers, independent of one another:
 *
 * 1. Postal intelligence, always on and needing no third party. A Canadian
 *    postal code is normalised to "A1A 1A1" and its province is derived from
 *    the forward sortation area; a US ZIP resolves to its state.
 * 2. Full autocomplete, active only once a Google Places key is saved. The key
 *    stays on the server: the browser talks to this site, this site talks to
 *    Google, so the key is never exposed and can be restricted by IP.
 *
 * Everything degrades to ordinary manual entry.
 *
 * @package NorthSpecsLabs
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Option holding the Google Places key. Empty means layer 2 is dormant. */
const NSL_ADDRESS_KEY_OPTION = 'nsl_address_provider_key';

/** Countries the assistance covers. */
const NSL_ADDRESS_COUNTRIES = array( 'CA', 'US' );

/**
 * Province by Canadian forward sortation area letter.
 *
 * X covers both Northwest Territories and Nunavut, so it is deliberately absent
 * rather than guessed.
 *
 * @return array<string,string>
 */
function nsl_ca_postal_provinces(): array {
	return array(
		'A' => 'NL',
		'B' => 'NS',
		'C' => 'PE',
		'E' => 'NB',
		'G' => 'QC',
		'H' => 'QC',
		'J' => 'QC',
		'K' => 'ON',
		'L' => 'ON',
		'M' => 'ON',
		'N' => 'ON',
		'P' => 'ON',
		'R' => 'MB',
		'S' => 'SK',
		'T' => 'AB',
		'V' => 'BC',
		'Y' => 'YT',
	);
}

/**
 * State by leading three digits of a US ZIP code, as inclusive ranges.
 *
 * @return array<int,array{0:int,1:int,2:string}>
 */
function nsl_us_zip_states(): array {
	return array(
		array( 5, 5, 'NY' ),
		array( 10, 27, 'MA' ),
		array( 28, 29, 'RI' ),
		array( 30, 38, 'NH' ),
		array( 39, 49, 'ME' ),
		array( 50, 59, 'VT' ),
		array( 60, 69, 'CT' ),
		array( 70, 89, 'NJ' ),
		array( 100, 149, 'NY' ),
		array( 150, 196, 'PA' ),
		array( 197, 199, 'DE' ),
		array( 200, 205, 'DC' ),
		array( 206, 219, 'MD' ),
		array( 220, 246, 'VA' ),
		array( 247, 268, 'WV' ),
		array( 270, 289, 'NC' ),
		array( 290, 299, 'SC' ),
		array( 300, 319, 'GA' ),
		array( 320, 349, 'FL' ),
		array( 350, 369, 'AL' ),
		array( 370, 385, 'TN' ),
		array( 386, 397, 'MS' ),
		array( 398, 399, 'GA' ),
		array( 400, 427, 'KY' ),
		array( 430, 459, 'OH' ),
		array( 460, 479, 'IN' ),
		array( 480, 499, 'MI' ),
		array( 500, 528, 'IA' ),
		array( 530, 549, 'WI' ),
		array( 550, 567, 'MN' ),
		array( 570, 577, 'SD' ),
		array( 580, 588, 'ND' ),
		array( 590, 599, 'MT' ),
		array( 600, 629, 'IL' ),
		array( 630, 658, 'MO' ),
		array( 660, 679, 'KS' ),
		array( 680, 693, 'NE' ),
		array( 700, 714, 'LA' ),
		array( 716, 729, 'AR' ),
		array( 730, 749, 'OK' ),
		array( 750, 799, 'TX' ),
		array( 800, 816, 'CO' ),
		array( 820, 831, 'WY' ),
		array( 832, 838, 'ID' ),
		array( 840, 847, 'UT' ),
		array( 850, 865, 'AZ' ),
		array( 870, 884, 'NM' ),
		array( 889, 898, 'NV' ),
		array( 900, 961, 'CA' ),
		array( 967, 968, 'HI' ),
		array( 970, 979, 'OR' ),
		array( 980, 994, 'WA' ),
		array( 995, 999, 'AK' ),
	);
}

/** Whether the Google Places layer is configured. */
function nsl_address_provider_ready(): bool {
	return '' !== trim( (string) get_option( NSL_ADDRESS_KEY_OPTION, '' ) );
}

/**
 * Expose the postal tables and endpoints to the checkout script.
 */
add_filter(
	'nsl_checkout_script_data',
	function ( array $data ): array {
		$data['address'] = array(
			'endpoint'  => esc_url_raw( rest_url( 'nsl/v1/address' ) ),
			'nonce'     => wp_create_nonce( 'wp_rest' ),
			'provider'  => nsl_address_provider_ready(),
			'countries' => NSL_ADDRESS_COUNTRIES,
			'caPostal'  => nsl_ca_postal_provinces(),
			'usZip'     => nsl_us_zip_states(),
			'i18n'      => array(
				'label'      => __( 'Start typing your address', 'north-specs-labs' ),
				'hint'       => __( 'Choose a suggestion to fill the fields below, or enter the address manually.', 'north-specs-labs' ),
				'manual'     => __( 'Enter address manually', 'north-specs-labs' ),
				'noResults'  => __( 'No matching addresses. Enter the address manually.', 'north-specs-labs' ),
				'searching'  => __( 'Searching…', 'north-specs-labs' ),
				'suggestions'=> __( 'Address suggestions', 'north-specs-labs' ),
			),
		);

		return $data;
	}
);

/** Address lookup endpoints. */
add_action(
	'rest_api_init',
	function (): void {
		register_rest_route(
			'nsl/v1',
			'/address/suggest',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'permission_callback' => 'nsl_address_permission',
				'callback'            => 'nsl_address_suggest',
				'args'                => array(
					'q'       => array(
						'required'          => true,
						'sanitize_callback' => 'sanitize_text_field',
					),
					'country' => array(
						'default'           => 'CA',
						'sanitize_callback' => 'sanitize_text_field',
					),
				),
			)
		);

		register_rest_route(
			'nsl/v1',
			'/address/resolve',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'permission_callback' => 'nsl_address_permission',
				'callback'            => 'nsl_address_resolve',
				'args'                => array(
					'id' => array(
						'required'          => true,
						'sanitize_callback' => 'sanitize_text_field',
					),
				),
			)
		);
	}
);

/**
 * Anyone at checkout may look up an address, but not faster than a person types.
 *
 * @return true|WP_Error
 */
function nsl_address_permission() {
	if ( ! nsl_address_provider_ready() ) {
		return new WP_Error( 'nsl_address_disabled', __( 'Address lookup is not configured.', 'north-specs-labs' ), array( 'status' => 501 ) );
	}

	$bucket = 'nsl_addr_' . md5( (string) ( $_SERVER['REMOTE_ADDR'] ?? '' ) ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
	$hits   = (int) get_transient( $bucket );

	if ( $hits > 60 ) {
		return new WP_Error( 'nsl_address_throttled', __( 'Too many lookups. Please enter the address manually.', 'north-specs-labs' ), array( 'status' => 429 ) );
	}

	set_transient( $bucket, $hits + 1, MINUTE_IN_SECONDS );

	return true;
}

/**
 * Suggest addresses for a partial query.
 *
 * @param WP_REST_Request $request Request.
 * @return WP_REST_Response|WP_Error
 */
function nsl_address_suggest( WP_REST_Request $request ) {
	$query   = trim( (string) $request->get_param( 'q' ) );
	$country = strtoupper( (string) $request->get_param( 'country' ) );

	if ( strlen( $query ) < 3 ) {
		return rest_ensure_response( array( 'suggestions' => array() ) );
	}

	if ( ! in_array( $country, NSL_ADDRESS_COUNTRIES, true ) ) {
		$country = 'CA';
	}

	$cache = 'nsl_addr_s_' . md5( $country . '|' . strtolower( $query ) );
	$hit   = get_transient( $cache );
	if ( is_array( $hit ) ) {
		return rest_ensure_response( array( 'suggestions' => $hit ) );
	}

	$response = wp_remote_post(
		'https://places.googleapis.com/v1/places:autocomplete',
		array(
			'timeout' => 8,
			'headers' => array(
				'Content-Type'     => 'application/json',
				'X-Goog-Api-Key'   => (string) get_option( NSL_ADDRESS_KEY_OPTION, '' ),
				'X-Goog-FieldMask' => 'suggestions.placePrediction.placeId,suggestions.placePrediction.text',
			),
			'body'    => wp_json_encode(
				array(
					'input'                => $query,
					'includedRegionCodes'  => array( strtolower( $country ) ),
					'includedPrimaryTypes' => array( 'street_address', 'premise', 'subpremise' ),
				)
			),
		)
	);

	if ( is_wp_error( $response ) ) {
		return new WP_Error( 'nsl_address_upstream', $response->get_error_message(), array( 'status' => 502 ) );
	}

	$body        = json_decode( (string) wp_remote_retrieve_body( $response ), true );
	$suggestions = array();

	foreach ( (array) ( $body['suggestions'] ?? array() ) as $suggestion ) {
		$prediction = $suggestion['placePrediction'] ?? null;
		if ( ! $prediction || empty( $prediction['placeId'] ) ) {
			continue;
		}
		$suggestions[] = array(
			'id'    => (string) $prediction['placeId'],
			'label' => (string) ( $prediction['text']['text'] ?? '' ),
		);
	}

	set_transient( $cache, $suggestions, HOUR_IN_SECONDS );

	return rest_ensure_response( array( 'suggestions' => $suggestions ) );
}

/**
 * Expand a chosen suggestion into WooCommerce address fields.
 *
 * @param WP_REST_Request $request Request.
 * @return WP_REST_Response|WP_Error
 */
function nsl_address_resolve( WP_REST_Request $request ) {
	$place = (string) $request->get_param( 'id' );
	$cache = 'nsl_addr_r_' . md5( $place );
	$hit   = get_transient( $cache );

	if ( is_array( $hit ) ) {
		return rest_ensure_response( $hit );
	}

	$response = wp_remote_get(
		'https://places.googleapis.com/v1/places/' . rawurlencode( $place ),
		array(
			'timeout' => 8,
			'headers' => array(
				'X-Goog-Api-Key'   => (string) get_option( NSL_ADDRESS_KEY_OPTION, '' ),
				'X-Goog-FieldMask' => 'addressComponents',
			),
		)
	);

	if ( is_wp_error( $response ) ) {
		return new WP_Error( 'nsl_address_upstream', $response->get_error_message(), array( 'status' => 502 ) );
	}

	$body = json_decode( (string) wp_remote_retrieve_body( $response ), true );
	$part = static function ( array $components, string $type, string $form = 'longText' ): string {
		foreach ( $components as $component ) {
			if ( in_array( $type, (array) ( $component['types'] ?? array() ), true ) ) {
				return (string) ( $component[ $form ] ?? '' );
			}
		}
		return '';
	};

	$components = (array) ( $body['addressComponents'] ?? array() );
	$number     = $part( $components, 'street_number' );
	$street     = $part( $components, 'route' );

	$address = array(
		'address_1' => trim( $number . ' ' . $street ),
		'address_2' => $part( $components, 'subpremise' ),
		'city'      => $part( $components, 'locality' ) ?: $part( $components, 'postal_town' ),
		'state'     => $part( $components, 'administrative_area_level_1', 'shortText' ),
		'postcode'  => $part( $components, 'postal_code' ),
		'country'   => $part( $components, 'country', 'shortText' ),
	);

	set_transient( $cache, $address, DAY_IN_SECONDS );

	return rest_ensure_response( $address );
}

/**
 * Somewhere to paste the key: WooCommerce > Settings > Advanced.
 *
 * @param array<int,array<string,mixed>> $settings Settings.
 * @return array<int,array<string,mixed>>
 */
add_filter(
	'woocommerce_get_settings_advanced',
	function ( array $settings, string $section = '' ): array {
		if ( '' !== $section ) {
			return $settings;
		}

		$settings[] = array(
			'title' => __( 'Address autocomplete', 'north-specs-labs' ),
			'type'  => 'title',
			'desc'  => __( 'Canadian postal codes and US ZIP codes already fill the province or state on their own. Add a Google Places API key to also suggest full street addresses as the customer types. The key is stored on the server and never sent to the browser, so it can be restricted to this server\'s IP address.', 'north-specs-labs' ),
			'id'    => 'nsl_address_options',
		);

		$settings[] = array(
			'title'    => __( 'Google Places API key', 'north-specs-labs' ),
			'desc_tip' => __( 'Leave empty to keep manual entry with postal-code assistance only.', 'north-specs-labs' ),
			'id'       => NSL_ADDRESS_KEY_OPTION,
			'type'     => 'password',
			'default'  => '',
		);

		$settings[] = array(
			'type' => 'sectionend',
			'id'   => 'nsl_address_options',
		);

		return $settings;
	},
	10,
	2
);
