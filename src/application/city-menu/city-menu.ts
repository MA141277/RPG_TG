import type { CharacterDefinition } from "../../domain/character";
import type { CityDefinition } from "../../domain/city";
import type { CityEntryDefinition } from "../../domain/city-entry";
import type { CityNpcPoolDefinition } from "../../domain/city-npc";
import type { HouseDefinition } from "../../domain/house";
import type { PlayableIntegrationDefinition } from "../../core/contracts/playable-runtime";
import type {
  MenuInstanceDefinition,
  MenuResourceDefinition,
  MenuTargetFamily,
} from "../../domain/menu";
import { readStringPersonAttributeBySemanticKey } from "../character/person-attribute-runtime";

export type CityMenuPanelId =
  | "overview"
  | "intel"
  | "locations"
  | "management";

export type CityMenuEntryAction =
  | {
      type: "panel";
      panelId: CityMenuPanelId;
    }
  | {
      type: "dialogue";
      dialogueId: string;
    }
  | {
      type: "minigame";
      minigameId: string;
      integrationId?: string | undefined;
    }
  | {
      type: "unsupported";
      targetFamily: MenuTargetFamily;
      targetId: string;
    };

export type CityMenuEntryViewModel = {
  id: string;
  label: string;
  menuFamily: string;
  disabledHint: string;
  isEnabled: boolean;
  isSpecial: boolean;
  action: CityMenuEntryAction;
};

export type CityMenuState = {
  entryId: string;
  title: string;
  panelId: CityMenuPanelId;
  intelItems: string[];
};

export type CityCultureViewModel = {
  cityName: string;
  description: string;
  economyLevel: "富庶" | "繁荣" | "平稳" | "萧条" | "民不聊生";
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
    "苦兰地处江淮往来之间，商旅与流民混杂，寺院、街市与军府彼此相望。乱世未歇，这里既是暂栖之所，也是消息最先汇聚的地方。",
};

const HOUSE_INTEL_BY_MODULE_ID: Partial<Record<string, string>> = {
  "leader-residence": "府邸之中似乎正在筛选可用之人。",
  "temple-house": "寺院近日香火未断，僧众似乎仍在筹措米粮。",
  "home-house": "自宅一带近来少见外人走动，倒适合静心歇脚。",
  "keep-house": "军府似乎正在整理军务，或许正缺能办事的人。",
  "tea-house": "茶馆里似乎有人正在议论时局。",
  "market-house": "城中商铺正在张罗一批新货。",
  "grain-shop": "粮铺掌柜最近正盯着米价起落。",
  "medicine-house": "药铺郎中正在留心懂药理的帮手。",
  tavern: "酒肆中似乎有人正在借酒试探消息。",
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
      : "市井买卖维持着城中的生计";
  const securityText =
    cityDefinition.danger >= 50
      ? "只是世道未宁，街头巷尾始终带着几分戒备。"
      : "城中秩序尚可，百姓也还留着些许安稳气。";

  return `${cityDefinition.name}位于${regionText}之地，${tradeText}。此地风土杂糅，行旅、军士与本地居民各有来路，${securityText}`;
}

export function isPlayerMonkIdentity(
  playerCharacter: CharacterDefinition
): boolean {
  const identityText = [
    readStringPersonAttributeBySemanticKey(playerCharacter, "title"),
    readStringPersonAttributeBySemanticKey(playerCharacter, "occupation"),
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
    return "富庶";
  }

  if (prosperity >= 80) {
    return "繁荣";
  }

  if (prosperity >= 60) {
    return "平稳";
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
      ? `城中商队近日活络，${cityDefinition.name}的买卖声势似乎比往常更旺。`
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

export function resolveCityMenuEntries(input: {
  cityDefinition: CityDefinition;
  playerCharacter: CharacterDefinition;
  menuResourcesById: Record<string, MenuResourceDefinition>;
  menuInstancesById: Record<string, MenuInstanceDefinition>;
  playableIntegrationsByEditorRecordId?: Record<
    string,
    PlayableIntegrationDefinition
  > | undefined;
  playableIntegrationsById?: Record<
    string,
    PlayableIntegrationDefinition
  > | undefined;
}): CityMenuEntryViewModel[] {
  return readTrimmedStringArray(input.cityDefinition.menuInstanceIds).flatMap(
    (menuInstanceId) => {
      const instance = input.menuInstancesById[menuInstanceId];
      if (instance == null) {
        return [];
      }
      const resource = input.menuResourcesById[instance.resourceId];
      if (resource == null) {
        return [];
      }

      return resource.entries
        .filter((entry) => entry.isVisible !== false)
        .flatMap((entry) => {
          if (
            isBeggingMenuFamily(entry.menuFamily) &&
            !isPlayerMonkIdentity(input.playerCharacter)
          ) {
            return [];
          }

          const action = resolveCityMenuEntryAction(
            entry.menuFamily,
            entry.targetFamily,
            entry.targetId,
            input.playableIntegrationsByEditorRecordId,
            input.playableIntegrationsById
          );
          const isUnsupported = action.type === "unsupported";

          return [
            {
              id: entry.id,
              label:
                entry.label.trim().length > 0
                  ? entry.label
                  : resolveCityMenuEntryLabel(entry.menuFamily, action),
              menuFamily: entry.menuFamily,
              disabledHint: isUnsupported
                ? entry.disabledHint.trim().length > 0
                  ? entry.disabledHint
                  : `未支持的城市菜单目标：${entry.targetFamily}`
                : entry.disabledHint,
              isEnabled: entry.isEnabled !== false && !isUnsupported,
              isSpecial: isBeggingMenuFamily(entry.menuFamily),
              action,
            },
          ];
        });
    }
  );
}

export function createCityMenuState(
  input:
    | {
        entry: CityMenuEntryViewModel;
        cityDefinition: CityDefinition;
        houseDefinitions: HouseDefinition[];
        cityEntries: CityEntryDefinition[];
        cityNpcPoolDefinition: CityNpcPoolDefinition | null;
        calendar: {
          year: number;
          month: number;
          day: number;
        };
      }
    | {
        cityId: string;
        cityName: string;
        currentPanelId?: string;
      }
): CityMenuState | null {
  if (!("entry" in input)) {
    return {
      entryId: input.cityId,
      title: input.cityName,
      panelId: normalizeLegacyCityMenuPanelId(input.currentPanelId),
      intelItems: [],
    };
  }

  if (input.entry.action.type !== "panel") {
    return null;
  }

  return {
    entryId: input.entry.id,
    title: input.entry.label,
    panelId: input.entry.action.panelId,
    intelItems:
      input.entry.action.panelId === "intel"
        ? createCityIntelItems(input)
        : [],
  };
}

function normalizeLegacyCityMenuPanelId(
  value: string | undefined
): CityMenuPanelId {
  switch (normalizeMenuKey(value ?? "")) {
    case "intel":
      return "intel";
    case "locations":
      return "locations";
    case "management":
      return "management";
    case "actions":
    case "overview":
    case "culture":
    default:
      return "overview";
  }
}

function resolveCityMenuEntryAction(
  menuFamily: string,
  targetFamily: MenuTargetFamily,
  targetId: string,
  playableIntegrationsByEditorRecordId?: Record<
    string,
    PlayableIntegrationDefinition
  > | undefined,
  playableIntegrationsById?: Record<
    string,
    PlayableIntegrationDefinition
  > | undefined
): CityMenuEntryAction {
  if (targetFamily === "minigame") {
    const trimmedTargetId = targetId.trim();
    const playableIntegration =
      playableIntegrationsByEditorRecordId?.[trimmedTargetId] ??
      playableIntegrationsById?.[trimmedTargetId] ??
      null;
    if (playableIntegration != null) {
      return {
        type: "minigame",
        minigameId: playableIntegration.playableId,
        integrationId: playableIntegration.integrationId,
      };
    }
    if (
      normalizeMenuKey(trimmedTargetId) === "city-begging" ||
      (trimmedTargetId.length === 0 && isBeggingMenuFamily(menuFamily))
    ) {
      return {
        type: "minigame",
        minigameId: "city-begging",
      };
    }
    return {
      type: "unsupported",
      targetFamily,
      targetId,
    };
  }

  const panelId = resolveCityMenuPanelId(targetId, menuFamily);
  if (panelId != null) {
    return {
      type: "panel",
      panelId,
    };
  }

  if (targetFamily === "dialogue" && targetId.trim().length > 0) {
    return {
      type: "dialogue",
      dialogueId: targetId.trim(),
    };
  }

  return {
    type: "unsupported",
    targetFamily,
    targetId,
  };
}

function resolveCityMenuEntryLabel(
  menuFamily: string,
  action: CityMenuEntryAction
): string {
  if (action.type === "panel") {
    switch (action.panelId) {
      case "overview":
        return "概况";
      case "intel":
        return "情报";
      case "locations":
        return "地点";
      case "management":
        return "管理";
    }
  }

  switch (normalizeMenuKey(menuFamily)) {
    case "overview":
    case "culture":
      return "概况";
    case "intel":
      return "情报";
    case "locations":
      return "地点";
    case "management":
      return "管理";
    case "begging":
      return "化缘";
    default:
      return menuFamily;
  }
}

function resolveCityMenuPanelId(
  targetId: string,
  menuFamily: string
): CityMenuPanelId | null {
  const normalizedTargetId = normalizeMenuKey(targetId);
  const normalizedFamily = normalizeMenuKey(menuFamily);

  switch (normalizedTargetId) {
    case "":
      break;
    case "city-panel.overview":
    case "city-panel.culture":
    case "overview":
    case "culture":
      return "overview";
    case "city-panel.intel":
    case "intel":
      return "intel";
    case "city-panel.locations":
    case "locations":
      return "locations";
    case "city-panel.management":
    case "management":
      return "management";
    default:
      return null;
  }

  switch (normalizedFamily) {
    case "overview":
    case "culture":
      return "overview";
    case "intel":
      return "intel";
    case "locations":
      return "locations";
    case "management":
      return "management";
    default:
      return null;
  }
}

function normalizeMenuKey(value: string): string {
  return value.trim().toLowerCase();
}

function isBeggingMenuFamily(value: string): boolean {
  return normalizeMenuKey(value) === "begging";
}

function readTrimmedStringArray(value: readonly string[] | undefined): string[] {
  return (value ?? []).flatMap((entry) => {
    const normalized = typeof entry === "string" ? entry.trim() : "";
    return normalized.length === 0 ? [] : [normalized];
  });
}
