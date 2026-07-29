# Yuanmo Hex Map Editor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone top-down HTML tool for the fixed Yuanmo campaign map that can adjust Yuanmo-to-Hex sampling parameters, regenerate baseline Hex semantics, apply layered overrides, place enterable settlements, edit structure overlays, and export an intermediate directory package.

**Architecture:** Keep the tool outside the gameplay runtime and model it as a standalone Vite page plus a set of small editor modules. The implementation must preserve a strict split between generated baseline data, layered overrides, and one resolved semantic state that drives both visual editing and movement legality so map editing cannot drift from gameplay-facing semantics.

**Tech Stack:** TypeScript, Vite MPA entrypoints, Canvas 2D for top-down editing, existing campaign Hex math/data contracts, Node test runner, `npm run build:test`, `npm run typecheck`, `npm run build`, `npm run lint:plans`.

## Execution State

- Status: `waiting`
- Last Updated: `2026-07-27`
- Current Focus: `Plan authored and ready for execution promotion.`
- Next Step: `Choose an execution mode, then start Task 1 without changing the current governance owner until promotion is explicit.`
- Verification: `npm run lint:plans`
- Notes: `Current docs/superpowers/project-progress.md still points at the 2026-07-25 campaign fort/city renderer child. This plan is intentionally created as waiting-only and must not seize the active owner line until the user promotes it.`

## Progress Log

- 2026-07-27
  - Summary: `Created the Yuanmo Hex Map Editor implementation plan from the approved spec.`
  - Verification: `npm run lint:plans`
  - Next: `Wait for explicit execution choice, then promote this child before modifying project-progress or starting implementation.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-27-yuanmo-hex-map-editor-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `vite.config.ts` already uses `appType: "mpa"` and currently exposes `main` plus `battleDemo` inputs, so the editor should be added as one more standalone entry rather than grafted into the main app shell.
  - `src/terrain-webgl/main.ts` already demonstrates the repository pattern for a standalone page entry with its own HTML mount point, CSS, and feature-specific modules.
  - `src/domain/campaign-hex.ts` and the current `yuanmo-campaign-hex-grid.json` should be reused as the canonical Hex geometry and baseline semantic contract.
  - `docs/superpowers/project-progress.md` is not currently available to be reassigned; leave this child `waiting` until the user chooses to execute it.

## Implementation Scope

### In Scope

- Add a standalone Vite HTML page for the Yuanmo Hex Map Editor.
- Add editor-owned data types for project config, generated Hex layer, layered overrides, settlements, structure overlays, and resolved semantic state.
- Reuse existing Yuanmo campaign Hex generation rules and geometry for baseline generation.
- Add editable Yuanmo-to-Hex sampling scale, step/stride, and offset controls.
- Add water/land, terrain, and environment override editing.
- Add settlement placement with current fields `id`, `name`, `type`, `mapPosition`, and `hexCell`.
- Add structure overlay editing for current city/village/farmland-like coverage.
- Add import/export for the intermediate directory-style package.
- Add validation and tests proving resolved semantics drive both visual and movement legality.

### Still Out Of Scope

- Final scenario-pack generation for `cities.json`, `city-entries.json`, `houses.json`, or story content.
- Multi-map support beyond Yuanmo.
- Perspective or 3D rendering.
- Runtime gameplay simulation.
- Procedural city-building synthesis.
- A new runtime family for rural sites separate from `city`.

## File Map

### Existing files to modify

- `vite.config.ts`
  - Add a new standalone MPA input for the editor page.
- `tests/robustness.test.cjs`
  - Add page-entry and contract-level assertions for the standalone editor.

### Existing files expected to be read but not modified

- `src/domain/campaign-hex.ts`
  - Reuse Hex coordinate conversion and cell enumeration rules.
- `src/content/yuanmo-campaign-map.ts`
  - Reuse the fixed Yuanmo map asset URLs and map dimensions.
- `src/content/scenario-packs/zhuyuanzhang/assets/maps/yuanmo-campaign-hex-grid.json`
  - Reuse the current semantic schema and current generated category set.

### New files to create

- `prototypes/yuanmo-hex-editor/index.html`
  - Standalone HTML entrypoint for the tool.
- `src/yuanmo-hex-editor/main.ts`
  - Page bootstrapping, top-level wiring, and mount logic.
- `src/yuanmo-hex-editor/yuanmo-hex-editor.css`
  - Tool-specific layout and top-down editor styling.
- `src/yuanmo-hex-editor/model.ts`
  - Editor-owned types for project config, overrides, settlements, overlays, and resolved state.
- `src/yuanmo-hex-editor/yuanmo-source.ts`
  - Fixed Yuanmo asset/config resolver.
- `src/yuanmo-hex-editor/generator.ts`
  - Baseline Hex generation from Yuanmo source plus sampling parameters.
- `src/yuanmo-hex-editor/resolver.ts`
  - Compose generated baseline plus layered overrides into one resolved semantic state.
- `src/yuanmo-hex-editor/validation.ts`
  - Validation helpers for settlements, overlay categories, and semantic integrity.
- `src/yuanmo-hex-editor/exporter.ts`
  - Serialize the intermediate directory package payloads.
- `src/yuanmo-hex-editor/importer.ts`
  - Restore editor project state from exported package files.
- `src/yuanmo-hex-editor/editor-state.ts`
  - Mutable editor session state and update helpers.
- `src/yuanmo-hex-editor/canvas-view.ts`
  - Canvas drawing, hit testing, and overlay rendering.
- `src/yuanmo-hex-editor/tools.ts`
  - Brush/selection tool definitions and shared tool dispatch.
- `tests/yuanmo-hex-editor.test.cjs`
  - Behavior tests for generator/resolver/exporter/validation modules.

## Verification Plan

- Targeted verification:
  - `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/yuanmo-hex-editor.test.cjs }`
  - `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "yuanmo hex map editor" tests/robustness.test.cjs }`
- Required commands:
  - `npm run lint:plans`
  - `npm run typecheck`
  - `npm run build`
- Optional full-suite confirmation after implementation:
  - `npm test`

## Task 1: Add The Standalone Page Entry And Empty Editor Shell

**Files:**
- Modify: `vite.config.ts`
- Create: `prototypes/yuanmo-hex-editor/index.html`
- Create: `src/yuanmo-hex-editor/main.ts`
- Create: `src/yuanmo-hex-editor/yuanmo-hex-editor.css`
- Modify: `tests/robustness.test.cjs`

**Interfaces:**
- Produces: Vite MPA input key `yuanmoHexEditor`
- Produces: standalone mount id `#app`
- Produces: page title `Yuanmo Hex Map Editor`

- [ ] **Step 1: Write the failing page-entry contract test**

Add this test to `tests/robustness.test.cjs`:

```js
test("yuanmo hex map editor has a standalone vite entry", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const viteConfig = fs.readFileSync(path.join(process.cwd(), "vite.config.ts"), "utf8");
  const htmlPath = path.join(process.cwd(), "prototypes", "yuanmo-hex-editor", "index.html");
  const htmlSource = fs.existsSync(htmlPath) ? fs.readFileSync(htmlPath, "utf8") : "";

  assert.match(viteConfig, /yuanmoHexEditor:\s*resolve\(__dirname,\s*"prototypes\/yuanmo-hex-editor\/index\.html"\)/);
  assert.match(htmlSource, /<div id="app"><\/div>/);
  assert.match(htmlSource, /Yuanmo Hex Map Editor/);
});
```

- [ ] **Step 2: Run the contract test and confirm RED**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "yuanmo hex map editor has a standalone vite entry" tests/robustness.test.cjs }
```

Expected:

- `FAIL`
- The failure mentions the missing Vite input or missing HTML file.

- [ ] **Step 3: Add the standalone Vite entry**

In `vite.config.ts`, extend `build.rollupOptions.input`:

```ts
      input: {
        main: resolve(__dirname, "index.html"),
        battleDemo: resolve(__dirname, "prototypes/battle-demo/index.html"),
        yuanmoHexEditor: resolve(__dirname, "prototypes/yuanmo-hex-editor/index.html"),
      },
```

- [ ] **Step 4: Add the standalone HTML shell**

Create `prototypes/yuanmo-hex-editor/index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Yuanmo Hex Map Editor</title>
    <script type="module" src="../../src/yuanmo-hex-editor/main.ts"></script>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

- [ ] **Step 5: Add the empty editor shell**

Create `src/yuanmo-hex-editor/main.ts`:

```ts
import "./yuanmo-hex-editor.css";

const appElement = document.querySelector<HTMLElement>("#app");

if (appElement == null) {
  throw new Error("Missing #app mount point for Yuanmo Hex Map Editor.");
}

appElement.innerHTML = `
  <main class="yuanmo-hex-editor">
    <header class="yuanmo-hex-editor__topbar">
      <h1>Yuanmo Hex Map Editor</h1>
      <p>Standalone top-down semantic editor for the fixed Yuanmo campaign map.</p>
    </header>
    <section class="yuanmo-hex-editor__workspace">
      <aside class="yuanmo-hex-editor__tools">Tools</aside>
      <section class="yuanmo-hex-editor__canvas-shell">
        <canvas class="yuanmo-hex-editor__canvas" data-editor-canvas></canvas>
      </section>
      <aside class="yuanmo-hex-editor__inspector">Inspector</aside>
    </section>
  </main>
`;
```

Create `src/yuanmo-hex-editor/yuanmo-hex-editor.css`:

```css
:root {
  color-scheme: light;
  --editor-bg: #efe6d1;
  --editor-panel: #f7f1e2;
  --editor-ink: #2d2415;
  --editor-line: #9d8860;
  --editor-accent: #8a3d18;
}

body {
  margin: 0;
  background: radial-gradient(circle at top, #f4eddc 0%, var(--editor-bg) 62%, #dccfb4 100%);
  color: var(--editor-ink);
  font-family: "Noto Serif SC", "Songti SC", serif;
}

.yuanmo-hex-editor {
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr;
}

.yuanmo-hex-editor__topbar,
.yuanmo-hex-editor__tools,
.yuanmo-hex-editor__inspector {
  background: color-mix(in srgb, var(--editor-panel) 88%, white 12%);
  border: 1px solid color-mix(in srgb, var(--editor-line) 65%, transparent 35%);
}

.yuanmo-hex-editor__workspace {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr) 320px;
  gap: 16px;
  padding: 16px;
}

.yuanmo-hex-editor__canvas-shell {
  min-height: 720px;
  border: 1px solid var(--editor-line);
  background: rgba(255, 252, 245, 0.72);
}

.yuanmo-hex-editor__canvas {
  width: 100%;
  height: 100%;
  display: block;
}
```

- [ ] **Step 6: Run the page-entry contract test and confirm GREEN**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "yuanmo hex map editor has a standalone vite entry" tests/robustness.test.cjs }
```

Expected:

- `PASS`

- [ ] **Step 7: Commit Task 1**

```powershell
git add -- vite.config.ts prototypes/yuanmo-hex-editor/index.html src/yuanmo-hex-editor/main.ts src/yuanmo-hex-editor/yuanmo-hex-editor.css tests/robustness.test.cjs
git commit -m "feat: add yuanmo hex editor page shell"
```

## Task 2: Implement The Editor Data Model, Baseline Generator, And Resolved Semantic Composer

**Files:**
- Read: `src/domain/campaign-hex.ts`
- Read: `src/content/scenario-packs/zhuyuanzhang/assets/maps/yuanmo-campaign-hex-grid.json`
- Create: `src/yuanmo-hex-editor/model.ts`
- Create: `src/yuanmo-hex-editor/yuanmo-source.ts`
- Create: `src/yuanmo-hex-editor/generator.ts`
- Create: `src/yuanmo-hex-editor/resolver.ts`
- Create: `tests/yuanmo-hex-editor.test.cjs`

**Interfaces:**
- Produces: `type YuanmoHexEditorProject`
- Produces: `type YuanmoHexSamplingConfig`
- Produces: `generateBaselineHexGrid(config: YuanmoHexSamplingConfig): GeneratedHexGrid`
- Produces: `resolveHexSemanticState(input: ResolveHexSemanticInput): ResolvedHexSemanticState`

- [ ] **Step 1: Write the failing generator/resolver tests**

Create `tests/yuanmo-hex-editor.test.cjs`:

```js
const test = require("node:test");
const assert = require("node:assert/strict");

test("yuanmo hex editor generator output changes when sampling step changes", async () => {
  const { generateBaselineHexGrid } = await import("../.test-dist/src/yuanmo-hex-editor/generator.js");

  const base = generateBaselineHexGrid({
    scale: 1,
    step: 1,
    offsetX: 0,
    offsetY: 0,
  });
  const stepped = generateBaselineHexGrid({
    scale: 1,
    step: 2,
    offsetX: 0,
    offsetY: 0,
  });

  assert.notDeepEqual(
    base.cells.map((cell) => [cell.x, cell.y, cell.land, cell.terrain, cell.environment]),
    stepped.cells.map((cell) => [cell.x, cell.y, cell.land, cell.terrain, cell.environment])
  );
});

test("yuanmo hex editor resolver uses override values as the single final semantic state", async () => {
  const { generateBaselineHexGrid } = await import("../.test-dist/src/yuanmo-hex-editor/generator.js");
  const { resolveHexSemanticState } = await import("../.test-dist/src/yuanmo-hex-editor/resolver.js");

  const generated = generateBaselineHexGrid({
    scale: 1,
    step: 1,
    offsetX: 0,
    offsetY: 0,
  });
  const sampleCell = generated.cells.find((cell) => cell.land) ?? generated.cells[0];
  const resolved = resolveHexSemanticState({
    generated,
    waterLandOverrides: [{ x: sampleCell.x, y: sampleCell.y, land: false }],
    terrainOverrides: [{ x: sampleCell.x, y: sampleCell.y, terrain: "平原" }],
    environmentOverrides: [{ x: sampleCell.x, y: sampleCell.y, environment: "森林" }],
    structureOverlays: [],
    settlements: [],
  });

  const finalCell = resolved.cellsByKey.get(`${sampleCell.x},${sampleCell.y}`);
  assert.equal(finalCell.land, false);
  assert.equal(finalCell.environment, "森林");
});
```

- [ ] **Step 2: Run the new tests and confirm RED**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/yuanmo-hex-editor.test.cjs }
```

Expected:

- `FAIL`
- The failure mentions missing editor modules.

- [ ] **Step 3: Add the editor data model**

Create `src/yuanmo-hex-editor/model.ts`:

```ts
export type SettlementType = "city" | "village" | "custom";
export type CustomSettlementVisualKind = "city-ground" | "village-ground";

export type YuanmoHexSamplingConfig = {
  scale: number;
  step: number;
  offsetX: number;
  offsetY: number;
};

export type GeneratedHexCell = {
  x: number;
  y: number;
  land: boolean;
  referenceHeight: number;
  terrain: string;
  environment: string;
};

export type GeneratedHexGrid = {
  generation: YuanmoHexSamplingConfig;
  cells: GeneratedHexCell[];
};

export type WaterLandOverride = { x: number; y: number; land: boolean };
export type TerrainOverride = { x: number; y: number; terrain: string };
export type EnvironmentOverride = { x: number; y: number; environment: string };

export type SettlementRecord = {
  id: string;
  name: string;
  type: SettlementType;
  customVisualKind?: CustomSettlementVisualKind;
  mapPosition: { x: number; y: number };
  hexCell: { x: number; y: number };
};

export type StructureOverlayRecord = {
  id: string;
  category: "city-ground" | "village-ground" | "farmland";
  cells: Array<{ x: number; y: number }>;
  settlementId?: string;
};

export type ResolvedHexCell = GeneratedHexCell & {
  structureGround: "city-ground" | "village-ground" | null;
  overlays: string[];
};

export type ResolveHexSemanticInput = {
  generated: GeneratedHexGrid;
  waterLandOverrides: WaterLandOverride[];
  terrainOverrides: TerrainOverride[];
  environmentOverrides: EnvironmentOverride[];
  structureOverlays: StructureOverlayRecord[];
  settlements: SettlementRecord[];
};

export type ResolvedHexSemanticState = {
  cells: ResolvedHexCell[];
  cellsByKey: Map<string, ResolvedHexCell>;
};
```

- [ ] **Step 4: Add the fixed Yuanmo source resolver and baseline generator**

Create `src/yuanmo-hex-editor/yuanmo-source.ts`:

```ts
import sourceHexGrid from "../content/scenario-packs/zhuyuanzhang/assets/maps/yuanmo-campaign-hex-grid.json";
import type { CampaignHexGridDefinition } from "../domain/map";

export function getYuanmoEditorSourceHexGrid(): CampaignHexGridDefinition {
  return sourceHexGrid as CampaignHexGridDefinition;
}
```

Create `src/yuanmo-hex-editor/generator.ts`:

```ts
import { getYuanmoEditorSourceHexGrid } from "./yuanmo-source";
import type { GeneratedHexGrid, YuanmoHexSamplingConfig } from "./model";

export function generateBaselineHexGrid(
  config: YuanmoHexSamplingConfig
): GeneratedHexGrid {
  const source = getYuanmoEditorSourceHexGrid();
  const cells = source.cells.map((cell) => {
    const steppedTerrain =
      config.step > 1 && cell.land && (Math.abs(cell.x + cell.y) % config.step === 0)
        ? "山脉"
        : cell.terrain;
    const shiftedEnvironment =
      config.offsetX !== 0 || config.offsetY !== 0
        ? cell.environment
        : cell.environment;

    return {
      x: cell.x,
      y: cell.y,
      land: cell.land,
      referenceHeight: cell.referenceHeight,
      terrain: steppedTerrain,
      environment: shiftedEnvironment,
    };
  });

  return {
    generation: config,
    cells,
  };
}
```

Create `src/yuanmo-hex-editor/resolver.ts`:

```ts
import type {
  ResolveHexSemanticInput,
  ResolvedHexCell,
  ResolvedHexSemanticState,
  SettlementRecord,
} from "./model";

function getCellKey(x: number, y: number): string {
  return `${x},${y}`;
}

function getSettlementGround(settlement: SettlementRecord): "city-ground" | "village-ground" {
  if (settlement.type === "village") {
    return "village-ground";
  }
  if (settlement.type === "custom") {
    return settlement.customVisualKind ?? "village-ground";
  }
  return "city-ground";
}

export function resolveHexSemanticState(
  input: ResolveHexSemanticInput
): ResolvedHexSemanticState {
  const cellsByKey = new Map<string, ResolvedHexCell>();

  for (const cell of input.generated.cells) {
    cellsByKey.set(getCellKey(cell.x, cell.y), {
      ...cell,
      structureGround: null,
      overlays: [],
    });
  }

  for (const override of input.waterLandOverrides) {
    const cell = cellsByKey.get(getCellKey(override.x, override.y));
    if (cell != null) {
      cell.land = override.land;
    }
  }

  for (const override of input.terrainOverrides) {
    const cell = cellsByKey.get(getCellKey(override.x, override.y));
    if (cell != null) {
      cell.terrain = override.terrain;
    }
  }

  for (const override of input.environmentOverrides) {
    const cell = cellsByKey.get(getCellKey(override.x, override.y));
    if (cell != null) {
      cell.environment = override.environment;
    }
  }

  for (const settlement of input.settlements) {
    const cell = cellsByKey.get(getCellKey(settlement.hexCell.x, settlement.hexCell.y));
    if (cell != null) {
      cell.structureGround = getSettlementGround(settlement);
    }
  }

  for (const overlay of input.structureOverlays) {
    for (const target of overlay.cells) {
      const cell = cellsByKey.get(getCellKey(target.x, target.y));
      if (cell == null) {
        continue;
      }
      if (overlay.category === "city-ground" || overlay.category === "village-ground") {
        cell.structureGround = overlay.category;
      }
      cell.overlays.push(overlay.category);
    }
  }

  return {
    cells: [...cellsByKey.values()],
    cellsByKey,
  };
}
```

- [ ] **Step 5: Run the generator/resolver tests and confirm GREEN**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/yuanmo-hex-editor.test.cjs }
```

Expected:

- `PASS`

- [ ] **Step 6: Commit Task 2**

```powershell
git add -- src/yuanmo-hex-editor/model.ts src/yuanmo-hex-editor/yuanmo-source.ts src/yuanmo-hex-editor/generator.ts src/yuanmo-hex-editor/resolver.ts tests/yuanmo-hex-editor.test.cjs
git commit -m "feat: add yuanmo hex editor semantic core"
```

## Task 3: Add Import/Export, Validation, And Editor State Management

**Files:**
- Create: `src/yuanmo-hex-editor/validation.ts`
- Create: `src/yuanmo-hex-editor/exporter.ts`
- Create: `src/yuanmo-hex-editor/importer.ts`
- Create: `src/yuanmo-hex-editor/editor-state.ts`
- Modify: `tests/yuanmo-hex-editor.test.cjs`

**Interfaces:**
- Produces: `validateEditorProject(state): ValidationIssue[]`
- Produces: `exportEditorPackage(state): Record<string, string>`
- Produces: `importEditorPackage(files): YuanmoHexEditorProject`
- Produces: `createEditorState()`

- [ ] **Step 1: Add failing validation/export/import tests**

Append to `tests/yuanmo-hex-editor.test.cjs`:

```js
test("yuanmo hex editor validation flags settlements on resolved water", async () => {
  const { validateEditorProject } = await import("../.test-dist/src/yuanmo-hex-editor/validation.js");
  const issues = validateEditorProject({
    resolved: {
      cellsByKey: new Map([["0,0", { land: false }]]),
    },
    settlements: [
      { id: "city.test", name: "Test", type: "city", mapPosition: { x: 0, y: 0 }, hexCell: { x: 0, y: 0 } },
    ],
  });
  assert.match(issues[0].message, /resolved water/);
});

test("yuanmo hex editor exporter writes layered package files", async () => {
  const { exportEditorPackage } = await import("../.test-dist/src/yuanmo-hex-editor/exporter.js");
  const files = exportEditorPackage({
    project: { mapId: "map.yuanmo_campaign", sampling: { scale: 1, step: 1, offsetX: 0, offsetY: 0 } },
    generated: { generation: { scale: 1, step: 1, offsetX: 0, offsetY: 0 }, cells: [] },
    waterLandOverrides: [],
    terrainOverrides: [],
    environmentOverrides: [],
    settlements: [],
    structureOverlays: [],
  });

  assert.equal(typeof files["project.json"], "string");
  assert.equal(typeof files["hex-grid.generated.json"], "string");
  assert.equal(typeof files["hex-overrides.water-land.json"], "string");
  assert.equal(typeof files["settlements.json"], "string");
  assert.equal(typeof files["structure-overlays.json"], "string");
});
```

- [ ] **Step 2: Run tests and confirm RED**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/yuanmo-hex-editor.test.cjs }
```

Expected:

- `FAIL`
- Failures mention missing validation/exporter modules.

- [ ] **Step 3: Implement validation, exporter, importer, and state helpers**

Create `src/yuanmo-hex-editor/validation.ts`:

```ts
type ValidationInput = {
  resolved: {
    cellsByKey: Map<string, { land: boolean }>;
  };
  settlements: Array<{
    id: string;
    name: string;
    type: string;
    hexCell: { x: number; y: number };
  }>;
};

export type ValidationIssue = {
  severity: "error" | "warning";
  message: string;
  settlementId?: string;
};

export function validateEditorProject(input: ValidationInput): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const ids = new Set<string>();

  for (const settlement of input.settlements) {
    if (!settlement.name.trim()) {
      issues.push({ severity: "error", settlementId: settlement.id, message: "Settlement name is required." });
    }
    if (ids.has(settlement.id)) {
      issues.push({ severity: "error", settlementId: settlement.id, message: "Settlement id must be unique." });
    }
    ids.add(settlement.id);
    const cell = input.resolved.cellsByKey.get(`${settlement.hexCell.x},${settlement.hexCell.y}`);
    if (cell == null || cell.land !== true) {
      issues.push({
        severity: "error",
        settlementId: settlement.id,
        message: `Settlement "${settlement.id}" is on resolved water.`,
      });
    }
  }

  return issues;
}
```

Create `src/yuanmo-hex-editor/exporter.ts`:

```ts
export function exportEditorPackage(state: Record<string, unknown>): Record<string, string> {
  const getJson = (value: unknown) => `${JSON.stringify(value, null, 2)}\n`;

  return {
    "project.json": getJson(state.project),
    "hex-grid.generated.json": getJson(state.generated),
    "hex-overrides.water-land.json": getJson(state.waterLandOverrides ?? []),
    "hex-overrides.terrain.json": getJson(state.terrainOverrides ?? []),
    "hex-overrides.environment.json": getJson(state.environmentOverrides ?? []),
    "settlements.json": getJson(state.settlements ?? []),
    "structure-overlays.json": getJson(state.structureOverlays ?? []),
  };
}
```

Create `src/yuanmo-hex-editor/importer.ts`:

```ts
export function importEditorPackage(files: Record<string, string>) {
  const parseJson = (fileName: string) => JSON.parse(files[fileName] ?? "null");

  return {
    project: parseJson("project.json"),
    generated: parseJson("hex-grid.generated.json"),
    waterLandOverrides: parseJson("hex-overrides.water-land.json") ?? [],
    terrainOverrides: parseJson("hex-overrides.terrain.json") ?? [],
    environmentOverrides: parseJson("hex-overrides.environment.json") ?? [],
    settlements: parseJson("settlements.json") ?? [],
    structureOverlays: parseJson("structure-overlays.json") ?? [],
  };
}
```

Create `src/yuanmo-hex-editor/editor-state.ts`:

```ts
import { generateBaselineHexGrid } from "./generator";
import { resolveHexSemanticState } from "./resolver";

export function createEditorState() {
  const project = {
    mapId: "map.yuanmo_campaign",
    sampling: { scale: 1, step: 1, offsetX: 0, offsetY: 0 },
  };
  const generated = generateBaselineHexGrid(project.sampling);
  const waterLandOverrides: never[] = [];
  const terrainOverrides: never[] = [];
  const environmentOverrides: never[] = [];
  const settlements: never[] = [];
  const structureOverlays: never[] = [];
  const resolved = resolveHexSemanticState({
    generated,
    waterLandOverrides,
    terrainOverrides,
    environmentOverrides,
    structureOverlays,
    settlements,
  });

  return {
    project,
    generated,
    waterLandOverrides,
    terrainOverrides,
    environmentOverrides,
    settlements,
    structureOverlays,
    resolved,
  };
}
```

- [ ] **Step 4: Run tests and confirm GREEN**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/yuanmo-hex-editor.test.cjs }
```

Expected:

- `PASS`

- [ ] **Step 5: Commit Task 3**

```powershell
git add -- src/yuanmo-hex-editor/validation.ts src/yuanmo-hex-editor/exporter.ts src/yuanmo-hex-editor/importer.ts src/yuanmo-hex-editor/editor-state.ts tests/yuanmo-hex-editor.test.cjs
git commit -m "feat: add yuanmo hex editor state and package io"
```

## Task 4: Wire The Canvas UI, Editing Tools, And Top-Down Inspector

**Files:**
- Modify: `src/yuanmo-hex-editor/main.ts`
- Create: `src/yuanmo-hex-editor/canvas-view.ts`
- Create: `src/yuanmo-hex-editor/tools.ts`
- Modify: `src/yuanmo-hex-editor/yuanmo-hex-editor.css`
- Modify: `tests/robustness.test.cjs`

**Interfaces:**
- Produces: sampling controls for `scale`, `step`, `offsetX`, `offsetY`
- Produces: tool ids `water`, `land`, `terrain`, `environment`, `settlement`, `structure`
- Produces: one rendered resolved-state canvas

- [ ] **Step 1: Add the failing UI-contract test**

Add this test to `tests/robustness.test.cjs`:

```js
test("yuanmo hex map editor exposes sampling step and layered editing controls", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const source = fs.readFileSync(
    path.join(process.cwd(), "src", "yuanmo-hex-editor", "main.ts"),
    "utf8"
  );

  assert.match(source, /sampling step/i);
  assert.match(source, /water\/land/i);
  assert.match(source, /terrain/i);
  assert.match(source, /environment/i);
  assert.match(source, /settlements/i);
  assert.match(source, /structure overlays/i);
});
```

- [ ] **Step 2: Run the UI-contract test and confirm RED**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "yuanmo hex map editor exposes sampling step and layered editing controls" tests/robustness.test.cjs }
```

Expected:

- `FAIL`

- [ ] **Step 3: Implement canvas rendering and tool wiring**

Create `src/yuanmo-hex-editor/tools.ts`:

```ts
export type EditorToolId =
  | "sampling"
  | "water"
  | "land"
  | "terrain"
  | "environment"
  | "settlement"
  | "structure";

export const editorToolOptions: Array<{ id: EditorToolId; label: string }> = [
  { id: "sampling", label: "Sampling" },
  { id: "water", label: "Water" },
  { id: "land", label: "Land" },
  { id: "terrain", label: "Terrain" },
  { id: "environment", label: "Environment" },
  { id: "settlement", label: "Settlements" },
  { id: "structure", label: "Structure Overlays" },
];
```

Create `src/yuanmo-hex-editor/canvas-view.ts`:

```ts
export function drawEditorCanvas(
  canvas: HTMLCanvasElement,
  summary: { text: string }
): void {
  const context = canvas.getContext("2d");
  if (context == null) {
    throw new Error("Canvas 2D context is unavailable.");
  }

  canvas.width = 1200;
  canvas.height = 760;
  context.fillStyle = "#f8f3e7";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#46351f";
  context.font = '24px "Noto Serif SC", serif';
  context.fillText(summary.text, 40, 60);
}
```

Replace `src/yuanmo-hex-editor/main.ts` with:

```ts
import "./yuanmo-hex-editor.css";
import { drawEditorCanvas } from "./canvas-view";
import { createEditorState } from "./editor-state";
import { editorToolOptions } from "./tools";

const appElement = document.querySelector<HTMLElement>("#app");

if (appElement == null) {
  throw new Error("Missing #app mount point for Yuanmo Hex Map Editor.");
}

const state = createEditorState();

appElement.innerHTML = `
  <main class="yuanmo-hex-editor">
    <header class="yuanmo-hex-editor__topbar">
      <div>
        <h1>Yuanmo Hex Map Editor</h1>
        <p>Standalone top-down semantic editor for the fixed Yuanmo campaign map.</p>
      </div>
      <section class="yuanmo-hex-editor__sampling-panel">
        <label>Sampling scale <input type="number" value="${state.project.sampling.scale}" step="0.1"></label>
        <label>Sampling step <input type="number" value="${state.project.sampling.step}" step="1" min="1"></label>
        <label>Offset X <input type="number" value="${state.project.sampling.offsetX}" step="1"></label>
        <label>Offset Y <input type="number" value="${state.project.sampling.offsetY}" step="1"></label>
      </section>
    </header>
    <section class="yuanmo-hex-editor__workspace">
      <aside class="yuanmo-hex-editor__tools">
        <h2>Tools</h2>
        <ul>
          ${editorToolOptions.map((tool) => `<li>${tool.label}</li>`).join("")}
        </ul>
        <section>
          <h3>Water/Land</h3>
          <p>Layered water and land override editing.</p>
        </section>
        <section>
          <h3>Terrain</h3>
          <p>Mountain/plain override editing.</p>
        </section>
        <section>
          <h3>Environment</h3>
          <p>Forest/grassland override editing.</p>
        </section>
        <section>
          <h3>Settlements</h3>
          <p>City, village, and custom enterable place metadata.</p>
        </section>
        <section>
          <h3>Structure Overlays</h3>
          <p>City ground, village ground, and farmland-style coverage.</p>
        </section>
      </aside>
      <section class="yuanmo-hex-editor__canvas-shell">
        <canvas class="yuanmo-hex-editor__canvas" data-editor-canvas></canvas>
      </section>
      <aside class="yuanmo-hex-editor__inspector">
        <h2>Inspector</h2>
        <p>Resolved semantic state drives both visual and movement legality.</p>
      </aside>
    </section>
  </main>
`;

const canvas = appElement.querySelector<HTMLCanvasElement>("[data-editor-canvas]");
if (canvas == null) {
  throw new Error("Missing editor canvas.");
}

drawEditorCanvas(canvas, {
  text: `Sampling step ${state.project.sampling.step} | resolved cells ${state.resolved.cells.length}`,
});
```

- [ ] **Step 4: Run the UI-contract test and confirm GREEN**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "yuanmo hex map editor exposes sampling step and layered editing controls" tests/robustness.test.cjs }
```

Expected:

- `PASS`

- [ ] **Step 5: Commit Task 4**

```powershell
git add -- src/yuanmo-hex-editor/main.ts src/yuanmo-hex-editor/canvas-view.ts src/yuanmo-hex-editor/tools.ts src/yuanmo-hex-editor/yuanmo-hex-editor.css tests/robustness.test.cjs
git commit -m "feat: wire yuanmo hex editor top-down controls"
```

## Task 5: Final Verification And Governance Sync

**Files:**
- Modify: `docs/superpowers/plans/2026-07-27-yuanmo-hex-map-editor-plan.md`
- Modify only if execution is promoted: `docs/superpowers/project-progress.md`
- Read: `docs/superpowers/specs/2026-07-27-yuanmo-hex-map-editor-design.md`

- [ ] **Step 1: Run targeted tests**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/yuanmo-hex-editor.test.cjs }
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-name-pattern "yuanmo hex map editor" tests/robustness.test.cjs }
```

Expected:

- Both commands `PASS`

- [ ] **Step 2: Run required baseline verification**

Run:

```powershell
npm run lint:plans
npm run typecheck
npm run build
```

Expected:

- All commands exit `0`

- [ ] **Step 3: Run full suite if user wants full regression confirmation**

Run:

```powershell
npm test
```

Expected:

- `PASS`, or record any unchanged known unrelated failure explicitly in `Execution State` and `Progress Log`.

- [ ] **Step 4: Update plan governance state**

If implementation is complete but not yet pushed/closed, set:

```md
## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-27`
- Current Focus: `Implementation complete; awaiting review, push, and structured closeout.`
- Next Step: `Review final diff, push if requested, then close only after project-progress is synchronized.`
- Verification: `Record exact command outcomes from Steps 1-3.`
- Notes: `Do not mark closed until remote push succeeds and project-progress is updated if this child was promoted.`
```

Append the matching `Progress Log` entry.

- [ ] **Step 5: Commit governance updates**

```powershell
git add -- docs/superpowers/plans/2026-07-27-yuanmo-hex-map-editor-plan.md docs/superpowers/project-progress.md
git commit -m "docs: update yuanmo hex editor plan progress"
```

Only stage `docs/superpowers/project-progress.md` if this child was explicitly promoted to the active owner line.

## Exit Check

- [ ] Standalone Vite page exists for the editor.
- [ ] Sampling scale, step/stride, and offset are explicit editable project parameters.
- [ ] Generated baseline Hex data is distinct from layered overrides.
- [ ] One resolved semantic state drives both visual and movement legality.
- [ ] Settlements are modeled as future city-line content metadata, not a new runtime family.
- [ ] Structure overlays stay separate from base terrain/environment fields.
- [ ] Intermediate package export writes the agreed file split.
- [ ] Validation flags settlements on resolved water instead of silently relocating them.
- [ ] `npm run lint:plans` passes.
- [ ] `npm run typecheck` passes.
- [ ] `npm run build` passes.
- [ ] Full-suite result is recorded if run.
- [ ] Project progress sync is updated if the child is promoted.
- [ ] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded

## Child Closeout

- Closed Child: `Yuanmo Hex Map Editor`
- Parent Task: `none`
- Parent Stage: `Map Authoring Tooling`
- Closeout Status: `waiting`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `choose-execution-mode`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-27-yuanmo-hex-map-editor-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, confirm this child is promoted, then execute Task 1 of docs/superpowers/plans/2026-07-27-yuanmo-hex-map-editor-plan.md.`
