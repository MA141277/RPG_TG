# City Prefab Layout Design

## 1. Goal

Define a stable two-level city-stage authoring model for reusable city entities:

- `prefab` level:
  - owns reusable building, decoration, grass, broken wood, and other city-stage entity definitions
- `city layout` level:
  - owns placement of prefab instances inside a concrete city

The primary objective is to make visual alignment data reusable across cities, especially:

- `asset.image`
- `asset.offsetX`
- `asset.offsetY`
- `asset.scale`
- footprint size
- label geometry
- hit-area geometry

The design must stop city-specific editing from fragmenting these values across multiple layouts.

## 2. Problem Statement

The current city-stage layout stores full `entity` objects directly inside each city layout JSON.

That structure works for a single city, but it has three major problems:

1. visual parameters are duplicated per city
2. the editor still encourages editing entity body data inside a city view
3. the runtime and authoring format do not distinguish between:
   - reusable entity definition
   - one concrete placement of that entity in one city

This is the wrong ownership model for the project's actual need.

The project needs:

- one place to align each reusable city-stage entity
- multiple cities to place instances of the same aligned entity
- one editor mode for prefab body editing
- one editor mode for city placement editing

## 3. Scope

This design covers:

- new prefab-first city-stage data model
- editor mode split between prefab editing and city layout editing
- runtime composition from `prefab + instance`
- old layout compatibility and migration path

This design does not cover:

- directional variants beyond future reserve fields
- per-city overrides of prefab visual data
- prefab inheritance or local prefab forks
- multi-user authoring flow

## 4. Design Principles

The implementation must follow these rules:

1. visual truth lives in the prefab
2. placement truth lives in the city instance
3. the editor must support editing prefab data without loading a city background
4. city placement editing must not become a backdoor for changing prefab visual data
5. runtime rendering should continue to use one composed render object model

## 5. Target Data Model

### 5.1 Prefab Library

Add a standalone prefab library JSON, referred to here as `prefabs.json`.

It stores reusable entity definitions.

Each prefab must contain:

- `id`
- `name`
- `category`
- `entry`
- `asset`
- `footprint`
- `interaction`
- optional default render metadata that is truly reusable

Recommended shape:

```json
{
  "version": 1,
  "prefabs": [
    {
      "id": "keep-main",
      "name": "帅府",
      "category": "special",
      "entry": { "type": "house", "houseId": "house.kulan.keep" },
      "asset": {
        "image": "ui/...",
        "naturalWidth": 1333,
        "naturalHeight": 710,
        "scale": 0.24,
        "offsetX": 0,
        "offsetY": 0,
        "anchor": "bottom-center"
      },
      "footprint": {
        "cols": 8,
        "rows": 6
      },
      "interaction": {
        "clickable": true,
        "label": {
          "text": "帅府",
          "offsetX": 0,
          "offsetY": -162,
          "width": 120,
          "height": 40
        },
        "hitArea": {
          "type": "ellipse",
          "offsetX": 0,
          "offsetY": -8,
          "width": 148,
          "height": 60
        }
      }
    }
  ]
}
```

### 5.2 City Layout Instances

Each city layout must stop storing full reusable entity bodies.

Instead, it stores city-specific instances that reference prefabs.

Each instance must contain:

- `id`
- `prefabId`
- `gridX`
- `gridY`
- instance-level `render`

Recommended shape:

```json
{
  "version": 2,
  "map": {},
  "grid": {},
  "instances": [
    {
      "id": "haozhou-keep-main",
      "prefabId": "keep-main",
      "gridX": 16,
      "gridY": 10,
      "render": {
        "visible": true,
        "locked": false,
        "zIndexMode": "y-sort",
        "zIndex": null
      }
    }
  ]
}
```

### 5.3 Ownership Boundary

These fields must belong to the prefab only:

- `asset.image`
- `asset.naturalWidth`
- `asset.naturalHeight`
- `asset.scale`
- `asset.offsetX`
- `asset.offsetY`
- `asset.anchor`
- `footprint.cols`
- `footprint.rows`
- `interaction.clickable`
- `interaction.label.*`
- `interaction.hitArea.*`
- `entry.*`

These fields must belong to the city instance only:

- `gridX`
- `gridY`
- `render.visible`
- `render.locked`
- `render.zIndexMode`
- `render.zIndex`

The initial implementation must not allow per-city overrides of prefab visual parameters.

That prohibition is intentional and required to preserve visual consistency across cities.

## 6. Editor Design

The city map building editor must split into two authoring levels.

### 6.1 Prefab Editor

Purpose:

- edit reusable entity body data without depending on any city scene

Required UI behavior:

- show prefab list
- show independent prefab preview with no city background
- edit:
  - image path
  - image dimensions
  - scale
  - `offsetX / offsetY`
  - anchor
  - footprint size
  - entry binding
  - label bounds
  - hit-area bounds

The prefab preview must remain the authoritative place for alignment work.

### 6.2 City Layout Editor

Purpose:

- place prefab instances into a concrete city layout

Required UI behavior:

- load one city layout
- show city background and fine isometric grid
- show instance list
- place and move instances on the city board
- edit:
  - `prefabId`
  - `gridX / gridY`
  - instance render metadata

The city layout editor must not expose prefab body editing controls.

### 6.3 Cross-Mode Interaction

The editor should support:

- selecting an instance and jumping to its prefab definition
- modifying a prefab and immediately refreshing all visible instances that reference it

This keeps editing fast without collapsing the ownership boundary.

## 7. Runtime Composition

The runtime does not need a brand-new renderer.

Instead, it needs a composition step before rendering.

Target flow:

1. load prefab library
2. load city layout instances
3. resolve `instance.prefabId`
4. compose runtime render entities
5. pass composed entities into the existing city-stage render path

The composed runtime entity should preserve the current render semantics:

- lot anchor and footprint calculations
- asset offset calculations
- label placement
- hit-area placement
- z-index behavior

The current `city-stage-layout.ts` path should move toward consuming composed runtime entities, not raw authoring storage.

## 8. Compatibility And Migration

### 8.1 Old Layout Import

The editor must keep reading old layout files that contain `entities`.

When an old layout is loaded:

1. derive one prefab definition from each old entity body
2. derive one instance that references that prefab
3. preserve visual values exactly during conversion

The first migration target is correctness, not deduplication quality.

If two old entities are visually identical but have different ids, the initial migration may keep them as separate prefabs.

That is acceptable for phase one.

### 8.2 Export Direction

The new editor flow should export:

- prefab library in the new prefab format
- city layout in the new instance format

Old direct-`entities` export should be treated only as a temporary compatibility path if still needed during transition.

### 8.3 Migration Sequence

Recommended order:

1. add prefab and instance schemas
2. make the editor read and edit the new model
3. add old-`entities` import compatibility
4. adapt runtime to compose from prefab plus instance
5. migrate the example city
6. retire raw `entities` runtime dependence

## 9. Example Runtime Composition Shape

After composition, the runtime may still operate on an entity-like object, but its source ownership is split:

```ts
type ComposedCityStageEntity = {
  id: string;
  prefabId: string;
  name: string;
  category: string;
  entry: CityStageEntry;
  asset: CityStageAsset;
  lot: {
    gridX: number;
    gridY: number;
    cols: number;
    rows: number;
  };
  render: CityStageRender;
  interaction: CityStageInteraction;
};
```

This is a runtime convenience shape, not the authoring storage shape.

That distinction must remain explicit in code.

## 10. Risks And Protections

### 10.1 Risk: Reintroducing Visual Drift

If city instances are allowed to override prefab offsets or footprint sizes, the main benefit of the redesign is lost.

Protection:

- do not expose those overrides in city layout editing
- keep prefab-only ownership explicit in types and validators

### 10.2 Risk: Runtime And Editor Divergence

If the editor and runtime compose entities differently, alignment bugs will reappear.

Protection:

- centralize composition and geometry helpers
- prefer one shared adapter path

### 10.3 Risk: Migration Noise

Old layouts may produce many one-off prefabs during automatic conversion.

Protection:

- accept that in phase one
- optimize deduplication only after the new ownership model is stable

## 11. Verification Requirements

Implementation must verify:

- prefab editing works without city background
- changing prefab `offsetX / offsetY` updates all referencing instances
- city layout editing only changes instance placement and render metadata
- old `entities` files can still be imported
- runtime city view renders the migrated example city correctly
- tests cover the split ownership boundary and composition path

## 12. Final Recommendation

Adopt the prefab-first authoring model directly.

Do not continue extending the current city-owned full-entity format as the long-term solution.

That format is acceptable only as migration input, not as the final ownership model.
