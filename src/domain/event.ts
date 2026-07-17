import type { RuntimeTaskInput } from "../core/contracts/runtime-result";

export type EventId = string;
export type ChapterId = string;
type SceneId = string;
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

export type EventCondition =
  | {
      type: "flag";
      key: string;
      expected: boolean;
    }
  | {
      type: "variable";
      key: string;
      operator: "==" | "!=" | ">=" | "<=" | ">" | "<";
      value: number | string;
    }
  | {
      type: "event-fired";
      eventId: EventId;
      expected?: boolean;
    }
  | {
      type: "event-fired-count";
      eventId: EventId;
      operator: "==" | "!=" | ">=" | "<=" | ">" | "<";
      value: number;
    }
  | {
      type: "months-since-event";
      eventId: EventId;
      operator: ">=" | "<=" | ">" | "<" | "==";
      value: number;
    }
  | {
      type: "chapter";
      chapterId: ChapterId;
    }
  | {
      type: "date";
      operator: "==" | "!=" | ">=" | "<=" | ">" | "<";
      value: {
        year: number;
        month?: number;
        day?: number;
      };
    }
  | {
      type: "location";
      cityId?: CityId;
      houseId?: HouseId;
    }
  | {
      type: "character-exists";
      characterId: CharacterId;
      expected?: boolean;
    }
  | {
      type: "character-available";
      characterId: CharacterId;
      expected?: boolean;
    }
  | {
      type: "character-in-clan";
      characterId: CharacterId;
      clanId: string;
    }
  | {
      type: "character-in-city";
      characterId: CharacterId;
      cityId: CityId;
    }
  | {
      type: "clan-exists";
      clanId: string;
      expected?: boolean;
    }
  | {
      type: "clan-relation";
      leftClanId: string;
      rightClanId: string;
      relation: "ally" | "hostile" | "neutral" | "subordinate";
    }
  | {
      type: "city-owner";
      cityId: CityId;
      clanId: string;
    }
  | {
      type: "mission-status";
      missionId: string;
      status: "inactive" | "active" | "completed" | "failed";
    }
  | {
      type: "custom";
      handlerId: string;
      payload?: Record<string, unknown>;
    };

export type EventConditionNode =
  | EventCondition
  | {
      type: "group";
      operator: "all" | "any" | "not";
      conditions: EventConditionNode[];
    };

export type EventParticipant = {
  role: "player" | "primary" | "secondary" | "support" | "observer";
  characterId: CharacterId;
  required?: boolean;
};

export type EventDefinition = {
  id: EventId;
  chapterId: ChapterId;
  name: string;
  occurrence: EventOccurrence;
  participants?: EventParticipant[];
  entrySceneId: SceneId;
  nextEventId?: EventId;
  taskInputs?: RuntimeTaskInput[];
  tags?: string[];
};
