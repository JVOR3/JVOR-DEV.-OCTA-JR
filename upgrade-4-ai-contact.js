/* ═══════════════════════════════════════════════════════════════════
   UPGRADE 4 — AI-CONTACT.JS — JVOR DEV PORTFOLIO
   Smart AI suggestions on the contact form, powered by Claude API.
   
   HOW IT WORKS:
   - After user types 3+ words in the message field, triggers Claude
   - Suggests: subject line, project type, relevant services
   - One-click apply fills the fields
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ─── CONFIG ─── */
  const DEBOUNCE_MS = 1200; // wait 1.2s after user stops typing
  const MIN_WORDS = 3;      // minimum words before AI triggers

  let debounceTimer = null;
  let lastPromptText = '';
  let panelVisible = false;

  /* ─── Services JVOR offers (for AI context) ─── */
  const JVOR_SERVICES = `
- Web Development (Frontend, Fullstack)
- UI/UX Design & Prototyping (Figma)
- Video Editing & Motion Graphics
- Landing Page Design
- Responsive / Mobile-first websites
- Portfolio Websites
- E-commerce Development
- PWA / Web App Development
- Logo & Branding Design
- Technical Consultation
  `.trim();

  /* ─── Create panel in DOM ─── */
  function createPanel() {
    const panel = document.createElement('div');
    panel.id = 'ai-suggestion-panel';
    panel.innerHTML = `
      <div class="ai-panel-header">
        <div class="ai-panel-header-icon">✦</div>
        <span class="ai-panel-header-title">AI Suggestions</span>
        <button class="ai-panel-close" id="ai-panel-close-btn" aria-label="Close AI panel">✕</button>
      </div>
      <div id="ai-suggestions-body">
        <div class="ai-loading-row">
          <div class="ai-loading-dots">
            <span></span><span></span><span></span>
          </div>
          <span class="ai-loading-text">Analyzing your message…</span>
        </div>
      </div>
    `;
    return panel;
  }

  /* ─── Insert badge + panel after the message field ─── */
  function injectAIPanel() {
    const msgGroup = document.getElementById('cf-message');
    if (!msgGroup) return null;

    const formGroup = msgGroup.closest('.ct-form-group');
    if (!formGroup) return null;

    // Add AI badge inside label
    const label = formGroup.querySelector('label');
    if (label && !label.querySelector('.ct-ai-badge')) {
      const badge = document.createElement('span');
      badge.className = 'ct-ai-badge';
      badge.textContent = 'AI Powered';
      label.appendChild(badge);
    }

    // Insert panel after form group
    const existingPanel = document.getElementById('ai-suggestion-panel');
    if (existingPanel) return existingPanel;

    const panel = createPanel();
    formGroup.insertAdjacentElement('afterend', panel);

    // Close button
    document.getElementById('ai-panel-close-btn')?.addEventListener('click', () => {
      hidePanel();
    });

    return panel;
  }

  function showPanel() {
    const panel = document.getElementById('ai-suggestion-panel');
    if (panel) {
      panel.classList.add('ai-visible');
      panelVisible = true;
    }
  }

  function hidePanel() {
    const panel = document.getElementById('ai-suggestion-panel');
    if (panel) {
      panel.classList.remove('ai-visible');
      panelVisible = false;
    }
  }

  function setLoading() {
    const body = document.getElementById('ai-suggestions-body');
    if (body) {
      body.innerHTML = `
        <div class="ai-loading-row">
          <div class="ai-loading-dots">
            <span></span><span></span><span></span>
          </div>
          <span class="ai-loading-text">Analyzing your message…</span>
        </div>
      `;
    }
  }

  /* ─── Render suggestions ─── */
  function renderSuggestions(data) {
    const body = document.getElementById('ai-suggestions-body');
    if (!body) return;

    const items = [];

    if (data.subject) {
      items.push({
        icon: '🏷️',
        text: data.subject,
        label: 'Suggested subject',
        action: () => applySubject(data.subject),
      });
    }

    if (data.projectType) {
      items.push({
        icon: '📁',
        text: data.projectType,
        label: 'Project type detected',
        action: () => applyQuickSelect(data.projectType),
      });
    }

    if (data.tip) {
      items.push({
        icon: '💡',
        text: data.tip,
        label: 'Helpful suggestion',
        action: null,
      });
    }

    if (items.length === 0) {
      hidePanel();
      return;
    }

    body.innerHTML = `<div class="ai-suggestions-list"></div>`;
    const list = body.querySelector('.ai-suggestions-list');

    items.forEach(item => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'ai-suggestion-item';
      el.innerHTML = `
        <span class="ai-sug-icon">${item.icon}</span>
        <span class="ai-sug-text">
          ${item.text}
          <span class="ai-sug-label">${item.label}${item.action ? ' · click to apply' : ''}</span>
        </span>
      `;
      if (item.action) {
        el.addEventListener('click', () => {
          item.action();
          el.style.opacity = '0.5';
          el.style.pointerEvents = 'none';
        });
      } else {
        el.style.cursor = 'default';
      }
      list.appendChild(el);
    });
  }

  /* ─── Apply suggestions to form ─── */
  function applySubject(text) {
    const subjectInput = document.getElementById('cf-subject');
    if (!subjectInput) return;
    subjectInput.value = text;
    subjectInput.closest('.ct-form-group')?.classList.add('is-valid');
    subjectInput.closest('.ct-form-group')?.classList.remove('has-error');

    // Flash animation
    const shell = subjectInput.closest('.ct-input-shell');
    if (shell) {
      shell.classList.add('ai-applied');
      setTimeout(() => shell.classList.remove('ai-applied'), 500);
    }
    subjectInput.focus();
  }

  function applyQuickSelect(projectTypeName) {
    // Try to match quick-select buttons
    const btns = document.querySelectorAll('.ct-qs-btn');
    let matched = false;
    btns.forEach(btn => {
      if (btn.dataset.subject?.toLowerCase().includes(projectTypeName?.toLowerCase().split(' ')[0])) {
        btn.click();
        matched = true;
      }
    });
    if (!matched && projectTypeName) {
      applySubject(projectTypeName);
    }
  }

  /* ─── Claude API call ─── */
  async function fetchAISuggestions(messageText) {
    const prompt = `You are an assistant for JVOR DEV, a Filipino web developer's portfolio website.
A potential client has started typing this message in the contact form:

"${messageText}"

JVOR's services:
${JVOR_SERVICES}

Based on the message, respond ONLY with a JSON object (no markdown, no extra text):
{
  "subject": "<a clear, professional email subject line, max 8 words>",
  "projectType": "<one of: Web Development Project, UI/UX Design Project, Video Editing Project, General Collaboration, General Inquiry>",
  "tip": "<one short helpful tip for the client, max 15 words, in English or Taglish>"
}

If the message is too vague or less than 3 words, return {"subject":"","projectType":"","tip":""}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();

    const rawText = data.content?.map(b => b.text || '').join('') || '';
    // Strip any markdown fences just in case
    const clean = rawText.replace(/```json|```/gi, '').trim();
    return JSON.parse(clean);
  }

  /* ─── Main trigger ─── */
  function onMessageInput(e) {
    const text = e.target.value.trim();
    const wordCount = text.split(/\s+/).filter(Boolean).length;

    // Don't re-trigger if same text
    if (text === lastPromptText) return;

    clearTimeout(debounceTimer);

    if (wordCount < MIN_WORDS) {
      hidePanel();
      return;
    }

    // Show loading panel immediately
    showPanel();
    setLoading();

    debounceTimer = setTimeout(async () => {
      lastPromptText = text;
      try {
        const suggestions = await fetchAISuggestions(text);
        // Only render if user hasn't cleared the field
        const currentText = document.getElementById('cf-message')?.value.trim() || '';
        if (currentText.split(/\s+/).filter(Boolean).length >= MIN_WORDS) {
          renderSuggestions(suggestions);
        } else {
          hidePanel();
        }
      } catch (err) {
        console.warn('[AI Contact] Suggestion error:', err);
        hidePanel();
      }
    }, DEBOUNCE_MS);
  }

  /* ─── Init ─── */
  function init() {
    injectAIPanel();

    const msgField = document.getElementById('cf-message');
    if (!msgField) return;

    msgField.addEventListener('input', onMessageInput);

    // Hide panel when form is submitted/reset
    const form = document.getElementById('contactForm');
    if (form) {
      form.addEventListener('submit', () => {
        hidePanel();
        lastPromptText = '';
      });
      form.addEventListener('reset', () => {
        hidePanel();
        lastPromptText = '';
      });
    }

    console.log('✅ JVOR AI Contact: Smart suggestions loaded');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
