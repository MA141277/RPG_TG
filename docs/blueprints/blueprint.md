# Current Blueprint

This file is the single current owner document for repository execution under the Blueprint workflow.

## Goal

Use the Blueprint workflow as the repository's only active governance path and drive the current-period `mod-first` complete-modularization objective through one current target plus multiple iteration queues.

## Scope

This blueprint currently governs:

- one current-period repository target: `project complete modularization`
- queue sequencing under that target
- repository-level execution truth for active vs queued vs historical work

This blueprint does not currently govern:

- queue-local implementation checklists
- retroactive rewriting of all historical `docs/superpowers/**` documents

## Execution State

- Status: `in-progress`
- Last Updated: `2026-07-06`
- Current Phase: `phase-1-runtime-closure`
- Current Focus: `The current blueprint has one current target for this period: project complete modularization. The active phase is Phase 1 Runtime Closure, core-production-integration is closed, and the next candidate decision is whether to promote shell-thinning-and-final-ownerization.`
- Current Target Spec:
  - `docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md`
- Current Target Plan:
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
- Active Queue:
  - `none`
- Active Queue Task:
  - `none`
- Next Step:
  - `Resume the modularization target plan, review the closed core-production-integration queue, and decide whether Phase 1 should promote shell-thinning-and-final-ownerization next.`
- Verification:
  - `Current-target Blueprint documents, explicit acceptance rules, and first queue artifacts exist.`
- Notes:
  - `Blueprint may have multiple targets across different periods, but this period must keep exactly one current target. Add same-period modularization work through queue documents instead.`

## Current Target

- Target:
  - `project complete modularization`
- Role:
  - `Drive the repository from partial mod-first convergence to a fully production-owned mod-first architecture.`
- Governing artifacts:
  - `docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md`
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`

## Queue Portfolio

### Phase 1: Runtime Closure

- `core-production-integration`
  - Queue:
    - `docs/blueprints/queues/core-production-integration-queue.md`
  - Role:
    - `Close engine/save/runtime ownership gaps that still block cleaner modular boundaries.`

- `shell-thinning-and-final-ownerization`
  - Role:
    - `Candidate queue for the remaining unjustified production owner lines in src/main.ts after core production integration closes.`

- `state-sync-and-runtime-canonicalization`
  - Role:
    - `Candidate queue only if canonical runtime/state ownership still blocks final closure after the active queue closes.`

### Phase 2: Contribution Closure

- `builtin-content-deprivileging-closeout`
  - Role:
    - `Candidate queue for removing any remaining builtin-only content privilege paths.`

- `unified-contribution-intake-closeout`
  - Role:
    - `Candidate queue for proving extension families really enter through shared contract and registry seams.`

- `playable-family-gap-audit`
  - Role:
    - `Candidate queue only if a still-unified playable family gap is proven by later review.`

### Phase 3: Authoring Closure

- `authoring-entrypoint-and-fail-closed-closure`
  - Role:
    - `Candidate queue for proving authors can add same-family content without multi-point glue edits and with fail-closed enforcement.`

- `framework-scaffold-and-template-closure`
  - Role:
    - `Candidate queue for extending scaffold, validator, template, and CI entrypoints beyond the currently-closed playable slice.`

- `ui-runtime-contract-consumption`
  - Role:
    - `Candidate queue only if runtime-facing UI contract consumption is still required for complete modularization.`

### Phase 4: Final Mod-First Acceptance

- `first-party-mod-acceptance`
  - Role:
    - `Candidate queue for proving builtin content is now effectively a first-party mod rather than a privileged framework payload.`

- `historical-residue-disposition`
  - Role:
    - `Candidate queue for classifying remaining residue into accepted history, queued migration, or out-of-scope items.`

- `final-acceptance-closeout`
  - Role:
    - `Candidate queue for final acceptance proof and closeout only after earlier phases pass.`

### Completed Queue

- `blueprint-workflow-bootstrap`
  - Queue:
    - `docs/blueprints/queues/blueprint-workflow-bootstrap-queue.md`
  - Role:
    - `Historical record of the workflow bootstrap and handoff into the current-target model.`

### Historical / Future Targets

- `other-period targets`
  - Role:
    - `Allowed by the workflow, but not current in this period.`

### Historical Reference

- `legacy-superpowers-history`
  - Role:
    - `Historical architecture, verification, and boundary reference only.`

## Queue Summary

| Queue | State | Active Task | Notes |
| --- | --- | --- | --- |
| `core-production-integration` | `done` | `none` | Phase 1 closeout queue completed; no current justification for state-sync-and-runtime-canonicalization. |
| `blueprint-workflow-bootstrap` | `done` | `none` | Bootstrap is complete and retained only as history. |
| `legacy-superpowers-history` | `historical-only` | `none` | Not a valid execution controller. |

## Decision Rules

1. New execution must begin from `docs/blueprints/project-progress.md`.
2. This blueprint may have multiple targets across different periods, but only one current target at a time.
3. New same-period modularization iterations must be added as queue tasks, not as replacement targets for the same period.
4. Only one queue task may be `active` across the repository at a time unless a stronger written reason says otherwise.
5. Old `docs/superpowers/**` workflow files may inform boundary history, but must not decide new execution ordering.

## Progress Log

- 2026-07-06
  - Summary: `Created the Blueprint workflow owner document and linked it to the new global entry file and bootstrap queue.`
  - Verification: `Document existence check`
  - Next: `Onboard the first real modularization queue.`
- 2026-07-06
  - Summary: `Normalized the Blueprint model so different periods may have different targets, while the current period keeps project complete modularization as the one current target and moves core-production-integration under it as an active queue.`
  - Verification: `Document consistency check`
  - Next: `Resume the active queue task from the complete-modularization target plan.`
- 2026-07-06
  - Summary: `Accepted the active queue baseline reconcile and advanced the current execution pointer to task.core-production-integration.engine-owner-line.`
  - Verification: `Blueprint pointer sync check against the active queue`
  - Next: `Keep the current target in Phase 1 and resolve the orphaned engine seam direction.`
- 2026-07-06
  - Summary: `Accepted the retirement of the orphaned core engine seam and advanced the current execution pointer to task.core-production-integration.save-envelope-cutover.`
  - Verification: `Blueprint pointer sync check against the active queue after targeted verification passed`
  - Next: `Keep the current target in Phase 1 and close the production save owner gap.`
- 2026-07-06
  - Summary: `Accepted the save-envelope cutover and advanced the current execution pointer to task.core-production-integration.runtime-ownership-closeout.`
  - Verification: `Blueprint pointer sync check against the active queue after targeted save/startup verification passed`
  - Next: `Keep the current target in Phase 1 and decide whether further runtime/state canonicalization is still required.`
- 2026-07-06
  - Summary: `Accepted the core-production-integration closeout and removed any current active queue after concluding that remaining Phase 1 residue is shell-thinning-oriented rather than state-sync canonicalization debt.`
  - Verification: `Blueprint pointer sync check against the closed queue and target plan`
  - Next: `If Phase 1 continues, promote shell-thinning-and-final-ownerization as the next queue.`
