import type { EventId } from "./event";
import type { ActivityId } from "./activity";
import type { CharacterId } from "./character";
import type { SpecialBackpackItemInstance } from "./item";

export type SceneId = string;
export type BackgroundId = string;
export type MusicId = string;
export type ChoiceId = string;

type GridCoordinate = {
  x: number;
  y: number;
};

type CoordinateSpace = {
  width: number;
  height: number;
};

type HexCoordinateSystem = {
  hexTerrainScale: number;
  hexMapAspect: number;
  coordinateSpace: CoordinateSpace;
  hexPointBounds?: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    };
};

export type DialogueSide = "left" | "right" | "center";

export type Condition =
  | { type: "flag"; key: string; expected: boolean }
  | { type: "variable"; key: string; operator: "==" | "!=" | ">=" | "<=" | ">" | "<"; value: number | string }
  | { type: "character-present"; characterId: CharacterId };

export type Effect =
  | { type: "set-flag"; key: string; value: boolean }
  | { type: "set-variable"; key: string; value: number | string }
  | { type: "change-variable"; key: string; delta: number }
  | { type: "grant-special-item"; item: SpecialBackpackItemInstance }
  | {
      type: "queue-map-return-effects";
      id: string;
      delayMs?: number;
      effects: Effect[];
    }
  | {
      type: "reveal-map-coordinate";
      mapId: string;
      coordinate: GridCoordinate;
      coordinateSpace: CoordinateSpace;
      coordinateSystem?: HexCoordinateSystem;
      revealedAtMs?: number;
      animateNewHexes?: boolean;
    }
  | { type: "set-main-mission-text"; text: string }
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
  | {
      type: "set-faction-affiliation";
      characterId: CharacterId;
      factionId: string;
      factionName: string;
      joinedBy: string;
      sourceEventId?: string;
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
      type: "reward";
      title: string;
      lines: string[];
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
