# Board And Battle FPS Display Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an always-visible top-right FPS display to the campaign board page and the embedded battle page without changing gameplay, animation timing, or input behavior.

**Architecture:** Implement one lightweight FPS HUD per rendering context instead of a global debug system. The battle demo page owns its own sampling and HUD node inside `prototypes/battle-demo/index.html`, while the campaign board page adds a small HUD node to the map view shell and updates it from the campaign terrain render loop in `src/ui/views/map/campaign-terrain-webgl.ts`.

**Tech Stack:** TypeScript app runtime, campaign WebGL renderer, battle demo HTML/JS, Node `--test` regression files, `npm run typecheck`, `npm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-14`
- Current Focus: `Inline execution completed locally for the board and battle FPS HUD; verification passed for targeted regressions, while full typecheck remains blocked by pre-existing src/main.ts errors.`
- Next Step: `Review the local FPS HUD behavior and decide whether to keep the work as-is, refine it further, or prepare a clean commit once the unrelated typecheck errors are handled.`
- Verification: `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test tests\battle-fps-display.test.cjs PASS; C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test tests\campaign-fps-display.test.cjs PASS; C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs PASS; C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe node_modules\typescript\bin\tsc --noEmit -p tsconfig.json FAIL at src/main.ts:431 and src/main.ts:436 (pre-existing unrelated errors).`
- Notes: `Keep the HUD fixed at the top-right corner, always visible, click-through, and text-only as FPS.`

## Progress Log

- 2026-07-14
  - Summary: `Plan created from the approved board-and-battle FPS display design.`
  - Verification: `Not run`
  - Next: `Choose Subagent-Driven or Inline execution before touching runtime files.`

- 2026-07-14
  - Summary: `Implemented always-visible top-right FPS HUDs for battle-demo and the campaign map, added regression coverage for the readout/sampler helpers, and wired the campaign HUD to the terrain renderer only to avoid double-counting the actor layer.`
  - Verification: `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test tests\battle-fps-display.test.cjs PASS; C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test tests\campaign-fps-display.test.cjs PASS; C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs PASS; C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe node_modules\typescript\bin\tsc --noEmit -p tsconfig.json FAIL at src/main.ts:431 and src/main.ts:436 (pre-existing unrelated errors).`
  - Next: `Review the local FPS HUD behavior and decide whether to keep iterating or prepare a commit after the unrelated typecheck errors are resolved.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-14-board-battle-fps-display-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `The approved spec still matches the current request: campaign board page plus embedded battle page only.`
  - `The visible contract remains fixed top-right, always visible, text-only FPS, with no toggle and no extra metrics.`

## Implementation Scope

### In Scope

- `prototypes/battle-demo/index.html` battle-demo FPS HUD
- campaign map FPS HUD in the formal board view
- rolling / smoothed `requestAnimationFrame` sampling for readable FPS values
- click-through HUD styling and top-right positioning
- targeted regression tests for HUD formatting and safe updates

### Still Out Of Scope

- any global debug overlay system for unrelated screens
- frame-time / memory / draw-call metrics
- drag, toggle, or persistence controls
- hidden performance optimizations or render-loop throttling bundled with the HUD work

## File Map

### Existing files to modify

- `prototypes/battle-demo/index.html`
  - Add the battle-demo HUD markup, styling, frame-sampling helpers, and update loop wiring.
- `src/ui/views/map/map-view.ts`
  - Add the campaign-board HUD host markup inside the campaign map shell.
- `src/ui/views/map/campaign-terrain-webgl.ts`
  - Add campaign FPS sampling/update helpers and bind them to the active renderer RAF path.

### New files to create

- `tests/battle-fps-display.test.cjs`
  - Lock down the battle-demo FPS text formatting and frame-sampling behavior.
- `tests/campaign-fps-display.test.cjs`
  - Lock down the campaign renderer FPS formatting/update safety without booting the entire app.

## Verification Plan

- Targeted verification:
  - `Battle-demo FPS HUD formats and updates from frame timestamps without crashing.`
  - `Campaign FPS HUD updates safely when renderers are active, absent, or re-synced.`
- Required commands:
  - `npm run lint:plans`
  - `node --test tests/battle-fps-display.test.cjs`
  - `node --test tests/campaign-fps-display.test.cjs`
  - `npm run typecheck`

## Task 1: Add The Battle-Demo FPS HUD

**Files:**
- Modify: `prototypes/battle-demo/index.html`
- Create: `tests/battle-fps-display.test.cjs`

**Interfaces:**
- Consumes:
  - `window.requestAnimationFrame(callback: FrameRequestCallback): number`
  - `performance.now(): number`
- Produces:
  - `function formatFpsReadout(fpsValue) -> string`
  - `function createFpsSampler(windowMs = 500) -> { push(timestampMs): number, current(): number }`
  - `function updateBattleFpsHud(timestampMs): void`

- [x] **Step 1: Write the failing test**

Create `tests/battle-fps-display.test.cjs` with extraction-based coverage for the new battle-demo helpers:

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

function extractFunctionBody(source, signature) {
  const start = source.indexOf(signature);
  if (start === -1) throw new Error(`Missing signature: ${signature}`);
  const bodyStart = source.indexOf("{", start + signature.length);
  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(bodyStart + 1, index);
    }
  }
  throw new Error(`Unclosed function body for: ${signature}`);
}

function loadBattleFpsFns() {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  const formatBody = extractFunctionBody(source, "function formatFpsReadout(fpsValue)");
  const samplerBody = extractFunctionBody(source, "function createFpsSampler(windowMs = 500)");
  const formatFpsReadout = new Function(
    `return function formatFpsReadout(fpsValue) {${formatBody}};`
  )();
  const createFpsSampler = new Function(
    `return function createFpsSampler(windowMs = 500) {${samplerBody}};`
  )();
  return { formatFpsReadout, createFpsSampler };
}

test("battle FPS readout formats integers as top-right HUD text", () => {
  const { formatFpsReadout } = loadBattleFpsFns();
  assert.equal(formatFpsReadout(59.6), "FPS: 60");
  assert.equal(formatFpsReadout(null), "FPS: 0");
});

test("battle FPS sampler returns a stable positive value from rolling frame timestamps", () => {
  const { createFpsSampler } = loadBattleFpsFns();
  const sampler = createFpsSampler(500);
  sampler.push(0);
  sampler.push(16);
  sampler.push(32);
  sampler.push(48);
  assert.equal(sampler.current() > 0, true);
});
```

- [x] **Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/battle-fps-display.test.cjs
```

Expected:

- `FAIL`
- Missing `formatFpsReadout`
- Missing `createFpsSampler`

- [x] **Step 3: Write minimal implementation**

Add a click-through HUD node and helper functions in `prototypes/battle-demo/index.html`:

```html
<div class="battle-fps-hud" data-battle-fps-hud="true">FPS: 0</div>
```

```js
function formatFpsReadout(fpsValue) {
  const value = Number.isFinite(fpsValue) ? Math.max(0, Math.round(fpsValue)) : 0;
  return `FPS: ${value}`;
}

function createFpsSampler(windowMs = 500) {
  const frameTimes = [];
  let lastFps = 0;
  return {
    push(timestampMs) {
      if (Number.isFinite(timestampMs)) frameTimes.push(timestampMs);
      while (frameTimes.length > 1 && timestampMs - frameTimes[0] > windowMs) {
        frameTimes.shift();
      }
      if (frameTimes.length > 1) {
        const durationMs = frameTimes[frameTimes.length - 1] - frameTimes[0];
        const frames = frameTimes.length - 1;
        lastFps = durationMs > 0 ? (frames * 1000) / durationMs : lastFps;
      }
      return lastFps;
    },
    current() {
      return lastFps;
    },
  };
}
```

Then wire `updateBattleFpsHud(timestampMs)` into the existing animation-frame cadence so the HUD remains active in both board and battle presentation states.

Add concrete runtime state near the other top-level battle-demo view caches:

```js
const battleFpsState = {
  hud: null,
  sampler: createFpsSampler(500),
  rafId: 0,
};

function ensureBattleFpsHud() {
  if (!battleFpsState.hud) {
    battleFpsState.hud = document.querySelector("[data-battle-fps-hud='true']");
  }
  return battleFpsState.hud;
}

function updateBattleFpsHud(timestampMs) {
  const hud = ensureBattleFpsHud();
  if (!hud) return;
  const fps = battleFpsState.sampler.push(timestampMs);
  hud.textContent = formatFpsReadout(fps);
}

function tickBattleFpsHud(timestampMs) {
  updateBattleFpsHud(timestampMs);
  battleFpsState.rafId = window.requestAnimationFrame(tickBattleFpsHud);
}

battleFpsState.rafId = window.requestAnimationFrame(tickBattleFpsHud);
```

- [x] **Step 4: Run test to verify it passes**

Run:

```bash
node --test tests/battle-fps-display.test.cjs
```

Expected:

- `PASS`

- [ ] **Step 5: Commit**

```bash
git add tests/battle-fps-display.test.cjs prototypes/battle-demo/index.html
git commit -m "feat: add battle demo fps display"
```

## Task 2: Add The Campaign-Board FPS HUD

**Files:**
- Modify: `src/ui/views/map/map-view.ts`
- Modify: `src/ui/views/map/campaign-terrain-webgl.ts`
- Create: `tests/campaign-fps-display.test.cjs`

**Interfaces:**
- Consumes:
  - `requestCampaignTerrainRender(reason?: "static" | "dynamic"): void`
  - campaign renderer RAF-driven `render()` / `requestRender()` flow
  - map shell markup in `renderCampaignMap(model)`
- Produces:
  - `function ensureCampaignFpsHud(root) -> HTMLElement | null`
  - `function formatCampaignFpsReadout(fpsValue) -> string`
  - `function createCampaignFpsSampler(windowMs = 500) -> { push(timestampMs): number, current(): number }`
  - safe HUD updates from the campaign terrain render path

- [x] **Step 1: Write the failing test**

Create `tests/campaign-fps-display.test.cjs` that loads the new campaign helpers from `.test-dist/src/ui/views/map/campaign-terrain-webgl.js` after `npm run build:test`:

```js
const test = require("node:test");
const assert = require("node:assert/strict");

const {
  formatCampaignFpsReadout,
  createCampaignFpsSampler,
} = require("../.test-dist/src/ui/views/map/campaign-terrain-webgl.js");

test("campaign FPS readout formats integers for the map HUD", () => {
  assert.equal(formatCampaignFpsReadout(47.2), "FPS: 47");
  assert.equal(formatCampaignFpsReadout(undefined), "FPS: 0");
});

test("campaign FPS sampler keeps a safe last value with sparse timestamps", () => {
  const sampler = createCampaignFpsSampler(500);
  assert.equal(sampler.current(), 0);
  sampler.push(100);
  sampler.push(116);
  sampler.push(132);
  assert.equal(sampler.current() > 0, true);
});
```

- [x] **Step 2: Run test to verify it fails**

Run:

```bash
npm run build:test
node --test tests/campaign-fps-display.test.cjs
```

Expected:

- `FAIL`
- Missing exported FPS helper(s) from `campaign-terrain-webgl.ts`

- [x] **Step 3: Write minimal implementation**

In `src/ui/views/map/map-view.ts`, add the fixed top-right host inside the campaign map shell:

```ts
<div class="c-campaign-map__fps-hud" data-campaign-fps-hud="true">FPS: 0</div>
```

In `src/ui/views/map/campaign-terrain-webgl.ts`, add sampling / formatting helpers and update the HUD from the RAF-driven render path:

```ts
export function formatCampaignFpsReadout(fpsValue: number | null | undefined): string {
  const value = Number.isFinite(fpsValue) ? Math.max(0, Math.round(fpsValue as number)) : 0;
  return `FPS: ${value}`;
}

export function createCampaignFpsSampler(windowMs = 500): {
  push: (timestampMs: number) => number;
  current: () => number;
} {
  const frameTimes: number[] = [];
  let lastFps = 0;
  return {
    push(timestampMs) {
      frameTimes.push(timestampMs);
      while (frameTimes.length > 1 && timestampMs - frameTimes[0] > windowMs) {
        frameTimes.shift();
      }
      if (frameTimes.length > 1) {
        const durationMs = frameTimes[frameTimes.length - 1] - frameTimes[0];
        lastFps = durationMs > 0 ? ((frameTimes.length - 1) * 1000) / durationMs : lastFps;
      }
      return lastFps;
    },
    current() {
      return lastFps;
    },
  };
}
```

Add concrete campaign HUD state and update it from the renderer render path:

```ts
const campaignFpsState = {
  sampler: createCampaignFpsSampler(500),
  lastText: "FPS: 0",
};

export function ensureCampaignFpsHud(root: ParentNode): HTMLElement | null {
  return root.querySelector<HTMLElement>("[data-campaign-fps-hud='true']");
}

function updateCampaignFpsHud(root: ParentNode, timestampMs: number): void {
  const hud = ensureCampaignFpsHud(root);
  if (hud == null) return;
  const fps = campaignFpsState.sampler.push(timestampMs);
  const nextText = formatCampaignFpsReadout(fps);
  if (nextText !== campaignFpsState.lastText) {
    hud.textContent = nextText;
    campaignFpsState.lastText = nextText;
  }
}
```

Then call `updateCampaignFpsHud(canvas.getRootNode() as ParentNode, performance.now())` from the RAF-driven renderer `render()` path after a successful frame, and style the host with `pointer-events: none` so it never blocks map input.

- [x] **Step 4: Run test to verify it passes**

Run:

```bash
npm run build:test
node --test tests/campaign-fps-display.test.cjs
```

Expected:

- `PASS`

- [ ] **Step 5: Commit**

```bash
git add tests/campaign-fps-display.test.cjs src/ui/views/map/map-view.ts src/ui/views/map/campaign-terrain-webgl.ts
git commit -m "feat: add campaign board fps display"
```

## Task 3: Verify, Sync Plan State, And Prepare Closeout Choice

**Files:**
- Modify: `docs/superpowers/plans/2026-07-14-board-battle-fps-display.md`
- Read: `docs/superpowers/project-progress.md`

**Interfaces:**
- Consumes:
  - battle-demo HUD helpers from Task 1
  - campaign HUD helpers from Task 2
- Produces:
  - updated child `Execution State`
  - updated `Progress Log`
  - recorded verification results for branch-finishing review

- [x] **Step 1: Run plan governance lint**

Run:

```bash
npm run lint:plans
```

Expected:

- `PASS`

- [x] **Step 2: Run focused verification**

Run:

```bash
node --test tests/battle-fps-display.test.cjs
node --test tests/campaign-fps-display.test.cjs
npm run typecheck
```

Expected:

- all targeted FPS tests `PASS`
- `npm run typecheck` exits successfully

- [x] **Step 3: Sync progress and governance state**

Update this plan after the implementation batch:

```md
## Execution State
- Status: `completed-but-open`
- Last Updated: `2026-07-14`
- Current Focus: `Inline or subagent execution completed locally for the board and battle FPS HUD; waiting for branch closeout choice.`
- Next Step: `Choose how to finish the development branch after reviewing the FPS HUD verification results.`
- Verification: `npm run lint:plans PASS; node --test tests/battle-fps-display.test.cjs PASS; node --test tests/campaign-fps-display.test.cjs PASS; npm run typecheck PASS`
```

Append a new `Progress Log` entry with the same verification results and mark the completed task checkboxes `[x]`.

- [ ] **Step 4: Commit**

```bash
git add docs/superpowers/plans/2026-07-14-board-battle-fps-display.md
git commit -m "docs: update fps display implementation plan state"
```

## Exit Check

- [x] `The campaign board page shows an always-visible top-right FPS HUD.`
- [x] `The embedded battle page shows an always-visible top-right FPS HUD.`
- [x] `Both HUDs remain click-through and text-only.`
- [x] `Battle and campaign FPS helpers are covered by targeted regressions.`
- [ ] Project progress sync is updated if the child state changed.
- [ ] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Board And Battle FPS Display`
- Parent Task: `None recorded in canonical progress yet`
- Parent Stage: `Governance Migration`
- Closeout Status: `closed`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `close-task`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `none`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, then decide whether to sync this child into the canonical progress flow before closing it.`
