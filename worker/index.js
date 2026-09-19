/**
 * Ozylix — routing shim for Cloudflare Workers static assets.
 *
 * The storefront is one index.html single-page app. Cloudflare serves any real
 * file straight from the edge WITHOUT invoking this Worker, so this code only
 * runs for paths that do not exist on disk: the SPA's own routes, and genuine
 * 404s. Images, sw.js, manifest.json etc. never touch it.
 *
 * Why this exists rather than a `_redirects` file:
 * `_redirects` used to carry these routes, but wrangler's own parser rejects the
 * one that mattered most:
 *
 *   Found 1 invalid redirect rule:
 *   > Infinite loop detected in this rule and has been ignored.
 *       at _redirects:29 | /product/*   /index.html  200
 *
 * A `200` rewrite whose target is itself served by the asset server re-enters
 * the rule, so Cloudflare drops it. That silently took out all 16 product URLs —
 * the entire reason for moving off GitHub Pages, where 22 of 23 sitemap URLs
 * returned 404. `_redirects` was removed rather than left half-working, so
 * routing has exactly one source of truth: this file.
 *
 * Keep SPA_ROUTES in step with `_validPages` in scripts/auth-core.js (search
 * for `const _validPages`). A route listed here but missing there renders the home
 * page under a different URL — a soft 404, which is worse than a real one.
 */

const SPA_ROUTES = new Set([
  '/shop',
  '/blog',
  '/blog/*',
  '/about',
  '/contact',
  '/faq',
  '/advisor',
  '/account',
  '/b2b', // index.html forwards this on to the Ascovita corporate site
  '/wishlist',
  // ── Added Aug 2026 ───────────────────────────────────────────────────────
  // These had drifted out of step with the SPA. showPage() pushes '/' + page
  // into the address bar for every one of them, so the URL a customer ends up
  // holding — bookmarked, refreshed on flaky mobile data, or pasted to someone
  // else — was a URL this Worker answered with a hard 404. The page rendered
  // fine right up until the moment anyone reloaded it.
  '/cart',
  '/notifications',
  '/privacy',
  '/terms',
  '/shipping',
  '/refund',
  '/accessibility',
  '/download',
  '/vita-points',
  '/conduct',
  '/discount-policy',
]);

// Customer-facing product URLs are singular. The plural form is accepted only
// as a legacy inbound route so the SPA can replace it with /product/<slug>.
// Bare routes and nested paths are not shapes the app produces.
const PRODUCT_PATH = /^\/(?:product|products)\/[^/]+$/;

function isSpaPath(pathname) {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  if (SPA_ROUTES.has(path)) return true;
  if (PRODUCT_PATH.test(path)) return true;
  // Wildcard entries like '/blog/*' match any path sharing that prefix.
  for (const route of SPA_ROUTES) {
    if (route.endsWith('/*') && path.startsWith(route.slice(0, -1)) && path.length > route.length - 2) {
      return true;
    }
  }
  return false;
}

// The admin panel has its own hostname. Without this it is simply another
// Custom Domain on the same Worker, so back.ozylix.com would serve a second
// complete copy of the storefront — duplicate content for Google, under a name
// that is meant to be private.
const ADMIN_HOST = 'back.ozylix.com';
// Keep the admin shell off enumerable default paths. This is not a substitute
// for authentication; it reduces automated discovery and brute-force noise.
const ADMIN_SECRET_PATH = '/ops-console-8f3d2c.html';
const ADMIN_ENTRY = new Set([ADMIN_SECRET_PATH]);
const ADMIN_LEGACY_PATHS = new Set(['/','/admin','/admin/','/admin.html']);
const PUBLIC_LEGACY_ADMIN_PATHS = new Set(['/admin','/admin/','/admin.html']);
const ADMIN_CSP = "default-src 'none'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://accounts.google.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://sdk.cashfree.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https://frwsjgrrtzhjfflcdjjs.supabase.co https://wyvpuafzirwlwweifzao.supabase.co https://i.ibb.co https://ascovita.imgbb.com https://images.unsplash.com; media-src 'self' blob: https://frwsjgrrtzhjfflcdjjs.supabase.co https://wyvpuafzirwlwweifzao.supabase.co; connect-src 'self' https://ascovitahealthcare-cell-github-io.onrender.com https://frwsjgrrtzhjfflcdjjs.supabase.co https://wyvpuafzirwlwweifzao.supabase.co https://accounts.google.com https://www.googleapis.com https://analytics.google.com https://sdk.cashfree.com http://localhost:* http://127.0.0.1:*; frame-src 'self' about:blank https://accounts.google.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';";

// Never let the admin hostname into a search index, whatever it serves.
function noIndex(res) {
  const headers = new Headers(res.headers);
  headers.set('X-Robots-Tag', 'noindex, nofollow');
  headers.set('Cache-Control', 'no-store, private, max-age=0');
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Content-Security-Policy', ADMIN_CSP);
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'no-referrer');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  return new Response(res.body, { status: res.status, headers });
}

async function serveAdmin(request, env, url) {
  const path = url.pathname.length > 1 ? url.pathname.replace(/\/+$/, '') : url.pathname;

  if (ADMIN_ENTRY.has(path)) {
    const page = await env.ASSETS.fetch(new URL('/admin.html', url));
    return noIndex(new Response(page.body, { status: 200, headers: page.headers }));
  }

  // Real files still resolve, because admin.html pulls in scripts/invoice-renderer.js,
  // the logo and so on. Anything else — storefront routes in particular — is
  // left to 404 here rather than serving the shop under the admin name.
  return noIndex(await env.ASSETS.fetch(request));
}

import { isCdnRequest, handleCdnRequest } from './image-cdn.js';

// ── Performance: edge-cached site-media JSON (Aug 2026) ──────────────────────
// The storefront fetches /api/site-media from the Render backend on every page
// load before it can render the offer banners. On a cold Render container that
// call costs ~1.9s — the single biggest LCP delay for first-time visitors.
// The map is public (no auth), changes only when an admin uploads/replaces a
// site image, and the admin panel already re-applies the map live after an
// upload completes — so a 60s edge cache with 1-year stale-while-revalidate is
// safe: visitors always get a copy within a minute of an admin change, and the
// upload hook refreshes their page instantly anyway.
//
// When an admin changes a site image, POST /api/admin/invalidate-cache is
// called by the backend hook (see backend) — it purges this key from the edge
// so the freshest map is re-fetched.
const SITE_MEDIA_URL = 'https://ascovitahealthcare-cell-github-io.onrender.com/api/site-media';
const SITE_MEDIA_EDGE_TTL = 60; // seconds — admin changes visible within 1 min
const SITE_MEDIA_STALE_TTL = 31536000; // serve stale up to 1 year while refreshing
const SITE_MEDIA_CACHE_KEY = new Request('https://ozylix-cdn/edge/site-media', { method: 'GET' });

// Response-level protections for Worker-generated public pages and JSON. The
// matching _headers file covers static assets that bypass this Worker.
const PUBLIC_CSP = "default-src 'none'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://accounts.google.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://connect.facebook.net https://sdk.cashfree.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https://frwsjgrrtzhjfflcdjjs.supabase.co https://wyvpuafzirwlwweifzao.supabase.co https://i.ibb.co https://ascovita.imgbb.com https://images.unsplash.com; connect-src 'self' https://www.googletagmanager.com https://www.facebook.com https://connect.facebook.net https://frwsjgrrtzhjfflcdjjs.supabase.co https://ascovitahealthcare-cell-github-io.onrender.com https://marketing-automation-rmcb.onrender.com https://*.gokwik.co https://gkx.gokwik.co https://www.google-analytics.com https://region1.google-analytics.com https://www.googleapis.com https://oauth2.googleapis.com https://openidconnect.googleapis.com https://accounts.google.com https://api.cashfree.com https://sandbox.cashfree.com; frame-src 'self' https://www.googletagmanager.com https://accounts.google.com https://content.googleapis.com https://oauth2.googleapis.com https://*.gokwik.co https://sdk.cashfree.com https://api.cashfree.com https://sandbox.cashfree.com https://payments.cashfree.com https://payments-test.cashfree.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self';";

// Cloudflare can otherwise replace the repository file with its managed
// Content-Signals policy. Keep one authoritative crawler policy at the Worker.
const ROBOTS_TXT = `User-agent: *\nDisallow: /admin\nDisallow: /admin.html\nDisallow: /ops-console-8f3d2c.html\nDisallow: /api/\nDisallow: /_page_\nDisallow: /tools/\nDisallow: /scripts/\nDisallow: /platform_review_report.md\nSitemap: https://www.ozylix.com/sitemap.xml\n`;

function publicHeaders(res) {
  const headers = new Headers(res.headers);
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  headers.set('X-Frame-Options', 'SAMEORIGIN');
  headers.set('Content-Security-Policy', PUBLIC_CSP);
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}

// In-memory map cache: survives for the lifetime of the isolate, which is
// where almost all repeat traffic actually lands (one isolate serves thousands
// of requests). Measured in production: the Cloudflare Cache API entries this
// Worker writes are never re-readable by later requests (cache.match always
// misses), so an in-process cache is the reliable hot path. Cold origin fetch
// happens at most once per isolate lifetime instead of once per minute.
const smInMem = { body: null, headers: null, expiry: 0 };

async function handleSiteMedia() {
  const now = Date.now();
  if (smInMem.body !== null && smInMem.expiry > now) {
    return publicHeaders(new Response(smInMem.body, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `public, max-age=${SITE_MEDIA_EDGE_TTL}, stale-while-revalidate=${SITE_MEDIA_STALE_TTL}`,
        'Access-Control-Allow-Origin': '*',
        'X-Edge-Age': String(Math.floor((now - smInMem.storedAt) / 1000)),
      },
    }));
  }

  // Cold isolate — fetch from Render (may include cold-start time, but only
  // once per isolate lifetime instead of on every page load).
  try {
    const r = await fetch(SITE_MEDIA_URL, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(10000),
      cf: {
        // Deterministic key in the zone cache so every visitor shares one
        // entry, and cf cacheTtl applies even though the origin (Render) is
        // not itself behind Cloudflare.
        cacheKey: SITE_MEDIA_CACHE_KEY.url,
        cacheTtl: SITE_MEDIA_EDGE_TTL,
        cacheEverything: true,
      },
    });
    if (!r.ok) throw new Error('backend ' + r.status);
    const body = await r.text();
    // Validate it's actually JSON before caching.
    JSON.parse(body);
    smInMem.body = body;
    smInMem.headers = {
      'Content-Type': 'application/json',
      'Cache-Control': `public, max-age=${SITE_MEDIA_EDGE_TTL}, stale-while-revalidate=${SITE_MEDIA_STALE_TTL}`,
      'Access-Control-Allow-Origin': '*',
    };
    smInMem.storedAt = now;
    smInMem.expiry = now + SITE_MEDIA_EDGE_TTL * 1000;
    return publicHeaders(new Response(body, { status: 200, headers: smInMem.headers }));
  } catch (e) {
    // Render is down or slow — fail loudly so the storefront keeps its
    // hard-coded defaults instead of painting broken banner URLs.
    return publicHeaders(new Response(JSON.stringify({ error: 'site-media unavailable' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    }));
  }
}

// The apex is a redirect, not a second copy of the site.
//
// ozylix.com resolved to GitHub Pages, which does not read _headers at all —
// so the apex served the storefront with no CSP, no HSTS, no X-Frame-Options
// and none of the caching rules, while www had all of them. Two versions of
// the same shop with different security postures, and the weaker one is the
// address people type.
//
// Everything canonical already points at www: the <link rel=canonical>, the
// sitemap, the structured data in seo-core.js. So the apex becomes a permanent
// redirect rather than a second origin — one place serving the site, one set
// of headers, and the link equity consolidated instead of split.
//
// 301 and not 302: this is permanent, and search engines should treat it that
// way. The path, query and hash are preserved so a shared apex deep link still
// lands where it was meant to.
const APEX_HOST = 'ozylix.com';
const CANONICAL_HOST = 'www.ozylix.com';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Enforce transport security at the Worker edge. HSTS only protects
    // repeat visitors; first-time HTTP requests must receive a redirect.
    if (url.protocol === 'http:') {
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }

    const normalizedPath = url.pathname.replace(/\/+$/, '') || '/';
    if (url.hostname !== ADMIN_HOST && PUBLIC_LEGACY_ADMIN_PATHS.has(normalizedPath)) {
      return new Response('Not found', { status: 404, headers: { 'Cache-Control': 'no-store' } });
    }

    // Preserve old bookmarks and footer links while keeping /privacy as the
    // single canonical policy URL used by security.txt and the sitemap.
    if (url.hostname !== ADMIN_HOST && normalizedPath === '/privacy-policy') {
      url.pathname = '/privacy';
      return publicHeaders(Response.redirect(url.toString(), 301));
    }

    if (url.hostname === APEX_HOST) {
      url.hostname = CANONICAL_HOST;
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname === '/robots.txt') {
      return publicHeaders(new Response(ROBOTS_TXT, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      }));
    }

    // Public, edge-cached site-media map (see handleSiteMedia doc block).
    if (url.pathname === '/api/site-media') {
      return handleSiteMedia();
    }

    // Edge image CDN: /cdn-storage/<bucket>/<path> is fetched once from
    // Supabase Storage and cached at the edge forever, so image delivery
    // costs Supabase egress only on the very first request. Real files
    // (favicon, logo etc.) still serve from disk; see worker/image-cdn.js.
    if (isCdnRequest(url.pathname)) {
      return handleCdnRequest(request, ctx);
    }

    if (url.hostname.toLowerCase() === ADMIN_HOST) {
      const adminPath = url.pathname.length > 1 ? url.pathname.replace(/\/+$/, '') : url.pathname;
      if (ADMIN_LEGACY_PATHS.has(adminPath)) {
        const target = new URL(ADMIN_SECRET_PATH, url);
        return noIndex(Response.redirect(target.toString(), 302));
      }
      return serveAdmin(request, env, url);
    }

    if (isSpaPath(url.pathname)) {
      // Serve the app shell while keeping the visitor's URL and a 200, so the
      // page is indexable. index.html reads location.pathname on boot and opens
      // the matching page or product.
      const shell = await env.ASSETS.fetch(new URL('/index.html', url));
      return publicHeaders(new Response(shell.body, { status: 200, headers: shell.headers }));
    }

    // Real asset, or nothing — in which case not_found_handling serves 404.html
    // with a genuine 404 status.
    return publicHeaders(await env.ASSETS.fetch(request));
  },
};

// Exported for the local routing test; ignored by the Workers runtime.
export { isSpaPath, ADMIN_HOST, ADMIN_ENTRY, handleSiteMedia };

