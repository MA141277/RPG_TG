import type { PlayableShell } from "../contracts/playable-runtime";
import {
  createPlayableShellRegistry,
  type PlayableShellRegistry,
} from "./playable-shell-registry";
import { activityQtePlayableShell } from "../../application/playables/activity-qte/shell";
import { templeCopyScripturePlayableShell } from "../../minigames/temple-copy-scripture/shell";
import { cityBeggingPlayableShell } from "../../application/playables/city-begging/shell";
import { grainAccountingPlayableShell } from "../../application/playables/grain-accounting/shell";
import { medicineCompoundingPlayableShell } from "../../application/playables/medicine-compounding/shell";

const builtinPlayableShells: PlayableShell[] = [
  activityQtePlayableShell,
  templeCopyScripturePlayableShell,
  cityBeggingPlayableShell,
  grainAccountingPlayableShell,
  medicineCompoundingPlayableShell,
];

export function installBuiltinPlayableShells(
  registry: PlayableShellRegistry
): void {
  builtinPlayableShells.forEach((shell) => {
    registry.register(shell);
  });
}

export function createBuiltinPlayableShellRegistry(): PlayableShellRegistry {
  const registry = createPlayableShellRegistry();
  installBuiltinPlayableShells(registry);
  return registry;
}

export const builtinPlayableShellRegistry = createBuiltinPlayableShellRegistry();
