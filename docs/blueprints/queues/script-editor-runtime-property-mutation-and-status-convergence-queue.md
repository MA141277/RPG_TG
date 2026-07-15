# Script Editor Runtime Property Mutation And Status Convergence Queue

## Control Block

- queue_id: `queue.script-editor-runtime-property-mutation-and-status-convergence`
- belongs_to_version: `target.script-editor-authoring-data-structure-unification`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-15`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `active`
- queue_class: `required`
- active_task: `task.script-editor-runtime-property-mutation-and-status-convergence.runtime-property-contract-implementation`
- next_task: `task.script-editor-runtime-property-mutation-and-status-convergence.queue-closeout-and-handoff`
- closeout_status: `not-started`
- execution_closeout_status: `partial`
- topic_closure_status: `open-residue`
- closure_basis: `none`
- residue_remaining: `unknown`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `none`
- sync_status: `success`
- sync_scope: `branch-push`
- sync_summary: `The first runtime property mutation/status implementation slice was pushed to origin/mod-first-dev after retrying the transient GitHub port 443 connection failure.`
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
  - `Establish one schema-driven runtime property mutation and status persistence mechanism for creator-defined properties, then migrate the first representative direct-write consumers without creating feature-specific durable truths.`
- Forbidden expansions:
  - `Do not solve this as a gold-only helper or a compatibility fallback to hardcoded money fields.`
  - `Do not migrate every event, house, shop, task, and playable consumer in one unbounded batch.`
  - `Do not add normal authoring-surface controls for editing live save status.`
  - `Do not introduce non-character city/building/status overlays unless baseline evidence proves they are a prerequisite for this queue.`
  - `Do not invent new gameplay systems while establishing the generic mutation contract.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
- Problem ledger:
  - `docs/blueprints/target.script-editor-authoring-data-structure-unification-buglist.md`
- Related design reference:
  - `docs/script-editor-city-building-custom-properties.md`
- Predecessor queues:
  - `docs/blueprints/queues/script-editor-character-definition-status-convergence-queue.md`
  - `docs/blueprints/queues/script-editor-character-status-save-runtime-continuation-queue.md`
  - `docs/blueprints/queues/script-editor-character-authoring-surface-completion-queue.md`

### Queue Snapshot

- queue_goal: `Create the canonical runtime property mutation path for creator-defined character properties and prove it through durable save/restore plus representative temple and event/effect consumers.`
- task_count: `3`
- completed_task_count: `1`
- remaining_task_count: `2`
- active_task_summary: `Implement the bounded generic runtime property mutation/status path selected by baseline reconciliation.`
- task_briefs:
  - `task.script-editor-runtime-property-mutation-and-status-convergence.boundary-baseline-reconcile: identify the smallest lawful runtime-property mutation contract and implementation slice.`
  - `task.script-editor-runtime-property-mutation-and-status-convergence.runtime-property-contract-implementation: implement the bounded generic mutation/status contract and representative consumers with tests.`
  - `task.script-editor-runtime-property-mutation-and-status-convergence.queue-closeout-and-handoff: verify, classify residue, and return control to version review.`

### Operator Snapshot Contract

- `The fixed operator receipt must source 当前执行队列 from queue_id.`
- `The fixed operator receipt must source 当前任务 from active_task.`
- `The fixed operator receipt must source 当前队列目标 from queue_goal.`
- `Queue Snapshot exists to support concise operator visibility without exposing Blueprint internal ranking or admission internals by default.`

### Closeout Judgement Rule

- `Queue execution closeout is not equivalent to true topic closure.`
- `execution_closeout_status = done means the bounded execution slice landed and verified.`
- `topic_closure_status = closed is legal only when no still-blocking same-family residue remains inside the queue's bounded topic surface.`
- `If residue_remaining = yes, classify it as same-family / cross-family / accepted-residue / none before version-level routing continues.`
- `If residue_family = same-family and one lawful continuation exists, name it in next_family_candidate and allow automatic continuation instead of returning to open-ended human queue selection.`

### Admission Preconditions

- `queue.script-editor-character-definition-status-convergence closed the bounded CharacterDefinition and CharacterStatus materialization contract.`
- `queue.script-editor-character-status-save-runtime-continuation closed AppState-owned CharacterStatus aggregation, save-envelope persistence, and startup restore for covered patches.`
- `queue.script-editor-character-authoring-surface-completion closed creator-facing custom key editing but explicitly excluded gameplay formulas and broad runtime consumer changes.`
- `BUG-001 records that temple donation and similar runtime consumers can still directly mutate materialized authored definitions or feature-local fixed fields, so creator-defined custom properties do not yet have one durable mutation path.`
- `The current version acceptance requires runtime mutations to write save/status overlays rather than mutating authored definitions.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, run one minimum repository sync batch.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-runtime-property-mutation-and-status-convergence.boundary-baseline-reconcile` | `done` | `Reconciled current custom-property definitions, direct-write consumers, status patch shape, save/restore seams, and representative implementation slice.` | `none` | `Implementation can proceed without schema-reference migration or non-character overlays because existing CharacterStatus and save seams can be extended for the first character-property slice.` |
| `task.script-editor-runtime-property-mutation-and-status-convergence.runtime-property-contract-implementation` | `active` | `Implement the bounded runtime property mutation/status contract and migrate representative consumers with tests.` | `task.script-editor-runtime-property-mutation-and-status-convergence.boundary-baseline-reconcile` | `Must not become a broad migration of every consumer.` |
| `task.script-editor-runtime-property-mutation-and-status-convergence.queue-closeout-and-handoff` | `queued` | `Verify the queue, classify residue, and synchronize Blueprint truth.` | `task.script-editor-runtime-property-mutation-and-status-convergence.runtime-property-contract-implementation` | `Must not close while the representative mutation/save/restore path is unverified.` |

### Task Definitions

#### `task.script-editor-runtime-property-mutation-and-status-convergence.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-runtime-property-mutation-and-status-convergence.boundary-baseline-reconcile`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/domain/character.ts`
  - `src/domain/character-status.ts`
  - `src/application/character`
  - `src/application/app-shell.ts`
  - `src/core/contracts/runtime-result.ts`
  - `src/core/runtime`
  - `src/core/save`
  - `src/application/startup`
  - `src/content`
  - `src/main.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-runtime-property-mutation-and-status-convergence-queue.md`
- must_inspect:
  - `docs/blueprints/target.script-editor-authoring-data-structure-unification-buglist.md`
  - `docs/script-editor-city-building-custom-properties.md`
  - `src/domain/character.ts`
  - `src/domain/character-status.ts`
  - `src/application/character/character-status.ts`
  - `src/application/app-shell.ts`
  - `src/core/contracts/runtime-result.ts`
  - `src/core/runtime/state-sync-runtime.ts`
  - `src/core/save/save-envelope.ts`
  - `src/core/save/browser-save-record.ts`
  - `src/application/startup/startup-session-coordinator.ts`
  - `src/main.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `code before baseline reconciliation records the bounded implementation plan`
  - `all consumer migrations in one batch`
  - `compatibility-only hardcoded gold fallback`
  - `normal editor UI for live save status editing`
  - `non-character status overlays unless prerequisite evidence is recorded`
- done_when:
  - `The current custom-property and field-definition shapes are inventoried.`
  - `The direct-write and feature-local mutation paths relevant to temple donation, event/effect changes, and covered tests are identified.`
  - `The canonical status patch and save/restore extension point for creator-defined properties is identified.`
  - `A test-first implementation plan names exact files, helper APIs, validation rules, and representative consumers for the next task.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "extendedAttributes|characterStatusById|statPatch|skillPatch|gold|money|mutatePlayerGold|donation|temple|effect|RuntimeResult|modState" src tests docs/blueprints/target.script-editor-authoring-data-structure-unification-buglist.md`
- if_blocked:
  - `Record the blocker and return to version review if schema-reference-and-migration-freeze must precede this queue.`
- promote_next_if_done: `task.script-editor-runtime-property-mutation-and-status-convergence.runtime-property-contract-implementation`
- stop_if:
  - `Fresh evidence proves the smallest lawful next queue is schema-reference-and-migration-freeze or status-overlay-generalization-review instead of runtime-property mutation convergence.`

##### Human Context

- task_brief:
  - `Find the canonical generic runtime property mutation boundary before editing runtime code.`
- task_outcome_summary:
  - `Existing RuntimeResult.characterStatusById, commitRuntimeRequest, SaveEnvelope.modState.characterStatusById, and startup materialization are sufficient for the first implementation slice. The missing contract is a schema-driven property mutation helper and CharacterStatus custom-property patch shape that can update creator-defined numeric character properties without mutating authored definitions.`
- Purpose:
  - `Prevent the fix from becoming another field-specific money patch or a broad unbounded consumer migration.`
- Failure mode:
  - `Jumping directly into a gold helper would leave custom creator-defined properties and other consumers able to bypass the durable status owner.`

##### Progress Log

- `2026-07-15`: `Queue admitted from BUG-001 because the current open version still lacks a unified mutation and persistence path for creator-defined runtime properties, and the version cannot honestly close while representative runtime mutations can bypass authored/status separation.`
- `2026-07-15`: `Baseline found temple donation directly constructs a replacement player CharacterDefinition and writes stats.gold/stats.fame before replaceCharacter, while medicine/market/tea/tavern paths either import or define fixed mutatePlayerGold helpers. These are representative direct-write or feature-local mutation paths rather than a generic runtime property command.`
- `2026-07-15`: `CharacterStatus currently supports profilePatch, statPatch, skillPatch, and stamina only. It can persist fixed stats through RuntimeResult.characterStatusById, commitRuntimeRequest, SaveEnvelope.modState.characterStatusById, and startup materialization, but it has no custom-property/status patch for creator-defined extendedAttributes or semantic property bindings.`
- `2026-07-15`: `Implementation boundary: add a generic character runtime property mutation helper over the current CharacterDefinition/CharacterStatus seam; extend status materialization/merge for custom property patches; prove set/add/subtract validation on numeric character properties; migrate temple donation plus one shared effect/compiler representative path; keep broad house/shop/playable migrations as residue unless the covered helper can be consumed without widening.`
- `2026-07-15`: `Test-first plan: add failing tests in tests/robustness.test.cjs for custom numeric property materialization, status merge, save/restore immutability, temple donation persistence through characterStatusById, and shared effect lowering/execution for one field mutation shape before implementation.`

#### `task.script-editor-runtime-property-mutation-and-status-convergence.runtime-property-contract-implementation`

##### Control Block

- task_id: `task.script-editor-runtime-property-mutation-and-status-convergence.runtime-property-contract-implementation`
- state: `active`
- task_kind: `execution`
- scope:
  - `src/domain/character-status.ts`
  - `src/application/character`
  - `src/application/house-modules/temple-house/temple-house-house-module.ts`
  - `src/application/script-editor/shared-rule-compiler.ts`
  - `src/core/contracts/effect.ts`
  - `src/core/contracts/runtime-result.ts`
  - `src/core/runtime`
  - `src/main.ts`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `Boundary baseline evidence from task.script-editor-runtime-property-mutation-and-status-convergence.boundary-baseline-reconcile`
  - `src/domain/character-status.ts`
  - `src/application/medicine-house/medicine-house-mutations.ts`
  - `src/application/house-modules/temple-house/temple-house-house-module.ts`
  - `src/application/script-editor/shared-rule-compiler.ts`
  - `src/core/runtime/state-sync-core-seam.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `unbounded consumer migration`
  - `feature-specific durable truths`
  - `authored definition mutation during gameplay`
- done_when:
  - `A generic runtime property mutation command supports bounded set/add/subtract behavior.`
  - `Creator-defined numeric character properties can persist through CharacterStatus/save/restore.`
  - `Representative temple donation and one event/effect path use the generic mutation route.`
  - `Tests prove authored definitions remain unchanged during mutation, save, and restore.`
- verify_with:
  - `npm run typecheck`
  - `npm run test`
  - `npm run lint:blueprints`
- if_blocked:
  - `Record the blocker and do not add a compatibility-only fallback.`
- promote_next_if_done: `task.script-editor-runtime-property-mutation-and-status-convergence.queue-closeout-and-handoff`
- stop_if:
  - `Implementation requires a broader schema migration or non-character status overlay queue first.`

##### Human Context

- task_brief:
  - `Implement the bounded generic runtime property mutation/status path chosen by baseline reconciliation.`
- task_outcome_summary:
  - `Partially implemented: CharacterStatus now supports customPropertyPatch materialization/merge, the generic mutateCharacterNumericProperty helper supports stats/skills/custom numeric set/add/subtract operations, house transition results can transport CharacterStatus patches, and temple donation now emits a gold status patch while preserving materialized compatibility. The event/effect representative path remains active work.`
- Purpose:
  - `Make creator-defined runtime properties durable through the same status/save owner rather than direct authored-definition writes.`
- Failure mode:
  - `A gold-specific helper would pass the current symptom while preserving the systemic bug.`

##### Progress Log

- `2026-07-15`: `Activated after baseline reconciliation proved the existing RuntimeResult/save/startup seams can carry the first character-property status slice without schema-reference migration or non-character overlays.`
- `2026-07-15`: `Implemented the first TDD slice after observing failing tests for customPropertyPatch materialization and a missing runtime property mutation helper. Added CharacterDefinition.customProperties, CharacterStatus.customPropertyPatch, mutateCharacterNumericProperty, and a temple donation migration that returns characterStatusById through HouseModuleTransitionResult. Verification passed for npm run typecheck, npm test, and the targeted custom property / temple donation node --test slice.`
- `2026-07-15`: `Remaining active work: add the representative shared event/effect mutation path or explicitly route it as residue before this implementation task can close.`

#### `task.script-editor-runtime-property-mutation-and-status-convergence.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-runtime-property-mutation-and-status-convergence.queue-closeout-and-handoff`
- state: `queued`
- task_kind: `execution`
- scope:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-runtime-property-mutation-and-status-convergence-queue.md`
  - `docs/blueprints/target.script-editor-authoring-data-structure-unification-buglist.md`
  - `docs/change-log.md`
- must_inspect:
  - `Current queue, version plan, Blueprint, project-progress, and BUG-001 truth.`
- must_not_change:
  - `version closeout without explicit human confirmation`
  - `new queue admission without routing truth`
- done_when:
  - `Verification, BUG-001 disposition or residue classification, next-step sync, and repository sync truth are recorded.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run lint:plans`
  - `npm run blueprint:governance:check`
- if_blocked:
  - `Record the blocker without marking the queue done.`
- promote_next_if_done: `return-to-version-review`
- stop_if:
  - `Representative runtime-property mutation/save/restore acceptance has not passed.`

##### Human Context

- task_brief:
  - `Close or route the runtime property mutation/status convergence queue after verified implementation.`
- task_outcome_summary:
  - `Pending implementation and verification.`
- Purpose:
  - `Keep current-version runtime mutation ownership explicit before broader city/building/event/condition queues continue.`
- Failure mode:
  - `Closing without representative save/restore evidence would leave current-version acceptance unable to prove authored/status separation.`

##### Progress Log

- `2026-07-15`: `Queued behind runtime-property-contract-implementation.`

### Historical Handoff Note

- Task ID:
  - `task.script-editor-runtime-property-mutation-and-status-convergence.runtime-property-contract-implementation`
- Recorded handoff at activation:
  - `Queue is active and baseline reconciliation is complete; implementation should start from tests for custom property status materialization, temple donation persistence, and one shared effect path.`
- Recorded expected output:
  - `A generic creator-defined property mutation/status path proven through representative runtime consumers and durable save/restore.`
