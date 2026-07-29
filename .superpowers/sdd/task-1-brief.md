## Task 1: Runtime Export Contract

## Execution State

- Status: `completed`
- Last Updated: `2026-07-28`
- Current Focus: `Task 2: Renderer coordinate service`
- Next Step: `Hand off the verified Task 1 runtime export contract changes and proceed to Task 2 when requested.`
- Verification: `node --test --test-name-pattern "map3 runtime export keeps gameplay hex size" tests/robustness.test.cjs; npm run typecheck --silent`
- Notes: `Task 1 keeps runtime hex size fixed at hexTerrainScale=138 and hexMapAspect=1.1285 while storing one-to-one runtime extents in hexPointBounds.`

**Files:**
- Modify: `tests/robustness.test.cjs`
- Modify: `src/domain/map.ts`
- Modify: `src/yuanmo-hex-editor/runtime-grid-export.ts`
- Modify: `tools/build-yuanmo-runtime-grid-from-editor-package.cjs`
- Generated: `src/content/scenario-packs/zhuyuanzhang/assets/maps/yuanmo-campaign-hex-grid-map2-runtime.json`
- Generated: `src/content/scenario-packs/zhuyuanzhang/maps.json`
- Read: `map3/hex-grid.generated.json`
- Read: `map3/hex-overrides.water-land.json`

**Interfaces:**
- Consumes: `GeneratedHexGrid`, `CampaignHexGridDefinition`, and map3 editor package files.
- Produces: runtime grid where `coordinateSystem.hexTerrainScale === 138`, `source.editorOverlay.projection === "editor-grid-one-to-one-runtime-hex"`, runtime cell count equals map3 generated cell count unless explicit filler cells are added, and optional `coordinateSystem.hexPointBounds` stores map extent.

- [x] **Step 1: Write the failing runtime export contract test**

Add or update a test in `tests/robustness.test.cjs` named:

```js
test("map3 runtime export keeps gameplay hex size and one-to-one cells", () => {
  const runtimeGrid = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "src",
        "content",
        "scenario-packs",
        "zhuyuanzhang",
        "assets",
        "maps",
        "yuanmo-campaign-hex-grid-map2-runtime.json"
      ),
      "utf8"
    )
  );
  const generatedGrid = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "map3", "hex-grid.generated.json"), "utf8")
  );
  const waterLandOverrides = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "map3", "hex-overrides.water-land.json"), "utf8")
  );

  assert.equal(runtimeGrid.coordinateSystem.hexTerrainScale, 138);
  assert.equal(runtimeGrid.coordinateSystem.hexMapAspect, 1.1285);
  assert.ok(runtimeGrid.coordinateSystem.hexPointBounds);
  assert.equal(runtimeGrid.source.editorOverlay.projection, "editor-grid-one-to-one-runtime-hex");
  assert.equal(runtimeGrid.counts.cells, generatedGrid.counts.cells);

  const runtimeCellsByKey = new Map(runtimeGrid.cells.map((cell) => [`${cell.x},${cell.y}`, cell]));
  assert.equal(runtimeCellsByKey.size, runtimeGrid.cells.length);
  assert.equal(runtimeGrid.cells.length, generatedGrid.cells.length);

  const waterOverrideRuntimeMatches = waterLandOverrides.filter((override) =>
    [...runtimeCellsByKey.values()].some((cell) => cell.land === override.land)
  );
  assert.equal(
    waterOverrideRuntimeMatches.length > 0,
    true,
    "Expected map3 water-land overrides to be represented in the runtime grid."
  );
});
```

- [x] **Step 2: Run test to verify it fails**

Run:

```bash
node --test --test-name-pattern "map3 runtime export keeps gameplay hex size" tests/robustness.test.cjs
```

Expected:

- `FAIL`
- Failure must include current `188.35381 !== 138` or missing `hexPointBounds`.

- [x] **Step 3: Add optional `hexPointBounds` to the runtime grid type**

In `src/domain/map.ts`, extend `CampaignHexGridDefinition.coordinateSystem`:

```ts
hexPointBounds?: {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};
```

Keep the field optional so existing old grid JSON remains valid.

- [x] **Step 4: Fix one-to-one export to keep shared hex size**

In `src/yuanmo-hex-editor/runtime-grid-export.ts`, change `createOneToOneRuntimeCoordinateSystem` so it:

- Keeps `hexTerrainScale` from `runtimeGrid.coordinateSystem.hexTerrainScale`.
- Keeps `hexMapAspect` from `runtimeGrid.coordinateSystem.hexMapAspect`.
- Computes `hexPointBounds` from centered runtime cell pixel bounds.
- Does not compute a new scale from map extents.

The implementation shape should be:

```ts
function createOneToOneRuntimeCoordinateSystem(
  editorGenerated: GeneratedHexGrid,
  runtimeGrid: CampaignHexGridDefinition,
  transform: OneToOneRuntimeGridTransform
): CampaignHexGridDefinition["coordinateSystem"] {
  const centeredCells = editorGenerated.cells.map((cell) =>
    mapEditorCellToOneToOneRuntimeHex(cell, transform)
  );
  const pixelBounds = calculateHexPixelBounds(centeredCells);
  const hexRadiusX = Math.sqrt(3) * 0.5;
  const hexRadiusY = 1;

  return {
    ...runtimeGrid.coordinateSystem,
    hexMapAspect: runtimeGrid.coordinateSystem.hexMapAspect,
    hexTerrainScale: runtimeGrid.coordinateSystem.hexTerrainScale,
    hexPointBounds: {
      minX: roundCoordinateScale(pixelBounds.minX - hexRadiusX),
      maxX: roundCoordinateScale(pixelBounds.maxX + hexRadiusX),
      minY: roundCoordinateScale(pixelBounds.minY - hexRadiusY),
      maxY: roundCoordinateScale(pixelBounds.maxY + hexRadiusY),
    },
  };
}
```

- [x] **Step 5: Make map-coordinate export use `hexPointBounds` when present**

In `mapRuntimeHexToGameCoordinate`, when `hexCoordinateSystem.hexPointBounds` exists, convert a hex pixel point into coordinate-space x/y using that bounds rectangle:

```ts
const u = (point.x - hexPointBounds.minX) / Math.max(hexPointBounds.maxX - hexPointBounds.minX, 1);
const terrainV = (point.y - hexPointBounds.minY) / Math.max(hexPointBounds.maxY - hexPointBounds.minY, 1);
```

Clamp both values to `[0, 1]`. Preserve the old formula when `hexPointBounds` is absent.

- [x] **Step 6: Regenerate map3 runtime data**

Run:

```bash
node tools\build-yuanmo-runtime-grid-from-editor-package.cjs --input map3
```

Expected:

- Output says it used `map3`.
- Runtime grid writes `13512` cells.
- Generated runtime grid has `coordinateSystem.hexTerrainScale: 138`.

- [x] **Step 7: Run task verification**

Run:

```bash
node --test --test-name-pattern "map3 runtime export keeps gameplay hex size" tests\robustness.test.cjs
npm run typecheck --silent
```

Expected:

- Both commands pass.

- [x] **Step 8: Sync progress**

Update this plan:

- Check off Task 1 completed steps.
- Set `Execution State.Current Focus` to `Task 2: Renderer coordinate service`.
- Append a `Progress Log` entry with commands run and result.

## Progress Log

- 2026-07-28
  - Summary: `Added the Task 1 runtime export contract test, preserved the one-to-one runtime coordinate system at hexTerrainScale=138 / hexMapAspect=1.1285, fixed signed hexPointBounds export, and regenerated the map3 runtime grid plus settlement-backed maps.json nodes.`
  - RED: `node --test --test-name-pattern "map3 runtime export keeps gameplay hex size" tests/robustness.test.cjs` -> fail (`188.35381 !== 138`).
  - Verification: `node tools\build-yuanmo-runtime-grid-from-editor-package.cjs --input map3`; `node --test --test-name-pattern "map3 runtime export keeps gameplay hex size" tests/robustness.test.cjs`; `npm run typecheck --silent`
  - Result: `Pass. Runtime export now writes 13512 one-to-one cells with signed hexPointBounds and fixed gameplay hex size.`
  - Next: `Task 2: Renderer coordinate service`

