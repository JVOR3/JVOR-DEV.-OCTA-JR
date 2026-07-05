/* ══════════════════════════════════════════════════════════════
   UPGRADE 8 — CREATIVE SECTION JS
   100% working video modal + tab switching
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
    const modalBox    = modal ? modal.querySelector('.cs-vid-modal-box') : null;

    if (!modal || !modalVideo) {
      console.warn('Video modal elements not found');
      return;
    }

    // Try to find the video source
    // 1. Look for inline <video> element by index
    const inlineVid = document.getElementById('vcVid' + index);
    let src = '';

    if (inlineVid) {
      const sourceEl = inlineVid.querySelector('source');
      src = sourceEl ? sourceEl.getAttribute('src') : (inlineVid.getAttribute('src') || '');
    }

    // 2. Fallback: look in the card's data attribute
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

    // Set source
    if (modalSrc) {
      modalSrc.setAttribute('src', src);
    } else {
      modalVideo.setAttribute('src', src);
    }

    // Preload metadata first to detect orientation
    modalVideo.preload = 'auto';
    modalVideo.load();

    // Reset orientation classes
    if (modalBox) {
      modalBox.classList.remove('vid-portrait', 'vid-landscape');
    }

    // Detect orientation after metadata loads
    const onMeta = function () {
      if (modalBox && modalVideo.videoWidth && modalVideo.videoHeight) {
        const isPortrait = modalVideo.videoHeight > modalVideo.videoWidth;
        modalBox.classList.toggle('vid-portrait', isPortrait);
        modalBox.classList.toggle('vid-landscape', !isPortrait);
      }
      modalVideo.removeEventListener('loadedmetadata', onMeta);
    };
    modalVideo.addEventListener('loadedmetadata', onMeta);

    // Open modal
    modal.classList.add('cs-vid-modal-open');
    document.body.style.overflow = 'hidden';

    // Auto-play — use canplay event for smoother start (no lag)
    const onCanPlay = function () {
      modalVideo.play().catch(err => {
        console.log('Autoplay blocked, user can press play:', err);
      });
      modalVideo.removeEventListener('canplay', onCanPlay);
    };
    modalVideo.addEventListener('canplay', onCanPlay);
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
      modalVideo.load(); // reset video
    }
  };

  // Alias
  window.playVid = window.fullPlayVid;

  /* ── Close modal on Escape key ── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeVidModal();
    }
  });

  /* ── Lightbox for graphic design cards ── */
  function initLightbox() {
    const lb       = document.getElementById('csLightbox');
    const lbImg    = document.getElementById('csLightboxImg');
    const lbClose  = document.querySelector('.cs-lb-close');
    const lbPrev   = document.querySelector('.cs-lb-prev');
    const lbNext   = document.querySelector('.cs-lb-next');
    const lbOverlay = document.querySelector('.cs-lb-overlay');

    if (!lb || !lbImg) return;

    let graphicCards = [];
    let currentIdx = 0;

    // Collect graphic cards
    function refreshCards() {
      graphicCards = Array.from(document.querySelectorAll('[data-cs-type="graphic"]'));
    }

    // Open lightbox
    document.addEventListener('click', function (e) {
      const card = e.target.closest('[data-cs-type="graphic"]');
      if (!card) return;

      refreshCards();
      currentIdx = graphicCards.indexOf(card);
      const img = card.querySelector('.cs-card-img');
      if (!img) return;

      lbImg.src = img.src;
      lb.classList.add('cs-lb-open');
      document.body.style.overflow = 'hidden';
    });

    function closeLb() {
      lb.classList.remove('cs-lb-open');
      document.body.style.overflow = '';
    }

    function showIdx(i) {
      if (!graphicCards.length) return;
      currentIdx = (i + graphicCards.length) % graphicCards.length;
      const img = graphicCards[currentIdx].querySelector('.cs-card-img');
      if (img) lbImg.src = img.src;
    }

    if (lbClose)   lbClose.addEventListener('click', closeLb);
    if (lbOverlay) lbOverlay.addEventListener('click', closeLb);
    if (lbPrev)    lbPrev.addEventListener('click', () => showIdx(currentIdx - 1));
    if (lbNext)    lbNext.addEventListener('click', () => showIdx(currentIdx + 1));

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
