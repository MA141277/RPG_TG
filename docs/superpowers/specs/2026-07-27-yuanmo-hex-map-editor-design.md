# Yuanmo Hex Map Editor Design

## Context

Current dev already separates world-map data into multiple layers:

- `maps.json` carries the campaign map definition, background assets, and map nodes.
- `campaign-hex-grid-v1` JSON carries Hex semantic data: `land`, `referenceHeight`, `terrain`, and `environment`.
- `campaign-terrain-webgl.ts` consumes that Hex semantic layer for rendering and travel semantics.
- Map node interaction still flows through world-map node identity and `cityId`.
- Scenario-pack city content is split from the map itself: `cityId` is the stable key that lets `maps.json`, city definitions, houses, city entries, characters, and other pack data communicate.

This means the editor should not invent a second family of enterable rural locations. Enterable city, town, and village locations should continue to flow through the existing `city` content line. Their differences are currently presentation- and content-level differences, not registry-family differences.

The user wants a standalone HTML tool for the existing Yuanmo map only. It should not render the in-game 3D scene. It should act as a top-down information editor for:

- Hex sampling scale relative to the current source map.
- Hex sampling step/stride from the fixed Yuanmo source image into Hex space.
- Water/land correction.
- Terrain regeneration under the current mountain rule.
- Environment regeneration under the current forest rule.
- City/village settlement placement.
- Structure overlays such as city ground, village ground, and farmland-like coverage.
- Manual Hex-level semantic correction after generation.

The output should be an editor-owned intermediate directory package, not the final scenario-pack runtime data. Formal city content such as houses, entries, and story hooks will be designed later.

## Decision

Build a standalone Vite HTML tool for the Yuanmo campaign map.

The tool should:

- Load only the current Yuanmo map assets and current campaign Hex generation rules.
- Generate a baseline Hex semantic layer from the fixed source map plus user-controlled Hex sampling parameters.
- Treat sampling scale, sampling offset, and Yuanmo-to-Hex sampling step as first-class editable generation parameters.
- Store user edits as layered overrides instead of mutating the generated baseline in place.
- Resolve a single final Hex semantic state in memory and use that same resolved state for visual editing, movement legality checks, settlement legality checks, and export previews.
- Treat all enterable settlements as future `city` content nodes, with current metadata limited to `id`, `name`, and settlement type.

Do not:

- Build a generic multi-map editor in the first version.
- Export final `cities.json`, `city-entries.json`, `houses.json`, or other runtime scenario-pack files.
- Add a separate runtime family for villages or rural sites.
- Add perspective, 3D rendering, or gameplay runtime simulation.

## Approaches Considered

### 1. Single-file editor export

Store the full editor project in one large JSON file.

Rejected because it makes diffing, partial regeneration, and future conversion tooling harder. The user explicitly wants an intermediate package that can evolve before final content authoring.

### 2. Layered directory package

Store editor data as a directory containing generated Hex data, override layers, settlement metadata, and structure overlays.

Chosen because it matches the current codebase boundary between map semantics, place identity, and future content definitions. It also keeps future conversion tooling simple.

### 3. Brush-log-only editor

Store only source parameters and user brush actions, then regenerate everything on every load.

Rejected because it makes final movement semantics and visual semantics less stable. The user wants water/land, terrain, and movement to stay unified and inspectable.

## Editor Scope

The first version should cover five bounded responsibilities:

1. Hex sampling setup for the fixed Yuanmo map.
2. Baseline semantic generation using current rules.
3. Override editing on top of generated semantics.
4. Enterable settlement metadata editing.
5. Intermediate package import/export.

The editor should not attempt to solve final city content generation. It only produces the map-side substrate that future tools can convert into formal scenario-pack content.

## Data Model

The editor output should be a directory package with these files:

### `project.json`

Editor-owned project metadata:

- fixed source map id
- source asset references
- Hex sampling scale
- Hex sampling step/stride
- Hex sampling offset
- editor UI state that is useful to resume work
- generation metadata such as rule version and timestamps

This file owns editor configuration, not gameplay semantics.

### `hex-grid.generated.json`

The generated baseline Hex layer for the current sampling parameters.

It should follow the existing campaign Hex semantics closely:

- `x`
- `y`
- `land`
- `referenceHeight`
- `terrain`
- `environment`

This is the baseline generated result before manual correction.
Its generation metadata should be traceable to the current sampling scale, sampling offset, and Yuanmo-to-Hex sampling step used by the editor.

### `hex-overrides.water-land.json`

Stores only user overrides for water and land.

This layer exists because the user wants to correct rivers and shorelines without losing the baseline generation result.

### `hex-overrides.terrain.json`

Stores only user overrides for terrain values such as plain or mountain.

### `hex-overrides.environment.json`

Stores only user overrides for environment values such as grassland or forest.

### `settlements.json`

Stores enterable settlement metadata for future conversion into formal city content.

First-version settlement fields should be limited to:

- `id`
- `name`
- `type`
- `mapPosition`
- `hexCell`

Current built-in types are:

- `city`
- `village`
- `custom`

At this stage, `type` affects editor-side visual mapping and future content conversion hints. It does not create a new runtime content family.

### `structure-overlays.json`

Stores overlay regions and per-Hex structure markings that are not part of base terrain semantics.

This file should own:

- city-ground coverage
- village-ground coverage
- farmland-like overlays
- future structure categories that should remain separate from base Hex terrain/environment fields

The user explicitly wants building/farmland to live in a separate overlay layer rather than in base Hex fields.

## Resolved Semantic Model

The editor should compute one resolved in-memory semantic state:

1. Start from `hex-grid.generated.json`.
2. Apply water/land overrides.
3. Apply terrain overrides.
4. Apply environment overrides.
5. Apply structure overlays as a separate but co-resolved layer.
6. Expose the merged result as the editor's single source of truth for all downstream behaviors.

This resolved model should be used for:

- top-down Hex coloring
- water/land inspection
- terrain/environment inspection
- movement/passability preview
- settlement placement validation
- export preview

This is a hard constraint. The editor must not use one state for display and another for movement or validation. The user explicitly requires unified visual and movement logic.

## Generation Rules

The first version should reuse the current Yuanmo generation logic rather than introducing a new terrain taxonomy.

### Water and Land

Baseline water/land generation should follow the current Yuanmo Hex rule source that samples the fixed `map_ground_types` asset and existing water detection logic.

### Terrain

Baseline terrain generation should follow the current mountain rule, producing current terrain categories only.

### Environment

Baseline environment generation should follow the current forest rule, producing current environment categories only.

### Structure Ground Mapping

Settlement type should map to current structure-ground semantics:

- `city` maps to current city-ground behavior.
- `village` maps to current village-ground behavior.
- `custom` is stored as metadata now but, in the first version, must render through one of the two existing current visual mappings selected by the user: city-ground or village-ground.

The editor should allow manual structure overlay painting regardless of whether an area currently contains a settlement.

## UI Design

The editor should be a pure top-down 2D page with four zones:

- top toolbar
- left tool rail
- center map canvas
- right inspector

### Top Toolbar

Functions:

- open/save editor project
- regenerate baseline Hex grid
- toggle validation overlays
- export intermediate package

### Left Tool Rail

Tool groups:

- sampling
- water/land brush
- terrain brush
- environment brush
- settlement tool
- structure overlay tool
- validation mode

### Center Map Canvas

The canvas should show:

- fixed Yuanmo source map
- Hex grid
- resolved semantic fill colors
- structure overlays
- settlement markers

It should remain strictly top-down and informational.

### Right Inspector

When a Hex is selected, show:

- baseline semantic values
- override values
- final resolved values

When a settlement is selected, show:

- id
- name
- type
- position
- linked Hex

When a structure overlay is selected, show:

- overlay category
- coverage target
- linked settlement, if any

## Editing Workflow

The intended workflow is:

1. Adjust Hex sampling scale and offset against the fixed Yuanmo source map.
2. Adjust Yuanmo-to-Hex sampling step/stride until the sampled Hex lattice matches the intended source-map density.
3. Generate baseline Hex semantics.
4. Correct water/land around rivers and coastline.
5. Regenerate or inspect terrain/environment under current rules.
6. Add or adjust enterable settlements.
7. Add or adjust structure overlays, including city/village/farmland coverage.
8. Inspect the unified resolved semantic view.
9. Export the intermediate project package.

The editor should make it easy to repeat this loop without losing the distinction between generated baseline and manual overrides.

## Validation Rules

The first version should include these validations:

- settlement name is required
- settlement id must be unique
- settlement must land on final resolved land
- settlement type must be one of current supported values
- override values must map to known semantic categories
- structure overlays must reference known overlay categories

After sampling or override changes, any settlement that ends up on water should remain visible and be marked invalid instead of being silently relocated.

## Conversion Boundary

This editor intentionally stops before final scenario-pack authoring.

Future conversion tooling can transform:

- `settlements.json` into formal `city` definitions and map-node relationships
- structure overlays into scenario-pack-facing visual/content hints
- resolved Hex semantics into runtime-facing campaign Hex data

The editor should therefore preserve enough metadata to support future conversion, but it should not attempt to generate final `city-entries`, `houses`, or story content now.

## Architecture

The implementation should stay modular instead of building one monolithic page script.

Suggested module boundaries:

- standalone page entry
- editor project state
- Yuanmo baseline Hex generator
- resolved semantic composer
- canvas interaction and hit-testing
- settlement editing state
- structure overlay editing state
- export/import serializer
- validation helpers

This keeps map semantics, editor UI, and export logic independently testable.

## Testing Requirements

Implementation should add tests that prove:

- changing sampling parameters changes the generated Hex baseline
- changing Yuanmo-to-Hex sampling step changes the generated Hex baseline in a visible and serializable way
- water/land overrides take precedence over generated baseline
- terrain/environment overrides take precedence over generated baseline
- the resolved semantic model is the single source for both visual state and movement legality state
- settlements on resolved water are flagged invalid
- settlement type maps to current structure-ground categories as expected
- export writes the directory package using the agreed file split
- import restores the same project state without semantic drift

Manual verification should confirm:

- the page loads only the Yuanmo source map
- the editor remains top-down and non-perspective
- Hex sampling can be aligned visually to the source map
- Yuanmo-to-Hex sampling step can be adjusted visually and restored from saved project data
- river and coastline corrections immediately affect the final resolved view
- settlement markers and structure overlays remain legible over the map

## Out of Scope

The first version does not include:

- final runtime scenario-pack generation
- automatic house generation
- story or entry authoring
- generic support for other campaign maps
- 3D or in-game renderer parity
- procedural building layout synthesis
- advanced custom settlement-type behavior beyond metadata and current visual mapping
