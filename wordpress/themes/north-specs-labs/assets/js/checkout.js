/**
 * Staged checkout.
 *
 * Partitions the single WooCommerce checkout form into three panels, adds a
 * progress indicator, mirrors the delivery address onto billing, and assists
 * address entry for Canada and the United States.
 *
 * Nothing here changes what is posted: the form still submits once, with the
 * same field names WooCommerce expects.
 */
( function () {
	'use strict';

	var config = window.nslCheckout || {};
	var i18n = config.i18n || {};
	var address = config.address || {};
	var addressText = address.i18n || {};
	var TOTAL = 3;

	var form = document.querySelector( 'form.checkout' );
	if ( ! form ) {
		return;
	}

	var panels = Array.prototype.slice.call( form.querySelectorAll( '[data-nsl-step]' ) );
	if ( panels.length !== TOTAL ) {
		return;
	}

	var current = 1;
	var progress = form.querySelector( '[data-nsl-progress]' );

	function t( key, fallback ) {
		return i18n[ key ] || fallback || '';
	}

	/* ---------------------------------------------------------------- steps */

	function buildProgress() {
		if ( ! progress ) {
			return;
		}

		var list = document.createElement( 'ol' );
		list.className = 'nsl-stepbar';
		list.setAttribute( 'aria-label', t( 'stepOf', 'Checkout progress' ).replace( /%1\$d|%2\$d/g, '' ).trim() || 'Checkout progress' );

		( config.steps || [] ).forEach( function ( step, index ) {
			var item = document.createElement( 'li' );
			item.className = 'nsl-stepbar__item';
			item.dataset.nslStepbar = String( index + 1 );

			var button = document.createElement( 'button' );
			button.type = 'button';
			button.className = 'nsl-stepbar__button';
			button.disabled = true;
			button.innerHTML =
				'<span class="nsl-stepbar__marker" aria-hidden="true">' + ( index + 1 ) + '</span>' +
				'<span class="nsl-stepbar__text"><strong>' + step.title + '</strong><small>' + step.hint + '</small></span>';

			button.addEventListener( 'click', function () {
				if ( index + 1 < current ) {
					go( index + 1 );
				}
			} );

			item.appendChild( button );
			list.appendChild( item );
		} );

		progress.appendChild( list );
		progress.hidden = false;
	}

	function paintProgress() {
		if ( ! progress ) {
			return;
		}

		progress.querySelectorAll( '[data-nsl-stepbar]' ).forEach( function ( item ) {
			var index = parseInt( item.dataset.nslStepbar, 10 );
			var button = item.querySelector( 'button' );

			item.classList.toggle( 'is-current', index === current );
			item.classList.toggle( 'is-done', index < current );
			button.disabled = index >= current;

			if ( index === current ) {
				item.setAttribute( 'aria-current', 'step' );
			} else {
				item.removeAttribute( 'aria-current' );
			}
		} );
	}

	function go( step ) {
		current = Math.min( Math.max( step, 1 ), TOTAL );

		panels.forEach( function ( panel ) {
			var index = parseInt( panel.dataset.nslStep, 10 );
			panel.hidden = index !== current;
		} );

		paintProgress();
		renderSummary();

		var heading = panels[ current - 1 ].querySelector( '.nsl-step__title' );
		if ( heading ) {
			heading.setAttribute( 'tabindex', '-1' );
			heading.focus( { preventScroll: true } );
		}

		var top = form.getBoundingClientRect().top + window.pageYOffset - 24;
		window.scrollTo( { top: top, behavior: 'smooth' } );
	}

	function buildNav() {
		panels.forEach( function ( panel ) {
			var index = parseInt( panel.dataset.nslStep, 10 );
			var nav = panel.querySelector( '[data-nsl-nav]' );
			if ( ! nav ) {
				return;
			}

			if ( index > 1 ) {
				var back = document.createElement( 'button' );
				back.type = 'button';
				back.className = 'nsl-step__back';
				back.textContent = t( 'back', 'Back' );
				back.addEventListener( 'click', function () {
					go( index - 1 );
				} );
				nav.appendChild( back );
			}

			if ( index < TOTAL ) {
				var next = document.createElement( 'button' );
				next.type = 'button';
				next.className = 'nsl-step__continue';
				next.textContent = t( 'continue', 'Continue' );
				next.addEventListener( 'click', function () {
					if ( validate( panel ) ) {
						go( index + 1 );
					}
				} );
				nav.appendChild( next );
			}
		} );
	}

	/* ----------------------------------------------------------- validation */

	function fieldsIn( panel ) {
		return Array.prototype.slice
			.call( panel.querySelectorAll( '.form-row.validate-required' ) )
			.filter( function ( row ) {
				return row.offsetParent !== null;
			} );
	}

	function messageFor( row, text ) {
		var existing = row.querySelector( '.nsl-field-error' );

		if ( ! text ) {
			if ( existing ) {
				existing.remove();
			}
			row.classList.remove( 'nsl-invalid' );
			return;
		}

		row.classList.add( 'nsl-invalid' );

		if ( ! existing ) {
			existing = document.createElement( 'span' );
			existing.className = 'nsl-field-error';
			existing.setAttribute( 'role', 'alert' );
			row.appendChild( existing );
		}

		existing.textContent = text;
	}

	function validate( panel ) {
		var firstBad = null;

		fieldsIn( panel ).forEach( function ( row ) {
			var input = row.querySelector( 'input, select, textarea' );
			if ( ! input || input.type === 'hidden' ) {
				return;
			}

			var value = input.type === 'checkbox' ? input.checked : String( input.value || '' ).trim();
			var problem = '';

			if ( ! value ) {
				problem = t( 'required', 'This field is required.' );
			} else if ( input.type === 'email' && ! /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test( value ) ) {
				problem = t( 'email', 'Enter a valid email address.' );
			}

			messageFor( row, problem );

			if ( problem && ! firstBad ) {
				firstBad = input;
			}
		} );

		if ( firstBad ) {
			firstBad.focus();
			return false;
		}

		return true;
	}

	/* -------------------------------------------------------------- contact */

	function hoistContact() {
		var slot = form.querySelector( '[data-nsl-contact-slot]' );
		if ( ! slot ) {
			return;
		}

		[ 'billing_email_field', 'billing_phone_field' ].forEach( function ( id ) {
			var row = document.getElementById( id );
			if ( row ) {
				slot.appendChild( row );
			}
		} );

		if ( ! slot.children.length ) {
			var wrapper = form.querySelector( '[data-nsl-contact]' );
			if ( wrapper ) {
				wrapper.hidden = true;
			}
		}
	}

	/* -------------------------------------------------------------- billing */

	function billingRows() {
		return ( config.parts || [] )
			.map( function ( part ) {
				return document.getElementById( 'billing_' + part + '_field' );
			} )
			.filter( Boolean );
	}

	function mirrorBilling() {
		( config.parts || [] ).forEach( function ( part ) {
			var from = document.getElementById( 'shipping_' + part );
			var to = document.getElementById( 'billing_' + part );

			if ( ! from || ! to ) {
				return;
			}

			if ( to.value !== from.value ) {
				to.value = from.value;
				// Country and state are select2 controls; tell them to repaint.
				if ( window.jQuery ) {
					window.jQuery( to ).trigger( 'change' );
				}
			}
		} );
	}

	function bindBillingToggle() {
		var toggle = document.getElementById( 'nsl_billing_same' );
		if ( ! toggle ) {
			return;
		}

		function apply() {
			var same = toggle.checked;

			billingRows().forEach( function ( row ) {
				row.hidden = same;
			} );

			if ( same ) {
				mirrorBilling();
			}
		}

		toggle.addEventListener( 'change', apply );

		// Keep the mirror current while the delivery address is being typed.
		( config.parts || [] ).forEach( function ( part ) {
			var source = document.getElementById( 'shipping_' + part );
			if ( ! source ) {
				return;
			}
			[ 'change', 'blur' ].forEach( function ( event ) {
				source.addEventListener( event, function () {
					if ( toggle.checked ) {
						mirrorBilling();
					}
				} );
			} );
		} );

		apply();
	}

	/* -------------------------------------------------------------- summary */

	function valueOf( id ) {
		var element = document.getElementById( id );
		if ( ! element ) {
			return '';
		}
		if ( element.tagName === 'SELECT' ) {
			var option = element.options[ element.selectedIndex ];
			return option ? option.textContent.trim() : '';
		}
		return String( element.value || '' ).trim();
	}

	function renderSummary() {
		var target = form.querySelector( '[data-nsl-summary]' );
		if ( ! target || current !== TOTAL ) {
			if ( target ) {
				target.innerHTML = '';
			}
			return;
		}

		var lines = [
			{
				step: 1,
				label: config.steps && config.steps[ 0 ] ? config.steps[ 0 ].title : 'Delivery',
				text: [
					valueOf( 'billing_email' ),
					[ valueOf( 'shipping_first_name' ), valueOf( 'shipping_last_name' ) ].filter( Boolean ).join( ' ' ),
					valueOf( 'shipping_address_1' ),
					[ valueOf( 'shipping_city' ), valueOf( 'shipping_state' ), valueOf( 'shipping_postcode' ) ].filter( Boolean ).join( ', ' )
				].filter( Boolean ).join( ' · ' )
			},
			{
				step: 2,
				label: config.steps && config.steps[ 1 ] ? config.steps[ 1 ].title : 'Billing',
				text: [
					valueOf( 'billing_research_organization' ),
					valueOf( 'billing_research_role' )
				].filter( Boolean ).join( ' · ' )
			}
		];

		target.innerHTML = lines
			.filter( function ( line ) {
				return line.text;
			} )
			.map( function ( line ) {
				return (
					'<div class="nsl-recap"><div><span class="nsl-recap__label">' +
					line.label +
					'</span><span class="nsl-recap__value"></span></div>' +
					'<button type="button" class="nsl-recap__edit" data-nsl-edit="' +
					line.step +
					'">' +
					t( 'edit', 'Edit' ) +
					'</button></div>'
				);
			} )
			.join( '' );

		// Text is written as textContent so a customer's own address can never
		// be interpreted as markup.
		Array.prototype.forEach.call( target.querySelectorAll( '.nsl-recap__value' ), function ( node, index ) {
			var line = lines.filter( function ( entry ) {
				return entry.text;
			} )[ index ];
			node.textContent = line ? line.text : '';
		} );

		Array.prototype.forEach.call( target.querySelectorAll( '[data-nsl-edit]' ), function ( button ) {
			button.addEventListener( 'click', function () {
				go( parseInt( button.dataset.nslEdit, 10 ) );
			} );
		} );
	}

	/* -------------------------------------------------------- postal assist */

	function normalisePostcode( group ) {
		var country = valueOf( group + '_country' );
		var input = document.getElementById( group + '_postcode' );
		if ( ! input ) {
			return;
		}

		var raw = String( input.value || '' ).toUpperCase().replace( /[\s-]/g, '' );

		if ( country === 'CA' ) {
			if ( /^[A-Z]\d[A-Z]\d[A-Z]\d$/.test( raw ) ) {
				input.value = raw.slice( 0, 3 ) + ' ' + raw.slice( 3 );
			}
			applyRegion( group, ( address.caPostal || {} )[ raw.charAt( 0 ) ] );
		} else if ( country === 'US' ) {
			var prefix = parseInt( raw.slice( 0, 3 ), 10 );
			if ( ! isNaN( prefix ) ) {
				( address.usZip || [] ).some( function ( range ) {
					if ( prefix >= range[ 0 ] && prefix <= range[ 1 ] ) {
						applyRegion( group, range[ 2 ] );
						return true;
					}
					return false;
				} );
			}
		}
	}

	function applyRegion( group, code ) {
		if ( ! code ) {
			return;
		}

		var select = document.getElementById( group + '_state' );
		if ( ! select || select.value === code ) {
			return;
		}

		// Only fill an empty region; never overwrite a deliberate choice.
		if ( select.value ) {
			return;
		}

		select.value = code;

		if ( window.jQuery ) {
			window.jQuery( select ).trigger( 'change' );
		}
	}

	function bindPostal() {
		[ 'shipping', 'billing' ].forEach( function ( group ) {
			var input = document.getElementById( group + '_postcode' );
			if ( ! input ) {
				return;
			}
			input.addEventListener( 'blur', function () {
				normalisePostcode( group );
			} );
		} );
	}

	/* ---------------------------------------------------- address suggest */

	function bindAutocomplete( group ) {
		if ( ! address.provider || ! address.endpoint ) {
			return;
		}

		var anchor = document.getElementById( group + '_address_1_field' );
		var input = document.getElementById( group + '_address_1' );
		if ( ! anchor || ! input ) {
			return;
		}

		var box = document.createElement( 'ul' );
		box.className = 'nsl-suggest';
		box.setAttribute( 'role', 'listbox' );
		box.setAttribute( 'aria-label', addressText.suggestions || 'Address suggestions' );
		box.hidden = true;
		anchor.appendChild( box );

		input.setAttribute( 'autocomplete', 'off' );
		input.setAttribute( 'role', 'combobox' );
		input.setAttribute( 'aria-expanded', 'false' );
		input.setAttribute( 'aria-autocomplete', 'list' );

		var timer = null;
		var lastQuery = '';

		function close() {
			box.hidden = true;
			box.innerHTML = '';
			input.setAttribute( 'aria-expanded', 'false' );
		}

		function choose( id ) {
			fetch( address.endpoint + '/resolve?id=' + encodeURIComponent( id ), {
				headers: { 'X-WP-Nonce': address.nonce }
			} )
				.then( function ( response ) {
					return response.ok ? response.json() : null;
				} )
				.then( function ( data ) {
					if ( ! data ) {
						return;
					}

					[ 'address_1', 'address_2', 'city', 'postcode' ].forEach( function ( part ) {
						var target = document.getElementById( group + '_' + part );
						if ( target && data[ part ] ) {
							target.value = data[ part ];
						}
					} );

					var region = document.getElementById( group + '_state' );
					if ( region && data.state ) {
						region.value = data.state;
						if ( window.jQuery ) {
							window.jQuery( region ).trigger( 'change' );
						}
					}

					close();
					mirrorIfNeeded();

					if ( window.jQuery ) {
						window.jQuery( document.body ).trigger( 'update_checkout' );
					}
				} )
				.catch( close );
		}

		function search( query ) {
			var select = document.getElementById( group + '_country' );
			var country = select ? select.value : 'CA';

			if ( ( address.countries || [] ).indexOf( country ) === -1 ) {
				close();
				return;
			}

			fetch(
				address.endpoint + '/suggest?q=' + encodeURIComponent( query ) + '&country=' + encodeURIComponent( country ),
				{ headers: { 'X-WP-Nonce': address.nonce } }
			)
				.then( function ( response ) {
					return response.ok ? response.json() : null;
				} )
				.then( function ( data ) {
					var items = data && data.suggestions ? data.suggestions : [];

					box.innerHTML = '';

					if ( ! items.length ) {
						close();
						return;
					}

					items.forEach( function ( item ) {
						var option = document.createElement( 'li' );
						option.className = 'nsl-suggest__item';
						option.setAttribute( 'role', 'option' );
						option.tabIndex = 0;
						option.textContent = item.label;
						option.addEventListener( 'mousedown', function ( event ) {
							event.preventDefault();
							choose( item.id );
						} );
						option.addEventListener( 'keydown', function ( event ) {
							if ( event.key === 'Enter' ) {
								event.preventDefault();
								choose( item.id );
							}
						} );
						box.appendChild( option );
					} );

					box.hidden = false;
					input.setAttribute( 'aria-expanded', 'true' );
				} )
				.catch( close );
		}

		input.addEventListener( 'input', function () {
			var query = input.value.trim();

			window.clearTimeout( timer );

			if ( query.length < 4 || query === lastQuery ) {
				close();
				return;
			}

			timer = window.setTimeout( function () {
				lastQuery = query;
				search( query );
			}, 250 );
		} );

		input.addEventListener( 'blur', function () {
			window.setTimeout( close, 150 );
		} );

		input.addEventListener( 'keydown', function ( event ) {
			if ( event.key === 'Escape' ) {
				close();
			}
			if ( event.key === 'ArrowDown' && ! box.hidden ) {
				event.preventDefault();
				var first = box.querySelector( '.nsl-suggest__item' );
				if ( first ) {
					first.focus();
				}
			}
		} );
	}

	function mirrorIfNeeded() {
		var toggle = document.getElementById( 'nsl_billing_same' );
		if ( toggle && toggle.checked ) {
			mirrorBilling();
		}
	}

	/* ----------------------------------------------------------------- boot */

	function boot() {
		form.classList.add( 'nsl-checkout--staged' );
		hoistContact();
		buildProgress();
		buildNav();
		bindBillingToggle();
		bindPostal();
		bindAutocomplete( 'shipping' );
		bindAutocomplete( 'billing' );
		go( 1 );
	}

	boot();

	// If WooCommerce reports validation errors after submit, the customer needs
	// to see them: open the panel holding the first complaint.
	if ( window.jQuery ) {
		window.jQuery( document.body ).on( 'checkout_error', function () {
			var notice = document.querySelector( '.woocommerce-error li[data-id]' );
			var id = notice ? notice.getAttribute( 'data-id' ) : '';
			var row = id ? document.getElementById( id + '_field' ) : null;
			var panel = row ? row.closest( '[data-nsl-step]' ) : null;

			go( panel ? parseInt( panel.dataset.nslStep, 10 ) : 1 );
		} );

		window.jQuery( document.body ).on( 'updated_checkout', function () {
			renderSummary();
		} );
	}
} )();
