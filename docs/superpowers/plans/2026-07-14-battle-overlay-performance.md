# Battle Overlay Performance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve frame rate during the full-screen formation battle presentation by reusing the overlay view structure, applying slot-level incremental updates, and suppressing redundant UI commits without changing any visible battle behavior.

**Architecture:** Keep the work scoped to `prototypes/battle-demo/index.html`, but split the hot overlay path into three layers: render-state assembly, slot/view commit helpers, and an overlay-level duplicate-commit guard. The overlay DOM skeleton remains initialized once through the existing formation-view bootstrap, while each playback update computes a normalized render state and only writes changed slot or summary fields back into the cached view handles.

**Tech Stack:** Static HTML with inline vanilla JavaScript in `prototypes/battle-demo/index.html`, Node `node:test` regression coverage in `tests/*.test.cjs`, PowerShell command execution, and the bundled Node runtime at `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe` for tests and `tools/lint-superpowers-plans.mjs`.

## Global Constraints

- Optimize only the full-screen battle overlay presentation path.
- Do not modify `renderBoard()` or the isometric board flow.
- Do not change battle rules, targeting, damage, morale, timing logic, Spine project assets, action data, or effect trigger frames.
- Do not introduce visual downgrades, effect removal, frame-rate caps, playback throttling, or frame skipping in this batch.
- Preserve white flash, model shake, damage numbers, active-slot highlighting, attack timing, impact timing, and return behavior exactly as before.
- Add regression coverage that proves structure reuse / duplicate-update suppression without changing battle outcomes.

## Execution State

- Status: `waiting`
- Last Updated: `2026-07-14`
- Current Focus: `Plan authored from the approved full-screen battle overlay performance spec; implementation has not started.`
- Next Step: `Choose an execution mode, then start Task 1 with the new overlay regression harness.`
- Verification: `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs PASS`
- Notes: `This plan intentionally excludes any scheduler-level throttling or repeated-frame suppression beyond duplicate DOM commits for identical overlay state.`

## Progress Log

- 2026-07-14
  - Summary: `Created the implementation plan for the approved battle overlay performance optimization work.`
  - Verification: `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs PASS`
  - Next: `Choose Subagent-Driven or Inline execution before touching battle overlay code.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-13-battle-overlay-performance-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `renderBattleAnimationState()` still calls `updateBattleFormationView()` for both sides on every overlay submission.
  - `updateBattleFormationView()` still rewrites class state, datasets, canvas metrics, label text, HP width, and loss text for every slot on every call.
  - `ensureBattleFormationViews()` already initializes and caches `view.slots`, so the optimization should build on that existing stable view bootstrap instead of replacing it.
  - No dedicated overlay-performance regression file exists yet; current battle tests cover bounds, landing offsets, archer effects, and swordsman attack variants only.

## Implementation Scope

### In Scope

- Add a dedicated regression file for battle overlay structure reuse and duplicate-commit behavior.
- Introduce normalized overlay render-state helpers inside `prototypes/battle-demo/index.html`.
- Convert battle overlay slot updates from unconditional writes to slot-level incremental commits against cached last-committed state.
- Cache overlay summary references and suppress repeated identical morale-bar / side-view commits.
- Keep transient effects on the forced-update path so they still render when effect state changes.

### Still Out Of Scope

- Any changes to battlefield AI, animation choice logic, pathing, board rendering, or battle report generation.
- Any new UI controls, debug panels, or performance mode toggles.
- Any throttled idle-loop changes or requestAnimationFrame scheduling changes.

## File Map

### Existing files to modify

- `prototypes/battle-demo/index.html`
  - Add overlay render-state helpers, cached summary refs, slot-level commit helpers, and duplicate-commit guards in the full-screen battle overlay path.
- `tests/battle-swordsman-attack-variants.test.cjs`
  - Keep as a regression rerun target because the same file is being edited and attack-plan behavior must remain unchanged.
- `tests/battle-spine-bounds.test.cjs`
  - Keep as a regression rerun target because the same battle runtime renderer stays in scope.
- `tests/battle-landing-offset.test.cjs`
  - Keep as a regression rerun target because melee overlay landing visuals must remain unchanged.

### New files to create

- `tests/battle-overlay-performance.test.cjs`
  - Add focused regression coverage for overlay state assembly, slot commit reuse, and duplicate-commit suppression.

## Verification Plan

- Targeted verification:
  - `tests/battle-overlay-performance.test.cjs`
  - `tests/battle-swordsman-attack-variants.test.cjs`
  - `tests/battle-spine-bounds.test.cjs`
  - `tests/battle-landing-offset.test.cjs`
- Required commands:
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\battle-overlay-performance.test.cjs`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\battle-swordsman-attack-variants.test.cjs`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\battle-spine-bounds.test.cjs`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\battle-landing-offset.test.cjs`

## Task 1: Add Overlay Render-State Regression Coverage

**Files:**
- Create: `tests/battle-overlay-performance.test.cjs`
- Modify: `prototypes/battle-demo/index.html`
- Read: `docs/superpowers/specs/2026-07-13-battle-overlay-performance-design.md`

**Interfaces:**
- Consumes:
  - `function renderBattleAnimationState(report, attackerSnapshot, defenderSnapshot, active = {})`
  - `function updateBattleFormationView(view, snapshotBefore, snapshotAfter, active = {})`
  - `function normalizeBattleActiveSlotKeys(active, sideKey, fieldPrefix)`
- Produces:
  - `function buildBattleOverlayRenderState(report, attackerSnapshot, defenderSnapshot, active = {})`
  - `function buildBattleFormationSideState(snapshotBefore, snapshotAfter, active = {})`
  - A dedicated regression file that can evaluate overlay state creation without DOM bootstrapping the whole prototype.

- [ ] **Step 1: Write the failing test**

Create `tests/battle-overlay-performance.test.cjs` with state-assembly expectations:

```js
test("battle overlay render state maps attacker/defender sides once and carries active-slot markers", () => {
  const { buildBattleOverlayRenderState } = loadBattleOverlayFns();
  const report = {
    attackerBefore: { side: "player", morale: 82, formationMembers: [{ slotKey: "front-left", troopType: "infantry", soldiers: 90, maxSoldiers: 100 }] },
    defenderBefore: { side: "enemy", morale: 71, formationMembers: [{ slotKey: "front-left", troopType: "archer", soldiers: 65, maxSoldiers: 100 }] },
  };
  const renderState = buildBattleOverlayRenderState(
    report,
    report.attackerBefore,
    report.defenderBefore,
    { sources: [{ side: "player", slotKey: "front-left" }], targets: [{ side: "enemy", slotKey: "front-left" }] }
  );

  assert.equal(renderState.left.side, "player");
  assert.equal(renderState.right.side, "enemy");
  assert.deepEqual([...renderState.left.activeSourceSlots], ["front-left"]);
  assert.deepEqual([...renderState.right.activeTargetSlots], ["front-left"]);
});

test("battle overlay side state computes slot loss and hp ratio without touching unrelated slots", () => {
  const { buildBattleFormationSideState } = loadBattleOverlayFns();
  const sideState = buildBattleFormationSideState(
    { side: "player", formationMembers: [{ slotKey: "front-left", troopType: "infantry", soldiers: 100, maxSoldiers: 100 }] },
    { side: "player", formationMembers: [{ slotKey: "front-left", troopType: "infantry", soldiers: 72, maxSoldiers: 100 }] },
    { sources: [{ side: "player", slotKey: "front-left" }] }
  );

  assert.equal(sideState.side, "player");
  assert.equal(sideState.slots.get("front-left").loss, 28);
  assert.equal(sideState.slots.get("front-left").hpRatio, 72);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\battle-overlay-performance.test.cjs
```

Expected:

- `FAIL`
- Missing `buildBattleOverlayRenderState`
- Missing `buildBattleFormationSideState`

- [ ] **Step 3: Write minimal implementation**

Add the new state-assembly helpers above `renderBattleAnimationState()`:

```js
function buildBattleFormationSideState(snapshotBefore, snapshotAfter, active = {}) {
  const beforeBySlot = new Map((snapshotBefore?.formationMembers || []).map(member => [member.slotKey, member]));
  const afterBySlot = new Map((snapshotAfter?.formationMembers || []).map(member => [member.slotKey, member]));
  const sideKey = snapshotAfter?.side || snapshotBefore?.side || "";
  const activeSourceSlots = normalizeBattleActiveSlotKeys(active, sideKey, "source");
  const activeTargetSlots = normalizeBattleActiveSlotKeys(active, sideKey, "target");
  const slots = new Map();
  for (const slotKey of FORMATION_SLOT_KEYS) {
    const before = beforeBySlot.get(slotKey) || null;
    const after = afterBySlot.get(slotKey) || null;
    const current = after || before || null;
    const loss = before && after ? before.soldiers - after.soldiers : 0;
    const hpRatio = current && current.maxSoldiers > 0 ? clamp(((after ? after.soldiers : 0) / current.maxSoldiers) * 100, 0, 100) : 0;
    slots.set(slotKey, { before, after, current, loss, hpRatio, isSource: activeSourceSlots.has(slotKey), isTarget: activeTargetSlots.has(slotKey) });
  }
  return { side: sideKey, slots };
}

function buildBattleOverlayRenderState(report, attackerSnapshot, defenderSnapshot, active = {}) {
  const leftKey = report.attackerBefore.side === "player" ? "attacker" : "defender";
  const rightKey = leftKey === "attacker" ? "defender" : "attacker";
  const beforeByKey = { attacker: report.attackerBefore, defender: report.defenderBefore };
  const snapshotByKey = { attacker: attackerSnapshot, defender: defenderSnapshot };
  return {
    left: buildBattleFormationSideState(beforeByKey[leftKey], snapshotByKey[leftKey], active),
    right: buildBattleFormationSideState(beforeByKey[rightKey], snapshotByKey[rightKey], active),
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\battle-overlay-performance.test.cjs
```

Expected:

- `PASS` for the state-assembly tests

- [ ] **Step 5: Commit**

```bash
git add tests/battle-overlay-performance.test.cjs prototypes/battle-demo/index.html
git commit -m "test: add battle overlay performance regressions"
```

## Task 2: Reuse Slot Nodes And Apply Incremental Side Commits

**Files:**
- Modify: `prototypes/battle-demo/index.html`
- Modify: `tests/battle-overlay-performance.test.cjs`

**Interfaces:**
- Consumes:
  - `ensureBattleFormationViews(): void`
  - `buildBattleOverlayRenderState(report, attackerSnapshot, defenderSnapshot, active = {})`
  - Existing `view.slots: Map<string, { slot, frame, canvas, memberName, memberHpFill, memberLoss }>`
- Produces:
  - `commitBattleFormationSlot(entry, slotState, side): void`
  - `commitBattleFormationView(view, sideState): void`
  - `view.lastCommittedSlots: Map<string, object>`

- [ ] **Step 1: Write the failing test**

Extend `tests/battle-overlay-performance.test.cjs` with incremental-commit expectations:

```js
test("battle overlay view commits skip unchanged slot writes after the first pass", () => {
  const { commitBattleFormationView } = loadBattleOverlayFns();
  const writes = [];
  const view = createBattleOverlayTestView(writes);
  const sideState = createBattleOverlaySideState({ side: "player", slotKey: "front-left", troopType: "infantry", soldiers: 90, maxSoldiers: 100 });

  commitBattleFormationView(view, sideState);
  const firstPassWrites = writes.length;
  commitBattleFormationView(view, sideState);

  assert.ok(firstPassWrites > 0);
  assert.equal(writes.length, firstPassWrites);
});

test("battle overlay view still commits changed loss text and hp width on later passes", () => {
  const { commitBattleFormationView } = loadBattleOverlayFns();
  const writes = [];
  const view = createBattleOverlayTestView(writes);

  commitBattleFormationView(view, createBattleOverlaySideState({ side: "player", slotKey: "front-left", troopType: "infantry", soldiers: 90, maxSoldiers: 100 }));
  commitBattleFormationView(view, createBattleOverlaySideState({ side: "player", slotKey: "front-left", troopType: "infantry", soldiers: 75, maxSoldiers: 100, beforeSoldiers: 90 }));

  assert.match(writes.join("\n"), /memberLoss.textContent = -15/);
  assert.match(writes.join("\n"), /memberHpFill.style.width = 75%/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\battle-overlay-performance.test.cjs
```

Expected:

- `FAIL`
- Missing `commitBattleFormationView`
- Repeated writes still observed for identical slot state

- [ ] **Step 3: Write minimal implementation**

Refactor `updateBattleFormationView()` into state commit helpers:

```js
function commitBattleFormationSlot(entry, slotState, side) {
  const previous = entry.__battleLastCommittedState || null;
  if (previous && JSON.stringify(previous) === JSON.stringify(slotState)) {
    return;
  }
  entry.slot.classList.toggle("empty", slotState.current == null);
  entry.slot.classList.toggle("fallen", Boolean(slotState.after && slotState.after.soldiers <= 0));
  entry.slot.classList.toggle("striker", slotState.isSource);
  entry.slot.classList.toggle("targeted", slotState.isTarget);
  entry.slot.dataset.troopType = slotState.current?.troopType || "";
  entry.canvas.dataset.action = "idle";
  entry.canvas.dataset.troopType = slotState.current?.troopType || "";
  entry.canvas.dataset.side = side;
  entry.memberName.textContent = slotState.current == null ? "" : TROOP_TYPES[slotState.current.troopType]?.label || slotState.current.troopType || "";
  entry.memberHpFill.style.width = `${slotState.hpRatio}%`;
  entry.memberLoss.hidden = !(slotState.loss > 0);
  entry.memberLoss.textContent = slotState.loss > 0 ? `-${slotState.loss}` : "";
  entry.__battleLastCommittedState = structuredClone(slotState);
}

function commitBattleFormationView(view, sideState) {
  for (const slotKey of FORMATION_SLOT_KEYS) {
    const entry = view.slots.get(slotKey);
    if (!entry) continue;
    commitBattleFormationSlot(entry, sideState.slots.get(slotKey), sideState.side);
  }
}
```

Then update `renderBattleAnimationState()` to call `buildBattleOverlayRenderState()` and `commitBattleFormationView()` instead of recomputing every slot inline.

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\battle-overlay-performance.test.cjs
```

Expected:

- `PASS` for the incremental slot-commit tests

- [ ] **Step 5: Commit**

```bash
git add tests/battle-overlay-performance.test.cjs prototypes/battle-demo/index.html
git commit -m "perf: reuse battle overlay slot commits"
```

## Task 3: Deduplicate Overlay Summary Commits And Run Full Overlay Verification

**Files:**
- Modify: `prototypes/battle-demo/index.html`
- Modify: `tests/battle-overlay-performance.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-14-battle-overlay-performance.md`

**Interfaces:**
- Consumes:
  - `buildBattleOverlayRenderState(report, attackerSnapshot, defenderSnapshot, active = {})`
  - `commitBattleFormationView(view, sideState): void`
- Produces:
  - `commitBattleOverlayRenderState(renderState): void`
  - `shouldSkipBattleOverlayCommit(nextState): boolean`
  - Updated plan execution state and verification log

- [ ] **Step 1: Write the failing test**

Add overlay-level duplicate-commit coverage:

```js
test("battle overlay duplicate render state suppresses summary-bar rewrites", () => {
  const { commitBattleOverlayRenderState } = loadBattleOverlayFns();
  const writes = [];
  const runtime = createBattleOverlayRuntime(writes);
  const renderState = createBattleOverlayRenderStateFixture();

  commitBattleOverlayRenderState.call(runtime, renderState);
  const firstPassWrites = writes.length;
  commitBattleOverlayRenderState.call(runtime, renderState);

  assert.ok(firstPassWrites > 0);
  assert.equal(writes.length, firstPassWrites);
});

test("battle overlay changed morale still updates attacker and defender bars", () => {
  const { commitBattleOverlayRenderState } = loadBattleOverlayFns();
  const writes = [];
  const runtime = createBattleOverlayRuntime(writes);

  commitBattleOverlayRenderState.call(runtime, createBattleOverlayRenderStateFixture({ leftMorale: 82, rightMorale: 71 }));
  commitBattleOverlayRenderState.call(runtime, createBattleOverlayRenderStateFixture({ leftMorale: 64, rightMorale: 58 }));

  assert.match(writes.join("\n"), /battle-attacker-morale.style.width = 64%/);
  assert.match(writes.join("\n"), /battle-defender-morale.style.width = 58%/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\battle-overlay-performance.test.cjs
```

Expected:

- `FAIL`
- Missing overlay-level duplicate-commit guard
- Repeated morale-bar writes still observed

- [ ] **Step 3: Write minimal implementation**

Add cached summary refs and an overlay commit guard:

```js
function shouldSkipBattleOverlayCommit(nextState) {
  const previous = battleFormationViewState.lastCommittedRenderState || null;
  if (!previous) return false;
  return JSON.stringify(previous) === JSON.stringify(nextState);
}

function commitBattleOverlayRenderState(renderState) {
  if (shouldSkipBattleOverlayCommit(renderState)) return;
  commitBattleFormationView(battleFormationViewState.attacker, renderState.left);
  commitBattleFormationView(battleFormationViewState.defender, renderState.right);
  battleFormationViewState.attackerMoraleBar.style.width = `${clamp(renderState.left.morale, 0, 100)}%`;
  battleFormationViewState.defenderMoraleBar.style.width = `${clamp(renderState.right.morale, 0, 100)}%`;
  battleFormationViewState.lastCommittedRenderState = structuredClone(renderState);
}

function renderBattleAnimationState(report, attackerSnapshot, defenderSnapshot, active = {}) {
  ensureBattleFormationViews();
  commitBattleOverlayRenderState(buildBattleOverlayRenderState(report, attackerSnapshot, defenderSnapshot, active));
}
```

Initialize `battleFormationViewState.attackerMoraleBar` / `defenderMoraleBar` once when the overlay view is first ensured.

- [ ] **Step 4: Run verification and sync plan state**

Run:

```bash
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\battle-overlay-performance.test.cjs
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\battle-swordsman-attack-variants.test.cjs
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\battle-spine-bounds.test.cjs
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\battle-landing-offset.test.cjs
```

Expected:

- `PASS` for all four test files

Then update this plan's `Execution State`, append a `Progress Log` entry with the verification command results, and set the next resume point.

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/plans/2026-07-14-battle-overlay-performance.md tests/battle-overlay-performance.test.cjs prototypes/battle-demo/index.html
git commit -m "perf: dedupe battle overlay render commits"
```

## Exit Check

- [ ] `Full-screen battle overlay reuses its stable structure during playback.`
- [ ] `Slot-level updates are incremental instead of unconditional full-slot rewrites.`
- [ ] `Redundant identical overlay commits are suppressed without changing visible battle behavior.`
- [ ] Project progress sync is updated if the child state changed.
- [ ] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded

## Child Closeout

- Closed Child: `Replace when closing.`
- Parent Task: `Replace when closing.`
- Parent Stage: `Replace when closing.`
- Closeout Status: `closed`
- Project Progress Synced: `yes/no`
- Next Child: `Replace when closing.`
- Next Child Status: `waiting/running/blocked/none`
- Next Required Action: `Replace when closing.`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `Replace when closing.`
- Push Status: `success/failure/not-pushed`
- Push Commit: `commit-sha-or-none`
- Resume From: `Replace when closing.`
