# Script Editor Durable Package Workflow Continuation Queue

## Control Block

- queue_id: `queue.script-editor-durable-package-workflow-continuation`
- belongs_to_version: `target.script-editor-authoring-data-structure-unification`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-15`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `active`
- queue_class: `required-priority`
- active_task: `task.script-editor-durable-package-workflow-continuation.package-skeleton-import-preview-implementation`
- next_task: `task.script-editor-durable-package-workflow-continuation.queue-closeout-and-handoff`
- closeout_status: `in-progress`
- execution_closeout_status: `partial`
- topic_closure_status: `open-residue`
- closure_basis: `This queue has just been admitted from same-family residue left by queue.script-editor-project-cache-save-export-preview-continuation.`
- residue_remaining: `yes`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `none`
- sync_status: `success`
- sync_scope: `baseline-push`
- sync_summary: `Commit f698c18 on mod-first-dev was pushed successfully to origin/mod-first-dev after boundary baseline reconcile completed and package skeleton/imported edit-in-place/runtime preview-from-disk implementation became the active task.`
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
  - `Finish the remaining durable package workflow semantics that still block broader authoring/data queues from relying on editable package truth: create-at-save-path package skeleton creation, imported package edit-in-place, and runtime preview-from-disk.`
- Forbidden expansions:
  - `Do not migrate character, city, building, dialogue, story, event, condition, playable, or status schemas.`
  - `Do not absorb project completion-state gating unless version truth explicitly merges it.`
  - `Do not replace browser File System Access API constraints with fake durable string paths.`
  - `Do not broaden runtime preview into unrelated gameplay preview features beyond loading the active saved package through existing import/startup seams.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
- Predecessor queue:
  - `docs/blueprints/queues/script-editor-project-cache-save-export-preview-continuation-queue.md`

### Queue Snapshot

- queue_goal: `Complete package skeleton creation, imported package edit-in-place, and runtime preview-from-disk semantics for the script-editor package persistence boundary.`
- task_count: `3`
- completed_task_count: `1`
- remaining_task_count: `2`
- active_task_summary: `Implement or explicitly block create-at-save-path package skeleton creation, imported package edit-in-place, and runtime preview-from-disk with tests.`
- task_briefs:
  - `task.script-editor-durable-package-workflow-continuation.boundary-baseline-reconcile: completed after source evidence confirmed the landed packageLocation/validity/stale gating helpers and the still-open package skeleton/imported edit-in-place/runtime preview-from-disk boundary.`
  - `task.script-editor-durable-package-workflow-continuation.package-skeleton-import-preview-implementation: active implementation task for create-at-save-path skeleton creation, imported edit-in-place, and runtime preview-from-disk.`
  - `task.script-editor-durable-package-workflow-continuation.queue-closeout-and-handoff: verify the implementation slice, classify residue, and return control to version review.`

### Operator Snapshot Contract

- `The fixed operator receipt must source 褰撳墠鎵ц闃熷垪 from queue_id.`
- `The fixed operator receipt must source 褰撳墠浠诲姟 from active_task.`
- `The fixed operator receipt must source 褰撳墠闃熷垪鐩爣 from queue_goal.`
- `Queue Snapshot exists to support concise operator visibility without exposing Blueprint internal ranking or admission internals by default.`

### Closeout Judgement Rule

- `Queue execution closeout is not equivalent to true topic closure.`
- `execution_closeout_status = done means the bounded execution slice landed and verified.`
- `topic_closure_status = closed is legal only when no still-blocking same-family residue remains inside the queue's bounded topic surface.`
- `If residue_remaining = yes, classify it as same-family / cross-family / accepted-residue / none before version-level routing continues.`
- `If residue_family = same-family and one lawful continuation exists, name it in next_family_candidate and allow automatic continuation instead of returning to open-ended human queue selection.`

### Admission Preconditions

- `queue.script-editor-project-cache-save-export-preview landed package location/stale validity metadata and export-before-runtime-output draft persistence.`
- `queue.script-editor-project-cache-save-export-preview-continuation landed durable save-location recording and stale continue gating.`
- `Remaining work must consume the landed metadata and stale gating rather than building a parallel persistence model.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, run one minimum repository sync batch.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Activation Order

1. `The predecessor continuation queue closeout truth was written first.`
2. `Version plan same-family residue routing and admission truth was written second.`
3. `This queue doc is created and synchronized as the queue-level governor.`
4. `Only then may active_task be exposed and implementation continue.`

### Recovery Rule

- `Resume from this queue doc, the predecessor queue closeout residue note, and the version-plan admission record unless new material evidence invalidates the admitted basis.`
- `Do not reopen the predecessor queue for this continuation work.`

### Boundary Baseline Evidence

- `src/application/script-editor/project-workspace-library.ts exposes packageLocation and validity metadata plus canContinueScriptEditorProjectEntry and markScriptEditorProjectLibraryEntryStale helpers.`
- `src/ui/main-ui/main-ui-flow.js records a durable directory package location after save when the browser supplies a directory handle, and blocks stale library entries before continue opens the editor.`
- `new-project still creates createDefaultScriptEditorProjectDefinition() immediately and clears the project directory handle; it does not yet create a package skeleton at a selected save path before editing.`
- `handleScriptEditorProjectFileImport and handleScriptEditorPackImport still clear durable handles after import; imported packages are not yet edited in place.`
- `The current preview surface remains the auxiliary validation panel; no action yet reloads the active saved project package from disk and starts runtime preview through loadScriptEditorProjectFromFiles or loadScenarioPackFromFiles.`
- `Browser directory handles can be reused in-session, but a portable JSON cache cannot honestly store a raw FileSystemDirectoryHandle as a stable filesystem path.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-durable-package-workflow-continuation.boundary-baseline-reconcile` | `completed` | `Reconciled the remaining package skeleton/imported edit-in-place/runtime preview boundary against landed persistence helpers.` | `none` | `Completed on 2026-07-15 after rg evidence confirmed packageLocation/validity/stale gating helpers are landed while new-project, import, and preview remain transient or auxiliary-panel only.` |
| `task.script-editor-durable-package-workflow-continuation.package-skeleton-import-preview-implementation` | `active` | `Implement or explicitly block create-at-save-path skeleton creation, imported edit-in-place, and runtime preview-from-disk with tests.` | `task.script-editor-durable-package-workflow-continuation.boundary-baseline-reconcile` | `Must not broaden into project completion-state gating or data-family schemas.` |
| `task.script-editor-durable-package-workflow-continuation.queue-closeout-and-handoff` | `pending` | `Verify the implementation slice, classify residue, and return control to version review.` | `task.script-editor-durable-package-workflow-continuation.package-skeleton-import-preview-implementation` | `Must run lint and relevant tests before queue closeout.` |

### Task Definitions

#### `task.script-editor-durable-package-workflow-continuation.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-durable-package-workflow-continuation.boundary-baseline-reconcile`
- state: `completed`
- task_kind: `execution`
- scope:
  - `docs/blueprints/queues/script-editor-project-cache-save-export-preview-continuation-queue.md`
  - `docs/blueprints/queues/script-editor-durable-package-workflow-continuation-queue.md`
  - `src/application/script-editor/project-workspace-library.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `docs/blueprints/queues/script-editor-project-cache-save-export-preview-continuation-queue.md`
  - `src/application/script-editor/project-workspace-library.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `unrelated script-editor data family schemas`
  - `project completion-state gating without version-plan merge`
  - `playable/minigame behavior`
  - `closed runtime-pack-unification truth`
- done_when:
  - `The remaining package skeleton/imported edit-in-place/runtime preview implementation boundary is source-backed and does not duplicate landed packageLocation/validity/stale gating behavior.`
  - `The implementation task is ready with a bounded test-first plan for remaining package workflow semantics.`
  - `Queue truth records any platform blockers, especially browser handle persistence limits.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "scriptEditorProjectDirectoryHandle|scriptEditorProjectLibrary|persistScriptEditorProjectDraftBeforeExport|packageLocation|validity|showDirectoryPicker|loadScriptEditorProjectFromFiles|loadScenarioPackFromFiles" src/application/script-editor/project-workspace-library.ts src/ui/main-ui/main-ui-flow.js tests/robustness.test.cjs`
- if_blocked:
  - `Record the blocker in this queue doc and return to version review if the remaining semantics require a different persistence substrate.`
- promote_next_if_done: `task.script-editor-durable-package-workflow-continuation.package-skeleton-import-preview-implementation`
- stop_if:
  - `Fresh evidence proves the remaining residue must merge into project completion-state gating before implementation.`

##### Human Context

- task_brief:
  - `Reconcile the remaining durable package workflow residue before writing more persistence code.`
- task_outcome_summary:
  - `Completed with a bounded implementation handoff: consume landed packageLocation/validity/stale gating helpers, then implement or explicitly block package skeleton creation, imported edit-in-place, and runtime preview-from-disk without widening into completion-state or schema queues.`
- Purpose:
  - `Avoid building a second persistence model or overclaiming browser file handle durability.`
- Failure mode:
  - `Treating transient browser handles as a portable JSON path cache would create false continue/edit-in-place semantics.`

#### `task.script-editor-durable-package-workflow-continuation.package-skeleton-import-preview-implementation`

##### Control Block

- task_id: `task.script-editor-durable-package-workflow-continuation.package-skeleton-import-preview-implementation`
- state: `active`
- task_kind: `execution`
- scope:
  - `src/application/script-editor`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-durable-package-workflow-continuation-queue.md`
- must_inspect:
  - `Boundary baseline evidence from the active task.`
- must_not_change:
  - `unrelated data-family schemas`
  - `completion-state closeout unless merged by version truth`
  - `playable/minigame behavior`
- done_when:
  - `Create-at-save-path package skeleton creation, imported package edit-in-place, and runtime preview-from-disk either land with tests or are explicitly blocked with source-backed platform limits.`
  - `Tests cover any implemented package skeleton, imported edit-in-place, or preview-from-disk behavior.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run typecheck`
  - `npm run test`
- if_blocked:
  - `Record blocker in this queue doc and return to version review if another prerequisite queue is required.`
- promote_next_if_done: `task.script-editor-durable-package-workflow-continuation.queue-closeout-and-handoff`
- stop_if:
  - `Implementation requires broad schema convergence outside this queue boundary.`

##### Human Context

- task_brief:
  - `Implement or explicitly block the remaining durable package workflow semantics.`
- task_outcome_summary:
  - `Expected output is a verified package workflow slice or explicit blocker routing.`
- Purpose:
  - `Complete the package persistence foundation before broader authoring/data schema work depends on it.`
- Failure mode:
  - `Claiming durable edit-in-place or runtime preview support where the browser can only hold transient or permission-gated handles.`

#### `task.script-editor-durable-package-workflow-continuation.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-durable-package-workflow-continuation.queue-closeout-and-handoff`
- state: `pending`
- task_kind: `execution`
- scope:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-durable-package-workflow-continuation-queue.md`
  - `docs/change-log.md`
- must_inspect:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-durable-package-workflow-continuation-queue.md`
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
  - `Continuation acceptance has not been verified or explicitly blocked.`

##### Human Context

- task_brief:
  - `Close the durable package workflow continuation only after remaining package workflow semantics are verified or honestly routed.`
- task_outcome_summary:
  - `Expected output is a clean handoff back to version review with the package workflow topic either closed or explicitly routed.`
- Purpose:
  - `Prevent hidden same-family persistence gaps from leaking into later schema queues.`
- Failure mode:
  - `Closing this continuation without testing or platform-blocker routing would make later authoring/data queues depend on unreliable package truth.`

### Historical Handoff Note

- Task ID:
  - `none`
- Recorded handoff at closure:
  - `none yet`
- Recorded expected output:
  - `Remaining durable package workflow semantics are implemented or explicitly routed as platform-governed residue.`

### Historical Candidate Notes

- `none`

### Historical Snapshot (2026-07-15)

- `Queue admitted as the same-family continuation after queue.script-editor-project-cache-save-export-preview-continuation closed with package skeleton/imported edit-in-place/runtime preview-from-disk residue.`
