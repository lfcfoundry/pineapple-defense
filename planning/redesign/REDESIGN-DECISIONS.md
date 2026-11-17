# Redesign decisions — reconciled R2

2026-11-17 · Not validated. The [independent review](INDEPENDENT-DESIGN-REVIEW-2026-11-17.md) is a required input. This revision withdraws the prior selection of a full physics playground and replaces disputed rules. Detailed decision records are in [REVIEW-RECONCILIATION-DECISION-LOG.md](REVIEW-RECONCILIATION-DECISION-LOG.md); [minimum spec](MINIMUM-EXPERIMENT-SPEC.md) is normative for the first experiment.

## Competing directions remain open

| Direction | Best reason to choose it | Main risk / evidence needed |
|---|---|---|
| Precision artillery | Deliberate spatial planning and visible consequences with little time pressure | Could make the stand decorative and require much puzzle content; no first-experiment implementation |
| Full physics defense playground | Changed field and timed environmental consequences could deepen defense | Complexity/readability/performance are unproven; not selected for production |
| Tactical projectile defense | Accessible, explicit decisions and controlled simulation | Could become menu selection with throw animation; no first-experiment implementation |
| **Dependable authored defense, no active props** | Repairs control with the least new machinery; F0/N0 directly examine it | Could remain forgettable even with better input |
| **Dependable defense plus one constrained cart** | Tests an optional meaningful setup without a general physics world; N1 | May be a novelty, automatic winning button or worse than direct shots |

R1's weighted matrix scored A=3.98, B=4.39, C=4.00 from subjective 1–5 judgments. Its arithmetic is not evidence of fun. As the review showed, reducing B by one point for immediate fun, mastery, variety and identity gives 3.97. The missing simpler direction could win. These scores are historical preference documentation, not an active selection gate; no invented replacement numerical ranking is supplied.

## Six resolved priority decisions

| ID | Chosen rule | Principal consequence |
|---|---|---|
| R2-01 | One screen contact plane; no object/surface-dependent endpoint | Stable empty-space leading; cannot claim physical 3D aiming |
| R2-02 | Stationary aim is valid; press, optionally correct, release | No forced move-away; accidental resting presses must be measured |
| R2-03 | Live aiming, original 0.42 s reload; no Plan mode or buffered shot | No freeze/readiness deadlock; live pressure remains visible rather than hidden by assistance |
| R2-04 | No Gentle/Firm or independent force/power control | Direction/range by point, strength binary; power skill is not a research metric |
| R2-05 | Classic retires after successful landing; no ricochet | No bumper/penetration encounters; preserve F's existing miss continuation only |
| R2-06 | Exact original F0 targeting/leading retained, with N0 and N1 comparisons separated | Supports a control-bundle comparison and a separate cart-opportunity comparison, not a pure gesture claim |

The log records alternatives considered, rationale, uncertainty and changes caused by the review. None of these rules may silently vary per implementation session. If an unresolved empirical issue requires a design change, version the specification before another participant sees it.

## Conditional recommendation

Compare F0 with N0 first. If N0 does not improve intent reliability/comprehension without excluding children, stop rather than use cart excitement to excuse it. Compare N1 with N0 after practice and timing transfer. If the cart adds no repeatable decision or is worse than direct defense, keep the simpler control direction and abandon the cart hypothesis. If both pass, authorize only the next narrow design question; do not infer a need for a full rigid-body simulation or a 25-wave rewrite.

Only the original flick and one new point control are in the first experiment. Pullback, hybrid flick/correction, independent power actions and elaborate trajectory previews are deferred. The review recommended D/S plus an intact reference; the current task specifically requires original flick versus new control, and the one-control reduction avoids splitting a small sample across too many candidates. Retain pullback as a future fallback if point aiming fails for a diagnosed reason, not a mandatory third implementation now.

## Preserved constraints

No hidden aim snap or sticky memory is reintroduced into N. F retains its source's narrow candidate selection because that is the actual reference, despite historical removal of the configurable Aim Help/Sticky Aim settings. No inference that the owner rejected all launch-time prediction is justified by the source record.

Keep kid-friendly reactions, Cheer, browser-first single HTML, offline operation, Canvas, access options, no ads/purchases/accounts/tracking, and no new runtime dependency. Comfort is never currency-gated. Existing progression/achievement ownership is not reset to run an experiment.

## Genuine open questions

- Can players understand a fixed screen landing point and the old noncolliding transit, or does one of those conventions need a later camera/collision experiment?
- Does N's point placement/leading beat the original automatic prediction for the intended young audience?
- Does stationary release reduce errors more than it creates accidental throws? Does finger occlusion prevent useful correction?
- Does the chosen aim area remain adequate as threats approach the stand and on short landscape layouts?
- Do the timing presets actually reverse useful priorities while keeping direct shots and reasonable mistake recovery viable?
- Does support timing transfer without a glowing instruction, and is the cart still liked after repetition?
- Can the isolated interaction meet actual modest-device stability and keyboard/non-hold access gates?

These require qualification/prototype/player evidence. They do not leave surface semantics, force, reload or collision choices open. Save migration, helper redesign, extra fruit roles and Champion changes are deferred design work, not prerequisites or implied scope for the first experiment.
