import type { LayoutEditorTargetId, UiLayoutBackgroundMode } from "../../domain/ui-layout";
import type { ScreenSchemaComponentKind } from "../../domain/ui/screen-schema";
import type { ScreenLayoutRect } from "../../domain/ui/screen-layout";
import type { ScreenSkinSlice } from "../../domain/ui/screen-skin";

type BuiltinReserveBackground = {
  assetId: string;
  imageUrl: string;
  mode: UiLayoutBackgroundMode;
  slice?: ScreenSkinSlice;
};

type BuiltinReserveComponent = {
  id: string;
  kind: ScreenSchemaComponentKind;
  rect: ScreenLayoutRect;
  background?: BuiltinReserveBackground;
};

type BuiltinReserveScreen = {
  id: LayoutEditorTargetId;
  canvas: {
    width: number;
    height: number;
  };
  components: BuiltinReserveComponent[];
};

function rect(
  x: number,
  y: number,
  width: number,
  height: number
): ScreenLayoutRect {
  return { x, y, width, height };
}

function background(
  assetId: string,
  imageUrl: string,
  mode: UiLayoutBackgroundMode,
  slice?: ScreenSkinSlice
): BuiltinReserveBackground {
  return {
    assetId,
    imageUrl,
    mode,
    ...(slice == null ? {} : { slice }),
  };
}

function component(
  id: string,
  kind: ScreenSchemaComponentKind,
  area: ScreenLayoutRect,
  skin?: BuiltinReserveBackground
): BuiltinReserveComponent {
  return {
    id,
    kind,
    rect: area,
    ...(skin == null ? {} : { background: skin }),
  };
}

const defaultSlice: ScreenSkinSlice = {
  top: 24,
  right: 24,
  bottom: 24,
  left: 24,
};

export const builtinUiReserveScreensById: Record<
  LayoutEditorTargetId,
  BuiltinReserveScreen
> = {
  "global-hud": {
    id: "global-hud",
    canvas: { width: 1600, height: 900 },
    components: [
      component(
        "portrait-frame",
        "portrait",
        rect(-21, -11, 178, 214),
        background(
          "ui.global-hud.portrait-frame.default",
          "/builtin/ui/global-hud/portrait-frame.png",
          "contain",
          defaultSlice
        )
      ),
      component(
        "status-board",
        "panel",
        rect(130, -13, 764, 219),
        background(
          "ui.global-hud.status-board.default",
          "/builtin/ui/global-hud/status-board.png",
          "contain",
          defaultSlice
        )
      ),
      component(
        "task-panel",
        "panel",
        rect(1335, -17, 248, 494),
        background(
          "ui.global-hud.task-panel.default",
          "/builtin/ui/global-hud/task-panel.png",
          "stretch",
          {
            top: 48,
            right: 32,
            bottom: 40,
            left: 32,
          }
        )
      ),
    ],
  },
  "start-screen": {
    id: "start-screen",
    canvas: { width: 1600, height: 900 },
    components: [
      component("main-menu-content", "panel", rect(350, 507, 553, 380)),
      component("main-menu-subtitle", "label", rect(49, 719, 420, 36)),
      component(
        "start-button",
        "button",
        rect(294, 616, 286, 286),
        background(
          "ui.start-screen.start-button.default",
          "/builtin/ui/start-screen/start-button.png",
          "contain",
          defaultSlice
        )
      ),
      component(
        "continue-button",
        "button",
        rect(369, 608, 201, 201),
        background(
          "ui.start-screen.continue-button.default",
          "/builtin/ui/start-screen/continue-button.png",
          "contain",
          defaultSlice
        )
      ),
    ],
  },
  "character-select-screen": {
    id: "character-select-screen",
    canvas: { width: 1600, height: 900 },
    components: [
      component("character-layout", "panel", rect(90, -40, 1600, 900)),
      component("character-hero", "panel", rect(34, 117, 190, 720)),
      component(
        "character-book",
        "panel",
        rect(211, 0, 1388, 783),
        background(
          "ui.character-select.book.default",
          "/builtin/ui/character-select/book.png",
          "contain",
          defaultSlice
        )
      ),
      component("character-tabs", "list", rect(340, 142, 110, 460)),
      component(
        "character-tab-characters",
        "button",
        rect(315, 109, 168, 211),
        background(
          "ui.character-select.tab.default",
          "/builtin/ui/character-select/tab.png",
          "contain",
          defaultSlice
        )
      ),
      component(
        "character-tab-roster",
        "button",
        rect(315, 285, 168, 210),
        background(
          "ui.character-select.tab.default",
          "/builtin/ui/character-select/tab.png",
          "contain",
          defaultSlice
        )
      ),
      component(
        "character-tab-ministers",
        "button",
        rect(315, 459, 168, 210),
        background(
          "ui.character-select.tab.default",
          "/builtin/ui/character-select/tab.png",
          "contain",
          defaultSlice
        )
      ),
      component("character-book-content", "panel", rect(447, 144, 988, 562)),
      component("character-grid", "list", rect(422, 126, 658, 508)),
      component(
        "character-card-1",
        "panel",
        rect(422, 126, 142, 242),
        background(
          "ui.character-select.card.default",
          "/builtin/ui/character-select/card.png",
          "contain",
          defaultSlice
        )
      ),
      component(
        "character-card-2",
        "panel",
        rect(594, 126, 142, 242),
        background(
          "ui.character-select.card.default",
          "/builtin/ui/character-select/card.png",
          "contain",
          defaultSlice
        )
      ),
      component(
        "character-card-3",
        "panel",
        rect(766, 126, 142, 242),
        background(
          "ui.character-select.card.default",
          "/builtin/ui/character-select/card.png",
          "contain",
          defaultSlice
        )
      ),
      component(
        "character-card-4",
        "panel",
        rect(938, 126, 142, 242),
        background(
          "ui.character-select.card.default",
          "/builtin/ui/character-select/card.png",
          "contain",
          defaultSlice
        )
      ),
      component(
        "character-card-5",
        "panel",
        rect(422, 392, 142, 242),
        background(
          "ui.character-select.card.default",
          "/builtin/ui/character-select/card.png",
          "contain",
          defaultSlice
        )
      ),
      component(
        "character-card-6",
        "panel",
        rect(594, 392, 142, 242),
        background(
          "ui.character-select.card.default",
          "/builtin/ui/character-select/card.png",
          "contain",
          defaultSlice
        )
      ),
      component(
        "character-card-7",
        "panel",
        rect(766, 392, 142, 242),
        background(
          "ui.character-select.card.default",
          "/builtin/ui/character-select/card.png",
          "contain",
          defaultSlice
        )
      ),
      component(
        "character-card-8",
        "panel",
        rect(938, 392, 142, 242),
        background(
          "ui.character-select.card.default",
          "/builtin/ui/character-select/card.png",
          "contain",
          defaultSlice
        )
      ),
      component("character-detail", "panel", rect(1110, 126, 292, 492)),
      component(
        "character-detail-paper",
        "panel",
        rect(1110, 126, 292, 492),
        background(
          "ui.character-select.detail-paper.default",
          "/builtin/ui/character-select/detail-paper.png",
          "stretch",
          defaultSlice
        )
      ),
      component("character-footer", "panel", rect(75, 715, 1392, 154)),
      component(
        "character-back-button",
        "button",
        rect(84, 724, 112, 112),
        background(
          "ui.character-select.back-button.default",
          "/builtin/ui/character-select/back-button.png",
          "contain",
          defaultSlice
        )
      ),
      component("character-pagination", "list", rect(672, 769, 318, 36)),
      component(
        "character-choose-button",
        "button",
        rect(1188, 692, 176, 176),
        background(
          "ui.character-select.choose-button.default",
          "/builtin/ui/character-select/choose-button.png",
          "contain",
          defaultSlice
        )
      ),
      component(
        "character-previous-page-button",
        "button",
        rect(1058, 724, 118, 118),
        background(
          "ui.character-select.previous-page-button.default",
          "/builtin/ui/character-select/previous-page-button.png",
          "contain",
          defaultSlice
        )
      ),
      component(
        "character-next-page-button",
        "button",
        rect(1372, 724, 116, 116),
        background(
          "ui.character-select.next-page-button.default",
          "/builtin/ui/character-select/next-page-button.png",
          "contain",
          defaultSlice
        )
      ),
    ],
  },
  "character-detail-screen": {
    id: "character-detail-screen",
    canvas: { width: 1672, height: 941 },
    components: [
      component(
        "character-detail-canvas",
        "panel",
        rect(-10, -14, 1635, 920),
        background(
          "ui.character-detail.canvas.default",
          "/builtin/ui/character-detail/canvas.png",
          "contain",
          defaultSlice
        )
      ),
      component(
        "character-detail-name-plaque",
        "label",
        rect(123, 58, 92, 406),
        background(
          "ui.character-detail.name-plaque.default",
          "/builtin/ui/character-detail/name-plaque.png",
          "contain",
          defaultSlice
        )
      ),
      component(
        "character-detail-portrait-area",
        "portrait",
        rect(219, 106, 385, 481)
      ),
      component(
        "character-detail-biography",
        "panel",
        rect(141, 613, 490, 182),
        background(
          "ui.character-detail.biography.default",
          "/builtin/ui/character-detail/biography.png",
          "stretch",
          defaultSlice
        )
      ),
      component(
        "character-detail-basic-info",
        "panel",
        rect(629, 104, 880, 310),
        background(
          "ui.character-detail.basic-info.default",
          "/builtin/ui/character-detail/basic-info.png",
          "contain",
          defaultSlice
        )
      ),
      component(
        "character-detail-ability-info",
        "panel",
        rect(620, 432, 888, 163),
        background(
          "ui.character-detail.ability-info.default",
          "/builtin/ui/character-detail/ability-info.png",
          "contain",
          defaultSlice
        )
      ),
      component(
        "character-detail-skill-info",
        "panel",
        rect(628, 627, 880, 162),
        background(
          "ui.character-detail.skill-info.default",
          "/builtin/ui/character-detail/skill-info.png",
          "stretch",
          defaultSlice
        )
      ),
      component("character-detail-actions", "panel", rect(869, 812, 736, 52)),
      component(
        "character-detail-card-button",
        "button",
        rect(808, 796, 228, 52),
        background(
          "ui.character-detail.card-button.default",
          "/builtin/ui/character-detail/card-button.png",
          "contain",
          defaultSlice
        )
      ),
      component(
        "character-detail-valuables-button",
        "button",
        rect(1043, 796, 228, 52),
        background(
          "ui.character-detail.valuables-button.default",
          "/builtin/ui/character-detail/valuables-button.png",
          "contain",
          defaultSlice
        )
      ),
      component(
        "character-detail-back-button",
        "button",
        rect(1277, 796, 228, 52),
        background(
          "ui.character-detail.back-button.default",
          "/builtin/ui/character-detail/back-button.png",
          "contain",
          defaultSlice
        )
      ),
    ],
  },
  "battle-ui-screen": {
    id: "battle-ui-screen",
    canvas: { width: 1600, height: 900 },
    components: [],
  },
};
