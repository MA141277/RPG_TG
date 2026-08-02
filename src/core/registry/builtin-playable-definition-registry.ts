import type { PlayableDefinition } from "../contracts/playable-runtime";
import {
  createPlayableDefinitionRegistry,
  type PlayableDefinitionRegistry,
} from "./playable-definition-registry";
import { activityQtePlayableShell } from "../../application/playables/activity-qte/shell";
import { templeCopyScripturePlayableShell } from "../../minigames/temple-copy-scripture/shell";
import { cityBeggingPlayableShell } from "../../application/playables/city-begging/shell";
import { grainAccountingPlayableShell } from "../../application/playables/grain-accounting/shell";
import { medicineCompoundingPlayableShell } from "../../application/playables/medicine-compounding/shell";

const builtinPlayableDefinitions: PlayableDefinition[] = [
  {
    id: activityQtePlayableShell.manifest.playableId,
    commandPrefix: activityQtePlayableShell.manifest.commandPrefix,
  },
  {
    id: templeCopyScripturePlayableShell.manifest.playableId,
    commandPrefix: templeCopyScripturePlayableShell.manifest.commandPrefix,
  },
  {
    id: cityBeggingPlayableShell.manifest.playableId,
    commandPrefix: cityBeggingPlayableShell.manifest.commandPrefix,
  },
  {
    id: grainAccountingPlayableShell.manifest.playableId,
    commandPrefix: grainAccountingPlayableShell.manifest.commandPrefix,
  },
  {
    id: medicineCompoundingPlayableShell.manifest.playableId,
    commandPrefix: medicineCompoundingPlayableShell.manifest.commandPrefix,
  },
  {
    id: "story-battle",
    commandPrefix: "interactive.story-battle.",
  },
];

export function installBuiltinPlayableDefinitions(
  registry: PlayableDefinitionRegistry
): void {
  builtinPlayableDefinitions.forEach((definition) => {
    registry.register(definition);
  });
}

export function createBuiltinPlayableDefinitionRegistry(): PlayableDefinitionRegistry {
  const registry = createPlayableDefinitionRegistry();
  installBuiltinPlayableDefinitions(registry);
  return registry;
}

export const builtinPlayableDefinitionRegistry =
  createBuiltinPlayableDefinitionRegistry();
