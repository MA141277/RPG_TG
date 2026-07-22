import type { CharacterId } from "./character";

export type LocationAccessTargetFamily = "city" | "building";

export type LocationAccessConditionSubject =
  | "event"
  | "person"
  | "time"
  | "targetCity"
  | "targetBuilding"
  | "player"
  | "world"
  | "story";

export type LocationAccessValueRef =
  | {
      type: "field";
      subject: LocationAccessConditionSubject;
      entityId?: string;
      fieldId: string;
    }
  | {
      type: "literal";
      value: unknown;
    };

export type LocationAccessConditionExpression =
  | { type: "literal"; value: boolean }
  | {
      type: "compare";
      left: LocationAccessValueRef;
      operator:
        | "equals"
        | "not-equals"
        | "greater-than"
        | "greater-than-or-equal"
        | "less-than"
        | "less-than-or-equal"
        | "includes"
        | "exists";
      right?: LocationAccessValueRef;
    }
  | { type: "all"; conditions: LocationAccessConditionExpression[] }
  | { type: "any"; conditions: LocationAccessConditionExpression[] }
  | { type: "not"; condition: LocationAccessConditionExpression };

export type LocationAccessDefinition = {
  id: string;
  targetFamily: LocationAccessTargetFamily;
  targetId: string;
  conditionExpression: LocationAccessConditionExpression;
  blockedReason?: string;
  blockedTitle?: string;
  blockedMessage?: string;
  blockedSpeakerId?: CharacterId | "player";
  guidance?: string;
};

export type LocationAccessResult =
  | { canEnter: true; refusal: null }
  | {
      canEnter: false;
      refusal: {
        ruleId: string;
        speakerCharacterId: CharacterId;
        title: string;
        text: string;
        confirmLabel: string;
      } | null;
    };
