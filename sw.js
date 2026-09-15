// ============================================================
// Ozylix — Service Worker (sw.js)
// Place this file in ROOT of your GitHub Pages repo
// ============================================================

// Bumped v7 -> v8 to force-purge every stale cache.
//
// Documents are network-first below, so an online visitor normally gets
// fresh HTML. But the cache fallback fires whenever fetch() REJECTS — and
// on patchy mobile data that happens often. A phone that cached
// index.html back when the drawer scroll-lock bug was still in it could
// therefore be handed that frozen copy again on any flaky load, long
// after the fix went live. That is indistinguishable, to the person
// holding the phone, from the fix never having shipped.
//
// The activate handler deletes every cache whose key !== CACHE_NAME, so
// changing this string is what actually evicts the bad copy from devices
// already carrying it. Bump it on any deploy that fixes a page-breaking
// bug — a fix nobody can receive is not shipped.
const CACHE_NAME = 'ozylix-pwa-v31';
const OFFLINE_URL = '/offline.html';

// Files to cache on install (your core pages)
// index.html is now modular: core JS lives in external scripts/ modules
// (security, tracking, seo-core in head; shop, promo-data at body end).
// They are cacheable so offline fallbacks stay consistent.
const CORE_FILES = [
  '/manifest.json',
  '/',
  '/index.html',
  '/shop',
  '/advisor',
  '/about',
  '/contact',
  '/faq',
  '/offline.html',
  // cache.addAll rejects the whole batch if a single entry 404s, so every
  // path below must exist.
  '/assets/ozylix-logo.png',
  '/assets/ozylix-mark.svg',
  '/assets/favicon.svg',
  '/assets/ozylix-icon-192.png',
  '/assets/ozylix-icon-512.png',
  // Storefront CSS, extracted out of index.html (Aug 2026 perf pass). The
  // page is unstyled offline without these, so they belong in the core set.
  '/styles/store-main.min.css?v=20260825-1',
  '/styles/store-account-mobile.min.css?v=20260825-1',
  '/scripts/security.js',
  '/scripts/tracking.js',
  '/scripts/seo-core.min.js?v=20260825-1',
  '/scripts/shop.js',
  '/scripts/promo-data.js',
  '/scripts/store-core.min.js?v=20260914-1',
  '/scripts/auth-core.min.js?v=20260914-security',
  '/scripts/cart-utils.js'
];

// ── INSTALL: cache core files ──
self.addEventListener('install', event => {
  console.log('[Ozylix SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CORE_FILES).catch(err => {
        // If some files fail (e.g. /shop not a static file), continue anyway
        console.warn('[Ozylix SW] Some files not cached:', err);
      });
    })
  );
  self.skipWaiting();
});

// ── ACTIVATE: clean old caches ──
self.addEventListener('activate', event => {
  console.log('[Ozylix SW] Activated');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key.startsWith('ozylix-pwa-') && key !== CACHE_NAME)
          .map(key => {
            console.log('[Ozylix SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      )
    )
  );
  event.waitUntil(self.clients.claim());
});

// ── FETCH ────────────────────────────────────────────────────────────
// Two rules, and a hard requirement.
//
// The requirement: every path through this handler must return a real
// Response. The previous version fell through to `undefined` whenever a
// non-document request failed with nothing cached, and returning
// undefined from respondWith is a *network error* — it turned every
// flaky-signal blip into a permanently broken image that never retried.
// That is why promo images appeared on first load and vanished after.
//
// Rule 1: cross-origin requests are none of our business. Image CDNs,
// fonts and analytics are left entirely to the browser, which handles
// their caching and retries better than we can. Intercepting them only
// added a service-worker round trip to every image.
//
// Rule 2: same-origin. Documents are network-first so content is fresh;
// static assets are cache-first so repeat views are instant.
self.addEventListener('fetch', event => {
  const { request } = event;

  if (request.method !== 'GET') return;

  let url;
  try { url = new URL(request.url); } catch (e) { return; }

  // Rule 1 — anything not served from this origin.
  if (url.origin !== self.location.origin) return;

  // Rule 1b — the API. /api/site-media is now fetched same-origin so it hits
  // the Worker's edge cache instead of Render directly, which brought it
  // under Rule 2b: cache-first, so an admin's banner change could take two
  // loads to show. API responses have their own freshness rules (a 60s edge
  // TTL, and the storefront's own localStorage copy) and have no business in
  // the static asset cache.
  if (url.pathname.startsWith('/api/')) return;

  // Sensitive pages and authenticated requests never enter offline storage.
  // Public product images have their own edge cache; avoid duplicating large
  // video/image bodies in the device's application cache.
  const privatePath = /^\/(?:account|orders|checkout|thankyou|login|admin(?:\.html)?|ops-console-8f3d2c\.html)(?:\/|$)/.test(url.pathname);
  if (privatePath || request.headers.has('Authorization') || url.pathname.startsWith('/cdn-storage/')) return;

  const canStore = response => response && response.status === 200 &&
    !/(?:no-store|private)/i.test(response.headers.get('Cache-Control') || '') &&
    !response.headers.has('Set-Cookie');
  const remember = response => {
    if (!canStore(response)) return;
    const clone = response.clone();
    event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.put(request, clone)).catch(() => {}));
  };

  const isDocument = request.mode === 'navigate' || request.destination === 'document';

  // Rule 2a — documents: network first, cache as backup.
  if (isDocument) {
    event.respondWith(
      fetch(request)
        .then(response => {
          remember(response);
          return response;
        })
        .catch(async () => {
          return (await caches.match(request))
              || (await caches.match('/index.html'))
              || (await caches.match(OFFLINE_URL))
              || new Response('<h1>Offline</h1>', { status: 503, headers: { 'Content-Type': 'text/html' } });
        })
    );
    return;
  }

  // Rule 2b — same-origin static assets: cache first, refresh in background.
  event.respondWith(
    caches.match(request).then(cached => {
      const network = fetch(request)
        .then(response => {
          remember(response);
          return response;
        })
        .catch(() => cached || Response.error());
      event.waitUntil(network.then(() => {}).catch(() => {}));
      return cached || network;
    })
  );
});

// ── PUSH NOTIFICATIONS (optional future use) ──
// The page only calls showNotification after the visitor has granted browser permission.
self.addEventListener('message', event => {
  const d = event.data || {};
  if (d.type !== 'ozylix-show-notification') return;
  const title = d.title || 'Ozylix';
  const options = { body: d.body || '', icon: '/assets/ozylix-icon-192.png', badge: '/assets/ozylix-icon-192.png', data: { url: d.url || '/' } };
  event.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Ozylix';
  const options = {
    body: data.body || 'Check out our latest offers!',
    icon: '/assets/ozylix-icon-192.png',
    badge: '/assets/ozylix-icon-192.png',
    data: { url: data.url || '/' },
    // The sender groups related messages under a tag (cart recovery, offer,
    // review request). Honouring it means a second message in the same group
    // REPLACES the first in the tray instead of stacking beside it — three
    // cart reminders should not read as three separate abandoned carts.
    tag: data.tag || 'ozylix-marketing'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  let target;
  try {
    target = new URL(event.notification.data?.url || '/', self.location.origin);
    if (target.origin !== self.location.origin || target.protocol !== 'https:') throw new Error('external');
  } catch { target = new URL('/', self.location.origin); }
  event.waitUntil(clients.openWindow(target.href));
});
