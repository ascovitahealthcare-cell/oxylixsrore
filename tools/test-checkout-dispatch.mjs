import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=fs.readFileSync(new URL('../scripts/auth-core.js',import.meta.url),'utf8');
const start=source.indexOf('async function finalizeOrder(');
const end=source.indexOf('  // Order is confirmed in the database.',start);
const snippet=source.slice(start,end)+'\n}';
async function run(saveOK){
 const calls=[],storage=new Map([['asc_jwt','test-token']]);
 const ctx=vm.createContext({document:{getElementById:()=>null},PAY_METHOD_LABEL:{cod:'Cash on Delivery'},showVitaEarned(){},STORE:{cart:[{id:1,qty:1}]},PRODUCTS:[{id:1,name:'Product',price:100}],getOrderTotal:()=>({disc:0,mixMatchDiscount:0}),getCurrentUser:()=>({email:'buyer@example.com'}),SHIPROCKET_CONFIG:{apiBase:'https://backend.example'},API_BASE:'https://backend.example',localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},AbortSignal,setTimeout,console:{error(){}},showPaymentError(){},showToast(){},fetch:async(url,opts)=>{calls.push({url,opts});if(url.endsWith('/api/confirm-cod-order'))return {ok:saveOK,status:saveOK?200:400,json:async()=>saveOK?{data:{id:'order-1'}}:{error:'rejected'}};return {ok:true,json:async()=>({order_id:99})};}});
 vm.runInContext(snippet,ctx);
 await ctx.finalizeOrder('order-1',{firstName:'Buyer',lastName:'Test',email:'buyer@example.com',phone:'9876543210',addr1:'1 Test street',city:'Anand',state:'Gujarat',pin:'388001'},100,'cod',0);
 return {calls,storage};
}
const failed=await run(false);assert.equal(failed.calls.length,1);assert.equal(failed.storage.has('asc_orders'),false);
const passed=await run(true);assert.equal(passed.calls.length,2);assert(passed.calls[0].url.endsWith('/api/confirm-cod-order'));assert(passed.calls[1].url.endsWith('/api/create-shiprocket-order'));assert.equal(passed.calls[1].opts.headers.Authorization,'Bearer test-token');assert.deepEqual(JSON.parse(passed.calls[1].opts.body),{order_id:'order-1'});
console.log('Checkout dispatch regressions passed: rejected order cannot dispatch or save locally; confirmed order dispatches with token and ID only.');
