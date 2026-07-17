# Script Editor Event Binding Runtime Replacement Version Plan

## Control Block

- document_role: `version-governor`
- version_id: `target.script-editor-event-binding-runtime-replacement`
- version_status: `done`
- active_phase: `phase.version-closed`
- active_queue: `none`
- decision_state: `closed`
- next_decision: `version-closeout`
- next_action: `write-version-closeout`
- resume_gate: `closed-version-record`
- post_queue_closeout_pause_policy: `pause-when-explicitly-requested`
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
- closure_review_subject: `target.script-editor-event-binding-runtime-replacement`
- closure_review_status: `routed`
- residue_candidate_id: `none`
- residue_candidate_family: `none`
- routing_basis: `final-closeout-no-residue`
- next_lawful_queue_recommendation: `none`
- auto_admission_ready: `false`
- blocked_by: []
- candidate_queue_ids:
  - `queue.script-editor-event-binding-contract-loader`
  - `queue.script-editor-event-binding-authoring-ui`
  - `queue.script-editor-event-binding-export-convergence`
  - `queue.zhuyuanzhang-event-binding-pack-migration`
  - `queue.event-binding-runtime-convergence`
  - `queue.old-event-runtime-retirement`
  - `queue.script-editor-event-binding-authoring-ui-completion`
  - `queue.script-editor-event-binding-condition-editor-completion`
  - `queue.event-binding-condition-export-lowering`
  - `queue.event-binding-trigger-context-entrypoint-completion`
  - `queue.script-editor-event-binding-owner-local-authoring-surfaces`
  - `queue.script-editor-event-body-trigger-field-retirement`

## Human Context

### Activation Record

- Scope approval:
  - `The operator requested a Blueprint-governed version based on docs/script-editor-event-trigger-binding-design.md after approving the double-table event model.`
- Activation basis:
  - `target.city-building-definition-location-access-convergence is closed with version_status=done, active_queue=none, and no lawful same-version candidate queue remaining.`
  - `The event design document now records the double-table split, EventBinding field layering, editor double-table UI requirement, built-in zhuyuanzhang migration timing, and the ordered cutover sequence.`
  - `Current code evidence still shows EventDefinition.trigger/conditions and selectTriggeredEvents-style scanning in the runtime path, proving a successor replacement version is required before queue execution.`
- Activation conclusion:
- `target.script-editor-event-binding-runtime-replacement is now the open successor version.`
- `queue.script-editor-event-binding-contract-loader is admitted as the first active queue because no active queue existed and the double-table contract/loader baseline is the required prerequisite for all later editor, export, built-in pack, runtime, and retirement queues.`

### Version Lifecycle Rules

- `This version remains open until explicit closeout is recorded here.`
- `If active_queue = none, the version is idle-open, not done.`
- `A queue may be admitted only after version-plan admission fields are synchronized and the queue doc exists with queue_status=active plus a live active_task.`
- `Old event runtime deletion is forbidden until double-table editor, loader, export, built-in pack, and EventBindingRuntime verification are recorded as passing.`
- `Queue closeout may auto-advance when one lawful continuation exists.`

### Post-Queue Closeout Pause Policy

- `post_queue_closeout_pause_policy = pause-when-explicitly-requested is active because the operator explicitly requested the current queue to pause after completion.`
- `When the policy is auto-continue, completing a queue must not create a default "whether to continue" question.`
- `After the current queue closeout is complete, pause before admitting or executing the next queue even if the next legal action is unique.`
- `If the operator explicitly requests queue-completion pauses, write post_queue_closeout_pause_policy = pause-when-explicitly-requested in this version plan.`
- `This policy does not remove required human confirmation for version_status open -> done, real blockers, or genuinely multiple mutually exclusive legal branches.`

### Candidate Recovery Ledger

| Candidate ID | Last Classification | Proposed Queue | Latest Disposition | Recheck Trigger | Notes |
| --- | --- | --- | --- | --- | --- |
| `item.script-editor-event-binding-contract-loader` | `queue-candidate` | `queue.script-editor-event-binding-contract-loader` | `admitted` | `close active queue before rechecking later candidates` | `Admitted on 2026-07-16 after source evidence confirmed EventDefinition still owns trigger/conditions, pack manifests require files.events but not files.eventBindings, runtime export writes event trigger data into events.json, and selectTriggeredEvents still scans events[].trigger/conditions.` |
| `item.script-editor-event-binding-authoring-ui` | `queue-candidate` | `queue.script-editor-event-binding-authoring-ui` | `closed` | `none` | `Closed on 2026-07-16 after project-level eventBindings save/load, authoring helpers, and selected-event binding UI visibility landed and verified.` |
| `item.script-editor-event-binding-export-convergence` | `queue-candidate` | `queue.script-editor-event-binding-export-convergence` | `closed` | `none` | `Closed on 2026-07-16 after runtime-pack export wrote triggerless events.json plus event-bindings.json and fail-closed unsupported binding validation landed and verified.` |
| `item.zhuyuanzhang-event-binding-pack-migration` | `queue-candidate` | `queue.zhuyuanzhang-event-binding-pack-migration` | `closed` | `none` | `Closed on 2026-07-16 after the built-in zhuyuanzhang pack gained event-bindings.json, triggerless events.json, default content exposure, and focused/typecheck/Blueprint verification.` |
| `item.event-binding-runtime-convergence` | `queue-candidate` | `queue.event-binding-runtime-convergence` | `closed` | `none` | `Closed on 2026-07-16 after EventBindingRuntime selector baseline, TriggerContext story adapter cutover, focused handoff tests, typecheck, Blueprint lint, and full npm test passed.` |
| `item.old-event-runtime-retirement` | `queue-candidate` | `queue.old-event-runtime-retirement` | `closed` | `only if fresh evidence proves old runtime trigger scanning regressed` | `Closed on 2026-07-17 after old events[].trigger/conditions scanning, old evaluator paths, and compatibility shims were deleted or guarded; focused guard tests, typecheck, Blueprint lint, full npm test, and old-path source search passed.` |
| `item.script-editor-event-binding-authoring-ui-completion` | `queue-candidate` | `queue.script-editor-event-binding-authoring-ui-completion` | `closed` | `only if fresh evidence proves event binding authoring UI completion regressed` | `Closed on 2026-07-17 after creator-facing eventBinding create/delete/edit controls, basic EventBinding.conditions operator plus flag/variable item editing, runtime-pack import projection into project.eventBindings, and project-save preservation in event-bindings.json landed and passed focused tests, typecheck, Blueprint lint, and full npm test.` |
| `item.script-editor-event-binding-owner-local-authoring-surfaces` | `queue-candidate` | `queue.script-editor-event-binding-owner-local-authoring-surfaces` | `closed` | `none` | `Closed on 2026-07-17 after guard review and queue closeout confirmed event detail pages no longer expose conditionGroups editing or direct binding trigger/condition editing, dedicated eventBindings authoring owns project.eventBindings edits, and owner-local person/city/building/dialogue/minigame/story panels write project.eventBindings.` |
| `item.script-editor-event-binding-condition-editor-completion` | `queue-candidate` | `queue.script-editor-event-binding-condition-editor-completion` | `closed` | `none` | `Closed on 2026-07-17 after cascading condition editor, owner-local event-tab integration, project.events-backed event selector, owner-family trigger selector, ConditionFieldOption registry coverage, Chinese labels, and advanced authoring-save fail-closed boundaries landed and passed guard review.` |
| `item.event-binding-condition-export-lowering` | `queue-candidate` | `queue.event-binding-condition-export-lowering` | `closed` | `none` | `Closed on 2026-07-17 after basic flag/variable EventBinding.conditions export lowering landed. Runtime-pack export converts authoring shape to runtime shape in event-bindings.json, keeps EventDefinition.conditions out of events.json, and preserves fail-closed diagnostics for unsupported advanced/resolver/custom conditions.` |
| `item.event-binding-trigger-context-entrypoint-completion` | `queue-candidate` | `queue.event-binding-trigger-context-entrypoint-completion` | `closed` | `only if fresh evidence proves unsupported entrypoints export runnable bindings again` | `Closed on 2026-07-17 after TriggerContext entrypoint audit and export fail-closed guards landed. dialogue/menu/minigame owners and dialogue-finished/menu-select/minigame-finished actions are not implemented runtime entrypoints and now fail closed before export; indoor-screen-shown remains exportable and runnable through the existing indoor-screen follow-up entrypoint.` |
| `item.script-editor-event-body-trigger-field-retirement` | `queue-candidate` | `queue.script-editor-event-body-trigger-field-retirement` | `closed` | `none` | `Closed on 2026-07-17 after event-body triggerTiming authoring was retired, updateScriptEditorEventField stopped accepting triggerTiming as a daily author edit, EventBinding.trigger authoring selectors were preserved, conditionGroups was confirmed as legacy/non-runtime residue only, and Blueprint lint passed.` |

### Queue Promotion Ledger

| Queue ID | Current Disposition | Promote When | Notes |
| --- | --- | --- | --- |
| `queue.script-editor-event-binding-contract-loader` | `done-open-residue` | `Closed after implementation and verification on 2026-07-16.` | `EventBinding contracts, eventBindings manifest hydration, active-content storage, and default runtime content exposure landed; EventDefinition.trigger, EventDefinition.conditions, and selectTriggeredEvents remain production runtime dependencies for later queues.` |
| `queue.script-editor-event-binding-authoring-ui` | `done-open-residue` | `Closed after implementation and verification on 2026-07-16.` | `Script-editor project data now represents event bodies and project-level eventBindings separately; runtime export/import semantics remain old-shape.` |
| `queue.script-editor-event-binding-export-convergence` | `done-open-residue` | `Closed after implementation and verification on 2026-07-16.` | `Runtime-pack export now emits triggerless events.json plus event-bindings.json for supported bindings; built-in packs and runtime dispatch remain later work.` |
| `queue.zhuyuanzhang-event-binding-pack-migration` | `done-open-residue` | `Closed after implementation and verification on 2026-07-16.` | `Built-in zhuyuanzhang default content now exposes event-bindings.json and triggerless event bodies; EventBindingRuntime and old runtime retirement remain later queues.` |
| `queue.event-binding-runtime-convergence` | `done-open-residue` | `Closed after implementation and verification on 2026-07-16.` | `EventBindingRuntime selector and story TriggerContext adapter landed; old trigger scanning remains as explicit retirement residue.` |
| `queue.old-event-runtime-retirement` | `done` | `Closed after focused guard tests, typecheck, Blueprint lint, full npm test, and old-path source search passed.` | `Old trigger scanning is retired; no old-runtime same-family residue remains in this queue.` |
| `queue.script-editor-event-binding-authoring-ui-completion` | `done-open-residue` | `Closed after implementation and verification on 2026-07-17.` | `Full eventBinding create/delete/edit UI, basic conditions editing, runtime-pack import projection into project.eventBindings, and project-save preservation in event-bindings.json landed. Advanced condition editor, condition export lowering, and TriggerContext entrypoint completion remain unadmitted closeout blockers.` |
| `queue.script-editor-event-binding-owner-local-authoring-surfaces` | `done-open-residue` | `Closed after guard review, implementation verification, and Blueprint closeout on 2026-07-17.` | `Event-body condition editing was removed from the event detail page, event-page bindings are read-only reverse references, dedicated eventBindings authoring owns project.eventBindings edits, and local event-binding panels were added for person/city/building/dialogue/minigame/story owners. Version closeout remains forbidden while condition-editor-completion remains unresolved.` |
| `queue.script-editor-event-binding-condition-editor-completion` | `done-open-residue` | `Closed after final guard review and Blueprint closeout on 2026-07-17.` | `Condition editor completion is done: registry-backed Chinese cascading controls, field source/operator/value type selection, resolver-backed dropdown hooks, expression/custom/binding-context draft surfaces, owner-local event-tab binding authoring, project.events-backed binding event selectors, owner-family trigger selectors, and person/city/building/payload/custom registry fields landed while preserving EventBinding.conditions ownership and advanced export fail-closed boundaries. Version closeout was not entered.`
| `queue.event-binding-condition-export-lowering` | `done-open-residue` | `Closed after implementation and verification on 2026-07-17.` | `Basic flag/variable EventBinding.conditions export lowering is complete. Remaining condition-editor and TriggerContext entrypoint blockers are still unadmitted; version closeout remains forbidden.` |
| `queue.event-binding-trigger-context-entrypoint-completion` | `done-open-residue` | `Closed after implementation, verification, and queue closeout on 2026-07-17.` | `TriggerContext entrypoint audit and export fail-closed guards are complete. Unsupported dialogue/menu/minigame owner/action rows are not claimed as runtime entrypoints and no longer export as runnable bindings; indoor-screen-shown remains exportable/runnable. Version closeout remains forbidden while condition-editor and owner-local authoring surface blockers remain unadmitted.` |
| `queue.script-editor-event-body-trigger-field-retirement` | `done` | `Closed after guard review and Blueprint closeout on 2026-07-17.` | `Small corrective queue retired event-body triggerTiming authoring, preserved EventBinding trigger authoring, classified eventRecord.conditionGroups as legacy/non-runtime residue only, and returned to version review. Version closeout was not entered.` |

### Implementation Order Guard

1. `Contract/loader baseline.`
2. `Editor model/UI integration.`
3. `Field-gap review and controlled contract backfill if required.`
4. `Double-table export convergence.`
5. `Built-in zhuyuanzhang pack migration.`
6. `EventBindingRuntime convergence.`
7. `Built-in and exported-pack trigger verification.`
8. `Old runtime retirement.`
9. `Full script-editor event binding authoring UI completion.`

The old runtime retirement queue cannot be admitted until step 7 is recorded as passing.
The version can only enter closeout after a separate version closeout review confirms no remaining blockers; this queue closeout does not itself perform version closeout.

### Anti-Drift Guards

- `Every queue closeout must record whether EventDefinition.trigger, EventDefinition.conditions, or selectTriggeredEvents remain production runtime dependencies. This is a self-check, not a default human pause.`
- `Event binding data must not be reintroduced into events.json, building-local eventBindings, storyPack.runtimeEvents, or another side-channel as the long-term source of truth.`
- `Old events[].trigger/conditions may be used only as migration input. New runtime paths must not directly consume old trigger fields as compatibility behavior.`
- `The authoring UI queue may display, edit, navigate, and validate event bodies and bindings, but must not invent runtime semantics, condition meaning, or resolver behavior.`
- `New field needs must first be classified as core fixed field, registered extension field, or editor-only draft/residue field before changing any contract.`
- `Resolver, payload schema, and registered extension surfaces must be preferred over adding more fixed EventBinding fields.`
- `Built-in zhuyuanzhang event-binding migration is a runtime cutover gate, not a post-retirement cleanup item.`
- `Event actions/effects expansion must not be smuggled into this version unless a queue proves it is a direct blocker for event-binding runtime replacement.`
- `EventBindingRuntime must adapt to other sub-runtimes through TriggerContext emission and existing runtime-result handoff seams, not by importing sub-runtime internals or taking over their lifecycle/state machines.`
- `Every queue that touches a sub-runtime boundary must record whether the boundary remains owned by that sub-runtime and which TriggerContext payload/resolver/handoff contract was used.`

### Queue Admission Startup Rules

1. `Read project-progress -> blueprint -> version plan -> active queue before touching a fresh queue item.`
2. `Check whether an active queue already exists.`
3. `Classify the item before any queue creation or implementation.`
4. `If the item is queue-candidate, write review_subject_id / review_subject_classification / proposed_queue_id / review_basis / admission_status first.`
5. `Only after version-plan admission sync may a queue doc be created and activated.`
6. `Only after the admitted queue doc exposes queue_status=active plus a live active_task may implementation start.`

### Operator Intake Contract

- Allowed operator intake:
  - `新需求`
  - `参考治理规范`
  - `鏂伴渶姹俙
  - `鍙傝€冩不鐞嗚鑼僠
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

### Evidence Search Priority

- `For execution truth, routing, admission, closeout, task status, and next action, read project-progress -> blueprint -> version plan -> active queue -> active task first.`
- `For implementation truth, existing mechanisms, interfaces, call flows, data shapes, and actual runtime behavior, search src/ and tests/ first.`
- `For event replacement design truth, use docs/script-editor-event-trigger-binding-design.md as the source design.`
- `Do not use docs/change-log.md as the default search target for Blueprint routing, admission, closeout, scheduling, or implementation truth.`

### Closure Judgement And Residue Routing Rule

- `Queue execution closeout is not equivalent to true topic closure.`
- `This version plan owns same-family continuation routing truth after queue closeout.`
- `If same-family residue is uniquely routable, write the continuation here and avoid asking the operator which queue should come next.`
- `If multiple lawful residue continuations remain genuinely unresolved, route to human choice only then.`
- `Version closeout requires all required queues done, no active queue/task, old runtime paths removed, double-table validation passing, and explicit closeout record.`

### Repository Sync Policy

- `Git sync is non-governing.`
- `commit / push / merge must not change queue truth, version truth, candidate truth, or transition truth.`
- `Default Blueprint governance/documentation refinement uses local-record during execution and branch-commit at task closeout.`
- `remote-sync runs only when requested, when collaboration requires remote visibility, or when a queue/version closeout contract explicitly requires it.`

### Progress Log

- `2026-07-16`: `Created target.script-editor-event-binding-runtime-replacement as the successor version after the operator requested a Blueprint-governed version from the event trigger binding design. The version starts idle-open with queue.script-editor-event-binding-contract-loader as the next lawful queue recommendation and no active queue admitted yet.`
- `2026-07-16`: `Admitted queue.script-editor-event-binding-contract-loader as the first active queue. Baseline evidence confirmed the current code still lacks EventBinding domain contracts, eventBindings manifest hydration, and event-bindings.json active-content loading, while old events[].trigger/conditions export and selectTriggeredEvents runtime scanning remain production dependencies.`
- `2026-07-16`: `Closed queue.script-editor-event-binding-contract-loader after focused tests, typecheck, and Blueprint lint passed. Same-family residue is uniquely routed to queue.script-editor-event-binding-authoring-ui because editor model/UI support is the next required-priority step after the readable eventBindings contract and loader baseline.`
- `2026-07-16`: `Admitted queue.script-editor-event-binding-authoring-ui as the active queue. Baseline evidence confirmed script-editor project files do not include eventBindings, parse/save still require only events.json for event authoring, and the event editor still displays triggerTiming/conditionGroups on the event body surface.`
- `2026-07-16`: `Closed queue.script-editor-event-binding-authoring-ui after focused project save/load, selected-event binding UI navigation, authoring-helper, typecheck, Blueprint lint, and full npm test verification. Same-family residue is uniquely routed to queue.script-editor-event-binding-export-convergence because runtime-pack export still needs to emit runnable event-bindings.json and strip trigger/condition data from events.json.`
- `2026-07-16`: `Admitted queue.script-editor-event-binding-export-convergence as the active queue. Baseline evidence confirmed runtime-pack export manifest/files do not include eventBindings and extractRuntimeEvents still writes EventDefinition.trigger and conditions into exported events.json.`
- `2026-07-16`: `Closed queue.script-editor-event-binding-export-convergence after focused export tests, typecheck, Blueprint lint, and full npm test passed. Same-family residue is uniquely routed to queue.zhuyuanzhang-event-binding-pack-migration because the built-in zhuyuanzhang pack must include event-bindings.json before EventBindingRuntime cutover.`
- `2026-07-16`: `Admitted queue.zhuyuanzhang-event-binding-pack-migration as the active queue. Baseline evidence confirmed zhuyuanzhang pack.json does not name eventBindings, events.json still stores trigger/conditions on event bodies, and defaultPackEventBindings is still an empty array.`
- `2026-07-16`: `Closed queue.zhuyuanzhang-event-binding-pack-migration after focused migration tests, typecheck, Blueprint lint, and full npm test passed. Same-family residue is uniquely routed to queue.event-binding-runtime-convergence because built-in and exported double-table inputs now exist while EventBindingRuntime and old trigger scanning retirement remain unresolved.`
- `2026-07-16`: `Admitted queue.event-binding-runtime-convergence as the active queue. Baseline evidence confirmed old selectTriggeredEvents, runEventRuntime, and triggerStoryEvents still consume events[].trigger/conditions while active content now exposes eventBindings.`
- `2026-07-16`: `Closed queue.event-binding-runtime-convergence after EventBindingRuntime selector baseline, TriggerContext story adapter cutover, focused handoff tests, typecheck, Blueprint lint, and full npm test passed. Same-family residue is uniquely routed to queue.old-event-runtime-retirement because old selectTriggeredEvents and events[].trigger/conditions compatibility paths remain.`
- `2026-07-17`: `Admitted queue.old-event-runtime-retirement as the active queue. Baseline evidence confirmed src/application/events/trigger-evaluator.ts, src/core/runtime/event-runtime.ts, and selectTriggeredEvents tests still preserve old events[].trigger/conditions compatibility after EventBindingRuntime verification passed.`
- `2026-07-17`: `Corrective promotion review reopened the queue.script-editor-event-binding-authoring-ui claim boundary and confirmed its actual completed scope was project-level eventBindings storage, save/load preservation, authoring helpers, and selected-event binding visibility baseline only. Recorded queue.script-editor-event-binding-authoring-ui-completion as a required same-version candidate before version closeout, covering full create/delete/edit UI for eventBindings and imported runtime-pack eventBindings editability without new runtime semantics.`
- `2026-07-17`: `Closed queue.old-event-runtime-retirement after old trigger evaluator/runtime scanning paths were deleted or guarded, EventDefinition.trigger/conditions runtime fields were removed, house/scene story trigger seams were kept on EventBindingRuntime-backed eventBindings, and focused guard tests, typecheck, Blueprint lint, full npm test, and old-path source search passed. The version remains open and paused before admitting queue.script-editor-event-binding-authoring-ui-completion; that candidate must first re-review scope against docs/script-editor-event-trigger-binding-design.md EventBinding.conditions / condition editor requirements, and version closeout must not treat conditions UI as complete prematurely.`
- `2026-07-17`: `Admitted queue.script-editor-event-binding-authoring-ui-completion after operator confirmation and active_queue=none. Completed evidence-anchor reconcile only: the current UI has a selected-event bindings list/summary but no create/delete/edit controls; runtime-pack import preserves pack eventBindings under storyPack.runtimeEventBindings while project.eventBindings remains empty; runtime-pack export lowers project.eventBindings but currently fails closed on binding.conditions until resolver-backed lowering. Basic EventBinding.conditions editing for operator plus flag/variable items remains required in this queue, conditions must persist only on EventBinding.conditions, and advanced condition-editor completion remains routed to queue.script-editor-event-binding-condition-editor-completion before version closeout can claim condition UI completion.`
- `2026-07-17`: `Completed queue.script-editor-event-binding-authoring-ui-completion editor-controls implementation task and paused before queue closeout. Runtime-pack import now projects pack.eventBindings into editable project.eventBindings and project save preserves those records in event-bindings.json. The selected-event bindings UI now supports create/delete/edit for eventId, owner.family/id, trigger.timing/action, priority/enabled, and basic EventBinding.conditions operator plus flag/variable items without writing conditions to EventDefinition.conditions, adding runtime semantics, changing EventBindingRuntime behavior, or rolling back old-runtime retirement.`
- `2026-07-17`: `Recorded three required closeout blockers / follow-up candidates before version closeout: queue.script-editor-event-binding-condition-editor-completion for cascading editor/registry/resolver-backed condition authoring; queue.event-binding-condition-export-lowering for runnable lowering of UI-saved basic flag/variable conditions while unsupported resolver/custom forms fail closed; queue.event-binding-trigger-context-entrypoint-completion for time/dialogue/menu/minigame/custom TriggerContext adapter audit/completion or explicit fail-closed routing without moving sub-runtime lifecycle ownership into EventBindingRuntime.`
- `2026-07-17`: `Closed queue.script-editor-event-binding-authoring-ui-completion without entering version closeout. Closeout recorded that editor-controls implementation is complete; focused event binding authoring/conditions/import tests, npm run typecheck, npm run lint:blueprints, and full npm test passed; basic conditions UI is complete while advanced condition editor, condition export lowering, and TriggerContext entrypoint completion remain unadmitted closeout blockers. The version remains open with active_queue=none.`
- `2026-07-17`: `Promotion review sorted the three unadmitted closeout blockers and admitted queue.event-binding-condition-export-lowering as the unique next queue. It is prioritized before queue.script-editor-event-binding-condition-editor-completion because the basic conditions UI already exists and needs runnable export before broader authoring expansion, and before queue.event-binding-trigger-context-entrypoint-completion because TriggerContext adapter completion depends on runnable binding rows rather than editor-only saved conditions. Evidence-anchor reconcile completed only; no implementation started and version closeout was not entered.`
- `2026-07-17`: `Completed task.event-binding-condition-export-lowering.implementation without entering queue closeout or version closeout. Runtime-pack export now lowers UI-saved basic flag/variable EventBinding.conditions from authoring shape to runtime shape in event-bindings.json, leaves EventDefinition.conditions out of events.json, keeps unsupported advanced condition forms fail-closed, and does not change EventBindingRuntime semantics.`
- `2026-07-17`: `Closed queue.event-binding-condition-export-lowering without entering version closeout or admitting another queue. Closeout recorded that basic flag/variable EventBinding.conditions export lowering is complete, authoring shape is lowered to runtime shape in event-bindings.json, events.json does not write EventDefinition.conditions, and unsupported advanced/resolver/custom conditions still fail closed. Remaining version blockers are queue.script-editor-event-binding-condition-editor-completion and queue.event-binding-trigger-context-entrypoint-completion, both unadmitted.`
- `2026-07-17`: `Promotion/admission review compared the remaining unadmitted blockers and admitted queue.event-binding-trigger-context-entrypoint-completion as the next active queue. It is prioritized over queue.script-editor-event-binding-condition-editor-completion because basic EventBinding.conditions can now be saved and exported, while code evidence shows runtime entrypoint adapters are narrower than the export-allowlisted trigger actions. Evidence-anchor reconcile completed only; no implementation started and version closeout was not entered.`
- `2026-07-17`: `Design alignment review found that the event detail page still exposes event-body conditionGroups editing and therefore cannot be treated as a completed event-binding surface. queue.script-editor-event-binding-owner-local-authoring-surfaces was recorded as a same-version blocker for removing event-body condition editing, keeping event detail bindings read-only, and adding local event-binding entry points on person/city/building/dialogue/minigame/story-node details; it remains unadmitted until the current trigger-context queue closes.`
- `2026-07-17`: `Closed queue.event-binding-trigger-context-entrypoint-completion without entering version closeout or admitting another queue. Closeout recorded that the queue completed TriggerContext entrypoint audit and export fail-closed guards: dialogue/menu/minigame owners and dialogue-finished/menu-select/minigame-finished actions are not implemented runtime trigger entrypoints and now fail closed before export, while indoor-screen-shown remains exportable/runnable through the existing indoor-screen follow-up path. queue.script-editor-event-binding-owner-local-authoring-surfaces was not handled. Version closeout remains forbidden because queue.script-editor-event-binding-condition-editor-completion and queue.script-editor-event-binding-owner-local-authoring-surfaces remain unresolved and unadmitted.`
- `2026-07-17`: `Promotion/admission review compared the remaining unadmitted blockers and admitted queue.script-editor-event-binding-owner-local-authoring-surfaces as the next active queue. It is prioritized over queue.script-editor-event-binding-condition-editor-completion because docs/script-editor-event-trigger-binding-design.md requires event pages to avoid trigger/conditions ownership, while current UI still edits eventRecord.conditionGroups and directly edits project event bindings from the event detail page; advanced condition editor work should follow the ownership correction. Evidence-anchor reconcile completed only; no implementation started and version closeout was not entered.`
- `2026-07-17`: `Completed task.script-editor-event-binding-owner-local-authoring-surfaces.implementation without entering queue closeout or version closeout. RED tests first captured the event-page condition editing actions, event-page direct binding editor, missing dedicated eventBindings editor route, and missing owner-local binding hooks. GREEN implementation removed event-page conditionGroups editing actions/handlers, made event-page bindings read-only reverse references, added a dedicated eventBindings authoring surface for project.eventBindings, and added owner-local person/city/building/dialogue/minigame/story binding panels that write project.eventBindings. Advanced condition editor and EventBindingRuntime semantics were not changed. Focused tests, npm run typecheck, npm run lint:blueprints, and npm test passed.`
- `2026-07-17`: `Closed queue.script-editor-event-binding-owner-local-authoring-surfaces without entering version closeout or admitting another queue. Guard review confirmed add/remove-event-condition-* actions, data-script-editor-event-condition hooks, and the conditions tab are absent from the event page; eventRecord.conditionGroups remains only as non-runtime preview/legacy normalization residue; event-page bindings are read-only reverse references; dedicated eventBindings and owner-local surfaces write project.eventBindings; and EventDefinition.conditions, person.eventIds, storyNode.relatedEventIds, and building entry IDs are not used as new trigger configuration. Remaining version blocker is queue.script-editor-event-binding-condition-editor-completion.`
- `2026-07-17`: `Promotion/admission review admitted queue.script-editor-event-binding-condition-editor-completion as the active queue and completed evidence-anchor reconcile only. Evidence shows docs/script-editor-event-trigger-binding-design.md still requires cascading condition editor, condition field registry, resolver-backed dropdowns, expression/custom/binding-context authoring, and field source/operator/value type selection, while current UI only exposes EventBinding.conditions.operator plus basic flag/variable rows with free-text field/operator/value inputs. Current authoring helpers preserve only flag/variable condition items, and runtime-pack export lowers only basic flag/variable conditions while advanced/resolver/custom conditions fail closed. Version closeout was not entered and implementation has not started.`
- `2026-07-17`: `Completed task.script-editor-event-binding-condition-editor-completion.implementation without entering queue closeout or version closeout. RED tests first captured missing localized cascading condition controls, condition field registry hooks, resolver-backed dropdown hooks, and expression/custom/binding-context draft preservation. GREEN implementation added ConditionFieldOption registry support, Chinese labels for author-visible condition/owner/trigger/operator/value-type controls, field source and field selectors, value-type-aware operator/value controls, and advanced authoring surfaces that persist to EventBinding.conditions. EventDefinition.conditions and EventBindingRuntime semantics were not changed, unsupported advanced/resolver/custom export remains fail-closed, and verification passed with focused condition tests, npm run typecheck, npm run lint:blueprints, and npm test.`
- `2026-07-17`: `Returned to task.script-editor-event-binding-condition-editor-completion.implementation before queue closeout to close additional UI gaps. RED tests captured owner-local event binding authoring placement under object 事件 tabs, binding event selector requirements, trigger timing/action selector requirements, and ConditionFieldOption coverage for person/city/building base and custom fields plus payload/binding-context fields. GREEN implementation moved person/city/building/dialogue/minigame/story owner-local binding panels under 事件 tabs, changed binding event to a project.events-backed selector showing title plus eventId, changed trigger timing/action to owner-family trigger selectors, and expanded the condition field registry without changing EventDefinition.conditions or EventBindingRuntime semantics. Queue closeout and version closeout were not entered.`
- `2026-07-17`: `Closed queue.script-editor-event-binding-condition-editor-completion after final guard review and Blueprint handoff. Guard review confirmed owner-local binding authoring is only under person/city/building/dialogue/minigame/story event tabs; binding event is a project.events-backed selector showing title plus eventId and saving eventId; trigger timing/action use owner-family selectors; ConditionFieldOption covers person base/custom, city base/custom, building base/custom, payload, and binding-context fields; author-visible labels are Chinese; expression/custom/binding-context are authoring-save surfaces only; unsupported advanced condition export remains fail-closed; EventBindingRuntime semantics and EventDefinition.conditions were not changed. Version closeout was not entered and no new queue was admitted.`
- `2026-07-17`: `Paused version closeout after manual UI verification found a closeout regression: rendered city/building/dialogue/minigame/story event tabs could not switch because location/narrative/minigame tab selector whitelists rejected "events", and the event-body selector still accepted "conditions". Fixed the regression under queue.script-editor-event-binding-condition-editor-completion by adding events to the location, narrative, and minigame selector whitelists, removing conditions from selectScriptEditorEventTab, and adding RED/GREEN source guard coverage. Version closeout remains unentered.`
- `2026-07-17`: `Completed runtime effectiveness acceptance before version closeout review without entering version closeout. Automated coverage now proves Script Editor EventBinding authoring with basic flag/variable EventBinding.conditions exports lowered runtime conditions, loads through scenario-pack loader, is selected by EventBindingRuntime from a supported city-enter TriggerContext, and produces scene handoff plus eventHistory firedCount. Existing automated guards still cover fail-closed export for unsupported dialogue/menu/minigame entrypoints and exportability/runtime coverage for indoor-screen-shown. Browser validation used http://127.0.0.1:5175 from the correct worktree and reached runtime map/city/皇觉寺, but visible output entered the temple house review flow and browser storage did not expose eventHistory, so browser runtime-trigger proof remains inconclusive and must not be used as a version closeout claim.`
- `2026-07-17`: `Final version closeout review concluded cannot-close and did not mark the version done. Required queues are closed and runtime effectiveness is supported by automated city-enter coverage, but design acceptance found a remaining event-body triggerTiming authoring residue in src/ui/main-ui/main-ui-flow.js and apply/update handling. This conflicts with docs/script-editor-event-trigger-binding-design.md, which says event pages must remove or hide triggerTiming/trigger-condition configuration. Recorded queue.script-editor-event-body-trigger-field-retirement as an unadmitted same-version blocker; no implementation, admission, or version closeout was started.`
- `2026-07-17`: `Admitted queue.script-editor-event-body-trigger-field-retirement from blocker.event-body-triggerTiming-ui-residue and completed evidence-anchor reconcile only. Evidence found src/ui/main-ui/main-ui-flow.js still renders data-script-editor-event-field="triggerTiming" on the event body basics panel and still forwards triggerTiming author edits, while src/application/script-editor/story-dialogue-event-authoring.ts updateScriptEditorEventField still accepts triggerTiming. eventRecord.conditionGroups is no longer exposed through event-page add/remove condition editing and remains classified as legacy/non-runtime residue for this queue to guard or delete if safe. Scope is intentionally small: remove event-body triggerTiming authoring, prevent the triggerTiming field update path as a daily authoring route, preserve EventBinding.trigger selectors and EventBindingRuntime behavior, and do not enter version closeout.`
- `2026-07-17`: `Completed task.script-editor-event-body-trigger-field-retirement.implementation without entering queue closeout or version closeout. RED test first failed on the event body triggerTiming data field; GREEN removed the event-body triggerTiming control and event field handler path, made updateScriptEditorEventField ignore triggerTiming as a JS runtime call, and preserved EventBinding.trigger timing/action selectors. eventRecord.conditionGroups remains classified as legacy/non-runtime residue: the event page has no conditions tab or add/remove condition actions, runtime-pack export keeps event conditions out of events.json, and EventBindingRuntime semantics were not changed.`
- `2026-07-17`: `Closed queue.script-editor-event-body-trigger-field-retirement after guard review and Blueprint handoff without entering version closeout or admitting another queue. Guard review confirmed the event body UI no longer contains data-script-editor-event-field="triggerTiming" or an event-body triggerTiming editor; updateScriptEditorEventField no longer accepts triggerTiming as a daily author edit; EventBinding.trigger timing/action selectors remain the trigger authoring owner; events.json/EventDefinition do not regain trigger/conditions; eventRecord.conditionGroups remains legacy/non-runtime residue with no event-page add/remove/edit condition path; EventBindingRuntime semantics were not changed; and npm run lint:blueprints passed. The version remains open and requires a separate final version closeout review before any done claim.`
- `2026-07-17`: `Fixed a post-closeout owner-local event binding UI regression without entering version closeout or admitting another queue. Root cause: owner-local panels filter bindings by owner.family/id but reused the full event binding editor, exposing owner.family/id controls inside the local panel; changing the owner field made the card stop matching the current object and disappear. The fix locks owner editing in owner-local panels while preserving EventBinding.trigger timing/action selectors and trigger update behavior. RED/GREEN coverage confirms trigger edits preserve owner.family/id and keep the owner-local card anchored. EventBindingRuntime semantics and EventDefinition/events.json ownership were not changed.`
- `2026-07-17`: `Final version closeout completed after explicit operator confirmation of the can-close review. Design acceptance passed: events.json/EventDefinition remain event-body-only, trigger/conditions ownership moved to EventBinding/event-bindings.json, and EventBinding is the only long-term trigger-entry source. UI interaction acceptance passed: owner-local person/city/building/dialogue/minigame/story event tabs are switchable; owner-local cards lock owner.family/id while preserving binding event, trigger timing/action, and conditions controls; the independent eventBindings surface retains owner.family/id editing; and the event body page has no conditions tab or triggerTiming author field while bindings are read-only reverse references/jumps. Runtime effectiveness is accepted from automated evidence covering Script Editor authoring -> event-bindings.json export -> loader -> city-enter TriggerContext -> EventBindingRuntime -> scene handoff/eventHistory; browser runtime-trigger proof remains an inconclusive waiver and is not counted as success evidence. Fail-closed boundaries passed: unsupported dialogue/menu/minigame entrypoints do not export runnable bindings, and unsupported advanced/resolver/custom conditions fail closed. Old path/source guard passed: selectTriggeredEvents, trigger-evaluator, EventDefinition.trigger/conditions, event-body triggerTiming data fields, event condition add/remove hooks, and data-script-editor-event-condition are absent from production runtime/UI paths; storyPack.runtimeEvents remains only an adapter-supported bridge, and eventRecord.conditionGroups remains legacy/non-runtime residue. Final verification passed: npm run typecheck, npm run lint:blueprints, and npm test (609/609). Version status is now done with active_queue=none, active_task=none, and no next same-version action; next_decision/next_action retain the Blueprint linter's allowed closeout enum values for the closed record.`
