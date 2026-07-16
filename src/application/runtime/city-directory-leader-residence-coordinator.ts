import { closeCityDirectory, openCityDirectory } from "../app-actions";
import type { AppState } from "../app-shell";
import { selectLeaderResidenceOptions } from "../city-entries/select-leader-residence-options";
import type { CharacterDefinition } from "../../domain/character";
import type { CityEntryDefinition } from "../../domain/city-entry";
import type { HistoricalCharacterRecord } from "../../domain/historical-character";
import type { HouseDefinition } from "../../domain/house";
import { LEADER_RESIDENCE_VARIABLE_KEYS } from "../../domain/leader-residence";

export type CityDirectoryLeaderResidenceCoordinatorDependencies = {
  getAppState(): AppState;
  setAppState(appState: AppState): void;
  renderApp(): void;
  findCityEntry(cityEntryId: string | undefined, cityId: string): CityEntryDefinition | null;
  findHouse(houseId: string): HouseDefinition | null;
  canOpenHouseFromCity(houseDefinition: HouseDefinition): boolean;
  enterHouse(houseId: string): void;
  getHistoricalCharacters(): HistoricalCharacterRecord[];
  getHistoricalCharacterIdByCharacterId(): Record<string, string>;
};

export function createCityDirectoryLeaderResidenceCoordinator(
  dependencies: CityDirectoryLeaderResidenceCoordinatorDependencies
) {
  function handleCityEntryClick(cityEntryId: string | undefined): void {
    const appState = dependencies.getAppState();
    const cityEntry = dependencies.findCityEntry(
      cityEntryId,
      appState.gameState.world.currentCityId
    );
    if (cityEntry == null) {
      return;
    }
    if (cityEntry.directoryType !== "leader-residence") {
      enterHouseFromCity(cityEntry.targetHouseId);
      return;
    }

    const targetHouse = dependencies.findHouse(cityEntry.targetHouseId);
    if (targetHouse == null || !dependencies.canOpenHouseFromCity(targetHouse)) {
      return;
    }

    dependencies.setAppState(
      openCityDirectory(appState, {
        type: cityEntry.directoryType,
        title: cityEntry.name,
        targetHouseId: cityEntry.targetHouseId,
        options: selectLeaderResidenceOptions(
          appState.gameState,
          appState.characterDefinitions,
          cityEntry,
          {
            historicalCharacters: dependencies.getHistoricalCharacters(),
            historicalCharacterIdByCharacterId:
              dependencies.getHistoricalCharacterIdByCharacterId(),
          }
        ),
      })
    );
    dependencies.renderApp();
  }

  function handleCityDirectoryCharacterSelection(
    selectedCharacterId: string | undefined
  ): void {
    const appState = dependencies.getAppState();
    if (selectedCharacterId == null || appState.cityDirectoryState == null) {
      return;
    }

    const targetHouseId = appState.cityDirectoryState.targetHouseId;
    const targetHouse = dependencies.findHouse(targetHouseId);
    if (targetHouse == null || !dependencies.canOpenHouseFromCity(targetHouse)) {
      return;
    }

    dependencies.setAppState({
      ...closeCityDirectory(appState),
      gameState: {
        ...appState.gameState,
        runtime: {
          ...appState.gameState.runtime,
          variables: {
            ...appState.gameState.runtime.variables,
            [LEADER_RESIDENCE_VARIABLE_KEYS.pendingCharacterId]:
              selectedCharacterId,
          },
        },
      },
    });
    dependencies.enterHouse(targetHouseId);
  }

  function enterHouseFromCity(houseId: string | undefined): void {
    if (houseId == null) {
      return;
    }

    const targetHouse = dependencies.findHouse(houseId);
    if (targetHouse == null || !dependencies.canOpenHouseFromCity(targetHouse)) {
      return;
    }

    dependencies.enterHouse(houseId);
  }

  return {
    handleCityEntryClick,
    handleCityDirectoryCharacterSelection,
    enterHouseFromCity,
  };
}
