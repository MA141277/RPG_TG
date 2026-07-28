const test = require("node:test");
const assert = require("node:assert/strict");

function createCharacter(overrides) {
  return {
    id: "character.unknown",
    name: "Unknown",
    birthYear: 1350,
    age: 18,
    cityId: "city.start",
    portraitId: "portrait.unknown",
    stats: {
      leadership: 0,
      martial: 0,
      intelligence: 0,
      politics: 0,
      charm: 0,
      fame: 0,
      gold: 0,
    },
    stamina: 100,
    availableFunctions: [],
    ...overrides,
  };
}

test("character manager separates playable roles from NPCs while preserving one character structure", () => {
  const {
    createCharacterManager,
    resolveCharacterPersonType,
    selectPlayableCharacterIds,
  } = require("../.test-dist/application/character/character-manager.js");

  const manager = createCharacterManager([
    createCharacter({
      id: "person.player",
      name: "Player",
      personType: "角色",
      role: "playable",
    }),
    createCharacter({
      id: "person.legacy-playable",
      name: "Legacy Playable",
      role: "playable",
    }),
    createCharacter({
      id: "person.host",
      name: "Host",
      personType: "NPC",
      role: "support",
      houseId: "house.temple",
    }),
  ]);

  assert.deepEqual(
    manager.playableCharacters.map((character) => character.id),
    ["person.player", "person.legacy-playable"]
  );
  assert.deepEqual(
    manager.npcCharacters.map((character) => character.id),
    ["person.host"]
  );
  assert.equal(
    resolveCharacterPersonType({ personType: "NPC", role: "playable" }),
    "NPC"
  );
  assert.deepEqual(
    selectPlayableCharacterIds(manager.characters, ["person.host"]),
    ["person.player", "person.legacy-playable"]
  );
  assert.deepEqual(
    selectPlayableCharacterIds(
      [
        createCharacter({ id: "person.old-a", name: "Old A" }),
        createCharacter({ id: "person.old-b", name: "Old B" }),
      ],
      ["person.old-b"]
    ),
    ["person.old-b"]
  );
});

test("house NPC lookup prefers modfirst-style character.houseId and falls back to legacy house.characterIds", () => {
  const {
    selectHouseNpcCharacterIds,
    createCharacterManager,
  } = require("../.test-dist/application/character/character-manager.js");

  const characters = [
    createCharacter({
      id: "person.primary",
      name: "Primary",
      personType: "NPC",
      houseId: "house.temple",
    }),
    createCharacter({
      id: "person.secondary",
      name: "Secondary",
      personType: "NPC",
      houseId: "house.temple",
    }),
    createCharacter({
      id: "person.fallback",
      name: "Fallback",
      personType: "NPC",
    }),
    createCharacter({
      id: "person.player",
      name: "Player",
      personType: "角色",
      role: "playable",
      houseId: "house.temple",
    }),
  ];
  const house = {
    id: "house.temple",
    cityId: "city.start",
    name: "Temple",
    type: "temple",
    characterIds: ["person.fallback", "person.player"],
    defaultCharacterId: "person.primary",
    backAction: { label: "Back", targetView: "city" },
  };

  assert.deepEqual(selectHouseNpcCharacterIds(characters, house), [
    "person.primary",
    "person.secondary",
  ]);

  const manager = createCharacterManager(characters);
  assert.equal(manager.getDefaultHouseNpcCharacterId(house), "person.primary");
  assert.deepEqual(
    selectHouseNpcCharacterIds(
      characters.map((character) =>
        character.houseId == null ? character : { ...character, houseId: undefined }
      ),
      house
    ),
    ["person.fallback"]
  );
});

test("active content exposes and merges modfirst-style building arrangements", () => {
  const {
    createActiveGameContent,
  } = require("../.test-dist/application/content/active-game-content.js");

  const basePack = {
    schemaVersion: 1,
    id: "pack.base",
    title: "Base",
    characters: [],
    events: [],
    scenes: [],
    buildingArrangements: [
      {
        id: "arrangement.temple",
        cityId: "city.start",
        buildingId: "house.temple",
        mountedNpcIds: ["person.old"],
        primaryNpcId: "person.old",
        containers: [],
      },
    ],
  };
  const overridePack = {
    schemaVersion: 1,
    id: "pack.override",
    title: "Override",
    characters: [],
    events: [],
    scenes: [],
    buildingArrangements: [
      {
        id: "arrangement.temple",
        cityId: "city.start",
        buildingId: "house.temple",
        mountedNpcIds: ["person.host", "person.guard"],
        primaryNpcId: "person.host",
        containers: [],
      },
    ],
  };

  const content = createActiveGameContent(basePack, overridePack);

  assert.deepEqual(content.buildingArrangements, [
    overridePack.buildingArrangements[0],
  ]);
  assert.equal(
    content.buildingArrangementById["arrangement.temple"].primaryNpcId,
    "person.host"
  );
});
