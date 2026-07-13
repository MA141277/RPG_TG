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
import { serializeScriptEditorProjectToFiles } from "../../application/script-editor/editor-project-save";
import {
  exportScriptEditorProjectToScenarioPackFiles,
  validateScriptEditorProjectForRuntimeExport,
} from "../../application/script-editor/runtime-pack-export";
import { loadScriptEditorProjectFromScenarioPackFiles } from "../../application/script-editor/runtime-pack-import";
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

export class MainUiFlow {
  constructor(options) {
    this.overlayRoot = options.overlayRoot;
    this.characters = [...options.characters];
    this.scenarioPacks = [...(options.scenarioPacks ?? [])];
    this.onStartGame = options.onStartGame;
    this.onContinueGame = options.onContinueGame;
    this.onStartScenarioPack = options.onStartScenarioPack;
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
    this.scriptEditorProjectDirectoryHandle = null;
    this.scriptEditorExportDirectoryHandle = null;
  }

  mount() {
    this.overlayRoot.classList.add("c-main-ui-overlay");
    this.overlayRoot.addEventListener("click", this.handleClick);
    this.overlayRoot.addEventListener("mouseover", this.handleHover);
    this.overlayRoot.addEventListener("focusin", this.handleFocus);
    this.overlayRoot.addEventListener("change", this.handleChange);
    this.render();
  }

  destroy() {
    this.overlayRoot.removeEventListener("click", this.handleClick);
    this.overlayRoot.removeEventListener("mouseover", this.handleHover);
    this.overlayRoot.removeEventListener("focusin", this.handleFocus);
    this.overlayRoot.removeEventListener("change", this.handleChange);
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

  showScriptEditorLanding() {
    this.setScreen("script-editor-landing");
  }

  setScreen(screen) {
    this.currentScreen = screen;
    this.overlayRoot.classList.toggle("is-hidden", screen === "hidden");
    this.render();
  }

  render() {
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
              : this.renderCharacterSelect();
    this.overlayRoot.innerHTML = screenMarkup;
    if (this.currentScreen === "main-menu") {
      this.destroyOpeningBackgroundAnimation = mountOpeningBackgroundAnimation(this.overlayRoot);
      this.syncStartScreenLayout();
    } else if (this.currentScreen === "character-select") {
      this.syncCharacterSelectLayout();
      this.setupCharacterSelectInkParticles();
      this.scheduleCharacterDetailTransitionCleanup();
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
            剧本编辑器
          </button>
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

  renderScriptEditorLanding() {
    const hasSession = this.scriptEditorProject != null;

    return `
      <section class="c-main-ui-screen c-main-ui-screen--script-editor-flow" aria-label="剧本编辑器入口">
        <div class="c-script-editor-landing">
          <header class="c-script-editor-landing__header">
            <p class="c-script-editor-landing__eyebrow">Script Editor</p>
            <h1 class="c-script-editor-landing__title">Project-first workflow</h1>
            <p class="c-script-editor-landing__description">
              Create a project, open an existing editor project, or import a runtime pack into the same workspace flow.
            </p>
          </header>

          ${this.renderScriptEditorNotice()}

          <div class="c-script-editor-landing__actions">
            <button type="button" class="c-main-ui-json-text-button c-main-ui-json-text-button--accent" data-script-editor-action="new-project">
              新建剧本项目
            </button>
            <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="open-project">
              打开剧本项目
            </button>
            <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="import-pack">
              导入现有剧本包
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
              返回主菜单
            </button>
          </div>

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
    });

    return `
      <section class="c-main-ui-screen c-main-ui-screen--script-editor-flow" aria-label="剧本编辑器工作流">
        <div class="c-script-editor-workflow__chrome">
          <div class="c-script-editor-workflow__chrome-actions">
            <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="back-to-menu">
              返回主菜单
            </button>
            <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="back-to-landing">
              返回项目入口
            </button>
            <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="open-project">
              打开项目
            </button>
            <button type="button" class="c-main-ui-json-text-button" data-script-editor-action="import-pack">
              导入剧本包
            </button>
          </div>
          ${this.renderScriptEditorNotice()}
          ${this.renderScriptEditorFileInputs()}
        </div>

        ${renderScriptEditorWorkspaceView(workspace)}

        <section class="c-script-editor-workflow__editor" aria-label="最小对象编辑">
          ${this.renderScriptEditorEditorPanel()}
        </section>
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

      return `
        <div class="c-script-editor-editor-card">
          <header class="c-script-editor-editor-card__header">
            <div>
              <p class="c-script-editor-editor-card__eyebrow">Project</p>
              <h2 class="c-script-editor-editor-card__title">项目根信息</h2>
            </div>
          </header>
          <div class="c-script-editor-form-grid">
            ${this.renderScriptEditorField("project.id", "Project ID", this.scriptEditorProject.id)}
            ${this.renderScriptEditorField("project.title", "Project Title", this.scriptEditorProject.title)}
            ${this.renderScriptEditorField("project.description", "Project Description", this.scriptEditorProject.description ?? "")}
            ${this.renderScriptEditorField("storyPack.id", "Story Pack ID", storyPack.id)}
            ${this.renderScriptEditorField("storyPack.title", "Story Pack Title", storyPack.title)}
            ${this.renderScriptEditorField("storyPack.description", "Story Pack Description", storyPack.description ?? "")}
            ${this.renderScriptEditorField("scenarioProfile.id", "Scenario ID", scenarioProfile.id ?? "")}
            ${this.renderScriptEditorField("scenarioProfile.title", "Scenario Title", scenarioProfile.title ?? "")}
            ${this.renderScriptEditorField("scenarioProfile.playerCharacterId", "Player Character ID", scenarioProfile.playerCharacterId ?? "")}
            ${this.renderScriptEditorField("scenarioProfile.chapterId", "Chapter ID", scenarioProfile.chapterId ?? "")}
            ${this.renderScriptEditorField("scenarioProfile.initialLocation.mapId", "Initial Map ID", initialLocation.mapId ?? "")}
            ${this.renderScriptEditorField("scenarioProfile.initialLocation.cityId", "Initial City ID", initialLocation.cityId ?? "")}
            ${this.renderScriptEditorField("scenarioProfile.initialLocation.houseId", "Initial House ID", initialLocation.houseId ?? "")}
            ${this.renderScriptEditorField("scenarioProfile.initialLocation.view", "Initial View", initialLocation.view ?? "")}
          </div>
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

    return `
      <div class="c-script-editor-editor-card">
        <header class="c-script-editor-editor-card__header">
          <div>
            <p class="c-script-editor-editor-card__eyebrow">Minimal Object Editor</p>
            <h2 class="c-script-editor-editor-card__title">${escapeHtml(this.getScriptEditorFamilyLabel(family))}</h2>
          </div>
          <div class="c-script-editor-editor-card__actions">
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
                Story nodes remain a bounded placeholder family here. Editing is allowed, but runtime export will still fail closed until a later queue lands the compile path.
              </p>
            `
            : ""
        }

        <div class="c-script-editor-record-layout">
          <aside class="c-script-editor-record-list" aria-label="对象列表">
            ${records
              .map(
                (record) => `
                  <button
                    type="button"
                    class="c-script-editor-record-list__item ${record.id === selectedRecord?.id ? "is-selected" : ""}"
                    data-script-editor-record-id="${escapeHtml(record.id)}"
                  >
                    <strong>${escapeHtml(this.getScriptEditorRecordLabel(record))}</strong>
                    <span>${escapeHtml(record.id)}</span>
                  </button>
                `
              )
              .join("")}
          </aside>
          <div class="c-script-editor-record-editor">
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
      <input
        type="file"
        accept="application/json,.json"
        data-script-editor-pack-file
        webkitdirectory
        directory
        multiple
        hidden
      >
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
                大明开国人物传。<br />
                选定出战人物后，<br />
                便从这卷风云中启程。
              </p>
            </div>
          </aside>

          <div class="c-main-ui-character-book">
            <div class="c-main-ui-character-book__tabs" aria-hidden="true">
              <span class="c-main-ui-book-tab c-main-ui-book-tab--characters is-active">人物传</span>
              <span class="c-main-ui-book-tab c-main-ui-book-tab--roster">群雄录</span>
              <span class="c-main-ui-book-tab c-main-ui-book-tab--ministers">名臣卷</span>
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
        <div class="c-main-ui-character-card__placeholder-index">卷 ${index + 5}</div>
      </div>
    `);

    return [...cards, ...placeholders].join("");
  }

  renderCharacterCard(character) {
    const isSelected = character.id === this.selectedCharacterId;
    const titleParts = [character.title, character.occupation].filter(Boolean);
    const subtitle =
      titleParts.length === 0 ? "角色资料待补充" : titleParts.join(" / ");
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
        await this.handleScriptEditorAction(action);
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
    if (!(target instanceof globalThis.HTMLInputElement)) {
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

    if (target.matches("[data-script-editor-pack-file]")) {
      const files = Array.from(target.files ?? []);
      target.value = "";
      if (files.length === 0) {
        return;
      }

      await this.handleScriptEditorPackImport(files);
      return;
    }

    if (target.matches("[data-script-editor-project-field]")) {
      const field = target.dataset.scriptEditorProjectField;
      if (field != null) {
        this.applyScriptEditorProjectField(field, target.value);
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

  async handleScriptEditorAction(action) {
    if (action === "new-project") {
      this.scriptEditorProject = createDefaultScriptEditorProjectDefinition();
      this.scriptEditorSelection = {
        family: "storyPack",
        entityId: null,
      };
      this.scriptEditorProjectDirectoryHandle = null;
      this.scriptEditorExportDirectoryHandle = null;
      this.scriptEditorNotice = {
        tone: "success",
        message: "Created a new script editor project.",
      };
      this.setScreen("script-editor-workspace");
      return;
    }

    if (action === "open-project") {
      this.overlayRoot
        .querySelector("[data-script-editor-project-file]")
        ?.click();
      return;
    }

    if (action === "import-pack") {
      this.overlayRoot
        .querySelector("[data-script-editor-pack-file]")
        ?.click();
      return;
    }

    if (action === "continue-session") {
      if (this.scriptEditorProject != null) {
        this.scriptEditorNotice = null;
        this.setScreen("script-editor-workspace");
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

    if (action === "save") {
      await this.saveScriptEditorProject();
      return;
    }

    if (action === "validate") {
      this.runScriptEditorValidation();
      return;
    }

    if (action === "export") {
      await this.exportScriptEditorProject();
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

    this.scriptEditorSelection = {
      family: this.scriptEditorSelection.family,
      entityId: recordId,
    };
    this.scriptEditorNotice = null;
    this.render();
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

    this.scriptEditorProject = upsertScriptEditorWorkflowRecord(
      this.scriptEditorProject,
      family,
      draft
    );
    this.scriptEditorSelection = {
      family,
      entityId: draft.id,
    };
    this.scriptEditorNotice = {
      tone: "success",
      message: `Added a new ${this.getScriptEditorFamilyLabel(family)} record draft.`,
    };
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
    this.scriptEditorProject = removeScriptEditorWorkflowRecord(
      this.scriptEditorProject,
      family,
      this.scriptEditorSelection.entityId
    );
    const nextRecords = listScriptEditorWorkflowFamilyRecords(
      this.scriptEditorProject,
      family
    );
    this.scriptEditorSelection = {
      family,
      entityId: nextRecords[0]?.id ?? null,
    };
    this.scriptEditorNotice = {
      tone: "success",
      message: `Removed the selected ${this.getScriptEditorFamilyLabel(family)} record.`,
    };
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
      this.scriptEditorProject = upsertScriptEditorWorkflowRecord(
        this.scriptEditorProject,
        family,
        parsed
      );
      this.scriptEditorSelection = {
        family,
        entityId: parsed.id,
      };
      this.scriptEditorNotice = {
        tone: "success",
        message: `Applied JSON changes to ${this.getScriptEditorFamilyLabel(family)}:${parsed.id}.`,
      };
    } catch (error) {
      this.scriptEditorNotice = {
        tone: "warning",
        message:
          error instanceof Error
            ? error.message
            : "Failed to apply record JSON.",
      };
    }

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
      default:
        return;
    }

    this.scriptEditorProject = nextProject;
    this.scriptEditorNotice = null;
    this.render();
  }

  runScriptEditorValidation() {
    if (this.scriptEditorProject == null) {
      return;
    }

    const diagnostics = validateScriptEditorProjectForRuntimeExport(
      this.scriptEditorProject
    );
    this.scriptEditorNotice =
      diagnostics.length === 0
        ? {
            tone: "success",
            message: "Runtime export validation passed for the bounded minimal workflow.",
          }
        : {
            tone: "warning",
            message: diagnostics[0]?.message ?? "Runtime export validation failed.",
          };
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
      this.scriptEditorNotice = {
        tone: "success",
        message:
          result.mode === "directory"
            ? "Saved the script editor project to the selected directory."
            : "Downloaded the script editor project files.",
      };
    } catch (error) {
      this.scriptEditorNotice = {
        tone: "warning",
        message:
          error instanceof Error ? error.message : "Failed to save the script editor project.",
      };
    }

    this.render();
  }

  async exportScriptEditorProject() {
    if (this.scriptEditorProject == null) {
      return;
    }

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
      this.scriptEditorNotice = {
        tone: "success",
        message:
          result.mode === "directory"
            ? "Exported a runtime-compatible scenario pack."
            : "Downloaded the runtime pack files.",
      };
    } catch (error) {
      this.scriptEditorNotice = {
        tone: "warning",
        message:
          error instanceof Error ? error.message : "Failed to export the runtime pack.",
      };
    }

    this.render();
  }

  async handleScriptEditorProjectFileImport(files) {
    try {
      this.scriptEditorProject = await loadScriptEditorProjectFromFiles(files);
      this.scriptEditorSelection = {
        family: "storyPack",
        entityId: null,
      };
      this.scriptEditorProjectDirectoryHandle = null;
      this.scriptEditorNotice = {
        tone: "success",
        message: "Opened the script editor project.",
      };
      this.setScreen("script-editor-workspace");
    } catch (error) {
      this.scriptEditorNotice = {
        tone: "warning",
        message:
          error instanceof Error ? error.message : "Failed to open the script editor project.",
      };
      this.render();
    }
  }

  async handleScriptEditorPackImport(files) {
    try {
      this.scriptEditorProject = await loadScriptEditorProjectFromScenarioPackFiles(files);
      this.scriptEditorSelection = {
        family: "storyPack",
        entityId: null,
      };
      this.scriptEditorExportDirectoryHandle = null;
      this.scriptEditorNotice = {
        tone: "success",
        message: "Imported the runtime pack into the bounded authoring project.",
      };
      this.setScreen("script-editor-workspace");
    } catch (error) {
      this.scriptEditorNotice = {
        tone: "warning",
        message:
          error instanceof Error ? error.message : "Failed to import the runtime pack.",
      };
      this.render();
    }
  }

  getScriptEditorFamilyLabel(family) {
    switch (family) {
      case "storyPack":
        return "Story Pack";
      case "people":
        return "People";
      case "textEntries":
        return "Text Entries";
      case "storyNodes":
        return "Story Nodes";
      case "events":
        return "Events";
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
}

async function writeTextFilesWithDirectoryPicker(
  files,
  options = {}
) {
  const directoryPicker =
    typeof globalThis.showDirectoryPicker === "function"
      ? globalThis.showDirectoryPicker.bind(globalThis)
      : typeof globalThis.window?.showDirectoryPicker === "function"
        ? globalThis.window.showDirectoryPicker.bind(globalThis.window)
        : null;

  if (options.directoryHandle != null) {
    await writeTextFilesToDirectory(options.directoryHandle, files);
    return {
      mode: "directory",
      directoryHandle: options.directoryHandle,
    };
  }

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
