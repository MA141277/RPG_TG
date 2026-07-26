import { VALIDATOR_PLAYABLE_PLAYABLE_ID, type ValidatorPlayableSession } from "../../../domain/playables/validator-playable";

export function createValidatorPlayableSession(): ValidatorPlayableSession {
  return {
    playableId: VALIDATOR_PLAYABLE_PLAYABLE_ID,
    status: "idle",
  };
}
