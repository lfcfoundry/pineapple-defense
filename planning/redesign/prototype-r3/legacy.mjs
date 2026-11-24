// MIT License, Copyright (c) 2026 LFC Foundry. Pinned source capsule; see PROVENANCE.json.
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
function sc(p) { return 0.16 + 0.84 * p; }

function px(xn, p) { return W / 2 + xn * FW * sc(p); }

function py(p) { return hy + (gy - hy) * p; }

function psz(p) { return size0 * sc(p); }

function newState() {
  S = { wave: 0, spawned: 0, toSpawn: 0, spawnT: 0, mode: 'intro', modeT: 0, cheer: 100, golden: 0, bumps: 0,
        cd: 0, cdMax: 0.42, t: 0, wob: 0, thrown: false, over: false, paused: false, id: 0, lastLane: -1, boss: null, inBoss: false, bossHp: 3, bossMax: 3, stage: 1, sa: 0,
        puT: 9, pu: null, lastPu: '', fx: { zip: 0, mega: 0, frost: 0 }, tro: null, tq: [], earned: 0, streak: 0, cmb: { n: 0, t: -9, m: 0, a: 0, fr: 0, dirty: false }, call: null, shk: 0, gulls: [], umb: [], umL: sv.um | 0, raL: RAID_N[sv.ra | 0] || 0, raid: null, maxCmb: 0, maxSp: 0, fancy: 0, allBumps: 0, zones: 0, chT: -99, chN: 0, gl: 0, fish: [], fishT: 6, toast: null, au: { cd: 1.5, tgt: null, a: 0 }, lm: { cd: 1, a: 0, q: 0, qt: 0, n: 0 }, ms: [], rc: 0, clones: [], pt: false };
  penguins = []; shots = []; bits = []; pops = []; rings = []; flys = [];
}

function bump(pg) {
  if (umbrellaSave(pg)) return;
  pg.st = 'bump'; pg.t = 0; pg.mood = 'pout'; pg.p = 0.95;
  S.wob = 1; S.bumps++; S.allBumps++; S.cheer = Math.max(0, S.cheer - 12);
  if (S.cheer <= 0) endStage(false);
}

function hitPenguin(pg, x, y) {
  cmbHit(x, y);
  if (pg.hp > 1) {
    stopHit(pg, 0.035); shakeAdd(0.08);
    pg.hp--; pg.hat = true; pg.mood = 'pout'; if (pg.ev > 0) { pg.ev = 0; pg.v = pg.vs || pg.v; }
    S.cheer = Math.min(100, S.cheer + 1); burst(x, y, 10, PINE_COL); sparkBurst(x, y, 6, ['#ffd23f', '#fff7e3']);
    popText(x, y - psz(pg.p) * 0.3, pg.kind === 'mc' ? 'Clang!' : 'Tough one!', pg.kind === 'mc' ? '#1d7fa8' : '#7a3a9a', 0); return;
  }
  pg.ev = 0; stopHit(pg, 0.05); shakeAdd(0.14);
  pg.st = 'hit'; pg.t = 0; pg.mood = 'wow'; pg.hat = true;
  reward(PAY[pg.kind] || 1, x, y, pg.kind === 'rh' ? 0 : 1);
  S.cheer = Math.min(100, S.cheer + 2);
  burst(x, y, 12, PINE_COL);
  popText(x, y - psz(pg.p) * 0.3, HIT_WORDS[Math.floor(Math.random() * HIT_WORDS.length)], '#b86e00');
}

function avoidBoss(pg, dt) {
  var b = S.boss; if (!b || b.st === 'gone' || b.st === 'slide') return;
  var dp = pg.p - b.p, dx, sep = 0.5 + (b.big - 1.35) * 0.5, want, step;
  if (dp > 0.12) { if (pg.st === 'walk' && pg.x0 !== undefined) pg.xn += Math.max(-0.6 * dt, Math.min(0.6 * dt, pg.x0 - pg.xn)); return; }
  if (dp < -0.2) return;
  dx = pg.xn - b.xn;
  if (Math.abs(dx) >= sep) { pg.av = 0; return; }
  if (!pg.av) pg.av = dx > 0.02 ? 1 : dx < -0.02 ? -1 : pg.side;
  if (Math.abs(b.xn + pg.av * sep) > 1.1) pg.av = -pg.av;
  want = b.xn + pg.av * sep; step = dp > -0.07 ? 99 : 1.5 * dt;
  pg.xn += Math.max(-step, Math.min(step, want - pg.xn));
}

function updatePenguin(pg, dt) {
  if (pg.fz > 0) { pg.fz -= dt; return; }   /* hit pause */
  pg.t += dt; pg.ph += dt * (6 + pg.v * 40);
  if (pg.st === 'walk' || pg.st === 'slide') avoidBoss(pg, dt);
  if (pg.pop > 0) pg.pop = Math.max(0, pg.pop - dt * 1.4);
  if (pg.st === 'walk' && pg.ev > 0) evolveStep(pg, dt);
  if (pg.st === 'walk') {
    pg.p += pg.v * dt * slowK; stepPuff(pg, dt);
    if (pg.p >= 0.95) bump(pg);
  } else if (pg.st === 'hit') {
    if (pg.t > 0.9) { pg.st = 'slide'; pg.t = 0; pg.mood = 'glad'; }
  } else if (pg.st === 'slide') {
    pg.p -= (0.5 + pg.t * 1.4) * dt;
    pg.puff -= dt;
    if (pg.puff <= 0) { pg.puff = 0.07; burst(px(pg.xn, pg.p), py(pg.p), 2, SNOW_COL); }
    if (pg.p <= 0.06) pg.st = 'gone';
  } else if (pg.st === 'fling') {
    pg.xn += pg.side * dt * 1.1; pg.p = Math.max(0.55, pg.p - dt * 0.32);
    if (pg.t > 0.9) pg.a = Math.max(0, 1 - (pg.t - 0.9) / 0.4);
    if (pg.t > 1.3) pg.st = 'gone';
  } else if (pg.st === 'bump') {
    if (pg.t > 0.9) { pg.xn += pg.side * dt * 0.8; pg.mood = 'happy'; }
    if (pg.t > 1.9) pg.a = Math.max(0, 1 - (pg.t - 1.9) / 0.6);
    if (pg.t > 2.5) pg.st = 'gone';
  }
}

function penCenter(pg) { var s = psz(pg.p) * (pg.big || 1); return { x: px(pg.xn, pg.p), y: py(pg.p) - s * 0.42, s: s }; }

function targets() {
  var out = [], i;
  for (i = 0; i < penguins.length; i++) if (penguins[i].st === 'walk') out.push(penguins[i]);
  if (S.boss && (bossOpen(S.boss) || S.boss.st === 'walk')) out.push(S.boss);
  if (S.clones) for (i = 0; i < S.clones.length; i++) out.push(S.clones[i]);
  return out;
}

function throwAt(ox, oy, dx, dy, spd, tapPoint, want) {
  if (S.cd > 0) { if (sv.ib && S.cd <= BUF_S && !S.over && !S.paused && S.rc <= 0 && !rsg()) S.buf = { a: [ox, oy, dx, dy, spd, tapPoint, want], t: S.t }; return; }
  if (S.over || S.paused || S.rc > 0) return;
  if (rsg()) { if (S.t - (S.wgT || -9) > 1.2) { S.wgT = S.t; var wp = pouchPos(); popText(wp.x, wp.y - H * 0.1, 'Wait for GO!', '#c07800', 0); } return; }
  var tc = typeCost(curType);
  if (tc > 0) {
    if (sv.bank < tc) { setType('classic'); toast('Lobbers cost ' + tc + ' Golden Pineapples. Back to Classic!'); }
    else spend(tc, ox, oy);
  }
  if (!S.pt) { S.pt = true; S.au.cd = Math.max(S.au.cd, 0.45); S.lm.cd = Math.max(S.lm.cd, 0.7); }   /* the helpers wait one beat after the player's first throw */
  var ty = effType(), len = Math.hypot(dx, dy) || 1; dx /= len; dy /= len;
  if (ty.img !== 'pa') S.fancy = 1;
  var best = null, bs = 1e9, ttf = 0.6, list = targets(), i;
  for (i = 0; i < list.length; i++) {
    var pg = list[i], c = penCenter(pg), wx = c.x - ox, wy = c.y - oy, t = wx * dx + wy * dy;
    if (t <= 0) continue;
    var perp = Math.abs(wx * dy - wy * dx);
    if (perp > c.s * AIMW) continue;
    var score = perp / c.s - 0.25 * pg.p + ((pg.aut || pg === S.au.tgt) ? 0.5 : 0);
    if (score < bs) { bs = score; best = pg; }
  }
  if (want && list.indexOf(want) >= 0) best = want;   /* tap or hold on a penguin: that penguin is the target */
  var xE, yE, pEnd, cheerShot = null;
  if (!best && stageNo() === 5 && S.t - S.chT > 6.4) { var cp = cheerPos(), cwx = cp.x - ox, cwy = cp.y - oy; if (cwx * dx + cwy * dy > 0 && Math.abs(cwx * dy - cwy * dx) < cp.s * 0.9) cheerShot = cp; }
  if (best) {
    ttf = (0.42 + 0.38 * (1 - best.p)) * ty.T;
    pEnd = Math.min(0.94, best.p + (best.st === 'walk' ? best.v * slowK : 0) * ttf);
    xE = px(best.xn + (best.vx || 0) * ttf, pEnd); yE = py(pEnd) - psz(pEnd) * (best.big || 1) * 0.42;
  } else if (cheerShot) {
    xE = cheerShot.x; yE = cheerShot.y; pEnd = 0.06; ttf = (0.42 + 0.38 * 0.94) * ty.T;
  } else {
    pEnd = tapPoint ? Math.max(0.12, Math.min(0.92, (tapPoint.y - hy) / (gy - hy))) : Math.max(0.1, Math.min(0.88, 0.88 - (spd - 0.8) * 0.2));   /* a harder flick flies farther up the lane */
    yE = py(pEnd) - psz(pEnd) * 0.3;
    var tt = (yE - oy) / dy; xE = ox + dx * tt;
    ttf = (0.42 + 0.38 * (1 - pEnd)) * ty.T;
  }
  var cdv = S.fx.zip > 0 ? 0.15 : ty.cd;
  S.cd = cdv; S.cdMax = cdv; S.thrown = true; award(0);
  if (sv.thr < 99) { sv.thr++; if (sv.thr <= 6) saveSoon(); }
  elHint.hidden = true;
  var arc = Math.max(H * 0.05, Math.min(H * (0.14 + 0.2 * (1 - pEnd)) * ty.arc, (oy + yE) / 2 - H * 0.06));
  shots.push({ ty: ty, s0: slingGeom().ps * 0.92 * ty.size, x0: ox, y0: oy, xE: xE, yE: yE, pEnd: pEnd, t: 0, T: ttf, arc: arc, spin: (Math.random() < 0.5 ? -1 : 1) * 7, ph: 0, cheer: !!cheerShot && !best, soft: !!best });
}

function landShot(s, soft) {
  curSrc = s.auto ? 1 : 2;
  var ty = s.ty, hit = false, i, c, d, best = null, bd = ty.rad, nh = 0;
  if (s.tgt) s.tgt.aut = false;
  if (s.miss) { burst(s.xE, s.yE + psz(s.pEnd) * 0.3, 5, PINE_COL); popText(s.xE, s.yE - psz(s.pEnd) * 0.4, 'Whoops!', '#7a6a58', 0); return true; }   /* the helper's toss went wide */
  if (s.cheer) { cheerHit(s.xE, s.yE); return true; }
  if (champLand(s)) return true;
  if (bossOpen(S.boss)) {
    c = penCenter(S.boss);
    if (Math.hypot(c.x - s.xE, c.y - s.yE) / c.s < 0.8) { hit = hitBoss(ty.splash ? 2 : 1, c); if (!ty.splash) { if (!s.auto) { S.streak++; if (S.streak >= 3) award(1); if (S.streak >= 5) award(7); } return true; } }
  }
  for (i = 0; i < penguins.length; i++) {
    var pg = penguins[i]; if (pg.st !== 'walk') continue;
    c = penCenter(pg); d = Math.hypot(c.x - s.xE, c.y - s.yE) / c.s;
    if (ty.splash) { if (d < ty.splash) { hitPenguin(pg, c.x, c.y - c.s * 0.2); hit = true; nh++; } }
    else if (d < bd) { bd = d; best = pg; }
  }
  if (best) { c = penCenter(best); hitPenguin(best, c.x, c.y - c.s * 0.2); hit = true; }
  if (!hit && soft) return false;
  if (!hit) burst(s.xE, s.yE + psz(s.pEnd) * 0.3, 5, PINE_COL);
  if (nh >= 3) award(2);
  if (nh > S.maxSp) S.maxSp = nh;
  if (!s.auto) { S.streak = hit ? S.streak + 1 : 0; if (S.streak >= 3) award(1); if (S.streak >= 5) award(7); }
  return hit;
}

function updateShot(s, dt) {
  s.t += dt;
  if (s.ph === 0 && s.t >= s.T) {
    var soft = s.soft && !s.ext;
    if (landShot(s, soft)) { s.dead = true; return; }
    if (soft) {   /* the penguin it was aimed at is gone: the pineapple flies on along its line and falls where it falls */
      var dx = s.xE - s.x0, dy = s.yE - s.y0, p2 = Math.max(0.06, s.pEnd - 0.2), y2 = py(p2) - psz(p2) * 0.3, x2 = Math.abs(dy) > 1 ? s.xE + dx / dy * (y2 - s.yE) : s.xE;
      s.s0 = psz(s.pEnd) * 0.5 * s.ty.size; s.x0 = s.xE; s.y0 = s.yE; s.xE = Math.max(W * 0.04, Math.min(W * 0.96, x2)); s.yE = y2; s.pEnd = p2; s.arc = H * 0.05; s.t = 0; s.T = 0.4; s.ext = true;
      return;
    }
    s.ph = 1; s.t = 0; s.T = 0.3; s.rx = s.xE; s.ry = s.yE;   /* lands with a puff and fades: no planting and no rolling */
  } else if (s.ph === 1 && s.t >= s.T) s.dead = true;
}

function slingGeom() { var h = H * 0.12, f = Math.min(H * 0.22, W * 0.36); return { x: W / 2, base: H - h + h * 0.06, f: f, ps: f * 0.62 }; }

function pouchPos(g, ang) { var s = g || slingGeom(), y0 = s.base - s.f * 0.5 - s.ps * 0.92 * 0.38, a = g ? ang : (S.sa || 0); return { x: s.x + (s.base - y0) * Math.sin(a), y: s.base - (s.base - y0) * Math.cos(a) }; }

function drawAimArc() {
  if (!drag || K || S.paused || S.over || S.rc > 0) return;
  var m = sv.arc | 0; if (m === 2 || (m === 0 && sv.thr >= 5)) return;
  var cu = drag.pts[drag.pts.length - 1], dx = cu.x - drag.sx, dy = cu.y - drag.sy, l = Math.hypot(dx, dy);
  if (l < 0.02 * Math.min(W, H) || dy > -2) return;
  var po = pouchPos(), ux = dx / l, uy = dy / l, L = H * 0.34, n = 9, i, t, rr = Math.max(2.6, W * 0.009);
  ctx.save(); ctx.fillStyle = sv.hc ? '#ffffff' : 'rgba(255,255,255,.9)'; ctx.strokeStyle = 'rgba(42,18,13,.55)'; ctx.lineWidth = sv.hc ? 2.5 : 1.2; ctx.globalAlpha = 0.85; ctx.beginPath();
  for (i = 1; i <= n; i++) { t = i / n; var x = po.x + ux * L * t, y = po.y + uy * L * t + L * 0.1 * t * t, r = rr * (1.15 - 0.5 * t); ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, 6.3); }
  ctx.fill(); ctx.stroke(); ctx.restore();
}

function drawPenguin(pg) {
  var s = psz(pg.p) * (pg.big || 1), x = px(pg.xn, pg.p), y = py(pg.p);
  if (sv.dg && pg.st === 'walk' && pg.p >= DANGER_P && pg !== S.boss) drawDanger(x, y - s * 0.3, s, pg.p);
  if (pg.fz > 0) x += Math.sin(S.t * 140) * s * 0.03 * (pg.fz / (pg.fz0 || pg.fz));   /* a frozen hit trembles, less and less */
  ctx.save(); ctx.globalAlpha = pg.a;
  var rot = 0, hop = 0, sx = 1, sy = 1, tt = calm ? 0 : S.t;
  if (pg.ice) drawIceAura(x, y, s);
  if (pg.st === 'walk' || pg.st === 'hold' || (pg.st === 'bump' && pg.t > 0.9)) { if (!calm) { rot = Math.sin(pg.ph) * 0.1; hop = Math.abs(Math.sin(pg.ph)) * s * 0.03; } }
  else if (pg.st === 'hit') { rot = calm ? 0 : Math.sin(pg.t * 30) * 0.05; if (!calm) { var sq = Math.max(0, 1 - pg.t * 5); sx = 1 + 0.2 * sq; sy = 1 - 0.18 * sq; } }   /* a quick squash when a pineapple lands */
  else if (pg.st === 'slide') { sx = 1.15; sy = 0.62; rot = 0.1; }
  else if (pg.st === 'dash') { sx = 1.2; sy = 0.64; rot = 0.1 * (pg.x1 > pg.x0 ? 1 : -1); }
  var fh = 0;
  if (pg.st === 'fling') { fh = Math.sin(Math.min(1, pg.t / 1.2) * 3.14) * H * 0.26; rot = calm ? 0 : pg.t * 15 * pg.side; }
  if (pg.lift) fh += pg.lift * s;
  if (pg.tele && !calm) rot = Math.sin(S.t * 44) * 0.14;
  var lift = hop / (s * 0.03 || 1);
  drawShadow(x + s * 0.05, y - s * 0.015, s * 0.34 * sx * (1 - 0.16 * lift), 1 - 0.25 * lift);
  if (pg.st !== 'slide' && pg.st !== 'dash') {
    ctx.fillStyle = 'rgba(42,18,13,' + (0.28 - 0.14 * lift) + ')';
    ctx.beginPath(); ctx.ellipse(x - s * 0.17, y - s * 0.01, s * 0.1, s * 0.025, 0, 0, 6.3); ctx.ellipse(x + s * 0.17, y - s * 0.01, s * 0.1, s * 0.025, 0, 0, 6.3); ctx.fill();
  }
  var el = evolveLook(pg); sx *= el.sx; sy *= el.sy; rot += el.rot;
  drawEvolveGlow(pg, x, y - hop, s);
  ctx.translate(x, y - hop - fh); ctx.rotate(rot); ctx.scale(sx, sy);
  var im = IMG[pg.kind][pg.mood];
  if (im) ctx.drawImage(mip(im, s * Math.max(sx, sy)), -s / 2, -s * 0.965, s, s);
  if (pg.ice) { ctx.fillStyle = 'rgba(140,210,245,.5)'; ctx.beginPath(); ctx.ellipse(0, -s * 0.46, s * 0.31, s * 0.44, 0, 0, 6.3); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.beginPath(); ctx.ellipse(-s * 0.12, -s * 0.66, s * 0.07, s * 0.16, 0.3, 0, 6.3); ctx.fill(); }
  if (pg.gear) drawOutfit(pg, s, tt);
  if (pg.hat && IMG.pa.happy) {
    var hs = s * 0.42;
    ctx.save(); ctx.translate(0, -s * 0.745 - hs * 0.45 + s * 0.03); ctx.rotate(0.28);
    ctx.drawImage(mip(IMG.pa.happy, hs), -hs / 2, -hs / 2, hs, hs); ctx.restore();
  }
  if (pg.st === 'hit') {
    for (var i = 0; i < 3; i++) {
      var a = tt * 6 + i * 2.09;
      star(ctx, Math.cos(a) * s * 0.28, -s * 0.8 + Math.sin(a) * s * 0.07, s * 0.07);
    }
  }
  ctx.restore();
}

function drawShot(sh) {
  var u, x, y, size, a = 1, rot;
  if (sh.ph === 0) {
    u = Math.min(1, sh.t / sh.T);
    x = sh.x0 + (sh.xE - sh.x0) * u;
    y = sh.y0 + (sh.yE - sh.y0) * u - 4 * sh.arc * u * (1 - u);
    size = (sh.s0 + (psz(sh.pEnd) * 0.5 * sh.ty.size - sh.s0) * u) * (1 + 0.35 * Math.sin(Math.PI * u));
    rot = sh.spin * sh.t;
    var gyy = sh.y0 + (py(sh.pEnd) - sh.y0) * u;
    drawShadow(x, gyy, size * 0.3, 0.6);
  } else {
    u = Math.min(1, sh.t / sh.T);
    x = sh.xE + (sh.rx - sh.xE) * u; y = sh.yE + (sh.ry - sh.yE) * u - 4 * H * 0.012 * u * (1 - u);
    size = psz(sh.pEnd) * 0.5; a = 1 - u; rot = sh.spin * (sh.T * 0.3 + sh.t * 1.5);
  }
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot);
  var simg = IMG[sh.ty.img].back; if (simg) ctx.drawImage(simg, -size / 2, -size / 2, size, size);
  ctx.restore();
}

function star(g, x, y, r) {
  g.beginPath();
  for (var i = 0; i < 8; i++) { var a = i * Math.PI / 4 - Math.PI / 2, rr = i % 2 ? r * 0.38 : r; g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
  g.closePath(); g.fillStyle = '#ffd23f'; g.strokeStyle = '#fff7e3'; g.lineWidth = Math.max(1, r * 0.22); g.lineJoin = 'round'; g.stroke(); g.fill();
}
var drag = null;
function rel(e) { var r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top, t: e.timeStamp }; }
cv.addEventListener('pointerdown', function (e) {
  if (!S) return;   /* a tap in the moment between Play and the stage being ready */
  if (wk) wk.poke();
  if (sv.fp) fm.input(e.timeStamp);
  if (S.rc > 0 && !S.paused && !S.over) { S.rc = 0; e.preventDefault(); return; }   /* a tap skips the get-ready beat after Resume (the tap itself does not throw) */
  if (sv.ef && (drag || hold)) { drag = null; hold = null; }   /* Every finger plays (off by default): a new finger takes over, so a resting finger never blocks a throw */
  if (S.paused || S.over || drag || S.rc > 0) return;
  try { cv.setPointerCapture(e.pointerId); } catch (x) {}
  var p = rel(e);
  if (tableHit(p) || zoneHit(p) || sceneTap(p)) { e.preventDefault(); return; }
  if (sv.hp && !K) { var hpg = penAt(p); if (hpg) { hold = { id: e.pointerId, pg: hpg }; e.preventDefault(); holdTick(); return; } }
  drag = { id: e.pointerId, sx: p.x, sy: p.y, t0: p.t, pts: [p] };
  e.preventDefault();
});
/* hold to press, for the youngest players: a tap on a penguin throws at it, and holding keeps throwing (same cooldown and costs) until it is bonked */
var hold = null;
function penAt(p) {
  var list = targets(), i, best = null, bd = 1e9;
  for (i = 0; i < list.length; i++) {
    var c = penCenter(list[i]), r = Math.max(c.s * 0.62, 30), d = Math.hypot(p.x - c.x, p.y - c.y) / r;
    if (d <= 1 && d < bd) { bd = d; best = list[i]; }
  }
  return best;
}
function holdTick() {
  if (!hold) return;
  var pg = hold.pg, live = pg === S.boss ? (pg.hp > 0 && pg.st !== 'slide' && pg.st !== 'gone') : targets().indexOf(pg) >= 0;   /* a dodging Champion is still the target */
  if (S.paused || S.over || K || !live) { hold = null; return; }
  if (S.cd > 0 || S.rc > 0 || targets().indexOf(pg) < 0) return;
  var o = pouchPos(), c = penCenter(hold.pg);
  throwAt(o.x, o.y, c.x - o.x, c.y - o.y, 1.2, { x: c.x, y: c.y }, hold.pg);
}
var hov = [], hovLock = 0;
/* minigame, mouse or touchpad: a swipe up the pad rolls the ball once the swipe eases off, so the whole swipe sets the speed */
var hs = null, hsLock = 0;
function hoverRoll(e) {
  if (e.pointerType === 'touch' || e.buttons !== 0 || S.over || S.paused || K.over || K.balls <= 0) { hs = null; hov.length = 0; return; }
  var p = rel(e), a, dx, dy, dtm, spd, last, f;
  if (p.t < hsLock) return;
  if (!hs) {
    hov.push(p); while (hov.length && p.t - hov[0].t > 100) hov.shift();
    if (hov.length < 2) return;
    a = hov[0]; dx = p.x - a.x; dy = p.y - a.y; dtm = Math.max(16, p.t - a.t); spd = Math.hypot(dx, dy) / dtm * 1000 / H;
    if (a.y >= H * 0.5 && -dy > H * 0.02 && -dy > Math.abs(dx) * 0.5 && spd >= 0.8) { hs = { pts: hov.slice(), sx: a.x, sy: a.y, t0: a.t, peak: spd, wall: performance.now() }; hov.length = 0; }
    return;
  }
  hs.pts.push(p); if (hs.pts.length > 60) hs.pts.shift(); hs.wall = performance.now();
  last = hs.pts[hs.pts.length - 2]; dtm = Math.max(8, p.t - last.t); spd = Math.hypot(p.x - last.x, p.y - last.y) / dtm * 1000 / H;
  if (p.y > hs.sy + 4 || p.t - hs.t0 > 1200) { hs = null; return; }
  if (spd > hs.peak) hs.peak = spd; else if (hs.peak >= 1.2 && spd < hs.peak * 0.35 && p.t - hs.t0 > 80) hsFire(p.t);
}
function hsFire(t) {
  var f = hs && skFlick(hs); hs = null; hov.length = 0; hsLock = t + 400;
  if (f) skeeRoll(f.dx, f.dy, f.spd);
}
function hoverFlick(e) {
  if (K) { hoverRoll(e); return; }
  if (e.pointerType === 'touch' || e.buttons !== 0 || S.over || S.paused || S.cd > 0 || S.rc > 0) { hov.length = 0; return; }
  var p = rel(e); hov.push(p);
  while (hov.length && p.t - hov[0].t > 150) hov.shift();
  if (p.t < hovLock || hov.length < 3) return;
  var a = hov[0], dx = p.x - a.x, dy = p.y - a.y, dtm = Math.max(16, p.t - a.t), spd = Math.hypot(dx, dy) / dtm * 1000 / H;
  if (-dy >= H * 0.1 && -dy > Math.abs(dx) * 0.6 && spd >= 1.5 && a.y >= H * 0.45) {
    var po = pouchPos(); hov.length = 0; hovLock = p.t + 350;
    if (K) skeeRoll(dx, dy, spd); else throwAt(po.x, po.y, dx, dy, spd, null);
  }
}
cv.addEventListener('pointermove', function (e) {
  if (!S) return;
  if (!drag) { hoverFlick(e); return; }
  if (e.pointerId !== drag.id) return;
  if (sv.cp && e.getCoalescedEvents) { var ce = e.getCoalescedEvents(), cj; for (cj = 0; cj < ce.length; cj++) drag.pts.push(rel(ce[cj])); if (!ce.length) drag.pts.push(rel(e)); }   /* smoother flick speed: every sample the device reports */
  else drag.pts.push(rel(e));
  while (drag.pts.length > (K ? 48 : sv.cp ? 40 : 10)) drag.pts.shift();
});
cv.addEventListener('pointercancel', function () { drag = null; hold = null; });
cv.addEventListener('pointerup', function (e) {
  if (!S) return;
  if (hold && e.pointerId === hold.id) { hold = null; return; }
  if (!drag || e.pointerId !== drag.id) return;
  var d = drag; drag = null;
  var end = rel(e), vx = end.x - d.sx, vy = end.y - d.sy, len = Math.hypot(vx, vy), m = Math.min(W, H);
  var po = pouchPos(), oy = po.y, ox;
  if (len < TAP_MIN * m) return;   // flick only: a plain tap does nothing
  if (vy > -FLICK_MIN * H) return;
  var old = d.pts[0], i;
  for (i = d.pts.length - 1; i >= 0; i--) { if (end.t - d.pts[i].t >= 60) { old = d.pts[i]; break; } }
  var dx = end.x - old.x, dy = end.y - old.y;
  if (dy > -2) { dx = vx; dy = vy; old = { t: d.t0 }; }
  var dur = Math.max(30, end.t - old.t), spd = Math.hypot(dx, dy) / dur * 1000 / H;
  ox = po.x;
  if (K) { var kf = skFlick(Object.assign({}, d, { pts: d.pts.concat([end]) })); if (kf) skeeRoll(kf.dx, kf.dy, kf.spd); return; }
  throwAt(ox, oy, dx, dy, spd, null);
});
cv.addEventListener('contextmenu', function (e) { e.preventDefault(); });

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
