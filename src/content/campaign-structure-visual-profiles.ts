import cityDepthMeshAssetUrl from "../3dasset/city_hun/city-hun-campaign-lowpoly.json?url";
import cityDepthTextureUrl from "../3dasset/city_hun/texture_pbr_20250901.png?url";
import yuanmoHexBuildingUrl from "../../ui/yuansu/20260715-120754.png?url";
import { builtinYuanmoFortWallMeshUrl } from "./campaign-fort-city-visual-assets";

export type CampaignStructureVisualProfile = {
  id: string;
  cityDepthMeshUrl: string | null;
  cityDepthTextureUrl: string | null;
  settlementBuildingImageUrl: string | null;
  fortCityAssetId: string | null;
  fortWallMeshUrl: string | null;
};

const campaignStructureVisualProfilesById: Record<
  string,
  CampaignStructureVisualProfile
> = {
  "yuanmo.campaign-structures": {
    id: "yuanmo.campaign-structures",
    cityDepthMeshUrl: cityDepthMeshAssetUrl,
    cityDepthTextureUrl,
    settlementBuildingImageUrl: yuanmoHexBuildingUrl,
    fortCityAssetId: "builtin.yuanmo.fort-city",
    fortWallMeshUrl: builtinYuanmoFortWallMeshUrl,
  },
};

export function resolveCampaignStructureVisualProfile(
  profileId: string | undefined
): CampaignStructureVisualProfile | null {
  if (profileId == null) {
    return null;
  }

  return campaignStructureVisualProfilesById[profileId] ?? null;
}
