# Script Editor Runtime Preview From Memory Queue

## Control Block

- queue_id: `queue.script-editor-runtime-preview-from-memory`
- belongs_to_version: `target.script-editor-event-binding-post-closeout-fixups`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-17`
- governance_sync_source: `docs/blueprints/plans/2026-07-17-script-editor-event-binding-post-closeout-fixups-target-plan.md`
- queue_status: `done`
- queue_class: `required-priority`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- execution_closeout_status: `done`
- topic_closure_status: `closed`
- closure_basis: `guard-reviewed-and-verified`
- residue_remaining: `none`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `return-to-version-review`
- sync_status: `success`
- sync_scope: `local-record`
- sync_summary: `Queue closed after guard review confirmed preview-from-memory, exit-preview return context, and save/export path separation.`
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
  - `Make Script Editor runtime preview launch from the current in-memory project, without requiring a saved project directory round trip.`
- Resume status:
  - `Restored after queue.script-editor-event-destination-content-entry-family-correction closed and active queue/task returned to none.`
- Admission basis:
  - `The post-closeout fixup version still has one remaining blocker after destination selector queues closed.`
  - `Current preview-runtime dispatch still calls previewSavedScriptEditorProjectRuntime().`
  - `Current preview still requires scriptEditorProjectDirectoryHandle and reloads project files from disk before export/load/start.`
  - `The repository already exposes the official export/load/startup seams needed for an in-memory preview path.`
- Required scope:
  - `Generate runtime pack files directly from this.scriptEditorProject.`
  - `Reuse exportScriptEditorProjectToScenarioPackFiles(project).`
  - `Reuse loadScenarioPackFromFiles(...) through the normal runtime pack loader path.`
  - `Start through onStartScenarioPack(...) or the equivalent existing startup path.`
  - `Do not require scriptEditorProjectDirectoryHandle.`
  - `Do not call markScriptEditorProjectCompleteForExport.`
  - `If export diagnostics or loader errors occur, block preview, remain in Script Editor, and show the concrete diagnostics or error.`
  - `Record return context before entering preview: screen, Script Editor selection, tab state, and practical scroll/context state.`
  - `Show the right-side runtime page exit control labeled "退出预览" only during preview sessions.`
  - `Exit preview returns to the previous Script Editor workspace, selection, tab, and preserved context without losing unsaved edits.`
- Forbidden expansions:
  - `Do not change EventBindingRuntime semantics.`
  - `Do not implement best-effort preview that skips export failures.`
  - `Do not require saving to disk before preview.`
  - `Do not mark the project complete for export.`
  - `Do not write preview artifacts to the formal export directory.`
  - `Do not enter version closeout.`
  - `Do not commit, push, or merge.`

### Evidence Lock

- evidence_lock_status: `locked`
- implementation_anchor_status: `confirmed`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-POST-CLOSEOUT-RUNTIME-PREVIEW-001`
- acceptance_not_claimed:
  - `Browser runtime trigger proof.`
  - `Runtime semantic changes.`
  - `Version closeout.`
- minimum_verification:
  - `focused runtime preview tests`
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`
  - `built-in browser workflow test for preview-from-memory before closeout`

### Claim Boundary

#### Can Claim

- `Admission/evidence and resume: the current preview gap is confirmed and implementation is active.`
- `Implementation: preview launches from current in-memory Script Editor data through the official export/load/startup path.`
- `Implementation: preview failures remain in the Script Editor and display a warning notice.`
- `Implementation: preview session state and exit-preview return context exist.`

#### Cannot Claim

- `Preview launches from in-memory Script Editor data.`
- `Preview has an exit session state or "退出预览" control.`
- `Preview preserves return context.`
- `Version closeout.`

#### Evidence Review Facts

#### Current Claim Boundary

- Can claim:
  - `Implementation: preview launches from current in-memory Script Editor data through the official export/load/startup path.`
  - `Implementation: preview failures remain in the Script Editor and display a warning notice.`
  - `Implementation: preview session state and exit-preview return context exist.`
- Cannot claim:
  - `Queue closeout is complete.`
  - `Built-in browser workflow guard has passed.`
  - `Version closeout.`

- `src/ui/main-ui/main-ui-flow.js`:
  - `preview-runtime` action dispatches to `previewSavedScriptEditorProjectRuntime()`.
  - `previewSavedScriptEditorProjectRuntime()` checks `this.scriptEditorProjectDirectoryHandle == null`.
  - `previewSavedScriptEditorProjectRuntime()` reads from disk with `readFilesFromDirectoryHandle(this.scriptEditorProjectDirectoryHandle)` and `loadScriptEditorProjectFromFiles(...)`.
  - `previewSavedScriptEditorProjectRuntime()` then exports via `exportScriptEditorProjectToScenarioPackFiles(project)`, loads via `loadScenarioPackFromFiles(createTextImportFilesFromRecord(serializedPackFiles))`, and starts via `await this.onStartScenarioPack?.(scenarioPack)`.
  - `previewSavedScriptEditorProjectRuntime()` does not call `markScriptEditorProjectCompleteForExport`.
- `src/application/script-editor/workspace-shell.ts`:
  - `preview-runtime` toolbar action exists.
  - The action description still describes saving and re-reading from the project directory before runtime preview.
- `tests/robustness.test.cjs`:
  - Existing source tests assert the current saved-directory preview behavior.
  - Existing tests assert the preview method does not call `markScriptEditorProjectCompleteForExport`.
- Source search:
  - `exportScriptEditorProjectToScenarioPackFiles(project)`, `loadScenarioPackFromFiles(...)`, and `onStartScenarioPack(...)` exist as reusable seams.
  - No existing preview session state or `退出预览` / `exit-preview` runtime-page control was found.

### Implementation Anchors

- Must inspect:
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `tests/robustness.test.cjs`
- Must preserve:
  - `Official runtime pack export/load/startup path.`
  - `Export diagnostics and loader failure visibility.`
  - `Unsaved in-memory Script Editor project edits.`
  - `EventBindingRuntime semantics.`
  - `EventDefinition trigger/conditions ownership boundaries.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-17-script-editor-event-binding-post-closeout-fixups-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-17-script-editor-event-binding-post-closeout-fixups-target-plan.md`

### Queue Snapshot

- queue_goal: `Launch Script Editor runtime preview from current in-memory project data through the official export/load/startup path and provide a preview exit return context.`
- task_count: `3`
- completed_task_count: `2`
- remaining_task_count: `1`
- active_task_summary: `Queue closed; return to fixup version review without automatic version closeout.`
- task_briefs:
  - `task.script-editor-runtime-preview-from-memory.evidence-anchor-reconcile: Confirm current disk-only preview behavior and lock the implementation boundary.`
  - `task.script-editor-runtime-preview-from-memory.implementation: Implement preview-from-memory with validation blocking, preview session state, exit control, and return context.`
  - `task.script-editor-runtime-preview-from-memory.queue-closeout-and-handoff: Verify queue acceptance and return to version review without automatic version closeout.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-runtime-preview-from-memory.evidence-anchor-reconcile` | `done` | `Confirmed current disk-only preview behavior and locked the implementation boundary.` | `none` | `Completed during admission on 2026-07-17; no implementation code changed.` |
| `task.script-editor-runtime-preview-from-memory.implementation` | `done` | `Implemented preview-from-memory with validation blocking, preview session state, exit control, and return context.` | `task.script-editor-runtime-preview-from-memory.evidence-anchor-reconcile` | `Completed on 2026-07-17; focused runtime preview tests, npm run typecheck, npm run lint:blueprints, and npm test passed.` |
| `task.script-editor-runtime-preview-from-memory.queue-closeout-and-handoff` | `done` | `Guard review passed and queue returned to version review without automatic version closeout.` | `task.script-editor-runtime-preview-from-memory.implementation` | `Closed on 2026-07-17; npm run lint:blueprints passed after Blueprint sync.` |

### Task Definitions

#### `task.script-editor-runtime-preview-from-memory.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.script-editor-runtime-preview-from-memory.evidence-anchor-reconcile`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/plans/2026-07-17-script-editor-event-binding-post-closeout-fixups-target-plan.md`
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/application/script-editor/workspace-shell.ts`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `preview-runtime action dispatch`
  - `previewSavedScriptEditorProjectRuntime`
  - `scriptEditorProjectDirectoryHandle dependency`
  - `export/load/startup seams`
  - `markScriptEditorProjectCompleteForExport preview boundary`
  - `preview session and exit-preview UI state`
- must_not_change:
  - `runtime preview implementation`
  - `EventBindingRuntime semantics`
  - `version closeout`
- done_when:
  - `The current disk-only preview path is recorded.`
  - `The in-memory preview implementation boundary is recorded.`
  - `Implementation task is activated.`
- verify_with:
  - `npm run lint:blueprints`
- promote_next_if_done: `task.script-editor-runtime-preview-from-memory.implementation`

##### Human Context

- task_brief:
  - `Confirm current disk-only preview behavior and lock the implementation boundary.`
- task_outcome_summary:
  - `Done. Evidence confirmed preview-runtime still routes to previewSavedScriptEditorProjectRuntime(), which requires scriptEditorProjectDirectoryHandle, reads project files from disk, then exports/loads/starts through the official seams. The method does not call markScriptEditorProjectCompleteForExport, and no existing preview session state or exit-preview button was found.`

#### `task.script-editor-runtime-preview-from-memory.implementation`

##### Control Block

- task_id: `task.script-editor-runtime-preview-from-memory.implementation`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `tests/robustness.test.cjs`
- must_replace:
  - `preview-runtime saved-directory-only startup requirement`
  - `preview toolbar copy that implies disk re-read is required`
- must_add:
  - `preview from current this.scriptEditorProject`
  - `validation and loader failure blocking without leaving Script Editor`
  - `preview session state`
  - `"退出预览" runtime page control only during preview`
  - `return context restoration`
- must_preserve:
  - `official export/load/startup path`
  - `markScriptEditorProjectCompleteForExport exclusion`
  - `EventBindingRuntime semantics`
  - `EventDefinition trigger/conditions boundaries`
- verify_with:
  - `focused runtime preview tests`
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`
  - `built-in browser workflow test`

##### Human Context

- task_brief:
  - `Implement preview-from-memory with validation blocking, preview session state, exit control, and return context.`
- task_outcome_summary:
  - `Done. Preview-runtime now launches from current this.scriptEditorProject data through exportScriptEditorProjectToScenarioPackFiles, loadScenarioPackFromFiles(createTextImportFilesFromRecord(serializedPackFiles)), and onStartScenarioPack without requiring scriptEditorProjectDirectoryHandle, reading project files from disk, calling persistScriptEditorProjectDraftBeforeExport, or calling markScriptEditorProjectCompleteForExport. Export/load failures leave the editor open with a warning notice. Preview sessions record screen, Script Editor selection, tab, and scroll context; the runtime preview screen renders a "退出预览" control; exit restores the prior Script Editor workspace context.`

#### `task.script-editor-runtime-preview-from-memory.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-runtime-preview-from-memory.queue-closeout-and-handoff`
- state: `active`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/queues/script-editor-runtime-preview-from-memory-queue.md`
  - `docs/blueprints/plans/2026-07-17-script-editor-event-binding-post-closeout-fixups-target-plan.md`
  - `docs/blueprints/project-progress.md`
- must_not_change:
  - `runtime semantics`
  - `version closeout`
- done_when:
  - `Queue closeout records implementation and browser/runtime verification.`
  - `Blueprint lint passes.`
  - `Version review remains separate unless explicitly requested.`
- verify_with:
  - `npm run lint:blueprints`
- promote_next_if_done: `version-promotion-review`

##### Human Context

- task_brief:
  - `Verify queue acceptance and return to version review without automatic version closeout.`
- task_outcome_summary:
  - `Done. Guard review confirmed preview-runtime uses this.scriptEditorProject through exportScriptEditorProjectToScenarioPackFiles, loadScenarioPackFromFiles, and onStartScenarioPack without requiring scriptEditorProjectDirectoryHandle, reading project files from disk, or calling markScriptEditorProjectCompleteForExport. Export/load failures remain in the Script Editor with warning notice, preview session state owns the "退出预览" control, and exit restores Script Editor workspace/selection/tab/context. Follow-up guard confirmed save/export separation: the save action is labeled "保存项目" and writes project.json through serializeScriptEditorProjectToFiles, runtime export writes pack.json through exportScriptEditorProjectToScenarioPackFiles, and JSON startup imports of Script Editor project packages now receive a friendly project-package error rather than only missing pack.json.`

### Progress Log

- `2026-07-17`: `Completed implementation and paused before queue closeout. RED tests covered the old saved-directory-only preview requirement, directory-handle/file-read dependency, missing preview session, missing exit-preview UI, and missing return-context restoration. GREEN implementation now previews from this.scriptEditorProject through the official export/load/startup path, does not require scriptEditorProjectDirectoryHandle, does not read project files from disk, does not call markScriptEditorProjectCompleteForExport or persistScriptEditorProjectDraftBeforeExport, blocks export/load failure in the editor with a warning notice, records return context, shows "退出预览" only during preview, and restores the previous Script Editor workspace context on exit. Verification passed: focused runtime preview tests, npm run typecheck, npm run lint:blueprints, and npm test (613/613).`
- `2026-07-17`: `Implementation follow-up fixed stale runtime preview toolbar copy. RED focused test failed while the action still said it would save the draft and re-read from the project directory. GREEN copy now says preview uses current editor memory data, matching the in-memory preview path. Verification passed again: focused runtime preview tests, npm run typecheck, npm run lint:blueprints, and npm test (613/613).`
- `2026-07-17`: `Restored this queue after resume/admission reconcile. Preconditions confirmed: queue.script-editor-event-destination-content-entry-family-correction is done, the previous blocker is resolved, active queue/task were none, and the runtime preview implementation scope remains valid. Implementation is active; no version closeout, commit, push, merge, or other queue admission was attempted.`
- `2026-07-17`: `Destination content-entry family correction closed. This queue remains non-active and must be resumed only through a separate promotion/resume review; implementation was not restored during corrective queue closeout.`
- `2026-07-17`: `Closed this queue after guard review and Blueprint handoff without entering version closeout, committing, pushing, merging, or admitting another queue. Guard review confirmed preview-runtime uses current this.scriptEditorProject data through the official export/load/startup path, does not require scriptEditorProjectDirectoryHandle, does not read project files from disk, does not call markScriptEditorProjectCompleteForExport, blocks export/load failure in the editor with warning notice, shows the preview-only "退出预览" control, and restores the prior Script Editor workspace/selection/tab/context on exit. The same guard included the save/export confusion fix: "保存项目" remains the project-save action using serializeScriptEditorProjectToFiles and project.json, runtime export remains exportScriptEditorProjectToScenarioPackFiles and pack.json, and JSON startup now reports a friendly Script Editor project-package error when project.json kind=script-editor-project is imported without pack.json. Verification passed: npm run lint:blueprints.`
