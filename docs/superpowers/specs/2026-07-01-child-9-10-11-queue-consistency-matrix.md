# Child 9-10-11 Queue Consistency Matrix

> **Role:** This document is a cross-check aid. It does not replace the weekly plan, child plans, or Child 10 baseline. Its purpose is to compress the current queue truth into one audit table so Child 9 closeout, Child 10 closeout, and Child 11 unlock can be validated quickly without re-reading the full doc set first.

**Date:** `2026-07-01`

**Primary Queue Controller:** `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`

**Child 10 Baseline Authority:** `docs/superpowers/specs/2026-07-01-runtime-ownerization-baseline.md`

## 1. Source-Of-Truth Order

When two docs disagree about current queue state, use this priority order:

1. `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
2. active child plan `Execution State`
3. `docs/superpowers/specs/2026-07-01-runtime-ownerization-baseline.md`
4. `docs/superpowers/plans/2026-06-29-mod-first-engine-runtime-extraction-plan.md`
5. weekly visibility artifacts

This matrix is a verification shortcut only. It is not the canonical controller.

## 2. Current Queue Truth Snapshot

| Item | Current Truth |
| --- | --- |
| next executable child | `Child 9 Runtime Contract Hardening` |
| queued review child | `Child 10 Runtime Ownerization Review And Baseline` |
| locked implementation child | `Child 11 Sub-Runtime Ownerization Implementation` |
| may Child 10 start now | `no` |
| may Child 11 start now | `no` |
| Child 11 unlock owner | `Child 10 baseline + Child 11 spec/plan + weekly queue sync` |

## 3. Consistency Matrix

| Concern | Canonical Statement | Primary Source | Supporting Source(s) | Quick Audit Question |
| --- | --- | --- | --- | --- |
| active next child | `Child 9` is the only executable next child right now. | `weekly-orchestration-plan.md` | `runtime-contract-hardening-plan.md`, `weekly-review-index.md`, `weekly-implementation-visibility-plan.md` | Does any current-state doc imply Child 10 or Child 11 can start before Child 9 closes? |
| Child 10 role | `Child 10` is a review/baseline child, not a production ownerization child. | `2026-07-01-runtime-ownerization-review-spec.md` | `2026-07-01-runtime-ownerization-review-plan.md`, `2026-07-01-runtime-ownerization-baseline.md` | Does any doc imply Child 10 removes adapters or ownerizes runtime code directly? |
| Child 10 output | Child 10 must finalize the baseline document that freezes Child 11 execution. | `2026-07-01-runtime-ownerization-baseline.md` | `2026-07-01-runtime-ownerization-review-spec.md`, `2026-07-01-runtime-ownerization-review-plan.md` | Is the baseline clearly named as the unlock artifact? |
| Child 10 start condition | Child 10 starts only after Child 9 completes and queue sync promotes Child 10. | `weekly-orchestration-plan.md` | `runtime-ownerization-review-plan.md`, `mod-first-engine-runtime-extraction-plan.md` | Does any doc treat Child 10 as executable before Child 9 closeout? |
| Child 11 role | Child 11 is the first production ownerization child for covered shared dispatch, interaction, house, and settlement seams. | `2026-07-01-runtime-ownerization-baseline.md` | `mod-first-runtime-subsystems-spec.md`, `weekly-orchestration-plan.md` | Is Child 11 described as broader than the baseline-approved seams? |
| Child 11 status | Child 11 is `locked`, not `queued-not-started`, until explicit unlock conditions are met. | `weekly-orchestration-plan.md` | `weekly-review-index.md`, `weekly-next-split-review.md`, `weekly-implementation-visibility-plan.md` | Does any doc imply Child 11 can begin from queue reservation alone? |
| Child 11 unlock condition | Child 11 unlock requires completed Child 10 baseline, authored Child 11 spec/plan, and weekly queue sync that records the unlock. | `2026-07-01-runtime-ownerization-baseline.md` | `weekly-orchestration-plan.md`, `runtime-ownerization-review-plan.md` | Are all three unlock gates named together everywhere they matter? |
| Child 11 contract posture | Child 11 implements against frozen Child 9/10 surfaces and must not casually reopen them. | `2026-07-01-runtime-ownerization-baseline.md` | `2026-07-01-runtime-ownerization-review-spec.md` | Does any implementation-facing doc allow Child 11 to reopen carrier or contract design by default? |
| Child 11 scope | Child 11 may target shared dispatch convergence, Interaction Runtime ownerization, House Runtime ownerization, and Effect Settlement alignment only. | `2026-07-01-runtime-ownerization-baseline.md` | `mod-first-runtime-subsystems-spec.md`, `weekly-module-map.md` | Does any doc let Child 11 drift into boot/mod/save/presenter/UI/resource scope? |
| adapter disposition owner | Child 10 baseline decides which adapters are retained, thinned, or targeted for removal in Child 11. | `2026-07-01-runtime-ownerization-baseline.md` | `weekly-architecture-report.md`, `weekly-module-map.md` | Is adapter keep/remove policy tied back to Child 10, not left ad hoc for Child 11? |
| `main.ts` coupling owner | Child 10 baseline decides which `main.ts` responsibilities stay in shell and which move into Child 11 runtime ownership. | `2026-07-01-runtime-ownerization-baseline.md` | `weekly-orchestration-plan.md` | Is `main.ts` reduction described through the baseline rather than intuition? |
| visibility sync rule | Weekly artifacts must preserve one queue truth: `Child 9 -> Child 10 -> Child 11(locked)`. | `weekly-implementation-visibility-plan.md` | `weekly-review-index.md`, `weekly-next-split-review.md`, `weekly-architecture-report.md`, `weekly-module-map.md` | Do all five weekly artifacts describe the same sequence? |
| parent plan sequence | The parent orchestration chain now extends through Child 9, Child 10, and Child 11 rather than stopping at Child 8. | `mod-first-engine-runtime-extraction-plan.md` | `weekly-orchestration-plan.md` | Would resuming the parent plan still misroute work after Child 8? |

## 4. Drift Symptoms That Require Correction

If any of these appear, queue docs are out of sync and must be corrected before implementation continues:

- a doc says `None currently recorded beyond Child 9`
- a doc says Child 10 still needs to be authored or freshly reviewed before it can exist
- a doc says Child 11 is merely `queued` instead of `locked`
- a doc says Child 11 can start once Child 10 completes, but omits the required Child 11 spec/plan
- a doc says Child 10 or Child 11 may redesign boot, mod, save, presenter, UI, or resource-planning boundaries by default
- the parent plan task chain still ends at Child 8

## 5. Fast Audit Checklist

Use this checklist before:

- promoting Child 10 after Child 9 closeout
- promoting Child 11 after Child 10 closeout
- resuming work after interruption

- [ ] weekly orchestration plan still names `Child 9` as next executable until Child 9 actually closes
- [ ] Child 10 is still described as `review / baseline governance`
- [ ] Child 10 baseline is still named as the Child 11 unlock artifact
- [ ] Child 11 is still described as `locked`
- [ ] Child 11 unlock still requires `Child 10 baseline + Child 11 spec/plan + weekly unlock sync`
- [ ] parent plan task chain still matches the Child 9 -> Child 10 -> Child 11 sequence
- [ ] weekly visibility artifacts still use the same queue truth

## 6. Intended Use

This matrix is useful for three narrow jobs:

- closeout review after Child 9
- closeout review after Child 10
- pre-start audit before Child 11

It should not be used as a substitute for reading:

- the active child plan
- the weekly orchestration plan
- the Child 10 baseline
