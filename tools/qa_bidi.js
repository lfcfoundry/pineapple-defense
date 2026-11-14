/* Runs the in-page suite in stock Firefox (no geckodriver): Puppeteer talks to Firefox over WebDriver BiDi.
   Usage: node tools/qa_bidi.js job.json  (job: url, suite, layout, probe, slow, fuzz, seed, only, firefox)  Prints one JSON line: { version, res, lay }. */
const fs = require('fs');
let pptr; try { pptr = require('puppeteer-core'); } catch (e) { pptr = require(process.env.NFM_PUPPETEER || '/tmp/pptr/node_modules/puppeteer-core'); }
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const j = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const b = await pptr.launch({ browser: 'firefox', executablePath: j.firefox, headless: true, protocol: 'webDriverBiDi' });
  try {
    const p = await b.newPage(), version = (await b.version()).replace(/^.*\//, '');
    const ready = async () => { for (let i = 0; i < 600; i++) { if (await p.evaluate('!!window.__pd')) return; await sleep(30); } };
    await p.setViewport({ width: 500, height: 900 }); await p.goto(j.url); await ready();
    await p.evaluate('window.__qaSlow=' + j.slow + ';window.__qaFuzz=' + j.fuzz + ';window.__qaQuick=' + j.seed + ';window.__qaOnly=' + JSON.stringify(j.only)); await p.evaluate(j.probe);
    const res = await p.evaluate('(async()=>{' + j.suite + '})().then(x=>x,e=>({r:[{n:"suite crashed",ok:false,ms:0,d:String(e)}],errs:[]}))');
    const lay = [];
    if (!j.only) { await p.setViewport({ width: 412, height: 915 }); await p.goto(j.url); await ready(); const o = await p.evaluate('(async()=>{' + j.layout + '})().then(x=>x,e=>({vw:0,vh:0,bad:[String(e)]}))'); lay.push([o.vw, o.vh, o.bad]); }
    process.stdout.write(JSON.stringify({ version, res, lay }) + '\n');
  } finally { await b.close().catch(() => {}); }
})().catch(e => { process.stderr.write(String(e && e.stack || e) + '\n'); process.exit(1); });
