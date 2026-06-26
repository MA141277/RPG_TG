import type { SceneDefinition } from "../../domain/action";
import type { ActivityDefinition } from "../../domain/activity";
import type { CardDefinition } from "../../domain/card";
import type { CharacterDefinition } from "../../domain/character";
import type { CityDefinition } from "../../domain/city";
import type { CityEntryDefinition } from "../../domain/city-entry";
import type { CityNpcPoolDefinition, CityNpcPoolRuntimeState } from "../../domain/city-npc";
import type { ContentPackDefinition } from "../../domain/content-pack";
import type { EventDefinition } from "../../domain/event";
import type {
  HistoricalCharacterRecord,
  HistoricalCityRoster,
} from "../../domain/historical-character";
import type { HouseAccessRefusalRule, HouseDefinition } from "../../domain/house";
import type { MapDefinition, MapNode } from "../../domain/map";
import type { ValuableItemDefinition } from "../../domain/valuable-item";

type Identified = { id: string };

export type ActiveGameContent = {
  packId: string;
  title: string;
  description?: string;
  textEntriesById: Record<string, string>;
  maps: MapDefinition[];
  mapDefinitionById: Record<string, MapDefinition>;
  mapNodesById: Record<string, MapNode>;
  cities: CityDefinition[];
  cityDefinitionById: Record<string, CityDefinition>;
  houses: HouseDefinition[];
  houseDefinitionById: Record<string, HouseDefinition>;
  cityEntries: CityEntryDefinition[];
  characters: CharacterDefinition[];
  characterDefinitionById: Record<string, CharacterDefinition>;
  characterNameById: Record<string, string>;
  eventDefinitions: EventDefinition[];
  eventDefinitionsById: Record<string, EventDefinition>;
  sceneDefinitions: SceneDefinition[];
  sceneDefinitionsById: Record<string, SceneDefinition>;
  activityDefinitions: ActivityDefinition[];
  activityDefinitionsById: Record<string, ActivityDefinition>;
  cards: CardDefinition[];
  valuables: ValuableItemDefinition[];
  cityNpcPools: CityNpcPoolDefinition[];
  houseAccessRefusalRules: HouseAccessRefusalRule[];
  cityPortraits: Record<string, string>;
  historicalCharacterIdByCharacterId: Record<string, string>;
  historicalCharacters: HistoricalCharacterRecord[];
  historicalCityRosters: HistoricalCityRoster[];
};

export function createActiveGameContent(
  basePack: ContentPackDefinition,
  overridePack?: ContentPackDefinition
): ActiveGameContent {
  const resolvedPack =
    overridePack == null
      ? normalizeContentPack(basePack)
      : mergeContentPacks(normalizeContentPack(basePack), normalizeContentPack(overridePack));

  const maps = resolvedPack.maps ?? [];
  const cities = resolvedPack.cities ?? [];
  const houses = resolvedPack.houses ?? [];
  const cityEntries = resolvedPack.cityEntries ?? [];
  const characters = resolvedPack.characters ?? [];
  const eventDefinitions = resolvedPack.events ?? [];
  const sceneDefinitions = resolvedPack.scenes ?? [];
  const activityDefinitions = resolvedPack.activities ?? [];
  const cards = resolvedPack.cards ?? [];
  const valuables = resolvedPack.valuables ?? [];
  const cityNpcPools = resolvedPack.cityNpcPools ?? [];
  const houseAccessRefusalRules = resolvedPack.houseAccessRefusalRules ?? [];
  const historicalCharacters = resolvedPack.historicalCharacters ?? [];
  const historicalCityRosters = resolvedPack.historicalCityRosters ?? [];

  return {
    packId: resolvedPack.id,
    title: resolvedPack.title,
    ...(resolvedPack.description == null ? {} : { description: resolvedPack.description }),
    textEntriesById: { ...(resolvedPack.textEntries ?? {}) },
    maps,
    mapDefinitionById: Object.fromEntries(
      maps.map((mapDefinition) => [mapDefinition.id, mapDefinition])
    ),
    mapNodesById: Object.fromEntries(
      maps.flatMap((mapDefinition) =>
        mapDefinition.nodes
          .filter((mapNode) => mapNode.id != null)
          .map((mapNode) => [mapNode.id as string, mapNode])
      )
    ),
    cities,
    cityDefinitionById: Object.fromEntries(
      cities.map((cityDefinition) => [cityDefinition.id, cityDefinition])
    ),
    houses,
    houseDefinitionById: Object.fromEntries(
      houses.map((houseDefinition) => [houseDefinition.id, houseDefinition])
    ),
    cityEntries,
    characters,
    characterDefinitionById: Object.fromEntries(
      characters.map((characterDefinition) => [characterDefinition.id, characterDefinition])
    ),
    characterNameById: Object.fromEntries(
      characters.map((characterDefinition) => [characterDefinition.id, characterDefinition.name])
    ),
    eventDefinitions,
    eventDefinitionsById: Object.fromEntries(
      eventDefinitions.map((eventDefinition) => [eventDefinition.id, eventDefinition])
    ),
    sceneDefinitions,
    sceneDefinitionsById: Object.fromEntries(
      sceneDefinitions.map((sceneDefinition) => [sceneDefinition.id, sceneDefinition])
    ),
    activityDefinitions,
    activityDefinitionsById: Object.fromEntries(
      activityDefinitions.map((activityDefinition) => [activityDefinition.id, activityDefinition])
    ),
    cards,
    valuables,
    cityNpcPools,
    houseAccessRefusalRules,
    cityPortraits: { ...(resolvedPack.cityPortraits ?? {}) },
    historicalCharacterIdByCharacterId: {
      ...(resolvedPack.historicalCharacterIdByCharacterId ?? {}),
    },
    historicalCharacters,
    historicalCityRosters,
  };
}

export function mergeContentPacks(
  basePack: ContentPackDefinition,
  overridePack: ContentPackDefinition
): ContentPackDefinition {
  return {
    ...basePack,
    ...overridePack,
    schemaVersion: 1,
    textEntries: {
      ...(basePack.textEntries ?? {}),
      ...(overridePack.textEntries ?? {}),
    },
    maps: mergeById(basePack.maps ?? [], overridePack.maps ?? []),
    cities: mergeById(basePack.cities ?? [], overridePack.cities ?? []),
    houses: mergeById(basePack.houses ?? [], overridePack.houses ?? []),
    cityEntries: mergeById(basePack.cityEntries ?? [], overridePack.cityEntries ?? []),
    characters: mergeById(basePack.characters ?? [], overridePack.characters ?? []),
    events: mergeById(basePack.events ?? [], overridePack.events ?? []),
    scenes: mergeById(basePack.scenes ?? [], overridePack.scenes ?? []),
    activities: mergeById(basePack.activities ?? [], overridePack.activities ?? []),
    cards: mergeById(basePack.cards ?? [], overridePack.cards ?? []),
    valuables: mergeById(basePack.valuables ?? [], overridePack.valuables ?? []),
    cityNpcPools: mergeCityNpcPools(basePack.cityNpcPools ?? [], overridePack.cityNpcPools ?? []),
    houseAccessRefusalRules: mergeById(
      basePack.houseAccessRefusalRules ?? [],
      overridePack.houseAccessRefusalRules ?? []
    ),
    cityPortraits: {
      ...(basePack.cityPortraits ?? {}),
      ...(overridePack.cityPortraits ?? {}),
    },
    historicalCharacterIdByCharacterId: {
      ...(basePack.historicalCharacterIdByCharacterId ?? {}),
      ...(overridePack.historicalCharacterIdByCharacterId ?? {}),
    },
    historicalCharacters: mergeById(
      basePack.historicalCharacters ?? [],
      overridePack.historicalCharacters ?? []
    ),
    historicalCityRosters: mergeHistoricalCityRosters(
      basePack.historicalCityRosters ?? [],
      overridePack.historicalCityRosters ?? []
    ),
  };
}

function normalizeContentPack(pack: ContentPackDefinition): ContentPackDefinition {
  return {
    ...pack,
    schemaVersion: 1,
    textEntries: pack.textEntries ?? {},
    maps: pack.maps ?? [],
    cities: pack.cities ?? [],
    houses: pack.houses ?? [],
    cityEntries: pack.cityEntries ?? [],
    characters: pack.characters ?? [],
    events: pack.events ?? [],
    scenes: pack.scenes ?? [],
    activities: pack.activities ?? [],
    cards: pack.cards ?? [],
    valuables: pack.valuables ?? [],
    cityNpcPools: pack.cityNpcPools ?? [],
    houseAccessRefusalRules: pack.houseAccessRefusalRules ?? [],
    cityPortraits: pack.cityPortraits ?? {},
    historicalCharacterIdByCharacterId: pack.historicalCharacterIdByCharacterId ?? {},
    historicalCharacters: pack.historicalCharacters ?? [],
    historicalCityRosters: pack.historicalCityRosters ?? [],
  };
}

function mergeById<T extends Identified>(base: T[], override: T[]): T[] {
  if (override.length === 0) {
    return base;
  }

  const overrideIds = new Set(override.map((entry) => entry.id));
  return [...base.filter((entry) => !overrideIds.has(entry.id)), ...override];
}

function mergeCityNpcPools(
  base: CityNpcPoolDefinition[],
  override: CityNpcPoolDefinition[]
): CityNpcPoolDefinition[] {
  if (override.length === 0) {
    return base;
  }

  const overrideByCityId = Object.fromEntries(
    override.map((poolDefinition) => [poolDefinition.cityId, poolDefinition])
  );

  return [
    ...base
      .filter((poolDefinition) => overrideByCityId[poolDefinition.cityId] == null)
      .map((poolDefinition) => poolDefinition),
    ...override.map((poolDefinition) => poolDefinition),
  ];
}

function mergeHistoricalCityRosters(
  base: HistoricalCityRoster[],
  override: HistoricalCityRoster[]
): HistoricalCityRoster[] {
  if (override.length === 0) {
    return base;
  }

  const overrideByCityNodeId = Object.fromEntries(
    override.map((roster) => [roster.cityNodeId, roster])
  );

  return [
    ...base.filter((roster) => overrideByCityNodeId[roster.cityNodeId] == null),
    ...override,
  ];
}
