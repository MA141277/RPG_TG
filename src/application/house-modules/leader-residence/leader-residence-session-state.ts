import type { LeaderResidenceSessionState } from "../../../domain/house-modules/leader-residence-session";

export function createInitialLeaderResidenceSessionState(
  characterId: string,
  greetingLine: string
): LeaderResidenceSessionState {
  return {
    selectedCharacterId: characterId,
    dialogueLines: [greetingLine],
    mode: "idle",
    overlay: null,
  };
}
