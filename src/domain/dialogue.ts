import type { EventId } from "./event";
import type { ActivityId } from "./activity";

export type DialogueId = string;
export type BackgroundId = string;
export type MusicId = string;
export type DialogueChoiceId = string;
type CharacterId = string;

export type DialogueSide = "left" | "right" | "center";

export type DialogueCondition =
  | { type: "flag"; key: string; expected: boolean }
  | {
      type: "variable";
      key: string;
      operator: "==" | "!=" | ">=" | "<=" | ">" | "<";
      value: number | string;
    }
  | { type: "character-present"; characterId: CharacterId };

export type DialogueEffect =
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

export type RuntimeDialogueChoiceOption = {
  id: DialogueChoiceId;
  label?: string;
  labelTextId?: string;
  nextDialogueId?: DialogueId;
  nextEventId?: EventId;
  effects?: DialogueEffect[];
  conditions?: DialogueCondition[];
};

export type RuntimeDialogueCastMember = {
  characterId: CharacterId;
  side: DialogueSide;
};

export type RuntimeDialogueScreenDefinition =
  | {
      mode: "linear";
      textId: string;
      speakerCharacterId: CharacterId;
      cast: RuntimeDialogueCastMember[];
      nextEventId?: EventId;
    }
  | {
      mode: "choice";
      textId: string;
      speakerCharacterId: CharacterId;
      cast: RuntimeDialogueCastMember[];
      options: RuntimeDialogueChoiceOption[];
    };

export type RuntimeDialogueNode =
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
      options: RuntimeDialogueChoiceOption[];
    }
  | {
      type: "effect";
      effects: DialogueEffect[];
    }
  | {
      type: "jump";
      nextDialogueId: DialogueId;
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

export type RuntimeDialogueDefinition = {
  id: DialogueId;
  name: string;
  nodes?: RuntimeDialogueNode[];
  screen?: RuntimeDialogueScreenDefinition;
};
