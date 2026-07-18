import { applyStaticLayoutBindings } from "../tools/live-layout-bindings";
import { mountOpeningBackgroundAnimation } from "./opening-background-animation";
import { resolveCharacterAvatarImageUrl } from "../portrait-assets";
import {
  createDefaultScriptEditorProjectDefinition,
  createScriptEditorWorkflowRecordDraft,
  getScriptEditorWorkflowVisibleFamilies,
  isScriptEditorMinimalWorkflowFamily,
  listScriptEditorWorkflowFamilyRecords,
  removeScriptEditorWorkflowRecord,
  updateScriptEditorWorkflowStoryPack,
  upsertScriptEditorWorkflowRecord,
} from "../../application/script-editor/minimal-workflow";
import { loadScriptEditorProjectFromFiles } from "../../application/script-editor/editor-project-loader";
import { loadScenarioPackFromFiles } from "../../application/scenario/scenario-pack-loader";
import { serializeScriptEditorProjectToFiles } from "../../application/script-editor/editor-project-save";
import { markScriptEditorProjectCompleteForExport } from "../../application/script-editor/project-completion-state";
import {
  exportScriptEditorProjectToScenarioPackFiles,
  validateScriptEditorProjectForRuntimeExport,
} from "../../application/script-editor/runtime-pack-export";
import { loadScriptEditorProjectFromScenarioPackUrl } from "../../application/script-editor/runtime-pack-import";
import {
  canContinueScriptEditorProjectEntry,
  createScriptEditorProjectLibraryEntry,
  findScriptEditorProjectLibraryEntry,
  removeScriptEditorProjectLibraryEntry,
  upsertScriptEditorProjectLibraryEntry,
} from "../../application/script-editor/project-workspace-library";
import {
  appendScriptEditorCityMountedBuilding,
  appendScriptEditorCityMountedBuildingNpc,
  appendScriptEditorLocationAttribute,
  appendScriptEditorMenuEntry,
  normalizeScriptEditorBuildingRecord,
  normalizeScriptEditorCityRecord,
  removeScriptEditorCityMountedBuilding,
  removeScriptEditorCityMountedBuildingNpc,
  removeScriptEditorLocationAttribute,
  removeScriptEditorMenuEntry,
  toggleScriptEditorMenuEntryFlag,
  updateScriptEditorAccessField,
  updateScriptEditorBuildingEntryBindingField,
  updateScriptEditorBuildingField,
  updateScriptEditorCityMountedBuilding,
  updateScriptEditorCityMountedBuildingNpc,
  updateScriptEditorCityMountedBuildingPrimaryNpc,
  updateScriptEditorCityField,
  updateScriptEditorLocationAttribute,
  updateScriptEditorMenuEntryField,
} from "../../application/script-editor/city-building-authoring";
import {
  appendScriptEditorPersonAttribute,
  appendScriptEditorPersonRelation,
  normalizeScriptEditorPersonRecord,
  removeScriptEditorPersonAttribute,
  removeScriptEditorPersonRelation,
  toggleScriptEditorPersonTradeEnabled,
  updateScriptEditorPersonAttribute,
  updateScriptEditorPersonField,
  updateScriptEditorPersonRelation,
} from "../../application/script-editor/person-authoring";
import { listScriptEditorPersonFieldDefinitions } from "../../application/script-editor/field-mapping";
import {
  appendScriptEditorMinigameLaunchPayloadEntry,
  appendScriptEditorMinigameOutcomeRoute,
  listScriptEditorBuiltinMinigameIntegrationOptions,
  listScriptEditorBuiltinMinigamePlayableOptions,
  normalizeScriptEditorMinigameRecord,
  removeScriptEditorMinigameLaunchPayloadEntry,
  removeScriptEditorMinigameOutcomeRoute,
  SCRIPT_EDITOR_MINIGAME_OUTCOMES,
  SCRIPT_EDITOR_MINIGAME_OWNER_KINDS,
  SCRIPT_EDITOR_MINIGAME_RETURN_POLICIES,
  SCRIPT_EDITOR_MINIGAME_TRIGGER_SOURCES,
  updateScriptEditorMinigameField,
  updateScriptEditorMinigameIntegration,
  updateScriptEditorMinigameLaunchPayloadField,
  updateScriptEditorMinigameOutcomeRouteField,
} from "../../application/script-editor/minigame-binding-authoring";
import {
  appendScriptEditorDialogueFollowUp,
  appendScriptEditorDialogueNode,
  appendScriptEditorDialogueParticipant,
  appendScriptEditorEventBindingConditionItem,
  appendScriptEditorEventRelationEntry,
  appendScriptEditorStoryNodeRelation,
  createDefaultScriptEditorEventBindingRecord,
  listScriptEditorEventBindingConditionFieldOptions,
  normalizeScriptEditorDialogueRecord,
  normalizeScriptEditorEventBindingRecord,
  normalizeScriptEditorEventRecord,
  normalizeScriptEditorStoryNodeRecord,
  removeScriptEditorDialogueFollowUp,
  removeScriptEditorDialogueNode,
  removeScriptEditorDialogueParticipant,
  removeScriptEditorEventBindingConditionItem,
  removeScriptEditorEventRelationEntry,
  removeScriptEditorStoryNodeRelation,
  SCRIPT_EDITOR_DIALOGUE_FOLLOWUP_FAMILIES,
  SCRIPT_EDITOR_DIALOGUE_NODE_TYPES,
  SCRIPT_EDITOR_EVENT_BINDING_CONDITION_GROUP_OPERATORS,
  SCRIPT_EDITOR_EVENT_DESTINATION_FAMILIES,
  SCRIPT_EDITOR_EVENT_TRIGGER_TIMINGS,
  SCRIPT_EDITOR_STORY_PROGRESS_MODES,
  toggleScriptEditorEventRepeatable,
  updateScriptEditorDialogueField,
  updateScriptEditorDialogueFollowUpField,
  updateScriptEditorDialogueNodeField,
  updateScriptEditorDialogueParticipant,
  updateScriptEditorEventBindingConditionItemField,
  updateScriptEditorEventBindingConditionOperator,
  updateScriptEditorEventBindingField,
  updateScriptEditorEventBindingOwnerField,
  updateScriptEditorEventBindingTriggerField,
  updateScriptEditorEventDestinationField,
  updateScriptEditorEventField,
  updateScriptEditorEventPreviewSummaryField,
  updateScriptEditorEventRelationField,
  updateScriptEditorStoryNodeField,
  updateScriptEditorStoryNodeRelation,
} from "../../application/script-editor/story-dialogue-event-authoring";
import { createScriptEditorWorkspaceShellViewModel } from "../../application/script-editor/workspace-shell";
import { renderScriptEditorWorkspaceView } from "../views/script-editor/script-editor-workspace-view";

const startScreenLayoutBindings = [
  { componentId: "main-menu-content", selector: ".c-main-ui-main-menu__content" },
  {
    componentId: "main-menu-subtitle",
    selector: ".c-main-ui-main-menu__subtitle",
    offsetComponentId: "main-menu-content",
  },
  {
    componentId: "start-button",
    selector: ".c-main-ui-image-button--start",
    offsetComponentId: "main-menu-content",
  },
  {
    componentId: "continue-button",
    selector: ".c-main-ui-image-button--continue",
    offsetComponentId: "main-menu-content",
  },
];

const characterCardLayoutElements = [
  {
    elementId: "portrait",
    selector: ":scope > .c-main-ui-character-card__portrait",
  },
  { elementId: "meta", selector: ".c-main-ui-character-card__meta" },
  { elementId: "name", selector: ".c-main-ui-character-card__name" },
  { elementId: "bio", selector: ".c-main-ui-character-card__bio" },
  {
    elementId: "placeholder-label",
    selector: ".c-main-ui-character-card__placeholder-label",
  },
  {
    elementId: "placeholder-index",
    selector: ".c-main-ui-character-card__placeholder-index",
  },
];

const characterCardLayoutBindings = Array.from({ length: 8 }, (_, index) => ({
  componentId: `character-card-${index + 1}`,
  selector: `.c-main-ui-character-grid > .c-main-ui-character-card:nth-child(${index + 1})`,
  offsetComponentId: "character-grid",
  elements: characterCardLayoutElements,
}));

const DEFAULT_SCRIPT_EDITOR_TEMPLATE_SCENARIO_PACK_URL = "/scenario-packs/zhuyuanzhang/pack.json";

const SCRIPT_EDITOR_EVENT_BINDING_CONDITION_TYPE_OPTIONS = [
  { value: "flag", label: "标记条件" },
  { value: "variable", label: "变量条件" },
  { value: "expression", label: "表达式条件" },
  { value: "custom", label: "自定义条件" },
  { value: "binding-context", label: "触发上下文条件" },
];

const SCRIPT_EDITOR_EVENT_BINDING_CONDITION_OPERATOR_LABELS = {
  all: "满足全部",
  any: "满足任一",
  not: "全部不满足",
  "==": "等于",
  "!=": "不等于",
  ">=": "大于等于",
  "<=": "小于等于",
  ">": "大于",
  "<": "小于",
  contains: "包含",
};

const SCRIPT_EDITOR_EVENT_BINDING_SOURCE_FAMILY_OPTIONS = [
  { value: "flag", label: "标记来源" },
  { value: "variable", label: "变量来源" },
  { value: "person", label: "人物属性" },
  { value: "city", label: "城市属性" },
  { value: "building", label: "建筑属性" },
  { value: "payload", label: "触发载荷" },
  { value: "binding-context", label: "触发上下文" },
  { value: "resolver", label: "解析器来源" },
  { value: "custom", label: "自定义来源" },
];

const SCRIPT_EDITOR_EVENT_BINDING_VALUE_TYPE_LABELS = {
  boolean: "布尔值",
  number: "数字",
  string: "文本",
  enum: "枚举",
  json: "结构数据",
};

const SCRIPT_EDITOR_EVENT_BINDING_OWNER_FAMILY_OPTIONS = [
  { value: "person", label: "人物" },
  { value: "city", label: "城市" },
  { value: "building", label: "建筑" },
  { value: "dialogue", label: "对话" },
  { value: "minigame", label: "小游戏" },
  { value: "story", label: "剧情节点" },
];

const SCRIPT_EDITOR_EVENT_BINDING_TRIGGER_ACTION_OPTIONS = [
  { value: "story-progress", label: "剧情推进" },
  { value: "city-enter", label: "进入城市" },
  { value: "building-enter", label: "进入建筑" },
  { value: "indoor-screen-shown", label: "进入室内界面" },
  { value: "dialogue-finished", label: "对话结束" },
  { value: "menu-select", label: "菜单选择" },
  { value: "minigame-settled", label: "小游戏结算" },
  { value: "custom", label: "自定义触发" },
];

const SCRIPT_EDITOR_EVENT_BINDING_TRIGGER_OPTIONS_BY_OWNER = {
  person: [
    { timing: "after", action: "custom", label: "人物自定义触发" },
  ],
  city: [
    { timing: "after", action: "city-enter", label: "进入城市后" },
  ],
  building: [
    { timing: "after", action: "building-enter", label: "进入建筑后" },
    { timing: "after", action: "indoor-screen-shown", label: "进入室内界面后" },
  ],
  dialogue: [
    { timing: "after", action: "dialogue-finished", label: "对话结束后" },
  ],
  minigame: [
    { timing: "after", action: "minigame-settled", label: "小游戏结算后" },
  ],
  story: [
    { timing: "after", action: "story-progress", label: "剧情推进后" },
  ],
};

const characterSelectLayoutBindings = [
  { componentId: "character-layout", selector: ".c-main-ui-character-layout" },
  {
    componentId: "character-hero",
    selector: ".c-main-ui-character-layout__hero",
    offsetComponentId: "character-layout",
    elements: [
      { elementId: "era", selector: ".c-main-ui-character-layout__era" },
      { elementId: "poem", selector: ".c-main-ui-character-layout__poem" },
    ],
  },
  {
    componentId: "character-book",
    selector: ".c-main-ui-character-book",
    offsetComponentId: "character-layout",
  },
  {
    componentId: "character-tabs",
    selector: ".c-main-ui-character-book__tabs",
    offsetComponentId: "character-book",
  },
  {
    componentId: "character-tab-characters",
    selector: ".c-main-ui-book-tab--characters",
    offsetComponentId: "character-tabs",
  },
  {
    componentId: "character-tab-roster",
    selector: ".c-main-ui-book-tab--roster",
    offsetComponentId: "character-tabs",
  },
  {
    componentId: "character-tab-ministers",
    selector: ".c-main-ui-book-tab--ministers",
    offsetComponentId: "character-tabs",
  },
  {
    componentId: "character-book-content",
    selector: ".c-main-ui-character-book__content",
    offsetComponentId: "character-book",
  },
  {
    componentId: "character-grid",
    selector: ".c-main-ui-character-grid",
    offsetComponentId: "character-book-content",
  },
  ...characterCardLayoutBindings,
  {
    componentId: "character-detail",
    selector: ".c-main-ui-character-detail",
    offsetComponentId: "character-book-content",
  },
  {
    componentId: "character-detail-paper",
    selector: ".c-main-ui-character-detail__paper",
    offsetComponentId: "character-detail",
    elements: [
      { elementId: "eyebrow", selector: ".c-main-ui-character-detail__eyebrow" },
      { elementId: "name", selector: ".c-main-ui-character-detail__name" },
      { elementId: "subtitle", selector: ".c-main-ui-character-detail__subtitle" },
      { elementId: "badge", selector: ".c-main-ui-character-detail__badge" },
      { elementId: "stats", selector: ".c-main-ui-character-detail__stats" },
      { elementId: "section-title", selector: ".c-main-ui-character-detail__section-title" },
      { elementId: "bio", selector: ".c-main-ui-character-detail__bio" },
      { elementId: "empty", selector: ".c-main-ui-character-detail__empty" },
    ],
  },
  {
    componentId: "character-footer",
    selector: ".c-main-ui-character-book__footer",
    offsetComponentId: "character-book",
  },
  {
    componentId: "character-back-button",
    selector: ".c-main-ui-page-button",
    offsetComponentId: "character-footer",
  },
  {
    componentId: "character-pagination",
    selector: ".c-main-ui-book-pagination",
    offsetComponentId: "character-footer",
    elements: [
      {
        elementId: "left-ornament",
        selector: ":scope > .c-main-ui-book-pagination__ornament:nth-child(1)",
      },
      { elementId: "text", selector: ":scope > span:nth-child(2)" },
      {
        elementId: "right-ornament",
        selector: ":scope > .c-main-ui-book-pagination__ornament:nth-child(3)",
      },
    ],
  },
  {
    componentId: "character-choose-button",
    selector: ".c-main-ui-image-button--choose",
    offsetComponentId: "character-footer",
  },
  {
    componentId: "character-previous-page-button",
    selector: ".c-main-ui-page-turn-button--previous",
    offsetComponentId: "character-footer",
  },
  {
    componentId: "character-next-page-button",
    selector: ".c-main-ui-page-turn-button--next",
    offsetComponentId: "character-footer",
  },
];

const SCRIPT_EDITOR_SECONDARY_LIST_PAGE_SIZE = 6;
const SCRIPT_EDITOR_PERSON_ATTRIBUTE_PAGE_SIZE = 10;

export class MainUiFlow {
  constructor(options) {
    this.overlayRoot = options.overlayRoot;
    this.characters = [...options.characters];
    this.scenarioPacks = [...(options.scenarioPacks ?? [])];
    this.onStartGame = options.onStartGame;
    this.onContinueGame = options.onContinueGame;
    this.onStartScenarioPack = options.onStartScenarioPack;
    this.onStartLoadedScenarioPack = options.onStartLoadedScenarioPack;
    this.onImportScenarioPackFiles = options.onImportScenarioPackFiles;
    this.loadSaveData = options.loadSaveData;
    this.getAppState = options.getAppState;
    this.selectedCharacterId = this.characters[0]?.id ?? null;
    this.currentScreen = "main-menu";
    this.handleClick = (event) => {
      void this.onClick(event);
    };
    this.handleHover = (event) => {
      this.onHover(event);
    };
    this.handleFocus = (event) => {
      this.onFocus(event);
    };
    this.handleChange = (event) => {
      void this.onChange(event);
    };
    this.handleInput = (event) => {
      this.onInput(event);
    };
    this.handleCompositionEnd = (event) => {
      this.onCompositionEnd(event);
    };
    this.inkParticleSystem = null;
    this.pendingSelectedInkBurstCharacterId = null;
    this.previousCharacterDetail = null;
    this.characterDetailTransitionToken = 0;
    this.characterDetailTransitionTimer = 0;
    this.destroyOpeningBackgroundAnimation = null;
    this.scriptEditorProject = null;
    this.scriptEditorSelection = {
      family: "storyPack",
      entityId: null,
    };
    this.scriptEditorNotice = null;
    this.scriptEditorNoticeEntries = [];
    this.scriptEditorNoticeSequence = 0;
    this.scriptEditorProjectDirectoryHandle = null;
    this.scriptEditorExportDirectoryHandle = null;
    this.scriptEditorProjectLibrary = [];
    this.scriptEditorProjectSource = "new";
    this.scriptEditorPendingDeleteProjectId = null;
    this.scriptEditorAuxiliaryPanelOpen = false;
    this.scriptEditorPersonTab = "profile";
    this.scriptEditorLocationTab = "profile";
    this.scriptEditorNarrativeTab = "profile";
    this.scriptEditorEventTab = "basics";
    this.scriptEditorMinigameTab = "basics";
    this.scriptEditorRecordListPages = {};
    this.scriptEditorRecordSearch = {
      people: "",
    };
    this.scriptEditorPersonAttributePage = 1;
    this.scriptEditorPersonAttributeVisibleIndices = null;
    this.scriptEditorPersonAttributeScrollLeft = 0;
    this.scriptEditorScrollTop = 0;
    this.scriptEditorRuntimePreviewSession = null;
  }

  mount() {
    this.overlayRoot.classList.add("c-main-ui-overlay");
    this.overlayRoot.addEventListener("click", this.handleClick);
    this.overlayRoot.addEventListener("mouseover", this.handleHover);
    this.overlayRoot.addEventListener("focusin", this.handleFocus);
    this.overlayRoot.addEventListener("change", this.handleChange);
    this.overlayRoot.addEventListener("input", this.handleInput);
    this.overlayRoot.addEventListener("compositionend", this.handleCompositionEnd);
    this.render();
  }

  destroy() {
    this.overlayRoot.removeEventListener("click", this.handleClick);
    this.overlayRoot.removeEventListener("mouseover", this.handleHover);
    this.overlayRoot.removeEventListener("focusin", this.handleFocus);
    this.overlayRoot.removeEventListener("change", this.handleChange);
    this.overlayRoot.removeEventListener("input", this.handleInput);
    this.overlayRoot.removeEventListener("compositionend", this.handleCompositionEnd);
    this.destroyInkParticleSystem();
    this.destroyOpeningBackgroundAnimation?.();
    this.destroyOpeningBackgroundAnimation = null;
    this.clearCharacterDetailTransitionTimer();
    this.overlayRoot.className = "";
    this.overlayRoot.innerHTML = "";
  }

  showMainMenu() {
    this.setScreen("main-menu");
  }

  hide() {
    this.setScreen("hidden");
  }

  showCharacterSelect() {
    this.setScreen("character-select");
  }

  setCharacters(characters) {
    this.characters = [...characters];
    if (this.characters.some((character) => character.id === this.selectedCharacterId)) {
      if (this.currentScreen === "character-select") {
        this.render();
      }
      return;
    }

    this.selectedCharacterId = this.characters[0]?.id ?? null;
    if (this.currentScreen === "character-select") {
      this.render();
    }
  }

  showScriptEditorLanding() {
    this.setScreen("script-editor-landing");
  }

  setScreen(screen) {
    this.currentScreen = screen;
    this.overlayRoot.classList.toggle("is-hidden", screen === "hidden");
    this.render();
  }

  render() {
    this.captureScriptEditorScrollPosition();
    this.destroyInkParticleSystem();
    this.destroyOpeningBackgroundAnimation?.();
    this.destroyOpeningBackgroundAnimation = null;
    this.clearCharacterDetailTransitionTimer();

    if (this.currentScreen === "hidden") {
      this.overlayRoot.innerHTML = "";
      return;
    }

    const screenMarkup =
      this.currentScreen === "main-menu"
        ? this.renderMainMenu()
        : this.currentScreen === "scenario-select"
          ? this.renderScenarioSelect()
          : this.currentScreen === "script-editor-landing"
            ? this.renderScriptEditorLanding()
            : this.currentScreen === "script-editor-workspace"
              ? this.renderScriptEditorWorkspace()
              : this.currentScreen === "runtime-preview"
                ? this.renderRuntimePreviewOverlay()
                : this.renderCharacterSelect();
    this.overlayRoot.innerHTML = screenMarkup;
    this.restoreScriptEditorScrollPosition();
    if (this.currentScreen === "main-menu") {
      this.destroyOpeningBackgroundAnimation = mountOpeningBackgroundAnimation(this.overlayRoot);
      this.syncStartScreenLayout();
    } else if (this.currentScreen === "character-select") {
      this.syncCharacterSelectLayout();
      this.setupCharacterSelectInkParticles();
      this.scheduleCharacterDetailTransitionCleanup();
    }
  }

  captureScriptEditorScrollPosition() {
    const scriptEditorScreen = this.overlayRoot.querySelector(
      ".c-main-ui-screen--script-editor-flow"
    );
    if (scriptEditorScreen instanceof globalThis.HTMLElement) {
      this.scriptEditorScrollTop = scriptEditorScreen.scrollTop;
    }

    const personAttributeList = this.overlayRoot.querySelector(
      ".c-script-editor-person-summary__list"
    );
    if (personAttributeList instanceof globalThis.HTMLElement) {
      this.scriptEditorPersonAttributeScrollLeft = personAttributeList.scrollLeft;
    }
  }

  restoreScriptEditorScrollPosition() {
    const scriptEditorScreen = this.overlayRoot.querySelector(
      ".c-main-ui-screen--script-editor-flow"
    );
    if (scriptEditorScreen instanceof globalThis.HTMLElement) {
      scriptEditorScreen.scrollTop = this.scriptEditorScrollTop;
    }

    const personAttributeList = this.overlayRoot.querySelector(
      ".c-script-editor-person-summary__list"
    );
    if (personAttributeList instanceof globalThis.HTMLElement) {
      personAttributeList.scrollLeft = this.scriptEditorPersonAttributeScrollLeft;
    }
  }

  syncStartScreenLayout() {
    const appState = this.getAppState();
    applyStaticLayoutBindings({
      root: this.overlayRoot,
      layout: appState.uiLayouts["start-screen"],
      bindings: startScreenLayoutBindings,
    });
  }

  syncCharacterSelectLayout() {
    const appState = this.getAppState();
    applyStaticLayoutBindings({
      root: this.overlayRoot,
      layout: appState.uiLayouts["character-select-screen"],
      bindings: characterSelectLayoutBindings,
    });
  }

  renderMainMenu() {
    return `
      <section class="c-main-ui-screen c-main-ui-screen--main-menu" aria-label="主菜单">
        <canvas class="c-main-ui-opening-background-canvas" aria-hidden="true"></canvas>
        <div class="c-main-ui-main-menu">
          <div class="c-main-ui-main-menu__content">
            <p class="c-main-ui-main-menu__subtitle">洪武前夜 · 群雄并起</p>
            <div class="c-main-ui-main-menu__actions">
          <button
            type="button"
                class="c-main-ui-image-button c-main-ui-image-button--start"
            data-main-ui-action="open-character-select"
                aria-label="开始游戏"
          >
                <span class="c-main-ui-sr-only">开始游戏</span>
          </button>
          <button
            type="button"
                class="c-main-ui-image-button c-main-ui-image-button--continue"
            data-main-ui-action="continue-game"
                aria-label="继续游戏"
          >
                <span class="c-main-ui-sr-only">继续游戏</span>
          </button>
          <button
            type="button"
            class="c-main-ui-json-button"
            data-main-ui-action="open-json-scenario-select"
          >
            JSON 开局
          </button>
          <button
            type="button"
            class="c-main-ui-json-button c-main-ui-json-button--script-editor"
            data-main-ui-action="open-script-editor"
          >
            剧本编辑器          </button>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  renderScenarioSelect() {
    return `
      <section class="c-main-ui-screen c-main-ui-screen--scenario-select" aria-label="JSON 开局选择">
        <div class="c-main-ui-scenario-panel">
          <header class="c-main-ui-scenario-panel__header">
            <p class="c-main-ui-character-detail__eyebrow">模组开局</p>
            <h2 class="c-main-ui-scenario-panel__title">读取 JSON 开局</h2>
          </header>

          <div class="c-main-ui-scenario-list">
            ${this.scenarioPacks.map((scenarioPack) => this.renderScenarioPackCard(scenarioPack)).join("")}
          </div>

          <div class="c-main-ui-scenario-panel__footer">
            <button type="button" class="c-main-ui-page-button" data-main-ui-action="back-to-menu" aria-label="返回主菜单"></button>
            <button type="button" class="c-main-ui-json-text-button" data-main-ui-action="import-scenario-file">
              导入 JSON
            </button>
            <input class="c-main-ui-scenario-file-input" type="file" accept="application/json,.json" data-main-ui-scenario-file webkitdirectory directory multiple hidden>
          </div>
        </div>
      </section>
    `;
  }

  renderScenarioPackCard(scenarioPack) {
    return `
      <article class="c-main-ui-scenario-card">
        <div>
          <h3 class="c-main-ui-scenario-card__title">${escapeHtml(scenarioPack.title)}</h3>
          <p class="c-main-ui-scenario-card__description">${escapeHtml(scenarioPack.description ?? "")}</p>
        </div>
        <button
          type="button"
          class="c-main-ui-json-text-button c-main-ui-json-text-button--accent"
          data-main-ui-action="start-scenario-pack"
          data-scenario-pack-id="${escapeHtml(scenarioPack.id)}"
        >
          读取
        </button>
      </article>
    `;
  }

  renderLegacyScriptEditorLanding() {
    const hasSession = this.scriptEditorProject != null;

    return `
      <section class="c-main-ui-screen c-main-ui-screen--script-editor-flow" aria-label="剧本编辑器入口">
        <div class="c-script-editor-landing">
          ${this.renderScriptEditorNotice()}

          <div class="c-script-editor-landing__actions">
            <button type="button" class="c-main-ui-json-text-button c-main-ui-json-text-button--accent" data-script-editor-action="new-project">
              新建剧本
            </button>
            <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="open-project">
              打开草稿
            </button>
            <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="import-pack">
              使用模板
            </button>
            ${
              hasSession
                ? `
                  <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="continue-session">
                    继续当前项目
                  </button>
                `
                : ""
            }
            <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="back-to-menu">
              返回
            </button>
            <button
              type="button"
              class="c-script-editor-landing__help-button"
              aria-label="帮助"
              title="帮助"
            >
              ?
            </button>
          </div>

          ${this.renderScriptEditorFileInputs()}
        </div>
      </section>
    `;
  }

  renderScriptEditorLanding() {
    const projectLibraryEntries = this.getScriptEditorProjectLibraryEntries();

    return `
      <section class="c-main-ui-screen c-main-ui-screen--script-editor-flow" aria-label="剧本编辑器入口">
        <div class="c-script-editor-landing">
          ${this.renderScriptEditorNotice()}

          <div class="c-script-editor-landing__actions">
            <button type="button" class="c-main-ui-json-text-button c-main-ui-json-text-button--accent" data-script-editor-action="new-project">
              新建剧本
            </button>
            <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="open-project">
              打开草稿
            </button>
            <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="import-pack">
              使用模板
            </button>
            <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="back-to-menu">
              返回
            </button>
            <button
              type="button"
              class="c-script-editor-landing__help-button"
              aria-label="帮助"
              title="帮助"
            >
              ?
            </button>
          </div>

          ${this.renderScriptEditorProjectLibrary(projectLibraryEntries)}

          ${this.renderScriptEditorFileInputs()}
        </div>
      </section>
    `;
  }

  renderScriptEditorWorkspace() {
    if (this.scriptEditorProject == null) {
      this.showScriptEditorLanding();
      return "";
    }

    const workspace = createScriptEditorWorkspaceShellViewModel({
      project: this.scriptEditorProject,
      selection: this.scriptEditorSelection,
      visibleFamilies: getScriptEditorWorkflowVisibleFamilies(),
      auxiliaryPanelOpen: this.scriptEditorAuxiliaryPanelOpen,
    });

    return `
      <section class="c-main-ui-screen c-main-ui-screen--script-editor-flow" aria-label="剧本编辑器工作流">
        ${this.renderScriptEditorFileInputs()}
        ${renderScriptEditorWorkspaceView(
          workspace,
          this.renderScriptEditorEditorPanel()
        )}
      </section>
    `;
  }

  renderRuntimePreviewOverlay() {
    return `
      <section class="c-main-ui-screen c-main-ui-screen--runtime-preview" aria-label="运行预览">
        <button class="c-runtime-preview-exit" type="button" data-script-editor-action="exit-runtime-preview">
          退出预览        </button>
      </section>
    `;
  }

  renderScriptEditorEditorPanel() {
    if (this.scriptEditorProject == null) {
      return "";
    }

    if (this.scriptEditorSelection.family === "storyPack") {
      const storyPack = this.scriptEditorProject.storyPack;
      const scenarioProfile = storyPack.scenarioProfile ?? {};
      const initialLocation = scenarioProfile.initialLocation ?? {};
      const launchPolicy = scenarioProfile.launchPolicy ?? {};
      const createRecordOption = (record) => ({
        value: record.id,
        label: `${record.title ?? record.name ?? record.label ?? record.id} (${record.id})`,
      });
      const initialViewOptions = [
        { value: "map", label: "地图" },
        { value: "city", label: "城市" },
        { value: "house", label: "建筑" },
        { value: "scene", label: "场景" },
      ];
      const characterSelectionOptions = [
        { value: "shell", label: "开局时选择角色" },
        { value: "fixed", label: "使用默认角色直接开始" },
      ];
      const defaultRoleOptions = this.scriptEditorProject.people
        .filter((person) => person.personType === "角色")
        .map(createRecordOption);
      const cityOptions = this.scriptEditorProject.cities.map(createRecordOption);
      const buildingOptions = this.scriptEditorProject.buildings.map(createRecordOption);
      const sceneOptions = this.scriptEditorProject.scenes.map(createRecordOption);
      const exportDiagnostics = validateScriptEditorProjectForRuntimeExport(
        this.scriptEditorProject
      );
      const compatibilityResidueCount = this.countScriptEditorCompatibilityResidue();

      return `
        <div class="c-script-editor-editor-card">
          <header class="c-script-editor-editor-card__header">
            <div>
              <p class="c-script-editor-editor-card__eyebrow">项目总览</p>
              <h2 class="c-script-editor-editor-card__title">项目根信息</h2>
            </div>
            <div class="c-script-editor-editor-card__actions">
              <button
                type="button"
                class="c-main-ui-json-text-button c-main-ui-json-text-button--accent"
                data-script-editor-action="save"
              >
                保存项目
              </button>
            </div>
          </header>
          <!-- SCRIPT_EDITOR_INSPECTOR_SLOT -->
          <div class="c-script-editor-shell__cards c-script-editor-editor-card__overview">
            ${this.renderScriptEditorOverviewCard(
              "项目状态",
              `当前项目 ${this.scriptEditorProject.id} 以 ${scenarioProfile.id ?? "未设置"} 作为开场场景，默认主角为 ${scenarioProfile.playerCharacterId ?? "未设置"}。`,
              "success"
            )}
            ${this.renderScriptEditorOverviewCard(
              "创作进度",
              `当前已收录人物 ${this.scriptEditorProject.people.length} 条、文本 ${this.scriptEditorProject.textEntries.length} 条、剧情节点 ${this.scriptEditorProject.storyNodes.length} 条、事件 ${this.scriptEditorProject.events.length} 条。`,
              "neutral"
            )}
            ${this.renderScriptEditorOverviewCard(
              "风险与阻塞",
              this.describeScriptEditorProjectRisk(exportDiagnostics, compatibilityResidueCount),
              exportDiagnostics.length === 0 && compatibilityResidueCount === 0 ? "success" : "warning"
            )}
            ${this.renderScriptEditorOverviewCard(
              "下一步建议",
              "继续从左侧对象导航进入正式作者面；当前优先推进人物作者面与关系入口，城市、建筑、菜单和更深剧情编辑保持后续队列承接。",
              "neutral"
            )}
          </div>
          <div class="c-script-editor-form-grid">
            ${this.renderScriptEditorField("project.title", "项目标题", this.scriptEditorProject.title)}
            ${this.renderScriptEditorField("project.description", "项目说明", this.scriptEditorProject.description ?? "")}
            ${this.renderScriptEditorField("storyPack.title", "剧本包标题", storyPack.title)}
            ${this.renderScriptEditorField("storyPack.description", "剧本包说明", storyPack.description ?? "")}
            ${this.renderScriptEditorField("scenarioProfile.title", "开场场景标题", scenarioProfile.title ?? "")}
            ${this.renderScriptEditorStartupSelect("initialView", "开局视图", initialViewOptions, launchPolicy.initialView ?? initialLocation.view ?? "", "未设置开局视图")}
            ${this.renderScriptEditorStartupSelect("cityId", "开局城市", cityOptions, initialLocation.cityId ?? "", "未设置开局城市")}
            ${this.renderScriptEditorStartupSelect("houseId", "开局建筑", buildingOptions, initialLocation.houseId ?? "", "未设置开局建筑")}
            ${this.renderScriptEditorStartupSelect("sceneId", "开局场景", sceneOptions, initialLocation.sceneId ?? "", "未设置开局场景")}
            ${this.renderScriptEditorField("scenarioProfile.entryEventId", "入口事件 ID", scenarioProfile.entryEventId ?? "")}
            ${this.renderScriptEditorStartupSelect("characterSelection", "角色选择策略", characterSelectionOptions, launchPolicy.characterSelection ?? "", "未设置角色选择策略")}
            ${this.renderScriptEditorStartupSelect("playerCharacterId", "默认角色", defaultRoleOptions, scenarioProfile.playerCharacterId ?? "", "未设置默认角色")}
            ${this.renderScriptEditorField("scenarioProfile.launchPolicy.entryEventTiming", "入口事件时机", launchPolicy.entryEventTiming ?? "")}
          </div>
          ${this.renderScriptEditorSystemDetails(
            "高级设置与系统信息",
            "项目标识、开场目标和底层定位字段默认折叠，避免首屏被工程字段占满。",
            `
              <div class="c-script-editor-form-grid">
                ${this.renderScriptEditorField("project.id", "项目 ID", this.scriptEditorProject.id)}
                ${this.renderScriptEditorField("storyPack.id", "剧本包 ID", storyPack.id)}
                ${this.renderScriptEditorField("scenarioProfile.id", "开场场景 ID", scenarioProfile.id ?? "")}
                ${this.renderScriptEditorField("scenarioProfile.chapterId", "章节 ID", scenarioProfile.chapterId ?? "")}
                ${this.renderScriptEditorField("scenarioProfile.initialLocation.mapId", "初始地图 ID", initialLocation.mapId ?? "")}
              </div>
            `
          )}
        </div>
      `;
    }

    const family = this.scriptEditorSelection.family;
    const records = listScriptEditorWorkflowFamilyRecords(
      this.scriptEditorProject,
      family
    );
    const selectedRecord =
      records.find((record) => record.id === this.scriptEditorSelection.entityId) ??
      records[0] ??
      null;
    const selectedRecordJson =
      selectedRecord == null ? "{}" : JSON.stringify(selectedRecord, null, 2);
    const isDeferredFamily = family === "storyNodes";

    if (family === "people") {
      return this.renderScriptEditorPeopleEditor(records, selectedRecord);
    }

    if (family === "cities" || family === "buildings") {
      return this.renderScriptEditorLocationEditor(family, records, selectedRecord);
    }

    if (family === "storyNodes") {
      return this.renderScriptEditorStoryNodeEditor(records, selectedRecord);
    }

    if (family === "dialogues") {
      return this.renderScriptEditorDialogueEditor(records, selectedRecord);
    }

    if (family === "events") {
      return this.renderScriptEditorEventEditor(records, selectedRecord);
    }

    if (family === "eventBindings") {
      return this.renderScriptEditorEventBindingsEditor(records, selectedRecord);
    }

    if (family === "minigames") {
      return this.renderScriptEditorMinigameEditor(records, selectedRecord);
    }

    if (family === "textEntries") {
      return this.renderScriptEditorTextEntryEditor(records, selectedRecord);
    }

    return `
      <div class="c-script-editor-editor-card">
        <header class="c-script-editor-editor-card__header">
          <div>
            <p class="c-script-editor-editor-card__eyebrow">对象作者面</p>
            <h2 class="c-script-editor-editor-card__title">${escapeHtml(this.getScriptEditorFamilyLabel(family))}</h2>
          </div>
          <div class="c-script-editor-editor-card__actions">
            <button
              type="button"
              class="c-main-ui-json-text-button c-main-ui-json-text-button--accent"
              data-script-editor-action="apply-record-json"
              ${selectedRecord == null ? "disabled" : ""}
            >
              应用 JSON
            </button>
          </div>
        </header>

        ${
          isDeferredFamily
            ? `
              <p class="c-script-editor-editor-card__hint">
                剧情节点当前仍是受边界约束的占位作者面。可以继续编辑，但在后续队列补齐编译路径前，运行时导出仍会保持失败关闭。              </p>
            `
            : ""
        }

        <div class="c-script-editor-record-layout">
          ${this.renderScriptEditorPaginatedRecordList({
            family,
            records,
            ariaLabel: "对象列表",
            toolbar: `
              <div class="c-script-editor-record-list__toolbar">
                <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-record">
                  新增
                </button>
                <button
                  type="button"
                  class="c-main-ui-json-text-button"
                  data-script-editor-action="remove-record"
                  ${selectedRecord == null ? "disabled" : ""}
                >
                  删除
                </button>
              </div>
            `,
            renderRecord: (record) => `
              <button
                type="button"
                class="c-script-editor-record-list__item ${record.id === selectedRecord?.id ? "is-selected" : ""}"
                data-script-editor-record-id="${escapeHtml(record.id)}"
              >
                <strong>${escapeHtml(this.getScriptEditorRecordLabel(record))}</strong>
                <span>${escapeHtml(record.id)}</span>
              </button>
            `,
          })}
          <div class="c-script-editor-record-editor">
            <!-- SCRIPT_EDITOR_INSPECTOR_SLOT -->
            <textarea
              class="c-script-editor-record-editor__textarea"
              data-script-editor-record-json
              spellcheck="false"
            >${escapeHtml(selectedRecordJson)}</textarea>
          </div>
        </div>
      </div>
    `;
  }

  renderScriptEditorTextEntryEditor(records, selectedRecord) {
    const selectedText = typeof selectedRecord?.text === "string" ? selectedRecord.text : "";

    return `
      <div class="c-script-editor-editor-card">
        <div class="c-script-editor-record-layout">
          ${this.renderScriptEditorPaginatedRecordList({
            family: "textEntries",
            records,
            ariaLabel: "文本列表",
            toolbar: `
              <div class="c-script-editor-record-list__toolbar">
                <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-record">
                  新增
                </button>
                <button
                  type="button"
                  class="c-main-ui-json-text-button"
                  data-script-editor-action="remove-record"
                  ${selectedRecord == null ? "disabled" : ""}
                >
                  删除
                </button>
              </div>
            `,
            renderRecord: (record) => `
              <button
                type="button"
                class="c-script-editor-record-list__item c-script-editor-record-list__item--text-entry ${record.id === selectedRecord?.id ? "is-selected" : ""}"
                data-script-editor-record-id="${escapeHtml(record.id)}"
                title="${escapeHtml(this.getScriptEditorRecordLabel(record))}"
              >
                <strong class="c-script-editor-record-list__title c-script-editor-record-list__title--clamp-2">${escapeHtml(this.getScriptEditorRecordLabel(record))}</strong>
              </button>
            `,
          })}
          <div class="c-script-editor-record-editor">
            <!-- SCRIPT_EDITOR_INSPECTOR_SLOT -->
            <!-- SCRIPT_EDITOR_INSPECTOR_SUPPRESS_TEXT -->
            <template data-script-editor-inspector-header-slot>
              <div class="c-script-editor-editor-card__actions c-script-editor-editor-card__actions--end">
                <button
                  type="button"
                  class="c-main-ui-json-text-button c-main-ui-json-text-button--accent"
                  data-script-editor-action="apply-text-entry-text"
                  ${selectedRecord == null ? "disabled" : ""}
                >
                  应用文本
                </button>
              </div>
            </template>
            <textarea
              class="c-script-editor-record-editor__textarea"
              data-script-editor-text-entry-text
              spellcheck="false"
              placeholder="请输入文本内容"
            >${escapeHtml(selectedText)}</textarea>
          </div>
        </div>
      </div>
    `;
  }

  getScriptEditorRecordListPage(family) {
    if (!isScriptEditorMinimalWorkflowFamily(family) || family === "storyPack") {
      return 1;
    }

    return this.scriptEditorRecordListPages[family] ?? 1;
  }

  resetScriptEditorRecordListPages() {
    this.scriptEditorRecordListPages = {};
  }

  resetScriptEditorRecordSearch() {
    this.scriptEditorRecordSearch = {
      people: "",
    };
  }

  resetScriptEditorPersonAttributePage() {
    this.scriptEditorPersonAttributePage = 1;
    this.scriptEditorPersonAttributeVisibleIndices = null;
    this.scriptEditorPersonAttributeScrollLeft = 0;
  }

  setScriptEditorRecordListPage(family, nextPage) {
    if (
      this.scriptEditorProject == null ||
      !isScriptEditorMinimalWorkflowFamily(family) ||
      family === "storyPack"
    ) {
      return 1;
    }

    const records = listScriptEditorWorkflowFamilyRecords(this.scriptEditorProject, family);
    const totalPages = Math.max(
      1,
      Math.ceil(records.length / SCRIPT_EDITOR_SECONDARY_LIST_PAGE_SIZE)
    );
    const resolvedPage = Math.min(
      Math.max(Number.isInteger(nextPage) ? nextPage : 1, 1),
      totalPages
    );

    this.scriptEditorRecordListPages = {
      ...this.scriptEditorRecordListPages,
      [family]: resolvedPage,
    };

    return resolvedPage;
  }

  syncScriptEditorRecordListPageToRecord(family, recordId, records = null) {
    if (
      this.scriptEditorProject == null ||
      !isScriptEditorMinimalWorkflowFamily(family) ||
      family === "storyPack"
    ) {
      return 1;
    }

    const resolvedRecords =
      records ?? listScriptEditorWorkflowFamilyRecords(this.scriptEditorProject, family);
    const recordIndex = resolvedRecords.findIndex((record) => record.id === recordId);

    if (recordIndex < 0) {
      return this.setScriptEditorRecordListPage(family, 1);
    }

    return this.setScriptEditorRecordListPage(
      family,
      Math.floor(recordIndex / SCRIPT_EDITOR_SECONDARY_LIST_PAGE_SIZE) + 1
    );
  }

  getScriptEditorRecordSearchValue(family) {
    return this.scriptEditorRecordSearch[family] ?? "";
  }

  setScriptEditorRecordSearchValue(family, value) {
    this.scriptEditorRecordSearch = {
      ...this.scriptEditorRecordSearch,
      [family]: value,
    };
    this.setScriptEditorRecordListPage(family, 1);
    this.render();
  }

  filterScriptEditorRecords(family, records) {
    const searchValue = this.getScriptEditorRecordSearchValue(family).trim().toLowerCase();
    if (searchValue.length === 0) {
      return records;
    }

    if (family === "people") {
      return records.filter((record) => {
        const person = normalizeScriptEditorPersonRecord(record);
        return [
          person.name,
          person.id,
          person.title ?? "",
          person.occupation ?? "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(searchValue);
      });
    }

    return records;
  }

  getScriptEditorPaginatedRecordListState(family, records) {
    const totalPages = Math.max(
      1,
      Math.ceil(records.length / SCRIPT_EDITOR_SECONDARY_LIST_PAGE_SIZE)
    );
    const currentPage = Math.min(
      Math.max(this.getScriptEditorRecordListPage(family), 1),
      totalPages
    );
    const startIndex = (currentPage - 1) * SCRIPT_EDITOR_SECONDARY_LIST_PAGE_SIZE;

    if (this.getScriptEditorRecordListPage(family) !== currentPage) {
      this.scriptEditorRecordListPages = {
        ...this.scriptEditorRecordListPages,
        [family]: currentPage,
      };
    }

    return {
      currentPage,
      totalPages,
      visibleRecords: records.slice(
        startIndex,
        startIndex + SCRIPT_EDITOR_SECONDARY_LIST_PAGE_SIZE
      ),
    };
  }

  renderScriptEditorRecordPagination(family, currentPage, totalPages) {
    if (totalPages <= 1) {
      return "";
    }

    return `
      <nav class="c-script-editor-record-pagination" aria-label="${escapeHtml(this.getScriptEditorFamilyLabel(family))} 分页">
        <button
          type="button"
          class="c-main-ui-json-text-button c-script-editor-record-pagination__button"
          data-script-editor-action="record-page-prev"
          aria-label="上一页"
          ${currentPage <= 1 ? "disabled" : ""}
        >
          ‹
        </button>
        <span class="c-script-editor-record-pagination__status">第 ${currentPage} / ${totalPages} 页</span>
        <button
          type="button"
          class="c-main-ui-json-text-button c-script-editor-record-pagination__button"
          data-script-editor-action="record-page-next"
          aria-label="下一页"
          ${currentPage >= totalPages ? "disabled" : ""}
        >
          ›
        </button>
      </nav>
    `;
  }

  renderScriptEditorPaginatedRecordList({
    family,
    records,
    ariaLabel,
    modifierClass = "",
    toolbar = "",
    renderRecord,
  }) {
    const { visibleRecords, currentPage, totalPages } =
      this.getScriptEditorPaginatedRecordListState(family, records);
    const listClassName = ["c-script-editor-record-list", modifierClass]
      .filter((className) => className.length > 0)
      .join(" ");

    return `
      <aside class="${listClassName}" aria-label="${escapeHtml(ariaLabel)}">
        ${toolbar}
        ${
          visibleRecords.length === 0
            ? '<p class="c-script-editor-record-list__empty">暂无可编辑对象。</p>'
            : visibleRecords.map((record) => renderRecord(record)).join("")
        }
        ${this.renderScriptEditorRecordPagination(family, currentPage, totalPages)}
      </aside>
    `;
  }

  renderScriptEditorPeopleEditor(records, selectedRecord) {
    const person = selectedRecord == null ? null : normalizeScriptEditorPersonRecord(selectedRecord);
    const filteredRecords = this.filterScriptEditorRecords("people", records);

    return `
      <div class="c-script-editor-editor-card">
        <div class="c-script-editor-record-layout c-script-editor-record-layout--people">
          ${this.renderScriptEditorPaginatedRecordList({
            family: "people",
            records: filteredRecords,
            ariaLabel: "人物列表",
            modifierClass: "c-script-editor-record-list--people",
            toolbar: `
              <div class="c-script-editor-record-list__toolbar">
                <label class="c-script-editor-record-list__search">
                  <span>搜索人物</span>
                  <input
                    class="c-script-editor-form-field__input"
                    type="search"
                    value="${escapeHtml(this.getScriptEditorRecordSearchValue("people"))}"
                    placeholder="按人物名称/ 身份 / 职位搜索"
                    data-script-editor-record-search-family="people"
                  />
                </label>
                <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-record">
                  新增人物
                </button>
                <button
                  type="button"
                  class="c-main-ui-json-text-button"
                  data-script-editor-action="remove-record"
                  ${person == null ? "disabled" : ""}
                >
                  删除人物
                </button>
              </div>
            `,
            renderRecord: (record) => {
              const normalizedPerson = normalizeScriptEditorPersonRecord(record);
              return `
                <button
                  type="button"
                  class="c-script-editor-record-list__item c-script-editor-record-list__item--person ${record.id === selectedRecord?.id ? "is-selected" : ""}"
                  data-script-editor-record-id="${escapeHtml(record.id)}"
                >
                  <strong>${escapeHtml(normalizedPerson.name)}</strong>
                  <span>${escapeHtml(this.describeScriptEditorPersonListSummary(normalizedPerson))}</span>
                </button>
              `;
            },
          })}
          <div class="c-script-editor-person-editor">
            <!-- SCRIPT_EDITOR_INSPECTOR_SLOT -->
            <!-- SCRIPT_EDITOR_INSPECTOR_SUPPRESS_TEXT -->
            ${
              person == null
                ? `
                  <p class="c-script-editor-editor-card__hint">
                    请选择一个人物后继续编辑。人物作者面负责统一人物资料、关系入口和能力绑定，不在这里展开正式对话或事件页。                  </p>
                `
                : `
                  <template data-script-editor-inspector-header-slot>
                    ${this.renderScriptEditorPersonTabList()}
                  </template>
                  ${this.renderScriptEditorPersonTabPanel(person)}
                `
            }
          </div>
        </div>
      </div>
    `;
  }

  renderScriptEditorPersonTabButton(tab, label) {
    return `
      <button
        type="button"
        class="c-main-ui-json-text-button c-script-editor-person-editor__tab ${this.scriptEditorPersonTab === tab ? "is-active" : ""}"
        data-script-editor-action="select-person-tab"
        data-script-editor-person-tab="${tab}"
        role="tab"
        aria-selected="${this.scriptEditorPersonTab === tab ? "true" : "false"}"
      >
        ${label}
      </button>
    `;
  }

  renderScriptEditorPersonTabList() {
    return `
      <div class="c-script-editor-person-editor__tabs" role="tablist" aria-label="人物详情分栏">
        ${this.renderScriptEditorPersonTabButton("profile", "属性")}
        ${this.renderScriptEditorPersonTabButton("dialogues", "对话")}
        ${this.renderScriptEditorPersonTabButton("trade", "交易")}
        ${this.renderScriptEditorPersonTabButton("events", "事件")}
      </div>
    `;
  }

  renderScriptEditorPersonSummaryAttributes(person) {
    const {
      currentPage,
      totalPages,
      visibleEntries,
    } = this.getScriptEditorPersonAttributePaginationState(
      person.extendedAttributes ?? []
    );

    return `
      <section class="c-script-editor-person-summary" aria-label="已有属性">
        <header class="c-script-editor-person-summary__header">
          <div>
            <h3 class="c-script-editor-editor-card__title">自定义属性</h3>
          </div>
          <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-person-attribute">
            新增属性          </button>
        </header>
        <div class="c-script-editor-person-summary__list">
          ${visibleEntries
            .map(
              ({ entry, index }) => `
                <article class="c-script-editor-person-summary__item">
                  <button
                    type="button"
                    class="c-script-editor-person-summary__remove"
                    data-script-editor-action="remove-person-attribute"
                    data-script-editor-person-attribute-index="${index}"
                    aria-label="删除属性"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                  <input
                    class="c-script-editor-form-field__input"
                    type="text"
                    value="${escapeHtml(entry.key)}"
                    placeholder="属性键"
                    data-script-editor-person-attribute-field="key"
                    data-script-editor-person-attribute-index="${index}"
                  />
                  <input
                    class="c-script-editor-form-field__input"
                    type="text"
                    value="${escapeHtml(entry.label ?? "")}"
                    placeholder="属性名"
                    data-script-editor-person-attribute-field="label"
                    data-script-editor-person-attribute-index="${index}"
                  />
                  <input
                    class="c-script-editor-form-field__input"
                    type="text"
                    value="${escapeHtml(entry.value)}"
                    placeholder="属性名"
                    data-script-editor-person-attribute-field="value"
                    data-script-editor-person-attribute-index="${index}"
                  />
                </article>
              `
            )
            .join("")}
        </div>
        ${this.renderScriptEditorPersonAttributePagination(currentPage, totalPages)}
      </section>
    `;
  }

  getScriptEditorPersonAttributePaginationState(entries) {
    const totalPages = Math.max(
      1,
      Math.ceil(entries.length / SCRIPT_EDITOR_PERSON_ATTRIBUTE_PAGE_SIZE)
    );
    const currentPage = Math.min(
      Math.max(this.scriptEditorPersonAttributePage, 1),
      totalPages
    );
    const pageChanged = this.scriptEditorPersonAttributePage !== currentPage;

    if (pageChanged) {
      this.scriptEditorPersonAttributePage = currentPage;
      this.scriptEditorPersonAttributeVisibleIndices = null;
    }

    const defaultVisibleIndices = Array.from(
      {
        length: Math.max(
          0,
          Math.min(
            SCRIPT_EDITOR_PERSON_ATTRIBUTE_PAGE_SIZE,
            entries.length - (currentPage - 1) * SCRIPT_EDITOR_PERSON_ATTRIBUTE_PAGE_SIZE
          )
        ),
      },
      (_, offset) =>
        (currentPage - 1) * SCRIPT_EDITOR_PERSON_ATTRIBUTE_PAGE_SIZE + offset
    );
    const visibleIndices =
      this.scriptEditorPersonAttributeVisibleIndices == null
        ? defaultVisibleIndices
        : this.scriptEditorPersonAttributeVisibleIndices.filter(
            (index) => Number.isInteger(index) && index >= 0 && index < entries.length
          );

    this.scriptEditorPersonAttributeVisibleIndices = visibleIndices;

    return {
      currentPage,
      totalPages,
      visibleEntries: visibleIndices
        .map((index) => {
          const entry = entries[index];
          if (entry == null) {
            return null;
          }

          return {
            entry,
            index,
          };
        })
        .filter((entry) => entry != null),
    };
  }

  renderScriptEditorPersonAttributePagination(currentPage, totalPages) {
    if (totalPages <= 1) {
      return "";
    }

    return `
      <nav class="c-script-editor-record-pagination" aria-label="人物 JSON 属性分页">
        <button
          type="button"
          class="c-main-ui-json-text-button c-script-editor-record-pagination__button"
          data-script-editor-action="person-attribute-page-prev"
          ${currentPage <= 1 ? "disabled" : ""}
        >
          上一页        </button>
        <span class="c-script-editor-record-pagination__status">第 ${currentPage} / ${totalPages} 页</span>
        <button
          type="button"
          class="c-main-ui-json-text-button c-script-editor-record-pagination__button"
          data-script-editor-action="person-attribute-page-next"
          ${currentPage >= totalPages ? "disabled" : ""}
        >
          下一页        </button>
      </nav>
    `;
  }

  renderScriptEditorSelectOptions(options, selectedValue, emptyLabel) {
    const normalizedSelectedValue =
      typeof selectedValue === "string" ? selectedValue : "";
    const normalizedOptions = Array.isArray(options) ? options : [];
    const hasSelectedOption = normalizedOptions.some(
      (option) => option?.value === normalizedSelectedValue
    );
    const fallbackOptions =
      normalizedSelectedValue.length > 0 && !hasSelectedOption
        ? [
            {
              value: normalizedSelectedValue,
              label: `当前值：${normalizedSelectedValue}`,
            },
          ]
        : [];

    return [
      `<option value="">${escapeHtml(emptyLabel)}</option>`,
      ...fallbackOptions.map(
        (option) =>
          `<option value="${escapeHtml(option.value)}" selected>${escapeHtml(option.label)}</option>`
      ),
      ...normalizedOptions.map(
        (option) => `
          <option
            value="${escapeHtml(option.value)}"
            ${option.value === normalizedSelectedValue ? "selected" : ""}
          >
            ${escapeHtml(option.label)}
          </option>
        `
      ),
    ].join("");
  }

  getScriptEditorPersonCityOptions() {
    if (this.scriptEditorProject == null) {
      return [];
    }

    return this.scriptEditorProject.cities
      .map((city) => normalizeScriptEditorCityRecord(city))
      .map((city) => ({
        value: city.id,
        label: `${city.name} (${city.id})`,
      }));
  }

  getScriptEditorPersonHouseOptions(cityId) {
    if (this.scriptEditorProject == null) {
      return [];
    }

    return this.scriptEditorProject.buildings
      .map((building) => normalizeScriptEditorBuildingRecord(building))
      .filter((building) => cityId.trim().length === 0 || building.cityId === cityId)
      .map((building) => ({
        value: building.id,
        label: `${building.name} (${building.id})`,
      }));
  }

  getScriptEditorPersonPortraitOptions() {
    if (this.scriptEditorProject == null) {
      return [];
    }

    const optionsByValue = new Map();

    this.scriptEditorProject.people
      .map((record) => normalizeScriptEditorPersonRecord(record))
      .forEach((record) => {
        const portraitId =
          typeof record.portraitId === "string" ? record.portraitId.trim() : "";
        if (portraitId.length === 0 || optionsByValue.has(portraitId)) {
          return;
        }

        optionsByValue.set(portraitId, {
          value: portraitId,
          label: `${portraitId} · ${record.name}`,
        });
      });

    return [...optionsByValue.values()];
  }

  getScriptEditorPersonPortraitVariantOptions(person) {
    const optionsByValue = new Map();
    const candidatePeople =
      this.scriptEditorProject == null ? [] : this.scriptEditorProject.people;
    const normalizedPortraitId =
      typeof person?.portraitId === "string" ? person.portraitId.trim() : "";

    [person, ...candidatePeople.map((record) => normalizeScriptEditorPersonRecord(record))]
      .forEach((candidatePerson) => {
        const candidatePortraitId =
          typeof candidatePerson?.portraitId === "string"
            ? candidatePerson.portraitId.trim()
            : "";
        if (
          candidatePerson !== person &&
          normalizedPortraitId.length > 0 &&
          candidatePortraitId.length > 0 &&
          candidatePortraitId !== normalizedPortraitId
        ) {
          return;
        }

        const portraitVariants = Array.isArray(candidatePerson?.portraitVariants)
          ? candidatePerson.portraitVariants
          : [];

        portraitVariants.forEach((variant) => {
          if (variant == null || typeof variant !== "object") {
            return;
          }

          const variantId =
            typeof variant.id === "string" ? variant.id.trim() : "";
          if (variantId.length === 0 || optionsByValue.has(variantId)) {
            return;
          }

          const variantPortraitId =
            typeof variant.portraitId === "string" ? variant.portraitId.trim() : "";
          const label =
            typeof variant.label === "string" && variant.label.trim().length > 0
              ? variant.label.trim()
              : variantId;
          optionsByValue.set(variantId, {
            value: variantId,
            label:
              variantPortraitId.length > 0
                ? `${label} (${variantPortraitId})`
                : label,
          });
        });
      });

    return [...optionsByValue.values()];
  }

  renderScriptEditorPersonTabPanel(person) {
    if (this.scriptEditorPersonTab === "dialogues") {
      return this.renderScriptEditorPersonRelationPanel(
        "对话分栏",
        "该分栏只负责组织人物与对话的关联入口，不负责完整对话内容编辑。",
        "dialogueIds",
        person.dialogueIds ?? [],
        "add-person-dialogue-link",
        "remove-person-dialogue-link"
      );
    }

    if (this.scriptEditorPersonTab === "trade") {
      return `
        <section class="c-script-editor-person-panel" aria-label="交易分栏">
          <p class="c-script-editor-editor-card__hint">
            交易分栏只声明人物是否具备交易能力以及绑定哪个入口，不负责商店库存或价格体系。          </p>
          <label class="c-script-editor-person-editor__toggle">
            <input
              type="checkbox"
              data-script-editor-person-trade-enabled
              ${person.tradeBinding?.enabled ? "checked" : ""}
            />
            <span>启用交易入口</span>
          </label>
          <label class="c-script-editor-form-field">
            <span>交易入口 ID</span>
            <select
              class="c-script-editor-form-field__input"
              data-script-editor-person-field="tradeBinding.entryId"
            >
              ${this.renderScriptEditorSelectOptions(
                this.createScriptEditorTradeBindingReferenceOptions(),
                person.tradeBinding?.entryId ?? "",
                "未选择交易入口"
              )}
            </select>
          </label>
        </section>
      `;
    }

    if (this.scriptEditorPersonTab === "events") {
      return `
        ${this.renderScriptEditorPersonRelationPanel(
          "事件分栏",
          "该分栏保留人物相关事件引用；真实触发配置请使用下方事件绑定。",
          "eventIds",
          person.eventIds ?? [],
          "add-person-event-link",
          "remove-person-event-link"
        )}
        ${this.renderScriptEditorOwnerLocalEventBindingsPanel({ ownerFamily: "person", ownerId: person.id })}
      `;
    }

    const cityOptions = this.getScriptEditorPersonCityOptions();
    const houseOptions = this.getScriptEditorPersonHouseOptions(person.cityId ?? "");
    const portraitOptions = this.getScriptEditorPersonPortraitOptions();
    const portraitVariantOptions =
      this.getScriptEditorPersonPortraitVariantOptions(person);

    return `
      <section class="c-script-editor-person-panel" aria-label="属性分栏">
        <div class="c-script-editor-form-grid">
          <label class="c-script-editor-form-field">
            <span>人物名称</span>
            <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(person.name)}" data-script-editor-person-field="name" />
          </label>
          <label class="c-script-editor-form-field">
            <span>人物类型</span>
            <select class="c-script-editor-form-field__input" data-script-editor-person-field="personType">
              <option value="角色" ${person.personType === "角色" ? "selected" : ""}>角色</option>
              <option value="NPC" ${person.personType !== "角色" ? "selected" : ""}>NPC</option>
            </select>
          </label>
          <label class="c-script-editor-form-field">
            <span>正式身份</span>
            <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(person.title ?? "")}" data-script-editor-person-field="title" />
          </label>
          <label class="c-script-editor-form-field">
            <span>职业/定位</span>
            <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(person.occupation ?? "")}" data-script-editor-person-field="occupation" />
          </label>
          <label class="c-script-editor-form-field">
            <span>所属城市</span>
            <select class="c-script-editor-form-field__input" data-script-editor-person-field="cityId">
              ${this.renderScriptEditorSelectOptions(cityOptions, person.cityId ?? "", "未设置所属城市")}
            </select>
          </label>
          <label class="c-script-editor-form-field">
            <span>所属建筑</span>
            <select class="c-script-editor-form-field__input" data-script-editor-person-field="houseId">
              ${this.renderScriptEditorSelectOptions(houseOptions, person.houseId ?? "", "未设置所属建筑")}
            </select>
          </label>
          <label class="c-script-editor-form-field">
            <span>立绘 ID</span>
            <select class="c-script-editor-form-field__input" data-script-editor-person-field="portraitId">
              ${this.renderScriptEditorSelectOptions(portraitOptions, person.portraitId ?? "", "未设置立绘")}
            </select>
          </label>
          <label class="c-script-editor-form-field">
            <span>立绘变体</span>
            <select class="c-script-editor-form-field__input" data-script-editor-person-field="portraitVariantId">
              ${this.renderScriptEditorSelectOptions(portraitVariantOptions, person.portraitVariantId ?? "", "未设置立绘变体")}
            </select>
          </label>
          <label class="c-script-editor-form-field c-script-editor-form-field--wide">
            <span>人物简介</span>
            <textarea class="c-script-editor-record-editor__textarea c-script-editor-record-editor__textarea--compact" data-script-editor-person-field="biography" spellcheck="false">${escapeHtml(person.biography ?? "")}</textarea>
          </label>
        </div>
      </section>
      ${this.renderScriptEditorPersonMappedFieldGroups(person)}
      ${this.renderScriptEditorPersonSummaryAttributes(person)}
    `;
  }

  renderScriptEditorPersonMappedFieldGroups(person) {
    const groupLabels = {
      base: "基础",
      profile: "履历",
      stat: "能力",
      skill: "技能",
    };
    const definitions = listScriptEditorPersonFieldDefinitions().filter(
      (definition) => Object.hasOwn(groupLabels, definition.group)
    );

    return `
      <section class="c-script-editor-person-panel" aria-label="人物映射字段">
        <div class="c-script-editor-person-attributes__header">
          <div>
            <p class="c-script-editor-editor-card__eyebrow">映射字段</p>
            <h3 class="c-script-editor-editor-card__title">角色资料字段</h3>
          </div>
        </div>
        <div class="c-script-editor-person-mapped-fields">
          ${Object.entries(groupLabels)
            .map(([group, label]) => {
              const groupDefinitions = definitions.filter(
                (definition) => definition.group === group
              );
              return `
                <section class="c-script-editor-person-mapped-fields__group">
                  <h4>${escapeHtml(label)}</h4>
                  <div class="c-script-editor-form-grid">
                    ${groupDefinitions
                      .map((definition) =>
                        this.renderScriptEditorPersonMappedFieldControl(person, definition)
                      )
                      .join("")}
                  </div>
                </section>
              `;
            })
            .join("")}
        </div>
      </section>
    `;
  }

  renderScriptEditorPersonMappedFieldControl(person, definition) {
    const value = this.getScriptEditorPersonMappedFieldValue(person, definition.canonicalKey);
    const dataAttribute = `data-script-editor-person-mapped-field="${escapeHtml(definition.canonicalKey)}"`;

    if (definition.valueType === "enum") {
      return `
        <label class="c-script-editor-form-field">
          <span>${escapeHtml(definition.label)}</span>
          <select class="c-script-editor-form-field__input" ${dataAttribute}>
            ${this.renderScriptEditorSelectOptions(
              definition.enumOptions ?? [],
              value,
              `未设置{definition.label}`
            )}
          </select>
        </label>
      `;
    }

    if (definition.valueType === "reference") {
      const options =
        definition.referenceFamily === "cities"
          ? this.getScriptEditorPersonCityOptions()
          : definition.referenceFamily === "buildings"
            ? this.getScriptEditorPersonHouseOptions(person.cityId ?? "")
            : definition.referenceFamily === "portraits"
              ? this.getScriptEditorPersonPortraitOptions()
              : definition.referenceFamily === "portraitVariants"
                ? this.getScriptEditorPersonPortraitVariantOptions(person)
                : [];
      return `
        <label class="c-script-editor-form-field">
          <span>${escapeHtml(definition.label)}</span>
          <select class="c-script-editor-form-field__input" ${dataAttribute}>
            ${this.renderScriptEditorSelectOptions(options, value, `未设置{definition.label}`)}
          </select>
        </label>
      `;
    }

    if (definition.valueType === "boolean") {
      return `
        <label class="c-script-editor-person-editor__toggle">
          <input
            type="checkbox"
            ${value === "true" ? "checked" : ""}
            ${dataAttribute}
          />
          <span>${escapeHtml(definition.label)}</span>
        </label>
      `;
    }

    if (definition.valueType === "text") {
      return `
        <label class="c-script-editor-form-field c-script-editor-form-field--wide">
          <span>${escapeHtml(definition.label)}</span>
          <textarea
            class="c-script-editor-record-editor__textarea c-script-editor-record-editor__textarea--compact"
            spellcheck="false"
            ${dataAttribute}
          >${escapeHtml(value)}</textarea>
        </label>
      `;
    }

    return `
      <label class="c-script-editor-form-field">
        <span>${escapeHtml(definition.label)}</span>
        <input
          class="c-script-editor-form-field__input"
          type="${definition.valueType === "number" ? "number" : "text"}"
          value="${escapeHtml(value)}"
          ${dataAttribute}
        />
      </label>
    `;
  }

  getScriptEditorPersonMappedFieldValue(person, canonicalKey) {
    return String(
      canonicalKey.split(".").reduce((currentValue, segment) => {
        if (
          currentValue == null ||
          typeof currentValue !== "object" ||
          Array.isArray(currentValue)
        ) {
          return undefined;
        }

        return currentValue[segment];
      }, person) ?? ""
    );
  }

  renderScriptEditorPersonRelationPanel(title, hint, family, entries, addAction, removeAction) {
    return `
      <section class="c-script-editor-person-panel" aria-label="${title}">
        <div class="c-script-editor-person-attributes__header">
          <div>
            <p class="c-script-editor-editor-card__eyebrow">${title}</p>
            <h3 class="c-script-editor-editor-card__title">${title}</h3>
          </div>
          <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="${addAction}">
            新增关联
          </button>
        </div>
        <p class="c-script-editor-editor-card__hint">${hint}</p>
        <div class="c-script-editor-person-attributes__list">
          ${entries
            .map(
              (entry, index) => `
                <div class="c-script-editor-person-attributes__item">
                  ${
                    family === "dialogueIds"
                      ? this.renderScriptEditorPersonRelationSelect({
                          family,
                          index,
                          value: entry,
                          emptyLabel: "未选择对话",
                          options: this.createScriptEditorDialogueReferenceOptions(),
                        })
                      : family === "eventIds"
                        ? this.renderScriptEditorPersonRelationSelect({
                            family,
                            index,
                            value: entry,
                            emptyLabel: "未选择事件",
                            options: this.createScriptEditorEventReferenceOptions(),
                          })
                      : `<input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(entry)}" placeholder="event.id" data-script-editor-person-relation-family="${family}" data-script-editor-person-relation-index="${index}" />`
                  }
                  <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="${removeAction}" data-script-editor-person-relation-index="${index}">
                    删除
                  </button>
                </div>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  renderScriptEditorPersonRelationSelect({
    family,
    index,
    value,
    emptyLabel,
    options,
  }) {
    const currentValue = value ?? "";
    const hasCurrentOption =
      currentValue.length === 0 || options.some((option) => option.value === currentValue);

    return `
      <select
        class="c-script-editor-form-field__input"
        data-script-editor-person-relation-family="${escapeHtml(family)}"
        data-script-editor-person-relation-index="${index}"
      >
        <option value="" ${currentValue.length === 0 ? "selected" : ""}>${escapeHtml(emptyLabel)}</option>
        ${
          hasCurrentOption
            ? ""
            : `<option value="${escapeHtml(currentValue)}" selected>${escapeHtml(currentValue)}（未收录）</option>`
        }
        ${options
          .map(
            (option) => `
              <option value="${escapeHtml(option.value)}" ${currentValue === option.value ? "selected" : ""}>
                ${escapeHtml(option.label)}
              </option>
            `
          )
          .join("")}
      </select>
    `;
  }

  renderScriptEditorLocationEditor(family, records, selectedRecord) {
    const isCityFamily = family === "cities";
    const location = selectedRecord == null
      ? null
      : isCityFamily
        ? normalizeScriptEditorCityRecord(selectedRecord)
        : normalizeScriptEditorBuildingRecord(selectedRecord);

    return `
      <div class="c-script-editor-editor-card">
        <div class="c-script-editor-record-layout c-script-editor-record-layout--location">
          ${this.renderScriptEditorPaginatedRecordList({
            family,
            records,
            ariaLabel: isCityFamily ? "城市列表" : "建筑列表",
            modifierClass: "c-script-editor-record-list--location",
            toolbar: `
              <div class="c-script-editor-record-list__toolbar">
                <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-record">
                  ${isCityFamily ? "新增城市" : "新增建筑"}
                </button>
                <button
                  type="button"
                  class="c-main-ui-json-text-button"
                  data-script-editor-action="remove-record"
                  ${location == null ? "disabled" : ""}
                >
                  ${isCityFamily ? "删除城市" : "删除建筑"}
                </button>
              </div>
            `,
            renderRecord: (record) => {
              const normalizedRecord = isCityFamily
                ? normalizeScriptEditorCityRecord(record)
                : normalizeScriptEditorBuildingRecord(record);
              return `
                <button
                  type="button"
                  class="c-script-editor-record-list__item c-script-editor-record-list__item--location ${record.id === selectedRecord?.id ? "is-selected" : ""}"
                  data-script-editor-record-id="${escapeHtml(record.id)}"
                >
                  <strong>${escapeHtml(normalizedRecord.name)}</strong>
                  <span class="c-script-editor-record-list__summary ${isCityFamily ? "is-hidden" : ""}">${escapeHtml(this.describeScriptEditorLocationListSummary(family, normalizedRecord))}</span>
                </button>
              `;
            },
          })}
          <div class="c-script-editor-location-editor">
            <!-- SCRIPT_EDITOR_INSPECTOR_SLOT -->
            <!-- SCRIPT_EDITOR_INSPECTOR_SUPPRESS_TEXT -->
            ${
              location == null
                ? `
                  <p class="c-script-editor-editor-card__hint">
                    请选择一个 ${isCityFamily ? "城市" : "建筑"}后继续编辑。该作者面只负责容器、菜单、进入态与入口挂接，不在这里展开正式剧情、对话或事件编辑页。
                  </p>
                `
                : `
                  <template data-script-editor-inspector-header-slot>
                    <div class="c-script-editor-location-editor__tabs" role="tablist" aria-label="${isCityFamily ? "城市详情分栏" : "建筑详情分栏"}">
                      ${this.renderScriptEditorLocationTabButton("profile", "基础")}
                      ${this.renderScriptEditorLocationTabButton("menus", "菜单")}
                      ${this.renderScriptEditorLocationTabButton("access", "进入态")}
                      ${this.renderScriptEditorLocationTabButton("events", "事件")}
                      ${
                        isCityFamily
                          ? ""
                          : this.renderScriptEditorLocationTabButton("entry", "入口")
                      }
                    </div>
                  </template>
                  ${this.renderScriptEditorLocationTabPanel(family, location)}
                `
            }
          </div>
        </div>
      </div>
    `;
  }

  renderScriptEditorLocationTabButton(tab, label) {
    return `
      <button
        type="button"
        class="c-main-ui-json-text-button c-script-editor-location-editor__tab ${this.scriptEditorLocationTab === tab ? "is-active" : ""}"
        data-script-editor-action="select-location-tab"
        data-script-editor-location-tab="${tab}"
        role="tab"
        aria-selected="${this.scriptEditorLocationTab === tab ? "true" : "false"}"
      >
        ${label}
      </button>
    `;
  }

  renderScriptEditorLocationTabPanel(family, location) {
    if (this.scriptEditorLocationTab === "menus") {
      return this.renderScriptEditorLocationMenuPanel(family, location);
    }

    if (this.scriptEditorLocationTab === "access") {
      return this.renderScriptEditorLocationAccessPanel(location);
    }

    if (this.scriptEditorLocationTab === "entry" && family === "buildings") {
      return this.renderScriptEditorBuildingEntryPanel(location);
    }

    if (this.scriptEditorLocationTab === "events") {
      return family === "cities"
        ? this.renderScriptEditorOwnerLocalEventBindingsPanel({ ownerFamily: "city", ownerId: location.id })
        : this.renderScriptEditorOwnerLocalEventBindingsPanel({ ownerFamily: "building", ownerId: location.id });
    }

    return this.renderScriptEditorLocationProfilePanel(family, location);
  }

  renderScriptEditorLocationProfilePanel(family, location) {
    const isCityFamily = family === "cities";
    return `
      <section class="c-script-editor-location-panel" aria-label="${isCityFamily ? "城市基础分栏" : "建筑基础分栏"}">
        <div class="c-script-editor-form-grid">
          <label class="c-script-editor-form-field">
            <span>${isCityFamily ? "城市名称" : "建筑名称"}</span>
            <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(location.name ?? "")}" data-script-editor-location-field="name" />
          </label>
          <label class="c-script-editor-form-field c-script-editor-form-field--wide">
            <span>${isCityFamily ? "城市说明" : "建筑说明"}</span>
            <textarea class="c-script-editor-record-editor__textarea c-script-editor-record-editor__textarea--compact" data-script-editor-location-field="description" spellcheck="false">${escapeHtml(location.description ?? "")}</textarea>
          </label>
        </div>
        ${this.renderScriptEditorSystemDetails(
          "高级设置与系统信息",
          isCityFamily
            ? "城市内部标识默认折叠，主视图只保留创作描述。"
            : "建筑内部标识与所属城市标识默认折叠，主视图优先展示创作描述。",
          `
            <div class="c-script-editor-form-grid">
              <label class="c-script-editor-form-field">
                <span>${isCityFamily ? "城市 ID" : "建筑 ID"}</span>
                <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(location.id)}" data-script-editor-location-field="id" />
              </label>
              ${
                isCityFamily
                  ? ""
                  : `
                    <label class="c-script-editor-form-field">
                      <span>所属城市 ID</span>
                      <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(location.cityId ?? "")}" data-script-editor-location-field="cityId" />
                    </label>
                  `
              }
            </div>
          `
        )}
        ${isCityFamily ? this.renderScriptEditorCityMountedBuildingsPanel(location) : ""}
        ${this.renderScriptEditorLocationCustomAttributes(location)}
      </section>
    `;
  }

  renderScriptEditorCityMountedBuildingsPanel(city) {
    const mountedBuildings = city.mountedBuildings ?? [];
    const buildingOptions = (this.scriptEditorProject?.buildings ?? []).map((building) =>
      normalizeScriptEditorBuildingRecord(building)
    );
    const npcOptions = (this.scriptEditorProject?.people ?? [])
      .map((person) => normalizeScriptEditorPersonRecord(person))
      .filter((person) => person.personType !== "角色");
    const renderBuildingOptions = (selectedBuildingId) => `
      <option value="">未选择建筑</option>
      ${buildingOptions
        .map(
          (building) => `
            <option value="${escapeHtml(building.id)}" ${building.id === selectedBuildingId ? "selected" : ""}>
              ${escapeHtml(building.name)} (${escapeHtml(building.id)})
            </option>
          `
        )
        .join("")}
    `;
    const renderNpcOptions = (selectedNpcId, allowEmpty = true, allowedNpcIds = null) => `
      ${allowEmpty ? `<option value="">未选择人物</option>` : ""}
      ${npcOptions
        .filter((person) => allowedNpcIds == null || allowedNpcIds.includes(person.id))
        .map(
          (person) => `
            <option value="${escapeHtml(person.id)}" ${person.id === selectedNpcId ? "selected" : ""}>
              ${escapeHtml(person.name)} (${escapeHtml(person.id)})
            </option>
          `
        )
        .join("")}
    `;

    return `
      <section class="c-script-editor-location-attributes" aria-label="城市挂载建筑与人物">
        <header class="c-script-editor-location-menu__header">
          <div>
            <h3 class="c-script-editor-editor-card__title">挂载建筑与人物</h3>
          </div>
          <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-city-mounted-building">
            新增挂载建筑
          </button>
        </header>
        <div class="c-script-editor-location-menu__list">
          ${mountedBuildings
            .map(
              (entry, buildingIndex) => `
                <article class="c-script-editor-location-menu__item">
                  <div class="c-script-editor-form-grid">
                    <label class="c-script-editor-form-field">
                      <span>挂载建筑</span>
                      <select
                        class="c-script-editor-form-field__input"
                        data-script-editor-city-mounted-building
                        data-script-editor-city-mounted-building-index="${buildingIndex}"
                      >
                        ${renderBuildingOptions(entry.buildingId)}
                      </select>
                    </label>
                    <label class="c-script-editor-form-field">
                      <span>?NPC</span>
                      <select
                        class="c-script-editor-form-field__input"
                        data-script-editor-city-primary-npc
                        data-script-editor-city-mounted-building-index="${buildingIndex}"
                      >
                        ${renderNpcOptions(entry.primaryNpcId ?? "", true, entry.npcIds)}
                      </select>
                    </label>
                  </div>
                  <div class="c-script-editor-location-menu__list">
                    ${entry.npcIds
                      .map(
                        (npcId, npcIndex) => `
                          <div class="c-script-editor-form-grid">
                            <label class="c-script-editor-form-field">
                              <span>挂载 NPC</span>
                              <select
                                class="c-script-editor-form-field__input"
                                data-script-editor-city-mounted-building-npc
                                data-script-editor-city-mounted-building-index="${buildingIndex}"
                                data-script-editor-city-mounted-building-npc-index="${npcIndex}"
                              >
                                ${renderNpcOptions(npcId)}
                              </select>
                            </label>
                            <button
                              type="button"
                              class="c-main-ui-json-text-button"
                              data-script-editor-action="remove-city-mounted-building-npc"
                              data-script-editor-city-mounted-building-index="${buildingIndex}"
                              data-script-editor-city-mounted-building-npc-index="${npcIndex}"
                            >
                              删除 NPC
                            </button>
                          </div>
                        `
                      )
                      .join("")}
                  </div>
                  <div class="c-script-editor-location-menu__toggles">
                    <button
                      type="button"
                      class="c-main-ui-json-text-button"
                      data-script-editor-action="add-city-mounted-building-npc"
                      data-script-editor-city-mounted-building-index="${buildingIndex}"
                    >
                      新增 NPC
                    </button>
                    <button
                      type="button"
                      class="c-main-ui-json-text-button"
                      data-script-editor-action="remove-city-mounted-building"
                      data-script-editor-city-mounted-building-index="${buildingIndex}"
                    >
                      删除挂载建筑
                    </button>
                  </div>
                </article>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  renderScriptEditorLocationCustomAttributes(location) {
    const entries = location.extendedAttributes ?? [];
    return `
      <section class="c-script-editor-location-attributes" aria-label="自定义属性">
        <header class="c-script-editor-location-menu__header">
          <div>
            <h3 class="c-script-editor-editor-card__title">自定义属性</h3>
          </div>
          <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-location-attribute">
            新增属性          </button>
        </header>
        <div class="c-script-editor-location-menu__list">
          ${entries
            .map(
              (entry, index) => `
                <article class="c-script-editor-location-menu__item">
                  <div class="c-script-editor-form-grid">
                    <label class="c-script-editor-form-field">
                      <span>属性键</span>
                      <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(entry.key)}" data-script-editor-location-attribute-field="key" data-script-editor-location-attribute-index="${index}" />
                    </label>
                    <label class="c-script-editor-form-field">
                      <span>属性名</span>
                      <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(entry.label ?? "")}" data-script-editor-location-attribute-field="label" data-script-editor-location-attribute-index="${index}" />
                    </label>
                    <label class="c-script-editor-form-field c-script-editor-form-field--wide">
                      <span>属性名</span>
                      <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(entry.value)}" data-script-editor-location-attribute-field="value" data-script-editor-location-attribute-index="${index}" />
                    </label>
                  </div>
                  <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="remove-location-attribute" data-script-editor-location-attribute-index="${index}">
                    删除属性                  </button>
                </article>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  renderScriptEditorLocationMenuPanel(family, location) {
    const isCityFamily = family === "cities";
    const entries = location.menuEntries ?? [];
    return `
      <section class="c-script-editor-location-panel" aria-label="${isCityFamily ? "城市菜单分栏" : "建筑菜单分栏"}">
        <div class="c-script-editor-location-menu__header">
          <div>
            <p class="c-script-editor-editor-card__eyebrow">${isCityFamily ? "城市菜单" : "建筑菜单"}</p>
            <h3 class="c-script-editor-editor-card__title">${isCityFamily ? "入口绑定型菜单族" : "功能菜单与入口挂接"}</h3>
          </div>
          <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-location-menu-entry">
            新增菜单项          </button>
        </div>
        <p class="c-script-editor-editor-card__hint">
          菜单项只配置入口名称、所属功能族、绑定目标与可用状态，不在这里展开完整业务逻辑。        </p>
        <div class="c-script-editor-location-menu__list">
          ${entries
            .map(
              (entry, index) => `
                <article class="c-script-editor-location-menu__item">
                  <div class="c-script-editor-form-grid">
                    <label class="c-script-editor-form-field">
                      <span>菜单项 ID</span>
                      <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(entry.id)}" data-script-editor-location-menu-field="id" data-script-editor-location-menu-index="${index}" />
                    </label>
                    <label class="c-script-editor-form-field">
                      <span>中文名称</span>
                      <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(entry.label)}" data-script-editor-location-menu-field="label" data-script-editor-location-menu-index="${index}" />
                    </label>
                    <label class="c-script-editor-form-field">
                      <span>所属功能族</span>
                      <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(entry.menuFamily)}" data-script-editor-location-menu-field="menuFamily" data-script-editor-location-menu-index="${index}" />
                    </label>
                    <label class="c-script-editor-form-field">
                      <span>绑定目标类型</span>
                      <select class="c-script-editor-form-field__input" data-script-editor-location-menu-field="targetFamily" data-script-editor-location-menu-index="${index}">
                        ${["dialogue", "event", "trade", "minigame", "info"]
                          .map(
                            (targetFamily) => `
                              <option value="${targetFamily}" ${entry.targetFamily === targetFamily ? "selected" : ""}>${targetFamily}</option>
                            `
                          )
                          .join("")}
                      </select>
                    </label>
                    <label class="c-script-editor-form-field">
                      <span>绑定目标 ID</span>
                      <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(entry.targetId)}" data-script-editor-location-menu-field="targetId" data-script-editor-location-menu-index="${index}" />
                    </label>
                    <label class="c-script-editor-form-field c-script-editor-form-field--wide">
                      <span>不可用提示</span>
                      <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(entry.disabledHint)}" data-script-editor-location-menu-field="disabledHint" data-script-editor-location-menu-index="${index}" />
                    </label>
                  </div>
                  <div class="c-script-editor-location-menu__toggles">
                    <label class="c-script-editor-person-editor__toggle">
                      <input type="checkbox" data-script-editor-location-menu-flag="isVisible" data-script-editor-location-menu-index="${index}" ${entry.isVisible ? "checked" : ""} />
                      <span>显示</span>
                    </label>
                    <label class="c-script-editor-person-editor__toggle">
                      <input type="checkbox" data-script-editor-location-menu-flag="isEnabled" data-script-editor-location-menu-index="${index}" ${entry.isEnabled ? "checked" : ""} />
                      <span>可用</span>
                    </label>
                    <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="remove-location-menu-entry" data-script-editor-location-menu-index="${index}">
                      删除菜单项                    </button>
                  </div>
                </article>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  renderScriptEditorLocationAccessPanel(location) {
    const access = location.access ?? {
      conditionExpression: null,
      blockedMessage: "",
      blockedSpeakerId: "",
      guidance: "",
    };
    const accessConditionJson =
      access.conditionExpression == null
        ? ""
        : JSON.stringify(access.conditionExpression, null, 2);
    return `
      <section class="c-script-editor-location-panel" aria-label="进入态分栏">
        <p class="c-script-editor-editor-card__hint">
          这里配置对象是可进入、可见但暂不可进入，还是当前阶段完全隐藏，并补齐被拦下时的反馈文案。        </p>
        <div class="c-script-editor-form-grid">
          <label class="c-script-editor-form-field">
            <span>进入态</span>
            <textarea class="c-script-editor-record-editor__textarea c-script-editor-record-editor__textarea--compact" data-script-editor-location-access-field="conditionExpression" spellcheck="false">${escapeHtml(accessConditionJson)}</textarea>
          </label>
          <label class="c-script-editor-form-field">
            <span>拒绝提示</span>
            <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(access.blockedMessage)}" data-script-editor-location-access-field="blockedMessage" />
          </label>
          <label class="c-script-editor-form-field">
            <span>反馈角色</span>
            <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(access.blockedSpeakerId ?? "")}" data-script-editor-location-access-field="blockedSpeaker" />
          </label>
          <label class="c-script-editor-form-field c-script-editor-form-field--wide">
            <span>引导说明</span>
            <textarea class="c-script-editor-record-editor__textarea c-script-editor-record-editor__textarea--compact" data-script-editor-location-access-field="guidance" spellcheck="false">${escapeHtml(access.guidance)}</textarea>
          </label>
        </div>
      </section>
    `;
  }

  renderScriptEditorBuildingEntryPanel(location) {
    const entryBinding = location.entryBinding ?? {
      defaultPersonId: "",
      onEnterEventId: "",
      onLeaveEventId: "",
      returnTarget: "city",
    };
    return `
      <section class="c-script-editor-location-panel" aria-label="建筑入口分栏">
        <p class="c-script-editor-editor-card__hint">
          建筑入口挂接只声明默认落点和进入/离开事件引用，不在这里展开正式事件编辑页。
        </p>
        <div class="c-script-editor-form-grid">
          <label class="c-script-editor-form-field">
            <span>默认落点人物 ID</span>
            <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(entryBinding.defaultPersonId)}" data-script-editor-building-entry-field="defaultPersonId" />
          </label>
          <label class="c-script-editor-form-field">
            <span>进入建筑事件 ID</span>
            <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(entryBinding.onEnterEventId)}" data-script-editor-building-entry-field="onEnterEventId" />
          </label>
          <label class="c-script-editor-form-field">
            <span>离开建筑事件 ID</span>
            <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(entryBinding.onLeaveEventId)}" data-script-editor-building-entry-field="onLeaveEventId" />
          </label>
          <label class="c-script-editor-form-field">
            <span>返回目标层级</span>
            <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(entryBinding.returnTarget)}" data-script-editor-building-entry-field="returnTarget" />
          </label>
        </div>
      </section>
    `;
  }

  renderScriptEditorStoryNodeEditor(records, selectedRecord) {
    const storyNode =
      selectedRecord == null ? null : normalizeScriptEditorStoryNodeRecord(selectedRecord);

    return `
      <div class="c-script-editor-editor-card">
        <div class="c-script-editor-record-layout c-script-editor-record-layout--narrative">
          ${this.renderScriptEditorPaginatedRecordList({
            family: "storyNodes",
            records,
            ariaLabel: "剧情列表",
            modifierClass: "c-script-editor-record-list--narrative",
            toolbar: `
              <div class="c-script-editor-record-list__toolbar">
                <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-record">
                  新增剧情
                </button>
                <button
                  type="button"
                  class="c-main-ui-json-text-button"
                  data-script-editor-action="remove-record"
                  ${storyNode == null ? "disabled" : ""}
                >
                  删除剧情
                </button>
              </div>
            `,
            renderRecord: (record) => {
              const normalizedRecord = normalizeScriptEditorStoryNodeRecord(record);
              return `
                <button
                  type="button"
                  class="c-script-editor-record-list__item c-script-editor-record-list__item--narrative ${record.id === selectedRecord?.id ? "is-selected" : ""}"
                  data-script-editor-record-id="${escapeHtml(record.id)}"
                >
                  <strong>${escapeHtml(normalizedRecord.title)}</strong>
                  <span>${escapeHtml(this.describeScriptEditorStoryNodeListSummary(normalizedRecord))}</span>
                </button>
              `;
            },
          })}
          <div class="c-script-editor-narrative-editor">
            <!-- SCRIPT_EDITOR_INSPECTOR_SLOT -->
            <!-- SCRIPT_EDITOR_INSPECTOR_SUPPRESS_TEXT -->
            ${
              storyNode == null
                ? `<p class="c-script-editor-editor-card__hint">请选择一个剧情后继续编辑。剧情负责组织人物、对话与事件的归属关系，不在这里承担底层执行逻辑。</p>`
                : `
                  <template data-script-editor-inspector-header-slot>
                    <div class="c-script-editor-narrative-editor__tabs" role="tablist" aria-label="剧情详情分栏">
                      ${this.renderScriptEditorNarrativeTabButton("profile", "基础")}
                      ${this.renderScriptEditorNarrativeTabButton("links", "关联")}
                      ${this.renderScriptEditorNarrativeTabButton("summary", "摘要")}
                      ${this.renderScriptEditorNarrativeTabButton("events", "事件")}
                    </div>
                  </template>
                  ${this.renderScriptEditorStoryNodeTabPanel(storyNode)}
                `
            }
          </div>
        </div>
      </div>
    `;
  }

  renderScriptEditorDialogueEditor(records, selectedRecord) {
    const dialogue =
      selectedRecord == null ? null : normalizeScriptEditorDialogueRecord(selectedRecord);

    return `
      <div class="c-script-editor-editor-card">
        <div class="c-script-editor-record-layout c-script-editor-record-layout--narrative">
          ${this.renderScriptEditorPaginatedRecordList({
            family: "dialogues",
            records,
            ariaLabel: "对话列表",
            modifierClass: "c-script-editor-record-list--narrative",
            toolbar: `
              <div class="c-script-editor-record-list__toolbar">
                <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-record">
                  新增对话
                </button>
                <button
                  type="button"
                  class="c-main-ui-json-text-button"
                  data-script-editor-action="remove-record"
                  ${dialogue == null ? "disabled" : ""}
                >
                  删除对话
                </button>
              </div>
            `,
            renderRecord: (record) => {
              const normalizedRecord = normalizeScriptEditorDialogueRecord(record);
              return `
                <button
                  type="button"
                  class="c-script-editor-record-list__item c-script-editor-record-list__item--narrative ${record.id === selectedRecord?.id ? "is-selected" : ""}"
                  data-script-editor-record-id="${escapeHtml(record.id)}"
                >
                  <strong>${escapeHtml(normalizedRecord.title)}</strong>
                  <span>${escapeHtml(this.describeScriptEditorDialogueListSummary(normalizedRecord))}</span>
                </button>
              `;
            },
          })}
          <div class="c-script-editor-narrative-editor">
            <!-- SCRIPT_EDITOR_INSPECTOR_SLOT -->
            <!-- SCRIPT_EDITOR_INSPECTOR_SUPPRESS_TEXT -->
            ${
              dialogue == null
                ? `<p class="c-script-editor-editor-card__hint">请选择一个对话后继续编辑。当前作者面只负责演出结构、参与人物和后续动作入口，不在这里落 minigame ?runtime 机制。</p>`
                : `
                  <template data-script-editor-inspector-header-slot>
                    <div class="c-script-editor-narrative-editor__tabs" role="tablist" aria-label="对话详情分栏">
                      ${this.renderScriptEditorNarrativeTabButton("profile", "基础")}
                      ${this.renderScriptEditorNarrativeTabButton("nodes", "节点")}
                      ${this.renderScriptEditorNarrativeTabButton("summary", "预览")}
                      ${this.renderScriptEditorNarrativeTabButton("events", "事件")}
                    </div>
                  </template>
                  ${this.renderScriptEditorDialogueTabPanel(dialogue)}
                `
            }
          </div>
        </div>
      </div>
    `;
  }

  renderScriptEditorEventEditor(records, selectedRecord) {
    const eventRecord =
      selectedRecord == null ? null : normalizeScriptEditorEventRecord(selectedRecord);

    return `
      <div class="c-script-editor-editor-card">
        <div class="c-script-editor-record-layout c-script-editor-record-layout--narrative">
          ${this.renderScriptEditorPaginatedRecordList({
            family: "events",
            records,
            ariaLabel: "事件列表",
            modifierClass: "c-script-editor-record-list--narrative",
            toolbar: `
              <div class="c-script-editor-record-list__toolbar">
                <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-record">
                  新增事件
                </button>
                <button
                  type="button"
                  class="c-main-ui-json-text-button"
                  data-script-editor-action="remove-record"
                  ${eventRecord == null ? "disabled" : ""}
                >
                  删除事件
                </button>
              </div>
            `,
            renderRecord: (record) => {
              const normalizedRecord = normalizeScriptEditorEventRecord(record);
              return `
                <button
                  type="button"
                  class="c-script-editor-record-list__item c-script-editor-record-list__item--narrative ${record.id === selectedRecord?.id ? "is-selected" : ""}"
                  data-script-editor-record-id="${escapeHtml(record.id)}"
                >
                  <strong>${escapeHtml(normalizedRecord.title)}</strong>
                  <span>${escapeHtml(this.describeScriptEditorEventListSummary(normalizedRecord))}</span>
                </button>
              `;
            },
          })}
          <div class="c-script-editor-narrative-editor">
            <!-- SCRIPT_EDITOR_INSPECTOR_SLOT -->
            <!-- SCRIPT_EDITOR_INSPECTOR_SUPPRESS_TEXT -->
            ${
              eventRecord == null
                ? `<p class="c-script-editor-editor-card__hint">请选择一个事件后继续编辑。事件页会收口为稳定区块，而不是散乱大表单或分步向导。</p>`
                : `
                  <template data-script-editor-inspector-header-slot>
                    <div class="c-script-editor-narrative-editor__tabs" role="tablist" aria-label="事件详情分栏">
                      ${this.renderScriptEditorEventTabButton("basics", "基础信息")}
                      ${this.renderScriptEditorEventTabButton("destination", "去向")}
                      ${this.renderScriptEditorEventTabButton("relations", "关联对象")}
                      <button
                        type="button"
                        class="c-main-ui-json-text-button c-script-editor-narrative-editor__tab ${this.scriptEditorEventTab === "bindings" ? "is-active" : ""}"
                        data-script-editor-action="select-event-tab"
                        data-script-editor-event-tab="bindings"
                        role="tab"
                        aria-selected="${this.scriptEditorEventTab === "bindings" ? "true" : "false"}"
                      >
                        Bindings
                      </button>
                      ${this.renderScriptEditorEventTabButton("preview", "预览与校验")}
                    </div>
                  </template>
                  ${this.renderScriptEditorEventTabPanel(eventRecord)}
                `
            }
          </div>
        </div>
      </div>
    `;
  }

  renderScriptEditorMinigameEditor(records, selectedRecord) {
    const minigame =
      selectedRecord == null ? null : normalizeScriptEditorMinigameRecord(selectedRecord);

    return `
      <div class="c-script-editor-editor-card">
        <div class="c-script-editor-record-layout c-script-editor-record-layout--narrative">
          ${this.renderScriptEditorPaginatedRecordList({
            family: "minigames",
            records,
            ariaLabel: "玩法绑定列表",
            modifierClass: "c-script-editor-record-list--narrative",
            toolbar: `
              <div class="c-script-editor-record-list__toolbar">
                <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-record">
                  新增玩法绑定
                </button>
                <button
                  type="button"
                  class="c-main-ui-json-text-button"
                  data-script-editor-action="remove-record"
                  ${minigame == null ? "disabled" : ""}
                >
                  删除玩法绑定
                </button>
              </div>
            `,
            renderRecord: (record) => {
              const normalizedRecord = normalizeScriptEditorMinigameRecord(record);
              return `
                <button
                  type="button"
                  class="c-script-editor-record-list__item c-script-editor-record-list__item--narrative ${record.id === selectedRecord?.id ? "is-selected" : ""}"
                  data-script-editor-record-id="${escapeHtml(record.id)}"
                >
                  <strong>${escapeHtml(normalizedRecord.title)}</strong>
                  <span>${escapeHtml(this.describeScriptEditorMinigameListSummary(normalizedRecord))}</span>
                </button>
              `;
            },
          })}
          <div class="c-script-editor-minigame-editor">
            <!-- SCRIPT_EDITOR_INSPECTOR_SLOT -->
            <!-- SCRIPT_EDITOR_INSPECTOR_SUPPRESS_TEXT -->
            ${
              minigame == null
                ? `<p class="c-script-editor-editor-card__hint">请选择一个玩法绑定后继续编辑。当前作者面只负责 binding、trigger 和settlement 配置，不在这里落 playable runtime 机制。</p>`
                : `
                  <template data-script-editor-inspector-header-slot>
                    <div class="c-script-editor-minigame-editor__tabs" role="tablist" aria-label="玩法绑定详情分栏">
                      ${this.renderScriptEditorMinigameTabButton("basics", "基础信息")}
                      ${this.renderScriptEditorMinigameTabButton("launch", "触发与调用")}
                      ${this.renderScriptEditorMinigameTabButton("settlement", "结算与返回")}
                      ${this.renderScriptEditorMinigameTabButton("references", "引用关系")}
                      ${this.renderScriptEditorMinigameTabButton("events", "事件")}
                    </div>
                  </template>
                  ${this.renderScriptEditorMinigameTabPanel(minigame)}
                `
            }
          </div>
        </div>
      </div>
    `;
  }

  renderScriptEditorNarrativeTabButton(tab, label) {
    return `
      <button
        type="button"
        class="c-main-ui-json-text-button c-script-editor-narrative-editor__tab ${this.scriptEditorNarrativeTab === tab ? "is-active" : ""}"
        data-script-editor-action="select-narrative-tab"
        data-script-editor-narrative-tab="${tab}"
        role="tab"
        aria-selected="${this.scriptEditorNarrativeTab === tab ? "true" : "false"}"
      >
        ${label}
      </button>
    `;
  }

  renderScriptEditorEventTabButton(tab, label) {
    return `
      <button
        type="button"
        class="c-main-ui-json-text-button c-script-editor-narrative-editor__tab ${this.scriptEditorEventTab === tab ? "is-active" : ""}"
        data-script-editor-action="select-event-tab"
        data-script-editor-event-tab="${tab}"
        role="tab"
        aria-selected="${this.scriptEditorEventTab === tab ? "true" : "false"}"
      >
        ${label}
      </button>
    `;
  }

  renderScriptEditorMinigameTabButton(tab, label) {
    return `
      <button
        type="button"
        class="c-main-ui-json-text-button c-script-editor-minigame-editor__tab ${this.scriptEditorMinigameTab === tab ? "is-active" : ""}"
        data-script-editor-action="select-minigame-tab"
        data-script-editor-minigame-tab="${tab}"
        role="tab"
        aria-selected="${this.scriptEditorMinigameTab === tab ? "true" : "false"}"
      >
        ${label}
      </button>
    `;
  }

  renderScriptEditorStoryNodeTabPanel(storyNode) {
    if (this.scriptEditorNarrativeTab === "events") {
      return this.renderScriptEditorOwnerLocalEventBindingsPanel({ ownerFamily: "story", ownerId: storyNode.id });
    }

    if (this.scriptEditorNarrativeTab === "links") {
      return `
        <section class="c-script-editor-narrative-panel" aria-label="剧情关联分栏">
          ${this.renderScriptEditorStringRelationPanel("关联人物", "story-related-people", storyNode.relatedPersonIds ?? [])}
          ${this.renderScriptEditorStringRelationPanel("关联对话", "story-related-dialogues", storyNode.relatedDialogueIds ?? [])}
          ${this.renderScriptEditorStringRelationPanel("关联事件", "story-related-events", storyNode.relatedEventIds ?? [])}
        </section>
      `;
    }

    if (this.scriptEditorNarrativeTab === "summary") {
      return `
        <section class="c-script-editor-narrative-panel" aria-label="剧情摘要分栏">
          <p class="c-script-editor-editor-card__hint">
            当前剧情属于章节 ${escapeHtml(storyNode.chapterId ?? "未设置")}，推进策略为 ${escapeHtml(storyNode.progressMode ?? "block")}。这里先收口为组织摘要，后续预览链路由更后面的队列承接。          </p>
          <div class="c-script-editor-shell__cards">
            ${this.renderScriptEditorOverviewCard("人物归属", `已关联 ${storyNode.relatedPersonIds?.length ?? 0} 个人物。`, "neutral")}
            ${this.renderScriptEditorOverviewCard("对话归属", `已关联 ${storyNode.relatedDialogueIds?.length ?? 0} 段对话。`, "neutral")}
            ${this.renderScriptEditorOverviewCard("事件归属", `已关联 ${storyNode.relatedEventIds?.length ?? 0} 个事件。`, "neutral")}
          </div>
        </section>
      `;
    }

    return `
      <section class="c-script-editor-narrative-panel" aria-label="剧情基础分栏">
        <div class="c-script-editor-form-grid">
          <label class="c-script-editor-form-field">
            <span>剧情标题</span>
            <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(storyNode.title)}" data-script-editor-story-field="title" />
          </label>
          <label class="c-script-editor-form-field">
            <span>推进策略</span>
            <select class="c-script-editor-form-field__input" data-script-editor-story-field="progressMode">
              ${SCRIPT_EDITOR_STORY_PROGRESS_MODES.map(
                (mode) => `<option value="${mode}" ${storyNode.progressMode === mode ? "selected" : ""}>${mode}</option>`
              ).join("")}
            </select>
          </label>
          <label class="c-script-editor-form-field c-script-editor-form-field--wide">
            <span>剧情摘要</span>
            <textarea class="c-script-editor-record-editor__textarea c-script-editor-record-editor__textarea--compact" data-script-editor-story-field="summary" spellcheck="false">${escapeHtml(storyNode.summary ?? "")}</textarea>
          </label>
        </div>
        ${this.renderScriptEditorSystemDetails(
          "高级设置与系统信息",
          "剧情内部标识与章节挂接默认折叠，首屏优先展示创作标题、推进方式和摘要。",
          `
            <div class="c-script-editor-form-grid">
              <label class="c-script-editor-form-field">
                <span>剧情 ID</span>
                <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(storyNode.id)}" data-script-editor-story-field="id" />
              </label>
              <label class="c-script-editor-form-field">
                <span>章节 ID</span>
                <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(storyNode.chapterId ?? "")}" data-script-editor-story-field="chapterId" />
              </label>
            </div>
          `
        )}
      </section>
    `;
  }

  renderScriptEditorDialogueTabPanel(dialogue) {
    if (this.scriptEditorNarrativeTab === "events") {
      return this.renderScriptEditorOwnerLocalEventBindingsPanel({ ownerFamily: "dialogue", ownerId: dialogue.id });
    }

    if (this.scriptEditorNarrativeTab === "nodes") {
      return `
        <section class="c-script-editor-narrative-panel" aria-label="对话节点分栏">
          <div class="c-script-editor-narrative-panel__header">
            <div>
              <p class="c-script-editor-editor-card__eyebrow">对话节点</p>
              <h3 class="c-script-editor-editor-card__title">演出流与后续动作</h3>
            </div>
            <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-dialogue-node">
              新增节点
            </button>
          </div>
          <div class="c-script-editor-narrative-list">
            ${(dialogue.nodes ?? [])
              .map(
                (node, index) => `
                  <article class="c-script-editor-narrative-item">
                    <div class="c-script-editor-form-grid">
                      <label class="c-script-editor-form-field">
                        <span>节点 ID</span>
                        <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(node.id)}" data-script-editor-dialogue-node-field="id" data-script-editor-dialogue-node-index="${index}" />
                      </label>
                      <label class="c-script-editor-form-field">
                        <span>节点类型</span>
                        <select class="c-script-editor-form-field__input" data-script-editor-dialogue-node-field="nodeType" data-script-editor-dialogue-node-index="${index}">
                          ${SCRIPT_EDITOR_DIALOGUE_NODE_TYPES.map(
                            (nodeType) => `<option value="${nodeType}" ${node.nodeType === nodeType ? "selected" : ""}>${nodeType}</option>`
                          ).join("")}
                        </select>
                      </label>
                      <label class="c-script-editor-form-field">
                        <span>说话人物 ID</span>
                        ${this.renderScriptEditorDialogueNodeReferenceSelect({
                          field: "speakerPersonId",
                          index,
                          value: node.speakerPersonId,
                          emptyLabel: "未选择人物",
                          options: this.createScriptEditorPersonReferenceOptions(),
                        })}
                      </label>
                      <label class="c-script-editor-form-field">
                        <span>文本 textId</span>
                        ${this.renderScriptEditorDialogueNodeReferenceSelect({
                          field: "textId",
                          index,
                          value: node.textId,
                          emptyLabel: "未选择文本",
                          options: this.createScriptEditorTextEntryReferenceOptions(),
                        })}
                      </label>
                      <label class="c-script-editor-form-field">
                        <span>下一节点 ID</span>
                        ${this.renderScriptEditorDialogueNodeReferenceSelect({
                          field: "nextNodeId",
                          index,
                          value: node.nextNodeId,
                          emptyLabel: "无下一节点",
                          options: this.createScriptEditorDialogueNodeReferenceOptions(dialogue),
                        })}
                      </label>
                      <label class="c-script-editor-form-field">
                        <span>选择支目标 ID</span>
                        ${this.renderScriptEditorDialogueNodeReferenceSelect({
                          field: "choiceTargetNodeId",
                          index,
                          value: node.choiceTargetNodeId,
                          emptyLabel: "无选择支目标",
                          options: this.createScriptEditorDialogueNodeReferenceOptions(dialogue),
                        })}
                      </label>
                    </div>
                    <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="remove-dialogue-node" data-script-editor-dialogue-node-index="${index}">
                      删除节点
                    </button>
                  </article>
                `
              )
              .join("")}
          </div>
          <div class="c-script-editor-narrative-panel__header">
            <div>
              <p class="c-script-editor-editor-card__eyebrow">后续动作</p>
              <h3 class="c-script-editor-editor-card__title">对话结束后去向</h3>
            </div>
            <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-dialogue-follow-up">
              新增去向
            </button>
          </div>
          <div class="c-script-editor-narrative-list">
            ${(dialogue.followUps ?? [])
              .map(
                (followUp, index) => `
                  <article class="c-script-editor-narrative-item">
                    <div class="c-script-editor-form-grid">
                      <label class="c-script-editor-form-field">
                        <span>去向类型</span>
                        <select class="c-script-editor-form-field__input" data-script-editor-dialogue-follow-up-field="targetFamily" data-script-editor-dialogue-follow-up-index="${index}">
                          ${SCRIPT_EDITOR_DIALOGUE_FOLLOWUP_FAMILIES.map(
                            (family) => `<option value="${family}" ${followUp.targetFamily === family ? "selected" : ""}>${family}</option>`
                          ).join("")}
                        </select>
                      </label>
                      <label class="c-script-editor-form-field">
                        <span>去向目标 ID</span>
                        <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(followUp.targetId)}" data-script-editor-dialogue-follow-up-field="targetId" data-script-editor-dialogue-follow-up-index="${index}" />
                      </label>
                    </div>
                    <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="remove-dialogue-follow-up" data-script-editor-dialogue-follow-up-index="${index}">
                      删除去向
                    </button>
                  </article>
                `
              )
              .join("")}
          </div>
        </section>
      `;
    }

    if (this.scriptEditorNarrativeTab === "summary") {
      return `
        <section class="c-script-editor-narrative-panel" aria-label="对话预览分栏">
          <p class="c-script-editor-editor-card__hint">
            这里先提供 bounded 摘要预览：节点数 ${dialogue.nodes?.length ?? 0}，参与人物 ${dialogue.participantPersonIds?.length ?? 0}，后续动作 ${dialogue.followUps?.length ?? 0}。真正演出预览与跳转校验由后续更深的预览队列承接。          </p>
          <div class="c-script-editor-shell__cards">
            ${this.renderScriptEditorOverviewCard("节点顺序", `当前有 ${dialogue.nodes?.length ?? 0} 个节点。`, "neutral")}
            ${this.renderScriptEditorOverviewCard("人物参与", `当前有 ${dialogue.participantPersonIds?.length ?? 0} 个参与人物。`, "neutral")}
            ${this.renderScriptEditorOverviewCard("后续动作", `当前有 ${dialogue.followUps?.length ?? 0} 条去向。`, "neutral")}
          </div>
        </section>
      `;
    }

    return `
      <section class="c-script-editor-narrative-panel" aria-label="对话基础分栏">
        <div class="c-script-editor-form-grid">
          <label class="c-script-editor-form-field">
            <span>对话标题</span>
            <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(dialogue.title)}" data-script-editor-dialogue-field="title" />
          </label>
        </div>
        ${this.renderScriptEditorSystemDetails(
          "高级设置与系统信息",
          "对话内部标识与所属剧情挂接默认折叠，首屏先保留标题和参与关系。",
          `
            <div class="c-script-editor-form-grid">
              <label class="c-script-editor-form-field">
                <span>对话 ID</span>
                <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(dialogue.id)}" data-script-editor-dialogue-field="id" />
              </label>
              <label class="c-script-editor-form-field">
                <span>所属剧情 ID</span>
                <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(dialogue.storyNodeId ?? "")}" data-script-editor-dialogue-field="storyNodeId" />
              </label>
            </div>
          `
        )}
        ${this.renderScriptEditorStringRelationPanel("参与人物", "dialogue-participants", dialogue.participantPersonIds ?? [])}
      </section>
    `;
  }

  renderScriptEditorDialogueNodeReferenceSelect({
    field,
    index,
    value,
    emptyLabel,
    options,
  }) {
    const currentValue = value ?? "";
    const hasCurrentOption =
      currentValue.length === 0 || options.some((option) => option.value === currentValue);

    return `
      <select
        class="c-script-editor-form-field__input"
        data-script-editor-dialogue-node-field="${escapeHtml(field)}"
        data-script-editor-dialogue-node-index="${index}"
      >
        <option value="" ${currentValue.length === 0 ? "selected" : ""}>${escapeHtml(emptyLabel)}</option>
        ${
          hasCurrentOption
            ? ""
            : `<option value="${escapeHtml(currentValue)}" selected>${escapeHtml(currentValue)}（未收录）</option>`
        }
        ${options
          .map(
            (option) => `
              <option value="${escapeHtml(option.value)}" ${currentValue === option.value ? "selected" : ""}>
                ${escapeHtml(option.label)}
              </option>
            `
          )
          .join("")}
      </select>
    `;
  }

  createScriptEditorPersonReferenceOptions() {
    return (this.scriptEditorProject?.people ?? []).map((person) => ({
      value: person.id,
      label: `${person.name ?? person.title ?? person.id} (${person.id})`,
    }));
  }

  createScriptEditorTextEntryReferenceOptions() {
    return (this.scriptEditorProject?.textEntries ?? []).map((entry) => ({
      value: entry.id,
      label:
        typeof entry.text === "string" && entry.text.length > 0
          ? `${entry.id} · ${entry.text.slice(0, 32)}`
          : entry.id,
    }));
  }

  createScriptEditorDialogueReferenceOptions() {
    return (this.scriptEditorProject?.dialogues ?? []).map((dialogue) => ({
      value: dialogue.id,
      label: `${dialogue.title ?? dialogue.name ?? dialogue.id} (${dialogue.id})`,
    }));
  }

  createScriptEditorEventReferenceOptions() {
    return (this.scriptEditorProject?.events ?? []).map((eventRecord) => ({
      value: eventRecord.id,
      label: `${eventRecord.title ?? eventRecord.name ?? eventRecord.id} (${eventRecord.id})`,
    }));
  }

  createScriptEditorTradeBindingReferenceOptions() {
    return (this.scriptEditorProject?.buildings ?? []).map((building) => ({
      value: building.id,
      label: `${building.name ?? building.id} (${building.id})`,
    }));
  }

  createScriptEditorDialogueNodeReferenceOptions(dialogue) {
    return (dialogue.nodes ?? []).map((node) => ({
      value: node.id,
      label: `${node.id} (${node.nodeType})`,
    }));
  }

  createScriptEditorEventDestinationFamilyOptions() {
    const labelsByFamily = {
      dialogue: "对话",
      event: "事件",
      minigame: "小游戏",
    };

    return SCRIPT_EDITOR_EVENT_DESTINATION_FAMILIES.map((family) => ({
      value: family,
      label: labelsByFamily[family] ?? family,
    }));
  }

  createScriptEditorEventDestinationTargetOptions(family) {
    const project = this.scriptEditorProject ?? {
      people: [],
      cities: [],
      buildings: [],
      events: [],
      dialogues: [],
      minigames: [],
    };

    if (family === "event") {
      return project.events.map((event) => ({
        value: event.id,
        label: `${event.title ?? event.name ?? event.id} (${event.id})`,
      }));
    }

    if (family === "dialogue") {
      return project.dialogues.map((dialogue) => ({
        value: dialogue.id,
        label: `${dialogue.title ?? dialogue.name ?? dialogue.id} (${dialogue.id})`,
      }));
    }

    if (family === "minigame") {
      return project.minigames.map((minigame) => ({
        value: minigame.id,
        label: `${minigame.title ?? minigame.name ?? minigame.id} (${minigame.id})`,
      }));
    }

    return [];
  }

  renderScriptEditorEventTabPanel(eventRecord) {
    if (this.scriptEditorEventTab === "destination") {
      const currentDestinationFamily = eventRecord.destination?.family ?? "dialogue";
      const currentDestinationTargetId = eventRecord.destination?.targetId ?? "";
      const destinationFamilyOptions = this.createScriptEditorEventDestinationFamilyOptions();
      const destinationTargetOptions =
        this.createScriptEditorEventDestinationTargetOptions(currentDestinationFamily);
      const selectedDestinationTargetId = destinationTargetOptions.some(
        (option) => option.value === currentDestinationTargetId
      )
        ? currentDestinationTargetId
        : "";
      const unsupportedDestinationNotice =
        currentDestinationFamily !== "dialogue"
          ? `
            <p class="c-script-editor-editor-card__hint">
              当前去向类型暂不支持导出为可运行事件；只有对话去向会导出为可运行入口。
            </p>
          `
          : "";
      return `
        <section class="c-script-editor-narrative-panel" aria-label="事件去向分栏">
          <div class="c-script-editor-form-grid">
            <label class="c-script-editor-form-field">
              <span>去向类型</span>
              <select class="c-script-editor-form-field__input" data-script-editor-event-destination-field="family">
                ${this.renderScriptEditorSelectOptions(
                  destinationFamilyOptions,
                  currentDestinationFamily,
                  "请选择去向类型"
                )}
              </select>
            </label>
            <label class="c-script-editor-form-field">
              <span>去向目标</span>
              <select class="c-script-editor-form-field__input" data-script-editor-event-destination-field="targetId">
                ${this.renderScriptEditorSelectOptions(
                  destinationTargetOptions,
                  selectedDestinationTargetId,
                  "请选择去向目标"
                )}
              </select>
            </label>
          </div>
          ${unsupportedDestinationNotice}
        </section>
      `;
    }

    if (this.scriptEditorEventTab === "relations") {
      return `
        <section class="c-script-editor-narrative-panel" aria-label="事件关联对象分栏">
          <div class="c-script-editor-form-grid">
            <label class="c-script-editor-form-field">
              <span>所属剧情 ID</span>
              <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(eventRecord.relations?.storyNodeId ?? "")}" data-script-editor-event-story-node-id />
            </label>
          </div>
          ${this.renderScriptEditorStringRelationPanel("关联人物", "event-related-people", eventRecord.relations?.personIds ?? [])}
          ${this.renderScriptEditorStringRelationPanel("关联城市", "event-related-cities", eventRecord.relations?.cityIds ?? [])}
          ${this.renderScriptEditorStringRelationPanel("关联建筑", "event-related-buildings", eventRecord.relations?.buildingIds ?? [])}
        </section>
      `;
    }

    if (this.scriptEditorEventTab === "bindings") {
      const eventBindings = (this.scriptEditorProject?.eventBindings ?? []).filter(
        (binding) => binding.eventId === eventRecord.id
      );

      return `
        <section class="c-script-editor-narrative-panel" aria-label="Event binding navigation panel">
          <div class="c-script-editor-narrative-panel__header">
            <div>
              <p class="c-script-editor-editor-card__eyebrow">Event bindings</p>
              <h3 class="c-script-editor-editor-card__title">Readonly reverse references</h3>
            </div>
          </div>
          <div class="c-script-editor-narrative-list">
            ${
              eventBindings.length === 0
                ? `<p class="c-script-editor-editor-card__hint">No project-level bindings target this event.</p>`
                : eventBindings
                    .map(
                      (binding) => `
                        <article class="c-script-editor-narrative-item" data-script-editor-event-binding-id="${escapeHtml(binding.id)}">
                          ${this.renderScriptEditorEventBindingSummary(binding)}
                        </article>
                      `
                    )
                    .join("")
            }
          </div>
        </section>
      `;
    }

    if (this.scriptEditorEventTab === "preview") {
      return `
        <section class="c-script-editor-narrative-panel" aria-label="事件预览与校验分栏">
          <p class="c-script-editor-editor-card__hint">
            当前先提供 bounded 摘要与人工预览备注：创作者可以直接描述事件去向、条件摘要和校验关注点，后续真正的预览联动与问题跳回由更后面的预览校验队列承接。
          </p>
          <div class="c-script-editor-form-grid">
            <label class="c-script-editor-form-field c-script-editor-form-field--wide">
              <span>预览摘要</span>
              <textarea class="c-script-editor-record-editor__textarea c-script-editor-record-editor__textarea--compact" data-script-editor-event-preview-field="previewNotes" spellcheck="false">${escapeHtml(eventRecord.previewSummary?.previewNotes ?? "")}</textarea>
            </label>
            <label class="c-script-editor-form-field c-script-editor-form-field--wide">
              <span>校验关注点</span>
              <textarea class="c-script-editor-record-editor__textarea c-script-editor-record-editor__textarea--compact" data-script-editor-event-preview-field="validationNotes" spellcheck="false">${escapeHtml(eventRecord.previewSummary?.validationNotes ?? "")}</textarea>
            </label>
          </div>
          <div class="c-script-editor-shell__cards">
            ${this.renderScriptEditorOverviewCard("去向", `当前去向 ${eventRecord.destination?.family ?? "未设置"}:${eventRecord.destination?.targetId ?? "未设置"}`, "neutral")}
            ${this.renderScriptEditorOverviewCard("关联对象", `人物 ${eventRecord.relations?.personIds?.length ?? 0} / 城市 ${eventRecord.relations?.cityIds?.length ?? 0} / 建筑 ${eventRecord.relations?.buildingIds?.length ?? 0}`, "neutral")}
          </div>
        </section>
      `;
    }

    return `
      <section class="c-script-editor-narrative-panel" aria-label="事件基础信息分栏">
        <div class="c-script-editor-form-grid">
          <label class="c-script-editor-form-field">
            <span>事件标题</span>
            <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(eventRecord.title)}" data-script-editor-event-field="title" />
          </label>
          <label class="c-script-editor-person-editor__toggle">
            <input type="checkbox" data-script-editor-event-repeatable ${eventRecord.repeatable ? "checked" : ""} />
            <span>允许重复触发</span>
          </label>
          <label class="c-script-editor-form-field c-script-editor-form-field--wide">
            <span>事件说明</span>
            <textarea class="c-script-editor-record-editor__textarea c-script-editor-record-editor__textarea--compact" data-script-editor-event-field="description" spellcheck="false">${escapeHtml(eventRecord.description ?? "")}</textarea>
          </label>
        </div>
        ${this.renderScriptEditorSystemDetails(
          "高级设置与系统信息",
          "事件内部标识默认折叠，首屏优先呈现标题、重复策略和创作说明。",
          `
            <div class="c-script-editor-form-grid">
              <label class="c-script-editor-form-field">
                <span>事件 ID</span>
                <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(eventRecord.id)}" data-script-editor-event-field="id" />
              </label>
            </div>
          `
        )}
      </section>
    `;
  }

  renderScriptEditorEventBindingSummary(binding) {
    const ownerFamily =
      typeof binding.owner?.family === "string" ? binding.owner.family : "unknown";
    const ownerId = typeof binding.owner?.id === "string" ? binding.owner.id : "";
    const triggerTiming =
      typeof binding.trigger?.timing === "string" ? binding.trigger.timing : "unknown";
    const triggerAction =
      typeof binding.trigger?.action === "string" ? binding.trigger.action : "unknown";
    const priority =
      typeof binding.priority === "number" && Number.isFinite(binding.priority)
        ? binding.priority
        : 0;
    const enabled = binding.enabled !== false ? "enabled" : "disabled";

    return `
      <div class="c-script-editor-narrative-panel__header">
        <div>
          <p class="c-script-editor-editor-card__eyebrow">${escapeHtml(enabled)} / priority ${priority}</p>
          <h3 class="c-script-editor-editor-card__title">${escapeHtml(binding.id)}</h3>
        </div>
      </div>
      <p class="c-script-editor-editor-card__hint">
        ${escapeHtml(ownerFamily)}:${escapeHtml(ownerId)} -> ${escapeHtml(triggerTiming)} ${escapeHtml(triggerAction)}
      </p>
    `;
  }

  renderScriptEditorMinigameTabPanel(minigame) {
    if (this.scriptEditorMinigameTab === "events") {
      return this.renderScriptEditorOwnerLocalEventBindingsPanel({ ownerFamily: "minigame", ownerId: minigame.id });
    }

    if (this.scriptEditorMinigameTab === "launch") {
      const playableOptions = listScriptEditorBuiltinMinigamePlayableOptions();
      const integrationOptions = listScriptEditorBuiltinMinigameIntegrationOptions(
        minigame.playableId
      );
      return `
        <section class="c-script-editor-minigame-panel" aria-label="玩法绑定触发与调用分栏">
          <div class="c-script-editor-form-grid">
            <label class="c-script-editor-form-field">
              <span>玩法原型</span>
              <select class="c-script-editor-form-field__input" data-script-editor-minigame-field="playableId">
                ${playableOptions
                  .map(
                    (option) => `<option value="${option.id}" ${minigame.playableId === option.id ? "selected" : ""}>${option.label}</option>`
                  )
                  .join("")}
              </select>
            </label>
            <label class="c-script-editor-form-field">
              <span>接入方案</span>
              <select class="c-script-editor-form-field__input" data-script-editor-minigame-integration>
                ${integrationOptions
                  .map(
                    (option) => `<option value="${option.integrationId}" ${minigame.integrationId === option.integrationId ? "selected" : ""}>${option.integrationId}</option>`
                  )
                  .join("")}
              </select>
            </label>
            <label class="c-script-editor-form-field">
              <span>触发来源</span>
              <select class="c-script-editor-form-field__input" data-script-editor-minigame-field="triggerSource">
                ${SCRIPT_EDITOR_MINIGAME_TRIGGER_SOURCES.map(
                  (triggerSource) => `<option value="${triggerSource}" ${minigame.triggerSource === triggerSource ? "selected" : ""}>${triggerSource}</option>`
                ).join("")}
              </select>
            </label>
            <label class="c-script-editor-form-field">
              <span>触发目标 ID</span>
              <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(minigame.triggerId ?? "")}" data-script-editor-minigame-field="triggerId" />
            </label>
            <label class="c-script-editor-form-field c-script-editor-form-field--wide">
              <span>触发事件</span>
              <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(minigame.triggerEvent ?? "")}" data-script-editor-minigame-field="triggerEvent" />
            </label>
          </div>
          <section class="c-script-editor-minigame-list">
            <div class="c-script-editor-narrative-panel__header">
              <div>
                <p class="c-script-editor-editor-card__eyebrow">触发载荷</p>
                <h3 class="c-script-editor-editor-card__title">受边界约束的启动参数</h3>
              </div>
              <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-minigame-launch-payload-entry">
                新增 payload
              </button>
            </div>
            ${(minigame.launchPayload ?? [])
              .map(
                (entry, index) => `
                  <div class="c-script-editor-minigame-list__item">
                    <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(entry.key)}" placeholder="payload.key" data-script-editor-minigame-launch-field="key" data-script-editor-minigame-launch-index="${index}" />
                    <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(entry.value)}" placeholder="payload.value" data-script-editor-minigame-launch-field="value" data-script-editor-minigame-launch-index="${index}" />
                    <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="remove-minigame-launch-payload-entry" data-script-editor-minigame-launch-index="${index}">
                      删除
                    </button>
                  </div>
                `
              )
              .join("")}
          </section>
        </section>
      `;
    }

    if (this.scriptEditorMinigameTab === "settlement") {
      return `
        <section class="c-script-editor-minigame-panel" aria-label="玩法绑定结算与返回分栏">
          <div class="c-script-editor-form-grid">
            <label class="c-script-editor-form-field">
              <span>归属对象类型</span>
              <select class="c-script-editor-form-field__input" data-script-editor-minigame-field="ownerKind">
                ${SCRIPT_EDITOR_MINIGAME_OWNER_KINDS.map(
                  (ownerKind) => `<option value="${ownerKind}" ${minigame.ownerKind === ownerKind ? "selected" : ""}>${ownerKind}</option>`
                ).join("")}
              </select>
            </label>
            <label class="c-script-editor-form-field">
              <span>归属对象 ID</span>
              <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(minigame.ownerId ?? "")}" data-script-editor-minigame-field="ownerId" />
            </label>
            <label class="c-script-editor-form-field">
              <span>默认返回策略</span>
              <select class="c-script-editor-form-field__input" data-script-editor-minigame-field="returnPolicy">
                ${SCRIPT_EDITOR_MINIGAME_RETURN_POLICIES.map(
                  (returnPolicy) => `<option value="${returnPolicy}" ${minigame.returnPolicy === returnPolicy ? "selected" : ""}>${returnPolicy}</option>`
                ).join("")}
              </select>
            </label>
          </div>
          <section class="c-script-editor-minigame-list">
            <div class="c-script-editor-narrative-panel__header">
              <div>
                <p class="c-script-editor-editor-card__eyebrow">结算去向</p>
                <h3 class="c-script-editor-editor-card__title">结果路由</h3>
              </div>
              <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-minigame-outcome-route">
                新增 outcome route
              </button>
            </div>
            ${(minigame.outcomeRoutes ?? [])
              .map(
                (route, index) => `
                  <article class="c-script-editor-minigame-list__route">
                    <div class="c-script-editor-form-grid">
                      <label class="c-script-editor-form-field">
                        <span>路由 ID</span>
                        <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(route.id)}" data-script-editor-minigame-outcome-field="id" data-script-editor-minigame-outcome-index="${index}" />
                      </label>
                      <label class="c-script-editor-form-field">
                        <span>结果类型</span>
                        <select class="c-script-editor-form-field__input" data-script-editor-minigame-outcome-field="outcome" data-script-editor-minigame-outcome-index="${index}">
                          ${SCRIPT_EDITOR_MINIGAME_OUTCOMES.map(
                            (outcome) => `<option value="${outcome}" ${route.outcome === outcome ? "selected" : ""}>${outcome}</option>`
                          ).join("")}
                        </select>
                      </label>
                      <label class="c-script-editor-form-field">
                        <span>交接策略</span>
                        <select class="c-script-editor-form-field__input" data-script-editor-minigame-outcome-field="handoffPolicy" data-script-editor-minigame-outcome-index="${index}">
                          ${SCRIPT_EDITOR_MINIGAME_RETURN_POLICIES.map(
                            (returnPolicy) => `<option value="${returnPolicy}" ${route.handoffPolicy === returnPolicy ? "selected" : ""}>${returnPolicy}</option>`
                          ).join("")}
                        </select>
                      </label>
                      <label class="c-script-editor-form-field c-script-editor-form-field--wide">
                        <span>结果摘要</span>
                        <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(route.summary)}" data-script-editor-minigame-outcome-field="summary" data-script-editor-minigame-outcome-index="${index}" />
                      </label>
                      <label class="c-script-editor-form-field c-script-editor-form-field--wide">
                        <span>效果提示</span>
                        <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(route.effectHint)}" data-script-editor-minigame-outcome-field="effectHint" data-script-editor-minigame-outcome-index="${index}" />
                      </label>
                    </div>
                    <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="remove-minigame-outcome-route" data-script-editor-minigame-outcome-index="${index}">
                      删除 outcome route
                    </button>
                  </article>
                `
              )
              .join("")}
          </section>
        </section>
      `;
    }

    if (this.scriptEditorMinigameTab === "references") {
      const references = this.collectScriptEditorMinigameReferences(minigame.id);
      return `
        <section class="c-script-editor-minigame-panel" aria-label="玩法绑定引用关系分栏">
          <p class="c-script-editor-editor-card__hint">
            这里展示谁正在调用当前 binding。真正的调用源仍分别由 dialogue、event 和 location menu 作者面维护，避免把跨对象所有权挪进 minigame 本体。
          </p>
          <div class="c-script-editor-shell__cards">
            ${this.renderScriptEditorOverviewCard("引用数", String(references.length), references.length === 0 ? "neutral" : "success")}
            ${this.renderScriptEditorOverviewCard("当前 playable", minigame.playableId || "未设置", "neutral")}
            ${this.renderScriptEditorOverviewCard("当前 integration", minigame.integrationId || "未设置", "neutral")}
          </div>
          <div class="c-script-editor-minigame-list">
            ${references.length === 0
              ? `<p class="c-script-editor-editor-card__hint">当前还没有 dialogue、event 和 location menu 指向这个玩法绑定。</p>`
              : references
                  .map(
                    (reference) => `
                      <article class="c-script-editor-minigame-list__route">
                        <strong>${escapeHtml(reference.label)}</strong>
                        <span>${escapeHtml(reference.summary)}</span>
                      </article>
                    `
                  )
                  .join("")}
          </div>
        </section>
      `;
    }

    return `
      <section class="c-script-editor-minigame-panel" aria-label="玩法绑定基础信息分栏">
        <div class="c-script-editor-form-grid">
          <label class="c-script-editor-form-field">
            <span>绑定标题</span>
            <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(minigame.title)}" data-script-editor-minigame-field="title" />
          </label>
          <label class="c-script-editor-form-field c-script-editor-form-field--wide">
            <span>说明</span>
            <textarea class="c-script-editor-record-editor__textarea c-script-editor-record-editor__textarea--compact" data-script-editor-minigame-field="description" spellcheck="false">${escapeHtml(minigame.description ?? "")}</textarea>
          </label>
          <label class="c-script-editor-form-field c-script-editor-form-field--wide">
            <span>备注</span>
            <textarea class="c-script-editor-record-editor__textarea c-script-editor-record-editor__textarea--compact" data-script-editor-minigame-field="notes" spellcheck="false">${escapeHtml(minigame.notes ?? "")}</textarea>
          </label>
        </div>
        ${this.renderScriptEditorSystemDetails(
          "高级设置与系统信息",
          "玩法绑定内部标识默认折叠，首屏先保留创作标题、描述与备注。",
          `
            <div class="c-script-editor-form-grid">
              <label class="c-script-editor-form-field">
                <span>绑定 ID</span>
                <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(minigame.id)}" data-script-editor-minigame-field="id" />
              </label>
            </div>
          `
        )}
      </section>
    `;
  }

  renderScriptEditorEventBindingsEditor(records, selectedRecord) {
    const binding =
      selectedRecord == null ? null : normalizeScriptEditorEventBindingRecord(selectedRecord);

    return `
      <div class="c-script-editor-editor-card">
        <div class="c-script-editor-record-layout c-script-editor-record-layout--narrative">
          ${this.renderScriptEditorPaginatedRecordList({
            family: "eventBindings",
            records,
            ariaLabel: "Event binding list",
            modifierClass: "c-script-editor-record-list--narrative",
            toolbar: `
              <div class="c-script-editor-record-list__toolbar">
                <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="add-event-binding">
                  Add binding
                </button>
                <button
                  type="button"
                  class="c-main-ui-json-text-button"
                  data-script-editor-action="remove-event-binding"
                  data-script-editor-event-binding-id="${escapeHtml(binding?.id ?? "")}"
                  ${binding == null ? "disabled" : ""}
                >
                  Delete binding
                </button>
              </div>
            `,
            renderRecord: (record) => {
              const normalizedBinding = normalizeScriptEditorEventBindingRecord(record);
              return `
                <button
                  type="button"
                  class="c-script-editor-record-list__item c-script-editor-record-list__item--narrative ${record.id === selectedRecord?.id ? "is-selected" : ""}"
                  data-script-editor-record-id="${escapeHtml(record.id)}"
                >
                  <strong>${escapeHtml(normalizedBinding.id)}</strong>
                  <span>${escapeHtml(normalizedBinding.owner.family)}:${escapeHtml(normalizedBinding.owner.id ?? "")} -> ${escapeHtml(normalizedBinding.eventId)}</span>
                </button>
              `;
            },
          })}
          <div class="c-script-editor-narrative-editor">
            ${
              binding == null
                ? `<p class="c-script-editor-editor-card__hint">Select an event binding to edit project.eventBindings.</p>`
                : `<section class="c-script-editor-narrative-panel" aria-label="Event binding authoring surface">${this.renderScriptEditorEventBindingEditor(selectedRecord)}</section>`
            }
          </div>
        </div>
      </div>
    `;
  }

  renderScriptEditorOwnerLocalEventBindingsPanel({ ownerFamily, ownerId }) {
    const bindings = (this.scriptEditorProject?.eventBindings ?? []).filter((binding) => {
      const normalizedBinding = normalizeScriptEditorEventBindingRecord(binding);
      return normalizedBinding.owner.family === ownerFamily && normalizedBinding.owner.id === ownerId;
    });

    return `
      <section class="c-script-editor-narrative-panel" aria-label="事件绑定" data-script-editor-owner-local-event-bindings data-script-editor-owner-family="${escapeHtml(ownerFamily)}">
        <div class="c-script-editor-narrative-panel__header">
          <div>
            <p class="c-script-editor-editor-card__eyebrow">事件绑定</p>
            <h3 class="c-script-editor-editor-card__title">${escapeHtml(ownerFamily)}:${escapeHtml(ownerId)}</h3>
          </div>
          <button
            type="button"
            class="c-main-ui-json-text-button"
            data-script-editor-action="add-owner-local-event-binding"
            data-script-editor-owner-family="${escapeHtml(ownerFamily)}"
            data-script-editor-owner-id="${escapeHtml(ownerId)}"
          >
            新增绑定
          </button>
        </div>
        <div class="c-script-editor-narrative-list">
          ${
            bindings.length === 0
              ? `<p class="c-script-editor-editor-card__hint">当前对象还没有事件绑定。</p>`
              : bindings
                  .map(
                    (binding) => `
                      <article class="c-script-editor-narrative-item" data-script-editor-event-binding-id="${escapeHtml(binding.id)}">
                        ${this.renderScriptEditorEventBindingEditor(binding, { lockOwner: true })}
                        <button
                          type="button"
                          class="c-script-editor-record-editor__action"
                          data-script-editor-action="remove-owner-local-event-binding"
                          data-script-editor-event-binding-id="${escapeHtml(binding.id)}"
                        >
                          移除绑定
                        </button>
                      </article>
                    `
                  )
                  .join("")
          }
        </div>
      </section>
    `;
  }

  renderScriptEditorEventBindingEditor(binding, options = {}) {
    const normalizedBinding = normalizeScriptEditorEventBindingRecord(binding);
    const lockOwner = options.lockOwner === true;
    const conditions =
      normalizedBinding.conditions &&
      typeof normalizedBinding.conditions === "object" &&
      !Array.isArray(normalizedBinding.conditions)
        ? normalizedBinding.conditions
        : { operator: "all", conditions: [] };
    const conditionItems = Array.isArray(conditions.conditions)
      ? conditions.conditions
      : [];
    const eventOptions = this.getScriptEditorEventBindingEventOptions();
    const triggerOptions = this.getScriptEditorEventBindingTriggerOptions(
      normalizedBinding.owner.family
    );
    const selectedTriggerKey = `${normalizedBinding.trigger.timing}:${normalizedBinding.trigger.action}`;

    return `
      ${this.renderScriptEditorEventBindingSummary(normalizedBinding)}
      <div class="c-script-editor-form-grid">
        <label class="c-script-editor-form-field">
          <span>绑定事件</span>
          <select class="c-script-editor-form-field__input" data-script-editor-event-binding-id="${escapeHtml(normalizedBinding.id)}" data-script-editor-event-binding-field="eventId">
            ${this.renderScriptEditorSelectOptions(eventOptions, normalizedBinding.eventId, "未选择绑定事件")}
          </select>
        </label>
        ${!lockOwner ? `
          <label class="c-script-editor-form-field">
            <span>绑定对象类型</span>
            <select class="c-script-editor-form-field__input" data-script-editor-event-binding-id="${escapeHtml(normalizedBinding.id)}" data-script-editor-event-binding-owner-field="family">
              ${this.renderScriptEditorOptionList(SCRIPT_EDITOR_EVENT_BINDING_OWNER_FAMILY_OPTIONS, normalizedBinding.owner.family)}
            </select>
          </label>
          <label class="c-script-editor-form-field">
            <span>绑定对象 ID</span>
            <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(normalizedBinding.owner.id ?? "")}" data-script-editor-event-binding-id="${escapeHtml(normalizedBinding.id)}" data-script-editor-event-binding-owner-field="id" />
          </label>
        ` : ""}
        <label class="c-script-editor-form-field">
          <span>触发时机</span>
          <select class="c-script-editor-form-field__input" data-script-editor-event-binding-id="${escapeHtml(normalizedBinding.id)}" data-script-editor-event-binding-trigger-field="timing">
            ${this.renderScriptEditorOptionList(
              triggerOptions.map((option) => ({
                value: `${option.timing}:${option.action}`,
                label: option.label,
              })),
              selectedTriggerKey
            )}
          </select>
        </label>
        <label class="c-script-editor-form-field">
          <span>触发动作</span>
          <select class="c-script-editor-form-field__input" data-script-editor-event-binding-id="${escapeHtml(normalizedBinding.id)}" data-script-editor-event-binding-trigger-field="action">
            ${this.renderScriptEditorOptionList(
              triggerOptions.map((option) => ({
                value: option.action,
                label: option.label,
              })),
              normalizedBinding.trigger.action
            )}
          </select>
        </label>
        <label class="c-script-editor-form-field">
          <span>优先级</span>
          <input class="c-script-editor-form-field__input" type="number" value="${escapeHtml(String(normalizedBinding.priority ?? 0))}" data-script-editor-event-binding-id="${escapeHtml(normalizedBinding.id)}" data-script-editor-event-binding-field="priority" />
        </label>
        <label class="c-script-editor-person-editor__toggle">
          <input type="checkbox" data-script-editor-event-binding-id="${escapeHtml(normalizedBinding.id)}" data-script-editor-event-binding-enabled ${normalizedBinding.enabled !== false ? "checked" : ""} />
          <span>启用</span>
        </label>
        <label class="c-script-editor-form-field">
          <span>条件组合</span>
          <select class="c-script-editor-form-field__input" data-script-editor-event-binding-id="${escapeHtml(normalizedBinding.id)}" data-script-editor-event-binding-condition-operator>
            ${SCRIPT_EDITOR_EVENT_BINDING_CONDITION_GROUP_OPERATORS.map(
              (operator) => `<option value="${operator}" ${conditions.operator === operator ? "selected" : ""}>${SCRIPT_EDITOR_EVENT_BINDING_CONDITION_OPERATOR_LABELS[operator] ?? operator}</option>`
            ).join("")}
          </select>
        </label>
      </div>
      <div class="c-script-editor-narrative-list">
        ${conditionItems
          .map((condition, index) =>
            this.renderScriptEditorEventBindingConditionItem(normalizedBinding.id, condition, index)
          )
          .join("")}
      </div>
      <div class="c-script-editor-narrative-inline">
        <button class="c-script-editor-record-editor__action" type="button" data-script-editor-action="add-event-binding-condition-item" data-script-editor-event-binding-id="${escapeHtml(normalizedBinding.id)}">新增条件</button>
        <button class="c-script-editor-record-editor__action" type="button" data-script-editor-action="remove-event-binding" data-script-editor-event-binding-id="${escapeHtml(normalizedBinding.id)}">删除绑定</button>
      </div>
    `;
  }

  getScriptEditorEventBindingEventOptions() {
    return (this.scriptEditorProject?.events ?? [])
      .map((eventRecord) => normalizeScriptEditorEventRecord(eventRecord))
      .map((eventRecord) => ({
        value: eventRecord.id,
        label: `${eventRecord.title} (${eventRecord.id})`,
      }));
  }

  getScriptEditorEventBindingTriggerOptions(ownerFamily) {
    return (
      SCRIPT_EDITOR_EVENT_BINDING_TRIGGER_OPTIONS_BY_OWNER[ownerFamily] ??
      SCRIPT_EDITOR_EVENT_BINDING_TRIGGER_OPTIONS_BY_OWNER.story
    );
  }

  renderScriptEditorEventBindingConditionItem(bindingId, condition, index) {
    const fieldOptions = listScriptEditorEventBindingConditionFieldOptions();
    const selectedSourceFamily =
      condition.sourceFamily ??
      (condition.type === "flag" || condition.type === "variable"
        ? condition.type
        : condition.type === "binding-context"
          ? "binding-context"
          : "variable");
    const visibleFieldOptions = fieldOptions.filter(
      (option) => option.sourceFamily === selectedSourceFamily
    );
    const selectedFieldOption =
      visibleFieldOptions.find((option) => option.path === condition.field) ??
      fieldOptions.find((option) => option.path === condition.field) ??
      visibleFieldOptions[0] ??
      null;
    const valueType = condition.valueType ?? selectedFieldOption?.valueType ?? (condition.type === "flag" ? "boolean" : "string");
    const operatorOptions = this.getScriptEditorConditionOperatorOptions(valueType);
    const valueControl = this.renderScriptEditorEventBindingConditionValueControl(
      bindingId,
      condition,
      index,
      valueType,
      selectedFieldOption
    );
    return `
      <div class="c-script-editor-narrative-panel" data-script-editor-event-binding-condition-field-registry>
        <div class="c-script-editor-narrative-inline">
          <label class="c-script-editor-form-field">
            <span>条件类型</span>
            <select class="c-script-editor-form-field__input" data-script-editor-event-binding-id="${escapeHtml(bindingId)}" data-script-editor-event-binding-condition-item-index="${index}" data-script-editor-event-binding-condition-item-field="type">
              ${this.renderScriptEditorOptionList(SCRIPT_EDITOR_EVENT_BINDING_CONDITION_TYPE_OPTIONS, condition.type)}
            </select>
          </label>
          <label class="c-script-editor-form-field">
            <span>字段来源</span>
            <select class="c-script-editor-form-field__input" data-script-editor-event-binding-id="${escapeHtml(bindingId)}" data-script-editor-event-binding-condition-item-index="${index}" data-script-editor-event-binding-condition-item-field="sourceFamily">
              ${this.renderScriptEditorOptionList(SCRIPT_EDITOR_EVENT_BINDING_SOURCE_FAMILY_OPTIONS, selectedSourceFamily)}
            </select>
          </label>
          <label class="c-script-editor-form-field">
            <span>字段</span>
            <select class="c-script-editor-form-field__input" data-script-editor-event-binding-id="${escapeHtml(bindingId)}" data-script-editor-event-binding-condition-item-index="${index}" data-script-editor-event-binding-condition-item-field="field">
              ${visibleFieldOptions
                .map((option) => `<option value="${escapeHtml(option.path)}" ${condition.field === option.path ? "selected" : ""} data-script-editor-event-binding-condition-value-type="${escapeHtml(option.valueType)}" data-script-editor-event-binding-condition-resolver="${escapeHtml(option.resolverId ?? "")}">${escapeHtml(option.label)}</option>`)
                .join("")}
            </select>
          </label>
          <label class="c-script-editor-form-field">
            <span>值类型</span>
            <select class="c-script-editor-form-field__input" data-script-editor-event-binding-id="${escapeHtml(bindingId)}" data-script-editor-event-binding-condition-item-index="${index}" data-script-editor-event-binding-condition-item-field="valueType" data-script-editor-event-binding-condition-value-type>
              ${Object.entries(SCRIPT_EDITOR_EVENT_BINDING_VALUE_TYPE_LABELS)
                .map(([type, label]) => `<option value="${escapeHtml(type)}" ${valueType === type ? "selected" : ""}>${escapeHtml(label)}</option>`)
                .join("")}
            </select>
          </label>
          <label class="c-script-editor-form-field">
            <span>判断方式</span>
            <select class="c-script-editor-form-field__input" data-script-editor-event-binding-id="${escapeHtml(bindingId)}" data-script-editor-event-binding-condition-item-index="${index}" data-script-editor-event-binding-condition-item-field="operator">
              ${operatorOptions
                .map((operator) => `<option value="${escapeHtml(operator)}" ${condition.operator === operator ? "selected" : ""}>${escapeHtml(SCRIPT_EDITOR_EVENT_BINDING_CONDITION_OPERATOR_LABELS[operator] ?? operator)}</option>`)
                .join("")}
            </select>
          </label>
          <label class="c-script-editor-form-field">
            <span>目标值</span>
            ${valueControl}
          </label>
          <button class="c-script-editor-record-editor__action" type="button" data-script-editor-action="remove-event-binding-condition-item" data-script-editor-event-binding-id="${escapeHtml(bindingId)}" data-script-editor-event-binding-condition-item-index="${index}">移除</button>
        </div>
        ${this.renderScriptEditorEventBindingAdvancedConditionSurface(bindingId, condition, index)}
      </div>
    `;
  }

  renderScriptEditorOptionList(options, selectedValue) {
    const hasSelectedValue = options.some((option) => option.value === selectedValue);
    return `${hasSelectedValue || selectedValue == null || selectedValue === "" ? "" : `<option value="${escapeHtml(selectedValue)}" selected>${escapeHtml(selectedValue)}</option>`}${options
      .map(
        (option) =>
          `<option value="${escapeHtml(option.value)}" ${selectedValue === option.value ? "selected" : ""}>${escapeHtml(option.label)}</option>`
      )
      .join("")}`;
  }

  getScriptEditorConditionOperatorOptions(valueType) {
    if (valueType === "boolean") {
      return ["==", "!="];
    }
    if (valueType === "number") {
      return ["==", "!=", ">=", "<=", ">", "<"];
    }
    return ["==", "!=", "contains"];
  }

  renderScriptEditorEventBindingConditionValueControl(
    bindingId,
    condition,
    index,
    valueType,
    fieldOption
  ) {
    const baseAttributes = `data-script-editor-event-binding-id="${escapeHtml(bindingId)}" data-script-editor-event-binding-condition-item-index="${index}" data-script-editor-event-binding-condition-item-field="value"`;
    const currentValue = String(condition.value ?? "");
    if (valueType === "boolean") {
      return `<select class="c-script-editor-form-field__input" ${baseAttributes}><option value="true" ${condition.value !== false ? "selected" : ""}>是</option><option value="false" ${condition.value === false ? "selected" : ""}>否</option></select>`;
    }
    if (valueType === "enum" && Array.isArray(fieldOption?.enumOptions)) {
      return `<select class="c-script-editor-form-field__input" ${baseAttributes}>${fieldOption.enumOptions
        .map((option) => `<option value="${escapeHtml(option.value)}" ${currentValue === option.value ? "selected" : ""}>${escapeHtml(option.label)}</option>`)
        .join("")}</select>`;
    }
    if (valueType === "number") {
      return `<input class="c-script-editor-form-field__input" type="number" value="${escapeHtml(currentValue)}" ${baseAttributes} />`;
    }
    return `<input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(currentValue)}" ${baseAttributes} />`;
  }

  renderScriptEditorEventBindingAdvancedConditionSurface(bindingId, condition, index) {
    if (condition.type === "expression") {
      return `
        <div class="c-script-editor-narrative-inline" data-script-editor-event-binding-condition-expression>
          <span class="c-script-editor-editor-card__hint">表达式条件会保存为作者配置，导出阶段对未支持表达式保持关闭。</span>
        </div>
      `;
    }
    if (condition.type === "custom") {
      return `
        <div class="c-script-editor-narrative-inline" data-script-editor-event-binding-condition-custom>
          <label class="c-script-editor-form-field">
            <span>自定义处理器</span>
            <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(condition.handlerId ?? "")}" data-script-editor-event-binding-id="${escapeHtml(bindingId)}" data-script-editor-event-binding-condition-item-index="${index}" data-script-editor-event-binding-condition-item-field="handlerId" />
          </label>
          <label class="c-script-editor-form-field">
            <span>自定义参数</span>
            <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(condition.payload ?? "")}" data-script-editor-event-binding-id="${escapeHtml(bindingId)}" data-script-editor-event-binding-condition-item-index="${index}" data-script-editor-event-binding-condition-item-field="payload" />
          </label>
        </div>
      `;
    }
    if (condition.type === "binding-context") {
      return `
        <div class="c-script-editor-narrative-inline" data-script-editor-event-binding-condition-binding-context>
          <span class="c-script-editor-editor-card__hint">触发上下文条件读取当前绑定触发入口提供的字段。</span>
        </div>
      `;
    }
    return "";
  }

  collectScriptEditorMinigameReferences(minigameId) {
    if (this.scriptEditorProject == null) {
      return [];
    }

    const dialogueRefs = this.scriptEditorProject.dialogues
      .filter((dialogue) =>
        (dialogue.followUps ?? []).some(
          (followUp) =>
            followUp.targetFamily === "minigame" && followUp.targetId === minigameId
        )
      )
      .map((dialogue) => ({
        label: `Dialogue · ${dialogue.title || dialogue.id}`,
        summary: `${dialogue.id} follow-up -> ${minigameId}`,
      }));

    const eventRefs = this.scriptEditorProject.events
      .filter(
        (eventRecord) =>
          eventRecord.destination?.family === "minigame" &&
          eventRecord.destination?.targetId === minigameId
      )
      .map((eventRecord) => ({
        label: `Event · ${eventRecord.title || eventRecord.id}`,
        summary: `${eventRecord.id} destination -> ${minigameId}`,
      }));

    const locationRefs = [...this.scriptEditorProject.cities, ...this.scriptEditorProject.buildings]
      .flatMap((location) =>
        (location.menuEntries ?? [])
          .filter(
            (entry) =>
              entry.targetFamily === "minigame" && entry.targetId === minigameId
          )
          .map((entry) => ({
            label: `Location Menu · ${location.name || location.id}`,
            summary: `${location.id}:${entry.id} -> ${minigameId}`,
          }))
      );

    return [...dialogueRefs, ...eventRefs, ...locationRefs];
  }

  renderScriptEditorStringRelationPanel(title, relationKind, entries) {
    const addAction = `add-${relationKind}`;
    const removeAction = `remove-${relationKind}`;
    return `
      <section class="c-script-editor-narrative-panel" aria-label="${title}">
        <div class="c-script-editor-narrative-panel__header">
          <div>
            <p class="c-script-editor-editor-card__eyebrow">${title}</p>
            <h3 class="c-script-editor-editor-card__title">${title}</h3>
          </div>
          <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="${addAction}">
            新增关联
          </button>
        </div>
        <div class="c-script-editor-narrative-list">
          ${entries
            .map(
              (entry, index) => `
                <div class="c-script-editor-narrative-inline">
                  <input class="c-script-editor-form-field__input" type="text" value="${escapeHtml(entry)}" data-script-editor-relation-kind="${relationKind}" data-script-editor-relation-index="${index}" />
                  <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="${removeAction}" data-script-editor-relation-index="${index}">
                    删除
                  </button>
                </div>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  renderScriptEditorField(field, label, value) {
    return `
      <label class="c-script-editor-form-field">
        <span>${escapeHtml(label)}</span>
        <input
          class="c-script-editor-form-field__input"
          type="text"
          value="${escapeHtml(value)}"
          data-script-editor-project-field="${field}"
        />
      </label>
    `;
  }

  renderScriptEditorStartupSelect(field, label, options, selectedValue, emptyLabel) {
    return `
      <label class="c-script-editor-form-field">
        <span>${escapeHtml(label)}</span>
        <select
          class="c-script-editor-form-field__input"
          data-script-editor-startup-field="${escapeHtml(field)}"
        >
          ${this.renderScriptEditorSelectOptions(options, selectedValue, emptyLabel)}
        </select>
      </label>
    `;
  }

  renderScriptEditorSystemDetails(title, hint, body) {
    return `
      <details class="c-script-editor-system-details">
        <summary class="c-script-editor-system-details__summary">${escapeHtml(title)}</summary>
        <div class="c-script-editor-system-details__body">
          <p class="c-script-editor-editor-card__hint">${escapeHtml(hint)}</p>
          ${body}
        </div>
      </details>
    `;
  }

  renderScriptEditorOverviewCard(title, body, tone) {
    return `
      <article class="c-script-editor-shell__card c-script-editor-shell__card--${tone}">
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(body)}</p>
      </article>
    `;
  }

  describeScriptEditorProjectRisk(exportDiagnostics, compatibilityResidueCount) {
    if (exportDiagnostics.length > 0) {
      return exportDiagnostics[0]?.message ?? "当前仍存在需要先处理的导出阻塞。";
    }

    if (compatibilityResidueCount > 0) {
      return `当前没有导出阻塞，但仍有 ${compatibilityResidueCount} 条兼容残留需要后续语义队列承接。`;
    }

    return "当前没有导出前阻塞，项目可以继续细化对象内容。";
  }

  countScriptEditorCompatibilityResidue() {
    const compatibilityImport = this.scriptEditorProject?.storyPack?.compatibilityImport;
    const unresolvedFamilies = compatibilityImport?.unresolvedFamilies;
    if (unresolvedFamilies == null || typeof unresolvedFamilies !== "object") {
      return 0;
    }

    return Object.values(unresolvedFamilies).reduce((count, familyEntries) => {
      return count + (Array.isArray(familyEntries) ? familyEntries.length : 0);
    }, 0);
  }

  describeScriptEditorPersonListSummary(person) {
    return (
      [person.personType, person.title, person.occupation]
        .filter((value) => typeof value === "string" && value.trim().length > 0)
        .slice(0, 2)
        .join(" · ") || "待补人物设定"
    );
  }

  describeScriptEditorLocationListSummary(family, location) {
    if (family === "cities") {
      const description = String(location.description ?? "").trim();
      return description.length > 0
        ? description.slice(0, 20)
        : `菜单 ${location.menuEntries?.length ?? 0} 项`;
    }

    const summary = [
      String(location.cityId ?? "").trim(),
      (location.description ?? "").trim(),
    ].filter((value) => value.length > 0)[0];
    return summary?.slice(0, 20) || `入口 ${location.entryBinding ? "已配置" : "待补齐"}`;
  }

  describeScriptEditorStoryNodeListSummary(storyNode) {
    return (
      [storyNode.chapterId, storyNode.progressMode]
        .filter((value) => typeof value === "string" && value.trim().length > 0)
        .join(" · ") || "待补剧情组织信息"
    );
  }

  describeScriptEditorDialogueListSummary(dialogue) {
    return `参与人物 ${dialogue.participantPersonIds?.length ?? 0} · 节点 ${dialogue.nodes?.length ?? 0}`;
  }

  describeScriptEditorEventListSummary(eventRecord) {
    return (
      [eventRecord.destination?.family, eventRecord.destination?.targetId]
        .filter((value) => typeof value === "string" && value.trim().length > 0)
        .join(" · ") || "待补事件去向"
    );
  }

  describeScriptEditorMinigameListSummary(minigame) {
    return (
      [minigame.playableId, minigame.triggerSource]
        .filter((value) => typeof value === "string" && value.trim().length > 0)
        .join(" · ") || "待补玩法绑定信息"
    );
  }

  renderScriptEditorNotice() {
    if (this.scriptEditorNotice == null) {
      return "";
    }

    return `
      <div class="c-script-editor-workflow__notice c-script-editor-workflow__notice--${this.scriptEditorNotice.tone}">
        ${escapeHtml(this.scriptEditorNotice.message)}
      </div>
    `;
  }

  renderScriptEditorNoticeTimeline() {
    if (this.scriptEditorNoticeEntries.length === 0) {
      return `
        <section class="c-script-editor-shell__notice-rail" aria-label="操作记录">
          <header class="c-script-editor-shell__notice-header">
            <p class="c-script-editor-shell__handoff-eyebrow">操作记录</p>
            <span>当前还没有新的工作台提示</span>
          </header>
        </section>
      `;
    }

    return `
      <section class="c-script-editor-shell__notice-rail" aria-label="操作记录">
        <header class="c-script-editor-shell__notice-header">
          <p class="c-script-editor-shell__handoff-eyebrow">操作记录</p>
          <span>按最近操作时间排序</span>
        </header>
        <div class="c-script-editor-shell__notice-list">
          ${this.scriptEditorNoticeEntries
            .map(
              (entry) => `
                <article class="c-script-editor-shell__notice-card c-script-editor-shell__notice-card--${entry.tone}">
                  <div class="c-script-editor-shell__notice-meta">
                    <strong>${escapeHtml(entry.label)}</strong>
                    <time datetime="${entry.isoTimestamp}">${entry.timestampLabel}</time>
                  </div>
                  <p>${escapeHtml(entry.message)}</p>
                </article>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  resetScriptEditorNoticeTimeline() {
    this.scriptEditorNotice = null;
    this.scriptEditorNoticeEntries = [];
  }

  recordScriptEditorNotice(notice) {
    this.scriptEditorNotice = notice;
    if (notice == null) {
      return;
    }

    const createdAt = new Date();
    this.scriptEditorNoticeEntries = [
      {
        id: `script-editor-notice-${++this.scriptEditorNoticeSequence}`,
        tone: notice.tone,
        message: notice.message,
        label: notice.tone === "warning" ? "异常" : "完成",
        timestampLabel: this.formatScriptEditorNoticeTimestamp(createdAt),
        isoTimestamp: createdAt.toISOString(),
      },
      ...this.scriptEditorNoticeEntries,
    ].slice(0, 8);
  }

  formatScriptEditorNoticeTimestamp(value) {
    const pad = (input) => String(input).padStart(2, "0");
    return `${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}`;
  }

  renderScriptEditorFileInputs() {
    return `
      <input
        type="file"
        accept="application/json,.json"
        data-script-editor-project-file
        webkitdirectory
        directory
        multiple
        hidden
      >
    `;
  }

  renderScriptEditorProjectLibrary(projectLibraryEntries) {
    if (projectLibraryEntries.length === 0) {
      return `
        <section class="c-script-editor-project-library" aria-label="项目选择与管理">
          <header class="c-script-editor-project-library__header">
            <div>
              <p class="c-script-editor-landing__eyebrow">项目选择与管理</p>
              <h2 class="c-script-editor-editor-card__title">当前还没有可继续的项目</h2>
            </div>
            <p class="c-script-editor-landing__description">
              这一阶段将项目选择与当前项目编辑拆开处理。先创建、打开或导入项目，再进入工作台继续编辑。            </p>
          </header>
        </section>
      `;
    }

    return `
      <section class="c-script-editor-project-library" aria-label="项目选择与管理">
        <header class="c-script-editor-project-library__header">
          <div>
            <p class="c-script-editor-landing__eyebrow">项目选择与管理</p>
            <h2 class="c-script-editor-editor-card__title">从项目列表继续进入工作台</h2>
          </div>
          <p class="c-script-editor-landing__description">
            这里仅负责选择、继续编辑和删除项目，不在入口页展开对象族编辑，保持与当前蓝图队列一致。          </p>
        </header>
        <div class="c-script-editor-project-library__grid">
          ${projectLibraryEntries
            .map((entry) => this.renderScriptEditorProjectCard(entry))
            .join("")}
        </div>
      </section>
    `;
  }

  renderScriptEditorProjectCard(entry) {
    const isCurrentProject = this.scriptEditorProject?.id === entry.projectId;
    const isPendingDelete =
      this.scriptEditorPendingDeleteProjectId === entry.projectId;

    return `
      <article class="c-script-editor-project-card${isPendingDelete ? " is-pending-delete" : ""}">
        <header class="c-script-editor-project-card__header">
          <div>
            <p class="c-script-editor-project-card__eyebrow">${escapeHtml(
              this.getScriptEditorProjectSourceLabel(entry.source)
            )}</p>
            <h3 class="c-script-editor-project-card__title">${escapeHtml(entry.title)}</h3>
          </div>
          ${
            isCurrentProject
              ? '<span class="c-script-editor-project-card__badge">当前项目</span>'
              : ""
          }
        </header>
        <dl class="c-script-editor-project-card__meta">
          <div>
            <dt>项目 ID</dt>
            <dd>${escapeHtml(entry.projectId)}</dd>
          </div>
          <div>
            <dt>故事包 ID</dt>
            <dd>${escapeHtml(entry.project.storyPack.id)}</dd>
          </div>
        </dl>
        <p class="c-script-editor-project-card__description">
          ${escapeHtml(entry.description || "尚未填写项目说明，当前仅保留工作台骨架与项目级元数据。")}
        </p>
        ${
          isPendingDelete
            ? `
              <div class="c-script-editor-project-card__danger">
                <p>确认删除</p>
                <span>删除后会从当前入口项目列表移除；本阶段只管理当前会话中的项目记录。</span>
              </div>
            `
            : ""
        }
        <div class="c-script-editor-project-card__actions">
          <button
            type="button"
            class="c-main-ui-json-text-button c-main-ui-json-text-button--accent"
            data-script-editor-action="continue-project"
            data-script-editor-project-id="${escapeHtml(entry.projectId)}"
          >
            继续编辑
          </button>
          ${
            isPendingDelete
              ? `
                <button
                  type="button"
                  class="c-main-ui-json-text-button"
                  data-script-editor-action="confirm-delete-project"
                  data-script-editor-project-id="${escapeHtml(entry.projectId)}"
                >
                  确认删除
                </button>
                <button
                  type="button"
                  class="c-main-ui-json-text-button"
                  data-script-editor-action="cancel-delete-project"
                  data-script-editor-project-id="${escapeHtml(entry.projectId)}"
                >
                  取消
                </button>
              `
              : `
                <button
                  type="button"
                  class="c-main-ui-json-text-button"
                  data-script-editor-action="request-delete-project"
                  data-script-editor-project-id="${escapeHtml(entry.projectId)}"
                >
                  删除项目
                </button>
              `
          }
        </div>
      </article>
    `;
  }

  renderCharacterSelect() {
    const selectedCharacter = this.getSelectedCharacter();

    return `
      <section class="c-main-ui-screen c-main-ui-screen--character-select" aria-label="角色选择">
        <canvas class="c-main-ui-ink-particle-canvas" aria-hidden="true"></canvas>
        <div class="c-main-ui-character-layout">
          <aside class="c-main-ui-character-layout__hero">
            <div class="c-main-ui-character-layout__hero-inner">
              <div class="c-main-ui-character-layout__era" aria-hidden="true"></div>
              <p class="c-main-ui-character-layout__poem">
                大明开国人物传<br />
                选定出战人物后，<br />
                便从这卷风云中启程。              </p>
            </div>
          </aside>

          <div class="c-main-ui-character-book">
            <div class="c-main-ui-character-book__tabs" aria-hidden="true">
              <span class="c-main-ui-book-tab c-main-ui-book-tab--characters is-active">人物卷</span>
              <span class="c-main-ui-book-tab c-main-ui-book-tab--roster">群雄录</span>
              <span class="c-main-ui-book-tab c-main-ui-book-tab--ministers">名臣谱</span>
            </div>

            <div class="c-main-ui-character-book__content">
              <div class="c-main-ui-character-grid" role="list">
                ${this.renderCharacterShelf()}
              </div>
              ${this.renderCharacterDetail(selectedCharacter, this.previousCharacterDetail)}
            </div>

            <div class="c-main-ui-character-book__footer">
              <button
                type="button"
                class="c-main-ui-page-button"
                data-main-ui-action="back-to-menu"
                aria-label="返回主菜单"
              ></button>

              <div class="c-main-ui-book-pagination" aria-hidden="true">
                <span class="c-main-ui-book-pagination__ornament"></span>
                <span>第 1 页 / 共 1 页</span>
                <span class="c-main-ui-book-pagination__ornament"></span>
              </div>

              <button
                type="button"
                class="c-main-ui-page-turn-button c-main-ui-page-turn-button--previous"
                aria-label="上一页"
              ></button>

              <button
                type="button"
                class="c-main-ui-image-button c-main-ui-image-button--choose"
                data-main-ui-action="start-adventure"
                aria-label="开始冒险"
                ${selectedCharacter == null ? "disabled" : ""}
              >
                <span class="c-main-ui-sr-only">开始冒险</span>
              </button>

              <button
                type="button"
                class="c-main-ui-page-turn-button c-main-ui-page-turn-button--next"
                aria-label="下一页"
              ></button>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  renderCharacterShelf() {
    const cards = this.characters.map((character) => this.renderCharacterCard(character));
    const placeholderCount = Math.max(0, 8 - cards.length);
    const placeholders = Array.from({ length: placeholderCount }, (_, index) => `
      <div class="c-main-ui-character-card c-main-ui-character-card--placeholder" aria-hidden="true">
        <div class="c-main-ui-character-card__portrait"></div>
        <div class="c-main-ui-character-card__placeholder-label">名册待补</div>
        <div class="c-main-ui-character-card__placeholder-index">? ${index + 5}</div>
      </div>
    `);

    return [...cards, ...placeholders].join("");
  }

  renderCharacterCard(character) {
    const isSelected = character.id === this.selectedCharacterId;
    const titleParts = [character.title, character.occupation].filter(Boolean);
    const subtitle =
      titleParts.length === 0 ? "角色资料待补齐" : titleParts.join(" / ");
    const avatarImageUrl = resolveCharacterAvatarImageUrl(character);
    const avatarMarkup =
      avatarImageUrl == null
        ? `<div class="c-main-ui-character-card__avatar-placeholder" aria-hidden="true">${escapeHtml(
            character.name.slice(0, 1) || "?"
          )}</div>`
        : `<img class="c-main-ui-character-card__avatar-image" src="${escapeHtml(avatarImageUrl)}" alt="" aria-hidden="true">`;

    return `
      <button
        type="button"
        class="c-main-ui-character-card ${isSelected ? "is-selected" : ""}"
        data-main-ui-action="select-character"
        data-character-id="${escapeHtml(character.id)}"
        aria-pressed="${isSelected ? "true" : "false"}"
        role="listitem"
      >
        <div class="c-main-ui-character-card__portrait">
          ${avatarMarkup}
          ${isSelected ? '<span class="c-main-ui-character-card__selected-seal" aria-hidden="true"></span>' : ""}
        </div>
        <div class="c-main-ui-character-card__body">
          <p class="c-main-ui-character-card__meta">${escapeHtml(subtitle)}</p>
          <h2 class="c-main-ui-character-card__name">${escapeHtml(character.name)}</h2>
          <p class="c-main-ui-character-card__bio">
            ${escapeHtml(character.biography ?? "简介待补充。")}
          </p>
        </div>
      </button>
    `;
  }

  renderCharacterDetail(character, previousCharacter = null) {
    if (character == null) {
      return `
        <aside class="c-main-ui-character-detail">
          <div class="c-main-ui-character-detail__paper">
            <p class="c-main-ui-character-detail__empty">请先选择一名角色。</p>
          </div>
        </aside>
      `;
    }

    const statItems = getCharacterStatItems(character);
    const previousStatItems = getCharacterStatItems(previousCharacter);
    const currentSubtitle = getCharacterSubtitle(character);
    const previousSubtitle =
      previousCharacter == null ? "" : getCharacterSubtitle(previousCharacter);

    return `
      <aside class="c-main-ui-character-detail">
        <div class="c-main-ui-character-detail__paper">
          <div class="c-main-ui-character-detail__header">
            <div>
              <p class="c-main-ui-character-detail__eyebrow">人物详情 · 当前已选</p>
              <h2 class="c-main-ui-character-detail__name">${renderCharacterDetailTransitionText(
                character.name,
                previousCharacter?.name
              )}</h2>
              <p class="c-main-ui-character-detail__subtitle">
                ${renderCharacterDetailTransitionText(currentSubtitle, previousSubtitle)}
              </p>
            </div>
            <span class="c-main-ui-character-detail__badge" aria-hidden="true"></span>
          </div>

          <dl class="c-main-ui-character-detail__stats">
            ${statItems
              .map(
                ([label, value], index) => `
                  <div class="c-main-ui-character-detail__stat-row">
                    <dt>${escapeHtml(label)}</dt>
                    <dd>${renderCharacterDetailTransitionText(value, previousStatItems[index]?.[1])}</dd>
                  </div>
                `
              )
              .join("")}
          </dl>

          <div class="c-main-ui-character-detail__section">
            <h3 class="c-main-ui-character-detail__section-title">人物简介</h3>
            <p class="c-main-ui-character-detail__bio">
              ${renderCharacterDetailTransitionText(
                character.biography ?? "人物介绍待补充。",
                previousCharacter?.biography ?? "",
                { block: true }
              )}
            </p>
          </div>
        </div>
      </aside>
    `;
  }

  async onClick(event) {
    const target = event.target;
    if (target == null || typeof target.closest !== "function") {
      return;
    }

    const actionElement = target.closest("[data-main-ui-action]");
    if (actionElement != null) {
      const action = actionElement.dataset.mainUiAction;
      if (action === "open-character-select") {
        this.showCharacterSelect();
        return;
      }

      if (action === "open-json-scenario-select") {
        this.setScreen("scenario-select");
        return;
      }

      if (action === "open-script-editor") {
        this.showScriptEditorLanding();
        return;
      }

      if (action === "back-to-menu") {
        this.showMainMenu();
        return;
      }

      if (action === "select-character") {
        const characterId = actionElement.dataset.characterId;
        if (characterId != null) {
          if (characterId === this.selectedCharacterId) {
            return;
          }
          this.previousCharacterDetail = this.getSelectedCharacter();
          this.characterDetailTransitionToken += 1;
          this.clearCharacterDetailTransitionTimer();
          this.inkParticleSystem?.stopLoop("selected-character");
          this.pendingSelectedInkBurstCharacterId = characterId;
          this.selectedCharacterId = characterId;
          this.render();
          return;
        }
        return;
      }

      if (action === "start-adventure") {
        const selectedCharacter = this.getSelectedCharacter();
        if (selectedCharacter != null) {
          this.onStartGame(selectedCharacter);
        }
        return;
      }

      if (action === "start-scenario-pack") {
        const scenarioPackId = actionElement.dataset.scenarioPackId;
        const scenarioPack = this.scenarioPacks.find(
          (candidatePack) => candidatePack.id === scenarioPackId
        );
        if (scenarioPack != null) {
          await this.onStartScenarioPack?.(scenarioPack);
        }
        return;
      }

      if (action === "import-scenario-file") {
        this.overlayRoot
          .querySelector("[data-main-ui-scenario-file]")
          ?.click();
        return;
      }

      if (action === "continue-game") {
        const saveData = await this.loadSaveData();
        const selectedCharacter =
          this.getCharacterById(saveData?.selectedCharacterId ?? null) ??
          this.characters[0] ??
          null;

        if (selectedCharacter != null) {
          this.selectedCharacterId = selectedCharacter.id;
          if (this.onContinueGame != null) {
            this.onContinueGame(selectedCharacter, saveData ?? null);
          } else {
            this.onStartGame(selectedCharacter);
          }
        }
        return;
      }
    }

    const scriptEditorActionElement = target.closest("[data-script-editor-action]");
    if (scriptEditorActionElement != null) {
      const action = scriptEditorActionElement.dataset.scriptEditorAction;
      if (action != null) {
        await this.handleScriptEditorAction(action, scriptEditorActionElement);
      }
      return;
    }

    const scriptEditorFamilyElement = target.closest("[data-script-editor-family]");
    if (scriptEditorFamilyElement != null) {
      const family = scriptEditorFamilyElement.dataset.scriptEditorFamily;
      const entityId = scriptEditorFamilyElement.dataset.scriptEditorEntityId ?? null;
      if (family != null) {
        this.selectScriptEditorFamily(family, entityId);
      }
      return;
    }

    const scriptEditorRecordElement = target.closest("[data-script-editor-record-id]");
    if (scriptEditorRecordElement != null) {
      const recordId = scriptEditorRecordElement.dataset.scriptEditorRecordId;
      if (recordId != null) {
        this.selectScriptEditorRecord(recordId);
      }
    }
  }

  async onChange(event) {
    const target = event.target;
    if (
      !(
        target instanceof globalThis.HTMLInputElement ||
        target instanceof globalThis.HTMLSelectElement ||
        target instanceof globalThis.HTMLTextAreaElement
      )
    ) {
      return;
    }

    if (target.matches("[data-main-ui-scenario-file]")) {
      const files = Array.from(target.files ?? []);
      target.value = "";
      if (files.length === 0) {
        return;
      }

      await this.onImportScenarioPackFiles?.(files);
      return;
    }

    if (target.matches("[data-script-editor-project-file]")) {
      const files = Array.from(target.files ?? []);
      target.value = "";
      if (files.length === 0) {
        return;
      }

      await this.handleScriptEditorProjectFileImport(files);
      return;
    }

    if (target.matches("[data-script-editor-project-field]")) {
      const field = target.dataset.scriptEditorProjectField;
      if (field != null) {
        this.applyScriptEditorProjectField(field, target.value);
      }
      return;
    }

    if (target.matches("[data-script-editor-startup-field]")) {
      const startupField = target.dataset.scriptEditorStartupField;
      const startupFieldToProjectField = {
        initialView: [
          "scenarioProfile.launchPolicy.initialView",
          "scenarioProfile.initialLocation.view",
        ],
        characterSelection: "scenarioProfile.launchPolicy.characterSelection",
        playerCharacterId: "scenarioProfile.playerCharacterId",
        cityId: "scenarioProfile.initialLocation.cityId",
        houseId: "scenarioProfile.initialLocation.houseId",
        sceneId: "scenarioProfile.initialLocation.sceneId",
      };
      const fields = startupFieldToProjectField[startupField];
      for (const field of Array.isArray(fields) ? fields : [fields]) {
        if (field == null) {
          continue;
        }
        this.applyScriptEditorProjectField(field, target.value);
      }
      return;
    }

    if (target.matches("[data-script-editor-person-field]")) {
      const field = target.dataset.scriptEditorPersonField;
      if (field != null) {
        this.applyScriptEditorPersonField(field, target.value);
      }
      return;
    }

    if (target.matches("[data-script-editor-person-mapped-field]")) {
      const field = target.dataset.scriptEditorPersonMappedField;
      if (field != null) {
        const value =
          target instanceof globalThis.HTMLInputElement &&
          target.type === "checkbox"
            ? String(target.checked)
            : target.value;
        this.applyScriptEditorPersonField(field, value);
      }
      return;
    }

    if (target.matches("[data-script-editor-person-attribute-field]")) {
      const field = target.dataset.scriptEditorPersonAttributeField;
      const index = Number.parseInt(
        target.dataset.scriptEditorPersonAttributeIndex ?? "-1",
        10
      );
      if (
        (field === "key" || field === "label" || field === "value") &&
        Number.isInteger(index) &&
        index >= 0
      ) {
        this.applyScriptEditorPersonAttributeField(index, field, target.value);
      }
      return;
    }

    if (target.matches("[data-script-editor-person-relation-family]")) {
      const family = target.dataset.scriptEditorPersonRelationFamily;
      const index = Number.parseInt(
        target.dataset.scriptEditorPersonRelationIndex ?? "-1",
        10
      );
      if (
        (family === "dialogueIds" || family === "eventIds") &&
        Number.isInteger(index) &&
        index >= 0
      ) {
        this.applyScriptEditorPersonRelationField(index, family, target.value);
      }
      return;
    }

    if (target.matches("[data-script-editor-story-field]")) {
      const field = target.dataset.scriptEditorStoryField;
      if (
        field === "id" ||
        field === "title" ||
        field === "chapterId" ||
        field === "summary" ||
        field === "progressMode"
      ) {
        this.applyScriptEditorStoryField(field, target.value);
      }
      return;
    }

    if (target.matches("[data-script-editor-dialogue-field]")) {
      const field = target.dataset.scriptEditorDialogueField;
      if (field === "id" || field === "title" || field === "storyNodeId") {
        this.applyScriptEditorDialogueField(field, target.value);
      }
      return;
    }

    if (target.matches("[data-script-editor-dialogue-node-field]")) {
      const field = target.dataset.scriptEditorDialogueNodeField;
      const index = Number.parseInt(
        target.dataset.scriptEditorDialogueNodeIndex ?? "-1",
        10
      );
      if (
        ["id", "nodeType", "speakerPersonId", "textId", "nextNodeId", "choiceTargetNodeId"].includes(
          field ?? ""
        ) &&
        Number.isInteger(index) &&
        index >= 0
      ) {
        this.applyScriptEditorDialogueNodeField(index, field, target.value);
      }
      return;
    }

    if (target.matches("[data-script-editor-dialogue-follow-up-field]")) {
      const field = target.dataset.scriptEditorDialogueFollowUpField;
      const index = Number.parseInt(
        target.dataset.scriptEditorDialogueFollowUpIndex ?? "-1",
        10
      );
      if (
        (field === "targetFamily" || field === "targetId") &&
        Number.isInteger(index) &&
        index >= 0
      ) {
        this.applyScriptEditorDialogueFollowUpField(index, field, target.value);
      }
      return;
    }

    if (target.matches('[data-script-editor-relation-kind="dialogue-participants"]')) {
      const index = Number.parseInt(target.dataset.scriptEditorRelationIndex ?? "-1", 10);
      if (Number.isInteger(index) && index >= 0) {
        this.applyScriptEditorDialogueParticipantField(index, target.value);
      }
      return;
    }

    if (target.matches("[data-script-editor-event-field]")) {
      const field = target.dataset.scriptEditorEventField;
      if (field === "id" || field === "title" || field === "description") {
        this.applyScriptEditorEventField(field, target.value);
      }
      return;
    }

    if (
      target instanceof globalThis.HTMLInputElement &&
      target.matches("[data-script-editor-event-repeatable]")
    ) {
      this.applyScriptEditorEventRepeatable(target.checked);
      return;
    }

    if (target.matches("[data-script-editor-event-destination-field]")) {
      const field = target.dataset.scriptEditorEventDestinationField;
      if (field === "family" || field === "targetId") {
        this.applyScriptEditorEventDestinationField(field, target.value);
      }
      return;
    }

    if (target.matches("[data-script-editor-event-story-node-id]")) {
      this.applyScriptEditorEventStoryNodeId(target.value);
      return;
    }

    if (target.matches("[data-script-editor-event-preview-field]")) {
      const field = target.dataset.scriptEditorEventPreviewField;
      if (field === "previewNotes" || field === "validationNotes") {
        this.applyScriptEditorEventPreviewField(field, target.value);
      }
      return;
    }

    if (target.matches("[data-script-editor-event-binding-field]")) {
      const bindingId = target.dataset.scriptEditorEventBindingId;
      const field = target.dataset.scriptEditorEventBindingField;
      if (bindingId != null && (field === "eventId" || field === "priority")) {
        this.applyScriptEditorEventBindingField(bindingId, field, target.value);
      }
      return;
    }

    if (
      target instanceof globalThis.HTMLInputElement &&
      target.matches("[data-script-editor-event-binding-enabled]")
    ) {
      const bindingId = target.dataset.scriptEditorEventBindingId;
      if (bindingId != null) {
        this.applyScriptEditorEventBindingField(bindingId, "enabled", target.checked);
      }
      return;
    }

    if (target.matches("[data-script-editor-event-binding-owner-field]")) {
      const bindingId = target.dataset.scriptEditorEventBindingId;
      const field = target.dataset.scriptEditorEventBindingOwnerField;
      if (bindingId != null && (field === "family" || field === "id")) {
        this.applyScriptEditorEventBindingOwnerField(bindingId, field, target.value);
      }
      return;
    }

    if (target.matches("[data-script-editor-event-binding-trigger-field]")) {
      const bindingId = target.dataset.scriptEditorEventBindingId;
      const field = target.dataset.scriptEditorEventBindingTriggerField;
      if (bindingId != null && (field === "timing" || field === "action")) {
        this.applyScriptEditorEventBindingTriggerField(bindingId, field, target.value);
      }
      return;
    }

    if (target.matches("[data-script-editor-event-binding-condition-operator]")) {
      const bindingId = target.dataset.scriptEditorEventBindingId;
      if (bindingId != null) {
        this.applyScriptEditorEventBindingConditionOperator(bindingId, target.value);
      }
      return;
    }

    if (target.matches("[data-script-editor-event-binding-condition-item-field]")) {
      const bindingId = target.dataset.scriptEditorEventBindingId;
      const field = target.dataset.scriptEditorEventBindingConditionItemField;
      const index = Number.parseInt(
        target.dataset.scriptEditorEventBindingConditionItemIndex ?? "-1",
        10
      );
      if (
        bindingId != null &&
        [
          "type",
          "sourceFamily",
          "field",
          "operator",
          "value",
          "valueType",
          "resolverId",
          "handlerId",
          "payload",
        ].includes(field ?? "") &&
        Number.isInteger(index) &&
        index >= 0
      ) {
        this.applyScriptEditorEventBindingConditionItemField(
          bindingId,
          index,
          field,
          target.value
        );
      }
      return;
    }

    if (target.matches("[data-script-editor-minigame-field]")) {
      const field = target.dataset.scriptEditorMinigameField;
      if (
        [
          "id",
          "title",
          "description",
          "playableId",
          "integrationId",
          "ownerKind",
          "ownerId",
          "returnPolicy",
          "triggerId",
          "triggerSource",
          "triggerEvent",
          "notes",
        ].includes(field ?? "")
      ) {
        this.applyScriptEditorMinigameField(field, target.value);
      }
      return;
    }

    if (target.matches("[data-script-editor-minigame-integration]")) {
      this.applyScriptEditorMinigameIntegration(target.value);
      return;
    }

    if (target.matches("[data-script-editor-minigame-launch-field]")) {
      const field = target.dataset.scriptEditorMinigameLaunchField;
      const index = Number.parseInt(
        target.dataset.scriptEditorMinigameLaunchIndex ?? "-1",
        10
      );
      if ((field === "key" || field === "value") && Number.isInteger(index) && index >= 0) {
        this.applyScriptEditorMinigameLaunchField(index, field, target.value);
      }
      return;
    }

    if (target.matches("[data-script-editor-minigame-outcome-field]")) {
      const field = target.dataset.scriptEditorMinigameOutcomeField;
      const index = Number.parseInt(
        target.dataset.scriptEditorMinigameOutcomeIndex ?? "-1",
        10
      );
      if (
        ["id", "outcome", "handoffPolicy", "summary", "effectHint"].includes(
          field ?? ""
        ) &&
        Number.isInteger(index) &&
        index >= 0
      ) {
        this.applyScriptEditorMinigameOutcomeField(index, field, target.value);
      }
      return;
    }

    if (target.matches('[data-script-editor-relation-kind^="story-related-"]')) {
      const relationKind = target.dataset.scriptEditorRelationKind;
      const index = Number.parseInt(target.dataset.scriptEditorRelationIndex ?? "-1", 10);
      if (Number.isInteger(index) && index >= 0 && relationKind != null) {
        this.applyScriptEditorStoryRelationField(relationKind, index, target.value);
      }
      return;
    }

    if (target.matches('[data-script-editor-relation-kind^="event-related-"]')) {
      const relationKind = target.dataset.scriptEditorRelationKind;
      const index = Number.parseInt(target.dataset.scriptEditorRelationIndex ?? "-1", 10);
      if (Number.isInteger(index) && index >= 0 && relationKind != null) {
        this.applyScriptEditorEventRelationField(relationKind, index, target.value);
      }
      return;
    }

    if (
      target instanceof globalThis.HTMLInputElement &&
      target.matches("[data-script-editor-person-trade-enabled]")
    ) {
      this.applyScriptEditorPersonTradeEnabled(target.checked);
      return;
    }

    if (target.matches("[data-script-editor-location-field]")) {
      const field = target.dataset.scriptEditorLocationField;
      if (
        field === "id" ||
        field === "name" ||
        field === "description" ||
        field === "cityId"
      ) {
        this.applyScriptEditorLocationField(field, target.value);
      }
      return;
    }

    if (target.matches("[data-script-editor-city-mounted-building]")) {
      const index = Number.parseInt(
        target.dataset.scriptEditorCityMountedBuildingIndex ?? "-1",
        10
      );
      if (Number.isInteger(index) && index >= 0) {
        this.applyScriptEditorCityMountedBuilding(index, target.value);
      }
      return;
    }

    if (target.matches("[data-script-editor-city-mounted-building-npc]")) {
      const buildingIndex = Number.parseInt(
        target.dataset.scriptEditorCityMountedBuildingIndex ?? "-1",
        10
      );
      const npcIndex = Number.parseInt(
        target.dataset.scriptEditorCityMountedBuildingNpcIndex ?? "-1",
        10
      );
      if (
        Number.isInteger(buildingIndex) &&
        buildingIndex >= 0 &&
        Number.isInteger(npcIndex) &&
        npcIndex >= 0
      ) {
        this.applyScriptEditorCityMountedBuildingNpc(
          buildingIndex,
          npcIndex,
          target.value
        );
      }
      return;
    }

    if (target.matches("[data-script-editor-city-primary-npc]")) {
      const buildingIndex = Number.parseInt(
        target.dataset.scriptEditorCityMountedBuildingIndex ?? "-1",
        10
      );
      if (Number.isInteger(buildingIndex) && buildingIndex >= 0) {
        this.applyScriptEditorCityMountedBuildingPrimaryNpc(
          buildingIndex,
          target.value
        );
      }
      return;
    }

    if (target.matches("[data-script-editor-location-menu-field]")) {
      const field = target.dataset.scriptEditorLocationMenuField;
      const index = Number.parseInt(
        target.dataset.scriptEditorLocationMenuIndex ?? "-1",
        10
      );
      if (
        ["id", "label", "menuFamily", "targetFamily", "targetId", "disabledHint"].includes(
          field ?? ""
        ) &&
        Number.isInteger(index) &&
        index >= 0
      ) {
        this.applyScriptEditorLocationMenuField(index, field, target.value);
      }
      return;
    }

    if (target.matches("[data-script-editor-location-attribute-field]")) {
      const field = target.dataset.scriptEditorLocationAttributeField;
      const index = Number.parseInt(
        target.dataset.scriptEditorLocationAttributeIndex ?? "-1",
        10
      );
      if (
        (field === "key" || field === "label" || field === "value") &&
        Number.isInteger(index) &&
        index >= 0
      ) {
        this.applyScriptEditorLocationAttributeField(index, field, target.value);
      }
      return;
    }

    if (
      target instanceof globalThis.HTMLInputElement &&
      target.matches("[data-script-editor-location-menu-flag]")
    ) {
      const field = target.dataset.scriptEditorLocationMenuFlag;
      const index = Number.parseInt(
        target.dataset.scriptEditorLocationMenuIndex ?? "-1",
        10
      );
      if (
        (field === "isVisible" || field === "isEnabled") &&
        Number.isInteger(index) &&
        index >= 0
      ) {
        this.applyScriptEditorLocationMenuFlag(index, field, target.checked);
      }
      return;
    }

    if (target.matches("[data-script-editor-location-access-field]")) {
      const field = target.dataset.scriptEditorLocationAccessField;
      if (
        field === "blockedMessage" ||
        field === "blockedSpeaker" ||
        field === "guidance" ||
        field === "conditionExpression"
      ) {
        this.applyScriptEditorLocationAccessField(field, target.value);
      }
      return;
    }

    if (target.matches("[data-script-editor-building-entry-field]")) {
      const field = target.dataset.scriptEditorBuildingEntryField;
      if (
        field === "defaultPersonId" ||
        field === "onEnterEventId" ||
        field === "onLeaveEventId" ||
        field === "returnTarget"
      ) {
        this.applyScriptEditorBuildingEntryField(field, target.value);
      }
    }
  }

  onInput(event) {
    const target = event.target;
    if (!(target instanceof globalThis.HTMLInputElement)) {
      return;
    }

    if (target.matches("[data-script-editor-record-search-family]")) {
      if (event.isComposing === true) {
        return;
      }
      const family = target.dataset.scriptEditorRecordSearchFamily;
      if (family != null) {
        this.setScriptEditorRecordSearchValue(family, target.value);
      }
    }
  }

  onCompositionEnd(event) {
    const target = event.target;
    if (!(target instanceof globalThis.HTMLInputElement)) {
      return;
    }

    if (target.matches("[data-script-editor-record-search-family]")) {
      const family = target.dataset.scriptEditorRecordSearchFamily;
      if (family != null) {
        this.setScriptEditorRecordSearchValue(family, target.value);
      }
    }
  }

  scheduleCharacterDetailTransitionCleanup() {
    if (this.previousCharacterDetail == null) {
      return;
    }

    const token = this.characterDetailTransitionToken;
    this.characterDetailTransitionTimer = globalThis.setTimeout(() => {
      if (token !== this.characterDetailTransitionToken) {
        return;
      }
      this.previousCharacterDetail = null;
      this.characterDetailTransitionTimer = 0;
      this.render();
    }, 680);
  }

  clearCharacterDetailTransitionTimer() {
    if (this.characterDetailTransitionTimer !== 0) {
      globalThis.clearTimeout(this.characterDetailTransitionTimer);
      this.characterDetailTransitionTimer = 0;
    }
  }

  onHover(event) {
    if (this.currentScreen !== "character-select") {
      return;
    }

    const target = event.target;
    if (target == null || typeof target.closest !== "function") {
      return;
    }

    const effectElement = this.getInkParticleTarget(target);
    const relatedTarget = event.relatedTarget;
    if (
      effectElement == null ||
      (relatedTarget != null &&
        typeof relatedTarget.nodeType === "number" &&
        effectElement.contains(relatedTarget))
    ) {
      return;
    }

    this.inkParticleSystem?.playBurstForElement(effectElement);
  }

  onFocus(event) {
    if (this.currentScreen !== "character-select") {
      return;
    }

    const target = event.target;
    if (target == null || typeof target.closest !== "function") {
      return;
    }

    const effectElement = this.getInkParticleTarget(target);
    if (effectElement != null) {
      this.inkParticleSystem?.playBurstForElement(effectElement, { count: 28 });
    }
  }

  getInkParticleTarget(target) {
    return target.closest(
      [
        ".c-main-ui-character-card[data-character-id]",
        ".c-main-ui-page-button",
        ".c-main-ui-page-turn-button",
        ".c-main-ui-image-button--choose",
        ".c-main-ui-book-tab",
      ].join(", ")
    );
  }

  setupCharacterSelectInkParticles() {
    const canvas = this.overlayRoot.querySelector(".c-main-ui-ink-particle-canvas");
    if (canvas == null || typeof canvas.getContext !== "function") {
      return;
    }

    this.inkParticleSystem = new InkParticleSystem(canvas);
    this.installInkParticleDebugTools();
    this.overlayRoot
      .querySelectorAll(
        [
          ".c-main-ui-character-card[data-character-id]",
          ".c-main-ui-page-button",
          ".c-main-ui-page-turn-button",
          ".c-main-ui-image-button--choose",
          ".c-main-ui-book-tab",
        ].join(", ")
      )
      .forEach((element) => {
        this.inkParticleSystem?.prepareElementShape(element);
      });
    const selectedCard = this.overlayRoot.querySelector(".c-main-ui-character-card.is-selected");
    if (
      selectedCard != null &&
      selectedCard.dataset.characterId === this.pendingSelectedInkBurstCharacterId
    ) {
      this.inkParticleSystem.playBurstForElement(selectedCard, {
        count: randomInt(3, 7),
        distanceMin: 4,
        distanceMax: 16,
        edgeBias: "selected",
      });
      this.pendingSelectedInkBurstCharacterId = null;
    }
  }

  destroyInkParticleSystem() {
    this.inkParticleSystem?.destroy();
    this.inkParticleSystem = null;
    const debugRoot = globalThis.window ?? globalThis;
    if (debugRoot.__inkFxDebug?.owner === this) {
      delete debugRoot.__inkFxDebug;
    }
  }

  installInkParticleDebugTools() {
    const debugRoot = globalThis.window ?? globalThis;
    debugRoot.__inkFxDebug = {
      owner: this,
      burst: (selector) => {
        const element = this.resolveInkParticleDebugElement(selector);
        this.inkParticleSystem?.playBurstForElement(element, { count: 36 });
        return this.describeInkParticleDebugElement(element);
      },
      loop: (selector) => {
        const element = this.resolveInkParticleDebugElement(selector);
        this.inkParticleSystem?.stopLoop("debug");
        this.inkParticleSystem?.startLoopForElement("debug", element, {
          countMin: 3,
          countMax: 7,
          intervalMin: 140,
          intervalMax: 260,
          distanceMin: 4,
          distanceMax: 16,
          edgeBias: "selected",
        });
        return this.describeInkParticleDebugElement(element);
      },
      stopLoop: (id = "debug") => {
        this.inkParticleSystem?.stopLoop(id);
        return { stopped: id };
      },
      drawRect: (selector) => {
        const element = this.resolveInkParticleDebugElement(selector);
        this.inkParticleSystem?.drawRectForElement(element);
        return this.describeInkParticleDebugElement(element);
      },
    };
  }

  resolveInkParticleDebugElement(selector) {
    let element = this.overlayRoot.querySelector(selector);
    if (element == null && selector.includes(".character-card")) {
      element = this.overlayRoot.querySelector(
        selector.replaceAll(".character-card", ".c-main-ui-character-card")
      );
    }
    if (element == null) {
      throw new Error(`Ink FX debug target not found: ${selector}`);
    }
    return element;
  }

  describeInkParticleDebugElement(element) {
    const canvas = this.overlayRoot.querySelector(".c-main-ui-ink-particle-canvas");
    const elementRect = element.getBoundingClientRect();
    const canvasRect = canvas?.getBoundingClientRect();
    return {
      tagName: element.tagName,
      className: element.className,
      elementRect: rectToDebugData(elementRect),
      canvasRect: canvasRect == null ? null : rectToDebugData(canvasRect),
    };
  }

  getSelectedCharacter() {
    return this.getCharacterById(this.selectedCharacterId);
  }

  getCharacterById(characterId) {
    if (characterId == null) {
      return null;
    }

    return this.characters.find((character) => character.id === characterId) ?? null;
  }

  async handleScriptEditorAction(action, actionElement = null) {
    const projectId = actionElement?.dataset.scriptEditorProjectId ?? null;
    const personTab = actionElement?.dataset.scriptEditorPersonTab ?? null;
    const personAttributeIndex = Number.parseInt(
      actionElement?.dataset.scriptEditorPersonAttributeIndex ?? "-1",
      10
    );
    const personRelationIndex = Number.parseInt(
      actionElement?.dataset.scriptEditorPersonRelationIndex ?? "-1",
      10
    );
    const locationTab = actionElement?.dataset.scriptEditorLocationTab ?? null;
    const locationMenuIndex = Number.parseInt(
      actionElement?.dataset.scriptEditorLocationMenuIndex ?? "-1",
      10
    );
    const narrativeTab = actionElement?.dataset.scriptEditorNarrativeTab ?? null;
    const eventTab = actionElement?.dataset.scriptEditorEventTab ?? null;
    const minigameTab = actionElement?.dataset.scriptEditorMinigameTab ?? null;
    const targetTab = actionElement?.dataset.scriptEditorTargetTab ?? null;
    const dialogueNodeIndex = Number.parseInt(
      actionElement?.dataset.scriptEditorDialogueNodeIndex ?? "-1",
      10
    );
    const dialogueFollowUpIndex = Number.parseInt(
      actionElement?.dataset.scriptEditorDialogueFollowUpIndex ?? "-1",
      10
    );
    const eventBindingId = actionElement?.dataset.scriptEditorEventBindingId ?? null;
    const ownerFamily = actionElement?.dataset.scriptEditorOwnerFamily ?? null;
    const ownerId = actionElement?.dataset.scriptEditorOwnerId ?? null;
    const eventBindingConditionItemIndex = Number.parseInt(
      actionElement?.dataset.scriptEditorEventBindingConditionItemIndex ?? "-1",
      10
    );
    const relationIndex = Number.parseInt(
      actionElement?.dataset.scriptEditorRelationIndex ?? "-1",
      10
    );
    const minigameLaunchIndex = Number.parseInt(
      actionElement?.dataset.scriptEditorMinigameLaunchIndex ?? "-1",
      10
    );
    const minigameOutcomeIndex = Number.parseInt(
      actionElement?.dataset.scriptEditorMinigameOutcomeIndex ?? "-1",
      10
    );
    const targetFamily = actionElement?.dataset.scriptEditorFamily ?? null;
    const targetEntityId = actionElement?.dataset.scriptEditorEntityId ?? null;

    if (action === "new-project") {
      try {
        await this.createScriptEditorProjectAtSavePath();
      } catch (error) {
        this.recordScriptEditorNotice({
          tone: "warning",
          message:
            error instanceof Error
              ? error.message
              : "Failed to create script editor project.",
        });
        this.render();
        return;
      }
      this.resetScriptEditorRecordListPages();
      this.resetScriptEditorRecordSearch();
      this.scriptEditorSelection = {
        family: "storyPack",
        entityId: null,
      };
      this.scriptEditorAuxiliaryPanelOpen = false;
      this.scriptEditorExportDirectoryHandle = null;
      this.scriptEditorPendingDeleteProjectId = null;
      this.resetScriptEditorNoticeTimeline();
      this.recordScriptEditorNotice({
        tone: "success",
        message: "已新建剧本项目。",
      });
      this.setScreen("script-editor-workspace");
      return;
    }

    if (action === "open-project") {
      await this.openScriptEditorProjectFromDirectory();
      return;
    }

    if (action === "import-pack") {
      await this.handleScriptEditorTemplateImport();
      return;
    }

    if (action === "continue-session") {
      if (this.scriptEditorProject != null) {
        this.scriptEditorNotice = null;
        this.setScreen("script-editor-workspace");
      }
      return;
    }

    if (action === "continue-project") {
      if (projectId != null) {
        this.continueScriptEditorProject(projectId);
      }
      return;
    }

    if (action === "request-delete-project") {
      if (projectId != null) {
        this.scriptEditorPendingDeleteProjectId = projectId;
        this.render();
      }
      return;
    }

    if (action === "cancel-delete-project") {
      if (
        projectId == null ||
        this.scriptEditorPendingDeleteProjectId === projectId
      ) {
        this.scriptEditorPendingDeleteProjectId = null;
        this.render();
      }
      return;
    }

    if (action === "confirm-delete-project") {
      if (projectId != null) {
        this.deleteScriptEditorProject(projectId);
      }
      return;
    }

    if (action === "back-to-landing") {
      this.showScriptEditorLanding();
      return;
    }

    if (action === "back-to-menu") {
      this.showMainMenu();
      return;
    }

    if (action === "project-info") {
      this.scriptEditorSelection = {
        family: "storyPack",
        entityId: null,
      };
      this.render();
      return;
    }

    if (action === "save") {
      await this.saveScriptEditorProject();
      return;
    }

    if (action === "validate") {
      this.runScriptEditorValidation();
      return;
    }

    if (action === "preview-runtime") {
      await this.previewScriptEditorProjectRuntime();
      return;
    }

    if (action === "exit-runtime-preview") {
      this.exitScriptEditorRuntimePreview();
      return;
    }

    if (action === "export") {
      await this.exportScriptEditorProject();
      return;
    }

    if (action === "toggle-preview-panel") {
      this.toggleScriptEditorAuxiliaryPanel();
      return;
    }

    if (action === "jump-to-preview-issue") {
      if (targetFamily != null) {
        this.jumpToScriptEditorIssue(targetFamily, targetEntityId, targetTab);
      }
      return;
    }

    if (action === "add-record") {
      this.addScriptEditorRecord();
      return;
    }

    if (action === "remove-record") {
      this.removeScriptEditorRecord();
      return;
    }

    if (action === "apply-record-json") {
      this.applyScriptEditorRecordJson();
      return;
    }

    if (action === "apply-text-entry-text") {
      this.applyScriptEditorTextEntryText();
      return;
    }

    if (action === "record-page-prev") {
      this.changeScriptEditorRecordListPage(-1);
      return;
    }

    if (action === "record-page-next") {
      this.changeScriptEditorRecordListPage(1);
      return;
    }

    if (action === "select-person-tab") {
      if (personTab != null) {
        this.selectScriptEditorPersonTab(personTab);
      }
      return;
    }

    if (action === "add-person-attribute") {
      this.addScriptEditorPersonAttribute();
      return;
    }

    if (action === "person-attribute-page-prev") {
      this.changeScriptEditorPersonAttributePage(-1);
      return;
    }

    if (action === "person-attribute-page-next") {
      this.changeScriptEditorPersonAttributePage(1);
      return;
    }

    if (action === "remove-person-attribute") {
      if (Number.isInteger(personAttributeIndex) && personAttributeIndex >= 0) {
        this.removeScriptEditorPersonAttribute(personAttributeIndex);
      }
      return;
    }

    if (action === "add-person-dialogue-link") {
      this.addScriptEditorPersonRelation("dialogueIds");
      return;
    }

    if (action === "remove-person-dialogue-link") {
      if (Number.isInteger(personRelationIndex) && personRelationIndex >= 0) {
        this.removeScriptEditorPersonRelation("dialogueIds", personRelationIndex);
      }
      return;
    }

    if (action === "add-person-event-link") {
      this.addScriptEditorPersonRelation("eventIds");
      return;
    }

    if (action === "remove-person-event-link") {
      if (Number.isInteger(personRelationIndex) && personRelationIndex >= 0) {
        this.removeScriptEditorPersonRelation("eventIds", personRelationIndex);
      }
      return;
    }

    if (action === "select-location-tab") {
      if (locationTab != null) {
        this.selectScriptEditorLocationTab(locationTab);
      }
      return;
    }

    if (action === "add-location-menu-entry") {
      this.addScriptEditorLocationMenuEntry();
      return;
    }

    if (action === "remove-location-menu-entry") {
      if (Number.isInteger(locationMenuIndex) && locationMenuIndex >= 0) {
        this.removeScriptEditorLocationMenuEntry(locationMenuIndex);
      }
      return;
    }

    if (action === "add-location-attribute") {
      this.addScriptEditorLocationAttribute();
      return;
    }

    if (action === "remove-location-attribute") {
      const locationAttributeIndex = Number.parseInt(
        actionElement?.dataset.scriptEditorLocationAttributeIndex ?? "-1",
        10
      );
      if (Number.isInteger(locationAttributeIndex) && locationAttributeIndex >= 0) {
        this.removeScriptEditorLocationAttribute(locationAttributeIndex);
      }
      return;
    }

    if (action === "add-city-mounted-building") {
      this.addScriptEditorCityMountedBuilding();
      return;
    }

    if (action === "remove-city-mounted-building") {
      const mountedBuildingIndex = Number.parseInt(
        actionElement?.dataset.scriptEditorCityMountedBuildingIndex ?? "-1",
        10
      );
      if (Number.isInteger(mountedBuildingIndex) && mountedBuildingIndex >= 0) {
        this.removeScriptEditorCityMountedBuilding(mountedBuildingIndex);
      }
      return;
    }

    if (action === "add-city-mounted-building-npc") {
      const mountedBuildingIndex = Number.parseInt(
        actionElement?.dataset.scriptEditorCityMountedBuildingIndex ?? "-1",
        10
      );
      if (Number.isInteger(mountedBuildingIndex) && mountedBuildingIndex >= 0) {
        this.addScriptEditorCityMountedBuildingNpc(mountedBuildingIndex);
      }
      return;
    }

    if (action === "remove-city-mounted-building-npc") {
      const mountedBuildingIndex = Number.parseInt(
        actionElement?.dataset.scriptEditorCityMountedBuildingIndex ?? "-1",
        10
      );
      const mountedNpcIndex = Number.parseInt(
        actionElement?.dataset.scriptEditorCityMountedBuildingNpcIndex ?? "-1",
        10
      );
      if (
        Number.isInteger(mountedBuildingIndex) &&
        mountedBuildingIndex >= 0 &&
        Number.isInteger(mountedNpcIndex) &&
        mountedNpcIndex >= 0
      ) {
        this.removeScriptEditorCityMountedBuildingNpc(
          mountedBuildingIndex,
          mountedNpcIndex
        );
      }
      return;
    }

    if (action === "select-narrative-tab") {
      if (narrativeTab != null) {
        this.selectScriptEditorNarrativeTab(narrativeTab);
      }
      return;
    }

    if (action === "select-event-tab") {
      if (eventTab != null) {
        this.selectScriptEditorEventTab(eventTab);
      }
      return;
    }

    if (action === "select-minigame-tab") {
      if (minigameTab != null) {
        this.selectScriptEditorMinigameTab(minigameTab);
      }
      return;
    }

    if (action === "add-story-related-people") {
      this.addScriptEditorStoryRelation("relatedPersonIds");
      return;
    }

    if (action === "remove-story-related-people") {
      if (Number.isInteger(relationIndex) && relationIndex >= 0) {
        this.removeScriptEditorStoryRelation("relatedPersonIds", relationIndex);
      }
      return;
    }

    if (action === "add-story-related-dialogues") {
      this.addScriptEditorStoryRelation("relatedDialogueIds");
      return;
    }

    if (action === "remove-story-related-dialogues") {
      if (Number.isInteger(relationIndex) && relationIndex >= 0) {
        this.removeScriptEditorStoryRelation("relatedDialogueIds", relationIndex);
      }
      return;
    }

    if (action === "add-story-related-events") {
      this.addScriptEditorStoryRelation("relatedEventIds");
      return;
    }

    if (action === "remove-story-related-events") {
      if (Number.isInteger(relationIndex) && relationIndex >= 0) {
        this.removeScriptEditorStoryRelation("relatedEventIds", relationIndex);
      }
      return;
    }

    if (action === "add-dialogue-participants") {
      this.addScriptEditorDialogueParticipant();
      return;
    }

    if (action === "remove-dialogue-participants") {
      if (Number.isInteger(relationIndex) && relationIndex >= 0) {
        this.removeScriptEditorDialogueParticipant(relationIndex);
      }
      return;
    }

    if (action === "add-dialogue-node") {
      this.addScriptEditorDialogueNode();
      return;
    }

    if (action === "remove-dialogue-node") {
      if (Number.isInteger(dialogueNodeIndex) && dialogueNodeIndex >= 0) {
        this.removeScriptEditorDialogueNode(dialogueNodeIndex);
      }
      return;
    }

    if (action === "add-dialogue-follow-up") {
      this.addScriptEditorDialogueFollowUp();
      return;
    }

    if (action === "remove-dialogue-follow-up") {
      if (Number.isInteger(dialogueFollowUpIndex) && dialogueFollowUpIndex >= 0) {
        this.removeScriptEditorDialogueFollowUp(dialogueFollowUpIndex);
      }
      return;
    }

    if (action === "add-event-binding") {
      this.addScriptEditorEventBinding();
      return;
    }

    if (action === "add-owner-local-event-binding") {
      if (ownerFamily != null && ownerId != null) {
        this.addScriptEditorEventBinding({ ownerFamily, ownerId });
      }
      return;
    }

    if (action === "remove-event-binding") {
      if (eventBindingId != null) {
        this.removeScriptEditorEventBinding(eventBindingId);
      }
      return;
    }

    if (action === "remove-owner-local-event-binding") {
      if (eventBindingId != null) {
        this.removeScriptEditorEventBinding(eventBindingId);
      }
      return;
    }

    if (action === "add-event-binding-condition-item") {
      if (eventBindingId != null) {
        this.addScriptEditorEventBindingConditionItem(eventBindingId);
      }
      return;
    }

    if (action === "remove-event-binding-condition-item") {
      if (
        eventBindingId != null &&
        Number.isInteger(eventBindingConditionItemIndex) &&
        eventBindingConditionItemIndex >= 0
      ) {
        this.removeScriptEditorEventBindingConditionItem(
          eventBindingId,
          eventBindingConditionItemIndex
        );
      }
      return;
    }

    if (action === "add-event-related-people") {
      this.addScriptEditorEventRelation("personIds");
      return;
    }

    if (action === "remove-event-related-people") {
      if (Number.isInteger(relationIndex) && relationIndex >= 0) {
        this.removeScriptEditorEventRelation("personIds", relationIndex);
      }
      return;
    }

    if (action === "add-event-related-cities") {
      this.addScriptEditorEventRelation("cityIds");
      return;
    }

    if (action === "remove-event-related-cities") {
      if (Number.isInteger(relationIndex) && relationIndex >= 0) {
        this.removeScriptEditorEventRelation("cityIds", relationIndex);
      }
      return;
    }

    if (action === "add-event-related-buildings") {
      this.addScriptEditorEventRelation("buildingIds");
      return;
    }

    if (action === "remove-event-related-buildings") {
      if (Number.isInteger(relationIndex) && relationIndex >= 0) {
        this.removeScriptEditorEventRelation("buildingIds", relationIndex);
      }
      return;
    }

    if (action === "add-minigame-launch-payload-entry") {
      this.addScriptEditorMinigameLaunchPayloadEntry();
      return;
    }

    if (action === "remove-minigame-launch-payload-entry") {
      if (Number.isInteger(minigameLaunchIndex) && minigameLaunchIndex >= 0) {
        this.removeScriptEditorMinigameLaunchPayloadEntry(minigameLaunchIndex);
      }
      return;
    }

    if (action === "add-minigame-outcome-route") {
      this.addScriptEditorMinigameOutcomeRoute();
      return;
    }

    if (action === "remove-minigame-outcome-route") {
      if (Number.isInteger(minigameOutcomeIndex) && minigameOutcomeIndex >= 0) {
        this.removeScriptEditorMinigameOutcomeRoute(minigameOutcomeIndex);
      }
      return;
    }
  }

  selectScriptEditorFamily(family, entityId = null) {
    if (
      this.scriptEditorProject == null ||
      !isScriptEditorMinimalWorkflowFamily(family)
    ) {
      return;
    }

    if (family === "storyPack") {
      this.scriptEditorSelection = {
        family,
        entityId: null,
      };
      this.scriptEditorNotice = null;
      this.render();
      return;
    }

    const records = listScriptEditorWorkflowFamilyRecords(
      this.scriptEditorProject,
      family
    );
    const resolvedEntityId =
      records.find((record) => record.id === entityId)?.id ??
      records[0]?.id ??
      null;

    this.scriptEditorSelection = {
      family,
      entityId: resolvedEntityId,
    };
    if (resolvedEntityId == null) {
      this.setScriptEditorRecordListPage(family, 1);
    } else {
      this.syncScriptEditorRecordListPageToRecord(family, resolvedEntityId, records);
    }
    if (family === "people") {
      this.scriptEditorPersonTab = "profile";
      this.resetScriptEditorPersonAttributePage();
    }
    if (family === "cities" || family === "buildings") {
      this.scriptEditorLocationTab = "profile";
    }
    if (family === "storyNodes" || family === "dialogues") {
      this.scriptEditorNarrativeTab = "profile";
    }
    if (family === "events") {
      this.scriptEditorEventTab = "basics";
    }
    if (family === "minigames") {
      this.scriptEditorMinigameTab = "basics";
    }
    this.scriptEditorNotice = null;
    this.render();
  }

  selectScriptEditorRecord(recordId) {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family === "storyPack"
    ) {
      return;
    }

    const family = this.scriptEditorSelection.family;
    const records = listScriptEditorWorkflowFamilyRecords(this.scriptEditorProject, family);
    if (!records.some((record) => record.id === recordId)) {
      return;
    }

    this.scriptEditorSelection = {
      family,
      entityId: recordId,
    };
    this.syncScriptEditorRecordListPageToRecord(family, recordId, records);
    if (family === "people") {
      this.scriptEditorPersonTab = "profile";
      this.resetScriptEditorPersonAttributePage();
    }
    if (family === "cities" || family === "buildings") {
      this.scriptEditorLocationTab = "profile";
    }
    if (family === "storyNodes" || family === "dialogues") {
      this.scriptEditorNarrativeTab = "profile";
    }
    if (family === "events") {
      this.scriptEditorEventTab = "basics";
    }
    if (family === "minigames") {
      this.scriptEditorMinigameTab = "basics";
    }
    this.scriptEditorNotice = null;
    this.render();
  }

  changeScriptEditorRecordListPage(delta) {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family === "storyPack"
    ) {
      return;
    }

    const family = this.scriptEditorSelection.family;
    this.setScriptEditorRecordListPage(
      family,
      this.getScriptEditorRecordListPage(family) + delta
    );
    this.render();
  }

  goToScriptEditorRecordListPage(page) {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family === "storyPack"
    ) {
      return;
    }

    this.setScriptEditorRecordListPage(this.scriptEditorSelection.family, page);
    this.render();
  }

  selectScriptEditorPersonTab(tab) {
    if (this.scriptEditorSelection.family !== "people") {
      return;
    }

    if (!["profile", "dialogues", "trade", "events"].includes(tab)) {
      return;
    }

    this.scriptEditorPersonTab = tab;
    this.render();
  }

  changeScriptEditorPersonAttributePage(delta) {
    if (this.scriptEditorSelection.family !== "people") {
      return;
    }

    const person = this.getSelectedScriptEditorPerson();
    const totalPages = Math.max(
      1,
      Math.ceil(
        (person?.extendedAttributes?.length ?? 0) /
          SCRIPT_EDITOR_PERSON_ATTRIBUTE_PAGE_SIZE
      )
    );
    this.scriptEditorPersonAttributePage = Math.min(
      Math.max(this.scriptEditorPersonAttributePage + delta, 1),
      totalPages
    );
    this.scriptEditorPersonAttributeVisibleIndices = null;
    this.scriptEditorPersonAttributeScrollLeft = 0;
    this.render();
  }

  selectScriptEditorLocationTab(tab) {
    if (
      this.scriptEditorSelection.family !== "cities" &&
      this.scriptEditorSelection.family !== "buildings"
    ) {
      return;
    }

    const allowedTabs = this.scriptEditorSelection.family === "cities"
      ? ["profile", "menus", "access", "events"]
      : ["profile", "menus", "access", "entry", "events"];
    if (!allowedTabs.includes(tab)) {
      return;
    }

    this.scriptEditorLocationTab = tab;
    this.render();
  }

  selectScriptEditorNarrativeTab(tab) {
    if (
      this.scriptEditorSelection.family !== "storyNodes" &&
      this.scriptEditorSelection.family !== "dialogues"
    ) {
      return;
    }

    const allowedTabs =
      this.scriptEditorSelection.family === "storyNodes"
        ? ["profile", "links", "summary", "events"]
        : ["profile", "nodes", "summary", "events"];
    if (!allowedTabs.includes(tab)) {
      return;
    }

    this.scriptEditorNarrativeTab = tab;
    this.render();
  }

  selectScriptEditorEventTab(tab) {
    if (this.scriptEditorSelection.family !== "events") {
      return;
    }

    if (!["basics", "destination", "relations", "bindings", "preview"].includes(tab)) {
      return;
    }

    this.scriptEditorEventTab = tab;
    this.render();
  }

  selectScriptEditorMinigameTab(tab) {
    if (this.scriptEditorSelection.family !== "minigames") {
      return;
    }

    if (!["basics", "launch", "settlement", "references", "events"].includes(tab)) {
      return;
    }

    this.scriptEditorMinigameTab = tab;
    this.render();
  }

  toggleScriptEditorAuxiliaryPanel(forceValue) {
    this.scriptEditorAuxiliaryPanelOpen =
      typeof forceValue === "boolean"
        ? forceValue
        : !this.scriptEditorAuxiliaryPanelOpen;
    this.render();
  }

  jumpToScriptEditorIssue(family, entityId, targetTab = null) {
    if (this.scriptEditorProject == null) {
      return;
    }

    this.scriptEditorAuxiliaryPanelOpen = true;
    this.selectScriptEditorFamily(family, entityId);

    if (family === "people" && targetTab != null) {
      this.selectScriptEditorPersonTab(targetTab);
      return;
    }

    if ((family === "cities" || family === "buildings") && targetTab != null) {
      this.selectScriptEditorLocationTab(targetTab);
      return;
    }

    if ((family === "storyNodes" || family === "dialogues") && targetTab != null) {
      this.selectScriptEditorNarrativeTab(targetTab);
      return;
    }

    if (family === "events" && targetTab != null) {
      this.selectScriptEditorEventTab(targetTab);
      return;
    }

    if (family === "minigames" && targetTab != null) {
      this.selectScriptEditorMinigameTab(targetTab);
    }
  }

  addScriptEditorRecord() {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family === "storyPack"
    ) {
      return;
    }

    const family = this.scriptEditorSelection.family;
    const draft = createScriptEditorWorkflowRecordDraft(
      family,
      listScriptEditorWorkflowFamilyRecords(this.scriptEditorProject, family).length
    );

    this.commitScriptEditorProject(
      upsertScriptEditorWorkflowRecord(this.scriptEditorProject, family, draft)
    );
    const nextRecords = listScriptEditorWorkflowFamilyRecords(
      this.scriptEditorProject,
      family
    );
    this.scriptEditorSelection = {
      family,
      entityId: draft.id,
    };
    this.syncScriptEditorRecordListPageToRecord(family, draft.id, nextRecords);
    if (family === "people") {
      this.scriptEditorPersonTab = "profile";
    }
    if (family === "cities" || family === "buildings") {
      this.scriptEditorLocationTab = "profile";
    }
    if (family === "storyNodes" || family === "dialogues") {
      this.scriptEditorNarrativeTab = "profile";
    }
    if (family === "events") {
      this.scriptEditorEventTab = "basics";
    }
    if (family === "minigames") {
      this.scriptEditorMinigameTab = "basics";
    }
    this.recordScriptEditorNotice({
      tone: "success",
      message: `已新增一条${this.getScriptEditorFamilyLabel(family)}记录草稿。`,
    });
    this.render();
  }

  removeScriptEditorRecord() {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family === "storyPack" ||
      this.scriptEditorSelection.entityId == null
    ) {
      return;
    }

    const family = this.scriptEditorSelection.family;
    this.commitScriptEditorProject(
      removeScriptEditorWorkflowRecord(
        this.scriptEditorProject,
        family,
        this.scriptEditorSelection.entityId
      )
    );
    const nextRecords = listScriptEditorWorkflowFamilyRecords(
      this.scriptEditorProject,
      family
    );
    this.scriptEditorSelection = {
      family,
      entityId: nextRecords[0]?.id ?? null,
    };
    if (nextRecords[0]?.id != null) {
      this.syncScriptEditorRecordListPageToRecord(family, nextRecords[0].id, nextRecords);
    } else {
      this.setScriptEditorRecordListPage(family, 1);
    }
    this.recordScriptEditorNotice({
      tone: "success",
      message: `已删除当前选中的${this.getScriptEditorFamilyLabel(family)}记录。`,
    });
    this.render();
  }

  applyScriptEditorRecordJson() {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family === "storyPack"
    ) {
      return;
    }

    const textarea = this.overlayRoot.querySelector("[data-script-editor-record-json]");
    if (!(textarea instanceof globalThis.HTMLTextAreaElement)) {
      return;
    }

    try {
      const parsed = JSON.parse(textarea.value);
      if (parsed == null || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("Record JSON must be a single object.");
      }
      if (typeof parsed.id !== "string" || parsed.id.trim().length === 0) {
        throw new Error("Record JSON must include a non-empty string id.");
      }

      const family = this.scriptEditorSelection.family;
      this.commitScriptEditorProject(
        upsertScriptEditorWorkflowRecord(this.scriptEditorProject, family, parsed)
      );
      const nextRecords = listScriptEditorWorkflowFamilyRecords(
        this.scriptEditorProject,
        family
      );
      this.scriptEditorSelection = {
        family,
        entityId: parsed.id,
      };
      this.syncScriptEditorRecordListPageToRecord(family, parsed.id, nextRecords);
      this.recordScriptEditorNotice({
        tone: "success",
        message: `已将 JSON 修改应用到 ${this.getScriptEditorFamilyLabel(family)}?${parsed.id}。`,
      });
    } catch (error) {
      this.recordScriptEditorNotice({
        tone: "warning",
        message:
          error instanceof Error
            ? error.message
            : "Failed to apply record JSON.",
      });
    }

    this.render();
  }

  applyScriptEditorTextEntryText() {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family !== "textEntries" ||
      this.scriptEditorSelection.entityId == null
    ) {
      return;
    }

    const textarea = this.overlayRoot.querySelector("[data-script-editor-text-entry-text]");
    if (!(textarea instanceof globalThis.HTMLTextAreaElement)) {
      return;
    }

    const text = textarea.value;
    const recordId = this.scriptEditorSelection.entityId;
    const nextRecord = {
      ...(this.scriptEditorProject.textEntries.find((record) => record.id === recordId) ?? {
        id: recordId,
      }),
      id: recordId,
      text,
    };

    this.commitScriptEditorProject(
      upsertScriptEditorWorkflowRecord(this.scriptEditorProject, "textEntries", nextRecord)
    );
    const nextRecords = listScriptEditorWorkflowFamilyRecords(
      this.scriptEditorProject,
      "textEntries"
    );
    this.scriptEditorSelection = {
      family: "textEntries",
      entityId: recordId,
    };
    this.syncScriptEditorRecordListPageToRecord("textEntries", recordId, nextRecords);
    this.recordScriptEditorNotice({
      tone: "success",
      message: `已应用文本修改：${recordId}。`,
    });
    this.render();
  }

  applyScriptEditorProjectField(field, value) {
    if (this.scriptEditorProject == null) {
      return;
    }

    const normalizedValue = value.trim();
    const scenarioProfile = {
      ...(this.scriptEditorProject.storyPack.scenarioProfile ?? {}),
      initialLocation: {
        ...(this.scriptEditorProject.storyPack.scenarioProfile?.initialLocation ?? {}),
      },
      launchPolicy: {
        ...(this.scriptEditorProject.storyPack.scenarioProfile?.launchPolicy ?? {}),
      },
    };

    let nextProject = this.scriptEditorProject;

    switch (field) {
      case "project.id":
        nextProject = {
          ...nextProject,
          id: normalizedValue,
        };
        break;
      case "project.title":
        nextProject = {
          ...nextProject,
          title: value,
        };
        break;
      case "project.description":
        nextProject = {
          ...nextProject,
          description: normalizedValue.length === 0 ? undefined : value,
        };
        break;
      case "storyPack.id":
        nextProject = updateScriptEditorWorkflowStoryPack(nextProject, {
          ...nextProject.storyPack,
          id: normalizedValue,
        });
        break;
      case "storyPack.title":
        nextProject = updateScriptEditorWorkflowStoryPack(nextProject, {
          ...nextProject.storyPack,
          title: value,
        });
        break;
      case "storyPack.description":
        nextProject = updateScriptEditorWorkflowStoryPack(nextProject, {
          ...nextProject.storyPack,
          description: normalizedValue.length === 0 ? undefined : value,
        });
        break;
      case "scenarioProfile.id":
        nextProject = updateScriptEditorWorkflowStoryPack(nextProject, {
          ...nextProject.storyPack,
          scenarioProfile: {
            ...scenarioProfile,
            id: normalizedValue,
          },
        });
        break;
      case "scenarioProfile.title":
        nextProject = updateScriptEditorWorkflowStoryPack(nextProject, {
          ...nextProject.storyPack,
          scenarioProfile: {
            ...scenarioProfile,
            title: value,
          },
        });
        break;
      case "scenarioProfile.playerCharacterId":
        nextProject = updateScriptEditorWorkflowStoryPack(nextProject, {
          ...nextProject.storyPack,
          scenarioProfile: {
            ...scenarioProfile,
            playerCharacterId: normalizedValue,
          },
        });
        break;
      case "scenarioProfile.chapterId":
        nextProject = updateScriptEditorWorkflowStoryPack(nextProject, {
          ...nextProject.storyPack,
          scenarioProfile: {
            ...scenarioProfile,
            chapterId: normalizedValue,
          },
        });
        break;
      case "scenarioProfile.initialLocation.mapId":
        nextProject = updateScriptEditorWorkflowStoryPack(nextProject, {
          ...nextProject.storyPack,
          scenarioProfile: {
            ...scenarioProfile,
            initialLocation: {
              ...scenarioProfile.initialLocation,
              mapId: normalizedValue,
            },
          },
        });
        break;
      case "scenarioProfile.initialLocation.cityId":
        nextProject = updateScriptEditorWorkflowStoryPack(nextProject, {
          ...nextProject.storyPack,
          scenarioProfile: {
            ...scenarioProfile,
            initialLocation: {
              ...scenarioProfile.initialLocation,
              cityId: normalizedValue,
            },
          },
        });
        break;
      case "scenarioProfile.initialLocation.houseId":
        nextProject = updateScriptEditorWorkflowStoryPack(nextProject, {
          ...nextProject.storyPack,
          scenarioProfile: {
            ...scenarioProfile,
            initialLocation: {
              ...scenarioProfile.initialLocation,
              houseId: normalizedValue.length === 0 ? null : normalizedValue,
            },
          },
        });
        break;
      case "scenarioProfile.initialLocation.sceneId":
        nextProject = updateScriptEditorWorkflowStoryPack(nextProject, {
          ...nextProject.storyPack,
          scenarioProfile: {
            ...scenarioProfile,
            initialLocation: {
              ...scenarioProfile.initialLocation,
              sceneId: normalizedValue.length === 0 ? undefined : normalizedValue,
            },
          },
        });
        break;
      case "scenarioProfile.initialLocation.view":
        nextProject = updateScriptEditorWorkflowStoryPack(nextProject, {
          ...nextProject.storyPack,
          scenarioProfile: {
            ...scenarioProfile,
            initialLocation: {
              ...scenarioProfile.initialLocation,
              view: normalizedValue,
            },
          },
        });
        break;
      case "scenarioProfile.entryEventId":
        nextProject = updateScriptEditorWorkflowStoryPack(nextProject, {
          ...nextProject.storyPack,
          scenarioProfile: {
            ...scenarioProfile,
            entryEventId: normalizedValue.length === 0 ? undefined : normalizedValue,
          },
        });
        break;
      case "scenarioProfile.launchPolicy.characterSelection":
        nextProject = updateScriptEditorWorkflowStoryPack(nextProject, {
          ...nextProject.storyPack,
          scenarioProfile: {
            ...scenarioProfile,
            launchPolicy: {
              ...scenarioProfile.launchPolicy,
              characterSelection:
                normalizedValue.length === 0 ? undefined : normalizedValue,
            },
          },
        });
        break;
      case "scenarioProfile.launchPolicy.initialView":
        nextProject = updateScriptEditorWorkflowStoryPack(nextProject, {
          ...nextProject.storyPack,
          scenarioProfile: {
            ...scenarioProfile,
            launchPolicy: {
              ...scenarioProfile.launchPolicy,
              initialView: normalizedValue.length === 0 ? undefined : normalizedValue,
            },
          },
        });
        break;
      case "scenarioProfile.launchPolicy.entryEventTiming":
        nextProject = updateScriptEditorWorkflowStoryPack(nextProject, {
          ...nextProject.storyPack,
          scenarioProfile: {
            ...scenarioProfile,
            launchPolicy: {
              ...scenarioProfile.launchPolicy,
              entryEventTiming:
                normalizedValue.length === 0 ? undefined : normalizedValue,
            },
          },
        });
        break;
      default:
        return;
    }

    this.commitScriptEditorProject(nextProject);
    this.scriptEditorNotice = null;
    this.render();
  }

  applyScriptEditorPersonField(field, value) {
    const person = this.getSelectedScriptEditorPerson();
    if (person == null) {
      return;
    }

    this.replaceSelectedScriptEditorPerson(
      updateScriptEditorPersonField(person, field, value)
    );
  }

  applyScriptEditorPersonTradeEnabled(enabled) {
    const person = this.getSelectedScriptEditorPerson();
    if (person == null) {
      return;
    }

    this.replaceSelectedScriptEditorPerson(
      toggleScriptEditorPersonTradeEnabled(person, enabled)
    );
  }

  addScriptEditorPersonAttribute() {
    const person = this.getSelectedScriptEditorPerson();
    if (person == null) {
      return;
    }

    const nextPerson = appendScriptEditorPersonAttribute(person);
    this.scriptEditorPersonAttributePage = Math.max(
      1,
      Math.ceil(
        (nextPerson.extendedAttributes?.length ?? 0) /
          SCRIPT_EDITOR_PERSON_ATTRIBUTE_PAGE_SIZE
      )
    );
    this.scriptEditorPersonAttributeVisibleIndices = null;
    this.scriptEditorPersonAttributeScrollLeft = 0;
    this.replaceSelectedScriptEditorPerson(nextPerson);
  }

  removeScriptEditorPersonAttribute(index) {
    const person = this.getSelectedScriptEditorPerson();
    if (person == null) {
      return;
    }

    const nextPerson = removeScriptEditorPersonAttribute(person, index);
    const nextAttributeCount = nextPerson.extendedAttributes?.length ?? 0;
    const nextTotalPages = Math.max(
      1,
      Math.ceil(nextAttributeCount / SCRIPT_EDITOR_PERSON_ATTRIBUTE_PAGE_SIZE)
    );

    if (this.scriptEditorPersonAttributePage > nextTotalPages) {
      this.scriptEditorPersonAttributePage = nextTotalPages;
      this.scriptEditorPersonAttributeVisibleIndices = null;
      this.scriptEditorPersonAttributeScrollLeft = 0;
    } else if (Array.isArray(this.scriptEditorPersonAttributeVisibleIndices)) {
      this.scriptEditorPersonAttributeVisibleIndices =
        this.scriptEditorPersonAttributeVisibleIndices
          .filter((visibleIndex) => visibleIndex !== index)
          .map((visibleIndex) =>
            visibleIndex > index ? visibleIndex - 1 : visibleIndex
          )
          .filter(
            (visibleIndex) =>
              visibleIndex >= 0 && visibleIndex < nextAttributeCount
          );
    }

    this.replaceSelectedScriptEditorPerson(
      nextPerson
    );
  }

  applyScriptEditorPersonAttributeField(index, field, value) {
    const person = this.getSelectedScriptEditorPerson();
    if (person == null) {
      return;
    }

    this.replaceSelectedScriptEditorPerson(
      updateScriptEditorPersonAttribute(person, index, field, value)
    );
  }

  addScriptEditorPersonRelation(family) {
    const person = this.getSelectedScriptEditorPerson();
    if (person == null) {
      return;
    }

    this.replaceSelectedScriptEditorPerson(
      appendScriptEditorPersonRelation(person, family)
    );
  }

  removeScriptEditorPersonRelation(family, index) {
    const person = this.getSelectedScriptEditorPerson();
    if (person == null) {
      return;
    }

    this.replaceSelectedScriptEditorPerson(
      removeScriptEditorPersonRelation(person, family, index)
    );
  }

  applyScriptEditorPersonRelationField(index, family, value) {
    const person = this.getSelectedScriptEditorPerson();
    if (person == null) {
      return;
    }

    this.replaceSelectedScriptEditorPerson(
      updateScriptEditorPersonRelation(person, family, index, value)
    );
  }

  applyScriptEditorStoryField(field, value) {
    const storyNode = this.getSelectedScriptEditorStoryNode();
    if (storyNode == null) {
      return;
    }

    this.replaceSelectedScriptEditorStoryNode(updateScriptEditorStoryNodeField(storyNode, field, value));
  }

  addScriptEditorStoryRelation(field) {
    const storyNode = this.getSelectedScriptEditorStoryNode();
    if (storyNode == null) {
      return;
    }

    this.replaceSelectedScriptEditorStoryNode(
      appendScriptEditorStoryNodeRelation(storyNode, field)
    );
  }

  removeScriptEditorStoryRelation(field, index) {
    const storyNode = this.getSelectedScriptEditorStoryNode();
    if (storyNode == null) {
      return;
    }

    this.replaceSelectedScriptEditorStoryNode(
      removeScriptEditorStoryNodeRelation(storyNode, field, index)
    );
  }

  applyScriptEditorStoryRelationField(relationKind, index, value) {
    const field = this.resolveScriptEditorStoryRelationField(relationKind);
    if (field == null) {
      return;
    }

    const storyNode = this.getSelectedScriptEditorStoryNode();
    if (storyNode == null) {
      return;
    }

    this.replaceSelectedScriptEditorStoryNode(
      updateScriptEditorStoryNodeRelation(storyNode, field, index, value)
    );
  }

  applyScriptEditorDialogueField(field, value) {
    const dialogue = this.getSelectedScriptEditorDialogue();
    if (dialogue == null) {
      return;
    }

    this.replaceSelectedScriptEditorDialogue(updateScriptEditorDialogueField(dialogue, field, value));
  }

  addScriptEditorDialogueParticipant() {
    const dialogue = this.getSelectedScriptEditorDialogue();
    if (dialogue == null) {
      return;
    }

    this.replaceSelectedScriptEditorDialogue(appendScriptEditorDialogueParticipant(dialogue));
  }

  removeScriptEditorDialogueParticipant(index) {
    const dialogue = this.getSelectedScriptEditorDialogue();
    if (dialogue == null) {
      return;
    }

    this.replaceSelectedScriptEditorDialogue(removeScriptEditorDialogueParticipant(dialogue, index));
  }

  applyScriptEditorDialogueParticipantField(index, value) {
    const dialogue = this.getSelectedScriptEditorDialogue();
    if (dialogue == null) {
      return;
    }

    this.replaceSelectedScriptEditorDialogue(
      updateScriptEditorDialogueParticipant(dialogue, index, value)
    );
  }

  addScriptEditorDialogueNode() {
    const dialogue = this.getSelectedScriptEditorDialogue();
    if (dialogue == null) {
      return;
    }

    this.replaceSelectedScriptEditorDialogue(appendScriptEditorDialogueNode(dialogue));
  }

  removeScriptEditorDialogueNode(index) {
    const dialogue = this.getSelectedScriptEditorDialogue();
    if (dialogue == null) {
      return;
    }

    this.replaceSelectedScriptEditorDialogue(removeScriptEditorDialogueNode(dialogue, index));
  }

  applyScriptEditorDialogueNodeField(index, field, value) {
    const dialogue = this.getSelectedScriptEditorDialogue();
    if (dialogue == null) {
      return;
    }

    this.replaceSelectedScriptEditorDialogue(
      updateScriptEditorDialogueNodeField(dialogue, index, field, value)
    );
  }

  addScriptEditorDialogueFollowUp() {
    const dialogue = this.getSelectedScriptEditorDialogue();
    if (dialogue == null) {
      return;
    }

    this.replaceSelectedScriptEditorDialogue(appendScriptEditorDialogueFollowUp(dialogue));
  }

  removeScriptEditorDialogueFollowUp(index) {
    const dialogue = this.getSelectedScriptEditorDialogue();
    if (dialogue == null) {
      return;
    }

    this.replaceSelectedScriptEditorDialogue(removeScriptEditorDialogueFollowUp(dialogue, index));
  }

  applyScriptEditorDialogueFollowUpField(index, field, value) {
    const dialogue = this.getSelectedScriptEditorDialogue();
    if (dialogue == null) {
      return;
    }

    this.replaceSelectedScriptEditorDialogue(
      updateScriptEditorDialogueFollowUpField(dialogue, index, field, value)
    );
  }

  applyScriptEditorEventField(field, value) {
    const eventRecord = this.getSelectedScriptEditorEvent();
    if (eventRecord == null) {
      return;
    }

    this.replaceSelectedScriptEditorEvent(updateScriptEditorEventField(eventRecord, field, value));
  }

  applyScriptEditorEventRepeatable(checked) {
    const eventRecord = this.getSelectedScriptEditorEvent();
    if (eventRecord == null) {
      return;
    }

    this.replaceSelectedScriptEditorEvent(toggleScriptEditorEventRepeatable(eventRecord, checked));
  }

  addScriptEditorEventBinding(defaults = {}) {
    if (this.scriptEditorProject == null) {
      return;
    }

    const selectedEventId =
      this.scriptEditorSelection.family === "events"
        ? this.scriptEditorSelection.entityId ?? ""
        : "";
    const defaultTrigger =
      defaults.ownerFamily == null
        ? null
        : this.getScriptEditorEventBindingTriggerOptions(defaults.ownerFamily)[0] ?? null;
    const draft = {
      ...createDefaultScriptEditorEventBindingRecord(
        this.scriptEditorProject.eventBindings.length
      ),
      eventId: selectedEventId,
      ...(defaultTrigger == null
        ? {}
        : {
            trigger: {
              timing: defaultTrigger.timing,
              action: defaultTrigger.action,
            },
          }),
      ...(defaults.ownerFamily != null || defaults.ownerId != null
        ? {
            owner: {
              family: defaults.ownerFamily ?? "unknown",
              id: defaults.ownerId ?? "",
            },
          }
        : {}),
    };

    this.commitScriptEditorProject({
      ...this.scriptEditorProject,
      eventBindings: [...this.scriptEditorProject.eventBindings, draft],
    });
    this.scriptEditorNotice = null;
    this.render();
  }

  removeScriptEditorEventBinding(bindingId) {
    if (this.scriptEditorProject == null) {
      return;
    }

    this.commitScriptEditorProject({
      ...this.scriptEditorProject,
      eventBindings: this.scriptEditorProject.eventBindings.filter(
        (binding) => binding.id !== bindingId
      ),
    });
    this.scriptEditorNotice = null;
    this.render();
  }

  replaceScriptEditorEventBinding(bindingId, updateBinding) {
    if (this.scriptEditorProject == null) {
      return;
    }

    this.commitScriptEditorProject({
      ...this.scriptEditorProject,
      eventBindings: this.scriptEditorProject.eventBindings.map((binding) =>
        binding.id === bindingId
          ? normalizeScriptEditorEventBindingRecord(updateBinding(binding))
          : binding
      ),
    });
    this.scriptEditorNotice = null;
    this.render();
  }

  applyScriptEditorEventBindingField(bindingId, field, value) {
    this.replaceScriptEditorEventBinding(bindingId, (binding) =>
      updateScriptEditorEventBindingField(binding, field, value)
    );
  }

  applyScriptEditorEventBindingOwnerField(bindingId, field, value) {
    this.replaceScriptEditorEventBinding(bindingId, (binding) =>
      updateScriptEditorEventBindingOwnerField(binding, field, value)
    );
  }

  applyScriptEditorEventBindingTriggerField(bindingId, field, value) {
    if (field === "timing" && typeof value === "string" && value.includes(":")) {
      const [timing, action] = value.split(":");
      this.replaceScriptEditorEventBinding(bindingId, (binding) =>
        updateScriptEditorEventBindingTriggerField(
          updateScriptEditorEventBindingTriggerField(binding, "timing", timing),
          "action",
          action
        )
      );
      return;
    }

    this.replaceScriptEditorEventBinding(bindingId, (binding) =>
      updateScriptEditorEventBindingTriggerField(binding, field, value)
    );
  }

  applyScriptEditorEventBindingConditionOperator(bindingId, value) {
    this.replaceScriptEditorEventBinding(bindingId, (binding) =>
      updateScriptEditorEventBindingConditionOperator(binding, value)
    );
  }

  addScriptEditorEventBindingConditionItem(bindingId) {
    this.replaceScriptEditorEventBinding(bindingId, (binding) =>
      appendScriptEditorEventBindingConditionItem(binding)
    );
  }

  removeScriptEditorEventBindingConditionItem(bindingId, index) {
    this.replaceScriptEditorEventBinding(bindingId, (binding) =>
      removeScriptEditorEventBindingConditionItem(binding, index)
    );
  }

  applyScriptEditorEventBindingConditionItemField(bindingId, index, field, value) {
    this.replaceScriptEditorEventBinding(bindingId, (binding) =>
      updateScriptEditorEventBindingConditionItemField(binding, index, field, value)
    );
  }

  applyScriptEditorEventDestinationField(field, value) {
    const eventRecord = this.getSelectedScriptEditorEvent();
    if (eventRecord == null) {
      return;
    }

    this.replaceSelectedScriptEditorEvent(
      updateScriptEditorEventDestinationField(eventRecord, field, value)
    );
  }

  applyScriptEditorEventStoryNodeId(value) {
    const eventRecord = this.getSelectedScriptEditorEvent();
    if (eventRecord == null) {
      return;
    }

    this.replaceSelectedScriptEditorEvent(
      updateScriptEditorEventRelationField(eventRecord, "storyNodeId", value)
    );
  }

  addScriptEditorEventRelation(field) {
    const eventRecord = this.getSelectedScriptEditorEvent();
    if (eventRecord == null) {
      return;
    }

    this.replaceSelectedScriptEditorEvent(
      appendScriptEditorEventRelationEntry(eventRecord, field)
    );
  }

  removeScriptEditorEventRelation(field, index) {
    const eventRecord = this.getSelectedScriptEditorEvent();
    if (eventRecord == null) {
      return;
    }

    this.replaceSelectedScriptEditorEvent(
      removeScriptEditorEventRelationEntry(eventRecord, field, index)
    );
  }

  applyScriptEditorEventRelationField(relationKind, index, value) {
    const field = this.resolveScriptEditorEventRelationField(relationKind);
    if (field == null) {
      return;
    }

    const eventRecord = this.getSelectedScriptEditorEvent();
    if (eventRecord == null) {
      return;
    }

    this.replaceSelectedScriptEditorEvent(
      updateScriptEditorEventRelationField(eventRecord, field, index, value)
    );
  }

  applyScriptEditorEventPreviewField(field, value) {
    const eventRecord = this.getSelectedScriptEditorEvent();
    if (eventRecord == null) {
      return;
    }

    this.replaceSelectedScriptEditorEvent(
      updateScriptEditorEventPreviewSummaryField(eventRecord, field, value)
    );
  }

  applyScriptEditorMinigameField(field, value) {
    const minigame = this.getSelectedScriptEditorMinigame();
    if (minigame == null) {
      return;
    }

    this.replaceSelectedScriptEditorMinigame(
      updateScriptEditorMinigameField(minigame, field, value)
    );
  }

  applyScriptEditorMinigameIntegration(value) {
    const minigame = this.getSelectedScriptEditorMinigame();
    if (minigame == null) {
      return;
    }

    this.replaceSelectedScriptEditorMinigame(
      updateScriptEditorMinigameIntegration(minigame, value)
    );
  }

  addScriptEditorMinigameLaunchPayloadEntry() {
    const minigame = this.getSelectedScriptEditorMinigame();
    if (minigame == null) {
      return;
    }

    this.replaceSelectedScriptEditorMinigame(
      appendScriptEditorMinigameLaunchPayloadEntry(minigame)
    );
  }

  removeScriptEditorMinigameLaunchPayloadEntry(index) {
    const minigame = this.getSelectedScriptEditorMinigame();
    if (minigame == null) {
      return;
    }

    this.replaceSelectedScriptEditorMinigame(
      removeScriptEditorMinigameLaunchPayloadEntry(minigame, index)
    );
  }

  applyScriptEditorMinigameLaunchField(index, field, value) {
    const minigame = this.getSelectedScriptEditorMinigame();
    if (minigame == null) {
      return;
    }

    this.replaceSelectedScriptEditorMinigame(
      updateScriptEditorMinigameLaunchPayloadField(minigame, index, field, value)
    );
  }

  addScriptEditorMinigameOutcomeRoute() {
    const minigame = this.getSelectedScriptEditorMinigame();
    if (minigame == null) {
      return;
    }

    this.replaceSelectedScriptEditorMinigame(
      appendScriptEditorMinigameOutcomeRoute(minigame)
    );
  }

  removeScriptEditorMinigameOutcomeRoute(index) {
    const minigame = this.getSelectedScriptEditorMinigame();
    if (minigame == null) {
      return;
    }

    this.replaceSelectedScriptEditorMinigame(
      removeScriptEditorMinigameOutcomeRoute(minigame, index)
    );
  }

  applyScriptEditorMinigameOutcomeField(index, field, value) {
    const minigame = this.getSelectedScriptEditorMinigame();
    if (minigame == null) {
      return;
    }

    this.replaceSelectedScriptEditorMinigame(
      updateScriptEditorMinigameOutcomeRouteField(minigame, index, field, value)
    );
  }

  applyScriptEditorLocationField(field, value) {
    const location = this.getSelectedScriptEditorLocation();
    if (location == null) {
      return;
    }

    if (this.scriptEditorSelection.family === "cities") {
      this.replaceSelectedScriptEditorLocation(
        updateScriptEditorCityField(location, field === "cityId" ? "name" : field, value)
      );
      return;
    }

    if (
      field === "id" ||
      field === "cityId" ||
      field === "name" ||
      field === "description"
    ) {
      this.replaceSelectedScriptEditorLocation(
        updateScriptEditorBuildingField(location, field, value)
      );
    }
  }

  applyScriptEditorLocationMenuField(index, field, value) {
    const location = this.getSelectedScriptEditorLocation();
    if (location == null) {
      return;
    }

    this.replaceSelectedScriptEditorLocation(
      updateScriptEditorMenuEntryField(location, index, field, value)
    );
  }

  applyScriptEditorLocationMenuFlag(index, field, checked) {
    const location = this.getSelectedScriptEditorLocation();
    if (location == null) {
      return;
    }

    this.replaceSelectedScriptEditorLocation(
      toggleScriptEditorMenuEntryFlag(location, index, field, checked)
    );
  }

  addScriptEditorLocationAttribute() {
    const location = this.getSelectedScriptEditorLocation();
    if (location == null) {
      return;
    }

    this.replaceSelectedScriptEditorLocation(
      appendScriptEditorLocationAttribute(location)
    );
  }

  removeScriptEditorLocationAttribute(index) {
    const location = this.getSelectedScriptEditorLocation();
    if (location == null) {
      return;
    }

    this.replaceSelectedScriptEditorLocation(
      removeScriptEditorLocationAttribute(location, index)
    );
  }

  applyScriptEditorLocationAttributeField(index, field, value) {
    const location = this.getSelectedScriptEditorLocation();
    if (location == null) {
      return;
    }

    this.replaceSelectedScriptEditorLocation(
      updateScriptEditorLocationAttribute(location, index, field, value)
    );
  }

  addScriptEditorCityMountedBuilding() {
    if (this.scriptEditorSelection.family !== "cities") {
      return;
    }

    const city = this.getSelectedScriptEditorLocation();
    if (city == null) {
      return;
    }

    this.replaceSelectedScriptEditorLocation(
      appendScriptEditorCityMountedBuilding(city)
    );
  }

  removeScriptEditorCityMountedBuilding(index) {
    if (this.scriptEditorSelection.family !== "cities") {
      return;
    }

    const city = this.getSelectedScriptEditorLocation();
    if (city == null) {
      return;
    }

    this.replaceSelectedScriptEditorLocation(
      removeScriptEditorCityMountedBuilding(city, index)
    );
  }

  applyScriptEditorCityMountedBuilding(index, buildingId) {
    if (this.scriptEditorSelection.family !== "cities") {
      return;
    }

    const city = this.getSelectedScriptEditorLocation();
    if (city == null) {
      return;
    }

    this.replaceSelectedScriptEditorLocation(
      updateScriptEditorCityMountedBuilding(city, index, buildingId)
    );
  }

  addScriptEditorCityMountedBuildingNpc(buildingIndex) {
    if (this.scriptEditorSelection.family !== "cities") {
      return;
    }

    const city = this.getSelectedScriptEditorLocation();
    if (city == null) {
      return;
    }
    const nextNpcId = this.findNextScriptEditorCityMountedNpcId(city, buildingIndex);

    this.replaceSelectedScriptEditorLocation(
      appendScriptEditorCityMountedBuildingNpc(city, buildingIndex, nextNpcId)
    );
  }

  findNextScriptEditorCityMountedNpcId(city, buildingIndex) {
    const mountedBuilding = city.mountedBuildings?.[buildingIndex] ?? null;
    const selectedNpcIds = new Set(mountedBuilding?.npcIds ?? []);
    return (
      (this.scriptEditorProject?.people ?? [])
        .map((person) => normalizeScriptEditorPersonRecord(person))
        .find((person) => person.personType !== "角色" && !selectedNpcIds.has(person.id))
        ?.id ?? ""
    );
  }

  removeScriptEditorCityMountedBuildingNpc(buildingIndex, npcIndex) {
    if (this.scriptEditorSelection.family !== "cities") {
      return;
    }

    const city = this.getSelectedScriptEditorLocation();
    if (city == null) {
      return;
    }

    this.replaceSelectedScriptEditorLocation(
      removeScriptEditorCityMountedBuildingNpc(city, buildingIndex, npcIndex)
    );
  }

  applyScriptEditorCityMountedBuildingNpc(buildingIndex, npcIndex, npcId) {
    if (this.scriptEditorSelection.family !== "cities") {
      return;
    }

    const city = this.getSelectedScriptEditorLocation();
    if (city == null) {
      return;
    }

    this.replaceSelectedScriptEditorLocation(
      updateScriptEditorCityMountedBuildingNpc(city, buildingIndex, npcIndex, npcId)
    );
  }

  applyScriptEditorCityMountedBuildingPrimaryNpc(buildingIndex, npcId) {
    if (this.scriptEditorSelection.family !== "cities") {
      return;
    }

    const city = this.getSelectedScriptEditorLocation();
    if (city == null) {
      return;
    }

    this.replaceSelectedScriptEditorLocation(
      updateScriptEditorCityMountedBuildingPrimaryNpc(city, buildingIndex, npcId)
    );
  }

  applyScriptEditorLocationAccessField(field, value) {
    const location = this.getSelectedScriptEditorLocation();
    if (location == null) {
      return;
    }

    this.replaceSelectedScriptEditorLocation(
      updateScriptEditorAccessField(location, field, value)
    );
  }

  applyScriptEditorBuildingEntryField(field, value) {
    if (this.scriptEditorSelection.family !== "buildings") {
      return;
    }

    const building = this.getSelectedScriptEditorLocation();
    if (building == null) {
      return;
    }

    this.replaceSelectedScriptEditorLocation(
      updateScriptEditorBuildingEntryBindingField(building, field, value)
    );
  }

  addScriptEditorLocationMenuEntry() {
    const location = this.getSelectedScriptEditorLocation();
    if (location == null) {
      return;
    }

    this.replaceSelectedScriptEditorLocation(appendScriptEditorMenuEntry(location));
  }

  removeScriptEditorLocationMenuEntry(index) {
    const location = this.getSelectedScriptEditorLocation();
    if (location == null) {
      return;
    }

    this.replaceSelectedScriptEditorLocation(
      removeScriptEditorMenuEntry(location, index)
    );
  }

  runScriptEditorValidation() {
    if (this.scriptEditorProject == null) {
      return;
    }

    this.scriptEditorAuxiliaryPanelOpen = true;
    const diagnostics = validateScriptEditorProjectForRuntimeExport(
      this.scriptEditorProject
    );
    this.recordScriptEditorNotice(
      diagnostics.length === 0
        ? {
            tone: "success",
            message: "剧本包导出校验已通过。",
          }
        : {
            tone: "warning",
            message: diagnostics[0]?.message ?? "剧本包导出校验失败。",
          }
    );
    this.render();
  }

  async saveScriptEditorProject() {
    if (this.scriptEditorProject == null) {
      return;
    }

    try {
      const result = await writeTextFilesWithDirectoryPicker(
        serializeScriptEditorProjectToFiles(this.scriptEditorProject),
        {
          directoryHandle: this.scriptEditorProjectDirectoryHandle,
          suggestedName: this.scriptEditorProject.id,
          downloadPrefix: this.scriptEditorProject.id,
        }
      );
      this.scriptEditorProjectDirectoryHandle = result.directoryHandle ?? null;
      this.rememberScriptEditorProjectPackageLocation(result);
      this.recordScriptEditorNotice({
        tone: "success",
        message:
          result.mode === "directory"
            ? "已将剧本项目保存到所选目录。"
            : "已下载剧本项目文件。",
      });
    } catch (error) {
      this.recordScriptEditorNotice({
        tone: "warning",
        message:
          error instanceof Error ? error.message : "保存剧本项目失败。",
      });
    }

    this.render();
  }

  async createScriptEditorProjectAtSavePath() {
    const project = createDefaultScriptEditorProjectDefinition();
    const result = await writeTextFilesWithDirectoryPicker(
      serializeScriptEditorProjectToFiles(project),
      {
        directoryHandle: null,
        suggestedName: project.id,
        downloadPrefix: project.id,
      }
    );

    this.scriptEditorProjectSource = "new";
    this.commitScriptEditorProject(project);
    this.scriptEditorProjectDirectoryHandle = result.directoryHandle ?? null;
    this.rememberScriptEditorProjectPackageLocation(result);
  }

  async exportScriptEditorProject() {
    if (this.scriptEditorProject == null) {
      return;
    }

    this.scriptEditorAuxiliaryPanelOpen = true;
    try {
      const result = await writeTextFilesWithDirectoryPicker(
        exportScriptEditorProjectToScenarioPackFiles(this.scriptEditorProject),
        {
          directoryHandle: this.scriptEditorExportDirectoryHandle,
          suggestedName: this.scriptEditorProject.storyPack.id,
          downloadPrefix: this.scriptEditorProject.storyPack.id,
        }
      );
      this.scriptEditorExportDirectoryHandle = result.directoryHandle ?? null;
      const completedProject = markScriptEditorProjectCompleteForExport(this.scriptEditorProject);
      this.commitScriptEditorProject(completedProject);
      this.recordScriptEditorNotice({
        tone: "success",
        message:
          result.mode === "directory"
            ? "已导出运行时剧本包。"
            : "已下载运行时剧本包文件。",
      });
    } catch (error) {
      this.recordScriptEditorNotice({
        tone: "warning",
        message:
          error instanceof Error ? error.message : "导出运行时剧本包失败。",
      });
    }

    this.render();
  }

  captureScriptEditorRuntimePreviewReturnContext() {
    this.captureScriptEditorScrollPosition();
    return {
      screen: this.currentScreen,
      selection: { ...this.scriptEditorSelection },
      personTab: this.scriptEditorPersonTab,
      locationTab: this.scriptEditorLocationTab,
      narrativeTab: this.scriptEditorNarrativeTab,
      eventTab: this.scriptEditorEventTab,
      minigameTab: this.scriptEditorMinigameTab,
      scrollTop: this.scriptEditorScrollTop,
      personAttributeScrollLeft: this.scriptEditorPersonAttributeScrollLeft,
    };
  }

  restoreScriptEditorRuntimePreviewReturnContext(returnContext) {
    if (returnContext == null) {
      return;
    }

    this.scriptEditorSelection = { ...returnContext.selection };
    this.scriptEditorPersonTab = returnContext.personTab;
    this.scriptEditorLocationTab = returnContext.locationTab;
    this.scriptEditorNarrativeTab = returnContext.narrativeTab;
    this.scriptEditorEventTab = returnContext.eventTab;
    this.scriptEditorMinigameTab = returnContext.minigameTab;
    this.scriptEditorScrollTop = returnContext.scrollTop;
    this.scriptEditorPersonAttributeScrollLeft =
      returnContext.personAttributeScrollLeft;
    this.setScreen(returnContext.screen ?? "script-editor-workspace");
  }

  exitScriptEditorRuntimePreview() {
    const returnContext = this.scriptEditorRuntimePreviewSession?.returnContext ?? null;
    this.scriptEditorRuntimePreviewSession = null;
    this.restoreScriptEditorRuntimePreviewReturnContext(returnContext);
  }

  async previewScriptEditorProjectRuntime() {
    if (this.scriptEditorProject == null) {
      return;
    }

    const returnContext = this.captureScriptEditorRuntimePreviewReturnContext();
    try {
      const serializedPackFiles =
        exportScriptEditorProjectToScenarioPackFiles(this.scriptEditorProject);
      const scenarioPack = await loadScenarioPackFromFiles(
        createTextImportFilesFromRecord(serializedPackFiles)
      );
      this.scriptEditorRuntimePreviewSession = {
        returnContext,
        startedAt: Date.now(),
      };
      if (this.onStartLoadedScenarioPack == null) {
        throw new Error("Runtime preview startup is unavailable.");
      }
      const startResult = await this.onStartLoadedScenarioPack(scenarioPack);
      if (startResult === "started") {
        this.setScreen("runtime-preview");
        return;
      }
      if (startResult === "failed") {
        throw new Error("Runtime preview startup failed.");
      }
    } catch (error) {
      this.scriptEditorRuntimePreviewSession = null;
      this.restoreScriptEditorRuntimePreviewReturnContext(returnContext);
      this.recordScriptEditorNotice({
        tone: "warning",
        message:
          error instanceof Error ? error.message : "Failed to start runtime preview.",
      });
      this.setScreen("script-editor-workspace");
    }
  }

  async openScriptEditorProjectFromDirectory() {
    try {
      const directoryHandle = await pickScriptEditorDirectory({
        mode: "readwrite",
      });
      const files = await readFilesFromDirectoryHandle(directoryHandle);
      this.scriptEditorProjectSource = "opened";
      this.commitScriptEditorProject(await loadScriptEditorProjectFromFiles(files));
      this.resetScriptEditorRecordListPages();
      this.resetScriptEditorRecordSearch();
      this.scriptEditorSelection = {
        family: "storyPack",
        entityId: null,
      };
      this.scriptEditorAuxiliaryPanelOpen = false;
      this.scriptEditorProjectDirectoryHandle = directoryHandle;
      this.rememberScriptEditorProjectPackageLocation({
        mode: "directory",
        directoryHandle,
      });
      this.scriptEditorPendingDeleteProjectId = null;
      this.resetScriptEditorNoticeTimeline();
      this.recordScriptEditorNotice({
        tone: "success",
        message: "Script editor project draft opened.",
      });
      this.setScreen("script-editor-workspace");
    } catch (error) {
      this.recordScriptEditorNotice({
        tone: "warning",
        message:
          error instanceof Error ? error.message : "Failed to open script editor project.",
      });
      this.render();
    }
  }

  async handleScriptEditorProjectFileImport(files) {
    try {
      this.scriptEditorProjectSource = "opened";
      this.commitScriptEditorProject(await loadScriptEditorProjectFromFiles(files));
      this.resetScriptEditorRecordListPages();
      this.resetScriptEditorRecordSearch();
      this.scriptEditorSelection = {
        family: "storyPack",
        entityId: null,
      };
      this.scriptEditorAuxiliaryPanelOpen = false;
      this.scriptEditorProjectDirectoryHandle = null;
      this.scriptEditorPendingDeleteProjectId = null;
      this.resetScriptEditorNoticeTimeline();
      this.recordScriptEditorNotice({
        tone: "success",
        message: "已打开剧本项目。",
      });
      this.setScreen("script-editor-workspace");
    } catch (error) {
      this.recordScriptEditorNotice({
        tone: "warning",
        message:
          error instanceof Error ? error.message : "打开剧本项目失败。",
      });
      this.render();
    }
  }

  async handleScriptEditorTemplateImport() {
    try {
      this.scriptEditorProjectSource = "imported";
      this.commitScriptEditorProject(
        await loadScriptEditorProjectFromScenarioPackUrl(
          DEFAULT_SCRIPT_EDITOR_TEMPLATE_SCENARIO_PACK_URL
        )
      );
      this.resetScriptEditorRecordListPages();
      this.resetScriptEditorRecordSearch();
      this.scriptEditorSelection = {
        family: "storyPack",
        entityId: null,
      };
      this.scriptEditorAuxiliaryPanelOpen = false;
      this.scriptEditorExportDirectoryHandle = null;
      this.scriptEditorPendingDeleteProjectId = null;
      this.resetScriptEditorNoticeTimeline();
      this.setScreen("script-editor-workspace");
    } catch (error) {
      this.recordScriptEditorNotice({
        tone: "warning",
        message:
          error instanceof Error ? error.message : "导入运行时剧本包失败。",
      });
      this.render();
    }
  }

  getScriptEditorFamilyLabel(family) {
    switch (family) {
      case "storyPack":
        return "项目";
      case "people":
        return "人物";
      case "cities":
        return "城市";
      case "buildings":
        return "建筑";
      case "dialogues":
        return "对话";
      case "textEntries":
        return "文本";
      case "storyNodes":
        return "剧情节点";
      case "events":
        return "事件";
      case "minigames":
        return "玩法";
      default:
        return family;
    }
  }

  getScriptEditorRecordLabel(record) {
    if (typeof record.name === "string" && record.name.length > 0) {
      return record.name;
    }
    if (typeof record.title === "string" && record.title.length > 0) {
      return record.title;
    }
    if (typeof record.text === "string" && record.text.length > 0) {
      return record.text.slice(0, 40);
    }
    return record.id;
  }

  getSelectedScriptEditorPerson() {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family !== "people" ||
      this.scriptEditorSelection.entityId == null
    ) {
      return null;
    }

    const selectedPerson = this.scriptEditorProject.people.find(
      (person) => person.id === this.scriptEditorSelection.entityId
    );
    if (selectedPerson == null) {
      return null;
    }

    return normalizeScriptEditorPersonRecord(selectedPerson);
  }

  replaceSelectedScriptEditorPerson(nextPerson) {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family !== "people" ||
      this.scriptEditorSelection.entityId == null
    ) {
      return;
    }

    this.commitScriptEditorProject({
      ...this.scriptEditorProject,
      people: this.scriptEditorProject.people.map((person) =>
        person.id === this.scriptEditorSelection.entityId ? nextPerson : person
      ),
    });
    this.scriptEditorNotice = null;
    this.render();
  }

  getSelectedScriptEditorLocation() {
    if (
      this.scriptEditorProject == null ||
      (this.scriptEditorSelection.family !== "cities" &&
        this.scriptEditorSelection.family !== "buildings") ||
      this.scriptEditorSelection.entityId == null
    ) {
      return null;
    }

    if (this.scriptEditorSelection.family === "cities") {
      const selectedCity = this.scriptEditorProject.cities.find(
        (city) => city.id === this.scriptEditorSelection.entityId
      );
      return selectedCity == null ? null : normalizeScriptEditorCityRecord(selectedCity);
    }

    const selectedBuilding = this.scriptEditorProject.buildings.find(
      (building) => building.id === this.scriptEditorSelection.entityId
    );
    return selectedBuilding == null
      ? null
      : normalizeScriptEditorBuildingRecord(selectedBuilding);
  }

  replaceSelectedScriptEditorLocation(nextLocation) {
    if (
      this.scriptEditorProject == null ||
      (this.scriptEditorSelection.family !== "cities" &&
        this.scriptEditorSelection.family !== "buildings") ||
      this.scriptEditorSelection.entityId == null
    ) {
      return;
    }

    if (this.scriptEditorSelection.family === "cities") {
      this.commitScriptEditorProject({
        ...this.scriptEditorProject,
        cities: this.scriptEditorProject.cities.map((city) =>
          city.id === this.scriptEditorSelection.entityId ? nextLocation : city
        ),
      });
    } else {
      this.commitScriptEditorProject({
        ...this.scriptEditorProject,
        buildings: this.scriptEditorProject.buildings.map((building) =>
          building.id === this.scriptEditorSelection.entityId ? nextLocation : building
        ),
      });
    }
    this.scriptEditorNotice = null;
    this.render();
  }

  getSelectedScriptEditorStoryNode() {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family !== "storyNodes" ||
      this.scriptEditorSelection.entityId == null
    ) {
      return null;
    }

    const selectedStoryNode = this.scriptEditorProject.storyNodes.find(
      (storyNode) => storyNode.id === this.scriptEditorSelection.entityId
    );
    return selectedStoryNode == null
      ? null
      : normalizeScriptEditorStoryNodeRecord(selectedStoryNode);
  }

  replaceSelectedScriptEditorStoryNode(nextStoryNode) {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family !== "storyNodes" ||
      this.scriptEditorSelection.entityId == null
    ) {
      return;
    }

    this.commitScriptEditorProject({
      ...this.scriptEditorProject,
      storyNodes: this.scriptEditorProject.storyNodes.map((storyNode) =>
        storyNode.id === this.scriptEditorSelection.entityId ? nextStoryNode : storyNode
      ),
    });
    this.scriptEditorNotice = null;
    this.render();
  }

  getSelectedScriptEditorDialogue() {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family !== "dialogues" ||
      this.scriptEditorSelection.entityId == null
    ) {
      return null;
    }

    const selectedDialogue = this.scriptEditorProject.dialogues.find(
      (dialogue) => dialogue.id === this.scriptEditorSelection.entityId
    );
    return selectedDialogue == null ? null : normalizeScriptEditorDialogueRecord(selectedDialogue);
  }

  replaceSelectedScriptEditorDialogue(nextDialogue) {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family !== "dialogues" ||
      this.scriptEditorSelection.entityId == null
    ) {
      return;
    }

    this.commitScriptEditorProject({
      ...this.scriptEditorProject,
      dialogues: this.scriptEditorProject.dialogues.map((dialogue) =>
        dialogue.id === this.scriptEditorSelection.entityId ? nextDialogue : dialogue
      ),
    });
    this.scriptEditorNotice = null;
    this.render();
  }

  getSelectedScriptEditorEvent() {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family !== "events" ||
      this.scriptEditorSelection.entityId == null
    ) {
      return null;
    }

    const selectedEvent = this.scriptEditorProject.events.find(
      (eventRecord) => eventRecord.id === this.scriptEditorSelection.entityId
    );
    return selectedEvent == null ? null : normalizeScriptEditorEventRecord(selectedEvent);
  }

  replaceSelectedScriptEditorEvent(nextEvent) {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family !== "events" ||
      this.scriptEditorSelection.entityId == null
    ) {
      return;
    }

    this.commitScriptEditorProject({
      ...this.scriptEditorProject,
      events: this.scriptEditorProject.events.map((eventRecord) =>
        eventRecord.id === this.scriptEditorSelection.entityId ? nextEvent : eventRecord
      ),
    });
    this.scriptEditorNotice = null;
    this.render();
  }

  getSelectedScriptEditorMinigame() {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family !== "minigames" ||
      this.scriptEditorSelection.entityId == null
    ) {
      return null;
    }

    const selectedMinigame = this.scriptEditorProject.minigames.find(
      (minigame) => minigame.id === this.scriptEditorSelection.entityId
    );
    return selectedMinigame == null
      ? null
      : normalizeScriptEditorMinigameRecord(selectedMinigame);
  }

  replaceSelectedScriptEditorMinigame(nextMinigame) {
    if (
      this.scriptEditorProject == null ||
      this.scriptEditorSelection.family !== "minigames" ||
      this.scriptEditorSelection.entityId == null
    ) {
      return;
    }

    this.commitScriptEditorProject({
      ...this.scriptEditorProject,
      minigames: this.scriptEditorProject.minigames.map((minigame) =>
        minigame.id === this.scriptEditorSelection.entityId ? nextMinigame : minigame
      ),
    });
    this.scriptEditorNotice = null;
    this.render();
  }

  resolveScriptEditorStoryRelationField(relationKind) {
    switch (relationKind) {
      case "story-related-people":
        return "relatedPersonIds";
      case "story-related-dialogues":
        return "relatedDialogueIds";
      case "story-related-events":
        return "relatedEventIds";
      default:
        return null;
    }
  }

  resolveScriptEditorEventRelationField(relationKind) {
    switch (relationKind) {
      case "event-related-people":
        return "personIds";
      case "event-related-cities":
        return "cityIds";
      case "event-related-buildings":
        return "buildingIds";
      default:
        return null;
    }
  }

  getScriptEditorProjectLibraryEntries() {
    return this.scriptEditorProjectLibrary;
  }

  getScriptEditorProjectSourceLabel(source) {
    switch (source) {
      case "opened":
        return "本地打开";
      case "imported":
        return "运行时导入";
      case "new":
      default:
        return "新建项目";
    }
  }

  commitScriptEditorProject(project) {
    this.scriptEditorProject = project;
    this.scriptEditorProjectLibrary = upsertScriptEditorProjectLibraryEntry(
      this.scriptEditorProjectLibrary,
      createScriptEditorProjectLibraryEntry(project, this.scriptEditorProjectSource)
    );
  }

  rememberScriptEditorProjectPackageLocation(result) {
    if (this.scriptEditorProject == null) {
      return;
    }

    const existingEntry = findScriptEditorProjectLibraryEntry(
      this.scriptEditorProjectLibrary,
      this.scriptEditorProject.id
    );
    const entry =
      existingEntry ??
      createScriptEditorProjectLibraryEntry(
        this.scriptEditorProject,
        this.scriptEditorProjectSource
      );
    const directoryName =
      typeof result.directoryHandle?.name === "string"
        ? result.directoryHandle.name
        : "";
    const displayPath =
      directoryName.trim() !== "" ? directoryName : this.scriptEditorProject.id;

    this.scriptEditorProjectLibrary = upsertScriptEditorProjectLibraryEntry(
      this.scriptEditorProjectLibrary,
      {
        ...entry,
        project: this.scriptEditorProject,
        title: this.scriptEditorProject.title,
        description: this.scriptEditorProject.description ?? "",
        source: this.scriptEditorProjectSource,
        packageLocation: {
          locationKind: result.mode === "directory" ? "directory" : "download",
          displayPath,
          durable: result.mode === "directory",
        },
        validity: {
          state: "valid",
        },
      }
    );
  }

  continueScriptEditorProject(projectId) {
    const projectEntry = findScriptEditorProjectLibraryEntry(
      this.scriptEditorProjectLibrary,
      projectId
    );
    if (projectEntry == null) {
      return;
    }

    if (!canContinueScriptEditorProjectEntry(projectEntry)) {
      this.recordScriptEditorNotice({
        tone: "warning",
        message: projectEntry.validity.reason,
      });
      this.render();
      return;
    }

    const isCurrentProject = this.scriptEditorProject?.id === projectId;
    this.scriptEditorProjectSource = projectEntry.source;
    this.scriptEditorProject = projectEntry.project;
    this.scriptEditorProjectLibrary = upsertScriptEditorProjectLibraryEntry(
      this.scriptEditorProjectLibrary,
      projectEntry
    );
    this.scriptEditorPendingDeleteProjectId = null;
    this.scriptEditorNotice = null;
    if (!isCurrentProject) {
      this.resetScriptEditorRecordListPages();
      this.resetScriptEditorRecordSearch();
      this.resetScriptEditorPersonAttributePage();
      this.resetScriptEditorNoticeTimeline();
      this.scriptEditorSelection = {
        family: "storyPack",
        entityId: null,
      };
    }
    this.scriptEditorAuxiliaryPanelOpen = false;
    this.setScreen("script-editor-workspace");
  }

  deleteScriptEditorProject(projectId) {
    const projectEntry = findScriptEditorProjectLibraryEntry(
      this.scriptEditorProjectLibrary,
      projectId
    );
    if (projectEntry == null) {
      return;
    }

    this.scriptEditorProjectLibrary = removeScriptEditorProjectLibraryEntry(
      this.scriptEditorProjectLibrary,
      projectId
    );
    if (this.scriptEditorProject?.id === projectId) {
      this.scriptEditorProject = null;
      this.resetScriptEditorRecordListPages();
      this.resetScriptEditorRecordSearch();
      this.scriptEditorSelection = {
        family: "storyPack",
        entityId: null,
      };
      this.scriptEditorAuxiliaryPanelOpen = false;
      this.scriptEditorProjectDirectoryHandle = null;
      this.scriptEditorExportDirectoryHandle = null;
    }
    this.scriptEditorPendingDeleteProjectId = null;
    this.recordScriptEditorNotice({
      tone: "success",
      message: `已将 ${projectEntry.title} 从当前项目列表移除。`,
    });
    this.render();
  }
}

async function writeTextFilesWithDirectoryPicker(
  files,
  options = {}
) {
  if (options.directoryHandle != null) {
    await writeTextFilesToDirectory(options.directoryHandle, files);
    return {
      mode: "directory",
      directoryHandle: options.directoryHandle,
    };
  }

  const directoryPicker = getScriptEditorDirectoryPicker();
  if (directoryPicker == null) {
    triggerFileDownloads(files, options.downloadPrefix);
    return {
      mode: "download",
      directoryHandle: null,
    };
  }

  const directoryHandle = await directoryPicker({
    id: "script-editor-workflow",
    mode: "readwrite",
  });
  await writeTextFilesToDirectory(directoryHandle, files);
  return {
    mode: "directory",
    directoryHandle,
  };
}

async function pickScriptEditorDirectory(options = {}) {
  const directoryPicker = getScriptEditorDirectoryPicker();
  if (directoryPicker == null) {
    throw new Error("This browser cannot open a writable project directory.");
  }

  return directoryPicker({
    id: "script-editor-workflow",
    mode: options.mode ?? "read",
  });
}

function getScriptEditorDirectoryPicker() {
  return typeof globalThis.showDirectoryPicker === "function"
    ? globalThis.showDirectoryPicker.bind(globalThis)
    : typeof globalThis.window?.showDirectoryPicker === "function"
      ? globalThis.window.showDirectoryPicker.bind(globalThis.window)
      : null;
}

async function writeTextFilesToDirectory(directoryHandle, files) {
  for (const [relativePath, content] of Object.entries(files)) {
    const pathSegments = relativePath.split("/").filter(Boolean);
    const fileName = pathSegments.pop();
    if (fileName == null) {
      continue;
    }

    let currentDirectoryHandle = directoryHandle;
    for (const segment of pathSegments) {
      currentDirectoryHandle = await currentDirectoryHandle.getDirectoryHandle(segment, {
        create: true,
      });
    }

    const fileHandle = await currentDirectoryHandle.getFileHandle(fileName, {
      create: true,
    });
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
  }
}

async function readFilesFromDirectoryHandle(directoryHandle) {
  const files = [];
  await collectFilesFromDirectoryHandle(directoryHandle, "", files);
  return files;
}

async function collectFilesFromDirectoryHandle(directoryHandle, basePath, files) {
  for await (const [name, handle] of directoryHandle.entries()) {
    const relativePath = basePath.length === 0 ? name : `${basePath}/${name}`;
    if (handle.kind === "directory") {
      await collectFilesFromDirectoryHandle(handle, relativePath, files);
      continue;
    }
    if (handle.kind !== "file") {
      continue;
    }

    const file = await handle.getFile();
    files.push(createDirectoryImportFile(file, relativePath));
  }
}

function createDirectoryImportFile(file, relativePath) {
  const importedFile = new File([file], file.name, {
    type: file.type,
    lastModified: file.lastModified,
  });
  Object.defineProperty(importedFile, "webkitRelativePath", {
    value: relativePath,
  });
  return importedFile;
}

function createTextImportFilesFromRecord(files) {
  return Object.entries(files).map(([relativePath, content]) => {
    const fileName = relativePath.split("/").filter(Boolean).pop() ?? relativePath;
    const file = new File([content], fileName, {
      type: "application/json",
    });
    Object.defineProperty(file, "webkitRelativePath", {
      value: relativePath,
    });
    return file;
  });
}

function triggerFileDownloads(files, downloadPrefix = "script-editor") {
  for (const [relativePath, content] of Object.entries(files)) {
    const downloadName = `${downloadPrefix}-${relativePath.replaceAll("/", "__")}`;
    const link = globalThis.document?.createElement("a");
    if (link == null) {
      continue;
    }
    const url = globalThis.URL.createObjectURL(
      new Blob([content], { type: "application/json" })
    );
    link.href = url;
    link.download = downloadName;
    globalThis.document.body.append(link);
    link.click();
    link.remove();
    globalThis.setTimeout(() => {
      globalThis.URL.revokeObjectURL(url);
    }, 0);
  }
}

const INK_PARTICLE_COLORS = [
  [138, 31, 22],
  [168, 50, 36],
  [182, 71, 47],
  [150, 35, 25],
];
const INK_CONTOUR_ALPHA_THRESHOLD = 28;
const INK_CONTOUR_SAMPLE_MAX_SIZE = 128;
const INK_CONTOUR_MIN_POINTS = 12;
const INK_IMAGE_TARGET_SELECTORS = [
  ".c-main-ui-character-card__avatar-image",
].join(", ");

class InkParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.particles = [];
    this.debugRects = [];
    this.loops = new Map();
    this.animationFrameId = 0;
    this.lastTimestamp = 0;
    this.width = 0;
    this.height = 0;
    this.shapeCache = new Map();
    this.maskCanvas =
      typeof globalThis.OffscreenCanvas === "function"
        ? new globalThis.OffscreenCanvas(1, 1)
        : globalThis.document.createElement("canvas");
    this.maskContext = this.maskCanvas.getContext("2d", { willReadFrequently: true });
    this.isReducedMotion =
      typeof globalThis.matchMedia === "function" &&
      globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.resizeObserver =
      typeof globalThis.ResizeObserver === "undefined"
        ? null
        : new globalThis.ResizeObserver(() => {
            this.resize();
          });
    this.handleVisibilityChange = () => {
      if (globalThis.document.hidden) {
        this.clear();
      }
    };

    this.resize();
    this.resizeObserver?.observe(canvas);
    globalThis.addEventListener("resize", this.resize);
    globalThis.document.addEventListener("visibilitychange", this.handleVisibilityChange);
  }

  resize = () => {
    if (this.context == null) {
      return;
    }

    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.max(1, globalThis.devicePixelRatio || 1);
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    this.width = width;
    this.height = height;
    this.canvas.width = Math.round(width * dpr);
    this.canvas.height = Math.round(height * dpr);
    this.context.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.context.clearRect(0, 0, width, height);
  };

  playBurstForElement(element, options = {}) {
    if (this.isReducedMotion || this.context == null) {
      return;
    }

    this.spawnForElement(element, options.count ?? randomInt(28, 45), options);
    this.ensureRunning();
  }

  prepareElementShape(element) {
    const source = getElementInkImageSource(element);
    if (source != null) {
      this.loadShapeCacheEntry(source.url);
    }
  }

  startLoopForElement(id, element, options = {}) {
    if (this.isReducedMotion || this.context == null) {
      return;
    }

    this.loops.set(id, {
      element,
      countMin: options.countMin ?? 3,
      countMax: options.countMax ?? 7,
      intervalMin: options.intervalMin ?? 140,
      intervalMax: options.intervalMax ?? 260,
      distanceMin: options.distanceMin ?? 4,
      distanceMax: options.distanceMax ?? 16,
      edgeBias: options.edgeBias ?? "selected",
      nextAt: 0,
    });
    this.ensureRunning();
  }

  stopLoop(id) {
    this.loops.delete(id);
    this.stopIfIdle();
  }

  update(timestamp = globalThis.performance.now()) {
    const deltaMs =
      this.lastTimestamp === 0 ? 16 : Math.min(48, timestamp - this.lastTimestamp);
    this.lastTimestamp = timestamp;

    for (const loop of this.loops.values()) {
      if (timestamp >= loop.nextAt) {
        this.spawnForElement(loop.element, randomInt(loop.countMin, loop.countMax), {
          distanceMin: loop.distanceMin,
          distanceMax: loop.distanceMax,
          edgeBias: loop.edgeBias,
        });
        loop.nextAt = timestamp + randomRange(loop.intervalMin, loop.intervalMax);
      }
    }

    this.particles = this.particles.filter((particle) => {
      particle.age += deltaMs;
      if (particle.age >= particle.life) {
        return false;
      }

      particle.drift += particle.driftSpeed * (deltaMs / 1000);
      return true;
    });

    this.debugRects = this.debugRects.filter((debugRect) => {
      debugRect.age += deltaMs;
      return debugRect.age < debugRect.life;
    });
  }

  render() {
    if (this.context == null) {
      return;
    }

    this.context.clearRect(0, 0, this.width, this.height);
    for (const particle of this.particles) {
      const progress = clamp01(particle.age / particle.life);
      const alpha = particle.alpha * (1 - progress);
      const radius = particle.size * (1 - progress * 0.28);
      const ease = 1 - (1 - progress) ** 3;
      const wobble = Math.sin(particle.drift) * particle.wobble * progress;
      const x = particle.x + particle.dx * ease + wobble;
      const y = particle.y + particle.dy * ease - wobble * 0.5;

      this.context.save();
      this.context.globalAlpha = alpha;
      this.context.fillStyle = `rgb(${particle.color[0]} ${particle.color[1]} ${particle.color[2]})`;
      this.context.translate(x, y);
      this.context.rotate(particle.rotation + particle.drift);
      this.drawInkDot(radius, particle.seed);
      this.context.restore();
    }

    for (const debugRect of this.debugRects) {
      const progress = clamp01(debugRect.age / debugRect.life);
      this.context.save();
      this.context.globalAlpha = 1 - progress;
      this.context.strokeStyle = "rgb(210 50 32)";
      this.context.lineWidth = 2;
      this.context.setLineDash([8, 6]);
      this.context.strokeRect(debugRect.x, debugRect.y, debugRect.width, debugRect.height);
      this.context.restore();
    }
  }

  drawInkDot(radius, seed) {
    if (this.context == null) {
      return;
    }

    this.context.beginPath();
    this.context.arc(0, 0, radius, 0, Math.PI * 2);
    this.context.fill();

    const offsetA = radius * (0.42 + seed * 0.2);
    const offsetB = radius * (0.28 + (1 - seed) * 0.18);
    this.context.beginPath();
    this.context.arc(offsetA, -offsetB, radius * 0.48, 0, Math.PI * 2);
    this.context.arc(-offsetB, offsetA * 0.7, radius * 0.34, 0, Math.PI * 2);
    this.context.fill();
  }

  spawnForElement(element, count, options = {}) {
    const canvasRect = this.canvas.getBoundingClientRect();
    const targetShape = this.resolveTargetShape(element);
    const targetRect = targetShape.rect;
    if (
      targetRect.width <= 0 ||
      targetRect.height <= 0 ||
      targetRect.right < canvasRect.left ||
      targetRect.left > canvasRect.right ||
      targetRect.bottom < canvasRect.top ||
      targetRect.top > canvasRect.bottom
    ) {
      return;
    }

    for (let index = 0; index < count; index += 1) {
      const particle = createInkParticle(targetShape, canvasRect, options);
      this.particles.push(particle);
    }
  }

  drawRectForElement(element) {
    const canvasRect = this.canvas.getBoundingClientRect();
    const targetShape = this.resolveTargetShape(element);
    const targetRect = targetShape.rect;
    const bleed = 4;
    this.debugRects.push({
      x: targetRect.left - canvasRect.left - bleed,
      y: targetRect.top - canvasRect.top - bleed,
      width: targetRect.width + bleed * 2,
      height: targetRect.height + bleed * 2,
      age: 0,
      life: 1200,
    });
    this.ensureRunning();
  }

  ensureRunning() {
    if (this.animationFrameId !== 0) {
      return;
    }

    this.lastTimestamp = 0;
    const tick = (timestamp) => {
      this.animationFrameId = 0;
      this.update(timestamp);
      this.render();

      if (this.particles.length > 0 || this.loops.size > 0 || this.debugRects.length > 0) {
        this.animationFrameId = globalThis.requestAnimationFrame(tick);
      } else if (this.context != null) {
        this.context.clearRect(0, 0, this.width, this.height);
      }
    };

    this.animationFrameId = globalThis.requestAnimationFrame(tick);
  }

  stopIfIdle() {
    if (this.particles.length > 0 || this.loops.size > 0 || this.debugRects.length > 0) {
      return;
    }

    if (this.animationFrameId !== 0) {
      globalThis.cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = 0;
    }
  }

  clear() {
    this.particles = [];
    this.debugRects = [];
    this.loops.clear();
    if (this.animationFrameId !== 0) {
      globalThis.cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = 0;
    }
    this.context?.clearRect(0, 0, this.width, this.height);
  }

  destroy() {
    this.clear();
    this.resizeObserver?.disconnect();
    globalThis.removeEventListener("resize", this.resize);
    globalThis.document.removeEventListener("visibilitychange", this.handleVisibilityChange);
  }

  resolveTargetShape(element) {
    const fallbackRect = element.getBoundingClientRect();
    const source = getElementInkImageSource(element);
    if (source == null) {
      return { type: "rect", rect: fallbackRect };
    }

    const entry = this.loadShapeCacheEntry(source.url);
    if (entry.status !== "ready") {
      return { type: "rect", rect: source.rect ?? fallbackRect };
    }

    const rect = getInkImageDrawRect(source, entry.image) ?? fallbackRect;
    if (entry.contour.points.length < INK_CONTOUR_MIN_POINTS) {
      return { type: "rect", rect };
    }

    return {
      type: "contour",
      rect,
      contour: entry.contour,
    };
  }

  loadShapeCacheEntry(url) {
    const cached = this.shapeCache.get(url);
    if (cached != null) {
      return cached;
    }

    const image = new globalThis.Image();
    const entry = {
      status: "loading",
      image,
      contour: { points: [] },
    };
    this.shapeCache.set(url, entry);

    image.onload = () => {
      entry.contour = extractInkContourFromImage(image, this.maskCanvas, this.maskContext);
      entry.status = entry.contour.points.length >= INK_CONTOUR_MIN_POINTS ? "ready" : "failed";
    };
    image.onerror = () => {
      entry.status = "failed";
    };
    image.src = url;

    if (image.complete && image.naturalWidth > 0 && image.naturalHeight > 0) {
      entry.contour = extractInkContourFromImage(image, this.maskCanvas, this.maskContext);
      entry.status = entry.contour.points.length >= INK_CONTOUR_MIN_POINTS ? "ready" : "failed";
    }

    return entry;
  }
}

function createInkParticle(targetShape, canvasRect, options = {}) {
  const edge = chooseInkEdge(options.edgeBias);
  const source =
    targetShape.type === "contour"
      ? getContourPoint(targetShape, edge)
      : getRectEdgePoint(targetShape.rect, edge);
  const x = source.x - canvasRect.left;
  const y = source.y - canvasRect.top;
  const distance = randomRange(options.distanceMin ?? 6, options.distanceMax ?? 22);
  const spread = randomRange(-0.62, 0.62);
  const direction =
    source.normalX == null || source.normalY == null
      ? getEdgeDirection(edge) + spread
      : Math.atan2(source.normalY, source.normalX) + spread;
  const isLargeDrop = Math.random() < 0.08;

  return {
    x,
    y,
    dx: Math.cos(direction) * distance,
    dy: Math.sin(direction) * distance,
    wobble: randomRange(0.6, 2.2),
    size: isLargeDrop ? randomRange(4, 6) : randomRange(1, 3.5),
    color: INK_PARTICLE_COLORS[randomInt(0, INK_PARTICLE_COLORS.length - 1)],
    alpha: randomRange(0.34, 0.5),
    life: randomRange(350, 750),
    age: 0,
    rotation: randomRange(0, Math.PI * 2),
    drift: 0,
    driftSpeed: randomRange(-2.4, 2.4),
    seed: Math.random(),
  };
}

function getElementInkImageSource(element) {
  if (element == null || typeof element.querySelector !== "function") {
    return null;
  }

  const backgroundUrl = getCssBackgroundImageUrl(element);
  if (backgroundUrl != null) {
    return {
      type: "background",
      element,
      url: backgroundUrl,
    };
  }

  const imageElement =
    typeof globalThis.HTMLImageElement === "function" &&
    element instanceof globalThis.HTMLImageElement
      ? element
      : element.querySelector(INK_IMAGE_TARGET_SELECTORS);
  if (
    imageElement == null ||
    ((imageElement.currentSrc ?? "") === "" && (imageElement.src ?? "") === "")
  ) {
    return null;
  }

  return {
    type: "image",
    element: imageElement,
    url: imageElement.currentSrc || imageElement.src,
  };
}

function getCssBackgroundImageUrl(element) {
  const style = globalThis.getComputedStyle(element);
  const backgroundImage = getFirstCssLayer(style.backgroundImage);
  if (backgroundImage === "" || backgroundImage === "none") {
    return null;
  }

  const match = backgroundImage.match(/^url\((?:"([^"]+)"|'([^']+)'|(.+))\)$/);
  if (match == null) {
    return null;
  }

  return match[1] ?? match[2] ?? match[3]?.trim() ?? null;
}

function getInkImageDrawRect(source, image) {
  if (source.type === "background") {
    return getBackgroundImageDrawRect(source.element, image);
  }

  return getObjectFitImageDrawRect(source.element, image);
}

function getBackgroundImageDrawRect(element, image) {
  const rect = element.getBoundingClientRect();
  if (image.naturalWidth <= 0 || image.naturalHeight <= 0) {
    return rect;
  }

  const style = globalThis.getComputedStyle(element);
  const size = resolveBackgroundSize(
    getFirstCssLayer(style.backgroundSize),
    rect.width,
    rect.height,
    image.naturalWidth,
    image.naturalHeight
  );
  const position = resolveBackgroundPosition(
    getFirstCssLayer(style.backgroundPosition),
    rect.width,
    rect.height,
    size.width,
    size.height
  );

  return createRectLike(
    rect.left + position.x,
    rect.top + position.y,
    size.width,
    size.height
  );
}

function getObjectFitImageDrawRect(imageElement, image) {
  const rect = imageElement.getBoundingClientRect();
  if (image.naturalWidth <= 0 || image.naturalHeight <= 0) {
    return rect;
  }

  const style = globalThis.getComputedStyle(imageElement);
  const objectFit = style.objectFit || "fill";
  if (objectFit === "fill" || objectFit === "none") {
    return rect;
  }

  const scale =
    objectFit === "cover"
      ? Math.max(rect.width / image.naturalWidth, rect.height / image.naturalHeight)
      : Math.min(rect.width / image.naturalWidth, rect.height / image.naturalHeight);
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;
  const position = resolveBackgroundPosition(
    style.objectPosition || "50% 50%",
    rect.width,
    rect.height,
    width,
    height
  );

  return createRectLike(rect.left + position.x, rect.top + position.y, width, height);
}

function resolveBackgroundSize(sizeValue, boxWidth, boxHeight, imageWidth, imageHeight) {
  const value = sizeValue.trim();
  if (value === "contain" || value === "") {
    const scale = Math.min(boxWidth / imageWidth, boxHeight / imageHeight);
    return { width: imageWidth * scale, height: imageHeight * scale };
  }

  if (value === "cover") {
    const scale = Math.max(boxWidth / imageWidth, boxHeight / imageHeight);
    return { width: imageWidth * scale, height: imageHeight * scale };
  }

  const tokens = value.split(/\s+/);
  const widthValue = parseCssLengthOrPercent(tokens[0], boxWidth);
  const heightValue =
    tokens.length > 1 ? parseCssLengthOrPercent(tokens[1], boxHeight) : null;

  if (widthValue == null && heightValue == null) {
    return { width: boxWidth, height: boxHeight };
  }

  if (widthValue == null) {
    return {
      width: (heightValue / imageHeight) * imageWidth,
      height: heightValue,
    };
  }

  if (heightValue == null) {
    return {
      width: widthValue,
      height: (widthValue / imageWidth) * imageHeight,
    };
  }

  return { width: widthValue, height: heightValue };
}

function resolveBackgroundPosition(positionValue, boxWidth, boxHeight, imageWidth, imageHeight) {
  const tokens = positionValue.trim().split(/\s+/).filter(Boolean);
  const horizontalToken = tokens[0] ?? "50%";
  const verticalToken = tokens[1] ?? "50%";

  return {
    x: resolvePositionOffset(horizontalToken, boxWidth, imageWidth, "x"),
    y: resolvePositionOffset(verticalToken, boxHeight, imageHeight, "y"),
  };
}

function resolvePositionOffset(token, boxSize, imageSize, axis) {
  if (token === "center") {
    return (boxSize - imageSize) * 0.5;
  }
  if ((axis === "x" && token === "right") || (axis === "y" && token === "bottom")) {
    return boxSize - imageSize;
  }
  if ((axis === "x" && token === "left") || (axis === "y" && token === "top")) {
    return 0;
  }
  if (token.endsWith("%")) {
    return (boxSize - imageSize) * (Number.parseFloat(token) / 100);
  }
  if (token.endsWith("px")) {
    return Number.parseFloat(token);
  }
  const numericValue = Number.parseFloat(token);
  return Number.isFinite(numericValue) ? numericValue : (boxSize - imageSize) * 0.5;
}

function parseCssLengthOrPercent(value, total) {
  if (value == null || value === "auto") {
    return null;
  }
  if (value.endsWith("%")) {
    return total * (Number.parseFloat(value) / 100);
  }
  if (value.endsWith("px")) {
    return Number.parseFloat(value);
  }
  const numericValue = Number.parseFloat(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function getFirstCssLayer(value) {
  return value.split(",")[0]?.trim() ?? "";
}

function createRectLike(left, top, width, height) {
  return {
    left,
    top,
    right: left + width,
    bottom: top + height,
    width,
    height,
  };
}

function extractInkContourFromImage(image, canvas, context) {
  if (context == null || image.naturalWidth <= 0 || image.naturalHeight <= 0) {
    return createEmptyInkContour();
  }

  const scale = Math.min(
    1,
    INK_CONTOUR_SAMPLE_MAX_SIZE / Math.max(image.naturalWidth, image.naturalHeight)
  );
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  canvas.width = width;
  canvas.height = height;
  context.clearRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  let imageData;
  try {
    imageData = context.getImageData(0, 0, width, height);
  } catch {
    return createEmptyInkContour();
  }

  const alphaAt = (x, y) => {
    if (x < 0 || x >= width || y < 0 || y >= height) {
      return 0;
    }
    return imageData.data[(y * width + x) * 4 + 3];
  };
  const contour = createEmptyInkContour();
  contour.width = width;
  contour.height = height;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (alphaAt(x, y) <= INK_CONTOUR_ALPHA_THRESHOLD) {
        continue;
      }

      let normalX = 0;
      let normalY = 0;
      for (let neighborY = -1; neighborY <= 1; neighborY += 1) {
        for (let neighborX = -1; neighborX <= 1; neighborX += 1) {
          if (neighborX === 0 && neighborY === 0) {
            continue;
          }
          if (alphaAt(x + neighborX, y + neighborY) <= INK_CONTOUR_ALPHA_THRESHOLD) {
            normalX += neighborX;
            normalY += neighborY;
          }
        }
      }

      if (normalX === 0 && normalY === 0) {
        continue;
      }

      const normalized = normalizeVector(normalX, normalY);
      const point = {
        x: (x + 0.5) / width,
        y: (y + 0.5) / height,
        normalX: normalized.x,
        normalY: normalized.y,
        edge: classifyContourEdge((x + 0.5) / width, (y + 0.5) / height),
      };
      contour.points.push(point);
      contour.byEdge[point.edge].push(point);
    }
  }

  return contour;
}

function createEmptyInkContour() {
  return {
    width: 0,
    height: 0,
    points: [],
    byEdge: {
      left: [],
      right: [],
      top: [],
      bottom: [],
    },
  };
}

function classifyContourEdge(x, y) {
  const distances = [
    ["left", x],
    ["right", 1 - x],
    ["top", y],
    ["bottom", 1 - y],
  ];
  distances.sort((a, b) => a[1] - b[1]);
  return distances[0][0];
}

function getContourPoint(targetShape, edge) {
  const { rect, contour } = targetShape;
  const edgePoints = contour.byEdge[edge] ?? [];
  const candidates = edgePoints.length > 0 ? edgePoints : contour.points;
  const point = candidates[randomInt(0, candidates.length - 1)];
  const jitterX = randomRange(-0.45, 0.45) / Math.max(1, contour.width);
  const jitterY = randomRange(-0.45, 0.45) / Math.max(1, contour.height);
  const screenNormal = normalizeVector(
    point.normalX * rect.width,
    point.normalY * rect.height
  );
  const bleed = randomRange(-1.5, 3.5);

  return {
    x: rect.left + clamp01(point.x + jitterX) * rect.width + screenNormal.x * bleed,
    y: rect.top + clamp01(point.y + jitterY) * rect.height + screenNormal.y * bleed,
    normalX: screenNormal.x,
    normalY: screenNormal.y,
  };
}

function chooseInkEdge(edgeBias) {
  const roll = Math.random();
  if (edgeBias === "selected") {
    if (roll < 0.3) {
      return "left";
    }
    if (roll < 0.6) {
      return "right";
    }
    if (roll < 0.9) {
      return "bottom";
    }
    return "top";
  }

  if (edgeBias === "ambient") {
    if (roll < 0.4) {
      return "left";
    }
    if (roll < 0.8) {
      return "right";
    }
    return "bottom";
  }

  if (roll < 0.34) {
    return "left";
  }
  if (roll < 0.68) {
    return "right";
  }
  if (roll < 0.9) {
    return "bottom";
  }
  return "top";
}

function getRectEdgePoint(rect, edge) {
  const inset = 6;
  switch (edge) {
    case "left":
      return {
        x: rect.left + randomRange(-4, inset),
        y: randomRange(rect.top + inset, rect.bottom - inset),
        normalX: -1,
        normalY: 0,
      };
    case "right":
      return {
        x: rect.right + randomRange(-inset, 4),
        y: randomRange(rect.top + inset, rect.bottom - inset),
        normalX: 1,
        normalY: 0,
      };
    case "bottom":
      return {
        x: randomRange(rect.left + inset, rect.right - inset),
        y: rect.bottom + randomRange(-inset, 4),
        normalX: 0,
        normalY: 1,
      };
    default:
      return {
        x: randomRange(rect.left + inset, rect.right - inset),
        y: rect.top + randomRange(-4, inset),
        normalX: 0,
        normalY: -1,
      };
  }
}

function getEdgeDirection(edge) {
  switch (edge) {
    case "left":
      return Math.PI;
    case "right":
      return 0;
    case "bottom":
      return Math.PI / 2;
    default:
      return -Math.PI / 2;
  }
}

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

function randomInt(min, max) {
  return Math.floor(randomRange(min, max + 1));
}

function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

function normalizeVector(x, y) {
  const length = Math.hypot(x, y);
  if (length <= 0.0001) {
    return { x: 0, y: -1 };
  }
  return { x: x / length, y: y / length };
}

function rectToDebugData(rect) {
  return {
    left: Math.round(rect.left),
    top: Math.round(rect.top),
    width: Math.round(rect.width),
    height: Math.round(rect.height),
  };
}

function getCharacterStatItems(character) {
  if (character == null) {
    return [];
  }

  return [
    ["身份", character.title ?? "无名之士"],
    ["职业", character.occupation ?? "待定"],
    ["年龄", `${character.age} 岁`],
    ["所属", character.affiliationLabel ?? character.clanId ?? "暂无"],
    ["统率", formatStatValue(character.stats.leadership)],
    ["武勇", formatStatValue(character.stats.martial)],
    ["智略", formatStatValue(character.stats.intelligence)],
    ["政务", formatStatValue(character.stats.politics)],
    ["魅力", formatStatValue(character.stats.charm)],
    ["声望", formatStatValue(character.stats.fame)],
  ];
}

function getCharacterSubtitle(character) {
  return [character?.title, character?.occupation].filter(Boolean).join(" / ") || "人物资料";
}

function renderCharacterDetailTransitionText(currentText, previousText, options = {}) {
  const currentValue = String(currentText ?? "");
  const previousValue = String(previousText ?? "");
  const hasPrevious = previousValue !== "" && previousValue !== currentValue;
  const stackClassName = [
    "c-main-ui-character-detail__text-stack",
    options.block === true ? "c-main-ui-character-detail__text-stack--block" : "",
    hasPrevious ? "is-transitioning" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return `
    <span class="${stackClassName}">
      <span class="c-main-ui-character-detail__text c-main-ui-character-detail__text--incoming">${escapeHtml(currentValue)}</span>
      ${
        hasPrevious
          ? `<span class="c-main-ui-character-detail__text c-main-ui-character-detail__text--outgoing" aria-hidden="true">${escapeHtml(previousValue)}</span>`
          : ""
      }
    </span>
  `;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatStatValue(value) {
  return typeof value === "number" ? String(value) : "0";
}
