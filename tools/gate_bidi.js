// Runs a picture-gate body in Firefox through Puppeteer over WebDriver BiDi (no geckodriver). usage: node gate_bidi.js URL BODYFILE   env: PD_FF; needs puppeteer-core (NODE_PATH or NFM_PUPPETEER).
const fs = require('fs');
const pp = require(process.env.NFM_PUPPETEER || 'puppeteer-core');
(async () => {
  const br = await pp.launch({ browser: 'firefox', executablePath: process.env.PD_FF, headless: true });
  const p = await br.newPage(); await p.setViewport({ width: 412, height: 915, deviceScaleFactor: 2 });
  await p.goto(process.argv[2]); await p.waitForFunction('!!window.__pd', { timeout: 30000 });
  const body = fs.readFileSync(process.argv[3], 'utf8');
  const r = await p.evaluate('(async()=>{' + body + '})()');
  process.stdout.write(JSON.stringify({ ver: 'Firefox ' + (await br.version()).replace(/^.*\//, ''), r }));
  await br.close();
})().catch(e => { process.stdout.write(JSON.stringify({ ver: 'Firefox', r: { error: String(e) } })); process.exit(0); });
