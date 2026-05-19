export type EventId = string;
export type ChapterId = string;
type SceneId = string;
type CharacterId = string;
type CityId = string;
type HouseId = string;

export type EventOccurrence = "once" | "repeatable" | "once-per-chapter";

export type EventTriggerTiming =
  | "manual"
  | "game-start"
  | "date-change"
  | "turn-end"
  | "travel-complete"
  | "city-enter"
  | "house-enter"
  | "indoor-screen-shown"
  | "talk"
  | "custom";

export type EventTriggerScope = {
  cityId?: CityId;
  houseId?: HouseId;
  characterId?: CharacterId;
};

export type EventTrigger = {
  timing: EventTriggerTiming;
  scope?: EventTriggerScope;
  priority?: number;
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
  trigger: EventTrigger;
  conditions: EventConditionNode[];
  participants?: EventParticipant[];
  entrySceneId: SceneId;
  nextEventId?: EventId;
  tags?: string[];
};
