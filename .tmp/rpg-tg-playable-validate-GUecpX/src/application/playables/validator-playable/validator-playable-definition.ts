import { VALIDATOR_PLAYABLE_PLAYABLE_FAMILY, VALIDATOR_PLAYABLE_PLAYABLE_ID } from "../../../domain/playables/validator-playable";
import { createValidatorPlayableSession } from "./validator-playable-session";
import { presentValidatorPlayable } from "./validator-playable-presenter";
import { createValidatorPlayableSettlement } from "./validator-playable-settlement";

export const validatorPlayableDefinition = {
  playableId: VALIDATOR_PLAYABLE_PLAYABLE_ID,
  family: VALIDATOR_PLAYABLE_PLAYABLE_FAMILY,
  title: "Validator Playable",
  createSession: createValidatorPlayableSession,
  present: presentValidatorPlayable,
  settle: createValidatorPlayableSettlement,
};
