# Map Rendering, City Data Separation, And Canonical Numeric ID Transition Refactor Log

## Document Control

- document_id: `refactor-log.map-rendering-city-data-separation-and-canonical-numeric-id-transition`
- related_version: `target.map-rendering-city-data-separation-and-canonical-numeric-id-transition`
- related_queue: `queue.map-rendering-city-data-separation-and-canonical-numeric-id-transition`
- created_at: `2026-07-22`
- purpose: `active-merge-reference`

## Replacement Inventory

| Area | Old Truth Owner / Route | New Truth Owner / Route | Affected Files | Consumer Status | Deletion Readiness | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `city marker coordinates` | `city.mapNodeId -> map.nodes[x,y]` | `city.mapPlacement[x,y] -> mapLocationProvider` | `src/application/content/active-game-content.ts; src/application/map/**; src/ui/views/map/map-view.ts; src/content/prototype-world.ts` | `cutover-landed` | `acceptance-covered` | `Primary runtime marker coordinates now flow through city.mapPlacement. Remaining node-id usage is limited to explicit association seams such as roster matching and non-city-node suppression, and the visible in-app browser acceptance run reached campaign map -> 濠州 -> city menu without needing node-owned coordinate fallback.` |
| `city marker label / summary` | `map node label/summary` | `city-owned map-facing metadata` | `src/domain/city.ts; src/application/map/**; src/ui/views/map/map-view.ts; src/content/scenario-packs/**` | `cutover-landed` | `acceptance-covered` | `City marker name/summary now resolve from placement-owned data; non-city map nodes intentionally keep node-owned labels because they are still map-owned markers.` |
| `new Script Editor ids` | `family.new.N or count-based strings` | `family-segmented canonical numeric ids` | `src/application/script-editor/**; src/ui/main-ui/main-ui-flow.js` | `top-level-draft-cutover-landed` | `acceptance-covered` | `Top-level add-record paths now allocate canonical numeric ids and tests lock max+1/no-reuse semantics. Legacy helper number-callers remain only as bounded fallback creation paths, not as active add-record truth.` |
| `id-consumer assumptions` | `mixed direct lookup and historical string-shape expectations` | `direct full-id lookup for new numeric ids` | `src/application/script-editor/**; src/application/content/**; tests/**` | `owned-audit-landed` | `acceptance-covered` | `Owned source guards and draft-creation checks no longer require legacy event-tab or family.new.N truth. Queue-closeout acceptance is now complete, so no remaining owned string-shape consumer rewrite is required for this version boundary.` |

## Direct Lookup Convergence

- `minimal-workflow draft creation now allocates by family max+1 when given a full project, so top-level add-record flows no longer depend on collection length as the canonical id source.`
- `Default record creators in people/portraits/portraitVariants/cities/buildings/dialogues/minigames/flows/storyNodes/events/eventBindings now accept explicit string ids so direct full-id allocation can bypass legacy suffix-shape assumptions.`
- `appendScriptEditorBuildingArrangement(...)` now allocates canonical numeric arrangement ids from the project-level family inventory instead of count-based suffixes.`
- `Targeted regressions now lock that canonical numeric top-level draft ids do not reuse deleted slots and remain segmented by family code across people/textEntries/eventBindings.`

## Indirect Lookup / Merge-Sensitive Surfaces

- `src/application/script-editor/minimal-workflow.ts`
- `src/application/script-editor/city-building-authoring.ts`
- `src/application/script-editor/story-dialogue-event-authoring.ts`
- `src/application/script-editor/flow-authoring.ts`
- `src/ui/main-ui/main-ui-flow.js`
- `src/application/content/active-game-content.ts`
- `src/application/map/map-location-provider.ts`
- `src/ui/views/map/map-view.ts`
- `src/ui/app-render.ts`
- `src/content/prototype-world.ts`
- `src/content/scenario-packs/zhuyuanzhang/**`

## Progress Notes

- `2026-07-22`: `Log created at queue admission. Update this file in the same batch as every city-map-truth replacement or numeric-id consumer cleanup change.`
- `2026-07-22`: `City-owned mapPlacement contracts landed in runtime marker generation, Script Editor runtime materialization/import fallback, built-in pack city data, sample scenario data, and prototype startup content. Queue truth now treats map nodes as non-city render layers plus optional association ids, not the primary owner of city marker coordinates/text.`
- `2026-07-22`: `Canonical numeric-id allocation landed for top-level Script Editor add-record flows and building-arrangement creation through the shared script-editor-id-allocation helper. Remaining work is now concentrated in residual consumer cleanup, refactor-log completion, and regression repair rather than first adoption.`
- `2026-07-22`: `Follow-up cutover removed city marker fallback from top-level city.mapNodeId inside marker view-model generation and removed app-render settlement/city visual fallback through mapDefinition.nodes. Current residual node-id usage is limited to explicit association/suppression seams that are still in-scope for acceptance proof.`
- `2026-07-22`: `Acceptance accounting was corrected: prior system-browser/background automation exploration is excluded from simulated-human/browser-interaction proof. ACC-MAP-ID-006 remains blocked until the required visible Codex built-in in-app browser path is available for truthful observed interaction.`
- `2026-07-23`: `Visible Codex built-in in-app browser pointer-level control is now confirmed. A visible mouse/keyboard/scroll handshake ran first, then normal start, built-in JSON runtime-pack import, and Script Editor runtime preview each rendered the campaign map, clicked 濠州, accepted the city-enter continuation prompt, and entered the city function menu. ACC-MAP-ID-006 is now covered without counting any hidden/background automation artifact.`
