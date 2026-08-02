import type {
  ActivePlayableSession,
  PlayableLaunchRequest,
} from "../../core/contracts/playable-runtime";
import type {
  TempleCopyScriptureLaunchConfig,
  TempleCopyScripturePrompt,
  TempleCopyScriptureRuntimeState,
  TempleCopyScriptureSession,
} from "./contract";
import { TEMPLE_COPY_SCRIPTURE_PLAYABLE_ID } from "./contract";

const DEFAULT_CHOICES = [
  { id: "trace", label: "依字描摹" },
  { id: "balance", label: "稳腕正锋" },
  { id: "review", label: "核对残页" },
] as const;

function readNonEmptyString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : fallback;
}

function normalizePrompt(
  prompt: TempleCopyScripturePrompt,
  index: number
): TempleCopyScripturePrompt {
  const choices =
    Array.isArray(prompt.choices) && prompt.choices.length > 0
      ? prompt.choices.map((choice, choiceIndex) => ({
          id:
            typeof choice.id === "string" && choice.id.trim().length > 0
              ? choice.id.trim()
              : `choice-${index + 1}-${choiceIndex + 1}`,
          label:
            typeof choice.label === "string" && choice.label.trim().length > 0
              ? choice.label.trim()
              : `抄录手法 ${choiceIndex + 1}`,
        }))
      : DEFAULT_CHOICES.map((choice) => ({ ...choice }));
  const fallbackExpectedChoiceId = choices[0]?.id ?? "trace";
  return {
    id: readNonEmptyString(prompt.id, `prompt-${index + 1}`),
    text: readNonEmptyString(prompt.text, `抄录经卷第 ${index + 1} 段`),
    choices,
    expectedChoiceId:
      choices.some((choice) => choice.id === prompt.expectedChoiceId)
        ? prompt.expectedChoiceId
        : fallbackExpectedChoiceId,
  };
}

function readPrompt(value: unknown, index: number): TempleCopyScripturePrompt {
  const record =
    value != null && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  const rawChoices = Array.isArray(record.choices) ? record.choices : [];
  return normalizePrompt(
    {
      id: typeof record.id === "string" ? record.id : `prompt-${index + 1}`,
      text:
        typeof record.text === "string"
          ? record.text
          : `抄录经卷第 ${index + 1} 段`,
      choices: rawChoices.map((choice, choiceIndex) => {
        const choiceRecord =
          choice != null && typeof choice === "object" && !Array.isArray(choice)
            ? (choice as Record<string, unknown>)
            : {};
        return {
          id:
            typeof choiceRecord.id === "string"
              ? choiceRecord.id
              : `choice-${index + 1}-${choiceIndex + 1}`,
          label:
            typeof choiceRecord.label === "string"
              ? choiceRecord.label
              : `抄录手法 ${choiceIndex + 1}`,
        };
      }),
      expectedChoiceId:
        typeof record.expectedChoiceId === "string"
          ? record.expectedChoiceId
          : "",
    },
    index
  );
}

function readLaunchConfig(
  payload: Record<string, unknown> | undefined
): TempleCopyScriptureLaunchConfig {
  const prompts =
    Array.isArray(payload?.prompts) && payload?.prompts.length > 0
      ? payload.prompts.map((prompt, index) => readPrompt(prompt, index))
      : [
          normalizePrompt(
            {
              id: "prompt-1",
              text: "静心观字，再择最合适的抄录手法。",
              choices: [...DEFAULT_CHOICES],
              expectedChoiceId: "trace",
            },
            0
          ),
        ];

  return {
    title: readNonEmptyString(payload?.title, "寺庙抄经"),
    briefing: readNonEmptyString(
      payload?.briefing,
      "依次完成抄录步骤，尽量少出错。"
    ),
    prompts,
    requiredScore: Math.min(
      prompts.length,
      Math.max(
        1,
        Math.floor(
          typeof payload?.requiredScore === "number"
            ? payload.requiredScore
            : prompts.length
        )
      )
    ),
  };
}

function createTempleCopyScriptureInnerSession(
  config: TempleCopyScriptureLaunchConfig
): TempleCopyScriptureSession {
  return {
    title: config.title,
    briefing: config.briefing,
    prompts: config.prompts,
    requiredScore: config.requiredScore,
    phase: "active",
    currentPromptIndex: 0,
    score: 0,
    mistakes: 0,
    history: [],
  };
}

export function createTempleCopyScriptureSession(
  input: PlayableLaunchRequest
): ActivePlayableSession {
  const state: TempleCopyScriptureRuntimeState = {
    session: createTempleCopyScriptureInnerSession(readLaunchConfig(input.payload)),
  };

  return {
    sessionId: `playable.${TEMPLE_COPY_SCRIPTURE_PLAYABLE_ID}.${input.integrationId}`,
    playableId: TEMPLE_COPY_SCRIPTURE_PLAYABLE_ID,
    integrationId: input.integrationId,
    ownerContext: input.ownerContext,
    status: "active",
    state: state as Record<string, unknown>,
  };
}
