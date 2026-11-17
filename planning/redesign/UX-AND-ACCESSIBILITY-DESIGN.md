# UX and accessibility — reconciled R2

2026-11-17 · Proposed, not tested. [Minimum specification](MINIMUM-EXPERIMENT-SPEC.md) owns exact input, geometry, state and contact rules. This revision removes R1's move-away arming, surface selector, relative pad, magnifier and frozen planning as assumed solutions. [Review reconciliation log](REVIEW-RECONCILIATION-DECISION-LOG.md) explains those choices.

## One-sentence new control

**Press where it should land, move to correct if needed, lift to throw.** The point can stay exactly where the player first pressed. Moving away and back does not disarm it. The point means the same screen coordinate over a penguin, the support or empty board; no unseen height or target selection changes it.

This is point placement with automatic flight timing, not independent angle/force control. Empty-space leading uses the same plane as a body center. A visible small contact marker makes the old body-center collision convention explicit. Whether young players can understand that convention is an empirical gate, not a solved accessibility claim.

## Player-facing states

| State | Communication / behavior |
|---|---|
| Ready | Loaded Classic and full reload indicator; no power meter |
| N point held or latched | Ring identifies landing coordinate; no future target guarantee |
| Reloading | Dotted point ring and visible readiness fill; aim and world keep moving |
| Ready while held | Point ring becomes solid; a later release can fire without a new gesture |
| Cancelled | Point clears, nothing launches, no cooldown or cost |
| Paused | Separate explicit pause freezes the whole attempt, clears pending N aim; source countdown/consumed skip on resume |
| Cart parked | Strap/brake cue, clearly inert; no false support highlight |
| Cart available | Same cart/rail, support exposed; one short introduction, not a permanent “shoot here” arrow |
| Landing/contact | Small local ring and source reaction, then visible cart motion if released |

N's support outline is a conditional static **landing** prediction. A moving penguin can occupy that endpoint and take priority. Neither input gets new swept-flight interception; the prototype retains original noncolliding transit. Do not call the ring an accurate full-flight first-contact preview. If the visible arc passing through a sprite contradicts what players understand, record that failure and design a later collision comparison.

## Touch, pointer and keyboard

Primary N input is direct absolute pointing at 1:1 CSS coordinates inside a visible legal region. Finger speed does not matter. One pointer owns the press; extra fingers are ignored, and interruption/capture loss cancels. The specification distinguishes normal release-induced capture loss from an actual interruption. Entering the Cancel region latches cancellation; returning to the old point cannot accidentally fire.

N mouse uses explicit press/release; hover never fires. F0 keeps the original hover throw because removing it would change the reference. F0 also retains original flick sampling, prediction, guide and pointer lifecycle. Cancellation defects in the reference are measured and reported rather than repaired during comparison. All pointer tasks use the same browser/playfield and declared settings.

Keyboard N initializes at `(0.5W,0.70H)` and uses the spec §4 fixed arrow-repeat and Fire state table. Fire retains the keyboard/latched point; Cancel clears it and next arrow initializes then nudges. Internal board/Fire/Cancel focus preserves the point; leaving the composite/window cancels. Owner movement outside/back can correct unless Cancel was entered; outside release cancels. N never fills legacy drag and keeps sling tilt zero. Explicit non-hold mode lets a player click/tap to latch a point, then Fire. This access adaptation is identified in results; it is not frozen planning and cannot defer reload. F0 has no keyboard aim, so do not manufacture a keyboard flick or count unsupported key presses as human gesture failures. Baseline keyboard incompleteness is a capability difference.

Left-handed layout mirrors controls/cancel placement, not direction or the encounter. Controls stay outside the scored interaction area. Use at least 48 CSS px effective buttons/Cancel with nonoverlapping padding. This experiment keeps the exact mirrored Cancel rectangle in spec §4; Large buttons may enlarge other DOM controls only outside scored/Cancel regions. A static CSS size is not a claim about physical centimeters or child reach. Validate at 320/360/412 CSS px widths and short landscape. Every useful endpoint must be reachable directly without regripping as a baseline goal; the bounded N aim area itself may fail as threats approach the stand.

There is no relative pad to compensate automatically for failed reach. Such a pad needs a complete range/recentering proof before any later inclusion. There is no offset magnifier presumed necessary: assess finger occlusion first. Essential access and comfort never depend on currency or progression.

## Feedback and comfort

Keep the minimum cues: endpoint, readiness, static contact regions, a support puff, cart travel and existing hat/slide reactions. No new trajectory dots in N, future enemy ghosts, shake, cascade labels, special sound/haptics or extra reward celebration. F0 retains its original first-five direction guide; that difference from N is part of the control-feedback bundle and explicitly limits causal claims.

Hold source-compatible Calm/high contrast/large text choices constant within participant comparisons. Calm may simplify decorative rotation and puffing but never hide the rail, landing point, support state, hit marker or actor motion necessary to understand causality. Show moving objects through position, not flashing. Local outlines and readable text carry information independently of hue. Targeting/force/collision must not change with visual settings.

The common pause and accessible DOM controls remain available. On N pause/blur/hidden tab/modal/resize no pending action carries over into an unintended launch. Resizing invalidates timing analysis for that attempt. Menu focus must remain visible and normal text-entry/browser shortcuts must work outside the focused playfield. Do not globally disable scrolling or pinch zoom beyond the active interaction surface.

## Instruction and comprehension

Use neutral condition labels, not “old/better.” Teach F with its source instruction; teach N with the one sentence above. Describe the cart state accurately. The shared encounter may be repeated for practice, with a fixed instruction/practice budget. Remove support teaching text/arrows/emphasis on transfer, retaining normal conditional contact outline. Source opacity/reactions remain common for all direct/cart departures; markers clear when walking eligibility ends. Use validation’s independent-point diagnostic probes and immediate post-attempt intention review; ask what caused the result afterward; do not pause every live decision to interview the player.

Player understanding includes knowing that N does not track a penguin after release, that an early release can be rejected, that moving targets remain live while aiming and flying, and that the parked cart is not interactive. “Explain why the miss occurred” matters more than correctly naming a physics term.

## Access verification and uncertainty

A future isolated prototype must permit a keyboard/non-hold completion, a stationary touch shot, correction back to the starting point, intentional Cancel and safe interruption. Include children/inexperienced players in standard live play, not only adults using a mouse or assisted modes. Report inability to complete by subgroup and investigate repeated discomfort or confusion, even when pooled preference is positive.

Screen-reader menu/focus operation is an explicit target; full nonvisual live defense is not claimed. A later field-summary/target-list design could support it, but it is outside this first experiment and must not silently become another aiming candidate. The experiment can expose limitations; it cannot certify universal accessibility.

Open questions: occlusion, reachable near-stand points, accidental stationary releases, leading moving targets, live pressure, and interpretation of the screen contact plane. These are reasons for testing, not justification to restore a hidden assist or add multiple control layers before collecting evidence.

R3: initial GO is an unskippable three-second countdown with fresh-input gating. Reset/interruption rules follow spec §9; no action carries across attempts. Access requires clean preset-A defense, not passive completion. Validation owns fixed scripts/cohorts and instruments.
