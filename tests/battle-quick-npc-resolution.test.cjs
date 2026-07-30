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

function loadQuickBattleFns() {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  const isNonPlayerControlledUnitBody = extractFunctionBody(
    source,
    "function isNonPlayerControlledUnit(unit)",
  );
  const shouldUseQuickNpcBattleBody = extractFunctionBody(
    source,
    "function shouldUseQuickNpcBattle(attacker, defender)",
  );
  const isLockedBody = extractFunctionBody(
    source,
    "function isBattleInteractionLocked()",
  );
  const buildQuickBattleReportBody = extractFunctionBody(
    source,
    "function buildQuickBattleReport(report)",
  );
  const buildQuickBattleSideStateBody = extractFunctionBody(
    source,
    "function buildQuickBattleSideState(snapshotBefore, snapshotAfter)",
  );
  const getFormationCaptainMemberBody = extractFunctionBody(
    source,
    "function getFormationCaptainMember(unit)",
  );

  const isNonPlayerControlledUnit = new Function(
    `return function isNonPlayerControlledUnit(unit) {${isNonPlayerControlledUnitBody}};`,
  )();
  const shouldUseQuickNpcBattle = new Function(
    "isNonPlayerControlledUnit",
    `return function shouldUseQuickNpcBattle(attacker, defender) {${shouldUseQuickNpcBattleBody}};`,
  )(isNonPlayerControlledUnit);
  const turnTransitionState = { isActive: false };
  const quickBattleState = { isActive: false };
  const isBattleInteractionLocked = new Function(
    "turnTransitionState",
    "quickBattleState",
    `return function isBattleInteractionLocked() {${isLockedBody}};`,
  )(turnTransitionState, quickBattleState);
  const buildQuickBattleReport = new Function(
    "buildQuickBattleSideState",
    `return function buildQuickBattleReport(report) {${buildQuickBattleReportBody}};`,
  )((before) => ({
    ...before.__sideState,
  }));
  const getFormationCaptainMember = new Function(
    `return function getFormationCaptainMember(unit) {${getFormationCaptainMemberBody}};`,
  )();
  const buildQuickBattleSideState = new Function(
    "FORMATION_SLOT_KEYS",
    "getFormationCaptainMember",
    "getQuickBattleSideLabel",
    "getDefaultUnitFacing",
    "getFormationPanelDisplaySlotKeys",
    `return function buildQuickBattleSideState(snapshotBefore, snapshotAfter) {${buildQuickBattleSideStateBody}};`,
  )(
    [
      "front-left", "front-center", "front-right",
      "middle-left", "middle-center", "middle-right",
      "rear-left", "rear-center", "rear-right",
    ],
    getFormationCaptainMember,
    () => "label",
    () => "right",
    (side) =>
      side === "player"
        ? [
            "rear-left", "middle-left", "front-left",
            "rear-center", "middle-center", "front-center",
            "rear-right", "middle-right", "front-right",
          ]
        : [
            "front-right", "middle-right", "rear-right",
            "front-center", "middle-center", "rear-center",
            "front-left", "middle-left", "rear-left",
          ],
  );

  return {
    source,
    shouldUseQuickNpcBattle,
    turnTransitionState,
    quickBattleState,
    isBattleInteractionLocked,
    buildQuickBattleReport,
    getFormationCaptainMember,
    buildQuickBattleSideState,
  };
}

test("quick npc battle trigger only activates when both sides are non-player-controlled", () => {
  const { shouldUseQuickNpcBattle } = loadQuickBattleFns();

  assert.equal(
    shouldUseQuickNpcBattle(
      { side: "player", controller: "npc" },
      { side: "enemy", controller: "ai" },
    ),
    true,
  );
  assert.equal(
    shouldUseQuickNpcBattle(
      { side: "enemy", controller: "ai" },
      { side: "player", controller: "npc" },
    ),
    true,
  );
  assert.equal(
    shouldUseQuickNpcBattle(
      { side: "player", controller: "player" },
      { side: "enemy", controller: "ai" },
    ),
    false,
  );
});

test("quick npc battle declares a dedicated in-board overlay with side panels and result labels", () => {
  const { source } = loadQuickBattleFns();
  assert.match(source, /id="quick-battle-overlay"/);
  assert.match(source, /id="quick-battle-left-panel"/);
  assert.match(source, /id="quick-battle-right-panel"/);
  assert.match(source, /id="quick-battle-center-emblem"/);
  assert.match(source, /quick-battle-result/);
  assert.match(source, /\.quick-battle-overlay \{[\s\S]*right: 8px;[\s\S]*left: 8px;/);
  assert.match(source, /\.quick-battle-stage \{[\s\S]*width: 100%;/);
  assert.match(source, /\.quick-battle-stage \{[\s\S]*grid-template-columns: minmax\(0, 1fr\) 56px minmax\(0, 1fr\);/);
  assert.match(source, /sideLabel: snapshotAfter\?\.name \|\| snapshotBefore\?\.name \|\| getQuickBattleSideLabel\(snapshotAfter \|\| snapshotBefore\),/);
  assert.match(source, /const displaySlotKeys = getFormationPanelDisplaySlotKeys\(snapshotAfter\?\.side \|\| snapshotBefore\?\.side \|\| 'player'\);/);
});

test("quick npc battle portrait area reuses battle spine canvases and supports hit flash plus fallen freeze", () => {
  const { source } = loadQuickBattleFns();
  assert.match(source, /quick-battle-portrait-renderer/);
  assert.match(source, /\.quick-battle-portrait-renderer \{\s*[\s\S]*transform: translateX\(55px\);/);
  assert.match(source, /formation-spine-frame quick-battle-portrait-spine-frame/);
  assert.match(source, /createQuickBattlePortraitSpineEntry\(/);
  assert.match(source, /startBattleSpineIdleLoop\(\);/);
  assert.match(source, /syncBattleWhiteFlashOverlayCanvas\(portraitEntry\.canvas\);/);
  assert.match(source, /queueBattleWhiteFlash\(portraitEntry\.root,/);
  assert.match(source, /queueBattleModelShake\(portraitEntry\.root,/);
  assert.match(source, /portraitEntry\.canvas\.dataset\.freezeIdleFrame = impactClass === 'is-fallen' \? 'true' : 'false';/);
  assert.match(source, /const shouldPlayPortraitHit = settled && sideState\.soldiersLoss > 0;/);
  assert.match(source, /if \(shouldPlayPortraitHit\) \{/);
});

test("quick npc battle timing waits 0.7 second before settlement, animates losses for 0.5 second, then holds 1 second before exit", () => {
  const { source } = loadQuickBattleFns();
  assert.match(source, /\.quick-battle-morale-fill \{[\s\S]*background: linear-gradient\(90deg, #1780a5, #35d7ce\);/);
  assert.match(source, /const durationMs = 1000;/);
  assert.match(source, /\.quick-battle-slot-hp-row \{[\s\S]*grid-template-columns: 1fr;/);
  assert.match(source, /\.quick-battle-slot-hp-bar \{[\s\S]*display: block;[\s\S]*min-width: 64px;[\s\S]*width: 100%;[\s\S]*height: 10px;/);
  assert.match(
    source,
    /\.quick-battle-slot-hp-fill \{[\s\S]*background: linear-gradient\(90deg, #c9a227, #1b8d72\);[\s\S]*transition: width 1s ease;/,
  );
  assert.match(source, /\.quick-battle-morale-fill \{[\s\S]*transition: width 1s ease;/);
  assert.match(source, /function animateQuickBattleSlotHp\(slotHpText, fromValue, toValue\) \{/);
  assert.match(source, /animateQuickBattleSlotHp\(slotHpText, beforeSoldiers, activeSoldiers\);/);
  assert.match(
    source,
    /function showQuickBattleOverlay\(report\) \{[\s\S]*await sleep\(700\);[\s\S]*settleQuickBattleOverlay\(report\);[\s\S]*await sleep\(500\);[\s\S]*overlay\.classList\.add\('is-results-visible'\);[\s\S]*await sleep\(1000\);/,
  );
});

test("resolveAttack routes non-player-controlled battles into the quick overlay instead of the full formation overlay", () => {
  const { source } = loadQuickBattleFns();
  assert.match(
    source,
    /const useQuickNpcBattle = shouldUseQuickNpcBattle\(attacker, defender\);/,
  );
  assert.match(
    source,
    /return useQuickNpcBattle[\s\S]*\? showQuickBattleOverlay\(/,
  );
  assert.match(
    source,
    /: showFormationBattleOverlay\(/,
  );
});

test("battle interaction lock also stays active while the quick npc battle overlay is animating", () => {
  const {
    turnTransitionState,
    quickBattleState,
    isBattleInteractionLocked,
  } = loadQuickBattleFns();

  assert.equal(isBattleInteractionLocked(), false);
  turnTransitionState.isActive = true;
  assert.equal(isBattleInteractionLocked(), true);
  turnTransitionState.isActive = false;
  quickBattleState.isActive = true;
  assert.equal(isBattleInteractionLocked(), true);
});

test("quick npc battle result prioritizes wipeout first, then morale loss, then soldiers loss, otherwise draw", () => {
  const { buildQuickBattleReport, source } = loadQuickBattleFns();

  assert.match(
    source,
    /const leftRemainingSoldiers = left\.snapshotAfter\?\.soldiers \?\? 0;[\s\S]*const rightRemainingSoldiers = right\.snapshotAfter\?\.soldiers \?\? 0;[\s\S]*if \(leftRemainingSoldiers <= 0 && rightRemainingSoldiers > 0\) \{[\s\S]*rightResult = 'victory';/,
  );
  assert.match(
    source,
    /else if \(rightRemainingSoldiers <= 0 && leftRemainingSoldiers > 0\) \{[\s\S]*leftResult = 'victory';/,
  );

  const wipeoutReport = buildQuickBattleReport({
    attackerBefore: {
      side: "player",
      __sideState: {
        snapshotAfter: { soldiers: 0 },
        moraleLoss: 0,
        soldiersLoss: 0,
      },
    },
    attackerAfter: {},
    defenderBefore: {
      side: "enemy",
      __sideState: {
        snapshotAfter: { soldiers: 120 },
        moraleLoss: 20,
        soldiersLoss: 60,
      },
    },
    defenderAfter: {},
  });
  assert.equal(wipeoutReport.left.result, "");
  assert.equal(wipeoutReport.right.result, "victory");

  const moralePriorityReport = buildQuickBattleReport({
    attackerBefore: {
      side: "player",
      __sideState: {
        snapshotAfter: { soldiers: 100 },
        moraleLoss: 5,
        soldiersLoss: 40,
      },
    },
    attackerAfter: {},
    defenderBefore: {
      side: "enemy",
      __sideState: {
        snapshotAfter: { soldiers: 100 },
        moraleLoss: 8,
        soldiersLoss: 10,
      },
    },
    defenderAfter: {},
  });
  assert.equal(moralePriorityReport.left.result, "victory");
  assert.equal(moralePriorityReport.right.result, "");

  const soldiersTieBreakerReport = buildQuickBattleReport({
    attackerBefore: {
      side: "player",
      __sideState: {
        snapshotAfter: { soldiers: 100 },
        moraleLoss: 7,
        soldiersLoss: 22,
      },
    },
    attackerAfter: {},
    defenderBefore: {
      side: "enemy",
      __sideState: {
        snapshotAfter: { soldiers: 100 },
        moraleLoss: 7,
        soldiersLoss: 30,
      },
    },
    defenderAfter: {},
  });
  assert.equal(soldiersTieBreakerReport.left.result, "victory");
  assert.equal(soldiersTieBreakerReport.right.result, "");

  const drawReport = buildQuickBattleReport({
    attackerBefore: {
      side: "player",
      __sideState: {
        snapshotAfter: { soldiers: 100 },
        moraleLoss: 7,
        soldiersLoss: 30,
        resultLabel: "",
      },
    },
    attackerAfter: {},
    defenderBefore: {
      side: "enemy",
      __sideState: {
        snapshotAfter: { soldiers: 100 },
        moraleLoss: 7,
        soldiersLoss: 30,
        resultLabel: "",
      },
    },
    defenderAfter: {},
  });
  assert.equal(drawReport.left.result, "draw");
  assert.equal(drawReport.right.result, "draw");
});

test("quick npc battle captain fallback prefers the unit troop type before falling back to the first non-center slot", () => {
  const { getFormationCaptainMember, source } = loadQuickBattleFns();

  assert.match(
    source,
    /const troopTypeCaptain = unit\.formationMembers\.find\(member => member\.troopType === unit\.troopType\) \|\| null;[\s\S]*return troopTypeCaptain \|\| unit\.formationMembers\[0\] \|\| null;/,
  );

  const captain = getFormationCaptainMember({
    troopType: "archer",
    formationMembers: [
      {
        id: "enemy.front.infantry",
        slotKey: "front-left",
        troopType: "infantry",
        soldiers: 120,
      },
      {
        id: "enemy.rear.archer",
        slotKey: "rear-center",
        troopType: "archer",
        soldiers: 80,
      },
    ],
  });

  assert.equal(captain?.id, "enemy.rear.archer");
  assert.equal(captain?.slotKey, "rear-center");
});

test("quick npc battle slot display order matches the left-side formation preview orientation", () => {
  const { buildQuickBattleSideState } = loadQuickBattleFns();

  const playerState = buildQuickBattleSideState(
    {
      side: "player",
      formationMembers: [
        { id: "p-front-left", slotKey: "front-left", soldiers: 10, maxSoldiers: 10 },
        { id: "p-middle-left", slotKey: "middle-left", soldiers: 10, maxSoldiers: 10 },
        { id: "p-rear-left", slotKey: "rear-left", soldiers: 10, maxSoldiers: 10 },
      ],
    },
    null,
  );
  assert.deepEqual(
    playerState.slots.slice(0, 3).map((slot) => slot.slotKey),
    ["rear-left", "middle-left", "front-left"],
  );

  const enemyState = buildQuickBattleSideState(
    {
      side: "enemy",
      formationMembers: [
        { id: "e-front-right", slotKey: "front-right", soldiers: 10, maxSoldiers: 10 },
        { id: "e-middle-right", slotKey: "middle-right", soldiers: 10, maxSoldiers: 10 },
        { id: "e-rear-right", slotKey: "rear-right", soldiers: 10, maxSoldiers: 10 },
      ],
    },
    null,
  );
  assert.deepEqual(
    enemyState.slots.slice(0, 3).map((slot) => slot.slotKey),
    ["front-right", "middle-right", "rear-right"],
  );
});
