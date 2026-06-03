import type { CityDefinition } from "../domain/city";
import type {
  CitySceneHouseMapping,
  CitySceneMapping,
  CitySceneNpcMapping,
  Hd2degAssetRef,
} from "../domain/city-scene-mapping";
import type { HouseDefinition } from "../domain/house";
import { prototypeCities, prototypeHouses } from "./prototype-world";

const HD2DEG_SCENE_VERSION = "2026060107";

const citySlugByCityId: Record<string, string> = {
  "city.kulan": "kulan",
};

function getCitySlug(cityId: string): string {
  return (
    citySlugByCityId[cityId] ??
    cityId.replace(/^city\./, "").replaceAll(".", "_")
  );
}

function getSceneIdForCity(cityId: string): string {
  return `zyz_${getCitySlug(cityId)}_city`;
}

function toSceneKey(value: string): string {
  return value
    .replace(/^house\./, "")
    .replace(/^home[._]/, "home.")
    .replaceAll(".", "_")
    .replaceAll("-", "_");
}

function getHouseBuildingAsset(houseDefinition: HouseDefinition): Hd2degAssetRef {
  switch (houseDefinition.moduleId) {
    case "keep-house":
    case "leader-residence":
      return {
        assetId: "building.zhu.red-turban-marshall-residence",
        assetPath: "HD2DEG/building/中国风像素建筑-明朝红巾军帅府",
      };
    case "grain-shop":
      return {
        assetId: "building.zhu.grain-shop",
        assetPath: "HD2DEG/building/中国风像素建筑-粮食店",
      };
    case "tavern":
    case "tea-house":
      return {
        assetId: "building.zhu.two-story-restaurant",
        assetPath: "HD2DEG/building/二层酒楼",
      };
    case "temple-house":
      return {
        assetId: "building.zhu.temple-hall",
        assetPath: "HD2DEG/building/故宫大殿",
      };
    case "market-house":
      return {
        assetId: "building.zhu.market-house",
        assetPath: "HD2DEG/building/中国风像素建筑-元末明初平民住宅2",
      };
    case "medicine-house":
      return {
        assetId: "building.zhu.medicine-house",
        assetPath: "HD2DEG/building/中国风像素建筑-元末明初平民住宅1",
      };
    case "home-house":
    default:
      return {
        assetId: "building.zhu.common-house",
        assetPath: "HD2DEG/building/中国风像素建筑-元末明初平民住宅1",
      };
  }
}

function getNpcAssetForHouse(houseDefinition: HouseDefinition): Hd2degAssetRef {
  switch (houseDefinition.moduleId) {
    case "keep-house":
    case "leader-residence":
      return {
        assetId: "character.zhu.red-turban-general",
        assetPath: "HD2DEG/character/红巾军将领",
      };
    case "temple-house":
      return {
        assetId: "character.zhu.temple-monk",
        assetPath: "HD2DEG/character/npc_temple_monk",
      };
    case "tavern":
    case "tea-house":
      return {
        assetId: "character.zhu.innkeeper",
        assetPath: "HD2DEG/character/npc_inn_bosslady",
      };
    case "market-house":
    case "grain-shop":
    case "medicine-house":
      return {
        assetId: "character.zhu.merchant",
        assetPath: "HD2DEG/character/npc_merchants_husband",
      };
    case "home-house":
    default:
      return {
        assetId: "character.zhu.red-turban-soldier",
        assetPath: "HD2DEG/character/红巾军小兵",
      };
  }
}

function createHouseMapping(houseDefinition: HouseDefinition): CitySceneHouseMapping {
  const sceneObjectId = `zyz.${toSceneKey(houseDefinition.id)}`;
  return {
    houseId: houseDefinition.id,
    sceneObjectId,
    engineObjectId: sceneObjectId,
    label: houseDefinition.name,
    moduleRole: houseDefinition.moduleId ?? "unknown",
    buildingAsset: getHouseBuildingAsset(houseDefinition),
  };
}

function createNpcMappings(
  cityDefinition: CityDefinition,
  houseDefinitions: HouseDefinition[]
): CitySceneNpcMapping[] {
  const citySlug = getCitySlug(cityDefinition.id);
  const npcs: CitySceneNpcMapping[] = [
    {
      characterId: "char.player",
      sceneNpcId: `zyz.${citySlug}.player`,
      label: "朱元璋",
      characterAsset: {
        assetId: "character.zhu.red-turban-soldier",
        assetPath: "HD2DEG/character/红巾军小兵",
      },
    },
  ];

  for (const houseDefinition of houseDefinitions) {
    const defaultCharacterId =
      houseDefinition.defaultCharacterId ?? houseDefinition.characterIds[0];
    if (defaultCharacterId == null) {
      continue;
    }
    npcs.push({
      characterId: defaultCharacterId,
      sceneNpcId: `zyz.${toSceneKey(houseDefinition.id)}.npc`,
      label: houseDefinition.name,
      homeHouseId: houseDefinition.id,
      characterAsset: getNpcAssetForHouse(houseDefinition),
    });
  }

  return npcs;
}

function createCitySceneMapping(cityDefinition: CityDefinition): CitySceneMapping {
  const sceneId = getSceneIdForCity(cityDefinition.id);
  const cityHouseIdSet = new Set(cityDefinition.houseIds);
  const houseDefinitions = prototypeHouses.filter(
    (houseDefinition) =>
      houseDefinition.cityId === cityDefinition.id ||
      cityHouseIdSet.has(houseDefinition.id)
  );

  return {
    cityId: cityDefinition.id,
    hd2degSceneId: sceneId,
    hd2degScenePath: `/HD2DEG/pixel-workflow.html?scene=${sceneId}&embed=1&v=${HD2DEG_SCENE_VERSION}`,
    title: cityDefinition.name,
    visualProfile: "zhu-yuanzhang-city-from-house-cards",
    entrySpawn: { x: 0, y: 0 },
    houses: houseDefinitions.map(createHouseMapping),
    npcs: createNpcMappings(cityDefinition, houseDefinitions),
  };
}

export const zhuYuanzhangCitySceneMappings: CitySceneMapping[] =
  prototypeCities.map(createCitySceneMapping);

export const zhuYuanzhangCitySceneMappingByCityId: Record<string, CitySceneMapping> =
  Object.fromEntries(
    zhuYuanzhangCitySceneMappings.map((mapping) => [mapping.cityId, mapping])
  );
