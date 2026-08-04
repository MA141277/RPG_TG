import type { SceneDefinition } from "../../domain/action";
import type { ActivityDefinition } from "../../domain/activity";
import type { BuildingArrangementDefinition } from "../../domain/building-arrangement";
import type { CardDefinition } from "../../domain/card";
import type { CharacterDefinition } from "../../domain/character";
import type { CityDefinition } from "../../domain/city";
import type { CityEntryDefinition } from "../../domain/city-entry";
import type { CityNpcPoolDefinition, CityNpcPoolRuntimeState } from "../../domain/city-npc";
import type { ContentPackDefinition } from "../../domain/content-pack";
import type { ItemDefinition } from "../../domain/content-pack";
import type { RuntimeDialogueDefinition } from "../../domain/dialogue";
import type { SettlementDefinition } from "../../core/contracts/settlement-runtime";
import type { ModActivationResult } from "../../core/contracts/mod-runtime";
import type { EventBinding, EventDefinition } from "../../domain/event";
import type {
  HistoricalCharacterRecord,
  HistoricalCityRoster,
} from "../../domain/historical-character";
import type { HouseAccessRefusalRule, HouseDefinition } from "../../domain/house";
import type { LocationAccessDefinition } from "../../domain/location-access";
import type { MapDefinition, MapNode } from "../../domain/map";
import type { MenuInstanceDefinition, MenuResourceDefinition } from "../../domain/menu";
import type { MeetingActionSetDefinition } from "../../domain/meeting/meeting-action-set";
import type { MeetingBindingDefinition } from "../../domain/meeting/meeting-binding";
import type { MeetingChoiceSetDefinition } from "../../domain/meeting/meeting-choice-set";
import type { MeetingDefinition } from "../../domain/meeting/meeting-definition";
import type { MeetingPanelDefinition } from "../../domain/meeting/meeting-panel";
import type { GridCoordinate } from "../navigation/travel-to-coordinate";
import type {
  ProgressTrackBinding,
  ProgressTrackDefinition,
} from "../../core/contracts/progression-runtime";
import type { TaskDefinition } from "../../core/contracts/task-runtime";
import type { ScenarioPackDefinition } from "../../domain/scenario-pack";
import type { ValuableItemDefinition } from "../../domain/valuable-item";
import type { FlowPlayableDefinition } from "../../domain/playables/flow";
import { createCompatibleSceneDefinitions } from "../../core/runtime/mod-first-compatibility";

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
  characterDefinitionById: Record<string, CharacterDefinition>;
  characterNameById: Record<string, string>;
  eventDefinitions: EventDefinition[];
  eventDefinitionsById: Record<string, EventDefinition>;
  sceneDefinitions: SceneDefinition[];
  sceneDefinitionsById: Record<string, SceneDefinition>;
  dialogueDefinitions: RuntimeDialogueDefinition[];
  dialogueDefinitionsById: Record<string, RuntimeDialogueDefinition>;
  meetings: MeetingDefinition[];
  meetingsById: Record<string, MeetingDefinition>;
  meetingBindings: MeetingBindingDefinition[];
  meetingBindingsById: Record<string, MeetingBindingDefinition>;
  meetingPanels: MeetingPanelDefinition[];
  meetingPanelsById: Record<string, MeetingPanelDefinition>;
  meetingChoiceSets: MeetingChoiceSetDefinition[];
  meetingChoiceSetsById: Record<string, MeetingChoiceSetDefinition>;
  meetingActionSets: MeetingActionSetDefinition[];
  meetingActionSetsById: Record<string, MeetingActionSetDefinition>;
  playableShells: FlowPlayableDefinition[];
  playableShellsById: Record<string, FlowPlayableDefinition>;
  eventBindings: EventBinding[];
  eventBindingsById: Record<string, EventBinding>;
  menuResources: MenuResourceDefinition[];
  menuResourcesById: Record<string, MenuResourceDefinition>;
  menuInstances: MenuInstanceDefinition[];
  menuInstancesById: Record<string, MenuInstanceDefinition>;
  settlementDefinitions: (SettlementDefinition & {
    id: string;
    title?: string;
    nextEventId?: string;
  })[];
  settlementDefinitionsById: Record<
    string,
    | (SettlementDefinition & {
        id: string;
        title?: string;
        nextEventId?: string;
      })
    | undefined
  >;
  progressTrackDefinitions: ProgressTrackDefinition[];
  progressTrackDefinitionsById: Record<string, ProgressTrackDefinition>;
  progressTrackBindings: ProgressTrackBinding[];
  progressTrackBindingsById: Record<string, ProgressTrackBinding>;
  taskDefinitions: TaskDefinition[];
  taskDefinitionsById: Record<string, TaskDefinition>;
  activityDefinitions: ActivityDefinition[];
  activityDefinitionsById: Record<string, ActivityDefinition>;
  cards: CardDefinition[];
  valuables: ValuableItemDefinition[];
  items: ItemDefinition[];
  cityNpcPools: CityNpcPoolDefinition[];
  locationAccess: LocationAccessDefinition[];
  houseModuleDefaults: Record<string, unknown>;
  houseAccessRefusalRules: HouseAccessRefusalRule[];
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
  buildingArrangementById: Record<string, BuildingArrangementDefinition>;
  cityEntries: CityEntryDefinition[];
  cards: CardDefinition[];
  cityNpcPools: CityNpcPoolDefinition[];
  historicalCharacters: HistoricalCharacterRecord[];
  historicalCityRosters: HistoricalCityRoster[];
  historicalCharacterIdByCharacterId: Record<string, string>;
  cityPortraits: Record<string, string>;
  textEntriesById: Record<string, string>;
  cityCoordinatesById: Record<string, GridCoordinate>;
  cityNameById: Record<string, string>;
  houseNameById: Record<string, string>;
  characterNameById: Record<string, string>;
  taskDefinitionsById: Record<string, TaskDefinition>;
  storyContent: {
    eventDefinitionsById: Record<string, EventDefinition>;
    sceneDefinitionsById: Record<string, SceneDefinition>;
    dialogueDefinitionsById: Record<string, RuntimeDialogueDefinition>;
    meetingsById: Record<string, MeetingDefinition>;
    meetingBindingsById: Record<string, MeetingBindingDefinition>;
    meetingPanelsById: Record<string, MeetingPanelDefinition>;
    meetingChoiceSetsById: Record<string, MeetingChoiceSetDefinition>;
    meetingActionSetsById: Record<string, MeetingActionSetDefinition>;
    eventBindingsById: Record<string, EventBinding>;
    settlementDefinitionsById: Record<
      string,
      | (SettlementDefinition & {
          id: string;
          title?: string;
          nextEventId?: string;
        })
      | undefined
    >;
    progressTrackDefinitionsById: Record<string, ProgressTrackDefinition>;
    progressTrackBindingsById: Record<string, ProgressTrackBinding>;
    activityDefinitionsById: Record<string, ActivityDefinition>;
    playableShellsById: Record<string, FlowPlayableDefinition>;
    cityDefinitionsById: Record<string, CityDefinition>;
    houseDefinitionsById: Record<string, HouseDefinition>;
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
  const dialogueDefinitions = resolvedPack.dialogues ?? [];
  const meetings = resolvedPack.meetings ?? [];
  const meetingBindings = resolvedPack.meetingBindings ?? [];
  const meetingPanels = resolvedPack.meetingPanels ?? [];
  const meetingChoiceSets = resolvedPack.meetingChoiceSets ?? [];
  const meetingActionSets = resolvedPack.meetingActionSets ?? [];
  const playableShells =
    resolvedPack.playableShells ??
    resolvedPack.flowPlayables ??
    resolvedPack.flows ??
    [];
  const playableShellsById = Object.fromEntries(
    playableShells.map((flowDefinition) => [flowDefinition.id, flowDefinition])
  );
  const eventBindings = resolvedPack.eventBindings ?? [];
  const menuResources = resolvedPack.menuResources ?? [];
  const menuInstances = resolvedPack.menuInstances ?? [];
  const settlementDefinitions = resolvedPack.settlements ?? [];
  const progressTrackDefinitions = resolvedPack.progressTracks ?? [];
  const progressTrackBindings = resolvedPack.progressTrackBindings ?? [];
  const sceneDefinitions = createCompatibleSceneDefinitions({
    sceneDefinitions: resolvedPack.scenes ?? [],
    dialogueDefinitions,
  });
  const taskDefinitions = resolvedPack.tasks ?? [];
  const activityDefinitions = resolvedPack.activities ?? [];
  const cards = resolvedPack.cards ?? [];
  const valuables = resolvedPack.valuables ?? [];
  const items = resolvedPack.items ?? [];
  const cityNpcPools = resolvedPack.cityNpcPools ?? [];
  const locationAccess = resolvedPack.locationAccess ?? [];
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
    buildingArrangements,
    buildingArrangementById: Object.fromEntries(
      buildingArrangements.map((arrangement) => [arrangement.id, arrangement])
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
    dialogueDefinitions,
    dialogueDefinitionsById: Object.fromEntries(
      dialogueDefinitions.map((dialogueDefinition) => [
        dialogueDefinition.id,
        dialogueDefinition,
      ])
    ),
    meetings,
    meetingsById: Object.fromEntries(meetings.map((meeting) => [meeting.id, meeting])),
    meetingBindings,
    meetingBindingsById: Object.fromEntries(
      meetingBindings.map((binding) => [binding.id, binding])
    ),
    meetingPanels,
    meetingPanelsById: Object.fromEntries(
      meetingPanels.map((panel) => [panel.id, panel])
    ),
    meetingChoiceSets,
    meetingChoiceSetsById: Object.fromEntries(
      meetingChoiceSets.map((choiceSet) => [choiceSet.id, choiceSet])
    ),
    meetingActionSets,
    meetingActionSetsById: Object.fromEntries(
      meetingActionSets.map((actionSet) => [actionSet.id, actionSet])
    ),
    playableShells,
    playableShellsById,
    eventBindings,
    eventBindingsById: Object.fromEntries(
      eventBindings.map((eventBinding) => [eventBinding.id, eventBinding])
    ),
    menuResources,
    menuResourcesById: Object.fromEntries(
      menuResources.map((resource) => [resource.id, resource])
    ),
    menuInstances,
    menuInstancesById: Object.fromEntries(
      menuInstances.map((instance) => [instance.id, instance])
    ),
    settlementDefinitions,
    settlementDefinitionsById: Object.fromEntries(
      settlementDefinitions.map((settlementDefinition) => [
        settlementDefinition.id,
        settlementDefinition,
      ])
    ),
    progressTrackDefinitions,
    progressTrackDefinitionsById: Object.fromEntries(
      progressTrackDefinitions.map((progressTrackDefinition) => [
        progressTrackDefinition.id,
        progressTrackDefinition,
      ])
    ),
    progressTrackBindings,
    progressTrackBindingsById: Object.fromEntries(
      progressTrackBindings.map((progressTrackBinding) => [
        progressTrackBinding.id,
        progressTrackBinding,
      ])
    ),
    taskDefinitions,
    taskDefinitionsById: Object.fromEntries(
      taskDefinitions.map((taskDefinition) => [taskDefinition.id, taskDefinition])
    ),
    activityDefinitions,
    activityDefinitionsById: Object.fromEntries(
      activityDefinitions.map((activityDefinition) => [activityDefinition.id, activityDefinition])
    ),
    cards,
    valuables,
    items,
    cityNpcPools,
    locationAccess,
    houseModuleDefaults: { ...(resolvedPack.houseModuleDefaults ?? {}) },
    houseAccessRefusalRules,
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
    buildingArrangementById: gameContent.buildingArrangementById,
    cityEntries: gameContent.cityEntries,
    cards: gameContent.cards,
    cityNpcPools: gameContent.cityNpcPools,
    historicalCharacters: gameContent.historicalCharacters,
    historicalCityRosters: gameContent.historicalCityRosters,
    historicalCharacterIdByCharacterId:
      gameContent.historicalCharacterIdByCharacterId,
    cityPortraits: gameContent.cityPortraits,
    textEntriesById: gameContent.textEntriesById,
    cityCoordinatesById: createCityCoordinatesById(
      gameContent.cities,
      gameContent.mapNodesById
    ),
    cityNameById: createCityNameById(gameContent.cities),
    houseNameById: createHouseNameById(gameContent.houses),
    characterNameById: gameContent.characterNameById,
    taskDefinitionsById: gameContent.taskDefinitionsById,
    storyContent: {
      eventDefinitionsById: gameContent.eventDefinitionsById,
      sceneDefinitionsById: gameContent.sceneDefinitionsById,
      dialogueDefinitionsById: gameContent.dialogueDefinitionsById,
      meetingsById: gameContent.meetingsById,
      meetingBindingsById: gameContent.meetingBindingsById,
      meetingPanelsById: gameContent.meetingPanelsById,
      meetingChoiceSetsById: gameContent.meetingChoiceSetsById,
      meetingActionSetsById: gameContent.meetingActionSetsById,
      playableShellsById: gameContent.playableShellsById,
      eventBindingsById: gameContent.eventBindingsById,
      settlementDefinitionsById: gameContent.settlementDefinitionsById,
      progressTrackDefinitionsById: gameContent.progressTrackDefinitionsById,
      progressTrackBindingsById: gameContent.progressTrackBindingsById,
      activityDefinitionsById: gameContent.activityDefinitionsById,
      cityDefinitionsById: gameContent.cityDefinitionById,
      houseDefinitionsById: gameContent.houseDefinitionById,
      textEntriesById: gameContent.textEntriesById,
    },
  };
}

export function createActiveGameContentContextFromModActivation(input: {
  basePack: ContentPackDefinition;
  activationResult: ModActivationResult;
}): ActiveGameContentContext {
  const overridePack = readActivatedContentSource(input.activationResult);
  if (overridePack == null || overridePack.id === input.basePack.id) {
    return createActiveGameContentContext(input.basePack);
  }

  return createActiveGameContentContext(input.basePack, overridePack);
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
    cityEntries: mergeById(basePack.cityEntries ?? [], overridePack.cityEntries ?? []),
    characters: mergeById(basePack.characters ?? [], overridePack.characters ?? []),
    events: mergeById(basePack.events ?? [], overridePack.events ?? []),
    scenes: mergeById(basePack.scenes ?? [], overridePack.scenes ?? []),
    dialogues: mergeById(basePack.dialogues ?? [], overridePack.dialogues ?? []),
    meetings: mergeById(basePack.meetings ?? [], overridePack.meetings ?? []),
    meetingBindings: mergeById(
      basePack.meetingBindings ?? [],
      overridePack.meetingBindings ?? []
    ),
    meetingPanels: mergeById(
      basePack.meetingPanels ?? [],
      overridePack.meetingPanels ?? []
    ),
    meetingChoiceSets: mergeById(
      basePack.meetingChoiceSets ?? [],
      overridePack.meetingChoiceSets ?? []
    ),
    meetingActionSets: mergeById(
      basePack.meetingActionSets ?? [],
      overridePack.meetingActionSets ?? []
    ),
    eventBindings: mergeById(
      basePack.eventBindings ?? [],
      overridePack.eventBindings ?? []
    ),
    menuResources: mergeById(
      basePack.menuResources ?? [],
      overridePack.menuResources ?? []
    ),
    menuInstances: mergeById(
      basePack.menuInstances ?? [],
      overridePack.menuInstances ?? []
    ),
    settlements: mergeById(
      basePack.settlements ?? [],
      overridePack.settlements ?? []
    ),
    progressTracks: mergeById(
      basePack.progressTracks ?? [],
      overridePack.progressTracks ?? []
    ),
    progressTrackBindings: mergeById(
      basePack.progressTrackBindings ?? [],
      overridePack.progressTrackBindings ?? []
    ),
    tasks: mergeById(basePack.tasks ?? [], overridePack.tasks ?? []),
    activities: mergeById(basePack.activities ?? [], overridePack.activities ?? []),
    cards: mergeById(basePack.cards ?? [], overridePack.cards ?? []),
    valuables: mergeById(basePack.valuables ?? [], overridePack.valuables ?? []),
    items: mergeById(basePack.items ?? [], overridePack.items ?? []),
    cityNpcPools: mergeCityNpcPools(basePack.cityNpcPools ?? [], overridePack.cityNpcPools ?? []),
    locationAccess: mergeById(
      basePack.locationAccess ?? [],
      overridePack.locationAccess ?? []
    ),
    houseModuleDefaults: {
      ...(basePack.houseModuleDefaults ?? {}),
      ...(overridePack.houseModuleDefaults ?? {}),
    },
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
    buildingArrangements: pack.buildingArrangements ?? [],
    cityEntries: pack.cityEntries ?? [],
    characters: pack.characters ?? [],
    events: pack.events ?? [],
    scenes: pack.scenes ?? [],
    dialogues: pack.dialogues ?? [],
    meetings: pack.meetings ?? [],
    meetingBindings: pack.meetingBindings ?? [],
    meetingPanels: pack.meetingPanels ?? [],
    meetingChoiceSets: pack.meetingChoiceSets ?? [],
    meetingActionSets: pack.meetingActionSets ?? [],
    eventBindings: pack.eventBindings ?? [],
    menuResources: pack.menuResources ?? [],
    menuInstances: pack.menuInstances ?? [],
    settlements: pack.settlements ?? [],
    progressTracks: pack.progressTracks ?? [],
    progressTrackBindings: pack.progressTrackBindings ?? [],
    tasks: pack.tasks ?? [],
    activities: pack.activities ?? [],
    cards: pack.cards ?? [],
    valuables: pack.valuables ?? [],
    items: pack.items ?? [],
    cityNpcPools: pack.cityNpcPools ?? [],
    locationAccess: pack.locationAccess ?? [],
    houseModuleDefaults: pack.houseModuleDefaults ?? {},
    houseAccessRefusalRules: pack.houseAccessRefusalRules ?? [],
    cityPortraits: pack.cityPortraits ?? {},
    historicalCharacterIdByCharacterId: pack.historicalCharacterIdByCharacterId ?? {},
    historicalCharacters: pack.historicalCharacters ?? [],
    historicalCityRosters: pack.historicalCityRosters ?? [],
  };
}

function readActivatedContentSource(
  activationResult: ModActivationResult
): ScenarioPackDefinition | ContentPackDefinition | null {
  if (!activationResult.ok) {
    return null;
  }

  const primarySource = activationResult.activatedMod.normalizedContentSources[0];
  if (primarySource == null || typeof primarySource !== "object") {
    return null;
  }

  return primarySource as ScenarioPackDefinition | ContentPackDefinition;
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
