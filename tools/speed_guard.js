#!/usr/bin/env node
/* Speed guard for Pineapple Defense: the same two pages in one of the four test browsers, taking turns, and a table of start-up times with the owner's 5% verdict.
   Copyright (c) 2026 LFC Foundry. MIT License (see LICENSE). Uses the shared test runner from JS-modules (tools/vendor/tools/test-runner).
     node tools/speed_guard.js <chromium|firefox|webkit|epiphany> <before.html> <after.html> [reps]     (default 7; the warm-up round is dropped)
   Setup: `npm i --no-save puppeteer-core`; CHROMIUM=$PD_CHROME FIREFOX=$PD_FF; WebKitGTK and GNOME Web need xvfb-run and WebKitWebDriver (see tools/qa.py header).
   Optional first line `node tools/vendor/tools/test-runner/cli.js warm start` keeps the browsers open between runs. Each page opens with #qa (no first-run tour, one-tab lock off) and is read after a 1 s settle.
   Reads the game's own start-up marks: boot = time until the game's code finished starting (window.__pd.boot), first paint, page fully read. All in ms, lower is better. */
'use strict';
const path = require('path');
const T = require('./vendor/tools/test-runner/runner.js');
const [, , , beforeFile, afterFile, repsArg] = process.argv;
const reps = +repsArg || 7;
const READ = () => {
  const n = performance.getEntriesByType('navigation')[0], f = performance.getEntriesByName('first-contentful-paint')[0];
  return [window.__pd && window.__pd.boot, n ? n.domContentLoadedEventEnd : null, f ? f.startTime : null];
};
T.main(async (b) => {
  if (!beforeFile || !afterFile) { console.log('usage: node tools/speed_guard.js <browser> <before.html> <after.html> [reps]'); return false; }
  const urls = { before: 'file://' + path.resolve(beforeFile) + '#qa', after: 'file://' + path.resolve(afterFile) + '#qa' }, got = { before: [], after: [] };
  await T.rotate(['before', 'after'], reps, async (name, rep) => {
    const page = await b.newPage();
    try {
      if (page.setViewport) await page.setViewport({ width: 412, height: 892, deviceScaleFactor: 2 });
      await page.goto(urls[name]); await page.waitForFunction('window.__pd', { timeout: 20000 }).catch(() => {}); await T.sleep(1000);
      const r = await page.evaluate(READ); if (rep > 0) got[name].push(r); return r[0];
    } finally { await page.close().catch(() => {}); }
  });
  const med = (name, i) => { const v = got[name].map((r) => r[i]).filter((x) => typeof x === 'number'); return v.length ? T.median(v) : NaN; };
  const rows = [['Game finished starting (boot)', 0], ['Page fully read', 1], ['First paint', 2]].map(([label, i]) => ({ name: label, before: med('before', i), after: med('after', i) })).filter((r) => !isNaN(r.before) && !isNaN(r.after));
  const g = T.speedGuard(rows), f = (x) => x.toFixed(0);
  console.log(T.table(g.map((r) => ({ name: r.name, before: f(r.before), after: f(r.after), change: ((r.after / r.before - 1) * 100).toFixed(0) + '%', verdict: r.verdict })), [
    { key: 'name', title: 'start-up (ms, lower is better)', align: 'left' }, { key: 'before', title: 'before' }, { key: 'after', title: 'after' }, { key: 'change', title: 'change' }, { key: 'verdict', title: 'speed guard', align: 'left' }]));
  console.log('median of ' + reps + ' runs, taking turns, warm-up round dropped');
  return !g.some((r) => r.slower);
});
