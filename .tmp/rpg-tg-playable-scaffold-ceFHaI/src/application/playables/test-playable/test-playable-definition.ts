import { TEST_PLAYABLE_PLAYABLE_FAMILY, TEST_PLAYABLE_PLAYABLE_ID } from "../../../domain/playables/test-playable";
import { createTestPlayableSession } from "./test-playable-session";
import { presentTestPlayable } from "./test-playable-presenter";
import { createTestPlayableSettlement } from "./test-playable-settlement";

export const testPlayableDefinition = {
  playableId: TEST_PLAYABLE_PLAYABLE_ID,
  family: TEST_PLAYABLE_PLAYABLE_FAMILY,
  title: "Test Playable",
  createSession: createTestPlayableSession,
  present: presentTestPlayable,
  settle: createTestPlayableSettlement,
};
