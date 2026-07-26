# Campaign Map-Space Volumetric Cloud Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the campaign map's primarily screen-space cloud body with a conservative map-space volumetric cloud slab that stays visually aligned with the 3D Hex terrain.

**Architecture:** Keep clouds as a UI overlay owned by `campaign-cloud-webgl.ts`. Add a read-only terrain projection uniform helper in `campaign-terrain-webgl.ts`, pass those uniforms to `campaign-cloud.frag.glsl`, and raymarch a small fixed-budget cloud slab in terrain/map space while preserving the existing Hex reveal mask and dissolve lifecycle.

**Tech Stack:** TypeScript, raw GLSL imports through Vite, WebGL 1 uniforms, Node test runner, `tests/robustness.test.cjs`, browser runtime verification, `npm run build:test`, `npm run typecheck`, `npm run build`, `npm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-26`
- Current Focus: `Final-review fixes complete locally; review/push remain before closeout.`
- Next Step: `Review final diff and push when requested; do not mark closed while remote push is absent and known child 27 baseline remains unresolved.`
- Verification: `Final-review RED: npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign cloud map-space volumetric slab|campaign cloud pan basis" tests/robustness.test.cjs } failed as expected on missing cameraOffsetUnit projection payload; GREEN: npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign cloud map-space volumetric slab|campaign cloud render keeps flowing cloud animation timing|campaign cloud freezes animation during map drag and zoom|campaign cloud stays frozen briefly after repeated zoom input stops|campaign fog exploration stays active without the removed shader renderer" tests/robustness.test.cjs } passed 6/6 tests with 0 failures; npm run typecheck passed via tsc --noEmit -p tsconfig.json; npm run build passed with exit code 0 and existing Vite asset/chunk warnings.`
- Notes: `The prior campaign fort/city renderer child remains completed-but-open because remote push is absent and the known child 27 baseline issue is unresolved. This child is user-promoted as new active work and must not mark the prior child closed.`

## Progress Log

- 2026-07-26
  - Summary: `Opened the campaign map-space volumetric cloud child after user selected the conservative map-space slab option and requested subagent-driven execution.`
  - Verification: `npm run lint:plans passed for 69 files.`
  - Next: `Execute Task 1 with a fresh subagent.`
- 2026-07-26
  - Summary: `Completed Task 1 terrain cloud projection uniform boundary in commit c2f42734aac9040ca58bd18d3a4168086dd85cdc: terrain now exposes a read-only cloud projection payload, cloud WebGL uploads uCloudCamera/uCloudProjection, and the shader declares MAX_MAP_SPACE_CLOUD_STEPS without replacing visible cloud rendering.`
  - Verification: `RED: npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign cloud map-space volumetric slab uses terrain projection uniforms" tests/robustness.test.cjs } failed as expected on missing CampaignTerrainCloudProjectionUniforms. GREEN: npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign cloud map-space volumetric slab|campaign cloud render keeps flowing cloud animation timing|campaign cloud freezes animation during map drag and zoom|campaign cloud stays frozen briefly after repeated zoom input stops|campaign fog exploration stays active without the removed shader renderer" tests/robustness.test.cjs } passed 5/5 tests.`
  - Next: `Dispatch Task 2 implementer subagent.`
- 2026-07-26
  - Summary: `Completed Task 2 conservative map-space cloud slab shader path in commit 5d8e051e: the shader now reconstructs a terrain-owned map-space ray, intersects a finite cloud slab, samples procedural map-space density, raymarches with the fixed 12-step budget, and routes the primary cloud body through that volume while preserving the reveal/dissolve mask composition.`
  - Verification: `RED: npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign cloud map-space volumetric slab uses terrain projection uniforms" tests/robustness.test.cjs } failed as expected on missing buildMapSpaceCloudRay. GREEN: npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign cloud map-space volumetric slab|campaign cloud render keeps flowing cloud animation timing|campaign cloud freezes animation during map drag and zoom|campaign cloud stays frozen briefly after repeated zoom input stops|campaign fog exploration stays active without the removed shader renderer" tests/robustness.test.cjs } passed 5/5 tests with 0 failures; npm run typecheck passed via tsc --noEmit -p tsconfig.json.`
  - Next: `Dispatch Task 3 implementer subagent.`
- 2026-07-26
  - Summary: `Completed Task 3 final verification, Edge/Playwright visual QA, changelog update, project-progress sync, and completed-but-open governance state for the campaign map-space volumetric cloud child.`
  - Verification: `npm run lint:plans` passed for 69 files; `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign cloud map-space volumetric slab|campaign cloud render keeps flowing cloud animation timing|campaign cloud freezes animation during map drag and zoom|campaign cloud stays frozen briefly after repeated zoom input stops|campaign fog exploration stays active without the removed shader renderer" tests/robustness.test.cjs }` passed 5/5 tests with 0 failures; `npm run typecheck` passed; `npm run build` passed with exit code 0 and existing Vite asset/chunk warnings; browser visual QA used Edge through Playwright on `http://127.0.0.1:5173/`, reached `[data-campaign-map-terrain]` and `[data-campaign-map-cloud]` with `is-ready` classes/nonzero dimensions, panned and zoomed the map, confirmed the captured PNG shows nonblank cloud body, terrain visible below cloud, revealed Hex holes aligned around explored terrain, and HUD/task UI above the cloud layer; screenshot: `D:\RPG_TG\.tmp\campaign-map-space-volumetric-cloud.png`.
  - Next: `Review final diff and push when requested; do not mark closed while remote push is absent and known child 27 baseline remains unresolved.`
- 2026-07-26
  - Summary: `Addressed final-review cloud alignment findings by extending the terrain-owned cloud projection payload with cameraOffsetUnit and fovRadians, uploading uCloudView, reconstructing shader rays through terrain screen scale/perspective/tilt/pan/terrainScale math, using heightScale for the cloud slab, removing the no-op projection uniform retention, and adding a numeric pan-basis regression.`
  - Verification: `RED: npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign cloud map-space volumetric slab|campaign cloud pan basis" tests/robustness.test.cjs } failed as expected on missing cameraOffsetUnit projection payload; GREEN: npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign cloud map-space volumetric slab|campaign cloud render keeps flowing cloud animation timing|campaign cloud freezes animation during map drag and zoom|campaign cloud stays frozen briefly after repeated zoom input stops|campaign fog exploration stays active without the removed shader renderer" tests/robustness.test.cjs } passed 6/6 tests with 0 failures; npm run typecheck passed; npm run build passed with existing Vite asset/chunk warnings.`
  - Next: `Commit final-review fixes, keep the child completed-but-open, then push/review before closeout.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-26-campaign-map-space-volumetric-cloud-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current branch is `codex/sync-naqishuo-721ui-to-mmz`.
  - Current cloud body in `src/ui/views/map/shaders/campaign-cloud.frag.glsl` still builds cloud space from viewport UV plus camera-coupled offset through `buildMapCoupledSpace`.
  - Current reveal mask has already been extracted to `src/ui/views/map/campaign-cloud-reveal-mask.ts` and projects explored Hex polygons through `projectCampaignTerrainUvToClientPointAtCloudRevealHeight`.
  - Current terrain renderer exposes `getCampaignTerrainMapCoupledCamera()` and projection helpers, but it does not yet expose a dedicated cloud slab projection uniform payload.
  - The existing cloud lifecycle already preserves reveal transitions, interaction freeze, terrain chunk loading holds, and `window.rpgCloud`; this child must preserve those behaviors.

## Implementation Scope

### In Scope

- Add a read-only `CampaignTerrainCloudProjectionUniforms` helper in `campaign-terrain-webgl.ts`.
- Pass cloud projection uniforms from `campaign-cloud-webgl.ts` to `campaign-cloud.frag.glsl`.
- Replace the main cloud body density generation with a conservative 8-16 step terrain/map-space slab raymarch.
- Preserve existing reveal texture upload, previous reveal dissolve texture, terrain loading hold, animation freeze, render downsampling, and debug `window.rpgCloud` behavior.
- Add source-level regression tests that lock renderer ownership and shader feature expectations.
- Run targeted, type, build, lint, and browser visual verification.

### Still Out Of Scope

- Cesium sphere-shell cloud model.
- Scene depth texture reconstruction.
- Sampling terrain height inside the cloud renderer.
- New gameplay, exploration, navigation, save data, or map node state.
- New `src/main.ts` cloud branches.
- Large 3D cloud textures or new engine visual assets.
- Physical multi-scattering or a cloud parameter UI.
- Closing the prior campaign fort/city model renderer child.

## File Map

### Existing files to modify

- `src/ui/views/map/campaign-terrain-webgl.ts`
  - Add a read-only cloud projection uniform helper derived from existing camera, tilt, scale, and projection constants.
- `src/ui/views/map/campaign-cloud-webgl.ts`
  - Query the helper during render and upload uniforms to the cloud shader.
- `src/ui/views/map/shaders/campaign-cloud.frag.glsl`
  - Add terrain-aligned slab raymarching and keep reveal/dissolve composition.
- `tests/robustness.test.cjs`
  - Add source-level contracts for cloud projection uniforms, no terrain height sampling in cloud code, no `main.ts` cloud branch, and shader raymarch budget.
- `docs/superpowers/project-progress.md`
  - Record this child as current active work.
- `docs/superpowers/plans/2026-07-26-campaign-map-space-volumetric-cloud-plan.md`
  - Keep checkboxes, execution state, and progress log synchronized.

### Existing files expected to be deleted

- None.

### New files to create

- None.

## Verification Plan

- Targeted verification:
  - `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign cloud map-space volumetric slab|campaign cloud render keeps flowing cloud animation timing|campaign cloud freezes animation during map drag and zoom|campaign cloud stays frozen briefly after repeated zoom input stops|campaign fog exploration stays active without the removed shader renderer" tests/robustness.test.cjs }`
- Required commands:
  - `npm run lint:plans`
  - `npm run typecheck`
  - `npm run build`
- Browser verification:
  - Start or reuse `npm run dev` on `http://127.0.0.1:5173/`.
  - Open the campaign map in Edge/Playwright.
  - Confirm terrain and cloud canvases are ready.
  - Pan and zoom the campaign map and confirm cloud bodies remain visually anchored to the 3D terrain instead of swimming only in screen space.
  - Confirm revealed Hex holes remain aligned and dissolve smoothly.
  - Capture a screenshot under `.tmp/`.
- Known baseline risk:
  - Full `npm test` may still fail only the known unrelated child 27 startup coordinator test. If full suite is run and fails this way, record expected/actual exactly and keep this child `completed-but-open`, not `closed`.

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

- [x] **Step 1: Write the failing boundary test**

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

- [x] **Step 2: Run the targeted test and confirm it fails**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign cloud map-space volumetric slab uses terrain projection uniforms" tests/robustness.test.cjs }
```

Expected:

- `FAIL` because `CampaignTerrainCloudProjectionUniforms`, `getCampaignTerrainCloudProjectionUniforms`, `uCloudCamera`, `uCloudProjection`, and `MAX_MAP_SPACE_CLOUD_STEPS` are not implemented yet.

- [x] **Step 3: Add terrain projection helper**

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

- [x] **Step 4: Wire cloud projection uniforms through the cloud renderer**

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

- [x] **Step 5: Add forward shader declarations for Task 2**

In `src/ui/views/map/shaders/campaign-cloud.frag.glsl`, add:

```glsl
uniform vec4 uCloudCamera;
uniform vec4 uCloudProjection;

const int MAX_MAP_SPACE_CLOUD_STEPS = 12;
```

Do not change visible cloud rendering in this task.

- [x] **Step 6: Run targeted cloud boundary tests**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign cloud map-space volumetric slab|campaign cloud render keeps flowing cloud animation timing|campaign cloud freezes animation during map drag and zoom|campaign cloud stays frozen briefly after repeated zoom input stops|campaign fog exploration stays active without the removed shader renderer" tests/robustness.test.cjs }
```

Expected:

- `PASS` for the new boundary test and existing cloud lifecycle tests.

- [x] **Step 7: Commit Task 1**

Run:

```powershell
git add src/ui/views/map/campaign-terrain-webgl.ts src/ui/views/map/campaign-cloud-webgl.ts src/ui/views/map/shaders/campaign-cloud.frag.glsl tests/robustness.test.cjs docs/superpowers/plans/2026-07-26-campaign-map-space-volumetric-cloud-plan.md
git commit -m "feat: expose campaign cloud projection uniforms"
```

Expected:

- Commit succeeds.

- [x] **Step 8: Sync progress and governance state**

Update this plan:

- Mark Task 1 checkboxes complete.
- Set `Execution State.Current Focus` to `Task 2: implement map-space cloud slab shader`.
- Set `Execution State.Next Step` to `Dispatch Task 2 implementer subagent.`
- Append a `Progress Log` entry with the commit id and targeted test command/result.

## Task 2: Conservative Map-Space Volumetric Cloud Slab Shader

**Files:**
- Modify: `src/ui/views/map/shaders/campaign-cloud.frag.glsl`
- Test: `tests/robustness.test.cjs`
- Read: `src/ui/views/map/campaign-cloud-webgl.ts`
- Read: `src/ui/views/map/campaign-terrain-webgl.ts`

**Interfaces:**
- Consumes: shader uniforms `uCloudCamera` and `uCloudProjection`
- Consumes: `MAX_MAP_SPACE_CLOUD_STEPS = 12`
- Produces: GLSL functions `buildMapSpaceCloudRay`, `intersectMapSpaceCloudSlab`, `sampleMapSpaceCloudDensity`, `sampleMapSpaceVolumetricCloud`

- [x] **Step 1: Strengthen the shader contract test**

Extend the Task 1 test in `tests/robustness.test.cjs` with these assertions:

```js
  assert.match(
    shaderSource,
    /buildMapSpaceCloudRay/,
    "Expected shader to reconstruct a map-space cloud ray."
  );
  assert.match(
    shaderSource,
    /intersectMapSpaceCloudSlab/,
    "Expected shader to intersect the view ray with a finite cloud slab."
  );
  assert.match(
    shaderSource,
    /sampleMapSpaceCloudDensity/,
    "Expected shader density to be sampled from map-space coordinates."
  );
  assert.match(
    shaderSource,
    /sampleMapSpaceVolumetricCloud/,
    "Expected shader to render the cloud body through the map-space slab path."
  );
  assert.match(
    shaderSource,
    /for \(int stepIndex = 0; stepIndex < MAX_MAP_SPACE_CLOUD_STEPS; stepIndex \+= 1\)/,
    "Expected raymarching to use a fixed bounded WebGL 1 loop."
  );
  assert.doesNotMatch(
    shaderSource,
    /#define MAXIMUM_CLOUDS_STEPS 300|CLOUDS_MAX_VIEWING_DISTANCE 250000/,
    "Expected this project not to copy the Cesium-scale high-step sphere-shell cloud budget."
  );
```

- [x] **Step 2: Run the targeted test and confirm it fails**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign cloud map-space volumetric slab uses terrain projection uniforms" tests/robustness.test.cjs }
```

Expected:

- `FAIL` because the shader functions are not implemented yet.

- [x] **Step 3: Implement ray and slab helpers**

In `campaign-cloud.frag.glsl`, add helpers before `sampleArticleCloudSea`:

```glsl
const float MAP_SPACE_CLOUD_BOTTOM = 0.090;
const float MAP_SPACE_CLOUD_TOP = 0.245;
const float MAP_SPACE_CLOUD_DENSITY_SCALE = 1.18;
const float MAP_SPACE_CLOUD_ALPHA_LIMIT = 0.965;
const vec2 MAP_SPACE_CLOUD_WIND = vec2(0.018, -0.011);

struct MapSpaceCloudRay {
  vec3 origin;
  vec3 direction;
};

MapSpaceCloudRay buildMapSpaceCloudRay(vec2 uv) {
  float aspect = max(uCloudProjection.x, 0.1);
  float safeScale = max(uCloudCamera.x, 0.1);
  float tilt = uCloudCamera.w;
  vec2 screen = (uv - 0.5) * vec2(aspect, 1.0);
  vec2 mapCenter = vec2(0.5) + vec2(uCloudCamera.y, -uCloudCamera.z) * 0.0025;
  vec2 mapPoint = mapCenter + screen / max(safeScale / 15.0, 0.25);
  float cameraHeight = max(uCloudProjection.w, 0.1) + 0.42;
  vec3 origin = vec3(mapPoint, cameraHeight);
  vec3 direction = normalize(vec3(screen.x * 0.12, -sin(tilt) - screen.y * 0.10, -cos(tilt)));

  return MapSpaceCloudRay(origin, direction);
}

vec2 intersectMapSpaceCloudSlab(MapSpaceCloudRay ray) {
  if (abs(ray.direction.z) < 0.0001) {
    return vec2(-1.0);
  }

  float tBottom = (MAP_SPACE_CLOUD_BOTTOM - ray.origin.z) / ray.direction.z;
  float tTop = (MAP_SPACE_CLOUD_TOP - ray.origin.z) / ray.direction.z;
  float tEnter = max(min(tBottom, tTop), 0.0);
  float tExit = max(tBottom, tTop);

  if (tExit <= tEnter) {
    return vec2(-1.0);
  }

  return vec2(tEnter, tExit);
}
```

The implementation may tune constants to compile cleanly and match existing visual scale, but it must keep the conservative 12-step budget and finite slab model.

- [x] **Step 4: Implement density and accumulation helpers**

Add these helpers after the slab functions:

```glsl
float sampleMapSpaceCloudDensity(vec3 point, float time) {
  float heightRatio = clamp(
    (point.z - MAP_SPACE_CLOUD_BOTTOM) /
      max(MAP_SPACE_CLOUD_TOP - MAP_SPACE_CLOUD_BOTTOM, 0.0001),
    0.0,
    1.0
  );
  vec2 wind = MAP_SPACE_CLOUD_WIND * time;
  vec3 noisePoint = vec3(point.xy * 2.35 + wind, point.z * 3.0);
  float broad = proceduralFbm(noisePoint.xy + vec2(noisePoint.z * 0.37, -noisePoint.z * 0.21));
  float billowed = billow(proceduralFbm(noisePoint.xy * 2.15 + vec2(noisePoint.z * 0.51, noisePoint.z * 0.28)));
  float detail = textureFbm(noisePoint.xy * (3.80 * CLOUD_TEXTURE_SAMPLE_SCALE) + wind * 1.7);
  float heightEnvelope = smoothstep(0.0, 0.25, heightRatio) * (1.0 - smoothstep(0.76, 1.0, heightRatio));
  float density = broad * 0.50 + billowed * 0.32 + detail * 0.18;

  return clamp((density - 0.43) * MAP_SPACE_CLOUD_DENSITY_SCALE * heightEnvelope, 0.0, 1.0);
}

vec4 sampleMapSpaceVolumetricCloud(vec2 uv, float time) {
  MapSpaceCloudRay ray = buildMapSpaceCloudRay(uv);
  vec2 segment = intersectMapSpaceCloudSlab(ray);
  if (segment.x < 0.0) {
    return vec4(0.0);
  }

  float segmentLength = segment.y - segment.x;
  float stepSize = segmentLength / float(MAX_MAP_SPACE_CLOUD_STEPS);
  vec3 accumulatedColor = vec3(0.0);
  float accumulatedAlpha = 0.0;

  for (int stepIndex = 0; stepIndex < MAX_MAP_SPACE_CLOUD_STEPS; stepIndex += 1) {
    float stepRatio = (float(stepIndex) + 0.5) / float(MAX_MAP_SPACE_CLOUD_STEPS);
    vec3 point = ray.origin + ray.direction * (segment.x + stepSize * (float(stepIndex) + 0.5));
    float density = sampleMapSpaceCloudDensity(point, time);
    float heightRatio = clamp((point.z - MAP_SPACE_CLOUD_BOTTOM) / max(MAP_SPACE_CLOUD_TOP - MAP_SPACE_CLOUD_BOTTOM, 0.0001), 0.0, 1.0);
    float shadow = smoothstep(0.18, 0.88, density) * (1.0 - heightRatio * 0.36);
    vec3 bottomColor = vec3(0.56, 0.65, 0.66);
    vec3 midColor = vec3(0.84, 0.90, 0.88);
    vec3 topColor = vec3(1.0, 0.99, 0.93);
    vec3 stepColor = mix(bottomColor, topColor, heightRatio);
    stepColor = mix(stepColor, midColor, 0.26 + stepRatio * 0.18);
    stepColor = mix(stepColor, bottomColor, shadow * 0.44);
    float stepAlpha = clamp(density * 0.22 * (1.0 - accumulatedAlpha), 0.0, 1.0);

    accumulatedColor += stepColor * stepAlpha;
    accumulatedAlpha += stepAlpha;
    if (accumulatedAlpha >= MAP_SPACE_CLOUD_ALPHA_LIMIT) {
      break;
    }
  }

  return vec4(accumulatedColor / max(accumulatedAlpha, 0.001), clamp(accumulatedAlpha, 0.0, 1.0));
}
```

- [x] **Step 5: Route existing cloud body through map-space volume while preserving reveal**

In `sampleArticleCloudSea`, replace the old body cloud source with `sampleMapSpaceVolumetricCloud(uv, time)` while preserving:

- `sampleDissolvedRevealFields`
- `computeArticleMaskOffsetAndErosion`
- `ARTICLE_EDGE_CLEAR_VALUES`
- `ARTICLE_CORE_CLEAR_VALUES`
- reveal dissolve logic
- final reveal clear / isolated cloud keep behavior

The final visible cloud can still blend the map-space body with the existing outer puff helper if it remains masked by the reveal field. It must not return a fully screen-space `sampleArticleFlowingCloud` body as the primary cloud sea.

- [x] **Step 6: Run targeted tests**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign cloud map-space volumetric slab|campaign cloud render keeps flowing cloud animation timing|campaign cloud freezes animation during map drag and zoom|campaign cloud stays frozen briefly after repeated zoom input stops|campaign fog exploration stays active without the removed shader renderer" tests/robustness.test.cjs }
```

Expected:

- `PASS` for new shader contract and existing lifecycle tests.

- [x] **Step 7: Run typecheck**

Run:

```powershell
npm run typecheck
```

Expected:

- `PASS`.

- [x] **Step 8: Commit Task 2**

Run:

```powershell
git add src/ui/views/map/shaders/campaign-cloud.frag.glsl tests/robustness.test.cjs docs/superpowers/plans/2026-07-26-campaign-map-space-volumetric-cloud-plan.md
git commit -m "feat: render campaign clouds in map space"
```

Expected:

- Commit succeeds.

- [x] **Step 9: Sync progress and governance state**

Update this plan:

- Mark Task 2 checkboxes complete.
- Set `Execution State.Current Focus` to `Task 3: verification and visual QA`.
- Set `Execution State.Next Step` to `Dispatch Task 3 implementer subagent.`
- Append a `Progress Log` entry with the commit id and targeted/typecheck results.

## Task 3: Verification, Visual QA, And Governance Sync

**Files:**
- Modify: `docs/superpowers/plans/2026-07-26-campaign-map-space-volumetric-cloud-plan.md`
- Modify: `docs/superpowers/project-progress.md`
- Modify: `docs/change-log.md`
- Read: `package.json`
- Read: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes: completed Task 1 and Task 2 commits
- Produces: screenshot `.tmp/campaign-map-space-volumetric-cloud.png`
- Produces: plan `Execution State.Status = completed-but-open` unless push and closeout are explicitly completed

- [x] **Step 1: Run plan lint**

Run:

```powershell
npm run lint:plans
```

Expected:

- `PASS`.

- [x] **Step 2: Run targeted cloud tests**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign cloud map-space volumetric slab|campaign cloud render keeps flowing cloud animation timing|campaign cloud freezes animation during map drag and zoom|campaign cloud stays frozen briefly after repeated zoom input stops|campaign fog exploration stays active without the removed shader renderer" tests/robustness.test.cjs }
```

Expected:

- `PASS`.

- [x] **Step 3: Run typecheck and production build**

Run:

```powershell
npm run typecheck
npm run build
```

Expected:

- `PASS`.
- Existing Vite warnings are acceptable only if the build exits with code `0`.

- [x] **Step 4: Start or reuse the dev server**

Run:

```powershell
npm run dev -- --host 127.0.0.1
```

Expected:

- Vite serves the app on a local port, usually `http://127.0.0.1:5173/`.
- If that port is occupied, use the printed Vite URL.

- [x] **Step 5: Browser visual verification**

Use Playwright or the available browser tooling to:

1. Open the Vite URL.
2. Start or load the default campaign flow.
3. Wait for `[data-campaign-map-terrain]` and `[data-campaign-map-cloud]`.
4. Confirm both canvases have ready classes or nonzero dimensions.
5. Pan and zoom the map.
6. Capture `.tmp/campaign-map-space-volumetric-cloud.png`.

Expected:

- Cloud canvas is nonblank.
- Terrain remains visible below cloud.
- Cloud holes remain aligned to explored Hexes.
- Cloud body does not visually behave like a purely fixed screen texture during pan/zoom.
- Markers, hover overlays, and debug/global UI remain above the cloud layer.

- [x] **Step 6: Update change log**

Append a dated entry near the top of `docs/change-log.md`:

```md
## 2026-07-26 Campaign Map-Space Volumetric Cloud Slab

- `campaign-cloud-webgl.ts` now uploads terrain-owned cloud projection uniforms so the cloud shader can render the campaign cloud body in terrain/map space while preserving the existing reveal texture lifecycle.
- `campaign-cloud.frag.glsl` replaces the primary screen-space cloud sea with a conservative fixed-budget map-space cloud slab raymarch using procedural density, wind drift, lightweight top/bottom lighting, and early alpha termination.
- The change keeps explored Hex reveal masks, drag/zoom animation freeze, terrain chunk reveal holds, and `window.rpgCloud` behavior within the existing cloud overlay boundary; it does not modify exploration state, terrain height, navigation, map nodes, save data, or `src/main.ts`.
```

- [x] **Step 7: Update project progress and plan state**

Update `docs/superpowers/project-progress.md`:

- `Current Task`: `Campaign Map-Space Volumetric Cloud`
- `Current Task Status`: `completed-but-open`
- `Current Child`: `Campaign Map-Space Volumetric Cloud`
- `Current Child Status`: `completed-but-open`
- `Next Required Action`: `review-and-push-campaign-map-space-volumetric-cloud`
- `Next Owner Document`: `docs/superpowers/plans/2026-07-26-campaign-map-space-volumetric-cloud-plan.md`
- `Push Status`: `not-pushed`
- `Push Commit`: `none`
- `Resume From`: `Open docs/superpowers/project-progress.md, then review and push docs/superpowers/plans/2026-07-26-campaign-map-space-volumetric-cloud-plan.md; do not close until push succeeds and the known child 27 baseline is accepted or resolved.`

Update this plan:

- Mark Task 3 checkboxes complete except closeout-only items.
- Set `Execution State.Status` to `completed-but-open`.
- Set `Execution State.Current Focus` to `Implementation and verification complete locally; review/push remain before closeout.`
- Set `Execution State.Next Step` to `Review final diff and push when requested; do not mark closed while remote push is absent and known child 27 baseline remains unresolved.`
- Set `Execution State.Verification` to the exact command results from Steps 1-5.
- Append a `Progress Log` entry with verification and screenshot path.

- [x] **Step 8: Commit Task 3**

Run:

```powershell
git add docs/superpowers/plans/2026-07-26-campaign-map-space-volumetric-cloud-plan.md docs/superpowers/project-progress.md docs/change-log.md .tmp/campaign-map-space-volumetric-cloud.png
git commit -m "docs: record campaign map-space cloud verification"
```

Expected:

- Commit succeeds.
- If `.tmp/` is ignored, do not force-add the screenshot; record its path in the plan progress log and commit the docs only.

## Exit Check

- [x] `campaign-cloud-webgl.ts` consumes terrain-owned cloud projection uniforms.
- [x] `campaign-cloud.frag.glsl` uses a bounded map-space cloud slab path for the primary cloud body.
- [x] Existing reveal mask projection, dissolve, interaction freeze, terrain chunk hold, and `window.rpgCloud` behavior are preserved.
- [x] Cloud renderer does not sample terrain height data or mutate exploration/navigation/gameplay state.
- [x] `src/main.ts` has no new cloud projection or cloud behavior branch.
- [x] Targeted cloud tests pass.
- [x] `npm run lint:plans` passes.
- [x] `npm run typecheck` passes.
- [x] `npm run build` passes.
- [x] Browser visual verification is recorded.
- [x] Project progress sync is updated if the child state changed.
- [ ] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Campaign Map-Space Volumetric Cloud`
- Parent Task: `Campaign Map-Space Volumetric Cloud`
- Parent Stage: `Map Renderer Architecture`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `yes`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `review-and-push-campaign-map-space-volumetric-cloud`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-26-campaign-map-space-volumetric-cloud-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, then review and push docs/superpowers/plans/2026-07-26-campaign-map-space-volumetric-cloud-plan.md; do not close until push succeeds and the known child 27 baseline is accepted or resolved.`
