/* ═══════════════════════════════════════════════════════════════════
   SERVICE-WORKER.JS — JVOR DEV PORTFOLIO PWA
   Offline support: caches all portfolio assets on install.
   ═══════════════════════════════════════════════════════════════════ */

const CACHE_NAME = 'jvor-portfolio-v1';

// Assets to cache on install — covers all your CSS/JS/images
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/style.css',
  '/redesign.css',
  '/enhancements.css',
  '/fixes.css',
  '/skills-redesign.css',
  '/script.js',
  '/fixes.js',
  '/enhancements.js',
  '/skills-redesign.js',
  '/testimonials-upgrade.js',
  '/contact-fix.js',
  // Upgrade files
  '/upgrade-1-2-transitions.css',
  '/upgrade-1-2-transitions.js',
  '/upgrade-4-ai-contact.css',
  '/upgrade-4-ai-contact.js',
  '/upgrade-5-estimator.css',
  '/upgrade-5-estimator.js',
  '/upgrade-6-book-call.css',
  '/upgrade-6-book-call.js',
  '/upgrade-7-pdf.js',
  // Key images
  '/imgae/01.jpg',
  // Offline fallback page
  '/offline.html',
];

/* ── INSTALL: pre-cache ── */
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cache what we can — ignore individual failures
      return Promise.allSettled(
        PRECACHE_URLS.map(url =>
          cache.add(url).catch(err =>
            console.warn(`[SW] Could not cache: ${url}`, err)
          )
        )
      );
    })
  );
});

/* ── ACTIVATE: clean old caches ── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

/* ── FETCH: cache-first for assets, network-first for pages ── */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // HTML pages: network-first (get fresh content, fallback to cache)
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then(res => {
          // Store fresh copy
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return res;
        })
        .catch(() =>
          caches.match(request).then(cached =>
            cached || caches.match('/offline.html')
          )
        )
    );
    return;
  }

  // Assets (CSS, JS, images): cache-first
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(res => {
        if (!res || res.status !== 200 || res.type !== 'basic') return res;
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        return res;
      });
    })
  );
});

/* ── MESSAGE: force update from client ── */
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') self.skipWaiting();
});
