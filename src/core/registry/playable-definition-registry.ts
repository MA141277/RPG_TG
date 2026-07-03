import type {
  PlayableDefinition,
  PlayableId,
} from "../contracts/playable-runtime";

export type PlayableDefinitionRegistry = {
  register(definition: PlayableDefinition): void;
  get(playableId: PlayableId): PlayableDefinition | null;
  getByLegacyInteractiveKind(kind: string): PlayableDefinition | null;
  matchActionId(actionId: string): PlayableDefinition | null;
  entries(): PlayableDefinition[];
};

const builtinPlayableDefinitions: PlayableDefinition[] = [
  {
    id: "activity-qte",
    family: "minigame",
    commandPrefix: "interactive.activity-qte.",
    legacyInteractiveKind: "activity-qte",
  },
  {
    id: "city-begging",
    family: "minigame",
    commandPrefix: "interactive.city-begging.",
    legacyInteractiveKind: "city-begging",
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
    legacyInteractiveKind: "story-battle",
  },
];

export function createPlayableDefinitionRegistry(
  definitions: PlayableDefinition[] = []
): PlayableDefinitionRegistry {
  const definitionsById = new Map<PlayableId, PlayableDefinition>();
  const definitionsByLegacyInteractiveKind = new Map<string, PlayableDefinition>();

  const register = (definition: PlayableDefinition): void => {
    definitionsById.set(definition.id, definition);
    if (definition.legacyInteractiveKind != null) {
      definitionsByLegacyInteractiveKind.set(
        definition.legacyInteractiveKind,
        definition
      );
    }
  };

  definitions.forEach(register);

  return {
    register,
    get(playableId) {
      return definitionsById.get(playableId) ?? null;
    },
    getByLegacyInteractiveKind(kind) {
      return definitionsByLegacyInteractiveKind.get(kind) ?? null;
    },
    matchActionId(actionId) {
      for (const definition of definitionsById.values()) {
        if (actionId.startsWith(definition.commandPrefix)) {
          return definition;
        }
      }
      return null;
    },
    entries() {
      return Array.from(definitionsById.values());
    },
  };
}

export function createBuiltinPlayableDefinitionRegistry(): PlayableDefinitionRegistry {
  return createPlayableDefinitionRegistry(builtinPlayableDefinitions);
}

export const builtinPlayableDefinitionRegistry =
  createBuiltinPlayableDefinitionRegistry();
