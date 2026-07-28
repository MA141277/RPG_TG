export const TEST_PLAYABLE_PLAYABLE_ID = "test-playable" as const;
export const TEST_PLAYABLE_PLAYABLE_FAMILY = "minigame" as const;

export type TestPlayableSession = {
  playableId: typeof TEST_PLAYABLE_PLAYABLE_ID;
  status: "idle" | "active" | "completed";
};
