# Browser validation — Pineapple Defense R3 follow-up

**Run date:** 2026-11-17  
**Artifact:** `index.html`  
**Artifact SHA-256:** `26983fe4f954d59debb7bdbb3523e601b18b9a5865dd37cc0e3b23d1247b2b64`  
**Result:** **15/15 browser checks passed.** The reported cart-stop failure was an invalid post-Outcome test expectation. R3 specifies that the cart freezes at Outcome; implementation behavior matched that rule. No application code changed in this follow-up.

## Cause and resolution of the prior failure

The previous browser check waited for `cart.stopped` even after the encounter had entered Outcome. That expectation contradicted §9 of [MINIMUM-EXPERIMENT-SPEC.md](../MINIMUM-EXPERIMENT-SPEC.md), which explicitly says Outcome snapshots the score and freezes survivors, shots, and cart; only already-started cosmetic reactions/effects may continue. The §8 cart-stop rule is processed while the active simulation advances. It does not require continuing gameplay after Outcome.

The engine follows that phase contract: its Outcome branch updates permitted reactions/effects, then returns before active cart movement, sweeps, and stop checks ([engine.mjs](engine.mjs#L53)). If Outcome occurs before `stopTime = releaseTime + 0.46/0.35`, the cart remains at the analytic position for the final active source time, with `stopped=false` and no `cart-stop` event. This is the specified freeze, not a timing or step-scheduling defect.

I corrected the browser assertion to accept either a completed stop during Active or an Outcome freeze at `cartAt(S.t)`, and to verify that the cart and source time remain frozen after Outcome. The implementation and built artifact were left unchanged.

**Repeated cart scenario, 360×640, N1:** support release **0.7005435526 s**; contacts for penguins 1 and 2 at the release boundary and penguin 3 at **1.1940724917 s**; Outcome at **2.0007333422 s**; scheduled stop **2.0148292669 s**. At Outcome, `cart.x=271.8239135 px`, exactly matching `cartAt(S.t)`; `stopped=false` and no stop event were correct because the stop time had not arrived. A further 100 ms browser wait left source time and cart position unchanged. The N0 support remained inert, and F0 still exposed only its four penguin targets.

The earlier run’s approximately 31 ms gap had the same cause. Its failed assertion was corrected; no gameplay rule or timer was changed.

## Browser and method

The installed browser is Termux Chromium **157.0.8103.78**, driven headless with Puppeteer Core **25.16.0**, Node **v26.13.1**, arm64. The prototype was loaded from its local `file://` artifact. Network interception blocked external requests. The rerun log, driver, downloads, and screenshots are outside the repository under `/data/data/com.termux/files/usr/tmp/pd-r3-browser-Uz1hin/`.

I re-read the approved-browser README from knowledge-base branch commit `7f91f60cf35eb92ddcae90bb8304a2ed525824f2` and confirmed the live branch had the same commit. Its approved Firefox, ungoogled Chromium, and WebKitGTK binaries are not installed in this Termux environment. This was the requested supplemental Chromium run, not approved-browser qualification. No software was installed.

All three conditions were checked at **320×568, 360×640, 412×732, and 640×360**. Touch actions used Chromium CDP touch emulation. The final runner summary was **15 passed, 0 failed**, with 12 viewport/condition render rows, 12 timing rows, zero external requests, zero failed requests, zero console errors, and zero page exceptions.

## N0/N1 controlled comparison

The fixed-state comparison passed again. N0 and N1 were reset sequentially to the same fixture and cosmetic tape at preset A, 360×640. Both used the same in-page `pointInput.down/move/up` sequence, pointer metadata, press coordinate **(40.8, 453.261792)**, endpoint **(28.8, 465.261792)**, and fixed **1/60-second** step sequence. Active began directly through the diagnostic API after reset, bypassing the countdown so the comparison began at the same simulation time. The launch shot objects matched exactly.

Complete snapshots matched for steps 1–35. At step 36 (source time **0.6000000000000002 s**), N0 resolved `empty-landing`; N1 resolved `support-release`. At step 37, the first N1 cart contact was applied to penguin 1, with continuous contact time at the release boundary (**0.6000000000000002 s**). Actor and projectile state were identical before endpoint resolution, and the expected N1-specific divergence followed. This avoids comparing moving-target samples taken at different times.

Separately, real browser mouse corrections hit actor 2 in both N0 and N1 at all four viewports. Those per-arm actions sampled moving actors independently and are not used as the exact-equivalence evidence.

## Regression results

All 15 browser checks passed:

- Offline local boot, CSP, request interception, and runtime-error check.
- Canvas/layout matrix for F0, N0, and N1 at all four nominated sizes.
- Per-condition reset-state and cross-condition contamination checks.
- N0/N1 endpoint correction and ordinary penguin hits at all four viewports.
- Fixed-state N0/N1 comparison described above.
- F0 authentic flick acquisition, prediction, and impact at all four viewports.
- F0 no-target speed mapping and selected-target miss continuation.
- Support release, cart contacts, and Outcome freeze; N0/F0 support remained inert.
- Cancel-region latch, outside release, keyboard Fire, explicit Cancel, Escape, focus loss, reset, pause/resume, and resize behavior.
- Touch-emulated launch in all three conditions and N1 touch-cancel.
- Guided ordering for participant IDs 1 and 2.
- Software-performance recording, consent-gated local JSON export, and operator annotation.
- Console, uncaught-exception, failed-request, and external-request check.
- Headless rAF interval measurement for all 12 viewport/condition pairs.

F0 still used its copied original targeting/prediction path: actor 2 was acquired and hit in every viewport. The F0 no-target speed-derived depth and vanished-target continuation branches passed. N0 and N1 keyboard focus-to-Fire each launched once at the retained endpoint **(183.6, 448)**. Keyboard Cancel cleared without launch or exclusion; Escape cancellation, pointer/touch cancellation, and focus leaving the composite retained their deliberate behavior.

The reset-button trial repeat reproduced its snapshot and retained the block throw count; New block reset the count. Guided practice orders remained **F0, N0, N0, N1** for ID 1 and **N0, F0, N1, N0** for ID 2, with the primary lock before N1.

## Frame timing

**Method:** 500 ms warm-up, then 2 s of `requestAnimationFrame` timestamp intervals per condition/viewport. These are headless event-loop intervals, not compositor presentation times.

| CSS viewport | Condition | Samples | p50 ms | p95 ms | p99 ms | Max ms | >25 ms |
|---|---:|---:|---:|---:|---:|---:|---:|
| 320×568 | F0 | 121 | 16.7 | 16.7 | 16.8 | 16.8 | 0 |
| 320×568 | N0 | 120 | 16.7 | 16.8 | 16.8 | 16.8 | 0 |
| 320×568 | N1 | 121 | 16.7 | 16.8 | 16.8 | 16.8 | 0 |
| 360×640 | F0 | 120 | 16.7 | 16.7 | 16.8 | 16.8 | 0 |
| 360×640 | N0 | 120 | 16.7 | 16.7 | 16.8 | 16.8 | 0 |
| 360×640 | N1 | 121 | 16.7 | 16.8 | 16.8 | 16.8 | 0 |
| 412×732 | F0 | 121 | 16.7 | 16.7 | 16.8 | 16.8 | 0 |
| 412×732 | N0 | 121 | 16.7 | 16.7 | 16.8 | 16.8 | 0 |
| 412×732 | N1 | 121 | 16.7 | 16.8 | 16.8 | 16.8 | 0 |
| 640×360 | F0 | 121 | 16.7 | 16.7 | 16.8 | 16.8 | 0 |
| 640×360 | N0 | 121 | 16.7 | 16.7 | 16.8 | 16.8 | 0 |
| 640×360 | N1 | 121 | 16.7 | 16.8 | 16.8 | 16.8 | 0 |

No interval exceeded 25 ms in this run. No interval exceeded 33.333 ms. Headless Chromium timing does not predict physical-device performance, display pacing, input-to-photon latency, or touch usability.

## Remaining limits

The inspected N1 320×568 screenshot still showed “Paused · attempt excluded” despite the Active-state check immediately before screenshot capture. The capture transition was not isolated; sampled Canvas pixels and layout checks passed, but this screenshot is not clean visual evidence of an active N1 scene.

Touch was emulated, not performed on a physical touchscreen. No approved-browser run, visible-compositor review, touchpad/stylus/screen-reader test, modest-device qualification, or human playtest was done. Comprehension, control, enjoyment, fairness, and child accessibility remain unvalidated.

The 47 module tests, app integration checks, and 20 pinned-source provenance checks were rerun after this finding; all passed. The DOM/Canvas-double checks remain synthetic and do not replace browser or human evidence.

## Files and preservation

For this follow-up, only [IMPLEMENTATION-REPORT.md](IMPLEMENTATION-REPORT.md) and this browser-validation report were updated. The application modules, `index.html`, artifact metadata, and original game were unchanged. All 147 pre-existing files remained hash-identical. Git stayed on `codex` at HEAD `c0563e00611ba2288c26c22ffde4e6aacede1b6b`; the staging index and worktree configuration were unchanged. No commit, push, install, or dependency change occurred.