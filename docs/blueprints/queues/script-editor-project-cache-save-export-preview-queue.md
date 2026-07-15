# Script Editor Project Cache Save Export Preview Queue

## Control Block

- queue_id: `queue.script-editor-project-cache-save-export-preview`
- belongs_to_version: `target.script-editor-authoring-data-structure-unification`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-15`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `done`
- queue_class: `required-priority`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- execution_closeout_status: `done`
- topic_closure_status: `open-residue`
- closure_basis: `The bounded implementation slice has landed project-library package location and stale validity metadata plus export-before-runtime-output draft persistence. Same-family residue remains for create-at-save-path, stale path probing, imported package edit-in-place, and runtime preview-from-disk semantics, so closeout must classify and route that residue.`
- residue_remaining: `yes`
- residue_family: `same-family`
- residue_routing_status: `needs-version-review`
- next_family_candidate: `item.script-editor-project-cache-save-export-preview-residue-continuation`
- auto_continue_eligible: `false`
- next_effect: `return-to-version-review`
- sync_status: `pending`
- sync_scope: `none`
- sync_summary: `No repository sync batch is recorded yet for this newly admitted queue.`
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
  - `Make script-editor package persistence explicit: cache selected/imported package paths, validate stale paths, create new projects at a chosen package location, save draft state, persist before export, and preview from the active on-disk package only after validation.`
- Forbidden expansions:
  - `Do not migrate character, city, building, dialogue, story, event, condition, playable, or status schemas in this queue except where a minimal package metadata reference is necessary.`
  - `Do not implement cloud sync, multi-user collaboration, broad preview gameplay features, or visual redesign.`
  - `Do not mark project completion semantics complete unless the completion-state queue is admitted or explicitly merged by version-plan truth.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`

### Queue Snapshot

- queue_goal: `Create the script-editor package persistence boundary needed before broader authoring/data convergence can rely on editable package truth.`
- task_count: `3`
- completed_task_count: `2`
- remaining_task_count: `1`
- active_task_summary: `The bounded implementation slice is complete; version-level routing must now evaluate the same-family persistence residue continuation.`
- task_briefs:
  - `task.script-editor-project-cache-save-export-preview.boundary-baseline-reconcile: completed after source evidence confirmed current manifest load/save support, transient UI handles, in-memory project library state, and missing durable cache/save-before-export/preview-from-disk semantics.`
  - `task.script-editor-project-cache-save-export-preview.persistence-contract-map: completed after project library entries gained package location and stale validity metadata, and export now persists the current project draft before runtime package export when a durable project directory handle exists.`
  - `task.script-editor-project-cache-save-export-preview.queue-closeout-and-handoff: completed after typecheck, blueprint lint, plan lint, and full tests passed, with same-family residue routed to item.script-editor-project-cache-save-export-preview-residue-continuation.`

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

- `This queue is admitted by docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md after target.script-editor-runtime-pack-unification closeout.`
- `The admitted boundary is package persistence, explicit save, export-time persistence, imported package editing, stale cache handling, and preview from the active package.`
- `User scope approval alone must not widen this queue into the rest of authoring/data structure unification.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, run one minimum repository sync batch.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Activation Order

1. `Version plan admission truth was written first.`
2. `This queue doc is created and synchronized as the queue-level governor.`
3. `Only then may active_task be exposed and implementation begin.`

### Recovery Rule

- `Resume from this queue doc and the version-plan admission record unless new material evidence invalidates the admitted basis.`
- `Do not restart a full re-audit if boundary-baseline-reconcile has already recorded current evidence.`

### Boundary Baseline Evidence

- `src/domain/script-editor-project.ts already defines a manifest-driven script-editor project package with project.json and canonical split files such as story-pack.json, maps.json, people.json, dialogues.json, condition-groups.json, and effect-bundles.json.`
- `src/application/script-editor/editor-project-loader.ts can hydrate a selected FileList into a ScriptEditorProjectDefinition by finding project.json and loading every canonical file entry, but it does not retain the selected directory path or any durable package cache metadata.`
- `src/application/script-editor/editor-project-save.ts can serialize the current project into canonical split files, but it returns an in-memory Record<string,string> for the UI writer rather than owning a package location.`
- `src/ui/main-ui/main-ui-flow.js currently keeps scriptEditorProjectLibrary as an in-memory array, scriptEditorProjectDirectoryHandle and scriptEditorExportDirectoryHandle as transient handles, and scriptEditorProjectSource as a label only.`
- `The current new-project action creates createDefaultScriptEditorProjectDefinition() immediately and clears directory handles; it does not first ask for a save path or write a package skeleton before editing begins.`
- `The current save action writes serialized project files to a selected/reused directory or triggers downloads, then stores only the transient directory handle on the UI instance.`
- `The current export action directly calls exportScriptEditorProjectToScenarioPackFiles(this.scriptEditorProject) and writes runtime pack files to the export directory or downloads; it does not first save current draft authoring state to an active project package path.`
- `The current import-pack path converts selected scenario-pack files into an editor project and records it as imported in the in-memory project library, but it does not record the imported package location as an editable project package entry.`
- `The current preview surface is the workspace auxiliary panel fed by createScriptEditorWorkspaceShellViewModel and validation/export diagnostics; it is not a runtime preview that imports the currently saved on-disk package.`
- `tests/robustness.test.cjs covers manifest-driven project loading, canonical split-file serialization, in-memory library helper upsert/find/remove, and the auxiliary preview panel, but it does not yet cover stale cached paths, create-at-save-path skeleton creation, save-before-export, imported package editing in place, or preview loading from the active package.`

### Bounded Implementation Direction

- `Add an explicit project workspace/cache model that records package identity, source kind, validity, and a durable package location capability where the platform can expose one.`
- `Keep browser File System Access API handles as the only browser-native write-back mechanism when available, with download fallback recorded as not durable for later continue/edit-in-place semantics.`
- `Make new project creation choose or establish a package location before workbench editing when the platform supports directory handles; download-only fallback must remain explicit and cannot be treated as a valid durable cached path.`
- `Make Save write the current editor project to the active project package handle without requiring runtime/export validity.`
- `Make Export persist the current project state first when a durable project package handle exists, then run runtime export validation/output.`
- `Make Preview require saved/valid package truth before loading runtime preview; if runtime preview remains out of scope for the first implementation slice, record the missing runtime preview as same-family residue instead of silently calling the auxiliary panel preview complete.`

### Residue Routing Note

- `item.script-editor-project-cache-save-export-preview-residue-continuation remains same-family residue for create-at-save-path package skeleton creation, durable stale path probing, imported package edit-in-place, and runtime preview-from-disk semantics.`
- `Closeout must decide whether this residue is small enough for a follow-up same-family queue or whether version review should merge it with project-completion-state gating.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-project-cache-save-export-preview.boundary-baseline-reconcile` | `completed` | `Inspected current editor project persistence, import, export, and preview/startup seams and froze the smallest lawful implementation boundary.` | `none` | `Completed on 2026-07-15 after source evidence confirmed existing manifest load/save support, transient UI directory handles, in-memory project library state, and missing durable cache/save-before-export/preview-from-disk semantics.` |
| `task.script-editor-project-cache-save-export-preview.persistence-contract-map` | `completed` | `Defined and implemented the first bounded cache/package/save/export persistence slice.` | `task.script-editor-project-cache-save-export-preview.boundary-baseline-reconcile` | `Completed on 2026-07-15 after TDD verified project library package location/stale validity metadata and export-before-runtime-output draft persistence.` |
| `task.script-editor-project-cache-save-export-preview.queue-closeout-and-handoff` | `completed` | `Verified the bounded slice, classified residue, and handed control back to version review.` | `task.script-editor-project-cache-save-export-preview.persistence-contract-map` | `Completed on 2026-07-15 after npm run typecheck, npm run lint:blueprints, npm run lint:plans, and npm run test passed; same-family residue remains for create-at-save-path, stale path probing, imported edit-in-place, and runtime preview-from-disk.` |

### Task Definitions

#### `task.script-editor-project-cache-save-export-preview.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-project-cache-save-export-preview.boundary-baseline-reconcile`
- state: `completed`
- task_kind: `execution`
- scope:
  - `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md`
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-project-cache-save-export-preview-queue.md`
  - `src/application/script-editor`
  - `src/ui/main-ui`
  - `src/application/scenario`
  - `tests`
- must_inspect:
  - `src/application/script-editor`
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/application/scenario`
  - `tests`
  - `docs/script-editor-prd.md`
- must_not_change:
  - `character/city/building/dialogue/story/event unified data schemas beyond evidence gathering`
  - `playable/minigame runtime or integration behavior`
  - `runtime-pack-unification closed version truth`
  - `project completion-state gating unless the version plan explicitly merges it into this queue`
- done_when:
  - `Current project cache, project save/load, import, export, and preview/startup seams are inventoried with source-backed evidence.`
  - `The next implementation task has a bounded persistence contract map that does not widen into unrelated authoring/data convergence.`
  - `Queue truth is synchronized with any discovered blockers or scope refinements.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "script-editor|project|cache|save|export|preview|loadScenarioPackFromFiles|import" src/application/script-editor src/ui/main-ui src/application/scenario tests docs/script-editor-prd.md`
- if_blocked:
  - `Record the concrete blocker in this queue doc rather than widening into another queue family silently.`
  - `Do not implement persistence until the current storage and export/preview seams are understood.`
- promote_next_if_done: `task.script-editor-project-cache-save-export-preview.persistence-contract-map`
- stop_if:
  - `Fresh evidence proves the admitted queue cannot proceed before another prerequisite queue is admitted.`
  - `The required files are missing or current implementation has no script-editor persistence surface to inspect.`

##### Human Context

- task_brief:
  - `Reconcile the current editor persistence/export/preview behavior before implementing the project cache and save contract.`
- task_outcome_summary:
  - `Completed with a source-backed boundary map and a ready next task for bounded persistence implementation.`
- Purpose:
  - `Avoid implementing package persistence on top of guessed editor state or hidden export behavior.`
- Failure mode:
  - `Jumping straight into UI changes could create another authoring-only shadow instead of a durable package persistence contract.`

#### `task.script-editor-project-cache-save-export-preview.persistence-contract-map`

##### Control Block

- task_id: `task.script-editor-project-cache-save-export-preview.persistence-contract-map`
- state: `completed`
- task_kind: `execution`
- scope:
  - `src/application/script-editor`
  - `src/ui/main-ui`
  - `tests`
  - `docs/blueprints/queues/script-editor-project-cache-save-export-preview-queue.md`
- must_inspect:
  - `Boundary baseline evidence from the active task.`
  - `Existing script-editor project load/save/export helpers.`
- must_not_change:
  - `unrelated data-family schemas`
  - `completion-state closeout unless merged by version truth`
  - `playable/minigame behavior`
- done_when:
  - `The queue lands a bounded project cache/save/export/preview persistence contract or records an explicit implementation blocker.`
  - `Tests or targeted verification cover the implemented persistence behavior where code changes are made.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run typecheck`
  - `npm run test`
- if_blocked:
  - `Record blocker in this queue doc and return to version review if another prerequisite queue is required.`
- promote_next_if_done: `task.script-editor-project-cache-save-export-preview.queue-closeout-and-handoff`
- stop_if:
  - `Implementation requires broad schema convergence outside this queue boundary.`

##### Human Context

- task_brief:
  - `Implement or formally map the bounded project cache/save/export/preview persistence contract.`
- task_outcome_summary:
  - `Completed with a first durable package metadata boundary and export-before-runtime-output draft persistence.`
- Purpose:
  - `Make editable package truth explicit before data-family unification work begins.`
- Failure mode:
  - `A partial save/export shortcut would preserve hidden in-memory truth and block later version closeout.`

#### `task.script-editor-project-cache-save-export-preview.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-project-cache-save-export-preview.queue-closeout-and-handoff`
- state: `completed`
- task_kind: `execution`
- scope:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-project-cache-save-export-preview-queue.md`
  - `docs/change-log.md`
- must_inspect:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-project-cache-save-export-preview-queue.md`
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
- promote_next_if_done: `return-to-version-review`
- stop_if:
  - `Bounded persistence acceptance has not been verified.`

##### Human Context

- task_brief:
  - `Close the queue only after the project cache/save/export/preview slice is verified and residue is routed.`
- task_outcome_summary:
  - `Completed with a clean handoff back to version review and the same-family residue continuation identified.`
- Purpose:
  - `Prevent a partially implemented persistence boundary from being treated as version-level progress.`
- Failure mode:
  - `Closing this queue without residue routing would obscure whether completion gating, field mapping, or schema migration is next.`

### Historical Handoff Note

- Task ID:
  - `task.script-editor-project-cache-save-export-preview.queue-closeout-and-handoff`
- Recorded handoff at closure:
  - `Return to target.script-editor-authoring-data-structure-unification version review with item.script-editor-project-cache-save-export-preview-residue-continuation recorded as same-family residue.`
- Recorded expected output:
  - `A bounded project cache/save/export/preview persistence slice landed, and remaining durable package skeleton/cache/preview semantics were routed instead of hidden.`

### Historical Candidate Notes

- `none`

### Historical Snapshot (2026-07-15)

- `Queue admitted as the first active queue under target.script-editor-authoring-data-structure-unification after the successor version activated from the existing draft.`
