import type { AppState } from "../app-shell";
import {
  createDefaultCharacterDetailScreenLayout,
  createDefaultCharacterSelectScreenLayout,
  createDefaultGlobalHudLayout,
  createDefaultStartScreenLayout,
} from "../../content/layout-editor-presets";

export function createDefaultUiLayoutAppState(): Pick<
  AppState,
  "uiLayouts"
> {
  return {
    uiLayouts: {
      "global-hud": createDefaultGlobalHudLayout(),
      "start-screen": createDefaultStartScreenLayout(),
      "character-select-screen": createDefaultCharacterSelectScreenLayout(),
      "character-detail-screen": createDefaultCharacterDetailScreenLayout(),
    },
  };
}
