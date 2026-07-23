# Map Rendering, City Data Separation, And Canonical Numeric ID Transition Evidence Draft

## Document Control

- document_id: `evidence-draft.map-rendering-city-data-separation-and-canonical-numeric-id-transition`
- source_memo: `docs/blueprints/version-memo.md#memo-027-map-rendering-and-city-data-separation-with-canonical-numeric-id-transition-draft`
- proposed_version_id: `target.map-rendering-city-data-separation-and-canonical-numeric-id-transition`
- proposed_parent_spec_role: `parent-spec-evidence-draft`
- evidence_draft_status: `promoted-to-formal-target`
- created_at: `2026-07-22`
- scheduling_effect: `none`
- active_queue_created: `yes`
- implementation_authorized: `yes`
- formal_target_spec: `docs/blueprints/specs/2026-07-22-map-rendering-city-data-separation-and-canonical-numeric-id-transition-target.md`
- formal_target_plan: `docs/blueprints/plans/2026-07-22-map-rendering-city-data-separation-and-canonical-numeric-id-transition-target-plan.md`

## Governance Classification

- affected mechanics or contracts:
  - `city-owned map placement and map-facing city metadata`
  - `campaign-map rendering and city-click interaction boundary`
  - `script editor city authoring and runtime-pack import/export`
  - `canonical numeric id generation for new Script Editor records`
  - `id-consumer direct-lookup audit and transition cleanup`
- task classification:
  - `shared authoring/runtime contract change`
- contract level:
  - `shared-contract`
- governing references:
  - `docs/blueprints/classification-rule-layer-spec.md`
  - `docs/blueprints/blueprint-workflow-spec.md`

## Version Draft Summary

### Goal

- `Move map-facing city rendering truth into cities, keep map limited to rendering plus interaction trigger, preserve one lawful city-click -> access-check -> continuation chain, and adopt canonical numeric ids for new Script Editor-authored records without bulk-rewriting existing content ids.`

### Required Outcomes

- `City-owned authored data becomes the canonical source for map marker position, map label, and map-facing summary.`
- `MapDefinition.nodes no longer acts as the canonical owner for city marker coordinates, city marker labels, or city summary text.`
- `The campaign-map renderer consumes provider-backed city markers built from city-owned data and leaves maps responsible only for visual layers, non-city points, and click surfaces.`
- `Script Editor runtime export/import and active runtime content all preserve the same city-owned map placement contract.`
- `The built-in zhuyuanzhang pack and other active startup/content paths carry explicit city-owned map placement data instead of depending on hidden map-owned coordinates.`
- `New Script Editor-authored records use canonical numeric ids allocated by family-high-digits plus per-family sequence-low-digits.`
- `Existing ids remain unchanged during this transition stage, including existing built-in pack ids.`
- `New id generation uses current family max sequence + 1 and never reuses deleted ids or derives ids from current array length.`
- `Known id-consumer routes are audited, direct-lookup-safe paths are preserved, and any remaining indirect assumptions are removed or recorded in a running refactor log.`

### Explicit Non-Goals

- `Do not bulk-rewrite existing built-in content ids in this version.`
- `Do not keep long-term dual truth where map nodes remain the canonical city-coordinate owner after city-owned placement lands.`
- `Do not make map rendering own access checks, business routing, or building/dialogue dispatch.`
- `Do not treat content-only or documentation-only id strings as live runtime blockers when no active consumer depends on their shape.`
- `Do not reintroduce building-specific business branches in src/main.ts.`

### Must Preserve

- `City click handling still flows through location access and then into the lawful continuation path.`
- `Normal start, JSON runtime pack import, and Script Editor runtime preview still converge on the same runtime map/city truth.`
- `Existing authored ids and built-in pack ids remain stable for already-existing records.`
- `Map layers, non-city nodes, and historical city roster lookup still render correctly.`

### Must Replace

- `map-owned city marker coordinates as the canonical rendering truth`
- `map-owned city marker labels and summaries when a city record exists`
- `count-based new-record ids such as city.new.1 or event.new.1 on Script Editor add-record paths`
- `implicit string-shape dependency as a lawful requirement for new id consumption`

## Draft Requirement Coverage

| Draft Requirement | Proposed Acceptance IDs | Coverage Status |
| --- | --- | --- |
| `city-owned map placement and map-facing metadata` | `ACC-MAP-ID-001` | `mapped` |
| `map rendering and click boundary consumes provider-backed city data` | `ACC-MAP-ID-002` | `mapped` |
| `runtime/export/import/startup convergence for city-owned map placement` | `ACC-MAP-ID-003` | `mapped` |
| `canonical numeric id generation for new Script Editor records` | `ACC-MAP-ID-004` | `mapped` |
| `direct-lookup consumer audit and transition cleanup with running refactor log` | `ACC-MAP-ID-005` | `mapped` |
| `active pack migration and acceptance proof` | `ACC-MAP-ID-006` | `mapped` |

## Proposed Queue Contract Portfolio

| Queue ID | Class | Contract Role | Admission Rule |
| --- | --- | --- | --- |
| `queue.map-rendering-city-data-separation-and-canonical-numeric-id-transition` | `required` | `Own the full MEMO-027 execution boundary because city-owned map truth, runtime/export/import convergence, id-generation rules, consumer-route cleanup, and pack migration form one inseparable replacement chain.` | `Admit immediately because the operator explicitly requested this exact queue as the first and only lawful active queue under a new successor version.` |

## Acceptance Matrix Draft

| Acceptance ID | Requirement | Primary Owner Queue | Proof Type | Expected Implementation Anchor | Closeout Blocker |
| --- | --- | --- | --- | --- | --- |
| `ACC-MAP-ID-001` | `Cities own canonical map placement plus map-facing label/summary metadata, and runtime city markers no longer need map nodes as the primary source of those values.` | `queue.map-rendering-city-data-separation-and-canonical-numeric-id-transition` | `unit tests + source review` | `src/domain/city.ts; src/domain/script-editor-project.ts; src/application/script-editor/city-building-authoring.ts; src/application/script-editor/city-building-runtime-materializer.ts` | `Map nodes still remain the canonical owner for city x/y or city-facing label/summary when a city record exists.` |
| `ACC-MAP-ID-002` | `Map rendering consumes provider-backed city markers derived from city-owned data, while maps remain limited to rendering layers, non-city nodes, and interaction trigger surfaces.` | `queue.map-rendering-city-data-separation-and-canonical-numeric-id-transition` | `runtime tests + source review` | `src/application/map/**; src/ui/views/map/map-view.ts; src/ui/app-render.ts; src/main.ts` | `Map view still reconstructs city markers from map-owned city nodes or bypasses provider-backed city truth.` |
| `ACC-MAP-ID-003` | `Normal start, JSON runtime pack import, Script Editor project import/export, and runtime preview all preserve the same city-owned map placement contract.` | `queue.map-rendering-city-data-separation-and-canonical-numeric-id-transition` | `round-trip tests + startup/runtime tests` | `src/application/content/active-game-content.ts; src/application/script-editor/runtime-pack-export.ts; src/application/script-editor/runtime-pack-import.ts; src/application/scenario/scenario-pack-loader.ts; tests/**` | `Editor/runtime/export/import diverge on map placement truth or require map-owned coordinate fallback as canonical behavior.` |
| `ACC-MAP-ID-004` | `New Script Editor-authored top-level records use canonical numeric ids by family-segmented allocation, preserve existing ids, increment from family max, and never reuse deleted ids.` | `queue.map-rendering-city-data-separation-and-canonical-numeric-id-transition` | `unit tests + source review` | `src/application/script-editor/**; src/domain/script-editor-project.ts; tests/**` | `New ids still depend on array length, legacy string prefixes, or deleted-slot reuse.` |
| `ACC-MAP-ID-005` | `Known id-consumer routes are audited for direct vs indirect lookup, indirect live assumptions are removed where this queue owns them, and a running refactor log records remaining merge-sensitive surfaces.` | `queue.map-rendering-city-data-separation-and-canonical-numeric-id-transition` | `source audit + refactor log + targeted tests` | `src/application/script-editor/**; src/application/content/**; src/application/map/**; docs/blueprints/specs/2026-07-22-map-rendering-city-data-separation-and-canonical-numeric-id-transition-refactor-log.md` | `New numeric ids land while live consumers still require old string-shape semantics and no explicit routing/log exists.` |
| `ACC-MAP-ID-006` | `Active built-in content and startup paths are synchronized onto the new map placement contract, and acceptance proves map entry plus import/export behavior without regressions.` | `queue.map-rendering-city-data-separation-and-canonical-numeric-id-transition` | `pack migration tests + browser/source acceptance` | `src/content/scenario-packs/zhuyuanzhang/**; src/content/prototype-world.ts; tests/**` | `Active built-in content still depends on hidden map-owned city placement truth or acceptance covers only source edits without runnable proof.` |

## Implementation Anchors

### Current Map Truth Anchors

- `src/application/content/active-game-content.ts`
  - currently derives `cityCoordinatesById` from `city.mapNodeId -> mapNodesById`.
- `src/application/map/map-city-marker-view-model.ts`
  - currently builds marker coordinates from a separate coordinates table rather than city-owned authored placement.
- `src/application/map/map-location-provider.ts`
  - currently indexes `cityIdByMapNodeId` from `city.mapNodeId` only.
- `src/ui/views/map/map-view.ts`
  - currently builds campaign markers from `mapDefinition.nodes` and only secondarily resolves city ids.

### Current Script Editor / Runtime Pack Anchors

- `src/domain/script-editor-project.ts`
  - currently records `mapNodeId` but has no first-class city-owned map placement structure.
- `src/application/script-editor/city-building-authoring.ts`
  - currently normalizes city records without city-owned map placement.
- `src/application/script-editor/city-building-runtime-materializer.ts`
  - currently exports runtime cities with `mapNodeId` fallback and no explicit city-owned placement contract.
- `src/application/script-editor/runtime-pack-import.ts`
  - currently imports cities without extracting city-owned map placement from map data.
- `src/application/script-editor/runtime-pack-export.ts`
  - currently passes project maps/cities through without a city-owned placement-focused audit.

### Current ID Generation Anchors

- `src/application/script-editor/minimal-workflow.ts`
  - currently creates new workflow records with `*.new.N` ids or similar count-based strings.
- `src/application/script-editor/person-authoring.ts`
  - currently exposes `person.new.N` defaults.
- `src/application/script-editor/city-building-authoring.ts`
  - currently exposes `city.new.N`, `building.new.N`, and count-based building-arrangement ids.
- `src/application/script-editor/flow-authoring.ts`
  - currently exposes `flow.new.N`.
- `src/application/script-editor/story-dialogue-event-authoring.ts`
  - currently exposes `dialogue.new.N`, `event.new.N`, `story-node.new.N`, and `event-binding.new.N`.

## Legacy Paths To Replace

- `city.mapNodeId -> map.nodes -> x/y as the only city marker coordinate chain`
- `map node label/summary as the canonical city-facing display source when a city record exists`
- `count-derived Script Editor ids on add-record paths`
- `string-prefix assumptions as a requirement for newly created ids`

## Compatibility Paths To Preserve

- `Existing ids remain stable for already-existing records and built-in packs.`
- `Map nodes still render non-city markers, layers, and interaction surfaces.`
- `Historical city roster lookup may still use stable node ids where that is the current non-business contract.`
- `Normal start, JSON runtime pack import, and Script Editor runtime preview still share one lawful city-click continuation path.`

## Candidate Queue Evidence Matrix

| Queue ID | Source Docs | Acceptance Refs | Implementation Anchors | Legacy Paths To Replace | Compatibility Paths To Preserve | Reject Or Split If |
| --- | --- | --- | --- | --- | --- | --- |
| `queue.map-rendering-city-data-separation-and-canonical-numeric-id-transition` | `MEMO-027; this evidence draft` | `ACC-MAP-ID-001; ACC-MAP-ID-002; ACC-MAP-ID-003; ACC-MAP-ID-004; ACC-MAP-ID-005; ACC-MAP-ID-006` | `src/application/content/active-game-content.ts; src/application/map/**; src/application/script-editor/**; src/domain/script-editor-project.ts; src/content/scenario-packs/zhuyuanzhang/**; tests/**` | `map-owned city marker coordinates/labels/summaries; count-based new-record ids; live indirect id-shape assumptions` | `existing ids, runtime startup/import/preview parity, map non-city rendering, lawful city-click continuation` | `The queue tries to turn existing-id preservation into full bulk rewrite, or claims completion while city marker truth still lives primarily in map nodes.` |

## Split Completeness Review

### Covered Parent Capabilities

- `City-owned map placement ownership is owned by the admitted queue.`
- `Map rendering and click-boundary cleanup is owned by the admitted queue.`
- `Runtime/export/import/startup convergence is owned by the admitted queue.`
- `Canonical numeric id generation and consumer-route cleanup is owned by the admitted queue.`
- `Refactor log maintenance and pack migration acceptance are owned by the admitted queue.`

### Parent Capabilities Not Yet Owned

- `None intentionally unowned in this version.`

### Over-Narrowing Risks

- `Map provider could still hide map-owned city coordinates behind a helper while claiming city-owned truth.`
- `Numeric id allocation could be added only in one family while other add-record paths keep count-based ids.`
- `Built-in pack migration could land only in JSON files while runtime preview/import paths still depend on old fallback logic.`
- `The queue could claim direct-lookup safety without documenting remaining merge-sensitive or indirect-consumer surfaces.`

### Required Follow-Up Before Formal Spec

- `Formal target docs now exist and immediate admission is explicitly requested by the operator.`

## First Queue Recommendation

- queue_id: `queue.map-rendering-city-data-separation-and-canonical-numeric-id-transition`
- basis:
  - `The operator explicitly requested this exact queue to become the only lawful active queue under a new version.`
  - `MEMO-027 does not split cleanly into smaller queues without creating false partial completion on the replacement chain.`

## High-Risk Drift Points

- `Map nodes still carry city-looking label/summary data; city-owned truth must replace that as the displayed city source without deleting non-city node support.`
- `Existing ids are pervasive across built-in content and tests; the version must preserve them while changing only new id allocation and live consumer assumptions.`
- `Building-arrangement and event authoring helpers still use count-based string ids; the queue must not leave those as silent exceptions.`
- `The refactor log must remain current because map-related work is merge-sensitive across content, runtime, and Script Editor files.`

## Operator Review Checklist

Review only these decisions before or during execution:

1. `Is target.map-rendering-city-data-separation-and-canonical-numeric-id-transition the right parent boundary for MEMO-027?`
2. `Should queue.map-rendering-city-data-separation-and-canonical-numeric-id-transition remain the single admitted execution queue rather than splitting the memo into thinner partial queues?`
3. `Does the acceptance matrix sufficiently prevent false completion on city-owned map truth or numeric-id transition drift?`
