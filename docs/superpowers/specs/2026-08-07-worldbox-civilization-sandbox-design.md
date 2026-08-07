# Worldbox Civilization Sandbox Design

**Date:** `2026-08-07`  
**Scope:** campaign hex map sandbox validation mode with visible individuals, lords, settlement growth, farms, houses, and territory overlays  
**Status:** `approved`

## Goal

Build a WorldBox-like civilization sandbox on the existing campaign map framework.

The first version is a validation mode that should already be fun to watch:

1. The user can place different founding lords on the campaign map.
2. Each lord immediately creates a small civilization with visible individuals.
3. Individuals move around, gather, farm, build houses, reproduce, expand territory, and later can fight.
4. Houses, farms, and future forts should appear as visible map changes, not only as counters.
5. The system should remain isolated enough for experimentation, while preserving a future path into the main historical simulation game.

This is not a house feature and must not use the special-house module interface. It is a campaign map sandbox/runtime feature.

## Current Project Fit

The repo already has useful pieces for this feature:

- campaign hex data through `MapDefinition.campaignHexGridUrl`
- campaign hex helpers in `src/domain/campaign-hex.ts`
- campaign map rendering in `src/ui/views/map/map-view.ts` and `campaign-terrain-webgl.ts`
- map exploration and revealed hex state under `GameState.runtime`
- time progression by morning, afternoon, and night in `src/application/time/time-progression.ts`
- city ambient walker sprite assets under `ui/npc/city-ambient-walkers`

The sandbox should reuse these existing mechanisms instead of adding one-off map logic.

## Chosen Approach

Use a lightweight formal runtime subsystem:

- domain types under a future `src/domain/civilization-sandbox.ts`
- pure simulation rules under a future `src/application/civilization-sandbox/*`
- persisted runtime state under `GameState.runtime.civilizationSandbox`
- presenter projection into the map view model
- UI/view rendering as a campaign map overlay and optional debug control panel

The current validation entry can be a debug/sandbox control surface. The data and simulation contract should still be shaped as production runtime state so it can later feed factions, settlements, events, or map nodes.

## Non-Goals For The First Slice

The first slice does not need:

- full diplomacy
- full war campaigns
- formal army formations
- main-story integration
- city/house integration
- permanent scenario-pack authoring UI
- detailed 3D character models

It should preserve seams for those later.

## Core Objects

### Individual

The sandbox is individual-driven. A civilization is not just a set of numbers.

Each individual should have:

```ts
type SandboxIndividual = {
  id: string;
  name: string;
  raceId: SandboxRaceId;
  civilizationId: string;
  settlementId: string | null;
  householdId: string | null;
  role:
    | "lord"
    | "farmer"
    | "builder"
    | "forager"
    | "fighter"
    | "child"
    | "idle";
  age: number;
  sex: "male" | "female";
  hex: { x: number; y: number };
  direction: "right-up" | "right-down" | "left-up" | "left-down";
  spriteVariantId: string;
  needs: {
    hunger: number;
    stamina: number;
  };
  traits: string[];
  task: SandboxTask | null;
};
```

Individuals own visible movement and local labor. The civilization AI creates demand, but individuals fulfill that demand through tasks.

### Lord

A lord is a special individual with `role: "lord"`.

Placing a lord creates:

- a lord individual
- a civilization
- an initial claimed hex
- an initial camp or settlement
- a few starting adults
- a starting resource stockpile

The lord affects priority ordering:

- expansion vs farming
- building vs gathering
- conflict vs avoidance
- stockpiling vs growth

If a lord dies or disappears later, the civilization selects an adult successor. If there is no valid successor, the civilization enters decline.

### Household

Households group reproduction and housing pressure.

Each household should track:

- member ids
- house structure id, if housed
- recent birth cooldown
- local food security

This keeps reproduction from becoming a raw civilization counter.

### Settlement

A settlement is a cluster of structures and claimed land.

Settlement levels can start simple:

- `camp`
- `village`
- `fort`
- `town`

The first slice only needs camp and village behavior. Fort is a visual and data seam for a later slice.

### Civilization

A civilization tracks:

- race id
- color
- lord id
- settlement ids
- claimed hex keys
- resource stockpile
- technology progress
- reserved diplomatic stance state
- activity log

Civilization color is used by the territory overlay.

## Three Race Templates

### Wu Tong

Initial lord name: `吴同`

Behavior:

- high combat strength
- aggressive expansion
- higher border-conflict chance
- normal farming
- normal technology
- normal building efficiency

Name rule:

- children are named `吴X同`
- `X` is randomly selected from a common Chinese character pool
- examples: `吴安同`, `吴仲同`, `吴远同`
- after the configured pool is exhausted, names fall back to `吴同二世`, `吴同三世`, and so on

### Yu Qingqing

Initial lord name: `于晴晴`

Behavior:

- farming preference
- conservative expansion
- high food stability
- high conflict avoidance
- slower border pressure
- normal building and technology

Name rule:

- children are named `于XX`
- `XX` is a reduplicated nickname
- examples: `于晶晶`, `于青青`, `于暖暖`, `于臭臭`
- after the configured nickname pool is exhausted, names fall back to `于晴晴二世`, `于晴晴三世`, and so on

### Chen Yihan

Initial lord name: `陈倚晗`

Behavior:

- fast technology progress
- high building efficiency
- strong preference for houses, storage, and later workshops
- medium farming
- medium combat
- medium expansion

Name rule:

- children are named `陈1晗` through `陈99晗`
- after `陈99晗`, names fall back to `陈倚晗二世`, `陈倚晗三世`, and so on

## Name Exhaustion Rule

Every race has a deterministic name generator keyed by civilization id and birth order.

If a race-specific naming pool or sequence is exhausted, the fallback format is:

```text
<founder-name><generation-label>
```

Examples:

- `吴同二世`
- `于晴晴三世`
- `陈倚晗四世`

The generation label should be deterministic and not depend on current alive population count.

## Visual Assets

Individuals do not use new 3D models in the validation slice.

Use existing four-direction city ambient walker PNGs from:

```text
ui/npc/city-ambient-walkers/
```

The current files include variants such as:

- `平民1`
- `平民2`
- `文人1`
- `文官1`
- `贵族1`
- `贵族2`
- `僧人1`
- `和尚1`

Each variant has:

- `右上`
- `右下`
- `左上`
- `左下`

Runtime-facing data should reference resource ids such as `sandbox.walker.commoner1.rightUp`, not hardcoded file paths in simulation code. A future asset manifest or resolver can map those ids to the existing PNGs.

Sprite selection for the first slice:

- lords prefer `贵族` or `文官` variants
- builders and farmers prefer `平民`
- technology-focused citizens can use `文人`
- fallback can randomly choose any valid variant

## Simulation Tick

The sandbox tick is not per-frame AI.

The recommended first version uses a deterministic simulation tick:

- paused
- single-step
- slow
- normal
- fast

Each tick:

1. Settlements calculate demand.
2. Lords adjust demand priority by race template.
3. Idle individuals receive tasks.
4. Individuals advance movement or work progress.
5. Completed work mutates sandbox state.
6. Households consume food and evaluate reproduction.
7. Civilizations update claimed territory.
8. The runtime emits a compact event log for debugging.

The tick may later be tied to game time segments, but validation mode can run faster than the main calendar.

## Task Types

The first version should support these tasks:

- `forage`: gather food or wood from nearby land
- `build-house`: convert a claimed hex or structure slot into a rural house
- `build-farm`: convert suitable land into a farm tile
- `farm`: produce food from farm tiles
- `claim-hex`: claim adjacent passable land
- `patrol`: move near border hexes and discourage rivals
- `idle`: wander locally

War can start as a minimal border conflict rule, not a full battle system.

## Terrain And Structure Effects

The sandbox needs visible world changes.

### Houses

Building a house means the target land cell gains a rural-house structure.

Visual effect:

- the hex becomes occupied by a small rural-house model or marker
- in the first validation slice, this can be a map overlay marker
- later it should use the campaign structure renderer/profile system

Gameplay effect:

- adds household capacity
- increases settlement footprint
- can anchor family membership

The simulation state should store a structure record, for example:

```ts
type SandboxStructure = {
  id: string;
  kind: "rural-house" | "farm" | "storage" | "fort";
  civilizationId: string;
  settlementId: string;
  hex: { x: number; y: number };
  buildProgress: number;
  workers: string[];
};
```

### Farms

Opening farmland means the target hex becomes a farm.

Visual effect:

- the ground material/overlay for that hex becomes `farm`
- first slice can render this as a flat farm overlay or texture tint
- later the renderer can consume a semantic overlay to apply a farm ground texture

Gameplay effect:

- creates recurring food production
- attracts farmer tasks
- makes Yu Qingqing civilizations more stable

Farm visuals must remain sandbox overlay data until the feature is intentionally promoted into map content. They must not rewrite the source campaign hex JSON during validation.

### Forts

Fort is a reserved structure kind.

First slice:

- store `fort` as a planned future structure kind
- no need to implement fort construction

Later:

- fort construction can create a fort model
- fort can improve defense, claim radius, and border pressure
- fort visuals should use a campaign structure profile rather than ad hoc imports

## Territory View

The sandbox needs a view mode toggle.

Base view:

- shows terrain, people, houses, farms, and settlement markers
- territory can remain subtle or hidden

Territory view:

- every claimed hex displays the owning civilization color
- unclaimed hexes are transparent
- contested border hexes can show a striped or pulsing overlay later
- clicking a civilization, lord, settlement, or individual can filter/highlight its relevant territory

The user specifically wants:

> 点击后每个人的领土 hex 显示对应颜色。

For the first implementation, interpret this as:

- clicking an individual selects that individual's civilization
- all hexes claimed by that civilization render in the civilization color
- the selected individual and its household/settlement can receive stronger emphasis

If later individual-owned plots become necessary, add `ownedHexKeysByIndividualId` as a refinement. Do not add individual land ownership in the first slice unless the simulation needs it.

## Map View Integration

Map UI should receive sandbox projection through the map view model.

Recommended projection:

```ts
type CivilizationSandboxMapOverlay = {
  enabled: boolean;
  viewMode: "normal" | "territory";
  selectedEntityId: string | null;
  individuals: Array<{
    id: string;
    name: string;
    civilizationId: string;
    hex: { x: number; y: number };
    direction: "right-up" | "right-down" | "left-up" | "left-down";
    spriteResourceId: string;
    role: string;
    taskLabel: string;
  }>;
  structures: Array<{
    id: string;
    kind: "rural-house" | "farm" | "storage" | "fort";
    civilizationId: string;
    hex: { x: number; y: number };
    progress: number;
  }>;
  claimedHexes: Array<{
    hex: { x: number; y: number };
    civilizationId: string;
    colorToken: string;
  }>;
};
```

The renderer can turn this into:

- sprite markers for individuals
- small rural-house model/marker overlays
- farm ground overlays
- territory color overlays

Gameplay simulation must not depend on DOM nodes, CSS classes, WebGL objects, or camera state.

## Sandbox Controls

The validation UI should include:

- pause/play
- speed selector
- single tick
- clear sandbox
- place lord: `吴同`
- place lord: `于晴晴`
- place lord: `陈倚晗`
- toggle territory view
- optional selected entity inspector

The control panel is validation UI. It should not become main-game UX by default.

## State Boundary

Sandbox state belongs under the unified game state, for example:

```ts
type CivilizationSandboxState = {
  enabled: boolean;
  seed: string;
  tick: number;
  mode: "validation";
  selectedEntityId: string | null;
  viewMode: "normal" | "territory";
  civilizationsById: Record<string, SandboxCivilization>;
  individualsById: Record<string, SandboxIndividual>;
  householdsById: Record<string, SandboxHousehold>;
  settlementsById: Record<string, SandboxSettlement>;
  structuresById: Record<string, SandboxStructure>;
  claimedHexByKey: Record<string, string>;
  recentEvents: SandboxEvent[];
};
```

This state must not mutate:

- player base stats
- player money
- player skills
- player inventory
- formal city ownership
- source map JSON

Future integration can explicitly promote sandbox results into formal runtime systems.

## Future Integration Channels

The design preserves future channels:

- sandbox civilization can become a faction or clan
- sandbox settlement can become a formal map node
- rural houses can become settlement visuals
- farms can feed market or famine systems
- forts can feed military movement and control radius
- lords can be promoted into character definitions or generated historical-character-like records
- sandbox events can trigger story/event definitions

These promotions must be explicit. Validation state must not silently become main-game state.

## Main Shell Boundary

Do not add sandbox business logic to `src/main.ts`.

Allowed future shell-level changes are limited to coordinator wiring if needed. Actual behavior should live in:

- `src/domain/civilization-sandbox.ts`
- `src/application/civilization-sandbox/*`
- `src/application/runtime/coordinators/*` or a narrowly scoped transition coordinator
- `src/application/presenter/*` or map presenter projection
- `src/ui/views/map/*` for visual rendering only

If styles are added, they must use design tokens according to `docs/main-shell-contract.md`.

## Error Handling

The sandbox should fail closed.

Examples:

- no campaign hex grid loaded: disable lord placement and show a validation message
- clicked hex is water: reject placement
- no valid adjacent claim hex: settlement stops expanding
- name pool exhausted: use generation fallback
- missing sprite resource: use a known default walker sprite
- too many individuals: cap births and log population pressure

## Performance Rules

The first validation target can support roughly 200 to 500 visible individuals.

Rules:

- simulation tick is discrete
- no full-map pathfinding for every individual every frame
- short local movement can use greedy or bounded BFS over nearby hexes
- distant or offscreen individuals may be batch-updated later
- renderer should consume compact overlay arrays, not the entire simulation state

## Testing Strategy

Add focused tests when implementation begins.

Domain and simulation tests:

- race templates produce expected priorities
- name generators produce `吴X同`, `于XX`, and `陈1晗..陈99晗`
- exhausted name pools fall back to generation names
- placing a lord creates civilization, lord, settlement, and claimed hex
- farmland and house construction create structure records
- households reproduce only when food and housing allow it
- territory claims remain land-only and adjacent unless a future rule says otherwise

Boundary tests:

- sandbox state initializes under `GameState.runtime`
- sandbox mutations do not alter player money, inventory, or base stats
- map presenter exposes sandbox overlay data without returning HTML from application modules
- `src/main.ts` does not gain concrete sandbox business branches

View/source tests:

- map view model accepts sandbox overlay data
- farm overlays and rural-house markers are represented from view model data
- territory view exposes claimed hex colors
- walker sprite ids are resource ids or resolver outputs, not simulation-layer file paths

Manual verification:

1. Start sandbox validation mode.
2. Place `吴同`, `于晴晴`, and `陈倚晗` on valid land.
3. Confirm visible individuals spawn and walk using four-direction walker sprites.
4. Confirm houses appear as rural-house cells/markers.
5. Confirm farms appear as farm ground overlays.
6. Confirm populations reproduce with race-specific names.
7. Confirm territory view colors claimed hexes by selected civilization.
8. Confirm speed controls, pause, and single-step are understandable.

## Acceptance Criteria

The design is satisfied when the first implementation can demonstrate:

1. Placing each of the three lords creates a visible civilization.
2. Many individuals move on the existing campaign hex map.
3. Individuals use existing four-direction city ambient walker art.
4. The three race templates affect behavior and naming.
5. Houses visibly create rural-house structures.
6. Farms visibly create farm ground overlays.
7. Territory view colors claimed hexes by civilization after selecting an entity.
8. Sandbox state remains isolated from player stats, inventory, and source map data.
9. No sandbox business logic is added to `src/main.ts`.
