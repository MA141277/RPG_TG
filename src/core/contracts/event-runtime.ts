import type { CharacterDefinition } from "../../domain/character";
import type { EventDefinition } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import type { TriggerEvaluationInput } from "../../application/events/trigger-evaluator";
import type { RuntimeRequest } from "./runtime-request";
import type { RuntimeTaskAction } from "./runtime-result";

export type EventRuntimeCandidate = {
  eventId: string;
  priority: number;
  sceneId?: string | null;
  taskActions?: RuntimeTaskAction[];
};

export type EventRuntimeInput = {
  request: RuntimeRequest;
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  eventDefinitionsById: Record<string, EventDefinition>;
  triggerInput: TriggerEvaluationInput;
};
