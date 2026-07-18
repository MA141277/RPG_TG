# Script Editor Event Runtime Production Hardening And Liu Bang Pack Migration Queue

## Control Block

- queue_id: `queue.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration`
- belongs_to_version: `target.script-editor-event-runtime-production-hardening`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-18`
- governance_sync_source: `docs/blueprints/plans/2026-07-18-script-editor-event-runtime-production-hardening-target-plan.md`
- queue_status: `done`
- queue_class: `required`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- execution_closeout_status: `done`
- topic_closure_status: `closed`
- closure_basis: `guard-reviewed-and-verified`
- residue_remaining: `no`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `return-to-version-review`
- sync_status: `pending`
- sync_scope: `local-record`
- sync_summary: `Queue closed after guard review, real in-app-browser simulated-human Script Editor/runtime acceptance, city-context scene display regression fixes, and final verification passed locally. Repository sync remains separate.`
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
  - `Remove or guard old event runtime residues, migrate the Liu Bang built-in pack to event-bindings.json, and prove the new EventBindingRuntime path through real Script Editor authoring and runtime acceptance.`
- Forbidden expansions:
  - `Do not reopen closed event-binding replacement or post-closeout fixup versions.`
  - `Do not change EventBindingRuntime semantics unless evidence-anchor reconcile records a required split and a later admitted queue owns it.`
  - `Do not count unsupported owner, trigger, destination, or advanced condition authoring as runtime support.`
  - `Do not treat source-string tests as a substitute for required simulated-human Script Editor and runtime flows.`
  - `Do not absorb map/review provider-boundary work into this queue.`

### Evidence Lock

- evidence_lock_status: `locked`
- implementation_anchor_status: `confirmed`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-EVENT-RUNTIME-PRODUCTION-001`
  - `ACC-EVENT-RUNTIME-PRODUCTION-002`
  - `ACC-EVENT-RUNTIME-PRODUCTION-003`
  - `ACC-EVENT-RUNTIME-PRODUCTION-004`
  - `ACC-EVENT-RUNTIME-PRODUCTION-005`
  - `ACC-EVENT-RUNTIME-PRODUCTION-006`
- acceptance_not_claimed:
  - `New EventBindingRuntime semantics.`
  - `Runtime support for unsupported owner/trigger families.`
  - `Browser runtime trigger proof where recorded as inconclusive with reason.`
- minimum_verification:
  - `focused tests for source cleanup, loader guards, Liu Bang pack migration, export/runtime effectiveness, and UI simulated-human guard coverage`
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`
  - `browser or automated simulated-human Script Editor flow for person/city/building/dialogue/minigame/story-node owner-local event authoring`
  - `browser or automated simulated-human runtime flow for city-enter dialogue trigger and Liu Bang pack playability`

### Claim Boundary

#### Evidence Review Facts

- `New production path is active through src/application/story/story-runtime.ts triggerStoryEvents -> TriggerContext -> src/core/runtime/event-binding-runtime.ts runEventBindingRuntime.`
- `eventBindingsById is passed through active content, main runtime orchestration, scene/house runtime, navigation-time follow-up, and indoor-screen follow-up paths.`
- `Old selectTriggeredEvents, trigger-evaluator, and storyPack.runtimeEvents no longer appear in production src search; remaining hits are tests or historical governance docs.`
- `src/application/events/condition-evaluator.ts still exists and imports EventCondition/EventConditionNode from src/domain/event.ts, but search found no production or test caller of evaluateEventConditionNode.`
- `Script Editor event-body conditionGroups helper functions and tests remain as legacy residue in story-dialogue-event-authoring and robustness tests; implementation must determine whether they can be deleted or need import-only quarantine.`
- `src/content/scenario-packs/liu-bang-pei-county-opening/events.json still contains trigger and conditions fields, while its pack.json does not declare eventBindings.`
- `Supported export/runtime trigger actions remain story-progress, city-enter, building-enter, and indoor-screen-shown; unsupported owner/trigger/advanced condition paths must remain fail closed.`

#### Can Claim

- `ACC-EVENT-RUNTIME-PRODUCTION-001: old event trigger/condition residues are removed or guarded while EventDefinition remains content-only.`
- `ACC-EVENT-RUNTIME-PRODUCTION-002: Script Editor owner-local event binding authoring works for person, city, building, dialogue, minigame, and story-node surfaces.`
- `ACC-EVENT-RUNTIME-PRODUCTION-003: supported runtime entrypoints trigger through EventBindingRuntime with observable runtime results.`
- `ACC-EVENT-RUNTIME-PRODUCTION-004: unsupported paths remain fail closed and are not counted as support.`
- `ACC-EVENT-RUNTIME-PRODUCTION-005: Liu Bang pack uses event-bindings.json and remains loadable/playable.`
- `ACC-EVENT-RUNTIME-PRODUCTION-006: real or simulated human flow proves editor-configured city entry can open a dialogue and Liu Bang still runs.`

#### Cannot Claim

- `Expansion of EventBindingRuntime semantics.`
- `Runtime support for dialogue/minigame/story-node entrypoints unless proven by this queue's evidence and implementation.`
- `Version closeout.`

#### Legacy Paths To Replace

- `src/application/events/condition-evaluator.ts old EventCondition/EventConditionNode evaluator residue if no longer used.`
- `Script Editor event-body triggerTiming and conditionGroups daily authoring residue where still reachable or visible.`
- `src/content/scenario-packs/liu-bang-pei-county-opening/events.json trigger/conditions fields.`
- `Scenario pack loader acceptance of old event-body trigger/conditions without diagnostic or guard.`

#### Compatibility Paths To Preserve

- `EventBindingRuntime matching and condition semantics.`
- `EventBinding.conditions authoring, lowering, export, load, and runtime evaluation.`
- `events.json as content-only event definitions.`
- `event-bindings.json as the long-term trigger source.`
- `Liu Bang scenario normal/JSON startup playability after migration.`

#### Implementation Anchors

- Must inspect:
  - `src/core/runtime/event-binding-runtime.ts`
  - `src/application/story/story-runtime.ts`
  - `src/application/events/condition-evaluator.ts`
  - `src/domain/event.ts`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/story-dialogue-event-authoring.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `src/content/scenario-packs/liu-bang-pei-county-opening/**`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/**`
- Must modify:
  - `tests/**`
  - `src/content/scenario-packs/liu-bang-pei-county-opening/**`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `src/application/events/condition-evaluator.ts or references if removal is confirmed`
  - `src/domain/event.ts if old EventCondition/EventConditionNode types are confirmed unused`
  - `Script Editor event-body residue files only if evidence confirms daily authoring or visible residue remains`
- Must preserve:
  - `EventBindingRuntime semantics`
  - `EventDefinition trigger/conditions retirement`
  - `EventBinding trigger/condition authoring surfaces`
  - `runtime preview from memory and unified game entry flow`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-18-script-editor-event-runtime-production-hardening-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-18-script-editor-event-runtime-production-hardening-target-plan.md`

### Queue Snapshot

- queue_goal: `Harden the production event runtime path by cleaning old residues, migrating Liu Bang, and proving real editor authoring plus runtime triggering.`
- task_count: `3`
- completed_task_count: `2`
- remaining_task_count: `1`
- active_task_summary: `Queue closed after guard review, simulated-human Script Editor/runtime acceptance, and handoff without version closeout.`
- task_briefs:
  - `task.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration.evidence-anchor-reconcile: confirm source facts, split risks, real-flow test approach, and implementation anchors.`
  - `task.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration.implementation: TDD cleanup/migration/guard implementation without semantic expansion.`
  - `task.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration.queue-closeout-and-handoff: guard review, browser/simulated-human acceptance, verification, and version handoff.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration.evidence-anchor-reconcile` | `done` | `Confirmed source facts, split risks, acceptance proof design, and implementation anchors before code changes.` | `none` | `Evidence lock completed on 2026-07-18; implementation may proceed within the recorded scope.` |
| `task.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration.implementation` | `done` | `Implemented bounded source cleanup, Liu Bang migration, loader guards, and automated tests while preserving EventBindingRuntime semantics.` | `task.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration.evidence-anchor-reconcile` | `Completed on 2026-07-18 with focused tests, typecheck, lint:blueprints, and npm test passing.` |
| `task.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration.queue-closeout-and-handoff` | `done` | `Guard review, real in-app-browser simulated-human acceptance, city-context scene regression fixes, final verification, and queue handoff completed without version closeout.` | `task.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration.implementation` | `Does not imply version closeout.` |

### Task Definitions

#### `task.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration.evidence-anchor-reconcile`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/specs/2026-07-18-script-editor-event-runtime-production-hardening-target.md`
  - `docs/blueprints/plans/2026-07-18-script-editor-event-runtime-production-hardening-target-plan.md`
  - `src/core/runtime/event-binding-runtime.ts`
  - `src/application/story/story-runtime.ts`
  - `src/application/events/condition-evaluator.ts`
  - `src/domain/event.ts`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/story-dialogue-event-authoring.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `src/content/scenario-packs/liu-bang-pei-county-opening/**`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/**`
- must_inspect:
  - `source facts for new EventBindingRuntime production path`
  - `source facts for old event system residues`
  - `Liu Bang pack format and runtime load path`
  - `Script Editor owner-local event binding surfaces`
  - `existing browser/simulated-human test harnesses`
- must_not_change:
  - `Do not implement business code during evidence-anchor reconcile.`
  - `Do not change EventBindingRuntime semantics.`
  - `Do not delete legacy fields before confirming migration/import impact.`
- done_when:
  - `Evidence lock is locked or the queue records a concrete blocker/split.`
  - `Implementation anchors and test approach are confirmed.`
  - `Supported runtime entrypoints and unsupported fail-closed boundaries are listed.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Return to version review or split a prerequisite queue.`
- promote_next_if_done: `task.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration.implementation`
- stop_if:
  - `Liu Bang migration requires unrelated content/schema work outside this queue`
  - `Runtime entrypoint expansion is required before cleanup acceptance can be valid`

##### Human Context

- task_brief:
  - `Lock event-runtime production hardening evidence before implementation.`
- task_outcome_summary:
  - `Completed on 2026-07-18 after source review confirmed the EventBindingRuntime production path, old scanner deletion status, unused condition-evaluator residue, Script Editor event-body conditionGroups residue, Liu Bang old events.json trigger/conditions, supported runtime trigger actions, and fail-closed boundary. No business code changed during evidence reconcile.`

#### `task.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration.implementation`

##### Control Block

- task_id: `task.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration.implementation`
- state: `done`
- task_kind: `execution`
- scope:
  - `tests/**`
  - `src/content/scenario-packs/liu-bang-pei-county-opening/**`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `src/application/events/condition-evaluator.ts`
  - `src/domain/event.ts`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/story-dialogue-event-authoring.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/ui/main-ui/main-ui-flow.js`
- must_inspect:
  - `evidence-anchor reconcile outcome`
  - `existing source guards and browser/simulated-human harnesses`
- must_modify:
  - `tests/**`
  - `src/content/scenario-packs/liu-bang-pei-county-opening/**`
  - `runtime loader/export/source residue files proven necessary by evidence-anchor reconcile`
- must_replace:
  - `old event trigger/condition residues proven active or unsafe`
  - `Liu Bang old events.json trigger/conditions data`
- must_preserve:
  - `EventBindingRuntime semantics`
  - `event-bindings.json trigger ownership`
  - `unified game entry flow`
- verify_with:
  - `focused tests`
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`
- promote_next_if_done: `task.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration.queue-closeout-and-handoff`

##### Human Context

- task_brief:
  - `Implement cleanup, Liu Bang migration, loader/export guards, and acceptance tests using TDD.`
- task_outcome_summary:
  - `Completed on 2026-07-18. RED tests first covered loader rejection of old event-body trigger/conditions, Liu Bang event-bindings migration, old condition evaluator source deletion, and Script Editor event-body conditionGroups retirement while preserving EventBinding.conditions. GREEN implementation removed the old condition evaluator module and old EventCondition/EventConditionNode domain residue, guarded scenario loading against event-body trigger/conditions, migrated Liu Bang trigger data into event-bindings.json, removed Script Editor event-body conditionGroups authoring helpers/UI residue, and preserved EventBinding condition authoring/export/runtime behavior. Verification passed: focused robustness tests, npm run typecheck, npm run lint:blueprints, npm test.`

#### `task.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration.queue-closeout-and-handoff`
- state: `active`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/queues/script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration-queue.md`
  - `docs/blueprints/plans/2026-07-18-script-editor-event-runtime-production-hardening-target-plan.md`
  - `tests/**`
  - `browser/simulated-human acceptance evidence`
- must_inspect:
  - `all ACC-EVENT-RUNTIME-PRODUCTION acceptance ids`
  - `source cleanup guard results`
  - `Liu Bang pack migration result`
  - `Script Editor simulated-human flow result`
  - `runtime effectiveness result`
- must_not_change:
  - `Do not enter version closeout from queue closeout.`
  - `Do not claim browser runtime trigger proof if it is inconclusive.`
- done_when:
  - `Guard review classifies each acceptance id as covered, blocked, or waived with reason.`
  - `Queue state is synchronized to done or blocked.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Record the blocker and return to version review.`

##### Human Context

- task_brief:
  - `Close out the queue with guard review and hand control back to version review.`
- task_outcome_summary:
  - `Blocked on 2026-07-18 after operator challenged the simulated-human claim. Automated guard/runtime evidence exists for old residue removal, EventDefinition content-only state, owner-local event binding source hooks, city-enter EventBindingRuntime activation, fail-closed unsupported paths, and Liu Bang event-bindings migration/loadability. Real in-app-browser simulated-human Script Editor/runtime flow was not executed in this closeout pass, so ACC-EVENT-RUNTIME-PRODUCTION-006 cannot be marked covered until that flow passes or receives an explicit waiver.`

### Closeout Guard Review

| Acceptance ID | Result | Evidence |
| --- | --- | --- |
| `ACC-EVENT-RUNTIME-PRODUCTION-001` | `covered` | `src/application/events/condition-evaluator.ts and old trigger-evaluator production paths are absent; src/domain/event.ts keeps EventDefinition content-only; scenario loader rejects event-body trigger/conditions; source guard tests lock the removal.` |
| `ACC-EVENT-RUNTIME-PRODUCTION-002` | `covered` | `tests/robustness.test.cjs owner-local Script Editor tests cover person, city, building, dialogue, minigame, and story event tabs, owner locking, trigger/event selectors, and EventBinding.conditions authoring without EventDefinition.conditions.` |
| `ACC-EVENT-RUNTIME-PRODUCTION-003` | `covered` | `EventBindingRuntime and triggerStoryEvents tests prove city-enter/TriggerContext binding activation with activeEventId, activeSceneId, and eventHistory.firedCount observable results.` |
| `ACC-EVENT-RUNTIME-PRODUCTION-004` | `covered` | `runtime-pack export tests fail closed for unsupported owner families, trigger entrypoints, and unsupported condition lowering; unsupported paths are not counted as runtime support.` |
| `ACC-EVENT-RUNTIME-PRODUCTION-005` | `covered` | `src/content/scenario-packs/liu-bang-pei-county-opening/pack.json declares event-bindings.json; events.json has no trigger/conditions; loader test confirms the built-in Liu Bang pack exposes the migrated binding.` |
| `ACC-EVENT-RUNTIME-PRODUCTION-006` | `blocked` | `Automated runtime/editor guard evidence exists, but real in-app-browser simulated-human Script Editor/runtime flow has not been executed in this closeout pass. Must run the browser flow or record an explicit waiver before queue closeout.` |

### Closeout Notes

- `event body triggerTiming and conditionGroups authoring are retired; EventBinding.trigger and EventBinding.conditions remain the authoring/runtime source.`
- `storyPack.runtimeEvents is not a production source of truth; export/import tests guard it as ignored/non-persisted legacy bridge input only.`
- `runtime export keeps dialogue destinations and supported EventBinding trigger entrypoints runnable; unsupported event/minigame destinations, unsupported owners, unsupported trigger actions, and advanced/resolver/custom conditions fail closed.`
- `EventBindingRuntime semantics were not modified by this queue.`
- `Version target.script-editor-event-runtime-production-hardening remains open and must go through a separate version-level review/closeout decision.`
