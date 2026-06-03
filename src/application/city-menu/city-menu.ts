import type { CharacterDefinition } from "../../domain/character";
import type { CityDefinition } from "../../domain/city";
import type { CityEntryDefinition } from "../../domain/city-entry";
import type { CityNpcPoolDefinition } from "../../domain/city-npc";
import type { HouseDefinition } from "../../domain/house";

export type CityMenuPanelId =
  | "culture"
  | "intel"
  | "locations"
  | "management"
  | "begging";

export type CityMenuState = {
  panelId: CityMenuPanelId;
  intelItems: string[];
};

export type CityCultureViewModel = {
  cityName: string;
  description: string;
  economyLevel: "富饶" | "繁荣" | "普通" | "萧条" | "民不聊生";
  economyValue: number;
  population: number | null;
  security: number | null;
};

export type CityManagementViewModel = {
  canManageTown: boolean;
  townLevel: number | null;
  buildingList: string[];
  taxRate: number | null;
};

const CITY_DESCRIPTION_BY_ID: Record<string, string> = {
  "city.kulan":
    "濠州地处江淮之间，商旅往来频繁，寺院、街市与军府交错成局。乱世之中，此地既是流民暂栖之所，也是豪杰与商贾汇聚之处，城中见闻往往比城门更早传开。",
};

const HOUSE_INTEL_BY_MODULE_ID: Partial<Record<string, string>> = {
  "leader-residence": "府邸之中似乎正在筛选可用之人。",
  "temple-house": "寺院近日香火未断，僧众似乎仍在筹措米粮。",
  "home-house": "自宅一带近来少见外人走动，倒适合静心歇脚。",
  "keep-house": "帅府似乎正在整理军务，或许正缺能办事的人。",
  "tea-house": "茶馆里似乎有人正在议论时局。",
  "market-house": "城中商铺正在张罗一批新货。",
  "grain-shop": "粮铺掌柜最近正盯着米价起落。",
  "medicine-house": "药铺郎中正在留心懂药理的帮手。",
  tavern: "酒肆中似乎有人正在进行舌战。",
};

function hashString(value: string): number {
  let hash = 0;

  for (const character of value) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }

  return hash;
}

function pickRotatedItems<T>(
  items: readonly T[],
  count: number,
  offset: number
): T[] {
  if (items.length === 0 || count <= 0) {
    return [];
  }

  const uniqueCount = Math.min(count, items.length);
  const startIndex = ((offset % items.length) + items.length) % items.length;

  return Array.from({ length: uniqueCount }, (_, index) => {
    const resolvedIndex = (startIndex + index) % items.length;
    return items[resolvedIndex] as T;
  });
}

function buildDefaultCityDescription(cityDefinition: CityDefinition): string {
  const regionText = cityDefinition.tags.includes("jiangnan")
    ? "江南水陆交汇"
    : cityDefinition.tags.includes("jianghuai")
      ? "江淮要冲"
      : cityDefinition.tags.includes("river-port")
        ? "江港水埠"
        : cityDefinition.tags.includes("coastal")
          ? "沿海商埠"
          : "兵商往来的城池";
  const tradeText = cityDefinition.tags.includes("commercial")
    ? "商旅来往密集"
    : cityDefinition.tags.includes("market")
      ? "市井交易颇为活跃"
      : "市井买卖维持着城中生计";
  const securityText =
    cityDefinition.danger >= 50
      ? "只是世道未宁，街头巷尾始终带着几分戒备。"
      : "城中秩序尚可，百姓也还留着些许安稳气。";

  return `${cityDefinition.name}位于${regionText}之地，${tradeText}。此地风土杂糅，行旅、军士与本地居民各有来路，${securityText}`;
}

export function isPlayerMonkIdentity(playerCharacter: CharacterDefinition): boolean {
  const identityText = [
    playerCharacter.title ?? "",
    playerCharacter.occupation ?? "",
  ]
    .join(" ")
    .toLowerCase();

  return (
    identityText.includes("僧") ||
    identityText.includes("和尚") ||
    identityText.includes("monk")
  );
}

export function getCityEconomyLevel(
  prosperity: number
): CityCultureViewModel["economyLevel"] {
  if (prosperity >= 90) {
    return "富饶";
  }

  if (prosperity >= 80) {
    return "繁荣";
  }

  if (prosperity >= 60) {
    return "普通";
  }

  if (prosperity >= 40) {
    return "萧条";
  }

  return "民不聊生";
}

export function createCityCultureViewModel(
  cityDefinition: CityDefinition
): CityCultureViewModel {
  return {
    cityName: cityDefinition.name,
    description:
      CITY_DESCRIPTION_BY_ID[cityDefinition.id] ??
      buildDefaultCityDescription(cityDefinition),
    economyLevel: getCityEconomyLevel(cityDefinition.prosperity),
    economyValue: cityDefinition.prosperity,
    population: null,
    security: null,
  };
}

function createMockEventIntel(cityDefinition: CityDefinition): string[] {
  const items = [
    cityDefinition.prosperity >= 80
      ? `城中商队近日活络，${cityDefinition.name}的买卖声势似乎比往常更盛。`
      : `${cityDefinition.name}的街市近来显得谨慎，买卖双方都在观望风向。`,
    cityDefinition.danger >= 45
      ? "近来有陌生武人在城中走动，几处热闹地带都在议论他们的来历。"
      : "城中近来未见大乱，几处热闹地带反而更适合打听消息。",
    `听说${cityDefinition.name}近日又起了新的传闻，若去人多之处，也许能摸到线头。`,
  ];

  return items;
}

export function createCityIntelItems(input: {
  cityDefinition: CityDefinition;
  houseDefinitions: HouseDefinition[];
  cityEntries: CityEntryDefinition[];
  cityNpcPoolDefinition: CityNpcPoolDefinition | null;
  calendar: {
    year: number;
    month: number;
    day: number;
  };
}): string[] {
  const houseIntel = input.houseDefinitions
    .map((houseDefinition) =>
      houseDefinition.moduleId == null
        ? null
        : HOUSE_INTEL_BY_MODULE_ID[houseDefinition.moduleId] ?? null
    )
    .filter((text): text is string => text != null);
  const entryIntel = input.cityEntries.map(
    (cityEntry) => `${cityEntry.name}一带似乎有人在等合适的来客。`
  );
  const npcIntel =
    input.cityNpcPoolDefinition?.residents.flatMap((residentDefinition) =>
      residentDefinition.intelPool.slice(0, 1)
    ) ?? [];
  const mockEventIntel = createMockEventIntel(input.cityDefinition);
  const uniqueItems = Array.from(
    new Set([...houseIntel, ...entryIntel, ...npcIntel, ...mockEventIntel])
  );
  const rotationOffset =
    input.calendar.year * 372 +
    input.calendar.month * 31 +
    input.calendar.day +
    hashString(input.cityDefinition.id);

  return pickRotatedItems(uniqueItems, 4, rotationOffset);
}

export function createCityManagementViewModel(): CityManagementViewModel {
  return {
    canManageTown: false,
    townLevel: null,
    buildingList: [],
    taxRate: null,
  };
}

export function createCityMenuState(input: {
  panelId: CityMenuPanelId;
  cityDefinition: CityDefinition;
  houseDefinitions: HouseDefinition[];
  cityEntries: CityEntryDefinition[];
  cityNpcPoolDefinition: CityNpcPoolDefinition | null;
  calendar: {
    year: number;
    month: number;
    day: number;
  };
}): CityMenuState {
  return {
    panelId: input.panelId,
    intelItems:
      input.panelId === "intel"
        ? createCityIntelItems(input)
        : [],
  };
}
