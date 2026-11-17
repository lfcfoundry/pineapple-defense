# Pineapple Defense — isolated R3 experiment

This is a playable browser artifact for engineering exploration, **not a production replacement or a qualified human study**. The campaign, saves and twelve planning Markdown files are untouched. Authority: [minimum specification](../MINIMUM-EXPERIMENT-SPEC.md), source commit `4356ead15a5eb61693f33497515f0212cf01dd77`. Both historical reviews and the complete design package were read before implementation.

## Launch

Open **[index.html](index.html)** directly in a browser. Everything, including the genuine original pineapple and Rockhopper art, is embedded. No server, account, asset download, save access or dependency is required at runtime.

If your file viewer does not open HTML as a webpage, from the repository root run:

```sh
python -m http.server 8767 --bind 127.0.0.1 --directory planning/redesign/prototype-r3
```

Then open `http://127.0.0.1:8767/`. This serves only the isolated prototype. The artifact's CSP denies connections; it does not contact the server for gameplay, assets, export or telemetry.

## Conditions and controls

- **F0:** actual pinned original pointer handlers, recent-segment sampler, threshold checks, corridor/scoring, launch-time prediction, no-target speed branch, first-five gesture guide, hover throw, endpoint resolver and soft miss continuation. Buttons/gesture quirks are preserved. Common research dependencies disable campaign rewards, pickups, scene taps, helpers and advancement.
- **N0:** direct CSS-coordinate press, optional correction, stationary release valid; no snap, leading, power choice or buffered shot. Same braked support/cart decoration as F0.
- **N1:** exactly the N0 aim/flight/reload implementation; adds the one support release and prescribed swept cart opportunity with its outline/instruction/brake cues. No airborne collisions or general physics engine.

Select condition/preset and board size, then wait for the unskippable three-second countdown. **Reset trial** restores everything except the block's accepted-throw count; **New block** also resets that count. Aiming never pauses clocks. Reset starts a fresh attempt; pausing or losing focus excludes the interrupted attempt. Resume is available for exploration, with the source countdown/consumed pointer skip; use a full reset for a scored replacement.

N keyboard: focus canvas, arrows nudge, Tab to Fire, Enter/Space commits once. Cancel/Escape clears the point; a later Escape pauses. P pauses. The explicitly selected latch adaptation chooses a point then uses Fire. Internal board/Fire/Cancel focus preserves the point; leaving that composite excludes the active attempt. The exact mirrored Cancel square is on the canvas. Extra fingers cannot own/cancel N input; F keeps its original behavior.

The board fits a narrow display and exports its **actual** CSS size. Use a viewport wide enough for exact nominated sizes. A resize excludes the current trial; reset afterward. The world remains source-time/frame quantized; matching streams replay deterministically, not universally bit-identically across refresh schedules.

## Study workflow and metrics

Open the operator instruments before a trial. Record device/browser and comfort/input settings first. Guided IDs 1–6 are the declared child group, 7–12 adult group; IDs are anonymous, not ages or names entered by the child. It runs four condition blocks with the corrected age-balanced order: primary F0/N0, then a fresh counterbalanced N0/N1 pair. **Begin/repeat practice** starts the initial block countdown after the script; active practice caps at 60 seconds. Three scored A slots follow each practice block, with at most one interruption replacement per slot.

Stage-1 ratings, checklist items 1–3 and independent-point probes for F0 and N0 must precede the primary lock/N1. Use **Probe condition**, then **Independent-point probe**: mark intended landing position for ID2 on the frozen GO scene, then execute in the restarted live fixture. The point is captured independently of the hidden reticle; do not count these cued probes as live input reliability. The operator must record actual responses/codes, not simply check “pass.”

After the second pair: checklist items 4–5, unprompted N1 B, outcome-only feedback, second B, optional N0/N1/neither replay, and paired two-miss recovery for odd IDs. The normal support outline remains on B; its teaching label is removed. Recovery automatically replays the authentic qualified no-candidate F trace or corresponding N releases, records their source-time quantization, and hands control back when reload completes. It does not coach a rescue solution.

The local event stream records launch parameters/endpoints, selected F actor where inferable, rejects, pointer samples, source dt, contacts, boops, support/stop timestamps, resets, starting guide count, interruption/exclusion, outcomes and software frame/point-paint samples. Manual instruments record unknown/launch/cancel intent, event-specific error code, checklist, anchored control/enjoyment ratings, preference, replay and reasons. Export includes trial roles so practice/probes/recovery do not contaminate primary scored rates. Unknown intent is not guessed; human coding and gate interpretation remain the moderator's work.

Check consent, then **Download metrics JSON**. Export is a local download only. Nothing is persisted automatically, so export before reloading/closing. Do not enter identifying information in notes. Software response measurements are event receipt to draw completion, **not physical touch-to-photon**. No numerical human gate is auto-certified.

## Verification

No dependencies were installed. Node and Python standard libraries suffice:

```sh
python -I planning/redesign/prototype-r3/check-provenance.py
node --test planning/redesign/prototype-r3/tests.mjs
python -I planning/redesign/prototype-r3/build.py
node planning/redesign/prototype-r3/tests-app.mjs
```

The build assembles only this directory's modules into its own `index.html`. `extract-source.py` recreates the source capsule/assets from the pinned Git object; it never checks out, edits or builds the game. `PROVENANCE.json` identifies copied routines/boundaries, `ARTIFACT.json` pins the current module/artifact hashes.

`browser-check.mjs` is an **unrun** follow-up using the already available Puppeteer client and an explicitly supplied approved ungoogled executable. Re-read the knowledge-base browser README before running it; no stock fallback is allowed. Set `PD_CHROME` and, if needed, `PUPPETEER_MODULE`, then run `node planning/redesign/prototype-r3/browser-check.mjs`. It writes its own labeled results/screenshot only after execution. Boot checks are not performance certification. Real touch/mouse/touchpad/keyboard, focus, visual rendering, modest-device frame budgets and all human questions remain browser/device follow-up work.

See [IMPLEMENTATION-REPORT.md](IMPLEMENTATION-REPORT.md) for exact tested coverage and limitations. Do not recruit participants until the remaining specification qualification gates pass.
