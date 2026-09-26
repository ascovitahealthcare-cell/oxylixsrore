const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'scripts/admin-core.js'), 'utf8');
const upload = source.slice(source.indexOf('async function uploadPhotos('), source.indexOf('// Back-compat alias for any old callers of the single-file version'));
async function run(outcomes) {
  const nodes = {}, messages = [];
  const context = {
    document: {getElementById(id) { return nodes[id] ||= {style:{},value:''}; }},
    FormData: class { append() {} },
    _mediaMaybeConvertToWebP: async f => f,
    adminProofUpload: async () => {
      const outcome = outcomes.shift();
      if (outcome === 'cancel') throw new Error('Cancelled');
      return {ok: outcome === 'ok', json: async () => ({error:'Rejected'})};
    },
    toast: (message, type) => messages.push({message,type}),
    setTimeout() {}, loadPhotoLibrary() {},
  };
  const files = outcomes.map((_, i) => ({name:`test-${i}.png`,type:'image/png'}));
  vm.createContext(context); vm.runInContext(upload, context);
  await context.uploadPhotos(files);
  return {status:nodes.uploadStatus.textContent, last:messages.at(-1)};
}
(async () => {
  assert.match((await run(['ok','ok'])).status, /Uploaded 2\/2/);
  for (const result of [await run(['cancel']),await run(['fail'])]) {
    assert.match(result.status, /Uploaded 0\/1/);
    assert.equal(result.last.type, 'error');
    assert.doesNotMatch(result.last.message, /Upload complete/);
  }
  assert.match((await run(['ok','fail'])).status, /Uploaded 1\/2.*1 failed/);
  const start=source.indexOf('const imgExt =');
  const end=source.indexOf('function setMediaTab',start);
  const c={};vm.createContext(c);vm.runInContext(source.slice(start,end)+';this.ext=imgExt;',c);
  assert.equal(c.ext('products'),'');assert.equal(c.ext('photo.WEBP'),'webp');
  console.log('PASS: success, failure, cancellation, partial upload and folder filtering');
})().catch(e=>{console.error(e);process.exitCode=1;});
