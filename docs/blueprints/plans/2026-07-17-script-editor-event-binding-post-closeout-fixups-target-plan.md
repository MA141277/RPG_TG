# Script Editor Event Binding Post-Closeout Fixups Version Plan

## Control Block

- document_role: `version-governor`
- version_id: `target.script-editor-event-binding-post-closeout-fixups`
- version_status: `open`
- active_phase: `phase.version-review-pending`
- active_queue: `none`
- decision_state: `idle-open`
- next_decision: `version-closeout`
- next_action: `write-version-closeout`
- resume_gate: `no-active-queue`
- post_queue_closeout_pause_policy: `pause-when-explicitly-requested`
- promotion_review_result: `queue-closeout-complete`
- review_subject_id: `none`
- review_subject_classification: `none`
- proposed_queue_id: `none`
- review_basis: `none`
- admission_status: `none`
- intake_status: `none`
- intake_item_id: `none`
- intake_summary: `none`
- intake_result: `none`
- intake_feedback_mode: `none`
- closure_review_subject: `none`
- closure_review_status: `none`
- residue_candidate_id: `none`
- residue_candidate_family: `none`
- routing_basis: `none`
- next_lawful_queue_recommendation: `none`
- auto_admission_ready: `false`
- blocked_by: []
- candidate_queue_ids:
  - `queue.script-editor-event-destination-selector-completion`
  - `queue.script-editor-event-destination-selector-family-coverage-correction`
  - `queue.script-editor-event-destination-content-entry-family-correction`
  - `queue.script-editor-runtime-preview-from-memory`
- candidate_backlog_refresh_status: `fresh`
- candidate_backlog_snapshot: []
- candidate_backlog_scan_sources:
  - `project-progress`
  - `blueprint`
  - `current version plan`
  - `candidate_queue_ids`
  - `Candidate Recovery Ledger`
  - `Queue Promotion Ledger`
  - `named queue docs`

## Human Context

### Activation Record

- Scope approval:
  - `The operator requested a successor/fixup version for submit/merge blockers found after target.script-editor-event-binding-runtime-replacement was already closed.`
- Inherits from:
  - `target.script-editor-event-binding-runtime-replacement`
- Inheritance boundary:
  - `The predecessor remains version_status=done and is not reopened. This version owns only post-closeout fixes needed before submit/merge readiness.`
- Activation conclusion:
  - `target.script-editor-event-binding-post-closeout-fixups is the open successor/fixup version.`
  - `queue.script-editor-event-destination-selector-completion is admitted first.`
  - `queue.script-editor-runtime-preview-from-memory is recorded as the next candidate after destination selector completion, but is not admitted yet.`

### Version Lifecycle Rules

- `This version remains open until explicit closeout is recorded here.`
- `If active_queue = none, the version is idle-open, not done.`
- `A queue may be admitted only after version-plan admission fields are synchronized and the queue doc exists with queue_status=active plus a live active_task.`
- `Do not reopen target.script-editor-event-binding-runtime-replacement for post-closeout blockers.`
- `No active queue remains; the version is idle-open and awaiting version closeout review only.`

### Queue Admission Startup Rules

1. `Read project-progress -> blueprint -> version plan -> active queue before touching a fresh queue item.`
2. `Check whether an active queue already exists.`
3. `Classify the item before any queue creation or implementation.`
4. `If the item is queue-candidate, write review_subject_id / review_subject_classification / proposed_queue_id / review_basis / admission_status first.`
5. `Only after version-plan admission sync may a queue doc be created and activated.`
6. `Only after the admitted queue doc exposes queue_status=active plus a live active_task may implementation start.`
7. `User scope approval is boundary approval only; it does not replace admission.`

### Candidate Recovery Ledger

| Candidate ID | Last Classification | Proposed Queue | Latest Disposition | Recheck Trigger | Notes |
| --- | --- | --- | --- | --- | --- |
| `blocker.script-editor-event-destination-selector-ui` | `queue-candidate` | `queue.script-editor-event-destination-selector-completion` | `closed` | `only if destination selector regresses` | `Closed on 2026-07-17 after guard review confirmed the event destination tab no longer exposes raw English family enums or a free-text targetId main path; targetId is project.dialogues-backed, saves dialogue.id, and unsupported non-dialogue destinations remain fail-closed residue.` |
| `blocker.script-editor-event-destination-selector-family-coverage` | `queue-candidate` | `queue.script-editor-event-destination-selector-family-coverage-correction` | `closed` | `only if family coverage regresses` | `Closed on 2026-07-17 after guard review confirmed localized person/city/building/event/dialogue/minigame family choices, family-specific target selectors, stale target clearing, person->people reference validation, dialogue-only export support, and fail-closed non-dialogue runtime boundary.` |
| `blocker.script-editor-event-destination-content-entry-family` | `queue-candidate` | `queue.script-editor-event-destination-content-entry-family-correction` | `closed` | `only if content-entry destination family regresses` | `Closed on 2026-07-17 after guard review confirmed destination families are narrowed to dialogue/event/minigame content entries, targetId remains select-only with dialogue/event/minigame project sources, related-object authoring for person/city/building remains outside destination, and runtime export remains dialogue-only with event/minigame fail-closed.` |
| `blocker.script-editor-runtime-preview-from-memory` | `queue-candidate` | `queue.script-editor-runtime-preview-from-memory` | `closed` | `none` | `Queue closeout completed on 2026-07-17 after guard review confirmed preview-from-memory uses current in-memory Script Editor data through the official export/load/startup path, blocks export/load failure in the editor, exposes exit-preview return context, and is now fully dispositioned for this version.` |

### Queue Promotion Ledger

| Queue ID | Current Disposition | Promote When | Notes |
| --- | --- | --- | --- |
| `queue.script-editor-event-destination-selector-completion` | `done` | `Closed after guard review and Blueprint closeout on 2026-07-17.` | `Event destination family authoring now exposes the Chinese dialogue-only runnable main path, targetId is selected from project.dialogues, selected values save dialogue.id, and unsupported non-dialogue destinations remain fail closed.`
| `queue.script-editor-event-destination-selector-family-coverage-correction` | `done` | `Closed after guard review and Blueprint closeout on 2026-07-17.` | `Restored localized person/city/building/event/dialogue/minigame destination family choices, family-specific project data sources for target selectors, stale targetId clearing on family change, person->people reference validation, and dialogue-only runnable export support.`
| `queue.script-editor-event-destination-content-entry-family-correction` | `done` | `Closed after guard review and Blueprint closeout on 2026-07-17.` | `Implementation narrowed destination family to dialogue/event/minigame content entries while preserving dialogue-only runnable export and keeping person/city/building as related-object authoring, not destination.`
| `queue.script-editor-runtime-preview-from-memory` | `done` | `Closed after guard review and Blueprint handoff on 2026-07-17.` | `Preview uses current this.scriptEditorProject data, official runtime pack export/load/startup seams, validation blocking on diagnostics, preview session state, and exit-preview return context.`

### Operator Intake Contract

- Allowed operator intake:
  - `新需求`
  - `参考治理规范`
- Internal-only Blueprint work:
  - `read project-progress -> blueprint -> version plan -> active queue -> active task`
  - `attempt active-queue absorption`
  - `classify and route the intake`
  - `record candidate truth or admission truth without asking the operator to fill internal fields`
- Default operator output:

```text
处理结果：
- 加入状态：成功 / 失败 / 成功，已加入
- 加入类型：执行队列 / 候选队列 / 未加入
- 加入队列：`具体队列ID` / `none`

原因说明：
- 用 2~4 句话说明为什么进入该队列，或者为什么没有成功加入。
- 如果没有进入执行队列，要明确说明是因为当前已有 active queue，还是因为它当前只满足候选条件。

当前执行情况：
- 当前执行队列：`具体队列ID`
- 当前任务：`具体 task ID`
- 当前队列目标：一句话说明

下一步：
- 说明 Blueprint 接下来会如何处理
- 人工操作：当前不需要 / 当前需要确认 xxx
```

- Default visibility rule:
  - `默认不向人工暴露真值链细节、候选全集、Why Not The Others、Human Involvement Boundary、admission 内部字段或排序全过程，除非人工明确要求展开内部分析。`

### Candidate Evidence Matrix

| Queue ID | Source Docs | Acceptance Refs | Implementation Anchors | Legacy Paths To Replace | Compatibility Paths To Preserve | Reject Or Split If |
| --- | --- | --- | --- | --- | --- | --- |
| `queue.script-editor-event-destination-selector-completion` | `docs/script-editor-event-trigger-binding-design.md; predecessor closeout evidence; post-closeout browser finding` | `ACC-POST-CLOSEOUT-DESTINATION-SELECTOR-001` | `src/ui/main-ui/main-ui-flow.js; src/application/script-editor/story-dialogue-event-authoring.ts; src/application/script-editor/runtime-pack-export.ts; tests/robustness.test.cjs` | `Raw English destination family enum select and free-text destination targetId main path.` | `Dialogue-only runnable export support and fail-closed unsupported destinations.` | `Implementation requires expanding runtime destination support beyond dialogue.` |
| `queue.script-editor-event-destination-content-entry-family-correction` | `docs/script-editor-event-trigger-binding-design.md; operator design correction; current destination selector code facts` | `ACC-POST-CLOSEOUT-DESTINATION-CONTENT-ENTRY-FAMILY-001` | `src/domain/script-editor-project.ts; src/application/script-editor/story-dialogue-event-authoring.ts; src/application/script-editor/workspace-shell.ts; src/ui/main-ui/main-ui-flow.js; src/application/script-editor/runtime-pack-export.ts; tests/robustness.test.cjs` | `Destination family main path exposing person/city/building as executable destinations.` | `Dialogue/event/minigame content-entry authoring, related-object authoring, dialogue-only runnable export, unsupported event/minigame fail-closed.` | `Implementation requires EventBindingRuntime changes or runtime support for event/minigame destinations.`
| `queue.script-editor-runtime-preview-from-memory` | `post-closeout browser finding; existing preview tests; Script Editor save/export workflow` | `ACC-POST-CLOSEOUT-RUNTIME-PREVIEW-001` | `src/ui/main-ui/main-ui-flow.js; src/application/script-editor/runtime-pack-export.ts; src/application/script-editor/workspace-shell.ts; tests/robustness.test.cjs` | `Saved-directory-only preview startup requirement.` | `Official runtime pack loader/startup path and export diagnostics.` | `Preview requires best-effort skipping of export failures or runtime semantic changes.` |

### Acceptance Coverage Ledger

| Acceptance ID | Primary Owner Queue | Proof Artifact | Status | Residue Or Blocker |
| --- | --- | --- | --- | --- |
| `ACC-POST-CLOSEOUT-DESTINATION-SELECTOR-001` | `queue.script-editor-event-destination-selector-completion` | `focused destination selector tests; npm run typecheck; npm run lint:blueprints; npm test; source guard review` | `covered` | `none` |
| `ACC-POST-CLOSEOUT-DESTINATION-FAMILY-COVERAGE-001` | `queue.script-editor-event-destination-selector-family-coverage-correction` | `focused destination selector tests; npm run typecheck; npm run lint:blueprints; npm test; source guard review` | `covered` | `none` |
| `ACC-POST-CLOSEOUT-DESTINATION-CONTENT-ENTRY-FAMILY-001` | `queue.script-editor-event-destination-content-entry-family-correction` | `focused destination tests; npm run typecheck; npm run lint:blueprints; npm test; source guard review` | `covered` | `none` |
| `ACC-POST-CLOSEOUT-RUNTIME-PREVIEW-001` | `queue.script-editor-runtime-preview-from-memory` | `focused runtime preview tests; npm run typecheck; npm run lint:blueprints; npm test; queue closeout guard review` | `covered` | `none` |

### Progress Log

- `2026-07-17`: `Created target.script-editor-event-binding-post-closeout-fixups as a successor/fixup version after target.script-editor-event-binding-runtime-replacement closed. The predecessor remains done and is not reopened. Admitted queue.script-editor-event-destination-selector-completion first because event destination UI currently exposes raw English family enums and free-text targetId while runtime export supports only dialogue destinations. Recorded queue.script-editor-runtime-preview-from-memory as the next candidate after destination selector completion; no implementation code was changed.`
- `2026-07-17`: `Completed queue.script-editor-event-destination-selector-completion implementation without queue closeout. Event destination family authoring now exposes the Chinese dialogue-only runnable main path, destination targetId uses a project.dialogues-backed selector showing title plus id, selected values still save dialogue.id, and unsupported non-dialogue destinations remain fail-closed rather than runnable. Verification passed: focused destination tests, npm run typecheck, npm run lint:blueprints, and npm test (611/611). Runtime preview-from-memory remains only a candidate and was not admitted.`
- `2026-07-17`: `Closed queue.script-editor-event-destination-selector-completion after guard review and Blueprint handoff without entering version closeout, committing, pushing, merging, or admitting runtime preview. Guard review confirmed the event destination family main path no longer uses raw English enum mapping, targetId is a select backed by project.dialogues, options show dialogue title plus id and save dialogue.id, non-dialogue destinations are only unsupported legacy/import residue, runtime export remains dialogue-only fail-closed, EventBindingRuntime semantics were not changed, and EventDefinition trigger/conditions authoring did not return. Remaining blocker is queue.script-editor-runtime-preview-from-memory, still unadmitted.`
- `2026-07-17`: `Admitted and implemented queue.script-editor-event-destination-selector-family-coverage-correction as a corrective blocker after manual review found the prior selector fix over-narrowed destination family choices to dialogue only. RED tests failed on missing localized person/city/building/event labels and stale targetId retention after family switch. GREEN implementation restored localized person/city/building/event/dialogue/minigame family choices, family-specific project target selectors, person destination schema support, and stale target clearing while preserving dialogue-only runtime export support. Verification passed: focused destination tests, npm run typecheck, npm run lint:blueprints, and npm test (612/612). Runtime preview-from-memory remains unadmitted.`
- `2026-07-17`: `Closed queue.script-editor-event-destination-selector-family-coverage-correction after guard review and Blueprint handoff without entering version closeout, committing, pushing, merging, or admitting runtime preview. Guard review confirmed localized destination family labels for person/city/building/event/dialogue/minigame, no raw English family as the main display, targetId remains select-only, target options come from project.people/cities/buildings/events/dialogues/minigames with name/title plus id labels and saved record ids, family switching clears stale targetId, workspace validation maps person to people, runtime export remains dialogue-only fail closed, EventBindingRuntime semantics were not changed, and EventDefinition trigger/conditions authoring did not return. Remaining blocker is queue.script-editor-runtime-preview-from-memory, still unadmitted.`
- `2026-07-17`: `Admitted queue.script-editor-runtime-preview-from-memory after promotion/admission review. Evidence review confirmed preview-runtime still dispatches to previewSavedScriptEditorProjectRuntime(), the method still requires scriptEditorProjectDirectoryHandle, reads files with readFilesFromDirectoryHandle/loadScriptEditorProjectFromFiles, then uses exportScriptEditorProjectToScenarioPackFiles, loadScenarioPackFromFiles, and onStartScenarioPack. The preview method does not call markScriptEditorProjectCompleteForExport. No existing preview session state or exit-preview button was found. Implementation must preserve official export/load/startup seams, block on export/load diagnostics without leaving the editor, record return context before preview, and restore Script Editor workspace/selection/tab/context on exit. No implementation code was changed.`
- `2026-07-17`: `Paused queue.script-editor-runtime-preview-from-memory before implementation after design correction clarified event destination should mean executable content entry rather than related object or navigation target. Admitted queue.script-editor-event-destination-content-entry-family-correction as the active corrective blocker. Evidence review found the current schema/UI/tests still expose person/city/building/event/dialogue/minigame destination families and target selectors, while runtime export still only supports dialogue. The corrective queue must narrow destination authoring to dialogue/event/minigame, keep targetId select-only with project.dialogues/events/minigames sources, clear stale targetId on family change, preserve person/city/building as related-object authoring only, and keep event/minigame fail-closed until separate runtime/export support exists.`
- `2026-07-17`: `Completed queue.script-editor-event-destination-content-entry-family-correction implementation and paused before queue closeout. RED tests failed on destination family options still exposing person/city/building and the destination helper still accepting city. GREEN implementation narrowed ScriptEditorEventDestinationFamily and UI destination options to dialogue/event/minigame, kept targetId select-only with project.dialogues/events/minigames sources, preserved event related-object authoring for person/city/building, and kept runtime export dialogue-only with event/minigame fail-closed. Verification passed: focused destination tests, npm run typecheck, npm run lint:blueprints, and npm test (612/612). Runtime preview remains paused.`
- `2026-07-17`: `Restored queue.script-editor-runtime-preview-from-memory after resume/admission reconcile. Preconditions confirmed: queue.script-editor-event-destination-content-entry-family-correction is done, the previous blocker is resolved, active queue/task were none, and the runtime preview implementation scope remains valid. Implementation is now the active task; no version closeout, commit, push, merge, or additional queue admission was attempted.`
- `2026-07-17`: `Completed queue.script-editor-runtime-preview-from-memory implementation and paused before queue closeout. RED tests failed on preview-runtime still requiring saved-directory semantics, reading project files through directory handles, lacking preview session/exit-preview UI, and missing return-context restoration. GREEN implementation now exports directly from this.scriptEditorProject, loads through loadScenarioPackFromFiles(createTextImportFilesFromRecord(serializedPackFiles)), starts through onStartScenarioPack, blocks export/load failures in the Script Editor with a warning notice, records Script Editor screen/selection/tab/scroll context, renders a preview-only "退出预览" control, and restores the prior workspace context on exit. Verification passed: focused runtime preview tests, npm run typecheck, npm run lint:blueprints, and npm test (613/613). Queue closeout and browser guard remain pending; no version closeout, commit, push, merge, or additional queue admission was attempted.`
- `2026-07-17`: `Closed queue.script-editor-runtime-preview-from-memory after guard review and Blueprint handoff without entering version closeout, committing, pushing, merging, or admitting another queue. Guard review confirmed preview-runtime uses current this.scriptEditorProject data through the official export/load/startup path, does not require scriptEditorProjectDirectoryHandle, does not read project files from disk, does not call markScriptEditorProjectCompleteForExport, blocks export/load failure in the editor with warning notice, shows the preview-only "退出预览" control, and restores the prior Script Editor workspace/selection/tab/context on exit. The same guard included the save/export confusion fix: "保存项目" remains the project-save action using serializeScriptEditorProjectToFiles and project.json, runtime export remains exportScriptEditorProjectToScenarioPackFiles and pack.json, and JSON startup now reports a friendly Script Editor project-package error when project.json kind=script-editor-project is imported without pack.json. Verification passed: npm run lint:blueprints.`
