# Script Editor Contract Freeze Version Plan

## Control Block

- document_role: `version-governor`
- version_id: `target.script-editor-contract-freeze`
- version_status: `open`
- active_phase: `phase.contract-freeze`
- active_queue: `none`
- decision_state: `promotion-review`
- next_decision: `queue-admission-review`
- next_action: `write-admission-review`
- resume_gate: `promotion-review`
- promotion_review_result: `none`
- review_subject_id: `item.editor-native-authoring-contract-freeze`
- review_subject_classification: `queue-candidate`
- proposed_queue_id: `queue.editor-native-authoring-contract-freeze`
- review_basis: `The current version already records five bounded contract-freeze candidates, and editor-native authoring contract freeze is the smallest lawful first cut because the object model, responsibility boundary, naming rules, and editor-only metadata boundary are upstream to mapping, import/export compatibility policy, and any minimum runtime delta audit. Selecting this queue for admission review narrows the next step without widening into implementation.`
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
  - `queue.editor-native-authoring-contract-freeze`
  - `queue.authoring-runtime-mapping-contract-freeze`
  - `queue.compatibility-import-export-policy-freeze`
  - `queue.shared-condition-effect-mechanism-freeze`
  - `queue.minimal-runtime-contract-change-audit`

## Human Context

### Admission Review Record

- Scope approval:
  - `This intake records bounded candidate queues only. No queue is admitted and no implementation work is authorized by this document change.`
- Admission basis:
  - `The current script-editor freeze requirement is broad, but its lawful Blueprint handling is to decompose it into bounded contract-freeze queue-candidates before any one queue is admitted. The first admission review now focuses on editor-native authoring contract freeze because that object-model boundary is upstream to the remaining mapping, compatibility, shared-rule, and minimum-runtime-delta candidates.`
- Current review subject:
  - `item.editor-native-authoring-contract-freeze -> queue.editor-native-authoring-contract-freeze`
- Current handoff:
  - `No active queue exists for this version.`
  - `The current lawful step is to finish the pending admission review for queue.editor-native-authoring-contract-freeze without creating a queue doc or starting implementation.`
- `The current live candidate set contains five bounded contract-freeze queues on written source truth.`

### Queue Promotion Ledger

| Queue ID | Current Disposition | Promote When | Notes |
| --- | --- | --- | --- |
| `queue.editor-native-authoring-contract-freeze` | `selected-for-admission-review` | `when the pending version-level review concludes that object-model freeze should become the first admitted queue` | `Covers the frozen core object set, per-object responsibility boundary, naming rule, editor-only metadata boundary, and the rule that authoring objects must not be backsolved directly from the current runtime table shape. It is currently the selected first queue candidate because the object model is upstream to the remaining mapping, compatibility, shared-rule, and runtime-delta review candidates.` |
| `queue.authoring-runtime-mapping-contract-freeze` | `candidate-recorded` | `when version-level review selects authoring-to-runtime export and compile mapping as the smallest lawful next cut` | `Covers runtime export destinations, direct-export fields, editor-project-only fields, compatibility shim dependencies, and the object-level mapping matrix.` |
| `queue.compatibility-import-export-policy-freeze` | `candidate-recorded` | `when version-level review selects existing-pack import, editor-project persistence, and runtime-export policy as the smallest lawful next cut` | `Covers import existing pack -> edit -> export compatibility expectations, legacy scenario-pack handling, editor project persistence shape, runtime-facing export artifact policy, and the non-leak rule for authoring-only metadata.` |
| `queue.shared-condition-effect-mechanism-freeze` | `candidate-recorded` | `when version-level review selects shared condition/effect expression governance as the smallest lawful next cut` | `Covers the reusable condition/effect contract family for event, task, dialogue, menu, and minigame authoring, including shared primitive boundaries and host-specific adapter limits.` |
| `queue.minimal-runtime-contract-change-audit` | `candidate-recorded` | `when version-level review selects minimum runtime/schema delta classification as the smallest lawful next cut` | `Covers required / optional / out-of-scope runtime delta review together with the Class A / B / C mismatch classification gate, so no runtime table, field, loader, or consumer rewrite is promoted before the minimum lawful change list is frozen.` |

### Candidate Classification Record

| Item ID | Classification | Proposed Queue | Disposition | Basis |
| --- | --- | --- | --- | --- |
| `item.script-editor-contract-freeze-version-open` | `current-target-item` | `none` | `version opened with no live queue` | `The operator explicitly required a Blueprint governance switch that closes target.project-complete-modularization and opens a new version dedicated to script-editor design and contract freeze. This opening intentionally records no live queue and no live candidate set.` |
| `item.editor-native-authoring-contract-freeze` | `queue-candidate` | `queue.editor-native-authoring-contract-freeze` | `candidate-recorded` | `The intake explicitly requires one frozen authoring-object contract covering story_pack / person / city / building / event / quest / dialogue / minigame / story_node / text_entry / condition_group / effect_bundle, together with responsibility boundaries, naming constraints, editor-only metadata rules, and a ban on deriving the authoring model directly from the current runtime table shape.` |
| `item.authoring-runtime-mapping-contract-freeze` | `queue-candidate` | `queue.authoring-runtime-mapping-contract-freeze` | `candidate-recorded` | `The intake explicitly requires one object-level authoring -> runtime mapping contract that names target runtime tables, direct-export fields, editor-project-only fields, compatibility shim reliance, and the export-vs-shared-contract-upgrade split for each authoring object.` |
| `item.compatibility-import-export-policy-freeze` | `queue-candidate` | `queue.compatibility-import-export-policy-freeze` | `candidate-recorded` | `The intake explicitly requires one bounded policy freeze for existing pack import, editor project persistence, runtime-facing export, and the rule that authoring-only metadata must not leak into runtime pack output.` |
| `item.shared-condition-effect-mechanism-freeze` | `queue-candidate` | `queue.shared-condition-effect-mechanism-freeze` | `candidate-recorded` | `The intake explicitly requires one shared condition/effect mechanism boundary reused by event / task / dialogue / menu / minigame authoring and explicitly forbids each domain from growing a separate feature-local rule dialect.` |
| `item.minimal-runtime-contract-change-audit` | `queue-candidate` | `queue.minimal-runtime-contract-change-audit` | `candidate-recorded` | `The intake explicitly requires one bounded minimum-runtime-change audit covering required / optional / out-of-scope classification and the Class A / B / C mismatch matrix before any runtime/schema expansion or consumer rewrite can be justified for script-editor landing.` |

### Version Boundary Record

- `This version governs design and contract freeze only; it does not silently admit editor UI delivery, runtime refactors, or repository-wide migration work.`
- `Modularization residue from the closed prior version, including grain-shop helper-family cleanup and broader runtime-orchestration or house-session ownerization, is out of scope for this successor version unless a later explicit governance action proves it is strictly required for the frozen editor contract.`
- `Future queue admission under this version must prove a bounded contract-freeze cut first and must not bypass version-level review by appealing to editor ambition alone.`

### Queue Admission Startup Rules

1. `Read project-progress -> blueprint -> version plan -> active queue before touching a fresh queue item.`
2. `If an active queue exists, test whether the new item can be absorbed before considering a new queue.`
3. `If the item becomes queue-candidate, write version-plan review truth before any queue activation or implementation begins.`
4. `Do not treat version opening or user scope approval as queue admission.`
5. `Do not create a queue doc for this version until one bounded contract-freeze queue is formally admitted.`

### Candidate Recovery Rule

- `Use this version plan's queue promotion ledger as the default recovery source for future script-editor contract-freeze queue candidates.`
- `Do not restart a full re-audit unless new material evidence invalidates the recorded contract family or admission basis.`

### Candidate Recovery Rule Addendum

- `The 2026-07-10 freeze-prep intake records five bounded queue-candidates in candidate_queue_ids; they are now live candidate truth in this version plan.`
- `queue.editor-native-authoring-contract-freeze is currently the selected admission-review subject, but it remains pre-admission only: active_queue stays none, no queue doc exists, and implementation is still unauthorized.`
- `Resume from this version plan's recorded candidate ledger unless new material evidence invalidates the bounded split or proves a different smaller lawful queue cut.`
- `Non-goal work such as main.ts pure shell closure, large sub-runtime refactors, repository-wide hardcoded script migration, full editor UI delivery, or non-essential runtime schema expansion must not be promoted under this version without a future explicit version-boundary change.`

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
- `Queue closeout may auto-advance; version closeout must not be inferred from queue completion alone.`
- `When version acceptance and closeout conditions are satisfied, ask exactly one human confirmation before changing version_status to done.`

### Prior Promotion Record

- `2026-07-10: target.script-editor-contract-freeze was opened as the successor version after target.project-complete-modularization was explicitly closed on human instruction.`
- `2026-07-10: the version opened with no active queue, no queue doc creation, and no live candidate set because the first required governance action is contract freeze rather than implementation.`
- `2026-07-10: the current script-editor freeze-prep intake was decomposed into five bounded queue-candidates and recorded in version-plan truth, while active_queue remained none and no queue doc was created because admission review has not yet selected a first execution queue.`
- `2026-07-10: queue.editor-native-authoring-contract-freeze was selected as the first pending admission-review subject because creator-facing object-model freeze is the smallest lawful upstream cut on current evidence, but the queue remains unadmitted and no queue doc was created.`
