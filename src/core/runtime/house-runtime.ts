import type { AppState } from "../../application/app-shell";
import {
  applyIndoorScreenStoryFollowUp,
  type IndoorScreenStoryFollowUpContent,
} from "../../application/runtime/indoor-screen-story-follow-up";
import { HOUSE_ACTIVITY_SEGMENTS_PER_DAY } from "../../application/house/house-activity-costs";
import {
  buildStoryTriggerInput,
  triggerStoryEvents,
} from "../../application/story/story-runtime";
import {
  applyStoryRuntimeResultToAppState,
  createStoryRuntimeDefinitionContext,
} from "../../application/story/story-runtime-state-bridge";
import type { ActivityDefinition } from "../../domain/activity";
import type { CityDefinition } from "../../domain/city";
import type { EventBinding, EventDefinition } from "../../domain/event";
import type { RuntimeDialogueDefinition } from "../../domain/dialogue";
import type { GameState } from "../../domain/game-state";
import type { HouseDefinition } from "../../domain/house";
import type { MeetingActionSetDefinition } from "../../domain/meeting/meeting-action-set";
import type { MeetingBindingDefinition } from "../../domain/meeting/meeting-binding";
import type { MeetingChoiceSetDefinition } from "../../domain/meeting/meeting-choice-set";
import type { MeetingDefinition } from "../../domain/meeting/meeting-definition";
import type { MeetingPanelDefinition } from "../../domain/meeting/meeting-panel";
import type {
  ActiveHouseModuleSession,
  HouseMapAutoAdvanceCompletion,
  HouseModuleId,
  HouseModuleSessionState,
  HouseModuleSideEffect,
  HouseSharedSessionState,
  HouseModuleTransitionResult,
  MapAutoAdvanceSnapshot,
} from "../../domain/house-module";
import type { SceneDefinition } from "../../domain/action";
import { assertExists } from "../../shared/assert";
import type { StorySettlementDefinition } from "../../application/story/story-settlement-continuation";
import type {
  ProgressTrackBinding,
  ProgressTrackDefinition,
} from "../contracts/progression-runtime";
import {
  builtinHouseModuleRegistry,
  type HouseModuleRegistry,
} from "../registry/house-module-registry";
import type {
  HouseRuntimeRequest,
  HouseRuntimeSessionRequest,
} from "../contracts/house-runtime";
import type { RuntimeInteractiveSignal } from "../contracts/runtime-result";
import type { RuntimeState } from "../contracts/runtime-state";
import type { SettlementCommand } from "../contracts/settlement-command";
import { createInteractiveRuntimeState } from "./state-sync-runtime";
import { settleRuntimeCommands } from "./runtime-settlement";

export type HouseRuntimeDependencies = {
  getAppState(): AppState;
  setAppState(appState: AppState): void;
  renderApp(): void;
  startMapAutoAdvance(input: {
    intervalId: string;
    everyMs: number;
    targetHouseId: string;
    label: string;
    snapshots?: MapAutoAdvanceSnapshot[];
    completion?: HouseMapAutoAdvanceCompletion;
  }): void;
  stopMapAutoAdvance(intervalId: string): void;
  houseDefinitions: HouseDefinition[];
  playerCharacterId: string;
  eventDefinitionsById: Record<string, EventDefinition>;
  sceneDefinitionsById: Record<string, SceneDefinition>;
  dialogueDefinitionsById?: Record<string, RuntimeDialogueDefinition> | undefined;
  meetingDefinitionsById?: Record<string, MeetingDefinition> | undefined;
  meetingBindings?: MeetingBindingDefinition[] | undefined;
  meetingPanelsById?: Record<string, MeetingPanelDefinition> | undefined;
  meetingChoiceSetsById?: Record<string, MeetingChoiceSetDefinition> | undefined;
  meetingActionSetsById?: Record<string, MeetingActionSetDefinition> | undefined;
  eventBindingsById?: Record<string, EventBinding> | undefined;
  activityDefinitionsById?: Record<string, ActivityDefinition> | undefined;
  settlementDefinitionsById?: Record<
    string,
    StorySettlementDefinition | undefined
  >;
  progressTrackDefinitionsById?:
    | Record<string, ProgressTrackDefinition>
    | undefined;
  progressTrackBindingsById?:
    | Record<string, ProgressTrackBinding>
    | undefined;
  cityDefinitionsById?: Record<string, CityDefinition> | undefined;
  houseDefinitionsById?: Record<string, HouseDefinition> | undefined;
  textEntriesById?: Record<string, string> | undefined;
  houseModuleDefaults?: Record<string, unknown> | undefined;
  houseModuleRegistry?: HouseModuleRegistry | undefined;
  syncCouncilPriorityAfterGameStateChange(
    previousGameState: GameState,
    councilArrivalNotice?: HouseModuleTransitionResult["councilArrivalNotice"]
  ): boolean;
};

export type HouseRuntimeBridge = {
  dispatch(request: HouseRuntimeRequest): void;
  applyInteractiveFollowUp(
    interactive: Exclude<NonNullable<RuntimeInteractiveSignal>, { type: "none" }>
  ): RuntimeState;
  applyMapAutoAdvanceCompletion(
    completion: HouseMapAutoAdvanceCompletion
  ): void;
  clearAllHouseIntervals(): void;
};

export function createHouseRuntimeBridge(
  dependencies: HouseRuntimeDependencies
): HouseRuntimeBridge {
  const intervalHandles: Record<string, number> = {};
  const houseModuleRegistry =
    dependencies.houseModuleRegistry ?? builtinHouseModuleRegistry;

  function getActiveHouseDefinition(): HouseDefinition | null {
    const appState = dependencies.getAppState();

    return (
      dependencies.houseDefinitions.find(
        (houseDefinition) =>
          houseDefinition.id === appState.gameState.world.currentHouseId
      ) ?? null
    );
  }

  function getIndoorScreenStoryContent(): IndoorScreenStoryFollowUpContent {
    return {
      eventDefinitionsById: dependencies.eventDefinitionsById,
      sceneDefinitionsById: dependencies.sceneDefinitionsById,
      ...(dependencies.eventBindingsById == null
        ? {}
        : { eventBindingsById: dependencies.eventBindingsById }),
      ...(dependencies.activityDefinitionsById == null
        ? {}
        : { activityDefinitionsById: dependencies.activityDefinitionsById }),
      ...(dependencies.settlementDefinitionsById == null
        ? {}
        : { settlementDefinitionsById: dependencies.settlementDefinitionsById }),
      ...(dependencies.progressTrackDefinitionsById == null
        ? {}
        : {
            progressTrackDefinitionsById:
              dependencies.progressTrackDefinitionsById,
          }),
      ...(dependencies.progressTrackBindingsById == null
        ? {}
        : {
            progressTrackBindingsById:
              dependencies.progressTrackBindingsById,
          }),
      ...(dependencies.cityDefinitionsById == null
        ? {}
        : { cityDefinitionsById: dependencies.cityDefinitionsById }),
      ...(dependencies.houseDefinitionsById == null
        ? {}
        : { houseDefinitionsById: dependencies.houseDefinitionsById }),
      ...(dependencies.textEntriesById == null
        ? {}
        : { textEntriesById: dependencies.textEntriesById }),
      ...(dependencies.houseModuleDefaults == null
        ? {}
        : { houseModuleDefaults: dependencies.houseModuleDefaults }),
    };
  }

  function settleIndoorScreenStoryFollowUp(): void {
    const nextAppState = applyIndoorScreenStoryFollowUp({
      appState: dependencies.getAppState(),
      content: getIndoorScreenStoryContent(),
    });

    if (nextAppState !== dependencies.getAppState()) {
      dependencies.setAppState(nextAppState);
    }
  }

  function createActiveHouseSession<ModuleId extends HouseModuleId>(
    moduleId: ModuleId,
    sessionState: HouseModuleSessionState<ModuleId>,
    sharedSessionState: HouseSharedSessionState | null
  ): ActiveHouseModuleSession {
    return {
      moduleId,
      state: sessionState,
      sharedSessionState,
    } as ActiveHouseModuleSession;
  }

  function applyHouseModuleResult(
    houseDefinition: HouseDefinition,
    moduleId: HouseModuleId,
    result: HouseModuleTransitionResult<HouseModuleId>
  ): boolean {
    const appState = dependencies.getAppState();
    const previousGameState = appState.gameState;
    const nextGameState = settleRuntimeCommands({
      state: {
        core: result.gameState,
        app: {
          beggingMiniGameState: appState.beggingMiniGameState,
          autoAdvanceState: appState.autoAdvanceState,
          campaignTravelState: appState.campaignTravelState,
          cityDirectoryState: appState.cityDirectoryState,
          cityMenuState: appState.cityMenuState,
          locationDialogueState: appState.locationDialogueState,
          modalState: appState.modalState,
        },
        view: {},
      },
      commands: createHouseSettlementCommands(result.timeAdvanceCost),
      emittedBy: "house-runtime",
      appliedBy: "runtime-settlement",
    }).state.core;
    const previousSharedSessionState =
      appState.gameState.ui.houseSession?.sharedSessionState ?? null;
    const sharedSessionState =
      result.sharedSessionState === undefined
        ? previousSharedSessionState
        : result.sharedSessionState;
    const houseSession =
      result.sessionState == null
        ? null
        : createActiveHouseSession(
            moduleId,
            result.sessionState,
            sharedSessionState
          );

    dependencies.setAppState({
      ...appState,
      gameState: {
        ...nextGameState,
        ui: {
          ...nextGameState.ui,
          houseSession,
          npcInteractionSession: null,
        },
      },
      characterDefinitions: result.characterDefinitions,
    });

    applyHouseSideEffects(houseDefinition, moduleId, result.sideEffects ?? []);
    return dependencies.syncCouncilPriorityAfterGameStateChange(
      previousGameState,
      result.councilArrivalNotice
    );
  }

  function createHouseSettlementCommands(
    timeAdvanceCost: number | undefined
  ): SettlementCommand[] {
    if (timeAdvanceCost == null || timeAdvanceCost <= 0) {
      return [];
    }

    const wholeDays = Math.floor(
      timeAdvanceCost / HOUSE_ACTIVITY_SEGMENTS_PER_DAY
    );
    const remainderSegments =
      timeAdvanceCost % HOUSE_ACTIVITY_SEGMENTS_PER_DAY;

    return [
      {
        type: "time.advance",
        ...(wholeDays > 0 ? { days: wholeDays } : {}),
        ...(remainderSegments > 0 ? { hours: remainderSegments } : {}),
      },
    ];
  }

  function dispatchCurrentHouseRequest(
    request: HouseRuntimeSessionRequest
  ): void {
    const activeHouse = getActiveHouseDefinition();
    const moduleId = activeHouse?.moduleId;
    if (activeHouse == null || moduleId == null) {
      return;
    }

    const appState = dependencies.getAppState();
    const houseModule = houseModuleRegistry.getModule(moduleId);
    assertExists(
      houseModule,
      `House module "${moduleId}" is not registered for runtime dispatch.`
    );
    const result = houseModule.dispatch({
      gameState: appState.gameState,
      characterDefinitions: appState.characterDefinitions,
      houseDefinition: activeHouse,
      playerCharacterId: dependencies.playerCharacterId,
      sessionState: appState.gameState.ui.houseSession?.state ?? null,
      sharedSessionState:
        appState.gameState.ui.houseSession?.sharedSessionState ?? null,
      eventDefinitionsById: dependencies.eventDefinitionsById,
      dialogueDefinitionsById: dependencies.dialogueDefinitionsById,
      meetingDefinitionsById: dependencies.meetingDefinitionsById,
      meetingBindings: dependencies.meetingBindings,
      meetingPanelsById: dependencies.meetingPanelsById,
      meetingChoiceSetsById: dependencies.meetingChoiceSetsById,
      meetingActionSetsById: dependencies.meetingActionSetsById,
      eventBindings:
        dependencies.eventBindingsById == null
          ? undefined
          : Object.values(dependencies.eventBindingsById),
      activityDefinitionsById: dependencies.activityDefinitionsById,
      textEntriesById: dependencies.textEntriesById,
      houseModuleDefaults: dependencies.houseModuleDefaults,
      request,
    });

    const councilTriggered = applyHouseModuleResult(activeHouse, moduleId, result);
    if (!councilTriggered) {
      settleIndoorScreenStoryFollowUp();
      dependencies.renderApp();
    }
  }

  function stopHouseInterval(intervalId: string): void {
    const handle = intervalHandles[intervalId];
    if (handle != null) {
      window.clearInterval(handle);
      delete intervalHandles[intervalId];
    }
  }

  function clearAllHouseIntervals(): void {
    Object.keys(intervalHandles).forEach((intervalId) => {
      stopHouseInterval(intervalId);
    });
  }

  function applyHouseSideEffects(
    houseDefinition: HouseDefinition,
    moduleId: HouseModuleId,
    sideEffects: HouseModuleSideEffect[]
  ): void {
    sideEffects.forEach((sideEffect) => {
      if (sideEffect.type === "stop-interval") {
        stopHouseInterval(sideEffect.intervalId);
        return;
      }

      if (sideEffect.type === "stop-map-auto-advance") {
        dependencies.stopMapAutoAdvance(sideEffect.intervalId);
        return;
      }

      if (sideEffect.type === "start-map-auto-advance") {
        dependencies.startMapAutoAdvance({
          intervalId: sideEffect.intervalId,
          everyMs: sideEffect.everyMs,
          targetHouseId: sideEffect.targetHouseId,
          label: sideEffect.label,
          ...(sideEffect.snapshots == null
            ? {}
            : { snapshots: sideEffect.snapshots }),
          ...(sideEffect.completion == null
            ? {}
            : { completion: sideEffect.completion }),
        });
        return;
      }

      stopHouseInterval(sideEffect.intervalId);
      intervalHandles[sideEffect.intervalId] = window.setInterval(() => {
        const activeHouse = getActiveHouseDefinition();
        if (
          activeHouse?.id !== houseDefinition.id ||
          activeHouse.moduleId !== moduleId
        ) {
          stopHouseInterval(sideEffect.intervalId);
          return;
        }

        dispatchCurrentHouseRequest(sideEffect.request);
      }, sideEffect.everyMs);
    });
  }

  function enterHouseById(
    houseId: string,
    options?: {
      render?: boolean;
    }
  ): void {
    const houseDefinition = dependencies.houseDefinitions.find(
      (candidateHouse) => candidateHouse.id === houseId
    );
    assertExists(houseDefinition, `House not found for id "${houseId}".`);

    clearAllHouseIntervals();

    const appState = dependencies.getAppState();
    dependencies.setAppState({
      ...appState,
      gameState: {
        ...appState.gameState,
        world: {
          ...appState.gameState.world,
          currentHouseId: houseId,
        },
        ui: {
          ...appState.gameState.ui,
          currentView: "house",
          overlayView: null,
          houseSession: null,
          npcInteractionSession: null,
        },
      },
    });

    const moduleId = houseDefinition.moduleId;
    if (moduleId != null) {
      const nextAppState = dependencies.getAppState();
      const houseModule = houseModuleRegistry.getModule(moduleId);
      assertExists(
        houseModule,
        `House module "${moduleId}" is not registered for house entry.`
      );
      const result = houseModule.enter({
        gameState: nextAppState.gameState,
        characterDefinitions: nextAppState.characterDefinitions,
        houseDefinition,
        playerCharacterId: dependencies.playerCharacterId,
        sharedSessionState:
          nextAppState.gameState.ui.houseSession?.sharedSessionState ?? null,
        eventDefinitionsById: dependencies.eventDefinitionsById,
        dialogueDefinitionsById: dependencies.dialogueDefinitionsById,
        meetingDefinitionsById: dependencies.meetingDefinitionsById,
        meetingBindings: dependencies.meetingBindings,
        meetingPanelsById: dependencies.meetingPanelsById,
        meetingChoiceSetsById: dependencies.meetingChoiceSetsById,
        meetingActionSetsById: dependencies.meetingActionSetsById,
        eventBindings:
          dependencies.eventBindingsById == null
            ? undefined
            : Object.values(dependencies.eventBindingsById),
        activityDefinitionsById: dependencies.activityDefinitionsById,
        textEntriesById: dependencies.textEntriesById,
        houseModuleDefaults: dependencies.houseModuleDefaults,
      });
      applyHouseModuleResult(houseDefinition, moduleId, result);
    }

    const storyResult = triggerStoryEvents(
      {
        state: dependencies.getAppState().gameState,
        characterDefinitions: dependencies.getAppState().characterDefinitions,
        ...createStoryRuntimeDefinitionContext(
          dependencies.getAppState(),
          getIndoorScreenStoryContent()
        ),
      },
      {
        eventDefinitionsById: dependencies.eventDefinitionsById,
        sceneDefinitionsById: dependencies.sceneDefinitionsById,
        eventBindingsById: dependencies.eventBindingsById,
        activityDefinitionsById: dependencies.activityDefinitionsById,
        settlementDefinitionsById: dependencies.settlementDefinitionsById,
        progressTrackDefinitionsById:
          dependencies.progressTrackDefinitionsById,
        progressTrackBindingsById: dependencies.progressTrackBindingsById,
        cityDefinitionsById: dependencies.cityDefinitionsById,
        houseDefinitionsById: dependencies.houseDefinitionsById,
        textEntriesById: dependencies.textEntriesById,
      },
      buildStoryTriggerInput("house-enter", {
        ...dependencies.getAppState().gameState,
        world: {
          ...dependencies.getAppState().gameState.world,
          currentCityId: houseDefinition.cityId,
          currentHouseId: houseDefinition.id,
        },
      })
    );

    const indoorStoryContent = getIndoorScreenStoryContent();
    if (
      storyResult.state !== dependencies.getAppState().gameState ||
      storyResult.characterDefinitions !==
        dependencies.getAppState().characterDefinitions
    ) {
      const latestAppState = dependencies.getAppState();
      dependencies.setAppState(
        applyStoryRuntimeResultToAppState(
          latestAppState,
          indoorStoryContent,
          storyResult
        )
      );
    }

    settleIndoorScreenStoryFollowUp();

    if (options?.render !== false) {
      dependencies.renderApp();
    }
  }

  function leaveCurrentHouse(): void {
    const activeHouse = getActiveHouseDefinition();
    if (activeHouse?.moduleId != null) {
      const appState = dependencies.getAppState();
      const houseModule = houseModuleRegistry.getModule(activeHouse.moduleId);
      assertExists(
        houseModule,
        `House module "${activeHouse.moduleId}" is not registered for house leave.`
      );
      const result = houseModule.leave({
        gameState: appState.gameState,
        characterDefinitions: appState.characterDefinitions,
        houseDefinition: activeHouse,
        playerCharacterId: dependencies.playerCharacterId,
        sessionState: appState.gameState.ui.houseSession?.state ?? null,
        sharedSessionState:
          appState.gameState.ui.houseSession?.sharedSessionState ?? null,
        eventDefinitionsById: dependencies.eventDefinitionsById,
        dialogueDefinitionsById: dependencies.dialogueDefinitionsById,
        meetingDefinitionsById: dependencies.meetingDefinitionsById,
        meetingBindings: dependencies.meetingBindings,
        meetingPanelsById: dependencies.meetingPanelsById,
        meetingChoiceSetsById: dependencies.meetingChoiceSetsById,
        meetingActionSetsById: dependencies.meetingActionSetsById,
        eventBindings:
          dependencies.eventBindingsById == null
            ? undefined
            : Object.values(dependencies.eventBindingsById),
        activityDefinitionsById: dependencies.activityDefinitionsById,
        textEntriesById: dependencies.textEntriesById,
        houseModuleDefaults: dependencies.houseModuleDefaults,
      });
      const councilTriggered = applyHouseModuleResult(
        activeHouse,
        activeHouse.moduleId,
        result
      );

      if (result.navigation?.type === "stay-in-house") {
        if (!councilTriggered) {
          dependencies.renderApp();
        }
        return;
      }
    } else {
      clearAllHouseIntervals();
    }

    const appState = dependencies.getAppState();
    dependencies.setAppState({
      ...appState,
      gameState: {
        ...appState.gameState,
        world: {
          ...appState.gameState.world,
          currentHouseId: null,
        },
        ui: {
          ...appState.gameState.ui,
          currentView: "city",
          overlayView: null,
          houseSession: null,
          npcInteractionSession: null,
        },
      },
    });

    dependencies.renderApp();
  }

  function applyMapAutoAdvanceCompletion(
    completion: HouseMapAutoAdvanceCompletion
  ): void {
    if (completion.type === "enter-house") {
      enterHouseById(completion.houseId);
      return;
    }

    clearAllHouseIntervals();
    const appState = dependencies.getAppState();
    dependencies.setAppState({
      ...appState,
      gameState: {
        ...appState.gameState,
        world: {
          ...appState.gameState.world,
          currentHouseId: completion.houseId,
        },
        ui: {
          ...appState.gameState.ui,
          currentView: "house",
          overlayView: null,
          houseSession: completion.houseSession,
          npcInteractionSession: null,
        },
      },
    });
    settleIndoorScreenStoryFollowUp();
    dependencies.renderApp();
  }

  function dispatch(request: HouseRuntimeRequest): void {
    if (request.type === "enter") {
      enterHouseById(request.houseId);
      return;
    }

    if (request.type === "leave") {
      leaveCurrentHouse();
      return;
    }

    dispatchCurrentHouseRequest(request.request);
  }

  function applyInteractiveFollowUp(
    interactive: Exclude<NonNullable<RuntimeInteractiveSignal>, { type: "none" }>
  ): RuntimeState {
    if (interactive.type === "reenter-house") {
      enterHouseById(interactive.houseId, { render: false });
    }

    return createInteractiveRuntimeState(dependencies.getAppState());
  }

  return {
    dispatch,
    applyInteractiveFollowUp,
    applyMapAutoAdvanceCompletion,
    clearAllHouseIntervals,
  };
}

export function enterHouseThroughRuntime(
  runtime: HouseRuntimeBridge,
  houseId: string
): void {
  runtime.dispatch({
    type: "enter",
    houseId,
  });
}

export function leaveHouseThroughRuntime(runtime: HouseRuntimeBridge): void {
  runtime.dispatch({
    type: "leave",
  });
}

export function dispatchHouseRuntimeRequest(
  runtime: HouseRuntimeBridge,
  request: HouseRuntimeSessionRequest
): void {
  runtime.dispatch({
    type: "dispatch",
    request,
  });
}
