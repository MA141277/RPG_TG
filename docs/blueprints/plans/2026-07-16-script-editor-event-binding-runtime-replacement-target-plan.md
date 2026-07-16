# Script Editor Event Binding Runtime Replacement Version Plan

## Control Block

- document_role: `version-governor`
- version_id: `target.script-editor-event-binding-runtime-replacement`
- version_status: `open`
- active_phase: `phase.version-admission-review`
- active_queue: `none`
- decision_state: `idle-open`
- next_decision: `queue-admission-review`
- next_action: `write-admission-review`
- resume_gate: `open-version-record`
- post_queue_closeout_pause_policy: `auto-continue`
- promotion_review_result: `none`
- review_subject_id: `item.script-editor-event-binding-contract-loader`
- review_subject_classification: `queue-candidate`
- proposed_queue_id: `queue.script-editor-event-binding-contract-loader`
- review_basis: `First required-priority candidate from the new version portfolio; contract and loader support for eventBindings must precede editor UI, export, built-in pack migration, runtime cutover, and old runtime retirement.`
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
  - `queue.script-editor-event-binding-contract-loader`
  - `queue.script-editor-event-binding-authoring-ui`
  - `queue.script-editor-event-binding-export-convergence`
  - `queue.zhuyuanzhang-event-binding-pack-migration`
  - `queue.event-binding-runtime-convergence`
  - `queue.old-event-runtime-retirement`

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
  - `No queue is admitted yet; the next legal action is admission review for queue.script-editor-event-binding-contract-loader.`

### Version Lifecycle Rules

- `This version remains open until explicit closeout is recorded here.`
- `If active_queue = none, the version is idle-open, not done.`
- `A queue may be admitted only after version-plan admission fields are synchronized and the queue doc exists with queue_status=active plus a live active_task.`
- `Old event runtime deletion is forbidden until double-table editor, loader, export, built-in pack, and EventBindingRuntime verification are recorded as passing.`
- `Queue closeout may auto-advance when one lawful continuation exists.`

### Post-Queue Closeout Pause Policy

- `post_queue_closeout_pause_policy = auto-continue is the default for this version.`
- `When the policy is auto-continue, completing a queue must not create a default "whether to continue" question.`
- `If the next legal action is unique after queue closeout, continue automatically through closeout, residue routing, next queue admission, or next active queue startup.`
- `If the operator explicitly requests queue-completion pauses, write post_queue_closeout_pause_policy = pause-when-explicitly-requested in this version plan.`
- `This policy does not remove required human confirmation for version_status open -> done, real blockers, or genuinely multiple mutually exclusive legal branches.`

### Candidate Recovery Ledger

| Candidate ID | Last Classification | Proposed Queue | Latest Disposition | Recheck Trigger | Notes |
| --- | --- | --- | --- | --- | --- |
| `item.script-editor-event-binding-contract-loader` | `queue-candidate` | `queue.script-editor-event-binding-contract-loader` | `candidate` | `admit first unless fresh code evidence proves the double-table contract already exists and loads` | `Defines EventBinding contract, eventBindings pack field, event-bindings.json manifest hydration, and registered extension-field boundaries.` |
| `item.script-editor-event-binding-authoring-ui` | `queue-candidate` | `queue.script-editor-event-binding-authoring-ui` | `candidate` | `after contract/loader baseline closes` | `Adds script-editor eventBindings project data and UI display/navigation for event bodies and event bindings; owns the one allowed controlled contract backfill review.` |
| `item.script-editor-event-binding-export-convergence` | `queue-candidate` | `queue.script-editor-event-binding-export-convergence` | `candidate` | `after editor model/UI can represent both event tables` | `Exports events.json without trigger/conditions and event-bindings.json with trigger entries, failing closed on unsupported fields or conditions.` |
| `item.zhuyuanzhang-event-binding-pack-migration` | `queue-candidate` | `queue.zhuyuanzhang-event-binding-pack-migration` | `candidate` | `before runtime cutover or whenever built-in pack verification becomes the blocker` | `Migrates the built-in zhuyuanzhang pack to double-table event data so default content remains runnable after cutover.` |
| `item.event-binding-runtime-convergence` | `queue-candidate` | `queue.event-binding-runtime-convergence` | `candidate` | `after at least one double-table pack loads and export validation proves runtime input shape` | `Implements EventBindingRuntime, TriggerContext call sites, resolver-backed condition evaluation, deterministic selection, activation, occurrence, eventHistory, debug reports, and sub-runtime handoff compatibility.` |
| `item.old-event-runtime-retirement` | `queue-candidate` | `queue.old-event-runtime-retirement` | `candidate` | `only after EventBindingRuntime verification passes for built-in and exported packs` | `Deletes old events[].trigger/conditions scanning, old evaluator paths, and compatibility shims; adds regression guards.` |

### Queue Promotion Ledger

| Queue ID | Current Disposition | Promote When | Notes |
| --- | --- | --- | --- |
| `queue.script-editor-event-binding-contract-loader` | `candidate` | `First queue after version activation.` | `Must land before UI/export/runtime queues because it defines the readable double-table contract.` |
| `queue.script-editor-event-binding-authoring-ui` | `candidate` | `After contract/loader baseline closes.` | `May route one controlled backfill if UI proves a runtime-required field gap.` |
| `queue.script-editor-event-binding-export-convergence` | `candidate` | `After editor data can represent both tables and field-gap review is resolved.` | `Creates runnable pack output and fail-closed validation for binding fields.` |
| `queue.zhuyuanzhang-event-binding-pack-migration` | `candidate` | `Before EventBindingRuntime cutover or when built-in pack verification blocks runtime replacement.` | `Cannot be deferred until old runtime deletion.` |
| `queue.event-binding-runtime-convergence` | `candidate` | `After double-table pack loading/export validation exists.` | `Cuts runtime trigger dispatch to EventBindingRuntime through TriggerContext while preserving scene/task/house/navigation/playable/location-access sub-runtime ownership through runtime-result handoff seams.` |
| `queue.old-event-runtime-retirement` | `candidate` | `After new runtime verification proves built-in and editor-exported packs trigger correctly.` | `Required-final cleanup and guard queue.` |

### Implementation Order Guard

1. `Contract/loader baseline.`
2. `Editor model/UI integration.`
3. `Field-gap review and controlled contract backfill if required.`
4. `Double-table export convergence.`
5. `Built-in zhuyuanzhang pack migration.`
6. `EventBindingRuntime convergence.`
7. `Built-in and exported-pack trigger verification.`
8. `Old runtime retirement.`

The old runtime retirement queue cannot be admitted until step 7 is recorded as passing.

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

### Admission Startup Rules

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
