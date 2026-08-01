import type {
  PlayableDefinition,
  PlayableId,
  PlayableIntegrationId,
} from "../../core/contracts/playable-runtime";

export const TEMPLE_COPY_SCRIPTURE_PLAYABLE_ID =
  "temple-copy-scripture" as PlayableId;
export const TEMPLE_COPY_SCRIPTURE_COMMAND_PREFIX =
  "interactive.temple-copy-scripture.";
export const TEMPLE_COPY_SCRIPTURE_HOUSE_INTEGRATION_ID =
  "playable.temple-copy-scripture.house.temple" as PlayableIntegrationId;

export const templeCopyScripturePlayableDefinition: PlayableDefinition = {
  id: TEMPLE_COPY_SCRIPTURE_PLAYABLE_ID,
  commandPrefix: TEMPLE_COPY_SCRIPTURE_COMMAND_PREFIX,
};
