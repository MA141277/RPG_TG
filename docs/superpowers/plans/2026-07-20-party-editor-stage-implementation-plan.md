# Party Editor Stage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a new `party-editor` stage that opens only from the map, renders the requested first-pass UI, and makes battle and party-editor consume one shared formation-stage data entry point.

**Architecture:** The implementation keeps `party-editor` as a formal stage rather than an overlay. Shared formation display data is owned in `src/application/formation/**` and reused by both `src/ui/views/party/**` and `src/ui/views/battle/story-battle-view.ts`, while map entry and page exit flow through existing stage routing rather than direct `main.ts` business branches.

**Tech Stack:** TypeScript application/domain modules, render-only UI view modules under `src/ui/views/**`, Node `node:test` `.cjs` tests using `.test-dist` for compiled application/domain coverage, source-based UI tests, `npm run typecheck`, `npm test`, `npm run build`.

## Global Constraints

- `map-stage only entry button labeled 部队`
- `top resource bar with placeholder slots for 金钱, 食物, 马匹, and expandable future resources`
- `left-side team list showing one entry: 朱重八本队`
- `nine-slot team thumbnail driven from shared formation-stage data`
- `退出 as the only working button on the page`
- `one shared formation-stage data entry point consumed by both the party-editor stage and battle stage`
- `placeholder or demonstrative data wired through real application boundaries rather than hardcoded in the view`
- `This feature must not be implemented by dropping page-specific business branches into src/main.ts.`

## Execution State

- Status: `running`
- Last Updated: `2026-07-20`
- Current Focus: `Task 2: route party-editor as a formal stage.`
- Next Step: `Extend the compiled test with stage routing, then add the new view literal and presenter branch.`
- Verification: `Task 1 targeted verification passed: npm run build:test; node --test tests/party-editor-stage-state.test.cjs`
- Notes: `The targeted Node test required sandbox escalation because the test runner hit spawn EPERM inside the default sandbox.`

## Progress Log

- 2026-07-20
  - Summary: `Created the executable implementation plan for the party-editor stage and shared formation-stage seam.`
  - Verification: `npm run lint:plans`
  - Next: `Choose an execution mode and begin Task 1.`
- 2026-07-20
  - Summary: `Completed Task 1 by adding the shared formation-stage domain/application seam and the first compiled contract test.`
  - Verification: `npm run build:test && node --test tests/party-editor-stage-state.test.cjs`
  - Next: `Start Task 2 and route party-editor as a formal stage.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-20-party-editor-stage-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `The current branch still routes stages from src/application/presenter/stage-presenters.ts and renders them in src/ui/app-render.ts.`
  - `UI modules under src/ui/** are excluded from tsconfig.test.json, so application/domain logic should be covered with compiled .test-dist tests and UI markup should be guarded with source-based tests.`

## Implementation Scope

### In Scope

- Add a formal `party-editor` stage to app state and presenter output.
- Add one shared formation-stage seam in `src/application/formation/**`.
- Render the requested party-editor UI and map entry button.
- Make battle consume the same formation-stage input seam.
- Wire the only working page action to `退出`.
- Add targeted tests and include them in repository test execution.

### Still Out Of Scope

- Real team editing logic.
- Real resource persistence.
- Additional team tabs beyond the single visible `朱重八本队`.
- Drag/drop or live board simulation behavior.
- New map/city/house/battle command systems beyond the single stage enter/exit flow.

## File Map

### Existing files to modify

- `src/domain/game-state.ts`
  - Add the `party-editor` view literal.
- `src/application/app-actions.ts`
  - Add explicit open/close helpers for the new stage.
- `src/application/presenter/presenter-output.ts`
  - Add the `party-editor` stage output shape.
- `src/application/presenter/stage-presenters.ts`
  - Route `currentView === "party-editor"` to the new stage.
- `src/ui/app-render.ts`
  - Build the shared formation-stage view models and render the party-editor stage and battle preview from the same entry point.
- `src/ui/views/map/map-view.ts`
  - Render the map-only `部队` button.
- `src/ui/views/battle/story-battle-view.ts`
  - Accept and render battle-side formation preview data from the shared seam.
- `src/main.ts`
  - Wire `open-party-editor` and `close-party-editor` actions to the new app-action helpers.
- `src/styles/views.css`
  - Add `party-editor` and shared preview styles.
- `package.json`
  - Add the new targeted tests to the `npm test` command.

### New files to create

- `src/domain/party-editor.ts`
  - Party-editor-facing resource/team/command types.
- `src/application/formation/formation-stage.ts`
  - Shared formation-stage source and selectors.
- `src/application/formation/formation-stage-view-model.ts`
  - Party-editor and battle-facing read models built from the same source.
- `src/ui/views/party/formation-preview-grid.ts`
  - Shared render-only nine-slot preview helper.
- `src/ui/views/party/party-editor-view.ts`
  - Render-only stage view for the requested page layout.
- `tests/party-editor-stage-state.test.cjs`
  - Compiled application/domain contract test.
- `tests/party-editor-ui-source.test.cjs`
  - Source-based UI and action wiring test.

## Verification Plan

- Targeted verification:
  - `node --test tests/party-editor-stage-state.test.cjs tests/party-editor-ui-source.test.cjs`
- Required commands:
  - `npm run typecheck`
  - `npm test`
  - `npm run build`

### Task 1: Add The Shared Formation-Stage Domain And Application Seam

**Files:**
- Create: `src/domain/party-editor.ts`
- Create: `src/application/formation/formation-stage.ts`
- Create: `src/application/formation/formation-stage-view-model.ts`
- Create: `tests/party-editor-stage-state.test.cjs`

**Interfaces:**
- Consumes:
  - `BattleFormation`, `BattleFormationMember`, `BATTLE_FORMATION_SLOT_KEYS` from `src/domain/battle-formation.ts`
- Produces:
  - `type FormationStageState`
  - `function createDemoFormationStageState(): FormationStageState`
  - `function selectActiveFormationStageTeam(state: FormationStageState): FormationStageTeam`
  - `function createPartyEditorStageViewModel(state: FormationStageState): PartyEditorStageViewModel`
  - `function createBattleFormationPreviewViewModel(state: FormationStageState): BattleFormationPreviewViewModel`

- [x] **Step 1: Write the failing compiled contract test**

```js
const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createDemoFormationStageState,
} = require("../.test-dist/application/formation/formation-stage.js");
const {
  createPartyEditorStageViewModel,
  createBattleFormationPreviewViewModel,
} = require("../.test-dist/application/formation/formation-stage-view-model.js");

test("shared formation-stage seam exposes one selected team for both party-editor and battle consumers", () => {
  const state = createDemoFormationStageState();
  const partyEditorModel = createPartyEditorStageViewModel(state);
  const battlePreviewModel = createBattleFormationPreviewViewModel(state);

  assert.equal(partyEditorModel.teams.length, 1);
  assert.equal(partyEditorModel.teams[0].name, "朱重八本队");
  assert.equal(partyEditorModel.resources[0].label, "金钱");
  assert.equal(partyEditorModel.resources[1].label, "食物");
  assert.equal(partyEditorModel.resources[2].label, "马匹");
  assert.equal(partyEditorModel.teams[0].slots.length, 9);
  assert.equal(battlePreviewModel.teamName, "朱重八本队");
  assert.equal(battlePreviewModel.slots.length, 9);
  assert.deepEqual(
    partyEditorModel.teams[0].slots.map((slot) => slot.slotKey),
    battlePreviewModel.slots.map((slot) => slot.slotKey)
  );
});
```

- [x] **Step 2: Run the test to verify it fails**

Run: `npm run build:test && node --test tests/party-editor-stage-state.test.cjs`

Expected: `FAIL` with `Cannot find module '../.test-dist/application/formation/formation-stage.js'`.

- [x] **Step 3: Add the shared formation-stage source**

```ts
// src/application/formation/formation-stage.ts
import type { BattleFormation } from "../../domain/battle-formation";
import { BATTLE_FORMATION_SLOT_KEYS } from "../../domain/battle-formation";
import type {
  PartyEditorCommandItem,
  PartyEditorResourceSlot,
} from "../../domain/party-editor";

export type FormationStageTeam = {
  id: string;
  name: string;
  summary: string;
  formation: BattleFormation;
};

export type FormationStageState = {
  resources: PartyEditorResourceSlot[];
  commands: PartyEditorCommandItem[];
  teams: FormationStageTeam[];
  selectedTeamId: string;
};

const demoFormation: BattleFormation = {
  id: "formation.zhu-chongba.main",
  name: "朱重八本队",
  leaderCharacterId: "char.player",
  members: [
    {
      id: "member.front-center.infantry",
      unitDefinitionId: "unit.infantry.demo",
      name: "步卒队",
      role: "infantry",
      slotKey: "front-center",
    },
    {
      id: "member.rear-center.archer",
      unitDefinitionId: "unit.archer.demo",
      name: "弓手队",
      role: "archer",
      slotKey: "rear-center",
    },
  ],
};

export function createDemoFormationStageState(): FormationStageState {
  return {
    resources: [
      { id: "gold", label: "金钱", valueText: "1200", tone: "primary" },
      { id: "food", label: "食物", valueText: "800", tone: "primary" },
      { id: "horses", label: "马匹", valueText: "36", tone: "primary" },
      { id: "reserve", label: "预留", valueText: "--", tone: "muted" },
    ],
    commands: [
      { id: "disband", label: "解散队伍", isEnabled: false, actionId: null },
      { id: "create", label: "组建队伍", isEnabled: false, actionId: null },
      { id: "sort", label: "排序队伍", isEnabled: false, actionId: null },
      { id: "dismiss", label: "解雇单位", isEnabled: false, actionId: null },
      { id: "recruit", label: "招兵买马", isEnabled: false, actionId: null },
      { id: "exit", label: "退出", isEnabled: true, actionId: "close-party-editor" },
    ],
    teams: [
      {
        id: "team.zhu-chongba.main",
        name: "朱重八本队",
        summary: "本期仅展示界面，后续接入实时棋盘预览。",
        formation: demoFormation,
      },
    ],
    selectedTeamId: "team.zhu-chongba.main",
  };
}

export function selectActiveFormationStageTeam(
  state: FormationStageState
): FormationStageTeam {
  return (
    state.teams.find((team) => team.id === state.selectedTeamId) ??
    state.teams[0]
  );
}
```

- [x] **Step 4: Add the shared party-editor and battle read models**

```ts
// src/application/formation/formation-stage-view-model.ts
import {
  BATTLE_FORMATION_SLOT_KEYS,
  type BattleFormationMember,
  type BattleFormationSlotKey,
} from "../../domain/battle-formation";
import type { PartyEditorCommandItem, PartyEditorResourceSlot } from "../../domain/party-editor";
import {
  selectActiveFormationStageTeam,
  type FormationStageState,
  type FormationStageTeam,
} from "./formation-stage";

export type FormationPreviewSlotViewModel = {
  slotKey: BattleFormationSlotKey;
  label: string;
  role: BattleFormationMember["role"] | null;
  isOccupied: boolean;
};

export type PartyEditorStageViewModel = {
  title: string;
  resources: PartyEditorResourceSlot[];
  commands: PartyEditorCommandItem[];
  teams: {
    id: string;
    name: string;
    summary: string;
    slots: FormationPreviewSlotViewModel[];
  }[];
};

export type BattleFormationPreviewViewModel = {
  teamId: string;
  teamName: string;
  slots: FormationPreviewSlotViewModel[];
};

function createFormationPreviewSlots(team: FormationStageTeam): FormationPreviewSlotViewModel[] {
  return BATTLE_FORMATION_SLOT_KEYS.map((slotKey) => {
    const member =
      team.formation.members.find((entry) => entry.slotKey === slotKey) ?? null;

    return {
      slotKey,
      label: member?.name ?? "空位",
      role: member?.role ?? null,
      isOccupied: member != null,
    };
  });
}

export function createPartyEditorStageViewModel(
  state: FormationStageState
): PartyEditorStageViewModel {
  return {
    title: "队伍编辑",
    resources: state.resources,
    commands: state.commands,
    teams: state.teams.map((team) => ({
      id: team.id,
      name: team.name,
      summary: team.summary,
      slots: createFormationPreviewSlots(team),
    })),
  };
}

export function createBattleFormationPreviewViewModel(
  state: FormationStageState
): BattleFormationPreviewViewModel {
  const team = selectActiveFormationStageTeam(state);
  return {
    teamId: team.id,
    teamName: team.name,
    slots: createFormationPreviewSlots(team),
  };
}
```

- [x] **Step 5: Run the compiled test to verify it passes**

Run: `npm run build:test && node --test tests/party-editor-stage-state.test.cjs`

Expected: `PASS` with `1 test`.

- [ ] **Step 6: Commit the seam**

```bash
git add tests/party-editor-stage-state.test.cjs src/domain/party-editor.ts src/application/formation/formation-stage.ts src/application/formation/formation-stage-view-model.ts
git commit -m "feat: add shared formation stage seam"
```

### Task 2: Route Party Editor As A Formal Stage

**Files:**
- Modify: `src/domain/game-state.ts`
- Modify: `src/application/app-actions.ts`
- Modify: `src/application/presenter/presenter-output.ts`
- Modify: `src/application/presenter/stage-presenters.ts`
- Create: `tests/party-editor-stage-state.test.cjs`

**Interfaces:**
- Consumes:
  - `type FormationStageState`
  - `function createDemoFormationStageState(): FormationStageState`
- Produces:
  - `type ViewName = "map" | "city" | "city-3d" | "house" | "scene" | "battle" | "party-editor" | "minigame"`
  - `function openPartyEditor(appState: AppState): AppState`
  - `function closePartyEditor(appState: AppState): AppState`
  - `type AppPresenterStageOutput` includes the exact variant `| { type: "party-editor" }`

- [ ] **Step 1: Extend the compiled test to cover stage routing and view updates**

```js
const {
  createStagePresenterOutput,
} = require("../.test-dist/application/presenter/stage-presenters.js");
const {
  openPartyEditor,
  closePartyEditor,
} = require("../.test-dist/application/app-actions.js");
const {
  createPrototypeCharactersForStoryStage,
  prototypeCities,
  prototypeCityEntries,
  prototypeCityNpcPools,
  prototypeHouses,
} = require("../.test-dist/content/prototype-world.js");

test("party-editor opens as a real stage and exits back to map", () => {
  const baseState = createBaseState();
  const characterDefinitions =
    createPrototypeCharactersForStoryStage("zhu-yuanzhang", null);
  const openedState = openPartyEditor({
    gameState: { ...baseState, ui: { ...baseState.ui, currentView: "map" } },
  });
  assert.equal(openedState.gameState.ui.currentView, "party-editor");

  const stage = createStagePresenterOutput({
    appState: {
      gameState: openedState.gameState,
      characterDefinitions,
    },
    cityDefinition: prototypeCities[0],
    cityDefinitions: prototypeCities,
    houseDefinitions: prototypeHouses,
    cityEntries: prototypeCityEntries,
    cityNpcPoolDefinitions: prototypeCityNpcPools,
    playerCharacterId: "char.player",
  });
  assert.deepEqual(stage, { type: "party-editor" });

  const closedState = closePartyEditor(openedState);
  assert.equal(closedState.gameState.ui.currentView, "map");
});
```

- [ ] **Step 2: Run the compiled test to verify it fails**

Run: `npm run build:test && node --test tests/party-editor-stage-state.test.cjs`

Expected: `FAIL` with `openPartyEditor is not a function` or `stage` not equal to `{ type: "party-editor" }`.

- [ ] **Step 3: Add the new stage literal and action helpers**

```ts
// src/domain/game-state.ts
export type ViewName =
  | "map"
  | "city"
  | "city-3d"
  | "house"
  | "scene"
  | "battle"
  | "party-editor"
  | "minigame";

// src/application/app-actions.ts
export function openPartyEditor(appState: AppState): AppState {
  return {
    ...appState,
    gameState: {
      ...appState.gameState,
      ui: {
        ...appState.gameState.ui,
        overlayView: null,
        currentView: "party-editor",
      },
    },
  };
}

export function closePartyEditor(appState: AppState): AppState {
  return {
    ...appState,
    gameState: {
      ...appState.gameState,
      ui: {
        ...appState.gameState.ui,
        currentView: "map",
      },
    },
  };
}
```

- [ ] **Step 4: Route the new presenter stage**

```ts
// src/application/presenter/presenter-output.ts
export type AppPresenterStageOutput =
  | { type: "map"; cityDefinitions: CityDefinition[] }
  | { type: "party-editor" }
  | {
      type: "city";
      activeCityDefinition: CityDefinition;
      activeCityHouseDefinitions: HouseDefinition[];
      activeCityEntries: CityEntryDefinition[];
      citySceneMapping: CitySceneMapping | null;
    }
  | {
      type: "city-3d";
      activeCityDefinition: CityDefinition;
      citySceneMapping: CitySceneMapping | null;
    }
  | {
      type: "house";
      activeHouse: HouseDefinition;
      moduleViewModel: HouseModuleViewModel | null;
      cityNpcSummaries: HouseCityNpcSummary[];
    }
  | {
      type: "scene";
      currentSceneAction: ActionNode | null;
      currentSceneChoiceOptions: ChoiceOption[];
    }
  | { type: "battle" }
  | { type: "empty" };

// src/application/presenter/stage-presenters.ts
  if (currentView === "party-editor") {
    return { type: "party-editor" };
  }
```

- [ ] **Step 5: Run the compiled test to verify it passes**

Run: `npm run build:test && node --test tests/party-editor-stage-state.test.cjs`

Expected: `PASS` with both shared-seam and stage-routing assertions green.

- [ ] **Step 6: Commit the stage routing**

```bash
git add src/domain/game-state.ts src/application/app-actions.ts src/application/presenter/presenter-output.ts src/application/presenter/stage-presenters.ts tests/party-editor-stage-state.test.cjs
git commit -m "feat: route party editor as a stage"
```

### Task 3: Render The Party Editor UI And Map Entry

**Files:**
- Create: `src/ui/views/party/formation-preview-grid.ts`
- Create: `src/ui/views/party/party-editor-view.ts`
- Modify: `src/ui/views/map/map-view.ts`
- Modify: `src/ui/app-render.ts`
- Modify: `src/styles/views.css`
- Create: `tests/party-editor-ui-source.test.cjs`

**Interfaces:**
- Consumes:
  - `function createDemoFormationStageState(): FormationStageState`
  - `function createPartyEditorStageViewModel(state: FormationStageState): PartyEditorStageViewModel`
- Produces:
  - `function renderFormationPreviewGrid(slots: FormationPreviewSlotViewModel[], options?: { className?: string }): string`
  - `function renderPartyEditorView(model: PartyEditorStageViewModel): string`

- [ ] **Step 1: Write the source-based UI test**

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

test("map view renders a map-only party-editor entry button", () => {
  const source = fs.readFileSync("src/ui/views/map/map-view.ts", "utf8");
  assert.match(source, /data-action="open-party-editor"/);
  assert.match(source, /class="c-map-party-editor-entry"/);
  assert.match(source, />部队</);
});

test("party-editor view renders the requested layout and only exit is interactive", () => {
  const source = fs.readFileSync("src/ui/views/party/party-editor-view.ts", "utf8");
  assert.match(source, /队伍编辑/);
  assert.match(source, /朱重八本队/);
  assert.match(source, /解散队伍/);
  assert.match(source, /组建队伍/);
  assert.match(source, /排序队伍/);
  assert.match(source, /解雇单位/);
  assert.match(source, /招兵买马/);
  assert.match(source, /data-action="close-party-editor"/);
  assert.match(source, /button\.actionId == null \? "disabled" : ""/);
});
```

- [ ] **Step 2: Run the UI test to verify it fails**

Run: `node --test tests/party-editor-ui-source.test.cjs`

Expected: `FAIL` with `ENOENT` for `src/ui/views/party/party-editor-view.ts` or missing `open-party-editor` markup.

- [ ] **Step 3: Add the shared nine-slot renderer and the new stage view**

```ts
// src/ui/views/party/formation-preview-grid.ts
import type { FormationPreviewSlotViewModel } from "../../../application/formation/formation-stage-view-model";

export function renderFormationPreviewGrid(
  slots: FormationPreviewSlotViewModel[],
  options: { className?: string } = {}
): string {
  const className = options.className ?? "c-formation-preview-grid";
  return `
    <div class="${className}" aria-label="队伍九宫格预览">
      ${slots
        .map(
          (slot) => `
            <article class="c-formation-preview-grid__slot${slot.isOccupied ? " is-occupied" : ""}" data-slot-key="${slot.slotKey}">
              <span class="c-formation-preview-grid__slot-key">${slot.slotKey}</span>
              <strong class="c-formation-preview-grid__slot-label">${slot.label}</strong>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

// src/ui/views/party/party-editor-view.ts
import type { PartyEditorStageViewModel } from "../../../application/formation/formation-stage-view-model";
import { renderFormationPreviewGrid } from "./formation-preview-grid";

export function renderPartyEditorView(model: PartyEditorStageViewModel): string {
  return `
    <section class="view-party-editor" aria-label="${model.title}">
      <header class="c-party-editor__resource-bar">
        ${model.resources
          .map(
            (resource) => `
              <article class="c-party-editor__resource-slot c-party-editor__resource-slot--${resource.tone}">
                <span>${resource.label}</span>
                <strong>${resource.valueText}</strong>
              </article>
            `
          )
          .join("")}
      </header>
      <div class="c-party-editor__body">
        <aside class="c-party-editor__teams">
          ${model.teams
            .map(
              (team) => `
                <article class="c-party-editor__team-card">
                  <h2>${team.name}</h2>
                  <p>${team.summary}</p>
                  ${renderFormationPreviewGrid(team.slots)}
                </article>
              `
            )
            .join("")}
        </aside>
        <aside class="c-party-editor__commands">
          ${model.commands
            .map(
              (button) => `
                <button
                  type="button"
                  class="c-party-editor__command"
                  ${button.actionId == null ? "disabled" : ""}
                  ${button.actionId == null ? "" : `data-action="${button.actionId}"`}
                >
                  ${button.label}
                </button>
              `
            )
            .join("")}
        </aside>
      </div>
    </section>
  `;
}
```

- [ ] **Step 4: Add the map entry, app render integration, and page styles**

```ts
// src/ui/views/map/map-view.ts
function renderMapStageActions(): string {
  return `
    <div class="c-map-stage-actions">
      <button type="button" class="c-map-party-editor-entry" data-action="open-party-editor">部队</button>
    </div>
  `;
}

export function renderMapView(model: MapViewModel): string {
  if (model.mode === "campaign") {
    return `
      <section class="view-map view-map--campaign">
        ${renderCampaignMap(model)}
        ${renderMapStageActions()}
      </section>
    `;
  }
  return `
    <section class="view-map view-map--grid">
      ${renderMapStageActions()}
      <div class="c-stage-header">
        <div>
          <p class="c-stage-header__eyebrow">地图巡行</p>
          <h1 class="c-stage-header__title">${model.mapName}</h1>
        </div>
        <div class="c-map-legend">
          <span class="c-map-legend__item"><span class="c-player-token"></span> 玩家</span>
          <span class="c-map-legend__item"><span class="c-city-token">城市</span></span>
        </div>
      </div>
      ${renderGridMap(model)}
    </section>
  `;
}

// src/ui/app-render.ts
import { createDemoFormationStageState } from "../application/formation/formation-stage";
import {
  createBattleFormationPreviewViewModel,
  createPartyEditorStageViewModel,
} from "../application/formation/formation-stage-view-model";
import { renderPartyEditorView } from "./views/party/party-editor-view";

  if (stage.type === "party-editor") {
    const formationState = createDemoFormationStageState();
    return renderPartyEditorView(createPartyEditorStageViewModel(formationState));
  }
```

```css
/* src/styles/views.css */
.c-map-stage-actions {
  position: absolute;
  left: 32px;
  bottom: 28px;
  z-index: 4;
}

.c-map-party-editor-entry {
  min-width: 132px;
}

.view-party-editor {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 20px;
  padding: 32px;
}

.c-party-editor__body {
  display: grid;
  grid-template-columns: minmax(420px, 1fr) 280px;
  gap: 24px;
}

.c-formation-preview-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}
```

- [ ] **Step 5: Run the UI test to verify it passes**

Run: `node --test tests/party-editor-ui-source.test.cjs`

Expected: `PASS` with `2 tests`.

- [ ] **Step 6: Commit the UI slice**

```bash
git add src/ui/views/party/formation-preview-grid.ts src/ui/views/party/party-editor-view.ts src/ui/views/map/map-view.ts src/ui/app-render.ts src/styles/views.css tests/party-editor-ui-source.test.cjs
git commit -m "feat: render party editor stage ui"
```

### Task 4: Wire Actions In Main And Make Battle Consume The Shared Formation Seam

**Files:**
- Modify: `src/ui/views/battle/story-battle-view.ts`
- Modify: `src/ui/app-render.ts`
- Modify: `src/main.ts`
- Modify: `package.json`
- Modify: `tests/party-editor-stage-state.test.cjs`
- Modify: `tests/party-editor-ui-source.test.cjs`

**Interfaces:**
- Consumes:
  - `function openPartyEditor(appState: AppState): AppState`
  - `function closePartyEditor(appState: AppState): AppState`
  - `function createBattleFormationPreviewViewModel(state: FormationStageState): BattleFormationPreviewViewModel`
  - `function renderFormationPreviewGrid(slots: FormationPreviewSlotViewModel[], options?: { className?: string }): string`
- Produces:
  - `renderStoryBattleView(session: ActiveStoryBattleSession, options?: { formationPreview: BattleFormationPreviewViewModel | null }): string`
  - main-thread handlers for `open-party-editor` and `close-party-editor`

- [ ] **Step 1: Extend both tests with battle and action-wiring assertions**

```js
test("battle view consumes the shared formation preview entry point", () => {
  const source = fs.readFileSync("src/ui/app-render.ts", "utf8");
  assert.match(source, /createBattleFormationPreviewViewModel\(formationState\)/);
  assert.match(source, /renderStoryBattleView\(input\.appState\.gameState\.storyBattle,\s*\{\s*formationPreview:/);
});

test("main wires the map entry and exit actions", () => {
  const source = fs.readFileSync("src/main.ts", "utf8");
  assert.match(source, /\[data-action='open-party-editor'\]/);
  assert.match(source, /appState = openPartyEditor\(appState\);/);
  assert.match(source, /\[data-action='close-party-editor'\]/);
  assert.match(source, /appState = closePartyEditor\(appState\);/);
});
```

- [ ] **Step 2: Run both targeted tests to verify they fail**

Run: `npm run build:test && node --test tests/party-editor-stage-state.test.cjs tests/party-editor-ui-source.test.cjs`

Expected: `FAIL` because `renderStoryBattleView` does not yet receive formation preview input and `main.ts` does not yet handle the new actions.

- [ ] **Step 3: Thread the shared formation preview into battle and wire main actions**

```ts
// src/ui/views/battle/story-battle-view.ts
import type { BattleFormationPreviewViewModel } from "../../../application/formation/formation-stage-view-model";
import { renderFormationPreviewGrid } from "../party/formation-preview-grid";

export function renderStoryBattleView(
  session: ActiveStoryBattleSession,
  options: { formationPreview?: BattleFormationPreviewViewModel | null } = {}
): string {
  if (session == null) {
    return "";
  }

  const formationPreviewMarkup =
    options.formationPreview == null
      ? ""
      : `
        <section class="c-story-battle__formation-preview">
          <h2>${options.formationPreview.teamName}</h2>
          ${renderFormationPreviewGrid(options.formationPreview.slots, {
            className: "c-formation-preview-grid c-formation-preview-grid--battle",
          })}
        </section>
      `;

  return `
    <section class="view-story-battle" aria-label="${session.title}">
      <header class="c-story-battle__header">
        <p class="c-story-battle__eyebrow">剧情合战</p>
        <h1>${session.title}</h1>
        <p>${session.objective}</p>
      </header>
      <div class="c-story-battle__body">
        <aside class="c-story-battle__brief">
          <h2>战况</h2>
          ${session.summaryLines.map((line) => `<p>${line}</p>`).join("")}
          <div class="c-story-battle__control-note">
            玩家只控制朱重八本队；郭子兴、汤和、徐达等友军由 NPC 自动行动。
          </div>
          ${formationPreviewMarkup}
          ${renderBattleAction(session)}
        </aside>
        <div class="c-story-battle__field" aria-label="战场">
          ${session.units.map(renderUnit).join("")}
        </div>
        <aside class="c-story-battle__log">
          <h2>战斗进程</h2>
          ${session.logLines.map((line) => `<p>${line}</p>`).join("")}
        </aside>
      </div>
    </section>
  `;
}

// src/ui/app-render.ts
  if (stage.type === "battle") {
    const formationState = createDemoFormationStageState();
    return renderStoryBattleView(input.appState.gameState.storyBattle, {
      formationPreview: createBattleFormationPreviewViewModel(formationState),
    });
  }

// src/main.ts
import { closePartyEditor, openPartyEditor } from "./application/app-actions";

if (target.closest("[data-action='open-party-editor']")) {
  appState = openPartyEditor(appState);
  renderApp();
  return;
}

if (target.closest("[data-action='close-party-editor']")) {
  appState = closePartyEditor(appState);
  renderApp();
  return;
}
```

- [ ] **Step 4: Include the new tests in repository test execution**

```json
// package.json
{
  "scripts": {
    "test": "npm run build:test && node --test tests/robustness.test.cjs tests/hardcoded-scenario-pack-boundary.test.cjs tests/party-editor-stage-state.test.cjs tests/party-editor-ui-source.test.cjs"
  }
}
```

- [ ] **Step 5: Run full verification**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- `typecheck` exits `0`
- `npm test` reports the existing suites plus `party-editor-stage-state` and `party-editor-ui-source` as `PASS`
- `vite build` completes successfully

- [ ] **Step 6: Commit the battle integration and final wiring**

```bash
git add src/ui/views/battle/story-battle-view.ts src/ui/app-render.ts src/main.ts package.json tests/party-editor-stage-state.test.cjs tests/party-editor-ui-source.test.cjs
git commit -m "feat: wire party editor stage and battle preview"
```

## Exit Check

- [ ] `party-editor exists as a formal stage.`
- [ ] `map stage exposes the 部队 entry button and no other stage does.`
- [ ] `party-editor renders the required visual layout.`
- [ ] `退出 is the only working button on the page.`
- [ ] `party-editor and battle consume one shared formation-stage data entry point.`
- [ ] `placeholder data is owned by application/domain seams, not embedded inside render-only views.`
- [ ] `npm run typecheck`
- [ ] `npm test`
- [ ] `npm run build`

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded
