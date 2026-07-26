import { TEST_PLAYABLE_PLAYABLE_ID, type TestPlayableSession } from "../../../domain/playables/test-playable";

export function createTestPlayableSession(): TestPlayableSession {
  return {
    playableId: TEST_PLAYABLE_PLAYABLE_ID,
    status: "idle",
  };
}
