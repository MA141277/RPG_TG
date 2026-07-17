# Battle Formation Staggered Random Attack Order Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace deterministic same-side formation strike order with a randomized, cumulative-delay launch schedule inside the formation battle overlay while keeping battle resolution rules unchanged.

**Architecture:** Keep all work inside `prototypes/battle-demo/index.html`. Add one timeline-generation helper that builds a randomized no-repeat side-local strike schedule with `launchAtMs`, then replace the current same-side serial batch playback with a schedule-driven side-block player that launches per-strike animations at their assigned start times and advances overlay snapshots in resolved strike order.

**Tech Stack:** Battle demo HTML/JS runtime, Node `--test` extraction-style regression files, `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe`, `tools/lint-superpowers-plans.mjs`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-15`
- Current Focus: `Inline implementation and targeted verification are complete locally; waiting for user review of the new formation battle staggered random attack order behavior.`
- Next Step: `Review the local formation-battle overlay behavior, then decide whether to tune the schedule/playback further or prepare a clean commit.`
- Verification: `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs PASS; C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test tests\battle-formation-staggered-schedule.test.cjs tests\battle-formation-playback-schedule.test.cjs tests\battle-overlay-performance.test.cjs tests\battle-spine-animation-throttle.test.cjs tests\battle-spine-render-cache.test.cjs tests\battle-fps-display.test.cjs tests\battle-spine-bounds.test.cjs PASS.`
- Notes: `Scope is limited to formation battle overlay strike scheduling, not board-turn order.`

## Progress Log

- 2026-07-15
  - Summary: `Plan created from the approved battle formation staggered random attack order design.`
  - Verification: `Not run`
  - Next: `Choose Subagent-Driven or Inline execution before touching runtime files.`

- 2026-07-15
  - Summary: `Inline execution began. Task 1 is active and starts with a failing regression for randomized no-repeat same-side strike scheduling.`
  - Verification: `Not run`
  - Next: `Create tests/battle-formation-staggered-schedule.test.cjs and verify it fails before implementing the schedule helpers.`

- 2026-07-15
  - Summary: `Implemented randomized no-repeat same-side strike scheduling with cumulative launchAtMs, replaced same-side serial strike playback with scheduled launch playback, and added regression coverage for schedule generation and launch order.`
  - Verification: `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs PASS; C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test tests\battle-formation-staggered-schedule.test.cjs tests\battle-formation-playback-schedule.test.cjs tests\battle-overlay-performance.test.cjs tests\battle-spine-animation-throttle.test.cjs tests\battle-spine-render-cache.test.cjs tests\battle-fps-display.test.cjs tests\battle-spine-bounds.test.cjs PASS.`
  - Next: `Review the local battle overlay behavior and decide whether to keep the current staggered schedule or tune overlap timing further.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-15-battle-formation-staggered-random-attack-order-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `The user confirmed this change is only for formation battle overlay members, not board-turn unit order.`
  - `The approved delay range remains inclusive 200ms-400ms.`
  - `The approved side handoff remains strict: one side exhausts its attack pool before the other side starts.`

## Implementation Scope

### In Scope

- randomized no-repeat attacker selection within one side's ready-member pool
- cumulative side-local `launchAtMs` generation using `200ms-400ms` random delays
- schedule-driven overlay playback for same-side staggered strike launches
- preserving existing hit, miss, damage, morale, and target selection rules
- preserving current swordsman and archer strike visuals once each strike launches
- regression tests for schedule generation and scheduled playback handoff

### Still Out Of Scope

- board-turn sequencing on the main battlefield
- changes to `calcDamage`, `calculateMemberDamage`, `chooseFormationTarget`, or movement rules
- new UI controls for scheduler tuning
- Spine asset or animation authoring changes

## File Map

### Existing files to modify

- `prototypes/battle-demo/index.html`
  - Add randomized side schedule generation helpers, add a scheduled side-block overlay player, and replace the current same-side serial strike batch playback path.

### New files to create

- `tests/battle-formation-staggered-schedule.test.cjs`
  - Lock down no-repeat random attacker selection, cumulative `launchAtMs`, and side handoff ordering in timeline generation.
- `tests/battle-formation-playback-schedule.test.cjs`
  - Lock down schedule-driven side-block playback launch order and resolved snapshot progression.

## Verification Plan

- Targeted verification:
  - `Formation strike scheduling is random-without-replacement per side and uses cumulative 200ms-400ms launch delays.`
  - `Overlay playback launches same-side strikes by scheduled start time and advances to the defending side only after the current side block finishes.`
- Required commands:
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test tests\battle-formation-staggered-schedule.test.cjs`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test tests\battle-formation-playback-schedule.test.cjs`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test tests\battle-overlay-performance.test.cjs tests\battle-spine-animation-throttle.test.cjs tests\battle-spine-render-cache.test.cjs`

## Task 1: Generate Randomized Side Strike Schedules

**Files:**
- Modify: `prototypes/battle-demo/index.html`
- Create: `tests/battle-formation-staggered-schedule.test.cjs`

**Interfaces:**
- Consumes:
  - `getBattleReadyMembers(unit, distance) -> FormationMember[]`
  - `sortFormationMembersForBattleOrder(members) -> FormationMember[]`
  - `chooseFormationTarget(sourceUnit, member, targetUnit) -> FormationMember | null`
  - `calculateMemberDamage(sourceUnit, member, targetUnit, targetMember, distance, isCounter) -> { damage: number, typeAdv: number }`
  - `applyMemberDamage(targetUnit, targetMember, actualDamage) -> void`
  - `randInt(min, max) -> number`
- Produces:
  - `function pickRandomFormationMemberIndex(poolLength, randomValue) -> number`
  - `function buildScheduledFormationSideStrikes(sourceUnit, targetUnit, options) -> Array<BattleStrikeStep>`
  - `BattleStrikeStep.launchAtMs: number`
  - `BattleStrikeStep.nextDelayMs: number | null`

- [x] **Step 1: Write the failing schedule test**

Create `tests/battle-formation-staggered-schedule.test.cjs` with extraction-style coverage for schedule generation:

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

function loadScheduleFns() {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  const pickBody = extractFunctionBody(source, "function pickRandomFormationMemberIndex(poolLength, randomValue)");
  const buildBody = extractFunctionBody(source, "function buildScheduledFormationSideStrikes(sourceUnit, targetUnit, options = {})");
  const pickRandomFormationMemberIndex = new Function(
    `return function pickRandomFormationMemberIndex(poolLength, randomValue) {${pickBody}};`
  )();
  const buildScheduledFormationSideStrikes = new Function(
    "pickRandomFormationMemberIndex",
    "randInt",
    "sortFormationMembersForBattleOrder",
    "chooseFormationTarget",
    "calculateMemberDamage",
    "applyMemberDamage",
    `return function buildScheduledFormationSideStrikes(sourceUnit, targetUnit, options = {}) {${buildBody}};`
  )(
    pickRandomFormationMemberIndex,
    () => 300,
    (members) => members,
    (_sourceUnit, member, targetUnit) => targetUnit.formationMembers.find((target) => target.soldiers > 0) || null,
    () => ({ damage: 10, typeAdv: 1 }),
    (_targetUnit, targetMember, damage) => { targetMember.soldiers -= damage; }
  );
  return { pickRandomFormationMemberIndex, buildScheduledFormationSideStrikes };
}

test("formation side schedule uses random-without-replacement attacker order and cumulative launchAtMs", () => {
  const { buildScheduledFormationSideStrikes } = loadScheduleFns();
  const sourceUnit = {
    id: "attacker",
    soldiers: 300,
    formationMembers: [
      { slotKey: "front-left", troopType: "infantry", soldiers: 100, range: 1, status: "ready" },
      { slotKey: "front-center", troopType: "infantry", soldiers: 100, range: 1, status: "ready" },
      { slotKey: "front-right", troopType: "archer", soldiers: 100, range: 2, status: "ready" },
    ],
  };
  const targetUnit = {
    id: "defender",
    soldiers: 300,
    formationMembers: [
      { slotKey: "front-left", troopType: "infantry", soldiers: 100, range: 1, status: "ready" },
    ],
  };
  const randomValues = [0.8, 0.0, 0.0];
  const strikes = buildScheduledFormationSideStrikes(sourceUnit, targetUnit, {
    distance: 1,
    sourceSide: "attacker",
    targetSide: "defender",
    label: "攻方",
    isCounter: false,
    random: () => randomValues.shift(),
  });

  assert.deepEqual(strikes.map((step) => step.sourceSlotKey), ["front-right", "front-left", "front-center"]);
  assert.deepEqual(strikes.map((step) => step.launchAtMs), [0, 300, 600]);
  assert.equal(strikes[2].nextDelayMs, null);
});
```

- [x] **Step 2: Run the new test and verify it fails**

Run:

```bash
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test tests\battle-formation-staggered-schedule.test.cjs
```

Expected:

- `FAIL`
- missing `pickRandomFormationMemberIndex`
- missing `buildScheduledFormationSideStrikes`

- [x] **Step 3: Implement minimal randomized schedule generation**

In `prototypes/battle-demo/index.html`, add the helper signatures near the other formation-battle helpers and update `runSideRound(...)` to consume them:

```js
function pickRandomFormationMemberIndex(poolLength, randomValue = Math.random()) {
  if (!Number.isFinite(poolLength) || poolLength <= 0) return -1;
  const clamped = Math.max(0, Math.min(0.999999, Number(randomValue) || 0));
  return Math.floor(clamped * poolLength);
}

function buildScheduledFormationSideStrikes(sourceUnit, targetUnit, options = {}) {
  const {
    distance = 1,
    sourceSide = "attacker",
    targetSide = "defender",
    label = "",
    isCounter = false,
    random = Math.random,
  } = options;
  const readyPool = sortFormationMembersForBattleOrder(getBattleReadyMembers(sourceUnit, distance)).filter((member) => {
    if (!member || member.soldiers <= 0) return false;
    if (member.status === "stunned") return false;
    return !(distance > 1 && member.range < distance);
  });
  const strikes = [];
  let launchAtMs = 0;

  while (readyPool.length) {
    const nextIndex = pickRandomFormationMemberIndex(readyPool.length, random());
    const member = readyPool.splice(nextIndex, 1)[0];
    const targetMember = chooseFormationTarget(sourceUnit, member, targetUnit);
    if (!targetMember) continue;
    const nextDelayMs = readyPool.length ? randInt(200, 400) : null;
    strikes.push({
      type: "strike",
      className: "damage",
      text: `${label}${TROOP_TYPES[member.troopType].label}发起攻击`,
      sourceSide,
      targetSide,
      sourceSlotKey: member.slotKey,
      targetSlotKey: targetMember.slotKey,
      sourceTroopType: member.troopType,
      targetTroopType: targetMember.troopType,
      launchAtMs,
      nextDelayMs,
    });
    launchAtMs += nextDelayMs || 0;
  }

  return strikes;
}
```

Then adapt `runSideRound(...)` so it resolves hit/damage using the current existing combat path but pushes strike steps in the randomized schedule order with `launchAtMs` and `nextDelayMs`.

- [x] **Step 4: Re-run the schedule test and verify it passes**

Run:

```bash
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test tests\battle-formation-staggered-schedule.test.cjs
```

Expected:

- `PASS`
- no missing helper signatures
- launch times increase cumulatively by the random delay draws

- [x] **Step 5: Record progress state**

Update this plan file only:

- set `Execution State -> Status` to `running`
- set `Last Updated` to the current working date
- add a `Progress Log` entry describing that randomized same-side schedule generation and its regression test are complete

## Task 2: Replace Serial Same-Side Playback With Scheduled Launch Playback

**Files:**
- Modify: `prototypes/battle-demo/index.html`
- Create: `tests/battle-formation-playback-schedule.test.cjs`
- Read: `tests/battle-overlay-performance.test.cjs`

**Interfaces:**
- Consumes:
  - `function renderBattleAnimationState(report, attackerSnapshot, defenderSnapshot, active = {})`
  - `function appendBattleEvent(step) -> void`
  - `function sleep(ms) -> Promise<void>`
  - `function animateBattleSpineProxy(...) -> Promise<void>`
  - `function animateBattleSpineCanvas(...) -> Promise<void>`
- Produces:
  - `function playSingleFormationStrike(report, strike, state) -> Promise<void>`
  - `function playScheduledFormationSideBlock(report, strikes, state) -> Promise<void>`
  - updated `function playFormationBattleTimeline(report) -> Promise<void>`

- [x] **Step 1: Write the failing playback test**

Create `tests/battle-formation-playback-schedule.test.cjs` with schedule-order coverage:

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

function loadPlaybackFn() {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  const body = extractFunctionBody(source, "async function playScheduledFormationSideBlock(report, strikes, state)");
  return new Function(
    "sleep",
    "playSingleFormationStrike",
    `return async function playScheduledFormationSideBlock(report, strikes, state) {${body}};`
  );
}

test("scheduled side block launches strikes in launchAtMs order and waits for block completion before returning", async () => {
  const launches = [];
  const playScheduledFormationSideBlock = loadPlaybackFn()(
    async () => {},
    async (_report, strike) => {
      launches.push(strike.sourceSlotKey);
    }
  );

  await playScheduledFormationSideBlock({}, [
    { sourceSlotKey: "front-center", launchAtMs: 700 },
    { sourceSlotKey: "front-left", launchAtMs: 0 },
    { sourceSlotKey: "front-right", launchAtMs: 1400 },
  ], {});

  assert.deepEqual(launches, ["front-left", "front-center", "front-right"]);
});
```

- [x] **Step 2: Run the playback test and verify it fails**

Run:

```bash
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test tests\battle-formation-playback-schedule.test.cjs
```

Expected:

- `FAIL`
- missing `playScheduledFormationSideBlock`

- [x] **Step 3: Implement the scheduled playback helpers**

Refactor `playFormationBattleTimeline(report)` in `prototypes/battle-demo/index.html` so same-side strike groups are launched by schedule instead of serial batch order:

```js
async function playScheduledFormationSideBlock(report, strikes, state) {
  const ordered = [...strikes].sort((a, b) => a.launchAtMs - b.launchAtMs);
  const blockStartAt = performance.now();
  const running = ordered.map(async (strike) => {
    const waitMs = Math.max(0, strike.launchAtMs - (performance.now() - blockStartAt));
    if (waitMs > 0) await sleep(waitMs);
    await playSingleFormationStrike(report, strike, state);
  });
  await Promise.all(running);
}
```

Then:

- derive `playSingleFormationStrike(...)` from the current `playFormationStrikeBatch(...)` strike-level internals
- keep `attackerSnapshot` / `defenderSnapshot` advancement tied to resolved strike order, not DOM completion race order
- change `playFormationBattleTimeline(report)` so it:
  - still handles `round` and `entry` steps serially
  - groups contiguous same-side `strike` steps
  - calls `playScheduledFormationSideBlock(...)`
  - only switches to the next side block after the current block resolves

- [x] **Step 4: Run targeted playback and regression tests**

Run:

```bash
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test tests\battle-formation-playback-schedule.test.cjs
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test tests\battle-overlay-performance.test.cjs
```

Expected:

- `PASS` for scheduled playback order
- `PASS` for existing battle overlay performance/state tests

- [x] **Step 5: Sync plan state after playback integration**

Update this plan file:

- append a `Progress Log` entry summarizing scheduled same-side playback integration
- update `Verification` with the exact `node --test` commands and outcomes

## Task 3: Final Verification And Governance Sync

**Files:**
- Modify: `docs/superpowers/plans/2026-07-15-battle-formation-staggered-random-attack-order.md`
- Read: `docs/superpowers/project-progress.md`

**Interfaces:**
- Consumes:
  - `tests/battle-formation-staggered-schedule.test.cjs`
  - `tests/battle-formation-playback-schedule.test.cjs`
  - existing battle overlay regression tests
- Produces:
  - finalized `Execution State`
  - finalized `Progress Log`
  - recorded verification evidence

- [x] **Step 1: Run full targeted verification for this feature**

Run:

```bash
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test tests\battle-formation-staggered-schedule.test.cjs
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test tests\battle-formation-playback-schedule.test.cjs
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test tests\battle-overlay-performance.test.cjs tests\battle-spine-animation-throttle.test.cjs tests\battle-spine-render-cache.test.cjs
```

Expected:

- `PASS` for all listed test files
- `PASS` for `tools/lint-superpowers-plans.mjs`

- [x] **Step 2: Update governance state**

Update `Execution State` in this plan:

- `Status: completed-but-open`
- `Last Updated: 2026-07-15`
- `Current Focus: Local implementation and targeted verification complete; waiting for user review of staggered randomized formation attack order.`
- `Next Step: Review the local formation-battle overlay behavior and decide whether to keep iterating or prepare a clean commit.`

Update `Progress Log` with the exact verification command outputs.

- [x] **Step 3: Leave closeout intentionally open**

Do not fill `Child Closeout` yet. Leave the plan at `completed-but-open` until:

- the user reviews the local formation battle behavior
- any follow-up tuning is handled
- a later turn decides whether to commit/push

## Exit Check

- [x] `Formation battle timeline uses randomized no-repeat same-side attacker order.`
- [x] `Same-side launch timing uses cumulative 200ms-400ms delays from strike start frames.`
- [x] `Defending side begins only after the attacking side exhausts its scheduled strike block.`
- [ ] Project progress sync is updated if the child state changed.
- [ ] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Not closed yet.`
- Parent Task: `Not synced yet.`
- Parent Stage: `Not synced yet.`
- Closeout Status: `not-closed`
- Project Progress Synced: `no`
- Next Child: `Not chosen yet.`
- Next Child Status: `none`
- Next Required Action: `Review local formation-battle behavior before closeout.`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-15-battle-formation-staggered-random-attack-order.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Task 1, Step 1`
