import type { CharacterDefinition } from "../../domain/character";
import type { MissionDefinition } from "../../domain/mission";
import { readStringPersonAttributeBySemanticKey } from "../../application/character/person-attribute-runtime";

export type PlayerCardPanelModel = {
  playerName: string;
  playerTitle?: string;
  activeMissionTitle: string | null;
  stats: CharacterDefinition["stats"];
};

export function createPlayerCardPanelModel(
  playerCharacter: CharacterDefinition,
  activeMission: MissionDefinition | null
): PlayerCardPanelModel {
  const playerTitle = readStringPersonAttributeBySemanticKey(
    playerCharacter,
    "title"
  );
  return {
    playerName: playerCharacter.name,
    activeMissionTitle: activeMission?.title ?? null,
    stats: playerCharacter.stats,
    ...(playerTitle.length === 0 ? {} : { playerTitle }),
  };
}
