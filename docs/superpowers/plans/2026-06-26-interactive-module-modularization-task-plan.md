# Interactive Module Modularization Detailed Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current parallel minigame, activity, city-begging, and story-battle session paths with one shared interactive runtime that can host both `MinigameContract` and `InteractiveModuleContract` modules without breaking existing house, scene, or battle flows.

**Architecture:** Add a new shared domain contract in `src/domain/interactive-module.ts`, a registry/runtime pair under `src/application/interactive/`, and thin module wrappers that adapt existing gameplay logic into the new contract. Migrate in layers: seed the shared session slot first, then prove the runtime with `generic.qte`, then migrate standalone minigames, then city-begging, then tavern-owned loops, and finally wrap `story-battle` without collapsing battle-specific presentation or settlement into generic minigame assumptions.

**Tech Stack:** TypeScript, Vite, Node test runner via `tests/robustness.test.cjs`, shared game state, house-module runtime, story callback runtime

## Execution State

- Status: `not-started`
- Last Updated: `2026-06-26`
- Current Focus: `Plan only. No runtime files changed by this document.`
- Next Step: `Start at Task 1 Step 1 in a dedicated worktree if other Codex threads are editing shared runtime files.`
- Verification: `Not run`
- Notes: `This file is the execution companion to the design doc and the higher-level modularization plan.`

## Progress Log

- 2026-06-26
  - Summary: `Detailed execution task spec created from the approved interactive-module design.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Begin Task 1 in an isolated worktree.`

---

## Source Documents

- Design: `docs/superpowers/specs/2026-06-26-interactive-module-modularization-design.md`
- Roadmap: `docs/superpowers/plans/2026-06-26-interactive-module-modularization-plan.md`

## File Map

### Existing files to modify early

- `src/domain/game-state.ts`
  - Add the shared `interactiveSession` runtime slot without removing `storyBattle` or `activitySession`.
- `src/application/state/create-initial-state.ts`
  - Seed `runtime.interactiveSession` as `null`.
- `src/application/app-shell.ts`
  - Keep `beggingMiniGameState` during migration, but mark it as transitional in comments or follow-up cleanup tasks.
- `src/main.ts`
  - Replace direct dispatch branches over time with calls into the shared interactive runtime.
- `src/ui/app-render.ts`
  - Render shared interactive modules by presentation mode rather than ad hoc `battle` and begging checks only.
- `tests/robustness.test.cjs`
  - Add focused regression tests for the new runtime path after each migration phase.

### Existing files to modify during migration

- `src/application/activity/activity-runner.ts`
- `src/application/story/story-callbacks.ts`
- `src/application/story-battle/story-battle-runtime.ts`
- `src/application/minigames/city-begging-minigame.ts`
- `src/application/house-modules/grain-shop/grain-shop-house-module.ts`
- `src/application/house-modules/medicine-house/medicine-house-house-module.ts`
- `src/application/house-modules/tea-house/tea-house-house-module.ts`
- `src/application/house-modules/tavern/tavern-house-module.ts`
- `src/ui/views/scene/scene-view.ts`
- `src/ui/views/battle/story-battle-view.ts`
- `docs/change-log.md`

### New files to create

- `src/domain/interactive-module.ts`
  - Shared interactive ids, requests, result contract, presentation contract, and module contract types.
- `src/application/interactive/interactive-module-registry.ts`
  - Central registry for built-in interactive modules.
- `src/application/interactive/interactive-runtime.ts`
  - Start, dispatch, build-view, and settle helpers.
- `src/application/interactive/modules/generic-qte.ts`
- `src/application/interactive/modules/grain-accounting.ts`
- `src/application/interactive/modules/medicine-compounding.ts`
- `src/application/interactive/modules/tea-house-debate.ts`
- `src/application/interactive/modules/city-begging.ts`
- `src/application/interactive/modules/tavern-work-qte.ts`
- `src/application/interactive/modules/tavern-gamble.ts`
- `src/application/interactive/modules/story-battle.ts`
- `src/ui/views/interactive/interactive-stage-view.ts`
  - Shared render entry for overlay, full-screen, and embedded iframe modes.

## Task 1: Seed Shared Interactive Runtime Types and State Slot

**Files:**
- Create: `src/domain/interactive-module.ts`
- Modify: `src/domain/game-state.ts`
- Modify: `src/application/state/create-initial-state.ts`
- Test: `tests/robustness.test.cjs`

- [ ] **Step 1: Add a failing regression test for the new runtime slot**

Append a test shaped like:

```js
test("createInitialState seeds runtime.interactiveSession as null", () => {
  const state = createBaseState();
  assert.equal(state.runtime.interactiveSession, null);
});
```

- [ ] **Step 2: Run the focused test and confirm it fails before implementation**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "createInitialState seeds runtime.interactiveSession as null"
```

Expected:

- test fails because `interactiveSession` does not exist yet

- [ ] **Step 3: Add the shared contract file and seed the runtime slot**

Create `src/domain/interactive-module.ts` with the initial contract surface:

```ts
import type { CharacterDefinition } from "./character";
import type { Effect } from "./event";
import type { GameState, ViewName } from "./game-state";

export type InteractiveCategory = "minigame" | "battle";

export type InteractiveModuleId =
  | "generic-qte"
  | "grain-accounting"
  | "medicine-compounding"
  | "tea-house-debate"
  | "city-begging"
  | "tavern-work-qte"
  | "tavern-gamble"
  | "story-battle";

export type InteractiveRequest =
  | { type: "action"; actionId: string }
  | { type: "field"; fieldId: string; value: string }
  | { type: "tick"; tickId: string }
  | { type: "external"; eventId: string; payload?: Record<string, unknown> };

export type InteractiveOrigin = {
  source: "scene-action" | "house-action" | "city-action" | "story-callback";
  cityId?: string;
  houseId?: string;
  eventId?: string;
  sceneId?: string;
};

export type InteractiveCompletionPlan = {
  returnView: ViewName;
  enterHouseId?: string | null;
  mainMissionText?: string;
  reviewDateText?: string;
};

export type InteractivePresentation =
  | { mode: "overlay" }
  | { mode: "full-screen" }
  | { mode: "embedded-iframe"; src: string };

export type InteractiveResult = {
  moduleId: InteractiveModuleId;
  category: InteractiveCategory;
  outcome: "victory" | "defeat" | "success" | "failure" | "partial";
  score?: number;
  grade?: string;
  summaryLines?: string[];
  effects?: Effect[];
  flags?: Record<string, boolean>;
  variables?: Record<string, string | number>;
  navigation?: {
    returnView?: ViewName;
    enterHouseId?: string | null;
  };
};

export type ActiveInteractiveSession = {
  moduleId: InteractiveModuleId;
  category: InteractiveCategory;
  config: unknown;
  state: unknown;
  origin: InteractiveOrigin;
  completion: InteractiveCompletionPlan;
} | null;

export type InteractiveModuleContract<Config, SessionState, ViewModel> = {
  id: InteractiveModuleId;
  category: InteractiveCategory;
  createSession(input: {
    gameState: GameState;
    characterDefinitions: CharacterDefinition[];
    config: Config;
    origin: InteractiveOrigin;
    completion: InteractiveCompletionPlan;
  }): SessionState;
  dispatch(input: {
    gameState: GameState;
    characterDefinitions: CharacterDefinition[];
    config: Config;
    sessionState: SessionState;
    request: InteractiveRequest;
  }): {
    gameState: GameState;
    characterDefinitions: CharacterDefinition[];
    sessionState: SessionState;
    result?: InteractiveResult | null;
  };
  buildViewModel(input: {
    gameState: GameState;
    characterDefinitions: CharacterDefinition[];
    config: Config;
    sessionState: SessionState;
  }): {
    presentation: InteractivePresentation;
    model: ViewModel;
  };
  resolveResult?(input: {
    gameState: GameState;
    characterDefinitions: CharacterDefinition[];
    config: Config;
    sessionState: SessionState;
  }): InteractiveResult | null;
};
```

Update `GameState` and `createInitialState`:

```ts
import type { ActiveInteractiveSession } from "./interactive-module";

runtime: {
  flags: Record<string, boolean>;
  variables: Record<string, number | string>;
  cityNpcPools: Record<CityId, CityNpcPoolRuntimeState>;
  cityMarkets: Record<CityId, CityMarketData>;
  interactiveSession: ActiveInteractiveSession;
  activitySession: ActiveActivitySession;
  eventHistory: Record<...>;
};
```

```ts
runtime: {
  flags: {},
  variables: {},
  cityNpcPools: {},
  cityMarkets: {},
  interactiveSession: null,
  activitySession: null,
  eventHistory: {},
},
```

- [ ] **Step 4: Run verification and confirm the new slot is stable**

Run:

```bash
npm run typecheck
npm test
```

Expected:

- TypeScript passes
- the new regression test passes
- no existing tests fail because `storyBattle` and `activitySession` are still intact

- [ ] **Step 5: Commit**

```bash
git add src/domain/interactive-module.ts src/domain/game-state.ts src/application/state/create-initial-state.ts tests/robustness.test.cjs
git commit -m "feat: add shared interactive module contract"
```

## Task 2: Add Registry and Runtime Helpers With Result Settlement

**Files:**
- Create: `src/application/interactive/interactive-module-registry.ts`
- Create: `src/application/interactive/interactive-runtime.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Add a failing runtime test using a fake interactive module**

Append a test shaped like:

```js
test("interactive runtime starts, dispatches, and settles a registered module", async () => {
  const {
    startInteractiveSession,
    dispatchInteractiveSessionRequest,
  } = require("../.test-dist/application/interactive/interactive-runtime.js");

  const state = createBaseState();
  const context = {
    modulesById: {
      "generic-qte": {
        id: "generic-qte",
        category: "minigame",
        createSession: () => ({ step: 0 }),
        dispatch: ({ request, gameState, characterDefinitions }) => ({
          gameState,
          characterDefinitions,
          sessionState: { step: 1 },
          result: request.type === "action"
            ? { moduleId: "generic-qte", category: "minigame", outcome: "success" }
            : null,
        }),
        buildViewModel: () => ({
          presentation: { mode: "overlay" },
          model: { title: "test" },
        }),
      },
    },
  };

  const started = startInteractiveSession({
    state,
    characterDefinitions: prototypeCharacters,
    moduleId: "generic-qte",
    config: {},
    origin: { source: "scene-action" },
    completion: { returnView: "scene" },
    context,
  });

  assert.equal(started.state.runtime.interactiveSession?.moduleId, "generic-qte");

  const dispatched = dispatchInteractiveSessionRequest({
    state: started.state,
    characterDefinitions: started.characterDefinitions,
    request: { type: "action", actionId: "confirm" },
    context,
  });

  assert.equal(dispatched.state.runtime.interactiveSession, null);
  assert.equal(dispatched.result?.outcome, "success");
});
```

- [ ] **Step 2: Run the focused runtime test and confirm it fails**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "interactive runtime starts, dispatches, and settles a registered module"
```

Expected:

- test fails because the runtime helpers do not exist yet

- [ ] **Step 3: Implement the registry and runtime with a stable API**

Create `interactive-module-registry.ts`:

```ts
import type { InteractiveModuleContract, InteractiveModuleId } from "../../domain/interactive-module";

export type InteractiveModuleRegistry = {
  modulesById: Partial<Record<InteractiveModuleId, InteractiveModuleContract<any, any, any>>>;
};

export function getInteractiveModule(
  registry: InteractiveModuleRegistry,
  moduleId: InteractiveModuleId
): InteractiveModuleContract<any, any, any> {
  const moduleDefinition = registry.modulesById[moduleId];
  if (moduleDefinition == null) {
    throw new Error(`Missing interactive module: ${moduleId}`);
  }
  return moduleDefinition;
}
```

Create `interactive-runtime.ts` with these public functions:

```ts
export function startInteractiveSession(input: {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  moduleId: InteractiveModuleId;
  config: unknown;
  origin: InteractiveOrigin;
  completion: InteractiveCompletionPlan;
  context: InteractiveModuleRegistry;
}): { state: GameState; characterDefinitions: CharacterDefinition[] };

export function dispatchInteractiveSessionRequest(input: {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  request: InteractiveRequest;
  context: InteractiveModuleRegistry;
}): {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  result: InteractiveResult | null;
};

export function buildActiveInteractiveRenderModel(input: {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  context: InteractiveModuleRegistry;
}): {
  moduleId: InteractiveModuleId;
  category: InteractiveCategory;
  presentation: InteractivePresentation;
  model: unknown;
} | null;
```

The settlement rule in `dispatchInteractiveSessionRequest` must:

```ts
if (result != null) {
  nextState = {
    ...nextState,
    runtime: {
      ...nextState.runtime,
      interactiveSession: null,
      flags: { ...nextState.runtime.flags, ...result.flags },
      variables: { ...nextState.runtime.variables, ...result.variables },
    },
  };
}
```

- [ ] **Step 4: Run full verification before any module migration**

Run:

```bash
npm run typecheck
npm test
```

Expected:

- shared runtime tests pass
- no caller code changes yet
- `interactiveSession` still remains unused by production paths

- [ ] **Step 5: Commit**

```bash
git add src/application/interactive/interactive-module-registry.ts src/application/interactive/interactive-runtime.ts tests/robustness.test.cjs
git commit -m "feat: add interactive module registry and runtime"
```

## Task 3: Prove the Runtime With `generic-qte` Before House Minigames

**Files:**
- Create: `src/application/interactive/modules/generic-qte.ts`
- Modify: `src/application/activity/activity-runner.ts`
- Modify: `src/ui/views/scene/scene-view.ts`
- Modify: `src/ui/app-render.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Add a failing test that scene-started activities populate `interactiveSession`**

Add or update the existing activity test so it asserts both:

```js
assert.equal(result.state.runtime.activitySession?.type, "qte-bar");
assert.equal(result.state.runtime.interactiveSession?.moduleId, "generic-qte");
```

- [ ] **Step 2: Run the activity test and confirm the new assertion fails**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "scene start-activity action executes registered fallback activity"
```

Expected:

- test fails on the new `interactiveSession` assertion

- [ ] **Step 3: Wrap the existing activity QTE state in a shared interactive module**

Create `src/application/interactive/modules/generic-qte.ts`:

```ts
import type { InteractiveModuleContract } from "../../../domain/interactive-module";
import type { ActivityDefinition } from "../../../domain/activity";
import {
  createActivityQteSession,
  stopActivityQte,
  advanceActivityQteMarker,
} from "../../activity/activity-qte-runtime";

export const genericQteInteractiveModule: InteractiveModuleContract<
  { activityDefinition: ActivityDefinition; handlerId: string },
  ReturnType<typeof createActivityQteSession>,
  ReturnType<typeof createActivityQteSession>
> = {
  id: "generic-qte",
  category: "minigame",
  createSession({ config }) {
    return createActivityQteSession(config.activityDefinition, config.handlerId);
  },
  dispatch({ gameState, characterDefinitions, config, sessionState, request }) {
    if (request.type === "tick") {
      return {
        gameState,
        characterDefinitions,
        sessionState: advanceActivityQteMarker(sessionState),
      };
    }

    if (request.type === "action" && request.actionId === "stop") {
      const settled = stopActivityQte(
        {
          ...gameState,
          runtime: { ...gameState.runtime, activitySession: sessionState },
        },
        config.activityDefinition,
        characterDefinitions
      );
      return {
        gameState: settled.state,
        characterDefinitions: settled.characterDefinitions,
        sessionState: settled.state.runtime.activitySession,
        result:
          settled.state.runtime.activitySession?.type === "result"
            ? {
                moduleId: "generic-qte",
                category: "minigame",
                outcome: "success",
                score: settled.state.runtime.activitySession.score,
                grade: settled.state.runtime.activitySession.grade,
                summaryLines: settled.state.runtime.activitySession.rewardLines,
              }
            : null,
      };
    }

    return { gameState, characterDefinitions, sessionState };
  },
  buildViewModel({ sessionState }) {
    return {
      presentation: { mode: "overlay" },
      model: sessionState,
    };
  },
};
```

Update `runActivity` so starting the activity writes both the legacy slot and the new shared slot during transition:

```ts
runtime: {
  ...state.runtime,
  interactiveSession: {
    moduleId: "generic-qte",
    category: "minigame",
    config: { activityDefinition, handlerId },
    state: createActivityQteSession(activityDefinition, handlerId),
    origin: { source: "scene-action" },
    completion: { returnView: "scene" },
  },
  activitySession: createActivityQteSession(activityDefinition, handlerId),
},
```

- [ ] **Step 4: Make the scene render path accept the shared session**

Add a temporary render bridge:

```ts
const activeInteractive =
  input.appState.gameState.runtime.interactiveSession?.moduleId === "generic-qte"
    ? input.appState.gameState.runtime.interactiveSession.state
    : input.appState.gameState.runtime.activitySession;
```

Feed `activeInteractive` into the scene view until later tasks remove the compatibility bridge.

- [ ] **Step 5: Run verification**

Run:

```bash
npm run typecheck
npm test
```

Expected:

- scene activity tests pass
- activity UI still renders
- no house module behavior changes yet

- [ ] **Step 6: Commit**

```bash
git add src/application/interactive/modules/generic-qte.ts src/application/activity/activity-runner.ts src/ui/views/scene/scene-view.ts src/ui/app-render.ts tests/robustness.test.cjs
git commit -m "refactor: route generic qte through interactive runtime"
```

## Task 4: Migrate Standalone House Minigames With the Lowest Coupling First

**Files:**
- Create: `src/application/interactive/modules/grain-accounting.ts`
- Create: `src/application/interactive/modules/medicine-compounding.ts`
- Create: `src/application/interactive/modules/tea-house-debate.ts`
- Modify: `src/application/house-modules/grain-shop/grain-shop-house-module.ts`
- Modify: `src/application/house-modules/medicine-house/medicine-house-house-module.ts`
- Modify: `src/application/house-modules/tea-house/tea-house-house-module.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Add one failing regression assertion per migrated house module**

Use the existing house tests and add assertions shaped like:

```js
assert.equal(startResult.gameState.runtime.interactiveSession?.moduleId, "grain-accounting");
assert.equal(confirmedStart.gameState.runtime.interactiveSession?.moduleId, "medicine-compounding");
assert.equal(startDebateResult.gameState.runtime.interactiveSession?.moduleId, "tea-house-debate");
```

- [ ] **Step 2: Run the focused house tests and confirm the new assertions fail**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "grain|medicine|tea house"
```

Expected:

- at least the new `interactiveSession` assertions fail

- [ ] **Step 3: Build thin adapters around the existing pure minigame logic**

Use wrapper modules that keep current grading helpers unchanged:

```ts
import { generateLedgerQuestion, getAccountingGradeReward, isLedgerAnswerCorrect, resolveAccountingGrade } from "../../grain-shop/accounting-minigame";
import type { InteractiveModuleContract } from "../../../domain/interactive-module";

export const grainAccountingInteractiveModule: InteractiveModuleContract<
  { rewardTable: Record<string, unknown> },
  GrainAccountingSessionState,
  GrainAccountingSessionState
> = {
  id: "grain-accounting",
  category: "minigame",
  createSession() {
    return createInitialGrainAccountingSession();
  },
  dispatch(input) {
    return reduceGrainAccountingSession(input);
  },
  buildViewModel({ sessionState }) {
    return {
      presentation: { mode: "overlay" },
      model: sessionState,
    };
  },
};
```

Apply the same pattern to:

```ts
export const medicineCompoundingInteractiveModule = ...;
export const teaHouseDebateInteractiveModule = ...;
```

- [ ] **Step 4: Change the house modules from gameplay owners to launch adapters**

Replace direct overlay session initialization with shared runtime launches:

```ts
const started = startInteractiveSession({
  state: gameState,
  characterDefinitions,
  moduleId: "medicine-compounding",
  config: {
    medicineSkill: player.stats.medicine ?? 0,
  },
  origin: {
    source: "house-action",
    cityId: houseDefinition.cityId,
    houseId: houseDefinition.id,
  },
  completion: {
    returnView: "house",
    enterHouseId: houseDefinition.id,
  },
  context: interactiveRegistry,
});
```

The house session should keep only the launch gating and the close-result action.

- [ ] **Step 5: Run full verification**

Run:

```bash
npm run typecheck
npm test
```

Expected:

- accounting, compounding, and debate tests pass
- house modules still gate on stamina and entry conditions
- result settlement still updates the same runtime flags and rewards

- [ ] **Step 6: Commit**

```bash
git add src/application/interactive/modules/grain-accounting.ts src/application/interactive/modules/medicine-compounding.ts src/application/interactive/modules/tea-house-debate.ts src/application/house-modules/grain-shop/grain-shop-house-module.ts src/application/house-modules/medicine-house/medicine-house-house-module.ts src/application/house-modules/tea-house/tea-house-house-module.ts tests/robustness.test.cjs
git commit -m "refactor: migrate standalone house minigames to interactive runtime"
```

## Task 5: Migrate City Begging Without Losing Its Dedicated Overlay Loop

**Files:**
- Create: `src/application/interactive/modules/city-begging.ts`
- Modify: `src/application/minigames/city-begging-minigame.ts`
- Modify: `src/application/app-shell.ts`
- Modify: `src/main.ts`
- Modify: `src/ui/app-render.ts`
- Modify: `src/ui/views/minigames/city-begging-minigame-view.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Add a failing regression test for city begging shared-session launch**

Add a focused test shaped like:

```js
test("city begging launch mirrors into interactiveSession before legacy app-state cleanup", () => {
  const now = Date.now();
  const state = createBaseState();
  const session = createCityBeggingMiniGameState(now);
  assert.equal(session.variantState.status, "playing");
});
```

Then, after wiring the launch path through production code, assert:

```js
assert.equal(nextState.runtime.interactiveSession?.moduleId, "city-begging");
```

- [ ] **Step 2: Run the focused city-begging test and confirm it fails**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "city begging launch mirrors into interactiveSession before legacy app-state cleanup"
```

Expected:

- test fails because begging is still app-state only

- [ ] **Step 3: Wrap city-begging as a shared module but keep the old app-state slot as a mirror**

Create a wrapper:

```ts
export const cityBeggingInteractiveModule: InteractiveModuleContract<
  { startedAt: number; variantId?: "village-catching" | "granary-escort" },
  CityBeggingMiniGameState,
  CityBeggingMiniGameState
> = {
  id: "city-begging",
  category: "minigame",
  createSession({ config }) {
    return createCityBeggingMiniGameState(
      config.startedAt,
      config.variantId
    );
  },
  dispatch({ gameState, characterDefinitions, sessionState, request }) {
    if (request.type === "field" && request.fieldId === "pointer-x") {
      return {
        gameState,
        characterDefinitions,
        sessionState: setCityBeggingMiniGamePointer(
          sessionState,
          Number(request.value)
        ),
      };
    }

    if (request.type === "tick") {
      const nextSession = updateCityBeggingMiniGameState(
        sessionState,
        Number(request.tickId)
      );
      const completion = getCityBeggingMiniGameCompletionResult(nextSession);
      return {
        gameState,
        characterDefinitions,
        sessionState: nextSession,
        result:
          completion == null
            ? null
            : {
                moduleId: "city-begging",
                category: "minigame",
                outcome: "success",
                score: completion.maxCombo,
                summaryLines: [
                  `food:${completion.foodGain}`,
                  `gold:${completion.goldGain}`,
                ],
              },
      };
    }

    return { gameState, characterDefinitions, sessionState };
  },
  buildViewModel({ sessionState }) {
    return {
      presentation: { mode: "overlay" },
      model: sessionState,
    };
  },
};
```

- [ ] **Step 4: Bridge `appState.beggingMiniGameState` from the shared session during transition**

Use one synchronization rule in `main.ts`:

```ts
appState = {
  ...appState,
  beggingMiniGameState:
    appState.gameState.runtime.interactiveSession?.moduleId === "city-begging"
      ? appState.gameState.runtime.interactiveSession.state
      : null,
};
```

Do not delete `beggingMiniGameState` in this task.

- [ ] **Step 5: Run verification**

Run:

```bash
npm run typecheck
npm test
```

Manual check:

- start city begging from the current project flow
- pointer movement still updates the minigame
- completion still grants food, gold, and stamina cost

- [ ] **Step 6: Commit**

```bash
git add src/application/interactive/modules/city-begging.ts src/application/minigames/city-begging-minigame.ts src/application/app-shell.ts src/main.ts src/ui/app-render.ts src/ui/views/minigames/city-begging-minigame-view.ts tests/robustness.test.cjs
git commit -m "refactor: move city begging into interactive runtime"
```

## Task 6: Migrate Tavern Work QTE and Tavern Gamble Last Among Minigames

**Files:**
- Create: `src/application/interactive/modules/tavern-work-qte.ts`
- Create: `src/application/interactive/modules/tavern-gamble.ts`
- Modify: `src/application/house-modules/tavern/tavern-house-module.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Add failing tavern assertions for shared launch and settlement**

Reuse the existing tavern tests and add assertions shaped like:

```js
assert.equal(startWorkResult.gameState.runtime.interactiveSession?.moduleId, "tavern-work-qte");
assert.equal(startGambleResult.gameState.runtime.interactiveSession?.moduleId, "tavern-gamble");
```

- [ ] **Step 2: Run the focused tavern tests and confirm they fail**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "tavern"
```

Expected:

- tavern tests fail on the new shared-session expectations

- [ ] **Step 3: Split the tavern runtime into two wrappers, not one overloaded module**

Use:

```ts
export const tavernWorkQteInteractiveModule = ...;
export const tavernGambleInteractiveModule = ...;
```

Do not hide both under one `tavern` interactive id. The request and view surface are too different.

- [ ] **Step 4: Keep tavern house logic as adapter-only code**

The tavern house module may still:

```ts
- check stamina
- choose short vs long gamble config
- launch the module
- consume the `InteractiveResult`
```

It must stop owning the long-running play loop directly.

- [ ] **Step 5: Run full verification**

Run:

```bash
npm run typecheck
npm test
```

Manual check:

- tavern work QTE still starts and ends
- short gamble still settles
- long gamble still supports meld, draw, and showdown actions

- [ ] **Step 6: Commit**

```bash
git add src/application/interactive/modules/tavern-work-qte.ts src/application/interactive/modules/tavern-gamble.ts src/application/house-modules/tavern/tavern-house-module.ts tests/robustness.test.cjs
git commit -m "refactor: migrate tavern interactions to interactive runtime"
```

## Task 7: Wrap Story Battle as `InteractiveModuleContract`, Not `MinigameContract`

**Files:**
- Create: `src/application/interactive/modules/story-battle.ts`
- Modify: `src/application/story/story-callbacks.ts`
- Modify: `src/application/story-battle/story-battle-runtime.ts`
- Modify: `src/main.ts`
- Modify: `src/ui/app-render.ts`
- Modify: `src/ui/views/battle/story-battle-view.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Add a failing regression assertion that battle launch writes `interactiveSession`**

Extend the current story-battle test:

```js
assert.equal(startedState.runtime.interactiveSession?.moduleId, "story-battle");
assert.equal(startedState.runtime.interactiveSession?.category, "battle");
```

- [ ] **Step 2: Run the focused story-battle tests and confirm they fail**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "story battle"
```

Expected:

- the new `interactiveSession` assertions fail

- [ ] **Step 3: Convert the battle runtime into an interactive wrapper without deleting legacy `storyBattle` yet**

Create `src/application/interactive/modules/story-battle.ts`:

```ts
import type { InteractiveModuleContract } from "../../../domain/interactive-module";
import type { ActiveStoryBattleSession, StoryBattleCompletion } from "../../../domain/story-battle";
import {
  createSundeyaRescueBattleSession,
  dispatchStoryBattleAction,
} from "../../story-battle/story-battle-runtime";

export const storyBattleInteractiveModule: InteractiveModuleContract<
  { battleId: "story.zhu_yuanzhang.sundeya-rescue"; completion: StoryBattleCompletion; textEntriesById?: Record<string, string> },
  NonNullable<ActiveStoryBattleSession>,
  NonNullable<ActiveStoryBattleSession>
> = {
  id: "story-battle",
  category: "battle",
  createSession({ config }) {
    return createSundeyaRescueBattleSession(config.completion, {
      textEntriesById: config.textEntriesById,
    });
  },
  dispatch({ gameState, characterDefinitions, sessionState, request, config }) {
    if (request.type === "external" && request.eventId === "embedded-victory") {
      const result = dispatchStoryBattleAction(
        { ...gameState, storyBattle: sessionState },
        "embedded-victory",
        { textEntriesById: config.textEntriesById }
      );
      return {
        gameState: result.state,
        characterDefinitions,
        sessionState,
        result: {
          moduleId: "story-battle",
          category: "battle",
          outcome: "victory",
          navigation: {
            returnView: result.enterHouseId == null ? "scene" : "house",
            enterHouseId: result.enterHouseId,
          },
        },
      };
    }
    return { gameState, characterDefinitions, sessionState };
  },
  buildViewModel({ sessionState }) {
    return {
      presentation:
        sessionState.phase === "embedded-running"
          ? { mode: "embedded-iframe", src: sessionState.demoScenarioId ?? "" }
          : { mode: "full-screen" },
      model: sessionState,
    };
  },
};
```

- [ ] **Step 4: Route story callback launch through the shared runtime**

Replace:

```ts
state: startStoryBattle(
  runtime.state,
  createSundeyaRescueBattleSession(...)
),
```

with:

```ts
const started = startInteractiveSession({
  state: runtime.state,
  characterDefinitions: runtime.characterDefinitions,
  moduleId: "story-battle",
  config: {
    battleId: "story.zhu_yuanzhang.sundeya-rescue",
    completion: {
      completedFlagKey,
      winFlagKey,
      battleIdVariableKey,
      resultVariableKey,
      enterHouseId: "house.kulan.keep",
      mainMissionText: getStoryCallbackText(
        runtime,
        "runtime.zhu_yuanzhang.main_mission.sundeya_battle_review"
      ),
    },
    textEntriesById: runtime.textEntriesById,
  },
  origin: { source: "story-callback" },
  completion: {
    returnView: "house",
    enterHouseId: "house.kulan.keep",
  },
  context: interactiveRegistry,
});
```

Keep `gameState.storyBattle` mirrored from the active session until the render path is fully moved.

- [ ] **Step 5: Run verification**

Run:

```bash
npm run typecheck
npm test
```

Manual check:

- trigger the Sundeya rescue battle
- embedded demo still appears
- victory still returns to keep review
- flags and mission text still settle correctly

- [ ] **Step 6: Commit**

```bash
git add src/application/interactive/modules/story-battle.ts src/application/story/story-callbacks.ts src/application/story-battle/story-battle-runtime.ts src/main.ts src/ui/app-render.ts src/ui/views/battle/story-battle-view.ts tests/robustness.test.cjs
git commit -m "refactor: route story battle through interactive runtime"
```

## Task 8: Remove Compatibility Shims and Add Regression Guards

**Files:**
- Modify: `src/application/app-shell.ts`
- Modify: `src/domain/game-state.ts`
- Modify: `src/main.ts`
- Modify: `src/ui/app-render.ts`
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/change-log.md`

- [ ] **Step 1: Add failing regression checks that legacy slots are no longer the source of truth**

Add assertions shaped like:

```js
assert.equal(result.state.runtime.interactiveSession, null);
assert.equal(result.state.storyBattle, null);
assert.equal(result.state.runtime.activitySession, null);
```

Only do this after the previous tasks already pass.

- [ ] **Step 2: Remove or demote the legacy channels**

Complete this cleanup set:

```ts
- stop reading appState.beggingMiniGameState as the authoritative session
- stop reading runtime.activitySession as the authoritative session
- stop using gameState.storyBattle as the authoritative session
- keep mirrors only if a specific view still needs one, and document why
```

- [ ] **Step 3: Add a source guard test so new direct runtime branches do not drift back into `main.ts`**

Append a scan-based test:

```js
test("main runtime no longer hardcodes module-specific interactive branches", () => {
  const mainSource = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );

  const forbidden = [
    "dispatchStoryBattleAction(",
    "createCityBeggingMiniGameState(",
    "updateCityBeggingMiniGameState(",
  ].filter((entry) => mainSource.includes(entry));

  assert.deepEqual(forbidden, []);
});
```

- [ ] **Step 4: Run final verification**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- typecheck passes
- test suite passes
- production build passes

- [ ] **Step 5: Update documentation and commit**

Append a short change-log entry summarizing:

```md
- added shared interactive runtime
- migrated minigames and story-battle to registry-based launch
- removed legacy interactive source-of-truth branches
```

Commit:

```bash
git add src/application/app-shell.ts src/domain/game-state.ts src/main.ts src/ui/app-render.ts tests/robustness.test.cjs docs/change-log.md
git commit -m "refactor: finalize shared interactive runtime migration"
```

## Execution Order

1. Task 1
2. Task 2
3. Task 3
4. Task 4
5. Task 5
6. Task 6
7. Task 7
8. Task 8

## Parallel Work Rules

- Do not run Tasks 1, 2, 7, or 8 in the same worktree as another thread editing `src/main.ts`, `src/domain/game-state.ts`, `src/ui/app-render.ts`, or `tests/robustness.test.cjs`.
- Task 4 and Task 6 may be split into separate worktrees only after Task 2 lands and the runtime API is stable.
- If multiple implementers are active, treat `interactive-module.ts` and `interactive-runtime.ts` as frozen contracts after Task 2 and require later tasks to conform rather than revise them opportunistically.

## Success Criteria

- `runtime.interactiveSession` becomes the authoritative session channel for standalone interactions.
- `generic-qte`, `grain-accounting`, `medicine-compounding`, `tea-house-debate`, `city-begging`, `tavern-work-qte`, `tavern-gamble`, and `story-battle` all launch through the shared runtime.
- House modules act as launch adapters and result consumers rather than long-lived gameplay engines.
- `story-battle` remains `category: "battle"` and still supports full-screen or embedded presentation.
- `main.ts` no longer contains direct gameplay-loop branches for battle and minigame internals.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded
