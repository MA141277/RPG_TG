# Building Arrangement Container Flow Refactor Version Plan

## Control Block

- document_role: `version-governor`
- version_id: `target.building-arrangement-container-flow-refactor`
- version_status: `open`
- active_phase: `phase.execution`
- active_queue: `none`
- decision_state: `promotion-review`
- next_decision: `same-version-admission-or-version-closeout`
- next_action: `return-to-promotion-review`
- resume_gate: `version-plan`
- post_queue_closeout_pause_policy: `auto-continue`
- promotion_review_result: `admitted`
- review_subject_id: `none`
- review_subject_classification: `none`
- proposed_queue_id: `none`
- review_basis: `none`
- admission_status: `none`
- intake_status: `admission-review`
- intake_item_id: `item.building-arrangement-container-flow-refactor-continuous-execution`
- intake_summary: `Operator requested Blueprint-compliant continuous execution from current version candidates until candidate exhaustion, no eligible queue, or blocker, without entering version closeout.`
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
  - `queue.flow-playable-runtime-and-presenter`
  - `queue.script-editor-flow-playable-authoring-ux`
  - `queue.zhuyuanzhang-building-arrangement-pack-migration`
  - `queue.legacy-house-runtime-retirement`
  - `queue.building-arrangement-final-acceptance-and-removal-guard`
- candidate_backlog_refresh_status: `fresh`
- candidate_backlog_snapshot:
  - `queue.building-arrangement-canonical-schema: closed locally after schema/default/validation implementation and verification.`
  - `queue.script-editor-building-arrangement-authoring-ux: closed locally after Script Editor Building Arrangement/container authoring implementation and verification.`
  - `queue.runtime-building-shell-and-container-rendering: closed locally after explicit buildingArrangements runtime pack/export/import/materialization, generic stage selection, generic shell rendering, and verification.`
  - `queue.building-container-event-trigger-integration: closed locally after generic building action-menu dispatch, EventBindingRuntime trigger.extra matching, closeBuilding action handling, runtime entrypoint wiring, export trigger-extra preservation, and verification.`
  - `queue.flow-playable-runtime-and-presenter: closed locally after family=flow shared contract, building owner integration, flow session/reduce/presenter/settlement/handoff, one high-priority shell-view gap fill, and full verification.`
  - `queue.script-editor-flow-playable-authoring-ux: closed locally after first-class flows[] authoring, independent UI, project/runtime pack round-trip, active-content flowDefinitionsById preview indexing, and full verification.`
  - `queue.zhuyuanzhang-building-arrangement-pack-migration: closed locally after explicit arrangement migration, generic action-event-flow launch, one high-priority gap fill, and verification.`
  - `queue.legacy-house-runtime-retirement: closed locally after old house runtime, registries, module sources, UI views, special-house governance, and fallback entry/view branches were removed; repository sync is pending record.`
  - `queue.building-arrangement-final-acceptance-and-removal-guard: pending final guard; admit last.`
- candidate_backlog_scan_sources:
  - `project-progress`
  - `blueprint`
  - `previous active version candidate ledger`
  - `docs/blueprints/version-memo.md#MEMO-022`
  - `docs/blueprints/specs/2026-07-20-building-arrangement-container-flow-refactor-evidence-draft.md`
  - `docs/blueprints/specs/2026-07-20-building-arrangement-container-flow-refactor-target.md`

## Human Context

### Activation Record

- Scope approval:
  - `The operator approved Blueprint-compliant continuous queue execution from the current version candidate set and explicitly excluded version closeout.`
- Inherits from:
  - `docs/blueprints/version-memo.md#MEMO-022`
  - `docs/blueprints/specs/2026-07-20-building-arrangement-container-flow-refactor-evidence-draft.md`
  - `target.city-building-module-entry-and-project-startup-authoring candidate queue.script-editor-building-arrangement-container-flow-refactor`
- Admission basis:
  - `The prior active version has no active queue. The only unfinished candidate with implementation-bearing work is the building-arrangement/container/flow refactor, and its evidence draft names queue.building-arrangement-canonical-schema as the first lawful queue.`
  - `The candidate is future-target class, so the lawful next step is this formal target plus first child queue admission rather than direct implementation under the prior target.`
- Activation conclusion:
  - `target.building-arrangement-container-flow-refactor is the active version.`
  - `queue.building-arrangement-canonical-schema is the active queue.`
  - `task.building-arrangement-canonical-schema.evidence-anchor-reconcile is the active task.`
  - `No version closeout has been entered.`

### Version Lifecycle Rules

- `This version remains open until explicit closeout is recorded here.`
- `If active_queue = none, that does not close the version; it returns to promotion-review for same-version candidate admission.`
- `Do not enter version closeout from the operator's continuous-execution request.`
- `Do not implement code without an active queue doc and active task.`
- `Do not add compatibility fallback from old house fields.`
- `Do not narrow away parent capabilities when splitting or closing child queues.`
- `Do not constrain future custom minigames with a broad permissions/security layer in this version.`

### Version-Local Temporary Execution Rule

- `This temporary rule applies only to target.building-arrangement-container-flow-refactor and must not be promoted into global Blueprint workflow until this version's candidates complete and a later evaluation explicitly decides that promotion.`
- `Before all current-version candidate queues finish, candidate queue admission review is an AI-internal execution step rather than a human confirmation point.`
- `If the parent spec already defines the capability, the prerequisite queues satisfy the candidate admission rule, and the next queue can proceed without changing the parent total spec, deleting or downgrading capability, or rewriting out-of-scope as retired, the agent should record the admission conclusion, update this version plan and the queue spec, and continue execution.`
- `A next queue may absorb necessary fixture, materialization, export/import, or verification gap-fill work when that work remains inside the parent spec and does not over-narrow the child queue's obligation.`
- `If admission finds a gap required for the next queue to run and the gap remains inside the parent spec, record it as an in-queue temporary gap fill or prerequisite routing decision and continue rather than requesting human confirmation.`
- `If an operator asks to audit whether a current-version queue is complete, over-narrowed, or missing inherited capability, treat any confirmed in-parent-spec finding as execution input rather than a human confirmation point. Record the finding in the active queue, next lawful queue, or version plan as a prerequisite routing decision, in-queue temporary gap fill, closeout blocker, or final-guard evidence, then continue unless a blocker condition below applies.`
- `Before ending a response while this version has an active or pending candidate queue, run a stop-condition self-check: whether the operator explicitly requested answer-only/no-continuation, whether a real blocker exists, whether the finding is outside the parent spec, and whether continuing would change the parent total spec, delete or downgrade capability, rewrite out-of-scope as retired, or require a product decision. If none apply, do not stop at advice; record the decision and continue execution.`
- `For this version, do not frame an in-parent-spec gap as merely a suggested next step. The expected handling is to record the gap and continue execution, using wording equivalent to: recorded into queue context and continuing.`
- `Queue closeout and completion completeness review must include an evidence-against-claim check for static placeholders, unbound menu actions, missing runtime-reachable event/flow/closeBuilding paths, or behavior that only survives through legacy house fallback. These findings cannot be written as out-of-scope, retired, unsupported, or deferred without lawful routing inside the parent target.`
- `After each queue closeout in this version, attempt repository synchronization with the development trunk according to the current repository workflow, including push and/or merge as applicable to the active branch/worktree state. Wait for the sync command result before continuing. Whether the sync succeeds or fails, record the result in the queue's sync fields or progress log, then continue to the next lawful queue unless the sync result reveals a true code/spec blocker already covered by this rule.`
- `Repository sync failure, remote push failure, merge refusal, or unavailable remote state is not by itself a reason to stop current-version queue progression. Treat it as a recorded sync result, not as queue closeout failure, version closeout, or a human confirmation point.`
- `Stop and report a blocker only when continuing would require changing the parent total spec, deleting/downgrading/declaring unsupported a parent capability, rewriting out-of-scope as retired, resolving code evidence that conflicts with the queue spec and cannot be independently adjudicated, or making a genuine product decision.`
- `Every queue still requires pre-execution no-over-narrowing review against the parent target, queue closeout under Blueprint closeout semantics, one completeness assessment, and at most one high-priority gap fill.`
- `Do not enter version closeout under this temporary rule.`

### Queue Admission Startup Rules

1. `Read project-progress -> blueprint -> version plan -> active queue before touching a fresh queue item.`
2. `Check whether an active queue already exists.`
3. `If an active queue exists, test whether the new item can be absorbed before considering a new queue.`
4. `If the new item cannot be absorbed, record it as a candidate or route it to a successor version; do not activate a second queue.`
5. `Return to version-level review only after the current active queue closes.`
6. `Before admitting any child queue, verify that its spec does not over-narrow the parent target and does not convert out-of-scope capability into retired or unsupported behavior.`
7. `For this version only, perform eligible candidate admission review internally and continue automatically unless the Version-Local Temporary Execution Rule says to stop as a blocker.`

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
| `item.building-arrangement-canonical-schema` | `queue-candidate` | `queue.building-arrangement-canonical-schema` | `closed` | `none` | `ACC-BUILDING-FLOW-001; ACC-BUILDING-FLOW-002` | `src/domain/script-editor-project.ts; editor loader/save/export/import; runtime pack contracts; tests/city-building-mount-authoring.test.cjs; tests/robustness.test.cjs` | `behavior-free building template schema; city-local buildingArrangements schema; container and activeBuilding contract names; fail-closed no-compat schema validation` | `Script Editor container authoring UX; runtime rendering; event dispatch; flow runtime; flow authoring UX; Zhu Yuanzhang migration; legacy house deletion; final acceptance` | `Closed locally after schema/default/validation implementation and verification; downstream capability remains routed rather than narrowed.` |
| `item.script-editor-building-arrangement-authoring-ux` | `queue-candidate` | `queue.script-editor-building-arrangement-authoring-ux` | `closed` | `none` | `ACC-BUILDING-FLOW-003` | `src/ui/main-ui/main-ui-flow.js; src/application/script-editor/city-building-authoring.ts; editor loader/save/export tests` | `Building Arrangement UI, arrangement mounted NPCs, container authoring, no-empty-data display behavior` | `runtime shell; event dispatch; flow runtime; flow authoring UX; built-in pack migration; legacy deletion` | `Closed locally after Script Editor authoring helpers/UI/tests and one browser-driven high-priority gap fill for default invalid fields.` |
| `item.runtime-building-shell-and-container-rendering` | `queue-candidate` | `queue.runtime-building-shell-and-container-rendering` | `closed` | `none` | `ACC-BUILDING-FLOW-006` | `src/application/building/**; src/ui/views/building/**; src/main.ts; state save/restore tests` | `generic runtime building shell, containers rendering, activeBuilding save/restore, enter/exit rules, no-crash empty data; explicit buildingArrangements runtime pack/export/import/materialization fixtures` | `editor authoring; event dispatch; flow runtime; flow authoring UX; built-in pack migration; legacy deletion` | `Closed locally after runtime shell and explicit buildingArrangements fixture implementation; event/flow/migration/deletion residue remains routed downstream.` |
| `item.building-container-event-trigger-integration` | `queue-candidate` | `queue.building-container-event-trigger-integration` | `closed` | `none` | `ACC-BUILDING-FLOW-004` | `src/domain/event.ts; runtime-pack-export/import; EventBindingRuntime entrypoints; runtime dispatch` | `buildingContainerItemAction context and event actions for dialogue/effects/scene/playable/closeBuilding` | `generic runtime shell ownership; flow runtime internals; flow authoring UX; pack migration; legacy deletion` | `Closed locally after EventBindingRuntime payload matching, closeBuilding runtime action, generic building container runtime entrypoint, renderer dispatch metadata, export trigger extra preservation, and full verification; downstream capability remains routed rather than narrowed.` |
| `item.flow-playable-runtime-and-presenter` | `queue-candidate` | `queue.flow-playable-runtime-and-presenter` | `closed` | `none` | `ACC-BUILDING-FLOW-005` | `src/core/contracts/playable-runtime.ts; src/core/runtime/playable-runtime.ts; playable registries; presenter/view modules` | `family=flow, building owner kind, flow lifecycle/presenter/reduce/settlement/handoff` | `Script Editor flow authoring UX; built-in pack migration; legacy deletion` | `Closed locally after shared flow contract/runtime/presenter/settlement/handoff implementation, one high-priority shell-view gap fill, and full verification; downstream capability remains routed rather than narrowed.` |
| `item.script-editor-flow-playable-authoring-ux` | `queue-candidate` | `queue.script-editor-flow-playable-authoring-ux` | `closed` | `none` | `ACC-BUILDING-FLOW-010` | `src/domain/script-editor-project.ts; src/application/script-editor/**; src/ui/main-ui/main-ui-flow.js; runtime-pack export/import; active content` | `first-class flow authoring records, nodes, payloads, outcome routes, owner context, event-start target selection` | `runtime flow internals; container UI; built-in pack migration; legacy deletion` | `Closed locally after full verification; preview flowDefinitionsById gap fill used once.` |
| `item.zhuyuanzhang-building-arrangement-pack-migration` | `queue-candidate` | `queue.zhuyuanzhang-building-arrangement-pack-migration` | `closed` | `none` | `ACC-BUILDING-FLOW-007` | `src/content/scenario-packs/zhuyuanzhang/**; tests/**; runtime pack import/export; active content` | `built-in pack migration to arrangements, containers, events, playables, and rosters without fallback` | `legacy house runtime deletion before parity proof; new gameplay beyond preserving existing functions` | `Closed after explicit migration, generic action-event-flow runtime handoff, one permitted high-priority gap fill, and verification.` |
| `item.legacy-house-runtime-retirement` | `queue-candidate` | `queue.legacy-house-runtime-retirement` | `closed` | `none` | `ACC-BUILDING-FLOW-008` | `src/application/house-modules/**; src/core/registry/house-module-*; src/core/runtime/house-runtime*; src/ui/views/house/**; docs/special-house-interface.md; AGENTS.md` | `delete old house module runtime, registries, sessions, views, deprecated fields, and superseded governance` | `deletion before migrated replacement proof; preserving old code as fallback` | `Closed locally after old runtime/module/view/governance removal and verification; repository sync result pending.` |
| `item.building-arrangement-final-acceptance-and-removal-guard` | `queue-candidate` | `queue.building-arrangement-final-acceptance-and-removal-guard` | `recorded-only` | `all implementation queues close or route blockers` | `ACC-BUILDING-FLOW-009` | `tests/**; browser proof; source guards; version acceptance ledger` | `end-to-end acceptance and no-over-narrowing/removal guards` | `primary feature implementation; version closeout without explicit confirmation` | `Pending final guard queue; cannot be used to implement missing functionality by shrinking acceptance.` |

### Queue Promotion Ledger

| Queue ID | Current Disposition | Promote When | Notes |
| --- | --- | --- | --- |
| `queue.building-arrangement-canonical-schema` | `closed` | `none` | `Closed locally after schema/default/validation verification.` |
| `queue.script-editor-building-arrangement-authoring-ux` | `closed` | `none` | `Closed locally after no-over-narrowing review, implementation, gap fill, and verification.` |
| `queue.runtime-building-shell-and-container-rendering` | `closed` | `none` | `Closed locally after explicit buildingArrangements runtime pack/export/import/materialization and generic shell verification.` |
| `queue.building-container-event-trigger-integration` | `closed` | `none` | `Closed locally after generic container action event dispatch and verification.`
| `queue.flow-playable-runtime-and-presenter` | `closed` | `none` | `Closed locally after shared flow runtime/presenter verification.`
| `queue.script-editor-flow-playable-authoring-ux` | `closed` | `none` | `Closed locally after authoring and preview content verification.`
| `queue.zhuyuanzhang-building-arrangement-pack-migration` | `closed` | `none` | `Closed after migration parity and action-to-flow runtime handoff verification.`
| `queue.legacy-house-runtime-retirement` | `closed` | `none` | `Closed locally after old house runtime retirement implementation and verification; repository sync result pending before next queue execution.`
| `queue.building-arrangement-final-acceptance-and-removal-guard` | `pending-final` | `all implementation queues close or route blockers.` | `Final acceptance only; no version closeout without explicit confirmation.`

### Progress Log

- `2026-07-20`: `Created the formal target from MEMO-022 and the reviewed evidence draft after the operator requested Blueprint-compliant continuous execution from current version candidates. Admitted queue.building-arrangement-canonical-schema as the first active queue.`
- `2026-07-20`: `Closed queue.building-arrangement-canonical-schema locally after required verification passed. Admitted queue.script-editor-building-arrangement-authoring-ux as the next active queue; no version closeout entered.`
- `2026-07-20`: `Closed queue.script-editor-building-arrangement-authoring-ux locally after Script Editor arrangement/container authoring landed and verification passed. The version remains open and returns to promotion-review; no version closeout entered.`
- `2026-07-20`: `Continuous execution paused at promotion-review with no active queue because the next candidate, queue.runtime-building-shell-and-container-rendering, needs an explicit no-over-narrowing admission review for runtime export/materialization fixture ownership before automatic activation.`
- `2026-07-20`: `Admitted queue.runtime-building-shell-and-container-rendering after no-over-narrowing review. Runtime pack/export/import/materialization fixture ownership is absorbed in this queue so the generic runtime shell has explicit buildingArrangements input without old-data inference.`
- `2026-07-20`: `Recorded a version-local temporary execution rule: until all candidates in this target complete, eligible candidate admission review is AI-internal and should auto-continue after recording no-over-narrowing and fixture/materialization/export-import gap decisions, stopping only for parent-spec changes, capability deletion/downgrade, out-of-scope-to-retired rewrites, irresolvable spec/code conflicts, or product decisions.`
- `2026-07-20`: `Closed queue.runtime-building-shell-and-container-rendering locally after focused RED/GREEN tests, npm run typecheck, npm run lint:blueprints, and npm test passed. Admitted queue.building-container-event-trigger-integration automatically under the version-local temporary execution rule; no version closeout entered.`
- `2026-07-20`: `Closed queue.building-container-event-trigger-integration locally after focused RED/GREEN tests, npm run typecheck, npm run lint:blueprints, and npm test passed. Admitted queue.flow-playable-runtime-and-presenter automatically under the version-local temporary execution rule and playable governance classification as shared-contract work; no version closeout entered.`
- `2026-07-20`: `Closed queue.flow-playable-runtime-and-presenter locally after focused RED/GREEN tests, npm run typecheck, npm run lint:blueprints, and npm test passed. Admitted queue.script-editor-flow-playable-authoring-ux automatically under the version-local temporary execution rule; no version closeout entered.`
- `2026-07-20`: `Closed queue.script-editor-flow-playable-authoring-ux after first-class flows[] authoring, independent UI, project/runtime pack round-trip, active-content preview indexing, one high-priority gap fill, and full verification. Admitted queue.zhuyuanzhang-building-arrangement-pack-migration automatically under the version-local temporary execution rule; no version closeout entered.`
- `2026-07-21`: `Closed queue.zhuyuanzhang-building-arrangement-pack-migration after explicit 21-city/189-arrangement migration, generic action -> EventBindingRuntime -> authored flow execution, one permitted high-priority gap fill, and verification. Admitted queue.legacy-house-runtime-retirement automatically under the version-local temporary execution rule; no version closeout entered.`
- `2026-07-21`: `Strengthened the version-local temporary execution rule after an audit-response pause exposed a process gap: current-version queue completeness audits now feed execution records and continuation when findings remain inside the parent spec, and final responses require a stop-condition self-check before stopping at advice.`
- `2026-07-21`: `Filled the in-parent-spec Zhu Yuanzhang action-menu event/flow parity gap before legacy deletion: all 630 migrated action-menu eventIds now have explicit event definitions and building-container-item-action bindings; non-leave actions have authored flow definitions; leave actions have closeBuilding event actions. Typecheck, Blueprint lint, and full tests passed. queue.legacy-house-runtime-retirement advanced from evidence reconcile to implementation without version closeout.`
- `2026-07-21`: `Extended the version-local temporary execution rule so each queue closeout attempts repository synchronization with the development trunk and records the result before continuing; sync failure is a recorded repository result and does not block same-version queue progression unless it exposes a true code/spec blocker.`
- `2026-07-21`: `Closed queue.legacy-house-runtime-retirement locally after deleting superseded house modules, house registries, old core/application house runtimes, old house UI views, special-house governance, and fallback building presentation paths. Verification passed: npm run typecheck, npm run lint:blueprints, and npm test. Repository sync result is pending record before automatic admission of queue.building-arrangement-final-acceptance-and-removal-guard; no version closeout entered.`
- `2026-07-21`: `Recorded the post-closeout repository sync for queue.legacy-house-runtime-retirement as succeeded against origin/mod-first-dev, then continued toward the final guard candidate without entering version closeout.`
