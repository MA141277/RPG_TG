import type { CityDefinition } from "../../domain/city";
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
}): MapLocationProvider {
  const cityLocations = createMapCityMarkers(input);
  const cityLocationById = Object.fromEntries(
    cityLocations.map((cityLocation) => [cityLocation.id, cityLocation])
  );
  const cityIdByMapNodeId = Object.fromEntries(
    cityLocations
      .filter((cityLocation) => cityLocation.mapNodeId != null)
      .map((cityLocation) => [cityLocation.mapNodeId as string, cityLocation.id])
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
