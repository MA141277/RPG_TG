import type { UiAssetCatalog } from "../../domain/ui/asset-catalog";
import { createEmptyResolvedScreenContract } from "../../domain/ui/ui-screen-contract";
import type { ScreenLayoutPreset } from "../../domain/ui/screen-layout";
import type { ScreenSchema } from "../../domain/ui/screen-schema";
import type { ScreenSkinPreset } from "../../domain/ui/screen-skin";
import { resolveUiAssetAlias } from "./ui-asset-resolver";
import { resolveScreenLayout } from "./ui-layout-resolver";
import { resolveScreenSkin } from "./ui-skin-resolver";

export type UiContractRegistryInput = {
  builtinSchemasById: Record<string, ScreenSchema>;
  builtinLayoutsById: Record<string, ScreenLayoutPreset>;
  builtinSkinsById: Record<string, ScreenSkinPreset>;
  builtinAssetCatalogs: UiAssetCatalog[];
  packSchemasById?: Record<string, ScreenSchema>;
  packLayoutsById?: Record<string, ScreenLayoutPreset>;
  packSkinsById?: Record<string, ScreenSkinPreset>;
  packAssetCatalogs?: UiAssetCatalog[];
  modSchemasById?: Record<string, ScreenSchema>;
  modLayoutsById?: Record<string, ScreenLayoutPreset>;
  modSkinsById?: Record<string, ScreenSkinPreset>;
  modAssetCatalogs?: UiAssetCatalog[];
  userSchemasById?: Record<string, ScreenSchema>;
  userLayoutsById?: Record<string, ScreenLayoutPreset>;
  userSkinsById?: Record<string, ScreenSkinPreset>;
  userAssetCatalogs?: UiAssetCatalog[];
};

function mapCatalogAliases(
  catalogs: UiAssetCatalog[] | undefined
): Record<string, string> {
  return Object.assign({}, ...(catalogs ?? []).map((catalog) => catalog.aliases));
}

export function createUiContractRegistry(input: UiContractRegistryInput) {
  const schemaLayers = {
    builtin: input.builtinSchemasById,
    pack: input.packSchemasById,
    mod: input.modSchemasById,
    user: input.userSchemasById,
  };
  const layoutLayers = {
    builtin: input.builtinLayoutsById,
    pack: input.packLayoutsById,
    mod: input.modLayoutsById,
    user: input.userLayoutsById,
  };
  const skinLayers = {
    builtin: input.builtinSkinsById,
    pack: input.packSkinsById,
    mod: input.modSkinsById,
    user: input.userSkinsById,
  };
  const assetLayers = {
    builtin: mapCatalogAliases(input.builtinAssetCatalogs),
    pack: mapCatalogAliases(input.packAssetCatalogs),
    mod: mapCatalogAliases(input.modAssetCatalogs),
    user: mapCatalogAliases(input.userAssetCatalogs),
  };

  function getSchema(screenId: string): ScreenSchema | null {
    return (
      schemaLayers.user?.[screenId] ??
      schemaLayers.mod?.[screenId] ??
      schemaLayers.pack?.[screenId] ??
      schemaLayers.builtin?.[screenId] ??
      null
    );
  }

  function getLayout(screenId: string): ScreenLayoutPreset | null {
    return resolveScreenLayout(screenId, layoutLayers);
  }

  function getSkin(screenId: string): ScreenSkinPreset | null {
    return resolveScreenSkin(screenId, skinLayers);
  }

  function getAssetUrl(alias: string): string | null {
    return resolveUiAssetAlias(alias, assetLayers)?.url ?? null;
  }

  function resolveScreenContract(screenId: string) {
    return {
      ...createEmptyResolvedScreenContract(screenId),
      schema: getSchema(screenId),
      layout: getLayout(screenId),
      skin: getSkin(screenId),
      assetCatalogs: [
        ...(input.builtinAssetCatalogs ?? []),
        ...(input.packAssetCatalogs ?? []),
        ...(input.modAssetCatalogs ?? []),
        ...(input.userAssetCatalogs ?? []),
      ],
    };
  }

  return {
    getSchema,
    getLayout,
    getSkin,
    getAssetUrl,
    resolveScreenContract,
  };
}
