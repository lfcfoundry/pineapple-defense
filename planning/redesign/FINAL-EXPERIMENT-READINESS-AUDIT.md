# Final experiment readiness and validity audit

2026-11-17 · Documentation and pinned-source inspection only.

## Verdict: READY AFTER SPECIFICATION CORRECTIONS

The reconciled design is a coherent, small experiment. It resolves the six original conceptual contradictions and correctly separates F0/N0 control comparison from N0/N1 cart-opportunity comparison. It is **not yet an implementation contract that two independent implementers would reproduce identically**. Local corrections are needed for fixture geometry, source side effects, cart timing, trial boundaries, access-state behavior and study definitions. No broader redesign or additional projectile/condition is necessary.

Confidence: high in the source-backed gaps and static geometry findings; moderate in whether the proposed local corrections will produce a useful encounter. There are no prototype measurements or player results. This report proposes corrections; **it does not apply them**.

## Material and baseline

Read all eleven existing planning documents: [minimum specification](MINIMUM-EXPERIMENT-SPEC.md), [reconciliation log](REVIEW-RECONCILIATION-DECISION-LOG.md), [vision](REDESIGN-VISION.md), [research](COMPETITIVE-RESEARCH.md), [current audit](CURRENT-GAMEPLAY-AUDIT.md), [core](CORE-GAMEPLAY-DESIGN.md), [levels/progression](LEVEL-AND-PROGRESSION-DESIGN.md), [UX/accessibility](UX-AND-ACCESSIBILITY-DESIGN.md), [decisions](REDESIGN-DECISIONS.md), [validation](PROTOTYPE-AND-VALIDATION-PLAN.md), and the unchanged [independent review](INDEPENDENT-DESIGN-REVIEW-2026-11-17.md).

Authoritative implementation inspected: **4356ead15a5eb61693f33497515f0212cf01dd77**, using `git show <SHA>:path`. Local HEAD remains `codex` at `c0563e00611ba2288c26c22ffde4e6aacede1b6b`. The pinned object was available locally; no branch change, fetch or mutation was needed. This is not a fresh claim about the latest live remote or deployed artifact. Starting state was eleven untracked planning documents and no tracked/staged changes.

Principal pinned source references:

- [game.js: geometry and types](https://github.com/lfcfoundry/pineapple-defense/blob/4356ead15a5eb61693f33497515f0212cf01dd77/src/game.js#L9), [state creation](https://github.com/lfcfoundry/pineapple-defense/blob/4356ead15a5eb61693f33497515f0212cf01dd77/src/game.js#L185).
- [award/updateTable](https://github.com/lfcfoundry/pineapple-defense/blob/4356ead15a5eb61693f33497515f0212cf01dd77/src/game.js#L649), [guide](https://github.com/lfcfoundry/pineapple-defense/blob/4356ead15a5eb61693f33497515f0212cf01dd77/src/game.js#L736), [actor reactions](https://github.com/lfcfoundry/pineapple-defense/blob/4356ead15a5eb61693f33497515f0212cf01dd77/src/game.js#L795).
- [throwAt](https://github.com/lfcfoundry/pineapple-defense/blob/4356ead15a5eb61693f33497515f0212cf01dd77/src/game.js#L865), [landShot/updateShot](https://github.com/lfcfoundry/pineapple-defense/blob/4356ead15a5eb61693f33497515f0212cf01dd77/src/game.js#L926), [update phase order](https://github.com/lfcfoundry/pineapple-defense/blob/4356ead15a5eb61693f33497515f0212cf01dd77/src/game.js#L1151).
- [drawShot](https://github.com/lfcfoundry/pineapple-defense/blob/4356ead15a5eb61693f33497515f0212cf01dd77/src/game.js#L1299), [pouchPos](https://github.com/lfcfoundry/pineapple-defense/blob/4356ead15a5eb61693f33497515f0212cf01dd77/src/game.js#L1362), [frame/input](https://github.com/lfcfoundry/pineapple-defense/blob/4356ead15a5eb61693f33497515f0212cf01dd77/src/game.js#L2318), [pause/resume](https://github.com/lfcfoundry/pineapple-defense/blob/4356ead15a5eb61693f33497515f0212cf01dd77/src/game.js#L2480).
- [title.html: browser/CSS layout](https://github.com/lfcfoundry/pineapple-defense/blob/4356ead15a5eb61693f33497515f0212cf01dd77/src/title.html), [build-time inclusion](https://github.com/lfcfoundry/pineapple-defense/blob/4356ead15a5eb61693f33497515f0212cf01dd77/build.py#L36). Applicable AGENTS instructions were inspected.

## Answers to the nine questions

| Question | Finding |
|---|---|
| 1. Build without inventing gameplay rules? | **Not quite.** The main mechanics are specified, but trial lifecycle, disabled source systems, N access state and cart activation/stop boundaries still require choices. |
| 2. Distinguishable and reproducible conditions? | Distinguishable: yes. Reproducible: conditional on a complete reset/fixture manifest, a concrete study order and deterministic event rules. |
| 3. Faithful F0? | The required sampling, selection, prediction, endpoint and miss semantics match pinned source. Faithfulness is a qualification requirement, not an achieved result. Common harness exclusions need a precise boundary. |
| 4. N0 limited to intended control experience? | Broadly yes as a **control-contract bundle**, not a gesture-only treatment. Its coordinate-derived flight metadata, leading, continuation, legal area, origin animation and feedback must all be disclosed or pinned. |
| 5. N1 differs only by enabling cart/contact? | Nearly. Support highlighting, instruction, brake appearance and departing-actor rendering also need to be explicitly included or held common. All are local choices, not reasons for another arm. |
| 6. Collision/coordinates/cancellation/timing/reset/failure sufficiently defined? | Point plane, stationary aim, reload and no-power/no-ricochet rules are clear. Remaining boundary cases are listed below. Finger occlusion is a legitimate test question; it does not need a magnifier designed in advance. |
| 7. Metrics operational? | Some engineering events are directly measurable. Intent-error denominators, comprehension coding, preference instruments, transfer success and recovery currently admit subjective or vacuous passes. |
| 8. Input versus cart novelty? | The two contrasts support this distinction in principle. The proposed ordering/carryover must be repaired. Three repetitions can show continued immediate appeal, not eliminate novelty or establish retention. |
| 9. Decisions before implementation? | Adopt explicit corrections C1–C5 before coding the fixture. Adopt E1–E4 before using it for participant decisions; they are also required for an experiment-ready specification. |

## Implementation corrections

### C1 — Separate source fidelity from source side effects

**Exact location:** `MINIMUM-EXPERIMENT-SPEC.md`, §2 “Source and conditions,” §7 “Single defensive encounter,” §8 collision/update ordering; `CORE-GAMEPLAY-DESIGN.md`, “Fair original-flick comparison.”

“No trophy/pickup/reward” and “suppress overlays” are not equivalent instructions. In source, the first accepted throw calls `award(0)`, which queues a trophy. `updateTable` promotes that queue into `S.tro`; `tableHit` can consume a later pointerdown even if its drawing is suppressed. `S.puT` starts at 9 seconds and can create a pickup during an 18-second attempt. Source wave completion can award Cheer and start another wave unless the fixture intercepts it. Disabling real persistence does not prevent these changes.

**Smallest correction:** add a common harness-exclusion manifest: trophy award/collection, pickup generation/collection, bank rewards, scene taps, auto-spawn/wave advancement, helpers and achievement UI must be inert at their dependency/fixture boundaries, with their interactive state empty. Keep ordinary `hitPenguin` state transition/Cheer and the named F input/target/flight routines intact. Capture outcome before `waveClear`. Do not use `demo=true` as a shortcut: source demo handling can invoke its own behavior. Conformance should compare the preserved shot/control outputs while explicitly excluding these common research-fixture side effects. This makes “unchanged original control” precise without pretending it is an unchanged campaign.

### C2 — Repair the fixture's overlapping actors before attributing errors to input

**Exact location:** minimum specification §3 “One interaction plane” and §7 object table; validation “Before participant testing: qualification gates.”

The requirement to avoid overlapping silhouettes contradicts the three equal-depth rear actors at `xn=−0.18,0,+0.18`. At W=360, H=640 and p=0.50, the stated projection gives neighboring centers about **18.8 CSS px apart**, sprite size **62.6 px**, and each ordinary hit radius **34.5 px**. Thus silhouettes and hit disks overlap heavily. These are direct arithmetic consequences of the documents/source, not executed gameplay measurements.

This can obscure target identity, let a shot aimed at one actor resolve on another, and make “landing precision” or manual-leading conclusions misleading. Generous circles may also permit hitting a current moving-body position without appreciable leading; do not assume this encounter tests lead mastery merely because actors move.

**Smallest correction:** replace only the rear positions with a frozen, visibly separated arrangement in this same encounter, retaining source body sizes/radii. Adjust the rail/support placement only if necessary to keep the cart useful. Require a static projection/contact-region check at every nominated viewport, including support readability and the urgent actor's separation. Record the replacement numeric fixture before implementation rather than asking an implementer to invent a formation. Qualification can later tune timing once, as already allowed. If the geometry intentionally retains overlap instead, remove the contradictory instruction and stop using this fixture for individual-target precision claims.

### C3 — Specify cart activation, event placement and retirement

**Exact location:** minimum specification §8 “Support, cart and collision table,” especially the analytic trajectory and update-order paragraphs.

Source `update` advances `S.t`, resolves shots, then updates actors. A support can therefore be removed at the end of the current source time interval before the cart sweep runs. “Next shared simulation update” does not yet say whether that frame sweeps the newly released cart through the preceding interval. The formula also permits negative τ unless guarded. At the rail end, the text does not unequivocally say whether a stationary cart remains a send-home trigger for later walkers. Continuous contact time is computed, but placement of the struck actor and the start of its reaction animation are not defined.

**Smallest correction:** add a phase/timestamp contract:

- Preserve the source direct-shot processing bucket/order. Stamp a newly removed support at the current source interval's end `t1`; do not sweep that cart through `[t0,t1)`.
- On following intervals, sweep only the active intersection with `[releaseTime,stopTime]`; use nonnegative, clamped trajectory time. Handle actor boop crossings and exact contact/stop ties with a stated inclusive convention.
- Apply cart hits at their interpolated contact location. Define their new reaction timer once—for example, zero at that rendered frame end—rather than accidentally advancing a whole pre-contact dt. Keep ordinary source hit timing unchanged and identify this as cart response semantics.
- Resolve valid contacts at the rail-end instant, then disable the cart's contact trigger. It stays visibly parked at the padded stop and cannot collect later actors while stationary.

Also specify support boundary inclusion (recommend ≤ its visible radius) and a concrete numerical tie tolerance. The existing quadratic sweep is otherwise sufficiently bounded; no fixed-step engine or general impulse solver is needed.

### C4 — Supply a trial lifecycle/reset table, not just “restore the fixture”

**Exact location:** minimum specification §4 step 1, §7 termination/reset and §9 clocks; validation “Participants and sequence.”

The duration/skip behavior of the common startup countdown, eligibility of a press spanning GO, reset of hover buffers, and reset versus retention of `thr` are not completely specified. Source `halt` clears `hold`, not all drag/hover state; `newState` does not reset every input global or preference. The source's update loop can progress waves while the experiment waits for cosmetic departures. It is also unclear whether completion time includes reactions and whether extra launches during those reactions count as errors.

**Smallest correction:** define Preparing → Countdown → Active → Outcome → Reset, with a fixed countdown duration (e.g. three seconds), no shot input retained from before GO, and first-shot readiness at GO. Reset complete source-shaped actor state, actor/shot/effect lists, source simulation time, cooldown, cart/support, owned/captured pointers, `drag`, `hold`, hover samples/locks, N point and frame/EvenDt accumulator between attempts. Preserve only declared per-block settings and accepted-throw count `thr`; zero `thr` at block start, not every retry. Fix or record cosmetic appearance/seeds, and clear callbacks from the preceding attempt.

Stop scored input when the last walking actor leaves eligibility or active time reaches 18 seconds. Record defense completion time there; reactions may finish afterward without accepting scored shots or advancing a wave. Keep boop counts even if Cheer subsequently recovers. Name timeout, abort, resize and interruption exclusions, and keep excluded attempts in the safety/error record. A complete fixture-state table is a correction to reproducibility, not permission to repair F's within-trial pointer behavior.

### C5 — Finish the N input/access state contract

**Exact location:** minimum specification §3–§5 and §9; `UX-AND-ACCESSIBILITY-DESIGN.md`, “Touch, pointer and keyboard.”

Primary press/correct/release and release-induced capture-loss handling are clear. Missing details still change behavior:

- Is “blur” window blur or board focus moving to Fire? Cancelling on board blur would make keyboard Tab-to-Fire clear the very point it should launch.
- What point exists on initial keyboard focus, after Fire and after Cancel? How are held key repeats handled consistently?
- What happens to an owned press moving outside the aim area and back without entering Cancel? Where exactly is the Cancel hit region, including handed layout?
- N's origin uses `pouchPos`, whose `S.sa` tilt is driven by legacy `drag`. An implementer could drive it from correction displacement, from absolute bearing, or not at all. These are different origins/animations.

**Smallest correction:** publish one small state table. Suggested minimal choices: N has its own aim state, never populates legacy `drag`, and keeps `S.sa=0`; F retains source tilt. Keyboard focus creates a visible point at `(0.5W,0.70H)`; successful Fire retains it, Cancel clears it, and the next arrow reinitializes there before moving. Every Fire checks Active, not paused/countdown/over, ready, valid point and a single activation edge. Internal focus transfers among board/Fire/Cancel preserve the point; window/document loss or leaving the composite control cancels it. Specify owner-pointer-only cancellation, temporary outside/back movement, and an exact Cancel rectangle (a 48 px square at least 8 px above the aim region, mirrored horizontally, is sufficient). State whether OS key repeat is accepted and record its settings or give a fixed repeat rule.

Do not add a magnifier, relative pad or another control candidate. Their absence is intentional; occlusion/comfort are measured risks.

## Experimental-validity corrections

### E1 — Resolve the block-order contradiction and exposure carryover

**Exact location:** `PROTOTYPE-AND-VALIDATION-PLAN.md`, “Participants and sequence,” steps 1–4, and “Decisions after evidence.”

Step 2 scores both F0/N0 before N1, but step 3 places N1 before scored N0 for half the sample. The latter contaminates those participants' N0 baseline with cart learning, expectations and extra N practice. N0 can feel intentionally impoverished after the active cart. It also conflicts with the stated rule that N0 must earn selection before cart excitement rescues it.

**Smallest correction:** make the schedule explicit. Complete and record the primary F0/N0 comparison before any N1 exposure, counterbalancing F0/N0 order. Then run a separate N0/N1 pair in counterbalanced order using the already-defined conditions; repeating an N0 block adds no new game system. Lock the primary input judgment before this second stage. Report later preferences separately. If the extra block is deliberately omitted to reduce burden, keep N1 last for everyone and identify cart-order/practice as an unresolved limitation; do not claim that order was counterbalanced. Choose one schedule, not both instructions.

### E2 — State the complete N0/N1 treatment and transfer feedback

**Exact location:** minimum specification §6, §8 departing-actor row and §10; validation sequence step 4 and its causal-understanding gate; UX “Instruction and comprehension.”

N1 adds not just contact: it adds the support outline, brake removal and explicit support instruction. These are reasonable, but should appear in the treatment manifest. Transfer says “no support highlight,” while the normative preview requires an outline whenever the point is inside the active support. Either implementation is defensible under the current wording. Departing opacity reduction is also not assigned unambiguously to all direct/cart hits or only N1.

**Smallest correction:** keep the contact outline unchanged across all N1 trials, and define “no highlight” as removal only of instructional arrows/text/emphasis. This preserves the new control across transfer. Test causal understanding through a pre-contact prediction/explanation without a teaching label, not by silently disabling normal feedback. Keep source actor opacity/reactions common across all arms and clear shared contact markers when walking eligibility ends; remove the additional opacity instruction unless applied explicitly and identically to every actor departure in every arm. List outline/instruction/brake cue as necessary opportunity-feedback confounds. None supports a claim of a pure physics effect.

### E3 — Repair the recovery gate: mere completion can happen without playing

**Exact location:** minimum specification §7 success/failure; validation gate “Recoverability and fairness”; levels/progression “One encounter, one timing-transfer preset.”

All four actors can boop and depart while the player does nothing. Four normal boops cost 48 Cheer, leaving 52 from 100. The rear actors in B reach the stand after `(0.95−0.27)/0.10=6.8` seconds, then their source boop/departure finishes roughly 2.5 seconds later—well inside the 18-second timeout. Therefore “finish after two poor shots” can pass through passive failure. Completion is a legitimate trial lifecycle outcome, but not a playability/recovery success.

**Smallest correction:** retain completion-with-mistakes as an outcome category, but use **clean defense after two declared early misses** as preset A's recovery qualification and sampled human recovery criterion. If one boop is intentionally acceptable, set that threshold explicitly and require actual send-homes; never use completion alone. Predefine the two miss injection times/positions and ensure the reference/new inputs face equivalent deadlines. Do not coach only N into the recovery route. Preserve the no-permanent-loss rule separately.

### E4 — Operationalize the measures and freeze participant/device definitions

**Exact location:** validation “Participants and sequence,” “Measures and proposed acceptance gates” and “Distinguishing input, understanding, learning and novelty.”

Engineering endpoint/latency/sweep measures are mostly concrete. Several decision gates remain open to retrospective interpretation: intent-related failures, “no consistent subgroup regression,” “understand,” “appropriately,” “reasons agree,” “broadly agrees,” optional recovery sampling and the primary error-rate denominator. The planned instruction limit is not an actual fixed script. A 30% reduction in raw error counts is not comparable if one condition produces many more attempts.

**Smallest correction:** add a one-page analysis/instrument appendix before collecting results:

| Measure | Minimum operational definition |
|---|---|
| Intent/reliability | Event codes for launch accepted, early rejection, invalid gesture, wrong endpoint/actor, accidental launch and intentional cancellation. Unknown intent is marked unknown and reported, not inferred into a favorable category. Report launch success and cancellation safety separately so repeated cancellation cannot inflate reliability. |
| Comparative improvement | Define relative reduction of comparable error **rates**, not raw counts; use paired participant results, fixed scored attempts and explicit treatment of missing intent/noncompleters. Retain the minimum-event safeguard. |
| Point error | Record the intended screen point and its timestamp independently of the actual reticle, then actual endpoint; fix which target/time defines diameter. Reticle-to-endpoint tests are engineering checks, not human precision evidence. |
| Understanding | Fixed questions plus a checklist: coordinate stays fixed, actor can move, transit is noncolliding, support can be intercepted at landing; support→cart→send-home explanation. Record each item and unprompted versus prompted answers. |
| Satisfaction/control | Exact five-point questions with anchors, timing after equal scored exposure, and a separate forced preference/“no preference” response. Qualitative reasons explain the data; they are not an undisclosed veto chosen after seeing preference counts. |
| Skill/transfer | Freeze what counts as urgency-priority change and useful release timing for each qualified preset. Separate first B attempt from feedback-assisted second B improvement; either can be reported, but they are different evidence. |
| Access | Name A as the mandatory access task unless B is deliberately included. Define practice allowance and completion quality; do not pass access through four automatic boops. State which input adaptations are separate cohorts. |
| Performance/stability | Name the nominated modest device/viewport/browser before testing, foreground sample boundaries, treatment of paused/aborted frames, and independent collision oracle/tie tolerance. Record actual input receipt and painted frame times, not a claimed photon measurement. |

Fix the intended age band, child count, input cohorts, neutral instruction scripts and exclusion rules. Small formative counts remain useful screening gates, not population estimates. “No consistent subgroup regression” needs a predeclared rule or must remain a qualitative escalation flag rather than a claimed numerical pass.

## Fidelity and confound assessment after these corrections

F0's required mechanics match source: 0.42 s Classic reload, source eligibility/sample fallback, 0.4-size ray corridor and score, predictive selected-target endpoint/time, speed-based no-target branch, ordinary normalized endpoint radius, first-five guide, desktop hover throw and soft miss continuation. Preserve these even when they favor F0. Function names alone are not conformance evidence: include origin/pouch state and trace outputs, not merely whether a launch occurred. Nothing in this audit recommends disabling F selection.

N0 is intentionally a different complete control contract. Its coordinate-derived `pEnd` can differ from F's target depth even for similar body-center endpoints; that changes T, sprite scale and shadow metadata through source `drawShot`. The formulas are specified, so this is not an unresolved power rule, but “same Classic flight” should mean same rendering/collision family, **not identical travel time or size for an equivalent intended actor**. Add that explicit confound to specification §11/validation's comparison table, and keep N0/N1 identical in those parameters. Do not modify F to equalize them.

The three arms can distinguish immediate input-bundle usability from the extra cart opportunity once ordering is fixed. They cannot isolate finger motion from feedback/leading, disentangle cart spectacle completely from useful multi-target efficiency, establish long-term retention, prove an engine is needed, or validate a full physics campaign. These are legitimate limits, not reasons to enlarge the first experiment.

## What is already sufficiently decided

Keep the single screen contact plane; stationary release; no aim freeze; live source cooldown; no Gentle/Firm; no ricochet; endpoint-only pineapple transit; a single constrained cart; no new runtime dependency; in-memory save isolation; source pin and raw-trace qualification. Do not reopen those to solve the local gaps above. No additional environment, projectile or progression work is required.

Real prototype/player uncertainties remain: whether the corrected fixture supports the intended priority reversal, finger occlusion and accidental stationary shots, young-player understanding of landing points, preference after repetition, actual device cost and access. Do not demand enjoyment proof before a prototype; do demand fixed rules and measurable outcomes before attributing its results.

## Required disposition and preserved work

Before implementation authorization, correct C1–C5 and record the exact fixture/state/phase choices in the minimum specification, with matching core/UX/log changes where indicated. Before participant decisions, resolve E1–E4 in validation and cross-referenced sections. These are proposed edits only; every existing document remains unchanged by this audit.

Exact file created: `planning/redesign/FINAL-EXPERIMENT-READINESS-AUDIT.md`. No application source, HTML, asset, test, save, dependency, build configuration or existing document was modified. No prototype, build, benchmark or QA execution occurred; no branch/ref/index mutation, commit, push or publication was performed. Pre-existing untracked planning work was preserved.
