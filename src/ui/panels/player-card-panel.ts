import type { CharacterDefinition } from "../../domain/character";
import type { MissionDefinition } from "../../domain/mission";

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
  return {
    playerName: playerCharacter.name,
    activeMissionTitle: activeMission?.title ?? null,
    stats: playerCharacter.stats,
    ...(playerCharacter.title == null ? {} : { playerTitle: playerCharacter.title }),
  };
}
