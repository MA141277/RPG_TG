# Map Review Provider Boundary Extraction Version Plan

## Control Block

- document_role: `version-governor`
- version_id: `target.map-review-provider-boundary-extraction`
- version_status: `open`
- active_phase: `phase.queue-execution`
- active_queue: `queue.map-review-provider-boundary-extraction-and-acceptance`
- decision_state: `active-execution`
- next_decision: `queue-closeout-or-return-to-version-review`
- next_action: `resume-active-queue`
- resume_gate: `open-active-queue`
- post_queue_closeout_pause_policy: `auto-continue`
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
  - `queue.map-review-provider-boundary-extraction-and-acceptance`
- candidate_backlog_refresh_status: `fresh`
- candidate_backlog_snapshot:
  - `queue.map-review-provider-boundary-extraction-and-acceptance`
- candidate_backlog_scan_sources:
  - `project-progress`
  - `blueprint`
  - `current version plan`
  - `candidate_queue_ids`
  - `Candidate Recovery Ledger`
  - `Queue Promotion Ledger`
  - `named queue docs`
  - `docs/blueprints/version-memo.md`

## Human Context

### Activation Record

- Scope approval:
  - `The operator refined and approved a four-step map/review boundary extraction: provider interface/adapters, consumer cutover with removal inventory, inventory-driven cleanup, and acceptance/guard testing with completeness review.`
- Admission basis:
  - `MEMO-010 and operator-approved design show map rendering still owns city coordinate/info assembly while review lifecycle remains partly distributed; one bounded queue can extract provider interfaces, migrate consumers, inventory residue, remove old paths, and verify complete behavior across normal start, JSON import, and Script Editor runtime preview.`
- Activation conclusion:
  - `target.map-review-provider-boundary-extraction is the active version.`
  - `queue.map-review-provider-boundary-extraction-and-acceptance is admitted as the single active queue.`
  - `Evidence-anchor reconcile is done; current task is interface-and-adapter.`

### Version Lifecycle Rules

- `This version remains open until explicit closeout is recorded here.`
- `If active_queue = none, that does not close the version; it only returns the version to promotion-review or idle-open.`
- `As long as version_status = open, additional same-version queues may still be admitted.`
- `Queue closeout may auto-advance; version closeout must not be inferred from queue completion alone.`
- `Do not reopen target.script-editor-event-binding-post-closeout-fixups or target.script-editor-event-binding-runtime-replacement for this broader modularization work.`

### Queue Admission Startup Rules

1. `Read project-progress -> blueprint -> version plan -> active queue before touching a fresh queue item.`
2. `Check whether an active queue already exists.`
3. `If one exists, decide whether the new item can be absorbed without widening queue scope.`
4. `Classify the item before any queue creation or implementation.`
5. `If the item is queue-candidate, write review_subject_id / review_subject_classification / proposed_queue_id / review_basis / admission_status first.`
6. `Only after version-plan admission sync may a queue doc be created and activated.`
7. `Only after the admitted queue doc exposes queue_status=active plus a live active_task may implementation start.`
8. `User scope approval is boundary approval only; it does not replace admission.`
9. `When intake does not proceed directly into implementation, return the fixed operator receipt rather than a long Blueprint internal analysis dump.`

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

### Candidate Evidence Matrix

| Queue ID | Source Docs | Acceptance Refs | Implementation Anchors | Legacy Paths To Replace | Compatibility Paths To Preserve | Reject Or Split If |
| --- | --- | --- | --- | --- | --- | --- |
| `queue.map-review-provider-boundary-extraction-and-acceptance` | `docs/blueprints/version-memo.md MEMO-010; operator design discussion` | `ACC-MAP-REVIEW-PROVIDER-001..005` | `src/ui/views/map/map-view.ts; src/application/map/**; src/application/content/active-game-content.ts; src/application/navigation/campaign-map-exploration.ts; src/application/review/**; src/application/time/**; src/application/runtime/navigation-time-follow-up.ts; src/application/house-modules/**; tests/**` | `map UI direct CityDefinition/cityCoordinatesById marker assembly; scattered review lifecycle truth in house/time/navigation direct paths where provider policy should own it` | `house-specific review presentation copy; map exploration/fog behavior; city entry behavior; normal start, JSON import, and Script Editor preview entrypoints` | `evidence-anchor reconcile proves a prerequisite content-pack/schema queue is needed before provider cutover.` |

### Acceptance Coverage Ledger

| Acceptance ID | Primary Owner Queue | Proof Artifact | Status | Residue Or Blocker |
| --- | --- | --- | --- | --- |
| `ACC-MAP-REVIEW-PROVIDER-001` | `queue.map-review-provider-boundary-extraction-and-acceptance` | `pending` | `uncovered` | `none` |
| `ACC-MAP-REVIEW-PROVIDER-002` | `queue.map-review-provider-boundary-extraction-and-acceptance` | `pending` | `uncovered` | `none` |
| `ACC-MAP-REVIEW-PROVIDER-003` | `queue.map-review-provider-boundary-extraction-and-acceptance` | `pending` | `uncovered` | `none` |
| `ACC-MAP-REVIEW-PROVIDER-004` | `queue.map-review-provider-boundary-extraction-and-acceptance` | `pending` | `uncovered` | `none` |
| `ACC-MAP-REVIEW-PROVIDER-005` | `queue.map-review-provider-boundary-extraction-and-acceptance` | `pending` | `uncovered` | `none` |

### Progress Log

- `2026-07-18`: `Created target.map-review-provider-boundary-extraction after closing the Script Editor post-closeout fixup version. Admitted queue.map-review-provider-boundary-extraction-and-acceptance as the single active queue from MEMO-010 and the operator-approved four-step boundary extraction design. No business code implementation has started; the first active task is evidence-anchor reconcile.`
- `2026-07-18`: `Completed task.map-review-provider-boundary-extraction-and-acceptance.evidence-anchor-reconcile. Source review confirmed map-view still directly depends on CityDefinition and cityCoordinatesById, active-game-content still assembles cityCoordinatesById from city.mapNodeId and map nodes, review-cycle exists as a shared seam while council-priority, council-attendance, navigation-time-follow-up, and house modules remain active consumers, and tests already contain normal start / JSON import / runtime preview anchors. No prerequisite split is required before Step 1; active task is now interface-and-adapter.`
