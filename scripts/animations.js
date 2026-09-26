// Extracted from index.html (line 8186) by Manus SEO pass — load order preserved

// ═══════════════════════════════════════════════════════════
// Ozylix ANIMATION ENGINE v2
// Scroll-reveal · Cursor glow · Click waves · Parallax
// Particle system · Scroll progress · Nav shrink
// ═══════════════════════════════════════════════════════════
(function() {
  function onReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true });
    else fn();
  }


  // ── SHARED SCROLL SCHEDULER ──
  // Keep all scroll-linked work behind one requestAnimationFrame. Android
  // dispatches many scroll events per gesture; reading document height and
  // writing layout properties from multiple listeners makes the page compete
  // with the compositor for every frame.
  const reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const coarsePointer = !!(window.matchMedia && window.matchMedia('(hover: none)').matches);
  const narrowViewport = window.innerWidth <= 768;
  const weakDevice = (navigator.hardwareConcurrency || 4) <= 4;
  const saveData = !!(navigator.connection && navigator.connection.saveData);
  const lowPowerDevice = reduceMotion || coarsePointer || narrowViewport || weakDevice || saveData;
  const bar = document.getElementById('scrollBar');
  const navbar = document.querySelector('.navbar');
  const heroVisual = document.querySelector('.hero-visual');
  let maxScroll = 1;
  let scrollRaf = 0;

  function refreshScrollMetrics() {
    maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  }

  function applyScrollEffects() {
    scrollRaf = 0;
    const y = window.scrollY || 0;
    if (bar) {
      const progress = Math.min(1, Math.max(0, y / maxScroll));
      bar.style.transform = 'scaleX(' + progress.toFixed(4) + ')';
    }
    if (navbar) navbar.classList.toggle('scrolled', y > 60);
    // Hero parallax is decorative and is intentionally disabled on Android.
    if (!lowPowerDevice && heroVisual && y < window.innerHeight) {
      heroVisual.style.transform = 'translate3d(0,' + (y * 0.12).toFixed(2) + 'px,0)';
    }
  }

  function queueScrollEffects() {
    if (!scrollRaf) scrollRaf = requestAnimationFrame(applyScrollEffects);
  }

  refreshScrollMetrics();
  window.addEventListener('resize', function () {
    refreshScrollMetrics();
    queueScrollEffects();
  }, { passive: true });
  window.addEventListener('load', refreshScrollMetrics, { once: true });
  window.addEventListener('scroll', queueScrollEffects, { passive: true });
  queueScrollEffects();

  // ── CLICK WAVE ──
  document.addEventListener('click', function(e) {
    // The global wave was decorative work on every link and touch tap. Keep
    // feedback for primary controls only, and skip it for reduced-motion or
    // low-power/touch devices where it competes with scrolling.
    const btn = e.target.closest('.btn-primary, .btn-gold, .btn-outline, .add-cart-btn');
    if (reduceMotion || lowPowerDevice || !btn) return;

    const wave = document.createElement('div');
    wave.className = 'click-wave';
    wave.style.left = e.clientX + 'px';
    wave.style.top  = e.clientY + 'px';
    document.body.appendChild(wave);
    setTimeout(function() { wave.remove(); }, 700);

    // Ripple on buttons
    if (btn) {
      const r = document.createElement('span');
      r.className = 'ripple-effect';
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      r.style.cssText = 'width:'+size+'px;height:'+size+'px;left:'+(e.clientX-rect.left-size/2)+'px;top:'+(e.clientY-rect.top-size/2)+'px';
      btn.appendChild(r);
      setTimeout(function(){ r.remove(); }, 700);
    }
  });

  // ── CART BADGE BUMP ──
  const _origUpdateCartUI = null;
  onReady(function() {
    const badges = document.querySelectorAll('.cart-badge');
    // Observe cart badge changes
    const cartObs = new MutationObserver(function(mutations) {
      mutations.forEach(function(m) {
        if (m.target.classList && m.target.classList.contains('cart-badge')) {
          m.target.classList.remove('bump');
          void m.target.offsetWidth;
          m.target.classList.add('bump');
        }
      });
    });
    badges.forEach(function(b) { cartObs.observe(b, { childList:true, characterData:true, subtree:true }); });
  });

  // ── SCROLL REVEAL ENGINE ──
  let revealObserver;
  function initScrollReveal() {
    if (lowPowerDevice || !('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-reveal]').forEach(function(el) { el.classList.add('revealed'); });
      return;
    }
    const obs = revealObserver || (revealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }));

    document.querySelectorAll('[data-reveal]:not(.revealed)').forEach(function(el) {
      obs.observe(el);
    });
  }

  // ── ADD data-reveal ATTRIBUTES DYNAMICALLY ──
  function tagSections() {
    // Section labels
    document.querySelectorAll('.section-label:not([data-reveal])').forEach(function(el, i) {
      el.setAttribute('data-reveal', 'up');
      el.setAttribute('data-delay', '1');
    });
    // Section titles
    document.querySelectorAll('.section-title:not([data-reveal])').forEach(function(el, i) {
      el.setAttribute('data-reveal', 'up');
      el.setAttribute('data-delay', '2');
    });
    // Section subs
    document.querySelectorAll('.section-sub:not([data-reveal])').forEach(function(el, i) {
      el.setAttribute('data-reveal', 'up');
      el.setAttribute('data-delay', '3');
    });
    // Product cards — staggered
    document.querySelectorAll('#featuredGrid .product-card:not([data-reveal]), #newArrivalsGrid .product-card:not([data-reveal]), #shopGrid .product-card:not([data-reveal])').forEach(function(el, i) {
      el.setAttribute('data-reveal', 'scale');
      el.setAttribute('data-delay', String(Math.min(i % 4 + 1, 6)));
    });
    // Category cards
    document.querySelectorAll('.cat-card:not([data-reveal])').forEach(function(el, i) {
      el.setAttribute('data-reveal', 'up');
      el.setAttribute('data-delay', String(Math.min(i + 1, 6)));
    });
    // Cert/trust cards
    document.querySelectorAll('.cert-card:not([data-reveal]), .value-card:not([data-reveal])').forEach(function(el, i) {
      el.setAttribute('data-reveal', 'flip');
      el.setAttribute('data-delay', String(Math.min(i % 4 + 1, 5)));
    });
    // Blog cards
    document.querySelectorAll('.blog-card:not([data-reveal])').forEach(function(el, i) {
      el.setAttribute('data-reveal', 'up');
      el.setAttribute('data-delay', String(Math.min(i + 1, 4)));
    });
    // Testimonials
    document.querySelectorAll('.testi-card:not([data-reveal])').forEach(function(el, i) {
      el.setAttribute('data-reveal', 'scale');
      el.setAttribute('data-delay', String(Math.min(i + 1, 4)));
    });
    // AT items (about timeline)
    document.querySelectorAll('.at-item:not([data-reveal])').forEach(function(el, i) {
      el.setAttribute('data-reveal', i % 2 === 0 ? 'left' : 'right');
      el.setAttribute('data-delay', '1');
    });
    // Stat cards
    document.querySelectorAll('.stat-card:not([data-reveal]), .stat-num:not([data-reveal])').forEach(function(el, i) {
      el.setAttribute('data-reveal', 'up');
      el.setAttribute('data-delay', String(Math.min(i + 1, 4)));
    });
    // Hero floats
    document.querySelectorAll('.hero-float:not([data-reveal])').forEach(function(el) {
      el.setAttribute('data-reveal', 'scale');
    });
    // Cert badges
    document.querySelectorAll('.cert-badge:not([data-reveal])').forEach(function(el, i) {
      el.setAttribute('data-reveal', 'up');
      el.setAttribute('data-delay', String(Math.min(i + 1, 4)));
    });
    // B2B cards
    document.querySelectorAll('.b2b-card:not([data-reveal]), .b2b-step:not([data-reveal])').forEach(function(el, i) {
      el.setAttribute('data-reveal', 'up');
      el.setAttribute('data-delay', String(Math.min(i % 3 + 1, 4)));
    });
    // FAQ items
    document.querySelectorAll('.faq-item:not([data-reveal])').forEach(function(el, i) {
      el.setAttribute('data-reveal', 'left');
      el.setAttribute('data-delay', String(Math.min(i % 3 + 1, 4)));
    });
    // Integration cards
    document.querySelectorAll('.intg-card:not([data-reveal])').forEach(function(el, i) {
      el.setAttribute('data-reveal', 'scale');
      el.setAttribute('data-delay', String(Math.min(i + 1, 5)));
    });

    initScrollReveal();
    refreshScrollMetrics();
  }

  // ── RE-TAG after dynamic renders ──
  var _origRenderProductCard = null;
  onReady(function() {
    setTimeout(tagSections, 300);

    // Re-init reveal after shop/product grids re-render
    var renderObserver = new MutationObserver(function(mutations) {
      var shouldRetag = mutations.some(function(m) {
        return m.target.id === 'shopGrid' || m.target.id === 'featuredGrid' ||
               m.target.id === 'newArrivalsGrid' || m.target.id === 'relatedGrid';
      });
      if (shouldRetag) setTimeout(tagSections, 100);
    });
    ['shopGrid','featuredGrid','newArrivalsGrid','relatedGrid','homeFaqWrap'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) renderObserver.observe(el, { childList:true });
    });
  });

  // ── FLOATING PARTICLES ──
  function spawnParticles() {
    // Ambient particles are decorative; skip them on touch/narrow/weak
    // devices so Android can reserve the frame budget for scrolling.
    if (lowPowerDevice) return;
    var colors = ['rgba(28,86,32,0.3)', 'rgba(46,125,50,0.25)', 'rgba(28,86,32,0.2)', 'rgba(232,160,32,0.2)'];
    var sizes  = [4, 6, 8, 10, 5, 7];
    for (var i = 0; i < 8; i++) {
      (function(i) {
        setTimeout(function() {
          var p = document.createElement('div');
          p.className = 'particle';
          var size = sizes[i % sizes.length];
          p.style.cssText = [
            'width:' + size + 'px',
            'height:' + size + 'px',
            'left:' + (Math.random() * 100) + '%',
            'background:' + colors[i % colors.length],
            'animation-duration:' + (12 + Math.random() * 16) + 's',
            'animation-delay:' + (Math.random() * 8) + 's',
          ].join(';');
          document.body.appendChild(p);
        }, i * 1200);
      })(i);
    }
  }
  // Avoid global decorative particles during storefront interaction.

  // ── COUNTER ANIMATION for hero stats ──
  function animateCounter(el, target, prefix, suffix) {
    if (lowPowerDevice) {
      el.textContent = prefix + target.toLocaleString('en-IN') + suffix;
      return;
    }
    var start = 0;
    var duration = 1800;
    var step = target / (duration / 16);
    var current = 0;
    var timer = setInterval(function() {
      current = Math.min(current + step, target);
      el.textContent = prefix + Math.floor(current).toLocaleString('en-IN') + suffix;
      if (current >= target) clearInterval(timer);
    }, 16);
  }

  onReady(function() {
    // Animate hero stat numbers when visible
    var heroObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var counters = entry.target.querySelectorAll('[data-count]');
          counters.forEach(function(el) {
            var target = parseFloat(el.getAttribute('data-count'));
            var prefix = el.getAttribute('data-prefix') || '';
            var suffix = el.getAttribute('data-suffix') || '';
            animateCounter(el, target, prefix, suffix);
          });
          heroObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    var heroTrust = document.querySelector('.hero-trust');
    if (heroTrust) heroObs.observe(heroTrust);

    // Animate all [data-count] elements when visible
    var counterObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseFloat(el.getAttribute('data-count'));
          var prefix = el.getAttribute('data-prefix') || '';
          var suffix = el.getAttribute('data-suffix') || '';
          animateCounter(el, target, prefix, suffix);
          counterObs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-count]:not([data-live-rating]):not(.fc-num)').forEach(function(el) {
      counterObs.observe(el);
    });

    // Wrap showPage AFTER main app defines it (poll until available)
    var _spWrapTimer = setInterval(function() {
      if (typeof window.showPage === 'function' && !window._animSPWrapped) {
        window._animSPWrapped = true;
        var _origSP = window.showPage;
        window.showPage = function() { var result = _origSP.apply(this, arguments); setTimeout(tagSections, 200); refreshScrollMetrics(); return result; };
        clearInterval(_spWrapTimer);
      }
    }, 150);
  });

})();
