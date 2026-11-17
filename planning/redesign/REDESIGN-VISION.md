# Pineapple Defense: reconciled redesign vision

R2 · 2026-11-17 · Exploratory design, **not validated and not implementation approval**. Revised in response to the [independent review](INDEPENDENT-DESIGN-REVIEW-2026-11-17.md). The [minimum experiment specification](MINIMUM-EXPERIMENT-SPEC.md) is authoritative for the first experiment; [decision log](REVIEW-RECONCILIATION-DECISION-LOG.md) records why R1 changed.

## The hypothesis

Pineapple Defense may become more memorable when a dependable aim lets the player choose between a direct rescue and setting one useful toy in motion. A pineapple releases a cart, the cart sends a little parade home, and the player turns back to protect the cheerful fruit stand.

This is now a hypothesis about **physics-assisted defense**, not a selected full physics playground. Better input alone, better authored defense without moving props, deliberate artillery and tactical defense remain credible alternatives. The old weighted matrix did not establish which was most enjoyable. If players prefer direct defense after learning both, keep the simpler game.

## What should remain distinctive

The player protects a fruit stand from jealous penguins, nobody gets hurt, hats and belly slides explain a successful hit, and Cheer makes mistakes gentle. The environment should supply a silly decision, not replace the penguins with anonymous demolition targets. A cart is useful because it helps defend the stand at the right moment. Merely knocking everything down is not the objective.

Keep the five stage identities and Champions as existing assets and future context. Do not rebuild them before the one-encounter question is answered. Preserve free/offline play: no ads, purchases, accounts, tracking, appointments, forced engagement or network dependency. Comfort and access are available immediately, never bought with Golden Pineapples.

## Pillars and rejection tests

| Pillar | Testable experience | Reject or simplify when… |
|---|---|---|
| I can express my intent | Point, correct if needed, release; even a perfectly stationary aim is valid | The player must move away from a correct point or learn hidden height changes |
| I can explain the outcome | A landing removes a visible support; the cart follows a visible rail | Effects, ambiguous perspective or concealed steering explain the result better than the player's action |
| I defend something | Direct rescue and setup compete for attention | The optimal action is always spam, always the support, or passive watching |
| I learn a useful skill | Timing a support release transfers to a changed arrival schedule | Repeat success is just memorizing the glowing button |
| It stays a small browser toy | One HTML, existing Canvas architecture, bounded objects and no new runtime dependency | A general engine or a large rewrite is needed before the first useful answer |

## First experiment, strictly bounded

One Classic type, one support, one cart and one four-Rockhopper encounter. Compare the original flick unchanged against a correctable screen-point aim with the Classic rendering family and ordinary endpoint collision retained. Then enable the support/cart opportunity with the new aim held fixed. See the specification for the exact three conditions F0/N0/N1 and confounds.

There is no independent power setting, Gentle/Firm, pullback candidate, ricochet, Lobber, Bowling, general debris, Champion phase, shop or progression rework in this experiment. Aiming never pauses time or reload. A separate explicit pause remains a rest function. A non-hold Fire adaptation provides access without making a new tactical resource.

To preserve the original comparison, pineapple flight initially keeps endpoint collision. The cart adds a narrow continuous interaction. This **does not** test the original proposal's swept airborne collision, 3D physics or whole chain-reaction campaign. That reduced ambition is deliberate: discover whether there is a better control and one good recurring decision before designing more systems.

## A representative choice

Three rear penguins approach a cross-lane rail; a fourth is already near the stand. The player can send the urgent one home, clear the rear group directly, or time a support hit so the cart meets them. A mistimed cart visibly passes without collecting the group; a direct rescue remains possible. The timing presets must prove that a different arrival order changes the sensible first action. This is an acceptance condition, not an already verified encounter.

What should be remembered is “I saved the stand by releasing the cart at the right time,” not simply a larger coin reward or a screen full of confetti.

## Package authority

- [Audit](CURRENT-GAMEPLAY-AUDIT.md): pinned implementation facts and source-based usability hypotheses.
- [Research](COMPETITIVE-RESEARCH.md): evidence categories and limits; no competitor-derived numeric tuning claim.
- [Core design](CORE-GAMEPLAY-DESIGN.md): reconciled rules and exclusions, delegating exact parameters to the experiment spec.
- [Levels/progression](LEVEL-AND-PROGRESSION-DESIGN.md): existing systems preserved pending evidence; no campaign implementation mandate.
- [UX/accessibility](UX-AND-ACCESSIBILITY-DESIGN.md): operation, comfort and honest communication.
- [Decisions](REDESIGN-DECISIONS.md): alternatives and conditional direction choice.
- [Validation](PROTOTYPE-AND-VALIDATION-PLAN.md): measurable research gates, not results.
- [Experiment specification](MINIMUM-EXPERIMENT-SPEC.md): sole normative experiment contract.
- [Reconciliation log](REVIEW-RECONCILIATION-DECISION-LOG.md): chosen rules, rejected alternatives and review traceability.

The independent review describes R1 and remains unchanged. This revision replaces its disputed active rules rather than appending caveats to them. Prototype/player evidence is still required; the design is reviewable, not proven.
