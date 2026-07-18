import type { CityDefinition } from "../../domain/city";
import type { GridCoordinate } from "../navigation/travel-to-coordinate";
import {
  createMapCityMarkers,
  type MapCityMarker,
} from "./map-city-marker-view-model";

export type MapCityLocation = MapCityMarker;

export type MapLocationProvider = {
  listCityLocationMarkers(): MapCityLocation[];
  getCityLocation(cityId: string): MapCityLocation | null;
  getCityIdByMapNodeId(mapNodeId: string): string | null;
};

export function createMapLocationProvider(input: {
  cityDefinitions: readonly CityDefinition[];
  cityCoordinatesById: Record<string, GridCoordinate>;
}): MapLocationProvider {
  const cityLocations = createMapCityMarkers(input);
  const cityLocationById = Object.fromEntries(
    cityLocations.map((cityLocation) => [cityLocation.id, cityLocation])
  );
  const cityIdByMapNodeId = Object.fromEntries(
    input.cityDefinitions
      .filter((cityDefinition) => cityDefinition.mapNodeId != null)
      .map((cityDefinition) => [
        cityDefinition.mapNodeId as string,
        cityDefinition.id,
      ])
  );

  return {
    listCityLocationMarkers() {
      return cityLocations.map((cityLocation) => ({ ...cityLocation }));
    },
    getCityLocation(cityId) {
      const cityLocation = cityLocationById[cityId];
      return cityLocation == null ? null : { ...cityLocation };
    },
    getCityIdByMapNodeId(mapNodeId) {
      return cityIdByMapNodeId[mapNodeId] ?? null;
    },
  };
}
