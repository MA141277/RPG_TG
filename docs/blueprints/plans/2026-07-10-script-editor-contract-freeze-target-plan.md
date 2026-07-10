# Script Editor Contract Freeze Version Plan

## Control Block

- document_role: `version-governor`
- version_id: `target.script-editor-contract-freeze`
- version_status: `open`
- active_phase: `phase.contract-freeze`
- active_queue: `none`
- decision_state: `idle-open`
- next_decision: `same-version-admission-or-version-closeout`
- next_action: `classify-fresh-work`
- resume_gate: `idle-open`
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
- closure_review_subject: `none`
- closure_review_status: `none`
- residue_candidate_id: `none`
- residue_candidate_family: `none`
- routing_basis: `none`
- next_lawful_queue_recommendation: `none`
- auto_admission_ready: `false`
- blocked_by: []
- candidate_queue_ids:

## Human Context

### Admission Review Record

- Scope approval:
  - `This governance switch opens the version only. No queue is admitted and no implementation work is authorized by this document change.`
- Admission basis:
  - `Script-editor work is intentionally split out of the closed modularization version and must first converge on contract freeze before any implementation queue can be admitted.`
- Current review subject:
  - `none`
- Current handoff:
  - `No active queue exists for this version.`
  - `The next lawful step is same-version classification or admission only after fresh evidence proves one bounded contract-freeze queue.`
- `The current live candidate set is empty on written source truth.`

### Queue Promotion Ledger

| Queue ID | Current Disposition | Promote When | Notes |
| --- | --- | --- | --- |
| `queue.editor-native-authoring-contract-freeze` | `recorded-family` | `only if fresh evidence proves the creator-facing authoring object model or lifecycle boundary still lacks one frozen contract cut` | `Recorded at version opening only as a queue family; not yet part of the live candidate set and no queue doc exists.` |
| `queue.authoring-runtime-mapping-contract-freeze` | `recorded-family` | `only if fresh evidence proves authoring objects still lack one explicit compile/export mapping contract into the runtime-facing pack surface` | `Recorded at version opening only as a queue family; mapping closure must stay contract-first rather than turning into implementation by drift.` |
| `queue.compatibility-import-export-policy-freeze` | `recorded-family` | `only if fresh evidence proves pack import, editor project persistence, or runtime export policy still lacks one frozen compatibility boundary` | `Recorded at version opening only as a queue family; compatibility work remains policy-level until admission.` |
| `queue.shared-condition-effect-mechanism-freeze` | `recorded-family` | `only if fresh evidence proves condition/effect authoring still depends on feature-local branching instead of one reusable mechanism contract` | `Recorded at version opening only as a queue family; this queue family exists to prevent event/task/dialogue-specific contract drift.` |
| `queue.minimal-runtime-contract-change-audit` | `recorded-family` | `only if fresh evidence proves editor landing needs runtime contract changes and the minimum lawful delta remains unbounded` | `Recorded at version opening only as a queue family; runtime deltas must stay minimal and must not widen into general runtime modernization.` |

### Candidate Classification Record

| Item ID | Classification | Proposed Queue | Disposition | Basis |
| --- | --- | --- | --- | --- |
| `item.script-editor-contract-freeze-version-open` | `current-target-item` | `none` | `version opened with no live queue` | `The operator explicitly required a Blueprint governance switch that closes target.project-complete-modularization and opens a new version dedicated to script-editor design and contract freeze. This opening intentionally records no live queue and no live candidate set.` |

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

- `No queue in this version is live candidate truth at version opening time; candidate_queue_ids intentionally remains empty until a later bounded admission review is written.`
- `editor-native authoring contract freeze, authoring -> runtime mapping freeze, compatibility/import-export policy freeze, shared condition/effect mechanism freeze, and minimum runtime delta audit are all recorded as queue families only at this stage.`
- `A recorded-family entry in the queue promotion ledger is not the same as live candidate truth and must not be treated as admission-ready by itself.`
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
