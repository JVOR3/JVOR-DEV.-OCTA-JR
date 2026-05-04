/* ═══════════════════════════════════════════════════
   PORTFOLIO ENHANCEMENTS — Full Fix & Smooth
   JVOR DEV. v3.1
═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Universal IntersectionObserver helper ──
  function observe(selector, visibleClass = 'e-visible', options = {}) {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;
    const defaults = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add(visibleClass), i * 80);
          obs.unobserve(entry.target);
        }
      });
    }, { ...defaults, ...options });
    els.forEach(el => obs.observe(el));
  }

  // ── Staggered observe (each item with delay offset) ──
  function observeStagger(selector, visibleClass = 'e-visible', baseDelay = 80, options = {}) {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;
    const defaults = { threshold: 0.1, rootMargin: '0px 0px -30px 0px' };
    const obs = new IntersectionObserver((entries) => {
      let i = 0;
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = Array.from(els).indexOf(entry.target);
          setTimeout(() => entry.target.classList.add(visibleClass), idx * baseDelay);
          obs.unobserve(entry.target);
          i++;
        }
      });
    }, { ...defaults, ...options });
    els.forEach(el => obs.observe(el));
  }

  // ── Animated bar fill ──
  function animateBars(fillSelector, widthAttr = 'data-w') {
    const fills = document.querySelectorAll(fillSelector);
    if (!fills.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target.getAttribute(widthAttr) || entry.target.dataset.width || '0';
          entry.target.style.setProperty('--target-w', target + '%');
          // Trigger the CSS transition by setting width
          setTimeout(() => { entry.target.style.width = target + '%'; }, 100);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    fills.forEach(f => obs.observe(f));
  }

  // ═══════════════════
  //  INIT ALL SECTIONS
  // ═══════════════════

  document.addEventListener('DOMContentLoaded', () => {

    // ── Assign reveal classes to elements ──
    const addReveal = (selector, cls) => {
      document.querySelectorAll(selector).forEach(el => {
        if (!el.classList.contains(cls)) el.classList.add(cls);
      });
    };

    addReveal('.section-heading', 'e-reveal');
    addReveal('.about-identity-block', 'e-reveal');
    addReveal('.wid-card', 'e-reveal');
    addReveal('.atl-card', 'e-reveal');
    addReveal('.ts-card', 'e-reveal');
    addReveal('.ts-soft-item', 'e-reveal');
    addReveal('.ts-tag', 'e-reveal');
    addReveal('.srv-card', 'e-reveal');
    addReveal('.srv-step', 'e-reveal');
    addReveal('.project-card', 'e-reveal');
    addReveal('.tr-card', 'e-reveal');
    addReveal('.tr-form-section', 'e-reveal');
    addReveal('.premium-card', 'e-reveal');
    addReveal('.cs-card', 'e-reveal');
    addReveal('.radar-section', 'e-reveal');
    addReveal('.ft-cta-banner', 'e-reveal');
    addReveal('.gallery-section-header', 'e-reveal');
    addReveal('.ct-left-panel', 'e-reveal-left');
    addReveal('.ct-right-panel', 'e-reveal-right');

    // Stagger delays
    document.querySelectorAll('.wid-card').forEach((el, i) => {
      el.style.transitionDelay = (i * 0.1) + 's';
    });
    document.querySelectorAll('.ts-card').forEach((el, i) => {
      el.style.transitionDelay = (i * 0.06) + 's';
    });
    document.querySelectorAll('.srv-card').forEach((el, i) => {
      el.style.transitionDelay = (i * 0.08) + 's';
    });
    document.querySelectorAll('.project-card').forEach((el, i) => {
      el.style.transitionDelay = (i * 0.1) + 's';
    });
    document.querySelectorAll('.tr-card').forEach((el, i) => {
      el.style.transitionDelay = (i * 0.07) + 's';
    });
    document.querySelectorAll('.premium-card').forEach((el, i) => {
      el.style.transitionDelay = (i * 0.08) + 's';
    });
    document.querySelectorAll('.ts-soft-item').forEach((el, i) => {
      el.style.transitionDelay = (i * 0.06) + 's';
    });
    document.querySelectorAll('.ts-tag').forEach((el, i) => {
      el.style.transitionDelay = (i * 0.05) + 's';
    });
    document.querySelectorAll('.srv-step').forEach((el, i) => {
      el.style.transitionDelay = (i * 0.1) + 's';
    });
    document.querySelectorAll('.cs-card').forEach((el, i) => {
      el.style.transitionDelay = (i * 0.1) + 's';
    });
    document.querySelectorAll('.atl-card').forEach((el, i) => {
      el.style.transitionDelay = (i * 0.12) + 's';
    });

    // ── Activate reveal observers ──
    observe('.e-reveal', 'e-visible', { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    observe('.e-reveal-left', 'e-visible', { threshold: 0.1 });
    observe('.e-reveal-right', 'e-visible', { threshold: 0.1 });
    observe('.e-reveal-scale', 'e-visible', { threshold: 0.1 });

    // ── Animate all bars ──
    animateBars('.ts-meter-fill', 'data-w');
    animateBars('.ts-prof-fill', 'data-w');
    animateBars('.lv2-fill', 'data-w');
    animateBars('.tr-bar-f', 'data-w');
    animateBars('.asp-bar-fill', 'data-width');

    // ── Animate tech card meters on card visibility ──
    const tsCardObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target.querySelector('.ts-meter-fill');
          if (fill) {
            const w = fill.dataset.w || '0';
            setTimeout(() => { fill.style.width = w + '%'; }, 200);
          }
          tsCardObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    document.querySelectorAll('.ts-card').forEach(c => tsCardObs.observe(c));

    // ── Scroll Progress Bar ──
    const progressBar = document.getElementById('scroll-progress-bar');
    if (progressBar) {
      window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
      }, { passive: true });
    }

    // ── Floating Hire Me Button ──
    const floatingHire = document.getElementById('floating-hire');
    if (floatingHire) {
      window.addEventListener('scroll', () => {
        floatingHire.classList.toggle('show', window.scrollY > 500);
      }, { passive: true });
    }

    // ── Header Scroll Effect ──
    const header = document.querySelector('.header');
    if (header) {
      window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 60);
      }, { passive: true });
    }

    // ── Active Nav Scrollspy ──
    const navLinks = document.querySelectorAll('.navbar a[href^="#"]');
    const sections = document.querySelectorAll('section[id]');
    if (sections.length && navLinks.length) {
      const setActive = () => {
        let current = '';
        sections.forEach(sec => {
          if (sec.getBoundingClientRect().top <= 150) current = sec.id;
        });
        navLinks.forEach(a => {
          a.classList.toggle('active-nav', a.getAttribute('href') === '#' + current);
        });
      };
      window.addEventListener('scroll', setActive, { passive: true });
      setTimeout(setActive, 300);
    }

    // ── Footer Scroll-to-top ──
    const ftScrollTop = document.getElementById('ftScrollTop');
    if (ftScrollTop) {
      ftScrollTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // ── Contact Quick Select Buttons ──
    const qsBtns = document.querySelectorAll('.ct-qs-btn');
    const subjectInput = document.getElementById('cf-subject');
    qsBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        qsBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (subjectInput) {
          subjectInput.value = btn.dataset.subject || '';
          subjectInput.dispatchEvent(new Event('input'));
          // Clear error on subject if any
          subjectInput.closest('.ct-form-group')?.classList.remove('has-error');
          document.getElementById('err-subject')?.classList.remove('visible');
        }
      });
    });

    // ── Contact Char Counter ──
    const msgArea = document.getElementById('cf-message');
    const charCount = document.getElementById('ctCharCount');
    if (msgArea && charCount) {
      msgArea.addEventListener('input', () => {
        const len = msgArea.value.length;
        charCount.textContent = len;
        charCount.style.color = len > 900 ? '#ef4444' : len > 700 ? '#f59e0b' : '';
        if (len > 1000) msgArea.value = msgArea.value.slice(0, 1000);
      });
    }

    // ── Contact Copy Email Buttons ──
    document.querySelectorAll('.ct-copy-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const text = btn.dataset.copy || 'octajose1032003@gmail.com';
        try { await navigator.clipboard.writeText(text); } catch (_) { }
        const icon = btn.querySelector('i');
        if (icon) {
          const orig = icon.className;
          icon.className = 'bx bx-check';
          btn.style.color = '#4ade80';
          setTimeout(() => { icon.className = orig; btn.style.color = ''; }, 2000);
        }
      });
    });

    // ── Toast close buttons ──
    document.getElementById('ctToastClose')?.addEventListener('click', () => {
      document.getElementById('ct-success-toast')?.classList.remove('show');
    });
    document.getElementById('ctErrToastClose')?.addEventListener('click', () => {
      document.getElementById('ct-error-toast')?.classList.remove('show');
    });

    // ── Live PHT Clocks ──
    function updateAllClocks() {
      const now = new Date();
      const pht = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Manila' }));
      const h = String(pht.getHours()).padStart(2, '0');
      const m = String(pht.getMinutes()).padStart(2, '0');
      const s = String(pht.getSeconds()).padStart(2, '0');
      const timeStr = `${h}:${m}:${s}`;
      // Contact section clock
      const ctClock = document.getElementById('ctClockText');
      if (ctClock) ctClock.textContent = timeStr;
      // Map clock
      const mapClock = document.getElementById('advMapClock');
      if (mapClock) mapClock.textContent = timeStr + ' PHT';
      // HUD clock
      const hudClock = document.getElementById('advHudClock');
      if (hudClock) hudClock.textContent = timeStr;
    }
    updateAllClocks();
    setInterval(updateAllClocks, 1000);

    // ── Map Street/Satellite toggle ──
    const mapIframe = document.getElementById('advMapIframe');
    const streetBtn = document.getElementById('advMapStreet');
    const satBtn = document.getElementById('advMapSat');
    const STREET_URL = "https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d591.5354937899773!2d122.4751619!3d14.2895336!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTTCsDE3JzIzLjEiTiAxMjLCsDI4JzMxLjkiRQ!5e1!3m2!1sen!2sph!4v1773758842321!5m2!1sen!2sph";
    const SAT_URL = "https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d591.5354937899773!2d122.4751619!3d14.2895336!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTTCsDE3JzIzLjEiTiAxMjLCsDI4JzMxLjkiRQ!5e1!3m2!1sen!2sph!4v1773758842321!5m2!1sen!2sph";
    if (streetBtn && satBtn && mapIframe) {
      streetBtn.addEventListener('click', () => {
        streetBtn.classList.add('adv-ctrl-active');
        satBtn.classList.remove('adv-ctrl-active');
        mapIframe.src = STREET_URL;
      });
      satBtn.addEventListener('click', () => {
        satBtn.classList.add('adv-ctrl-active');
        streetBtn.classList.remove('adv-ctrl-active');
        mapIframe.src = SAT_URL;
      });
    }

    // ── Hire Me Modal — ensure it works ──
    const hireModal = document.getElementById('hireMeModal');
    const openHireBtn = document.getElementById('openHireModal');
    const closeHireBtn = document.getElementById('closeHireModal');
    const hireBackdrop = hireModal?.querySelector('.hm-backdrop');
    const hmToast = document.getElementById('hmCopyToast');
    const goContactBtn = document.getElementById('hm-go-contact');

    function openHireModal() {
      if (!hireModal) return;
      hireModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeHireModal() {
      if (!hireModal) return;
      hireModal.classList.remove('open');
      document.body.style.overflow = '';
    }

    openHireBtn?.addEventListener('click', openHireModal);
    closeHireBtn?.addEventListener('click', closeHireModal);
    hireBackdrop?.addEventListener('click', closeHireModal);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && hireModal?.classList.contains('open')) closeHireModal();
    });
    goContactBtn?.addEventListener('click', () => {
      closeHireModal();
    });

    // ── Hire modal copy email ──
    if (hireModal) {
      hireModal.querySelectorAll('.hm-copy-email').forEach(btn => {
        btn.addEventListener('click', async () => {
          const email = btn.dataset.email || 'octajose1032003@gmail.com';
          try { await navigator.clipboard.writeText(email); }
          catch (_) {
            const ta = document.createElement('textarea');
            ta.value = email; ta.style.cssText = 'position:fixed;opacity:0';
            document.body.appendChild(ta); ta.select();
            document.execCommand('copy'); document.body.removeChild(ta);
          }
          if (hmToast) {
            hmToast.classList.add('show');
            setTimeout(() => hmToast.classList.remove('show'), 2500);
          }
          const actionEl = btn.querySelector('.hm-cb-action');
          if (actionEl) {
            actionEl.innerHTML = '<i class="bx bx-check"></i><span>Copied!</span>';
            actionEl.style.color = '#4ade80';
            setTimeout(() => {
              actionEl.innerHTML = '<i class="bx bx-copy"></i><span>Copy</span>';
              actionEl.style.color = '';
            }, 2200);
          }
        });
      });
    }

    // ── Also bind floating "Hire Me" button to modal ──
    document.querySelectorAll('.btn-hire-modal').forEach(btn => {
      btn.addEventListener('click', () => openHireModal());
    });

    // ── Testimonials Filter Tabs ──
    const trFilters = document.querySelectorAll('.tr-filter');
    const trCards = document.querySelectorAll('.tr-card[data-category]');
    if (trFilters.length) {
      trFilters.forEach(tab => {
        tab.addEventListener('click', () => {
          trFilters.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          const cat = tab.dataset.cat;
          trCards.forEach(card => {
            const show = cat === 'all' || card.dataset.category === cat;
            card.classList.toggle('hidden', !show);
            if (show) {
              card.style.animation = 'none';
              requestAnimationFrame(() => {
                card.style.animation = 'fadeInUp 0.5s ease forwards';
              });
            }
          });
        });
      });
    }

    // ── Star Rating (testimonials form) ──
    const trStarBtns = document.querySelectorAll('.tr-star-btn');
    const trRatingInput = document.getElementById('selectedRating');
    const trStarHint = document.getElementById('trStarHint');
    const starHints = {
      1: 'Poor experience',
      2: 'Fair — room to improve',
      3: 'Good work overall',
      4: 'Very good!',
      5: 'Excellent — highly recommend! ⭐'
    };
    let selectedStars = 0;
    if (trStarBtns.length) {
      trStarBtns.forEach((btn, idx) => {
        btn.addEventListener('mouseenter', () => {
          trStarBtns.forEach((b, i) => b.classList.toggle('lit', i <= idx));
          if (trStarHint) trStarHint.textContent = starHints[idx + 1] || '';
        });
        btn.addEventListener('mouseleave', () => {
          trStarBtns.forEach((b, i) => b.classList.toggle('lit', i < selectedStars));
          if (trStarHint) trStarHint.textContent = selectedStars ? starHints[selectedStars] : 'Click to rate your experience';
        });
        btn.addEventListener('click', () => {
          selectedStars = idx + 1;
          if (trRatingInput) trRatingInput.value = selectedStars;
          trStarBtns.forEach((b, i) => b.classList.toggle('lit', i < selectedStars));
          if (trStarHint) trStarHint.textContent = starHints[selectedStars];
        });
      });
    }

    // ── Tech Skills Tab Filter ──
    const tsTabs = document.querySelectorAll('.ts-tab-btn');
    const tsCards = document.querySelectorAll('.ts-card');
    if (tsTabs.length) {
      tsTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tsTabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          const filter = tab.dataset.tab;
          let delay = 0;
          tsCards.forEach(card => {
            const match = filter === 'all' || card.dataset.tab === filter;
            card.classList.toggle('ts-hidden', !match);
            if (match) {
              card.style.animation = 'none';
              card.style.opacity = '0';
              card.style.transform = 'translateY(24px) scale(0.96)';
              const d = delay;
              setTimeout(() => {
                card.style.transition = 'all 0.45s cubic-bezier(0.34,1.56,0.64,1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
              }, d);
              delay += 50;
            }
          });
        });
      });
    }

    // ── Project Filter Buttons ──
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    if (filterBtns.length && projectCards.length) {
      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const filter = btn.dataset.filter;
          projectCards.forEach((card, index) => {
            const category = card.dataset.category || '';
            if (filter === 'all' || category.includes(filter)) {
              card.style.display = 'block';
              card.style.opacity = '0';
              card.style.transform = 'translateY(30px)';
              setTimeout(() => {
                card.style.transition = 'all 0.55s cubic-bezier(0.25,0.46,0.45,0.94)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
              }, index * 80);
            } else {
              card.style.opacity = '0';
              card.style.transform = 'translateY(20px)';
              setTimeout(() => { card.style.display = 'none'; }, 400);
            }
          });
        });
      });
    }

    // ── Creative Samples Tabs ──
    const csTabs = document.querySelectorAll('.cs-tab-btn');
    if (csTabs.length) {
      csTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          csTabs.forEach(t => t.classList.remove('cs-tab-active'));
          tab.classList.add('cs-tab-active');
          const target = tab.dataset.tab;
          document.querySelectorAll('.cs-tab-content').forEach(content => {
            content.classList.remove('cs-tab-show');
          });
          const targetContent = document.getElementById('cs-tab-' + target);
          if (targetContent) {
            targetContent.classList.add('cs-tab-show');
            // Animate cards inside
            targetContent.querySelectorAll('.cs-card').forEach((card, i) => {
              card.style.opacity = '0';
              card.style.transform = 'translateY(20px) scale(0.97)';
              setTimeout(() => {
                card.style.transition = 'all 0.5s cubic-bezier(0.34,1.56,0.64,1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
              }, i * 100);
            });
          }
        });
      });
    }

    // ── Smooth Scroll for all anchor links ──
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if (href === '#' || !href) return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Close mobile menu if open
          document.querySelector('.navbar')?.classList.remove('active');
          document.getElementById('menu-icon')?.classList.remove('bx-x');
        }
      });
    });

    // ── Mobile Menu Toggle ──
    const menuIcon = document.getElementById('menu-icon');
    const navbar = document.querySelector('.navbar');
    if (menuIcon && navbar) {
      menuIcon.addEventListener('click', () => {
        navbar.classList.toggle('active');
        menuIcon.classList.toggle('bx-x');
      });
      window.addEventListener('resize', () => {
        if (window.innerWidth > 992) {
          navbar.classList.remove('active');
          menuIcon.classList.remove('bx-x');
        }
      });
    }

    // ── Dark/Light Theme Toggle ──
    // ⚠️ DISABLED — handled solely by fixes.js to avoid conflicts.

    // ── Certificate Modal (Premium View) ──
    const pModal = document.getElementById('premiumModal');
    const pImg = document.getElementById('p-modal-img');
    const pClose = document.querySelector('.p-close');
    if (pModal && pImg) {
      document.querySelectorAll('.btn-premium-view').forEach(btn => {
        btn.addEventListener('click', () => {
          pImg.src = btn.dataset.src;
          pModal.style.display = 'flex';
          setTimeout(() => pModal.classList.add('active'), 10);
          document.body.style.overflow = 'hidden';
        });
      });
      const closePremium = () => {
        pModal.classList.remove('active');
        setTimeout(() => { pModal.style.display = 'none'; }, 400);
        document.body.style.overflow = '';
      };
      pClose?.addEventListener('click', closePremium);
      pModal.querySelector('.p-modal-overlay')?.addEventListener('click', closePremium);
    }

    // ── Gallery Lightbox ──
    const galleryModal = document.getElementById('galleryModal');
    if (galleryModal) {
      const modalImg = document.getElementById('gallery-modal-img');
      const modalCurrent = document.getElementById('gallery-current');
      const modalTotal = document.getElementById('gallery-total');
      const closeBtn = galleryModal.querySelector('.gallery-modal-close');
      const prevBtn = galleryModal.querySelector('.gallery-modal-prev');
      const nextBtn = galleryModal.querySelector('.gallery-modal-next');
      const overlay = galleryModal.querySelector('.gallery-modal-overlay');
      const items = document.querySelectorAll('.gallery-item');
      let currentIdx = 0;
      const sources = Array.from(items).map(item => item.querySelector('img')?.src || '');
      if (modalTotal) modalTotal.textContent = sources.length;

      const openGallery = idx => {
        currentIdx = idx;
        if (modalImg) modalImg.src = sources[currentIdx];
        if (modalCurrent) modalCurrent.textContent = currentIdx + 1;
        galleryModal.style.display = 'flex';
        requestAnimationFrame(() => galleryModal.classList.add('active'));
        document.body.style.overflow = 'hidden';
      };
      const closeGallery = () => {
        galleryModal.classList.remove('active');
        setTimeout(() => { galleryModal.style.display = 'none'; }, 400);
        document.body.style.overflow = '';
      };
      const slideModal = (dir) => {
        currentIdx = (currentIdx + dir + sources.length) % sources.length;
        if (modalImg) {
          modalImg.style.opacity = '0';
          modalImg.style.transform = `translateX(${dir > 0 ? '30px' : '-30px'})`;
          setTimeout(() => {
            modalImg.src = sources[currentIdx];
            if (modalCurrent) modalCurrent.textContent = currentIdx + 1;
            modalImg.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
            modalImg.style.opacity = '1';
            modalImg.style.transform = 'translateX(0)';
          }, 200);
        }
      };
      items.forEach((item, i) => item.addEventListener('click', () => openGallery(i)));
      closeBtn?.addEventListener('click', closeGallery);
      overlay?.addEventListener('click', closeGallery);
      prevBtn?.addEventListener('click', () => slideModal(-1));
      nextBtn?.addEventListener('click', () => slideModal(1));
      document.addEventListener('keydown', e => {
        if (!galleryModal.classList.contains('active')) return;
        if (e.key === 'ArrowLeft') slideModal(-1);
        if (e.key === 'ArrowRight') slideModal(1);
        if (e.key === 'Escape') closeGallery();
      });
    }

    // ── Project Modal ──
    const projectModal = document.getElementById('projectModal');
    if (projectModal) {
      const modalClose = projectModal.querySelector('.modal-close');
      const modalOverlay = projectModal.querySelector('.modal-overlay');
      const closeProjectModal = () => {
        projectModal.classList.remove('active');
        document.body.style.overflow = '';
      };
      modalClose?.addEventListener('click', closeProjectModal);
      modalOverlay?.addEventListener('click', closeProjectModal);
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && projectModal.classList.contains('active')) closeProjectModal();
      });
    }

    // ── Creative Samples Lightbox ──
    const csLightbox = document.getElementById('csLightbox');
    if (csLightbox) {
      const csLbImg = document.getElementById('csLightboxImg');
      const csClose = csLightbox.querySelector('.cs-lb-close');
      const csOverlay = csLightbox.querySelector('.cs-lb-overlay');
      const csPrev = csLightbox.querySelector('.cs-lb-prev');
      const csNext = csLightbox.querySelector('.cs-lb-next');
      const csItems = document.querySelectorAll('.cs-card[data-cs-type="graphic"]');
      const csSources = Array.from(csItems).map(item => item.querySelector('img')?.src || '');
      let csIdx = 0;

      document.querySelectorAll('.cs-card:not(.cs-card-add)').forEach((card, i) => {
        card.addEventListener('click', () => {
          const img = card.querySelector('img');
          if (!img) return;
          csIdx = i;
          if (csLbImg) csLbImg.src = img.src;
          csLightbox.style.display = 'flex';
          requestAnimationFrame(() => csLightbox.classList.add('active'));
          document.body.style.overflow = 'hidden';
        });
      });
      const closeCs = () => {
        csLightbox.classList.remove('active');
        setTimeout(() => { csLightbox.style.display = 'none'; }, 400);
        document.body.style.overflow = '';
      };
      csClose?.addEventListener('click', closeCs);
      csOverlay?.addEventListener('click', closeCs);
      document.addEventListener('keydown', e => {
        if (!csLightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeCs();
      });
    }

    // ── Section Indicator Dots ──
    const existingIndicator = document.getElementById('section-indicator');
    if (!existingIndicator) {
      const indicator = document.createElement('div');
      indicator.id = 'section-indicator';
      indicator.style.cssText = `
        position:fixed; right:20px; top:50%; transform:translateY(-50%);
        display:flex; flex-direction:column; gap:10px; z-index:8000;
        opacity:0; transition:opacity 0.4s ease;
      `;
      const sectList = [
        { id: 'home', label: 'Home' },
        { id: 'about', label: 'About' },
        { id: 'certificates', label: 'Certs' },
        { id: 'tech-skills', label: 'Skills' },
        { id: 'services', label: 'Services' },
        { id: 'projects', label: 'Projects' },
        { id: 'testimonials', label: 'Reviews' },
        { id: 'contact', label: 'Contact' },
      ];
      sectList.forEach(s => {
        if (!document.getElementById(s.id)) return;
        const dot = document.createElement('a');
        dot.href = '#' + s.id;
        dot.dataset.section = s.id;
        dot.title = s.label;
        dot.style.cssText = `
          width:8px; height:8px; border-radius:50%;
          background:rgba(255,255,255,0.2); border:1.5px solid rgba(234,88,12,0.3);
          display:block; transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1); position:relative;
        `;
        indicator.appendChild(dot);
      });
      document.body.appendChild(indicator);
      let indicatorVisible = false;
      window.addEventListener('scroll', () => {
        const show = window.scrollY > 300;
        if (show !== indicatorVisible) {
          indicatorVisible = show;
          indicator.style.opacity = show ? '1' : '0';
        }
        sectList.forEach(s => {
          const el = document.getElementById(s.id);
          if (!el) return;
          const dot = indicator.querySelector(`[data-section="${s.id}"]`);
          if (!dot) return;
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom > 200) {
            dot.style.background = 'rgba(234,88,12,1)';
            dot.style.boxShadow = '0 0 8px rgba(234,88,12,0.8)';
            dot.style.width = '10px';
            dot.style.height = '10px';
          } else {
            dot.style.background = 'rgba(255,255,255,0.2)';
            dot.style.boxShadow = 'none';
            dot.style.width = '8px';
            dot.style.height = '8px';
          }
        });
      }, { passive: true });
    }

    // ── Copyright year ──
    document.querySelectorAll('.ft-year-display').forEach(el => {
      el.textContent = `©${new Date().getFullYear()}`;
    });

    // ── Footer visitor count ──
    const visitorEl = document.getElementById('ftVisitCount');
    if (visitorEl) {
      const today = new Date().toDateString();
      const stored = localStorage.getItem('ft_visit_date');
      let count = parseInt(localStorage.getItem('ft_visit_count') || '0');
      if (stored !== today) {
        count = Math.floor(Math.random() * 30) + 15;
        localStorage.setItem('ft_visit_date', today);
      } else {
        count += Math.floor(Math.random() * 3);
      }
      localStorage.setItem('ft_visit_count', count);
      let cur = 0;
      const step = Math.ceil(count / 40);
      const timer = setInterval(() => {
        cur = Math.min(cur + step, count);
        visitorEl.textContent = cur;
        if (cur >= count) clearInterval(timer);
      }, 40);
    }

    // ── Tilt effect on cards ──
    document.querySelectorAll('.ts-card, .project-card, .premium-card, .srv-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rx = (-y / rect.height * 8).toFixed(2);
        const ry = (x / rect.width * 8).toFixed(2);
        card.style.transform = `translateY(-8px) scale(1.02) rotateX(${rx}deg) rotateY(${ry}deg)`;
        // Shine
        let shine = card.querySelector('.e-tilt-shine');
        if (!shine) {
          shine = document.createElement('div');
          shine.className = 'e-tilt-shine';
          shine.style.cssText = 'position:absolute;inset:0;pointer-events:none;border-radius:inherit;z-index:10;transition:opacity 0.3s ease;';
          card.style.position = 'relative';
          card.appendChild(shine);
        }
        shine.style.background = `radial-gradient(circle at ${(e.clientX - rect.left) / rect.width * 100}% ${(e.clientY - rect.top) / rect.height * 100}%, rgba(255,255,255,0.1) 0%, transparent 60%)`;
        shine.style.opacity = '1';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
        const shine = card.querySelector('.e-tilt-shine');
        if (shine) shine.style.opacity = '0';
      });
    });

    // ── Magnetic button effect ──
    document.querySelectorAll('.btn, .gradient-btn, #floating-hire, .srv-btn-primary, .ct-submit-btn, .tr-submit-btn, #trSubmitBtn, #submitBtn').forEach(el => {
      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * 0.28;
        const dy = (e.clientY - cy) * 0.28;
        el.style.transform = `translate(${dx}px, ${dy}px) scale(1.05)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
        el.style.transition = 'transform 0.45s cubic-bezier(0.23,1,0.32,1)';
        setTimeout(() => { el.style.transition = ''; }, 450);
      });
    });

    // ── Lazy load images ──
    const lazyImages = document.querySelectorAll('img[data-src]');
    if (lazyImages.length && 'IntersectionObserver' in window) {
      const imgObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imgObs.unobserve(img);
          }
        });
      }, { rootMargin: '100px' });
      lazyImages.forEach(img => imgObs.observe(img));
    }

    // ── Gallery reveal observer ──
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length) {
      const gobs = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            const idx = Array.from(galleryItems).indexOf(entry.target);
            setTimeout(() => entry.target.classList.add('gallery-visible'), idx * 100);
            gobs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      galleryItems.forEach(item => gobs.observe(item));
    }

    // ── AOS-like reveal for cs-cards (already hidden, make visible on scroll) ──
    const csCardObs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const idx = Array.from(document.querySelectorAll('.cs-card')).indexOf(entry.target);
          setTimeout(() => entry.target.classList.add('e-visible'), idx * 100);
          csCardObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.cs-card').forEach(c => csCardObs.observe(c));

    // Add keyframes dynamically
    const animStyles = document.createElement('style');
    animStyles.textContent = `
      @keyframes fadeInUp {
        from { opacity:0; transform:translateY(30px); }
        to   { opacity:1; transform:translateY(0); }
      }
      @keyframes tsCardIn {
        from { opacity:0; transform:translateY(24px) scale(0.96); }
        to   { opacity:1; transform:translateY(0) scale(1); }
      }
      @keyframes cardFadeIn {
        from { opacity:0; transform:translateY(20px) scale(0.97); }
        to   { opacity:1; transform:translateY(0) scale(1); }
      }
      .hm-service-card { cursor:default; }
      .ts-hidden { display:none !important; }
      .cs-tab-content { display:none; }
      .cs-tab-content.cs-tab-show { display:block; }
    `;
    document.head.appendChild(animStyles);

    console.log('✅ JVOR DEV. Portfolio — All enhancements loaded!');
  });

})();

// ── Run after DOM loaded ──
document.addEventListener('DOMContentLoaded', () => {

  // ── Image error fallback ──
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function () {
      // If image fails, show a styled placeholder
      this.style.opacity = '0.3';
      this.style.filter = 'grayscale(1)';
      this.alt = this.alt || 'Image unavailable';
    });
  });

  // ── Video cards: click play button to show alert / open video ──
  document.querySelectorAll('.cs-card-video').forEach(card => {
    const playBtn = card.querySelector('.cs-play-btn');
    if (!playBtn) return;
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      // Check for iframe (YouTube embed) first
      const iframe = card.querySelector('.cs-video-iframe');
      if (iframe) {
        iframe.style.display = 'block';
        iframe.previousElementSibling?.remove(); // remove thumbnail
        playBtn.remove();
        return;
      }
      // Check for data-video attribute
      const videoUrl = card.dataset.videoUrl || card.dataset.video;
      if (videoUrl) {
        window.open(videoUrl, '_blank');
        return;
      }
      // Default: scroll to contact
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // ── Ensure all gallery images show ──
  document.querySelectorAll('.gallery-item img').forEach(img => {
    if (img.complete && img.naturalWidth === 0) {
      img.closest('.gallery-item')?.style?.setProperty('background', 'rgba(20,20,20,0.8)');
    }
  });

});