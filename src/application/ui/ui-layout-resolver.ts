import type { ScreenLayoutPreset } from "../../domain/ui/screen-layout";

export type UiLayoutLayers = {
  builtin: Record<string, ScreenLayoutPreset> | undefined;
  pack: Record<string, ScreenLayoutPreset> | undefined;
  mod: Record<string, ScreenLayoutPreset> | undefined;
  user: Record<string, ScreenLayoutPreset> | undefined;
};

export function resolveScreenLayout(
  screenId: string,
  layers: UiLayoutLayers
): ScreenLayoutPreset | null {
  return (
    layers.user?.[screenId] ??
    layers.mod?.[screenId] ??
    layers.pack?.[screenId] ??
    layers.builtin?.[screenId] ??
    null
  );
}
