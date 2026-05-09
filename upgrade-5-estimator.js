/* ═══════════════════════════════════════════════════════════════════
   UPGRADE 5 — ESTIMATOR.JS — JVOR DEV PORTFOLIO
   Interactive Project Budget Estimator
   Injects a new section between #services and #projects
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ─── PRICING DATA (PHP) ─── */
  const PROJECT_TYPES = [
    { id: 'landing',   label: '🖥️ Landing Page',      base: [3000,  8000],  time: '3–7 days' },
    { id: 'portfolio', label: '💼 Portfolio Site',     base: [5000,  12000], time: '5–10 days' },
    { id: 'website',   label: '🌐 Full Website',       base: [8000,  20000], time: '1–3 weeks' },
    { id: 'webapp',    label: '⚙️ Web App / PWA',      base: [15000, 40000], time: '3–6 weeks' },
    { id: 'ecommerce', label: '🛒 E-Commerce',         base: [20000, 50000], time: '4–8 weeks' },
    { id: 'redesign',  label: '🎨 Redesign / Revamp',  base: [5000,  18000], time: '1–2 weeks' },
  ];

  const FEATURES = [
    { id: 'responsive',  label: 'Responsive Design',   icon: '📱', add: [1000, 2000] },
    { id: 'cms',         label: 'CMS / Admin Panel',   icon: '🗂️', add: [5000, 10000] },
    { id: 'animations',  label: 'Animations',          icon: '✨', add: [2000, 5000] },
    { id: 'seo',         label: 'SEO Setup',           icon: '🔍', add: [2000, 4000] },
    { id: 'darkmode',    label: 'Dark/Light Mode',     icon: '🌙', add: [1500, 3000] },
    { id: 'auth',        label: 'Login / Auth',        icon: '🔐', add: [5000, 12000] },
    { id: 'payments',    label: 'Payment Integration', icon: '💳', add: [5000, 15000] },
    { id: 'api',         label: 'API Integration',     icon: '🔗', add: [3000, 8000] },
    { id: 'multilang',   label: 'Multi-language',      icon: '🌍', add: [2000, 5000] },
    { id: 'maintenance', label: '1 Month Support',     icon: '🛠️', add: [2000, 4000] },
  ];

  let selectedType = null;
  let selectedFeatures = new Set();

  /* ─── Format peso ─── */
  function peso(n) {
    return '₱' + n.toLocaleString('en-PH');
  }

  /* ─── Calculate estimate ─── */
  function calcEstimate() {
    if (!selectedType) return null;

    const type = PROJECT_TYPES.find(t => t.id === selectedType);
    let lo = type.base[0];
    let hi = type.base[1];
    const breakdown = [{ label: type.label.replace(/^\S+\s/, ''), lo: type.base[0], hi: type.base[1] }];

    selectedFeatures.forEach(fid => {
      const feat = FEATURES.find(f => f.id === fid);
      if (!feat) return;
      lo += feat.add[0];
      hi += feat.add[1];
      breakdown.push({ label: feat.label, lo: feat.add[0], hi: feat.add[1] });
    });

    return { lo, hi, breakdown, time: type.time };
  }

  /* ─── Render result ─── */
  function updateResult() {
    const result = document.getElementById('est-result');
    if (!result) return;

    const data = calcEstimate();
    if (!data) {
      result.classList.remove('est-result-show');
      return;
    }

    result.innerHTML = `
      <div class="est-result-header">
        <div>
          <div class="est-result-label">💰 Estimated Range</div>
          <div class="est-price-range">${peso(data.lo)} – ${peso(data.hi)}</div>
          <div class="est-price-note">Rough estimate · Final quote upon full briefing</div>
        </div>
      </div>
      <div class="est-breakdown">
        ${data.breakdown.map(b => `
          <div class="est-breakdown-item">
            <span>${b.label}</span>
            <span>${peso(b.lo)} – ${peso(b.hi)}</span>
          </div>
        `).join('')}
      </div>
      <div class="est-result-timeline">
        ⏱️ Estimated timeline: <strong>${data.time}</strong>
      </div>
      <div class="est-cta-row">
        <a href="#contact" class="est-cta-btn est-cta-btn--primary" id="est-cta-contact">
          💬 Get a Free Quote
        </a>
        <button type="button" class="est-cta-btn est-cta-btn--ghost" id="est-reset-btn">
          🔄 Reset
        </button>
      </div>
    `;

    result.classList.add('est-result-show');

    // Pre-fill contact form subject
    document.getElementById('est-cta-contact')?.addEventListener('click', () => {
      const type = PROJECT_TYPES.find(t => t.id === selectedType);
      const subj = document.getElementById('cf-subject');
      if (subj && type) {
        subj.value = type.label.replace(/^\S+\s/, '') + ' Inquiry';
        subj.closest('.ct-form-group')?.classList.add('is-valid');
      }
    });

    // Reset
    document.getElementById('est-reset-btn')?.addEventListener('click', () => {
      selectedType = null;
      selectedFeatures.clear();
      result.classList.remove('est-result-show');
      document.querySelectorAll('.est-opt').forEach(b => b.classList.remove('est-selected'));
      document.querySelectorAll('.est-feature-toggle').forEach(b => {
        b.classList.remove('est-feat-on');
        b.querySelector('.est-feat-check').textContent = '';
      });
      document.getElementById('est-features-step').style.display = 'none';
    });
  }

  /* ─── Build the HTML ─── */
  function buildEstimatorHTML() {
    return `
      <section id="estimator-section">
        <div class="est-inner">
          <div class="est-header">
            <div class="est-eyebrow">💰 Budget Estimator</div>
            <h2 class="section-heading">Project <span>Price Calculator</span></h2>
            <p style="color:#aaa;font-family:'Poppins',sans-serif;font-size:0.9rem;margin-top:0.5rem">
              Select your project type and features para makita ang rough estimate. 
              Free quote agad after!
            </p>
          </div>
          <div class="est-card">

            <!-- Step 1: Project Type -->
            <div class="est-step" id="est-type-step">
              <div class="est-step-label">
                <div class="est-step-num">1</div>
                What type of project?
              </div>
              <div class="est-options">
                ${PROJECT_TYPES.map(t => `
                  <button type="button" class="est-opt" data-type="${t.id}">
                    ${t.label}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Step 2: Features (shown after type selected) -->
            <div class="est-step" id="est-features-step" style="display:none">
              <div class="est-step-label">
                <div class="est-step-num">2</div>
                Add features (optional)
              </div>
              <div class="est-features-grid">
                ${FEATURES.map(f => `
                  <button type="button" class="est-feature-toggle" data-feat="${f.id}">
                    <span class="est-feat-check"></span>
                    ${f.icon} ${f.label}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Result -->
            <div id="est-result"></div>

          </div>
        </div>
      </section>
    `;
  }

  /* ─── Inject + wire up ─── */
  function init() {
    // Inject section between #services and #projects
    const servicesSection = document.getElementById('services');
    const projectsSection = document.getElementById('projects');

    if (!servicesSection && !projectsSection) {
      console.warn('[Estimator] Could not find #services or #projects anchor');
      return;
    }

    const anchor = projectsSection || servicesSection.nextElementSibling;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = buildEstimatorHTML();
    const newSection = wrapper.firstElementChild;

    if (anchor) {
      anchor.parentElement.insertBefore(newSection, anchor);
    } else {
      document.body.appendChild(newSection);
    }

    // Type buttons
    document.querySelectorAll('.est-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.est-opt').forEach(b => b.classList.remove('est-selected'));
        btn.classList.add('est-selected');
        selectedType = btn.dataset.type;
        document.getElementById('est-features-step').style.display = 'block';
        updateResult();
      });
    });

    // Feature toggles
    document.querySelectorAll('.est-feature-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const fid = btn.dataset.feat;
        const check = btn.querySelector('.est-feat-check');
        if (selectedFeatures.has(fid)) {
          selectedFeatures.delete(fid);
          btn.classList.remove('est-feat-on');
          check.textContent = '';
        } else {
          selectedFeatures.add(fid);
          btn.classList.add('est-feat-on');
          check.textContent = '✓';
        }
        updateResult();
      });
    });

    console.log('✅ JVOR Estimator: Budget calculator loaded');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
