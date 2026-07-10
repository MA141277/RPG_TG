# Entry Shell Bootstrap Ownerization Queue

## Control Block

- queue_id: `queue.entry-shell-bootstrap-ownerization`
- belongs_to_version: `target.project-complete-modularization`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-10`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `active`
- queue_class: `conditional`
- active_task: `task.entry-shell-bootstrap-ownerization.entry-shell-bootstrap-residue-review`
- next_task: `none`
- closeout_status: `in-progress`
- next_effect: `none`
- sync_status: `pending`
- sync_scope: `none`
- sync_summary: `No repository sync has run for this newly admitted queue yet.`
- blocked_by: []
- allowed_item_classifications:
  - `current-target-item`
- reject_item_classifications:
  - `content-pipeline-item`
  - `asset-pipeline-item`
  - `future-target-candidate`

## Human Context

### Queue Explanation

- Goal:
  - `Close the remaining entry-shell/bootstrap owner line by moving startup activation/bootstrap state out of src/main.ts and then re-reviewing the remaining runtime assembly and house-runtime residue.`
- Forbidden expansions:
  - `Do not widen this queue into canonical runtime-state bridge unification ahead of queue.canonical-runtime-state-sync-unification.`
  - `Do not widen this queue into defaultRuntimeContent/defaultPack*/pack-content-access cleanup ahead of queue.active-content-consumption-closure.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`

### Queue Snapshot

- queue_goal: `Move entry-shell startup activation/bootstrap state behind one application-owned seam before reconsidering repeated runtime commit assembly and house-runtime creation residue.`
- task_count: `3`
- completed_task_count: `2`
- remaining_task_count: `1`
- active_task_summary: `The current active task re-checks whether the remaining repeated runtime commit assembly and house-runtime residue stays as one bounded in-queue continuation or returns to version review after the bootstrap seam cut landed.`
- task_briefs:
  - `task.entry-shell-bootstrap-ownerization.baseline-reconcile: freeze the smallest lawful first entry-shell/bootstrap ownerization slice and confirm the queue remains bounded.`
  - `task.entry-shell-bootstrap-ownerization.entry-shell-bootstrap-state-owner-lift: move startup activation/bootstrap state out of src/main.ts and behind one entry-shell seam.`
  - `task.entry-shell-bootstrap-ownerization.entry-shell-bootstrap-residue-review: reassess the remaining repeated runtime commit assembly and house-runtime residue after the first bootstrap seam cut lands.`

### Operator Snapshot Contract

- `The fixed operator receipt must source 当前执行队列 from queue_id.`
- `The fixed operator receipt must source 当前任务 from active_task.`
- `The fixed operator receipt must source 当前队列目标 from queue_goal.`
- `Queue Snapshot exists to support concise operator visibility without exposing Blueprint internal ranking or admission internals by default.`

### Admission Preconditions

- `This queue was admitted only after the version plan synchronized the existing candidate identity and current bounded admission basis.`
- `Single-active-queue mode remains in force; no second queue may be promoted while this queue is active.`
- `The queue must stay on entry-shell/bootstrap ownerization and must not silently absorb canonical runtime bridge cleanup, active-content consumption cleanup, or broader composition residue that belongs to later review.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, run one minimum repository sync batch.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `Repository sync failure must not be copied into blocked_by, queue closeout gates, or version scheduling truth.`

### Activation Order

1. `Version plan admission review concluded before this queue became live execution truth.`
2. `This queue doc now acts as the queue-level governor for the admitted entry-shell/bootstrap ownerization work.`
3. `Implementation may begin only through the written active task below.`

### Recovery Rule

- `Do not recreate or re-audit this queue from scratch while the recorded entry-shell/bootstrap evidence remains valid.`
- `Resume from this queue doc and the version-plan candidate record unless new material evidence invalidates the admitted basis.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.entry-shell-bootstrap-ownerization.baseline-reconcile` | `completed` | `Freeze the smallest lawful first entry-shell/bootstrap ownerization slice and confirm the admitted queue still stands on current source truth.` | `none` | `Completed after queue-local inspection froze startup activation/bootstrap state ownerization ahead of repeated runtime commit assembly and house-runtime residue.` |
| `task.entry-shell-bootstrap-ownerization.entry-shell-bootstrap-state-owner-lift` | `completed` | `Move startup activation/bootstrap state out of src/main.ts and behind one application-owned entry-shell seam.` | `task.entry-shell-bootstrap-ownerization.baseline-reconcile` | `Completed after src/application/startup/entry-shell-bootstrap-state.ts took ownership of the covered bootstrap activation state and verification passed.` |
| `task.entry-shell-bootstrap-ownerization.entry-shell-bootstrap-residue-review` | `active` | `Reassess the remaining repeated runtime commit assembly and house-runtime residue after the first bootstrap seam cut lands.` | `task.entry-shell-bootstrap-ownerization.entry-shell-bootstrap-state-owner-lift` | `Active now that the first owner-lift slice landed and verification passed.` |

### Task Definitions

#### `task.entry-shell-bootstrap-ownerization.baseline-reconcile`

##### Control Block

- task_id: `task.entry-shell-bootstrap-ownerization.baseline-reconcile`
- state: `completed`
- task_kind: `execution`
- scope:
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - `docs/blueprints/queues/entry-shell-bootstrap-ownerization-queue.md`
  - `src/main.ts`
  - `src/application/startup/startup-session-coordinator.ts`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `src/main.ts`
  - `src/application/startup/startup-session-coordinator.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `canonical runtime-state bridge queue scope`
  - `active-content consumption cleanup queue scope`
  - `broader cross-mechanism composition scope`
- done_when:
  - `Queue truth names the smallest lawful first implementation slice that can land under the admitted entry-shell/bootstrap boundary.`
  - `Queue-local evidence confirms startup activation/bootstrap state ownerization is smaller than the remaining repeated runtime commit assembly and house-runtime residue.`
  - `The first entry-shell/bootstrap cut is frozen before implementation begins.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "createBaseGameContentPack|loadDefaultRuntimeContent|builtInScenarioPacks|runModRuntime|createActiveGameContentContextFromModActivation|createHouseRuntimeInstance|commitRuntimeRequest" src/main.ts tests/robustness.test.cjs`
- if_blocked:
  - `Record the blocker in this queue doc rather than widening scope silently.`
  - `Return control to version review only if fresh evidence disproves this queue's admitted basis.`
- promote_next_if_done: `task.entry-shell-bootstrap-ownerization.entry-shell-bootstrap-state-owner-lift`
- stop_if:
  - `Fresh inspection proves the remaining work belongs primarily to canonical runtime-state unification, active-content cleanup, or broader composition closure instead of entry-shell/bootstrap ownerization.`

##### Human Context

- task_brief:
  - `Freeze the first lawful entry-shell/bootstrap ownerization slice before queue-local code work starts.`
- task_outcome_summary:
  - `Completed after queue-local inspection froze startup activation/bootstrap state ownerization as the first bounded slice while leaving repeated runtime commit assembly and house-runtime creation for later in-queue review.`
- Purpose:
  - `Prevent the admitted queue from widening into runtime bridge cleanup, active-content cleanup, and entry-shell ownerization all at once.`
- Failure mode:
  - `Do not jump directly into repeated runtime commit or house-runtime rewiring before the smaller startup activation/bootstrap state owner line is named and bounded.`
- Fresh baseline findings:
  - `src/main.ts still owns baseGameContentPack creation, builtin default mod manifest/source bootstrap, loadDefaultRuntimeContent injection, builtin startup activation, and active game content context bootstrap on the live entry path.`
  - `src/main.ts still wires builtInScenarioPacks into the startup shell entry flow even though that builtin startup catalog can move behind the same entry-shell seam as the covered activation state.`
  - `Repeated commitRuntimeRequest callsites and createHouseRuntimeInstance remain live owner residue, but they are broader than the first startup activation/bootstrap state cut because they extend deeper into runtime orchestration and house-session behavior than the covered shell bootstrap state.`
- Frozen first slice:
  - `The first lawful implementation slice is to move base content activation, builtin startup activation, startup content-context assembly, and builtin scenario-pack bootstrap wiring behind one application-owned entry-shell bootstrap module while preserving current startup behavior.`
  - `Repeated runtime commit assembly and house-runtime creation stay in-queue for later review and must not be silently absorbed into this first cut.`

#### `task.entry-shell-bootstrap-ownerization.entry-shell-bootstrap-state-owner-lift`

##### Control Block

- task_id: `task.entry-shell-bootstrap-ownerization.entry-shell-bootstrap-state-owner-lift`
- state: `completed`
- task_kind: `execution`
- scope:
  - `src/application/startup/**`
  - `src/main.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/**`
- must_inspect:
  - `src/main.ts`
  - `src/application/startup/startup-session-coordinator.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `state-sync-runtime bridge ownership`
  - `defaultRuntimeContent/defaultPack*/pack-content-access cleanup`
  - `house-runtime creation and repeated runtime commit assembly beyond the first startup bootstrap seam`
- done_when:
  - `src/main.ts no longer directly owns baseGameContentPack creation, builtin default mod source bootstrap, builtin startup activation, startup content-context assembly, or builtin scenario-pack bootstrap wiring on the covered entry path.`
  - `One application-owned entry-shell bootstrap module owns the covered startup activation/bootstrap state and exposes the required startup dependencies back to main.ts.`
  - `Verification passes without widening into runtime-state bridge or active-content consumption cleanup.`
- verify_with:
  - `node --test --test-name-pattern "entry shell bootstrap state ownerization moves startup activation bootstrap state out of main.ts" tests/robustness.test.cjs`
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`
- if_blocked:
  - `Record the concrete blocker in this queue doc instead of widening into runtime-state bridge cleanup or content-consumption cleanup.`
  - `Do not absorb repeated runtime commit assembly or house-runtime creation just to force this task through.`
- promote_next_if_done: `task.entry-shell-bootstrap-ownerization.entry-shell-bootstrap-residue-review`
- stop_if:
  - `The required seam expands into canonical runtime-state bridge redesign or active-content cleanup instead of a bounded entry-shell/bootstrap cut.`

##### Human Context

- task_brief:
  - `Lift startup activation/bootstrap state out of src/main.ts and behind one application-owned entry-shell seam.`
- task_outcome_summary:
  - `Completed after the covered entry path stopped defining startup activation/bootstrap state directly inside src/main.ts and now consumes src/application/startup/entry-shell-bootstrap-state.ts as the application-owned bootstrap seam.`
- Purpose:
  - `Reduce src/main.ts entry-shell ownership before the queue re-evaluates the remaining runtime assembly and house-runtime residue.`
- Failure mode:
  - `Do not widen this first implementation cut into canonical runtime-state bridge cleanup, default-runtime content cleanup, or house-runtime rewiring.`

#### `task.entry-shell-bootstrap-ownerization.entry-shell-bootstrap-residue-review`

##### Control Block

- task_id: `task.entry-shell-bootstrap-ownerization.entry-shell-bootstrap-residue-review`
- state: `active`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - `docs/blueprints/queues/entry-shell-bootstrap-ownerization-queue.md`
  - `src/main.ts`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `src/main.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - `docs/blueprints/queues/entry-shell-bootstrap-ownerization-queue.md`
- must_not_change:
  - `already-landed bootstrap seam slice`
  - `canonical runtime-state bridge queue scope`
  - `active-content consumption cleanup queue scope`
- done_when:
  - `Queue-local truth states whether the remaining repeated runtime commit assembly and house-runtime residue stays as another bounded in-queue slice or returns to version review for later admission.`
  - `Queue snapshot, task counts, and version truth are synchronized with that decision before any repository sync batch.`
  - `The queue does not silently absorb broader runtime-state or content-consumption cleanup without a fresh written boundary.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "commitRuntimeRequest\\(|createHouseRuntimeInstance|createHouseRuntimeBridge" src/main.ts tests/robustness.test.cjs`
- if_blocked:
  - `Record why the remaining residue cannot be cleanly classified instead of widening the queue without written review.`
  - `Escalate back to version review if the remaining residue no longer belongs to this admitted queue.`
- promote_next_if_done: `none`
- stop_if:
  - `Required queue or version truth is not synchronized.`

##### Human Context

- task_brief:
  - `Reassess the remaining repeated runtime commit assembly and house-runtime residue after the first bootstrap seam cut lands.`
- task_outcome_summary:
  - `This task will decide whether the remaining residue stays as another bounded entry-shell continuation or returns to version review for later queue selection.`
- Purpose:
  - `Keep the queue aligned with current evidence after the first implementation slice lands.`
- Failure mode:
  - `Do not auto-absorb runtime-state bridge cleanup or active-content cleanup without a fresh queue-local decision.`

##### Decision-Dispatch Notes

- `If task_kind=decision-dispatch, this task must summarize current queue progress and provide one concise recommendation.`
- `Default operator output should stay concise and should not dump candidate-set analysis, why-not-the-others detail, or other Blueprint internal reasoning unless the operator explicitly asks for it.`

## Progress Log

- 2026-07-10
  - Summary: `Admitted queue.entry-shell-bootstrap-ownerization as the single active queue because current source truth still shows src/main.ts directly owning the covered entry-shell/bootstrap activation state and the current live candidate set contained no competing lawful first cut.`
  - Verification: `Fresh source inspection across src/main.ts, src/application/startup/startup-session-coordinator.ts, tests/robustness.test.cjs, docs/blueprints/project-progress.md, and docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - Next at this time: `Execute task.entry-shell-bootstrap-ownerization.baseline-reconcile before queue-local implementation starts.`
- 2026-07-10
  - Summary: `Completed baseline-reconcile by freezing startup activation/bootstrap state ownerization as the first lawful implementation slice, while leaving repeated runtime commit assembly and house-runtime creation for later in-queue review.`
  - Verification: `rg -n "createBaseGameContentPack|loadDefaultRuntimeContent|builtInScenarioPacks|runModRuntime|createActiveGameContentContextFromModActivation|createHouseRuntimeInstance|commitRuntimeRequest" src/main.ts tests/robustness.test.cjs; npm run lint:blueprints`
  - Next at this time: `Execute task.entry-shell-bootstrap-ownerization.entry-shell-bootstrap-state-owner-lift with a failing test first.`
- 2026-07-10
  - Summary: `Completed entry-shell-bootstrap-state-owner-lift by moving covered startup activation/bootstrap state into src/application/startup/entry-shell-bootstrap-state.ts, slimming src/main.ts to the bootstrap seam consumer, and aligning robustness plus governance tests to the new owner line.`
  - Verification: `node --test --test-name-pattern "default runtime content loads from the shared base content pack path|child 29 main.ts primary startup no longer depends on legacy startup adapters|child 22 restore path can reload imported mod sources after a fresh page load|fresh source audit keeps main.ts final shell residue within the pure-shell acceptance line|entry shell bootstrap state ownerization moves startup activation bootstrap state out of main.ts" tests/robustness.test.cjs; node --test --test-name-pattern "live version plan exposes version-first control fields and lifecycle wording" tests/blueprint-governance-lint.test.cjs; node tools/blueprint-version-governance.mjs check; node tools/lint-blueprints.mjs; npm run typecheck; npm test`
  - Next at this time: `Execute task.entry-shell-bootstrap-ownerization.entry-shell-bootstrap-residue-review to decide whether repeated runtime commit assembly and house-runtime residue stays in-queue or returns to version review.`
