# Project Complete Modularization Version Plan

## Control Block

- document_role: `version-governor`
- version_id: `target.project-complete-modularization`
- version_status: `open`
- active_phase: `phase.final-acceptance`
- active_queue: `none`
- decision_state: `idle-open`
- next_decision: `same-version-admission-or-version-closeout`
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
- blocked_by: []
- candidate_queue_ids:

## Human Context

### Queue Promotion Ledger

| Queue ID | Current Disposition | Promote When | Notes |
| --- | --- | --- | --- |
| `queue.state-sync-and-runtime-canonicalization` | `done` | `only if a fresh runtime/state canonicalization blocker is proven and version-level review later selects it as the next unique shared-contract queue` | `Admitted on 2026-07-08 after fresh evidence showed still-live bridge and transitional contract residue in src/core/runtime/state-sync-runtime.ts, src/core/runtime/runtime-dispatch.ts, src/core/contracts/runtime-result.ts, src/core/contracts/house-runtime.ts, src/core/contracts/runtime-request.ts, and src/core/runtime/interactive-runtime.ts. Closed on 2026-07-09 after the covered core runtime path converged on the canonical app-state/runtime helper seam, one followUp seam, one taskInputs seam, one post-route settlement helper seam, and no remaining legacyInteractiveKind or createLegacyPlayableSession dependency on the covered path.` |
| `queue.unified-contribution-intake-closeout` | `rejected` | `only if a fresh intake-path blocker is proven` | `Previously rejected on current evidence and is not part of the current live candidate set.` |
| `queue.playable-family-gap-audit` | `closed` | `only if a still-live playable-family gap is proven` | `Closed on 2026-07-07 after playable contribution truth and activation-configurable default runtime registries landed and verification passed.` |
| `queue.framework-scaffold-and-template-closure` | `rejected` | `only if framework-owned authoring coverage is disproven` | `Accepted compatibility residue alone is insufficient, so it is not part of the current live candidate set.` |
| `queue.layout-editor-retirement-and-reference-removal` | `done` | `only if a fresh audit disproves the closed queue record or a newly bounded broader uiLayouts baseline queue is later proven on current evidence` | `Fresh 2026-07-09 source audit first showed the layout editor remained a live user-facing feature and code path across src/application/layout-editor/**, src/ui/tools/layout-editor-view.ts, src/ui/app-render.ts, src/ui/main-ui/main-ui-flow.js, src/content/layout-editor-presets.ts, src/styles/layout-editor.css, and app-shell state. The admitted queue then retired the live editor surfaces, removed the remaining dead layoutEditor-state bootstrap and editor-only module family, and closed after residue review concluded that the surviving uiLayouts baseline and preset family is broader target-review work rather than another already-frozen same-queue continuation.` |
| `queue.prototype-startup-bootstrap-ownerization` | `done` | `only if a fresh audit still proves builtin prototype startup bootstrap remains main.ts-owned or prototype-world-coupled and version-level review later selects one bounded startup ownerization queue` | `Admitted on 2026-07-09 because src/main.ts still owned createPrototypeAppState together with prototype-stage selection, mission-text bootstrap, review bootstrap variables, and layout-editor startup assembly even though src/application/startup/startup-session-coordinator.ts already owned startup-session routing. Closed later the same day after the covered startup app-state builder moved into src/application/startup/prototype-startup-app-state.ts and queue-local residue review concluded that the remaining prototype-world plus test-harness coupling no longer forms one unique same-queue implementation slice.` |
| `queue.zhuyuanzhang-scenario-pack-integration` | `done` | `only if fresh evidence disproves the closed queue record or a new same-version pack-integration residue is later proven` | `Admitted on 2026-07-08 after fresh evidence showed src/content/pack-content-access.ts still hard-imports zhuyuanzhang pack tables and house-content JSON into shared content adapters. Returned to version-level review later the same day after the last lawful same-surface slice removed src/content/houses/temple-house-content.ts as a zero-consumer false positive and the remaining seven house-content residues proved they need upstream shared capability. After the shared-contract queue landed the first houseModuleDefaults slice, blocked-queue recovery review on 2026-07-08 concluded that the blocker was materially lifted and that keep-house was the unique smallest resumed decoupling slice, so this queue became active again. It is now closed on 2026-07-08 after queue-closeout sync confirmed that the resumed implementation task fully removed the remaining lawful grain-shop residue and no new upstream queue is needed for this residue family.` |
| `queue.shared-contract-upgrade-governance` | `done` | `only if fresh evidence proves the blocked zhuyuanzhang queue cannot continue without a new shared scenario-pack/content-pack capability` | `Admitted on 2026-07-08 after fresh blocker evidence proved the remaining home/keep/grain/market/medicine/tavern/tea house-content residues all require a new shared house-default capability family across contract, loader, validator, active-content, and consumer layers. Closed later the same day after the first shared module-keyed houseModuleDefaults slice landed and target control returned to admission review.` |
| `queue.ui-runtime-contract-consumption` | `closed` | `only if runtime-facing UI contract bypass is proven` | `Closed on 2026-07-07 after the bounded shared-dialog replacement landed and verification passed.` |
| `queue.runtime-contract-registry-seam-closure` | `done` | `only if a fresh consumer-side runtime bypass remains and version-level review later selects a dedicated seam-closure queue rather than absorbing the work elsewhere` | `Admitted on 2026-07-09 after fresh source evidence showed the covered application path still bypassed the intended runtime or registry seam through direct core runtime executor imports, direct core builtin house-module registry fallbacks, and direct core playable-runtime imports on covered house consumers. Closed on 2026-07-09 after house-runtime plus stage-presenters moved onto the application-owned house-module-registry seam, interactive-action-coordinator moved onto src/application/runtime/runtime-request-seam.ts, grain-shop plus medicine-house moved onto src/application/playables/house-playable-runtime-bridge.ts for covered playable runtime ownership, and npm run lint:blueprints, npm run typecheck, and npm test all passed.` |
| `queue.zhuyuanzhang-pack-structure-and-authoring-normalization` | `done` | `only if a fresh audit still proves zhuyuanzhang pack-owned truth remains hardcoded outside the canonical scenario-pack boundary and version-level review later selects one bounded package-normalization queue` | `Admitted on 2026-07-09 because the bounded package-normalization blocker still held on current source truth and the hardcoded builtin default-pack binding was the smallest lawful first slice. Closed later the same day after src/content/base-game-content-pack.ts converged on catalog-driven default manifest resolution, the browser startup path was re-stabilized on absolute manifest URLs, and queue-local residue review concluded that the remaining pack-content-access fallout is mixed or dead cleanup while prototype-world plus src/main.ts now represent a broader prototype-bootstrap residue family rather than one unique same-queue next cut.` |
| `queue.cross-mechanism-composition-contract-closure` | `done` | `only if a fresh audit still proves menu/dialog/map/city/house/story/task/minigame composition remains spread across owner-specific coordinators and direct state writes and version-level review later selects a dedicated composition queue` | `Admitted on 2026-07-09 because the covered mechanism composition surface still lacked one contract-driven composition seam. Closed later the same day after the bounded first slice converged the covered city/house transition path on applyCityViewTransition, while the remaining broader story, battle, interactive-action, and top-level assembly residue returned to version review instead of widening this queue without a newly frozen same-queue cut.` |
| `queue.review-cadence-follow-up-contract-closure` | `done` | `only if fresh evidence disproves the closed queue record or a new same-version cadence residue is later proven` | `Admitted on 2026-07-08 because the fresh fragmentation evidence still held across time/runtime/house/UI owners and docs/blueprints/specs/2026-07-08-review-cadence-follow-up-shared-review-support-spec.md froze one bounded shared-mechanism contract. Closed later the same day after src/application/review/review-cycle.ts became the shared review-cycle seam, the covered story/house consumers moved onto shared scheduling plus read-side compatibility refresh, and npm run lint:blueprints, npm run typecheck, and npm test all passed.` |
| `queue.main-shell-and-layout-editor-ownerization` | `done` | `only if fresh evidence proves main.ts still owns non-shell UI/editor state decisions and the layout editor still lacks an independent owner line` | `Reactivated on 2026-07-08 after fresh source audit disproved the prior pure-shell closeout basis. Fresh ownerization evidence later the same day landed the bounded recovery cut, and fresh reclosure-closeout verification then confirmed npm run lint:blueprints, npm run typecheck, and npm test all pass on the current branch. The queue is now closed historical evidence again and no longer remains active.` |
| `queue.entry-shell-bootstrap-ownerization` | `done` | `only if a fresh audit still proves one bounded entry-shell/bootstrap ownerization continuation exists and version-level review later selects it as a new queue rather than a broader runtime orchestration family` | `Admitted on 2026-07-10 because src/main.ts still directly owned base content activation, builtin scenario-pack wiring, prototype startup app-state bootstrap, repeated runtime commit assembly, and house-runtime creation, and queue-local baseline review froze startup activation/bootstrap state ownerization as the first bounded cut. Closed later the same day after src/application/startup/entry-shell-bootstrap-state.ts took ownership of the covered startup activation/bootstrap state and queue-local residue review concluded that the remaining repeated runtime commit assembly plus house-runtime creation residue now sits on broader runtime orchestration and house-session owner lines rather than another already-frozen same-queue continuation.` |
| `queue.canonical-runtime-state-sync-unification` | `candidate` | `Promote only after queue.entry-shell-bootstrap-ownerization lands, unless fresh evidence proves the runtime/state bridge residue is independently executable.` | `This candidate is downstream of the entry-shell/bootstrap ownerization cut. Fresh basis is that src/core/runtime/state-sync-runtime.ts still keeps createRuntimeStateFromAppState, applyRuntimeStateToAppState, and canonicalFromLegacyRuntimeState bridge paths, so canonical runtime truth-chain unification should not be promoted ahead of the upstream ownerization seam without new independent evidence.` |
| `queue.active-content-consumption-closure` | `candidate` | `Promote only after queue.entry-shell-bootstrap-ownerization and queue.canonical-runtime-state-sync-unification land, unless fresh evidence proves the content-consumption cleanup is independently executable.` | `This candidate is the later production-dependency cleanup cut. Fresh basis is that keep-house still consumes defaultPackActivities, defaultPackTextEntries, and defaultRuntimeContent, while src/content/city-scene-mappings.ts still reads defaultRuntimeContent.cities and defaultRuntimeContent.houses, so defaultRuntimeContent/defaultPack*/pack-content-access cleanup must stay behind the first two queue families unless new evidence proves it can be isolated safely.` |

### Candidate Classification Record

| Item ID | Classification | Proposed Queue | Disposition | Basis |
| --- | --- | --- | --- | --- |
| `item.zhuyuanzhang-scenario-pack-integration` | `queue-candidate` | `queue.zhuyuanzhang-scenario-pack-integration` | `admitted + blocked handoff written` | `Fresh evidence first showed the current production path still depends on pack-private zhuyuanzhang hard-import glue, while the current shared scenario-pack surface was sufficient for a bounded queue. Later queue execution proved that after the last lawful same-surface slice, the remaining residue requires upstream shared capability rather than another in-queue decoupling cut.` |
| `item.shared-contract-upgrade-governance` | `queue-candidate` | `queue.shared-contract-upgrade-governance` | `admitted + done` | `Fresh blocker evidence from queue.zhuyuanzhang-scenario-pack-integration proved the remaining seven house-content adapter residues could not continue under the current shared surface because no shared house-content/default-content slot family or equivalent loader, validator, active-content, or consumer support existed. The admitted queue then landed the first module-keyed houseModuleDefaults slice and returned control to version-level review.` |
| `item.main-ts-pure-shell-reclosure` | `queue-candidate` | `queue.main-shell-and-layout-editor-ownerization` | `admitted + done` | `Fresh 2026-07-08 source audit first disproved the closed pure-shell record and reopened the queue on one bounded recovery cut. Fresh ownerization evidence then showed that cut implemented: src/main.ts no longer directly imports layout-editor-actions, applyRenderPrepassState, ui/app-render markup helpers, or layout-editor preset constructors, and the repeated layout-editor, render, and layout bootstrap owner lines were restored behind existing seams. Fresh reclosure-closeout verification now confirms npm run lint:blueprints, npm run typecheck, and npm test all pass, so the queue is closed again on current evidence.` |
| `item.layout-editor-retirement-and-reference-removal` | `queue-candidate` | `queue.layout-editor-retirement-and-reference-removal` | `admitted + queue closed` | `Fresh 2026-07-09 source audit first showed the layout editor remained a live feature rather than historical residue only: app shell state still carried layoutEditor plus uiLayouts, startup bootstrap still seeded layout editor defaults, UI rendering still mounted renderLayoutEditor, live layout bindings and character detail rendering still exposed editor-aware branches, and dedicated layout-editor modules, presets, docs, tests, and CSS remained in the covered repository path. The admitted queue then retired the remaining live editor surfaces, removed dead layoutEditor-state and editor-only modules, and finally returned the surviving uiLayouts baseline and preset family to broader version review instead of widening this queue further.` |
| `item.runtime-contract-hardening-round-2` | `queue-candidate` | `queue.state-sync-and-runtime-canonicalization` | `admitted + done` | `Fresh 2026-07-08 source audit showed the runtime contract surface still carried transitional bridge and settlement shapes outside a single canonical seam. The admitted queue then removed the bridge-heavy state-sync helper residue from the covered core path, collapsed follow-up and task input/result seams, replaced the explicit multi-stage post-route settlement chain with one canonical helper seam, and eliminated the live legacyInteractiveKind/createLegacyPlayableSession dependency on the covered interactive runtime path. Queue closeout verification on 2026-07-09 confirmed npm run lint:blueprints, npm run typecheck, and npm test all pass.` |
| `item.runtime-contract-registry-seam-closure` | `queue-candidate` | `queue.runtime-contract-registry-seam-closure` | `admitted + done` | `Fresh 2026-07-09 source audit first showed the covered application path still bypassed the intended runtime or registry seam through direct core runtime executor imports, builtin house-module registry fallbacks, and direct core playable-runtime imports on covered house consumers. The admitted queue then converged those consumers onto the application-owned house-module-registry, runtime-request-seam, and house-playable-runtime-bridge seams, and queue-closeout verification confirmed npm run lint:blueprints, npm run typecheck, and npm test all pass on the current branch.` |
| `item.prototype-startup-bootstrap-ownerization` | `queue-candidate` | `queue.prototype-startup-bootstrap-ownerization` | `admitted + queue closed` | `Fresh 2026-07-09 source audit first showed builtin prototype startup still depends on main.ts-owned app-state assembly and prototype-stage bootstrap even though startup-session-coordinator already exists as the startup-layer owner seam. The admitted queue then landed the bounded startup app-state ownerization slice, but residue review concluded that the remaining main.ts plus prototype-world plus test-harness coupling belongs to a broader later review family rather than another same-queue continuation.` |
| `item.zhuyuanzhang-pack-hardcode-consolidation-and-editor-prep` | `queue-candidate` | `queue.zhuyuanzhang-pack-structure-and-authoring-normalization` | `admitted + queue closed` | `Fresh 2026-07-09 source review first confirmed the zhuyuanzhang package lacked one canonical package-owned authoring boundary, so queue.zhuyuanzhang-pack-structure-and-authoring-normalization was admitted to close the smallest lawful first slice. The queue then landed catalog-driven default-pack binding closure, but later residue review concluded that the remaining pack-content-access fallout overlaps cleanup-only residue while prototype-world plus src/main.ts now form a broader prototype-bootstrap family. Control therefore returned to version review instead of widening this queue silently.` |
| `item.cross-mechanism-composition-contract-closure` | `queue-candidate` | `queue.cross-mechanism-composition-contract-closure` | `admitted + queue closed` | `Fresh 2026-07-09 source audit first showed menu or dialogue or map or city or house or story or task or minigame composition lacked one contract-driven combination seam. The admitted queue then froze and landed the bounded city/house transition seam through applyCityViewTransition, but queue-local closeout review concluded that the remaining broader story, battle, interactive-action, and main assembly residue no longer exposes another already-frozen same-queue cut, so control returned to version-level promotion review instead of widening the queue silently.` |
| `item.review-cadence-follow-up-contract-closure` | `queue-candidate` | `queue.review-cadence-follow-up-contract-closure` | `admitted + done` | `Fresh 2026-07-08 source audit first showed timed review and follow-up cadence remained fragmented across multiple owners, and the support spec froze the lawful boundary for a bounded next queue. The admitted queue then landed the shared review-cycle seam plus covered consumer convergence and is now closed historical evidence on current source truth.` |
| `item.entry-shell-bootstrap-ownerization` | `queue-candidate` | `queue.entry-shell-bootstrap-ownerization` | `admitted + queue closed` | `Fresh source review first kept this as the lawful first cut because src/main.ts still directly owns base content activation, builtin scenario-pack wiring, prototype startup app-state bootstrap, repeated runtime commit assembly, and house-runtime creation. Version-level promotion then admitted it as the single active queue, and queue-local baseline review froze startup activation/bootstrap state ownerization as the first bounded implementation slice. The queue is now closed after the covered bootstrap seam landed and residue review concluded that the remaining repeated runtime commit assembly plus house-runtime creation residue no longer forms one unique same-queue continuation.` |
| `item.canonical-runtime-state-sync-unification` | `queue-candidate` | `queue.canonical-runtime-state-sync-unification` | `candidate-only` | `Fresh source review records this as a downstream candidate because src/core/runtime/state-sync-runtime.ts still preserves createRuntimeStateFromAppState, applyRuntimeStateToAppState, and canonicalFromLegacyRuntimeState bridge paths, but the queue should remain candidate-only until the upstream entry-shell/bootstrap ownerization seam lands or independent execution evidence is freshly proven.` |
| `item.active-content-consumption-closure` | `queue-candidate` | `queue.active-content-consumption-closure` | `candidate-only` | `Fresh source review records this as a later cleanup candidate because keep-house still consumes defaultPackActivities, defaultPackTextEntries, and defaultRuntimeContent, while src/content/city-scene-mappings.ts still reads defaultRuntimeContent.cities and defaultRuntimeContent.houses, so this queue remains candidate-only behind the upstream ownerization and runtime-truth-chain cuts unless new independent evidence is written.` |
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
- `queue.review-cadence-follow-up-contract-closure is admitted because the current version already records bounded, source-backed review cadence fragmentation across time/runtime/house/UI owners, and docs/blueprints/specs/2026-07-08-review-cadence-follow-up-shared-review-support-spec.md now freezes a lawful shared-mechanism contract without widening immediately into the broader cross-mechanism composition queue.`
- `queue.state-sync-and-runtime-canonicalization is admitted because the current version already records bounded, source-backed core runtime bridge and canonicalization residue across state-sync-runtime, runtime-dispatch, runtime-request, runtime-result, house-runtime, and interactive-runtime, and this core residue is upstream to the remaining consumer-side seam and cleanup candidates.`
- `queue.prototype-startup-bootstrap-ownerization is admitted on 2026-07-09 because the current version already records bounded prototype-bootstrap residue across src/main.ts, src/application/startup/startup-session-coordinator.ts, and src/content/prototype-world.ts, and fresh review confirms that lifting the builtin prototype startup app-state builder behind the startup seam is a smaller first slice than reopening the broader composition candidate or widening directly into prototype-world truth extraction.`
- `queue.zhuyuanzhang-pack-structure-and-authoring-normalization is admitted on 2026-07-09 because the current version already records bounded, source-backed package-normalization residue across base-game-content-pack.ts, pack-content-access.ts, prototype-world.ts, and src/main.ts, and fresh review confirms the hardcoded builtin default-pack binding is a smaller first slice than the remaining composition and cleanup candidates.`
- `queue.cross-mechanism-composition-contract-closure is admitted on 2026-07-09 because the current version already records bounded, source-backed cross-mechanism composition residue across main-runtime-orchestrator, interactive-action-coordinator, city-house-transition-coordinator, house-runtime, story-battle-runtime, and src/main.ts, and fresh review confirms this is now the only still-live candidate queue whose blocker remains implementation-grade on current evidence.`
- Current review subject:
  - `none`
- Current handoff:
  - `Fresh 2026-07-10 queue closeout returns queue.entry-shell-bootstrap-ownerization to done historical evidence after the bounded startup activation/bootstrap seam landed in src/application/startup/entry-shell-bootstrap-state.ts.`
  - `Queue-local residue review concluded that the remaining repeated runtime commit assembly and createHouseRuntimeInstance -> createHouseRuntimeBridge residue in src/main.ts now spans broader runtime orchestration and house-session owner lines rather than another already-frozen same-queue entry-shell/bootstrap continuation.`
- `Version control therefore returns to idle-open with no active queue, and the next legal action is classify-fresh-work at the version level rather than silently widening the closed queue.`
- `queue.canonical-runtime-state-sync-unification and queue.active-content-consumption-closure remain candidate-only recovery items, and the current live candidate set remains empty on current evidence.`

### Queue Admission Startup Rules

1. `Read project-progress -> blueprint -> target plan -> active queue before evaluating a fresh queue item.`
2. `If an active queue exists, test whether the new item can be absorbed before considering a new queue.`
3. `If the item becomes queue-candidate, write target-plan review truth before any queue activation or implementation begins.`
4. `User scope approval remains scope approval only and must not be treated as queue admission.`

### Candidate Recovery Rule

- `Use this target plan's existing queue promotion ledger and prior review fields as the default recovery source for previously recorded queue-candidates.`
- `Do not restart a full re-audit unless new material evidence invalidates the prior classification or admission basis.`

### Candidate Recovery Rule Addendum

- `queue.entry-shell-bootstrap-ownerization is now closed historical evidence; the current live candidate set remains empty on current source truth.`
- `queue.canonical-runtime-state-sync-unification must not be promoted before queue.entry-shell-bootstrap-ownerization unless fresh evidence proves it can execute as an independent bounded queue.`
- `queue.active-content-consumption-closure must not be promoted before queue.entry-shell-bootstrap-ownerization and queue.canonical-runtime-state-sync-unification unless fresh evidence proves it can execute as an independent bounded queue.`

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

### Version Lifecycle Rules

- `This version stays open until version closeout is explicitly confirmed and written into version-level truth.`
- `active_queue = none does not close the version; it only returns the version to idle-open or promotion-review.`
- `As long as this version remains open, additional same-version queues may still be admitted.`
- `Only when version acceptance is satisfied and no active queue remains may one explicit version-closeout confirmation be asked.`
- `If version closeout is not explicitly confirmed, keep the version open and continue using same-version admission review for new queue work.`

### Queue Closeout Rules

- `next_effect = promote-next-queue`
- `next_effect = return-to-version-review`
- `next_effect = block-version`

Optional mirror:

- `docs/change-log.md` may be updated after governance truth is already synchronized`

### Post-Task Auto-Reconcile

1. `Run verify_with for the completed task.`
2. `Check done_when.`
3. `Write the task after-state, queue truth, and any required version truth before any repository sync begins.`
4. `Re-evaluate whether the queue should continue, close, or block.`
5. `Scan governance owners: project-progress, blueprint, version spec, version plan, queue doc, and affected shared contracts.`
6. `Scan residue: tracked leftovers, untracked drafts, unsynced truth, and out-of-scope remains.`
7. `Run one minimum repository sync batch after the docs are updated.`
8. `If the next legal execution point is unique, continue directly into queue closeout or version-review handoff once the sync attempt returns a result.`
9. `Sync version-level truth if queue closeout or promotion conditions changed.`
10. `Optionally mirror the result into change-log if a human-readable summary is warranted.`

### Human Confirmation Throttle

- `At most one human-confirmation question may be asked per task.`
- `If the version/queue/task boundary can be resolved from current docs and code, do not ask.`
- `If an item is uncertain but would not change active truth, record uncertain-needs-review and stop without asking.`
- `If active truth would change and multiple mutually exclusive legal branches exist, one human escalation is allowed.`
- `Do not treat user scope approval as queue admission.`
- `Do not ask whether to do closeout, promotion review, or doc sync when they are already the unique next legal step.`
- `Do not raise decision_required merely because repository sync failed.`
- `Do not ask about a merge conflict when current version truth already uniquely decides the legal resolution.`
- `Ask only when the baseline is ambiguous or when merge-conflict handling has multiple mutually exclusive legal resolutions that current version truth cannot decide alone.`
- `Exception: version closeout still requires explicit human confirmation before version_status changes to done.`

### Repository Sync Policy

- `Git sync is non-governing.`
- `commit / push / merge must not change queue truth, version truth, candidate truth, or transition truth.`
- `push / merge must not become a queue closeout gate.`
- `push / merge must not become a version closeout gate.`
- `Task execution conclusions are written first; repository sync runs second.`
- `A failed sync attempt is recorded only as repository sync result in the queue-local sync record.`
- `A merge conflict is a repository sync event; it must not rewrite the already-recorded task, queue, or version conclusion.`
- `If current version truth uniquely decides the merge conflict direction, resolve it without asking.`
- `Version scheduling must not read sync_status, sync_scope, or sync_summary as live truth.`

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
  - `when a queue-candidate has sufficient evidence and version-level admission is required`
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
- `2026-07-06 to 2026-07-07: authoring, residue, acceptance-proof, and final-acceptance queues were closed as bounded queue records rather than version-level truth.`
- `2026-07-07: version closeout was intentionally pulled back to open + idle-open so same-version queue admission remains legal until explicit version closeout is written.`
- `2026-07-07: queue.ui-runtime-contract-consumption was admitted after a bounded dialog-component audit proved still-live runtime-facing UI contract bypass on the covered path.`
- `2026-07-07: queue.ui-runtime-contract-consumption was closed after the bounded shared-dialog component landed, approved replacement points were consumed, and verification passed; target state returned to open with no active queue.`
- `2026-07-07: queue.playable-family-gap-audit was admitted after fresh evidence proved the playable family still lacks a shared mod contribution contract and still relies on builtin registry seed + runtime fallback on the covered production path.`
- `2026-07-07: queue.playable-family-gap-audit was closed after playable contribution truth and activation-configurable default runtime registries landed, and verification passed; target state returned to open with no active queue.`
- `2026-07-07: queue.main-shell-and-layout-editor-ownerization was admitted after fresh evidence proved src/main.ts still owns non-shell layout editor behavior, render scheduling ownership, and runtime layout baseline bootstrap on the covered production path.`
- `2026-07-08: queue.main-shell-and-layout-editor-ownerization ownerization work reached the accepted pure-shell line on fresh source evidence, and the queue was closed as historical evidence only; the known repository-wide import.meta and ?url asset typing/configuration gap remains outside that finished queue slice, so target state returned to idle-open with no active queue.`
- `2026-07-08: item.zhuyuanzhang-scenario-pack-integration and item.shared-contract-upgrade-governance were both classified as queue-candidate. queue.zhuyuanzhang-scenario-pack-integration was admitted and activated as the single active queue because current code still shows pack-private zhuyuanzhang integration glue on the production path, while queue.shared-contract-upgrade-governance remained candidate-only because no missing shared capability is yet proved as the immediate blocker.`
- `2026-07-08: queue.zhuyuanzhang-scenario-pack-integration completed its last lawful same-surface slice by removing src/content/houses/temple-house-content.ts as a zero-consumer false positive, then exited active execution with a structured blocker because the remaining seven house-content residues require upstream shared capability. Version control returned to promotion review with item.shared-contract-upgrade-governance as the pending admission subject.`
- `2026-07-08: item.shared-contract-upgrade-governance was formally admitted and activated as queue.shared-contract-upgrade-governance after fresh blocker evidence proved the current shared contract/loader/validator/active-content/consumer chain has no house-default capability family for the remaining seven blocked house residues.`
- `2026-07-08: queue.shared-contract-upgrade-governance closed after landing the first shared houseModuleDefaults slice through contract, loader, validator, active-content/default-runtime exposure, and one home-house consumer proof. Version control returned to promotion review with item.zhuyuanzhang-scenario-pack-integration as the next review subject rather than auto-reactivating any queue.`
- `2026-07-08: blocked-queue recovery review for queue.zhuyuanzhang-scenario-pack-integration compared all seven recorded house residues against the landed houseModuleDefaults surface and concluded resume was now legal. The blocker is materially lifted, and keep-house is the unique smallest resumed slice, so version control moved back to active execution with queue.zhuyuanzhang-scenario-pack-integration as the only active queue.`
- `2026-07-08: queue.review-cadence-follow-up-contract-closure closed after the shared review-cycle seam landed, the covered story and house consumers converged on shared schedule plus compatibility refresh helpers, and verification passed; version control returned to idle-open with no active queue.`
- `2026-07-08: item.runtime-contract-hardening-round-2 was formally admitted and activated as queue.state-sync-and-runtime-canonicalization after fresh source evidence proved the covered core runtime path still depends on bridge-heavy state-sync helpers, split request/result families, and legacy interactive compatibility glue.`
- `2026-07-09: queue.state-sync-and-runtime-canonicalization closed after the covered core runtime path converged on the canonical app-state/runtime helper seam, one followUp seam, one taskInputs seam, one post-route settlement helper seam, and no remaining legacyInteractiveKind/createLegacyPlayableSession dependency on the covered path; version control returned to idle-open with no active queue.`
- `2026-07-09: item.runtime-contract-registry-seam-closure was formally admitted and activated as queue.runtime-contract-registry-seam-closure after fresh source evidence proved application consumers still bypass the intended runtime or registry seam through direct core runtime executor imports, core builtin house-module registry fallbacks, and ad hoc house-playable runtime bridging.`
- `2026-07-09: queue.runtime-contract-registry-seam-closure closed after the covered application consumer path converged on application-owned registry and runtime seams, and version control returned to promotion-review with no active queue.`
- `2026-07-09: item.zhuyuanzhang-pack-hardcode-consolidation-and-editor-prep was formally admitted and activated as queue.zhuyuanzhang-pack-structure-and-authoring-normalization after fresh source review confirmed that the bounded package-normalization blocker still holds and that the hardcoded builtin default-pack binding is the smallest lawful next slice on current evidence.`
- `2026-07-09: queue.zhuyuanzhang-pack-structure-and-authoring-normalization closed after the bounded default-pack binding slice landed, the browser startup path was re-stabilized on absolute manifest URLs, and residue review returned control to promotion-review because the remaining pack-content-access fallout is cleanup-only while prototype-world plus src/main.ts now represent a broader prototype-bootstrap review family.`
- `2026-07-09: item.prototype-startup-bootstrap-ownerization was formally admitted and activated as queue.prototype-startup-bootstrap-ownerization after fresh source review confirmed that builtin prototype startup bootstrap still remains main.ts-owned on the covered path and that lifting the startup app-state builder behind the startup seam is the smallest lawful next slice ahead of the broader composition candidate.`
- `2026-07-09: queue.prototype-startup-bootstrap-ownerization closed after the bounded startup app-state ownerization slice landed and queue-local residue review concluded that the remaining prototype-world plus test-harness coupling no longer forms one unique same-queue continuation, so version control returned to promotion-review with no active queue.`
- `2026-07-09: item.cross-mechanism-composition-contract-closure was formally admitted and activated as queue.cross-mechanism-composition-contract-closure after fresh source review confirmed that cross-mechanism composition still lacks one shared seam across runtime, house, story-battle, and main assembly owners, and that baseline-reconcile is now the smallest lawful next step on current evidence.`
- `2026-07-09: queue.cross-mechanism-composition-contract-closure closed after the bounded city/house transition seam converged on applyCityViewTransition and queue-local closeout review concluded that the remaining broader story, battle, interactive-action, and main assembly residue must return to version-level promotion review instead of widening the queue without a newly frozen next slice.`
- `2026-07-09: item.layout-editor-retirement-and-reference-removal was formally admitted and activated as queue.layout-editor-retirement-and-reference-removal after fresh source review confirmed that the layout editor still remains a live feature family and that live editor-surface retirement is now the smallest lawful first slice on current evidence.`
- `2026-07-09: queue.layout-editor-retirement-and-reference-removal remained active after queue-local residue review proved a second still-live main-ui editor surface remains in src/ui/main-ui/main-ui-flow.js and src/ui/tools/live-layout-bindings.js, so the next lawful same-queue slice is main-ui editor-surface retirement rather than broader uiLayouts baseline cleanup or version-level re-review.`
- `2026-07-09: queue.layout-editor-retirement-and-reference-removal remained active after the bounded main-ui editor-surface retirement slice landed and queue-local residue review proved no still-live editor surface remains on the covered production path, but one smaller same-queue dead-cleanup continuation still exists across layoutEditor state bootstrap and editor-only modules while broader uiLayouts baseline cleanup remains out of scope.`
- `2026-07-09: queue.layout-editor-retirement-and-reference-removal closed after the dead layoutEditor-state bootstrap and editor-only module family were removed, and queue-local residue review concluded that the remaining uiLayouts baseline plus preset family must return to broader version review instead of widening this queue without a newly frozen next slice.`
- `2026-07-10: item.entry-shell-bootstrap-ownerization was formally admitted and activated as queue.entry-shell-bootstrap-ownerization because current source truth still shows src/main.ts directly owning base content activation, builtin scenario-pack wiring, prototype startup app-state bootstrap, repeated runtime commit assembly, and house-runtime creation, and queue-local baseline review froze startup activation/bootstrap state ownerization as the smallest lawful first cut.`
- `2026-07-10: queue.entry-shell-bootstrap-ownerization closed after src/application/startup/entry-shell-bootstrap-state.ts took ownership of the covered startup activation/bootstrap state and queue-local residue review concluded that the remaining repeated runtime commit assembly plus house-runtime creation residue must return to version review instead of widening the queue into broader runtime orchestration and house-session work.`
