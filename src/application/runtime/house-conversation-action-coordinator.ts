import type { AppState } from "../app-shell";
import type { AppPresenterStageOutput } from "../presenter/presenter-output";
import {
  selectHouseConversationCapabilitySnapshotForApp,
} from "../house-conversation/select-house-conversation-capability-snapshot";
import type { CityDefinition } from "../../domain/city";
import type {
  HouseAccessRefusalRule,
  HouseDefinition,
} from "../../domain/house";
import type {
  HouseConversationCapabilitySnapshot,
  HouseConversationPilotState,
  HouseConversationRoute,
  HouseConversationServiceCapability,
} from "../../domain/house-conversation";
import type { NpcInteractionContext } from "../../domain/npc-interaction";
import type { WorldStoryNegotiationCapability } from "../../domain/world-intent";
import { selectHaozhouHouseConversationPilotState } from "../house-conversation/haozhou-house-conversation-policy";

type ForwardedNpcAction =
  | { type: "close" }
  | { type: "select-option"; optionId: string }
  | { type: "advance-page" }
  | { type: "open-custom-input" }
  | { type: "cancel-custom-input" }
  | { type: "submit-custom" };

export type HouseConversationCoordinatorDependencies = {
  getAppState(): AppState;
  setAppState(appState: AppState): void;
  getStageOutput(): AppPresenterStageOutput;
  renderApp(): void;
  cityDefinitions?: CityDefinition[] | undefined;
  houseDefinitions?: HouseDefinition[] | undefined;
  houseAccessRefusalRules?: HouseAccessRefusalRule[] | undefined;
  openNpcTalk?(input: {
    targetCharacterId: string;
    context: NpcInteractionContext | null;
  }): void;
  dispatchHouseAction?(actionId: string): void;
  dispatchHouseConversationService?:
    | ((
        input: {
          serviceId: string;
          rawPlayerText: string;
          targetCharacterId?: string | null;
        }
      ) => void)
    | undefined;
  enterHouse?(houseId: string): void;
  leaveHouse?(): void;
  dispatchNpcRuntimeAction?(request: ForwardedNpcAction): void;
  closeActiveRequest?(): void;
  openNpcProfile?(characterId: string): void;
  selectNegotiableStoryNodes?:
    | ((
        input: {
          appState: AppState;
          stageOutput: Extract<AppPresenterStageOutput, { type: "house" }>;
        }
      ) => WorldStoryNegotiationCapability[])
    | undefined;
  selectConversationServices?:
    | ((
        input: {
          appState: AppState;
          stageOutput: Extract<AppPresenterStageOutput, { type: "house" }>;
        }
      ) => HouseConversationServiceCapability[])
    | undefined;
  negotiateStoryNode?:
    | ((
        input: {
          nodeId: string;
          targetCharacterId?: string | null;
          approach: Extract<
            HouseConversationRoute,
            { kind: "negotiate-story-node" }
          >["approach"];
        }
      ) => void)
    | undefined;
};

export type HouseConversationActionCoordinator = {
  selectPilotState(): HouseConversationPilotState;
  selectCapabilitySnapshot(input?: {
    targetCharacterId?: string | null;
  }): HouseConversationCapabilitySnapshot | null;
  syncFromStage(): void;
  handleNpcTargetClick(input: {
    characterId: string;
    context: NpcInteractionContext | null;
  }): void;
  handleNpcAction(input: {
    action:
      | "close"
      | "select-option"
      | "advance-page"
      | "open-custom-input"
      | "cancel-custom-input"
      | "submit-custom"
      | "profile"
      | "talk";
    optionId?: string;
    characterId?: string;
  }): void;
  closeActiveRequest(): void;
  dispatchResolvedRoute(route: HouseConversationRoute): boolean;
  handleHouseConversationAction(actionId: string): boolean;
};

function resolveHouseContext(
  stageOutput: AppPresenterStageOutput,
  pilotState: HouseConversationPilotState
): NpcInteractionContext | null {
  if (stageOutput.type !== "house" || pilotState.houseId == null) {
    return null;
  }

  return {
    type: "house",
    houseId: pilotState.houseId,
    moduleId:
      stageOutput.activeHouse.moduleId ??
      stageOutput.moduleViewModel?.moduleId ??
      null,
  };
}

function buildPilotKey(pilotState: HouseConversationPilotState): string | null {
  if (
    !pilotState.enabled ||
    pilotState.houseId == null ||
    pilotState.defaultTargetCharacterId == null
  ) {
    return null;
  }

  return `${pilotState.houseId}:${pilotState.defaultTargetCharacterId}`;
}

export function createHouseConversationActionCoordinator(
  dependencies: HouseConversationCoordinatorDependencies
): HouseConversationActionCoordinator {
  let lastAutoStartedPilotKey: string | null = null;

  function selectPilotState(): HouseConversationPilotState {
    return selectHaozhouHouseConversationPilotState({
      appState: dependencies.getAppState(),
      stageOutput: dependencies.getStageOutput(),
    });
  }

  function selectCapabilitySnapshot(input?: {
    targetCharacterId?: string | null;
  }): HouseConversationCapabilitySnapshot | null {
    const stageOutput = dependencies.getStageOutput();
    if (stageOutput.type !== "house") {
      return null;
    }

    const appState = dependencies.getAppState();
    const currentTargetCharacterId =
      input?.targetCharacterId ??
      appState.gameState.ui.npcInteractionSession?.targetCharacterId ??
      selectPilotState().defaultTargetCharacterId;

    return selectHouseConversationCapabilitySnapshotForApp({
      appState,
      stageOutput,
      cityDefinitions: dependencies.cityDefinitions ?? [],
      houseDefinitions: dependencies.houseDefinitions ?? [],
      houseAccessRefusalRules: dependencies.houseAccessRefusalRules ?? [],
      ...(currentTargetCharacterId == null
        ? {}
        : { targetCharacterId: currentTargetCharacterId }),
      ...(dependencies.selectNegotiableStoryNodes == null
        ? {}
        : {
            selectNegotiableStoryNodes: dependencies.selectNegotiableStoryNodes,
          }),
      ...(dependencies.selectConversationServices == null
        ? {}
        : {
            selectConversationServices: dependencies.selectConversationServices,
          }),
    });
  }

  function syncFromStage(): void {
    const stageOutput = dependencies.getStageOutput();
    const pilotState = selectHaozhouHouseConversationPilotState({
      appState: dependencies.getAppState(),
      stageOutput,
    });
    const defaultTargetCharacterId = pilotState.defaultTargetCharacterId;
    const pilotKey = buildPilotKey(pilotState);

    if (pilotKey == null || defaultTargetCharacterId == null) {
      lastAutoStartedPilotKey = null;
      return;
    }

    const activeSession = dependencies.getAppState().gameState.ui.npcInteractionSession;
    const sessionMatchesPilot =
      activeSession != null &&
      activeSession.context.type === "house" &&
      activeSession.context.houseId === pilotState.houseId &&
      activeSession.targetCharacterId === pilotState.defaultTargetCharacterId;

    if (sessionMatchesPilot) {
      lastAutoStartedPilotKey = pilotKey;
      return;
    }

    if (lastAutoStartedPilotKey === pilotKey) {
      return;
    }

    lastAutoStartedPilotKey = pilotKey;
    dependencies.openNpcTalk?.({
      targetCharacterId: defaultTargetCharacterId,
      context: resolveHouseContext(stageOutput, pilotState),
    });
  }

  function handleNpcTargetClick(input: {
    characterId: string;
    context: NpcInteractionContext | null;
  }): void {
    if (input.context == null) {
      return;
    }

    dependencies.openNpcTalk?.({
      targetCharacterId: input.characterId,
      context: input.context,
    });
  }

  function handleNpcAction(input: {
    action:
      | "close"
      | "select-option"
      | "advance-page"
      | "open-custom-input"
      | "cancel-custom-input"
      | "submit-custom"
      | "profile"
      | "talk";
    optionId?: string;
    characterId?: string;
  }): void {
    if (input.action === "profile") {
      if (input.characterId != null) {
        dependencies.openNpcProfile?.(input.characterId);
      }
      return;
    }

    if (input.action === "talk") {
      if (input.characterId == null) {
        return;
      }

      const stageOutput = dependencies.getStageOutput();
      const pilotState = selectPilotState();
      dependencies.openNpcTalk?.({
        targetCharacterId: input.characterId,
        context: resolveHouseContext(stageOutput, pilotState),
      });
      return;
    }

    if (input.action === "select-option") {
      if (input.optionId == null || input.optionId.length === 0) {
        return;
      }

      dependencies.dispatchNpcRuntimeAction?.({
        type: "select-option",
        optionId: input.optionId,
      });
      return;
    }

    dependencies.dispatchNpcRuntimeAction?.({
      type: input.action,
    });
  }

  function closeActiveRequest(): void {
    dependencies.closeActiveRequest?.();
  }

  function dispatchResolvedRoute(route: HouseConversationRoute): boolean {
    if (route.kind === "continue-dialogue") {
      return true;
    }

    if (route.kind === "switch-target-npc") {
      const stageOutput = dependencies.getStageOutput();
      const pilotState = selectPilotState();
      const context = resolveHouseContext(stageOutput, pilotState);
      if (context == null) {
        return false;
      }

      dependencies.closeActiveRequest?.();
      dependencies.openNpcTalk?.({
        targetCharacterId: route.characterId,
        context,
      });
      return true;
    }

    if (route.kind === "open-house-action") {
      if (dependencies.dispatchHouseAction == null) {
        return false;
      }

      dependencies.closeActiveRequest?.();
      dependencies.dispatchHouseAction(route.actionId);
      return true;
    }

    if (route.kind === "settle-house-service") {
      if (dependencies.dispatchHouseConversationService == null) {
        return false;
      }

      const targetCharacterId =
        dependencies.getAppState().gameState.ui.npcInteractionSession
          ?.targetCharacterId ?? null;
      dependencies.closeActiveRequest?.();
      dependencies.dispatchHouseConversationService({
        serviceId: route.serviceId,
        rawPlayerText: route.rawPlayerText,
        targetCharacterId,
      });
      return true;
    }

    if (route.kind === "go-to-house") {
      if (dependencies.enterHouse == null) {
        return false;
      }

      dependencies.closeActiveRequest?.();
      dependencies.enterHouse(route.houseId);
      return true;
    }

    if (route.kind === "leave-house") {
      if (dependencies.leaveHouse == null) {
        return false;
      }

      dependencies.closeActiveRequest?.();
      dependencies.leaveHouse();
      return true;
    }

    if (route.kind === "negotiate-story-node") {
      if (dependencies.negotiateStoryNode == null) {
        return false;
      }

      dependencies.closeActiveRequest?.();
      dependencies.negotiateStoryNode({
        nodeId: route.nodeId,
        approach: route.approach,
        ...(route.targetCharacterId === undefined
          ? {}
          : { targetCharacterId: route.targetCharacterId }),
      });
      return true;
    }

    return false;
  }

  function handleHouseConversationAction(actionId: string): boolean {
    void actionId;
    return false;
  }

  void dependencies.setAppState;
  void dependencies.renderApp;

  return {
    selectPilotState,
    selectCapabilitySnapshot,
    syncFromStage,
    handleNpcTargetClick,
    handleNpcAction,
    closeActiveRequest,
    dispatchResolvedRoute,
    handleHouseConversationAction,
  };
}
