import { resolveCharacterAvatarImageUrl } from "../portrait-assets";

export function renderEntryShellMainMenu() {
  return `
    <section class="c-main-ui-screen c-main-ui-screen--main-menu" aria-label="主菜单">
      <canvas class="c-main-ui-opening-background-canvas" aria-hidden="true"></canvas>
      <div class="c-main-ui-main-menu">
        <div class="c-main-ui-main-menu__content">
          <p class="c-main-ui-main-menu__subtitle">洪武前夜 / 群雄并起</p>
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
              编辑器工作台
            </button>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function renderEntryShellScenarioSelect({ scenarioPacks }) {
  return `
    <section class="c-main-ui-screen c-main-ui-screen--scenario-select" aria-label="JSON 开局选择">
      <div class="c-main-ui-scenario-panel">
        <header class="c-main-ui-scenario-panel__header">
          <p class="c-main-ui-character-detail__eyebrow">模块开局</p>
          <h2 class="c-main-ui-scenario-panel__title">读取 JSON 开局</h2>
        </header>

        <div class="c-main-ui-scenario-list">
          ${scenarioPacks.map(renderEntryShellScenarioPackCard).join("")}
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

export function renderEntryShellScenarioPackCard(scenarioPack) {
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

export function renderEntryShellScriptEditorLanding({
  hasSession,
  noticeMarkup,
  projectLibraryMarkup = "",
  fileInputsMarkup,
}) {
  return `
    <section class="c-main-ui-screen c-main-ui-screen--script-editor-flow" aria-label="剧本编辑器入口">
      <div class="c-script-editor-landing">
        ${noticeMarkup}

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

        ${projectLibraryMarkup}
        ${fileInputsMarkup}
      </div>
    </section>
  `;
}

export function renderEntryShellCharacterSelect({
  characters,
  selectedCharacter,
  selectedCharacterId,
  previousCharacter,
}) {
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
              便从这卷风云中启程。
            </p>
          </div>
        </aside>

        <div class="c-main-ui-character-book">
          <div class="c-main-ui-character-book__tabs" aria-hidden="true">
            <span class="c-main-ui-book-tab c-main-ui-book-tab--characters is-active">人物</span>
            <span class="c-main-ui-book-tab c-main-ui-book-tab--roster">群雄</span>
            <span class="c-main-ui-book-tab c-main-ui-book-tab--ministers">名录</span>
          </div>

          <div class="c-main-ui-character-book__content">
            <div class="c-main-ui-character-grid" role="list">
              ${renderEntryShellCharacterShelf({ characters, selectedCharacterId })}
            </div>
            ${renderCharacterDetail(selectedCharacter, previousCharacter)}
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

function renderEntryShellCharacterShelf({ characters, selectedCharacterId }) {
  const cards = characters.map((character) =>
    renderCharacterCard({ character, selectedCharacterId })
  );
  const placeholderCount = Math.max(0, 8 - cards.length);
  const placeholders = Array.from(
    { length: placeholderCount },
    (_, index) => `
      <div class="c-main-ui-character-card c-main-ui-character-card--placeholder" aria-hidden="true">
        <div class="c-main-ui-character-card__portrait"></div>
        <div class="c-main-ui-character-card__placeholder-label">名册待补</div>
        <div class="c-main-ui-character-card__placeholder-index">卷 ${index + 5}</div>
      </div>
    `
  );

  return [...cards, ...placeholders].join("");
}

function renderCharacterCard({ character, selectedCharacterId }) {
  const isSelected = character.id === selectedCharacterId;
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
          ${escapeHtml(character.biography ?? "简介待补充")}
        </p>
      </div>
    </button>
  `;
}

function renderCharacterDetail(character, previousCharacter = null) {
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
            <p class="c-main-ui-character-detail__eyebrow">人物详情 / 当前已选</p>
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
              character.biography ?? "人物介绍待补全",
              previousCharacter?.biography ?? "",
              { block: true }
            )}
          </p>
        </div>
      </div>
    </aside>
  `;
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
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatStatValue(value) {
  return typeof value === "number" ? String(value) : "0";
}
