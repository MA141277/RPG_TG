const test = require("node:test");
const assert = require("node:assert/strict");

const { createInitialState } = require("../.test-dist/application/state/create-initial-state.js");
const {
  prototypeCards,
  prototypeCharacters,
  prototypeHouses,
  prototypeMap,
  prototypeValuables,
} = require("../.test-dist/content/prototype-world.js");
const { executeGrainTrade } = require("../.test-dist/application/grain-shop/grain-trade.js");
const {
  grainShopHouseModule,
} = require("../.test-dist/application/house-modules/grain-shop/grain-shop-house-module.js");
const {
  createInitialGrainShopSessionState,
} = require("../.test-dist/application/house-modules/grain-shop/grain-shop-session-state.js");
const {
  equipValuableItem,
  getVisibleOwnedCards,
  getVisibleValuables,
  resolveSelectedCardId,
  resolveSelectedValuableId,
} = require("../.test-dist/application/inventory/inventory-selection.js");
const {
  accountingGradeRewards,
} = require("../.test-dist/content/houses/grain-shop-content.js");
const { GRAIN_SHOP_VARIABLE_KEYS } = require("../.test-dist/domain/grain-shop.js");

const playerCharacterId = "char.player";
const grainShopHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "grain-shop"
);

assert.ok(grainShopHouse, "Expected prototype grain shop house to exist.");

function createBaseState() {
  return createInitialState({
    currentMapId: prototypeMap.id,
    currentCityId: "city.kulan",
    currentHouseId: grainShopHouse.id,
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

function createStateWithGrainVariables() {
  const state = createBaseState();
  return {
    ...state,
    runtime: {
      ...state.runtime,
      variables: {
        ...state.runtime.variables,
        [GRAIN_SHOP_VARIABLE_KEYS.food]: 5,
        [GRAIN_SHOP_VARIABLE_KEYS.relationship]: 0,
        [GRAIN_SHOP_VARIABLE_KEYS.time]: 1,
        [GRAIN_SHOP_VARIABLE_KEYS.grainPrice]: 100,
      },
    },
  };
}

function getPlayerCharacter(characterDefinitions) {
  const playerCharacter = characterDefinitions.find(
    (characterDefinition) => characterDefinition.id === playerCharacterId
  );
  assert.ok(playerCharacter);
  return playerCharacter;
}

test("grain trade succeeds for a valid buy and advances runtime state", () => {
  const state = createStateWithGrainVariables();
  const result = executeGrainTrade(
    state,
    prototypeCharacters,
    playerCharacterId,
    "buy",
    1,
    100
  );

  assert.equal(result.ok, true);
  if (!result.ok) {
    return;
  }

  const playerCharacter = getPlayerCharacter(result.mutation.characterDefinitions);
  assert.equal(playerCharacter.stats.gold, 20);
  assert.equal(result.mutation.state.runtime.variables[GRAIN_SHOP_VARIABLE_KEYS.food], 6);
  assert.equal(result.mutation.state.runtime.variables[GRAIN_SHOP_VARIABLE_KEYS.time], 2);
});

test("grain trade fails when the player cannot afford the purchase", () => {
  const state = createStateWithGrainVariables();
  const result = executeGrainTrade(
    state,
    prototypeCharacters,
    playerCharacterId,
    "buy",
    2,
    1000
  );

  assert.equal(result.ok, false);
  if (result.ok) {
    return;
  }

  assert.equal(result.errorTitle.length > 0, true);
  assert.equal(result.errorMessage.length > 0, true);
});

test("house enter and leave keep session wiring and interval side effects consistent", () => {
  const state = createBaseState();
  const enterResult = grainShopHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: grainShopHouse,
    playerCharacterId,
  });

  assert.equal(enterResult.sessionState?.dialoguePhase, "greeting");
  assert.deepEqual(enterResult.sideEffects, [
    { type: "stop-interval", intervalId: "grain-shop-accounting" },
  ]);

  const leaveResult = grainShopHouseModule.leave({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: grainShopHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
  });

  assert.equal(leaveResult.sessionState, null);
  assert.deepEqual(leaveResult.sideEffects, [
    { type: "stop-interval", intervalId: "grain-shop-accounting" },
  ]);
});

test("minigame tick settles into result overlay and applies grade reward", () => {
  const state = createStateWithGrainVariables();
  const sessionState = {
    ...createInitialGrainShopSessionState("greeting", "default"),
    overlay: {
      type: "minigame",
      score: 14,
      wrongCount: 0,
      secondsLeft: 1,
      question: {
        bought: 10,
        sold: 4,
        displayedStock: 6,
        isLedgerCorrect: true,
      },
    },
  };

  const result = grainShopHouseModule.dispatch({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: grainShopHouse,
    playerCharacterId,
    sessionState,
    request: {
      type: "tick",
      tickId: "grain-shop-accounting",
    },
  });

  assert.equal(result.sessionState?.overlay?.type, "result");
  if (result.sessionState?.overlay?.type !== "result") {
    return;
  }

  const reward = accountingGradeRewards.A;
  const playerCharacter = getPlayerCharacter(result.characterDefinitions);
  assert.equal(result.sessionState.overlay.grade, "A");
  assert.equal(playerCharacter.stats.gold, 120 + reward.money);
  assert.equal(playerCharacter.skills.arithmetic, 1 + reward.math);
  assert.equal(
    result.gameState.runtime.variables[GRAIN_SHOP_VARIABLE_KEYS.relationship],
    reward.relationship
  );
  assert.equal(result.gameState.runtime.variables[GRAIN_SHOP_VARIABLE_KEYS.time], 2);
  assert.deepEqual(result.sideEffects, [
    { type: "stop-interval", intervalId: "grain-shop-accounting" },
  ]);
});

test("inventory filtering and equip logic preserve valid selection", () => {
  const visibleBattleCards = getVisibleOwnedCards(
    prototypeCards,
    {
      ownedCardIds: prototypeCards.map((cardDefinition) => cardDefinition.id),
      selectedCardId: prototypeCards[2]?.id ?? null,
    },
    "battle"
  );
  assert.equal(
    resolveSelectedCardId(visibleBattleCards, prototypeCards[2]?.id ?? null),
    prototypeCards[2]?.id ?? null
  );

  const visibleSecretCards = getVisibleOwnedCards(
    prototypeCards,
    {
      ownedCardIds: prototypeCards.map((cardDefinition) => cardDefinition.id),
      selectedCardId: prototypeCards[2]?.id ?? null,
    },
    "secret-technique"
  );
  assert.equal(
    resolveSelectedCardId(visibleSecretCards, prototypeCards[2]?.id ?? null),
    prototypeCards[1]?.id ?? null
  );

  const visibleEquipment = getVisibleValuables(prototypeValuables, "equipment");
  assert.equal(
    resolveSelectedValuableId(visibleEquipment, prototypeValuables[1]?.id ?? null),
    prototypeValuables[1]?.id ?? null
  );

  const equippedInventory = equipValuableItem(
    {
      items: prototypeValuables,
      selectedItemId: null,
      equippedWeaponSet: {
        swordId: null,
        armorId: null,
      },
    },
    prototypeValuables[0].id
  );
  assert.equal(equippedInventory.selectedItemId, prototypeValuables[0].id);
  assert.equal(equippedInventory.equippedWeaponSet.swordId, prototypeValuables[0].id);
  assert.equal(equippedInventory.equippedWeaponSet.armorId, null);
});
