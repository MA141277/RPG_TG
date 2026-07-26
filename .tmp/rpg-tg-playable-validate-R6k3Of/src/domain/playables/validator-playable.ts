export const VALIDATOR_PLAYABLE_PLAYABLE_ID = "validator-playable" as const;
export const VALIDATOR_PLAYABLE_PLAYABLE_FAMILY = "battle" as const;

export type ValidatorPlayableSession = {
  playableId: typeof VALIDATOR_PLAYABLE_PLAYABLE_ID;
  status: "idle" | "active" | "completed";
};
