# Independent adversarial design review — Pineapple Defense

2026-11-17 · Documentation only · Fresh critical analysis of the proposal, not independent player testing or an external review panel. None of the eight reviewed documents was edited.

## Verdict and confidence

**Promising hypothesis; reject the full specification as prototype-ready.** A small physics-assisted defense game is worth testing. The documents do not establish that the full physics defense playground is stronger than simpler defense with dependable aiming, authored formations and one reliable environmental toy.

Confidence is **high** in the source-backed diagnosis and the internal contradictions below, **moderate** in the feasibility of a constrained cart/support experiment, and **low** in any predicted enjoyment or campaign superiority without play evidence. The recommendation is to resolve the first five findings below, then test a reduced loop. Do not approve the entire roster, solver or progression redesign on the strength of the decision matrix.

## Material examined and review boundary

All eight files were read in full:

| Document | Main review concern |
|---|---|
| [REDESIGN-VISION.md](REDESIGN-VISION.md) | Whether the defended stand and causal shot provide a distinctive repeatable experience |
| [COMPETITIVE-RESEARCH.md](COMPETITIVE-RESEARCH.md) | Evidence versus interpretation; acknowledged absence of direct Royal Smash observation |
| [CURRENT-GAMEPLAY-AUDIT.md](CURRENT-GAMEPLAY-AUDIT.md) | Accuracy against application source, not its own asserted authority |
| [CORE-GAMEPLAY-DESIGN.md](CORE-GAMEPLAY-DESIGN.md) | Input, launch equations, collision rules and simulation scope |
| [LEVEL-AND-PROGRESSION-DESIGN.md](LEVEL-AND-PROGRESSION-DESIGN.md) | Incentives, curriculum, identity and migration |
| [UX-AND-ACCESSIBILITY-DESIGN.md](UX-AND-ACCESSIBILITY-DESIGN.md) | Reachability, correction, activation and assistance interactions |
| [REDESIGN-DECISIONS.md](REDESIGN-DECISIONS.md) | Alternative selection and unsupported scoring advantages |
| [PROTOTYPE-AND-VALIDATION-PLAN.md](PROTOTYPE-AND-VALIDATION-PLAN.md) | Comparison validity, participant burden and rejection criteria |

Application source was independently inspected through `git show 4356ead15a5eb61693f33497515f0212cf01dd77:path`. That exact object is available locally; no fetch or checkout change was necessary. This review uses the **user-designated remote-main commit**, not an assertion about the latest live remote or deployed Pages artifact. Local HEAD remains `codex` at `c0563e00611ba2288c26c22ffde4e6aacede1b6b`. Initial state was empty tracked/staged diffs plus the untracked `planning/` directory.

Source anchors, all pinned to that SHA:

- [game.js: input and frame loop](https://github.com/lfcfoundry/pineapple-defense/blob/4356ead15a5eb61693f33497515f0212cf01dd77/src/game.js#L2318): actual sampling, hover throw, Tap/hold and clock.
- [game.js: throwAt and impact](https://github.com/lfcfoundry/pineapple-defense/blob/4356ead15a5eb61693f33497515f0212cf01dd77/src/game.js#L865): corridor selection, prediction and endpoint resolution; [guide](https://github.com/lfcfoundry/pineapple-defense/blob/4356ead15a5eb61693f33497515f0212cf01dd77/src/game.js#L736) and [flight drawing](https://github.com/lfcfoundry/pineapple-defense/blob/4356ead15a5eb61693f33497515f0212cf01dd77/src/game.js#L1299).
- [game.js: layout](https://github.com/lfcfoundry/pineapple-defense/blob/4356ead15a5eb61693f33497515f0212cf01dd77/src/game.js#L445), [update order](https://github.com/lfcfoundry/pineapple-defense/blob/4356ead15a5eb61693f33497515f0212cf01dd77/src/game.js#L1151), [draw order](https://github.com/lfcfoundry/pineapple-defense/blob/4356ead15a5eb61693f33497515f0212cf01dd77/src/game.js#L1638), [checkpoint](https://github.com/lfcfoundry/pineapple-defense/blob/4356ead15a5eb61693f33497515f0212cf01dd77/src/game.js#L2490), [shop](https://github.com/lfcfoundry/pineapple-defense/blob/4356ead15a5eb61693f33497515f0212cf01dd77/src/game.js#L2679) and [Roll solver](https://github.com/lfcfoundry/pineapple-defense/blob/4356ead15a5eb61693f33497515f0212cf01dd77/src/game.js#L1766).
- [extras.js](https://github.com/lfcfoundry/pineapple-defense/blob/4356ead15a5eb61693f33497515f0212cf01dd77/src/extras.js): run escalation, rewards/helpers and Champion state machines; [stages.js](https://github.com/lfcfoundry/pineapple-defense/blob/4356ead15a5eb61693f33497515f0212cf01dd77/src/stages.js#L131): five Champion definitions; [evolve.js](https://github.com/lfcfoundry/pineapple-defense/blob/4356ead15a5eb61693f33497515f0212cf01dd77/src/evolve.js): fish and hit-count progression.
- [save-kit](https://github.com/lfcfoundry/pineapple-defense/blob/4356ead15a5eb61693f33497515f0212cf01dd77/src/vendor/save-kit/save-kit.js#L119): schema filtering and optional migration; [build.py](https://github.com/lfcfoundry/pineapple-defense/blob/4356ead15a5eb61693f33497515f0212cf01dd77/build.py#L36): source inclusion; [title.html](https://github.com/lfcfoundry/pineapple-defense/blob/4356ead15a5eb61693f33497515f0212cf01dd77/src/title.html#L7): offline CSP; [developer history](https://github.com/lfcfoundry/pineapple-defense/blob/4356ead15a5eb61693f33497515f0212cf01dd77/CHANGELOG-DEV.md#L111): Aim Help/Sticky Aim removal. Checkout and pinned AGENTS instructions were read.

No game was executed. Numerical examples below are static calculations from the proposed equations, not prototype results. External research links were assessed as presented in the supplied evidence ledger, not freshly independently verified in this review.

## Strongest case for the direction

1. **The underlying problem is real in the code.** Release direction comes from a recent sample segment, while guide direction uses the whole drag. Target acquisition uses a 0.4-body-width corridor; once selected, target depth/prediction replaces speed-based range. Without selection, speed sets range. This is a discontinuous explanatory contract. Main-shot collision occurs after a flight timer, not along the drawn arc. The audit correctly identifies these limitations without proving how often players notice them.
2. **A support shot can create a new decision.** Releasing a cart while deciding whether to rescue an urgent penguin connects aiming, timing and defense. It offers a better prospect of memorable agency than simply enlarging existing combo effects.
3. **The identity can survive.** The stand supplies stakes; Cheer makes mistakes gentle; hats, belly slides, umbrellas and Champion personalities can make an environmental mishap specifically Pineapple Defense. A toy cart is a credible extension of its world.
4. **A small version fits the architecture.** One constrained rolling body, a support state, swept projectile contact and controlled actors do not inherently require a general physics engine or runtime dependency. Keeping departing penguins animated rather than ragdolled is a sound choice.

## Strongest case against it

The proposal repeatedly turns each risk into another feature: occlusion gets a magnifier and relative pad; acquisition gets surface selection; correction gets arming states; pressure gets Plan mode; energy gets a selector; causal attribution gets chain IDs; content variety gets more materials, weapons and Champion rigs. The result could demand more interpretation than the flick it replaces.

Its weakest incentive assumption is that players will choose setup because it looks interesting. Free Classic every 0.45 s and free splashy Lobber every 0.90 s may make direct spam safer than watching a three-second chain. Conversely, pressure strong enough to force cart use can make precision setup mandatory despite the promised accessible direct route. Neither balance is demonstrated.

The decision matrix awards B speculative advantages in immediate fun, mastery, variety and identity. Reducing B by one point in those four categories changes 4.39 to **3.97**, below C's 4.00; arithmetic is sound, evidence for those advantages is absent. A smaller “improved defense plus one toy” alternative is missing entirely. The matrix expresses preferences, not a discovered winner.

## Ranked contradictions and missing decisions

### 1. What does the aimed point mean? — resolve before building

[Core: World and camera / Preview honesty](CORE-GAMEPLAY-DESIGN.md#world-and-camera) alternates between a landing reticle and frontmost visible body/prop surfaces. These are different control contracts. A tiny pointer movement from a penguin onto the ground can change both height and inferred depth, hence the entire launch vector. A moving body crossing a stationary reticle can do the same without finger movement. An outline discloses the switch; it does not make the switch intuitively stable.

Leading is also unspecified: a future contact point beside a moving body may currently be empty ground, so how does the player select that point at body height? A dashed predicted body is not explicitly a selectable surface. Plan freeze helps thinking but targets resume moving during flight; it does not itself solve aiming at their current location.

**Required decision:** choose one aiming plane for the initial experiment, preferably a persistent ground landing point with a simple ground-projected hit region and fixed shot profile. Make support targets broad and low. If elevated surface picking is indispensable, document and test its discontinuities as a separate candidate before calling endpoint aiming dependable. Do not commit to the current camera merely because its art already exists.

### 2. The direct-aim activation rejects accurate placement — resolve before building

[Core: Arming](CORE-GAMEPLAY-DESIGN.md#arming-dead-zone-and-release) requires 8 px movement and disarms within 8 px of the starting point. A player who presses exactly where they want to aim cannot release there successfully, even after moving out and correcting back. This penalizes precise initial placement and encourages an unexplained offset gesture.

The relative pad is not a complete remedy. At a 320 px short dimension its maximum displacement is 70.4 px; gain 2 yields only 140.8 px of reticle displacement from its initial point. It cannot cover an arbitrary full-width/tall field from center as written; recentering the pad does not specify how the reticle accumulates movement across gestures. Clamp, dead-zone subtraction and gain coordinates also need one definition.

**Required decision:** test press-to-preview, optional drag-to-correct, release-to-fire at the same point, with an explicit cancel region. Treat the 8 px scheme as an activation hypothesis to reject, not a hard requirement. Prove full legal-point reachability before adding a relative pad. Retain a separate non-hold Fire option for access; do not create three subtly different default shot states.

### 3. Plan mode can freeze readiness indefinitely — resolve before building

[Core: Core contract / Reload](CORE-GAMEPLAY-DESIGN.md#reload-and-commitment) freezes reload during aim but permits aiming during reload. The player can hold a perfect aim forever while readiness never arrives. Releasing outside the final 0.15 s rejects it; the proposed buffer cannot fix this. In UX, a latched Aim/Fire state freezes indefinitely too.

**Required decision:** for the first experiment, enter frozen planning only when a shot is ready, show reload normally beforehand, and permit immediate aim once ready. If early aiming is essential, define a visible pending-aim state that does not freeze until ready. Do not silently advance only reload while promising every gameplay clock is frozen. Test moving targets immediately after release, not only the frozen preview.

### 4. “Independent power” is neither supplied nor monotonic — resolve before building

Endpoint aiming supplies bearing and intended range; the game derives elevation and speed. That can be a good simplification, but it is **not independent player control of launch power**. There is no requirement to add power unless encounters benefit from it.

[Core: Launch calculation](CORE-GAMEPLAY-DESIGN.md#launch-calculation) labels larger T “Gentle” and smaller T “Firm.” Under its own equations, with ground endpoint at r=5, origin z=0.65 and g=18:

| Lobber selection | T | Horizontal speed | Ground impact speed |
|---|---:|---:|---:|
| Gentle | 1.04075 s | 4.804 units/s | 11.086 units/s |
| Firm | 0.81450 s | 6.139 units/s | 10.186 units/s |

Gentle is slower sideways but has greater total impact speed; normal impulse depends on surface orientation. This is an arc/timing control, not a dependable energy control. Pullback also has a different reachable set: maximum ground range at speed 12 is approximately 8.35 units at 35° and 7.29 at 60°, short of the proposed ten-unit field.

**Required decision:** remove Gentle/Firm from the MVP. Compare fixed-profile point placement against pullback's angle/range control within their shared reachable area. Later use a clearly named arc selector or a genuinely monotonic, defined impact rule if a demonstrated decision requires it.

### 5. Contact rules do not support the advertised encounters — resolve before building

[Core: Projectile vocabulary](CORE-GAMEPLAY-DESIGN.md#projectile-and-prop-vocabulary) retires Classic after solid prop contact, yet stage 3 asks for bank shots and the preview allows bumper bounces. Which projectile survives the bumper? A Lobber detonating on first contact does not solve this either. Snow supports disappear into noncolliding puff while the vision describes a chock flipping aside. Both can work; they teach different consequences.

The general inverse-mass impulse equation also leaves controlled penguins unspecified: infinite-mass kinematic blockers, yielding physical bodies or trigger-only targets? Removing a basic penguin's collider while leaving a solid-looking departing sprite is a potential false obstacle. A cart that stops after three contacts needs a visible reason; an invisible contact budget feels arbitrary.

**Required decision:** publish a small collision-response table by object pair. For MVP, Classic ends at support/target contact; support visibly releases; cart follows a shown track and triggers send-home without bodily pushing. No bumper or contact-count cap: an authored track end visibly stops it. Add ricochet only with an explicit exception later.

### 6. The comparison cannot identify its claimed control effect — resolve experiment design first

[Validation: Matched conditions](PROTOTYPE-AND-VALIDATION-PLAN.md#matched-control-conditions) preserves F's sampling but disables hidden snap. Current `throwAt` uses corridor selection to choose prediction and range semantics. Removing that branch changes more than feedback. Keeping it means F is not equivalent to unassisted positional candidates. Either is a valid experiment if named accurately, neither is “same game, only gesture changed.” A velocity flick's launch-time intent also cannot be fully known before its final samples; its preview is inherently provisional.

**Required change:** retain an intact current-game reference, including existing Tap/hold, and label any shared-solver velocity adapter a new control. Use D versus S for the clean shared-world comparison. Measure complete tasks and intent errors, not only parser recognition. Add the simpler authored-defense condition before choosing B over the alternatives.

### 7. Cadence, lifecycle and credit rules are incomplete — test before expanding content

A three-second cascade allows roughly six additional Classic release intervals. What happens when another shot hits a moving cart, two chains merge, armor survives, or a helper changes the setup? One inherited chain ID is insufficient to define per-chain repeat-hit protection and credit after multiple impulses. “At most two chains” cannot be enforced by deleting or refusing otherwise legal shots invisibly.

Free Lobber may overshadow Classic/group props; Bowling overlaps the cart's line-clear role; Mega reserves conflict with “next-shot Mega” pickup wording. Every wave's guaranteed direct Classic route conflicts with layouts whose only meaningful route is over cover unless an open flank is actually authored. “Optional comfort upgrades” in progression should be deleted: essential comfort must never require currency.

**Required simplification:** one fruit, one support, one cart, basic penguins, no helper or per-chain reward in the first loop. Preserve normal free aiming while the cart moves; record extra shots rather than prohibit them to manufacture a satisfying demonstration. Define prop reset per wave and distinguish a planned cart from immediate two-shot clearing. Later specify one-credit-per-enemy and collision/armor semantics independently of reward attribution.

### 8. Camera and solver scope are understated — feasibility gate

Current layout puts ground y at 0.47H–0.93H and scales depth sprites; shots are drawn after the stand/actors, without general prop/airborne occlusion ordering. It has no inverse surface picker or height-aware occlusion system. A valid projected arc can cross a sprite without 3D contact, a slab can hide its support, and a cart can pass behind an actor while appearing in front. These are fairness problems even with correct equations.

[Core: Simulation budget](CORE-GAMEPLAY-DESIGN.md#browser-first-simulation-budget) proposes continuous contacts, hinges, moving cover, support state, friction, sleep and predictive scratch worlds. Small body counts do not make that a small implementation. At 30 preview refreshes/s, a 1.15 s horizon and 120 steps/s imply about **4,140 predicted steps/s** if the full future world is stepped, versus 120 live steps/s. Predicting only a projectile is cheaper but cannot promise first contact with all interacting moving props.

Eight catch-up steps cover only 66.7 ms. Automatic pause above that may cause repeated interruptions on the very hardware the game should support. Stable numerical order is useful, but global cosmetic `Math.random`, event-to-tick assignment and side-effecting update routines must also be separated before deterministic replay is credible. Roll's custom ball-versus-static-board solver proves a narrow precedent, not a reusable stack/hinge engine.

**Required decision:** bound MVP preview to static geometry plus one prescribed mover; freeze/clearly qualify anything outside that model. Choose the lowest fixed-step rate that passes independent contact tests; treat 120 Hz as a hypothesis. Resolve render/pick/collision agreement before more materials. Define one safe hitch policy and reject repeated auto-pause behavior in sustained modest-device play.

### 9. Progression preservation is a promise without a mapping — defer, but block campaign conversion

Current upgrades largely automate assistance; changing them to player-triggered tactical utility changes the game, even if names survive. All Champions receiving support-release rigs risks replacing five distinctive fight styles with “remove support, hit exposed penguin.” Bernard's proposed balance rig adds a new interaction to a finale said to introduce no new material/physics; it must reuse a taught hinge or be deferred.

The existing `pd-save`/`PD1` schema has no encounter seed/version/checkpoint fields and drops unlisted fields. SaveKit has optional migration machinery, but preserving a prefix does not implement compatibility. Retried authored encounters need an explicit rule for already-awarded currency, consumed specials, durable recovery and import from legacy saves. Old best scores can be retained as legacy history, not directly compared with a new economy. Freeze these decisions until the core wins, then require an actual field/reward mapping before a vertical slice writes real progression.

## Minimum viable experiment

Build nothing until the aiming-plane, activation, clock, reachable-set and collision-table decisions above are agreed. The smallest useful later prototype is **one reusable encounter board**:

- Visible fruit stand and Cheer, one Classic pineapple, basic penguins, one wide chock and one cart on a visibly constrained cross-lane track; one local contact cue and hat/slide reaction.
- Four or fewer simultaneous penguins, one moving prop, up to two live pineapples; no shop, pickups, trophies, helpers, armor, Bowling, Mega, hinge solver, free stacks or moving gate. No persistence to the real save.
- One consistent camera and ground-point contract, with a paper/static projection comparison before committing elevated geometry. Include portrait and short landscape plus keyboard and explicit non-hold Fire.
- Permit direct shots and further shots during the cart roll. Success must survive ordinary player behavior, not a forced watch period.

**Controls:** two new candidates only: D, press/optional drag/release at a fixed-profile point; S, pullback distance for speed and angle for bearing at fixed elevation. Use a shared reachable area, shared flight/contact model and equally legible feedback. Existing flick and Tap/hold are an intact short usability reference, not a misleadingly “matched” adapter. A relative pad and separate power selector are not initial candidates. If holding itself blocks access, compare explicit Aim/Fire as an activation adaptation, not another weapon system.

| Encounter | Purpose |
|---|---|
| Broad stationary target, near/middle/far | Acquisition, intended-point error and release, including press exactly on target |
| Constant-speed moving target and crossing silhouette | Leading and unintended depth/surface switching; Plan release does not stop flight-time motion |
| Pair beside chock/cart plus one urgent opposite-lane penguin | Direct rescue versus timed two-target setup; E2/E3 combined |
| Broad support opening Waddles' target, optional low screen/open flank | Two-step weak point and first obstruction; simplified E5/E6, not a full boss |

First compare D/S on the first two tasks. With the better usable control, compare **authored direct defense versus the one-cart version** using the third task and equivalent arrival schedules/rewards. Test live versus ready-only Plan on that same task. The fourth task checks transfer after the loop shows promise. Add Lobber/low cover only if the one-fruit loop passes; do not make it prerequisite work.

A cart preference alone does not prove a general physical simulation is needed. If a constrained state machine produces equally legible, controllable outcomes, keep that cheaper design. If players enjoy planning but dislike live pressure, reopen A/C rather than automatically adding assists until B wins.

## Measurement and go/no-go criteria

All following values are **proposed formative gates**, not results or statistical significance. Fix them before observing results. Use about 12 novices including at least 6 children in a declared age band; analyze relevant access/input groups separately. Start with engineering shakedown testers, then test untaught transfer with fresh participants. Counterbalance D/S order, interleave reference order, rotate equivalent layouts and allow similar practice to a declared cap.

The existing six-task × three-model × two-attempt battery is 36 attempts: 12–24 minutes of active trials before instruction, practice, interviews and reference play. Cut it to two control tasks and a small loop comparison, about 15–20 minutes including breaks; split sessions if needed. Ask intention/prediction questions on a subset: repeatedly pausing to explain each shot changes the live defense task itself.

| Gate | Proposed go criterion | No-go / interpretation |
|---|---|---|
| Learnability without constant rescue | At least 10/12, including 5/6 children, achieve three intentional broad-target hits within 60 s after ≤20 s instruction | Failure requires repeated coaching, Plan for a static target, or offset movement to activate a correct aim |
| Stable intent | At least 90% of declared deliberate attempts launch or visibly cancel as intended; 0 accidental launch on interruption/cancel in scripted cases | Classify acquisition, activation, parser, prediction and collision errors separately; zero cancel faults is mandatory |
| Better control | Candidate reduces intent-related failures by ≥30% against current reference when baseline failures are appreciable, with no subgroup regression; similar baseline errors require equal reliability plus clearer transfer/preference | Different world/reference conditions limit attribution; do not claim a measured gesture-only effect |
| Readable contact and cause | At least 10/12, including 5/6 children, predict first obstruction and describe support → cart → send-home on an untaught mirrored layout | Reading the ring only is not physics understanding; require one explanation/prediction with instructional labels absent |
| Real tactical choice | Both direct-first and setup-first are viable; changing arrival timing makes the other choice advantageous, and at least 8/12 adapt without a hint | Cart always wins, spam always wins, or players activate support mechanically regardless of threat |
| Repeatable appeal | After practice and at least three short repetitions, ≥8/12 including ≥4/6 children prefer the cart loop; optional extra-round choice and explanations agree | First-showing excitement alone, higher coin payouts or decorative polish do not pass; mixed results justify another narrow comparison |
| Recoverability/access | Early task remains completable after two misses; all recruited keyboard/non-hold testers can finish the mandatory task; no essential comfort unlock | Assisted success is valid, but report if the standard live loop excludes the intended inexperienced audience |
| Technical honesty | Same state/profile has same first-contact actor across 30/60/120 render schedules except explicitly classified numerical ties; projected marker/contact within 4 CSS px on stationary tests; no tunneling | Use independent simple geometric checks and screen observation, not merely two callers of the same faulty routine |
| Device feasibility | On a named modest phone, p95 frame interval ≤33.3 ms and event-receipt-to-reticle draw ≤33.3 ms; no recurring auto-pause during three short waves | Separate 60 FPS stretch goal from 30 FPS floor; preserve collision outcomes, preview budget and essential cues at lower visual quality |

Report raw counts, errors and dissent. With these samples, 8/12 preference is an invitation to continue, not proof of superiority. Do not average keyboard exclusion or repeated child confusion into a pass. Rejection means simplify or change direction, not add all proposed controls to Settings.

## Research judgment and document amendments

The source audit is substantially accurate on the central mechanics. Its dissatisfaction diagnosis is a reasonable hypothesis, not observed prevalence: the owner report motivates investigation, but no player comparison establishes which issue dominates. It should acknowledge that endpoint flight and generous explicit Tap selection may intentionally improve accessibility; physical collision is not automatically a player benefit.

The research ledger appropriately discloses missing direct Royal Smash footage, selected review samples, uncertain secondary-site provenance and task-specific literature. Consequently it supports exploring causal consequences and visible control, not any claim that Royal Smash validates this camera, point solver, fixed-step rate or campaign. Several apparently independent writeups might share marketing assumptions; they cannot be counted as independent confirmation without checking provenance. The Swink publisher reference is not a completed reading of the book. These limitations are already partly stated; downstream confidence should match them. More competitor research is useful, but not necessary to test this original one-cart hypothesis.

Recommended amendments for a later authorized documentation pass (none applied here):

| Document | Specific change |
|---|---|
| Vision | Describe B as one candidate; replace broad physical-playground scope with dependable aim + one optional causal toy; identify repeatable defense choice as the hypothesis |
| Competitive research | Keep evidence categories; make clear that multiple secondary descriptions do not constitute direct observation or demonstrated control superiority |
| Current audit | Preserve verified parser/collision facts; distinguish usability risks from observed failures, and note the accessibility benefit currently supplied by explicit target prediction |
| Core design | Resolve findings 1–5; remove Gentle/Firm and first-prototype ricochet; write an object-pair response table and readiness/Plan state diagram; define one targeting plane and pointer cancellation contract |
| Levels/progression | Mark 25 wave briefs as a backlog, not committed content; prove a changing direct/setup tradeoff in two waves first; remove currency-gated comfort; reconcile Mega, helper and trophy/save mappings later |
| UX/accessibility | Remove mandatory move-away activation; make the default explainable in one sentence; prove relative-pad reach before offering it; specify what moves after Plan release and retain a non-hold path |
| Decisions | Add improved authored defense without dynamic props as a serious comparator; downgrade unsupported B scores and make the recommendation conditional on evidence against that simpler option |
| Validation | Repair F labeling, reduce the battery, equalize reachable contact opportunities, add repeated/untaught transfer and tactical-choice reversal; distinguish useful authored motion from a need for general simulation |

Before prototype authorization, approve one page covering the targeting plane, activation/cancel rules, ready-only Plan behavior, shared reachable region, cart/support contact table and the reduced experiment gates. Full upgrade migration and all Champions can remain deferred. No application source, HTML, assets, existing design document, dependency, build configuration, save or test was changed; no build, prototype, QA run, branch/ref change, commit or publication occurred. Only this review report was created.
