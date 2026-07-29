import type { PlayableDefinition } from "../contracts/playable-runtime";
import {
  createPlayableDefinitionRegistry,
  type PlayableDefinitionRegistry,
} from "./playable-definition-registry";

const builtinPlayableDefinitions: PlayableDefinition[] = [
  {
    id: "activity-qte",
    family: "minigame",
    commandPrefix: "interactive.activity-qte.",
  },
  {
    id: "city-begging",
    family: "minigame",
    commandPrefix: "interactive.city-begging.",
  },
  {
    id: "grain-accounting",
    family: "minigame",
    commandPrefix: "playable.grain-accounting.",
  },
  {
    id: "medicine-compounding",
    family: "minigame",
    commandPrefix: "playable.medicine-compounding.",
  },
  {
    id: "story-battle",
    family: "battle",
    commandPrefix: "interactive.story-battle.",
  },
  {
    id: "building-flow",
    family: "flow",
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
