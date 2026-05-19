import type { CharacterDefinition, SkillKey } from "../../../domain/character";
import { SKILL_LABELS } from "../../../domain/character";

const SKILL_ORDER: SkillKey[] = [
  "ashigaru",
  "horse",
  "teppo",
  "navy",
  "archery",
  "martial",
  "military",
  "ninjutsu",
  "construction",
  "development",
  "mining",
  "arithmetic",
  "etiquette",
  "rhetoric",
  "tea",
  "medicine",
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
};

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

function renderSkillPips(value: number, tone: "purple" | "gray"): string {
  return Array.from({ length: 4 }, (_, index) => {
    const filled = index < Math.min(Math.max(value, 0), 4);
    const modifier = filled
      ? tone === "purple"
        ? "c-character-detail__pip--purple"
        : "c-character-detail__pip--gray"
      : "c-character-detail__pip--empty";

    return `<span class="c-character-detail__pip ${modifier}"></span>`;
  }).join("");
}

export function renderCharacterDetailView(
  character: CharacterDefinition,
  options: CharacterDetailViewOptions = {}
): string {
  const portraitLabel =
    character.portraitVariants?.find(
      (variant) => variant.id === character.portraitVariantId
    )?.label ?? "通常";
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
  const leftSkillKeys = SKILL_ORDER.slice(0, 8);
  const rightSkillKeys = SKILL_ORDER.slice(8);
  const leadership = character.stats.leadership;
  const martial = character.stats.martial;
  const politics = character.stats.politics;
  const intelligence = character.stats.intelligence;
  const charm = character.stats.charm;
  const notoriety = options.notoriety ?? 0;

  return `
    <section class="view-character-detail">
      <div class="c-character-detail">
        <div class="c-character-detail__header c-panel">
          <div class="c-character-detail__header-title">
            <div class="c-character-detail__header-copy">
              <strong class="c-character-detail__name">${character.name}</strong>
              <div class="c-character-detail__header-meta">
                <span>${character.age}岁</span>
                <span>${character.occupation ?? "无职业"}</span>
                <span>${character.title ?? "无职位"}</span>
              </div>
            </div>
            <div class="c-character-detail__portrait-chip">${portraitLabel}</div>
          </div>
        </div>

        <div class="c-character-detail__left-column">
          <div class="c-character-detail__portrait c-panel">
            <span class="c-character-detail__portrait-label">${character.name}</span>
          </div>
          <div class="c-character-detail__biography c-panel">
            <div class="c-character-detail__lifespan">${character.birthYear}～${character.deathYear ?? "在世"}</div>
            <p class="c-character-detail__bio">${character.biography ?? "暂无人物简介。"}</p>
          </div>
        </div>

        <div class="c-character-detail__right-column c-panel">
          <div class="c-character-detail__info-grid">
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

          <div class="c-character-detail__reputation">
            <div class="c-character-detail__reputation-item">
              <span class="c-character-detail__label">名声</span>
              ${renderMeter(character.stats.fame)}
              <strong>${character.stats.fame}</strong>
            </div>
            <div class="c-character-detail__reputation-item">
              <span class="c-character-detail__label">恶名</span>
              ${renderMeter(notoriety, "c-character-detail__meter-fill--dark")}
              <strong>${notoriety}</strong>
            </div>
          </div>

          <div class="c-character-detail__stats">
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
          </div>

          <div class="c-character-detail__skills-grid">
            <div class="c-character-detail__skills-column">
              ${leftSkillKeys
                .map(
                  (skillKey) => `
                    <div class="c-character-detail__skill-row">
                      <span class="c-character-detail__skill-name">${SKILL_LABELS[skillKey]}</span>
                      <div class="c-character-detail__skill-pips">
                        ${renderSkillPips(skills[skillKey], "purple")}
                      </div>
                    </div>
                  `
                )
                .join("")}
            </div>
            <div class="c-character-detail__skills-column">
              ${rightSkillKeys
                .map(
                  (skillKey) => `
                    <div class="c-character-detail__skill-row">
                      <span class="c-character-detail__skill-name">${SKILL_LABELS[skillKey]}</span>
                      <div class="c-character-detail__skill-pips">
                        ${renderSkillPips(skills[skillKey], "gray")}
                      </div>
                    </div>
                  `
                )
                .join("")}
            </div>
          </div>

          <div class="c-character-detail__actions">
            <button class="c-button" type="button" data-action="open-valuables">贵重品</button>
            <button class="c-button" type="button" data-action="open-cards">卡</button>
            <button class="c-button c-button--danger" type="button" data-action="close-character-detail">关闭</button>
          </div>
        </div>
      </div>
    </section>
  `;
}
