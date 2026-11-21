# Pineapple Defense v2 design (draft for the owner's review)

**APPROVED by the owner on a card, 2026.11.20, 7:50 PM Detroit.** Draft 2, 2026.11.20, 7:50 PM Detroit (draft 1 corrected after Pineapple Defense checked it against the code: 7 fixes). Written in the research thread from every decision so far. Once the owner approves it, the Pineapple Defense thread rebuilds the shipped game from it and adds it to the repo next to docs/pineapple-defense-design.md (the v1 record, which stays as history).

**How to read it:** "Decided" means the owner chose it, with the date. "Proposed" means my recommendation, which needs the owner's OK. Every open question is listed in section 10 and becomes a picture card.

## 1. What it is and how it works

Pineapple Defense is a silly, kid-safe game. You fire pineapples from a slingshot at the bottom of the screen at penguins waddling toward your fruit stand.

v2 turns each wave into a **where-to-hit puzzle**:
- The penguins arrive in shapes: huddles, stacks, groups around ice props, and sled trains.
- You have a **set number of pineapples** for the stage.
- Every shot is a fast, **physics-based cannon shot**: tap a spot and it fires instantly.
- One well-placed shot knocks a penguin into the next, and the next, so the skill is finding the spot that topples the most. You no longer judge distance or power.

The model for the feel is Royal Smash! - Physics Puzzle (Cypher Games). We copy mechanics and feel only, never its art, names or look.

## 2. Why it exists (why v2)

- The owner playtested on 2026.11.19 and said of the old flick and the point-and-release control: "flick felt better, neither was fun."
- In the tester, the owner said the physics cannon is "very slick" and "turns the challenge from gauging distance and power to the right place to hit". He asked for the levels to work that way and for a finite pineapple count per stage.
- Research: /mnt/project-files/pineapple-defense/shooting-research/SHOOTING-FEEL-RESEARCH-v2-2026.11.19.md

## 3. Rules that do not change

These are the standing rules from v1: no sounds, no aim assist, no pinch zoom, no punishing mechanics. Also kid-safe silliness (nobody gets hurt), offline single file, no ads, no accounts, no network. The no-tap-to-skip rule applies on the first play-through only. Every game gets the hidden speed-report and error-log buttons.

## 4. Controls (decided 11.19)

- **Tap** (the main control, as in Royal Smash): the shot fires the moment your finger touches, toward the exact spot. Full power, every time.
- **Swipe** (the second style): the same cannon fires as soon as the swipe has moved 4 % of the screen up. It aims exactly along the swipe, so speed and length change nothing.
- No lock-on, no bending toward penguins, and no aim line before the shot. After each shot, a faint ghost of its path stays for about 1 s so you can correct the next one.
- A tap made just before the slingshot is ready is kept and fires the moment it is ready, at the same spot. This changes only when it fires, never where.
- Keyboard and mouse: click works like tap. A keyboard aim mode moves a plain crosshair and fires, with no assist.
- Accessibility: the "Tap or hold to throw" setting still works. Holding fires again at the held spot each time the slingshot is ready.

## 5. The cannon shot (decided 11.19; numbers come from the tester and can be tuned)

- Fast and nearly flat: about 2.2 screen heights a second, with a slight drop. It shrinks with depth like the penguins.
- It hits anything it touches along its path, not only where it ends.
- **Push and bounce:** a hit penguin is knocked back, spins, and can slide out of its lane. The pineapple bounces off at about half speed and can hit another penguin.
- **Chains:** a tumbling penguin knocks the ones it touches. A chain stops after 6 knocks so it stays readable. "x2! x3!" floats up as it grows.
- **Feel:** a short hit pause (as coded today: 35 ms on a penguin hit, 50 ms on a knock-out, 90 and 160 ms on Champion hits), a small screen shake, bits bursting outward from the hit, and splats that stay for 3 s. Slow motion and a small zoom play when the shot will finish the wave. Calm mode turns off the pause, shake and zoom.
- Speed: on the owner's phone, the worst case (15 penguins, fish, gulls, every effect) held 60 FPS with 2.2 ms of game work per frame (2026.11.20).

## 6. Pineapple types (tester version; proposed for the game)

| Type | What it does | Tester numbers |
|---|---|---|
| Classic (yellow) | Plain, reliable | speed 2.2 |
| Bouncer (teal) | Ricochets to a second penguin | bounces at 0.97, lasts 1.3 s |
| Blaster (orange) | Knocks everything near the hit outward | blast 1.7 penguin widths |
| Heavy (brown) | Slow but pushes hard; plows through | speed 1.3, push 1.1 |
| Dart (white) | Very fast and light, precise | speed 3.8, push 0.35 |

- **Proposed:** each stage gives a set lineup in a set order, shown at the top as "Next: Bouncer". Planning around the order is part of the puzzle, as in the tester.
- Retired from the old game: the paid Lobber (2 Golden Pineapples) and the paid Mega pineapple (3 Golden Pineapples). Their roles move to Heavy and Blaster. The "Mega!" power-up pickup stays (section 9). The old roster ideas (Bowling Pine, Juice Bomb, Rail Gun) stay ideas for later stages.

## 7. Stages and puzzle patterns (decided 11.19: all four, one per stage)

| Stage | Scenery (kept) | New pattern | What the best shot looks like |
|---|---|---|---|
| 1 | Sandy Snack Shore | **Huddles:** tight groups of 4 to 7 | Hit an edge penguin at an angle and they fall like pins |
| 2 | Flip-Flop Flats | **Stacks** (built in the tester, PR 77): tall columns of walking penguins, 2 wide and 3 to 5 deep, with tough front rows | Hit near the front, and the push carries through the column |
| 3 | Iceberg Harbor Hullabaloo | **Ice props** (not built yet; needs new art and knock-over physics): ice blocks, snowball barrels and towers among the penguins | Knock the prop over onto them |
| 4 | Stormy Splash Sea | **Sled trains** (not built yet; needs new art and physics): one penguin pulls a sled of 3 or 4 | Hit the puller and the sled skids sideways, dumping everyone |
| 5 | Glacier Giggle Fortress | All four mixed | Read each shape and pick the best shot |

- **Waves (untested, proposed):** the tester plays one round of 3 groups (huddles 5, 6 and 7; stacks 6, 8 and 10). Proposed for the game: each wave is one group, 5 waves per stage, growing a little each time (waves 1 to 2 teach, 3 to 4 add tough penguins, wave 5 is the biggest). This needs a tester run before it's final.
- Later idea, not planned: penguins standing on each other's shoulders would need new art and sprite stacking.
- Tough penguins (Macaroni, Magellanic and the like) take 2 or 3 hits, so the best spot avoids them or uses a Heavy.
- Penguins walk slowly, so there is time to read the shape, as in Royal Smash, which has no timer.
- Parachute fish and gulls stay as they are.

## 8. Pineapple count, stars and the end of a stage (decided 11.19)

- **Finite pineapples per stage.** A row of pineapple icons and a number sit at the top of the screen.
- **Proposed starting count:** about 0.4 to 0.5 pineapples per penguin, plus 2 to 3 spare, tuned from the owner's tester runs. The tester gives 9 for 18 huddle penguins and 8 for 24 stack penguins. A computer player that always shoots the front cleared the huddles with 5 to 6 pineapples and the stacks with 0 to 1 to spare, so both may still be a little easy.
- **Running out ends the stage anyway** (decided 11.19). You always move on and are never stuck.
- **Proposed stars:**
  - 1 star for clearing at least half the penguins, 2 for clearing all of them, 3 for clearing all with at least 3 pineapples left.
  - Each unused pineapple pays 5 Golden Pineapples.
  - Any stage can be replayed for more stars.
- No lives, no waiting, no retry wall.

## 9. What happens to the old systems (owner decisions, 2026.11.20)

| Old system | Proposed in v2 | Why |
|---|---|---|
| Cheer meter (penguins boop the stand) | **Removed** (owner). No meter and no reaching the stand. | Owner decision |
| Losing a wave | Removed (the stage just continues) | Matches "stage ends anyway" |
| Unlimited ammo with cooldown | Replaced by the stage count. The cooldown stays at about 0.35 s. | Decided |
| Auto Slingshot and the other helpers | **Removed** (owner). No helper throws, and no extra-pineapple shop upgrades. | Owner decision |
| Lime Launcher (helper in Champion fights only) | Removed with the other helpers unless the owner says to keep it (open) | Falls under the helper decision |
| Air Raid | Keep as one bonus raid per stage that doesn't use your pineapples | Fun big moment |
| Paper Umbrellas, Gull Pals, Toasty, Zippy, Cheer up, and the "Mega!" power-up (every throw splashes for 8 s) | Keep. Zippy and Mega! affect the pineapples you fire while they're active | Still fit |
| Shop and Golden Pineapples | Keep. New items: start with a Bouncer, a one-use snowball shield (no extra-pineapple upgrades) | Rewards play without making it pay-to-win |
| Combos (Double ... LEGENDARY) | Merge into the chain counter | One system, not two |
| Runs (+10 % speed per run) | Keep | Replay value |
| Champions | Keep. Each Champion fight gives its own pocket of pineapples (proposed 10 + 2 per stage), and his shield and dodge become the puzzle | Bosses stay special |
| Old flick, AIMW lock-on, lobbed arc | Removed | Decided (no aim assist) |

### Snowballs (owner idea, 2026.11.20)

At higher difficulties (stages 3 to 5 and Champion fights) some penguins throw snowballs at the cannon. Defense is either shooting the snowball down (costs 1 pineapple) or a one-use shield from the shop. A hit only freezes the cannon for 1.5 s; nothing else is lost.

## 10. Questions for picture cards (all answered 2026.11.20)

Answers: 1 wider play area, all on screen (7 lanes). 2 pineapple cannon replaces the slingshot (barrel turns to the tap, no aim help). 3 lock-on removed. 4 hit pause and small shake on by default (Calm turns them off). 5 pineapple order set per stage. 6 cheer meter removed. 7 helpers removed. 8 stars 1 to 3 plus bonus (half cleared 1, all 2, all with 3 or more left 3; each unused pineapple pays 5 Golden Pineapples). 9 Champion fights get their own pocket (about 10 plus 2 per stage). 10 snowballs: shoot down or use a shield.

## 11. Build order (proposed)

1. Finish the puzzle patterns in the tester (huddles done; stacks under way; then props, then sleds), using the owner's runs to tune counts.
2. Owner answers the cards above.
3. Rebuild the shipped game in this order: cannon and controls, then the pineapple count and stars, then stage 1 huddles, then the old systems per section 9, then stages 2 to 5 and the Champions.
4. Checks: only what each step touches, Chromium and Firefox first, WebKitGTK second. The picture gate is expected to change, so the look goes to the owner on a card. Each step ships as a new version with a changelog line.
