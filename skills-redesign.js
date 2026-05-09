/* ═══════════════════════════════════════════════════════
   SKILLS-REDESIGN.JS — JVOR DEV PORTFOLIO
   Ensures all skills + radar animations trigger properly.
   Add AFTER fixes.js in your HTML.
═══════════════════════════════════════════════════════ */
(function () {
  'use strict';

  function run() {

    /* ── 1. Animate skill progress bars on scroll ── */
    function animateBars() {
      const bars = document.querySelectorAll('.nsk-bar-fill[data-w]');
      const pcts = document.querySelectorAll('.nsk-bar-pct[data-target]');
      if (!bars.length) return;

      const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          bars.forEach(bar => {
            bar.style.width = (bar.dataset.w || 0) + '%';
          });
          pcts.forEach(pct => {
            const target = parseInt(pct.dataset.target);
            let cur = 0;
            const step = () => {
              cur = Math.min(cur + 2, target);
              pct.textContent = cur + '%';
              if (cur < target) requestAnimationFrame(step);
            };
            step();
          });
          obs.disconnect();
        });
      }, { threshold: 0.2 });

      const section = document.querySelector('.nsk-bars-section');
      if (section) obs.observe(section);
    }

    /* ── 2. Animate radar legend bars on scroll ── */
    function animateRadarBars() {
      const fills = document.querySelectorAll('.lv2-fill[data-w]');
      if (!fills.length) return;

      const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          fills.forEach((el, i) => {
            setTimeout(() => {
              el.style.width = (el.dataset.w || 0) + '%';
            }, i * 120);
          });
          obs.disconnect();
        });
      }, { threshold: 0.25 });

      const section = document.querySelector('.radar-section');
      if (section) obs.observe(section);
    }

    /* ── 3. Animate SVG ring fills on scroll ── */
    function animateRings() {
      const rings = document.querySelectorAll('.nsk-ring-fill[data-dash]');
      if (!rings.length) return;

      const CIRC = 2 * Math.PI * 18;

      const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          rings.forEach((ring, i) => {
            setTimeout(() => {
              const dashVal = parseFloat(ring.dataset.dash);
              ring.style.strokeDasharray = `${dashVal} ${CIRC}`;
            }, i * 60);
          });
          obs.disconnect();
        });
      }, { threshold: 0.1 });

      const grid = document.getElementById('nskHexGrid');
      if (grid) obs.observe(grid);
    }

    /* ── 4. Animate counter numbers ── */
    function animateCounters() {
      const nums = document.querySelectorAll('.nsk-count-num[data-count]');
      if (!nums.length) return;

      const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          nums.forEach(el => {
            const target = parseInt(el.dataset.count);
            let cur = 0;
            const duration = 1200;
            const start = performance.now();
            const tick = (now) => {
              const progress = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              cur = Math.round(eased * target);
              el.textContent = cur + (el.dataset.suffix || '');
              if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          });
          obs.disconnect();
        });
      }, { threshold: 0.3 });

      const strip = document.querySelector('.nsk-counter-strip');
      if (strip) obs.observe(strip);
    }

    /* ── 5. Card hover: also highlight radar vertex ── */
    function linkCardsToRadar() {
      document.querySelectorAll('.legend-item-v2').forEach((item, idx) => {
        item.addEventListener('mouseenter', () => {
          item.style.opacity = '1';
        });
        item.addEventListener('mouseleave', () => {
          item.style.opacity = '';
        });
      });
    }

    /* ── 6. ESC key closes any open radar tooltip ── */
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.rms-card').forEach(c => c.blur());
      }
    });

    /* ── Init all ── */
    // Small delay to let fixes.js build the cards first
    setTimeout(() => {
      animateBars();
      animateRadarBars();
      animateRings();
      animateCounters();
      linkCardsToRadar();
      console.log('✅ Skills redesign animations loaded — JVOR DEV');
    }, 300);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

})();
