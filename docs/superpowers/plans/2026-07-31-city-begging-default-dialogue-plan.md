# City Begging Default Dialogue Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the city begging beta entry with a fixed, data-driven Haozhou dialogue flow covering three locations and nine deterministic outcomes.

**Architecture:** The feature extends the existing `city-begging` playable owner instead of adding city-begging business branches to `src/main.ts`. Default content is materialized as structured data, runtime state reads that data, UI presents dialogue/fortune stages, and settlement consumes named effects through existing unified state helpers where available.

**Tech Stack:** TypeScript, Vite, Node test runner, existing playable runtime, existing city view/action wiring, `CardDrawAnimator`, `npm run build:test`, targeted `node --test`, `npm run typecheck`, `npm run build`, and `npm run lint:plans`.

## Execution State

- Status: `waiting`
- Last Updated: `2026-07-31`
- Current Focus: `Plan created after user approved the design.`
- Next Step: `Choose Subagent-Driven or Inline Execution, then start Task 1 with a failing data contract test.`
- Verification: `npm run lint:plans passed for plan creation; implementation tests not run yet.`
- Notes: `docs/superpowers/project-progress.md currently points at a separate completed-but-open map-renderer child, so this plan is not marked as canonical project-progress current work until the user explicitly promotes this child or accepts local execution outside that queue.`

## Progress Log

- 2026-07-31
  - Summary: `Created the implementation plan for the approved city begging default dialogue design.`
  - Verification: `npm run lint:plans`
  - Next: `Choose execution mode, then start Task 1 with a failing data contract test.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-31-city-begging-default-dialogue-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Existing `city-begging` is an arcade/numeric minigame path.
  - Existing temporary city card draw test is wired through `src/main.ts`; production city begging must not extend that temporary route.
  - The user clarified that the 化缘 entry belongs in the city screen below the location buttons.

## Global Constraints

- Do not add new city-begging business branches to `src/main.ts`.
- Keep default beta content as structured data, not runtime string parsing.
- Runtime reads structured `fixedResult` and `effects`; it must not infer outcome meaning from dialogue text.
- The city entry appears below the city location buttons.
- The beta version has no player custom text input.
- Use TDD: each task starts with a failing test before production code.
- If production code, runtime session structure, registry shape, or cross-module wiring changes, update `docs/change-log.md`.
- Resource data uses resource ids; business modules must not directly import visual asset files.

## Implementation Scope

### In Scope

- Add fixed default content for Haozhou city begging.
- Add domain types and selectors for default dialogue content.
- Add default-dialogue mode to the `city-begging` playable.
- Add structured settlement effects for the nine default branches.
- Add city UI entry under locations and a dialogue/fortune/outcome overlay.
- Reuse `CardDrawAnimator` for `吉/凶/平` display.
- Add targeted tests and changelog.

### Still Out Of Scope

- Live AI generation.
- Player custom free-text input.
- Randomized encounter baselines.
- Replacing the old arcade city-begging minigame everywhere if a legacy test still depends on it.
- Large city shell migration unrelated to this feature.

## File Map

### Existing files to modify

- `src/domain/city-begging-minigame.ts`
  - Add default-dialogue session/content/effect types or export them from a new domain file.
- `src/application/playables/city-begging/city-begging-definition.ts`
  - Launch and reduce default-dialogue mode.
- `src/core/runtime/playable-runtime.ts`
  - Route default-dialogue city-begging actions without adding main-shell branches.
- `src/application/minigames/city-begging-minigame.ts`
  - Keep legacy minigame completion intact; add adapter only if shared constants are needed.
- `src/application/app-shell.ts`
  - Add app-level default dialogue overlay state only if the playable session alone is insufficient for render synchronization.
- `src/ui/views/city/city-view.ts`
  - Add the city 化缘 entry below location buttons.
- `src/ui/app-render.ts`
  - Render city begging default dialogue overlay and fortune card mount.
- `src/ui/animations/card-draw-animation.ts`
  - Add formatter support only if existing `resultFormatter` is insufficient.
- `src/styles/prototype.css` or a city-begging feature CSS file already imported by the app
  - Add token-based UI styles for the city begging dialogue overlay.
- `docs/change-log.md`
  - Record runtime/session/content wiring changes.

### Existing files expected to be deleted

- None.

### New files to create

- `src/content/playables/city-begging-default-content.ts`
  - Owns the three locations, nine options, fixed results, and structured effects.
- `src/application/playables/city-begging/city-begging-default-dialogue.ts`
  - Pure reducer/selectors for default-dialogue session lifecycle.
- `src/application/playables/city-begging/city-begging-default-settlement.ts`
  - Applies supported structured effects once.
- `src/ui/views/minigames/city-begging-default-dialogue-view.ts`
  - Renders the location, encounter, fortune, thinking, and outcome stages.
- `tests/city-begging-default-content.test.cjs`
  - Locks the fixed 3x3 content table.
- `tests/city-begging-default-runtime.test.cjs`
  - Locks launch, selection, fixed result, thinking, and settlement.
- `tests/city-begging-default-ui.test.cjs`
  - Locks city entry placement and fortune labels.

## Verification Plan

- Targeted verification:
  - `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/city-begging-default-content.test.cjs tests/city-begging-default-runtime.test.cjs tests/city-begging-default-ui.test.cjs }`
- Required commands:
  - `npm run typecheck`
  - `npm run build`
  - `npm run lint:plans`
- Full regression, if time permits:
  - `npm test`

## Task 1: Default Content Contract

**Files:**
- Create: `tests/city-begging-default-content.test.cjs`
- Create: `src/content/playables/city-begging-default-content.ts`
- Read: `docs/superpowers/specs/2026-07-31-city-begging-default-dialogue-design.md`

**Interfaces:**
- Produces:
  - `CITY_BEGGING_DEFAULT_LOCATIONS: readonly CityBeggingDefaultLocation[]`
  - `type CityBeggingDefaultResult = "ji" | "xiong" | "ping"`
  - `type CityBeggingDefaultEffect = { type: string; [key: string]: unknown }`
  - `getCityBeggingDefaultLocation(locationId: string): CityBeggingDefaultLocation | null`

- [ ] **Step 1: Write the failing content contract test**

Add this shape to `tests/city-begging-default-content.test.cjs`:

```js
const test = require("node:test");
const assert = require("node:assert/strict");

test("city begging default content contains three fixed Haozhou locations with three options each", async () => {
  const { CITY_BEGGING_DEFAULT_LOCATIONS } = await import(
    "../src/content/playables/city-begging-default-content.ts"
  );

  assert.equal(CITY_BEGGING_DEFAULT_LOCATIONS.length, 3);
  assert.deepEqual(
    CITY_BEGGING_DEFAULT_LOCATIONS.map((location) => location.locationId),
    ["dongshi_mishi", "xicheng_guanyin", "beicheng_ciji"]
  );
  assert.deepEqual(
    CITY_BEGGING_DEFAULT_LOCATIONS.map((location) => location.baselineResult),
    ["xiong", "ping", "ji"]
  );

  for (const location of CITY_BEGGING_DEFAULT_LOCATIONS) {
    assert.equal(location.options.length, 3, location.locationId);
    assert.ok(location.encounterText.length > 20, location.locationId);
    assert.ok(location.closingText.length > 0, location.locationId);
    assert.ok(typeof location.backgroundId === "string");
  }
});

test("city begging default options lock the requested fixed fortune table", async () => {
  const { CITY_BEGGING_DEFAULT_LOCATIONS } = await import(
    "../src/content/playables/city-begging-default-content.ts"
  );

  const table = Object.fromEntries(
    CITY_BEGGING_DEFAULT_LOCATIONS.map((location) => [
      location.locationId,
      location.options.map((option) => option.fixedResult),
    ])
  );

  assert.deepEqual(table, {
    dongshi_mishi: ["xiong", "xiong", "xiong"],
    xicheng_guanyin: ["ping", "ping", "ji"],
    beicheng_ciji: ["ji", "ji", "ping"],
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/city-begging-default-content.test.cjs }
```

Expected:

- `ERR_MODULE_NOT_FOUND` or export-not-found for `city-begging-default-content.ts`.

- [ ] **Step 3: Implement the content table**

Create `src/content/playables/city-begging-default-content.ts` with the typed location records. Preserve the exact Chinese copy from the user request. Use these result keys:

```ts
export type CityBeggingDefaultResult = "ji" | "xiong" | "ping";

export type CityBeggingDefaultEffect =
  | { type: "add_grain"; grainKind: "coarse" | "vegetarian"; amountSheng: number; quality?: string }
  | { type: "add_item"; itemId: string; quantity: number }
  | { type: "mod_attr"; attrId: string; delta: number; label: string }
  | { type: "add_bond"; bondId: string; delta: number; label: string }
  | { type: "set_flag"; flagId: string; value: boolean }
  | { type: "injure"; staminaDelta: number; label: string }
  | { type: "mod_weight"; key: string; result: CityBeggingDefaultResult; delta: number; label: string }
  | { type: "restore_stamina"; amount: number; label: string }
  | { type: "restore_stamina_full"; label: string };

export type CityBeggingDefaultOption = {
  optionId: string;
  optionText: string;
  fixedResult: CityBeggingDefaultResult;
  outcomeText: string;
  effects: CityBeggingDefaultEffect[];
};

export type CityBeggingDefaultLocation = {
  locationId: "dongshi_mishi" | "xicheng_guanyin" | "beicheng_ciji";
  title: string;
  baselineResult: CityBeggingDefaultResult;
  backgroundId: "liangpu" | "chengzhen" | "temple";
  npc: {
    id: string;
    name: string;
  };
  encounterText: string;
  closingText: string;
  options: readonly CityBeggingDefaultOption[];
};
```

- [ ] **Step 4: Run the test to verify it passes**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/city-begging-default-content.test.cjs }
```

Expected:

- Both tests pass.

## Task 2: Default Dialogue Runtime Reducer

**Files:**
- Create: `tests/city-begging-default-runtime.test.cjs`
- Create: `src/application/playables/city-begging/city-begging-default-dialogue.ts`
- Modify: `src/domain/city-begging-minigame.ts`
- Modify: `src/application/playables/city-begging/city-begging-definition.ts`

**Interfaces:**
- Consumes:
  - `CITY_BEGGING_DEFAULT_LOCATIONS`
- Produces:
  - `type CityBeggingDefaultDialogueState`
  - `createCityBeggingDefaultDialogueState(now: number): CityBeggingDefaultDialogueState`
  - `selectCityBeggingDefaultLocation(state, locationId): CityBeggingDefaultDialogueState`
  - `selectCityBeggingDefaultOption(state, optionId, now): CityBeggingDefaultDialogueState`
  - `advanceCityBeggingDefaultThinking(state, now): CityBeggingDefaultDialogueState`

- [ ] **Step 1: Write the failing reducer test**

Add a test that creates the default state, selects `xicheng_guanyin`, then selects the `help_mend_net` option and asserts `fixedResult === "ji"` and `phase === "fortune-draw"`.

```js
test("city begging default dialogue selects a location and locks a fixed option result", async () => {
  const {
    createCityBeggingDefaultDialogueState,
    selectCityBeggingDefaultLocation,
    selectCityBeggingDefaultOption,
  } = await import("../src/application/playables/city-begging/city-begging-default-dialogue.ts");

  const launched = createCityBeggingDefaultDialogueState(1000);
  assert.equal(launched.mode, "default-dialogue");
  assert.equal(launched.phase, "location-select");

  const atLocation = selectCityBeggingDefaultLocation(launched, "xicheng_guanyin");
  assert.equal(atLocation.phase, "encounter");
  assert.equal(atLocation.selectedLocationId, "xicheng_guanyin");

  const afterOption = selectCityBeggingDefaultOption(atLocation, "help_mend_net", 1200);
  assert.equal(afterOption.phase, "fortune-draw");
  assert.equal(afterOption.selectedOptionId, "help_mend_net");
  assert.equal(afterOption.fixedResult, "ji");
  assert.equal(afterOption.settlementApplied, false);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/city-begging-default-runtime.test.cjs }
```

Expected:

- Missing module or missing exported functions.

- [ ] **Step 3: Implement the reducer**

Create the reducer with immutable state transitions. Use a deterministic 2400 ms thinking delay unless a caller supplies a different timestamp.

```ts
export type CityBeggingDefaultDialoguePhase =
  | "location-select"
  | "encounter"
  | "fortune-draw"
  | "thinking"
  | "outcome"
  | "completed";

export type CityBeggingDefaultDialogueState = {
  mode: "default-dialogue";
  phase: CityBeggingDefaultDialoguePhase;
  selectedLocationId: string | null;
  selectedOptionId: string | null;
  fixedResult: CityBeggingDefaultResult | null;
  thinkingUntil: number | null;
  settlementApplied: boolean;
};
```

- [ ] **Step 4: Update the playable launch path**

Modify `launchCityBeggingPlayable()` so city launches can pass `mode: "default-dialogue"` in payload later. Keep legacy minigame launch available for tests that still use it.

- [ ] **Step 5: Run targeted runtime tests**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/city-begging-default-runtime.test.cjs tests/city-begging-runtime-status.test.cjs tests/interactive-runtime-status.test.cjs }
```

Expected:

- New default runtime test passes.
- Existing city-begging legacy status tests still pass.

## Task 3: Runtime Actions And Settlement Effects

**Files:**
- Modify: `tests/city-begging-default-runtime.test.cjs`
- Create: `src/application/playables/city-begging/city-begging-default-settlement.ts`
- Modify: `src/application/playables/city-begging/city-begging-definition.ts`
- Modify: `src/core/runtime/playable-runtime.ts`

**Interfaces:**
- Consumes:
  - `CityBeggingDefaultDialogueState`
  - selected content option effects.
- Produces:
  - `applyCityBeggingDefaultSettlement(input): { state: RuntimeState; characterDefinitions: CharacterDefinition[]; characterStatusById: CharacterStatusById }`
  - playable actions `select-location`, `select-option`, `confirm-fortune`, `tick`, `confirm-outcome`.

- [ ] **Step 1: Write the failing action/settlement test**

Extend `tests/city-begging-default-runtime.test.cjs`:

```js
test("city begging default runtime applies outcome effects once", async () => {
  const { runPlayableRuntime, createLaunchPlayableRequest, createPlayableActionRequest } =
    await import("../src/core/runtime/playable-runtime.ts");
  const { createInitialState } = await import("../src/application/state/create-initial-state.ts");

  const characterDefinitions = [{ id: "player", name: "朱重八", stats: { gold: 0 } }];
  let runtimeState = {
    core: createInitialState(),
    app: {
      beggingMiniGameState: null,
      cityMenuState: null,
      cityDirectoryState: null,
      locationDialogueState: null,
      cityCardDrawTestState: null,
    },
  };

  runtimeState = runPlayableRuntime({
    state: runtimeState,
    request: createLaunchPlayableRequest("city-begging", {
      payload: { mode: "default-dialogue", now: 1000 },
    }),
    characterDefinitions,
    playerCharacterId: "player",
  }).state;

  runtimeState = runPlayableRuntime({
    state: runtimeState,
    request: createPlayableActionRequest("city-begging", "select-location", {
      locationId: "xicheng_guanyin",
    }),
    characterDefinitions,
    playerCharacterId: "player",
  }).state;

  runtimeState = runPlayableRuntime({
    state: runtimeState,
    request: createPlayableActionRequest("city-begging", "select-option", {
      optionId: "help_mend_net",
      now: 1200,
    }),
    characterDefinitions,
    playerCharacterId: "player",
  }).state;

  const result = runPlayableRuntime({
    state: runtimeState,
    request: createPlayableActionRequest("city-begging", "confirm-outcome"),
    characterDefinitions,
    playerCharacterId: "player",
  });

  assert.equal(result.handled, true);
  assert.equal(result.session, null);
  assert.ok(result.state.core.runtime.variables["flag.city_begging.xicheng_guanyin.yusou_bonded"]);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/city-begging-default-runtime.test.cjs }
```

Expected:

- Launch payload mode or new actions are not handled yet.

- [ ] **Step 3: Implement playable action routing**

In `runPlayableRuntime`, for `resolvedRequest.playableId === "city-begging"`:

- If session state mode is `default-dialogue`, route `select-location`, `select-option`, `confirm-fortune`, `tick`, and `confirm-outcome`.
- Keep existing `pointer`, `tick`, and `complete` behavior for legacy arcade state.

- [ ] **Step 4: Implement supported effect applier**

Apply:

- `set_flag` into `state.core.runtime.variables[flagId]`.
- `add_bond`, `mod_attr`, `mod_weight`, and unsupported inventory effects into namespaced runtime variables.
- `add_grain` through existing grain inventory helper when it can be called without UI imports.
- stamina changes through existing player stamina helpers when the required player id and character data are present.

- [ ] **Step 5: Run targeted runtime tests**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/city-begging-default-runtime.test.cjs tests/city-begging-runtime-status.test.cjs tests/interactive-runtime-status.test.cjs tests/runtime-dispatch-settlement.test.cjs }
```

Expected:

- New runtime tests pass.
- Existing city-begging legacy tests pass.

## Task 4: City Entry Placement

**Files:**
- Create: `tests/city-begging-default-ui.test.cjs`
- Modify: `src/ui/views/city/city-view.ts`
- Modify: city action coordinator or transition file discovered during implementation; do not add business logic to `src/main.ts`.

**Interfaces:**
- Produces:
  - City locations markup contains `data-action="start-city-begging-default"` or a better existing coordinator action id.

- [ ] **Step 1: Write the failing city entry placement test**

Add:

```js
test("city begging entry appears below city location buttons", () => {
  const source = require("node:fs").readFileSync("src/ui/views/city/city-view.ts", "utf8");
  const locationSubnavIndex = source.indexOf("function renderCityLocationSubnav");
  const beggingIndex = source.indexOf("start-city-begging-default");
  const joinIndex = source.indexOf("${[...cityEntryButtons, ...houseButtons].join(\"\")}");

  assert.ok(locationSubnavIndex >= 0, "expected location subnav renderer");
  assert.ok(beggingIndex > joinIndex, "begging entry should be rendered after location buttons");
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/city-begging-default-ui.test.cjs }
```

Expected:

- Test fails because the production begging entry is not yet present.

- [ ] **Step 3: Add the city locations entry**

Modify `renderCityLocationSubnav()` so it returns the location buttons followed by a separate city action button:

```html
<div class="c-city-menu__subnav-action">
  <button
    type="button"
    class="c-city-menu__subnav-button c-city-menu__subnav-button--begging"
    data-action="start-city-begging-default"
    data-button-sound="light"
  >
    <span class="c-city-menu__subnav-button-label">化缘</span>
  </button>
</div>
```

- [ ] **Step 4: Wire the action outside `main.ts` business logic**

Use the existing city/action coordinator if available. If only `main.ts` currently sees the click, add a small transition function under `src/application/runtime/transition/` and have `main.ts` call that generic transition without embedding city-begging rules. Record this as transition wiring in `docs/change-log.md`.

- [ ] **Step 5: Run UI and shell guard tests**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/city-begging-default-ui.test.cjs tests/main-shell-contract.test.cjs tests/city-button-sound-contract.test.cjs }
```

Expected:

- New entry placement passes.
- Main shell guard still passes or is updated to enforce no new city-begging business branches.

## Task 5: Dialogue And Fortune UI

**Files:**
- Modify: `tests/city-begging-default-ui.test.cjs`
- Create: `src/ui/views/minigames/city-begging-default-dialogue-view.ts`
- Modify: `src/ui/app-render.ts`
- Modify: `src/styles/prototype.css` or existing city-begging CSS owner.

**Interfaces:**
- Consumes:
  - active `city-begging` playable session with `state.mode === "default-dialogue"`.
  - `CITY_BEGGING_DEFAULT_LOCATIONS`.
- Produces:
  - `renderCityBeggingDefaultDialogueOverlay(input): string`
  - markup with `data-city-begging-default-overlay`
  - fortune mount with `data-city-begging-fortune-mount`

- [ ] **Step 1: Write the failing UI render contract test**

Add assertions that source files contain the production overlay hook and result labels:

```js
test("city begging default dialogue view renders fortune labels instead of numeric draw labels", () => {
  const viewSource = require("node:fs").existsSync("src/ui/views/minigames/city-begging-default-dialogue-view.ts")
    ? require("node:fs").readFileSync("src/ui/views/minigames/city-begging-default-dialogue-view.ts", "utf8")
    : "";

  assert.match(viewSource, /data-city-begging-default-overlay/);
  assert.match(viewSource, /data-city-begging-fortune-mount/);
  assert.match(viewSource, /吉/);
  assert.match(viewSource, /凶/);
  assert.match(viewSource, /平/);
  assert.doesNotMatch(viewSource, /返回 1-6/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/city-begging-default-ui.test.cjs }
```

Expected:

- Missing view file or missing overlay hooks.

- [ ] **Step 3: Implement the overlay view**

Render:

- location select buttons when `phase === "location-select"`.
- encounter text and three options when `phase === "encounter"`.
- card draw mount and fixed result label during `fortune-draw`.
- `AI推理中` during `thinking`.
- outcome text, settlement summary, and confirm button during `outcome`.

- [ ] **Step 4: Attach overlay in `renderApp()`**

Import and call `renderCityBeggingDefaultDialogueOverlay()` near the existing minigame overlay. The renderer may read the playable session and app state, but must not apply settlement.

- [ ] **Step 5: Add token-based styles**

Use existing tokens for color, spacing, radius, z-index, and font size. Do not add hardcoded colors or viewport-scaled font sizes.

- [ ] **Step 6: Run UI tests and typecheck**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/city-begging-default-ui.test.cjs tests/card-draw-animation.test.cjs }
npm run typecheck
```

Expected:

- UI contract passes.
- Card draw tests still pass.
- Typecheck passes.

## Task 6: Integration Verification And Documentation

**Files:**
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/plans/2026-07-31-city-begging-default-dialogue-plan.md`
- Optionally modify: `docs/superpowers/project-progress.md` only if this child is promoted as canonical current work.

**Interfaces:**
- Produces:
  - Changelog entry describing default data, runtime session mode, city entry placement, and structured settlement.
  - Updated plan checkboxes and progress log.

- [ ] **Step 1: Add changelog entry**

Record:

- default Haozhou 3x3 city begging data.
- `city-begging` default-dialogue mode.
- city locations entry placement.
- `吉/凶/平` fortune draw presentation.
- structured effects and any transitional unsupported-effect storage.

- [ ] **Step 2: Run targeted regression**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/city-begging-default-content.test.cjs tests/city-begging-default-runtime.test.cjs tests/city-begging-default-ui.test.cjs tests/city-begging-runtime-status.test.cjs tests/interactive-runtime-status.test.cjs tests/card-draw-animation.test.cjs }
```

Expected:

- All targeted tests pass.

- [ ] **Step 3: Run required baseline verification**

Run:

```bash
npm run typecheck
npm run build
npm run lint:plans
```

Expected:

- All commands pass. If `npm test` is run and only a known unrelated baseline failure remains, record the exact failing test and actual/expected values.

- [ ] **Step 4: Update plan execution state**

Set:

- `Status` to `completed-but-open` if code is done but remote push/structured closeout is not complete.
- `Verification` to the exact commands run.
- `Progress Log` with summary, verification, and next action.

## Exit Check

- [ ] Default content has exactly three locations and exactly nine fixed options.
- [ ] City entry appears below location buttons.
- [ ] Selecting a location and option uses fixed result data, not random runtime selection.
- [ ] Fortune presentation displays `吉/凶/平`, not numeric `1-6` labels.
- [ ] Settlement effects apply once through unified state structures or explicit structured transitional variables.
- [ ] No new city-begging business branch is added to `src/main.ts`.
- [ ] `docs/change-log.md` records interface/runtime/session wiring changes.
- [ ] Project progress sync is updated if this child is promoted as canonical current work.
- [ ] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded

## Child Closeout

- Closed Child: `City Begging Default Dialogue`
- Parent Task: `User-requested beta city begging flow`
- Parent Stage: `City Gameplay Beta`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `execute-or-promote-this-plan`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-31-city-begging-default-dialogue-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open this plan, confirm execution mode, then start Task 1.`
