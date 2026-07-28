import { applyLiveLayoutBindings } from "../tools/live-layout-bindings";
import { mountOpeningBackgroundAnimation } from "./opening-background-animation";
import {
  renderEntryShellCharacterSelect,
  renderEntryShellMainMenu,
  renderEntryShellScenarioPackCard,
  renderEntryShellScenarioSelect,
} from "../entry-shell/entry-shell-view";
import {
  createScriptEditorWorkflowController,
  installMainUiFlowScriptEditorModule,
} from "../../modules/script-editor";


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
    this.onStartLoadedScenarioPack = options.onStartLoadedScenarioPack;
    this.onImportScenarioPackFiles = options.onImportScenarioPackFiles;
    this.onExitRuntimePreview = options.onExitRuntimePreview;
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
    installMainUiFlowScriptEditorModule(this, options);
    this.scriptEditorWorkflowController = createScriptEditorWorkflowController({
      getProject: () => this.scriptEditorProject,
      getProjectSource: () => this.scriptEditorProjectSource,
      setProjectSource: (source) => {
        this.scriptEditorProjectSource = source;
      },
      commitProject: (project) => {
        this.commitScriptEditorProject(project);
      },
      getProjectDirectoryHandle: () => this.scriptEditorProjectDirectoryHandle,
      setProjectDirectoryHandle: (handle) => {
        this.scriptEditorProjectDirectoryHandle = handle;
      },
      getExportDirectoryHandle: () => this.scriptEditorExportDirectoryHandle,
      setExportDirectoryHandle: (handle) => {
        this.scriptEditorExportDirectoryHandle = handle;
      },
      rememberProjectPackageLocation: (result) => {
        this.rememberScriptEditorProjectPackageLocation(result);
      },
      resetRecordListPages: () => {
        this.resetScriptEditorRecordListPages();
      },
      resetRecordSearch: () => {
        this.resetScriptEditorRecordSearch();
      },
      setSelection: (selection) => {
        this.scriptEditorSelection = selection;
      },
      setAuxiliaryPanelOpen: (isOpen) => {
        this.scriptEditorAuxiliaryPanelOpen = isOpen;
      },
      setPendingDeleteProjectId: (projectId) => {
        this.scriptEditorPendingDeleteProjectId = projectId;
      },
      resetNoticeTimeline: () => {
        this.resetScriptEditorNoticeTimeline();
      },
      recordNotice: (notice) => {
        this.recordScriptEditorNotice(notice);
      },
      setScreen: (screen) => {
        this.setScreen(screen);
      },
      captureRuntimePreviewReturnContext: () =>
        this.captureScriptEditorRuntimePreviewReturnContext(),
      restoreRuntimePreviewReturnContext: (returnContext) => {
        this.restoreScriptEditorRuntimePreviewReturnContext(returnContext);
      },
      getRuntimePreviewSession: () => this.scriptEditorRuntimePreviewSession,
      setRuntimePreviewSession: (session) => {
        this.scriptEditorRuntimePreviewSession = session;
      },
      startLoadedScenarioPack: (scenarioPack) => {
        if (this.onStartLoadedScenarioPack == null) {
          throw new Error("Runtime preview startup is unavailable.");
        }
        return this.onStartLoadedScenarioPack(scenarioPack);
      },
      exitRuntimePreview: () => {
        this.onExitRuntimePreview?.();
      },
    });
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
    const hasRuntimePreviewSession = this.scriptEditorRuntimePreviewSession != null;
    this.overlayRoot.classList.toggle(
      "is-runtime-preview-active",
      hasRuntimePreviewSession
    );

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
    const runtimePreviewSessionMarkup = hasRuntimePreviewSession
      ? this.renderRuntimePreviewSessionBanner()
      : "";
    this.overlayRoot.innerHTML = `${screenMarkup}${runtimePreviewSessionMarkup}`;
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

  syncStartScreenLayout() {
    const appState = this.getAppState();
    applyLiveLayoutBindings({
      root: this.overlayRoot,
      layout: appState.uiLayouts["start-screen"],
      appState,
      bindings: startScreenLayoutBindings,
    });
  }

  syncCharacterSelectLayout() {
    const appState = this.getAppState();
    applyLiveLayoutBindings({
      root: this.overlayRoot,
      layout: appState.uiLayouts["character-select-screen"],
      appState,
      bindings: characterSelectLayoutBindings,
    });
  }

  renderMainMenu() {
    return renderEntryShellMainMenu();
  }

  renderScenarioSelect() {
    return renderEntryShellScenarioSelect({
      scenarioPacks: this.scenarioPacks,
    });
  }

  renderScenarioPackCard(scenarioPack) {
    return renderEntryShellScenarioPackCard(scenarioPack);
  }

  renderCharacterSelect() {
    const selectedCharacter = this.getSelectedCharacter();

    return renderEntryShellCharacterSelect({
      characters: this.characters,
      selectedCharacter,
      selectedCharacterId: this.selectedCharacterId,
      previousCharacter: this.previousCharacterDetail,
    });
  }

  renderCharacterShelf() {
    const cards = this.characters.map((character) => this.renderCharacterCard(character));
    const placeholderCount = Math.max(0, 8 - cards.length);
    const placeholders = Array.from({ length: placeholderCount }, (_, index) => `
      <div class="c-main-ui-character-card c-main-ui-character-card--placeholder" aria-hidden="true">
        <div class="c-main-ui-character-card__portrait"></div>
        <div class="c-main-ui-character-card__placeholder-label">鍚嶅唽寰呰ˉ</div>
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
            ${escapeHtml(character.biography ?? "绠€浠嬪緟琛ュ厖")}
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
            <p class="c-main-ui-character-detail__empty">璇峰厛閫夋嫨涓€鍚嶈鑹层€?/p>
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
              <p class="c-main-ui-character-detail__eyebrow">浜虹墿璇︽儏 / 褰撳墠宸查€?/p>
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
                character.biography ?? "人物介绍待补充",
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

    if (target.matches("[data-script-editor-person-attribute-field]")) {
      const field = target.dataset.scriptEditorPersonAttributeField;
      const index = Number.parseInt(
        target.dataset.scriptEditorPersonAttributeIndex ?? "-1",
        10
      );
      if (
        (field === "key-name" || field === "type" || field === "value") &&
        Number.isInteger(index) &&
        index >= 0
      ) {
        this.applyScriptEditorPersonAttributeField(index, field, target.value);
      }
      return;
    }

    if (target.matches("[data-script-editor-person-attribute-group-field]")) {
      const field = target.dataset.scriptEditorPersonAttributeGroupField;
      const groupId = target.dataset.scriptEditorPersonAttributeGroupId ?? "";
      if (field === "title" && groupId.length > 0) {
        this.applyScriptEditorPersonAttributeGroupField(groupId, field, target.value);
      }
      return;
    }

    if (
      target instanceof globalThis.HTMLInputElement &&
      target.matches("[data-script-editor-person-attribute-group-attribute-key]")
    ) {
      const groupId = target.dataset.scriptEditorPersonAttributeGroupId ?? "";
      const attributeKey =
        target.dataset.scriptEditorPersonAttributeGroupAttributeKey ?? "";
      if (groupId.length > 0 && attributeKey.length > 0) {
        this.applyScriptEditorPersonAttributeGroupItem(groupId, attributeKey, target.checked);
      }
      return;
    }

    if (target.matches("[data-script-editor-portrait-field]")) {
      const field = target.dataset.scriptEditorPortraitField;
      if (
        field === "id" ||
        field === "label" ||
        field === "portraitImage" ||
        field === "avatarImage"
      ) {
        this.applyScriptEditorPortraitField(field, target.value);
      }
      return;
    }

    if (target.matches("[data-script-editor-portrait-variant-field]")) {
      const field = target.dataset.scriptEditorPortraitVariantField;
      if (
        field === "id" ||
        field === "label" ||
        field === "parentPortraitId" ||
        field === "portraitId"
      ) {
        this.applyScriptEditorPortraitVariantField(field, target.value);
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

    if (target.matches('[data-script-editor-relation-kind="dialogue-participants"]')) {
      const index = Number.parseInt(target.dataset.scriptEditorRelationIndex ?? "-1", 10);
      if (Number.isInteger(index) && index >= 0) {
        this.applyScriptEditorDialogueParticipantField(index, target.value);
      }
      return;
    }

    if (target.matches("[data-script-editor-settlement-field]")) {
      const field = target.dataset.scriptEditorSettlementField;
      if (field === "title" || field === "nextEventId") {
        this.applyScriptEditorSettlementField(field, target.value);
      }
      return;
    }

    if (target.matches("[data-script-editor-settlement-content-field]")) {
      const field = target.dataset.scriptEditorSettlementContentField;
      const index = Number.parseInt(
        target.dataset.scriptEditorSettlementContentIndex ?? "-1",
        10
      );
      if (
        (
          field === "targetFamily" ||
          field === "targetId" ||
          field === "attributeKey" ||
          field === "operation" ||
          field === "value"
        ) &&
        Number.isInteger(index) &&
        index >= 0
      ) {
        this.applyScriptEditorSettlementContentField(index, field, target.value);
      }
      return;
    }

    if (target.matches("[data-script-editor-progress-track-field]")) {
      const field = target.dataset.scriptEditorProgressTrackField;
      if (
        field === "title" ||
        field === "metricKey" ||
        field === "metricLabel" ||
        field === "hostFamily" ||
        field === "allowDemotion"
      ) {
        const nextValue =
          field === "allowDemotion" && target instanceof globalThis.HTMLInputElement
            ? target.checked
            : target.value;
        this.applyScriptEditorProgressTrackField(field, nextValue);
      }
      return;
    }

    if (target.matches("[data-script-editor-progress-track-tier-field]")) {
      const field = target.dataset.scriptEditorProgressTrackTierField;
      const index = Number.parseInt(
        target.dataset.scriptEditorProgressTrackTierIndex ?? "-1",
        10
      );
      if (
        ["title", "threshold", "onEnterRepeatPolicy", "targetTierSettlementId"].includes(
          field ?? ""
        ) &&
        Number.isInteger(index) &&
        index >= 0
      ) {
        this.applyScriptEditorProgressTrackTierField(index, field, target.value);
      }
      return;
    }

    if (target.matches("[data-script-editor-progress-binding-field]")) {
      const field = target.dataset.scriptEditorProgressBindingField;
      if (
        ["trackId", "hostFamily", "hostId", "enabled"].includes(field ?? "")
      ) {
        const nextValue =
          field === "enabled" && target instanceof globalThis.HTMLInputElement
            ? target.checked
            : target.value;
        this.applyScriptEditorProgressTrackBindingField(field, nextValue);
      }
      return;
    }

    if (target.matches("[data-script-editor-event-field]")) {
      const field = target.dataset.scriptEditorEventField;
      if (
        field === "id" ||
        field === "title" ||
        field === "description" ||
        field === "type" ||
        field === "settlementId" ||
        field === "nextEventId"
      ) {
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

    if (target.matches("[data-script-editor-settlement-field]")) {
      const field = target.dataset.scriptEditorSettlementField;
      if (field === "title" || field === "nextEventId") {
        this.applyScriptEditorSettlementField(field, target.value);
      }
      return;
    }

    if (target.matches("[data-script-editor-settlement-content-field]")) {
      const field = target.dataset.scriptEditorSettlementContentField;
      const index = Number.parseInt(
        target.dataset.scriptEditorSettlementContentIndex ?? "-1",
        10
      );
      if (
        (
          field === "targetFamily" ||
          field === "targetId" ||
          field === "attributeKey" ||
          field === "operation" ||
          field === "value"
        ) &&
        Number.isInteger(index) &&
        index >= 0
      ) {
        this.applyScriptEditorSettlementContentField(index, field, target.value);
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
      if (typeof field === "string" && field.length > 0) {
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

    if (target.matches("[data-script-editor-building-arrangement-field]")) {
      const arrangementId = target.dataset.scriptEditorBuildingArrangementId ?? "";
      const field = target.dataset.scriptEditorBuildingArrangementField;
      if (
        arrangementId.length > 0 &&
        ["id", "cityId", "buildingId", "displayName", "description", "backgroundId"].includes(field ?? "")
      ) {
        this.applyScriptEditorBuildingArrangementField(arrangementId, field, target.value);
      }
      return;
    }

    if (target.matches("[data-script-editor-building-arrangement-npc]")) {
      const arrangementId = target.dataset.scriptEditorBuildingArrangementId ?? "";
      const npcIndex = Number.parseInt(
        target.dataset.scriptEditorBuildingArrangementNpcIndex ?? "-1",
        10
      );
      if (arrangementId.length > 0 && Number.isInteger(npcIndex) && npcIndex >= 0) {
        this.applyScriptEditorBuildingArrangementNpc(arrangementId, npcIndex, target.value);
      }
      return;
    }

    if (target.matches("[data-script-editor-building-arrangement-primary-npc]")) {
      const arrangementId = target.dataset.scriptEditorBuildingArrangementId ?? "";
      if (arrangementId.length > 0) {
        this.applyScriptEditorBuildingArrangementPrimaryNpc(arrangementId, target.value);
      }
      return;
    }

    if (target.matches("[data-script-editor-building-layout-field]")) {
      const arrangementId = target.dataset.scriptEditorBuildingArrangementId ?? "";
      const field = target.dataset.scriptEditorBuildingLayoutField;
      if (
        arrangementId.length > 0 &&
        ["templateId", "shellClassNames"].includes(field ?? "")
      ) {
        this.applyScriptEditorBuildingLayoutField(arrangementId, field, target.value);
      }
      return;
    }

    if (target.matches("[data-script-editor-building-layout-node-field]")) {
      const arrangementId = target.dataset.scriptEditorBuildingArrangementId ?? "";
      const nodeIndex = Number.parseInt(
        target.dataset.scriptEditorBuildingLayoutNodeIndex ?? "-1",
        10
      );
      const field = target.dataset.scriptEditorBuildingLayoutNodeField;
      if (
        arrangementId.length > 0 &&
        Number.isInteger(nodeIndex) &&
        nodeIndex >= 0 &&
        [
          "id",
          "kind",
          "regionId",
          "sourceContainerId",
          "sourceContainerType",
          "presentation",
          "characterFilter",
          "actionFilter",
          "clickActionId",
        ].includes(field ?? "")
      ) {
        this.applyScriptEditorBuildingLayoutNodeField(
          arrangementId,
          nodeIndex,
          field,
          target.value
        );
      }
      return;
    }

    if (target.matches("[data-script-editor-building-container-field]")) {
      const arrangementId = target.dataset.scriptEditorBuildingArrangementId ?? "";
      const containerIndex = Number.parseInt(
        target.dataset.scriptEditorBuildingContainerIndex ?? "-1",
        10
      );
      const field = target.dataset.scriptEditorBuildingContainerField;
      if (
        arrangementId.length > 0 &&
        Number.isInteger(containerIndex) &&
        containerIndex >= 0 &&
        ["id", "type", "title"].includes(field ?? "")
      ) {
        this.applyScriptEditorBuildingContainerField(
          arrangementId,
          containerIndex,
          field,
          target.value
        );
      }
      return;
    }

    if (
      target instanceof globalThis.HTMLInputElement &&
      target.matches("[data-script-editor-building-layout-node-flag]")
    ) {
      const arrangementId = target.dataset.scriptEditorBuildingArrangementId ?? "";
      const nodeIndex = Number.parseInt(
        target.dataset.scriptEditorBuildingLayoutNodeIndex ?? "-1",
        10
      );
      const field = target.dataset.scriptEditorBuildingLayoutNodeFlag;
      if (
        arrangementId.length > 0 &&
        Number.isInteger(nodeIndex) &&
        nodeIndex >= 0 &&
        ["previewSelectable", "previewDraggable", "previewDropTarget"].includes(
          field ?? ""
        )
      ) {
        this.applyScriptEditorBuildingLayoutNodeFlag(
          arrangementId,
          nodeIndex,
          field,
          target.checked
        );
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
      const instanceId = target.dataset.scriptEditorLocationMenuInstanceId ?? "";
      const index = Number.parseInt(
        target.dataset.scriptEditorLocationMenuIndex ?? "-1",
        10
      );
      if (
        ["id", "label", "menuFamily", "targetFamily", "targetId", "disabledHint"].includes(
          field ?? ""
        ) &&
        instanceId.length > 0 &&
        Number.isInteger(index) &&
        index >= 0
      ) {
        this.applyScriptEditorLocationMenuField(instanceId, index, field, target.value);
      }
      return;
    }

    if (target.matches("[data-script-editor-location-menu-instance-field]")) {
      const field = target.dataset.scriptEditorLocationMenuInstanceField;
      const instanceId = target.dataset.scriptEditorLocationMenuInstanceId ?? "";
      if (field === "title" && instanceId.length > 0) {
        this.applyScriptEditorLocationMenuInstanceField(instanceId, target.value);
      }
      return;
    }

    if (target.matches("[data-script-editor-location-menu-resource-field]")) {
      const field = target.dataset.scriptEditorLocationMenuResourceField;
      const resourceId = target.dataset.scriptEditorLocationMenuResourceId ?? "";
      if (field === "title" && resourceId.length > 0) {
        this.applyScriptEditorLocationMenuResourceField(resourceId, target.value);
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
        (
          field === "key" ||
          field === "label" ||
          field === "type" ||
          field === "value" ||
          field === "options"
        ) &&
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
      const instanceId = target.dataset.scriptEditorLocationMenuInstanceId ?? "";
      const index = Number.parseInt(
        target.dataset.scriptEditorLocationMenuIndex ?? "-1",
        10
      );
      if (
        (field === "isVisible" || field === "isEnabled") &&
        instanceId.length > 0 &&
        Number.isInteger(index) &&
        index >= 0
      ) {
        this.applyScriptEditorLocationMenuFlag(instanceId, index, field, target.checked);
      }
      return;
    }

    if (target.matches("[data-script-editor-location-access-field]")) {
      const field = target.dataset.scriptEditorLocationAccessField;
      if (
        field === "blockedDialogueId" ||
        field === "conditionExpression" ||
        field === "leaveConditionExpression"
      ) {
        this.applyScriptEditorLocationAccessField(field, target.value);
      }
      return;
    }
    if (target.matches("[data-script-editor-location-access-condition-field]")) {
      const index = Number.parseInt(
        target.dataset.scriptEditorLocationAccessConditionIndex ?? "-1",
        10
      );
      const field = target.dataset.scriptEditorLocationAccessConditionField;
      if (
        Number.isInteger(index) &&
        index >= 0 &&
        (field === "factor" ||
          field === "eventId" ||
          field === "eventState" ||
          field === "personId" ||
          field === "personField" ||
          field === "timeField" ||
          field === "sourceField" ||
          field === "operator" ||
          field === "literalValue")
      ) {
        const conditionField =
          target
            .closest("[data-script-editor-location-access-condition-scope]")
            ?.dataset.scriptEditorLocationAccessConditionScope ??
          "conditionExpression";
        this.applyScriptEditorLocationAccessConditionField(
          index,
          field,
          target.value,
          conditionField
        );
      }
      return;
    }
    if (target.matches("[data-script-editor-building-entry-field]")) {
      const field = target.dataset.scriptEditorBuildingEntryField;
      if (field === "defaultPersonId" || field === "returnTarget") {
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

    if (target.matches("[data-script-editor-city-mounted-building-search]")) {
      if (event.isComposing === true) {
        return;
      }
      const buildingIndex = Number.parseInt(
        target.dataset.scriptEditorCityMountedBuildingIndex ?? "-1",
        10
      );
      if (Number.isInteger(buildingIndex) && buildingIndex >= 0) {
        this.setScriptEditorCityMountedBuildingSearchValue(buildingIndex, target.value);
      }
      return;
    }

    if (target.matches("[data-script-editor-location-access-condition-field]")) {
      const index = Number.parseInt(
        target.dataset.scriptEditorLocationAccessConditionIndex ?? "-1",
        10
      );
      const field = target.dataset.scriptEditorLocationAccessConditionField;
      const conditionField =
        target
          .closest("[data-script-editor-location-access-condition-scope]")
          ?.dataset.scriptEditorLocationAccessConditionScope ??
        "conditionExpression";
      if (
        Number.isInteger(index) &&
        index >= 0 &&
        (field === "literalValue" ||
          field === "personField" ||
          field === "timeField")
      ) {
        this.applyScriptEditorLocationAccessConditionField(
          index,
          field,
          target.value,
          conditionField
        );
      }
    }

    if (target.matches("[data-script-editor-settlement-field]")) {
      const field = target.dataset.scriptEditorSettlementField;
      if (field === "title" || field === "nextEventId") {
        this.applyScriptEditorSettlementField(field, target.value);
      }
      return;
    }

    if (target.matches("[data-script-editor-settlement-content-field]")) {
      const field = target.dataset.scriptEditorSettlementContentField;
      const index = Number.parseInt(
        target.dataset.scriptEditorSettlementContentIndex ?? "-1",
        10
      );
      if (
        (
          field === "targetFamily" ||
          field === "targetId" ||
          field === "attributeKey" ||
          field === "operation" ||
          field === "value"
        ) &&
        Number.isInteger(index) &&
        index >= 0
      ) {
        this.applyScriptEditorSettlementContentField(index, field, target.value);
      }
      return;
    }

    if (target.matches("[data-script-editor-progress-track-field]")) {
      const field = target.dataset.scriptEditorProgressTrackField;
      if (field === "title" || field === "metricKey" || field === "metricLabel") {
        this.applyScriptEditorProgressTrackField(field, target.value);
      }
      return;
    }

    if (target.matches("[data-script-editor-progress-track-tier-field]")) {
      const field = target.dataset.scriptEditorProgressTrackTierField;
      const index = Number.parseInt(
        target.dataset.scriptEditorProgressTrackTierIndex ?? "-1",
        10
      );
      if (field === "threshold" && Number.isInteger(index) && index >= 0) {
        this.applyScriptEditorProgressTrackTierField(index, field, target.value);
      }
      return;
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

    if (target.matches("[data-script-editor-city-mounted-building-search]")) {
      const buildingIndex = Number.parseInt(
        target.dataset.scriptEditorCityMountedBuildingIndex ?? "-1",
        10
      );
      if (Number.isInteger(buildingIndex) && buildingIndex >= 0) {
        this.setScriptEditorCityMountedBuildingSearchValue(buildingIndex, target.value);
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
    ["职业", character.occupation ?? "未定"],
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
  return [character?.title, character?.occupation].filter(Boolean).join(" / ") || "浜虹墿璧勬枡";
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
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatStatValue(value) {
  return typeof value === "number" ? String(value) : "0";
}

