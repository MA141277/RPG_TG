# Work Minigame Pachinko Standard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the approved work-minigame standard for pachinko-backed work entries, including multi-ball play, 20-second lower-board refresh, entry-specific best scores, and 90 percent quick completion.

**Architecture:** Keep house-specific work semantics in the temple house module and shared minigame mechanics in the activity QTE playable runtime. Extend typed domain/view-model contracts before updating renderers so UI continues to consume structured data only. Store persistent best scores in `GameState.runtime.variables` keyed by `activityId`, not by playable handler.

**Tech Stack:** TypeScript, Vite, Node test runner, `npm run typecheck`, `npm run build:test`, targeted `node --test` runs, `npm run build`, and `npm run lint:plans`.

## Global Constraints

- Follow `docs/special-house-interface.md`.
- Do not add house-specific business branches in `src/main.ts`.
- Do not return HTML strings from `application/*`.
- Do not introduce top-level gameplay globals.
- Persistent best score must use `var.activity.<activityId>.best_score`.
- Quick-complete score is `Math.floor(bestScore * 0.9)`.
- Current five-attribute and minor-skill formulas remain deferred; render the empty state `相关能力：待接入`.
- Continuous pachinko release consumes official available balls for the first implementation.

## Execution State

- Status: `completed`
- Last Updated: `2026-07-13`
- Current Focus: `Implementation verified for the work minigame pachinko standard.`
- Next Step: `Manual in-browser acceptance of temple work pachinko flow.`
- Verification: `Passed npm run lint:plans; npm run typecheck; npm run build:test; targeted node --test robustness run; npm run build.`
- Notes: `Current branch is mmz. Existing uncommitted pachinko work is preserved and will be built on.`

## Progress Log

- 2026-07-13
  - Summary: `Plan created from docs/superpowers/specs/2026-07-13-work-minigame-pachinko-standard-design.md.`
  - Verification: `Pending npm run lint:plans.`
  - Next: `Run lint:plans and execute Task 1.`
- 2026-07-13
  - Summary: `Implemented pachinko row removal, multi-ball launch/tick, 20-second lower layout refresh, enhanced work confirmation fields, entry-specific best score storage, and 90 percent quick completion.`
  - Verification: `Task-level npm run build:test, npm run typecheck, and targeted node --test commands passed before final verification.`
  - Next: `Run final lint:plans, typecheck, build:test, targeted robustness tests, and build, then update Task 5 and closeout fields.`
- 2026-07-13
  - Summary: `Final verification completed for the approved work-minigame pachinko standard. Global project-progress was not overwritten because it currently owns a separate governance migration thread.`
  - Verification: `Passed npm run lint:plans; npm run typecheck; npm run build:test; node --test --test-name-pattern "pachinko removes first two fixed pin rows|pachinko can run multiple active balls|pachinko refreshes lower random elements after twenty seconds|temple work confirmation shows work sections and quick complete|temple work quick complete uses ninety percent|temple work reaching contribution threshold" tests\\robustness.test.cjs; npm run build.`
  - Next: `Manual browser acceptance from the running app.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-13-work-minigame-pachinko-standard-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - The current code already has an initial pachinko replacement, final-settling confirmation, flipper collision, temple playable handoff, and typed pachinko overlay.
  - The remaining approved work is to refine that implementation: remove the first two rows, support multiple balls, refresh lower random elements every 20 seconds, and add entry-specific best score / quick completion confirmation.

## Implementation Scope

### In Scope

- Convert pachinko runtime and renderers from one active ball to multiple active balls.
- Remove the first two fixed pachinko pin rows from collision and rendering data.
- Add session-owned 20-second lower-board refresh for bottom slot values.
- Extend activity-confirm data to carry required work description, related ability copy, cost copy, best score, and quick-complete actions.
- Add temple work quick-complete settlement at 90 percent of entry-specific best score.
- Update entry-specific highest score on normal and quick-complete settlement.
- Add regression tests for the above behavior.

### Still Out Of Scope

- Five-attribute and minor-skill scoring formulas.
- Special ball reward definitions.
- Random event reward effects.
- Separate non-scoring practice mode.
- Broad refactors outside the activity QTE, temple work, typed overlay, and tests touched by this feature.

## File Map

### Existing files to modify

- `src/domain/activity-session.ts`
  - Add `activeBalls`, layout refresh timing fields, and preserve compatibility for current consumers where necessary.
- `src/application/activity/activity-qte-runtime.ts`
  - Implement multi-ball launch/tick/settle, row removal, 20-second slot refresh, and result confirmation behavior.
- `src/domain/house-activity.ts`
  - Extend activity confirmation overlay state with work minigame metadata and optional quick-complete controls.
- `src/domain/house-module.ts`
  - Extend typed overlay/view model contracts for activity confirm and pachinko multi-ball rendering.
- `src/application/house-modules/temple-house/temple-house-house-module.ts`
  - Populate confirmation fields, read/write best scores, add quick-complete action, and keep normal replay path.
- `src/ui/views/house/temple-house-view.ts`
  - Render multiple balls and enhanced confirmation content.
- `src/ui/views/scene/scene-view.ts`
  - Render multiple balls for scene-owned pachinko overlays.
- `src/main.ts`
  - Only adjust generic activity-QTE DOM sync if needed for multiple active balls; do not add house business logic.
- `tests/robustness.test.cjs`
  - Add regression tests for row removal, multi-ball, 20-second refresh, best-score, quick-complete, and per-entry separation.
- `docs/special-house-interface.md`
  - Update shared interface notes for enhanced activity-confirm and multi-ball pachinko if contracts change.
- `docs/change-log.md`
  - Record shared contract/runtime changes.

### Existing files expected to be deleted

- None.

### New files to create

- None.

## Verification Plan

- Targeted verification:
  - `node --test --test-name-pattern "pachinko removes first two rows|pachinko can run multiple active balls|pachinko refreshes lower random elements after twenty seconds|temple work confirmation shows best score quick complete|temple work entries keep separate best scores" tests\\robustness.test.cjs`
- Required commands:
  - `npm run lint:plans`
  - `npm run typecheck`
  - `npm run build:test`
  - targeted `node --test` command above
  - `npm run build`

## Task 1: Pachinko Runtime Shape And Layout

**Files:**
- Modify: `src/domain/activity-session.ts`
- Modify: `src/domain/house-module.ts`
- Modify: `src/application/activity/activity-qte-runtime.ts`
- Modify: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes: `ActivityPachinkoBoardSession`, `ActivityPachinkoBoardBall`, `playActivityPachinkoBoard`, `tickActivityPachinkoBoard`.
- Produces: `activeBalls: ActivityPachinkoBoardBall[]`, removed top rows, official-ball multi-launch behavior, and stable final-settling session.

- [x] **Step 1: Write failing tests for row removal and multi-ball**

Add tests to `tests/robustness.test.cjs` asserting:

```js
test("pachinko removes first two fixed pin rows from the board", () => {
  const activityDefinition = { id: "activity.test.pachinko.rows", label: "Rows", outcome: {} };
  const session = createActivityQteSession(activityDefinition, "generic.qte");
  assert.equal(session.type, "pachinko-board");
  assert.equal(session.pins.some((pin) => pin.y === 420), false);
  assert.equal(session.pins.some((pin) => pin.y === 505), false);
  assert.equal(session.pins.some((pin) => pin.y === 590), true);
});

test("pachinko can run multiple active balls from repeated releases", () => {
  const activityDefinition = { id: "activity.test.pachinko.multiball", label: "Multi", outcome: {} };
  let result = {
    state: { runtime: { activitySession: createActivityQteSession(activityDefinition, "generic.qte"), flags: {}, variables: {} } },
    characterDefinitions: [],
  };
  result = playActivityPachinkoBoard(result.state, activityDefinition, []);
  result = tickActivityPachinkoBoard(result.state, activityDefinition, []);
  result = playActivityPachinkoBoard(result.state, activityDefinition, []);
  const session = result.state.runtime.activitySession;
  assert.equal(session.type, "pachinko-board");
  assert.equal(session.phase, "dropping");
  assert.equal(session.remainingBalls, 3);
  assert.equal(session.activeBalls.length, 2);
});
```

- [x] **Step 2: Run tests to verify they fail**

Run:

```bash
npm run build:test
node --test --test-name-pattern "pachinko removes first two fixed pin rows|pachinko can run multiple active balls" tests\robustness.test.cjs
```

Expected:

- row-removal test fails while old rows exist
- multi-ball test fails because `activeBalls` is missing or repeated release is ignored

- [x] **Step 3: Implement minimal runtime/domain changes**

Implement:

- add `activeBalls: ActivityPachinkoBoardBall[]` to `ActivityPachinkoBoardSession`
- keep `activeBall` temporarily as a derived compatibility field until all renderers are migrated
- remove the first two rows in `createPachinkoPins`
- allow `playActivityPachinkoBoard` to launch while `phase` is `ready` or `dropping`
- append launched balls to `activeBalls`
- update tick to step every active ball and remove only settled balls
- set `phase` to `settling` only when `remainingBalls === 0` and `activeBalls.length === 0`

- [x] **Step 4: Run tests to verify they pass**

Run:

```bash
npm run build:test
node --test --test-name-pattern "pachinko removes first two fixed pin rows|pachinko can run multiple active balls" tests\robustness.test.cjs
```

Expected:

- both tests pass

## Task 2: Pachinko 20-Second Lower Refresh And Rendering

**Files:**
- Modify: `src/domain/activity-session.ts`
- Modify: `src/domain/house-module.ts`
- Modify: `src/application/activity/activity-qte-runtime.ts`
- Modify: `src/ui/views/house/temple-house-view.ts`
- Modify: `src/ui/views/scene/scene-view.ts`
- Modify: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes: `activeBalls`, `slotValues`, `animationTickMs`.
- Produces: `layoutRefreshElapsedMs`, `layoutRefreshPeriodMs`, `layoutVersion`, multi-ball rendering, and refreshed slot values.

- [x] **Step 1: Write failing tests for refresh and rendering data**

Add tests asserting:

```js
test("pachinko refreshes lower random elements after twenty seconds of ticks", () => {
  const activityDefinition = { id: "activity.test.pachinko.refresh", label: "Refresh", outcome: {} };
  let result = {
    state: { runtime: { activitySession: createActivityQteSession(activityDefinition, "generic.qte"), flags: {}, variables: {} } },
    characterDefinitions: [],
  };
  const before = result.state.runtime.activitySession.slotValues.join(",");
  const ticks = Math.ceil(20000 / result.state.runtime.activitySession.animationTickMs);
  for (let index = 0; index < ticks; index += 1) {
    result = tickActivityPachinkoBoard(result.state, activityDefinition, []);
  }
  const session = result.state.runtime.activitySession;
  assert.equal(session.type, "pachinko-board");
  assert.equal(session.layoutVersion, 1);
  assert.notEqual(session.slotValues.join(","), before);
});
```

- [x] **Step 2: Run test to verify it fails**

Run:

```bash
npm run build:test
node --test --test-name-pattern "pachinko refreshes lower random elements after twenty seconds" tests\robustness.test.cjs
```

Expected:

- fails because layout refresh fields do not exist or values do not change

- [x] **Step 3: Implement refresh and renderer migration**

Implement:

- initialize `layoutRefreshElapsedMs: 0`, `layoutRefreshPeriodMs: 20000`, `layoutVersion: 0`
- increment refresh elapsed by `animationTickMs` in tick
- when elapsed reaches period, shuffle slot values with a seed including `layoutVersion + 1`, reset elapsed remainder, increment version
- render `activeBalls` in scene and house pachinko views
- preserve final-settling confirm label behavior

- [x] **Step 4: Run refresh and rendering-adjacent tests**

Run:

```bash
npm run build:test
node --test --test-name-pattern "pachinko refreshes lower random elements after twenty seconds|pachinko board keeps final settled ball visible" tests\robustness.test.cjs
```

Expected:

- tests pass

## Task 3: Work Confirmation Best Score And Quick Complete

**Files:**
- Modify: `src/domain/house-activity.ts`
- Modify: `src/domain/house-module.ts`
- Modify: `src/application/house-modules/temple-house/temple-house-house-module.ts`
- Modify: `src/ui/views/house/temple-house-view.ts`
- Modify: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes: temple `activity-confirm` overlay, `finalizeTempleWorkScore`, `ACTIVITY_COMPLETION_STAMINA_COST`.
- Produces: enhanced confirmation sections, quick-complete action, and `var.activity.<activityId>.best_score`.

- [x] **Step 1: Write failing tests for enhanced confirmation and quick complete**

Add tests asserting:

```js
test("temple work confirmation shows work sections and quick complete from best score", () => {
  const monkCharacters = createPrototypeCharactersForStoryStage(ZHU_YUANZHANG_STORY_STAGES.huangjueTemple);
  const state = {
    ...createMonkStageState(),
    runtime: {
      ...createMonkStageState().runtime,
      variables: {
        ...createMonkStageState().runtime.variables,
        "var.activity.activity.temple.copy_scripture.best_score": 20,
      },
    },
  };
  const enterResult = templeHouseHouseModule.enter({
    gameState: state,
    characterDefinitions: monkCharacters,
    houseDefinition: templeHouse,
    playerCharacterId,
  });
  const result = templeHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: { ...enterResult.sessionState, dailyActionPanel: "work" },
    request: { type: "action", actionId: "assign-temple-task:copy-scripture" },
    activityDefinitionsById,
  });
  assert.equal(result.sessionState?.overlay?.type, "activity-confirm");
  assert.equal(result.sessionState.overlay.bestScore, 20);
  assert.equal(result.sessionState.overlay.quickCompleteScore, 18);
  assert.equal(result.sessionState.overlay.relatedAbilityLines.includes("相关能力：待接入"), true);
});
```

- [x] **Step 2: Run tests to verify they fail**

Run:

```bash
npm run build:test
node --test --test-name-pattern "temple work confirmation shows work sections and quick complete" tests\robustness.test.cjs
```

Expected:

- fails because enhanced overlay fields are missing

- [x] **Step 3: Implement enhanced confirmation and best-score helpers**

Implement:

- extend `HouseActivityConfirmOverlayState` with optional:
  - `workDescriptionLines`
  - `relatedAbilityLines`
  - `costLines`
  - `bestScore`
  - `quickCompleteScore`
  - `quickCompleteActionId`
  - `quickCompleteLabel`
- add helper `getActivityBestScoreVariableKey(activityId: string): string`
- add helper `readActivityBestScore(state, activityId): number | null`
- add helper `writeActivityBestScore(state, activityId, score): GameState`
- populate overlay sections in `createActivityConfirmOverlay` call sites for temple work
- expose enhanced fields in `selectOverlayViewModel`
- render the sections and quick-complete button in temple view

- [x] **Step 4: Run confirmation tests**

Run:

```bash
npm run build:test
node --test --test-name-pattern "temple work confirmation shows work sections and quick complete" tests\robustness.test.cjs
```

Expected:

- test passes

## Task 4: Quick Complete Settlement And Per-Entry Best Scores

**Files:**
- Modify: `src/application/house-modules/temple-house/temple-house-house-module.ts`
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/special-house-interface.md`
- Modify: `docs/change-log.md`

**Interfaces:**
- Consumes: quick-complete overlay action id, `finalizeTempleWorkScore`, best-score helpers.
- Produces: settlement at 90 percent, per-entry best-score separation, docs updates.

- [x] **Step 1: Write failing tests for quick settlement and per-entry separation**

Add tests asserting:

```js
test("temple work quick complete uses ninety percent and preserves separate best scores", () => {
  const activityA = "activity.temple.copy_scripture";
  const activityB = "activity.temple.sweep_floor";
  const state = {
    ...createMonkStageState(),
    runtime: {
      ...createMonkStageState().runtime,
      variables: {
        ...createMonkStageState().runtime.variables,
        [`var.activity.${activityA}.best_score`]: 20,
        [`var.activity.${activityB}.best_score`]: 9,
      },
    },
  };
  const result = templeHouseHouseModule.dispatch({
    gameState: state,
    characterDefinitions: createPrototypeCharactersForStoryStage(ZHU_YUANZHANG_STORY_STAGES.huangjueTemple),
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: createInitialTempleSessionForWork("copy-scripture"),
    request: { type: "action", actionId: "quick-complete-temple-task:copy-scripture" },
    activityDefinitionsById,
  });
  assert.equal(result.gameState.runtime.variables[`var.activity.${activityA}.best_score`], 20);
  assert.equal(result.gameState.runtime.variables[`var.activity.${activityB}.best_score`], 9);
  assert.equal(result.gameState.runtime.variables["var.temple.last_work_score"], 18);
});
```

If `createInitialTempleSessionForWork` does not exist, set the session state explicitly in the test using the existing temple session factory or the shape used by nearby temple work tests.

- [x] **Step 2: Run tests to verify they fail**

Run:

```bash
npm run build:test
node --test --test-name-pattern "temple work quick complete uses ninety percent" tests\robustness.test.cjs
```

Expected:

- fails because the quick-complete action does not exist

- [x] **Step 3: Implement quick complete and best-score updates**

Implement:

- define quick-complete action prefix `quick-complete-temple-task:`
- dispatch quick-complete by resolving the task activity definition, reading best score, computing `Math.floor(bestScore * 0.9)`, and calling existing settlement path
- update `finalizeTempleWorkScore` to write `var.activity.<activityId>.best_score`
- ensure normal replay with lower score does not lower stored best score
- update docs for shared overlay and pachinko multi-ball contract

- [x] **Step 4: Run quick-complete tests**

Run:

```bash
npm run build:test
node --test --test-name-pattern "temple work confirmation shows work sections and quick complete|temple work quick complete uses ninety percent" tests\robustness.test.cjs
```

Expected:

- tests pass

## Task 5: Verification And Governance Sync

**Files:**
- Modify: `docs/superpowers/plans/2026-07-13-work-minigame-pachinko-standard.md`
- Modify: `docs/superpowers/project-progress.md` if execution state or closeout is recorded

**Interfaces:**
- Consumes: all previous task changes.
- Produces: verified implementation state and updated plan progress log.

- [x] **Step 1: Run targeted verification**

Run:

```bash
node --test --test-name-pattern "pachinko removes first two rows|pachinko can run multiple active balls|pachinko refreshes lower random elements after twenty seconds|temple work confirmation shows work sections and quick complete|temple work quick complete uses ninety percent|temple work reaching contribution threshold" tests\robustness.test.cjs
```

Expected:

- targeted tests pass

- [x] **Step 2: Run required verification**

Run:

```bash
npm run typecheck
npm run build:test
npm run build
```

Expected:

- commands complete successfully; known Vite warnings may remain if unrelated

- [x] **Step 3: Update plan progress**

Update:

- mark completed task checkboxes
- set `Execution State.Verification` to the commands run
- append a `Progress Log` entry with summary, verification, and next action

## Exit Check

- [x] Pachinko top two fixed pin rows are removed from runtime collision/rendering data.
- [x] Pachinko supports multiple simultaneous active balls through repeated play clicks.
- [x] Pachinko lower random elements refresh every 20 seconds from runtime tick state.
- [x] Work confirmation shows immersive description, related ability empty state, and stamina/time cost.
- [x] Entry-specific highest score is stored per `activityId`.
- [x] Quick complete uses 90 percent of entry-specific highest score.
- [x] Shared interface docs and change log are updated for contract changes.
- [x] Targeted tests pass.
- [x] `npm run typecheck`, `npm run build:test`, and `npm run build` pass.
- [x] Project progress sync decision recorded without overwriting the separate governance migration entry.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Work minigame pachinko standard`
- Parent Task: `Work minigame standardization`
- Parent Stage: `Feature implementation`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `not-overwritten; separate governance migration remains current`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `manual-browser-acceptance`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-13-work-minigame-pachinko-standard.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, then this plan, and continue from the first unchecked checkbox.`
