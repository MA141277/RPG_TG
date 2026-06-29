import type { ChoiceOption, SceneDefinition } from "../../domain/action";
import type { CharacterDefinition } from "../../domain/character";
import type { EventDefinition } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import { resolveChoiceOption } from "../../application/scene/choice-resolver";

export function resolveSceneChoice(input: {
  state: GameState;
  selectedOption: ChoiceOption;
  sceneDefinitionsById: Record<string, SceneDefinition>;
  eventDefinitionsById: Record<string, EventDefinition>;
  characterDefinitions: CharacterDefinition[];
}) {
  return resolveChoiceOption(input.state, input.selectedOption, {
    sceneDefinitionsById: input.sceneDefinitionsById,
    eventDefinitionsById: input.eventDefinitionsById,
    characterDefinitions: input.characterDefinitions,
  });
}
