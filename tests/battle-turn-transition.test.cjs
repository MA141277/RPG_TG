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
  const quickBattleState = { isActive: false };
  const isBattleInteractionLocked = new Function(
    "turnTransitionState",
    "quickBattleState",
    `return function isBattleInteractionLocked() {${isLockedBody}};`,
  )(state, quickBattleState);
  return {
    source,
    state,
    quickBattleState,
    getTurnTransitionContent,
    isBattleInteractionLocked,
  };
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
    /async function runNpcAllyTurn\(\)[\s\S]*turn = 'ally'[\s\S]*updateUI\(\)[\s\S]*await playTurnTransition\("enemy"\)[\s\S]*await runEnemyTurn\(\)/,
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
  assert.match(
    source,
    /btnEnd\.disabled = turn !== 'player' \|\| isBattleInteractionLocked\(\)/,
  );
  assert.match(source, /if \(isBattleInteractionLocked\(\)\) return;/);
});

test("battle bottom footer shows army-turn copy only during ally and enemy phases", () => {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  assert.match(source, /id="army-turn-footer"/);
  assert.match(
    source,
    /armyTurnFooter\.textContent = turn === 'ally'[\s\S]*\? '我方军团回合'[\s\S]*: turn === 'enemy'[\s\S]*\? '敌方军团回合'[\s\S]*: ''/,
  );
  assert.match(
    source,
    /armyTurnFooter\.classList\.toggle\('hidden', phase !== 'battle' \|\| turn === 'player'\)/,
  );
});
