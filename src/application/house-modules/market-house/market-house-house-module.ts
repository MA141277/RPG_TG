import {
  marketHouseBossOpenTextIds,
  marketHouseFixedBoss,
  marketHouseGreetingTextIds,
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
  getMarketHouseStockVariableKey,
  getMarketHouseTimeVariableKey,
  type MarketHouseActionOutcome,
  type MarketHouseTradeMode,
} from "../../../domain/market-house";
import type {
  SettlementTradeSnapshot,
  SettlementTradeSnapshotRow,
} from "../../../domain/settlement-trade";
import type {
  MarketShopType,
  TradeGoodCategory,
  TradeGoodDefinition,
} from "../../../domain/trade-good";
import { assertExists } from "../../../shared/assert";
import { pickRandom, randomInt } from "../../../shared/random";
import { defaultRuntimeContent } from "../../content/default-runtime-content";
import { resolveTextEntry } from "../../content/text-resolution";
import { createHouseActionMemoryObservedEvent } from "../../house/house-action-memory-event";
import { resolveHouseRuntimeNpcPortraitHooks } from "../../house/house-runtime-npc-portrait-hooks";
import { orderHouseStandbyRoster } from "../../house/house-primary-actor-roster";
import {
  applyPlayerItemMutations,
  readPlayerItemQuantity,
} from "../../inventory/player-item-inventory";
import {
  applySettlementTradeMutations,
  applySettlementTradeStateMutations,
} from "../../markets/apply-settlement-trade-mutations";
import { ensureShopMarketData, readShopMarketData } from "../../markets/market-refresh-system";
import { SettlementTradeService } from "../../markets/settlement-trade-service";
import { defaultMarketHouseGuestInquiryDialogue } from "./market-house-guest-inquiry";
import { defaultMarketHouseInvestigationDialogue } from "./market-house-investigation";
import { createInitialMarketHouseSessionState } from "./market-house-session-state";

const AVAILABLE_MARKET_SHOPS: MarketShopType[] = [
  "grain-shop",
  "medicine-shop",
  "silk-shop",
  "smithy",
  "horse-market",
  "general-store",
];

// Legacy ordinary-goods compatibility path:
// the old city-market inventory refresh still exists for future migration,
// but shared buy/sell overlays now surface settlement-trade specialty goods only.
const MARKET_HOUSE_LEGACY_SOURCE_SHOPS: MarketShopType[] = [
  "medicine-shop",
  "silk-shop",
  "smithy",
  "general-store",
];

const SELECT_ACTOR_ACTION_PREFIX = "select-market-actor:";
const SELECT_TRADE_GOODS_ACTION_PREFIX = "select-market-goods:";
const TRADE_QUANTITY_FIELD_ID = "market-house-trade-quantity";
const CHINESE_NUMBER_PATTERN = /[零〇一二两三四五六七八九十百\d]+/u;

const MARKET_CONVERSATION_GOODS_ALIASES_BY_ID: Readonly<
  Partial<Record<string, readonly string[]>>
> = {
  silk_textiles: ["丝绸", "绸缎", "绸子", "丝货"],
  ramie_cloth: ["麻布", "粗布", "布料"],
  cotton_cloth: ["棉布", "棉货", "棉料"],
  tea: ["茶", "茶叶", "茶货"],
  wine: ["酒", "坛酒", "好酒"],
  ceramics: ["瓷器", "瓷货", "瓷"],
  copperware: ["铜器", "铜货", "铜家什"],
  ironware: ["铁器", "铁货", "五金"],
  salt: ["盐", "盐货"],
  paper_brush: ["纸笔", "文房", "纸墨笔砚", "笔墨纸砚"],
  bamboo_woodware: ["竹木器", "木器", "竹器"],
  woven_goods: ["编织货", "编货", "藤编货"],
  lacquer_oil: ["漆油", "漆货"],
  stone_goods: ["石料器货", "石料", "石货"],
  hides: ["皮货", "皮料"],
};

const MARKET_CONVERSATION_ALIAS_GROUPS: ReadonlyArray<{
  goodsIds: readonly string[];
  aliases: readonly string[];
}> = [
  {
    goodsIds: ["silk_textiles", "ramie_cloth", "cotton_cloth"],
    aliases: ["布", "布匹", "匹布", "料子"],
  },
];

const marketHouseSettlementTradeService = new SettlementTradeService();

type MarketHouseActor = MarketHouseActorContent & {
  favorability: number;
};

type MarketHouseActorPortraitHooks = {
  portraitArtClassName: string;
};

const MARKET_HOUSE_GUEST_PORTRAIT_HOOKS_BY_ACTOR_ID: Readonly<
  Partial<Record<string, MarketHouseActorPortraitHooks>>
> = {
  medicine_merchant: {
    portraitArtClassName: "c-market-house-portrait-art--medicine-merchant",
  },
};

type MarketHouseGoodsSnapshot = {
  goodDefinition: TradeGoodDefinition;
  stockQuantity: number;
  ownedQuantity: number;
  adjustedBuyPrice: number;
  adjustedSellPrice: number;
  settlementTradeRow?: SettlementTradeSnapshotRow;
};

type MarketHouseViewSnapshot = {
  state: GameState;
  cityDefinition: CityDefinition;
  actors: MarketHouseActor[];
  selectedActor: MarketHouseActor | null;
  bossFavorability: number;
  displayedGoods: MarketHouseGoodsSnapshot[];
  sellableGoods: MarketHouseGoodsSnapshot[];
  refreshAfterDay: number | null;
  totalOwnedGoods: number;
};

type EnsuredMarketHouseRuntime = {
  state: GameState;
  cityDefinition: CityDefinition;
  guestActorIds: string[];
  settlementTradeSnapshot: SettlementTradeSnapshot;
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

function resolveMarketHouseActorPortraitHooks(
  actor: MarketHouseActor
): Partial<MarketHouseActorPortraitHooks> {
  if (actor.isFixedHost) {
    return {};
  }

  return (
    MARKET_HOUSE_GUEST_PORTRAIT_HOOKS_BY_ACTOR_ID[actor.id] ??
    resolveHouseRuntimeNpcPortraitHooks({
      moduleId: "market-house",
      characterId: actor.id,
      name: actor.name,
      title: actor.title,
    })
  );
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
      return "丝织";
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

function collectLegacyCityMarketEntries(
  gameState: GameState,
  cityDefinition: CityDefinition,
  sourceShops: readonly MarketShopType[] = MARKET_HOUSE_LEGACY_SOURCE_SHOPS
): Array<{
  goodsId: string;
  buyPrice: number;
  sellPrice: number;
  goodDefinition: TradeGoodDefinition;
}> {
  return sourceShops.flatMap((shopType) => {
    const marketData = readShopMarketData(gameState, cityDefinition.id, shopType);
    if (marketData == null) {
      return [];
    }

    return marketData.inventory.map((entry) => ({
      goodsId: entry.goodsId,
      buyPrice: entry.buyPrice,
      sellPrice: entry.sellPrice,
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

function ensureMarketHouseGuestActors(
  gameState: GameState,
  houseDefinition: HouseDefinition
): { state: GameState; guestActorIds: string[] } {
  const guestActorIdsKey = getMarketHouseGuestActorIdsVariableKey(houseDefinition.id);
  const guestActorIds = parseIdList(readStringVariable(gameState, guestActorIdsKey));
  if (guestActorIds.length > 0) {
    return {
      state: gameState,
      guestActorIds,
    };
  }

  const nextGuestActorIds = sampleWithoutReplacement(
    marketHouseRandomNpcPool.map((actor) => actor.id),
    Math.min(randomInt(1, 2), marketHouseRandomNpcPool.length)
  );

  return {
    state: withVariable(gameState, guestActorIdsKey, nextGuestActorIds.join(",")),
    guestActorIds: nextGuestActorIds,
  };
}

function getMarketTradeMemoryPanelId(mode: MarketHouseTradeMode): string {
  return mode === "buy" ? "market-buy" : "market-sell";
}

function getMarketTradeMemoryPanelLabel(mode: MarketHouseTradeMode): string {
  return mode === "buy" ? "买入货物" : "卖出货物";
}

function createMarketHouseObservedEvent(input: {
  houseDefinition: HouseModuleDispatchInput<"market-house">["houseDefinition"];
  type: string;
  summary: string;
  reactionSummary?: string;
  houseActionMemory: NonNullable<
    ReturnType<typeof createHouseActionMemoryObservedEvent>["houseActionMemory"]
  >;
}) {
  return createHouseActionMemoryObservedEvent({
    houseDefinition: input.houseDefinition,
    type: input.type,
    summary: input.summary,
    reactionSummary: input.reactionSummary,
    reactionCharacterId: getFixedHostActorId(input.houseDefinition),
    houseActionMemory: input.houseActionMemory,
  });
}

function createMarketTradePreviewObservedEvent(
  houseDefinition: HouseModuleDispatchInput<"market-house">["houseDefinition"],
  mode: MarketHouseTradeMode
) {
  return createMarketHouseObservedEvent({
    houseDefinition,
    type: `market:${mode}:preview`,
    summary:
      mode === "buy"
        ? "玩家在货栈翻看了买货清单。"
        : "玩家在货栈翻看了卖货清单。",
    houseActionMemory: {
      kind: "panel-open",
      panelId: getMarketTradeMemoryPanelId(mode),
      panelLabel: getMarketTradeMemoryPanelLabel(mode),
      resultKind: "preview",
    },
  });
}

function createMarketTradeCancelObservedEvent(
  houseDefinition: HouseModuleDispatchInput<"market-house">["houseDefinition"],
  mode: MarketHouseTradeMode
) {
  return createMarketHouseObservedEvent({
    houseDefinition,
    type: `market:${mode}:cancel`,
    summary:
      mode === "buy"
        ? "玩家在货栈看了看货单，却没有买任何货物。"
        : "玩家在货栈盘了盘手里的货色，却没有卖出任何货物。",
    reactionSummary:
      mode === "buy"
        ? "他刚翻了翻货单，却没买任何货。"
        : "他刚盘了盘手里的货色，却没出手卖货。",
    houseActionMemory: {
      kind: "panel-close-without-action",
      panelId: getMarketTradeMemoryPanelId(mode),
      panelLabel: getMarketTradeMemoryPanelLabel(mode),
      resultKind: "no-action",
    },
  });
}

function createMarketTradeSuccessObservedEvent(input: {
  houseDefinition: HouseModuleDispatchInput<"market-house">["houseDefinition"];
  mode: MarketHouseTradeMode;
  goodsDefinition: TradeGoodDefinition;
  quantity: number;
  goldDelta: number;
}) {
  const actionLabel =
    input.mode === "buy"
      ? `买走了 ${input.quantity}${input.goodsDefinition.unit}${input.goodsDefinition.name}`
      : `卖出了 ${input.quantity}${input.goodsDefinition.unit}${input.goodsDefinition.name}`;

  return createMarketHouseObservedEvent({
    houseDefinition: input.houseDefinition,
    type: `market:${input.mode}:success`,
    summary:
      input.mode === "buy"
        ? `玩家在货栈买入了 ${input.quantity}${input.goodsDefinition.unit}${input.goodsDefinition.name}。`
        : `玩家在货栈卖出了 ${input.quantity}${input.goodsDefinition.unit}${input.goodsDefinition.name}。`,
    reactionSummary: `他刚${actionLabel}。`,
    houseActionMemory: {
      kind: input.mode === "buy" ? "trade-buy-success" : "trade-sell-success",
      panelId: getMarketTradeMemoryPanelId(input.mode),
      panelLabel: getMarketTradeMemoryPanelLabel(input.mode),
      itemId: input.goodsDefinition.id,
      itemName: input.goodsDefinition.name,
      quantity: input.quantity,
      goldDelta: input.goldDelta,
      resultKind: "success",
    },
  });
}

function createMarketInvestigationObservedEvent(
  houseDefinition: HouseModuleDispatchInput<"market-house">["houseDefinition"]
) {
  return createMarketHouseObservedEvent({
    houseDefinition,
    type: "market:investigate:success",
    summary: "玩家在货栈打听了本城行情。",
    reactionSummary: "他刚跟我打听了本城的行情。",
    houseActionMemory: {
      kind: "service-success",
      serviceId: "market-investigate",
      serviceLabel: "调查行情",
      resultKind: "success",
    },
  });
}

function ensureSettlementTradeSnapshot(
  gameState: GameState,
  cityDefinition: CityDefinition
): {
  state: GameState;
  settlementTradeSnapshot: SettlementTradeSnapshot;
} {
  const preparedSnapshot = marketHouseSettlementTradeService.prepareSnapshot({
    state: gameState,
    cityId: cityDefinition.id,
    currentDay: getCalendarDayNumber(gameState),
  });
  if (preparedSnapshot.mutations.length === 0) {
    return {
      state: gameState,
      settlementTradeSnapshot: preparedSnapshot.snapshot,
    };
  }

  return {
    state: applySettlementTradeStateMutations(
      gameState,
      preparedSnapshot.mutations
    ),
    settlementTradeSnapshot: preparedSnapshot.snapshot,
  };
}

function ensureMarketHouseRuntime(
  gameState: GameState,
  houseDefinition: HouseDefinition
): EnsuredMarketHouseRuntime {
  const cityDefinition = getCityDefinition(houseDefinition.cityId);
  const guestRuntime = ensureMarketHouseGuestActors(gameState, houseDefinition);
  const settlementTradeRuntime = ensureSettlementTradeSnapshot(
    guestRuntime.state,
    cityDefinition
  );

  return {
    state: settlementTradeRuntime.state,
    cityDefinition,
    guestActorIds: guestRuntime.guestActorIds,
    settlementTradeSnapshot: settlementTradeRuntime.settlementTradeSnapshot,
  };
}

function createLegacyGoodsSnapshots(
  state: GameState,
  houseDefinition: HouseDefinition,
  cityDefinition: CityDefinition,
  goodsIds: string[],
  bossFavorability: number
): MarketHouseGoodsSnapshot[] {
  const cityEntries = collectLegacyCityMarketEntries(state, cityDefinition);

  return goodsIds
    .map((goodsId) => {
      const matchedEntry = cityEntries.find((entry) => entry.goodsId === goodsId);
      if (matchedEntry == null) {
        return null;
      }

      const adjustedBuyPrice = adjustBuyPrice(matchedEntry.buyPrice, bossFavorability);

      return {
        goodDefinition: matchedEntry.goodDefinition,
        stockQuantity: readNumericVariable(
          state,
          getMarketHouseStockVariableKey(houseDefinition.id, goodsId),
          0
        ),
        ownedQuantity: readOwnedMarketGoodsQuantity(state, goodsId),
        adjustedBuyPrice,
        adjustedSellPrice: adjustSellPrice(
          matchedEntry.sellPrice,
          adjustedBuyPrice,
          bossFavorability
        ),
      };
    })
    .filter((snapshot): snapshot is MarketHouseGoodsSnapshot => snapshot != null);
}

function createSettlementTradeGoodsSnapshots(
  settlementTradeSnapshot: SettlementTradeSnapshot
): MarketHouseGoodsSnapshot[] {
  return settlementTradeSnapshot.rows.map((row) => ({
    goodDefinition: getTradeGoodDefinition(row.goodsId),
    stockQuantity: row.stockQuantity,
    ownedQuantity: row.ownedQuantity,
    adjustedBuyPrice: row.currentBuyPrice,
    adjustedSellPrice: row.currentSellPrice,
    settlementTradeRow: row,
  }));
}

function createLegacySellableGoodsSnapshots(
  state: GameState,
  houseDefinition: HouseDefinition,
  cityDefinition: CityDefinition,
  bossFavorability: number
): MarketHouseGoodsSnapshot[] {
  const cityEntries = collectLegacyCityMarketEntries(state, cityDefinition);

  return cityEntries
    .map(({ goodsId, buyPrice, sellPrice, goodDefinition }) => {
      const ownedQuantity = readOwnedMarketGoodsQuantity(state, goodsId);
      if (ownedQuantity <= 0) {
        return null;
      }

      const adjustedBuyPrice = adjustBuyPrice(buyPrice, bossFavorability);
      return {
        goodDefinition,
        stockQuantity: readNumericVariable(
          state,
          getMarketHouseStockVariableKey(houseDefinition.id, goodsId),
          0
        ),
        ownedQuantity,
        adjustedBuyPrice,
        adjustedSellPrice: adjustSellPrice(sellPrice, adjustedBuyPrice, bossFavorability),
      };
    })
    .filter((snapshot): snapshot is MarketHouseGoodsSnapshot => snapshot != null);
}

function createViewSnapshotFromRuntime(
  runtime: EnsuredMarketHouseRuntime,
  houseDefinition: HouseDefinition,
  sessionState: MarketHouseSessionState | null
): MarketHouseViewSnapshot {
  const actors = createActors(runtime.state, houseDefinition, runtime.guestActorIds);
  const fixedHostActor = findFixedHostActor(actors, houseDefinition);
  const bossFavorability = fixedHostActor?.favorability ?? marketHouseFixedBoss.favorability;
  const settlementTradeGoods = createSettlementTradeGoodsSnapshots(
    runtime.settlementTradeSnapshot
  );
  const displayedGoods = settlementTradeGoods;
  const sellableGoods = settlementTradeGoods.filter(
    (goodsSnapshot) => goodsSnapshot.ownedQuantity > 0
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
    refreshAfterDay: runtime.settlementTradeSnapshot.nextRefreshDay,
    totalOwnedGoods: sellableGoods.reduce((sum, snapshot) => sum + snapshot.ownedQuantity, 0),
  };
}

function createViewSnapshot(
  gameState: GameState,
  houseDefinition: HouseDefinition,
  sessionState: MarketHouseSessionState | null
): MarketHouseViewSnapshot {
  return createViewSnapshotFromRuntime(
    ensureMarketHouseRuntime(gameState, houseDefinition),
    houseDefinition,
    sessionState
  );
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

function getActorOpenLines(input: {
  state: GameState;
  cityDefinition: CityDefinition;
  actor: MarketHouseActor;
  textEntriesById: Record<string, string> | undefined;
}): string[] {
  const { actor, state, cityDefinition, textEntriesById } = input;
  const entries = getMarketTextEntries(textEntriesById);
  if (actor.isFixedHost) {
    return resolveMarketTextLines(entries, marketHouseBossOpenTextIds);
  }

  return defaultMarketHouseGuestInquiryDialogue.createDialogueLines({
    state,
    cityId: cityDefinition.id,
    currentDay: getCalendarDayNumber(state),
    actorId: actor.id,
    textEntriesById,
  });
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

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

function normalizeMarketConversationTradeText(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase()
    .replace(/[\s\u3000]+/gu, "")
    .replace(/[，。、“”‘’！？!?,.;:：；（）()[\]{}<>《》「」【】'"`]/gu, "");
}

function parseChineseNumberToken(value: string): number | null {
  if (value.length === 0) {
    return null;
  }

  if (/^\d+$/u.test(value)) {
    return Math.max(1, Number.parseInt(value, 10));
  }

  const digitValues: Readonly<Record<string, number>> = {
    零: 0,
    〇: 0,
    一: 1,
    二: 2,
    两: 2,
    三: 3,
    四: 4,
    五: 5,
    六: 6,
    七: 7,
    八: 8,
    九: 9,
  };
  const multiplierValues: Readonly<Record<string, number>> = {
    十: 10,
    百: 100,
  };

  let total = 0;
  let current = 0;
  let sawKnownToken = false;
  for (const char of value) {
    if (char in digitValues) {
      current = digitValues[char] ?? 0;
      sawKnownToken = true;
      continue;
    }

    if (char in multiplierValues) {
      sawKnownToken = true;
      total += (current === 0 ? 1 : current) * (multiplierValues[char] ?? 0);
      current = 0;
      continue;
    }

    return null;
  }

  if (!sawKnownToken) {
    return null;
  }

  return Math.max(1, total + current);
}

function collectMarketConversationGoodsAliases(
  goodsSnapshot: MarketHouseGoodsSnapshot
): string[] {
  const aliases = new Set<string>([goodsSnapshot.goodDefinition.name]);
  const specificAliases =
    MARKET_CONVERSATION_GOODS_ALIASES_BY_ID[goodsSnapshot.goodDefinition.id] ?? [];
  for (const alias of specificAliases) {
    aliases.add(alias);
  }

  for (const group of MARKET_CONVERSATION_ALIAS_GROUPS) {
    if (!group.goodsIds.includes(goodsSnapshot.goodDefinition.id)) {
      continue;
    }

    for (const alias of group.aliases) {
      aliases.add(alias);
    }
  }

  return [...aliases].filter((alias) => alias.trim().length > 0);
}

function resolveRequestedTradeQuantity(input: {
  rawPlayerText: string;
  goodsSnapshot: MarketHouseGoodsSnapshot;
  aliases: readonly string[];
}): number {
  const compactText = input.rawPlayerText.replace(/[\s\u3000]+/gu, "");
  const aliasPattern = input.aliases
    .map((alias) => alias.trim())
    .filter((alias) => alias.length > 0)
    .sort((left, right) => right.length - left.length)
    .map((alias) => escapeRegExp(alias))
    .join("|");
  const unitPattern = escapeRegExp(input.goodsSnapshot.goodDefinition.unit);
  const quantityPatterns = [
    new RegExp(`(${CHINESE_NUMBER_PATTERN.source})${unitPattern}`, "u"),
    ...(aliasPattern.length === 0
      ? []
      : [
          new RegExp(`(${CHINESE_NUMBER_PATTERN.source})(?=${aliasPattern})`, "u"),
          new RegExp(`(?:${aliasPattern}).{0,2}?(${CHINESE_NUMBER_PATTERN.source})${unitPattern}?`, "u"),
        ]),
  ];

  for (const pattern of quantityPatterns) {
    const quantityToken = compactText.match(pattern)?.[1] ?? null;
    if (quantityToken == null) {
      continue;
    }

    const parsedQuantity = parseChineseNumberToken(quantityToken);
    if (parsedQuantity != null) {
      return parsedQuantity;
    }
  }

  return 1;
}

function resolveConversationTradeSelection(input: {
  rawPlayerText: string;
  goodsSnapshots: MarketHouseGoodsSnapshot[];
  mode: MarketHouseTradeMode;
}): {
  goodsId: string;
  quantity: number;
} | null {
  const normalizedText = normalizeMarketConversationTradeText(input.rawPlayerText);
  if (normalizedText.length === 0) {
    return null;
  }

  const candidates = input.goodsSnapshots
    .map((goodsSnapshot) => {
      const aliases = collectMarketConversationGoodsAliases(goodsSnapshot);
      const matchedAlias = aliases
        .map((alias) => normalizeMarketConversationTradeText(alias))
        .filter((alias) => alias.length > 0 && normalizedText.includes(alias))
        .sort((left, right) => right.length - left.length)[0];
      if (matchedAlias == null) {
        return null;
      }

      return {
        goodsSnapshot,
        quantity: resolveRequestedTradeQuantity({
          rawPlayerText: input.rawPlayerText,
          goodsSnapshot,
          aliases,
        }),
        aliasScore: matchedAlias.length,
      };
    })
    .filter(
      (
        candidate
      ): candidate is {
        goodsSnapshot: MarketHouseGoodsSnapshot;
        quantity: number;
        aliasScore: number;
      } => candidate != null
    )
    .sort((left, right) => {
      if (right.aliasScore !== left.aliasScore) {
        return right.aliasScore - left.aliasScore;
      }

      if (input.mode === "buy") {
        if (
          left.goodsSnapshot.adjustedBuyPrice !== right.goodsSnapshot.adjustedBuyPrice
        ) {
          return left.goodsSnapshot.adjustedBuyPrice - right.goodsSnapshot.adjustedBuyPrice;
        }

        return right.goodsSnapshot.stockQuantity - left.goodsSnapshot.stockQuantity;
      }

      if (
        left.goodsSnapshot.adjustedSellPrice !== right.goodsSnapshot.adjustedSellPrice
      ) {
        return right.goodsSnapshot.adjustedSellPrice - left.goodsSnapshot.adjustedSellPrice;
      }

      return right.goodsSnapshot.ownedQuantity - left.goodsSnapshot.ownedQuantity;
    });

  const resolvedCandidate = candidates[0] ?? null;
  if (resolvedCandidate == null) {
    return null;
  }

  return {
    goodsId: resolvedCandidate.goodsSnapshot.goodDefinition.id,
    quantity: resolvedCandidate.quantity,
  };
}

function tryResolveConversationTradeSettlement(
  input: HouseModuleDispatchInput<"market-house">,
  sessionState: MarketHouseSessionState | null,
  mode: MarketHouseTradeMode
): HouseModuleTransitionResult<"market-house"> | null {
  if (input.request.type !== "conversation-service" || sessionState == null) {
    return null;
  }

  const snapshot = createViewSnapshot(input.gameState, input.houseDefinition, sessionState);
  const goodsPool =
    mode === "buy"
      ? snapshot.displayedGoods.filter((goodsSnapshot) => goodsSnapshot.stockQuantity > 0)
      : snapshot.sellableGoods.filter((goodsSnapshot) => goodsSnapshot.ownedQuantity > 0);
  const selection = resolveConversationTradeSelection({
    rawPlayerText: input.request.rawPlayerText,
    goodsSnapshots: goodsPool,
    mode,
  });
  if (selection == null) {
    return null;
  }

  return handleAction(
    {
      ...input,
      request: {
        type: "action",
        actionId: "confirm-trade",
      },
    },
    {
      ...sessionState,
      selectedActorId: getFixedHostActorId(input.houseDefinition),
      overlay: {
        type: "market-trade",
        mode,
        selectedGoodsId: selection.goodsId,
        quantity: selection.quantity,
      },
    }
  );
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
  if (overlay == null || overlay.type !== "market-trade") {
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

function getGoodsReferencePrice(goodsSnapshot: MarketHouseGoodsSnapshot): number {
  return goodsSnapshot.settlementTradeRow?.staticReferencePrice ?? goodsSnapshot.goodDefinition.basePrice;
}

function getGoodsCategoryLabel(goodsSnapshot: MarketHouseGoodsSnapshot): string {
  if (goodsSnapshot.settlementTradeRow == null) {
    return getCategoryLabel(goodsSnapshot.goodDefinition.category);
  }

  return goodsSnapshot.settlementTradeRow.categoryLabel;
}

function getGoodsQuantityLabel(
  goodsSnapshot: MarketHouseGoodsSnapshot,
  mode: MarketHouseTradeMode
): string {
  const unit = goodsSnapshot.goodDefinition.unit;
  const primary =
    mode === "buy"
      ? `库存 ${goodsSnapshot.stockQuantity}${unit}`
      : `持有 ${goodsSnapshot.ownedQuantity}${unit}`;

  if (goodsSnapshot.settlementTradeRow == null) {
    return primary;
  }

  const secondary =
    mode === "buy"
      ? `持有 ${goodsSnapshot.ownedQuantity}${unit}`
      : `库存 ${goodsSnapshot.stockQuantity}${unit}`;

  return `${primary} / ${secondary}`;
}

function createTradeHelperLines(
  mode: MarketHouseTradeMode,
  selectedSnapshot: MarketHouseGoodsSnapshot | null
): string[] {
  const settlementTradeRow = selectedSnapshot?.settlementTradeRow;
  if (settlementTradeRow != null) {
    return [
      mode === "buy"
        ? `本城特产${settlementTradeRow.tierLabel}，买入按 ${settlementTradeRow.currentBuyPrice} 文结算，静置 ${settlementTradeRow.daysUntilReset} 天后会逐步回稳。`
        : `本城特产${settlementTradeRow.tierLabel}，卖出按 ${settlementTradeRow.currentSellPrice} 文结算，静置 ${settlementTradeRow.daysUntilReset} 天后会逐步回稳。`,
      `库存 ${settlementTradeRow.stockQuantity}${settlementTradeRow.unit}，手头持有 ${settlementTradeRow.ownedQuantity}${settlementTradeRow.unit}。`,
      "若想知道更细的去路和缺货城路，可先向掌柜调查行情。",
    ];
  }

  return mode === "buy"
    ? [
        "绿色代表低于参考均价，红色代表高于参考均价。",
        "货栈买入价会随钱掌柜关系略有浮动。",
      ]
    : [
        "出售按当前城市卖出价结算。",
        "货栈始终保留买卖差价，无法原地无限刷钱。",
      ];
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
  const referencePrice = selectedSnapshot == null ? 0 : getGoodsReferencePrice(selectedSnapshot);

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

      return {
        goodsId: goodsSnapshot.goodDefinition.id,
        name: goodsSnapshot.goodDefinition.name,
        categoryLabel: getGoodsCategoryLabel(goodsSnapshot),
        currentPrice: currentModePrice,
        referencePrice: getGoodsReferencePrice(goodsSnapshot),
        unit: goodsSnapshot.goodDefinition.unit,
        quantityLabel: getGoodsQuantityLabel(goodsSnapshot, overlay.mode),
        priceTone: createPriceTone(currentModePrice, getGoodsReferencePrice(goodsSnapshot)),
        isSelected: goodsSnapshot.goodDefinition.id === selectedSnapshot?.goodDefinition.id,
      };
    }),
    selectedSummary:
      selectedSnapshot == null
        ? null
        : {
            goodsId: selectedSnapshot.goodDefinition.id,
            name: selectedSnapshot.goodDefinition.name,
            categoryLabel: getGoodsCategoryLabel(selectedSnapshot),
            currentPrice,
            referencePrice,
            unit: selectedSnapshot.goodDefinition.unit,
            availableQuantity,
            quantityLabel: getGoodsQuantityLabel(selectedSnapshot, overlay.mode),
            tradeTotal: currentPrice * overlay.quantity,
            priceTone: createPriceTone(currentPrice, referencePrice),
          },
    helperLines: createTradeHelperLines(overlay.mode, selectedSnapshot),
  };
}

function handleField(
  input: HouseModuleDispatchInput<"market-house">,
  sessionState: MarketHouseSessionState | null
): HouseModuleTransitionResult<"market-house"> {
  if (input.request.type !== "field") {
    return createTransitionResult(input);
  }

  if (input.request.fieldId !== TRADE_QUANTITY_FIELD_ID) {
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
        dialogueLines: getActorOpenLines({
          state: snapshot.state,
          cityDefinition: snapshot.cityDefinition,
          actor: fixedHostActor,
          textEntriesById: input.textEntriesById,
        }),
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
        dialogueLines: getActorOpenLines({
          state: snapshot.state,
          cityDefinition: snapshot.cityDefinition,
          actor: fixedHostActor,
          textEntriesById: input.textEntriesById,
        }),
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
    input.request.actionId === "close-trade"
  ) {
    const closeResult = withSessionState(
      {
        gameState: snapshot.state,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
        {
          overlay: null,
        }
      );

    if (
      input.request.actionId === "close-trade" &&
      currentOverlay?.type === "market-trade"
    ) {
      return {
        ...closeResult,
        observedEvents: [
          createMarketTradeCancelObservedEvent(
            input.houseDefinition,
            currentOverlay.mode
          ),
        ],
      };
    }

    return closeResult;
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
        dialogueLines: getActorOpenLines({
          state: snapshot.state,
          cityDefinition: snapshot.cityDefinition,
          actor,
          textEntriesById: input.textEntriesById,
        }),
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
      observedEvents: [
        createMarketInvestigationObservedEvent(input.houseDefinition),
      ],
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

    return {
      ...withSessionState(
        {
          gameState: snapshot.state,
          characterDefinitions: input.characterDefinitions,
        },
        sessionState,
        {
          overlay: createTradeOverlay(
            "buy",
            buyableGoods,
            currentOverlay?.type === "market-trade"
              ? currentOverlay.selectedGoodsId
              : null
          ),
        }
      ),
      observedEvents: [
        createMarketTradePreviewObservedEvent(input.houseDefinition, "buy"),
      ],
    };
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

    return {
      ...withSessionState(
        {
          gameState: snapshot.state,
          characterDefinitions: input.characterDefinitions,
        },
        sessionState,
        {
          overlay: createTradeOverlay(
            "sell",
            snapshot.sellableGoods,
            currentOverlay?.type === "market-trade"
              ? currentOverlay.selectedGoodsId
              : null
          ),
        }
      ),
      observedEvents: [
        createMarketTradePreviewObservedEvent(input.houseDefinition, "sell"),
      ],
    };
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
          overlay: createAlertOverlay("没有选中商品", ["请先选中一件商品。"], "warning"),
        }
      );
    }

    const quantity = Math.max(1, currentOverlay.quantity);
    const playerCharacter = getPlayerCharacter(input.characterDefinitions, input.playerCharacterId);

    if (selectedGoods.settlementTradeRow != null) {
      const resolution = marketHouseSettlementTradeService.resolveTrade({
        state: snapshot.state,
        cityId: snapshot.cityDefinition.id,
        currentDay: getCalendarDayNumber(snapshot.state),
        goodsId: selectedGoods.settlementTradeRow.goodsId,
        mode: currentOverlay.mode,
        quantity,
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
      const settlementTradeOutcome: MarketHouseActionOutcome = {
        moneyChange: currentOverlay.mode === "buy" ? -resolution.totalPrice : resolution.totalPrice,
        inventoryChange: [
          {
            goodsId: selectedGoods.goodDefinition.id,
            quantity: currentOverlay.mode === "buy" ? quantity : -quantity,
          },
        ],
        relationshipChange: 0,
        timeCost: 1,
        marketMessage: resolution.summaryLines[0] ?? "",
      };

      return {
        ...withSessionState(
          {
            gameState: mutationResult.state,
            characterDefinitions: mutationResult.characterDefinitions,
          },
          sessionState,
          {
            overlay: createAlertOverlay(
              "成交",
              [
                ...resolution.summaryLines,
                ...formatOutcomeSummary(settlementTradeOutcome),
              ],
              "success"
            ),
          }
        ),
        observedEvents: [
          createMarketTradeSuccessObservedEvent({
            houseDefinition: input.houseDefinition,
            mode: currentOverlay.mode,
            goodsDefinition: selectedGoods.goodDefinition,
            quantity,
            goldDelta: settlementTradeOutcome.moneyChange,
          }),
        ],
        timeAdvanceCost: 1,
      };
    }

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
        observedEvents: [
          createMarketTradeSuccessObservedEvent({
            houseDefinition: input.houseDefinition,
            mode: "buy",
            goodsDefinition: selectedGoods.goodDefinition,
            quantity,
            goldDelta: -totalPrice,
          }),
        ],
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
        observedEvents: [
          createMarketTradeSuccessObservedEvent({
            houseDefinition: input.houseDefinition,
            mode: "sell",
            goodsDefinition: selectedGoods.goodDefinition,
            quantity,
            goldDelta: totalPrice,
          }),
        ],
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
    if (input.request.type === "conversation-service") {
      switch (input.request.serviceId) {
        case "market-buy": {
          const directSettlementResult = tryResolveConversationTradeSettlement(
            input,
            input.sessionState,
            "buy"
          );
          if (directSettlementResult != null) {
            return directSettlementResult;
          }

          return handleAction(
            {
              ...input,
              request: {
                type: "action",
                actionId: "buy-goods",
              },
            },
            input.sessionState
          );
        }
        case "market-sell": {
          const directSettlementResult = tryResolveConversationTradeSettlement(
            input,
            input.sessionState,
            "sell"
          );
          if (directSettlementResult != null) {
            return directSettlementResult;
          }

          return handleAction(
            {
              ...input,
              request: {
                type: "action",
                actionId: "sell-goods",
              },
            },
            input.sessionState
          );
        }
        case "market-investigate":
          return handleAction(
            {
              ...input,
              request: {
                type: "action",
                actionId: "investigate-market",
              },
            },
            input.sessionState
          );
        default:
          return createTransitionResult(input);
      }
    }

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
  selectConversationServices(input) {
    const snapshot = createViewSnapshot(
      input.gameState,
      input.houseDefinition,
      input.sessionState
    );
    if (!snapshot.selectedActor?.isFixedHost) {
      return [];
    }

    return [
      {
        serviceId: "market-buy",
        label: "买货",
        description: "让钱掌柜接手买货，进入当前货栈的买货流程。",
        enabled: true,
      },
      {
        serviceId: "market-sell",
        label: "卖货",
        description: "让钱掌柜接手收货，进入当前货栈的卖货流程。",
        enabled: true,
      },
      {
        serviceId: "market-investigate",
        label: "打听行情",
        description: "直接询问本地特产、货路和行情。",
        enabled: true,
      },
    ];
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
    const snapshot = createViewSnapshotFromRuntime(
      runtime,
      input.houseDefinition,
      sessionState
    );
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
        ...resolveMarketHouseActorPortraitHooks(actor),
        ...(isInvestigationReport
          ? {}
          : { actionId: `${SELECT_ACTOR_ACTION_PREFIX}${actor.id}` }),
        isSelected: actor.id === selectedActor?.id,
        interactionActions: isInvestigationReport
          ? []
          : [
              {
                id: "investigate-market",
                label: "调查行情",
                kind: "special",
                triggerKeywords: [
                  "什么货",
                  "都有什么货",
                  "货物",
                  "特产",
                  "行情",
                  "卖什么",
                ],
              },
              {
                id: "buy-goods",
                label: "买入货物",
                kind: "special",
                triggerKeywords: [
                  "买货",
                  "买东西",
                  "进货",
                  "采购",
                  "买入货物",
                ],
                disabled: !actor.isFixedHost,
              },
              {
                id: "sell-goods",
                label: "卖出货物",
                kind: "special",
                triggerKeywords: [
                  "卖货",
                  "卖东西",
                  "出货",
                  "销货",
                  "卖出货物",
                ],
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
              ...resolveMarketHouseActorPortraitHooks(selectedActor),
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
                      { id: "buy-goods", label: "买入货物" },
                      { id: "sell-goods", label: "卖出货物" },
                      { id: "investigate-market", label: "调查行情" },
                    ] satisfies HouseActionViewModel[])
                  : []),
                { id: "dismiss-dialogue", label: "关闭" },
              ],
            },
      statusCard: {
        eyebrow: "货栈",
        title: snapshot.cityDefinition.name,
        subtitle: `钱掌柜关系 ${snapshot.bossFavorability} / 下次刷新日 ${snapshot.refreshAfterDay ?? "未定"}`,
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
