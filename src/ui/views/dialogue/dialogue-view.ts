import type {
  RuntimeDialogueChoiceOption,
  RuntimeDialogueNode,
} from "../../../domain/dialogue";
import type { ActiveActivitySession } from "../../../domain/activity-session";
import {
  FORTUNE_BOARD_MAX_ANIMATION_TICK_MS,
  FORTUNE_BOARD_MIN_ANIMATION_TICK_MS,
} from "../../../domain/activity-session";
import type { CharacterDefinition } from "../../../domain/character";
import {
  resolveDialogueNodeText,
  resolveChoiceOptionText,
} from "../../../application/content/text-resolution";
import { renderSharedDialog } from "../../components/dialog/shared-dialog";
import { resolveDialogueBackgroundPreviewImageUrl } from "../../location-backgrounds";
import { resolveCharacterPortraitImageUrl } from "../../portrait-assets";

type DialogueViewInput = {
  currentAction: RuntimeDialogueNode | null;
  activitySession: ActiveActivitySession;
  characterDefinitions: CharacterDefinition[];
  choiceOptions: RuntimeDialogueChoiceOption[];
  underlayMarkup?: string;
  textEntriesById?: Record<string, string>;
};

function getDialoguePortraitArtClassName(characterId: string): string {
  switch (characterId) {
    case "char.kulan_temple_abbot":
      return "c-temple-house-portrait-art--abbot";
    case "char.kulan_temple_senior_monk":
      return "c-temple-house-portrait-art--senior-monk";
    default:
      return "";
  }
}

function getCharacterName(
  characterDefinitions: CharacterDefinition[],
  characterId: string
): string {
  return (
    characterDefinitions.find(
      (characterDefinition) => characterDefinition.id === characterId
    )?.name ?? characterId
  );
}

function getCharacterDefinition(
  characterDefinitions: CharacterDefinition[],
  characterId: string
): CharacterDefinition | null {
  return (
    characterDefinitions.find(
      (characterDefinition) => characterDefinition.id === characterId
    ) ?? null
  );
}

function renderDialogueCard(
  paragraphs: string[],
  options: {
    advanceActionId?: string;
    dialogueSide?: "left" | "right" | "center";
    speakerName?: string;
    narration?: boolean;
    portraitImageUrl?: string | null;
    portraitArtClassName?: string;
  } = {}
): string {
  return renderSharedDialog({
    layout: "dialogue-card",
    body: paragraphs,
    hintText: options.advanceActionId == null ? null : "点击继续",
    ariaLabel: "剧情对话",
    footerClassName: "c-grain-shop-dialogue c-dialogue-surface",
    footerAttributes:
      options.dialogueSide == null
        ? undefined
        : {
            "data-dialogue-side": options.dialogueSide,
          },
    action:
      options.advanceActionId == null
        ? undefined
        : {
            id: options.advanceActionId,
            label: "点击继续",
            result: "action",
            attributes: {
              "data-dialogue-action": options.advanceActionId,
            },
          },
    speaker:
      options.narration
        ? {
            narration: true,
          }
        : {
            name: options.speakerName ?? "",
            portraitImageUrl: options.portraitImageUrl,
            portraitArtClassName: options.portraitArtClassName,
      },
  });
}

function renderDialoguePresentationCard(
  paragraphs: string[],
  options: {
    advanceActionId: string;
    view: "background" | "music";
    attributes: Record<string, string>;
    underlayMarkup?: string;
    previewMarkup?: string;
  }
): string {
  return `
    <section class="view-dialogue" data-dialogue-view="${options.view}" ${renderDataAttributes(options.attributes)}>
      ${options.underlayMarkup ?? ""}
      ${options.previewMarkup ?? ""}
      ${renderDialogueCard(paragraphs, {
        advanceActionId: options.advanceActionId,
        narration: true,
      })}
    </section>
  `;
}

function renderDataAttributes(attributes: Record<string, string>): string {
  return Object.entries(attributes)
    .map(([name, value]) => `${name}="${value}"`)
    .join(" ");
}

function renderDialogueBackgroundPreview(backgroundId: string): string {
  const previewUrl = resolveDialogueBackgroundPreviewImageUrl(backgroundId);
  if (previewUrl == null) {
    return "";
  }

  return `
    <div class="view-dialogue__background-preview">
      <img
        class="view-dialogue__background-preview-image"
        src="${previewUrl}"
        alt=""
        aria-hidden="true"
      >
    </div>
  `;
}

function resolveDialoguePortraitImageUrl(
  characterDefinition: CharacterDefinition | null,
  portraitId: string | undefined
): string | null {
  if (characterDefinition == null) {
    return null;
  }

  const requestedPortraitId =
    typeof portraitId === "string" ? portraitId.trim() : "";
  if (requestedPortraitId.length === 0) {
    return resolveCharacterPortraitImageUrl(characterDefinition);
  }

  if (characterDefinition.portraitId === requestedPortraitId) {
    return resolveCharacterPortraitImageUrl({
      ...characterDefinition,
      portraitVariantId: null,
    });
  }

  const matchingVariant =
    characterDefinition.portraitVariants?.find(
      (variant) => variant.portraitId === requestedPortraitId
    ) ?? null;
  if (matchingVariant == null) {
    return null;
  }

  return resolveCharacterPortraitImageUrl({
    ...characterDefinition,
    portraitVariantId: matchingVariant.id,
  });
}

function renderChoiceList(choiceOptions: RuntimeDialogueChoiceOption[]): string {
  return `
    <div class="c-grain-shop-center c-grain-shop-center--open">
      <nav class="c-grain-shop-actions" aria-label="剧情选择">
        ${choiceOptions
          .map(
            (option) => `
              <button
                type="button"
                class="c-button c-grain-shop-button c-grain-shop-button--paper"
                data-dialogue-choice-id="${option.id}"
              >
                ${option.label}
              </button>
            `
          )
          .join("")}
      </nav>
    </div>
  `;
}

function getFortuneBoardKindLabel(kind: string): string {
  switch (kind) {
    case "timing":
      return "时机";
    case "favorable":
      return "顺势";
    case "complete":
      return "周全";
    case "resonance":
      return "灵感";
    case "rumor":
      return "奇闻";
    default:
      return "类型";
  }
}

export function renderActivityOverlay(activitySession: ActiveActivitySession): string {
  if (activitySession?.type === "fortune-board") {
    return `
      <div class="c-grain-shop-overlay" data-activity-overlay="fortune-board">
        <div class="c-grain-shop-modal c-grain-shop-modal--game c-grain-shop-skin-panel c-temple-house-modal c-fortune-board" role="dialog" aria-modal="true">
          <div class="c-temple-house-qte__header">
            <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${activitySession.title}</h3>
            <p class="c-temple-house-qte__task">${activitySession.taskLabel}</p>
            <p class="c-temple-house-qte__meta" data-fortune-meta>剩余 ${activitySession.remainingPieces} 枚 · 本轮 ${activitySession.wager} 枚 · 玩法分数 ${activitySession.score} · 贡献值 +${activitySession.score}</p>
          </div>
          <div class="c-fortune-board__grid" data-fortune-phase="${activitySession.phase}">
            ${activitySession.board
              .map((cell) => {
                const isHighlighted = activitySession.highlightedColumn === cell.column;
                const isColumnSelected = activitySession.selectedColumn === cell.column;
                const cellKey = `${cell.row}:${cell.column}`;
                const isNewSelection = activitySession.selectedCellKeys.includes(cellKey);
                const isCellHighlighted = activitySession.highlightedCellKey === cellKey;
                const isPicked = activitySession.pickedCellKey === cellKey;
                const isPickFlashActive =
                  activitySession.phase === "cell-pick" &&
                  isPicked &&
                  activitySession.flashTicks > 0 &&
                  activitySession.flashTicks % 2 === 0;
                const isFinalSelectionFlash =
                  activitySession.phase === "final-flash" && cell.selected;
                return `
                  <span
                    class="c-fortune-board__cell is-kind-${cell.kind} ${cell.selected ? "is-selected" : ""} ${isHighlighted ? "is-highlighted" : ""} ${isColumnSelected ? "is-column-selected" : ""} ${isCellHighlighted ? "is-cell-highlighted" : ""} ${isPicked ? "is-picked" : ""} ${isPickFlashActive ? "is-picked-flash" : ""} ${isFinalSelectionFlash ? "is-final-selection-flash" : ""} ${activitySession.phase === "column-flash" && activitySession.flashTicks > 0 && isColumnSelected && activitySession.flashTicks % 2 === 0 ? "is-flashing-column" : ""} ${isNewSelection ? "is-new-selection" : ""}"
                    data-fortune-cell-key="${cellKey}"
                    data-fortune-kind="${cell.kind}"
                    data-fortune-label="${getFortuneBoardKindLabel(cell.kind)}"
                    data-fortune-reroll-count="${activitySession.rerollCount}"
                    style="--fortune-row:${cell.row + 1}; --fortune-column:${cell.column + 1};"
                  >
                    <span class="c-fortune-board__cell-label">${getFortuneBoardKindLabel(cell.kind)}</span>
                  </span>
                `;
              })
              .join("")}
          </div>
          <div class="c-fortune-board__summary" data-fortune-summary>
            <span>基础 ${activitySession.baseScore}</span>
            <span>时机/顺势/周全/平三连计分</span>
            ${
              activitySession.resonanceCount > 0
                ? `<span>灵感 +${activitySession.resonanceCount * 3} 枚</span>`
                : ""
            }
            ${activitySession.rumorCount > 0 ? "<span>奇闻待触发</span>" : ""}
          </div>
          <div class="c-fortune-board__tuning" data-fortune-speed-control>
            <span>间隔</span>
            <input
              type="range"
              min="${FORTUNE_BOARD_MIN_ANIMATION_TICK_MS}"
              max="${FORTUNE_BOARD_MAX_ANIMATION_TICK_MS}"
              step="50"
              value="${activitySession.animationTickMs}"
              data-fortune-speed-input
            />
            <strong data-fortune-speed-value>${activitySession.animationTickMs}ms</strong>
          </div>
          <div class="c-grain-shop-modal__actions c-fortune-board__actions">
            <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--paper" data-activity-action="wager-minus">-</button>
            <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--gold" data-activity-action="play-board">
              ${activitySession.phase === "scanning" ? "选定此列" : "游玩"}
            </button>
            <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--paper" data-activity-action="wager-plus">+</button>
          </div>
        </div>
      </div>
    `;
  }

  if (activitySession?.type === "work-sequence") {
    const lastHistoryEntry =
      activitySession.history[activitySession.history.length - 1] ?? null;

    return `
      <div class="c-grain-shop-overlay" data-activity-overlay="work-sequence">
        <div class="c-grain-shop-modal c-grain-shop-modal--game c-grain-shop-skin-panel c-temple-house-modal" role="dialog" aria-modal="true">
          <div class="c-temple-house-qte__header">
            <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${activitySession.title}</h3>
            <p class="c-temple-house-qte__task">${activitySession.taskLabel}</p>
            <p class="c-temple-house-qte__meta">第 ${activitySession.round} / ${activitySession.totalRounds} 轮 · 已成 ${activitySession.successes} 次</p>
          </div>
          <div class="c-grain-shop-modal__body">
            <p>${activitySession.instruction}</p>
            <div class="c-activity-work-sequence__order" aria-live="polite">
              <span class="c-activity-work-sequence__label">令牌</span>
              <strong>${activitySession.targetCommandLabel}</strong>
            </div>
            ${
              lastHistoryEntry == null
                ? ""
                : `<p class="c-activity-work-sequence__feedback ${lastHistoryEntry.success ? "is-success" : "is-failed"}">
                    上轮：${lastHistoryEntry.selectedLabel} / ${lastHistoryEntry.success ? "妥当" : `应为 ${lastHistoryEntry.expectedLabel}`}
                  </p>`
            }
          </div>
          <div class="c-grain-shop-modal__actions c-activity-work-sequence__actions">
            ${activitySession.commandOptions
              .map(
                (command) => `
                  <button
                    type="button"
                    class="c-button c-grain-shop-button c-grain-shop-button--paper"
                    data-activity-action="choose-command"
                    data-activity-command-id="${command.id}"
                  >
                    ${command.label}
                  </button>
                `
              )
              .join("")}
          </div>
        </div>
      </div>
    `;
  }

  if (activitySession?.type === "qte-bar") {
    return `
      <div class="c-grain-shop-overlay" data-activity-overlay="qte-bar">
        <div class="c-grain-shop-modal c-grain-shop-modal--game c-grain-shop-skin-panel c-temple-house-modal" role="dialog" aria-modal="true">
          <div class="c-temple-house-qte__header">
            <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${activitySession.title}</h3>
            <p class="c-temple-house-qte__task">${activitySession.taskLabel}</p>
            <p class="c-temple-house-qte__meta">第 ${activitySession.round} / ${activitySession.totalRounds} 轮 · 已中 ${activitySession.successes} 次</p>
          </div>
          <div class="c-grain-shop-modal__body">
            <p>看准金色区间，点击停手。</p>
            <div class="c-temple-house-qte__track" aria-hidden="true">
              <span
                class="c-temple-house-qte__target"
                style="left:${activitySession.targetStartPercent}%; width:${activitySession.targetWidthPercent}%;"
              ></span>
              <span
                class="c-temple-house-qte__marker"
                style="left:${activitySession.markerPercent}%;"
              ></span>
            </div>
          </div>
          <div class="c-grain-shop-modal__actions">
            <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--gold" data-activity-action="stop-qte">
              停手
            </button>
          </div>
        </div>
      </div>
    `;
  }

  if (activitySession?.type === "result") {
    return `
      <div class="c-grain-shop-overlay" data-activity-overlay="result">
        <div class="c-grain-shop-modal c-grain-shop-skin-panel c-temple-house-modal" role="dialog" aria-modal="true">
          <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${activitySession.title}</h3>
          <div class="c-grain-shop-modal__body">
            <p class="c-temple-house-result__grade">评语：${activitySession.grade}</p>
            <p class="c-temple-house-result__grade">命中：${activitySession.score}</p>
            ${activitySession.rewardLines.map((line) => `<p>${line}</p>`).join("")}
          </div>
          <div class="c-grain-shop-modal__actions">
            <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--gold" data-activity-action="close-result">
              确认
            </button>
          </div>
        </div>
      </div>
    `;
  }

  return "";
}

export function renderDialogueView(input: DialogueViewInput): string {
  const textEntriesById = input.textEntriesById ?? {};
  const action =
    input.currentAction == null
      ? null
      : resolveDialogueNodeText(input.currentAction, { textEntriesById });
  const resolvedChoiceOptions = input.choiceOptions.map((option) =>
    resolveChoiceOptionText(option, { textEntriesById })
  );
  const activityOverlay = renderActivityOverlay(input.activitySession);
  if (action == null) {
    return activityOverlay;
  }

  if (action.type === "narration") {
    return `
      <section class="view-dialogue" data-dialogue-view="narration">
        ${input.underlayMarkup ?? ""}
        ${renderDialogueCard([action.text ?? ""], {
          advanceActionId: "advance",
          narration: true,
        })}
      </section>
      ${activityOverlay}
    `;
  }

  if (action.type === "background") {
    return `
      ${renderDialoguePresentationCard([`场景：${action.backgroundId}`], {
        advanceActionId: "advance",
        view: "background",
        attributes: {
          "data-dialogue-background-id": action.backgroundId,
        },
        underlayMarkup: input.underlayMarkup,
        previewMarkup: renderDialogueBackgroundPreview(action.backgroundId),
      })}
      ${activityOverlay}
    `;
  }

  if (action.type === "music") {
    return `
      ${renderDialoguePresentationCard(
        [`音乐：${action.musicId}`, action.loop === true ? "循环播放" : "播放一次"],
        {
          advanceActionId: "advance",
          view: "music",
          attributes: {
            "data-dialogue-music-id": action.musicId,
            "data-dialogue-music-loop": action.loop === true ? "true" : "false",
          },
          underlayMarkup: input.underlayMarkup,
        }
      )}
      ${activityOverlay}
    `;
  }

  if (action.type === "dialogue") {
    const speaker = getCharacterDefinition(
      input.characterDefinitions,
      action.characterId
    );
    const portraitImageUrl = resolveDialoguePortraitImageUrl(
      speaker,
      action.portraitId
    );

    return `
      <section class="view-dialogue" data-dialogue-view="dialogue">
        ${input.underlayMarkup ?? ""}
        ${renderDialogueCard([action.text ?? ""], {
          advanceActionId: "advance",
          dialogueSide: action.side,
          speakerName:
            speaker?.name ??
            getCharacterName(input.characterDefinitions, action.characterId),
          portraitImageUrl,
          ...(portraitImageUrl == null
            ? {
                portraitArtClassName: getDialoguePortraitArtClassName(
                  action.characterId
                ),
              }
            : {}),
        })}
      </section>
      ${activityOverlay}
    `;
  }

  if (action.type === "choice") {
    return `
      <section class="view-dialogue" data-dialogue-view="choice">
        ${input.underlayMarkup ?? ""}
        ${renderDialogueCard([action.prompt ?? "你要如何回应？"], {
          narration: true,
        })}
        ${renderChoiceList(resolvedChoiceOptions)}
      </section>
      ${activityOverlay}
    `;
  }

  return `
    <section class="view-dialogue" data-dialogue-view="transition">
      ${input.underlayMarkup ?? ""}
      ${renderDialogueCard(["对话推进中。"], {
        advanceActionId: "advance",
        narration: true,
      })}
    </section>
    ${activityOverlay}
  `;
}
