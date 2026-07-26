import { builtinYuanmoFortWallMeshUrl } from "./campaign-fort-city-visual-assets";

export type CampaignStructureVisualProfile = {
  id: string;
  fortCityAssetId: string | null;
  fortWallMeshUrl: string | null;
};

const campaignStructureVisualProfilesById: Record<
  string,
  CampaignStructureVisualProfile
> = {
  "yuanmo.campaign-structures": {
    id: "yuanmo.campaign-structures",
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
