# Script Editor PRD Alignment Version Plan

## Control Block

- document_role: `version-governor`
- version_id: `target.script-editor-prd-alignment`
- version_status: `open`
- active_phase: `phase.implementation`
- active_queue: `queue.script-editor-prd-minigame-binding-alignment`
- decision_state: `active-execution`
- next_decision: `queue-closeout-or-return-to-version-review`
- next_action: `resume-active-queue`
- resume_gate: `active-queue`
- promotion_review_result: `admit`
- review_subject_id: `none`
- review_subject_classification: `none`
- proposed_queue_id: `none`
- review_basis: `none`
- admission_status: `none`
- intake_status: `admission-review`
- intake_item_id: `item.script-editor-prd-minigame-binding`
- intake_summary: `Advance from the now-closed story/dialogue/event slice into PRD minigame/playable binding: dedicated binding authoring, bounded playable selection/settlement configuration, and structured cross-object linkage on top of the shared playable runtime baseline.`
- intake_result: `promoted-to-admission`
- intake_feedback_mode: `fixed-receipt`
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
  - `queue.script-editor-prd-project-selection-and-workspace-layout-alignment`
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
  - `queue.script-editor-prd-workspace-and-navigation-alignment, queue.script-editor-prd-project-selection-and-workspace-layout-alignment, queue.script-editor-prd-person-authoring-alignment, queue.script-editor-prd-city-building-and-menu-alignment, and queue.script-editor-prd-dialogue-event-story-alignment are now all closed historical evidence, and queue.script-editor-prd-minigame-binding-alignment is admitted immediately as the next same-family continuation because PRD section 10 minigame/playable binding remains the narrowest lawful residue after the story/dialogue/event slice closed.`
- Current handoff:
  - `The current active queue is queue.script-editor-prd-minigame-binding-alignment.`
  - `The current active task is task.script-editor-prd-minigame-binding-alignment.minigame-binding-implementation.`
  - `Later PRD alignment queues must continue to consume the closed implementation baseline plus the now-closed workbench/project-selection/person-authoring/city-building/dialogue-event-story output rather than reopen them by convenience.`

### Queue Promotion Ledger

| Queue ID | Current Disposition | Promote When | Notes |
| --- | --- | --- | --- |
| `queue.script-editor-prd-workspace-and-navigation-alignment` | `done` | `only if fresh repository evidence later disproves the landed PRD workspace first cut or proves a new still-open same-family residue inside that bounded surface` | `Closed on 2026-07-13 after the repository gained one Chinese-first creator workbench layer and formal project-overview-first landing surface on top of the already-landed shell/minimal workflow baseline.` |
| `queue.script-editor-prd-project-selection-and-workspace-layout-alignment` | `done` | `only if fresh repository evidence later disproves the landed project-selection surface or proves a new still-open same-family residue inside that bounded continuation slice` | `Closed on 2026-07-13 after the repository gained one dedicated project-selection/management surface, per-project continue/delete flow with delete confirmation, and responsive workbench/project-card layout adaptation on top of the already-closed first-cut workspace baseline.` |
| `queue.script-editor-prd-person-authoring-alignment` | `done` | `only if fresh repository evidence later disproves the landed person-authoring slice or proves a new still-open same-family residue inside that bounded surface` | `Closed on 2026-07-13 after the repository gained a dedicated person list/detail authoring surface, structured person tabs, unified person fields, and bounded dialogue/event/trade entrypoints.` |
| `queue.script-editor-prd-city-building-and-menu-alignment` | `done` | `only if fresh repository evidence later disproves the landed city/building slice or proves a new still-open same-family residue inside that bounded surface` | `Closed on 2026-07-13 after the repository gained dedicated city/building authoring surfaces, configurable menu families, access-state controls, and building entry-binding authoring.` |
| `queue.script-editor-prd-dialogue-event-story-alignment` | `done` | `only if fresh repository evidence later disproves the landed story/dialogue/event slice or proves a new still-open same-family residue inside that bounded surface` | `Closed on 2026-07-13 after the repository gained dedicated story/dialogue/event authoring surfaces, structured event blocks, and bounded linkage/preview-summary authoring.` |
| `queue.script-editor-prd-minigame-binding-alignment` | `admitted` | `while the active queue remains in execution` | `Owns configuration-first minigame/playable binding and settlement configuration on top of existing playable capabilities rather than implementing new minigame engines or shared runtime contract changes.` |
| `queue.script-editor-prd-preview-validation-export-alignment` | `candidate-recorded` | `when fresh repository evidence confirms that built-in preview, validation, and export handoff still require one bounded finishing cut after upstream authoring surfaces exist` | `Owns the PRD structure preview, performance preview, validation, and export handoff surfaces while preserving runtime-compatible output.` |

### Candidate Classification Record

| Item ID | Classification | Proposed Queue | Disposition | Basis |
| --- | --- | --- | --- | --- |
| `item.script-editor-prd-alignment-version-open` | `current-target-item` | `none` | `version opened with no active queue` | `The operator explicitly requested a new successor version whose goal is to deliver the requirements in docs/script-editor-prd.md.` |
| `item.script-editor-prd-workspace-and-navigation` | `queue-candidate` | `queue.script-editor-prd-workspace-and-navigation-alignment` | `admitted + queue closed` | `PRD sections 4.1, 4.2, and 4.2.1 made the workbench itself the first priority, and the bounded first-cut workbench queue is now closed historical evidence after that surface landed with verification.` |
| `item.script-editor-prd-project-selection-and-workspace-layout` | `queue-candidate` | `queue.script-editor-prd-project-selection-and-workspace-layout-alignment` | `admitted + queue closed` | `The requested split between project selection/management and current-project editing, plus responsive workspace adaptation across wide/mid/narrow widths, is now closed historical evidence after the bounded continuation slice landed with verification.` |
| `item.script-editor-prd-person-authoring` | `queue-candidate` | `queue.script-editor-prd-person-authoring-alignment` | `admitted + queue closed` | `PRD section 5 formalizes a unified person model, structured tabs, and bounded relation/dialogue/event/trade entry surfaces beyond the current baseline, and that bounded slice is now landed as closed historical evidence.` |
| `item.script-editor-prd-city-building-and-menu` | `queue-candidate` | `queue.script-editor-prd-city-building-and-menu-alignment` | `admitted + queue closed` | `PRD section 6 formalizes city/building container behavior, configurable menu families, entry conditions, and reusable capability binding rules, and that bounded slice is now landed as closed historical evidence.` |
| `item.script-editor-prd-dialogue-event-story` | `queue-candidate` | `queue.script-editor-prd-dialogue-event-story-alignment` | `admitted + queue closed` | `PRD sections 7, 8, and 9 formalize story ownership, dialogue/event editor capabilities, structured condition editing, preview, and validation duties, and that bounded slice is now landed as closed historical evidence.` |
| `item.script-editor-prd-minigame-binding` | `queue-candidate` | `queue.script-editor-prd-minigame-binding-alignment` | `admitted` | `PRD section 10 requires minigame binding as a formal configuration surface on top of existing playable capabilities rather than ad hoc launch wiring, and current repository truth still leaves that family empty or deferred while upstream object/binding surfaces are now in place.` |
| `item.script-editor-prd-preview-validation-export` | `queue-candidate` | `queue.script-editor-prd-preview-validation-export-alignment` | `candidate-recorded` | `PRD sections 11 and 12 require built-in structure/performance preview plus validation/export alignment on top of the earlier bounded export baseline.` |

### Candidate Scope Notes

- `queue.script-editor-prd-workspace-and-navigation-alignment` is now closed historical evidence after the bounded first-cut workbench alignment landed with verification.`
- `queue.script-editor-prd-project-selection-and-workspace-layout-alignment` is now closed historical evidence after the requested script-list page, project deletion flow, and responsive multi-width behavior landed with verification.`
- `queue.script-editor-prd-person-authoring-alignment` is now closed historical evidence after the bounded PRD section 5 slice landed with verification; later queues must consume this person-authoring baseline rather than reopen it by convenience.`
- `queue.script-editor-prd-city-building-and-menu-alignment` is now closed historical evidence after the bounded PRD section 6 slice landed with verification; later queues must consume this city/building baseline rather than reopen it by convenience.`
- `queue.script-editor-prd-dialogue-event-story-alignment` is now closed historical evidence after the bounded PRD sections 7 through 9 slice landed with verification; later queues must consume its dedicated story/dialogue/event authoring baseline rather than reopen it by convenience.`
- `queue.script-editor-prd-minigame-binding-alignment` is now the active same-family continuation because PRD section 10 minigame/playable binding remains outside the closed workbench/project-selection/person-authoring/city-building/dialogue-event-story slices, while current repository truth still keeps minigames empty or deferred and still defers activity/playable import-export assembly to a later queue.`
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
- `2026-07-13: the pending admission review for queue.script-editor-prd-workspace-and-navigation-alignment is then concluded internally, the queue is admitted as the first active PRD alignment queue, the queue doc is created, and execution moves to workspace-and-navigation implementation on top of the landed shell/minimal workflow baseline.`
- `2026-07-13: a fresh intake requesting a dedicated script-list/project-selection page, per-project delete management, and responsive workspace adaptation is classified as item.script-editor-prd-project-selection-and-workspace-layout and recorded as queue.script-editor-prd-project-selection-and-workspace-layout-alignment; it is not admitted because single-active-queue mode still pins execution to queue.script-editor-prd-workspace-and-navigation-alignment.`
- `2026-07-13: queue.script-editor-prd-workspace-and-navigation-alignment then closes after the bounded PRD 4.x first-cut workbench slice lands with verification, and queue.script-editor-prd-project-selection-and-workspace-layout-alignment is admitted immediately as the next same-family continuation because project-selection separation and responsive workbench layout remain the narrowest lawful residue.`
- `2026-07-13: queue.script-editor-prd-project-selection-and-workspace-layout-alignment then closes after the bounded project-selection and responsive-layout continuation lands with verification, so target.script-editor-prd-alignment returns to version-level promotion review with queue.script-editor-prd-person-authoring-alignment recorded as the next lawful same-family candidate.`
- `2026-07-13: queue.script-editor-prd-person-authoring-alignment is then admitted as the next active PRD alignment queue after repository inspection reconfirms that people still use the generic minimal editor and PRD section 5 remains the next smallest lawful same-family gap.`
- `2026-07-13: queue.script-editor-prd-person-authoring-alignment then closes after the bounded person-authoring slice lands with verification, so target.script-editor-prd-alignment returns to version-level promotion review with queue.script-editor-prd-city-building-and-menu-alignment recorded as the next lawful same-family candidate.`
- `2026-07-13: queue.script-editor-prd-city-building-and-menu-alignment is then admitted as the next active PRD alignment queue after repository inspection reconfirms that cities/buildings remain hidden or generic in the current authoring surface and PRD section 6 remains the next smallest same-family gap.`
- `2026-07-13: queue.script-editor-prd-city-building-and-menu-alignment then closes after the bounded city/building slice lands with verification, so target.script-editor-prd-alignment returns to version-level promotion review with queue.script-editor-prd-dialogue-event-story-alignment recorded as the next lawful same-family candidate.`
- `2026-07-13: queue.script-editor-prd-dialogue-event-story-alignment is then admitted as the next active PRD alignment queue after repository inspection reconfirms that story/dialogue/event families remain generic or deferred in the current authoring surface and PRD sections 7 through 9 remain the next smallest same-family gap.`
- `2026-07-13: queue.script-editor-prd-dialogue-event-story-alignment then closes after the bounded story/dialogue/event slice lands with verification, so target.script-editor-prd-alignment returns to version-level promotion review with queue.script-editor-prd-minigame-binding-alignment recorded as the next lawful same-family candidate.`
- `2026-07-13: queue.script-editor-prd-minigame-binding-alignment is then admitted as the next active PRD alignment queue after repository inspection reconfirms that the minigame family remains empty or deferred in the current authoring surface and PRD section 10 remains the next smallest same-family gap.`
