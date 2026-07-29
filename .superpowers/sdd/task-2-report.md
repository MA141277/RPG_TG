# Task 2 Report: Renderer Coordinate Service

## Status

DONE

## Scope

Implemented the Task 2 renderer coordinate-service seam so loaded runtime-grid extent comes from `coordinateSystem.hexPointBounds` instead of `hexTerrainScale` compensation.

Changed files:

- `.superpowers/sdd/task-2-brief.md`
- `tests/robustness.test.cjs`
- `src/ui/views/map/campaign-terrain-webgl.ts`
- `.superpowers/sdd/task-2-report.md`

Did not change:

- `src/ui/views/map/shaders/campaign-terrain.frag.glsl`
- Task 1 runtime export/data files
- broad default conversion cleanup reserved for Task 3

## TDD Evidence

Red:

```bash
node --test --test-name-pattern "campaign terrain renderer uses loaded hex point bounds" tests\robustness.test.cjs
```

Result: failed as expected because `campaign-terrain-webgl.ts` did not yet contain `getCampaignHexPointBounds()` / `createCampaignTerrainCoordinateSystem()`.

Green:

```bash
node --test --test-name-pattern "campaign terrain renderer uses loaded hex point bounds" tests\robustness.test.cjs
npm run typecheck --silent
```

Result: both commands passed.

## Implementation Notes

- Added local renderer types `CampaignTerrainHexPointBounds` and `CampaignTerrainCoordinateSystem`.
- Added `getCampaignHexPointBounds()`, `createCampaignTerrainCoordinateSystem()`, and normalization helpers so UV/hex-point conversions can consume either the raw runtime `coordinateSystem` or the renderer coordinate service.
- Rewrote `createCampaignTerrainWorldScale()` to derive scale from bounds width/height through the coordinate service.
- Extended `CampaignMaterialSemanticModel` with `terrainCoordinates` and routed loaded-grid UV/hex-point conversion call sites through that canonical renderer service while keeping raw `coordinateSystem` available for existing callers.

## Concerns

None.

## Task 2 Review Follow-Up

- Strengthened `tests/robustness.test.cjs` from a single source regex into AST-backed checks that inspect the live private functions `smoothNonMountainFlattenedHeightSamples`, `createMountainFloorHeightSamples`, `createMountainFloorSeedMask`, `smoothMountainFloorHeightSamples`, and `isLandTerrainSample`, and assert each `terrainUvToHexPoint(...)` call passes `materialSemanticModel.terrainCoordinates` (or a local alias) instead of relying on the default coordinate system.
- Fixed the active loaded-grid terrain pipeline in `src/ui/views/map/campaign-terrain-webgl.ts` so the chunk-height smoothing, mountain-floor seeding/diffusion, and `isLandTerrainSample()` conversion path now sample through `materialSemanticModel.terrainCoordinates` for non-default `hexPointBounds` maps.
- Scope stayed limited to the Task 2 live path. No runtime export files changed, and the broader default-call cleanup remains deferred to Task 3.

### Review Follow-Up Verification

```bash
node --test --test-name-pattern "campaign terrain renderer uses loaded hex point bounds" tests\robustness.test.cjs
```

Result: passed after the AST assertions caught the previously missed default-coordinate calls and the live-path fix routed those calls through `materialSemanticModel.terrainCoordinates`.

```bash
npm run typecheck --silent
```

Result: passed.
