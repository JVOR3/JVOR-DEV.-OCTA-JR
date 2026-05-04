/* ═══════════════════════════════════════════════════════
   FIXES.JS — JVOR DEV PORTFOLIO v4
   1. Mobile Menu
   2. Theme Toggle
   3. Skills Section: card gen, filters, bars, counters, particles
═══════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ══════════════════════════════════
     DATA — all skill cards
  ══════════════════════════════════ */
  const SKILLS = [
    { name: 'HTML5', cat: 'Frontend', filter: 'frontend', icon: 'bxl-html5', pct: 95, level: 'expert' },
    { name: 'CSS3', cat: 'Frontend', filter: 'frontend', icon: 'bxl-css3', pct: 92, level: 'expert' },
    { name: 'JavaScript', cat: 'Frontend', filter: 'frontend', icon: 'bxl-javascript', pct: 85, level: 'advanced' },
    { name: 'React', cat: 'Frontend', filter: 'frontend', icon: 'bxl-react', pct: 78, level: 'advanced' },
    { name: 'Bootstrap', cat: 'Frontend', filter: 'frontend', icon: 'bxl-bootstrap', pct: 88, level: 'advanced' },
    { name: 'Tailwind CSS', cat: 'Frontend', filter: 'frontend', icon: 'bxl-tailwind-css', pct: 80, level: 'advanced' },
    { name: 'Node.js', cat: 'Backend', filter: 'backend', icon: 'bxl-nodejs', pct: 70, level: 'mid' },
    { name: 'Python', cat: 'Backend', filter: 'backend', icon: 'bxl-python', pct: 68, level: 'mid' },
    { name: 'MongoDB', cat: 'Database', filter: 'backend', icon: 'bxl-mongodb', pct: 65, level: 'mid' },
    { name: 'Firebase', cat: 'Backend', filter: 'backend', icon: 'bxl-firebase', pct: 75, level: 'advanced' },
    { name: 'REST APIs', cat: 'Backend', filter: 'backend', icon: 'bx-server', pct: 72, level: 'mid' },
    { name: 'Git', cat: 'Version Ctrl', filter: 'tools', icon: 'bxl-git', pct: 82, level: 'advanced' },
    { name: 'GitHub', cat: 'Collab', filter: 'tools', icon: 'bxl-github', pct: 80, level: 'advanced' },
    { name: 'VS Code', cat: 'IDE', filter: 'tools', icon: 'bxl-visual-studio', pct: 78, level: 'advanced' },
    { name: 'Figma', cat: 'UI Design', filter: 'design', icon: 'bxl-figma', pct: 85, level: 'advanced' },
    { name: 'Photoshop', cat: 'Design', filter: 'design', icon: 'bxs-layer', pct: 75, level: 'advanced' },
    { name: 'Video Editing', cat: 'Creative', filter: 'design', icon: 'bx-video', pct: 90, level: 'expert' },
    { name: 'UI/UX Design', cat: 'Design', filter: 'design', icon: 'bx-palette', pct: 88, level: 'advanced' },
    { name: 'PostgreSQL', cat: 'Database', filter: 'backend', icon: 'bxl-postgresql', pct: 60, level: 'mid' },
    { name: 'Tailwind', cat: 'Frontend', filter: 'frontend', icon: 'bxl-tailwind-css', pct: 80, level: 'advanced' },
  ];

  const LEVEL_DOT = { expert: 'nsk-dot-expert', advanced: 'nsk-dot-advanced', mid: 'nsk-dot-mid' };

  /* Circumference for circle ring (r=18) */
  const CIRC = 2 * Math.PI * 18; // ≈ 113.1

  function buildCard(skill, delay) {
    const dashVal = (skill.pct / 100) * CIRC;
    return `
    <div class="nsk-card" data-filter="${skill.filter}" style="animation-delay:${delay}ms">
      <div class="nsk-card-top">
        <div class="nsk-card-icon"><i class='bx ${skill.icon}'></i></div>
        <div class="nsk-level-dot ${LEVEL_DOT[skill.level]}"></div>
      </div>
      <div>
        <div class="nsk-card-name">${skill.name}</div>
        <div class="nsk-card-cat">${skill.cat}</div>
      </div>
      <div class="nsk-card-ring">
        <svg class="nsk-ring-svg" viewBox="0 0 40 40">
          <circle class="nsk-ring-bg" cx="20" cy="20" r="18"/>
          <circle class="nsk-ring-fill" cx="20" cy="20" r="18"
            data-dash="${dashVal.toFixed(2)}"
            stroke-dasharray="0 ${CIRC.toFixed(2)}"/>
        </svg>
        <div>
          <span class="nsk-ring-pct">${skill.pct}%</span>
          <span class="nsk-ring-label">${skill.level === 'expert' ? 'Expert' : skill.level === 'advanced' ? 'Advanced' : 'Intermediate'}</span>
        </div>
      </div>
    </div>`;
  }

  /* ══════════════════════════════════
     1. MOBILE MENU
  ══════════════════════════════════ */
  function initMobileMenu() {
    const menuIcon = document.getElementById('menu-icon');
    const navbar = document.querySelector('.navbar');
    if (!menuIcon || !navbar) return;

    let overlay = document.querySelector('.navbar-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'navbar-overlay';
      document.body.appendChild(overlay);
    }

    const open = () => {
      navbar.classList.add('active');
      menuIcon.classList.replace('bx-menu', 'bx-x');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      navbar.classList.remove('active');
      menuIcon.classList.replace('bx-x', 'bx-menu');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    menuIcon.addEventListener('click', e => { e.stopPropagation(); navbar.classList.contains('active') ? close() : open(); });
    overlay.addEventListener('click', close);
    navbar.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    document.addEventListener('keydown', e => e.key === 'Escape' && close());
    window.addEventListener('resize', () => window.innerWidth > 992 && close());
  }

  /* ══════════════════════════════════
     2. THEME TOGGLE
     ─ Sole authority for night/day mode.
     ─ localStorage key: 'jvor-theme'
     ─ Default (first visit OR no saved pref): DARK (night mode).
     ─ Clears the old conflicting 'theme' key on load.
  ══════════════════════════════════ */
  function initThemeToggle() {
    const btn = document.querySelector('.theme-toggle');
    const icon = document.getElementById('theme-icon');
    if (!btn || !icon) return;

    // Remove the old key used by script.js / enhancements.js so it
    // never conflicts with ours again.
    localStorage.removeItem('theme');

    const apply = (mode) => {
      document.body.classList.toggle('light-mode', mode === 'light');
      icon.className = mode === 'light' ? 'bx bx-sun' : 'bx bx-moon';
      localStorage.setItem('jvor-theme', mode);
    };

    // On first visit localStorage has nothing → default is 'dark'.
    const saved = localStorage.getItem('jvor-theme');
    apply(saved === 'light' ? 'light' : 'dark');

    btn.addEventListener('click', () => {
      apply(document.body.classList.contains('light-mode') ? 'dark' : 'light');
    });
  }

  /* ══════════════════════════════════
     3A. BUILD SKILL CARDS
  ══════════════════════════════════ */
  function buildSkillCards() {
    const grid = document.getElementById('nskHexGrid');
    if (!grid) return;
    // Remove duplicates by name
    const unique = SKILLS.filter((s, i, arr) => arr.findIndex(x => x.name === s.name) === i);
    grid.innerHTML = unique.map((s, i) => buildCard(s, i * 50)).join('');
  }

  /* ══════════════════════════════════
     3B. FILTER TABS
  ══════════════════════════════════ */
  function initFilterTabs() {
    const tabs = document.querySelectorAll('.nsk-tab');
    const grid = document.getElementById('nskHexGrid');
    if (!tabs.length || !grid) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const f = tab.dataset.filter;
        grid.querySelectorAll('.nsk-card').forEach((card, i) => {
          const show = f === 'all' || card.dataset.filter === f;
          card.style.display = show ? '' : 'none';
          if (show) {
            card.style.animationDelay = (i * 40) + 'ms';
            card.style.animation = 'none';
            requestAnimationFrame(() => { card.style.animation = ''; });
          }
        });
      });
    });
  }

  /* ══════════════════════════════════
     3C. ANIMATE RING FILLS
  ══════════════════════════════════ */
  function initRingFills() {
    const rings = document.querySelectorAll('.nsk-ring-fill');
    if (!rings.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const dash = parseFloat(el.dataset.dash) || 0;
        const total = CIRC.toFixed(2);
        el.style.strokeDasharray = `${dash} ${total}`;
        obs.unobserve(el);
      });
    }, { threshold: 0.3 });
    rings.forEach(r => obs.observe(r));
  }

  /* ══════════════════════════════════
     3D. ANIMATE SKILL BARS
  ══════════════════════════════════ */
  function initSkillBars() {
    const fills = document.querySelectorAll('.nsk-bar-fill');
    const pcts = document.querySelectorAll('.nsk-bar-pct[data-target]');
    if (!fills.length) return;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const fill = e.target;
        const w = fill.dataset.w || 0;
        fill.style.width = w + '%';
        obs.unobserve(fill);
      });
    }, { threshold: 0.4 });
    fills.forEach(f => obs.observe(f));

    // counter animation for bar percentages
    const obsN = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const tgt = parseInt(el.dataset.target) || 0;
        let cur = 0;
        const step = Math.max(1, Math.ceil(tgt / 60));
        const iv = setInterval(() => {
          cur = Math.min(cur + step, tgt);
          el.textContent = cur + '%';
          if (cur >= tgt) clearInterval(iv);
        }, 18);
        obsN.unobserve(el);
      });
    }, { threshold: 0.4 });
    pcts.forEach(p => obsN.observe(p));
  }

  /* ══════════════════════════════════
     3E. COUNTER STRIP ANIMATION
  ══════════════════════════════════ */
  function initCounters() {
    const nums = document.querySelectorAll('.nsk-count-num[data-count]');
    if (!nums.length) return;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const tgt = parseInt(el.dataset.count) || 0;
        let cur = 0;
        const step = Math.max(1, Math.ceil(tgt / 50));
        const iv = setInterval(() => {
          cur = Math.min(cur + step, tgt);
          el.textContent = cur;
          if (cur >= tgt) clearInterval(iv);
        }, 30);
        obs.unobserve(el);
      });
    }, { threshold: 0.5 });
    nums.forEach(n => obs.observe(n));
  }

  /* ══════════════════════════════════
     3F. PARTICLE CANVAS
  ══════════════════════════════════ */
  function initParticles() {
    const canvas = document.getElementById('nskParticleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H, particles = [];

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.r = Math.random() * 1.5 + 0.5;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.a = Math.random() * 0.5 + 0.1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(234,88,12,${this.a})`;
        ctx.fill();
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      }
    }

    for (let i = 0; i < 60; i++) particles.push(new Particle());

    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ══════════════════════════════════
     INIT ALL
  ══════════════════════════════════ */
  function init() {
    initMobileMenu();
    initThemeToggle();
    buildSkillCards();
    initFilterTabs();
    initRingFills();
    initSkillBars();
    initCounters();
    initParticles();
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();

})();

/* ══════════════════════════════════
   PGX — MARQUEE GALLERY + LIGHTBOX
══════════════════════════════════ */
(function initPGXMarquee() {

  /* Master image list — same order as HTML cards */
  const IMAGES = [
    { src: 'imgae/01.jpg', cap: 'Main Profile Shot' },
    { src: 'imgae/received_2306073673121096.jpeg', cap: 'A Special Moment' },
    { src: 'imgae/received_444184058689443.jpeg', cap: 'Cherished Memory' },
    { src: 'imgae/received_616997177863436.jpeg', cap: 'My Dev Setup' },
    { src: 'imgae/PHANTOM-OCTA.jpg', cap: 'Sport Fest Highlight' },
    { src: 'imgae/Screenshot_20260318-083540.jpg', cap: 'Creative Highlight' },
    { src: 'imgae/Screenshot_20260318-083427.jpg', cap: 'Movie Poster Design' },
  ];

  function run() {
    /* ── Seamless loop: clone each track's children ── */
    ['pgxTrack1', 'pgxTrack2'].forEach(id => {
      const track = document.getElementById(id);
      if (!track) return;
      const clone = track.innerHTML;
      track.innerHTML += clone; // double the items → CSS scroll covers 50%
    });

    /* ── Lightbox refs ── */
    const lightbox = document.getElementById('pgxLightbox');
    if (!lightbox) return;
    const lbImg = document.getElementById('pgxLbImg');
    const lbCap = document.getElementById('pgxLbCaption');
    const lbCur = document.getElementById('pgxLbCur');
    const lbTot = document.getElementById('pgxLbTot');
    const lbThumbs = document.getElementById('pgxLbThumbs');
    const lbClose = document.getElementById('pgxLbClose');
    const lbPrev = document.getElementById('pgxLbPrev');
    const lbNext = document.getElementById('pgxLbNext');

    lbTot.textContent = IMAGES.length;

    /* Build thumb strip */
    IMAGES.forEach((im, i) => {
      const t = document.createElement('button');
      t.className = 'pgx-lb-thumb';
      t.setAttribute('aria-label', `View photo ${i + 1}`);
      t.innerHTML = `<img src="${im.src}" alt="${im.cap}" loading="lazy">`;
      t.addEventListener('click', () => openAt(i));
      lbThumbs.appendChild(t);
    });

    /* ── Open on card click (data-index attr) ── */
    document.querySelectorAll('.pgx-mq-card').forEach(card => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.dataset.index) || 0;
        openAt(idx);
      });
    });

    let current = 0;

    function openAt(idx) {
      current = (idx + IMAGES.length) % IMAGES.length;
      lightbox.classList.add('pgx-lb-open');
      document.body.style.overflow = 'hidden';
      loadImage(current);
    }

    function closeLb() {
      lightbox.classList.remove('pgx-lb-open');
      document.body.style.overflow = '';
    }

    function loadImage(idx) {
      lbImg.classList.add('pgx-lb-loading');
      const im = IMAGES[idx];
      const tmp = new Image();
      tmp.onload = () => {
        lbImg.src = im.src;
        lbImg.alt = im.cap;
        lbImg.classList.remove('pgx-lb-loading');
      };
      tmp.onerror = () => { lbImg.src = im.src; lbImg.classList.remove('pgx-lb-loading'); };
      tmp.src = im.src;
      lbCap.textContent = im.cap;
      lbCur.textContent = idx + 1;
      /* Update thumbs */
      lbThumbs.querySelectorAll('.pgx-lb-thumb').forEach((t, i) => {
        t.classList.toggle('pgx-lb-thumb--active', i === idx);
        if (i === idx) t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      });
    }

    function prev() { current = (current - 1 + IMAGES.length) % IMAGES.length; loadImage(current); }
    function next() { current = (current + 1) % IMAGES.length; loadImage(current); }

    lbClose.addEventListener('click', closeLb);
    document.querySelector('.pgx-lb-backdrop') &&
      document.querySelector('.pgx-lb-backdrop').addEventListener('click', closeLb);
    lbPrev.addEventListener('click', e => { e.stopPropagation(); prev(); });
    lbNext.addEventListener('click', e => { e.stopPropagation(); next(); });

    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('pgx-lb-open')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    });

    /* Touch swipe */
    let tsX = 0;
    lightbox.addEventListener('touchstart', e => { tsX = e.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - tsX;
      if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
    }, { passive: true });
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', run)
    : run();

})();