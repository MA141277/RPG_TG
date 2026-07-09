import type {
  PlayableDefinition,
  PlayableId,
} from "../contracts/playable-runtime";

export type PlayableDefinitionRegistry = {
  register(definition: PlayableDefinition): void;
  get(playableId: PlayableId): PlayableDefinition | null;
  matchActionId(actionId: string): PlayableDefinition | null;
  entries(): PlayableDefinition[];
};

export function createPlayableDefinitionRegistry(
  definitions: PlayableDefinition[] = []
): PlayableDefinitionRegistry {
  const definitionsById = new Map<PlayableId, PlayableDefinition>();

  const register = (definition: PlayableDefinition): void => {
    definitionsById.set(definition.id, definition);
  };

  definitions.forEach(register);

  return {
    register,
    get(playableId) {
      return definitionsById.get(playableId) ?? null;
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
