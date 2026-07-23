# Formal City Stage JSON Ambient NPC Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the playable city view onto the formal prefab/layout JSON stage path, automatically discover city stage files by naming convention, and render `4..8` non-interactive ambient NPC walkers on that formal city stage so new same-structure cities can be added with JSON files only.

**Architecture:** First restore the active formal city-stage foundation into this worktree, because the current worktree still only has the older hardcoded isometric map view while the main repo has already introduced `city-stage-layout` runtime files plus Haozhou prefab/layout JSON examples. Then replace hardcoded Haozhou stage imports with a discovery registry, derive reusable stage geometry from discovered city JSON, and attach an ambient NPC runtime that renders capsule walkers on the formal city scene without touching the deprecated `HD2DEG` / `3D` path.

**Tech Stack:** TypeScript UI/runtime modules under `src/ui/views/city` and `src/main.ts`, JSON stage assets under `tools/city-map-building-editor/examples`, CommonJS node tests under `tests`, TypeScript verification via `npm run typecheck`, build verification via `npm run build`, and plan linting via `npm run lint:plans`.

## Global Constraints

- Target only the formal city UI path; do not add new work to `HD2DEG` or `city-3d-view.ts`.
- Formal city stage data must come from the prefab/layout JSON workflow.
- New same-structure cities must be onboarded without adding city-specific runtime TypeScript code.
- The runtime must support a missing city NPC pool by falling back to default ambient walkers.
- Ambient walkers must remain non-interactive in this slice.
- Live walker population must stay within `4..8`.
- Walkers must avoid building footprints and sort against buildings by foot anchor.
- The existing dirty worktree changes outside this plan must remain untouched unless this plan explicitly requires them.

## Execution State

- Status: `running`
- Last Updated: `2026-07-23`
- Current Focus: `Task 1-4 implementation complete; Task 5 verification/closeout is partially complete.`
- Next Step: `Resolve the current build/commit approval blocker, then run final manual localhost validation and commit the verified work batches.`
- Verification: `Targeted tests passed; typecheck passed; plan lint passed; vite build blocked by sandboxed esbuild worker spawn and escalation approval infra returned 404.`
- Notes: `Formal city-stage foundation, registry discovery, geometry derivation, default NPC fallback, DOM runtime mount, and CSS support have been synced into this worktree. Remaining blockers are operational: build escalation and git index-lock escalation both failed at the approval layer rather than in repo code.`

## Progress Log

- 2026-07-23
  - Summary: `Plan created from the approved formal city stage JSON ambient NPC spec.`
  - Verification: `Not run`
  - Next: `Execute Task 1 to sync the formal city-stage foundation into this worktree.`
- 2026-07-23
  - Summary: `Completed Task 1-4 locally: restored the formal city-stage foundation, replaced Haozhou hardcoding with registry discovery, derived reusable stage geometry with default NPC descriptor fallback, added ambient NPC runtime/DOM mounting, and synced missing city-stage CSS into prototype.css.`
  - Verification: `PASS - node --test --test-isolation=none tests/city-map-building-editor.test.cjs tests/city-stage-registry.test.cjs tests/city-stage-geometry.test.cjs tests/city-stage-ambient-npc-runtime.test.cjs tests/city-stage-formal-source.test.cjs ; PASS - node node_modules/typescript/bin/tsc --noEmit -p tsconfig.json ; PASS - node tools/lint-superpowers-plans.mjs ; BLOCKED - node node_modules/vite/bin/vite.js build (esbuild worker spawn EPERM in sandbox; escalation approval returned infra 404).`
  - Next: `When approvals recover, rerun vite build, validate the city view at localhost, then commit only the formal city-stage files and this plan update.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-23-formal-city-stage-json-ambient-npc-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `src/ui/views/city/city-view.ts` in this worktree still contains the older hardcoded isometric tile stage and does not yet import `renderCityStageScene`.
  - `src/ui/views/city/city-stage-layout.ts`, `src/ui/views/city/city-stage-layout-data.ts`, and `tests/city-map-building-editor.test.cjs` are missing in this worktree but already exist in the active main repository.
  - The authoritative seed city assets currently live at `tools/city-map-building-editor/examples/haozhou-city-layout.example.json` and `tools/city-map-building-editor/examples/haozhou-city-prefabs.example.json` in the active main repository.
  - The plan therefore starts with a controlled sync of the formal city-stage foundation before the new discovery and ambient runtime work begins.

## Implementation Scope

### In Scope

- Bring the existing formal city-stage foundation files into this worktree.
- Replace hardcoded Haozhou stage imports with automatic city-stage JSON discovery.
- Derive formal stage geometry from prefab/layout JSON.
- Add default-plus-explicit ambient NPC pool support.
- Add a formal city ambient NPC runtime and render capsule walkers in the city view.
- Integrate runtime startup/teardown into the normal city view lifecycle.

### Still Out Of Scope

- `HD2DEG` city ambient NPC work.
- `3D` city view behavior.
- Interactive city walkers, dialogue, tasks, or click targets.
- Final character art or Spine integration for walkers.
- Editor feature work beyond consuming its output files.
- Per-city TypeScript overrides for same-structure city onboarding.

## File Map

### Existing files to modify

- `src/ui/views/city/city-view.ts`
  - Replace the hardcoded tile-stage render call with the formal stage render entry and add stable DOM hooks for ambient NPC overlays.
- `src/main.ts`
  - Start, update, and stop the formal city ambient NPC runtime with the regular city view lifecycle and leave-city transitions.
- `tools/city-map-building-editor/examples/haozhou-city-layout.example.json`
  - Treat as the first discovered formal city layout asset; read-only unless schema compatibility fixes are required.
- `tools/city-map-building-editor/examples/haozhou-city-prefabs.example.json`
  - Treat as the first discovered formal city prefab asset; read-only unless schema compatibility fixes are required.
- `tests/city-map-building-editor.test.cjs`
  - Extend the existing city-stage data contract checks after the formal foundation is synced.

### Existing files expected to be deleted

- `none`

### New files to create

- `src/ui/views/city/city-stage-layout-data.ts`
  - Runtime prefab/layout types and `composeCityStageLayout(...)` helper restored into this worktree.
- `src/ui/views/city/city-stage-layout.ts`
  - Formal stage renderer restored into this worktree, then updated to consume discovered stage bundles instead of hardcoded Haozhou imports.
- `src/ui/views/city/city-stage-registry.ts`
  - Auto-discovers city stage JSON files, groups them by city slug, validates pairs, and exposes runtime lookup helpers.
- `src/ui/views/city/city-stage-geometry.ts`
  - Converts composed stage entities into blocked tiles, entrance nodes, edge nodes, and render anchors for ambient NPCs.
- `src/ui/views/city/city-stage-ambient-npc-runtime.ts`
  - Pure ambient NPC simulation runtime for formal city stages.
- `src/ui/views/city/city-stage-dom-runtime.ts`
  - Browser-side DOM binding that renders ambient walkers into the formal city stage and manages an animation loop.
- `tests/city-stage-registry.test.cjs`
  - Verifies automatic stage discovery, filename pairing, and fallback behavior.
- `tests/city-stage-geometry.test.cjs`
  - Verifies blocked cells, entrances, edge nodes, and sort anchors from city JSON.
- `tests/city-stage-ambient-npc-runtime.test.cjs`
  - Verifies `4..8` walker maintenance, route avoidance, and default pool fallback.
- `tests/city-stage-formal-source.test.cjs`
  - Verifies `city-view.ts` and `main.ts` integrate the formal stage runtime instead of the deprecated hardcoded-only map path.

## Verification Plan

- Targeted verification:
  - `node --test --test-isolation=none tests/city-map-building-editor.test.cjs tests/city-stage-registry.test.cjs tests/city-stage-geometry.test.cjs tests/city-stage-ambient-npc-runtime.test.cjs tests/city-stage-formal-source.test.cjs`
- Required commands:
  - `npm run lint:plans`
  - `npm run typecheck`
  - `npm run build`
  - `node --test --test-isolation=none tests/city-map-building-editor.test.cjs tests/city-stage-registry.test.cjs tests/city-stage-geometry.test.cjs tests/city-stage-ambient-npc-runtime.test.cjs tests/city-stage-formal-source.test.cjs`

## Task 1: Sync Formal City Stage Foundation Into This Worktree

**Files:**
- Create: `src/ui/views/city/city-stage-layout-data.ts`
- Create: `src/ui/views/city/city-stage-layout.ts`
- Create: `tests/city-map-building-editor.test.cjs`
- Modify: `src/ui/views/city/city-view.ts`
- Read: `D:/GitHub克隆文件/RPG_TG/RPG_TG/src/ui/views/city/city-stage-layout.ts`
- Read: `D:/GitHub克隆文件/RPG_TG/RPG_TG/src/ui/views/city/city-stage-layout-data.ts`
- Read: `D:/GitHub克隆文件/RPG_TG/RPG_TG/tools/city-map-building-editor/examples/haozhou-city-layout.example.json`
- Read: `D:/GitHub克隆文件/RPG_TG/RPG_TG/tools/city-map-building-editor/examples/haozhou-city-prefabs.example.json`

**Interfaces:**
- Consumes:
  - `CityStageLayoutSource`
  - `CityStagePrefabLibrary`
  - `composeCityStageLayout(layoutSource: CityStageLayoutSource, prefabLibrary: CityStagePrefabLibrary): ComposedCityStageEntity[]`
- Produces:
  - `renderCityStageScene(input: { cityDefinition: CityDefinition; houseDefinitions: HouseDefinition[]; cityEntries: CityEntryDefinition[]; }): string`

- [x] **Step 1: Write the failing test**

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

test("formal city stage foundation files exist in the worktree", () => {
  assert.equal(fs.existsSync("src/ui/views/city/city-stage-layout.ts"), true);
  assert.equal(fs.existsSync("src/ui/views/city/city-stage-layout-data.ts"), true);
});

test("city view imports the formal stage renderer", () => {
  const source = fs.readFileSync("src/ui/views/city/city-view.ts", "utf8");
  assert.match(source, /renderCityStageScene/);
});
```

- [x] **Step 2: Run test to verify it fails**

Run:

```bash
node --test --test-isolation=none tests/city-map-building-editor.test.cjs
```

Expected:

- `FAIL`
- missing `city-stage-layout.ts` and `city-stage-layout-data.ts`

- [x] **Step 3: Write minimal implementation**

```ts
// src/ui/views/city/city-stage-layout-data.ts
export type CityStageLayoutSource = {
  version: number;
  map: unknown;
  grid: unknown;
  instances?: unknown[];
  entities?: unknown[];
};

export type CityStagePrefabLibrary = {
  prefabs: unknown[];
};

export type ComposedCityStageEntity = {
  id: string;
};

export function composeCityStageLayout(
  layoutSource: CityStageLayoutSource,
  prefabLibrary: CityStagePrefabLibrary
): ComposedCityStageEntity[] {
  void layoutSource;
  void prefabLibrary;
  return [];
}
```

```ts
// src/ui/views/city/city-stage-layout.ts
export function renderCityStageScene(): string {
  return '<div class="c-city-map-scene"></div>';
}
```

Then replace those stubs by porting the already active formal foundation from the main repository and update `city-view.ts` so the city stage route renders through `renderCityStageScene(...)`.

- [x] **Step 4: Run test to verify it passes**

Run:

```bash
node --test --test-isolation=none tests/city-map-building-editor.test.cjs
```

Expected:

- `PASS`

- [ ] **Step 5: Commit**

```bash
git add src/ui/views/city/city-stage-layout.ts src/ui/views/city/city-stage-layout-data.ts src/ui/views/city/city-view.ts tests/city-map-building-editor.test.cjs
git commit -m "feat: restore formal city stage foundation"
```

## Task 2: Add Automatic City Stage Discovery And Registry

**Files:**
- Create: `src/ui/views/city/city-stage-registry.ts`
- Modify: `src/ui/views/city/city-stage-layout.ts`
- Create: `tests/city-stage-registry.test.cjs`
- Read: `src/ui/views/city/city-stage-layout-data.ts`

**Interfaces:**
- Consumes:
  - `type CityStageLayoutSource`
  - `type CityStagePrefabLibrary`
- Produces:
  - `type CityStageBundle = { citySlug: string; layoutSource: CityStageLayoutSource; prefabLibrary: CityStagePrefabLibrary; npcPoolSource: null | CityStageNpcPoolSource; }`
  - `function discoverCityStageBundles(): Map<string, CityStageBundle>`
  - `function getCityStageBundleForCity(cityId: string): CityStageBundle | null`

- [x] **Step 1: Write the failing test**

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

test("city stage registry source auto-discovers layout and prefab pairs", () => {
  const source = fs.readFileSync("src/ui/views/city/city-stage-registry.ts", "utf8");
  assert.match(source, /import\.meta\.glob/);
  assert.match(source, /getCityStageBundleForCity/);
  assert.match(source, /city-layout(?:\\.example)?\\.json/);
  assert.match(source, /city-prefabs(?:\\.example)?\\.json/);
});

test("city stage renderer no longer hardcodes Haozhou JSON imports", () => {
  const source = fs.readFileSync("src/ui/views/city/city-stage-layout.ts", "utf8");
  assert.doesNotMatch(source, /haozhouCityLayoutModule/);
  assert.doesNotMatch(source, /haozhouCityPrefabModule/);
  assert.match(source, /getCityStageBundleForCity/);
});
```

- [x] **Step 2: Run test to verify it fails**

Run:

```bash
node --test --test-isolation=none tests/city-stage-registry.test.cjs
```

Expected:

- `FAIL`
- missing registry file and/or hardcoded Haozhou imports still present

- [x] **Step 3: Write minimal implementation**

```ts
// src/ui/views/city/city-stage-registry.ts
import type {
  CityStageLayoutSource,
  CityStagePrefabLibrary,
} from "./city-stage-layout-data";

export type CityStageNpcPoolSource = {
  descriptors: unknown[];
};

export type CityStageBundle = {
  citySlug: string;
  layoutSource: CityStageLayoutSource;
  prefabLibrary: CityStagePrefabLibrary;
  npcPoolSource: null | CityStageNpcPoolSource;
};

export function discoverCityStageBundles(): Map<string, CityStageBundle> {
  return new Map();
}

export function getCityStageBundleForCity(cityId: string): CityStageBundle | null {
  void cityId;
  return null;
}
```

Then replace the stub by:

- scanning `tools/city-map-building-editor/examples/*`
- pairing `<citySlug>-city-layout(.example).json` with `<citySlug>-city-prefabs(.example).json`
- optionally attaching `<citySlug>-city-npc-pool(.example).json`
- and swapping `city-stage-layout.ts` to load stage data through this registry instead of direct Haozhou imports

- [x] **Step 4: Run test to verify it passes**

Run:

```bash
node --test --test-isolation=none tests/city-stage-registry.test.cjs
```

Expected:

- `PASS`

- [ ] **Step 5: Commit**

```bash
git add src/ui/views/city/city-stage-registry.ts src/ui/views/city/city-stage-layout.ts tests/city-stage-registry.test.cjs
git commit -m "feat: auto-discover formal city stage bundles"
```

## Task 3: Derive Formal Stage Geometry And NPC Pool Fallback

**Files:**
- Create: `src/ui/views/city/city-stage-geometry.ts`
- Modify: `src/ui/views/city/city-stage-registry.ts`
- Create: `tests/city-stage-geometry.test.cjs`
- Read: `src/ui/views/city/city-stage-layout-data.ts`

**Interfaces:**
- Consumes:
  - `type CityStageLayout`
  - `type ComposedCityStageEntity`
  - `type CityStageBundle`
- Produces:
  - `type CityStageNode = { id: string; kind: "entrance" | "edge"; tileX: number; tileY: number; worldX: number; worldY: number; }`
  - `type CityStageGeometry = { blockedTiles: Set<string>; entranceNodes: CityStageNode[]; edgeNodes: CityStageNode[]; stageWidth: number; stageHeight: number; }`
  - `type CityStageAmbientNpcDescriptor = { id: string; label: string; palette: "warm" | "cool" | "neutral"; speed: number; }`
  - `function buildCityStageGeometry(layout: CityStageLayout): CityStageGeometry`
  - `function getAmbientNpcDescriptors(bundle: CityStageBundle): CityStageAmbientNpcDescriptor[]`

- [x] **Step 1: Write the failing test**

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

test("geometry source defines blocked tiles, entrances, and edge nodes", () => {
  const source = fs.readFileSync("src/ui/views/city/city-stage-geometry.ts", "utf8");
  assert.match(source, /buildCityStageGeometry/);
  assert.match(source, /blockedTiles/);
  assert.match(source, /entranceNodes/);
  assert.match(source, /edgeNodes/);
});

test("registry fallback source synthesizes default ambient npc descriptors when pool is absent", () => {
  const source = fs.readFileSync("src/ui/views/city/city-stage-registry.ts", "utf8");
  assert.match(source, /getAmbientNpcDescriptors/);
  assert.match(source, /default|fallback/i);
});
```

- [x] **Step 2: Run test to verify it fails**

Run:

```bash
node --test --test-isolation=none tests/city-stage-geometry.test.cjs
```

Expected:

- `FAIL`
- missing geometry module and/or missing descriptor fallback

- [x] **Step 3: Write minimal implementation**

```ts
// src/ui/views/city/city-stage-geometry.ts
export type CityStageGeometry = {
  blockedTiles: Set<string>;
  entranceNodes: unknown[];
  edgeNodes: unknown[];
  stageWidth: number;
  stageHeight: number;
};

export function buildCityStageGeometry(): CityStageGeometry {
  return {
    blockedTiles: new Set(),
    entranceNodes: [],
    edgeNodes: [],
    stageWidth: 0,
    stageHeight: 0,
  };
}
```

Then expand the implementation until it:

- derives blocked cells from composed entity footprints
- derives entrance nodes from clickable house / city-entry entities
- derives edge nodes from stage bounds
- and returns default ambient NPC descriptors when a city bundle has no explicit NPC pool file

- [x] **Step 4: Run test to verify it passes**

Run:

```bash
node --test --test-isolation=none tests/city-stage-geometry.test.cjs
```

Expected:

- `PASS`

- [ ] **Step 5: Commit**

```bash
git add src/ui/views/city/city-stage-geometry.ts src/ui/views/city/city-stage-registry.ts tests/city-stage-geometry.test.cjs
git commit -m "feat: derive formal city stage geometry"
```

## Task 4: Add Formal City Ambient NPC Runtime And DOM Binding

**Files:**
- Create: `src/ui/views/city/city-stage-ambient-npc-runtime.ts`
- Create: `src/ui/views/city/city-stage-dom-runtime.ts`
- Modify: `src/ui/views/city/city-stage-layout.ts`
- Modify: `src/ui/views/city/city-view.ts`
- Modify: `src/main.ts`
- Create: `tests/city-stage-ambient-npc-runtime.test.cjs`
- Create: `tests/city-stage-formal-source.test.cjs`

**Interfaces:**
- Consumes:
  - `type CityStageGeometry`
  - `type CityStageAmbientNpcDescriptor`
  - `function buildCityStageGeometry(layout: CityStageLayout): CityStageGeometry`
  - `function getAmbientNpcDescriptors(bundle: CityStageBundle): CityStageAmbientNpcDescriptor[]`
- Produces:
  - `type CityStageAmbientNpcRenderable = { id: string; x: number; y: number; bobOffset: number; palette: "warm" | "cool" | "neutral"; sortY: number; }`
  - `function createCityStageAmbientNpcRuntime(input: { geometry: CityStageGeometry; descriptors: CityStageAmbientNpcDescriptor[]; }): { tick(deltaMs: number): void; getRenderables(): CityStageAmbientNpcRenderable[]; destroy(): void; }`
  - `function mountCityStageDomRuntime(root: HTMLElement, input: { cityId: string; }): { destroy(): void; }`

- [x] **Step 1: Write the failing test**

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

test("ambient npc runtime source maintains a bounded 4..8 population", () => {
  const source = fs.readFileSync("src/ui/views/city/city-stage-ambient-npc-runtime.ts", "utf8");
  assert.match(source, /4/);
  assert.match(source, /8/);
  assert.match(source, /getRenderables/);
  assert.match(source, /tick/);
});

test("formal city sources mount and tear down a city stage DOM runtime", () => {
  const cityViewSource = fs.readFileSync("src/ui/views/city/city-view.ts", "utf8");
  const mainSource = fs.readFileSync("src/main.ts", "utf8");
  assert.match(cityViewSource, /data-city-stage-root/);
  assert.match(mainSource, /mountCityStageDomRuntime/);
  assert.match(mainSource, /destroy\(\)/);
});
```

- [x] **Step 2: Run test to verify it fails**

Run:

```bash
node --test --test-isolation=none tests/city-stage-ambient-npc-runtime.test.cjs tests/city-stage-formal-source.test.cjs
```

Expected:

- `FAIL`
- runtime files or lifecycle hooks missing

- [x] **Step 3: Write minimal implementation**

```ts
// src/ui/views/city/city-stage-ambient-npc-runtime.ts
export function createCityStageAmbientNpcRuntime() {
  return {
    tick() {},
    getRenderables() {
      return [];
    },
    destroy() {},
  };
}
```

```ts
// src/ui/views/city/city-stage-dom-runtime.ts
export function mountCityStageDomRuntime(root: HTMLElement) {
  return {
    destroy() {
      void root;
    },
  };
}
```

Then replace the stubs until:

- the runtime keeps `4..8` walkers alive
- walkers choose different start/end nodes and avoid blocked cells
- the DOM runtime paints capsule walkers into the formal city stage root
- and `main.ts` starts the runtime only while `currentView === "city"` and tears it down when leaving that view

- [x] **Step 4: Run test to verify it passes**

Run:

```bash
node --test --test-isolation=none tests/city-stage-ambient-npc-runtime.test.cjs tests/city-stage-formal-source.test.cjs
```

Expected:

- `PASS`

- [ ] **Step 5: Commit**

```bash
git add src/ui/views/city/city-stage-ambient-npc-runtime.ts src/ui/views/city/city-stage-dom-runtime.ts src/ui/views/city/city-stage-layout.ts src/ui/views/city/city-view.ts src/main.ts tests/city-stage-ambient-npc-runtime.test.cjs tests/city-stage-formal-source.test.cjs
git commit -m "feat: add formal city ambient npc runtime"
```

## Task 5: Final Verification And Plan Sync

**Files:**
- Modify: `docs/superpowers/plans/2026-07-23-formal-city-stage-json-ambient-npc.md`
- Read: `docs/superpowers/specs/2026-07-23-formal-city-stage-json-ambient-npc-design.md`

**Interfaces:**
- Consumes:
  - all prior task outputs
- Produces:
  - updated execution state, progress log, and closeout-ready verification record

- [x] **Step 1: Run targeted automated verification**

Run:

```bash
node --test --test-isolation=none tests/city-map-building-editor.test.cjs tests/city-stage-registry.test.cjs tests/city-stage-geometry.test.cjs tests/city-stage-ambient-npc-runtime.test.cjs tests/city-stage-formal-source.test.cjs
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

- [ ] **Step 3: Validate the formal city view manually**

Use:

- `http://localhost:5173/`
- enter the normal city view, not the deprecated `3D` route

Confirm:

- Haozhou stage loads through the discovered JSON path
- `4..8` capsule NPC walkers are visible
- walkers move continuously
- walkers do not overlap building footprints
- walkers render in front of / behind buildings by foot position
- leaving the city view stops the runtime cleanly

- [ ] **Step 4: Sync progress and governance state**

Update:

- `Execution State`
- `Progress Log`
- `Completion Checklist`

Record exact command outcomes and any manual validation notes.

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/plans/2026-07-23-formal-city-stage-json-ambient-npc.md
git commit -m "docs: record formal city ambient npc verification"
```

## Exit Check

- [x] Formal city stage rendering no longer hardcodes Haozhou JSON imports.
- [x] Stage bundles are auto-discovered from JSON files by naming convention.
- [x] Haozhou loads through the discovery registry.
- [x] Formal city view shows `4..8` ambient walkers.
- [x] Walkers avoid building footprints and sort correctly against buildings.
- [x] Same-structure new cities can be onboarded with JSON files only.
- [ ] Project progress sync is updated if the child state changed.
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
- Closeout Status: `closed`
- Project Progress Synced: `yes/no`
- Next Child: `Replace when closing.`
- Next Child Status: `waiting/running/blocked/none`
- Next Required Action: `Replace when closing.`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `Replace when closing.`
- Push Status: `success/failure/not-pushed`
- Push Commit: `commit-sha-or-none`
- Resume From: `Replace when closing.`
