const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  ensureCityNpcPoolsForCurrentDay,
} = require("../.test-dist/application/city-npcs/refresh-city-npc-pools.js");
const {
  defaultRuntimeContent,
} = require("../.test-dist/application/content/default-runtime-content.js");
const {
  teaHouseHouseModule,
} = require("../.test-dist/application/house-modules/tea-house/tea-house-house-module.js");
const {
  prototypeCards,
  prototypeCharacters,
  prototypeCityNpcPools,
  prototypeHouses,
  prototypeMap,
  prototypeValuables,
} = require("../.test-dist/content/prototype-world.js");

const playerCharacterId = "char.player";
const teaHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "tea-house"
);

assert.ok(teaHouse, "Expected prototype tea house to exist.");

function createBaseState(houseDefinition = teaHouse) {
  return createInitialState({
    currentMapId: prototypeMap.id,
    currentCityId: houseDefinition.cityId,
    currentHouseId: houseDefinition.id,
    playerCharacterId,
    chapterId: "chapter.prototype",
    year: 1567,
    month: 1,
    day: 1,
    pinnedCharacterId: playerCharacterId,
    reviewDateText: "test",
    mainHouseMissionText: "test",
    cards: {
      ownedCardIds: prototypeCards.map((cardDefinition) => cardDefinition.id),
      selectedCardId: prototypeCards[0]?.id ?? null,
    },
    valuables: {
      items: prototypeValuables,
      selectedItemId: prototypeValuables[0]?.id ?? null,
      equippedWeaponSet: {
        swordId:
          prototypeValuables.find(
            (valuableDefinition) => valuableDefinition.category === "weapon"
          )?.id ?? null,
        armorId:
          prototypeValuables.find(
            (valuableDefinition) => valuableDefinition.category === "armor"
          )?.id ?? null,
      },
    },
    currentView: "house",
  });
}

function createGuestViewModel(guestNpcId, dialogueLines = ["正在闲谈。"]) {
  defaultRuntimeContent.cityNpcPools = prototypeCityNpcPools;
  const state = ensureCityNpcPoolsForCurrentDay(
    createBaseState(),
    prototypeCityNpcPools,
    () => 0.1
  );
  const enterResult = teaHouseHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: teaHouse,
    playerCharacterId,
  });

  return teaHouseHouseModule.selectViewModel({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: teaHouse,
    playerCharacterId,
    sessionState: {
      ...enterResult.sessionState,
      guestNpcIds: [guestNpcId],
      selectedActorId: guestNpcId,
      dialoguePhase: "open",
      dialogueLines,
    },
  });
}

test("tea house escort-type guests keep a right-side portrait hook without overriding the left avatar", () => {
  const viewModel = createGuestViewModel("city-npc.kulan.guard_lin", [
    "最近有人在打听出城商队的时辰。",
  ]);
  const guestRosterEntry = viewModel.standbyRoster.find(
    (entry) => entry.characterId === "city-npc.kulan.guard_lin"
  );

  assert.ok(guestRosterEntry);
  assert.equal(guestRosterEntry.avatarArtClassName ?? null, null);
  assert.equal(
    guestRosterEntry.portraitArtClassName,
    "c-house-runtime-npc-portrait-art--guard"
  );
  assert.equal(viewModel.dialogue?.avatarArtClassName ?? null, null);
  assert.equal(
    viewModel.dialogue?.portraitArtClassName,
    "c-house-runtime-npc-portrait-art--guard"
  );
});

test("tea house scholar-type guests fall back to a civilian portrait hook", () => {
  const viewModel = createGuestViewModel("city-npc.kulan.scholar_he", [
    "世人只问功名，不问文章。",
  ]);
  const guestRosterEntry = viewModel.standbyRoster.find(
    (entry) => entry.characterId === "city-npc.kulan.scholar_he"
  );

  assert.ok(guestRosterEntry);
  assert.equal(guestRosterEntry.avatarArtClassName ?? null, null);
  assert.equal(
    guestRosterEntry.portraitArtClassName,
    "c-house-runtime-npc-portrait-art--civilian"
  );
  assert.equal(viewModel.dialogue?.avatarArtClassName ?? null, null);
  assert.equal(
    viewModel.dialogue?.portraitArtClassName,
    "c-house-runtime-npc-portrait-art--civilian"
  );
});
