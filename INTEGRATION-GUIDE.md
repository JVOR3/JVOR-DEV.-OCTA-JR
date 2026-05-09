# JVOR DEV PORTFOLIO — 7 UPGRADES INTEGRATION GUIDE

Lahat ng files ay drop-in. Sundin lang ang order ng instructions below.

---

## 📁 FILES TO COPY INTO YOUR PORTFOLIO FOLDER

```
upgrade-1-2-transitions.css
upgrade-1-2-transitions.js
upgrade-3-pwa.css
upgrade-3-pwa.js
upgrade-4-ai-contact.css
upgrade-4-ai-contact.js
upgrade-5-estimator.css
upgrade-5-estimator.js
upgrade-6-book-call.css
upgrade-6-book-call.js
upgrade-7-pdf.js
manifest.json
service-worker.js
offline.html
```

---

## 📝 CHANGES SA `index.html` / `porpoliookayko.html`

### 1. Sa `<head>` — Add manifest link + new CSS files

I-paste ang mga ito **bago mag-close `</head>`** (after ng lahat ng existing CSS links):

```html
<!-- PWA Manifest -->
<link rel="manifest" href="manifest.json">

<!-- Upgrade CSS Files -->
<link rel="stylesheet" href="upgrade-1-2-transitions.css">
<link rel="stylesheet" href="upgrade-3-pwa.css">
<link rel="stylesheet" href="upgrade-4-ai-contact.css">
<link rel="stylesheet" href="upgrade-5-estimator.css">
<link rel="stylesheet" href="upgrade-6-book-call.css">
```

---

### 2. Sa dulo ng `<body>` — Add upgrade JS files

I-paste ang mga ito **bago mag-close `</body>`**,
**PAGKATAPOS** ng existing `<script src="contact-fix.js">`:

```html
<!-- ═══ JVOR UPGRADES ═══ -->
<!-- 1+2: Theme Ripple + Cinematic Section Transitions -->
<script src="upgrade-1-2-transitions.js"></script>

<!-- 3: PWA Install Prompt -->
<script src="upgrade-3-pwa.js"></script>

<!-- 4: AI-Powered Contact Form Suggestions -->
<script src="upgrade-4-ai-contact.js"></script>

<!-- 5: Project Budget Estimator (auto-injects new section) -->
<script src="upgrade-5-estimator.js"></script>

<!-- 6: Book a Call Widget (auto-injects button + modal) -->
<script src="upgrade-6-book-call.js"></script>

<!-- 7: Portfolio PDF Generator (auto-injects download button) -->
<script src="upgrade-7-pdf.js"></script>
```

---

### 3. Service Worker — siguraduhin na TAMA ang existing code

Sa dulo ng `index.html`, dapat may ganito (malamang meron na):

```html
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(reg => console.log('✅ SW registered'))
        .catch(err => console.warn('SW failed:', err));
    });
  }
</script>
```

**PALITAN** ang lumang `service-worker.js` mo ng bagong file na kasama sa upgrades.

---

## ⚙️ FEATURE-BY-FEATURE NOTES

### 🔴 Upgrade 1 — Theme Ripple (ZERO config)
Works agad. Naka-hook sa existing `.theme-toggle` button.

### 🟠 Upgrade 2 — Cinematic Section Transitions (ZERO config)
Works agad. Intercepts all `header a[href^="#"]` clicks automatically.

### 🟡 Upgrade 3 — PWA (ZERO config)
- `manifest.json` + `service-worker.js` + `offline.html` → copy sa root folder
- "Add to Home Screen" banner lalabas on Chrome/Android after 3s
- iOS Safari: may special tip toast

### 🟢 Upgrade 4 — AI Contact Form
- **Requires**: Claude API key sa environment (handled by claude.ai sandbox)
- Works sa live portfolio kapag may API key
- Suggestion panel lalabas habang nagta-type ang client (after 3 words, 1.2s debounce)

### 🔵 Upgrade 5 — Budget Estimator (ZERO config)
- Auto-injects sariling `<section>` between `#services` and `#projects`
- Presyo sa PHP — i-edit sa `upgrade-5-estimator.js` → `PROJECT_TYPES` array

### 🟣 Upgrade 6 — Book a Call
- Uses **same EmailJS** as `contact-fix.js` (same SERVICE_ID, TEMPLATE_ID)
- Button auto-injects after `.ct-services-chips` inside contact section
- **OPTIONAL**: Gumawa ng separate EmailJS template para sa bookings para mas clean ang email
- I-edit ang available time slots sa `upgrade-6-book-call.js` → `TIME_SLOTS` array

### ⚪ Upgrade 7 — PDF Generator (ZERO config)
- Download button auto-injects next to your existing CV download button
- Click → opens preview → "Save as PDF" button → browser print dialog
- Sa Chrome: piliin "Save as PDF" sa destination
- I-edit ang hardcoded info sa `upgrade-7-pdf.js` kung kailangan

---

## 🛠️ QUICK TROUBLESHOOTING

**Ripple hindi gumagana?**
→ Siguraduhing may class na `.theme-toggle` ang toggle button mo.

**Curtain transition hindi gumagana?**
→ Dapat `header a[href^="#"]` ang nav links. Check sa DevTools.

**PWA hindi nag-aappear?**
→ Kailangan ng HTTPS (localhost or live domain). 
→ Sa localhost: `chrome://flags/#unsafely-treat-insecure-origin-as-secure`

**AI suggestions hindi lumalabas?**
→ Normal lang on static hosting without API key.
→ For production: proxy ang API calls sa isang backend server.

**PDF blurred/broken images?**
→ Normal — base64 images lang ang 100% reliable sa PDF. 
→ Siguraduhing accessible ang `imgae/01.jpg`.

---

## 📞 JVOR DEV — Jose Jr. Villalon Octa
github.com/JVOR3 · jvrocta@gmail.com · Capalonga, Camarines Norte 🇵🇭
