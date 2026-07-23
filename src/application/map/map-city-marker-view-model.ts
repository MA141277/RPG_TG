import type { CityDefinition } from "../../domain/city";

export type MapCityMarker = {
  id: string;
  name: string;
  x: number;
  y: number;
  kind: "city" | "settlement" | "fort";
  summary: string;
  mapNodeId: string | null;
};

export function createMapCityMarkers(input: {
  cityDefinitions: readonly CityDefinition[];
}): MapCityMarker[] {
  return input.cityDefinitions
    .flatMap((cityDefinition) => {
      const placement = cityDefinition.mapPlacement;
      if (placement == null) {
        return [];
      }

      return [{
        id: cityDefinition.id,
        name: placement.label ?? cityDefinition.name,
        x: placement.x,
        y: placement.y,
        kind: placement.kind ?? "city",
        summary: placement.summary ?? "",
        mapNodeId: placement.mapNodeId ?? null,
      }];
    });
}
