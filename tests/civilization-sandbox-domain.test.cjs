const assert = require("node:assert/strict");
const test = require("node:test");

test("civilization sandbox initial state is empty and disabled", () => {
  const {
    createInitialCivilizationSandboxState,
  } = require("../.test-dist/domain/civilization-sandbox.js");

  const state = createInitialCivilizationSandboxState();

  assert.equal(state.enabled, false);
  assert.equal(state.tick, 0);
  assert.equal(state.mode, "validation");
  assert.equal(state.viewMode, "normal");
  assert.deepEqual(state.civilizationsById, {});
  assert.deepEqual(state.individualsById, {});
  assert.deepEqual(state.claimedHexByKey, {});
});

test("civilization sandbox race templates encode the three founding behaviors", () => {
  const {
    SANDBOX_RACE_TEMPLATES,
  } = require("../.test-dist/application/civilization-sandbox/race-templates.js");

  assert.equal(SANDBOX_RACE_TEMPLATES["wu-tong"].founderName, "吴同");
  assert.equal(SANDBOX_RACE_TEMPLATES["wu-tong"].behavior.combat, 3);
  assert.equal(SANDBOX_RACE_TEMPLATES["wu-tong"].behavior.expansion, 3);

  assert.equal(SANDBOX_RACE_TEMPLATES["yu-qingqing"].founderName, "于晴晴");
  assert.equal(SANDBOX_RACE_TEMPLATES["yu-qingqing"].behavior.farming, 3);
  assert.equal(
    SANDBOX_RACE_TEMPLATES["yu-qingqing"].behavior.conflictAvoidance,
    3
  );

  assert.equal(SANDBOX_RACE_TEMPLATES["chen-yihan"].founderName, "陈倚晗");
  assert.equal(SANDBOX_RACE_TEMPLATES["chen-yihan"].behavior.technology, 3);
  assert.equal(SANDBOX_RACE_TEMPLATES["chen-yihan"].behavior.building, 3);
});

test("civilization sandbox name generators use race-specific child names and fallback", () => {
  const {
    generateSandboxChildName,
  } = require("../.test-dist/application/civilization-sandbox/name-generator.js");

  assert.equal(
    generateSandboxChildName({ raceId: "wu-tong", birthIndex: 0, usedNames: [] }),
    "吴安同"
  );
  assert.equal(
    generateSandboxChildName({
      raceId: "yu-qingqing",
      birthIndex: 0,
      usedNames: [],
    }),
    "于晶晶"
  );
  assert.equal(
    generateSandboxChildName({
      raceId: "chen-yihan",
      birthIndex: 0,
      usedNames: [],
    }),
    "陈1晗"
  );
  assert.equal(
    generateSandboxChildName({
      raceId: "chen-yihan",
      birthIndex: 99,
      usedNames: Array.from({ length: 99 }, (_, index) => `陈${index + 1}晗`),
    }),
    "陈倚晗二世"
  );
});

test("createInitialState initializes civilization sandbox runtime state", () => {
  const {
    createInitialState,
  } = require("../.test-dist/application/state/create-initial-state.js");

  const state = createInitialState({
    currentMapId: "map.test",
    currentCityId: "city.test",
    currentHouseId: null,
    playerCharacterId: "character.player",
    chapterId: "chapter.test",
    year: 1,
    month: 1,
    day: 1,
    pinnedCharacterId: "character.player",
    reviewDateText: "",
    mainHouseMissionText: "",
    cards: {
      ownedCardIds: [],
      selectedCardId: null,
    },
    valuables: {
      items: [],
      selectedItemId: null,
    },
  });

  assert.equal(state.runtime.civilizationSandbox.enabled, false);
  assert.equal(state.runtime.civilizationSandbox.mode, "validation");
});

test("placing a sandbox lord creates civilization settlement household and claimed land", () => {
  const {
    createInitialCivilizationSandboxState,
  } = require("../.test-dist/domain/civilization-sandbox.js");
  const {
    placeSandboxLord,
  } = require("../.test-dist/application/civilization-sandbox/placement.js");

  const state = placeSandboxLord({
    state: createInitialCivilizationSandboxState(),
    raceId: "wu-tong",
    hex: { x: 4, y: -2 },
  });

  assert.equal(state.enabled, true);
  assert.equal(Object.keys(state.civilizationsById).length, 1);
  assert.equal(Object.keys(state.settlementsById).length, 1);
  assert.equal(Object.keys(state.householdsById).length, 1);
  assert.equal(Object.keys(state.individualsById).length, 4);
  assert.equal(state.claimedHexByKey["4,-2"], "civ.wu-tong.1");
  assert.equal(state.individualsById["individual.wu-tong.1"]?.name, "吴同");
  assert.equal(state.individualsById["individual.wu-tong.1"]?.role, "lord");
});

test("sandbox tick creates visible house farm and child records from starting civilization", () => {
  const {
    createInitialCivilizationSandboxState,
  } = require("../.test-dist/domain/civilization-sandbox.js");
  const {
    placeSandboxLord,
  } = require("../.test-dist/application/civilization-sandbox/placement.js");
  const {
    tickCivilizationSandbox,
  } = require("../.test-dist/application/civilization-sandbox/simulation.js");

  let state = placeSandboxLord({
    state: createInitialCivilizationSandboxState(),
    raceId: "yu-qingqing",
    hex: { x: 0, y: 0 },
  });

  for (let index = 0; index < 8; index += 1) {
    state = tickCivilizationSandbox(state);
  }

  assert.ok(
    Object.values(state.structuresById).some(
      (structure) => structure.kind === "rural-house"
    )
  );
  assert.ok(
    Object.values(state.structuresById).some(
      (structure) => structure.kind === "farm"
    )
  );
  assert.ok(
    Object.values(state.individualsById).some(
      (individual) => individual.name === "于晶晶"
    )
  );
  assert.ok(Object.keys(state.claimedHexByKey).length > 1);
});
