# Project Progress

## Control Block

- entry_id: `project-progress.rpg-tg`
- active_blueprint: `blueprint.rpg-tg`
- active_target: `target.project-complete-modularization`
- has_active_queue: `true`
- next_file: `docs/blueprints/queues/state-sync-and-runtime-canonicalization-queue.md`
- entry_action: `open-next-file`

## Human Context

### Source Of Truth

- Canonical resume chain:
  - `project-progress -> blueprint -> target plan -> active queue -> active task`
- Historical-only sources:
  - `docs/change-log.md`
  - `docs/superpowers/**`
  - closed queue records

### Current Repository Entry

- Current Blueprint:
  - `docs/blueprints/blueprint.md`
- Current Target Spec:
  - `docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md`
- Current Target Plan:
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`

### Historical Snapshot (2026-07-07)

- `Blueprint governance was rebuilt onto the single-writer model.`
- `The current target is intentionally open with no active queue, so same-target queue admission remains legal without fabricating placeholder work.`

### Current Review Snapshot (2026-07-08)

- `queue.main-shell-and-layout-editor-ownerization is now back to closed historical evidence for the current target. Fresh 2026-07-08 reclosure-closeout verification confirms the bounded ownerization cut is still intact in src/main.ts and that npm run lint:blueprints, npm run typecheck, and npm test all pass on the current branch, so the reopened queue no longer stays active or blocked.`
- `Fresh 2026-07-08 runtime-contract admission review promotes item.runtime-contract-hardening-round-2 into queue.state-sync-and-runtime-canonicalization as the current active queue. The existing source-backed residue still holds across src/core/runtime/state-sync-runtime.ts, src/core/contracts/runtime-request.ts, src/core/contracts/house-runtime.ts, src/core/contracts/runtime-result.ts, src/core/runtime/runtime-dispatch.ts, and src/core/runtime/interactive-runtime.ts, and this core canonicalization work is now the smallest upstream blocker ahead of the remaining consumer-side seam and cleanup candidates.`
- `Fresh 2026-07-08 consumer-seam audit records item.runtime-contract-registry-seam-closure as a second queue-candidate. Application and content consumers still bypass contract or registry seams through direct runtime or builtin-registry imports, including src/application/runtime/interactive-action-coordinator.ts, src/application/house-modules/grain-shop/grain-shop-house-module.ts, src/application/house-modules/medicine-house/medicine-house-house-module.ts, src/application/presenter/stage-presenters.ts, and src/application/house/house-runtime.ts, so this remains target-level candidate review only until a later admission decision selects it.`
- `Fresh 2026-07-08 zhuyuanzhang package audit records item.zhuyuanzhang-pack-hardcode-consolidation-and-editor-prep as another queue-candidate. zhuyuanzhang-owned pack truth still leaks outside the canonical package boundary through src/content/base-game-content-pack.ts, src/content/pack-content-access.ts, src/content/prototype-world.ts, and zhuyuanzhang-specific startup assumptions in src/main.ts; meanwhile src/content/scenario-packs/zhuyuanzhang/pack.json already points to split JSON tables, but maps.json, characters.json, houses.json, historical-characters.json, and text-entries.json remain large monolithic pack-local tables, so bounded editor-prep normalization residue remains inside the same candidate queue rather than opening an editor implementation queue.`
- `Fresh 2026-07-08 mechanism audit records item.cross-mechanism-composition-contract-closure as another queue-candidate. menu or dialogue or map or city or house or story or task or minigame composition still spans main-runtime-orchestrator, interactive-action-coordinator, city-house-transition-coordinator, house-runtime, story-battle-runtime, and src/main.ts instead of one contract-driven combination seam, so this stays candidate-only pending later target-level admission review.`
- `Fresh 2026-07-08 cadence queue closeout returns queue.review-cadence-follow-up-contract-closure to closed historical evidence. The bounded queue landed src/application/review/review-cycle.ts as the shared review-cycle seam, migrated the covered story callbacks and story battle writers, and converged keep-house, temple-house, and home-house on shared scheduling or compatibility-refresh reads without reopening the broader composition queue.`
- `Fresh 2026-07-08 adapter audit records item.legacy-adapter-and-bridge-retirement as current-target candidate-only cleanup rather than an admission-ready queue. src/core/adapters/legacy-house-adapter.ts is dead placeholder residue, but state-sync-app-bridge, house-playable-runtime-bridge, legacyInteractiveKind, createLegacyPlayableSession, and related bridge helpers still have live covered consumers, so broad bridge deletion is premature on current evidence.`
- `item.home-keep-fallback-retirement remains current-target candidate-only dead cleanup on current evidence.`
- `item.zhuyuanzhang-scenario-pack-integration-closeout-sync remains a current-target governance item whose legal action is already executed and done.`
- `queue.shared-contract-upgrade-governance and queue.zhuyuanzhang-scenario-pack-integration remain closed historical evidence only; this candidate sync does not reopen them.`
- `The current target is now back in single-active-queue execution with queue.state-sync-and-runtime-canonicalization as the only active queue. The remaining consumer, package, composition, and cleanup items stay at target-level candidate review only and do not authorize parallel implementation while this queue remains active.`
