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

## Execution State

- Current Focus: `Task 3: Runtime-grid coordinate cleanup`

## Progress Log

- 2026-07-28: Added the Task 2 robustness contract in `tests/robustness.test.cjs`, confirmed the red failure with `node --test --test-name-pattern "campaign terrain renderer uses loaded hex point bounds" tests\robustness.test.cjs`, implemented the renderer coordinate service in `src/ui/views/map/campaign-terrain-webgl.ts`, then verified green with the same focused test plus `npm run typecheck --silent`.

