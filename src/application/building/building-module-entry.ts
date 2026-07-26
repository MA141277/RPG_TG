import type { AppState } from "../app-shell";
import type { BuildingArrangementDefinition } from "../../domain/building-arrangement";
import type { CityDefinition } from "../../domain/city";
import type { CityNpcPoolDefinition } from "../../domain/city-npc";
import type { HouseDefinition } from "../../domain/house";
import type {
  MenuInstanceDefinition,
  MenuResourceDefinition,
} from "../../domain/menu";
import { matchesCanonicalBuildingOwnerId } from "../../core/runtime/building-owner-canonicalization";
import type {
  AppPresenterStageOutput,
  BuildingContainerViewModel,
} from "../presenter/presenter-output";

export type BuildingModuleEntryInput = {
  appState: AppState;
  cityDefinitions?: CityDefinition[] | undefined;
  houseDefinitions: HouseDefinition[];
  buildingArrangements?: BuildingArrangementDefinition[] | undefined;
  cityNpcPoolDefinitions: CityNpcPoolDefinition[];
  playerCharacterId: string;
  menuResourcesById?: Record<string, MenuResourceDefinition> | undefined;
  menuInstancesById?: Record<string, MenuInstanceDefinition> | undefined;
  textEntriesById?: Record<string, string> | undefined;
};

export type BuildingModuleStage =
  | Extract<AppPresenterStageOutput, { type: "building" }>
  | Extract<AppPresenterStageOutput, { type: "empty" }>;

function selectActiveHouseDefinition(
  appState: AppState,
  houseDefinitions: HouseDefinition[]
): HouseDefinition | null {
  return (
    houseDefinitions.find(
      (houseDefinition) =>
        houseDefinition.id === appState.gameState.world.currentHouseId
    ) ?? null
  );
}

function selectActiveBuildingArrangement(
  input: BuildingModuleEntryInput,
  activeHouse: HouseDefinition
): BuildingArrangementDefinition | null {
  const currentCityId = input.appState.gameState.world.currentCityId;
  if (currentCityId == null) {
    return null;
  }

  return (
    input.buildingArrangements?.find(
      (arrangement) =>
        arrangement.cityId === currentCityId &&
        matchesCanonicalBuildingOwnerId(arrangement.buildingId, activeHouse.id)
    ) ?? null
  );
}

function projectActiveHouseDefinition(input: {
  appState: AppState;
  cityDefinitions?: readonly CityDefinition[] | undefined;
  activeHouse: HouseDefinition;
  activeArrangement: BuildingArrangementDefinition;
}): HouseDefinition {
  const currentCityId = input.appState.gameState.world.currentCityId;
  if (currentCityId == null) {
    return input.activeHouse;
  }

  const currentCity =
    input.cityDefinitions?.find((cityDefinition) => cityDefinition.id === currentCityId) ??
    null;
  const currentCityName = currentCity?.name?.trim();
  const projectedBackAction =
    input.activeHouse.backAction?.targetView === "city" && currentCityName != null && currentCityName.length > 0
      ? {
          ...input.activeHouse.backAction,
          label: `返回${currentCityName}`,
        }
      : input.activeHouse.backAction;

  return {
    ...input.activeHouse,
    cityId: currentCityId,
    characterIds:
      input.activeArrangement.mountedNpcIds.length > 0
        ? [...input.activeArrangement.mountedNpcIds]
        : input.activeHouse.characterIds,
    defaultCharacterId:
      input.activeArrangement.primaryNpcId ?? input.activeHouse.defaultCharacterId,
    ...(projectedBackAction == null ? {} : { backAction: projectedBackAction }),
  };
}

function createContainerViewModels(
  activeHouse: HouseDefinition,
  arrangement: BuildingArrangementDefinition,
  input: BuildingModuleEntryInput
): BuildingContainerViewModel[] {
  const characterById = new Map(
    input.appState.characterDefinitions.map((character) => [character.id, character])
  );
  const buildingMenuActions = resolveBuildingMenuActions(activeHouse, input);

  return arrangement.containers.map((container) => {
    if (container.type === "character-seats") {
      const includedIds =
        container.source?.type === "arrangement-mounted-npcs"
          ? container.source.includeNpcIds ?? arrangement.mountedNpcIds
          : container.source?.type === "static-records"
            ? container.source.recordIds
            : arrangement.mountedNpcIds;
      const allowedMountedIds = new Set(arrangement.mountedNpcIds);
      return {
        id: container.id,
        type: "character-seats",
        ...(container.title == null ? {} : { title: container.title }),
        characters: includedIds.flatMap((characterId) => {
          if (!allowedMountedIds.has(characterId)) {
            return [];
          }
          const character = characterById.get(characterId);
          if (character == null) {
            return [];
          }
          return [
            {
              id: character.id,
              name: character.name,
              ...(character.title == null ? {} : { title: character.title }),
            },
          ];
        }),
      };
    }

    if (container.type === "action-menu") {
      return {
        id: container.id,
        type: "action-menu",
        ...(container.title == null ? {} : { title: container.title }),
        actions: buildingMenuActions,
      };
    }

    return {
      id: container.id,
      type: container.type,
      ...(container.title == null ? {} : { title: container.title }),
    };
  });
}

function resolveBuildingMenuActions(
  activeHouse: HouseDefinition,
  input: Pick<
    BuildingModuleEntryInput,
    "menuResourcesById" | "menuInstancesById"
  >
): Extract<BuildingContainerViewModel, { type: "action-menu" }>["actions"] {
  const menuResourcesById = input.menuResourcesById ?? {};
  const menuInstancesById = input.menuInstancesById ?? {};

  return readTrimmedStringArray(activeHouse.menuInstanceIds).flatMap(
    (menuInstanceId) => {
      const instance = menuInstancesById[menuInstanceId];
      if (instance == null) {
        return [];
      }
      const resource = menuResourcesById[instance.resourceId];
      if (resource == null) {
        return [];
      }

      return resource.entries.flatMap((entry) => {
        if (entry.isVisible === false || entry.targetFamily !== "event") {
          return [];
        }
        const eventId = entry.targetId.trim();
        if (eventId.length === 0) {
          return [];
        }
        return [
          {
            id: entry.id,
            label:
              entry.label.trim().length > 0
                ? entry.label
                : entry.menuFamily.trim().length > 0
                  ? entry.menuFamily
                  : entry.id,
            eventId,
            isVisible: true,
            isEnabled: entry.isEnabled !== false,
            ...(entry.disabledHint.trim().length === 0
              ? {}
              : { disabledHint: entry.disabledHint }),
          },
        ];
      });
    }
  );
}

function readTrimmedStringArray(values: readonly string[] | undefined): string[] {
  return (values ?? [])
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter((value) => value.length > 0);
}

export function selectBuildingModuleStage(
  input: BuildingModuleEntryInput
): BuildingModuleStage {
  const activeHouse = selectActiveHouseDefinition(
    input.appState,
    input.houseDefinitions
  );

  if (activeHouse == null) {
    return { type: "empty" };
  }

  const activeArrangement = selectActiveBuildingArrangement(input, activeHouse);
  if (activeArrangement != null) {
    return {
      type: "building",
      activeHouse: projectActiveHouseDefinition({
        appState: input.appState,
        cityDefinitions: input.cityDefinitions,
        activeHouse,
        activeArrangement,
      }),
      arrangement: activeArrangement,
      containerViewModels: createContainerViewModels(
        activeHouse,
        activeArrangement,
        input
      ),
    };
  }

  return { type: "empty" };
}
