/* Test Lab: tester build only. Not part of the public game. Copyright (c) 2026 LFC Foundry. MIT License (see LICENSE). */
var LAB0 = { aim: SK_AIM, g: SK_G, kz: SK_KZ, inc: SK_INC, rb: SK_RB, balls: SK_BALLS, rim: SK_RIM, wall: SK_WALL, din: SK_DIN, cup: 1, spd: 1 }, LAB_R = SK_HOLES.map(function (h) { return h.r; }), labCup = 1;
(function () {
  var st = document.createElement('style');
  st.textContent = '.lab{text-align:left;font:700 .95rem/1.25 var(--body);color:var(--fg)}.lab h3{margin:.7rem 0 .25rem;font:800 1rem/1 var(--display);color:#7a3a05}.lab h3:first-child{margin-top:0}' +
    '.lab .row{justify-content:flex-start;margin:.15rem 0}.lab .btn{min-height:2.4rem;font-size:.85rem;padding:.4em .8em .5em;margin:0;}.lab select{font:700 .9rem var(--body);padding:.45em;border-radius:.6em;border:2px solid #b79a63;background:#fffaf0;color:#4a2b0f}' +
    '.lab .sl{display:grid;grid-template-columns:7.2em 1fr 3.2em;align-items:center;gap:.5em;margin:.2rem 0}.lab .sl output{text-align:right;font-variant-numeric:tabular-nums}.lab input[type=range]{width:100%;accent-color:#e08a00}' +
    '.lab .note{font-weight:600;font-size:.8rem;opacity:.75;margin:.2rem 0}.lab .msg{min-height:1.1em;font-size:.82rem;color:#2f6f9f;margin:.3rem 0 0}';
  document.head.appendChild(st);
  var SL = [
    ['spd', 'Game speed', 0.25, 2, 0.05, 'Everything, both modes'], ['aim', 'Aim gain', 0.3, 1.2, 0.05, 'Roll: swipe angle to roll angle'], ['g', 'Gravity', 6, 24, 0.5, 'Roll: higher = flatter, quicker arcs'], ['kz', 'Hop kick', 0.2, 0.8, 0.05, 'Roll: how steeply the hop launches'], ['inc', 'Incline (deg)', 15, 50, 1, 'Roll: board tilt; steeper = faster roll back'], ['rb', 'Ball size', 0.05, 0.12, 0.005, 'Roll: ball radius vs the holes'],
    ['balls', 'Balls per round', 3, 20, 1, 'Roll: applies to the next round'], ['cup', 'Cup size', 0.6, 1.6, 0.05, 'Roll: all cups'], ['rim', 'Rim bounce', 0, 0.9, 0.05, 'Roll: bounciness off rims'],
    ['wall', 'Wall bounce', 1, 2, 0.05, 'Roll: 1 = dead, 2 = springy'], ['din', 'Hole catch', 0.5, 1, 0.05, 'Roll: how much of the opening scores']];
  function apply(k, v) {
    if (k === 'spd') timeScale = v; else if (k === 'aim') SK_AIM = v; else if (k === 'g') SK_G = v; else if (k === 'kz') SK_KZ = v; else if (k === 'inc') SK_INC = v; else if (k === 'rb') SK_RB = v; else if (k === 'balls') SK_BALLS = v | 0; else if (k === 'rim') SK_RIM = v;
    else if (k === 'wall') SK_WALL = v; else if (k === 'din') SK_DIN = v; else if (k === 'cup') { labCup = v; SK_HOLES.forEach(function (h, i) { h.r = LAB_R[i] * v; }); }
  }
  function cur(k) { return k === 'spd' ? timeScale : k === 'aim' ? SK_AIM : k === 'g' ? SK_G : k === 'kz' ? SK_KZ : k === 'inc' ? SK_INC : k === 'rb' ? SK_RB : k === 'balls' ? SK_BALLS : k === 'rim' ? SK_RIM : k === 'wall' ? SK_WALL : k === 'din' ? SK_DIN : labCup; }
  /* core-plan: the device line shown at the top of the page and first in every Copy results, and the "last run" line kept in sessionStorage */
  var cpLabel = cpLine();
  function cpDone() { LfcCorePlan.lastRun.done(); }
  window.addEventListener('pagehide', cpDone);
  function labClose() { if (!$('cw').hidden) { $('cw').hidden = true; root.removeAttribute('data-dlg'); } if (!$('gcw').hidden) hideCard(); }
  function labGo(fn) { labClose(); if (!gameEl.hidden) toTitle(); fn(); }
  function startFrom(from) { titleEl.hidden = true; gameEl.hidden = false; loadAssets().then(function () { resize(); startStage(from); run(); }); }
  /* Color view (tester only): look at the whole page the way a color-blind player might. Standard simulation matrices; a rough check, not a medical one.
     Matrices: protan and deutan from the Machado et al. style approximations used by hail2u/color-blindness-emulation; gray is luminance. */
  var CB = [['Normal', ''], ['Protan (red-weak)', '0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0'], ['Deutan (green-weak)', '0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0'], ['Tritan (blue-weak)', '0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0'], ['Gray', '0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0 0 0 1 0']], cbI = 0;
  (function () {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'), h = '<defs>', i;
    s.setAttribute('width', '0'); s.setAttribute('height', '0'); s.setAttribute('aria-hidden', 'true'); s.style.cssText = 'position:absolute;width:0;height:0';
    for (i = 1; i < CB.length; i++) h += '<filter id="cb' + i + '" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="' + CB[i][1] + '"/></filter>';
    s.innerHTML = h + '</defs>'; document.body.appendChild(s);
  }());
  function cbSet(i) { cbI = i; document.body.style.filter = i ? 'url(#cb' + i + ')' : ''; root.setAttribute('data-cb', String(i));   /* on <body>: Firefox ignores a filter on <html> */ return CB[i][0]; }
  window.__cb = cbSet;
  /* Flash check (tester only; the idea of WCAG 2.3.1): two busy scenes are played at 60 steps a second by a helper that always throws, a tiny copy of the picture is
     sampled every step, and big opposite brightness changes are counted per second. A change counts when 10% or more of the cells get brighter (or darker) by 0.1 of relative
     luminance with the darker side under 0.8, and at least a quarter of the cells do it together. Red is counted separately. A rough check, not a legal or medical test. */
  function relLum(r, g, b) { function c(v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); } return 0.2126 * c(r) + 0.7152 * c(g) + 0.0722 * c(b); }
  function worstPer(list) {   /* the most transitions inside any one second, as flashes (a flash is a pair of opposite changes) */
    var i, j = 0, mx = 0, at = 0; for (i = 0; i < list.length; i++) { while (list[i] - list[j] > 1) j++; if (i - j + 1 > mx) { mx = i - j + 1; at = list[j]; } }
    return { n: mx / 2, at: at };
  }
  /* the counting core: feed it one frame of RGBA pixels (GW x GH) and the time; it keeps the brightness-change times and a "moved" count */
  function flashMeter() {
    var prev = null, dir = 0, rdir = 0, ev = [], rv = [], moved = 0, frames = 0;
    return {
      push: function (d, simT) {
        var n = d.length / 4, L = new Float32Array(n), R = new Uint8Array(n), i, up = 0, dn = 0, ru = 0, rd = 0, mv = 0;
        for (i = 0; i < n; i++) { L[i] = relLum(d[i * 4], d[i * 4 + 1], d[i * 4 + 2]); R[i] = d[i * 4] > 200 && d[i * 4 + 1] < 90 && d[i * 4 + 2] < 90 ? 1 : 0; }
        frames++;
        if (prev) {
          for (i = 0; i < n; i++) { var a = prev.L[i], c = L[i]; if (c - a >= 0.1 && a < 0.8) up++; else if (a - c >= 0.1 && c < 0.8) dn++; if (R[i] > prev.R[i]) ru++; else if (R[i] < prev.R[i]) rd++; if (Math.abs(c - a) > 0.01) mv++; }
          if (mv) moved++;
          if (up >= n * 0.25 && dir !== 1) { dir = 1; ev.push(simT); } else if (dn >= n * 0.25 && dir !== -1) { dir = -1; ev.push(simT); }
          if (ru >= n * 0.25 && rdir !== 1) { rdir = 1; rv.push(simT); } else if (rd >= n * 0.25 && rdir !== -1) { rdir = -1; rv.push(simT); }
        }
        prev = { L: L, R: R };
      },
      result: function () { return { g: worstPer(ev), r: worstPer(rv), moved: moved, frames: frames }; }
    };
  }
  window.__flashTest = function (hz, steps) {   /* QA: a synthetic picture that flips between black and white hz times a second, to prove the meter counts */
    var c = document.createElement('canvas'), x, m = flashMeter(), i; c.width = 16; c.height = 28; x = c.getContext('2d', { willReadFrequently: true });
    for (i = 0; i < steps; i++) { x.fillStyle = hz > 0 && Math.floor(i / 60 * hz * 2) % 2 ? '#fff' : '#000'; x.fillRect(0, 0, 16, 28); m.push(x.getImageData(0, 0, 16, 28).data, i / 60); }
    return m.result();
  };
  function flashCheck(say) {
    var scenes = [{ nm: 'Stage 2, wave 3', from: { stage: 2, wave: 2, golden: 0, cheer: 100 } }, { nm: 'Champion fight', from: { stage: 2, wave: NWAVES, golden: 0, cheer: 100 } }], si = 0, res = [];
    var GW = 16, GH = 28, tc = document.createElement('canvas'), tx; tc.width = GW; tc.height = GH; tx = tc.getContext('2d', { willReadFrequently: true });
    function runScene() {
      if (si >= scenes.length) { labBot = false; finish(); return; }
      var sc = scenes[si], tries = 0, simT = 0, steps = 0, m = flashMeter();
      startFrom(sc.from);
      (function wait() {
        if (!(S && !S.over && !gameEl.hidden && running && S.stage === 2)) { if (++tries > 100) { res.push({ nm: sc.nm, bad: 1 }); si++; runScene(); return; } setTimeout(wait, 50); return; }
        halt(); labBot = true;
        (function chunk() {
          var k;
          for (k = 0; k < 40 && steps < 720 && !S.over; k++, steps++) { update(1 / 60); draw(); simT += 1 / 60; tx.drawImage(cv, 0, 0, GW, GH); m.push(tx.getImageData(0, 0, GW, GH).data, simT); }
          say('Checking ' + sc.nm + ' (' + Math.round(steps / 7.2) + '%)');
          if (steps < 720 && !S.over) { setTimeout(chunk, 0); return; }
          var r = m.result(); r.nm = sc.nm; if (r.moved < r.frames * 0.1) r.bad = 1;   /* a picture that never changed proves nothing */
          res.push(r); si++; runScene();
        }());
      }());
    }
    function finish() {
      var worst = 0, wn = '', wt = 0, wr = 0, i, bad = 0;
      for (i = 0; i < res.length; i++) { if (res[i].bad) { bad++; continue; } if (res[i].g.n > worst) { worst = res[i].g.n; wn = res[i].nm; wt = res[i].g.at; } if (res[i].r.n > wr) wr = res[i].r.n; }
      var top = Math.max(worst, wr), word = bad === res.length ? 'Could not check' : top > 3 ? 'Problem' : top > 1.5 ? 'Good' : 'Great';
      var txt = word + '. Most big flashes in any one second: ' + (Math.round(worst * 10) / 10) + ' (the limit is 3). Red flashes: ' + (Math.round(wr * 10) / 10) + '.';
      if (word === 'Problem') txt += ' Cause: ' + wn + ' at about ' + Math.round(wt * 10) / 10 + ' s. Next step: soften or shorten the flash effects there.';
      else if (word === 'Could not check') txt += ' The picture did not change or a scene did not start. Next step: try again from the title screen.';
      else txt += ' Checked ' + (res.length - bad) + ' busy scenes with a helper that always throws. A rough check, not a legal or medical test.';
      labBot = false; showCard('Flash check', txt, 'Close', function () { toTitle(); }); $('gBtn2').hidden = true;
    }
    labClose(); if (!gameEl.hidden) toTitle(); runScene();
  }
  window.__deviceCheck = deviceCheck;   /* QA: a short run that hands back the report text */
  function tapTime() {
    var f = performance.getEntriesByName && performance.getEntriesByName('first-contentful-paint')[0], fp = f ? Math.round(f.startTime) : -1, tp = BOOT_MS;
    var word = tp <= 1000 ? 'Great' : tp <= 2000 ? 'Good' : tp <= 4000 ? 'Needs attention' : 'Problem';
    return word + '. The game finished starting after ' + tp + ' ms' + (fp >= 0 ? ' (first paint at ' + fp + ' ms)' : '') + '. The menu answers taps from then on. Measured on this load only; a slow phone will differ. The goal is under 1000 ms.' + (word === 'Needs attention' || word === 'Problem' ? ' Next step: look at what runs before the title appears.' : '');
  }
  function panel() {
    var d = document.createElement('div'), h, i, w = '';
    d.className = 'lab';
    for (i = 1; i <= NWAVES; i++) w += '<option value="' + i + '">Wave ' + i + '</option>';
    h = '<h3>Minigame</h3><div class="row"><button class="btn" data-a="roll" type="button">Play Pineapple Roll</button></div>' +
      '<h3>Stages</h3><div class="row"><select id="labS" aria-label="Stage"><option value="1">Stage 1</option><option value="2">Stage 2</option><option value="3">Stage 3</option><option value="4">Stage 4</option><option value="5">Stage 5</option></select><select id="labW" aria-label="Wave">' + w + '<option value="9">Champion</option></select><button class="btn" data-a="stage" type="button">Start there</button></div>' +
      '<h3>Give</h3><div class="row"><button class="btn" data-a="b10" type="button">+10 bank</button><button class="btn" data-a="b100" type="button">+100 bank</button><button class="btn" data-a="tro" type="button">All trophies</button><button class="btn" data-a="upg" type="button">All upgrades</button><button class="btn" data-a="rst" type="button">Reset save</button></div>' +
      '<div class="row"><button class="btn" data-a="pz" type="button">Zippy</button><button class="btn" data-a="pm" type="button">Mega</button><button class="btn" data-a="ph" type="button">Cheer up</button><button class="btn" data-a="pf" type="button">Toasty</button><button class="btn" data-a="nt" type="button">Next trophy</button></div>' +
      '<h3>Checks</h3><div class="row"><button class="btn" data-a="dev" type="button">Device check (20 s)</button><button class="btn" data-a="flash" type="button">Flash check</button><button class="btn" data-a="tap1" type="button">First tap time</button></div>' +
      '<h3>Shooting test</h3><div class="row"><button class="btn" data-a="shoot" type="button">Tap vs swipe cannon (2 min)</button></div><div class="row"><button class="btn" data-a="pzt" type="button">Where to hit: huddles, tap (1 min)</button><button class="btn" data-a="pzs" type="button">Where to hit: huddles, swipe</button></div><div class="row"><button class="btn" data-a="pkt" type="button">Where to hit: stacks, tap (1 min)</button><button class="btn" data-a="pks" type="button">Where to hit: stacks, swipe</button></div><div class="row"><button class="btn" data-a="fg" type="button">Fish and gulls check (20 s)</button><button class="btn" data-a="cs" type="button">Everything-at-once speed check (60 s)</button></div><h3>Color view</h3><div class="row"><button class="btn" data-a="cb" type="button">Color view: ' + CB[cbI][0] + '</button></div>' +
      '<div class="note">Power-ups and trophies appear on the table while a stage is running (open this from the pause card).</div><h3>Tuning</h3>';
    SL.forEach(function (s) { h += '<label class="sl" title="' + s[5] + '"><span>' + s[1] + '</span><input type="range" data-k="' + s[0] + '" min="' + s[2] + '" max="' + s[3] + '" step="' + s[4] + '"><output></output></label>'; });
    h += '<div class="row"><button class="btn" data-a="def" type="button">Reset tuning</button></div><div class="msg" aria-live="polite"></div>';
    d.innerHTML = h;
    function sync() { SL.forEach(function (s) { var r = d.querySelector('[data-k="' + s[0] + '"]'); r.value = cur(s[0]); r.nextSibling.textContent = String(Math.round(cur(s[0]) * 100) / 100); }); }
    sync();
    function say(t) { d.querySelector('.msg').textContent = t; }
    d.addEventListener('input', function (e) { var k = e.target.getAttribute && e.target.getAttribute('data-k'); if (!k) return; apply(k, +e.target.value); e.target.nextSibling.textContent = String(Math.round(+e.target.value * 100) / 100); });
    d.addEventListener('click', function (e) {
      var a = e.target.getAttribute && e.target.getAttribute('data-a'), live = !gameEl.hidden && !K && S && !S.over, i, k, o;
      if (!a) return;
      if (/^(roll|dev|flash|tap1|shoot|pzt|pzs|pkt|pks|fg|cs)$/.test(a)) LfcCorePlan.lastRun.step(e.target.textContent);   /* if the page dies mid-test, the next load says which test it was */
      if (a === 'roll') labGo(startSkee);
      else if (a === 'stage') { var n = +d.querySelector('#labW').value; labGo(function () { startFrom({ stage: +d.querySelector('#labS').value, wave: n >= 9 ? NWAVES : n - 1, golden: 0, cheer: 100 }); }); }
      else if (a === 'b10' || a === 'b100') { sv.bank = Math.min(999999, sv.bank + (a === 'b10' ? 10 : 100)); kit.save(sv); say('Bank: ' + sv.bank); }
      else if (a === 'tro') { sv.ach = 1023; kit.save(sv); say('All 10 trophies unlocked.'); }
      else if (a === 'upg') { sv.au = 1; sv.ar = 3; sv.ap = 2; sv.lm = 3; kit.save(sv); say('Auto Slingshot, Faster Fling, Better Pineapples and the Lime Launcher maxed.'); }
      else if (a === 'rst') { o = kit.validate({}); for (k in o) sv[k] = o[k]; kit.save(sv); updateContinue(); say('Save reset.'); }
      else if (a === 'dev') deviceCheck();
      else if (a === 'fg') fishGullCheck();
      else if (a === 'cs') cannonSpeedCheck();
      else if (a === 'shoot') labGo(shoot);
      else if (a === 'pzt') labGo(function () { puzzle('tap'); });
      else if (a === 'pzs') labGo(function () { puzzle('flick'); });
      else if (a === 'pkt') labGo(function () { puzzle('tap', 'stack'); });
      else if (a === 'pks') labGo(function () { puzzle('flick', 'stack'); });
      else if (a === 'flash') { say('Checking Stage 2, wave 3 (0%)'); flashCheck(say); }
      else if (a === 'tap1') say(tapTime());
      else if (a === 'cb') { var nm = cbSet((cbI + 1) % CB.length); e.target.textContent = 'Color view: ' + nm; say('Showing: ' + nm + (cbI ? '. Tap again for the next view.' : '.')); }
      else if (a === 'def') { for (k in LAB0) apply(k, LAB0[k]); sync(); say('Tuning back to normal.'); }
      else if (a === 'nt') { if (!live) { say('Start a stage first.'); return; } for (i = 0; i < ACH.length; i++) if (!((sv.ach | S.earned) & (1 << i))) { award(i); break; } labClose(); if (S.paused) resume(); }
      else if (a === 'pz' || a === 'pm' || a === 'ph' || a === 'pf') { if (!live) { say('Start a stage first.'); return; } spawnPU(a); labClose(); if (S.paused) resume(); }
    });
    return d;
  }

  /* Shooting test (tester only), third version (2026.11.19): the Royal Smash cannon (mechanics and feel only, see /mnt/project-files/pineapple-defense/shooting-research/SHOOTING-FEEL-RESEARCH-v2-2026.11.19.md).
     No aiming phase: the pineapple fires the moment you tap (Tap) or the moment a swipe has moved 4 % up (Swipe), straight at that spot or direction, fast and almost flat. It hits anything it meets on the
     way (swept check), pushes the penguin back up the lane, bounces off at half speed, and a tumbling penguin knocks the next one (up to 6, "x2!"). Hit pause, a small shake, slow motion on the last penguin
     of a wave, and a faint ghost of the last shot. No aim lock, no aim assist, no sound, nothing punishing. Two 60 s rounds, random order, Fun? Easy?, then a copy-paste report. Nothing is saved or sent. */
  var SH = null, shCalmWas = false, shSave = null, shOv = null, shCtx = null, shGhost = null, balls = [], shPid = null;
  var SPEED = 2.2, GRAV = 0.9, BOUNCE = 0.5, LIFE = 0.6, PUSH = 0.55, DECAY = 4.5, CHAIN_MAX = 6, SWIPE = 0.04, CD = 0.35;
  /* Pineapple types (tester): each shot in the puzzle round comes from a fixed queue shown in the counter row. */
  var DEFS = {
    classic: { name: 'Classic', speed: 2.2, grav: 0.9, bounce: 0.5, life: 0.6, push: 0.55, rb: 0.32, size: 1, img: 'pa', col: '#f8bd1c', blast: 0 },
    bounce: { name: 'Bouncer', speed: 2.2, grav: 0.5, bounce: 0.97, life: 1.3, push: 0.5, rb: 0.32, size: 1, img: 'pa', col: '#35c2b6', blast: 0 },
    blast: { name: 'Blaster', speed: 1.9, grav: 0.9, bounce: 0.2, life: 0.25, push: 0.75, rb: 0.36, size: 1.25, img: 'pl', col: '#e2570a', blast: 1.7 },
    heavy: { name: 'Heavy', speed: 1.3, grav: 1.1, bounce: 0.85, life: 1.0, push: 1.1, rb: 0.52, size: 1.45, img: 'pm', col: '#8a5a2b', blast: 0 },
    dart: { name: 'Dart', speed: 3.8, grav: 0.15, bounce: 0.25, life: 0.4, push: 0.35, rb: 0.22, size: 0.75, img: 'pa', col: '#ffffff', blast: 0 }
  };
  function shEnd() {
    SH = null; labTick = null; shGhost = null; shPid = null; balls.forEach(function (b) { b.sh.dead = true; }); balls = [];
    if (shSave) { AIMW = shSave.aimw; sv.hs = shSave.hs; sv.sk = shSave.sk; sv.ib = shSave.ib; if (shSave.calm === null) root.removeAttribute('data-calm'); else root.setAttribute('data-calm', shSave.calm); shSave = null; }
    if (shOv) { shOv.remove(); shOv = null; shCtx = null; }
  }
  function shFeelOn() {   /* no lock-on; hit pause, shake and the early-tap buffer on; Calm switched off (it silences pause and shake) and put back after */
    if (!shSave) { shSave = { aimw: AIMW, hs: sv.hs, sk: sv.sk, ib: sv.ib, calm: root.getAttribute('data-calm') }; shCalmWas = shSave.calm === '1'; }
    AIMW = 0; sv.hs = 1; sv.sk = 3; sv.ib = 1; root.setAttribute('data-calm', '0');
  }
  var shThrow = throwAt, shHit = hitPenguin, shUpdate = update;
  function bsize(y) { var p = Math.max(0.05, Math.min(1, (y - hy) / (gy - hy))), ty = effType(); return Math.min(slingGeom().ps * 0.92 * ty.size, psz(p) * 0.62 * ty.size); }
  function spawnBall(ox, oy, dx, dy, type) {
    var def = DEFS[type] || DEFS.classic, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = Math.min(-0.05, dy / len), n = Math.hypot(ux, uy), V = def.speed * H, ty0 = effType();
    var sh = { ty: Object.assign({}, ty0, { img: def.img, size: ty0.size * def.size }), s0: bsize(oy) * def.size, x0: ox, y0: oy, xE: ox, yE: oy, pEnd: 0.5, t: 0, T: 1e9, arc: 0, spin: (Math.random() < 0.5 ? -1 : 1) * 14, ph: 0, cheer: false, soft: false };
    shots.push(sh);
    balls.push({ x: ox, y: oy, vx: ux / n * V, vy: uy / n * V, hit: [], life: null, hits: 0, chain: 0, ko: 0, sh: sh, pts: [], def: def, type: type || 'classic' });
  }
  throwAt = function () {
    if (SH && SH.on && SH.puzzle && SH.left <= 0) return;   /* out of pineapples: nothing fires, nothing is lost */
    var n = shots.length; shThrow.apply(null, arguments);
    if (SH && SH.on && shots.length > n) {
      var sh = shots.pop(); SH.th++; SH.t.push(Math.round(performance.now() - SH.t0)); if (SH.puzzle) { SH.left--; SH.lastShot = S.t; }
      if (S.fx.zip <= 0 && S.cd > CD) { S.cd = CD; S.cdMax = CD; }
      var ty = SH.puzzle ? SH.queue[SH.used++] || 'classic' : SH.cycle ? ['classic', 'bounce', 'blast', 'heavy', 'dart'][SH.th % 5] : 'classic';
      if (SH.puzzle) { SH.by[ty] = SH.by[ty] || { n: 0, ko: 0 }; SH.by[ty].n++; }
      spawnBall(arguments[0], arguments[1], arguments[2], arguments[3], ty);
    }
  };
  hitPenguin = function (pg, x, y) { if (SH && SH.on) SH.hit++; var r = shHit(pg, x, y); if (SH && SH.on && pg.st === 'hit' && !pg.kd) { pg.kd = 1; SH.ko++; } return r; };
  function tumble(pg, vx, vy, ball, push) {   /* knock a penguin back up its lane (and sideways), in lane units */
    push = push || PUSH; pg.kp = vy / (gy - hy) * push; pg.kx = vx / (FW * sc(pg.p)) * push; pg.kb = ball;
  }
  function lastOne() { var i, n = Math.max(0, S.toSpawn - S.spawned); if (SH && SH.puzzle && SH.gi < SH.groups.length) return false; for (i = 0; i < penguins.length; i++) if (penguins[i].st === 'walk') n++; return n === 0; }
  var shSlow = false;
  function slowmo() { if (shSlow || calm) return; shSlow = true; var was = timeScale; timeScale = 0.35; setTimeout(function () { timeScale = was; shSlow = false; }, 500); }
  function ballStep(b, dt) {
    var k, h = dt / 2, i, pg, c, px0, py0, d, dx, dy, t, rb, nx, ny, dot, sp, df = b.def, q, c2, ex, ey, el;
    for (k = 0; k < 2; k++) {
      px0 = b.x; py0 = b.y; b.vy += df.grav * H * h; b.x += b.vx * h; b.y += b.vy * h; rb = bsize(b.y) * df.size * df.rb;
      for (i = 0; i < penguins.length; i++) {
        pg = penguins[i]; if (pg.st !== 'walk' || b.hit.indexOf(pg) >= 0) continue;
        c = penCenter(pg); dx = b.x - px0; dy = b.y - py0; t = (dx * dx + dy * dy) ? Math.max(0, Math.min(1, ((c.x - px0) * dx + (c.y - py0) * dy) / (dx * dx + dy * dy))) : 0;
        d = Math.hypot(px0 + dx * t - c.x, py0 + dy * t - c.y);
        if (d < c.s * 0.42 + rb) {
          b.hit.push(pg); b.hits++; sp = Math.hypot(b.vx, b.vy);
          hitPenguin(pg, c.x, c.y - c.s * 0.2);
          if (pg.st === 'hit') { b.ko++; tumble(pg, b.vx, b.vy, b, df.push); } else { pg.pop = 1; pg.p = Math.max(0.03, pg.p - 0.03); }
          if (df.blast) {   /* Blaster: everything close to the impact is knocked outward */
            for (el = 0; el < penguins.length; el++) {
              q = penguins[el]; if (q === pg || q.st !== 'walk') continue; c2 = penCenter(q);
              if (Math.hypot(c2.x - c.x, c2.y - c.y) < c.s * df.blast) {
                ex = c2.x - c.x; ey = c2.y - c.y; d = Math.hypot(ex, ey) || 1; b.hit.push(q); hitPenguin(q, c2.x, c2.y - c2.s * 0.2);
                if (q.st === 'hit') { b.ko++; tumble(q, ex / d * sp * 0.6, ey / d * sp * 0.6 - sp * 0.15, b, df.push); } else { q.pop = 1; }
              }
            }
            burst(c.x, c.y, 18, PINE_COL); shakeAdd(0.25); popText(c.x, c.y - c.s * 0.9, 'Boom!', '#d4540a', 1);
          }
          nx = b.x - c.x; ny = b.y - c.y; d = Math.hypot(nx, ny) || 1; nx /= d; ny /= d; dot = b.vx * nx + b.vy * ny;
          if (dot < 0) { b.vx = (b.vx - 2 * dot * nx) * df.bounce; b.vy = (b.vy - 2 * dot * ny) * df.bounce; }
          burst(c.x, c.y, 10, SNOW_COL); if (b.life === null) b.life = df.life;
          if (lastOne()) slowmo();
        }
      }
      if (b.life !== null) b.life -= h;
    }
    b.sh.x0 = b.sh.xE = b.x; b.sh.y0 = b.sh.yE = b.y; b.sh.s0 = bsize(b.y) * df.size; b.sh.pEnd = Math.max(0.05, Math.min(1, (b.y - hy) / (gy - hy)));
    if (b.pts.length < 40) b.pts.push({ x: b.x, y: b.y });
    return (b.life !== null && b.life <= 0) || b.y < hy - H * 0.12 || b.y > H * 1.05 || b.x < -W * 0.1 || b.x > W * 1.1;
  }
  function tumbleStep(dt) {
    var i, j, pg, q, c1, c2, sp, f = Math.exp(-DECAY * dt), b;
    for (i = 0; i < penguins.length; i++) {
      pg = penguins[i]; if (pg.kp === undefined) continue;
      if (pg.st !== 'hit') { pg.kp = undefined; continue; }
      pg.p = Math.max(0.03, Math.min(0.95, pg.p + pg.kp * dt)); pg.xn = Math.max(-1.1, Math.min(1.1, pg.xn + pg.kx * dt)); pg.kp *= f; pg.kx *= f;
      sp = Math.hypot(pg.kp * (gy - hy), pg.kx * FW * sc(pg.p)); if (sp < H * 0.3) { pg.kp = undefined; continue; }
      b = pg.kb; if (!b || b.chain >= CHAIN_MAX) continue;
      c1 = penCenter(pg);
      for (j = 0; j < penguins.length; j++) {
        q = penguins[j]; if (q === pg || q.st !== 'walk' || (q.knAt && S.t - q.knAt < 0.6)) continue;
        c2 = penCenter(q); if (Math.hypot(c1.x - c2.x, c1.y - c2.y) < (c1.s + c2.s) * 0.36) {
          q.knAt = S.t; b.chain++; hitPenguin(q, c2.x, c2.y - c2.s * 0.2);
          if (q.st === 'hit') { b.ko++; q.kp = pg.kp * 0.5; q.kx = pg.kx * 0.5; q.kb = b; } else { q.pop = 1; }
          popText(c2.x, c2.y - c2.s * 0.75, 'x' + (b.chain + 1) + '!', '#d4540a', 1); shakeAdd(0.08);
          if (lastOne()) slowmo();
          if (b.chain >= CHAIN_MAX) break;
        }
      }
    }
  }
  function puzzleStep(dt) {
    var i, n = 0, g, c, k, t;
    S.spawnT = 1e9; S.cheer = 100;   /* the game's own spawner is parked; nothing in this round can cost you anything */
    for (i = 0; i < penguins.length; i++) if (penguins[i].st === 'walk') n++;
    if (SH.gi < SH.groups.length && (SH.nextT === null ? S.t - SH.s0 > 1 : (S.t - SH.nextT > 3 && (n <= 1 || S.t - SH.nextT > 14)))) {
      g = SH.groups[SH.gi++]; c = (SH.gi % 2 ? -1 : 1) * (0.12 + Math.random() * 0.3); SH.nextT = S.t;
      var stk = SH.kind === 'stack', rows = Math.ceil(g / 2);
      for (k = 0; k < g; k++) {
        t = stk ? c + ((k % 2) - 0.5) * 0.1 + (Math.random() - 0.5) * 0.012 : c + ((k % 3) - 1) * 0.075 + (Math.random() - 0.5) * 0.02;
        penguins.push({ id: ++S.id, kind: 'rh', xn: Math.max(-0.9, Math.min(0.9, t)), x0: t, p: 0.06 + (stk ? Math.floor(k / 2) * 0.05 : Math.floor(k / 3) * 0.035), v: 0.045, st: 'walk', t: 0, mood: 'happy', ph: Math.random() * 6, av: 0, base: 0.045, hp: stk ? (Math.floor(k / 2) >= rows - 2 || Math.random() < 0.25 ? 2 : 1) : Math.random() < 0.4 ? 2 : 1, ev: 0, side: Math.random() < 0.5 ? -1 : 1, hat: false, puff: 0, a: 1, gear: rollGear() });
        S.spawned++; n++;
      }
    }
    SH.walk = n;
    if (SH.gi >= SH.groups.length && n === 0 && S.t - SH.s0 > 2) { S.toSpawn += 1000; SH.done = true; }
    else if (SH.left <= 0 && balls.length === 0 && S.t - SH.lastShot > 3) { S.toSpawn += 1000; SH.done = true; }
  }
  update = function (dt) {
    if (SH && SH.on && SH.puzzle && !SH.done) puzzleStep(dt);
    shUpdate(dt);
    if (!(SH && SH.on)) return;
    var i, b;
    for (i = balls.length - 1; i >= 0; i--) {
      b = balls[i];
      if (ballStep(b, dt)) { b.sh.dead = true; if (b.chain > 0) SH.chain++; if (SH.puzzle) { var by = SH.by[b.type]; if (by) by.ko += b.ko; }
      if (SH.puzzle && b.ko >= 4) { SH.best = Math.max(SH.best, b.ko); popText(Math.max(W * 0.3, Math.min(W * 0.7, b.x)), Math.max(H * 0.3, b.y), 'x' + b.ko + '! ' + (b.ko >= 6 ? 'Perfect!' : 'Great spot!'), '#d4540a', 1); shakeAdd(0.15); } if (b.y > hy) burst(b.x, Math.min(b.y, H * 0.95), 5, PINE_COL); shGhost = { pts: b.pts, t0: performance.now() }; balls.splice(i, 1); }
    }
    tumbleStep(dt);
  };
  function shSize() {
    if (!shOv) { shOv = document.createElement('canvas'); shOv.style.cssText = 'position:fixed;pointer-events:none;z-index:5'; document.body.appendChild(shOv); shCtx = shOv.getContext('2d'); }
    var r = cv.getBoundingClientRect(), d = window.devicePixelRatio || 1, w = Math.round(r.width * d), h = Math.round(r.height * d);
    shOv.style.left = r.left + 'px'; shOv.style.top = r.top + 'px'; shOv.style.width = r.width + 'px'; shOv.style.height = r.height + 'px';
    if (shOv.width !== w || shOv.height !== h) { shOv.width = w; shOv.height = h; }
    shCtx.setTransform(d * r.width / W, 0, 0, d * r.height / H, 0, 0);
  }
  function dots(pts, alpha) {
    var g = shCtx, i; g.save(); g.globalAlpha = alpha;
    for (i = 0; i < pts.length; i += 2) { g.beginPath(); g.arc(pts[i].x, pts[i].y, Math.max(2.5, H * 0.008), 0, 6.2832); g.fillStyle = '#fff7e3'; g.fill(); g.lineWidth = 1.5; g.strokeStyle = '#7a3a05'; g.stroke(); }
    g.restore();
  }
  function shFrame() {
    if (!shOv && !(SH && SH.on)) return;
    if (SH && SH.on) {
      shSize(); shCtx.clearRect(0, 0, W, H);
      balls.forEach(function (b) { var n = b.pts.length, g = shCtx, i; for (i = Math.max(1, n - 5); i < n; i++) { g.beginPath(); g.moveTo(b.pts[i - 1].x, b.pts[i - 1].y); g.lineTo(b.pts[i].x, b.pts[i].y); g.lineWidth = Math.max(2, bsize(b.pts[i].y) * 0.35 * (i - n + 6) / 5); g.lineCap = 'round'; g.strokeStyle = b.def.col; g.globalAlpha = 0.25 + 0.12 * (i - n + 6); g.stroke(); g.globalAlpha = 1; } });
      if (shGhost) { var a = 1 - (performance.now() - shGhost.t0) / 1000; if (a > 0) dots(shGhost.pts, a * 0.5); else shGhost = null; }
      if (SH.puzzle) {   /* the pineapples left this stage: a row of icons and a number */
        var g2 = shCtx, tot = SH.total, i2, r2 = Math.min(W / (tot * 2.6), H * 0.016), x2 = W / 2 - (tot - 1) * r2 * 1.25, y2 = H * 0.205;
        g2.save(); g2.fillStyle = 'rgba(255,247,227,.85)'; g2.fillRect(W / 2 - tot * r2 * 1.25 - r2 * 5, y2 - r2 * 1.6, tot * r2 * 2.5 + r2 * 10, r2 * 3.2);
        for (i2 = 0; i2 < tot; i2++) { g2.beginPath(); g2.arc(x2 + i2 * r2 * 2.5, y2, r2, 0, 6.2832); g2.globalAlpha = i2 >= SH.used ? 1 : 0.25; g2.fillStyle = DEFS[SH.queue[i2]].col; g2.fill(); g2.lineWidth = i2 === SH.used ? 3.5 : 1.5; g2.strokeStyle = '#7a3a05'; g2.stroke(); }
        g2.globalAlpha = 1; g2.fillStyle = '#7a3a05'; g2.font = '800 ' + Math.round(r2 * 2.2) + 'px sans-serif'; g2.textAlign = 'left'; g2.fillText('x ' + SH.left, W / 2 + tot * r2 * 1.25 + r2 * 0.4, y2 + r2 * 0.8); if (SH.left > 0) { g2.textAlign = 'center'; g2.font = '800 ' + Math.round(r2 * 1.7) + 'px sans-serif'; g2.fillText('Next: ' + DEFS[SH.queue[SH.used]].name, W / 2, y2 + r2 * 3.4); }
        g2.restore();
      }
    } else if (shOv) shCtx.clearRect(0, 0, W, H);
    requestAnimationFrame(shFrame);
  }
  function shOk(e) { return SH && SH.on && SH.mode && e.target === cv && S && !S.over && !S.paused; }
  window.addEventListener('pointerdown', function (e) {
    if (!shOk(e) || shPid !== null) return;
    var p = rel(e), o = pouchPos();
    if (SH.mode === 'tap') {
      if (p.y > o.y - H * 0.05 || p.y < H * 0.1) return;
      e.stopImmediatePropagation(); e.preventDefault();
      throwAt(o.x, o.y, p.x - o.x, p.y - o.y, 1.5, { x: p.x, y: p.y });
      return;
    }
    if (p.y < H * 0.55) return;
    shPid = e.pointerId; SH.sx = p.x; SH.sy = p.y; SH.fired = false; e.stopImmediatePropagation(); e.preventDefault(); try { cv.setPointerCapture(e.pointerId); } catch (x) {}
  }, true);
  window.addEventListener('pointermove', function (e) {
    if (shPid !== e.pointerId || !(SH && SH.on)) return;
    e.stopImmediatePropagation(); if (SH.fired) return;
    var p = rel(e), vx = p.x - SH.sx, vy = p.y - SH.sy, o = pouchPos();
    if (-vy >= H * SWIPE) { SH.fired = true; throwAt(o.x, o.y, vx, vy, 1.5, { x: o.x + vx * 10, y: o.y + vy * 10 }); }
  }, true);
  window.addEventListener('pointerup', function (e) { if (shPid === e.pointerId) { shPid = null; e.stopImmediatePropagation(); } }, true);
  window.addEventListener('pointercancel', function (e) { if (shPid === e.pointerId) shPid = null; }, true);
  function shCard(title, body, b1, f1, b2, f2, b3, f3) { if (gameEl.hidden) { titleEl.hidden = true; gameEl.hidden = false; resize(); } showCard(title, body, b1, f1, b2, f2, b3, f3); $('gBody').style.cssText = 'white-space:pre-wrap;text-align:left;user-select:text;-webkit-user-select:text;word-break:break-word'; }
  function shoot() {
    var order = Math.random() < 0.5 ? ['tap', 'flick'] : ['flick', 'tap'], res = [], i = 0, RUN = 60;
    SH = { on: false }; shFeelOn();
    function name(m) { return m === 'tap' ? 'Tap to fire' : 'Swipe to fire'; }
    function how(m) {
      return m === 'tap' ? 'Tap the spot you want to hit. The pineapple fires the moment you touch, fast and almost straight. Hit the part of a group that sends penguins into each other.'
        : 'Swipe up from the lower part of the screen. The pineapple fires as soon as the swipe moves a little, in the direction you swiped. Speed and length do not matter. Hit the part of a group that sends penguins into each other.';
    }
    function intro() {
      var m = order[i];
      shCard('Round ' + (i + 1) + ' of 2: ' + name(m), how(m) + '\nIt lasts 60 seconds. Keep this tab in front.', 'Start', go, 'Stop test', function () { shEnd(); gBodyReset(); toTitle(); });
    }
    function go() {
      var m = order[i]; hideCard(); gBodyReset();
      balls.forEach(function (b) { b.sh.dead = true; }); balls = [];
      SH = { on: false, mode: m, th: 0, hit: 0, chain: 0, t: [], t0: 0, s0: 0 }; shGhost = null; shPid = null;
      startFrom({ stage: 2, wave: 1, golden: 0, cheer: 100 });
      var tries = 0, bar = document.createElement('div');
      bar.style.cssText = 'position:fixed;left:50%;top:8px;transform:translateX(-50%);z-index:60;max-width:92vw;padding:.4em .9em;border-radius:999px;background:rgba(255,247,227,.96);color:#4a2b0f;font:800 14px/1.2 var(--display);box-shadow:0 2px 8px rgba(0,0,0,.25)';
      document.body.appendChild(bar);
      (function wait() {
        if (!(S && !S.over && !gameEl.hidden && running && S.stage === 2)) { if (++tries > 200) { bar.remove(); shEnd(); shCard('Shooting test', 'The stage did not start. Close and try again.', 'Close', function () { gBodyReset(); toTitle(); }); return; } setTimeout(wait, 50); return; }
        SH.on = true; SH.t0 = performance.now(); SH.s0 = S.t; requestAnimationFrame(shFrame);
        labTick = function () {
          var e = S.t - SH.s0; bar.textContent = name(m) + ': ' + Math.max(0, Math.ceil(RUN - e)) + ' s left. Shots ' + SH.th;
          if (e >= RUN || S.over) { labTick = null; SH.on = false; SH.sec = Math.round(e); bar.remove(); after(); }
        };
      }());
    }
    function after() {
      var r = SH; res.push(r); SH = { on: false }; shPid = null; balls.forEach(function (b) { b.sh.dead = true; }); balls = [];
      if (!gameEl.hidden && S && !S.over) pause();
      shCard('Round ' + (i + 1) + ' done: ' + name(r.mode), 'Shots: ' + r.th + '. Hits: ' + r.hit + '. Chains: ' + r.chain + '.\nWas it fun?', 'Yes', function () { r.fun = 'yes'; easy(r); }, 'A bit', function () { r.fun = 'a bit'; easy(r); }, 'No', function () { r.fun = 'no'; easy(r); });
    }
    function easy(r) { shCard('Round ' + (i + 1) + ': ' + name(r.mode), 'Was it easy to hit what you aimed at?', 'Easy', function () { r.easy = 'yes'; next(); }, 'Hard', function () { r.easy = 'no'; next(); }); }
    function next() { hideCard(); gBodyReset(); i++; if (i < 2) intro(); else pick(); }
    function pick() {
      shCard('Which felt better?', 'First round was ' + name(order[0]) + '. Second round was ' + name(order[1]) + '.', 'First', function () { fin('first'); }, 'Second', function () { fin('second'); });
    }
    function fin(w) {
      var best = res[w === 'first' ? 0 : 1], L = ['Pineapple Defense shooting test, version 3: cannon shot (tester build)', 'Preferred: ' + name(best.mode) + ' (' + w + ' round)'];
      res.forEach(function (r, k) {
        var ts = r.t, gaps = [], j; for (j = 1; j < ts.length; j++) gaps.push(ts[j] - ts[j - 1]);
        L.push('Round ' + (k + 1) + ': ' + name(r.mode) + '. ' + r.sec + ' s. Shots ' + r.th + ', hits ' + r.hit + ' (' + (r.th ? Math.round(r.hit * 100 / r.th) : 0) + ' per 100 shots), shots that chained ' + r.chain + '. Fun: ' + r.fun + '. Easy to hit what I aimed at: ' + r.easy + '.' + (gaps.length ? ' Median gap between shots ' + Math.round(gaps.sort(function (a, b) { return a - b; })[gaps.length >> 1]) + ' ms.' : ''));
      });
      L.push('Run: Stage 2 wave 2, real game. Calm was ' + (shCalmWas ? 'on before the test and was switched off for it' : 'off') + '. Cannon kit on: fires on touch, fast flat shot, hits anything on its path, push back and bounce, chains up to 6, hit pause, small shake, slow motion on the last penguin, ghost of the last shot, no aim lock. Hits count every pineapple and chain link.');
      var txt = [cpLabel].concat(L, devInfo()).join('\n'); shEnd(); cpDone();
      shCard('Shooting test result', txt, 'Copy results', function () {}, 'Close', function () { gBodyReset(); toTitle(); });
      var b1 = $('gBtn1'); b1.onclick = function () { copyText(txt, function (ok) { b1.textContent = ok ? 'Copied. Paste it in the chat.' : 'Select the text above and copy it'; }); };
    }
    intro();
  }
  window.__shoot = shoot;
  function puzzle(mode, kind) {
    var stack = kind === 'stack', ST = stack ? 2 : 1, wd = stack ? 'stacks' : 'huddles', Wd = stack ? 'Stacks' : 'Huddles';
    var groups = stack ? [6, 8, 10] : [5, 6, 7], total = stack ? 24 : 18, queue = stack ? ['classic', 'bounce', 'blast', 'heavy', 'dart', 'bounce', 'blast', 'classic'] : ['classic', 'bounce', 'blast', 'classic', 'heavy', 'bounce', 'blast', 'heavy', 'dart'], left0 = queue.length;
    SH = { on: false }; shFeelOn();
    var nm = mode === 'tap' ? 'Tap to fire' : 'Swipe to fire';
    shCard('Where to hit: ' + wd + ' (' + nm + ')', (stack ? 'Penguins walk down in tall stacks two wide and 3 to 5 deep, one stack at a time, slowly. The front rows are tough. A hit near the front pushes the ones behind it, so choose where the chain starts.' : 'Penguins walk down in tight huddles, one huddle at a time, slowly.') + ' You have ' + left0 + ' pineapples for the whole stage, in a set order shown at the top: Classic (yellow), Bouncer (teal, ricochets into a second penguin), Blaster (orange, knocks everything near the hit), Heavy (brown, slow and strong) and Dart (white, very fast and light). Some penguins are tough and need two hits. Use each type where it counts. Unused pineapples are a bonus. Nothing here can hurt you: if you run out, the stage just ends.',
      'Start', go, 'Stop test', function () { shEnd(); gBodyReset(); toTitle(); });
    function go() {
      hideCard(); gBodyReset(); balls.forEach(function (b) { b.sh.dead = true; }); balls = [];
      SH = { on: false, mode: mode, kind: kind, puzzle: true, queue: queue, used: 0, by: {}, total: left0, left: left0, groups: groups, gi: 0, nextT: null, ko: 0, best: 0, th: 0, hit: 0, chain: 0, t: [], t0: 0, s0: 0, lastShot: 0, done: false };
      shGhost = null; shPid = null;
      startFrom({ stage: ST, wave: 1, golden: 0, cheer: 100 });
      var tries = 0;
      (function wait() {
        if (!(S && !S.over && !gameEl.hidden && running && S.stage === ST)) { if (++tries > 200) { shEnd(); shCard('Where to hit', 'The stage did not start. Close and try again.', 'Close', function () { gBodyReset(); toTitle(); }); return; } setTimeout(wait, 50); return; }
        S.toSpawn = total; S.spawned = 0; S.spawnT = 1e9;
        SH.on = true; SH.t0 = performance.now(); SH.s0 = S.t; requestAnimationFrame(shFrame);
        labTick = function () { if (SH.done || S.over || S.t - SH.s0 > 150) { labTick = null; SH.on = false; SH.sec = Math.round(S.t - SH.s0); after(); } };
      }());
    }
    function after() {
      var r = SH; SH = { on: false }; shPid = null; balls.forEach(function (b) { b.sh.dead = true; }); balls = [];
      if (!gameEl.hidden && S && !S.over) pause();
      shCard(Wd + ' done', 'Knocked out ' + r.ko + ' of ' + total + '. Pineapples used ' + (left0 - r.left) + ' of ' + left0 + '; unused ' + r.left + ' (bonus). Best shot knocked ' + r.best + '.\nWas it fun?', 'Yes', function () { r.fun = 'yes'; easy(r); }, 'A bit', function () { r.fun = 'a bit'; easy(r); }, 'No', function () { r.fun = 'no'; easy(r); });
    }
    function easy(r) { shCard(Wd, 'Was it clear where to hit?', 'Clear', function () { r.easy = 'yes'; fin(r); }, 'Not clear', function () { r.easy = 'no'; fin(r); }); }
    function fin(r) {
      var L = ['Pineapple Defense where-to-hit test: ' + wd + ', ' + nm + ' (tester build)',
        'Knocked out ' + r.ko + ' of ' + total + '. Pineapples used ' + (left0 - r.left) + ' of ' + left0 + ', unused ' + r.left + '. Best single shot knocked ' + r.best + '. Shots that chained ' + r.chain + '. Time ' + r.sec + ' s. Fun: ' + r.fun + '. Clear where to hit: ' + r.easy + '.',
        'By type (shots, knocked out): ' + Object.keys(DEFS).map(function (k) { var b = r.by[k]; return DEFS[k].name + ' ' + (b ? b.n + ', ' + b.ko : 'none'); }).join('; ') + '.',
        'Run: Stage ' + ST + ' scene, 3 ' + wd + ' of ' + groups.join(', ') + ' penguins (' + (stack ? 'front rows and about 1 in 4 behind them need two hits' : 'about 4 in 10 need two hits') + ') walking slowly, ' + left0 + ' pineapples in a set order of 5 types, no penalty for running out. Calm was ' + (shCalmWas ? 'on before the test and was switched off for it' : 'off') + '. Cannon kit on.'];
      var txt = [cpLabel].concat(L, devInfo()).join('\n'); shEnd(); cpDone();
      shCard('Where to hit: result', txt, 'Copy results', function () {}, 'Close', function () { gBodyReset(); toTitle(); });
      var b1 = $('gBtn1'); b1.onclick = function () { copyText(txt, function (ok) { b1.textContent = ok ? 'Copied. Paste it in the chat.' : 'Select the text above and copy it'; }); };
    }
  }
  window.__puzzle = puzzle; window.__shS = function () { return SH; };
  window.__shT = function () { var r = cv.getBoundingClientRect(); return targets().map(function (g) { var c = penCenter(g); return { x: r.left + c.x * r.width / W, y: r.top + c.y * r.height / H, vy: g.v * slowK }; }); };   /* QA: where the penguins are, in page pixels */
  /* Fish and gulls check (tester only): the same 20 s Device check on Stage 2 wave 3, but a gull-and-fish drop is forced all the time, so the drawing cost of the fish, hanky and gull shows up in the frame numbers.
     Compare with the plain Device check on the same phone: the difference is what fish and gulls cost. */
  function fishGullCheck() {
    var oldGu = sv.gu, tm = setInterval(function () { if (S && !S.over && !gameEl.hidden && S.fishT > 0) S.fishT = 0; }, 400);
    sv.gu = 3;
    deviceCheck({}, function (txt) {
      clearInterval(tm); sv.gu = oldGu;
      var out = 'Fish and gulls check: a fish with a handkerchief and a gull were forced on screen almost all the time (every frame was drawing them).\n' + txt;
      if (!gameEl.hidden) { titleEl.hidden = true; gameEl.hidden = false; }
      showCard('Fish and gulls check', out, 'Copy report', function () {}, 'Close', function () { gBodyReset(); toTitle(); });
      var body = $('gBody'), b1 = $('gBtn1');
      body.style.cssText = 'white-space:pre-wrap;text-align:left;font-size:.75rem;line-height:1.35;user-select:text;-webkit-user-select:text;word-break:break-word';
      b1.onclick = function () { copyText(out, function (ok) { b1.textContent = ok ? 'Copied. Paste it in the chat.' : 'Select the text above and copy it'; }); };
    });
  }
  /* Cannon speed check (tester only): the same 20 s Device check, but the throws are the physics cannon with all five pineapple types, chains, hit pause, shake and slow motion, so the report shows what the new mechanics and effects cost per frame. */
  function cannonSpeedCheck() {
    SH = { on: true, mode: 'tap', cycle: true, th: 0, hit: 0, chain: 0, ko: 0, t: [], t0: performance.now(), s0: 0 }; shFeelOn(); requestAnimationFrame(shFrame);
    var st = SH, oldGu = sv.gu, pkP = 0, pkF = 0, pkG = 0, both = 0, nf = 0, md = {}, mw = 0;
    sv.gu = 3;
    /* worst case: a fish and a gull on screen nearly always, and a horde kept at 14 penguins, with nothing allowed to cost a life */
    var tm = setInterval(function () {
      if (!S || S.over || gameEl.hidden) return;
      md[S.mode] = (md[S.mode] || 0) + 1; mw = S.wave;
      S.cheer = 100;
      if (S.fishT > 0) S.fishT = 0;
      if (S.mode === 'run') { S.toSpawn = 999; S.spawned = 0; for (var k = 0; k < 4 && penguins.length < 14; k++) { spawn(); penguins[penguins.length - 1].p = 0.14 + Math.random() * 0.12; } }
      pkP = Math.max(pkP, penguins.length); pkF = Math.max(pkF, S.fish.length); pkG = Math.max(pkG, S.gulls.length);
      nf++; if (S.fish.length && S.gulls.length) both++;
    }, 250);
    deviceCheck({ stage: window.__csStage || 5, wave: window.__csWave || 4, run: window.__csRun || 60000 }, function (txt) {
      clearInterval(tm); sv.gu = oldGu;
      var out = 'Everything-at-once speed check: the physics cannon with all five pineapple types, hit pause, shake, chains and slow motion, plus fish and gulls forced on and a horde kept near 14 penguins. Peak on screen: ' + pkP + ' penguins, ' + pkF + ' fish, ' + pkG + ' gulls; a fish and a gull were out together in ' + both + ' of ' + nf + ' samples. Game modes seen (250 ms samples): ' + JSON.stringify(md) + ', wave ' + mw + '. Shots ' + st.th + ', hits ' + st.hit + ', knockouts ' + st.ko + ', shots that chained ' + st.chain + '.\n' + txt;
      shEnd();
      if (!gameEl.hidden) { titleEl.hidden = true; gameEl.hidden = false; }
      showCard('Everything-at-once check', out, 'Copy report', function () {}, 'Close', function () { gBodyReset(); toTitle(); });
      var body = $('gBody'), b1 = $('gBtn1');
      body.style.cssText = 'white-space:pre-wrap;text-align:left;font-size:.75rem;line-height:1.35;user-select:text;-webkit-user-select:text;word-break:break-word';
      b1.onclick = function () { copyText(out, function (ok) { b1.textContent = ok ? 'Copied. Paste it in the chat.' : 'Select the text above and copy it'; }); };
    });
  }
  var bLab = $('bLab');
  if (bLab) bLab.addEventListener('click', function () {
    $('cardBody').replaceChildren(panel()); $('cardTitle').textContent = 'Test Lab'; $('cw').hidden = false; root.setAttribute('data-dlg', '1'); $('cardOk').focus();
  });
  var gLab = document.createElement('button'), gcw = $('gcw'), body = $('gBody'), box = null;
  gLab.className = 'btn'; gLab.type = 'button'; gLab.id = 'gLab'; gLab.textContent = 'Test Lab'; gLab.style.margin = '.5rem .4rem 0 0';
  $('gBtn2').parentNode.insertBefore(gLab, $('gBtn2'));
  gLab.addEventListener('click', function () { $('gTitle').textContent = 'Test Lab'; body.hidden = true; gLab.hidden = true; box = panel(); body.parentNode.insertBefore(box, body.nextSibling); });
  new MutationObserver(function () { if (gcw.hidden && box) { box.remove(); box = null; body.hidden = false; gLab.hidden = false; } }).observe(gcw, { attributes: true, attributeFilter: ['hidden'] });
  /* top of the page: this device's thread count and memory, and (if the last load died mid-test) the test that was running */
  var cpTop = document.createElement('div'), cpPrev = LfcCorePlan.lastRun.previous();
  cpTop.id = 'labTop'; cpTop.setAttribute('role', 'status'); cpTop.style.cssText = 'position:fixed;left:0;right:0;top:0;z-index:70;padding:.35em .7em;font:700 12px/1.3 system-ui,sans-serif;color:#173f4f;background:rgba(255,247,227,.96);border-bottom:2px solid #b79a63;pointer-events:none';
  cpTop.textContent = 'Tester build. ' + cpLabel + (cpPrev ? ' ' + cpPrev : '');
  document.body.appendChild(cpTop);
  LfcCorePlan.lastRun.step('opened the page');
}());
