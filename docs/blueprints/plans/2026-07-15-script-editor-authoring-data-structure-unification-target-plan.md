# Script Editor Authoring Data Structure Unification Version Plan

## Control Block

- document_role: `version-governor`
- version_id: `target.script-editor-authoring-data-structure-unification`
- version_status: `open`
- active_phase: `phase.active-execution`
- active_queue: `none`
- decision_state: `promotion-review`
- next_decision: `same-version-admission-or-version-closeout`
- next_action: `return-to-promotion-review`
- resume_gate: `open-promotion-review`
- promotion_review_result: `none`
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
- closure_review_subject: `queue.script-editor-runtime-property-mutation-and-status-convergence`
- closure_review_status: `routed`
- residue_candidate_id: `item.script-editor-event-effect-activation-convergence`
- residue_candidate_family: `cross-family`
- routing_basis: `queue.script-editor-runtime-property-mutation-and-status-convergence closed its bounded generic character property mutation/status and temple donation slice with verification. The remaining event/effect mutation path requires broader runtime settlement and effect activation ownership, so it is routed to the existing queue.script-editor-event-effect-activation-convergence candidate instead of widening the closed queue.`
- next_lawful_queue_recommendation: `queue.script-editor-event-effect-activation-convergence`
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
| `item.script-editor-city-building-entry-and-npc-authoring-priority` | `queue-candidate` | `queue.script-editor-city-building-entry-and-npc-authoring-priority` | `candidate-recorded` | `when field/condition basics are sufficient for building/city entry and NPC assignment authoring` | `Covers priority authoring additions recorded in the source draft.` |
| `item.script-editor-scenario-launch-policy-authoring` | `queue-candidate` | `queue.script-editor-scenario-launch-policy-authoring` | `candidate-recorded` | `when startup policy authoring is the smallest blocker to editor-exported packs launching without manual JSON patching` | `Owns character selection vs fixed startup, initial map/city/building/view, and entry event timing authoring.` |
| `item.script-editor-playable-minigame-binding-convergence` | `queue-candidate` | `queue.script-editor-playable-minigame-binding-convergence` | `candidate-recorded` | `only after playable governance is loaded and the queue is admitted` | `Requires playable governance before shared playable runtime or house-hosted playable integration changes.` |
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
| `queue.script-editor-city-building-entry-and-npc-authoring-priority` | `candidate` | `When field/condition basics can support the priority city/building authoring additions.` | `Covers building dialogue binding, entry conditions, refusal text, city building selection, and NPC assignment.` |
| `queue.script-editor-city-building-structure-convergence` | `candidate` | `After priority authoring gaps are mapped or if runtime city/building structure is the smaller blocker.` | `Unifies city/building authoring and runtime structures.` |
| `queue.script-editor-city-building-placement-resolver-convergence` | `candidate` | `Before runtime views manually stitch city, building, placement, NPC, dialogue, and condition data.` | `Owns city-local placements and centralized resolver seams.` |
| `queue.script-editor-dialogue-story-structure-convergence` | `candidate` | `When narrative records can move from authoring/export lowering into runtime-consumable structures.` | `Owns dialogue/story record shape and references.` |
| `queue.script-editor-dialogue-story-runtime-handoff-convergence` | `candidate` | `After structure convergence exposes runtime handoff residue.` | `Owns dialogue/story progression runtime handoff.` |
| `queue.script-editor-condition-authoring-contract-freeze` | `candidate` | `Before event/story/city/building queues depend on typed condition authoring at runtime scale.` | `Owns condition definitions, dropdown selection, typed values, and validation.` |
| `queue.script-editor-condition-runtime-evaluation-convergence` | `candidate` | `After the authoring contract exists and runtime evaluation remains the blocker.` | `Owns condition context, subjects, reference resolution, target-set evaluation, and diagnostics.` |
| `queue.script-editor-event-structure-convergence` | `candidate` | `When condition and field contracts are stable enough to migrate event records.` | `Owns event triggers, related references, conditions, effects, and activation shape.` |
| `queue.script-editor-event-effect-activation-convergence` | `candidate` | `When event records can export but effects are not yet runtime-owned.` | `Owns typed effects, ordered chains, targets, receipts, and mutation ownership.` |
| `queue.script-editor-scenario-launch-policy-authoring` | `candidate` | `When launch policy authoring is the smallest blocker to runtime startup without manual JSON patching.` | `Owns shell selection vs fixed startup and initial map/city/building/view selection.` |
| `queue.script-editor-playable-minigame-binding-convergence` | `candidate` | `Only after playable governance confirms the bounded playable integration surface.` | `Requires playable governance before any shared playable runtime or house-hosted playable behavior changes.` |
| `queue.script-editor-branching-event-task-chain-convergence` | `candidate` | `After basic dialogue/event/task structures exist and richer branching/task-chain residue is bounded.` | `Owns branching dialogue, event effect chains, long-running tasks, and save/restore progression.` |
| `queue.script-editor-status-overlay-generalization-review` | `candidate-review` | `When non-character runtime mutation needs explicit save/status ownership.` | `Review queue; do not create non-character overlays for convenience.` |
| `queue.script-editor-legacy-structure-supersession-review` | `candidate` | `Before deleting or invalidating previously frozen structures.` | `Records retained, migrated, adapter-supported, or retired structure dispositions.` |
| `queue.script-editor-end-to-end-authoring-runtime-flow-validation` | `candidate-final` | `After required data/runtime/persistence queues provide enough coverage to prove version acceptance.` | `Final closeout validation queue.` |

### Current Queue Activation

- `none`
- Active task:
  - `none`

### Version Boundary Record

- `This version governs authoring/data-structure convergence after runtime-pack-unification closeout.`
- `It must consume the closed runtime-pack export/import/startup truth as baseline evidence rather than reopening it as a compatibility patch surface.`
- `It may supersede previously frozen script-editor structures only through explicit schema/migration/supersession records.`
- `It has returned to promotion review after queue.script-editor-runtime-property-mutation-and-status-convergence closed with cross-family event/effect residue routed to queue.script-editor-event-effect-activation-convergence.`

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
