# Map Rendering, City Data Separation, And Canonical Numeric ID Transition

## Control Block

- version_id: `target.map-rendering-city-data-separation-and-canonical-numeric-id-transition`
- version_label: `map-rendering-city-data-separation-and-canonical-numeric-id-transition`
- closeout_contract_version: `v1`

## Human Context

### Goal

- `Move map-facing city rendering truth into cities, keep the map layer limited to rendering plus interaction trigger, and adopt canonical numeric ids for new Script Editor-authored records without bulk-rewriting existing ids.`

### Version Draft Summary

- Goal:
  - `Land the full MEMO-027 replacement chain under one version so city-owned map placement, runtime/export/import convergence, numeric-id generation, consumer-route cleanup, and pack migration cannot be falsely closed in isolation.`
- Required outcomes:
  - `City-owned map placement and map-facing metadata become canonical.`
  - `Map rendering consumes provider-backed city truth and no longer treats map nodes as the canonical city marker owner.`
  - `New Script Editor-authored top-level records use family-segmented canonical numeric ids while existing ids remain unchanged.`
  - `A running refactor log records direct-lookup convergence, remaining indirect assumptions, and merge-sensitive surfaces.`
- Explicit non-goals:
  - `No bulk rewrite of existing built-in ids in this version.`
  - `No long-term dual ownership where maps still canonically own city coordinates or id-shape compatibility remains an active requirement.`
- Must preserve:
  - `Normal start, JSON runtime pack import, Script Editor runtime preview, non-city map rendering, and lawful city-click access routing.`
- Must replace:
  - `map-owned city marker coordinate truth, map-owned city label/summary truth when a city record exists, and count-based new-record ids on Script Editor add-record paths.`
- Reference material:
  - `docs/blueprints/version-memo.md#memo-027-map-rendering-and-city-data-separation-with-canonical-numeric-id-transition-draft`
  - `docs/blueprints/specs/2026-07-22-map-rendering-city-data-separation-and-canonical-numeric-id-transition-evidence-draft.md`

### Evidence Draft Review

- evidence_draft_status: `reviewed`
- reviewed_by_operator: `yes`
- review_summary:
  - `The operator explicitly requested promoting MEMO-027 into a new successor version, admitting queue.map-rendering-city-data-separation-and-canonical-numeric-id-transition immediately as the only active queue, and continuing implementation without reactivating older open versions.`

### Draft Requirement Coverage

| Draft Requirement | Acceptance IDs | Status |
| --- | --- | --- |
| `City-owned map placement and map-facing metadata` | `ACC-MAP-ID-001` | `covered` |
| `Provider-backed map rendering and click boundary cleanup` | `ACC-MAP-ID-002` | `covered` |
| `Runtime/export/import/startup convergence for city-owned map placement` | `ACC-MAP-ID-003` | `covered` |
| `Canonical numeric id generation for new Script Editor records` | `ACC-MAP-ID-004` | `covered` |
| `Direct-vs-indirect id-consumer audit plus running refactor log` | `ACC-MAP-ID-005` | `covered` |
| `Built-in pack migration and acceptance proof` | `ACC-MAP-ID-006` | `covered` |

### Scope

- `City-owned map placement, map label, and map-facing summary/marker metadata.`
- `Provider-backed campaign map city markers and city click resolution boundary.`
- `Script Editor runtime import/export/materialization for city-owned map placement.`
- `Canonical numeric id generation for new top-level Script Editor-authored records and directly related top-level arrangement/event-binding records.`
- `Running refactor log plus active built-in content migration needed for this replacement chain.`

### Non-Goals

- `Full repository-wide numeric id rewrite of existing packs or historical content.`
- `Unrelated map provider modularization or review-flow work outside MEMO-027.`

### Queue Contract Portfolio

| Queue ID | Class | Contract Role | Admission Rule |
| --- | --- | --- | --- |
| `queue.map-rendering-city-data-separation-and-canonical-numeric-id-transition` | `required` | `Own the complete MEMO-027 implementation, migration, audit, and acceptance chain.` | `Admitted immediately on operator instruction as the only lawful active queue under this version.` |

### Acceptance Matrix

| Acceptance ID | Requirement | Primary Owner Queue | Proof Type | Expected Implementation Anchor | Closeout Blocker |
| --- | --- | --- | --- | --- | --- |
| `ACC-MAP-ID-001` | `Cities own canonical map placement plus map-facing label/summary metadata.` | `queue.map-rendering-city-data-separation-and-canonical-numeric-id-transition` | `unit | integration` | `src/domain/city.ts; src/domain/script-editor-project.ts; src/application/script-editor/city-building-authoring.ts; src/application/script-editor/city-building-runtime-materializer.ts` | `City marker truth still canonically lives in map nodes.` |
| `ACC-MAP-ID-002` | `Map rendering consumes provider-backed city markers and keeps maps limited to rendering layers, non-city nodes, and interaction trigger surfaces.` | `queue.map-rendering-city-data-separation-and-canonical-numeric-id-transition` | `integration | source-removal` | `src/application/map/**; src/ui/views/map/map-view.ts; src/ui/app-render.ts; src/main.ts` | `Map view still reconstructs city markers from map-owned city truth.` |
| `ACC-MAP-ID-003` | `Runtime/export/import/startup/preview all preserve the same city-owned map placement contract.` | `queue.map-rendering-city-data-separation-and-canonical-numeric-id-transition` | `integration` | `src/application/content/active-game-content.ts; src/application/script-editor/runtime-pack-export.ts; src/application/script-editor/runtime-pack-import.ts; src/application/scenario/scenario-pack-loader.ts; tests/**` | `Any one entry path still depends on map-owned city placement as canonical truth.` |
| `ACC-MAP-ID-004` | `New Script Editor-authored records use canonical numeric ids by family-segmented max+1 allocation, with no deleted-id reuse and no count-based generation.` | `queue.map-rendering-city-data-separation-and-canonical-numeric-id-transition` | `unit | source-removal` | `src/application/script-editor/**; tests/**` | `Any active add-record path still emits count-based ids or depends on old string prefixes.` |
| `ACC-MAP-ID-005` | `Direct vs indirect id-consumer audit is recorded, owned indirect assumptions are removed, and the running refactor log stays synchronized.` | `queue.map-rendering-city-data-separation-and-canonical-numeric-id-transition` | `coverage-review | source-removal` | `docs/blueprints/specs/2026-07-22-map-rendering-city-data-separation-and-canonical-numeric-id-transition-refactor-log.md; src/application/**` | `Numeric ids land without audit-backed consumer cleanup or current refactor-log truth.` |
| `ACC-MAP-ID-006` | `Active built-in content and startup paths migrate onto city-owned map placement with runnable acceptance proof.` | `queue.map-rendering-city-data-separation-and-canonical-numeric-id-transition` | `integration | coverage-review` | `src/content/scenario-packs/zhuyuanzhang/**; src/content/prototype-world.ts; tests/**` | `Built-in content still relies on map-owned city placement truth or acceptance is source-only.` |

### Acceptance Criteria

- `City records, not map nodes, own the canonical city marker x/y and city-facing marker text used by the map renderer.`
- `MapLocationProvider and map view consume city-owned marker data through one provider-backed path.`
- `MapDefinition.nodes may still render non-city points, but city markers no longer rely on node-owned city coordinates or node-owned city-facing text.`
- `Runtime pack export/import/startup/preview keep the same city-owned map placement structure.`
- `New Script Editor add-record flows allocate canonical numeric ids from family max+1 without reusing deleted ids.`
- `Existing ids remain unchanged for already-existing records.`
- `The refactor log records changed structures, old/new truth owners, updated consumer routes, remaining blockers, and merge-sensitive files.`
- `Verification proves map entry behavior, provider-backed rendering, import/export parity, and numeric-id allocation behavior.`

### Final Acceptance Coverage Contract

- `Final validation must review the Acceptance Matrix rather than only one map happy path.`
- `Every required acceptance must be covered, blocked, or explicitly accepted as non-blocking residue before version closeout.`
- `This version has one execution queue, so that queue owns implementation plus bounded acceptance evidence; version closeout still remains version-plan authority.`

### Version Closeout Contract

- `Version may become done only after acceptance passes, no active queue/task remains, residue is dispositioned, and the version plan records explicit closeout.`
- `As long as the version remains open and no active queue exists, a new queue may still be admitted only if future evidence proves a same-version lawful residue path.`
- `Open-version status is not inferred away by queue completion; the version remains open until explicit human closeout confirmation is recorded in the version plan.`
- `If no open version exists, a new version must be explicitly created before queue admission or implementation resumes.`

### Archived Interpretation

- `Historical interpretation is deferred until version closeout.`
