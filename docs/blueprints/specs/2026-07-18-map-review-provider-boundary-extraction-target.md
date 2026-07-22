# Map Review Provider Boundary Extraction Target

## Control Block

- version_id: `target.map-review-provider-boundary-extraction`
- version_label: `Map and in-game review provider boundary extraction`
- closeout_contract_version: `v1`

## Human Context

### Goal

- `Extract map location data and in-game review / council lifecycle dependencies behind provider-backed module interfaces so map and review can be reused through normal start, JSON runtime pack import, and Script Editor runtime preview without Zhu Yuanzhang-only or main.ts-owned direct coupling.`

### Version Draft Summary

- Goal:
  - `Move city coordinates, city marker information, and review lifecycle dependency lookup out of rendering and host-local direct paths, then verify the resulting modules stay complete across all supported game entrypoints.`
- Required outcomes:
  - `Map rendering consumes provider-backed markers rather than CityDefinition plus cityCoordinatesById directly.`
  - `City coordinates and city information are assembled by a map-location provider or adapter.`
  - `Review lifecycle truth is consumed through shared review provider/policy seams instead of being re-owned by house-local branches.`
  - `A removal inventory records old direct paths before cleanup begins.`
  - `Acceptance proves behavior is not over-narrowed to a minimal happy path.`
- Explicit non-goals:
  - `Do not merge map and review into one runtime mechanism.`
  - `Do not move house-specific review copy into the shared review module.`
  - `Do not invent a new gameplay loop while extracting boundaries.`
  - `Do not make main.ts regain map or review business ownership.`
  - `Do not change EventBindingRuntime semantics.`

### Queue Contract Portfolio

| Queue ID | Class | Contract Role | Admission Rule |
| --- | --- | --- | --- |
| `queue.map-review-provider-boundary-extraction-and-acceptance` | `required` | `provider boundary extraction plus acceptance guard` | `Admit first because it owns the complete four-step boundary extraction, migration, removal inventory, cleanup, and acceptance proof requested by the operator.` |

### Acceptance Matrix

| Acceptance ID | Requirement | Primary Owner Queue | Proof Type | Expected Implementation Anchor | Closeout Blocker |
| --- | --- | --- | --- | --- | --- |
| `ACC-MAP-REVIEW-PROVIDER-001` | `Map rendering consumes provider-backed location markers and does not directly own city domain data assembly.` | `queue.map-review-provider-boundary-extraction-and-acceptance` | `unit + source guard` | `src/ui/views/map/map-view.ts; src/application/map/**; src/application/content/active-game-content.ts` | `map-view still requires CityDefinition plus cityCoordinatesById as its primary marker data path.` |
| `ACC-MAP-REVIEW-PROVIDER-002` | `Review lifecycle truth is consumed through shared provider/policy seams while house modules stay presentation consumers.` | `queue.map-review-provider-boundary-extraction-and-acceptance` | `unit + source guard` | `src/application/review/**; src/application/time/**; src/application/runtime/navigation-time-follow-up.ts; src/application/house-modules/**` | `house modules or runtime follow-up still own duplicated review lifecycle truth after cutover.` |
| `ACC-MAP-REVIEW-PROVIDER-003` | `Step 2 writes a removal inventory and Step 3 cleanup follows that inventory instead of expanding ad hoc.` | `queue.map-review-provider-boundary-extraction-and-acceptance` | `doc + source guard` | `docs/refactor/map-review-boundary-removal-inventory.md` | `cleanup begins without an inventory or removes paths not listed there.` |
| `ACC-MAP-REVIEW-PROVIDER-004` | `Simulated human flow proves map marker visibility, city information, city entry, review due flow, review completion, and next-cycle update.` | `queue.map-review-provider-boundary-extraction-and-acceptance` | `automated flow + browser/manual where practical` | `tests/**; runtime entrypoints` | `only source-string tests exist for the user-visible map/review flow.` |
| `ACC-MAP-REVIEW-PROVIDER-005` | `Normal start, JSON runtime pack import, and Script Editor runtime preview all use the provider-backed map/review contracts without over-narrowing behavior.` | `queue.map-review-provider-boundary-extraction-and-acceptance` | `entrypoint tests + completeness review` | `startup/load/runtime-preview paths` | `one entrypoint works only through special-case or default-pack-only logic.` |

### Acceptance Criteria

- `The map and review boundary work closes only after all acceptance ids are covered, blocked, or explicitly waived with reason.`
- `Unsupported entrypoints or data sources may be waived only if recorded; they cannot be counted as success.`
- `A Zhu Yuanzhang-only path is not sufficient evidence of provider-backed support.`
- `Final validation must run npm run typecheck, npm run lint:blueprints, and npm test.`
