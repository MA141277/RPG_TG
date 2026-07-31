import {
  marketHouseBossOpenTextIds,
  marketHouseFixedBoss,
  marketHouseGreetingTextIds,
  marketHouseGuestOpenTextIdsByActorId,
  marketHouseRandomNpcPool,
  marketHouseSmallTalkTextIds,
  type MarketHouseActorContent,
} from "../../../content/houses/market-house-content";
import {
  getRuntimeTradeGoodDefinition,
  runtimeTradeGoodsPool,
} from "../../../content/markets/runtime-trade-goods-pool";
import type { CharacterDefinition } from "../../../domain/character";
import type { CityDefinition } from "../../../domain/city";
import type { HouseDefinition } from "../../../domain/house";
import type {
  HouseActionViewModel,
  HouseModuleDefinition,
  HouseModuleDispatchInput,
  HouseModuleTransitionResult,
  HouseModuleViewModel,
  HouseOverlayViewModel,
} from "../../../domain/house-module";
import type { GameState } from "../../../domain/game-state";
import type {
  MarketHouseSessionState,
} from "../../../domain/house-modules/market-house-session";
import {
  getMarketHouseFavorabilityVariableKey,
  getMarketHouseGuestActorIdsVariableKey,
  getMarketHouseInventoryGoodsIdsVariableKey,
  getMarketHouseLastRefreshDayVariableKey,
  getMarketHouseRefreshAfterDayVariableKey,
  getMarketHouseStockVariableKey,
  getMarketHouseTimeVariableKey,
  type MarketHouseActionOutcome,
  type MarketHouseTradeMode,
} from "../../../domain/market-house";
import type { ShopInventoryEntry } from "../../../domain/market";
import type {
  MarketShopType,
  TradeGoodCategory,
  TradeGoodDefinition,
} from "../../../domain/trade-good";
import { assertExists } from "../../../shared/assert";
import { pickRandom, randomInt } from "../../../shared/random";
import { defaultRuntimeContent } from "../../content/default-runtime-content";
import { resolveTextEntry, resolveTextTemplateEntry } from "../../content/text-resolution";
import { orderHouseStandbyRoster } from "../../house/house-primary-actor-roster";
import {
  applyPlayerItemMutations,
  readPlayerItemQuantity,
} from "../../inventory/player-item-inventory";
import { applySettlementTradeMutations } from "../../markets/apply-settlement-trade-mutations";
import { ensureShopMarketData, readShopMarketData } from "../../markets/market-refresh-system";
import { defaultMarketHouseInvestigationDialogue } from "./market-house-investigation";
import {
  createMarketHouseSettlementTradeOverlay,
  marketHouseSettlementTradeService,
} from "./market-house-settlement-trade";
import { createInitialMarketHouseSessionState } from "./market-house-session-state";

const AVAILABLE_MARKET_SHOPS: MarketShopType[] = [
  "grain-shop",
  "medicine-shop",
  "silk-shop",
  "smithy",
  "horse-market",
  "general-store",
];

const MARKET_HOUSE_SOURCE_SHOPS: MarketShopType[] = [
  "medicine-shop",
  "silk-shop",
  "smithy",
  "general-store",
];

const SELECT_ACTOR_ACTION_PREFIX = "select-market-actor:";
const SELECT_TRADE_GOODS_ACTION_PREFIX = "select-market-goods:";
const SELECT_SETTLEMENT_TRADE_GOODS_ACTION_PREFIX =
  "select-settlement-trade-goods:";
const TRADE_QUANTITY_FIELD_ID = "market-house-trade-quantity";
const SETTLEMENT_TRADE_QUANTITY_FIELD_ID = "settlement-trade-quantity";

type MarketHouseActor = MarketHouseActorContent & {
  favorability: number;
};

type MarketHouseGoodsSnapshot = {
  entry: ShopInventoryEntry;
  goodDefinition: TradeGoodDefinition;
  stockQuantity: number;
  ownedQuantity: number;
  adjustedBuyPrice: number;
  adjustedSellPrice: number;
};

type MarketHouseViewSnapshot = {
  state: GameState;
  cityDefinition: CityDefinition;
  actors: MarketHouseActor[];
  selectedActor: MarketHouseActor | null;
  bossFavorability: number;
  displayedGoods: MarketHouseGoodsSnapshot[];
  sellableGoods: MarketHouseGoodsSnapshot[];
  settlementTradeSupported: boolean;
  refreshAfterDay: number;
  totalOwnedGoods: number;
};

function getFixedHostActorId(houseDefinition: HouseDefinition): string {
  return houseDefinition.defaultCharacterId ?? marketHouseFixedBoss.id;
}

function createFixedHostActor(state: GameState, houseDefinition: HouseDefinition): MarketHouseActor {
  const actorId = getFixedHostActorId(houseDefinition);

  return {
    ...marketHouseFixedBoss,
    id: actorId,
    favorability: readActorFavorability(
      state,
      houseDefinition.id,
      actorId,
      marketHouseFixedBoss.favorability
    ),
  };
}

function findFixedHostActor(
  actors: MarketHouseActor[],
  houseDefinition: HouseDefinition
): MarketHouseActor | null {
  const actorId = getFixedHostActorId(houseDefinition);
  return actors.find((actor) => actor.id === actorId) ?? null;
}

function getPlayerCharacter(
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string
): CharacterDefinition {
  const playerCharacter = characterDefinitions.find(
    (characterDefinition) => characterDefinition.id === playerCharacterId
  );
  assertExists(
    playerCharacter,
    `Player character not found for id "${playerCharacterId}" in market house module.`
  );
  return playerCharacter;
}

function getCityDefinition(cityId: string): CityDefinition {
  const cityDefinition = defaultRuntimeContent.cities.find(
    (candidateCity) => candidateCity.id === cityId
  );
  assertExists(cityDefinition, `City definition missing for id "${cityId}" in market house module.`);
  return cityDefinition;
}

function getTradeGoodDefinition(goodsId: string): TradeGoodDefinition {
  const goodDefinition = getRuntimeTradeGoodDefinition(goodsId);
  assertExists(goodDefinition, `Trade good definition missing for id "${goodsId}".`);
  return goodDefinition;
}

function getCategoryLabel(category: TradeGoodCategory): string {
  switch (category) {
    case "grain":
      return "粮食";
    case "medicine":
      return "药材";
    case "silk":
      return "奢侈品";
    case "arms":
      return "军械";
    case "horses":
      return "马匹";
    case "special":
      return "奇货";
    case "seafood":
      return "海货";
    case "industrial":
      return "工料";
    case "fruit":
      return "果品";
    case "misc":
      return "杂货";
    default:
      return category;
  }
}

function readNumericVariable(state: GameState, key: string, fallback: number): number {
  const value = state.runtime.variables[key];
  return typeof value === "number" ? value : fallback;
}

function readStringVariable(state: GameState, key: string, fallback = ""): string {
  const value = state.runtime.variables[key];
  return typeof value === "string" ? value : fallback;
}

function withVariable(state: GameState, key: string, value: number | string): GameState {
  return {
    ...state,
    runtime: {
      ...state.runtime,
      variables: {
        ...state.runtime.variables,
        [key]: value,
      },
    },
  };
}

function createTransitionResult(
  input: Pick<
    HouseModuleDispatchInput<"market-house">,
    "gameState" | "characterDefinitions" | "sessionState"
  >,
  patch?: Partial<HouseModuleTransitionResult<"market-house">>
): HouseModuleTransitionResult<"market-house"> {
  return {
    gameState: patch?.gameState ?? input.gameState,
    characterDefinitions: patch?.characterDefinitions ?? input.characterDefinitions,
    sessionState: patch?.sessionState ?? input.sessionState,
    ...(patch?.sideEffects == null ? {} : { sideEffects: patch.sideEffects }),
  };
}

function withSessionState(
  input: Pick<
    HouseModuleDispatchInput<"market-house">,
    "gameState" | "characterDefinitions"
  >,
  sessionState: MarketHouseSessionState | null,
  patch: Partial<MarketHouseSessionState>
): HouseModuleTransitionResult<"market-house"> {
  if (sessionState == null) {
    return {
      gameState: input.gameState,
      characterDefinitions: input.characterDefinitions,
      sessionState,
    };
  }

  return {
    gameState: input.gameState,
    characterDefinitions: input.characterDefinitions,
    sessionState: {
      ...sessionState,
      ...patch,
    },
  };
}

function createAlertOverlay(
  title: string,
  paragraphs: string[],
  tone?: "info" | "success" | "warning"
): NonNullable<MarketHouseSessionState["overlay"]> {
  return {
    type: "alert",
    title,
    paragraphs,
    ...(tone == null ? {} : { tone }),
  };
}

function sampleWithoutReplacement<T>(items: readonly T[], count: number): T[] {
  const pool = [...items];
  const result: T[] = [];

  while (pool.length > 0 && result.length < count) {
    const index = randomInt(0, pool.length - 1);
    const [pickedItem] = pool.splice(index, 1);
    if (pickedItem != null) {
      result.push(pickedItem);
    }
  }

  return result;
}

function getCalendarDayNumber(state: GameState): number {
  return state.calendar.year * 360 + (state.calendar.month - 1) * 30 + state.calendar.day;
}

function parseIdList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function ensureMarketShops(gameState: GameState, cityDefinition: CityDefinition): GameState {
  let nextState = gameState;

  for (const shopType of AVAILABLE_MARKET_SHOPS) {
    nextState = ensureShopMarketData(nextState, cityDefinition, shopType).state;
  }

  return nextState;
}

function collectCityMarketEntries(
  gameState: GameState,
  cityDefinition: CityDefinition,
  sourceShops: readonly MarketShopType[] = MARKET_HOUSE_SOURCE_SHOPS
): Array<{ entry: ShopInventoryEntry; goodDefinition: TradeGoodDefinition }> {
  return sourceShops.flatMap((shopType) => {
    const marketData = readShopMarketData(gameState, cityDefinition.id, shopType);
    if (marketData == null) {
      return [];
    }

    return marketData.inventory.map((entry) => ({
      entry,
      goodDefinition: getTradeGoodDefinition(entry.goodsId),
    }));
  });
}

function readActorFavorability(
  state: GameState,
  houseId: string,
  actorId: string,
  fallback: number
): number {
  return readNumericVariable(
    state,
    getMarketHouseFavorabilityVariableKey(houseId, actorId),
    fallback
  );
}

function createActors(
  state: GameState,
  houseDefinition: HouseDefinition,
  guestActorIds: string[]
): MarketHouseActor[] {
  const fixedHostActor = createFixedHostActor(state, houseDefinition);
  const actors: MarketHouseActor[] = [fixedHostActor];

  guestActorIds.forEach((guestActorId) => {
    const actorDefinition = marketHouseRandomNpcPool.find((actor) => actor.id === guestActorId);
    if (actorDefinition == null || actorDefinition.id === fixedHostActor.id) {
      return;
    }

    actors.push({
      ...actorDefinition,
      favorability: readActorFavorability(
        state,
        houseDefinition.id,
        actorDefinition.id,
        actorDefinition.favorability
      ),
    });
  });

  return actors;
}

function getBuyPriceModifier(favorability: number): number {
  return Math.max(0.88, Math.min(1.12, Number((1 - favorability * 0.005).toFixed(3))));
}

function getSellPriceModifier(favorability: number): number {
  return Math.max(0.88, Math.min(1.08, Number((1 + favorability * 0.004).toFixed(3))));
}

function adjustBuyPrice(basePrice: number, favorability: number): number {
  return Math.max(1, Math.round(basePrice * getBuyPriceModifier(favorability)));
}

function adjustSellPrice(baseSellPrice: number, adjustedBuyPrice: number, favorability: number): number {
  return Math.max(
    1,
    Math.min(adjustedBuyPrice - 1, Math.round(baseSellPrice * getSellPriceModifier(favorability)))
  );
}

function ensureMarketHouseRuntime(
  gameState: GameState,
  houseDefinition: HouseDefinition
): {
  state: GameState;
  cityDefinition: CityDefinition;
  guestActorIds: string[];
  inventoryGoodsIds: string[];
  refreshAfterDay: number;
} {
  const cityDefinition = getCityDefinition(houseDefinition.cityId);
  let nextState = ensureMarketShops(gameState, cityDefinition);
  const currentDay = getCalendarDayNumber(nextState);
  const guestActorIdsKey = getMarketHouseGuestActorIdsVariableKey(houseDefinition.id);
  const goodsIdsKey = getMarketHouseInventoryGoodsIdsVariableKey(houseDefinition.id);
  const refreshAfterDayKey = getMarketHouseRefreshAfterDayVariableKey(houseDefinition.id);
  const guestActorIds = parseIdList(readStringVariable(nextState, guestActorIdsKey));
  const inventoryGoodsIds = parseIdList(readStringVariable(nextState, goodsIdsKey));
  const refreshAfterDay = readNumericVariable(nextState, refreshAfterDayKey, -1);
  const shouldRefresh =
    guestActorIds.length === 0 ||
    inventoryGoodsIds.length === 0 ||
    currentDay >= refreshAfterDay;

  if (!shouldRefresh) {
    return {
      state: nextState,
      cityDefinition,
      guestActorIds,
      inventoryGoodsIds,
      refreshAfterDay,
    };
  }

  const cityEntries = collectCityMarketEntries(nextState, cityDefinition);
  const selectedEntries = sampleWithoutReplacement(
    cityEntries,
    Math.min(randomInt(4, 8), cityEntries.length)
  );
  const nextGoodsIds = selectedEntries.map(({ goodDefinition }) => goodDefinition.id);
  const nextGuestActorIds = sampleWithoutReplacement(
    marketHouseRandomNpcPool.map((actor) => actor.id),
    Math.min(randomInt(1, 2), marketHouseRandomNpcPool.length)
  );
  const nextRefreshAfterDay = currentDay + randomInt(3, 7);

  nextState = withVariable(
    nextState,
    getMarketHouseLastRefreshDayVariableKey(houseDefinition.id),
    currentDay
  );
  nextState = withVariable(nextState, refreshAfterDayKey, nextRefreshAfterDay);
  nextState = withVariable(nextState, guestActorIdsKey, nextGuestActorIds.join(","));
  nextState = withVariable(nextState, goodsIdsKey, nextGoodsIds.join(","));

  nextGoodsIds.forEach((goodsId) => {
    nextState = withVariable(
      nextState,
      getMarketHouseStockVariableKey(houseDefinition.id, goodsId),
      randomInt(2, 8)
    );
  });

  return {
    state: nextState,
    cityDefinition,
    guestActorIds: nextGuestActorIds,
    inventoryGoodsIds: nextGoodsIds,
    refreshAfterDay: nextRefreshAfterDay,
  };
}

function createGoodsSnapshots(
  state: GameState,
  houseDefinition: HouseDefinition,
  cityDefinition: CityDefinition,
  goodsIds: string[],
  bossFavorability: number
): MarketHouseGoodsSnapshot[] {
  const cityEntries = collectCityMarketEntries(state, cityDefinition);

  return goodsIds
    .map((goodsId) => {
      const matchedEntry = cityEntries.find(({ entry }) => entry.goodsId === goodsId);
      if (matchedEntry == null) {
        return null;
      }

      const adjustedBuyPrice = adjustBuyPrice(matchedEntry.entry.buyPrice, bossFavorability);

      return {
        entry: matchedEntry.entry,
        goodDefinition: matchedEntry.goodDefinition,
        stockQuantity: readNumericVariable(
          state,
          getMarketHouseStockVariableKey(houseDefinition.id, goodsId),
          0
        ),
        ownedQuantity: readOwnedMarketGoodsQuantity(state, goodsId),
        adjustedBuyPrice,
        adjustedSellPrice: adjustSellPrice(
          matchedEntry.entry.sellPrice,
          adjustedBuyPrice,
          bossFavorability
        ),
      };
    })
    .filter((snapshot): snapshot is MarketHouseGoodsSnapshot => snapshot != null);
}

function createSellableGoodsSnapshots(
  state: GameState,
  houseDefinition: HouseDefinition,
  cityDefinition: CityDefinition,
  bossFavorability: number
): MarketHouseGoodsSnapshot[] {
  const cityEntries = collectCityMarketEntries(state, cityDefinition);

  return cityEntries
    .map(({ entry, goodDefinition }) => {
      const ownedQuantity = readOwnedMarketGoodsQuantity(state, entry.goodsId);
      if (ownedQuantity <= 0) {
        return null;
      }

      const adjustedBuyPrice = adjustBuyPrice(entry.buyPrice, bossFavorability);
      return {
        entry,
        goodDefinition,
        stockQuantity: readNumericVariable(
          state,
          getMarketHouseStockVariableKey(houseDefinition.id, entry.goodsId),
          0
        ),
        ownedQuantity,
        adjustedBuyPrice,
        adjustedSellPrice: adjustSellPrice(entry.sellPrice, adjustedBuyPrice, bossFavorability),
      };
    })
    .filter((snapshot): snapshot is MarketHouseGoodsSnapshot => snapshot != null);
}

function createViewSnapshot(
  gameState: GameState,
  houseDefinition: HouseDefinition,
  sessionState: MarketHouseSessionState | null
): MarketHouseViewSnapshot {
  const runtime = ensureMarketHouseRuntime(gameState, houseDefinition);
  const actors = createActors(runtime.state, houseDefinition, runtime.guestActorIds);
  const fixedHostActor = findFixedHostActor(actors, houseDefinition);
  const bossFavorability = fixedHostActor?.favorability ?? marketHouseFixedBoss.favorability;
  const displayedGoods = createGoodsSnapshots(
    runtime.state,
    houseDefinition,
    runtime.cityDefinition,
    runtime.inventoryGoodsIds,
    bossFavorability
  );
  const sellableGoods = createSellableGoodsSnapshots(
    runtime.state,
    houseDefinition,
    runtime.cityDefinition,
    bossFavorability
  );
  const fixedHostActorId = getFixedHostActorId(houseDefinition);
  const selectedActorId = sessionState?.selectedActorId ?? fixedHostActorId;
  const selectedActor =
    actors.find((actor) => actor.id === selectedActorId) ??
    fixedHostActor ??
    null;

  return {
    state: runtime.state,
    cityDefinition: runtime.cityDefinition,
    actors,
    selectedActor,
    bossFavorability,
    displayedGoods,
    sellableGoods,
    settlementTradeSupported: isSettlementTradeSupported(
      runtime.state,
      runtime.cityDefinition
    ),
    refreshAfterDay: runtime.refreshAfterDay,
    totalOwnedGoods: sellableGoods.reduce((sum, snapshot) => sum + snapshot.ownedQuantity, 0),
  };
}

function getMarketTextEntries(
  textEntriesById?: Record<string, string>
): Record<string, string> {
  return textEntriesById ?? defaultRuntimeContent.textEntriesById ?? {};
}

function resolveMarketText(
  textEntriesById: Record<string, string>,
  textId: string,
  fallback?: string
): string {
  return resolveTextEntry(
    textEntriesById,
    textId,
    fallback ?? `MISSING_TEXT:${textId}`
  );
}

function resolveMarketTemplateText(
  textEntriesById: Record<string, string>,
  textId: string,
  values: Record<string, string | number | boolean | null | undefined>,
  fallback?: string
): string {
  return resolveTextTemplateEntry(
    textEntriesById,
    textId,
    values,
    fallback ?? `MISSING_TEXT:${textId}`
  );
}

function resolveMarketTextLines(
  textEntriesById: Record<string, string>,
  textIds: readonly string[]
): string[] {
  return textIds.map((textId) => resolveMarketText(textEntriesById, textId));
}

function pickRandomResolvedMarketText(
  textEntriesById: Record<string, string>,
  textIds: readonly string[]
): string {
  const textId = pickRandom(textIds);
  return resolveMarketText(textEntriesById, textId);
}

function getInitialMarketHouseDialogueLines(
  textEntriesById?: Record<string, string>
): string[] {
  return resolveMarketTextLines(
    getMarketTextEntries(textEntriesById),
    marketHouseGreetingTextIds
  );
}

function getActorOpenLines(
  actor: MarketHouseActor,
  textEntriesById?: Record<string, string>
): string[] {
  const entries = getMarketTextEntries(textEntriesById);
  if (actor.isFixedHost) {
    return resolveMarketTextLines(entries, marketHouseBossOpenTextIds);
  }

  const textIds = marketHouseGuestOpenTextIdsByActorId[actor.id];
  if (textIds != null) {
    return resolveMarketTextLines(entries, textIds);
  }

  return [
    resolveMarketText(
      entries,
      "runtime.zhu_yuanzhang.market_house.guest_open.default.001"
    ),
    resolveMarketTemplateText(
      entries,
      "runtime.zhu_yuanzhang.market_house.guest_open.default.002",
      { specialty: actor.specialty }
    ),
  ];
}

function parseSelectedActorId(actionId: string): string | null {
  return actionId.startsWith(SELECT_ACTOR_ACTION_PREFIX)
    ? actionId.slice(SELECT_ACTOR_ACTION_PREFIX.length)
    : null;
}

function parseSelectedGoodsId(actionId: string): string | null {
  return actionId.startsWith(SELECT_TRADE_GOODS_ACTION_PREFIX)
    ? actionId.slice(SELECT_TRADE_GOODS_ACTION_PREFIX.length)
    : null;
}

function parseSelectedSettlementTradeGoodsId(actionId: string): string | null {
  return actionId.startsWith(SELECT_SETTLEMENT_TRADE_GOODS_ACTION_PREFIX)
    ? actionId.slice(SELECT_SETTLEMENT_TRADE_GOODS_ACTION_PREFIX.length)
    : null;
}

function createTradeOverlay(
  mode: MarketHouseTradeMode,
  goodsSnapshots: MarketHouseGoodsSnapshot[],
  selectedGoodsId: string | null
): NonNullable<MarketHouseSessionState["overlay"]> {
  const resolvedGoodsId =
    goodsSnapshots.find((snapshot) => snapshot.goodDefinition.id === selectedGoodsId)?.goodDefinition.id ??
    goodsSnapshots[0]?.goodDefinition.id ??
    null;

  return {
    type: "market-trade",
    mode,
    selectedGoodsId: resolvedGoodsId,
    quantity: 1,
  };
}

function updateTradeOverlayQuantity(
  input: Pick<HouseModuleDispatchInput<"market-house">, "gameState" | "characterDefinitions">,
  sessionState: MarketHouseSessionState | null,
  quantity: number
): HouseModuleTransitionResult<"market-house"> {
  const overlay = sessionState?.overlay;
  if (
    overlay == null ||
    (overlay.type !== "market-trade" && overlay.type !== "settlement-trade")
  ) {
    return {
      gameState: input.gameState,
      characterDefinitions: input.characterDefinitions,
      sessionState,
    };
  }

  return withSessionState(input, sessionState, {
    overlay: {
      ...overlay,
      quantity: Math.max(1, quantity),
    },
  });
}

function mutatePlayerGold(
  state: GameState,
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string,
  delta: number
): {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
} {
  return {
    state,
    characterDefinitions: characterDefinitions.map((characterDefinition) => {
      if (characterDefinition.id !== playerCharacterId) {
        return characterDefinition;
      }

      return {
        ...characterDefinition,
        stats: {
          ...characterDefinition.stats,
          gold: characterDefinition.stats.gold + delta,
        },
      };
    }),
  };
}

function readOwnedMarketGoodsQuantity(state: GameState, goodsId: string): number {
  return readPlayerItemQuantity(state, goodsId, ["market-house"]);
}

function mutateHouseStock(
  state: GameState,
  houseId: string,
  goodsId: string,
  delta: number
): GameState {
  const nextQuantity = Math.max(
    0,
    readNumericVariable(state, getMarketHouseStockVariableKey(houseId, goodsId), 0) + delta
  );
  return withVariable(state, getMarketHouseStockVariableKey(houseId, goodsId), nextQuantity);
}

function mutateActorFavorability(
  state: GameState,
  houseId: string,
  actorId: string,
  fallbackFavorability: number,
  delta: number
): GameState {
  return withVariable(
    state,
    getMarketHouseFavorabilityVariableKey(houseId, actorId),
    readNumericVariable(
      state,
      getMarketHouseFavorabilityVariableKey(houseId, actorId),
      fallbackFavorability
    ) + delta
  );
}

function increaseMarketHouseTime(state: GameState, houseId: string, delta: number): GameState {
  return withVariable(
    state,
    getMarketHouseTimeVariableKey(houseId),
    readNumericVariable(state, getMarketHouseTimeVariableKey(houseId), 1) + delta
  );
}

function formatOutcomeSummary(
  outcome: MarketHouseActionOutcome,
  goodsPool = runtimeTradeGoodsPool
): string[] {
  const summaryLines = [
    `金钱 ${outcome.moneyChange >= 0 ? "+" : ""}${outcome.moneyChange}`,
    `关系 ${outcome.relationshipChange >= 0 ? "+" : ""}${outcome.relationshipChange}`,
    `时间 +${outcome.timeCost}`,
  ];

  if (outcome.inventoryChange.length > 0) {
    summaryLines.push(
      ...outcome.inventoryChange.map((change) => {
        const goodsName =
          goodsPool.find((goodsDefinition) => goodsDefinition.id === change.goodsId)?.name ??
          change.goodsId;
        return `${goodsName} ${change.quantity >= 0 ? "+" : ""}${change.quantity}`;
      })
    );
  }

  return summaryLines;
}

function applyActionOutcome(
  input: Pick<
    HouseModuleDispatchInput<"market-house">,
    "gameState" | "characterDefinitions" | "playerCharacterId" | "houseDefinition"
  >,
  actor: MarketHouseActor,
  outcome: MarketHouseActionOutcome
): {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
} {
  let nextState = input.gameState;
  let nextCharacterDefinitions = input.characterDefinitions;

  const goldMutation = mutatePlayerGold(
    nextState,
    nextCharacterDefinitions,
    input.playerCharacterId,
    outcome.moneyChange
  );
  nextState = goldMutation.state;
  nextCharacterDefinitions = goldMutation.characterDefinitions;

  if (outcome.inventoryChange.length > 0) {
    nextState = applyPlayerItemMutations(
      nextState,
      outcome.inventoryChange
        .filter((change) => change.quantity !== 0)
        .map((change) => ({
          itemId: change.goodsId,
          delta: change.quantity,
          legacySources: ["market-house"] as const,
        }))
    );
  }

  outcome.inventoryChange.forEach((change) => {
    if (change.quantity > 0) {
      nextState = mutateHouseStock(nextState, input.houseDefinition.id, change.goodsId, -change.quantity);
      return;
    }

    if (change.quantity < 0) {
      nextState = mutateHouseStock(nextState, input.houseDefinition.id, change.goodsId, -change.quantity);
    }
  });

  if (outcome.relationshipChange !== 0) {
    nextState = mutateActorFavorability(
      nextState,
      input.houseDefinition.id,
      actor.id,
      actor.favorability,
      outcome.relationshipChange
    );
  }

  return {
    state: increaseMarketHouseTime(nextState, input.houseDefinition.id, outcome.timeCost),
    characterDefinitions: nextCharacterDefinitions,
  };
}

function isSettlementTradeSupported(
  state: GameState,
  cityDefinition: CityDefinition
): boolean {
  return marketHouseSettlementTradeService.createSnapshot({
    state,
    cityId: cityDefinition.id,
    currentDay: getCalendarDayNumber(state),
  }).supported;
}

function pickInvestigationDialogueLines(
  state: GameState,
  cityDefinition: CityDefinition
): string[] {
  return defaultMarketHouseInvestigationDialogue.createDialogueLines({
    state,
    cityId: cityDefinition.id,
    currentDay: getCalendarDayNumber(state),
  });
}

function createPriceTone(price: number, referencePrice: number): "low" | "high" | "neutral" {
  if (price < referencePrice) {
    return "low";
  }
  if (price > referencePrice) {
    return "high";
  }
  return "neutral";
}

function selectOverlayViewModel(
  overlay: MarketHouseSessionState["overlay"],
  snapshot: MarketHouseViewSnapshot
): HouseOverlayViewModel | null {
  if (overlay == null) {
    return null;
  }

  if (overlay.type === "alert") {
    return {
      type: "alert",
      title: overlay.title,
      paragraphs: overlay.paragraphs,
      ...(overlay.tone == null ? {} : { tone: overlay.tone }),
      confirmActionId: "close-alert",
      confirmLabel: "知道了",
    };
  }

  if (overlay.type === "settlement-trade") {
    return createMarketHouseSettlementTradeOverlay({
      state: snapshot.state,
      cityId: snapshot.cityDefinition.id,
      currentDay: getCalendarDayNumber(snapshot.state),
      overlay,
    });
  }

  const rowsSource = overlay.mode === "buy" ? snapshot.displayedGoods : snapshot.sellableGoods;
  const selectedSnapshot =
    rowsSource.find((goodsSnapshot) => goodsSnapshot.goodDefinition.id === overlay.selectedGoodsId) ??
    rowsSource[0] ??
    null;
  const currentPrice =
    overlay.mode === "buy"
      ? (selectedSnapshot?.adjustedBuyPrice ?? 0)
      : (selectedSnapshot?.adjustedSellPrice ?? 0);
  const availableQuantity =
    overlay.mode === "buy"
      ? (selectedSnapshot?.stockQuantity ?? 0)
      : (selectedSnapshot?.ownedQuantity ?? 0);

  return {
    type: "market-trade",
    title: overlay.mode === "buy" ? "买入商品" : "出售商品",
    mode: overlay.mode,
    quantity: overlay.quantity,
    quantityFieldId: TRADE_QUANTITY_FIELD_ID,
    decrementActionId: "trade-qty-minus",
    incrementActionId: "trade-qty-plus",
    confirmActionId: "confirm-trade",
    confirmLabel: overlay.mode === "buy" ? "确认购买" : "确认出售",
    cancelActionId: "close-trade",
    cancelLabel: "取消",
    rows: rowsSource.map((goodsSnapshot) => {
      const currentModePrice =
        overlay.mode === "buy"
          ? goodsSnapshot.adjustedBuyPrice
          : goodsSnapshot.adjustedSellPrice;
      const quantityLabel =
        overlay.mode === "buy"
          ? `库存 ${goodsSnapshot.stockQuantity}${goodsSnapshot.goodDefinition.unit}`
          : `持有 ${goodsSnapshot.ownedQuantity}${goodsSnapshot.goodDefinition.unit}`;

      return {
        goodsId: goodsSnapshot.goodDefinition.id,
        name: goodsSnapshot.goodDefinition.name,
        categoryLabel: getCategoryLabel(goodsSnapshot.goodDefinition.category),
        currentPrice: currentModePrice,
        referencePrice: goodsSnapshot.goodDefinition.basePrice,
        unit: goodsSnapshot.goodDefinition.unit,
        quantityLabel,
        priceTone: createPriceTone(currentModePrice, goodsSnapshot.goodDefinition.basePrice),
        isSelected: goodsSnapshot.goodDefinition.id === selectedSnapshot?.goodDefinition.id,
      };
    }),
    selectedSummary:
      selectedSnapshot == null
        ? null
        : {
            goodsId: selectedSnapshot.goodDefinition.id,
            name: selectedSnapshot.goodDefinition.name,
            categoryLabel: getCategoryLabel(selectedSnapshot.goodDefinition.category),
            currentPrice,
            referencePrice: selectedSnapshot.goodDefinition.basePrice,
            unit: selectedSnapshot.goodDefinition.unit,
            availableQuantity,
            quantityLabel:
              overlay.mode === "buy"
                ? `库存 ${availableQuantity}${selectedSnapshot.goodDefinition.unit}`
                : `持有 ${availableQuantity}${selectedSnapshot.goodDefinition.unit}`,
            tradeTotal: currentPrice * overlay.quantity,
            priceTone: createPriceTone(currentPrice, selectedSnapshot.goodDefinition.basePrice),
          },
    helperLines:
      overlay.mode === "buy"
        ? [
            "绿色代表低于参考均价，红色代表高于参考均价。",
            "货栈买入价会随钱掌柜关系略有浮动。",
          ]
        : [
            "出售按当前城市卖出价结算。",
            "货栈始终保留买卖差价，无法原地无限刷钱。",
          ],
  };
}

function handleField(
  input: HouseModuleDispatchInput<"market-house">,
  sessionState: MarketHouseSessionState | null
): HouseModuleTransitionResult<"market-house"> {
  if (input.request.type !== "field") {
    return createTransitionResult(input);
  }

  if (
    input.request.fieldId !== TRADE_QUANTITY_FIELD_ID &&
    input.request.fieldId !== SETTLEMENT_TRADE_QUANTITY_FIELD_ID
  ) {
    return createTransitionResult(input);
  }

  return updateTradeOverlayQuantity(
    input,
    sessionState,
    Math.max(1, parseInt(input.request.value, 10) || 1)
  );
}

function handleAction(
  input: HouseModuleDispatchInput<"market-house">,
  sessionState: MarketHouseSessionState | null
): HouseModuleTransitionResult<"market-house"> {
  if (input.request.type !== "action") {
    return createTransitionResult(input);
  }

  const snapshot = createViewSnapshot(input.gameState, input.houseDefinition, sessionState);
  const selectedActor = snapshot.selectedActor;
  const currentOverlay = sessionState?.overlay;

  if (input.request.actionId === "advance-greeting") {
    const fixedHostActor = findFixedHostActor(snapshot.actors, input.houseDefinition);
    if (fixedHostActor == null) {
      return createTransitionResult(input, { gameState: snapshot.state });
    }

    return withSessionState(
      {
        gameState: snapshot.state,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        selectedActorId: fixedHostActor.id,
        dialoguePhase: "open",
        dialogueLines: getActorOpenLines(fixedHostActor, input.textEntriesById),
        overlay: null,
      }
    );
  }

  if (input.request.actionId === "advance-investigation-report") {
    const fixedHostActor = findFixedHostActor(snapshot.actors, input.houseDefinition);
    if (fixedHostActor == null) {
      return createTransitionResult(input, { gameState: snapshot.state });
    }

    return withSessionState(
      {
        gameState: snapshot.state,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        selectedActorId: fixedHostActor.id,
        dialoguePhase: "open",
        dialogueLines: getActorOpenLines(fixedHostActor, input.textEntriesById),
        overlay: null,
      }
    );
  }

  if (input.request.actionId === "dismiss-dialogue") {
    return withSessionState(
      {
        gameState: snapshot.state,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        dialoguePhase: "idle",
        overlay: null,
      }
    );
  }

  if (
    input.request.actionId === "close-alert" ||
    input.request.actionId === "close-trade" ||
    input.request.actionId === "close-settlement-trade"
  ) {
    return withSessionState(
      {
        gameState: snapshot.state,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        overlay: null,
      }
    );
  }

  const selectedActorId = parseSelectedActorId(input.request.actionId);
  if (selectedActorId != null) {
    const actor = snapshot.actors.find((candidateActor) => candidateActor.id === selectedActorId);
    if (actor == null) {
      return createTransitionResult(input, { gameState: snapshot.state });
    }

    return withSessionState(
      {
        gameState: snapshot.state,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        selectedActorId: actor.id,
        dialoguePhase: "open",
        dialogueLines: getActorOpenLines(actor, input.textEntriesById),
        overlay: null,
      }
    );
  }

  if (selectedActor == null) {
    return createTransitionResult(input, { gameState: snapshot.state });
  }

  if (input.request.actionId === "small-talk") {
    const outcome: MarketHouseActionOutcome = {
      moneyChange: 0,
      inventoryChange: [],
      relationshipChange: 1,
      timeCost: 1,
      marketMessage: pickRandomResolvedMarketText(
        getMarketTextEntries(input.textEntriesById),
        marketHouseSmallTalkTextIds
      ),
    };
    const mutation = applyActionOutcome(input, selectedActor, outcome);

    return {
      ...withSessionState(
        {
          gameState: mutation.state,
          characterDefinitions: mutation.characterDefinitions,
        },
        sessionState,
        {
          dialoguePhase: "open",
          dialogueLines: [outcome.marketMessage],
          overlay: createAlertOverlay(
            resolveMarketText(
              getMarketTextEntries(input.textEntriesById),
              "runtime.zhu_yuanzhang.market_house.small_talk.overlay.title"
            ),
            [
              outcome.marketMessage,
              ...formatOutcomeSummary(outcome),
            ],
            "success"
          ),
        }
      ),
      timeAdvanceCost: outcome.timeCost,
    };
  }

  if (input.request.actionId === "investigate-market") {
    if (!selectedActor.isFixedHost) {
      return withSessionState(
        {
          gameState: snapshot.state,
          characterDefinitions: input.characterDefinitions,
        },
        sessionState,
        {
          overlay: createAlertOverlay(
            "不能打听",
            ["这位客商只谈自家门路，不替货栈报行情。"],
            "warning"
          ),
        }
      );
    }

    const outcome: MarketHouseActionOutcome = {
      moneyChange: 0,
      inventoryChange: [],
      relationshipChange: 0,
      timeCost: 1,
      marketMessage: pickInvestigationDialogueLines(
        snapshot.state,
        snapshot.cityDefinition
      ).join("\n"),
    };
    const mutation = applyActionOutcome(input, selectedActor, outcome);

    return {
      ...withSessionState(
        {
          gameState: mutation.state,
          characterDefinitions: mutation.characterDefinitions,
        },
        sessionState,
        {
          dialoguePhase: "investigation-report",
          dialogueLines: outcome.marketMessage.split("\n"),
          overlay: null,
        }
      ),
      timeAdvanceCost: outcome.timeCost,
    };
  }

  if (input.request.actionId === "buy-goods") {
    if (!selectedActor.isFixedHost) {
      return withSessionState(
        {
          gameState: snapshot.state,
          characterDefinitions: input.characterDefinitions,
        },
        sessionState,
        {
          overlay: createAlertOverlay("不能交易", ["这位商人只愿和你聊聊行情。"], "warning"),
        }
      );
    }

    const buyableGoods = snapshot.displayedGoods.filter((goodsSnapshot) => goodsSnapshot.stockQuantity > 0);
    if (buyableGoods.length === 0) {
      return withSessionState(
        {
          gameState: snapshot.state,
          characterDefinitions: input.characterDefinitions,
        },
        sessionState,
        {
          overlay: createAlertOverlay("暂无存货", ["货栈这一轮的货已经卖空了。"], "warning"),
        }
      );
    }

    return withSessionState(
      {
        gameState: snapshot.state,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        overlay: createTradeOverlay("buy", buyableGoods, currentOverlay?.type === "market-trade" ? currentOverlay.selectedGoodsId : null),
      }
    );
  }

  if (input.request.actionId === "sell-goods") {
    if (!selectedActor.isFixedHost) {
      return withSessionState(
        {
          gameState: snapshot.state,
          characterDefinitions: input.characterDefinitions,
        },
        sessionState,
        {
          overlay: createAlertOverlay("不能交易", ["这位商人不直接收货，只愿和你谈谈市面。"], "warning"),
        }
      );
    }

    if (snapshot.sellableGoods.length === 0) {
      return withSessionState(
        {
          gameState: snapshot.state,
          characterDefinitions: input.characterDefinitions,
        },
        sessionState,
        {
          overlay: createAlertOverlay("无货可卖", ["你现在身上没有可在本城出手的货物。"], "warning"),
        }
      );
    }

    return withSessionState(
      {
        gameState: snapshot.state,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        overlay: createTradeOverlay("sell", snapshot.sellableGoods, currentOverlay?.type === "market-trade" ? currentOverlay.selectedGoodsId : null),
      }
    );
  }

  if (
    input.request.actionId === "open-settlement-trade-buy" ||
    input.request.actionId === "open-settlement-trade-sell"
  ) {
    if (!selectedActor.isFixedHost) {
      return withSessionState(
        {
          gameState: snapshot.state,
          characterDefinitions: input.characterDefinitions,
        },
        sessionState,
        {
          overlay: createAlertOverlay(
            "Cannot trade specialty goods",
            ["Only the head shopkeeper can settle city specialty trades."],
            "warning"
          ),
        }
      );
    }

    const settlementSnapshot = marketHouseSettlementTradeService.createSnapshot({
      state: snapshot.state,
      cityId: snapshot.cityDefinition.id,
      currentDay: getCalendarDayNumber(snapshot.state),
    });

    if (!settlementSnapshot.supported || settlementSnapshot.rows.length === 0) {
      return withSessionState(
        {
          gameState: snapshot.state,
          characterDefinitions: input.characterDefinitions,
        },
        sessionState,
        {
          overlay: createAlertOverlay(
            "Specialty market unavailable",
            ["This city does not currently support a specialty market overlay."],
            "warning"
          ),
        }
      );
    }

    return withSessionState(
      {
        gameState: snapshot.state,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        overlay: {
          type: "settlement-trade",
          mode:
            input.request.actionId === "open-settlement-trade-buy"
              ? "buy"
              : "sell",
          selectedGoodsId: settlementSnapshot.rows[0]?.goodsId ?? null,
          quantity: 1,
        },
      }
    );
  }

  const selectedGoodsId = parseSelectedGoodsId(input.request.actionId);
  if (selectedGoodsId != null && currentOverlay?.type === "market-trade") {
    return withSessionState(
      {
        gameState: snapshot.state,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        overlay: {
          ...currentOverlay,
          selectedGoodsId,
          quantity: 1,
        },
      }
    );
  }

  const selectedSettlementTradeGoodsId = parseSelectedSettlementTradeGoodsId(
    input.request.actionId
  );
  if (
    selectedSettlementTradeGoodsId != null &&
    currentOverlay?.type === "settlement-trade"
  ) {
    return withSessionState(
      {
        gameState: snapshot.state,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
        {
          overlay: {
            ...currentOverlay,
            selectedGoodsId:
              selectedSettlementTradeGoodsId as typeof currentOverlay.selectedGoodsId,
            quantity: 1,
          },
        }
      );
  }

  if (input.request.actionId === "trade-qty-minus" && currentOverlay?.type === "market-trade") {
    return updateTradeOverlayQuantity(
      {
        gameState: snapshot.state,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      currentOverlay.quantity - 1
    );
  }

  if (input.request.actionId === "trade-qty-plus" && currentOverlay?.type === "market-trade") {
    return updateTradeOverlayQuantity(
      {
        gameState: snapshot.state,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      currentOverlay.quantity + 1
    );
  }

  if (
    input.request.actionId === "settlement-trade-qty-minus" &&
    currentOverlay?.type === "settlement-trade"
  ) {
    return updateTradeOverlayQuantity(
      {
        gameState: snapshot.state,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      currentOverlay.quantity - 1
    );
  }

  if (
    input.request.actionId === "settlement-trade-qty-plus" &&
    currentOverlay?.type === "settlement-trade"
  ) {
    return updateTradeOverlayQuantity(
      {
        gameState: snapshot.state,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      currentOverlay.quantity + 1
    );
  }

  if (
    input.request.actionId === "confirm-settlement-trade" &&
    currentOverlay?.type === "settlement-trade"
  ) {
    if (!selectedActor.isFixedHost) {
      return withSessionState(
        {
          gameState: snapshot.state,
          characterDefinitions: input.characterDefinitions,
        },
        sessionState,
        {
          overlay: createAlertOverlay(
            "Cannot trade specialty goods",
            ["Only the head shopkeeper can settle city specialty trades."],
            "warning"
          ),
        }
      );
    }

    if (currentOverlay.selectedGoodsId == null) {
      return withSessionState(
        {
          gameState: snapshot.state,
          characterDefinitions: input.characterDefinitions,
        },
        sessionState,
        {
          overlay: createAlertOverlay(
            "No goods selected",
            ["Select a specialty good before confirming the trade."],
            "warning"
          ),
        }
      );
    }

    const playerCharacter = getPlayerCharacter(
      input.characterDefinitions,
      input.playerCharacterId
    );
    const resolution = marketHouseSettlementTradeService.resolveTrade({
      state: snapshot.state,
      cityId: snapshot.cityDefinition.id,
      currentDay: getCalendarDayNumber(snapshot.state),
      goodsId: currentOverlay.selectedGoodsId,
      mode: currentOverlay.mode,
      quantity: currentOverlay.quantity,
      playerGold: playerCharacter.stats.gold,
    });

    if (!resolution.ok) {
      return withSessionState(
        {
          gameState: snapshot.state,
          characterDefinitions: input.characterDefinitions,
        },
        sessionState,
        {
          overlay: createAlertOverlay(
            resolution.title,
            resolution.paragraphs,
            "warning"
          ),
        }
      );
    }

    const mutationResult = applySettlementTradeMutations({
      state: snapshot.state,
      characterDefinitions: input.characterDefinitions,
      playerCharacterId: input.playerCharacterId,
      mutations: resolution.mutations,
    });

    return {
      ...withSessionState(
        {
          gameState: mutationResult.state,
          characterDefinitions: mutationResult.characterDefinitions,
        },
        sessionState,
        {
          overlay: createAlertOverlay(
            "Trade completed",
            resolution.summaryLines,
            "success"
          ),
        }
      ),
      timeAdvanceCost: 1,
    };
  }

  if (input.request.actionId === "confirm-trade" && currentOverlay?.type === "market-trade") {
    const goodsPool =
      currentOverlay.mode === "buy" ? snapshot.displayedGoods : snapshot.sellableGoods;
    const selectedGoods =
      goodsPool.find(
        (goodsSnapshot) => goodsSnapshot.goodDefinition.id === currentOverlay.selectedGoodsId
      ) ?? null;

    if (selectedGoods == null) {
      return withSessionState(
        {
          gameState: snapshot.state,
          characterDefinitions: input.characterDefinitions,
        },
        sessionState,
        {
          overlay: createAlertOverlay("没有选中商品", ["请先选一件商品。"], "warning"),
        }
      );
    }

    const quantity = Math.max(1, currentOverlay.quantity);
    const playerCharacter = getPlayerCharacter(input.characterDefinitions, input.playerCharacterId);

    if (currentOverlay.mode === "buy") {
      if (selectedGoods.stockQuantity < quantity) {
        return withSessionState(
          {
            gameState: snapshot.state,
            characterDefinitions: input.characterDefinitions,
          },
          sessionState,
          {
            overlay: createAlertOverlay("库存不足", ["库存不足。"], "warning"),
          }
        );
      }

      const totalPrice = selectedGoods.adjustedBuyPrice * quantity;
      if (playerCharacter.stats.gold < totalPrice) {
        return withSessionState(
          {
            gameState: snapshot.state,
            characterDefinitions: input.characterDefinitions,
          },
          sessionState,
          {
            overlay: createAlertOverlay("银钱不足", ["银钱不足。"], "warning"),
          }
        );
      }

      const outcome: MarketHouseActionOutcome = {
        moneyChange: -totalPrice,
        inventoryChange: [
          {
            goodsId: selectedGoods.goodDefinition.id,
            quantity,
          },
        ],
        relationshipChange: 0,
        timeCost: 1,
        marketMessage: `你从货栈买入了 ${quantity}${selectedGoods.goodDefinition.unit}${selectedGoods.goodDefinition.name}。`,
      };
      const mutation = applyActionOutcome(input, selectedActor, outcome);

      return {
        ...withSessionState(
          {
            gameState: mutation.state,
            characterDefinitions: mutation.characterDefinitions,
          },
          sessionState,
          {
            overlay: createAlertOverlay(
              "成交",
              [
                outcome.marketMessage,
                `花费 ${totalPrice} 文。`,
                ...formatOutcomeSummary(outcome),
              ],
              "success"
            ),
          }
        ),
        timeAdvanceCost: outcome.timeCost,
      };
    }

    if (selectedGoods.ownedQuantity < quantity) {
      return withSessionState(
        {
          gameState: snapshot.state,
          characterDefinitions: input.characterDefinitions,
        },
        sessionState,
        {
          overlay: createAlertOverlay("持货不足", ["你手里的货不够这么多。"], "warning"),
        }
      );
    }

    const totalPrice = selectedGoods.adjustedSellPrice * quantity;
    const outcome: MarketHouseActionOutcome = {
      moneyChange: totalPrice,
      inventoryChange: [
        {
          goodsId: selectedGoods.goodDefinition.id,
          quantity: -quantity,
        },
      ],
      relationshipChange: 0,
      timeCost: 1,
      marketMessage: `你向钱掌柜卖出了 ${quantity}${selectedGoods.goodDefinition.unit}${selectedGoods.goodDefinition.name}。`,
    };
    const mutation = applyActionOutcome(input, selectedActor, outcome);

    return {
      ...withSessionState(
        {
          gameState: mutation.state,
          characterDefinitions: mutation.characterDefinitions,
        },
        sessionState,
        {
          overlay: createAlertOverlay(
            "成交",
            [
              outcome.marketMessage,
              `收入 ${totalPrice} 文。`,
              ...formatOutcomeSummary(outcome),
            ],
            "success"
          ),
        }
      ),
      timeAdvanceCost: outcome.timeCost,
    };
  }

  return createTransitionResult(input, { gameState: snapshot.state });
}

export const marketHouseHouseModule: HouseModuleDefinition<"market-house"> = {
  moduleId: "market-house",
  enter(input) {
    const runtime = ensureMarketHouseRuntime(input.gameState, input.houseDefinition);
    const fixedHostActorId = getFixedHostActorId(input.houseDefinition);

    return {
      gameState: runtime.state,
      characterDefinitions: input.characterDefinitions,
      sessionState: createInitialMarketHouseSessionState(
        runtime.guestActorIds,
        fixedHostActorId,
        getInitialMarketHouseDialogueLines(input.textEntriesById)
      ),
    };
  },
  dispatch(input) {
    if (input.request.type === "field") {
      return handleField(input, input.sessionState);
    }

    return handleAction(input, input.sessionState);
  },
  leave(input) {
    return {
      gameState: input.gameState,
      characterDefinitions: input.characterDefinitions,
      sessionState: null,
    };
  },
  selectViewModel(input): HouseModuleViewModel {
    const runtime = ensureMarketHouseRuntime(input.gameState, input.houseDefinition);
    const fixedHostActorId = getFixedHostActorId(input.houseDefinition);
    const sessionState =
      input.sessionState ??
      createInitialMarketHouseSessionState(
        runtime.guestActorIds,
        fixedHostActorId,
        getInitialMarketHouseDialogueLines(input.textEntriesById)
      );
    const snapshot = createViewSnapshot(runtime.state, input.houseDefinition, sessionState);
    const playerCharacter = getPlayerCharacter(input.characterDefinitions, input.playerCharacterId);
    const isIdle = sessionState.dialoguePhase === "idle";
    const isGreeting = sessionState.dialoguePhase === "greeting";
    const isInvestigationReport = sessionState.dialoguePhase === "investigation-report";
    const isOpen = sessionState.dialoguePhase === "open";
    const selectedActor = snapshot.selectedActor;
    const standbyRoster = orderHouseStandbyRoster({
      primaryCharacterId: input.houseDefinition.defaultCharacterId,
      actors: snapshot.actors.map((actor) => ({
        characterId: actor.id,
        name: actor.name,
        title: actor.title,
        ...(isInvestigationReport
          ? {}
          : { actionId: `${SELECT_ACTOR_ACTION_PREFIX}${actor.id}` }),
        isSelected: actor.id === selectedActor?.id,
        interactionActions: isInvestigationReport
          ? []
          : [
              { id: "investigate-market", label: "调查", kind: "special" },
              {
                id: "buy-goods",
                label: "买入",
                kind: "special",
                disabled: !actor.isFixedHost,
              },
              ...(snapshot.settlementTradeSupported
                ? [
                    {
                      id: "open-settlement-trade-buy",
                      label: "特产买入",
                      kind: "special" as const,
                      disabled: !actor.isFixedHost,
                    },
                    {
                      id: "open-settlement-trade-sell",
                      label: "特产卖出",
                      kind: "special" as const,
                      disabled: !actor.isFixedHost,
                    },
                  ]
                : []),
              {
                id: "sell-goods",
                label: "卖出",
                kind: "special",
                disabled: !actor.isFixedHost,
              },
            ],
      })),
    }).map((entry) =>
      entry.characterId === input.houseDefinition.defaultCharacterId && !isInvestigationReport
        ? entry
        : {
            ...entry,
            interactionActions: [],
          }
    );

    return {
      moduleId: "market-house",
      houseId: input.houseDefinition.id,
      sceneTitle: input.houseDefinition.name,
      sceneSubtitle: "跑商 / 倒卖 / 交易",
      standbyRoster,
      dialogue:
        isIdle || selectedActor == null
          ? null
          : {
              mode: "character",
              speakerName: selectedActor.name,
              characterId: selectedActor.id,
              position: "right",
              textLines: sessionState.dialogueLines,
              advanceActionId: isGreeting
                ? "advance-greeting"
                : isInvestigationReport
                  ? "advance-investigation-report"
                  : null,
              advanceHintText: isGreeting || isInvestigationReport ? "点击继续" : null,
            },
      actionContainer:
        !isOpen || selectedActor == null
          ? null
          : {
              title: `${selectedActor.name} / ${selectedActor.title}`,
              actions: [
                ...(selectedActor.isFixedHost
                  ? ([
                      { id: "buy-goods", label: "买入商品" },
                      { id: "sell-goods", label: "出售商品" },
                      { id: "investigate-market", label: "调查行情" },
                      ...(snapshot.settlementTradeSupported
                        ? ([
                            {
                              id: "open-settlement-trade-buy",
                              label: "买入特产",
                            },
                            {
                              id: "open-settlement-trade-sell",
                              label: "卖出特产",
                            },
                          ] satisfies HouseActionViewModel[])
                        : []),
                    ] satisfies HouseActionViewModel[])
                  : []),
                { id: "dismiss-dialogue", label: "关闭" },
              ],
            },
      statusCard: {
        eyebrow: "货栈",
        title: snapshot.cityDefinition.name,
        subtitle: `钱掌柜关系 ${snapshot.bossFavorability} / 下次刷新日 ${snapshot.refreshAfterDay}`,
        metrics: [
          { label: "金钱", value: `${playerCharacter.stats.gold} 文` },
          { label: "货单", value: `${snapshot.displayedGoods.length} 项` },
          { label: "持货", value: `${snapshot.totalOwnedGoods}` },
          { label: "繁荣", value: `${snapshot.cityDefinition.prosperity}` },
        ],
      },
      overlay: selectOverlayViewModel(sessionState.overlay, snapshot),
      leaveAction: {
        id: "leave-house",
        label: "离开货栈",
        ...(isIdle ? { tone: "accent" } : {}),
      },
    };
  },
};
