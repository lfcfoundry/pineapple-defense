#!/bin/bash
# Pass/fail gate in all three browsers, faster: Chromium and Firefox together, then WebKitGTK alone (owner-approved 2026.11.08).
# Pass/fail only. Timing, A/B and benchmark runs stay one browser at a time. Each leg runs in its own copy of the tree so the shared
# scratch files cannot collide. A failure seen only here is rerun alone once before it is called real (keep a count).
# usage: PD_CHROME=... PD_FF=... NODE_PATH=... bash tools/qa-par.sh
set -u -o pipefail
R=$(cd "$(dirname "$0")/.." && pwd); T=$(mktemp -d); S=$(date +%s)
cp -r "$R" "$T/ff"; cp -r "$R" "$T/ch"
( cd "$T/ch" && python3 -I tools/qa.py --force --legs chromium > "$T/ch.log" 2>&1; echo $? > "$T/ch.rc" ) &
( cd "$T/ff" && python3 -I tools/qa.py --force --legs firefox > "$T/ff.log" 2>&1; echo $? > "$T/ff.rc" ) &
wait
( cd "$R" && python3 -I tools/qa.py --force --legs webkit > "$T/wk.log" 2>&1; echo $? > "$T/wk.rc" )
for b in ch ff wk; do echo "== $b: exit $(cat $T/$b.rc); $(grep -m1 'tested in' $T/$b.log || tail -1 $T/$b.log)"; done
echo "wall $(( $(date +%s) - S )) s; logs in $T"
