# Task 3 Report: Runtime-Grid Coordinate Cleanup

Status: DONE

## Scope

Modified Task 3 files only:

- `src/ui/views/map/campaign-terrain-webgl.ts`
- `src/ui/views/map/shaders/campaign-terrain.frag.glsl`
- `tests/robustness.test.cjs`
- `docs/superpowers/plans/2026-07-28-campaign-hex-runtime-grid-architecture-plan.md`

## TDD Evidence

Added the focused robustness contract:

- `campaign terrain runtime grid paths do not use default hex conversion fallbacks`

The brief's exact regex shape was too broad because it would also flag the legacy material-image fallback helper `isHexPassableAtHexPoint()`, which still intentionally uses the default conversion path for maps that do not load a runtime grid. The new test is narrowed to named runtime-grid functions and call chains instead of banning every default overload in the file.

Red run:

```bash
node --test --test-name-pattern "runtime grid paths do not use default hex conversion" tests\robustness.test.cjs
```

Result: exit `1`.

- Failed because the renderer still omitted `terrainCoordinates` in runtime-grid vegetation and structure call chains.

Green run:

```bash
node --test --test-name-pattern "runtime grid paths do not use default hex conversion|loaded hex grid coordinate system|dynamic shoreline" tests\robustness.test.cjs
npm run typecheck --silent
```

Result: both commands exited `0`.

## Implementation Notes

- Threaded `materialSemanticModel.terrainCoordinates` through remaining runtime-grid cleanup paths:
  - shoreline fallback sampling and shoreline edge raster bounds
  - vegetation placement and avoidance
  - fort/city structure placement
  - UV passability checks
  - helper snapping used by runtime-grid click/hex-center projection utilities
- Kept the legacy material-image fallback helper untouched where default conversion remains intentional.
- Aligned terrain shader semantics with signed `hexPointBounds` by adding `uHexPointBounds` and reconstructing `hexPoint` from bounds instead of the old centered `hexTerrainScale` rectangle.

## Verification

```bash
node --test --test-name-pattern "runtime grid paths do not use default hex conversion|loaded hex grid coordinate system|dynamic shoreline" tests\robustness.test.cjs
npm run typecheck --silent
```

Observed:

- `3` targeted robustness tests passed.
- TypeScript typecheck passed with no output.

## Concerns

None.
