# Project Complete Modularization Target Plan

## Control Block

- document_role: `target-governor`
- target_id: `target.project-complete-modularization`
- target_status: `open`
- active_phase: `phase.final-acceptance`
- active_queue: `none`
- decision_state: `promotion-review`
- next_decision: `same-target-admission-or-target-closeout`
- next_action: `classify-fresh-work`
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
| `queue.state-sync-and-runtime-canonicalization` | `done` | `only if a fresh runtime/state canonicalization blocker is proven and target-level review later selects it as the next unique shared-contract queue` | `Admitted on 2026-07-08 after fresh evidence showed still-live bridge and transitional contract residue in src/core/runtime/state-sync-runtime.ts, src/core/runtime/runtime-dispatch.ts, src/core/contracts/runtime-result.ts, src/core/contracts/house-runtime.ts, src/core/contracts/runtime-request.ts, and src/core/runtime/interactive-runtime.ts. Closed on 2026-07-09 after the covered core runtime path converged on the canonical app-state/runtime helper seam, one followUp seam, one taskInputs seam, one post-route settlement helper seam, and no remaining legacyInteractiveKind or createLegacyPlayableSession dependency on the covered path.` |
| `queue.unified-contribution-intake-closeout` | `candidate` | `only if a fresh intake-path blocker is proven` | `Previously rejected on current evidence.` |
| `queue.playable-family-gap-audit` | `closed` | `only if a still-live playable-family gap is proven` | `Closed on 2026-07-07 after playable contribution truth and activation-configurable default runtime registries landed and verification passed.` |
| `queue.framework-scaffold-and-template-closure` | `candidate` | `only if framework-owned authoring coverage is disproven` | `Accepted compatibility residue alone is insufficient.` |
| `queue.prototype-startup-bootstrap-ownerization` | `done` | `only if a fresh audit still proves builtin prototype startup bootstrap remains main.ts-owned or prototype-world-coupled and target-level review later selects one bounded startup ownerization queue` | `Admitted on 2026-07-09 because src/main.ts still owned createPrototypeAppState together with prototype-stage selection, mission-text bootstrap, review bootstrap variables, and layout-editor startup assembly even though src/application/startup/startup-session-coordinator.ts already owned startup-session routing. Closed later the same day after the covered startup app-state builder moved into src/application/startup/prototype-startup-app-state.ts and queue-local residue review concluded that the remaining prototype-world plus test-harness coupling no longer forms one unique same-queue implementation slice.` |
| `queue.zhuyuanzhang-scenario-pack-integration` | `done` | `only if fresh evidence disproves the closed queue record or a new same-target pack-integration residue is later proven` | `Admitted on 2026-07-08 after fresh evidence showed src/content/pack-content-access.ts still hard-imports zhuyuanzhang pack tables and house-content JSON into shared content adapters. Returned to target-level review later the same day after the last lawful same-surface slice removed src/content/houses/temple-house-content.ts as a zero-consumer false positive and the remaining seven house-content residues proved they need upstream shared capability. After the shared-contract queue landed the first houseModuleDefaults slice, blocked-queue recovery review on 2026-07-08 concluded that the blocker was materially lifted and that keep-house was the unique smallest resumed decoupling slice, so this queue became active again. It is now closed on 2026-07-08 after queue-closeout sync confirmed that the resumed implementation task fully removed the remaining lawful grain-shop residue and no new upstream queue is needed for this residue family.` |
| `queue.shared-contract-upgrade-governance` | `done` | `only if fresh evidence proves the blocked zhuyuanzhang queue cannot continue without a new shared scenario-pack/content-pack capability` | `Admitted on 2026-07-08 after fresh blocker evidence proved the remaining home/keep/grain/market/medicine/tavern/tea house-content residues all require a new shared house-default capability family across contract, loader, validator, active-content, and consumer layers. Closed later the same day after the first shared module-keyed houseModuleDefaults slice landed and target control returned to admission review.` |
| `queue.ui-runtime-contract-consumption` | `closed` | `only if runtime-facing UI contract bypass is proven` | `Closed on 2026-07-07 after the bounded shared-dialog replacement landed and verification passed.` |
| `queue.runtime-contract-registry-seam-closure` | `done` | `only if a fresh consumer-side runtime bypass remains and target-level review later selects a dedicated seam-closure queue rather than absorbing the work elsewhere` | `Admitted on 2026-07-09 after fresh source evidence showed the covered application path still bypassed the intended runtime or registry seam through direct core runtime executor imports, direct core builtin house-module registry fallbacks, and direct core playable-runtime imports on covered house consumers. Closed on 2026-07-09 after house-runtime plus stage-presenters moved onto the application-owned house-module-registry seam, interactive-action-coordinator moved onto src/application/runtime/runtime-request-seam.ts, grain-shop plus medicine-house moved onto src/application/playables/house-playable-runtime-bridge.ts for covered playable runtime ownership, and npm run lint:blueprints, npm run typecheck, and npm test all passed.` |
| `queue.zhuyuanzhang-pack-structure-and-authoring-normalization` | `done` | `only if a fresh audit still proves zhuyuanzhang pack-owned truth remains hardcoded outside the canonical scenario-pack boundary and target-level review later selects one bounded package-normalization queue` | `Admitted on 2026-07-09 because the bounded package-normalization blocker still held on current source truth and the hardcoded builtin default-pack binding was the smallest lawful first slice. Closed later the same day after src/content/base-game-content-pack.ts converged on catalog-driven default manifest resolution, the browser startup path was re-stabilized on absolute manifest URLs, and queue-local residue review concluded that the remaining pack-content-access fallout is mixed or dead cleanup while prototype-world plus src/main.ts now represent a broader prototype-bootstrap residue family rather than one unique same-queue next cut.` |
| `queue.cross-mechanism-composition-contract-closure` | `candidate` | `only if a fresh audit still proves menu/dialog/map/city/house/story/task/minigame composition remains spread across owner-specific coordinators and direct state writes and target-level review later selects a dedicated composition queue` | `Fresh 2026-07-08 source audit shows the covered mechanism composition surface still lacks one contract-driven composition seam. src/application/runtime/main-runtime-orchestrator.ts, src/application/runtime/interactive-action-coordinator.ts, src/application/runtime/city-house-transition-coordinator.ts, src/application/house/house-runtime.ts, src/application/story-battle/story-battle-runtime.ts, and src/main.ts still each own cross-mechanism composition outcomes such as view switching, dialogue opening, house reentry, story advancement, and render-triggered orchestration. This remains candidate-only pending later target-level admission review.` |
| `queue.review-cadence-follow-up-contract-closure` | `done` | `only if fresh evidence disproves the closed queue record or a new same-target cadence residue is later proven` | `Admitted on 2026-07-08 because the fresh fragmentation evidence still held across time/runtime/house/UI owners and docs/blueprints/specs/2026-07-08-review-cadence-follow-up-shared-review-support-spec.md froze one bounded shared-mechanism contract. Closed later the same day after src/application/review/review-cycle.ts became the shared review-cycle seam, the covered story/house consumers moved onto shared scheduling plus read-side compatibility refresh, and npm run lint:blueprints, npm run typecheck, and npm test all passed.` |
| `queue.main-shell-and-layout-editor-ownerization` | `done` | `only if fresh evidence proves main.ts still owns non-shell UI/editor state decisions and the layout editor still lacks an independent owner line` | `Reactivated on 2026-07-08 after fresh source audit disproved the prior pure-shell closeout basis. Fresh ownerization evidence later the same day landed the bounded recovery cut, and fresh reclosure-closeout verification then confirmed npm run lint:blueprints, npm run typecheck, and npm test all pass on the current branch. The queue is now closed historical evidence again and no longer remains active.` |

### Candidate Classification Record

| Item ID | Classification | Proposed Queue | Disposition | Basis |
| --- | --- | --- | --- | --- |
| `item.zhuyuanzhang-scenario-pack-integration` | `queue-candidate` | `queue.zhuyuanzhang-scenario-pack-integration` | `admitted + blocked handoff written` | `Fresh evidence first showed the current production path still depends on pack-private zhuyuanzhang hard-import glue, while the current shared scenario-pack surface was sufficient for a bounded queue. Later queue execution proved that after the last lawful same-surface slice, the remaining residue requires upstream shared capability rather than another in-queue decoupling cut.` |
| `item.shared-contract-upgrade-governance` | `queue-candidate` | `queue.shared-contract-upgrade-governance` | `admitted + done` | `Fresh blocker evidence from queue.zhuyuanzhang-scenario-pack-integration proved the remaining seven house-content adapter residues could not continue under the current shared surface because no shared house-content/default-content slot family or equivalent loader, validator, active-content, or consumer support existed. The admitted queue then landed the first module-keyed houseModuleDefaults slice and returned control to target-level review.` |
| `item.main-ts-pure-shell-reclosure` | `queue-candidate` | `queue.main-shell-and-layout-editor-ownerization` | `admitted + done` | `Fresh 2026-07-08 source audit first disproved the closed pure-shell record and reopened the queue on one bounded recovery cut. Fresh ownerization evidence then showed that cut implemented: src/main.ts no longer directly imports layout-editor-actions, applyRenderPrepassState, ui/app-render markup helpers, or layout-editor preset constructors, and the repeated layout-editor, render, and layout bootstrap owner lines were restored behind existing seams. Fresh reclosure-closeout verification now confirms npm run lint:blueprints, npm run typecheck, and npm test all pass, so the queue is closed again on current evidence.` |
| `item.runtime-contract-hardening-round-2` | `queue-candidate` | `queue.state-sync-and-runtime-canonicalization` | `admitted + done` | `Fresh 2026-07-08 source audit showed the runtime contract surface still carried transitional bridge and settlement shapes outside a single canonical seam. The admitted queue then removed the bridge-heavy state-sync helper residue from the covered core path, collapsed follow-up and task input/result seams, replaced the explicit multi-stage post-route settlement chain with one canonical helper seam, and eliminated the live legacyInteractiveKind/createLegacyPlayableSession dependency on the covered interactive runtime path. Queue closeout verification on 2026-07-09 confirmed npm run lint:blueprints, npm run typecheck, and npm test all pass.` |
| `item.runtime-contract-registry-seam-closure` | `queue-candidate` | `queue.runtime-contract-registry-seam-closure` | `admitted + done` | `Fresh 2026-07-09 source audit first showed the covered application path still bypassed the intended runtime or registry seam through direct core runtime executor imports, builtin house-module registry fallbacks, and direct core playable-runtime imports on covered house consumers. The admitted queue then converged those consumers onto the application-owned house-module-registry, runtime-request-seam, and house-playable-runtime-bridge seams, and queue-closeout verification confirmed npm run lint:blueprints, npm run typecheck, and npm test all pass on the current branch.` |
| `item.prototype-startup-bootstrap-ownerization` | `queue-candidate` | `queue.prototype-startup-bootstrap-ownerization` | `admitted + queue closed` | `Fresh 2026-07-09 source audit first showed builtin prototype startup still depends on main.ts-owned app-state assembly and prototype-stage bootstrap even though startup-session-coordinator already exists as the startup-layer owner seam. The admitted queue then landed the bounded startup app-state ownerization slice, but residue review concluded that the remaining main.ts plus prototype-world plus test-harness coupling belongs to a broader later review family rather than another same-queue continuation.` |
| `item.zhuyuanzhang-pack-hardcode-consolidation-and-editor-prep` | `queue-candidate` | `queue.zhuyuanzhang-pack-structure-and-authoring-normalization` | `admitted + queue closed` | `Fresh 2026-07-09 source review first confirmed the zhuyuanzhang package lacked one canonical package-owned authoring boundary, so queue.zhuyuanzhang-pack-structure-and-authoring-normalization was admitted to close the smallest lawful first slice. The queue then landed catalog-driven default-pack binding closure, but later residue review concluded that the remaining pack-content-access fallout overlaps cleanup-only residue while prototype-world plus src/main.ts now form a broader prototype-bootstrap family. Control therefore returned to target review instead of widening this queue silently.` |
| `item.cross-mechanism-composition-contract-closure` | `queue-candidate` | `queue.cross-mechanism-composition-contract-closure` | `candidate-only` | `Fresh 2026-07-08 source audit shows menu or dialogue or map or city or house or story or task or minigame composition still lacks one contract-driven combination seam. src/application/runtime/main-runtime-orchestrator.ts still combines startup-session, story-scene advance, choice handling, and trigger-story-events ownership; src/application/runtime/interactive-action-coordinator.ts still combines activity-qte, story-scene, and story-battle action flow; src/application/runtime/city-house-transition-coordinator.ts and src/application/house/house-runtime.ts still own cross-mechanism view and dialogue transitions; src/application/story-battle/story-battle-runtime.ts still returns story, house, and review outcomes directly; and src/main.ts still assembles and bridges all of these owners. This is a bounded owner-line closure candidate rather than a continuation of the current main-shell queue.` |
| `item.review-cadence-follow-up-contract-closure` | `queue-candidate` | `queue.review-cadence-follow-up-contract-closure` | `admitted + done` | `Fresh 2026-07-08 source audit first showed timed review and follow-up cadence remained fragmented across multiple owners, and the support spec froze the lawful boundary for a bounded next queue. The admitted queue then landed the shared review-cycle seam plus covered consumer convergence and is now closed historical evidence on current source truth.` |
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
  - `queue.review-cadence-follow-up-contract-closure is admitted because the current target already records bounded, source-backed review cadence fragmentation across time/runtime/house/UI owners, and docs/blueprints/specs/2026-07-08-review-cadence-follow-up-shared-review-support-spec.md now freezes a lawful shared-mechanism contract without widening immediately into the broader cross-mechanism composition queue.`
  - `queue.state-sync-and-runtime-canonicalization is admitted because the current target already records bounded, source-backed core runtime bridge and canonicalization residue across state-sync-runtime, runtime-dispatch, runtime-request, runtime-result, house-runtime, and interactive-runtime, and this core residue is upstream to the remaining consumer-side seam and cleanup candidates.`
  - `queue.prototype-startup-bootstrap-ownerization is admitted on 2026-07-09 because the current target already records bounded prototype-bootstrap residue across src/main.ts, src/application/startup/startup-session-coordinator.ts, and src/content/prototype-world.ts, and fresh review confirms that lifting the builtin prototype startup app-state builder behind the startup seam is a smaller first slice than reopening the broader composition candidate or widening directly into prototype-world truth extraction.`
  - `queue.zhuyuanzhang-pack-structure-and-authoring-normalization is admitted on 2026-07-09 because the current target already records bounded, source-backed package-normalization residue across base-game-content-pack.ts, pack-content-access.ts, prototype-world.ts, and src/main.ts, and fresh review confirms the hardcoded builtin default-pack binding is a smaller first slice than the remaining composition and cleanup candidates.`
- Current review subject:
  - `none; queue.prototype-startup-bootstrap-ownerization is now closed and target control has returned to promotion review with no active queue.`
- Current handoff:
  - `Fresh 2026-07-09 queue closeout records queue.prototype-startup-bootstrap-ownerization as done after the covered builtin prototype startup app-state builder moved into src/application/startup/prototype-startup-app-state.ts and the residue review completed.`
  - `Current source truth still shows src/main.ts importing createPrototypeCharactersForStoryStage from src/content/prototype-world.ts, while tests/robustness.test.cjs continues to consume broad prototype-world fixture exports such as prototypeCharacters, prototypeHouses, prototypeCityNpcPools, prototypeCards, and prototypeValuables.`
  - `That remaining residue no longer exposes one smaller lawful same-queue implementation slice ahead of broader prototype-world truth extraction, startup bootstrap assumption cleanup, and test-harness decoupling, so this closed queue must not widen silently.`
  - `Target control therefore returns to promotion review with no active queue. Any later admission that touches the remaining prototype-world family must be re-evaluated at target level against the broader composition candidate and the existing cleanup items instead of being treated as an automatic continuation of the closed queue.`
  - `Fresh 2026-07-08 cadence closeout evidence shows the bounded queue line is complete on current source truth: src/application/review/review-cycle.ts now owns the covered review-cycle schedule plus compatibility-mirror seam, story callback and story battle writers route through it, and keep-house, temple-house, and home-house now consume shared scheduling or read-side compatibility refresh instead of keeping another live cadence writer on the covered path.`
  - `Fresh 2026-07-09 adapter audit records item.legacy-adapter-and-bridge-retirement as current-target-item cleanup rather than a new queue. src/core/adapters/legacy-house-adapter.ts is still dead placeholder residue, and state-sync-app-bridge plus house-playable-runtime-bridge still have live consumers, but the previously tracked legacyInteractiveKind and createLegacyPlayableSession residues are no longer live on the covered path, so any further cleanup must be re-scoped against the remaining live bridge adapters instead of the now-closed runtime canonicalization queue.`
  - `item.home-keep-fallback-retirement remains candidate-only dead cleanup, and item.zhuyuanzhang-scenario-pack-integration-closeout-sync remains executed plus done. queue.shared-contract-upgrade-governance and queue.zhuyuanzhang-scenario-pack-integration now remain historical evidence only; neither is reopened by this candidate sync.`

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
- `2026-07-08: queue.review-cadence-follow-up-contract-closure closed after the shared review-cycle seam landed, the covered story and house consumers converged on shared schedule plus compatibility refresh helpers, and verification passed; target control returned to idle-open with no active queue.`
- `2026-07-08: item.runtime-contract-hardening-round-2 was formally admitted and activated as queue.state-sync-and-runtime-canonicalization after fresh source evidence proved the covered core runtime path still depends on bridge-heavy state-sync helpers, split request/result families, and legacy interactive compatibility glue.`
- `2026-07-09: queue.state-sync-and-runtime-canonicalization closed after the covered core runtime path converged on the canonical app-state/runtime helper seam, one followUp seam, one taskInputs seam, one post-route settlement helper seam, and no remaining legacyInteractiveKind/createLegacyPlayableSession dependency on the covered path; target control returned to idle-open with no active queue.`
- `2026-07-09: item.runtime-contract-registry-seam-closure was formally admitted and activated as queue.runtime-contract-registry-seam-closure after fresh source evidence proved application consumers still bypass the intended runtime or registry seam through direct core runtime executor imports, core builtin house-module registry fallbacks, and ad hoc house-playable runtime bridging.`
- `2026-07-09: queue.runtime-contract-registry-seam-closure closed after the covered application consumer path converged on application-owned registry and runtime seams, and target control returned to promotion-review with no active queue.`
- `2026-07-09: item.zhuyuanzhang-pack-hardcode-consolidation-and-editor-prep was formally admitted and activated as queue.zhuyuanzhang-pack-structure-and-authoring-normalization after fresh source review confirmed that the bounded package-normalization blocker still holds and that the hardcoded builtin default-pack binding is the smallest lawful next slice on current evidence.`
- `2026-07-09: queue.zhuyuanzhang-pack-structure-and-authoring-normalization closed after the bounded default-pack binding slice landed, the browser startup path was re-stabilized on absolute manifest URLs, and residue review returned control to promotion-review because the remaining pack-content-access fallout is cleanup-only while prototype-world plus src/main.ts now represent a broader prototype-bootstrap review family.`
- `2026-07-09: item.prototype-startup-bootstrap-ownerization was formally admitted and activated as queue.prototype-startup-bootstrap-ownerization after fresh source review confirmed that builtin prototype startup bootstrap still remains main.ts-owned on the covered path and that lifting the startup app-state builder behind the startup seam is the smallest lawful next slice ahead of the broader composition candidate.`
- `2026-07-09: queue.prototype-startup-bootstrap-ownerization closed after the bounded startup app-state ownerization slice landed and queue-local residue review concluded that the remaining prototype-world plus test-harness coupling no longer forms one unique same-queue continuation, so target control returned to promotion-review with no active queue.`
