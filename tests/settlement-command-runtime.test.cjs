const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");

function createBaseRuntimeState() {
  return {
    core: createInitialState({
      currentMapId: "map.test",
      currentCityId: "city.test",
      currentHouseId: null,
      playerCharacterId: "hero",
      chapterId: "chapter.test",
      year: 1560,
      month: 1,
      day: 1,
      pinnedCharacterId: "hero",
      reviewDateText: "",
      mainHouseMissionText: "",
      cards: { ownedCardIds: [] },
      valuables: { ownedItemIds: [] },
    }),
    app: {
      beggingMiniGameState: null,
      autoAdvanceState: null,
      campaignTravelState: null,
      cityDirectoryState: null,
      cityMenuState: null,
      locationDialogueState: null,
      modalState: null,
    },
    view: {},
  };
}

function createCharacterDefinition(overrides = {}) {
  return {
    id: "hero",
    name: "Hero",
    birthYear: 1540,
    age: 20,
    cityId: "city.test",
    portraitId: "portrait.hero",
    stats: {
      leadership: 10,
      martial: 20,
      intelligence: 30,
      politics: 40,
      charm: 50,
      fame: 0,
      gold: 100,
    },
    stamina: 100,
    availableFunctions: [],
    skills: {
      arithmetic: 2,
    },
    customProperties: {
      contribution: 5,
    },
    ...overrides,
  };
}

test("applySettlementCommands executes phase-one shared settlement commands", () => {
  const { applySettlementCommands } = require("../.test-dist/core/runtime/settlement-command-runtime.js");

  const result = applySettlementCommands({
    state: createBaseRuntimeState(),
    commands: [
      { type: "flag.set", key: "event.test.shared-flag", value: true },
      { type: "variable.set", key: "event.test.shared-variable", value: 7 },
      { type: "time.advance", hours: 1 },
      {
        type: "character.numeric-property.mutate",
        characterId: "hero",
        propertyId: "stats.martial",
        operation: "add",
        value: 3,
      },
    ],
    characterDefinitions: [createCharacterDefinition()],
  });

  assert.equal(result.state.core.runtime.flags["event.test.shared-flag"], true);
  assert.equal(
    result.state.core.runtime.variables["event.test.shared-variable"],
    7
  );
  assert.equal(result.state.core.world.timeOfDay, "afternoon");
  assert.equal(result.characterDefinitions[0].stats.martial, 23);
  assert.equal(result.settledCommands.length, 4);
  assert.deepEqual(result.unsupportedCommands, []);
});

test("applySettlementCommands executes player money changes through the shared settlement command owner", () => {
  const { applySettlementCommands } = require("../.test-dist/core/runtime/settlement-command-runtime.js");

  const result = applySettlementCommands({
    state: createBaseRuntimeState(),
    commands: [{ type: "player.money.change", amount: 25 }],
    characterDefinitions: [createCharacterDefinition()],
  });

  assert.equal(result.characterDefinitions[0].stats.gold, 125);
  assert.deepEqual(result.characterStatusById.hero.statPatch, {
    gold: 125,
  });
  assert.deepEqual(result.settledCommands, [
    { type: "player.money.change", amount: 25 },
  ]);
  assert.deepEqual(result.unsupportedCommands, []);
});

test("applySettlementCommands fails closed when character mutation lacks character definitions", () => {
  const { applySettlementCommands } = require("../.test-dist/core/runtime/settlement-command-runtime.js");
  const command = {
    type: "character.numeric-property.mutate",
    characterId: "hero",
    propertyId: "stats.martial",
    operation: "add",
    value: 3,
  };

  const result = applySettlementCommands({
    state: createBaseRuntimeState(),
    commands: [command],
  });

  assert.deepEqual(result.settledCommands, []);
  assert.deepEqual(result.unsupportedCommands, [command]);
  assert.deepEqual(result.warnings, [
    "unsupported-command:character.numeric-property.mutate:missing-character-definitions",
  ]);
});

test("applySettlementCommands fails closed when player money change lacks character definitions", () => {
  const { applySettlementCommands } = require("../.test-dist/core/runtime/settlement-command-runtime.js");
  const command = {
    type: "player.money.change",
    amount: 25,
  };

  const result = applySettlementCommands({
    state: createBaseRuntimeState(),
    commands: [command],
  });

  assert.deepEqual(result.settledCommands, []);
  assert.deepEqual(result.unsupportedCommands, [command]);
  assert.deepEqual(result.warnings, [
    "unsupported-command:player.money.change:missing-character-definitions",
  ]);
});
