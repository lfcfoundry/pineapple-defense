# Independent-review reconciliation — decision log

R2 history + R3 readiness corrections · 2026-11-17 · **Design decisions, not validation results.** Required input: [INDEPENDENT-DESIGN-REVIEW-2026-11-17.md](INDEPENDENT-DESIGN-REVIEW-2026-11-17.md), preserved unchanged. This log explains substantive revisions to all eight documents. It does not append objections while leaving contradictory R1 rules active.

## R2 authority and process (historical revision record)

The source remains `4356ead15a5eb61693f33497515f0212cf01dd77`. Git inspection found HEAD on stale `codex` at `c0563e00611ba2288c26c22ffde4e6aacede1b6b`, empty tracked/staged diffs and nine untracked planning Markdown files. No branch/ref/worktree operation was needed; pinned source objects were read safely. Only the eight authorized documents are revised, and this log plus [MINIMUM-EXPERIMENT-SPEC.md](MINIMUM-EXPERIMENT-SPEC.md) are added. The review and all other existing work are preserved.

The minimum specification is the only first-experiment implementation authority. Core/UX/progression explain implications, and validation defines the research gates. Existing audit facts and the outside-source ledger remain evidence, not validated predictions. Historical R1 rules discussed in the review are not instructions to implement them.

## R2-01 — Endpoint targeting and depth ambiguity

**Review input:** finding 1 identified contradictory landing/body/surface semantics and no way to lead at the correct height on empty board.

**Chosen rule:** N selects one canvas-local screen coordinate. Existing body-center hit geometry is retained for the comparison, with a small visible contact marker. No frontmost-surface pick, nearest actor score, object height, inverse 3D ray or selectable z. Endpoint does not change because an actor passes underneath it. Leading on empty board uses exactly the same rule.

**Alternatives considered:** (a) R1 surface picking plus outlines; rejected because visibility alone does not prevent discontinuities. (b) A physical ground point with feet proxies, suggested by the review; useful future candidate, but rejected for this experiment because changing F's hit plane would corrupt the original baseline. (c) A new flatter camera and general 3D solver; deferred as another major intervention.

**Rationale:** one stable meaning and a faithful comparison outrank visual sophistication. The term “screen contact plane” is explicit; this is not claimed to be a fully physical ground model.

**Consequences:** keep old airborne transit/endpoints; a projectile can visually cross an actor without contacting until landing. N can lead without switching surfaces, but loses original automatic leading. Minimum feedback is an endpoint ring, not a full swept-flight prediction. This narrows what a successful prototype can justify.

**Remaining empirical uncertainty:** can children understand the point/landing convention, tolerate transit overlaps and lead moving actors without hidden help? If not, the next design must revisit projection/collision explicitly rather than changing one condition silently.

## R2-02 — Stationary correctly placed aim

**Review input:** finding 2 showed that the mandatory 8 px excursion rejected a press exactly on the desired point, even after correction back.

**Chosen rule:** press previews, optional drag corrects, release fires at the latest point if ready. Stationary release and returning to the initial point are valid. No arming distance, hold timeout, speed threshold or disarm-on-return. Cancellation has an explicit region and interruption rules; it is not inferred from the aim distance.

**Alternatives:** keep the 8 px rule and explain it; rejected as teaching a workaround to a design error. Relative thumb pad; deferred because reach/recentering was incomplete and not needed for the first comparison. Tap-only without correction; not the primary candidate because it prevents correction, although an explicit non-hold latch/Fire adaptation remains for access.

**Rationale:** correct placement should succeed without an extra movement grammar. One pointer and clear cancel are smaller than multiple arming states.

**Consequences:** a resting press/release can launch, so accidental shots must be measured. No speed/precision gesture is required in N. Its input differs intentionally from F, whose original flick thresholds and desktop hover remain intact.

**Uncertainty:** accidental launches, finger occlusion and reach on small/short layouts require real players/devices. A failed result may justify a specific adaptation; it does not authorize adding every R1 control mode.

## R2-03 — Reload and planning

**Review input:** finding 3 exposed an indefinite hold during which Plan froze the reload that the player was waiting to complete.

**Chosen rule:** Classic reload remains source 0.42 s in every arm. Aim and latched point never freeze/defer clocks. Preview during reload is allowed; release while early is rejected, with no buffer. **No aim-triggered Plan mode in the first experiment.** Separate explicit Pause freezes all clocks, clears pending N aim and resumes through the source countdown.

**Alternatives:** ready-only frozen Plan, as suggested by the review; coherent but deferred to avoid adding a second gameplay-clock variable. Freeze only threats while reload advances; rejected as violating the stated all-clocks freeze and changing cadence incentives. Queue every early release; rejected because it adds delayed commitment and changes the original baseline.

**Rationale:** the smallest fair live-defense test needs no planning state. It must reveal whether point correction under actual threat pressure works, rather than conceal a failure through extra time.

**Consequences:** no deadlock and no auto-firing queued point. N's reload cue may improve perceived control independently of gesture mapping; report that bundle confound. A user can rest through ordinary Pause, but pausing never charges a shot or preserves pending N fire.

**Uncertainty:** live pressure may be unpleasant or inaccessible for some participants. Failure reopens deliberate artillery/tactical defense or a later explicit planning experiment; it does not establish that those players need more dexterity training.

## R2-04 — Gentle/Firm and impact force

**Review input:** finding 4 showed that shortening T did not monotonically increase impact speed; “Gentle” could have greater total speed than “Firm.” Endpoint aim did not supply independent power anyway.

**Chosen rule:** remove Gentle/Firm and all user-adjustable force/energy. N controls direction and intended range through P. Source-like timing/arc is automatic; Classic outcome strength is binary. Support release does not depend on mass, speed or hit angle. Cart rollout is a prescribed rail trajectory, not an impulse derived from the projectile.

**Alternatives:** rename the switch Low/High arc; deferred until an encounter demonstrably needs arc choice. Rebuild an energy-conserving ballistic solver or add a power slider; rejected for this experiment because it changes both gesture and simulation. Pullback speed/range remains a possible future candidate, not another first-prototype requirement.

**Rationale:** no power decision is better than misleading power semantics. A simple action can have timing/spatial mastery without analog energy control.

**Consequences:** no power-meter UI, no power-predictability metric, no “hard hit” score or destructive energy threshold. Ordinary direct hits and support hits are understandable one-contact events. No claim of independently adjustable direction/power is made for N.

**Uncertainty:** a later richer game might benefit from differentiated arcs or energy, but the first test cannot establish that. Do not import that requirement from Royal Smash marketing.

## R2-05 — Classic retirement, ricochets and physical contact

**Review input:** finding 5 found a Classic that retired on contact while later levels/preview expected it to bounce; actor mass and cart contact budgets were undefined.

**Chosen rule:** no ricochet, bumper, penetration or subsequent damaging pineapple contact after a successful landing. Keep F's original soft-shot miss continuation exactly; label it a miss continuation, not a bounce. All arms keep ordinary endpoint collision. In N1, an otherwise empty landing may remove the support; cart contact alone then sends eligible actors home along the rail. Cart stops at its visible padded endpoint, never after an invisible three-hit budget.

**Alternatives:** special-case bumper survival; rejected because there is no bumper in the one-encounter experiment. Swept projectile collision everywhere; deferred because it would change F's flight/collision response and confound control selection. Full impulse/rigid-body actors; rejected as unnecessary for one constrained toy.

**Rationale:** a complete small object-pair table is better than a broad claim of physical accuracy with exceptions. The initial causal sequence is landing → support removed → prescribed cart roll → actor reaction, not a chain engine.

**Consequences:** static support puffs away without debris. Cart is the sole continuously swept interaction, with exact contact ordering and no extra reward. General physics/first-airborne-contact conclusions remain outside the experiment's scope. Extra shots while the cart moves stay legal, so a demonstration cannot force the player to watch.

**Uncertainty:** the authored cart might feel too automatic or endpoint transit too artificial. The correct response is evidence-driven rejection or a separate collision-model study, not undisclosed physics improvements during the comparison.

## R2-06 — Fair unchanged-original comparison

**Review input:** finding 6 showed that removing hidden selection from a “current flick adapter” changed the original target/range semantics.

**Chosen rule:** F0 retains original recent-segment sampling, thresholds, hover throw, 0.4-size candidate corridor/scoring, target prediction, target/no-target speed branches, flight timing, guide, normal collision, miss continuation and cooldown. Same authored encounter/configuration is used for N0 with props braked. N1 then enables the support/cart with N0 input unchanged. The support/cart is never inserted into F0's target candidate list.

**Alternatives:** weaken F by disabling selection for identical physics; rejected as a false baseline. Compare only F0 against a new interactive playground; rejected because physics novelty could mask worse control. Follow the review's D/S comparison with an intact reference; deferred because this task requires the original flick versus proposed control and the first implementation should contain only one new model.

**Rationale:** preserve the thing being replaced, including its genuine accessibility benefit from prediction. Separate input-bundle and added-opportunity comparisons rather than claim impossible perfect experimental equivalence.

**Consequences/confounds:** F0/N0 changes automatic leading, release grammar, miss continuation, legal start/aim region and minimum feedback along with mapping. Report a control-contract result, not a gesture-only causal effect. F0 is unchanged shot/control behavior on a common test fixture, not the unmodified campaign. N0/N1 changes brake cue, cart animation and opportunity/efficiency; it cannot prove a need for a numerical physics engine. Future raw-trace equivalence qualification against pinned source is mandatory before player results count.

**Uncertainty:** N may improve point placement but worsen moving-target performance, especially for children. Only testing can select it. Cart appeal may disappear after repetition; repeated/transfer attempts and optional replay reduce but cannot eliminate novelty as an explanation.

## Other required review changes

| Review finding | R2 response |
|---|---|
| Complexity/incentives/credit (7) | One fruit/support/cart; no helper, chain reward, upgrade, special or hit-count budget. Direct defense without active props becomes a serious competing direction. No currency-gated comfort. |
| Camera/solver cost (8) | Retain the source contact plane and frame timing; no surface picker, full-world trajectory clone, hinges/stacks or 120 Hz engine mandate. Only one analytic rail sweep is new. Test physical readability rather than claim it. |
| Progression/migration (9) | Withdraw campaign/Champion/economy redesign from implementation scope. Preserve application ownership and saves; fixture never reads/writes real progress. Migration remains later design work. |
| Unsupported selection confidence | Withdraw B's “strongest” status. Historical matrix scores stay descriptive, not an evidence gate. Input can pass while the cart fails. |
| Long study and novelty | R2 reduced the battery; R3 below supersedes its contradictory block-order wording with a primary pair followed by a separate counterbalanced cart pair. |
| Research overreach | Preserve evidence ledger and direct-observation gaps; downgrade conclusions. No new external observation or player result was obtained by editing documents. |

## R2 changed files and authority (historical)

Revised: `REDESIGN-VISION.md`, `COMPETITIVE-RESEARCH.md`, `CURRENT-GAMEPLAY-AUDIT.md`, `CORE-GAMEPLAY-DESIGN.md`, `LEVEL-AND-PROGRESSION-DESIGN.md`, `UX-AND-ACCESSIBILITY-DESIGN.md`, `REDESIGN-DECISIONS.md`, `PROTOTYPE-AND-VALIDATION-PLAN.md`.

Created: this decision log and `MINIMUM-EXPERIMENT-SPEC.md`. The independent review is unchanged. The audit's original closeout is marked historical rather than rewriting past actions. All disputed active R1 rules are replaced or explicitly deferred; the minimum specification prevails for implementation scope and exact parameters.

Remaining empirical questions are in the spec/validation, not silently delegated design decisions. No application source, built HTML, assets, test, build configuration, dependency, save or Git ref has been changed. No prototype, build, test, commit, push or publication was performed. This reconciliation makes a reviewable experiment specification; it does not claim that it is enjoyable or validated.

## R3 — Readiness-audit corrections (2026-11-17)

Required authority: [FINAL-EXPERIMENT-READINESS-AUDIT.md](FINAL-EXPERIMENT-READINESS-AUDIT.md), preserved unchanged as a report on pre-R3 documents. These are specification decisions, **not prototype/player evidence or implementation approval**. R2 closeout above describes that earlier edit, not this pass. The normative experiment remains spec R3 plus the validation procedure; historical review recommendations for pullback/Plan and their past verdicts do not reinstate rejected mechanics.

| Finding | Chosen minimal correction / exact authority | Alternatives, rationale and consequences |
|---|---|---|
| C1 source side effects | Spec §2 dependency exclusion manifest; core fair-comparison boundary | Hiding rewards alone leaves input-consuming state. Disable shared trophy/pickup/scene/reward/advance/helper dependencies, preserve F parser/target/flight/hit/Cheer. Demo shortcut rejected. F0 is an authentic control on a common fixture, not a campaign clone. |
| C2 overlapping geometry | Spec §7 rear xn −0.96,−0.28,+0.40; support x .08W, support/rail y from p .67 | Replace only formation/support placement needed for visibility; keep source sizes/radii, four actors and cart x/speed. Shrinking colliders or tolerating initial overlap would invalidate precision attribution. Static arithmetic is not gameplay qualification; all nominated layouts still require future static/render qualification and direct-route checks. |
| C3 cart event timing | Spec §8 release at t1, first sweep next interval; clamp time; inclusive boop/stop ties and numeric tolerances; interpolate hit position, zero new reaction timer at frame end; parked trigger retires | Back-sweeping release or leaving a stationary trigger rewards impossible/unshown contact. Direct source bucket wins unchanged. No engine or timestep replacement. |
| C4 reset/lifecycle | Spec §9 Preparing→3 s Countdown→Active→Outcome→Reset with full state manifest | Resetting only source newState/halt leaks globals. Preserve thr only within block; no pre-GO input or callbacks cross trials. Score ends on no walkers/quantized timeout, before cosmetics/waveClear. Interruptions retained and excluded explicitly; normal mistakes stay valid. |
| C5 N access state | Spec §4 event table; UX | Choose independent N aim/neutral tilt, exact mirrored Cancel, outside/back correction, composite-focus preservation, fixed arrow repeat, defined point retention and Fire deduplication. Avoids implementer-invented origins/focus rules without new aiming models. Occlusion remains empirical. |
| E1 study order | Validation participants/order table | Choose the audit’s separate repeated-N0 pair: all primary F0/N0 before any N1; then counterbalance N0/N1 independently. Reject N1-before-primary and uncounterbalanced N1-last shortcut. Extra repeated block adds exposure/burden, reported; allow split sessions. |
| E2 feedback/treatment | Spec §§6/8/11, UX, validation | Keep normal support outline on transfer; remove teaching emphasis only. Delete extra opacity rule; source reactions common. Outline/instruction/brake and cart opportunity are disclosed N1 treatment, not pure physics. |
| E3 recovery | Spec §§7/9, levels, validation | Choose clean defense after two declared misses, not one-boop allowance or passive completion. Fixed injected misses at .10/.60 s (source-bucket quantization recorded), same endpoints/deadlines, braked props; probe is post-miss-state evidence, excluded from input rates. Authentic F trace feasibility is a qualification gate, never a targeting bypass. |
| E4 instruments | Validation fixed instruments, gate table and device manifest | Fix denominators, unknown/missing data, paired rates, age/cohorts/scripts, independent intended point, five-item understanding checklist, anchored ratings, replay count, first-B transfer and separate second-B improvement. Subgroup dissent escalates rather than being averaged away. Hardware identity must be recorded before future shakedown; no measurements invented. |
| Fidelity/confounds | Spec §11, core and validation | Same rendering family does not imply equal T/scale/shadow for equivalent intended actor; disclose N point-derived metadata and neutral origin vs F target-derived values/tilt. Never modify F to equalize. |

### R3 verification and remaining uncertainty

Documentation inspection maps every C1–C5/E1–E4 item above to an active rule. Static projection arithmetic at the four nominated sizes/both presets gives positive initial separation: minimum actor-disk gap 1.24 CSS px, rectangle-axis gap 4.56 px and support-to-actor-disk gap 4.94 px. These are document-equation calculations only, not rendered inspection, executed game tests or qualification results. F0 alone retains authentic target selection/prediction/guide/miss continuation/hover. N0 changes control/necessary feedback on braked props; N1 holds all N input/shot rules fixed and enables only the specified support/cart opportunity and disclosed cues. Exactly three conditions, one Classic type/support/cart/encounter remain. The primary and cart-stage count/rating comparisons cannot substitute for each other.

Unresolved empirical questions: actual silhouette/readability on devices; qualification of direct routes, F miss traces, safe timing/reversal and recovery margins; finger occlusion/stationary accidental shots; comprehension/manual leading; preference after repetition; access and measured device stability. The one allowed pre-study fixture tuning pass must be documented before implementation of any replacement and frozen before participants. Failure may reject the encounter; it never authorizes more objects/controls or weakening F. No design is claimed validated.

This pass modifies only minimum spec, validation, core, UX, levels, the vision’s rendering-family wording and this log. Decisions, research, current-source audit, independent review and final-readiness audit remain unchanged. No new file is created. No application/HTML/assets/tests/builds/prototype/dependencies/saves or Git mutations are authorized or performed.
