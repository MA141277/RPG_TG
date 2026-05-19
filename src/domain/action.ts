import type { EventId } from "./event";

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
  | { type: "modify-character-stat"; characterId: CharacterId; stat: string; delta: number }
  | { type: "start-mission"; missionId: string }
  | { type: "finish-mission"; missionId: string };

export type ChoiceOption = {
  id: ChoiceId;
  label: string;
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
      type: "dialogue";
      characterId: CharacterId;
      side: DialogueSide;
      text: string;
      portraitId?: string;
    }
  | {
      type: "choice";
      prompt?: string;
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
      type: "callback";
      handlerId: string;
      payload?: Record<string, unknown>;
    };

export type SceneDefinition = {
  id: SceneId;
  name: string;
  actions: ActionNode[];
};
