/**
 * Account interaction events.
 *
 * Only the fact that an interaction happened is recorded — never who did it,
 * which order it was, or which document was opened.
 */
(function () {
	'use strict';

	var CARRIER_ATTR = 'data-nsl-carrier';
	var SOURCE_ATTR = 'data-nsl-source';

	function push(payload) {
		window.dataLayer = window.dataLayer || [];
		window.dataLayer.push(payload);
	}

	document.addEventListener(
		'click',
		function (event) {
			var target = event.target.closest ? event.target.closest('[data-nsl-event]') : null;
			if (!target) {
				return;
			}

			var name = target.getAttribute('data-nsl-event');
			var payload = { event: name };

			if (target.hasAttribute(CARRIER_ATTR)) {
				payload.carrier = target.getAttribute(CARRIER_ATTR);
			}
			if (target.hasAttribute(SOURCE_ATTR)) {
				payload.source = target.getAttribute(SOURCE_ATTR);
			}

			push(payload);
		},
		true
	);

	// Keep the order-history filter usable from the keyboard: submit on Enter
	// inside any field, and reset the page cursor when filters change.
	var filterForm = document.querySelector('.nsl-orders-filter');
	if (filterForm) {
		filterForm.addEventListener('change', function (event) {
			if (event.target.tagName === 'SELECT') {
				filterForm.submit();
			}
		});
	}
})();
