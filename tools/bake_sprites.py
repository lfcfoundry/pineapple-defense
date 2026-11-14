#!/usr/bin/env python3 -I
"""Bake every sprite the game draws from SVG into a WebP, once, so the page can decode them off the screen thread.
Usage: PD_CHROME=/path/to/chrome python3 -I tools/bake_sprites.py [quality 0-100, default 97]   (needs Pillow: the pictures are read out of the page as lossless PNG and encoded with libwebp at its slowest, smallest setting, method 6)
Builds the game without baked pictures (PD_NO_BAKED=1), loads it in the standing test Chromium with every sprite job on (the #qa page), records each SVG the game turns
into a picture, and writes src/baked-sprites.json: {key: base64 WebP}. The key is a hash of the SVG text and size, so a changed sprite simply stops matching and is
drawn from its SVG until the next bake. Run it after any change to src/sprites/ or to the code that makes sprite SVG text, then build again.
Copyright (c) 2026 LFC Foundry. MIT License. Forged by LFC Foundry."""
import os, sys, io, json, subprocess, base64
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image
R = Path(__file__).resolve().parent.parent
Q = int(sys.argv[1]) / 100 if len(sys.argv) > 1 else 0.97
env = dict(os.environ, PD_NO_BAKED="1")
subprocess.run([sys.executable, "-I", str(R / "build.py")], cwd=R, env=env, check=True, stdout=subprocess.DEVNULL)
HOOK = """
(function(){var o=CanvasRenderingContext2D.prototype.drawImage;window.__bk={};
function key(svg,w,h){var h2=2166136261,i;for(i=0;i<svg.length;i++){h2^=svg.charCodeAt(i);h2=Math.imul(h2,16777619)}return (h2>>>0).toString(36)+'.'+svg.length+'.'+w+'x'+h}
CanvasRenderingContext2D.prototype.drawImage=function(im){var r=o.apply(this,arguments),a=arguments;
 if(im instanceof HTMLImageElement&&im.src.indexOf('data:image/svg+xml;charset=utf-8,')===0&&a.length===5&&a[1]===0&&a[2]===0&&this.canvas.width===a[3]&&this.canvas.height===a[4]){
  var svg=decodeURIComponent(im.src.slice(33));window.__bk[key(svg,a[3],a[4])]=this.canvas.toDataURL('image/png')}
 return r}})();
"""
with sync_playwright() as p:
    br = p.chromium.launch(executable_path=os.environ["PD_CHROME"], headless=True, args=["--no-sandbox"])
    pg = br.new_page(viewport={"width": 412, "height": 915}, device_scale_factor=2)
    pg.add_init_script(HOOK)
    pg.goto("file://" + str(R / "play" / "index.html") + "#qa"); pg.wait_for_function("window.__pd")
    pg.evaluate("(async()=>{await window.__pd.go(1,3,true)})()")
    pg.wait_for_timeout(1500)
    got = pg.evaluate("window.__bk")
    br.close()
def webp(png_b64):
    """Encode the lossless canvas pixels as lossy WebP with libwebp method 6 (about 4.6% smaller than the browser's own encoder at the same quality); no color profile chunk, which the game never uses."""
    o = io.BytesIO(); Image.open(io.BytesIO(base64.b64decode(png_b64))).convert("RGBA").save(o, "WEBP", quality=round(Q * 100), method=6, alpha_quality=100)
    return base64.b64encode(o.getvalue()).decode()
baked = {k: webp(v.split(",", 1)[1]) for k, v in got.items() if v.startswith("data:image/png")}
(R / "src" / "baked-sprites.json").write_text(json.dumps(baked, separators=(",", ":")) + "\n")
tot = sum(len(base64.b64decode(v)) for v in baked.values())
print("baked %d sprites, %d KB of WebP (quality %d), written to src/baked-sprites.json" % (len(baked), tot // 1024, round(Q * 100)))
subprocess.run(["git", "checkout", "-q", "play/index.html"], cwd=R)
