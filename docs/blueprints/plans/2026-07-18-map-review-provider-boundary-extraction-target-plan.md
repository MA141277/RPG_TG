# Map Review Provider Boundary Extraction Version Plan

## Control Block

- document_role: `version-governor`
- version_id: `target.map-review-provider-boundary-extraction`
- version_status: `closed`
- active_phase: `phase.version-closed`
- active_queue: `none`
- decision_state: `closed`
- next_decision: `version-closeout`
- next_action: `write-version-closeout`
- resume_gate: `closed`
- post_queue_closeout_pause_policy: `auto-continue`
- promotion_review_result: `queue-closeout-complete`
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
- closure_review_subject: `target.map-review-provider-boundary-extraction`
- closure_review_status: `routed`
- residue_candidate_id: `none`
- residue_candidate_family: `none`
- routing_basis: `closed-after-explicit-operator-closeout-with-no-live-same-version-queue`
- next_lawful_queue_recommendation: `none`
- auto_admission_ready: `false`
- stop_reason: `none`
- stop_basis: `none`
- next_unblocked_action: `none`
- human_input_required: `false`
- blocked_by: []
- candidate_queue_ids:
  - `queue.map-review-provider-boundary-extraction-and-acceptance`
  - `queue.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration`
- candidate_backlog_refresh_status: `fresh`
- candidate_backlog_snapshot:
  - `queue.map-review-provider-boundary-extraction-and-acceptance`
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
  - `The operator refined and approved a four-step map/review boundary extraction: provider interface/adapters, consumer cutover with removal inventory, inventory-driven cleanup, and acceptance/guard testing with completeness review.`
- Admission basis:
  - `MEMO-010 and operator-approved design show map rendering still owns city coordinate/info assembly while review lifecycle remains partly distributed; one bounded queue can extract provider interfaces, migrate consumers, inventory residue, remove old paths, and verify complete behavior across normal start, JSON import, and Script Editor runtime preview.`
- Activation conclusion:
  - `target.map-review-provider-boundary-extraction is now closed historical evidence after explicit operator closeout on 2026-07-26.`
  - `queue.map-review-provider-boundary-extraction-and-acceptance is done with no active queue remaining in this version.`
  - `The later event-runtime production-hardening topic was routed onward into its own successor version instead of remaining same-version residue here.`

### Version Closeout Review

- `Closeout judgement: accepted. No active queue remains, the owned provider-boundary extraction queue is done, and no later uniquely lawful same-version admission remains inside this version after successor routing.`
- `Closeout confirmation: the operator explicitly requested closing this residual open version on 2026-07-26 during open-version residue cleanup.`
- `Future routing: any further map/review provider-boundary or related cleanup work must route through a lawful successor version rather than reopening this historical shell implicitly.`

### Version Lifecycle Rules

- `This version is closed and historical-only for execution purposes.`
- `If active_queue = none, that does not by itself close a version; explicit closeout was required and is now recorded here.`
- `As long as version_status = open, additional same-version queues may still be admitted; that rule no longer applies because this version is now closed.`
- `Queue closeout may auto-advance; version closeout still required explicit operator confirmation and is now recorded.`
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
| `queue.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration` | `operator event-runtime cleanup draft; source audit on 2026-07-18; docs/script-editor-event-trigger-binding-design.md; target.script-editor-event-binding-runtime-replacement closeout evidence` | `ACC-EVENT-RUNTIME-PRODUCTION-001..006` | `src/core/runtime/event-binding-runtime.ts; src/application/story/story-runtime.ts; src/application/events/condition-evaluator.ts; src/domain/event.ts; src/domain/script-editor-project.ts; src/application/script-editor/story-dialogue-event-authoring.ts; src/application/script-editor/runtime-pack-export.ts; src/application/scenario/scenario-pack-loader.ts; src/content/scenario-packs/liu-bang-pei-county-opening/**; src/ui/main-ui/main-ui-flow.js; tests/**; browser/manual Script Editor flow` | `old EventDefinition trigger/conditions residues; unused old event condition evaluator; script-editor event-body triggerTiming/conditionGroups daily authoring residue; built-in Liu Bang events.json trigger/conditions; loader acceptance of old event-body trigger/conditions` | `EventBindingRuntime semantics; event-bindings.json as trigger source; Script Editor owner-local event binding authoring for person/city/building/dialogue/minigame/story-node; supported runtime entrypoints and fail-closed unsupported paths; Liu Bang scenario gameplay after migration` | `This must not be absorbed into the map/review provider-boundary queue; if admitted before this version closes, it widens the current target and should be routed to a successor/fixup event-runtime hardening version instead.` |

### Acceptance Coverage Ledger

| Acceptance ID | Primary Owner Queue | Proof Artifact | Status | Residue Or Blocker |
| --- | --- | --- | --- | --- |
| `ACC-MAP-REVIEW-PROVIDER-001` | `queue.map-review-provider-boundary-extraction-and-acceptance` | `pending` | `uncovered` | `none` |
| `ACC-MAP-REVIEW-PROVIDER-002` | `queue.map-review-provider-boundary-extraction-and-acceptance` | `pending` | `uncovered` | `none` |
| `ACC-MAP-REVIEW-PROVIDER-003` | `queue.map-review-provider-boundary-extraction-and-acceptance` | `pending` | `uncovered` | `none` |
| `ACC-MAP-REVIEW-PROVIDER-004` | `queue.map-review-provider-boundary-extraction-and-acceptance` | `pending` | `uncovered` | `none` |
| `ACC-MAP-REVIEW-PROVIDER-005` | `queue.map-review-provider-boundary-extraction-and-acceptance` | `pending` | `uncovered` | `none` |
| `ACC-EVENT-RUNTIME-PRODUCTION-001` | `queue.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration` | `pending` | `candidate-uncovered` | `Source cleanup: production source no longer contains old selectTriggeredEvents/trigger-evaluator/storyPack.runtimeEvents paths, old condition-evaluator dead code is removed or explicitly reclassified, EventDefinition remains triggerless/conditionless, and events.json remains content-only.` |
| `ACC-EVENT-RUNTIME-PRODUCTION-002` | `queue.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration` | `pending` | `candidate-uncovered` | `Script Editor simulated-human authoring: person/city/building/dialogue/minigame/story-node owner-local event tabs can each create bindings, select event/trigger controls, configure conditions, survive trigger edits, save, and export event-bindings.json rather than events.json.` |
| `ACC-EVENT-RUNTIME-PRODUCTION-003` | `queue.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration` | `pending` | `candidate-uncovered` | `Runtime effectiveness: every runtime entrypoint claimed as supported by this queue has automated proof from Script Editor authoring through export, loader, TriggerContext, EventBindingRuntime, active event/scene handoff, and eventHistory; browser proof must distinguish UI success from actual runtime trigger proof.` |
| `ACC-EVENT-RUNTIME-PRODUCTION-004` | `queue.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration` | `pending` | `candidate-uncovered` | `Fail-closed boundary: unsupported owner/trigger/advanced condition paths are not counted as runtime support and either fail export/load with diagnostics or remain visibly non-runnable.` |
| `ACC-EVENT-RUNTIME-PRODUCTION-005` | `queue.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration` | `pending` | `candidate-uncovered` | `Liu Bang pack migration: liu-bang-pei-county-opening removes events.json trigger/conditions, adds event-bindings.json when a trigger is needed, declares eventBindings in pack.json, loads through runtime content, and remains playable through simulated-human normal/JSON flow.` |
| `ACC-EVENT-RUNTIME-PRODUCTION-006` | `queue.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration` | `pending` | `candidate-uncovered` | `Full real-flow acceptance: at least one browser-backed Script Editor flow configures entering a city to open a dialogue, runs through the unified game entry flow, enters the city, and observes the dialogue/event trigger result; Liu Bang-specific flow must also be manually or browser simulated after migration.` |

### Candidate Backlog Refresh Rule

- `After an execution queue closes or candidate routing changes, refresh candidate truth before answering whether more same-version candidate queues remain.`
- `Read project-progress -> blueprint -> current version plan -> candidate_queue_ids -> Candidate Recovery Ledger -> Queue Promotion Ledger -> named queue docs.`
- `Use docs/change-log.md only when structured governance docs are insufficient or explicitly cited by the current version plan.`
- `Do not answer none unless candidate_backlog_refresh_status=fresh and candidate_backlog_snapshot is empty.`
- `If candidate truth is stale, missing, or inconsistent, refresh or reconcile it rather than answering with prose.`

### Explicit Operator-Directed Closure Or Suspension

- `If the operator explicitly requests suspending this version, keep version_status=open, write stop_reason=operator-requested-suspend with stop_basis plus next_unblocked_action, and set human_input_required=false in the Control Block.`
- `If the operator explicitly requests closing this version before closeout truth is actually satisfied, do not counterfeit done; reconcile residue/candidate truth first and use archived only when the version is being intentionally retired rather than completed.`
- `If the operator explicitly requests suspending the current execution queue, set active_queue=none here, synchronize the queue doc to queue_status=suspended, and record the lawful resume action in this plan.`
- `If the operator explicitly requests dropping a current or candidate queue, route it as dropped/rejected in governance truth rather than leaving that instruction as prose only.`

### Progress Log

- `2026-07-18`: `Created target.map-review-provider-boundary-extraction after closing the Script Editor post-closeout fixup version. Admitted queue.map-review-provider-boundary-extraction-and-acceptance as the single active queue from MEMO-010 and the operator-approved four-step boundary extraction design. No business code implementation has started; the first active task is evidence-anchor reconcile.`
- `2026-07-18`: `Completed task.map-review-provider-boundary-extraction-and-acceptance.evidence-anchor-reconcile. Source review confirmed map-view still directly depends on CityDefinition and cityCoordinatesById, active-game-content still assembles cityCoordinatesById from city.mapNodeId and map nodes, review-cycle exists as a shared seam while council-priority, council-attendance, navigation-time-follow-up, and house modules remain active consumers, and tests already contain normal start / JSON import / runtime preview anchors. No prerequisite split is required before Step 1; active task is now interface-and-adapter.`
- `2026-07-18`: `Completed task.map-review-provider-boundary-extraction-and-acceptance.interface-and-adapter. Added map location provider and review cycle policy adapters with tests proving marker-ready city location output and shared review schedule policy behavior without moving house presentation copy. Active queue advances to consumer-cutover-and-inventory; removal inventory and consumer migration have not started.`
- `2026-07-18`: `Completed task.map-review-provider-boundary-extraction-and-acceptance.consumer-cutover-and-inventory. Map rendering now consumes MapLocationProvider outputs, map stage output no longer carries CityDefinition[] for rendering, runtime review follow-up/coordinator paths consume defaultReviewCyclePolicy, and docs/refactor/map-review-boundary-removal-inventory.md records remaining direct paths. Active queue advances to residue-removal.`
- `2026-07-18`: `Completed task.map-review-provider-boundary-extraction-and-acceptance.residue-removal. Startup coordinate fallback now uses mapLocationProvider.getCityLocation, house/story review consumers route schedule/countdown/insufficient-time reads and writes through defaultReviewCyclePolicy, low-level council-date primitives are classified as provider internals or core threshold primitives, and source guards cover the removed direct paths. Active queue advances to acceptance-and-guard.`
- `2026-07-18`: `Completed task.map-review-provider-boundary-extraction-and-acceptance.acceptance-and-guard and queue closeout/handoff. Source guards now cover provider-backed map startup/rendering, ReviewCyclePolicy consumer routing, and normal JSON / Script Editor preview entrypoint seams; full verification passed with npm run typecheck, npm run lint:blueprints, and npm test. Active queue is now none; version remains open pending separate closeout review.`
- `2026-07-18`: `Recorded queue.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration as a candidate queue from the operator's event-runtime production hardening draft. Classification is queue-candidate/future-target-candidate relative to the current map/review provider-boundary version: the work is required for event-runtime production cleanup and Liu Bang pack migration, but it must not be absorbed into the closed map/review queue or into the closed target.script-editor-event-binding-runtime-replacement. Acceptance requires source cleanup, Script Editor simulated-human authoring across person/city/building/dialogue/minigame/story-node owner-local event tabs, runtime effectiveness proof through EventBindingRuntime, fail-closed unsupported paths, Liu Bang pack format migration, and browser-backed playable validation. No admission, implementation, version closeout, commit, push, or merge was performed.`
- `2026-07-18`: `Routed queue.script-editor-event-runtime-production-hardening-and-liu-bang-pack-migration to successor target.script-editor-event-runtime-production-hardening after the operator requested Blueprint continuation. The map/review version was not expanded and remains open with no active queue; project-progress and blueprint now point to the successor event-runtime hardening version.`
