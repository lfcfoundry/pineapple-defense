import {SVG} from './assets.mjs';
const vars=':root{--pa-hi:#ffeaa0;--pa-mid:#f8bd1c;--pa-lo:#a85a07;--pg-hi:#6b6aab;--pg-mid:#383767;--pg-lo:#171538}.m-o,.m-grin,.m-pout,.brow{display:none}';
const moods={happy:'',glad:'.m-smile{display:none}.m-grin{display:block}',wow:'.m-smile{display:none}.m-o{display:block}',pout:'.m-smile{display:none}.m-pout{display:block}',back:'.face{display:none}'};
export async function loadImages(){
 const out={pa:{},rh:{}};await Promise.all(Object.keys(out).flatMap(k=>Object.keys(moods).map(async m=>{
  const im=new Image();im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(SVG[k].replace(/^[\s\S]*?<svg[^>]*>/,'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="384" height="384"><style>'+vars+moods[m]+'</style>'));
  await im.decode();const c=document.createElement('canvas');c.width=c.height=384;c.getContext('2d').drawImage(im,0,0,384,384);out[k][m]=c;
 })));return out;
}
export function renderer(canvas,images){
 const ctx=canvas.getContext('2d',{alpha:false});let previous='';
 return function render(e,input){
 const {W,H,legacy:l}=e,dpr=Math.min(devicePixelRatio||1,2),key=W+'x'+H+'x'+dpr;
 if(key!==previous){canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);previous=key;}
 ctx.setTransform(dpr,0,0,dpr,0,0);l.draw(ctx);
 const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#6fd4ed');sky.addColorStop(.47,'#e2f8ee');sky.addColorStop(.48,'#74cfce');sky.addColorStop(1,'#d9f6e9');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
 ctx.fillStyle='#fff5ca';ctx.beginPath();ctx.ellipse(W*.04,H*.49,W*.5,H*.06,0,0,6.3);ctx.fill();
 ctx.fillStyle='#fff9db';ctx.beginPath();ctx.arc(W*.82,H*.16,Math.min(W,H)*.08,0,6.3);ctx.fill();
 ctx.fillStyle='rgba(255,255,255,.6)';for(let i=0;i<4;i++){ctx.beginPath();ctx.ellipse(W*(.12+.23*i),H*(.27-.04*(i%2)),W*.09,H*.016,0,0,6.3);ctx.fill();}
 // Shared original striped fruit stand. Its action geometry is the source slingGeom/pouchPos.
 const y0=H*.88,wob=e.prefs.calm?0:Math.sin(l.S.t*46)*12*l.S.wob*l.S.wob;ctx.save();ctx.translate(wob,0);for(let i=0;i<16;i++){ctx.fillStyle=i%2?'#fff7e3':'#d63a2e';ctx.fillRect(W*i/16,y0,W/16+1,H*.12);}ctx.fillStyle='#f9edce';ctx.fillRect(0,y0-H*.006,W,H*.03);ctx.restore();
 const sy=e.support.y,active=e.condition==='N1';ctx.strokeStyle='#63868a';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(.30*W,sy);ctx.lineTo(.76*W,sy);ctx.stroke();
 ctx.strokeStyle='#577978';ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<10;i++){const x=.30*W+i*.012*W;ctx.lineTo(x,sy+(i%2?5:-5));}ctx.stroke();
 ctx.fillStyle='#ebaf83';ctx.fillRect(.76*W-4,sy-16,8,32);
 // Circle is the gameplay silhouette, not a box hiding a differently sized collider.
 ctx.save();ctx.translate(e.cart.x,sy);ctx.fillStyle='#f5cb58';ctx.strokeStyle='#573d29';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,e.cart.r,0,Math.PI*2);ctx.fill();ctx.stroke();
 ctx.save();ctx.rotate((e.cart.x-.30*W)/e.cart.r);ctx.beginPath();ctx.moveTo(-e.cart.r*.8,0);ctx.lineTo(e.cart.r*.8,0);ctx.moveTo(0,-e.cart.r*.8);ctx.lineTo(0,e.cart.r*.8);ctx.stroke();ctx.restore();ctx.restore();
 if(!e.support.removed){ctx.fillStyle=active?'#d6eff5':'#9db1b6';ctx.strokeStyle='#354e65';ctx.lineWidth=2;ctx.beginPath();ctx.arc(e.support.x,sy,e.support.r,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.fillStyle='#38546d';ctx.font='bold '+Math.max(11,W*.033)+'px system-ui';ctx.textAlign='center';ctx.fillText(active?'SUPPORT':'LOCK',e.support.x,sy+4);
  if(active&&input.point&&Math.hypot(input.point.x-e.support.x,input.point.y-sy)<=e.support.r){ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(e.support.x,sy,e.support.r,0,6.3);ctx.stroke();}
 }
 if(!active){ctx.strokeStyle='#845c3f';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(.30*W-e.cart.r,sy-e.cart.r);ctx.lineTo(.30*W+e.cart.r,sy+e.cart.r);ctx.stroke();}
 for(const pg of [...l.actors].sort((a,b)=>a.p-b.p||a.id-b.id))if(pg.st!=='gone'){l.drawPenguin(pg);if(pg.st==='walk'){const c=l.penCenter(pg);ctx.strokeStyle='#294953';ctx.lineWidth=1;ctx.beginPath();ctx.arc(c.x,c.y,3,0,6.3);ctx.stroke();}}
 const s=l.slingGeom(),o=l.pouchPos();ctx.save();ctx.translate(wob,0);ctx.strokeStyle='#69432a';ctx.lineWidth=Math.max(5,W*.018);ctx.lineCap='round';ctx.beginPath();ctx.moveTo(s.x,s.base);ctx.lineTo(o.x,o.y);ctx.lineTo(s.x-s.f*.3,s.base-s.f);ctx.moveTo(o.x,o.y);ctx.lineTo(s.x+s.f*.3,s.base-s.f);ctx.stroke();
 ctx.strokeStyle='#bc8450';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(s.x-s.f*.3,s.base-s.f);ctx.lineTo(o.x,o.y);ctx.lineTo(s.x+s.f*.3,s.base-s.f);ctx.stroke();
 if(l.S.cd===0){const z=s.ps*.6;ctx.drawImage(images.pa.back,o.x-z/2,o.y-z*.7,z,z);}ctx.restore();
 for(const shot of l.shots)l.drawShot(shot);
 if(e.condition==='F0')l.drawAimArc();
 for(const f of e.effects){ctx.globalAlpha=1-f.t/.35;ctx.strokeStyle=f.kind==='hit'?'#f3b833':'#fff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(f.x,f.y,4+f.t*44,0,6.3);ctx.stroke();}ctx.globalAlpha=1;
 if(e.condition!=='F0'){
  ctx.strokeStyle='rgba(30,70,83,.18)';ctx.lineWidth=1;ctx.setLineDash([4,5]);ctx.strokeRect(.06*W,.5*H,.88*W,.4*H);ctx.setLineDash([]);
  if(input.point){ctx.strokeStyle=input.valid(input.point)?'#173f50':'#a63422';ctx.lineWidth=2;ctx.setLineDash(l.S.cd>0?[3,4]:[]);ctx.beginPath();ctx.arc(input.point.x,input.point.y,12,0,6.3);ctx.stroke();ctx.setLineDash([]);}
  const x=e.prefs.lh?8:W-56;ctx.fillStyle='#fff5e5';ctx.fillRect(x,.5*H-56,48,48);ctx.strokeStyle='#9e4133';ctx.strokeRect(x,.5*H-56,48,48);ctx.fillStyle='#8a3025';ctx.font='12px system-ui';ctx.textAlign='center';ctx.fillText('Cancel',x+24,.5*H-28);
 }
 ctx.font='bold '+Math.max(13,Math.min(W,H)*.043)+'px system-ui';ctx.textAlign='center';ctx.fillStyle='#183b49';ctx.fillText('PINEAPPLE DEFENSE',W/2,H*.075);
 ctx.font='12px system-ui';ctx.fillText('Sandy Snack Shore · '+e.condition,W/2,H*.11);
 ctx.textAlign='left';ctx.fillText('Cheer '+l.S.cheer+'   Home '+e.sendHomes+'/4',8,24);ctx.fillStyle='#2b7663';ctx.fillRect(8,32,(W-16)*l.S.cheer/100,5);
 ctx.fillStyle='#173d4a';ctx.textAlign='center';ctx.font='11px system-ui';ctx.fillText(e.condition==='F0'?'Original flick · original guide':'Landing point — penguins keep moving',W/2,H*.38);
 const overlay=l.S.paused?'Paused · attempt excluded':l.S.rc>0?'Resume '+Math.ceil(l.S.rc):e.phase==='Countdown'?String(Math.ceil(e.countdown)):e.phase==='Outcome'?(e.outcome.clean?'Stand saved!':e.outcome.complete?'Home with boops':'Time up'):null;
 if(overlay){ctx.fillStyle='rgba(255,250,230,.92)';ctx.fillRect(8,H*.19,W-16,52);ctx.fillStyle='#334756';ctx.font='bold '+Math.min(22,W*.055)+'px system-ui';ctx.textAlign='center';ctx.fillText(overlay,W/2,H*.19+33);}
 };
}
