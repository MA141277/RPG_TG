import type { PlayableShell } from "../contracts/playable-runtime";
import {
  createPlayableShellRegistry,
  type PlayableShellRegistry,
} from "./playable-shell-registry";
import { templeCopyScriptureShell } from "../../playables/temple-copy-scripture";

const builtinPlayableShells: PlayableShell[] = [templeCopyScriptureShell];

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
