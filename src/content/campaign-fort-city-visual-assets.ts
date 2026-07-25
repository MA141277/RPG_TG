import building01Mesh from "../assets/campaign-structures/fort-city/building-01-9352cd035676.json";
import building03Mesh from "../assets/campaign-structures/fort-city/building-03-e1e0e8793236.json";
import building04Mesh from "../assets/campaign-structures/fort-city/building-04-part-01-front-segment.json";
import building10Mesh from "../assets/campaign-structures/fort-city/building-10-25d33f33ab0d.json";
import building35Mesh from "../assets/campaign-structures/fort-city/building-35-eab9d92f772c.json";
import building42Mesh from "../assets/campaign-structures/fort-city/building-42-126e96a0f4c9.json";
import building45Mesh from "../assets/campaign-structures/fort-city/building-45-part-01-main-building.json";
import building46Mesh from "../assets/campaign-structures/fort-city/building-46-1b59f0c93fa9.json";
import fortCityRules from "../assets/campaign-structures/fort-city/fort-city-rules.json";
import fortWallMeshUrl from "../assets/campaign-structures/fort-wall/fort-hex-wall.json?url";
import type {
  CampaignFortCityRulesDefinition,
  CampaignVegetationMeshDefinition,
} from "../domain/map";
import { registerCampaignFortCityAsset } from "../ui/views/map/campaign-fort-city-asset-registry";

export const BUILTIN_YUANMO_FORT_CITY_ASSET_ID = "builtin.yuanmo.fort-city";

export const builtinYuanmoFortWallMeshUrl: string = fortWallMeshUrl;

registerCampaignFortCityAsset(BUILTIN_YUANMO_FORT_CITY_ASSET_ID, {
  rules: fortCityRules as CampaignFortCityRulesDefinition,
  meshesByVariantId: {
    "building-01-9352cd035676": building01Mesh as CampaignVegetationMeshDefinition,
    "building-03-e1e0e8793236": building03Mesh as CampaignVegetationMeshDefinition,
    "building-04-part-01-front-segment":
      building04Mesh as CampaignVegetationMeshDefinition,
    "building-10-25d33f33ab0d": building10Mesh as CampaignVegetationMeshDefinition,
    "building-35-eab9d92f772c": building35Mesh as CampaignVegetationMeshDefinition,
    "building-42-126e96a0f4c9": building42Mesh as CampaignVegetationMeshDefinition,
    "building-45-part-01-main-building":
      building45Mesh as CampaignVegetationMeshDefinition,
    "building-46-1b59f0c93fa9": building46Mesh as CampaignVegetationMeshDefinition,
  },
});
