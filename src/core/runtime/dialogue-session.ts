import type { GameState } from "../../domain/game-state";
import type { DialogueRuntimeSession } from "../contracts/dialogue-runtime";

export function createDialogueSession(
  state: Pick<GameState, "dialogue">
): DialogueRuntimeSession | null {
  if (state.dialogue.activeDialogueId == null) {
    return null;
  }

  return {
    dialogueId: state.dialogue.activeDialogueId,
    eventId: state.dialogue.activeEventId,
    currentNodeId: String(state.dialogue.cursor),
  };
}
