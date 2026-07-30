import {
  grainShopInvestigationOfferTextIds,
  grainShopInvestigationRefusalTextIds,
} from "../../content/houses/grain-shop-content";
import type { CityDefinition } from "../../domain/city";
import type { GameState } from "../../domain/game-state";
import type { MapDefinition, MapNode } from "../../domain/map";
import { assertExists } from "../../shared/assert";
import { pickRandom } from "../../shared/random";
import { defaultRuntimeContent } from "../content/default-runtime-content";
import { resolveTextTemplateEntry } from "../content/text-resolution";
import { selectCurrentCity } from "../selectors/select-current-city";
import { quoteCityGrainPrice } from "./grain-market";

const DEFAULT_GRAIN_INTEL_FEE = 100;
const DEFAULT_MAX_NEARBY_CITY_COUNT = 6;

export type SettlementGrainIntelPriceTone = "low" | "high" | "neutral";

export type SettlementGrainIntelEffect = {
  type: "grain-intel";
  moneyDelta: number;
  relationshipDelta: number;
  timeDelta: number;
  currentCityGrainPrice: number | null;
};

export type SettlementGrainIntelRow = {
  cityId: string;
  cityName: string;
  directionLabel: string;
  grainUnit: string;
  sellPrice: number;
  buyPrice: number;
  comparisonLabel: string;
  priceTone: SettlementGrainIntelPriceTone;
  isCurrentCity: boolean;
};

export type SettlementGrainIntelReport = {
  rows: SettlementGrainIntelRow[];
};

export type SettlementGrainIntelOffer = {
  fee: number;
  dialogueLine: string;
};

export type SettlementGrainIntelPurchaseResult =
  | {
      status: "insufficient-funds";
      state: GameState;
      dialogueLine: string;
      effect: SettlementGrainIntelEffect;
    }
  | {
      status: "report";
      state: GameState;
      effect: SettlementGrainIntelEffect;
      report: SettlementGrainIntelReport;
    };

type SettlementGrainIntelPurchaseInput = {
  state: GameState;
  playerGold: number;
  textEntriesById?: Record<string, string>;
  cities?: readonly CityDefinition[];
  maps?: readonly MapDefinition[];
};

type SettlementGrainIntelServiceOptions = {
  fee?: number;
  maxNearbyCityCount?: number;
};

function getGrainIntelTextEntries(
  textEntriesById?: Record<string, string>
): Record<string, string> {
  return textEntriesById ?? defaultRuntimeContent.textEntriesById ?? {};
}

function resolveTemplateLine(
  textEntriesById: Record<string, string>,
  textIds: readonly string[],
  values: Record<string, string | number | boolean | null | undefined>,
  fallback: string
): string {
  const textId = textIds.length > 0 ? pickRandom([...textIds]) : null;
  if (textId == null) {
    return fallback;
  }

  return resolveTextTemplateEntry(textEntriesById, textId, values, fallback);
}

function createEffect(
  fee: number,
  currentCityGrainPrice: number | null,
  paid: boolean
): SettlementGrainIntelEffect {
  return {
    type: "grain-intel",
    moneyDelta: paid ? -fee : 0,
    relationshipDelta: 0,
    timeDelta: paid ? 1 : 0,
    currentCityGrainPrice,
  };
}

function getNodeIndex(maps: readonly MapDefinition[]): Map<string, MapNode> {
  const entries = maps.flatMap((mapDefinition) =>
    (mapDefinition.nodes ?? [])
      .filter((node): node is MapNode & { id: string } => typeof node.id === "string")
      .map((node) => [node.id, node] as const)
  );
  return new Map(entries);
}

function compareCitiesByDistance(
  currentNode: MapNode,
  left: CityDefinition,
  right: CityDefinition,
  nodeIndex: Map<string, MapNode>
): number {
  const leftNode = nodeIndex.get(left.mapNodeId);
  const rightNode = nodeIndex.get(right.mapNodeId);
  const leftDistance =
    leftNode == null
      ? Number.POSITIVE_INFINITY
      : Math.hypot(leftNode.x - currentNode.x, leftNode.y - currentNode.y);
  const rightDistance =
    rightNode == null
      ? Number.POSITIVE_INFINITY
      : Math.hypot(rightNode.x - currentNode.x, rightNode.y - currentNode.y);

  return (
    leftDistance - rightDistance ||
    left.travelCost - right.travelCost ||
    left.name.localeCompare(right.name, "zh-Hans-CN")
  );
}

function createComparisonLabel(
  price: number,
  currentPrice: number,
  isCurrentCity: boolean
): string {
  if (isCurrentCity) {
    return "基准";
  }

  if (price === currentPrice) {
    return "平 持平";
  }

  const delta = Math.abs(price - currentPrice);
  return price > currentPrice ? `↑ 高 ${delta} 文` : `↓ 低 ${delta} 文`;
}

function createPriceTone(
  price: number,
  currentPrice: number,
  isCurrentCity: boolean
): SettlementGrainIntelPriceTone {
  if (isCurrentCity || price === currentPrice) {
    return "neutral";
  }

  return price > currentPrice ? "high" : "low";
}

function createDirectionLabel(
  currentNode: MapNode | null,
  targetNode: MapNode | null,
  isCurrentCity: boolean
): string {
  if (isCurrentCity) {
    return "—";
  }

  if (currentNode == null || targetNode == null) {
    return "不详";
  }

  const dx = targetNode.x - currentNode.x;
  const dy = targetNode.y - currentNode.y;
  if (dx === 0 && dy === 0) {
    return "—";
  }

  const directions = [
    "正东",
    "东北",
    "正北",
    "西北",
    "正西",
    "西南",
    "正南",
    "东南",
  ] as const;
  const octant = Math.round(Math.atan2(-dy, dx) / (Math.PI / 4));
  const directionIndex = ((octant % directions.length) + directions.length) % directions.length;
  return directions[directionIndex] ?? "正东";
}

export class SettlementGrainIntelService {
  readonly fee: number;
  private readonly maxNearbyCityCount: number;

  constructor(options: SettlementGrainIntelServiceOptions = {}) {
    this.fee = options.fee ?? DEFAULT_GRAIN_INTEL_FEE;
    this.maxNearbyCityCount =
      options.maxNearbyCityCount ?? DEFAULT_MAX_NEARBY_CITY_COUNT;
  }

  createOffer(textEntriesById?: Record<string, string>): SettlementGrainIntelOffer {
    const entries = getGrainIntelTextEntries(textEntriesById);

    return {
      fee: this.fee,
      dialogueLine: resolveTemplateLine(
        entries,
        grainShopInvestigationOfferTextIds,
        { fee: this.fee },
        `消息不是白来的，客官若肯留下 ${this.fee} 文，我便与你细讲。`
      ),
    };
  }

  purchaseIntel(
    input: SettlementGrainIntelPurchaseInput
  ): SettlementGrainIntelPurchaseResult {
    const cities = [...(input.cities ?? defaultRuntimeContent.cities ?? [])];
    const maps = [...(input.maps ?? defaultRuntimeContent.maps ?? [])];
    const currentCity = selectCurrentCity(input.state, cities);
    assertExists(
      currentCity,
      `Current city "${input.state.world.currentCityId}" is missing from grain intel service city content.`
    );

    if (input.playerGold < this.fee) {
      const entries = getGrainIntelTextEntries(input.textEntriesById);
      return {
        status: "insufficient-funds",
        state: input.state,
        dialogueLine: resolveTemplateLine(
          entries,
          grainShopInvestigationRefusalTextIds,
          { fee: this.fee },
          `这份粮情得收 ${this.fee} 文，如今钱数不齐，老汉也只得先把话收住。`
        ),
        effect: createEffect(this.fee, null, false),
      };
    }

    const nearbyCities = this.resolveNearbyCities(currentCity, cities, maps);
    let nextState = input.state;
    const nodeIndex = getNodeIndex(maps);
    const currentNode = nodeIndex.get(currentCity.mapNodeId) ?? null;
    const currentQuote = quoteCityGrainPrice(nextState, currentCity);
    nextState = currentQuote.state;

    const rows: SettlementGrainIntelRow[] = [];
    const citiesForReport = [currentCity, ...nearbyCities];

    citiesForReport.forEach((cityDefinition, index) => {
      const quote = quoteCityGrainPrice(nextState, cityDefinition);
      nextState = quote.state;
      const isCurrentCity = index === 0;

      rows.push({
        cityId: cityDefinition.id,
        cityName: cityDefinition.name,
        directionLabel: createDirectionLabel(
          currentNode,
          nodeIndex.get(cityDefinition.mapNodeId) ?? null,
          isCurrentCity
        ),
        grainUnit: quote.unit,
        sellPrice: quote.sellPrice,
        buyPrice: quote.buyPrice,
        comparisonLabel: createComparisonLabel(
          quote.sellPrice,
          currentQuote.sellPrice,
          isCurrentCity
        ),
        priceTone: createPriceTone(
          quote.sellPrice,
          currentQuote.sellPrice,
          isCurrentCity
        ),
        isCurrentCity,
      });
    });

    return {
      status: "report",
      state: nextState,
      effect: createEffect(this.fee, currentQuote.buyPrice, true),
      report: {
        rows,
      },
    };
  }

  private resolveNearbyCities(
    currentCity: CityDefinition,
    cities: readonly CityDefinition[],
    maps: readonly MapDefinition[]
  ): CityDefinition[] {
    const cityById = new Map(cities.map((cityDefinition) => [cityDefinition.id, cityDefinition]));

    if (currentCity.neighbourCityIds.length > 0) {
      return currentCity.neighbourCityIds
        .map((cityId) => cityById.get(cityId) ?? null)
        .filter((cityDefinition): cityDefinition is CityDefinition => cityDefinition != null)
        .slice(0, this.maxNearbyCityCount);
    }

    const nodeIndex = getNodeIndex(maps);
    const currentNode = nodeIndex.get(currentCity.mapNodeId);
    if (currentNode != null) {
      return cities
        .filter((cityDefinition) => cityDefinition.id !== currentCity.id)
        .sort((left, right) =>
          compareCitiesByDistance(currentNode, left, right, nodeIndex)
        )
        .slice(0, this.maxNearbyCityCount);
    }

    const sameRegionCities = cities.filter(
      (cityDefinition) =>
        cityDefinition.id !== currentCity.id &&
        cityDefinition.regionId === currentCity.regionId
    );
    const fallbackPool =
      sameRegionCities.length > 0
        ? sameRegionCities
        : cities.filter((cityDefinition) => cityDefinition.id !== currentCity.id);

    return [...fallbackPool]
      .sort(
        (left, right) =>
          left.travelCost - right.travelCost ||
          left.name.localeCompare(right.name, "zh-Hans-CN")
      )
      .slice(0, this.maxNearbyCityCount);
  }
}
