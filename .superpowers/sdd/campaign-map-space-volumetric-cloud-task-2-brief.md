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

- [ ] **Step 1: Strengthen the shader contract test**

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

- [ ] **Step 2: Run the targeted test and confirm it fails**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign cloud map-space volumetric slab uses terrain projection uniforms" tests/robustness.test.cjs }
```

Expected:

- `FAIL` because the shader functions are not implemented yet.

- [ ] **Step 3: Implement ray and slab helpers**

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

- [ ] **Step 4: Implement density and accumulation helpers**

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

- [ ] **Step 5: Route existing cloud body through map-space volume while preserving reveal**

In `sampleArticleCloudSea`, replace the old body cloud source with `sampleMapSpaceVolumetricCloud(uv, time)` while preserving:

- `sampleDissolvedRevealFields`
- `computeArticleMaskOffsetAndErosion`
- `ARTICLE_EDGE_CLEAR_VALUES`
- `ARTICLE_CORE_CLEAR_VALUES`
- reveal dissolve logic
- final reveal clear / isolated cloud keep behavior

The final visible cloud can still blend the map-space body with the existing outer puff helper if it remains masked by the reveal field. It must not return a fully screen-space `sampleArticleFlowingCloud` body as the primary cloud sea.

- [ ] **Step 6: Run targeted tests**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign cloud map-space volumetric slab|campaign cloud render keeps flowing cloud animation timing|campaign cloud freezes animation during map drag and zoom|campaign cloud stays frozen briefly after repeated zoom input stops|campaign fog exploration stays active without the removed shader renderer" tests/robustness.test.cjs }
```

Expected:

- `PASS` for new shader contract and existing lifecycle tests.

- [ ] **Step 7: Run typecheck**

Run:

```powershell
npm run typecheck
```

Expected:

- `PASS`.

- [ ] **Step 8: Commit Task 2**

Run:

```powershell
git add src/ui/views/map/shaders/campaign-cloud.frag.glsl tests/robustness.test.cjs docs/superpowers/plans/2026-07-26-campaign-map-space-volumetric-cloud-plan.md
git commit -m "feat: render campaign clouds in map space"
```

Expected:

- Commit succeeds.

- [ ] **Step 9: Sync progress and governance state**

Update this plan:

- Mark Task 2 checkboxes complete.
- Set `Execution State.Current Focus` to `Task 3: verification and visual QA`.
- Set `Execution State.Next Step` to `Dispatch Task 3 implementer subagent.`
- Append a `Progress Log` entry with the commit id and targeted/typecheck results.

