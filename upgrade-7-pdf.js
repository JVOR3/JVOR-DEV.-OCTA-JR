/* ═══════════════════════════════════════════════════════════════════
   UPGRADE 7 — PDF.JS — JVOR DEV PORTFOLIO
   "Download Portfolio PDF" button — auto-generates a beautifully
   formatted PDF using the browser's print API.
   No external library needed — uses CSS @media print.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ─── PDF CSS styles (injected into <head>) ─── */
  const PDF_STYLES = `
    @media print {
      /* Hide everything but the PDF content */
      body > *:not(#jvor-pdf-doc) {
        display: none !important;
      }
      #jvor-pdf-doc {
        display: block !important;
        position: static !important;
        width: 100% !important;
        background: #fff !important;
        color: #111 !important;
        font-family: 'Poppins', sans-serif !important;
        padding: 0 !important;
        margin: 0 !important;
      }

      @page {
        size: A4;
        margin: 12mm 14mm;
      }

      .pdf-page-break { page-break-after: always; }
    }

    /* ── PDF Document visual styles (screen preview + print) ── */
    #jvor-pdf-doc {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: #f5f5f5;
      overflow-y: auto;
      padding: 2rem;
    }

    #jvor-pdf-doc.pdf-preview-open {
      display: block;
    }

    .pdf-sheet {
      background: #fff;
      max-width: 794px; /* A4 width */
      margin: 0 auto 2rem;
      padding: 2.5rem 2.8rem;
      box-shadow: 0 8px 40px rgba(0,0,0,0.15);
      border-radius: 4px;
      font-family: 'Poppins', sans-serif;
      color: #1a1a1a;
      position: relative;
    }

    /* ── Header stripe ── */
    .pdf-top-stripe {
      height: 5px;
      background: linear-gradient(90deg, #ea580c, #c2410c, #1a1a1a);
      margin: -2.5rem -2.8rem 2rem;
      border-radius: 4px 4px 0 0;
    }

    .pdf-header {
      display: flex;
      align-items: flex-start;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1.5px solid #e8e8e8;
    }

    .pdf-avatar {
      width: 80px;
      height: 80px;
      border-radius: 14px;
      object-fit: cover;
      flex-shrink: 0;
      border: 3px solid #ea580c;
    }

    .pdf-name {
      font-size: 1.6rem;
      font-weight: 800;
      color: #1a1a1a;
      line-height: 1.1;
      margin: 0 0 4px;
    }

    .pdf-role {
      font-size: 0.88rem;
      color: #ea580c;
      font-weight: 600;
      margin-bottom: 6px;
    }

    .pdf-contact-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem 1.2rem;
      font-size: 0.72rem;
      color: #555;
    }

    .pdf-contact-row a { color: #ea580c; text-decoration: none; }

    /* ── Sections ── */
    .pdf-section {
      margin-bottom: 1.5rem;
    }

    .pdf-section-title {
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #ea580c;
      border-left: 3px solid #ea580c;
      padding-left: 0.6rem;
      margin-bottom: 0.75rem;
    }

    .pdf-bio {
      font-size: 0.82rem;
      line-height: 1.6;
      color: #444;
    }

    /* ── Skills ── */
    .pdf-skills-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
    }

    .pdf-skill-tag {
      padding: 0.25rem 0.7rem;
      background: #fff4ef;
      border: 1px solid rgba(234,88,12,0.25);
      border-radius: 50px;
      font-size: 0.7rem;
      font-weight: 600;
      color: #c2410c;
    }

    /* ── Services ── */
    .pdf-services-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.5rem;
    }

    .pdf-service-item {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      font-size: 0.78rem;
      color: #333;
    }

    .pdf-service-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #ea580c;
      flex-shrink: 0;
      margin-top: 5px;
    }

    /* ── Projects ── */
    .pdf-project {
      margin-bottom: 0.9rem;
      padding-bottom: 0.9rem;
      border-bottom: 1px solid #f0f0f0;
    }

    .pdf-project:last-child { border-bottom: none; margin-bottom: 0; }

    .pdf-project-name {
      font-size: 0.88rem;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 3px;
    }

    .pdf-project-desc {
      font-size: 0.75rem;
      color: #666;
      line-height: 1.5;
      margin-bottom: 4px;
    }

    .pdf-project-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 3px;
    }

    .pdf-project-tag {
      font-size: 0.62rem;
      padding: 2px 7px;
      background: #f5f5f5;
      border-radius: 4px;
      color: #888;
    }

    /* ── Footer ── */
    .pdf-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1.5px solid #f0f0f0;
      font-size: 0.68rem;
      color: #aaa;
    }

    .pdf-footer-brand { font-weight: 700; color: #ea580c; }

    /* ── Preview close/print bar ── */
    #pdf-action-bar {
      position: sticky;
      top: 0;
      z-index: 2;
      background: #1a1a1a;
      padding: 0.75rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin: -2rem -2rem 2rem;
    }

    .pdf-action-label {
      font-family: 'Poppins', sans-serif;
      font-size: 0.8rem;
      color: #888;
    }

    .pdf-action-label strong { color: #fff; }

    .pdf-action-btns { display: flex; gap: 0.6rem; }

    .pdf-btn {
      padding: 0.5rem 1.2rem;
      border-radius: 50px;
      font-family: 'Poppins', sans-serif;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }

    .pdf-btn-print {
      background: linear-gradient(135deg, #ea580c, #c2410c);
      color: #fff;
    }

    .pdf-btn-print:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(234,88,12,0.4);
    }

    .pdf-btn-close {
      background: rgba(255,255,255,0.08);
      color: #aaa;
      border: 1px solid rgba(255,255,255,0.1);
    }

    .pdf-btn-close:hover { color: #fff; }
  `;

  /* ─── Project data (sourced from visible DOM or hardcoded fallback) ─── */
  function scrapeProjects() {
    const projects = [];
    document.querySelectorAll('.projects .project-card, .projects [class*="project"]').forEach((card, i) => {
      if (i >= 4) return; // max 4 in PDF
      const name = card.querySelector('h3, h2, .project-title')?.textContent?.trim() || '';
      const desc = card.querySelector('p, .project-desc')?.textContent?.trim().slice(0, 120) || '';
      const tags = [...card.querySelectorAll('.tag, .tech-tag, [class*="tech"]')]
        .slice(0, 4)
        .map(t => t.textContent.trim())
        .filter(Boolean);
      if (name) projects.push({ name, desc, tags });
    });

    if (projects.length === 0) {
      // Fallback: hardcoded from known portfolio content
      return [
        { name: 'OCTA Receipt System', desc: 'PWA app for managing coconut/produce buying transactions with Bluetooth ESC/POS thermal printing.', tags: ['PWA', 'JavaScript', 'BLE', 'ESC/POS'] },
        { name: 'JVOR DEV Portfolio', desc: 'Personal developer portfolio with dark luxury aesthetic, animations, AI features, and offline support.', tags: ['HTML', 'CSS', 'JavaScript', 'PWA'] },
        { name: 'E-Commerce Platform', desc: 'Full-featured online store with product catalog, cart, checkout, and admin dashboard.', tags: ['Web App', 'UI/UX', 'JavaScript'] },
        { name: 'Landing Page Design', desc: 'High-converting landing pages with modern design, animations, and mobile-first responsive layouts.', tags: ['HTML', 'CSS', 'Design'] },
      ];
    }

    return projects;
  }

  /* ─── Build PDF document HTML ─── */
  function buildPDFDocument() {
    const projects = scrapeProjects();

    const projectsHTML = projects.map(p => `
      <div class="pdf-project">
        <div class="pdf-project-name">${p.name}</div>
        ${p.desc ? `<div class="pdf-project-desc">${p.desc}</div>` : ''}
        ${p.tags.length ? `<div class="pdf-project-tags">${p.tags.map(t => `<span class="pdf-project-tag">${t}</span>`).join('')}</div>` : ''}
      </div>
    `).join('');

    const skills = [
      'HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React',
      'Node.js', 'PHP', 'MySQL', 'Figma', 'Git', 'PWA',
      'Tailwind CSS', 'REST API', 'UI/UX Design', 'Video Editing',
    ];

    const services = [
      'Web Development', 'UI/UX Design', 'Landing Page Design',
      'E-Commerce Development', 'PWA / Web App', 'Video Editing',
      'Responsive Design', 'SEO Setup', 'Technical Consultation', 'Figma Prototyping',
    ];

    const today = new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });

    return `
      <div id="jvor-pdf-doc">
        <!-- Action bar (only visible in preview, hidden in print) -->
        <div id="pdf-action-bar">
          <span class="pdf-action-label"><strong>📄 Portfolio PDF Preview</strong> — Ready to print or save</span>
          <div class="pdf-action-btns">
            <button class="pdf-btn pdf-btn-close" id="pdf-close-preview">✕ Close</button>
            <button class="pdf-btn pdf-btn-print" id="pdf-print-btn">🖨️ Save as PDF</button>
          </div>
        </div>

        <!-- Page 1 -->
        <div class="pdf-sheet">
          <div class="pdf-top-stripe"></div>

          <!-- Header -->
          <div class="pdf-header">
            <img src="imgae/01.jpg" alt="JVOR" class="pdf-avatar" onerror="this.style.display='none'">
            <div>
              <h1 class="pdf-name">Jose Jr. Villalon Octa</h1>
              <div class="pdf-role">Full Stack Developer · UI/UX Designer · JVOR DEV</div>
              <div class="pdf-contact-row">
                <span>📧 <a href="mailto:jvrocta@gmail.com">jvrocta@gmail.com</a></span>
                <span>📍 Capalonga, Camarines Norte, PH</span>
                <span>🌐 <a href="https://github.com/JVOR3">github.com/JVOR3</a></span>
                <span>💬 Available for Freelance</span>
              </div>
            </div>
          </div>

          <!-- About -->
          <div class="pdf-section">
            <div class="pdf-section-title">About Me</div>
            <p class="pdf-bio">
              Passionate Full Stack Developer and UI/UX Designer based in Capalonga, Camarines Norte, Philippines.
              Currently pursuing BS Information Technology at ACLC College of Daet. I build high-performance,
              visually polished web applications with a strong focus on user experience, clean code, and modern design.
              Available for freelance projects and full-time opportunities.
            </p>
          </div>

          <!-- Skills -->
          <div class="pdf-section">
            <div class="pdf-section-title">Technical Skills</div>
            <div class="pdf-skills-grid">
              ${skills.map(s => `<span class="pdf-skill-tag">${s}</span>`).join('')}
            </div>
          </div>

          <!-- Services -->
          <div class="pdf-section">
            <div class="pdf-section-title">Services</div>
            <div class="pdf-services-grid">
              ${services.map(s => `
                <div class="pdf-service-item">
                  <span class="pdf-service-dot"></span>
                  <span>${s}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="pdf-page-break"></div>

          <!-- Projects -->
          <div class="pdf-section">
            <div class="pdf-section-title">Featured Projects</div>
            ${projectsHTML}
          </div>

          <!-- Education & Experience -->
          <div class="pdf-section">
            <div class="pdf-section-title">Education</div>
            <div style="font-size:0.82rem; color:#333;">
              <strong>BS Information Technology</strong> — ACLC College of Daet, Camarines Norte<br>
              <span style="color:#888; font-size:0.72rem;">Currently Enrolled · 2022–Present</span>
            </div>
          </div>

          <!-- Footer -->
          <div class="pdf-footer">
            <span>Generated: ${today}</span>
            <span class="pdf-footer-brand">JVOR DEV — Jose Jr. Villalon Octa</span>
            <span>jvrocta@gmail.com</span>
          </div>
        </div>
      </div>
    `;
  }

  /* ─── Inject download button ─── */
  function injectDownloadButton() {
    if (document.getElementById('pdf-download-trigger')) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'pdf-download-trigger';
    // Same class as Download CV — inherits all hero button CSS automatically
    btn.className = 'btn btn-download';
    btn.innerHTML = `Download Portfolio PDF <i class='bx bxs-file-pdf'></i>`;

    // Style: black bg + orange border (matches last hero button pattern)
    const styleDefault = [
      'background-color:black!important',
      'color:var(--main-color,#ea580c)!important',
      'border:2px solid var(--main-color,#ea580c)!important',
      'box-shadow:0 0 25px transparent!important',
      'transform:scale(1)!important',
    ].join(';');

    const styleHover = [
      'background-color:var(--main-color,#ea580c)!important',
      'color:black!important',
      'border:2px solid var(--main-color,#ea580c)!important',
      'box-shadow:0 0 25px var(--main-color,#ea580c),0 0 50px var(--main-color,#ea580c)!important',
      'transform:scale(1.05)!important',
    ].join(';');

    btn.style.cssText = styleDefault;
    btn.addEventListener('mouseenter', () => { btn.style.cssText = styleHover; });
    btn.addEventListener('mouseleave', () => { btn.style.cssText = styleDefault; });
    btn.addEventListener('click', openPDFPreview);

    // Insert inside .btn-group right after the Download CV button
    const btnGroup = document.querySelector('.btn-group');
    const cvBtn    = document.querySelector('.btn-download, a[download]');

    if (btnGroup && cvBtn) {
      cvBtn.insertAdjacentElement('afterend', btn);
    } else if (btnGroup) {
      btnGroup.appendChild(btn);
    } else if (cvBtn) {
      cvBtn.insertAdjacentElement('afterend', btn);
    } else {
      document.body.appendChild(btn);
    }
  }

  /* ─── Open preview ─── */
  function openPDFPreview() {
    // Inject styles once
    if (!document.getElementById('jvor-pdf-styles')) {
      const style = document.createElement('style');
      style.id = 'jvor-pdf-styles';
      style.textContent = PDF_STYLES;
      document.head.appendChild(style);
    }

    // Inject PDF doc once
    let doc = document.getElementById('jvor-pdf-doc');
    if (!doc) {
      document.body.insertAdjacentHTML('beforeend', buildPDFDocument());
      doc = document.getElementById('jvor-pdf-doc');

      // Wire buttons
      document.getElementById('pdf-close-preview')?.addEventListener('click', closePDFPreview);
      document.getElementById('pdf-print-btn')?.addEventListener('click', () => {
        window.print();
      });
    }

    doc.classList.add('pdf-preview-open');
    document.body.style.overflow = 'hidden';
  }

  function closePDFPreview() {
    const doc = document.getElementById('jvor-pdf-doc');
    if (doc) doc.classList.remove('pdf-preview-open');
    document.body.style.overflow = '';
  }

  /* ─── Keyboard escape ─── */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closePDFPreview();
  });

  /* ─── Init ─── */
  function init() {
    injectDownloadButton();
    console.log('✅ JVOR PDF Generator loaded');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();