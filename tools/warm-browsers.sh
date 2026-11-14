#!/bin/sh
# Background warm-up of the three test browsers right after a container starts (QA thread, 2026.11.07).
# Why: the first launch of each browser after a container boot is slow, later ones are fast (measured 2026.11.07, 4 cores):
#   Chromium 155: 15.2 s first, 0.3 s after   WebKitGTK 2.52.6: 6.7 s first, 0.6 s after   Firefox 158: 5.4 s first (see note)
# It is not the page cache, fontconfig, HOME or the profile; it looks like the restored container paging the browser in on first use.
# What this does: starts one throwaway headless launch of each browser in the background, one after another, at low priority, so the
# thread can read files / build / plan meanwhile. Never blocks the caller; failures are ignored; nothing is kept.
# usage (end of a session-start hook, after install.sh):   sh warm-browsers.sh &     env: CHROMIUM, FIREFOX (paths install.sh prints)
B=${BROWSERS_DIR:-$HOME/browsers}
CH=${CHROMIUM:-$(ls -d $B/ungoogled-chromium-*/chrome 2>/dev/null | head -1)}
FF=${FIREFOX:-$B/firefox/firefox}
T=$(mktemp -d)
(
  nice -n 10 sh -c '
    [ -x "'"$CH"'" ] && "'"$CH"'" --headless=new --no-sandbox --disable-gpu --user-data-dir='"$T"'/c --dump-dom "data:text/html,x" >/dev/null 2>&1
    [ -x "'"$FF"'" ] && "'"$FF"'" --headless --no-remote --profile '"$T"'/f --screenshot '"$T"'/f.png "data:text/html,x" >/dev/null 2>&1
    command -v WebKitWebDriver >/dev/null 2>&1 && command -v xvfb-run >/dev/null 2>&1 && timeout 60 xvfb-run -a sh -c "WebKitWebDriver --port=0 >/dev/null 2>&1 & sleep 3; kill \$! 2>/dev/null" >/dev/null 2>&1
  '
  rm -rf "$T"
) >/dev/null 2>&1 &
exit 0
