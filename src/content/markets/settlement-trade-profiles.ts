import type { CityId } from "../../domain/city";

export type CurrentFallbackTradeGoodId =
  | "rice"
  | "wheat"
  | "salt"
  | "soybean"
  | "millet"
  | "ginseng"
  | "herbs"
  | "silk"
  | "tea"
  | "ironware"
  | "warhorse"
  | "antique";

export type SettlementTradeGoodsCategory =
  | "grain"
  | "textile"
  | "medicine"
  | "salt"
  | "seafood"
  | "luxury"
  | "industrial"
  | "fruit"
  | "livestock"
  | "misc";

export type SettlementTradeGoodsDraft = {
  name: string;
  category: SettlementTradeGoodsCategory;
  runtimeFallbackGoodsIds: readonly CurrentFallbackTradeGoodId[];
  draftBasePrice?: number;
  temporaryArbitragePricing?: SettlementTradeTemporaryArbitragePricing;
};

export type SettlementTradeTemporaryArbitragePricing = {
  strategy: "origin-cheaper-nonlocal-higher";
  localBuyPriceMultiplier: number;
  nonLocalSellPriceMultiplier: number;
};

const DRAFT_ONLY_HISTORICAL_PREMIUM_RULE = {
  strategy: "origin-cheaper-nonlocal-higher",
  localBuyPriceMultiplier: 0.94,
  nonLocalSellPriceMultiplier: 1.02,
} as const satisfies SettlementTradeTemporaryArbitragePricing;

export const settlementTradeGoodsCatalog = {
  grain_staples: {
    name: "粮食",
    category: "grain",
    runtimeFallbackGoodsIds: ["rice", "wheat", "soybean", "millet"],
  },
  wheat: {
    name: "麦",
    category: "grain",
    runtimeFallbackGoodsIds: ["wheat"],
  },
  premium_grain: {
    name: "优粮",
    category: "grain",
    runtimeFallbackGoodsIds: ["rice", "wheat"],
  },
  yunjin: {
    name: "云锦",
    category: "textile",
    runtimeFallbackGoodsIds: ["silk", "antique"],
  },
  silk_bolts: {
    name: "丝绸",
    category: "textile",
    runtimeFallbackGoodsIds: ["silk"],
  },
  gold_leaf: {
    name: "金箔",
    category: "luxury",
    runtimeFallbackGoodsIds: ["antique"],
  },
  tea: {
    name: "茶",
    category: "misc",
    runtimeFallbackGoodsIds: ["tea"],
  },
  premium_tea: {
    name: "名茶",
    category: "luxury",
    runtimeFallbackGoodsIds: ["tea", "antique"],
  },
  rice_grain: {
    name: "稻米",
    category: "grain",
    runtimeFallbackGoodsIds: ["rice"],
  },
  premium_rice: {
    name: "优米",
    category: "luxury",
    runtimeFallbackGoodsIds: ["rice", "antique"],
  },
  bean_and_wheat: {
    name: "豆麦",
    category: "grain",
    runtimeFallbackGoodsIds: ["soybean", "wheat"],
  },
  premium_wheat: {
    name: "优麦",
    category: "luxury",
    runtimeFallbackGoodsIds: ["wheat", "antique"],
  },
  fish_goods: {
    name: "鱼货",
    category: "seafood",
    runtimeFallbackGoodsIds: [],
    draftBasePrice: 160,
    temporaryArbitragePricing: DRAFT_ONLY_HISTORICAL_PREMIUM_RULE,
  },
  salted_duck_egg: {
    name: "咸鸭蛋",
    category: "misc",
    runtimeFallbackGoodsIds: [],
    draftBasePrice: 130,
    temporaryArbitragePricing: DRAFT_ONLY_HISTORICAL_PREMIUM_RULE,
  },
  huai_salt: {
    name: "淮盐",
    category: "salt",
    runtimeFallbackGoodsIds: ["salt"],
  },
  transport_grain: {
    name: "漕粮",
    category: "grain",
    runtimeFallbackGoodsIds: ["rice", "wheat"],
  },
  refined_salt_goods: {
    name: "盐货精品",
    category: "luxury",
    runtimeFallbackGoodsIds: ["salt", "antique"],
  },
  lingjuan: {
    name: "绫绢",
    category: "textile",
    runtimeFallbackGoodsIds: ["silk"],
  },
  song_brocade: {
    name: "宋锦",
    category: "luxury",
    runtimeFallbackGoodsIds: ["silk", "antique"],
  },
  wuchang_fish: {
    name: "武昌鱼",
    category: "seafood",
    runtimeFallbackGoodsIds: [],
    draftBasePrice: 220,
    temporaryArbitragePricing: DRAFT_ONLY_HISTORICAL_PREMIUM_RULE,
  },
  tribute_rice: {
    name: "贡米",
    category: "luxury",
    runtimeFallbackGoodsIds: ["rice", "antique"],
  },
  well_salt: {
    name: "井盐",
    category: "salt",
    runtimeFallbackGoodsIds: ["salt"],
  },
  mountain_goods: {
    name: "山货",
    category: "misc",
    runtimeFallbackGoodsIds: ["herbs", "antique"],
  },
  shu_brocade: {
    name: "蜀锦",
    category: "textile",
    runtimeFallbackGoodsIds: ["silk", "antique"],
  },
  shu_embroidery: {
    name: "蜀绣",
    category: "textile",
    runtimeFallbackGoodsIds: ["silk", "antique"],
  },
  brocade_masterwork: {
    name: "锦绣精品",
    category: "luxury",
    runtimeFallbackGoodsIds: ["silk", "antique"],
  },
  sea_salt: {
    name: "海盐",
    category: "salt",
    runtimeFallbackGoodsIds: ["salt"],
  },
  sea_goods: {
    name: "海货",
    category: "seafood",
    runtimeFallbackGoodsIds: [],
    draftBasePrice: 190,
    temporaryArbitragePricing: DRAFT_ONLY_HISTORICAL_PREMIUM_RULE,
  },
  imported_goods: {
    name: "舶来货",
    category: "luxury",
    runtimeFallbackGoodsIds: ["antique"],
  },
  alum: {
    name: "明矾",
    category: "industrial",
    runtimeFallbackGoodsIds: [],
    draftBasePrice: 240,
    temporaryArbitragePricing: DRAFT_ONLY_HISTORICAL_PREMIUM_RULE,
  },
  alum_ore: {
    name: "矾石",
    category: "industrial",
    runtimeFallbackGoodsIds: [],
    draftBasePrice: 180,
    temporaryArbitragePricing: DRAFT_ONLY_HISTORICAL_PREMIUM_RULE,
  },
  refined_alum: {
    name: "精矾",
    category: "industrial",
    runtimeFallbackGoodsIds: [],
    draftBasePrice: 320,
    temporaryArbitragePricing: DRAFT_ONLY_HISTORICAL_PREMIUM_RULE,
  },
  lychee: {
    name: "荔枝",
    category: "fruit",
    runtimeFallbackGoodsIds: [],
    draftBasePrice: 170,
    temporaryArbitragePricing: DRAFT_ONLY_HISTORICAL_PREMIUM_RULE,
  },
  jingxi_rice: {
    name: "京西稻",
    category: "grain",
    runtimeFallbackGoodsIds: ["rice", "antique"],
  },
  capital_misc_goods: {
    name: "都城杂货",
    category: "misc",
    runtimeFallbackGoodsIds: ["antique"],
  },
  northern_fine_goods: {
    name: "北货精品",
    category: "luxury",
    runtimeFallbackGoodsIds: ["antique"],
  },
  bian_embroidery: {
    name: "汴绣",
    category: "textile",
    runtimeFallbackGoodsIds: ["silk", "antique"],
  },
  medicinals: {
    name: "药材",
    category: "medicine",
    runtimeFallbackGoodsIds: ["herbs"],
  },
  medicinal_herbs: {
    name: "药草",
    category: "medicine",
    runtimeFallbackGoodsIds: ["herbs"],
  },
  authentic_medicinals: {
    name: "道地药",
    category: "luxury",
    runtimeFallbackGoodsIds: ["herbs", "ginseng"],
  },
  guanzhong_wheat: {
    name: "小麦",
    category: "grain",
    runtimeFallbackGoodsIds: ["wheat"],
  },
  horses: {
    name: "马匹",
    category: "livestock",
    runtimeFallbackGoodsIds: ["warhorse"],
  },
  fine_horses: {
    name: "良马",
    category: "luxury",
    runtimeFallbackGoodsIds: ["warhorse", "antique"],
  },
} as const satisfies Record<string, SettlementTradeGoodsDraft>;

export type SettlementTradeGoodsId = keyof typeof settlementTradeGoodsCatalog;

export type SettlementTradeProfile = {
  cityId: CityId;
  cityName: string;
  exportTiers: {
    primary: readonly SettlementTradeGoodsId[];
    secondary: readonly SettlementTradeGoodsId[];
    rare: readonly SettlementTradeGoodsId[];
  };
  shortages: readonly SettlementTradeGoodsId[];
  rareDemands: readonly SettlementTradeGoodsId[];
  importSources: Partial<Record<SettlementTradeGoodsId, readonly CityId[]>>;
  notes?: readonly string[];
};

/**
 * Draft boundary:
 * - exportTiers try to preserve the historically reviewed late-Yuan/early-Ming city specialties.
 * - shortages and rareDemands are settlement-level gameplay inferences so arbitrage loops can exist.
 * - runtimeFallbackGoodsIds bridge this draft to the current small global goods pool; empty arrays mark
 *   future historical goods that still need dedicated TradeGoodDefinition coverage.
 */
export const settlementTradeProfiles = [
  {
    cityId: "city.kulan",
    cityName: "濠州",
    exportTiers: {
      primary: ["grain_staples"],
      secondary: ["wheat"],
      rare: ["premium_grain"],
    },
    shortages: ["yunjin", "huai_salt"],
    rareDemands: ["gold_leaf", "premium_tea"],
    importSources: {
      yunjin: ["city.yingtian"],
      huai_salt: ["city.yangzhou", "city.huaian"],
      gold_leaf: ["city.yingtian"],
      premium_tea: ["city.luzhou", "city.anqing", "city.fuzhou"],
    },
    notes: [
      "当前 runtime city id 仍是 city.kulan；草案按濠州来维护历史货物定位。",
    ],
  },
  {
    cityId: "city.yingtian",
    cityName: "集庆路",
    exportTiers: {
      primary: ["yunjin"],
      secondary: ["silk_bolts"],
      rare: ["gold_leaf"],
    },
    shortages: ["medicinals", "well_salt"],
    rareDemands: ["authentic_medicinals", "refined_salt_goods"],
    importSources: {
      medicinals: ["city.gongchang"],
      well_salt: ["city.chongqing"],
      authentic_medicinals: ["city.gongchang"],
      refined_salt_goods: ["city.yangzhou", "city.chongqing"],
    },
  },
  {
    cityId: "city.luzhou",
    cityName: "庐州路",
    exportTiers: {
      primary: ["tea"],
      secondary: ["grain_staples"],
      rare: ["premium_tea"],
    },
    shortages: ["yunjin", "huai_salt"],
    rareDemands: ["gold_leaf", "refined_salt_goods"],
    importSources: {
      yunjin: ["city.yingtian"],
      huai_salt: ["city.yangzhou", "city.huaian"],
      gold_leaf: ["city.yingtian"],
      refined_salt_goods: ["city.yangzhou"],
    },
  },
  {
    cityId: "city.anqing",
    cityName: "安庆路",
    exportTiers: {
      primary: ["tea"],
      secondary: ["grain_staples"],
      rare: ["premium_tea"],
    },
    shortages: ["yunjin", "huai_salt"],
    rareDemands: ["gold_leaf", "medicinals"],
    importSources: {
      yunjin: ["city.yingtian"],
      huai_salt: ["city.yangzhou", "city.huaian"],
      gold_leaf: ["city.yingtian"],
      medicinals: ["city.gongchang"],
    },
  },
  {
    cityId: "city.taiping",
    cityName: "太平路",
    exportTiers: {
      primary: ["grain_staples"],
      secondary: ["rice_grain"],
      rare: ["premium_rice"],
    },
    shortages: ["yunjin", "alum"],
    rareDemands: ["gold_leaf", "premium_tea"],
    importSources: {
      yunjin: ["city.yingtian"],
      alum: ["city.wenzhou"],
      gold_leaf: ["city.yingtian"],
      premium_tea: ["city.luzhou", "city.anqing", "city.fuzhou"],
    },
  },
  {
    cityId: "city.anfeng",
    cityName: "安丰路",
    exportTiers: {
      primary: ["grain_staples"],
      secondary: ["bean_and_wheat"],
      rare: ["premium_grain"],
    },
    shortages: ["yunjin", "huai_salt"],
    rareDemands: ["fine_horses", "gold_leaf"],
    importSources: {
      yunjin: ["city.yingtian"],
      huai_salt: ["city.yangzhou", "city.huaian"],
      fine_horses: ["city.fengyuan"],
      gold_leaf: ["city.yingtian"],
    },
  },
  {
    cityId: "city.runing",
    cityName: "颍州",
    exportTiers: {
      primary: ["grain_staples"],
      secondary: ["wheat"],
      rare: ["premium_wheat"],
    },
    shortages: ["yunjin", "huai_salt"],
    rareDemands: ["gold_leaf", "premium_tea"],
    importSources: {
      yunjin: ["city.yingtian"],
      huai_salt: ["city.yangzhou", "city.huaian"],
      gold_leaf: ["city.yingtian"],
      premium_tea: ["city.luzhou", "city.anqing", "city.fuzhou"],
    },
    notes: [
      "当前 runtime city id 为 city.runing；草案按颍州口径维护。",
    ],
  },
  {
    cityId: "city.huaian",
    cityName: "高邮府",
    exportTiers: {
      primary: ["fish_goods"],
      secondary: ["grain_staples"],
      rare: ["salted_duck_egg"],
    },
    shortages: ["medicinals", "shu_brocade"],
    rareDemands: ["authentic_medicinals", "brocade_masterwork"],
    importSources: {
      medicinals: ["city.gongchang"],
      shu_brocade: ["city.chengdu"],
      authentic_medicinals: ["city.gongchang"],
      brocade_masterwork: ["city.chengdu"],
    },
  },
  {
    cityId: "city.yangzhou",
    cityName: "扬州路",
    exportTiers: {
      primary: ["huai_salt"],
      secondary: ["transport_grain"],
      rare: ["refined_salt_goods"],
    },
    shortages: ["medicinals", "shu_brocade"],
    rareDemands: ["authentic_medicinals", "brocade_masterwork"],
    importSources: {
      medicinals: ["city.gongchang"],
      shu_brocade: ["city.chengdu"],
      authentic_medicinals: ["city.gongchang"],
      brocade_masterwork: ["city.chengdu"],
    },
  },
  {
    cityId: "city.suzhou",
    cityName: "平江路",
    exportTiers: {
      primary: ["silk_bolts"],
      secondary: ["lingjuan"],
      rare: ["song_brocade"],
    },
    shortages: ["medicinals", "premium_grain"],
    rareDemands: ["authentic_medicinals", "tribute_rice"],
    importSources: {
      medicinals: ["city.gongchang"],
      premium_grain: ["city.kulan", "city.taiping"],
      authentic_medicinals: ["city.gongchang"],
      tribute_rice: ["city.nanchang"],
    },
  },
  {
    cityId: "city.wuchang",
    cityName: "武昌路",
    exportTiers: {
      primary: ["fish_goods"],
      secondary: ["grain_staples"],
      rare: ["wuchang_fish"],
    },
    shortages: ["yunjin", "huai_salt"],
    rareDemands: ["gold_leaf", "premium_tea"],
    importSources: {
      yunjin: ["city.yingtian"],
      huai_salt: ["city.yangzhou", "city.huaian"],
      gold_leaf: ["city.yingtian"],
      premium_tea: ["city.luzhou", "city.anqing", "city.fuzhou"],
    },
  },
  {
    cityId: "city.nanchang",
    cityName: "龙兴路",
    exportTiers: {
      primary: ["grain_staples"],
      secondary: ["fish_goods"],
      rare: ["tribute_rice"],
    },
    shortages: ["yunjin", "sea_salt"],
    rareDemands: ["gold_leaf", "brocade_masterwork"],
    importSources: {
      yunjin: ["city.yingtian"],
      sea_salt: ["city.ningbo", "city.fuzhou"],
      gold_leaf: ["city.yingtian"],
      brocade_masterwork: ["city.chengdu"],
    },
  },
  {
    cityId: "city.chongqing",
    cityName: "重庆路",
    exportTiers: {
      primary: ["well_salt"],
      secondary: ["mountain_goods"],
      rare: ["refined_salt_goods"],
    },
    shortages: ["yunjin", "sea_goods"],
    rareDemands: ["gold_leaf", "imported_goods"],
    importSources: {
      yunjin: ["city.yingtian"],
      sea_goods: ["city.ningbo", "city.fuzhou"],
      gold_leaf: ["city.yingtian"],
      imported_goods: ["city.ningbo"],
    },
  },
  {
    cityId: "city.chengdu",
    cityName: "成都路",
    exportTiers: {
      primary: ["shu_brocade"],
      secondary: ["shu_embroidery"],
      rare: ["brocade_masterwork"],
    },
    shortages: ["sea_goods", "alum"],
    rareDemands: ["imported_goods", "refined_salt_goods"],
    importSources: {
      sea_goods: ["city.ningbo", "city.fuzhou"],
      alum: ["city.wenzhou"],
      imported_goods: ["city.ningbo"],
      refined_salt_goods: ["city.yangzhou"],
    },
    notes: [
      "当前 mapNodeId 仍是 settlement.chendu_province；草案按成都路口径维护。",
    ],
  },
  {
    cityId: "city.ningbo",
    cityName: "庆元路",
    exportTiers: {
      primary: ["sea_salt"],
      secondary: ["sea_goods"],
      rare: ["imported_goods"],
    },
    shortages: ["medicinals", "shu_brocade"],
    rareDemands: ["authentic_medicinals", "brocade_masterwork"],
    importSources: {
      medicinals: ["city.gongchang"],
      shu_brocade: ["city.chengdu"],
      authentic_medicinals: ["city.gongchang"],
      brocade_masterwork: ["city.chengdu"],
    },
  },
  {
    cityId: "city.wenzhou",
    cityName: "温州路",
    exportTiers: {
      primary: ["alum"],
      secondary: ["alum_ore"],
      rare: ["refined_alum"],
    },
    shortages: ["medicinals", "shu_brocade"],
    rareDemands: ["authentic_medicinals", "brocade_masterwork"],
    importSources: {
      medicinals: ["city.gongchang"],
      shu_brocade: ["city.chengdu"],
      authentic_medicinals: ["city.gongchang"],
      brocade_masterwork: ["city.chengdu"],
    },
  },
  {
    cityId: "city.fuzhou",
    cityName: "福州路",
    exportTiers: {
      primary: ["tea"],
      secondary: ["lychee"],
      rare: ["premium_tea"],
    },
    shortages: ["medicinals", "yunjin"],
    rareDemands: ["authentic_medicinals", "gold_leaf"],
    importSources: {
      medicinals: ["city.gongchang"],
      yunjin: ["city.yingtian"],
      authentic_medicinals: ["city.gongchang"],
      gold_leaf: ["city.yingtian"],
    },
  },
  {
    cityId: "city.dadu",
    cityName: "大都路",
    exportTiers: {
      primary: ["jingxi_rice"],
      secondary: ["capital_misc_goods"],
      rare: ["northern_fine_goods"],
    },
    shortages: ["yunjin", "lychee"],
    rareDemands: ["gold_leaf", "imported_goods"],
    importSources: {
      yunjin: ["city.yingtian"],
      lychee: ["city.fuzhou"],
      gold_leaf: ["city.yingtian"],
      imported_goods: ["city.ningbo"],
    },
  },
  {
    cityId: "city.kaifeng",
    cityName: "汴梁路",
    exportTiers: {
      primary: ["grain_staples"],
      secondary: ["bian_embroidery"],
      rare: ["premium_wheat"],
    },
    shortages: ["sea_salt", "medicinals"],
    rareDemands: ["authentic_medicinals", "refined_salt_goods"],
    importSources: {
      sea_salt: ["city.ningbo", "city.fuzhou"],
      medicinals: ["city.gongchang"],
      authentic_medicinals: ["city.gongchang"],
      refined_salt_goods: ["city.yangzhou"],
    },
  },
  {
    cityId: "city.gongchang",
    cityName: "巩昌路",
    exportTiers: {
      primary: ["medicinals"],
      secondary: ["medicinal_herbs"],
      rare: ["authentic_medicinals"],
    },
    shortages: ["yunjin", "premium_tea"],
    rareDemands: ["gold_leaf", "brocade_masterwork"],
    importSources: {
      yunjin: ["city.yingtian"],
      premium_tea: ["city.fuzhou", "city.anqing", "city.luzhou"],
      gold_leaf: ["city.yingtian"],
      brocade_masterwork: ["city.chengdu"],
    },
  },
  {
    cityId: "city.fengyuan",
    cityName: "奉元路",
    exportTiers: {
      primary: ["guanzhong_wheat"],
      secondary: ["horses"],
      rare: ["fine_horses"],
    },
    shortages: ["yunjin", "sea_goods"],
    rareDemands: ["gold_leaf", "imported_goods"],
    importSources: {
      yunjin: ["city.yingtian"],
      sea_goods: ["city.ningbo", "city.fuzhou"],
      gold_leaf: ["city.yingtian"],
      imported_goods: ["city.ningbo"],
    },
  },
] as const satisfies readonly SettlementTradeProfile[];

export const settlementTradeProfilesByCityId = Object.fromEntries(
  settlementTradeProfiles.map((profile) => [profile.cityId, profile])
) as Record<string, SettlementTradeProfile>;

export const settlementTradeGoodsRequiringNewDefinitions = Object.entries(
  settlementTradeGoodsCatalog
)
  .filter(([, definition]) => definition.runtimeFallbackGoodsIds.length === 0)
  .map(([goodsId]) => goodsId as SettlementTradeGoodsId);
