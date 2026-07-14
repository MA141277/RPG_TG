# Script Editor Base Pack Inheritance Governance Queue

## Control Block

- queue_id: `queue.script-editor-base-pack-inheritance-governance`
- belongs_to_version: `target.script-editor-runtime-pack-unification`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-14`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `done`
- queue_class: `required`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- execution_closeout_status: `done`
- topic_closure_status: `closed`
- closure_basis: `The bounded base-pack inheritance governance slice is complete: the queue verified current basePackId metadata passthrough, wrote explicit family-level overlay rules, and recorded fail-closed inheritance obligations for mandatory and explicitly inheritable runtime families. Remaining work belongs to fixed-pack consumer deprivileging and compatibility retirement rather than additional same-family inheritance contract mapping.`
- residue_remaining: `no`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `return-to-version-review`
- sync_status: `pending`
- sync_scope: `none`
- sync_summary: `Queue has closed its bounded inheritance-governance slice; no repository sync batch has yet been recorded.`
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
  - `Turn basePackId from passive import/export metadata into explicit family-level inheritance contract truth for mandatory and inheritable runtime families.`
- Forbidden expansions:
  - `Do not widen this queue into fixed-pack consumer rewiring or compatibility-boundary retirement.`
  - `Do not use builtin fallback by convenience as a substitute for declared base-pack inheritance behavior.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-14-script-editor-runtime-pack-unification-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md`

### Queue Snapshot

- queue_goal: `Define explicit basePackId family overlay and fail-closed inheritance behavior that downstream export and startup paths must consume.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `No active task remains; the bounded inheritance-governance contract slice is closed and returns control to version review for downstream queue routing.`
- task_briefs:
  - `task.script-editor-base-pack-inheritance-governance.boundary-baseline-reconcile: confirm the admitted inheritance boundary from current basePackId import/export metadata and the frozen family/export contracts.`
  - `task.script-editor-base-pack-inheritance-governance.family-overlay-contract-map: write the family-level basePackId inheritance contract map and fail-closed obligations.`
  - `task.script-editor-base-pack-inheritance-governance.queue-closeout-and-handoff: verify the queue-local inheritance contract slice, classify remaining residue, and hand control back to version review.`

### Admission Preconditions

- `The runtime-family contract must already be frozen before this queue can become active.`
- `The startup-consumable export contract map must already exist before this queue can define missing-family inheritance behavior.`
- `Single-active-queue mode remains in force; no second queue may be promoted while this queue is active.`
- `This queue must stay on family-level inheritance governance rather than drifting into fixed-pack consumer deprivileging or compatibility retirement.`

### Family Overlay Contract Map

| Runtime Family | Overlay Rule | Inheritance Source | Failure Rule |
| --- | --- | --- | --- |
| `scenarioProfile` | `Must resolve locally or by declared base pack because startup needs one authoritative scenario entry.` | `local pack or explicit basePackId` | `Fail closed if absent after declared inheritance resolution.` |
| `characters` | `Must resolve locally or by declared base pack; editor export may not reconstruct characters from compatibility residue.` | `local pack or explicit basePackId` | `Fail closed if unresolved.` |
| `cities` | `Must resolve locally or by declared base pack as a family-level overlay, not record-by-record builtin fallback.` | `local pack or explicit basePackId` | `Fail closed if unresolved.` |
| `houses` | `Must resolve locally or by declared base pack under the same family-level contract as cities.` | `local pack or explicit basePackId` | `Fail closed if unresolved.` |
| `events` | `Must resolve locally or by declared base pack; event truth may not depend on compatibility-only reconstruction.` | `local pack or explicit basePackId` | `Fail closed if unresolved.` |
| `scenes` | `Must resolve locally or by declared base pack because startup-consumable export depends on concrete scene truth.` | `local pack or explicit basePackId` | `Fail closed if scenes remain unresolved or are hidden by empty output.` |
| `activities` | `Must resolve locally or by declared base pack; playable truth cannot be hidden behind manifest omission.` | `local pack or explicit basePackId` | `Fail closed if unresolved.` |
| `tasks` | `Must resolve locally or by declared base pack through formal task output, not quest-only shadow truth.` | `local pack or explicit basePackId` | `Fail closed if unresolved.` |
| `textEntries` | `Must resolve locally or by declared base pack so scenes/events can consume authoritative display text.` | `local pack or explicit basePackId` | `Fail closed if unresolved.` |
| `maps` | `May resolve locally or by declared base pack because the contract explicitly allows inheritance.` | `local pack or explicit basePackId` | `Fail closed if referenced but unresolved.` |
| `cityEntries` | `May resolve locally or by declared base pack because the contract explicitly allows inheritance.` | `local pack or explicit basePackId` | `Fail closed if referenced but unresolved.` |
| `cityNpcPools` | `May resolve locally or by declared base pack because the contract explicitly allows inheritance.` | `local pack or explicit basePackId` | `Fail closed if referenced but unresolved.` |
| `houseModuleDefaults` | `May resolve locally or by declared base pack because the contract explicitly allows inheritance.` | `local pack or explicit basePackId` | `Fail closed if referenced but unresolved.` |
| `houseAccessRefusalRules` | `May resolve locally or by declared base pack because the contract explicitly allows inheritance.` | `local pack or explicit basePackId` | `Fail closed if referenced but unresolved.` |
| `cards` | `May resolve locally or by declared base pack because the contract explicitly allows inheritance.` | `local pack or explicit basePackId` | `Fail closed if referenced but unresolved.` |
| `valuables` | `May resolve locally or by declared base pack because the contract explicitly allows inheritance.` | `local pack or explicit basePackId` | `Fail closed if referenced but unresolved.` |
| `historicalCharacters` | `May resolve locally or by declared base pack because the contract explicitly allows inheritance.` | `local pack or explicit basePackId` | `Fail closed if referenced but unresolved.` |
| `historicalCityRosters` | `May resolve locally or by declared base pack because the contract explicitly allows inheritance.` | `local pack or explicit basePackId` | `Fail closed if referenced but unresolved.` |
| `cityPortraits` | `May resolve locally or by declared base pack because the contract explicitly allows inheritance.` | `local pack or explicit basePackId` | `Fail closed if referenced but unresolved.` |
| `historicalCharacterIdByCharacterId` | `May resolve locally or by declared base pack because the contract explicitly allows inheritance.` | `local pack or explicit basePackId` | `Fail closed if referenced but unresolved.` |

### Overlay Rules

- `Inheritance is family-level contract truth. A local pack either owns a family locally or resolves that family through declared basePackId; it must not infer ownership from whichever builtin pack is currently imported by code.`
- `Mandatory runtime families may use declared inheritance, but they remain mandatory after overlay resolution; unresolved mandatory families fail closed.`
- `Explicitly inheritable runtime families may be absent from the local pack only when the declared base pack resolves them; referenced but unresolved inheritable families fail closed.`
- `basePackId metadata passthrough alone is not sufficient. Import/export/startup paths must eventually prove family resolution before claiming runtime-pack success.`
- `Empty arrays, hidden defaults, compatibilityImport residue, or hard-imported builtin files are not lawful substitutes for declared base-pack inheritance.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-base-pack-inheritance-governance.boundary-baseline-reconcile` | `completed` | `Confirm the admitted base-pack inheritance boundary and freeze the first lawful inheritance-governance slice from current repository truth.` | `none` | `Completed on 2026-07-14 after fresh evidence confirmed basePackId remains metadata passthrough in import/export paths while the frozen runtime-family and export contracts require explicit family-level inheritance or fail-closed behavior. The smallest lawful next cut remains family overlay contract mapping rather than fixed-pack consumer deprivileging or compatibility retirement.` |
| `task.script-editor-base-pack-inheritance-governance.family-overlay-contract-map` | `completed` | `Map the family-level basePackId overlay rules and fail-closed obligations for mandatory and inheritable runtime families.` | `task.script-editor-base-pack-inheritance-governance.boundary-baseline-reconcile` | `Completed on 2026-07-14 after the queue wrote explicit family overlay rules and fail-closed obligations for mandatory and explicitly inheritable runtime families.` |
| `task.script-editor-base-pack-inheritance-governance.queue-closeout-and-handoff` | `completed` | `Verify the queue-local inheritance contract slice and return control to the version plan with explicit residue routing.` | `task.script-editor-base-pack-inheritance-governance.family-overlay-contract-map` | `Completed on 2026-07-14 after verification passed, queue-local inheritance residue was closed, and remaining runtime-pack-unification residue was routed to downstream fixed-pack consumer deprivileging and compatibility retirement review.` |

### Task Definitions

#### `task.script-editor-base-pack-inheritance-governance.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-base-pack-inheritance-governance.boundary-baseline-reconcile`
- state: `completed`
- task_kind: `execution`
- scope:
  - `docs/blueprints/specs/2026-07-14-script-editor-runtime-pack-unification-target.md`
  - `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-base-pack-inheritance-governance-queue.md`
  - `docs/blueprints/queues/script-editor-runtime-pack-export-unification-queue.md`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `docs/scenario-pack-unified-format.md`
- must_inspect:
  - `docs/blueprints/specs/2026-07-14-script-editor-runtime-pack-unification-target.md`
  - `docs/blueprints/queues/script-editor-runtime-pack-export-unification-queue.md`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `docs/scenario-pack-unified-format.md`
- must_not_change:
  - `fixed-pack consumer deprivileging implementation`
  - `compatibility retirement implementation`
  - `implicit builtin fallback behavior`
- done_when:
  - `Queue-local truth names the smallest lawful first base-pack inheritance slice inside the admitted queue.`
  - `Current repository evidence still supports inheritance governance before fixed-pack consumer deprivileging or compatibility retirement.`
  - `The first task step is explicit about what this queue decides directly and what remains routed to later queue families.`
- verify_with:
  - `rg -n "basePackId|inherit|inheritance|pickOptionalPackMetadata|manifest\.basePackId|rawPack\.basePackId|defaultPack|family overlay|fallback" src/application/script-editor/runtime-pack-import.ts src/application/script-editor/runtime-pack-export.ts src/application/scenario/scenario-pack-loader.ts docs/scenario-pack-unified-format.md docs/blueprints/specs/2026-07-14-script-editor-runtime-pack-unification-target.md`
- if_blocked:
  - `Record the blocker in this queue doc rather than widening into another queue family silently.`
  - `Return control to version review only if fresh evidence disproves the admitted inheritance-governance basis.`
- promote_next_if_done: `task.script-editor-base-pack-inheritance-governance.family-overlay-contract-map`
- stop_if:
  - `Fresh inspection proves the smallest remaining work belongs primarily to fixed-pack consumer deprivileging or compatibility retirement rather than this admitted queue.`

##### Human Context

- task_brief:
  - `Confirm the admitted base-pack inheritance boundary before writing the family overlay contract.`
- task_outcome_summary:
  - `Completed after fresh evidence confirmed that basePackId is still copied through runtime-pack import/export metadata without resolving mandatory or inheritable scenario-pack families, while the shared family contract requires explicit base-pack inheritance or fail-closed behavior.`
- Purpose:
  - `Keep the base-pack inheritance queue narrowed to family-level overlay semantics before downstream consumer rewiring or compatibility retirement can proceed.`
- Failure mode:
  - `Do not treat current builtin imports, empty output, or metadata passthrough as a lawful inheritance contract.`

#### `task.script-editor-base-pack-inheritance-governance.family-overlay-contract-map`

##### Control Block

- task_id: `task.script-editor-base-pack-inheritance-governance.family-overlay-contract-map`
- state: `completed`
- task_kind: `execution`
- scope:
  - `docs/blueprints/specs/2026-07-14-script-editor-runtime-pack-unification-target.md`
  - `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-base-pack-inheritance-governance-queue.md`
  - `docs/scenario-pack-unified-format.md`
- must_inspect:
  - `docs/blueprints/specs/2026-07-14-script-editor-runtime-pack-unification-target.md`
  - `docs/blueprints/queues/script-editor-base-pack-inheritance-governance-queue.md`
  - `docs/scenario-pack-unified-format.md`
- must_not_change:
  - `fixed-pack consumer deprivileging implementation`
  - `compatibility retirement implementation`
  - `implicit builtin fallback behavior`
- done_when:
  - `The family-level basePackId inheritance contract is mapped for mandatory and explicitly inheritable runtime families.`
  - `The queue states what inheritance must fail closed on and what later queues must own.`
  - `The map does not permit builtin fallback by convenience or hidden default injection.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Record the blocker in this queue doc rather than lowering the contract to metadata passthrough.`
- promote_next_if_done: `task.script-editor-base-pack-inheritance-governance.queue-closeout-and-handoff`

##### Human Context

- task_brief:
  - `Write the basePackId family overlay contract map once the baseline slice is explicit.`
- task_outcome_summary:
  - `Completed after the queue recorded explicit family-level basePackId overlay rules, inheritance sources, and fail-closed obligations for mandatory and explicitly inheritable runtime families.`

#### `task.script-editor-base-pack-inheritance-governance.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-base-pack-inheritance-governance.queue-closeout-and-handoff`
- state: `completed`
- task_kind: `execution`
- scope:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-base-pack-inheritance-governance-queue.md`
  - `docs/change-log.md`
- must_inspect:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-base-pack-inheritance-governance-queue.md`
- must_not_change:
  - `version boundary without explicit residue evidence`
  - `new queue admission without written routing truth`
  - `repository sync truth before queue-local closeout truth is written`
- done_when:
  - `Queue truth, version truth, and project-progress truth are synchronized before control returns to version review.`
  - `Any same-family or cross-family residue is explicitly classified and routed.`
  - `Verification and queue-local handoff are written before any repository sync batch is recorded.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run lint:plans`
- if_blocked:
  - `Record the blocker explicitly in this queue doc rather than silently keeping ambiguous active truth.`
- promote_next_if_done: `return-to-version-review`

##### Human Context

- task_brief:
  - `Close the queue with explicit residue routing and hand control back to version review only after governance truth is synchronized.`
- task_outcome_summary:
  - `Completed after queue-local inheritance contract truth was verified, same-family residue was closed, and control returned to version review for downstream queue admission.`
