import type {
  TradeGoodCategory,
  TradeGoodDefinition,
  TradeGoodRarity,
} from "../../domain/trade-good";
import type { SettlementTradeGoodId } from "../../domain/settlement-trade";
import { settlementTradeGoodsById } from "./settlement-trade-goods";
import {
  settlementTradeGoodsCatalog,
  type SettlementTradeGoodsDraft,
} from "./settlement-trade-profiles";
import { globalGoodsPool } from "./global-goods-pool";

type SettlementDraftRuntimeTradeGoodSpec = {
  category: TradeGoodCategory;
  rarity: TradeGoodRarity;
  unit: string;
  description: string;
};

type SettlementRuntimeTradeGoodSpec = {
  category: TradeGoodCategory;
  rarity: TradeGoodRarity;
};

const settlementRuntimeTradeGoodSpecs = {
  silk_textiles: { category: "silk", rarity: "rare" },
  ramie_cloth: { category: "silk", rarity: "common" },
  cotton_cloth: { category: "silk", rarity: "common" },
  tea: { category: "misc", rarity: "uncommon" },
  wine: { category: "misc", rarity: "uncommon" },
  ceramics: { category: "special", rarity: "uncommon" },
  copperware: { category: "industrial", rarity: "uncommon" },
  ironware: { category: "industrial", rarity: "common" },
  salt: { category: "misc", rarity: "common" },
  paper_brush: { category: "misc", rarity: "uncommon" },
  bamboo_woodware: { category: "special", rarity: "common" },
  woven_goods: { category: "special", rarity: "uncommon" },
  lacquer_oil: { category: "industrial", rarity: "rare" },
  stone_goods: { category: "industrial", rarity: "common" },
  hides: { category: "misc", rarity: "common" },
} as const satisfies Record<SettlementTradeGoodId, SettlementRuntimeTradeGoodSpec>;

const settlementDraftRuntimeTradeGoodSpecs = {
  fish_goods: {
    category: "seafood",
    rarity: "common",
    unit: "篓",
    description: "湖泽鱼货成篓装运，适合沿途贩卖周转。",
  },
  salted_duck_egg: {
    category: "misc",
    rarity: "uncommon",
    unit: "篮",
    description: "腌制鸭蛋耐储耐运，最适合跑长线货路。",
  },
  wuchang_fish: {
    category: "seafood",
    rarity: "rare",
    unit: "篓",
    description: "武昌江湖鲜货，以时鲜和水路见长。",
  },
  sea_goods: {
    category: "seafood",
    rarity: "uncommon",
    unit: "箱",
    description: "沿海运来的海产与干鲜杂货，常走远途市路。",
  },
  alum: {
    category: "industrial",
    rarity: "uncommon",
    unit: "包",
    description: "温州山场所出明矾，可用于染整与杂业。",
  },
  alum_ore: {
    category: "industrial",
    rarity: "common",
    unit: "包",
    description: "尚待提炼的矾矿原石，走量大于走精。",
  },
  refined_alum: {
    category: "industrial",
    rarity: "rare",
    unit: "包",
    description: "精炼后的上等明矾，比原矿更易卖出高价。",
  },
  lychee: {
    category: "fruit",
    rarity: "rare",
    unit: "篮",
    description: "南路鲜荔枝，贵在时令与转运艰难。",
  },
} as const satisfies Record<string, SettlementDraftRuntimeTradeGoodSpec>;

export type SettlementDraftRuntimeTradeGoodId =
  keyof typeof settlementDraftRuntimeTradeGoodSpecs;

function createPriceBand(basePrice: number): {
  minPrice: number;
  maxPrice: number;
} {
  const minPrice = Math.max(1, Math.round(basePrice * 0.72));
  const maxPrice = Math.max(minPrice, Math.round(basePrice * 1.18));
  return { minPrice, maxPrice };
}

function createSettlementDraftRuntimeTradeGood(
  goodsId: SettlementDraftRuntimeTradeGoodId
): TradeGoodDefinition {
  const goodsDefinition =
    settlementTradeGoodsCatalog[goodsId] as SettlementTradeGoodsDraft;
  const runtimeSpec = settlementDraftRuntimeTradeGoodSpecs[goodsId];
  const basePrice = goodsDefinition.draftBasePrice;

  if (basePrice == null) {
    throw new Error(
      `Settlement draft runtime good "${goodsId}" is missing draftBasePrice.`
    );
  }

  const priceBand = createPriceBand(basePrice);

  return {
    id: goodsId,
    name: goodsDefinition.name,
    category: runtimeSpec.category,
    shopType: "settlement-trade",
    rarity: runtimeSpec.rarity,
    basePrice,
    minPrice: priceBand.minPrice,
    maxPrice: priceBand.maxPrice,
    unit: runtimeSpec.unit,
    originTags: [],
    demandTags: [],
    description: runtimeSpec.description,
  };
}

function createSettlementRuntimeTradeGood(
  goodsId: SettlementTradeGoodId
): TradeGoodDefinition {
  const goodsDefinition = settlementTradeGoodsById[goodsId];
  const runtimeSpec = settlementRuntimeTradeGoodSpecs[goodsId];
  const priceBand = createPriceBand(goodsDefinition.basePrice);

  return {
    id: goodsId,
    name: goodsDefinition.name,
    category: runtimeSpec.category,
    shopType: "settlement-trade",
    rarity: runtimeSpec.rarity,
    basePrice: goodsDefinition.basePrice,
    minPrice: priceBand.minPrice,
    maxPrice: priceBand.maxPrice,
    unit: goodsDefinition.unit,
    originTags: [],
    demandTags: [],
    description: goodsDefinition.description,
  };
}

export const settlementRuntimeTradeGoodsPool: TradeGoodDefinition[] =
  Object.keys(settlementRuntimeTradeGoodSpecs).map((goodsId) =>
    createSettlementRuntimeTradeGood(goodsId as SettlementTradeGoodId)
  );

export const settlementDraftRuntimeTradeGoodsPool: TradeGoodDefinition[] =
  Object.keys(settlementDraftRuntimeTradeGoodSpecs).map((goodsId) =>
    createSettlementDraftRuntimeTradeGood(
      goodsId as SettlementDraftRuntimeTradeGoodId
    )
  );

export const runtimeTradeGoodsPool: TradeGoodDefinition[] = [
  ...globalGoodsPool,
  ...settlementRuntimeTradeGoodsPool,
  ...settlementDraftRuntimeTradeGoodsPool,
];

export function getRuntimeTradeGoodDefinition(
  goodsId: string
): TradeGoodDefinition | null {
  return (
    runtimeTradeGoodsPool.find(
      (goodsDefinition) => goodsDefinition.id === goodsId
    ) ?? null
  );
}

export function isSettlementDraftRuntimeTradeGoodId(
  goodsId: string
): goodsId is SettlementDraftRuntimeTradeGoodId {
  return goodsId in settlementDraftRuntimeTradeGoodSpecs;
}
