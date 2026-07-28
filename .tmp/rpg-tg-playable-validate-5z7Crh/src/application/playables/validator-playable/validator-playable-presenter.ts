import type { ValidatorPlayableSession } from "../../../domain/playables/validator-playable";

export function presentValidatorPlayable(session: ValidatorPlayableSession) {
  return {
    playableId: session.playableId,
    status: session.status,
  };
}
