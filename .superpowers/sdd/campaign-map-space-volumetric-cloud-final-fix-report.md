# Campaign Map-Space Volumetric Cloud Final Fix Report

## Status

Final-review fixes implemented and verified. The governed child remains `completed-but-open` pending review/push and the known child 27 baseline resolution.

## Fix Commit

- `7d85a68d` - `fix: align campaign clouds to terrain camera space`

## Files Changed

- `src/ui/views/map/campaign-terrain-webgl.ts`
- `src/ui/views/map/campaign-cloud-webgl.ts`
- `src/ui/views/map/shaders/campaign-cloud.frag.glsl`
- `tests/robustness.test.cjs`
- `docs/change-log.md`
- `docs/superpowers/plans/2026-07-26-campaign-map-space-volumetric-cloud-plan.md`
- `docs/superpowers/project-progress.md`

## Commands Run

- RED: `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign cloud map-space volumetric slab|campaign cloud pan basis" tests/robustness.test.cjs }`
  - Result: exit 1 as expected before production edits; source contract failed on missing `cameraOffsetUnit` projection payload.
- GREEN targeted cloud suite: `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "campaign cloud map-space volumetric slab|campaign cloud render keeps flowing cloud animation timing|campaign cloud freezes animation during map drag and zoom|campaign cloud stays frozen briefly after repeated zoom input stops|campaign fog exploration stays active without the removed shader renderer" tests/robustness.test.cjs }`
  - Result: exit 0; 6/6 tests passed.
- `npm run typecheck`
  - Result: exit 0.
- `npm run build`
  - Result: exit 0; existing Vite asset/chunk warnings remained.
- `npm run lint:plans`
  - Result: exit 0; Superpowers plan lint passed for 69 files.
- `git diff --check`
  - Result: no whitespace errors; only LF-to-CRLF working-copy warnings.
- `rg -n "0\.0025|cloudProjectionNoop" src/ui/views/map/shaders/campaign-cloud.frag.glsl`
  - Result: exit 1; no matches.

## Self-Review Against Final-Review Findings

1. Critical map-space camera alignment:
   - Fixed. The shader no longer reconstructs cloud coordinates with `uCloudCamera.y/z * 0.0025`.
   - `campaign-terrain-webgl.ts` now exposes `cameraOffsetUnit` and `fovRadians` through the terrain-owned cloud projection payload.
   - `campaign-cloud-webgl.ts` uploads `uCloudView` for camera reference scale, base distance, and FOV.
   - `campaign-cloud.frag.glsl` reconstructs the ray through terrain screen scale, perspective, inverse tilt, `CAMERA_OFFSET_UNIT / safeScale` pan, and inverse `terrainScale`.

2. Important unused projection payload values:
   - Fixed. The shader now uses `uCloudProjection.y` as `terrainScale`, `uCloudProjection.z` as `heightScale`, and `uCloudProjection.w` as `cameraOffsetUnit`.
   - `heightScale` defines the slab bottom/top in terrain height units instead of being retained through alpha no-op math.

3. Important regression coverage:
   - Fixed. `tests/robustness.test.cjs` now rejects raw `0.0025` and `cloudProjectionNoop`, requires `cameraOffsetUnit`, `terrainScale`, `heightScale`, `uCloudView`, and includes a numeric pan-basis test showing the terrain-aligned formula scales with zoom while the old raw offset does not.

4. Minor no-op retention block:
   - Fixed. The `cloudProjectionNoop` alpha-retention block was removed.

5. `.tmp` screenshot:
   - Not changed. The fix did not require changing screenshot verification artifacts.

