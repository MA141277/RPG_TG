import type { CharacterDefinition } from "../../domain/character";
import type { CityEntryDefinition, CityEntryOption } from "../../domain/city-entry";
import type { GameState } from "../../domain/game-state";
import type { HistoricalCharacterRecord } from "../../domain/historical-character";
import { getLeaderResidenceRelationKey } from "../../domain/leader-residence";

function isLeaderResidenceCharacter(characterDefinition: CharacterDefinition): boolean {
  return (
    characterDefinition.isHistoricalFigure === true &&
    characterDefinition.leaderResidenceEligible === true
  );
}

function formatRelationLabel(state: GameState, characterId: string): string {
  const relationValue = state.runtime.variables[getLeaderResidenceRelationKey(characterId)];
  const score = typeof relationValue === "number" ? relationValue : 0;
  return `关系 ${score}`;
}

function formatStatusLabel(characterDefinition: CharacterDefinition): string {
  switch (characterDefinition.leaderResidenceStatus) {
    case "busy":
      return "忙碌";
    case "closed":
      return "闭门";
    case "available":
    default:
      return "可拜访";
  }
}

function getTags(characterDefinition: CharacterDefinition): string[] {
  const tags: string[] = ["可送礼"];
  if ((characterDefinition.teachableSkillKeys?.length ?? 0) > 0) {
    tags.push("可教学");
  }
  return tags;
}

export function selectLeaderResidenceOptions(
  state: GameState,
  characterDefinitions: CharacterDefinition[],
  cityEntry: CityEntryDefinition,
  input?: {
    historicalCharacters?: HistoricalCharacterRecord[];
    historicalCharacterIdByCharacterId?: Record<string, string>;
  }
): CityEntryOption[] {
  const historicalCharacterById = Object.fromEntries(
    (input?.historicalCharacters ?? []).map((characterRecord) => [
      characterRecord.id,
      characterRecord,
    ])
  );

  return characterDefinitions
    .filter(
      (characterDefinition) => {
        if (characterDefinition.cityId !== cityEntry.cityId) {
          return false;
        }

        if (!isLeaderResidenceCharacter(characterDefinition)) {
          return false;
        }

        const historicalCharacterId =
          input?.historicalCharacterIdByCharacterId?.[characterDefinition.id];
        if (historicalCharacterId == null) {
          return true;
        }

        const historicalCharacter = historicalCharacterById[historicalCharacterId];
        return historicalCharacter?.leaderResidenceProfile?.eligible === true;
      }
    )
    .map((characterDefinition) => ({
      entryId: cityEntry.id,
      characterId: characterDefinition.id,
      title: characterDefinition.name,
      subtitle:
        characterDefinition.title ??
        characterDefinition.occupation ??
        "历史人物",
      factionLabel:
        characterDefinition.affiliationLabel ??
        characterDefinition.clanId ??
        "无所属",
      relationLabel: formatRelationLabel(state, characterDefinition.id),
      statusLabel: formatStatusLabel(characterDefinition),
      tags: getTags(characterDefinition),
      disabled: characterDefinition.leaderResidenceStatus === "closed",
    }))
    .sort((leftOption, rightOption) => {
      if (leftOption.disabled !== rightOption.disabled) {
        return leftOption.disabled ? 1 : -1;
      }
      return leftOption.title.localeCompare(rightOption.title, "zh-Hans-CN");
    });
}
