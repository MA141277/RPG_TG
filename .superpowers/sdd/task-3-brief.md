## Task 3: Runtime-Grid Coordinate Cleanup

**Files:**
- Modify: `tests/robustness.test.cjs`
- Modify: `src/ui/views/map/campaign-terrain-webgl.ts`
- Modify if needed: `src/ui/views/map/shaders/campaign-terrain.frag.glsl`

**Interfaces:**
- Consumes: `CampaignTerrainCoordinateSystem` from Task 2.
- Produces: no map3 path that silently falls back to default 138 conversions for shoreline, chunk bounds, heights, vegetation, structures, actor, marker projection, click projection, or travel passability.

- [ ] **Step 1: Write the failing cleanup contract test**

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

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node --test --test-name-pattern "runtime grid paths do not use default hex conversion" tests\robustness.test.cjs
```

Expected:

- `FAIL` while default helper calls remain.

- [ ] **Step 3: Fix chunk and height sampling conversions**

In `createCampaignTerrainChunkData`, `createCampaignTerrainChunkGrid`, `createCampaignTerrainChunkHeightSamples`, and height smoothing functions, pass `materialSemanticModel.terrainCoordinates` or the raw coordinate system consistently into every `terrainUvToHexPoint` call.

Do not leave calls like:

```ts
terrainUvToHexPoint(u, v)
```

inside runtime-grid paths.

- [ ] **Step 4: Fix shoreline distance conversions**

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

- [ ] **Step 5: Fix marker, actor, vegetation, structure, click, and travel conversions**

Search:

```bash
rg -n "terrainUvToHexPoint\\([^,]+,[^,]+\\)|hexPointToTerrainU\\([^,]+\\)|hexPointToTerrainV\\([^,]+\\)" src\\ui\\views\\map\\campaign-terrain-webgl.ts
```

For each result in a runtime-grid path, pass the coordinate service. Leave default conversions only in legacy material-image fallback or clearly old-map-only helper code.

- [ ] **Step 6: Keep shader semantics aligned**

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

- [ ] **Step 7: Run task verification**

Run:

```bash
node --test --test-name-pattern "runtime grid paths do not use default hex conversion|loaded hex grid coordinate system|dynamic shoreline" tests\robustness.test.cjs
npm run typecheck --silent
```

Expected:

- Both commands pass.

- [ ] **Step 8: Sync progress**

Update this plan:

- Check off Task 3 completed steps.
- Set `Execution State.Current Focus` to `Task 4: Regeneration and runtime verification`.
- Append a `Progress Log` entry with commands run and result.

