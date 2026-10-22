/* Hidden speed check and error note (shipped in the normal game, off the screen until asked). Nothing is sent anywhere.
   Open it by tapping the small credit line on the title screen 7 times within 4 seconds: a card offers the 20 second Speed check (plays a busy stage by itself and ends with a plain verdict and a report to copy) and the Error note (the last slow or broken moments this device saw, kept only on this device, to copy). Copyright (c) 2026 LFC Foundry. MIT License (see LICENSE). */
  /* Device check: plays a busy stage in real time with the throwing helper, measures the real frames, and ends with a plain-words verdict and a report to copy and paste back. */
  var devRun = null;
  function devClose() { if (!$('cw').hidden) { $('cw').hidden = true; root.removeAttribute('data-dlg'); } if (!$('gcw').hidden) hideCard(); if (!gameEl.hidden) toTitle(); }
  function devStart(from) { titleEl.hidden = true; gameEl.hidden = false; loadAssets().then(function () { resize(); startStage(from); run(); }); }
  function devInfo() {
    var ua = navigator.userAgent, br = /Firefox\/([\d.]+)/.exec(ua) || /Edg\/([\d.]+)/.exec(ua) || /Chrome\/([\d.]+)/.exec(ua) || /Version\/([\d.]+).*Safari/.exec(ua), nm = /Firefox\//.test(ua) ? 'Firefox' : /Edg\//.test(ua) ? 'Edge' : /Chrome\//.test(ua) ? 'Chrome or Chromium' : /Safari\//.test(ua) ? 'Safari' : 'unknown', gpu = 'not shown', c, g, x;
    try { c = document.createElement('canvas'); g = c.getContext('webgl') || c.getContext('experimental-webgl'); if (g) { x = g.getExtension('WEBGL_debug_renderer_info'); gpu = x ? g.getParameter(x.UNMASKED_RENDERER_WEBGL) : g.getParameter(g.RENDERER); x = g.getExtension('WEBGL_lose_context'); if (x) x.loseContext(); } } catch (e) { gpu = 'not shown'; }
    return ['Browser: ' + nm + (br ? ' ' + br[1] : ''), 'Screen: ' + screen.width + ' x ' + screen.height + ' at ' + (window.devicePixelRatio || 1) + 'x, window ' + innerWidth + ' x ' + innerHeight, 'Cores: ' + (navigator.hardwareConcurrency || '?') + (navigator.deviceMemory ? ', memory about ' + navigator.deviceMemory + ' GB' : ''), 'Graphics: ' + gpu, 'Settings: Calm ' + (root.getAttribute('data-calm') === '1' ? 'on' : 'off') + ', battery saver ' + (sv.bv ? 'on' : 'off') + ', game speed ' + SPEEDS[sv.sp | 0] + '%', 'User agent: ' + ua];
  }
  function pct(a, q) { return a[Math.min(a.length - 1, Math.floor(a.length * q))]; }
  function r1(v) { return Math.round(v * 10) / 10; }
  function devReport(gaps, works, dm, qmax, dmax, hid, warm, run, ended) {
    var n = gaps.length, sg = gaps.slice().sort(function (a, b) { return a - b; }), sw = works.slice().sort(function (a, b) { return a - b; }), i, sum = 0, ws = 0, slow = 0, h = dm.hitches(), med, hz, word, why, lines, ver = /Alpha ([\d.]+)/.exec(document.querySelector('.legal').textContent);
    for (i = 0; i < n; i++) { sum += gaps[i]; ws += works[i]; }
    if (hid || n < 60) {
      word = 'Could not check'; why = hid ? 'The tab was in the background during the run, so the browser slowed it down. Keep this tab in front and the screen on, then run it again.' : 'Too few frames were measured (' + n + '). Run it again with this tab in front.'; med = 0; hz = 0;
    } else {
      med = sg[n >> 1]; hz = Math.round(1000 / med);
      for (i = 0; i < n; i++) if (gaps[i] > med * 2) slow++;
      var p95 = pct(sg, 0.95), wp = pct(sw, 0.95), slowShare = slow / n;
      var floor = sv.bv ? 40 : 25;   /* an even 15 frames a second is not smooth: steady is not the same as fast */
      word = med > floor ? 'Slow' : p95 <= med * 1.5 && h.count <= 1 && qmax === 0 ? 'Smooth' : p95 <= med * 2.5 && slowShare < 0.05 && h.count <= 4 ? 'Mostly smooth' : 'Choppy';
      why = word === 'Smooth' ? 'Frames arrived evenly and picture quality stayed at full.' : (word === 'Slow' ? 'Frames arrive about ' + r1(1000 / med) + ' a second, well under the 40 or more the game aims for' + (sv.bv ? ' even with battery saver on' : '') + '. ' : '') + (wp > med * 0.6 ? 'The game\'s own update and drawing took most of each frame here, so the game is the slow part on this device.' : 'The game\'s own code was quick (95 percent of frames took ' + r1(wp) + ' ms), so the slow part is the browser, the graphics driver or power saving.') + (qmax > 0 ? ' The game also lowered its picture quality to keep up.' : '');
    }
    lines = ['Pineapple Defense Device check', 'Version: ' + (ver ? ver[1] : '?') + (/LAB/.test(document.querySelector('.legal').textContent) ? ' (tester build)' : ''), 'Result: ' + word + '. ' + why];
    if (word !== 'Could not check') lines.push('Frames a second: ' + r1(n * 1000 / sum) + (med > floor ? ' (much slower than a normal screen; typical spacing ' + r1(med) + ' ms)' : ' (the screen seems to run at about ' + hz + ' Hz)'), 'Frame time: typical ' + r1(med) + ' ms, slowest 5 percent over ' + r1(pct(sg, 0.95)) + ' ms, slowest 1 percent over ' + r1(pct(sg, 0.99)) + ' ms, worst ' + r1(sg[n - 1]) + ' ms', 'Frames more than twice the typical time: ' + slow + ' of ' + n, 'Hitches: ' + dm.verdict(), 'The game\'s own work per frame: average ' + r1(ws / n) + ' ms, slowest 5 percent over ' + r1(pct(sw, 0.95)) + ' ms', 'Picture quality: ' + (qmax === 0 ? 'stayed at full' : 'dropped to level ' + qmax + ' of 2 (canvas step ' + dmax + ' of 4)'));
    lines.push('Run: Stage 2 wave 3 played by the throwing helper, ' + r1(run / 1000) + ' s measured after a ' + r1(warm / 1000) + ' s warm-up' + (ended ? ' (' + ended + ')' : ''), 'Start: the game finished starting after ' + BOOT_MS + ' ms', 'Graphics: ' + (GLX.on ? (GLX.mode === 2 ? 'WebGL three layers (exact order)' : 'WebGL layer (background and sprites)') : 'canvas 2D only'));
    return lines.concat(devInfo()).join('\n');
  }
  function deviceCheck(opts, done) {
    opts = opts || {};
    var warm = opts.warm || 2000, run = opts.run || 20000, gaps = [], works = [], dm = new FrameMeter({ windowMs: 600000 }), t0 = 0, t1 = 0, qmax = 0, dmax = 0, hid = false, ended = '', tries = 0, bar = devRun || (devRun = document.createElement('div'));
    bar.style.cssText = 'position:fixed;left:50%;top:8px;transform:translateX(-50%);z-index:60;max-width:92vw;padding:.4em .9em;border-radius:999px;background:rgba(255,247,227,.96);color:#4a2b0f;font:800 14px/1.2 var(--display);box-shadow:0 2px 0 #b79a63;pointer-events:none;text-align:center';
    devClose();
    function finish() {
      labTick = null; labBot = false; if (bar.parentNode) bar.parentNode.removeChild(bar);
      var txt = devReport(gaps, works, dm, qmax, dmax, hid, warm, run, ended);
      if (done) { done(txt); return; }
      showCard('Device check', txt, 'Copy report', function () {}, 'Close', function () { gBodyReset(); toTitle(); });
      var body = $('gBody'), b1 = $('gBtn1');
      body.style.cssText = 'white-space:pre-wrap;text-align:left;font-size:.75rem;line-height:1.35;user-select:text;-webkit-user-select:text;word-break:break-word';
      setTimeout(function () { var cd = gcw.querySelector('.card'); if (cd) cd.scrollTop = 0; }, 0);
      b1.onclick = function () { copyText(txt, function (ok) { b1.textContent = ok ? 'Copied. Paste it in the chat.' : 'Select the text above and copy it'; }); };
    }
    function tick(gap, now, work) {
      if (document.hidden) hid = true;
      if (!t0) t0 = now;
      var e = now - t0;
      bar.textContent = 'Device check: keep this tab in front. ' + Math.max(0, Math.ceil((warm + run - e) / 1000)) + ' s left.';
      if (e < warm) return;
      if (!t1) { t1 = now; dm.reset(); }
      gaps.push(gap); works.push(work); dm.frame(now, work, gap);
      if (qLevel > qmax) qmax = qLevel; if (dprStep > dmax) dmax = dprStep;
      if (now - t1 >= run) finish(); else if (S && S.over) { ended = 'the scene ended early'; finish(); }
    }
    devStart({ stage: 2, wave: 2, golden: 0, cheer: 100 });
    document.body.appendChild(bar); bar.textContent = 'Device check starting.';
    (function wait() {
      if (!(S && !S.over && !gameEl.hidden && running && S.stage === 2)) { if (++tries > 200) { labBot = false; if (bar.parentNode) bar.parentNode.removeChild(bar); if (done) done('Could not check: the stage did not start.'); return; } setTimeout(wait, 50); return; }
      labBot = true; labTick = tick;
    }());
  }
  function copyText(t, cb) {
    function old() { var a = document.createElement('textarea'), ok = false; a.value = t; a.style.cssText = 'position:fixed;left:-9999px;top:0'; document.body.appendChild(a); a.select(); try { ok = document.execCommand('copy'); } catch (e) { ok = false; } document.body.removeChild(a); cb(ok); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function () { cb(true); }, old); else old();
  }
  function gBodyReset() { $('gBody').style.cssText = ''; }
  new MutationObserver(function () { if ($('gcw').hidden) gBodyReset(); }).observe($('gcw'), { attributes: true, attributeFilter: ['hidden'] });

  var slowNote = null;
  try {
    slowNote = SlowNote.start({
      key: 'pd-note', header: 'Pineapple Defense ' + (/Alpha ([\d.]+)/.exec(document.querySelector('.legal').textContent) || [0, '?'])[1],
      context: function () { return typeof S === 'object' && S && !S.over && !gameEl.hidden ? ' [stage ' + S.stage + ', wave ' + S.wave + ']' : ' [title or menu]'; },
      marks: function () { return { 'the game script finished starting': BOOT_MS }; }
    });
  } catch (e) { slowNote = null; }
  /* a small card of its own: the game's cards live inside the game screen, which is hidden on the title */
  function devDialog(title, body, btns, pre) {
    var old = document.getElementById('devDlg'), w, c, h, p, row, i;
    if (old) old.parentNode.removeChild(old);
    w = document.createElement('div'); w.id = 'devDlg'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-label', title);
    w.style.cssText = 'position:fixed;inset:0;z-index:70;display:flex;align-items:center;justify-content:center;background:rgba(60,35,10,.55);padding:12px';
    c = document.createElement('div'); c.style.cssText = 'box-sizing:border-box;width:min(24rem,94vw);max-height:88vh;overflow:auto;background:#fff7e3;color:#4a2b0f;border-radius:18px;padding:1rem;text-align:left;box-shadow:0 4px 0 #b79a63;font:700 .92rem/1.3 var(--body)';
    h = document.createElement('div'); h.textContent = title; h.style.cssText = 'font:800 1.15rem/1.1 var(--display);margin-bottom:.5rem';
    p = document.createElement('div'); p.textContent = body; p.style.cssText = pre ? 'white-space:pre-wrap;font-size:.75rem;line-height:1.35;user-select:text;-webkit-user-select:text;word-break:break-word' : '';
    row = document.createElement('div'); row.style.cssText = 'display:flex;flex-direction:column;gap:.5rem;margin-top:.8rem';
    btns.forEach(function (b) { var e = document.createElement('button'); e.type = 'button'; e.className = 'btn'; e.textContent = b[0]; e.onclick = function () { b[1](e); }; row.appendChild(e); });
    c.appendChild(h); c.appendChild(p); c.appendChild(row); w.appendChild(c); document.body.appendChild(w);
    w.addEventListener('keydown', function (e) { if (e.key === 'Escape') devDialogClose(); });
    row.firstChild.focus();
  }
  function devDialogClose() { var d = document.getElementById('devDlg'); if (d) d.parentNode.removeChild(d); }
  function openPanel() {
    var n = slowNote ? slowNote.count() : 0;
    devDialog('Speed and error note', 'Nothing here is sent anywhere. The Speed check plays a busy stage by itself for about 25 seconds (keep this tab in front and the screen on) and gives you a plain verdict to copy. The Error note lists the last slow or broken moments this device saw (' + n + ' so far).', [
      ['Speed check', function () { devDialogClose(); deviceCheck(); }],
      ['Error note', function () {
        if (!slowNote) { devDialog('Error note', 'The error note is not available in this browser.', [['Close', devDialogClose]]); return; }
        var txt = slowNote.text();
        devDialog('Error note', txt, [['Copy note', function (b) { copyText(txt, function (ok) { b.textContent = ok ? 'Copied. Paste it in a message.' : 'Select the text above and copy it'; }); }], ['Clear note', function () { slowNote.clear(); devDialogClose(); }], ['Close', devDialogClose]], true);
      }],
      ['Close', devDialogClose]
    ]);
  }
  /* the hidden way in: 7 taps on the credit line within 4 seconds, on the title screen only */
  var legalEl = document.querySelector('.legal'), devTaps = [];
  if (legalEl) legalEl.addEventListener('click', function () {
    var t = performance.now();
    if (titleEl.hidden) return;
    devTaps.push(t); while (devTaps.length && t - devTaps[0] > 4000) devTaps.shift();
    if (devTaps.length >= 7) { devTaps.length = 0; openPanel(); }
  });
