# Script Editor Project Cache Save Export Preview Continuation Queue

## Control Block

- queue_id: `queue.script-editor-project-cache-save-export-preview-continuation`
- belongs_to_version: `target.script-editor-authoring-data-structure-unification`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-15`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `active`
- queue_class: `required-priority`
- active_task: `task.script-editor-project-cache-save-export-preview-continuation.queue-closeout-and-handoff`
- next_task: `return-to-version-review`
- closeout_status: `in-progress`
- execution_closeout_status: `partial`
- topic_closure_status: `open-residue`
- closure_basis: `The queue has just been admitted from same-family residue left by the first project-cache/save/export/preview queue.`
- residue_remaining: `yes`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `none`
- sync_status: `failed`
- sync_scope: `baseline-push`
- sync_summary: `Local commit 7ff88cf was created on mod-first-dev, but git push --porcelain origin mod-first-dev failed on 2026-07-15 because github.com:443 could not be reached. Repository sync failure is non-governing; execution continues from the written Blueprint truth.`
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
  - `Finish the durable package workflow residue for script-editor package persistence: create-at-save-path skeleton creation, stale path probing, imported package edit-in-place, and runtime preview-from-disk semantics.`
- Forbidden expansions:
  - `Do not migrate unrelated character, city, building, dialogue, story, event, condition, playable, or status schemas.`
  - `Do not absorb project completion-state gating unless version truth explicitly merges it.`
  - `Do not implement broad gameplay preview features beyond loading the active saved package through the existing runtime import/startup seams.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
- Predecessor queue:
  - `docs/blueprints/queues/script-editor-project-cache-save-export-preview-queue.md`

### Queue Snapshot

- queue_goal: `Finish durable package skeleton, stale cache, imported edit-in-place, and preview-from-disk semantics for the script-editor package persistence boundary.`
- task_count: `3`
- completed_task_count: `2`
- remaining_task_count: `1`
- active_task_summary: `Verify the continuation slice, classify residue, and return control to version review.`
- task_briefs:
  - `task.script-editor-project-cache-save-export-preview-continuation.boundary-baseline-reconcile: completed after evidence confirmed the predecessor queue landed packageLocation/validity metadata and export-before-output persistence while UI state still relies on transient directory handles and an in-memory library.`
  - `task.script-editor-project-cache-save-export-preview-continuation.durable-package-workflow-implementation: completed after landing durable save-location recording and stale continue gating for project library entries; broader create-at-save-path, imported edit-in-place, and runtime preview-from-disk semantics remain to be classified at closeout.`
  - `task.script-editor-project-cache-save-export-preview-continuation.queue-closeout-and-handoff: verify the continuation slice, classify residue, and return control to version review.`

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

- `This queue is admitted from same-family residue explicitly routed by queue.script-editor-project-cache-save-export-preview closeout.`
- `The predecessor queue already landed package location/stale validity metadata and export-before-runtime-output draft persistence.`
- `This queue must consume that landed baseline rather than replacing it with a parallel persistence model.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, run one minimum repository sync batch.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Activation Order

1. `Version plan same-family residue routing truth was written first.`
2. `Version-level admission review concluded before this queue became live execution truth.`
3. `This queue doc is created and synchronized as the queue-level governor.`
4. `Only then may active_task be exposed and implementation continue.`

### Recovery Rule

- `Resume from this queue doc, the predecessor queue closeout residue note, and the version-plan admission record unless new material evidence invalidates the admitted basis.`
- `Do not reopen the predecessor queue for this continuation work.`

### Boundary Baseline Evidence

- `src/application/script-editor/project-workspace-library.ts now exposes packageLocation and validity metadata plus canContinueScriptEditorProjectEntry and markScriptEditorProjectLibraryEntryStale helpers from the predecessor queue's landed slice.`
- `src/ui/main-ui/main-ui-flow.js still stores scriptEditorProjectDirectoryHandle and scriptEditorExportDirectoryHandle as transient UI instance fields, and scriptEditorProjectLibrary remains an in-memory array.`
- `src/ui/main-ui/main-ui-flow.js now calls persistScriptEditorProjectDraftBeforeExport before runtime export, but that helper only persists when scriptEditorProjectDirectoryHandle already exists.`
- `new-project still creates createDefaultScriptEditorProjectDefinition() immediately and clears the project directory handle; it does not yet create a package skeleton at a selected save path before editing.`
- `handleScriptEditorProjectFileImport and handleScriptEditorPackImport still clear durable handles after import; imported packages are not yet edited in place.`
- `The current preview surface remains the auxiliary validation panel; no action yet reloads the active saved project package from disk and starts runtime preview through loadScriptEditorProjectFromFiles or loadScenarioPackFromFiles.`
- `Browser directory handles can be reused in-session, but a portable JSON cache cannot honestly store a raw FileSystemDirectoryHandle as a stable filesystem path; stale path probing must therefore be handle/permission-aware rather than pretending arbitrary string paths are writable browser storage.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-project-cache-save-export-preview-continuation.boundary-baseline-reconcile` | `completed` | `Inspected the first queue's landed helpers and confirmed the smallest continuation implementation boundary.` | `none` | `Completed on 2026-07-15 after evidence confirmed packageLocation/validity metadata and export-before-output persistence are landed, while durable skeleton, stale probing, imported edit-in-place, and preview-from-disk remain unimplemented.` |
| `task.script-editor-project-cache-save-export-preview-continuation.durable-package-workflow-implementation` | `completed` | `Landed durable save-location recording and stale continue gating for project library entries.` | `task.script-editor-project-cache-save-export-preview-continuation.boundary-baseline-reconcile` | `Completed on 2026-07-15 with targeted regression coverage; create-at-save-path skeleton, imported edit-in-place, and runtime preview-from-disk remain for closeout classification.` |
| `task.script-editor-project-cache-save-export-preview-continuation.queue-closeout-and-handoff` | `active` | `Verify the continuation slice, classify residue, and return control to version review.` | `task.script-editor-project-cache-save-export-preview-continuation.durable-package-workflow-implementation` | `Must run lint and relevant tests before queue closeout.` |

### Task Definitions

#### `task.script-editor-project-cache-save-export-preview-continuation.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-project-cache-save-export-preview-continuation.boundary-baseline-reconcile`
- state: `completed`
- task_kind: `execution`
- scope:
  - `docs/blueprints/queues/script-editor-project-cache-save-export-preview-queue.md`
  - `docs/blueprints/queues/script-editor-project-cache-save-export-preview-continuation-queue.md`
  - `src/application/script-editor/project-workspace-library.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `docs/blueprints/queues/script-editor-project-cache-save-export-preview-queue.md`
  - `src/application/script-editor/project-workspace-library.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `unrelated script-editor data family schemas`
  - `project completion-state gating without version-plan merge`
  - `playable/minigame behavior`
  - `closed runtime-pack-unification truth`
- done_when:
  - `The continuation implementation boundary is source-backed and does not duplicate the predecessor queue's landed slice.`
  - `The implementation task is ready with a bounded test-first plan for remaining package workflow semantics.`
  - `Queue truth records any platform blockers, especially browser handle persistence limits.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "scriptEditorProjectDirectoryHandle|scriptEditorProjectLibrary|persistScriptEditorProjectDraftBeforeExport|packageLocation|validity|showDirectoryPicker|loadScriptEditorProjectFromFiles|loadScenarioPackFromFiles" src/application/script-editor/project-workspace-library.ts src/ui/main-ui/main-ui-flow.js tests/robustness.test.cjs`
- if_blocked:
  - `Record the blocker in this queue doc and return to version review if the remaining semantics require a different persistence substrate.`
- promote_next_if_done: `task.script-editor-project-cache-save-export-preview-continuation.durable-package-workflow-implementation`
- stop_if:
  - `Fresh evidence proves the remaining residue must merge into project completion-state gating before implementation.`

##### Human Context

- task_brief:
  - `Reconcile the remaining durable package workflow residue before writing more persistence code.`
- task_outcome_summary:
  - `Completed with a bounded implementation boundary that consumes the predecessor queue's landed metadata/persistence slice.`
- Purpose:
  - `Avoid building a second persistence model or overclaiming browser file handle durability.`
- Failure mode:
  - `Treating transient browser handles as a portable JSON path cache would create false continue/edit-in-place semantics.`

#### `task.script-editor-project-cache-save-export-preview-continuation.durable-package-workflow-implementation`

##### Control Block

- task_id: `task.script-editor-project-cache-save-export-preview-continuation.durable-package-workflow-implementation`
- state: `completed`
- task_kind: `execution`
- scope:
  - `src/application/script-editor`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-project-cache-save-export-preview-continuation-queue.md`
- must_inspect:
  - `Boundary baseline evidence from the active task.`
- must_not_change:
  - `unrelated data-family schemas`
  - `completion-state closeout unless merged by version truth`
  - `playable/minigame behavior`
- done_when:
  - `The remaining durable package workflow semantics either land with tests or are explicitly blocked with source-backed platform limits.`
  - `Tests cover any implemented package skeleton, stale cache, imported edit-in-place, or preview-from-disk behavior.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run typecheck`
  - `npm run test`
- if_blocked:
  - `Record blocker in this queue doc and return to version review if another prerequisite queue is required.`
- promote_next_if_done: `task.script-editor-project-cache-save-export-preview-continuation.queue-closeout-and-handoff`
- stop_if:
  - `Implementation requires broad schema convergence outside this queue boundary.`

##### Human Context

- task_brief:
  - `Implement or explicitly block the remaining durable package workflow semantics.`
- task_outcome_summary:
  - `Completed a bounded implementation slice: saving a project now records a durable directory package location when the browser supplies a directory handle, download saves remain non-durable, and stale library entries are blocked before continue opens the editor.`
- Purpose:
  - `Complete the package persistence foundation before broader authoring/data schema work depends on it.`
- Failure mode:
  - `Claiming durable path cache support where the browser can only hold transient or permission-gated handles.`

#### `task.script-editor-project-cache-save-export-preview-continuation.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-project-cache-save-export-preview-continuation.queue-closeout-and-handoff`
- state: `active`
- task_kind: `execution`
- scope:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-project-cache-save-export-preview-continuation-queue.md`
  - `docs/change-log.md`
- must_inspect:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-project-cache-save-export-preview-continuation-queue.md`
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
  - `Close the continuation only after remaining package workflow semantics are verified or honestly routed.`
- task_outcome_summary:
  - `Expected output is a clean handoff back to version review with the package persistence topic either closed or explicitly routed.`
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
  - `Durable package workflow semantics are implemented or explicitly routed as platform-governed residue.`

### Historical Candidate Notes

- `none`

### Historical Snapshot (2026-07-15)

- `Queue admitted as the same-family continuation after queue.script-editor-project-cache-save-export-preview closed its first bounded persistence slice with residue.`
