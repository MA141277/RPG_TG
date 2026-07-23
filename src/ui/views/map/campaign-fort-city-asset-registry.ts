import type {
  CampaignFortCityRulesDefinition,
  CampaignVegetationMeshDefinition,
} from "../../../domain/map";

export type RegisteredCampaignFortCityAsset = {
  rules: CampaignFortCityRulesDefinition;
  meshesByVariantId: Record<string, CampaignVegetationMeshDefinition>;
};

const campaignFortCityAssetsById = new Map<string, RegisteredCampaignFortCityAsset>();

export function registerCampaignFortCityAsset(
  id: string,
  asset: RegisteredCampaignFortCityAsset
): void {
  campaignFortCityAssetsById.set(id, asset);
}

export function getRegisteredCampaignFortCityAsset(
  id: string
): RegisteredCampaignFortCityAsset | null {
  return campaignFortCityAssetsById.get(id) ?? null;
}
