import type {
  NpcAiDialogueChoiceOption,
  NpcAiDialogueProvider,
  NpcAiDialogueProviderRequest,
  NpcAiDialogueStep,
} from "../../domain/npc-ai-dialogue";
import type {
  HouseConversationRoute,
} from "../../domain/house-conversation";
import {
  parsePipeDelimitedChoiceOption,
  parseTxtNarrativeMarkerScript,
} from "../txt-narrative/txt-narrative-marker-parser";
import {
  resolveAvailableHouseConversationRoute,
} from "../house-conversation/select-house-conversation-capability-snapshot";
import {
  buildHouseConversationIntentGateRepairRequest,
  buildHouseConversationIntentGateRequest,
  buildHouseConversationRouteTransitionRequest,
  resolveHouseConversationIntentGateDecision,
} from "./npc-ai-house-intent-gate";

export const NPC_AI_DIALOGUE_PROVIDER_STORAGE_KEY =
  "rpg_tg.npc_ai.provider";
export const NPC_AI_DIALOGUE_FORMAT_DEBUG_LOG_STORAGE_KEY =
  "rpg_tg.npc_ai.format_failures";

type NpcAiDialogueProviderGlobal = {
  __RPG_TG_NPC_AI_CONFIG__?: unknown;
  localStorage?: {
    getItem(key: string): string | null;
    setItem?(key: string, value: string): void;
  };
};

type StructuredSseConfig = {
  mode?: "structured-sse";
  streamUrl: string;
  authToken?: string;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
  timeoutMs?: number;
};

type ZipVisualSessionConfig = {
  mode: "zip-visual-session";
  baseUrl: string;
  sessionId: string;
  authToken?: string;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
  timeoutMs?: number;
};

type OpenAiCompatibleConfig = {
  mode: "openai-compatible";
  baseUrl: string;
  model: string;
  fallbackModels?: string[];
  authToken?: string;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
  stream?: boolean;
  temperature?: number;
  timeoutMs?: number;
};

export type NpcAiDialogueExternalConfig =
  | StructuredSseConfig
  | ZipVisualSessionConfig
  | OpenAiCompatibleConfig;

type FetchImplementation = typeof fetch;

type ExternalProviderFactoryInput = {
  config: NpcAiDialogueExternalConfig;
  fetchImplementation?: FetchImplementation;
  globalObject?: NpcAiDialogueProviderGlobal;
};

type ConfiguredProviderFactoryInput = {
  globalObject?: NpcAiDialogueProviderGlobal;
  fetchImplementation?: FetchImplementation;
  fallbackProvider: NpcAiDialogueProvider;
};

type ExternalProviderRequest = {
  url: string;
  body: unknown;
  headers: Record<string, string>;
  credentials?: RequestCredentials;
  responseMode: "structured-sse" | "openai-compatible";
  expectStream?: boolean;
};

const NPC_AI_DIALOGUE_DEFAULT_REQUEST_TIMEOUT_MS = 30_000;
const NPC_AI_DIALOGUE_MAX_FORMAT_REPAIR_ATTEMPTS = 1;
const NPC_AI_DIALOGUE_MAX_ACTION_ROUTE_REPAIR_ATTEMPTS = 1;
const NPC_AI_DIALOGUE_MAX_HOUSE_ROUTE_REPAIR_ATTEMPTS = 1;

const ACTION_ROUTE_SYSTEM = [
  "你是历史题材游戏的功能路由器。",
  "你的唯一任务，是判断玩家刚才这句话是否已经明确要求办理当前地点已有功能。",
  "如果已经明确要求办理当前地点已有功能，必须只输出 [ACTION: exact_action_id]。",
  "如果没有明确要求办理功能，必须只输出 [ACTION: none]。",
  "只能从当前允许的 action id 中选择。",
  "禁止输出任何解释、寒暄、对话、[CHOICE]、[OPTION]、英文标签或其他文本。",
].join("\n");

const ACTION_TRANSITION_SYSTEM = [
  "你是历史题材的 NPC 对话主持人。",
  "本轮已经确认玩家要直接办理当前地点已有功能。",
  "输出必须只使用保留标记：[NARRATION]、[DIALOGUE]。",
  "必须输出至少 1 句符合人设的寒暄、说明或引导。",
  "禁止输出 [ACTION]、[CHOICE]、[OPTION] 或 [END_CHOICE]。",
  "不要输出任何额外解释。",
].join("\n");

const PLACEHOLDER_OPTION_TEXT = new Set([
  "benevolent",
  "neutral",
  "hostile",
  "friendly",
  "good",
  "evil",
  "reply",
  "main",
  "mainline",
  "side",
  "recommended",
  "善意",
  "中立",
  "恶意",
  "善意回应",
  "中立回应",
  "恶意回应",
]);

type NpcAiDialogueFormatIssueCategory = "choice" | "handoff";

type NpcAiDialogueFormatIssue = {
  category: NpcAiDialogueFormatIssueCategory;
  message: string;
};

type NpcAiDialogueFormatFailureDiagnostic = {
  recordedAt: number;
  requestId: string;
  npcId: string;
  npcName: string;
  inputType: NpcAiDialogueProviderRequest["metadata"]["inputType"];
  category: NpcAiDialogueFormatIssueCategory;
  issue: string;
  userMessage: string;
  rawText: string;
  phase: "repair" | "final-error";
  houseId?: string;
  placeName?: string;
};

function createNpcAiDialogueFormatIssue(
  category: NpcAiDialogueFormatIssueCategory,
  message: string
): NpcAiDialogueFormatIssue {
  return {
    category,
    message,
  };
}

function resolveNpcAiDialogueFormatIssueUserMessage(
  issue: NpcAiDialogueFormatIssue
): string {
  return issue.category === "handoff"
    ? "NPC AI 功能交接格式不正确，请稍后重试。"
    : "NPC AI 对话选项格式不正确，请稍后重试。";
}

function truncateNpcAiDebugRawText(value: string): string {
  const trimmedValue = value.trim();
  return trimmedValue.length <= 1000
    ? trimmedValue
    : `${trimmedValue.slice(0, 1000)}…`;
}

function readNpcAiDialogueFormatFailureDiagnostics(
  globalObject: NpcAiDialogueProviderGlobal | undefined
): NpcAiDialogueFormatFailureDiagnostic[] {
  const rawValue = globalObject?.localStorage?.getItem(
    NPC_AI_DIALOGUE_FORMAT_DEBUG_LOG_STORAGE_KEY
  );
  if (rawValue == null || rawValue.trim().length === 0) {
    return [];
  }

  try {
    const parsedValue: unknown = JSON.parse(rawValue);
    return Array.isArray(parsedValue)
      ? parsedValue.filter(
          (entry): entry is NpcAiDialogueFormatFailureDiagnostic =>
            isRecord(entry) &&
            typeof entry.requestId === "string" &&
            typeof entry.issue === "string" &&
            typeof entry.rawText === "string"
        )
      : [];
  } catch {
    return [];
  }
}

function appendNpcAiDialogueFormatFailureDiagnostic(input: {
  globalObject: NpcAiDialogueProviderGlobal | undefined;
  request: NpcAiDialogueProviderRequest;
  issue: NpcAiDialogueFormatIssue;
  rawText: string;
  phase: "repair" | "final-error";
}): void {
  const setItem = input.globalObject?.localStorage?.setItem;
  if (setItem == null) {
    return;
  }

  const nextEntry: NpcAiDialogueFormatFailureDiagnostic = {
    recordedAt: Date.now(),
    requestId: input.request.requestId,
    npcId: input.request.metadata.npcId,
    npcName: input.request.metadata.npcName,
    inputType: input.request.metadata.inputType,
    category: input.issue.category,
    issue: input.issue.message,
    userMessage: resolveNpcAiDialogueFormatIssueUserMessage(input.issue),
    rawText: truncateNpcAiDebugRawText(input.rawText),
    phase: input.phase,
    ...(input.request.metadata.houseId == null
      ? {}
      : { houseId: input.request.metadata.houseId }),
    ...(input.request.metadata.placeName == null
      ? {}
      : { placeName: input.request.metadata.placeName }),
  };

  try {
    const existingEntries = readNpcAiDialogueFormatFailureDiagnostics(
      input.globalObject
    );
    setItem(
      NPC_AI_DIALOGUE_FORMAT_DEBUG_LOG_STORAGE_KEY,
      JSON.stringify([...existingEntries, nextEntry].slice(-20))
    );
  } catch {}
}

function escapeChoiceLabel(value: string): string {
  return value.trim();
}

function hasTxtNarrativeMarkers(rawText: string): boolean {
  return /\[(?:DIALOGUE|NARRATION|CHOICE|OPTION|ACTION|END_CHOICE)\s*:|\[END_CHOICE\]/u.test(
    rawText
  );
}

const ACTION_MARKER_PATTERN = /\[ACTION:\s*([^\]\r\n]+?)\s*\]/gu;
const ROUTE_MARKER_PATTERN = /\[ROUTE:\s*([^\]\r\n]+?)\s*\]/gu;
const CHOICE_MARKER_PATTERN = /\[CHOICE:\s*([^\]\r\n]+?)\s*\]/gu;
const OPTION_MARKER_PATTERN = /\[OPTION:\s*([^\]\r\n]+?)\s*\]/gu;
const SHORTHAND_NARRATIVE_MARKER_PATTERN = /\[(?:NARRATION|DIALOGUE)\]/gu;
const END_CHOICE_MARKER_PATTERN = /\[END_CHOICE\]/gu;

function extractActionStepsFromRawText(rawText: string): {
  cleanedText: string;
  actionSteps: NpcAiDialogueStep[];
} {
  const actionSteps: NpcAiDialogueStep[] = [];
  const cleanedText = rawText
    .replace(ACTION_MARKER_PATTERN, (_, rawActionId: string) => {
      const actionId = normalizeNonEmptyString(rawActionId);
      if (actionId != null) {
        actionSteps.push({
          type: "action",
          actionId,
        });
      }

      return "";
    })
    .trim();

  return {
    cleanedText,
    actionSteps,
  };
}

function sanitizeFallbackNarrativeText(rawText: string): string {
  return rawText
    .replace(ACTION_MARKER_PATTERN, " ")
    .replace(ROUTE_MARKER_PATTERN, " ")
    .replace(CHOICE_MARKER_PATTERN, " ")
    .replace(OPTION_MARKER_PATTERN, " ")
    .replace(END_CHOICE_MARKER_PATTERN, " ")
    .replace(SHORTHAND_NARRATIVE_MARKER_PATTERN, " ")
    .replace(/[ \t]+\n/gu, "\n")
    .replace(/\n[ \t]+/gu, "\n")
    .replace(/[ \t]{2,}/gu, " ")
    .trim();
}

function looksLikeInternalSpeakerToken(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.length === 0 || /[\u3400-\u9fff]/u.test(trimmed)) {
    return false;
  }

  if (/^[A-Z0-9_]+$/u.test(trimmed)) {
    return true;
  }

  return /[._:-]/u.test(trimmed);
}

function normalizeDialogueStepForRequest(
  step: Extract<NpcAiDialogueStep, { type: "dialogue" }>,
  request: NpcAiDialogueProviderRequest
): Extract<NpcAiDialogueStep, { type: "dialogue" }> {
  const activeNpcId = normalizeNonEmptyString(request.metadata.npcId);
  const activeNpcName = normalizeNonEmptyString(request.metadata.npcName);
  if (activeNpcId == null || activeNpcName == null) {
    return step;
  }

  if (
    step.speakerName === step.speakerId &&
    step.speakerName !== activeNpcName
  ) {
    return {
      ...step,
      speakerId: activeNpcId,
      speakerName: activeNpcName,
    };
  }

  if (
    step.speakerId === activeNpcId &&
    looksLikeInternalSpeakerToken(step.speakerName)
  ) {
    return {
      ...step,
      speakerName: activeNpcName,
    };
  }

  return step;
}

function normalizeStepForRequest(
  step: NpcAiDialogueStep,
  request: NpcAiDialogueProviderRequest
): NpcAiDialogueStep {
  if (step.type === "dialogue") {
    return normalizeDialogueStepForRequest(step, request);
  }

  if (step.type === "choice") {
    return {
      ...step,
      options: step.options.map((option) => {
        const directText =
          normalizeNonEmptyString(option.actionText) ??
          normalizeNonEmptyString(option.label) ??
          "继续";
        return {
          ...option,
          label: escapeChoiceLabel(directText),
          actionText: directText,
        };
      }),
    };
  }

  return step;
}

function normalizeStepsForRequest(
  steps: NpcAiDialogueStep[],
  request: NpcAiDialogueProviderRequest
): NpcAiDialogueStep[] {
  return steps.map((step) => normalizeStepForRequest(step, request));
}

function toNpcAiDialogueSteps(
  rawText: string,
  request: NpcAiDialogueProviderRequest
): NpcAiDialogueStep[] {
  const { cleanedText, actionSteps } = extractActionStepsFromRawText(rawText);
  const textSteps = normalizeStepsForRequest(
    parseTxtNarrativeMarkerScript(cleanedText).flatMap((step) => {
      if (
        step.type === "narration" ||
        step.type === "dialogue" ||
        step.type === "choice"
      ) {
        return [step];
      }

      return [];
    }),
    request
  );

  if (textSteps.length === 0 && cleanedText.length > 0) {
    return [
      ...buildFallbackNarrativeSteps({
        request,
        text: cleanedText,
      }),
      ...actionSteps,
    ];
  }

  return [...textSteps, ...actionSteps];
}

function buildFallbackNarrativeSteps(input: {
  request: NpcAiDialogueProviderRequest;
  text: string;
}): NpcAiDialogueStep[] {
  const text = input.text.trim();
  if (text.length === 0) {
    return [];
  }

  const speakerId = normalizeNonEmptyString(input.request.metadata.npcId);
  const speakerName =
    normalizeNonEmptyString(input.request.metadata.npcName) ?? speakerId;
  if (speakerId != null && speakerName != null) {
    return [
      {
        type: "dialogue",
        speakerId,
        speakerName,
        text,
      },
    ];
  }

  return [
    {
      type: "narration",
      text,
    },
  ];
}

function resolveForcedHandoffFallbackText(
  request: NpcAiDialogueProviderRequest
): string {
  const forcedRoute = request.metadata.forcedHouseConversationRoute;
  if (forcedRoute != null) {
    switch (forcedRoute.kind) {
      case "switch-target-npc":
        return "行，这就替你招呼一声。";
      case "go-to-house":
        return "行，我给你指个路。";
      case "leave-house":
        return "行，你自便。";
      case "negotiate-story-node":
        return "行，那就接着谈这件事。";
      case "open-house-action":
      case "settle-house-service":
      case "continue-dialogue":
      default:
        return "行，这就替你张罗。";
    }
  }

  if (normalizeNonEmptyString(request.metadata.forcedSpecialActionId) != null) {
    return "行，这就替你张罗。";
  }

  return "行。";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value != null && !Array.isArray(value);
}

function normalizeNonEmptyString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

function normalizeStringList(value: unknown): string[] | undefined {
  if (Array.isArray(value)) {
    const normalizedValues = value
      .map((entry) => normalizeNonEmptyString(entry))
      .filter((entry): entry is string => entry != null);

    return normalizedValues.length === 0 ? undefined : normalizedValues;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const normalizedValues = value
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

  return normalizedValues.length === 0 ? undefined : normalizedValues;
}

function normalizeHeaders(value: unknown): Record<string, string> | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const headers: Record<string, string> = {};
  for (const [key, headerValue] of Object.entries(value)) {
    const normalizedKey = key.trim();
    if (normalizedKey.length === 0 || typeof headerValue !== "string") {
      continue;
    }

    headers[normalizedKey] = headerValue;
  }

  return Object.keys(headers).length === 0 ? undefined : headers;
}

function normalizeCredentials(value: unknown): RequestCredentials | undefined {
  if (
    value === "include" ||
    value === "omit" ||
    value === "same-origin"
  ) {
    return value;
  }

  return undefined;
}

function normalizeBoolean(value: unknown): boolean | undefined {
  if (typeof value === "boolean") {
    return value;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return undefined;
}

function normalizeFiniteNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return undefined;
  }

  const nextValue = Number(trimmed);
  return Number.isFinite(nextValue) ? nextValue : undefined;
}

function normalizeTimeoutMs(value: unknown): number | undefined {
  const nextValue = normalizeFiniteNumber(value);
  if (nextValue == null || nextValue <= 0) {
    return undefined;
  }

  return Math.max(1, Math.round(nextValue));
}

function normalizeBaseConfig(
  value: Record<string, unknown>
): {
  authToken?: string;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
  timeoutMs?: number;
} {
  const authToken = normalizeNonEmptyString(value.authToken);
  const headers = normalizeHeaders(value.headers);
  const credentials = normalizeCredentials(value.credentials);
  const timeoutMs = normalizeTimeoutMs(value.timeoutMs);

  return {
    ...(authToken == null ? {} : { authToken }),
    ...(headers == null ? {} : { headers }),
    ...(credentials == null ? {} : { credentials }),
    ...(timeoutMs == null ? {} : { timeoutMs }),
  };
}

function normalizeExternalConfig(
  value: unknown
): NpcAiDialogueExternalConfig | null {
  if (!isRecord(value)) {
    return null;
  }

  const mode =
    value.mode === "zip-visual-session" ||
    value.mode === "structured-sse" ||
    value.mode === "openai-compatible"
      ? value.mode
      : undefined;

  if (mode === "zip-visual-session") {
    const baseUrl = normalizeNonEmptyString(value.baseUrl);
    const sessionId = normalizeNonEmptyString(value.sessionId);
    if (baseUrl == null || sessionId == null) {
      return null;
    }

    return {
      mode: "zip-visual-session",
      baseUrl,
      sessionId,
      ...normalizeBaseConfig(value),
    };
  }

  if (mode === "openai-compatible") {
    const baseUrl = normalizeNonEmptyString(value.baseUrl);
    const model = normalizeNonEmptyString(value.model);
    if (baseUrl == null || model == null) {
      return null;
    }

    const fallbackModels = normalizeStringList(value.fallbackModels);
    const stream = normalizeBoolean(value.stream);
    const temperature = normalizeFiniteNumber(value.temperature);

    return {
      mode: "openai-compatible",
      baseUrl,
      model,
      ...(fallbackModels == null ? {} : { fallbackModels }),
      ...normalizeBaseConfig(value),
      ...(stream == null ? {} : { stream }),
      ...(temperature == null ? {} : { temperature }),
    };
  }

  const streamUrl = normalizeNonEmptyString(value.streamUrl);
  if (streamUrl == null) {
    return null;
  }

  return {
    ...(mode == null ? {} : { mode }),
    streamUrl,
    ...normalizeBaseConfig(value),
  };
}

function resolveExternalConfig(
  globalObject: NpcAiDialogueProviderGlobal
): NpcAiDialogueExternalConfig | null {
  const fromGlobal = normalizeExternalConfig(
    globalObject.__RPG_TG_NPC_AI_CONFIG__
  );
  if (fromGlobal != null) {
    return fromGlobal;
  }

  const rawStorageValue = globalObject.localStorage?.getItem(
    NPC_AI_DIALOGUE_PROVIDER_STORAGE_KEY
  );
  if (rawStorageValue == null || rawStorageValue.trim().length === 0) {
    return null;
  }

  try {
    return normalizeExternalConfig(JSON.parse(rawStorageValue));
  } catch {
    return null;
  }
}

function normalizeChoiceOption(
  value: unknown,
  index: number
): NpcAiDialogueChoiceOption | null {
  if (typeof value === "string") {
    const text = normalizeNonEmptyString(value);
    if (text == null) {
      return null;
    }

    const parsedPipeOption = parsePipeDelimitedChoiceOption(text, index);
    if (parsedPipeOption != null) {
      return {
        id: parsedPipeOption.id,
        label: escapeChoiceLabel(parsedPipeOption.label),
        actionText: parsedPipeOption.actionText.trim(),
        ...(parsedPipeOption.kind == null ? {} : { kind: parsedPipeOption.kind }),
        ...(parsedPipeOption.recommended == null
          ? {}
          : { recommended: parsedPipeOption.recommended }),
      };
    }

    return {
      id: `option.${index + 1}`,
      label: escapeChoiceLabel(text),
      actionText: text,
    };
  }

  if (!isRecord(value)) {
    return null;
  }

  const id = normalizeNonEmptyString(value.id) ?? `option.${index + 1}`;
  const label =
    normalizeNonEmptyString(value.label) ??
    normalizeNonEmptyString(value.actionText) ??
    normalizeNonEmptyString(value.text) ??
    normalizeNonEmptyString(value.value) ??
    `选项${index + 1}`;
  const actionText =
    normalizeNonEmptyString(value.actionText) ??
    normalizeNonEmptyString(value.text) ??
    normalizeNonEmptyString(value.label) ??
    label;
  const kind =
    normalizeNonEmptyString(value.kind) ??
    (value.isMain === true ? "main" : undefined) ??
    normalizeNonEmptyString(value.source) ??
    undefined;
  const recommended =
    typeof value.recommended === "boolean"
      ? value.recommended
      : value.isMain === true
        ? true
        : undefined;

  return {
    id,
    label: escapeChoiceLabel(label),
    actionText: actionText.trim(),
    ...(kind == null ? {} : { kind }),
    ...(recommended == null ? {} : { recommended }),
  };
}

function normalizeChoiceOptions(
  value: unknown
): NpcAiDialogueChoiceOption[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((option, index) => normalizeChoiceOption(option, index))
    .filter((option): option is NpcAiDialogueChoiceOption => option != null);
}

function normalizeDialogueStep(value: Record<string, unknown>) {
  const text = normalizeNonEmptyString(value.text);
  if (text == null) {
    return null;
  }

  const speakerId = normalizeNonEmptyString(value.speakerId);
  const speakerName = normalizeNonEmptyString(value.speakerName);
  if (speakerId == null || speakerName == null) {
    return {
      type: "narration" as const,
      text,
    };
  }

  return {
    type: "dialogue" as const,
    speakerId,
    speakerName,
    text,
  };
}

function normalizeChoiceStep(value: Record<string, unknown>) {
  const options = normalizeChoiceOptions(value.options);
  if (options.length === 0) {
    return null;
  }

  const prompt = normalizeNonEmptyString(value.prompt) ?? undefined;
  return {
    type: "choice" as const,
    ...(prompt == null ? {} : { prompt }),
    options,
  };
}

function normalizeActionStep(value: Record<string, unknown>) {
  const actionId =
    normalizeNonEmptyString(value.actionId) ??
    normalizeNonEmptyString(value.id) ??
    normalizeNonEmptyString(value.action);
  if (actionId == null) {
    return null;
  }

  return {
    type: "action" as const,
    actionId,
  };
}

function normalizeStep(value: unknown): NpcAiDialogueStep | null {
  if (!isRecord(value)) {
    return null;
  }

  if (value.type === "narration") {
    const text = normalizeNonEmptyString(value.text);
    return text == null
      ? null
      : {
          type: "narration",
          text,
        };
  }

  if (value.type === "dialogue") {
    return normalizeDialogueStep(value);
  }

  if (value.type === "choice") {
    return normalizeChoiceStep(value);
  }

  if (value.type === "action") {
    return normalizeActionStep(value);
  }

  return null;
}

function normalizeSteps(value: unknown): NpcAiDialogueStep[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((step) => {
    const normalizedStep = normalizeStep(step);
    return normalizedStep == null ? [] : [normalizedStep];
  });
}

function deriveZipVisualActionText(
  request: NpcAiDialogueProviderRequest
): string {
  if (request.metadata.inputType === "start_talk") {
    const npcName = request.metadata.npcName.trim();
    return `开始和${npcName.length === 0 ? "这个人" : npcName}交谈`;
  }

  if (request.metadata.inputType === "select_option") {
    return (
      request.metadata.selectedOptionLabel ??
      request.metadata.selectedOptionId ??
      "继续交谈"
    );
  }

  return request.metadata.customInputText?.trim() || "继续交谈";
}

function trimTrailingSlashes(value: string): string {
  return value.replace(/\/+$/u, "");
}

function buildOpenAiCompatibleMessages(
  request: NpcAiDialogueProviderRequest
): Array<{
  role: "system" | "user" | "assistant";
  content: string;
}> {
  return [
    {
      role: "system",
      content: request.system,
    },
    ...request.messages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
  ];
}

function buildRequestHeaders(
  config: NpcAiDialogueExternalConfig
): Record<string, string> {
  const headers: Record<string, string> = {
    Accept:
      config.mode === "openai-compatible"
        ? config.stream === true
          ? "text/event-stream"
          : "application/json"
        : "text/event-stream",
    "Content-Type": "application/json",
    ...(config.headers ?? {}),
  };

  if (config.authToken != null) {
    headers.Authorization = `Bearer ${config.authToken}`;
  }

  return headers;
}

function resolveRequestTimeoutMs(config: NpcAiDialogueExternalConfig): number {
  return config.timeoutMs ?? NPC_AI_DIALOGUE_DEFAULT_REQUEST_TIMEOUT_MS;
}

function buildOpenAiCompatibleModelAttempts(
  config: OpenAiCompatibleConfig
): string[] {
  const uniqueModels = new Set<string>();

  for (const candidate of [config.model, ...(config.fallbackModels ?? [])]) {
    if (candidate.length === 0 || uniqueModels.has(candidate)) {
      continue;
    }

    uniqueModels.add(candidate);
  }

  return [...uniqueModels];
}

function buildExternalProviderRequest(input: {
  config: NpcAiDialogueExternalConfig;
  request: NpcAiDialogueProviderRequest;
  modelOverride?: string;
}): ExternalProviderRequest {
  if (input.config.mode === "zip-visual-session") {
    return {
      responseMode: "structured-sse",
      url: `${trimTrailingSlashes(input.config.baseUrl)}/api/visual/session/${
        input.config.sessionId
      }/action/stream`,
      body: {
        action: deriveZipVisualActionText(input.request),
      },
      headers: buildRequestHeaders(input.config),
      ...(input.config.credentials == null
        ? {}
        : { credentials: input.config.credentials }),
    };
  }

  if (input.config.mode === "openai-compatible") {
    const model = input.modelOverride ?? input.config.model;

    return {
      responseMode: "openai-compatible",
      expectStream: input.config.stream === true,
      url: `${trimTrailingSlashes(input.config.baseUrl)}/v1/chat/completions`,
      body: {
        model,
        stream: input.config.stream === true,
        ...(input.config.temperature == null
          ? {}
          : { temperature: input.config.temperature }),
        messages: buildOpenAiCompatibleMessages(input.request),
      },
      headers: buildRequestHeaders(input.config),
      ...(input.config.credentials == null
        ? {}
        : { credentials: input.config.credentials }),
    };
  }

  return {
    responseMode: "structured-sse",
    url: input.config.streamUrl,
    body: input.request,
    headers: buildRequestHeaders(input.config),
    ...(input.config.credentials == null
      ? {}
      : { credentials: input.config.credentials }),
  };
}

async function consumeStructuredSseResponse(input: {
  response: Response;
  onPayload: (payload: unknown, eventName: string | null) => Promise<void> | void;
}): Promise<void> {
  const body = input.response.body;
  if (body == null) {
    throw new Error("NPC AI SSE response body is unavailable.");
  }

  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let pendingLines: string[] = [];

  async function flushPendingLines(): Promise<void> {
    if (pendingLines.length === 0) {
      return;
    }

    let eventName: string | null = null;
    const dataLines: string[] = [];

    for (const line of pendingLines) {
      if (line.startsWith(":")) {
        continue;
      }

      if (line.startsWith("event:")) {
        const nextEventName = line.slice("event:".length).trim();
        eventName = nextEventName.length === 0 ? null : nextEventName;
        continue;
      }

      if (line.startsWith("data:")) {
        dataLines.push(line.slice("data:".length).trimStart());
      }
    }

    pendingLines = [];
    if (dataLines.length === 0) {
      return;
    }

    const rawPayload = dataLines.join("\n").trim();
    if (rawPayload.length === 0) {
      return;
    }

    let payload: unknown = rawPayload;
    try {
      payload = JSON.parse(rawPayload);
    } catch {}

    await input.onPayload(payload, eventName);
  }

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    let newlineIndex = buffer.indexOf("\n");

    while (newlineIndex >= 0) {
      let line = buffer.slice(0, newlineIndex);
      buffer = buffer.slice(newlineIndex + 1);
      if (line.endsWith("\r")) {
        line = line.slice(0, -1);
      }

      if (line.length === 0) {
        await flushPendingLines();
      } else {
        pendingLines.push(line);
      }

      newlineIndex = buffer.indexOf("\n");
    }
  }

  buffer += decoder.decode();
  const trailingLine = buffer.trim();
  if (trailingLine.length > 0) {
    pendingLines.push(trailingLine);
  }
  await flushPendingLines();
}

function resolveCompletePayload(input: {
  payload: Record<string, unknown>;
  rawTextBuffer: string;
  streamedSteps: NpcAiDialogueStep[];
  request: NpcAiDialogueProviderRequest;
}): {
  rawText: string;
  allSteps: NpcAiDialogueStep[];
} | null {
  const responseRawText =
    normalizeNonEmptyString(input.payload.response) ??
    normalizeNonEmptyString(input.payload.rawText) ??
    normalizeNonEmptyString(input.payload.narrative);
  const rawText = responseRawText ?? input.rawTextBuffer.trim();
  const payloadSteps =
    normalizeSteps(input.payload.allSteps).length > 0
      ? normalizeSteps(input.payload.allSteps)
      : normalizeSteps(input.payload.narrativeSteps).length > 0
        ? normalizeSteps(input.payload.narrativeSteps)
        : normalizeSteps(input.payload.steps);
  const structuredTextSteps =
    rawText.length === 0 || !hasTxtNarrativeMarkers(rawText)
      ? []
      : toNpcAiDialogueSteps(rawText, input.request);
  const sanitizedFallbackText = sanitizeFallbackNarrativeText(rawText);
  const textFallbackSteps =
    sanitizedFallbackText.length === 0
      ? []
      : buildFallbackNarrativeSteps({
          request: input.request,
          text: sanitizedFallbackText,
        });
  const payloadChoiceOptions = normalizeChoiceOptions(input.payload.options);
  const payloadChoiceStep =
    payloadChoiceOptions.length === 0
      ? null
      : {
          type: "choice" as const,
          prompt:
            normalizeNonEmptyString(input.payload.prompt) ?? "你想怎么接话？",
          options: payloadChoiceOptions,
        };
  const resolvedSteps =
    payloadSteps.length > 0
      ? payloadSteps
      : structuredTextSteps.length > 0
        ? structuredTextSteps
        : rawText.length > 0
          ? textFallbackSteps
          : [...input.streamedSteps];
  const allSteps =
    payloadChoiceStep == null ||
    resolvedSteps.some(
      (step) => step.type === "choice" || step.type === "action"
    )
      ? resolvedSteps
      : [...resolvedSteps, payloadChoiceStep];
  const forcedSpecialActionId = normalizeNonEmptyString(
    input.request.metadata.forcedSpecialActionId
  );
  const forcedHouseConversationRoute =
    input.request.metadata.forcedHouseConversationRoute;
  const forcedHandoffLeadInSteps =
    forcedSpecialActionId == null && forcedHouseConversationRoute == null
      ? []
      : resolvedSteps.filter(
          (
            step
          ): step is Extract<
            NpcAiDialogueStep,
            { type: "narration" | "dialogue" }
          > => step.type === "narration" || step.type === "dialogue"
        );
  const resolvedForcedHandoffLeadInSteps =
    forcedSpecialActionId == null &&
    forcedHouseConversationRoute == null
      ? []
      : forcedHandoffLeadInSteps.length > 0
        ? forcedHandoffLeadInSteps
        : buildFallbackNarrativeSteps({
            request: input.request,
            text: resolveForcedHandoffFallbackText(input.request),
          });
  const resolvedAllSteps =
    forcedHouseConversationRoute != null
      ? [
          ...resolvedForcedHandoffLeadInSteps,
          {
            type: "route" as const,
            route: forcedHouseConversationRoute,
          },
        ]
      : forcedSpecialActionId != null
        ? [
            ...resolvedForcedHandoffLeadInSteps,
            {
              type: "action" as const,
              actionId: forcedSpecialActionId,
            },
          ]
        : allSteps;

  if (rawText.length === 0 && resolvedAllSteps.length === 0) {
    return null;
  }

  return {
    rawText,
    allSteps: normalizeStepsForRequest(resolvedAllSteps, input.request),
  };
}

function summarizeAvailableSpecialActions(
  request: NpcAiDialogueProviderRequest
): string | null {
  const availableSpecialActions = request.metadata.availableSpecialActions ?? [];
  if (availableSpecialActions.length === 0) {
    return null;
  }

  return availableSpecialActions
    .map((action) => `${action.id}：${action.label}`)
    .join("；");
}

function normalizeOptionSemanticText(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase()
    .replace(/[\s\u3000]+/gu, "")
    .replace(/[|"'`“”‘’()[\]{}<>《》「」【】]/gu, "");
}

function containsCjkText(value: string): boolean {
  return /[\u3400-\u9fff]/u.test(value);
}

function isPlaceholderOptionText(value: string): boolean {
  const normalizedValue = normalizeOptionSemanticText(value);
  if (normalizedValue.length === 0) {
    return true;
  }

  if (PLACEHOLDER_OPTION_TEXT.has(normalizedValue)) {
    return true;
  }

  return (
    /^option\d+$/u.test(normalizedValue) ||
    /^reply\d*$/u.test(normalizedValue) ||
    /^option\d*reply$/u.test(normalizedValue)
  );
}

function resolveChoiceOptionSemanticIssue(
  option: NpcAiDialogueChoiceOption
): string | null {
  const actionText = normalizeNonEmptyString(option.actionText);
  const label = normalizeNonEmptyString(option.label);
  const directText = actionText ?? label;
  if (directText == null) {
    return "每个 OPTION 都必须包含玩家会直接说出口的中文台词。";
  }

  if (isPlaceholderOptionText(directText)) {
    return "每个 OPTION 都必须是玩家会直接说出口的中文台词，不能只返回 benevolent、neutral、hostile 或善意回应这类占位词。";
  }

  if (!containsCjkText(directText)) {
    return "每个 OPTION 都必须直接写成中文台词，不能只返回英文标签或占位内容。";
  }

  return null;
}

function resolveChoiceStepFormatIssue(
  steps: NpcAiDialogueStep[],
  request: NpcAiDialogueProviderRequest
): NpcAiDialogueFormatIssue | null {
  const actionSteps = steps.filter(
    (step): step is Extract<NpcAiDialogueStep, { type: "action" }> =>
      step.type === "action"
  );
  const routeSteps = steps.filter(
    (step): step is Extract<NpcAiDialogueStep, { type: "route" }> =>
      step.type === "route"
  );
  const choiceSteps = steps.filter(
    (step): step is Extract<NpcAiDialogueStep, { type: "choice" }> =>
      step.type === "choice"
  );
  const hasLeadInStep = steps.some(
    (step) => step.type === "narration" || step.type === "dialogue"
  );

  if (actionSteps.length > 0 || routeSteps.length > 0) {
    if (actionSteps.length > 0 && routeSteps.length > 0) {
      return createNpcAiDialogueFormatIssue(
        "handoff",
        "不能同时返回 [ACTION] 和 route handoff。"
      );
    }

    if (actionSteps.length !== 1) {
      if (routeSteps.length !== 1) {
        return createNpcAiDialogueFormatIssue(
          "handoff",
          "最多只允许返回 1 个 route handoff。"
        );
      }
    }

    if (actionSteps.length > 1) {
      return createNpcAiDialogueFormatIssue(
        "handoff",
        "最多只允许返回 1 个 [ACTION]。"
      );
    }

    if (routeSteps.length > 1) {
      return createNpcAiDialogueFormatIssue(
        "handoff",
        "最多只允许返回 1 个 route handoff。"
      );
    }

    if (choiceSteps.length > 0) {
      return createNpcAiDialogueFormatIssue(
        "handoff",
        "输出 handoff 时禁止同时输出 [CHOICE]。"
      );
    }

    if (!hasLeadInStep) {
      return createNpcAiDialogueFormatIssue(
        "handoff",
        "输出 handoff 前必须先给出至少 1 句符合人设的旁白或对话。"
      );
    }

    if (routeSteps.length === 1) {
      const [routeStep] = routeSteps;
      if (routeStep == null) {
        return createNpcAiDialogueFormatIssue(
          "handoff",
          "最多只允许返回 1 个 route handoff。"
        );
      }

      const snapshot = request.metadata.houseConversationCapabilitySnapshot;
      if (snapshot == null) {
        return createNpcAiDialogueFormatIssue(
          "handoff",
          "当前没有可用的室内路由快照，禁止输出 route handoff。"
        );
      }

      const validatedRoute = resolveAvailableHouseConversationRoute({
        snapshot,
        route: routeStep.route,
        ...(resolvePlayerTurnText(request) == null
          ? {}
          : { rawPlayerText: resolvePlayerTurnText(request) ?? "" }),
      });
      return validatedRoute == null
        ? createNpcAiDialogueFormatIssue(
            "handoff",
            "返回的 route handoff 必须落在当前合法的室内能力快照内。"
          )
        : null;
    }

    const [actionStep] = actionSteps;
    if (actionStep == null) {
      return createNpcAiDialogueFormatIssue(
        "handoff",
        "最多只允许返回 1 个 [ACTION]。"
      );
    }

    const availableSpecialActions = request.metadata.availableSpecialActions ?? [];
    if (availableSpecialActions.length === 0) {
      return createNpcAiDialogueFormatIssue(
        "handoff",
        "当前没有可跳转的功能，禁止输出 [ACTION]。"
      );
    }

    const actionId = normalizeNonEmptyString(actionStep.actionId);
    if (
      actionId == null ||
      !availableSpecialActions.some((action) => action.id === actionId)
    ) {
      return createNpcAiDialogueFormatIssue(
        "handoff",
        "返回的 [ACTION] 必须使用当前可直接办理功能中的精确 action id。"
      );
    }

    return null;
  }

  if (choiceSteps.length !== 1) {
    return createNpcAiDialogueFormatIssue(
      "choice",
      "必须且只返回 1 个 [CHOICE] 区块。"
    );
  }

  const [choiceStep] = choiceSteps;
  if (choiceStep == null) {
    return createNpcAiDialogueFormatIssue(
      "choice",
      "必须且只返回 1 个 [CHOICE] 区块。"
    );
  }

  if (choiceStep.options.length !== 3) {
    return createNpcAiDialogueFormatIssue(
      "choice",
      "必须返回恰好 3 个 OPTION。"
    );
  }

  const hasEmptyActionText = choiceStep.options.some(
    (option) => normalizeNonEmptyString(option.actionText) == null
  );
  if (hasEmptyActionText) {
    return createNpcAiDialogueFormatIssue(
      "choice",
      "每个 OPTION 都必须包含玩家会直接说出口的中文台词。"
    );
  }

  const semanticIssue = choiceStep.options
    .map((option) => resolveChoiceOptionSemanticIssue(option))
    .find((issue): issue is string => issue != null);
  if (semanticIssue != null) {
    return createNpcAiDialogueFormatIssue("choice", semanticIssue);
  }

  return null;
}

function buildFormatRepairRequest(
  request: NpcAiDialogueProviderRequest,
  issue: NpcAiDialogueFormatIssue
): NpcAiDialogueProviderRequest {
  const availableSpecialActions = summarizeAvailableSpecialActions(request);
  const repairInstruction = [
    "上一次回复格式不合法。",
    issue.message,
    "请基于同一轮对话重新完整输出。",
    "只允许输出保留标记内容，不要输出任何解释。",
    "如果要继续普通对话，必须且只输出 1 个 [CHOICE]，并且恰好 3 个 OPTION。",
    "如果要转入当前地点已有功能，先输出至少 1 句符合人设的寒暄或引导，再输出 [ACTION: exact_action_id]。",
    "输出 [ACTION] 时禁止同时输出 [CHOICE]。",
    "每个 OPTION 的按钮文案与角色实际说法必须完全相同，并且都要写成玩家此刻会直接说出口的中文台词。",
    "禁止输出“善意回应”“中立回应”“恶意回应”“option 1”“Option 2”“benevolent”“neutral”“hostile”或任何英文标签。",
    availableSpecialActions == null
      ? null
      : `当前允许的 action id 只有：${availableSpecialActions}。`,
  ].join("");
  return {
    ...request,
    messages: [
      ...request.messages,
      {
        role: "user",
        content: repairInstruction,
      },
    ],
  };
}

function normalizeOpenAiTextPart(value: unknown): string | null {
  if (typeof value === "string") {
    return value.trim().length === 0 ? null : value;
  }

  if (!isRecord(value)) {
    return null;
  }

  const directText = normalizeNonEmptyString(value.text);
  if (directText != null) {
    return directText;
  }

  const directValue = normalizeNonEmptyString(value.value);
  if (directValue != null) {
    return directValue;
  }

  if (isRecord(value.text)) {
    const nestedValue = normalizeNonEmptyString(value.text.value);
    if (nestedValue != null) {
      return nestedValue;
    }
  }

  return null;
}

function normalizeOpenAiTextContent(value: unknown): string | null {
  if (typeof value === "string") {
    return value.trim().length === 0 ? null : value;
  }

  if (!Array.isArray(value)) {
    return null;
  }

  const text = value
    .flatMap((part) => {
      const normalizedPart = normalizeOpenAiTextPart(part);
      return normalizedPart == null ? [] : [normalizedPart];
    })
    .join("");

  return text.trim().length === 0 ? null : text;
}

function extractOpenAiChoiceText(choiceValue: unknown): string | null {
  if (!isRecord(choiceValue)) {
    return null;
  }

  const delta = isRecord(choiceValue.delta) ? choiceValue.delta : null;
  if (delta != null) {
    const deltaText = normalizeOpenAiTextContent(delta.content);
    if (deltaText != null) {
      return deltaText;
    }
  }

  const message = isRecord(choiceValue.message) ? choiceValue.message : null;
  if (message != null) {
    const messageText = normalizeOpenAiTextContent(message.content);
    if (messageText != null) {
      return messageText;
    }
  }

  return null;
}

function extractOpenAiPayloadText(
  payload: Record<string, unknown>
): string | null {
  const wrappedText =
    normalizeNonEmptyString(payload.response) ??
    normalizeNonEmptyString(payload.rawText) ??
    normalizeNonEmptyString(payload.narrative);
  if (wrappedText != null) {
    return wrappedText;
  }

  if (!Array.isArray(payload.choices)) {
    return null;
  }

  const text = payload.choices
    .flatMap((choiceValue) => {
      const choiceText = extractOpenAiChoiceText(choiceValue);
      return choiceText == null ? [] : [choiceText];
    })
    .join("");

  return text.trim().length === 0 ? null : text;
}

function extractOpenAiPayloadErrorMessage(
  payload: Record<string, unknown>
): string | null {
  if (!isRecord(payload.error)) {
    return null;
  }

  return (
    normalizeNonEmptyString(payload.error.message) ??
    normalizeNonEmptyString(payload.error.type)
  );
}

function resolveOpenAiCompletePayload(input: {
  payload?: Record<string, unknown>;
  rawTextBuffer: string;
  streamedSteps: NpcAiDialogueStep[];
  request: NpcAiDialogueProviderRequest;
}): {
  rawText: string;
  allSteps: NpcAiDialogueStep[];
} | null {
  const payloadText =
    input.payload == null ? null : extractOpenAiPayloadText(input.payload);

  return resolveCompletePayload({
    payload: input.payload ?? {},
    rawTextBuffer: payloadText ?? input.rawTextBuffer,
    streamedSteps: input.streamedSteps,
    request: input.request,
  });
}

function parseOpenAiResponseBody(rawBody: string): {
  payload?: Record<string, unknown>;
  text: string | null;
  errorMessage: string | null;
} {
  const trimmedBody = rawBody.trim();
  if (trimmedBody.length === 0) {
    return {
      text: null,
      errorMessage: null,
    };
  }

  let payload: unknown = trimmedBody;
  try {
    payload = JSON.parse(trimmedBody);
  } catch {}

  if (!isRecord(payload)) {
    return {
      text: trimmedBody,
      errorMessage: null,
    };
  }

  return {
    payload,
    text: extractOpenAiPayloadText(payload) ?? trimmedBody,
    errorMessage: extractOpenAiPayloadErrorMessage(payload),
  };
}

function resolvePlayerTurnText(
  request: NpcAiDialogueProviderRequest
): string | null {
  if (request.metadata.inputType === "select_option") {
    return (
      normalizeNonEmptyString(request.metadata.selectedOptionLabel) ??
      normalizeNonEmptyString(request.metadata.selectedOptionId)
    );
  }

  if (request.metadata.inputType === "custom_input") {
    return normalizeNonEmptyString(request.metadata.customInputText);
  }

  return null;
}

function buildActionRouteRequest(
  request: NpcAiDialogueProviderRequest
): NpcAiDialogueProviderRequest {
  const playerTurnText = resolvePlayerTurnText(request) ?? "继续";
  const availableSpecialActions =
    summarizeAvailableSpecialActions(request) ?? "无";
  const contextMessage = request.messages[0] ?? {
    role: "user" as const,
    content: `当前NPC：${request.metadata.npcName}`,
  };

  return {
    ...request,
    requestId: `${request.requestId}:action-route`,
    system: ACTION_ROUTE_SYSTEM,
    messages: [
      contextMessage,
      {
        role: "user",
        content: [
          `玩家刚才的原话：${playerTurnText}`,
          `当前允许的 action id 只有：${availableSpecialActions}。`,
          "现在不要继续写对话，只做功能路由判断。",
          "如果这句话已经明确是在请求办理当前地点已有功能，输出 [ACTION: exact_action_id]。",
          "如果不是，输出 [ACTION: none]。",
          "禁止输出任何别的文本。",
        ].join("\n"),
      },
    ],
  };
}

function buildActionRouteRepairRequest(
  request: NpcAiDialogueProviderRequest,
  issue: string
): NpcAiDialogueProviderRequest {
  const availableSpecialActions =
    summarizeAvailableSpecialActions(request) ?? "无";
  return {
    ...request,
    messages: [
      ...request.messages,
      {
        role: "user",
        content: [
          "上一次功能路由结果格式不合法。",
          issue,
          "请重新判断。",
          "只能输出 [ACTION: exact_action_id] 或 [ACTION: none]。",
          `当前允许的 action id 只有：${availableSpecialActions}。`,
          "禁止输出任何其他文本。",
        ].join(""),
      },
    ],
  };
}

function buildActionTransitionRequest(input: {
  request: NpcAiDialogueProviderRequest;
  actionId: string;
}): NpcAiDialogueProviderRequest {
  const playerTurnText = resolvePlayerTurnText(input.request) ?? "继续";
  const matchedAction =
    input.request.metadata.availableSpecialActions?.find(
      (action) => action.id === input.actionId
    ) ?? null;
  const matchedActionLabel = matchedAction?.label ?? input.actionId;
  const contextMessage = input.request.messages[0] ?? {
    role: "user" as const,
    content: `当前NPC：${input.request.metadata.npcName}`,
  };

  return {
    ...input.request,
    requestId: `${input.request.requestId}:action-transition`,
    system: ACTION_TRANSITION_SYSTEM,
    messages: [
      contextMessage,
      {
        role: "user",
        content: [
          `玩家刚才的原话：${playerTurnText}`,
          `本轮已经确认要直接办理的功能：${input.actionId}（${matchedActionLabel}）。`,
          "请只给出至少 1 句符合人设的过渡回应，用来把对话自然引到办理功能上。",
          "不要输出 [ACTION]、[CHOICE]、[OPTION] 或任何解释。",
        ].join("\n"),
      },
    ],
    metadata: {
      ...input.request.metadata,
      availableSpecialActions: [
        {
          id: input.actionId,
          label: matchedActionLabel,
        },
      ],
      forcedSpecialActionId: input.actionId,
    },
  };
}

function resolveActionRouteDecision(input: {
  rawText: string;
  request: NpcAiDialogueProviderRequest;
}):
  | {
      actionId: string | null;
      issue?: undefined;
    }
  | {
      actionId?: undefined;
      issue: string;
    } {
  const markerMatches = [...input.rawText.matchAll(ACTION_MARKER_PATTERN)];
  if (markerMatches.length > 1) {
    return {
      issue: "功能路由阶段最多只允许返回 1 个 [ACTION]。",
    };
  }

  const availableSpecialActions = input.request.metadata.availableSpecialActions ?? [];
  const rawDecision =
    markerMatches.length === 1
      ? normalizeNonEmptyString(markerMatches[0]?.[1])
      : normalizeNonEmptyString(input.rawText);
  if (rawDecision == null) {
    return {
      issue: "功能路由阶段必须返回 [ACTION: exact_action_id] 或 [ACTION: none]。",
    };
  }

  const normalizedDecision = rawDecision.trim().toLocaleLowerCase();
  if (
    normalizedDecision === "none" ||
    normalizedDecision === "null" ||
    normalizedDecision === "continue" ||
    normalizedDecision === "dialogue" ||
    normalizedDecision === "no_action" ||
    normalizedDecision === "no-action" ||
    normalizedDecision === "无"
  ) {
    return {
      actionId: null,
    };
  }

  const matchedAction =
    availableSpecialActions.find((action) => action.id === rawDecision) ??
    availableSpecialActions.find(
      (action) => action.id.toLocaleLowerCase() === normalizedDecision
    ) ??
    null;
  if (matchedAction == null) {
    return {
      issue: "功能路由阶段只能返回当前允许的精确 action id，或 [ACTION: none]。",
    };
  }

  return {
    actionId: matchedAction.id,
  };
}

function shouldResolveActionRoute(input: {
  config: NpcAiDialogueExternalConfig;
  request: NpcAiDialogueProviderRequest;
}): input is {
  config: OpenAiCompatibleConfig;
  request: NpcAiDialogueProviderRequest;
} {
  return (
    input.config.mode === "openai-compatible" &&
    input.request.metadata.inputType !== "start_talk" &&
    (input.request.metadata.availableSpecialActions?.length ?? 0) > 0 &&
    resolvePlayerTurnText(input.request) != null
  );
}

function shouldResolveHouseConversationRoute(input: {
  config: NpcAiDialogueExternalConfig;
  request: NpcAiDialogueProviderRequest;
}): input is {
  config: OpenAiCompatibleConfig;
  request: NpcAiDialogueProviderRequest;
} {
  return (
    input.config.mode === "openai-compatible" &&
    input.request.metadata.inputType !== "start_talk" &&
    input.request.metadata.houseConversationCapabilitySnapshot != null &&
    resolvePlayerTurnText(input.request) != null
  );
}

async function resolveOpenAiHouseConversationRoute(input: {
  config: OpenAiCompatibleConfig;
  request: NpcAiDialogueProviderRequest;
  fetchImplementation: FetchImplementation;
  requestTimeoutMs: number;
}): Promise<HouseConversationRoute | null> {
  const modelAttempts = buildOpenAiCompatibleModelAttempts(input.config);
  const routeConfig: OpenAiCompatibleConfig = {
    ...input.config,
    stream: false,
  };

  modelAttemptLoop: for (const [
    attemptIndex,
    modelOverride,
  ] of modelAttempts.entries()) {
    let activeRequest = buildHouseConversationIntentGateRequest(input.request);

    for (
      let repairAttempt = 0;
      repairAttempt <= NPC_AI_DIALOGUE_MAX_HOUSE_ROUTE_REPAIR_ATTEMPTS;
      repairAttempt += 1
    ) {
      const controller = new AbortController();
      const providerRequest = buildExternalProviderRequest({
        config: routeConfig,
        request: activeRequest,
        ...(modelOverride == null ? {} : { modelOverride }),
      });
      let didTimeout = false;
      const timeoutHandle = setTimeout(() => {
        if (controller.signal.aborted) {
          return;
        }

        didTimeout = true;
        controller.abort();
      }, input.requestTimeoutMs);

      try {
        const response = await input.fetchImplementation(providerRequest.url, {
          method: "POST",
          headers: providerRequest.headers,
          body: JSON.stringify(providerRequest.body),
          ...(providerRequest.credentials == null
            ? {}
            : { credentials: providerRequest.credentials }),
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(
            `NPC AI stream request failed with ${response.status} ${response.statusText}.`
          );
        }

        const { text, errorMessage } = parseOpenAiResponseBody(
          await response.text()
        );
        if (errorMessage != null) {
          if (attemptIndex < modelAttempts.length - 1) {
            continue modelAttemptLoop;
          }
          return null;
        }

        if (text == null) {
          if (attemptIndex < modelAttempts.length - 1) {
            continue modelAttemptLoop;
          }
          return null;
        }

        const result = resolveHouseConversationIntentGateDecision({
          rawText: text,
          request: input.request,
        });
        if (result.issue != null) {
          if (
            repairAttempt < NPC_AI_DIALOGUE_MAX_HOUSE_ROUTE_REPAIR_ATTEMPTS
          ) {
            activeRequest = buildHouseConversationIntentGateRepairRequest(
              activeRequest,
              result.issue
            );
            continue;
          }

          if (attemptIndex < modelAttempts.length - 1) {
            continue modelAttemptLoop;
          }
          return null;
        }

        return result.decision.kind === "route" ? result.decision.route : null;
      } catch {
        if (didTimeout && attemptIndex < modelAttempts.length - 1) {
          continue modelAttemptLoop;
        }

        return null;
      } finally {
        clearTimeout(timeoutHandle);
      }
    }
  }

  return null;
}

async function resolveOpenAiActionRoute(input: {
  config: OpenAiCompatibleConfig;
  request: NpcAiDialogueProviderRequest;
  fetchImplementation: FetchImplementation;
  requestTimeoutMs: number;
}): Promise<string | null> {
  const modelAttempts = buildOpenAiCompatibleModelAttempts(input.config);
  const routeConfig: OpenAiCompatibleConfig = {
    ...input.config,
    stream: false,
  };

  modelAttemptLoop: for (const [
    attemptIndex,
    modelOverride,
  ] of modelAttempts.entries()) {
    let activeRequest = buildActionRouteRequest(input.request);

    for (
      let repairAttempt = 0;
      repairAttempt <= NPC_AI_DIALOGUE_MAX_ACTION_ROUTE_REPAIR_ATTEMPTS;
      repairAttempt += 1
    ) {
      const controller = new AbortController();
      const providerRequest = buildExternalProviderRequest({
        config: routeConfig,
        request: activeRequest,
        ...(modelOverride == null ? {} : { modelOverride }),
      });
      let didTimeout = false;
      const timeoutHandle = setTimeout(() => {
        if (controller.signal.aborted) {
          return;
        }

        didTimeout = true;
        controller.abort();
      }, input.requestTimeoutMs);

      try {
        const response = await input.fetchImplementation(providerRequest.url, {
          method: "POST",
          headers: providerRequest.headers,
          body: JSON.stringify(providerRequest.body),
          ...(providerRequest.credentials == null
            ? {}
            : { credentials: providerRequest.credentials }),
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(
            `NPC AI stream request failed with ${response.status} ${response.statusText}.`
          );
        }

        const { text, errorMessage } = parseOpenAiResponseBody(
          await response.text()
        );
        if (errorMessage != null) {
          if (attemptIndex < modelAttempts.length - 1) {
            continue modelAttemptLoop;
          }
          return null;
        }

        if (text == null) {
          if (attemptIndex < modelAttempts.length - 1) {
            continue modelAttemptLoop;
          }
          return null;
        }

        const decision = resolveActionRouteDecision({
          rawText: text,
          request: input.request,
        });
        if (decision.issue != null) {
          if (
            repairAttempt < NPC_AI_DIALOGUE_MAX_ACTION_ROUTE_REPAIR_ATTEMPTS
          ) {
            activeRequest = buildActionRouteRepairRequest(
              activeRequest,
              decision.issue
            );
            continue;
          }

          if (attemptIndex < modelAttempts.length - 1) {
            continue modelAttemptLoop;
          }
          return null;
        }

        return decision.actionId ?? null;
      } catch {
        if (didTimeout && attemptIndex < modelAttempts.length - 1) {
          continue modelAttemptLoop;
        }

        return null;
      } finally {
        clearTimeout(timeoutHandle);
      }
    }
  }

  return null;
}

export function createExternalNpcAiDialogueProvider(
  input: ExternalProviderFactoryInput
): NpcAiDialogueProvider {
  const activeControllers = new Map<string, AbortController>();
  const fetchImplementation: FetchImplementation | null =
    input.fetchImplementation ?? (typeof fetch === "function" ? fetch : null);

  return {
    async stream(request, onEvent) {
      if (fetchImplementation == null) {
        throw new Error("NPC AI fetch implementation is unavailable.");
      }

      const requestTimeoutMs = resolveRequestTimeoutMs(input.config);
      const modelAttempts =
        input.config.mode === "openai-compatible"
          ? buildOpenAiCompatibleModelAttempts(input.config)
          : [null];
      const streamedSteps: NpcAiDialogueStep[] = [];
      const rawTextChunks: string[] = [];
      let didEmitComplete = false;
      let didEmitError = false;
      let didEmitStart = false;

      const emitStartIfNeeded = async (): Promise<void> => {
        if (didEmitStart) {
          return;
        }

        didEmitStart = true;
        await onEvent({
          type: "start",
          requestId: request.requestId,
        });
      };

      const emitResolvedCompletion = async (input: {
        controller: AbortController;
        providerRequest: ExternalProviderRequest;
        payload?: Record<string, unknown>
      }): Promise<void> => {
        if (
          input.controller.signal.aborted ||
          didEmitComplete ||
          didEmitError
        ) {
          return;
        }

        const completion =
          input.providerRequest.responseMode === "openai-compatible"
            ? resolveOpenAiCompletePayload({
                ...(input.payload == null ? {} : { payload: input.payload }),
                rawTextBuffer: rawTextChunks.join(""),
                streamedSteps,
                request,
              })
            : resolveCompletePayload({
                payload: input.payload ?? {},
                rawTextBuffer: rawTextChunks.join(""),
                streamedSteps,
                request,
              });
        if (completion == null) {
          return;
        }

        didEmitComplete = true;
        await onEvent({
          type: "complete",
          requestId: request.requestId,
          rawText: completion.rawText,
          allSteps: completion.allSteps,
        });
      };

      const clearBufferedAttemptState = (): void => {
        rawTextChunks.length = 0;
        streamedSteps.length = 0;
      };

      let preparedRequest = request;
      const routeCandidate = {
        config: input.config,
        request,
      };
      if (shouldResolveHouseConversationRoute(routeCandidate)) {
        await emitStartIfNeeded();
        const matchedRoute = await resolveOpenAiHouseConversationRoute({
          config: routeCandidate.config,
          request,
          fetchImplementation,
          requestTimeoutMs,
        });
        if (matchedRoute != null && matchedRoute.kind !== "continue-dialogue") {
          preparedRequest = buildHouseConversationRouteTransitionRequest({
            request,
            route: matchedRoute,
          });
        }
      } else if (shouldResolveActionRoute(routeCandidate)) {
        await emitStartIfNeeded();
        const matchedActionId = await resolveOpenAiActionRoute({
          config: routeCandidate.config,
          request,
          fetchImplementation,
          requestTimeoutMs,
        });
        if (matchedActionId != null) {
          preparedRequest = buildActionTransitionRequest({
            request,
            actionId: matchedActionId,
          });
        }
      }

      modelAttemptLoop: for (const [
        attemptIndex,
        modelOverride,
      ] of modelAttempts.entries()) {
        let activeRequest = preparedRequest;

        for (
          let formatRepairAttempt = 0;
          formatRepairAttempt <= NPC_AI_DIALOGUE_MAX_FORMAT_REPAIR_ATTEMPTS;
          formatRepairAttempt += 1
        ) {
          const controller = new AbortController();
          const providerRequest = buildExternalProviderRequest({
            config: input.config,
            request: activeRequest,
            ...(modelOverride == null ? {} : { modelOverride }),
          });
          let didTimeout = false;
          let timeoutHandle: ReturnType<typeof setTimeout> | null = null;
          let pendingFormatRepairRequest: NpcAiDialogueProviderRequest | null =
            null;

          const clearRequestTimeout = (): void => {
            if (timeoutHandle == null) {
              return;
            }

            clearTimeout(timeoutHandle);
            timeoutHandle = null;
          };

          const emitResolvedCompletion = async (completionInput: {
            controller: AbortController;
            providerRequest: ExternalProviderRequest;
            payload?: Record<string, unknown>;
          }): Promise<void> => {
            if (
              completionInput.controller.signal.aborted ||
              didEmitComplete ||
              didEmitError
            ) {
              return;
            }

            const completion =
              completionInput.providerRequest.responseMode === "openai-compatible"
                ? resolveOpenAiCompletePayload({
                    ...(completionInput.payload == null
                      ? {}
                      : { payload: completionInput.payload }),
                    rawTextBuffer: rawTextChunks.join(""),
                    streamedSteps,
                    request: activeRequest,
                  })
                : resolveCompletePayload({
                    payload: completionInput.payload ?? {},
                    rawTextBuffer: rawTextChunks.join(""),
                    streamedSteps,
                    request: activeRequest,
                  });
            if (completion == null) {
              return;
            }

            const choiceStepFormatIssue = resolveChoiceStepFormatIssue(
              completion.allSteps,
              activeRequest
            );
            if (choiceStepFormatIssue != null) {
              const canRepairFormatIssue =
                completionInput.providerRequest.responseMode ===
                  "openai-compatible" &&
                formatRepairAttempt <
                  NPC_AI_DIALOGUE_MAX_FORMAT_REPAIR_ATTEMPTS;
              appendNpcAiDialogueFormatFailureDiagnostic({
                globalObject: input.globalObject,
                request: activeRequest,
                issue: choiceStepFormatIssue,
                rawText: completion.rawText,
                phase: canRepairFormatIssue ? "repair" : "final-error",
              });
              if (
                canRepairFormatIssue
              ) {
                pendingFormatRepairRequest = buildFormatRepairRequest(
                  activeRequest,
                  choiceStepFormatIssue
                );
                return;
              }

              didEmitError = true;
              await onEvent({
                type: "error",
                requestId: request.requestId,
                message: resolveNpcAiDialogueFormatIssueUserMessage(
                  choiceStepFormatIssue
                ),
              });
              return;
            }

            didEmitComplete = true;
            await onEvent({
              type: "complete",
              requestId: request.requestId,
              rawText: completion.rawText,
              allSteps: completion.allSteps,
            });
          };

          activeControllers.set(request.requestId, controller);

          try {
            await emitStartIfNeeded();
            timeoutHandle = setTimeout(() => {
              if (controller.signal.aborted || didEmitComplete || didEmitError) {
                return;
              }

              didTimeout = true;
              controller.abort();
            }, requestTimeoutMs);

            const response = await fetchImplementation(providerRequest.url, {
              method: "POST",
              headers: providerRequest.headers,
              body: JSON.stringify(providerRequest.body),
              ...(providerRequest.credentials == null
                ? {}
                : { credentials: providerRequest.credentials }),
              signal: controller.signal,
            });

            if (!response.ok) {
              throw new Error(
                `NPC AI stream request failed with ${response.status} ${response.statusText}.`
              );
            }

            if (providerRequest.responseMode === "openai-compatible") {
              const contentType = response.headers.get("content-type") ?? "";
              const isEventStreamResponse =
                contentType.toLowerCase().includes("text/event-stream");

              if (isEventStreamResponse) {
                await consumeStructuredSseResponse({
                  response,
                  onPayload: async (payload) => {
                    if (
                      controller.signal.aborted ||
                      didEmitComplete ||
                      didEmitError
                    ) {
                      return;
                    }

                    if (typeof payload === "string") {
                      const trimmedPayload = payload.trim();
                      if (
                        trimmedPayload.length > 0 &&
                        trimmedPayload !== "[DONE]"
                      ) {
                        rawTextChunks.push(payload);
                      }
                      return;
                    }

                    if (!isRecord(payload)) {
                      return;
                    }

                    const errorMessage = extractOpenAiPayloadErrorMessage(payload);
                    if (errorMessage != null) {
                      didEmitError = true;
                      await onEvent({
                        type: "error",
                        requestId: request.requestId,
                        message: errorMessage,
                      });
                      return;
                    }

                    const text = extractOpenAiPayloadText(payload);
                    if (text != null) {
                      rawTextChunks.push(text);
                    }
                  },
                });
              } else {
                const rawBody = await response.text();
                const trimmedBody = rawBody.trim();

                if (trimmedBody.length > 0) {
                  let payload: unknown = trimmedBody;
                  try {
                    payload = JSON.parse(trimmedBody);
                  } catch {}

                  if (typeof payload === "string") {
                    rawTextChunks.push(payload);
                  }

                  if (isRecord(payload)) {
                    const errorMessage =
                      extractOpenAiPayloadErrorMessage(payload);
                    if (errorMessage != null) {
                      didEmitError = true;
                      await onEvent({
                        type: "error",
                        requestId: request.requestId,
                        message: errorMessage,
                      });
                      return;
                    }
                  }

                  await emitResolvedCompletion({
                    controller,
                    providerRequest,
                    ...(isRecord(payload) ? { payload } : {}),
                  });
                }
              }
            } else {
              await consumeStructuredSseResponse({
                response,
                onPayload: async (payload) => {
                  if (
                    controller.signal.aborted ||
                    didEmitComplete ||
                    didEmitError ||
                    !isRecord(payload)
                  ) {
                    return;
                  }

                  const payloadType = normalizeNonEmptyString(payload.type);
                  if (payloadType === "start") {
                    await emitStartIfNeeded();
                    return;
                  }

                  if (payloadType === "raw_text") {
                    const text = normalizeNonEmptyString(payload.text);
                    if (text != null) {
                      rawTextChunks.push(text);
                    }
                    return;
                  }

                  if (payloadType === "stream") {
                    const text =
                      normalizeNonEmptyString(payload.text) ??
                      normalizeNonEmptyString(payload.content) ??
                      normalizeNonEmptyString(payload.delta);
                    if (text != null) {
                      rawTextChunks.push(text);
                    }
                    return;
                  }

                  if (payloadType === "step") {
                    const step = normalizeStep(payload.step);
                    if (step == null) {
                      return;
                    }

                    const normalizedStep = normalizeStepForRequest(
                      step,
                      activeRequest
                    );
                    streamedSteps.push(normalizedStep);
                    await onEvent({
                      type: "step",
                      requestId: request.requestId,
                      step: normalizedStep,
                    });
                    return;
                  }

                  if (payloadType === "error") {
                    didEmitError = true;
                    await onEvent({
                      type: "error",
                      requestId: request.requestId,
                      message:
                        normalizeNonEmptyString(payload.message) ??
                        "NPC AI dialogue stream failed.",
                    });
                    return;
                  }

                  if (payloadType === "complete" || payloadType === "data") {
                    await emitResolvedCompletion({
                      controller,
                      providerRequest,
                      payload,
                    });
                  }
                },
              });
            }

            if (
              !controller.signal.aborted &&
              !didEmitComplete &&
              !didEmitError &&
              pendingFormatRepairRequest == null
            ) {
              await emitResolvedCompletion({
                controller,
                providerRequest,
              });
            }

            if (pendingFormatRepairRequest != null) {
              clearBufferedAttemptState();
              activeRequest = pendingFormatRepairRequest;
              continue;
            }

            if (didEmitComplete || didEmitError) {
              return;
            }

            const canRetryWithoutContent =
              providerRequest.responseMode === "openai-compatible" &&
              attemptIndex < modelAttempts.length - 1 &&
              rawTextChunks.length === 0 &&
              streamedSteps.length === 0;
            if (canRetryWithoutContent) {
              clearBufferedAttemptState();
              continue modelAttemptLoop;
            }

            didEmitError = true;
            await onEvent({
              type: "error",
              requestId: request.requestId,
              message: "NPC AI 对话未返回有效内容，请稍后重试。",
            });
            return;
          } catch (error) {
            if (didEmitComplete || didEmitError) {
              return;
            }

            if (controller.signal.aborted && !didTimeout) {
              return;
            }

            const canRetryFallback =
              didTimeout && attemptIndex < modelAttempts.length - 1;
            if (canRetryFallback) {
              clearBufferedAttemptState();
              continue modelAttemptLoop;
            }

            didEmitError = true;
            await onEvent({
              type: "error",
              requestId: request.requestId,
              message:
                didTimeout
                  ? "NPC AI 对话请求超时，请稍后重试。"
                  : error instanceof Error
                    ? error.message
                    : "NPC AI dialogue stream failed.",
            });
            return;
          } finally {
            clearRequestTimeout();
            if (activeControllers.get(request.requestId) === controller) {
              activeControllers.delete(request.requestId);
            }
          }
        }
      }
    },
    cancel(requestId) {
      const activeController = activeControllers.get(requestId);
      if (activeController == null) {
        return;
      }

      activeController.abort();
      activeControllers.delete(requestId);
    },
  };
}

export function createConfiguredNpcAiDialogueProvider(
  input: ConfiguredProviderFactoryInput
): NpcAiDialogueProvider {
  const globalObject =
    input.globalObject ?? (globalThis as NpcAiDialogueProviderGlobal);
  const providerByRequestId = new Map<string, NpcAiDialogueProvider>();
  let cachedConfigKey: string | null = null;
  let cachedExternalProvider: NpcAiDialogueProvider | null = null;

  function resolveProvider(): NpcAiDialogueProvider {
    const externalConfig = resolveExternalConfig(globalObject);
    if (externalConfig == null) {
      cachedConfigKey = null;
      cachedExternalProvider = null;
      return input.fallbackProvider;
    }

    const nextConfigKey = JSON.stringify(externalConfig);
    if (
      cachedExternalProvider == null ||
      cachedConfigKey == null ||
      cachedConfigKey !== nextConfigKey
    ) {
      cachedConfigKey = nextConfigKey;
      cachedExternalProvider = createExternalNpcAiDialogueProvider({
        config: externalConfig,
        globalObject,
        ...(input.fetchImplementation == null
          ? {}
          : { fetchImplementation: input.fetchImplementation }),
      });
    }

    return cachedExternalProvider;
  }

  return {
    async stream(request, onEvent) {
      const provider = resolveProvider();
      providerByRequestId.set(request.requestId, provider);
      try {
        await provider.stream(request, onEvent);
      } finally {
        providerByRequestId.delete(request.requestId);
      }
    },
    cancel(requestId) {
      const provider = providerByRequestId.get(requestId) ?? resolveProvider();
      providerByRequestId.delete(requestId);
      return provider.cancel?.(requestId);
    },
  };
}
