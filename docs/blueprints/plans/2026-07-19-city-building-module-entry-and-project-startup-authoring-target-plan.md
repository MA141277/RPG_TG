# City Building Module Entry And Project Startup Authoring Version Plan

## Control Block

- document_role: `version-governor`
- version_id: `target.city-building-module-entry-and-project-startup-authoring`
- version_status: `open`
- active_phase: `phase.execution`
- active_queue: `queue.script-editor-city-building-secondary-list-and-selector-ux-unification`
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
  - `queue.city-building-module-entry-and-project-startup-authoring`
  - `queue.script-editor-city-building-enter-state-and-preview-boundary`
  - `queue.script-editor-city-building-secondary-list-and-selector-ux-unification`
  - `queue.script-editor-ui-encoding-integrity-guard`
- candidate_backlog_refresh_status: `fresh`
- candidate_backlog_snapshot:
  - `queue.city-building-module-entry-and-project-startup-authoring`
  - `queue.script-editor-city-building-enter-state-and-preview-boundary`
  - `queue.script-editor-city-building-secondary-list-and-selector-ux-unification`
  - `queue.script-editor-ui-encoding-integrity-guard`
- candidate_backlog_scan_sources:
  - `project-progress`
  - `blueprint`
  - `version-memo`
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
  - `queue.script-editor-city-building-enter-state-and-preview-boundary is closed after queue closeout/handoff.`
  - `queue.script-editor-city-building-secondary-list-and-selector-ux-unification is admitted as the active queue.`
  - `The active task is task.script-editor-city-building-secondary-list-and-selector-ux-unification.queue-closeout-and-handoff after implementation finished; queue closeout has not been executed yet.`

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

| Candidate ID | Last Classification | Proposed Queue | Latest Disposition | Recheck Trigger | Acceptance Refs | Implementation Anchors | Can Claim | Cannot Claim | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `item.city-building-module-entry-and-project-startup-authoring` | `queue-candidate` | `queue.city-building-module-entry-and-project-startup-authoring` | `admitted` | `evidence-anchor reconcile proves the queue must split before implementation` | `ACC-CITY-BUILDING-STARTUP-001..005` | `src/application/script-editor/workspace-shell.ts; src/domain/script-editor-project.ts; src/application/script-editor/runtime-pack-export.ts; src/application/scenario/scenario-pack-loader.ts; startup coordinator; city runtime/presenter/view modules; building runtime/presenter/view modules; tests/**; browser simulated-human flow` | `ACC-CITY-BUILDING-STARTUP-001..005` | `none` | `Admitted on 2026-07-19 after the operator approved the requirement draft and asked to continue by Blueprint rules.` |
| `item.script-editor-city-building-enter-state-and-preview-boundary` | `future-target-candidate` | `queue.script-editor-city-building-enter-state-and-preview-boundary` | `recorded-only` | `if later evidence shows enter-state authoring and runtime preview framing should split further` | `ACC-CITY-BUILDING-ENTER-STATE-001..005` | `src/ui/main-ui/main-ui-flow.js; src/ui/views/script-editor/**; src/application/script-editor/**; src/application/location-access/**; src/application/city/**; src/application/building/**; tests/**; browser simulated-human flow` | `city/building enter-state editing; base info default background; locationAccess-backed gate editing; preview-only green frame` | `secondary list/search/add/delete/pagination shells; detail-page selector normalization` | `Split from MEMO-013 after the broad draft proved too wide for one lawful queue boundary.` |
| `item.script-editor-city-building-secondary-list-and-selector-ux-unification` | `future-target-candidate` | `queue.script-editor-city-building-secondary-list-and-selector-ux-unification` | `admitted` | `evidence-anchor reconcile proves the queue must split into list-shell and selector queues before implementation` | `ACC-CITY-BUILDING-ENTER-STATE-006..008` | `src/ui/main-ui/main-ui-flow.js; src/ui/views/script-editor/**; src/application/script-editor/**; tests/**; browser simulated-human flow` | `city/building/story/dialogue/event/playable/text secondary list/search/add/delete/list/pagination shells; detail-page selector UX normalization` | `enter-state authoring; locationAccess gate editing; preview-only frame` | `Admitted on 2026-07-19 after queue.script-editor-city-building-enter-state-and-preview-boundary closed and the version still had pending ACC-006..008 coverage.` |
| `item.script-editor-ui-encoding-integrity-guard` | `future-target-candidate` | `queue.script-editor-ui-encoding-integrity-guard` | `recorded-only` | `if critical script-editor or main-ui source files again show mojibake, invalid JS syntax from encoding damage, or browser smoke finds Chinese UI text corruption` | `ACC-ENCODING-GUARD-001..005` | `src/ui/main-ui/main-ui-flow.js; src/ui/views/script-editor/script-editor-workspace-view.ts; tests/robustness.test.cjs; browser simulated-human flow` | `ACC-ENCODING-GUARD-001..005` | `repo-wide feature redesign; unrelated gameplay/runtime work` | `Recorded from the operator's requirement to prevent future encoding corruption in critical Script Editor/UI sources and to require real browser evidence for Chinese UI surfaces.` |

### Queue Promotion Ledger

| Queue ID | Current Disposition | Promote When | Notes |
| --- | --- | --- | --- |
| `queue.city-building-module-entry-and-project-startup-authoring` | `done` | `acceptance-and-guard is complete.` | `Evidence-anchor reconcile, project-info-authoring, city-building-module-entry, runtime-startup-convergence, and acceptance-and-guard are complete; the queue is closed and the version remains open for later candidate review.` |
| `queue.script-editor-city-building-enter-state-and-preview-boundary` | `done` | `closed` | `Closed on 2026-07-19 after source guard, automated verification, and partial simulated-human browser proof. Runtime preview green-frame browser proof is recorded as inconclusive rather than claimed.` |
| `queue.script-editor-city-building-secondary-list-and-selector-ux-unification` | `active` | `queue-closeout-and-handoff completes` | `Implementation completed on 2026-07-19; active task is queue-closeout-and-handoff and version closeout remains separate.` |
| `queue.script-editor-ui-encoding-integrity-guard` | `recorded-only` | `version review confirms the source-encoding guard and mojibake-prevention slice is still a lawful same-version candidate` | `Keeps critical UI source-text integrity checks, browser smoke coverage, and encoding-corruption failure guards together as one bounded candidate.` |

### Candidate Evidence Matrix

| Queue ID | Source Docs | Acceptance Refs | Implementation Anchors | Legacy Paths To Replace | Compatibility Paths To Preserve | Reject Or Split If |
| --- | --- | --- | --- | --- | --- | --- |
| `queue.city-building-module-entry-and-project-startup-authoring` | `operator-approved draft on 2026-07-19; prior city/building definition convergence; map/review provider-boundary closeout evidence` | `ACC-CITY-BUILDING-STARTUP-001..005` | `src/application/script-editor/workspace-shell.ts; src/domain/script-editor-project.ts; src/application/script-editor/runtime-pack-export.ts; src/application/scenario/scenario-pack-loader.ts; startup coordinator; city runtime/presenter/view modules; building runtime/presenter/view modules; tests/**; browser simulated-human flow` | `fixed startup assumptions; project overview without top-bar return; direct city/building startup shortcuts; one-off main.ts branches if found` | `EventBindingRuntime semantics; map provider contract; review provider contract; city/building relations; existing city/building content and mounted building behavior` | `Evidence shows startup authoring, city module extraction, and building module extraction must be split into separate queues before implementation.` |
| `queue.script-editor-city-building-enter-state-and-preview-boundary` | `MEMO-013 on 2026-07-19; split from broad city/building enter-state and list/search draft` | `ACC-CITY-BUILDING-ENTER-STATE-001..005` | `src/ui/main-ui/main-ui-flow.js; src/ui/views/script-editor/**; src/application/script-editor/**; src/application/location-access/**; src/application/city/**; src/application/building/**; tests/**; browser simulated-human flow` | `hardcoded enter-state tabs without editable controls; default-background text fields without structured base-info support; locationAccess gate authoring without aligned runtime meaning; preview-only framing without a runtime boundary` | `CityModule/BuildingModule entry contracts; scenario-pack export/load/startup semantics; EventBindingRuntime semantics; existing city/building relations; existing map/review provider contracts` | `Split if preview-only framing proves narrower than enter-state authoring or if list/selector UX must be handled separately.` |
| `queue.script-editor-city-building-secondary-list-and-selector-ux-unification` | `MEMO-013 on 2026-07-19; split from broad city/building enter-state and list/search draft` | `ACC-CITY-BUILDING-ENTER-STATE-006..008` | `src/ui/main-ui/main-ui-flow.js; src/ui/views/script-editor/**; src/application/script-editor/**; tests/**; browser simulated-human flow` | `fragmented list/search/add/delete/pagination shells; ad hoc selector UX on detail pages` | `city/building enter-state authoring; locationAccess gate authoring; preview-only runtime frame` | `Split if selector UX still needs a different boundary from the secondary list shells.` |
| `queue.script-editor-ui-encoding-integrity-guard` | `operator draft on 2026-07-19; observed mojibake and encoding-corruption fallout in critical Script Editor and main UI source files` | `ACC-ENCODING-GUARD-001..005` | `src/ui/main-ui/main-ui-flow.js; src/ui/views/script-editor/script-editor-workspace-view.ts; tests/robustness.test.cjs; browser simulated-human flow` | `mojibake-corrupted UI strings; encoding-breakable write paths; test suites that only pass logic without checking rendered Chinese text` | `normal Chinese UI rendering; Script Editor navigation; existing robustness tests; existing browser smoke paths` | `Split if the guard must widen into a repo-wide charset migration or a separate editor encoding tool.` |

### Acceptance Coverage Ledger

| Acceptance ID | Primary Owner Queue | Proof Artifact | Status | Residue Or Blocker |
| --- | --- | --- | --- |
| `ACC-CITY-BUILDING-STARTUP-001` | `queue.city-building-module-entry-and-project-startup-authoring` | `pending` | `pending` | `none recorded` |
| `ACC-CITY-BUILDING-STARTUP-002` | `queue.city-building-module-entry-and-project-startup-authoring` | `pending` | `pending` | `none recorded` |
| `ACC-CITY-BUILDING-STARTUP-003` | `queue.city-building-module-entry-and-project-startup-authoring` | `pending` | `pending` | `none recorded` |
| `ACC-CITY-BUILDING-STARTUP-004` | `queue.city-building-module-entry-and-project-startup-authoring` | `pending` | `pending` | `none recorded` |
| `ACC-CITY-BUILDING-STARTUP-005` | `queue.city-building-module-entry-and-project-startup-authoring` | `pending` | `pending` | `none recorded` |
| `ACC-CITY-BUILDING-ENTER-STATE-001` | `queue.script-editor-city-building-enter-state-and-preview-boundary` | `source guard + browser city/building 进入条件 proof` | `covered` | `none recorded` |
| `ACC-CITY-BUILDING-ENTER-STATE-002` | `queue.script-editor-city-building-enter-state-and-preview-boundary` | `source guard + runtime export/import tests` | `covered` | `none recorded` |
| `ACC-CITY-BUILDING-ENTER-STATE-003` | `queue.script-editor-city-building-enter-state-and-preview-boundary` | `source guard + condition picker browser proof + export tests` | `covered` | `none recorded` |
| `ACC-CITY-BUILDING-ENTER-STATE-004` | `queue.script-editor-city-building-enter-state-and-preview-boundary` | `source guard + automated style/source tests` | `covered-with-browser-proof-inconclusive` | `runtime preview green-frame browser proof was not claimed because browser automation stale-tab recovery did not complete` |
| `ACC-CITY-BUILDING-ENTER-STATE-005` | `queue.script-editor-city-building-enter-state-and-preview-boundary` | `source guard + runtime preview source-path tests` | `covered-with-browser-proof-inconclusive` | `full normal/json/preview simulated-human green-frame run remains a later acceptance concern if required` |
| `ACC-CITY-BUILDING-ENTER-STATE-006` | `queue.script-editor-city-building-secondary-list-and-selector-ux-unification` | `pending` | `pending` | `none recorded` |
| `ACC-CITY-BUILDING-ENTER-STATE-007` | `queue.script-editor-city-building-secondary-list-and-selector-ux-unification` | `pending` | `pending` | `none recorded` |
| `ACC-CITY-BUILDING-ENTER-STATE-008` | `queue.script-editor-city-building-secondary-list-and-selector-ux-unification` | `pending` | `pending` | `none recorded` |

### Progress Log

- `2026-07-19`: `Created target.city-building-module-entry-and-project-startup-authoring as a successor version after pushing prior event-runtime/city-context work to origin/mod-first-dev. The active queue is now queue.script-editor-city-building-enter-state-and-preview-boundary from the operator-approved split draft, the evidence lock has been recorded, and the active task is implementation.`
- `2026-07-19`: `Completed task.city-building-module-entry-and-project-startup-authoring.evidence-anchor-reconcile. Source review confirmed Script Editor already has a project overview surface and scenarioProfile launchPolicy/initialLocation fields, but creator UI still exposes startup values mainly as text/system fields rather than 项目信息 selectors. ScenarioProfile supports characterSelection shell/fixed, initialView, playerCharacterId, mapId, cityId, houseId, and view; ViewName uses house for the runtime building view. Default role sourcing should filter ScriptEditorPersonRecord.personType == 角色. Normal start, JSON import, and runtime preview all route through scenario pack export/load/startup seams, while runtime preview uses current in-memory project export. Evidence found no prerequisite split before project-info-authoring; active task is now project-info-authoring.`
- `2026-07-19`: `Completed task.city-building-module-entry-and-project-startup-authoring.project-info-authoring. RED covered the 项目信息 toolbar entry, project-backed startup selectors, default role filtering from personType == 角色, and the initialView selector writing both launchPolicy.initialView and initialLocation.view for runtime export compatibility. GREEN added the 项目信息 action, selector-backed project overview startup controls, and multi-field startup mapping. Verification passed: focused robustness test, npm run typecheck, npm run lint:blueprints, and npm test. Active task is now city-building-module-entry.`
- `2026-07-19`: `Completed task.city-building-module-entry-and-project-startup-authoring.city-building-module-entry. RED required separate city and building entry/render seams. GREEN added application/city/city-module-entry.ts, application/building/building-module-entry.ts, ui/views/city/city-module-view.ts, and ui/views/building/building-module-view.ts, then routed stage-presenters and app-render through them while preserving existing city, city-underlay, and house-module behavior. Verification passed: focused robustness tests, npm run typecheck, npm run lint:blueprints, and npm test. Active task is now runtime-startup-convergence.`
- `2026-07-19`: `Completed task.city-building-module-entry-and-project-startup-authoring.runtime-startup-convergence. RED covered scenario profile export/loader preservation for concrete scene startup targets and shared startup target resolution for direct map, city, house, and scene starts. GREEN added application/startup/scenario-startup-target.ts, preserved optional initialLocation.sceneId through runtime export and scenario loader validation, and routed main.ts scenario app-state creation through the shared resolver. Verification passed: focused tests, npm run typecheck, npm run lint:blueprints, and npm test. Active task is now acceptance-and-guard.`
- `2026-07-19`: `Completed task.city-building-module-entry-and-project-startup-authoring.acceptance-and-guard and synchronized queue closeout. Source guards and simulated-human acceptance passed for the supported startup controls and module entry seams, the queue is done, and the version remains open for later candidate review rather than version closeout.`
- `2026-07-19`: `Recorded MEMO-013 as the future-target candidate queue.script-editor-city-building-enter-state-and-list-selector-unification. The draft spans city/building enter-state authoring, locationAccess-backed gate editing, preview-only runtime framing, and shared list/selector UX across several editor families, so it remains recorded-only until the boundary is narrowed or explicitly admitted.`
- `2026-07-19`: `Split MEMO-013 into two narrower future-target candidates: queue.script-editor-city-building-enter-state-and-preview-boundary and queue.script-editor-city-building-secondary-list-and-selector-ux-unification. The first keeps enter-state authoring, default background, locationAccess-backed gates, and preview framing together; the second keeps the shared secondary list and selector UX normalization together.`
- `2026-07-19`: `Recorded queue.script-editor-ui-encoding-integrity-guard as a new future-target candidate from the operator's draft about preventing future mojibake/encoding corruption in Script Editor and main UI sources. The candidate is recorded-only for now; later admission would need source-text integrity guards and browser smoke proof around rendered Chinese UI surfaces.`
- `2026-07-19`: `Completed task.script-editor-city-building-enter-state-and-preview-boundary.implementation. RED covered the location access picker contract and empty condition export. GREEN added a dedicated location-access authoring registry, text-backed refusal prompt selection, empty condition collapse, runtime blockedMessage resolution, the 进入条件 tab label, and picker add/remove/clear controls while preserving EventBindingRuntime semantics. Verification passed: focused tests, npm run typecheck, npm run lint:blueprints, npm test, and npm run build. Browser proof entered the Script Editor template workspace; explicit city/building tab and preview green-frame clickthrough remains for the active queue-closeout guard.`
- `2026-07-19`: `Completed task.script-editor-city-building-enter-state-and-preview-boundary.queue-closeout-and-handoff. Source guard and automated verification passed; simulated-human browser proof verified Script Editor template load and city/building 进入条件 authoring controls. Runtime preview green-frame browser proof remains recorded as inconclusive due stale browser automation session and is not claimed as passed. The queue is closed, active_queue is none, and the version remains open for same-version candidate review rather than version closeout.`
- `2026-07-19`: `Promotion/admission review admitted queue.script-editor-city-building-secondary-list-and-selector-ux-unification as the new active queue because ACC-CITY-BUILDING-ENTER-STATE-006..008 remain pending after the enter-state queue closed. The first active task is evidence-anchor-reconcile; implementation has not started.`
- `2026-07-19`: `Completed task.script-editor-city-building-secondary-list-and-selector-ux-unification.evidence-anchor-reconcile. Source review found people already has search/add/delete/list/pagination; city, building, story node, dialogue, event, minigame, and text have add/delete/list/pagination but lack the people-style search control. Detail selectors also remain inconsistent where project-backed selectors should replace ad hoc ids. The active task is now implementation.`
- `2026-07-19`: `Completed task.script-editor-city-building-secondary-list-and-selector-ux-unification.implementation. RED covered all-family secondary search controls, project-backed selector replacement, and the browser-discovered add-record/search interaction. GREEN added shared search/filtering, project-backed selects for city/building/menu entry selectors, targetId stale clearing, and add-record search reset. Verification passed: focused tests, npm run typecheck, npm run lint:blueprints, and npm test. Browser simulated-human evidence covered all eight secondary family surfaces and selector replacement checks; browser keyboard-control search clearing remained inconclusive because automation key events did not change the focused input value. Active task is now queue-closeout-and-handoff.`
