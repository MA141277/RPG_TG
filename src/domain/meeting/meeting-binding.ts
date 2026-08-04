import type { MeetingHostScopeFamily } from "./meeting-definition";

export type MeetingBindingOwnerDefinition = {
  family: MeetingHostScopeFamily;
  id: string;
  templateId?: string;
};

export type MeetingBindingTriggerDefinition = {
  action: string;
  itemId?: string;
  targetId?: string;
  view?: string;
};

export type MeetingBindingDefinition = {
  id: string;
  meetingId: string;
  owner: MeetingBindingOwnerDefinition;
  trigger: MeetingBindingTriggerDefinition;
  priority?: number;
};
