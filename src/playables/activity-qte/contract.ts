import type { CharacterDefinition } from "../../domain/character";
import type { RuntimeState } from "../../core/contracts/runtime-state";

export const ACTIVITY_QTE_PLAYABLE_ID = "activity-qte";
export const ACTIVITY_QTE_COMMAND_PREFIX = "playable.activity-qte.";

export type ActivityQtePlayableResult = {
  state: RuntimeState;
  characterDefinitions: CharacterDefinition[];
  completed: boolean;
};
