import type { ScreenSkinPreset } from "../../domain/ui/screen-skin";

export type UiSkinLayers = {
  builtin: Record<string, ScreenSkinPreset> | undefined;
  pack: Record<string, ScreenSkinPreset> | undefined;
  mod: Record<string, ScreenSkinPreset> | undefined;
  user: Record<string, ScreenSkinPreset> | undefined;
};

export function resolveScreenSkin(
  screenId: string,
  layers: UiSkinLayers
): ScreenSkinPreset | null {
  return (
    layers.user?.[screenId] ??
    layers.mod?.[screenId] ??
    layers.pack?.[screenId] ??
    layers.builtin?.[screenId] ??
    null
  );
}
