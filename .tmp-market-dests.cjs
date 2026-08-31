const { createInitialState } = require('./.test-dist/application/state/create-initial-state.js');
const { ensureCityNpcPoolsForCurrentDay } = require('./.test-dist/application/city-npcs/refresh-city-npc-pools.js');
const { defaultRuntimeContent } = require('./.test-dist/application/content/default-runtime-content.js');
const { SettlementTradeService } = require('./.test-dist/application/markets/settlement-trade-service.js');
const { prototypeCards, prototypeCityNpcPools, prototypeCities, prototypeHouses, prototypeMap, prototypeValuables } = require('./.test-dist/content/prototype-world.js');
const house = prototypeHouses.find((h) => h.moduleId === 'market-house');
const playerCharacterId = 'char.player';
function stateFor(cityId, runtimeCities) {
  defaultRuntimeContent.cities = runtimeCities;
  const s0 = createInitialState({ currentMapId: prototypeMap.id, currentCityId: cityId, currentHouseId: house.id + '.' + cityId, playerCharacterId, chapterId: 'chapter.prototype', year: 1567, month: 1, day: 1, pinnedCharacterId: playerCharacterId, reviewDateText: 'test', mainHouseMissionText: 'test', cards: { ownedCardIds: prototypeCards.map((c) => c.id), selectedCardId: prototypeCards[0]?.id ?? null }, valuables: { items: prototypeValuables, selectedItemId: prototypeValuables[0]?.id ?? null, equippedWeaponSet: { swordId: prototypeValuables.find((v) => v.category === 'weapon')?.id ?? null, armorId: prototypeValuables.find((v) => v.category === 'armor')?.id ?? null } }, currentView: 'house' });
  return ensureCityNpcPoolsForCurrentDay(s0, prototypeCityNpcPools, () => 0.1);
}
const runtimeCities = prototypeCities.map((c) => ({ ...c, name: c.id === 'city.luzhou' ? '庐州路※合肥' : c.name }));
const service = new SettlementTradeService();
for (const cityId of ['city.yingtian','city.kulan','city.anqing','city.taiping']) {
  const summary = service.createInvestigationSummary({ state: stateFor(cityId, runtimeCities), cityId, currentDay: 564121 });
  console.log(cityId, JSON.stringify(summary.highlightedDestinations, null, 2));
}