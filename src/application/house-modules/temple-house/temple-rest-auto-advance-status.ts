import type { CharacterDefinition } from "../../../domain/character";
import type { GameState } from "../../../domain/game-state";
import {
  isZhuYuanzhangMonkStoryStage,
  ZHU_YUANZHANG_STORY_VARIABLE_KEYS,
} from "../../../domain/zhu-yuanzhang-story";
import type { AutoAdvanceStatusPanel } from "../../app-shell";
import { getCouncilStatusText } from "../../time/time-progression";

function getPlayerCharacter(
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string
): CharacterDefinition | null {
  return (
    characterDefinitions.find(
      (characterDefinition) => characterDefinition.id === playerCharacterId
    ) ?? null
  );
}

export function createTempleReviewRestAutoAdvanceStatus(input: {
  gameState: GameState;
  characterDefinitions: CharacterDefinition[];
  playerCharacterId: string;
  textEntriesById?: Record<string, string> | undefined;
}): AutoAdvanceStatusPanel {
  const playerCharacter = getPlayerCharacter(
    input.characterDefinitions,
    input.playerCharacterId
  );
  const lines = [
    "当前：寺中静修",
    `评定：${getCouncilStatusText(input.gameState)}`,
    `体力：${playerCharacter?.stamina ?? 0} / 100`,
  ];

  if (isZhuYuanzhangMonkStoryStage(input.gameState)) {
    const contribution =
      input.gameState.runtime.variables[
        ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeContribution
      ];
    if (typeof contribution === "number") {
      lines.push(`贡献：${contribution} / 30`);
    }

    const week =
      input.gameState.runtime.variables[
        ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeWeek
      ];
    if (typeof week === "number") {
      lines.push(`周次：第 ${week} 周`);
    }
  }

  if (input.gameState.ui.mainHouseMissionText.trim().length > 0) {
    lines.push(`差事：${input.gameState.ui.mainHouseMissionText}`);
  }

  return {
    variant: "temple-review-rest",
    title: "休至评定日",
    lines,
  };
}
