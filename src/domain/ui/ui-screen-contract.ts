import type { UiAssetCatalog } from "./asset-catalog";
import type { ScreenLayoutPreset } from "./screen-layout";
import type { ScreenSchema } from "./screen-schema";
import type { ScreenSkinPreset } from "./screen-skin";

export type ResolvedScreenContract = {
  screenId: string;
  schema: ScreenSchema | null;
  layout: ScreenLayoutPreset | null;
  skin: ScreenSkinPreset | null;
  assetCatalogs: UiAssetCatalog[];
};

export function createEmptyResolvedScreenContract(
  screenId = ""
): ResolvedScreenContract {
  return {
    screenId,
    schema: null,
    layout: null,
    skin: null,
    assetCatalogs: [],
  };
}
