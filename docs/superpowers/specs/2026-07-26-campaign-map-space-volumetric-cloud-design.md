# Campaign Map-Space Volumetric Cloud Design

## Context

The current campaign cloud renderer is a viewport-level WebGL overlay:

- `src/ui/views/map/campaign-cloud-webgl.ts` owns the cloud canvas, reveal textures, animation timing, and WebGL lifecycle.
- `src/ui/views/map/campaign-cloud-reveal-mask.ts` builds a soft reveal field from explored Hex cells.
- `src/ui/views/map/shaders/campaign-cloud.frag.glsl` generates animated cloud color and alpha from screen/camera-coupled noise plus the reveal field.
- `src/ui/views/map/campaign-terrain-webgl.ts` owns terrain projection, camera coupling, chunk loading, height sampling, passability, and map-space object projection.

This split is still the correct boundary. Exploration remains gameplay/runtime state, terrain remains the source of camera/projection data, and clouds remain a visual overlay.

The user wants the existing screen-resampled cloud to correspond to the 3D Hex campaign map. A Cesium-style volumetric cloud reference was provided, but its WGS84 sphere-shell model, scene depth reconstruction, and Cesium postprocess API do not fit this project directly. The useful parts are the raymarching pattern, 3D noise, wind-driven coordinate offset, low-cost lighting, LOD, and early termination.

## Decision

Implement the first production attempt as a conservative map-space volumetric cloud slab.

The cloud layer should not be a Cesium sphere shell. It should be a finite-height slab above the campaign terrain's normalized map/world space. Each cloud fragment should derive a terrain-aligned ray from the current campaign terrain camera, intersect that ray with the cloud slab, then perform a small fixed-budget raymarch through procedural 3D noise.

The first version should prioritize:

- Stable visual correspondence with the 3D Hex map during pan, zoom, and camera tilt.
- Keeping the cloud renderer inside the existing overlay boundary.
- Preserving the current Hex reveal lifecycle and dissolve behavior.
- Predictable performance on ordinary browser WebGL.

The first version should avoid:

- Full Cesium-style planet curvature.
- Deep scene depth sampling.
- Sampling terrain height inside the cloud renderer.
- Physically accurate multi-scattering.
- Any gameplay, exploration, pathfinding, terrain, or map-node state changes.

## Architecture

`campaign-cloud-webgl.ts` remains the owner of cloud rendering. It should pass additional read-only terrain camera/projection uniforms to `campaign-cloud.frag.glsl`.

`campaign-terrain-webgl.ts` may expose a read-only helper for cloud projection state. That helper can include values needed to reconstruct a simplified terrain-view ray, such as camera scale, pan offset, viewport aspect, camera tilt, and the same matrix basis used by terrain projection. It must not expose mutable terrain internals or require the cloud renderer to sample chunk height data.

`campaign-cloud-reveal-mask.ts` should keep building reveal masks from explored Hex polygons through the existing fixed cloud reveal height projection helper. Reveal generation should stay independent from terrain height samples. This preserves the current contract that cloud holes follow the 3D camera and accumulated explored Hexes without making clouds part of gameplay.

No new branch should be added to `src/main.ts`. No content, domain, application, or runtime module should import WebGL or 3D implementation details.

## Shader Model

The fragment shader should replace the main cloud body sampling space with a terrain/map-space raymarch:

1. Convert the fragment's screen UV into a camera/view ray using terrain-aligned projection uniforms.
2. Intersect the ray with a fixed cloud slab, for example a bottom and top height in terrain world units.
3. If the ray misses, output transparent cloud.
4. Step through the slab with a small bounded loop, initially 8-16 steps.
5. Sample procedural 3D noise at each point, with time-based wind offset.
6. Accumulate density, color, and alpha with early termination when opacity is high enough.
7. Apply the existing reveal field as the final clearing and edge-eroding mask.

The shader can keep the existing 2D noise helper functions as ingredients, but density should be keyed to map/world coordinates rather than raw screen UV. The cloud should appear anchored above the Hex map while still drifting through wind offsets.

## Visual Tuning

The first version should use lightweight non-physical lighting:

- Cloud top contribution is brighter and warmer.
- Cloud bottom contribution is cooler and greyer.
- Dense regions self-shadow more strongly.
- Edges remain soft through noise erosion and reveal mask blending.

Wind should be controlled by uniform values or constants equivalent to wind direction and speed. The first pass can keep these as renderer constants if no debug UI exists yet.

The old reveal dissolve should remain recognizable. Newly explored Hexes should still open through an organic dissolve instead of snapping to a hard polygon edge.

## Performance

The first pass should use a low-cost budget:

- Default raymarch steps: 12.
- Lower-quality fallback: 8 steps when zoomed out or when the cloud render target is large.
- Upper bound: 16 steps unless manual profiling proves headroom.
- Early exit when accumulated alpha is near opaque.
- Keep `CLOUD_RENDER_MAX_DEVICE_PIXEL_RATIO` and `CLOUD_RENDER_MAX_LONG_EDGE_PX` constraints.

The renderer should not add large 3D textures for this first version. Procedural/hash/value noise or existing 2D noise texture reuse is acceptable. If a 3D noise texture is later introduced, it should be an engine visual asset owned by the UI renderer boundary.

## Data Flow

Exploration state continues flowing as:

`runtime.mapExploration` -> map view `data-map-revealed-hex-keys` -> cloud reveal descriptor -> reveal texture -> cloud shader.

Projection state should flow as:

terrain renderer camera/projection state -> read-only cloud projection helper -> cloud renderer uniforms -> cloud shader ray reconstruction.

Cloud visuals should flow as:

cloud constants/uniforms + time + reveal texture + terrain projection uniforms -> overlay color and alpha.

No cloud output should feed back into terrain, exploration, navigation, map nodes, or save data.

## Testing

Unit or integration coverage should lock the boundaries:

- `campaign-cloud-webgl.ts` consumes terrain projection helpers but does not import terrain chunk internals.
- `campaign-cloud-reveal-mask.ts` still uses explored Hex keys and fixed reveal height projection.
- Map exploration state is unchanged by cloud rendering.
- No cloud logic is added to `src/main.ts`.

Shader behavior cannot be fully unit tested, so manual and browser verification are required:

- Pan the campaign map and confirm cloud bodies remain stable relative to the Hex terrain instead of sliding in screen space.
- Zoom and tilt the map and confirm cloud holes still match explored Hexes.
- Reveal new Hexes and confirm dissolve remains smooth.
- Inspect performance at common desktop viewport sizes.
- Confirm terrain, water, vegetation, structure visuals, markers, actor projection, and hover overlays still layer correctly around the cloud canvas.

## Migration Notes

The current screen/camera-coupled cloud path should be changed incrementally rather than deleted wholesale. Keep existing reveal texture upload, previous reveal transition texture, animation freeze behavior, and debug `window.rpgCloud` control.

If the map-space ray reconstruction proves too complex for the first pass, fall back to a terrain-aligned map-coordinate sampling plane before attempting full raymarching. That fallback must still use map/Hex space, not raw screen UV, and should be treated as an implementation fallback rather than the target design.
