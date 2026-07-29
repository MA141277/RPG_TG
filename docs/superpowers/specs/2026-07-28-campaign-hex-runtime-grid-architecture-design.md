# Campaign Hex Runtime Grid Architecture Design

## Purpose

The campaign map must use one shared gameplay hex grid regardless of how an
editor package was sampled. The Yuanmo editor can sample a cropped source image
at any density, but that sampling density must not change runtime hex size,
movement scale, camera behavior, city placement, clouds, structures, shoreline,
or terrain chunks.

This design replaces the current mixed model where the map editor sampling step,
runtime grid coordinate system, and WebGL world scaling can all influence the
visible hex size.

## Current Mismatch

The current implementation has three competing scale concepts:

- Editor sampling hexes in `src/yuanmo-hex-editor/generator.ts` use
  `sourceRadius = sourceHeight / 138 * scale * step`. This is correct as a
  source-image sampling control only.
- The original campaign runtime grid uses `hexTerrainScale = 138` and
  `hexMapAspect = 1.1285`. This is the shared gameplay hex contract.
- The current map3 runtime export writes `hexTerrainScale = 188.35381` so the
  larger 13512-cell map fits into a 0..1 terrain UV plane. WebGL then partly
  compensates with `worldScale`. This makes map extent and hex size coupled.

The visual pipeline also has multiple semantic layers:

- Runtime grid cells provide land/water, terrain, environment, and height.
- The legacy material image is still used as a fallback semantic source.
- Marker-driven city/village ground is applied in WebGL after grid loading.
- Shader layers add shoreline, beach, water flow, mountain, grass, rock, and
  structure-ground visuals.

The desired behavior is not "scale the new map to fit the old map." The desired
behavior is "keep the old hex size, but allow the new grid to cover a larger or
different map extent."

## Design Principles

1. Runtime hex size is fixed.
   The game-wide campaign hex spacing remains the old standard:
   `hexTerrainScale = 138`, `hexMapAspect = 1.1285`.

2. Editor sampling is production-only.
   `scale`, `step`, `offsetX`, `offsetY`, and `sourceCrop` affect only how
   `map3/hex-grid.generated.json` is produced. They must not be interpreted as
   runtime scale.

3. One editor cell equals one runtime cell.
   For map3, every generated editor cell becomes exactly one runtime
   `CampaignHexGridCell`. There is no projection/merge into the old 8509-cell
   grid.

4. Map size comes from grid bounds.
   Terrain chunks, camera pan range, marker projection, click hit testing,
   actor placement, vegetation, structures, and shoreline must derive coverage
   from the loaded `campaignHexGrid.bounds` or equivalent hex-point bounds.

5. Runtime semantic truth is the grid.
   When `campaignHexGridUrl` is provided, land/water, terrain, environment,
   height, and passability come from `campaignHexGrid.cells`. The legacy material
   image is fallback-only for maps without a runtime grid.

6. Visual layers do not redefine semantics.
   Shoreline, sand, water flow, mountain shading, grass, rock, and structure
   ground can stylize the grid, but they cannot replace or re-sample the grid's
   land/water and terrain decisions.

## Runtime Data Model

`CampaignHexGridDefinition.coordinateSystem` keeps the shared fixed values:

```ts
coordinateSystem: {
  hexTerrainScale: 138;
  hexMapAspect: 1.1285;
  coordinateSpace: { width: number; height: number };
}
```

For larger maps, runtime extent is represented separately from hex size. The
recommended field is:

```ts
hexPointBounds?: {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}
```

This field describes the world/hex-pixel coverage of the loaded grid. It must
not change the size of a single hex. If omitted, the renderer falls back to the
classic 138-scale bounds.

## Export Pipeline

The map3 build path should:

1. Load `map3/hex-grid.generated.json`.
2. Resolve `hex-overrides.water-land.json`, `hex-overrides.terrain.json`, and
   `hex-overrides.environment.json` into the generated cells.
3. Convert each generated cell to exactly one runtime cell by applying only a
   stable coordinate origin transform.
4. Keep `coordinateSystem.hexTerrainScale = 138`.
5. Compute runtime `bounds` from runtime cells.
6. Compute `hexPointBounds` from runtime cell centers plus one hex radius.
7. Sync settlements to runtime cells using nearest generated/editor cell, not
   old-grid projection.

`structure-overlays.json` is currently not consumed by the runtime build. It
should either be explicitly wired into runtime semantic grid output or removed
from runtime expectations. It must not remain an invisible third path.

## Renderer Architecture

The renderer needs one coordinate service for all map systems:

```ts
hex cell <-> hex point <-> terrain uv <-> world point <-> screen point
```

The conversion must use the loaded grid's extent consistently:

- `terrainUvToHexPoint()` reads from `hexPointBounds` when present.
- `hexPointToTerrainU/V()` writes into that same extent.
- `createTerrainWorldPoint()` maps UV to world using the same extent-derived
  world plane.
- Terrain chunks use grid bounds and chunk keys, not the old 138 rectangle.
- Shoreline distance-field generation receives the same coordinate system and
  must not call default 138 helpers inside map3 paths.
- Markers, actor, vegetation, structures, click projection, and travel grid
  all use the same coordinate service.

This means `createCampaignTerrainWorldScale()` should not derive world size from
`coordinateSystem.hexTerrainScale / 138`. If a world plane scale is needed, it is
derived from `hexPointBounds`, not from changing hex size.

## Semantic Layering

When a runtime grid exists:

- `uMaterialSemanticTexture` is built from `campaignHexGrid.cells`.
- Red channel means land.
- Green channel means mountain.
- Blue channel may mean structure ground after marker/overlay application.
- Alpha means semantic texture cell is present.

When a runtime grid does not exist:

- The legacy material image path can still create a fallback semantic model.

Structure ground should be decided in one of two acceptable ways:

- Preferred: map/editor/build data writes structure ground into a runtime
  semantic field or overlay list.
- Transitional: marker-driven overlay may remain, but it must operate on the
  same loaded grid cells and must not resample old map coordinates.

## Camera And Interaction

The map can be larger than the viewport. The camera should behave like the
original online version:

- Do not fit the full map to screen by default.
- Start centered near the player/current node.
- Allow pan/zoom over the loaded grid extent.
- Movement scale, actor scale, cloud scale, structure scale, and marker scale
  remain tied to the shared hex size, not to map extent.

## Acceptance Criteria

- map3 runtime export has `hexTerrainScale = 138`.
- map3 runtime export has one runtime cell per generated editor cell unless
  the build explicitly adds default filler cells.
- No map3 export path projects into the old 8509-cell grid.
- Renderer does not use `coordinateSystem.hexTerrainScale / HEX_TERRAIN_SCALE`
  as a map-size compensation.
- All terrain UV/hex/world conversions use one coordinate service.
- Shoreline distance-field generation does not call default 138 conversion
  helpers when a runtime grid coordinate system is available.
- Water/land overrides in map3 are visible in the runtime grid and in WebGL.
- City and village positions are derived from map3/editor cells, with no old
  map nodes left in `maps.json`.
- The visible parallelogram is not caused by old runtime clipping. If the
  editor-generated cell set itself is parallelogram-shaped, the build must make
  that explicit as map data or fill the intended runtime bounds with default
  water cells.

## Non-Goals

- Do not redesign the visual style of terrain shading.
- Do not make all cities enterable now.
- Do not solve final city internal content or scripts.
- Do not make editor sampling step part of gameplay scale.

## Implementation Order

1. Add failing tests for fixed runtime hex size and one-to-one map3 export.
2. Fix runtime export to keep `hexTerrainScale = 138` and compute separate
   `hexPointBounds`.
3. Refactor WebGL coordinate conversion to use the loaded coordinate system
   consistently.
4. Remove default 138 calls from shoreline, vegetation, marker, actor, click,
   and structure paths where a runtime grid coordinate system is present.
5. Decide whether `structure-overlays.json` is connected or explicitly ignored.
6. Regenerate map3 runtime data and verify in browser with player-centered
   camera, visible buildings, correct city coordinates, and no old-grid clip.
