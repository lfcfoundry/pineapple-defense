import {createEngine,SOURCE} from './engine.mjs';
import {pointInput} from './input.mjs';
import {loadImages,renderer} from './render.mjs';
import {EvenDt} from './even-dt.mjs';
import {schedule,questions,scripts,p95} from './study.mjs';
const $=id=>document.getElementById(id),cv=$('board'),composite=$('interaction');
let e,input,paint,even=new EvenDt(),last=null,pending=null,serial=0,protocol=null,slot=0,practice=0,frames=[],responses=[],coalesced=0,notes=[],trialLabels=new Map(),lastPhase='',marking=false,intended=null,heldBeforeGo=new Set(),blockThrows={},probeResults=new Set(),instructionStart=null;
const images=await loadImages();
function selectedSize(){const [w,h]=$('viewport').value.split('x').map(Number);return [Math.min(w,innerWidth),Math.min(w,innerWidth)*h/w];}
function prefs(){return {lh:$('left').checked,calm:$('calm').checked||matchMedia('(prefers-reduced-motion: reduce)').matches,hc:$('contrast').checked,nonhold:$('nonhold').checked};}
function newTrial(newBlock=false){
 for(const id of [input?.owner,e?.legacy.drag?.id,e?.legacy.hold?.id])if(id!==null&&id!==undefined){try{if(cv.hasPointerCapture?.(id))cv.releasePointerCapture(id)}catch{}}
 const [width,height]=selectedSize();
 if(!e){e=createEngine({width,height,images,condition:$('condition').value,preset:$('preset').value,prefs:prefs()});input=pointInput(e,{changed(point){if(pending)coalesced++;pending=point?{point:{...point},receipt:performance.now()}:null;}});paint=renderer(cv,images);e.capture=id=>{try{cv.setPointerCapture(id)}catch{}};}
 else e.reset({width,height,condition:$('condition').value,preset:$('preset').value,newBlock,prefs:prefs()});
 input.reset();even.reset();last=null;pending=null;heldBeforeGo.clear();frames=[];responses=[];coalesced=0;lastPhase='Countdown';serial++;marking=false;intended=null;
 cv.style.width=width+'px';cv.style.height=height+'px';cv.setAttribute('aria-label',e.condition+' Pineapple Defense aiming board');
 $('instruction').textContent='Send the penguins home. Keep the stand cheerful. You can retry. '+(e.preset==='B'&&e.condition!=='F0'?'Press where it should land, move to correct if needed, lift to throw. Penguins keep moving.':scripts[e.condition]);
 $('fire').hidden=$('cancel').hidden=e.condition==='F0';
 trialLabels.set(e.attempt,{kind:protocol?.[slot]?.kind??'explore',stage:protocol?.[slot]?.stage??null,block:protocol?.[slot]?.block??null,slot:protocol?.[slot]?.slot??null});
 e.record({type:'environment',source:SOURCE,primaryID:protocol?Number($('participant').value):null,userAgent:navigator.userAgent,viewport:[width,height],DPR:devicePixelRatio,prefs:prefs(),label:trialLabels.get(e.attempt)});
 $('readings').textContent='Preparing countdown';
}
function local(ev){const r=cv.getBoundingClientRect();return {x:ev.clientX-r.left,y:ev.clientY-r.top,pointerId:ev.pointerId,pointerType:ev.pointerType,button:ev.button,buttons:ev.buttons,isPrimary:ev.isPrimary,clientX:ev.clientX-r.left,clientY:ev.clientY-r.top,timeStamp:ev.timeStamp,preventDefault:()=>ev.preventDefault(),getCoalescedEvents:()=>[]};}
function stopN(reason){input.cancel(reason);}
for(const type of ['pointerdown','pointermove','pointerup','pointercancel'])cv.addEventListener(type,ev=>{
 if(!e)return;const p=local(ev);
 if(type==='pointerdown'&&marking){intended={x:p.x,y:p.y,actor:2,stamp:performance.now()};notes.push({type:'independent-intention',attempt:e.attempt,...intended});marking=false;$('instruction').textContent='Point recorded. Restarting the identical GO fixture for the action.';const keep=intended;e.reset();input.reset();even.reset();last=null;intended=keep;trialLabels.set(e.attempt,{kind:'point-probe',condition:e.condition});e.record({type:'trial-role',kind:'point-probe'});return;}
 if(e.phase!=='Active'){if(type==='pointerdown')heldBeforeGo.add(p.pointerId);if(type==='pointerup'||type==='pointercancel')heldBeforeGo.delete(p.pointerId);return;}
 if(heldBeforeGo.has(p.pointerId)){if(type==='pointerup'||type==='pointercancel')heldBeforeGo.delete(p.pointerId);return;}
 if(e.condition==='F0'){e.inputF(type,p);return;}
 if(type==='pointerdown'){if(input.down(p)){try{cv.setPointerCapture(ev.pointerId)}catch{}ev.preventDefault();}}
 if(type==='pointermove'){input.move(p);}
 if(type==='pointerup'){input.up(p);}
 if(type==='pointercancel'){input.pointerCancel(p.pointerId);}
 e.record({type:'pointer',action:type,pointerId:p.pointerId,pointerType:p.pointerType,x:p.x,y:p.y,stamp:p.timeStamp,receipt:performance.now(),intent:'unknown'});
},{passive:false});
cv.addEventListener('lostpointercapture',ev=>{if(e.condition!=='F0')input.lost(ev.pointerId)});
cv.addEventListener('contextmenu',ev=>ev.preventDefault());
cv.addEventListener('focus',ev=>{if(!composite.contains(ev.relatedTarget))input.focus();});
composite.addEventListener('focusout',ev=>{
 if(ev.relatedTarget&&composite.contains(ev.relatedTarget))return;
 setTimeout(()=>{if(!composite.contains(document.activeElement)&&e?.condition!=='F0'&&e?.phase==='Active'&&!e?.excluded){stopN('composite-focus');e.interrupt('composite-focus');}},0);
});
$('fire').addEventListener('click',()=>input.fire());$('cancel').addEventListener('click',()=>input.cancel());
for(const id of ['fire','cancel'])$(id).addEventListener('keydown',ev=>{if(ev.repeat&&['Enter',' '].includes(ev.key))ev.preventDefault();});
composite.addEventListener('keydown',ev=>{
 if(ev.ctrlKey||ev.metaKey||ev.altKey)return;
 if(ev.key==='p'||ev.key==='P'){if(!ev.repeat)togglePause();ev.preventDefault();return;}
 if(e.condition==='F0'){if(ev.key==='Escape'&&!ev.repeat){togglePause();ev.preventDefault();}return;}
 if(ev.repeat&&ev.key.startsWith('Arrow')){ev.preventDefault();return;}
 if(input.keyDown(ev.key,ev.repeat,performance.now()))ev.preventDefault();
});
composite.addEventListener('keyup',ev=>input.keyUp(ev.key));
function togglePause(){stopN('pause');if(e.legacy.S.paused)e.resume();else e.pause();last=null;even.reset();}
let pausePointerIntent=null;$('pause').onpointerdown=()=>{pausePointerIntent=!e.legacy.S.paused;};
$('pause').onclick=()=>{if(pausePointerIntent===null)togglePause();else {stopN('pause');if(pausePointerIntent)e.pause();else e.resume();last=null;even.reset();pausePointerIntent=null;}};
$('reset').onclick=()=>newTrial(false);
$('block').onclick=()=>{if(protocol)return;newTrial(true);};
for(const id of ['condition','preset','viewport','left','calm','contrast','nonhold'])$(id).addEventListener('change',()=>{if(protocol)return;newTrial(id==='condition');});
function interrupt(reason){if(e?.phase==='Active'||e?.phase==='Countdown'){stopN(reason);e.interrupt(reason);last=null;even.reset();}}
window.addEventListener('blur',()=>interrupt('window-blur'));
document.addEventListener('visibilitychange',()=>{if(document.hidden)interrupt('hidden-tab');});
window.addEventListener('resize',()=>interrupt('resize'));
function recordPerformance(){e.record({type:'software-performance',frames:frames.length,frameP95:p95(frames),responseP95:p95(responses),responses:responses.length,coalesced,physicalLatencyMeasured:false});}
function tick(now){
 requestAnimationFrame(tick);if(!e||document.hidden){last=null;return;}
 if(last===null){last=now;paint(e,input);return;}const gap=now-last;last=now;
 const active=e.phase==='Active'&&!e.legacy.S.paused&&e.legacy.S.rc===0;
 const dt=Math.min(even.next(gap)||gap,50)/1000;
 if(marking){paint(e,input);return;}
 const beforeUI=e.phase;e.uiTick(gap/1000);input.tick(now);if(!(beforeUI==='Countdown'&&e.phase==='Active'))e.step(dt);
 if(active){frames.push(gap);if(protocol?.[slot]?.kind==='practice')practice+=dt;}
 paint(e,input);
 if(pending){const delay=performance.now()-pending.receipt;responses.push(delay);e.record({type:'point-painted',point:pending.point,receipt:pending.receipt,drawComplete:performance.now(),latency:delay,softwareProxy:true});pending=null;}
 if(e.phase!==lastPhase){if(e.phase==='Active'){even.reset();last=now;input.reset();}
  if(e.phase==='Outcome'){input.reset();recordPerformance();if(intended){probeResults.add(e.condition);const launch=e.events.find(v=>v.attempt===e.attempt&&v.type==='launch');notes.push({type:'intended-point-result',attempt:e.attempt,intended,endpoint:launch?{x:launch.shot.xE,y:launch.shot.yE}:null,normalizer:2*.55*e.legacy.psz(e.preset==='A'?.5:.27)});}}
  lastPhase=e.phase;
 }
 if(protocol?.[slot]?.kind==='practice'&&practice>=60&&e.phase==='Active'){interrupt('practice-cap');}
 $('status').textContent=`${e.condition} · ${e.preset} · ${e.phase}${e.excluded?' · EXCLUDED':''} · ${e.legacy.S.cd>0?'Reloading':'Ready'}`;
 $('readings').textContent=`${e.legacy.S.t.toFixed(2)} active s · ${e.launches} launches · ${e.legacy.S.bumps} boops · ${e.sendHomes} sent home`;
}
function setProtocolStep(){
 const task=protocol[slot];$('protocolStatus').textContent=`Step ${slot+1}/${protocol.length}: ${task.kind} · ${task.condition??''} ${task.preset??''}`;
 if(task.kind==='complete'){$('protocolStatus').textContent='Protocol complete. Export locally with consent; no human gates are automatically certified.';return;}
 if(['understanding','transfer-feedback','replay-choice'].includes(task.kind)){$('ratings').hidden=true;$('instruction').textContent=task.kind==='understanding'?'Record unprompted checklist items 4–5 without teaching answers. Normal support outline remains in B.':task.kind==='transfer-feedback'?'Show only actual boops/send-homes. Ask: What would you change? Do not suggest a target or timing.':'Choose an optional extra round: N0, N1, or neither. No reward.';return;}
 if(task.kind==='rating'){blockThrows[task.condition]=e.legacy.sv.thr;$('ratings').hidden=false;$('instruction').textContent='Record the fixed ratings before continuing. '+(task.lockPrimary?'Record pair preference, items 1–3 and the two independent-point probes before N1.':'');return;}
 $('ratings').hidden=true;$('condition').value=task.condition;$('preset').value=task.preset;practice=0;newTrial(task.kind==='practice');if(task.kind==='practice'){e.phase='Preparing';instructionStart=performance.now();$('protocolStatus').textContent+=' · read script once (≤20 s), then Begin / repeat';}if(task.kind==='recovery'){trialLabels.set(e.attempt,{kind:'recovery'});e.startRecovery();}
}
$('guided').onclick=()=>{
 const id=Number($('participant').value);protocol=schedule(id);slot=0;probeResults.clear();blockThrows={};for(let i=0;i<5;i++)$('q'+i).checked=false;$('primaryDone').checked=false;$('controlRating').value=$('funRating').value='';$('intent').value=$('code').value='unknown';$('eventIndex').value='';e.record({type:'session-start',id});notes.push({type:'protocol',id,ageBand:id<=6?'7–10':'18+',order:protocol});
 for(const key of ['condition','preset','viewport','left','calm','contrast','nonhold','participant','guided'])$(key).disabled=true;
 setProtocolStep();
};
$('next').onclick=()=>{
 if(!protocol)return;
 const task=protocol[slot];
 if(['scored','transfer','optional-round','recovery'].includes(task.kind)&&e.phase!=='Outcome'&&!e.excluded){$('protocolStatus').textContent='Finish this scored attempt first.';return;}
 if(task.kind==='rating'){
  const control=Number($('controlRating').value),fun=Number($('funRating').value);if(!control||!fun){$('protocolStatus').textContent='Record both ratings first.';return;}
  if(task.lockPrimary&&(!$('primaryDone').checked||!probeResults.has('F0')||!probeResults.has('N0'))){$('protocolStatus').textContent='Complete checklist items 1–3 and both intention probes before locking the primary judgment.';return;}
  notes.push({type:'rating',block:task.block,condition:task.condition,control,fun,preference:$('preference').value,reason:$('reason').value,primaryLocked:task.lockPrimary});
  if(task.lockPrimary)notes.push({type:'primary-lock',items:questions.slice(0,3).map((question,i)=>({question,unpromptedPass:$('q'+i).checked})),probes:[...probeResults]});
  $('controlRating').value=$('funRating').value='';$('reason').value='';
  
 }
 if(['scored','transfer','optional-round','recovery'].includes(task.kind)&&e.excluded&&!task.replaced){task.replaced=true;notes.push({type:'replacement',slot});newTrial();if(task.kind==='recovery')e.startRecovery();return;}
 if(e.excluded)notes.push({type:'missing-slot',slot});
 if(task.kind==='understanding')notes.push({type:'understanding',items:questions.map((question,i)=>({question,unpromptedPass:$('q'+i).checked}))});
 if(task.kind==='replay-choice'){const choice=$('replayChoice').value;if(!choice){$('protocolStatus').textContent='Record N0, N1, or neither.';return;}notes.push({type:'replay-choice',choice});if(choice==='neither')slot++;else protocol[slot+1].condition=choice;}
 if(task.kind==='complete'){protocol=null;for(const key of ['condition','preset','viewport','left','calm','contrast','nonhold','participant','guided'])$(key).disabled=false;$('protocolStatus').textContent='Session closed. Export with consent before reloading.';return;}

 slot++;setProtocolStep();
};
$('repeat').onclick=()=>{if(protocol?.[slot]?.kind==='practice'&&e.phase==='Preparing'){notes.push({type:'instruction-duration',block:protocol[slot].block,seconds:(performance.now()-instructionStart)/1000,withinBudget:performance.now()-instructionStart<=20000});e.phase='Countdown';e.countdown=3;last=null;even.reset();return;}if(protocol?.[slot]?.kind==='practice'&&practice>=60){$('protocolStatus').textContent='Practice cap reached. Continue to scored attempts.';return;}newTrial();};
$('recovery').onclick=()=>{if(e.condition==='N1'||e.preset!=='A'){$('protocolStatus').textContent='Recovery requires F0/N0 preset A.';return;}newTrial();trialLabels.set(e.attempt,{kind:'recovery'});e.record({type:'trial-role',kind:'recovery'});e.startRecovery();};
$('probe').onclick=()=>{$('condition').value=$('probeCondition').value;if(blockThrows[$('condition').value]!==undefined)e.legacy.sv.thr=blockThrows[$('condition').value];newTrial();trialLabels.set(e.attempt,{kind:'point-probe'});marking=true;$('instruction').textContent='Independent-point probe: on this frozen GO scene, mark where you intend to land to send ID2 (second from left) home. The actual reticle is hidden. Then perform your shot in the restarted live scene.';};
$('annotationSave').onclick=()=>{notes.push({type:'human-coding',attempt:e.attempt,eventIndex:$('eventIndex').value===''?null:Number($('eventIndex').value),code:$('code').value,intent:$('intent').value,checklist:questions.map((question,i)=>({question,pass:$('q'+i).checked})),text:$('annotation').value,stamp:performance.now()});$('annotation').value='';};
$('export').onclick=()=>{
 if(!$('consent').checked){$('exportStatus').textContent='Local export requires consent. Nothing has been stored or sent.';return;}
 const data={format:'pineapple-experiment-r3-1',source:SOURCE,created:new Date().toISOString(),device:$('device').value,userAgent:navigator.userAgent,protocol,slot,trialRoles:[...trialLabels.entries()],events:e.events,notes,qualification:'Browser/human gates not automatically certified'};
 const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='pineapple-experiment-r3.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),0);$('exportStatus').textContent='Exported locally; no network or campaign save.';
};
questions.forEach((q,i)=>{const label=document.createElement('label'),box=document.createElement('input');box.type='checkbox';box.id='q'+i;label.append(box,' Unprompted pass: '+q);$('questions').append(label);});
newTrial(true);requestAnimationFrame(tick);
// Explicit local diagnostic surface. It never reads a campaign save or uploads data.
window.pineappleExperiment={get engine(){return e},get input(){return input},reset:newTrial,get notes(){return notes},get protocol(){return protocol},get serial(){return serial}};
