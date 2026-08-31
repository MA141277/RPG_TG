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
import type { GameState } from "../../domain/game-state";
import type { HouseDefinition } from "../../domain/house";
import type {
  ActiveHouseModuleSession,
  HouseMapAutoAdvanceCompletion,
  HouseModuleId,
  HouseModuleSessionState,
  HouseModuleSideEffect,
  HouseModuleTransitionResult,
  MapAutoAdvanceSnapshot,
} from "../../domain/house-module";
import type { SceneDefinition } from "../../domain/action";
import { assertExists } from "../../shared/assert";
import type { StorySettlementDefinition } from "../../application/story/story-settlement-continuation";
import type { TxtNarrativeProvider } from "../../domain/txt-narrative";
import type {
  ProgressTrackBinding,
  ProgressTrackDefinition,
} from "../contracts/progression-runtime";
import type { WorldObservedEvent } from "../../domain/world-intent";
import {
  builtinHouseModuleRegistry,
  type HouseModuleRegistry,
} from "../registry/house-module-registry";
import type {
  HouseRuntimeDispatchContext,
  HouseRuntimeRequest,
  HouseRuntimeSessionRequest,
} from "../contracts/house-runtime";
import type { RuntimeInteractiveSignal } from "../contracts/runtime-result";
import type { RuntimeState } from "../contracts/runtime-state";
import { createInteractiveRuntimeState } from "./state-sync-runtime";
import { settleRuntimeEffects } from "./runtime-settlement";

export type HouseRuntimeDependencies = {
  getAppState(): AppState;
  setAppState(appState: AppState): void;
  renderApp(): void;
  playCoinReward?(input: {
    playerCharacterId: string;
    delta: number;
    sourceClientX?: number;
    sourceClientY?: number;
  }): void;
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
  houseModuleRegistry?: HouseModuleRegistry | undefined;
  txtNarrativeProvider?: TxtNarrativeProvider | undefined;
  recordObservedEvents?(events: WorldObservedEvent[]): void;
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
  const intervalHandles: Record<
    string,
    ReturnType<typeof globalThis.setInterval>
  > = {};
  const txtNarrativeRequests = new Map<
    string,
    {
      requestId: string;
      hostHouseId: string;
      moduleId: HouseModuleId;
    }
  >();
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
    sessionState: HouseModuleSessionState<ModuleId>
  ): ActiveHouseModuleSession {
    return {
      moduleId,
      state: sessionState,
    } as ActiveHouseModuleSession;
  }

  function applyHouseModuleResult(
    houseDefinition: HouseDefinition,
    moduleId: HouseModuleId,
    result: HouseModuleTransitionResult<HouseModuleId>,
    requestContext?: HouseRuntimeDispatchContext
  ): boolean {
    const appState = dependencies.getAppState();
    const previousGameState = appState.gameState;
    const nextGameState = settleRuntimeEffects({
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
      effects: createHouseSettlementEffects(result.timeAdvanceCost),
      emittedBy: "house-runtime",
      appliedBy: "runtime-settlement",
    }).state.core;
    const houseSession =
      result.sessionState == null
        ? null
        : createActiveHouseSession(moduleId, result.sessionState);

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
    if ((result.observedEvents?.length ?? 0) > 0) {
      dependencies.recordObservedEvents?.(result.observedEvents ?? []);
    }

    applyHouseSideEffects(
      houseDefinition,
      moduleId,
      result.sideEffects ?? [],
      requestContext
    );
    return dependencies.syncCouncilPriorityAfterGameStateChange(
      previousGameState,
      result.councilArrivalNotice
    );
  }

  function createHouseSettlementEffects(
    timeAdvanceCost: number | undefined
  ): Array<{ type: "advanceTime"; days?: number; hours?: number }> {
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
        type: "advanceTime",
        ...(wholeDays > 0 ? { days: wholeDays } : {}),
        ...(remainderSegments > 0 ? { hours: remainderSegments } : {}),
      },
    ];
  }

  function dispatchCurrentHouseRequest(
    request: HouseRuntimeSessionRequest,
    requestContext?: HouseRuntimeDispatchContext
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
      activityDefinitionsById: dependencies.activityDefinitionsById,
      textEntriesById: dependencies.textEntriesById,
      request,
    });

    const councilTriggered = applyHouseModuleResult(
      activeHouse,
      moduleId,
      result,
      requestContext
    );
    if (!councilTriggered) {
      settleIndoorScreenStoryFollowUp();
      dependencies.renderApp();
    }
  }

  function cancelTxtNarrativeRequest(requestId: string): void {
    if (!txtNarrativeRequests.has(requestId)) {
      return;
    }

    txtNarrativeRequests.delete(requestId);
    void dependencies.txtNarrativeProvider?.cancel?.(requestId);
  }

  function clearAllTxtNarrativeRequests(): void {
    Array.from(txtNarrativeRequests.keys()).forEach((requestId) => {
      cancelTxtNarrativeRequest(requestId);
    });
  }

  function canDispatchTxtNarrativeEvent(input: {
    requestId: string;
    houseId: string;
    moduleId: HouseModuleId;
  }): boolean {
    const activeRequest = txtNarrativeRequests.get(input.requestId);
    if (
      activeRequest == null ||
      activeRequest.hostHouseId !== input.houseId ||
      activeRequest.moduleId !== input.moduleId
    ) {
      return false;
    }

    const activeHouse = getActiveHouseDefinition();
    return (
      activeHouse?.id === input.houseId && activeHouse.moduleId === input.moduleId
    );
  }

  function startTxtNarrativeStream(input: {
    houseDefinition: HouseDefinition;
    moduleId: HouseModuleId;
    requestId: string;
    payload: Extract<
      HouseModuleSideEffect,
      { type: "start-txt-narrative-stream" }
    >["payload"];
  }): void {
    txtNarrativeRequests.set(input.requestId, {
      requestId: input.requestId,
      hostHouseId: input.houseDefinition.id,
      moduleId: input.moduleId,
    });

    const provider = dependencies.txtNarrativeProvider;
    if (provider == null) {
      return;
    }

    const forwardEvent = (
      event: Extract<
        HouseRuntimeSessionRequest,
        { type: "txt-narrative-provider-event" }
      >["event"]
    ): void => {
      if (
        !canDispatchTxtNarrativeEvent({
          requestId: input.requestId,
          houseId: input.houseDefinition.id,
          moduleId: input.moduleId,
        })
      ) {
        return;
      }

      dispatchCurrentHouseRequest({
        type: "txt-narrative-provider-event",
        requestId: input.requestId,
        event,
      });

      if (event.type === "complete" || event.type === "error") {
        txtNarrativeRequests.delete(input.requestId);
      }
    };

    void Promise.resolve(
      provider.stream(input.payload, (event) => {
        if (event.requestId !== input.requestId) {
          return;
        }

        forwardEvent(event);
      })
    ).catch((error: unknown) => {
      const message =
        error instanceof Error ? error.message : "TXT narrative stream failed.";
      forwardEvent({
        type: "error",
        requestId: input.requestId,
        message,
      });
    });
  }

  function stopHouseInterval(intervalId: string): void {
    const handle = intervalHandles[intervalId];
    if (handle != null) {
      globalThis.clearInterval(handle);
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
    sideEffects: HouseModuleSideEffect[],
    requestContext?: HouseRuntimeDispatchContext
  ): void {
    sideEffects.forEach((sideEffect) => {
      if (sideEffect.type === "stop-interval") {
        stopHouseInterval(sideEffect.intervalId);
        return;
      }

      if (sideEffect.type === "play-coin-reward") {
        dependencies.playCoinReward?.({
          playerCharacterId: sideEffect.playerCharacterId,
          delta: sideEffect.delta,
          ...(requestContext?.pointer?.clientX == null
            ? {}
            : { sourceClientX: requestContext.pointer.clientX }),
          ...(requestContext?.pointer?.clientY == null
            ? {}
            : { sourceClientY: requestContext.pointer.clientY }),
        });
        return;
      }

      if (sideEffect.type === "stop-map-auto-advance") {
        dependencies.stopMapAutoAdvance(sideEffect.intervalId);
        return;
      }

      if (sideEffect.type === "cancel-txt-narrative-stream") {
        cancelTxtNarrativeRequest(sideEffect.requestId);
        return;
      }

      if (sideEffect.type === "start-txt-narrative-stream") {
        startTxtNarrativeStream({
          houseDefinition,
          moduleId,
          requestId: sideEffect.requestId,
          payload: sideEffect.payload,
        });
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
      intervalHandles[sideEffect.intervalId] = globalThis.setInterval(() => {
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

    clearAllTxtNarrativeRequests();
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
        activityDefinitionsById: dependencies.activityDefinitionsById,
        textEntriesById: dependencies.textEntriesById,
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
    clearAllTxtNarrativeRequests();
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
        activityDefinitionsById: dependencies.activityDefinitionsById,
        textEntriesById: dependencies.textEntriesById,
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

    clearAllTxtNarrativeRequests();
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

    dispatchCurrentHouseRequest(request.request, request.context);
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
  request: HouseRuntimeSessionRequest,
  context?: HouseRuntimeDispatchContext
): void {
  runtime.dispatch({
    type: "dispatch",
    request,
    ...(context == null ? {} : { context }),
  });
}
