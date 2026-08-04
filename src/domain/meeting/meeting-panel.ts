export type MeetingPanelType =
  | "policy-panel"
  | "assignment-table"
  | "summary"
  | "reward"
  | "personnel-update";

export type MeetingPanelSectionDefinition = {
  id?: string;
  title: string;
  value?: string;
  textLineIds?: string[];
};

export type MeetingPanelDefinition = {
  id: string;
  title: string;
  type?: MeetingPanelType;
  subtitle?: string;
  sections: MeetingPanelSectionDefinition[];
};
