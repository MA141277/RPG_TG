const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  FactionAffiliationRuntime,
} = require("../.test-dist/application/faction/faction-affiliation-runtime.js");

function createBaseState() {
  return createInitialState({
    currentMapId: "map.yuanmo",
    currentCityId: "city.kulan",
    currentHouseId: "house.kulan.temple",
    playerCharacterId: "char.player",
    chapterId: "chapter.zhu-yuanzhang-rise",
    year: 1352,
    month: 1,
    day: 1,
    pinnedCharacterId: "char.player",
    reviewDateText: "test",
    mainHouseMissionText: "test",
    cards: {
      ownedCardIds: [],
      selectedCardId: null,
    },
    valuables: {
      items: [],
      selectedItemId: null,
      equippedWeaponSet: {
        swordId: null,
        armorId: null,
      },
    },
  });
}

function createBaseCharacters() {
  return [
    {
      id: "char.player",
      name: "\u6731\u91cd\u516b",
      birthYear: 1328,
      age: 24,
      cityId: "city.kulan",
      portraitId: "portrait.zhu_yuanzhang.young",
      stats: {
        leadership: 55,
        martial: 62,
        intelligence: 63,
        politics: 41,
        charm: 46,
        fame: 0,
        gold: 0,
      },
      stamina: 100,
      clanId: "clan.old",
      affiliationLabel: "\u65e7\u6807\u7b7e",
      availableFunctions: [],
    },
  ];
}

test("initial state seeds an empty faction affiliation runtime table", () => {
  const state = createBaseState();
  assert.deepEqual(state.runtime.factionAffiliations, {});
});

test("joining a faction records active runtime affiliation and syncs compatibility label", () => {
  const runtime = new FactionAffiliationRuntime();
  const result = runtime.joinFaction({
    state: createBaseState(),
    characterDefinitions: createBaseCharacters(),
    characterId: "char.player",
    factionId: "temple",
    factionName: "\u7687\u89c9\u5bfa",
    joinedBy: "scene.story.zhu_yuanzhang.ordination",
  });

  assert.deepEqual(result.state.runtime.factionAffiliations["char.player"], {
    factionId: "temple",
    factionName: "\u7687\u89c9\u5bfa",
    status: "active",
    joinedBy: "scene.story.zhu_yuanzhang.ordination",
    joinedOn: {
      year: 1352,
      month: 1,
      day: 1,
    },
  });
  assert.equal(result.characterDefinitions[0].affiliationLabel, "\u7687\u89c9\u5bfa");
});

test("joining a second faction replaces visible ownership without touching clan fallback", () => {
  const runtime = new FactionAffiliationRuntime();
  const firstJoin = runtime.joinFaction({
    state: createBaseState(),
    characterDefinitions: createBaseCharacters(),
    characterId: "char.player",
    factionId: "temple",
    factionName: "\u7687\u89c9\u5bfa",
    joinedBy: "scene.story.zhu_yuanzhang.ordination",
  });
  const secondJoin = runtime.joinFaction({
    state: firstJoin.state,
    characterDefinitions: firstJoin.characterDefinitions,
    characterId: "char.player",
    factionId: "red_turban",
    factionName: "\u7ea2\u5dfe\u519b",
    joinedBy: "story.zhu_yuanzhang.join-guo-zixing-camp",
  });

  assert.equal(
    secondJoin.state.runtime.factionAffiliations["char.player"].factionId,
    "red_turban"
  );
  assert.equal(secondJoin.characterDefinitions[0].clanId, "clan.old");
  assert.equal(resultingLabel(secondJoin.characterDefinitions[0]), "\u7ea2\u5dfe\u519b");
});

test("display label resolution prefers runtime faction over stale character fields", () => {
  const runtime = new FactionAffiliationRuntime();
  const joined = runtime.joinFaction({
    state: createBaseState(),
    characterDefinitions: createBaseCharacters(),
    characterId: "char.player",
    factionId: "temple",
    factionName: "\u7687\u89c9\u5bfa",
    joinedBy: "scene.story.zhu_yuanzhang.ordination",
  });

  assert.equal(
    runtime.resolveCharacterFactionLabel({
      state: joined.state,
      character: joined.characterDefinitions[0],
    }),
    "\u7687\u89c9\u5bfa"
  );
});

function resultingLabel(characterDefinition) {
  return characterDefinition.affiliationLabel;
}
