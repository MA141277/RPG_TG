const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

function extractFunctionBody(source, signature) {
  const start = source.indexOf(signature);
  if (start === -1) {
    throw new Error(`Missing signature: ${signature}`);
  }
  const bodyStart = source.indexOf("{", start + signature.length);
  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return source.slice(bodyStart + 1, index);
      }
    }
  }
  throw new Error(`Unclosed function body for: ${signature}`);
}

function loadBattleOverlayFns(options = {}) {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  const normalizeBattleActiveSlotKeysBody = extractFunctionBody(
    source,
    "function normalizeBattleActiveSlotKeys(active, sideKey, fieldPrefix)",
  );
  const buildBattleFormationSideStateBody = extractFunctionBody(
    source,
    "function buildBattleFormationSideState(snapshotBefore, snapshotAfter, active = {})",
  );
  const buildBattleOverlayRenderStateBody = extractFunctionBody(
    source,
    "function buildBattleOverlayRenderState(report, attackerSnapshot, defenderSnapshot, active = {})",
  );
  const FORMATION_SLOT_KEYS = [
    "front-left", "front-center", "front-right",
    "middle-left", "middle-center", "middle-right",
    "rear-left", "rear-center", "rear-right",
  ];
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const TROOP_TYPES = {
    infantry: { label: "步兵" },
    archer: { label: "弓兵" },
  };
  const normalizeBattleActiveSlotKeys = new Function(
    `return function normalizeBattleActiveSlotKeys(active, sideKey, fieldPrefix) {${normalizeBattleActiveSlotKeysBody}};`,
  )();
  const buildBattleFormationSideState = new Function(
    "FORMATION_SLOT_KEYS",
    "normalizeBattleActiveSlotKeys",
    "clamp",
    `return function buildBattleFormationSideState(snapshotBefore, snapshotAfter, active = {}) {${buildBattleFormationSideStateBody}};`,
  )(FORMATION_SLOT_KEYS, normalizeBattleActiveSlotKeys, clamp);
  const buildBattleOverlayRenderState = new Function(
    "buildBattleFormationSideState",
    `return function buildBattleOverlayRenderState(report, attackerSnapshot, defenderSnapshot, active = {}) {${buildBattleOverlayRenderStateBody}};`,
  )(buildBattleFormationSideState);
  if (!options.includeCommitFns && !options.includeOverlayCommitFns) {
    return { buildBattleFormationSideState, buildBattleOverlayRenderState };
  }
  const commitBattleFormationSlotBody = extractFunctionBody(
    source,
    "function commitBattleFormationSlot(entry, slotState, side)",
  );
  const commitBattleFormationViewBody = extractFunctionBody(
    source,
    "function commitBattleFormationView(view, sideState)",
  );
  const commitBattleFormationSlot = new Function(
    "TROOP_TYPES",
    "configureBattleSpineCanvasMetrics",
    `return function commitBattleFormationSlot(entry, slotState, side) {${commitBattleFormationSlotBody}};`,
  )(TROOP_TYPES, () => {});
  const commitBattleFormationView = new Function(
    "FORMATION_SLOT_KEYS",
    "commitBattleFormationSlot",
    `return function commitBattleFormationView(view, sideState) {${commitBattleFormationViewBody}};`,
  )(FORMATION_SLOT_KEYS, commitBattleFormationSlot);
  if (!options.includeOverlayCommitFns) {
    return { buildBattleFormationSideState, buildBattleOverlayRenderState, commitBattleFormationSlot, commitBattleFormationView };
  }
  const shouldSkipBattleOverlayCommitBody = extractFunctionBody(
    source,
    "function shouldSkipBattleOverlayCommit(nextState)",
  );
  const commitBattleOverlayRenderStateBody = extractFunctionBody(
    source,
    "function commitBattleOverlayRenderState(renderState)",
  );
  const battleFormationViewState = {
    attacker: { id: "attacker-view" },
    defender: { id: "defender-view" },
    attackerMoraleBar: { style: {} },
    defenderMoraleBar: { style: {} },
    lastCommittedRenderState: null,
  };
  const shouldSkipBattleOverlayCommit = new Function(
    "battleFormationViewState",
    `return function shouldSkipBattleOverlayCommit(nextState) {${shouldSkipBattleOverlayCommitBody}};`,
  )(battleFormationViewState);
  const commitBattleOverlayRenderState = new Function(
    "battleFormationViewState",
    "commitBattleFormationView",
    "shouldSkipBattleOverlayCommit",
    "clamp",
    `return function commitBattleOverlayRenderState(renderState) {${commitBattleOverlayRenderStateBody}};`,
  )(battleFormationViewState, commitBattleFormationView, shouldSkipBattleOverlayCommit, clamp);
  return {
    buildBattleFormationSideState,
    buildBattleOverlayRenderState,
    commitBattleFormationSlot,
    commitBattleFormationView,
    shouldSkipBattleOverlayCommit,
    commitBattleOverlayRenderState,
    battleFormationViewState,
  };
}

function defineTrackedProperty(target, key, initialValue, writes, label) {
  let value = initialValue;
  Object.defineProperty(target, key, {
    configurable: true,
    enumerable: true,
    get() {
      return value;
    },
    set(nextValue) {
      value = nextValue;
      writes.push(`${label} = ${String(nextValue)}`);
    },
  });
}

function createTrackedDataset(writes, label) {
  const values = {};
  return new Proxy(values, {
    set(target, prop, value) {
      target[prop] = value;
      writes.push(`${label}.${String(prop)} = ${String(value)}`);
      return true;
    },
    get(target, prop) {
      return target[prop];
    },
  });
}

function createTrackedClassList(writes, label) {
  const values = new Map();
  return {
    toggle(name, enabled) {
      values.set(name, Boolean(enabled));
      writes.push(`${label}.toggle ${name} ${Boolean(enabled)}`);
    },
  };
}

function createBattleOverlayTestEntry(writes) {
  const slot = {
    classList: createTrackedClassList(writes, "slot.classList"),
    dataset: createTrackedDataset(writes, "slot.dataset"),
  };
  const canvas = {
    dataset: createTrackedDataset(writes, "canvas.dataset"),
  };
  const memberName = {};
  defineTrackedProperty(memberName, "textContent", "", writes, "memberName.textContent");
  const memberHpFillStyle = {};
  defineTrackedProperty(memberHpFillStyle, "width", "", writes, "memberHpFill.style.width");
  const memberHpFill = { style: memberHpFillStyle };
  const memberLoss = {};
  defineTrackedProperty(memberLoss, "hidden", true, writes, "memberLoss.hidden");
  defineTrackedProperty(memberLoss, "textContent", "", writes, "memberLoss.textContent");
  return {
    slot,
    canvas,
    memberName,
    memberHpFill,
    memberLoss,
  };
}

function createBattleOverlayTestView(writes) {
  return {
    slots: new Map([
      ["front-left", createBattleOverlayTestEntry(writes)],
      ["rear-right", createBattleOverlayTestEntry(writes)],
    ]),
  };
}

function createBattleOverlaySideState(overrides = {}) {
  const slots = new Map();
  const slotKey = overrides.slotKey || "front-left";
  const current = overrides.troopType
    ? {
        troopType: overrides.troopType,
        soldiers: overrides.soldiers ?? 0,
        maxSoldiers: overrides.maxSoldiers ?? 100,
      }
    : null;
  slots.set(slotKey, {
    before: overrides.beforeSoldiers == null ? current : { ...current, soldiers: overrides.beforeSoldiers },
    after: current,
    current,
    loss: overrides.beforeSoldiers == null ? 0 : Math.max(0, overrides.beforeSoldiers - (overrides.soldiers ?? 0)),
    hpRatio: overrides.maxSoldiers ? ((overrides.soldiers ?? 0) / overrides.maxSoldiers) * 100 : 0,
    isSource: Boolean(overrides.isSource),
    isTarget: Boolean(overrides.isTarget),
  });
  slots.set("rear-right", {
    before: null,
    after: null,
    current: null,
    loss: 0,
    hpRatio: 0,
    isSource: false,
    isTarget: false,
  });
  return {
    side: overrides.side || "player",
    morale: overrides.morale ?? 100,
    slots,
  };
}

function createBattleOverlayRenderStateFixture(overrides = {}) {
  return {
    left: createBattleOverlaySideState({
      side: "player",
      morale: overrides.leftMorale ?? 82,
      slotKey: "front-left",
      troopType: "infantry",
      soldiers: overrides.leftSoldiers ?? 90,
      maxSoldiers: 100,
      isSource: true,
    }),
    right: createBattleOverlaySideState({
      side: "enemy",
      morale: overrides.rightMorale ?? 71,
      slotKey: "front-left",
      troopType: "archer",
      soldiers: overrides.rightSoldiers ?? 65,
      maxSoldiers: 100,
      isTarget: true,
    }),
  };
}

test("battle overlay render state maps attacker and defender sides once and carries active-slot markers", () => {
  const { buildBattleOverlayRenderState } = loadBattleOverlayFns();
  const report = {
    attackerBefore: {
      side: "player",
      morale: 82,
      formationMembers: [{ slotKey: "front-left", troopType: "infantry", soldiers: 90, maxSoldiers: 100 }],
    },
    defenderBefore: {
      side: "enemy",
      morale: 71,
      formationMembers: [{ slotKey: "front-left", troopType: "archer", soldiers: 65, maxSoldiers: 100 }],
    },
  };

  const renderState = buildBattleOverlayRenderState(
    report,
    report.attackerBefore,
    report.defenderBefore,
    {
      sources: [{ side: "player", slotKey: "front-left" }],
      targets: [{ side: "enemy", slotKey: "front-left" }],
    },
  );

  assert.equal(renderState.left.side, "player");
  assert.equal(renderState.right.side, "enemy");
  assert.deepEqual([...renderState.left.activeSourceSlots], ["front-left"]);
  assert.deepEqual([...renderState.right.activeTargetSlots], ["front-left"]);
});

test("battle overlay side state computes slot loss and hp ratio without mutating unrelated slots", () => {
  const { buildBattleFormationSideState } = loadBattleOverlayFns();
  const sideState = buildBattleFormationSideState(
    {
      side: "player",
      formationMembers: [{ slotKey: "front-left", troopType: "infantry", soldiers: 100, maxSoldiers: 100 }],
    },
    {
      side: "player",
      formationMembers: [{ slotKey: "front-left", troopType: "infantry", soldiers: 72, maxSoldiers: 100 }],
    },
    {
      sources: [{ side: "player", slotKey: "front-left" }],
    },
  );

  assert.equal(sideState.side, "player");
  assert.equal(sideState.slots.get("front-left").loss, 28);
  assert.equal(sideState.slots.get("front-left").hpRatio, 72);
  assert.equal(sideState.slots.get("rear-right").current, null);
});

test("battle overlay view commits skip unchanged slot writes after the first pass", () => {
  const { commitBattleFormationView } = loadBattleOverlayFns({ includeCommitFns: true });
  const writes = [];
  const view = createBattleOverlayTestView(writes);
  const sideState = createBattleOverlaySideState({
    side: "player",
    slotKey: "front-left",
    troopType: "infantry",
    soldiers: 90,
    maxSoldiers: 100,
  });

  commitBattleFormationView(view, sideState);
  const firstPassWrites = writes.length;
  commitBattleFormationView(view, sideState);

  assert.ok(firstPassWrites > 0);
  assert.equal(writes.length, firstPassWrites);
});

test("battle overlay view still commits changed loss text and hp width on later passes", () => {
  const { commitBattleFormationView } = loadBattleOverlayFns({ includeCommitFns: true });
  const writes = [];
  const view = createBattleOverlayTestView(writes);

  commitBattleFormationView(view, createBattleOverlaySideState({
    side: "player",
    slotKey: "front-left",
    troopType: "infantry",
    soldiers: 90,
    maxSoldiers: 100,
  }));
  commitBattleFormationView(view, createBattleOverlaySideState({
    side: "player",
    slotKey: "front-left",
    troopType: "infantry",
    soldiers: 75,
    maxSoldiers: 100,
    beforeSoldiers: 90,
  }));

  assert.match(writes.join("\n"), /memberLoss\.textContent = -15/);
  assert.match(writes.join("\n"), /memberHpFill\.style\.width = 75%/);
});

test("battle overlay duplicate render state suppresses repeated overlay commits", () => {
  const {
    commitBattleOverlayRenderState,
    battleFormationViewState,
  } = loadBattleOverlayFns({ includeOverlayCommitFns: true });
  const writes = [];
  defineTrackedProperty(battleFormationViewState.attackerMoraleBar.style, "width", "", writes, "battle-attacker-morale.style.width");
  defineTrackedProperty(battleFormationViewState.defenderMoraleBar.style, "width", "", writes, "battle-defender-morale.style.width");

  const renderState = createBattleOverlayRenderStateFixture();
  commitBattleOverlayRenderState(renderState);
  const firstPassWrites = writes.length;
  commitBattleOverlayRenderState(renderState);

  assert.ok(firstPassWrites > 0);
  assert.equal(writes.length, firstPassWrites);
});

test("battle overlay changed morale still updates attacker and defender bars", () => {
  const {
    commitBattleOverlayRenderState,
    battleFormationViewState,
  } = loadBattleOverlayFns({ includeOverlayCommitFns: true });
  const writes = [];
  defineTrackedProperty(battleFormationViewState.attackerMoraleBar.style, "width", "", writes, "battle-attacker-morale.style.width");
  defineTrackedProperty(battleFormationViewState.defenderMoraleBar.style, "width", "", writes, "battle-defender-morale.style.width");

  commitBattleOverlayRenderState(createBattleOverlayRenderStateFixture({ leftMorale: 82, rightMorale: 71 }));
  commitBattleOverlayRenderState(createBattleOverlayRenderStateFixture({ leftMorale: 64, rightMorale: 58 }));

  assert.match(writes.join("\n"), /battle-attacker-morale\.style\.width = 64%/);
  assert.match(writes.join("\n"), /battle-defender-morale\.style\.width = 58%/);
});
