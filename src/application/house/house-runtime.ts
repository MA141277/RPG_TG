import type { AppState } from "../app-shell";
import type { HouseDefinition } from "../../domain/house";
import type { EventDefinition } from "../../domain/event";
import type { SceneDefinition } from "../../domain/action";
import type { ActivityDefinition } from "../../domain/activity";
import type { GameState } from "../../domain/game-state";
import type {
  ActiveHouseModuleSession,
  HouseMapAutoAdvanceCompletion,
  HouseModuleId,
  MapAutoAdvanceSnapshot,
  HouseModuleTransitionResult,
  HouseModuleRequest,
  HouseModuleSessionState,
} from "../../domain/house-module";
import { triggerStoryEvents } from "../story/story-runtime";
import { advanceGameStateTimeSegments } from "../time/time-progression";
import { assertExists } from "../../shared/assert";
import {
  builtinHouseModuleRegistry,
  type HouseModuleRegistry,
} from "../../core/registry/house-module-registry";

type HouseRuntimeDependencies = {
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
  activityDefinitionsById?: Record<string, ActivityDefinition> | undefined;
  textEntriesById?: Record<string, string> | undefined;
  houseModuleRegistry?: HouseModuleRegistry | undefined;
  syncCouncilPriorityAfterGameStateChange(
    previousGameState: GameState,
    councilArrivalNotice?: HouseModuleTransitionResult["councilArrivalNotice"]
  ): boolean;
};

export type HouseRuntime = ReturnType<typeof createHouseRuntime>;

export function createHouseRuntime(dependencies: HouseRuntimeDependencies) {
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

  function applyHouseModuleResult(
    houseDefinition: HouseDefinition,
    moduleId: HouseModuleId,
    result: HouseModuleTransitionResult<HouseModuleId>
  ): boolean {
    const appState = dependencies.getAppState();
    const previousGameState = appState.gameState;
    const nextGameState =
      result.timeAdvanceCost == null || result.timeAdvanceCost <= 0
        ? result.gameState
        : advanceGameStateTimeSegments(result.gameState, result.timeAdvanceCost);
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

  function createActiveHouseSession<ModuleId extends HouseModuleId>(
    moduleId: ModuleId,
    sessionState: HouseModuleSessionState<ModuleId>
  ): ActiveHouseModuleSession {
    return {
      moduleId,
      state: sessionState,
    } as ActiveHouseModuleSession;
  }

  function dispatchCurrentHouseRequest(request: HouseModuleRequest): void {
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

    const councilTriggered = applyHouseModuleResult(activeHouse, moduleId, result);
    if (!councilTriggered) {
      dependencies.renderApp();
    }
  }

  function applyHouseSideEffects(
    houseDefinition: HouseDefinition,
    moduleId: HouseModuleId,
    sideEffects: Array<{
      type:
        | "start-interval"
        | "stop-interval"
        | "start-map-auto-advance"
        | "stop-map-auto-advance";
      intervalId: string;
      everyMs?: number;
      request?: HouseModuleRequest;
      targetHouseId?: string;
      label?: string;
      snapshots?: MapAutoAdvanceSnapshot[];
      completion?: HouseMapAutoAdvanceCompletion;
    }>
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
        if (
          sideEffect.everyMs == null ||
          sideEffect.targetHouseId == null ||
          sideEffect.label == null
        ) {
          return;
        }

        dependencies.startMapAutoAdvance({
          intervalId: sideEffect.intervalId,
          everyMs: sideEffect.everyMs,
          targetHouseId: sideEffect.targetHouseId,
          label: sideEffect.label,
          ...(sideEffect.snapshots == null ? {} : { snapshots: sideEffect.snapshots }),
          ...(sideEffect.completion == null
            ? {}
            : { completion: sideEffect.completion }),
        });
        return;
      }

      if (sideEffect.everyMs == null || sideEffect.request == null) {
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

        const request = sideEffect.request;
        if (request == null) {
          stopHouseInterval(sideEffect.intervalId);
          return;
        }

        dispatchCurrentHouseRequest(request);
      }, sideEffect.everyMs);
    });
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

  function enterHouseById(houseId: string): void {
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
        activityDefinitionsById: dependencies.activityDefinitionsById,
        textEntriesById: dependencies.textEntriesById,
      });
      applyHouseModuleResult(houseDefinition, moduleId, result);
    }

    const storyResult = triggerStoryEvents(
      {
        state: dependencies.getAppState().gameState,
        characterDefinitions: dependencies.getAppState().characterDefinitions,
      },
      {
        eventDefinitionsById: dependencies.eventDefinitionsById,
        sceneDefinitionsById: dependencies.sceneDefinitionsById,
        activityDefinitionsById: dependencies.activityDefinitionsById,
        textEntriesById: dependencies.textEntriesById,
      },
      {
        timing: "house-enter",
        cityId: houseDefinition.cityId,
        houseId: houseDefinition.id,
      }
    );

    if (storyResult.state !== dependencies.getAppState().gameState) {
      const latestAppState = dependencies.getAppState();
      dependencies.setAppState({
        ...latestAppState,
        gameState: storyResult.state,
        characterDefinitions: storyResult.characterDefinitions,
      });
    }

    dependencies.renderApp();
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
    dependencies.renderApp();
  }

  return {
    applyMapAutoAdvanceCompletion,
    clearAllHouseIntervals,
    dispatchCurrentHouseRequest,
    enterHouseById,
    getActiveHouseDefinition,
    leaveCurrentHouse,
  };
}
