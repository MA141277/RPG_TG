import type { EventId, EventParticipant } from "../../domain/event";
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
