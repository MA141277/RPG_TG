export type CityStageEntry =
  | { type: "none" }
  | { type: "house"; houseId: string }
  | { type: "city-entry"; cityEntryId: string };

export type CityStageAssetAnchor = "bottom-center" | "center" | "top-left";

export type CityStageAsset = {
  image: string;
  naturalWidth: number;
  naturalHeight: number;
  scale: number;
  offsetX: number;
  offsetY: number;
  anchor: CityStageAssetAnchor;
};

export type CityStageLot = {
  gridX: number;
  gridY: number;
  cols: number;
  rows: number;
  offsetX?: number;
  offsetY?: number;
};

export type CityStageRender = {
  visible?: boolean;
  locked?: boolean;
  zIndex?: number | null;
  zIndexMode?: "y-sort" | "manual";
};

export type CityStageInteractionLabel = {
  text: string;
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
};

export type CityStageInteractionHitArea = {
  type: "ellipse" | "rect";
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
};

export type CityStageInteraction = {
  clickable: boolean;
  label: CityStageInteractionLabel;
  hitArea: CityStageInteractionHitArea;
};

export type CityStageMap = {
  id: string;
  name: string;
  stageWidth: number;
  stageHeight: number;
  baseSpace: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  backgroundImage: string;
  foregroundImage: string;
  referenceMask?: unknown[];
};

export type CityStageGrid = {
  type: "isometric-board";
  cols: number;
  rows: number;
  cellWidth: number;
  cellHeight: number;
  originX: number;
  originY: number;
  snap?: boolean;
  visible?: boolean;
  showCoordinates?: boolean;
  showOutline?: boolean;
};

export type CityStagePrefab = {
  id: string;
  name: string;
  category: string;
  entry: CityStageEntry;
  asset: CityStageAsset;
  footprint: {
    cols: number;
    rows: number;
  };
  interaction: CityStageInteraction;
};

export type CityStagePrefabLibrary = {
  prefabs: CityStagePrefab[];
};

export type CityStageInstance = {
  id: string;
  prefabId: string;
  gridX: number;
  gridY: number;
  render?: CityStageRender;
};

export type ComposedCityStageEntity = {
  id: string;
  prefabId?: string;
  name: string;
  category: string;
  entry: CityStageEntry;
  asset: CityStageAsset;
  lot: CityStageLot;
  render?: CityStageRender;
  interaction: CityStageInteraction;
};

export type CityStageLayout = {
  version: number;
  map: CityStageMap;
  grid: CityStageGrid;
  entities: ComposedCityStageEntity[];
};

export type CityStageLayoutSource = {
  version: number;
  map: CityStageMap;
  grid: CityStageGrid;
  instances?: CityStageInstance[];
  entities?: ComposedCityStageEntity[];
  randomPools?: unknown[];
};

const DEFAULT_CITY_STAGE_RENDER: CityStageRender = {
  visible: true,
  locked: false,
  zIndexMode: "y-sort",
  zIndex: null,
};

export function composeCityStageLayout(
  layoutSource: CityStageLayoutSource,
  prefabLibrary: CityStagePrefabLibrary
): ComposedCityStageEntity[] {
  if (Array.isArray(layoutSource.instances)) {
    const prefabById = new Map(
      prefabLibrary.prefabs.map((prefab) => [prefab.id, prefab] as const)
    );

    return layoutSource.instances.map((instance) => {
      const prefab = prefabById.get(instance.prefabId);
      if (prefab == null) {
        throw new Error(`Unknown city-stage prefab: ${instance.prefabId}`);
      }

      return {
        id: instance.id,
        prefabId: prefab.id,
        name: prefab.name,
        category: prefab.category,
        entry: cloneCityStageEntry(prefab.entry),
        asset: { ...prefab.asset },
        lot: {
          gridX: instance.gridX,
          gridY: instance.gridY,
          cols: prefab.footprint.cols,
          rows: prefab.footprint.rows,
        },
        render: composeCityStageRender(instance.render),
        interaction: cloneCityStageInteraction(prefab.interaction),
      };
    });
  }

  if (Array.isArray(layoutSource.entities)) {
    return layoutSource.entities.map((entity) => ({
      ...entity,
      entry: cloneCityStageEntry(entity.entry),
      asset: { ...entity.asset },
      lot: { ...entity.lot },
      render: composeCityStageRender(entity.render),
      interaction: cloneCityStageInteraction(entity.interaction),
    }));
  }

  return [];
}

function composeCityStageRender(render?: CityStageRender): CityStageRender {
  return {
    ...DEFAULT_CITY_STAGE_RENDER,
    ...render,
  };
}

function cloneCityStageEntry(entry: CityStageEntry): CityStageEntry {
  if (entry.type === "house") {
    return { ...entry };
  }

  if (entry.type === "city-entry") {
    return { ...entry };
  }

  return { type: "none" };
}

function cloneCityStageInteraction(
  interaction: CityStageInteraction
): CityStageInteraction {
  return {
    clickable: interaction.clickable,
    label: { ...interaction.label },
    hitArea: { ...interaction.hitArea },
  };
}
