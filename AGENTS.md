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

## WebGL drawing layer (experimental, off by default)

- `src/gl.js` (injected into `game.js` at build time) draws cached sprites with WebGL. Turn it on with `gl=1` or `gl=2` in the address, `window.__PD_GL`, or a build with `PD_GL=1|2`; `gl=0` always turns it off. Layout 2 is the exact-order one. Keep these true when editing `draw()` or `drawPenguin()`: vectors that sat under a penguin sprite go through `glUnder()`/`glOver()`; anything that lights or tints other penguins (evolve glow, ice aura) must make the frame fall back (see `glPhase2`); glows drawn after the penguins go to the add-blend overlay.
- Any change to it must pass the near-match gate in all four test browsers (99.5% of pixels within 3/255 per color, first frame, +1 s and +9 s, five stages) before it merges. `tools/make_gl_test.py` (in the shared files) builds the one-file phone test.

## Shared files and private notes

- Hard-to-reach downloads and private build notes (secret features, upgrades, stages) go in the private lfcfoundry/knowledge-base repo, on a new branch when needed, not in this public repo.
- Never write the owner's real name anywhere; the only personal name is JNFoo.
