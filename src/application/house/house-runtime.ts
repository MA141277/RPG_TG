import { getHouseModule } from "../house-modules/house-module-registry";
import type { AppState } from "../app-shell";
import type { HouseDefinition } from "../../domain/house";
import type {
  ActiveHouseModuleSession,
  HouseModuleId,
  HouseModuleRequest,
  HouseModuleSessionState,
  HouseModuleTransitionResult,
} from "../../domain/house-module";
import { assertExists } from "../../shared/assert";

type HouseRuntimeDependencies = {
  getAppState(): AppState;
  setAppState(appState: AppState): void;
  renderApp(): void;
  houseDefinitions: HouseDefinition[];
  playerCharacterId: string;
};

export type HouseRuntime = ReturnType<typeof createHouseRuntime>;

export function createHouseRuntime(dependencies: HouseRuntimeDependencies) {
  const intervalHandles: Record<string, number> = {};

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
  ): void {
    const appState = dependencies.getAppState();
    const houseSession =
      result.sessionState == null
        ? null
        : createActiveHouseSession(moduleId, result.sessionState);

    dependencies.setAppState({
      ...appState,
      gameState: {
        ...result.gameState,
        ui: {
          ...result.gameState.ui,
          houseSession,
        },
      },
      characterDefinitions: result.characterDefinitions,
    });

    applyHouseSideEffects(houseDefinition, moduleId, result.sideEffects ?? []);
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
    const houseModule = getHouseModule(moduleId);
    const result = houseModule.dispatch({
      gameState: appState.gameState,
      characterDefinitions: appState.characterDefinitions,
      houseDefinition: activeHouse,
      playerCharacterId: dependencies.playerCharacterId,
      sessionState: appState.gameState.ui.houseSession?.state ?? null,
      request,
    });

    applyHouseModuleResult(activeHouse, moduleId, result);
    dependencies.renderApp();
  }

  function applyHouseSideEffects(
    houseDefinition: HouseDefinition,
    moduleId: HouseModuleId,
    sideEffects: Array<{
      type: "start-interval" | "stop-interval";
      intervalId: string;
      everyMs?: number;
      request?: HouseModuleRequest;
    }>
  ): void {
    sideEffects.forEach((sideEffect) => {
      if (sideEffect.type === "stop-interval") {
        stopHouseInterval(sideEffect.intervalId);
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
        },
      },
    });

    const moduleId = houseDefinition.moduleId;
    if (moduleId != null) {
      const nextAppState = dependencies.getAppState();
      const houseModule = getHouseModule(moduleId);
      const result = houseModule.enter({
        gameState: nextAppState.gameState,
        characterDefinitions: nextAppState.characterDefinitions,
        houseDefinition,
        playerCharacterId: dependencies.playerCharacterId,
      });
      applyHouseModuleResult(houseDefinition, moduleId, result);
    }

    dependencies.renderApp();
  }

  function leaveCurrentHouse(): void {
    const activeHouse = getActiveHouseDefinition();
    if (activeHouse?.moduleId != null) {
      const appState = dependencies.getAppState();
      const houseModule = getHouseModule(activeHouse.moduleId);
      const result = houseModule.leave({
        gameState: appState.gameState,
        characterDefinitions: appState.characterDefinitions,
        houseDefinition: activeHouse,
        playerCharacterId: dependencies.playerCharacterId,
        sessionState: appState.gameState.ui.houseSession?.state ?? null,
      });
      applyHouseModuleResult(activeHouse, activeHouse.moduleId, result);
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
        },
      },
    });

    dependencies.renderApp();
  }

  return {
    clearAllHouseIntervals,
    dispatchCurrentHouseRequest,
    enterHouseById,
    getActiveHouseDefinition,
    leaveCurrentHouse,
  };
}
