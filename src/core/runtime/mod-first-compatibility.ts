import type { EventId, EventParticipant } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import type { PlayableReturnPolicy } from "../contracts/playable-runtime";
import type {
  RuntimeTaskAction,
  RuntimeTaskSignal,
} from "../contracts/runtime-result";

export type ModFirstRuntimeTaskInput =
  | RuntimeTaskAction
  | RuntimeTaskSignal;

export type ModFirstEventBindingOwner = {
  family: string;
  id?: string;
  extra?: Record<string, unknown>;
};

export type ModFirstEventBindingTrigger = {
  timing: string;
  action: string;
  payloadSchemaId?: string;
  extra?: Record<string, unknown>;
};

export type ModFirstEventBindingConditionGroup = {
  operator: "all" | "any" | "not";
  conditions: ModFirstEventBindingConditionNode[];
};

export type ModFirstEventBindingConditionNode =
  | ModFirstEventBindingConditionGroup
  | {
      type: string;
      field?: string;
      operator?: string;
      value?: unknown;
      resolverId?: string;
      extra?: Record<string, unknown>;
    };

export type ModFirstEventBinding = {
  id: string;
  eventId: EventId;
  owner: ModFirstEventBindingOwner;
  trigger: ModFirstEventBindingTrigger;
  conditions?: ModFirstEventBindingConditionGroup;
  priority?: number;
  enabled?: boolean;
  meta?: Record<string, unknown>;
};

export type ModFirstTriggerContext = {
  timing: string;
  action: string;
  owner: {
    family: string;
    id?: string;
  };
  actorCharacterId?: string;
  currentCityId?: string;
  currentHouseId?: string;
  payload?: Record<string, unknown>;
};

export type ModFirstEventRuntimeAction =
  | {
      type: "closeBuilding";
    }
  | {
      type: "launchPlayable";
      playableId: string;
      integrationId: string;
      ownerContext: {
        ownerKind: "house" | "scene" | "dialogue" | "task" | "external";
        ownerId: string | null;
        returnPolicy: PlayableReturnPolicy;
      };
      payload?: Record<string, unknown>;
    }
  | {
      type: "launchFlow";
      flowId: string;
      ownerContext: {
        ownerKind: "house" | "scene" | "dialogue" | "task" | "external";
        ownerId: string | null;
        returnPolicy: PlayableReturnPolicy;
      };
    };

export type ModFirstEventDefinitionOverlay = {
  type?: "settlement";
  dialogueId?: string;
  actions?: ModFirstEventRuntimeAction[];
  settlementId?: string;
  taskInputs?: ModFirstRuntimeTaskInput[];
  participants?: EventParticipant[];
  tags?: string[];
};

const SUPPORTED_EVENT_BINDING_OWNER_FAMILIES = new Set([
  "story",
  "city",
  "building",
]);

const SUPPORTED_EVENT_BINDING_TRIGGER_KEYS = new Set([
  "after:story-progress",
  "after:city-enter",
  "after:building-enter",
  "after:indoor-screen-shown",
  "after:building-container-item-action",
]);

export type RuntimeTriggerContextInput = {
  state: Pick<GameState, "world">;
  owner: ModFirstTriggerContext["owner"];
  timing?: string;
  action: string;
  actorCharacterId?: string;
  payload?: Record<string, unknown>;
};

export function isSupportedEventBindingOwnerFamily(value: string): boolean {
  return SUPPORTED_EVENT_BINDING_OWNER_FAMILIES.has(value);
}

export function isSupportedEventBindingTrigger(
  trigger: Pick<ModFirstEventBindingTrigger, "timing" | "action">
): boolean {
  return SUPPORTED_EVENT_BINDING_TRIGGER_KEYS.has(
    `${trigger.timing}:${trigger.action}`
  );
}

export function createRuntimeTriggerContext(
  input: RuntimeTriggerContextInput
): ModFirstTriggerContext {
  return {
    owner: input.owner,
    timing: input.timing ?? "after",
    action: input.action,
    ...(input.actorCharacterId == null
      ? {}
      : { actorCharacterId: input.actorCharacterId }),
    ...(input.state.world.currentCityId == null
      ? {}
      : { currentCityId: input.state.world.currentCityId }),
    ...(input.state.world.currentHouseId == null
      ? {}
      : { currentHouseId: input.state.world.currentHouseId }),
    ...(input.payload == null ? {} : { payload: input.payload }),
  };
}
