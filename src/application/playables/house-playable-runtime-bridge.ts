import type { RuntimeState } from "../../core/contracts/runtime-state";
import type { GameState } from "../../domain/game-state";
import type {
  HouseModuleId,
  HouseModuleSessionState,
} from "../../domain/house-module";

export function createHousePlayableRuntimeState<
  ModuleId extends HouseModuleId,
>(input: {
  gameState: GameState;
  moduleId: ModuleId;
  sessionState: HouseModuleSessionState<ModuleId> | null;
}): RuntimeState {
  return {
    core: {
      ...input.gameState,
      ui: {
        ...input.gameState.ui,
        houseSession:
          input.sessionState == null
            ? null
            : ({
                moduleId: input.moduleId,
                state: input.sessionState,
              } as GameState["ui"]["houseSession"]),
      },
    },
    app: {
      beggingMiniGameState: null,
      autoAdvanceState: null,
      campaignTravelState: null,
      cityDirectoryState: null,
      cityMenuState: null,
      locationDialogueState: null,
      modalState: null,
    },
    view: {},
  };
}

export function readHousePlayableSessionState<
  ModuleId extends HouseModuleId,
>(state: RuntimeState, moduleId: ModuleId): HouseModuleSessionState<ModuleId> | null {
  const houseSession = state.core.ui.houseSession;
  if (houseSession?.moduleId !== moduleId) {
    return null;
  }

  return houseSession.state as HouseModuleSessionState<ModuleId>;
}
