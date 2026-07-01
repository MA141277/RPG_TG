import {
  isUiAssetCatalog,
  type UiAssetCatalog,
} from "../../domain/ui/asset-catalog";
import {
  isScreenLayoutPreset,
  type ScreenLayoutPreset,
} from "../../domain/ui/screen-layout";
import {
  isScreenSchema,
  type ScreenSchema,
} from "../../domain/ui/screen-schema";
import {
  isScreenSkinPreset,
  type ScreenSkinPreset,
} from "../../domain/ui/screen-skin";

export function validateScreenSchema(value: unknown): ScreenSchema | null {
  return isScreenSchema(value) ? value : null;
}

export function validateScreenLayoutPreset(
  value: unknown
): ScreenLayoutPreset | null {
  return isScreenLayoutPreset(value) ? value : null;
}

export function validateScreenSkinPreset(
  value: unknown
): ScreenSkinPreset | null {
  return isScreenSkinPreset(value) ? value : null;
}

export function validateUiAssetCatalog(value: unknown): UiAssetCatalog | null {
  return isUiAssetCatalog(value) ? value : null;
}
