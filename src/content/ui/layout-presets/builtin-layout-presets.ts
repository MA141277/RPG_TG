import type { ScreenLayoutPreset } from "../../../domain/ui/screen-layout";
import { builtinUiReserveScreensById } from "../builtin-ui-reserve-seeds";

function createLayoutPreset(screenId: keyof typeof builtinUiReserveScreensById): ScreenLayoutPreset {
  const layout = builtinUiReserveScreensById[screenId];
  return {
    screenId: layout.id,
    version: 1,
    canvas: {
      width: layout.canvas.width,
      height: layout.canvas.height,
    },
    components: layout.components.map((component, index) => ({
      id: component.id,
      rect: { ...component.rect },
      zIndex: index,
      visible: true,
    })),
  };
}

export const builtinLayoutPresetsById = {
  "global-hud": createLayoutPreset("global-hud"),
  "start-screen": createLayoutPreset("start-screen"),
  "character-select-screen": createLayoutPreset("character-select-screen"),
  "character-detail-screen": createLayoutPreset("character-detail-screen"),
};
