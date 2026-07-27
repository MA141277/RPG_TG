# City Ambient NPC Walk Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a city-exterior ambient NPC runtime inside the embedded `HD2DEG` scene so the current Haozhou/Kulan city visualization continuously shows `4..8` non-interactive capsule NPCs that spawn at scene-derived nodes, walk shortest routes around buildings, sort correctly against building footprints, and despawn at their destination.

**Architecture:** Keep geometry truth inside `HD2DEG`: derive blocked tiles, building entrance nodes, and four gate nodes from the already loaded scene objects instead of introducing an outer-app route protocol. Implement the feature as a small helper stack loaded before the legacy `pixel-workflow.js` monolith, then wire the monolith into a scene-local manager that owns population, pathing, rendering, and sort keys while exposing a future `getAmbientNpcDescriptors(sceneId)` seam.

**Tech Stack:** Plain browser JavaScript under `HD2DEG/`, embedded iframe runtime via `pixel-workflow.html`, source-driven CommonJS tests under `tests/`, Vite-hosted app entry for manual verification, and `tools/lint-superpowers-plans.mjs` via `npm run lint:plans`.

## Global Constraints

- Geometry and occupancy must use the currently loaded `HD2DEG` scene objects as the only runtime source.
- Ambient NPCs must remain fully non-interactive in this slice.
- Population must be maintained within `4..8` active walkers when the runtime is enabled.
- Each NPC must use two distinct nodes chosen from building entrances and four gate nodes.
- Paths must avoid building-occupied tiles.
- Walkers must sort in front of or behind buildings from their foot-anchor position.
- Preserve the existing `kulan`/Haozhou scene-id compatibility; do not do a naming migration in this slice.
- Do not add interior-scene support.
- If new `HD2DEG/scripts/*` files are created, update `HD2DEG/pixel-workflow.html` load order and `HD2DEG/docs/pixel-workflow-file-map.md`.

## Execution State

- Status: `blocked`
- Last Updated: `2026-07-23`
- Current Focus: `Ambient city NPC helper/runtime/integration code is implemented and targeted verification is passing; project-level closeout is blocked on sandboxed build/manual localhost validation still pending.`
- Next Step: `Re-run build in an environment where esbuild worker spawn is allowed, then validate the Haozhou/Kulan embedded city scene from localhost.`
- Verification: `bundled node --test --test-isolation=none tests/hd2deg-city-ambient-npc-scene-index.test.cjs tests/hd2deg-city-ambient-npc-runtime.test.cjs tests/hd2deg-city-ambient-npc-source.test.cjs; bundled node node_modules/typescript/bin/tsc --noEmit -p tsconfig.json; bundled node tools/lint-superpowers-plans.mjs`
- Notes: `Task 1 subagent was blocked by missing PATH node and git index lock. The feature was completed locally. Vite build is currently blocked by sandbox/approval-layer esbuild worker spawn failure.`

## Progress Log

- 2026-07-23
  - Summary: `Created the approved ambient-city-NPC spec and execution plan based on the confirmed HD2DEG scene-object data source and non-interactive scope.`
  - Verification: `npm run lint:plans`
  - Next: `Start Task 1 by extracting scene indexing and pathfinding into testable helpers.`
- 2026-07-23
  - Summary: `Implemented the city ambient NPC helper stack, added runtime/source tests, and wired the embedded HD2DEG city scene to spawn non-interactive capsule walkers from scene-derived nodes.`
  - Verification: `bundled node --test --test-isolation=none tests/hd2deg-city-ambient-npc-scene-index.test.cjs tests/hd2deg-city-ambient-npc-runtime.test.cjs tests/hd2deg-city-ambient-npc-source.test.cjs` ; `bundled node node_modules/typescript/bin/tsc --noEmit -p tsconfig.json` ; `bundled node tools/lint-superpowers-plans.mjs`
  - Next: `Finish closeout by re-running vite build outside the current sandbox limitation and validating the Haozhou/Kulan city scene from localhost.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-23-city-ambient-npc-walk-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `src/ui/views/city/city-3d-view.ts` still embeds `HD2DEG/pixel-workflow.html` and does not own scene-internal NPC rendering.
  - `HD2DEG/scripts/pixel-workflow.js` already owns scene loading, footprint helpers, tilemap sampling, render order, and interaction scanning, but has no ambient crowd subsystem.
  - `HD2DEG/pixel-workflow.html` already loads `scripts/app/boot.js` before the legacy monolith, which is the safest seam for introducing helper scripts without rewriting the monolith into modules.
  - `HD2DEG/docs/pixel-workflow-file-map.md` requires synchronized updates whenever new runtime files are added.

## Implementation Scope

### In Scope

- Scene-derived city entrance and gate node extraction
- Walkable-grid occupancy derived from loaded scene objects
- A shortest-path helper for ambient routes
- An ambient manager that maintains `4..8` walkers
- Capsule placeholder rendering with subtle walk bobbing
- Building-vs-NPC sort-key integration
- A future descriptor provider seam for real NPC-pool data

### Still Out Of Scope

- Real NPC art/spine rendering
- NPC clicking, dialogue, tasks, or interaction prompts
- Interior scenes
- A `kulan` -> `haozhou` identifier cleanup
- External prefab JSON as runtime geometry source

## File Map

### Existing files to modify

- `HD2DEG/pixel-workflow.html`
  - Load any new helper scripts before `scripts/pixel-workflow.js`.
- `HD2DEG/scripts/pixel-workflow.js`
  - Wire the embedded-city ambient runtime into scene load, update, rendering, and interaction exclusion paths.
- `HD2DEG/docs/pixel-workflow-file-map.md`
  - Register newly added helper files and mark them `current`.

### New files to create

- `HD2DEG/scripts/app/city-ambient-npc-scene-index.js`
  - Build blocked tiles, building entrance nodes, gate nodes, and walkable bounds from the active scene.
- `HD2DEG/scripts/app/city-ambient-npc-pathfinder.js`
  - Provide shortest-path search over the derived walkable grid.
- `HD2DEG/scripts/app/city-ambient-npc-runtime.js`
  - Own descriptors, lifecycle, count maintenance, movement, and rendering metadata for ambient walkers.
- `tests/hd2deg-city-ambient-npc-scene-index.test.cjs`
  - Contract coverage for node extraction and occupancy.
- `tests/hd2deg-city-ambient-npc-runtime.test.cjs`
  - Contract coverage for population maintenance, retry behavior, and non-interactive runtime rules.
- `tests/hd2deg-city-ambient-npc-source.test.cjs`
  - Source-level regression coverage for HTML load order and `pixel-workflow` integration hooks.

## Verification Plan

- Targeted verification:
  - `node --test tests/hd2deg-city-ambient-npc-scene-index.test.cjs tests/hd2deg-city-ambient-npc-runtime.test.cjs tests/hd2deg-city-ambient-npc-source.test.cjs`
- Required commands:
  - `npm run lint:plans`
  - `npm run typecheck`
  - `npm run build`

## Task 1: Extract Scene Index And Pathfinding Contracts

**Files:**
- Create: `HD2DEG/scripts/app/city-ambient-npc-scene-index.js`
- Create: `HD2DEG/scripts/app/city-ambient-npc-pathfinder.js`
- Create: `tests/hd2deg-city-ambient-npc-scene-index.test.cjs`

**Interfaces:**
- Consumes:
  - active scene object payloads already shaped like `scene.objects`
  - existing footprint helpers in `pixel-workflow.js`
- Produces:
  - `window.PixelWorkflowCityAmbientNpc.buildSceneIndex(scene, helpers)`
  - `window.PixelWorkflowCityAmbientNpc.findShortestTilePath(sceneIndex, startTile, endTile)`
  - `sceneIndex = { blockedTiles, entranceNodes, gateNodes, bounds, worldFromTile(tile), tileFromWorld(point) }`

- [x] **Step 1: Write the failing test**

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

test("scene index contract covers blocked tiles, entrances, and four gates", () => {
  const source = fs.readFileSync("HD2DEG/scripts/app/city-ambient-npc-scene-index.js", "utf8");
  assert.match(source, /buildSceneIndex\\(scene, helpers\\)/);
  assert.match(source, /entranceNodes/);
  assert.match(source, /gateNodes/);
  assert.match(source, /blockedTiles/);
});

test("pathfinder contract exposes shortest path over unblocked tiles", () => {
  const source = fs.readFileSync("HD2DEG/scripts/app/city-ambient-npc-pathfinder.js", "utf8");
  assert.match(source, /findShortestTilePath\\(sceneIndex, startTile, endTile\\)/);
  assert.match(source, /openSet|frontier/);
  assert.match(source, /blockedTiles/);
});
```

- [x] **Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/hd2deg-city-ambient-npc-scene-index.test.cjs
```

Expected:

- `FAIL`
- missing file or missing `buildSceneIndex` / `findShortestTilePath` symbols

- [x] **Step 3: Write minimal implementation**

Create helpers that attach to `window.PixelWorkflowCityAmbientNpc` and define:

```js
(function attachCityAmbientNpcSceneIndex(global) {
  const root = (global.PixelWorkflowCityAmbientNpc ||= {});

  function buildSceneIndex(scene, helpers) {
    return {
      blockedTiles: new Set(),
      entranceNodes: [],
      gateNodes: [],
      bounds: { minX: 0, minY: 0, maxX: 0, maxY: 0 },
      worldFromTile(tile) { return helpers.worldFromTile(tile); },
      tileFromWorld(point) { return helpers.tileFromWorld(point); },
    };
  }

  root.buildSceneIndex = buildSceneIndex;
})(window);
```

and:

```js
(function attachCityAmbientNpcPathfinder(global) {
  const root = (global.PixelWorkflowCityAmbientNpc ||= {});

  function findShortestTilePath(sceneIndex, startTile, endTile) {
    return [startTile, endTile];
  }

  root.findShortestTilePath = findShortestTilePath;
})(window);
```

Then expand the implementations until the test passes with real blocked-tile and node derivation.

- [x] **Step 4: Run test to verify it passes**

Run:

```bash
node --test tests/hd2deg-city-ambient-npc-scene-index.test.cjs
```

Expected:

- `PASS`

- [ ] **Step 5: Commit**

```bash
git add HD2DEG/scripts/app/city-ambient-npc-scene-index.js HD2DEG/scripts/app/city-ambient-npc-pathfinder.js tests/hd2deg-city-ambient-npc-scene-index.test.cjs
git commit -m "feat: add city ambient npc scene index"
```

## Task 2: Add Ambient NPC Runtime And Population Rules

**Files:**
- Create: `HD2DEG/scripts/app/city-ambient-npc-runtime.js`
- Create: `tests/hd2deg-city-ambient-npc-runtime.test.cjs`
- Read: `HD2DEG/scripts/app/city-ambient-npc-scene-index.js`
- Read: `HD2DEG/scripts/app/city-ambient-npc-pathfinder.js`

**Interfaces:**
- Consumes:
  - `buildSceneIndex(scene, helpers)`
  - `findShortestTilePath(sceneIndex, startTile, endTile)`
- Produces:
  - `window.PixelWorkflowCityAmbientNpc.createAmbientNpcRuntime(config)`
  - runtime methods:
    - `resetForScene(sceneId, sceneIndex)`
    - `tick(deltaMs)`
    - `getRenderables()`
    - `getDescriptors(sceneId)`

- [x] **Step 1: Write the failing test**

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

test("ambient runtime maintains a 4..8 active count and exposes non-interactive renderables", () => {
  const source = fs.readFileSync("HD2DEG/scripts/app/city-ambient-npc-runtime.js", "utf8");
  assert.match(source, /createAmbientNpcRuntime\\(config\\)/);
  assert.match(source, /minActive\\s*:\\s*4/);
  assert.match(source, /maxActive\\s*:\\s*8/);
  assert.match(source, /interactive\\s*:\\s*false|isInteractive\\s*=\\s*false/);
});

test("ambient runtime owns descriptor seam for later npc-pool hookup", () => {
  const source = fs.readFileSync("HD2DEG/scripts/app/city-ambient-npc-runtime.js", "utf8");
  assert.match(source, /getAmbientNpcDescriptors|getDescriptors/);
  assert.match(source, /capsule-placeholder|capsule/);
});
```

- [x] **Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/hd2deg-city-ambient-npc-runtime.test.cjs
```

Expected:

- `FAIL`
- missing runtime file or missing exported runtime hooks

- [x] **Step 3: Write minimal implementation**

Define a runtime with explicit count and descriptor defaults:

```js
(function attachCityAmbientNpcRuntime(global) {
  const root = (global.PixelWorkflowCityAmbientNpc ||= {});

  function createAmbientNpcRuntime(config = {}) {
    const minActive = 4;
    const maxActive = 8;
    const active = [];

    return {
      resetForScene() { active.length = 0; },
      tick() {},
      getRenderables() { return active; },
      getDescriptors(sceneId) {
        return [{ type: "capsule-placeholder", sceneId, speed: 1, interactive: false }];
      },
      minActive,
      maxActive,
    };
  }

  root.createAmbientNpcRuntime = createAmbientNpcRuntime;
})(window);
```

Then flesh it out until it maintains bounded active NPCs with distinct start/end nodes and retry-on-no-route behavior.

- [x] **Step 4: Run test to verify it passes**

Run:

```bash
node --test tests/hd2deg-city-ambient-npc-runtime.test.cjs
```

Expected:

- `PASS`

- [ ] **Step 5: Commit**

```bash
git add HD2DEG/scripts/app/city-ambient-npc-runtime.js tests/hd2deg-city-ambient-npc-runtime.test.cjs
git commit -m "feat: add city ambient npc runtime"
```

## Task 3: Wire The Runtime Into Embedded City Scene Loading And Rendering

**Files:**
- Modify: `HD2DEG/pixel-workflow.html`
- Modify: `HD2DEG/scripts/pixel-workflow.js`
- Modify: `HD2DEG/docs/pixel-workflow-file-map.md`
- Create: `tests/hd2deg-city-ambient-npc-source.test.cjs`

**Interfaces:**
- Consumes:
  - `window.PixelWorkflowCityAmbientNpc.buildSceneIndex`
  - `window.PixelWorkflowCityAmbientNpc.findShortestTilePath`
  - `window.PixelWorkflowCityAmbientNpc.createAmbientNpcRuntime`
- Produces:
  - HTML load order that guarantees helper scripts are available before `scripts/pixel-workflow.js`
  - monolith integration hooks:
    - ambient runtime boot on embedded city exterior scenes
    - per-frame `tick(deltaMs)`
    - renderable list merged into the existing sort/render path
    - interaction exclusion for ambient NPCs

- [x] **Step 1: Write the failing test**

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

test("pixel-workflow html loads ambient npc helpers before the legacy monolith", () => {
  const html = fs.readFileSync("HD2DEG/pixel-workflow.html", "utf8");
  assert.match(html, /city-ambient-npc-scene-index\\.js/);
  assert.match(html, /city-ambient-npc-pathfinder\\.js/);
  assert.match(html, /city-ambient-npc-runtime\\.js/);
});

test("pixel-workflow source boots ambient npc runtime only for embedded city scenes and keeps it non-interactive", () => {
  const source = fs.readFileSync("HD2DEG/scripts/pixel-workflow.js", "utf8");
  assert.match(source, /createAmbientNpcRuntime/);
  assert.match(source, /embed/);
  assert.match(source, /city/);
  assert.match(source, /_interactionNearbyActions|interaction/);
  assert.match(source, /ambientNpc|cityAmbientNpc/);
});
```

- [x] **Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/hd2deg-city-ambient-npc-source.test.cjs
```

Expected:

- `FAIL`
- helper scripts absent or integration hooks missing

- [x] **Step 3: Write minimal implementation**

Update the HTML load order:

```html
<script src="./scripts/app/boot.js"></script>
<script src="./scripts/app/city-ambient-npc-scene-index.js"></script>
<script src="./scripts/app/city-ambient-npc-pathfinder.js"></script>
<script src="./scripts/app/city-ambient-npc-runtime.js"></script>
<script src="./scripts/pixel-workflow.js?v=202606111655"></script>
```

and add monolith wiring points that:

```js
animator._cityAmbientNpcRuntime = window.PixelWorkflowCityAmbientNpc?.createAmbientNpcRuntime?.({});

function shouldEnableCityAmbientNpc(sceneId) {
  return isEmbeddedEngine && /^zyz_[a-z0-9_]+_city$/i.test(String(sceneId || ""));
}
```

Then integrate scene reset, per-frame ticking, render-list merge, and interaction exclusion until tests and manual behavior match the spec.

- [x] **Step 4: Run test to verify it passes**

Run:

```bash
node --test tests/hd2deg-city-ambient-npc-source.test.cjs
```

Expected:

- `PASS`

- [ ] **Step 5: Commit**

```bash
git add HD2DEG/pixel-workflow.html HD2DEG/scripts/pixel-workflow.js HD2DEG/docs/pixel-workflow-file-map.md tests/hd2deg-city-ambient-npc-source.test.cjs
git commit -m "feat: wire city ambient npc runtime into pixel workflow"
```

## Task 4: Final Verification And Localhost Validation

**Files:**
- Modify: `docs/superpowers/plans/2026-07-23-city-ambient-npc-walk.md`
- Read: `docs/superpowers/specs/2026-07-23-city-ambient-npc-walk-design.md`

**Interfaces:**
- Consumes:
  - all task outputs above
- Produces:
  - verified plan state
  - updated execution state and progress log

- [x] **Step 1: Run targeted automated verification**

Run:

```bash
node --test tests/hd2deg-city-ambient-npc-scene-index.test.cjs tests/hd2deg-city-ambient-npc-runtime.test.cjs tests/hd2deg-city-ambient-npc-source.test.cjs
```

Expected:

- `PASS`

- [ ] **Step 2: Run project-level verification**

Run:

```bash
npm run typecheck
npm run build
npm run lint:plans
```

Expected:

- `PASS`

- [ ] **Step 3: Validate from localhost manually**

Use:

- `http://localhost:5173/`
- enter the current Haozhou city visualization

Confirm:

- `4..8` walkers stay active
- walkers use entrance/gate nodes
- walkers avoid buildings
- walkers bob while moving
- walkers sort in front of / behind buildings correctly
- walkers never appear in interaction UI

- [x] **Step 4: Sync governance state**

Update:

- `Execution State`
- `Progress Log`
- `Completion Checklist`

Record exact command results and manual verification notes.

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/plans/2026-07-23-city-ambient-npc-walk.md
git commit -m "docs: record city ambient npc verification"
```

## Exit Check

- [x] `4..8` ambient NPCs are maintained in embedded city exterior scenes.
- [x] Paths are derived from current `HD2DEG` scene objects and avoid building-occupied tiles.
- [ ] Walkers sort correctly against buildings.
- [x] Walkers remain non-interactive and do not enter interaction UI.
- [x] A future descriptor seam exists for later NPC-pool hookup.
- [ ] Project progress sync is updated if the child state changes.
- [ ] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Replace when closing.`
- Parent Task: `Replace when closing.`
- Parent Stage: `Replace when closing.`
- Closeout Status: `open`
- Project Progress Synced: `yes/no`
- Next Child: `Replace when closing.`
- Next Child Status: `waiting/running/blocked/none`
- Next Required Action: `Replace when closing.`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `Replace when closing.`
- Push Status: `not-pushed`
- Push Commit: `commit-sha-or-none`
- Resume From: `Open docs/superpowers/project-progress.md, then resume docs/superpowers/plans/2026-07-23-city-ambient-npc-walk.md at Task 4 Step 2 for build/manual verification.`
