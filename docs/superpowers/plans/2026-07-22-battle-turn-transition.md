# Battle Turn Transition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a non-skippable 3.5-second turn-transition overlay to the real `battle-demo` combat board so player, ally, and enemy phases each announce themselves before actions become active.

**Architecture:** Keep the implementation inside `prototypes/battle-demo/index.html` and add one isolated overlay subsystem with its own runtime state plus one async `playTurnTransition(type)` API. Integrate it at the existing turn handoff points (`beginBattle`, player end-turn, ally-to-enemy, enemy-to-player) and gate both UI handlers and action entry points through the same lock state so visuals and logic stay in sync.

**Tech Stack:** Plain HTML/CSS/JavaScript in `prototypes/battle-demo/index.html`, Node built-in test runner (`node --test`), CommonJS test files under `tests/`.

## Global Constraints

- Only modify the actual `prototypes/battle-demo/index.html` battle board implementation.
- Do not change the fallback `src/ui/views/battle/story-battle-view.ts` page.
- Do not reuse the existing victory/defeat `#overlay`; create a dedicated turn-transition layer.
- Transition timing must remain exactly `0.5s fade-in + 0.5s text fade-in + 2s hold + 0.5s fade-out = 3.5s`.
- Transitions are not skippable.
- During transition playback, board clicks, battle buttons, unit actions, and AI actions must all remain blocked.
- Do not touch unrelated troop, animation, or combat-balance behavior.

---

### Task 1: Add Turn Transition Overlay State And Pure Mapping Helpers

**Files:**
- Create: `tests/battle-turn-transition.test.cjs`
- Modify: `prototypes/battle-demo/index.html`

**Interfaces:**
- Consumes: existing `phase`, `turn`, `updateUI()`, and DOM-based battle markup in `prototypes/battle-demo/index.html`
- Produces:
  - `function getTurnTransitionContent(type)`
  - `function isBattleInteractionLocked()`
  - `async function playTurnTransition(type)`
  - dedicated DOM nodes:
    - `#turn-transition-overlay`
    - `#turn-transition-title`
    - `#turn-transition-subtitle`

- [ ] **Step 1: Write the failing test**

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

function loadBattleTurnTransitionFns() {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  const getContentBody = extractFunctionBody(
    source,
    "function getTurnTransitionContent(type)",
  );
  const isLockedBody = extractFunctionBody(
    source,
    "function isBattleInteractionLocked()",
  );
  const getTurnTransitionContent = new Function(
    `return function getTurnTransitionContent(type) {${getContentBody}};`,
  )();
  const state = { isActive: false };
  const isBattleInteractionLocked = new Function(
    "turnTransitionState",
    `return function isBattleInteractionLocked() {${isLockedBody}};`,
  )(state);
  return { source, state, getTurnTransitionContent, isBattleInteractionLocked };
}

test("battle turn transition copy maps player ally and enemy phases to fixed titles", () => {
  const { getTurnTransitionContent } = loadBattleTurnTransitionFns();
  assert.deepEqual(getTurnTransitionContent("player"), {
    title: "你的行动回合",
    subtitle: "明军",
  });
  assert.deepEqual(getTurnTransitionContent("ally"), {
    title: "盟友行动回合",
    subtitle: "明军",
  });
  assert.deepEqual(getTurnTransitionContent("enemy"), {
    title: "敌军行动回合",
    subtitle: "元军",
  });
});

test("battle interaction lock reflects dedicated turn transition runtime state", () => {
  const { state, isBattleInteractionLocked } = loadBattleTurnTransitionFns();
  assert.equal(isBattleInteractionLocked(), false);
  state.isActive = true;
  assert.equal(isBattleInteractionLocked(), true);
});

test("battle demo declares a dedicated turn transition overlay instead of reusing the result overlay", () => {
  const { source } = loadBattleTurnTransitionFns();
  assert.match(source, /id="turn-transition-overlay"/);
  assert.match(source, /id="turn-transition-title"/);
  assert.match(source, /id="turn-transition-subtitle"/);
  assert.match(source, /\.turn-transition-overlay/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/battle-turn-transition.test.cjs`

Expected: FAIL with at least one missing-signature error for `getTurnTransitionContent(type)` or `isBattleInteractionLocked()`

- [ ] **Step 3: Write minimal implementation**

Add the dedicated overlay markup near the existing `#overlay`, add CSS for the full-screen mask and centered title/subtitle, and add the new runtime state plus helpers inside the main `<script>`.

```js
const turnTransitionState = {
  isActive: false,
  activeType: null,
  timerIds: [],
};

function getTurnTransitionContent(type) {
  if (type === "ally") {
    return { title: "盟友行动回合", subtitle: "明军" };
  }
  if (type === "enemy") {
    return { title: "敌军行动回合", subtitle: "元军" };
  }
  return { title: "你的行动回合", subtitle: "明军" };
}

function isBattleInteractionLocked() {
  return turnTransitionState.isActive === true;
}

async function playTurnTransition(type) {
  if (turnTransitionState.isActive) {
    return;
  }
  const overlay = document.getElementById("turn-transition-overlay");
  const title = document.getElementById("turn-transition-title");
  const subtitle = document.getElementById("turn-transition-subtitle");
  const content = getTurnTransitionContent(type);
  title.textContent = content.title;
  subtitle.textContent = content.subtitle;
  turnTransitionState.isActive = true;
  turnTransitionState.activeType = type;
  overlay.classList.remove("hidden");
  overlay.classList.remove("is-enter", "is-leave");
  overlay.offsetWidth;
  overlay.classList.add("is-enter");
  await sleep(3500);
  overlay.classList.remove("is-enter");
  overlay.classList.add("is-leave");
  await sleep(500);
  overlay.classList.add("hidden");
  overlay.classList.remove("is-leave");
  turnTransitionState.isActive = false;
  turnTransitionState.activeType = null;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/battle-turn-transition.test.cjs`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/battle-turn-transition.test.cjs prototypes/battle-demo/index.html
git commit -m "feat: add battle turn transition overlay"
```

### Task 2: Wire The Transition Into Turn Flow And Block Inputs During Playback

**Files:**
- Modify: `prototypes/battle-demo/index.html`
- Modify: `tests/battle-turn-transition.test.cjs`

**Interfaces:**
- Consumes:
  - `async function playTurnTransition(type)`
  - `function isBattleInteractionLocked()`
  - existing turn-flow functions:
    - `function beginBattle()`
    - `async function runNpcAllyTurn()`
    - `async function runEnemyTurn()`
  - existing handlers:
    - `document.getElementById('btn-end-turn').addEventListener('click', async () => { ... })`
- Produces:
  - `async function beginBattle()`
  - guarded click/action handlers that early-return while transition is active
  - ally/enemy/player handoff order that always awaits the transition first

- [ ] **Step 1: Extend the failing test**

Append these tests to `tests/battle-turn-transition.test.cjs`:

```js
test("battle beginBattle awaits the player transition before returning control to the player", () => {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  assert.match(
    source,
    /async function beginBattle\(\)[\s\S]*await playTurnTransition\("player"\)/,
  );
});

test("battle end-turn flow plays the ally transition before running ally AI and the enemy transition before enemy AI", () => {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  assert.match(
    source,
    /btn-end-turn'?\)\.addEventListener\('click', async \(\) => \{[\s\S]*await playTurnTransition\("ally"\)[\s\S]*await runNpcAllyTurn\(\)/,
  );
  assert.match(
    source,
    /async function runNpcAllyTurn\(\)[\s\S]*await playTurnTransition\("enemy"\)[\s\S]*await runEnemyTurn\(\)/,
  );
});

test("battle enemy turn returns control only after the next player transition finishes", () => {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  assert.match(
    source,
    /async function runEnemyTurn\(\)[\s\S]*await playTurnTransition\("player"\)[\s\S]*turn = 'player'[\s\S]*resetPlayerTurn\(\)/,
  );
});

test("battle UI and action handlers check the shared interaction lock while turn transition is active", () => {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  assert.match(source, /btnEnd\.disabled = turn !== 'player' \|\| isBattleInteractionLocked\(\)/);
  assert.match(source, /if \(isBattleInteractionLocked\(\)\) return;/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/battle-turn-transition.test.cjs`

Expected: FAIL because `beginBattle`, end-turn flow, or `runEnemyTurn` do not yet await the new transition API and `updateUI()` does not yet disable controls through the shared lock helper

- [ ] **Step 3: Write minimal implementation**

Convert `beginBattle` to async, await the transition at each handoff, and guard all user-entry handlers that can start actions during the transition.

```js
async function beginBattle() {
  hideObjectiveIntro();
  phase = "battle";
  turn = "player";
  battleRecap = [];
  resetPlayerTurn();
  BattleTutorialManager.applyLessonTags(battleConfig.lessonTags);
  if (isSupplyTransportBattle()) BattleTutorialManager.maybeShow("lesson_supply_transport");
  log(`战斗开始：${battleObjective.friendlyTitle}`, "system");
  log("——我方回合——", "system");
  updateUI();
  await playTurnTransition("player");
  updateUI();
}

async function runNpcAllyTurn() {
  const allies = units.filter((u) => u.side === "player" && u.controller === "npc" && u.soldiers > 0 && !isRout(u));
  if (!allies.length) {
    await playTurnTransition("enemy");
    return runEnemyTurn();
  }
  log("——友军行动——", "system");
  // existing ally loop remains
  if (checkVictory()) return true;
  await playTurnTransition("enemy");
  return runEnemyTurn();
}

async function runEnemyTurn() {
  turn = "enemy";
  updateUI();
  log("——敌方回合——", "system");
  // existing enemy loop remains
  if (checkVictory()) return;
  await playTurnTransition("player");
  turn = "player";
  resetPlayerTurn();
  log("——我方回合——", "system");
  updateUI();
}

document.getElementById("btn-end-turn").addEventListener("click", async () => {
  if (isBattleInteractionLocked()) return;
  if (turn !== "player") return;
  processCaptureProgress();
  if (processSupplyCartMoves()) return;
  processRout();
  if (checkVictory()) return;
  await playTurnTransition("ally");
  if (await runNpcAllyTurn()) return;
});

function updateUI() {
  // existing setup...
  btnEnd.disabled = turn !== "player" || isBattleInteractionLocked();
  btnWait.disabled = turn !== "player" || !selectedUnit || isBattleInteractionLocked();
}
```

Also add `if (isBattleInteractionLocked()) return;` guards to the board/action handlers that currently begin player actions, including:

- unit selection / board click path
- `action-attack`
- `action-rally`
- `action-wait`
- right-click undo path if it changes battle state

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/battle-turn-transition.test.cjs`

Expected: PASS

- [ ] **Step 5: Run focused regression checks**

Run: `node --test tests/battle-turn-transition.test.cjs tests/battle-fps-display.test.cjs tests/battle-swordsman-attack-variants.test.cjs`

Expected: PASS for all listed files

- [ ] **Step 6: Commit**

```bash
git add tests/battle-turn-transition.test.cjs prototypes/battle-demo/index.html
git commit -m "feat: gate battle turns behind transition intros"
```

## Self-Review

- Spec coverage: this plan covers the dedicated overlay layer, fixed copy mapping, exact timing, battle-only scope, trigger points for player/ally/enemy handoffs, and interaction locking.
- Placeholder scan: no `TODO`/`TBD` placeholders remain; each task names concrete files, code, and commands.
- Type consistency: the same helper names are used throughout the plan: `getTurnTransitionContent(type)`, `isBattleInteractionLocked()`, and `playTurnTransition(type)`.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-22-battle-turn-transition.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
