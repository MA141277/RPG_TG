# Core Production Integration Queue

## Phase

- Parent phase:
  - `Phase 1: Runtime Closure`

## Queue Goal

Advance the modularization target by closing the still-relevant production integration gaps around engine ownership, save ownership, and runtime ownership.

## Boundary

This queue covers:

- fresh baseline reconciliation against current `src/main.ts`, `src/core/runtime/**`, `src/core/engine/**`, and startup/save seams
- engine/save/runtime ownership work that materially improves modular boundaries
- closeout records needed to roll this queue back into the modularization target

This queue does not cover:

- Child 4 interactive-runtime extraction
- Child 5 presenter/render decoupling
- full task runtime extraction
- full house runtime extraction
- creating a second Blueprint target

## Parent Target

- Target spec:
  - `docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md`
- Target plan:
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`

## Execution State

- Status: `done`
- Last Updated: `2026-07-06`
- Current Focus: `The orphaned core engine seam is retired, the placeholder save owner line is replaced, and runtime-ownership closeout concluded that no separate Phase 1 state-sync canonicalization queue is currently justified.`
- Active Task:
  - `none`
- Next Step:
  - `If Phase 1 continues, promote shell-thinning-and-final-ownerization rather than state-sync-and-runtime-canonicalization unless a new production runtime/state blocker is later proven.`
- Verification:
  - `Engine retirement, save-envelope cutover, runtime ownership audit, targeted source-path review, npm run build:test, and targeted robustness regressions all passed.`
- Notes:
  - `This queue belongs to the current period's modularization target. It is not a same-period sibling target.`

## Baseline Recheck

- Recheck result: `narrowed`
- Notes:
  - `Runtime dispatch already reaches the real main path through commitRuntimeRequest() -> dispatchRuntimeRequest().`
  - `main.ts` no longer uses legacy bootstrap adapters or bootstrapLegacyMain().`
  - `loadSaveData()` in main.ts is still a placeholder returning null, and the core save envelope APIs are still not used by the production continue/restore path.`
  - `The orphaned src/core/engine/** seam and its unused supporting types have now been retired because they were not imported by the production startup path and only duplicated a minimal CoreGameState skeleton outside the real startup/save flow.`
  - `The placeholder save owner line is now replaced by a browser save record helper that reads and writes through the core save-envelope APIs, although full runtime-state hydration still remains a separate canonicalization question if Phase 1 later proves it necessary.`
  - `Runtime ownership closeout result: commitRuntimeRequest() -> dispatchRuntimeRequest() remains the production gameplay write-back path for the covered runtime flows reviewed in main.ts.`
  - `syncState() and the canonical state-sync helper family currently exist as contract/helper seams, but they are not the production owner line for the audited startup/continue/restore/runtime dispatch path.`
  - `The remaining direct gameState mutations found in main.ts are concentrated in shell/view transitions such as leaving city, city-3d view swaps, map auto-advance framing, and render-time city-NPC refresh. Those are better classified as shell-thinning residue than runtime/state canonicalization blockers.`
  - `Closeout decision: do not promote state-sync-and-runtime-canonicalization at this time. If Phase 1 continues, the more justified follow-up queue is shell-thinning-and-final-ownerization.`

## Current Queue

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.core-production-integration.baseline-reconcile` | `done` | `Confirm the narrowed baseline and record the legal engine owner-line choice.` | `none` | `Closed with retirement as the default direction for src/core/engine/** pending stronger production evidence.` |
| `task.core-production-integration.engine-owner-line` | `done` | `Adopt or retire the orphaned engine seam so startup ownership becomes singular.` | `task.core-production-integration.baseline-reconcile` | `Closed by retiring the unused core engine seam and its isolated supporting types after verifying no production startup path imported them.` |
| `task.core-production-integration.save-envelope-cutover` | `done` | `Route real load/save behavior through the core save envelope APIs.` | `task.core-production-integration.engine-owner-line` | `Closed by replacing placeholder loadSaveData() behavior with browser save-envelope read/write helper wiring and targeted regression proof.` |
| `task.core-production-integration.runtime-ownership-closeout` | `done` | `Reconfirm commitRuntimeRequest()/dispatchRuntimeRequest() ownership and sync closeout artifacts.` | `task.core-production-integration.save-envelope-cutover` | `Closed with no current justification for state-sync-and-runtime-canonicalization; remaining residue points to shell-thinning instead.` |

## Task Execution Contracts

### `task.core-production-integration.baseline-reconcile`

- Purpose:
  - `Freeze the queue's starting truth against the current codebase and choose the legal direction for the orphaned engine seam.`
- Must examine:
  - `src/main.ts`
  - `src/application/startup/startup-session-coordinator.ts`
  - `src/core/runtime/state-sync-runtime.ts`
  - `src/core/engine/**`
- Required output:
  - `An updated baseline note that says whether src/core/engine/** is the future production owner or retirement residue.`
  - `A promoted next-step statement for task.core-production-integration.engine-owner-line.`
- Done when:
  - `The queue can explain the current runtime/save/engine baseline without contradiction and the next owner-line decision is explicit.`
- Verification:
  - `Fresh source-baseline recheck recorded in this queue progress log.`
- Failure mode:
  - `If the baseline cannot support a defensible owner-line choice, mark the task blocked and record the unresolved seam clearly.`

### `task.core-production-integration.engine-owner-line`

- Purpose:
  - `Turn the engine seam into a singular production owner line by either adopting it on the startup path or retiring it as unused transition residue.`
- Must examine:
  - `src/main.ts`
  - `src/application/startup/**`
  - `src/core/engine/**`
  - `tests/robustness.test.cjs`
- Required output:
  - `Code and queue notes showing one explicit engine owner path.`
  - `Any necessary regression coverage proving startup does not depend on an ambiguous duplicate seam.`
- Done when:
  - `The production startup path no longer leaves src/core/engine/** in an unresolved adopt-vs-retire state.`
- Verification:
  - `Targeted source-path check plus relevant regression test update if production ownership changes.`
- Failure mode:
  - `If adopting the seam would create a worse duplicate owner story, retire it and record why retirement is the cleaner modular answer.`

### `task.core-production-integration.save-envelope-cutover`

- Purpose:
  - `Move real continue/restore/load-save behavior onto the chosen core save envelope path instead of leaving the production path on placeholder or ad hoc behavior.`
- Must examine:
  - `src/main.ts`
  - `src/application/startup/**`
  - `src/core/save/**`
  - `tests/robustness.test.cjs`
- Required output:
  - `A real load/save flow decision wired into the production path.`
  - `Updated verification notes describing how browser save source and write-back now travel through the chosen envelope.`
- Done when:
  - `loadSaveData() placeholder behavior is no longer the effective production continue/restore owner line for this queue's scope.`
- Verification:
  - `Targeted continue/restore and save-path regression proof, or an explicit waiver note if a repository constraint prevents full automation.`
- Failure mode:
  - `If the repository cannot complete full save cutover in this queue, the residual blocker must be narrow enough to justify a later queue rather than a vague carry-forward note.`

### `task.core-production-integration.runtime-ownership-closeout`

- Purpose:
  - `Reconfirm that commitRuntimeRequest()/dispatchRuntimeRequest() and the surrounding state-sync seam now form a coherent runtime owner story after the engine/save work closes.`
- Must examine:
  - `src/main.ts`
  - `src/core/runtime/**`
  - `src/application/runtime/**`
  - `tests/robustness.test.cjs`
- Required output:
  - `Queue closeout notes stating what runtime ownership was proven, what residue remains, and whether a later Phase 1 queue must be promoted.`
  - `Pointer updates for target-level artifacts if this queue closes.`
- Done when:
  - `The queue can either close with a coherent runtime ownership claim or open a narrowly justified follow-up queue with explicit residue.`
- Verification:
  - `Document consistency check plus targeted runtime-path regression evidence.`
- Failure mode:
  - `Do not close this task with a hand-wavy "mostly better" note; either prove the runtime owner story or record the exact residual blocker and open the right follow-up queue.`

## Next Executable Task

- Task ID:
  - `none`
- Required action before promotion:
  - `This queue is closed. Open the target plan and decide whether to promote shell-thinning-and-final-ownerization as the next Phase 1 queue.`
- Expected output:
  - `A target-level decision on whether Phase 1 continues through shell-thinning or pauses without a new active queue.`

## Candidate Backlog

- `task.core-production-integration.bridge-canonicalization`
  - State:
    - `candidate`
  - Reason:
    - `May be useful later if the repository decides to simplify the remaining state-sync bridge after this queue closes.`
  - Promote when:
    - `runtime-ownership-closeout proves a real duplicate bridge owner story that still affects production modularization.`

## State Transition Rules

1. Queue tasks move through `candidate -> queued -> active -> done/blocked/dropped`.
2. Only one task in this queue may be `active` at a time.
3. Any follow-up cleanup that is not required for this queue's stated goal should be opened as a later task or a later queue, not silently appended here.

## Progress Log

- 2026-07-06
  - Summary: `Converted core-production-integration from a mistaken same-period sibling target into the first real queue under the current period's modularization target.`
  - Verification: `Document consistency check plus source-baseline recheck`
  - Next: `Resume task.core-production-integration.baseline-reconcile.`
- 2026-07-06
  - Summary: `Closed baseline-reconcile after confirming that runtime dispatch is already canonical on the main path, save-envelope seams still lack production cutover, and src/core/engine/** remains an orphaned seam with no current production imports.`
  - Verification: `Fresh source-baseline recheck across main.ts, startup-session-coordinator.ts, state-sync-runtime.ts, src/core/engine/**, src/core/save/**, and robustness tests covering engine/save seams`
  - Next: `Run task.core-production-integration.engine-owner-line with retirement as the default direction unless real production adoption evidence appears.`
- 2026-07-06
  - Summary: `Retired the orphaned core engine seam by deleting src/core/engine/** and its unused supporting engine context/registry types, then replaced the old engine-presence regression with a retirement regression.`
  - Verification: `npm run build:test` plus targeted robustness tests for core-production-integration retirement, save envelope, child 29 startup, and state-sync save seams`
  - Next: `Run task.core-production-integration.save-envelope-cutover to replace placeholder loadSaveData() behavior with the real core save path.`
- 2026-07-06
  - Summary: `Replaced the placeholder save owner line with a browser save record helper that reads and writes through the core save-envelope APIs, persists selected character/mod metadata, and saves on startup-session apply plus beforeunload.`
  - Verification: `npm run build:test` plus targeted robustness tests for browser save record round-trip, main.ts save-envelope cutover, child 22/29 startup paths, existing save envelope coverage, and state-sync save seam guards`
  - Next: `Run task.core-production-integration.runtime-ownership-closeout to record whether any later Phase 1 runtime/state canonicalization queue is still justified.`
- 2026-07-06
  - Summary: `Closed runtime-ownership-closeout after confirming that covered production gameplay write-back still routes through commitRuntimeRequest() -> dispatchRuntimeRequest(), while syncState() remains a non-production helper seam and the remaining direct gameState mutations are better classified as shell/view owner residue.`
  - Verification: `Targeted source-path audit across main.ts, runtime-dispatch.ts, state-sync helper family, house-runtime follow-up bridge, and existing runtime ownership regressions`
  - Next: `Do not promote state-sync-and-runtime-canonicalization now. If Phase 1 continues, promote shell-thinning-and-final-ownerization instead.`
