# City Building Definition And Location Access Convergence Version Plan

## Control Block

- document_role: `version-governor`
- version_id: `target.city-building-definition-location-access-convergence`
- version_status: `done`
- active_phase: `phase.version-closeout`
- active_queue: `none`
- decision_state: `idle-open`
- next_decision: `version-closeout`
- next_action: `write-version-closeout`
- resume_gate: `closed-version-record`
- promotion_review_result: `closeout`
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
- closure_review_subject: `queue.script-editor-zhuyuanzhang-template-direct-load`
- closure_review_status: `routed`
- residue_candidate_id: `none`
- residue_candidate_family: `none`
- routing_basis: `queue.script-editor-zhuyuanzhang-template-direct-load closed after the script editor 使用模板 entrypoint was wired to load /scenario-packs/zhuyuanzhang/pack.json directly through the existing compatibility import path, with focused and full verification passing. Explicit operator closeout confirmation then closed the version as done because no remaining same-version candidate queue is recorded.`
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
  - `queue.script-editor-city-building-mount-npc-authoring`
  - `queue.script-editor-city-building-mount-export-runtime-convergence`
  - `queue.script-editor-zhuyuanzhang-template-direct-load`

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
  - `queue.script-editor-city-building-definition-restructure is admitted as the first required-priority execution queue because the version plan already records it as the preferred first queue and all later editor, export, adapter, status, and map-compatibility work depends on the no-visibility city/building definition boundary.`
- Required truth sync:
  - `Version plan admission fields were written before queue activation.`
  - `The admitted queue doc exists and exposes active queue truth before code implementation starts.`
  - `Implementation must resume from docs/blueprints/queues/script-editor-city-building-definition-restructure-queue.md.`

### Version Closeout Record

- `Closeout judgement: closeout-ready acceptance evidence exists because every recorded same-version candidate queue is done, active_queue is none, active_task is none, and next_lawful_queue_recommendation is none.`
- `Closeout confirmation: explicit human confirmation to close target.city-building-definition-location-access-convergence was received on 2026-07-16 through the operator instruction to close the current version, update related documents, then push/merge to the remote development bus.`
- `Closure basis: the version delivered the governed city/building definition restructure, LocationAccessRuntime condition expression runtime/editor convergence, HouseRuntime adapter boundary, city/building status save/runtime convergence, custom attribute authoring, export/import validation, map city-list compatibility preservation, city-mounted building/NPC authoring and export/runtime convergence, and direct built-in zhuyuanzhang template loading.`
- `Future routing: no additional same-version queue may be admitted after this closeout without an explicit governance reopening record. Any further city/building or LocationAccessRuntime work must be classified under a successor version or explicit reopen decision.`

### Version Lifecycle Rules

- `This version is now closed historical evidence after explicit operator closeout confirmation and written closeout record.`
- `If active_queue = none, that no longer reopens this version after closeout; it only confirms there is no live execution controller under this closed version.`
- `As long as version_status = done, no additional same-version queues may be admitted without an explicit governance reopening record.`
- `If no open version exists, version creation becomes the required next governance action before any queue admission or implementation can begin.`
- `Queue closeout may auto-advance; this version closeout was not inferred from queue completion alone and is recorded from explicit operator confirmation.`

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
| `item.script-editor-city-building-definition-restructure` | `queue-candidate` | `queue.script-editor-city-building-definition-restructure` | `admitted + queue closed` | `only if fresh code evidence proves the bounded definition contract regressed` | `Closed after the base/profile/extended city/building definition slice, no-visibility access shape, runtime compatibility materialization, and current map id/name preservation landed with verification.` |
| `item.location-access-runtime-convergence` | `queue-candidate` | `queue.location-access-runtime-convergence` | `reopened + queue closed` | `only if fresh code evidence proves conditionExpression authoring/export/runtime regressed` | `Closed after the reopened business line verified city/building conditionExpression data-shape coverage, added a script-editor JSON condition setting, preserved location-access export/runtime structures, kept city/building runtime entry guards covered, and restored imported cityNpcPools resident activityWeight preservation needed for end-to-end round-trip acceptance.` |
| `item.script-editor-building-house-runtime-adapter` | `queue-candidate` | `queue.script-editor-building-house-runtime-adapter` | `admitted + queue closed` | `only if fresh evidence proves the resolved entry adapter regressed` | `Closed after HouseRuntime accepted resolved city-building entries while preserving legacy house-id helpers.` |
| `item.city-building-status-save-runtime-convergence` | `queue-candidate` | `queue.city-building-status-save-runtime-convergence` | `admitted + queue closed` | `only if fresh evidence proves the status/save runtime boundary regressed` | `Closed after AppState-owned final-value city/building status maps, runtime commit merge, save modState persistence, and startup restore landed with verification.` |
| `item.script-editor-city-building-custom-attribute-authoring` | `queue-candidate` | `queue.script-editor-city-building-custom-attribute-authoring` | `admitted + queue closed` | `only if fresh evidence proves custom attributes regressed` | `Closed after governed city/building extendedAttributes helper/UI/save-load authoring landed with verification.` |
| `item.script-editor-city-building-export-import-validation` | `queue-candidate` | `queue.script-editor-city-building-export-import-validation` | `admitted + queue closed` | `only if fresh evidence proves export/import validation regressed` | `Closed after unsupported city/building custom attributes fail closed at runtime export instead of being silently dropped.` |
| `item.map-city-list-compatibility-preservation` | `queue-candidate` | `queue.map-city-list-compatibility-preservation` | `admitted` | `only if map marker breakage becomes a first-order blocker earlier in the version` | `Required-final compatibility proof that existing map city marker data remains on MapDefinition/cityCoordinatesById while map clicks route through LocationAccessRuntime.` |
| `item.script-editor-city-building-mount-npc-authoring` | `queue-candidate` | `queue.script-editor-city-building-mount-npc-authoring` | `admitted + queue reclosed after regression fix` | `only if fresh evidence proves the city-side mounting authoring surface regressed again` | `Closed after the city authoring surface gained city-owned mountedBuildings data and dropdown controls for mounted buildings, mounted NPCs, and per-building primary NPC selection; reopened once for the operator-reported add-NPC no-op regression and reclosed after preserving editable NPC rows plus adding mounted-building deletion coverage.` |
| `item.script-editor-city-building-mount-export-runtime-convergence` | `queue-candidate` | `queue.script-editor-city-building-mount-export-runtime-convergence` | `admitted + queue closed` | `only if fresh evidence proves mountedBuildings export/runtime lowering regressed` | `Closed after export lowered city-mounted buildings and mounted NPCs into runtime cities, houses, city-entries, and city-npc-pools, replacing stale imported template relationship tables when mountedBuildings exists.` |
| `item.script-editor-zhuyuanzhang-template-direct-load` | `queue-candidate` | `queue.script-editor-zhuyuanzhang-template-direct-load` | `admitted + queue closed` | `only if fresh evidence proves the script editor template entrypoint direct-load behavior regressed` | `Closed after the script editor 使用模板 button directly loads the built-in zhuyuanzhang scenario pack from /scenario-packs/zhuyuanzhang/pack.json without opening a folder picker or requiring user-selected files.` |

### Queue Promotion Ledger

| Queue ID | Current Disposition | Promote When | Notes |
| --- | --- | --- | --- |
| `queue.script-editor-city-building-definition-restructure` | `done` | `Already completed; do not reopen except by explicit governance record.` | `Closed after all later editor, export, adapter, and status work received the new no-visibility city/building definition boundary.` |
| `queue.location-access-runtime-convergence` | `done` | `Already completed; do not reopen except by explicit governance record or fresh regression evidence.` | `Reopened business-line check closed after conditionExpression authoring, export/runtime structures, and end-to-end city/building entry acceptance verified.` |
| `queue.script-editor-building-house-runtime-adapter` | `done` | `Already completed; do not reopen except by explicit governance record.` | `Closed after HouseRuntime accepted resolved city-building entries while preserving legacy house-id helpers and post-entry module lifecycle behavior.` |
| `queue.city-building-status-save-runtime-convergence` | `done` | `Already completed; do not reopen except by explicit governance record.` | `Closed after status overlays stored final current values beside CharacterStatus in save/modState and runtime commit merge.` |
| `queue.script-editor-city-building-custom-attribute-authoring` | `done` | `Already completed; do not reopen except by explicit governance record.` | `Closed after city/building extendedAttributes helper/UI/save-load authoring landed with verification.` |
| `queue.script-editor-city-building-export-import-validation` | `done` | `Already completed; do not reopen except by explicit governance record.` | `Closed after unsupported city/building custom attributes fail closed at runtime export instead of being silently dropped.` |
| `queue.map-city-list-compatibility-preservation` | `done` | `Already completed; do not reopen except by explicit governance record.` | `Proved map nodes and coordinates remain map-owned while city entry uses LocationAccessRuntime.` |
| `queue.script-editor-city-building-mount-npc-authoring` | `done` | `Already completed; do not reopen except by explicit governance record or fresh regression evidence.` | `Closed after dropdown-based city -> buildings -> NPC mounting and per-building primary NPC selection landed in the city authoring surface; reclosed after fixing the add-NPC editing row regression and covering mounted-building deletion.` |
| `queue.script-editor-city-building-mount-export-runtime-convergence` | `done` | `Already completed; do not reopen except by explicit governance record or fresh regression evidence.` | `Converts the script editor's authored city/building/NPC mounting data into runtime city, building, city-entry, city-NPC, house character/default-character structures and validates exported packs load correctly.` |
| `queue.script-editor-zhuyuanzhang-template-direct-load` | `done` | `Already completed; do not reopen except by explicit governance record or fresh regression evidence.` | `Changed the script editor 使用模板 entrypoint from folder-picker import to direct loading of the built-in zhuyuanzhang scenario pack.` |

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

- `2026-07-16: Operator regression evidence reopened queue.script-editor-city-building-mount-npc-authoring because 新增 NPC had no effect and 删除挂载建筑 was reported ineffective in the workbench. The queue reclosed after the add-NPC edit helper stopped running full persistence normalization on the blank selectable row and focused mounted-building deletion coverage passed.`
- `2026-07-16: Operator reported exported packs still used imported template city-entries.json instead of authored city-mounted buildings. queue.script-editor-city-building-mount-export-runtime-convergence was admitted from the recorded same-family residue and closed after mountedBuildings lowered into runtime city houseIds, houses, city-entries, and city-npc-pools.`
- `2026-07-16: target.city-building-definition-location-access-convergence was created as the open successor after the previous script-editor authoring/data-structure unification version closed. No queue has been admitted yet; the next legal step is fresh queue admission review from this version plan.`
- `2026-07-16: queue.script-editor-city-building-definition-restructure closed its verified bounded no-visibility definition contract slice and routed the unique same-family continuation to queue.location-access-runtime-convergence.`
- `2026-07-16: queue.location-access-runtime-convergence was auto-admitted from the definition restructure closeout routing record; baseline reconciliation is the active task.`
- `2026-07-16: queue.location-access-runtime-convergence closed its verified bounded runtime access slice and routed the unique same-family continuation to queue.script-editor-building-house-runtime-adapter.`
- `2026-07-16: queue.script-editor-building-house-runtime-adapter was auto-admitted from the LocationAccessRuntime closeout routing record; baseline reconciliation is the active task.`
- `2026-07-16: queue.script-editor-building-house-runtime-adapter closed its verified bounded resolved-entry adapter slice and routed the unique same-family continuation to queue.city-building-status-save-runtime-convergence.`
- `2026-07-16: queue.city-building-status-save-runtime-convergence was auto-admitted from the HouseRuntime adapter closeout routing record; baseline reconciliation is the active task.`
- `2026-07-16: queue.city-building-status-save-runtime-convergence closed its verified bounded AppState-owned city/building status save/runtime slice and returned the version to promotion review with queue.script-editor-city-building-custom-attribute-authoring as the next same-family candidate recommendation.`
- `2026-07-16: queue.script-editor-city-building-custom-attribute-authoring was admitted from the status/save closeout routing record; baseline reconciliation is the active task.`
- `2026-07-16: queue.script-editor-city-building-custom-attribute-authoring closed its verified bounded helper/UI/save-load authoring slice and routed the unique same-family continuation to queue.script-editor-city-building-export-import-validation.`
- `2026-07-16: queue.script-editor-city-building-export-import-validation was auto-admitted from the custom-attribute authoring closeout routing record; baseline reconciliation is the active task.`
- `2026-07-16: queue.script-editor-city-building-export-import-validation closed its verified bounded runtime export validation slice and routed the unique same-family continuation to queue.map-city-list-compatibility-preservation.`
- `2026-07-16: queue.map-city-list-compatibility-preservation was auto-admitted from the export/import validation closeout routing record; baseline reconciliation is the active task.`
- `2026-07-16: Fresh operator intake recorded queue.script-editor-city-building-mount-npc-authoring as a deferred same-version candidate because the requested city-side building/NPC mounting authoring surface is in target scope but cannot be absorbed into the active map city-list compatibility queue without widening it.`
- `2026-07-16: Fresh operator intake recorded queue.script-editor-city-building-mount-export-runtime-convergence as a deferred follow-up candidate after queue.script-editor-city-building-mount-npc-authoring, requiring exported scenario packs to lower the script editor city, mounted-building, building-NPC, and primary-NPC authoring data into canonical runtime city/building structures that load correctly.`
- `2026-07-16: queue.map-city-list-compatibility-preservation closed with no blocking map compatibility residue; version review promoted queue.script-editor-city-building-mount-npc-authoring as the next active same-version queue before the export/runtime convergence follow-up.`
- `2026-07-16: Operator requested adding queue.location-access-runtime-convergence back into the candidate set because the corresponding city/building entry-condition business line was not complete. The candidate must verify conditionExpression data-shape coverage, editor settings, export lowering, runtime load structure, and end-to-end run-through acceptance before the queue can be closed again.`
- `2026-07-16: queue.script-editor-city-building-mount-npc-authoring closed after the bounded city-owned mounting authoring slice landed and verified. Version review now owns the same-family export/runtime convergence residue without inferring version closeout.`
- `2026-07-16: Fresh operator intake recorded queue.script-editor-zhuyuanzhang-template-direct-load as a deferred same-version candidate because the script editor 使用模板 button should directly load the built-in zhuyuanzhang scenario pack rather than invoking folder selection/import.`
- `2026-07-16: queue.script-editor-zhuyuanzhang-template-direct-load closed after the 使用模板 entrypoint loaded the built-in zhuyuanzhang scenario pack directly from the published manifest URL and no further recorded same-version candidate queue remained. Explicit operator confirmation then closed target.city-building-definition-location-access-convergence as done.`
