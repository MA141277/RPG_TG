const assert = require("node:assert/strict");
const test = require("node:test");

const {
  materializeBuildingDefinition,
  mergeBuildingStatusById,
} = require("../.test-dist/domain/building-status.js");
const {
  materializeCharacterDefinition,
  mergeCharacterStatusById,
} = require("../.test-dist/domain/character-status.js");
const {
  materializeCityDefinition,
  mergeCityStatusById,
} = require("../.test-dist/domain/city-status.js");
const {
  mutateCharacterNumericAttributeBySemanticKey,
  mutateCharacterNumericProperty,
} = require("../.test-dist/application/character/runtime-property-mutation.js");

function createCharacter() {
  return {
    id: "char.player",
    name: "Player",
    personType: "角色",
    birthYear: 1540,
    age: 27,
    cityId: "city.kulan",
    portraitId: "portrait.player",
    stats: {
      leadership: 10,
      martial: 11,
      intelligence: 12,
      politics: 13,
      charm: 14,
      fame: 15,
      gold: 100,
    },
    stamina: 50,
    availableFunctions: [],
    skills: { accounting: 2 },
    customProperties: { morale: 3 },
    attributeMappings: [
      {
        key: "runtime.reputation",
        keyName: "Reputation",
        type: "number",
        semanticKey: "status.reputation",
      },
    ],
    attributeValues: [{ key: "runtime.reputation", value: 8 }],
  };
}

test("character status materializes runtime stat skill custom and semantic attribute patches", () => {
  const character = createCharacter();
  const materialized = materializeCharacterDefinition(character, {
    statPatch: { gold: 125 },
    skillPatch: { accounting: 4 },
    customPropertyPatch: { morale: 9 },
    attributeValuePatch: { "runtime.reputation": 12 },
    stamina: 42,
  });

  assert.equal(materialized.stats.gold, 125);
  assert.equal(materialized.skills.accounting, 4);
  assert.equal(materialized.customProperties.morale, 9);
  assert.equal(
    materialized.attributeValues.find((entry) => entry.key === "runtime.reputation").value,
    12
  );
  assert.equal(materialized.stamina, 42);
  assert.equal(character.stats.gold, 100, "source definition should not be mutated");
});

test("runtime property mutation records status patches and materializes updated characters", () => {
  const character = createCharacter();
  const first = mutateCharacterNumericProperty({
    state: { runtime: {} },
    characterDefinitions: [character],
    characterId: "char.player",
    propertyId: "stats.gold",
    operation: "add",
    value: 25,
  });
  const second = mutateCharacterNumericProperty({
    state: first.state,
    characterDefinitions: first.characterDefinitions,
    characterStatusById: first.characterStatusById,
    characterId: "char.player",
    propertyId: "skills.accounting",
    operation: "set",
    value: 6,
  });
  const third = mutateCharacterNumericAttributeBySemanticKey({
    state: second.state,
    characterDefinitions: second.characterDefinitions,
    characterStatusById: second.characterStatusById,
    characterId: "char.player",
    semanticKey: "status.reputation",
    operation: "subtract",
    value: 3,
  });

  assert.equal(third.characterDefinitions[0].stats.gold, 125);
  assert.equal(third.characterDefinitions[0].skills.accounting, 6);
  assert.equal(
    third.characterDefinitions[0].attributeValues.find(
      (entry) => entry.key === "runtime.reputation"
    ).value,
    5
  );
  assert.deepEqual(third.characterStatusById["char.player"].statPatch, {
    gold: 125,
  });
  assert.deepEqual(third.characterStatusById["char.player"].skillPatch, {
    accounting: 6,
  });
});

test("city and building status materializers keep runtime patches outside authored definitions", () => {
  const city = {
    id: "city.kulan",
    name: "Kulan",
    regionId: "region.test",
    mapNodeId: "node.kulan",
    houseIds: ["house.temple"],
    neighbourCityIds: [],
    travelCost: 2,
    tags: ["start"],
    prosperity: 10,
    danger: 1,
    specialDemand: ["grain"],
  };
  const building = {
    id: "house.temple",
    cityId: "city.kulan",
    name: "Temple",
    type: "temple",
    characterIds: [],
    defaultCharacterId: null,
    backAction: { label: "Back", targetView: "city" },
  };

  const cityStatusById = mergeCityStatusById({}, city.id, {
    valuePatch: { prosperity: 12, specialDemand: ["medicine"] },
  });
  const buildingStatusById = mergeBuildingStatusById({}, building.id, {
    runtimePatch: { level: 3, damaged: true, outputMultiplier: 1.5 },
  });

  const materializedCity = materializeCityDefinition(city, cityStatusById[city.id]);
  const materializedBuilding = materializeBuildingDefinition(
    building,
    buildingStatusById[building.id]
  );

  assert.equal(materializedCity.prosperity, 12);
  assert.deepEqual(materializedCity.specialDemand, ["medicine"]);
  assert.equal(city.prosperity, 10);
  assert.equal(materializedBuilding.level, 3);
  assert.equal(materializedBuilding.damaged, true);
  assert.equal(materializedBuilding.outputMultiplier, 1.5);
});
