import {
  CITY_BEGGING_DEFAULT_LOCATIONS,
  getCityBeggingDefaultLocation,
  type CityBeggingDefaultLocation,
  type CityBeggingDefaultOption,
} from "../../../content/playables/city-begging-default-content";
import type { CityBeggingPlayableState } from "../../../domain/city-begging-minigame";
import {
  renderDialogueTypewriterHint,
  renderDialogueTypewriterLines,
} from "../../dialogue-typewriter";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function isDefaultDialogueState(
  state: CityBeggingPlayableState | null
): state is Extract<CityBeggingPlayableState, { mode: "default-dialogue" }> {
  return state != null && "mode" in state && state.mode === "default-dialogue";
}

function getSelectedContent(state: Extract<CityBeggingPlayableState, { mode: "default-dialogue" }>): {
  location: CityBeggingDefaultLocation | null;
  option: CityBeggingDefaultOption | null;
} {
  const location =
    state.selectedLocationId == null
      ? null
      : getCityBeggingDefaultLocation(state.selectedLocationId);
  const option =
    location?.options.find(
      (candidate) => candidate.optionId === state.selectedOptionId
    ) ?? null;

  return { location, option };
}

function getNpcPortraitClassName(npcId: string): string {
  return `c-city-begging-default__portrait--${npcId}`;
}

function hasVisitedAllLocations(
  state: Extract<CityBeggingPlayableState, { mode: "default-dialogue" }>
): boolean {
  return CITY_BEGGING_DEFAULT_LOCATIONS.every((location) =>
    state.visitedLocationIds.includes(location.locationId)
  );
}

function renderDialogueText(input: {
  lines: readonly string[];
  speakerName: string;
  portraitClassName?: string;
  clickable?: boolean;
}): string {
  const typewriterLines = renderDialogueTypewriterLines([...input.lines]);
  const clickable = input.clickable === true;
  const portraitClassName =
    input.portraitClassName == null ? "" : ` ${escapeHtml(input.portraitClassName)}`;

  return `
    <footer class="c-grain-shop-dialogue c-scene-dialogue c-city-begging-default__dialogue" aria-label="化缘剧情">
      <div
        class="c-grain-shop-dialogue__text c-grain-shop-skin-card ${clickable ? "c-grain-shop-dialogue__text--clickable c-grain-shop-dialogue__text--with-hint" : ""}"
        ${clickable ? 'data-scene-action="advance" role="button" tabindex="0" data-ui-click-sound="none"' : ""}
      >
        ${typewriterLines.markup}
        ${
          clickable
            ? renderDialogueTypewriterHint(
                "点击继续",
                typewriterLines.totalDurationMs
              )
            : ""
        }
      </div>
      <div class="c-grain-shop-dialogue__npc">
        <div class="c-grain-shop-portrait" aria-hidden="true">
          <span class="c-grain-shop-portrait__art${portraitClassName}"></span>
        </div>
        <p class="c-grain-shop-portrait__name c-grain-shop-nameplate c-grain-shop-nameplate--small">
          ${escapeHtml(input.speakerName)}
        </p>
      </div>
    </footer>
  `;
}

function renderLocationSelect(): string {
  return renderDialogueText({
    speakerName: "托钵僧",
    lines: ["你托钵行至濠州街头，城中烟火未歇，人心却各有冷暖。你须先择一处落脚化缘。"],
    clickable: true,
  });
}

function renderLocationOptions(
  state: Extract<CityBeggingPlayableState, { mode: "default-dialogue" }>
): string {
  return `
    ${renderDialogueText({
      speakerName: "托钵僧",
      lines: ["你托钵行至濠州街头，城中烟火未歇，人心却各有冷暖。你须先择一处落脚化缘。"],
    })}
    <div class="c-grain-shop-center c-grain-shop-center--open c-city-begging-default__choice-layer">
      <nav class="c-grain-shop-actions c-city-begging-default__choices" aria-label="化缘地点">
      ${CITY_BEGGING_DEFAULT_LOCATIONS.filter(
        (location) => !state.visitedLocationIds.includes(location.locationId)
      ).map(
        (location) => `
          <button
            type="button"
            class="c-button c-grain-shop-button c-grain-shop-button--paper"
            data-scene-choice-id="${escapeHtml(location.locationId)}"
            data-button-sound="light"
          >
            ${escapeHtml(location.title)}
          </button>
        `
      ).join("")}
      </nav>
    </div>
  `;
}

function renderEncounter(location: CityBeggingDefaultLocation): string {
  return renderDialogueText({
    speakerName: location.npc.name,
    portraitClassName: getNpcPortraitClassName(location.npc.id),
    lines: [location.encounterText],
    clickable: true,
  });
}

function renderOptionSelect(location: CityBeggingDefaultLocation): string {
  return `
    ${renderDialogueText({
      speakerName: location.npc.name,
      portraitClassName: getNpcPortraitClassName(location.npc.id),
      lines: [location.encounterText],
    })}
    <div class="c-grain-shop-center c-grain-shop-center--open c-city-begging-default__choice-layer">
      <nav class="c-grain-shop-actions c-city-begging-default__choices" aria-label="化缘选择">
      ${location.options
        .map(
          (option) => `
            <button
              type="button"
              class="c-button c-grain-shop-button c-grain-shop-button--paper"
              data-scene-choice-id="${escapeHtml(option.optionId)}"
              data-button-sound="light"
            >
              ${escapeHtml(option.optionText)}
            </button>
          `
        )
        .join("")}
      </nav>
    </div>
  `;
}

function renderFortuneDraw(): string {
  return `
    <div class="c-city-card-draw-test c-city-begging-default__fortune">
      <section class="c-city-card-draw-test__panel">
        <p class="c-city-card-draw-test__copy">
          点击卡牌，让因果显形。
        </p>
        <div
          class="c-city-card-draw-test__stage"
          data-city-begging-fortune-mount
        ></div>
        <p class="c-city-card-draw-test__result" data-city-begging-fortune-result-label>
          点击卡牌开始抽取。
        </p>
      </section>
    </div>
  `;
}

function renderThinking(): string {
  return `
    <div class="c-city-begging-default__thinking-panel">
      <div class="c-city-begging-default__thinking" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <p class="c-city-begging-default__result">AI推理中</p>
    </div>
  `;
}

function renderOutcome(
  state: Extract<CityBeggingPlayableState, { mode: "default-dialogue" }>,
  location: CityBeggingDefaultLocation,
  option: CityBeggingDefaultOption
): string {
  const canContinue = !hasVisitedAllLocations(state);

  return `
    ${renderDialogueText({
      speakerName: location.npc.name,
      portraitClassName: getNpcPortraitClassName(location.npc.id),
      lines: [option.outcomeText, option.settlementText, location.closingText],
    })}
    <div class="c-grain-shop-center c-grain-shop-center--open c-city-begging-default__choice-layer">
      <nav class="c-grain-shop-actions c-city-begging-default__choices" aria-label="化缘结算">
      ${
        canContinue
          ? `
      <button
        type="button"
        class="c-button c-grain-shop-button c-grain-shop-button--paper"
        data-scene-action="continue-journey"
        data-button-sound="light"
      >
        继续游历
      </button>
      `
          : ""
      }
      <button
        type="button"
        class="c-button c-grain-shop-button c-grain-shop-button--paper"
        data-scene-action="advance"
        data-button-sound="light"
      >
        收下因果
      </button>
      </nav>
    </div>
  `;
}

export function renderCityBeggingDefaultDialogueOverlay(
  state: CityBeggingPlayableState | null
): string {
  if (!isDefaultDialogueState(state) || state.phase === "completed") {
    return "";
  }

  const { location, option } = getSelectedContent(state);
  const title = location?.title ?? "濠州化缘";
  const backgroundId = location?.backgroundId ?? "chengzhen";
  const npcName = location?.npc.name ?? "濠州城中人";
  const body =
    state.phase === "location-select"
      ? renderLocationSelect()
      : state.phase === "location-options-thinking"
        ? renderThinking()
      : state.phase === "location-options"
        ? renderLocationOptions(state)
        : state.phase === "encounter" && location != null
        ? renderEncounter(location)
        : state.phase === "option-select-thinking"
          ? renderThinking()
        : state.phase === "option-select" && location != null
          ? renderOptionSelect(location)
        : state.phase === "fortune-draw"
          ? renderFortuneDraw()
          : state.phase === "thinking"
            ? renderThinking()
            : state.phase === "outcome" && location != null && option != null
              ? renderOutcome(state, location, option)
              : "";

  return `
    <section
      class="view-house-grain-shop view-house-temple view-scene c-city-begging-default c-city-begging-default--${escapeHtml(backgroundId)}"
      data-city-begging-default-overlay
      data-city-begging-default-phase="${escapeHtml(state.phase)}"
      data-city-begging-default-background="${escapeHtml(backgroundId)}"
      role="dialog"
      aria-modal="true"
      aria-labelledby="city-begging-default-title"
    >
      <h2 class="u-visually-hidden" id="city-begging-default-title">${escapeHtml(title)} - ${escapeHtml(npcName)}</h2>
      ${body}
    </section>
  `;
}
