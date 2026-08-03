import type { ActivityDefinition } from "../../domain/activity";
import type { CharacterDefinition } from "../../domain/character";
import type { RuntimeDialogueDefinition } from "../../domain/dialogue";
import type { EventDefinition } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import type { FlowPlayableDefinition } from "../../domain/playables/flow";
import type { Effect } from "./effect";
import type { RuntimeTaskInput } from "./runtime-result";

export type DialogueRuntimeSession = {
  dialogueId: string;
  eventId: string | null;
  currentNodeId: string | null;
};

export type DialogueRuntimeInput = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  dialogueDefinitionsById: Record<string, RuntimeDialogueDefinition>;
  eventDefinitionsById: Record<string, EventDefinition>;
  activityDefinitionsById?: Record<string, ActivityDefinition> | undefined;
  flowPlayablesById?: Record<string, FlowPlayableDefinition> | undefined;
  textEntriesById?: Record<string, string> | undefined;
  taskInputs?: RuntimeTaskInput[] | undefined;
};

export type DialogueRuntimeResult = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  session: DialogueRuntimeSession | null;
  taskInputs: RuntimeTaskInput[];
  effects: Effect[];
};
