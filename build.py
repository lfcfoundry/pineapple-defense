#!/usr/bin/env python3
"""Build index.html from src/. Never hand-edit index.html."""
import os, base64, io, re, sys, datetime, zoneinfo
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont

R = Path(__file__).parent
S = R / "src"
CHARS = "".join(chr(c) for c in range(32, 127)) + "‘’“”©·…–—"

try:
    import brotli  # noqa: F401  (WOFF2 needs it; without it the fonts fall back to WOFF, about 5 KB larger)
    FONT_FLAVOR = "woff2"
except ImportError:
    FONT_FLAVOR = "woff"

def font_face(fam, fname, weight):
    f = TTFont(S / "fonts" / fname)
    opts = subset.Options(); opts.flavor = FONT_FLAVOR; opts.layout_features = ["kern", "liga"]
    sub = subset.Subsetter(opts); sub.populate(text=CHARS); sub.subset(f)
    f.flavor = FONT_FLAVOR
    buf = io.BytesIO(); f.save(buf)
    b64 = base64.b64encode(buf.getvalue()).decode()
    return ("@font-face{font-family:'%s';font-weight:%d;font-style:normal;font-display:swap;"
            "src:url(data:font/%s;base64,%s) format('%s')}" % (fam, weight, FONT_FLAVOR, b64, FONT_FLAVOR))

LAB = "--lab" in sys.argv
MIN = "--min" in sys.argv

def baked_json():
    """The baked sprites as JSON text for the data block at the end of the page; made by tools/bake_sprites.py. Without them (or with PD_NO_BAKED) the game draws its sprites from the SVG as before."""
    baked = S / "baked-sprites.json"
    return baked.read_text(encoding="utf-8").strip() if baked.exists() and not os.environ.get("PD_NO_BAKED") else "null"

def game_js():
    g = (S / "game.js").read_text(encoding="utf-8")
    if LAB:
        g = g.replace("key: 'pd-save'", "key: 'pd-lab-save'").replace("'pd-open'", "'pd-lab-open'")  # the tester keeps its own save (and its own one-tab lock)
    g = g.replace("/*{{STAGES_JS}}*/", (S / "stages.js").read_text(encoding="utf-8"))
    g = g.replace("/*{{EVOLVE_JS}}*/", (S / "evolve.js").read_text(encoding="utf-8"))
    g = g.replace("/*{{GEAR_JS}}*/", (S / "gear.js").read_text(encoding="utf-8"))
    g = g.replace("/*{{EXTRAS_JS}}*/", (S / "extras.js").read_text(encoding="utf-8"))
    g = g.replace("/*{{SPEEDCHECK_JS}}*/", (S / "speedcheck.js").read_text(encoding="utf-8"))
    g = g.replace("/*{{LAB_JS}}*/", (S / "lab" / "lab.js").read_text(encoding="utf-8") if LAB else "")
    return g

def minify(t):
    """Shrink every inline script and style with esbuild (optional tool). Returns None when esbuild is missing."""
    import shutil, subprocess
    exe = os.environ.get("PD_ESBUILD") or shutil.which("esbuild") or str(R / "node_modules" / ".bin" / "esbuild")
    if not os.path.exists(exe) and not shutil.which(exe): return None
    def run(code, loader):
        r = subprocess.run([exe, "--minify", "--loader=" + loader, "--target=es2017"], input=code, capture_output=True, text=True)
        if r.returncode: raise SystemExit("minify failed: " + r.stderr[:400])
        return r.stdout.rstrip("\n")
    def js(m): return m.group(1) + (run(m.group(2), "js") if m.group(2).strip() and "application/json" not in m.group(1) else m.group(2)) + m.group(3)
    def css(m): return m.group(1) + run(m.group(2), "css") + m.group(3)
    # scripts and styles in document order, each closed by its own tag, so a "</style>" string inside a script is left alone
    return re.sub(r"(<script(?![^>]*src)[^>]*>)(.*?)(</script>)|(<style[^>]*>)(.*?)(</style>)",
                  lambda m: js(m) if m.group(1) else m.group(4) + run(m.group(5), "css") + m.group(6), t, flags=re.S)

def main():
    now = datetime.datetime.now(zoneinfo.ZoneInfo("America/New_York"))
    ver = now.strftime("%Y.%m.%d.%H%M")   # zero-padded, as in 2026.10.08.2320
    t = (S / "title.html").read_text(encoding="utf-8")
    sp = S / "sprites"
    rep = {
        "<!--{{header}}-->": "<!--\n" + (S / "header.txt").read_text(encoding="utf-8").rstrip("\n") + "\n-->",
        "<!--{{pineapple}}-->": (sp / "pineapple.svg").read_text(),
        "<!--{{rockhopper}}-->": (sp / "rockhopper.svg").read_text(),
        "<!--{{land}}-->": (sp / "land.svg").read_text(),
        "<!--{{logo-defs}}-->": (sp / "logo-defs.svg").read_text(),
        "<!--{{icons}}-->": (sp / "icons.svg").read_text(),
        "/*{{FONTS}}*/": font_face("Bricolage Grotesque", "bricolage-grotesque-latin-800-normal.woff", 800)
                         + "\n" + font_face("Figtree", "figtree-latin-700-normal.woff", 700),
        "/*{{STICKER_CSS}}*/": (S / "vendor/sticker-text/sticker-text.css").read_text(),
        "/*{{STICKER_JS}}*/": (S / "vendor/sticker-text/sticker-text.js").read_text(),
        "/*{{EVEN_DT}}*/": (S / "vendor/frame-kit/even-dt.js").read_text(),
        "/*{{QGOV}}*/": (S / "vendor/fx-governor/fx-governor.js").read_text(),
        "/*{{FRAMEMETER}}*/": (S / "vendor/frame-kit/frame-meter.js").read_text(),
        "/*{{BACKCLOSE}}*/": (S / "vendor/back-close/back-close.js").read_text(),
        "/*{{WAKEKEEPER}}*/": (S / "vendor/wake-keeper/wake-keeper.js").read_text(),
        "/*{{TABGUARD}}*/": (S / "vendor/tab-guard/tab-guard.js").read_text(),
        "/*{{SAVEKIT}}*/": (S / "vendor/save-kit/save-kit.js").read_text(),
        "/*{{SLOWNOTE}}*/": (S / "vendor/slow-note/slow-note.js").read_text(),
        "/*{{BAKED}}*/null": baked_json(),
        "/*{{GAME_JS}}*/": game_js(),
        "<!--{{adelie}}-->": (sp / "adelie.svg").read_text(),
        "<!--{{palm}}-->": (sp / "prop-palm.svg").read_text(),
        "<!--{{waddles}}-->": (sp / "waddles.svg").read_text(),
        "<!--{{plant}}-->": (sp / "prop-plant.svg").read_text(),
        "<!--{{sign}}-->": (sp / "prop-sign.svg").read_text(),
    }
    for k, v in rep.items():
        assert k in t, k
        t = t.replace(k, v)
    t = t.replace("<!--{{LAB_BTN}}-->", '<div class="row"><button class="btn" id="bLab" type="button">Test Lab</button></div>' if LAB else "")
    t = t.replace("{{VERSION}}", ver + (" LAB" if LAB else ""))
    assert "{{" not in re.sub(r"\$\{\{", "", t.replace("{{VERSION}}", "")) or True
    out = R / "dist" / "lab" / "index.html" if LAB else R / "index.html"
    out.parent.mkdir(parents=True, exist_ok=True)
    m = None if os.environ.get("PD_READABLE") else minify(t)   # the page itself is the minified one (about 20% faster to start in all four test browsers, see AGENTS.md); the readable copy goes to dist/readable
    if m is None:
        if not os.environ.get("PD_READABLE"): print("no esbuild found (npm i --no-save esbuild, or set PD_ESBUILD): wrote the readable page, which starts slower")
        out.write_text(t, encoding="utf-8")
        print("built", out.relative_to(R), ver, len(t) // 1024, "KB")
    else:
        ro = R / "dist" / ("lab-readable" if LAB else "readable") / "index.html"
        ro.parent.mkdir(parents=True, exist_ok=True); ro.write_text(t, encoding="utf-8")
        out.write_text(m, encoding="utf-8")
        print("built", out.relative_to(R), ver, len(m) // 1024, "KB (minified; readable copy in", ro.relative_to(R).as_posix() + ")")
    if MIN:
        mo = R / "dist" / ("lab-min" if LAB else "min") / "index.html"
        mo.parent.mkdir(parents=True, exist_ok=True); mo.write_text(m if m is not None else (minify(t) or t), encoding="utf-8")
        print("built", mo.relative_to(R), "(same minified page)")

main()
