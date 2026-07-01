import type { ScreenSkinPreset } from "../../../domain/ui/screen-skin";
import { builtinUiReserveScreensById } from "../builtin-ui-reserve-seeds";

function createSkinPreset(
  screenId: keyof typeof builtinUiReserveScreensById
): ScreenSkinPreset {
  const layout = builtinUiReserveScreensById[screenId];
  return {
    screenId: layout.id,
    version: 1,
    themeId: "builtin",
    components: layout.components.map((component) => {
      const background = component.background;
      return {
        id: component.id,
        ...(background == null
          ? {}
          : {
              assetId: background.assetId,
              imageUrl: background.imageUrl,
              mode: background.mode,
              ...(background.slice == null ? {} : { slice: { ...background.slice } }),
            }),
      };
    }),
  };
}

export const builtinSkinPresetsById = {
  "global-hud": createSkinPreset("global-hud"),
  "start-screen": createSkinPreset("start-screen"),
  "character-select-screen": createSkinPreset("character-select-screen"),
  "character-detail-screen": createSkinPreset("character-detail-screen"),
};
