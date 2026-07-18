# Script Editor Event Runtime Production Hardening Version Plan

## Control Block

- document_role: `version-governor`
- version_id: `target.script-editor-event-runtime-production-hardening`
- version_status: `open`
- active_phase: `phase.active-queue`
- active_queue: `queue.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration`
- decision_state: `active-execution`
- next_decision: `queue-closeout-or-return-to-version-review`
- next_action: `resume-active-queue`
- resume_gate: `open-active-queue`
- post_queue_closeout_pause_policy: `auto-continue`
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
- closure_review_subject: `none`
- closure_review_status: `none`
- residue_candidate_id: `none`
- residue_candidate_family: `none`
- routing_basis: `none`
- next_lawful_queue_recommendation: `none`
- auto_admission_ready: `false`
- blocked_by: []
- candidate_queue_ids:
  - `queue.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration`
- candidate_backlog_refresh_status: `fresh`
- candidate_backlog_snapshot:
  - `queue.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration`
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
  - `The operator asked to turn the event-runtime production-hardening draft into a Blueprint candidate and then continue by Blueprint rules.`
- Inherits from:
  - `target.script-editor-event-binding-runtime-replacement`
  - `target.script-editor-event-binding-post-closeout-fixups`
- Inheritance boundary:
  - `Both predecessor event-binding versions remain closed and must not be reopened. This successor owns only post-closeout production hardening, old-residue cleanup, Liu Bang pack migration, and real-flow acceptance.`
- Admission basis:
  - `Source audit confirmed the new EventBindingRuntime path is production-active, while old event condition evaluator code, Script Editor event-body triggerTiming/conditionGroups residues, loader acceptance gaps, and Liu Bang built-in events.json trigger/conditions remain to be cleaned or guarded.`
- Activation conclusion:
  - `target.script-editor-event-runtime-production-hardening is the active version.`
  - `queue.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration is admitted as the active queue.`
  - `The active task is evidence-anchor reconcile; business implementation has not started.`

### Version Lifecycle Rules

- `This version remains open until explicit closeout is recorded here.`
- `If active_queue = none, that does not close the version; it only returns the version to promotion-review or idle-open.`
- `Do not reopen target.script-editor-event-binding-runtime-replacement or target.script-editor-event-binding-post-closeout-fixups.`
- `Do not absorb map/review provider-boundary work into this event-runtime hardening version.`
- `Queue closeout may auto-advance; version closeout must not be inferred from queue completion alone.`

### Queue Admission Startup Rules

1. `Read project-progress -> blueprint -> version plan -> active queue before touching a fresh queue item.`
2. `Check whether an active queue already exists.`
3. `If an active queue exists, test whether the new item can be absorbed before considering a new queue.`
4. `If the new item cannot be absorbed, record it as a candidate or route it to a successor version; do not activate a second queue.`
5. `Return to version-level review only after the current active queue closes.`

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

### Candidate Recovery Ledger

| Candidate ID | Last Classification | Proposed Queue | Latest Disposition | Recheck Trigger | Notes |
| --- | --- | --- | --- | --- | --- |
| `item.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration` | `queue-candidate` | `queue.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration` | `admitted` | `only if evidence-anchor reconcile proves the queue must split before implementation` | `Admitted on 2026-07-18 after operator requested Blueprint continuation and the current map/review version classified the work as successor event-runtime hardening rather than same-version map/review scope.` |

### Queue Promotion Ledger

| Queue ID | Current Disposition | Promote When | Notes |
| --- | --- | --- | --- |
| `queue.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration` | `active` | `Already admitted as the first queue.` | `Owns source cleanup, Liu Bang pack migration, simulated-human Script Editor authoring, runtime effectiveness proof, and fail-closed guard review.` |

### Candidate Evidence Matrix

| Queue ID | Source Docs | Acceptance Refs | Implementation Anchors | Legacy Paths To Replace | Compatibility Paths To Preserve | Reject Or Split If |
| --- | --- | --- | --- | --- | --- | --- |
| `queue.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration` | `operator event-runtime cleanup draft; source audit on 2026-07-18; docs/script-editor-event-trigger-binding-design.md; predecessor closeout evidence` | `ACC-EVENT-RUNTIME-PRODUCTION-001..006` | `src/core/runtime/event-binding-runtime.ts; src/application/story/story-runtime.ts; src/application/events/condition-evaluator.ts; src/domain/event.ts; src/domain/script-editor-project.ts; src/application/script-editor/story-dialogue-event-authoring.ts; src/application/script-editor/runtime-pack-export.ts; src/application/scenario/scenario-pack-loader.ts; src/content/scenario-packs/liu-bang-pei-county-opening/**; src/ui/main-ui/main-ui-flow.js; tests/**; browser/manual Script Editor flow` | `old EventDefinition trigger/conditions residues; unused old event condition evaluator; script-editor event-body triggerTiming/conditionGroups daily authoring residue; built-in Liu Bang events.json trigger/conditions; loader acceptance of old event-body trigger/conditions` | `EventBindingRuntime semantics; event-bindings.json as trigger source; supported owner-local authoring surfaces; supported runtime entrypoints; fail-closed unsupported paths; Liu Bang scenario gameplay after migration` | `Evidence-anchor reconcile proves runtime entrypoint expansion is required before residue cleanup or Liu Bang migration can be validly tested.` |

### Acceptance Coverage Ledger

| Acceptance ID | Primary Owner Queue | Proof Artifact | Status | Residue Or Blocker |
| --- | --- | --- | --- | --- |
| `ACC-EVENT-RUNTIME-PRODUCTION-001` | `queue.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration` | `pending` | `uncovered` | `none` |
| `ACC-EVENT-RUNTIME-PRODUCTION-002` | `queue.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration` | `pending` | `uncovered` | `none` |
| `ACC-EVENT-RUNTIME-PRODUCTION-003` | `queue.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration` | `pending` | `uncovered` | `none` |
| `ACC-EVENT-RUNTIME-PRODUCTION-004` | `queue.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration` | `pending` | `uncovered` | `none` |
| `ACC-EVENT-RUNTIME-PRODUCTION-005` | `queue.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration` | `pending` | `uncovered` | `none` |
| `ACC-EVENT-RUNTIME-PRODUCTION-006` | `queue.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration` | `pending` | `uncovered` | `none` |

### Progress Log

- `2026-07-18`: `Created target.script-editor-event-runtime-production-hardening as a successor version after the operator requested Blueprint continuation of the event-runtime production-hardening candidate. Admitted queue.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration as the first active queue. Active task is evidence-anchor reconcile; no business implementation has started.`
- `2026-07-18`: `Completed task.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration.evidence-anchor-reconcile. Source review confirmed new production triggering routes through eventBindingsById, triggerStoryEvents, TriggerContext, and runEventBindingRuntime; old selectTriggeredEvents/trigger-evaluator/storyPack.runtimeEvents appear only in tests or historical docs; src/application/events/condition-evaluator.ts and EventCondition/EventConditionNode remain unused old condition-evaluator residue; Script Editor event-body conditionGroups helpers/tests remain as legacy residue; Liu Bang events.json still contains trigger/conditions and lacks event-bindings.json declaration; supported export/runtime trigger actions remain story-progress, city-enter, building-enter, and indoor-screen-shown with unsupported paths fail closed. Active task is now implementation; EventBindingRuntime semantics must be preserved.`
- `2026-07-18`: `Completed task.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration.implementation. TDD RED covered loader rejection of old event-body trigger/conditions, Liu Bang event-bindings migration, old condition evaluator source deletion, and Script Editor event-body conditionGroups retirement while preserving EventBinding.conditions. GREEN implementation removed the old evaluator/module residue, migrated Liu Bang trigger data to event-bindings.json, guarded scenario loading against old event-body trigger/conditions, and removed event-body conditionGroups authoring/UI residue without changing EventBindingRuntime semantics. Verification passed: focused robustness tests, npm run typecheck, npm run lint:blueprints, and npm test. Active task is now queue-closeout-and-handoff for guard review and simulated-human acceptance; version closeout is not entered.`
