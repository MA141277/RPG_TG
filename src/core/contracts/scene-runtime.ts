import type { CharacterDefinition } from "../../domain/character";
import type { SceneDefinition } from "../../domain/action";
import type { ActivityDefinition } from "../../domain/activity";
import type { EventDefinition } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import type { Effect } from "./effect";
import type { RuntimeTaskInput } from "./runtime-result";

export type SceneRuntimeSession = {
  sceneId: string;
  eventId: string | null;
  currentNodeId: string | null;
};

export type SceneRuntimeInput = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  sceneDefinitionsById: Record<string, SceneDefinition>;
  eventDefinitionsById: Record<string, EventDefinition>;
  activityDefinitionsById?: Record<string, ActivityDefinition> | undefined;
  textEntriesById?: Record<string, string> | undefined;
};

export type SceneRuntimeResult = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  session: SceneRuntimeSession | null;
  taskInputs: RuntimeTaskInput[];
  effects: Effect[];
};
