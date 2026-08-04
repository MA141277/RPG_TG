import type { MeetingStageDefinition } from "./meeting-stage";

export type MeetingHostScopeFamily =
  | "building"
  | "city"
  | "organization"
  | "faction";

export type MeetingHostScopeDefinition = {
  family: MeetingHostScopeFamily;
  templateId?: string;
};

export type MeetingCompletionDefinition =
  | {
      type: "return-to-host";
    }
  | {
      type: "follow-up-event";
      eventId: string;
    }
  | {
      type: "start-map-auto-advance";
      targetHouseId: string;
      days?: number;
    };

export type MeetingDefinition = {
  id: string;
  hostScope: MeetingHostScopeDefinition;
  initialStageId: string;
  stageIds: string[];
  stagesById: Record<string, MeetingStageDefinition>;
  completion?: MeetingCompletionDefinition;
};
