# Shared Contract Upgrade Governance Queue

## Control Block

- queue_id: `queue.shared-contract-upgrade-governance`
- belongs_to_target: `target.project-complete-modularization`
- queue_status: `done`
- queue_class: `conditional`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- next_effect: `return-to-target-review`
- blocked_by: []
- allowed_item_classifications:
  - `current-target-item`
- reject_item_classifications:
  - `content-pipeline-item`
  - `asset-pipeline-item`
  - `future-target-candidate`
  - `historical-residue`
  - `out-of-scope`

## Human Context

### Queue Explanation

- Goal:
  - `Upgrade the smallest shared scenario-pack/content-pack surface needed to unblock the remaining zhuyuanzhang house-content residue without inventing pack-specific runtime fallback.`
  - `Move the blocked residue from pack-private house-content adapters toward one shared contract -> loader -> validator -> active-content -> consumer chain before any further pack adoption resumes.`
- Forbidden expansions:
  - `Do not fold unrelated planned shared upgrades such as visualAssets, task titleTextId/descriptionTextId adoption, or richer scene graph support into this queue unless fresh evidence later proves they are inseparable from the admitted blocker.`
  - `Do not resume zhuyuanzhang pack adoption or house-module rewiring ahead of shared upstream readiness.`
  - `Do not add pack-specific branches in main.ts, shared pack loaders, validators, or active-content assembly as a shortcut.`

### Parent Target

- Target spec:
  - `docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md`
- Target plan:
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`

### Supporting Boundaries

- `docs/superpowers/specs/2026-07-07-shared-contract-upgrade-governance-spec.md` defines the required shared upgrade order but is not live execution authority.`
- `docs/blueprints/queues/zhuyuanzhang-scenario-pack-integration-queue.md` now serves as the fresh blocker source proving this queue is needed.`

### Admission Preconditions

- `This queue is admitted only because fresh blocker evidence now proves the blocked zhuyuanzhang queue cannot continue within the current shared surface.`
- `This queue is limited to the smallest shared house-content/default-content capability family needed to unblock the recorded residue.`
- `This queue must not be used to smuggle pack-local migration, runtime fallback glue, or unrelated shared upgrades ahead of the admitted blocker scope.`
- `Single-active-queue mode remains in force; activating this queue retires target-level promotion review and no second queue may activate in parallel.`

### Activation Order

1. `Target plan admission truth is written first.`
2. `This queue becomes the only active queue for the current target.`
3. `Implementation remains bounded to the active task written here; pack adoption stays blocked until shared upstream readiness is explicit.`

### Recovery Rule

- `Resume from the target-plan admission record plus the blocked zhuyuanzhang queue handoff unless new material evidence disproves the admitted blocker basis.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.shared-contract-upgrade-governance.baseline-reconcile` | `done` | `Freeze the smallest shared house-default capability gap, map the required shared layers, and prove the first legal upstream slice without resuming pack adoption.` | `none` | `Completed on 2026-07-08 after fresh source audit confirmed the current shared chain exposes no house-default file family in ContentPackDefinition, content-pack/scenario-pack manifest keys, validators, active-content assembly, or default runtime content. The smallest legal shared capability family is one optional module-keyed houseModuleDefaults surface rather than seven house-specific shared key families or further pack-private adapters.` |
| `task.shared-contract-upgrade-governance.house-default-surface-upgrade` | `done` | `Land the first shared contract/loader/validator/active-content/consumer slice for the admitted house-default capability family.` | `task.shared-contract-upgrade-governance.baseline-reconcile` | `Completed on 2026-07-08 after the shared chain landed one optional module-keyed houseModuleDefaults surface: content-pack/scenario-pack loaders now hydrate and validate it, active-game-content/default-runtime merge and expose it, zhuyuanzhang base pack publishes house-module-defaults.json through pack.json, and home-house now consumes the shared seam instead of importing pack-private home-house content through the old adapter path.` |
| `task.shared-contract-upgrade-governance.queue-closeout` | `done` | `Run queue closeout, decide whether target control returns idle-open or another same-target admission review is justified, and sync any downstream pack-adoption readiness truth.` | `task.shared-contract-upgrade-governance.house-default-surface-upgrade` | `Closed on 2026-07-08 after the first shared slice landed, Blueprint truth was synchronized, and control returned to target-level admission review rather than auto-reactivating zhuyuanzhang or promoting a second queue in parallel.` |

### Task Definitions

#### `task.shared-contract-upgrade-governance.baseline-reconcile`

##### Control Block

- task_id: `task.shared-contract-upgrade-governance.baseline-reconcile`
- state: `done`
- scope:
  - `docs/superpowers/specs/2026-07-07-shared-contract-upgrade-governance-spec.md`
  - `docs/blueprints/queues/zhuyuanzhang-scenario-pack-integration-queue.md`
  - `src/domain/content-pack.ts`
  - `src/application/content/content-pack-loader.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `tools/scenario-pack-authoring-contract.mjs`
  - `tools/validate-scenario-packs.mjs`
  - `src/application/content/active-game-content.ts`
  - `src/application/content/default-runtime-content.ts`
  - `src/content/pack-content-access.ts`
  - `src/content/houses/**`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `docs/blueprints/queues/zhuyuanzhang-scenario-pack-integration-queue.md`
  - `src/domain/content-pack.ts`
  - `src/application/content/content-pack-loader.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `tools/scenario-pack-authoring-contract.mjs`
  - `tools/validate-scenario-packs.mjs`
  - `src/application/content/active-game-content.ts`
  - `src/application/content/default-runtime-content.ts`
  - `src/content/pack-content-access.ts`
  - `src/content/houses/*.ts`
- must_not_change:
  - `pack-specific branches in main.ts`
  - `visualAssets shared upgrade scope`
  - `task titleTextId/descriptionTextId shared upgrade scope`
  - `richer scene graph shared upgrade scope`
  - `zhuyuanzhang pack adoption or house-module rewiring ahead of shared readiness`
- done_when:
  - `The smallest admitted shared capability family is frozen into explicit contract, loader, validator, active-content, and runtime-consumer responsibilities.`
  - `The queue proves the first legal upstream implementation slice without resuming pack-level adoption too early.`
  - `Any still-unresolved cross-layer ambiguity is recorded explicitly instead of being hidden behind one helper or one queue-wide slogan.`
- verify_with:
  - `rg -n "house-content|default-content|pack-content-access|ContentPackDefinition|ScenarioPackManifestFiles|CONTENT_PACK_FILE_KEYS|SCENARIO_PACK_CANONICAL_FILES" src tools docs/blueprints tests`
  - `npm run lint:blueprints`
- if_blocked:
  - `Record the exact unresolved shared layer and return control through queue closeout or target-level blocker sync.`
  - `Do not restart pack adoption while upstream ambiguity remains.`
- promote_next_if_done: `task.shared-contract-upgrade-governance.house-default-surface-upgrade`
- stop_if:
  - `Fresh evidence proves the admitted blocker can already be solved under the current shared surface without a new capability.`
  - `Fresh evidence proves the residue actually depends on a different higher-order queue than the admitted shared house-default capability family.`

##### Human Context

- Purpose:
  - `Convert the blocked zhuyuanzhang handoff into one precise shared-upgrade execution boundary before implementation expands across multiple shared layers.`
- Failure mode:
  - `Treating "shared contract upgrade" as blanket permission to redesign unrelated shared systems or to restart pack adoption before upstream readiness exists.`
- Reconcile result on 2026-07-08:
  - `Approach A rejected: add seven independent shared key families such as homeHouseDefaults, keepHouseDefaults, grainShopDefaults, marketHouseDefaults, medicineHouseDefaults, tavernDefaults, and teaHouseDefaults. This would hardcode today's builtin residue set into the shared pack schema and expand the admitted surface beyond the smallest blocker.`
  - `Approach B rejected: keep extending pack-private adapters or inline the data into existing houses/cityNpcPools/textEntries tables. This would either preserve the illegal pack-private path or overload unrelated shared surfaces with module-owned defaults they do not semantically own.`
  - `Approach C selected: introduce one optional shared houseModuleDefaults capability family keyed by HouseModuleId. The shared chain owns transport, validation, merge, and exposure; individual house-module consumers remain responsible for interpreting their own typed default payload after shared delivery succeeds.`
  - `Required shared layers are now explicit: contract layer adds an optional houseModuleDefaults family; loader layer adds canonical manifest/file-key hydration; validator layer fail-closes on malformed module keys and non-object payloads; active-content/default-runtime layers expose module-keyed defaults without direct scenario-pack imports; runtime consumer layer proves at least one real consumer reads through the shared seam.`
  - `The first legal upstream implementation slice is therefore unique: shared contract/loader/validator/active-content/default-runtime exposure for houseModuleDefaults plus one bounded consumer proof, with no broad zhuyuanzhang house-module migration yet.`

#### `task.shared-contract-upgrade-governance.house-default-surface-upgrade`

##### Control Block

- task_id: `task.shared-contract-upgrade-governance.house-default-surface-upgrade`
- state: `done`
- scope:
  - `src/domain/content-pack.ts`
  - `src/application/content/content-pack-loader.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `tools/scenario-pack-authoring-contract.mjs`
  - `tools/validate-scenario-packs.mjs`
  - `src/application/content/active-game-content.ts`
  - `src/application/content/default-runtime-content.ts`
  - `src/domain/house.ts`
  - `src/domain/house-module.ts`
  - `src/application/content/default-pack-content.ts`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `task.shared-contract-upgrade-governance.baseline-reconcile`
- must_not_change:
  - `broad pack-local zhuyuanzhang house-module rewiring before the shared slice is actually ready`
  - `new pack-specific runtime branches`
- done_when:
  - `The first admitted shared house-default capability slice lands through the required shared layers and proves at least one real shared consumer seam.`
  - `No production consumer still needs direct imports from one scenario-pack's house-content files for the covered capability slice.`
- verify_with:
  - `npm run typecheck`
  - `npm run lint:blueprints`
- if_blocked:
  - `Record the unresolved shared layer explicitly and stop rather than widening scope silently.`
- promote_next_if_done: `task.shared-contract-upgrade-governance.queue-closeout`

##### Human Context

- Purpose:
  - `Land the first real shared upgrade slice only after the queue freezes the exact capability family.`
- Active execution boundary on 2026-07-08:
  - `The capability family is module-keyed rather than house-instance-keyed: the shared surface must carry defaults by HouseModuleId because the blocked residue is authored once per module family and reused across many HouseDefinition instances.`
  - `The first implementation cut must stay upstream-first: shared contract, manifest/file-key loading, validator, merge/exposure in active-content/default-runtime, then one bounded consumer proof.`
  - `Do not treat this task as blanket permission to migrate all seven blocked house modules in one batch. One consumer proof is enough for the first slice.`
- Implementation result on 2026-07-08:
  - `src/application/content/house-module-defaults.ts now defines the shared validator, module-keyed merge semantics, and consumer accessor for houseModuleDefaults.`
  - `src/application/content/content-pack-loader.ts and src/application/scenario/scenario-pack-loader.ts now hydrate and fail-close validate optional houseModuleDefaults manifest files instead of leaving the capability as unchecked opaque data.`
  - `src/application/content/active-game-content.ts and src/application/content/default-runtime-content.ts now merge and expose houseModuleDefaults through the shared content context rather than pack-private imports.`
  - `src/content/scenario-packs/zhuyuanzhang/pack.json now publishes house-module-defaults.json, and the bounded consumer proof moved src/application/house-modules/home-house/home-house-house-module.ts onto the shared module-default seam.`

#### `task.shared-contract-upgrade-governance.queue-closeout`

##### Control Block

- task_id: `task.shared-contract-upgrade-governance.queue-closeout`
- state: `done`
- scope:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - `docs/blueprints/queues/shared-contract-upgrade-governance-queue.md`
  - `docs/blueprints/queues/zhuyuanzhang-scenario-pack-integration-queue.md`
- must_inspect:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - `docs/blueprints/queues/shared-contract-upgrade-governance-queue.md`
  - `docs/blueprints/queues/zhuyuanzhang-scenario-pack-integration-queue.md`
- must_not_change:
  - `queue history outside the new target-level truth needed for closeout`
- done_when:
  - `Queue closeout truth is synchronized and the target plan explicitly records whether zhuyuanzhang pack adoption can legally resume or whether another same-target review is required.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Record the blocker explicitly; do not leave the queue half-active and half-historical.`
- promote_next_if_done: `none`

##### Human Context

- Purpose:
  - `Return the target to one explicit post-queue state without silently reopening pack-local work.`
- Closeout result on 2026-07-08:
  - `This queue is now historical evidence only; it does not remain active after the first shared slice landed.`
  - `Control returns to target-level promotion review with queue.zhuyuanzhang-scenario-pack-integration as the next review subject, because the new shared houseModuleDefaults surface exists but no second queue may auto-activate in parallel or by implication.`

## Closeout Decision

- queue_id: `queue.shared-contract-upgrade-governance`
- closeout_status: `done`
- verification_status: `partial`
- residue_remaining: `yes`
- residue_classification:
  - `current-target-shared-upgrade`
- next_queue_recommendation: `queue.zhuyuanzhang-scenario-pack-integration`
- promotion_justified: `pending-target-review`
- evidence:
  - `docs/blueprints/queues/zhuyuanzhang-scenario-pack-integration-queue.md now records a structured blocker showing the remaining seven house-content adapter residues cannot continue under the current shared surface.`
  - `src/domain/content-pack.ts now exposes one optional module-keyed shared houseModuleDefaults family rather than seven house-specific shared key families.`
  - `src/application/content/content-pack-loader.ts CONTENT_PACK_FILE_KEYS and src/application/scenario/scenario-pack-loader.ts manifest file definitions now hydrate and validate the shared houseModuleDefaults file family.`
  - `src/application/content/active-game-content.ts and src/application/content/default-runtime-content.ts now merge and expose the shared module-keyed defaults without direct scenario-pack imports.`
  - `src/content/scenario-packs/zhuyuanzhang/pack.json and src/content/scenario-packs/zhuyuanzhang/house-module-defaults.json now publish the first bounded real payload through the shared surface.`
  - `src/application/house-modules/home-house/home-house-house-module.ts now proves one real consumer seam can read shared module defaults without importing pack-private home-house content through the old adapter path.`
  - `node --test tests/robustness.test.cjs still reports unrelated pre-existing keep-house and temple-house task-definition failures outside this queue slice, while the new houseModuleDefaults loader/manifest/runtime-default/home-house proof checks now pass on the compiled test path.`
  - `A direct module-level verification script also confirms home-house enter/rest-menu now consume injected shared defaults from .test-dist/application/content/default-runtime-content.js after cache reset.`

## Historical Handoff Note

- Task ID:
  - `task.shared-contract-upgrade-governance.queue-closeout`
- Recorded handoff at closure:
  - `The first shared houseModuleDefaults slice is complete. Target control returns to promotion review to decide whether queue.zhuyuanzhang-scenario-pack-integration should be re-admitted under the expanded shared surface; no automatic second queue activation occurs.`
- Recorded expected output:
  - `One bounded shared-surface upgrade path that unblocks later zhuyuanzhang admission review without parallel queue activation.`
