import type { CharacterDefinition } from "../../../domain/character";
import type { CharacterManager } from "../../../application/character/character-manager";
import type { BuildingModuleStage } from "../../../application/building/building-module-entry";
import type {
  BuildingArrangementDefinition,
  BuildingLayoutDefinition,
  BuildingLayoutNodeDefinition,
} from "../../../domain/building-arrangement";
import type { BuildingContainerViewModel } from "../../../application/presenter/presenter-output";
import { resolveBuildingLayoutDefinition } from "../../../application/building/building-layout-templates";
import { resolveLocationBackgroundImageUrl } from "../../location-backgrounds";
import {
  resolveCharacterAvatarImageUrl,
  resolveCharacterPortraitImageUrl,
} from "../../portrait-assets";

type BuildingStage = Extract<BuildingModuleStage, { type: "building" }>;
type SeatContainerViewModel = Extract<
  BuildingContainerViewModel,
  { type: "character-seats" }
>;
type ActionContainerViewModel = Extract<
  BuildingContainerViewModel,
  { type: "action-menu" }
>;
type BuildingActionViewModel = ActionContainerViewModel["actions"][number];

type BuildingActorViewModel = {
  characterId: string;
  name: string;
  title?: string | undefined;
  avatarImageUrl: string | null;
  portraitImageUrl: string | null;
};

type RenderContext = {
  stage: BuildingStage;
  charactersById: Map<string, CharacterDefinition>;
  layout: BuildingLayoutDefinition;
  consumedContainerIds: Set<string>;
};

const DEFAULT_SECTION_CLASS_NAMES = [
  "view-house",
  "view-house--arrangement",
  "view-house-building-shell",
];

export function renderBuildingModuleView(input: {
  stage: BuildingModuleStage;
  characterDefinitions: CharacterDefinition[];
  characterManager: CharacterManager;
}): string {
  void input.characterManager;

  if (input.stage.type !== "building") {
    return "";
  }

  const layout = resolveLayoutDefinition(input.stage.arrangement);
  const sectionClassNames = resolveSectionClassNames(layout);
  const backgroundId =
    input.stage.arrangement.backgroundId ?? input.stage.activeHouse.backgroundId;
  const backgroundStyle = createBuildingBackgroundStyle(
    resolveLocationBackgroundImageUrl(backgroundId)
  );
  const context: RenderContext = {
    stage: input.stage,
    charactersById: new Map(
      input.characterDefinitions.map((character) => [character.id, character])
    ),
    layout,
    consumedContainerIds: new Set<string>(),
  };

  return `
    <section
      class="${sectionClassNames.join(" ")}"
      style="${backgroundStyle}"
      data-building-layout-template-id="${layout.templateId}"
    >
      ${(context.layout.nodes ?? []).map((node) => renderLayoutNode(context, node)).join("")}
    </section>
  `;
}

function resolveLayoutDefinition(
  arrangement: BuildingArrangementDefinition
): BuildingLayoutDefinition {
  return resolveBuildingLayoutDefinition(arrangement.layout);
}

function resolveSectionClassNames(layout: BuildingLayoutDefinition): string[] {
  const configuredClassNames =
    layout.shellClassNames?.filter((className) => className.trim().length > 0) ?? [];
  const templateClassNames = [
    "c-building-layout-template",
    `c-building-layout-template--${toCssClassToken(layout.templateId)}`,
  ];

  if (configuredClassNames.length === 0) {
    return [...DEFAULT_SECTION_CLASS_NAMES, ...templateClassNames];
  }

  return [
    ...new Set([
      ...DEFAULT_SECTION_CLASS_NAMES,
      ...templateClassNames,
      ...configuredClassNames,
    ]),
  ];
}

function createBuildingBackgroundStyle(backgroundImageUrl: string | null): string {
  if (backgroundImageUrl == null) {
    return "";
  }

  const cssUrl = `url('${backgroundImageUrl}')`;
  return [
    `background-image:${cssUrl}`,
    `--building-arrangement-bg-image:${cssUrl}`,
    `--building-shell-scene-bg:${cssUrl}`,
    `--grain-shop-scene-bg:${cssUrl}`,
  ].join(";");
}

function renderLayoutNode(
  context: RenderContext,
  node: BuildingLayoutNodeDefinition
): string {
  switch (node.kind) {
    case "header":
      return renderHeaderNode(context, node);
    case "description":
      return renderDescriptionNode(context, node);
    case "character-seats":
      return renderCharacterSeatsNode(context, node);
    case "action-menu":
      return renderActionMenuNode(context, node);
    case "leave-action":
      return renderLeaveActionNode(context, node);
    case "fallback-panels":
      return renderFallbackNode(context, node);
    default:
      return "";
  }
}

function renderHeaderNode(
  context: RenderContext,
  node: BuildingLayoutNodeDefinition
): string {
  const title =
    context.stage.arrangement.displayName ?? context.stage.activeHouse.name;
  const hasDedicatedLeaveNode = (context.layout.nodes ?? []).some(
    (layoutNode) => layoutNode.kind === "leave-action"
  );
  const backButtonLabel = context.stage.activeHouse.backAction?.label ?? "返回";

  return `
    <div ${createNodeAttributeString(node)} class="${resolveNodeClassName(node, "c-stage-header")}">
      <div>
        <p class="c-stage-header__eyebrow">建筑</p>
        <h1 class="c-stage-header__title">${title}</h1>
      </div>
      ${
        hasDedicatedLeaveNode
          ? ""
          : `<button class="c-button c-button--ghost" data-action="leave-house">${backButtonLabel}</button>`
      }
    </div>
  `;
}

function renderDescriptionNode(
  context: RenderContext,
  node: BuildingLayoutNodeDefinition
): string {
  if (context.stage.arrangement.description == null) {
    return "";
  }

  return `
    <div ${createNodeAttributeString(node)} class="${resolveNodeClassName(node, "c-house-interior__hero", "c-panel")}">
      <p class="c-house-interior__hero-text">${context.stage.arrangement.description}</p>
    </div>
  `;
}

function renderCharacterSeatsNode(
  context: RenderContext,
  node: BuildingLayoutNodeDefinition
): string {
  const container = selectSeatContainer(context.stage, node);
  if (container == null) {
    return "";
  }

  context.consumedContainerIds.add(container.id);
  const actors = selectNodeCharacters(context, container, node);
  if (actors.length === 0) {
    return "";
  }

  if (node.presentation === "meeting-grid") {
    return renderMeetingRoster(node, container.id, actors);
  }

  if (node.presentation === "idle-roster") {
    return renderIdleRoster(node, container.id, actors);
  }

  if (node.presentation === "portrait-focus") {
    return renderPortraitFocus(node, container.id, actors[0] ?? null);
  }

  return `
    <section
      ${createNodeAttributeString(node)}
      class="${resolveNodeClassName(node, "c-house-roster")}"
      data-building-container-id="${container.id}"
    >
      ${container.title == null ? "" : `<h2>${container.title}</h2>`}
      ${actors
        .map(
          (actor) => `
            <article class="c-roster-card c-panel">
              <span class="c-roster-card__title">${actor.title ?? "在场人物"}</span>
              <strong class="c-roster-card__name">${actor.name}</strong>
            </article>
          `
        )
        .join("")}
    </section>
  `;
}

function renderActionMenuNode(
  context: RenderContext,
  node: BuildingLayoutNodeDefinition
): string {
  const container = selectActionContainer(context.stage, node);
  if (container == null) {
    return "";
  }

  context.consumedContainerIds.add(container.id);
  const actions = selectNodeActions(container, node);
  if (actions.length === 0) {
    return "";
  }

  if (node.presentation === "gold-center-nav") {
    return `
      <div ${createNodeAttributeString(node)} class="${resolveNodeClassName(node, "c-building-layout-action-dock", "c-building-layout-action-dock--open")}">
        <nav class="c-building-layout-actions" aria-label="${container.title ?? "建筑功能"}">
          ${actions
            .map((action) =>
              renderBuildingActionButton(
                context.stage.arrangement,
                container.id,
                action,
                "c-button c-building-skin-button c-building-skin-button--gold"
              )
            )
            .join("")}
        </nav>
      </div>
    `;
  }

  return `
    <section
      ${createNodeAttributeString(node)}
      class="${resolveNodeClassName(node, "c-house-roster")}"
      data-building-container-id="${container.id}"
    >
      ${container.title == null ? "" : `<h2>${container.title}</h2>`}
      ${actions
        .map((action) =>
          renderBuildingActionButton(
            context.stage.arrangement,
            container.id,
            action,
            "c-button"
          )
        )
        .join("")}
    </section>
  `;
}

function renderLeaveActionNode(
  context: RenderContext,
  node: BuildingLayoutNodeDefinition
): string {
  const container = selectActionContainer(context.stage, node);
  if (container == null) {
    return "";
  }

  context.consumedContainerIds.add(container.id);
  const action = selectNodeActions(container, node)[0] ?? null;
  if (action == null) {
    return "";
  }

  return `
    <div
      ${createNodeAttributeString(node)}
      class="${resolveNodeClassName(node)}"
      data-building-container-id="${container.id}"
    >
      ${renderBuildingActionButton(
        context.stage.arrangement,
        container.id,
        action,
        node.presentation === "gold-leave"
          ? "c-button c-building-skin-button c-building-skin-button--gold c-building-layout-leave"
          : "c-button"
      )}
    </div>
  `;
}

function renderFallbackNode(
  context: RenderContext,
  node: BuildingLayoutNodeDefinition
): string {
  return context.stage.containerViewModels
    .filter((container) => !context.consumedContainerIds.has(container.id))
    .map(
      (container) => `
        <section
          ${createNodeAttributeString(node)}
          class="${resolveNodeClassName(node, "c-panel")}"
          data-building-container-id="${container.id}"
        >
          ${container.title == null ? "" : `<h2>${container.title}</h2>`}
        </section>
      `
    )
    .join("");
}

function selectSeatContainer(
  stage: BuildingStage,
  node: BuildingLayoutNodeDefinition
): SeatContainerViewModel | null {
  return (
    stage.containerViewModels.find(
      (container): container is SeatContainerViewModel =>
        container.type === "character-seats" &&
        (node.sourceContainerId == null || container.id === node.sourceContainerId)
    ) ?? null
  );
}

function selectActionContainer(
  stage: BuildingStage,
  node: BuildingLayoutNodeDefinition
): ActionContainerViewModel | null {
  return (
    stage.containerViewModels.find(
      (container): container is ActionContainerViewModel =>
        container.type === "action-menu" &&
        (node.sourceContainerId == null || container.id === node.sourceContainerId)
    ) ?? null
  );
}

function selectNodeCharacters(
  context: RenderContext,
  container: SeatContainerViewModel,
  node: BuildingLayoutNodeDefinition
): BuildingActorViewModel[] {
  const primaryCharacter =
    (context.stage.arrangement.primaryNpcId == null
      ? null
      : container.characters.find(
          (character) => character.id === context.stage.arrangement.primaryNpcId
        )) ??
    container.characters[0] ??
    null;
  const secondaryCharacters =
    primaryCharacter == null
      ? container.characters
      : container.characters.filter(
          (character) => character.id !== primaryCharacter.id
        );

  if (node.characterFilter === "primary") {
    return primaryCharacter == null ? [] : [toActorViewModel(context, primaryCharacter)];
  }

  if (node.characterFilter === "secondary") {
    return secondaryCharacters.map((character) =>
      toActorViewModel(context, character)
    );
  }

  return (primaryCharacter == null
    ? container.characters
    : [primaryCharacter, ...secondaryCharacters]
  ).map((character) => toActorViewModel(context, character));
}

function selectNodeActions(
  container: ActionContainerViewModel,
  node: BuildingLayoutNodeDefinition
): BuildingActionViewModel[] {
  if (node.actionFilter === "leave-only") {
    return container.actions.filter(
      (action) => action.id === "leave" || action.eventId.endsWith(".leave")
    );
  }

  if (node.actionFilter === "non-leave") {
    return container.actions.filter(
      (action) => action.id !== "leave" && !action.eventId.endsWith(".leave")
    );
  }

  return container.actions;
}

function toActorViewModel(
  context: RenderContext,
  character: { id: string; name: string; title?: string | undefined }
): BuildingActorViewModel {
  const characterDefinition = context.charactersById.get(character.id) ?? null;

  return {
    characterId: character.id,
    name: character.name,
    ...(character.title == null ? {} : { title: character.title }),
    avatarImageUrl:
      characterDefinition == null
        ? null
        : resolveCharacterAvatarImageUrl(characterDefinition),
    portraitImageUrl:
      characterDefinition == null
        ? null
        : resolveCharacterPortraitImageUrl(characterDefinition),
  };
}

function renderMeetingRoster(
  node: BuildingLayoutNodeDefinition,
  containerId: string,
  actors: BuildingActorViewModel[]
): string {
  return `
    <section
      ${createNodeAttributeString(node)}
      class="${resolveNodeClassName(node, "c-building-layout-meeting")}"
      data-building-container-id="${containerId}"
      aria-label="建筑人物席"
    >
      ${actors
        .map(
          (actor) => `
            <article class="c-building-layout-seat">
              <div class="c-building-skin-avatar c-building-layout-seat__avatar" aria-hidden="true">
                ${
                  actor.avatarImageUrl == null
                    ? '<span class="c-building-skin-avatar__art"></span>'
                    : `<img class="c-building-skin-avatar__image" src="${actor.avatarImageUrl}" alt="">`
                }
              </div>
              <div class="c-building-layout-seat__nameplate">
                <span class="c-building-layout-seat__name">${actor.name}</span>
                ${
                  actor.title == null
                    ? ""
                    : `<span class="c-building-layout-seat__title">${actor.title}</span>`
                }
              </div>
            </article>
          `
        )
        .join("")}
    </section>
  `;
}

function renderIdleRoster(
  node: BuildingLayoutNodeDefinition,
  containerId: string,
  actors: BuildingActorViewModel[]
): string {
  return `
    <aside
      ${createNodeAttributeString(node)}
      class="${resolveNodeClassName(node, "c-building-layout-roster")}"
      data-building-container-id="${containerId}"
      aria-label="建筑人物"
    >
      ${actors
        .map(
          (actor) => `
            <div class="c-building-layout-roster__button" aria-label="${actor.name}">
              <div class="c-building-skin-avatar" aria-hidden="true">
                ${
                  actor.avatarImageUrl == null
                    ? '<span class="c-building-skin-avatar__art"></span>'
                    : `<img class="c-building-skin-avatar__image" src="${actor.avatarImageUrl}" alt="">`
                }
              </div>
              <p class="c-building-skin-avatar__name c-building-skin-nameplate c-building-skin-nameplate--small">
                ${actor.name}
              </p>
              ${
                actor.title == null
                  ? ""
                  : `<span class="c-building-layout-roster__title">${actor.title}</span>`
              }
            </div>
          `
        )
        .join("")}
    </aside>
  `;
}

function renderPortraitFocus(
  node: BuildingLayoutNodeDefinition,
  containerId: string,
  actor: BuildingActorViewModel | null
): string {
  if (actor == null) {
    return "";
  }

  return `
    <aside
      ${createNodeAttributeString(node)}
      class="${resolveNodeClassName(node, "c-building-layout-focus")}"
      data-building-container-id="${containerId}"
      aria-label="${actor.name}"
    >
      <div class="c-building-layout-focus__button" aria-label="${actor.name}">
        <div class="c-building-skin-portrait" aria-hidden="true">
          ${
            actor.portraitImageUrl == null
              ? '<span class="c-building-skin-portrait__art"></span>'
              : `<img class="c-building-skin-portrait__image" src="${actor.portraitImageUrl}" alt="">`
          }
        </div>
        <p class="c-building-skin-portrait__name c-building-skin-nameplate c-building-skin-nameplate--small">
          ${actor.name}
        </p>
        ${
          actor.title == null
            ? ""
            : `<span class="c-building-layout-roster__title">${actor.title}</span>`
        }
      </div>
    </aside>
  `;
}

function renderBuildingActionButton(
  arrangement: BuildingArrangementDefinition,
  containerId: string,
  action: BuildingActionViewModel,
  className: string
): string {
  return `
    <button
      class="${className}"
      data-action="building-container-item-action"
      data-building-arrangement-id="${arrangement.id}"
      data-building-container-id="${containerId}"
      data-building-container-action-id="${action.id}"
      data-building-container-event-id="${action.eventId}"
      ${action.isEnabled ? "" : "disabled"}
    >
      ${action.label}
    </button>
  `;
}

function createNodeAttributeString(node: BuildingLayoutNodeDefinition): string {
  const attributes: Array<[string, string]> = [
    ["data-building-layout-node-id", node.id],
    ["data-building-layout-region-id", node.regionId],
    ["data-layout-preview-selectable", node.previewSelectable === true ? "true" : ""],
    ["data-layout-preview-draggable", node.previewDraggable === true ? "true" : ""],
    ["data-layout-preview-drop-target", node.previewDropTarget === true ? "true" : ""],
    ["data-building-layout-click-action-id", node.clickActionId ?? ""],
  ].reduce<Array<[string, string]>>((result, entry) => {
    const name = entry[0] ?? "";
    const value = entry[1] ?? "";
    if (value.length > 0) {
      result.push([name, value]);
    }
    return result;
  }, []);

  return attributes.map(([name, value]) => `${name}="${value}"`).join(" ");
}

function resolvePresentationClassName(
  presentation: string | undefined,
  fallbackClassName: string
): string {
  const classNameByPresentation: Record<string, string> = {
    "meeting-grid": "c-building-layout-presentation--meeting-grid",
    "idle-roster": "c-building-layout-presentation--idle-roster",
    "portrait-focus": "c-building-layout-presentation--portrait-focus",
    "gold-center-nav": "c-building-layout-presentation--gold-center-nav",
    "gold-leave": "c-building-layout-presentation--gold-leave",
  };

  const configuredClassName =
    presentation == null ? "" : classNameByPresentation[presentation] ?? "";

  return [fallbackClassName, configuredClassName]
    .filter((className) => className.length > 0)
    .join(" ");
}

function resolveNodeClassName(
  node: BuildingLayoutNodeDefinition,
  ...classNames: string[]
): string {
  const semanticClassNames = [
    "c-building-layout-node",
    `c-building-layout-node--${toCssClassToken(node.kind)}`,
    `c-building-layout-region--${toCssClassToken(node.regionId)}`,
  ];
  const presentationClassName = resolvePresentationClassName(node.presentation, "");
  if (presentationClassName.length > 0) {
    semanticClassNames.push(presentationClassName);
    semanticClassNames.push(
      `c-building-layout-node-presentation--${toCssClassToken(node.presentation ?? "")}`
    );
  }

  return [...new Set([...classNames, ...semanticClassNames])]
    .filter((className) => className.length > 0)
    .join(" ");
}

function toCssClassToken(value: string): string {
  const normalized = value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return normalized.replace(/^-+|-+$/g, "") || "default";
}
