const test = require("node:test");
const assert = require("node:assert/strict");

const {
  applySettlementContents,
  applySettlementDefinitionById,
  applySettlementInstances,
  settleRuntimeCommands,
  settleRuntimeEffects,
} = require("../.test-dist/core/runtime/runtime-settlement.js");
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

test("applySettlementContents applies numeric, boolean, and enum changes", () => {
  const state = {
    people: {
      hero: {
        stats: { merit: 10 },
        enlisted: false,
        rank: "guest",
      },
    },
  };

  const nextState = applySettlementContents(state, {
    contents: [
      {
        targetFamily: "person",
        targetId: "hero",
        attributeKey: "stats.merit",
        attributeType: "number",
        operation: "add",
        value: 5,
      },
      {
        targetFamily: "person",
        targetId: "hero",
        attributeKey: "enlisted",
        attributeType: "boolean",
        operation: "set",
        value: true,
      },
      {
        targetFamily: "person",
        targetId: "hero",
        attributeKey: "rank",
        attributeType: "enum",
        operation: "set",
        value: "officer",
      },
    ],
  });

  assert.equal(nextState.people.hero.stats.merit, 15);
  assert.equal(nextState.people.hero.enlisted, true);
  assert.equal(nextState.people.hero.rank, "officer");
  assert.equal(state.people.hero.stats.merit, 10);
});

test("applySettlementContents ignores unsupported or missing targets", () => {
  const state = {
    cities: {
      haozhou: {
        prosperity: 20,
        open: true,
      },
    },
  };

  const nextState = applySettlementContents(state, {
    contents: [
      {
        targetFamily: "city",
        targetId: "missing",
        attributeKey: "prosperity",
        attributeType: "number",
        operation: "add",
        value: 10,
      },
      {
        targetFamily: "city",
        targetId: "haozhou",
        attributeKey: "open",
        attributeType: "boolean",
        operation: "add",
        value: true,
      },
    ],
  });

  assert.deepEqual(nextState, state);
});

test("applySettlementInstances applies referenced settlement definitions", () => {
  const result = applySettlementInstances(
    {
      buildings: {
        temple: {
          level: 1,
        },
      },
    },
    {
      settlementInstances: [{ settlementId: "upgrade-temple" }],
      settlementDefinitionsById: {
        "upgrade-temple": {
          contents: [
            {
              targetFamily: "building",
              targetId: "temple",
              attributeKey: "level",
              attributeType: "number",
              operation: "add",
              value: 1,
            },
          ],
        },
      },
    }
  );

  assert.equal(result.state.buildings.temple.level, 2);
  assert.deepEqual(result.warnings, []);
});

test("applySettlementInstances reports missing settlement definitions", () => {
  const state = {
    people: {
      hero: {
        merit: 1,
      },
    },
  };

  const result = applySettlementInstances(state, {
    settlementInstances: [{ settlementId: "missing-settlement" }],
    settlementDefinitionsById: {},
  });

  assert.equal(result.state, state);
  assert.deepEqual(result.warnings, [
    "missing-progression-settlement:missing-settlement",
  ]);
});

test("applySettlementDefinitionById applies a named settlement definition to mixed target collections", () => {
  const result = applySettlementDefinitionById(
    {
      people: {
        hero: {
          stamina: 100,
        },
      },
      cities: {
        haozhou: {
          prosperity: 20,
        },
      },
      buildings: {
        temple: {
          outputMultiplier: 1,
        },
      },
    },
    {
      settlementId: "settlement.shared.reward",
      settlementDefinitionsById: {
        "settlement.shared.reward": {
          contents: [
            {
              targetFamily: "person",
              targetId: "hero",
              attributeKey: "stamina",
              attributeType: "number",
              operation: "add",
              value: 10,
            },
            {
              targetFamily: "city",
              targetId: "haozhou",
              attributeKey: "prosperity",
              attributeType: "number",
              operation: "add",
              value: 5,
            },
            {
              targetFamily: "building",
              targetId: "temple",
              attributeKey: "outputMultiplier",
              attributeType: "number",
              operation: "set",
              value: 2,
            },
          ],
        },
      },
    }
  );

  assert.equal(result.state.people.hero.stamina, 110);
  assert.equal(result.state.cities.haozhou.prosperity, 25);
  assert.equal(result.state.buildings.temple.outputMultiplier, 2);
  assert.deepEqual(result.warnings, []);
});

test("settleRuntimeEffects applies progression settlement instances to character definitions", () => {
  const characterDefinitions = [createCharacterDefinition()];

  const result = settleRuntimeEffects({
    state: createBaseRuntimeState(),
    effects: [],
    settlementInstances: [
      {
        settlementId: "hero-tier-entry",
        payload: {
          hostFamily: "person",
          hostId: "hero",
          trackId: "merit",
          fromTierId: null,
          toTierId: "tier.1",
          metricValue: 10,
        },
      },
    ],
    settlementDefinitionsById: {
      "hero-tier-entry": {
        contents: [
          {
            targetFamily: "person",
            targetId: "hero",
            attributeKey: "customProperties.contribution",
            attributeType: "number",
            operation: "add",
            value: 7,
          },
        ],
      },
    },
    emittedBy: "progression-runtime",
    appliedBy: "runtime-settlement",
    characterDefinitions,
  });

  assert.equal(result.characterDefinitions[0].customProperties.contribution, 12);
  assert.equal(characterDefinitions[0].customProperties.contribution, 5);
  assert.deepEqual(result.warnings, []);
});

test("settleRuntimeEffects settles character numeric property mutations with status patches", () => {
  const result = settleRuntimeEffects({
    state: createBaseRuntimeState(),
    effects: [
      {
        type: "mutateCharacterNumericProperty",
        characterId: "hero",
        propertyId: "stats.martial",
        operation: "add",
        value: 3,
      },
    ],
    emittedBy: "event-runtime",
    appliedBy: "runtime-settlement",
    characterDefinitions: [createCharacterDefinition()],
  });

  assert.equal(result.characterDefinitions[0].stats.martial, 23);
  assert.deepEqual(result.characterStatusById.hero.statPatch, {
    martial: 23,
  });
  assert.equal(result.settledEffects.length, 1);
  assert.deepEqual(result.unsupportedEffects, []);
});

test("settleRuntimeEffects reports character mutation without character definitions as unsupported", () => {
  const effect = {
    type: "mutateCharacterNumericProperty",
    characterId: "hero",
    propertyId: "stats.martial",
    operation: "add",
    value: 3,
  };

  const result = settleRuntimeEffects({
    state: createBaseRuntimeState(),
    effects: [effect],
    emittedBy: "event-runtime",
    appliedBy: "runtime-settlement",
  });

  assert.deepEqual(result.settledEffects, []);
  assert.deepEqual(result.unsupportedEffects, [effect]);
  assert.deepEqual(result.warnings, [
    "unsupported-effect:mutateCharacterNumericProperty:missing-character-definitions:emitted-by:event-runtime",
  ]);
});

test("settleRuntimeEffects settles changeMoney through the shared settlement command runtime", () => {
  const effect = {
    type: "changeMoney",
    amount: 25,
  };

  const result = settleRuntimeEffects({
    state: createBaseRuntimeState(),
    effects: [effect],
    emittedBy: "event-runtime",
    appliedBy: "runtime-settlement",
    characterDefinitions: [createCharacterDefinition()],
  });

  assert.equal(result.characterDefinitions[0].stats.gold, 125);
  assert.deepEqual(result.characterStatusById.hero.statPatch, {
    gold: 125,
  });
  assert.deepEqual(result.settledEffects, [effect]);
  assert.deepEqual(result.unsupportedEffects, []);
});

test("settleRuntimeCommands exposes the canonical command-level settlement entry", () => {
  const command = {
    type: "player.money.change",
    amount: 25,
  };

  const result = settleRuntimeCommands({
    state: createBaseRuntimeState(),
    commands: [command],
    emittedBy: "event-runtime",
    appliedBy: "runtime-settlement",
    characterDefinitions: [createCharacterDefinition()],
  });

  assert.equal(result.characterDefinitions[0].stats.gold, 125);
  assert.deepEqual(result.settledCommands, [command]);
  assert.deepEqual(result.unsupportedCommands, []);
  assert.deepEqual(result.warnings, []);
});

test("settleRuntimeCommands reports unsupported command warnings directly", () => {
  const command = {
    type: "player.money.change",
    amount: 25,
  };

  const result = settleRuntimeCommands({
    state: createBaseRuntimeState(),
    commands: [command],
    emittedBy: "event-runtime",
    appliedBy: "runtime-settlement",
  });

  assert.deepEqual(result.settledCommands, []);
  assert.deepEqual(result.unsupportedCommands, [command]);
  assert.deepEqual(result.warnings, [
    "unsupported-command:player.money.change:missing-character-definitions:emitted-by:event-runtime",
  ]);
});

test(
  "settleRuntimeEffects delegates covered concrete mutation execution to settlement-command-runtime",
  { concurrency: false },
  () => {
    const commandRuntimePath = require.resolve(
      "../.test-dist/core/runtime/settlement-command-runtime.js"
    );
    const runtimeSettlementPath = require.resolve(
      "../.test-dist/core/runtime/runtime-settlement.js"
    );

    delete require.cache[commandRuntimePath];
    delete require.cache[runtimeSettlementPath];

    const commandRuntimeModule = require(commandRuntimePath);
    const originalApplySettlementCommands =
      commandRuntimeModule.applySettlementCommands;
    let applySettlementCommandsCalls = 0;

    commandRuntimeModule.applySettlementCommands = (...args) => {
      applySettlementCommandsCalls += 1;
      return originalApplySettlementCommands(...args);
    };

    try {
      const { settleRuntimeEffects: settleRuntimeEffectsWithPatchedOwner } =
        require(runtimeSettlementPath);

      const result = settleRuntimeEffectsWithPatchedOwner({
        state: createBaseRuntimeState(),
        effects: [
          {
            type: "setFlag",
            key: "event.test.delegated",
            value: true,
          },
        ],
        emittedBy: "event-runtime",
        appliedBy: "runtime-settlement",
      });

      assert.equal(result.state.core.runtime.flags["event.test.delegated"], true);
      assert.ok(
        applySettlementCommandsCalls > 0,
        "runtime-settlement should delegate covered mutation execution to applySettlementCommands"
      );
    } finally {
      commandRuntimeModule.applySettlementCommands =
        originalApplySettlementCommands;
      delete require.cache[commandRuntimePath];
      delete require.cache[runtimeSettlementPath];
    }
  }
);
