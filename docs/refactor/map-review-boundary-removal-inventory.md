# Map Review Boundary Removal Inventory

## Scope

- version_id: `target.map-review-provider-boundary-extraction`
- queue_id: `queue.map-review-provider-boundary-extraction-and-acceptance`
- created_for_task: `task.map-review-provider-boundary-extraction-and-acceptance.consumer-cutover-and-inventory`
- status: `residue-removal-completed`

## Map Boundary

| Path | Current Classification | Step 2 Disposition | Step 3 Disposition |
| --- | --- | --- | --- |
| `src/ui/views/map/map-view.ts` | `primary map rendering consumer` | `Cut to MapLocationProvider for marker-ready city locations and map-node city id lookup.` | `Keep provider-backed path; guard against CityDefinition/cityCoordinatesById returning to map rendering.` |
| `src/ui/app-render.ts` | `render assembly seam` | `Cut map view model input to mapLocationProvider instead of cityCoordinatesById.` | `Review remaining cityDefinitions usage for modal-only city entry visual classification.` |
| `src/application/presenter/presenter-output.ts` | `stage contract` | `Map stage no longer carries CityDefinition[] for map rendering.` | `Keep map stage city-data-free.` |
| `src/application/presenter/stage-presenters.ts` | `stage selector` | `Map stage no longer forwards cityDefinitions.` | `Keep map stage city-data-free.` |
| `src/application/presenter/app-render-coordinator.ts` | `active content to UI adapter` | `Passes activeContentContext.mapLocationProvider to renderApp.` | `Keep as provider handoff seam.` |
| `src/application/content/active-game-content.ts` | `active content assembly` | `Creates and exposes mapLocationProvider from active pack city/map-node data.` | `Review whether cityCoordinatesById remains needed outside startup/map compatibility.` |
| `src/main.ts` `activeContentContext.cityCoordinatesById[profile.initialLocation.cityId]` | `startup coordinate fallback` | `Not changed in Step 2; not map rendering.` | `Replaced with mapLocationProvider.getCityLocation(profile.initialLocation.cityId), preserving explicit scenario profile coordinates as the first priority.` |

## Review Boundary

| Path | Current Classification | Step 2 Disposition | Step 3 Disposition |
| --- | --- | --- | --- |
| `src/application/review/review-cycle-provider.ts` | `new shared policy seam` | `Created ReviewCyclePolicy/defaultReviewCyclePolicy over existing review schedule helpers.` | `Keep as shared review lifecycle dependency interface.` |
| `src/application/runtime/navigation-time-follow-up.ts` | `runtime follow-up consumer` | `Cut review-date and priority-house-module lookups to defaultReviewCyclePolicy.` | `Keep policy-backed review lifecycle lookup; house-specific arrival copy remains local here until a separate presentation extraction exists.` |
| `src/application/runtime/council-priority-city-begging-coordinator.ts` | `runtime coordinator consumer` | `Cut timed-activity insufficiency lookup to defaultReviewCyclePolicy.` | `Keep policy-backed schedule lookup; house-specific refusal copy remains local presentation copy.` |
| `src/core/runtime/time-runtime.ts` | `core time threshold producer` | `Not changed in Step 2 to avoid widening core/application dependency churn.` | `Kept as low-level council-date primitive; core runtime emits the existing threshold outcome and does not own review presentation or house policy.` |
| `src/application/time/council-attendance.ts` | `review lateness primitive` | `Not changed in Step 2.` | `Kept as provider-adjacent primitive used by house-local late attendance presentation; caller-facing schedule/countdown/insufficient-time use is routed through ReviewCyclePolicy.` |
| `src/application/house-modules/home-house/home-house-house-module.ts` | `house-specific review presentation and rest flow` | `Not changed in Step 2; still direct review helper consumer.` | `Replaced lifecycle reads with defaultReviewCyclePolicy while preserving house presentation copy.` |
| `src/application/house-modules/keep-house/keep-house-house-module.ts` | `house-specific review presentation and assignment flow` | `Not changed in Step 2; still direct review helper consumer.` | `Replaced lifecycle reads/writes with defaultReviewCyclePolicy while preserving keep-house presentation copy.` |
| `src/application/house-modules/temple-house/temple-house-house-module.ts` | `house-specific review presentation and assignment flow` | `Not changed in Step 2; still direct review helper consumer.` | `Replaced lifecycle reads/writes with defaultReviewCyclePolicy while preserving temple-house presentation copy.` |
| `src/application/house-modules/grain-shop/grain-shop-house-module.ts` | `activity blocked-by-review consumer` | `Not changed in Step 2.` | `Replaced insufficient-days lookup with defaultReviewCyclePolicy.` |
| `src/application/house-modules/tea-house/tea-house-house-module.ts` | `activity blocked-by-review consumer` | `Not changed in Step 2.` | `Replaced insufficient-days lookup with defaultReviewCyclePolicy.` |
| `src/application/house-modules/tavern/tavern-house-module.ts` | `activity blocked-by-review consumer` | `Not changed in Step 2.` | `Replaced insufficient-days lookup with defaultReviewCyclePolicy.` |
| `src/application/house-modules/medicine-house/medicine-house-house-module.ts` | `activity blocked-by-review consumer` | `Not changed in Step 2.` | `Replaced insufficient-days lookup with defaultReviewCyclePolicy.` |
| `src/application/story/story-callbacks.ts` | `story-driven review schedule writer` | `Not changed in Step 2.` | `Replaced schedule writes with defaultReviewCyclePolicy.applySchedule.` |
| `src/application/story-battle/story-battle-runtime.ts` | `story-battle review schedule writer` | `Not changed in Step 2.` | `Replaced schedule writes with defaultReviewCyclePolicy.applySchedule.` |

## Guards To Add Or Preserve

- `map-view.ts` must not import `CityDefinition`, call `createMapCityMarkers`, or accept `cityCoordinatesById` as the marker assembly path.
- `AppPresenterStageOutput` map stage must remain city-data-free.
- `review-cycle-provider.ts` must not contain house-specific text ids such as `runtime.zhu_yuanzhang.*review*`.
- Step 3 cleanup must follow this inventory and must not remove house-specific presentation copy unless a later queue explicitly owns that extraction.
- `tests/robustness.test.cjs` guards that mapped house/story review consumers use defaultReviewCyclePolicy instead of direct council-priority/review-cycle imports.
- `tests/robustness.test.cjs` guards that startup coordinate fallback uses mapLocationProvider.getCityLocation instead of direct cityCoordinatesById indexing.
