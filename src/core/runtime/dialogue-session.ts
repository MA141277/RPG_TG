import type { GameState } from "../../domain/game-state";
import type { DialogueRuntimeSession } from "../contracts/dialogue-runtime";

export function createDialogueSession(
  state: Pick<GameState, "scene">
): DialogueRuntimeSession | null {
  if (state.scene.activeSceneId == null) {
    return null;
  }

  return {
    dialogueId: state.scene.activeSceneId,
    eventId: state.scene.activeEventId,
    currentNodeId: String(state.scene.cursor),
  };
}
