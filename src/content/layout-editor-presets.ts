import type {
  GlobalHudLayout,
  LayoutBackgroundAssetOption,
  StartScreenLayout,
  UiLayoutBackground,
  UiLayoutComponent,
  UiLayoutElement,
  UiLayoutRect,
  UiLayoutSlice,
} from "../domain/ui-layout";
import portraitFrameUrl from "../../yuansu/toukuang.png?url";
import statusBoardUrl from "../../yuansu/1_002_top_status_bar_1.0.png?url";
import taskPanelUrl from "../../yuansu/1_015_left_mission_panel_1.0.png?url";
import startButtonUrl from "../../yuansu/开局ui/start.png?url";
import continueButtonUrl from "../../yuansu/开局ui/continue.png?url";

const defaultSlice: UiLayoutSlice = {
  top: 24,
  right: 24,
  bottom: 24,
  left: 24,
};

const projectImageModules = import.meta.glob<{ default: string }>(
  [
    "/src/assets/**/*.{png,jpg,jpeg,webp,gif}",
    "/ui/**/*.{png,jpg,jpeg,webp,gif}",
    "/ui1/**/*.{png,jpg,jpeg,webp,gif}",
    "/yuansu/**/*.{png,jpg,jpeg,webp,gif}",
    "/sliced_ui_assets/**/*.{png,jpg,jpeg,webp,gif}",
    "/map/**/*.{png,jpg,jpeg,webp,gif}",
  ],
  { eager: true }
);

function normalizeAssetPath(path: string): string {
  return path.replace(/\\/g, "/");
}

function createAssetLabel(path: string): string {
  return path.startsWith("/") ? path.slice(1) : path;
}

function createAssetOption(path: string, imageUrl: string): LayoutBackgroundAssetOption {
  const normalizedPath = normalizeAssetPath(path);
  return {
    id: normalizedPath,
    label: createAssetLabel(normalizedPath),
    imageUrl,
  };
}

export const globalHudBackgroundOptions: LayoutBackgroundAssetOption[] = Object.entries(
  projectImageModules
)
  .map(([path, assetModule]) => createAssetOption(path, assetModule.default))
  .sort((left, right) => left.label.localeCompare(right.label, "zh-CN"));

function findAssetOption(
  path: string,
  fallbackUrl: string
): LayoutBackgroundAssetOption {
  return (
    globalHudBackgroundOptions.find((option) => option.id === path) ??
    createAssetOption(path, fallbackUrl)
  );
}

const portraitFrameAsset = findAssetOption("/yuansu/toukuang.png", portraitFrameUrl);
const statusBoardAsset = findAssetOption(
  "/yuansu/1_002_top_status_bar_1.0.png",
  statusBoardUrl
);
const taskPanelAsset = findAssetOption(
  "/yuansu/1_015_left_mission_panel_1.0.png",
  taskPanelUrl
);
const startButtonAsset = findAssetOption("/yuansu/开局ui/start.png", startButtonUrl);
const continueButtonAsset = findAssetOption(
  "/yuansu/开局ui/continue.png",
  continueButtonUrl
);

function createRect(
  x: number,
  y: number,
  width: number,
  height: number
): UiLayoutRect {
  return { x, y, width, height };
}

function createElement(
  id: string,
  label: string,
  rect: UiLayoutRect
): UiLayoutElement {
  return { id, label, rect };
}

function createBackground(
  asset: LayoutBackgroundAssetOption,
  mode: UiLayoutBackground["mode"],
  slice: UiLayoutSlice = defaultSlice
): UiLayoutBackground {
  return {
    assetId: asset.id,
    imageUrl: asset.imageUrl,
    mode,
    slice: { ...slice },
  };
}

function createComponent(input: {
  id: string;
  label: string;
  rect: UiLayoutRect;
  background: UiLayoutBackground | null;
  elements: UiLayoutElement[];
}): UiLayoutComponent {
  return {
    id: input.id,
    label: input.label,
    rect: input.rect,
    background: input.background,
    elements: input.elements,
  };
}

export function createDefaultGlobalHudLayout(): GlobalHudLayout {
  return {
    id: "global-hud",
    label: "顶部全局属性栏",
    screenSize: {
      width: 1600,
      height: 900,
    },
    components: [
      createComponent({
        id: "portrait-frame",
        label: "角色头像框",
        rect: createRect(-21, -11, 178, 214),
        background: createBackground(portraitFrameAsset, "contain"),
        elements: [
          createElement("portrait-label", "头像标签", createRect(53, 180, 72, 28)),
        ],
      }),
      createComponent({
        id: "status-board",
        label: "顶部属性板",
        rect: createRect(130, -13, 764, 219),
        background: createBackground(statusBoardAsset, "contain"),
        elements: [
          createElement("identity", "姓名/身份/日期", createRect(42, 38, 246, 56)),
          createElement("gold", "金钱", createRect(379, 46, 120, 34)),
          createElement("location", "地点", createRect(55, 137, 222, 44)),
          createElement("stamina", "体力", createRect(372, 122, 232, 28)),
          createElement("prestige", "威望", createRect(552, 70, 110, 72)),
        ],
      }),
      createComponent({
        id: "task-panel",
        label: "评定/任务面板",
        rect: createRect(1335, -17, 248, 494),
        background: createBackground(taskPanelAsset, "stretch", {
          top: 48,
          right: 32,
          bottom: 40,
          left: 32,
        }),
        elements: [
          createElement("review-item", "评定倒计时", createRect(24, 74, 200, 96)),
          createElement("mission-item", "当前任务", createRect(25, 154, 200, 144)),
        ],
      }),
    ],
  };
}

export function createDefaultStartScreenLayout(): StartScreenLayout {
  return {
    id: "start-screen",
    label: "开始界面",
    screenSize: {
      width: 1600,
      height: 900,
    },
    components: [
      createComponent({
        id: "main-menu-content",
        label: "主菜单内容组",
        rect: createRect(170, 416, 320, 220),
        background: null,
        elements: [],
      }),
      createComponent({
        id: "main-menu-subtitle",
        label: "主菜单副标题",
        rect: createRect(170, 416, 420, 36),
        background: null,
        elements: [],
      }),
      createComponent({
        id: "start-button",
        label: "开始游戏按钮",
        rect: createRect(170, 476, 136, 136),
        background: createBackground(startButtonAsset, "contain"),
        elements: [],
      }),
      createComponent({
        id: "continue-button",
        label: "继续游戏按钮",
        rect: createRect(328, 476, 136, 136),
        background: createBackground(continueButtonAsset, "contain"),
        elements: [],
      }),
    ],
  };
}
