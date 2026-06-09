import { applyLiveLayoutBindings } from "../tools/live-layout-bindings";
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
  }

  mount() {
    this.overlayRoot.classList.add("c-main-ui-overlay");
    this.overlayRoot.addEventListener("click", this.handleClick);
    this.render();
  }

  destroy() {
    this.overlayRoot.removeEventListener("click", this.handleClick);
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
      this.syncStartScreenLayout();
    } else if (this.currentScreen === "character-select") {
      this.syncCharacterSelectLayout();
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
              ${this.renderCharacterDetail(selectedCharacter)}
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

  renderCharacterDetail(character) {
    if (character == null) {
      return `
        <aside class="c-main-ui-character-detail">
          <div class="c-main-ui-character-detail__paper">
            <p class="c-main-ui-character-detail__empty">请先选择一名角色。</p>
          </div>
        </aside>
      `;
    }

    const statItems = [
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

    return `
      <aside class="c-main-ui-character-detail">
        <div class="c-main-ui-character-detail__paper">
          <div class="c-main-ui-character-detail__header">
            <div>
              <p class="c-main-ui-character-detail__eyebrow">人物详情 · 当前已选</p>
              <h2 class="c-main-ui-character-detail__name">${escapeHtml(character.name)}</h2>
              <p class="c-main-ui-character-detail__subtitle">
                ${escapeHtml([character.title, character.occupation].filter(Boolean).join(" / ") || "人物资料")}
              </p>
            </div>
            <span class="c-main-ui-character-detail__badge" aria-hidden="true"></span>
          </div>

          <dl class="c-main-ui-character-detail__stats">
            ${statItems
              .map(
                ([label, value]) => `
                  <div class="c-main-ui-character-detail__stat-row">
                    <dt>${escapeHtml(label)}</dt>
                    <dd>${escapeHtml(value)}</dd>
                  </div>
                `
              )
              .join("")}
          </dl>

          <div class="c-main-ui-character-detail__section">
            <h3 class="c-main-ui-character-detail__section-title">人物简介</h3>
            <p class="c-main-ui-character-detail__bio">
              ${escapeHtml(character.biography ?? "人物介绍待补充。")}
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
