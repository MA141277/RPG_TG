const { createInitialState } = require('./.test-dist/application/state/create-initial-state.js');
const { ensureCityNpcPoolsForCurrentDay } = require('./.test-dist/application/city-npcs/refresh-city-npc-pools.js');
const { defaultRuntimeContent } = require('./.test-dist/application/content/default-runtime-content.js');
const { marketHouseHouseModule } = require('./.test-dist/application/house-modules/market-house/market-house-house-module.js');
const { renderMarketHouseView } = require('./.test-dist/ui/views/house/market-house-view.js');
const { defaultPackTextEntries } = require('./.test-dist/content/pack-content-access.js');
const { prototypeCards, prototypeCharacters, prototypeCities, prototypeCityNpcPools, prototypeHouses, prototypeMap, prototypeValuables } = require('./.test-dist/content/prototype-world.js');
const marketHouse = prototypeHouses.find((houseDefinition) => houseDefinition.moduleId === 'market-house');
const playerCharacterId = 'char.player';
function createBaseState(houseDefinition) {
  return createInitialState({
    currentMapId: prototypeMap.id,
    currentCityId: houseDefinition.cityId,
    currentHouseId: houseDefinition.id,
    playerCharacterId,
    chapterId: 'chapter.prototype',
    year: 1567,
    month: 1,
    day: 1,
    pinnedCharacterId: playerCharacterId,
    reviewDateText: 'test',
    mainHouseMissionText: 'test',
    cards: {
      ownedCardIds: prototypeCards.map((cardDefinition) => cardDefinition.id),
      selectedCardId: prototypeCards[0]?.id ?? null,
    },
    valuables: {
      items: prototypeValuables,
      selectedItemId: prototypeValuables[0]?.id ?? null,
      equippedWeaponSet: {
        swordId: prototypeValuables.find((valuableDefinition) => valuableDefinition.category === 'weapon')?.id ?? null,
        armorId: prototypeValuables.find((valuableDefinition) => valuableDefinition.category === 'armor')?.id ?? null,
      },
    },
    currentView: 'house',
  });
}

defaultRuntimeContent.cities = prototypeCities;
defaultRuntimeContent.textEntriesById = defaultPackTextEntries;
const state = ensureCityNpcPoolsForCurrentDay(createBaseState(marketHouse), prototypeCityNpcPools, () => 0.1);
const enterResult = marketHouseHouseModule.enter({ gameState: state, characterDefinitions: prototypeCharacters, houseDefinition: marketHouse, playerCharacterId });
const openResult = marketHouseHouseModule.dispatch({ gameState: enterResult.gameState, characterDefinitions: enterResult.characterDefinitions, houseDefinition: marketHouse, playerCharacterId, sessionState: enterResult.sessionState, request: { type: 'action', actionId: 'advance-greeting' } });
const guestActorId = openResult.sessionState?.guestActorIds[0];
const guestResult = marketHouseHouseModule.dispatch({ gameState: openResult.gameState, characterDefinitions: openResult.characterDefinitions, houseDefinition: marketHouse, playerCharacterId, sessionState: openResult.sessionState, request: { type: 'action', actionId: `select-market-actor:${guestActorId}` } });
const guestViewModel = marketHouseHouseModule.selectViewModel({ gameState: guestResult.gameState, characterDefinitions: guestResult.characterDefinitions, houseDefinition: marketHouse, playerCharacterId, sessionState: guestResult.sessionState });
console.log(JSON.stringify({ guestActorId, standbyRoster: guestViewModel.standbyRoster, dialogue: guestViewModel.dialogue }, null, 2));
console.log(renderMarketHouseView(guestViewModel));