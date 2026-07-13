# Script Editor Implementation Version Plan

## Control Block

- document_role: `version-governor`
- version_id: `target.script-editor-implementation`
- version_status: `open`
- active_phase: `phase.implementation`
- active_queue: `queue.authoring-runtime-export-pipeline`
- decision_state: `active-execution`
- next_decision: `queue-closeout-or-return-to-version-review`
- next_action: `resume-active-queue`
- resume_gate: `active-queue`
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
  - `queue.script-editor-minimal-usable-workflow`

## Human Context

### Admission Review Record

- Scope approval:
  - `This version is opened for implementation on top of the frozen script-editor contract baseline, and the first implementation queue has now closed with export pipeline now admitted as the next active queue.`
- Admission basis:
  - `target.script-editor-contract-freeze is already closed historical evidence and now acts as the mandatory frozen baseline for this successor implementation version. queue.editor-project-load-save-foundation has already landed the bounded persistence foundation, so queue.authoring-runtime-export-pipeline is now admitted because export is the next smallest lawful upstream implementation cut on current evidence.`
- Admission conclusion:
  - `queue.authoring-runtime-export-pipeline was admitted as the single active queue for the current version because export is now the unique smallest lawful continuation after the bounded persistence foundation closed.`
- Current handoff:
  - `queue.authoring-runtime-export-pipeline is now the only active queue for this version.`
  - `The current lawful step is to resume task.authoring-runtime-export-pipeline.runtime-export-and-validator-assembly under docs/blueprints/queues/authoring-runtime-export-pipeline-queue.md after the boundary-baseline-reconcile task froze the first bounded export slice.`
- `The current live candidate set contains the first bounded implementation queues on written source truth.`

### Queue Promotion Ledger

| Queue ID | Current Disposition | Promote When | Notes |
| --- | --- | --- | --- |
| `queue.editor-project-load-save-foundation` | `done` | `only if fresh evidence later disproves the landed manifest-driven authoring-project persistence seam or proves a new still-open same-family persistence residue inside the bounded topic surface` | `Closed on 2026-07-13 after the repository gained one script-editor project contract, imported-directory hydration, canonical split-file save output, and bounded validation coverage. The remaining version work now belongs to export, compatibility import, shared-rule integration, or UI workflow queue families rather than another same-family persistence continuation.` |
| `queue.authoring-runtime-export-pipeline` | `active` | `only if fresh evidence later disproves the admitted export-pipeline boundary or proves a new still-open same-family export residue inside the bounded topic surface after closeout` | `Admitted on 2026-07-13 as the single active queue because the bounded persistence foundation is already closed and export is the next smallest lawful implementation cut on current evidence. Owns authoring -> runtime export flow on top of the frozen mapping contract.` |
| `queue.compatibility-import-adapter` | `candidate-recorded` | `when version-level review selects existing-pack compatibility import as the smallest lawful next cut` | `Owns compatibility import path according to the frozen import/export policy.` |
| `queue.shared-condition-effect-authoring-integration` | `candidate-recorded` | `when version-level review selects shared rule authoring/validation integration as the smallest lawful next cut` | `Owns shared condition/effect authoring path on top of the frozen shared-rule contract.` |
| `queue.script-editor-ui-shell-and-core-workflow` | `candidate-recorded` | `when version-level review selects creator-facing editor shell and reusable editing workspace framing as the smallest lawful next cut` | `Owns the bounded editor-shell layer on top of the frozen baseline: reusable workspace frame, top-level navigation chrome, object-tree shell, and creator-facing layout scaffolding without re-owning persistence, export, compatibility-import, or the full minimal usable product loop.` |
| `queue.script-editor-minimal-usable-workflow` | `candidate-recorded` | `when version-level review selects the first user-visible minimal script-editor loop as the smallest lawful next cut after prerequisite seams already exist` | `Owns the bounded minimal usable editor path: main-menu "剧本编辑器" entry, landing page actions, project-first editing flow, minimal object set, validation handoff, and export handoff while consuming rather than re-owning upstream persistence/export/import seams. Admission should wait until the persistence seam is landed, export is landed, compatibility import is either landed or explicitly proven non-blocking for the chosen first loop, and the queue can close on one user-visible workflow rather than broad editor polish.` |

### Candidate Classification Record

| Item ID | Classification | Proposed Queue | Disposition | Basis |
| --- | --- | --- | --- | --- |
| `item.script-editor-implementation-version-open` | `current-target-item` | `none` | `version opened with no active queue` | `The predecessor freeze version is closed, and this successor version now governs implementation on the frozen baseline.` |
| `item.editor-project-load-save-foundation` | `queue-candidate` | `queue.editor-project-load-save-foundation` | `admitted + queue closed` | `A bounded project load/save and validation foundation is a lawful first implementation cut on top of the frozen authoring contract, and it is now closed historical evidence after the bounded persistence seam landed and verified.` |
| `item.authoring-runtime-export-pipeline` | `queue-candidate` | `queue.authoring-runtime-export-pipeline` | `admitted + queue active` | `A bounded export pipeline and validator path is required to make the frozen mapping contract executable, and it is now the active queue after the persistence foundation queue closed and the pending admission review concluded.` |
| `item.compatibility-import-adapter` | `queue-candidate` | `queue.compatibility-import-adapter` | `candidate-recorded` | `Existing-pack import compatibility must be implemented according to the frozen compatibility/import-export policy.` |
| `item.shared-condition-effect-authoring-integration` | `queue-candidate` | `queue.shared-condition-effect-authoring-integration` | `candidate-recorded` | `Shared condition/effect authoring must be implemented on the frozen shared-rule baseline rather than through host-local rule dialects.` |
| `item.script-editor-ui-shell-and-core-workflow` | `queue-candidate` | `queue.script-editor-ui-shell-and-core-workflow` | `candidate-recorded` | `A bounded creator-facing editor shell is required so later workflow-focused queue cuts can land on one reusable workspace frame instead of rebuilding editor chrome inside each product-facing slice.` |
| `item.script-editor-minimal-usable-workflow` | `queue-candidate` | `queue.script-editor-minimal-usable-workflow` | `candidate-recorded` | `A bounded minimal usable editor loop is required so the repository can expose one user-visible path from the main menu into a script-editor workspace that can create or open a project, edit the minimal object set, validate, and hand off to export without widening into full product polish.` |

### Candidate Scope Notes

- `queue.script-editor-ui-shell-and-core-workflow` remains the narrower creator-shell candidate. It may own reusable workspace framing, navigation chrome, object-tree layout, and editor-page scaffolding, but it must not be treated as the sole owner of the user-visible minimal product loop.`
- `queue.script-editor-minimal-usable-workflow` remains candidate-recorded only and must not be admitted early while export-pipeline, compatibility-import, or shared-rule prerequisites still lack the implementation evidence required for a minimal usable editor loop.`
- `When queue.script-editor-minimal-usable-workflow is later admitted, the shortest user-visible workflow should be: main-menu "剧本编辑器" entry -> editor landing page with "新建剧本项目 / 打开剧本项目 / 导入现有剧本包" -> project-first workspace shell -> minimal object tree -> validation/export handoff.`
- `The minimal object tree for queue.script-editor-minimal-usable-workflow should stay bounded to 项目 / 人物 / 文本 / 剧情节点 / 事件, with the default in-editor landing surface on 项目 so new-project, open-project, and import-project flows all converge on one stable first page.`
- `The creator guidance path inside queue.script-editor-minimal-usable-workflow should stay bounded to 项目 -> 人物 -> 文本 -> 剧情节点 -> 事件 -> 校验 -> 导出, while still allowing direct navigation through the object tree instead of forcing a modal wizard.`
- `queue.script-editor-minimal-usable-workflow may own the main-menu button, landing-page actions, top toolbar workflow guidance, and project-first editing path, but it must consume rather than re-own the already separated persistence, export, and compatibility-import seams from queue.editor-project-load-save-foundation, queue.authoring-runtime-export-pipeline, and queue.compatibility-import-adapter.`

### Candidate Admission Basis Notes

- `Admission prerequisite set for queue.script-editor-minimal-usable-workflow:`
  - `queue.editor-project-load-save-foundation = done is mandatory because the minimal usable loop must create/open/save real editor projects instead of rendering a throwaway shell.`
  - `queue.authoring-runtime-export-pipeline = done is mandatory because the minimal usable loop must hand off to real export rather than a placeholder success state.`
  - `queue.compatibility-import-adapter = done is the default prerequisite for the "导入现有剧本包" path; if that queue is not yet done, this candidate may only be admitted early if future review explicitly narrows the first loop to 新建/打开 and records that import remains blocked on a separate prerequisite.`
  - `queue.shared-condition-effect-authoring-integration is not an unconditional prerequisite for admission, but any event fields included in the chosen first editable slice must either stay outside shared-rule authoring or already have a bounded non-drifting implementation path.`
- `Required owned surfaces when admitted:`
  - `main-menu entry button named "剧本编辑器"`
  - `editor landing page with 新建剧本项目 / 打开剧本项目 / 导入现有剧本包`
  - `project-first in-editor landing page`
  - `minimal object-tree editing path for 项目 / 人物 / 文本 / 剧情节点 / 事件`
  - `visible 校验 and 导出 handoff inside the editor flow`
- `Minimum acceptance loop when admitted:`
  - `a user can enter from the main menu into the editor without developer-only affordances`
  - `a user can create a project or open an existing project and land on 项目 as the first stable editing page`
  - `a user can edit the bounded minimal object set and keep that state through save/reopen`
  - `a user can run validation and reach a real runtime-pack export handoff from the same visible workflow`
  - `if import is included in the admitted slice, a user can import one existing scenario pack into the same workspace flow instead of being diverted to a disconnected tool path`
- `Must-not-absorb list when admitted:`
  - `full product polish, broad UX iteration, or optional editor ergonomics`
  - `city / building / task / minigame / menu-family editing beyond the bounded minimal object set`
  - `new runtime schema growth or compatibility-policy rewrites justified only by UI convenience`
  - `re-implementation of persistence, export, or compatibility-import seams already owned by upstream queues`

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

- `All six first-wave implementation queues remain live candidate truth in this version plan, and queue.authoring-runtime-export-pipeline is now the single active queue.`
- `queue.editor-project-load-save-foundation is closed historical evidence; new implementation authority currently comes only from docs/blueprints/queues/authoring-runtime-export-pipeline-queue.md.`
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
- `2026-07-13: the pending admission review for queue.editor-project-load-save-foundation was concluded, the queue was admitted as the first active implementation queue, the queue doc was created, and execution moved to manifest-driven editor-project load/save plus validation foundation.`
- `2026-07-13: queue.editor-project-load-save-foundation then closed after script-editor project contract, manifest hydration, canonical split-file save output, and bounded validation coverage landed with fresh verification; control returned to version-level promotion review with queue.authoring-runtime-export-pipeline selected as the next pending admission-review subject.`
- `2026-07-13: the pending admission review for queue.authoring-runtime-export-pipeline was then concluded internally, the queue was admitted as the next single active implementation queue, the queue doc was created, and execution moved to export-pipeline baseline reconcile before code implementation continues.`
