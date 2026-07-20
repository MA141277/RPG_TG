import type { SceneDefinition } from "../../domain/action";
import type { ActivityDefinition } from "../../domain/activity";
import type { CardDefinition } from "../../domain/card";
import type { CharacterDefinition } from "../../domain/character";
import type { BuildingArrangementDefinition } from "../../domain/building-arrangement";
import type { CityDefinition } from "../../domain/city";
import type { CityEntryDefinition } from "../../domain/city-entry";
import type { CityNpcPoolDefinition, CityNpcPoolRuntimeState } from "../../domain/city-npc";
import type { ContentPackDefinition } from "../../domain/content-pack";
import type { ModActivationResult } from "../../core/contracts/mod-runtime";
import type { EventBinding, EventDefinition } from "../../domain/event";
import type {
  HistoricalCharacterRecord,
  HistoricalCityRoster,
} from "../../domain/historical-character";
import type { HouseDefinition } from "../../domain/house";
import type { LocationAccessDefinition } from "../../domain/location-access";
import type { MapDefinition, MapNode } from "../../domain/map";
import type { FlowPlayableDefinition } from "../../domain/playables/flow";
import type { GridCoordinate } from "../navigation/travel-to-coordinate";
import {
  createMapLocationProvider,
  type MapLocationProvider,
} from "../map/map-location-provider";
import type { TaskDefinition } from "../../core/contracts/task-runtime";
import type { ScenarioPackDefinition } from "../../domain/scenario-pack";
import type { ValuableItemDefinition } from "../../domain/valuable-item";
import {
  mergeHouseModuleDefaults,
  type HouseModuleDefaults,
} from "./house-module-defaults";
import {
  createCharacterManager,
  type CharacterManager,
} from "../character/character-manager";

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
  buildingArrangements: BuildingArrangementDefinition[];
  buildingArrangementById: Record<string, BuildingArrangementDefinition>;
  cityEntries: CityEntryDefinition[];
  characters: CharacterDefinition[];
  characterManager: CharacterManager;
  characterDefinitionById: Record<string, CharacterDefinition>;
  characterNameById: Record<string, string>;
  eventDefinitions: EventDefinition[];
  eventDefinitionsById: Record<string, EventDefinition>;
  eventBindings: EventBinding[];
  eventBindingsById: Record<string, EventBinding>;
  sceneDefinitions: SceneDefinition[];
  sceneDefinitionsById: Record<string, SceneDefinition>;
  taskDefinitions: TaskDefinition[];
  taskDefinitionsById: Record<string, TaskDefinition>;
  activityDefinitions: ActivityDefinition[];
  activityDefinitionsById: Record<string, ActivityDefinition>;
  flowDefinitions: FlowPlayableDefinition[];
  flowDefinitionsById: Record<string, FlowPlayableDefinition>;
  cards: CardDefinition[];
  valuables: ValuableItemDefinition[];
  cityNpcPools: CityNpcPoolDefinition[];
  locationAccess: LocationAccessDefinition[];
  houseModuleDefaults: HouseModuleDefaults;
  cityPortraits: Record<string, string>;
  historicalCharacterIdByCharacterId: Record<string, string>;
  historicalCharacters: HistoricalCharacterRecord[];
  historicalCityRosters: HistoricalCityRoster[];
};

export type ActiveGameContentContext = {
  packId: string;
  gameContent: ActiveGameContent;
  maps: MapDefinition[];
  mapDefinitionById: Record<string, MapDefinition>;
  cities: CityDefinition[];
  cityDefinitionById: Record<string, CityDefinition>;
  houses: HouseDefinition[];
  houseDefinitionById: Record<string, HouseDefinition>;
  buildingArrangements: BuildingArrangementDefinition[];
  cityEntries: CityEntryDefinition[];
  cards: CardDefinition[];
  cityNpcPools: CityNpcPoolDefinition[];
  locationAccess: LocationAccessDefinition[];
  houseModuleDefaults: HouseModuleDefaults;
  historicalCharacters: HistoricalCharacterRecord[];
  historicalCityRosters: HistoricalCityRoster[];
  historicalCharacterIdByCharacterId: Record<string, string>;
  cityPortraits: Record<string, string>;
  textEntriesById: Record<string, string>;
  cityCoordinatesById: Record<string, GridCoordinate>;
  mapLocationProvider: MapLocationProvider;
  cityNameById: Record<string, string>;
  houseNameById: Record<string, string>;
  characterNameById: Record<string, string>;
  characterManager: CharacterManager;
  taskDefinitionsById: Record<string, TaskDefinition>;
  flowDefinitionsById: Record<string, FlowPlayableDefinition>;
  storyContent: {
    eventDefinitionsById: Record<string, EventDefinition>;
    eventBindingsById: Record<string, EventBinding>;
    sceneDefinitionsById: Record<string, SceneDefinition>;
    activityDefinitionsById: Record<string, ActivityDefinition>;
    textEntriesById: Record<string, string>;
  };
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
  const buildingArrangements = resolvedPack.buildingArrangements ?? [];
  const cityEntries = resolvedPack.cityEntries ?? [];
  const characters = resolvedPack.characters ?? [];
  const eventDefinitions = resolvedPack.events ?? [];
  const eventBindings = resolvedPack.eventBindings ?? [];
  const sceneDefinitions = resolvedPack.scenes ?? [];
  const taskDefinitions = resolvedPack.tasks ?? [];
  const activityDefinitions = resolvedPack.activities ?? [];
  const flowDefinitions = resolvedPack.flowDefinitions ?? [];
  const cards = resolvedPack.cards ?? [];
  const valuables = resolvedPack.valuables ?? [];
  const cityNpcPools = resolvedPack.cityNpcPools ?? [];
  const locationAccess = resolvedPack.locationAccess ?? [];
  const historicalCharacters = resolvedPack.historicalCharacters ?? [];
  const historicalCityRosters = resolvedPack.historicalCityRosters ?? [];
  const characterManager = createCharacterManager(characters);

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
    buildingArrangements,
    buildingArrangementById: Object.fromEntries(
      buildingArrangements.map((arrangement) => [arrangement.id, arrangement])
    ),
    cityEntries,
    characters,
    characterManager,
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
    eventBindings,
    eventBindingsById: Object.fromEntries(
      eventBindings.map((eventBinding) => [eventBinding.id, eventBinding])
    ),
    sceneDefinitions,
    sceneDefinitionsById: Object.fromEntries(
      sceneDefinitions.map((sceneDefinition) => [sceneDefinition.id, sceneDefinition])
    ),
    taskDefinitions,
    taskDefinitionsById: Object.fromEntries(
      taskDefinitions.map((taskDefinition) => [taskDefinition.id, taskDefinition])
    ),
    activityDefinitions,
    activityDefinitionsById: Object.fromEntries(
      activityDefinitions.map((activityDefinition) => [activityDefinition.id, activityDefinition])
    ),
    flowDefinitions,
    flowDefinitionsById: Object.fromEntries(
      flowDefinitions.map((flowDefinition) => [flowDefinition.id, flowDefinition])
    ),
    cards,
    valuables,
    cityNpcPools,
    locationAccess,
    houseModuleDefaults: mergeHouseModuleDefaults(
      undefined,
      resolvedPack.houseModuleDefaults
    ),
    cityPortraits: { ...(resolvedPack.cityPortraits ?? {}) },
    historicalCharacterIdByCharacterId: {
      ...(resolvedPack.historicalCharacterIdByCharacterId ?? {}),
    },
    historicalCharacters,
    historicalCityRosters,
  };
}

export function createActiveGameContentContext(
  basePack: ContentPackDefinition,
  overridePack?: ContentPackDefinition
): ActiveGameContentContext {
  const gameContent = createActiveGameContent(basePack, overridePack);
  const cityCoordinatesById = createCityCoordinatesById(
    gameContent.cities,
    gameContent.mapNodesById
  );

  return {
    packId: gameContent.packId,
    gameContent,
    maps: gameContent.maps,
    mapDefinitionById: gameContent.mapDefinitionById,
    cities: gameContent.cities,
    cityDefinitionById: gameContent.cityDefinitionById,
    houses: gameContent.houses,
    houseDefinitionById: gameContent.houseDefinitionById,
    buildingArrangements: gameContent.buildingArrangements,
    cityEntries: gameContent.cityEntries,
    cards: gameContent.cards,
    cityNpcPools: gameContent.cityNpcPools,
    locationAccess: gameContent.locationAccess,
    houseModuleDefaults: gameContent.houseModuleDefaults,
    historicalCharacters: gameContent.historicalCharacters,
    historicalCityRosters: gameContent.historicalCityRosters,
    historicalCharacterIdByCharacterId:
      gameContent.historicalCharacterIdByCharacterId,
    cityPortraits: gameContent.cityPortraits,
    textEntriesById: gameContent.textEntriesById,
    cityCoordinatesById,
    mapLocationProvider: createMapLocationProvider({
      cityDefinitions: gameContent.cities,
      cityCoordinatesById,
    }),
    cityNameById: createCityNameById(gameContent.cities),
    houseNameById: createHouseNameById(gameContent.houses),
    characterNameById: gameContent.characterNameById,
    characterManager: gameContent.characterManager,
    taskDefinitionsById: gameContent.taskDefinitionsById,
    flowDefinitionsById: gameContent.flowDefinitionsById,
    storyContent: {
      eventDefinitionsById: gameContent.eventDefinitionsById,
      eventBindingsById: gameContent.eventBindingsById,
      sceneDefinitionsById: gameContent.sceneDefinitionsById,
      activityDefinitionsById: gameContent.activityDefinitionsById,
      textEntriesById: gameContent.textEntriesById,
    },
  };
}

export function createActiveGameContentContextFromModActivation(input: {
  activationResult: ModActivationResult;
}): ActiveGameContentContext {
  const contentSources = readActivatedContentSources(input.activationResult);
  if (contentSources.length === 0) {
    throw new Error("Activated mod does not provide any content sources.");
  }

  const [basePack, ...overridePacks] = contentSources;
  if (basePack == null) {
    throw new Error("Activated mod does not provide a base content source.");
  }

  const mergedPack = overridePacks.reduce<ContentPackDefinition>(
    (currentPack, overridePack) =>
      mergeContentPacks(currentPack, normalizeContentPack(overridePack)),
    normalizeContentPack(basePack)
  );

  return createActiveGameContentContext(mergedPack);
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
    buildingArrangements: mergeById(
      basePack.buildingArrangements ?? [],
      overridePack.buildingArrangements ?? []
    ),
    cityEntries: [...(overridePack.cityEntries ?? [])],
    characters: mergeById(basePack.characters ?? [], overridePack.characters ?? []),
    events: mergeById(basePack.events ?? [], overridePack.events ?? []),
    eventBindings: mergeById(basePack.eventBindings ?? [], overridePack.eventBindings ?? []),
    scenes: mergeById(basePack.scenes ?? [], overridePack.scenes ?? []),
    tasks: mergeById(basePack.tasks ?? [], overridePack.tasks ?? []),
    activities: mergeById(basePack.activities ?? [], overridePack.activities ?? []),
    flowDefinitions: mergeById(
      basePack.flowDefinitions ?? [],
      overridePack.flowDefinitions ?? []
    ),
    cards: mergeById(basePack.cards ?? [], overridePack.cards ?? []),
    valuables: mergeById(basePack.valuables ?? [], overridePack.valuables ?? []),
    cityNpcPools: mergeCityNpcPools(basePack.cityNpcPools ?? [], overridePack.cityNpcPools ?? []),
    locationAccess: mergeById(
      basePack.locationAccess ?? [],
      overridePack.locationAccess ?? []
    ),
    houseModuleDefaults: mergeHouseModuleDefaults(
      basePack.houseModuleDefaults,
      overridePack.houseModuleDefaults
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
    buildingArrangements: pack.buildingArrangements ?? [],
    cityEntries: pack.cityEntries ?? [],
    characters: pack.characters ?? [],
    events: pack.events ?? [],
    eventBindings: pack.eventBindings ?? [],
    scenes: pack.scenes ?? [],
    tasks: pack.tasks ?? [],
    activities: pack.activities ?? [],
    flowDefinitions: pack.flowDefinitions ?? [],
    cards: pack.cards ?? [],
    valuables: pack.valuables ?? [],
    cityNpcPools: pack.cityNpcPools ?? [],
    locationAccess: pack.locationAccess ?? [],
    houseModuleDefaults: mergeHouseModuleDefaults(undefined, pack.houseModuleDefaults),
    cityPortraits: pack.cityPortraits ?? {},
    historicalCharacterIdByCharacterId: pack.historicalCharacterIdByCharacterId ?? {},
    historicalCharacters: pack.historicalCharacters ?? [],
    historicalCityRosters: pack.historicalCityRosters ?? [],
  };
}

function readActivatedContentSources(
  activationResult: ModActivationResult
): Array<ScenarioPackDefinition | ContentPackDefinition> {
  if (!activationResult.ok) {
    return [];
  }

  return activationResult.activatedMod.normalizedContentSources.filter(
    (source): source is ScenarioPackDefinition | ContentPackDefinition =>
      source != null && typeof source === "object"
  );
}

function createCityCoordinatesById(
  definitions: CityDefinition[],
  mapNodesById: ActiveGameContent["mapNodesById"]
): Record<string, GridCoordinate> {
  return Object.fromEntries(
    definitions.flatMap((cityDefinition) => {
      const mapNodeId = cityDefinition.mapNodeId;
      if (mapNodeId == null) {
        return [];
      }

      const mapNode = mapNodesById[mapNodeId];
      if (mapNode == null) {
        return [];
      }

      return [[cityDefinition.id, { x: mapNode.x, y: mapNode.y }]];
    })
  );
}

function createCityNameById(definitions: CityDefinition[]): Record<string, string> {
  return Object.fromEntries(
    definitions.map((cityDefinition) => [
      cityDefinition.id,
      cityDefinition.name,
    ])
  );
}

function createHouseNameById(definitions: HouseDefinition[]): Record<string, string> {
  return Object.fromEntries(
    definitions.map((houseDefinition) => [
      houseDefinition.id,
      houseDefinition.name,
    ])
  );
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
