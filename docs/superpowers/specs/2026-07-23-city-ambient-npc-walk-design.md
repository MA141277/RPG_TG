# City Ambient NPC Walk Design

**Date:** `2026-07-23`  
**Scope:** `HD2DEG` embedded city exterior runtime for the current Haozhou/Kulan visual scene line  
**Status:** `approved`

## Goal

Add ambient NPC walking to the city visualization surface that opens after entering a city from the world map.

For this slice, the behavior must satisfy these rules:

1. The city visualization scene must continuously maintain `4..8` ambient NPCs.
2. NPCs are visual-only for now: not clickable, not interactive, and not tied to dialogue or tasks.
3. Pathing must use the currently loaded `HD2DEG` scene objects as the only geometry source.
4. Paths must avoid building-occupied tiles.
5. NPCs spawn at a valid start node, walk to a different end node, then despawn.
6. NPCs must sort in front of or behind buildings based on their world position relative to the building footprint.
7. The implementation must leave a clean hook for later replacement with real NPC-pool descriptors.

## Current State

The current city visualization pipeline is split across two layers:

- Main app entry uses `src/ui/views/city/city-3d-view.ts` to render an iframe.
- The iframe loads `HD2DEG/pixel-workflow.html?scene=...&embed=1`.

Within `HD2DEG`:

- `scripts/pixel-workflow.js` already owns embedded scene loading, scene-object persistence, tilemap world sampling, world projection, interaction discovery, and render ordering.
- Scene geometry already exists in loaded scene objects and can be converted into world-space building footprints.
- The engine already distinguishes embedded mode through `embed=1`.

At the moment there is no ambient city NPC runtime:

- no scene-derived gate/entry node extraction
- no runtime-maintained city crowd
- no walking-path solver for ambient NPCs
- no city-only visual NPC sorting rule against building footprints

## Confirmed Constraints

The following scope decisions were explicitly confirmed during design:

- **Geometry source:** use the currently loaded `HD2DEG` scene objects as the only pathing/occupancy source.
- **NPC interaction:** ambient walkers are fully non-interactive in this slice.
- **Runtime surface:** implement inside the city-scene iframe runtime, not in the outer main-app DOM.
- **Scene naming compatibility:** the current Haozhou visual line still carries `kulan`-era ids in several places; this slice must preserve that compatibility instead of doing a naming migration.

## Chosen Approach

Three implementation directions were considered:

1. Build a scene-local ambient NPC runtime inside `HD2DEG` and derive all occupancy/path data from loaded scene objects.
2. Let the outer app compute NPC routes and push them into the iframe via `postMessage`.
3. Drive the feature from an external prefab JSON and keep `HD2DEG` as a thin renderer.

This design chooses **Approach 1**.

Why:

- It matches the confirmed single-source-of-truth rule for geometry.
- It avoids duplicate scene-state interpretation between the main app and the iframe.
- It keeps later NPC-pool integration narrow: replace the spawn descriptor source without rewriting pathing or rendering.
- It can reuse existing `pixel-workflow` world-space footprint and render-order infrastructure.

## Runtime Architecture

Add a small ambient-city subsystem under `HD2DEG` that activates only for embedded exterior city scenes.

The runtime is decomposed into four responsibilities:

### 1. Scene Index

Build a cached scene index from loaded scene objects.

It must provide:

- building occupancy tiles
- building world footprints
- one entrance node per eligible building
- four gate nodes derived from scene walkable bounds
- walkable-grid bounds for pathfinding

### 2. Pathfinder

Use the derived walkable grid to solve a shortest path between two nodes while avoiding blocked building tiles.

Requirements:

- use a deterministic shortest-path search such as A*
- treat building tiles as blocked
- allow retry with a different node pair when a route is impossible
- return world-space waypoints ready for rendering

### 3. Ambient NPC Manager

Own NPC lifecycle and count maintenance.

Requirements:

- maintain `4..8` active NPCs whenever the runtime is enabled
- choose two distinct candidate nodes per NPC
- spawn at start node
- walk the solved path
- despawn at destination
- replenish population after despawn

### 4. Ambient NPC Renderer

Render non-interactive capsule placeholders with walk bobbing and sort keys.

Requirements:

- capsule body placeholder only
- simple shadow allowed
- light vertical bobbing while walking
- no click target, no interaction menu entry, no dialogue binding
- sort against buildings using the NPC foot anchor

## Data Source Contract

This slice must not read an external prefab file at runtime for path generation.

Instead it must derive all candidate data from the current loaded scene:

- scene objects loaded by `loadSceneById(...)`
- existing world-space building footprint helpers
- current tile/world bounds already available in `pixel-workflow`

The external prefab JSON provided by the user is useful as a visual/content reference, but not the authoritative runtime source for this slice.

## Candidate Nodes

Two node classes exist.

### Building Entrance Nodes

For each eligible building object:

- derive its occupied grid region from the existing footprint/world mapping
- define the entrance as the center point of the left-lower edge of the occupied diamond tile
- convert that point into world coordinates used by the path runtime

### Gate Nodes

For the current city scene:

- derive the walkable outer diamond bounds
- place four gate nodes at the midpoint of the top, right, bottom, and left scene edges

## Path Rules

Each NPC spawn cycle uses:

1. pick two distinct nodes from the full node pool
2. reject identical start/end
3. solve the shortest route on the walkable grid
4. if route fails, retry with a new pair up to a bounded limit
5. if retries fail, skip this spawn attempt

The path must avoid all building-occupied tiles.

## NPC Lifecycle

Each ambient NPC follows this sequence:

1. manager requests a descriptor
2. manager picks start/end nodes
3. manager solves a path
4. renderer creates a visual capsule at the start point
5. NPC advances along path at a fixed ambient walk speed
6. capsule bobs slightly in Y during movement
7. upon reaching destination, the NPC is removed
8. manager schedules replacement until the `4..8` target range is satisfied

## Sorting / Occlusion

The NPC foot anchor is the sorting reference.

Rule:

- if the foot anchor is below the lower two edges of a building diamond, the NPC renders in front of that building
- if the foot anchor is above the upper two edges of a building diamond, the NPC renders behind that building

Implementation detail is flexible, but the result must be driven by a stable per-frame sort key derived from:

- NPC foot world position
- building footprint relation

This must integrate with existing `pixel-workflow` render ordering rather than introducing a separate DOM layer.

## Future NPC-Pool Hook

This slice must preserve a clean provider seam for real NPC data later.

Introduce a descriptor-level contract such as:

```js
function getAmbientNpcDescriptors(sceneId) {
  return [
    {
      type: "capsule-placeholder",
      palette: "neutral",
      speed: 1,
    },
  ];
}
```

Current behavior:

- runtime uses a default internal provider that returns anonymous visual placeholders

Future behavior:

- later work can replace the provider with real NPC-pool-backed descriptors
- pathing, count maintenance, and rendering lifecycle stay unchanged

## Non-Goals

This slice does **not** do the following:

- add city NPC clicking, dialogue, quests, or interaction prompts
- bind ambient walkers to the formal NPC roster yet
- perform a `kulan` -> `haozhou` naming migration
- use an external prefab JSON as runtime geometry truth
- render final character art or spine animation for walkers
- add ambient NPC logic to interiors

## Error Handling

The runtime should fail closed and stay visual-safe.

Examples:

- no eligible nodes -> ambient runtime disables itself for that scene
- no route between chosen nodes -> retry with a different node pair
- too few valid routes -> allow temporary count below `4`
- missing building footprint data -> exclude that object from entrance generation rather than guessing
- embedded scene not recognized as city exterior -> runtime stays disabled

## Testing Strategy

Testing must cover logic and source integration.

### Logic Tests

- scene index extracts blocked tiles and node lists from scene objects
- entrance-node calculation uses the left-lower edge center rule
- gate-node calculation yields four edge midpoints
- pathfinding avoids blocked tiles
- manager never chooses identical start/end nodes
- manager maintains the active count window

### Source / Integration Tests

- embedded city runtime is wired into `pixel-workflow`
- ambient NPCs are excluded from interaction-menu discovery
- sort-key calculation hook exists for building-vs-NPC ordering
- runtime only enables for embedded city exterior scenes

### Manual Verification

From `http://localhost:5173/`:

- enter the current Haozhou city visualization
- observe `4..8` ambient walkers at all times
- confirm walkers spawn/despawn at nodes
- confirm routes avoid buildings
- confirm walkers visually pass behind/in front of buildings correctly
- confirm walkers are not clickable and never appear in interaction UI

## Exit Conditions

This design is satisfied when:

1. Embedded city exterior scenes maintain `4..8` ambient walkers.
2. Routes are derived from current `HD2DEG` scene objects and avoid buildings.
3. Walkers sort correctly against buildings.
4. Walkers remain non-interactive.
5. A documented provider seam exists for later NPC-pool integration.
