import { applyLiveLayoutBindings } from "../tools/live-layout-bindings";
import { mountOpeningBackgroundAnimation } from "./opening-background-animation";
import { resolveCharacterAvatarImageUrl } from "../portrait-assets";
import { renderLayoutEditor } from "../tools/layout-editor-view";

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
    this.onStartGame = options.onStartGame;
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
    this.inkParticleSystem = null;
    this.pendingSelectedInkBurstCharacterId = null;
    this.previousCharacterDetail = null;
    this.characterDetailTransitionToken = 0;
    this.characterDetailTransitionTimer = 0;
    this.destroyOpeningBackgroundAnimation = null;
  }

  mount() {
    this.overlayRoot.classList.add("c-main-ui-overlay");
    this.overlayRoot.addEventListener("click", this.handleClick);
    this.overlayRoot.addEventListener("mouseover", this.handleHover);
    this.overlayRoot.addEventListener("focusin", this.handleFocus);
    this.render();
  }

  destroy() {
    this.overlayRoot.removeEventListener("click", this.handleClick);
    this.overlayRoot.removeEventListener("mouseover", this.handleHover);
    this.overlayRoot.removeEventListener("focusin", this.handleFocus);
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
        : this.renderCharacterSelect();
    this.overlayRoot.innerHTML =
      screenMarkup + renderLayoutEditor(this.getAppState());
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
            </div>
          </div>
        </div>
      </section>
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
    if (actionElement == null) {
      return;
    }

    if (
      this.getAppState().layoutEditor.isOpen &&
      target.closest("[data-layout-component-handle]") != null
    ) {
      return;
    }

    const action = actionElement.dataset.mainUiAction;
    if (action === "open-character-select") {
      this.showCharacterSelect();
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

    if (action === "continue-game") {
      const saveData = await this.loadSaveData();
      const selectedCharacter =
        this.getCharacterById(saveData?.selectedCharacterId ?? null) ??
        this.characters[0] ??
        null;

      if (selectedCharacter != null) {
        this.selectedCharacterId = selectedCharacter.id;
        this.onStartGame(selectedCharacter);
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
    const targetRect = element.getBoundingClientRect();
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
      const particle = createInkParticle(targetRect, canvasRect, options);
      this.particles.push(particle);
    }
  }

  drawRectForElement(element) {
    const canvasRect = this.canvas.getBoundingClientRect();
    const targetRect = element.getBoundingClientRect();
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
}

function createInkParticle(targetRect, canvasRect, options = {}) {
  const edge = chooseInkEdge(options.edgeBias);
  const source = getEdgePoint(targetRect, edge);
  const x = source.x - canvasRect.left;
  const y = source.y - canvasRect.top;
  const distance = randomRange(options.distanceMin ?? 6, options.distanceMax ?? 22);
  const spread = randomRange(-0.62, 0.62);
  const direction = getEdgeDirection(edge) + spread;
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

function getEdgePoint(rect, edge) {
  const inset = 6;
  switch (edge) {
    case "left":
      return {
        x: rect.left + randomRange(-4, inset),
        y: randomRange(rect.top + inset, rect.bottom - inset),
      };
    case "right":
      return {
        x: rect.right + randomRange(-inset, 4),
        y: randomRange(rect.top + inset, rect.bottom - inset),
      };
    case "bottom":
      return {
        x: randomRange(rect.left + inset, rect.right - inset),
        y: rect.bottom + randomRange(-inset, 4),
      };
    default:
      return {
        x: randomRange(rect.left + inset, rect.right - inset),
        y: rect.top + randomRange(-4, inset),
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
