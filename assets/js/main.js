/* ================================================
   OAJ ENERGY — JAVASCRIPT
   hello@oajenergy.com.ng
================================================ */

(function () {
  'use strict';

  /* --------------------------------------------------
     CURSOR GLOW
  -------------------------------------------------- */
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow) {
    document.addEventListener('mousemove', e => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top  = e.clientY + 'px';
    });
  }

  /* --------------------------------------------------
     NAVBAR + SCROLL PROGRESS + BACK TO TOP + PARALLAX
  -------------------------------------------------- */
  const navbar      = document.getElementById('navbar');
  const progressBar = document.getElementById('progress-bar');
  const backToTop   = document.getElementById('back-to-top');
  const heroBg      = document.getElementById('heroBg');

  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollMax = document.documentElement.scrollHeight - window.innerHeight;

    // Progress bar
    if (progressBar) progressBar.style.width = (scrollTop / scrollMax * 100) + '%';

    // Navbar
    if (navbar) navbar.classList.toggle('scrolled', scrollTop > 60);

    // Back to top
    if (backToTop) backToTop.classList.toggle('visible', scrollTop > 500);

    // Parallax hero bg
    if (heroBg) heroBg.style.transform = `translateY(${scrollTop * 0.3}px) scale(1.06)`;

    updateActiveLink();
  }, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* --------------------------------------------------
     MOBILE MENU
  -------------------------------------------------- */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu   = document.getElementById('mobileMenu');
  const mobileClose  = document.getElementById('mobileClose');

  function openMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('open');
    if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openMobileMenu);
  if (mobileClose)  mobileClose.addEventListener('click', closeMobileMenu);
  if (mobileMenu)   mobileMenu.querySelectorAll('a').forEach(l => l.addEventListener('click', closeMobileMenu));

  /* --------------------------------------------------
     INTERSECTION OBSERVER — FADE-UP & TIMELINE
  -------------------------------------------------- */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-up, .timeline-item').forEach(el => revealObserver.observe(el));

  /* --------------------------------------------------
     ACTIVE NAV LINK
  -------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');

  function updateActiveLink() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  }

  /* --------------------------------------------------
     COUNTER ANIMATION — Hero Stats
     Triggered once after hero load animations finish
  -------------------------------------------------- */
  function animateCount(el, target, duration, suffix) {
    const startTime = performance.now();
    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      // Ease-out cubic
      const eased   = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // Fire counters after hero animations complete (~1.4s)
  window.addEventListener('load', () => {
    setTimeout(() => {
      const statNums = document.querySelectorAll('.hero-stat-num');
      if (statNums.length >= 4) {
        animateCount(statNums[0], 5,   1100, '+');
        animateCount(statNums[1], 50,  1400, '+');
        animateCount(statNums[2], 4,   800,  '');
        animateCount(statNums[3], 100, 1200, '%');
      }
    }, 1400);
  });

  /* --------------------------------------------------
     COUNTERS FOR OTHER VISIBLE STAT SECTIONS
     (trigger when the element enters viewport)
  -------------------------------------------------- */
  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      if (!isNaN(target)) animateCount(el, target, 1000, suffix);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));

  /* --------------------------------------------------
     MAGNETIC BUTTONS
  -------------------------------------------------- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * 0.15;
      const y = (e.clientY - r.top  - r.height / 2) * 0.25;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  /* --------------------------------------------------
     3D TILT — Service Cards
  -------------------------------------------------- */
  document.querySelectorAll('.comp-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `translateY(-7px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
      card.style.transition = 'transform 0.08s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.33s cubic-bezier(0.25,0.46,0.45,0.94)';
    });
  });

  /* --------------------------------------------------
     STAGGERED SKILL TAGS ON HOVER
  -------------------------------------------------- */
  document.querySelectorAll('.skill-card').forEach(card => {
    const tags = card.querySelectorAll('.skill-tag');
    card.addEventListener('mouseenter', () => {
      tags.forEach((t, i) => { t.style.transitionDelay = (i * 0.045) + 's'; });
    });
    card.addEventListener('mouseleave', () => {
      tags.forEach(t => { t.style.transitionDelay = '0s'; });
    });
  });

  /* --------------------------------------------------
     CONTACT FORM — Formspree submission
     Sign up at https://formspree.io, create a form,
     then replace YOUR_FORM_ID with your actual form ID.
  -------------------------------------------------- */
  const FORMSPREE_URL = 'https://formspree.io/f/xdkozpyz'; // ← replace with your form ID

  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const formError   = document.getElementById('formError');
  const submitBtn   = document.getElementById('contact-submit-btn');

  function setFieldError(id, message) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.borderColor = '#ff6b7a';
    el.style.boxShadow   = '0 0 0 3px rgba(255,107,122,0.15)';
    el.setAttribute('aria-describedby', id + '-err');
    let errEl = document.getElementById(id + '-err');
    if (!errEl) {
      errEl = document.createElement('p');
      errEl.id = id + '-err';
      errEl.style.cssText = 'color:#ff6b7a;font-size:0.76rem;margin-top:4px;';
      el.parentNode.appendChild(errEl);
    }
    errEl.textContent = message;
  }

  function clearFieldErrors() {
    ['contact-name','contact-email','contact-subject','contact-message'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.style.borderColor = '';
      el.style.boxShadow   = '';
      el.removeAttribute('aria-describedby');
      const errEl = document.getElementById(id + '-err');
      if (errEl) errEl.remove();
    });
    if (formError) { formError.style.display = 'none'; formError.textContent = ''; }
  }

  function showFormError(msg) {
    if (!formError) return;
    formError.textContent = msg;
    formError.style.display = 'block';
    formError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async e => {
      e.preventDefault();
      clearFieldErrors();

      const name    = document.getElementById('contact-name')?.value.trim();
      const email   = document.getElementById('contact-email')?.value.trim();
      const subject = document.getElementById('contact-subject')?.value.trim();
      const message = document.getElementById('contact-message')?.value.trim();

      // Validate
      let valid = true;
      if (!name)    { setFieldError('contact-name',    'Name is required.');          valid = false; }
      if (!email)   { setFieldError('contact-email',   'Email is required.');         valid = false; }
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                      setFieldError('contact-email',   'Enter a valid email address.'); valid = false; }
      if (!subject) { setFieldError('contact-subject', 'Please tell us what you need.'); valid = false; }
      if (!message) { setFieldError('contact-message', 'Message cannot be empty.');   valid = false; }
      if (!valid) return;

      // Loading state
      const originalHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="material-icons-round" style="animation:spin 1s linear infinite">hourglass_empty</span> Sending…';
      submitBtn.disabled = true;

      try {
        const res = await fetch(FORMSPREE_URL, {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, subject, message, _replyto: email })
        });

        if (res.ok) {
          // Success
          contactForm.style.display = 'none';
          if (formSuccess) formSuccess.style.display = 'block';
        } else {
          const data = await res.json().catch(() => ({}));
          const msg  = data?.errors?.map(err => err.message).join(', ')
                       || 'Submission failed. Please try again or email us directly.';
          showFormError(msg);
          submitBtn.innerHTML = originalHTML;
          submitBtn.disabled  = false;
        }
      } catch (_) {
        showFormError('Network error — please check your connection and try again.');
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled  = false;
      }
    });

    // Clear field error on input
    ['contact-name','contact-email','contact-subject','contact-message'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', () => {
        const el = document.getElementById(id);
        if (!el) return;
        el.style.borderColor = '';
        el.style.boxShadow   = '';
        const errEl = document.getElementById(id + '-err');
        if (errEl) errEl.remove();
      });
    });
  }

  /* --------------------------------------------------
     FOOTER YEAR
  -------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
