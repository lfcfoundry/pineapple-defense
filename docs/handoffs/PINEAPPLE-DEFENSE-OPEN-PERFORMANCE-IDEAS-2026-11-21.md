<!-- Copyright (c) 2026 LFC Foundry. MIT License. -->
# Pineapple Defense: close the remaining performance questions with measurements

**Baseline:** main `6b63e03` (2026-11-20). Read `AGENTS.md`, `docs/qa-process.md`, `docs/ideas-qol-and-performance.md`, the current v2 design, and the current release notes first.

## What is already settled

The earlier performance audit already measured cached layers, batched particles, mip copies, idle-loop stopping, quality scaling, gradient reuse, startup art sequencing, object reuse, depth sorting, and packed/minified startup. Do not reopen the rejected sprite-atlas idea or pool sparse object types without new evidence. The remaining recorded questions are a lower-detail treatment for the bonus mode at the lowest quality setting and a larger baked chase background on very wide screens.

## Bounded experiments

Keep these as two independent, opt-in prototypes. Do not change gameplay or quality defaults in the benchmark branch.

| Candidate | Test permutations | Correctness gate |
|---|---|---|
| Bonus-mode low-detail scene | Existing quality levels; low/medium/high detail; idle, moving object, active effect; 412x732 DPR 2, 800x1280 DPR 1, and wide 1280x800; hardware and software canvas where available. | Same collisions, score, input response, readability, and reduced-motion behavior. Compare screenshots with the existing picture gate and record intentionally removed decoration. |
| Wide chase background | Current baked background versus larger bake; 1x, 1.5x, and 1.7x zoom; narrow phone, tablet, wide desktop; DPR 1/2/3; panning and camera movement. | No crop, parallax, sharpness, or gameplay-target change beyond the declared resolution. Existing sizes and packed-page ceiling remain unchanged. |

For each candidate, measure asset creation/startup, first visible frame, steady-state frame time, draw calls, backing-store bytes, and page size separately. Use the existing `speed_guard.js` paired baseline/candidate process and one browser at a time. Record the game’s five stages, every quality level touched, exact browser versions, and device class. Stop size ramps if memory or frame stability degrades.

## Decision

Use `python3 -I tools/qa.py --smart` for the affected checks during work; run the project’s full release qualification only after a candidate is chosen. Follow `tools/qa.py --min`, packed-file checks, and the picture gate when relevant. Accept an experiment only with a repeatable user-visible benefit and no more than the owner’s 5% material regression in controls. Otherwise keep the present behavior and record a no-go. Physical-phone observations remain a separate qualification, not something headless results can establish.
