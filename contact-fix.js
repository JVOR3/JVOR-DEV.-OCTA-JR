/* ═══════════════════════════════════════════════════════
   CONTACT-FIX.JS — JVOR DEV PORTFOLIO
   Single, clean EmailJS contact form handler.
   Replaces the 3 conflicting handlers inside script.js.

   HOW IT WORKS:
   - Sets form.dataset.contactReady = '1' BEFORE loading EmailJS
     so that the duplicate guards inside script.js skip themselves.
   - Loads the EmailJS SDK exactly ONCE.
   - Attaches exactly ONE submit listener.
═══════════════════════════════════════════════════════ */
(function () {
    'use strict';

    /* ── CONFIG — i-update dito kung magpapalit ng EmailJS account ── */
    const EMAILJS_PUBLIC_KEY = '_gHT9V4PLtdDkYzou';
    const EMAILJS_SERVICE_ID = 'service_4cbkcme';      // ← primary service
    const EMAILJS_TEMPLATE_ID = 'template_jb92mdt';     // ← primary template

    /* ── Helpers ── */
    function $(id) { return document.getElementById(id); }
    function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

    function setField(el, valid) {
        const g = el && el.closest('.ct-form-group');
        if (!g) return;
        g.classList.toggle('has-error', !valid);
        g.classList.toggle('is-valid', valid);
        const err = g.querySelector('.ct-field-error');
        if (err) err.classList.toggle('visible', !valid);
    }

    function setBtn(submitBtn, state) {
        const d = submitBtn && submitBtn.querySelector('.ct-submit-default');
        const s = submitBtn && submitBtn.querySelector('.ct-submit-sending');
        const dn = submitBtn && submitBtn.querySelector('.ct-submit-done');
        if (!d) return;
        d.style.display = state === 'default' ? 'flex' : 'none';
        if (s) s.style.display = state === 'sending' ? 'flex' : 'none';
        if (dn) dn.style.display = state === 'done' ? 'flex' : 'none';
    }

    function showToast(success) {
        const t = $(success ? 'ct-success-toast' : 'ct-error-toast');
        if (!t) return;
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 5000);
    }

    function validate(fields) {
        let ok = true;
        const n = fields.name;
        const em = fields.email;
        const s = fields.subject;
        const m = fields.message;
        if (!n.value.trim()) { setField(n, false); ok = false; } else setField(n, true);
        if (!isEmail(em.value)) { setField(em, false); ok = false; } else setField(em, true);
        if (!s.value.trim()) { setField(s, false); ok = false; } else setField(s, true);
        if (!m.value.trim()) { setField(m, false); ok = false; } else setField(m, true);
        return ok;
    }

    /* ── Main init ── */
    function init() {
        const form = $('contactForm');
        const submitBtn = $('submitBtn');
        if (!form) return;

        /* Mark form NOW so duplicate handlers in script.js bail out */
        form.dataset.contactFixed = '1';
        form.dataset.v5Fixed = '1';
        form.dataset.contactReady = '1';

        const fields = {
            name: $('cf-name'),
            email: $('cf-email'),
            subject: $('cf-subject'),
            message: $('cf-message'),
        };

        /* ── Live validation ── */
        Object.entries(fields).forEach(([key, el]) => {
            if (!el) return;
            el.addEventListener('input', () => {
                const valid = key === 'email' ? isEmail(el.value) : !!el.value.trim();
                setField(el, valid);
            });
        });

        /* ── Char counter ── */
        const ccEl = $('ctCharCount');
        fields.message && fields.message.addEventListener('input', () => {
            const len = fields.message.value.length;
            if (ccEl) {
                ccEl.textContent = len;
                ccEl.style.color = len > 900 ? '#ef4444' : len > 700 ? '#f59e0b' : '';
            }
            if (len > 1000) fields.message.value = fields.message.value.slice(0, 1000);
        });

        /* ── Quick-select buttons ── */
        document.querySelectorAll('.ct-qs-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.ct-qs-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                if (fields.subject) {
                    fields.subject.value = btn.dataset.subject || '';
                    setField(fields.subject, !!fields.subject.value.trim());
                    fields.subject.focus();
                }
            });
        });

        /* ── Copy-email buttons ── */
        document.querySelectorAll('.ct-copy-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const text = btn.dataset.copy || 'jvrocta@gmail.com';
                try {
                    await navigator.clipboard.writeText(text);
                } catch {
                    const ta = document.createElement('textarea');
                    ta.value = text;
                    ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
                    document.body.appendChild(ta);
                    ta.select();
                    document.execCommand('copy');
                    ta.remove();
                }
                const icon = btn.querySelector('i');
                const orig = icon && icon.className;
                if (icon) icon.className = 'bx bx-check';
                btn.title = 'Copied!';
                setTimeout(() => { if (icon && orig) icon.className = orig; btn.title = 'Copy email'; }, 2000);
            });
        });

        /* ── Toast close buttons ── */
        $('ctToastClose') && $('ctToastClose').addEventListener('click', () => $('ct-success-toast') && $('ct-success-toast').classList.remove('show'));
        $('ctErrToastClose') && $('ctErrToastClose').addEventListener('click', () => $('ct-error-toast') && $('ct-error-toast').classList.remove('show'));

        /* ── Load EmailJS SDK (once) ── */
        if (window.__ejsLoaded) {
            attachSubmit(form, submitBtn, fields, ccEl);
            return;
        }
        window.__ejsLoaded = true;

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
        script.onload = () => {
            window.emailjs.init(EMAILJS_PUBLIC_KEY);
            console.log('✅ EmailJS initialized — contact-fix.js');
            attachSubmit(form, submitBtn, fields, ccEl);
        };
        script.onerror = () => {
            console.error('❌ Hindi ma-load ang EmailJS SDK. Check internet connection.');
        };
        document.head.appendChild(script);
    }

    function attachSubmit(form, submitBtn, fields, ccEl) {
        /* Guard: attach ONCE */
        if (form.dataset.submitAttached) return;
        form.dataset.submitAttached = '1';

        form.addEventListener('submit', async function handleSubmit(e) {
            e.preventDefault();
            e.stopImmediatePropagation();

            /* Honeypot — spam bots fill this hidden field */
            if (form.querySelector('[name="ct_honeypot"]') &&
                form.querySelector('[name="ct_honeypot"]').value) return;

            /* Validation */
            if (!validate(fields)) return;

            /* UI: sending state */
            setBtn(submitBtn, 'sending');
            if (submitBtn) submitBtn.disabled = true;

            try {
                await window.emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);

                /* ── SUCCESS ── */
                showToast(true);
                form.reset();
                if (ccEl) ccEl.textContent = '0';
                document.querySelectorAll('.ct-qs-btn').forEach(b => b.classList.remove('active'));
                Object.values(fields).forEach(el => {
                    el && el.closest('.ct-form-group') &&
                        el.closest('.ct-form-group').classList.remove('is-valid', 'has-error');
                });
                setBtn(submitBtn, 'done');
                setTimeout(() => setBtn(submitBtn, 'default'), 4000);

            } catch (err) {
                /* ── ERROR ── */
                console.error('EmailJS send error:', err);
                showToast(false);
                setBtn(submitBtn, 'default');
            } finally {
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }

    /* Run after DOM is ready */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();