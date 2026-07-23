import type { ActivityDefinition } from "../../domain/activity";
import type { CardDefinition } from "../../domain/card";
import type { CharacterDefinition } from "../../domain/character";
import type { BuildingArrangementDefinition } from "../../domain/building-arrangement";
import type { CityDefinition } from "../../domain/city";
import type { CityEntryDefinition } from "../../domain/city-entry";
import type { CityNpcPoolDefinition, CityNpcPoolRuntimeState } from "../../domain/city-npc";
import type { ContentPackDefinition } from "../../domain/content-pack";
import type { ModActivationResult } from "../../core/contracts/mod-runtime";
import type { RuntimeDialogueDefinition } from "../../domain/dialogue";
import type { EventBinding, EventDefinition } from "../../domain/event";
import type {
  HistoricalCharacterRecord,
  HistoricalCityRoster,
} from "../../domain/historical-character";
import type { HouseDefinition } from "../../domain/house";
import type { LocationAccessDefinition } from "../../domain/location-access";
import type { MapDefinition, MapNode } from "../../domain/map";
import type { FlowPlayableDefinition } from "../../domain/playables/flow";
import type {
  PortraitResourceDefinition,
  PortraitVariantDefinition,
} from "../../domain/portrait-resource";
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
  dialogueDefinitions: RuntimeDialogueDefinition[];
  dialogueDefinitionsById: Record<string, RuntimeDialogueDefinition>;
  taskDefinitions: TaskDefinition[];
  taskDefinitionsById: Record<string, TaskDefinition>;
  activityDefinitions: ActivityDefinition[];
  activityDefinitionsById: Record<string, ActivityDefinition>;
  flowPlayables: FlowPlayableDefinition[];
  flowPlayablesById: Record<string, FlowPlayableDefinition>;
  cards: CardDefinition[];
  valuables: ValuableItemDefinition[];
  cityNpcPools: CityNpcPoolDefinition[];
  locationAccess: LocationAccessDefinition[];
  houseModuleDefaults: HouseModuleDefaults;
  portraits: PortraitResourceDefinition[];
  portraitResourceById: Record<string, PortraitResourceDefinition>;
  portraitVariants: PortraitVariantDefinition[];
  portraitVariantById: Record<string, PortraitVariantDefinition>;
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
  portraits: PortraitResourceDefinition[];
  portraitResourceById: Record<string, PortraitResourceDefinition>;
  portraitVariants: PortraitVariantDefinition[];
  portraitVariantById: Record<string, PortraitVariantDefinition>;
  historicalCharacters: HistoricalCharacterRecord[];
  historicalCityRosters: HistoricalCityRoster[];
  historicalCharacterIdByCharacterId: Record<string, string>;
  cityPortraits: Record<string, string>;
  textEntriesById: Record<string, string>;
  mapLocationProvider: MapLocationProvider;
  cityNameById: Record<string, string>;
  houseNameById: Record<string, string>;
  characterNameById: Record<string, string>;
  characterManager: CharacterManager;
  taskDefinitionsById: Record<string, TaskDefinition>;
  flowPlayablesById: Record<string, FlowPlayableDefinition>;
  storyContent: {
    eventDefinitionsById: Record<string, EventDefinition>;
    eventBindingsById: Record<string, EventBinding>;
    dialogueDefinitionsById: Record<string, RuntimeDialogueDefinition>;
    activityDefinitionsById: Record<string, ActivityDefinition>;
    flowPlayablesById: Record<string, FlowPlayableDefinition>;
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
      : mergeContentPacks(normalizeContentPack(basePack), overridePack);

  const maps = resolvedPack.maps ?? [];
  const cities = resolvedPack.cities ?? [];
  const houses = resolvedPack.houses ?? [];
  const buildingArrangements = resolvedPack.buildingArrangements ?? [];
  const cityEntries = resolvedPack.cityEntries ?? [];
  const eventDefinitions = resolvedPack.events ?? [];
  const eventBindings = resolvedPack.eventBindings ?? [];
  const dialogueDefinitions = resolvedPack.dialogues ?? [];
  const taskDefinitions = resolvedPack.tasks ?? [];
  const activityDefinitions = resolvedPack.activities ?? [];
  const flowPlayables = resolvedPack.flowPlayables ?? [];
  const cards = resolvedPack.cards ?? [];
  const valuables = resolvedPack.valuables ?? [];
  const cityNpcPools = resolvedPack.cityNpcPools ?? [];
  const locationAccess = resolvedPack.locationAccess ?? [];
  const historicalCharacters = resolvedPack.historicalCharacters ?? [];
  const historicalCityRosters = resolvedPack.historicalCityRosters ?? [];
  const portraits = resolvedPack.portraits ?? [];
  const portraitVariants = resolvedPack.portraitVariants ?? [];
  const portraitResourceById = Object.fromEntries(
    portraits.map((portrait) => [portrait.id, portrait])
  );
  const portraitVariantById = Object.fromEntries(
    portraitVariants.map((variant) => [variant.id, variant])
  );
  const characters = materializeCharactersWithPortraitResources(
    resolvedPack.characters ?? [],
    portraitResourceById,
    portraitVariants
  );
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
    dialogueDefinitions,
    dialogueDefinitionsById: Object.fromEntries(
      dialogueDefinitions.map((dialogueDefinition) => [dialogueDefinition.id, dialogueDefinition])
    ),
    taskDefinitions,
    taskDefinitionsById: Object.fromEntries(
      taskDefinitions.map((taskDefinition) => [taskDefinition.id, taskDefinition])
    ),
    activityDefinitions,
    activityDefinitionsById: Object.fromEntries(
      activityDefinitions.map((activityDefinition) => [activityDefinition.id, activityDefinition])
    ),
    flowPlayables,
    flowPlayablesById: Object.fromEntries(
      flowPlayables.map((flowPlayable) => [flowPlayable.id, flowPlayable])
    ),
    cards,
    valuables,
    cityNpcPools,
    locationAccess,
    houseModuleDefaults: mergeHouseModuleDefaults(
      undefined,
      resolvedPack.houseModuleDefaults
    ),
    portraits,
    portraitResourceById,
    portraitVariants,
    portraitVariantById,
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
    portraits: gameContent.portraits,
    portraitResourceById: gameContent.portraitResourceById,
    portraitVariants: gameContent.portraitVariants,
    portraitVariantById: gameContent.portraitVariantById,
    historicalCharacters: gameContent.historicalCharacters,
    historicalCityRosters: gameContent.historicalCityRosters,
    historicalCharacterIdByCharacterId:
      gameContent.historicalCharacterIdByCharacterId,
    cityPortraits: gameContent.cityPortraits,
    textEntriesById: gameContent.textEntriesById,
    mapLocationProvider: createMapLocationProvider({
      cityDefinitions: gameContent.cities,
    }),
    cityNameById: createCityNameById(gameContent.cities),
    houseNameById: createHouseNameById(gameContent.houses),
    characterNameById: gameContent.characterNameById,
    characterManager: gameContent.characterManager,
    taskDefinitionsById: gameContent.taskDefinitionsById,
    flowPlayablesById: gameContent.flowPlayablesById,
    storyContent: {
      eventDefinitionsById: gameContent.eventDefinitionsById,
      eventBindingsById: gameContent.eventBindingsById,
      dialogueDefinitionsById: gameContent.dialogueDefinitionsById,
      activityDefinitionsById: gameContent.activityDefinitionsById,
      flowPlayablesById: gameContent.flowPlayablesById,
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
      mergeContentPacks(currentPack, overridePack),
    normalizeContentPack(basePack)
  );

  return createActiveGameContentContext(mergedPack);
}

export function mergeContentPacks(
  basePack: ContentPackDefinition,
  overridePack: ContentPackDefinition
): ContentPackDefinition {
  const hasCities = hasOwnProperty(overridePack, "cities");
  const hasHouses = hasOwnProperty(overridePack, "houses");
  const hasBuildingArrangements = hasOwnProperty(overridePack, "buildingArrangements");
  const hasCityEntries = hasOwnProperty(overridePack, "cityEntries");
  const hasCityNpcPools = hasOwnProperty(overridePack, "cityNpcPools");

  return {
    ...basePack,
    ...overridePack,
    schemaVersion: 1,
    textEntries: {
      ...(basePack.textEntries ?? {}),
      ...(overridePack.textEntries ?? {}),
    },
    maps: mergeById(basePack.maps ?? [], overridePack.maps ?? []),
    cities: replaceWhenDeclared(basePack.cities ?? [], overridePack.cities, hasCities),
    houses: replaceWhenDeclared(basePack.houses ?? [], overridePack.houses, hasHouses),
    buildingArrangements: replaceWhenDeclared(
      basePack.buildingArrangements ?? [],
      overridePack.buildingArrangements,
      hasBuildingArrangements
    ),
    cityEntries: replaceWhenDeclared(
      basePack.cityEntries ?? [],
      overridePack.cityEntries,
      hasCityEntries
    ),
    characters: mergeById(basePack.characters ?? [], overridePack.characters ?? []),
    events: mergeById(basePack.events ?? [], overridePack.events ?? []),
    eventBindings: mergeById(basePack.eventBindings ?? [], overridePack.eventBindings ?? []),
    dialogues: mergeById(basePack.dialogues ?? [], overridePack.dialogues ?? []),
    tasks: mergeById(basePack.tasks ?? [], overridePack.tasks ?? []),
    activities: mergeById(basePack.activities ?? [], overridePack.activities ?? []),
    flowPlayables: mergeById(
      basePack.flowPlayables ?? [],
      overridePack.flowPlayables ?? []
    ),
    cards: mergeById(basePack.cards ?? [], overridePack.cards ?? []),
    valuables: mergeById(basePack.valuables ?? [], overridePack.valuables ?? []),
    cityNpcPools: replaceWhenDeclared(
      basePack.cityNpcPools ?? [],
      overridePack.cityNpcPools,
      hasCityNpcPools
    ),
    locationAccess: mergeById(
      basePack.locationAccess ?? [],
      overridePack.locationAccess ?? []
    ),
    houseModuleDefaults: mergeHouseModuleDefaults(
      basePack.houseModuleDefaults,
      overridePack.houseModuleDefaults
    ),
    portraits: mergeById(basePack.portraits ?? [], overridePack.portraits ?? []),
    portraitVariants: mergeById(
      basePack.portraitVariants ?? [],
      overridePack.portraitVariants ?? []
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
    dialogues: pack.dialogues ?? [],
    tasks: pack.tasks ?? [],
    activities: pack.activities ?? [],
    flowPlayables: pack.flowPlayables ?? [],
    cards: pack.cards ?? [],
    valuables: pack.valuables ?? [],
    cityNpcPools: pack.cityNpcPools ?? [],
    locationAccess: pack.locationAccess ?? [],
    houseModuleDefaults: mergeHouseModuleDefaults(undefined, pack.houseModuleDefaults),
    portraits: pack.portraits ?? [],
    portraitVariants: pack.portraitVariants ?? [],
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

function materializeCharactersWithPortraitResources(
  characters: CharacterDefinition[],
  portraitResourceById: Record<string, PortraitResourceDefinition>,
  portraitVariants: PortraitVariantDefinition[]
): CharacterDefinition[] {
  return characters.map((character) => {
    const scopedVariants = portraitVariants
      .filter((variant) => variant.parentPortraitId === character.portraitId)
      .map((variant) => {
        const portrait = portraitResourceById[variant.portraitId];
        return {
          id: variant.id,
          label: variant.label,
          portraitId: variant.portraitId,
          ...(portrait == null
            ? {}
            : {
                portraitImageUrl: portrait.portraitImage,
                ...(portrait.avatarImage == null
                  ? {}
                  : { avatarImageUrl: portrait.avatarImage }),
              }),
        };
      });
    const activeVariant =
      scopedVariants.find((variant) => variant.id === character.portraitVariantId) ??
      null;
    const basePortrait = portraitResourceById[character.portraitId];

    return {
      ...character,
      ...(scopedVariants.length === 0 ? {} : { portraitVariants: scopedVariants }),
      ...(activeVariant?.portraitImageUrl != null
        ? { portraitImageUrl: activeVariant.portraitImageUrl }
        : basePortrait == null
          ? {}
          : { portraitImageUrl: basePortrait.portraitImage }),
      ...(activeVariant?.avatarImageUrl != null
        ? { avatarImageUrl: activeVariant.avatarImageUrl }
        : basePortrait?.avatarImage == null
          ? {}
          : { avatarImageUrl: basePortrait.avatarImage }),
    };
  });
}

function replaceWhenDeclared<T>(
  base: T[],
  override: readonly T[] | undefined,
  hasOverride: boolean
): T[] {
  return hasOverride ? [...(override ?? [])] : base;
}

function hasOwnProperty<T extends object, K extends PropertyKey>(
  value: T,
  key: K
): boolean {
  return Object.prototype.hasOwnProperty.call(value, key);
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
