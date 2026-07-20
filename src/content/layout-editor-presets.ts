import type {
  BattleUiScreenLayout,
  CharacterDetailScreenLayout,
  CharacterSelectScreenLayout,
  GlobalHudLayout,
  LayoutBackgroundAssetOption,
  StartScreenLayout,
  UiLayoutBackground,
  UiLayoutComponent,
  UiLayoutElement,
  UiLayoutRect,
  UiLayoutSlice,
} from "../domain/ui-layout";
const portraitFrameUrl = new URL("../../ui/yuansu/toukuang.png", import.meta.url)
  .href;
const statusBoardUrl = new URL(
  "../../ui/yuansu/1_002_top_status_bar_1.0.png",
  import.meta.url
).href;
const taskPanelUrl = new URL(
  "../../ui/yuansu/1_015_left_mission_panel_1.0.png",
  import.meta.url
).href;
const startButtonUrl = new URL("../../ui/yuansu/开局ui/start.png", import.meta.url)
  .href;
const continueButtonUrl = new URL(
  "../../ui/yuansu/开局ui/continue.png",
  import.meta.url
).href;
const characterSelectBookUrl = new URL(
  "../../ui/yuansu/人物选择ui/upload_1779790295652461983.png",
  import.meta.url
).href;
const characterSelectCardUrl = new URL(
  "../../ui/yuansu/人物选择ui/下载 (9).png",
  import.meta.url
).href;
const characterSelectTagUrl = new URL(
  "../../ui/yuansu/人物选择ui/下载 (7).png",
  import.meta.url
).href;
const characterSelectChooseButtonUrl = new URL(
  "../../ui/yuansu/人物选择ui/下载 (4).png",
  import.meta.url
).href;
const characterSelectBackButtonUrl = new URL(
  "../../ui/yuansu/人物选择ui/返回.png",
  import.meta.url
).href;
const characterSelectDetailPaperUrl = new URL(
  "../../ui/yuansu/人物选择ui/下载 (6).png",
  import.meta.url
).href;
const characterSelectPreviousPageButtonUrl = new URL(
  "../../ui/yuansu/人物选择ui/上一页.png",
  import.meta.url
).href;
const characterSelectNextPageButtonUrl = new URL(
  "../../ui/yuansu/人物选择ui/下一页.png",
  import.meta.url
).href;
const characterDetailNamePlaqueUrl = new URL(
  "../../ui/yuansu/具体面板ui/003_vertical_name_plaque_1.0.png",
  import.meta.url
).href;
const characterDetailBackUrl = new URL(
  "../../ui/yuansu/具体面板ui/back.png",
  import.meta.url
).href;
const characterDetailBasicInfoPanelUrl = new URL(
  "../../ui/yuansu/具体面板ui/005_panel_basic_info_with_tab_1.0.png",
  import.meta.url
).href;
const characterDetailAbilityInfoPanelUrl = new URL(
  "../../ui/yuansu/具体面板ui/006_panel_ability_info_with_tab_1.0.png",
  import.meta.url
).href;
const characterDetailSkillInfoPanelUrl = new URL(
  "../../ui/yuansu/具体面板ui/007_panel_skill_info_with_tab_1.0.png",
  import.meta.url
).href;
const characterDetailBiographyPanelUrl = new URL(
  "../../ui/yuansu/具体面板ui/011_panel_biography_1.0.png",
  import.meta.url
).href;
const characterDetailYellowButtonUrl = new URL(
  "../../ui/yuansu/具体面板ui/001_footer_button_yellow_1.0.png",
  import.meta.url
).href;
const characterDetailGreenButtonUrl = new URL(
  "../../ui/yuansu/具体面板ui/002_footer_button_green_1.0.png",
  import.meta.url
).href;

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
    "/map/**/*.{png,jpg,jpeg,webp,gif}",
  ],
  { eager: true }
);

function normalizeAssetPath(path: string): string {
  return path.replace(/\\/g, "/");
}

function createAssetLabel(path: string): string {
  const visiblePath = path.startsWith("/") ? path.slice(1) : path;
  const pathParts = visiblePath.split("/");
  const fileName = pathParts[pathParts.length - 1] ?? visiblePath;
  const directory = pathParts.slice(0, -1).join("/");
  return directory.length === 0 ? fileName : `${fileName} | ${directory}`;
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

const portraitFrameAsset = findAssetOption("/ui/yuansu/toukuang.png", portraitFrameUrl);
const statusBoardAsset = findAssetOption(
  "/ui/yuansu/1_002_top_status_bar_1.0.png",
  statusBoardUrl
);
const taskPanelAsset = findAssetOption(
  "/ui/yuansu/1_015_left_mission_panel_1.0.png",
  taskPanelUrl
);
const startButtonAsset = findAssetOption("/ui/yuansu/开局ui/start.png", startButtonUrl);
const continueButtonAsset = findAssetOption(
  "/ui/yuansu/开局ui/continue.png",
  continueButtonUrl
);
const characterSelectBookAsset = findAssetOption(
  "/ui/yuansu/人物选择ui/upload_1779790295652461983.png",
  characterSelectBookUrl
);
const characterSelectCardAsset = findAssetOption(
  "/ui/yuansu/人物选择ui/下载 (9).png",
  characterSelectCardUrl
);
const characterSelectTagAsset = findAssetOption(
  "/ui/yuansu/人物选择ui/下载 (7).png",
  characterSelectTagUrl
);
const characterSelectChooseButtonAsset = findAssetOption(
  "/ui/yuansu/人物选择ui/下载 (4).png",
  characterSelectChooseButtonUrl
);
const characterSelectBackButtonAsset = findAssetOption(
  "/ui/yuansu/人物选择ui/返回.png",
  characterSelectBackButtonUrl
);
const characterSelectDetailPaperAsset = findAssetOption(
  "/ui/yuansu/人物选择ui/下载 (6).png",
  characterSelectDetailPaperUrl
);
const characterSelectPreviousPageButtonAsset = findAssetOption(
  "/ui/yuansu/人物选择ui/上一页.png",
  characterSelectPreviousPageButtonUrl
);
const characterSelectNextPageButtonAsset = findAssetOption(
  "/ui/yuansu/人物选择ui/下一页.png",
  characterSelectNextPageButtonUrl
);
const characterDetailNamePlaqueAsset = findAssetOption(
  "/ui/yuansu/具体面板ui/003_vertical_name_plaque_1.0.png",
  characterDetailNamePlaqueUrl
);
const characterDetailBackAsset = findAssetOption(
  "/ui/yuansu/具体面板ui/back.png",
  characterDetailBackUrl
);
const characterDetailBasicInfoPanelAsset = findAssetOption(
  "/ui/yuansu/具体面板ui/005_panel_basic_info_with_tab_1.0.png",
  characterDetailBasicInfoPanelUrl
);
const characterDetailAbilityInfoPanelAsset = findAssetOption(
  "/ui/yuansu/具体面板ui/006_panel_ability_info_with_tab_1.0.png",
  characterDetailAbilityInfoPanelUrl
);
const characterDetailSkillInfoPanelAsset = findAssetOption(
  "/ui/yuansu/具体面板ui/007_panel_skill_info_with_tab_1.0.png",
  characterDetailSkillInfoPanelUrl
);
const characterDetailBiographyPanelAsset = findAssetOption(
  "/ui/yuansu/具体面板ui/011_panel_biography_1.0.png",
  characterDetailBiographyPanelUrl
);
const characterDetailYellowButtonAsset = findAssetOption(
  "/ui/yuansu/具体面板ui/001_footer_button_yellow_1.0.png",
  characterDetailYellowButtonUrl
);
const characterDetailGreenButtonAsset = findAssetOption(
  "/ui/yuansu/具体面板ui/002_footer_button_green_1.0.png",
  characterDetailGreenButtonUrl
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
        rect: createRect(350, 507, 553, 380),
        background: null,
        elements: [],
      }),
      createComponent({
        id: "main-menu-subtitle",
        label: "主菜单副标题",
        rect: createRect(49, 719, 420, 36),
        background: null,
        elements: [],
      }),
      createComponent({
        id: "start-button",
        label: "开始游戏按钮",
        rect: createRect(294, 616, 286, 286),
        background: createBackground(startButtonAsset, "contain"),
        elements: [],
      }),
      createComponent({
        id: "continue-button",
        label: "继续游戏按钮",
        rect: createRect(369, 608, 201, 201),
        background: createBackground(continueButtonAsset, "contain"),
        elements: [],
      }),
    ],
  };
}

const characterCardLayoutOrigin = {
  x: 422,
  y: 126,
};
const characterCardLayoutSize = {
  width: 142,
  height: 242,
};
const characterCardLayoutGap = {
  x: 30,
  y: 24,
};

function createCharacterCardComponents(): UiLayoutComponent[] {
  return Array.from({ length: 8 }, (_, index) => {
    const column = index % 4;
    const row = Math.floor(index / 4);

    return createComponent({
      id: `character-card-${index + 1}`,
      label: `人物卡片 ${index + 1}`,
      rect: createRect(
        characterCardLayoutOrigin.x +
          column * (characterCardLayoutSize.width + characterCardLayoutGap.x),
        characterCardLayoutOrigin.y +
          row * (characterCardLayoutSize.height + characterCardLayoutGap.y),
        characterCardLayoutSize.width,
        characterCardLayoutSize.height
      ),
      background: createBackground(characterSelectCardAsset, "contain"),
      elements: [
        createElement(
          "portrait",
          "头像区域",
          createRect(18, 20, characterCardLayoutSize.width - 36, 132)
        ),
        createElement(
          "meta",
          "卡片身份行",
          createRect(14, 151, characterCardLayoutSize.width - 28, 16)
        ),
        createElement(
          "name",
          "卡片姓名",
          createRect(20, 184, characterCardLayoutSize.width - 40, 28)
        ),
        createElement(
          "bio",
          "卡片简介",
          createRect(18, 210, characterCardLayoutSize.width - 36, 24)
        ),
        createElement(
          "placeholder-label",
          "占位标题",
          createRect(18, 162, characterCardLayoutSize.width - 36, 24)
        ),
        createElement(
          "placeholder-index",
          "占位卷号",
          createRect(18, 194, characterCardLayoutSize.width - 36, 18)
        ),
      ],
    });
  });
}

export function createDefaultCharacterSelectScreenLayout(): CharacterSelectScreenLayout {
  return {
    id: "character-select-screen",
    label: "选择人物界面",
    screenSize: {
      width: 1600,
      height: 900,
    },
    components: [
      createComponent({
        id: "character-layout",
        label: "人物选择整体布局",
        rect: createRect(90, -40, 1600, 900),
        background: null,
        elements: [],
      }),
      createComponent({
        id: "character-hero",
        label: "左侧标题栏",
        rect: createRect(34, 117, 190, 720),
        background: null,
        elements: [
          createElement("era", "时代印章", createRect(213, -19, 50, 50)),
          createElement("poem", "竖排说明", createRect(-176, 322, 70, 190)),
        ],
      }),
      createComponent({
        id: "character-book",
        label: "人物名册面板",
        rect: createRect(211, 0, 1388, 783),
        background: createBackground(characterSelectBookAsset, "contain"),
        elements: [],
      }),
      createComponent({
        id: "character-tabs",
        label: "名册分页签",
        rect: createRect(340, 142, 110, 460),
        background: null,
        elements: [],
      }),
      createComponent({
        id: "character-tab-characters",
        label: "人物传页签",
        rect: createRect(315, 109, 168, 211),
        background: createBackground(characterSelectTagAsset, "contain"),
        elements: [],
      }),
      createComponent({
        id: "character-tab-roster",
        label: "群雄录页签",
        rect: createRect(315, 285, 168, 210),
        background: createBackground(characterSelectTagAsset, "contain"),
        elements: [],
      }),
      createComponent({
        id: "character-tab-ministers",
        label: "名臣卷页签",
        rect: createRect(315, 459, 168, 210),
        background: createBackground(characterSelectTagAsset, "contain"),
        elements: [],
      }),
      createComponent({
        id: "character-book-content",
        label: "名册内容区",
        rect: createRect(447, 144, 988, 562),
        background: null,
        elements: [],
      }),
      createComponent({
        id: "character-grid",
        label: "人物卡片网格",
        rect: createRect(422, 126, 658, 508),
        background: null,
        elements: [],
      }),
      ...createCharacterCardComponents(),
      createComponent({
        id: "character-detail",
        label: "人物详情面板",
        rect: createRect(1110, 126, 292, 492),
        background: null,
        elements: [],
      }),
      createComponent({
        id: "character-detail-paper",
        label: "详情纸张内容",
        rect: createRect(1110, 126, 292, 492),
        background: createBackground(characterSelectDetailPaperAsset, "stretch"),
        elements: [
          createElement("eyebrow", "详情眉标", createRect(38, 34, 168, 18)),
          createElement("name", "详情姓名", createRect(38, 62, 166, 36)),
          createElement("subtitle", "详情副标题", createRect(38, 102, 204, 22)),
          createElement("badge", "已选徽章", createRect(218, 48, 48, 84)),
          createElement("stats", "属性列表", createRect(38, 146, 216, 218)),
          createElement("section-title", "简介标题", createRect(38, 378, 120, 20)),
          createElement("bio", "详情简介", createRect(38, 404, 216, 54)),
          createElement("empty", "空状态提示", createRect(38, 42, 210, 24)),
        ],
      }),
      createComponent({
        id: "character-footer",
        label: "底部操作区",
        rect: createRect(75, 715, 1392, 154),
        background: null,
        elements: [],
      }),
      createComponent({
        id: "character-back-button",
        label: "返回按钮",
        rect: createRect(84, 724, 112, 112),
        background: createBackground(characterSelectBackButtonAsset, "contain"),
        elements: [],
      }),
      createComponent({
        id: "character-pagination",
        label: "分页文字",
        rect: createRect(672, 769, 318, 36),
        background: null,
        elements: [
          createElement("left-ornament", "左侧分页纹样", createRect(0, 6, 132, 24)),
          createElement("text", "分页文本", createRect(124, -8, 118, 32)),
          createElement("right-ornament", "右侧分页纹样", createRect(186, 6, 132, 24)),
        ],
      }),
      createComponent({
        id: "character-choose-button",
        label: "开始冒险按钮",
        rect: createRect(1188, 692, 176, 176),
        background: createBackground(characterSelectChooseButtonAsset, "contain"),
        elements: [],
      }),
      createComponent({
        id: "character-previous-page-button",
        label: "上一页按钮",
        rect: createRect(1058, 724, 118, 118),
        background: createBackground(characterSelectPreviousPageButtonAsset, "contain"),
        elements: [],
      }),
      createComponent({
        id: "character-next-page-button",
        label: "下一页按钮",
        rect: createRect(1372, 724, 116, 116),
        background: createBackground(characterSelectNextPageButtonAsset, "contain"),
        elements: [],
      }),
    ],
  };
}

export function createDefaultCharacterDetailScreenLayout(): CharacterDetailScreenLayout {
  return {
    id: "character-detail-screen",
    label: "人物通用界面",
    screenSize: {
      width: 1672,
      height: 941,
    },
    components: [
      createComponent({
        id: "character-detail-canvas",
        label: "人物通用界面画布",
        rect: createRect(-10, -14, 1635, 920),
        background: createBackground(characterDetailBackAsset, "contain"),
        elements: [],
      }),
      createComponent({
        id: "character-detail-name-plaque",
        label: "人物姓名竖牌",
        rect: createRect(123, 58, 92, 406),
        background: createBackground(characterDetailNamePlaqueAsset, "contain"),
        elements: [
          createElement("name", "竖排姓名", createRect(14, 0, 58, 292)),
        ],
      }),
      createComponent({
        id: "character-detail-portrait-area",
        label: "人物展示区",
        rect: createRect(219, 106, 385, 481),
        background: null,
        elements: [],
      }),
      createComponent({
        id: "character-detail-biography",
        label: "人物简介面板",
        rect: createRect(141, 613, 490, 182),
        background: createBackground(characterDetailBiographyPanelAsset, "stretch"),
        elements: [
          createElement("lifespan", "生卒年份", createRect(66, 36, 274, 35)),
          createElement("bio", "人物简介", createRect(34, 74, 430, 70)),
        ],
      }),
      createComponent({
        id: "character-detail-basic-info",
        label: "基本情报面板",
        rect: createRect(629, 104, 880, 310),
        background: createBackground(characterDetailBasicInfoPanelAsset, "contain"),
        elements: [
          createElement("title", "基本情报标题", createRect(62, 10, 180, 42)),
          createElement("content", "基本情报内容", createRect(34, 64, 788, 218)),
        ],
      }),
      createComponent({
        id: "character-detail-ability-info",
        label: "能力情报面板",
        rect: createRect(620, 432, 888, 163),
        background: createBackground(characterDetailAbilityInfoPanelAsset, "contain"),
        elements: [
          createElement("title", "能力情报标题", createRect(62, 13, 180, 40)),
          createElement("content", "能力列表", createRect(41, 46, 777, 56)),
        ],
      }),
      createComponent({
        id: "character-detail-skill-info",
        label: "技能情报面板",
        rect: createRect(628, 627, 880, 162),
        background: createBackground(characterDetailSkillInfoPanelAsset, "stretch"),
        elements: [
          createElement("title", "技能情报标题", createRect(62, 3, 180, 40)),
          createElement("content", "技能列表", createRect(38, 42, 818, 92)),
        ],
      }),
      createComponent({
        id: "character-detail-actions",
        label: "底部按钮组",
        rect: createRect(869, 812, 736, 52),
        background: null,
        elements: [],
      }),
      createComponent({
        id: "character-detail-card-button",
        label: "卡片按钮",
        rect: createRect(808, 796, 228, 52),
        background: createBackground(characterDetailYellowButtonAsset, "contain"),
        elements: [],
      }),
      createComponent({
        id: "character-detail-valuables-button",
        label: "贵重品按钮",
        rect: createRect(1043, 796, 228, 52),
        background: createBackground(characterDetailGreenButtonAsset, "contain"),
        elements: [],
      }),
      createComponent({
        id: "character-detail-back-button",
        label: "返回按钮",
        rect: createRect(1277, 796, 228, 52),
        background: createBackground(characterDetailYellowButtonAsset, "contain"),
        elements: [],
      }),
    ],
  };
}

export function createDefaultBattleUiScreenLayout(): BattleUiScreenLayout {
  return {
    id: "battle-ui-screen",
    label: "战斗界面调整",
    screenSize: {
      width: 1600,
      height: 900,
    },
    components: [],
  };
}
