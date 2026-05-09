/* ═══════════════════════════════════════════════════════════════════
   UPGRADE 3 — PWA.JS — JVOR DEV PORTFOLIO
   "Add to Home Screen" banner + iOS Safari tip
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  let deferredPrompt = null;

  // ─── Create install banner ───
  function createBanner() {
    const banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.innerHTML = `
      <div class="pwa-icon">
        <img src="imgae/01.jpg" alt="JVOR DEV" onerror="this.style.display='none'">
      </div>
      <div class="pwa-text">
        <strong>Install JVOR DEV</strong>
        <span>Add to Home Screen para may instant access.</span>
      </div>
      <button class="pwa-install-btn" id="pwa-install-btn">Install</button>
      <button class="pwa-dismiss-btn" id="pwa-dismiss-btn" aria-label="Dismiss">✕</button>
    `;
    document.body.appendChild(banner);

    document.getElementById('pwa-install-btn').addEventListener('click', () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(choice => {
        if (choice.outcome === 'accepted') {
          hideBanner();
          console.log('✅ PWA installed');
        }
        deferredPrompt = null;
      });
    });

    document.getElementById('pwa-dismiss-btn').addEventListener('click', () => {
      hideBanner();
      // Don't show again for 7 days
      localStorage.setItem('pwa-dismissed', Date.now() + 7 * 24 * 60 * 60 * 1000);
    });

    return banner;
  }

  function showBanner(banner) {
    setTimeout(() => banner.classList.add('pwa-show'), 3000);
  }

  function hideBanner() {
    const banner = document.getElementById('pwa-install-banner');
    if (banner) {
      banner.classList.remove('pwa-show');
      setTimeout(() => banner.remove(), 600);
    }
  }

  // ─── iOS Safari special handling ───
  function isIOS() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  }

  function isInStandaloneMode() {
    return window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
  }

  function showIOSTip() {
    if (localStorage.getItem('pwa-dismissed')) return;
    const tip = document.createElement('div');
    tip.id = 'pwa-ios-tip';
    tip.innerHTML = `
      📲 I-install ang <strong>JVOR DEV</strong>:<br>
      I-tap ang <strong>Share</strong> button, tapos <strong>"Add to Home Screen"</strong>
    `;
    document.body.appendChild(tip);
    setTimeout(() => tip.classList.add('pwa-show'), 3500);
    setTimeout(() => {
      tip.classList.remove('pwa-show');
      setTimeout(() => tip.remove(), 600);
    }, 9000);
  }

  // ─── Main logic ───
  function init() {
    // Already installed as PWA? Skip
    if (isInStandaloneMode()) return;

    // Dismissed recently?
    const dismissed = localStorage.getItem('pwa-dismissed');
    if (dismissed && Date.now() < parseInt(dismissed)) return;

    // iOS Safari: show tip
    if (isIOS()) {
      showIOSTip();
      return;
    }

    // Android/Chrome: listen for install event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      const banner = createBanner();
      showBanner(banner);
    });

    // App installed
    window.addEventListener('appinstalled', () => {
      hideBanner();
      deferredPrompt = null;
      console.log('✅ PWA app installed successfully');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
