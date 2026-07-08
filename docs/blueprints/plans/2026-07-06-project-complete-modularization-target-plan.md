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
- blocked_by: []

## Human Context

### Queue Promotion Ledger

| Queue ID | Current Disposition | Promote When | Notes |
| --- | --- | --- | --- |
| `queue.state-sync-and-runtime-canonicalization` | `candidate` | `only if a fresh runtime/state ownership blocker is proven` | `Not currently justified.` |
| `queue.unified-contribution-intake-closeout` | `candidate` | `only if a fresh intake-path blocker is proven` | `Previously rejected on current evidence.` |
| `queue.playable-family-gap-audit` | `closed` | `only if a still-live playable-family gap is proven` | `Closed on 2026-07-07 after playable contribution truth and activation-configurable default runtime registries landed and verification passed.` |
| `queue.framework-scaffold-and-template-closure` | `candidate` | `only if framework-owned authoring coverage is disproven` | `Accepted compatibility residue alone is insufficient.` |
| `queue.zhuyuanzhang-scenario-pack-integration` | `done` | `only if fresh evidence disproves the closed queue record or a new same-target pack-integration residue is later proven` | `Admitted on 2026-07-08 after fresh evidence showed src/content/pack-content-access.ts still hard-imports zhuyuanzhang pack tables and house-content JSON into shared content adapters. Returned to target-level review later the same day after the last lawful same-surface slice removed src/content/houses/temple-house-content.ts as a zero-consumer false positive and the remaining seven house-content residues proved they need upstream shared capability. After the shared-contract queue landed the first houseModuleDefaults slice, blocked-queue recovery review on 2026-07-08 concluded that the blocker was materially lifted and that keep-house was the unique smallest resumed decoupling slice, so this queue became active again. It is now closed on 2026-07-08 after queue-closeout sync confirmed that the resumed implementation task fully removed the remaining lawful grain-shop residue and no new upstream queue is needed for this residue family.` |
| `queue.shared-contract-upgrade-governance` | `done` | `only if fresh evidence proves the blocked zhuyuanzhang queue cannot continue without a new shared scenario-pack/content-pack capability` | `Admitted on 2026-07-08 after fresh blocker evidence proved the remaining home/keep/grain/market/medicine/tavern/tea house-content residues all require a new shared house-default capability family across contract, loader, validator, active-content, and consumer layers. Closed later the same day after the first shared module-keyed houseModuleDefaults slice landed and target control returned to admission review.` |
| `queue.ui-runtime-contract-consumption` | `closed` | `only if runtime-facing UI contract bypass is proven` | `Closed on 2026-07-07 after the bounded shared-dialog replacement landed and verification passed.` |
| `queue.main-shell-and-layout-editor-ownerization` | `closed` | `only if fresh evidence proves main.ts still owns non-shell UI/editor state decisions and the layout editor still lacks an independent owner line` | `Closed on 2026-07-08 after fresh source audit proved the accepted pure-shell line is reached. The known repository-wide import.meta and ?url asset typing/configuration gap remains outside this queue slice and no longer keeps this queue live.` |

### Candidate Classification Record

| Item ID | Classification | Proposed Queue | Disposition | Basis |
| --- | --- | --- | --- | --- |
| `item.zhuyuanzhang-scenario-pack-integration` | `queue-candidate` | `queue.zhuyuanzhang-scenario-pack-integration` | `admitted + blocked handoff written` | `Fresh evidence first showed the current production path still depends on pack-private zhuyuanzhang hard-import glue, while the current shared scenario-pack surface was sufficient for a bounded queue. Later queue execution proved that after the last lawful same-surface slice, the remaining residue requires upstream shared capability rather than another in-queue decoupling cut.` |
| `item.shared-contract-upgrade-governance` | `queue-candidate` | `queue.shared-contract-upgrade-governance` | `admitted + done` | `Fresh blocker evidence from queue.zhuyuanzhang-scenario-pack-integration proved the remaining seven house-content adapter residues could not continue under the current shared surface because no shared house-content/default-content slot family or equivalent loader, validator, active-content, or consumer support existed. The admitted queue then landed the first module-keyed houseModuleDefaults slice and returned control to target-level review.` |
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
  - `queue.shared-contract-upgrade-governance is no longer active. Its first shared houseModuleDefaults slice landed and the queue is now historical evidence only.`
  - `Fresh candidate audit on 2026-07-08 confirms item.home-keep-fallback-retirement is candidate-only dead cleanup on current evidence. home-house and keep-house now read shared houseModuleDefaults on the production path, while the legacy fallback TS plus JSON files remain only as dead cleanup residue behind src/content/pack-content-access.ts and boundary-test coverage, so no new cleanup queue is admitted or activated.` 
  - `Blocked-queue recovery review then rechecked all seven recorded house residues against the new shared surface. home-house was already migrated, keep-house was the unique smallest lawful resumed slice, and the queue was re-activated on that basis.`
  - `The resumed keep-house, market-house, and tavern slices are now landed on the shared houseModuleDefaults seam. A same-queue regression repair then removed the keep-house plus temple-house live-default snapshot bug without opening a new queue or a new admission review.`
  - `Tea-house has now landed on the shared houseModuleDefaults seam after a fresh implementation audit reconfirmed it stays within current shared-surface bounds.`
  - `Medicine-house has now landed on the same shared houseModuleDefaults seam as well: the house module, compounding minigame, and medicine-compounding playable bridge no longer depend on pack-private content access, and the dead medicine-house content registry files were removed after the shared defaults path was connected.`
  - `A bounded grain-shop residue decomposition then split the remaining grain-shop work into three smaller legal families: market-text, session-seed, and accounting-family.`
  - `The grain-shop market-text family has now landed on the shared houseModuleDefaults seam: grain-market.ts reads greeting/default-line/rumor text bundles through a shared defaults helper instead of src/content/houses/grain-shop-content.ts, and zhuyuanzhang now publishes the grain-shop payload on the shared scenario-pack surface.`
  - `The grain-shop session-seed family has now landed on the same shared houseModuleDefaults seam: init-grain-shop-session.ts plus grain-shop-snapshot.ts read grainShopInitialValues through the shared defaults helper instead of src/content/houses/grain-shop-content.ts, and no new shared slot, loader, validator, or runtime contract was needed.`
  - `The grain-shop accounting-family has now landed on the same shared houseModuleDefaults seam as well: accounting-minigame.ts, grain-shop-house-module.ts, and grain-accounting-definition.ts read accountingGradeRewards plus accounting timing/tuning through the shared defaults helper without any new shared slot, loader, validator, or playable bridge contract change.`
  - `src/content/houses/grain-shop-content.ts, src/content/scenario-packs/zhuyuanzhang/house-content/grain-shop-content.json, and the matching grain-shop fallback glue in src/content/pack-content-access.ts were removed because no covered grain-shop production consumer still depends on the old adapter path.`
  - `The pack-private content-access decoupling task is now implementation-complete on current evidence, and queue.zhuyuanzhang-scenario-pack-integration closeout sync is now complete as well.`
  - `Fresh governance audit on 2026-07-08 reconfirmed item.zhuyuanzhang-scenario-pack-integration-closeout-sync as an executed current-target governance item rather than a queue-candidate: the queue doc still records pack-private-content-access-decoupling = done, queue-closeout = done, queue_status = done, and closeout_status = done, so target control remains at target-level promotion-review with no new queue activation.`
  - `The target has therefore returned to target-level promotion-review with no active queue, rather than staying in queue-local implementation or queue-local blocker handling.`
  - `Single-active-queue mode remains in force, and no second queue is auto-activated by this closeout.`
- `The covered overlay/inventory/city-menu click family now routes through application/ui/app-click-coordinator.ts, the covered activity-qte/scene/story-battle action family now routes through application/runtime/interactive-action-coordinator.ts, the bounded campaign-travel owner family now routes through application/runtime/campaign-travel-coordinator.ts, the bounded map-auto-advance owner family now routes through application/runtime/map-auto-advance-coordinator.ts, the bounded city/house transition plus access-refusal owner family now routes through application/runtime/city-house-transition-coordinator.ts, the bounded council-priority plus city-begging owner family now routes through application/runtime/council-priority-city-begging-coordinator.ts, the bounded city-directory or leader-residence plus related house-side transition entry owner family now routes through application/runtime/city-directory-leader-residence-coordinator.ts, the bounded mapped city-3d or scene-object house entry owner family now routes through application/runtime/city-3d-house-entry-coordinator.ts, the bounded house drag/drop shell write owner family now routes through application/runtime/house-drag-drop-coordinator.ts, the bounded campaign move animation helper owner family now routes through application/runtime/campaign-move-animation-coordinator.ts, the bounded startup/session apply wiring owner family now routes through application/startup/startup-session-apply-coordinator.ts, and the bounded shell-side boot/lifecycle assembly owner family now routes through application/startup/shell-boot-lifecycle-coordinator.ts.`
- `This round was a fresh source audit rather than a new extraction batch. Fresh source evidence now shows the remaining src/main.ts shell residue is limited to accepted pure-shell responsibilities only: DOM root lookup, dependency/coordinator assembly, startup entry registration, top-level browser event registration, lifecycle boot or destroy primitives, and loading-screen primitive helpers.`
- `queue.main-shell-and-layout-editor-ownerization is no longer an active execution queue. Its bounded ownerization goal is complete on current evidence, and the closed queue record now serves as historical evidence only.`
  - `Fresh verification on 2026-07-08 kept npm run lint:blueprints and npm run typecheck passing; npm test still fails only through the existing build:test asset/tooling blocker outside this queue slice, which remains target-level background rather than a live queue blocker.`
- `queue.zhuyuanzhang-scenario-pack-integration was reactivated after blocked-queue recovery review proved that the new shared houseModuleDefaults surface materially clears its old blocker. The resumed keep-house, market-house, tavern, tea-house, medicine-house, and bounded grain-shop slices are now complete, and the queue has now closed as historical evidence after its formal closeout sync.`
- `2026-07-08: queue.zhuyuanzhang-scenario-pack-integration absorbed and closed a same-queue regression repair after fresh source audit proved that keep-house and temple-house were the only two modules freezing default activity/task lookups from a live defaultRuntimeContent view at module import time. The minimal fix moved both derivations to runtime and kept queue identity unchanged.`
- `2026-07-08: a fresh post-repair residue decomposition rechecked grain-shop, medicine-house, and tea-house. grain-shop remains wider, while medicine-house and tea-house still tie on current evidence, so the active queue continues without inventing a fake next slice.`
- `2026-07-08: a later bounded tie-break review rechecked only medicine-house versus tea-house and selected tea-house as the unique smaller next slice. The deciding evidence was lower coupling: tea-house avoids the shared playable-runtime bridge, carries a lighter module-default payload family, and has a narrower targeted verification surface than medicine-house.`
- `2026-07-08: tea-house decoupling then landed on the shared houseModuleDefaults seam. The tea-house module, actor helper, and debate helper no longer depend on pack-private content access, the old tea-house content registry files were removed, and medicine-house became the next unique slice while grain-shop remained broader.`
- `2026-07-08: medicine-house decoupling then landed on the shared houseModuleDefaults seam. The medicine-house module, compounding minigame, and medicine-compounding playable definition no longer depend on pack-private content access, the old medicine-house content registry files were removed, and grain-shop became the only remaining lawful next slice.`
- `2026-07-08: a bounded grain-shop residue decomposition then selected market-text as the unique smallest grain-shop sub-slice because only grain-market.ts still read that payload directly, the payload stayed limited to three text-id bundles, it avoided session-seed and playable-bridge coupling, and its verification surface was narrower than the remaining grain-shop families.`
- `2026-07-08: the grain-shop market-text sub-slice then landed on the shared houseModuleDefaults seam. grain-market.ts no longer depends on grain-shop-content fallback glue for greeting/default-line/rumor text bundles, zhuyuanzhang now publishes grain-shop payload on the shared scenario-pack surface, and grain-shop session-seed became the unique next sub-slice while accounting-family remained broader.`
- `2026-07-08: the grain-shop session-seed sub-slice then landed on the shared houseModuleDefaults seam. init-grain-shop-session.ts plus grain-shop-snapshot.ts no longer depend on grain-shop-content fallback glue for grainShopInitialValues, the old grain-shop adapter seam stayed intentionally narrowed because accounting-family still depends on it, and accounting-family became the unique next sub-slice under the same active task.`
- `2026-07-08: the grain-shop accounting-family sub-slice then landed on the shared houseModuleDefaults seam. accounting-minigame.ts, grain-shop-house-module.ts, and grain-accounting-definition.ts no longer depend on grain-shop-content fallback glue for accountingGradeRewards plus accounting timing/tuning payloads, the dead grain-shop content registry and JSON fallback files were removed, and the active queue moved from implementation back to queue-closeout synchronization because no lawful grain-shop residue remained.`
- `queue.shared-contract-upgrade-governance is now closed historical evidence. Its bounded shared-surface slice added one module-keyed houseModuleDefaults capability path and one home-house consumer proof, but it did not itself decide the next queue admission.`

### Queue Admission Startup Rules

1. `Read project-progress -> blueprint -> target plan -> active queue before evaluating a fresh queue item.`
2. `If an active queue exists, test whether the new item can be absorbed before considering a new queue.`
3. `If the item becomes queue-candidate, write target-plan review truth before any queue activation or implementation begins.`
4. `User scope approval remains scope approval only and must not be treated as queue admission.`

### Candidate Recovery Rule

- `Use this target plan's existing queue promotion ledger and prior review fields as the default recovery source for previously recorded queue-candidates.`
- `Do not restart a full re-audit unless new material evidence invalidates the prior classification or admission basis.`

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
