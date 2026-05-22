import { globalGoodsPool } from "../../../content/markets/global-goods-pool";
import { prototypeCities, prototypeCityNpcPools } from "../../../content/prototype-world";
import type { CharacterDefinition } from "../../../domain/character";
import type { CityDefinition } from "../../../domain/city";
import type { HouseDefinition } from "../../../domain/house";
import type {
  HouseModuleDefinition,
  HouseModuleDispatchInput,
  HouseActionViewModel,
  HouseModuleTransitionResult,
  HouseModuleViewModel,
  HouseOverlayViewModel,
} from "../../../domain/house-module";
import type {
  MarketHouseSessionState,
} from "../../../domain/house-modules/market-house-session";
import type { ShopInventoryEntry } from "../../../domain/market";
import type { MarketShopType, TradeGoodDefinition } from "../../../domain/trade-good";
import { assertExists } from "../../../shared/assert";
import { selectCityNpcSummariesForHouse } from "../../city-npcs/select-city-npcs-for-house";
import { ensureShopMarketData, readShopMarketData } from "../../markets/market-refresh-system";
import {
  createInitialMarketHouseSessionState,
  DEFAULT_MARKET_SHOP_TYPE,
} from "./market-house-session-state";

const AVAILABLE_MARKET_SHOPS: MarketShopType[] = [
  "grain-shop",
  "medicine-shop",
  "silk-shop",
  "smithy",
  "horse-market",
  "general-store",
];

const SHOP_ACTION_PREFIX = "select-market-shop:";

type MarketHouseShopSnapshot = {
  entry: ShopInventoryEntry;
  goodDefinition: TradeGoodDefinition;
};

type MarketHouseViewSnapshot = {
  state: HouseModuleDispatchInput<"market-house">["gameState"];
  cityDefinition: CityDefinition;
  selectedShopType: MarketShopType;
  marketEntries: MarketHouseShopSnapshot[];
  selectedShopInventoryCount: number;
  refreshedDayText: string;
};

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
  const cityDefinition = prototypeCities.find((candidateCity) => candidateCity.id === cityId);
  assertExists(cityDefinition, `City definition missing for id "${cityId}" in market house module.`);
  return cityDefinition;
}

function getTradeGoodDefinition(goodsId: string): TradeGoodDefinition {
  const goodDefinition = globalGoodsPool.find((candidateGood) => candidateGood.id === goodsId);
  assertExists(goodDefinition, `Trade good definition missing for id "${goodsId}".`);
  return goodDefinition;
}

function getShopLabel(shopType: MarketShopType): string {
  switch (shopType) {
    case "grain-shop":
      return "粮行";
    case "medicine-shop":
      return "药铺";
    case "silk-shop":
      return "绸货";
    case "smithy":
      return "铁匠铺";
    case "horse-market":
      return "马市";
    case "general-store":
      return "杂货摊";
    default:
      return shopType;
  }
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

function ensureMarketShops(
  gameState: HouseModuleDispatchInput<"market-house">["gameState"],
  cityDefinition: CityDefinition
): HouseModuleDispatchInput<"market-house">["gameState"] {
  let nextState = gameState;

  for (const shopType of AVAILABLE_MARKET_SHOPS) {
    nextState = ensureShopMarketData(nextState, cityDefinition, shopType).state;
  }

  return nextState;
}

function getMarketHouseSnapshot(
  gameState: HouseModuleDispatchInput<"market-house">["gameState"],
  houseDefinition: HouseDefinition,
  selectedShopType: MarketShopType
): MarketHouseViewSnapshot {
  const cityDefinition = getCityDefinition(houseDefinition.cityId);
  const marketData = readShopMarketData(gameState, cityDefinition.id, selectedShopType);
  assertExists(
    marketData,
    `Market data missing for city "${cityDefinition.id}" shop "${selectedShopType}".`
  );

  return {
    state: gameState,
    cityDefinition,
    selectedShopType,
    marketEntries: marketData.inventory.map((entry) => ({
      entry,
      goodDefinition: getTradeGoodDefinition(entry.goodsId),
    })),
    selectedShopInventoryCount: marketData.inventory.length,
    refreshedDayText: `${marketData.lastRefreshedOnDay} -> ${marketData.refreshAfterDay}`,
  };
}

function createGreetingLines(cityDefinition: CityDefinition): string[] {
  return [
    `${cityDefinition.name}的市集今天照常开张。`,
    "南来北往的货物都摆在眼前，你可以先看看哪一行最有利。 ",
  ];
}

function createOpenLines(snapshot: MarketHouseViewSnapshot): string[] {
  const topRows = snapshot.marketEntries.slice(0, 4);
  const rows =
    topRows.length === 0
      ? ["这一行暂时没有摆出新货。"]
      : topRows.map(
          ({ entry, goodDefinition }) =>
            `${goodDefinition.name} ${entry.buyPrice}文/${goodDefinition.unit}，回收 ${entry.sellPrice}文`
        );

  return [
    `${getShopLabel(snapshot.selectedShopType)}当前货单如下：`,
    ...rows,
  ];
}

function parseShopAction(actionId: string): MarketShopType | null {
  if (!actionId.startsWith(SHOP_ACTION_PREFIX)) {
    return null;
  }

  const shopType = actionId.slice(SHOP_ACTION_PREFIX.length) as MarketShopType;
  return AVAILABLE_MARKET_SHOPS.includes(shopType) ? shopType : null;
}

function selectOverlayViewModel(
  overlay: MarketHouseSessionState["overlay"]
): HouseOverlayViewModel | null {
  if (overlay == null) {
    return null;
  }

  return {
    type: "alert",
    title: overlay.title,
    paragraphs: overlay.paragraphs,
    ...(overlay.tone == null ? {} : { tone: overlay.tone }),
    confirmActionId: "close-alert",
    confirmLabel: "知道了",
  };
}

function handleAction(
  input: HouseModuleDispatchInput<"market-house">,
  sessionState: MarketHouseSessionState | null
): HouseModuleTransitionResult<"market-house"> {
  if (input.request.type !== "action") {
    return createTransitionResult(input);
  }

  const cityDefinition = getCityDefinition(input.houseDefinition.cityId);
  const stateWithMarkets = ensureMarketShops(input.gameState, cityDefinition);
  const selectedShopType = sessionState?.selectedShopType ?? DEFAULT_MARKET_SHOP_TYPE;

  if (input.request.actionId === "advance-greeting") {
    const snapshot = getMarketHouseSnapshot(
      stateWithMarkets,
      input.houseDefinition,
      selectedShopType
    );
    return {
      gameState: snapshot.state,
      characterDefinitions: input.characterDefinitions,
      sessionState:
        sessionState == null
          ? sessionState
          : {
              ...sessionState,
              dialoguePhase: "open",
              dialogueLines: createOpenLines(snapshot),
            },
    };
  }

  if (input.request.actionId === "open-market-dialogue") {
    const snapshot = getMarketHouseSnapshot(
      stateWithMarkets,
      input.houseDefinition,
      selectedShopType
    );
    return {
      gameState: snapshot.state,
      characterDefinitions: input.characterDefinitions,
      sessionState:
        sessionState == null
          ? sessionState
          : {
              ...sessionState,
              dialoguePhase: "open",
              dialogueLines: createOpenLines(snapshot),
              overlay: null,
            },
    };
  }

  if (input.request.actionId === "dismiss-dialogue") {
    return withSessionState(
      {
        gameState: stateWithMarkets,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        dialoguePhase: "idle",
        overlay: null,
      }
    );
  }

  if (input.request.actionId === "inspect-shop") {
    const snapshot = getMarketHouseSnapshot(
      stateWithMarkets,
      input.houseDefinition,
      selectedShopType
    );
    return withSessionState(
      {
        gameState: snapshot.state,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        overlay: createAlertOverlay(
          `${getShopLabel(snapshot.selectedShopType)}货单`,
          snapshot.marketEntries.length === 0
            ? ["这一行暂时没有可交易的货。"]
            : snapshot.marketEntries.map(
                ({ entry, goodDefinition }) =>
                  `${goodDefinition.name}｜买入 ${entry.buyPrice}｜卖出 ${entry.sellPrice}｜基价 ${entry.rolledBasePrice}`
              ),
        ),
      }
    );
  }

  if (input.request.actionId === "market-rumor") {
    const snapshot = getMarketHouseSnapshot(
      stateWithMarkets,
      input.houseDefinition,
      selectedShopType
    );
    return withSessionState(
      {
        gameState: snapshot.state,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      {
        overlay: createAlertOverlay(
          "市面风向",
          [
            `${snapshot.cityDefinition.name}繁荣 ${snapshot.cityDefinition.prosperity}，治安压力 ${snapshot.cityDefinition.danger}。`,
            `当前偏好：${snapshot.cityDefinition.specialDemand.join(" / ") || "无"}`,
            `${getShopLabel(snapshot.selectedShopType)}现有货目 ${snapshot.selectedShopInventoryCount} 项。`,
          ]
        ),
      }
    );
  }

  if (input.request.actionId === "close-alert") {
    return withSessionState(
      {
        gameState: stateWithMarkets,
        characterDefinitions: input.characterDefinitions,
      },
      sessionState,
      { overlay: null }
    );
  }

  const nextShopType = parseShopAction(input.request.actionId);
  if (nextShopType != null) {
    const snapshot = getMarketHouseSnapshot(
      stateWithMarkets,
      input.houseDefinition,
      nextShopType
    );
    return {
      gameState: snapshot.state,
      characterDefinitions: input.characterDefinitions,
      sessionState:
        sessionState == null
          ? sessionState
          : {
              ...sessionState,
              selectedShopType: nextShopType,
              dialoguePhase: "open",
              dialogueLines: createOpenLines(snapshot),
              overlay: null,
            },
    };
  }

  return createTransitionResult(
    {
      gameState: stateWithMarkets,
      characterDefinitions: input.characterDefinitions,
      sessionState,
    }
  );
}

export const marketHouseHouseModule: HouseModuleDefinition<"market-house"> = {
  moduleId: "market-house",
  enter(input) {
    const cityDefinition = getCityDefinition(input.houseDefinition.cityId);
    const nextState = ensureMarketShops(input.gameState, cityDefinition);

    return {
      gameState: nextState,
      characterDefinitions: input.characterDefinitions,
      sessionState: createInitialMarketHouseSessionState(
        DEFAULT_MARKET_SHOP_TYPE,
        createGreetingLines(cityDefinition)
      ),
    };
  },
  dispatch(input) {
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
    const sessionState =
      input.sessionState ??
      createInitialMarketHouseSessionState(DEFAULT_MARKET_SHOP_TYPE, ["市集正在整理货架。"]);
    const snapshot = getMarketHouseSnapshot(
      input.gameState,
      input.houseDefinition,
      sessionState.selectedShopType
    );
    const playerCharacter = getPlayerCharacter(
      input.characterDefinitions,
      input.playerCharacterId
    );
    const houseNpcSummaries = selectCityNpcSummariesForHouse(
      snapshot.state,
      input.houseDefinition,
      prototypeCityNpcPools
    );
    const isIdle = sessionState.dialoguePhase === "idle";
    const isGreeting = sessionState.dialoguePhase === "greeting";
    const isOpen = sessionState.dialoguePhase === "open";
    const defaultNpc =
      input.houseDefinition.defaultCharacterId == null
        ? null
        : input.characterDefinitions.find(
            (characterDefinition) =>
              characterDefinition.id === input.houseDefinition.defaultCharacterId
          ) ?? null;
    const roster = [
      ...(defaultNpc == null
        ? []
        : [
            {
              characterId: defaultNpc.id,
              name: defaultNpc.name,
              ...(defaultNpc.title == null ? {} : { title: defaultNpc.title }),
              actionId: "open-market-dialogue",
              isSelected: true,
            },
          ]),
      ...houseNpcSummaries
        .filter((npcSummary) => npcSummary.id !== defaultNpc?.id)
        .map((npcSummary) => ({
          characterId: npcSummary.id,
          name: npcSummary.name,
          ...(npcSummary.title == null ? {} : { title: npcSummary.title }),
          actionId: "open-market-dialogue",
        })),
    ];

    return {
      moduleId: "market-house",
      houseId: input.houseDefinition.id,
      sceneTitle: input.houseDefinition.name,
      sceneSubtitle: "市集总览 / 城市商路",
      standbyRoster: isIdle ? roster : [],
      dialogue:
        isIdle || defaultNpc == null
          ? null
          : {
              mode: "character",
              speakerName: defaultNpc.name,
              characterId: defaultNpc.id,
              position: "right",
              textLines: sessionState.dialogueLines,
              advanceActionId: isGreeting ? "advance-greeting" : null,
              advanceHintText: isGreeting ? "点击继续" : null,
            },
      actionContainer:
        !isOpen
          ? null
          : {
              title: `${snapshot.cityDefinition.name} / ${getShopLabel(snapshot.selectedShopType)}`,
              actions: [
                ...AVAILABLE_MARKET_SHOPS.map<HouseActionViewModel>((shopType) => ({
                  id: `${SHOP_ACTION_PREFIX}${shopType}`,
                  label: getShopLabel(shopType),
                  disabled: shopType === snapshot.selectedShopType,
                })),
                { id: "inspect-shop", label: "查看货单", tone: "accent" },
                { id: "market-rumor", label: "看行情" },
                { id: "dismiss-dialogue", label: "关闭" },
              ],
            },
      statusCard: {
        eyebrow: "商路",
        title: getShopLabel(snapshot.selectedShopType),
        subtitle: `${snapshot.cityDefinition.name} / 下次刷新区间 ${snapshot.refreshedDayText}`,
        metrics: [
          { label: "金钱", value: `${playerCharacter.stats.gold} 文` },
          { label: "货目", value: `${snapshot.selectedShopInventoryCount}` },
          { label: "繁荣", value: `${snapshot.cityDefinition.prosperity}` },
          { label: "风险", value: `${snapshot.cityDefinition.danger}` },
        ],
      },
      overlay: selectOverlayViewModel(sessionState.overlay),
      leaveAction: {
        id: "leave-house",
        label: "离开市集",
        ...(isIdle ? { tone: "accent" } : {}),
      },
    };
  },
};
