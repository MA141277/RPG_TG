import type { PlayableShell } from "../../core/contracts/playable-runtime";
import {
  ACTIVITY_QTE_COMMAND_PREFIX,
  ACTIVITY_QTE_PLAYABLE_ID,
} from "./contract";

export const manifest: PlayableShell["manifest"] = {
  playableId: ACTIVITY_QTE_PLAYABLE_ID,
  family: "minigame",
  commandPrefix: ACTIVITY_QTE_COMMAND_PREFIX,
};
