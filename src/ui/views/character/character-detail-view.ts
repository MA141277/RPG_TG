import type { CharacterDefinition } from "../../../domain/character";
import {
  formatPlayableSkillLevel,
  getPlayableSkillLevel,
  PLAYABLE_SKILL_DEFINITIONS,
} from "../../../domain/playable-skill";
import type {
  CharacterDetailScreenLayout,
  LayoutEditorState,
  UiLayoutBackground,
  UiLayoutComponent,
  UiLayoutElement,
} from "../../../domain/ui-layout";
import { resolveCharacterPortraitImageUrl } from "../../portrait-assets";

type CharacterDetailAbilityKey =
  | "leadership"
  | "martial"
  | "strength"
  | "physique"
  | "agility"
  | "intelligence"
  | "adaptability"
  | "judgment"
  | "awareness"
  | "politics"
  | "governance"
  | "livelihood"
  | "finance"
  | "charm"
  | "presence"
  | "learning"
  | "eloquence";

type CharacterDetailAbilityGroup = {
  label: string;
  key: CharacterDetailAbilityKey;
  substats: Array<{
    label: string;
    key: CharacterDetailAbilityKey;
  }>;
};

const ABILITY_SUMMARY_ROWS = [
  { label: "统率", key: "leadership" },
  { label: "武力", key: "martial" },
  { label: "政务", key: "politics" },
  { label: "智谋", key: "intelligence" },
  { label: "魅力", key: "charm" },
] as const;

const ABILITY_GROUPS: CharacterDetailAbilityGroup[] = [
  {
    label: "武力",
    key: "martial",
    substats: [
      { label: "力量", key: "strength" },
      { label: "体魄", key: "physique" },
      { label: "身法", key: "agility" },
    ],
  },
  {
    label: "智谋",
    key: "intelligence",
    substats: [
      { label: "机变", key: "adaptability" },
      { label: "谋断", key: "judgment" },
      { label: "察势", key: "awareness" },
    ],
  },
  {
    label: "政务",
    key: "politics",
    substats: [
      { label: "吏治", key: "governance" },
      { label: "民生", key: "livelihood" },
      { label: "度支", key: "finance" },
    ],
  },
  {
    label: "魅力",
    key: "charm",
    substats: [
      { label: "气象", key: "presence" },
      { label: "学问", key: "learning" },
      { label: "辩才", key: "eloquence" },
    ],
  },
];

type CharacterDetailViewOptions = {
  cityName?: string;
  clanName?: string;
  houseName?: string;
  lordName?: string;
  stipendText?: string;
  accessoryName?: string;
  mountName?: string;
  weaponName?: string;
  armorName?: string;
  notoriety?: number;
  heroicFame?: number;
  abilityDetailOpen?: boolean;
  abilityValues?: Partial<Record<CharacterDetailAbilityKey, number>>;
  layout?: CharacterDetailScreenLayout;
  layoutEditor?: LayoutEditorState;
};

type CharacterDetailLiveBinding = {
  componentId: string;
  offsetComponentId?: string;
  className?: string;
};

type CharacterDetailLiveElementBinding = CharacterDetailLiveBinding & {
  elementId: string;
};

const characterDetailLiveBindings = {
  canvas: { componentId: "character-detail-canvas" },
  namePlaque: { componentId: "character-detail-name-plaque" },
  name: {
    componentId: "character-detail-name-plaque",
    elementId: "name",
  },
  portraitArea: { componentId: "character-detail-portrait-area" },
  biography: { componentId: "character-detail-biography" },
  lifespan: {
    componentId: "character-detail-biography",
    elementId: "lifespan",
  },
  bio: {
    componentId: "character-detail-biography",
    elementId: "bio",
  },
  basicInfo: { componentId: "character-detail-basic-info" },
  basicInfoTitle: {
    componentId: "character-detail-basic-info",
    elementId: "title",
  },
  basicInfoContent: {
    componentId: "character-detail-basic-info",
    elementId: "content",
  },
  abilityInfo: { componentId: "character-detail-ability-info" },
  abilityInfoTitle: {
    componentId: "character-detail-ability-info",
    elementId: "title",
  },
  abilityInfoContent: {
    componentId: "character-detail-ability-info",
    elementId: "content",
  },
  skillInfo: { componentId: "character-detail-skill-info" },
  skillInfoTitle: {
    componentId: "character-detail-skill-info",
    elementId: "title",
  },
  skillInfoContent: {
    componentId: "character-detail-skill-info",
    elementId: "content",
  },
  actions: { componentId: "character-detail-actions" },
  cardButton: { componentId: "character-detail-card-button" },
  valuablesButton: { componentId: "character-detail-valuables-button" },
  backButton: { componentId: "character-detail-back-button" },
} as const;

function getLayoutComponent(
  layout: CharacterDetailScreenLayout | undefined,
  componentId: string
): UiLayoutComponent | null {
  return layout?.components.find((component) => component.id === componentId) ?? null;
}

function getLayoutElement(
  component: UiLayoutComponent | null,
  elementId: string
): UiLayoutElement | null {
  return component?.elements.find((element) => element.id === elementId) ?? null;
}

function renderBackgroundStyle(background: UiLayoutBackground | null): string {
  if (background == null) {
    return "";
  }

  if (background.mode === "nine-slice") {
    return [
      "border-style:solid",
      `border-width:${background.slice.top}px ${background.slice.right}px ${background.slice.bottom}px ${background.slice.left}px`,
      `border-image-source:url('${background.imageUrl}')`,
      `border-image-slice:${background.slice.top} ${background.slice.right} ${background.slice.bottom} ${background.slice.left} fill`,
      `border-image-width:${background.slice.top} ${background.slice.right} ${background.slice.bottom} ${background.slice.left}`,
    ].join(";");
  }

  const backgroundSize =
    background.mode === "cover"
      ? "cover"
      : background.mode === "contain"
        ? "contain"
        : "100% 100%";

  return [
    `background-image:url('${background.imageUrl}')`,
    "background-position:center",
    "background-repeat:no-repeat",
    `background-size:${backgroundSize}`,
  ].join(";");
}

function renderLayoutStyle(
  component: UiLayoutComponent,
  offsetComponent: UiLayoutComponent | null
): string {
  const offsetX = offsetComponent?.rect.x ?? 0;
  const offsetY = offsetComponent?.rect.y ?? 0;
  const style = [
    `left:${component.rect.x - offsetX}px`,
    `top:${component.rect.y - offsetY}px`,
    `width:${component.rect.width}px`,
    `height:${component.rect.height}px`,
  ];
  const backgroundStyle = renderBackgroundStyle(component.background);

  if (backgroundStyle.length > 0) {
    style.push(backgroundStyle);
  }

  return style.join(";");
}

function isLayoutEditorEnabled(
  layout: CharacterDetailScreenLayout | undefined,
  layoutEditor: LayoutEditorState | undefined
): boolean {
  return (
    layout != null &&
    layoutEditor?.isOpen === true &&
    layoutEditor.selectedTargetId === layout.id
  );
}

function renderComponentLayoutAttributes(
  options: CharacterDetailViewOptions,
  binding: CharacterDetailLiveBinding
): string {
  const component = getLayoutComponent(options.layout, binding.componentId);
  if (component == null) {
    return binding.className == null ? "" : ` class="${binding.className}"`;
  }

  const offsetComponent =
    binding.offsetComponentId == null
      ? null
      : getLayoutComponent(options.layout, binding.offsetComponentId);
  const isEditorEnabled = isLayoutEditorEnabled(options.layout, options.layoutEditor);
  const classNames = [
    ...(binding.className == null ? [] : binding.className.split(" ")),
    "c-main-ui-layout-component",
  ];

  if (isEditorEnabled) {
    classNames.push("is-layout-editable");
  }

  if (
    isEditorEnabled &&
    options.layoutEditor?.selectedComponentId === binding.componentId &&
    options.layoutEditor.selectedElementId == null
  ) {
    classNames.push("is-selected-layout-component");
  }

  const interactiveAttributes = isEditorEnabled
    ? ` data-layout-component-handle="${binding.componentId}" data-layout-component-select="${binding.componentId}" data-layout-live-label="${component.label}"`
    : "";

  return ` class="${classNames.join(" ")}" style="${renderLayoutStyle(component, offsetComponent)}"${interactiveAttributes}`;
}

function renderElementLayoutAttributes(
  options: CharacterDetailViewOptions,
  binding: CharacterDetailLiveElementBinding
): string {
  const component = getLayoutComponent(options.layout, binding.componentId);
  const element = getLayoutElement(component, binding.elementId);
  if (component == null || element == null) {
    return binding.className == null ? "" : ` class="${binding.className}"`;
  }

  const isEditorEnabled = isLayoutEditorEnabled(options.layout, options.layoutEditor);
  const classNames = [
    ...(binding.className == null ? [] : binding.className.split(" ")),
    "c-main-ui-layout-element",
  ];

  if (isEditorEnabled) {
    classNames.push("is-layout-editable");
  }

  if (
    isEditorEnabled &&
    options.layoutEditor?.selectedComponentId === binding.componentId &&
    options.layoutEditor.selectedElementId === binding.elementId
  ) {
    classNames.push("is-selected-layout-element");
  }

  const value = `${binding.componentId}:${binding.elementId}`;
  const interactiveAttributes = isEditorEnabled
    ? ` data-layout-element-handle="${value}" data-layout-element-select="${value}" data-layout-live-label="${element.label}"`
    : "";

  return ` class="${classNames.join(" ")}" style="left:${element.rect.x}px;top:${element.rect.y}px;width:${element.rect.width}px;height:${element.rect.height}px"${interactiveAttributes}`;
}

function renderComponentResizeHandle(
  options: CharacterDetailViewOptions,
  componentId: string
): string {
  return isLayoutEditorEnabled(options.layout, options.layoutEditor)
    ? `<span class="c-main-ui-layout-resize-handle" data-layout-component-resize="${componentId}" data-layout-resize-axis="xy" aria-hidden="true"></span>`
    : "";
}

function renderElementResizeHandle(
  options: CharacterDetailViewOptions,
  componentId: string,
  elementId: string
): string {
  return isLayoutEditorEnabled(options.layout, options.layoutEditor)
    ? `<span class="c-main-ui-layout-element-resize-handle" data-layout-element-resize="${componentId}:${elementId}" data-layout-resize-axis="xy" aria-hidden="true"></span>`
    : "";
}

function renderMeter(value: number, modifierClassName = ""): string {
  const meterClassName =
    modifierClassName.length > 0
      ? `c-character-detail__meter-fill ${modifierClassName}`
      : "c-character-detail__meter-fill";

  return `
    <div class="c-character-detail__meter">
      <span class="${meterClassName}" style="width: ${Math.min(Math.max(value, 0), 100)}%"></span>
    </div>
  `;
}

function getAbilityValue(
  character: CharacterDefinition,
  options: CharacterDetailViewOptions,
  abilityKey: CharacterDetailAbilityKey
): number {
  const overrideValue = options.abilityValues?.[abilityKey];
  if (typeof overrideValue === "number") {
    return overrideValue;
  }

  switch (abilityKey) {
    case "leadership":
      return character.stats.leadership;
    case "martial":
    case "strength":
    case "physique":
    case "agility":
      return character.stats.martial;
    case "intelligence":
    case "adaptability":
    case "judgment":
    case "awareness":
      return character.stats.intelligence;
    case "politics":
    case "governance":
    case "livelihood":
    case "finance":
      return character.stats.politics;
    case "charm":
    case "presence":
    case "learning":
    case "eloquence":
      return character.stats.charm;
  }
}

function renderAbilitySummaryRow(
  character: CharacterDefinition,
  options: CharacterDetailViewOptions,
  row: (typeof ABILITY_SUMMARY_ROWS)[number]
): string {
  const value = getAbilityValue(character, options, row.key);

  return `
    <div class="c-character-detail__stat-row c-character-detail__stat-row--primary">
      <span class="c-character-detail__label">${row.label}</span>
      ${renderMeter(value)}
      <strong>${value}</strong>
    </div>
  `;
}

function renderAbilityDetailGroup(
  character: CharacterDefinition,
  options: CharacterDetailViewOptions,
  group: CharacterDetailAbilityGroup
): string {
  const groupValue = getAbilityValue(character, options, group.key);

  return `
    <section class="c-character-detail__ability-detail-group">
      <div class="c-character-detail__stat-row c-character-detail__stat-row--primary">
        <span class="c-character-detail__label">${group.label}</span>
        ${renderMeter(groupValue)}
        <strong>${groupValue}</strong>
      </div>
      <div class="c-character-detail__ability-detail-list">
        ${group.substats
          .map((substat) => {
            const value = getAbilityValue(character, options, substat.key);
            return `
              <div class="c-character-detail__stat-row">
                <span class="c-character-detail__label">${substat.label}</span>
                ${renderMeter(value, "c-character-detail__meter-fill--dark")}
                <strong>${value}</strong>
              </div>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
}

function resolveAbilityDetailScreenStyle(
  options: CharacterDetailViewOptions
): string {
  const basicInfoComponent = getLayoutComponent(
    options.layout,
    characterDetailLiveBindings.basicInfo.componentId
  );
  const abilityInfoComponent = getLayoutComponent(
    options.layout,
    characterDetailLiveBindings.abilityInfo.componentId
  );

  if (basicInfoComponent == null || abilityInfoComponent == null) {
    return "";
  }

  const panelLiftPixels = 20;
  const left = Math.min(basicInfoComponent.rect.x, abilityInfoComponent.rect.x);
  const top =
    Math.min(basicInfoComponent.rect.y, abilityInfoComponent.rect.y) - panelLiftPixels;
  const right = Math.max(
    basicInfoComponent.rect.x + basicInfoComponent.rect.width,
    abilityInfoComponent.rect.x + abilityInfoComponent.rect.width
  );
  const bottom = Math.max(
    basicInfoComponent.rect.y + basicInfoComponent.rect.height,
    abilityInfoComponent.rect.y + abilityInfoComponent.rect.height
  );
  const style = [
    `left:${left}px`,
    `top:${top}px`,
    `width:${right - left}px`,
    `height:${bottom - top}px`,
  ];

  return ` style="${style.join(";")}"`;
}

function renderAbilityDetailScreen(
  character: CharacterDefinition,
  options: CharacterDetailViewOptions,
  goodwill: number,
  notoriety: number,
  heroicFame: number
): string {
  if (options.abilityDetailOpen !== true) {
    return "";
  }

  return `
    <section
      class="c-character-detail__ability-detail-screen"${resolveAbilityDetailScreenStyle(options)}
    >
          <h3 class="c-character-detail__ability-detail-title">能力详情</h3>
          <button
            class="c-character-detail__detail-toggle c-character-detail__detail-toggle--detail-screen"
            type="button"
            data-action="close-character-ability-detail"
          >
            关闭
          </button>
      <div class="c-character-detail__ability-detail-screen-grid">
          ${ABILITY_GROUPS.map((group) =>
            renderAbilityDetailGroup(character, options, group)
          ).join("")}
          <section class="c-character-detail__ability-detail-group c-character-detail__ability-detail-group--reputation">
            <div class="c-character-detail__stat-row c-character-detail__stat-row--primary">
              <span class="c-character-detail__label">名声</span>
              ${renderMeter(goodwill)}
              <strong>${goodwill}</strong>
            </div>
            <div class="c-character-detail__ability-detail-list">
              <div class="c-character-detail__stat-row">
                <span class="c-character-detail__label">善名</span>
                ${renderMeter(goodwill)}
                <strong>${goodwill}</strong>
              </div>
              <div class="c-character-detail__stat-row">
                <span class="c-character-detail__label">恶名</span>
                ${renderMeter(notoriety, "c-character-detail__meter-fill--dark")}
                <strong>${notoriety}</strong>
              </div>
              <div class="c-character-detail__stat-row">
                <span class="c-character-detail__label">侠名</span>
                ${renderMeter(heroicFame)}
                <strong>${heroicFame}</strong>
              </div>
            </div>
            <p class="c-character-detail__substat-line">
              善名 ${goodwill} / 恶名 ${notoriety} / 侠名 ${heroicFame}
            </p>
          </section>
        </div>
    </section>
  `;
}

export function renderCharacterDetailView(
  character: CharacterDefinition,
  options: CharacterDetailViewOptions = {}
): string {
  const goodwill = character.stats.fame;
  const notoriety = options.notoriety ?? 0;
  const heroicFame = options.heroicFame ?? 0;
  const learnedPlayableSkills = PLAYABLE_SKILL_DEFINITIONS.map((definition) => ({
    ...definition,
    level: getPlayableSkillLevel(character, definition.id),
  })).filter((definition) => definition.level > 0);
  const portraitImageUrl = resolveCharacterPortraitImageUrl(character);

  return `
    <section class="view-character-detail">
      <div ${renderComponentLayoutAttributes(options, {
        ...characterDetailLiveBindings.canvas,
        className: "c-character-detail",
      })}>
        ${renderComponentResizeHandle(options, "character-detail-canvas")}
        <div class="c-character-detail__left-column">
          <div ${renderComponentLayoutAttributes(options, {
            ...characterDetailLiveBindings.namePlaque,
            className: "c-character-detail__name-plaque",
          })}>
            ${renderComponentResizeHandle(options, "character-detail-name-plaque")}
            <span ${renderElementLayoutAttributes(options, {
              ...characterDetailLiveBindings.name,
              className: "c-character-detail__portrait-label",
            })}>
              ${character.name}
              ${renderElementResizeHandle(options, "character-detail-name-plaque", "name")}
            </span>
          </div>
          <div ${renderComponentLayoutAttributes(options, {
            ...characterDetailLiveBindings.portraitArea,
            className: "c-character-detail__portrait",
          })}>
            ${
              portraitImageUrl == null
                ? ""
                : `<img class="c-character-detail__portrait-image" src="${portraitImageUrl}" alt="${character.name}立绘">`
            }
            ${renderComponentResizeHandle(options, "character-detail-portrait-area")}
          </div>
          <div ${renderComponentLayoutAttributes(options, {
            ...characterDetailLiveBindings.biography,
            className: "c-character-detail__biography",
          })}>
            ${renderComponentResizeHandle(options, "character-detail-biography")}
            <div ${renderElementLayoutAttributes(options, {
              ...characterDetailLiveBindings.lifespan,
              className: "c-character-detail__lifespan",
            })}>
              ${character.birthYear}~${character.deathYear ?? "在世"}
              ${renderElementResizeHandle(options, "character-detail-biography", "lifespan")}
            </div>
            <p ${renderElementLayoutAttributes(options, {
              ...characterDetailLiveBindings.bio,
              className: "c-character-detail__bio",
            })}>
              ${character.biography ?? "暂无人物简介。"}
              ${renderElementResizeHandle(options, "character-detail-biography", "bio")}
            </p>
          </div>
        </div>

        <div class="c-character-detail__right-column">
          <div ${renderComponentLayoutAttributes(options, {
            ...characterDetailLiveBindings.basicInfo,
            className: "c-character-detail__info-panel",
          })}>
            ${renderComponentResizeHandle(options, "character-detail-basic-info")}
            <h2 ${renderElementLayoutAttributes(options, {
              ...characterDetailLiveBindings.basicInfoTitle,
              className: "c-character-detail__panel-title",
            })}>
              基本情报
              ${renderElementResizeHandle(options, "character-detail-basic-info", "title")}
            </h2>
            <div ${renderElementLayoutAttributes(options, {
              ...characterDetailLiveBindings.basicInfoContent,
              className: "c-character-detail__info-grid",
            })}>
              ${renderElementResizeHandle(options, "character-detail-basic-info", "content")}
              <div class="c-character-detail__info-row">
                <span class="c-character-detail__label">所属</span>
                <strong>${options.clanName ?? "无"}</strong>
                <span class="c-character-detail__label">据点</span>
                <strong>${options.cityName ?? character.cityId}</strong>
              </div>
              <div class="c-character-detail__info-row">
                <span class="c-character-detail__label">上司</span>
                <strong>${options.lordName ?? options.houseName ?? "无"}</strong>
                <span class="c-character-detail__label">俸禄</span>
                <strong>${options.stipendText ?? `${character.stats.gold}贯`}</strong>
              </div>
              <div class="c-character-detail__info-row">
                <span class="c-character-detail__label">饰品</span>
                <strong class="c-character-detail__info-span">${options.accessoryName ?? "无"}</strong>
              </div>
              <div class="c-character-detail__info-row">
                <span class="c-character-detail__label">坐骑</span>
                <strong class="c-character-detail__info-span">${options.mountName ?? "无"}</strong>
              </div>
              <div class="c-character-detail__info-row">
                <span class="c-character-detail__label">装备武器</span>
                <strong class="c-character-detail__info-span">${options.weaponName ?? "无"}</strong>
              </div>
              <div class="c-character-detail__info-row">
                <span class="c-character-detail__label">装备防具</span>
                <strong class="c-character-detail__info-span">${options.armorName ?? "无"}</strong>
              </div>
            </div>
          </div>

          <div ${renderComponentLayoutAttributes(options, {
            ...characterDetailLiveBindings.abilityInfo,
            className: "c-character-detail__ability-panel",
          })}>
            ${renderComponentResizeHandle(options, "character-detail-ability-info")}
            <h2 ${renderElementLayoutAttributes(options, {
              ...characterDetailLiveBindings.abilityInfoTitle,
              className: "c-character-detail__panel-title",
            })}>
              能力情报
              ${renderElementResizeHandle(options, "character-detail-ability-info", "title")}
            </h2>
            <button
              class="c-character-detail__detail-toggle"
              type="button"
              data-action="${options.abilityDetailOpen === true ? "close-character-ability-detail" : "open-character-ability-detail"}"
            >
              详情
            </button>
            <div ${renderElementLayoutAttributes(options, {
              ...characterDetailLiveBindings.abilityInfoContent,
              className: "c-character-detail__ability-grid",
            })}>
              ${renderElementResizeHandle(options, "character-detail-ability-info", "content")}
              ${ABILITY_SUMMARY_ROWS.map((row) =>
                renderAbilitySummaryRow(character, options, row)
              ).join("")}
            </div>
          </div>

          <div ${renderComponentLayoutAttributes(options, {
            ...characterDetailLiveBindings.skillInfo,
            className: "c-character-detail__skill-panel",
          })}>
            ${renderComponentResizeHandle(options, "character-detail-skill-info")}
            <h2 ${renderElementLayoutAttributes(options, {
              ...characterDetailLiveBindings.skillInfoTitle,
              className: "c-character-detail__panel-title",
            })}>
              技能情报
              ${renderElementResizeHandle(options, "character-detail-skill-info", "title")}
            </h2>
            <ul ${renderElementLayoutAttributes(options, {
              ...characterDetailLiveBindings.skillInfoContent,
              className: "c-character-detail__skills-grid",
            })}>
              ${renderElementResizeHandle(options, "character-detail-skill-info", "content")}
              ${learnedPlayableSkills
                .map(
                  (skill) => `
                    <li class="c-character-detail__skill-item">
                      <span class="c-character-detail__skill-name">${skill.label}</span>
                      <span class="c-character-detail__skill-level">${formatPlayableSkillLevel(skill.level)}</span>
                    </li>
                  `
                )
                .join("")}
            </ul>
          </div>

          ${renderAbilityDetailScreen(
            character,
            options,
            goodwill,
            notoriety,
            heroicFame
          )}

          <div ${renderComponentLayoutAttributes(options, {
            ...characterDetailLiveBindings.actions,
            className: "c-character-detail__actions",
          })}>
            ${renderComponentResizeHandle(options, "character-detail-actions")}
          </div>
          <button ${renderComponentLayoutAttributes(options, {
            ...characterDetailLiveBindings.cardButton,
            className: "c-character-detail__action-button c-character-detail__action-button--card",
          })} type="button" data-action="open-cards" data-button-sound="light">
            藏品
            ${renderComponentResizeHandle(options, "character-detail-card-button")}
          </button>
          <button ${renderComponentLayoutAttributes(options, {
            ...characterDetailLiveBindings.valuablesButton,
            className: "c-character-detail__action-button c-character-detail__action-button--item",
          })} type="button" data-action="open-backpack" data-button-sound="heavy">
            背包
            ${renderComponentResizeHandle(options, "character-detail-valuables-button")}
          </button>
          <button ${renderComponentLayoutAttributes(options, {
            ...characterDetailLiveBindings.backButton,
            className: "c-character-detail__action-button c-character-detail__action-button--back",
          })} type="button" data-action="close-character-detail" data-button-sound="light">
            返回
            ${renderComponentResizeHandle(options, "character-detail-back-button")}
          </button>
        </div>
      </div>
    </section>
  `;
}
