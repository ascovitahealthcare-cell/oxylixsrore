const fs=require('node:fs'), vm=require('node:vm'), assert=require('node:assert/strict'), path=require('node:path');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'scripts/animations.js'),'utf8');
const listeners={}, frames=[], timers=[];
const navStates=[];
const context={
 document:{readyState:'complete',documentElement:{scrollHeight:2500},getElementById:()=>null,querySelector:s=>s==='.navbar'?{classList:{toggle:(c,v)=>navStates.push(v)}}:null,querySelectorAll:()=>[],addEventListener:(event,fn)=>{assert.notEqual(event,'DOMContentLoaded','idle-loaded script must initialize immediately');}},
 navigator:{hardwareConcurrency:8},
 requestAnimationFrame:fn=>{frames.push(fn);return frames.length;},
 setTimeout:(fn,ms)=>{timers.push({fn,ms});return timers.length;},
 setInterval:()=>1,clearInterval(){},
 MutationObserver:class {observe(){}},IntersectionObserver:class {observe(){}unobserve(){}},
};
context.window={innerWidth:1200,innerHeight:800,scrollY:0,matchMedia:()=>({matches:false}),IntersectionObserver:context.IntersectionObserver,addEventListener:(e,f)=>listeners[e]=f};
vm.createContext(context);vm.runInContext(source,context);
assert.ok(timers.some(t=>t.ms===300),'late script initializes reveal setup');
assert.equal(frames.length,1);
listeners.scroll();listeners.scroll();assert.equal(frames.length,1,'scroll events share a frame');
context.window.scrollY=80;frames.shift()();assert.equal(navStates.at(-1),true);
context.window.scrollY=0;listeners.scroll();frames.shift()();assert.equal(navStates.at(-1),false);
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const files=html.match(/var FILES = (\[[^;]+\])/)[1];
for(const duplicate of ['tilt-reveal.js','magnet-deco.js','magnet-observe.js','liquid-bubbles.js']) assert.ok(!files.includes(duplicate));
console.log('PASS: idle initialization, coalesced scroll updates and one motion engine');
