import type { EventId } from "./event";
import type { ActivityId } from "./activity";

export type SceneId = string;
export type BackgroundId = string;
export type MusicId = string;
export type ChoiceId = string;

type CharacterId = string;

export type DialogueSide = "left" | "right" | "center";

export type Condition =
  | { type: "flag"; key: string; expected: boolean }
  | { type: "variable"; key: string; operator: "==" | "!=" | ">=" | "<=" | ">" | "<"; value: number | string }
  | { type: "character-present"; characterId: CharacterId };

export type Effect =
  | { type: "set-flag"; key: string; value: boolean }
  | { type: "set-variable"; key: string; value: number | string }
  | { type: "change-variable"; key: string; delta: number }
  | {
      type: "patch-character";
      characterId: CharacterId;
      changes: {
        title?: string | null;
        occupation?: string | null;
        biography?: string | null;
        houseId?: string | null;
        clanId?: string | null;
        affiliationLabel?: string | null;
      };
    }
  | { type: "modify-character-stat"; characterId: CharacterId; stat: string; delta: number }
  | { type: "start-mission"; missionId: string }
  | { type: "finish-mission"; missionId: string };

export type ChoiceOption = {
  id: ChoiceId;
  label?: string;
  labelTextId?: string;
  nextSceneId?: SceneId;
  nextEventId?: EventId;
  effects?: Effect[];
  conditions?: Condition[];
};

export type ActionNode =
  | {
      type: "background";
      backgroundId: BackgroundId;
    }
  | {
      type: "music";
      musicId: MusicId;
      loop?: boolean;
    }
  | {
      type: "narration";
      text?: string;
      textId?: string;
    }
  | {
      type: "dialogue";
      characterId: CharacterId;
      side: DialogueSide;
      text?: string;
      textId?: string;
      portraitId?: string;
    }
  | {
      type: "choice";
      prompt?: string;
      promptTextId?: string;
      options: ChoiceOption[];
    }
  | {
      type: "effect";
      effects: Effect[];
    }
  | {
      type: "jump";
      nextSceneId: SceneId;
    }
  | {
      type: "start-event";
      eventId: EventId;
    }
  | {
      type: "start-activity";
      activityId: ActivityId;
      fallbackActivityId?: ActivityId;
    }
  | {
      type: "callback";
      handlerId: string;
      payload?: Record<string, unknown>;
    };

export type SceneDefinition = {
  id: SceneId;
  name: string;
  actions: ActionNode[];
};
