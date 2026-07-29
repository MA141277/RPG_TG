const assert = require("node:assert/strict");
const test = require("node:test");

const {
  applyStorySettlementEvent,
} = require("../.test-dist/application/story/story-settlement-continuation.js");
const {
  prototypeCharacters,
  prototypeCities,
  prototypeHouses,
  prototypeMap,
} = require("../.test-dist/content/prototype-world.js");
const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");

function createBaseState() {
  return createInitialState({
    currentMapId: prototypeMap.id,
    currentCityId: "city.kulan",
    currentHouseId: null,
    playerCharacterId: "char.player",
    chapterId: "chapter.prototype",
    year: 1567,
    month: 1,
    day: 1,
    pinnedCharacterId: "char.player",
    reviewDateText: "test",
    mainHouseMissionText: "test",
    currentView: "city",
  });
}

test("applyStorySettlementEvent applies person city and building settlement targets", () => {
  const cityBefore = prototypeCities.find((city) => city.id === "city.kulan");
  const houseBefore = prototypeHouses.find(
    (house) => house.moduleId === "grain-shop"
  );
  assert.ok(cityBefore);
  assert.ok(houseBefore);

  const characterDefinitions = prototypeCharacters.map((character) =>
    character.id === "char.player"
      ? {
          ...character,
          stamina: 100,
        }
      : character
  );

  const result = applyStorySettlementEvent(
    {
      state: createBaseState(),
      characterDefinitions,
      cityDefinitions: prototypeCities,
      houseDefinitions: prototypeHouses,
    },
    {
      settlementDefinitionsById: {
        "settlement.shared.reward": {
          id: "settlement.shared.reward",
          title: "Shared Reward",
          contents: [
            {
              targetFamily: "person",
              targetId: "char.player",
              attributeKey: "stamina",
              attributeType: "number",
              operation: "add",
              value: 10,
            },
            {
              targetFamily: "city",
              targetId: cityBefore.id,
              attributeKey: "prosperity",
              attributeType: "number",
              operation: "add",
              value: 5,
            },
            {
              targetFamily: "building",
              targetId: houseBefore.id,
              attributeKey: "outputMultiplier",
              attributeType: "number",
              operation: "set",
              value: 2,
            },
          ],
        },
      },
    },
    {
      id: "event.settlement.shared",
      chapterId: "chapter.prototype",
      name: "Settlement",
      occurrence: "repeatable",
      trigger: { timing: "manual" },
      conditions: [],
      entrySceneId: "scene.settlement.shared",
      type: "settlement",
      settlementId: "settlement.shared.reward",
    }
  );

  assert.equal(
    result.characterDefinitions.find((character) => character.id === "char.player")
      ?.stamina,
    110
  );
  assert.equal(
    result.cityDefinitions?.find((city) => city.id === cityBefore.id)
      ?.prosperity,
    cityBefore.prosperity + 5
  );
  assert.equal(
    result.houseDefinitions?.find((house) => house.id === houseBefore.id)
      ?.outputMultiplier,
    2
  );
});
