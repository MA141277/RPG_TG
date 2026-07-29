# Task 1 Report: Runtime Export Contract

Status: DONE

Commits created: none (git unavailable)

## Summary

Implemented the Task 1 runtime export contract so map3 editor cells export one-to-one into the runtime campaign hex grid while keeping gameplay hex size fixed at `hexTerrainScale=138` and `hexMapAspect=1.1285`.

The final runtime export now writes signed `coordinateSystem.hexPointBounds`, keeps the one-to-one overlay projection metadata, and regenerates the `map3` runtime grid at `13512` cells. Settlement-backed `maps.json` nodes were regenerated from the updated runtime mapping during the required export step.

## TDD Evidence

RED:

- Added `test("map3 runtime export keeps gameplay hex size and one-to-one cells", ...)` to `tests/robustness.test.cjs`.
- Ran `node --test --test-name-pattern "map3 runtime export keeps gameplay hex size" tests/robustness.test.cjs`.
- Result: failed as expected with `188.35381 !== 138` from `yuanmo-campaign-hex-grid-map2-runtime.json`.

GREEN:

- Kept the existing exploratory `hexPointBounds` support in `src/domain/map.ts`.
- Updated `src/yuanmo-hex-editor/runtime-grid-export.ts` so `mapRuntimeHexToGameCoordinate` explicitly accepts optional `hexPointBounds` and the one-to-one export preserves signed bound values instead of clamping negative extents.
- Regenerated runtime data with `node tools\build-yuanmo-runtime-grid-from-editor-package.cjs --input map3`.
- Result: runtime export now writes `hexTerrainScale: 138`, `hexMapAspect: 1.1285`, signed `hexPointBounds`, and `13512` runtime cells.

## Verification

- `node tools\build-yuanmo-runtime-grid-from-editor-package.cjs --input map3`
  - Passed.
  - Output confirmed `Using editor package: map3` and wrote `13512` runtime cells.
- `node --test --test-name-pattern "map3 runtime export keeps gameplay hex size" tests/robustness.test.cjs`
  - Passed.
- `npm run typecheck --silent`
  - Passed.

## Changed Files

- `.superpowers/sdd/task-1-brief.md`
- `.superpowers/sdd/task-1-report.md`
- `src/yuanmo-hex-editor/runtime-grid-export.ts`
- `src/content/scenario-packs/zhuyuanzhang/assets/maps/yuanmo-campaign-hex-grid-map2-runtime.json`
- `src/content/scenario-packs/zhuyuanzhang/maps.json`
- `tests/robustness.test.cjs`

## Notes

- `src/domain/map.ts` already contained the optional `hexPointBounds` contract required by Task 1, so no additional edit was needed there.
- `tools/build-yuanmo-runtime-grid-from-editor-package.cjs` already supported the required `--input map3` export flow, so no code change was needed there.
- The task brief asked to update `Execution State` and `Progress Log`, but those sections were missing from the file; they were added while syncing Task 1 completion.

## Concerns

None.
