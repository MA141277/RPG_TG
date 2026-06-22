import type { Effect } from "./action";

export type ActivityId = string;
export type ActivityHandlerId = string;

export const GENERIC_QTE_ACTIVITY_HANDLER_ID = "generic.qte";

export type ActivityQteTuning = {
  totalRounds: number;
  requiredSuccesses: number;
};

export type ActivityOutcomeDefinition = {
  completedFlagKey?: string;
  gradeVariableKey?: string;
  scoreVariableKey?: string;
  effects?: Effect[];
};

export type ActivityDefinition = {
  id: ActivityId;
  label: string;
  handlerId: ActivityHandlerId;
  fallbackHandlerId?: ActivityHandlerId;
  staminaCost?: number;
  timeAdvanceCost?: number;
  qte?: ActivityQteTuning;
  outcome?: ActivityOutcomeDefinition;
  tags?: string[];
};

export type FlowStepDefinition =
  | {
      type: "start-event";
      eventId: string;
    }
  | {
      type: "enter-house";
      houseId: string;
    }
  | {
      type: "set-stage";
      key: string;
      value: string;
    }
  | {
      type: "start-activity";
      activityId: ActivityId;
      fallbackActivityId?: ActivityId;
    };

export type FlowSlotDefinition = {
  slotId: string;
  trigger: {
    timing:
      | "game-start"
      | "city-enter"
      | "house-enter"
      | "turn-end"
      | "manual";
    cityId?: string;
    houseId?: string;
  };
  conditionIds?: string[];
  steps: FlowStepDefinition[];
};

export type FlowDefinition = {
  id: string;
  ownerScenarioId: string;
  slots: FlowSlotDefinition[];
};
