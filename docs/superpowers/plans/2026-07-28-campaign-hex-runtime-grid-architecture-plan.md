# Campaign Hex Runtime Grid Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make map3 run as a one-to-one runtime campaign hex grid with the shared old hex size, without old-grid projection, fake runtime scaling, or mixed semantic layers.

**Architecture:** Editor sampling remains a production-only source-image process. Runtime exports keep `hexTerrainScale = 138` and represent map extent separately through grid bounds/hex-point bounds. WebGL terrain, shoreline, structures, vegetation, markers, actor, click projection, and travel use one loaded-grid coordinate service.

**Tech Stack:** TypeScript, Node test runner, Vite build, WebGL renderer, `tools/build-yuanmo-runtime-grid-from-editor-package.cjs`, `tests/robustness.test.cjs`.

## Global Constraints

- Runtime campaign hex size stays fixed at `hexTerrainScale = 138` and `hexMapAspect = 1.1285`.
- Editor `scale`, `step`, `offsetX`, `offsetY`, and `sourceCrop` are production-only sampling controls and must not change gameplay hex size.
- Every map3 editor/generated cell maps to exactly one runtime `CampaignHexGridCell`; no projection or merge into the old `8509`-cell grid.
- Runtime map extent must come from `campaignHexGrid.bounds` or `hexPointBounds`, not from changing `hexTerrainScale`.
- When `campaignHexGridUrl` is provided, runtime land/water, terrain, environment, height, and passability come from `campaignHexGrid.cells`.
- Legacy material-image semantic sampling is fallback-only for maps without a runtime grid.
- Shader visual layers may stylize terrain but must not redefine land/water or terrain semantics.
- Camera must start near the player/current node and must not fit the full map to screen by default.
- Do not make all cities enterable in this child.
- Do not redesign city internal content or scripts in this child.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-28`
- Current Focus: `Final code review`
- Next Step: `Run final code review and then push/close according to project governance.`
- Verification: `node tools\build-yuanmo-runtime-grid-from-editor-package.cjs --input map3`; `node --test --test-name-pattern "map3 runtime export keeps gameplay hex size|campaign terrain renderer uses loaded hex point bounds|runtime grid paths do not use default hex conversion|dynamic shoreline|loaded hex grid coordinate system" tests\robustness.test.cjs`; `npm run typecheck --silent`; `npm run build:test --silent`; `npm run build`
- Notes: `Spec is docs/superpowers/specs/2026-07-28-campaign-hex-runtime-grid-architecture-design.md. Current workspace includes earlier exploratory edits in src/domain/map.ts, src/yuanmo-hex-editor/runtime-grid-export.ts, and tests/robustness.test.cjs that must be reviewed rather than assumed correct.`

## Progress Log

- 2026-07-28
  - Summary: `Created the campaign hex runtime grid architecture implementation plan after confirming map3 needs fixed gameplay hex size, one-to-one cells, and grid-bound-driven renderer extent.`
  - Verification: `Not run`
  - Next: `Execute Task 1 with subagent-driven development.`
- 2026-07-28
  - Summary: `Task 1 completed: map3 runtime export keeps fixed gameplay hex size, writes signed hexPointBounds, and regenerates one-to-one 13512-cell runtime data.`
  - Verification: `node --test --test-name-pattern "map3 runtime export keeps gameplay hex size" tests/robustness.test.cjs`; `npm run typecheck --silent`; task review approved.
  - Next: `Execute Task 2 renderer coordinate service.`
- 2026-07-28
  - Summary: `Task 2 completed: renderer coordinate service now derives extent from hexPointBounds and active chunk-height live path uses materialSemanticModel.terrainCoordinates.`
  - Verification: `node --test --test-name-pattern "campaign terrain renderer uses loaded hex point bounds" tests/robustness.test.cjs`; `npm run typecheck --silent`; re-review approved.
  - Next: `Execute Task 3 runtime-grid coordinate cleanup.`
- 2026-07-28
  - Summary: `Task 3 completed: remaining runtime-grid shoreline, vegetation, structures, passability, and shader hex-point reconstruction paths now consume loaded terrainCoordinates/hexPointBounds instead of silently falling back to the default 138 rectangle.`
  - Verification: `node --test --test-name-pattern "runtime grid paths do not use default hex conversion|loaded hex grid coordinate system|dynamic shoreline" tests/robustness.test.cjs`; `npm run typecheck --silent`
  - Next: `Execute Task 4 regeneration and runtime verification.`
- 2026-07-28
  - Summary: `Task 4 completed locally: regenerated map3 runtime data, strengthened maps.json no-old-fort assertions, verified browser new-game runtime around 濠州 with visible terrain/building/labels and no console errors.`
  - Verification: `node tools\build-yuanmo-runtime-grid-from-editor-package.cjs --input map3`; `node --test --test-name-pattern "map3 runtime export keeps gameplay hex size|campaign terrain renderer uses loaded hex point bounds|runtime grid paths do not use default hex conversion|dynamic shoreline|loaded hex grid coordinate system" tests\robustness.test.cjs`; `npm run typecheck --silent`; `npm run build:test --silent`; `npm run build`; browser screenshot `C:/Users/EDY/Documents/GitHub/RPG_TG/.superpowers/sdd/map3-runtime-verification.png`.
  - Next: `Run final code review and push/close according to project governance.`
- 2026-07-28
  - Summary: `Final review Important findings fixed: runtime chunk cache signature now includes coordinate system extent metadata, chunk algorithm version was bumped, shader local shoreline sampling now uses uHexPointBounds size, and water-land override assertions now check exact one-to-one runtime cells.`
  - Verification: `node --test --test-name-pattern "map3 runtime export keeps gameplay hex size|campaign terrain renderer uses loaded hex point bounds|runtime grid paths do not use default hex conversion|dynamic shoreline|loaded hex grid coordinate system" tests\robustness.test.cjs`; `npm run typecheck --silent`; `npm run build:test --silent`; `npm run build`; `npm run lint:plans`; browser smoke reached 濠州 with terrain visible and no console errors.
  - Next: `Await final re-review, then push/close according to project governance.`
- 2026-07-28
  - Summary: `Final re-review completed with no Critical or Important findings; previous cache-signature, shader-extent, and override-test findings are resolved.`
  - Verification: `Reviewer reran the targeted robustness subset with 5 pass, 0 fail; controller verification remains recorded above.`
  - Next: `Push/close according to project governance when git tooling is available.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-28-campaign-hex-runtime-grid-architecture-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `map3/hex-grid.generated.json` contains `13512` generated cells with sampling `step = 0.3`.
  - `src/content/scenario-packs/zhuyuanzhang/assets/maps/yuanmo-campaign-hex-grid-map2-runtime.json` currently contains `13512` runtime cells but incorrectly writes `coordinateSystem.hexTerrainScale = 188.35381`.
  - `map3/hex-overrides.water-land.json` contains `40` overrides; `map3/hex-overrides.terrain.json`, `map3/hex-overrides.environment.json`, and `map3/structure-overlays.json` are empty arrays.
  - Earlier exploratory edits started adding `hexPointBounds` and a failing robustness assertion; re-check and finish them through TDD.

## Implementation Scope

### In Scope

- Runtime export contract for fixed hex size and one-to-one map3 cells.
- Shared renderer coordinate helpers that derive extent from loaded grid bounds/hex-point bounds.
- Removal of mixed default-138 conversion calls in runtime-grid paths.
- Shoreline, structure ground, vegetation, markers, actor, click projection, and travel-grid alignment to the loaded grid coordinate service.
- Regenerating `yuanmo-campaign-hex-grid-map2-runtime.json` and `maps.json` from `map3`.
- Targeted tests, typecheck, build, and browser runtime verification.

### Still Out Of Scope

- New city/house enterable content.
- Final city story, buildings, or scripts.
- Reworking terrain art direction or shader style.
- Rewriting the editor UI.
- Making `structure-overlays.json` a full gameplay content system unless required to remove duplicate semantic paths.

## File Map

### Existing files to modify

- `src/domain/map.ts`
  - Add optional runtime grid extent metadata without changing old grid compatibility.
- `src/yuanmo-hex-editor/runtime-grid-export.ts`
  - Keep one-to-one runtime export fixed at the shared gameplay hex size and calculate extent separately.
- `tools/build-yuanmo-runtime-grid-from-editor-package.cjs`
  - Continue using one-to-one export, regenerate map3 runtime data, and ensure settlements sync through map3 cells only.
- `src/ui/views/map/campaign-terrain-webgl.ts`
  - Centralize runtime-grid coordinate conversion and remove fake world-scale compensation.
- `src/ui/views/map/shaders/campaign-terrain.frag.glsl`
  - Consume a consistent terrain-to-hex conversion if shader UV extent changes.
- `src/content/scenario-packs/zhuyuanzhang/assets/maps/yuanmo-campaign-hex-grid-map2-runtime.json`
  - Regenerated runtime grid output.
- `src/content/scenario-packs/zhuyuanzhang/maps.json`
  - Regenerated settlement node positions from map3.
- `tests/robustness.test.cjs`
  - Add/adjust contract tests for fixed runtime hex size, one-to-one export, and coordinate-service usage.

### Existing files expected to be deleted

- None.

### New files to create

- None expected. If renderer coordinate helpers are too large for `campaign-terrain-webgl.ts`, create `src/ui/views/map/campaign-terrain-coordinate-system.ts` and keep it pure and unit-testable.

## Verification Plan

- Targeted verification:
  - `node --test --test-name-pattern "campaign hex grid drives dynamic shoreline|explicit hex point bounds|loaded hex grid coordinate system" tests/robustness.test.cjs`
- Required commands:
  - `npm run typecheck --silent`
  - `npm run build:test --silent`
  - `npm run build`
  - `npm run lint:plans`
- Runtime verification:
  - Start or reuse the local Vite dev server.
  - Open the campaign map in the in-app browser.
  - Confirm map3 terrain is visible, the player starts on land near the current node, buildings are visible, city labels are not old duplicate coordinates, and no old-grid parallelogram clip is visible.

## Task 1: Runtime Export Contract

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

## Task 2: Renderer Coordinate Service

**Files:**
- Modify: `tests/robustness.test.cjs`
- Modify: `src/ui/views/map/campaign-terrain-webgl.ts`
- Modify if needed: `src/ui/views/map/shaders/campaign-terrain.frag.glsl`

**Interfaces:**
- Consumes: runtime grid `coordinateSystem.hexPointBounds`.
- Produces: helpers that convert consistently between terrain UV, hex point, runtime hex cell, world point, and screen point using loaded grid extent.

- [x] **Step 1: Write the failing renderer contract test**

In `tests/robustness.test.cjs`, add or update a test named:

```js
test("campaign terrain renderer uses loaded hex point bounds instead of terrain scale compensation", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src", "ui", "views", "map", "campaign-terrain-webgl.ts"),
    "utf8"
  );

  assert.match(source, /function getCampaignHexPointBounds\(/);
  assert.match(source, /function createCampaignTerrainCoordinateSystem\(/);
  assert.doesNotMatch(source, /coordinateSystem\.hexTerrainScale\s*\/\s*HEX_TERRAIN_SCALE/);
  assert.match(source, /terrainUvToHexPoint\(u,\s*v,\s*materialSemanticModel\.terrainCoordinates\)/);
  assert.match(source, /hexPointToTerrainU\(center\.x,\s*campaignHexGrid\.coordinateSystem/);
});
```

- [x] **Step 2: Run test to verify it fails**

Run:

```bash
node --test --test-name-pattern "campaign terrain renderer uses loaded hex point bounds" tests\robustness.test.cjs
```

Expected:

- `FAIL` because `createCampaignTerrainCoordinateSystem` does not exist or scale compensation still exists.

- [x] **Step 3: Add a renderer coordinate model**

In `src/ui/views/map/campaign-terrain-webgl.ts`, add a local type near the existing terrain types:

```ts
type CampaignTerrainHexPointBounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

type CampaignTerrainCoordinateSystem = {
  coordinateSystem: CampaignHexGridAsset["coordinateSystem"];
  hexPointBounds: CampaignTerrainHexPointBounds;
  worldScale: CampaignTerrainWorldScale;
};
```

- [x] **Step 4: Add bounds helpers**

Implement:

```ts
function getCampaignHexPointBounds(
  coordinateSystem: CampaignHexGridAsset["coordinateSystem"]
): CampaignTerrainHexPointBounds {
  if (coordinateSystem.hexPointBounds != null) {
    return coordinateSystem.hexPointBounds;
  }

  return {
    minX: -coordinateSystem.hexMapAspect * coordinateSystem.hexTerrainScale * 0.5,
    maxX: coordinateSystem.hexMapAspect * coordinateSystem.hexTerrainScale * 0.5,
    minY: -coordinateSystem.hexTerrainScale * 0.5,
    maxY: coordinateSystem.hexTerrainScale * 0.5,
  };
}

function createCampaignTerrainCoordinateSystem(
  coordinateSystem: CampaignHexGridAsset["coordinateSystem"]
): CampaignTerrainCoordinateSystem {
  const hexPointBounds = getCampaignHexPointBounds(coordinateSystem);
  const width = Math.max(hexPointBounds.maxX - hexPointBounds.minX, 1);
  const height = Math.max(hexPointBounds.maxY - hexPointBounds.minY, 1);

  return {
    coordinateSystem,
    hexPointBounds,
    worldScale: {
      x: Math.max(width / (HEX_MAP_ASPECT * HEX_TERRAIN_SCALE), 1),
      y: Math.max(height / HEX_TERRAIN_SCALE, 1),
    },
  };
}
```

The important invariant is that `worldScale` uses bounds width/height, not changed `hexTerrainScale`.

- [x] **Step 5: Route material semantic model through the coordinate model**

Change `CampaignMaterialSemanticModel` to store:

```ts
terrainCoordinates: CampaignTerrainCoordinateSystem;
```

Set `worldScale` from `terrainCoordinates.worldScale`.

Do not remove `coordinateSystem` yet if too many call sites still use it; it can remain as the raw JSON coordinate system while `terrainCoordinates` is the canonical renderer service.

- [x] **Step 6: Update UV/hex conversion helpers**

Change helpers so they accept `CampaignTerrainCoordinateSystem` or raw `coordinateSystem` and normalize internally:

```ts
function terrainUvToHexPoint(
  u: number,
  v: number,
  coordinates: CampaignTerrainCoordinateSystem | CampaignHexGridAsset["coordinateSystem"] = createCampaignTerrainCoordinateSystem({
    hexTerrainScale: HEX_TERRAIN_SCALE,
    hexMapAspect: HEX_MAP_ASPECT,
    coordinateSpace: { width: GRID_COLUMNS, height: GRID_ROWS },
  })
): { x: number; y: number } {
  const terrainCoordinates = normalizeCampaignTerrainCoordinates(coordinates);
  const bounds = terrainCoordinates.hexPointBounds;

  return {
    x: bounds.minX + u * (bounds.maxX - bounds.minX),
    y: bounds.minY + v * (bounds.maxY - bounds.minY),
  };
}
```

Implement equivalent `hexPointToTerrainU` and `hexPointToTerrainV` based on `hexPointBounds`.

- [x] **Step 7: Remove scale-compensation helper**

Remove or rewrite `createCampaignTerrainWorldScale()` so it does not contain:

```ts
coordinateSystem.hexTerrainScale / HEX_TERRAIN_SCALE
```

Expected replacement:

```ts
function createCampaignTerrainWorldScale(
  coordinateSystem: CampaignHexGridAsset["coordinateSystem"]
): CampaignTerrainWorldScale {
  return createCampaignTerrainCoordinateSystem(coordinateSystem).worldScale;
}
```

- [x] **Step 8: Run task verification**

Run:

```bash
node --test --test-name-pattern "campaign terrain renderer uses loaded hex point bounds" tests\robustness.test.cjs
npm run typecheck --silent
```

Expected:

- Both commands pass.

- [x] **Step 9: Sync progress**

Update this plan:

- Check off Task 2 completed steps.
- Set `Execution State.Current Focus` to `Task 3: Runtime-grid coordinate cleanup`.
- Append a `Progress Log` entry with commands run and result.

## Task 3: Runtime-Grid Coordinate Cleanup

**Files:**
- Modify: `tests/robustness.test.cjs`
- Modify: `src/ui/views/map/campaign-terrain-webgl.ts`
- Modify if needed: `src/ui/views/map/shaders/campaign-terrain.frag.glsl`

**Interfaces:**
- Consumes: `CampaignTerrainCoordinateSystem` from Task 2.
- Produces: no map3 path that silently falls back to default 138 conversions for shoreline, chunk bounds, heights, vegetation, structures, actor, marker projection, click projection, or travel passability.

- [x] **Step 1: Write the failing cleanup contract test**

Add a robustness test:

```js
test("campaign terrain runtime grid paths do not use default hex conversion fallbacks", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src", "ui", "views", "map", "campaign-terrain-webgl.ts"),
    "utf8"
  );

  assert.doesNotMatch(source, /terrainUvToHexPoint\(u,\s*v\);/);
  assert.doesNotMatch(source, /hexPointToTerrainU\(center\.x\);/);
  assert.doesNotMatch(source, /hexPointToTerrainV\(center\.y\);/);
  assert.doesNotMatch(source, /hexPointToTerrainU\(minX\);/);
  assert.doesNotMatch(source, /hexPointToTerrainV\(minY\);/);
  assert.match(source, /createShorelineDistanceTextureModel\(\s*input\.semanticData\.materialSemanticModel,/);
});
```

- [x] **Step 2: Run test to verify it fails**

Run:

```bash
node --test --test-name-pattern "runtime grid paths do not use default hex conversion" tests\robustness.test.cjs
```

Expected:

- `FAIL` while default helper calls remain.

- [x] **Step 3: Fix chunk and height sampling conversions**

In `createCampaignTerrainChunkData`, `createCampaignTerrainChunkGrid`, `createCampaignTerrainChunkHeightSamples`, and height smoothing functions, pass `materialSemanticModel.terrainCoordinates` or the raw coordinate system consistently into every `terrainUvToHexPoint` call.

Do not leave calls like:

```ts
terrainUvToHexPoint(u, v)
```

inside runtime-grid paths.

- [x] **Step 4: Fix shoreline distance conversions**

In shoreline code, pass the loaded coordinate system into:

- `terrainUvToHexPoint`
- `hexPointToTerrainU`
- `hexPointToTerrainV`

The fallback section inside `createShorelineDistanceTextureModel` must use:

```ts
const point = terrainUvToHexPoint(u, v, materialSemanticModel.terrainCoordinates);
```

Edge bounds must use:

```ts
const minEdgeU = hexPointToTerrainU(minX, materialSemanticModel.terrainCoordinates);
const maxEdgeU = hexPointToTerrainU(maxX, materialSemanticModel.terrainCoordinates);
const minEdgeV = hexPointToTerrainV(minY, materialSemanticModel.terrainCoordinates);
const maxEdgeV = hexPointToTerrainV(maxY, materialSemanticModel.terrainCoordinates);
```

- [x] **Step 5: Fix marker, actor, vegetation, structure, click, and travel conversions**

Search:

```bash
rg -n "terrainUvToHexPoint\\([^,]+,[^,]+\\)|hexPointToTerrainU\\([^,]+\\)|hexPointToTerrainV\\([^,]+\\)" src\\ui\\views\\map\\campaign-terrain-webgl.ts
```

For each result in a runtime-grid path, pass the coordinate service. Leave default conversions only in legacy material-image fallback or clearly old-map-only helper code.

- [x] **Step 6: Keep shader semantics aligned**

If shader `vUv` now represents grid-bounds UV rather than old 138 UV, pass the correct bounds into GLSL. Add uniforms if needed:

```glsl
uniform vec4 uHexPointBounds;
```

Then derive `hexPoint` as:

```glsl
vec2 hexPoint = vec2(
  mix(uHexPointBounds.x, uHexPointBounds.y, vUv.x),
  mix(uHexPointBounds.z, uHexPointBounds.w, vUv.y)
);
```

Do not use changed `uHexTerrainScale` to represent map extent.

- [x] **Step 7: Run task verification**

Run:

```bash
node --test --test-name-pattern "runtime grid paths do not use default hex conversion|loaded hex grid coordinate system|dynamic shoreline" tests\robustness.test.cjs
npm run typecheck --silent
```

Expected:

- Both commands pass.

- [x] **Step 8: Sync progress**

Update this plan:

- Check off Task 3 completed steps.
- Set `Execution State.Current Focus` to `Task 4: Regeneration and runtime verification`.
- Append a `Progress Log` entry with commands run and result.

## Task 4: Regeneration And Runtime Verification

**Files:**
- Modify: `src/content/scenario-packs/zhuyuanzhang/assets/maps/yuanmo-campaign-hex-grid-map2-runtime.json`
- Modify: `src/content/scenario-packs/zhuyuanzhang/maps.json`
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-28-campaign-hex-runtime-grid-architecture-plan.md`
- Optionally modify: `docs/superpowers/project-progress.md`

**Interfaces:**
- Consumes: Tasks 1-3.
- Produces: regenerated runtime assets and verified browser behavior.

- [x] **Step 1: Regenerate map3 runtime data**

Run:

```bash
node tools\build-yuanmo-runtime-grid-from-editor-package.cjs --input map3
```

Expected:

- Uses `map3`.
- Runtime grid cell count remains `13512` unless explicit filler cells were intentionally added and documented.
- Runtime grid `coordinateSystem.hexTerrainScale` is `138`.
- `maps.json` nodes are rewritten from map3 settlements, not old map nodes.

- [x] **Step 2: Add final data contract assertions**

In `tests/robustness.test.cjs`, ensure tests assert:

```js
assert.equal(runtimeGrid.coordinateSystem.hexTerrainScale, 138);
assert.equal(runtimeGrid.counts.cells, generatedGrid.counts.cells);
assert.equal(runtimeGrid.source.editorOverlay.projection, "editor-grid-one-to-one-runtime-hex");
assert.equal(runtimeGrid.cells.some((cell) => cell.land === false), true);
assert.equal(runtimeGrid.cells.some((cell) => cell.land === true), true);
```

Also assert `maps.json` has no old duplicate fort-only nodes for the active Yuanmo map if that can be checked with existing map IDs.

- [x] **Step 3: Run full targeted verification**

Run:

```bash
node --test --test-name-pattern "map3 runtime export keeps gameplay hex size|campaign terrain renderer uses loaded hex point bounds|runtime grid paths do not use default hex conversion|dynamic shoreline|loaded hex grid coordinate system" tests\robustness.test.cjs
npm run typecheck --silent
npm run build:test --silent
npm run build
npm run lint:plans
```

Expected:

- All commands pass.
- Existing Vite warnings are acceptable only if they already existed and do not affect map runtime.

- [x] **Step 4: Browser verify runtime map**

Start the dev server if needed:

```bash
npm run dev -- --host 127.0.0.1
```

In the in-app browser:

- Open `http://127.0.0.1:5173/`.
- Start or continue the campaign.
- Confirm terrain is visible.
- Confirm player starts on land near the current node.
- Confirm buildings/settlement ground are visible where nodes exist.
- Confirm visible city labels match map3 settlements and old duplicated fortress coordinates are gone.
- Confirm there is no old-grid parallelogram clipping.
- Confirm the camera shows a local gameplay area instead of fitting the whole map to screen.

- [x] **Step 5: Record final progress**

Update this plan:

- Check off completed Task 4 steps.
- Set `Execution State.Status` to `completed-but-open`.
- Set `Execution State.Current Focus` to `Review and push`.
- Set `Execution State.Next Step` to `Run final code review and push/close according to project governance.`
- Append a `Progress Log` entry with all verification commands and browser result.

## Exit Check

- [x] Runtime map3 export has `hexTerrainScale = 138`.
- [x] Runtime map3 export is one-to-one with map3 generated cells unless explicitly documented filler cells are added.
- [x] No map3 export path projects into old `8509`-cell grid.
- [x] Renderer does not use `coordinateSystem.hexTerrainScale / HEX_TERRAIN_SCALE` as map-size compensation.
- [x] Terrain UV/hex/world conversions use the loaded coordinate service.
- [x] Shoreline generation does not use default 138 helpers on runtime-grid paths.
- [x] map3 water/land overrides are visible in runtime data and WebGL.
- [x] City/village coordinates are derived from map3/editor cells.
- [x] Browser verification shows no old-grid parallelogram clipping.
- [x] Project progress sync is updated if this child becomes the active governance target.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded
- [x] Final re-review completed
- [ ] Push/closeout handled according to governance

## Child Closeout

- Closed Child: `Campaign Hex Runtime Grid Architecture`
- Parent Task: `Map Renderer Architecture`
- Parent Stage: `Map Renderer Architecture`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `yes`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `Run final review, push, and close only after all verification and remote push succeed.`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-28-campaign-hex-runtime-grid-architecture-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, then this plan, and resume at the first unchecked task.`



