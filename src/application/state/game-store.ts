import type { CharacterDefinition } from "../../domain/character";
import type { EventDefinition } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import type { ActivityDefinition } from "../../domain/activity";
import type {
  RuntimeDialogueChoiceOption,
  RuntimeDialogueDefinition,
} from "../../domain/dialogue";
import { resolveDialogueChoiceOption } from "../dialogue/dialogue-choice-resolver";
import {
  advanceDialogue,
  runDialogueUntilPause,
} from "../dialogue/dialogue-runner";

export type GameContent = {
  characterDefinitions: CharacterDefinition[];
  eventDefinitionsById: Record<string, EventDefinition>;
  dialogueDefinitionsById: Record<string, RuntimeDialogueDefinition>;
  activityDefinitionsById?: Record<string, ActivityDefinition> | undefined;
  textEntriesById?: Record<string, string> | undefined;
};

export type GameStoreSnapshot = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  currentAction: RuntimeDialogueDefinition["nodes"][number] | null;
};

export function createGameStore(initialState: GameState, content: GameContent) {
  let state = initialState;
  let characterDefinitions = content.characterDefinitions;
  let currentAction: RuntimeDialogueDefinition["nodes"][number] | null = null;

  return {
    getSnapshot(): GameStoreSnapshot {
      return {
        state,
        characterDefinitions,
        currentAction,
      };
    },
    syncDialogue(): GameStoreSnapshot {
      const result = runDialogueUntilPause(state, {
        dialogueDefinitionsById: content.dialogueDefinitionsById,
        eventDefinitionsById: content.eventDefinitionsById,
        activityDefinitionsById: content.activityDefinitionsById,
        characterDefinitions,
        textEntriesById: content.textEntriesById,
      });

      state = result.state;
      characterDefinitions = result.characterDefinitions;
      currentAction = result.currentAction;

      return this.getSnapshot();
    },
    advanceDialogue(): GameStoreSnapshot {
      const result = advanceDialogue(state, {
        dialogueDefinitionsById: content.dialogueDefinitionsById,
        eventDefinitionsById: content.eventDefinitionsById,
        activityDefinitionsById: content.activityDefinitionsById,
        characterDefinitions,
        textEntriesById: content.textEntriesById,
      });

      state = result.state;
      characterDefinitions = result.characterDefinitions;
      currentAction = result.currentAction;

      return this.getSnapshot();
    },
    chooseOption(selectedOption: RuntimeDialogueChoiceOption): GameStoreSnapshot {
      const result = resolveDialogueChoiceOption(state, selectedOption, {
        eventDefinitionsById: content.eventDefinitionsById,
        characterDefinitions,
      });

      state = result.state;
      characterDefinitions = result.characterDefinitions;

      return this.syncDialogue();
    },
    replaceState(nextState: GameState): GameStoreSnapshot {
      state = nextState;
      return this.getSnapshot();
    },
  };
}
