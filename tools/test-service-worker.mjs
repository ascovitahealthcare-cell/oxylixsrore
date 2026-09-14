import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
const listeners={}, writes=[], opened=[], deleted=[];
const cache={put:async(req,res)=>{writes.push([req.url,await res.text()]);}};
let net=async()=>new Response('public');
const context=vm.createContext({URL,Response,console,fetch:(...args)=>net(...args),clients:{openWindow:async url=>opened.push(url)},
  self:{location:{origin:'https://www.ozylix.com'},addEventListener:(type,fn)=>listeners[type]=fn,clients:{claim:async()=>{}},skipWaiting(){}},
  caches:{open:async()=>cache,match:async()=>undefined,keys:async()=>['ozylix-pwa-v29','another-app'],delete:async k=>deleted.push(k)}});
vm.runInContext(fs.readFileSync(new URL('../sw.js',import.meta.url),'utf8'),context);
function dispatch(path,headers={},destination='document'){
  const tasks=[];let response;
  listeners.fetch({request:{url:'https://www.ozylix.com'+path,method:'GET',headers:new Headers(headers),mode:destination==='document'?'navigate':'cors',destination},waitUntil:p=>tasks.push(p),respondWith:p=>response=p});
  return{get response(){return response;},tasks};
}
for(const path of ['/api/orders/my','/account','/checkout','/orders/123','/admin.html','/cdn-storage/product-images/a.mp4'])assert.equal(dispatch(path).response,undefined,path);
assert.equal(dispatch('/shop',{Authorization:'Bearer session'}).response,undefined);
for(const cc of ['no-store','private, max-age=60']){net=async()=>new Response('private',{headers:{'Cache-Control':cc}});const e=dispatch('/shop');await e.response;await Promise.all(e.tasks);assert.equal(writes.length,0);}
net=async()=>new Response('public',{headers:{'Cache-Control':'public, max-age=30'}});const e=dispatch('/shop');assert.equal(await(await e.response).text(),'public');await Promise.all(e.tasks);assert.equal(writes.length,1);
net=async()=>{throw Error('offline');};const offline=dispatch('/shop');assert.equal((await offline.response).status,503);
const tasks=[];listeners.activate({waitUntil:p=>tasks.push(p)});await Promise.all(tasks);assert.deepEqual(deleted,['ozylix-pwa-v29']);
for(const url of ['https://evil.example/','javascript:alert(1)','/product/spirulina']){const tasks=[];listeners.notificationclick({notification:{data:{url},close(){}},waitUntil:p=>tasks.push(p)});await Promise.all(tasks);}
assert.deepEqual(opened,['https://www.ozylix.com/','https://www.ozylix.com/','https://www.ozylix.com/product/spirulina']);
console.log('Service worker checks passed: private/API/media bypass, cache directives, offline fallback, isolated cleanup and notification URLs');
