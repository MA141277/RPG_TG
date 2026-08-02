import type { PlayableShell } from "../../core/contracts/playable-runtime";
import {
  TEMPLE_COPY_SCRIPTURE_COMMAND_PREFIX,
  TEMPLE_COPY_SCRIPTURE_PLAYABLE_ID,
} from "./contract";

export const manifest: PlayableShell["manifest"] = {
  playableId: TEMPLE_COPY_SCRIPTURE_PLAYABLE_ID,
  family: "minigame",
  commandPrefix: TEMPLE_COPY_SCRIPTURE_COMMAND_PREFIX,
};
