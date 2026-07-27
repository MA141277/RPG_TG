## Task 1: Terrain Cloud Projection Uniform Boundary

**Files:**
- Modify: `src/ui/views/map/campaign-terrain-webgl.ts`
- Modify: `src/ui/views/map/campaign-cloud-webgl.ts`
- Test: `tests/robustness.test.cjs`
- Read: `src/ui/views/map/campaign-cloud-reveal-mask.ts`
- Read: `src/ui/views/map/shaders/campaign-cloud.frag.glsl`

**Interfaces:**
- Consumes: `getCampaignTerrainCameraTiltRadiansForScale(scale: number): number`
- Consumes: `getCampaignTerrainMapCoupledCamera(): CampaignTerrainCamera`
- Produces: `export type CampaignTerrainCloudProjectionUniforms = { cameraScale: number; cameraOffsetX: number; cameraOffsetY: number; tiltRadians: number; viewportAspectRatio: number; terrainScale: number; heightScale: number; cameraReferenceScale: number; cameraBaseDistance: number; }`
- Produces: `export function getCampaignTerrainCloudProjectionUniforms(root: ParentNode): CampaignTerrainCloudProjectionUniforms`
- Produces shader uniforms in `campaign-cloud-webgl.ts`: `uCloudCamera`, `uCloudProjection`

- [ ] **Step 1: Write the failing boundary test**

Add this test near the existing campaign cloud tests in `tests/robustness.test.cjs`:

```js
test("campaign cloud map-space volumetric slab uses terrain projection uniforms without gameplay coupling", () => {
  const terrainSource = readSource("src/ui/views/map/campaign-terrain-webgl.ts");
  const cloudSource = readSource("src/ui/views/map/campaign-cloud-webgl.ts");
  const shaderSource = readSource("src/ui/views/map/shaders/campaign-cloud.frag.glsl");
  const revealMaskSource = readSource("src/ui/views/map/campaign-cloud-reveal-mask.ts");
  const mainSource = readSource("src/main.ts");

  assert.match(
    terrainSource,
    /export type CampaignTerrainCloudProjectionUniforms/,
    "Expected terrain renderer to expose a typed, read-only cloud projection payload."
  );
  assert.match(
    terrainSource,
    /export function getCampaignTerrainCloudProjectionUniforms/,
    "Expected cloud projection data to be read from terrain renderer instead of recomputed in cloud renderer."
  );
  assert.match(
    cloudSource,
    /getCampaignTerrainCloudProjectionUniforms/,
    "Expected cloud renderer to consume terrain-owned projection uniforms."
  );
  assert.match(
    cloudSource,
    /uCloudCamera/,
    "Expected cloud renderer to upload camera-specific map-space cloud uniforms."
  );
  assert.match(
    cloudSource,
    /uCloudProjection/,
    "Expected cloud renderer to upload projection-specific map-space cloud uniforms."
  );
  assert.doesNotMatch(
    cloudSource,
    /sampleHeightAtUv|mapHeightUrl|data-map-height|map_heights/,
    "Cloud renderer must not sample terrain height data."
  );
  assert.match(
    revealMaskSource,
    /projectCampaignTerrainUvToClientPointAtCloudRevealHeight/,
    "Reveal mask must keep using the fixed cloud reveal height projection helper."
  );
  assert.doesNotMatch(
    mainSource,
    /getCampaignTerrainCloudProjectionUniforms|uCloudCamera|uCloudProjection|CampaignTerrainCloudProjectionUniforms/,
    "main.ts must not participate in cloud projection wiring."
  );
  assert.match(
    shaderSource,
    /MAX_MAP_SPACE_CLOUD_STEPS/,
    "Expected shader to declare an explicit bounded map-space cloud raymarch step budget."
  );
});
```

- [ ] **Step 2: Run the targeted test and confirm it fails**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign cloud map-space volumetric slab uses terrain projection uniforms" tests/robustness.test.cjs }
```

Expected:

- `FAIL` because `CampaignTerrainCloudProjectionUniforms`, `getCampaignTerrainCloudProjectionUniforms`, `uCloudCamera`, `uCloudProjection`, and `MAX_MAP_SPACE_CLOUD_STEPS` are not implemented yet.

- [ ] **Step 3: Add terrain projection helper**

In `src/ui/views/map/campaign-terrain-webgl.ts`, add the exported type near other campaign terrain export types and add the exported function near `getCampaignTerrainMapCoupledCamera()`:

```ts
export type CampaignTerrainCloudProjectionUniforms = {
  cameraScale: number;
  cameraOffsetX: number;
  cameraOffsetY: number;
  tiltRadians: number;
  viewportAspectRatio: number;
  terrainScale: number;
  heightScale: number;
  cameraReferenceScale: number;
  cameraBaseDistance: number;
};
```

```ts
export function getCampaignTerrainCloudProjectionUniforms(
  root: ParentNode
): CampaignTerrainCloudProjectionUniforms {
  const terrainCanvas = root.querySelector<HTMLCanvasElement>("[data-campaign-map-terrain]");
  const mapCoupledCamera = getCampaignTerrainMapCoupledCamera();
  const viewportAspectRatio =
    terrainCanvas == null
      ? 1
      : terrainCanvas.width / Math.max(terrainCanvas.height, 1);

  return {
    cameraScale: currentCamera.scale,
    cameraOffsetX: mapCoupledCamera.offsetX,
    cameraOffsetY: mapCoupledCamera.offsetY,
    tiltRadians: getCampaignTerrainCameraTiltRadians(currentCamera),
    viewportAspectRatio,
    terrainScale: TERRAIN_SCALE,
    heightScale: HEIGHT_SCALE,
    cameraReferenceScale: CAMERA_REFERENCE_SCALE,
    cameraBaseDistance: CAMERA_BASE_DISTANCE,
  };
}
```

This helper must only read camera/canvas constants. It must not read `activeRenderers`, chunks, travel grids, height samples, or material semantic models.

- [ ] **Step 4: Wire cloud projection uniforms through the cloud renderer**

In `src/ui/views/map/campaign-cloud-webgl.ts`:

1. Import `getCampaignTerrainCloudProjectionUniforms`.
2. Add uniform locations for `uCloudCamera` and `uCloudProjection`.
3. Add both uniforms to the existing missing-resource check.
4. During `render()`, call `getCampaignTerrainCloudProjectionUniforms(resolveProjectionRoot())` and upload:

```ts
const cloudProjection = getCampaignTerrainCloudProjectionUniforms(resolveProjectionRoot());
gl.uniform4f(
  cloudCameraLocation,
  cloudProjection.cameraScale,
  cloudProjection.cameraOffsetX,
  cloudProjection.cameraOffsetY,
  cloudProjection.tiltRadians
);
gl.uniform4f(
  cloudProjectionLocation,
  cloudProjection.viewportAspectRatio,
  cloudProjection.terrainScale,
  cloudProjection.heightScale,
  cloudProjection.cameraBaseDistance / Math.max(cloudProjection.cameraReferenceScale, 0.0001)
);
```

- [ ] **Step 5: Add forward shader declarations for Task 2**

In `src/ui/views/map/shaders/campaign-cloud.frag.glsl`, add:

```glsl
uniform vec4 uCloudCamera;
uniform vec4 uCloudProjection;

const int MAX_MAP_SPACE_CLOUD_STEPS = 12;
```

Do not change visible cloud rendering in this task.

- [ ] **Step 6: Run targeted cloud boundary tests**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign cloud map-space volumetric slab|campaign cloud render keeps flowing cloud animation timing|campaign cloud freezes animation during map drag and zoom|campaign cloud stays frozen briefly after repeated zoom input stops|campaign fog exploration stays active without the removed shader renderer" tests/robustness.test.cjs }
```

Expected:

- `PASS` for the new boundary test and existing cloud lifecycle tests.

- [ ] **Step 7: Commit Task 1**

Run:

```powershell
git add src/ui/views/map/campaign-terrain-webgl.ts src/ui/views/map/campaign-cloud-webgl.ts src/ui/views/map/shaders/campaign-cloud.frag.glsl tests/robustness.test.cjs docs/superpowers/plans/2026-07-26-campaign-map-space-volumetric-cloud-plan.md
git commit -m "feat: expose campaign cloud projection uniforms"
```

Expected:

- Commit succeeds.

- [ ] **Step 8: Sync progress and governance state**

Update this plan:

- Mark Task 1 checkboxes complete.
- Set `Execution State.Current Focus` to `Task 2: implement map-space cloud slab shader`.
- Set `Execution State.Next Step` to `Dispatch Task 2 implementer subagent.`
- Append a `Progress Log` entry with the commit id and targeted test command/result.

