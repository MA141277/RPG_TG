import type { PlayableDefinition } from "../contracts/playable-runtime";
import {
  createPlayableDefinitionRegistry,
  type PlayableDefinitionRegistry,
} from "./playable-definition-registry";
import {
  manifest as templeCopyScriptureManifest,
} from "../../playables/temple-copy-scripture";

const builtinPlayableDefinitions: PlayableDefinition[] = [
  {
    id: "activity-qte",
    commandPrefix: "interactive.activity-qte.",
  },
  {
    id: templeCopyScriptureManifest.playableId,
    commandPrefix: templeCopyScriptureManifest.commandPrefix,
  },
  {
    id: "city-begging",
    commandPrefix: "interactive.city-begging.",
  },
  {
    id: "grain-accounting",
    commandPrefix: "playable.grain-accounting.",
  },
  {
    id: "medicine-compounding",
    commandPrefix: "playable.medicine-compounding.",
  },
  {
    id: "story-battle",
    commandPrefix: "interactive.story-battle.",
  },
  {
    id: "building-flow",
    commandPrefix: "playable.building-flow.",
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
