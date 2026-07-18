# City Building Module Entry And Project Startup Authoring Version Plan

## Control Block

- document_role: `version-governor`
- version_id: `target.city-building-module-entry-and-project-startup-authoring`
- version_status: `open`
- active_phase: `phase.execution`
- active_queue: `queue.city-building-module-entry-and-project-startup-authoring`
- decision_state: `active-execution`
- next_decision: `queue-closeout-or-return-to-version-review`
- next_action: `resume-active-queue`
- resume_gate: `active-queue`
- post_queue_closeout_pause_policy: `auto-continue`
- promotion_review_result: `admitted`
- review_subject_id: `none`
- review_subject_classification: `none`
- proposed_queue_id: `none`
- review_basis: `none`
- admission_status: `none`
- intake_status: `candidate-recorded`
- intake_item_id: `item.city-building-module-entry-and-project-startup-authoring`
- intake_summary: `Promote Script Editor 项目信息 startup controls and separate CityModule/BuildingModule entry boundaries into an admitted queue.`
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
  - `queue.city-building-module-entry-and-project-startup-authoring`
- candidate_backlog_refresh_status: `fresh`
- candidate_backlog_snapshot:
  - `queue.city-building-module-entry-and-project-startup-authoring`
- candidate_backlog_scan_sources:
  - `project-progress`
  - `blueprint`
  - `previous version plan`
  - `candidate_queue_ids`
  - `Candidate Recovery Ledger`
  - `Queue Promotion Ledger`
  - `named queue docs`

## Human Context

### Activation Record

- Scope approval:
  - `The operator approved the requirement draft for Script Editor 项目信息 startup authoring, flexible map/city/building/scene starts, single-select 默认角色, and separate city/building modules.`
- Inherits from:
  - `target.script-editor-event-runtime-production-hardening`
  - `target.map-review-provider-boundary-extraction`
  - `target.city-building-definition-location-access-convergence`
- Inheritance boundary:
  - `Predecessor versions remain historical or separately open records. This successor owns only project startup authoring and city/building module entry convergence.`
- Admission basis:
  - `The current event-runtime hardening version has no active queue and the candidate is broader than event-runtime cleanup, so it is promoted into this successor version rather than being absorbed into the old queue.`
- Activation conclusion:
  - `target.city-building-module-entry-and-project-startup-authoring is the active version.`
  - `queue.city-building-module-entry-and-project-startup-authoring is admitted as the active queue.`
  - `The active task is project-info-authoring; business implementation has not started in that task.`

### Version Lifecycle Rules

- `This version remains open until explicit closeout is recorded here.`
- `If active_queue = none, that does not close the version; it only returns the version to promotion-review or idle-open.`
- `Do not reopen target.script-editor-event-binding-runtime-replacement, target.script-editor-event-binding-post-closeout-fixups, or target.city-building-definition-location-access-convergence.`
- `Do not change EventBindingRuntime semantics in this version.`
- `Do not absorb unrelated event-runtime cleanup or map/review cleanup unless a later admission review explicitly records that route.`

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
| `item.city-building-module-entry-and-project-startup-authoring` | `queue-candidate` | `queue.city-building-module-entry-and-project-startup-authoring` | `admitted` | `evidence-anchor reconcile proves the queue must split before implementation` | `Admitted on 2026-07-19 after the operator approved the requirement draft and asked to continue by Blueprint rules.` |

### Queue Promotion Ledger

| Queue ID | Current Disposition | Promote When | Notes |
| --- | --- | --- | --- |
| `queue.city-building-module-entry-and-project-startup-authoring` | `active` | `project-info-authoring is the active task.` | `Evidence-anchor reconcile confirmed implementation anchors and no prerequisite split.` |

### Candidate Evidence Matrix

| Queue ID | Source Docs | Acceptance Refs | Implementation Anchors | Legacy Paths To Replace | Compatibility Paths To Preserve | Reject Or Split If |
| --- | --- | --- | --- | --- | --- | --- |
| `queue.city-building-module-entry-and-project-startup-authoring` | `operator-approved draft on 2026-07-19; prior city/building definition convergence; map/review provider-boundary closeout evidence` | `ACC-CITY-BUILDING-STARTUP-001..005` | `src/application/script-editor/workspace-shell.ts; src/domain/script-editor-project.ts; src/application/script-editor/runtime-pack-export.ts; src/application/scenario/scenario-pack-loader.ts; startup coordinator; city runtime/presenter/view modules; building runtime/presenter/view modules; tests/**; browser simulated-human flow` | `fixed startup assumptions; project overview without top-bar return; direct city/building startup shortcuts; one-off main.ts branches if found` | `EventBindingRuntime semantics; map provider contract; review provider contract; city/building relations; existing city/building content and mounted building behavior` | `Evidence shows startup authoring, city module extraction, and building module extraction must be split into separate queues before implementation.` |

### Acceptance Coverage Ledger

| Acceptance ID | Primary Owner Queue | Proof Artifact | Status | Residue Or Blocker |
| --- | --- | --- | --- |
| `ACC-CITY-BUILDING-STARTUP-001` | `queue.city-building-module-entry-and-project-startup-authoring` | `pending` | `pending` | `none recorded` |
| `ACC-CITY-BUILDING-STARTUP-002` | `queue.city-building-module-entry-and-project-startup-authoring` | `pending` | `pending` | `none recorded` |
| `ACC-CITY-BUILDING-STARTUP-003` | `queue.city-building-module-entry-and-project-startup-authoring` | `pending` | `pending` | `none recorded` |
| `ACC-CITY-BUILDING-STARTUP-004` | `queue.city-building-module-entry-and-project-startup-authoring` | `pending` | `pending` | `none recorded` |
| `ACC-CITY-BUILDING-STARTUP-005` | `queue.city-building-module-entry-and-project-startup-authoring` | `pending` | `pending` | `none recorded` |

### Progress Log

- `2026-07-19`: `Created target.city-building-module-entry-and-project-startup-authoring as a successor version after pushing prior event-runtime/city-context work to origin/mod-first-dev. Admitted queue.city-building-module-entry-and-project-startup-authoring as the active queue from the operator-approved draft. Active task is evidence-anchor reconcile; no business implementation has started.`
- `2026-07-19`: `Completed task.city-building-module-entry-and-project-startup-authoring.evidence-anchor-reconcile. Source review confirmed Script Editor already has a project overview surface and scenarioProfile launchPolicy/initialLocation fields, but creator UI still exposes startup values mainly as text/system fields rather than 项目信息 selectors. ScenarioProfile supports characterSelection shell/fixed, initialView, playerCharacterId, mapId, cityId, houseId, and view; ViewName uses house for the runtime building view. Default role sourcing should filter ScriptEditorPersonRecord.personType == 角色. Normal start, JSON import, and runtime preview all route through scenario pack export/load/startup seams, while runtime preview uses current in-memory project export. Evidence found no prerequisite split before project-info-authoring; active task is now project-info-authoring.`
