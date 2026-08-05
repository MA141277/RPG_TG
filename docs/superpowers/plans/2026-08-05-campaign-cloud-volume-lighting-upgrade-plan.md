# Campaign Cloud Volume Lighting Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the existing campaign map cloud shader so the cloud layer reads less like a flat sheet and more like a lit, internally varied volume.

**Architecture:** Keep the current campaign cloud renderer boundary. The shader remains in `src/ui/views/map/shaders/campaign-cloud.frag.glsl`; `campaign-cloud-webgl.ts` changes only if a small sun/quality uniform is required; reveal masks, terrain projection, gameplay exploration, navigation, save state, and `src/main.ts` stay outside the implementation.

**Tech Stack:** TypeScript, raw GLSL imports through Vite, WebGL 1 shader constraints, Node test runner, `tests/robustness.test.cjs`, `npm run build:test`, `npm run typecheck`, `npm run build`, `npm run lint:plans`, browser visual verification through the local Vite app.

## Global Constraints

- The implementation must upgrade the existing campaign map cloud layer, not create a separate prototype renderer.
- `src/main.ts` must not receive new cloud behavior branches or shader logic.
- Cloud rendering must not mutate gameplay exploration, pathfinding, save data, map node state, terrain height generation, house systems, or playable systems.
- The existing explored-Hex reveal holes, reveal dissolve, interaction freeze, terrain chunk loading hold, texture-scale slider, and `window.rpgCloud` behavior must be preserved.
- The main cloud raymarch must stay bounded for WebGL 1. Raising the main step count is not the primary fix for flatness.
- Multiple scattering is a fill-light approximation only. It must not replace single scattering, light optical depth, or density structure.

---

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-08-05`
- Current Focus: `Implementation and verification complete locally; review/push remain before closeout.`
- Next Step: `Review final diff and push when requested; do not mark closed while remote push is absent.`
- Verification: `Task 4 GREEN after code-review fixes: npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign cloud volume lighting|campaign cloud map-space volumetric slab|campaign cloud reveal cutouts|campaign cloud shader reuses one map-space ray|campaign cloud density uses height layers|campaign cloud freezes animation during map drag and zoom|campaign cloud render keeps flowing cloud animation timing" tests/robustness.test.cjs } passed 9/9; npm run typecheck exited 0; npm run build exited 0 with existing Vite warnings; npm run lint:plans exited 0; git diff --check exited 0; browser visual QA reached campaign map with terrain/actor/cloud canvases ready, saved .tmp/campaign-cloud-volume-lighting-upgrade.png, and sampled the screenshot as 1280x720 with 9/9 nontransparent varied points.`
- Notes: `Do not mark this child closed until implementation verification, structured closeout, project-progress sync, and remote push success are recorded.`

## Progress Log

- 2026-08-05
  - Summary: `Created the implementation plan for upgrading the existing campaign cloud shader density, single scattering, and multiple-scattering fill-light path.`
  - Verification: `Pending npm run lint:plans after plan creation.`
  - Next: `Ask the user to choose Subagent-Driven or Inline Execution.`
- 2026-08-05
  - Summary: `Started inline execution and added red source-contract tests for campaign cloud density, lightmarch, single scattering, and multiple-scattering ownership.`
  - Verification: `RED: npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign cloud volume lighting" tests/robustness.test.cjs } failed as expected on missing sampleCloudBaseDistribution; boundary preservation test passed.`
  - Next: `Implement Task 2 shader density and curl-warped erosion helpers.`
- 2026-08-05
  - Summary: `Completed Task 2 shader density restructuring: broad Worley fBm distribution, curl-warped erosion, explicit height envelope, and the new sampleCloudDensity path now drive the existing map-space cloud raymarch. Because the Task 1 contract also required future lighting helpers, real unintegrated Beer-Lambert, phase, lightmarch, single-scattering, and multiple-scattering helper functions were added early for source-contract continuity.`
  - Verification: `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign cloud volume lighting|campaign cloud density uses height layers|campaign cloud map-space volumetric slab" tests/robustness.test.cjs } passed 5/5.`
  - Next: `Connect the existing single-scattering and light optical-depth helpers into sampleMapSpaceVolumetricCloud.`
- 2026-08-05
  - Summary: `Completed Task 3 by replacing the old height-color per-step lighting in sampleMapSpaceVolumetricCloud with light optical depth, Beer-Lambert transmittance, phase-based single scattering, and optical-depth alpha accumulation while preserving texture accumulation and reveal composition.`
  - Verification: `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign cloud volume lighting|campaign cloud reveal cutouts|campaign cloud shader reuses one map-space ray|campaign cloud render keeps flowing cloud animation timing" tests/robustness.test.cjs } passed 5/5.`
  - Next: `Add multiple-scattering fill, run full verification, update changelog, and perform browser visual QA.`
- 2026-08-05
  - Summary: `Completed Task 4 by adding the bounded multi-octave multiple-scattering fill into the existing map-space raymarch, updating the change log, syncing project progress, and capturing browser visual QA for the campaign map cloud layer.`
  - Verification: `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign cloud volume lighting|campaign cloud map-space volumetric slab|campaign cloud reveal cutouts|campaign cloud shader reuses one map-space ray|campaign cloud density uses height layers|campaign cloud freezes animation during map drag and zoom|campaign cloud render keeps flowing cloud animation timing" tests/robustness.test.cjs } passed 9/9; npm run typecheck exited 0; npm run build exited 0 with existing Vite warnings; npm run lint:plans exited 0; browser QA reached the campaign map, confirmed ready terrain/actor/cloud canvases, sampled the saved screenshot as 1280x720 with 9/9 nontransparent varied points, and saved .tmp/campaign-cloud-volume-lighting-upgrade.png.`
  - Next: `Review and push when requested; keep this child completed-but-open until remote push succeeds.`
- 2026-08-05
  - Summary: `Addressed code review findings before the Task 4 commit: the light optical-depth helper now reuses sampleCloudDensity with the same map-space ray and column point as the visible cloud body, and single scattering now uses current-step transmittance instead of multiplying accumulated alpha twice. Shader cost remains bounded but is recorded as residual lower-end GPU risk.`
  - Verification: `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign cloud volume lighting|campaign cloud map-space volumetric slab|campaign cloud reveal cutouts|campaign cloud shader reuses one map-space ray|campaign cloud density uses height layers|campaign cloud freezes animation during map drag and zoom|campaign cloud render keeps flowing cloud animation timing" tests/robustness.test.cjs } passed 9/9; npm run typecheck exited 0; npm run build exited 0 with existing Vite warnings; npm run lint:plans exited 0; git diff --check exited 0; browser QA reached the campaign map, confirmed ready terrain/actor/cloud canvases, sampled the saved screenshot as 1280x720 with 9/9 nontransparent varied points, and saved .tmp/campaign-cloud-volume-lighting-upgrade.png.`
  - Next: `Commit Task 4, then keep this child completed-but-open until remote push succeeds.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-08-05-campaign-cloud-volume-lighting-upgrade-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - Current cloud renderer ownership is still `src/ui/views/map/campaign-cloud-webgl.ts`.
  - Current visible cloud body is still composed through `src/ui/views/map/shaders/campaign-cloud.frag.glsl`.
  - Existing tests already lock map-space slab ray reconstruction, low main raymarch budget, texture scale, reveal alignment, density layering, interaction freeze, and no cloud logic in `src/main.ts`.
  - This plan extends those tests rather than replacing the existing cloud boundary tests.

## Implementation Scope

### In Scope

- Add source-level tests for explicit 3D density, curl-warped erosion, single scattering, lightmarch optical depth, Beer-Lambert transmittance, phase function, and multi-octave multiple scattering helpers.
- Reorganize `campaign-cloud.frag.glsl` density helpers so broad coverage, 3D Worley fBm, high-frequency erosion, and height envelopes are separate and testable by source contract.
- Add a low-budget sun-direction lightmarch and single-scattering accumulation inside the existing map-space cloud raymarch.
- Add a small multi-octave multiple-scattering fill term after single scattering is in place.
- Update `docs/change-log.md` after implementation verification.
- Record browser visual verification in this plan.

### Still Out Of Scope

- New standalone cloud preview page.
- New large 3D texture assets.
- Cesium-style sphere-shell atmosphere.
- Scene depth texture reconstruction.
- Terrain height sampling inside the cloud renderer.
- Gameplay, exploration, navigation, save, map node, house, playable, or `src/main.ts` changes.
- Closing unrelated completed-but-open tavern or previous cloud work.

## File Map

### Existing files to modify

- `tests/robustness.test.cjs`
  - Adds shader source-contract tests before shader implementation.
- `src/ui/views/map/shaders/campaign-cloud.frag.glsl`
  - Owns density field, erosion, optical-depth lighting, single scattering, and multiple-scattering fill.
- `src/ui/views/map/campaign-cloud-webgl.ts`
  - Modify only if implementation chooses a uniform for sun direction or quality. Prefer shader constants for the first pass if current visual direction is acceptable.
- `docs/change-log.md`
  - Records verified behavior after implementation.
- `docs/superpowers/plans/2026-08-05-campaign-cloud-volume-lighting-upgrade-plan.md`
  - Tracks execution state, checkboxes, verification, and closeout.
- `docs/superpowers/project-progress.md`
  - Update only when this plan becomes the active executable child or when implementation completes and governance state must sync.

### Existing files expected to be deleted

- None.

### New files to create

- None.

## Verification Plan

- Targeted source-contract and cloud lifecycle tests:
  - `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign cloud volume lighting|campaign cloud map-space volumetric slab|campaign cloud reveal cutouts|campaign cloud shader reuses one map-space ray|campaign cloud density uses height layers|campaign cloud freezes animation during map drag and zoom|campaign cloud render keeps flowing cloud animation timing" tests/robustness.test.cjs }`
- Required commands:
  - `npm run lint:plans`
  - `npm run typecheck`
  - `npm run build`
- Browser visual verification:
  - Start or reuse `npm run dev -- --host 127.0.0.1`.
  - Open the printed local Vite URL.
  - Reach the campaign map.
  - Wait for `[data-campaign-map-terrain]` and `[data-campaign-map-cloud]`.
  - Pan and zoom the map.
  - Capture `.tmp/campaign-cloud-volume-lighting-upgrade.png`.
  - Confirm the cloud layer is nonblank, terrain remains visible below it, reveal holes still align, thick cloud regions show internal light/shadow variation, and the result no longer reads primarily as a flat sheet.

## Task 1: Lock Density And Lighting Contracts

**Files:**
- Modify: `tests/robustness.test.cjs`
- Read: `src/ui/views/map/shaders/campaign-cloud.frag.glsl`
- Read: `src/ui/views/map/campaign-cloud-webgl.ts`
- Read: `src/main.ts`

**Interfaces:**
- Consumes: existing `readSource(path)` helper in `tests/robustness.test.cjs`.
- Produces: source-contract tests named `campaign cloud volume lighting uses explicit density and light transport helpers` and `campaign cloud volume lighting preserves renderer boundaries`.

- [x] **Step 1: Add the failing density and light transport test**

Add this test near the existing campaign cloud tests in `tests/robustness.test.cjs`, after the map-space volumetric slab test:

```js
test("campaign cloud volume lighting uses explicit density and light transport helpers", () => {
  const shaderSource = readSource("src/ui/views/map/shaders/campaign-cloud.frag.glsl");

  assert.match(
    shaderSource,
    /float sampleCloudBaseDistribution\(\s*vec3 point,\s*float time\s*\)/,
    "Expected a named broad 3D cloud distribution helper."
  );
  assert.match(
    shaderSource,
    /vec3 curlWarpCloudPoint\(\s*vec3 point,\s*float time\s*\)/,
    "Expected high-frequency detail to be curl-warped before erosion sampling."
  );
  assert.match(
    shaderSource,
    /float sampleCloudDetailErosion\(\s*vec3 point,\s*float time\s*\)/,
    "Expected a named erosion helper for broken cloud edges and internal ridges."
  );
  assert.match(
    shaderSource,
    /float sampleCloudHeightEnvelope\(\s*float heightRatio\s*\)/,
    "Expected height shaping to stay explicit instead of becoming a uniform fog sheet."
  );
  assert.match(
    shaderSource,
    /float sampleCloudDensity\(\s*MapSpaceCloudRay ray,\s*vec3 point,\s*vec3 columnPoint,\s*float time,\s*out float textureValue\s*\)/,
    "Expected the final density helper to combine broad coverage, erosion, height, and texture signal."
  );
  assert.match(
    shaderSource,
    /float beerLambert\(\s*float opticalDepth\s*,\s*float extinction\s*\)/,
    "Expected Beer-Lambert transmittance to drive thickness and light absorption."
  );
  assert.match(
    shaderSource,
    /float cloudPhaseFunction\(\s*float viewDotLight\s*,\s*float anisotropy\s*\)/,
    "Expected a bounded phase function for directional cloud lighting."
  );
  assert.match(
    shaderSource,
    /float sampleLightOpticalDepth\(\s*MapSpaceCloudRay ray,\s*vec3 point,\s*vec3 columnPoint,\s*vec3 sunDirection,\s*float time\s*\)/,
    "Expected a short lightmarch helper that shares the visible cloud ray and density field."
  );
  assert.match(
    shaderSource,
    /vec3 computeSingleScattering\(\s*float density,\s*float viewTransmittance,\s*float lightTransmittance,\s*float phase\s*\)/,
    "Expected single scattering to be computed from density, view transmittance, light transmittance, and phase."
  );
  assert.match(
    shaderSource,
    /vec3 computeMultipleScatteringApprox\(\s*float density,\s*float lightOpticalDepth,\s*float viewDotLight\s*\)/,
    "Expected multiple scattering to be an explicit fill-light approximation."
  );
  assert.match(
    shaderSource,
    /for \(int scatteringOctave = 0; scatteringOctave < MAX_CLOUD_SCATTERING_OCTAVES; scatteringOctave \+= 1\)/,
    "Expected multiple scattering to use a bounded WebGL 1 octave loop."
  );
  assert.match(
    shaderSource,
    /const int MAX_CLOUD_LIGHT_STEPS = [345];/,
    "Expected the lightmarch budget to stay short."
  );
  assert.match(
    shaderSource,
    /const int MAX_CLOUD_SCATTERING_OCTAVES = [234];/,
    "Expected the multiple-scattering approximation to stay low-octave."
  );
  assert.match(
    shaderSource,
    /const int MAX_MAP_SPACE_CLOUD_STEPS = 8;/,
    "The main raymarch budget must not be raised to hide flat density."
  );
});
```

- [x] **Step 2: Add the failing boundary preservation test**

Add this test near the same cloud test group:

```js
test("campaign cloud volume lighting preserves renderer boundaries", () => {
  const cloudSource = readSource("src/ui/views/map/campaign-cloud-webgl.ts");
  const shaderSource = readSource("src/ui/views/map/shaders/campaign-cloud.frag.glsl");
  const revealMaskSource = readSource("src/ui/views/map/campaign-cloud-reveal-mask.ts");
  const mainSource = readSource("src/main.ts");

  assert.doesNotMatch(
    mainSource,
    /sampleLightOpticalDepth|computeSingleScattering|computeMultipleScatteringApprox|MAX_CLOUD_LIGHT_STEPS/,
    "main.ts must not participate in cloud lighting or scattering implementation."
  );
  assert.doesNotMatch(
    cloudSource,
    /sampleHeightAtUv|mapHeightUrl|data-map-height|map_heights/,
    "Cloud renderer must not sample terrain height data while upgrading lighting."
  );
  assert.match(
    shaderSource,
    /vec4 sampleMapSpaceVolumetricCloud\(\s*MapSpaceCloudRay ray,\s*float time,\s*out float visibleTexture\s*\)/,
    "The existing map-space cloud body path should remain the primary cloud integration point."
  );
  assert.match(
    shaderSource,
    /vec2 revealUv = getMapSpaceCloudRevealUv\(ray\);/,
    "Reveal holes should still be derived from the same terrain-projected cloud ray."
  );
  assert.doesNotMatch(
    revealMaskSource,
    /sampleLightOpticalDepth|computeSingleScattering|computeMultipleScatteringApprox/,
    "Reveal mask generation must not own lighting or scattering behavior."
  );
});
```

- [x] **Step 3: Run the targeted tests and confirm they fail**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign cloud volume lighting" tests/robustness.test.cjs }
```

Expected:

- `FAIL` because the new shader helpers do not exist yet.

- [x] **Step 4: Commit Task 1**

Run:

```powershell
git add tests/robustness.test.cjs docs/superpowers/plans/2026-08-05-campaign-cloud-volume-lighting-upgrade-plan.md
git commit -m "test: lock campaign cloud volume lighting contracts"
```

Expected:

- Commit succeeds.

- [x] **Step 5: Sync progress**

Update this plan:

- Mark Task 1 steps complete.
- Set `Execution State.Status` to `running`.
- Set `Execution State.Current Focus` to `Task 2: implement 3D cloud density and erosion.`
- Set `Execution State.Next Step` to `Start Task 2 from the first unchecked step.`
- Add a `Progress Log` entry with the failing test command and failure summary.

## Task 2: Implement 3D Density And Curl-Warped Erosion

**Files:**
- Modify: `src/ui/views/map/shaders/campaign-cloud.frag.glsl`
- Modify: `tests/robustness.test.cjs` only if regexes need to match the final exact helper signatures
- Read: `docs/superpowers/specs/2026-08-05-campaign-cloud-volume-lighting-upgrade-design.md`

**Interfaces:**
- Consumes: `MapSpaceCloudRay`, `getMapSpaceCloudTexturePoint`, `proceduralFbm`, `worleyNoise`, `billow`, `textureFbm`, and `sampleMapSpaceVolumetricCloud`.
- Produces: `sampleCloudBaseDistribution`, `curlWarpCloudPoint`, `sampleCloudDetailErosion`, `sampleCloudHeightEnvelope`, `sampleCloudDensity`.

- [x] **Step 1: Move the old density helper to the new signature**

In `src/ui/views/map/shaders/campaign-cloud.frag.glsl`, rename the existing `sampleMapSpaceCloudDensity` function to `sampleCloudDensity` and keep the same parameters:

```glsl
float sampleCloudDensity(
  MapSpaceCloudRay ray,
  vec3 point,
  vec3 columnPoint,
  float time,
  out float textureValue
) {
  return 0.0;
}
```

Then update the raymarch call site:

```glsl
float density = sampleCloudDensity(ray, point, columnPoint, time, textureValue);
```

Keep a small forwarding wrapper only if older tests still require the old name:

```glsl
float sampleMapSpaceCloudDensity(
  MapSpaceCloudRay ray,
  vec3 point,
  vec3 columnPoint,
  float time,
  out float textureValue
) {
  return sampleCloudDensity(ray, point, columnPoint, time, textureValue);
}
```

- [x] **Step 2: Add the broad Worley fBm helper**

Add this helper before `sampleCloudDensity`:

```glsl
float sampleCloudBaseDistribution(vec3 point, float time) {
  vec2 wind = MAP_SPACE_CLOUD_WIND * time;
  vec3 p = vec3(point.xy * 0.78 + wind * 0.42, point.z * 0.72);
  vec2 w0 = worleyNoise(p.xy + vec2(p.z * 0.19, -p.z * 0.13));
  vec2 w1 = worleyNoise(p.xy * 1.93 + vec2(17.1, -9.4) + vec2(p.z * 0.31, p.z * 0.23));
  vec2 w2 = worleyNoise(p.xy * 3.87 + vec2(-5.3, 21.7) + vec2(-p.z * 0.11, p.z * 0.37));
  float cellular = (1.0 - w0.x) * 0.56 + (1.0 - w1.x) * 0.30 + (1.0 - w2.x) * 0.14;
  float gaps = smoothstep(0.24, 0.92, w0.y - w0.x);
  float billowedField = billow(proceduralFbm(p.xy * 0.62 + vec2(p.z * 0.17, -p.z * 0.09)));

  return clamp(cellular * 0.76 + gaps * 0.16 + billowedField * 0.08, 0.0, 1.0);
}
```

- [x] **Step 3: Add curl-warped detail helpers**

Add these helpers before `sampleCloudDetailErosion`:

```glsl
vec3 curlWarpCloudPoint(vec3 point, float time) {
  vec3 p = point * 3.4 + vec3(MAP_SPACE_CLOUD_WIND * time * 2.1, time * 0.035);
  float e = 0.117;
  float n1 = proceduralFbm(p.xy + vec2(p.z, -p.z));
  float n2 = proceduralFbm(p.xy + vec2(e + p.z * 0.73, -p.z * 0.41));
  float n3 = proceduralFbm(p.xy + vec2(-p.z * 0.37, e + p.z * 0.29));
  vec2 curl = vec2(n3 - n1, n1 - n2);

  return point + vec3(curl * 0.105, (n2 - n3) * 0.045);
}

float sampleCloudDetailErosion(vec3 point, float time) {
  vec3 warped = curlWarpCloudPoint(point, time);
  float worleyDetail = 1.0 - worleyNoise(warped.xy * 6.2 + vec2(warped.z * 0.51, -warped.z * 0.34)).x;
  float highFbm = proceduralFbm(warped.xy * 9.7 + vec2(warped.z * 0.83, warped.z * 0.47));
  float textureDetail = textureFbm(warped.xy * (5.4 * CLOUD_TEXTURE_SAMPLE_SCALE));

  return clamp(worleyDetail * 0.48 + highFbm * 0.34 + textureDetail * 0.18, 0.0, 1.0);
}
```

- [x] **Step 4: Add the explicit height envelope helper**

Add this helper:

```glsl
float sampleCloudHeightEnvelope(float heightRatio) {
  float bottomFade = smoothstep(0.02, 0.24, heightRatio);
  float topFade = 1.0 - smoothstep(0.74, 0.98, heightRatio);
  float middleBody = smoothstep(0.10, 0.42, heightRatio) * (1.0 - smoothstep(0.58, 0.90, heightRatio));
  float baseWeight = 0.78 + middleBody * 0.28;

  return clamp(bottomFade * topFade * baseWeight, 0.0, 1.0);
}
```

- [x] **Step 5: Implement the final density composition**

Set the body of `sampleCloudDensity` to this composition, preserving `columnPoint` stability:

```glsl
float cloudBottom = MAP_SPACE_CLOUD_BOTTOM_HEIGHT_UNITS * uCloudProjection.z;
float cloudTop = MAP_SPACE_CLOUD_TOP_HEIGHT_UNITS * uCloudProjection.z;
float heightRatio = clamp(
  (point.z - cloudBottom) / max(cloudTop - cloudBottom, 0.0001),
  0.0,
  1.0
);
float worldTextureScale = clamp(
  uCloudTextureScaleBoost,
  0.50,
  MAP_SPACE_CLOUD_TEXTURE_SCALE_MAX
);
vec3 columnTexturePoint = getMapSpaceCloudTexturePoint(ray, columnPoint);
vec3 pointTexturePoint = getMapSpaceCloudTexturePoint(ray, point);
vec3 basePoint = vec3(columnTexturePoint.xy * (1.18 * worldTextureScale), columnTexturePoint.z * 0.92);
vec3 detailPoint = vec3(pointTexturePoint.xy * (1.92 * worldTextureScale), pointTexturePoint.z * 1.34);
float baseDistribution = sampleCloudBaseDistribution(basePoint, time);
float erosion = sampleCloudDetailErosion(detailPoint, time);
float heightEnvelope = sampleCloudHeightEnvelope(heightRatio);
float lowLayer = smoothstep(0.00, 0.34, heightRatio) * (1.0 - smoothstep(0.42, 0.72, heightRatio));
float midLayer = smoothstep(0.18, 0.50, heightRatio) * (1.0 - smoothstep(0.62, 0.92, heightRatio));
float highLayer = smoothstep(0.48, 0.88, heightRatio);
float layeredShape = baseDistribution * (0.72 + lowLayer * 0.20 + midLayer * 0.18) - erosion * (0.28 + highLayer * 0.20);
float density = clamp((layeredShape - 0.28) * MAP_SPACE_CLOUD_DENSITY_SCALE * heightEnvelope, 0.0, 1.0);
float visibleTextureLayer = smoothstep(0.20, 0.56, heightRatio) * (1.0 - smoothstep(0.62, 0.92, heightRatio));
float carvedDetail = clamp((erosion - 0.18) * 1.48, 0.0, 1.0);
float cellularRidge = clamp((baseDistribution - 0.36) * 1.36, 0.0, 1.0);
textureValue = mix(
  clamp(carvedDetail * 0.72 + cellularRidge * 0.28, 0.0, 1.0),
  clamp((carvedDetail * 0.46 + cellularRidge * 0.54 - 0.08) * 1.42, 0.0, 1.0),
  visibleTextureLayer
);

return density;
```

- [x] **Step 6: Run targeted tests for density contracts**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign cloud volume lighting|campaign cloud density uses height layers|campaign cloud map-space volumetric slab" tests/robustness.test.cjs }
```

Expected:

- The new density helper assertions pass.
- Existing map-space slab and height-layer tests pass or fail only on exact regexes that need to be updated to the new helper names without weakening the behavior.

- [x] **Step 7: Commit Task 2**

Run:

```powershell
git add src/ui/views/map/shaders/campaign-cloud.frag.glsl tests/robustness.test.cjs docs/superpowers/plans/2026-08-05-campaign-cloud-volume-lighting-upgrade-plan.md
git commit -m "feat: add campaign cloud 3d density erosion"
```

Expected:

- Commit succeeds.

- [x] **Step 8: Sync progress**

Update this plan:

- Mark Task 2 steps complete.
- Set `Execution State.Current Focus` to `Task 3: implement single scattering and light optical depth.`
- Set `Execution State.Next Step` to `Start Task 3 from the first unchecked step.`
- Add a `Progress Log` entry with targeted test results.

## Task 3: Implement Single Scattering And Light Optical Depth

**Files:**
- Modify: `src/ui/views/map/shaders/campaign-cloud.frag.glsl`
- Modify: `tests/robustness.test.cjs` only if exact regexes need to match final code formatting
- Read: `src/ui/views/map/campaign-cloud-webgl.ts`

**Interfaces:**
- Consumes: `sampleCloudDensity`, `MapSpaceCloudRay`, current `sampleMapSpaceVolumetricCloud`.
- Produces: `beerLambert`, `cloudPhaseFunction`, `sampleLightOpticalDepth`, `computeSingleScattering`.

- [x] **Step 1: Add lighting constants and transmittance helpers**

Add these constants near the cloud slab constants:

```glsl
const int MAX_CLOUD_LIGHT_STEPS = 4;
const vec3 CLOUD_SUN_DIRECTION = normalize(vec3(-0.42, -0.28, 0.86));
const vec3 CLOUD_SUN_COLOR = vec3(1.0, 0.94, 0.82);
const vec3 CLOUD_AMBIENT_COLOR = vec3(0.50, 0.62, 0.66);
const float CLOUD_EXTINCTION = 1.38;
const float CLOUD_LIGHT_EXTINCTION = 1.12;
const float CLOUD_SCATTERING_STRENGTH = 0.72;
```

Add these helpers before the raymarch function:

```glsl
float beerLambert(float opticalDepth, float extinction) {
  return exp(-max(opticalDepth, 0.0) * max(extinction, 0.0));
}

float cloudPhaseFunction(float viewDotLight, float anisotropy) {
  float g = clamp(anisotropy, -0.72, 0.72);
  float denom = max(1.0 + g * g - 2.0 * g * viewDotLight, 0.08);
  return clamp((1.0 - g * g) / pow(denom, 1.5), 0.0, 3.2);
}
```

- [x] **Step 2: Add the short lightmarch helper**

Add this helper after `cloudPhaseFunction`:

```glsl
float sampleLightOpticalDepth(
  MapSpaceCloudRay ray,
  vec3 point,
  vec3 columnPoint,
  vec3 sunDirection,
  float time
) {
  float cloudBottom = MAP_SPACE_CLOUD_BOTTOM_HEIGHT_UNITS * uCloudProjection.z;
  float cloudTop = MAP_SPACE_CLOUD_TOP_HEIGHT_UNITS * uCloudProjection.z;
  float maxDistance = max(cloudTop - cloudBottom, 0.0001) * 0.86;
  float stepSize = maxDistance / float(MAX_CLOUD_LIGHT_STEPS);
  float opticalDepth = 0.0;

  for (int lightStep = 0; lightStep < MAX_CLOUD_LIGHT_STEPS; lightStep += 1) {
    float stepRatio = (float(lightStep) + 0.5) / float(MAX_CLOUD_LIGHT_STEPS);
    vec3 lightPoint = point + sunDirection * stepSize * (float(lightStep) + 0.5);
    float lightTextureValue = 0.0;
    float lightDensity = sampleCloudDensity(ray, lightPoint, columnPoint, time, lightTextureValue);
    opticalDepth += lightDensity * stepSize * mix(1.0, 0.72, stepRatio);
  }

  return opticalDepth;
}
```

- [x] **Step 3: Add single scattering helper**

Add:

```glsl
vec3 computeSingleScattering(
  float density,
  float viewTransmittance,
  float lightTransmittance,
  float phase
) {
  vec3 directLight = CLOUD_SUN_COLOR * phase * lightTransmittance;
  vec3 ambientLift = CLOUD_AMBIENT_COLOR * (0.18 + 0.22 * lightTransmittance);

  return (directLight + ambientLift) * density * viewTransmittance * CLOUD_SCATTERING_STRENGTH;
}
```

- [x] **Step 4: Change the raymarch accumulation to optical depth**

Inside `sampleMapSpaceVolumetricCloud`, replace the old per-step color block with optical-depth accumulation. Keep existing `textureValue`, `accumulatedTexture`, and early exit logic.

Use this structure inside the existing main loop:

```glsl
float lightOpticalDepth = sampleLightOpticalDepth(
  ray,
  point,
  columnPoint,
  CLOUD_SUN_DIRECTION,
  time
);
float lightTransmittance = beerLambert(lightOpticalDepth, CLOUD_LIGHT_EXTINCTION);
float viewDotLight = clamp(dot(-ray.direction, CLOUD_SUN_DIRECTION), -1.0, 1.0);
float phase = cloudPhaseFunction(viewDotLight, 0.42);
float stepOpticalDepth = density * stepSize;
float viewTransmittance = beerLambert(stepOpticalDepth, CLOUD_EXTINCTION);
float stepAlpha = clamp((1.0 - viewTransmittance) * (1.0 - accumulatedAlpha), 0.0, 1.0);
vec3 singleScattering = computeSingleScattering(
  density,
  viewTransmittance,
  lightTransmittance,
  phase
);
float heightHighlight = smoothstep(0.36, 0.92, heightRatio) * lightTransmittance;
float internalShadow = 1.0 - lightTransmittance;
vec3 stepColor = CLOUD_AMBIENT_COLOR * (0.28 + heightRatio * 0.18);
stepColor += singleScattering;
stepColor = mix(stepColor, vec3(0.34, 0.45, 0.50), internalShadow * density * 0.42);
stepColor = mix(stepColor, vec3(1.0, 0.98, 0.88), heightHighlight * textureValue * 0.36);

accumulatedColor += stepColor * stepAlpha;
accumulatedAlpha += stepAlpha;
```

Do not remove:

```glsl
accumulatedTexture += textureValue * textureWeight;
accumulatedTextureWeight += textureWeight;
if (accumulatedAlpha >= MAP_SPACE_CLOUD_ALPHA_LIMIT) {
  break;
}
```

- [x] **Step 5: Run targeted tests for single scattering**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign cloud volume lighting|campaign cloud reveal cutouts|campaign cloud shader reuses one map-space ray|campaign cloud render keeps flowing cloud animation timing" tests/robustness.test.cjs }
```

Expected:

- New single-scattering contract assertions pass.
- Reveal composition and one-ray-per-fragment tests still pass.

- [x] **Step 6: Commit Task 3**

Run:

```powershell
git add src/ui/views/map/shaders/campaign-cloud.frag.glsl tests/robustness.test.cjs docs/superpowers/plans/2026-08-05-campaign-cloud-volume-lighting-upgrade-plan.md
git commit -m "feat: add campaign cloud single scattering"
```

Expected:

- Commit succeeds.

- [x] **Step 7: Sync progress**

Update this plan:

- Mark Task 3 steps complete.
- Set `Execution State.Current Focus` to `Task 4: add multiple scattering fill and verify visually.`
- Set `Execution State.Next Step` to `Start Task 4 from the first unchecked step.`
- Add a `Progress Log` entry with targeted test results.

## Task 4: Add Multi-Octave Multiple Scattering Fill And Verify

**Files:**
- Modify: `src/ui/views/map/shaders/campaign-cloud.frag.glsl`
- Modify: `tests/robustness.test.cjs` only if exact regexes need to match final code formatting
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/project-progress.md` when this child becomes active or completes
- Modify: `docs/superpowers/plans/2026-08-05-campaign-cloud-volume-lighting-upgrade-plan.md`

**Interfaces:**
- Consumes: `sampleLightOpticalDepth`, `beerLambert`, `cloudPhaseFunction`, `computeSingleScattering`.
- Produces: `MAX_CLOUD_SCATTERING_OCTAVES`, `computeMultipleScatteringApprox`, verified browser screenshot `.tmp/campaign-cloud-volume-lighting-upgrade.png`.

- [x] **Step 1: Add multiple scattering constants**

Add these constants near the single-scattering constants:

```glsl
const int MAX_CLOUD_SCATTERING_OCTAVES = 3;
const float CLOUD_MULTI_SCATTER_ATTENUATION = 0.58;
const float CLOUD_MULTI_EXTINCTION_ATTENUATION = 0.54;
```

- [x] **Step 2: Implement the multi-octave fill helper**

Add this helper after `computeSingleScattering`:

```glsl
vec3 computeMultipleScatteringApprox(
  float density,
  float lightOpticalDepth,
  float viewDotLight
) {
  vec3 scattered = vec3(0.0);
  float octaveWeight = 0.48;
  float octaveExtinction = CLOUD_LIGHT_EXTINCTION;
  float octaveAnisotropy = 0.22;

  for (int scatteringOctave = 0; scatteringOctave < MAX_CLOUD_SCATTERING_OCTAVES; scatteringOctave += 1) {
    float octavePhase = cloudPhaseFunction(viewDotLight, octaveAnisotropy);
    float octaveLight = beerLambert(lightOpticalDepth, octaveExtinction);
    scattered += CLOUD_SUN_COLOR * octaveLight * octavePhase * octaveWeight;
    octaveWeight *= CLOUD_MULTI_SCATTER_ATTENUATION;
    octaveExtinction *= CLOUD_MULTI_EXTINCTION_ATTENUATION;
    octaveAnisotropy *= 0.46;
  }

  return scattered * density * 0.22;
}
```

- [x] **Step 3: Add the fill term to the raymarch**

Inside the main cloud raymarch loop, after `singleScattering` is computed, add:

```glsl
vec3 multipleScattering = computeMultipleScatteringApprox(
  density,
  lightOpticalDepth,
  viewDotLight
);
```

Then include it in the step color:

```glsl
stepColor += singleScattering + multipleScattering;
```

If the Task 3 code already added `singleScattering` directly, remove the duplicate direct addition so `singleScattering` is counted once.

- [x] **Step 4: Run targeted cloud tests**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign cloud volume lighting|campaign cloud map-space volumetric slab|campaign cloud reveal cutouts|campaign cloud shader reuses one map-space ray|campaign cloud density uses height layers|campaign cloud freezes animation during map drag and zoom|campaign cloud render keeps flowing cloud animation timing" tests/robustness.test.cjs }
```

Expected:

- All named tests pass.

- [x] **Step 5: Run typecheck, build, and plan lint**

Run:

```powershell
npm run typecheck
npm run build
npm run lint:plans
```

Expected:

- `npm run typecheck` exits `0`.
- `npm run build` exits `0`. Existing Vite asset or chunk warnings are acceptable only if the exit code is `0`.
- `npm run lint:plans` exits `0`.

- [x] **Step 6: Run browser visual verification**

Start or reuse the dev server:

```powershell
npm run dev -- --host 127.0.0.1
```

Use the printed local Vite URL. In the browser:

- Reach the campaign map.
- Wait for `[data-campaign-map-terrain]` and `[data-campaign-map-cloud]`.
- Confirm both canvases have nonzero dimensions.
- Pan and zoom the map.
- Capture `.tmp/campaign-cloud-volume-lighting-upgrade.png`.

Expected visual result:

- Cloud canvas is nonblank.
- Terrain remains visible below clouds.
- Reveal holes align with explored Hexes.
- Thick areas show darker internal mass.
- Thin edges are broken and translucent.
- Cloud layer no longer reads primarily as a flat sheet.
- Markers, hover overlays, and global UI remain above the cloud layer.

- [x] **Step 7: Update the change log**

Add this entry near the top of `docs/change-log.md`:

```md
## 2026-08-05 Campaign Cloud Volume Lighting Upgrade

- `campaign-cloud.frag.glsl` now separates broad Worley fBm cloud distribution, curl-warped high-frequency erosion, and explicit height envelopes so the campaign cloud body has stronger internal density variation without raising the main raymarch budget.
- The map-space cloud raymarch now estimates light optical depth with a short sun-direction lightmarch and uses Beer-Lambert transmittance, a bounded phase function, and single scattering for directional highlights and self-shadowed interiors.
- A low-octave multiple-scattering approximation adds thick-cloud fill light after the single-scattering path, preserving reveal holes, interaction freeze, terrain chunk loading holds, texture-scale control, and the existing cloud renderer boundary.
```

- [x] **Step 8: Update project progress if this child is active**

If this child has been promoted to active implementation, update `docs/superpowers/project-progress.md`:

- `Current Task`: `Campaign Cloud Volume Lighting Upgrade`
- `Current Task Status`: `completed-but-open`
- `Current Child`: `Campaign Cloud Volume Lighting Upgrade`
- `Current Child Status`: `completed-but-open`
- `Next Child`: `none`
- `Next Child Status`: `none`
- `Next Required Action`: `review-and-push-campaign-cloud-volume-lighting-upgrade`
- `Next Entry Document`: `docs/superpowers/project-progress.md`
- `Next Owner Document`: `docs/superpowers/plans/2026-08-05-campaign-cloud-volume-lighting-upgrade-plan.md`
- `Push Status`: `not-pushed`
- `Push Commit`: `none`
- `Resume From`: `Open docs/superpowers/project-progress.md, then review and push docs/superpowers/plans/2026-08-05-campaign-cloud-volume-lighting-upgrade-plan.md; do not close until push succeeds.`

If this child has not been promoted to active implementation, record in this plan's `Progress Log` that project progress was intentionally left unchanged.

- [x] **Step 9: Sync plan state**

Update this plan:

- Mark Task 4 steps complete except closeout-only items.
- Set `Execution State.Status` to `completed-but-open`.
- Set `Execution State.Current Focus` to `Implementation and verification complete locally; review/push remain before closeout.`
- Set `Execution State.Next Step` to `Review final diff and push when requested; do not mark closed while remote push is absent.`
- Set `Execution State.Verification` to the exact commands and browser screenshot path from Steps 4-6.
- Add a `Progress Log` entry with all verification results.

- [x] **Step 10: Commit Task 4**

Run:

```powershell
git add src/ui/views/map/shaders/campaign-cloud.frag.glsl tests/robustness.test.cjs docs/change-log.md docs/superpowers/project-progress.md docs/superpowers/plans/2026-08-05-campaign-cloud-volume-lighting-upgrade-plan.md
git commit -m "feat: upgrade campaign cloud volume lighting"
```

Expected:

- Commit succeeds.
- If `docs/superpowers/project-progress.md` was intentionally unchanged, omit it from `git add`.
- If `.tmp/campaign-cloud-volume-lighting-upgrade.png` is ignored, do not force-add it; record the path in this plan instead.

## Exit Check

- [x] `campaign-cloud.frag.glsl` uses explicit broad distribution, detail erosion, height envelope, and final density helpers.
- [x] `campaign-cloud.frag.glsl` uses Beer-Lambert transmittance, phase function, light optical depth, and single scattering.
- [x] `campaign-cloud.frag.glsl` uses bounded multi-octave multiple-scattering fill after single scattering.
- [x] Main cloud raymarch remains bounded and does not increase just to hide flatness.
- [x] Existing reveal holes, dissolve behavior, interaction freeze, terrain chunk hold, texture-scale control, and `window.rpgCloud` behavior are preserved.
- [x] No cloud lighting or density behavior is added to `src/main.ts`.
- [x] Cloud renderer does not sample terrain height data or mutate gameplay state.
- [x] Targeted cloud tests pass.
- [x] `npm run typecheck` passes.
- [x] `npm run build` passes.
- [x] `npm run lint:plans` passes.
- [x] Browser visual verification is recorded.
- [x] Project progress sync is updated if the child state changed.
- [x] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Campaign Cloud Volume Lighting Upgrade`
- Parent Task: `Campaign Cloud Volume Lighting Upgrade`
- Parent Stage: `Map Renderer Architecture`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `yes`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `review-and-push-campaign-cloud-volume-lighting-upgrade`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-08-05-campaign-cloud-volume-lighting-upgrade-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, then review and push docs/superpowers/plans/2026-08-05-campaign-cloud-volume-lighting-upgrade-plan.md; do not close until push succeeds.`
