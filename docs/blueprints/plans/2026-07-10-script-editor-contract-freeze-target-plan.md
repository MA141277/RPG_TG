# Script Editor Contract Freeze Version Plan

## Control Block

- document_role: `version-governor`
- version_id: `target.script-editor-contract-freeze`
- version_status: `open`
- active_phase: `phase.version-closeout`
- active_queue: `none`
- decision_state: `idle-open`
- next_decision: `version-closeout`
- next_action: `write-version-closeout`
- resume_gate: `idle-open`
- promotion_review_result: `Closeout-ready acceptance evidence now exists on current version truth: all five bounded contract-freeze queues are closed, no active queue remains, the authoring contract, mapping contract, compatibility policy, shared-rule contract, and minimum runtime delta audit are all explicit, and only one human closeout confirmation remains before version_status may change from open to done.`
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
  - `queue.editor-native-authoring-contract-freeze`
  - `queue.authoring-runtime-mapping-contract-freeze`
  - `queue.compatibility-import-export-policy-freeze`
  - `queue.shared-condition-effect-mechanism-freeze`
  - `queue.minimal-runtime-contract-change-audit`

## Human Context

### Admission Review Record

- Scope approval:
  - `The last admitted queue remained bounded to minimum runtime contract change audit and did not authorize concrete runtime/schema landing, editor implementation, or broad modernization work.`
- Admission basis:
  - `After the shared-rule queue closed, the current script-editor freeze requirement still needed one explicit minimum-runtime-change audit covering required / optional / out-of-scope classification together with the Class A / B / C mismatch matrix, and that audit remained the last smallest lawful bounded cut before version closeout readiness could be proven.`
- Admission conclusion:
  - `queue.minimal-runtime-contract-change-audit was admitted as the final bounded queue for the current version and is now already closed historical evidence.`
- Current handoff:
  - `No active queue remains for this version.`
  - `The current lawful step is one human closeout confirmation: close current version now, or keep it open for possible additional same-version queue admission.`
- `All five bounded contract-freeze queues now have written closure evidence on current version truth.`

### Queue Promotion Ledger

| Queue ID | Current Disposition | Promote When | Notes |
| --- | --- | --- | --- |
| `queue.editor-native-authoring-contract-freeze` | `done` | `only if fresh evidence later disproves the written authoring-contract freeze or proves a new still-open authoring-contract residue inside the same bounded topic surface` | `Closed on 2026-07-10 after the current version spec explicitly froze the creator-facing core object set, per-object responsibility boundaries, naming decisions, editor-only metadata rules, and downstream routing boundaries. The remaining version work now belongs to later mapping, compatibility, shared-rule, or runtime-delta queue families rather than another same-family authoring-contract continuation.` |
| `queue.authoring-runtime-mapping-contract-freeze` | `done` | `only if fresh evidence later disproves the written mapping contract or proves a new still-open mapping-family residue inside the same bounded topic surface` | `Closed on 2026-07-10 after the current version spec explicitly froze mapping principles, the object-level mapping matrix, direct-export versus editor-project-only boundaries, and downstream routing boundaries. The remaining version work now belongs to later compatibility policy, shared-rule, or runtime-delta queue families rather than another same-family mapping continuation.` |
| `queue.compatibility-import-export-policy-freeze` | `done` | `only if fresh evidence later disproves the written compatibility/import-export policy or proves a new still-open same-family compatibility residue inside the bounded topic surface` | `Closed on 2026-07-10 after the current version spec explicitly froze compatibility-first import/export direction, editor-project persistence policy, runtime-facing export artifact policy, importer precedence, and metadata non-leak guarantees. The remaining version work now belongs to later shared-rule or runtime-delta queue families rather than another same-family compatibility continuation.` |
| `queue.shared-condition-effect-mechanism-freeze` | `done` | `only if fresh evidence later disproves the written shared-rule contract or proves a new still-open same-family shared-rule residue inside the bounded topic surface` | `Closed on 2026-07-10 after the current version spec explicitly froze the shared condition model, shared effect model, host adapter boundary, and anti-dialect rules across event, task, dialogue/scene, menu, and minigame authoring. The remaining version work now belongs to the final runtime-delta audit family rather than another same-family shared-rule continuation.` |
| `queue.minimal-runtime-contract-change-audit` | `done` | `only if fresh evidence later disproves the written minimum runtime delta audit or proves a new still-open same-family runtime-delta residue inside the bounded topic surface` | `Closed on 2026-07-10 after the current version spec explicitly froze the minimum required runtime/schema delta list, optional additive candidates, out-of-scope modernization exclusions, and the Class A / B / C gap-classification matrix for current editor/runtime mismatches.` |

### Candidate Classification Record

| Item ID | Classification | Proposed Queue | Disposition | Basis |
| --- | --- | --- | --- | --- |
| `item.script-editor-contract-freeze-version-open` | `current-target-item` | `none` | `version opened with no live queue` | `The operator explicitly required a Blueprint governance switch that closes target.project-complete-modularization and opens a new version dedicated to script-editor design and contract freeze. This opening intentionally records no live queue and no live candidate set.` |
| `item.editor-native-authoring-contract-freeze` | `queue-candidate` | `queue.editor-native-authoring-contract-freeze` | `admitted + queue closed` | `The intake explicitly requires one frozen authoring-object contract covering story_pack / person / city / building / event / quest / dialogue / minigame / story_node / text_entry / condition_group / effect_bundle, together with responsibility boundaries, naming constraints, editor-only metadata rules, and a ban on deriving the authoring model directly from the current runtime table shape. That bounded contract is now written in the version spec, so the queue is closed rather than left active.` |
| `item.authoring-runtime-mapping-contract-freeze` | `queue-candidate` | `queue.authoring-runtime-mapping-contract-freeze` | `admitted + active queue` | `The intake explicitly requires one object-level authoring -> runtime mapping contract that names target runtime tables, direct-export fields, editor-project-only fields, compatibility shim reliance, and the export-vs-shared-contract-upgrade split for each authoring object. That basis remains current after the prior authoring-contract queue closed, so the candidate now becomes the active queue rather than staying pending.` |
| `item.compatibility-import-export-policy-freeze` | `queue-candidate` | `queue.compatibility-import-export-policy-freeze` | `admitted + queue closed` | `The intake explicitly requires one bounded policy freeze for existing pack import, editor project persistence, runtime-facing export, and the rule that authoring-only metadata must not leak into runtime pack output. That basis became the smallest lawful next cut after the mapping queue closed, and the queue is now closed historical evidence rather than still active.` |
| `item.shared-condition-effect-mechanism-freeze` | `queue-candidate` | `queue.shared-condition-effect-mechanism-freeze` | `admitted + queue closed` | `The intake explicitly requires one shared condition/effect mechanism boundary reused by event / task / dialogue / menu / minigame authoring and explicitly forbids each domain from growing a separate feature-local rule dialect. That basis became the smallest lawful next cut after the compatibility-policy queue closed, and the queue is now closed historical evidence rather than still active.` |
| `item.minimal-runtime-contract-change-audit` | `queue-candidate` | `queue.minimal-runtime-contract-change-audit` | `admitted + queue closed` | `The intake explicitly requires one bounded minimum-runtime-change audit covering required / optional / out-of-scope classification and the Class A / B / C mismatch matrix before any runtime/schema expansion or consumer rewrite can be justified for script-editor landing. That basis became the final smallest lawful cut after the shared-rule queue closed, and the queue is now closed historical evidence rather than still active.` |

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
- `queue.editor-native-authoring-contract-freeze is now closed historical evidence: its boundary baseline, core-object freeze, and queue closeout tasks are all complete, and it no longer controls current execution.`
- `queue.authoring-runtime-mapping-contract-freeze is now closed historical evidence: its baseline, object-level mapping freeze, and queue closeout tasks are all complete, and it no longer controls current execution.`
- `queue.compatibility-import-export-policy-freeze is now closed historical evidence: its baseline, policy freeze, and queue closeout tasks are all complete, and it no longer controls current execution.`
- `queue.shared-condition-effect-mechanism-freeze is now closed historical evidence: its baseline, shared-rule freeze, and queue closeout tasks are all complete, and it no longer controls current execution.`
- `queue.minimal-runtime-contract-change-audit is now closed historical evidence: its baseline, runtime-delta freeze, and queue closeout tasks are all complete, and it no longer controls current execution.`
- `The version now has no active queue and is closeout-ready on written source truth, but it must remain open until one explicit human closeout confirmation is recorded.`
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
- `2026-07-10: queue.editor-native-authoring-contract-freeze was selected as the first pending admission-review subject because creator-facing object-model freeze is the smallest lawful upstream cut on current evidence.`
- `2026-07-10: that pending admission review was concluded internally, queue.editor-native-authoring-contract-freeze was admitted, the queue doc was created, active_queue was synchronized, and the first queue task was designated.`
- `2026-07-10: queue execution then completed boundary-baseline-reconcile and core-object-and-boundary-freeze, so only queue closeout plus residue routing remains live under this queue.`
- `2026-07-10: queue.editor-native-authoring-contract-freeze then closed after queue closeout confirmed that the bounded authoring-contract topic is converged and that the remaining next lawful work belongs to queue.authoring-runtime-mapping-contract-freeze as a cross-family continuation under the same open version.`
- `2026-07-10: the pending admission review for queue.authoring-runtime-mapping-contract-freeze was then concluded internally, the queue was admitted as the next smallest lawful cut, and the queue doc was created so execution could continue without manual operator admission handling.`
- `2026-07-10: the active mapping queue then completed baseline reconcile and object-level mapping freeze, landing the frozen destination-family rules, object-level mapping matrix, and direct-export versus editor-project-only boundaries on the current version spec.`
- `2026-07-10: queue.authoring-runtime-mapping-contract-freeze then closed after queue closeout confirmed that the bounded mapping topic is converged and that the remaining next lawful work belongs to queue.compatibility-import-export-policy-freeze as a cross-family continuation under the same open version.`
- `2026-07-10: the pending admission review for queue.compatibility-import-export-policy-freeze was then concluded internally, the queue was admitted as the next smallest lawful cut, and the queue doc was created so execution could continue without manual operator admission handling.`
- `2026-07-10: the active compatibility queue then completed baseline reconcile and policy freeze, landing the frozen import/export direction, editor-project persistence policy, runtime-facing export artifact policy, importer precedence, and metadata non-leak rules on the current version spec.`
- `2026-07-10: queue.compatibility-import-export-policy-freeze then closed after queue closeout confirmed that the bounded compatibility-policy topic is converged and that the remaining next lawful work belongs to queue.shared-condition-effect-mechanism-freeze as a cross-family continuation under the same open version.`
- `2026-07-10: the pending admission review for queue.shared-condition-effect-mechanism-freeze was then concluded internally, the queue was admitted as the next smallest lawful cut, and the queue doc was created so execution could continue without manual operator admission handling.`
- `2026-07-10: the active shared-rule queue then completed baseline reconcile and shared-rule freeze, landing the frozen shared condition model, shared effect model, host adapter boundary, and anti-dialect rules on the current version spec.`
- `2026-07-10: queue.shared-condition-effect-mechanism-freeze then closed after queue closeout confirmed that the bounded shared-rule topic is converged and that the remaining next lawful work belongs to queue.minimal-runtime-contract-change-audit as the final cross-family continuation under the same open version.`
- `2026-07-10: the pending admission review for queue.minimal-runtime-contract-change-audit was then concluded internally, the queue was admitted as the final smallest lawful cut, and the queue doc was created so execution could continue without manual operator admission handling.`
- `2026-07-10: the active runtime-delta queue then completed baseline reconcile, minimum-runtime-delta freeze, and queue closeout, landing the frozen minimum change list plus Class A / B / C classification matrix and returning the version to closeout-ready state with no active queue.`
