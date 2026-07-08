# Project Complete Modularization Target Plan

## Control Block

- document_role: `target-governor`
- target_id: `target.project-complete-modularization`
- target_status: `open`
- active_phase: `phase.final-acceptance`
- active_queue: `none`
- decision_state: `promotion-review`
- next_decision: `same-target-admission-or-target-closeout`
- next_action: `return-to-promotion-review`
- resume_gate: `promotion-review`
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
- blocked_by: []

## Human Context

### Queue Promotion Ledger

| Queue ID | Current Disposition | Promote When | Notes |
| --- | --- | --- | --- |
| `queue.state-sync-and-runtime-canonicalization` | `candidate` | `only if a fresh runtime/state canonicalization blocker is proven and target-level review later selects it as the next unique shared-contract queue` | `Fresh 2026-07-08 evidence now shows still-live bridge and transitional contract residue in src/core/runtime/state-sync-runtime.ts, src/core/runtime/runtime-dispatch.ts, src/core/contracts/runtime-result.ts, src/core/contracts/house-runtime.ts, src/core/contracts/runtime-request.ts, and src/core/runtime/interactive-runtime.ts. It remains candidate-only until a later target-level admission review selects it.` |
| `queue.unified-contribution-intake-closeout` | `candidate` | `only if a fresh intake-path blocker is proven` | `Previously rejected on current evidence.` |
| `queue.playable-family-gap-audit` | `closed` | `only if a still-live playable-family gap is proven` | `Closed on 2026-07-07 after playable contribution truth and activation-configurable default runtime registries landed and verification passed.` |
| `queue.framework-scaffold-and-template-closure` | `candidate` | `only if framework-owned authoring coverage is disproven` | `Accepted compatibility residue alone is insufficient.` |
| `queue.zhuyuanzhang-scenario-pack-integration` | `done` | `only if fresh evidence disproves the closed queue record or a new same-target pack-integration residue is later proven` | `Admitted on 2026-07-08 after fresh evidence showed src/content/pack-content-access.ts still hard-imports zhuyuanzhang pack tables and house-content JSON into shared content adapters. Returned to target-level review later the same day after the last lawful same-surface slice removed src/content/houses/temple-house-content.ts as a zero-consumer false positive and the remaining seven house-content residues proved they need upstream shared capability. After the shared-contract queue landed the first houseModuleDefaults slice, blocked-queue recovery review on 2026-07-08 concluded that the blocker was materially lifted and that keep-house was the unique smallest resumed decoupling slice, so this queue became active again. It is now closed on 2026-07-08 after queue-closeout sync confirmed that the resumed implementation task fully removed the remaining lawful grain-shop residue and no new upstream queue is needed for this residue family.` |
| `queue.shared-contract-upgrade-governance` | `done` | `only if fresh evidence proves the blocked zhuyuanzhang queue cannot continue without a new shared scenario-pack/content-pack capability` | `Admitted on 2026-07-08 after fresh blocker evidence proved the remaining home/keep/grain/market/medicine/tavern/tea house-content residues all require a new shared house-default capability family across contract, loader, validator, active-content, and consumer layers. Closed later the same day after the first shared module-keyed houseModuleDefaults slice landed and target control returned to admission review.` |
| `queue.ui-runtime-contract-consumption` | `closed` | `only if runtime-facing UI contract bypass is proven` | `Closed on 2026-07-07 after the bounded shared-dialog replacement landed and verification passed.` |
| `queue.runtime-contract-registry-seam-closure` | `candidate` | `only if a fresh consumer-side runtime bypass remains and target-level review later selects a dedicated seam-closure queue rather than absorbing the work elsewhere` | `Fresh 2026-07-08 source audit shows application and content consumers still bypass contract or registry seams through direct runtime or registry imports, including src/application/runtime/interactive-action-coordinator.ts, src/application/house-modules/grain-shop/grain-shop-house-module.ts, src/application/house-modules/medicine-house/medicine-house-house-module.ts, src/application/presenter/stage-presenters.ts, and src/application/house/house-runtime.ts. It remains candidate-only until a later target-level admission review selects a bounded next queue.` |
| `queue.zhuyuanzhang-pack-structure-and-authoring-normalization` | `candidate` | `only if a fresh audit still proves zhuyuanzhang pack-owned truth remains hardcoded outside the canonical scenario-pack boundary and target-level review later selects one bounded package-normalization queue` | `Fresh 2026-07-08 source audit shows zhuyuanzhang pack truth is still split across JSON tables and pack-external TypeScript hardcoding. src/content/base-game-content-pack.ts still binds the builtin default pack to zhuyuanzhang pack.json by hardcoded path, src/content/pack-content-access.ts still hard-imports zhuyuanzhang JSON tables, src/content/prototype-world.ts still embeds large zhuyuanzhang-owned cities or houses or characters or refusal-rule truth directly in TypeScript, and src/main.ts plus startup scaffolding still seed zhuyuanzhang-specific startup or story-state assumptions. The pack is already split by pack.json, but oversized monolithic tables such as maps.json, characters.json, houses.json, historical-characters.json, and text-entries.json still show editor-prep normalization residue inside the package boundary.` |
| `queue.cross-mechanism-composition-contract-closure` | `candidate` | `only if a fresh audit still proves menu/dialog/map/city/house/story/task/minigame composition remains spread across owner-specific coordinators and direct state writes and target-level review later selects a dedicated composition queue` | `Fresh 2026-07-08 source audit shows the covered mechanism composition surface still lacks one contract-driven composition seam. src/application/runtime/main-runtime-orchestrator.ts, src/application/runtime/interactive-action-coordinator.ts, src/application/runtime/city-house-transition-coordinator.ts, src/application/house/house-runtime.ts, src/application/story-battle/story-battle-runtime.ts, and src/main.ts still each own cross-mechanism composition outcomes such as view switching, dialogue opening, house reentry, story advancement, and render-triggered orchestration. This remains candidate-only pending later target-level admission review.` |
| `queue.review-cadence-follow-up-contract-closure` | `candidate` | `only if a fresh audit still proves council or review or evaluation cadence remains fragmented across story or time or house or follow-up owners and target-level review later selects a dedicated cadence queue` | `Fresh 2026-07-08 source audit shows timed review and follow-up composition is still fragmented. src/application/runtime/navigation-time-follow-up.ts, src/application/runtime/council-priority-city-begging-coordinator.ts, src/application/story-battle/story-battle-runtime.ts, src/application/time/time-progression.ts, src/application/house-modules/keep-house/keep-house-house-module.ts, src/application/house-modules/home-house/home-house-house-module.ts, src/application/house-modules/temple-house/temple-house-house-module.ts, and src/main.ts still each mutate councilDate or reviewCountdown or reviewDateText or mainHouseMissionText or council-arrival dialogue through owner-local logic rather than one contract-driven cadence surface. docs/blueprints/specs/2026-07-08-review-cadence-follow-up-shared-review-support-spec.md now freezes the intended shared-mechanism boundary for today's review / 今日评定 under this same queue identity.` |
| `queue.main-shell-and-layout-editor-ownerization` | `done` | `only if fresh evidence proves main.ts still owns non-shell UI/editor state decisions and the layout editor still lacks an independent owner line` | `Reactivated on 2026-07-08 after fresh source audit disproved the prior pure-shell closeout basis. Fresh ownerization evidence later the same day landed the bounded recovery cut, and fresh reclosure-closeout verification then confirmed npm run lint:blueprints, npm run typecheck, and npm test all pass on the current branch. The queue is now closed historical evidence again and no longer remains active.` |

### Candidate Classification Record

| Item ID | Classification | Proposed Queue | Disposition | Basis |
| --- | --- | --- | --- | --- |
| `item.zhuyuanzhang-scenario-pack-integration` | `queue-candidate` | `queue.zhuyuanzhang-scenario-pack-integration` | `admitted + blocked handoff written` | `Fresh evidence first showed the current production path still depends on pack-private zhuyuanzhang hard-import glue, while the current shared scenario-pack surface was sufficient for a bounded queue. Later queue execution proved that after the last lawful same-surface slice, the remaining residue requires upstream shared capability rather than another in-queue decoupling cut.` |
| `item.shared-contract-upgrade-governance` | `queue-candidate` | `queue.shared-contract-upgrade-governance` | `admitted + done` | `Fresh blocker evidence from queue.zhuyuanzhang-scenario-pack-integration proved the remaining seven house-content adapter residues could not continue under the current shared surface because no shared house-content/default-content slot family or equivalent loader, validator, active-content, or consumer support existed. The admitted queue then landed the first module-keyed houseModuleDefaults slice and returned control to target-level review.` |
| `item.main-ts-pure-shell-reclosure` | `queue-candidate` | `queue.main-shell-and-layout-editor-ownerization` | `admitted + done` | `Fresh 2026-07-08 source audit first disproved the closed pure-shell record and reopened the queue on one bounded recovery cut. Fresh ownerization evidence then showed that cut implemented: src/main.ts no longer directly imports layout-editor-actions, applyRenderPrepassState, ui/app-render markup helpers, or layout-editor preset constructors, and the repeated layout-editor, render, and layout bootstrap owner lines were restored behind existing seams. Fresh reclosure-closeout verification now confirms npm run lint:blueprints, npm run typecheck, and npm test all pass, so the queue is closed again on current evidence.` |
| `item.runtime-contract-hardening-round-2` | `queue-candidate` | `queue.state-sync-and-runtime-canonicalization` | `candidate-only` | `Fresh 2026-07-08 source audit shows the runtime contract surface still carries transitional bridge and settlement shapes outside a single canonical seam: src/core/runtime/state-sync-runtime.ts still exposes RuntimeStateBridgeInput, RuntimeResultBridgeInput, createRuntimeBridgeState, and applyRuntimeBridgeState around state-sync-app-bridge; src/core/contracts/house-runtime.ts and src/core/contracts/runtime-request.ts still maintain parallel request families; src/core/contracts/runtime-result.ts plus src/core/runtime/runtime-dispatch.ts still split result, task, interactive, follow-up, and settlement channels; and src/core/runtime/interactive-runtime.ts still depends on legacyInteractiveKind plus createLegacyPlayableSession. This fits the previously recorded shared queue.state-sync-and-runtime-canonicalization identity and now remains target-level candidate review only until a later admission decision selects it.` |
| `item.runtime-contract-registry-seam-closure` | `queue-candidate` | `queue.runtime-contract-registry-seam-closure` | `candidate-only` | `Fresh 2026-07-08 source audit shows pack/scenario/house/playable consumers still reach across the intended contract or registry seam: src/application/runtime/interactive-action-coordinator.ts imports core runtime executors directly; src/application/house-modules/grain-shop/grain-shop-house-module.ts and src/application/house-modules/medicine-house/medicine-house-house-module.ts still import core/runtime/playable-runtime plus application/playables/house-playable-runtime-bridge; and src/application/presenter/stage-presenters.ts plus src/application/house/house-runtime.ts still consume builtin registries directly. This is a distinct owner-line closure candidate and now remains target-level candidate review only until a later admission decision selects it.` |
| `item.zhuyuanzhang-pack-hardcode-consolidation-and-editor-prep` | `queue-candidate` | `queue.zhuyuanzhang-pack-structure-and-authoring-normalization` | `candidate-only` | `Fresh 2026-07-08 source audit shows the zhuyuanzhang package still lacks one canonical package-owned authoring boundary. src/content/base-game-content-pack.ts hardcodes zhuyuanzhang as the builtin default manifest path, src/content/pack-content-access.ts still hard-imports zhuyuanzhang activities or events or scenes or text and remaining house JSON directly, src/content/prototype-world.ts still carries large zhuyuanzhang-owned scenario truth in TypeScript instead of pack-local JSON, and src/main.ts still seeds zhuyuanzhang-specific prototype and haozhou-return startup assumptions. Within src/content/scenario-packs/zhuyuanzhang itself, pack.json already points to split tables, but maps.json, characters.json, houses.json, historical-characters.json, and text-entries.json remain large monolithic files, so package-local subtable normalization stays as bounded editor-prep residue rather than a separate editor queue.` |
| `item.cross-mechanism-composition-contract-closure` | `queue-candidate` | `queue.cross-mechanism-composition-contract-closure` | `candidate-only` | `Fresh 2026-07-08 source audit shows menu or dialogue or map or city or house or story or task or minigame composition still lacks one contract-driven combination seam. src/application/runtime/main-runtime-orchestrator.ts still combines startup-session, story-scene advance, choice handling, and trigger-story-events ownership; src/application/runtime/interactive-action-coordinator.ts still combines activity-qte, story-scene, and story-battle action flow; src/application/runtime/city-house-transition-coordinator.ts and src/application/house/house-runtime.ts still own cross-mechanism view and dialogue transitions; src/application/story-battle/story-battle-runtime.ts still returns story, house, and review outcomes directly; and src/main.ts still assembles and bridges all of these owners. This is a bounded owner-line closure candidate rather than a continuation of the current main-shell queue.` |
| `item.review-cadence-follow-up-contract-closure` | `queue-candidate` | `queue.review-cadence-follow-up-contract-closure` | `candidate-only` | `Fresh 2026-07-08 source audit shows timed review and follow-up cadence remains fragmented across multiple owners. src/application/runtime/navigation-time-follow-up.ts still opens council-arrival dialogue and clears unrelated app surfaces on threshold crossing; src/application/runtime/council-priority-city-begging-coordinator.ts still enforces review-time refusal and begging launch policy; src/application/story-battle/story-battle-runtime.ts still resets councilDate, reviewDateText, mainHouseMissionText, and KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown after battle completion; src/application/time/time-progression.ts still updates review text and countdown independently; and keep-house, home-house, temple-house, plus src/main.ts still each seed or rewrite the same review cadence fields. docs/blueprints/specs/2026-07-08-review-cadence-follow-up-shared-review-support-spec.md now records the bounded design target: review remains a shared cadence mechanism, not a keep/temple-private feature, not a shared-dialog-only extraction, and not a new review sub-runtime.` |
| `item.legacy-adapter-and-bridge-retirement` | `current-target-item` | `none` | `candidate-only bounded cleanup` | `Fresh 2026-07-08 audit shows mixed residue rather than one admission-ready queue. src/core/adapters/legacy-house-adapter.ts is now dead placeholder residue, but state-sync-app-bridge, house-playable-runtime-bridge, legacyInteractiveKind, createLegacyPlayableSession, and transitional runtime request/result bridge helpers still have live consumers on the covered path. Deletion is therefore not yet a lawful standalone queue admission; it stays as bounded cleanup to revisit after upstream contract and seam work lands.` |
| `item.home-keep-fallback-retirement` | `current-target-item` | `none` | `candidate-only dead cleanup` | `Fresh source audit shows src/application/house-modules/home-house/home-house-house-module.ts and src/application/house-modules/keep-house/keep-house-house-module.ts now consume shared houseModuleDefaults through defaultRuntimeContent rather than src/content/houses/home-house-content.ts or src/content/houses/keep-house-content.ts. The legacy home or keep fallback TS plus JSON path remains only through src/content/pack-content-access.ts and boundary tests, so current evidence shows dead cleanup residue rather than a live implementation queue or an admission-ready blocker.` |
| `item.zhuyuanzhang-scenario-pack-integration-closeout-sync` | `current-target-item` | `none` | `executed + done` | `Fresh governance audit confirms docs/blueprints/queues/zhuyuanzhang-scenario-pack-integration-queue.md already records task.zhuyuanzhang-scenario-pack-integration.pack-private-content-access-decoupling = done, task.zhuyuanzhang-scenario-pack-integration.queue-closeout = done, queue_status = done, and closeout_status = done. The current legal governance action was queue-closeout synchronization only, and that sync is now already completed with target control returned to promotion-review and no active queue.` |

### Admission Review Record

- Scope approval:
  - `The bounded dialog-unification scope was user-approved as scope only.`
  - `That scope approval is not treated as queue admission truth.`
- Admission basis:
  - `queue.ui-runtime-contract-consumption was admitted only after the target plan and queue doc were synchronized with written runtime-facing UI contract bypass evidence.`
  - `queue.playable-family-gap-audit was admitted because src/core/contracts/gameplay-contribution.ts and src/core/contracts/mod-manifest.ts exposed no playable-family contribution contract, while src/core/runtime/playable-runtime.ts still fell back to builtin playable registries and the builtin playable definition/integration registries still seeded covered production playables directly.`
  - `queue.main-shell-and-layout-editor-ownerization was admitted because src/main.ts still owned layout editor behavior, render scheduling ownership, and too many business-driven render triggers on the covered production path.`
  - `queue.zhuyuanzhang-scenario-pack-integration was admitted because src/content/pack-content-access.ts still hard-imports zhuyuanzhang pack tables and house-content JSON into shared content adapters, while src/application/scenario/scenario-pack-loader.ts and src/content/scenario-packs/zhuyuanzhang/pack.json already prove that a bounded decoupling slice can proceed under the current shared scenario-pack surface.`
- Current review subject:
  - `none`
- Current handoff:
  - `Fresh 2026-07-08 reclosure-closeout verification confirms that item.main-ts-pure-shell-reclosure no longer needs an active queue. src/main.ts still stays on the accepted pure-shell line, the bounded reclosure ownerization cut remains intact behind application/layout-editor/layout-editor-coordinator.ts, application/presenter/app-render-coordinator.ts, and application/layout-editor/layout-editor-bootstrap.ts, and npm run lint:blueprints plus npm run typecheck plus npm test all pass on the current branch. Target control therefore returns to promotion-review with no active queue rather than staying in queue-local execution or blocker handling.`
  - `Fresh 2026-07-08 runtime-contract audit records item.runtime-contract-hardening-round-2 as queue-candidate under the existing queue.state-sync-and-runtime-canonicalization identity. The evidence is still bounded and target-level candidate review now remains the only legal state: src/core/runtime/state-sync-runtime.ts still exposes bridge state/result helpers around state-sync-app-bridge, src/core/contracts/runtime-request.ts and src/core/contracts/house-runtime.ts still split request families, src/core/contracts/runtime-result.ts plus src/core/runtime/runtime-dispatch.ts still split follow-up or task or settlement result channels, and src/core/runtime/interactive-runtime.ts still depends on legacyInteractiveKind plus createLegacyPlayableSession.`
  - `Fresh 2026-07-08 consumer-seam audit records item.runtime-contract-registry-seam-closure as a second queue-candidate. Application and content consumers still bypass contract or registry seams through direct runtime or registry imports, including src/application/runtime/interactive-action-coordinator.ts, src/application/house-modules/grain-shop/grain-shop-house-module.ts, src/application/house-modules/medicine-house/medicine-house-house-module.ts, src/application/presenter/stage-presenters.ts, and src/application/house/house-runtime.ts, but single-active-queue mode keeps this item at target-level candidate review only.`
  - `Fresh 2026-07-08 zhuyuanzhang package audit records item.zhuyuanzhang-pack-hardcode-consolidation-and-editor-prep as another queue-candidate. zhuyuanzhang-owned truth still remains hardcoded outside the canonical package boundary through src/content/base-game-content-pack.ts, src/content/pack-content-access.ts, src/content/prototype-world.ts, and zhuyuanzhang-specific startup assumptions in src/main.ts, while the pack-local JSON structure still includes editor-prep residue in oversized monolithic tables such as maps.json, characters.json, houses.json, historical-characters.json, and text-entries.json. This remains candidate-only until a later target-level review decides whether the bounded package-normalization queue should be admitted.`
  - `Fresh 2026-07-08 mechanism audit records item.cross-mechanism-composition-contract-closure as another queue-candidate. main-runtime-orchestrator, interactive-action-coordinator, city-house-transition-coordinator, house-runtime, story-battle-runtime, and src/main.ts still distribute menu or dialogue or map or city or house or story or task or minigame combination outcomes across owner-local branches instead of one contract-driven composition surface, so target-level review keeps this candidate dormant until a later admission decision selects it.`
  - `Fresh 2026-07-08 cadence audit records item.review-cadence-follow-up-contract-closure as a separate queue-candidate. navigation-time-follow-up, council-priority-city-begging-coordinator, story-battle-runtime, time-progression, keep-house, home-house, temple-house, and src/main.ts still each rewrite councilDate or reviewCountdown or reviewDateText or mainHouseMissionText or council-arrival dialogue locally, so the review/evaluation cadence still lacks a unified follow-up contract surface. docs/blueprints/specs/2026-07-08-review-cadence-follow-up-shared-review-support-spec.md now freezes the desired shared-mechanism shape for today's review / 今日评定 so later admission can prove one bounded cadence queue instead of rediscovering host/state/visibility boundaries from scratch.`
  - `Fresh 2026-07-08 adapter audit records item.legacy-adapter-and-bridge-retirement as current-target-item cleanup rather than a new queue. src/core/adapters/legacy-house-adapter.ts is dead placeholder residue, but state-sync-app-bridge, house-playable-runtime-bridge, legacyInteractiveKind, createLegacyPlayableSession, and transitional runtime bridge helpers still have live covered consumers, so broad deletion would be premature on current evidence.`
  - `item.home-keep-fallback-retirement remains candidate-only dead cleanup, and item.zhuyuanzhang-scenario-pack-integration-closeout-sync remains executed plus done. queue.shared-contract-upgrade-governance and queue.zhuyuanzhang-scenario-pack-integration now remain historical evidence only; neither is reopened by this candidate sync.`
  - `Single-active-queue mode remains in force. Recording these new runtime candidates does not activate a second queue, does not replace the current active queue, and does not authorize new implementation before a later target-level admission review.`

### Queue Admission Startup Rules

1. `Read project-progress -> blueprint -> target plan -> active queue before evaluating a fresh queue item.`
2. `If an active queue exists, test whether the new item can be absorbed before considering a new queue.`
3. `If the item becomes queue-candidate, write target-plan review truth before any queue activation or implementation begins.`
4. `User scope approval remains scope approval only and must not be treated as queue admission.`

### Candidate Recovery Rule

- `Use this target plan's existing queue promotion ledger and prior review fields as the default recovery source for previously recorded queue-candidates.`
- `Do not restart a full re-audit unless new material evidence invalidates the prior classification or admission basis.`

### Operator Intake Contract

- Allowed operator intake:
  - `新需求`
  - `参考治理规范`
- Internal-only Blueprint work:
  - `read project-progress -> blueprint -> target plan -> active queue -> active task`
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

### Target Lifecycle Rules

- `This target stays open until target closeout is explicitly confirmed and written into target-level truth.`
- `active_queue = none does not close the target; it only returns the target to idle-open or promotion-review.`
- `As long as this target remains open, additional same-target queues may still be admitted.`
- `Only when target acceptance is satisfied and no active queue remains may one explicit target-closeout confirmation be asked.`
- `If target closeout is not explicitly confirmed, keep the target open and continue using same-target admission review for new queue work.`

### Queue Closeout Rules

- `next_effect = promote-next-queue`
- `next_effect = return-to-target-review`
- `next_effect = block-target`

Optional mirror:

- `docs/change-log.md` may be updated after governance truth is already synchronized`

### Post-Task Auto-Reconcile

1. `Run verify_with for the completed task.`
2. `Check done_when.`
3. `Write the task after-state, queue truth, and any required target truth before any repository sync begins.`
4. `Re-evaluate whether the queue should continue, close, or block.`
5. `Scan governance owners: project-progress, blueprint, target spec, target plan, queue doc, and affected shared contracts.`
6. `Scan residue: tracked leftovers, untracked drafts, unsynced truth, and out-of-scope remains.`
7. `Run one minimum repository sync batch after the docs are updated.`
8. `If the next legal execution point is unique, continue directly into queue closeout or target-review handoff once the sync attempt returns a result.`
9. `Sync target-level truth if queue closeout or promotion conditions changed.`
10. `Optionally mirror the result into change-log if a human-readable summary is warranted.`

### Human Confirmation Throttle

- `At most one human-confirmation question may be asked per task.`
- `If the target/queue/task boundary can be resolved from current docs and code, do not ask.`
- `If an item is uncertain but would not change active truth, record uncertain-needs-review and stop without asking.`
- `If active truth would change and multiple mutually exclusive legal branches exist, one human escalation is allowed.`
- `Do not treat user scope approval as queue admission.`
- `Do not ask whether to do closeout, promotion review, or doc sync when they are already the unique next legal step.`
- `Do not raise decision_required merely because repository sync failed.`
- `Do not ask about a merge conflict when current target truth already uniquely decides the legal resolution.`
- `Ask only when the baseline is ambiguous or when merge-conflict handling has multiple mutually exclusive legal resolutions that current target truth cannot decide alone.`
- `Exception: target closeout still requires explicit human confirmation before target_status changes to done.`

### Repository Sync Policy

- `Git sync is non-governing.`
- `commit / push / merge must not change queue truth, target truth, candidate truth, or transition truth.`
- `push / merge must not become a queue closeout gate.`
- `push / merge must not become a target closeout gate.`
- `Task execution conclusions are written first; repository sync runs second.`
- `A failed sync attempt is recorded only as repository sync result in the queue-local sync record.`
- `A merge conflict is a repository sync event; it must not rewrite the already-recorded task, queue, or target conclusion.`
- `If current target truth uniquely decides the merge conflict direction, resolve it without asking.`
- `Target scheduling must not read sync_status, sync_scope, or sync_summary as live truth.`

### Minimum Repository Sync Batch

1. `Draft the commit message as <type>: <brief title> plus a Summary: block with real bullets.`
2. `Run commit-message validation before commit.`
3. `Commit the working branch.`
4. `Push the working branch.`
5. `Merge into the latest mod-first-dev baseline.`
6. `Push mod-first-dev baseline.`
7. `Resume from the written Blueprint truth after the sync attempt returns success or failure.`

### State Transition Rules

- `idle-open -> promotion-review`
  - `when a queue-candidate has sufficient evidence and target-level admission is required`
- `promotion-review -> active-execution`
  - `when a queue is formally promoted and written into this plan`
- `promotion-review -> idle-open`
  - `when the review result is reject or defer and no queue is admitted`
- `promotion-review -> blocked`
  - `when decision requires external blocker resolution or explicit user choice`
- `active-execution -> promotion-review`
  - `when an active queue closes and an admission decision is pending`
- `active-execution -> idle-open`
  - `when an active queue closes and no admission decision is pending`

### Prior Promotion Record

- `2026-07-06: queue.unified-contribution-intake-closeout was rejected on current evidence and remained a conditional fallback only.`
- `2026-07-06 to 2026-07-07: authoring, residue, acceptance-proof, and final-acceptance queues were closed as bounded queue records rather than target-level truth.`
- `2026-07-07: target closeout was intentionally pulled back to open + idle-open so same-target queue admission remains legal until explicit target closeout is written.`
- `2026-07-07: queue.ui-runtime-contract-consumption was admitted after a bounded dialog-component audit proved still-live runtime-facing UI contract bypass on the covered path.`
- `2026-07-07: queue.ui-runtime-contract-consumption was closed after the bounded shared-dialog component landed, approved replacement points were consumed, and verification passed; target state returned to open with no active queue.`
- `2026-07-07: queue.playable-family-gap-audit was admitted after fresh evidence proved the playable family still lacks a shared mod contribution contract and still relies on builtin registry seed + runtime fallback on the covered production path.`
- `2026-07-07: queue.playable-family-gap-audit was closed after playable contribution truth and activation-configurable default runtime registries landed, and verification passed; target state returned to open with no active queue.`
- `2026-07-07: queue.main-shell-and-layout-editor-ownerization was admitted after fresh evidence proved src/main.ts still owns non-shell layout editor behavior, render scheduling ownership, and runtime layout baseline bootstrap on the covered production path.`
- `2026-07-08: queue.main-shell-and-layout-editor-ownerization ownerization work reached the accepted pure-shell line on fresh source evidence, and the queue was closed as historical evidence only; the known repository-wide import.meta and ?url asset typing/configuration gap remains outside that finished queue slice, so target state returned to idle-open with no active queue.`
- `2026-07-08: item.zhuyuanzhang-scenario-pack-integration and item.shared-contract-upgrade-governance were both classified as queue-candidate. queue.zhuyuanzhang-scenario-pack-integration was admitted and activated as the single active queue because current code still shows pack-private zhuyuanzhang integration glue on the production path, while queue.shared-contract-upgrade-governance remained candidate-only because no missing shared capability is yet proved as the immediate blocker.`
- `2026-07-08: queue.zhuyuanzhang-scenario-pack-integration completed its last lawful same-surface slice by removing src/content/houses/temple-house-content.ts as a zero-consumer false positive, then exited active execution with a structured blocker because the remaining seven house-content residues require upstream shared capability. Target control returned to promotion review with item.shared-contract-upgrade-governance as the pending admission subject.`
- `2026-07-08: item.shared-contract-upgrade-governance was formally admitted and activated as queue.shared-contract-upgrade-governance after fresh blocker evidence proved the current shared contract/loader/validator/active-content/consumer chain has no house-default capability family for the remaining seven blocked house residues.`
- `2026-07-08: queue.shared-contract-upgrade-governance closed after landing the first shared houseModuleDefaults slice through contract, loader, validator, active-content/default-runtime exposure, and one home-house consumer proof. Target control returned to promotion review with item.zhuyuanzhang-scenario-pack-integration as the next review subject rather than auto-reactivating any queue.`
- `2026-07-08: blocked-queue recovery review for queue.zhuyuanzhang-scenario-pack-integration compared all seven recorded house residues against the landed houseModuleDefaults surface and concluded resume was now legal. The blocker is materially lifted, and keep-house is the unique smallest resumed slice, so target control moved back to active execution with queue.zhuyuanzhang-scenario-pack-integration as the only active queue.`
