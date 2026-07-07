import type { AppState } from "../app-shell";
import {
  createDefaultCharacterDetailScreenLayout,
  createDefaultCharacterSelectScreenLayout,
  createDefaultGlobalHudLayout,
  createDefaultStartScreenLayout,
} from "../../content/layout-editor-presets";

export function createDefaultLayoutEditorAppState(): Pick<
  AppState,
  "uiLayouts" | "layoutEditor"
> {
  return {
    uiLayouts: {
      "global-hud": createDefaultGlobalHudLayout(),
      "start-screen": createDefaultStartScreenLayout(),
      "character-select-screen": createDefaultCharacterSelectScreenLayout(),
      "character-detail-screen": createDefaultCharacterDetailScreenLayout(),
    },
    layoutEditor: {
      isOpen: false,
      selectedTargetId: "global-hud",
      selectedComponentId: "status-board",
      selectedElementId: null,
      backgroundAssetQuery: "",
    },
  };
}
