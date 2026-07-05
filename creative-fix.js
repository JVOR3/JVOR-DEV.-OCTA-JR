/* ══════════════════════════════════════════════════════════════
   CREATIVE SECTION FIX
   1. Lightbox — no more black image when opening (image preloads first)
   2. Video Modal — plays with sound on user click
══════════════════════════════════════════════════════════════ */
(function () {

  /* ─── 1. LIGHTBOX FIX ──────────────────────────────────────
     Problem: clicking "View Full" showed a black/dark screen
     because the old openLightbox() set img.src and showed the
     lightbox at the same time — before the image finished loading.
     Fix: preload the image first, THEN show the lightbox.
  ─────────────────────────────────────────────────────────── */
  function patchLightbox() {
    const lightbox = document.getElementById('csLightbox');
    const lbImg    = document.getElementById('csLightboxImg');
    if (!lightbox || !lbImg) return;

    let csImages    = [];
    let csCurrentIdx = 0;

    function buildImageList() {
      csImages = [];
      const activeTab = document.querySelector('.cs-tab-content.cs-tab-show');
      if (!activeTab) return;
      activeTab.querySelectorAll('.cs-card:not(.cs-card-add):not(.cs-card-video)').forEach(card => {
        const img = card.querySelector('.cs-card-img');
        if (img) csImages.push({ src: img.getAttribute('src'), alt: img.alt });
      });
    }

    function showImage(idx) {
      if (!csImages[idx]) return;
      csCurrentIdx = idx;

      // Show loading state
      lbImg.style.opacity = '0';

      const tmp = new Image();
      tmp.onload = function () {
        lbImg.src     = csImages[idx].src;
        lbImg.alt     = csImages[idx].alt;
        // Fade in once loaded
        requestAnimationFrame(() => {
          lbImg.style.transition = 'opacity 0.25s ease';
          lbImg.style.opacity    = '1';
        });
      };
      tmp.onerror = function () {
        // Still show even on error so the lightbox isn't stuck
        lbImg.src   = csImages[idx].src;
        lbImg.style.opacity = '1';
      };
      tmp.src = csImages[idx].src;
    }

    function openLightbox(idx) {
      if (csImages.length === 0) return;
      // Show the lightbox immediately (dark bg shows, image fades in)
      lightbox.classList.add('cs-lb-open');
      document.body.style.overflow = 'hidden';
      showImage(idx);
    }

    function closeLightbox() {
      lightbox.classList.remove('cs-lb-open');
      document.body.style.overflow = '';
      lbImg.style.opacity = '0';
      lbImg.src = '';
    }

    function navigate(dir) {
      const next = (csCurrentIdx + dir + csImages.length) % csImages.length;
      showImage(next);
    }

    // Override clicks on graphic cards
    document.addEventListener('click', function (e) {
      // Skip video cards and controls
      if (e.target.closest('.cs-card-video'))  return;
      if (e.target.closest('.cs-vid-fullbtn')) return;
      if (e.target.closest('.cs-card-add'))    return;
      if (e.target.closest('#csVideoModal'))   return;
      if (e.target.closest('#csLightbox'))     return;

      const card = e.target.closest('.cs-card');
      if (!card) return;
      if (card.classList.contains('cs-card-add'))   return;
      if (card.classList.contains('cs-card-video')) return;

      buildImageList();
      if (csImages.length === 0) return;

      const allCards  = Array.from(
        document.querySelectorAll('#cs-tab-graphic .cs-card:not(.cs-card-add)')
      );
      const clickedPos = allCards.indexOf(card);
      const safeIdx    = clickedPos >= 0 ? Math.min(clickedPos, csImages.length - 1) : 0;
      openLightbox(safeIdx);
    }, true); // capture phase to override the old handler

    // Wire up close / nav buttons (re-wire to be safe)
    const lbOverlay = lightbox.querySelector('.cs-lb-overlay');
    const lbClose   = lightbox.querySelector('.cs-lb-close');
    const lbPrev    = lightbox.querySelector('.cs-lb-prev');
    const lbNext    = lightbox.querySelector('.cs-lb-next');

    if (lbOverlay) lbOverlay.addEventListener('click', closeLightbox);
    if (lbClose)   lbClose.addEventListener('click', closeLightbox);
    if (lbPrev)    lbPrev.addEventListener('click', () => navigate(-1));
    if (lbNext)    lbNext.addEventListener('click', () => navigate(1));

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('cs-lb-open')) return;
      if (e.key === 'Escape')     closeLightbox();
      if (e.key === 'ArrowLeft')  navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });
  }


  /* ─── 2. VIDEO MODAL FIX ────────────────────────────────────
     Problem: video didn't play with sound — autoplay is blocked
     by browsers unless triggered directly by a user gesture AND
     the video is not muted.
     Fix: replace fullPlayVid() with a version that:
       - properly sets src via load()
       - removes muted attribute so sound works
       - plays() directly in the same user-gesture call stack
  ─────────────────────────────────────────────────────────── */
  window.fullPlayVid = function (i) {
    const modal    = document.getElementById('csVideoModal');
    const modalVid = document.getElementById('csModalVideo');
    const modalSrc = document.getElementById('csModalVideoSrc');
    if (!modal || !modalVid || !modalSrc) return;

    const inlineVid = document.getElementById('vcVid' + i);
    const sourceEl  = inlineVid ? inlineVid.querySelector('source') : null;
    const rawSrc    = sourceEl ? sourceEl.getAttribute('src') : '';
    if (!rawSrc) {
      console.warn('fullPlayVid: no src found for video index', i);
      return;
    }

    // Set source
    modalSrc.setAttribute('src', rawSrc);

    // Ensure sound is ON (remove muted if it was set)
    modalVid.muted  = false;
    modalVid.volume = 1.0;

    // Reload the video element with the new source
    modalVid.load();

    // Show modal
    modal.classList.add('cs-vid-modal-open');
    document.body.style.overflow = 'hidden';

    // Play — this is directly inside a user click handler so browsers allow it with sound
    const playPromise = modalVid.play();
    if (playPromise !== undefined) {
      playPromise.catch(function (err) {
        // Autoplay blocked (e.g. strict browser policy) — video is loaded, user can press play
        console.warn('Video autoplay blocked:', err.message);
      });
    }
  };

  // Also patch the close function to fully reset
  window.closeVidModal = function () {
    const modal    = document.getElementById('csVideoModal');
    const modalVid = document.getElementById('csModalVideo');
    if (!modal) return;
    if (modalVid) {
      modalVid.pause();
      modalVid.currentTime = 0;
    }
    modal.classList.remove('cs-vid-modal-open');
    document.body.style.overflow = '';
  };

  // Keep legacy alias
  window.playVid = window.fullPlayVid;


  /* ─── INIT ─────────────────────────────────────────────── */
  function init() {
    patchLightbox();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

/* ─── 3. INJECT VIDEO CARD DESIGN FIX CSS ──────────────────── */
(function injectVideoCardCSS() {
  const style = document.createElement('style');
  style.id = 'video-card-design-fix';
  style.textContent = `

/* ══ VIDEO GRID — compact, 3-col ══════════════════════════════ */
.cs-grid-video {
  grid-template-columns: repeat(3, 1fr) !important;
  gap: 1.4rem !important;
}

@media (max-width: 900px) {
  .cs-grid-video { grid-template-columns: repeat(2, 1fr) !important; }
}
@media (max-width: 580px) {
  .cs-grid-video { grid-template-columns: 1fr !important; }
}

/* ══ VIDEO CARD ══════════════════════════════════════════════ */
.cs-card-video {
  background: rgba(255,255,255,0.03) !important;
  border: 1px solid rgba(234,88,12,0.18) !important;
  border-radius: 14px !important;
  overflow: hidden !important;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease !important;
  cursor: default !important;
}
.cs-card-video:hover {
  transform: translateY(-6px) !important;
  border-color: rgba(234,88,12,0.5) !important;
  box-shadow: 0 14px 36px rgba(234,88,12,0.18) !important;
}

/* ══ VIDEO THUMBNAIL AREA — fixed height, not full-screen ════ */
.cs-video-wrap {
  position: relative !important;
  width: 100% !important;
  height: 200px !important;   /* fixed compact height */
  aspect-ratio: unset !important;
  min-height: unset !important;
  overflow: hidden !important;
  border-radius: 0 !important;
}

/* ══ THUMBNAIL BG — dark gradient with film-strip vibe ════════ */
.cs-vid-thumb {
  position: absolute !important;
  inset: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  background: linear-gradient(145deg, #0c0c1e 0%, #1a0a28 40%, #0a0a16 100%) !important;
  z-index: 2 !important;
}

/* Scanline / film overlay */
.cs-vid-thumb::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 3px,
    rgba(255,255,255,0.012) 3px,
    rgba(255,255,255,0.012) 4px
  );
  pointer-events: none;
  z-index: 1;
}

/* Corner accent lines */
.cs-vid-thumb::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(135deg, rgba(234,88,12,0.18) 0%, transparent 40%),
    linear-gradient(315deg, rgba(223,137,8,0.12) 0%, transparent 40%);
  pointer-events: none;
  z-index: 1;
}

.cs-vid-thumb-bg {
  position: absolute !important;
  inset: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  overflow: hidden !important;
}

.cs-vid-film-icon {
  font-size: 6rem !important;
  color: rgba(255,255,255,0.035) !important;
  transform: rotate(-8deg);
}

/* ══ PLAY BUTTON ════════════════════════════════════════════ */
.cs-vid-play-overlay {
  position: relative !important;
  z-index: 4 !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  gap: 0.65rem !important;
  cursor: pointer !important;
  padding: 0.8rem 1.2rem !important;
  border-radius: 14px !important;
  transition: background 0.2s !important;
}
.cs-vid-play-overlay:hover {
  background: rgba(255,255,255,0.03) !important;
}

.cs-vid-play-ring {
  width: 58px !important;
  height: 58px !important;
  border-radius: 50% !important;
  background: linear-gradient(135deg, #DF8908, #FF1D15) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  box-shadow:
    0 0 0 8px rgba(223,137,8,0.15),
    0 6px 22px rgba(255,29,21,0.45) !important;
  transition: transform 0.3s cubic-bezier(0.34,1.56,.64,1), box-shadow 0.3s !important;
  animation: csVidPulse2 2.8s ease-in-out infinite !important;
}
.cs-vid-play-ring i {
  font-size: 1.7rem !important;
  color: #fff !important;
  margin-left: 3px !important;
}
.cs-vid-play-overlay:hover .cs-vid-play-ring {
  transform: scale(1.12) !important;
  box-shadow:
    0 0 0 14px rgba(223,137,8,0.1),
    0 10px 30px rgba(255,29,21,0.6) !important;
  animation: none !important;
}

@keyframes csVidPulse2 {
  0%,100% { box-shadow: 0 0 0 8px rgba(223,137,8,0.15), 0 6px 22px rgba(255,29,21,0.45); }
  50%      { box-shadow: 0 0 0 16px rgba(223,137,8,0.06), 0 6px 22px rgba(255,29,21,0.45); }
}

.cs-vid-play-label {
  font-size: 0.7rem !important;
  font-weight: 700 !important;
  color: rgba(255,255,255,0.6) !important;
  letter-spacing: 2.5px !important;
  text-transform: uppercase !important;
}

/* Duration badge top-right */
.cs-video-wrap .cs-card-badge {
  position: absolute !important;
  top: 10px !important;
  left: 10px !important;
  z-index: 5 !important;
}

/* ══ CARD BODY — compact ════════════════════════════════════ */
.cs-card-video .cs-card-body {
  padding: 1rem 1.1rem 1.1rem !important;
}

.cs-card-video .cs-card-title {
  font-size: 0.92rem !important;
  font-weight: 700 !important;
  color: #fff !important;
  margin-bottom: 0.35rem !important;
}

.cs-card-video .cs-card-desc {
  font-size: 0.78rem !important;
  color: rgba(255,255,255,0.5) !important;
  line-height: 1.5 !important;
  margin-bottom: 0.7rem !important;
  display: -webkit-box !important;
  -webkit-line-clamp: 2 !important;
  -webkit-box-orient: vertical !important;
  overflow: hidden !important;
}

/* ══ COMING SOON CARDS — same compact height ════════════════ */
.cs-coming-wrap {
  height: 200px !important;
  background: linear-gradient(145deg, #0a0a14, #12081a) !important;
  border: none !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.cs-coming-inner {
  padding: 1.2rem !important;
  gap: 0.5rem !important;
}

.cs-coming-icon-ring {
  width: 48px !important;
  height: 48px !important;
}
.cs-coming-icon-ring i {
  font-size: 1.3rem !important;
}

  `;
  document.head.appendChild(style);
})();
