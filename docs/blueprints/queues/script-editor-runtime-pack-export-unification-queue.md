# Script Editor Runtime Pack Export Unification Queue

## Control Block

- queue_id: `queue.script-editor-runtime-pack-export-unification`
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
- closure_basis: `The bounded export-unification slice is complete: the queue verified the exporter is still a partial startup-pack seam, wrote mandatory-family export obligations, authoring lowering obligations, fail-closed export behavior, and downstream boundaries for formal startup-consumable export. Remaining work belongs to base-pack inheritance governance, fixed-pack consumer deprivileging, and compatibility retirement rather than additional same-family export-contract mapping.`
- residue_remaining: `no`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `return-to-version-review`
- sync_status: `pending`
- sync_scope: `none`
- sync_summary: `Queue has been admitted but no repository sync batch has yet been recorded for the runtime-pack-export-unification queue.`
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
  - `Replace the current bounded script-editor runtime export seam with one formal startup-consumable scenario-pack export contract that consumes the frozen runtime family contract and the authoring parallel-structure retirement map.`
- Forbidden expansions:
  - `Do not widen this queue into basePackId inheritance implementation, fixed-pack consumer rewiring, or compatibility-boundary retirement.`
  - `Do not invent a new private export-only shadow format or silent empty-family lowering to make the current export appear complete.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-14-script-editor-runtime-pack-unification-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md`

### Queue Snapshot

- queue_goal: `Converge script-editor export from a bounded runtime-compatible seam into the formal scenario-pack artifact that the startup loader consumes.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `No active task remains; the bounded export-unification contract slice is closed and returns control to version review for downstream queue routing.`
- task_briefs:
  - `task.script-editor-runtime-pack-export-unification.boundary-baseline-reconcile: confirm the admitted export-unification boundary from current exporter, startup loader, and closed authoring-retirement-map evidence.`
  - `task.script-editor-runtime-pack-export-unification.startup-consumable-export-contract-map: write the export contract map for mandatory runtime families, deferred lowering obligations, and fail-closed export behavior.`
  - `task.script-editor-runtime-pack-export-unification.queue-closeout-and-handoff: verify the queue-local export-unification slice, classify remaining residue, and hand control back to version review.`

### Admission Preconditions

- `The runtime-family contract must already be frozen before this queue can become active.`
- `The authoring parallel-structure retirement map must already be written before this queue can define export unification.`
- `Single-active-queue mode remains in force; no second queue may be promoted while this queue is active.`
- `This queue must stay on the formal runtime-pack export path rather than drifting into base-pack inheritance governance, consumer deprivileging, or compatibility retirement.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-runtime-pack-export-unification.boundary-baseline-reconcile` | `completed` | `Confirm the admitted export-unification boundary and freeze the first lawful export contract slice from current repository truth.` | `none` | `Completed on 2026-07-14 after fresh evidence confirmed that the current exporter still writes empty scenes.json, omits activities from the manifest, fails closed on dialogues/minigames/storyNodes, blocks on compatibilityImport residue, and therefore remains narrower than the startup loader's scenario-pack truth.` |
| `task.script-editor-runtime-pack-export-unification.startup-consumable-export-contract-map` | `completed` | `Map the formal startup-consumable export contract that later implementation must satisfy.` | `task.script-editor-runtime-pack-export-unification.boundary-baseline-reconcile` | `Completed on 2026-07-14 after the queue wrote the startup-consumable export contract map for mandatory runtime families, authoring lowering obligations, fail-closed export behavior, and downstream queue boundaries.` |
| `task.script-editor-runtime-pack-export-unification.queue-closeout-and-handoff` | `completed` | `Verify the queue-local export contract slice and return control to the version plan with explicit residue routing.` | `task.script-editor-runtime-pack-export-unification.startup-consumable-export-contract-map` | `Completed on 2026-07-14 after verification passed, queue-local export residue was classified as cross-family, and control returned to version review with base-pack inheritance governance as the next lawful downstream recommendation to inspect.` |

### Startup-Consumable Export Contract Map

| Runtime Family | Export Obligation | Current Gap | Queue Decision |
| --- | --- | --- | --- |
| `scenarioProfile` | `Export a concrete scenario-profile.json that satisfies startup loader validation.` | `Already emitted from storyPack.scenarioProfile, but validation remains local to exporter shape.` | `Keep as mandatory export and fail closed on missing startup fields.` |
| `characters` | `Export characters.json from runtime-owned people/character records without private authoring wrappers.` | `Already emitted from project.people.` | `Keep as direct runtime family output.` |
| `cities` | `Export cities.json when locally authored or resolve through explicit basePackId inheritance in a later queue.` | `Already emitted locally; inheritance semantics remain out of this queue.` | `Keep local export mandatory for current queue; route inheritance semantics to base-pack governance.` |
| `houses` | `Export houses.json when locally authored or resolve through explicit basePackId inheritance in a later queue.` | `Already emitted from project.buildings.` | `Keep local export mandatory for current queue; route inheritance semantics to base-pack governance.` |
| `events` | `Export events.json from runtime-owned event records and event lowerings produced by narrative structures.` | `Direct events are emitted; storyNodes/dialogue lowering is not yet formal.` | `Require final export to include all event truth without startup-only reconstruction.` |
| `scenes` | `Export non-placeholder scenes.json when any dialogue/story flow exists; never use empty scenes as a success placeholder.` | `Current exporter always emits scenes: [] and fails closed on dialogues/storyNodes.` | `Final export must lower dialogues/storyNodes into scenes or fail closed with explicit diagnostics.` |
| `activities` | `Export activities.json or explicit owner-bound activity contributions for playable/minigame truth.` | `Current exporter omits activities from the manifest and fails closed on minigames.` | `Final export must lower minigames into activities/owner bindings or fail closed; missing activities cannot be hidden by manifest omission.` |
| `tasks` | `Export tasks.json through the shared-rule compiler without keeping quest-only runtime truth.` | `Already emits compiled tasks.` | `Keep direct output and fail closed on unsupported shared-rule lowering.` |
| `textEntries` | `Export text-entries.json for all display text used by scenes, dialogue, events, and authored text records.` | `Direct textEntries are emitted, but dialogue/story text lowering remains deferred.` | `Final export must merge lowered scene/dialogue text into textEntries or fail closed on unresolved text.` |

### Export Fail-Closed Rules

- `Export must fail closed if any mandatory runtime family is neither emitted locally nor resolved by a later explicit basePackId inheritance contract.`
- `Export must fail closed if dialogues or storyNodes exist but cannot lower into scenes and textEntries.`
- `Export must fail closed if minigames exist but cannot lower into activities or formal owner bindings.`
- `Export must fail closed while storyPack.compatibilityImport.unresolvedFamilies is needed to reconstruct runtime truth.`
- `Export must not claim startup-consumable success by writing empty scenes, omitting activities, or inventing private export-only dialects.`

### Downstream Boundary

- `basePackId family overlay and missing-family resolution belong to queue.script-editor-base-pack-inheritance-governance.`
- `Runtime/application consumers that still hard-import fixed scenario-pack content belong to queue.script-editor-fixed-pack-consumer-deprivileging.`
- `Historical compatibility import/export retirement belongs to queue.script-editor-compatibility-boundary-retirement after the formal export path exists.`

### Task Definitions

#### `task.script-editor-runtime-pack-export-unification.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-runtime-pack-export-unification.boundary-baseline-reconcile`
- state: `completed`
- task_kind: `execution`
- scope:
  - `docs/blueprints/specs/2026-07-14-script-editor-runtime-pack-unification-target.md`
  - `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-runtime-pack-export-unification-queue.md`
  - `docs/blueprints/queues/script-editor-runtime-family-authoring-convergence-queue.md`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `src/domain/content-pack.ts`
  - `docs/scenario-pack-unified-format.md`
- must_inspect:
  - `docs/blueprints/specs/2026-07-14-script-editor-runtime-pack-unification-target.md`
  - `docs/blueprints/queues/script-editor-runtime-family-authoring-convergence-queue.md`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `src/domain/content-pack.ts`
  - `docs/scenario-pack-unified-format.md`
- must_not_change:
  - `basePackId inheritance implementation`
  - `fixed-pack consumer deprivileging implementation`
  - `compatibility retirement implementation`
  - `new export-only shadow dialects`
- done_when:
  - `Queue-local truth names the smallest lawful first export-unification slice inside the admitted queue.`
  - `Current repository evidence still supports export unification before base-pack inheritance, fixed-pack deprivileging, or compatibility retirement.`
  - `The first task step is explicit about what this queue decides directly and what remains routed to later queue families.`
- verify_with:
  - `rg -n "exportScriptEditorProjectToScenarioPackFiles|validateScriptEditorProjectForRuntimeExport|parseScenarioPack|loadScenarioPackFromFiles|scenes|activities|compatibilityImport|unresolvedFamilies|basePackId|pack.json" src/application/script-editor/runtime-pack-export.ts src/application/script-editor/runtime-pack-import.ts src/application/scenario/scenario-pack-loader.ts src/domain/content-pack.ts docs/scenario-pack-unified-format.md`
- if_blocked:
  - `Record the blocker in this queue doc rather than widening into another queue family silently.`
  - `Return control to version review only if fresh evidence disproves the admitted export-unification basis.`
- promote_next_if_done: `task.script-editor-runtime-pack-export-unification.startup-consumable-export-contract-map`
- stop_if:
  - `Fresh inspection proves the smallest remaining work belongs primarily to base-pack inheritance, fixed-pack consumer deprivileging, or compatibility retirement rather than this admitted queue.`

##### Human Context

- task_brief:
  - `Confirm the admitted export-unification boundary and freeze the first export contract slice before implementation or contract mapping continues.`
- task_outcome_summary:
  - `Completed after fresh evidence confirmed that the exporter remains a bounded partial seam: it writes empty scenes.json, omits activities from the manifest, fails closed on dialogues/minigames/storyNodes, and blocks on compatibilityImport residue while the startup loader can consume fuller scenario-pack truth.`

#### `task.script-editor-runtime-pack-export-unification.startup-consumable-export-contract-map`

##### Control Block

- task_id: `task.script-editor-runtime-pack-export-unification.startup-consumable-export-contract-map`
- state: `completed`
- task_kind: `execution`
- scope:
  - `docs/blueprints/specs/2026-07-14-script-editor-runtime-pack-unification-target.md`
  - `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-runtime-pack-export-unification-queue.md`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `docs/scenario-pack-unified-format.md`
- must_inspect:
  - `docs/blueprints/specs/2026-07-14-script-editor-runtime-pack-unification-target.md`
  - `docs/blueprints/queues/script-editor-runtime-pack-export-unification-queue.md`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `docs/scenario-pack-unified-format.md`
- must_not_change:
  - `basePackId inheritance implementation`
  - `fixed-pack consumer deprivileging implementation`
  - `compatibility retirement implementation`
- done_when:
  - `The formal startup-consumable export contract is mapped for mandatory runtime families and export-deferred authoring surfaces.`
  - `The queue states what export must fail closed on and what later queues must own.`
  - `The map does not permit empty scenes, missing activities, private shadow dialects, or compatibility residue as final runtime truth.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Record the blocker in this queue doc rather than lowering the contract to the current bounded exporter.`
- promote_next_if_done: `task.script-editor-runtime-pack-export-unification.queue-closeout-and-handoff`

##### Human Context

- task_brief:
  - `Write the startup-consumable runtime-pack export contract map once the baseline slice is explicit.`
- task_outcome_summary:
  - `Completed after the queue wrote the mandatory-family export obligations, authoring lowering obligations, fail-closed rules, and downstream boundaries for the formal startup-consumable export contract.`

#### `task.script-editor-runtime-pack-export-unification.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-runtime-pack-export-unification.queue-closeout-and-handoff`
- state: `completed`
- task_kind: `execution`
- scope:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-runtime-pack-export-unification-queue.md`
  - `docs/change-log.md`
- must_inspect:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-runtime-pack-export-unification-queue.md`
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
  - `Completed after the queue-local export contract slice was verified, residue was classified as cross-family, and control returned to version review for downstream runtime-pack-unification routing.`
