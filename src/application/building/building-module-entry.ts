import type { AppState } from "../app-shell";
import { selectCityNpcSummariesForHouse } from "../city-npcs/select-city-npcs-for-house";
import {
  builtinHouseModuleRegistry,
  type HouseModuleRegistry,
} from "../house-modules/house-module-registry";
import type { CityNpcPoolDefinition } from "../../domain/city-npc";
import type { HouseDefinition } from "../../domain/house";
import type { AppPresenterStageOutput } from "../presenter/presenter-output";

export type BuildingModuleEntryInput = {
  appState: AppState;
  houseDefinitions: HouseDefinition[];
  cityNpcPoolDefinitions: CityNpcPoolDefinition[];
  playerCharacterId: string;
  textEntriesById?: Record<string, string> | undefined;
  houseModuleRegistry?: HouseModuleRegistry | undefined;
};

export type BuildingModuleStage =
  | Extract<AppPresenterStageOutput, { type: "house" }>
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

export function selectBuildingModuleStage(
  input: BuildingModuleEntryInput
): BuildingModuleStage {
  const houseModuleRegistry =
    input.houseModuleRegistry ?? builtinHouseModuleRegistry;
  const activeHouse = selectActiveHouseDefinition(
    input.appState,
    input.houseDefinitions
  );

  if (activeHouse == null) {
    return { type: "empty" };
  }

  if (activeHouse.moduleId != null) {
    const houseModule = houseModuleRegistry.getModule(activeHouse.moduleId);
    return {
      type: "house",
      activeHouse,
      moduleViewModel:
        houseModule == null
          ? null
          : houseModule.selectViewModel({
              gameState: input.appState.gameState,
              characterDefinitions: input.appState.characterDefinitions,
              houseDefinition: activeHouse,
              playerCharacterId: input.playerCharacterId,
              sessionState:
                input.appState.gameState.ui.houseSession?.state ?? null,
              textEntriesById: input.textEntriesById,
            }),
      cityNpcSummaries: [],
    };
  }

  return {
    type: "house",
    activeHouse,
    moduleViewModel: null,
    cityNpcSummaries: selectCityNpcSummariesForHouse(
      input.appState.gameState,
      activeHouse,
      input.cityNpcPoolDefinitions
    ),
  };
}
