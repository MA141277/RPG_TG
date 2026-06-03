import type { CharacterId } from "./character";
import type { CityId } from "./city";
import type { HouseId } from "./house";

export type Hd2degAssetRef = {
  assetId: string;
  assetPath: string;
};

export type CitySceneHouseMapping = {
  houseId: HouseId;
  sceneObjectId: string;
  engineObjectId?: string;
  label: string;
  moduleRole: string;
  buildingAsset: Hd2degAssetRef;
};

export type CitySceneNpcMapping = {
  characterId: CharacterId;
  sceneNpcId: string;
  label: string;
  characterAsset: Hd2degAssetRef;
  homeHouseId?: HouseId;
};

export type CitySceneMapping = {
  cityId: CityId;
  hd2degSceneId: string;
  hd2degScenePath: string;
  title: string;
  visualProfile: string;
  entrySpawn: {
    x: number;
    y: number;
  };
  houses: CitySceneHouseMapping[];
  npcs: CitySceneNpcMapping[];
};
