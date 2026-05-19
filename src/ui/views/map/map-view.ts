import type { CityDefinition } from "../../../domain/city";
import type { GridCoordinate } from "../../../application/navigation/travel-to-coordinate";

export type MapViewModel = {
  mapName: string;
  size: number;
  playerCoordinate: GridCoordinate;
  cityMarkers: Array<{
    id: string;
    name: string;
    x: number;
    y: number;
  }>;
};

export function createMapViewModel(input: {
  mapName: string;
  size: number;
  playerCoordinate: GridCoordinate;
  cityDefinitions: CityDefinition[];
  cityCoordinatesById: Record<string, GridCoordinate>;
}): MapViewModel {
  return {
    mapName: input.mapName,
    size: input.size,
    playerCoordinate: input.playerCoordinate,
    cityMarkers: input.cityDefinitions
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
      .filter((cityMarker): cityMarker is NonNullable<typeof cityMarker> => cityMarker != null),
  };
}

export function renderMapView(model: MapViewModel): string {
  const cells: string[] = [];

  for (let y = 0; y < model.size; y += 1) {
    for (let x = 0; x < model.size; x += 1) {
      const cityMarker = model.cityMarkers.find(
        (marker) => marker.x === x && marker.y === y
      );
      const isPlayerHere =
        model.playerCoordinate.x === x && model.playerCoordinate.y === y;

      cells.push(`
        <button
          class="c-grid-cell ${cityMarker == null ? "" : "has-city"}"
          data-map-x="${x}"
          data-map-y="${y}"
          data-city-id="${cityMarker?.id ?? ""}"
        >
          <span class="c-grid-cell__coord">(${x}, ${y})</span>
          ${
            cityMarker == null
              ? ""
              : `<span class="c-city-token">${cityMarker.name}</span>`
          }
          ${
            isPlayerHere
              ? '<span class="c-player-token" aria-label="玩家位置"></span>'
              : ""
          }
        </button>
      `);
    }
  }

  return `
    <section class="view-map">
      <div class="c-stage-header">
        <div>
          <p class="c-stage-header__eyebrow">地图巡行</p>
          <h1 class="c-stage-header__title">${model.mapName}</h1>
        </div>
        <div class="c-map-legend">
          <span class="c-map-legend__item"><span class="c-player-token"></span> 玩家</span>
          <span class="c-map-legend__item"><span class="c-city-token">城池</span></span>
        </div>
      </div>
      <div class="c-grid-map" style="--grid-size:${model.size}">
        ${cells.join("")}
      </div>
    </section>
  `;
}
