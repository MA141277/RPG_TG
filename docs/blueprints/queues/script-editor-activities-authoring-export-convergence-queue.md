# Script Editor Activities Authoring Export Convergence Queue

## Control Block

- queue_id: `queue.script-editor-activities-authoring-export-convergence`
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
- closure_basis: `The bounded activities authoring/export convergence slice is complete: activities are now a first-class script-editor project family, runtime import maps pack.activities into project.activities, the workspace exposes activities, export writes pack.json activities plus activities.json, and real Zhu Yuanzhang import/export validation no longer reports Unresolved imported runtime family "activities". Remaining export blockers are other runtime families outside this queue.`
- residue_remaining: `no`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `return-to-version-review`
- sync_status: `pending`
- sync_scope: `none`
- sync_summary: `Queue execution and governance closeout are written; repository sync has not yet been attempted for this queue batch.`
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
  - `Make activities a first-class script-editor authoring/runtime family so imported activity-qte, generic.qte, house task bindings, QTE tuning, outcome/effects, text references, and activities.json export round-trip through the formal scenario-pack artifact instead of compatibilityImport residue.`
- Forbidden expansions:
  - `Do not solve unrelated unsupported runtime families in this queue.`
  - `Do not introduce a new playable family, owner kind, return policy, or private export-only dialect.`
  - `Do not add playable-specific or house-specific business branches in src/main.ts.`
  - `Do not make house modules privately own playable lifecycle; house modules may only remain host/integration owners.`
  - `Do not treat clearing compatibilityImport.unresolvedFamilies.activities without first-class activities import/export support as sufficient closeout.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-14-script-editor-runtime-pack-unification-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md`

### Queue Snapshot

- queue_goal: `Converge activities from unresolved compatibility residue into a first-class script-editor runtime family that imports, validates, displays, and exports activities.json for startup-consumable scenario packs.`
- task_count: `4`
- completed_task_count: `4`
- remaining_task_count: `0`
- active_task_summary: `No active task remains; activities authoring/export convergence is complete and control returns to version review for non-activities runtime-family blockers.`
- task_briefs:
  - `task.script-editor-activities-authoring-export-convergence.boundary-baseline-reconcile: confirm the activities export failure, current runtime ActivityDefinition shape, editor import/export gaps, and playable/house governance boundary.`
  - `task.script-editor-activities-authoring-export-convergence.activity-authoring-model-and-import: add the script-editor activities authoring model and import pack.activities into it instead of compatibility residue.`
  - `task.script-editor-activities-authoring-export-convergence.workspace-validation-and-export: expose activities as a workbench family, validate references and runtime fields, and export activities.json plus pack manifest references.`
  - `task.script-editor-activities-authoring-export-convergence.queue-closeout-and-handoff: verify the queue, classify residue, and return control to the version plan.`

### Operator Snapshot Contract

- `The fixed operator receipt must source 当前执行队列 from queue_id.`
- `The fixed operator receipt must source 当前任务 from active_task.`
- `The fixed operator receipt must source 当前队列目标 from queue_goal.`
- `Queue Snapshot exists to support concise operator visibility without exposing Blueprint internal ranking or admission internals by default.`

### Admission Preconditions

- `The runtime-pack-unification version must already declare activities as a mandatory runtime family.`
- `The version plan must already record item.script-editor-activities-authoring-export-convergence as a queue-candidate with admission basis.`
- `Single-active-queue mode remains in force; no second queue may be promoted while this queue is active.`
- `Playable governance applies because this queue covers activity-qte, generic.qte, and playable/runtime export ownership.`
- `Special-house interface rules apply because current activities include temple-house and keep-house task bindings.`

### Governance Boundary

- Affected mechanic:
  - `activity-qte / generic.qte activities, house-hosted task activities, QTE tuning, and activity outcome/effects export.`
- Task classification:
  - `shared playable contract change + house-hosted playable integration.`
- Change level:
  - `shared-contract level for editor import/export and runtime family ownership; no new playable family is allowed.`
- Allowed layers:
  - `domain script-editor project types and activity types`
  - `application/script-editor import, export, validation, and workspace projection`
  - `tests and blueprint docs for activities import/export behavior`
  - `content scenario-pack activities fixtures only where needed for verification`
- Impacted areas:
  - `src/domain/script-editor-project.ts`
  - `src/domain/activity.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/application/script-editor/editor-project-loader.ts`
  - `src/application/script-editor/editor-project-save.ts`
  - `src/application/script-editor/minimal-workflow.ts`
  - `tests/**`
- Governing references:
  - `.codex/skills/playable-governance/SKILL.md`
  - `.codex/skills/playable-governance/references/playable-governance-core.md`
  - `.codex/skills/playable-governance/references/playable-impact-matrix.md`
  - `docs/special-house-interface.md`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-activities-authoring-export-convergence.boundary-baseline-reconcile` | `completed` | `Confirm the admitted activities boundary and freeze the first lawful implementation slice from current repository truth.` | `none` | `Completed on 2026-07-14 after repository evidence confirmed activities was the reported mandatory-family blocker, playable/house governance applied, and unrelated unsupported families remained out of scope.` |
| `task.script-editor-activities-authoring-export-convergence.activity-authoring-model-and-import` | `completed` | `Add typed script-editor activities authoring records and import pack.activities into that family instead of compatibility residue.` | `task.script-editor-activities-authoring-export-convergence.boundary-baseline-reconcile` | `Completed on 2026-07-14 after ScriptEditorProjectDefinition gained activities, project loading requires the canonical family, defaults initialize it, and runtime import maps pack.activities into project.activities.` |
| `task.script-editor-activities-authoring-export-convergence.workspace-validation-and-export` | `completed` | `Expose activities in the workbench, validate activity references and fields, and export activities.json through the formal runtime-pack path.` | `task.script-editor-activities-authoring-export-convergence.activity-authoring-model-and-import` | `Completed on 2026-07-14 after workspace shell exposed activities and runtime export wrote pack.json activities plus activities.json with activity validation.` |
| `task.script-editor-activities-authoring-export-convergence.queue-closeout-and-handoff` | `completed` | `Verify the queue-local activities convergence slice and return control to the version plan with explicit residue routing.` | `task.script-editor-activities-authoring-export-convergence.workspace-validation-and-export` | `Completed on 2026-07-14 after typecheck, full tests, blueprint lint, and real Zhu Yuanzhang import/export diagnostics proved activities no longer remains unresolved compatibility residue.` |

### Task Definitions

#### `task.script-editor-activities-authoring-export-convergence.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-activities-authoring-export-convergence.boundary-baseline-reconcile`
- state: `completed`
- task_kind: `execution`
- scope:
  - `docs/blueprints/specs/2026-07-14-script-editor-runtime-pack-unification-target.md`
  - `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-activities-authoring-export-convergence-queue.md`
  - `src/domain/activity.ts`
  - `src/domain/content-pack.ts`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/content/scenario-packs/zhuyuanzhang/activities.json`
- must_inspect:
  - `docs/blueprints/specs/2026-07-14-script-editor-runtime-pack-unification-target.md`
  - `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md`
  - `src/domain/activity.ts`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/content/scenario-packs/zhuyuanzhang/activities.json`
  - `.codex/skills/playable-governance/references/playable-governance-core.md`
  - `.codex/skills/playable-governance/references/playable-impact-matrix.md`
  - `docs/special-house-interface.md`
- must_not_change:
  - `src/main.ts playable-specific or house-specific business branches`
  - `playable family registry expansion`
  - `new owner kind or return policy patterns`
  - `house-local playable lifecycle ownership`
  - `unrelated unsupported runtime families`
- done_when:
  - `Queue-local truth named the smallest lawful activities implementation slice inside the admitted queue.`
  - `Current repository evidence confirmed pack.activities was imported as compatibility residue and export failed closed on unresolvedFamilies.activities before implementation.`
  - `The first implementation task boundary stayed explicit about what could change and what remained out of scope.`
- verify_with:
  - `rg -n "familyKey: \"activities\"|unresolvedFamilies|ActivityDefinition|activities\.json|generic\.qte|houseModuleId|keepMinTier|compatibilityImport" src/domain/activity.ts src/domain/content-pack.ts src/domain/script-editor-project.ts src/application/script-editor/runtime-pack-import.ts src/application/script-editor/runtime-pack-export.ts src/application/script-editor/workspace-shell.ts src/content/scenario-packs/zhuyuanzhang/activities.json`
  - `npm run lint:blueprints`
- if_blocked:
  - `Record the blocker in this queue doc rather than widening into unrelated runtime families.`
  - `Return to version review only if fresh evidence disproves the admitted activities basis.`
- promote_next_if_done: `task.script-editor-activities-authoring-export-convergence.activity-authoring-model-and-import`
- stop_if:
  - `Fresh inspection proves activities are already a first-class import/export family and the reported export failure comes from another family.`

##### Human Context

- task_brief:
  - `Confirm the activities import/export failure and governance boundary before implementation starts.`
- task_outcome_summary:
  - `Completed after baseline evidence confirmed pack.activities was the activities-family export blocker and the lawful implementation slice was activities authoring/import/export convergence only.`
- Purpose:
  - `Prevent the queue from becoming either a temporary compatibility-clearing patch or a broad playable/runtime redesign.`
- Failure mode:
  - `Do not bypass the shared playable runtime contract or house interface boundary just to make one export succeed.`

#### `task.script-editor-activities-authoring-export-convergence.activity-authoring-model-and-import`

##### Control Block

- task_id: `task.script-editor-activities-authoring-export-convergence.activity-authoring-model-and-import`
- state: `completed`
- task_kind: `execution`
- scope:
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/editor-project-loader.ts`
  - `src/application/script-editor/editor-project-save.ts`
  - `src/application/script-editor/minimal-workflow.ts`
  - `tests/**`
- must_inspect:
  - `src/domain/activity.ts`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/editor-project-loader.ts`
  - `src/application/script-editor/editor-project-save.ts`
  - `src/application/script-editor/minimal-workflow.ts`
- must_not_change:
  - `runtime gameplay rules for QTE settlement`
  - `playable registries except where existing ids are referenced for validation`
  - `house module lifecycle ownership`
- done_when:
  - `ScriptEditorProjectDefinition includes a typed activities family with canonical project file ownership.`
  - `runtime-pack import maps pack.activities into project.activities instead of compatibilityImport.unresolvedFamilies.activities.`
  - `Imported ActivityDefinition fields required by existing Zhu Yuanzhang activities are preserved without lossy lowering.`
- verify_with:
  - `npm run typecheck`
  - `npm run test`
- if_blocked:
  - `Record missing contract blockers in this queue doc instead of deleting activities or preserving them as compatibility residue.`
- promote_next_if_done: `task.script-editor-activities-authoring-export-convergence.workspace-validation-and-export`
- stop_if:
  - `A new playable family or new house lifecycle owner would be required.`

##### Human Context

- task_brief:
  - `Add the first-class activities authoring model and import path.`
- task_outcome_summary:
  - `Completed after imported activities became editor-owned project data rather than unresolved compatibility residue.`
- Purpose:
  - `Create the data surface that makes activities eligible for validation and export.`
- Failure mode:
  - `Do not hide unknown activity fields by dropping them during import.`

#### `task.script-editor-activities-authoring-export-convergence.workspace-validation-and-export`

##### Control Block

- task_id: `task.script-editor-activities-authoring-export-convergence.workspace-validation-and-export`
- state: `completed`
- task_kind: `execution`
- scope:
  - `src/application/script-editor/workspace-shell.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/domain/script-editor-project.ts`
  - `tests/**`
- must_inspect:
  - `src/application/script-editor/workspace-shell.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/domain/activity.ts`
  - `src/domain/script-editor-project.ts`
  - `src/content/scenario-packs/zhuyuanzhang/activities.json`
- must_not_change:
  - `unrelated scene/dialogue/story lowering`
  - `basePackId inheritance contract`
  - `fixed-pack consumer route contract`
  - `compatibility migration support for unrelated families`
- done_when:
  - `Workspace navigation and summaries include activities as a stable family.`
  - `Export validates activities minimum runtime fields and order-line text id shape before runtime pack emission.`
  - `Export writes activities.json and pack.json activities references when project.activities is present.`
  - `The current Zhu Yuanzhang activities import/export path no longer reports Unresolved imported runtime family "activities".`
- verify_with:
  - `npm run typecheck`
  - `npm run test`
  - `npm run lint:blueprints`
- if_blocked:
  - `Record unsupported activity shape blockers in this queue doc rather than silently emitting incomplete runtime packs.`
- promote_next_if_done: `task.script-editor-activities-authoring-export-convergence.queue-closeout-and-handoff`
- stop_if:
  - `Validation proves existing activities require a shared playable contract expansion beyond this queue's allowed boundary.`

##### Human Context

- task_brief:
  - `Expose, validate, and export the activities runtime family.`
- task_outcome_summary:
  - `Completed with a startup-consumable activities.json export path that removes activities from daily compatibility residue.`
- Purpose:
  - `Make the script editor's runtime-pack export succeed for the activities mandatory family without a compatibility workaround.`
- Failure mode:
  - `Do not export activities by omitting invalid references or writing a private shadow format.`

#### `task.script-editor-activities-authoring-export-convergence.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-activities-authoring-export-convergence.queue-closeout-and-handoff`
- state: `completed`
- task_kind: `execution`
- scope:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-activities-authoring-export-convergence-queue.md`
  - `docs/change-log.md`
- must_inspect:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-activities-authoring-export-convergence-queue.md`
- must_not_change:
  - `version closeout without explicit acceptance evidence`
  - `new queue admission without written routing truth`
  - `repository sync truth before queue-local closeout truth is written`
- done_when:
  - `Queue truth, version truth, and project-progress truth are synchronized before control returns to version review.`
  - `Cross-family residue is explicitly classified and routed to version review.`
  - `Verification and queue-local handoff are written before any repository sync batch is recorded.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run lint:plans`
  - `npm run typecheck`
  - `npm run test`
- if_blocked:
  - `Record the blocker explicitly in this queue doc rather than silently keeping ambiguous active truth.`
  - `Do not claim closeout while activities export still depends on compatibility residue.`
- promote_next_if_done: `return-to-version-review`
- stop_if:
  - `Activities remain unresolved compatibility residue after implementation tasks.`

##### Human Context

- task_brief:
  - `Close the queue with explicit residue routing and hand control back to version review only after verification passes.`
- task_outcome_summary:
  - `Completed after queue-local closeout evidence showed activities are no longer blocking runtime-pack export through compatibility residue and remaining blockers are cross-family.`
- Purpose:
  - `Keep Blueprint execution truth synchronized after implementation and verification.`
- Failure mode:
  - `Do not mark topic closure while same-family activities residue still blocks export.`
