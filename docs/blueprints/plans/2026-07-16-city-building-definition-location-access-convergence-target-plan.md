# City Building Definition And Location Access Convergence Version Plan

## Control Block

- document_role: `version-governor`
- version_id: `target.city-building-definition-location-access-convergence`
- version_status: `open`
- active_phase: `phase.version-open`
- active_queue: `none`
- decision_state: `idle-open`
- next_decision: `queue-admission-review`
- next_action: `classify-fresh-work`
- resume_gate: `idle-open`
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
  - `queue.script-editor-city-building-definition-restructure`
  - `queue.location-access-runtime-convergence`
  - `queue.script-editor-building-house-runtime-adapter`
  - `queue.city-building-status-save-runtime-convergence`
  - `queue.script-editor-city-building-custom-attribute-authoring`
  - `queue.script-editor-city-building-export-import-validation`
  - `queue.map-city-list-compatibility-preservation`

## Human Context

### Activation Record

- Scope approval:
  - `The operator requested the drafted city/building definition, runtime, editor, map, and LocationAccessRuntime requirements be formalized as the next Blueprint version.`
- Activation basis:
  - `target.script-editor-authoring-data-structure-unification is closed with version_status=done, active_queue=none, and no lawful same-version candidate queue remaining under that version.`
  - `docs/blueprints/version-memo.md records MEMO-006 for LocationAccessRuntime, MEMO-005 for city/building custom attributes, and related city/building authoring gaps as non-scheduling evidence.`
  - `The new version target explicitly excludes map coordinate ownership migration while preserving the existing MapDefinition/cityCoordinatesById path.`
- Activation conclusion:
  - `target.city-building-definition-location-access-convergence is now the open successor version.`
  - `No queue is admitted yet; the version is idle-open and ready for normal queue admission review from the candidate portfolio.`

### Admission Review Record

- Intake handling:
  - `The operator-facing intake already supplied scope and reference governance context for this version.`
  - `Queue mechanics remain internal to Blueprint; no implementation may start until a candidate is admitted and its queue doc is active.`
- Scope approval:
  - `Approved scope: city/building definition restructuring, LocationAccessRuntime expression evaluation, HouseRuntime deprivileging, city/building runtime status overlays, script-editor authoring changes, export/import validation, and map city-list compatibility preservation.`
- Admission basis:
  - `none`
- Required truth sync:
  - `Version plan admission fields must be written before implementation starts.`
  - `The admitted queue doc must exist before code implementation starts.`

### Version Lifecycle Rules

- `A current open version stays open until version closeout is explicitly confirmed and written into this version plan.`
- `If active_queue = none, that does not close the version; it only returns the version to promotion-review or idle-open.`
- `As long as version_status = open, additional same-version queues may still be admitted.`
- `If no open version exists, version creation becomes the required next governance action before any queue admission or implementation can begin.`
- `Queue closeout may auto-advance; version closeout must not be inferred from queue completion alone.`
- `When version acceptance and closeout conditions are satisfied, ask exactly one human confirmation before changing version_status to done.`

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

### Candidate Recovery Ledger

| Candidate ID | Last Classification | Proposed Queue | Latest Disposition | Recheck Trigger | Notes |
| --- | --- | --- | --- | --- | --- |
| `item.script-editor-city-building-definition-restructure` | `queue-candidate` | `queue.script-editor-city-building-definition-restructure` | `candidate-recorded` | `only if fresh code evidence proves access runtime must precede data shape work` | `Required-priority first structure slice for base/profile/extended city/building definitions, no visibility field, and current map compatibility preservation.` |
| `item.location-access-runtime-convergence` | `queue-candidate` | `queue.location-access-runtime-convergence` | `candidate-recorded` | `only if fresh evidence proves the runtime access seam can be absorbed into definition restructure without widening it` | `Required-priority runtime slice for conditionExpression evaluation and city/building entry-before-mutation enforcement.` |
| `item.script-editor-building-house-runtime-adapter` | `queue-candidate` | `queue.script-editor-building-house-runtime-adapter` | `candidate-recorded` | `only if fresh evidence proves HouseRuntime adapter work must be part of the initial data-shape migration` | `Required adapter slice to keep HouseRuntime as post-entry interaction runner while BuildingDefinition becomes the primary building model.` |
| `item.city-building-status-save-runtime-convergence` | `queue-candidate` | `queue.city-building-status-save-runtime-convergence` | `candidate-recorded` | `only if fresh evidence proves status overlays are required before any access-expression evaluation can land` | `Required save/runtime slice for final-value CityRuntimeStatus and BuildingRuntimeStatus overlays.` |
| `item.script-editor-city-building-custom-attribute-authoring` | `queue-candidate` | `queue.script-editor-city-building-custom-attribute-authoring` | `candidate-recorded` | `only if fresh evidence proves custom attributes can be safely deferred without blocking expression authoring` | `Required editor-facing slice for governed city/building extended attributes over field definitions.` |
| `item.script-editor-city-building-export-import-validation` | `queue-candidate` | `queue.script-editor-city-building-export-import-validation` | `candidate-recorded` | `only if fresh evidence proves export/import validation must split into smaller schema and runtime-pack queues` | `Required pack-boundary slice for preserving or failing closed on new city/building definitions and access expressions.` |
| `item.map-city-list-compatibility-preservation` | `queue-candidate` | `queue.map-city-list-compatibility-preservation` | `candidate-recorded` | `only if map marker breakage becomes a first-order blocker earlier in the version` | `Required-final compatibility proof that existing map city marker data remains on MapDefinition/cityCoordinatesById while map clicks route through LocationAccessRuntime.` |

### Queue Promotion Ledger

| Queue ID | Current Disposition | Promote When | Notes |
| --- | --- | --- | --- |
| `queue.script-editor-city-building-definition-restructure` | `candidate` | `Promote first unless fresh implementation evidence proves LocationAccessRuntime must be introduced over current records before definition restructuring.` | `This is the preferred first queue because all later editor, export, adapter, and status work needs the new no-visibility city/building definition boundary.` |
| `queue.location-access-runtime-convergence` | `candidate` | `Promote after the minimum definition contract exists, or first if access-before-navigation is proven to be the smaller prerequisite.` | `Must evaluate script-editor-authored conditionExpression values and guard map city clicks plus city building clicks before state mutation.` |
| `queue.script-editor-building-house-runtime-adapter` | `candidate` | `Promote after BuildingDefinition and LocationAccessRuntime boundaries are stable enough to adapt HouseRuntime without re-growing building data ownership inside house modules.` | `Keeps HouseRuntime but demotes it to the post-entry interaction/session/module runner.` |
| `queue.city-building-status-save-runtime-convergence` | `candidate` | `Promote when runtime access expressions or gameplay mutations need current city/building values beyond authored defaults.` | `Status overlays store final current values, not deltas, and must live beside CharacterStatus in save/modState.` |
| `queue.script-editor-city-building-custom-attribute-authoring` | `candidate` | `Promote once base definition shape exists and creator-authored expression/custom-field UI needs governed field definitions.` | `Covers city/building extendedAttributes and field-definition-driven controls.` |
| `queue.script-editor-city-building-export-import-validation` | `candidate` | `Promote once the data shape and access runtime contracts are ready to freeze the runtime-pack boundary.` | `Must fail closed for invalid references, invalid expressions, missing fields, and incompatible legacy structures.` |
| `queue.map-city-list-compatibility-preservation` | `candidate` | `Promote as final validation unless map marker or city click routing breaks earlier.` | `Proves map nodes and coordinates remain map-owned while city entry uses LocationAccessRuntime.` |

### Closure Routing Record

- `Queue closeout residue must be absorbed here after queue-level closeout judgement completes.`
- `This version plan owns same-family continuation routing truth; it must not create a second resume chain.`
- `If queue closeout proves one unique same-family continuation, write that continuation here instead of returning to open-ended human queue selection.`
- `If residue is cross-family or not uniquely routable, return to broader version review instead of pretending same-family continuation is already settled.`
- `Do not duplicate queue-level implementation evidence here; record routing truth only.`

### Candidate Recovery Rule

- `If a queue-candidate is already recorded in this version plan or candidate recovery ledger, resume from that record by default.`
- `Only restart a full re-audit when new material evidence invalidates the prior classification or review basis.`
- `Do not use prose-only memory as the recovery source when structured admission truth already exists.`

### Evidence Search Priority

- `For execution truth, routing, admission, closeout, task status, and next action, read project-progress -> blueprint -> version plan -> active queue -> active task first.`
- `For implementation truth, existing mechanisms, interfaces, call flows, data shapes, and actual runtime behavior, search src/ and tests/ first.`
- `For historical explanation, use compact active governance records first; open closed queues, old plans, docs/superpowers/**, or docs/change-log.md only when explicitly cited or when code evidence is insufficient.`
- `Do not use docs/change-log.md as the default search target for Blueprint routing, admission, closeout, scheduling, or implementation truth.`

### Closure Judgement And Residue Routing Rule

- `Queue execution closeout is not equivalent to true topic closure.`
- `Queue docs own execution_closeout_status / topic_closure_status / closure_basis / residue_remaining / residue_family / residue_routing_status / next_family_candidate / auto_continue_eligible.`
- `This version plan owns closure_review_subject / closure_review_status / residue_candidate_id / residue_candidate_family / routing_basis / next_lawful_queue_recommendation / auto_admission_ready.`
- `If same-family residue is uniquely routable, write the continuation here and avoid asking the operator which queue should come next.`
- `If multiple lawful residue continuations remain genuinely unresolved, route to human choice only then.`

### Single-Active-Queue Rule

- `When execution_mode=single-active-task and allow_parallel=false, an active queue blocks live admission review for a second queue.`
- `If a fresh item cannot be absorbed by the current active queue, record it as a candidate for later rather than activating a second queue.`
- `Return to version-level review only after the current active queue closes.`
- `If an active queue exists and intake or questioning depends on that queue state, expose a queue snapshot before asking the operator to choose.`

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

```text
澶勭悊缁撴灉锛?
- 鍔犲叆鐘舵€侊細鎴愬姛 / 澶辫触 / 鎴愬姛锛屽凡鍔犲叆
- 鍔犲叆绫诲瀷锛氭墽琛岄槦鍒?/ 鍊欓€夐槦鍒?/ 鏈姞鍏?
- 鍔犲叆闃熷垪锛歚鍏蜂綋闃熷垪ID` / `none`

鍘熷洜璇存槑锛?
- 鐢?2~4 鍙ヨ瘽璇存槑涓轰粈涔堣繘鍏ヨ闃熷垪锛屾垨鑰呬负浠€涔堟病鏈夋垚鍔熷姞鍏ャ€?
- 濡傛灉娌℃湁杩涘叆鎵ц闃熷垪锛岃鏄庣‘璇存槑鏄洜涓哄綋鍓嶅凡鏈?active queue锛岃繕鏄洜涓哄畠褰撳墠鍙弧瓒冲€欓€夋潯浠躲€?

褰撳墠鎵ц鎯呭喌锛?
- 褰撳墠鎵ц闃熷垪锛歚鍏蜂綋闃熷垪ID`
- 褰撳墠浠诲姟锛歚鍏蜂綋 task ID`
- 褰撳墠闃熷垪鐩爣锛氫竴鍙ヨ瘽璇存槑

涓嬩竴姝ワ細
- 璇存槑 Blueprint 鎺ヤ笅鏉ヤ細濡備綍澶勭悊
- 浜哄伐鎿嶄綔锛氬綋鍓嶄笉闇€瑕?/ 褰撳墠闇€瑕佺‘璁?xxx
```

- Default visibility rule:
  - `榛樿涓嶅悜浜哄伐鏆撮湶鐪熷€奸摼缁嗚妭銆佸€欓€夊叏闆嗐€乄hy Not The Others銆丠uman Involvement Boundary銆乤dmission 鍐呴儴瀛楁鎴栨帓搴忓叏杩囩▼锛岄櫎闈炰汉宸ユ槑纭姹傚睍寮€鍐呴儴鍒嗘瀽銆俙

### Post-Task Auto-Reconcile

1. `Run verify_with.`
2. `Check done_when.`
3. `Write the task after-state, queue truth, and any required version truth before any repository sync begins.`
4. `Re-evaluate queue closeout.`
5. `Scan governance owners.`
6. `Scan residue.`
7. `If queue closeout leaves residue, absorb same-family or cross-family routing truth here before repository sync begins.`
8. `Record local repository sync state after the docs are updated.`
9. `Defer commit, push, and baseline merge until the bounded task or tightly related task group reaches closeout, unless remote collaboration or an explicit queue/version contract requires earlier sync.`
10. `If the next legal step is unique, continue directly into closeout, same-family routing, or version review once the local-record step or any attempted repository sync returns a result.`
11. `Update docs/change-log.md only when code, runtime, compatibility, shared interface, or user-visible behavior changed.`

### Repository Sync Policy

- `Git sync is non-governing.`
- `commit / push / merge must not change queue truth, version truth, candidate truth, or transition truth.`
- `Default Blueprint governance/documentation refinement uses local-record during execution and branch-commit at task closeout.`
- `remote-sync runs only when requested, when collaboration requires remote visibility, or when a queue/version closeout contract explicitly requires it.`
- `Version scheduling must not read sync_status, sync_scope, or sync_summary as live truth.`

### Prior Promotion Record

- `2026-07-16: target.city-building-definition-location-access-convergence was created as the open successor after the previous script-editor authoring/data-structure unification version closed. No queue has been admitted yet; the next legal step is fresh queue admission review from this version plan.`
