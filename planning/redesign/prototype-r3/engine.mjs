import {createLegacy} from './legacy.mjs';
export const SOURCE='4356ead15a5eb61693f33497515f0212cf01dd77';
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function firstCircleContact(r,dr,R,dR){
 const A=dr.x**2+dr.y**2-dR*dR,B=2*(r.x*dr.x+r.y*dr.y-R*dR),C=r.x*r.x+r.y*r.y-R*R;
 const eps=1e-12*Math.max(1,Math.abs(A),Math.abs(B),Math.abs(C));
 if(C<=eps)return 0;
 if(Math.abs(A)<=eps){if(Math.abs(B)<=eps)return null;const u=-C/B;return B<0&&u>=0&&u<=1?u:null;}
 let D=B*B-4*A*C,ed=1e-12*Math.max(1,B*B,Math.abs(4*A*C));if(D< -ed)return null;D=Math.max(0,D);
 const q=-.5*(B+(B>=0?1:-1)*Math.sqrt(D));const roots=q===0?[-B/(2*A)]:[q/A,C/q];
 return roots.filter(u=>u>=-1e-12&&u<=1+1e-12).sort((a,b)=>a-b).map(u=>clamp(u,0,1))[0]??null;
}
export function createEngine({width=360,height=640,condition='N0',preset='A',images={},prefs={}}={}){
 const listeners={},surface={addEventListener(t,fn){(listeners[t]??=[]).push(fn)},setPointerCapture(id){e?.capture?.(id)},getBoundingClientRect(){return {left:0,top:0}}};
 let e,events=[],attempt=0,source='direct';
 const legacy=createLegacy(surface,event=>{
  if(!e)return;
  if(event.type==='launch'){
   e.launches++; const sh=event.shot;
   if(sh.soft){const pg=legacy.actors.find(pg=>{const T=.42+.38*(1-pg.p),p=Math.min(.94,pg.p+pg.v*T);return Math.abs(sh.T-T)<1e-9&&Math.abs(sh.xE-legacy.px(pg.xn,p))<1e-7;});event.selectedId=pg?.id??null;}
  }
  if(event.type==='hit')e.sendHomes++;
  if(event.type==='puff')e.effects.push({x:event.x,y:event.y,t:0,kind:'puff'});
  if(event.type==='hit'){const p=legacy.actors.find(a=>a.id===event.id),c=legacy.penCenter(p);e.effects.push({x:c.x,y:c.y,t:0,kind:'hit'});}
  e.record({...event,source});
 },images);
 e={W:width,H:height,condition,preset,prefs,legacy,phase:'Preparing',countdown:3,attempt,launches:0,sendHomes:0,effects:[],events,outcome:null,excluded:false,
  record(event){events.push({attempt:e.attempt,condition:e.condition,preset:e.preset,phase:e.phase,time:legacy.S?.t??0,injected:!!(e.recovery&&!e.recovery.ready),...event});},
  reset({condition=e.condition,preset=e.preset,newBlock=false,width=e.W,height=e.H,prefs=e.prefs}={}){
   if(e.phase==='Active'||e.phase==='Countdown')e.interrupt('reset');
   e.W=width;e.H=height;e.condition=condition;e.preset=preset;e.prefs=prefs;e.attempt=++attempt;e.launches=0;e.sendHomes=0;e.effects=[];e.outcome=null;e.excluded=false;e.requiresReset=false;e.phase='Preparing';e.countdown=3;e.inputLocked=false;e.recovery=null;
   legacy.configure(width,height,prefs);if(newBlock)legacy.sv.thr=0;
   const p=preset==='A'?.5:.27;
   legacy.reset([-.96,-.28,.4,.85].map((xn,i)=>({id:i+1,kind:'rh',xn,x0:xn,p:i===3?(preset==='A'?.75:.8):p,v:i===3&&preset==='B'?.18:.1,base:.1,st:'walk',t:0,mood:'happy',ph:0,av:0,hp:1,big:1,ev:0,fz:0,pop:0,side:i%2?1:-1,hat:false,puff:0,a:1,gear:null})));
   e.support={x:.08*width,y:legacy.penCenter({p:.67,big:1}).y,r:Math.max(24,.055*width),removed:false};
   e.cart={x:.30*width,y:e.support.y,r:.055*width,release:null,stopped:false};e.record({type:'reset',width,height,startingThr:legacy.sv.thr,randomTapeSeed:'0x504431',randomTape:'LCG32-1664525-1013904223-65536'});e.phase='Countdown';
  },
  start(){if(e.phase!=='Countdown')return;legacy.clearInput();e.phase='Active';e.record({type:'go'});},
  uiTick(dt){if(e.phase==='Countdown'&&!legacy.S.paused){e.countdown=Math.max(0,e.countdown-dt);if(e.countdown===0)e.start();}},
  interrupt(reason){if(!['Countdown','Active'].includes(e.phase))return;e.excluded=true;e.requiresReset||=reason==='resize'||reason==='orientation';e.record({type:'interruption',reason});legacy.S.paused=true;if(e.condition==='F0')legacy.haltInput();else legacy.clearInput();},
  pause(){e.interrupt('pause');},
  resume(){if(!legacy.S.paused||e.requiresReset)return;legacy.S.paused=false;legacy.S.rc=3;e.record({type:'resume',excluded:true});},
  inputF(type,event){if(e.condition!=='F0'||e.phase!=='Active'||e.inputLocked)return;
   e.record({type:'pointer',action:type,pointerId:event.pointerId,pointerType:event.pointerType,buttons:event.buttons,x:event.clientX,y:event.clientY,stamp:event.timeStamp});
   const before=e.launches,eventStart=events.length;for(const fn of listeners[type]??[])fn(event);
   if(type==='pointerup'&&before===e.launches&&!events.slice(eventStart).some(v=>v.type==='rejection'))e.record({type:'uncommitted-release',intent:'unknown'});
  },
  startRecovery(){if(e.preset!=='A'||e.condition==='N1')throw Error('Recovery uses A, F0/N0 only');e.recovery={starts:[],releases:[],ready:false};e.inputLocked=true;},
  fire(point){if(e.condition==='F0'||e.phase!=='Active'||e.inputLocked||!point||point.x<.06*e.W||point.x>.94*e.W||point.y<.5*e.H||point.y>.9*e.H)return false;return legacy.point(point);},
  step(dt){
   if(legacy.S.paused)return;
   for(const f of e.effects)f.t+=dt;e.effects=e.effects.filter(f=>f.t<.35);
   if(e.phase==='Outcome'){for(const pg of legacy.actors)if(pg.st!=='walk'&&pg.st!=='gone')legacy.updatePenguin(pg,dt);return;}
   if(e.phase!=='Active')return;
   if(legacy.S.rc>0){legacy.S.rc=Math.max(0,legacy.S.rc-dt);return;}
   if(e.recovery&&!e.recovery.ready){
    const R=e.recovery;
    for(let i=0;i<2;i++){
     const release=[.10,.60][i],down=release-.06;
     if(!R.starts[i]&&legacy.S.t+1e-10>=down){R.starts[i]=true;const evt={pointerId:900+i,pointerType:'touch',buttons:1,button:0,clientX:e.W*.5,clientY:e.H*.93,timeStamp:legacy.S.t*1000,preventDefault(){}};R['event'+i]=evt;e.inputLocked=false;if(e.condition==='F0')e.inputF('pointerdown',evt);e.inputLocked=true;}
     if(R.starts[i]&&!R.releases[i]&&legacy.S.t+1e-10>=release){
      const P={x:.55*e.W,y:.50*e.H};source='injected';e.inputLocked=false;
      if(e.condition==='F0'){
       const o=legacy.pouchPos(),v={x:P.x-o.x,y:P.y-o.y},len=Math.hypot(v.x,v.y),targetP=clamp((P.y-.47*e.H+.048*Math.min(.3*e.W,.3*e.H))/(.46*e.H-.252*Math.min(.3*e.W,.3*e.H)),.1,.88),speed=.8+(.88-targetP)/.2;
       const ev0=R['event'+i],travel=speed*e.H*Math.max(30,legacy.S.t*1000-ev0.timeStamp)/1000;
       const evt={...ev0,clientX:ev0.clientX+v.x/len*travel,clientY:ev0.clientY+v.y/len*travel,timeStamp:legacy.S.t*1000};
       e.inputF('pointermove',evt);e.inputF('pointerup',{...evt,buttons:0});
      }else legacy.point(P);
      e.inputLocked=true;source='direct';R.releases[i]=true;const sh=legacy.shots.at(-1);
      if(!sh||sh.soft||Math.hypot(sh.xE-P.x,sh.yE-P.y)>4)throw Error('Recovery trace does not meet the frozen specification');
      e.record({type:'injected-miss',nominalTime:release,actualTime:legacy.S.t,x:sh.xE,y:sh.yE});
     }
    }
    if(R.releases[1]&&legacy.S.cd===0){R.ready=true;e.inputLocked=false;e.record({type:'recovery-handoff'});}
   }
   const t0=legacy.S.t;legacy.advanceClocks(dt,e.condition!=='F0');const t1=legacy.S.t;
   e.record({type:'step',dt});
   for(let i=legacy.shots.length-1;i>=0;i--){const sh=legacy.shots[i],ext=sh.ext,ph=sh.ph;legacy.updateShot(sh,dt);if(sh.ext&&!ext)e.record({type:'miss-continuation',endpoint:{x:sh.xE,y:sh.yE},T:sh.T,pEnd:sh.pEnd});if(sh.ph===1&&ph===0)e.record({type:'empty-landing',x:sh.xE,y:sh.yE});if(sh.dead)legacy.shots.splice(i,1);}
   const contacts=[];
   if(e.condition==='N1'&&e.cart.release!==null&&!e.cart.stopped&&e.cart.release<=t0){
    const end=e.cart.release+.46/.35;
    for(const pg of legacy.actors){if(pg.st!=='walk')continue;
     const lo=Math.max(t0,e.cart.release),hi=Math.min(t1,end,t0+Math.max(0,(.95-pg.p)/pg.v));if(hi<lo)continue;
     const at=t=>{const p=pg.p+pg.v*(t-t0),c=legacy.penCenter({...pg,p});return {...c,p}};
     const a=at(lo),b=at(hi),xa=e.cartAt(lo),xb=e.cartAt(hi);
     const r={x:xa-a.x,y:e.cart.y-a.y},dr={x:xb-b.x-r.x,y:e.cart.y-b.y-r.y};
     const u=firstCircleContact(r,dr,e.cart.r+.55*a.s,.55*(b.s-a.s));
     if(u!==null)contacts.push({time:lo+(hi-lo)*u,pg,p:a.p+(b.p-a.p)*u});
    }
    contacts.sort((a,b)=>Math.abs(a.time-b.time)<=1e-7?a.pg.id-b.pg.id:a.time-b.time);
   }
   const hitIds=new Set();
   for(const c of contacts){if(c.pg.st!=='walk')continue;c.pg.p=c.p;const center=legacy.penCenter(c.pg);source='cart';legacy.hitPenguin(c.pg,center.x,center.y-center.s*.2);source='direct';c.pg.t=0;hitIds.add(c.pg.id);e.record({type:'cart-contact',id:c.pg.id,contactTime:c.time,x:center.x,y:center.y});}
   for(let i=legacy.actors.length-1;i>=0;i--)if(!hitIds.has(legacy.actors[i].id))legacy.updatePenguin(legacy.actors[i],dt);
   if(e.cart.release!==null){e.cart.x=e.cartAt(t1);if(!e.cart.stopped&&t1>=e.cart.release+.46/.35){e.cart.stopped=true;e.record({type:'cart-stop',stopTime:e.cart.release+.46/.35});}}
   if(legacy.actors.every(p=>p.st!=='walk')||t1>=18){e.phase='Outcome';e.outcome={clean:e.sendHomes===4&&legacy.S.bumps===0,complete:legacy.actors.every(p=>p.st!=='walk'),boops:legacy.S.bumps,sendHomes:e.sendHomes,launches:e.launches,defenseTime:t1,cheer:legacy.S.cheer,excluded:e.excluded};legacy.clearInput();e.record({type:'outcome',...e.outcome});}
  },
  cartAt(t){return e.W*(.30+.35*clamp(t-(e.cart.release??t),0,.46/.35));},
  snapshot(){return JSON.parse(JSON.stringify({phase:e.phase,condition:e.condition,preset:e.preset,S:legacy.S,actors:legacy.actors,shots:legacy.shots,support:e.support,cart:e.cart,randomIndex:legacy.tapeIndex,outcome:e.outcome}));},
 };
 legacy.setSupportResolver(sh=>{
  if(e.condition!=='N1'||e.support.removed||Math.hypot(sh.xE-e.support.x,sh.yE-e.support.y)>e.support.r)return false;
  e.support.removed=true;e.cart.release=legacy.S.t;e.record({type:'support-release',x:sh.xE,y:sh.yE});e.effects.push({x:e.support.x,y:e.support.y,t:0,kind:'puff'});return true;
 });
 e.reset({newBlock:true});return e;
}
