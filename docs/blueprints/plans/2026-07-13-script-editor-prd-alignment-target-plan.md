# Script Editor PRD Alignment Version Plan

## Control Block

- document_role: `version-governor`
- version_id: `target.script-editor-prd-alignment`
- version_status: `open`
- active_phase: `phase.implementation`
- active_queue: `none`
- decision_state: `promotion-review`
- next_decision: `queue-admission-review`
- next_action: `write-admission-review`
- resume_gate: `promotion-review`
- promotion_review_result: `none`
- review_subject_id: `item.script-editor-prd-workspace-and-navigation`
- review_subject_classification: `queue-candidate`
- proposed_queue_id: `queue.script-editor-prd-workspace-and-navigation-alignment`
- review_basis: `docs/script-editor-prd.md makes the creator workbench and project-overview-first navigation the explicit first priority, while the current repository still only has the earlier bounded shell/minimal workflow baseline.`
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
  - `queue.script-editor-prd-workspace-and-navigation-alignment`
  - `queue.script-editor-prd-person-authoring-alignment`
  - `queue.script-editor-prd-city-building-and-menu-alignment`
  - `queue.script-editor-prd-dialogue-event-story-alignment`
  - `queue.script-editor-prd-minigame-binding-alignment`
  - `queue.script-editor-prd-preview-validation-export-alignment`

## Human Context

### Admission Review Record

- Scope approval:
  - `The operator explicitly requested creation of a new successor version whose goal is to implement the requirements in docs/script-editor-prd.md.`
- Admission basis:
  - `The closed target.script-editor-implementation version already landed the bounded persistence, export, compatibility import, shared-rule task/export, shell scaffold, and first user-visible workflow baseline, but docs/script-editor-prd.md still names a broader creator-facing product surface that has not yet been admitted as same-version continuation.`
  - `PRD section 4 states that the workbench itself is the first priority and formalizes a top-bar + left-navigation + center-editor layout with project overview as the default landing surface, so workspace and navigation alignment is the smallest lawful first candidate under the new version.`
- Admission conclusion:
  - `This successor version is now open with candidate-recorded PRD alignment queues only; no queue is admitted and no queue doc is created at version opening time.`
- Current handoff:
  - `No active queue exists yet under target.script-editor-prd-alignment.`
  - `The next lawful step is version-level admission review for queue.script-editor-prd-workspace-and-navigation-alignment.`
  - `Later queue admissions must continue to consume the closed implementation baseline rather than reopen it.`

### Queue Promotion Ledger

| Queue ID | Current Disposition | Promote When | Notes |
| --- | --- | --- | --- |
| `queue.script-editor-prd-workspace-and-navigation-alignment` | `candidate-recorded` | `when fresh repository evidence still confirms that the PRD workbench, Chinese navigation model, and project-overview-first flow remain the smallest lawful first cut` | `Owns the PRD workspace frame, project overview, Chinese-first navigation semantics, and editor-stage routing surface on top of the already-landed shell/minimal workflow baseline.` |
| `queue.script-editor-prd-person-authoring-alignment` | `candidate-recorded` | `when fresh repository evidence confirms that person tabs, structured fields, and relation/binding surfaces are the next smallest lawful PRD gap after upstream workspace alignment` | `Owns the PRD person model, tab structure, and structured authoring expectations without widening into city/building or dialogue/event families by convenience.` |
| `queue.script-editor-prd-city-building-and-menu-alignment` | `candidate-recorded` | `when fresh repository evidence confirms that PRD city/building container and menu-binding behavior is the next smallest lawful PRD gap` | `Owns city/building containers, entry conditions, menu families, and configurable menu-binding surfaces while reusing existing formal city/house/menu capability families.` |
| `queue.script-editor-prd-dialogue-event-story-alignment` | `candidate-recorded` | `when fresh repository evidence confirms that PRD dialogue/event/story authoring and structured condition editing is the next smallest lawful PRD gap` | `Owns the formal dialogue, event, and story authoring/editor interaction surface, including structured condition editing, preview expectations, and cross-object linkage rules.` |
| `queue.script-editor-prd-minigame-binding-alignment` | `candidate-recorded` | `when fresh repository evidence confirms that the PRD minigame binding surface is the next smallest lawful PRD gap after upstream object/binding surfaces exist` | `Owns configuration-first minigame binding and settlement configuration on top of existing playable capabilities rather than implementing new minigame engines.` |
| `queue.script-editor-prd-preview-validation-export-alignment` | `candidate-recorded` | `when fresh repository evidence confirms that built-in preview, validation, and export handoff still require one bounded finishing cut after upstream authoring surfaces exist` | `Owns the PRD structure preview, performance preview, validation, and export handoff surfaces while preserving runtime-compatible output.` |

### Candidate Classification Record

| Item ID | Classification | Proposed Queue | Disposition | Basis |
| --- | --- | --- | --- | --- |
| `item.script-editor-prd-alignment-version-open` | `current-target-item` | `none` | `version opened with no active queue` | `The operator explicitly requested a new successor version whose goal is to deliver the requirements in docs/script-editor-prd.md.` |
| `item.script-editor-prd-workspace-and-navigation` | `queue-candidate` | `queue.script-editor-prd-workspace-and-navigation-alignment` | `candidate-recorded` | `PRD sections 4.1, 4.2, and 4.2.1 make the workbench itself the first priority and formalize the top-bar + left-nav + center-editor + project-overview-first flow.` |
| `item.script-editor-prd-person-authoring` | `queue-candidate` | `queue.script-editor-prd-person-authoring-alignment` | `candidate-recorded` | `PRD section 5 formalizes a unified person model, structured tabs, and bounded relation/dialogue/event/trade entry surfaces beyond the current baseline.` |
| `item.script-editor-prd-city-building-and-menu` | `queue-candidate` | `queue.script-editor-prd-city-building-and-menu-alignment` | `candidate-recorded` | `PRD section 6 formalizes city/building container behavior, configurable menu families, entry conditions, and reusable capability binding rules.` |
| `item.script-editor-prd-dialogue-event-story` | `queue-candidate` | `queue.script-editor-prd-dialogue-event-story-alignment` | `candidate-recorded` | `PRD sections 7, 8, and 9 formalize story ownership, dialogue/event editor capabilities, structured condition editing, preview, and validation duties not yet aligned in the repository.` |
| `item.script-editor-prd-minigame-binding` | `queue-candidate` | `queue.script-editor-prd-minigame-binding-alignment` | `candidate-recorded` | `PRD section 10 requires minigame binding as a formal configuration surface on top of existing playable capabilities rather than ad hoc launch wiring.` |
| `item.script-editor-prd-preview-validation-export` | `queue-candidate` | `queue.script-editor-prd-preview-validation-export-alignment` | `candidate-recorded` | `PRD sections 11 and 12 require built-in structure/performance preview plus validation/export alignment on top of the earlier bounded export baseline.` |

### Candidate Scope Notes

- `queue.script-editor-prd-workspace-and-navigation-alignment` should be treated as the default first admission candidate because the PRD explicitly makes the workbench itself the first priority.`
- `Later queues must consume rather than re-own the already closed persistence/export/import/shared-rule/shell/minimal-workflow seams from target.script-editor-implementation.`
- `Preview, validation, and export handoff should not be front-loaded ahead of upstream workspace and authoring-surface gaps unless fresh repository evidence proves that ordering wrong.`
- `Minigame binding remains configuration-first PRD work; it must not silently expand into new playable-mechanic implementation inside this version.`

### Version Boundary Record

- `This version governs PRD alignment on top of the closed script-editor implementation baseline; it does not silently reopen prior baseline truth.`
- `If fresh evidence disproves the frozen contract baseline or the closed implementation baseline, stop and route that as explicit governance instead of silently changing the version boundary.`
- `This version must not absorb unrelated runtime modernization, asset-pipeline work, or repository-wide cleanup by convenience.`

### Queue Admission Startup Rules

1. `Read project-progress -> blueprint -> version plan -> active queue before touching a fresh queue item.`
2. `If an active queue exists, test whether the new item can be absorbed before considering a new queue.`
3. `If the item becomes queue-candidate, write version-plan review truth before any queue activation or implementation begins.`
4. `Do not treat successor-version opening or scope approval as queue admission.`
5. `Do not create a queue doc for this version until one bounded PRD alignment queue is formally admitted.`

### Candidate Recovery Rule

- `Use this version plan's queue promotion ledger as the default recovery source for future script-editor PRD alignment queue candidates.`
- `Do not restart a full re-audit unless new material evidence invalidates the recorded PRD boundary or admission basis.`

### Candidate Recovery Rule Addendum

- `This successor version starts with candidate-recorded PRD alignment queues only and no active queue.`
- `Resume from this version plan's recorded candidate ledger unless new material evidence invalidates the bounded PRD split or proves a different smaller lawful first cut.`
- `Any evidence that docs/script-editor-prd.md requires baseline correction rather than implementation alignment must route to explicit governance rather than silent implementation drift.`

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

- `2026-07-13: target.script-editor-prd-alignment is opened as the successor version after target.script-editor-implementation closed with explicit human confirmation.`
- `2026-07-13: the successor version starts with candidate-recorded PRD alignment queues only; no queue is admitted and no execution begins at version opening time.`
- `2026-07-13: queue.script-editor-prd-workspace-and-navigation-alignment is selected as the first pending admission-review subject because docs/script-editor-prd.md makes the workbench itself the first priority and current repository truth still shows only the earlier bounded shell/minimal workflow baseline.`
