/* ═══════════════════════════════════════════════════════════════════
   UPGRADE 6 — BOOK-CALL.JS v3 — JVOR DEV PORTFOLIO
   ✅ Uses its OWN separate EmailJS keys (independent from contact form)
   ✅ Professional button design inside contact section
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     📌 BOOK-A-CALL — SEPARATE EMAILJS CREDENTIALS
     I-update ang tatlong values below gamit ang bagong keys
     na gawa mo sa EmailJS dashboard (hiwalay sa contact form):
       1. emailjs.com → Email Services → "Add New Service"
       2. emailjs.com → Email Templates → "Create New Template"
          Template fields: from_name, from_email, subject, message
       3. Account → API Keys → iyong Public Key
  ══════════════════════════════════════════════════════════ */
  const BCM_PUBLIC_KEY  = '_gHT9V4PLtdDkYzou';   // ← palitan
  const BCM_SERVICE_ID  = 'service_dialzrv';   // ← e.g. 'service_abc123'
  const BCM_TEMPLATE_ID = 'template_lsr4mx9';  // ← e.g. 'template_abc123'

  const TIME_SLOTS = [
    { id: 'mon-am', day: 'Mon', time: '9:00 AM',  available: true },
    { id: 'mon-pm', day: 'Mon', time: '2:00 PM',  available: true },
    { id: 'tue-am', day: 'Tue', time: '9:00 AM',  available: true },
    { id: 'tue-pm', day: 'Tue', time: '3:00 PM',  available: true },
    { id: 'wed-am', day: 'Wed', time: '10:00 AM', available: true },
    { id: 'wed-pm', day: 'Wed', time: '2:00 PM',  available: false },
    { id: 'thu-am', day: 'Thu', time: '9:00 AM',  available: true },
    { id: 'thu-pm', day: 'Thu', time: '3:00 PM',  available: true },
    { id: 'fri-am', day: 'Fri', time: '10:00 AM', available: true },
    { id: 'fri-pm', day: 'Fri', time: '1:00 PM',  available: true },
    { id: 'sat-am', day: 'Sat', time: '10:00 AM', available: true },
    { id: 'sat-pm', day: 'Sat', time: '2:00 PM',  available: false },
  ];

  let selectedSlot = null;

  /* ── Hidden form for EmailJS ── */
  function createHiddenForm() {
    if (document.getElementById('bcm-hidden-form')) return;
    const f = document.createElement('form');
    f.id = 'bcm-hidden-form';
    f.style.display = 'none';
    f.innerHTML = `
      <input name="from_name"  id="bcm-hf-name">
      <input name="from_email" id="bcm-hf-email">
      <input name="subject"    id="bcm-hf-subject">
      <textarea name="message" id="bcm-hf-message"></textarea>
    `;
    document.body.appendChild(f);
  }

  /* ── Modal HTML ── */
  function buildModal() {
    const modal = document.createElement('div');
    modal.id = 'book-call-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Book a Free Call');

    const slotsHTML = TIME_SLOTS.map(s => `
      <button type="button"
        class="bcm-time-slot${s.available ? '' : ' bcm-slot-booked'}"
        data-label="${s.day} ${s.time}"
        ${s.available ? '' : 'disabled aria-disabled="true"'}
      >
        <span class="bcm-slot-day">${s.day}</span>
        <span class="bcm-slot-time">${s.time}</span>
      </button>
    `).join('');

    modal.innerHTML = `
      <div class="bcm-card">
        <button class="bcm-close" id="bcm-close-btn" aria-label="Close">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M1 1L10 10M10 1L1 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>

        <div id="bcm-form-view">
          <div class="bcm-header">
            <div class="bcm-eyebrow">
              <span class="bcm-eyebrow-dot"></span>Free Consultation
            </div>
            <h3 class="bcm-title">Book a <span>30-min</span> Call</h3>
            <p class="bcm-subtitle">Pick a slot · PHT (UTC+8) · No commitment needed</p>
          </div>

          <div class="bcm-step-label">
            <span class="bcm-step-num">01</span> Choose a time slot
          </div>
          <div class="bcm-time-grid">${slotsHTML}</div>

          <div id="bcm-details-wrap" class="bcm-details-wrap">
            <div class="bcm-step-label" style="margin-top:1.5rem">
              <span class="bcm-step-num">02</span>
              <span>Your details</span>
              <span class="bcm-selected-pill" id="bcm-selected-pill" style="display:none"></span>
            </div>

            <div class="bcm-field-row">
              <div class="bcm-field-group">
                <label for="bcm-name">Full Name <em>*</em></label>
                <input type="text" id="bcm-name" placeholder="Juan Dela Cruz" autocomplete="name">
              </div>
              <div class="bcm-field-group">
                <label for="bcm-email">Email <em>*</em></label>
                <input type="email" id="bcm-email" placeholder="juan@email.com" autocomplete="email">
              </div>
            </div>

            <div class="bcm-field-group" style="margin-top:.75rem">
              <label for="bcm-topic">Topic</label>
              <div class="bcm-select-wrap">
                <select id="bcm-topic">
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Web Development Project">Web Development Project</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Project Pricing / Budget">Project Pricing / Budget</option>
                  <option value="Freelance Collaboration">Freelance Collaboration</option>
                  <option value="Technical Consultation">Technical Consultation</option>
                </select>
                <svg class="bcm-sel-arrow" width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1 3L5 7L9 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                </svg>
              </div>
            </div>

            <div class="bcm-field-group" style="margin-top:.75rem">
              <label for="bcm-notes">Notes <span style="color:#555;font-weight:400">(optional)</span></label>
              <textarea id="bcm-notes" rows="3" placeholder="Brief info about your project o tanong…"></textarea>
            </div>

            <button type="button" class="bcm-submit" id="bcm-submit-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"/></svg>
              <span id="bcm-btn-text">Confirm Booking</span>
            </button>
          </div>
        </div>

        <!-- SUCCESS -->
        <div id="bcm-success-view" style="display:none">
          <div class="bcm-success">
            <div class="bcm-success-ring">
              <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle class="bcm-ring-circle" cx="26" cy="26" r="23" stroke="#ea580c" stroke-width="2"/>
                <path class="bcm-check-draw" d="M14 26L22 34L38 18" stroke="#ea580c" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="bcm-success-title">Booking Confirmed!</h3>
            <p class="bcm-success-desc" id="bcm-success-desc"></p>
            <div class="bcm-success-slot-chip" id="bcm-success-chip"></div>
            <button type="button" class="bcm-success-btn" id="bcm-success-close">Done</button>
          </div>
        </div>
      </div>
    `;
    return modal;
  }

  /* ── Wire events ── */
  function wireModal() {
    document.getElementById('bcm-close-btn').addEventListener('click', closeModal);
    document.getElementById('bcm-success-close')?.addEventListener('click', closeModal);
    document.getElementById('book-call-modal').addEventListener('click', e => {
      if (e.target.id === 'book-call-modal') closeModal();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    const details = document.getElementById('bcm-details-wrap');
    if (details) details.classList.remove('bcm-details-visible');

    document.querySelectorAll('.bcm-time-slot:not(.bcm-slot-booked)').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.bcm-time-slot').forEach(b => b.classList.remove('bcm-slot-selected'));
        btn.classList.add('bcm-slot-selected');
        selectedSlot = btn.dataset.label;

        const pill = document.getElementById('bcm-selected-pill');
        if (pill) { pill.textContent = `📅 ${selectedSlot} PHT`; pill.style.display = 'inline-flex'; }

        const det = document.getElementById('bcm-details-wrap');
        if (det) {
          det.classList.add('bcm-details-visible');
          setTimeout(() => det.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
        }
      });
    });

    document.getElementById('bcm-submit-btn').addEventListener('click', handleBooking);
  }

  /* ── Open / Close ── */
  function openModal() {
    const modal = document.getElementById('book-call-modal');
    if (!modal) return;
    selectedSlot = null;
    document.getElementById('bcm-form-view').style.display = '';
    document.getElementById('bcm-success-view').style.display = 'none';
    document.querySelectorAll('.bcm-time-slot').forEach(b => b.classList.remove('bcm-slot-selected'));
    const details = document.getElementById('bcm-details-wrap');
    if (details) details.classList.remove('bcm-details-visible');
    const pill = document.getElementById('bcm-selected-pill');
    if (pill) pill.style.display = 'none';
    const btn = document.getElementById('bcm-submit-btn');
    if (btn) { btn.disabled = false; document.getElementById('bcm-btn-text').textContent = 'Confirm Booking'; }
    modal.classList.add('bcm-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    const modal = document.getElementById('book-call-modal');
    if (!modal) return;
    modal.classList.remove('bcm-open');
    setTimeout(() => { document.body.style.overflow = ''; }, 300);
  }

  /* ── Submit — uses Book-a-Call's own keys ── */
  async function handleBooking() {
    const name   = document.getElementById('bcm-name')?.value.trim();
    const email  = document.getElementById('bcm-email')?.value.trim();
    const topic  = document.getElementById('bcm-topic')?.value || 'General Inquiry';
    const notes  = document.getElementById('bcm-notes')?.value.trim() || '—';
    const btn    = document.getElementById('bcm-submit-btn');
    const btnTxt = document.getElementById('bcm-btn-text');

    if (!name)  { pulseError('bcm-name'); return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { pulseError('bcm-email'); return; }
    if (!selectedSlot) { alert('Please choose a time slot first.'); return; }

    btn.disabled = true;
    btnTxt.textContent = 'Sending…';

    const body = [
      '📅 NEW CALL BOOKING — JVOR DEV Portfolio',
      '',
      `Name  : ${name}`,
      `Email : ${email}`,
      `Slot  : ${selectedSlot} PHT`,
      `Topic : ${topic}`,
      `Notes : ${notes}`,
      '',
      '— Booked via JVOR DEV Portfolio Book-a-Call widget',
    ].join('\n');

    try {
      /* emailjs.send() with explicit publicKey so it's fully independent */
      await window.emailjs.send(
        BCM_SERVICE_ID,
        BCM_TEMPLATE_ID,
        {
          from_name:  name,
          from_email: email,
          subject:    `📅 Booking: ${selectedSlot} — ${topic}`,
          message:    body,
        },
        BCM_PUBLIC_KEY
      );

      document.getElementById('bcm-form-view').style.display = 'none';
      document.getElementById('bcm-success-view').style.display = 'block';
      document.getElementById('bcm-success-desc').textContent =
        `Hi ${name}! Magrereply si JVOR sa ${email} para i-confirm ang iyong call. Salamat! 🙏`;
      document.getElementById('bcm-success-chip').textContent = `📅 ${selectedSlot} PHT`;

      setTimeout(closeModal, 7000);

    } catch (err) {
      console.error('[Book-a-Call] EmailJS error:', err);
      btn.disabled = false;
      btnTxt.textContent = 'Try Again';
      alert(`Hindi ma-send. Siguraduhing tama ang BCM_PUBLIC_KEY, BCM_SERVICE_ID, at BCM_TEMPLATE_ID sa upgrade-6-book-call.js.\n\nPwede rin mag-email: jvrocta@gmail.com`);
    }
  }

  function pulseError(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.borderColor = '#ef4444';
    el.style.animation = 'bcmShake 0.35s ease';
    el.focus();
    setTimeout(() => { el.style.animation = ''; }, 400);
    el.addEventListener('input', () => { el.style.borderColor = ''; }, { once: true });
  }

  /* ── Inject professional button in contact section ── */
  function injectTriggerButton() {
    if (document.getElementById('book-call-open-btn')) return;
    const chips = document.querySelector('.ct-services-chips');
    if (!chips) return;

    const wrap = document.createElement('div');
    wrap.className = 'bcm-trigger-wrap';
    wrap.innerHTML = `
      <p class="bcm-trigger-label">Or prefer a quick chat?</p>
      <button type="button" class="bcm-trigger-btn" id="book-call-open-btn" aria-haspopup="dialog">
        <div class="bcm-trigger-icon-wrap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.95 12 19.79 19.79 0 01.88 3.38 2 2 0 012.88 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
          </svg>
        </div>
        <div class="bcm-trigger-content">
          <span class="bcm-trigger-title">Book a Free Call</span>
          <span class="bcm-trigger-sub">30 min · PHT timezone · No commitment</span>
        </div>
        <div class="bcm-trigger-chevron" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </div>
      </button>
    `;

    chips.insertAdjacentElement('afterend', wrap);
    document.getElementById('book-call-open-btn').addEventListener('click', openModal);
  }

  /* ── Load EmailJS for Book-a-Call ── */
  function init() {
    createHiddenForm();
    injectTriggerButton();

    const modal = buildModal();
    document.body.appendChild(modal);
    wireModal();

    function tryInit() {
      if (!window.emailjs) { setTimeout(tryInit, 250); return; }
      console.log('✅ JVOR Book-a-Call v3 ready · Separate EmailJS credentials');
    }

    // Load EmailJS if not yet loaded
    if (!window.emailjs && !window.__ejsLoaded) {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
      s.onload = () => {
        console.log('✅ [Book-a-Call] EmailJS SDK loaded independently');
      };
      document.head.appendChild(s);
    }
    tryInit();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
