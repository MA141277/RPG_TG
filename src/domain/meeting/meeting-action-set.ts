export type MeetingActionType =
  | "set-flag"
  | "set-variable"
  | "assign-task"
  | "grant-reward"
  | "update-membership"
  | "trigger-event"
  | "start-map-auto-advance";

export type MeetingActionDefinition =
  | {
      id: string;
      type: "set-flag";
      flagId: string;
      value: boolean;
    }
  | {
      id: string;
      type: "set-variable";
      variableId: string;
      value: string | number;
    }
  | {
      id: string;
      type: "assign-task";
      taskId: string;
      assigneeCharacterId?: string;
    }
  | {
      id: string;
      type: "grant-reward";
      rewardId: string;
      amount?: number;
    }
  | {
      id: string;
      type: "update-membership";
      membershipId: string;
      operation: "add" | "remove" | "promote" | "demote";
      targetCharacterId?: string;
    }
  | {
      id: string;
      type: "trigger-event";
      eventId: string;
    }
  | {
      id: string;
      type: "start-map-auto-advance";
      targetHouseId: string;
      days?: number;
    };

export type MeetingActionSetDefinition = {
  id: string;
  actions: MeetingActionDefinition[];
};
