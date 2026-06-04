import type {
  CardDefinition,
  CharacterDefinition,
  CityEntryDefinition,
  CityDefinition,
  CityNpcPoolDefinition,
  HouseAccessRefusalRule,
  HouseDefinition,
  MapDefinition,
  ValuableItemDefinition,
} from "../domain";
import {
  ZHU_YUANZHANG_STORY_FLAG_KEYS,
  ZHU_YUANZHANG_STORY_STAGES,
  type ZhuYuanzhangStoryStage,
} from "../domain";
import {
  zhuYuanzhangCityRosters,
  zhuYuanzhangEarlyCharacters,
} from "./zhu-yuanzhang-early-characters";

export const prototypeHouseAccessRefusalRules: HouseAccessRefusalRule[] = [
  {
    id: "rule.zhu_yuanzhang.temple.first_review_stay",
    priority: 100,
    storyStages: [ZHU_YUANZHANG_STORY_STAGES.huangjueTemple],
    excludedHouseModuleIds: ["temple-house", "keep-house"],
    missingFlags: [
      ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleReviewCompleted,
    ],
    speakerCharacterId: "player",
    title: "暂且留在寺中",
    text: "既然答应了主持，就先不要离开寺院吧。",
    confirmLabel: "知道了",
  },
  {
    id: "rule.zhu_yuanzhang.temple.keep_closed",
    priority: 50,
    houseModuleIds: ["keep-house"],
    storyStages: [ZHU_YUANZHANG_STORY_STAGES.huangjueTemple],
    speakerCharacterId: "char.kulan_soldier",
    title: "帅府闭门",
    text: "军机要出，请阁下回避。",
    confirmLabel: "离开",
  },
];

export const prototypeMap: MapDefinition = {
  id: "map.prototype_frontier",
  name: "边境地图",
  backgroundId: "bg.map.prototype_frontier",
  nodes: [{ cityId: "city.kulan", x: 2, y: 2 }],
};

export const prototypeCity: CityDefinition = {
  id: "city.kulan",
  name: "濠州",
  regionId: "region.frontier",
  mapNodeId: "settlement.fenyang_province",
  houseIds: [
    "house.kulan.leader_residence",
    "house.kulan.temple",
    "home_001",
    "house.kulan.keep",
    "house.kulan.tea_house",
    "house.kulan.market",
    "house.kulan.grain_shop",
    "house.kulan.medicine_house",
    "house.kulan.inn",
  ],
  neighbourCityIds: [],
  travelCost: 1,
  tags: ["castle-town", "market", "commercial", "jiangnan", "large-city"],
  prosperity: 90,
  danger: 20,
  specialDemand: ["silk", "tea", "luxury"],
};

const playableYuanmoCitySpecs = [
  {
    slug: "yingtian",
    name: "集庆路",
    mapNodeId: "settlement.yingtian_province",
    tags: ["jiangnan", "large-city", "former-yuan-garrison"],
    prosperity: 92,
    danger: 35,
    specialDemand: ["silk", "tea", "luxury"],
  },
  {
    slug: "luzhou",
    name: "庐州路",
    mapNodeId: "settlement.luzhou_province",
    tags: ["jianghuai", "market", "military"],
    prosperity: 76,
    danger: 32,
    specialDemand: ["grain", "iron", "medicine"],
  },
  {
    slug: "anqing",
    name: "安庆路",
    mapNodeId: "settlement.anqing_province",
    tags: ["jianghuai", "river-port", "frontier"],
    prosperity: 72,
    danger: 42,
    specialDemand: ["grain", "timber", "iron"],
  },
  {
    slug: "taiping",
    name: "太平路",
    mapNodeId: "settlement.taiping_province",
    tags: ["river-port", "military", "frontier"],
    prosperity: 74,
    danger: 48,
    specialDemand: ["fish", "timber", "iron"],
  },
  {
    slug: "anfeng",
    name: "安丰路",
    mapNodeId: "settlement.tieling_province",
    tags: ["hongjin", "military", "plain"],
    prosperity: 68,
    danger: 50,
    specialDemand: ["grain", "horses", "cloth"],
  },
  {
    slug: "runing",
    name: "颍州",
    mapNodeId: "settlement.runing_province",
    tags: ["hongjin", "plain", "military"],
    prosperity: 70,
    danger: 52,
    specialDemand: ["grain", "salt", "cloth"],
  },
  {
    slug: "huaian",
    name: "高邮府",
    mapNodeId: "settlement.huaian_province",
    tags: ["canal", "salt", "zhang-shicheng"],
    prosperity: 84,
    danger: 40,
    specialDemand: ["salt", "grain", "silk"],
  },
  {
    slug: "yangzhou",
    name: "扬州路",
    mapNodeId: "settlement.yangzhou_province",
    tags: ["canal", "commercial", "zhang-shicheng"],
    prosperity: 88,
    danger: 38,
    specialDemand: ["salt", "silk", "luxury"],
  },
  {
    slug: "suzhou",
    name: "平江路",
    mapNodeId: "settlement.suzhou_province",
    tags: ["jiangnan", "commercial", "large-city"],
    prosperity: 96,
    danger: 28,
    specialDemand: ["silk", "tea", "luxury"],
  },
  {
    slug: "wuchang",
    name: "武昌路",
    mapNodeId: "settlement.wuchang_province",
    tags: ["chen-han", "river-port", "large-city"],
    prosperity: 86,
    danger: 46,
    specialDemand: ["fish", "iron", "grain"],
  },
  {
    slug: "nanchang",
    name: "龙兴路",
    mapNodeId: "settlement.nanchang_province",
    tags: ["jiangxi", "frontier", "military"],
    prosperity: 80,
    danger: 44,
    specialDemand: ["grain", "timber", "medicine"],
  },
  {
    slug: "chongqing",
    name: "重庆路",
    mapNodeId: "settlement.chongqing_province",
    tags: ["sichuan", "mountain", "river-port"],
    prosperity: 78,
    danger: 34,
    specialDemand: ["medicine", "timber", "salt"],
  },
  {
    slug: "chengdu",
    name: "成都路",
    mapNodeId: "settlement.chendu_province",
    tags: ["sichuan", "large-city", "commercial"],
    prosperity: 90,
    danger: 24,
    specialDemand: ["silk", "medicine", "grain"],
  },
  {
    slug: "ningbo",
    name: "庆元路",
    mapNodeId: "settlement.ningbo_province",
    tags: ["coastal", "fang-guozhen", "trade"],
    prosperity: 82,
    danger: 36,
    specialDemand: ["fish", "silk", "salt"],
  },
  {
    slug: "wenzhou",
    name: "温州路",
    mapNodeId: "settlement.wenzhou_province",
    tags: ["coastal", "fang-guozhen", "trade"],
    prosperity: 76,
    danger: 34,
    specialDemand: ["fish", "timber", "salt"],
  },
  {
    slug: "fuzhou",
    name: "福州路",
    mapNodeId: "settlement.fuzhou_province",
    tags: ["coastal", "yuan-loyalist", "trade"],
    prosperity: 80,
    danger: 36,
    specialDemand: ["fish", "tea", "timber"],
  },
  {
    slug: "dadu",
    name: "大都路",
    mapNodeId: "settlement.shuntian_province",
    tags: ["yuan-court", "capital", "large-city"],
    prosperity: 98,
    danger: 18,
    specialDemand: ["luxury", "horses", "silk"],
  },
  {
    slug: "kaifeng",
    name: "汴梁路",
    mapNodeId: "settlement.kaifeng_province",
    tags: ["henan", "yuan-garrison", "large-city"],
    prosperity: 86,
    danger: 44,
    specialDemand: ["grain", "horses", "iron"],
  },
  {
    slug: "gongchang",
    name: "巩昌路",
    mapNodeId: "settlement.gongchang_province",
    tags: ["northwest", "yuan-garrison", "frontier"],
    prosperity: 66,
    danger: 42,
    specialDemand: ["horses", "iron", "grain"],
  },
  {
    slug: "fengyuan",
    name: "奉元路",
    mapNodeId: "settlement.xian_province",
    tags: ["shaanxi", "large-city", "yuan-garrison"],
    prosperity: 84,
    danger: 36,
    specialDemand: ["horses", "grain", "iron"],
  },
] as const;

type PlayableYuanmoCitySpec = (typeof playableYuanmoCitySpecs)[number];

function getCityId(spec: PlayableYuanmoCitySpec): string {
  return `city.${spec.slug}`;
}

function getCityHouseIds(slug: string): string[] {
  return [
    `house.${slug}.leader_residence`,
    `house.${slug}.temple`,
    `home.${slug}`,
    `house.${slug}.keep`,
    `house.${slug}.tea_house`,
    `house.${slug}.market`,
    `house.${slug}.grain_shop`,
    `house.${slug}.medicine_house`,
    `house.${slug}.inn`,
  ];
}

const generatedPrototypeCities: CityDefinition[] = playableYuanmoCitySpecs.map(
  (spec) => ({
    id: getCityId(spec),
    name: spec.name,
    regionId: "region.yuanmo_china",
    mapNodeId: spec.mapNodeId,
    houseIds: getCityHouseIds(spec.slug),
    neighbourCityIds: [],
    travelCost: 1,
    tags: [...spec.tags],
    prosperity: spec.prosperity,
    danger: spec.danger,
    specialDemand: [...spec.specialDemand],
  })
);

const playableCityByMapNodeId: Record<string, CityDefinition> = Object.fromEntries(
  [prototypeCity, ...generatedPrototypeCities].map((cityDefinition) => [
    cityDefinition.mapNodeId,
    cityDefinition,
  ])
);

const citySlugByCityId: Record<string, string> = {
  "city.kulan": "kulan",
  ...Object.fromEntries(
    playableYuanmoCitySpecs.map((spec) => [getCityId(spec), spec.slug])
  ),
};

export const prototypeCities: CityDefinition[] = [
  prototypeCity,
  ...generatedPrototypeCities,
];

function createStandardCityHouses(
  cityDefinition: CityDefinition,
  slug: string
): HouseDefinition[] {
  return [
    {
      id: `house.${slug}.leader_residence`,
      cityId: cityDefinition.id,
      name: "将领府邸",
      type: "residence",
      moduleId: "leader-residence",
      characterIds: [],
      defaultCharacterId: null,
      backAction: { label: `返回${cityDefinition.name}`, targetView: "city" },
    },
    {
      id: `house.${slug}.temple`,
      cityId: cityDefinition.id,
      name: "寺庙",
      type: "temple",
      moduleId: "temple-house",
      characterIds: [],
      defaultCharacterId: null,
      backAction: { label: `杩斿洖${cityDefinition.name}`, targetView: "city" },
    },
    {
      id: `home.${slug}`,
      cityId: cityDefinition.id,
      name: "自宅",
      type: "residence",
      moduleId: "home-house",
      visibleStoryStages: [ZHU_YUANZHANG_STORY_STAGES.guoZixingCamp],
      enterableStoryStages: [ZHU_YUANZHANG_STORY_STAGES.guoZixingCamp],
      requiresPlayerCurrentCityMatch: true,
      characterIds: [],
      defaultCharacterId: null,
      backAction: { label: `返回${cityDefinition.name}`, targetView: "city" },
    },
    {
      id: `house.${slug}.keep`,
      cityId: cityDefinition.id,
      name: "帅府",
      type: "castle",
      moduleId: "keep-house",
      characterIds: [],
      defaultCharacterId: null,
      backAction: { label: `返回${cityDefinition.name}`, targetView: "city" },
    },
    {
      id: `house.${slug}.tea_house`,
      cityId: cityDefinition.id,
      name: "茶馆",
      type: "tea-house",
      characterIds: [],
      defaultCharacterId: null,
      activityLocationId: "tea-house",
      moduleId: "tea-house",
      backAction: { label: `返回${cityDefinition.name}`, targetView: "city" },
    },
    {
      id: `house.${slug}.market`,
      cityId: cityDefinition.id,
      name: "货栈",
      type: "merchant",
      characterIds: [],
      defaultCharacterId: null,
      activityLocationId: "market",
      moduleId: "market-house",
      backAction: { label: `返回${cityDefinition.name}`, targetView: "city" },
    },
    {
      id: `house.${slug}.grain_shop`,
      cityId: cityDefinition.id,
      name: "粮铺",
      type: "merchant",
      moduleId: "grain-shop",
      characterIds: [],
      defaultCharacterId: null,
      backAction: { label: `返回${cityDefinition.name}`, targetView: "city" },
    },
    {
      id: `house.${slug}.medicine_house`,
      cityId: cityDefinition.id,
      name: "药铺",
      type: "medicine-house",
      moduleId: "medicine-house",
      characterIds: [],
      defaultCharacterId: null,
      backAction: { label: `返回${cityDefinition.name}`, targetView: "city" },
    },
    {
      id: `house.${slug}.inn`,
      cityId: cityDefinition.id,
      name: "客栈",
      type: "inn",
      moduleId: "tavern",
      characterIds: [],
      defaultCharacterId: null,
      activityLocationId: "tavern",
      backAction: { label: `返回${cityDefinition.name}`, targetView: "city" },
    },
  ];
}

const generatedPrototypeHouses: HouseDefinition[] =
  generatedPrototypeCities.flatMap((cityDefinition) =>
    createStandardCityHouses(
      cityDefinition,
      citySlugByCityId[cityDefinition.id] ?? cityDefinition.id.replace("city.", "")
    )
  );

export const prototypeHouses: HouseDefinition[] = [
  {
    id: "house.kulan.leader_residence",
    cityId: "city.kulan",
    name: "将领府邸",
    type: "residence",
    moduleId: "leader-residence",
    characterIds: [],
    defaultCharacterId: null,
    backAction: {
      label: "返回濠州",
      targetView: "city",
    },
  },
  {
    id: "house.kulan.temple",
    cityId: "city.kulan",
    name: "皇觉寺",
    type: "temple",
    moduleId: "temple-house",
    onEnterEventId: "event.story.zhu_yuanzhang.ordination",
    characterIds: ["char.kulan_temple_abbot", "char.kulan_temple_senior_monk"],
    defaultCharacterId: "char.kulan_temple_abbot",
    backAction: {
      label: "杩斿洖婵犲窞",
      targetView: "city",
    },
  },
  {
    id: "home_001",
    cityId: "city.kulan",
    name: "自宅",
    type: "residence",
    moduleId: "home-house",
    visibleStoryStages: [ZHU_YUANZHANG_STORY_STAGES.guoZixingCamp],
    enterableStoryStages: [ZHU_YUANZHANG_STORY_STAGES.guoZixingCamp],
    requiresPlayerCurrentCityMatch: true,
    characterIds: [],
    defaultCharacterId: null,
    backAction: {
      label: "返回濠州",
      targetView: "city",
    },
  },
  {
    id: "house.kulan.keep",
    cityId: "city.kulan",
    name: "帅府",
    type: "castle",
    moduleId: "keep-house",
    characterIds: [
      "char.kulan_lord",
      "char.kulan_xu_da",
      "char.kulan_tang_he",
      "char.kulan_chang_yuchun",
      "char.kulan_guard",
    ],
    defaultCharacterId: "char.kulan_lord",
    backAction: {
      label: "返回濠州",
      targetView: "city",
    },
  },
  {
    id: "house.kulan.tea_house",
    cityId: "city.kulan",
    name: "茶馆",
    type: "tea-house",
    characterIds: ["char.kulan_tea_boss"],
    defaultCharacterId: "char.kulan_tea_boss",
    activityLocationId: "tea-house",
    moduleId: "tea-house",
    backAction: {
      label: "返回濠州",
      targetView: "city",
    },
  },
  {
    id: "house.kulan.market",
    cityId: "city.kulan",
    name: "货栈",
    type: "merchant",
    characterIds: ["char.kulan_merchant"],
    defaultCharacterId: "char.kulan_merchant",
    activityLocationId: "market",
    moduleId: "market-house",
    backAction: {
      label: "返回濠州",
      targetView: "city",
    },
  },
  {
    id: "house.kulan.grain_shop",
    cityId: "city.kulan",
    name: "粮铺",
    type: "merchant",
    moduleId: "grain-shop",
    characterIds: ["char.kulan_grain_shopkeeper"],
    defaultCharacterId: "char.kulan_grain_shopkeeper",
    backAction: {
      label: "返回濠州",
      targetView: "city",
    },
  },
  {
    id: "house.kulan.medicine_house",
    cityId: "city.kulan",
    name: "药铺",
    type: "medicine-house",
    moduleId: "medicine-house",
    characterIds: ["char.kulan_medicine_doctor"],
    defaultCharacterId: "char.kulan_medicine_doctor",
    backAction: {
      label: "返回濠州",
      targetView: "city",
    },
  },
  {
    id: "house.kulan.inn",
    cityId: "city.kulan",
    name: "客栈",
    type: "inn",
    moduleId: "tavern",
    characterIds: ["char.kulan_innkeeper"],
    defaultCharacterId: "char.kulan_innkeeper",
    activityLocationId: "tavern",
    backAction: {
      label: "返回濠州",
      targetView: "city",
    },
  },
  ...generatedPrototypeHouses,
];

export const prototypeCityEntries: CityEntryDefinition[] = [
  {
    id: "city-entry.kulan.leader-residence",
    cityId: "city.kulan",
    name: "将领府邸",
    directoryType: "leader-residence",
    targetHouseId: "house.kulan.leader_residence",
    artworkId: "leader-residence",
  },
  ...generatedPrototypeCities.map((cityDefinition) => {
    const slug = citySlugByCityId[cityDefinition.id] ?? cityDefinition.id;
    return {
      id: `city-entry.${slug}.leader-residence`,
      cityId: cityDefinition.id,
      name: "将领府邸",
      directoryType: "leader-residence" as const,
      targetHouseId: `house.${slug}.leader_residence`,
      artworkId: "leader-residence" as const,
    };
  }),
];

export const prototypeCharacters: CharacterDefinition[] = [
  {
    id: "char.player",
    name: "朱元璋",
    birthYear: 1535,
    deathYear: null,
    age: 32,
    clanId: "clan.guo",
    title: "亲兵",
    occupation: "军中跑腿",
    cityId: "city.kulan",
    houseId: "home_001",
    portraitId: "portrait.player",
    portraitVariants: [
      {
        id: "stage-20",
        label: "通常",
        portraitId: "portrait.player.stage.20",
      },
      {
        id: "stage-25",
        label: "微笑",
        portraitId: "portrait.player.stage.25",
      },
      {
        id: "stage-26",
        label: "二十六岁",
        portraitId: "portrait.player.stage.26",
      },
      {
        id: "stage-29",
        label: "二十九岁",
        portraitId: "portrait.player.stage.29",
      },
      {
        id: "stage-34-39",
        label: "三十四至三十九岁",
        portraitId: "portrait.player.stage.34_39",
      },
      {
        id: "stage-40",
        label: "四十岁",
        portraitId: "portrait.player.stage.40",
      },
    ],
    portraitVariantId: "stage-20",
    stats: {
      leadership: 60,
      martial: 58,
      intelligence: 55,
      politics: 42,
      charm: 51,
      fame: 8,
      gold: 120,
    },
    stamina: 100,
    biography: "郭子兴帐下的新近亲兵，资历尚浅，先从跑腿与粮道杂务做起。",
    availableFunctions: [],
    skills: {
      ashigaru: 2,
      horse: 3,
      teppo: 1,
      navy: 0,
      archery: 1,
      martial: 2,
      military: 2,
      ninjutsu: 0,
      construction: 0,
      development: 1,
      mining: 0,
      arithmetic: 1,
      etiquette: 2,
      rhetoric: 1,
      tea: 1,
      medicine: 0,
    },
  },
  {
    id: "char.kulan_lord",
    name: "郭子兴",
    birthYear: 1528,
    deathYear: null,
    age: 39,
    clanId: "clan.guo",
    title: "主帅",
    occupation: "红巾军首领",
    cityId: "city.kulan",
    houseId: "house.kulan.keep",
    portraitId: "portrait.kulan_lord",
    stats: {
      leadership: 74,
      martial: 63,
      intelligence: 70,
      politics: 68,
      charm: 61,
      fame: 38,
      gold: 600,
    },
    stamina: 88,
    biography: "郭子兴坐镇濠州，掌军政、定方略，也亲自主持每一轮评定。",
    availableFunctions: [],
    skills: {
      ashigaru: 3,
      horse: 4,
      teppo: 2,
      navy: 0,
      archery: 2,
      martial: 4,
      military: 3,
      ninjutsu: 0,
      construction: 2,
      development: 2,
      mining: 0,
      arithmetic: 2,
      etiquette: 3,
      rhetoric: 2,
      tea: 2,
      medicine: 1,
    },
  },
  {
    id: "char.kulan_soldier",
    name: "小兵",
    birthYear: 1545,
    deathYear: null,
    age: 22,
    clanId: "clan.guo",
    title: "值守小兵",
    occupation: "步卒",
    cityId: "city.kulan",
    houseId: "house.kulan.keep",
    portraitId: "portrait.kulan_soldier",
    stats: {
      leadership: 24,
      martial: 35,
      intelligence: 18,
      politics: 10,
      charm: 18,
      fame: 1,
      gold: 8,
    },
    stamina: 72,
    biography: "在帅府门前值守，奉命拦阻闲杂人等。",
    availableFunctions: [],
    skills: {
      ashigaru: 2,
      horse: 0,
      teppo: 0,
      navy: 0,
      archery: 0,
      martial: 1,
      military: 0,
      ninjutsu: 0,
      construction: 0,
      development: 0,
      mining: 0,
      arithmetic: 0,
      etiquette: 0,
      rhetoric: 0,
      tea: 0,
      medicine: 0,
    },
  },
  {
    id: "char.kulan_guard",
    name: "孙德崖",
    birthYear: 1542,
    deathYear: null,
    age: 25,
    clanId: "clan.guo",
    title: "卫士",
    occupation: "步卒",
    cityId: "city.kulan",
    houseId: "house.kulan.keep",
    portraitId: "portrait.kulan_guard",
    stats: {
      leadership: 40,
      martial: 49,
      intelligence: 29,
      politics: 18,
      charm: 24,
      fame: 4,
      gold: 20,
    },
    stamina: 76,
    biography: "常在帅府值守，也负责传递军令。",
    availableFunctions: [],
    skills: {
      ashigaru: 4,
      horse: 1,
      teppo: 1,
      navy: 0,
      archery: 0,
      martial: 2,
      military: 1,
      ninjutsu: 0,
      construction: 0,
      development: 0,
      mining: 0,
      arithmetic: 0,
      etiquette: 1,
      rhetoric: 0,
      tea: 0,
      medicine: 0,
    },
  },
  {
    id: "char.kulan_xu_da",
    name: "徐达",
    birthYear: 1531,
    deathYear: null,
    age: 36,
    clanId: "clan.guo",
    title: "前锋大将",
    occupation: "武将",
    cityId: "city.kulan",
    houseId: "house.kulan.keep",
    portraitId: "portrait.kulan_xu_da",
    affiliationLabel: "濠州军中",
    stats: {
      leadership: 81,
      martial: 76,
      intelligence: 62,
      politics: 48,
      charm: 54,
      fame: 30,
      gold: 180,
    },
    stamina: 92,
    biography: "作战沉稳，军中多以徐达为前锋。",
    availableFunctions: [],
    skills: {
      ashigaru: 4,
      horse: 4,
      teppo: 1,
      navy: 0,
      archery: 2,
      martial: 4,
      military: 4,
      ninjutsu: 0,
      construction: 1,
      development: 1,
      mining: 0,
      arithmetic: 1,
      etiquette: 1,
      rhetoric: 1,
      tea: 0,
      medicine: 0,
    },
  },
  {
    id: "char.kulan_tang_he",
    name: "汤和",
    birthYear: 1530,
    deathYear: null,
    age: 37,
    clanId: "clan.guo",
    title: "宿将",
    occupation: "武将",
    cityId: "city.kulan",
    houseId: "house.kulan.keep",
    portraitId: "portrait.kulan_tang_he",
    stats: {
      leadership: 75,
      martial: 67,
      intelligence: 58,
      politics: 44,
      charm: 52,
      fame: 26,
      gold: 150,
    },
    stamina: 86,
    biography: "资历深，善于整顿营伍与催督军粮。",
    availableFunctions: [],
    skills: {
      ashigaru: 4,
      horse: 3,
      teppo: 1,
      navy: 0,
      archery: 1,
      martial: 3,
      military: 4,
      ninjutsu: 0,
      construction: 1,
      development: 1,
      mining: 0,
      arithmetic: 1,
      etiquette: 1,
      rhetoric: 1,
      tea: 0,
      medicine: 0,
    },
  },
  {
    id: "char.kulan_chang_yuchun",
    name: "常遇春",
    birthYear: 1534,
    deathYear: null,
    age: 33,
    clanId: "clan.guo",
    title: "骁将",
    occupation: "武将",
    cityId: "city.kulan",
    houseId: "house.kulan.keep",
    portraitId: "portrait.kulan_chang_yuchun",
    stats: {
      leadership: 73,
      martial: 79,
      intelligence: 46,
      politics: 28,
      charm: 47,
      fame: 22,
      gold: 90,
    },
    stamina: 94,
    biography: "性急勇悍，最擅长冲阵夺旗。",
    availableFunctions: [],
    skills: {
      ashigaru: 4,
      horse: 4,
      teppo: 0,
      navy: 0,
      archery: 1,
      martial: 4,
      military: 3,
      ninjutsu: 0,
      construction: 0,
      development: 0,
      mining: 0,
      arithmetic: 0,
      etiquette: 0,
      rhetoric: 0,
      tea: 0,
      medicine: 0,
    },
  },
  {
    id: "char.kulan_liu_bowen",
    name: "刘伯温",
    birthYear: 1536,
    deathYear: null,
    age: 31,
    clanId: "clan.guo",
    title: "乡贤",
    occupation: "谋士",
    affiliationLabel: "濠州士人",
    cityId: "city.kulan",
    houseId: "house.kulan.leader_residence",
    portraitId: "portrait.kulan_liu_bowen",
    stats: {
      leadership: 52,
      martial: 20,
      intelligence: 86,
      politics: 81,
      charm: 72,
      fame: 28,
      gold: 90,
    },
    stamina: 74,
    biography: "通经史、善权谋，在濠州颇有声望，常为群雄筹画进退。",
    isHistoricalFigure: true,
    leaderResidenceEligible: true,
    leaderResidenceStatus: "available",
    availableFunctions: [],
    skills: {
      ashigaru: 0,
      horse: 0,
      teppo: 0,
      navy: 0,
      archery: 0,
      martial: 1,
      military: 4,
      ninjutsu: 0,
      construction: 2,
      development: 3,
      mining: 0,
      arithmetic: 3,
      etiquette: 3,
      rhetoric: 4,
      tea: 2,
      medicine: 1,
    },
    teachableSkillKeys: ["military", "arithmetic", "rhetoric", "etiquette"],
  },
  {
    id: "char.kulan_li_shanchang",
    name: "李善长",
    birthYear: 1526,
    deathYear: null,
    age: 41,
    clanId: "clan.guo",
    title: "乡贤",
    occupation: "幕僚",
    affiliationLabel: "濠州士人",
    cityId: "city.kulan",
    houseId: "house.kulan.leader_residence",
    portraitId: "portrait.kulan_li_shanchang",
    stats: {
      leadership: 48,
      martial: 18,
      intelligence: 82,
      politics: 84,
      charm: 69,
      fame: 25,
      gold: 110,
    },
    stamina: 70,
    biography: "精于文案与政务，善衡轻重，是城中名望颇高的乡贤人物。",
    isHistoricalFigure: true,
    leaderResidenceEligible: true,
    leaderResidenceStatus: "available",
    availableFunctions: [],
    skills: {
      ashigaru: 0,
      horse: 0,
      teppo: 0,
      navy: 0,
      archery: 0,
      martial: 0,
      military: 3,
      ninjutsu: 0,
      construction: 1,
      development: 4,
      mining: 0,
      arithmetic: 3,
      etiquette: 4,
      rhetoric: 3,
      tea: 2,
      medicine: 0,
    },
    teachableSkillKeys: ["development", "etiquette", "arithmetic"],
  },
  {
    id: "char.kulan_temple_abbot",
    name: "慧明住持",
    birthYear: 1510,
    deathYear: null,
    age: 57,
    title: "住持",
    occupation: "寺院主持",
    cityId: "city.kulan",
    houseId: "house.kulan.temple",
    portraitId: "portrait.kulan_temple_abbot",
    stats: {
      leadership: 36,
      martial: 18,
      intelligence: 77,
      politics: 52,
      charm: 76,
      fame: 20,
      gold: 160,
    },
    stamina: 72,
    biography: "皇觉寺住持，管着寺中香火、施粥与僧众起居，也时常提点乱世里的人该如何安身。",
    availableFunctions: [],
    skills: {
      ashigaru: 0,
      horse: 0,
      teppo: 0,
      navy: 0,
      archery: 0,
      martial: 1,
      military: 1,
      ninjutsu: 0,
      construction: 0,
      development: 2,
      mining: 0,
      arithmetic: 2,
      etiquette: 4,
      rhetoric: 3,
      tea: 2,
      medicine: 2,
    },
  },
  {
    id: "char.kulan_temple_senior_monk",
    name: "觉远",
    birthYear: 1527,
    deathYear: null,
    age: 40,
    title: "知客僧",
    occupation: "寺中执事",
    cityId: "city.kulan",
    houseId: "house.kulan.temple",
    portraitId: "portrait.kulan_temple_senior_monk",
    stats: {
      leadership: 24,
      martial: 22,
      intelligence: 58,
      politics: 38,
      charm: 49,
      fame: 7,
      gold: 28,
    },
    stamina: 74,
    biography: "寺里跑前跑后的知客僧，熟悉香客、流民和僧众杂务，常替住持传话。",
    availableFunctions: [],
    skills: {
      ashigaru: 0,
      horse: 0,
      teppo: 0,
      navy: 0,
      archery: 0,
      martial: 1,
      military: 0,
      ninjutsu: 0,
      construction: 0,
      development: 1,
      mining: 0,
      arithmetic: 1,
      etiquette: 2,
      rhetoric: 1,
      tea: 1,
      medicine: 1,
    },
  },
  {
    id: "char.kulan_tea_boss",
    name: "柳四",
    birthYear: 1534,
    deathYear: null,
    age: 33,
    title: "茶馆老板",
    occupation: "茶馆老板",
    cityId: "city.kulan",
    houseId: "house.kulan.tea_house",
    portraitId: "portrait.kulan_tea_boss",
    stats: {
      leadership: 28,
      martial: 19,
      intelligence: 63,
      politics: 54,
      charm: 71,
      fame: 14,
      gold: 180,
    },
    stamina: 78,
    biography: "柳四经营着濠州的茶馆，擅长把零散传闻拼成线索。",
    availableFunctions: [],
    skills: {
      ashigaru: 0,
      horse: 0,
      teppo: 0,
      navy: 0,
      archery: 0,
      martial: 0,
      military: 0,
      ninjutsu: 0,
      construction: 0,
      development: 1,
      mining: 0,
      arithmetic: 2,
      etiquette: 3,
      rhetoric: 4,
      tea: 3,
      medicine: 0,
    },
  },
  {
    id: "char.kulan_grain_shopkeeper",
    name: "陈掌柜",
    birthYear: 1531,
    deathYear: null,
    age: 36,
    title: "掌柜",
    occupation: "商人",
    cityId: "city.kulan",
    houseId: "house.kulan.grain_shop",
    portraitId: "portrait.kulan_grain_shopkeeper",
    stats: {
      leadership: 30,
      martial: 18,
      intelligence: 68,
      politics: 62,
      charm: 55,
      fame: 10,
      gold: 500,
    },
    stamina: 70,
    biography: "陈记粮铺掌柜，熟悉南北粮路与市价起伏。",
    availableFunctions: [],
    skills: {
      ashigaru: 0,
      horse: 0,
      teppo: 0,
      navy: 0,
      archery: 0,
      martial: 0,
      military: 0,
      ninjutsu: 0,
      construction: 0,
      development: 2,
      mining: 0,
      arithmetic: 4,
      etiquette: 2,
      rhetoric: 2,
      tea: 1,
      medicine: 0,
    },
  },
  {
    id: "char.kulan_medicine_doctor",
    name: "陈郎中",
    birthYear: 1533,
    deathYear: null,
    age: 34,
    title: "坐堂医师",
    occupation: "医师",
    cityId: "city.kulan",
    houseId: "house.kulan.medicine_house",
    portraitId: "portrait.kulan_medicine_doctor",
    stats: {
      leadership: 24,
      martial: 12,
      intelligence: 74,
      politics: 48,
      charm: 52,
      fame: 8,
      gold: 320,
    },
    stamina: 68,
    biography: "陈记药铺坐堂医师，擅辨寒热虚实，配药谨慎。",
    availableFunctions: [],
    skills: {
      ashigaru: 0,
      horse: 0,
      teppo: 0,
      navy: 0,
      archery: 0,
      martial: 0,
      military: 0,
      ninjutsu: 0,
      construction: 0,
      development: 1,
      mining: 0,
      arithmetic: 2,
      etiquette: 3,
      rhetoric: 1,
      tea: 1,
      medicine: 5,
    },
  },
  {
    id: "char.kulan_merchant",
    name: "钱掌柜",
    birthYear: 1530,
    deathYear: null,
    age: 37,
    title: "货栈老板",
    occupation: "商人",
    cityId: "city.kulan",
    houseId: "house.kulan.market",
    portraitId: "portrait.kulan_merchant",
    stats: {
      leadership: 32,
      martial: 21,
      intelligence: 71,
      politics: 66,
      charm: 58,
      fame: 12,
      gold: 900,
    },
    stamina: 72,
    biography: "濠州货栈的掌柜，最擅长盘算商路差价与各城货价起落。",
    availableFunctions: [],
    skills: {
      ashigaru: 1,
      horse: 1,
      teppo: 0,
      navy: 0,
      archery: 0,
      martial: 0,
      military: 1,
      ninjutsu: 0,
      construction: 0,
      development: 3,
      mining: 0,
      arithmetic: 4,
      etiquette: 2,
      rhetoric: 3,
      tea: 2,
      medicine: 0,
    },
  },
  {
    id: "char.kulan_innkeeper",
    name: "客栈老板娘",
    birthYear: 1533,
    deathYear: null,
    age: 34,
    title: "掌柜",
    occupation: "旅宿主人",
    cityId: "city.kulan",
    houseId: "house.kulan.inn",
    portraitId: "portrait.kulan_innkeeper",
    stats: {
      leadership: 28,
      martial: 19,
      intelligence: 62,
      politics: 57,
      charm: 74,
      fame: 16,
      gold: 260,
    },
    stamina: 80,
    biography: "熟悉来往旅客与城内传闻的客栈掌柜。",
    availableFunctions: [],
    skills: {
      ashigaru: 0,
      horse: 0,
      teppo: 0,
      navy: 0,
      archery: 0,
      martial: 0,
      military: 0,
      ninjutsu: 0,
      construction: 0,
      development: 1,
      mining: 0,
      arithmetic: 2,
      etiquette: 3,
      rhetoric: 3,
      tea: 2,
      medicine: 1,
    },
  },
];

const historicalCharacterIdsAlreadyRepresented = new Set([
  "zyz.character.zhu_yuanzhang",
  "zyz.character.guo_zixing",
  "zyz.character.tang_he",
  "zyz.character.xu_da",
  "zyz.character.chang_yuchun",
  "zyz.character.li_shanchang",
  "zyz.character.liu_ji",
]);

const historicalCharacterById = Object.fromEntries(
  zhuYuanzhangEarlyCharacters.map((characterRecord) => [
    characterRecord.id,
    characterRecord,
  ])
);

function getRuntimeCharacterId(historicalCharacterId: string): string {
  return `char.${historicalCharacterId.replace(/^zyz\.character\./, "yuanmo.")}`;
}

function getHistoricalRecordCityId(
  characterRecord: (typeof zhuYuanzhangEarlyCharacters)[number]
): string | null {
  const cityNodeId =
    characterRecord.currentCityNodeId ??
    characterRecord.homeCityNodeId ??
    characterRecord.relatedCityNodeIds[0] ??
    null;

  if (cityNodeId == null) {
    return null;
  }

  return playableCityByMapNodeId[cityNodeId]?.id ?? null;
}

function getHistoricalRecordHouseId(
  characterRecord: (typeof zhuYuanzhangEarlyCharacters)[number],
  cityId: string
): string {
  const slug = citySlugByCityId[cityId] ?? cityId.replace("city.", "");
  const leaderResidenceProfile = characterRecord.leaderResidenceProfile;

  if (leaderResidenceProfile?.eligible === true) {
    return `house.${slug}.leader_residence`;
  }

  if (characterRecord.roleTags.includes("merchant")) {
    return `house.${slug}.market`;
  }

  if (characterRecord.roleTags.includes("monk")) {
    return `house.${slug}.temple`;
  }

  if (
    characterRecord.roleTags.includes("rumor-source") ||
    characterRecord.roleTags.includes("commoner")
  ) {
    return `house.${slug}.tea_house`;
  }

  return `house.${slug}.inn`;
}

function getHistoricalRecordStats(
  characterRecord: (typeof zhuYuanzhangEarlyCharacters)[number]
): CharacterDefinition["stats"] {
  const priorityBonus = characterRecord.priority === "P0" ? 18 : characterRecord.priority === "P1" ? 10 : 4;
  const isMilitary =
    characterRecord.roleTags.includes("general") ||
    characterRecord.roleTags.includes("commander");
  const isCivil =
    characterRecord.roleTags.includes("advisor") ||
    characterRecord.roleTags.includes("civil-official") ||
    characterRecord.roleTags.includes("local-elite");
  const isMerchant = characterRecord.roleTags.includes("merchant");

  return {
    leadership: 38 + priorityBonus + (isMilitary ? 18 : 0) + (isCivil ? 6 : 0),
    martial: 28 + priorityBonus + (isMilitary ? 22 : 0),
    intelligence: 40 + priorityBonus + (isCivil ? 22 : 0) + (isMerchant ? 8 : 0),
    politics: 34 + priorityBonus + (isCivil ? 24 : 0) + (isMerchant ? 10 : 0),
    charm: 38 + priorityBonus + (characterRecord.roleTags.includes("family") ? 12 : 0),
    fame: 8 + priorityBonus * 2,
    gold: 80 + priorityBonus * 18 + (isMerchant ? 180 : 0),
  };
}

function getHistoricalRecordSkills(
  characterRecord: (typeof zhuYuanzhangEarlyCharacters)[number]
): NonNullable<CharacterDefinition["skills"]> {
  const isMilitary =
    characterRecord.roleTags.includes("general") ||
    characterRecord.roleTags.includes("commander");
  const isCivil =
    characterRecord.roleTags.includes("advisor") ||
    characterRecord.roleTags.includes("civil-official") ||
    characterRecord.roleTags.includes("local-elite");
  const isMerchant = characterRecord.roleTags.includes("merchant");
  const isMonk = characterRecord.roleTags.includes("monk");

  return {
    ashigaru: isMilitary ? 3 : 0,
    horse: isMilitary ? 2 : 0,
    teppo: 0,
    navy: characterRecord.stageTags.includes("jiqing-campaign") ? 1 : 0,
    archery: isMilitary ? 1 : 0,
    martial: isMilitary ? 3 : isMonk ? 1 : 0,
    military: isMilitary ? 3 : isCivil ? 2 : 0,
    ninjutsu: 0,
    construction: isCivil ? 2 : 0,
    development: isCivil ? 3 : isMerchant ? 2 : 0,
    mining: 0,
    arithmetic: isCivil || isMerchant ? 3 : 1,
    etiquette: isCivil ? 3 : 1,
    rhetoric: isCivil ? 3 : characterRecord.roleTags.includes("rumor-source") ? 2 : 0,
    tea: isCivil || isMerchant ? 1 : 0,
    medicine: isMonk ? 1 : 0,
  };
}

const generatedHistoricalCharacters: CharacterDefinition[] =
  zhuYuanzhangEarlyCharacters
    .filter(
      (characterRecord) =>
        !historicalCharacterIdsAlreadyRepresented.has(characterRecord.id)
    )
    .map((characterRecord): CharacterDefinition | null => {
      const cityId = getHistoricalRecordCityId(characterRecord);
      if (cityId == null) {
        return null;
      }

      const leaderResidenceProfile = characterRecord.leaderResidenceProfile;
      const birthYear = characterRecord.birthYear ?? 1330;

      return {
        id: getRuntimeCharacterId(characterRecord.id),
        name: characterRecord.displayName,
        birthYear,
        deathYear: characterRecord.deathYear,
        age: Math.max(16, 1352 - birthYear),
        clanId: characterRecord.factionId,
        title:
          leaderResidenceProfile?.title ??
          characterRecord.cityNpcProfile?.title ??
          characterRecord.factionName,
        occupation:
          leaderResidenceProfile?.occupation ??
          characterRecord.cityNpcProfile?.specialty ??
          "历史人物",
        affiliationLabel:
          leaderResidenceProfile?.affiliationLabel ?? characterRecord.factionName,
        cityId,
        houseId: getHistoricalRecordHouseId(characterRecord, cityId),
        portraitId: `portrait.${getRuntimeCharacterId(characterRecord.id).replace("char.", "")}`,
        stats: getHistoricalRecordStats(characterRecord),
        stamina: 70 + (characterRecord.priority === "P0" ? 18 : characterRecord.priority === "P1" ? 10 : 4),
        biography: `${characterRecord.shortBio} ${characterRecord.gameplayUse}`.trim(),
        flags: [
          `historical-priority.${characterRecord.priority}`,
          `faction.${characterRecord.factionId}`,
        ],
        isHistoricalFigure: true,
        leaderResidenceEligible: leaderResidenceProfile?.eligible === true,
        leaderResidenceStatus: leaderResidenceProfile?.status ?? "available",
        availableFunctions: [],
        skills: getHistoricalRecordSkills(characterRecord),
        teachableSkillKeys: leaderResidenceProfile?.teachableSkillKeys ?? [],
      };
    })
    .filter(
      (characterDefinition): characterDefinition is CharacterDefinition =>
        characterDefinition != null
    );

prototypeCharacters.push(...generatedHistoricalCharacters);

const leaderResidenceCharacterOverrides: Record<
  string,
  Partial<CharacterDefinition>
> = {
  "char.kulan_xu_da": {
    name: "徐达",
    title: "前锋大将",
    occupation: "武将",
    affiliationLabel: "濠州军中",
    biography: "作战沉稳，军中多以徐达为前锋，善于统兵推进。",
    isHistoricalFigure: true,
    leaderResidenceEligible: true,
    leaderResidenceStatus: "available",
    teachableSkillKeys: ["military", "horse", "martial"],
  },
  "char.kulan_tang_he": {
    name: "汤和",
    title: "宿将",
    occupation: "武将",
    affiliationLabel: "濠州军中",
    biography: "资历深厚，善于整顿营伍与督军，是军中老成持重之将。",
    isHistoricalFigure: true,
    leaderResidenceEligible: true,
    leaderResidenceStatus: "available",
    teachableSkillKeys: ["military", "construction", "etiquette"],
  },
  "char.kulan_chang_yuchun": {
    name: "常遇春",
    title: "骁将",
    occupation: "武将",
    affiliationLabel: "濠州军中",
    biography: "性急勇悍，最擅长冲阵夺旗，是军中锋锐人物。",
    isHistoricalFigure: true,
    leaderResidenceEligible: true,
    leaderResidenceStatus: "available",
    teachableSkillKeys: ["martial", "horse", "ashigaru"],
  },
  "char.kulan_liu_bowen": {
    name: "刘伯温",
    title: "乡贤",
    occupation: "谋士",
    affiliationLabel: "濠州士人",
    biography: "通经史、善权谋，在濠州颇有声望，常为群雄筹画进退。",
  },
  "char.kulan_li_shanchang": {
    name: "李善长",
    title: "乡贤",
    occupation: "幕僚",
    affiliationLabel: "濠州士人",
    biography: "精于文案与政务，善权轻重，是城中名望颇高的乡贤人物。",
  },
};

for (const characterDefinition of prototypeCharacters) {
  const override = leaderResidenceCharacterOverrides[characterDefinition.id];
  if (override != null) {
    Object.assign(characterDefinition, override);
  }
}

function cloneCharacterDefinition(
  characterDefinition: CharacterDefinition
): CharacterDefinition {
  return {
    ...characterDefinition,
    stats: { ...characterDefinition.stats },
    availableFunctions: [...characterDefinition.availableFunctions],
    ...(characterDefinition.portraitVariants == null
      ? {}
      : {
          portraitVariants: characterDefinition.portraitVariants.map((variant) => ({
            ...variant,
          })),
        }),
    ...(characterDefinition.flags == null
      ? {}
      : { flags: [...characterDefinition.flags] }),
    ...(characterDefinition.skills == null
      ? {}
      : { skills: { ...characterDefinition.skills } }),
    ...(characterDefinition.teachableSkillKeys == null
      ? {}
      : { teachableSkillKeys: [...characterDefinition.teachableSkillKeys] }),
  };
}

export function createPrototypeCharactersForStoryStage(
  storyStage: ZhuYuanzhangStoryStage
): CharacterDefinition[] {
  const characterDefinitions = prototypeCharacters.map(cloneCharacterDefinition);
  const playerCharacter = characterDefinitions.find(
    (characterDefinition) => characterDefinition.id === "char.player"
  );

  if (
    playerCharacter != null &&
    storyStage === ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
  ) {
    delete playerCharacter.clanId;
    delete playerCharacter.affiliationLabel;
  }

  return characterDefinitions;
}

const characterDefinitionsByHouseId = new Map<string, CharacterDefinition[]>();
for (const characterDefinition of prototypeCharacters) {
  if (characterDefinition.houseId == null) {
    continue;
  }

  const existingCharacters =
    characterDefinitionsByHouseId.get(characterDefinition.houseId) ?? [];
  existingCharacters.push(characterDefinition);
  characterDefinitionsByHouseId.set(characterDefinition.houseId, existingCharacters);
}

for (const houseDefinition of prototypeHouses) {
  const houseCharacters =
    characterDefinitionsByHouseId.get(houseDefinition.id) ?? [];
  if (houseCharacters.length === 0) {
    continue;
  }

  houseDefinition.characterIds = [
    ...new Set([
      ...houseDefinition.characterIds,
      ...houseCharacters.map((characterDefinition) => characterDefinition.id),
    ]),
  ];

  if (houseDefinition.defaultCharacterId == null) {
    houseDefinition.defaultCharacterId = houseCharacters[0]?.id ?? null;
  }
}

export const prototypeHistoricalCharacterIdByCharacterId: Record<string, string> = {
  "char.kulan_lord": "zyz.character.guo_zixing",
  "char.kulan_tang_he": "zyz.character.tang_he",
  "char.kulan_xu_da": "zyz.character.xu_da",
  "char.kulan_chang_yuchun": "zyz.character.chang_yuchun",
  "char.kulan_li_shanchang": "zyz.character.li_shanchang",
  "char.kulan_liu_bowen": "zyz.character.liu_ji",
  ...Object.fromEntries(
    generatedHistoricalCharacters.map((characterDefinition) => [
      characterDefinition.id,
      characterDefinition.id.replace(/^char\.yuanmo\./, "zyz.character."),
    ])
  ),
};

export const prototypeLeaderResidenceHistoricalCharacters =
  zhuYuanzhangEarlyCharacters;

const generatedCityNpcPools: CityNpcPoolDefinition[] = prototypeCities
  .filter((cityDefinition) => cityDefinition.id !== "city.kulan")
  .map((cityDefinition) => {
    const slug = citySlugByCityId[cityDefinition.id] ?? cityDefinition.id;
    const cityCharacters = prototypeCharacters
      .filter(
        (characterDefinition) =>
          characterDefinition.cityId === cityDefinition.id &&
          characterDefinition.isHistoricalFigure === true
      )
      .slice(0, 12);

    return {
      cityId: cityDefinition.id,
      residents: cityCharacters.map((characterDefinition, index) => {
        const historicalCharacterId =
          prototypeHistoricalCharacterIdByCharacterId[characterDefinition.id];
        const historicalCharacter =
          historicalCharacterId == null
            ? null
            : historicalCharacterById[historicalCharacterId] ?? null;
        const cityNpcProfile = historicalCharacter?.cityNpcProfile;

        return {
          id: `city-npc.${slug}.${characterDefinition.id.replace(/^char\./, "").replaceAll(".", "_")}`,
          cityId: cityDefinition.id,
          name: characterDefinition.name,
          title: cityNpcProfile?.title ?? characterDefinition.title ?? "城中人物",
          personality: cityNpcProfile?.personality ?? (index % 2 === 0 ? "谨慎" : "观望"),
          specialty: cityNpcProfile?.specialty ?? characterDefinition.occupation ?? "见闻",
          favorability: cityNpcProfile?.favorability ?? 0,
          activityWeight: cityNpcProfile?.activityWeight ?? {
            "tea-house": 30,
            tavern: 20,
            market: 20,
            street: 30,
          },
          dialoguePool: cityNpcProfile?.dialoguePool ?? [
            `${cityDefinition.name}近日军情和商路都不太安稳。`,
            "天下纷乱，能守住一城已是不易。",
          ],
          intelPool: cityNpcProfile?.intelPool ?? [
            `${cityDefinition.name}的府邸、茶馆和市井都能打听到人物线索。`,
          ],
        };
      }),
    };
  });

export const prototypeCityNpcPools: CityNpcPoolDefinition[] = [
  {
    cityId: "city.kulan",
    residents: [
      {
        id: "city-npc.kulan.merchant_zhou",
        cityId: "city.kulan",
        name: "周掌柜",
        title: "盐商",
        personality: "精明",
        specialty: "交易",
        favorability: 0,
        activityWeight: {
          "tea-house": 20,
          tavern: 10,
          market: 60,
          street: 10,
        },
        dialoguePool: [
          "最近城里不太安稳。",
          "如今这世道，银子不好挣。",
          "盐路一断，市价三日就要翻。",
        ],
        intelPool: ["北边商路这几日有运盐队入城。"],
      },
      {
        id: "city-npc.kulan.scholar_he",
        cityId: "city.kulan",
        name: "何秀才",
        title: "落榜书生",
        personality: "傲气",
        specialty: "辩论",
        favorability: 0,
        activityWeight: {
          "tea-house": 50,
          tavern: 10,
          market: 10,
          street: 30,
        },
        dialoguePool: [
          "听说北边又在征兵。",
          "官府最近查得严。",
          "世人只问功名，不问文章。",
        ],
        intelPool: ["帅府近日似乎在招募能写文书的人。"],
      },
      {
        id: "city-npc.kulan.wanderer_wu",
        cityId: "city.kulan",
        name: "老吴",
        title: "货郎",
        personality: "豪爽",
        specialty: "见闻",
        favorability: 0,
        activityWeight: {
          "tea-house": 25,
          tavern: 25,
          market: 30,
          street: 20,
        },
        dialoguePool: [
          "如今这世道，银子不好挣。",
          "走南闯北的人，最重要的是眼睛和耳朵。",
        ],
        intelPool: ["集市上有人在悄悄收购铁料。"],
      },
      {
        id: "city-npc.kulan.guard_lin",
        cityId: "city.kulan",
        name: "林镖头",
        title: "镖师",
        personality: "警惕",
        specialty: "江湖",
        favorability: 0,
        activityWeight: {
          "tea-house": 15,
          tavern: 35,
          market: 20,
          street: 30,
        },
        dialoguePool: [
          "最近城里不太安稳。",
          "喝酒可以，别在我背后站太久。",
        ],
        intelPool: ["最近有人在打听出城商队的时辰。"],
      },
    ],
  },
  ...generatedCityNpcPools,
];

export const prototypeCityPortraits: Record<string, string> = {
  "city.kulan": "濠州",
};

export const prototypeCards: CardDefinition[] = [
  {
    id: "card.one_strike",
    name: "一齐攻击",
    category: "battle",
    skillDescription: "让部队集中攻击目标。",
    battlefieldDisplay: "战场全体突击",
    ammoCostText: "使用兵粮：没有限制",
    cardImageId: "card-image.one_strike",
    logicNotes: "用于强制推进战斗回合的核心合战卡。",
  },
  {
    id: "card.secret_step",
    name: "强袭",
    category: "secret-technique",
    skillDescription: "以快速行动突破防线。",
    battlefieldDisplay: "战场快速突入",
    ammoCostText: "使用兵粮：没有限制",
    cardImageId: "card-image.secret_step",
    logicNotes: "可作为忍术或特殊战术动作的基础。",
  },
  {
    id: "card.fire_attack",
    name: "火攻",
    category: "battle",
    skillDescription: "借火势破坏敌阵。",
    battlefieldDisplay: "战场火攻范围",
    ammoCostText: "使用兵粮：需要火具或火计资源",
    cardImageId: "card-image.fire_attack",
    logicNotes: "后续可绑定天气、地形和火攻成功率。",
  },
];

export const prototypeValuables: ValuableItemDefinition[] = [
  {
    id: "item.sword.ogasa",
    name: "胁差",
    category: "weapon",
    price: 1,
    ownedCount: 1,
    kindText: "刀剑",
    itemImageId: "item-image.sword.ogasa",
    description: "无名匠所制的腰刀。",
  },
  {
    id: "item.armor.tetsu",
    name: "铁札足",
    category: "armor",
    price: 1,
    ownedCount: 1,
    kindText: "铠甲",
    itemImageId: "item-image.armor.tetsu",
    description: "基础护具，适合近身防护。",
  },
];
