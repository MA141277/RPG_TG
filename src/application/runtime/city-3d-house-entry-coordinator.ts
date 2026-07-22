import type { AppState } from "../app-shell";
import type { CitySceneMapping } from "../../domain/city-scene-mapping";
import type { HouseDefinition } from "../../domain/house";

export type City3dHouseEntryCoordinatorDependencies = {
  getAppState(): AppState;
  getCitySceneMapping(cityId: string): CitySceneMapping | null;
  findHouse(houseId: string): HouseDefinition | null;
  canOpenHouseFromCity(houseDefinition: HouseDefinition): boolean;
  enterHouse(houseId: string): void;
  getWindowOrigin(): string;
};

export function createCity3dHouseEntryCoordinator(
  dependencies: City3dHouseEntryCoordinatorDependencies
) {
  function handleSceneObjectHouseEntry(
    sceneObjectId: string,
    requestedHouseId: string | null = null
  ): void {
    const normalizedSceneObjectId = sceneObjectId.trim();
    if (!normalizedSceneObjectId) {
      return;
    }

    const appState = dependencies.getAppState();
    const mapping = dependencies.getCitySceneMapping(
      appState.gameState.world.currentCityId
    );
    const mappedHouse =
      mapping?.houses.find(
        (houseMapping) =>
          houseMapping.sceneObjectId === normalizedSceneObjectId &&
          (requestedHouseId == null || houseMapping.houseId === requestedHouseId)
      ) ?? null;
    if (mappedHouse == null) {
      return;
    }

    const houseDefinition = dependencies.findHouse(mappedHouse.houseId);
    if (
      houseDefinition == null ||
      !dependencies.canOpenHouseFromCity(houseDefinition)
    ) {
      return;
    }

    dependencies.enterHouse(mappedHouse.houseId);
  }

  function handleWindowMessage(event: MessageEvent): void {
    if (event.origin !== dependencies.getWindowOrigin()) {
      return;
    }

    const data = event.data;
    if (
      data == null ||
      typeof data !== "object" ||
      data.type !== "hd2deg:enter-house" ||
      typeof data.sceneObjectId !== "string"
    ) {
      return;
    }

    handleSceneObjectHouseEntry(
      data.sceneObjectId,
      typeof data.houseId === "string" ? data.houseId : null
    );
  }

  return {
    handleSceneObjectHouseEntry,
    handleWindowMessage,
  };
}
