import type {
  ActiveStoryBattleSession,
  StoryBattleUnit,
} from "../../../domain/story-battle";
import type { BattleFormationPreviewViewModel } from "../../../application/troop-editor/troop-editor-stage-view-model";
import { renderTroopPreviewGrid } from "../troop-editor/troop-preview-grid";

function getUnitClass(unit: StoryBattleUnit): string {
  return [
    "c-story-battle-unit",
    `c-story-battle-unit--${unit.side}`,
    `is-${unit.status}`,
    unit.controller === "player" ? "is-player-controlled" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function getStatusLabel(unit: StoryBattleUnit): string {
  switch (unit.status) {
    case "engaged":
      return "交战";
    case "surrounded":
      return "被围";
    case "relieved":
      return "脱围";
    case "routed":
      return "溃退";
    default:
      return unit.controller === "player" ? "待命" : "待令";
  }
}

function renderUnit(unit: StoryBattleUnit): string {
  const strengthPercent = Math.max(
    0,
    Math.min(100, Math.round((unit.strength / unit.maxStrength) * 100))
  );

  return `
    <article
      class="${getUnitClass(unit)}"
      style="grid-column:${unit.x + 1};grid-row:${unit.y + 1};"
    >
      <span class="c-story-battle-unit__role">${unit.role}</span>
      <strong class="c-story-battle-unit__name">${unit.name}</strong>
      <span class="c-story-battle-unit__status">${getStatusLabel(unit)}</span>
      <div class="c-story-battle-unit__bar" aria-hidden="true">
        <span style="width:${strengthPercent}%"></span>
      </div>
      <span class="c-story-battle-unit__strength">${unit.strength} / ${unit.maxStrength}</span>
    </article>
  `;
}

function renderBattleAction(session: NonNullable<ActiveStoryBattleSession>): string {
  if (session.phase === "embedded-running") {
    return "";
  }

  if (session.phase === "awaiting-player-order") {
    return `
      <button type="button" class="c-button c-story-battle__primary-action" data-story-battle-action="player-advance">
        指挥本队突入缺口
      </button>
    `;
  }

  if (session.phase === "npc-resolution") {
    return `
      <button type="button" class="c-button c-story-battle__primary-action" data-story-battle-action="npc-resolve">
        观看友军合围解救
      </button>
    `;
  }

  return `
    <button type="button" class="c-button c-story-battle__primary-action" data-story-battle-action="finish">
      胜利，回帅府评定
    </button>
  `;
}

export function renderStoryBattleView(
  session: ActiveStoryBattleSession,
  options: { formationPreview?: BattleFormationPreviewViewModel | null } = {}
): string {
  if (session == null) {
    return "";
  }

  if (session.demoScenarioId != null) {
    const scenarioSrc = `/prototypes/battle-demo/index.html?embedded=1&scenario=${encodeURIComponent(
      session.demoScenarioId
    )}`;

    return `
      <section class="view-story-battle view-story-battle--embedded" aria-label="${session.title}">
        <iframe
          class="c-story-battle__demo-frame"
          title="${session.title}"
          src="${scenarioSrc}"
          allow="fullscreen"
        ></iframe>
      </section>
    `;
  }

  const formationPreviewMarkup =
    options.formationPreview == null
      ? ""
      : `
          <section class="c-story-battle__formation-preview">
            <h2>${options.formationPreview.teamName}</h2>
            ${renderTroopPreviewGrid(options.formationPreview.slots, {
              className: "c-troop-preview-grid c-troop-preview-grid--battle",
            })}
          </section>
        `;

  return `
    <section class="view-story-battle" aria-label="${session.title}">
      <header class="c-story-battle__header">
        <p class="c-story-battle__eyebrow">剧情合战</p>
        <h1>${session.title}</h1>
        <p>${session.objective}</p>
      </header>

      <div class="c-story-battle__body">
        <aside class="c-story-battle__brief">
          <h2>战况</h2>
          ${session.summaryLines.map((line) => `<p>${line}</p>`).join("")}
          <div class="c-story-battle__control-note">
            玩家只控制朱重八本队；郭子兴、汤和、徐达等友军由 NPC 自动行动。
          </div>
          ${formationPreviewMarkup}
          ${renderBattleAction(session)}
        </aside>

        <div class="c-story-battle__field" aria-label="战场">
          ${session.units.map(renderUnit).join("")}
        </div>

        <aside class="c-story-battle__log">
          <h2>战斗进程</h2>
          ${session.logLines.map((line) => `<p>${line}</p>`).join("")}
        </aside>
      </div>
    </section>
  `;
}
