export type SharedDialogResultKind =
  | "confirm"
  | "cancel"
  | "close"
  | "action";

export type SharedDialogAction = {
  id: string;
  label: string;
  result: SharedDialogResultKind;
  className?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  attributes?: Record<string, string>;
};

type SharedDialogPortrait = {
  label: string;
  imageUrl?: string | null | undefined;
  containerClassName?: string | undefined;
  imageClassName?: string | undefined;
  labelClassName?: string | undefined;
};

type SharedDialogSpeaker = {
  name?: string | undefined;
  narration?: boolean | undefined;
  portraitImageUrl?: string | null | undefined;
  portraitArtClassName?: string | undefined;
  portraitContainerClassName?: string | undefined;
  portraitImageClassName?: string | undefined;
  portraitNameClassName?: string | undefined;
};

export type SharedModalDialogConfig = {
  layout: "modal";
  title: string;
  body: string[];
  actions: SharedDialogAction[];
  eyebrow?: string | undefined;
  overlayClassName?: string | undefined;
  overlayAttributes?: Record<string, string> | undefined;
  panelClassName?: string | undefined;
  panelAttributes?: Record<string, string> | undefined;
  contentClassName?: string | undefined;
  titleClassName?: string | undefined;
  bodyClassName?: string | undefined;
  bodyTag?: "div" | "p" | undefined;
  actionsClassName?: string | undefined;
  eyebrowClassName?: string | undefined;
  portrait?: SharedDialogPortrait | undefined;
};

export type SharedDialogueCardConfig = {
  layout: "dialogue-card";
  body: string[];
  action?: SharedDialogAction | undefined;
  hintText?: string | null | undefined;
  ariaLabel?: string | undefined;
  footerClassName?: string | undefined;
  footerAttributes?: Record<string, string> | undefined;
  surfaceClassName?: string | undefined;
  surfaceAttributes?: Record<string, string> | undefined;
  lineClassName?: string | undefined;
  hintClassName?: string | undefined;
  speaker?: SharedDialogSpeaker | undefined;
};

export type SharedDialogConfig =
  | SharedModalDialogConfig
  | SharedDialogueCardConfig;

export function renderSharedDialog(config: SharedDialogConfig): string {
  if (config.layout === "modal") {
    return renderSharedModalDialog(config);
  }

  return renderSharedDialogueCard(config);
}

function renderSharedModalDialog(config: SharedModalDialogConfig): string {
  const bodyTag = config.bodyTag ?? "div";

  return `
    <div class="${config.overlayClassName ?? "c-modal-overlay"}" ${renderAttributes(config.overlayAttributes)}>
      <div class="${config.panelClassName ?? "c-confirm-modal c-panel"}" role="dialog" aria-modal="true" ${renderAttributes(config.panelAttributes)}>
        <div class="${config.contentClassName ?? "c-confirm-modal__content"}">
          ${
            config.eyebrow == null
              ? ""
              : `<p class="${config.eyebrowClassName ?? "c-confirm-modal__eyebrow"}">${config.eyebrow}</p>`
          }
          <h2 class="${config.titleClassName ?? "c-confirm-modal__title"}">${config.title}</h2>
          ${
            bodyTag === "p"
              ? `<p class="${config.bodyClassName ?? "c-confirm-modal__body"}">${config.body.join("<br>")}</p>`
              : `<div class="${config.bodyClassName ?? "c-confirm-modal__body"}">
                  ${config.body.map((line) => `<p>${line}</p>`).join("")}
                </div>`
          }
          ${
            config.portrait == null
              ? ""
              : `
                <div class="${config.portrait.containerClassName ?? "c-city-portrait"}">
                  ${
                    config.portrait.imageUrl == null
                      ? ""
                      : `<img class="${config.portrait.imageClassName ?? "c-city-portrait__image"}" src="${config.portrait.imageUrl}" alt="${config.portrait.label}">`
                  }
                  <span class="${config.portrait.labelClassName ?? "c-city-portrait__label"}">${config.portrait.label}</span>
                </div>
              `
          }
        </div>
        <div class="${config.actionsClassName ?? "c-confirm-modal__actions"}">
          ${config.actions.map(renderActionButton).join("")}
        </div>
      </div>
    </div>
  `;
}

function renderSharedDialogueCard(config: SharedDialogueCardConfig): string {
  const action = config.action;
  const clickable = action != null;
  const interactionAttributes =
    clickable && action != null
      ? `${renderInteractionAttrs(action)} ${renderAttributes(config.surfaceAttributes)}`.trim()
      : "";

  return `
    <footer class="${config.footerClassName ?? "c-grain-shop-dialogue"}" aria-label="${config.ariaLabel ?? "对话"}" ${renderAttributes(config.footerAttributes)}>
      <div
        class="${config.surfaceClassName ?? "c-grain-shop-dialogue__text c-grain-shop-skin-card"}${clickable ? " c-grain-shop-dialogue__text--clickable" : ""}"
        ${
          clickable
            ? `${interactionAttributes} role="button" tabindex="0"`
            : ""
        }
      >
        ${config.body
          .map(
            (line) =>
              `<p class="${config.lineClassName ?? "c-grain-shop-dialogue__line"}">${line}</p>`
          )
          .join("")}
        ${
          config.hintText == null || config.hintText.length === 0
            ? ""
            : `<p class="${config.hintClassName ?? "c-grain-shop-dialogue__hint"}">${config.hintText}</p>`
        }
      </div>
      ${
        config.speaker == null || config.speaker.narration === true
          ? ""
          : `
            <div class="${config.speaker.portraitContainerClassName ?? "c-grain-shop-dialogue__npc"}">
              <div class="c-grain-shop-portrait" aria-hidden="true">
                ${
                  config.speaker.portraitImageUrl == null
                    ? `<span class="c-grain-shop-portrait__art ${config.speaker.portraitArtClassName ?? ""}"></span>`
                    : `<img class="${config.speaker.portraitImageClassName ?? "c-grain-shop-portrait__image"}" src="${config.speaker.portraitImageUrl}" alt="">`
                }
              </div>
              <p class="${config.speaker.portraitNameClassName ?? "c-grain-shop-portrait__name c-grain-shop-nameplate c-grain-shop-nameplate--small"}">
                ${config.speaker.name ?? ""}
              </p>
            </div>
          `
      }
    </footer>
  `;
}

function renderActionButton(action: SharedDialogAction): string {
  return `
    <button
      type="button"
      class="${action.className ?? "c-button"}"
      ${renderInteractionAttrs(action)}
      ${action.disabled === true ? "disabled" : ""}
      ${action.autoFocus === true ? "autofocus" : ""}
    >
      ${action.label}
    </button>
  `;
}

function renderInteractionAttrs(action: SharedDialogAction): string {
  return [
    `data-dialog-result="${action.result}"`,
    `data-dialog-action-id="${action.id}"`,
    ...Object.entries(action.attributes ?? {}).map(
      ([name, value]) => `${name}="${value}"`
    ),
  ].join(" ");
}

function renderAttributes(attributes: Record<string, string> | undefined): string {
  return Object.entries(attributes ?? {})
    .map(([name, value]) => `${name}="${value}"`)
    .join(" ");
}
