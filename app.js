/* Shiloflow AI front-end interactions
 * - cinematic loading screen
 * - scroll-aware navigation
 * - reveal-on-scroll
 * - language preview tabs
 * - early-access form submission to FastAPI backend
 */
(function () {
  'use strict';

  // Production readiness:
  // - The frontend only posts to a relative production endpoint.
  // - On Vercel, POST /api/leads can be implemented with Supabase, HubSpot, Airtable, etc.
  // - If /api/leads is unavailable, we show a safe success state and keep a temporary in-memory
  //   browser-session copy so the site does not fail during demos.
  const LEADS_ENDPOINT = '/api/leads';
  window.__shiloflowLeadSubmissions = window.__shiloflowLeadSubmissions || [];

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

  // Mobile navigation
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navLinks = document.querySelector('.nav-links');
  const closeMobileNav = () => {
    if (!navToggle || !navLinks) return;
    navToggle.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('is-open');
  };
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      navLinks.classList.toggle('is-open', !isOpen);
    });
  }

  // Smooth scrolling for same-page anchors
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      closeMobileNav();
      const headerOffset = (header?.offsetHeight || 78) + 14;
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    });
  });

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
      button.classList.add('is-loading');
      document.querySelectorAll('.tab-row button').forEach((b) => b.classList.remove('active'));
      button.classList.add('active');
      window.setTimeout(() => button.classList.remove('is-loading'), 280);
    });
  });

  // AI typing effect
  const typingTarget = document.querySelector('[data-typing]');
  if (typingTarget) {
    const phrases = [
      'Generating multilingual ministry assets…',
      'Creating subtitles and sermon clips…',
      'Preparing devotionals and social posts…',
      'Scheduling global publishing workflows…',
      'Analyzing audience engagement…'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const tick = () => {
      const phrase = phrases[phraseIndex];
      typingTarget.textContent = phrase.slice(0, charIndex) + (charIndex % 2 ? '|' : '');
      if (!deleting && charIndex < phrase.length) {
        charIndex += 1;
      } else if (!deleting) {
        deleting = true;
        window.setTimeout(tick, 1200);
        return;
      } else if (charIndex > 0) {
        charIndex -= 1;
      } else {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
      window.setTimeout(tick, deleting ? 28 : 48);
    };
    tick();
  }

  // Coming Soon modal for unfinished tools
  const comingSoonModal = document.getElementById('coming-soon-modal');
  const comingSoonTitle = document.getElementById('coming-soon-title');
  const comingSoonCopy = document.getElementById('coming-soon-copy');
  const closeComingSoon = document.querySelector('[data-close-coming-soon]');

  const openComingSoon = (featureName) => {
    if (!comingSoonModal) return;
    const name = featureName || 'This Shiloflow AI tool';
    if (comingSoonTitle) comingSoonTitle.textContent = `${name} is coming soon`;
    if (comingSoonCopy) {
      comingSoonCopy.textContent = `${name} is part of the Shiloflow AI platform roadmap. Join early access for founder previews, private beta access, and rollout updates.`;
    }
    comingSoonModal.classList.add('is-visible');
    comingSoonModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('is-visible');
    modal.setAttribute('aria-hidden', 'true');
    if (!document.querySelector('.success-screen.is-visible')) {
      document.body.classList.remove('modal-open');
    }
  };

  document.querySelectorAll('[data-coming-soon]').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      const featureName = trigger.getAttribute('data-coming-soon');
      trigger.classList.add('is-loading');
      window.setTimeout(() => {
        trigger.classList.remove('is-loading');
        openComingSoon(featureName);
      }, 260);
    });
    trigger.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      trigger.click();
    });
  });

  if (closeComingSoon && comingSoonModal) {
    closeComingSoon.addEventListener('click', () => closeModal(comingSoonModal));
  }

  document.querySelectorAll('.success-screen').forEach((modal) => {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal(modal);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    document.querySelectorAll('.success-screen.is-visible').forEach((modal) => closeModal(modal));
    closeMobileNav();
  });

  // Request form
  const form = document.getElementById('lead-form');
  if (!form) return;

  const success = document.getElementById('form-success');
  const errorEl = document.getElementById('form-error');
  const successScreen = document.getElementById('early-access-confirmation');
  const closeSuccess = document.querySelector('[data-close-success]');

  const showSuccess = () => {
    if (errorEl) errorEl.classList.remove('is-visible');
    if (success) success.classList.add('is-visible');
    form.setAttribute('data-state', 'submitted');
    if (successScreen) {
      successScreen.classList.add('is-visible');
      successScreen.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
    } else {
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (closeSuccess && successScreen) {
    closeSuccess.addEventListener('click', () => {
      successScreen.classList.remove('is-visible');
      successScreen.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  const showError = (message) => {
    if (success) success.classList.remove('is-visible');
    if (!errorEl) return;
    errorEl.textContent = message || 'Please check the highlighted fields and try again.';
    errorEl.classList.add('is-visible');
  };

  const submitLead = async (payload) => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 5500);
    try {
      const response = await fetch(LEADS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      if (!response.ok) throw new Error('Lead endpoint returned ' + response.status);
      return { ok: true, mode: 'api' };
    } finally {
      window.clearTimeout(timeout);
    }
  };

  const storeLeadTemporarily = (payload) => {
    const record = {
      ...payload,
      submittedAt: new Date().toISOString(),
      storageMode: 'temporary-browser-session',
      backendNote: 'Connect /api/leads to Supabase, a CRM, email automation, or another production backend before launch.'
    };
    window.__shiloflowLeadSubmissions.push(record);
    return record;
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
      submitButton.classList.add('is-loading');
      submitButton.textContent = 'Saving request…';
    }

    try {
      await submitLead(data);
      showSuccess();
    } catch (error) {
      console.warn('Lead submission failed:', error);
      storeLeadTemporarily(data);
      showSuccess();
      if (success && !success.querySelector('[data-offline-note]')) {
        const note = document.createElement('div');
        note.dataset.offlineNote = 'true';
        note.style.cssText = 'margin-top: .75rem; color: rgba(247,242,255,.68); font-size: .9rem;';
        note.textContent = 'Temporary mode: no production backend is connected yet. This demo saved an in-memory browser-session copy. Connect /api/leads to Supabase or your CRM before launch.';
        success.appendChild(note);
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.classList.remove('is-loading');
        submitButton.textContent = 'Request Shiloflow AI access';
      }
    }
  });
})();
