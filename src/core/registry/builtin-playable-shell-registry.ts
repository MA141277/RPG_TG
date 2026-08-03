import type { PlayableShell } from "../contracts/playable-runtime";
import {
  createPlayableShellRegistry,
  type PlayableShellRegistry,
} from "./playable-shell-registry";
import * as activityQteShellModule from "../../playables/activity-qte/shell";
import * as templeCopyScriptureShellModule from "../../playables/temple-copy-scripture";
import * as cityBeggingShellModule from "../../application/playables/city-begging/shell";
import * as grainAccountingShellModule from "../../application/playables/grain-accounting/shell";
import * as medicineCompoundingShellModule from "../../application/playables/medicine-compounding/shell";

export function installBuiltinPlayableShells(
  registry: PlayableShellRegistry
): void {
  readBuiltinPlayableShells().forEach((shell) => {
    registry.register(shell);
  });
}

function readBuiltinPlayableShells(): PlayableShell[] {
  return [
    activityQteShellModule.activityQtePlayableShell,
    templeCopyScriptureShellModule.templeCopyScriptureShell,
    cityBeggingShellModule.cityBeggingPlayableShell,
    grainAccountingShellModule.grainAccountingPlayableShell,
    medicineCompoundingShellModule.medicineCompoundingPlayableShell,
  ];
}

export function createBuiltinPlayableShellRegistry(): PlayableShellRegistry {
  const registry = createPlayableShellRegistry();
  installBuiltinPlayableShells(registry);
  return registry;
}

let lazyBuiltinPlayableShellRegistry: PlayableShellRegistry | null = null;

function readBuiltinPlayableShellRegistry(): PlayableShellRegistry {
  if (lazyBuiltinPlayableShellRegistry == null) {
    lazyBuiltinPlayableShellRegistry = createBuiltinPlayableShellRegistry();
  }
  return lazyBuiltinPlayableShellRegistry;
}

export const builtinPlayableShellRegistry: PlayableShellRegistry = {
  register(shell) {
    readBuiltinPlayableShellRegistry().register(shell);
  },
  get(playableId) {
    return readBuiltinPlayableShellRegistry().get(playableId);
  },
};
