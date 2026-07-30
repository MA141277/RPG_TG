# Temple Rest Review Auto Advance Status Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a read-only red nine-grid status window during temple `休至评定日` fast-forward so the player can see review progress and current temple state while auto-advance is running.

**Architecture:** The temple house module remains the owner of temple-specific state selection and status text. Shared auto-advance state in `AppState` carries an optional presentation payload, `main.ts` only preserves and refreshes that payload during snapshot playback, and the global render layer shows it through a reusable red temple modal renderer.

**Tech Stack:** TypeScript, Node test runner, `.test-dist` build via `tsconfig.test.json`, existing house view renderers and app-shell runtime state.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-31`
- Current Focus: `Merged into codex/merge-777-into-7-30main with shared snapshot-owned auto-advance status payload.`
- Next Step: `Run final merge verification, review the merged diff, then finish the merge commit.`
- Verification: `Pending final merge verification in codex/merge-777-into-7-30main.`
- Notes: `777 implementation was adjusted during merge so main.ts consumes shared status panel data and does not import concrete temple business modules.`

## Progress Log

- 2026-07-31
  - Summary: `Merged the temple rest review auto-advance status plan into codex/merge-777-into-7-30main and aligned the implementation with the repository house/main-shell contracts.`
  - Verification: `Pending final npm run typecheck, npm run lint:plans, npm test, and git diff --check after merge conflict resolution.`
  - Next: `Complete final verification and merge commit.`

## Global Constraints

- Do not add new temple business branches to `src/main.ts`; keep `main.ts` limited to shell-level auto-advance playback wiring.
- Reuse the existing temple red nine-grid modal visual language from `src/ui/views/house/temple-house-view.ts`.
- The panel is read-only: no confirm button, cancel button, close button, or interruption action.
- Only temple `休至评定日` gets the panel; `休息一日`, `指定天数`, `休至体力恢复`, non-temple houses, Huangcun opening, and ordination reentry behavior must remain unchanged.
- Use TDD: write the failing test first, run it to confirm the expected failure, then add the minimum code to pass.

---

## File Structure

- `src/application/app-shell.ts`
  - Extend `AppState["autoAdvanceState"]` with an optional shared status payload.
- `src/application/house-modules/temple-house/temple-rest-auto-advance-status.ts`
  - New temple-owned helper that builds the `休至评定日` fast-forward panel payload from `GameState` and player data.
- `src/application/house-modules/temple-house/temple-house-house-module.ts`
  - Attach the status payload only to the `TEMPLE_REST_UNTIL_COUNCIL_ACTION_ID` auto-advance side effect.
- `src/ui/views/house/temple-auto-advance-status-view.ts`
  - New reusable renderer for the read-only red nine-grid modal.
- `src/ui/app-render.ts`
  - Render the panel from `appState.autoAdvanceState.statusPanel` in the global overlay layer.
- `src/main.ts`
  - Preserve and refresh the status payload during snapshot playback without assembling temple text locally.
- `tests/temple-rest-auto-advance-status.test.cjs`
  - Behavior tests for the temple status payload builder and temple action wiring.
- `tests/temple-auto-advance-status-render.test.cjs`
  - Source/render tests for the read-only red modal and app render integration.
- `tests/main-auto-advance-status-refresh.test.cjs`
  - Source assertions for `main.ts` shell wiring and snapshot refresh behavior.

### Task 1: Define Shared Auto-Advance Status Contract And Temple Builder

**Files:**
- Create: `src/application/house-modules/temple-house/temple-rest-auto-advance-status.ts`
- Modify: `src/application/app-shell.ts`
- Test: `tests/temple-rest-auto-advance-status.test.cjs`

**Interfaces:**
- Consumes: `GameState`, `CharacterDefinition[]`, `CharacterId`, temple review helpers already available in `src/application/time/time-progression.ts` and temple module selectors.
- Produces:
  - `export type AutoAdvanceStatusPanel = { variant: "temple-review-rest"; title: string; lines: string[]; }`
  - `export function createTempleReviewRestAutoAdvanceStatus(input: { gameState: GameState; characterDefinitions: CharacterDefinition[]; playerCharacterId: string; textEntriesById?: Record<string, string> | undefined; }): AutoAdvanceStatusPanel`

- [ ] **Step 1: Write the failing test**

```js
const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createTempleReviewRestAutoAdvanceStatus,
} = require("../.test-dist/application/house-modules/temple-house/temple-rest-auto-advance-status.js");
const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  KEEP_HOUSE_VARIABLE_KEYS,
} = require("../.test-dist/domain/keep-house.js");

const playerCharacterId = "char.player";

function createTempleState() {
  return createInitialState({
    currentMapId: "map.test",
    currentCityId: "city.kulan",
    currentHouseId: "house.kulan.temple",
    playerCharacterId,
    chapterId: "chapter.zhu-yuanzhang-rise",
    year: 1352,
    month: 1,
    day: 1,
    pinnedCharacterId: playerCharacterId,
    reviewDateText: "",
    mainHouseMissionText: "扫地",
    currentView: "house",
  });
}

test("temple review rest status includes review text stamina and monk-stage lines", () => {
  const gameState = {
    ...createTempleState(),
    runtime: {
      ...createTempleState().runtime,
      variables: {
        ...createTempleState().runtime.variables,
        [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 3,
        "var.temple.contribution": 12,
        "var.temple.week": 2,
      },
    },
  };
  const characterDefinitions = [
    {
      id: playerCharacterId,
      name: "朱重八",
      cityId: "city.kulan",
      houseId: "house.kulan.temple",
      stamina: 61,
      title: "行童",
      occupation: "僧众",
      stats: { gold: 0, fame: 0 },
    },
  ];

  const status = createTempleReviewRestAutoAdvanceStatus({
    gameState,
    characterDefinitions,
    playerCharacterId,
  });

  assert.equal(status.variant, "temple-review-rest");
  assert.equal(status.title, "休至评定日");
  assert.ok(status.lines.includes("当前：寺中静修"));
  assert.ok(status.lines.includes("评定：距离评定 3 天"));
  assert.ok(status.lines.includes("体力：61 / 100"));
  assert.ok(status.lines.includes("贡献：12 / 30"));
  assert.ok(status.lines.includes("周次：第 2 周"));
  assert.ok(status.lines.includes("差事：扫地"));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run build:test`

Run: `node --test tests/temple-rest-auto-advance-status.test.cjs`

Expected: FAIL with `Cannot find module '../.test-dist/application/house-modules/temple-house/temple-rest-auto-advance-status.js'` or `createTempleReviewRestAutoAdvanceStatus is not a function`.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/application/app-shell.ts
export type AutoAdvanceStatusPanel = {
  variant: "temple-review-rest";
  title: string;
  lines: string[];
};

// inside AppState
autoAdvanceState:
  | {
      intervalId: string;
      label: string;
      targetHouseId: string;
      snapshots: MapAutoAdvanceSnapshot[] | null;
      completion: HouseMapAutoAdvanceCompletion | null;
      statusPanel?: AutoAdvanceStatusPanel | null;
    }
  | null;
```

```ts
// src/application/house-modules/temple-house/temple-rest-auto-advance-status.ts
import type { CharacterDefinition } from "../../../domain/character";
import type { GameState } from "../../../domain/game-state";
import type { AutoAdvanceStatusPanel } from "../../app-shell";
import { getCouncilStatusText } from "../../time/time-progression";

export function createTempleReviewRestAutoAdvanceStatus(input: {
  gameState: GameState;
  characterDefinitions: CharacterDefinition[];
  playerCharacterId: string;
  textEntriesById?: Record<string, string> | undefined;
}): AutoAdvanceStatusPanel {
  const playerCharacter =
    input.characterDefinitions.find(
      (characterDefinition) => characterDefinition.id === input.playerCharacterId
    ) ?? null;

  const lines = [
    "当前：寺中静修",
    `评定：${getCouncilStatusText(input.gameState)}`,
    `体力：${playerCharacter?.stamina ?? 0} / 100`,
  ];

  const contribution = input.gameState.runtime.variables["var.temple.contribution"];
  if (typeof contribution === "number") {
    lines.push(`贡献：${contribution} / 30`);
  }

  const week = input.gameState.runtime.variables["var.temple.week"];
  if (typeof week === "number") {
    lines.push(`周次：第 ${week} 周`);
  }

  if (input.gameState.ui.mainHouseMissionText.trim().length > 0) {
    lines.push(`差事：${input.gameState.ui.mainHouseMissionText}`);
  }

  return {
    variant: "temple-review-rest",
    title: "休至评定日",
    lines,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run build:test`

Run: `node --test tests/temple-rest-auto-advance-status.test.cjs`

Expected: PASS for the builder test.

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/specs/2026-07-31-temple-rest-review-auto-advance-status-design.md docs/superpowers/plans/2026-07-31-temple-rest-review-auto-advance-status.md src/application/app-shell.ts src/application/house-modules/temple-house/temple-rest-auto-advance-status.ts tests/temple-rest-auto-advance-status.test.cjs
git commit -m "feat: add temple rest auto advance status contract"
```

### Task 2: Attach Temple Review Rest Status Only To The Council-Rest Path

**Files:**
- Modify: `src/application/house-modules/temple-house/temple-house-house-module.ts`
- Test: `tests/temple-rest-auto-advance-status.test.cjs`

**Interfaces:**
- Consumes:
  - `createTempleReviewRestAutoAdvanceStatus(...) => AutoAdvanceStatusPanel`
  - existing `createTempleRestAutoAdvanceResult(...)`
- Produces:
  - `start-map-auto-advance` side effect objects with optional `statusPanel?: AutoAdvanceStatusPanel | null`
  - temple `TEMPLE_REST_UNTIL_COUNCIL_ACTION_ID` behavior that sets the status panel

- [ ] **Step 1: Extend the failing test with temple action assertions**

```js
const fs = require("node:fs");

test("temple review rest action carries auto advance status panel but other rest actions do not", () => {
  const source = fs.readFileSync(
    "src/application/house-modules/temple-house/temple-house-house-module.ts",
    "utf8"
  );

  assert.match(source, /createTempleReviewRestAutoAdvanceStatus/);
  assert.match(source, /actionId === TEMPLE_REST_UNTIL_COUNCIL_ACTION_ID[\s\S]*statusPanel/);
  assert.doesNotMatch(
    source,
    /actionId === TEMPLE_REST_ONE_DAY_ACTION_ID[\s\S]*statusPanel/
  );
  assert.doesNotMatch(
    source,
    /actionId === TEMPLE_REST_UNTIL_RECOVERED_ACTION_ID[\s\S]*statusPanel/
  );
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run build:test`

Run: `node --test tests/temple-rest-auto-advance-status.test.cjs`

Expected: FAIL on the new source assertion because `temple-house-house-module.ts` does not yet pass `statusPanel`.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/application/house-modules/temple-house/temple-house-house-module.ts
import { createTempleReviewRestAutoAdvanceStatus } from "./temple-rest-auto-advance-status";
```

```ts
function createTempleRestAutoAdvanceResult(
  input: HouseModuleDispatchInput<"temple-house">,
  sessionState: TempleHouseSessionState,
  summary: TempleRestSummary,
  title: string,
  currentState: GameState,
  statusPanel?: AutoAdvanceStatusPanel | null
): HouseModuleTransitionResult<"temple-house"> {
  return {
    gameState: currentState,
    characterDefinitions: input.characterDefinitions,
    sessionState,
    sideEffects: [
      {
        type: "start-map-auto-advance",
        intervalId: TEMPLE_REST_AUTO_ADVANCE_INTERVAL_ID,
        everyMs: HOUSE_MAP_AUTO_ADVANCE_DAY_INTERVAL_MS,
        targetHouseId: input.houseDefinition.id,
        label: title,
        snapshots: summary.snapshots,
        ...(statusPanel == null ? {} : { statusPanel }),
        completion: summary.interruptedByCouncilDate
          ? { type: "enter-house", houseId: input.houseDefinition.id }
          : {
              type: "restore-house-session",
              houseId: input.houseDefinition.id,
              houseSession: createTempleRestCompletionSession(
                sessionState,
                summary,
                title,
                input.playerCharacterId,
                input.textEntriesById
              ),
            },
      },
    ],
  };
}
```

```ts
// only in the TEMPLE_REST_UNTIL_COUNCIL_ACTION_ID branch
const statusPanel =
  actionId === TEMPLE_REST_UNTIL_COUNCIL_ACTION_ID
    ? createTempleReviewRestAutoAdvanceStatus({
        gameState: summary.state,
        characterDefinitions: summary.characterDefinitions,
        playerCharacterId: input.playerCharacterId,
        textEntriesById: input.textEntriesById,
      })
    : null;

return createTempleRestAutoAdvanceResult(
  input,
  sessionState,
  summary,
  actionId === TEMPLE_REST_ONE_DAY_ACTION_ID
    ? "休息一日"
    : actionId === TEMPLE_REST_UNTIL_COUNCIL_ACTION_ID
      ? "休至评定日"
      : "休至体力恢复",
  nextState,
  statusPanel
);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run build:test`

Run: `node --test tests/temple-rest-auto-advance-status.test.cjs`

Expected: PASS for both the builder test and the temple wiring source assertion.

- [ ] **Step 5: Commit**

```bash
git add src/application/house-modules/temple-house/temple-house-house-module.ts src/application/house-modules/temple-house/temple-rest-auto-advance-status.ts tests/temple-rest-auto-advance-status.test.cjs
git commit -m "feat: attach temple review rest auto advance status"
```

### Task 3: Render The Read-Only Red Nine-Grid Status Window

**Files:**
- Create: `src/ui/views/house/temple-auto-advance-status-view.ts`
- Modify: `src/ui/app-render.ts`
- Test: `tests/temple-auto-advance-status-render.test.cjs`

**Interfaces:**
- Consumes:
  - `AutoAdvanceStatusPanel`
  - temple popup class names and overlay attributes copied from the existing temple view style
- Produces:
  - `export function renderTempleAutoAdvanceStatusPanel(panel: AutoAdvanceStatusPanel): string`
  - global app render integration that includes the panel only when `appState.autoAdvanceState?.statusPanel` exists

- [ ] **Step 1: Write the failing render test**

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const {
  renderTempleAutoAdvanceStatusPanel,
} = require("../.test-dist/ui/views/house/temple-auto-advance-status-view.js");

test("temple auto advance status panel renders a read-only red modal", () => {
  const markup = renderTempleAutoAdvanceStatusPanel({
    variant: "temple-review-rest",
    title: "休至评定日",
    lines: ["当前：寺中静修", "评定：距离评定 2 天", "体力：70 / 100"],
  });

  assert.match(markup, /休至评定日/);
  assert.match(markup, /c-assessment-popup/);
  assert.match(markup, /c-house-temple-utility-popup/);
  assert.match(markup, /当前：寺中静修/);
  assert.doesNotMatch(markup, /data-house-action=/);
});

test("app render reads autoAdvanceState statusPanel from the global overlay layer", () => {
  const source = fs.readFileSync("src/ui/app-render.ts", "utf8");

  assert.match(source, /renderTempleAutoAdvanceStatusPanel/);
  assert.match(source, /autoAdvanceState\\?\\.statusPanel/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run build:test`

Run: `node --test tests/temple-auto-advance-status-render.test.cjs`

Expected: FAIL because the new renderer file does not exist and `app-render.ts` does not reference it.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/ui/views/house/temple-auto-advance-status-view.ts
import type { AutoAdvanceStatusPanel } from "../../../application/app-shell";

const templePopupOverlayAttribute =
  ' data-house-overlay-variant="temple-utility-popup"';
const templePopupModalClassName =
  " c-assessment-popup c-house-contribution-settlement c-house-temple-utility-popup";

export function renderTempleAutoAdvanceStatusPanel(
  panel: AutoAdvanceStatusPanel
): string {
  return `
    <div class="c-grain-shop-overlay" data-house-overlay="temple-auto-advance-status"${templePopupOverlayAttribute}>
      <div class="c-grain-shop-modal c-grain-shop-skin-panel c-temple-house-modal${templePopupModalClassName}" role="dialog" aria-modal="true">
        <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${panel.title}</h3>
        <div class="c-grain-shop-modal__body">
          ${panel.lines.map((line) => `<p>${line}</p>`).join("")}
        </div>
      </div>
    </div>
  `;
}
```

```ts
// src/ui/app-render.ts
import { renderTempleAutoAdvanceStatusPanel } from "./views/house/temple-auto-advance-status-view";

function renderAutoAdvanceStatusPanel(input: AppRenderInput): string {
  const panel = input.appState.autoAdvanceState?.statusPanel;
  if (panel == null) {
    return "";
  }

  return renderTempleAutoAdvanceStatusPanel(panel);
}
```

```ts
// inside renderApp(...) markup, near other global overlays
${renderAutoAdvanceStatusPanel(input)}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run build:test`

Run: `node --test tests/temple-auto-advance-status-render.test.cjs`

Expected: PASS for the modal renderer and app render source assertions.

- [ ] **Step 5: Commit**

```bash
git add src/ui/views/house/temple-auto-advance-status-view.ts src/ui/app-render.ts tests/temple-auto-advance-status-render.test.cjs
git commit -m "feat: render temple auto advance status panel"
```

### Task 4: Refresh Status Panel During Snapshot Playback And Verify Regressions

**Files:**
- Modify: `src/main.ts`
- Test: `tests/main-auto-advance-status-refresh.test.cjs`
- Test: `tests/temple-rest-auto-advance-status.test.cjs`
- Verify: `tests/story-scene-house-follow-up.test.cjs`
- Verify: `tests/temple-first-review-locks.test.cjs`
- Verify: `tests/location-access-runtime.test.cjs`

**Interfaces:**
- Consumes:
  - `AutoAdvanceStatusPanel`
  - `createTempleReviewRestAutoAdvanceStatus(...) => AutoAdvanceStatusPanel`
  - existing `startMapAutoAdvance(...)` and snapshot loop in `main.ts`
- Produces:
  - snapshot playback that preserves `statusPanel`
  - a refresh branch that rebuilds the temple panel from the latest snapshot state without putting temple string assembly into `main.ts`

- [ ] **Step 1: Write the failing main-wiring test**

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

test("main auto advance playback preserves and refreshes status panel without temple string assembly", () => {
  const source = fs.readFileSync("src/main.ts", "utf8");

  assert.match(source, /statusPanel/);
  assert.match(source, /autoAdvanceState:\\s*\\{[\\s\\S]*statusPanel/);
  assert.match(source, /createTempleReviewRestAutoAdvanceStatus/);
  assert.doesNotMatch(source, /当前：寺中静修/);
  assert.doesNotMatch(source, /贡献：/);
  assert.doesNotMatch(source, /周次：第/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run build:test`

Run: `node --test tests/main-auto-advance-status-refresh.test.cjs`

Expected: FAIL because `main.ts` does not yet preserve or refresh `statusPanel`.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/main.ts
import { createTempleReviewRestAutoAdvanceStatus } from "./application/house-modules/temple-house/temple-rest-auto-advance-status";
```

```ts
function refreshAutoAdvanceStatusPanel(
  autoAdvanceState: NonNullable<AppState["autoAdvanceState"]>,
  nextGameState: AppState["gameState"],
  nextCharacterDefinitions: AppState["characterDefinitions"]
): NonNullable<AppState["autoAdvanceState"]>["statusPanel"] {
  if (autoAdvanceState.statusPanel?.variant !== "temple-review-rest") {
    return autoAdvanceState.statusPanel ?? null;
  }

  return createTempleReviewRestAutoAdvanceStatus({
    gameState: nextGameState,
    characterDefinitions: nextCharacterDefinitions,
    playerCharacterId,
    textEntriesById,
  });
}
```

```ts
// startMapAutoAdvance input type and state storage
function startMapAutoAdvance(input: {
  intervalId: string;
  everyMs: number;
  targetHouseId: string;
  label: string;
  snapshots?: NonNullable<AppState["autoAdvanceState"]>["snapshots"];
  completion?: NonNullable<AppState["autoAdvanceState"]>["completion"];
  statusPanel?: NonNullable<AppState["autoAdvanceState"]>["statusPanel"];
}): void {
  // ...
  autoAdvanceState: {
    intervalId: input.intervalId,
    label: input.label,
    targetHouseId: input.targetHouseId,
    snapshots: input.snapshots ?? null,
    completion: input.completion ?? null,
    statusPanel: input.statusPanel ?? null,
  },
}
```

```ts
// inside snapshot playback branch
const refreshedStatusPanel = refreshAutoAdvanceStatusPanel(
  autoAdvanceState,
  nextSnapshot.gameState,
  nextSnapshot.characterDefinitions
);

appState = {
  ...appState,
  characterDefinitions: nextSnapshot.characterDefinitions,
  autoAdvanceState: {
    ...autoAdvanceState,
    snapshots: remainingSnapshots,
    statusPanel: refreshedStatusPanel,
  },
  gameState: {
    ...nextSnapshot.gameState,
    world: {
      ...nextSnapshot.gameState.world,
      currentHouseId: null,
    },
    ui: {
      ...nextSnapshot.gameState.ui,
      currentView: "map",
      overlayView: null,
      houseSession: null,
    },
  },
};
```

- [ ] **Step 4: Run focused tests to verify green**

Run: `npm run build:test`

Run: `node --test tests/temple-rest-auto-advance-status.test.cjs`

Expected: PASS

Run: `node --test tests/temple-auto-advance-status-render.test.cjs`

Expected: PASS

Run: `node --test tests/main-auto-advance-status-refresh.test.cjs`

Expected: PASS

Run: `node --test tests/story-scene-house-follow-up.test.cjs`

Expected: PASS

Run: `node --test tests/temple-first-review-locks.test.cjs`

Expected: PASS

Run: `node --test tests/location-access-runtime.test.cjs`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/main.ts tests/main-auto-advance-status-refresh.test.cjs tests/temple-rest-auto-advance-status.test.cjs tests/temple-auto-advance-status-render.test.cjs
git commit -m "feat: refresh temple auto advance status during playback"
```

## Self-Review

### Spec coverage

- Read-only status panel during temple `休至评定日`: Task 1 and Task 2.
- Shared auto-advance payload instead of temple-only overlay hack: Task 1.
- Red nine-grid modal UI reuse: Task 3.
- Snapshot-to-snapshot refresh during playback: Task 4.
- No stop button and no scope expansion to other rest modes: Task 2 tests and Task 4 regressions.
- No new temple string assembly in `main.ts`: Task 4 source assertion.
- No regressions to Huangcun opening or ordination reentry: Task 4 reruns existing regressions.

### Placeholder scan

- No `TODO`, `TBD`, or “implement later” placeholders remain.
- Each task names exact files, exact function names, exact commands, and expected outputs.

### Type consistency

- Shared payload name is `AutoAdvanceStatusPanel` in all tasks.
- Temple builder name is `createTempleReviewRestAutoAdvanceStatus` in all tasks.
- Shared property name is `statusPanel` in `AppState`, temple side effects, app render, and main playback refresh.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-31-temple-rest-review-auto-advance-status.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
