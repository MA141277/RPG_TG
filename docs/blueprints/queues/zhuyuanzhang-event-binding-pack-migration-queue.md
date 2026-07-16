# Zhuyuanzhang Event Binding Pack Migration Queue

## Control Block

- queue_id: `queue.zhuyuanzhang-event-binding-pack-migration`
- belongs_to_version: `target.script-editor-event-binding-runtime-replacement`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-16`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `done`
- queue_class: `required`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- execution_closeout_status: `done`
- topic_closure_status: `open-residue`
- closure_basis: `Built-in zhuyuanzhang pack migration landed and verified: pack.json names eventBindings, event-bindings.json stores the migrated triggers/conditions, events.json is triggerless, and default runtime content exposes the migrated bindings.`
- residue_remaining: `yes`
- residue_family: `same-family`
- residue_routing_status: `needs-version-review`
- next_family_candidate: `queue.event-binding-runtime-convergence`
- auto_continue_eligible: `true`
- next_effect: `none`
- sync_status: `success`
- sync_scope: `local-record`
- sync_summary: `Queue closeout truth recorded locally; branch commit is the repository sync boundary for this queue closeout.`
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
  - `Migrate the built-in zhuyuanzhang scenario pack from event-local trigger/conditions into event-bindings.json so default content has the double-table input shape before runtime cutover.`
- Forbidden expansions:
  - `Do not implement EventBindingRuntime in this queue.`
  - `Do not delete old trigger evaluator paths in this queue.`
  - `Do not migrate unrelated scenario packs unless a test proves they block the zhuyuanzhang default pack path.`

### Evidence Lock

- evidence_lock_status: `locked`
- implementation_anchor_status: `confirmed`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-ZHUYUANZHANG-MIGRATION-001`
- acceptance_not_claimed:
  - `ACC-EVENT-BINDING-RUNTIME-001`
  - `ACC-OLD-EVENT-RUNTIME-RETIREMENT-001`
- minimum_verification:
  - `node --test --test-name-pattern "zhuyuanzhang scenario pack migrates event triggers to event bindings|default runtime content exposes zhuyuanzhang event bindings" tests/robustness.test.cjs`
  - `npm run typecheck`
  - `npm run lint:blueprints`

### Claim Boundary

#### Can Claim

- `ACC-ZHUYUANZHANG-MIGRATION-001: Built-in zhuyuanzhang pack includes event-bindings.json and its events.json no longer stores trigger/conditions.`

#### Cannot Claim

- `ACC-EVENT-BINDING-RUNTIME-001: EventBindingRuntime selects, evaluates, activates, and hands off events through TriggerContext.`
- `ACC-OLD-EVENT-RUNTIME-RETIREMENT-001: Old EventDefinition.trigger/conditions scanning paths are deleted.`

#### Legacy Paths To Replace

- `src/content/scenario-packs/zhuyuanzhang/pack.json lacks files.eventBindings.`
- `src/content/scenario-packs/zhuyuanzhang/events.json stores trigger and conditions on event bodies.`
- `src/content/pack-content-access.ts defaultPackEventBindings is an empty array instead of importing the zhuyuanzhang event-bindings.json file.`

#### Compatibility Paths To Preserve

- `Existing event body ids, chapterId, name, occurrence, entrySceneId, tags, nextEventId, and taskInputs remain in events.json.`
- `Old runtime trigger evaluator remains for legacy packs until EventBindingRuntime convergence and old-runtime retirement.`

#### Implementation Anchors

- Must inspect:
  - `src/content/scenario-packs/zhuyuanzhang/pack.json`
  - `src/content/scenario-packs/zhuyuanzhang/events.json`
  - `src/content/pack-content-access.ts`
  - `tests/robustness.test.cjs`
  - `docs/script-editor-event-trigger-binding-design.md`
- Must modify:
  - `src/content/scenario-packs/zhuyuanzhang/pack.json`
  - `src/content/scenario-packs/zhuyuanzhang/events.json`
  - `src/content/scenario-packs/zhuyuanzhang/event-bindings.json`
  - `src/content/pack-content-access.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/zhuyuanzhang-event-binding-pack-migration-queue.md`
- Must preserve:
  - `Built-in zhuyuanzhang pack loading from the published manifest URL.`
  - `Scenario profile, scenes, text entries, activities, city/building data, and playable data.`

### Queue Snapshot

- queue_goal: `Migrate built-in zhuyuanzhang event trigger data into event-bindings.json without changing runtime dispatch.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `None; queue is closed with same-family residue routed to EventBindingRuntime convergence.`
- task_briefs:
  - `task.zhuyuanzhang-event-binding-pack-migration.evidence-anchor-reconcile: Confirm source-backed pack migration anchors before implementation.`
  - `task.zhuyuanzhang-event-binding-pack-migration.pack-data-migration: Move zhuyuanzhang trigger/conditions data into event-bindings.json test-first.`
  - `task.zhuyuanzhang-event-binding-pack-migration.queue-closeout-and-handoff: Verify, classify residue, and route EventBindingRuntime convergence.`

### Operator Snapshot Contract

- `The fixed operator receipt must source current queue from queue_id.`
- `The fixed operator receipt must source current task from active_task.`
- `The fixed operator receipt must source current queue goal from queue_goal.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, record local repository sync state.`
- `Default Blueprint governance/documentation refinement uses local-record during execution and branch-commit at queue closeout.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.zhuyuanzhang-event-binding-pack-migration.evidence-anchor-reconcile` | `done` | `Inspected zhuyuanzhang pack manifest, events, pack access, tests, and design before selecting the migration slice.` | `none` | `Completed on 2026-07-16 after source evidence confirmed this queue can own built-in pack data migration without changing runtime dispatch.` |
| `task.zhuyuanzhang-event-binding-pack-migration.pack-data-migration` | `done` | `Moved built-in zhuyuanzhang event trigger/conditions data into event-bindings.json with focused tests.` | `task.zhuyuanzhang-event-binding-pack-migration.evidence-anchor-reconcile` | `Completed on 2026-07-16; runtime dispatch was not changed.` |
| `task.zhuyuanzhang-event-binding-pack-migration.queue-closeout-and-handoff` | `done` | `Verified the bounded migration slice, classified residue, and routed EventBindingRuntime convergence.` | `task.zhuyuanzhang-event-binding-pack-migration.pack-data-migration` | `EventBindingRuntime and old trigger scanning remain unresolved same-family residue.` |

### Task Definitions

#### `task.zhuyuanzhang-event-binding-pack-migration.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.zhuyuanzhang-event-binding-pack-migration.evidence-anchor-reconcile`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `src/content/scenario-packs/zhuyuanzhang/pack.json`
  - `src/content/scenario-packs/zhuyuanzhang/events.json`
  - `src/content/pack-content-access.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/zhuyuanzhang-event-binding-pack-migration-queue.md`
- must_inspect:
  - `zhuyuanzhang pack manifest and event body data`
  - `default pack content access`
  - `existing zhuyuanzhang scenario pack tests`
- must_not_change:
  - `feature code before evidence_lock_status is locked`
  - `EventBindingRuntime trigger selection`
  - `old runtime deletion`
- done_when:
  - `Evidence Lock is locked or the queue is blocked with a concrete reason.`
  - `Can Claim and Cannot Claim list acceptance ids from the version acceptance matrix.`
  - `Must inspect, must modify, must preserve, and minimum verification are recorded.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "trigger|conditions|eventBindings|event-bindings" src/content/scenario-packs/zhuyuanzhang src/content/pack-content-access.ts tests/robustness.test.cjs`
- if_blocked:
  - `Return to version review or split a prerequisite queue.`
- promote_next_if_done: `task.zhuyuanzhang-event-binding-pack-migration.pack-data-migration`
- stop_if:
  - `implementation_anchor_status is missing or conflicting`
  - `prerequisite_status is needs-prior-queue or split-required`

##### Human Context

- task_brief:
  - `Lock the zhuyuanzhang pack migration evidence before implementation.`
- task_outcome_summary:
  - `Done. Baseline selected a narrow pack data migration slice: add zhuyuanzhang event-bindings.json, strip trigger/conditions from built-in event bodies, and wire defaultPackEventBindings to the migrated file while preserving old runtime dispatch for later queues.`
- Purpose:
  - `Prevent built-in pack migration from widening into EventBindingRuntime or old runtime deletion.`
- Failure mode:
  - `Treating pack data migration as proof that runtime trigger dispatch is already replaced.`

##### Progress Log

- `2026-07-16`: `src/content/scenario-packs/zhuyuanzhang/pack.json does not name files.eventBindings.`
- `2026-07-16`: `src/content/scenario-packs/zhuyuanzhang/events.json stores trigger and conditions on all five built-in event bodies.`
- `2026-07-16`: `src/content/pack-content-access.ts defaultPackEventBindings is still an empty array, so default runtime content cannot expose migrated built-in bindings yet.`
- `2026-07-16`: `Selected implementation slice: migrate zhuyuanzhang trigger/conditions data into event-bindings.json, remove trigger/conditions from zhuyuanzhang events.json, and import the new file through pack-content-access.`

#### `task.zhuyuanzhang-event-binding-pack-migration.pack-data-migration`

##### Control Block

- task_id: `task.zhuyuanzhang-event-binding-pack-migration.pack-data-migration`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/content/scenario-packs/zhuyuanzhang/pack.json`
  - `src/content/scenario-packs/zhuyuanzhang/events.json`
  - `src/content/scenario-packs/zhuyuanzhang/event-bindings.json`
  - `src/content/pack-content-access.ts`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `Evidence lock from task.zhuyuanzhang-event-binding-pack-migration.evidence-anchor-reconcile.`
- must_modify:
  - `src/content/scenario-packs/zhuyuanzhang/pack.json`
  - `src/content/scenario-packs/zhuyuanzhang/events.json`
  - `src/content/scenario-packs/zhuyuanzhang/event-bindings.json`
  - `src/content/pack-content-access.ts`
  - `tests/robustness.test.cjs`
- must_replace:
  - `Built-in zhuyuanzhang trigger/conditions event-body data with event-bindings.json entries.`
- must_preserve:
  - `Event body identity and scene entry data.`
  - `Default runtime content loading path.`
- must_not_change:
  - `EventBindingRuntime trigger dispatch`
  - `old selectTriggeredEvents deletion`
- done_when:
  - `zhuyuanzhang pack.json names eventBindings.`
  - `zhuyuanzhang event-bindings.json contains migrated entries for prior triggers and conditions.`
  - `zhuyuanzhang events.json no longer contains trigger or conditions.`
  - `defaultPackEventBindings exposes the migrated built-in bindings.`
- verify_with:
  - `node --test --test-name-pattern "zhuyuanzhang scenario pack migrates event triggers to event bindings|default runtime content exposes zhuyuanzhang event bindings" tests/robustness.test.cjs`
  - `npm run typecheck`
  - `npm run lint:blueprints`
- if_blocked:
  - `Record execution blockers in this queue doc rather than widening into runtime migration.`
- promote_next_if_done: `task.zhuyuanzhang-event-binding-pack-migration.queue-closeout-and-handoff`
- stop_if:
  - `Migrated binding data requires runtime semantics that cannot be represented in the existing EventBinding contract.`

##### Human Context

- task_brief:
  - `Migrate built-in zhuyuanzhang event trigger data into event-bindings.json.`
- task_outcome_summary:
  - `Done. The built-in zhuyuanzhang pack now declares eventBindings, stores migrated binding entries in event-bindings.json, removes trigger/conditions from events.json, and exposes those bindings through default runtime content.`
- Purpose:
  - `Make default built-in content available in the same double-table event shape as editor exports.`
- Failure mode:
  - `Leaving default built-in content on events.json trigger data before runtime cutover.`

##### Progress Log

- `2026-07-16`: `RED verification passed: the focused migration tests failed because event-bindings.json was absent and default runtime content did not expose the zhuyuanzhang ordination binding.`
- `2026-07-16`: `Migrated all five zhuyuanzhang event triggers and conditions into event-bindings.json, removed trigger/conditions from events.json, added pack.json files.eventBindings, wired defaultPackEventBindings, added content-pack manifest hydration for eventBindings, and preserved imported runtimeEventBindings through script-editor runtime-pack import/export.`
- `2026-07-16`: `GREEN verification passed for node --test --test-name-pattern "zhuyuanzhang scenario pack migrates event triggers to event bindings|default runtime content exposes zhuyuanzhang event bindings" tests/robustness.test.cjs after npm run build:test; npm run typecheck, npm run lint:blueprints, and full npm test also passed.`

#### `task.zhuyuanzhang-event-binding-pack-migration.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.zhuyuanzhang-event-binding-pack-migration.queue-closeout-and-handoff`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/plans/2026-07-16-script-editor-event-binding-runtime-replacement-target-plan.md`
  - `docs/blueprints/queues/zhuyuanzhang-event-binding-pack-migration-queue.md`
  - `docs/blueprints/project-progress.md`
  - `src`
  - `tests`
- must_inspect:
  - `implementation task outcome`
  - `verification output`
  - `EventBindingRuntime implementation status`
  - `old trigger scanning production dependency status`
- must_modify:
  - `docs/blueprints/queues/zhuyuanzhang-event-binding-pack-migration-queue.md`
  - `docs/blueprints/plans/2026-07-16-script-editor-event-binding-runtime-replacement-target-plan.md`
  - `docs/blueprints/project-progress.md`
- must_replace:
  - `active queue truth with closeout or next-task truth after implementation verification`
- must_preserve:
  - `version remains open until explicit version closeout`
- must_not_change:
  - `version_status to done`
  - `old runtime retirement before runtime verification`
- done_when:
  - `Bounded built-in pack migration verification is recorded.`
  - `Residue is classified and next lawful continuation is routed.`
  - `Repository sync record is updated according to Blueprint policy.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Record the blocker in queue and version truth.`
- promote_next_if_done: `none`
- stop_if:
  - `Verification fails.`
  - `Multiple mutually exclusive lawful continuations remain.`

##### Human Context

- task_brief:
  - `Close or route the queue after implementation verification.`
- task_outcome_summary:
  - `Done. The bounded pack migration queue is closed with same-family residue routed to queue.event-binding-runtime-convergence; old trigger scanning remains a production dependency until a later queue replaces it.`
- Purpose:
  - `Return control to version review without confusing pack migration with runtime cutover.`
- Failure mode:
  - `Treating migrated built-in content as permission to delete old runtime paths before EventBindingRuntime verification.`

##### Progress Log

- `2026-07-16`: `Queue closeout recorded after focused migration tests, npm run typecheck, npm run lint:blueprints, and full npm test passed.`
- `2026-07-16`: `Residue classification: EventBindingRuntime trigger selection, condition evaluation, activation, occurrence/eventHistory, and old trigger scanning retirement remain unresolved same-family work.`
- `2026-07-16`: `Next lawful continuation is queue.event-binding-runtime-convergence; old runtime retirement is still blocked until EventBindingRuntime verification passes.`
