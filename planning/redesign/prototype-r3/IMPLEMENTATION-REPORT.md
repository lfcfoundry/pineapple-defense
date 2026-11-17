# R3 isolated experiment — implementation report

2026-11-17. Engineering prototype only. No human playtest, approved-browser/mobile performance qualification, usability claim or production approval. A supplemental headless Termux Chromium timing run is recorded in the browser-validation report.

## Artifact and authority

Location: `planning/redesign/prototype-r3/`. Open `index.html` directly, or follow the local-server instructions in [README.md](README.md). The assembled artifact is self-contained HTML with an inline ES module, embedded SVG art, inline CSS and a restrictive offline CSP. Its source is split into JavaScript modules for inspection/testing. No runtime dependencies or external assets/services.

Read the complete twelve-file package (eight design documents, minimum specification, reconciliation log and both reviews). Implementation authority is the corrected R3 minimum specification, not older review recommendations for additional models/Plan. Pinned implementation: `4356ead15a5eb61693f33497515f0212cf01dd77`, inspected with read-only Git object access. Existing checkout remains `codex` / `c0563e00611ba2288c26c22ffde4e6aacede1b6b`; local main is the pinned object. No branches/worktrees/refs were created or changed.

## Implemented conditions and shared fixture

| Condition | Implementation |
|---|---|
| F0 | Source-copied pointer/down/move/up/cancel/hover handlers, sample windows and thresholds; unchanged target corridor/scoring, prediction, no-target speed branch, Classic arc/time and endpoint collision; original first-five direction guide and vanished-target miss continuation. Source tilt/pouch geometry retained. |
| N0 | Absolute CSS point preview/correction, stationary release, exact endpoint, automatic arc/time, neutral sling tilt, no target acquisition/continuation; shared inert support/cart. |
| N1 | Same N0 input/shot code; one removable support, prescribed cart rollout and quadratic continuous contacts, outline/brake/instruction cues. Release stamped at frame end; no backward sweep; inclusive boop/stop contact rules; interpolated contact location and zero frame-end reaction timer; permanent parked-trigger retirement. |

One Classic type, one support/cart/rail, four source Rockhoppers, original Cheer changes, fixed R3 geometry and A/B timing. Source airborne transit remains noncolliding. No Plan, ricochet, independent power, helper, upgrade, campaign progression or extra physical object. Trophy/pickup/scene/reward/advancement dependencies are inert and no save system is booted.

Initial three-second countdown, active source/EvenDt timing and dt cap, cooldown, reset manifest, per-block thr retention, input interruption and source-quantized Outcome boundary are implemented. Runtime physics uses no general engine. The fixed cosmetic random tape is identified in exports and rewound per trial. N supports pointer capture/ownership, exact mirrored Cancel, keyboard fixed repeat, separate Fire, latch adaptation and composite focus behavior. Resizing requires reset; interruptions remain recorded/excluded.

### Outcome/cart boundary qualification

The R3 minimum specification §9 freezes the cart when Outcome begins; the §8 analytic stop and contact rules apply only while Active simulation time advances. The prior browser assertion incorrectly required `cart.stopped` after Outcome and therefore reported a failure when the cart was correctly frozen before its stop point. No simulation or timing change was warranted.

The repeated N1 browser scenario released at **0.7005435526 s** and entered Outcome at **2.0007333422 s**, before the prescribed **2.0148292669 s** stop time. Its final **x=271.8239135 px** equaled the analytic cart position at the last active source time. `stopped=false`, no `cart-stop` event, and an unchanged cart/source time after another 100 ms matched the spec's freeze rule. The browser check was corrected to validate either an Active stop or a correct Outcome freeze. See the browser-validation report for the full run and limitations.

## Operational recording and sequence

Condition/preset selection, trial/block reset, guided four-block counterbalancing, primary lock before N1, independent-point probes, two transfer attempts with outcome-only feedback, optional replay and odd-ID recovery are present. Actual anonymous human intent, checklist, ratings and reasons require moderator recording; the prototype does not infer them from hits. Guided instruments reject a primary lock until both point probes have completed. Unknown intent stays unknown. Export records trial roles, event indexes, source dt, shot metadata, inferred F candidate ID, contact/release/stop/boop times, miss continuation, source-quantized outcomes, exclusions, software frame/response samples and participant/operator notes. Consent-gated local JSON export; no automatic persistence/upload.

Recovery uses authentic F pointer traces at the frozen nominal times and corresponding N point releases, retaining actual source bucket times and checking the ≤4 px endpoint allowance. Those injected events are marked separately. Clean defense remains required; the tests do not claim that an actual novice achieves it.

## Automated verification actually run

- **47 Node module tests:** zero failures. Geometry/contact-region separation for both presets at 320×568, 360×640, 412×732 and 640×360; F targeting/prediction/speed/no-target/threshold/tail/hover/miss behavior; N0/N1 equivalence; stationary/correct-back/outside-back/cancel/owner rules; keyboard repeat/retention/readiness; direct/support priority; noncolliding transit; cart crossings/stop at 30/60/120 update schedules; independent dense contact reference; source reaction timing; reset/replay, thr, pause/resize/Outcome and recovery traces at all four sizes; ordering and rate primitives.
- **Bundled-app integration:** boots the actual assembled module with a recording Node DOM/Canvas double. Exercises all 12 condition/viewport rendering call paths, touch-shaped dispatch, release-induced capture loss, internal focus→Fire, window blur, pre-GO press gating and the actual guided workflow including primary probe lock, both B attempts and sampled recovery. Zero failures. This checks JavaScript integration; the double does not produce or inspect browser pixels.
- **Provenance:** all 20 copied function bodies match the pinned source byte-for-byte. No campaign persistence bootstrap. Source wrappers observe events and disable common dependencies; these are not claims that the full campaign is unchanged inside the fixture.
- **Assembly/syntax:** dependency-free prototype-only build succeeds; all authored modules and the combined module parse under Node. No runtime import/network/storage APIs in the assembled application path. CSP and data favicon prevent gameplay/asset connections. Browser enforcement remains unverified here.

The original implementation verification commands, statuses and durations are recorded in [VERIFICATION.json](VERIFICATION.json); the repeat run after the Outcome/cart finding is summarized in the browser-validation report. Runtime/CPU timings are test-harness costs, **not game FPS or touch latency**.

## Unrun browser/device and human checks

The host is Termux aarch64. Node, Python and an existing Puppeteer client were available; no project-approved Firefox/ungoogled/WebKit executable was found. The locally available browser-branch README was read through its tracking object; its current table there lists Firefox 158.0 (158.0b5), ungoogled Chromium 156.0.8078.79-1 and WebKitGTK 2.52.6. No fresh remote/browser installation was performed, and that cached table must be refreshed/re-read before future browser execution. No stock/Android Chrome was substituted. No dependencies were installed.

`browser-check.mjs` remains **unrun** because its approved-browser requirement cannot be met in this Termux environment. The requested follow-up instead used the already available stock Termux Chromium 157 with the existing Puppeteer Core harness; all 15 checks passed against the stated R3 behavior, including the Outcome cart freeze. That supplemental run is documented in the browser-validation report and is not approved-browser qualification. Approved-engine rendering, physical touch/pointer capture, OS focus/keyboard/touchpad behavior, modest-device p95 frame/response targets, physical latency, reduced-motion appearance and human comprehension/enjoyment remain open.

Do not treat the Node rendering-call checks as viewport screenshot coverage or physical-device testing. No screen-reader/live nonvisual accessibility certification is made.

## Deviations, scope limits and follow-up

No consequential aiming, collision, timing, reward or condition rule was intentionally changed. The retained F/N flight/feedback differences are the specification's declared confounds. Common presentation is simplified: stage-1 sky/shore/striped stand and sling are light Canvas drawings; genuine source SVG characters/fruit and source actor/shot/guide drawing routines are used. Decorative shadow/danger rendering and puff particles are lighter shared substitutes; no outfits, extra scenery secrets, sounds or haptics. This is an explicit presentation limitation, **not validated equivalence of the complete original game's feel**. Compare art/perspective/cues in a real browser before participants; restore a necessary shared source decoration if qualification finds it changes comprehension.

The prescribed timing reversal, direct-shot safety margins, post-miss recovery playability, useful cart decision and performance gates are **not established by successful unit tests**. Future qualification must demonstrate those routes and the ≥0.15 s margin, then freeze the artifact/instructions/device manifest before any human comparison. Do not tune between participants, weaken F, change the trial definitions or add systems to rescue a failed result. Human evidence must distinguish input usability from cart novelty; short repetition cannot establish retention.

All existing tracked files and twelve existing planning Markdown files are preserved. Changes consist solely of new files inside this prototype directory. No original source/HTML/assets, dependency manifest, save, test/build configuration or design document was overwritten. No commit, push, merge, checkout, reset, rebase or ref/index mutation occurred.

## Exact file inventory and preservation check

Created 21 files, all under `planning/redesign/prototype-r3/`:

- Artifact/metadata: `index.html`, `ARTIFACT.json`, `PROVENANCE.json`.
- Modules: `app.mjs`, `assets.mjs`, `engine.mjs`, `even-dt.mjs`, `input.mjs`, `legacy.mjs`, `render.mjs`, `study.mjs`.
- Assembly/source inspection: `template.html`, `build.py`, `extract-source.py`, `check-provenance.py`.
- Verification: `tests.mjs`, `tests-app.mjs`, `browser-check.mjs`, `VERIFICATION.json`.
- Documentation: `README.md`, `IMPLEMENTATION-REPORT.md`.

Final SHA-256 comparison: **all 147 pre-existing tracked/untracked files are unchanged**, including all twelve planning Markdown files. Tracked and staged Git diffs are empty. Original worktree/branch/HEAD and local-main SHA remain as recorded above. The 21 new prototype files are untracked; none were staged or committed. No other repository was modified.
