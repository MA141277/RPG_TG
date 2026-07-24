# Event Canonical Reuse First-Batch Map

## Purpose

- `This report is the Slice 1 canonical mapping artifact for queue.event-and-building-instance-canonical-reuse.`
- `It freezes the first rewrite batch at the family/pattern level so task3 implementation can rewrite owned references without reopening canonical-id selection.`

## Scope

- `Pack audited: src/content/scenario-packs/zhuyuanzhang`
- `Families covered in this first batch: action-menu-owned event families, their paired building-container-item-action binding families, and arrangement strong-fold groups already approved by the active queue.`
- `Out of batch for now: building-enter / city-enter / story-progress / indoor-screen-shown bindings, all task-owned semantics, and any arrangement group still listed as a preservation exception below.`

## Machine-Readable Artifacts

- `generated/blueprint/event-canonical-reuse-first-batch-map.json` is the machine-readable counterpart of this report and currently freezes 30 canonical event groups / 627 source event ids, 30 canonical binding groups / 627 source binding ids, and 8 canonical arrangement groups / 146 source arrangement ids.`
- `generated/blueprint/event-canonical-reuse-rewrite-audit.json` is the current non-destructive rewrite baseline audit. It simulates first-batch event-id canonicalization against the live zhuyuanzhang pack so task3 can distinguish safe multi-binding multiplex from real duplicate-payload conflicts before source rewrite lands.`
- `generated/blueprint/event-canonical-reuse-token-preflight.json` derives the next rewrite-preflight token layer from the same canonical map. It currently shows that the first batch splits cleanly into 21 launchFlow-capable event families, 9 closeBuilding-only event families, and 0 mixed-action families, while owner/building/container tokens all remain template-derivable for the mapped groups.`
- `generated/blueprint/event-canonical-reuse-coupled-rewrite-impact.json` is the current impact matrix for the lawful rewrite slice. It freezes 9 impact areas across 15 concrete files: 3 data-source areas, 5 consumer areas, and 1 guard area that must move together once the coupled rewrite lands.`
- `generated/blueprint/event-canonical-reuse-source-rewrite-preview.json` is now historical pre-home evidence. It still records the family readiness partition that justified selecting `home` first, but it is no longer the live next-slice selector after the home batch landed.`
- `generated/blueprint/event-canonical-reuse-home-implementation-slice.json` is now historical applied-slice evidence. It records why the first real implementation slice started at `home`, not the still-pending next family.`
- `generated/blueprint/event-canonical-reuse-flow-preflight.json` is now historical pre-home flow evidence. It remains valid for the completed home launchFlow collapse, but it is no longer the live selector for the next family.`
- `generated/blueprint/event-canonical-reuse-home-applied-rewrite-summary.json`, `generated/blueprint/event-canonical-reuse-leader_residence-applied-rewrite-summary.json`, `generated/blueprint/event-canonical-reuse-temple-applied-rewrite-summary.json`, `generated/blueprint/event-canonical-reuse-keep-applied-rewrite-summary.json`, `generated/blueprint/event-canonical-reuse-tea_house-applied-rewrite-summary.json`, `generated/blueprint/event-canonical-reuse-market-applied-rewrite-summary.json`, `generated/blueprint/event-canonical-reuse-grain_shop-applied-rewrite-summary.json`, `generated/blueprint/event-canonical-reuse-medicine_house-applied-rewrite-summary.json`, and `generated/blueprint/event-canonical-reuse-inn-applied-rewrite-summary.json` are the live applied-state artifacts for the completed `home`, `leader_residence`, `temple`, `keep`, `tea_house`, `market`, `grain_shop`, `medicine_house`, and `inn` batches. They record the canonical targets, applied counts, preserved live payload anchors, and confirm that production source truth no longer retains city-scoped `home.*`, `leader_residence.*`, `keep.*`, `tea_house.*`, `market.*`, `grain_shop.*`, `medicine_house.*`, or `inn.*` event/flow ids outside the recorded preserved-exception set.`
- `generated/blueprint/event-canonical-reuse-next-slice-candidates.json` is the live post-temple selector state. It records the completed family set and confirms that no remaining non-home source-rewrite candidates survive in the selector.`

## Canonical Event Families

| Source family | Action | Source copies | Canonical event id |
| --- | --- | ---: | --- |
| `home` | `rest` | `20` | `event.building.template.home.rest` |
| `home` | `leave` | `20` | `event.building.template.home.leave` |
| `leader_residence` | `review` | `21` | `event.building.template.house.leader_residence.review` |
| `leader_residence` | `leave` | `21` | `event.building.template.house.leader_residence.leave` |
| `temple` | `review` | `21` | `event.building.template.house.temple.review` |
| `temple` | `work` | `21` | `event.building.template.house.temple.work` |
| `temple` | `donate` | `21` | `event.building.template.house.temple.donate` |
| `temple` | `leave` | `21` | `event.building.template.house.temple.leave` |
| `keep` | `review` | `21` | `event.building.template.house.keep.review` |
| `keep` | `work` | `21` | `event.building.template.house.keep.work` |
| `keep` | `leave` | `21` | `event.building.template.house.keep.leave` |
| `tea_house` | `talk` | `21` | `event.building.template.house.tea_house.talk` |
| `tea_house` | `intel` | `21` | `event.building.template.house.tea_house.intel` |
| `tea_house` | `tea` | `21` | `event.building.template.house.tea_house.tea` |
| `tea_house` | `leave` | `21` | `event.building.template.house.tea_house.leave` |
| `market` | `talk` | `21` | `event.building.template.house.market.talk` |
| `market` | `trade` | `21` | `event.building.template.house.market.trade` |
| `market` | `intel` | `21` | `event.building.template.house.market.intel` |
| `market` | `leave` | `21` | `event.building.template.house.market.leave` |
| `grain_shop` | `trade` | `21` | `event.building.template.house.grain_shop.trade` |
| `grain_shop` | `accounting` | `21` | `event.building.template.house.grain_shop.accounting` |
| `grain_shop` | `leave` | `21` | `event.building.template.house.grain_shop.leave` |
| `medicine_house` | `treatment` | `21` | `event.building.template.house.medicine_house.treatment` |
| `medicine_house` | `compounding` | `21` | `event.building.template.house.medicine_house.compounding` |
| `medicine_house` | `leave` | `21` | `event.building.template.house.medicine_house.leave` |
| `inn` | `talk` | `21` | `event.building.template.house.inn.talk` |
| `inn` | `drink` | `21` | `event.building.template.house.inn.drink` |
| `inn` | `gamble` | `21` | `event.building.template.house.inn.gamble` |
| `inn` | `work` | `21` | `event.building.template.house.inn.work` |
| `inn` | `leave` | `21` | `event.building.template.house.inn.leave` |

## Canonical Binding Families

| Source family | Item | Source copies | Canonical binding id |
| --- | --- | ---: | --- |
| `home` | `rest` | `20` | `binding.building.template.home.rest.container-item` |
| `home` | `leave` | `20` | `binding.building.template.home.leave.container-item` |
| `leader_residence` | `review` | `21` | `binding.building.template.house.leader_residence.review.container-item` |
| `leader_residence` | `leave` | `21` | `binding.building.template.house.leader_residence.leave.container-item` |
| `temple` | `review` | `21` | `binding.building.template.house.temple.review.container-item` |
| `temple` | `work` | `21` | `binding.building.template.house.temple.work.container-item` |
| `temple` | `donate` | `21` | `binding.building.template.house.temple.donate.container-item` |
| `temple` | `leave` | `21` | `binding.building.template.house.temple.leave.container-item` |
| `keep` | `review` | `21` | `binding.building.template.house.keep.review.container-item` |
| `keep` | `work` | `21` | `binding.building.template.house.keep.work.container-item` |
| `keep` | `leave` | `21` | `binding.building.template.house.keep.leave.container-item` |
| `tea_house` | `talk` | `21` | `binding.building.template.house.tea_house.talk.container-item` |
| `tea_house` | `intel` | `21` | `binding.building.template.house.tea_house.intel.container-item` |
| `tea_house` | `tea` | `21` | `binding.building.template.house.tea_house.tea.container-item` |
| `tea_house` | `leave` | `21` | `binding.building.template.house.tea_house.leave.container-item` |
| `market` | `talk` | `21` | `binding.building.template.house.market.talk.container-item` |
| `market` | `trade` | `21` | `binding.building.template.house.market.trade.container-item` |
| `market` | `intel` | `21` | `binding.building.template.house.market.intel.container-item` |
| `market` | `leave` | `21` | `binding.building.template.house.market.leave.container-item` |
| `grain_shop` | `trade` | `21` | `binding.building.template.house.grain_shop.trade.container-item` |
| `grain_shop` | `accounting` | `21` | `binding.building.template.house.grain_shop.accounting.container-item` |
| `grain_shop` | `leave` | `21` | `binding.building.template.house.grain_shop.leave.container-item` |
| `medicine_house` | `treatment` | `21` | `binding.building.template.house.medicine_house.treatment.container-item` |
| `medicine_house` | `compounding` | `21` | `binding.building.template.house.medicine_house.compounding.container-item` |
| `medicine_house` | `leave` | `21` | `binding.building.template.house.medicine_house.leave.container-item` |
| `inn` | `talk` | `21` | `binding.building.template.house.inn.talk.container-item` |
| `inn` | `drink` | `21` | `binding.building.template.house.inn.drink.container-item` |
| `inn` | `gamble` | `21` | `binding.building.template.house.inn.gamble.container-item` |
| `inn` | `work` | `21` | `binding.building.template.house.inn.work.container-item` |
| `inn` | `leave` | `21` | `binding.building.template.house.inn.leave.container-item` |

## Canonical Arrangement Groups

| Arrangement subgroup | Source copies | Canonical arrangement id |
| --- | ---: | --- |
| `home.standard` | `20` | `arrangement.template.home.standard` |
| `temple.standard` | `20` | `arrangement.template.house.temple.standard` |
| `keep.standard` | `20` | `arrangement.template.house.keep.standard` |
| `market.standard` | `20` | `arrangement.template.house.market.standard` |
| `grain_shop.standard` | `20` | `arrangement.template.house.grain_shop.standard` |
| `medicine_house.standard` | `20` | `arrangement.template.house.medicine_house.standard` |
| `tea_house.standard` | `19` | `arrangement.template.house.tea_house.standard` |
| `leader_residence.civil-cluster` | `7` | `arrangement.template.house.leader_residence.civil-cluster` |

## Preservation Exceptions

### Event / Binding Exceptions

- `binding.building.house.kulan.temple.work.container-item`
- `event.building.house.kulan.temple.work`
- `Reason: Kulan temple action menu no longer exposes itemId=work, so this pair cannot be folded into the standard temple work family until the host-side action menu and canonical reuse plan are reconciled together.`

### Arrangement Exceptions

- `arrangement.city.kulan.home_001`
- `Reason: no standard home.yingtian-style buildingId family; it remains isolated from the home.standard fold set.`

- `arrangement.city.kulan.house.kulan.temple`
- `arrangement.city.kulan.house.kulan.keep`
- `arrangement.city.kulan.house.kulan.market`
- `arrangement.city.kulan.house.kulan.grain_shop`
- `arrangement.city.kulan.house.kulan.medicine_house`
- `Reason: Kulan host content diverges from the current 20-city standard subgroup and must not be auto-folded.`

- `arrangement.city.kulan.house.kulan.tea_house`
- `arrangement.city.suzhou.house.suzhou.tea_house`
- `Reason: tea_house currently has one 19-city standard subgroup plus two outliers.`

- `arrangement.city.kulan.house.kulan.leader_residence`
- `arrangement.city.yingtian.house.yingtian.leader_residence`
- `arrangement.city.luzhou.house.luzhou.leader_residence`
- `arrangement.city.taiping.house.taiping.leader_residence`
- `arrangement.city.yangzhou.house.yangzhou.leader_residence`
- `arrangement.city.suzhou.house.suzhou.leader_residence`
- `arrangement.city.wuchang.house.wuchang.leader_residence`
- `arrangement.city.nanchang.house.nanchang.leader_residence`
- `arrangement.city.chengdu.house.chengdu.leader_residence`
- `arrangement.city.ningbo.house.ningbo.leader_residence`
- `arrangement.city.fuzhou.house.fuzhou.leader_residence`
- `arrangement.city.dadu.house.dadu.leader_residence`
- `arrangement.city.kaifeng.house.kaifeng.leader_residence`
- `arrangement.city.gongchang.house.gongchang.leader_residence`
- `Reason: only the 7-city civil-cluster shape is a strong-fold candidate; these 14 records stay isolated until explicit host-content review says otherwise.`

- `All 21 inn arrangements remain non-folded at the arrangement layer.`
- `Reason: current normalization finds no repeated arrangement shape inside the inn host family, even though its event and binding families are canonical-reuse candidates.`

## Rewrite Notes

- `Event and binding canonical ids are family-scope template ids. Task3 must rewrite source ids and all owned references to those new ids in one batch.`
- `Arrangement canonical ids do not replace runtime cityId + buildingId host selection. They define reusable template truth for the folded content subgroup; runtime host resolution still stays city-scoped.`
- `When a source record belongs to a preservation exception, task3 must skip folding it into the first canonical batch and keep the queue-local exception list synchronized.`

## Simulated Rewrite Audit Findings

- `The current first-batch audit covers 646 events, 633 building-container-item-action bindings, 189 arrangements, and 632 arrangement action-menu event refs.`
- `Coverage is intentionally partial rather than pretending the full pack folds now: 627 events and 627 container-item bindings map into the first canonical batch; 146 arrangements map into the approved strong-fold groups.`
- `The remaining action-menu-unmapped refs in this historical first-batch audit were five known out-of-batch items: Kulan temple copy-scripture / sweep-courtyard / carry-water plus home_001 rest / leave.`
- `Simulated canonical event-id rewrite creates 30 multi-binding collision groups, and all 30 are currently safe multiplex groups distinguished by owner/payload; duplicatePayloadConflictCount is 0.`
- `The recorded Kulan temple work exception still shows the expected drift shape: the preserved binding and event both still exist, but arrangement.city.kulan.house.kulan.temple no longer contains itemId=work.`
- `Owner/flow token preflight currently finds no mixed-action families inside the mapped batch: 21 canonical event families are pure launchFlow groups with template-derivable flowId + ownerId targets, and the remaining 9 canonical event families are pure closeBuilding groups with no follow-up flow token to rewrite.`
- `Coupled rewrite impact is now frozen as a concrete file set rather than an abstract warning: the current lawful source batch spans 3 scenario-pack data files, 5 consumer families covering export/import/active-content/building-runtime/story-playable-owner flow, and 1 guard family in tests/robustness.test.cjs.`
- `Source-rewrite preview tightens the first writeable slice further: all 30 event rewrite groups are still valid, but only 2 binding groups (home.rest / home.leave) currently have full arrangement payload alignment; 23 binding groups are partial because canonical event/binding reuse outruns arrangement exception coverage, and 5 inn binding groups remain fully unaligned at the arrangement layer.`
- `The first actual implementation slice is now frozen rather than inferred: home.rest and home.leave are the only lawful first-write groups because they are the only binding groups with full arrangement payload alignment and they also exercise both action shapes the queue cares about now: launchFlow and closeBuilding.`
- `Flow preflight now confirms that the launchFlow half of the home slice is structurally reusable too: the 20 home.rest flow definitions already collapse to one title family, one normalized initial-node shape, and one complete-node detail shape, so canonical flowId rewrite is no longer an un-audited hidden dependency for the first implementation slice.`
- `Historical addendum after queue closeout: home_001 rest / leave were later absorbed into the same canonical home graph during queue-closeout proof, while arrangement.city.kulan.home_001 itself remained a unique arrangement-level preservation exception rather than being folded into arrangement.template.home.standard.`
