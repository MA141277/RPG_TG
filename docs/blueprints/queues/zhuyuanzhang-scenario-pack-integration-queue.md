# Zhuyuanzhang Scenario-Pack Integration Queue

## Control Block

- queue_id: `queue.zhuyuanzhang-scenario-pack-integration`
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
  - `Finish the bounded zhuyuanzhang scenario-pack integration work that can already proceed under the current shared scenario-pack/content-pack contract surface.`
  - `Remove covered pack-private TypeScript assembly and hard-import glue from the shared production path so zhuyuanzhang behaves like one canonical scenario-pack rather than a mixed package-plus-adapter bundle.`
- Forbidden expansions:
  - `Inventing or landing a new shared scenario-pack/content-pack capability such as visualAssets, task titleTextId/descriptionTextId adoption, or richer scene graph runtime support inside this queue.`
  - `Moving shared framework/UI baseline into zhuyuanzhang or reopening unrelated house-interface/runtime governance outside the bounded pack-integration path.`

### Parent Target

- Target spec:
  - `docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md`
- Target plan:
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`

### Supporting Boundaries

- `docs/blueprints/specs/2026-07-07-zhuyuanzhang-scenario-pack-integration-support-spec.md` freezes the desired zhuyuanzhang package end state but is not live execution authority.`
- `docs/superpowers/specs/2026-07-07-shared-contract-upgrade-governance-spec.md` defines what must stay out of scope until a separate shared-contract queue is admitted.`
- `queue.shared-contract-upgrade-governance has now landed the first shared houseModuleDefaults slice, but this queue still requires target-level admission review before any resumed decoupling slice can start.`

### Admission Preconditions

- `This queue is admitted only after the target plan records fresh evidence that zhuyuanzhang still depends on pack-private TypeScript assembly or hard-import glue on the covered production path.`
- `This queue is limited to work that remains legal under the current shared scenario-pack/content-pack contract surface.`
- `This queue must not be used to introduce new shared manifest keys, new shared loader branches, new validator exceptions, or pack-specific runtime parsing.`
- `Single-active-queue mode remains in force; the shared-contract-upgrade-governance item stays candidate-only unless fresh evidence later proves this active queue is blocked on an upstream shared capability.`

### Activation Order

1. `Target plan admission truth is written first.`
2. `This queue becomes the only active queue for the current target.`
3. `Implementation remains blocked until the live active task has bounded scope and verification rules written here.`

### Recovery Rule

- `Resume from the target-plan admission record for queue.zhuyuanzhang-scenario-pack-integration unless new material evidence disproves the current shared-surface-compatible boundary.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.zhuyuanzhang-scenario-pack-integration.baseline-reconcile` | `done` | `Freeze the covered zhuyuanzhang pack-integration boundary, inventory the remaining pack-private TypeScript glue, and prove the first decoupling slice can proceed under the current shared contract surface.` | `none` | `Completed on 2026-07-08 after fresh audit confirmed that src/content/pack-content-access.ts remains the central pack-private adapter seam, while the first legal decoupling slice can proceed without inventing new shared capability.` |
| `task.zhuyuanzhang-scenario-pack-integration.pack-private-content-access-decoupling` | `done` | `Replace covered zhuyuanzhang pack-private content access glue with shared loader or active-content-driven seams on the covered production path without inventing new shared contract capability.` | `task.zhuyuanzhang-scenario-pack-integration.baseline-reconcile` | `Resumed on 2026-07-08 after blocked-queue recovery review confirmed that the new shared houseModuleDefaults surface materially clears the old upstream blocker. The resumed keep-house, market-house, tavern, tea-house, medicine-house, and all three bounded grain-shop sub-slices are now landed. The final accounting-family sub-slice removed the last covered grain-shop adapter dependency, so this implementation task no longer remains active and now hands control to queue closeout.` |
| `task.zhuyuanzhang-scenario-pack-integration.queue-closeout` | `done` | `Run queue closeout, decide whether target control returns idle-open, and decide whether shared-contract-upgrade-governance remains candidate-only or now has a proved admission basis.` | `task.zhuyuanzhang-scenario-pack-integration.pack-private-content-access-decoupling` | `Previously synchronized on 2026-07-08 as a blocked handoff to target-level admission review. After blocked-queue recovery and the later grain-shop accounting-family closeout removed the last lawful residue on the current shared surface, this task became the final active task and is now closed after formal queue-closeout sync returned target control to target-level review with no new queue auto-activation.` |

### Task Definitions

#### `task.zhuyuanzhang-scenario-pack-integration.baseline-reconcile`

##### Control Block

- task_id: `task.zhuyuanzhang-scenario-pack-integration.baseline-reconcile`
- state: `done`
- scope:
  - `docs/blueprints/specs/2026-07-07-zhuyuanzhang-scenario-pack-integration-support-spec.md`
  - `docs/superpowers/specs/2026-07-07-shared-contract-upgrade-governance-spec.md`
  - `src/content/pack-content-access.ts`
  - `src/content/story/index.ts`
  - `src/content/houses/**`
  - `src/content/scenario-packs/zhuyuanzhang/**`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `src/content/base-game-content-pack.ts`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `src/content/pack-content-access.ts`
  - `src/content/story/index.ts`
  - `src/content/houses/*.ts`
  - `src/content/scenario-packs/zhuyuanzhang/pack.json`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `shared scenario-pack/content-pack manifest keys`
  - `shared task runtime title/description consumer contract`
  - `shared scene runtime graph shape`
  - `visualAssets support`
- done_when:
  - `The remaining covered zhuyuanzhang pack-private glue and hard-import seams are enumerated and frozen into one bounded implementation slice.`
  - `The queue proves that the first implementation slice can proceed under the current shared scenario-pack/content-pack surface without a new shared-contract upgrade.`
  - `Any unresolved upstream need is recorded as candidate-only shared-contract-upgrade-governance evidence instead of being smuggled into this queue's scope.`
- verify_with:
  - `rg -n "scenario-packs/zhuyuanzhang|pack-content-access|house-content" src/content src/application tests`
  - `npm run lint:blueprints`
- if_blocked:
  - `Record the smallest missing shared capability or boundary conflict in this queue and hand target control back through queue closeout or blocker sync.`
  - `Do not silently widen the queue into shared-contract invention.`
- promote_next_if_done: `task.zhuyuanzhang-scenario-pack-integration.pack-private-content-access-decoupling`
- stop_if:
  - `Fresh evidence proves the next implementation step needs a new shared manifest field, new shared loader branch, or new shared runtime consumer capability.`
  - `Fresh evidence shows the covered residue is only asset-path cleanup or content filling under already-supported schema and does not justify queue scope.`

##### Human Context

- Purpose:
  - `Start the queue with one bounded audit task that converts the broad supporting spec into a precise, current code-backed decoupling slice.`
- Failure mode:
  - `Mistaking planned shared-contract upgrades for legal pack-local work and widening the queue into capability invention.`

#### `task.zhuyuanzhang-scenario-pack-integration.pack-private-content-access-decoupling`

##### Control Block

- task_id: `task.zhuyuanzhang-scenario-pack-integration.pack-private-content-access-decoupling`
- state: `done`
- scope:
  - `src/content/pack-content-access.ts`
  - `src/content/houses/**`
  - `src/application/**`
  - `src/content/scenario-packs/zhuyuanzhang/**`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `src/content/pack-content-access.ts`
  - `src/content/houses/*.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `shared scenario-pack/content-pack manifest schema`
  - `new pack-specific branches in main.ts`
  - `new shared capability definitions`
- done_when:
  - `Covered shared story or house content access no longer depends on direct zhuyuanzhang pack table or house-content hard imports.`
  - `The covered production path consumes the existing shared loader or active-content seams instead of pack-private TypeScript assembly.`
  - `No new shared-contract capability is introduced just to keep zhuyuanzhang working.`
- verify_with:
  - `npm run lint:blueprints`
  - `node --test tests/robustness.test.cjs --test-name-pattern "zhuyuanzhang|scenario pack|pack content access"`
- if_blocked:
  - `If a resumed slice now proves it still needs another missing shared capability, stop and return that blocker to target-level review instead of inventing it here.`
- promote_next_if_done: `task.zhuyuanzhang-scenario-pack-integration.queue-closeout`
- stop_if:
  - `The decoupling target turns out to be only content fill under already-supported schema with no shared production-path glue to remove.`

##### Human Context

- Purpose:
  - `Land the first real implementation slice after the queue startup audit fixes the exact boundary.`
- Failure mode:
  - `Replacing one pack-private adapter with another hidden adapter instead of routing through the shared content path.`
- Fresh residue decomposition on 2026-07-08:
  - `slice.house-residue.temple-false-positive`
  - `Current consumers: none.`
  - `Pack-private adapter dependency: no; src/content/houses/temple-house-content.ts was an empty file.`
  - `Shared-surface decouple status: yes; delete the dead file and remove it from residue inventory.`
  - `Shared-contract candidate boundary: no.`
  - `slice.house-residue.home-house`
  - `Current consumers: src/application/house-modules/home-house/home-house-house-module.ts.`
  - `Pack-private adapter dependency: yes; src/content/houses/home-house-content.ts imports defaultHomeHouseContent from src/content/pack-content-access.ts.`
  - `Shared-surface decouple status: no under current truth; active/default runtime content exposes activities, cities, houses, cityNpcPools, and textEntries, but not home-house recovery tuning or home-screen line bundles.`
  - `Shared-contract candidate boundary: yes if pack-driven ownership must be preserved.`
  - `slice.house-residue.keep-house`
  - `Current consumers: src/application/house-modules/keep-house/keep-house-house-module.ts.`
  - `Pack-private adapter dependency: yes.`
  - `Shared-surface decouple status: no under current truth; keepHouseDefaultContributions has no current shared manifest/content-pack slot, even though strategy text already uses text ids.`
  - `Shared-contract candidate boundary: yes.`
  - `slice.house-residue.grain-shop`
  - `Current consumers: src/application/grain-shop/accounting-minigame.ts, src/application/grain-shop/init-grain-shop-session.ts, src/application/grain-shop/grain-shop-snapshot.ts, src/application/grain-shop/grain-market.ts, src/application/house-modules/grain-shop/grain-shop-house-module.ts, src/application/playables/grain-accounting/grain-accounting-definition.ts.`
  - `Pack-private adapter dependency: yes.`
  - `Shared-surface decouple status: no under current truth; accounting rewards, seed values, and minigame tuning have no current shared loader/content-context field.`
  - `Shared-contract candidate boundary: yes.`
  - `slice.house-residue.market-house`
  - `Current consumers: src/application/house-modules/market-house/market-house-house-module.ts.`
  - `Pack-private adapter dependency: yes.`
  - `Shared-surface decouple status: no under current truth; fixed boss profile, guest pool, rumor routing, and specialty maps are not represented in the current shared content surface.`
  - `Shared-contract candidate boundary: yes.`
  - `slice.house-residue.medicine-house`
  - `Current consumers: src/application/house-modules/medicine-house/medicine-house-house-module.ts, src/application/medicine-house/compounding-minigame.ts, src/application/playables/medicine-compounding/medicine-compounding-definition.ts.`
  - `Pack-private adapter dependency: yes.`
  - `Shared-surface decouple status: no under current truth; doctor profile, herb catalog, prepared medicines, ailment targets, and compounding tuning have no current shared field.`
  - `Shared-contract candidate boundary: yes.`
  - `slice.house-residue.tavern`
  - `Current consumers: src/application/house-modules/tavern/tavern-house-module.ts, src/application/house-modules/tavern/tavern-session-state.ts.`
  - `Pack-private adapter dependency: yes.`
  - `Shared-surface decouple status: no under current truth; boss profile, wager tuning, and work-offer definitions have no current shared field.`
  - `Shared-contract candidate boundary: yes.`
  - `slice.house-residue.tea-house`
  - `Current consumers: src/application/house-modules/tea-house/tea-house-house-module.ts, src/application/tea-house/tea-house-actors.ts, src/application/tea-house/tea-house-debate.ts.`
  - `Pack-private adapter dependency: yes.`
  - `Shared-surface decouple status: no under current truth; boss profile, debate counter maps, topic weights, and tea-house tuning have no current shared field.`
  - `Shared-contract candidate boundary: yes.`
- Selection basis on 2026-07-08:
  - `The next closed slice was uniquely slice.house-residue.temple-false-positive because it was the only house-path candidate with zero production consumers, zero pack-private adapter dependency, and a trivial verification surface.`
  - `No remaining real house-content adapter slice can currently decouple through existing shared loader or active-content seams without inventing a new shared house-content/default-content contract, so the task exits active execution after this false-positive removal and records a structured blocker instead of widening scope.`
- Blocked-queue recovery review on 2026-07-08:
  - `slice.house-residue.home-house`
  - `Current consumers after shared upgrade: src/application/house-modules/home-house/home-house-house-module.ts reads shared houseModuleDefaults through defaultRuntimeContent and no longer depends on src/content/houses/home-house-content.ts for the covered default-content path.`
  - `Recovery status: already recovered and no longer the next slice.`
  - `slice.house-residue.keep-house`
  - `Current consumers: src/application/house-modules/keep-house/keep-house-house-module.ts only.`
  - `Pack-private adapter dependency: yes, still via src/content/houses/keep-house-content.ts -> src/content/pack-content-access.ts.`
  - `Shared-surface decouple status now: yes; the required payload is still module-owned strategy + default-contribution data, which fits the landed houseModuleDefaults surface without any new shared slot, loader, validator, or runtime-exposure work.`
  - `Shared-contract candidate boundary: no longer triggered on current evidence.`
  - `slice.house-residue.grain-shop`
  - `Current consumers: src/application/grain-shop/accounting-minigame.ts, src/application/grain-shop/init-grain-shop-session.ts, src/application/grain-shop/grain-shop-snapshot.ts, src/application/grain-shop/grain-market.ts, src/application/house-modules/grain-shop/grain-shop-house-module.ts, src/application/playables/grain-accounting/grain-accounting-definition.ts.`
  - `Pack-private adapter dependency: yes.`
  - `Shared-surface decouple status now: yes in principle; its payload is still module-owned and now fits houseModuleDefaults, but the multi-consumer spread and minigame/runtime touchpoints make it a wider resumed slice than keep-house.`
  - `Shared-contract candidate boundary: not triggered on current evidence.`
  - `slice.house-residue.market-house`
  - `Current consumers: src/application/house-modules/market-house/market-house-house-module.ts only.`
  - `Pack-private adapter dependency: yes.`
  - `Shared-surface decouple status now: yes in principle; its payload fits houseModuleDefaults, but actor pools, category rumor maps, and investigation specialty maps make it a larger single-consumer slice than keep-house.`
  - `Shared-contract candidate boundary: not triggered on current evidence.`
  - `slice.house-residue.medicine-house`
  - `Current consumers: src/application/house-modules/medicine-house/medicine-house-house-module.ts, src/application/medicine-house/compounding-minigame.ts, src/application/playables/medicine-compounding/medicine-compounding-definition.ts.`
  - `Pack-private adapter dependency: yes.`
  - `Shared-surface decouple status now: yes in principle; its payload fits houseModuleDefaults, but the three-consumer spread and compounding data surface make it broader than keep-house.`
  - `Shared-contract candidate boundary: not triggered on current evidence.`
  - `slice.house-residue.tavern`
  - `Current consumers: src/application/house-modules/tavern/tavern-house-module.ts, src/application/house-modules/tavern/tavern-session-state.ts.`
  - `Pack-private adapter dependency: yes.`
  - `Shared-surface decouple status now: yes in principle; its payload fits houseModuleDefaults, but work-offer plus gamble tuning make it broader than keep-house.`
  - `Shared-contract candidate boundary: not triggered on current evidence.`
  - `slice.house-residue.tea-house`
  - `Current consumers: src/application/tea-house/tea-house-debate.ts, src/application/tea-house/tea-house-actors.ts, src/application/house-modules/tea-house/tea-house-house-module.ts.`
  - `Pack-private adapter dependency: yes.`
  - `Shared-surface decouple status now: yes in principle; its payload fits houseModuleDefaults, but debate counter maps and multi-consumer touchpoints make it broader than keep-house.`
  - `Shared-contract candidate boundary: not triggered on current evidence.`
  - `Recovery review result: resume. The old blocker is materially lifted by the landed shared houseModuleDefaults surface, and keep-house is the unique smallest resumed slice because it is the only remaining residue with one production consumer and a payload limited to two bounded default families.`
- Resumed keep-house slice completion on 2026-07-08:
  - `src/application/house-modules/keep-house/keep-house-house-module.ts now reads keepHouseDefaultStrategy + keepHouseDefaultContributions from defaultRuntimeContent.houseModuleDefaults through the shared getHouseModuleDefaults seam instead of src/content/houses/keep-house-content.ts.`
  - `src/content/scenario-packs/zhuyuanzhang/house-module-defaults.json now publishes the keep-house default strategy and contribution payload on the shared scenario-pack surface.`
  - `Fresh verification directly tied to this slice now passes for keep-house shared-default consumption and for the hard boundary that keep-house-house-module.ts must not import pack-content-access fallback glue.`
  - `The remaining real residues after this landed slice were grain-shop, market-house, medicine-house, tavern, and tea-house.`
  - `market-house was the unique smallest next slice because it was the only remaining residue with one production consumer, while the others still fan out across two or more runtime/minigame consumers.`
- Resumed market-house slice audit and completion on 2026-07-08:
  - `Fresh source audit confirmed that src/application/house-modules/market-house/market-house-house-module.ts was the only production consumer still depending on src/content/houses/market-house-content.ts -> src/content/pack-content-access.ts.`
  - `The required payload stayed within the landed houseModuleDefaults surface: one fixed boss profile, one guest pool, greeting/open/small-talk text-id bundles, rumor maps by goods category, and one investigation specialty-text map. No new shared slot, loader, validator, or runtime-exposure work was needed.`
  - `src/application/house-modules/market-house/market-house-house-module.ts now reads all market-house default actor and text-id payload from defaultRuntimeContent.houseModuleDefaults through getHouseModuleDefaults instead of src/content/houses/market-house-content.ts.`
  - `src/content/scenario-packs/zhuyuanzhang/house-module-defaults.json now publishes the market-house payload on the shared scenario-pack surface, while src/content/houses/market-house-content.ts and src/content/scenario-packs/zhuyuanzhang/house-content/market-house-content.json were removed as dead fallback glue.`
  - `src/content/pack-content-access.ts no longer imports or exports market-house content, so the remaining pack-private adapter seam is narrower after this slice.`
  - `Fresh verification directly tied to this slice now passes for market-house shared-default consumption, market-house buy/investigate behavior, and the hard boundary that market-house-house-module.ts must not import market-house-content fallback glue.`
  - `The remaining real residues after this landed slice are grain-shop, medicine-house, tavern, and tea-house.`
  - `tavern is now the unique smallest next slice because it is the only remaining residue with two consumers, while medicine-house and tea-house each still span three consumers and grain-shop still spans six.`
- Resumed tavern slice audit and completion on 2026-07-08:
  - `Fresh source audit confirmed that src/application/house-modules/tavern/tavern-house-module.ts and src/application/house-modules/tavern/tavern-session-state.ts were the only remaining tavern consumers still depending on src/content/houses/tavern-content.ts -> src/content/pack-content-access.ts.`
  - `The required payload stayed within the landed houseModuleDefaults surface: boss profile, greeting/open text-id bundles, drink and wager tuning, and tavern work-offer definitions. No new shared slot, loader, validator, or runtime-exposure work was needed.`
  - `src/application/house-modules/tavern/tavern-house-module.ts and src/application/house-modules/tavern/tavern-session-state.ts now read tavern defaults from defaultRuntimeContent.houseModuleDefaults through an application-local tavern-house-content-defaults helper instead of src/content/houses/tavern-content.ts.`
  - `src/content/scenario-packs/zhuyuanzhang/house-module-defaults.json now publishes the tavern payload on the shared scenario-pack surface, while src/content/houses/tavern-content.ts and src/content/scenario-packs/zhuyuanzhang/house-content/tavern-content.json were removed as dead fallback glue.`
  - `src/content/pack-content-access.ts no longer imports or exports tavern content, so the remaining pack-private adapter seam is narrower again after this slice.`
  - `Fresh verification directly tied to this slice now passes for tavern shared-default consumption, tavern drink/gamble/work behavior, and the hard boundary that tavern house sources must not import tavern-content fallback glue.`
  - `The remaining real residues after this landed slice are grain-shop, medicine-house, and tea-house.`
  - `No uniquely narrowed next slice exists yet on current evidence because medicine-house and tea-house both still span three consumers while grain-shop still spans six, so this task remains active but stops at queue-doc reconciliation rather than auto-starting another implementation line.`
- Same-queue regression repair on 2026-07-08:
  - `This repair stayed inside queue.zhuyuanzhang-scenario-pack-integration and task.zhuyuanzhang-scenario-pack-integration.pack-private-content-access-decoupling; it was not a new queue and not a new admission review.`
  - `Fresh source audit confirmed the root cause in exactly two places: src/application/house-modules/keep-house/keep-house-house-module.ts and src/application/house-modules/temple-house/temple-house-house-module.ts each performed module-top-level derivation from src/application/content/default-pack-content.ts exports.`
  - `src/application/content/default-pack-content.ts now exposes live mutable defaultRuntimeContent views, so those top-level derived task/activity tables could freeze empty at module import time before defaultRuntimeContent.activityDefinitions was populated.`
  - `No third confirmed same-class production-path risk was found on current evidence; the only proven static snapshot bug sites were keep-house and temple-house.`
  - `The fix was intentionally minimal: both houses now derive their default task/activity lookup from the live runtime view at execution time instead of caching a module-top-level snapshot, and default-pack-content.ts now carries a short comment warning against static derivation from the live view.`
  - `Fresh targeted verification then passed for keep house starts review meeting at countdown zero and resets to 60 after assignment; temple house review only selects work direction and daily actions start temple chores later; temple house unlocked begging is chosen in review and executes later without qte; temple house daily flow resolves fortune and donation through unified state; temple work is blocked when stamina is below activity cost; and temple work reaching contribution threshold starts shared map auto advance for next review.`
- Fresh residue decomposition after regression repair on 2026-07-08:
  - `slice.house-residue.grain-shop`
  - `Current consumers: src/application/grain-shop/accounting-minigame.ts, src/application/grain-shop/init-grain-shop-session.ts, src/application/grain-shop/grain-shop-snapshot.ts, src/application/grain-shop/grain-market.ts, src/application/house-modules/grain-shop/grain-shop-house-module.ts, src/application/playables/grain-accounting/grain-accounting-definition.ts.`
  - `Pack-private adapter dependency: yes.`
  - `Shared-surface decouple status now: yes in principle; accounting rewards, seed values, rumor/default-line bundles, and minigame tuning all fit the landed houseModuleDefaults payload family without another shared slot.`
  - `Verification surface: widest of the remaining residues because it spans house-module, market/runtime helpers, session bootstrap, and playable/minigame paths.`
  - `Shared-contract candidate boundary: not triggered on current evidence.`
  - `slice.house-residue.medicine-house`
  - `Current consumers: src/application/house-modules/medicine-house/medicine-house-house-module.ts, src/application/medicine-house/compounding-minigame.ts, src/application/playables/medicine-compounding/medicine-compounding-definition.ts.`
  - `Pack-private adapter dependency: yes.`
  - `Shared-surface decouple status now: yes in principle; doctor profile, greeting/open/dialogue ids, prepared medicines, herb catalog, ailment targets, heal-service values, and compounding tuning all fit the landed houseModuleDefaults payload family without another shared slot.`
  - `Verification surface: medium and still broad enough to cover one house module plus compounding logic plus playable-definition integration.`
  - `Shared-contract candidate boundary: not triggered on current evidence.`
  - `slice.house-residue.tea-house`
  - `Current consumers: src/application/house-modules/tea-house/tea-house-house-module.ts, src/application/tea-house/tea-house-actors.ts, src/application/tea-house/tea-house-debate.ts.`
  - `Pack-private adapter dependency: yes.`
  - `Shared-surface decouple status now: yes in principle; boss profile, greeting/open/dialogue/intel ids, tea/debate tuning, topic counter map, and personality-topic weights all fit the landed houseModuleDefaults payload family without another shared slot.`
  - `Verification surface: medium and still broad enough to cover one house module plus debate engine plus actor-construction helpers.`
  - `Shared-contract candidate boundary: not triggered on current evidence.`
- Bounded medicine-house versus tea-house tie-break review on 2026-07-08:
  - `slice.house-residue.medicine-house`
  - `Production consumer distribution: src/application/house-modules/medicine-house/medicine-house-house-module.ts owns greeting/open/talk/heal/buy/compounding dispatch; src/application/medicine-house/compounding-minigame.ts owns herb selection, target generation, grade resolution, and reward lookup; src/application/playables/medicine-compounding/medicine-compounding-definition.ts owns playable-session launch, tick, settle, and runtime-state bridge behavior.`
  - `Pack-private adapter dependency position: src/content/houses/medicine-house-content.ts -> src/content/pack-content-access.ts -> src/content/scenario-packs/zhuyuanzhang/house-content/medicine-house-content.json, then imported by all three production consumers.`
  - `houseModuleDefaults payload complexity: medium-high; one doctor profile plus three text-id bundles, one heal-service config, one prepared-medicine catalog, one herb catalog, one ailment-target catalog, one compounding turn limit, one compounding duration, and one nested grade-reward table all need to move together.`
  - `Runtime/minigame/actor/state extra coupling: highest of the remaining tie pair because the slice crosses house dialog state, compounding overlay state, shared playable runtime launch/exit/tick, house-playable runtime bridge, and playable time-advance cost plumbing.`
  - `Targeted verification surface size: larger of the tie pair; current direct coverage includes ten medicine-specific or medicine-compounding-specific robustness checks plus one hardcoded boundary file touchpoint, including two child-32 playable-session integration tests.`
  - `Shared-contract candidate boundary: not triggered on current evidence.`
  - `slice.house-residue.tea-house`
  - `Production consumer distribution: src/application/house-modules/tea-house/tea-house-house-module.ts owns greeting/open/talk/inquire/debate dispatch and house overlay state; src/application/tea-house/tea-house-debate.ts owns debate round rules and topic counter resolution; src/application/tea-house/tea-house-actors.ts only materializes the fixed boss plus guest actors, and its pack-private dependency is limited to the fixed boss profile while guest pools already come from shared cityNpcPools.`
  - `Pack-private adapter dependency position: src/content/houses/tea-house-content.ts -> src/content/pack-content-access.ts -> src/content/scenario-packs/zhuyuanzhang/house-content/tea-house-content.json, then imported by the three tea-house consumers.`
  - `houseModuleDefaults payload complexity: medium; one boss profile plus four text-id bundles, tea/debate numeric tuning, one topic counter map, and one personality-topic-weight map fit cleanly into one module-owned default family without the extra catalog depth that medicine-house carries.`
  - `Runtime/minigame/actor/state extra coupling: lower than medicine-house; the slice still spans actor selection and debate state, but it does not cross the shared playable runtime or house-playable bridge and does not carry medicine-house-style catalog or reward-settlement data.`
  - `Targeted verification surface size: smaller of the tie pair; current direct coverage is concentrated in eight tea-house-specific robustness checks plus one hardcoded boundary file touchpoint, and it lacks the extra playable-session integration tests that medicine-house must preserve.`
  - `Shared-contract candidate boundary: not triggered on current evidence.`
  - `Selection result: tea-house is now the unique smaller next slice on fresh evidence. Medicine-house and tea-house still tie on consumer count and both fully fit the landed houseModuleDefaults surface, but tea-house wins the tie-break because its payload family is lighter, its actor helper already leans on shared cityNpcPools for guests, it avoids shared playable-runtime bridge coupling, and its targeted verification surface is narrower.`
  - `Queue consequence: task.zhuyuanzhang-scenario-pack-integration.pack-private-content-access-decoupling remains active execution on current truth because there is now one unique lawful next slice instead of a tie that would force target-level review.`
- Resumed tea-house slice audit and completion on 2026-07-08:
  - `Fresh implementation audit confirmed that src/application/house-modules/tea-house/tea-house-house-module.ts, src/application/tea-house/tea-house-actors.ts, and src/application/tea-house/tea-house-debate.ts were the only production consumers still depending on src/content/houses/tea-house-content.ts -> src/content/pack-content-access.ts.`
  - `The required payload stayed within the landed houseModuleDefaults surface: fixed boss profile, greeting/open/dialogue/intel text-id bundles, tea and debate numeric tuning, one topic counter map, and one personality-topic-weight map. No new shared slot, loader, validator, or runtime-exposure work was needed.`
  - `src/application/house-modules/tea-house/tea-house-house-module.ts, src/application/tea-house/tea-house-actors.ts, and src/application/tea-house/tea-house-debate.ts now read tea-house defaults from defaultRuntimeContent.houseModuleDefaults through src/application/house-modules/tea-house/tea-house-content-defaults.ts instead of src/content/houses/tea-house-content.ts.`
  - `src/content/scenario-packs/zhuyuanzhang/house-module-defaults.json now publishes the tea-house payload on the shared scenario-pack surface, while src/content/houses/tea-house-content.ts and src/content/scenario-packs/zhuyuanzhang/house-content/tea-house-content.json were removed as dead fallback glue.`
  - `src/content/pack-content-access.ts no longer imports or exports tea-house content, so the remaining pack-private adapter seam is narrower again after this slice.`
  - `Fresh verification directly tied to this slice now passes for tea-house shared-default consumption, tea-house actor/debate behavior, and the hard boundary that tea-house sources must not import tea-house-content fallback glue.`
  - `The remaining real residues after this landed slice are grain-shop and medicine-house.`
  - `medicine-house is now the unique smaller next slice because grain-shop still spans six production consumers while medicine-house spans three, and no new shared-contract boundary is triggered on current evidence.`
- Resumed medicine-house slice audit and completion on 2026-07-08:
  - `Fresh implementation audit confirmed that src/application/house-modules/medicine-house/medicine-house-house-module.ts, src/application/medicine-house/compounding-minigame.ts, and src/application/playables/medicine-compounding/medicine-compounding-definition.ts were the only production consumers still depending on src/content/houses/medicine-house-content.ts -> src/content/pack-content-access.ts.`
  - `The required payload stayed within the landed houseModuleDefaults surface: doctor profile, greeting/open/dialogue text-id bundles, heal-service tuning, prepared-medicine catalog, herb catalog, ailment targets, and compounding reward or timing tuning. No new shared slot, loader, validator, or runtime-exposure work was needed.`
  - `src/application/house-modules/medicine-house/medicine-house-house-module.ts, src/application/medicine-house/compounding-minigame.ts, and src/application/playables/medicine-compounding/medicine-compounding-definition.ts now read medicine-house defaults from defaultRuntimeContent.houseModuleDefaults through src/application/house-modules/medicine-house/medicine-house-content-defaults.ts instead of src/content/houses/medicine-house-content.ts.`
  - `The medicine-house module now also treats the shared doctor profile as the authoritative fallback display source, so runtime profile overrides still close cleanly even when characterDefinitions do not carry a separate custom NPC row.`
  - `src/content/scenario-packs/zhuyuanzhang/house-module-defaults.json now publishes the medicine-house payload on the shared scenario-pack surface, while src/content/houses/medicine-house-content.ts and src/content/scenario-packs/zhuyuanzhang/house-content/medicine-house-content.json were removed as dead fallback glue.`
  - `src/content/pack-content-access.ts no longer imports or exports medicine-house content, so the remaining pack-private adapter seam narrows again after this slice.`
  - `Fresh verification directly tied to this slice now passes for medicine-house shared-default consumption, medicine-house behavior plus medicine-compounding behavior, and the hard boundary that medicine-house sources must not import medicine-house-content fallback glue.`
  - `The remaining real residue after this landed slice is grain-shop only.`
  - `grain-shop is now the unique remaining next slice because no other lawful pack-private house-content residue remains on the current shared surface.`
- Bounded grain-shop residue decomposition on 2026-07-08:
  - `slice.grain-shop.market-text`
  - `Current production consumers: src/application/grain-shop/grain-market.ts directly; src/application/grain-shop/investigate-grain-market.ts and src/application/house-modules/grain-shop/grain-shop-house-module.ts only consume it indirectly through grain-market helpers.`
  - `Pack-private adapter dependency position: src/application/grain-shop/grain-market.ts -> src/content/houses/grain-shop-content.ts -> src/content/pack-content-access.ts -> src/content/scenario-packs/zhuyuanzhang/house-content/grain-shop-content.json.`
  - `Payload family: grainShopNpcGreetingTextIds, grainShopNpcDefaultLineTextIds, grainShopMarketRumorTextIds.`
  - `Shared-surface decouple status: yes; the whole text-bundle family fits cleanly inside the landed houseModuleDefaults surface without a new shared slot, loader, validator, or playable/runtime contract change.`
  - `Verification surface: smallest grain-shop family; existing greeting/investigate behavior checks plus one new shared-default consumption check and one direct boundary check cover the production path.`
  - `Shared-contract/playable/loader boundary: not triggered; no playable bridge, no loader upgrade, and no new runtime contract needed.`
  - `slice.grain-shop.session-seed`
  - `Current production consumers: src/application/grain-shop/init-grain-shop-session.ts and src/application/grain-shop/grain-shop-snapshot.ts directly; src/application/house-modules/grain-shop/grain-shop-house-module.ts and src/application/grain-shop/investigate-grain-market.ts consume the seeded values indirectly through those helpers.`
  - `Pack-private adapter dependency position: both helpers still import grainShopInitialValues from src/content/houses/grain-shop-content.ts -> src/content/pack-content-access.ts -> src/content/scenario-packs/zhuyuanzhang/house-content/grain-shop-content.json.`
  - `Payload family: grainShopInitialValues only.`
  - `Shared-surface decouple status: yes; one initial-values object fits fully inside the landed houseModuleDefaults surface without another shared capability.`
  - `Verification surface: medium-small; narrower than accounting-family, but broader than market-text because it affects session seeding, snapshot fallback values, and downstream investigate/view-model behavior.`
  - `Shared-contract/playable/loader boundary: not triggered; no playable bridge and no loader upgrade required.`
  - `slice.grain-shop.accounting-family`
  - `Current production consumers: src/application/grain-shop/accounting-minigame.ts, src/application/house-modules/grain-shop/grain-shop-house-module.ts, src/application/playables/grain-accounting/grain-accounting-definition.ts directly, with src/application/grain-shop/apply-accounting-reward.ts coupled through accounting grade reward lookup.`
  - `Pack-private adapter dependency position: the direct consumers still import accountingGradeRewards, accountingGameDurationSec, and accountingMaxWrongAnswers through src/content/houses/grain-shop-content.ts -> src/content/pack-content-access.ts -> src/content/scenario-packs/zhuyuanzhang/house-content/grain-shop-content.json.`
  - `Payload family: accountingGradeRewards, accountingGameDurationSec, accountingMaxWrongAnswers.`
  - `Shared-surface decouple status: yes; the payload fits houseModuleDefaults, but it must move across the house module, minigame loop, reward settlement, and playable-definition bridge together to stay coherent.`
  - `Verification surface: largest grain-shop family; it spans house dispatch, minigame question flow, settlement/reward lookup, and child-32 playable-session bridge coverage.`
  - `Shared-contract/playable/loader boundary: no new shared contract is needed, but the family does touch the existing playable bridge, so it is not the smallest next cut.`
  - `Selection result: grain-shop market-text is the unique smallest lawful next cut on fresh evidence because it has the most concentrated direct consumer surface, the lightest payload family, the smallest targeted verification surface, and no playable/session-seed coupling.`
  - `Queue consequence: the active task stays in active execution because one unique grain-shop sub-slice exists and can be implemented without widening scope.`
- Grain-shop market-text sub-slice completion on 2026-07-08:
  - `src/application/grain-shop/grain-market.ts now reads grain-shop greeting/default-line/rumor bundles from defaultRuntimeContent.houseModuleDefaults through src/application/house-modules/grain-shop/grain-shop-content-defaults.ts instead of src/content/houses/grain-shop-content.ts.`
  - `src/content/scenario-packs/zhuyuanzhang/house-module-defaults.json now publishes the grain-shop payload on the shared scenario-pack surface so the new shared defaults path is live for current and follow-up grain-shop slices.`
  - `src/content/houses/grain-shop-content.ts and src/content/pack-content-access.ts remain live only for the unmigrated grain-shop session-seed plus accounting families; no dead grain-shop adapter file was removed yet because that would widen beyond the landed sub-slice.`
  - `Fresh verification directly tied to this slice now passes for grain-shop market-text shared-default consumption, grain-shop greeting/investigate behavior, trade overlay stability, and the hard boundary that grain-market.ts must not import grain-shop-content fallback glue.`
  - `The remaining grain-shop residue now narrows to session-seed plus accounting-family.`
  - `grain-shop session-seed is now the unique next sub-slice because it stays inside two helper consumers and one initial-values payload family, while accounting-family still crosses house-module, minigame, reward-settlement, and playable-definition behavior.`
- Grain-shop session-seed sub-slice audit and completion on 2026-07-08:
  - `Fresh source audit confirmed that src/application/grain-shop/init-grain-shop-session.ts and src/application/grain-shop/grain-shop-snapshot.ts were the only direct production consumers still depending on grainShopInitialValues through src/content/houses/grain-shop-content.ts -> src/content/pack-content-access.ts.`
  - `The required payload stayed within the landed houseModuleDefaults surface: one grainShopInitialValues object carrying money, food, math, relationship, and time seed values. No new shared slot, loader, validator, or runtime contract was needed.`
  - `src/application/grain-shop/init-grain-shop-session.ts and src/application/grain-shop/grain-shop-snapshot.ts now read grainShopInitialValues from defaultRuntimeContent.houseModuleDefaults through src/application/house-modules/grain-shop/grain-shop-content-defaults.ts instead of src/content/houses/grain-shop-content.ts.`
  - `Fresh verification directly tied to this slice now passes for grain-shop session-seed shared-default consumption and the hard boundary that init-grain-shop-session.ts plus grain-shop-snapshot.ts must not import grain-shop-content fallback glue.`
  - `src/content/houses/grain-shop-content.ts and src/content/pack-content-access.ts remain live only for grain-shop accounting-family, because accountingGradeRewards plus accounting timing/tuning payloads still flow through that narrower legacy seam and this slice did not widen into accounting-family cleanup.`
  - `The remaining grain-shop residue now narrows to accounting-family only.`
  - `grain-shop accounting-family is now the unique next sub-slice because no other grain-shop pack-private payload family remains on the current shared surface.`
- Grain-shop accounting-family audit and completion on 2026-07-08:
  - `Fresh source audit confirmed that accountingGradeRewards flowed through src/application/grain-shop/accounting-minigame.ts and then into reward settlement on both the grain-shop house module path plus the grain-accounting playable path, while accountingGameDurationSec flowed through src/application/playables/grain-accounting/grain-accounting-definition.ts and accountingMaxWrongAnswers flowed through both src/application/playables/grain-accounting/grain-accounting-definition.ts plus src/application/house-modules/grain-shop/grain-shop-house-module.ts.`
  - `All three payload families were still reaching runtime through one remaining pack-private seam: src/content/houses/grain-shop-content.ts -> src/content/pack-content-access.ts -> src/content/scenario-packs/zhuyuanzhang/house-content/grain-shop-content.json.`
  - `Fresh evidence kept the slice within the current shared surface. The payload already fit inside src/application/house-modules/grain-shop/grain-shop-content-defaults.ts and required no new shared slot, loader, validator, or playable bridge contract upgrade.`
  - `src/application/grain-shop/accounting-minigame.ts, src/application/house-modules/grain-shop/grain-shop-house-module.ts, and src/application/playables/grain-accounting/grain-accounting-definition.ts now read accountingGradeRewards plus accounting timing/tuning from defaultRuntimeContent.houseModuleDefaults through src/application/house-modules/grain-shop/grain-shop-content-defaults.ts.`
  - `src/content/houses/grain-shop-content.ts, src/content/scenario-packs/zhuyuanzhang/house-content/grain-shop-content.json, and the matching grain-shop fallback glue in src/content/pack-content-access.ts were removed because no covered production grain-shop consumer still depended on them after this slice landed.`
  - `Fresh verification directly tied to this slice now passes for grain-shop accounting-family shared-default consumption, grain-shop accounting behavior plus child-32 playable-session integration, the hard boundaries that accounting-family consumers must not import grain-shop-content fallback glue, and the removal of the legacy grain-shop content registry file.`
  - `No lawful grain-shop pack-private house-content residue remains on the current shared surface after this slice.`
  - `Queue consequence: task.zhuyuanzhang-scenario-pack-integration.pack-private-content-access-decoupling is now done, and the queue advances to queue-closeout synchronization instead of keeping another implementation slice active.`

#### `task.zhuyuanzhang-scenario-pack-integration.queue-closeout`

##### Control Block

- task_id: `task.zhuyuanzhang-scenario-pack-integration.queue-closeout`
- state: `done`
- scope:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - `docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md`
  - `docs/blueprints/queues/zhuyuanzhang-scenario-pack-integration-queue.md`
- must_inspect:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - `docs/blueprints/queues/zhuyuanzhang-scenario-pack-integration-queue.md`
- must_not_change:
  - `queue history outside the new target-level truth needed for closeout`
- done_when:
  - `Queue closeout truth is synchronized and the target plan explicitly records whether another queue admission is justified.`
  - `shared-contract-upgrade-governance remains candidate-only unless a fresh blocker was actually proven during the active queue.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Record the blocker explicitly; do not leave the queue floating between active and historical states.`
- promote_next_if_done: `none`
- stop_if:
  - `The active implementation task is not actually closed yet.`

##### Human Context

- Purpose:
  - `Return the target to one explicit post-queue state and avoid silently auto-promoting a second queue.`
- Failure mode:
  - `Treating the existence of the shared-contract governance spec as automatic promotion authority.`

## Closeout Decision

- queue_id: `queue.zhuyuanzhang-scenario-pack-integration`
- closeout_status: `done`
- verification_status: `passed`
- residue_remaining: `no`
- residue_classification:
  - `current-target-pack-integration`
  - `resumed-under-shared-surface`
- next_queue_recommendation: `none`
- promotion_justified: `true`
- evidence:
  - `The covered production path no longer depends on grain-shop house-content fallback glue after accounting-family landed on the shared houseModuleDefaults seam.`
  - `A fresh source audit proved src/content/story/index.ts had no remaining production-path consumers after story ownership converged on ActiveGameContentContext.storyContent, so that dead adapter file was removed rather than migrated.`
  - `A bounded house-residue decomposition proved src/content/houses/temple-house-content.ts was a zero-consumer empty file with no adapter dependency, so it was removed instead of migrated.`
  - `The former final covered residue, grain-shop accounting-family, no longer consumes zhuyuanzhang defaults through src/content/pack-content-access.ts.`
  - `src/application/scenario/scenario-pack-loader.ts and src/content/scenario-packs/zhuyuanzhang/pack.json already prove that the current shared scenario-pack surface exists for a bounded integration queue to continue.`
  - `queue.shared-contract-upgrade-governance landed the first shared houseModuleDefaults slice and proved the new contract/loader/validator/active-content/default-runtime path with home-house as the first consumer proof.`
  - `Fresh blocked-queue recovery review then rechecked all seven recorded house residues against the landed surface.`
  - `home-house, keep-house, market-house, tavern, tea-house, and medicine-house are now landed on the shared surface, and grain-shop no longer needs another upstream shared-contract queue merely to carry module-owned default payload.`
  - `A same-queue regression repair then removed the live-default snapshot bug in keep-house and temple-house without changing queue identity or admission state.`
  - `A later bounded tie-break review then selected tea-house as the unique smaller next residue over medicine-house because tea-house avoids shared playable-runtime bridge coupling and carries a lighter payload plus verification surface, while grain-shop remained broader.`
  - `Tea-house and medicine-house then landed on the shared surface as well, grain-shop became the only remaining lawful residue, and all three bounded grain-shop sub-slices are now closed.`
  - `The queue therefore no longer stays on the decoupling implementation task and has now completed queue-closeout synchronization under the same single-active-queue mode.`

## Closeout Completion

- `Formal queue-closeout sync is now complete on 2026-07-08.`
- `The queue implementation goal is complete on current evidence.`
- `No lawful pack-private house-content residue remains inside this queue boundary.`
- `The queue is not blocked.`
- `No new shared-contract queue is needed to finish the residue family that this queue owned.`
- `Target control has returned to target-level review with no active queue.`

## Historical Handoff Note

- Task ID:
  - `task.zhuyuanzhang-scenario-pack-integration.pack-private-content-access-decoupling`
- Recorded handoff at closure:
  - `The historical blocked handoff has been superseded by blocked-queue recovery review. queue.shared-contract-upgrade-governance removed the old upstream blocker, and this queue is now resumed on the unique keep-house slice rather than remaining in passive handoff state.`
- Recorded expected output:
  - `Structured blocker truth, no active queue, and one explicit target-level admission review subject without parallel queue activation.`
