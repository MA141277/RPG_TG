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
- closure_review_subject: `queue.script-editor-compatibility-boundary-retirement`
- closure_review_status: `routed`
- residue_candidate_id: `none`
- residue_candidate_family: `none`
- routing_basis: `queue.script-editor-compatibility-boundary-retirement closed after writing the migration-only compatibility retirement contract; the recorded candidate portfolio has no remaining unadmitted contract-governance queue, but the version remains open because implementation and final acceptance requirements have not been explicitly closed.`
- next_lawful_queue_recommendation: `none`
- auto_admission_ready: `false`
- blocked_by: []
- candidate_queue_ids:
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
  - `target.script-editor-runtime-pack-unification is now the live open successor version, and queue.script-editor-runtime-family-authoring-convergence is the next admitted active queue because fresh evidence still shows editor-facing data ownership depends on long-lived authoring-only parallel families.`
  - `Execution now resumes from task.script-editor-runtime-family-authoring-convergence.boundary-baseline-reconcile inside the admitted queue document.`

### Queue Promotion Ledger

| Queue ID | Current Disposition | Promote When | Notes |
| --- | --- | --- | --- |
| `queue.script-editor-runtime-family-contract-alignment` | `done` | `only if fresh repository evidence later disproves the frozen mandatory/inheritable/unsupported/fail-closed family contract or proves still-blocking same-family contract residue` | `Closed on 2026-07-14 after docs/scenario-pack-unified-format.md and the active version spec froze the family contract for downstream queues.` |
| `queue.script-editor-runtime-family-authoring-convergence` | `done` | `only if fresh repository evidence later proves still-blocking same-family authoring-convergence residue after the written retirement map` | `Closed on 2026-07-14 after the queue wrote the authoring parallel-structure retirement map and routed remaining residue to downstream queue families.` |
| `queue.script-editor-runtime-pack-export-unification` | `done` | `only if fresh repository evidence later proves still-blocking same-family export-contract residue after the written startup-consumable export contract map` | `Closed on 2026-07-14 after the queue wrote the formal startup-consumable export contract map and routed remaining residue to downstream queue families.` |
| `queue.script-editor-base-pack-inheritance-governance` | `done` | `only if fresh repository evidence later proves still-blocking same-family inheritance-governance residue after the written family overlay contract map` | `Closed on 2026-07-14 after the queue wrote explicit family overlay rules, inheritance sources, and fail-closed obligations for mandatory and explicitly inheritable runtime families.` |
| `queue.script-editor-fixed-pack-consumer-deprivileging` | `done` | `only if fresh repository evidence later proves still-blocking same-family consumer-routing residue after the written active-content-only route contract` | `Closed on 2026-07-14 after the queue wrote the covered consumer route contract and classified retained builtin baselines as out of scope unless they bypass active scenario-pack content resolution.` |
| `queue.script-editor-compatibility-boundary-retirement` | `done` | `only if fresh repository evidence later proves still-blocking same-family compatibility-boundary contract residue after the written migration-only retirement contract` | `Closed on 2026-07-14 after the queue wrote the migration-only compatibility boundary for import, authoring storage, UI diagnostics, export validation, and version closeout.` |

### Candidate Classification Record

| Item ID | Classification | Proposed Queue | Disposition | Basis |
| --- | --- | --- | --- | --- |
| `item.script-editor-runtime-pack-unification-version-open` | `current-target-item` | `none` | `version opened; first queue subsequently admitted` | `The operator explicitly requested that the successor draft become the next active Blueprint version once the PRD alignment version proved queue-complete and closeable; the version then completed admission review for its first bounded queue.` |
| `item.script-editor-runtime-family-contract-alignment` | `queue-candidate` | `queue.script-editor-runtime-family-contract-alignment` | `admitted + queue closed` | `Mandatory-vs-inheritable runtime family truth was unresolved across runtime startup, editor import, editor export, and compatibility residue handling; this queue has now frozen the contract and closed as historical evidence.` |
| `item.script-editor-runtime-family-authoring-convergence` | `queue-candidate` | `queue.script-editor-runtime-family-authoring-convergence` | `admitted + queue closed` | `Editor-owned authoring structures preserved bounded authoring-only residue; this queue has now written the retirement map and closed as historical evidence.` |
| `item.script-editor-runtime-pack-export-unification` | `queue-candidate` | `queue.script-editor-runtime-pack-export-unification` | `admitted + queue closed` | `The export path was still a bounded partial seam; this queue has now written the startup-consumable export contract map and closed as historical evidence.` |
| `item.script-editor-base-pack-inheritance-governance` | `queue-candidate` | `queue.script-editor-base-pack-inheritance-governance` | `admitted + queue closed` | `basePackId was present in import/export metadata flow without family-level inheritance semantics; this queue has now written the formal overlay and fail-closed contract map.` |
| `item.script-editor-fixed-pack-consumer-deprivileging` | `queue-candidate` | `queue.script-editor-fixed-pack-consumer-deprivileging` | `admitted + queue closed` | `src/content/pack-content-access.ts still directly imports builtin zhuyuanzhang pack files and default-pack facade consumers still bypass active scenario-pack resolution; this queue has now written the active-content-only route contract.` |
| `item.script-editor-compatibility-boundary-retirement` | `queue-candidate` | `queue.script-editor-compatibility-boundary-retirement` | `admitted + queue closed` | `The script-editor shell and workspace still surfaced compatibility residue as live authoring/export truth; this queue has now written the migration-only compatibility retirement contract.` |

### Candidate Scope Notes

- `This version consumes the closed contract-freeze, implementation, and PRD-alignment versions as historical baseline evidence; it must not reopen their queue surfaces by convenience.`
- `queue.script-editor-runtime-family-contract-alignment is now closed historical evidence because every later convergence queue can consume one explicit answer for mandatory runtime families, inheritable families, unsupported/transitional families, and fail-closed obligations.`
- `No later queue may create a new long-lived authoring-only family, a new export-only shadow dialect, or a new builtin fallback rule as a convenience patch while this version is open.`
- `The successor version owns architecture convergence, not unrelated gameplay redesign, generic runtime cleanup, or repository-wide visual polish.`

### Admission Review Record

- `queue.script-editor-runtime-family-authoring-convergence was reviewed on 2026-07-14 as the next lawful queue candidate.`
- `Fresh repository evidence still shows separate authoring-only and runtime family surfaces in src/domain/script-editor-project.ts, src/application/script-editor/runtime-pack-import.ts, src/application/script-editor/runtime-pack-export.ts, src/application/script-editor/workspace-shell.ts, and src/ui/main-ui/main-ui-flow.js, so authoring convergence remains the smallest lawful next cut.`
- `The version plan now resumes from queue-level execution truth instead of keeping a live admission review subject in the Control Block.`

### Current Queue Progress

- `task.script-editor-runtime-family-authoring-convergence.boundary-baseline-reconcile completed on 2026-07-14 after fresh repository evidence confirmed that authoring-only parallel structures still shadow runtime ownership and that this queue remains narrower than export unification, base-pack inheritance, fixed-pack consumer deprivileging, or compatibility retirement.`
- `task.script-editor-runtime-family-authoring-convergence.authoring-parallel-structure-retirement-map completed on 2026-07-14 after the queue classified direct runtime-owned authoring surfaces, export-deferred narrative/playable surfaces, shared-rule compiler inputs, and compatibility residue into explicit retirement dispositions.`
- `task.script-editor-runtime-family-authoring-convergence.queue-closeout-and-handoff completed on 2026-07-14 after the queue verified its bounded authoring-convergence slice, classified remaining residue as cross-family, and returned control to version-level promotion review.`

### Runtime Pack Export Unification Admission Record

- `queue.script-editor-runtime-pack-export-unification was reviewed on 2026-07-14 and admitted as the next active same-version queue.`
- `Fresh repository evidence shows src/application/script-editor/runtime-pack-export.ts still writes empty scenes.json, omits activities from its export manifest, fails closed on dialogues/minigames/storyNodes, and blocks on compatibilityImport.unresolvedFamilies.`
- `The startup loader in src/application/scenario/scenario-pack-loader.ts can consume manifest-driven scenario packs with scenes and optional activities, so the exporter remains a bounded partial seam rather than the final startup-consumable scenario-pack truth.`

### Runtime Pack Export Unification Progress

- `task.script-editor-runtime-pack-export-unification.boundary-baseline-reconcile completed on 2026-07-14 after fresh evidence confirmed that the exporter still writes empty scenes.json, omits activities from the manifest, fails closed on dialogues/minigames/storyNodes, and blocks on compatibilityImport residue while the startup loader can consume fuller scenario-pack truth.`
- `task.script-editor-runtime-pack-export-unification.startup-consumable-export-contract-map completed on 2026-07-14 after the queue wrote mandatory-family export obligations, authoring lowering obligations, fail-closed rules, and downstream boundaries for formal startup-consumable export.`
- `task.script-editor-runtime-pack-export-unification.queue-closeout-and-handoff completed on 2026-07-14 after the queue verified its bounded export-contract slice, classified remaining residue as cross-family, and returned control to version-level promotion review.`

### Base Pack Inheritance Governance Admission Record

- `queue.script-editor-base-pack-inheritance-governance was reviewed on 2026-07-14 and admitted as the next active same-version queue.`
- `Fresh repository evidence shows src/application/script-editor/runtime-pack-import.ts preserves manifest.basePackId/rawPack.basePackId only as storyPack metadata, while src/application/script-editor/runtime-pack-export.ts only copies storyPack.basePackId through pack metadata without resolving mandatory or inheritable families.`
- `The shared scenario-pack contract already requires missing mandatory/inheritable families to resolve through explicit basePackId inheritance or fail closed, so base-pack inheritance governance is now the smallest lawful next cut.`

### Base Pack Inheritance Governance Progress

- `task.script-editor-base-pack-inheritance-governance.boundary-baseline-reconcile completed on 2026-07-14 after fresh evidence confirmed basePackId remains metadata passthrough in runtime-pack import/export while the frozen family/export contracts require explicit family-level inheritance or fail-closed behavior.`
- `task.script-editor-base-pack-inheritance-governance.family-overlay-contract-map completed on 2026-07-14 after the queue wrote explicit family-level overlay rules, inheritance sources, and fail-closed obligations for mandatory and explicitly inheritable runtime families.`
- `task.script-editor-base-pack-inheritance-governance.queue-closeout-and-handoff completed on 2026-07-14 after the queue verified its bounded inheritance-governance slice, closed same-family residue, and returned control to version-level promotion review.`

### Fixed Pack Consumer Deprivileging Admission Record

- `queue.script-editor-fixed-pack-consumer-deprivileging was reviewed on 2026-07-14 and admitted as the next active same-version queue.`
- `Fresh repository evidence shows src/content/pack-content-access.ts still directly imports zhuyuanzhang activities, events, scenes, text entries, home-house content, and keep-house content JSON.`
- `Downstream consumers such as src/application/house-modules/temple-house/temple-house-active-content.ts, src/content/houses/home-house-content.ts, and src/content/houses/keep-house-content.ts still consume default-pack facades instead of active scenario-pack content resolution.`
- `The closed base-pack inheritance queue already forbids treating hard-imported builtin files as inheritance fallback, so fixed-pack consumer deprivileging was the smallest lawful next cut.`

### Fixed Pack Consumer Deprivileging Progress

- `task.script-editor-fixed-pack-consumer-deprivileging.boundary-baseline-reconcile completed on 2026-07-14 after fresh evidence confirmed src/content/pack-content-access.ts still directly imports zhuyuanzhang scenario-pack JSON and downstream consumers still consume default-pack facades instead of active scenario-pack resolution.`
- `task.script-editor-fixed-pack-consumer-deprivileging.consumer-route-contract-map completed on 2026-07-14 after the queue wrote the covered consumer route map and classified default-pack facades, house-module active content helpers, and startup/UI baselines as routed or out of scope unless they bypass active scenario-pack content resolution.`
- `task.script-editor-fixed-pack-consumer-deprivileging.queue-closeout-and-handoff completed on 2026-07-14 after the queue verified its bounded consumer-deprivileging slice, closed same-family residue, and returned control to version-level promotion review.`

### Compatibility Boundary Retirement Admission Record

- `queue.script-editor-compatibility-boundary-retirement was reviewed on 2026-07-14 and admitted as the next active same-version queue.`
- `Fresh repository evidence shows src/application/script-editor/workspace-shell.ts and src/ui/main-ui/main-ui-flow.js still surface compatibility residue counts as daily authoring risk and creator-facing status.`
- `src/application/script-editor/runtime-pack-export.ts still fails closed on storyPack.compatibilityImport.unresolvedFamilies, while src/application/script-editor/runtime-pack-import.ts still preserves unresolved families as compatibility residue.`
- `The closed export, inheritance, and consumer route queues now provide the necessary contract baseline, so compatibility-boundary retirement is the smallest lawful next cut.`

### Compatibility Boundary Retirement Progress

- `task.script-editor-compatibility-boundary-retirement.boundary-baseline-reconcile completed on 2026-07-14 after fresh evidence confirmed workspace shell and main UI still surface compatibility residue counts as daily authoring risk, and runtime export still fails closed on storyPack.compatibilityImport.unresolvedFamilies.`
- `task.script-editor-compatibility-boundary-retirement.retirement-contract-map completed on 2026-07-14 after the queue wrote the migration-only compatibility boundary for import, authoring storage, UI diagnostics, export validation, and version closeout.`
- `task.script-editor-compatibility-boundary-retirement.queue-closeout-and-handoff completed on 2026-07-14 after the queue verified its bounded compatibility-retirement slice, closed same-family contract residue, and returned control to version-level promotion review.`

### Current Queue Activation

- `none`

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
