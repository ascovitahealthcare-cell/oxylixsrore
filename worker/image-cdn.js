/** Public product media proxy. Stream origin bodies; cache only complete media. */
export const SUPABASE_STORAGE_ORIGIN = 'https://frwsjgrrtzhjfflcdjjs.supabase.co';
export const CDN_BUCKETS = new Set(['product-images']);
const CDN_PREFIX = '/cdn-storage/';
const CACHE_TTL_SECONDS = 31536000;
const MEDIA_TYPE = /^(image\/(?:png|jpeg|webp|gif|avif|svg\+xml|x-icon|vnd.microsoft.icon)|video\/(?:mp4|quicktime|webm))$/i;

export function isCdnRequest(pathname) {
  return pathname.startsWith(CDN_PREFIX);
}

export function toSupabaseUrl(pathname) {
  if (!isCdnRequest(pathname)) return null;
  const parts = pathname.slice(CDN_PREFIX.length).split('/');
  if (!CDN_BUCKETS.has(parts.shift()) || !parts.length) return null;
  // Decode each segment once, reject encoded separators and nested escapes,
  // then encode again so the origin cannot interpret it as a query or traversal.
  try {
    const safe = parts.map(part => {
      const decoded = decodeURIComponent(part);
      if (!decoded || decoded === '.' || decoded === '..' || /[\/\\%\x00-\x1f\x7f]/.test(decoded)) throw new Error('path');
      return encodeURIComponent(decoded);
    });
    return `${SUPABASE_STORAGE_ORIGIN}/storage/v1/object/public/product-images/${safe.join('/')}`;
  } catch { return null; }
}

function mediaHeaders(origin) {
  const headers = new Headers({
    'Content-Type': origin.headers.get('Content-Type'),
    'Cache-Control': `public, max-age=${CACHE_TTL_SECONDS}, immutable`,
    'Access-Control-Allow-Origin': '*',
    'X-Content-Type-Options': 'nosniff',
    // SVG remains usable as an image, but direct navigation cannot run scripts.
    'Content-Security-Policy': "default-src 'none'; sandbox",
    'Referrer-Policy': 'no-referrer',
  });
  for (const name of ['Content-Length', 'Content-Range', 'Accept-Ranges', 'ETag', 'Last-Modified']) {
    if (origin.headers.has(name)) headers.set(name, origin.headers.get(name));
  }
  return headers;
}

export async function handleCdnRequest(request, ctx) {
  if (!['GET', 'HEAD'].includes(request.method)) {
    return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD', 'Cache-Control': 'no-store' } });
  }
  const url = new URL(request.url);
  const supabaseUrl = toSupabaseUrl(url.pathname);
  if (!supabaseUrl) return new Response('Not found', { status: 404 });

  const range = request.headers.get('Range');
  // Version the cache to exclude entries written without media validation.
  const keyUrl = new URL(url);
  keyUrl.searchParams.set('__media_policy', '2');
  const cacheKey = new Request(keyUrl, { method: 'GET' });
  const cache = caches.default;
  if (!range) {
    try {
      const cached = await cache.match(cacheKey);
      if (cached) return new Response(request.method === 'HEAD' ? null : cached.body, {
        status: cached.status, headers: cached.headers,
      });
    } catch { /* Cache availability must not gate image delivery. */ }
  }

  let origin;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    origin = await fetch(supabaseUrl, {
      method: request.method,
      headers: range ? { Range: range, ...(request.headers.has('If-Range') ? { 'If-Range': request.headers.get('If-Range') } : {}) } : {},
      redirect: 'error',
      signal: controller.signal,
      cf: range || request.method === 'HEAD'
        ? { cacheTtl: 0, cacheEverything: false }
        : { cacheKey: keyUrl.toString(), cacheTtlByStatus: { '200': CACHE_TTL_SECONDS, '400-599': 0 }, cacheEverything: true },
    });
  } catch {
    return new Response('Media temporarily unavailable', { status: 502, headers: { 'Cache-Control': 'no-store' } });
  } finally {
    // Bound time to headers without cutting off a long video download.
    clearTimeout(timeout);
  }
  if (!origin.ok) {
    const headers = new Headers({ 'Cache-Control': 'no-store' });
    if (origin.status === 416 && origin.headers.has('Content-Range')) headers.set('Content-Range', origin.headers.get('Content-Range'));
    await origin.body?.cancel();
    return new Response('Media unavailable', { status: [404, 416].includes(origin.status) ? origin.status : 502, headers });
  }
  const type = (origin.headers.get('Content-Type') || '').split(';')[0].trim();
  if (!MEDIA_TYPE.test(type)) {
    await origin.body?.cancel();
    return new Response('Unsupported media type', { status: 415, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
  }
  const response = new Response(request.method === 'HEAD' ? null : origin.body, {
    status: origin.status, headers: mediaHeaders(origin),
  });
  // Never buffer the entire image/video in isolate memory. waitUntil keeps
  // the cache write alive after response headers reach the customer.
  if (request.method === 'GET' && !range && response.status === 200 && ctx?.waitUntil) {
    ctx.waitUntil(cache.put(cacheKey, response.clone()).catch(() => {}));
  }
  return response;
}
