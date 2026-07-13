# Script Editor Implementation Version Plan

## Control Block

- document_role: `version-governor`
- version_id: `target.script-editor-implementation`
- version_status: `open`
- active_phase: `phase.implementation`
- active_queue: `none`
- decision_state: `promotion-review`
- next_decision: `queue-admission-review`
- next_action: `write-admission-review`
- resume_gate: `promotion-review`
- promotion_review_result: `none`
- review_subject_id: `item.editor-project-load-save-foundation`
- review_subject_classification: `queue-candidate`
- proposed_queue_id: `queue.editor-project-load-save-foundation`
- review_basis: `The frozen script-editor baseline is already closed historical evidence, and editor-project load/save foundation is the smallest lawful first implementation cut because it turns the frozen authoring contract into executable project truth without yet widening into export pipeline, compatibility import, shared-rule integration, or broader creator-facing UI workflow. This queue is upstream to later export, import, validation, and UI integration work because those later queues all depend on one stable editor-project persistence and load path. Admitting this queue first keeps the successor version inside implementation-on-frozen-baseline scope while avoiding premature reopening of mapping, compatibility, or runtime-delta boundary questions.`
- admission_status: `pending`
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
  - `queue.editor-project-load-save-foundation`
  - `queue.authoring-runtime-export-pipeline`
  - `queue.compatibility-import-adapter`
  - `queue.shared-condition-effect-authoring-integration`
  - `queue.script-editor-ui-shell-and-core-workflow`

## Human Context

### Admission Review Record

- Scope approval:
  - `This version is opened for implementation on top of the frozen script-editor contract baseline, but no queue is admitted yet.`
- Admission basis:
  - `target.script-editor-contract-freeze is already closed historical evidence and now acts as the mandatory frozen baseline for this successor implementation version. The first admission review now focuses on queue.editor-project-load-save-foundation because editor-project persistence is the smallest lawful upstream implementation cut on current evidence.`
- Current review subject:
  - `item.editor-project-load-save-foundation -> queue.editor-project-load-save-foundation`
- Current handoff:
  - `No active queue exists for this version.`
  - `The current lawful step is to finish the pending admission review for queue.editor-project-load-save-foundation without creating a queue doc or starting implementation.`
- `The current live candidate set contains the first bounded implementation queues on written source truth.`

### Queue Promotion Ledger

| Queue ID | Current Disposition | Promote When | Notes |
| --- | --- | --- | --- |
| `queue.editor-project-load-save-foundation` | `selected-for-admission-review` | `when the pending version-level review concludes that editor project persistence should become the first admitted implementation queue` | `Owns project manifest or authoring-table load/save foundation on top of the frozen authoring contract. It is currently the selected first queue candidate because export, compatibility import, shared-rule integration, and UI workflow all depend on one stable editor-project persistence path.` |
| `queue.authoring-runtime-export-pipeline` | `candidate-recorded` | `when version-level review selects export pipeline and validator assembly as the smallest lawful next cut` | `Owns authoring -> runtime export flow on top of the frozen mapping contract.` |
| `queue.compatibility-import-adapter` | `candidate-recorded` | `when version-level review selects existing-pack compatibility import as the smallest lawful next cut` | `Owns compatibility import path according to the frozen import/export policy.` |
| `queue.shared-condition-effect-authoring-integration` | `candidate-recorded` | `when version-level review selects shared rule authoring/validation integration as the smallest lawful next cut` | `Owns shared condition/effect authoring path on top of the frozen shared-rule contract.` |
| `queue.script-editor-ui-shell-and-core-workflow` | `candidate-recorded` | `when version-level review selects creator-facing editor shell and core workflow as the smallest lawful next cut` | `Owns bounded UI workflow on top of the frozen baseline without reopening contract truth.` |

### Candidate Classification Record

| Item ID | Classification | Proposed Queue | Disposition | Basis |
| --- | --- | --- | --- | --- |
| `item.script-editor-implementation-version-open` | `current-target-item` | `none` | `version opened with no active queue` | `The predecessor freeze version is closed, and this successor version now governs implementation on the frozen baseline.` |
| `item.editor-project-load-save-foundation` | `queue-candidate` | `queue.editor-project-load-save-foundation` | `candidate-recorded` | `A bounded project load/save and validation foundation is a lawful first implementation cut on top of the frozen authoring contract.` |
| `item.authoring-runtime-export-pipeline` | `queue-candidate` | `queue.authoring-runtime-export-pipeline` | `candidate-recorded` | `A bounded export pipeline and validator path is required to make the frozen mapping contract executable.` |
| `item.compatibility-import-adapter` | `queue-candidate` | `queue.compatibility-import-adapter` | `candidate-recorded` | `Existing-pack import compatibility must be implemented according to the frozen compatibility/import-export policy.` |
| `item.shared-condition-effect-authoring-integration` | `queue-candidate` | `queue.shared-condition-effect-authoring-integration` | `candidate-recorded` | `Shared condition/effect authoring must be implemented on the frozen shared-rule baseline rather than through host-local rule dialects.` |
| `item.script-editor-ui-shell-and-core-workflow` | `queue-candidate` | `queue.script-editor-ui-shell-and-core-workflow` | `candidate-recorded` | `A bounded creator-facing editor shell is required to prove the frozen baseline through an end-to-end workflow.` |

### Version Boundary Record

- `This version implements on top of the frozen baseline; it does not reopen upstream contract truth by default.`
- `If fresh evidence disproves the frozen baseline, stop and route that as explicit governance instead of silently changing the implementation boundary.`
- `This version must not absorb unrelated runtime modernization, shell cleanup, or repository-wide cleanup by convenience.`

### Queue Admission Startup Rules

1. `Read project-progress -> blueprint -> version plan -> active queue before touching a fresh queue item.`
2. `If an active queue exists, test whether the new item can be absorbed before considering a new queue.`
3. `If the item becomes queue-candidate, write version-plan review truth before any queue activation or implementation begins.`
4. `Do not treat successor-version opening or scope approval as queue admission.`
5. `Do not create a queue doc for this version until one bounded implementation queue is formally admitted.`

### Candidate Recovery Rule

- `Use this version plan's queue promotion ledger as the default recovery source for future script-editor implementation queue candidates.`
- `Do not restart a full re-audit unless new material evidence invalidates the recorded implementation boundary or admission basis.`

### Candidate Recovery Rule Addendum

- `All five first-wave implementation queues are live candidate truth in this version plan, and queue.editor-project-load-save-foundation is currently the active admission-review subject.`
- `No queue doc exists and implementation is not yet authorized because active_queue remains none.`
- `Resume from this version plan's recorded candidate ledger unless new material evidence invalidates the bounded implementation split or proves a different smaller lawful first cut.`
- `Any evidence that the frozen baseline is insufficient must route to explicit governance rather than silent implementation drift.`

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
- 当前执行队列：`具体 queue ID`
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

### Prior Promotion Record

- `2026-07-13: target.script-editor-implementation is opened as the successor implementation version after target.script-editor-contract-freeze closed with explicit frozen outputs.`
- `2026-07-13: the successor version starts with candidate-recorded implementation queues only; no queue is admitted and no execution begins at version opening time.`
- `2026-07-13: queue.editor-project-load-save-foundation was selected as the first pending admission-review subject because editor-project persistence is the smallest lawful upstream implementation cut on current evidence, but the queue remains unadmitted and no queue doc was created.`
