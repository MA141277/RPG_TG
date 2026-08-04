export type MeetingStageType =
  | "dialogue"
  | "summary"
  | "policy-panel"
  | "choice"
  | "assignment-table"
  | "reward"
  | "personnel-update"
  | "action"
  | "branch";

export type MeetingStageDefinition = {
  id: string;
  type: MeetingStageType;
  title?: string;
  dialogueId?: string;
  textLineIds?: string[];
  panelId?: string;
  choiceSetId?: string;
  actionSetId?: string;
  nextStageId?: string;
};
