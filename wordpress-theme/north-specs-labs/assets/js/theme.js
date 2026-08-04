(() => {
  'use strict';

  const body = document.body;
  const header = document.querySelector('[data-site-header]');
  const nav = document.querySelector('[data-primary-nav]');
  const menuTrigger = document.querySelector('[data-menu-trigger]');

  const closeMenu = () => {
    if (!menuTrigger || !nav) return;
    menuTrigger.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    body.classList.remove('nsl-menu-open');
  };

  if (menuTrigger && nav) {
    menuTrigger.addEventListener('click', () => {
      const open = menuTrigger.getAttribute('aria-expanded') === 'true';
      menuTrigger.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
      body.classList.toggle('nsl-menu-open', !open);
    });

    nav.querySelectorAll('.menu-item-has-children').forEach((item, index) => {
      const link = item.querySelector(':scope > a');
      const submenu = item.querySelector(':scope > .sub-menu');
      if (!link || !submenu) return;
      submenu.id = submenu.id || `nsl-submenu-${index + 1}`;
      const button = document.createElement('button');
      button.className = 'nsl-submenu-trigger';
      button.type = 'button';
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-controls', submenu.id);
      button.innerHTML = '<span class="screen-reader-text">Toggle submenu</span><svg viewBox="0 0 12 8" aria-hidden="true"><path d="m1 1 5 5 5-5"/></svg>';
      link.after(button);
      button.addEventListener('click', () => {
        const open = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!open));
        item.classList.toggle('is-expanded', !open);
      });
    });

    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  if (header) {
    let ticking = false;
    const updateHeader = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 18);
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
    updateHeader();
  }

  const dialog = document.querySelector('[data-search-dialog]');
  const openSearch = () => {
    if (!dialog) return;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    window.setTimeout(() => dialog.querySelector('input[type="search"]')?.focus(), 40);
  };
  const closeSearch = () => {
    if (!dialog) return;
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  };
  document.querySelectorAll('[data-search-open]').forEach((button) => button.addEventListener('click', openSearch));
  document.querySelectorAll('[data-search-close]').forEach((button) => button.addEventListener('click', closeSearch));
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) closeSearch();
  });

  const faqSearch = document.querySelector('[data-faq-search]');
  if (faqSearch) {
    const items = [...document.querySelectorAll('[data-faq-item]')];
    const groups = [...document.querySelectorAll('[data-faq-group]')];
    const empty = document.querySelector('[data-faq-empty]');
    faqSearch.addEventListener('input', () => {
      const query = faqSearch.value.trim().toLowerCase();
      let matches = 0;
      items.forEach((item) => {
        const match = !query || item.textContent.toLowerCase().includes(query);
        item.hidden = !match;
        if (match) matches += 1;
        if (query && match) item.open = true;
      });
      groups.forEach((group) => {
        group.hidden = !group.querySelector('[data-faq-item]:not([hidden])');
      });
      if (empty) empty.hidden = matches > 0;
    });
  }

  document.addEventListener('click', (event) => {
    const add = event.target.closest('.add_to_cart_button');
    if (!add) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'add_to_cart',
      ecommerce: {
        currency: window.NorthSpecs?.currency || 'CAD',
        items: [{ item_id: String(add.dataset.product_id || ''), quantity: Number(add.dataset.quantity || 1) }],
      },
    });
  });
})();
