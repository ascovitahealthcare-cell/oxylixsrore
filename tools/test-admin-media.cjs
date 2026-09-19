const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.join(__dirname, '..');
for (const file of ['scripts/admin-core.js', 'scripts/admin-core.min.js']) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const start = source.indexOf('function adminCdnImg(');
  const end = source.indexOf('function isVideoFile(', start);
  const context = {};
  vm.runInNewContext(source.slice(start, end), context);
  const origin = 'https://frwsjgrrtzhjfflcdjjs.supabase.co/storage/v1/object/public/product-images/';
  for (const name of ['banner.webp', 'promo.mp4']) {
    assert.equal(context.adminCdnImg(origin + name), origin + name);
    assert.equal(context.adminCdnImg('/cdn-storage/product-images/' + name), origin + name);
  }
  assert.equal(context.adminCdnImg(''), '');
  assert.equal(context.adminCdnImg('/assets/logo.png'), '/assets/logo.png');
}
for (const file of ['admin.html', 'worker/index.js', '_headers']) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const policy = file === 'worker/index.js' ? source.match(/const ADMIN_CSP = "([^"]+)"/)[1] : source;
  const media = policy.match(/media-src ([^;]+);/)[1];
  assert.ok(media.includes("'self'"));
  assert.ok(media.includes('https://frwsjgrrtzhjfflcdjjs.supabase.co'));
  assert.ok(media.includes('https://wyvpuafzirwlwweifzao.supabase.co'));
  assert.ok(!media.includes('*'));
}
console.log('PASS: source/minified previews preserve storage URLs; legacy paths resolve; admin video policies allow configured hosts only');
