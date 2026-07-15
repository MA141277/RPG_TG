import type { GameState } from "../../domain/game-state";
import type { SceneRuntimeSession } from "../contracts/scene-runtime";

export function createSceneSession(
  state: Pick<GameState, "scene">
): SceneRuntimeSession | null {
  if (state.scene.activeSceneId == null) {
    return null;
  }

  return {
    sceneId: state.scene.activeSceneId,
    eventId: state.scene.activeEventId,
    currentNodeId: String(state.scene.cursor),
  };
}
