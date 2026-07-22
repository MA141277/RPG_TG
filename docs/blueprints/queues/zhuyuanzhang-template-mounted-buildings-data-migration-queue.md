# Zhuyuanzhang Template Mounted Buildings Data Migration Queue

## Control Block

- queue_id: `queue.zhuyuanzhang-template-mounted-buildings-data-migration`
- belongs_to_version: `target.city-building-module-entry-and-project-startup-authoring`
- blueprint_version: `2026.07`
- queue_status: `done`
- queue_class: `corrective-content-migration`
- active_task: `none`
- next_effect: `return-to-version-review`
- closeout_status: `done`
- execution_closeout_status: `done`
- topic_closure_status: `closed`
- closure_basis: `The built-in Zhu Yuanzhang template pack now carries explicit cities[].mountedBuildings data, so Script Editor template import exposes Haizhou mounted buildings and NPC rows through the canonical authoring field without restoring runtime-family reverse inference.`
- residue_remaining: `no`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- sync_status: `success`
- sync_scope: `local-record`
- sync_summary: `Queue closed locally after focused import/export regressions passed; no commit or push attempted.`
- blocked_by: []

## Human Context

### Goal

- Migrate the built-in Zhu Yuanzhang scenario template data to the current canonical mounted-building/NPC authoring contract.
- Preserve the standard runtime-pack import rule that only explicit `cities[].mountedBuildings` becomes Script Editor mounted authoring truth.

### Scope

- `src/content/scenario-packs/zhuyuanzhang/cities.json`
- `tests/robustness.test.cjs`
- `docs/change-log.md`
- Blueprint progress records for this bounded queue.

### Done Evidence

- `city.kulan` / `濠州` now has explicit mounted rows for its existing `houseIds`.
- Each mounted row records the building id, NPC ids from the matching existing house `characterIds`, and the matching `defaultCharacterId` as `primaryNpcId` when present.
- The migration was applied across the built-in Zhu Yuanzhang cities so the template data shape is coherent rather than only patching the visible Haizhou symptom.
- Regression coverage now proves the published built-in template import exposes Haizhou mounted rows and that canonical mounted data may materialize additional runtime `cityEntries` on export.

### Boundaries

- This queue does not reintroduce reverse inference from `cityEntries`, `houses.characterIds`, or `cityNpcPools` in the standard Script Editor import path.
- This queue does not change EventBindingRuntime, LocationAccessRuntime, city/building module entry behavior, or broader scenario-pack compatibility policy.

### Verification

- `npm run build:test`
- `node --test tests/robustness.test.cjs --test-name-pattern "script editor imports built-in zhuyuanzhang template|script editor preserves imported Zhu Yuanzhang runtime families"`
