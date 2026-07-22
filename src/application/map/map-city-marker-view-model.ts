import type { GridCoordinate } from "../navigation/travel-to-coordinate";
import type { CityDefinition } from "../../domain/city";

export type MapCityMarker = {
  id: string;
  name: string;
  x: number;
  y: number;
};

export function createMapCityMarkers(input: {
  cityDefinitions: readonly CityDefinition[];
  cityCoordinatesById: Record<string, GridCoordinate>;
}): MapCityMarker[] {
  return input.cityDefinitions
    .map((cityDefinition) => {
      const coordinate = input.cityCoordinatesById[cityDefinition.id];
      if (coordinate == null) {
        return null;
      }

      return {
        id: cityDefinition.id,
        name: cityDefinition.name,
        x: coordinate.x,
        y: coordinate.y,
      };
    })
    .filter((cityMarker): cityMarker is MapCityMarker => cityMarker != null);
}
