/* ══════════════════════════════════════════════════════════════
   UPGRADE 8B — CREATIVE SECTION JS (LIGHTBOX BLACK IMAGE FIX)
   - Preloads each image before showing in lightbox
   - Fade-in via requestAnimationFrame (no black flash)
   - Works on first open, nav arrows, and re-open after close
══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Tab Switcher ── */
  function initTabs() {
    const tabs = document.querySelectorAll('.cs-tab-btn');
    const contents = document.querySelectorAll('.cs-tab-content');

    tabs.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;

        tabs.forEach(t => t.classList.remove('cs-tab-active'));
        btn.classList.add('cs-tab-active');

        contents.forEach(c => {
          c.classList.remove('cs-tab-show');
          if (c.id === 'cs-tab-' + target) {
            c.classList.add('cs-tab-show');
          }
        });
      });
    });
  }

  /* ── Video Modal Functions ── */
  window.fullPlayVid = function (index) {
    const modal       = document.getElementById('csVideoModal');
    const modalVideo  = document.getElementById('csModalVideo');
    const modalSrc    = document.getElementById('csModalVideoSrc');

    if (!modal || !modalVideo) {
      console.warn('Video modal elements not found');
      return;
    }

    const inlineVid = document.getElementById('vcVid' + index);
    let src = '';

    if (inlineVid) {
      const sourceEl = inlineVid.querySelector('source');
      src = sourceEl ? sourceEl.getAttribute('src') : (inlineVid.getAttribute('src') || '');
    }

    if (!src) {
      const card = document.querySelector('[data-cs-index="' + index + '"][data-cs-type="video"]');
      if (card) {
        const sourceEl = card.querySelector('source');
        src = sourceEl ? sourceEl.getAttribute('src') : '';
      }
    }

    if (!src) {
      console.warn('No video source found for index', index);
      return;
    }

    if (modalSrc) {
      modalSrc.setAttribute('src', src);
    } else {
      modalVideo.setAttribute('src', src);
    }

    modalVideo.load();
    modal.classList.add('cs-vid-modal-open');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      modalVideo.play().catch(err => {
        console.log('Autoplay blocked, user can press play:', err);
      });
    }, 100);
  };

  window.closeVidModal = function () {
    const modal      = document.getElementById('csVideoModal');
    const modalVideo = document.getElementById('csModalVideo');
    const modalSrc   = document.getElementById('csModalVideoSrc');

    if (!modal) return;

    modal.classList.remove('cs-vid-modal-open');
    document.body.style.overflow = '';

    if (modalVideo) {
      modalVideo.pause();
      modalVideo.currentTime = 0;
    }
    if (modalSrc) {
      modalSrc.setAttribute('src', '');
    }
    if (modalVideo) {
      modalVideo.load();
    }
  };

  window.playVid = window.fullPlayVid;

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeVidModal();
    }
  });

  /* ══════════════════════════════════════════════════════════════
     LIGHTBOX — BLACK IMAGE FIX
     Root cause: setting lbImg.src directly shows black while the
     new image is still loading. Fix: preload via Image() object,
     only swap src after load is confirmed, then fade in.
  ══════════════════════════════════════════════════════════════ */
  function initLightbox() {
    const lb        = document.getElementById('csLightbox');
    const lbImg     = document.getElementById('csLightboxImg');
    const lbClose   = document.querySelector('.cs-lb-close');
    const lbPrev    = document.querySelector('.cs-lb-prev');
    const lbNext    = document.querySelector('.cs-lb-next');
    const lbOverlay = document.querySelector('.cs-lb-overlay');

    if (!lb || !lbImg) return;

    let graphicCards = [];
    let currentIdx   = 0;
    let isLoading    = false; // prevent double-clicks during load

    /* Add inline transition style to the img element */
    lbImg.style.transition = 'opacity 0.25s ease';
    lbImg.style.opacity    = '1';

    function refreshCards() {
      graphicCards = Array.from(document.querySelectorAll('[data-cs-type="graphic"]'));
    }

    /* ── Core: preload then display ── */
    function loadAndShow(src, openLb) {
      if (!src || isLoading) return;
      isLoading = true;

      // Fade out the current image
      lbImg.style.opacity = '0';

      const preloader = new Image();

      preloader.onload = function () {
        // Image is fully loaded — now swap src
        lbImg.src = preloader.src;

        // If we need to open the lightbox, do it now (image is ready)
        if (openLb) {
          lb.classList.add('cs-lb-open');
          document.body.style.overflow = 'hidden';
        }

        // Fade in using rAF to guarantee paint happens after src swap
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            lbImg.style.opacity = '1';
            isLoading = false;
          });
        });
      };

      preloader.onerror = function () {
        // Fallback: show even if image fails (won't be black, just broken icon)
        lbImg.src = src;
        lbImg.style.opacity = '1';
        if (openLb) {
          lb.classList.add('cs-lb-open');
          document.body.style.overflow = 'hidden';
        }
        isLoading = false;
      };

      preloader.src = src; // trigger load
    }

    /* ── Open lightbox on card click ── */
    document.addEventListener('click', function (e) {
      const card = e.target.closest('[data-cs-type="graphic"]');
      if (!card) return;

      refreshCards();
      currentIdx = graphicCards.indexOf(card);
      const img = card.querySelector('.cs-card-img');
      if (!img || !img.src) return;

      loadAndShow(img.src, true /* open lightbox */);
    });

    /* ── Close lightbox ── */
    function closeLb() {
      lb.classList.remove('cs-lb-open');
      document.body.style.overflow = '';
      // Reset opacity so next open starts clean
      lbImg.style.opacity = '0';
    }

    /* ── Navigate to index ── */
    function showIdx(i) {
      if (!graphicCards.length) return;
      currentIdx = (i + graphicCards.length) % graphicCards.length;
      const img = graphicCards[currentIdx].querySelector('.cs-card-img');
      if (img && img.src) loadAndShow(img.src, false /* lightbox already open */);
    }

    if (lbClose)   lbClose.addEventListener('click', closeLb);
    if (lbOverlay) lbOverlay.addEventListener('click', closeLb);
    if (lbPrev)    lbPrev.addEventListener('click',  () => showIdx(currentIdx - 1));
    if (lbNext)    lbNext.addEventListener('click',  () => showIdx(currentIdx + 1));

    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('cs-lb-open')) return;
      if (e.key === 'ArrowLeft')  showIdx(currentIdx - 1);
      if (e.key === 'ArrowRight') showIdx(currentIdx + 1);
      if (e.key === 'Escape')     closeLb();
    });
  }

  /* ── Init on DOM ready ── */
  function init() {
    initTabs();
    initLightbox();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
