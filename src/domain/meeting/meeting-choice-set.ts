export type MeetingChoiceConditionDefinition =
  | {
      type: "always";
    }
  | {
      type: "flag-set";
      flagId: string;
    }
  | {
      type: "flag-equals";
      flagId: string;
      value: boolean;
    }
  | {
      type: "variable-equals" | "variable-gte" | "variable-lte";
      variableId: string;
      value: string | number;
    };

export type MeetingChoiceDefinition = {
  id: string;
  label: string;
  disabledHint?: string;
  nextStageId?: string;
  actionSetId?: string;
  conditions?: MeetingChoiceConditionDefinition[];
};

export type MeetingChoiceSetDefinition = {
  id: string;
  title?: string;
  choices: MeetingChoiceDefinition[];
};
