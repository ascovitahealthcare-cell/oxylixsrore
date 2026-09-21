const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..');
let onIntersection, onMutation;
const observed = new Set();
class Image {
  constructor(url) { this.dataset = {src:url}; this.src = ''; }
  matches() { return !!this.dataset.src; }
  removeAttribute() { delete this.dataset.src; }
  querySelectorAll() { return []; }
}
const image = new Image('/test.webp');
class IO {
  constructor(callback) { onIntersection = callback; }
  observe(img) { observed.add(img); }
  unobserve(img) { observed.delete(img); }
}
const context = { window:{IntersectionObserver:IO}, IntersectionObserver:IO, Element:Image,
  MutationObserver:class { constructor(cb) { onMutation=cb; } observe() {} },
  document:{body:{},querySelectorAll:()=>[image]} };
vm.runInNewContext(fs.readFileSync(path.join(root,'scripts/img-hydrator.js'),'utf8'),context);
assert.equal(image.src,''); assert.ok(observed.has(image));
context.window._hpiFlush(); assert.equal(image.src,'');
onIntersection([{target:image,isIntersecting:false}]); assert.equal(image.src,'');
onIntersection([{target:image,isIntersecting:true}]); assert.equal(image.src,'/test.webp');
image.dataset.src='/replacement.webp'; onMutation([{type:'attributes',target:image}]);
onIntersection([{target:image,isIntersecting:true}]); assert.equal(image.src,'/replacement.webp');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert.ok(html.indexOf('<meta charset=') < 100);
assert.ok(!/hreflang=[^>]+data-hreflang/.test(html));
assert.ok(html.includes('id="heroBanner" style="aspect-ratio:1600/686"'));
const auth=fs.readFileSync(path.join(root,'scripts/auth-core.js'),'utf8');
const start=auth.indexOf('function addToCartWithTier('),end=auth.indexOf('const tiers =',start);
const guard=auth.slice(start,end)+'}';
let warned=false;
vm.runInNewContext(guard+';addToCartWithTier(38);',{PRODUCTS:[{id:38,stock:0}],showToast:()=>{warned=true;}});
assert.ok(warned);
console.log('PASS: deferred image loading, visibility, replacement, early charset, banner space, hreflang, zero-stock guard');
