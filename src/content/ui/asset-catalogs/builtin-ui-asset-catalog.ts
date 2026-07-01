import type { UiAssetCatalog } from "../../../domain/ui/asset-catalog";
import { builtinUiReserveScreensById } from "../builtin-ui-reserve-seeds";

const aliases: Record<string, string> = {};

for (const screen of Object.values(builtinUiReserveScreensById)) {
  for (const component of screen.components) {
    if (component.background != null) {
      aliases[component.background.assetId] = component.background.imageUrl;
    }
  }
}

export const builtinUiAssetCatalog: UiAssetCatalog = {
  id: "builtin-default",
  version: 1,
  aliases,
};

export const builtinUiAssetCatalogs: UiAssetCatalog[] = [builtinUiAssetCatalog];
