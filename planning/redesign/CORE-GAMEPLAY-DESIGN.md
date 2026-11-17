# Core gameplay design — reconciled R2

2026-11-17 · Documentation only. [MINIMUM-EXPERIMENT-SPEC.md](MINIMUM-EXPERIMENT-SPEC.md) owns every first-experiment parameter, condition and collision rule. This file explains the chosen design contract and supersedes R1's multi-profile ballistic playground specification. [Decision log](REVIEW-RECONCILIATION-DECISION-LOG.md) records alternatives and uncertainties for all six priority decisions.

## The core loop to test

Read the four approaching penguins → choose direct rescue or timed setup → perform the selected control → observe landing → if released, observe one cart crossing → reassess the remaining threat. Shots remain legal while the cart moves. No extra reward or forced watch period manufactures a payoff.

The experiment has one projectile type, one support structure, one cart and one defensive encounter with a timing-transfer preset. It does not need varied ammunition, materials, environmental stages, upgrades or generalized chain reactions to answer whether that loop is worth developing.

## World and camera

The new control identifies a canvas-local screen point. Moving over a body, an empty part of the board or the support never changes the point's meaning. There is no surface picking, target-priority lookup, selectable height, inverse 3D ray or inferred body/ground switching. Existing `penCenter` coordinates remain the comparison's hit plane; visible contact markers explain them.

This is deliberately a screen landing board, not a claim of full physical ground projection. Replacing the original game's collision plane with a new world-height model would change the original comparison. The new point's x/y are stored directly and remain fixed after release. Moving targets can leave that point. Leading on empty board is possible because empty board and bodies share the same point semantics.

The exact legal aim area, flight-time mapping and screen arc are in the specification. Range is spatial placement. Direction is sling-to-point. Gesture velocity/length is irrelevant in the new control. No independent power is exposed or claimed.

## Arming, dead zone and release

Primary press previews, optional drag corrects, release fires if ready. Stationary press/release and moving out then correcting back to the start are valid. No arming threshold or dead zone makes a correctly placed point fail. Explicit Cancel or an interruption cancels without cost. No relative thumb pad or magnifier is assumed; occlusion must be measured before another control layer is added.

An explicitly selected non-hold adaptation latches that same coordinate and uses Fire; keyboard operates the same point. Neither adaptation creates time-free planning. These access routes are reported separately from the primary touch/mouse comparison.

## Reload and commitment

Use original Classic reload, 0.42 s, in all conditions. Aiming/correcting never pauses it. A shot can be previewed during reload; a ready release fires, an early release is rejected. No early-shot queue or hold-repeat in the experiment. N communicates reload, while F retains its source response; this is a disclosed feedback difference.

There is **no aim-triggered Plan mode**. Separate explicit Pause freezes all clocks, clears the new pending aim and resumes through the original countdown. Thus neither holding a point nor latching Fire can indefinitely freeze readiness. Ready-only planning was considered but deferred because it adds a second experimental control variable and may conceal whether live defense is usable.

## Launch calculation

Gentle/Firm is removed. Its old flight-time multipliers were not a monotonic impact-force control: a longer/high arc could have greater impact speed. Renaming it would not cure that problem.

Classic now has one outcome rule in the experiment: one eligible landing sends a basic penguin home, or removes the support in the interactive condition. No mass, kinetic-energy threshold, damage multiplier or angle-dependent strength governs that result. The cart begins a prescribed roll along a fixed, visible rail after support release. This is a designed constraint, not a hidden impulse approximation.

## Flight and first contact

For comparability, both inputs retain source airborne drawing and ordinary **endpoint** hit resolution. Airborne visual overlaps do not collide. A true swept-flight preview would promise a mechanic absent from the original group; neither arm gets one.

The new endpoint ring says where the pineapple lands. It can outline the static support region but cannot promise a hit on a moving penguin. Ordinary penguins have priority if one occupies the endpoint at landing. No future-world simulation, moving-target lead marker or whole-cart prediction is provided. This is the first eligible-contact preview's explicit limit. A transit-through-sprites readability failure is a reason to reject or redesign the next experiment, not to patch one condition secretly.

## Projectile and prop vocabulary

Classic retires after a successful landing. There is no ricochet, bumper, penetration or additional damaging pineapple contact. Preserve the original flick's soft-shot miss continuation exactly: an acquired target disappearing can cause the original one-time extension. That is an existing missed-shot behavior, not a bounce; N has no target acquisition and therefore no such continuation.

The one support puffs away and never becomes colliding debris. The cart starts once, follows its visible rail, sends intersected walking actors home, and stops at a visible padded rail end. It does not stop after an invisible hit count and cannot start another prop chain. Further player hits cannot push, bounce or accelerate it. Actor hit eligibility is separate from cosmetic departing motion, shown through a cleared marker; source opacity/reactions remain common across arms.

The specification's object-pair table and phase ordering are required: release stamped at interval end, first sweep next interval, inclusive stop contacts then permanent trigger retirement. Cart reactions start at interpolated contact with zero timer at frame end. A general impulse equation, unconstrained bodies, hinges, stacks and arbitrary support graphs are not necessary or authorized experiment scope.

## Fair original-flick comparison

F0 retains the pinned pointer sampling, eligibility, hover throw, 0.4-size candidate corridor, candidate scoring, launch-time target prediction, target-dependent flight-time/range branch, miss mapping and original guide. It is not a velocity-only adapter. Source default comfort configuration is documented in the spec and held consistently; helpers are absent through the common fixture, not deleted from targeting code.

Spec §2 disables trophy/pickup/scene/reward/advance/helper dependencies in all arms with empty interactive state; invisible overlays or demo mode are insufficient. Preserve ordinary hit/Cheer and F outputs including pouch tilt. N has separate point state and neutral tilt; point-derived time/scale/shadow may differ from F target-derived metadata. These are disclosed bundle differences.

F0 versus N0 compares complete control contracts with the same inactive cart fixture and ordinary impacts. N0 versus N1 enables the only new causal opportunity with N unchanged. The new marker, stationary release, lack of automatic leading and bounded aim area are part of the input bundle; no result may be described as a pure gesture-only effect.

## Browser-first simulation budget

Keep the existing browser Canvas rendering, source frame timing and offline/single-file constraints. One analytic rail trajectory and swept cart/actor checks need no general physics dependency. Shared frame timing avoids silently changing the reference's update behavior. Compare identical dt/input streams; report the existing endpoint-time quantization across refresh schedules rather than promising bit-identical cross-browser simulation.

No save/progression writes, dependencies, native APIs, telemetry or network. Performance, causality, controllability and repeated appeal must pass validation before any full playground or additional projectile role is reconsidered.
