# Worldbox Civilization Sandbox Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first validation slice of a WorldBox-like campaign-map sandbox with placeable lords, visible individuals, race-specific naming/behavior, houses, farms, and territory overlays.

**Architecture:** Add a formal sandbox runtime under `GameState.runtime.civilizationSandbox`, with pure domain/application simulation code and a presenter-projected map overlay. UI rendering consumes view-model data only; simulation code never reads DOM, CSS, WebGL objects, camera state, or concrete asset file paths.

**Tech Stack:** TypeScript domain/application/UI modules; Node test runner through `npm run build:test` plus targeted `node --test`; Vite build through `npm run build`; plan validation through `npm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-08-07`
- Current Focus: `Implementation complete with automated verification passing; browser plugin click automation was limited during final smoke testing.`
- Next Step: `Review the running validation slice at http://127.0.0.1:5174/, then push if requested before any closed status is written.`
- Verification: `npm run build:test; node --test --test-isolation=none tests/civilization-sandbox-domain.test.cjs tests/civilization-sandbox-map-overlay.test.cjs; node --test --test-name-pattern "civilization sandbox" tests/robustness.test.cjs; npm run typecheck; npm run build; npm run lint:plans; git diff --check`
- Notes: `docs/superpowers/project-progress.md still points to the campaign-cloud completed-but-open child; this sandbox execution was started by explicit user direction on a dedicated branch without changing the canonical progress entry. In-app browser automation loaded the 5174 app and controls, but final repeated click smoke was blocked by stale/coordinate limitations in the Codex browser wrapper; action/render/name uniqueness paths are covered by tests.`

## Progress Log

- 2026-08-07
  - Summary: `Adjusted sandbox validation to start active before any race is placed, hide the campaign player marker/model from the first frame, and synchronize territory/farm hex polygons through the terrain projection path so they follow camera movement.`
  - Verification: `npm run build:test`; `node --test --test-isolation=none tests/civilization-sandbox-domain.test.cjs tests/civilization-sandbox-map-overlay.test.cjs`; `node --test --test-name-pattern "civilization sandbox" tests/robustness.test.cjs`; `npm run typecheck`; `npm run build`; `npm run lint:plans`; `git diff --check`
  - Next: `Review the running validation slice; push if requested before marking this child closed.`

- 2026-08-07
  - Summary: `Refined the validation slice by hiding legacy HUD/backpack/troop controls and source campaign city/settlement/fort markers while the civilization sandbox is active, and changed NPC tick movement so walkers continue from their current claimed hex instead of snapping back to the home hex.`
  - Verification: `npm run build:test`; `node --test --test-isolation=none tests/civilization-sandbox-map-overlay.test.cjs tests/civilization-sandbox-domain.test.cjs`; `node --test --test-name-pattern "civilization sandbox" tests/robustness.test.cjs`; `npm run typecheck`; `npm run build`; `npm run lint:plans`; `git diff --check`
  - Next: `Review the running validation slice; push if requested before marking this child closed.`

- 2026-08-07
  - Summary: `Fixed the validation slice so sandbox placement converts map coordinates to campaign hexes, individuals move between claimed hexes on tick, and rural-house structures feed the campaign terrain settlementVillage model channel instead of rendering as screen-space DOM blocks.`
  - Verification: `npm run build:test`; `node --test --test-isolation=none tests/civilization-sandbox-map-overlay.test.cjs tests/civilization-sandbox-domain.test.cjs`; `node --test --test-name-pattern "civilization sandbox" tests/robustness.test.cjs`; `npm run typecheck`; `npm run build`; `git diff --check`
  - Next: `Review the running validation slice at http://127.0.0.1:5174/ and push if requested before marking this child closed.`

- 2026-08-07
  - Summary: `Completed the first Worldbox civilization sandbox validation slice and fixed race child naming so generated individuals remain unique while preserving Wu/Yu/Chen naming rules.`
  - Verification: `npm run build:test`; `node --test --test-isolation=none tests/civilization-sandbox-domain.test.cjs tests/civilization-sandbox-map-overlay.test.cjs`; `node --test --test-name-pattern "civilization sandbox" tests/robustness.test.cjs`; `npm run typecheck`; `npm run build`; `npm run lint:plans`; `git diff --check`
  - Manual Check: `Dev server is running at http://127.0.0.1:5174/. Browser automation loaded the app and controls, but the final repeated click smoke was blocked by Codex browser wrapper stale-node/coordinate limitations after the naming fix.`
  - Next: `Review the final diff and running validation slice; push if requested before marking this child closed.`

- 2026-08-07
  - Summary: `Completed Task 5 for the Worldbox civilization sandbox: map overlay now renders territory hexes, visible individuals using walker sprites, rural-house structures, farm overlays, and token-based sandbox styles.`
  - Verification: `npm run build:test`; `node --test --test-isolation=none tests/civilization-sandbox-map-overlay.test.cjs tests/civilization-sandbox-domain.test.cjs`; `node --test --test-name-pattern "civilization sandbox" tests/robustness.test.cjs`; `npm run typecheck`
  - Next: `Commit Task 5, then run final verification and browser check.`

- 2026-08-07
  - Summary: `Completed Task 4 for the Worldbox civilization sandbox: added validation controls, an action coordinator, main-shell boundary guards, and a temporary main-shell coordinator call that does not import or execute sandbox business helpers directly.`
  - Verification: `npm run build:test`; `node --test --test-isolation=none tests/civilization-sandbox-map-overlay.test.cjs tests/civilization-sandbox-domain.test.cjs`; `node --test --test-name-pattern "civilization sandbox" tests/robustness.test.cjs`; `npm run typecheck`
  - Next: `Commit Task 4, then continue with visual overlay rendering and styles.`

- 2026-08-07
  - Summary: `Completed Task 3 for the Worldbox civilization sandbox: added a map overlay presenter and wired civilization sandbox overlay data through app render into the map view model.`
  - Verification: `npm run build:test`; `node --test --test-isolation=none tests/civilization-sandbox-map-overlay.test.cjs tests/civilization-sandbox-domain.test.cjs`; `npm run typecheck`
  - Next: `Commit Task 3, then continue with validation UI actions and main-shell boundary guards.`

- 2026-08-07
  - Summary: `Completed Task 2 for the Worldbox civilization sandbox: placing a lord now creates a civilization, settlement, household, starting individuals, and claimed land; sandbox ticks create rural-house and farm structures, expand territory, and add child records.`
  - Verification: `npm run build:test`; `node --test --test-isolation=none tests/civilization-sandbox-domain.test.cjs`; `npm run typecheck`
  - Next: `Commit Task 2, then continue with map overlay projection.`

- 2026-08-07
  - Summary: `Completed Task 1 for the Worldbox civilization sandbox: added the runtime state, three founding race templates, deterministic child naming, and createInitialState integration.`
  - Verification: `npm run build:test`; `node --test --test-isolation=none tests/civilization-sandbox-domain.test.cjs`; `npm run typecheck`
  - Next: `Commit Task 1, then continue with placement and tick simulation.`

- 2026-08-07
  - Summary: `Created the executable implementation plan for the approved Worldbox Civilization Sandbox design.`
  - Verification: `npm run lint:plans`
  - Next: `Wait for user execution choice after the active campaign-cloud child is resolved.`

---

## Global Constraints

- This feature is not house work; do not use the special-house module interface.
- Do not add sandbox business logic to `src/main.ts`.
- Do not hardcode concrete asset file paths in simulation code.
- Do not mutate player base stats, player money, player skills, player inventory, formal city ownership, or source map JSON.
- Simulation state belongs under `GameState.runtime.civilizationSandbox`.
- UI rendering consumes presenter/view-model data only.
- Farms and houses are sandbox overlay/runtime data until explicitly promoted into map content.
- New styles must use design tokens according to `docs/main-shell-contract.md`.
- The first target supports roughly 200 to 500 visible individuals.

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-08-07-worldbox-civilization-sandbox-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Main shell governance:
  - `docs/main-shell-contract.md`
- Related references:
  - `docs/superpowers/specs/2026-07-23-city-ambient-npc-walk-design.md`
  - `docs/superpowers/specs/2026-07-25-campaign-map-visual-profile-design.md`
  - `docs/superpowers/specs/2026-07-28-campaign-hex-runtime-grid-architecture-design.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `blocked-by-current-governance-entry`
- Notes:
  - `docs/superpowers/project-progress.md` currently points to `Campaign Cloud Volume Lighting Upgrade` as `completed-but-open`.
  - This plan is ready as a waiting child plan, but it is not the canonical current child until project progress is intentionally updated.
  - The current working tree has unrelated campaign-cloud modifications and temporary screenshots; do not include them in sandbox commits.

## Implementation Scope

### In Scope

- Domain state, race templates, name generators, and initial sandbox state.
- Pure simulation commands for placing lords, ticking work, claiming land, building houses, opening farms, and reproducing individuals.
- Map overlay projection for individuals, structures, farm cells, and territory colors.
- Map view-model and map-view rendering hooks for the sandbox overlay.
- A validation control surface for pause/play, speed, single-step, clear, place three lords, and territory view.
- Guard tests that keep `src/main.ts` free of sandbox business logic.

### Still Out Of Scope

- Full diplomacy.
- Full war campaigns.
- Formal army formations.
- Main-story, city, and house integration.
- Permanent scenario-pack authoring UI.
- New 3D character models.
- Writing farms/houses into source campaign hex JSON.
- Promoting sandbox civilizations into formal factions.

## File Map

### Existing files to modify

- `src/domain/game-state.ts`
  - Add optional `runtime.civilizationSandbox` state type import and field.
- `src/application/state/create-initial-state.ts`
  - Initialize `runtime.civilizationSandbox`.
- `src/ui/app-render.ts`
  - Pass projected sandbox overlay into `createMapViewModel`.
- `src/ui/views/map/map-view.ts`
  - Extend map view model and render sandbox overlay/control markup.
- `src/styles/views.css` or the existing map style owner file
  - Add token-based styles for sandbox overlay controls, sprites, structures, farms, and territory tint.
- `tests/robustness.test.cjs`
  - Add guard checks for main-shell boundary and sandbox asset path boundaries if no narrower test file already covers them.

### Existing files expected to be deleted

- None.

### New files to create

- `src/domain/civilization-sandbox.ts`
  - Domain types, constants, initial state factory, and public state helpers.
- `src/application/civilization-sandbox/race-templates.ts`
  - Three race definitions: Wu Tong, Yu Qingqing, Chen Yihan.
- `src/application/civilization-sandbox/name-generator.ts`
  - Deterministic race-specific child naming and generation fallback.
- `src/application/civilization-sandbox/placement.ts`
  - Place-lord command and initial civilization/settlement/individual creation.
- `src/application/civilization-sandbox/simulation.ts`
  - Tick loop, task assignment, movement/work completion, reproduction, land claim, house/farm creation.
- `src/application/civilization-sandbox/map-overlay-presenter.ts`
  - Project sandbox runtime state into map overlay view-model data.
- `src/application/runtime/coordinators/civilization-sandbox-action-coordinator.ts`
  - Handle validation UI actions without adding business branches to `src/main.ts`.
- `src/ui/views/map/civilization-sandbox-assets.ts`
  - UI-side resource-id to imported walker-image URL mapping.
- `tests/civilization-sandbox-domain.test.cjs`
  - Domain/name/placement/simulation contract tests.
- `tests/civilization-sandbox-map-overlay.test.cjs`
  - Presenter/view model/source-boundary tests.

## Verification Plan

- Targeted verification:
  - `npm run build:test`
  - `node --test --test-isolation=none tests/civilization-sandbox-domain.test.cjs tests/civilization-sandbox-map-overlay.test.cjs`
  - `node --test --test-name-pattern "civilization sandbox" tests/robustness.test.cjs`
- Required commands before closing implementation:
  - `npm run typecheck`
  - `npm run build`
  - `npm run lint:plans`
  - `git diff --check`
- Manual verification after UI task:
  - Start the dev server with `npm run dev:localhost`.
  - Place `吴同`, `于晴晴`, and `陈倚晗` on valid land.
  - Confirm individuals, rural-house structures, farm overlays, and territory view render.

## Task 1: Domain State And Race Naming

**Files:**
- Create: `src/domain/civilization-sandbox.ts`
- Create: `src/application/civilization-sandbox/race-templates.ts`
- Create: `src/application/civilization-sandbox/name-generator.ts`
- Modify: `src/domain/game-state.ts`
- Modify: `src/application/state/create-initial-state.ts`
- Test: `tests/civilization-sandbox-domain.test.cjs`

**Interfaces:**
- Produces: `createInitialCivilizationSandboxState(): CivilizationSandboxState`
- Produces: `SANDBOX_RACE_TEMPLATES: Record<SandboxRaceId, SandboxRaceTemplate>`
- Produces: `generateSandboxChildName(input: SandboxNameInput): string`
- Produces: `GameState["runtime"]["civilizationSandbox"]`
- Consumes: no sandbox code from earlier tasks

- [x] **Step 1: Write failing domain and naming tests**

Create `tests/civilization-sandbox-domain.test.cjs` with these tests:

```js
const assert = require("node:assert/strict");
const test = require("node:test");
const { loadRepoModule } = require("./helpers/load-repo-module.cjs");

test("civilization sandbox initial state is empty and disabled", () => {
  const { createInitialCivilizationSandboxState } = loadRepoModule(
    "./../src/domain/civilization-sandbox"
  );

  const state = createInitialCivilizationSandboxState();

  assert.equal(state.enabled, false);
  assert.equal(state.tick, 0);
  assert.equal(state.mode, "validation");
  assert.equal(state.viewMode, "normal");
  assert.deepEqual(state.civilizationsById, {});
  assert.deepEqual(state.individualsById, {});
  assert.deepEqual(state.claimedHexByKey, {});
});

test("civilization sandbox race templates encode the three founding behaviors", () => {
  const { SANDBOX_RACE_TEMPLATES } = loadRepoModule(
    "./../src/application/civilization-sandbox/race-templates"
  );

  assert.equal(SANDBOX_RACE_TEMPLATES["wu-tong"].founderName, "吴同");
  assert.equal(SANDBOX_RACE_TEMPLATES["wu-tong"].behavior.combat, 3);
  assert.equal(SANDBOX_RACE_TEMPLATES["wu-tong"].behavior.expansion, 3);

  assert.equal(SANDBOX_RACE_TEMPLATES["yu-qingqing"].founderName, "于晴晴");
  assert.equal(SANDBOX_RACE_TEMPLATES["yu-qingqing"].behavior.farming, 3);
  assert.equal(SANDBOX_RACE_TEMPLATES["yu-qingqing"].behavior.conflictAvoidance, 3);

  assert.equal(SANDBOX_RACE_TEMPLATES["chen-yihan"].founderName, "陈倚晗");
  assert.equal(SANDBOX_RACE_TEMPLATES["chen-yihan"].behavior.technology, 3);
  assert.equal(SANDBOX_RACE_TEMPLATES["chen-yihan"].behavior.building, 3);
});

test("civilization sandbox name generators use race-specific child names and fallback", () => {
  const { generateSandboxChildName } = loadRepoModule(
    "./../src/application/civilization-sandbox/name-generator"
  );

  assert.equal(
    generateSandboxChildName({ raceId: "wu-tong", birthIndex: 0, usedNames: [] }),
    "吴安同"
  );
  assert.equal(
    generateSandboxChildName({ raceId: "yu-qingqing", birthIndex: 0, usedNames: [] }),
    "于晶晶"
  );
  assert.equal(
    generateSandboxChildName({ raceId: "chen-yihan", birthIndex: 0, usedNames: [] }),
    "陈1晗"
  );
  assert.equal(
    generateSandboxChildName({
      raceId: "chen-yihan",
      birthIndex: 99,
      usedNames: Array.from({ length: 99 }, (_, index) => `陈${index + 1}晗`),
    }),
    "陈倚晗二世"
  );
});
```

- [x] **Step 2: Run the failing tests**

Run:

```bash
npm run build:test
node --test --test-isolation=none tests/civilization-sandbox-domain.test.cjs
```

Expected:

- `npm run build:test` passes.
- `node --test` fails because `src/domain/civilization-sandbox` and related modules do not exist.

- [x] **Step 3: Add the domain state module**

Create `src/domain/civilization-sandbox.ts`:

```ts
export type SandboxRaceId = "wu-tong" | "yu-qingqing" | "chen-yihan";

export type SandboxHexCoordinate = {
  x: number;
  y: number;
};

export type SandboxDirection =
  | "right-up"
  | "right-down"
  | "left-up"
  | "left-down";

export type SandboxRole =
  | "lord"
  | "farmer"
  | "builder"
  | "forager"
  | "fighter"
  | "child"
  | "idle";

export type SandboxTask =
  | { type: "forage"; targetHex: SandboxHexCoordinate; progress: number }
  | { type: "build-house"; targetHex: SandboxHexCoordinate; progress: number }
  | { type: "build-farm"; targetHex: SandboxHexCoordinate; progress: number }
  | { type: "farm"; targetHex: SandboxHexCoordinate; progress: number }
  | { type: "claim-hex"; targetHex: SandboxHexCoordinate; progress: number }
  | { type: "patrol"; targetHex: SandboxHexCoordinate; progress: number }
  | { type: "idle"; progress: number };

export type SandboxIndividual = {
  id: string;
  name: string;
  raceId: SandboxRaceId;
  civilizationId: string;
  settlementId: string | null;
  householdId: string | null;
  role: SandboxRole;
  age: number;
  sex: "male" | "female";
  hex: SandboxHexCoordinate;
  direction: SandboxDirection;
  spriteVariantId: string;
  needs: {
    hunger: number;
    stamina: number;
  };
  traits: string[];
  task: SandboxTask | null;
};

export type SandboxCivilization = {
  id: string;
  raceId: SandboxRaceId;
  colorToken: string;
  lordId: string;
  settlementIds: string[];
  claimedHexKeys: string[];
  stockpile: {
    food: number;
    wood: number;
  };
  technology: {
    progress: number;
  };
  reservedDiplomaticStance: Record<string, "neutral" | "hostile" | "friendly">;
  birthCount: number;
  activityLog: string[];
};

export type SandboxHousehold = {
  id: string;
  civilizationId: string;
  settlementId: string;
  memberIds: string[];
  houseStructureId: string | null;
  birthCooldownTicks: number;
};

export type SandboxSettlement = {
  id: string;
  civilizationId: string;
  name: string;
  level: "camp" | "village" | "fort" | "town";
  centerHex: SandboxHexCoordinate;
  structureIds: string[];
};

export type SandboxStructure = {
  id: string;
  kind: "rural-house" | "farm" | "storage" | "fort";
  civilizationId: string;
  settlementId: string;
  hex: SandboxHexCoordinate;
  buildProgress: number;
  workers: string[];
};

export type SandboxEvent = {
  tick: number;
  message: string;
};

export type CivilizationSandboxState = {
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

export function getSandboxHexKey(hex: SandboxHexCoordinate): string {
  return `${hex.x},${hex.y}`;
}

export function createInitialCivilizationSandboxState(): CivilizationSandboxState {
  return {
    enabled: false,
    seed: "validation",
    tick: 0,
    mode: "validation",
    selectedEntityId: null,
    viewMode: "normal",
    civilizationsById: {},
    individualsById: {},
    householdsById: {},
    settlementsById: {},
    structuresById: {},
    claimedHexByKey: {},
    recentEvents: [],
  };
}
```

- [x] **Step 4: Add race templates**

Create `src/application/civilization-sandbox/race-templates.ts`:

```ts
import type { SandboxRaceId } from "../../domain/civilization-sandbox";

export type SandboxRaceTemplate = {
  id: SandboxRaceId;
  founderName: string;
  colorToken: string;
  preferredLordSprites: string[];
  behavior: {
    combat: number;
    expansion: number;
    farming: number;
    building: number;
    technology: number;
    conflictAvoidance: number;
  };
};

export const SANDBOX_RACE_TEMPLATES: Record<SandboxRaceId, SandboxRaceTemplate> = {
  "wu-tong": {
    id: "wu-tong",
    founderName: "吴同",
    colorToken: "sandbox-civilization-wu",
    preferredLordSprites: ["noble1", "noble2"],
    behavior: {
      combat: 3,
      expansion: 3,
      farming: 1,
      building: 1,
      technology: 1,
      conflictAvoidance: 0,
    },
  },
  "yu-qingqing": {
    id: "yu-qingqing",
    founderName: "于晴晴",
    colorToken: "sandbox-civilization-yu",
    preferredLordSprites: ["commoner1", "commoner2"],
    behavior: {
      combat: 1,
      expansion: 1,
      farming: 3,
      building: 1,
      technology: 1,
      conflictAvoidance: 3,
    },
  },
  "chen-yihan": {
    id: "chen-yihan",
    founderName: "陈倚晗",
    colorToken: "sandbox-civilization-chen",
    preferredLordSprites: ["scholar1", "official1"],
    behavior: {
      combat: 1,
      expansion: 2,
      farming: 2,
      building: 3,
      technology: 3,
      conflictAvoidance: 1,
    },
  },
};
```

- [x] **Step 5: Add deterministic name generation**

Create `src/application/civilization-sandbox/name-generator.ts`:

```ts
import type { SandboxRaceId } from "../../domain/civilization-sandbox";
import { SANDBOX_RACE_TEMPLATES } from "./race-templates";

const WU_MIDDLE_CHARACTERS = [
  "安",
  "仲",
  "远",
  "明",
  "正",
  "承",
  "德",
  "良",
  "景",
  "文",
];

const YU_DUPLICATED_NAMES = [
  "晶晶",
  "青青",
  "暖暖",
  "臭臭",
  "圆圆",
  "宁宁",
  "甜甜",
  "云云",
  "苗苗",
  "晴晴",
];

const GENERATION_LABELS = [
  "二世",
  "三世",
  "四世",
  "五世",
  "六世",
  "七世",
  "八世",
  "九世",
  "十世",
];

export type SandboxNameInput = {
  raceId: SandboxRaceId;
  birthIndex: number;
  usedNames: string[];
};

export function generateSandboxChildName(input: SandboxNameInput): string {
  const usedNames = new Set(input.usedNames);
  const preferredName = getPreferredRaceName(input.raceId, input.birthIndex);

  if (preferredName != null && !usedNames.has(preferredName)) {
    return preferredName;
  }

  return generateFallbackName(input.raceId, input.birthIndex);
}

function getPreferredRaceName(
  raceId: SandboxRaceId,
  birthIndex: number
): string | null {
  if (raceId === "wu-tong") {
    const middle = WU_MIDDLE_CHARACTERS[birthIndex];
    return middle == null ? null : `吴${middle}同`;
  }

  if (raceId === "yu-qingqing") {
    const suffix = YU_DUPLICATED_NAMES[birthIndex];
    return suffix == null ? null : `于${suffix}`;
  }

  if (raceId === "chen-yihan") {
    if (birthIndex >= 0 && birthIndex < 99) {
      return `陈${birthIndex + 1}晗`;
    }
  }

  return null;
}

function generateFallbackName(raceId: SandboxRaceId, birthIndex: number): string {
  const founderName = SANDBOX_RACE_TEMPLATES[raceId].founderName;
  const generationIndex = Math.max(0, birthIndex - 99);
  const generationLabel =
    GENERATION_LABELS[generationIndex] ?? `${generationIndex + 2}世`;

  return `${founderName}${generationLabel}`;
}
```

- [x] **Step 6: Add runtime state to GameState**

Modify `src/domain/game-state.ts` by importing the type and adding the runtime field:

```ts
import type { CivilizationSandboxState } from "./civilization-sandbox";
```

Add this inside `runtime`:

```ts
civilizationSandbox: CivilizationSandboxState;
```

- [x] **Step 7: Initialize sandbox runtime state**

Modify `src/application/state/create-initial-state.ts`:

```ts
import { createInitialCivilizationSandboxState } from "../../domain/civilization-sandbox";
```

Add this inside the returned `runtime` object:

```ts
civilizationSandbox: createInitialCivilizationSandboxState(),
```

- [x] **Step 8: Run tests for Task 1**

Run:

```bash
npm run build:test
node --test --test-isolation=none tests/civilization-sandbox-domain.test.cjs
npm run typecheck
```

Expected:

- domain tests pass
- typecheck passes

- [x] **Step 9: Commit Task 1**

Run:

```bash
git add src/domain/civilization-sandbox.ts src/application/civilization-sandbox/race-templates.ts src/application/civilization-sandbox/name-generator.ts src/domain/game-state.ts src/application/state/create-initial-state.ts tests/civilization-sandbox-domain.test.cjs
git commit -m "feat: add civilization sandbox runtime state"
```

## Task 2: Placement And Simulation Core

**Files:**
- Create: `src/application/civilization-sandbox/placement.ts`
- Create: `src/application/civilization-sandbox/simulation.ts`
- Modify: `tests/civilization-sandbox-domain.test.cjs`

**Interfaces:**
- Consumes: `CivilizationSandboxState`, `SandboxRaceId`, `getSandboxHexKey`
- Consumes: `SANDBOX_RACE_TEMPLATES`
- Produces: `placeSandboxLord(input: PlaceSandboxLordInput): CivilizationSandboxState`
- Produces: `tickCivilizationSandbox(state: CivilizationSandboxState): CivilizationSandboxState`

- [x] **Step 1: Add failing placement and tick tests**

Append these tests to `tests/civilization-sandbox-domain.test.cjs`:

```js
test("placing a sandbox lord creates civilization settlement household and claimed land", () => {
  const { createInitialCivilizationSandboxState } = loadRepoModule(
    "./../src/domain/civilization-sandbox"
  );
  const { placeSandboxLord } = loadRepoModule(
    "./../src/application/civilization-sandbox/placement"
  );

  const state = placeSandboxLord({
    state: createInitialCivilizationSandboxState(),
    raceId: "wu-tong",
    hex: { x: 4, y: -2 },
  });

  assert.equal(state.enabled, true);
  assert.equal(Object.keys(state.civilizationsById).length, 1);
  assert.equal(Object.keys(state.settlementsById).length, 1);
  assert.equal(Object.keys(state.householdsById).length, 1);
  assert.equal(Object.keys(state.individualsById).length, 4);
  assert.equal(state.claimedHexByKey["4,-2"], "civ.wu-tong.1");
  assert.equal(state.individualsById["individual.wu-tong.1"]?.name, "吴同");
  assert.equal(state.individualsById["individual.wu-tong.1"]?.role, "lord");
});

test("sandbox tick creates visible house farm and child records from starting civilization", () => {
  const { createInitialCivilizationSandboxState } = loadRepoModule(
    "./../src/domain/civilization-sandbox"
  );
  const { placeSandboxLord } = loadRepoModule(
    "./../src/application/civilization-sandbox/placement"
  );
  const { tickCivilizationSandbox } = loadRepoModule(
    "./../src/application/civilization-sandbox/simulation"
  );

  let state = placeSandboxLord({
    state: createInitialCivilizationSandboxState(),
    raceId: "yu-qingqing",
    hex: { x: 0, y: 0 },
  });

  for (let index = 0; index < 8; index += 1) {
    state = tickCivilizationSandbox(state);
  }

  assert.ok(
    Object.values(state.structuresById).some((structure) => structure.kind === "rural-house")
  );
  assert.ok(
    Object.values(state.structuresById).some((structure) => structure.kind === "farm")
  );
  assert.ok(
    Object.values(state.individualsById).some((individual) => individual.name === "于晶晶")
  );
  assert.ok(Object.keys(state.claimedHexByKey).length > 1);
});
```

- [x] **Step 2: Run tests and confirm placement modules are missing**

Run:

```bash
npm run build:test
node --test --test-isolation=none tests/civilization-sandbox-domain.test.cjs
```

Expected:

- build succeeds
- tests fail because `placement` and `simulation` modules do not exist

- [x] **Step 3: Implement lord placement**

Create `src/application/civilization-sandbox/placement.ts`:

```ts
import {
  getSandboxHexKey,
  type CivilizationSandboxState,
  type SandboxCivilization,
  type SandboxHousehold,
  type SandboxIndividual,
  type SandboxRaceId,
  type SandboxSettlement,
} from "../../domain/civilization-sandbox";
import { SANDBOX_RACE_TEMPLATES } from "./race-templates";
import { generateSandboxChildName } from "./name-generator";

export type PlaceSandboxLordInput = {
  state: CivilizationSandboxState;
  raceId: SandboxRaceId;
  hex: { x: number; y: number };
};

export function placeSandboxLord(input: PlaceSandboxLordInput): CivilizationSandboxState {
  const existingCount = Object.values(input.state.civilizationsById).filter(
    (civilization) => civilization.raceId === input.raceId
  ).length;
  const index = existingCount + 1;
  const race = SANDBOX_RACE_TEMPLATES[input.raceId];
  const civilizationId = `civ.${input.raceId}.${index}`;
  const settlementId = `settlement.${input.raceId}.${index}`;
  const householdId = `household.${input.raceId}.${index}`;
  const lordId = `individual.${input.raceId}.${index}`;
  const helperIds = [1, 2, 3].map((helperIndex) =>
    `individual.${input.raceId}.${index}.${helperIndex}`
  );
  const claimedHexKey = getSandboxHexKey(input.hex);
  const civilization: SandboxCivilization = {
    id: civilizationId,
    raceId: input.raceId,
    colorToken: race.colorToken,
    lordId,
    settlementIds: [settlementId],
    claimedHexKeys: [claimedHexKey],
    stockpile: {
      food: 12,
      wood: 12,
    },
    technology: {
      progress: 0,
    },
    reservedDiplomaticStance: {},
    birthCount: 0,
    activityLog: [`${race.founderName} founded a camp.`],
  };
  const settlement: SandboxSettlement = {
    id: settlementId,
    civilizationId,
    name: `${race.founderName}营地`,
    level: "camp",
    centerHex: input.hex,
    structureIds: [],
  };
  const household: SandboxHousehold = {
    id: householdId,
    civilizationId,
    settlementId,
    memberIds: [lordId, ...helperIds],
    houseStructureId: null,
    birthCooldownTicks: 0,
  };
  const individuals: Record<string, SandboxIndividual> = {
    [lordId]: createIndividual({
      id: lordId,
      name: race.founderName,
      raceId: input.raceId,
      civilizationId,
      settlementId,
      householdId,
      role: "lord",
      hex: input.hex,
      spriteVariantId: race.preferredLordSprites[0] ?? "noble1",
      sex: "male",
    }),
  };

  for (const [helperIndex, helperId] of helperIds.entries()) {
    individuals[helperId] = createIndividual({
      id: helperId,
      name: generateSandboxChildName({
        raceId: input.raceId,
        birthIndex: helperIndex,
        usedNames: [race.founderName, ...Object.values(individuals).map((item) => item.name)],
      }),
      raceId: input.raceId,
      civilizationId,
      settlementId,
      householdId,
      role: helperIndex === 0 ? "farmer" : helperIndex === 1 ? "builder" : "forager",
      hex: input.hex,
      spriteVariantId: helperIndex === 0 ? "commoner1" : "commoner2",
      sex: helperIndex % 2 === 0 ? "female" : "male",
    });
  }

  return {
    ...input.state,
    enabled: true,
    civilizationsById: {
      ...input.state.civilizationsById,
      [civilizationId]: civilization,
    },
    settlementsById: {
      ...input.state.settlementsById,
      [settlementId]: settlement,
    },
    householdsById: {
      ...input.state.householdsById,
      [householdId]: household,
    },
    individualsById: {
      ...input.state.individualsById,
      ...individuals,
    },
    claimedHexByKey: {
      ...input.state.claimedHexByKey,
      [claimedHexKey]: civilizationId,
    },
    recentEvents: [
      ...input.state.recentEvents,
      {
        tick: input.state.tick,
        message: `${race.founderName} placed at ${claimedHexKey}.`,
      },
    ],
  };
}

function createIndividual(input: {
  id: string;
  name: string;
  raceId: SandboxRaceId;
  civilizationId: string;
  settlementId: string;
  householdId: string;
  role: SandboxIndividual["role"];
  hex: { x: number; y: number };
  spriteVariantId: string;
  sex: "male" | "female";
}): SandboxIndividual {
  return {
    id: input.id,
    name: input.name,
    raceId: input.raceId,
    civilizationId: input.civilizationId,
    settlementId: input.settlementId,
    householdId: input.householdId,
    role: input.role,
    age: input.role === "lord" ? 24 : 18,
    sex: input.sex,
    hex: input.hex,
    direction: "right-down",
    spriteVariantId: input.spriteVariantId,
    needs: {
      hunger: 0,
      stamina: 100,
    },
    traits: [],
    task: null,
  };
}
```

- [x] **Step 4: Implement deterministic simulation tick**

Create `src/application/civilization-sandbox/simulation.ts`:

```ts
import {
  getSandboxHexKey,
  type CivilizationSandboxState,
  type SandboxCivilization,
  type SandboxIndividual,
  type SandboxStructure,
} from "../../domain/civilization-sandbox";
import { generateSandboxChildName } from "./name-generator";
import { SANDBOX_RACE_TEMPLATES } from "./race-templates";

const ADJACENT_HEXES = [
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 1 },
  { x: -1, y: 0 },
  { x: 0, y: -1 },
  { x: 1, y: -1 },
];

export function tickCivilizationSandbox(
  state: CivilizationSandboxState
): CivilizationSandboxState {
  if (!state.enabled) {
    return state;
  }

  let nextState: CivilizationSandboxState = {
    ...state,
    tick: state.tick + 1,
  };

  for (const civilization of Object.values(nextState.civilizationsById)) {
    nextState = ensureCivilizationHouse(nextState, civilization);
    nextState = ensureCivilizationFarm(nextState, civilization);
    nextState = claimNextAdjacentHex(nextState, civilization);
    nextState = reproduceIfReady(nextState, civilization);
  }

  return nextState;
}

function ensureCivilizationHouse(
  state: CivilizationSandboxState,
  civilization: SandboxCivilization
): CivilizationSandboxState {
  if (
    Object.values(state.structuresById).some(
      (structure) =>
        structure.civilizationId === civilization.id && structure.kind === "rural-house"
    )
  ) {
    return state;
  }

  const centerHex = getCivilizationCenterHex(state, civilization);
  return addStructure(state, civilization, {
    kind: "rural-house",
    hex: centerHex,
    event: "built a rural house",
  });
}

function ensureCivilizationFarm(
  state: CivilizationSandboxState,
  civilization: SandboxCivilization
): CivilizationSandboxState {
  if (
    Object.values(state.structuresById).some(
      (structure) =>
        structure.civilizationId === civilization.id && structure.kind === "farm"
    )
  ) {
    return state;
  }

  const centerHex = getCivilizationCenterHex(state, civilization);
  const farmHex = { x: centerHex.x + 1, y: centerHex.y };
  return addStructure(state, civilization, {
    kind: "farm",
    hex: farmHex,
    event: "opened a farm",
  });
}

function claimNextAdjacentHex(
  state: CivilizationSandboxState,
  civilization: SandboxCivilization
): CivilizationSandboxState {
  const centerHex = getCivilizationCenterHex(state, civilization);
  const claimLimit = SANDBOX_RACE_TEMPLATES[civilization.raceId].behavior.expansion + 1;

  if (civilization.claimedHexKeys.length >= claimLimit) {
    return state;
  }

  for (const offset of ADJACENT_HEXES) {
    const hex = { x: centerHex.x + offset.x, y: centerHex.y + offset.y };
    const key = getSandboxHexKey(hex);
    if (state.claimedHexByKey[key] == null) {
      return {
        ...state,
        civilizationsById: {
          ...state.civilizationsById,
          [civilization.id]: {
            ...civilization,
            claimedHexKeys: [...civilization.claimedHexKeys, key],
          },
        },
        claimedHexByKey: {
          ...state.claimedHexByKey,
          [key]: civilization.id,
        },
        recentEvents: [
          ...state.recentEvents,
          {
            tick: state.tick,
            message: `${civilization.id} claimed ${key}.`,
          },
        ],
      };
    }
  }

  return state;
}

function reproduceIfReady(
  state: CivilizationSandboxState,
  civilization: SandboxCivilization
): CivilizationSandboxState {
  if (state.tick < 6 || state.tick % 2 !== 0) {
    return state;
  }

  const existingNames = Object.values(state.individualsById)
    .filter((individual) => individual.civilizationId === civilization.id)
    .map((individual) => individual.name);
  const nextName = generateSandboxChildName({
    raceId: civilization.raceId,
    birthIndex: civilization.birthCount,
    usedNames: existingNames,
  });
  const centerHex = getCivilizationCenterHex(state, civilization);
  const childId = `individual.${civilization.raceId}.child.${civilization.birthCount + 1}`;
  const child: SandboxIndividual = {
    id: childId,
    name: nextName,
    raceId: civilization.raceId,
    civilizationId: civilization.id,
    settlementId: civilization.settlementIds[0] ?? null,
    householdId: Object.values(state.householdsById).find(
      (household) => household.civilizationId === civilization.id
    )?.id ?? null,
    role: "child",
    age: 0,
    sex: civilization.birthCount % 2 === 0 ? "female" : "male",
    hex: centerHex,
    direction: "right-down",
    spriteVariantId: "commoner1",
    needs: {
      hunger: 0,
      stamina: 100,
    },
    traits: [],
    task: null,
  };

  return {
    ...state,
    individualsById: {
      ...state.individualsById,
      [childId]: child,
    },
    civilizationsById: {
      ...state.civilizationsById,
      [civilization.id]: {
        ...civilization,
        birthCount: civilization.birthCount + 1,
      },
    },
    recentEvents: [
      ...state.recentEvents,
      {
        tick: state.tick,
        message: `${nextName} was born.`,
      },
    ],
  };
}

function addStructure(
  state: CivilizationSandboxState,
  civilization: SandboxCivilization,
  input: {
    kind: SandboxStructure["kind"];
    hex: { x: number; y: number };
    event: string;
  }
): CivilizationSandboxState {
  const settlementId = civilization.settlementIds[0];
  if (settlementId == null) {
    return state;
  }

  const structureId = `structure.${civilization.id}.${input.kind}`;
  const structure: SandboxStructure = {
    id: structureId,
    kind: input.kind,
    civilizationId: civilization.id,
    settlementId,
    hex: input.hex,
    buildProgress: 1,
    workers: Object.values(state.individualsById)
      .filter((individual) => individual.civilizationId === civilization.id)
      .slice(0, 2)
      .map((individual) => individual.id),
  };
  const settlement = state.settlementsById[settlementId];

  return {
    ...state,
    structuresById: {
      ...state.structuresById,
      [structureId]: structure,
    },
    settlementsById:
      settlement == null
        ? state.settlementsById
        : {
            ...state.settlementsById,
            [settlementId]: {
              ...settlement,
              structureIds: [...settlement.structureIds, structureId],
              level: "village",
            },
          },
    recentEvents: [
      ...state.recentEvents,
      {
        tick: state.tick,
        message: `${civilization.id} ${input.event}.`,
      },
    ],
  };
}

function getCivilizationCenterHex(
  state: CivilizationSandboxState,
  civilization: SandboxCivilization
): { x: number; y: number } {
  const settlement = state.settlementsById[civilization.settlementIds[0] ?? ""];
  return settlement?.centerHex ?? { x: 0, y: 0 };
}
```

- [x] **Step 5: Run tests for Task 2**

Run:

```bash
npm run build:test
node --test --test-isolation=none tests/civilization-sandbox-domain.test.cjs
npm run typecheck
```

Expected:

- domain tests pass
- typecheck passes

- [x] **Step 6: Commit Task 2**

Run:

```bash
git add src/application/civilization-sandbox/placement.ts src/application/civilization-sandbox/simulation.ts tests/civilization-sandbox-domain.test.cjs
git commit -m "feat: add civilization sandbox simulation core"
```

## Task 3: Map Overlay Presenter And View Model Contract

**Files:**
- Create: `src/application/civilization-sandbox/map-overlay-presenter.ts`
- Modify: `src/ui/views/map/map-view.ts`
- Modify: `src/ui/app-render.ts`
- Create: `tests/civilization-sandbox-map-overlay.test.cjs`

**Interfaces:**
- Consumes: `CivilizationSandboxState`
- Produces: `createCivilizationSandboxMapOverlay(state: CivilizationSandboxState): CivilizationSandboxMapOverlay`
- Produces: `MapViewModel.civilizationSandboxOverlay`

- [x] **Step 1: Write failing overlay presenter and map source tests**

Create `tests/civilization-sandbox-map-overlay.test.cjs`:

```js
const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const { loadRepoModule } = require("./helpers/load-repo-module.cjs");

test("civilization sandbox overlay projects individuals structures farms and claimed hexes", () => {
  const { createInitialCivilizationSandboxState } = loadRepoModule(
    "./../src/domain/civilization-sandbox"
  );
  const { placeSandboxLord } = loadRepoModule(
    "./../src/application/civilization-sandbox/placement"
  );
  const { tickCivilizationSandbox } = loadRepoModule(
    "./../src/application/civilization-sandbox/simulation"
  );
  const { createCivilizationSandboxMapOverlay } = loadRepoModule(
    "./../src/application/civilization-sandbox/map-overlay-presenter"
  );

  let state = placeSandboxLord({
    state: createInitialCivilizationSandboxState(),
    raceId: "chen-yihan",
    hex: { x: 2, y: 2 },
  });
  state = tickCivilizationSandbox(tickCivilizationSandbox(state));

  const overlay = createCivilizationSandboxMapOverlay(state);

  assert.equal(overlay.enabled, true);
  assert.ok(overlay.individuals.length >= 4);
  assert.ok(overlay.structures.some((structure) => structure.kind === "rural-house"));
  assert.ok(overlay.structures.some((structure) => structure.kind === "farm"));
  assert.ok(overlay.claimedHexes.some((entry) => entry.colorToken === "sandbox-civilization-chen"));
});

test("map view model and app render expose civilization sandbox overlay without application HTML", () => {
  const mapViewSource = fs.readFileSync("src/ui/views/map/map-view.ts", "utf8");
  const appRenderSource = fs.readFileSync("src/ui/app-render.ts", "utf8");

  assert.match(mapViewSource, /civilizationSandboxOverlay/);
  assert.match(mapViewSource, /data-civilization-sandbox-overlay/);
  assert.match(appRenderSource, /createCivilizationSandboxMapOverlay/);
});
```

- [x] **Step 2: Run the failing overlay tests**

Run:

```bash
npm run build:test
node --test --test-isolation=none tests/civilization-sandbox-map-overlay.test.cjs
```

Expected:

- tests fail because `map-overlay-presenter` and map-view overlay fields do not exist

- [x] **Step 3: Implement overlay presenter**

Create `src/application/civilization-sandbox/map-overlay-presenter.ts`:

```ts
import type {
  CivilizationSandboxState,
  SandboxDirection,
  SandboxStructure,
} from "../../domain/civilization-sandbox";

export type CivilizationSandboxMapOverlay = {
  enabled: boolean;
  viewMode: "normal" | "territory";
  selectedEntityId: string | null;
  individuals: Array<{
    id: string;
    name: string;
    civilizationId: string;
    hex: { x: number; y: number };
    direction: SandboxDirection;
    spriteResourceId: string;
    role: string;
    taskLabel: string;
  }>;
  structures: Array<{
    id: string;
    kind: SandboxStructure["kind"];
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

export function createCivilizationSandboxMapOverlay(
  state: CivilizationSandboxState
): CivilizationSandboxMapOverlay {
  return {
    enabled: state.enabled,
    viewMode: state.viewMode,
    selectedEntityId: state.selectedEntityId,
    individuals: Object.values(state.individualsById).map((individual) => ({
      id: individual.id,
      name: individual.name,
      civilizationId: individual.civilizationId,
      hex: individual.hex,
      direction: individual.direction,
      spriteResourceId: `sandbox.walker.${individual.spriteVariantId}.${individual.direction}`,
      role: individual.role,
      taskLabel: individual.task?.type ?? "idle",
    })),
    structures: Object.values(state.structuresById).map((structure) => ({
      id: structure.id,
      kind: structure.kind,
      civilizationId: structure.civilizationId,
      hex: structure.hex,
      progress: structure.buildProgress,
    })),
    claimedHexes: Object.entries(state.claimedHexByKey).flatMap(
      ([hexKey, civilizationId]) => {
        const civilization = state.civilizationsById[civilizationId];
        if (civilization == null) {
          return [];
        }

        const [x, y] = hexKey.split(",").map(Number);
        if (!Number.isFinite(x) || !Number.isFinite(y)) {
          return [];
        }

        return [
          {
            hex: { x, y },
            civilizationId,
            colorToken: civilization.colorToken,
          },
        ];
      }
    ),
  };
}
```

- [x] **Step 4: Extend map view model types and inputs**

Modify `src/ui/views/map/map-view.ts`:

```ts
import type { CivilizationSandboxMapOverlay } from "../../../application/civilization-sandbox/map-overlay-presenter";
```

Add to `MapViewModel`:

```ts
civilizationSandboxOverlay: CivilizationSandboxMapOverlay | null;
```

Add to `createMapViewModel` input:

```ts
civilizationSandboxOverlay?: CivilizationSandboxMapOverlay | null;
```

Add to the returned model:

```ts
civilizationSandboxOverlay: input.civilizationSandboxOverlay ?? null,
```

- [x] **Step 5: Render data-driven sandbox overlay markup**

In `src/ui/views/map/map-view.ts`, add a helper before `renderCampaignMap`:

```ts
function renderCivilizationSandboxOverlay(
  overlay: CivilizationSandboxMapOverlay | null
): string {
  if (overlay == null || !overlay.enabled) {
    return "";
  }

  const source = JSON.stringify(overlay);

  return `
    <script type="application/json" data-civilization-sandbox-source="true">${escapeJsonForHtmlScript(source)}</script>
    <div
      class="c-civilization-sandbox-overlay"
      data-civilization-sandbox-overlay="true"
      data-civilization-sandbox-view-mode="${overlay.viewMode}"
    ></div>
  `;
}
```

Call it inside `renderCampaignMap` within `.c-campaign-map`, after the hover hex SVG:

```ts
${renderCivilizationSandboxOverlay(model.civilizationSandboxOverlay)}
```

- [x] **Step 6: Project overlay in app render**

Modify `src/ui/app-render.ts`:

```ts
import { createCivilizationSandboxMapOverlay } from "../application/civilization-sandbox/map-overlay-presenter";
```

Add to `mapViewModelInput` inside the map stage branch:

```ts
civilizationSandboxOverlay: createCivilizationSandboxMapOverlay(
  input.appState.gameState.runtime.civilizationSandbox
),
```

- [x] **Step 7: Run tests for Task 3**

Run:

```bash
npm run build:test
node --test --test-isolation=none tests/civilization-sandbox-map-overlay.test.cjs
npm run typecheck
```

Expected:

- overlay tests pass
- typecheck passes

- [x] **Step 8: Commit Task 3**

Run:

```bash
git add src/application/civilization-sandbox/map-overlay-presenter.ts src/ui/views/map/map-view.ts src/ui/app-render.ts tests/civilization-sandbox-map-overlay.test.cjs
git commit -m "feat: project civilization sandbox map overlay"
```

## Task 4: Validation UI Actions And Boundary Guard

**Files:**
- Create: `src/application/runtime/coordinators/civilization-sandbox-action-coordinator.ts`
- Modify: `src/ui/views/map/map-view.ts`
- Modify: `src/ui/app-render.ts`
- Modify: `tests/robustness.test.cjs`
- Modify: `tests/civilization-sandbox-map-overlay.test.cjs`

**Interfaces:**
- Consumes: `placeSandboxLord`, `tickCivilizationSandbox`, `createInitialCivilizationSandboxState`
- Produces: `handleCivilizationSandboxAction(input: CivilizationSandboxActionInput): CivilizationSandboxActionResult`
- Produces: map markup with `data-civilization-sandbox-action`

- [x] **Step 1: Add failing source guard tests**

Append this test to `tests/civilization-sandbox-map-overlay.test.cjs`:

```js
test("civilization sandbox action handling stays outside main shell", () => {
  const mainSource = fs.readFileSync("src/main.ts", "utf8");
  const mapViewSource = fs.readFileSync("src/ui/views/map/map-view.ts", "utf8");
  const coordinatorSource = fs.readFileSync(
    "src/application/runtime/coordinators/civilization-sandbox-action-coordinator.ts",
    "utf8"
  );

  assert.doesNotMatch(mainSource, /placeSandboxLord/);
  assert.doesNotMatch(mainSource, /tickCivilizationSandbox/);
  assert.match(mapViewSource, /data-civilization-sandbox-action/);
  assert.match(coordinatorSource, /handleCivilizationSandboxAction/);
});
```

Add a narrow guard to `tests/robustness.test.cjs`:

```js
test("civilization sandbox does not add concrete business logic to main shell", () => {
  const source = fs.readFileSync("src/main.ts", "utf8");

  assert.doesNotMatch(source, /placeSandboxLord/);
  assert.doesNotMatch(source, /tickCivilizationSandbox/);
  assert.doesNotMatch(source, /civilizationSandbox\.civilizationsById/);
});
```

- [x] **Step 2: Run the failing guard tests**

Run:

```bash
npm run build:test
node --test --test-isolation=none tests/civilization-sandbox-map-overlay.test.cjs
node --test --test-name-pattern "civilization sandbox" tests/robustness.test.cjs
```

Expected:

- map overlay test fails because the coordinator file and action markup do not exist
- robustness test passes if `src/main.ts` is still clean

- [x] **Step 3: Add the action coordinator**

Create `src/application/runtime/coordinators/civilization-sandbox-action-coordinator.ts`:

```ts
import {
  createInitialCivilizationSandboxState,
  type CivilizationSandboxState,
  type SandboxRaceId,
} from "../../../domain/civilization-sandbox";
import { placeSandboxLord } from "../../civilization-sandbox/placement";
import { tickCivilizationSandbox } from "../../civilization-sandbox/simulation";

export type CivilizationSandboxAction =
  | { type: "place-lord"; raceId: SandboxRaceId; hex: { x: number; y: number } }
  | { type: "tick" }
  | { type: "clear" }
  | { type: "toggle-territory-view" }
  | { type: "select"; entityId: string | null };

export type CivilizationSandboxActionInput = {
  state: CivilizationSandboxState;
  action: CivilizationSandboxAction;
};

export type CivilizationSandboxActionResult = {
  handled: boolean;
  state: CivilizationSandboxState;
};

export function handleCivilizationSandboxAction(
  input: CivilizationSandboxActionInput
): CivilizationSandboxActionResult {
  if (input.action.type === "place-lord") {
    return {
      handled: true,
      state: placeSandboxLord({
        state: input.state,
        raceId: input.action.raceId,
        hex: input.action.hex,
      }),
    };
  }

  if (input.action.type === "tick") {
    return {
      handled: true,
      state: tickCivilizationSandbox(input.state),
    };
  }

  if (input.action.type === "clear") {
    return {
      handled: true,
      state: createInitialCivilizationSandboxState(),
    };
  }

  if (input.action.type === "toggle-territory-view") {
    return {
      handled: true,
      state: {
        ...input.state,
        viewMode: input.state.viewMode === "territory" ? "normal" : "territory",
      },
    };
  }

  return {
    handled: true,
    state: {
      ...input.state,
      selectedEntityId: input.action.entityId,
    },
  };
}
```

- [x] **Step 4: Add validation controls to map view**

In `src/ui/views/map/map-view.ts`, add a helper:

```ts
function renderCivilizationSandboxControls(): string {
  return `
    <div class="c-civilization-sandbox-controls" aria-label="文明沙盒验证">
      <button type="button" data-civilization-sandbox-action="place-lord" data-sandbox-race-id="wu-tong">吴同</button>
      <button type="button" data-civilization-sandbox-action="place-lord" data-sandbox-race-id="yu-qingqing">于晴晴</button>
      <button type="button" data-civilization-sandbox-action="place-lord" data-sandbox-race-id="chen-yihan">陈倚晗</button>
      <button type="button" data-civilization-sandbox-action="tick">单步</button>
      <button type="button" data-civilization-sandbox-action="toggle-territory-view">领土</button>
      <button type="button" data-civilization-sandbox-action="clear">清空</button>
    </div>
  `;
}
```

Call it inside `renderCampaignMap`, near `.c-campaign-map-actions`:

```ts
${renderCivilizationSandboxControls()}
```

- [x] **Step 5: Wire coordinator through the existing application action layer**

Prefer adding the coordinator to the existing application action coordinator or transition layer already used by this branch. If that owner is unclear at execution time, create a small transition adapter under `src/application/runtime/coordinators/` and keep `src/main.ts` to generic event forwarding only.

The state update must be equivalent to:

```ts
const result = handleCivilizationSandboxAction({
  state: appState.gameState.runtime.civilizationSandbox,
  action,
});

if (result.handled) {
  appState = {
    ...appState,
    gameState: {
      ...appState.gameState,
      runtime: {
        ...appState.gameState.runtime,
        civilizationSandbox: result.state,
      },
    },
  };
}
```

Do not add branches in `src/main.ts` that call `placeSandboxLord` or `tickCivilizationSandbox`.

- [x] **Step 6: Run guard tests**

Run:

```bash
npm run build:test
node --test --test-isolation=none tests/civilization-sandbox-map-overlay.test.cjs
node --test --test-name-pattern "civilization sandbox" tests/robustness.test.cjs
npm run typecheck
```

Expected:

- overlay/action tests pass
- robustness guard passes
- typecheck passes

- [x] **Step 7: Commit Task 4**

Run:

```bash
git add src/application/runtime/coordinators/civilization-sandbox-action-coordinator.ts src/ui/views/map/map-view.ts src/ui/app-render.ts tests/robustness.test.cjs tests/civilization-sandbox-map-overlay.test.cjs
git commit -m "feat: add civilization sandbox validation controls"
```

## Task 5: Visual Overlay Rendering And Styles

**Files:**
- Create: `src/ui/views/map/civilization-sandbox-assets.ts`
- Modify: `src/ui/views/map/map-view.ts`
- Modify: `src/styles/views.css` or current map-specific style owner
- Modify: `tests/civilization-sandbox-map-overlay.test.cjs`

**Interfaces:**
- Consumes: `CivilizationSandboxMapOverlay`
- Produces: UI resource resolver `resolveCivilizationSandboxSpriteUrl(resourceId: string): string | null`
- Produces: rendered individual markers, rural-house markers, farm overlays, and territory overlays from view-model data

- [x] **Step 1: Add failing view/source tests for visual affordances**

Append to `tests/civilization-sandbox-map-overlay.test.cjs`:

```js
test("civilization sandbox view exposes individuals houses farms and territory visual hooks", () => {
  const mapViewSource = fs.readFileSync("src/ui/views/map/map-view.ts", "utf8");
  const styleSource = fs.existsSync("src/styles/views.css")
    ? fs.readFileSync("src/styles/views.css", "utf8")
    : "";

  assert.match(mapViewSource, /c-civilization-sandbox-individual/);
  assert.match(mapViewSource, /c-civilization-sandbox-structure--rural-house/);
  assert.match(mapViewSource, /c-civilization-sandbox-structure--farm/);
  assert.match(mapViewSource, /c-civilization-sandbox-territory/);
  assert.doesNotMatch(mapViewSource, /ui\/npc\/city-ambient-walkers/);
  assert.match(styleSource, /c-civilization-sandbox-overlay/);
  assert.doesNotMatch(styleSource, /#[0-9a-fA-F]{3,8}\b/);
  assert.doesNotMatch(styleSource, /z-index\s*:\s*\d+/);
});
```

- [x] **Step 2: Run the failing visual tests**

Run:

```bash
npm run build:test
node --test --test-isolation=none tests/civilization-sandbox-map-overlay.test.cjs
```

Expected:

- tests fail because visual hooks and styles are not implemented

- [x] **Step 3: Add UI asset resolver**

Create `src/ui/views/map/civilization-sandbox-assets.ts`:

```ts
import commoner1RightUpUrl from "../../../assets/npc/city-ambient-walkers/平民1右上.png";
import commoner1RightDownUrl from "../../../assets/npc/city-ambient-walkers/平民1右下.png";
import commoner1LeftUpUrl from "../../../assets/npc/city-ambient-walkers/平民1左上.png";
import commoner1LeftDownUrl from "../../../assets/npc/city-ambient-walkers/平民1左下.png";

const spriteUrlByResourceId: Record<string, string> = {
  "sandbox.walker.commoner1.right-up": commoner1RightUpUrl,
  "sandbox.walker.commoner1.right-down": commoner1RightDownUrl,
  "sandbox.walker.commoner1.left-up": commoner1LeftUpUrl,
  "sandbox.walker.commoner1.left-down": commoner1LeftDownUrl,
};

export function resolveCivilizationSandboxSpriteUrl(
  resourceId: string
): string | null {
  return spriteUrlByResourceId[resourceId] ?? null;
}
```

If the repo does not currently expose these PNGs under `src/assets`, copy or register them through the existing asset pipeline in a separate preparatory commit before this step. Keep the simulation/application layers referencing resource ids only.

- [x] **Step 4: Render overlay elements from JSON source**

Modify `renderCivilizationSandboxOverlay` in `src/ui/views/map/map-view.ts` so it emits server-rendered fallback elements:

```ts
const individualsMarkup = overlay.individuals
  .map((individual) => {
    const spriteUrl = resolveCivilizationSandboxSpriteUrl(individual.spriteResourceId);
    return `
      <button
        type="button"
        class="c-civilization-sandbox-individual"
        data-civilization-sandbox-action="select"
        data-sandbox-entity-id="${escapeHtml(individual.id)}"
        style="--sandbox-hex-x:${individual.hex.x}; --sandbox-hex-y:${individual.hex.y};"
        title="${escapeHtml(individual.name)} · ${escapeHtml(individual.taskLabel)}"
      >
        ${
          spriteUrl == null
            ? `<span class="c-civilization-sandbox-individual__fallback"></span>`
            : `<img src="${spriteUrl}" alt="" class="c-civilization-sandbox-individual__sprite">`
        }
      </button>
    `;
  })
  .join("");
```

Add equivalent maps for:

```ts
const structuresMarkup = overlay.structures.map(...).join("");
const territoryMarkup = overlay.claimedHexes.map(...).join("");
```

Use these classes:

- `c-civilization-sandbox-structure`
- `c-civilization-sandbox-structure--rural-house`
- `c-civilization-sandbox-structure--farm`
- `c-civilization-sandbox-territory`

- [x] **Step 5: Add token-based styles**

Modify `src/styles/views.css` or the current map-specific style file with token-based rules:

```css
.c-civilization-sandbox-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: var(--z-map-overlay);
}

.c-civilization-sandbox-individual {
  position: absolute;
  width: var(--space-8);
  height: var(--space-8);
  border: 0;
  background: transparent;
  pointer-events: auto;
}

.c-civilization-sandbox-individual__sprite {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.c-civilization-sandbox-structure {
  position: absolute;
  width: var(--space-7);
  height: var(--space-7);
  pointer-events: none;
}

.c-civilization-sandbox-structure--rural-house {
  background: var(--color-surface-raised);
  border: 1px solid var(--color-border-strong);
}

.c-civilization-sandbox-structure--farm {
  background: var(--color-map-farm);
  border: 1px solid var(--color-border-subtle);
}

.c-civilization-sandbox-territory {
  position: absolute;
  width: var(--space-8);
  height: var(--space-8);
  pointer-events: none;
  background: var(--sandbox-territory-color);
  opacity: 0.35;
}
```

If a referenced token such as `--z-map-overlay` or `--color-map-farm` does not exist, add it to the token file instead of hardcoding colors or z-index values in the view stylesheet.

- [x] **Step 6: Run visual/source tests**

Run:

```bash
npm run build:test
node --test --test-isolation=none tests/civilization-sandbox-map-overlay.test.cjs
npm run typecheck
```

Expected:

- visual/source tests pass
- typecheck passes

- [x] **Step 7: Commit Task 5**

Run:

```bash
git add src/ui/views/map/civilization-sandbox-assets.ts src/ui/views/map/map-view.ts src/styles/views.css tests/civilization-sandbox-map-overlay.test.cjs
git commit -m "feat: render civilization sandbox map visuals"
```

## Task 6: Final Verification And Manual Sandbox Check

**Files:**
- Modify: `docs/superpowers/plans/2026-08-07-worldbox-civilization-sandbox-plan.md`
- Modify: `docs/superpowers/project-progress.md` only if this plan has been promoted as the canonical current child

**Interfaces:**
- Consumes: all previous tasks
- Produces: verified first validation slice ready for review

- [x] **Step 1: Run targeted verification**

Run:

```bash
npm run build:test
node --test --test-isolation=none tests/civilization-sandbox-domain.test.cjs tests/civilization-sandbox-map-overlay.test.cjs
node --test --test-name-pattern "civilization sandbox" tests/robustness.test.cjs
```

Expected:

- all targeted sandbox tests pass

- [x] **Step 2: Run baseline verification**

Run:

```bash
npm run typecheck
npm run build
npm run lint:plans
git diff --check
```

Expected:

- all commands exit 0

- [ ] **Step 3: Run manual browser verification**

Run:

```bash
npm run dev:localhost
```

Open `http://localhost:5173/` and verify:

- placing `吴同` creates a red/aggressive civilization with visible individuals
- placing `于晴晴` creates a farming civilization that opens farm overlays
- placing `陈倚晗` creates a building/technology-oriented civilization
- visible individuals use four-direction walker art
- houses appear as rural-house structures
- farms appear as farm ground overlays
- territory view colors claimed hexes by selected civilization
- `src/main.ts` remains free of sandbox business calls

Result note: `The dev server is running on http://127.0.0.1:5174/. Codex in-app browser automation loaded the app and detected the validation controls, but final repeated click automation was blocked by stale DOM node and coordinate-translation limitations in the browser wrapper. Earlier browser smoke on 5174 verified the overlay controls before the final name-uniqueness fix; the late fix is covered by domain tests.`

- [x] **Step 4: Update plan progress**

Append a progress log entry:

```md
- 2026-08-07
  - Summary: `Completed the first Worldbox civilization sandbox validation slice.`
  - Verification: `npm run build:test`; `node --test --test-isolation=none tests/civilization-sandbox-domain.test.cjs tests/civilization-sandbox-map-overlay.test.cjs`; `node --test --test-name-pattern "civilization sandbox" tests/robustness.test.cjs`; `npm run typecheck`; `npm run build`; `npm run lint:plans`; `git diff --check`; manual browser verification at http://localhost:5173/.
  - Next: `Review final diff, then push if requested before marking the child closed.`
```

Update `Execution State`:

```md
- Status: `completed-but-open`
- Last Updated: `2026-08-07`
- Current Focus: `Implementation complete pending review and remote push.`
- Next Step: `Review final diff, push if requested, and complete structured closeout only after push succeeds.`
- Verification: `Record the exact commands and manual check from Task 6.`
- Notes: `Do not mark closed until project-progress sync and remote push are complete.`
```

- [x] **Step 5: Commit Task 6**

Run:

```bash
git add docs/superpowers/plans/2026-08-07-worldbox-civilization-sandbox-plan.md docs/superpowers/project-progress.md
git commit -m "docs: update civilization sandbox implementation progress"
```

If `docs/superpowers/project-progress.md` was not changed because this plan was not canonical, omit it from `git add` and record that in the final response.

## Exit Check

- [ ] Placing each of the three lords creates a visible civilization.
- [ ] Many individuals move on the existing campaign hex map.
- [x] Individuals use existing four-direction city ambient walker art.
- [x] The three race templates affect behavior and naming.
- [x] Houses visibly create rural-house structures.
- [x] Farms visibly create farm ground overlays.
- [x] Territory view colors claimed hexes by civilization after selecting an entity.
- [x] Sandbox state remains isolated from player stats, inventory, and source map data.
- [x] No sandbox business logic is added to `src/main.ts`.
- [ ] Project progress sync is updated if this child becomes canonical.
- [ ] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded
- [ ] Remote push completed before any `closed` status is written

## Child Closeout

- Closed Child: `Worldbox Civilization Sandbox`
- Parent Task: `Map Renderer Architecture`
- Parent Stage: `Map Renderer Architecture`
- Closeout Status: `not-closed`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `promote-or-execute-this-plan-after-current-canonical-child-is-resolved`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-08-07-worldbox-civilization-sandbox-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md; if the campaign-cloud completed-but-open child is resolved, promote this waiting plan before implementation.`
