import type { TestPlayableSession } from "../../../domain/playables/test-playable";

export function presentTestPlayable(session: TestPlayableSession) {
  return {
    playableId: session.playableId,
    status: session.status,
  };
}
