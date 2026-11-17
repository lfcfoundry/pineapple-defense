"""Read-only pinned-source extraction. Writes only this isolated experiment directory."""
from pathlib import Path
import subprocess,re,json,hashlib
P=Path(__file__).resolve().parent
SHA='4356ead15a5eb61693f33497515f0212cf01dd77'
def source(path): return subprocess.check_output(['git','show',SHA+':'+path],cwd=P).decode()
g=source('src/game.js')
def function(name):
 start=g.index('function '+name+'('); brace=g.index('{',start); depth=0; mode='';i=brace
 while i<len(g):
  ch=g[i];nx=g[i:i+2]
  if mode in ["'",'"','`']:
   if ch=='\\': i+=2;continue
   if ch==mode:mode=''
  elif mode=='//':
   if ch=='\n':mode=''
  elif mode=='/*':
   if nx=='*/': mode='';i+=2;continue
  elif ch in "'\"`": mode=ch
  elif nx in ['//','/*']: mode=nx;i+=2;continue
  elif ch=='{':depth+=1
  elif ch=='}':
   depth-=1
   if not depth:return g[start:i+1]
  i+=1
 raise ValueError(name)
names=['sc','px','py','psz','newState','bump','hitPenguin','avoidBoss','updatePenguin','penCenter','targets','throwAt','landShot','updateShot','slingGeom','pouchPos','drawAimArc','drawPenguin','drawShot','star']
inputtext=g[g.index('var drag = null;'):g.index('\nvar picks = document.querySelectorAll')]
# No campaign entry point, persistence initializer, networking, helper update or title boot is copied.
header='''// MIT License, Copyright (c) 2026 LFC Foundry. Pinned source capsule; see PROVENANCE.json.
export function createLegacy(surface, emit = () => {}, images = {}) {
const Math = Object.create(globalThis.Math); let tapeIndex=0;
let seed=0x504431; const tape=Array.from({length:65536},()=>{seed=(globalThis.Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;});
Math.random=()=>{if(tapeIndex===tape.length)throw Error('Cosmetic tape exhausted');return tape[tapeIndex++];};
let W=360,H=640,hy=.47*H,gy=.93*H,FW=.5*W,size0=.3*W;
let S, penguins=[],shots=[],bits=[],pops=[],rings=[],flys=[];
let sv={hp:0,cp:0,ef:0,ib:0,arc:0,sp:0,hs:0,sk:0,bv:0,thr:0,hc:0,dg:1};
const TYPES={classic:{cd:.42,arc:1,T:1,rad:.55,splash:0,size:1,img:'pa'}},COST={classic:0},PAY={rh:1},RAID_N=[0];
const TAP_MIN=.03,FLICK_MIN=.025,BUF_S=.15,COOLDOWN=.42,AIMW=.4,AUTO_TURN=.12;
let slowK=1,K=null,wk=null,calm=false,curType='classic',curSrc=0;
const cv=surface; let ctx=null; const IMG=images,elHint={hidden:false};
const PINE_COL=['#ffd23f'],SNOW_COL=['#fff'],HIT_WORDS=['Bonk!','Home time!','Pineapple hat!'];
const tableHit=()=>false,zoneHit=()=>false,sceneTap=()=>false;
const typeCost=()=>0,effType=()=>TYPES.classic,rsg=()=>false,stageNo=()=>1,bossOpen=()=>false,champLand=()=>false;
const saveSoon=()=>{},award=()=>{},reward=()=>{},stopHit=()=>{},shakeAdd=()=>{},cmbHit=()=>{},umbrellaSave=()=>false;
const evolveStep=()=>{},stepPuff=()=>{},evolveLook=()=>({sx:1,sy:1,rot:0}),drawEvolveGlow=()=>{},mip=x=>x;
const DANGER_P=.78;
function burst(x,y,n){emit({type:'puff',x,y,n});}
function popText(x,y,text){emit({type:'text',x,y,text});}
function endStage(){throw Error('Campaign boundary reached');}
function drawShadow(x,y,w,a){ctx.save();ctx.globalAlpha=a*.22;ctx.fillStyle='#2a120d';ctx.beginPath();ctx.ellipse(x,y,w*1.3,w*.25,0,0,6.3);ctx.fill();ctx.restore();}
function drawDanger(x,y,s){ctx.save();ctx.strokeStyle='#ce621c';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y,s*.55,s*.55,0,0,6.3);ctx.stroke();ctx.restore();}
'''
# Input tableHit is an explicit inert dependency; omit the original definition only.
a=inputtext.index('function tableHit(');b=inputtext.index('var hov =',a)
inputtext=inputtext[:a]+inputtext[b:]
body='\n\n'.join(function(n) for n in names)+'\n'+inputtext
footer='''
const originalThrow=throwAt, originalLand=landShot, originalHit=hitPenguin, originalBump=bump;
let supportResolver=()=>false;
throwAt=function(...args){const before=shots.length;originalThrow(...args);if(shots.length>before){const s=shots.at(-1);emit({type:'launch',args:args.slice(0,5),shot:{...s,ty:{...s.ty}}});}else emit({type:'rejection',reason:S.cd>0?'cooldown':'state'});};
landShot=function(s,soft){
 const ordinary=penguins.some(pg=>pg.st==='walk'&&Math.hypot(penCenter(pg).x-s.xE,penCenter(pg).y-s.yE)/penCenter(pg).s<.55);
 if(!ordinary&&supportResolver(s))return true;
 return originalLand(s,soft);
};
hitPenguin=function(pg,x,y){originalHit(pg,x,y);emit({type:'hit',id:pg.id,x,y});};
bump=function(pg){originalBump(pg);emit({type:'boop',id:pg.id});};
return {
 get S(){return S},get sv(){return sv},get actors(){return penguins},get shots(){return shots},get drag(){return drag},get hold(){return hold},get tapeIndex(){return tapeIndex},
 sc,px,py,psz,penCenter,targets,pouchPos,slingGeom,throwAt,updateShot,updatePenguin,hitPenguin,bump,
 draw(context){ctx=context;},drawPenguin,drawShot,drawAimArc,
 configure(w,h,prefs={}){W=w;H=h;hy=.47*H;gy=.93*H;FW=.5*W;size0=Math.min(.3*W,.3*H);Object.assign(sv,prefs);calm=!!prefs.calm;},
 reset(actors){const thr=sv.thr;newState();Object.assign(S,{stage:1,wave:1,mode:'run',modeT:0,spawned:4,toSpawn:4,id:4});penguins=actors;sv.thr=thr;tapeIndex=0;drag=null;hold=null;hov=[];hovLock=0;hs=null;hsLock=0;},
 clearInput(){drag=null;hold=null;hov=[];hovLock=0;hs=null;hsLock=0;},
 haltInput(){hold=null;},
 setSupportResolver(fn){supportResolver=fn;},
 point(P){if(S.cd>0||S.over||S.paused||S.rc>0){emit({type:'rejection',reason:S.cd>0?'cooldown':'state'});return false;}const O=pouchPos(),pEnd=Math.max(.1,Math.min(.88,(P.y-hy)/(gy-hy))),T=.42+.38*(1-pEnd);
 const arc=Math.max(.05*H,Math.min(H*(.14+.20*(1-pEnd)),(O.y+P.y)/2-.06*H));
 const s={ty:TYPES.classic,s0:slingGeom().ps*.92,x0:O.x,y0:O.y,xE:P.x,yE:P.y,pEnd,t:0,T,arc,spin:(Math.random()<.5?-1:1)*7,ph:0,soft:false};
 S.cd=S.cdMax=.42;S.thrown=true;sv.thr=Math.min(99,sv.thr+1);shots.push(s);emit({type:'launch',shot:{...s,ty:{...s.ty}}});return true;},
 advanceClocks(dt,newControl){S.t+=dt;S.cd=Math.max(0,S.cd-dt);S.wob=Math.max(0,S.wob-dt*1.6);let ta=0;if(drag){const cu=drag.pts.at(-1),dx=cu.x-drag.sx,dy=cu.y-drag.sy;if(Math.hypot(dx,dy)>.02*Math.min(W,H))ta=Math.max(-AUTO_TURN,Math.min(AUTO_TURN,Math.atan2(dx,-dy)*.3));}S.sa=newControl?0:S.sa+(ta-S.sa)*Math.min(1,dt*14);},
};
}
'''
(P/'legacy.mjs').write_text(header+body+footer)
assets={n:source('src/sprites/'+f) for n,f in [('rh','rockhopper.svg'),('pa','pineapple.svg')]}
(P/'assets.mjs').write_text('// Original MIT LFC Foundry assets at '+SHA+'\nexport const SVG='+json.dumps(assets)+';\n')
(P/'even-dt.mjs').write_text(source('src/vendor/frame-kit/even-dt.js')+'\nexport const EvenDt=globalThis.EvenDt;\n')
manifest={'sourceCommit':SHA,'functions':{n:hashlib.sha256(function(n).encode()).hexdigest() for n in names},'input':hashlib.sha256(inputtext.encode()).hexdigest(),'exclusions':['source tableHit replaced by inert dependency','no persistence/title/campaign bootstrap','reward/helper/scene dependencies inert'],'renderingBoundaries':['common lightweight shadow ellipse','common danger outline','source drawPenguin/drawShot/guide retained; no outfit in fixture']}
(P/'PROVENANCE.json').write_text(json.dumps(manifest,indent=2)+'\n')
print('Extracted pinned source capsule and genuine SVG assets; original game untouched.')
