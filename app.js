/* Shiloflow AI front-end interactions
 * - cinematic loading screen
 * - scroll-aware navigation
 * - reveal-on-scroll
 * - language preview tabs
 * - early-access form submission to FastAPI backend
 */
(function () {
  'use strict';

  const API = 'port/8000'.startsWith('__') ? 'http://localhost:8000' : 'port/8000';

  // Loading screen
  window.addEventListener('load', () => {
    const loader = document.querySelector('[data-loader]');
    if (!loader) return;
    window.setTimeout(() => loader.classList.add('is-hidden'), 420);
  });

  // Scroll-aware header
  const header = document.getElementById('site-header');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -10% 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // Year stamp
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Language tabs
  document.querySelectorAll('.tab-row button').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.tab-row button').forEach((b) => b.classList.remove('active'));
      button.classList.add('active');
    });
  });

  // Request form
  const form = document.getElementById('lead-form');
  if (!form) return;

  const success = document.getElementById('form-success');
  const errorEl = document.getElementById('form-error');

  const showSuccess = () => {
    if (errorEl) errorEl.classList.remove('is-visible');
    if (success) success.classList.add('is-visible');
    form.setAttribute('data-state', 'submitted');
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const showError = (message) => {
    if (success) success.classList.remove('is-visible');
    if (!errorEl) return;
    errorEl.textContent = message || 'Please check the highlighted fields and try again.';
    errorEl.classList.add('is-visible');
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    if (!data.name || !data.email || !data.church || !data.role || !data.volume || !data.bottleneck) {
      showError('Please complete the required fields before requesting access.');
      return;
    }

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(data.email))) {
      showError('That email address looks off. Please double-check it and try again.');
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Saving request…';
    }

    try {
      const response = await fetch(API + '/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Lead endpoint returned ' + response.status);
      showSuccess();
    } catch (error) {
      console.warn('Lead submission failed:', error);
      showSuccess();
      if (success && !success.querySelector('[data-offline-note]')) {
        const note = document.createElement('div');
        note.dataset.offlineNote = 'true';
        note.style.cssText = 'margin-top: .75rem; color: rgba(247,242,255,.68); font-size: .9rem;';
        note.textContent = 'Note: the live backend was unavailable, so the page displayed a local confirmation. Please follow up directly if you do not hear back.';
        success.appendChild(note);
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Request Shiloflow AI access';
      }
    }
  });
})();
