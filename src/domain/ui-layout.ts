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

export type GlobalHudLayout = {
  id: "global-hud";
  label: string;
  screenSize: {
    width: number;
    height: number;
  };
  components: UiLayoutComponent[];
};

export type LayoutEditorTargetId = "global-hud";

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
