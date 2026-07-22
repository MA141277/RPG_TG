import type { RuntimeTaskInput } from "../core/contracts/runtime-result";
import type { PlayableReturnPolicy } from "../core/contracts/playable-runtime";

export type EventId = string;
export type ChapterId = string;
type CharacterId = string;
type CityId = string;
type HouseId = string;

export type EventOccurrence = "once" | "repeatable" | "once-per-chapter";

export type EventBindingOwner = {
  family: string;
  id?: string;
  extra?: Record<string, unknown>;
};

export type EventBindingTrigger = {
  timing: string;
  action: string;
  payloadSchemaId?: string;
  extra?: Record<string, unknown>;
};

export type EventBindingConditionGroup = {
  operator: "all" | "any" | "not";
  conditions: EventBindingConditionNode[];
};

export type EventBindingConditionNode =
  | EventBindingConditionGroup
  | {
      type: string;
      field?: string;
      operator?: string;
      value?: unknown;
      resolverId?: string;
      extra?: Record<string, unknown>;
    };

export type EventBinding = {
  id: string;
  eventId: EventId;
  owner: EventBindingOwner;
  trigger: EventBindingTrigger;
  conditions?: EventBindingConditionGroup;
  priority?: number;
  enabled?: boolean;
  meta?: Record<string, unknown>;
};

export type TriggerContext = {
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

export type EventParticipant = {
  role: "player" | "primary" | "secondary" | "support" | "observer";
  characterId: CharacterId;
  required?: boolean;
};

export type EventRuntimeAction = {
  type: "closeBuilding";
} | {
  type: "launchPlayable";
  playableId: string;
  integrationId: string;
  ownerContext: {
    ownerKind: "house" | "dialogue" | "task" | "external";
    ownerId: string | null;
    returnPolicy: PlayableReturnPolicy;
  };
} | {
  type: "launchFlow";
  flowId: string;
  ownerContext: {
    ownerKind: "house" | "dialogue" | "task" | "external";
    ownerId: string | null;
    returnPolicy: PlayableReturnPolicy;
  };
};

export type EventDefinition = {
  id: EventId;
  chapterId: ChapterId;
  name: string;
  occurrence: EventOccurrence;
  participants?: EventParticipant[];
  dialogueId: string;
  actions?: EventRuntimeAction[];
  nextEventId?: EventId;
  taskInputs?: RuntimeTaskInput[];
  tags?: string[];
};
