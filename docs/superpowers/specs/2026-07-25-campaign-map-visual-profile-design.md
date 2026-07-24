# Campaign Map Visual Profile Design

## Context

Current dev already treats the campaign map as a split system:

- `MapDefinition.campaignHexGridUrl` points to the Hex semantic layer.
- `MapDefinition.layers` carries visual texture URLs such as grass, sand, rock, snow, water noise, and fog noise.
- `MapDefinition.campaignVegetationRulesUrl` points to vegetation visual rules.
- `src/ui/views/map/map-view.ts` passes those URLs to canvases through `data-map-*` attributes.
- `src/ui/views/map/campaign-terrain-webgl.ts` loads the URLs and renders terrain, water, mountains, vegetation, actors, projections, and clouds.

This means campaign map rendering belongs to the UI renderer boundary, but the source of map semantics and content identity does not.

The current branch still has one important exception: `map-view.ts` hardcodes one Yuanmo/Haizhou building marker and directly imports city visual assets. That is a temporary coupling and should not be expanded when absorbing ideas from `shoreamend`.

## Decision

Do not merge `shoreamend` wholesale.

Use `shoreamend` as a visual reference for campaign structures, walls, city/village ground details, and renderer techniques. The production implementation should keep the current dev boundary:

- Hex data, map nodes, settlement identity, ownership, travel, exploration, and interaction eligibility are semantic/gameplay data.
- Terrain, water, fog, vegetation, building models, wall models, shadows, and visual styling are UI renderer assets.
- UI renderer code may load engine-owned visual resources by URL or profile id.
- UI renderer code must not directly import scenario-pack-private paths such as `src/content/scenario-packs/zhuyuanzhang/**`.

## Target Architecture

Add a campaign structure visual profile boundary.

`MapDefinition` should be able to declare a lightweight visual profile id, for example:

```ts
campaignStructureProfileId?: string;
```

The profile id is not gameplay content. It selects an engine-owned visual set for the map renderer.

The renderer-facing resolved profile contains URLs and parameters, not raw imported objects:

```ts
type CampaignStructureVisualProfile = {
  id: string;
  cityGroundTextureUrl?: string;
  villageGroundTextureUrl?: string;
  fortWallMeshUrl?: string;
  buildingMeshSetUrl?: string;
  shaderPreset?: string;
};
```

The profile registry should live outside `scenario-packs`, for example under a campaign map visual asset module. Heavy resources should live under an engine asset location such as `src/assets/campaign-structures/` or another existing shared visual asset directory.

`map-view.ts` should only receive the resolved profile URLs through the view model and emit `data-campaign-structure-*` attributes. It should not know about Zhu Yuanzhang pack folders or a specific settlement's model files.

`campaign-terrain-webgl.ts` should load those URLs on demand, preferably through fetchable JSON/texture URLs so large structure JSON does not get statically folded into the main JS bundle.

## Building Boundary

Buildings have two separate meanings:

- Visual building assets are UI renderer assets, like clouds, grass, water, terrain material textures, and vegetation meshes.
- Settlement identity and interaction are map/content/gameplay data.

Therefore a city/fort/village node can drive building placement, but the model resources should come from the selected visual profile.

The current hardcoded `YUANMO_HEX_BUILDING` should be migrated toward normal `MapNode` data plus optional renderer visual metadata. The interaction button should still use map node ids, map coordinates, city ids, and exploration state; those remain semantic data.

## Scenario Pack Boundary

The preferred production boundary is:

- Built-in scenario or map data may reference `campaignStructureProfileId`.
- Built-in engine assets provide the heavy model and texture resources for that profile.
- Imported scenario packs should not be required to provide heavy structure models.
- UI renderer modules must not import scenario-pack-private files directly.

Existing dev behavior already allows imported packs to carry vegetation rules and mesh URLs. This spec does not remove that capability. It only states that the `shoreamend` structure/city/fort visual system should not deepen that pattern by making every scenario pack responsible for large building model libraries.

## Shoreamend Porting Rule

When porting from `shoreamend`, preserve only production-suitable mechanisms:

- Reusable renderer path for structure models, walls, ground decals, and shadows.
- Asset loading by URL/profile, not hard imports from scenario pack folders.
- Compatibility with the existing Hex semantic layer, chunk terrain generation, exploration state, and marker interaction model.
- No replacement of gameplay terrain, navigation, exploration, or map node semantics with visual model data.

Do not port:

- `map-view-model.ts` direct imports of Zhu Yuanzhang fort/city assets.
- One-map-only conditionals in the renderer.
- Runtime dependencies on source OBJ files.
- Any fallback that makes visuals appear correct while bypassing Hex land/water, terrain, environment, or exploration semantics.

## Verification Requirements

Implementation should add or update tests that prove:

- `src/ui/views/map/map-view.ts` does not import `scenario-packs/zhuyuanzhang`.
- Campaign structure profile data resolves through a shared asset/profile seam.
- `MapDefinition` can reference a structure profile id without embedding model JSON.
- Renderer markup exposes only resolved URLs/profile-derived attributes.
- The old hardcoded Yuanmo building path is removed or isolated behind data/profile resolution.
- Existing campaign terrain, vegetation, water, fog, navigation, and exploration tests continue to pass.

Manual visual verification should load the campaign map and confirm:

- Terrain, water, clouds, vegetation, markers, and player projection still render.
- Structure visuals appear only when the selected profile and node data allow them.
- Marker interaction remains gated by map node data and exploration state, not by visual model presence.

