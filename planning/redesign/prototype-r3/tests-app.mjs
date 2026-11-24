// Node integration smoke with a recording DOM/Canvas double, NOT a browser/rendering benchmark.
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const html=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8');
const script=html.match(/<script type="module">([\s\S]*?)<\/script>/)[1];
assert.ok(!/^import /m.test(script));assert.ok(!/\b(?:fetch|XMLHttpRequest|localStorage|indexedDB)\s*[.(]/.test(script));
const ids=new Map();let drawCalls=0,now=0,raf=[];
const context=new Proxy({createLinearGradient:()=>({addColorStop(){}}),createRadialGradient:()=>({addColorStop(){}}),measureText:()=>({width:40})},{get(o,k){return o[k]??(()=>{drawCalls++})},set(o,k,v){o[k]=v;return true}});
class Element{
 constructor(tag='div'){this.tagName=tag.toUpperCase();this.listeners={};this.style={};this.value='';this.checked=false;this.hidden=false;this.children=[];this.parent=null;this.width=360;this.height=640;}
 set id(v){this._id=v;ids.set(v,this)}get id(){return this._id}
 addEventListener(k,fn){(this.listeners[k]??=[]).push(fn)}
 emit(k,data={}){const e={target:this,relatedTarget:null,preventDefault(){},...data};for(const f of this.listeners[k]??[])f(e);this['on'+k]?.(e);}
 append(...els){for(const el of els)if(typeof el==='object'){el.parent=this;this.children.push(el)}}
 contains(el){for(let p=el;p;p=p.parent)if(p===this)return true;return false}
 setAttribute(k,v){this[k]=v}getContext(){return context}getBoundingClientRect(){return {left:0,top:0,width:Number.parseFloat(this.style.width)||360,height:Number.parseFloat(this.style.height)||640}}
 setPointerCapture(){}click(){this.emit('click')}focus(){document.activeElement=this;this.emit('focus')}remove(){}
}
for(const m of html.matchAll(/<([\w]+)[^>]*\bid="([^"]+)"/g)){const el=new Element(m[1]);el.id=m[2];}
for(const [id,value] of Object.entries({condition:'N0',preset:'A',viewport:'360x640',participant:'1',probeCondition:'F0',intent:'unknown',code:'unknown',preference:'no preference'}))ids.get(id).value=value;
for(const id of ['board','fire','cancel'])ids.get('interaction').append(ids.get(id));
const document={getElementById:id=>{if(!ids.has(id))throw Error('Missing DOM ID '+id);return ids.get(id)},createElement:tag=>new Element(tag),addEventListener(){},hidden:false,activeElement:null};
const windowEvents={};const sandbox={document,console,Image:class{decode(){return Promise.resolve()}},innerWidth:800,devicePixelRatio:1,navigator:{userAgent:'Node DOM double; no browser'},performance:{now:()=>now},requestAnimationFrame:fn=>raf.push(fn),matchMedia:()=>({matches:false}),queueMicrotask,Blob,URL,setTimeout,clearTimeout,addEventListener:(k,f)=>{windowEvents[k]=f}};sandbox.window=sandbox;sandbox.self=sandbox;sandbox.globalThis=sandbox;
await vm.runInNewContext('(async()=>{'+script+'})()',sandbox);
const api=sandbox.pineappleExperiment;assert.ok(api);
const tick=()=>{now+=1000/60;const f=raf.shift();assert.ok(f);f(now)};
function fresh(c='N0',vp='360x640'){ids.get('condition').value=c;ids.get('viewport').value=vp;api.reset(true);for(let i=0;i<183;i++)tick();assert.equal(api.engine.phase,'Active');}
for(const vp of ['320x568','360x640','412x732','640x360'])for(const c of ['F0','N0','N1']){fresh(c,vp);tick();}
fresh('N0');const board=ids.get('board'),p={clientX:180,clientY:440,timeStamp:now,pointerId:1,pointerType:'touch',button:0,buttons:1,isPrimary:true};
board.emit('pointerdown',p);board.emit('pointerup',p);assert.equal(api.engine.launches,1);board.emit('lostpointercapture',{pointerId:1});assert.equal(api.engine.launches,1);
fresh('N0');api.input.focus();document.activeElement=ids.get('fire');ids.get('interaction').emit('focusout',{relatedTarget:ids.get('fire')});await Promise.resolve();assert.ok(api.input.point);assert.equal(api.engine.excluded,false);
ids.get('fire').click();assert.equal(api.engine.launches,1);
fresh('N1');api.input.focus();document.activeElement=ids.get('condition');ids.get('interaction').emit('focusout',{relatedTarget:ids.get('condition')});await new Promise(r=>setTimeout(r,1));assert.equal(api.input.point,null);assert.equal(api.engine.excluded,true);assert.equal(api.engine.legacy.S.paused,true);
fresh('N0');board.emit('pointerdown',p);windowEvents.blur();board.emit('pointerup',p);assert.equal(api.engine.launches,0);assert.equal(api.engine.excluded,true);
fresh('N0');ids.get('condition').value='N0';api.reset();board.emit('pointerdown',p);for(let i=0;i<183;i++)tick();board.emit('pointerup',p);assert.equal(api.engine.launches,0);
assert.ok(drawCalls>0);
console.log('PASS: bundled app boot, all 12 condition/viewport render paths, touch release/capture loss, internal focus→Fire, blur exclusion and pre-GO press gating.');
console.log('Node DOM/Canvas double only; no pixels, browser events, device performance or human usability verified.');
// Exercise the actual guided UI state machine, including the primary lock and manual instruments.
ids.get('participant').value='1';ids.get('guided').click();assert.equal(api.engine.phase,'Preparing');
let guard=0,sawLock=false,sawTransfer=0;
while(api.protocol&&guard++<60){
 const taskText=ids.get('protocolStatus').textContent;
 const tasks=api.protocol;
 // Step number is a UI field deliberately exercised here, rather than a second scheduler.
 const index=Number(taskText.match(/^Step (\d+)/)?.[1]??1)-1,task=tasks[index];
 if(!task)throw Error('Missing protocol task '+taskText);
 if(task.kind==='practice'){ids.get('repeat').click();api.engine.start();for(let n=0;n<500;n++)tick();}
 if(['scored','transfer','optional-round','recovery'].includes(task.kind)){api.engine.start();for(let n=0;n<500;n++)tick();assert.equal(api.engine.phase,'Outcome');if(task.kind==='transfer')sawTransfer++;}
 if(task.kind==='rating'){
  ids.get('controlRating').value='4';ids.get('funRating').value='4';
  if(task.lockPrimary){
   const n=api.protocol.filter(v=>v.condition==='N1').length;assert.ok(n>0);
   ids.get('next').click();assert.ok(!api.notes.some(v=>v.type==='primary-lock'));
   for(const condition of ['F0','N0']){ids.get('probeCondition').value=condition;ids.get('probe').click();board.emit('pointerdown',{...p,clientX:160,clientY:440});api.engine.start();for(let n=0;n<500;n++)tick();}
   ids.get('primaryDone').checked=true;sawLock=true;
  }
 }
 if(task.kind==='replay-choice')ids.get('replayChoice').value='neither';
 ids.get('next').click();
}
assert.ok(guard<60);assert.ok(sawLock);assert.equal(sawTransfer,2);assert.equal(api.protocol,null);assert.ok(api.notes.some(v=>v.type==='primary-lock'));
console.log('PASS: actual guided UI blocks, mandatory F0/N0 independent-point lock, two B transfer attempts, optional replay choice, odd-ID recovery and completion.');
