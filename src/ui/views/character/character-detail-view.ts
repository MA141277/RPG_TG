import type { CharacterDefinition, SkillKey } from "../../../domain/character";
import type {
  CharacterDetailScreenLayout,
  LayoutEditorState,
  UiLayoutBackground,
  UiLayoutComponent,
  UiLayoutElement,
} from "../../../domain/ui-layout";
import { resolveCharacterPortraitImageUrl } from "../../portrait-assets";

const skillIconModules = import.meta.glob<string>(
  "../../../../ui/yuansu/具体面板ui/skill font/*.png",
  { eager: true, query: "?url", import: "default" }
);

type CharacterDetailSkill = {
  key: SkillKey;
  label: string;
  assetName: string;
};

const DETAIL_SKILLS: CharacterDetailSkill[] = [
  { key: "ashigaru", label: "步战", assetName: "buzhan" },
  { key: "horse", label: "骑战", assetName: "qizhan" },
  { key: "navy", label: "水战", assetName: "shuizhan" },
  { key: "teppo", label: "火器", assetName: "huoqi" },
  { key: "military", label: "兵法", assetName: "bingfa" },
  { key: "construction", label: "营造", assetName: "yingzao" },
  { key: "development", label: "屯田", assetName: "tuntian" },
  { key: "arithmetic", label: "算术", assetName: "suanshu" },
  { key: "rhetoric", label: "辩才", assetName: "biancai" },
  { key: "ninjutsu", label: "情报", assetName: "qingbao" },
  { key: "etiquette", label: "礼制", assetName: "lizhi" },
  { key: "tea", label: "文采", assetName: "wencai" },
  { key: "martial", label: "招募", assetName: "zhaomu" },
  { key: "medicine", label: "医术", assetName: "yishu" },
];

const STAT_LABELS = {
  leadership: "统率",
  martial: "武力",
  politics: "政务",
  intelligence: "智谋",
  charm: "魅力",
} as const;

type CharacterDetailViewOptions = {
  cityName?: string;
  clanName?: string;
  houseName?: string;
  lordName?: string;
  stipendText?: string;
  schoolName?: string;
  masterName?: string;
  weaponName?: string;
  armorName?: string;
  notoriety?: number;
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

function getSkillIconUrl(assetName: string, level: number): string {
  const fileNameCandidates =
    level <= 1
      ? [`${assetName}.png`]
      : [`${assetName} (${level}).png`, `${assetName}（${level}）.png`];
  const matchedEntry = Object.entries(skillIconModules).find(([path]) =>
    fileNameCandidates.some((fileName) => path.endsWith(`/${fileName}`))
  );

  return (
    matchedEntry?.[1] ??
    Object.entries(skillIconModules).find(([path]) =>
      path.endsWith(`/${assetName}.png`)
    )?.[1] ??
    ""
  );
}

function renderSkillIconRow(
  skill: CharacterDetailSkill,
  skills: Record<SkillKey, number>
): string {
  const filledCount = Math.min(Math.max(Math.floor(skills[skill.key] ?? 0), 0), 4);
  const icons = Array.from({ length: 4 }, (_, index) => {
    const slotLevel = index + 2;
    const iconLevel = index < filledCount ? slotLevel : 1;
    const iconUrl = getSkillIconUrl(skill.assetName, iconLevel);

    return `
      <img
        class="c-character-detail__skill-icon"
        src="${iconUrl}"
        alt="${skill.label}${index + 1}"
        title="${skill.label} ${index < filledCount ? `${slotLevel}级` : "未点亮"}"
      >
    `;
  }).join("");

  return `
    <li class="c-character-detail__skill-item">
      <span class="c-character-detail__skill-name">${skill.label}</span>
      <span class="c-character-detail__skill-icons">${icons}</span>
    </li>
  `;
}

export function renderCharacterDetailView(
  character: CharacterDefinition,
  options: CharacterDetailViewOptions = {}
): string {
  const skills = character.skills ?? {
    ashigaru: 0,
    horse: 0,
    teppo: 0,
    navy: 0,
    archery: 0,
    martial: 0,
    military: 0,
    ninjutsu: 0,
    construction: 0,
    development: 0,
    mining: 0,
    arithmetic: 0,
    etiquette: 0,
    rhetoric: 0,
    tea: 0,
    medicine: 0,
  };
  const leadership = character.stats.leadership;
  const martial = character.stats.martial;
  const politics = character.stats.politics;
  const intelligence = character.stats.intelligence;
  const charm = character.stats.charm;
  const notoriety = options.notoriety ?? 0;
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
              ${character.birthYear}～${character.deathYear ?? "在世"}
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
                <span class="c-character-detail__label">所属流派</span>
                <strong class="c-character-detail__info-span">${options.schoolName ?? "无"}</strong>
              </div>
              <div class="c-character-detail__info-row">
                <span class="c-character-detail__label">武艺师傅</span>
                <strong class="c-character-detail__info-span">${options.masterName ?? "无"}</strong>
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
            <div ${renderElementLayoutAttributes(options, {
              ...characterDetailLiveBindings.abilityInfoContent,
              className: "c-character-detail__ability-grid",
            })}>
              ${renderElementResizeHandle(options, "character-detail-ability-info", "content")}
              <div class="c-character-detail__stat-row">
                <span class="c-character-detail__label">${STAT_LABELS.leadership}</span>
                ${renderMeter(leadership)}
                <strong>${leadership}</strong>
              </div>
              <div class="c-character-detail__stat-row">
                <span class="c-character-detail__label">${STAT_LABELS.martial}</span>
                ${renderMeter(martial)}
                <strong>${martial}</strong>
              </div>
              <div class="c-character-detail__stat-row">
                <span class="c-character-detail__label">${STAT_LABELS.politics}</span>
                ${renderMeter(politics)}
                <strong>${politics}</strong>
              </div>
              <div class="c-character-detail__stat-row">
                <span class="c-character-detail__label">${STAT_LABELS.intelligence}</span>
                ${renderMeter(intelligence)}
                <strong>${intelligence}</strong>
              </div>
              <div class="c-character-detail__stat-row">
                <span class="c-character-detail__label">${STAT_LABELS.charm}</span>
                ${renderMeter(charm)}
                <strong>${charm}</strong>
              </div>
              <div class="c-character-detail__stat-row">
                <span class="c-character-detail__label">名声</span>
                ${renderMeter(character.stats.fame)}
                <strong>${character.stats.fame}</strong>
              </div>
              <div class="c-character-detail__stat-row">
                <span class="c-character-detail__label">恶名</span>
                ${renderMeter(notoriety, "c-character-detail__meter-fill--dark")}
                <strong>${notoriety}</strong>
              </div>
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
              ${DETAIL_SKILLS.map((skill) => renderSkillIconRow(skill, skills)).join("")}
            </ul>
          </div>

          <div ${renderComponentLayoutAttributes(options, {
            ...characterDetailLiveBindings.actions,
            className: "c-character-detail__actions",
          })}>
            ${renderComponentResizeHandle(options, "character-detail-actions")}
          </div>
          <button ${renderComponentLayoutAttributes(options, {
            ...characterDetailLiveBindings.cardButton,
            className: "c-character-detail__action-button c-character-detail__action-button--card",
          })} type="button" data-action="open-cards">
            卡片
            ${renderComponentResizeHandle(options, "character-detail-card-button")}
          </button>
          <button ${renderComponentLayoutAttributes(options, {
            ...characterDetailLiveBindings.valuablesButton,
            className: "c-character-detail__action-button c-character-detail__action-button--item",
          })} type="button" data-action="open-valuables">
            贵重品
            ${renderComponentResizeHandle(options, "character-detail-valuables-button")}
          </button>
          <button ${renderComponentLayoutAttributes(options, {
            ...characterDetailLiveBindings.backButton,
            className: "c-character-detail__action-button c-character-detail__action-button--back",
          })} type="button" data-action="close-character-detail">
            返回
            ${renderComponentResizeHandle(options, "character-detail-back-button")}
          </button>
        </div>
      </div>
    </section>
  `;
}
