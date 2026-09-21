// Observe product images without downloading hidden routes or off-screen grids.
(function installProductImgHydrator() {
  if (window._hpiInstalled) return;
  window._hpiInstalled = true;
  var selector = 'div.product-card img[data-src]';
  function hydrate(img) {
    if (!img || !img.dataset.src) return;
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
  }
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      hydrate(entry.target);
      io.unobserve(entry.target);
    });
  }, { rootMargin: '300px 0px' }) : null;
  function watch(img) {
    if (!img.matches(selector)) return;
    if (io) io.observe(img);
    else hydrate(img);
  }
  window._hpiFlush = function() { document.querySelectorAll(selector).forEach(watch); };
  var mo = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes') { watch(mutation.target); return; }
      mutation.addedNodes.forEach(function(node) {
        if (!(node instanceof Element)) return;
        watch(node);
        node.querySelectorAll(selector).forEach(watch);
      });
    });
  });
  mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-src'] });
  window._hpiFlush();
})();
function hydrateProductImgs() { if (window._hpiFlush) window._hpiFlush(); }
