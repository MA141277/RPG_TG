import type { HouseViewModel } from "./house-view";
import {
  renderHouseCharacterCard,
  renderNpcTargetAttributes,
} from "./house-shared-view";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

type FallbackHouseActor = {
  characterId: string;
  name: string;
  title?: string;
};

type FallbackHouseRendererInput =
  | HouseViewModel
  | {
      houseId: string;
      title: string;
      backButtonLabel: string;
      defaultCharacterId?: string | null;
      roster: FallbackHouseActor[];
    };

function resolveRoster(
  viewModel: FallbackHouseRendererInput
): FallbackHouseActor[] {
  if ("characterSummaries" in viewModel) {
    return viewModel.characterSummaries.map((characterSummary) => ({
      characterId: characterSummary.id,
      name: characterSummary.name,
      ...(characterSummary.title == null ? {} : { title: characterSummary.title }),
    }));
  }

  return viewModel.roster;
}

function resolveDefaultCharacterId(
  viewModel: FallbackHouseRendererInput
): string | null {
  return "defaultCharacterId" in viewModel
    ? viewModel.defaultCharacterId ?? null
    : null;
}

export function renderFallbackHouseView(
  viewModel: FallbackHouseRendererInput
): string {
  const rosterMarkup = resolveRoster(viewModel)
    .map((characterSummary) => {
      const secondaryText =
        characterSummary.title == null
          ? ""
          : `<span class="c-house-character-card__secondary">${escapeHtml(
              characterSummary.title
            )}</span>`;

      return `
        <button
          type="button"
          class="c-grain-shop-npc-idle__button"
          ${renderNpcTargetAttributes({
            context: {
              type: "house",
              houseId: viewModel.houseId,
            },
            characterId: characterSummary.characterId,
          })}
          aria-label="与 ${escapeHtml(characterSummary.name)} 交谈"
        >
          ${renderHouseCharacterCard(
            {
              characterId: characterSummary.characterId,
              name: characterSummary.name,
            },
            { secondaryText }
          )}
        </button>
      `;
    })
    .join("");
  const defaultCharacterId = resolveDefaultCharacterId(viewModel);

  return `
    <section class="view-house">
      <div class="c-stage-header">
        <div>
          <p class="c-stage-header__eyebrow">屋敷</p>
          <h1 class="c-stage-header__title">${escapeHtml(viewModel.title)}</h1>
        </div>
        <button class="c-button c-button--ghost" data-action="leave-house">${escapeHtml(
          viewModel.backButtonLabel
        )}</button>
      </div>
      <div class="c-house-interior">
        <div class="c-house-interior__hero c-panel">
          <strong class="c-house-interior__hero-name">
            ${defaultCharacterId == null ? "在场人物" : "可交谈人物"}
          </strong>
          <p class="c-house-interior__hero-text">
            这里是 ${escapeHtml(viewModel.title)}。点击左侧人物即可通过共享菜单进入交谈。
          </p>
        </div>
        <aside class="c-grain-shop-npc-idle c-house-roster" aria-label="在场人物">
          ${rosterMarkup}
        </aside>
      </div>
    </section>
  `;
}
