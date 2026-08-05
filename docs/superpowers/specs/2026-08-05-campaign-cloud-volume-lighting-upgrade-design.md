# Campaign Cloud Volume Lighting Upgrade Design

## Context

The campaign map already renders clouds through the existing UI renderer boundary:

- `src/ui/views/map/campaign-cloud-webgl.ts` owns the cloud WebGL canvas, reveal textures, animation timing, and shader uniforms.
- `src/ui/views/map/campaign-cloud-reveal-mask.ts` owns explored Hex reveal mask generation.
- `src/ui/views/map/shaders/campaign-cloud.frag.glsl` owns the visible cloud body.
- `src/ui/views/map/campaign-terrain-webgl.ts` owns terrain projection data consumed by the cloud renderer.

The current shader already raymarches a finite map-space cloud slab, but the visible result can still read as flat or sheet-like. The root issue is not the absence of raymarching. The root issue is that the density and lighting signals do not yet create enough independent depth cues. A volume raymarch can still look like a flat layer if every step samples a similar column field, alpha saturates too quickly, and lighting is mostly height/color mixing instead of optical-depth-based shadowing.

This upgrade should keep the existing renderer boundary and improve the cloud's volumetric appearance in place.

## User-Visible Goal

The campaign map cloud should stop reading as a flat cloud sheet.

The target visual cues are:

- soft but broken cloud silhouettes
- visible thick and thin regions inside the same cloud body
- darker dense cores and softer thin edges
- light-facing highlights and shadowed interiors
- thick-cloud fill light that avoids dead black without washing out shape
- reveal holes that still align to explored Hexes and dissolve smoothly

## Decision

Upgrade the existing campaign cloud shader in three ordered layers:

1. Rebuild the density field so each raymarch step samples a more convincing 3D cloud volume.
2. Move height-only lighting to single-scattering-style optical depth and low-budget lightmarching.
3. Add a multi-octave multiple-scattering approximation as a fill-light term after the single scattering is working.

Do not create a separate prototype renderer for this task. Do not move cloud logic into `src/main.ts`. Do not change gameplay exploration, pathfinding, save data, map node state, terrain height generation, or house systems.

## Technique Roles

Raymarching is the volume integration container. It lets each pixel sample several points along the view ray, accumulate density, transmittance, color, and alpha, and stop early when opacity becomes high. It does not by itself guarantee volumetric appearance.

Worley fBm cloud distribution should define the large cloud bodies: where clouds exist, where there are voids, and how broad masses connect.

3D Worley fBm should prevent the body from behaving like a 2D texture stretched through depth. The sampled point must vary by map-space position and height so ray steps see changing structure.

High-frequency curl-warped noise should etch cloud edges and dense ridges. This is primarily a shape and material-detail signal, not a lighting signal.

Height density curves should shape cloud bottom, middle, and top layers. This prevents the slab from becoming a uniform fog sheet.

Single scattering should estimate sunlight scattered once toward the camera. This creates directional highlights, backlit edges, and shadowed cloud interiors.

Lightmarching should sample a short path toward the sun from the current raymarch point. This estimates how much cloud lies between the point and the light, producing self-shadowing.

Beer-Lambert transmittance should control absorption through view and light paths. This gives thick regions lower transmittance and makes thin edges stay translucent.

A phase function such as a bounded Henyey-Greenstein approximation should control how strongly the cloud brightens at forward, side, or back lighting angles.

Multiple scattering should be added only after the single-scattering path is in place. It should act as a soft fill term for thick clouds, using multiple octaves of reduced extinction and reduced phase anisotropy. It should not be expected to create volume shape by itself.

## Shader Model

The shader should preserve the current terrain-aligned ray reconstruction and slab intersection.

Density sampling should be reorganized around explicit components:

- `sampleCloudBaseDistribution(point)`: low-frequency Worley fBm that controls broad coverage.
- `sampleCloudDetailErosion(point)`: higher-frequency curl-warped detail that carves edges and internal ridges.
- `sampleCloudHeightEnvelope(heightRatio)`: cloud bottom/top/mid density shaping.
- `sampleCloudDensity(point, time, out detailSignal)`: final density after coverage, erosion, height, and wind.

Lighting should be reorganized around explicit components:

- `sampleLightOpticalDepth(point, sunDirection, time)`: short lightmarch, low fixed step count.
- `computeSingleScattering(density, viewTransmittance, lightTransmittance, phase)`: primary sunlight contribution.
- `computeMultipleScatteringApprox(inputs)`: multi-octave fill contribution based on the same optical depth.

The view raymarch should accumulate:

- optical depth
- view transmittance
- single-scattering color
- multiple-scattering fill
- alpha from transmittance, not from arbitrary opacity alone
- a visible texture/detail signal for the existing reveal-edge composition if still needed

## Performance

This must remain a map overlay suitable for ordinary browser WebGL.

Initial budgets:

- keep the main cloud raymarch at the current bounded low step count unless visual proof requires a small change
- use a short lightmarch, for example 3-5 steps
- keep multiple scattering as 2-4 octave approximation, not nested full raymarching
- preserve existing cloud render target downsampling and animation freeze behavior
- preserve early exit when view transmittance becomes very low

If the added lightmarch is too expensive, the first fallback should be reducing light steps or updating lighting at lower precision inside the same shader. The fallback must not return to a purely flat color overlay.

## Boundaries

In scope:

- `src/ui/views/map/shaders/campaign-cloud.frag.glsl`
- `src/ui/views/map/campaign-cloud-webgl.ts` only if extra sun or quality uniforms are required
- source-level robustness tests for cloud shader contracts and ownership boundaries
- browser visual verification of the campaign map cloud layer
- `docs/change-log.md`
- governed implementation plan and project progress updates if this work becomes an active child

Out of scope:

- new gameplay or exploration state
- terrain height or chunk generation changes
- navigation, pathfinding, map node, save, house, or playable logic
- `src/main.ts` cloud branches
- separate standalone prototype renderer
- new large 3D texture assets unless a later plan explicitly chooses the asset route
- physically exact atmospheric rendering

## Testing

Source-level tests should verify:

- cloud rendering remains owned by `campaign-cloud-webgl.ts` and the cloud shader
- `src/main.ts` does not receive cloud feature logic
- the shader keeps a bounded main raymarch budget
- the shader contains explicit density, erosion, lightmarch, single-scattering, and multiple-scattering helpers
- the cloud renderer does not sample terrain height data or mutate gameplay state
- reveal mask projection remains terrain/reveal-mask owned

Browser verification should confirm:

- terrain and cloud canvases initialize successfully
- cloud bodies remain aligned to the campaign map during pan and zoom
- clouds no longer read primarily as a flat sheet
- thick areas show darker internal mass
- thin edges remain translucent and broken
- reveal holes still align with explored Hexes
- markers, hover overlays, and global UI remain above the cloud layer

## Exit Conditions

- The visible cloud layer has stronger non-flat volume cues from density variation and optical-depth lighting.
- Existing reveal holes, dissolve behavior, interaction freeze, and terrain chunk loading hold behavior are preserved.
- No cloud behavior is added to `src/main.ts`.
- Targeted robustness tests pass.
- Typecheck and production build pass, or any skipped command is explicitly recorded with a reason.
- Browser visual verification is recorded in the implementation plan progress log.
