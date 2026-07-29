# Task 1 Review Package

Git is unavailable in this environment. Review the current file contents and implementer report against the Task 1 brief.

## Changed/Relevant Files

- tests/robustness.test.cjs
- src/domain/map.ts
- src/yuanmo-hex-editor/runtime-grid-export.ts
- tools/build-yuanmo-runtime-grid-from-editor-package.cjs
- src/content/scenario-packs/zhuyuanzhang/assets/maps/yuanmo-campaign-hex-grid-map2-runtime.json
- src/content/scenario-packs/zhuyuanzhang/maps.json

## Key Runtime Grid Snapshot
{
  "runtimeCoordinateSystem": {
    "hexTerrainScale": 138,
    "hexMapAspect": 1.1285,
    "coordinateSpace": {
      "width": 509,
      "height": 451
    },
    "hexPointBounds": {
      "minX": -103.057023,
      "maxX": 101.324972,
      "minY": -86.5,
      "maxY": 86.5
    }
  },
  "runtimeBounds": {
    "minX": -87,
    "maxX": 86,
    "minY": -57,
    "maxY": 57
  },
  "runtimeCounts": {
    "cells": 13512,
    "landCells": 7575,
    "waterCells": 5937,
    "terrains": {
      "平原": 11436,
      "山脉": 2076
    },
    "environments": {
      "草地": 13512
    }
  },
  "projection": "editor-grid-one-to-one-runtime-hex",
  "generatedBounds": {
    "minX": 165,
    "maxX": 338,
    "minY": -164,
    "maxY": -50
  },
  "generatedCounts": {
    "cells": 13512,
    "landCells": 7610,
    "waterCells": 5902,
    "terrains": {
      "平原": 11436,
      "山脉": 2076
    },
    "environments": {
      "草地": 13512,
      "森林": 0
    }
  }
}

## Search Evidence
src\domain\map.ts:63:    hexTerrainScale: number;
src\domain\map.ts:65:    hexPointBounds?: {
src\yuanmo-hex-editor\runtime-grid-export.ts:104:export function mapRuntimeHexToGameCoordinate(
src\yuanmo-hex-editor\runtime-grid-export.ts:109:    "hexTerrainScale" | "hexMapAspect" | "hexPointBounds"
src\yuanmo-hex-editor\runtime-grid-export.ts:113:  const hexPointBounds = hexCoordinateSystem?.hexPointBounds ?? null;
src\yuanmo-hex-editor\runtime-grid-export.ts:117:      : hexPointBounds == null
src\yuanmo-hex-editor\runtime-grid-export.ts:120:              Math.max(hexCoordinateSystem.hexMapAspect * hexCoordinateSystem.hexTerrainScale, 1) +
src\yuanmo-hex-editor\runtime-grid-export.ts:124:            (point.x - hexPointBounds.minX) /
src\yuanmo-hex-editor\runtime-grid-export.ts:125:              Math.max(hexPointBounds.maxX - hexPointBounds.minX, 1)
src\yuanmo-hex-editor\runtime-grid-export.ts:130:      : hexPointBounds == null
src\yuanmo-hex-editor\runtime-grid-export.ts:131:        ? clamp01(point.y / Math.max(hexCoordinateSystem.hexTerrainScale, 1) + 0.5)
src\yuanmo-hex-editor\runtime-grid-export.ts:133:            (point.y - hexPointBounds.minY) /
src\yuanmo-hex-editor\runtime-grid-export.ts:134:              Math.max(hexPointBounds.maxY - hexPointBounds.minY, 1)
src\yuanmo-hex-editor\runtime-grid-export.ts:147:  const coordinateSystem = createOneToOneRuntimeCoordinateSystem(
src\yuanmo-hex-editor\runtime-grid-export.ts:267:function createOneToOneRuntimeCoordinateSystem(
src\yuanmo-hex-editor\runtime-grid-export.ts:282:    hexTerrainScale: runtimeGrid.coordinateSystem.hexTerrainScale,
src\yuanmo-hex-editor\runtime-grid-export.ts:283:    hexPointBounds: {
tests\robustness.test.cjs:4532:  assert.equal(campaignHexGrid.coordinateSystem.hexTerrainScale, 138);
tests\robustness.test.cjs:4534:    campaignHexGrid.coordinateSystem.hexPointBounds,
tests\robustness.test.cjs:4535:    "Expected one-to-one editor exports to store map extent separately from hexTerrainScale."
tests\robustness.test.cjs:4539:    /coordinateSystem\.hexTerrainScale\s*\/\s*HEX_TERRAIN_SCALE/s
tests\robustness.test.cjs:4547:    /gl\.uniform4f\(hexPointBoundsLocation,/s
tests\robustness.test.cjs:4551:test("map3 runtime export keeps gameplay hex size and one-to-one cells", () => {
tests\robustness.test.cjs:4574:  assert.equal(runtimeGrid.coordinateSystem.hexTerrainScale, 138);
tests\robustness.test.cjs:4576:  assert.ok(runtimeGrid.coordinateSystem.hexPointBounds);
tests\robustness.test.cjs:4577:  assert.equal(runtimeGrid.coordinateSystem.hexPointBounds.minX < 0, true);
tests\robustness.test.cjs:4578:  assert.equal(runtimeGrid.coordinateSystem.hexPointBounds.maxX > 0, true);
tests\robustness.test.cjs:4579:  assert.equal(runtimeGrid.coordinateSystem.hexPointBounds.minY < 0, true);
tests\robustness.test.cjs:4580:  assert.equal(runtimeGrid.coordinateSystem.hexPointBounds.maxY > 0, true);
tests\robustness.test.cjs:4647:    /gl\.uniform1f\(hexTerrainScaleLocation,\s*materialSemanticModel\.coordinateSystem\.hexTerrainScale\s*\)/s
tests\robustness.test.cjs:4655:    /gl\.uniform1f\(hexTerrainScaleLocation,\s*HEX_TERRAIN_SCALE\s*\)/
src\content\scenario-packs\zhuyuanzhang\assets\maps\yuanmo-campaign-hex-grid-map2-runtime.json:10:    "hexTerrainScale": 138,
src\content\scenario-packs\zhuyuanzhang\assets\maps\yuanmo-campaign-hex-grid-map2-runtime.json:16:    "hexPointBounds": {
src\content\scenario-packs\zhuyuanzhang\assets\maps\yuanmo-campaign-hex-grid-map2-runtime.json:34:      "terrainUvFormula": "u = x / (hexMapAspect * hexTerrainScale) + 0.5; v = y / hexTerrainScale + 0.5",
