import type { AppState } from "../app-shell";
import type { AppPresenterStageOutput } from "../presenter/presenter-output";
import { selectHouseEntryAccess } from "../story/story-stage-access";
import type { CityDefinition } from "../../domain/city";
import type {
  HouseAccessRefusalRule,
  HouseDefinition,
} from "../../domain/house";
import type { HouseActionViewModel } from "../../domain/house-module";
import type {
  HouseConversationCapabilitySnapshot,
  HouseConversationRoute,
  HouseConversationServiceCapability,
  HouseConversationNegotiableStoryNodeCapability,
} from "../../domain/house-conversation";
import type { WorldStoryNegotiationCapability } from "../../domain/world-intent";

type AvailabilityCandidate<T> = T & {
  available?: boolean;
};

type ServiceCapabilityCandidate = HouseConversationServiceCapability & {
  available?: boolean;
};

export type SelectHouseConversationCapabilitySnapshotInput = {
  cityId: string;
  houseId: string;
  moduleId?: string | null;
  targetCharacterId?: string | null;
  targetCharacterName?: string | null;
  switchableNpcTargets: Array<
    AvailabilityCandidate<HouseConversationCapabilitySnapshot["switchableNpcTargets"][number]>
  >;
  houseActions: Array<
    AvailabilityCandidate<HouseConversationCapabilitySnapshot["houseActions"][number]>
  >;
  houseServices: ServiceCapabilityCandidate[];
  reachableHouses: Array<
    AvailabilityCandidate<HouseConversationCapabilitySnapshot["reachableHouses"][number]>
  >;
  leaveAction?:
    | AvailabilityCandidate<NonNullable<HouseConversationCapabilitySnapshot["leaveAction"]>>
    | null;
  negotiableStoryNodes: Array<
    AvailabilityCandidate<HouseConversationNegotiableStoryNodeCapability>
  >;
};

type HouseConversationNegotiationSelectionInput = {
  appState: AppState;
  stageOutput: Extract<AppPresenterStageOutput, { type: "house" }>;
};

export type SelectHouseConversationCapabilitySnapshotForAppInput = {
  appState: AppState;
  stageOutput: AppPresenterStageOutput;
  cityDefinitions: CityDefinition[];
  houseDefinitions: HouseDefinition[];
  houseAccessRefusalRules: HouseAccessRefusalRule[];
  targetCharacterId?: string | null;
  selectNegotiableStoryNodes?:
    | ((
        input: HouseConversationNegotiationSelectionInput
      ) => WorldStoryNegotiationCapability[])
    | undefined;
  selectConversationServices?:
    | ((
        input: HouseConversationNegotiationSelectionInput
      ) => HouseConversationServiceCapability[])
    | undefined;
};

type ResolveAvailableHouseConversationRouteInput = {
  snapshot: HouseConversationCapabilitySnapshot;
  route: HouseConversationRoute;
  rawPlayerText?: string;
};

function isAvailable(value: { available?: boolean }): boolean {
  return value.available !== false;
}

function normalizeAvailable<T extends { available?: boolean }>(
  value: T
): Omit<T, "available"> & {
  available: true;
} {
  const { available: _available, ...rest } = value;
  return {
    ...rest,
    available: true,
  };
}

function isEnabledService(
  value: ServiceCapabilityCandidate
): boolean {
  return value.enabled !== false && value.available !== false;
}

function selectCurrentCityDefinition(
  cityDefinitions: CityDefinition[],
  appState: AppState
): CityDefinition | null {
  return (
    cityDefinitions.find(
      (cityDefinition) =>
        cityDefinition.id === appState.gameState.world.currentCityId
    ) ??
    cityDefinitions[0] ??
    null
  );
}

function isDismissLikeHouseAction(
  action: HouseActionViewModel,
  leaveActionId: string | null
): boolean {
  const normalizedId = action.id.toLowerCase();
  if (leaveActionId != null && action.id === leaveActionId) {
    return true;
  }

  return (
    normalizedId === "dismiss-dialogue" ||
    normalizedId === "close" ||
    normalizedId.endsWith(":close") ||
    action.label === "关闭" ||
    action.label.includes("退下") ||
    action.label.includes("离开")
  );
}

function selectCityHouseDefinitions(
  appState: AppState,
  cityDefinitions: CityDefinition[],
  houseDefinitions: HouseDefinition[],
  houseAccessRefusalRules: HouseAccessRefusalRule[]
) {
  const currentCityId = appState.gameState.world.currentCityId;
  const currentView = appState.gameState.ui.currentView;
  const currentHouseId = appState.gameState.world.currentHouseId;
  const currentCityDefinition =
    selectCurrentCityDefinition(cityDefinitions, appState);
  const currentCityHouseIds = new Set(currentCityDefinition?.houseIds ?? []);

  return houseDefinitions
    .filter(
      (houseDefinition) =>
        houseDefinition.cityId === currentCityId ||
        currentCityHouseIds.has(houseDefinition.id)
    )
    .map((houseDefinition) => {
      const accessResult = selectHouseEntryAccess(
        appState.gameState,
        appState.characterDefinitions,
        houseDefinition,
        houseAccessRefusalRules
      );
      const forceAvailable =
        currentView === "house" && currentHouseId === houseDefinition.id;

      return {
        houseId: houseDefinition.id,
        houseName: houseDefinition.name,
        available: forceAvailable || accessResult.canEnter,
      };
    });
}

function selectTalkTargetsForHouseStage(
  stageOutput: Extract<AppPresenterStageOutput, { type: "house" }>
) {
  if (stageOutput.moduleViewModel != null) {
    return stageOutput.moduleViewModel.standbyRoster.map((actor) => ({
      characterId: actor.characterId,
      characterName: actor.name,
      available: actor.disabled !== true,
    }));
  }

  return stageOutput.cityNpcSummaries.map((summary) => ({
    characterId: summary.id,
    characterName: summary.name,
    available: true,
  }));
}

function selectHouseActionsForHouseStage(
  stageOutput: Extract<AppPresenterStageOutput, { type: "house" }>
) {
  const moduleViewModel = stageOutput.moduleViewModel;
  if (moduleViewModel?.actionContainer == null) {
    return [];
  }

  const leaveActionId = moduleViewModel.leaveAction.id;
  return moduleViewModel.actionContainer.actions.map((action) => ({
    actionId: action.id,
    label: action.label,
    available:
      action.disabled !== true &&
      !isDismissLikeHouseAction(action, leaveActionId),
  }));
}

function selectLeaveActionForHouseStage(
  stageOutput: Extract<AppPresenterStageOutput, { type: "house" }>
) {
  if (stageOutput.moduleViewModel != null) {
    return {
      actionId: stageOutput.moduleViewModel.leaveAction.id,
      label: stageOutput.moduleViewModel.leaveAction.label,
      available: stageOutput.moduleViewModel.leaveAction.disabled !== true,
    };
  }

  return {
    actionId: "leave-house",
    label: `离开${stageOutput.activeHouse.name}`,
    available: true,
  };
}

export function selectHouseConversationCapabilitySnapshot(
  input: SelectHouseConversationCapabilitySnapshotInput
): HouseConversationCapabilitySnapshot {
  return {
    cityId: input.cityId,
    houseId: input.houseId,
    ...(input.moduleId == null ? {} : { moduleId: input.moduleId }),
    targetCharacterId: input.targetCharacterId ?? null,
    targetCharacterName: input.targetCharacterName ?? null,
    switchableNpcTargets: input.switchableNpcTargets
      .filter(isAvailable)
      .map((target) => normalizeAvailable(target)),
    houseActions: input.houseActions
      .filter(isAvailable)
      .map((action) => normalizeAvailable(action)),
    houseServices: input.houseServices.filter(isEnabledService),
    reachableHouses: input.reachableHouses
      .filter(isAvailable)
      .map((house) => normalizeAvailable(house)),
    leaveAction:
      input.leaveAction == null || !isAvailable(input.leaveAction)
        ? null
        : normalizeAvailable(input.leaveAction),
    negotiableStoryNodes: input.negotiableStoryNodes
      .filter(isAvailable)
      .map((node) => {
        const { available: _available, ...rest } = node;
        return rest;
      }),
  };
}

export function selectHouseConversationCapabilitySnapshotForApp(
  input: SelectHouseConversationCapabilitySnapshotForAppInput
): HouseConversationCapabilitySnapshot | null {
  if (input.stageOutput.type !== "house") {
    return null;
  }

  const talkTargets = selectTalkTargetsForHouseStage(input.stageOutput);
  const targetCharacterId = input.targetCharacterId ?? null;
  const targetCharacterName =
    (targetCharacterId == null
      ? null
      : talkTargets.find((target) => target.characterId === targetCharacterId)
          ?.characterName) ??
    (targetCharacterId == null
      ? null
      : input.appState.characterDefinitions.find(
          (characterDefinition) => characterDefinition.id === targetCharacterId
        )?.name) ??
    null;
  const currentHouseModuleId =
    input.stageOutput.moduleViewModel?.moduleId ??
    input.stageOutput.activeHouse.moduleId ??
    null;

  return selectHouseConversationCapabilitySnapshot({
    cityId: input.appState.gameState.world.currentCityId,
    houseId: input.stageOutput.activeHouse.id,
    ...(currentHouseModuleId == null
      ? {}
      : { moduleId: currentHouseModuleId }),
    targetCharacterId,
    targetCharacterName,
    switchableNpcTargets: talkTargets,
    houseActions: selectHouseActionsForHouseStage(input.stageOutput),
    houseServices:
      input.selectConversationServices?.({
        appState: input.appState,
        stageOutput: input.stageOutput,
      }) ?? [],
    reachableHouses: selectCityHouseDefinitions(
      input.appState,
      input.cityDefinitions,
      input.houseDefinitions,
      input.houseAccessRefusalRules
    ),
    leaveAction: selectLeaveActionForHouseStage(input.stageOutput),
    negotiableStoryNodes:
      input.selectNegotiableStoryNodes?.({
        appState: input.appState,
        stageOutput: input.stageOutput,
      }) ?? [],
  });
}

export function resolveAvailableHouseConversationRoute(
  input: ResolveAvailableHouseConversationRouteInput
): HouseConversationRoute | null {
  const route = input.route;

  switch (route.kind) {
    case "continue-dialogue":
      return {
        kind: "continue-dialogue",
      };
    case "switch-target-npc": {
      const matchedTarget =
        input.snapshot.switchableNpcTargets.find(
          (target) => target.characterId === route.characterId
        ) ?? null;
      return matchedTarget == null
        ? null
        : {
            kind: "switch-target-npc",
            characterId: matchedTarget.characterId,
          };
    }
    case "open-house-action": {
      const matchedAction =
        input.snapshot.houseActions.find(
          (action) => action.actionId === route.actionId
        ) ?? null;
      return matchedAction == null
        ? null
        : {
            kind: "open-house-action",
            actionId: matchedAction.actionId,
          };
    }
    case "settle-house-service": {
      const matchedService =
        input.snapshot.houseServices.find(
          (service) => service.serviceId === route.serviceId
        ) ?? null;
      const rawPlayerText =
        route.rawPlayerText.trim().length > 0
          ? route.rawPlayerText.trim()
          : input.rawPlayerText?.trim() ?? "";
      if (matchedService == null || rawPlayerText.length === 0) {
        return null;
      }

      return {
        kind: "settle-house-service",
        serviceId: matchedService.serviceId,
        rawPlayerText,
      };
    }
    case "go-to-house": {
      const matchedHouse =
        input.snapshot.reachableHouses.find(
          (house) => house.houseId === route.houseId
        ) ?? null;
      return matchedHouse == null
        ? null
        : {
            kind: "go-to-house",
            houseId: matchedHouse.houseId,
          };
    }
    case "leave-house":
      return input.snapshot.leaveAction == null
        ? null
        : {
            kind: "leave-house",
          };
    case "negotiate-story-node": {
      const matchedNode =
        input.snapshot.negotiableStoryNodes.find(
          (node) => node.nodeId === route.nodeId
        ) ?? null;
      if (matchedNode == null) {
        return null;
      }

      if (
        matchedNode.allowedApproaches != null &&
        !matchedNode.allowedApproaches.includes(route.approach)
      ) {
        return null;
      }

      return {
        kind: "negotiate-story-node",
        nodeId: matchedNode.nodeId,
        approach: route.approach,
        ...((route.targetCharacterId ?? matchedNode.targetCharacterId) ==
        null
          ? {}
          : {
              targetCharacterId:
                route.targetCharacterId ?? matchedNode.targetCharacterId,
            }),
      };
    }
    default:
      return null;
  }
}
