import type { MeetingCompletionDefinition } from "./meeting-definition";

export type MeetingSessionStatus =
  | "running"
  | "completed"
  | "cancelled"
  | "blocked";

export type MeetingReturnTargetDefinition = {
  type: "building" | "city" | "view";
  id: string;
  view?: string;
};

export type MeetingHostContext = {
  hostFamily: "building" | "city" | "organization" | "faction";
  hostId: string;
  returnTarget: MeetingReturnTargetDefinition;
  primarySpeakerCharacterId?: string;
  participantCharacterIds: string[];
};

export type MeetingSessionState = {
  meetingId: string;
  hostContext: MeetingHostContext;
  currentStageId: string;
  visitedStageIds: string[];
  selectedChoiceIds: string[];
  derivedState: Record<string, unknown>;
  status: MeetingSessionStatus;
};

export type MeetingRuntimeCompletion = MeetingCompletionDefinition;
