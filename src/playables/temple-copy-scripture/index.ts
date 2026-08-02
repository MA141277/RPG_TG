import type { PlayableShell } from "../../core/contracts/playable-runtime";
import { manifest } from "./manifest";
import { createTempleCopyScriptureSession as createSession } from "./session";
import { reduceTempleCopyScripture as reduce } from "./reducer";
import { presentTempleCopyScripture as present } from "./presenter";
import { completeTempleCopyScripture as complete } from "./settlement";

export { manifest } from "./manifest";
export { createTempleCopyScriptureSession as createSession } from "./session";
export { reduceTempleCopyScripture as reduce } from "./reducer";
export { presentTempleCopyScripture as present } from "./presenter";
export { completeTempleCopyScripture as complete } from "./settlement";

export const templeCopyScriptureShell: PlayableShell = {
  manifest,
  createSession,
  reduce,
  present,
  complete,
};
