# Competitive research and evidence ledger

Research date: 2026-11-17. Companion to the [source audit](CURRENT-GAMEPLAY-AUDIT.md). This document separates externally supported descriptions from proposed Pineapple Defense design. All proposed mechanics elsewhere are our designs, not claims about another game's implementation.

## R2 evidence implications

Reconciled 2026-11-17 following the [independent review](INDEPENDENT-DESIGN-REVIEW-2026-11-17.md). The source register and evidence categories below are retained. No new Royal Smash play observation or player result has been obtained. Multiple secondary descriptions may derive from the same marketing language and are not independent confirmations merely because they appear on different sites. The Swink publisher reference does not amount to a reading of the book. This evidence supports investigating causal choices; it does not establish a winner, numeric physics constants, the current camera or a full campaign.

Only [MINIMUM-EXPERIMENT-SPEC.md](MINIMUM-EXPERIMENT-SPEC.md) defines the first experiment. Point placement competes with the actual original flick, including its automatic target prediction. The original comparison's endpoint flight is retained; the only new physical opportunity is one constrained support/cart. Pullback, independent power, full trajectory prediction and broad physical material systems are deferred research ideas, not additional experiment requirements.

## Method and confidence

The exact subject is **Royal Smash! - Physics Puzzle**, Cypher Games, Android package `com.cyphergames.royalsmash`, Apple ID `6780891673`. Search results for similarly named games were excluded. Sources were read in English and, for the detailed independent playtest, Turkish. Summaries of that analysis are paraphrases, not translated quotations.

Evidence classes used here:

| Tag | Meaning | What it can establish |
|---|---|---|
| O | Official developer/store documentation | Advertised features and declared business model; not measured feel or exact implementation |
| D | Direct observation by this research session | Only what was actually visible/tested; no downloaded app or playable Royal Smash session occurred |
| I | Independent author's reported play observation | Specific behavior attributed to that author; not independently reproduced here |
| P | Individual player opinion | An experience worth testing, not prevalence or a causal explanation |
| H | Our hypothesis/design interpretation | A proposal or explanation to validate, never an observed Royal Smash fact |

**Direct-observation boundary:** walkthrough titles and written guides were retrievable, but the two YouTube watch pages failed with cache misses. No video frames or touch traces were available. Therefore there are no D-class claims about trajectory preview, finger direction, power gesture, release semantics, collision restitution or debris lifetime. This is the largest remaining competitive-research gap. The design recommendation does not depend on guessing these values. A short observation protocol below closes it before anyone describes the redesign as reproducing Royal Smash's feel.

Store pages varied across cached/localized snapshots, including aggregate ratings, versions and review counts. This package deliberately does not use them as stable performance or popularity evidence. Search snippets and anonymous download mirrors were discovery aids, not final authorities.

## Source register

| ID | Source and access | Evidence / quality / limit |
|---|---|---|
| R1 | [Google Play listing](https://play.google.com/store/apps/details?id=com.cyphergames.royalsmash), read 2026-11-17 | O for description and ads/IAP; P for featured comments. Commercial copy; selected reviews, no representative sample. |
| R2 | [US App Store](https://apps.apple.com/us/app/royal-smash-physics-puzzle/id6780891673), read 2026-11-17 | O identity and IAP; P dated review excerpts. Duplicate expanded/collapsed text counted once. |
| R3 | [UK App Store](https://apps.apple.com/gb/app/royal-smash-physics-puzzle/id6780891673?platform=ipad), read 2026-11-17 | P corroboration across a second regional selection, still the same review platform. |
| R4 | [Ayşe Nur Yıldırım, first 100 levels analysis](https://tr.linkedin.com/pulse/royal-smash-ilk-100-level-analizi-fizik-zorluk-e%C4%9Frisi-y%C4%B1ld%C4%B1r%C4%B1m-mhy4f), published 2026-10-17 | I. Detailed single-player observational method, concrete levels, separates observation from inference. Useful specificity; not a controlled study, independently reproduced dataset or developer disclosure. |
| R5 | [Savestate, Royal Smash review](https://savestate.gamereview.games/review/royal-smash-physics-puzzle-lsmash/), dated 2026-10-19 | I, author claims five hours on Android. Specific but site editorial provenance is uncertain; low-to-moderate confidence, no technical measurements. |
| R6 | [GamesMys review](https://www.gamesmys.com/royal-smash-physics-puzzle/), updated 2026-11-12 | Secondary interpretation mainly restating documented features. Low weight; not proof of hands-on testing. |
| R7 | [Independent guide, level 100](https://www.royal-smash.cc/level/100) | I, narrow written advice about joints and waiting. No version ID, authorship/method weak; do not copy its layout or trust its “verified” label uncritically. |
| R8 | [Walkthrough levels 1–24](https://www.youtube.com/watch?v=WZVetO4x3jE), [tutorial walkthrough](https://www.youtube.com/watch?v=EiNq5JpPYn0) | Discovery leads only. Watch pages inaccessible during research; no timestamped claims made. |

### Royal Smash evidence findings

**R1 / O:** the listing describes a cannon, angle/power aiming, fragile jars, heavy stones, towers, chain reactions, successive arenas, hundreds of levels and simple one-tap controls. Ads and in-app purchases are declared. “One tap” and “set angle and power” do not specify an actual gesture algorithm. They cannot establish drag distance, fixed power or release-to-fire. ([R1](https://play.google.com/store/apps/details?id=com.cyphergames.royalsmash))

**R2 / P:** Gramma Tree praises knocking down walls and layout variety but questions low completion rewards versus extra-shot prices; The Lovely Patricia separately wants unused-shot rewards. Heaven praises approachable challenge. These are two distinct reports of weak efficiency rewards and one positive difficulty experience, not an economy audit. ([R2](https://apps.apple.com/us/app/royal-smash-physics-puzzle/id6780891673))

**R3 / P:** Charlie Knoll reports expensive continuation and limited lives; LucieM95 reports repeating layouts; Dewie and uughh13 report ad-related freezes. These establish concerns in this selected sample, not universal failure rates. ([R3](https://apps.apple.com/gb/app/royal-smash-physics-puzzle/id6780891673?platform=ipad))

**R1 / P:** Jaesyn Micoli describes fun strategic shots but limited bonuses and purchase prompts; A B reports lost level progress and spent assists; marie mielke objects to automatically activated timed-life rewards. Praise and complaints coexist. No source here demonstrates spending changes the difficulty algorithm. ([R1](https://play.google.com/store/apps/details?id=com.cyphergames.royalsmash))

**R4 / I:** Yıldırım reports constrained shot budgets, moving platforms, ice, TNT, propellers and marble columns across the first 100 levels. Specific examples include pieces staying on a broad platform at level 47, unprompted collapses at 60/95, and columns toppling after loss of support. The author reports later boosters, lives, events and a 900-coin extra-five-shot continuation. These are one playthrough's observations, not fixed global unlock guarantees or verified simulation internals. ([R4](https://tr.linkedin.com/pulse/royal-smash-ilk-100-level-analizi-fizik-zorluk-e%C4%9Frisi-y%C4%B1ld%C4%B1r%C4%B1m-mhy4f))

**R5 / I:** Savestate reports thumb-friendly cannon operation, support hits cascading into surrounding objects, readable tumbling, generous early ammo and repetition. It criticizes frequent ads and occasional ad-related resets. Its claim of a very gentle challenge differs from reports of difficult late levels; version, progress and player differences remain plausible explanations, not established causes. ([R5](https://savestate.gamereview.games/review/royal-smash-physics-puzzle-lsmash/))

**R6 / interpretation:** GamesMys frames the attraction as choosing a shot that changes an entire arrangement. Its angle/power language largely follows official copy, so it adds little independent evidence about input. ([R6](https://www.gamesmys.com/royal-smash-physics-puzzle/))

**R7 / I:** the level-100 guide advises striking a joint, waiting for the first change and adapting the follow-up. Use this only as weak corroboration that reading changed structure matters. ([R7](https://www.royal-smash.cc/level/100))

## A. Core interaction: what is known and what is not

| Question | Evidence-supported answer | Pineapple Defense interpretation (H) |
|---|---|---|
| Aim mechanism | O: cannon aiming advertised; I: authors discuss deliberate support targeting | Make the desired contact point visible before spending a shot |
| Angle and power | O mentions both; exact independent controls unverified | First compare the actual original flick with point placement; defer pullback; do not copy a presumed speed gesture |
| Intended trajectory | No D evidence of dots, landing markers or prediction length | Make landing feedback honest for the current collision model; do not promise airborne collision in the initial comparison |
| Commitment | Exact tap-down, tap-up, release or separate-button semantics unknown | Use explicit release with cancellation, plus a separate Fire option |
| Precision | I support/joint advice suggests placement matters, but no measured tolerance | Large useful contact zones and narrow optional efficiency opportunities |
| Approachability | O claims simple controls; P/I reports include approachable play | Test whether a child understands one complete shot without an explanation of velocity |
| Responsiveness | I describes responsive/tactile feel, no latency measurement | Set a latency budget; do not convert review adjectives into milliseconds |
| Skillful shot | O/I emphasize consequences beyond first contact | Skill should be selecting a cause and anticipating its result |

The portable principle is an understandable **decision before contact and visible consequences after contact**. It remains useful whether Royal Smash uses tap, drag, fixed launch energy or a version-dependent control scheme.

## B. Physics and destruction analysis

| Topic | Evidence boundary | Design conclusion (H) |
|---|---|---|
| Projectile | Cannonball is documented; exact gravity, bounce and spin unknown | One consistent flight family per pineapple; no hidden target-conditioned trajectory |
| Response / weight | I describes toppling/tumbling; numerical masses unknown | Distinguish movable crate, low-friction ice and fixed bumper through readable motion and silhouette |
| Materials | O names fragile/heavy objects; I names further obstacles | Give each material one reliable rule before combining them |
| Stability / weak points | I includes support loss and spontaneous collapse | Reward chosen support removal; pre-settle authored structures so waiting alone is not the best universal move |
| Falling / sliding / rolling / bouncing | I supports collapse and sliding/tumbling broadly; rolling coefficients unverified | Limit supported contact classes; ensure impulse direction explains subsequent travel |
| Chain reactions | O advertises; I describes examples | Track causal events so a player can follow one shot through two or three consequences |
| Debris | I describes clean debris, no budgets/lifetime evidence | Separate cosmetic fragments from gameplay colliders |
| Physical accuracy | No engine/source access | Judge stable, legible causal outcomes; conservation approximations are acceptable if consistently shown |

A convincing heavy object need not have an expensive general rigid-body stack solver. Our proposed contrast is a heavy object that needs a visible support release, then follows a bounded fall or roll. Its exact implementation must be tested against the player's prediction, not justified by an unrelated game's apparent realism.

## C. Puzzle and encounter lessons

The Royal Smash evidence suggests that shot economy, support geometry and what remains after an impact are useful axes for analysis. It does not establish the average puzzle duration, a complete level grammar, all tutorial steps, replay options, or an optimal difficulty schedule.

Our application is to author **defense situations** with different causal structures: a safe direct shot, a support that opens a lane, a low-friction cross-lane slide, and a moving opportunity. A prop's payoff must depend on an actual threat location or timing. Merely changing tower silhouettes would leave Pineapple Defense repetitive too.

For each candidate encounter, draw two plausible first shots and their changed field states. If both choices always lead to the same result, remove the redundant choice or alter arrival timing. One shot should sometimes buy time instead of clearing the most targets. This is an original encounter-authoring rule for Pineapple Defense.

## D. Retention, progression and player feedback

The evidence supports a level sequence and reports of boosters/currency/meta systems. It does not supply retention rates, normal session lengths, player spending distributions or controlled evidence that a particular reward causes return play.

Across the small review selection, recurring themes worth respecting are pleasure in knocking things down, a desire for meaningful performance rewards, frustration with interruption and concern about repetition. Treat these as qualitative themes, not percentages. Ad frequency differs between reports; do not claim every player sees an ad after every level. Ease and difficulty complaints can both be real experiences without proving intentional manipulation.

For Pineapple Defense, voluntary replay should come from solving the same field another way and remembering a funny cascade. Rewards should acknowledge that achievement without withholding completion. A child who needs extra shots still keeps earned progress. Save reliability is a product promise, not a retention device.

## E. Exclusions

Do not inherit advertising, paid continuation, lives sold for money, automatically consumed timed rewards, streak loss, events with deadlines, accounts, tracking, reward-wall marketing or escalating pressure to spend. Also exclude mandatory “clear the last tiny fragment” cleanup, uncontrolled idle collapse, microscopic weak points, and hundreds of cosmetic repetitions. These exclusions are our fit decisions; their inclusion here does not assert every one exists in every Royal Smash build.

Do not copy Royal Smash assets, cannon artwork, royal theme, characters, level arrangements, names, marketing or UI. Pineapple hats, fruit stands, jealous penguins, paper umbrellas and tropical-versus-glacier humor should supply our memorable moments.

## Broader comparisons and literature

These are researched examples and bounded interpretations, not recommendations to reproduce their whole products.

| Source | Supported observation | Specific proposed application / limit |
|---|---|---|
| [Rovio: Angry Birds 2](https://www.rovio.com/games/angry-birds-2/) and [Reloaded announcement](https://www.rovio.com/articles/angry-birds-reloaded-now-available-on-apple-arcade/) | Official slingshot/physics-puzzle identity and differentiated characters/episodes | Pullback remains a later comparison idea, not an initial condition; differentiated roles and authored structures remain research leads. Do not import their commercial systems or infer numeric physics. |
| [PopCap/EA: Peggle Deluxe](https://store.steampowered.com/app/3480/Peggle_Deluxe/) | Publisher description centers on aim, shoot, clear pegs and watch outcomes | Test a bounded first-contact preview followed by an interesting cascade. Late bounces can be delightful without requiring full-chain prediction. |
| [Nintendo: Plants vs. Zombies Replanted](https://www.nintendo.com/us/store/products/plants-vs-zombies-replanted-switch/) | Official defense game with varied modes/challenges | Preserve defended-place stakes and readable spatial threats. Our formation grammar should vary priorities, not demand constant speed escalation. |
| [Nintendo: Super Mario Run](https://supermariorun.com/en/) | One-handed taps timed during automatic running control jumps/spins/wall jumps | Simple controls can retain timing mastery. Simplify Pineapple input without erasing encounter decisions. Do not infer that one tap suits every player. |
| [Swink: Game Feel, publisher page](https://www.routledge.com/Game-Feel/Swink/p/book/9780123743282) | Identifies the book and its virtual-sensation subject; full book not accessed here | Use input, simulated space and feedback as an analysis lens; not authority for our invented thresholds. Publisher search result available, full page returned 403. |
| [Pichlmair & Johansen, Designing Game Feel: A Survey](https://arxiv.org/abs/2011.09201), 2020 preprint / later journal DOI on page | Survey of over 200 sources organizes physicality, amplification and support | Audit all three: reliable world rules, proportionate feedback, and legible assistance. Effects cannot substitute for the other two. This taxonomy does not choose our control model. |
| [Apple: Make your game great with touch](https://developer.apple.com/videos/play/wwdc2026/358/), transcript | Discusses safe placement, fewer simultaneous fingers, hold/drag/release and pressed feedback | Give the player one active aiming pointer, visible acquisition and correction before commitment. Borrow interaction principles only; no Touch Controller framework, Metal or native SDK in this browser proposal. |
| [Android: natural input across form factors](https://developer.android.com/games/develop/multiplatform/enable-natural-input-on-all-form-factors) | Recommends direct nontouch support and choosing by available input/preferences | Keyboard must actually aim and fire; touchpad must have explicit commitment. Use browser Pointer/Keyboard Events, not Android APIs. |
| [Baldauf et al.: Investigating On-Screen Gamepad Designs](https://matthiasbaldauf.com/publications/Baldauf15a.pdf) | Study of smartphone control of distant-screen games; reports task-dependent usability differences, difficulty with a two-step joystick in its platform task and low tilt accuracy | Do not assume a familiar metaphor wins. Test control versus task, including two-step power friction. Remote-screen results do not directly predict young touch players in this game. |
| [Zubair & Muhammad: Interactions and Actions in One Touch Gesture Mobile Games](https://arxiv.org/abs/2106.14505), 2021 | Two researchers reviewed 77 popular games, studying gestures/actions/interaction models | Evaluate gesture, action and permitted targets together. Popularity sample is not a usability trial establishing drag's superiority. |

## Reconciled hypotheses and evidence needed

1. A stable screen-point contract may reduce intent failures compared with the original flick. The original's prediction may instead outperform manual leading for children. Compare F0/N0 with identical ordinary shot behavior; retain the original target selection rather than testing a weakened velocity adapter.
2. A visible support/cart opportunity may produce remembered, outcome-sensitive decisions beyond better input. Compare N0/N1 with input fixed, after repetition and arrival-timing transfer. An impressive first cart animation is not sufficient.
3. Aiming need not expose a power skill. The first new control uses position for direction/range and automatic flight time, no Gentle/Firm or energy setting. Whether power would add useful depth is deferred, not assumed from cannon marketing.
4. The first eligible projectile contact remains an endpoint resolution to preserve the comparison. A static landing ring is a limited preview, not evidence for the earlier proposed swept-flight system. If players require mid-flight interception, design a separate future collision-model experiment.
5. Retain continuous defense and a meaningful stand in the first test, without aim-triggered planning freeze. This makes the cost of manual leading and live pressure visible. Separate pause remains for comfort. Preference for unpressured planning would reopen the concept choice rather than justify more hidden assistance.

The research gives reasons to ask these questions, not answers to them. Numerical acceptance targets come from the reconciled study plan as proposed gates, not from literature-derived universal thresholds. All first-experiment rule choices are explicit in the [specification](MINIMUM-EXPERIMENT-SPEC.md); all priority alternatives/rationale are in the [decision log](REVIEW-RECONCILIATION-DECISION-LOG.md).

## Outstanding direct-observation protocol

Before citing Royal Smash's exact feel, obtain an accessible recording with visible touch indicators, version and level number. Review three early, three middle and three obstacle-heavy shots. Record timestamps for acquisition, correction, release/tap, projectile start, first contact, secondary contact and settle. Try holding still before release; change stroke speed with endpoint held constant; vary distance with timing held constant; inspect cancellation. These distinguish velocity, displacement, target-based and fixed-power controls. Do not infer finger traces from a moving cannon alone.

For physics, compare at least three repeats of the same contact: support loss, broad-platform cleanup, moving obstacle and partial collapse. Note whether objects break, slide, roll or merely disappear; identify when fragments stop colliding. Do not estimate exact mass from apparent sprite scale.

The walkthrough leads R8 are recorded so future work can close this narrow gap without repeating the whole research. Missing direct access is disclosed; it is not a reason to manufacture confidence or to delay documenting the independently grounded Pineapple Defense proposal.
