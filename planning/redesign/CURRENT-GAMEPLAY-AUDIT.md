# Pineapple Defense: current gameplay audit

Research date: 2026-11-17. Status: source-based diagnosis; no playtest or performance measurement was conducted. This is an exploratory proposal, not an amendment to the original brief.

## R2 interpretation and comparison boundary

Reconciled 2026-11-17 against the [independent review](INDEPENDENT-DESIGN-REVIEW-2026-11-17.md). The implementation facts below remain pinned to `4356ead15a5eb61693f33497515f0212cf01dd77`; they are not measurements of player dissatisfaction. The original endpoint flight and explicit Tap/hold prediction may intentionally help inexperienced players. Swept collision is not automatically a usability improvement, and the owner report does not identify which source-level risk dominates.

The [minimum experiment specification](MINIMUM-EXPERIMENT-SPEC.md) now preserves the original flick's candidate corridor, target scoring, prediction, speed/no-target mapping, guide and miss continuation in F0. It compares F0/N0 before enabling the support/cart in N1. The original's automatic leading is a real control benefit that the new fixed point must compete against, not an assist to remove from the control group. R1's full ballistic playground is no longer the active experiment plan.

## Baseline and authority

| Item | Verified result |
|---|---|
| Working directory | `/data/data/com.termux/files/home/lfcfoundry/pineapple-defense` |
| Checked-out branch / HEAD | `codex`, `c0563e00611ba2288c26c22ffde4e6aacede1b6b` |
| Starting working tree | Clean, including untracked-file report |
| Configured upstream | `origin/codex`; its local tracking ref still equals HEAD |
| Remote | `https://github.com/lfcfoundry/pineapple-defense.git` |
| Live remote check | `git ls-remote --symref origin HEAD refs/heads/codex refs/heads/main` |
| Remote default and main | `main`, `4356ead15a5eb61693f33497515f0212cf01dd77` |
| Remote codex | No branch advertised; the configured tracking ref is stale |
| Local main | Already contains exactly that remote main SHA; 25 commits beyond codex |
| Worktrees | One, the checkout above; no worktree created or switched |
| Gameplay authority for this package | `src/` at **4356ead15a5eb61693f33497515f0212cf01dd77**, inspected with `git show main:path` |
| Delivery at current main | `build.py` emits `play/index.html`; root `index.html` is now the landing page |

No fetch was needed: the remote was queried directly, then compared with existing objects. No claim is made about unadvertised development branches or whether Pages has deployed this exact revision. Future work must recheck remote main; do not implement against this old checked-out codex branch merely because these planning files reside there.

Read the checkout's AGENTS and README first, then current main's AGENTS, README, public player/developer changelogs, original design record, QA process, ideas/performance audits and lessons. No CONTRIBUTING.md or nested project AGENTS was found. The private full changelog path specified by AGENTS, `/mnt/project-files/changelogs-full/pineapple-defense/CHANGELOG-full.md`, is absent. Current main's 778-line `CHANGELOG-DEV.md` supplies the public backfilled developer record; the unavailable private record is an explicit evidence limitation. Other repositories were not consulted. No browser tests were needed for documentation, so no browser installation hook was run.

Use commit-pinned source links below. Working-tree paths currently show the older revision.

## Architecture and mechanics inventory

| Area | Current implementation and implications |
|---|---|
| Main controller | [game.js](https://github.com/lfcfoundry/pineapple-defense/blob/4356ead15a5eb61693f33497515f0212cf01dd77/src/game.js): enclosing IIFE, arrays of shots/penguins/effects, state `S`, DOM controls and Canvas 2D. Build-time inclusion joins supporting scripts; these are not independently downloaded runtime modules. |
| Projection | `sc(p)=0.16+0.84p`; x is `W/2+xn*FW*sc(p)`, ground y is `hy+(gy-hy)*p`. Sprites grow toward the stand. This is stylized depth projection, not a 3D collision world. |
| Waves | Five stages, five waves of 4/5/6/7/8 spawns, then Champion. Effective wave `wave+2*(stage-1)` increases speed, Adélie probability and spawn pressure. Random lanes avoid consecutive repeats, with a little lateral jitter; no authored tactical formation system. |
| Timing | `requestAnimationFrame`; EvenDt smooths refresh gaps; main dt is capped at 50 ms then scaled by game speed/timeScale. Main defense is **not** a fixed-step rigid-body simulation. Battery saver skips draws to about 30 FPS. |
| Art | Prebaked WebP sprites embedded in the page, SVG fallback, cached scenery/stamps/gradients, smaller mip copies, big copies released on phones, reused insertion-sorted depth list. Effects governor lowers DPR/effects. Preserve these optimizations. |
| Collision | Normal throws resolve at an endpoint after a timer; no continuous flight collision, rigid-body impulse, prop mass, or material system. Champion special handling precedes ordinary hit checks. |
| Content helpers | [stages.js](https://github.com/lfcfoundry/pineapple-defense/blob/4356ead15a5eb61693f33497515f0212cf01dd77/src/stages.js) defines stage scenery, Champion data, secrets and scene taps. [extras.js](https://github.com/lfcfoundry/pineapple-defense/blob/4356ead15a5eb61693f33497515f0212cf01dd77/src/extras.js) supplies upgrades, Champions, challenges, atmosphere. [evolve.js](https://github.com/lfcfoundry/pineapple-defense/blob/4356ead15a5eb61693f33497515f0212cf01dd77/src/evolve.js) supplies fish/evolution; [gear.js](https://github.com/lfcfoundry/pineapple-defense/blob/4356ead15a5eb61693f33497515f0212cf01dd77/src/gear.js) supplies cosmetic outfits. |

### Pineapples, enemies and feedback

Classic is free, 0.42 s cooldown, arc multiplier 1, flight multiplier 1, endpoint radius 0.55 target sizes, single target. Lobber costs 2 Golden Pineapples, cooldown 0.9 s, arc 2.2, flight multiplier 1.6, splash radius 1.0. Better Pineapples upgrades the helper through Classic/Lobber/Mega profiles; helper Mega splash is 1.3, size 1.45, cost 3. The Mega pickup alters the player's effective shot: minimum cooldown 1.1 s, at least 1.0 splash, minimum size 1.15, free during its effect. A distinct selectable Bowling/Cluster/Juice/Rail roster in the original proposed brief is **not** shipped. Do not treat those ideas as existing mechanics.

Rockhopper and Adélie spawn directly. Their base forward speed is `0.07+0.006*effectiveWave`, Adélie multiplied by 1.3. Parachute fish evolve Rockhopper → Adélie → Gentoo → Mecha: movement multipliers 1/1.3/1.5/1.35 and hit counts 1/1/2/3. The robot suit is slower than Gentoo. Fish land where a qualifying walker can reach them; late waves allow two fish and more frequent drops. Evolution briefly stops the penguin and changes its visual form. Cosmetic hopping/outfits do not constitute separate collision classes. Walkers steer around Champions but do not knock into one another or scenery.

A normal boop costs 12 Cheer, hits restore 1 on armor damage or 2 on send-home, clear restores 15, stage transitions restore to 100; retries/continue have a 60 floor. Hit state lasts about 0.9 s then accelerates home on its belly. Pineapple hats, puffs, text, rings, coin flights and combo calls already provide considerable decoration. More particles alone would not add new consequences.

Rewards per send-home: Rockhopper 1, Adélie 3, Gentoo 6, Mecha 10, Champion 12. A wave pays 10 if unbooped, otherwise 5. Hits within 1.5 s join the combo, including helpers; armor hits count. Combo calls report multiple hits and mixed player/helper sources. Trophies occupy two bitfields, total 21, with Golden Pineapple rewards. Pickups: Zippy 8 s, Mega 8 s, Cheer refill, Toasty slow 6 s. Table interactions happen before gesture recognition.

### Champions and stage geometry

| Stage / Champion | Actual fight | Geometry relevance |
|---|---|---|
| Sandy Snack Shore / Coach Waddles | 3 hearts, 4 initial snowballs; shield units removed before hearts; regenerating ring after surviving heart hits | Snowballs are a shield counter drawn around him, not independent dynamic spheres |
| Flip-Flop Flats / Captain Flipper | 4 hearts; hides behind 3 blocks, 0.85 s tell and 2.4 s exposed window | Blocks are fight-specific endpoint blockers, not freely breakable stacks |
| Iceberg Harbor Hullabaloo / Sir Slidealot | 5 hearts, 2 initial shields; charges, hits knock back; crossing front costs 20 Cheer | A depth/state change, not momentum-driven pushing |
| Stormy Splash Sea / Madame Mohawk | 4 hearts; squads of 3, then 4, then 5; 3.4 s opening after all walkers clear | Protection is a safe-state gate, not line-of-sight cover made of bodies |
| Glacier Party Fortress / Grand Champion Bernard | 6 hearts, 3 shields; two translucent clones, reshuffle roughly every 6.5 s and after hits, respawn missing clone after 3 s | Decoys participate in endpoint logic; solid-versus-icy visual distinction matters |

Stage scenery includes beach toys, harbor/sea decorations, lighthouse, cloud, party balloons and DJ. Side secrets and scene taps reward curiosity; stage 5 also has a shootable Cheer interaction. Most scenery is decoration or scripted tap response, not load-bearing terrain. It does not present normal-wave choices between hitting a penguin, a support, a rolling object or a ricochet surface.

Auto Slingshot waits for the player's first throw each round, marks a target, predicts its endpoint and intentionally misses with probability 28/20/12% by upgrade. Base intervals 5.2/4.2/3.4/2.8 s are slowed by stronger helper ammo. Lime Launcher has 6/12/20 limes per Champion, typically 0.8 s gap, and curved/corkscrew visual flight; it affects open Champions and shield counters. Gull Pals probabilistically remove falling fish; umbrellas spend stage reserves to fling away a near-stand penguin; Rain has 1/2 uses and timed impacts across a selected depth band. These are existing sources of mixed attribution and must be included in future readability testing.

## Exact flick mapping at current main

Relevant locations in commit-pinned `game.js`: settings at lines 9–17; `AIMW` near 157; preview 736–747; `throwAt` 865–907; endpoint collision 926–965; rendering 1299–1318; frame/input 2318–2473. Function names are the durable locator.

1. **Start:** canvas pointerdown tries pointer capture. Paused/over/active-drag input is rejected; table pickups, secret zones and scenery taps consume first. Start is not constrained to the bottom, despite the instruction text. A resume-countdown tap skips the countdown and is consumed. Optional Every finger plays lets a new pointer take over by clearing the previous drag/hold.
2. **Sampling:** moves retain the last 10 samples, or 40 with Smoother flick speed; the latter appends coalesced events where supported. Cancel clears drag and hold. No measured benefit for this option is established by the source notes.
3. **Eligibility:** pointerup requires total gesture length at least `0.03*min(W,H)` and net upward travel at least `0.025*H`. There is no maximum gesture length or gesture-duration limit in this main release path. A tap is ignored unless Tap/hold mode has already acquired a penguin on pointerdown.
4. **Direction:** walk samples backward to find the newest sample at least 60 ms before release, else use oldest retained. Direction is release minus that sample, not necessarily start-to-release. If its upward component is less than 2 px, fall back to the whole gesture. Buffer sample count therefore changes the time span available at different event rates.
5. **Speed:** `hypot(segmentDx,segmentDy)/max(30,segmentDurationMs)*1000/H`. Units are screen heights per second. Finger length is only a threshold and contributes through segment displacement; there is no independent distance-to-power map.
6. **Origin:** always the sling pouch, not the finger position. Normalize the segment vector and project a ray from that origin.
7. **Corridor targeting:** candidates include walking penguins, eligible Champion and clones. Require forward dot product positive, perpendicular distance no more than `0.4*targetSize`. Select lowest `perp/size - 0.25*p + 0.5` if helper-targeted (otherwise no +0.5). This remaining corridor selector exists even after Aim Help removal. Explicit tap target overrides it.
8. **If a target is selected:** flight time is `(0.42+0.38*(1-targetDepth))*type.T`. Predict its forward movement, clamp depth at 0.94, predict lateral velocity where supplied, aim at the resulting body center. **Flick speed is not used here.** This is a launch-time prediction, not continuous homing.
9. **If no target:** depth is `clamp(0.88-(speed-0.8)*0.2,0.1,0.88)`; larger speed means farther away (smaller p). Thus speeds 0.8, 2.8 and 4.7 map to p 0.88, 0.48 and 0.10. Project the ray to that depth, then derive time from depth using the same formula. The special Cheer target has its own endpoint branch. Tap-point depth is clamped 0.12–0.92.
10. **Flight picture:** with `u=t/T`, x linearly interpolates; y linearly interpolates minus `4*arc*u*(1-u)`. Arc derives from depth, viewport and shot type, with screen-top limits. Scale swells during flight and shrinks with depth; spin randomly picks a sign. No mass, initial velocity or gravitational integration determines main-shot travel.
11. **Impact:** only at `t>=T`, Champion logic first, then normalized endpoint distance to current body centers. Classic picks nearest inside 0.55 sizes; splash affects all inside its radius. No contact along the drawn arc. A targeted shot missing at arrival gets one extra 0.4 s continuation toward p minus 0.2; a normal miss puffs/fades for 0.3 s. It does not roll.
12. **Reload:** Classic 0.42 s, Lobber 0.9 s, Mega-effect minimum 1.1 s; Zippy 0.15 s. Optional Early flick helper retains one release made in the last 0.15 s of cooldown and expires it after 0.4 s of simulation time. Otherwise an early throw is silently lost. Documentation mentions a 0.30 s change, but the inspected source still says 0.42; source wins.

The preview is nine dots along the **whole current gesture** with a small bend and fixed length `0.34H`. It does not compute the release segment, selected target, range, collision or actual arc. It appears only for the first five throws by default (or always/never). This is an orientation hint, not a trajectory prediction.

Mouse/touchpad also have a separate **buttonless hover throw**: retain 150 ms of motion; need at least three points, 0.1H upward travel, speed ≥1.5H/s, start y≥0.45H and sufficiently upward slope; 350 ms lock afterward. Touch excludes this. Normal pointerdown/up flicks still work. Moving a desktop cursor can therefore commit a shot without an explicit click/release.

Tap/hold mode picks within `max(0.62*size,30px)` and forces that penguin as the target, speed parameter 1.2. Holding repeats at cooldown until release/invalid target, waiting through a Champion's inaccessible state. Keyboard provides pause, Rain, ammo and pickup shortcuts, **no keyboard aiming/firing equivalent**.

## Input history: retain the lesson, not the old settings

The original 2026-10-12 brief chose a hybrid with gentle snap and speed-based power/flight. Later comfort work supplied Generous/Normal/Off widths 1.3/0.9/0.4 target sizes. Sticky Aim then remembered a target for 0.9 s, widened its corridor 30% and gave a 0.4 scoring preference: longer than cooldown so it could actually affect repeated shots. Its apparent intention was to reduce reacquisition effort; that intention is inferred from the design notes, not demonstrated user benefit.

[PR 46](https://github.com/lfcfoundry/pineapple-defense/pull/46), merged 2026-10-30 as `ac36adf`, records the owner-directed removal: eliminate widening and last-target memory, keep the old Off width and explicit Tap selection. PR 47 rebuilt the delivery. The available record establishes the desired behavior, but does **not** provide a controlled playtest proving why the owner preferred it. Do not invent a study or say all targeting was removed. Older brief/ideas passages remain historical and partly stale. The redesign does not restore hidden snap or sticky target memory.

## Diagnosis before prescription

Each row considers clarity (C), response (R), predictability (P), forgiveness (F), skill (S), physical consequence (Ph), visible feedback (V), mental effort (E), and choice (D). These are hypotheses grounded in code; severity is design judgment, not observed prevalence.

| Interaction step | Diagnosis across those dimensions | Category / priority |
|---|---|---|
| 1. See threat | C/V: depth conveys urgency but distant bodies are small. R/P: smooth approach is readable. F: danger glow and Cheer recoveries help. S/D: nearest-threat choice dominates. Ph: scenery adds little consequence. E: fish/helpers compete for attention. | Perspective, level design / high |
| 2. Decide hit | C/P: candidate selection invisible. D/S: few alternatives to direct hit/splash. F: targeting corridor helps narrowly. Ph: no useful props. V/R: no precommit target confirmation. E: threat urgency plus depth. | Targeting, encounter / critical |
| 3. Place finger | C: bottom instruction is stricter than code. R: capture immediate. P/F: scenery can consume start; holding can acquire hidden choice. S/Ph: start location unrelated to launch origin. V: limited sling tilt. E/D: player must infer valid area. | Input / high |
| 4. Gesture | C/P: whole stroke suggests direction but tail determines it. R: release immediate subject to reload. F: sample fallback helps inconsistently. S: speed execution demands motor skill without matching tactical benefit. Ph/V: preview weakly coupled. E/D: speed and angle coupled. | Input / critical |
| 5. Interpret | P: target/no-target branch changes power meaning. C/V: branch not disclosed. F: window and optional buffer help but silent losses remain. R: 0.42 s cooldown. S/D: mastery includes guessing parser. Ph/E: apparent physical intent becomes endpoint selection. | Targeting/input / critical |
| 6. Launch | R: shot queued/rendered next frame, unmeasured latency. C/V: type present; power/range not. P/F: unaffordable Lobber falls back to Classic. S/D: resource choice can change on release. Ph: animated sling. E: bank vigilance. | Feedback/economy / high |
| 7. Travel | V/Ph: attractive arc/shadow but no continuous interaction. P: obstacle-looking scenery has no effect. R: time dictated by target depth. F: predictive targeting. S/D: limited timing expression. C/E: curve cannot explain every miss. | Physics/perspective / critical |
| 8. Collide | P/Ph: endpoint distance, not visible contact along path. C/V: effects occur but do not expose collider. F: normalized radii. R: effect at resolution. S/D: splash position matters. E: hard to distinguish parser from timing error. | Physics / critical |
| 9. Target reacts | C/V: hat and belly slide are strong identity. R: optional local hit pause. P: same family of responses. Ph: no momentum direction. F: Cheer restores. S/E/D: hit count matters more than impact quality. | Feedback / medium |
| 10. Others respond | Ph/D/S: no normal-world chain propagation. P: independent actors. C/V/R: splash simultaneous rather than causal cascade. F: helpers rescue, with uncertain attribution. E: little new state to read. | Physics/level design / critical |
| 11. Receive reward | V/C: bank, text, combo present. R: bursts prompt. P/F: combo includes helper/armor hits. S/D: fast hit cadence favored over causal planning. Ph: large call can obscure small contact. E: many feedback channels. | Feedback/progression / high |
| 12. Next decision | C/P: repeating random march is familiar. R/F: quick reload and gentle retry. S/D: limited changed terrain or setup payoff. Ph/V: previous miss disappears. E: repetitive execution replaces planning. | Repetition / critical |

Primary design hypothesis: **the control may be hard to explain consistently, and the field may give successful shots too few interesting consequences**. These risks are visible in code; their prevalence and relative importance require player comparison. Changing sensitivity cannot create load-bearing targets, persistent rolling paths or a reason to choose a lower-power shot.

Performance may worsen every issue through delayed samples and frames, but no current-device performance failure was measured. Historical Firefox/HUD and sprite work demonstrates why visual cost matters, not that performance is the present root cause. Camera changes, stronger feedback and new progression are secondary until intent → shot → consequence becomes dependable.

## Saves, accessibility and bonus-game constraints

SaveKit uses key `pd-save`, prefix `PD1`, typed schema, local persistence plus durable IndexedDB recovery on current main. Progress is stage/wave/bank/unlocks/trophies/settings, not a physics-world serialization. Pause/pagehide stores remaining normal-wave enemies, Golden Pineapples and Cheer; restoration may replay a little, with a Cheer floor. Champion/bonus/replay states have exclusions. TabGuard prevents two writers, export/import supports offline backup, reset requires a hold and has undo. Preserve these protections in a redesign migration.

Settings already include 60–100% speed, handed layout, guide visibility, high contrast, larger/roomier text, large buttons, Calm/OS reduced motion, battery saver, FPS, Tap/hold, Early flick helper, Little hands, hit pause, shake strength, coalesced samples, Every finger plays, danger glow, wake/fullscreen. Sound/music are absent; haptics were excluded by request. Do not add them as assumed feedback solutions. Accessibility is uneven: extensive comfort options, but canvas aiming is not keyboard-complete.

Pineapple Roll is meaningfully different: nine balls per play, two plays per run, offered after stage 4; score/4 becomes currency. Its `skFlick` estimates the fastest 40–140 ms segment in the last 300 ms, and uses direction from that segment start to release. It runs a ball in an incline/hop/board world with fixed 1/240 s steps, rim and wall contact, bounce, friction and sinking, plus last-ball chase camera and slow motion. A 1.7 world-clock multiplier makes it feel faster. This is evidence that small custom browser physics already exists locally, not proof it can be dropped unchanged into defense. Keep its world and save lifecycle isolated.

## Handoff

Read the reconciled [decisions](REDESIGN-DECISIONS.md) and authoritative [minimum specification](MINIMUM-EXPERIMENT-SPEC.md) after this diagnosis. [Research](COMPETITIVE-RESEARCH.md) distinguishes outside evidence from design interpretation. Proposed study measurements live in [validation](PROTOTYPE-AND-VALIDATION-PLAN.md); none are achieved results.


## Original R1 documentation closeout verification (historical)

At completion, a second live `ls-remote` check still advertised main at `4356ead15a5eb61693f33497515f0212cf01dd77` and no codex branch. HEAD, local main/tracking refs and the single worktree remained as recorded above. Tracked and staged diffs were empty; only the new `planning/` directory was untracked. Eight Markdown documents were created, with internal file links checked and decision-matrix arithmetic recalculated. No application tests, QA suite, benchmark, build, prototype or dependency installation ran. No source, built HTML, assets, game data, existing brief/changelog, branch, worktree, ref, staging or commit operation was changed/performed. The working tree necessarily now contains these new untracked planning documents.


## R2 documentation scope

R2 revises the eight planning documents and creates a reconciliation log plus the minimum experiment specification. The independent review is preserved unchanged. These documentation edits do not alter any application behavior, original authoritative brief/changelog, asset, dependency, test, build or save. Read the dated R1 closeout above as the earlier work record, not as a claim that R2 created only eight files.
