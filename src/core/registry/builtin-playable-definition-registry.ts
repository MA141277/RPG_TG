import type { PlayableDefinition } from "../contracts/playable-runtime";
import {
  createPlayableDefinitionRegistry,
  type PlayableDefinitionRegistry,
} from "./playable-definition-registry";

const builtinPlayableDefinitions: PlayableDefinition[] = [
  {
    id: "activity-qte",
    commandPrefix: "playable.activity-qte.",
  },
  {
    id: "city-begging",
    commandPrefix: "playable.city-begging.",
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
    id: "temple-copy-scripture",
    commandPrefix: "playable.temple-copy-scripture.",
  },
  {
    id: "story-battle",
    commandPrefix: "playable.story-battle.",
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
