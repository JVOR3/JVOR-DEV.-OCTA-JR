/* ═══════════════════════════════════════════════════════════════════
   UPGRADE 1 & 2 — TRANSITIONS.JS v3 — JVOR DEV PORTFOLIO
   1. Theme Ripple — canvas ink bleed from toggle button
   2. Section Nav — clean progress line + directional slide reveal
      (removed: orange frosted lens flash overlay)
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ══════════════════════════════════════════════
     1. THEME RIPPLE — CANVAS RENDERER
  ══════════════════════════════════════════════ */

  const canvas = document.createElement('canvas');
  canvas.id = 'theme-ripple-canvas';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  let rippleAnim = null;

  function fireRipple(originX, originY, colorDark, colorLight, isDark) {
    if (rippleAnim) {
      cancelAnimationFrame(rippleAnim);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    const maxR = Math.hypot(
      Math.max(originX, canvas.width - originX),
      Math.max(originY, canvas.height - originY)
    ) * 1.05;

    const fillColor = isDark ? colorDark : colorLight;
    const DURATION  = 600;
    let   startTime = null;

    function draw(ts) {
      if (!startTime) startTime = ts;
      const elapsed  = ts - startTime;
      const progress = Math.min(elapsed / DURATION, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const r        = eased * maxR;
      const opacity  = progress < 0.7 ? 1 : 1 - ((progress - 0.7) / 0.3);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (opacity > 0) {
        ctx.globalAlpha = opacity;
        ctx.fillStyle = fillColor;
        ctx.beginPath();
        ctx.arc(originX, originY, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      if (progress < 1) {
        rippleAnim = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        rippleAnim = null;
      }
    }

    rippleAnim = requestAnimationFrame(draw);
  }

  function getThemeColors() {
    const isDarkMode = document.body.classList.contains('dark-mode') ||
      document.documentElement.getAttribute('data-theme') === 'dark' ||
      !document.body.classList.contains('light-mode');

    return {
      isDark: isDarkMode,
      dark:  '#0a0a0a',
      light: '#f5f3ef',
    };
  }

  function hookThemeToggle() {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', function () {
      const rect = toggle.getBoundingClientRect();
      const ox   = rect.left + rect.width  / 2;
      const oy   = rect.top  + rect.height / 2;
      const { isDark, dark, light } = getThemeColors();

      fireRipple(ox, oy, dark, light, !isDark);

      toggle.classList.remove('tt-active');
      void toggle.offsetWidth;
      toggle.classList.add('tt-active');

      document.body.classList.add('theme-in-transition');
      setTimeout(() => document.body.classList.remove('theme-in-transition'), 550);

    }, true);
  }

  /* ══════════════════════════════════════════════
     2. SECTION NAV — PROGRESS LINE + SLIDE REVEAL
     Removed: full-screen frosted orange lens overlay
  ══════════════════════════════════════════════ */

  // Only the slim progress line — no orange overlay
  const line = document.createElement('div');
  line.id = 'nav-line';
  document.body.appendChild(line);

  let isBusy = false;
  const NAV_ORDER = [];

  function buildNavOrder() {
    document.querySelectorAll('header .navbar a[href^="#"], header nav a[href^="#"]').forEach(link => {
      const href = link.getAttribute('href');
      if (href && !NAV_ORDER.includes(href)) NAV_ORDER.push(href);
    });
  }

  function runNavTransition(targetHref, linkEl) {
    if (isBusy || !targetHref || !targetHref.startsWith('#')) return;

    const targetEl = document.querySelector(targetHref);
    if (!targetEl) return;

    isBusy = true;

    // Direction
    const currentScroll = window.scrollY;
    const targetScroll  = targetEl.getBoundingClientRect().top + window.scrollY;
    const goingDown     = targetScroll > currentScroll;

    // Run progress line
    line.classList.remove('line-run');
    void line.offsetWidth;
    line.classList.add('line-run');

    // Pulse scroll progress bar
    const bar = document.getElementById('scroll-progress-bar');
    if (bar) {
      bar.classList.remove('progress-pop');
      void bar.offsetWidth;
      bar.classList.add('progress-pop');
    }

    // Active nav underline
    if (linkEl) {
      document.querySelectorAll('header .navbar a, header nav a').forEach(a => a.classList.remove('nav-active-anim'));
      linkEl.classList.add('nav-active-anim');
    }

    // Shorter delay — no lens to wait for (was 280ms, now 80ms for snappy feel)
    setTimeout(() => {
      targetEl.scrollIntoView({ behavior: 'instant', block: 'start' });

      const revealClass = goingDown ? 's-reveal-from-right' : 's-reveal-from-left';
      targetEl.classList.remove('s-reveal-from-right', 's-reveal-from-left');
      void targetEl.offsetWidth;
      targetEl.classList.add(revealClass);

      targetEl.addEventListener('animationend', function onAnim() {
        targetEl.removeEventListener('animationend', onAnim);
        targetEl.classList.remove(revealClass);
      });

      setTimeout(() => { isBusy = false; }, 300);

    }, 80); // snappy — no overlay to wait for
  }

  function hookNavLinks() {
    document.querySelectorAll('header .navbar a[href^="#"], header nav a[href^="#"]').forEach(link => {
      link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        e.preventDefault();

        // Close mobile menu if open
        const navbar   = document.querySelector('.navbar');
        const menuIcon = document.getElementById('menu-icon');
        if (navbar?.classList.contains('active')) {
          navbar.classList.remove('active');
          if (menuIcon) menuIcon.className = 'bx bx-menu';
        }

        runNavTransition(href, this);
      });
    });

    document.querySelectorAll('footer a[href^="#"]').forEach(link => {
      link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        e.preventDefault();
        runNavTransition(href, null);
      });
    });
  }

  /* ── INIT ── */
  function init() {
    hookThemeToggle();
    buildNavOrder();
    hookNavLinks();
    console.log('✅ JVOR Transitions v3: Ripple + Clean nav (no orange flash)');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
