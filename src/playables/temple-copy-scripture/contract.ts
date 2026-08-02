export const TEMPLE_COPY_SCRIPTURE_PLAYABLE_ID = "temple-copy-scripture";
export const TEMPLE_COPY_SCRIPTURE_COMMAND_PREFIX =
  "playable.temple-copy-scripture.";

export type TempleCopyScriptureChoice = {
  id: string;
  label: string;
};

export type TempleCopyScripturePrompt = {
  id: string;
  text: string;
  choices: TempleCopyScriptureChoice[];
  expectedChoiceId: string;
};

export type TempleCopyScriptureLaunchConfig = {
  title: string;
  briefing: string;
  prompts: TempleCopyScripturePrompt[];
  requiredScore: number;
};

export type TempleCopyScriptureCommand =
  | {
      type: "choose";
      choiceId: string;
    }
  | {
      type: "cancel";
    };

export type TempleCopyScriptureHistoryEntry = {
  promptId: string;
  promptText: string;
  selectedChoiceId: string;
  selectedChoiceLabel: string;
  expectedChoiceId: string;
  expectedChoiceLabel: string;
  success: boolean;
};

export type TempleCopyScriptureSession = {
  title: string;
  briefing: string;
  prompts: TempleCopyScripturePrompt[];
  requiredScore: number;
  phase: "active" | "completed" | "cancelled";
  currentPromptIndex: number;
  score: number;
  mistakes: number;
  history: TempleCopyScriptureHistoryEntry[];
};

export type TempleCopyScriptureCompletion = {
  outcome: "success" | "failure" | "cancelled";
  score: number;
  mistakes: number;
  completedPrompts: number;
  title: string;
  summaryLines: string[];
};

export type TempleCopyScripturePresenterModel = {
  title: string;
  briefing: string;
  summaryLines: string[];
  progressLabel: string;
  promptText: string;
  choices: TempleCopyScriptureChoice[];
  feedbackLine: string;
};

export type TempleCopyScriptureRuntimeState = {
  session: TempleCopyScriptureSession;
  completion?: TempleCopyScriptureCompletion | undefined;
};
