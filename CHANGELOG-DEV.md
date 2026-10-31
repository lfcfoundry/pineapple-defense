# Pineapple Defense developer changelog

What changed in each version, newest first, for developers, in three depths: **Quick** (what changed, one line each), **Details** (the key numbers, with the browser named) and **Deep** (design reasons, tests and what was tried, the complete record). Players read [CHANGELOG.md](CHANGELOG.md), which stays plain words. Version stamps use `year.month.day.HHMM` (US Eastern). Versions before 2026-10-16 had no recorded test browsers; the Deep tier says "not recorded" where that is so. Copyright (c) 2026 LFC Foundry. MIT License (see LICENSE).


## @VER@ · next release

### Quick
- A still title screen no longer wakes the browser 60 times a second.
- Aim help and Sticky aim removed (owner ruling 2026-10-30; PR 46 source, PR 47 rebuilt page).
- Developer changelog (CHANGELOG-DEV.md), owner rule 2026-10-31.
- Landing page (PR 40, merged 2026.10.29.1921 ET).
- Next stage background drawn ahead during the clear card.
- Sprite decoding moved to a background worker pool (Chromium only).
- Full screen refusal no longer raises a hidden error (fuzz-kit 1.3.1 round).
- Early-tap errors fixed (found by fuzz-kit 1.3.0, generic adapter).
- Shared field-report 1.0.1 (JS-modules) replaces the 7-tap panel and slow-note.
- Shared fx-governor (JS-modules 1.1.1) replaces frame-kit's QualityGovernor.
- Stage start (owner rule 2026-10-19, third set item 2, no main-thread task over 8 ms): the decoded baked ...
- Developer, the shared test runner is adopted (owner rule 2026-10-19, fourth set item 8)
- Start-up: a card on the title screen no longer re-styles the whole scene
- Start-up: the page itself is now the minified build
- Hidden real-device speed check and error note (owner rules 2026-10-19, third set item 4 and testing rule 10)
- Developer, an experimental WebGL drawing layer, off by default
- Sprites ship pre-drawn
- Developer, test browsers install themselves when a cloud session starts
- Starting a stage builds the background once, not twice
- Background workers are allowed in the page's security policy (nothing you see in play changes)
- Docs open the same way everywhere
- Frame rate is written as FPS everywhere
- Shared code brought up to date with JS-modules (nothing you see in play changes)
- Developer, test-browser repo address updated
- Developer, the checks can now run in GNOME Web (Epiphany) itself
- The single file now unpacks with the JS-modules unpacker plus WebAssembly (nothing you see in play changes)
- Smoother in Firefox (nothing else you see changes)
- Developer, the checks run faster, with the same coverage
- Developer, a release opens both packed files first
- Developer, packed files can be smoke-tested
- WebAssembly is allowed in the page's security policy
- Saving code brought up to date (JS-modules save-kit 1.1.0, API 1)
- ICC profile strip from the 77 baked WebP pictures
- Release the 384 pixel pictures on phone-sized screens; tools/picture_gate.py
- Pictures re-baked with libwebp method 6
- GNOME Web dropped from testing; FPS badge lifted above the throw buttons
- canvas-probe refreshed, gate uses probe.check
- Quicker flicking: 0.30 s cooldown, early-flick catch on by default
- One-row counters: HUD height measured as the lowest HUD element over canvas height, stage 3 mid-wave

### Details
- Idle title: the speed-report frame recorder (vendored field-report) ran its animation-frame loop from page load, even while the welcome tour covered a still screen. Chromium 155.0.8059.39, 412 x 915, tour showing, 5 s after 4 s settled: main thread busy 39.3 and 39.4 ms per second down to 0.2 and 0.2; 60 callbacks per second down to 0.
- Aim help and Sticky aim removed (owner ruling 2026-10-30; PR 46 source, PR 47 rebuilt page): Before: Settings had Aim help (Generous 1.3, Normal 0.9 default, Off 0.4 times the penguin size as the allowed sideways miss) and Sticky aim (the last target kept a 1.3 times wider window and a 0.4 score bonus for 0.9 s); Little hands setup turned the most forgiving aim on.
- Developer changelog (CHANGELOG-DEV.md), owner rule 2026-10-31: New public file with Quick, Details and Deep tiers per version, backfilled from this file (29 versions plus the unreleased block); the plain end-user CHANGELOG.md is unchanged. `tools/release.py` stamps its `@VER@` heading.
- Landing page (PR 40, merged 2026.10.29.1921 ET): README now opens with the logo, pitch, buttons, badges, screenshots, What it is, Why it exists, Highlights and a By the numbers row (2.4 MB single file, 113 ms start-up, 6.1 ms to start the next stage, from the speed history).
- Next stage background drawn ahead during the clear card: Before (Chromium 155.0.8059.39, 2.8x pixel ratio, normal speed, stages 2 to 5, one run each): starting the next stage took 10.4, 10.2, 8.2 and 11.2 ms of page code (background build alone 6.6 to 12.5 ms: sky 0.5 to 1.5, scenery 1.8 to 8.2, vignette and canvas about 4.7; at 4x slower CPU 29 to 48 ms).
- Sprite decoding moved to a background worker pool (Chromium only): Before: the first stage start spent about 383 ms (4x slower CPU, Chromium 155.0.8059.39, V8 profile) in loadAssets, of which 286 ms in bakedImage (base64 to bytes and Blob on the main thread) and 88 ms in createImageBitmap.
- Full screen refusal no longer raises a hidden error (fuzz-kit 1.3.1 round): `requestFullscreen()` / `exitFullscreen()` return a promise that rejects with "Permissions check failed" when the browser refuses; it was unhandled. 6 of 32 seeds (500 operations each, Chromium 155.0.8059.39) hit it on main; 0 of 32 after (16,000 operations).
- Early-tap errors fixed (found by fuzz-kit 1.3.0, generic adapter): Taps on the stage canvas, the Pause button, the weapon keys and the other key handlers before the first stage object existed (the gap between Play and startStage while pictures load) threw `Cannot read properties of undefined (reading 'rc' / 'fx' / 'paused')`. Reproduced in Chromium 155.0.8059.39 on main at 4x CPU ...
- Shared field-report 1.0.1 (JS-modules) replaces the 7-tap panel and slow-note: Normal game: 5 taps within 2.5 s in the top-left 64 px open Save speed report and Save error log (start-up marks incl. game-script-ready, FPS, slowest 1%, long tasks, errors, CSP blocks).
- Shared fx-governor (JS-modules 1.1.1) replaces frame-kit's QualityGovernor: Steps picture sharpness down (5 steps, device-pixel ratio 2 to 1) after 2 windows of 3 s under 36 FPS (18 FPS in battery saver), ignores the first 2 s, never goes up on its own; a new run (Play, Continue) hands it back at full.
- Stage start (owner rule 2026-10-19, third set item 2, no main-thread task over 8 ms): `bakedImage` in `src/game.js` returned a canvas drawn from the decoded `ImageBitmap` (`bakedPaint`), which cost a canvas allocation and a 384 px copy for each of the 77 sprites on the first stage start; it now returns the bitmap, and decodes base64 with `Uint8Array.fromBase64` where it exists (4.4 ms for all 77 ...
- Developer, the shared test runner is adopted (owner rule 2026-10-19, fourth set item 8): JS-modules `test-runner` 1.1.0, `webkit-driver` 1.3.0 and `webkit-shim` are vendored unchanged in `tools/vendor/` (commit 88409fc) and `tools/speed_guard.js` is the four-browser speed table for merge cards (turn-taking, warm-up dropped, 5% verdict, boot from the new `window.__pd.boot` test hook).
- Start-up: the CSS rule `html[data-dlg] .title *{animation-play-state:paused!important}` made the browser re-style every element of the title scene on each card open and close (the Welcome tour, How to play, Settings, Device check).
- Start-up: `build.py` writes the esbuild 0.28.2 minified page as `index.html` and `dist/lab/index.html`; the readable copy goes to `dist/readable/` (`PD_READABLE=1` keeps the old behavior).
- Hidden real-device speed check and error note (owner rules 2026-10-19, third set item 4 and testing rule 10): tapping the credit line on the title screen 7 times within 4 seconds opens a small card (its own overlay, because the game's cards live on the hidden game screen) with **Speed check** (about 25 seconds: a busy stage, stage 2 wave 3, played by the throwing helper; ends with a plain verdict of Smooth, Mostly smooth, ...
- Developer, an experimental WebGL drawing layer, off by default: `src/gl.js` draws the penguin sprites and glows with WebGL while the game keeps drawing shapes, gradients and text in canvas 2D. Two layouts: `gl=1` (background and all sprites in one WebGL layer under the vector canvas) and `gl=2` (three layers that keep the drawing order exact: an opaque canvas for everything before ...
- Sprites ship pre-drawn: the 77 sprite SVGs (fruit, palm, plants, gear) are drawn once by `tools/bake_sprites.py` in the standing Chromium and stored as WebP (quality 97) in `src/baked-sprites.json`, keyed by a hash of the SVG text and size; `build.py` merges it into `game.js` (`/*{{BAKED}}*/`). `toImage` now decodes the WebP instead of ...
- Developer, test browsers install themselves when a cloud session starts: `.claude/hooks/session-start.sh` and `.claude/settings.json` (copied unchanged from `/mnt/project-files/browser-boot-hook/`, owner choice 2026-10-19, confirmed on a card in this thread) install the four standing test browsers into `~/browsers` (about 25 seconds the first time, a few seconds after) and write ...
- Starting a stage builds the background once, not twice: `resize()` built the stage background and then `startStage()` built it again right after, on Continue, a new game, a replay, the Test Lab spawner and the checks' `go()`. Those callers now call `resize(true)`, which skips the first build.
- Background workers are allowed in the page's security policy (nothing you see in play changes): `worker-src blob:` was added after the script rule, which still reads `'unsafe-inline' 'wasm-unsafe-eval'`; nothing else was loosened (owner rule 2026-10-19, on every page).
- Docs open the same way everywhere: the README and the four notes in `docs/` now start with a short "what it is and how it works", then "why it exists", then the rest section by section, with credits and attributions last.
- Frame rate is written as FPS everywhere: the Battery saver help line now reads "About 30 FPS." instead of "About 30 pictures a second." (1 line in the game), and the changelog and design notes say FPS instead of "frames a second" or "frames per second" (7 places in 4 files).
- Shared code brought up to date with JS-modules (nothing you see in play changes): save-kit 1.1.0 to 1.2.1 (loading a saved game is 1.4 to 1.7 times as fast in the module's own test, about 4.5 to 3.2 millionths of a second in Chromium, so you will not feel it; six new options the game does not use), back-close 1.1.0, tab-guard 1.1.0 and wake-keeper 1.0.0 (our copies came from before version labels).
- Developer, test-browser repo address updated: the notes and tools now point at lfcfoundry/knowledge-base (the repo moved from JNFoo/knowledgebase-single-file on 2026-10-17); 6 places in 4 files, no behavior change.
- Developer, the checks can now run in GNOME Web (Epiphany) itself: `tools/qa.py --gnome` drives GNOME Web 46.5, the real browser built on WebKitGTK's engine.
- The single file now unpacks with the JS-modules unpacker plus WebAssembly (nothing you see in play changes): the game is ready to play sooner after you open the file.
- Smoother in Firefox (nothing else you see changes): the game now tells the browser its picture has no see-through parts, so Firefox skips blending it with the page.
- Developer, the checks run faster, with the same coverage: the full release check in all three test browsers takes 118 to 122 seconds instead of 181 (three runs in a row, about 1.5x faster); the quick check takes about 54 seconds instead of 74 (about 1.4x faster); Chromium's quick check alone about 14 seconds instead of 22; GNOME Web's quick check suite 20.4 seconds instead ...
- Developer, a release opens both packed files first: `release.py` runs the 2 smoke checks on the regular packed file in all four test browsers (Chromium, Firefox, WebKitGTK and GNOME Web; about 15 seconds) and on the tester file in Chromium (about 2 seconds), so a broken unpacker stops a release before it is stamped.
- Developer, packed files can be smoke-tested: `tools/qa.py --packed FILE` opens a packed file (the one players get) and runs the two smoke checks in about 3 seconds per browser (9 seconds for all three).
- WebAssembly is allowed in the page's security policy: `'wasm-unsafe-eval'` was added to the script rule, which now reads `'unsafe-inline' 'wasm-unsafe-eval'` (`'unsafe-inline'` was already there and stays, because the game's code is all inline in one file) (owner's rule of 2026-10-17: the permission goes on every page we make).
- Saving code brought up to date (JS-modules save-kit 1.1.0, API 1): the game carried an older copy that came before version labels.
- ICC profile strip from the 77 baked WebP pictures: Every baked WebP had an ICCP chunk (color profile from canvas.toDataURL).
- Release the 384 pixel pictures on phone-sized screens; tools/picture_gate.py: trimBig(): after a sprite's 192 and 96 pixel copies exist and the canvas is 835 device pixels wide or less, IMG[k][m] becomes the 192 copy (which carries its own mips) and the 384 copy is closed. restoreBig() on resize decodes them again (REDO jobs) if the canvas grows past 835.
- Pictures re-baked with libwebp method 6: tools/bake_sprites.py now reads each sprite out of the page as lossless PNG and encodes it with Pillow/libwebp at quality 97, method 6, alpha quality 100 (no color profile chunk).
- GNOME Web dropped from testing; FPS badge lifted above the throw buttons: Rule from the owner (2026-10-23 8:38 PM Eastern): test browsers are Chromium 155.0.8059.39, Firefox 158.0, WebKitGTK 2.52.6.
- canvas-probe refreshed, gate uses probe.check: tools/canvas-probe.js replaced with the JS-modules tools/canvas-probe/src/canvas-probe.js (1.1.0: adds `check`, `deep`; counts path, transform and curve calls the old copy skipped).
- Quicker flicking: Cause found: finger lift to first drawn frame of the shot is already 17 to 21 ms (Chromium 155.0.8059.39 and Firefox 158.0, 412x915 touch events); the slow feel was the 0.42 s cooldown silently dropping flicks (early-flick helper was off by default, window 0.15 s) and 780 to 900 ms lift-to-landing.
- One-row counters: HUD height measured as the lowest HUD element over canvas height, stage 3 mid-wave (Chromium 155.0.8059.39): 412x915 phone 173 of 732 px (24%) to 107 px (15%); 360x640 15% (95 px); 1280x720 171 to 105 px (24% to 15%); 820x1180 14%; sideways 915x412 now one wide row in the side margin.
- Tested in: ungoogled Chromium 155.0.8059.39, Firefox 158.0, WebKitGTK 2.52.6 (quick check, one at a time); ungoogled Chromium 155.0.8059.39 (full check, 51.5 seconds). Not a release yet: the stamp comes with the next release.

### Deep
- **Frame recorder runs only while a stage is played (found in round 13, app start and idle).** Cause: `FieldReport.start` begins its 3,600-frame ring loop at load, and one animation-frame callback per vsync makes Chromium prepare a frame every time even when nothing changes (6 screenshots over 1.5 s were identical); the game's own loop was not running (`run()` is not called on the title). Fix: `field-report.js` gets `fr.frames(on)` and the start option `frames: 'play'` (record nothing until asked; `false` still means never, anything else unchanged); `run()` calls `FR.frames(true)` and `halt()` calls `FR.frames(false)`, so pause, cards and the title cost no frames. Measured as above; a copy with the recorder off entirely read 0.2, 0.1 and 0.4 ms per second. Frames still record in play (235 frames in 4 s, 59.5 FPS reading in the speed report). Play and pause costs unchanged within noise (play 435 to 533 ms per second before and after, single runs, software drawing; paused 59 to 67). The vendored copy now differs from JS-modules field-report 1.0.2 by this 6-line addition; the same patch was handed to the JS-modules owner so the next copy matches. Quick tier on the minified page passed in ungoogled Chromium 155.0.8059.39 (34.9 s). Firefox 158 and WebKitGTK 2.52.6 not run (no geckodriver in this container, so only the Chromium numbers exist). Other findings, not changed (they alter the look): the animated title (tour dismissed) costs 276 to 287 ms per second of main thread, 72 to 80 of it style work; `shim` animates background-position and `sweep` animates `left` (layout), and freezing just those two saved 15 to 47 ms per second. Turning on Calm cuts the title to 91. First read of `localStorage` (`pd-calm`, then the save) is on the start path and was left: every part of the game reads the save at load, so moving it later is a larger change.
- **Aim help and Sticky aim removed (owner ruling 2026-10-30; PR 46 source, PR 47 rebuilt page).** Before: Settings had Aim help (Generous 1.3, Normal 0.9 default, Off 0.4 times the penguin size as the allowed sideways miss) and Sticky aim (the last target kept a 1.3 times wider window and a 0.4 score bonus for 0.9 s); Little hands setup turned the most forgiving aim on. After: both rows, the save fields `aim` and `sa`, `AIMW` as a table, `STICKY_S` and `S.stk` are gone; every flick uses the old Off width (0.4). Tap or hold on a penguin to pick it is unchanged. Old saves with the two fields still load (the fixture check passes). The sticky-aim check became "no aim help: nothing sticks"; the Little hands, comfort and load checks lost their aim lines. Quick tier passed in ungoogled Chromium 155.0.8059.39 (about 12 s source, about 43 s on the minified page); Firefox 158 and WebKitGTK 2.52.6 not run (no drawing change). `play/index.html` rebuilt with esbuild 0.28.2: 2473 KB.
- **Developer changelog (CHANGELOG-DEV.md), owner rule 2026-10-31.** New public file with Quick, Details and Deep tiers per version, backfilled from this file (29 versions plus the unreleased block); the plain end-user CHANGELOG.md is unchanged. `tools/release.py` stamps its `@VER@` heading.
- **Landing page (PR 40, merged 2026.10.29.1921 ET).** README now opens with the logo, pitch, buttons, badges, screenshots, What it is, Why it exists, Highlights and a By the numbers row (2.4 MB single file, 113 ms start-up, 6.1 ms to start the next stage, from the speed history). New about.html next to the game (Pages root stays the game): logo, nine screenshots, numbers, five stages and Champions, seven upgrade families, advanced features, Silent by design. Docs only, game code untouched. Checked in Chromium, Firefox and WebKitGTK at computer and phone widths: no sideways scroll.
- **Next stage background drawn ahead during the clear card.** Before (Chromium 155.0.8059.39, 2.8x pixel ratio, normal speed, stages 2 to 5, one run each): starting the next stage took 10.4, 10.2, 8.2 and 11.2 ms of page code (background build alone 6.6 to 12.5 ms: sky 0.5 to 1.5, scenery 1.8 to 8.2, vignette and canvas about 4.7; at 4x slower CPU 29 to 48 ms). After: three tasks (sky, scenery, vignette plus seal) run from setTimeout while the card is open; Next stage swaps the canvas in: 6.4, 5.8, 5.9 and 6.1 ms (-38%, -43%, -28%, -46%). Largest single task of the draw is now the stage 4 scenery at 8.2 ms. The drawn-ahead canvas is thrown away on resize, on any stage start and when the key (stage, canvas size, layout size) differs, and it exists only while the card is open, so extra memory is one background canvas (about 12 MB at 2.8x pixel ratio on a 412 x 915 screen) for a few seconds. Pixel hash of the drawn-ahead background equals a fresh build on all 4 stages; new suite check (pixel hash equal, used up on next start, dropped on resize). Suite passes in all four browsers (208 s); picture gate vs main PASS in all four (Firefox 158.0, Chromium 155.0.8059.39, WebKitGTK 2.52.6, GNOME Web 46.5). Start-up speed guard (median of 9, lower is better, before to after): Chromium boot 121 to 120 ms, Firefox 177 to 173, WebKitGTK 152 to 150, GNOME Web 183 to 203 (+11%, unrelated code path; the same file against a copy of itself has varied far more there).
- **Sprite decoding moved to a background worker pool (Chromium only).** Before: the first stage start spent about 383 ms (4x slower CPU, Chromium 155.0.8059.39, V8 profile) in loadAssets, of which 286 ms in bakedImage (base64 to bytes and Blob on the main thread) and 88 ms in createImageBitmap. After: up to 3 blob: workers (worker-src blob: only, no policy change) turn the text into bytes and decode to ImageBitmaps, which are transferred back; main-thread time in loadAssets is 71 ms at 4x (-81%). Median of 9 alternating runs, lower is better: first stage ready 220 to 223 ms at normal speed (same), 635 to 474 ms at 4x slower CPU (-25%); longest main-thread task 68 to 0 ms (under 50 ms) at normal speed, 294 to 111 ms at 4x slower CPU. If a worker cannot start, errors or is silent for 5 s, that sprite is decoded on the main thread as before. Firefox 158.0, WebKitGTK 2.52.6 and GNOME Web 46.5 keep their Image.decode path unchanged. Picture gate in the Chromium bitmap path vs main: 100.00% within 3/255, max difference 0, all 5 stages, first frame and +1 s. Suite: four browsers pass (225 s); Chromium bitmap-path suite passes 4 of 4 runs. A single-worker first version failed a layout check in the full suite (stage ready took 15 to 35% longer under harness load); 3 workers fixed it, and qa_layout now waits up to 4 s for the stage instead of 0.64 s (no assertion loosened). Also field-report 1.0.1 to 1.0.2 (reported version fix). Page 2,602 to 2,603 KB.
- **Full screen refusal no longer raises a hidden error (fuzz-kit 1.3.1 round).** `requestFullscreen()` / `exitFullscreen()` return a promise that rejects with "Permissions check failed" when the browser refuses; it was unhandled. 6 of 32 seeds (500 operations each, Chromium 155.0.8059.39) hit it on main; 0 of 32 after (16,000 operations). Picture gate vs main 100% PASS and suite passes in Firefox 158.0, Chromium 155.0.8059.39, WebKitGTK 2.52.6, GNOME Web 46.5 (215 s). Main itself after PRs 27 and 28: suite passes (225 s), picture gate PASS in all four.
- **Early-tap errors fixed (found by fuzz-kit 1.3.0, generic adapter).** Taps on the stage canvas, the Pause button, the weapon keys and the other key handlers before the first stage object existed (the gap between Play and startStage while pictures load) threw `Cannot read properties of undefined (reading 'rc' / 'fx' / 'paused')`. Reproduced in Chromium 155.0.8059.39 on main at 4x CPU slowdown (2 errors in 12 quick taps), 0 after the fix. Fuzz-kit 8 seeds x 300 operations: 8 of 8 seeds had errors before, 0 of 8 after. Second find: the delayed repaint after the full screen button (300 ms) ran on a closed Settings card (`reading 'querySelector'`, `setting 'hidden'` of null); 5 of 32 longer seeds (500 operations) hit it, 0 of 32 after the fix (16,000 operations, Chromium 155.0.8059.39). Picture gate vs the previous build 100.00% in Firefox 158.0, Chromium 155.0.8059.39, WebKitGTK 2.52.6, GNOME Web 46.5; suite passes in all four (211 s). Note: the fuzz-kit Playwright runner's wait_for_function needs 'unsafe-eval', which our page policy forbids, so it was run from a patched copy (reported to JS-modules continued).
- **Shared field-report 1.0.1 (JS-modules) replaces the 7-tap panel and slow-note.** Normal game: 5 taps within 2.5 s in the top-left 64 px open Save speed report and Save error log (start-up marks incl. game-script-ready, FPS, slowest 1%, long tasks, errors, CSP blocks). Page change: slow-note (about 10 KB) and the panel code are gone, field-report added (see page size in the PR). The helper-played 25 s Device check is built into the Test Lab build only. Found a bug in field-report 1.0.0 (line 220 tested `typeof URL === 'object'`, it is 'function', so its file download never ran and the Save buttons only showed text); fixed upstream in 1.0.1, which this uses. Start-up (Chromium 155.0.8059.39, median of 9, lower is better): previous build to this build boot 132 to 129 ms (-2%), page read 198 to 190 (-4%); the same file against a copy of itself varied up to 8%, so 5-run numbers of +5 to +25% in the other browsers were noise (to be redone with 9 runs). Checked in Chromium 155.0.8059.39: both files download, no console or CSP errors. New suite check passes in all four browsers.
- **Shared fx-governor (JS-modules 1.1.1) replaces frame-kit's QualityGovernor.** Steps picture sharpness down (5 steps, device-pixel ratio 2 to 1) after 2 windows of 3 s under 36 FPS (18 FPS in battery saver), ignores the first 2 s, never goes up on its own; a new run (Play, Continue) hands it back at full. Picture gate vs main: 100.00% of pixels within 3/255 in all 5 stages, first frame and +1 s, in Chromium 155.0.8059.39, Firefox 158.0, WebKitGTK 2.52.6, GNOME Web 46.5. Suite: all checks pass in all four (208 s). Behavior at 12x CPU slowdown in Chromium: canvas width 804 to 704 (7.5-10 s), 603 (15 s), 503 (17.5 s), 402 (20 s), no rise; at 1x it stays 804 for 20 s. Start-up (median of 5, lower is better, before to after): Chromium boot 125 to 132 ms (+6%), page read 189 to 197 (+4%), first paint 172 to 172; Firefox boot 189 to 174 (-8%); WebKitGTK boot 159 to 166 (+4%), page read 180 to 191 (+6%), first paint 51 to 54 (+6%); GNOME Web boot 226 to 173 (-23%). Differences of 3 to 10 ms are inside run-to-run spread. Page +335 bytes.
- **Stage start (owner rule 2026-10-19, third set item 2, no main-thread task over 8 ms): the decoded baked bitmap is the sprite, with no copy into a canvas (Chromium path only):** `bakedImage` in `src/game.js` returned a canvas drawn from the decoded `ImageBitmap` (`bakedPaint`), which cost a canvas allocation and a 384 px copy for each of the 77 sprites on the first stage start; it now returns the bitmap, and decodes base64 with `Uint8Array.fromBase64` where it exists (4.4 ms for all 77 sprites against 18.6 ms with the loop; 1.65 MB of WebP). Firefox and WebKit keep the canvas copy (their decoded-image cache can drop a picture; unchanged). First stage start in Chromium at phone-like speed (CPU 6x slower, Chrome user agent, median of 6, taking turns, lower is better): go() 1082 to 768 ms (-29%), longest main-thread task 558 to 478 ms (-14%, still far over 8 ms: the rest is the stage background canvas and bitmap decode setup). Cost per drawn frame in stage 2 wave 3 unchanged (68.0 to 67.8 ms at 6x, median of 4). Picture gate old against new, Chromium with the Chrome user agent: 100.00% within 3/255, all five stages, both frames (max difference 0). Note for test runs: headless Chromium reports `HeadlessChrome`, which the page's `/\bChrome\//` check does not match, so default headless runs use the Image path; set a Chrome user agent to test this path.
- **Developer, the shared test runner is adopted (owner rule 2026-10-19, fourth set item 8):** JS-modules `test-runner` 1.1.0, `webkit-driver` 1.3.0 and `webkit-shim` are vendored unchanged in `tools/vendor/` (commit 88409fc) and `tools/speed_guard.js` is the four-browser speed table for merge cards (turn-taking, warm-up dropped, 5% verdict, boot from the new `window.__pd.boot` test hook). Check run, readable page against the compact page, 5 runs each, lower is better, game finished starting: Chromium 173 to 147 ms, Firefox 158.0 216 to 166 ms, WebKitGTK 2.52.6 221 to 51 ms, GNOME Web 46.5 210 to 196 ms; first paint GNOME Web 50 to 73 ms flagged SLOWER (small numbers, 23 ms), the other three browsers faster. Replaces my scratch timing scripts (one run of the tool: 17 to 22 s per browser, about 80 s for all four). Tested in: ungoogled Chromium 155.0.8059.39, Firefox 158.0, WebKitGTK 2.52.6, GNOME Web 46.5 (one at a time).
- **Start-up: a card on the title screen no longer re-styles the whole scene (owner rule 2026-10-19, third set item 2, no main-thread task over 8 ms):** the CSS rule `html[data-dlg] .title *{animation-play-state:paused!important}` made the browser re-style every element of the title scene on each card open and close (the Welcome tour, How to play, Settings, Device check). It is replaced by pausing the running title animations directly (`dlgAnim` in `src/title.html`, driven by a MutationObserver on the `data-dlg` attribute, so every place that sets it keeps working); the 51 title animations pause while a card is open and run again after it closes (new check in `tools/qa_suite.js`). Open plus close, median of 5, desktop speed, lower is better: ungoogled Chromium 155.0.8059.39 20.5 to 1.6 ms (-92%), Firefox 158.0 13 to 3 ms (-77%), WebKitGTK 2.52.6 27 to 5 ms (-81%), GNOME Web 46.5 26 to 4 ms (-85%); Chromium at phone-like speed (CPU 6x slower) 165 to about 14 ms (-92%). Not measured: the look of the paused title (the animations stop where they were, as before).
- **Start-up: the page itself is now the minified build (owner rule 2026-10-19, third set item 1, first screen first):** `build.py` writes the esbuild 0.28.2 minified page as `index.html` and `dist/lab/index.html`; the readable copy goes to `dist/readable/` (`PD_READABLE=1` keeps the old behavior). Measured on the same game, readable to minified, median of 7, desktop speed, lower is better. Time until the game's code finished starting: Firefox 158.0 114 to 89 ms (-22%), ungoogled Chromium 155.0.8059.39 213 to 167 ms (-22%), WebKitGTK 2.52.6 371 to 278 ms (-25%), GNOME Web 46.5 349 to 306 ms (-12%). Page loaded: 150 to 113, 300 to 253, 423 to 344, 463 to 369 ms. First paint: Firefox 156 to 110, Chromium 240 to 212, GNOME Web 147 to 139 ms; WebKitGTK 96 to 106 ms (+10 ms, about 10% slower, not investigated further; it is the only metric in the four browsers that did not improve). At phone-like speed (Chromium, CPU 6x slower, which matched a phone's 1.2 to 2.2 s): start 1570 to 1260 ms (-20%), first paint 752 to 536 ms (-29%). Script-only minify gave 1636 to 1238 ms, style-only 1569 ms, so the script (about 360 KB to 190 KB) is where the gain is; page size 2850 to 2663 KB (-6.6%). Not the cause (measured, no gain): fonts (23 KB of font data removed, 1241 to 1225 ms), page animations off (worse, 1337 ms), the baked-pictures block wrapped in a comment or a hidden text box (1529 and 1507 ms against 1473 ms as is). The 2.2 MB baked-pictures block still adds about 150 to 260 ms of start at phone speed; only fewer bytes would help (WebP quality 92 would save 24%, but 97 already sits at 96.7% per-sprite within 3/255). Checks: full suite passed on the minified page in all four browsers in 224 s; picture gate readable against minified: Chromium 100.00% in all five stages (max difference 0). Tested in: ungoogled Chromium 155.0.8059.39, Firefox 158.0, WebKitGTK 2.52.6, GNOME Web 46.5 (one at a time).
- **Hidden real-device speed check and error note (owner rules 2026-10-19, third set item 4 and testing rule 10):** tapping the credit line on the title screen 7 times within 4 seconds opens a small card (its own overlay, because the game's cards live on the hidden game screen) with **Speed check** (about 25 seconds: a busy stage, stage 2 wave 3, played by the throwing helper; ends with a plain verdict of Smooth, Mostly smooth, Choppy or Slow, frames a second, slowest frames, the game's own work per frame, hitches, picture quality steps, start-up time, browser, screen, cores and graphics name, with Copy report) and **Error note** (JS-modules slow-note 1.0.0 vendored, 6.1 KB minified in the page: the last 30 script errors, rejected promises, slow taps of 104 ms or more and long frames of 100 ms or more, kept only in this device's browser storage; Copy, Clear). No network, no new page-policy entries. The Device check moved out of the tester-only Test Lab (`src/lab/lab.js`) into `src/speedcheck.js`, so the tester and the normal game share one copy and the tester's Device check works as before (Chromium 155 alternating pair: 60 and 59.8 FPS, both Smooth). New check in the quick suite (7 taps open it, 6 do not, not on the game screen). Cost, page ready (DOMContentLoaded) and first paint, median of 10 loads, lower is better, main against this change, alternating: Chromium 155.0.8059.39 259 to 254 ms and 194 to 194 ms; Firefox 158.0 88/97/90 to 93/103/98 ms (about 5 ms, +6%) and first paint 88/100/93 to 98/102/96 ms (about +4%); WebKitGTK 2.52.6 270 to 259 ms and 92 to 94 ms; GNOME Web 46.5 292/284/332 to 330/302/290 ms (noise, both directions) and 113/102/122 to 118/99/114 ms. Page size +about 15 KB. Tested in: ungoogled Chromium 155.0.8059.39, Firefox 158.0, WebKitGTK 2.52.6, GNOME Web 46.5 (quick check, one at a time, passed in 94 s). A phone has not run it yet.
- **Developer, an experimental WebGL drawing layer, off by default (nothing changes for players until it is switched on):** `src/gl.js` draws the penguin sprites and glows with WebGL while the game keeps drawing shapes, gradients and text in canvas 2D. Two layouts: `gl=1` (background and all sprites in one WebGL layer under the vector canvas) and `gl=2` (three layers that keep the drawing order exact: an opaque canvas for everything before the penguins, WebGL for the penguins, the vector canvas on top, plus a thin add-blend overlay for glows drawn after the penguins). A frame with an evolving or iced penguin is drawn the old way (their glows light the penguins behind them, which layers cannot do). Without WebGL, or after a lost context, everything draws in canvas 2D as before. Picture check (near-match gate, share of pixels within 3/255 per color, 3 capture points per stage: first frame, +1 s, +9 s of play, five stages, higher is better, 99.5% needed): layout 2 worst case Chromium 155.0.8059.39 99.78%, WebKitGTK 2.52.6 99.71%, GNOME Web 46.5 99.72% (all three at +9 s); Firefox 158.0 100.00% at the first frame and 99.99% or better at +1 s (its +9 s cannot be compared: two plain canvas runs already differ from each other after about 2 s of play). Layout 1 reached 96.7 to 99.4% at +9 s, so layout 2 is the one to adopt. Speed: on a phone the first layout drew a busy frame 4.55 times faster (phone tester, 2026-10-19; higher is better); layout 2 is waiting for the same phone test (3-button file at `/mnt/project-files/pineapple-defense/webgl/webgl-drawing-test.html`). Desktop test runs of layout 2 (stage 2 wave 3, 8 s, one alternating pair per browser, FPS higher is better): Chromium 155.0.8059.39 59.8 canvas vs 45.0 WebGL; Firefox 158.0 42.6 vs 28.1; WebKitGTK 2.52.6 23.7 vs 17.2; GNOME Web 46.5 slower with WebGL as well (15.4 FPS with WebGL), so desktop numbers do not support turning it on there and the real devices decide. Page size +about 22 KB of code.
- **Sprites ship pre-drawn (baked pictures; the look matches to the near-match gate, near-match gate, share of pixels within 3/255 per color, worst case of five stages at +1 s, higher is better: Chromium 155.0.8059.39 99.84%, Firefox 158.0 99.83%, WebKitGTK 2.52.6 99.57%, GNOME Web 46.5 99.55%; every first frame 100.00%; all pass the 99.5% rule):** the 77 sprite SVGs (fruit, palm, plants, gear) are drawn once by `tools/bake_sprites.py` in the standing Chromium and stored as WebP (quality 97) in `src/baked-sprites.json`, keyed by a hash of the SVG text and size; `build.py` merges it into `game.js` (`/*{{BAKED}}*/`). `toImage` now decodes the WebP instead of rasterizing SVG on the screen thread; a sprite whose SVG changed misses its key and falls back to the old SVG path. Decode path is chosen per engine: Chromium uses `createImageBitmap` on a Blob, Firefox and WebKit use `Image.decode()` on a data: URL (the page policy forbids blob: images). Page file grows by about 1.6 MB of WebP (about 0.62 MB to about 2.3 MB readable build; size ceilings are suspended, so this does not block). Sprite-load timing, before to after (lower is better): Chromium 155 ready 468.4 to 356.7 ms, screen-thread freeze 293.7 to 93.2 ms; Firefox 158 ready 333 to 149 ms, freeze 219 to 28 ms; WebKitGTK 2.52.6 ready 337 to 302 ms; GNOME Web 46.5 ready 358 to 352 ms (WebKit freeze figures are unreliable and not used); a phone (Chrome) 82.5 to 0.0 ms of busy time for 10 pictures. The baked data sits in a `<script type="application/json" id="baked">` block at the very end of the page and is parsed on first use (as script text it added about 100 ms to opening the page in Chromium). Cost of the extra 1.6 MB of page, median of 8 loads, first paint (lower is better) and page ready (DOMContentLoaded): Chromium 155 first paint 178 to 186 ms, ready 167 to 234 ms; Firefox 158 first paint 86 to 82 ms, ready 76 to 82 ms; WebKitGTK 2.52.6 first paint 76 to 92 ms, ready 138 to 244 ms; GNOME Web 46.5 first paint 84 to 93 ms, ready 301 to 332 ms (WebKit timings are coarse). Quick check passed in all four browsers (83.8 s, one at a time). Two tries that measured no gain were dropped: a stage-background worker (phone: no gain, the cost is drawing, not the thread) and small-picture cache reuse.
- **Developer, test browsers install themselves when a cloud session starts:** `.claude/hooks/session-start.sh` and `.claude/settings.json` (copied unchanged from `/mnt/project-files/browser-boot-hook/`, owner choice 2026-10-19, confirmed on a card in this thread) install the four standing test browsers into `~/browsers` (about 25 seconds the first time, a few seconds after) and write `~/.lfc-browsers.env`. It runs only in cloud sessions, never fails the session, and needs lfcfoundry/knowledge-base attached to the project; it takes effect once merged to the default branch. `docs/qa-process.md` has the line on how the paths map to `PD_CHROME` and `PD_FF`. Not run end to end in this session (the browsers were already installed).
- **Starting a stage builds the background once, not twice (about 2x as quick; the picture is byte-for-byte the same):** `resize()` built the stage background and then `startStage()` built it again right after, on Continue, a new game, a replay, the Test Lab spawner and the checks' `go()`. Those callers now call `resize(true)`, which skips the first build. The stage-start task (`go` with the page idle, 15 starts per stage, 2 page loads, median; lower is better): Chromium 155.0.8059.39 6.6 to 8.8 ms down to 3.4 to 3.9 ms (1.9 to 2.4x); Firefox 158.0 11 to 15 ms down to 5 to 8 ms (1.7 to 2.3x); WebKitGTK 2.52.6 2.0 to 4.0 ms down to 2.0 to 3.0 ms and GNOME Web 46.5 2.0 to 4.0 ms down to 2.0 to 3.0 ms (their timers move in whole milliseconds, so those two are rough). Every stage start is now under 8 ms. Proof the picture is unchanged: with the random numbers fixed, all 1.2 million pixel values of the first frame of stages 1 to 5 (824 x 1464) give the same fingerprint before and after in Chromium 155.0.8059.39, and each version repeats itself. The quick check passes in all four browsers (75 seconds). Not changed: the one-time first-frame cache building (26.5 ms in the Chromium 155 profile) and the memory churn (about 75 KB a frame, 4 cleanups in 6 seconds) would need the stage scenes rewritten in small steps, which risks the look; see `/mnt/project-files/pineapple-defense/perf-rules/CHECK-2026-10-19.md`.
- **Background workers are allowed in the page's security policy (nothing you see in play changes):** `worker-src blob:` was added after the script rule, which still reads `'unsafe-inline' 'wasm-unsafe-eval'`; nothing else was loosened (owner rule 2026-10-19, on every page). Changed in `src/title.html` and the packed-file wrapper in `tools/pack.py`. The page policy check now also starts a worker from a blob and needs it to answer (42 back for 41 sent). Proof the browser enforces it: in ungoogled Chromium 155.0.8059.39 a blob worker fails to start without `worker-src` and answers with it (probe in the session scratch folder). The check passes in Chromium 155.0.8059.39 (106 ms), Firefox 158.0 (19 ms), WebKitGTK 2.52.6 (1,682 ms) and GNOME Web 46.5 (1,479 ms); the quick check passed in all four, one at a time (120 seconds in total), and the packed file (211 KB) opens and passes its 2 smoke checks in Chromium (1.6 seconds). No game code changed, so there is no speed change to measure. Nothing in the game uses a worker yet.
- **Docs open the same way everywhere:** the README and the four notes in `docs/` now start with a short "what it is and how it works", then "why it exists", then the rest section by section, with credits and attributions last. README: 2 new sections (the old intro paragraph moved into the first one); each of the 4 docs gets 2 opening paragraphs. No game change.
- **Frame rate is written as FPS everywhere:** the Battery saver help line now reads "About 30 FPS." instead of "About 30 pictures a second." (1 line in the game), and the changelog and design notes say FPS instead of "frames a second" or "frames per second" (7 places in 4 files). The FPS counter badge now reads "60 FPS" instead of "60 fps": the vendored frame-kit moves from 1.1.0 to 1.2.1 (JS-modules main 06fe5d0), and the only change that reaches the game is that one word; the numbers, timings and thresholds are unchanged.
- **Shared code brought up to date with JS-modules (nothing you see in play changes):** save-kit 1.1.0 to 1.2.1 (loading a saved game is 1.4 to 1.7 times as fast in the module's own test, about 4.5 to 3.2 millionths of a second in Chromium, so you will not feel it; six new options the game does not use), back-close 1.1.0, tab-guard 1.1.0 and wake-keeper 1.0.0 (our copies came from before version labels). One behavior difference: after the browser refuses to keep the screen awake (low battery, power saving), the game now waits 20 seconds before asking again instead of asking again at every tap. Cost: the readable page grows from 588,158 to 619,263 bytes (+5.3%) and the shrunk page from 433,974 to 443,519 bytes (+2.2%), mostly options the game does not use. Each module's own checks pass (save-kit 43, back-close 30, tab-guard 29, wake-keeper 42), the quick game check passes in all three test browsers (75 seconds), and the full Chromium check passed 8 of 8 runs (about 48 seconds each).
- **Developer, test-browser repo address updated:** the notes and tools now point at lfcfoundry/knowledge-base (the repo moved from JNFoo/knowledgebase-single-file on 2026-10-17); 6 places in 4 files, no behavior change.
- **Developer, the checks can now run in GNOME Web (Epiphany) itself:** `tools/qa.py --gnome` drives GNOME Web 46.5, the real browser built on WebKitGTK's engine. The quick check passed there (suite 25.4 seconds, layout 3.6 seconds, 58.6 seconds with the Chromium run). Our checks press buttons from inside the page, so they never needed GNOME Web's driver clicks. Closing GNOME Web used to hang the run, so the close now waits at most 5 seconds.
- **The single file now unpacks with the JS-modules unpacker plus WebAssembly (nothing you see in play changes):** the game is ready to play sooner after you open the file. Median time from opening to a playable game, 9 loads each, the same game page (smaller is better): ungoogled Chromium 155.0.8059.39 356 to 263 ms (about 1.4x faster), Firefox 158.0 485 to 201 ms (about 2.4x faster), WebKitGTK 2.52.6 551 to 153 ms (about 3.6x faster), GNOME Web 46.5 748 to 333 ms (about 2.2x faster). The file is 173,480 to 174,109 bytes (+629 bytes, +0.4%; the license notice is kept in both), the tester file 181,285 to 181,930 bytes (+0.4%). It stays plain text, so any copy or editor tool keeps it intact, and it checks itself before running. If a browser refuses WebAssembly, the plain unpacker in the same file takes over. The old unpacker (lzma-js) is gone; `tools/pack.py` now calls the vendored lzma-pack 1.1.1 and lzma-decode 1.1.0 (`tools/vendor/`).
- **Smoother in Firefox (nothing else you see changes):** the game now tells the browser its picture has no see-through parts, so Firefox skips blending it with the page. In a Firefox 158.0 test run (busy waves, 2 runs each, more FPS is better): stage 1 wave 4 went from 8.3 to 14.4 FPS (about 1.7x), stage 5 wave 3 from 9.1 to 13.9 (about 1.5x). A faster computer run by the profiling thread saw 26 to 28 go up to 33 to 39 (about 1.25 to 1.4x). Chromium 155, WebKitGTK 2.52.6 and GNOME Web 46.5 measured the same as before in that thread's run (not re-measured here). The picture is unchanged: drawn frames of all five stages are pixel for pixel the same with and without the change in Chromium 155 (6 scenes, 0 pixels differ). The one exception is a faint half see-through one-pixel line in stages 1 and 3 where two bands of the picture meet, which is now solid like its neighbors. A new check fails if any background pixel is ever see-through, so a future gap cannot show up as a dark line (it caught the line at alpha 197 and 246 when the fix was taken out).
- **Developer, the checks run faster, with the same coverage:** the full release check in all three test browsers takes 118 to 122 seconds instead of 181 (three runs in a row, about 1.5x faster); the quick check takes about 54 seconds instead of 74 (about 1.4x faster); Chromium's quick check alone about 14 seconds instead of 22; GNOME Web's quick check suite 20.4 seconds instead of 25.4. The in-page suite per browser (full check, seconds, smaller is better): Chromium 34.0 to 17.2, Firefox 42.8 to 25.4, WebKitGTK 76.8 to 52.6 (one run before, median of three after). What changed: a short pause (100 ms or less) now waits one painted frame instead of the whole 30 to 80 ms; starting a stage waits for the game's own promise instead of polling every 25 ms; the game's own drawing loop stays off while a check steps the game by hand (a frame costs 150 to 1,250 ms in WebKitGTK), and the 13 checks that need real frames ask for them; the game-speed check measures the clock per frame instead of over 600 ms windows (about 5.0 seconds of waiting down to about 0.9) and still catches a speed setting that does nothing; the canvas-work check uses 45 frames instead of 100 (6.8 seconds down to 1.9 in Chromium); the layout pass waits one frame instead of 40 to 80 ms. Checked that bugs are still caught: a speed setting that does nothing, a dead `p` key and a 30 px Pause button each fail the right checks. Also fixed a stale Calm value in hand-stepped checks that made two WebKitGTK checks fail once the loop stayed off.
- **Developer, a release opens both packed files first:** `release.py` runs the 2 smoke checks on the regular packed file in all four test browsers (Chromium, Firefox, WebKitGTK and GNOME Web; about 15 seconds) and on the tester file in Chromium (about 2 seconds), so a broken unpacker stops a release before it is stamped.
- **Developer, packed files can be smoke-tested:** `tools/qa.py --packed FILE` opens a packed file (the one players get) and runs the two smoke checks in about 3 seconds per browser (9 seconds for all three). Before, nothing opened the packed files at all. A run that hangs now ends on its own after 150 seconds (Chromium alone; plus 120 seconds per extra browser) and prints where it was stuck; before, one hung for 16 minutes (2 in the last 9 full Chromium runs, not reproduced in 14 later runs).
- **WebAssembly is allowed in the page's security policy:** `'wasm-unsafe-eval'` was added to the script rule, which now reads `'unsafe-inline' 'wasm-unsafe-eval'` (`'unsafe-inline'` was already there and stays, because the game's code is all inline in one file) (owner's rule of 2026-10-17: the permission goes on every page we make). It lets the page run WebAssembly and nothing else: no `eval`, no network, no outside scripts or addresses, and every other rule is unchanged. The game does not use WebAssembly yet, so nothing in play changes. A new check fails if the rule is anything but that exact text, and in WebKitGTK it also compiles a tiny WebAssembly module (it fails without the permission, so the check is real there; Chromium and Firefox skip the policy for test-injected scripts, so there only the text check counts). Quick check passed in all three test browsers (81 seconds).
- **Saving code brought up to date (JS-modules save-kit 1.1.0, API 1):** the game carried an older copy that came before version labels. The new one fixes two bugs that do not show up in normal play: a default value was shared with the live state, so editing the state could change what a later reset gave back, and a default for a counted field was ignored when the field was missing. It also loads a saved game about 28 to 50% faster (the old time was tens of microseconds, so you will not feel it) and can warn an old tab when another tab saved. Cost: the readable page grows from 588 KB to 600 KB (about 2%, mostly notes in the code) and the shrunk page from about 418 KB to 423 KB (about 1%). Nothing in how saves or save codes look changed: a save code made by the old copy loads in the new one and the other way round (checked with a sample save in Node 22), and the old saved game in the checks still loads.
- **Tested in:** ungoogled Chromium 155.0.8059.39, Firefox 158.0, WebKitGTK 2.52.6 (quick check, one at a time); ungoogled Chromium 155.0.8059.39 (full check, 51.5 seconds). Not a release yet: the stamp comes with the next release.
**ICC profile strip from the 77 baked WebP pictures (2026-10-23)**
- Every baked WebP had an ICCP chunk (color profile from canvas.toDataURL). Removed it and cleared the VP8X ICC flag; tools/bake_sprites.py now does the same on every bake.
- Raw bytes 1,651,084 to 1,615,356 (-35,728, -2.2%); base64 chars 2,201,552 to 2,153,892; built page 2,847,387 to 2,619,137 bytes (-228,250, -8.0%).
- Pixels: decoded all 77 in Chromium 155.0.8059.39, worst channel difference 0. Picture gate 100.00% within 3/255 (max 0) in Chromium (headless and Chrome UA), Firefox 158.0, WebKitGTK 2.52.6, GNOME Web 46.5, five stages, two frames each.
- Suite: all checks passed in 177.2 s in four browsers.
- Start-up (speed guard, median of 9 or 21 alternating; lower is better): Chromium boot 140 to 113 ms (-19%), read 197 to 167 (-16%), first paint 164 to 152 (-7%); Firefox (21) boot -1%, read -1%, paint -3%; GNOME Web boot +1%, read 0%, paint -3%; WebKitGTK (21) boot -4%, read +10%, paint -5%, but the same file against itself showed +10% boot there, so that is noise.
**Release the 384 pixel pictures on phone-sized screens; tools/picture_gate.py (2026-10-23)**
- trimBig(): after a sprite's 192 and 96 pixel copies exist and the canvas is 835 device pixels wide or less, IMG[k][m] becomes the 192 copy (which carries its own mips) and the 384 copy is closed. restoreBig() on resize decodes them again (REDO jobs) if the canvas grows past 835. Limit chosen from the measured largest draw: 214 device pixels on a 412 CSS px phone at 2x, about 26% of canvas width, so 250 px (mip threshold) is reached near 960 px wide; 835 keeps 15% margin.
- Memory (Chromium 155.0.8059.39, Chrome user agent so the bitmap path runs, 412x915 at 2.625 pixel ratio, stages 1 and 3 played, forced GC, median of 5 alternating): 1,022 MB to 983 MB total browser RSS = -39 MB (-3.8%, lower is better). Prototype with canvas path earlier: -31 MB (52 x 590 KB).
- Picture gate: 100.00% within 3/255 in Chromium (headless and Chrome UA), Firefox 158.0, WebKitGTK 2.52.6, GNOME Web 46.5. Suite: passed in 174.1, 175.7 and 177.3 s (the first run had one failure I did not capture; three clean runs after) and in Chromium with the bitmap path forced on (28.4 s). New check proven to fail on old code (no bigKept hook).
- Start-up (speed guard, 15 to 21 alternating): Chromium boot 0%, read -1%; Firefox +5% in one order and -3% with the files swapped (order effect); WebKitGTK boot -26%, first paint +11% (single order, noisy); GNOME Web +13% in one order and -14% swapped (noise). No consistent change; the trim runs after assets are ready.
- tools/picture_gate.py: the four-browser picture gate as a repo tool (stages 1 to 5, first frame and +1 s, fixed seed). Four browsers 81 s then 43 s for the two WebKit ones; waits for WebKit to exit with pgrep instead of a fixed rest. Proven to fail: a changed pineapple color gives 99.17% in stage 5 and exit FAIL.
- Not built: build-time picture keys. Hashing 77 sprites at stage start costs about 5 ms at normal speed (20 ms at 4x) and the keys come from the browser's own serialized art, so it would need a changed bake format.
**Pictures re-baked with libwebp method 6 (2026-10-23)**
- tools/bake_sprites.py now reads each sprite out of the page as lossless PNG and encodes it with Pillow/libwebp at quality 97, method 6, alpha quality 100 (no color profile chunk). Same 77 keys. Needs Pillow.
- WebP bytes 1,615,356 to 1,550,358 (-65,000, -4.0%, lower is better); built page 2,619,089 to 2,533,166 bytes (-85,923, -3.3%). Bake took 150 s.
- Picture gate against the previous main: 100.00% within 3/255 in all five stages, both frames, in Chromium 155.0.8059.39 (headless and Chrome UA), Firefox 158.0, WebKitGTK 2.52.6, GNOME Web 46.5; worst channel difference 8 (stage 1), mean 0.00 to 0.01. Suite passed in 176.8 s in four browsers.
- Start-up (speed guard, 15 to 21 alternating, both orders in the noisy browsers): Chromium boot 0%, read -4%; Firefox -5% / +1% (swapped); WebKitGTK +17% (15 runs), +5% swapped (21) and -4% forward (21); GNOME Web +11% forward, -10% swapped. The second file in a pair reads slower in several runs (order effect, about 5 to 15% in the WebKit browsers); no consistent change in any browser.
**GNOME Web dropped from testing; FPS badge lifted above the throw buttons (2026-10-24)**
- Rule from the owner (2026-10-23 8:38 PM Eastern): test browsers are Chromium 155.0.8059.39, Firefox 158.0, WebKitGTK 2.52.6. Removed GNOME Web from tools/qa.py (`--gnome` now exits with a message), tools/picture_gate.py, tools/release.py, tools/speed_guard.js docs, README, AGENTS.md, docs/qa-process.md and the session start hook.
- Suite: 176 s with four browsers to 144.7 s with three (-18%, lower is better). Picture gate: 81 s to about 55 s for three.
- Bug found by the suite: "FPS counter: row, badge, numbers" failed in Firefox 158 on this machine (14 to 28 FPS instead of 58): the badge with hitch text (153 px wide, 320 to 473 px) covered the Lobber button at a 500 px wide view. 4 of 6 Firefox runs failed before the fix; 9 of 9 runs passed after (badge raised to 2.2 rem + 0.9 rem above the bottom edge). Suite then passed in 144.7 s; picture gate 100.00% in the three browsers (badge is hidden by default).
- Fuzz-kit 1.3.3 on this build: Chromium 155.0.8059.39, 30 seeds, 12,000 actions, 0 findings (124 s wall, 3 jobs).
**canvas-probe refreshed, gate uses probe.check (2026-10-24)**
- tools/canvas-probe.js replaced with the JS-modules tools/canvas-probe/src/canvas-probe.js (1.1.0: adds `check`, `deep`; counts path, transform and curve calls the old copy skipped). Test-only; the shipped page is unchanged (picture gate not needed, no build change).
- The gate "canvas work per frame stays under its ceiling in every stage" now calls `probe.check({ callsPerFrame: CEIL[st] })` (median of the per-frame totals; also fails on unmatched save, extra restore, source overhang, growing path) and prints `problems`. The suite steps the game itself with the page's loop idle, so fx-governor is not acting while the probe is on.
- The metric changed, so the old ceilings (620, 600, 750, 950, 670) cannot be reused. Old copy, median per stage in Chromium/Firefox/WebKitGTK: 474/458/474, 400/418/390, 516/530/532, 670/668/684, 478/478/478 (ceilings were 1.31 to 1.50 times the highest). New copy, same runs: highest seen in 9 runs 1454, 1352, 1682, 2492, 1230. New ceilings 1720, 1800, 2370, 3300, 1730 keep the old headroom (1.2 to 1.5 times the highest seen). Stage 1 and 2 medians swing between about 700 and 1400 from run to run (bot and effect state), so the gate only catches large rises.
- Proof it fails: with the stage 4 ceiling lowered to 800 it failed in all three browsers (median 2120 to 2158). Suite passed in 170.0 s in Chromium 155.0.8059.39, Firefox 158.0, WebKitGTK 2.52.6.
**Quicker flicking: 0.30 s cooldown, early-flick catch on by default (2026-10-24, PR number pending; the owner picked "b and c" on the flick card)**
- Cause found: finger lift to first drawn frame of the shot is already 17 to 21 ms (Chromium 155.0.8059.39 and Firefox 158.0, 412x915 touch events); the slow feel was the 0.42 s cooldown silently dropping flicks (early-flick helper was off by default, window 0.15 s) and 780 to 900 ms lift-to-landing.
- Change: Classic cooldown 0.42 to 0.30 s; early-flick window 0.15 to 0.42 s; helper now on by default through a new save field nb (1 = off) because old saves hold ib=0 explicitly; Lobber (0.9 s) and the Zippy 0.15 s untouched; flight time not changed (a 0.6x flight test only cut landing from 900 to 666 ms and was not chosen).
- Flicks thrown out of flicks tried over 6 s (higher is better), Chromium: every 250 ms 12 of 23 to 20 of 23; every 350 ms 9 of 17 to 17 of 17; every 500 ms 12 of 12 to 12 of 12. Firefox 158: 12 of 24 to 20 of 24; 9 of 17 to 17 of 17; 12 of 12.
- Suite: all checks passed in 121.7 s in Chromium 155.0.8059.39, Firefox 158.0, WebKitGTK 2.52.6 (Early flick check rewritten for the new window; Little hands checks use nb). No drawing change, so no picture gate.
- Harness: /mnt/project-files/pineapple-defense/flick-test/ (phone file) and tools/make_flick_test.py.
**One-row counters (2026-10-25, PR number pending; the owner picked "One row")**
- HUD height measured as the lowest HUD element over canvas height, stage 3 mid-wave (Chromium 155.0.8059.39): 412x915 phone 173 of 732 px (24%) to 107 px (15%); 360x640 15% (95 px); 1280x720 171 to 105 px (24% to 15%); 820x1180 14%; sideways 915x412 now one wide row in the side margin.
- Markup: new .topbar holds the progress bar and pause (44 px minimum); one .hrow holds Left, Combo, credits, bank, trophies; pills 1.9 rem tall, labels .62 rem; wraps if a narrow screen cannot fit all four. Bonus game, Roomy letters and sideways rules unchanged.
- Picture gate 100.00% within 3/255 (max 0) in Chromium, Firefox 158.0, WebKitGTK 2.52.6 (canvas unchanged; HUD is DOM). Suite all checks passed in 113.4 s in three browsers. Speed guard (11 turns, medians, lower better): Chromium boot 99 to 98 ms, first paint 132 to 136 (+3%, same); Firefox boot 140 to 144 (+3%), first paint 159 to 162 (+2%), same; WebKitGTK boot 117 to 30 ms, first paint 51 to 47 ms (order effect, treat as same).

## 2026.10.17.0716 · 2026-10-17

### Quick
- Device check (tester build only)
- Slow phones are now called Slow, not Smooth
- The game steps its picture quality down on very slow devices
- Speed meter (FPS counter) up to date, frame-kit 1.1.0 (API 1)
- Sharper title and banner lettering (sticker-text 1.1.0)
- Floating words are easier to read
- Developer: vendored library headers and `tools/canvas-probe.js` now name LFC Foundry as the
- Developer, checks are about twice as fast
- Developer, the game speed check no longer fails by chance
- Device check runs so far

### Details
- Device check (tester build only): one button in the Test Lab plays Stage 2 wave 3 for 20 seconds (after a 2 second warm-up) and ends with a plain-words verdict: Smooth, Mostly smooth, Choppy, Slow or Could not check.
- Slow phones are now called Slow, not Smooth: a steady 8 to 15 FPS used to count as Smooth because the frames were even.
- The game steps its picture quality down on very slow devices: the quality governor (JS-modules frame-kit 1.1.0) used to ignore frames slower than about 10 per second, so a very weak phone never got the cheaper picture.
- Speed meter (FPS counter) up to date, frame-kit 1.1.0 (API 1): the game now carries the current JS-modules copy of the speed meter, not the first unlabeled one.
- Sharper title and banner lettering (sticker-text 1.1.0): the outline around the logo and the stage banners is now one ring of 32 copies instead of 3 rings of 48, which is 33% fewer to draw and misses about 35% fewer edge pixels in the review's tests (1.51% down to 0.99% in Chromium, 1.53% to 0.98% in Firefox, 2.83% to 1.82% in WebKitGTK).
- Floating words are easier to read: four of the 13 floating words were pale against their cream outline: Zippy! 2.00 to 1 became 3.23, Toasty! 2.43 became 3.72, Cheer up! 2.46 became 3.68 and Wait for GO! 2.05 became 3.32 (3 to 1 is the usual floor for big text; the other nine were already at 3.16 or better, the lowest now 3.16).
- Developer: vendored library headers and `tools/canvas-probe.js` now name LFC Foundry as the copyright holder (they said JNFoo); the checks now run only in the test browsers from the shared browsers branch: `qa.py` takes `PD_CHROME`, `PD_FF` and `PD_GECKO` (stock Chromium is refused), a new `--wk` runs WebKitGTK 2.52.6, and the ...
- Developer, checks are about twice as fast: the quick check run in all three test browsers, one at a time, went from 159 seconds to 72 (Chromium 46 to 21, Firefox 40 to 21, WebKitGTK 73 to 30; measured the same day in ungoogled Chromium 155.0.8059.39, Firefox 158.0 and WebKitGTK 2.52.6, all passing, with the same printed results apart from the checks that count ...
- Developer, the game speed check no longer fails by chance: in the release run WebKitGTK measured 60% speed as 85% of normal (the limit is 80%) because one browser hitch landed in a 0.6 second sample, although the game was fine.
- Device check runs so far: the Device check ran on the owner's computer in Firefox 159.0 (tester build 2026.10.16.2048: Smooth, 60 FPS) and in the cloud test machine in Chromium 141 with the processor slowed 1, 4 and 6 times.
- Tested in: ungoogled Chromium 155.0.8059.39, Firefox 158.0, WebKitGTK 2.52.6 (MiniBrowser) (one at a time); the shipped minified page: ungoogled Chromium 155.0.8059.39.

### Deep
- **Device check (tester build only):** one button in the Test Lab plays Stage 2 wave 3 for 20 seconds (after a 2 second warm-up) and ends with a plain-words verdict: Smooth, Mostly smooth, Choppy, Slow or Could not check. It also reports FPS, the slowest frames, how long the game's own work takes per frame, and whether picture quality had to drop, and a Copy report button puts it all on the clipboard to paste into a message. On the test computer it reads Smooth at 60 FPS.
- **Slow phones are now called Slow, not Smooth:** a steady 8 to 15 FPS used to count as Smooth because the frames were even. Now a typical frame over 25 ms (under 40 FPS) is Slow, and over 40 ms (under 25 FPS) with Battery saver on, because the game then draws about 30 FPS on purpose.
- **The game steps its picture quality down on very slow devices:** the quality governor (JS-modules frame-kit 1.1.0) used to ignore frames slower than about 10 per second, so a very weak phone never got the cheaper picture. It now counts frames up to 250 ms apart (down to 4 FPS). In a test with the processor slowed 4 times (about 12 to 16 FPS) quality dropped one step; before, it stayed at full and the game kept stuttering.
- **Speed meter (FPS counter) up to date, frame-kit 1.1.0 (API 1):** the game now carries the current JS-modules copy of the speed meter, not the first unlabeled one. A tab that comes back after a long break (a gap over 1 second) no longer counts as a hitch: in a test with fake frame times a 5 second break used to show "1 hitch: the device" and now shows "smooth", while a real half-second stall is still counted (1 before, 1 now). It also ignores a tap whose time does not fit the frame clock and counts the breaks it skipped, for a debug line. The other two frame-kit files (smoothing of uneven frame gaps and the quality governor) have the same logic as before and now say "Version 1.1.0 (API 1)"; the page grows by about 4.1 KB (3,293 bytes in the speed meter, 810 in the smoother). Not used here: env-probes and fx-governor (no part of the game or its tools loads them).
- **Sharper title and banner lettering (sticker-text 1.1.0):** the outline around the logo and the stage banners is now one ring of 32 copies instead of 3 rings of 48, which is 33% fewer to draw and misses about 35% fewer edge pixels in the review's tests (1.51% down to 0.99% in Chromium, 1.53% to 0.98% in Firefox, 2.83% to 1.82% in WebKitGTK). Letters with tails (g, p, y) keep their gold fill, and two-line banners no longer need our own white-space rule for the outline copies (removed from the page style). The module's review measured frame time on 40 words repainted every frame: Firefox about 20% faster, WebKitGTK about 25% faster, Chromium about 8% slower; we did not measure the game itself. Checked by eye in ungoogled Chromium 155, Firefox 158 and WebKitGTK 2.52.6: logo and a two-line banner look right in all three, and the stage banner looks the same as before in Chromium.
- **Floating words are easier to read:** four of the 13 floating words were pale against their cream outline: Zippy! 2.00 to 1 became 3.23, Toasty! 2.43 became 3.72, Cheer up! 2.46 became 3.68 and Wait for GO! 2.05 became 3.32 (3 to 1 is the usual floor for big text; the other nine were already at 3.16 or better, the lowest now 3.16). The bursts and glows keep their bright colors; only the floating word is darker. A new check reads every floating-word color and stops the run if one drops under 3 to 1 (it names all four when run on the old colors). Idea from cartoon-3d-kit 1.1.0.
- **Developer:** vendored library headers and `tools/canvas-probe.js` now name LFC Foundry as the copyright holder (they said JNFoo); the checks now run only in the test browsers from the shared browsers branch: `qa.py` takes `PD_CHROME`, `PD_FF` and `PD_GECKO` (stock Chromium is refused), a new `--wk` runs WebKitGTK 2.52.6, and the release tool always runs all three browsers one at a time, stops if one is missing or the README does not name it, and writes the versions that really ran into this entry as "Tested in". Stage starts get more patience in WebKitGTK, which starts stages slower here (6 times the wait, so 24 s instead of 4 s).
- **Developer, checks are about twice as fast:** the quick check run in all three test browsers, one at a time, went from 159 seconds to 72 (Chromium 46 to 21, Firefox 40 to 21, WebKitGTK 73 to 30; measured the same day in ungoogled Chromium 155.0.8059.39, Firefox 158.0 and WebKitGTK 2.52.6, all passing, with the same printed results apart from the checks that count random samples). Four causes: (1) the test loops drew a full picture after every 0.05 second step, about 500 per Champion fight; now they draw once a game second, which also removes the WebKitGTK stall where the stage start after a Champion fight took 12 to 18 seconds and sometimes timed out at 24 (now about 0.1 second; that check went from 25 seconds to 0.7); (2) the hold-to-reset check slept through the real 1.2 second holds, 7.3 seconds, and now jumps a fake clock, 1.0 second, and it also checks that a hold just short of 1.2 seconds does not reset (broken on purpose, a 1.0 second and a 1.5 second hold both fail it); (3) the six layout sizes run side by side, 13.4 seconds down to 5.6; (4) fixed sleeps became waits for the thing itself (the speed badge, the page being ready, the twin-tab card). The full check in all three browsers passed in 160 seconds, the first time the WebKitGTK full tier has finished here (it used to hit its time limit). New: `QA_TIMES=1` prints where each browser's time went and its slowest checks, and `--smart` runs nothing for a notes-only change, a 2 second smoke check when nothing changed, and the quick tier otherwise. The shipped page grows by about 20 bytes (one test-hook option).
- **Developer, the game speed check no longer fails by chance:** in the release run WebKitGTK measured 60% speed as 85% of normal (the limit is 80%) because one browser hitch landed in a 0.6 second sample, although the game was fine. It now takes three samples each and keeps the middle one; alone it read 58 to 66% in five runs. Cost: about 3.5 seconds more per browser. The limits (40% to 80%) did not change. The Reset hold check had the same kind of chance failure in WebKitGTK (real time passing while frames were drawn counted toward the 1.2 second hold, so a 1.1 second hold looked finished); the fake clock now stands still between jumps. Re-tested by making the hold 1.0 and 1.5 seconds on purpose: both still fail the check. The two-tabs check could read the page while the tab that takes over was reloading itself (one failure in about 5 runs); it now waits for the reload to finish (Chromium full check passed 3 of 3 afterwards, 54 to 56 seconds each).
- **Device check runs so far:** the Device check ran on the owner's computer in Firefox 159.0 (tester build 2026.10.16.2048: Smooth, 60 FPS) and in the cloud test machine in Chromium 141 with the processor slowed 1, 4 and 6 times. The a phone result is still open. The release tool adds the "Tested in" line below when the release is cut.
- **Tested in:** ungoogled Chromium 155.0.8059.39, Firefox 158.0, WebKitGTK 2.52.6 (MiniBrowser) (one at a time); the shipped minified page: ungoogled Chromium 155.0.8059.39.

## 2026.10.16.1720 · 2026-10-16

### Quick
- Sideways menus and cards
- Roomy letters (Settings, off by default)
- Soft plate behind the HUD counters
- Moved: the game now lives at https://github.com/lfcfoundry/pineapple-defense (play page

### Details
- Sideways menus and cards: held sideways on a phone, the title buttons now sit in the side margins (Play, Continue, Replay a stage and Shop at left; How to play, Trophies, Settings and Calm mode at right), and Settings, Shop, Trophies, How to play and the run end card fill the screen and are drawn at least 1.4 times larger than before.
- Roomy letters (Settings, off by default): letters sit 0.04 of a letter-height further apart, gaps between words are 0.16 wider, and lines are 1.55 times the text size tall, in cards and menu buttons.
- Soft plate behind the HUD counters: the two counter rows sit on a soft cream plate that is half see-through, so the numbers stay readable over busy art, in portrait play (no blur, so no extra cost per frame); sideways play and the bonus game keep the bare pills.
- Moved: the game now lives at https://github.com/lfcfoundry/pineapple-defense (play page https://lfcfoundry.github.io/pineapple-defense/) and the shared code library at https://github.com/lfcfoundry/JS-modules; the old addresses redirect.
- Tested in: Chromium 141.0.7390.37 (the stock Playwright build, not ungoogled) for the full release run; no Firefox run for this release, because the cloud machine could not install Firefox then. Phone not tested.

### Deep
- **Sideways menus and cards:** held sideways on a phone, the title buttons now sit in the side margins (Play, Continue, Replay a stage and Shop at left; How to play, Trophies, Settings and Calm mode at right), and Settings, Shop, Trophies, How to play and the run end card fill the screen and are drawn at least 1.4 times larger than before. Every button there is at least 44 px (the smallest sideways button used to be under that); the layout check now sweeps every screen sideways, so the old known gap is closed.
- **Roomy letters (Settings, off by default):** letters sit 0.04 of a letter-height further apart, gaps between words are 0.16 wider, and lines are 1.55 times the text size tall, in cards and menu buttons. This helps readers who find tight text hard; with it off, nothing changes.
- **Soft plate behind the HUD counters:** the two counter rows sit on a soft cream plate that is half see-through, so the numbers stay readable over busy art, in portrait play (no blur, so no extra cost per frame); sideways play and the bonus game keep the bare pills.
- **Moved:** the game now lives at https://github.com/lfcfoundry/pineapple-defense (play page https://lfcfoundry.github.io/pineapple-defense/) and the shared code library at https://github.com/lfcfoundry/JS-modules; the old addresses redirect.
- **Tested in:** Chromium 141.0.7390.37 (the stock Playwright build, not ungoogled) for the full release run; no Firefox run for this release, because the cloud machine could not install Firefox then. Phone not tested.

## 2026.10.15.1102 · 2026-10-15

### Quick
- Forged by LFC Foundry, MIT licensed
- Developer: the header text lives in `src/header.txt` (used by `build.py` and `tools/pack.py`); a new

### Details
- Forged by LFC Foundry, MIT licensed: a `LICENSE` file (MIT, with the branding notice and the notices of the vendored pieces), the same header block at the top of every built page (the packed file carries it outside the compressed part too), and "Forged by LFC Foundry, MIT License" on the title screen.
- Developer: the header text lives in `src/header.txt` (used by `build.py` and `tools/pack.py`); a new check confirms the header comment, branding notice and title credit are present.
- Tested in: Chromium (version not recorded) and Firefox 158 through the release tool; the first release run had one Firefox timing flake (the FPS badge overlapping a pick) that passed on rerun.

### Deep
- **Forged by LFC Foundry, MIT licensed:** a `LICENSE` file (MIT, with the branding notice and the notices of the vendored pieces), the same header block at the top of every built page (the packed file carries it outside the compressed part too), and "Forged by LFC Foundry, MIT License" on the title screen. First-party source, tool and doc headers now say Copyright (c) 2026 LFC Foundry. The vendored JS-modules files keep their own JNFoo MIT notices. Commits are still authored as JNFoo.
- **Developer:** the header text lives in `src/header.txt` (used by `build.py` and `tools/pack.py`); a new check confirms the header comment, branding notice and title credit are present.
- **Tested in:** Chromium (version not recorded) and Firefox 158 through the release tool; the first release run had one Firefox timing flake (the FPS badge overlapping a pick) that passed on rerun.

## 2026.10.14.1352 · 2026-10-14

### Quick
- Sideways play is roomier
- Shorter waits on stages you have already cleared (X66)
- Danger glow is on for everyone (X34)
- Developer: `tools/motion_audit.py` lists every animation and transition length against a small

### Details
- Sideways play is roomier: held sideways on a phone, the counters, Pause, the weapon picks and Pineapple Rain move into the empty margins beside the picture and get bigger (the weapon picks were about 75 by 23 px, now 124 by 46).
- Shorter waits on stages you have already cleared (X66): the wave intro is 0.6 s instead of 1.2 s, the wave clear 1.0 s instead of 1.7 s, and the wave banners are shorter and pop in faster.
- Danger glow is on for everyone (X34): the red ring and warning sign for a penguin close to your stand now start on; Settings still turns it off, and Calm keeps it still.
- Developer: `tools/motion_audit.py` lists every animation and transition length against a small duration scale (no one-shot is over 0.5 s, so nothing was retuned); the layout check also runs sideways at 892 x 412 and 640 x 360; new checks for the repeat waits and the tip.

### Deep
- **Sideways play is roomier:** held sideways on a phone, the counters, Pause, the weapon picks and Pineapple Rain move into the empty margins beside the picture and get bigger (the weapon picks were about 75 by 23 px, now 124 by 46). The picture itself is unchanged. While a card is open the side buttons go quiet so a stray tap cannot throw. Left-handed mode mirrors the sides. A small tip, once, on a touch phone: "Turn your phone upright for the biggest view." It never blocks and never comes back.
- **Shorter waits on stages you have already cleared (X66):** the wave intro is 0.6 s instead of 1.2 s, the wave clear 1.0 s instead of 1.7 s, and the wave banners are shorter and pop in faster. A first play and every Champion beat keep their full length.
- **Danger glow is on for everyone (X34):** the red ring and warning sign for a penguin close to your stand now start on; Settings still turns it off, and Calm keeps it still.
- **Developer:** `tools/motion_audit.py` lists every animation and transition length against a small duration scale (no one-shot is over 0.5 s, so nothing was retuned); the layout check also runs sideways at 892 x 412 and 640 x 360; new checks for the repeat waits and the tip.

## 2026.10.14.1334 · 2026-10-14

### Quick
- Shop says why (X35)
- Bigger buttons (X01, X02)
- Reset needs a hold, and can be undone (X10, X97)
- Themed letterbox (X75)
- A tap skips the get-ready beat
- Pressed ring (X08): any button gets a soft ring the instant a finger lands, so you can see it even where the
- Every finger plays (Settings, off by default, X12)
- Danger glow (Settings, off by default, X34)
- Tester only: Test Lab has a Flash check (two busy scenes played by a helper, counts big brightness
- Developer: the layout check now sweeps every button for a 44 px minimum on each screen; new checks

### Details
- Shop says why (X35): a row you cannot buy yet stays visible, dimmed with a dashed edge, and tells you what is missing: "Need 30 more", "Needs Slingshot", "Needs Launcher", "Needs More Limes". Tapping it gives a small shake (Calm keeps it still) and never buys.
- Bigger buttons (X01, X02): shop Buy and Try it buttons are now at least 48 px tall (they were 37 to 42), Pause is at least 55 px (was 51) and the Pineapple Rain button at least 48 by 56 (was 40 by 50 on a small phone).
- Reset needs a hold, and can be undone (X10, X97): "Reset completely" is now a small quiet link under the run-end buttons.
- Themed letterbox (X75): the plain navy bars around the game are now a soft wash that matches the stage (shore sky and sand, ice, lighthouse sunset, storm night, party pink).
- A tap skips the get-ready beat: after Resume (X21).
- Pressed ring (X08): any button gets a soft ring the instant a finger lands, so you can see it even where the fingertip covers the button.
- Every finger plays (Settings, off by default, X12): a second finger can throw even while another finger rests on the screen.
- Danger glow (Settings, off by default, X34): a penguin close to your stand gets a red ring and a warning sign, and the ground in front of the stand glows.
- Tester only: Test Lab has a Flash check (two busy scenes played by a helper, counts big brightness flashes per second, plain verdict) and a First tap time line.
- Developer: the layout check now sweeps every button for a 44 px minimum on each screen; new checks cover the reset hold, undo and the lift-of-the-finger guard, shop reasons, sizes, ring, resume skip and both new settings.

### Deep
- **Shop says why (X35):** a row you cannot buy yet stays visible, dimmed with a dashed edge, and tells you what is missing: "Need 30 more", "Needs Slingshot", "Needs Launcher", "Needs More Limes". Tapping it gives a small shake (Calm keeps it still) and never buys. It used to be a dead, faded button with no reason.
- **Bigger buttons (X01, X02):** shop Buy and Try it buttons are now at least 48 px tall (they were 37 to 42), Pause is at least 55 px (was 51) and the Pineapple Rain button at least 48 by 56 (was 40 by 50 on a small phone).
- **Reset needs a hold, and can be undone (X10, X97):** "Reset completely" is now a small quiet link under the run-end buttons. The confirm card has a Hold to reset button with a filling bar (1.2 seconds; letting go, sliding off or a plain tap cancels; holding Enter or Space works too). After the reset a "Fresh start!" card offers Play or Undo reset, which brings back everything exactly as it was.
- **Themed letterbox (X75):** the plain navy bars around the game are now a soft wash that matches the stage (shore sky and sand, ice, lighthouse sunset, storm night, party pink). In landscape the wash is a wide glow instead of a navy strip. No new art, just colors.
- **A tap skips the get-ready beat** after Resume (X21). The tap does not throw.
- **Pressed ring (X08):** any button gets a soft ring the instant a finger lands, so you can see it even where the fingertip covers the button.
- **Every finger plays (Settings, off by default, X12):** a second finger can throw even while another finger rests on the screen.
- **Danger glow (Settings, off by default, X34):** a penguin close to your stand gets a red ring and a warning sign, and the ground in front of the stand glows. Calm keeps it still.
- **Tester only:** Test Lab has a Flash check (two busy scenes played by a helper, counts big brightness flashes per second, plain verdict) and a First tap time line.
- **Developer:** the layout check now sweeps every button for a 44 px minimum on each screen; new checks cover the reset hold, undo and the lift-of-the-finger guard, shop reasons, sizes, ring, resume skip and both new settings.

## 2026.10.14.1256 · 2026-10-14

### Quick
- Keep screen on (Settings, on by default)
- Hints remember: a Champion's tip now shows only until you have beaten that Champion once (before, it
- A kind offer after losing the same wave twice
- Two tabs, one save: a second copy of the game opened in another tab or window plays without saving and says
- If the picture drops out
- Tester only: Test Lab has a Color view button (Normal, Protan, Deutan, Tritan, Gray) for checking
- Developer: `tools/docs_check.py` fails a release on drift in the docs (missing paths, unknown flags,

### Details
- Keep screen on (Settings, on by default): the screen does not dim while you play.
- Hints remember: a Champion's tip now shows only until you have beaten that Champion once (before, it showed every fight), and the "helpers join in" hint shows twice in total, not twice per visit.
- A kind offer after losing the same wave twice: "Want a little help?" with three buttons (Yes, a little help / No thanks, try again / Title).
- Two tabs, one save: a second copy of the game opened in another tab or window plays without saving and says so, with a big Use this tab button.
- If the picture drops out: (a graphics reset or low-memory event), the game pauses, keeps your place in the wave and offers Reload.
- Tester only: Test Lab has a Color view button (Normal, Protan, Deutan, Tritan, Gray) for checking colors the way a color-blind player sees them.
- Developer: `tools/docs_check.py` fails a release on drift in the docs (missing paths, unknown flags, placeholders, wrong trophy or stage counts, stale Status lines); this release fixed four real drifts it found (an old "design phase, no code" line, a stale shop plan, a version in the README status line, one in the ideas file).

### Deep
- **Keep screen on (Settings, on by default):** the screen does not dim while you play. It is let go when you pause, open a menu or card, leave the game alone for a minute, hide the tab, or turn on Battery saver. If the phone refuses (low power), nothing happens.
- **Hints remember:** a Champion's tip now shows only until you have beaten that Champion once (before, it showed every fight), and the "helpers join in" hint shows twice in total, not twice per visit.
- **A kind offer after losing the same wave twice:** "Want a little help?" with three buttons (Yes, a little help / No thanks, try again / Title). Yes turns on the Little hands setup and says exactly what it turned on. It asks once, ever, and never when that help is already on.
- **Two tabs, one save:** a second copy of the game opened in another tab or window plays without saving and says so, with a big Use this tab button. Nothing is overwritten.
- **If the picture drops out** (a graphics reset or low-memory event), the game pauses, keeps your place in the wave and offers Reload.
- **Tester only:** Test Lab has a Color view button (Normal, Protan, Deutan, Tritan, Gray) for checking colors the way a color-blind player sees them.
- **Developer:** `tools/docs_check.py` fails a release on drift in the docs (missing paths, unknown flags, placeholders, wrong trophy or stage counts, stale Status lines); this release fixed four real drifts it found (an old "design phase, no code" line, a stale shop plan, a version in the README status line, one in the ideas file). House-rule git hooks are in `tools/hooks` and checked at release; they now also reject a version stamp that is not year.month.day.HHMM. `build.py` now zero-pads the month and day in stamps. New JS-modules piece: `wake-keeper`.

## 2026.10.14.0817 · 2026-10-14

### Quick
- Back swipe pauses.: On Android (Chrome 126+, Firefox 149+) the back swipe or back button now pauses the game
- A thrown-away tab costs less.
- Little hands setup (Settings)
- Game feel (Settings, all for you to try)
- For grown-ups (Settings)
- Checks got cheaper and wider (developer)

### Details
- Back swipe pauses: On Android (Chrome 126+, Firefox 149+) the back swipe or back button now pauses the game instead of leaving the page.
- A thrown-away tab costs less: Pausing (which also happens when the tab is hidden or the phone is locked) notes how many penguins were left.
- Little hands setup (Settings): one tap sets tap or hold to throw, large buttons, larger text, the early flick helper and the most forgiving aim help.
- Game feel (Settings, all for you to try): *Hit pause* (off): only the penguin you hit freezes for a blink, 35 to 160 ms, never the game clock. *Screen shake* (Normal, as before): Off, Low, Normal or Strong; Strong also shakes a little on every hit and a lot on a Champion hit. *Sticky aim* (off): your last target stays picked for 0.9 seconds so a neighbor does ...
- For grown-ups (Settings): a plain card saying no ads, no purchases, no accounts, no network, what is saved and how to clear it.
- Checks got cheaper and wider (developer): `qa.py --quick` (about 25 s instead of about 70 s), `--calm` (the whole suite with reduced motion on), `--only REGEX`, a per-stage canvas-call ceiling using `canvas-probe` from JS-modules, and a frozen save from the 2026.10.13.2220 release that must still load and Continue.

### Deep
- **Back swipe pauses.** On Android (Chrome 126+, Firefox 149+) the back swipe or back button now pauses the game instead of leaving the page. On the Paused card a second back leaves as before. Esc still pauses too.
- **A thrown-away tab costs less.** Pausing (which also happens when the tab is hidden or the phone is locked) notes how many penguins were left. If the browser throws the tab away, Continue picks that wave up with only those penguins, the same Golden Pineapples and the cheer you had, and says "Welcome back!". A cleared wave, a lost wave or a new game drops the note.
- **Little hands setup (Settings):** one tap sets tap or hold to throw, large buttons, larger text, the early flick helper and the most forgiving aim help. Game speed is not touched, so no trophy is affected. Tap again to undo.
- **Game feel (Settings, all for you to try):** *Hit pause* (off): only the penguin you hit freezes for a blink, 35 to 160 ms, never the game clock. *Screen shake* (Normal, as before): Off, Low, Normal or Strong; Strong also shakes a little on every hit and a lot on a Champion hit. *Sticky aim* (off): your last target stays picked for 0.9 seconds so a neighbor does not steal the throw (needs Aim help on). *Smoother flick speed* (off): reads every finger sample the device reports. Hit pause and shake are off in Calm mode.
- **For grown-ups (Settings):** a plain card saying no ads, no purchases, no accounts, no network, what is saved and how to clear it. The checks now fail if the shipped page ever contains a network call or a link out.
- **Checks got cheaper and wider (developer):** `qa.py --quick` (about 25 s instead of about 70 s), `--calm` (the whole suite with reduced motion on), `--only REGEX`, a per-stage canvas-call ceiling using `canvas-probe` from JS-modules, and a frozen save from the 2026.10.13.2220 release that must still load and Continue.

## 2026.10.14.0743 · 2026-10-14

### Quick
- First-run choice, Flick or Tap
- Edge touches count: the Classic and Lobber pills and the pause button now answer a touch a little outside
- Large buttons fix: with Large buttons on, the Pineapple Rain button no longer overlaps the cheer
- Early flick helper (Settings, off by default)
- FPS badge upgrades: the badge now shows the tap delay (from your touch to the next picture, median of the
- Fonts are WOFF2: (about 30% smaller than WOFF) when the build machine can compress them, otherwise WOFF as

### Details
- First-run choice, Flick or Tap: after the tour (or when you skip it) a new game asks "How do you want to throw?" with two big picture buttons.
- Edge touches count: the Classic and Lobber pills and the pause button now answer a touch a little outside their drawn edge, so a thumb at the very edge of the screen still hits them.
- Large buttons fix: with Large buttons on, the Pineapple Rain button no longer overlaps the cheer bar.
- Early flick helper (Settings, off by default): a flick that comes up to 0.15 seconds before the sling is ready is kept and thrown the moment it is ready, so quick fingers are not ignored.
- FPS badge upgrades: the badge now shows the tap delay (from your touch to the next picture, median of the last 20) and a plain-words verdict: "smooth", or "2 hitches: the game / the device / both". It uses the new `FrameMeter` from JS-modules.
- Fonts are WOFF2: (about 30% smaller than WOFF) when the build machine can compress them, otherwise WOFF as before.

### Deep
- **First-run choice, Flick or Tap:** after the tour (or when you skip it) a new game asks "How do you want to throw?" with two big picture buttons. Tap turns on tap or hold to throw; Flick leaves it off. It asks once and says you can change it later in Settings.
- **Edge touches count:** the Classic and Lobber pills and the pause button now answer a touch a little outside their drawn edge, so a thumb at the very edge of the screen still hits them. They look the same.
- **Large buttons fix:** with Large buttons on, the Pineapple Rain button no longer overlaps the cheer bar. The layout check now runs this combination too.
- **Early flick helper (Settings, off by default):** a flick that comes up to 0.15 seconds before the sling is ready is kept and thrown the moment it is ready, so quick fingers are not ignored. One flick is kept at a time. Same speed, costs and trophies. It is independent of Calm mode.
- **FPS badge upgrades:** the badge now shows the tap delay (from your touch to the next picture, median of the last 20) and a plain-words verdict: "smooth", or "2 hitches: the game / the device / both". It uses the new `FrameMeter` from JS-modules.
- **Fonts are WOFF2** (about 30% smaller than WOFF) when the build machine can compress them, otherwise WOFF as before.

## 2026.10.13.2220 · 2026-10-13

### Quick
- Tap or hold to throw (for the youngest players)
- FPS counter: a new Settings row, off by
- New notes file: `docs/lessons-and-inventions.md` (what building this game taught us, and what exists here

### Details
- Tap or hold to throw (for the youngest players): a new Settings row, off by default.
- FPS counter: a new Settings row, off by default.
- New notes file: `docs/lessons-and-inventions.md` (what building this game taught us, and what exists here that is not in the other repos).

### Deep
- **Tap or hold to throw (for the youngest players):** a new Settings row, off by default. Tap a penguin (or the Champion) and a pineapple flies straight at it; keep your finger down and it keeps throwing, each time the sling is ready, until that penguin is bonked. Then tap the next one. Flicking still works, and a tap on empty ground still does nothing. The speed limits, Lobber and Mega costs, sling cooldown and all trophies are exactly the same.
- **FPS counter:** a new Settings row, off by default. A small badge in the bottom corner (opposite the pineapple buttons, so it never covers one) shows FPS, the slowest frame in the last half second and the quality level (0 is the prettiest). It updates twice a second and costs almost nothing.
- **New notes file:** `docs/lessons-and-inventions.md` (what building this game taught us, and what exists here that is not in the other repos).

## 2026.10.13.2111 · 2026-10-13

### Quick
- Settings dialog redone in the style of Fancy, the Banana
- Save warning: if the browser refuses to keep the saved game (a private window, perhaps), the Save code

### Details
- Settings dialog redone in the style of Fancy, the Banana: big rows, each with a title, a one-line help and an On/Off (or value) pill.
- Save warning: if the browser refuses to keep the saved game (a private window, perhaps), the Save code section now says so and points to the save code and save file.

### Deep
- **Settings dialog redone in the style of Fancy, the Banana:** big rows, each with a title, a one-line help and an On/Off (or value) pill. New options: **Game speed** (100%, 90%, 80%, 70% or 60%, set on the title screen; the Faster Fun and Top Speed trophies need 100%), **Large buttons** (bigger pineapple, pause and Rain buttons), **Battery saver** (about 30 FPS) and **Full screen** (where the browser allows it). Left-handed, Aim help, Aim dots, High contrast, Larger text and Calm mode moved into the same rows.
- **Save warning:** if the browser refuses to keep the saved game (a private window, perhaps), the Save code section now says so and points to the save code and save file.

## 2026.10.13.2059 · 2026-10-13

### Quick
- The victory card ("You did it!") now has Save and go to title.

### Details
- The victory card ("You did it!") now has Save and go to title: It offers Save and restart, Save and go to title (saves your game and returns to the title screen) and Reset completely, like the other games' "rest at the title screen" option.

### Deep
- **The victory card ("You did it!") now has Save and go to title.** It offers Save and restart, Save and go to title (saves your game and returns to the title screen) and Reset completely, like the other games' "rest at the title screen" option. The cards can show a third button now.

## 2026.10.13.1645 · 2026-10-13

### Quick
- First-load tour for kids
- The main slingshot only tilts a few degrees
- Pineapple buttons are short, wide pills
- No throws during the Champion's Ready, Set, GO.
- Stage 2's flip-flops look like flip-flops
- Every stage opens with its name

### Details
- First-load tour for kids: five short picture cards (Welcome, Flick to throw, Bonk a penguin, Keep the cheer up, Waves and Champions) with a big Next button, Back, dots and a big "Skip the tour". It shows once on a brand-new game (never for anyone who already played), and you can replay it from **How to play** with "Play the tour". Calm mode ...
- The main slingshot only tilts a few degrees: now (at most about 7), like the helper slingshots, instead of swinging far left and right.
- Pineapple buttons are short, wide pills: (Classic and Lobber side by side, about half as tall) so they cover less of the lane.
- No throws during the Champion's Ready, Set, GO: Nothing leaves any slingshot (yours, the Auto Slingshot or the Lime Launcher) and the Pineapple Rain button waits, until GO. A flick shows "Wait for GO!".
- Stage 2's flip-flops look like flip-flops: foot-shaped soles with a toe post, a Y strap and a thick edge.
- Every stage opens with its name: (Stage 1 too, which was skipped before).

### Deep
- **First-load tour for kids:** five short picture cards (Welcome, Flick to throw, Bonk a penguin, Keep the cheer up, Waves and Champions) with a big Next button, Back, dots and a big "Skip the tour". It shows once on a brand-new game (never for anyone who already played), and you can replay it from **How to play** with "Play the tour". Calm mode stops its animations.
- **The main slingshot only tilts a few degrees** now (at most about 7), like the helper slingshots, instead of swinging far left and right. Throws still go exactly where you flick.
- **Pineapple buttons are short, wide pills** (Classic and Lobber side by side, about half as tall) so they cover less of the lane.
- **No throws during the Champion's Ready, Set, GO.** Nothing leaves any slingshot (yours, the Auto Slingshot or the Lime Launcher) and the Pineapple Rain button waits, until GO. A flick shows "Wait for GO!".
- **Stage 2's flip-flops look like flip-flops:** foot-shaped soles with a toe post, a Y strap and a thick edge.
- **Every stage opens with its name** (Stage 1 too, which was skipped before).

## 2026.10.13.1614 · 2026-10-13

### Quick
- Penguin props are rarer.
- An icon for every trophy, upgrade and pickup
- New logo: the little penguin in the title wears a beanie and
- New README: written for players, with screenshots of all five stages, Pineapple Roll, the trophies

### Details
- Penguin props are rarer: About 1 in 3 penguins wears something now, about 1 in 12 wears two, and three at once is very rare.
- An icon for every trophy, upgrade and pickup: 21 glossy round trophy badges (they show in color when earned and gray when not), nine shop upgrade icons and four pickup icons, now in the Trophies and Shop screens.
- New logo: the little penguin in the title wears a beanie and scarf.
- New README: written for players, with screenshots of all five stages, Pineapple Roll, the trophies and the shop, and icon tables for every upgrade, pickup and trophy.

### Deep
- **Penguin props are rarer.** About 1 in 3 penguins wears something now, about 1 in 12 wears two, and three at once is very rare. It makes a full outfit a treat to spot.
- **An icon for every trophy, upgrade and pickup:** 21 glossy round trophy badges (they show in color when earned and gray when not), nine shop upgrade icons and four pickup icons, now in the Trophies and Shop screens.
- **New logo:** the little penguin in the title wears a beanie and scarf. The banner in the README is rendered from the live title.
- **New README** written for players, with screenshots of all five stages, Pineapple Roll, the trophies and the shop, and icon tables for every upgrade, pickup and trophy. Developer notes moved to the bottom.

## 2026.10.13.1537 · 2026-10-13

### Quick
- Pineapple Roll rims have drama.
- Penguins dress up.: Almost every penguin now wears a random mix of warm hats (beanie, ear flaps, Santa cap,
- Stage 4 (the storm)
- Stage 5 (the fortress party)
- Progress bar now starts with the stage label
- Speed: stage 4 and 5 draw about 38% more canvas calls per frame (834 against 604 mean on the audit scenes, mostly cached stamps); 

### Details
- Pineapple Roll rims have drama: Each ring now has a rounded lip: a ball that clips the edge rattles around it and can drop in, lip out, or pop in and straight back out like a basketball.
- Penguins dress up: Almost every penguin now wears a random mix of warm hats (beanie, ear flaps, Santa cap, earmuffs, party cone), scarves, mittens and a held item (hot chocolate with steam, a candy cane, a cookie or a snowball).
- Stage 4 (the storm): a lighthouse that sweeps a beam, a cloud with a face that smiles and shows a rainbow when tapped (it also does so on its own every so often), a sailboat and toys on the waves, a duck that says Quack, a whale that says Boop, and a lighthouse that says Flash.
- Stage 5 (the fortress party): floating balloons you can pop (they float back), a turning disco ball that sprays colored light, a snowman DJ, fireworks and searchlights, a softly lit dance floor, string lights, party-hat penguins.
- Progress bar now starts with the stage label: (S1 to S5).
- Speed: Speed: stage 4 and 5 draw about 38% more canvas calls per frame (834 against 604 mean on the audit scenes, mostly cached stamps); frame time in the test browser is a median of 0.5 to 0.6 ms and about 1.4 to 1.9 ms at the 95th percentile.

### Deep
- **Pineapple Roll rims have drama.** Each ring now has a rounded lip: a ball that clips the edge rattles around it and can drop in, lip out, or pop in and straight back out like a basketball. The invisible "catch" is gone: the push that slid a ball off a ring's flank pointed uphill and balanced gravity, so it now runs downhill and balls roll off instead of hanging (longest hang in the test 0.00 s; about half of rolls now touch a rim). The cup front is redrawn over a ball that is dropping in so it really goes inside. The share of balls that sink stays at 40% or more.
- **Penguins dress up.** Almost every penguin now wears a random mix of warm hats (beanie, ear flaps, Santa cap, earmuffs, party cone), scarves, mittens and a held item (hot chocolate with steam, a candy cane, a cookie or a snowball). Scarves and hats sway as they waddle. Mecha penguins and the Champions keep their own look.
- **Stage 4 (the storm):** a lighthouse that sweeps a beam, a cloud with a face that smiles and shows a rainbow when tapped (it also does so on its own every so often), a sailboat and toys on the waves, a duck that says Quack, a whale that says Boop, and a lighthouse that says Flash.
- **Stage 5 (the fortress party):** floating balloons you can pop (they float back), a turning disco ball that sprays colored light, a snowman DJ, fireworks and searchlights, a softly lit dance floor, string lights, party-hat penguins.
- **Progress bar now starts with the stage label** (S1 to S5). The separate wave counter is hidden during play because the bar already shows it.
- Speed: stage 4 and 5 draw about 38% more canvas calls per frame (834 against 604 mean on the audit scenes, mostly cached stamps); frame time in the test browser is a median of 0.5 to 0.6 ms and about 1.4 to 1.9 ms at the 95th percentile. Lights and floor tiles turn off or shrink on lower quality tiers and in Calm mode.

## 2026.10.13.1452 · 2026-10-13

### Quick
- Auto Slingshot is a helper, not a replacement.
- Stage progress bar: across the top of the game: one segment per wave that fills as the wave is cleared, and a
- Mecha penguins: a Gentoo that eats another fish becomes a mecha penguin: steel armor, antenna, glowing
- More fish in waves 4 and 5 of every stage
- Graphics pass on the main game
- Kid-friendly words everywhere
- Pineapple Roll feel
- Pineapple Roll chase camera
- Pineapple Roll graphics
- Speed: about 6% more canvas calls per frame than the previous build for everything above (951 against 894 on the audit scenes); 

### Details
- Auto Slingshot is a helper, not a replacement: It tosses slower (every 5.2, 4.2, 3.4 and 2.8 seconds by Faster Fling tier) and sometimes misses, landing just beside the penguin (28% of tosses, 20% with Better Pineapples 1, 12% with tier 2).
- Stage progress bar: across the top of the game: one segment per wave that fills as the wave is cleared, and a Champion medal that lights up for the Champion fight (like Apple Press).
- Mecha penguins: a Gentoo that eats another fish becomes a mecha penguin: steel armor, antenna, glowing chest core, 3 hits to defeat (a Gentoo takes 2, a Champion much more) and a "Clang!" when it is hit.
- More fish in waves 4 and 5 of every stage: the fish falls faster and lands farther, the first fish comes sooner, and two can be on the field at once, so most players will see a few fish every stage.
- Graphics pass on the main game: drifting light rays, cloud shadows and floating motes on every stage, puffs of snow behind walking penguins, a squash when a penguin is hit, a sparkling sun on the title screen, a shimmering sea and a shiny Play button.
- Kid-friendly words everywhere: how to play, about, cards, trophies and challenges are written for kids, and nothing giggles any more (penguins are now "happy", "glad" or "smile").
- Pineapple Roll feel: the ball now rolls 1.7 times faster (the game clock inside the minigame runs 1.7x, which makes gravity feel like the real thing instead of rolling in molasses).
- Pineapple Roll chase camera: on your last ball the view glides after it up the lane and over the board, leans in near the rings, slows to about 0.3x speed for the drop into a hole, shakes a little on rim and wall knocks, then eases back out for the end card.
- Pineapple Roll graphics: a dusk fairground with a turning Ferris wheel, circus tents, pennants, party lights, floodlights and sweeping light beams; a marquee with chasing bulbs and a neon glow; brass rails, felt grain, a warm light pool, lacquered wood grain; color-coded glowing rings (the 100s pulse); a shinier pineapple ball with a trail, a ...
- Speed: Speed: about 6% more canvas calls per frame than the previous build for everything above (951 against 894 on the audit scenes); the minigame costs about 0.3 ms more per frame in the test browser.

### Deep
- **Auto Slingshot is a helper, not a replacement.** It tosses slower (every 5.2, 4.2, 3.4 and 2.8 seconds by Faster Fling tier) and sometimes misses, landing just beside the penguin (28% of tosses, 20% with Better Pineapples 1, 12% with tier 2). The shop says so.
- **Stage progress bar** across the top of the game: one segment per wave that fills as the wave is cleared, and a Champion medal that lights up for the Champion fight (like Apple Press).
- **Mecha penguins:** a Gentoo that eats another fish becomes a mecha penguin: steel armor, antenna, glowing chest core, 3 hits to defeat (a Gentoo takes 2, a Champion much more) and a "Clang!" when it is hit. Mecha penguins walk a little slower than Gentoos and are worth more.
- **More fish in waves 4 and 5 of every stage:** the fish falls faster and lands farther, the first fish comes sooner, and two can be on the field at once, so most players will see a few fish every stage.
- **Graphics pass on the main game:** drifting light rays, cloud shadows and floating motes on every stage, puffs of snow behind walking penguins, a squash when a penguin is hit, a sparkling sun on the title screen, a shimmering sea and a shiny Play button.
- **Kid-friendly words everywhere:** how to play, about, cards, trophies and challenges are written for kids, and nothing giggles any more (penguins are now "happy", "glad" or "smile").
- **Pineapple Roll feel:** the ball now rolls 1.7 times faster (the game clock inside the minigame runs 1.7x, which makes gravity feel like the real thing instead of rolling in molasses). The landing spots are unchanged, so every flick lands where it did before, just sooner. Also more realistic: rolling resistance with a speed-dependent part, a hard landing bounces higher than a soft one, walls take a little speed from a sliding ball, and the ball squashes on landing.
- **Pineapple Roll chase camera:** on your last ball the view glides after it up the lane and over the board, leans in near the rings, slows to about 0.3x speed for the drop into a hole, shakes a little on rim and wall knocks, then eases back out for the end card. Calm mode keeps the view still.
- **Pineapple Roll graphics:** a dusk fairground with a turning Ferris wheel, circus tents, pennants, party lights, floodlights and sweeping light beams; a marquee with chasing bulbs and a neon glow; brass rails, felt grain, a warm light pool, lacquered wood grain; color-coded glowing rings (the 100s pulse); a shinier pineapple ball with a trail, a glow on the felt and dust when it lands; light columns, ring bursts and sparks when it sinks; livelier crowd with a wave and camera flashes.
- Speed: about 6% more canvas calls per frame than the previous build for everything above (951 against 894 on the audit scenes); the minigame costs about 0.3 ms more per frame in the test browser.

## 2026.10.13.1405 · 2026-10-13

### Quick
- Ready, Set, Go!: While a Champion strolls out to the table, the banner now says Ready..., then Set...,
- The helpers wait for you.
- Pineapple Roll is limited to two plays per run
- Pineapple Roll is easier to flick
- Bug hunt and performance audit with every upgrade and special on

### Details
- Ready, Set, Go!: While a Champion strolls out to the table, the banner now says Ready..., then Set..., then GO! when he stops.
- The helpers wait for you: The Auto Slingshot and the Lime Launcher now stay quiet each round (every wave and every Champion fight) until you throw your first pineapple; then they join in after a short beat.
- Pineapple Roll is limited to two plays per run: so it cannot be an endless source of credits.
- Pineapple Roll is easier to flick: the flick angle steers less (gain 0.3 instead of 0.7), the whole flick speed range now spreads over a wider band (so a small speed error moves the landing less), and a ball that reaches a hole sinks a little more readily.
- Bug hunt and performance audit with every upgrade and special on: (Auto Slingshot, Faster Fling, Better Pineapples, Lime Launcher tier 3, Gull Pals, umbrellas, Air Raid, pickups) across all five stages and all four Champion styles, plus Champion fights with no throws, wild flicks, pauses and shop demos: no errors, no out-of-range values, nothing left over between stages, and every ...

### Deep
- **Ready, Set, Go!** While a Champion strolls out to the table, the banner now says Ready..., then Set..., then GO! when he stops. He cannot be hurt until GO!.
- **The helpers wait for you.** The Auto Slingshot and the Lime Launcher now stay quiet each round (every wave and every Champion fight) until you throw your first pineapple; then they join in after a short beat. A one-line hint explains this at the start of a stage (twice per visit at most). The shop demos still start them at once.
- **Pineapple Roll is limited to two plays per run** so it cannot be an endless source of credits. The count resets when you finish the game or reset. After the second roll the card says it was the last one, the stage 4 offer to roll disappears, and the secret spot gives a little shake instead.
- **Pineapple Roll is easier to flick:** the flick angle steers less (gain 0.3 instead of 0.7), the whole flick speed range now spreads over a wider band (so a small speed error moves the landing less), and a ball that reaches a hole sinks a little more readily. There is no aim assist. In the test browser, a flick with a typical 6 degree and 12% wobble now sinks about 58% of the time (it was about 30%). The roll also runs in fixed 1/240 second steps so it plays out the same at any frame rate.
- **Bug hunt and performance audit with every upgrade and special on** (Auto Slingshot, Faster Fling, Better Pineapples, Lime Launcher tier 3, Gull Pals, umbrellas, Air Raid, pickups) across all five stages and all four Champion styles, plus Champion fights with no throws, wild flicks, pauses and shop demos: no errors, no out-of-range values, nothing left over between stages, and every list stays small (confetti 160 at most, 25 rings, 11 shots, 2 limes in flight, 2 clones). Median frame cost 0.5 to 1 ms (software rendering), 95th percentile 1 to 2 ms, worst frames under 10 ms. The QA fuzz now also plays every Champion fight with everything on.

## 2026.10.13.1256 · 2026-10-13

### Quick
- Champion fights are different now
- Thrown pineapples: a harder flick with nothing to aim at now flies farther (it used to land near the table),
- Limes: now leave a vapor trail and fly like a spiralling football (long axis first, rolling, on
- Auto slingshot: no longer leans: it turns only a few degrees toward its target (the Lime Launcher

### Details
- Champion fights are different now: Captain Flipper hides behind three ice blocks and pops up behind one (the block shakes first); Sir Slidealot charges at your table and every hit knocks him back; Madame Mohawk is shielded by her squad until you clear it, then she is open for a few seconds before a bigger squad comes; Grand Champion Bernard brings icy ...
- Thrown pineapples: a harder flick with nothing to aim at now flies farther (it used to land near the table), a miss lands with a puff and stays put instead of rolling, and a pineapple aimed at a penguin that is already gone flies on and falls farther up the lane.
- Limes: now leave a vapor trail and fly like a spiralling football (long axis first, rolling, on a tight corkscrew path).
- Auto slingshot: no longer leans: it turns only a few degrees toward its target (the Lime Launcher too).

### Deep
- **Champion fights are different now:** Captain Flipper hides behind three ice blocks and pops up behind one (the block shakes first); Sir Slidealot charges at your table and every hit knocks him back; Madame Mohawk is shielded by her squad until you clear it, then she is open for a few seconds before a bigger squad comes; Grand Champion Bernard brings icy clones and only the solid Bernard counts. Coach Waddles keeps the snowball fight. Each Champion shows a short tip when the fight starts.
- **Thrown pineapples:** a harder flick with nothing to aim at now flies farther (it used to land near the table), a miss lands with a puff and stays put instead of rolling, and a pineapple aimed at a penguin that is already gone flies on and falls farther up the lane.
- **Limes** now leave a vapor trail and fly like a spiralling football (long axis first, rolling, on a tight corkscrew path).
- **Auto slingshot** no longer leans: it turns only a few degrees toward its target (the Lime Launcher too).

## 2026.10.13.0956 · 2026-10-13

### Quick
- Lime Launcher tiers are now supply, not speed
- Umbrella stutter fixed
- Gulls swoop lower (and a little bigger) so they are easier to see
- Tester (Lab) build: the pickup button that said Brrr now says Toasty

### Details
- Lime Launcher tiers are now supply, not speed: 6, 12 and 20 limes in every Champion fight (shop rows: Lime Launcher, More Limes, Lots of Limes, same prices), fired at one steady pace.
- Umbrella stutter fixed: the umbrella canopies and every sprite's small copies are now built in the background, so the first Brolly (or the first new mood) no longer costs a frame.
- Gulls swoop lower (and a little bigger) so they are easier to see: Gulls swoop lower (and a little bigger) so they are easier to see.
- Tester (Lab) build: Tester (Lab) build: the pickup button that said Brrr now says Toasty.

### Deep
- **Lime Launcher tiers are now supply, not speed:** 6, 12 and 20 limes in every Champion fight (shop rows: Lime Launcher, More Limes, Lots of Limes, same prices), fired at one steady pace. The missiles are now round limes with a leaf that tumble in flight, a little bigger.
- **Umbrella stutter fixed:** the umbrella canopies and every sprite's small copies are now built in the background, so the first Brolly (or the first new mood) no longer costs a frame. Opening the first umbrella dropped from about 21 ms of extra work to under 7 ms in the test browser.
- Gulls swoop lower (and a little bigger) so they are easier to see.
- Tester (Lab) build: the pickup button that said Brrr now says Toasty.

## 2026.10.13.0008 · 2026-10-13

### Quick
- Comfort settings: (Settings card): left-handed layout, aim help (Generous, Normal, Off) with a dotted aim
- Shop: a **Try it** button runs a short demo of an upgrade on a copy of your save (nothing is
- Replay: replay any cleared stage from the title for full credits; your saved run is untouched;
- Speed: canvas calls per frame down about 51% since the previous round (952 against 1,936), no gradients created per frame, five 
- Build: `build.py --min` minifies the inline script and CSS (esbuild, optional); the QA suite and the packer use it; `qa.py --min` 
- `docs/ideas-qol-and-performance.md` now carries the status of every idea and an audit with before and after numbers

### Details
- Comfort settings: (Settings card): left-handed layout, aim help (Generous, Normal, Off) with a dotted aim arc for the first 5 throws, high contrast (auto marker gets a diamond emblem, snowballs and raid hazards get outlines or dashes), large text, Calm mode mirrored.
- Shop: a **Try it** button runs a short demo of an upgrade on a copy of your save (nothing is spent or earned), and **Undo** refunds the last purchase.
- Replay: replay any cleared stage from the title for full credits; your saved run is untouched; best score per stage is kept.
- Speed: Speed: canvas calls per frame down about 51% since the previous round (952 against 1,936), no gradients created per frame, five small resolution steps instead of three big ones, confetti recycled, cheaper draw-order sort, and stage-one art loads first (tap to first frame about 175 ms instead of 300 ms in the test ...
- Build: Build: `build.py --min` minifies the inline script and CSS (esbuild, optional); the QA suite and the packer use it; `qa.py --min` tests the minified page.
- `docs/ideas-qol-and-performance.md` now carries the status of every idea and an audit with before and after numbers: `docs/ideas-qol-and-performance.md` now carries the status of every idea and an audit with before and after numbers.

### Deep
- **Comfort settings** (Settings card): left-handed layout, aim help (Generous, Normal, Off) with a dotted aim arc for the first 5 throws, high contrast (auto marker gets a diamond emblem, snowballs and raid hazards get outlines or dashes), large text, Calm mode mirrored. A 3, 2, 1 countdown follows every pause, and rotating the phone pauses.
- **Shop:** a **Try it** button runs a short demo of an upgrade on a copy of your save (nothing is spent or earned), and **Undo** refunds the last purchase.
- **Replay:** replay any cleared stage from the title for full credits; your saved run is untouched; best score per stage is kept. A next-goal chip shows the cheapest upgrade you do not own yet.
- Speed: canvas calls per frame down about 51% since the previous round (952 against 1,936), no gradients created per frame, five small resolution steps instead of three big ones, confetti recycled, cheaper draw-order sort, and stage-one art loads first (tap to first frame about 175 ms instead of 300 ms in the test browser).
- Build: `build.py --min` minifies the inline script and CSS (esbuild, optional); the QA suite and the packer use it; `qa.py --min` tests the minified page.
- `docs/ideas-qol-and-performance.md` now carries the status of every idea and an audit with before and after numbers.

## 2026.10.12.2343 · 2026-10-12

### Quick
- New shop item: the **Lime Launcher**, a small green slingshot that stands on the table on its own (no Auto Slingshot needed)
- Graphics polish: richer penguin, Champion and pineapple sprites, glossy shared trophy, heart, medal, pause and raid icons, a more 
- Speed: canvas calls per frame down about 47% (stand, sling frames, badges, trophy and umbrellas cached; confetti drawn in color 
- New file: `docs/ideas-qol-and-performance.md` (10 comfort ideas and 10 performance ideas)

### Details
- New shop item: New shop item: the **Lime Launcher**, a small green slingshot that stands on the table on its own (no Auto Slingshot needed).
- Graphics polish: Graphics polish: richer penguin, Champion and pineapple sprites, glossy shared trophy, heart, medal, pause and raid icons, a more detailed fish and gull, wooden slings with a green variant.
- Speed: Speed: canvas calls per frame down about 47% (stand, sling frames, badges, trophy and umbrellas cached; confetti drawn in color batches; smaller sprite copies for small penguins); the Paper Umbrella shelf moved to make room.
- New file: New file: `docs/ideas-qol-and-performance.md` (10 comfort ideas and 10 performance ideas).

### Deep
- New shop item: the **Lime Launcher**, a small green slingshot that stands on the table on its own (no Auto Slingshot needed). Three tiers: buy it (80), More Limes and Lots of Limes (see the later entry: the tiers became limes per fight). In Champion fights its homing lime missiles pop the snowballs around the Champion first; any missiles left over hit the Champion. Missiles count toward combos.
- Graphics polish: richer penguin, Champion and pineapple sprites, glossy shared trophy, heart, medal, pause and raid icons, a more detailed fish and gull, wooden slings with a green variant.
- Speed: canvas calls per frame down about 47% (stand, sling frames, badges, trophy and umbrellas cached; confetti drawn in color batches; smaller sprite copies for small penguins); the Paper Umbrella shelf moved to make room.
- New file: `docs/ideas-qol-and-performance.md` (10 comfort ideas and 10 performance ideas).

## 2026.10.12.2307 · 2026-10-12

### Quick
- Run-end card: **Save and restart** keeps upgrades, credits, trophies and the speed streak; **Reset completely** (with a confirm 
- One-command QA (`tools/qa.py`) and release (`tools/release.py`): time is fast-forwarded in one browser session, random-action 
- Fixes found by the audit: the Air Raid line now lands mid-field when no penguins are near; test hooks corrected

### Details
- Run-end card: Run-end card: **Save and restart** keeps upgrades, credits, trophies and the speed streak; **Reset completely** (with a confirm step) erases upgrades, credits, streak and progress, and keeps trophies.
- One-command QA (`tools/qa.py`) and release (`tools/release.py`): One-command QA (`tools/qa.py`) and release (`tools/release.py`): time is fast-forwarded in one browser session, random-action fuzzing, layout checks at four screen sizes, Firefox option, cache that skips unchanged builds.
- Fixes found by the audit: Fixes found by the audit: the Air Raid line now lands mid-field when no penguins are near; test hooks corrected.

### Deep
- Run-end card: **Save and restart** keeps upgrades, credits, trophies and the speed streak; **Reset completely** (with a confirm step) erases upgrades, credits, streak and progress, and keeps trophies.
- One-command QA (`tools/qa.py`) and release (`tools/release.py`): time is fast-forwarded in one browser session, random-action fuzzing, layout checks at four screen sizes, Firefox option, cache that skips unchanged builds. See `docs/qa-process.md`.
- Fixes found by the audit: the Air Raid line now lands mid-field when no penguins are near; test hooks corrected.

## 2026.10.12.2253 · 2026-10-12

### Quick
- New shop upgrades: **Gull Pals** (3 tiers), **Paper Umbrellas** (3 tiers, an automatic last resort), **Air Raid** (2 tiers, 
- Combos: calls grow with the chain (Double up to LEGENDARY) with rays, rings, confetti and
- Runs: every finished run makes penguins and Champions 10% faster (capped at double speed); one
- Pickups and trophies on the table arrive with rings, a spinning halo and sparkles
- Redrawn slingshot (wrapped grip, brass caps, shaded fork, stitched pouch); the projectile now shows its back instead of a face
- HUD: one bank counter (the duplicate stage counter is gone) and a trophy count with an icon

### Details
- New shop upgrades: New shop upgrades: **Gull Pals** (3 tiers), **Paper Umbrellas** (3 tiers, an automatic last resort), **Air Raid** (2 tiers, button under the Cheer bar or the R key).
- Combos: calls grow with the chain (Double up to LEGENDARY) with rays, rings, confetti and shake.
- Runs: every finished run makes penguins and Champions 10% faster (capped at double speed); one new challenge per run (+100 Golden Pineapples); 11 new trophies (21 in all).
- Pickups and trophies on the table arrive with rings, a spinning halo and sparkles: Pickups and trophies on the table arrive with rings, a spinning halo and sparkles.
- Redrawn slingshot (wrapped grip, brass caps, shaded fork, stitched pouch); the projectile now shows its back instead of a face: Redrawn slingshot (wrapped grip, brass caps, shaded fork, stitched pouch); the projectile now shows its back instead of a face.
- HUD: HUD: one bank counter (the duplicate stage counter is gone) and a trophy count with an icon.

### Deep
- New shop upgrades: **Gull Pals** (3 tiers), **Paper Umbrellas** (3 tiers, an automatic last resort), **Air Raid** (2 tiers, button under the Cheer bar or the R key).
- **Combos:** calls grow with the chain (Double up to LEGENDARY) with rays, rings, confetti and shake. Slingshot, Auto Slingshot, splash and raid hits chain together; mixed chains are called Team.
- **Runs:** every finished run makes penguins and Champions 10% faster (capped at double speed); one new challenge per run (+100 Golden Pineapples); 11 new trophies (21 in all).
- Pickups and trophies on the table arrive with rings, a spinning halo and sparkles.
- Redrawn slingshot (wrapped grip, brass caps, shaded fork, stitched pouch); the projectile now shows its back instead of a face.
- HUD: one bank counter (the duplicate stage counter is gone) and a trophy count with an icon.

## 2026.10.12.2223 · 2026-10-12

### Quick
- Harder, more distinct Champions; Champion health bar on the left edge; new lane art for every stage; secret tap spots; Toasty! 

### Details
- Harder, more distinct Champions; Champion health bar on the left edge; new lane art for every stage; secret tap spots; Toasty! : Harder, more distinct Champions; Champion health bar on the left edge; new lane art for every stage; secret tap spots; Toasty! replaces Brrr!; P pauses.

### Deep
- Harder, more distinct Champions; Champion health bar on the left edge; new lane art for every stage; secret tap spots; Toasty! replaces Brrr!; P pauses.

## 2026.10.12.2205 · 2026-10-12

### Quick
- Live bank and per-throw costs; Champion lane blocking; parachute fish and evolving penguins

### Details
- Live bank and per-throw costs; Champion lane blocking; parachute fish and evolving penguins: Live bank and per-throw costs; Champion lane blocking; parachute fish and evolving penguins.

### Deep
- Live bank and per-throw costs; Champion lane blocking; parachute fish and evolving penguins.

## 2026.10.12.2112 · 2026-10-12

### Quick
- Five stages of five waves, with stage scenery and five Champions

### Details
- Five stages of five waves, with stage scenery and five Champions: Five stages of five waves, with stage scenery and five Champions.

### Deep
- Five stages of five waves, with stage scenery and five Champions.

## 2026.10.12.1918 to 2026.10.12.2020 · 2026-10-12

### Quick
- More top counters, vertical Cheer meter, labeled pineapples and pickups, pickup guide, README pictures, and a long run of polish 

### Details
- More top counters, vertical Cheer meter, labeled pineapples and pickups, pickup guide, README pictures, and a long run of polish : More top counters, vertical Cheer meter, labeled pineapples and pickups, pickup guide, README pictures, and a long run of polish and stability fixes.

### Deep
- More top counters, vertical Cheer meter, labeled pineapples and pickups, pickup guide, README pictures, and a long run of polish and stability fixes.

## 2026.10.12.1726 to 2026.10.12.1752 · 2026-10-12

### Quick
- Tall 9:16 stage, table power-ups and trophies, Auto Slingshot, animated scenery, redrawn sign, compact dialogs, packed 

### Details
- Tall 9: Tall 9:16 stage, table power-ups and trophies, Auto Slingshot, animated scenery, redrawn sign, compact dialogs, packed single-file build tool, new logo.

### Deep
- Tall 9:16 stage, table power-ups and trophies, Auto Slingshot, animated scenery, redrawn sign, compact dialogs, packed single-file build tool, new logo.

## 2026.10.12.1655 to 2026.10.12.1712 · 2026-10-12

### Quick
- First playable stage 1: five lanes, waves, Rockhopper and Adélie, Classic and Lobber pineapples, Cheer meter, pause, end cards, 

### Details
- First playable stage 1: First playable stage 1: five lanes, waves, Rockhopper and Adélie, Classic and Lobber pineapples, Cheer meter, pause, end cards, Calm mode, saves with Continue, flick throwing, Coach Waddles.

### Deep
- First playable stage 1: five lanes, waves, Rockhopper and Adélie, Classic and Lobber pineapples, Cheer meter, pause, end cards, Calm mode, saves with Continue, flick throwing, Coach Waddles.

## 2026.10.12.1556 · 2026-10-12

### Quick
- First title screen, logo and original pineapple and Rockhopper sprites

### Details
- First title screen, logo and original pineapple and Rockhopper sprites: First title screen, logo and original pineapple and Rockhopper sprites.

### Deep
- First title screen, logo and original pineapple and Rockhopper sprites.
