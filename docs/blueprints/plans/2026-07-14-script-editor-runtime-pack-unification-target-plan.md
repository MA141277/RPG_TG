# Script Editor Runtime Pack Unification Version Plan

## Control Block

- document_role: `version-governor`
- version_id: `target.script-editor-runtime-pack-unification`
- version_status: `open`
- active_phase: `phase.promotion-review`
- active_queue: `none`
- decision_state: `promotion-review`
- next_decision: `same-version-admission-or-version-closeout`
- next_action: `write-admission-review`
- resume_gate: `version-review`
- promotion_review_result: `admit`
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
- closure_review_subject: `queue.script-editor-runtime-family-contract-alignment`
- closure_review_status: `routed`
- residue_candidate_id: `item.script-editor-runtime-family-authoring-convergence`
- residue_candidate_family: `cross-family`
- routing_basis: `queue.script-editor-runtime-family-contract-alignment closed after freezing the runtime-family contract; remaining work now belongs to downstream family convergence, export unification, inheritance, consumer deprivileging, and compatibility retirement queues rather than additional same-family contract definition.`
- next_lawful_queue_recommendation: `queue.script-editor-runtime-family-authoring-convergence`
- auto_admission_ready: `false`
- blocked_by: []
- candidate_queue_ids:
  - `queue.script-editor-runtime-family-contract-alignment`
  - `queue.script-editor-runtime-family-authoring-convergence`
  - `queue.script-editor-runtime-pack-export-unification`
  - `queue.script-editor-base-pack-inheritance-governance`
  - `queue.script-editor-fixed-pack-consumer-deprivileging`
  - `queue.script-editor-compatibility-boundary-retirement`

## Human Context

### Admission Review Record

- Scope approval:
  - `The operator explicitly requested that Blueprint close target.script-editor-prd-alignment if no lawful same-version candidate queue remains, then inspect and activate docs/blueprints/specs/2026-07-14-script-editor-runtime-pack-unification-target.md as the next version according to Blueprint governance.`
- Admission basis:
  - `target.script-editor-prd-alignment is now closed with its final same-family queue recorded as done historical evidence, so the successor-candidate admission gate that required the predecessor version to be closed is satisfied.`
  - `Fresh repository evidence still proves that runtime-pack convergence remains open after PRD alignment: src/application/script-editor/runtime-pack-import.ts still preserves unresolved imported families such as activities as compatibility residue instead of converging them into one formal runtime family contract, and src/application/script-editor/runtime-pack-export.ts still fails closed on storyPack.compatibilityImport.unresolvedFamilies rather than exporting one already-authoritative runtime pack.`
  - `Fresh repository evidence also proves that basePackId and active-content ownership remain incomplete at the final-contract layer: src/application/script-editor/runtime-pack-import.ts and src/application/script-editor/runtime-pack-export.ts currently treat basePackId largely as metadata passthrough, while src/content/pack-content-access.ts still directly imports builtin zhuyuanzhang scenario-pack files instead of routing all covered consumers through one active scenario-pack selector.`
  - `The current script-editor workspace and shell still surface compatibility residue counts as daily authoring/export truth through src/application/script-editor/workspace-shell.ts and src/ui/main-ui/main-ui-flow.js, which confirms that compatibility residue is not yet retired to migration-only duty.`
- Admission conclusion:
  - `target.script-editor-runtime-pack-unification is now the live open successor version, and queue.script-editor-runtime-family-contract-alignment is the first admitted active queue because the final family contract is the smallest lawful first cut on current evidence.`
  - `Execution now resumes from task.script-editor-runtime-family-contract-alignment.boundary-baseline-reconcile inside the admitted queue document.`

### Queue Promotion Ledger

| Queue ID | Current Disposition | Promote When | Notes |
| --- | --- | --- | --- |
| `queue.script-editor-runtime-family-contract-alignment` | `done` | `only if fresh repository evidence later disproves the frozen mandatory/inheritable/unsupported/fail-closed family contract or proves still-blocking same-family contract residue` | `Closed on 2026-07-14 after docs/scenario-pack-unified-format.md and the active version spec froze the family contract for downstream queues.` |
| `queue.script-editor-runtime-family-authoring-convergence` | `candidate` | `now eligible for admission review if fresh evidence confirms that editor-facing data ownership still depends on long-lived authoring-only parallel structures after the family contract freeze` | `This is the next lawful recommendation because authoring-structure convergence depends on the family contract that is now frozen, and it precedes export unification so export does not encode an obsolete authoring shadow dialect.` |
| `queue.script-editor-runtime-pack-export-unification` | `candidate` | `only after queue.script-editor-runtime-family-contract-alignment closes and fresh evidence still shows that export emits a bounded project artifact instead of the final startup-consumable scenario-pack artifact` | `Owns export-path unification, not the upstream family-contract freeze.` |
| `queue.script-editor-base-pack-inheritance-governance` | `candidate` | `only after queue.script-editor-runtime-family-contract-alignment closes and fresh evidence still shows implicit or inconsistent inheritance behavior` | `Must formalize basePackId semantics after the mandatory-vs-inheritable contract is explicit.` |
| `queue.script-editor-fixed-pack-consumer-deprivileging` | `candidate` | `when fresh repository evidence still proves that runtime or application consumers bypass active content resolution through fixed builtin pack imports or equivalent privileged access` | `Current direct imports in src/content/pack-content-access.ts keep this queue candidate live, but it remains downstream to the family-contract freeze because deprivileging should consume the final contract rather than pre-guess it.` |
| `queue.script-editor-compatibility-boundary-retirement` | `candidate` | `only after the formal runtime-pack export path exists and fresh evidence still shows compatibility residue participating in daily authoring/export truth` | `Must remain later than export unification because compatibility cannot retire until the replacement runtime-pack path is already formal and live.` |

### Candidate Classification Record

| Item ID | Classification | Proposed Queue | Disposition | Basis |
| --- | --- | --- | --- | --- |
| `item.script-editor-runtime-pack-unification-version-open` | `current-target-item` | `none` | `version opened; first queue subsequently admitted` | `The operator explicitly requested that the successor draft become the next active Blueprint version once the PRD alignment version proved queue-complete and closeable; the version then completed admission review for its first bounded queue.` |
| `item.script-editor-runtime-family-contract-alignment` | `queue-candidate` | `queue.script-editor-runtime-family-contract-alignment` | `admitted + queue closed` | `Mandatory-vs-inheritable runtime family truth was unresolved across runtime startup, editor import, editor export, and compatibility residue handling; this queue has now frozen the contract and closed as historical evidence.` |
| `item.script-editor-runtime-family-authoring-convergence` | `queue-candidate` | `queue.script-editor-runtime-family-authoring-convergence` | `candidate-recorded` | `Editor-owned authoring structures still preserve bounded authoring-only residue, but lawful convergence depends on the final family contract first.` |
| `item.script-editor-runtime-pack-export-unification` | `queue-candidate` | `queue.script-editor-runtime-pack-export-unification` | `candidate-recorded` | `The current export path still fails closed on compatibility residue and remains a bounded runtime-compatible seam rather than the single formal startup-consumable runtime-pack artifact.` |
| `item.script-editor-base-pack-inheritance-governance` | `queue-candidate` | `queue.script-editor-base-pack-inheritance-governance` | `candidate-recorded` | `basePackId is present in current import/export metadata flow, but family-level inheritance semantics are not yet formalized as contract truth.` |
| `item.script-editor-fixed-pack-consumer-deprivileging` | `queue-candidate` | `queue.script-editor-fixed-pack-consumer-deprivileging` | `candidate-recorded` | `src/content/pack-content-access.ts still directly imports builtin zhuyuanzhang pack files, so active-content-only resolution is not yet the sole lawful consumer path.` |
| `item.script-editor-compatibility-boundary-retirement` | `queue-candidate` | `queue.script-editor-compatibility-boundary-retirement` | `candidate-recorded` | `The script-editor shell and workspace still surface compatibility residue as live authoring/export truth, so compatibility has not yet been reduced to migration-only duty.` |

### Candidate Scope Notes

- `This version consumes the closed contract-freeze, implementation, and PRD-alignment versions as historical baseline evidence; it must not reopen their queue surfaces by convenience.`
- `queue.script-editor-runtime-family-contract-alignment is now closed historical evidence because every later convergence queue can consume one explicit answer for mandatory runtime families, inheritable families, unsupported/transitional families, and fail-closed obligations.`
- `No later queue may create a new long-lived authoring-only family, a new export-only shadow dialect, or a new builtin fallback rule as a convenience patch while this version is open.`
- `The successor version owns architecture convergence, not unrelated gameplay redesign, generic runtime cleanup, or repository-wide visual polish.`

### Version Boundary Record

- `This version governs the convergence from bounded script-editor project/import/export seams toward one formal scenario-pack runtime truth.`
- `It must consume rather than silently rewrite the closed implementation and PRD-alignment baselines.`
- `If fresh evidence disproves the successor spec's final-state assumptions, record that as explicit governance rather than silently lowering back into another bounded compatibility patch.`

### Queue Admission Startup Rules

1. `Read project-progress -> blueprint -> version plan -> active queue before touching a fresh queue item.`
2. `If an active queue exists, test whether the new item can be absorbed before considering a new queue.`
3. `If the item becomes queue-candidate, write version-plan review truth before any queue activation or implementation begins.`
4. `Do not treat successor-version opening or scope approval as queue admission.`
5. `Do not create a queue doc for this version until one bounded runtime-pack-unification queue is formally admitted.`

### Candidate Recovery Rule

- `Use this version plan's queue promotion ledger as the default recovery source for future runtime-pack-unification queue candidates.`
- `Do not restart a full re-audit unless new material evidence invalidates the recorded successor boundary or admission basis.`

### Candidate Recovery Rule Addendum

- `This successor version opened with no active queue and a fully recorded candidate portfolio; queue.script-editor-runtime-family-contract-alignment has since been admitted as the single active queue while the remaining five queue families stay candidate-recorded.`
- `Resume from this version plan's recorded candidate ledger unless new material evidence invalidates the final runtime-pack convergence boundary or proves a different smaller lawful first cut.`
- `Any evidence that the repository should keep bounded compatibility residue or builtin privileged content as permanent daily truth must be treated as explicit governance disagreement, not silent queue-local convenience.`

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

### Prior Promotion Record

- `2026-07-14: target.script-editor-prd-alignment closed after its final same-family queue, queue.script-editor-prd-workbench-ui-visual-alignment, landed as done historical evidence with no remaining lawful same-version continuation recorded inside that version.`
- `2026-07-14: the operator explicitly requested successor-version activation if no PRD-alignment candidate queue remained, so target.script-editor-runtime-pack-unification is now opened as the live successor version.`
- `2026-07-14: the successor version initially opened with a candidate-recorded queue portfolio only and no active queue, making admission review for queue.script-editor-runtime-family-contract-alignment the next lawful step at that point.`
- `2026-07-14: admission review then promoted queue.script-editor-runtime-family-contract-alignment as the single active queue and exposed task.script-editor-runtime-family-contract-alignment.boundary-baseline-reconcile as the live execution entry.`
