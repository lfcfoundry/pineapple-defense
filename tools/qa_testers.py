#!/usr/bin/env python3
"""Checks the three hosted tester pages (shooting-test, r3-test, v2-test) in Chromium, Firefox and WebKitGTK:
the device line at the top, noindex, and the last-run line (an unfinished step is named after a crash-like reload).
usage: PD_CHROME=... PD_FF=... NODE_PATH=... python3 -I tools/qa_testers.py [--legs chromium,firefox,webkit]
Copyright (c) 2026 LFC Foundry. MIT License (see LICENSE)."""
import json, os, shutil, subprocess, sys, tempfile, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LEGS = (sys.argv[sys.argv.index('--legs') + 1].split(',') if '--legs' in sys.argv else ['chromium', 'firefox', 'webkit'])
PAGES = [('shooting-test', '#labTop'), ('r3-test', '#coreLine'), ('v2-test', '#testTop')]
KEY = 'lfc-core-plan-last-run'

PROBE1 = '''(async()=>{const SEL=%s,bad=[],sleep=ms=>new Promise(r=>setTimeout(r,ms));
for(let i=0;i<100&&!document.querySelector(SEL);i++)await sleep(100);
const el=document.querySelector(SEL);
if(!el)bad.push('no top line ('+SEL+')');else{const t=el.textContent;if(!/This device reports \\d+ threads \\(about \\d+ real cores assumed\\)/.test(t))bad.push('top line text: '+t.slice(0,120));if(/DuckDB/.test(t))bad.push('DuckDB in the line');if(/Last run did not finish/.test(t))bad.push('a fresh load claims an unfinished run');}
if(!document.querySelector('meta[name=robots][content*=noindex]'))bad.push('no noindex');
if(typeof LfcCorePlan!=='object')bad.push('no LfcCorePlan');
else{const k=%s,v=sessionStorage.getItem(k);if(!v||!/opened the page/.test(v))bad.push('no "opened the page" step stored: '+v);
 const L=LfcCorePlan.lastRun;sessionStorage.setItem(k,JSON.stringify({step:'Probe step',at:'1:00:00 PM',done:false}));
 if(!/stopped during: Probe step/.test(L.previous()))bad.push('previous() did not name the unfinished step');
 const o=Storage.prototype.setItem;Storage.prototype.setItem=function(a,b){if(a===k&&/"done":true/.test(b))return;return o.call(this,a,b)};   /* a crash writes nothing on the way out */
}
return bad;})()'''
PROBE2 = '''(async()=>{const SEL=%s,sleep=ms=>new Promise(r=>setTimeout(r,ms));for(let i=0;i<100&&!document.querySelector(SEL);i++)await sleep(100);
const el=document.querySelector(SEL);return el&&/Last run did not finish\\. It stopped during: Probe step/.test(el.textContent)?[]:['after a crash-like reload the line says: '+(el?el.textContent.slice(-120):'(missing)')];})()'''

def probes(sel): return PROBE1 % (json.dumps(sel), json.dumps(KEY)), PROBE2 % json.dumps(sel)

fails = []
def report(leg, page, bad):
    print('  %-4s %-9s %-14s %s' % ('ok' if not bad else 'FAIL', leg, page, '; '.join(bad)))
    for b in bad: fails.append('%s %s: %s' % (leg, page, b))

if 'chromium' in LEGS:
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        br = p.chromium.launch(executable_path=os.environ.get('PD_CHROME') or None)
        for pg, sel in PAGES:
            q = br.new_page(viewport={'width': 412, 'height': 900}); errs = []; q.on('pageerror', lambda e: errs.append(str(e)))
            u = 'file://' + os.path.join(ROOT, pg, 'index.html'); a, b2 = probes(sel)
            q.goto(u); bad = q.evaluate(a); q.reload(); bad += q.evaluate(b2); report('chromium', pg, bad + ['page error: ' + e for e in errs]); q.close()
        br.close()

if 'firefox' in LEGS:
    ff = os.environ.get('PD_FF', '')
    js = r'''const fs=require('fs');let pptr;try{pptr=require('puppeteer-core')}catch(e){pptr=require(process.env.NFM_PUPPETEER||'/tmp/pptr/node_modules/puppeteer-core')}
(async()=>{const j=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const b=await pptr.launch({browser:'firefox',executablePath:j.ff,headless:true,protocol:'webDriverBiDi'});const out=[];
try{for(const [pg,u,a,b2] of j.pages){const p=await b.newPage();await p.setViewport({width:412,height:900});const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto(u);let bad=await p.evaluate(a);await p.reload();await new Promise(r=>setTimeout(r,300));bad=bad.concat(await p.evaluate(b2)).concat(errs.map(e=>'page error: '+e));out.push([pg,bad]);await p.close();}}finally{await b.close().catch(()=>{})}
process.stdout.write(JSON.stringify(out)+'\n');})().catch(e=>{process.stderr.write(String(e&&e.stack||e)+'\n');process.exit(1)});'''
    if not (os.path.exists(ff) and shutil.which('node')): print('PD_FF must point at Firefox, and node with puppeteer-core must be installed'); sys.exit(2)
    d = tempfile.mkdtemp(); jf = os.path.join(d, 'job.json'); sf = os.path.join(d, 'run.js')
    open(sf, 'w').write(js)
    json.dump({'ff': ff, 'pages': [[pg, 'file://' + os.path.join(ROOT, pg, 'index.html')] + list(probes(sel)) for pg, sel in PAGES]}, open(jf, 'w'))
    r = subprocess.run(['node', sf, jf], capture_output=True, text=True, timeout=300, env=dict(os.environ))
    if r.returncode: print('Firefox leg failed:', r.stderr.strip()[-500:]); sys.exit(1)
    for pg, bad in json.loads(r.stdout.strip().splitlines()[-1]): report('firefox', pg, bad)
    shutil.rmtree(d, ignore_errors=True)

if 'webkit' in LEGS:
    import signal
    from selenium import webdriver
    from selenium.webdriver.common.options import ArgOptions
    if not all(shutil.which(x) for x in ('WebKitWebDriver', 'xvfb-run', 'dbus-run-session')): print('WebKitWebDriver, xvfb-run or dbus-run-session is missing'); sys.exit(2)
    port = 4900 + os.getpid() % 300
    drv = subprocess.Popen(['xvfb-run', '-a', '-s', '-screen 0 1280x1024x24', 'dbus-run-session', '--', 'WebKitWebDriver', '--port=%d' % port],
                           env=dict(os.environ, GTK_A11Y='none', WEBKIT_DISABLE_SANDBOX_THIS_IS_DANGEROUS='1'), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)
    d = None
    try:
        for _ in range(40):
            try: d = webdriver.Remote(command_executor='http://127.0.0.1:%d' % port, options=ArgOptions()); break
            except Exception: time.sleep(0.5)
        if d is None: fails.append('webkit: could not start a WebDriver session')
        else:
            d.set_script_timeout(120)
            for pg, sel in PAGES:
                a, b2 = probes(sel); u = 'file://' + os.path.join(ROOT, pg, 'index.html')
                cb = lambda s: 'var cb=arguments[arguments.length-1];(' + s + ').then(cb,e=>cb([String(e)]))'
                try:
                    d.get(u); bad = d.execute_async_script(cb(a)); d.get(u); time.sleep(0.5); bad = bad + d.execute_async_script(cb(b2))
                except Exception as e: bad = ['driver error: ' + str(e)[:160]]
                report('webkit', pg, bad)
    finally:
        if d:
            import threading; _q = threading.Thread(target=lambda: d.quit(), daemon=True); _q.start(); _q.join(5)
        try: os.killpg(drv.pid, signal.SIGTERM)
        except Exception: pass

if fails: print('\nFAILED (%d):' % len(fails)); [print(' - ' + f) for f in fails]; sys.exit(1)
print('all tester page checks passed')
