# Rules for anyone (or any Claude thread) working on Pineapple Defense

Copyright (c) 2026 LFC Foundry. MIT License (see LICENSE). Forged by LFC Foundry. Commits and authorship stay JNFoo.

## Test browsers (owner rule, 2026-10-17)

- Test only with the browsers on the `browsers` branch of the private lfcfoundry/knowledge-base: Firefox 158, ungoogled Chromium 155 and WebKitGTK 2.52.6 (GNOME Web 46.5). Never stock Chromium, and never two browsers at once.
- Before each test run, re-read that branch's README: versions can be updated, and browsers can be added or removed. Follow what it says now.
- Label every result with the browser and its version. `python3 -I tools/qa.py` prints and records the versions that really ran (`.qa-browsers.json`); see `docs/qa-process.md` for the setup (`PD_CHROME`, `PD_FF`, `PD_GECKO`, `--ff`, `--wk`).
- Every release lists the browsers, with versions, that tested it: the changelog entry ("Tested in", written by `tools/release.py` from the recorded versions) and the README ("Test browsers"). Where an older release did not record them, the changelog says "not recorded". Do not guess.
- Keep checks cheap: `--smart` (or `--quick`) while iterating, `--only REGEX` while writing a check; the full three-browser run only for a release. `QA_TIMES=1` shows where the time goes. Tick loops in the suite use `tk()` (no unneeded frame draws), and timers the game owns are jumped with `fakeClock()`, never slept through; see `docs/qa-process.md`.
- **Faster, trustworthy testing:** follow the universal QA and browser-testing guide at `build-notes/qa/QA-AND-BROWSER-TESTING-UNIVERSAL-GUIDE.md` in the private knowledge-base repo (print the real browser version on line 1 of every run; targeted checks while working; full run once when the design is final).

## Changelog (two of them, owner rule 2026-10-18)

- `CHANGELOG.md` in this repo is short and for players: one plain line per change saying what a player will notice, no tables or jargon. Developer-only changes are left out. The entry for the next release sits under `## @VER@`; `tools/release.py` turns that into the version stamp and adds the "Tested in" line.
- The full developer changelog (every measurement, tool change and test run, each entry quantified in plain words) is `/mnt/project-files/changelogs-full/pineapple-defense/CHANGELOG-full.md`, backed up to the private lfcfoundry/knowledge-base. Write the full entry there first for every release, under the unreleased heading; `release.py` stamps it too (set `PD_FULL_CHANGELOG` to use another path).

## Baked pictures

- The game ships its sprites pre-drawn as WebP inside the page (`src/baked-sprites.json`, merged by `build.py`), so the browser decodes them instead of rasterizing SVG on the screen thread. A picture whose SVG changed no longer matches its key and is drawn from the SVG as before, so nothing breaks, it just loses the speed-up.
- After any change to `src/sprites/` or to code that makes sprite SVG text, re-bake: `PD_CHROME=<test Chromium> python3 -I tools/bake_sprites.py` (quality 97), then build again. Pictures must pass the near-match picture gate (99.5% of pixels within 3/255 per color, owner rule 2026-10-19). `PD_NO_BAKED=1` builds without them.
- Look-only change? `python3 -I tools/picture_gate.py before.html after.html` compares the two builds in all four browsers in about 80 seconds (needs numpy and the same PD_* paths); the full `tools/qa.py` run stays the release gate.

## Speed guard tool

- `tools/speed_guard.js` is the merge-card speed table: two pages, one browser at a time, taking turns, warm-up dropped, with the owner's 5% verdict. It uses the shared test runner vendored in `tools/vendor/tools/test-runner/` (copied unchanged from JS-modules; update by copying again) and reads `window.__pd.boot` (the `#qa` hook). Run it once per browser (`chromium`, `firefox`, `webkit`, `epiphany`) with `CHROMIUM=$PD_CHROME FIREFOX=$PD_FF`. Speed only from the four test browsers; this tool is Node only to drive them.

## Minified page

- `build.py` writes the esbuild-minified page as `index.html` (and `dist/lab/index.html`); the readable copy is `dist/readable/index.html` (`PD_READABLE=1` writes the readable page as `index.html`). Measured with esbuild 0.28.2 (desktop speed, readable to minified): the game finishes starting 12 to 25% sooner in the four test browsers; at 6x slower CPU in Chromium, 1570 to 1260 ms. Read `dist/readable/` when debugging; error notes from the hidden panel carry minified names.
- Without esbuild the build writes the readable page and says so, so commit `index.html` only from a machine that has it.
- Wrapping the baked-pictures block differently (comment, hidden text box) did not make it cheaper to start; only fewer bytes would.

## Hidden speed report and error log

- The normal game uses JS-modules `field-report` (vendored in `src/vendor/field-report/`, started first in `src/title.html` as `FR`). 5 quick taps in the top-left corner open a panel with Save speed report and Save error log; each saves a small Markdown file. Nothing in it may use the network.
- `src/speedcheck.js` (the 25 second Device check played by the throwing helper) is built into the Test Lab build only; the Test Lab's "Device check" button and `window.__deviceCheck` use it.

## Shared files and private notes

- Hard-to-reach downloads and private build notes (secret features, upgrades, stages) go in the private lfcfoundry/knowledge-base repo, on a new branch when needed, not in this public repo.
- Never write the owner's real name anywhere; the only personal name is JNFoo.
