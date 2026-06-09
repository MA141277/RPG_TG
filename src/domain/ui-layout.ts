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

export type LayoutEditorTargetId =
  | "global-hud"
  | "start-screen"
  | "character-select-screen"
  | "character-detail-screen";

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

export type CharacterSelectScreenLayout = UiLayout & {
  id: "character-select-screen";
};

export type CharacterDetailScreenLayout = UiLayout & {
  id: "character-detail-screen";
};

export type UiLayoutByTargetId = {
  "global-hud": GlobalHudLayout;
  "start-screen": StartScreenLayout;
  "character-select-screen": CharacterSelectScreenLayout;
  "character-detail-screen": CharacterDetailScreenLayout;
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
  "main-menu-content": { width: 553, height: 380 },
  "main-menu-subtitle": { width: 420, height: 36 },
  "start-button": { width: 286, height: 286 },
  "continue-button": { width: 201, height: 201 },
  "character-layout": { width: 1600, height: 900 },
  "character-hero": { width: 190, height: 720 },
  "character-book": { width: 1388, height: 783 },
  "character-tabs": { width: 110, height: 460 },
  "character-tab-characters": { width: 168, height: 211 },
  "character-tab-roster": { width: 168, height: 210 },
  "character-tab-ministers": { width: 168, height: 210 },
  "character-book-content": { width: 988, height: 562 },
  "character-grid": { width: 658, height: 508 },
  "character-card-1": { width: 142, height: 242 },
  "character-card-2": { width: 142, height: 242 },
  "character-card-3": { width: 142, height: 242 },
  "character-card-4": { width: 142, height: 242 },
  "character-card-5": { width: 142, height: 242 },
  "character-card-6": { width: 142, height: 242 },
  "character-card-7": { width: 142, height: 242 },
  "character-card-8": { width: 142, height: 242 },
  "character-detail": { width: 292, height: 492 },
  "character-detail-paper": { width: 292, height: 492 },
  "character-footer": { width: 1392, height: 154 },
  "character-back-button": { width: 112, height: 112 },
  "character-pagination": { width: 318, height: 36 },
  "character-choose-button": { width: 176, height: 176 },
  "character-previous-page-button": { width: 118, height: 118 },
  "character-next-page-button": { width: 116, height: 116 },
  "character-detail-canvas": { width: 1672, height: 941 },
  "character-detail-name-plaque": { width: 119, height: 524 },
  "character-detail-portrait-area": { width: 448, height: 559 },
  "character-detail-biography": { width: 594, height: 221 },
  "character-detail-basic-info": { width: 931, height: 328 },
  "character-detail-ability-info": { width: 918, height: 169 },
  "character-detail-skill-info": { width: 918, height: 169 },
  "character-detail-actions": { width: 736, height: 52 },
  "character-detail-card-button": { width: 228, height: 52 },
  "character-detail-valuables-button": { width: 228, height: 52 },
  "character-detail-back-button": { width: 228, height: 52 },
};
