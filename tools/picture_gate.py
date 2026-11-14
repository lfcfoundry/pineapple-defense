# Picture gate: do two builds of the game draw the same picture?  usage:
#   python3 tools/picture_gate.py A.html B.html [chromium firefox webkit]      (default: all three, one at a time)
# For stages 1 to 5 it takes the first frame and the frame 1 s of game time later, with a fixed random seed, and reports the share of pixels whose worst color channel
# differs by at most TOL (3 of 255). Pass is 99.5% or more in every frame. About 20 s per browser; use it instead of the full suite for look-only changes (the full suite stays the release gate).
# Browser paths come from PD_CHROME, PD_FF, PD_GECKO (see docs/qa-process.md). PD_UA sets a user agent (a Chrome one turns on Chromium's bitmap path). Needs numpy.
import os, sys, json, base64, gzip, time, subprocess, signal, shutil, threading
import numpy as np
TOL = int(os.environ.get('TOL', 3))
def run(which, url, body, wait_expr='!!window.__pd', fresh=True):
    if which == 'chromium':
        from playwright.sync_api import sync_playwright
        with sync_playwright() as p:
            br = p.chromium.launch(executable_path=os.environ['PD_CHROME'], headless=True, args=['--no-sandbox'])
            pg = br.new_page(viewport={'width': 412, 'height': 915}, device_scale_factor=2, **({'user_agent': os.environ['PD_UA']} if os.environ.get('PD_UA') else {})); pg.goto(url); pg.wait_for_function('() => ' + wait_expr, timeout=60000)
            r = pg.evaluate('(async()=>{' + body + '})()'); ver = 'Chromium ' + br.version; br.close(); return ver, r
    from selenium import webdriver
    d = None; drv = None
    try:
        if which == 'firefox':
            from selenium.webdriver.firefox.service import Service
            from selenium.webdriver.firefox.options import Options
            o = Options(); (os.environ.get('FF_WIN') or o.add_argument('-headless')); o.binary_location = os.environ['PD_FF']
            d = webdriver.Firefox(service=Service(os.environ['PD_GECKO']), options=o); d.set_window_size(412, 915)
        else:
            from selenium.webdriver.common.options import ArgOptions
            port = 4900 + os.getpid() % 90
            drv = subprocess.Popen(['xvfb-run', '-a', '-s', '-screen 0 1280x1024x24', 'dbus-run-session', '--', 'WebKitWebDriver', '--port=%d' % port], env=dict(os.environ, GTK_A11Y='none', WEBKIT_DISABLE_SANDBOX_THIS_IS_DANGEROUS='1'), preexec_fn=os.setsid, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            for _ in range(40):
                try:
                    o = ArgOptions()
                    d = webdriver.Remote(command_executor='http://127.0.0.1:%d' % port, options=o); break
                except Exception: time.sleep(0.5)
        ver = ('WebKitGTK ' if which == 'webkit' else 'Firefox ') + d.capabilities['browserVersion']
        d.set_script_timeout(240); d.get(url); t0 = time.time()
        while not d.execute_script('return ' + wait_expr):
            if time.time() - t0 > 60: raise SystemExit('page not ready')
            time.sleep(0.05)
        return ver, d.execute_async_script("var cb=arguments[arguments.length-1];(async()=>{" + body + "})().then(cb,function(e){cb({error:String(e)})})")
    finally:
        if d is not None:
            th = threading.Thread(target=lambda: d.quit(), daemon=True); th.start(); th.join(5)
        if drv:
            try: os.killpg(drv.pid, signal.SIGTERM)
            except Exception: pass


BODY = (r"""
const P=window.__pd;window.__LONG=%s;const cv=document.getElementById('cv');const out={};
async function gz(u8){const cs=new CompressionStream('gzip');const w=cs.writable.getWriter();w.write(u8);w.close();const b=new Uint8Array(await new Response(cs.readable).arrayBuffer());let s='';for(let i=0;i<b.length;i+=8192)s+=String.fromCharCode.apply(null,b.subarray(i,i+8192));return btoa(s)}
const px=()=>cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data;
for(const st of [1,2,3,4,5]){await P.go(st,3,true)} await new Promise(r=>setTimeout(r,4000));
for(const st of [1,2,3,4,5]){let s=777+st;Math.random=function(){s=(s*1664525+1013904223)>>>0;return s/4294967296};
 await P.go(st,3,true);P.step(0.033,0.033,1);const a=px().slice();const ga=await gz(new Uint8Array(a.buffer));P.step(30*0.033,0.033,0);const b=px();const gb=await gz(new Uint8Array(b.buffer));let gc='';if(window.__LONG){P.step(8,0.033,0);const c=px();gc=await gz(new Uint8Array(c.buffer))}out[st]={w:cv.width,h:cv.height,a:ga,b:gb,c:gc}}
return out""") % ('true' if os.environ.get('LONG') else 'false')


def wait_webkit_exit(maxs=25):   # a real wait instead of a fixed rest: return as soon as no WebKit test browser is left
    t0 = time.time()
    while subprocess.run(['pgrep', 'WebKit|MiniBrowser|epiphany'], capture_output=True).returncode == 0 and time.time() - t0 < maxs: time.sleep(0.25)

def gate(which, A, B):
    t0 = time.time(); res = {}
    for v, f in (('A', A), ('B', B)):
        ver, r = run(which, 'file://' + os.path.abspath(f) + '#qa', BODY)
        if 'error' in r: print(ver, r); return False
        res[v] = r
        if which == 'webkit': wait_webkit_exit()
    print(ver); ok = True
    for st in '12345':
        row = []
        for part, name in (('a', 'first frame'), ('b', '+1 s')):
            x = np.frombuffer(gzip.decompress(base64.b64decode(res['A'][st][part])), dtype=np.uint8).astype(int)
            y = np.frombuffer(gzip.decompress(base64.b64decode(res['B'][st][part])), dtype=np.uint8).astype(int)
            d = np.abs(x - y).reshape(-1, 4)[:, :3].max(axis=1)      # worst color channel per pixel
            within = (d <= TOL).mean() * 100
            row.append('%s: %.2f%% within %d, mean %.2f, max %d' % (name, within, TOL, d.mean(), d.max()))
            if within < 99.5: ok = False
        print('  stage %s  %s' % (st, ' | '.join(row)))
    print('%s near match (>=99.5%% of pixels within %d/255, all stages, both frames): %s  [%.0f s]' % (which, TOL, 'PASS' if ok else 'FAIL', time.time() - t0))
    return ok

if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if a not in ('chromium', 'firefox', 'webkit')]
    if len(args) != 2: sys.exit(__doc__)
    which = [a for a in sys.argv[1:] if a in ('chromium', 'firefox', 'webkit')] or ['chromium', 'firefox', 'webkit']
    sys.exit(0 if all([gate(w, args[0], args[1]) for w in which]) else 1)
