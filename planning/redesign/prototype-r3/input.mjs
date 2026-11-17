import {clamp} from './engine.mjs';
export function pointInput(engine,{changed=()=>{}}={}){
 let owner=null,point=null,cancelled=false,keys=new Map();
 const active=()=>engine.condition!=='F0'&&engine.phase==='Active'&&!engine.legacy.S.paused&&!engine.inputLocked;
 const valid=p=>!!p&&p.x>=.06*engine.W&&p.x<=.94*engine.W&&p.y>=.50*engine.H&&p.y<=.90*engine.H;
 const isCancel=p=>{const x=engine.prefs.lh?8:engine.W-56;return p.x>=x&&p.x<=x+48&&p.y>=.5*engine.H-56&&p.y<=.5*engine.H-8;};
 const set=p=>{point=p;changed(p);};
 function cancel(reason='explicit') {const had=point!==null||owner!==null;owner=null;cancelled=false;keys.clear();set(null);if(had)engine.record({type:'cancellation',reason,intent:'unconfirmed'});return had;}
 function fire(){if(!active()||!valid(point))return false;engine.record({type:'fire-command',point:{...point}});return engine.fire(point);}
 return {
  get point(){return point},get owner(){return owner},get cancelled(){return cancelled},valid,isCancel,cancel,fire,
  reset(){owner=null;point=null;cancelled=false;keys.clear();changed(null);},
  focus(){if(active()&&!point)set({x:.5*engine.W,y:.70*engine.H});},
  down(p){if(!active()||owner!==null||p.button!==0||p.isPrimary===false)return false;if(engine.legacy.S.rc>0){engine.legacy.S.rc=0;engine.record({type:'resume-skip'});return false;}if(!valid(p))return false;owner=p.pointerId;cancelled=false;set({x:p.x,y:p.y});return true;},
  move(p){if(owner!==p.pointerId)return;if(isCancel(p)){cancelled=true;set(null);return;}if(!cancelled)set({x:p.x,y:p.y});},
  up(p){if(owner!==p.pointerId)return;const wasCancelled=cancelled;owner=null;cancelled=false;if(wasCancelled||!valid(p)){engine.record({type:'cancellation',reason:wasCancelled?'cancel-region':'outside-release',intent:'unconfirmed'});cancel('outside-or-cancel');return;}set({x:p.x,y:p.y});if(engine.prefs.nonhold)return;fire();set(null);},
  lost(id){if(owner===id)cancel('capture-loss');},
  pointerCancel(id){if(owner===id)cancel('pointercancel');},
  keyDown(key,repeat,now){if(!active()||repeat)return false;
   if(key==='Escape'){if(!cancel('escape'))engine.pause();return true;}
   if(!key.startsWith('Arrow'))return false;
   if(!point)set({x:.5*engine.W,y:.70*engine.H});
   keys.set(key,now+300);nudge(key);return true;
  },
  keyUp(key){keys.delete(key);},
  tick(now){if(!active()){keys.clear();return;}for(const [key,due] of keys)if(now>=due){nudge(key);keys.set(key,now+100);}},
 };
 function nudge(key){if(!point)return;
  let dx=0,dy=0;
  if(key==='ArrowLeft'&&!keys.has('ArrowRight'))dx=-.01*engine.W;
  if(key==='ArrowRight'&&!keys.has('ArrowLeft'))dx=.01*engine.W;
  if(key==='ArrowUp'&&!keys.has('ArrowDown'))dy=-.01*engine.H;
  if(key==='ArrowDown'&&!keys.has('ArrowUp'))dy=.01*engine.H;
  set({x:clamp(point.x+dx,.06*engine.W,.94*engine.W),y:clamp(point.y+dy,.5*engine.H,.9*engine.H)});
 }
}
