export type UiLayoutBackgroundMode =
  | "stretch"
  | "contain"
  | "cover"
  | "nine-slice";

export type UiLayoutRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type UiLayoutSlice = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type UiLayoutBackground = {
  assetId: string;
  imageUrl: string;
  mode: UiLayoutBackgroundMode;
  slice: UiLayoutSlice;
};

export type UiLayoutElement = {
  id: string;
  label: string;
  rect: UiLayoutRect;
};

export type UiLayoutComponent = {
  id: string;
  label: string;
  rect: UiLayoutRect;
  background: UiLayoutBackground | null;
  elements: UiLayoutElement[];
};

export type LayoutEditorTargetId = "global-hud" | "start-screen";

export type UiLayout = {
  id: LayoutEditorTargetId;
  label: string;
  screenSize: {
    width: number;
    height: number;
  };
  components: UiLayoutComponent[];
};

export type GlobalHudLayout = UiLayout & {
  id: "global-hud";
};

export type StartScreenLayout = UiLayout & {
  id: "start-screen";
};

export type LayoutEditorState = {
  isOpen: boolean;
  selectedTargetId: LayoutEditorTargetId;
  selectedComponentId: string;
  selectedElementId: string | null;
  backgroundAssetQuery: string;
};

export type LayoutBackgroundAssetOption = {
  id: string;
  label: string;
  imageUrl: string;
};

export const uiLayoutComponentBaseSizeById: Record<
  string,
  { width: number; height: number }
> = {
  "portrait-frame": { width: 178, height: 214 },
  "status-board": { width: 764, height: 219 },
  "task-panel": { width: 248, height: 494 },
  "main-menu-content": { width: 320, height: 220 },
  "main-menu-subtitle": { width: 420, height: 36 },
  "start-button": { width: 136, height: 136 },
  "continue-button": { width: 136, height: 136 },
};
