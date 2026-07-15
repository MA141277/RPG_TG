# Script Editor Authoring Data Structure Unification Version Plan

## Control Block

- document_role: `version-governor`
- version_id: `target.script-editor-authoring-data-structure-unification`
- version_status: `open`
- active_phase: `phase.active-execution`
- active_queue: `queue.script-editor-scene-runtime-task-input-propagation`
- decision_state: `active-execution`
- next_decision: `queue-closeout-or-return-to-version-review`
- next_action: `resume-active-queue`
- resume_gate: `open-active-queue`
- promotion_review_result: `admitted`
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
- closure_review_subject: `queue.script-editor-task-chain-runtime-handoff-convergence`
- closure_review_status: `routed`
- residue_candidate_id: `item.script-editor-scene-runtime-task-input-propagation`
- residue_candidate_family: `same-family`
- routing_basis: `queue.script-editor-task-chain-runtime-handoff-convergence closed after verified editor event taskInputs lowering into EventDefinition.taskInputs and EventRuntimeCandidate.taskInputs; scene runtime taskInputs propagation remains same-family residue because runSceneFromEvent/runStoryTriggerRuntime still return an empty SceneRuntimeResult.taskInputs array.`
- next_lawful_queue_recommendation: `queue.script-editor-scene-runtime-task-input-propagation`
- auto_admission_ready: `false`
- blocked_by: []
- candidate_queue_ids:
  - `queue.script-editor-project-cache-save-export-preview`
  - `queue.script-editor-project-cache-save-export-preview-continuation`
  - `queue.script-editor-durable-package-workflow-continuation`
  - `queue.script-editor-project-completion-state-gating`
  - `queue.script-editor-unified-field-mapping-table-freeze`
  - `queue.script-editor-character-definition-status-convergence`
  - `queue.script-editor-character-status-save-runtime-continuation`
  - `queue.script-editor-character-authoring-surface-completion`
  - `queue.script-editor-runtime-property-mutation-and-status-convergence`
  - `queue.script-editor-schema-reference-and-migration-freeze`
  - `queue.script-editor-city-building-entry-and-npc-authoring-priority`
  - `queue.script-editor-city-building-structure-convergence`
  - `queue.script-editor-city-building-placement-resolver-convergence`
  - `queue.script-editor-dialogue-story-structure-convergence`
  - `queue.script-editor-dialogue-story-runtime-handoff-convergence`
  - `queue.script-editor-condition-authoring-contract-freeze`
  - `queue.script-editor-condition-runtime-evaluation-convergence`
  - `queue.script-editor-event-structure-convergence`
  - `queue.script-editor-event-effect-activation-convergence`
  - `queue.script-editor-scenario-launch-policy-authoring`
  - `queue.script-editor-playable-minigame-binding-convergence`
  - `queue.script-editor-branching-event-task-chain-convergence`
  - `queue.script-editor-dialogue-node-target-branching-convergence`
  - `queue.script-editor-event-task-chain-runtime-convergence`
  - `queue.script-editor-task-chain-runtime-handoff-convergence`
  - `queue.script-editor-scene-runtime-task-input-propagation`
  - `queue.script-editor-status-overlay-generalization-review`
  - `queue.script-editor-legacy-structure-supersession-review`
  - `queue.script-editor-end-to-end-authoring-runtime-flow-validation`

## Human Context

### Activation Record

- Scope approval:
  - `The operator requested that current-version closeout documents be checked and the next version activated if those documents are already updated.`
- Activation basis:
  - `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md records version_status=done, active_queue=none, and all recorded same-version queues as closed historical evidence.`
  - `docs/blueprints/project-progress.md and docs/blueprints/blueprint.md already record that fresh work after runtime-pack-unification closeout must classify intake for a new successor version before queue admission.`
  - `docs/blueprints/specs/2026-07-14-script-editor-authoring-data-structure-unification-draft.md already exists with proposed_version_id target.script-editor-authoring-data-structure-unification, parent_context target.script-editor-runtime-pack-unification, and the draft next step to formalize a target spec and version plan after closeout.`
- Activation conclusion:
  - `target.script-editor-authoring-data-structure-unification is now the open successor version.`
  - `queue.script-editor-project-cache-save-export-preview closed its bounded first slice after landing package location/stale validity metadata and export-before-runtime-output draft persistence.`
  - `queue.script-editor-project-cache-save-export-preview-continuation closed after landing durable save-location recording and stale continue gating.`
  - `queue.script-editor-durable-package-workflow-continuation is now admitted as the active same-family continuation for create-at-save-path package skeleton creation, imported package edit-in-place, and runtime preview-from-disk semantics.`
  - `Execution resumes from task.script-editor-durable-package-workflow-continuation.boundary-baseline-reconcile inside the admitted queue document.`

### Candidate Recovery Ledger

| Candidate ID | Last Classification | Proposed Queue | Latest Disposition | Recheck Trigger | Notes |
| --- | --- | --- | --- | --- | --- |
| `item.script-editor-project-cache-save-export-preview` | `queue-candidate` | `queue.script-editor-project-cache-save-export-preview` | `admitted + queue closed` | `only if fresh evidence proves another prerequisite blocks package persistence boundaries` | `Admitted first because project cache/save/export/preview creates the editable package truth needed by later authoring/data convergence queues; now closed with same-family residue routed to the continuation candidate.` |
| `item.script-editor-project-cache-save-export-preview-residue-continuation` | `queue-candidate` | `queue.script-editor-project-cache-save-export-preview-continuation` | `admitted + queue closed` | `only if fresh evidence proves the residue can be merged into a smaller already-recorded queue without losing persistence semantics` | `Admitted from closed queue residue; this continuation closed after durable save-location recording and stale continue gating landed, with remaining same-family residue routed onward.` |
| `item.script-editor-durable-package-workflow-residue-continuation` | `queue-candidate` | `queue.script-editor-durable-package-workflow-continuation` | `admitted + queue closed` | `only if fresh evidence proves package workflow closeout missed same-family persistence residue` | `Closed after create-at-save-path package skeleton creation, writable-directory draft opening/edit-in-place, and runtime preview-from-disk landed with verification and no remaining same-family residue.` |
| `item.script-editor-project-completion-state-gating` | `queue-candidate` | `queue.script-editor-project-completion-state-gating` | `admitted + queue closed` | `only if fresh evidence proves completion-state gating missed same-family project completion truth` | `Closed after durable project completion-state truth, save/load preservation, runtime-import draft state, and export-only completion upgrade landed with verification and no same-family residue.` |
| `item.script-editor-unified-field-mapping-table-freeze` | `queue-candidate` | `queue.script-editor-unified-field-mapping-table-freeze` | `admitted + queue closed` | `only if fresh evidence proves the first object-family queue must own the bounded mapping slice instead` | `Closed after the bounded field-definition contract and representative validation slice landed; field mapping UI consumption is routed as cross-family residue to later object-family queues.` |
| `item.script-editor-character-definition-status-convergence` | `queue-candidate` | `queue.script-editor-character-definition-status-convergence` | `admitted + queue closed` | `only if fresh evidence proves the bounded definition/materializer slice regressed` | `Closed after CharacterStatus materialization, editor person runtime CharacterDefinition import/export, covered mutation patch outputs, and fresh verification landed.` |
| `item.script-editor-character-status-save-runtime-continuation` | `queue-candidate` | `queue.script-editor-character-status-save-runtime-continuation` | `admitted + queue closed` | `only if fresh evidence proves the bounded save/runtime continuation regressed` | `Closed after AppState-owned CharacterStatus aggregation, save-envelope modState persistence, startup restore materialization, covered city-begging settlement, and fresh verification landed.` |
| `item.script-editor-character-authoring-surface-completion` | `queue-candidate` | `queue.script-editor-character-authoring-surface-completion` | `admitted + queue closed` | `only if fresh evidence proves the bounded creator-facing character controls regressed` | `Closed after mapping-driven base/profile/stat/skill controls, reference selectors, custom key editing, verification, and repository sync landed without blocking same-family residue.` |
| `item.script-editor-runtime-property-mutation-and-status-convergence` | `queue-candidate` | `queue.script-editor-runtime-property-mutation-and-status-convergence` | `admitted + queue closed with cross-family residue` | `only if fresh evidence proves the generic character property mutation/status slice regressed` | `Closed after customPropertyPatch materialization/merge, generic numeric property mutation, house transition status transport, temple donation migration, and verification landed. Event/effect mutation ownership was routed as cross-family residue to queue.script-editor-event-effect-activation-convergence.` |
| `item.script-editor-event-effect-activation-convergence` | `queue-candidate` | `queue.script-editor-event-effect-activation-convergence` | `admitted + queue closed with cross-family residue` | `only if fresh evidence proves the bounded task/shared-rule effect activation slice regressed` | `Closed after shared-rule export and task runtime settlement could apply explicit character numeric property mutation through CharacterStatus patches. Broader event/scene effect convergence was routed as cross-family residue to version promotion review.` |
| `item.script-editor-event-structure-convergence` | `queue-candidate` | `queue.script-editor-event-structure-convergence` | `admitted + queue closed with cross-family prerequisite residue` | `only if fresh evidence proves the baseline prerequisite decision was wrong` | `Closed at baseline after proving runtime event structures and minimal dialogue-destination export already exist, but typed condition authoring must be frozen before expanding event condition lowering or non-dialogue destinations.` |
| `item.script-editor-condition-authoring-contract-freeze` | `queue-candidate` | `queue.script-editor-condition-authoring-contract-freeze` | `admitted + queue closed with cross-family residue` | `only if fresh evidence proves typed condition authoring contract freeze regressed` | `Closed after freezing the editor-owned typed condition contract, adding condition type selection, preserving task shared-rule compatibility, and dropping legacy event free-text condition items.` |
| `item.script-editor-condition-runtime-evaluation-convergence` | `queue-candidate` | `queue.script-editor-condition-runtime-evaluation-convergence` | `admitted + queue closed with cross-family residue` | `only if fresh evidence proves the bounded event condition runtime evaluation/export slice regressed` | `Closed after supported event condition groups export into runtime EventConditionNode arrays and trigger selection evaluates the exported conditions; broader city/building/story/scenario condition consumption was routed as cross-family residue.` |
| `item.script-editor-city-building-entry-and-npc-authoring-priority` | `queue-candidate` | `queue.script-editor-city-building-entry-and-npc-authoring-priority` | `admitted + queue closed` | `only if fresh evidence proves the bounded priority materialization export regressed` | `Closed after runtime export materialized priority city/building entry, NPC pool, house binding, and access refusal runtime families from existing authoring fields while preserving explicit imported records.` |
| `item.script-editor-city-building-structure-convergence` | `queue-candidate` | `queue.script-editor-city-building-structure-convergence` | `admitted + queue closed with cross-family residue` | `only if fresh evidence proves the runtime-house-compatible building contract regressed` | `Closed after ScriptEditorBuildingRecord explicitly owned covered HouseDefinition fields and runtime import normalized houses into the editor building contract. Placement/resolver residue was routed to version review.` |
| `item.script-editor-city-building-placement-resolver-convergence` | `queue-candidate` | `queue.script-editor-city-building-placement-resolver-convergence` | `admitted + queue closed with cross-family residue` | `only if fresh evidence proves the bounded resolver API regressed` | `Closed after landing the shared city-building placement resolver API over existing runtime families; persistent placement schema migration, override layering, dialogue inheritance, and broader consumer migration were routed back to version review.` |
| `item.script-editor-dialogue-story-structure-convergence` | `queue-candidate` | `queue.script-editor-dialogue-story-structure-convergence` | `admitted + queue closed with cross-family residue` | `only if fresh evidence proves the bounded materializer seam regressed` | `Closed after landing the shared materializer seam for minimal dialogue/story runtime scene/text-entry assembly; runtime handoff/progression, branching/followUps, story-node relation lowering, and import reconstruction residue were routed back to version review.` |
| `item.script-editor-dialogue-story-runtime-handoff-convergence` | `queue-candidate` | `queue.script-editor-dialogue-story-runtime-handoff-convergence` | `admitted + queue closed with cross-family residue` | `only if fresh evidence proves the event-to-dialogue-scene handoff receipt regressed` | `Closed after verified editor event -> dialogue destination -> materialized scene -> runStoryTriggerRuntime coverage and SceneRuntimeSession eventId receipts; richer progression/branching residue was routed back to version review.` |
| `item.script-editor-scenario-launch-policy-authoring` | `queue-candidate` | `queue.script-editor-scenario-launch-policy-authoring` | `candidate-recorded` | `when startup policy authoring is the smallest blocker to editor-exported packs launching without manual JSON patching` | `Owns character selection vs fixed startup, initial map/city/building/view, and entry event timing authoring.` |
| `item.script-editor-playable-minigame-binding-convergence` | `queue-candidate` | `queue.script-editor-playable-minigame-binding-convergence` | `candidate-recorded` | `only after playable governance is loaded and the queue is admitted` | `Requires playable governance before shared playable runtime or house-hosted playable integration changes.` |
| `item.script-editor-branching-event-task-chain-convergence` | `queue-candidate` | `queue.script-editor-branching-event-task-chain-convergence` | `admitted + queue closed with same-family residue` | `only if fresh evidence proves the fail-closed node progression guard regressed` | `Closed after non-empty nextNodeId and choiceTargetNodeId began failing closed instead of silently linearizing; real node-target branching was routed as same-family residue to queue.script-editor-dialogue-node-target-branching-convergence.` |
| `item.script-editor-dialogue-node-target-branching-convergence` | `queue-candidate` | `queue.script-editor-dialogue-node-target-branching-convergence` | `admitted + queue closed with cross-family residue` | `only if fresh evidence proves node-target scene splitting regressed` | `Closed after scene splitting, jump-based nextNodeId progression, implicit array-order continuation, bounded single-target choiceTargetNodeId lowering, and missing-target diagnostics landed. Broader event/task-chain progression was routed as cross-family residue to queue.script-editor-event-task-chain-runtime-convergence review.` |
| `item.script-editor-event-task-chain-runtime-convergence` | `queue-candidate` | `queue.script-editor-event-task-chain-runtime-convergence` | `admitted + queue closed with same-family residue` | `only if fresh evidence proves event-to-event runtime chain lowering regressed` | `Closed after explicit editor nextEventId lowered into runtime EventDefinition.nextEventId and scene completion followed chained runtime events. Task-chain runtime handoff was routed as same-family residue to queue.script-editor-task-chain-runtime-handoff-convergence.` |
| `item.script-editor-task-chain-runtime-handoff-convergence` | `queue-candidate` | `queue.script-editor-task-chain-runtime-handoff-convergence` | `admitted + queue closed with same-family residue` | `only if fresh evidence proves event-level taskInputs lowering regressed` | `Closed after editor event taskInputs lowered into runtime EventDefinition.taskInputs, missing task action targets fail closed, runtime import preserves taskInputs, and EventRuntimeCandidate exposes them. Scene runtime taskInputs propagation was routed as same-family residue to queue.script-editor-scene-runtime-task-input-propagation.` |
| `item.script-editor-scene-runtime-task-input-propagation` | `queue-candidate` | `queue.script-editor-scene-runtime-task-input-propagation` | `admitted + active` | `only if fresh evidence proves a narrower prerequisite must precede scene runtime taskInputs propagation` | `Admitted as the unique same-family continuation after event-level taskInputs handoff proved SceneRuntimeResult.taskInputs still returns empty arrays from runSceneFromEvent/runStoryTriggerRuntime.` |
| `item.script-editor-end-to-end-authoring-runtime-flow-validation` | `queue-candidate` | `queue.script-editor-end-to-end-authoring-runtime-flow-validation` | `candidate-recorded-final` | `after required data, runtime handoff, and persistence queues provide enough coverage to prove closeout` | `Final validation queue, not a first implementation slice.` |

### Queue Promotion Ledger

| Queue ID | Current Disposition | Promote When | Notes |
| --- | --- | --- | --- |
| `queue.script-editor-project-cache-save-export-preview` | `done` | `Already completed; do not reopen except by explicit governance record.` | `First admitted queue closed after package location/stale validity metadata and export-before-runtime-output draft persistence landed with verification.` |
| `queue.script-editor-project-cache-save-export-preview-continuation` | `done` | `Already completed; do not reopen except by explicit governance record.` | `Continuation queue closed after durable save-location recording and stale continue gating landed; same-family residue was routed to queue.script-editor-durable-package-workflow-continuation.` |
| `queue.script-editor-durable-package-workflow-continuation` | `done` | `Already completed; do not reopen except by explicit governance record.` | `Closed after package skeleton creation, writable-directory draft opening/edit-in-place, and runtime preview-from-disk semantics landed with verification.` |
| `queue.script-editor-project-completion-state-gating` | `done` | `Already completed; do not reopen except by explicit governance record.` | `Closed after project completion-state persistence and export-only completion upgrade landed with verification and no same-family residue.` |
| `queue.script-editor-unified-field-mapping-table-freeze` | `done` | `Already completed; do not reopen except by explicit governance record.` | `Closed after the bounded shared field-definition contract and representative validation slice landed; object-family mapping consumption is cross-family residue for later queues.` |
| `queue.script-editor-character-definition-status-convergence` | `done` | `Already completed; do not reopen except by explicit governance record.` | `Closed its bounded definition/materializer and covered mutation patch slice with same-family save/runtime residue routed onward.` |
| `queue.script-editor-character-status-save-runtime-continuation` | `done` | `Already completed; do not reopen except by explicit governance record.` | `Closed after canonical CharacterStatus save aggregation, save-envelope persistence, startup restore, and bounded runtime commit integration landed with verification.` |
| `queue.script-editor-character-authoring-surface-completion` | `done` | `Already completed; do not reopen except by explicit governance record.` | `Closed after mapping-driven base/profile/stat/skill controls, reference selectors, custom key editing, verification, and repository sync landed.` |
| `queue.script-editor-runtime-property-mutation-and-status-convergence` | `done` | `Already completed; do not reopen except by explicit governance record.` | `Closed its bounded generic character property mutation/status and temple donation slice with cross-family event/effect residue routed to queue.script-editor-event-effect-activation-convergence.` |
| `queue.script-editor-schema-reference-and-migration-freeze` | `candidate` | `Before retiring legacy structures or when multiple queues need one replacement reference.` | `Owns formal schema reference, legacy supersession, migration adapters, and schema versions.` |
| `queue.script-editor-city-building-entry-and-npc-authoring-priority` | `done` | `Already completed; do not reopen except by explicit governance record.` | `Closed after bounded runtime-family materialization export covered priority city/building entry, NPC pool, house binding, and access refusal output from existing authoring fields.` |
| `queue.script-editor-city-building-structure-convergence` | `done` | `Already completed; do not reopen except by explicit governance record.` | `Closed after runtime-house-compatible building structure contract hardening landed; placement/resolver residue returned to version review.` |
| `queue.script-editor-city-building-placement-resolver-convergence` | `done` | `Already completed; do not reopen except by explicit governance record.` | `Closed after bounded shared resolver API verification; persistent placement schema, overrides, dialogue inheritance, and broader consumer migration remain cross-family residue.` |
| `queue.script-editor-dialogue-story-structure-convergence` | `done` | `Already completed; do not reopen except by explicit governance record.` | `Closed after bounded shared materializer seam verification; runtime handoff/progression and richer narrative behavior remain cross-family residue.` |
| `queue.script-editor-dialogue-story-runtime-handoff-convergence` | `done` | `Already completed; do not reopen except by explicit governance record.` | `Closed after the bounded event-to-dialogue-scene runtime handoff receipt slice landed; richer branching/progression residue returned to promotion review.` |
| `queue.script-editor-condition-authoring-contract-freeze` | `done` | `Already completed; do not reopen except by explicit governance record.` | `Closed after the typed authoring contract slice landed and routed runtime evaluation residue back to promotion review.` |
| `queue.script-editor-condition-runtime-evaluation-convergence` | `done` | `Already completed; do not reopen except by explicit governance record.` | `Closed after bounded event condition export/evaluation convergence landed with verification and routed broader condition consumption residue back to promotion review.` |
| `queue.script-editor-event-structure-convergence` | `done` | `Already completed; do not reopen except by explicit governance record.` | `Closed at baseline with prerequisite condition authoring contract freeze residue returned to promotion review.` |
| `queue.script-editor-event-effect-activation-convergence` | `done` | `Already completed; do not reopen except by explicit governance record.` | `Closed its bounded task/shared-rule typed character property mutation effect slice with cross-family event/scene effect residue returned to promotion review.` |
| `queue.script-editor-scenario-launch-policy-authoring` | `candidate` | `When launch policy authoring is the smallest blocker to runtime startup without manual JSON patching.` | `Owns shell selection vs fixed startup and initial map/city/building/view selection.` |
| `queue.script-editor-playable-minigame-binding-convergence` | `candidate` | `Only after playable governance confirms the bounded playable integration surface.` | `Requires playable governance before any shared playable runtime or house-hosted playable behavior changes.` |
| `queue.script-editor-branching-event-task-chain-convergence` | `done` | `Already completed; do not reopen except by explicit governance record.` | `Closed after the fail-closed node progression guard landed; real node-target branching routed to queue.script-editor-dialogue-node-target-branching-convergence.` |
| `queue.script-editor-dialogue-node-target-branching-convergence` | `done` | `Already completed; do not reopen except by explicit governance record.` | `Closed after node-target scene splitting and bounded choice target lowering landed; broader event/task-chain progression returned to version review.` |
| `queue.script-editor-event-task-chain-runtime-convergence` | `done` | `Already completed; do not reopen except by explicit governance record.` | `Closed after explicit event nextEventId export/runtime chaining landed; task-chain runtime handoff routed to queue.script-editor-task-chain-runtime-handoff-convergence.` |
| `queue.script-editor-task-chain-runtime-handoff-convergence` | `done` | `Already completed; do not reopen except by explicit governance record.` | `Closed after event-level taskInputs handoff landed; scene runtime propagation routed to queue.script-editor-scene-runtime-task-input-propagation.` |
| `queue.script-editor-scene-runtime-task-input-propagation` | `active` | `After event-level taskInputs handoff verified and SceneRuntimeResult.taskInputs remains empty.` | `Owns propagation of activated event taskInputs through scene runtime output. Active task is boundary-baseline-reconcile.` |
| `queue.script-editor-status-overlay-generalization-review` | `candidate-review` | `When non-character runtime mutation needs explicit save/status ownership.` | `Review queue; do not create non-character overlays for convenience.` |
| `queue.script-editor-legacy-structure-supersession-review` | `candidate` | `Before deleting or invalidating previously frozen structures.` | `Records retained, migrated, adapter-supported, or retired structure dispositions.` |
| `queue.script-editor-end-to-end-authoring-runtime-flow-validation` | `candidate-final` | `After required data/runtime/persistence queues provide enough coverage to prove version acceptance.` | `Final closeout validation queue.` |

### Current Queue Activation

- `queue.script-editor-scene-runtime-task-input-propagation`
- Active task:
  - `task.script-editor-scene-runtime-task-input-propagation.boundary-baseline-reconcile`
- Activation basis:
  - `queue.script-editor-task-chain-runtime-handoff-convergence closed after editor event taskInputs lowered into runtime EventDefinition.taskInputs and EventRuntimeCandidate.taskInputs.`
  - `SceneRuntimeResult.taskInputs still returns an empty array from runSceneFromEvent/runStoryTriggerRuntime.`
  - `Closeout routed scene runtime taskInputs propagation as the unique same-family continuation.`
  - `Execution resumes from the scene runtime task input propagation boundary baseline task.`

### Version Boundary Record

- `This version governs authoring/data-structure convergence after runtime-pack-unification closeout.`
- `It must consume the closed runtime-pack export/import/startup truth as baseline evidence rather than reopening it as a compatibility patch surface.`
- `It may supersede previously frozen script-editor structures only through explicit schema/migration/supersession records.`
- `It has admitted queue.script-editor-scene-runtime-task-input-propagation after task-chain runtime handoff closeout; execution resumes from the scene runtime task input propagation boundary baseline task.`

### Queue Admission Startup Rules

1. `Read project-progress -> blueprint -> version plan -> active queue before touching a fresh queue item.`
2. `If active_queue = none and admission_status = pending, complete the pending admission review before implementation.`
3. `If admission succeeds, create the admitted queue doc and expose queue_status=active plus one live active_task before code changes.`
4. `If fresh evidence disproves the pending first queue basis, update this version plan with the narrower lawful admission subject instead of silently switching queues.`
5. `Do not treat version activation as queue admission.`

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

### Version Lifecycle Rules

- `A current open version stays open until version closeout is explicitly confirmed and written into this version plan.`
- `If active_queue = none, that does not close the version; it only returns the version to promotion-review or idle-open.`
- `As long as version_status = open, additional same-version queues may still be admitted.`
- `If no open version exists, version creation becomes the required next governance action before any queue admission or implementation can begin.`
- `Queue closeout may auto-advance; version closeout must not be inferred from queue completion alone.`
- `When version acceptance and closeout conditions are satisfied, ask exactly one human confirmation before changing version_status to done.`

### Prior Promotion Record

- `2026-07-15: target.script-editor-runtime-pack-unification closed after all ten recorded candidate queues were verified as done with no active_task remaining and no lawful same-version candidate queue left to admit.`
- `2026-07-15: target.script-editor-authoring-data-structure-unification was activated as the open successor version from draft.script-editor-authoring-data-structure-unification after the operator requested successor activation if closeout docs were already updated.`
- `2026-07-15: the successor version opens with no active queue and queue.script-editor-project-cache-save-export-preview recorded as the first pending admission subject.`
- `2026-07-15: admission review then promoted queue.script-editor-project-cache-save-export-preview as the single active queue and exposed task.script-editor-project-cache-save-export-preview.boundary-baseline-reconcile as the live execution entry.`
- `2026-07-15: queue.script-editor-project-cache-save-export-preview closed after the bounded first slice landed with verification, then routed same-family residue to queue.script-editor-project-cache-save-export-preview-continuation for version-level admission review.`
- `2026-07-15: admission review then promoted queue.script-editor-project-cache-save-export-preview-continuation as the single active queue and exposed task.script-editor-project-cache-save-export-preview-continuation.boundary-baseline-reconcile as the live execution entry.`
- `2026-07-15: queue.script-editor-project-cache-save-export-preview-continuation landed durable save-location recording and stale continue gating, then advanced to queue-closeout-and-handoff for residue classification.`
- `2026-07-15: queue.script-editor-project-cache-save-export-preview-continuation closed with same-family residue after verification, and admission review promoted queue.script-editor-durable-package-workflow-continuation as the single active queue for package skeleton/imported edit-in-place/runtime preview-from-disk semantics.`
- `2026-07-15: queue.script-editor-durable-package-workflow-continuation closed after package skeleton creation, writable-directory draft opening/edit-in-place, and runtime preview-from-disk landed with verification and no same-family residue; the version returned to promotion review for the next candidate queue.`
- `2026-07-15: admission review then promoted queue.script-editor-project-completion-state-gating as the single active queue after durable package workflow closeout satisfied the persistence prerequisite.`
- `2026-07-15: queue.script-editor-project-completion-state-gating closed after durable project completion-state truth, save/load preservation, runtime-import draft state, and export-only completion upgrade landed with verification and no same-family residue; the version returned to promotion review for the next candidate queue.`
- `2026-07-15: admission review then promoted queue.script-editor-unified-field-mapping-table-freeze as the single active queue after completion-state gating closeout satisfied the persistence prerequisite for shared field metadata.`
- `2026-07-15: queue.script-editor-unified-field-mapping-table-freeze closed after the bounded shared field-definition contract and representative validation slice landed; field-mapping UI consumption was routed as cross-family residue to later object-family queues, with character definition/status convergence recommended next.`
- `2026-07-15: admission review then promoted queue.script-editor-character-definition-status-convergence as the single active queue after package persistence, completion-state gating, and field mapping freeze satisfied the prerequisites for bounded character data/status migration.`
- `2026-07-15: queue.script-editor-character-definition-status-convergence closed its verified bounded definition/materializer slice with same-family residue because status patches were not yet durable in save state; queue.script-editor-character-status-save-runtime-continuation was automatically admitted as the unique continuation.`
- `2026-07-15: queue.script-editor-character-status-save-runtime-continuation closed after CharacterStatus patches became durable through AppState-owned aggregation, save-envelope modState persistence, startup restore materialization, and covered runtime commit tests; no blocking same-family residue remained.`
- `2026-07-15: admission review then promoted queue.script-editor-character-authoring-surface-completion as the single active queue because creator-facing character controls were intentionally separated from the completed definition/status and persistence queues.`
- `2026-07-15: queue.script-editor-character-authoring-surface-completion closed after mapping-driven authoring controls, reference selectors, custom key editing, verification, and repository sync landed; the version returned to promotion review with no active queue.`
- `2026-07-15: admission review then promoted queue.script-editor-runtime-property-mutation-and-status-convergence as the single active queue because BUG-001 proves the version still lacks one durable runtime mutation path for creator-defined properties, and the first live task was boundary-baseline-reconcile.`
- `2026-07-15: queue.script-editor-runtime-property-mutation-and-status-convergence completed boundary-baseline-reconcile after proving the existing RuntimeResult/save/startup seams can carry the first custom character-property status slice; the active task is now runtime-property-contract-implementation.`
- `2026-07-15: queue.script-editor-runtime-property-mutation-and-status-convergence closed after the generic character property mutation/status and temple donation slice landed with verification; event/effect mutation ownership was routed as cross-family residue to queue.script-editor-event-effect-activation-convergence, and the version returned to promotion review with no active queue.`
- `2026-07-15: admission review then promoted queue.script-editor-event-effect-activation-convergence as the single active queue because the routed residue requires typed effect target resolution, receipts, and runtime mutation ownership before the current version can close.`
- `2026-07-15: queue.script-editor-event-effect-activation-convergence completed boundary-baseline-reconcile after selecting task/shared-rule explicit character numeric property mutation as the smallest lawful typed effect activation slice; the active task is now effect-activation-contract-implementation.`
- `2026-07-15: queue.script-editor-event-effect-activation-convergence completed effect-activation-contract-implementation after shared-rule export and task runtime settlement could apply explicit character numeric property mutation through CharacterStatus patches; the active task is now queue-closeout-and-handoff.`
- `2026-07-15: queue.script-editor-event-effect-activation-convergence closed after verification; remaining scene/choice legacy effect-applier migration and broader event effect activation were routed as cross-family residue to queue.script-editor-event-structure-convergence review, and the version returned to promotion review with no active queue.`
- `2026-07-15: admission review then promoted queue.script-editor-event-structure-convergence as the single active queue because event triggers, related references, conditions, effects, and activation shape are the required review surface for the routed event/scene effect residue; the first live task is boundary-baseline-reconcile.`
- `2026-07-15: queue.script-editor-event-structure-convergence closed at baseline without production changes after proving typed condition authoring must be frozen before event condition lowering or non-dialogue destinations expand; queue.script-editor-condition-authoring-contract-freeze is now the recommended promotion-review subject.`
- `2026-07-15: admission review promoted queue.script-editor-condition-authoring-contract-freeze as the single active queue because typed condition authoring is the prerequisite for expanding event/story/city/building condition use beyond stringly or empty-condition records; the first live task is boundary-baseline-reconcile.`
- `2026-07-15: queue.script-editor-condition-authoring-contract-freeze closed after freezing the editor-owned typed condition authoring contract, adding condition type selection, preserving task shared-rule compatibility, and rejecting legacy event free-text condition items; queue.script-editor-condition-runtime-evaluation-convergence is now the recommended promotion-review subject.`
- `2026-07-15: admission review promoted queue.script-editor-condition-runtime-evaluation-convergence as the single active queue because runtime condition context/evaluation convergence is the next prerequisite before event/story/city/building runtime-scale condition use expands; the first live task was boundary-baseline-reconcile.`
- `2026-07-15: queue.script-editor-condition-runtime-evaluation-convergence completed boundary-baseline-reconcile after selecting bounded event condition export lowering into runtime EventConditionNode arrays as the smallest lawful implementation slice; the active task is now runtime-evaluation-contract-implementation.`
- `2026-07-15: queue.script-editor-condition-runtime-evaluation-convergence closed after supported event condition groups export into runtime EventConditionNode arrays, unsupported task-only condition nodes fail closed, and trigger selection evaluates the exported conditions; broader condition consumption was routed as cross-family residue with queue.script-editor-city-building-entry-and-npc-authoring-priority recommended next.`
- `2026-07-15: admission review promoted queue.script-editor-city-building-entry-and-npc-authoring-priority as the single active queue because field mapping and typed-condition basics now satisfy the priority city/building/NPC authoring prerequisite; the first live task is boundary-baseline-reconcile.`
- `2026-07-15: queue.script-editor-city-building-entry-and-npc-authoring-priority completed boundary-baseline-reconcile after selecting bounded city/building runtime-family materialization from existing authoring fields as the smallest lawful implementation slice; the active task is now priority-authoring-implementation.`
- `2026-07-15: queue.script-editor-city-building-entry-and-npc-authoring-priority closed after runtime export materialized bounded houses, cityEntries, cityNpcPools, and houseAccessRefusalRules from existing building/person authoring fields when explicit runtime records are absent, preserved imported explicit runtime families, and passed verification. The version returned to promotion review with no active queue.`
- `2026-07-15: admission review promoted queue.script-editor-city-building-structure-convergence as the single active queue because priority city/building gaps are now mapped and the target spec requires durable city/building authoring/runtime structure convergence before projection-only export materialization can be treated as final. The first live task is boundary-baseline-reconcile.`
- `2026-07-15: queue.script-editor-city-building-structure-convergence completed boundary-baseline-reconcile after selecting runtime-house-compatible building structure contract hardening as the smallest lawful implementation slice; the active task is now structure-contract-implementation.`
- `2026-07-15: queue.script-editor-city-building-structure-convergence closed after ScriptEditorBuildingRecord explicitly owned covered HouseDefinition fields, city-building authoring defaults/normalizers produced runtime-house-compatible records, and runtime pack import normalized houses into that editor contract. City-local placement/resolver residue was routed to version review with queue.script-editor-city-building-placement-resolver-convergence as the next candidate subject.`
- `2026-07-15: admission review promoted queue.script-editor-city-building-placement-resolver-convergence as the single active queue because city-local placements, entry ownership, override layering, NPC assignment ownership, and centralized resolver seams are the next required city/building convergence surface. The first live task is boundary-baseline-reconcile.`
- `2026-07-15: queue.script-editor-city-building-placement-resolver-convergence completed boundary-baseline-reconcile after selecting a bounded shared resolver API over existing cityEntries, houses, cityNpcPools, and houseAccessRefusalRules as the smallest lawful implementation slice; the active task is now resolver-contract-implementation.`
- `2026-07-15: queue.script-editor-city-building-placement-resolver-convergence completed resolver-contract-implementation after landing the shared city-building placement resolver API with access, NPC, view, and fail-closed coverage; the active task is now queue-closeout-and-handoff.`
- `2026-07-15: queue.script-editor-city-building-placement-resolver-convergence closed after verification; persistent placement schema migration, richer override layering, dialogue inheritance, and broader runtime/preview consumer migration were routed as cross-family residue to version promotion review, with queue.script-editor-dialogue-story-structure-convergence recommended next.`
- `2026-07-15: admission review promoted queue.script-editor-dialogue-story-structure-convergence as the single active queue because dialogue/story structures are the next prerequisite for runtime-consumable narrative data and later dialogue inheritance/runtime handoff work. The first live task is boundary-baseline-reconcile.`
- `2026-07-15: queue.script-editor-dialogue-story-structure-convergence completed boundary-baseline-reconcile after selecting a shared dialogue/story runtime materializer seam over existing editor narrative records, runtime SceneDefinition actions, and textEntries as the smallest lawful structure slice; the active task is now structure-contract-implementation.`
- `2026-07-15: queue.script-editor-dialogue-story-structure-convergence completed structure-contract-implementation after landing the shared dialogue/story runtime materializer seam and rewiring runtime-pack export to consume it; the active task is now queue-closeout-and-handoff.`
- `2026-07-15: queue.script-editor-dialogue-story-structure-convergence closed after verification; full dialogue/story runtime handoff/progression, branching choices, followUps, story-node relation lowering, and runtime-scene import reconstruction were routed as cross-family residue to version promotion review, with queue.script-editor-dialogue-story-runtime-handoff-convergence recommended next.`
- `2026-07-15: admission review promoted queue.script-editor-dialogue-story-runtime-handoff-convergence as the single active queue because runtime handoff/progression is the next dialogue/story prerequisite after the materializer seam landed. The first live task is boundary-baseline-reconcile.`
- `2026-07-15: queue.script-editor-dialogue-story-runtime-handoff-convergence completed boundary-baseline-reconcile after selecting editor event -> dialogue destination -> materialized runtime scene -> runStoryTriggerRuntime/runSceneFromEvent handoff coverage as the smallest lawful slice; the active task is now runtime-handoff-implementation.`
- `2026-07-15: queue.script-editor-dialogue-story-runtime-handoff-convergence completed runtime-handoff-implementation after adding eventId to SceneRuntimeSession and verifying exported editor dialogue events enter materialized runtime scenes through runStoryTriggerRuntime; the active task is now queue-closeout-and-handoff.`
- `2026-07-15: queue.script-editor-dialogue-story-runtime-handoff-convergence closed after verification; story-progress/dialogue-finished trigger lowering, branching choices, followUps, story-node relation lowering, runtime-scene import reconstruction, and broader event/task progression were routed as cross-family residue to promotion review, with queue.script-editor-branching-event-task-chain-convergence recommended next.`
- `2026-07-15: admission review promoted queue.script-editor-branching-event-task-chain-convergence as the single active queue because richer progression/branching/event-task residue is now the next required bounded continuation after basic dialogue structures and event-to-scene runtime handoff verified. The first live task is boundary-baseline-reconcile.`
- `2026-07-15: queue.script-editor-branching-event-task-chain-convergence completed boundary-baseline-reconcile after selecting fail-closed diagnostics for unsupported dialogue node nextNodeId/choiceTargetNodeId progression references as the smallest lawful first slice; the active task is now progression-contract-implementation.`
- `2026-07-15: queue.script-editor-branching-event-task-chain-convergence completed progression-contract-implementation after materializeScriptEditorDialogueStoryRuntime began failing closed on non-empty dialogue nextNodeId and choiceTargetNodeId references instead of silently exporting unsupported node-local progression as linear runtime scenes; the active task is now queue-closeout-and-handoff.`
- `2026-07-15: queue.script-editor-branching-event-task-chain-convergence closed with same-family residue after verification; real node-target runtime branching remains required before broader event/task chains can safely lower, so queue.script-editor-dialogue-node-target-branching-convergence was admitted as the active continuation with boundary-baseline-reconcile as the first task.`
- `2026-07-15: queue.script-editor-dialogue-node-target-branching-convergence completed boundary-baseline-reconcile after selecting scene splitting as the smallest real node-target model for nextNodeId and the bounded single-target choiceTargetNodeId subset; the active task is now node-target-runtime-implementation.`
- `2026-07-15: queue.script-editor-dialogue-node-target-branching-convergence completed node-target-runtime-implementation after dialogue nodes began lowering into stable runtime scenes with jump/ChoiceOption.nextSceneId progression targets and missing target diagnostics; the active task is now queue-closeout-and-handoff.`
- `2026-07-15: queue.script-editor-dialogue-node-target-branching-convergence closed after verification with no same-family node-target residue; broader event/task-chain runtime progression was routed as cross-family residue to promotion review, with queue.script-editor-event-task-chain-runtime-convergence recommended next.`
- `2026-07-15: admission review promoted queue.script-editor-event-task-chain-runtime-convergence as the single active queue because event-to-event runtime progression is the next bounded chain blocker after node-target dialogue branching. Boundary baseline selected explicit editor nextEventId lowering into runtime EventDefinition.nextEventId; the active task became event-chain-runtime-implementation.`
- `2026-07-15: queue.script-editor-event-task-chain-runtime-convergence completed event-chain-runtime-implementation after editor-authored nextEventId began exporting to EventDefinition.nextEventId and scene completion began chaining into the next runtime event; the active task is now queue-closeout-and-handoff.`
- `2026-07-15: queue.script-editor-event-task-chain-runtime-convergence closed with same-family residue after verification; editor-authored task start/progress/complete/fail still needs to enter the unified RuntimeResult.taskInputs seam, so queue.script-editor-task-chain-runtime-handoff-convergence was admitted as the active continuation with boundary-baseline-reconcile as the first task.`
- `2026-07-15: queue.script-editor-task-chain-runtime-handoff-convergence completed boundary-baseline-reconcile after selecting event-level taskInputs lowering as the smallest lawful handoff slice: editor event taskInputs lower into runtime EventDefinition.taskInputs, EventRuntimeCandidate exposes those inputs, and existing runtime dispatch/task runtime remains the only settlement path. The active task is now task-handoff-runtime-implementation.`
- `2026-07-16: queue.script-editor-task-chain-runtime-handoff-convergence completed task-handoff-runtime-implementation after editor event taskInputs began exporting to EventDefinition.taskInputs, runtime import preserved those inputs, and EventRuntimeCandidate exposed them for RuntimeResult.taskInputs settlement. The active task is now queue-closeout-and-handoff.`
- `2026-07-16: queue.script-editor-task-chain-runtime-handoff-convergence closed with same-family residue after verification; SceneRuntimeResult.taskInputs still returns empty arrays from runSceneFromEvent/runStoryTriggerRuntime, so queue.script-editor-scene-runtime-task-input-propagation was admitted as the active continuation with boundary-baseline-reconcile as the first task.`
