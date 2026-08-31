import type {
  WorldAiIntentResponse,
  WorldIntentProvider,
  WorldIntentProviderRequest,
  WorldIntentProviderResolution,
} from "../../domain/world-intent";

export const WORLD_INTENT_PROVIDER_STORAGE_KEY = "rpg_tg.world_intent.provider";

type WorldIntentProviderGlobal = {
  __RPG_TG_WORLD_INTENT_CONFIG__?: unknown;
  localStorage?: {
    getItem(key: string): string | null;
  };
};

type OpenAiCompatibleConfig = {
  mode: "openai-compatible";
  baseUrl: string;
  model: string;
  fallbackModels?: string[];
  authToken?: string;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
  temperature?: number;
  timeoutMs?: number;
};

export type WorldIntentExternalConfig = OpenAiCompatibleConfig;

type FetchImplementation = typeof fetch;

type ExternalProviderFactoryInput = {
  config: WorldIntentExternalConfig;
  fetchImplementation?: FetchImplementation;
};

type ConfiguredProviderFactoryInput = {
  globalObject?: WorldIntentProviderGlobal;
  fetchImplementation?: FetchImplementation;
  fallbackProvider: WorldIntentProvider;
};

const DEFAULT_REQUEST_TIMEOUT_MS = 30_000;

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

function normalizeHeaders(value: unknown): Record<string, string> | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const headers: Record<string, string> = {};
  for (const [key, headerValue] of Object.entries(value)) {
    if (typeof headerValue !== "string" || key.trim().length === 0) {
      continue;
    }

    headers[key.trim()] = headerValue;
  }

  return Object.keys(headers).length === 0 ? undefined : headers;
}

function normalizeFiniteNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const parsedValue = Number(value.trim());
  return Number.isFinite(parsedValue) ? parsedValue : undefined;
}

function normalizeTimeoutMs(value: unknown): number | undefined {
  const nextValue = normalizeFiniteNumber(value);
  if (nextValue == null || nextValue <= 0) {
    return undefined;
  }

  return Math.round(nextValue);
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

  const values = value
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
  return values.length === 0 ? undefined : values;
}

function normalizeCredentials(value: unknown): RequestCredentials | undefined {
  if (value === "include" || value === "omit" || value === "same-origin") {
    return value;
  }

  return undefined;
}

function normalizeExternalConfig(
  value: unknown
): WorldIntentExternalConfig | null {
  if (!isRecord(value) || value.mode !== "openai-compatible") {
    return null;
  }

  const baseUrl = normalizeNonEmptyString(value.baseUrl);
  const model = normalizeNonEmptyString(value.model);
  if (baseUrl == null || model == null) {
    return null;
  }

  const authToken = normalizeNonEmptyString(value.authToken);
  const headers = normalizeHeaders(value.headers);
  const credentials = normalizeCredentials(value.credentials);
  const temperature = normalizeFiniteNumber(value.temperature);
  const timeoutMs = normalizeTimeoutMs(value.timeoutMs);
  const fallbackModels = normalizeStringList(value.fallbackModels);

  return {
    mode: "openai-compatible",
    baseUrl,
    model,
    ...(fallbackModels == null ? {} : { fallbackModels }),
    ...(authToken == null ? {} : { authToken }),
    ...(headers == null ? {} : { headers }),
    ...(credentials == null ? {} : { credentials }),
    ...(temperature == null ? {} : { temperature }),
    ...(timeoutMs == null ? {} : { timeoutMs }),
  };
}

function resolveExternalConfig(
  globalObject: WorldIntentProviderGlobal
): WorldIntentExternalConfig | null {
  const fromGlobal = normalizeExternalConfig(
    globalObject.__RPG_TG_WORLD_INTENT_CONFIG__
  );
  if (fromGlobal != null) {
    return fromGlobal;
  }

  const storageValue = globalObject.localStorage?.getItem(
    WORLD_INTENT_PROVIDER_STORAGE_KEY
  );
  if (storageValue == null || storageValue.trim().length === 0) {
    return null;
  }

  try {
    return normalizeExternalConfig(JSON.parse(storageValue));
  } catch {
    return null;
  }
}

function trimTrailingSlashes(value: string): string {
  return value.replace(/\/+$/u, "");
}

function resolveTimeoutMs(config: WorldIntentExternalConfig): number {
  return config.timeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS;
}

function buildModelAttempts(config: WorldIntentExternalConfig): string[] {
  const models = [config.model, ...(config.fallbackModels ?? [])];
  return [...new Set(models.filter((model) => model.trim().length > 0))];
}

function buildRequestHeaders(
  config: WorldIntentExternalConfig
): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(config.headers ?? {}),
  };

  if (config.authToken != null) {
    headers.Authorization = `Bearer ${config.authToken}`;
  }

  return headers;
}

function extractResponseText(payload: Record<string, unknown>): string | null {
  if (Array.isArray(payload.choices)) {
    const text = payload.choices
      .flatMap((choice) => {
        if (!isRecord(choice) || !isRecord(choice.message)) {
          return [];
        }

        const content = normalizeNonEmptyString(choice.message.content);
        return content == null ? [] : [content];
      })
      .join("");
    return text.trim().length === 0 ? null : text;
  }

  return normalizeNonEmptyString(payload.response);
}

function extractErrorMessage(payload: Record<string, unknown>): string | null {
  if (!isRecord(payload.error)) {
    return null;
  }

  return (
    normalizeNonEmptyString(payload.error.message) ??
    normalizeNonEmptyString(payload.error.type)
  );
}

function extractJsonObject(rawText: string): string | null {
  const trimmed = rawText.trim();
  if (trimmed.length === 0) {
    return null;
  }

  const fencedMatch = trimmed.match(/```json\s*([\s\S]+?)```/iu);
  if (fencedMatch?.[1] != null) {
    return fencedMatch[1].trim();
  }

  const firstBraceIndex = trimmed.indexOf("{");
  if (firstBraceIndex < 0) {
    return null;
  }

  let depth = 0;
  for (let index = firstBraceIndex; index < trimmed.length; index += 1) {
    const character = trimmed[index];
    if (character === "{") {
      depth += 1;
    } else if (character === "}") {
      depth -= 1;
      if (depth === 0) {
        return trimmed.slice(firstBraceIndex, index + 1);
      }
    }
  }

  return null;
}

function normalizeConfidence(value: unknown): number {
  const normalizedValue = normalizeFiniteNumber(value);
  if (normalizedValue == null) {
    return 0.5;
  }

  return Math.max(0, Math.min(1, normalizedValue));
}

function normalizeIntentResponse(value: unknown): WorldAiIntentResponse | null {
  if (!isRecord(value)) {
    return null;
  }

  const intent = normalizeNonEmptyString(value.intent);
  const confidence = normalizeConfidence(value.confidence);

  if (intent === "go-to-house") {
    const targetHouseId = normalizeNonEmptyString(value.targetHouseId);
    if (targetHouseId == null) {
      return null;
    }

    return {
      intent,
      targetHouseId,
      confidence,
      ...(normalizeNonEmptyString(value.shortNarration) == null
        ? {}
        : {
            shortNarration: normalizeNonEmptyString(value.shortNarration) ?? "",
          }),
    };
  }

  if (intent === "leave-house") {
    return {
      intent,
      confidence,
      ...(normalizeNonEmptyString(value.shortNarration) == null
        ? {}
        : {
            shortNarration: normalizeNonEmptyString(value.shortNarration) ?? "",
          }),
    };
  }

  if (intent === "talk-to-npc") {
    const targetCharacterId = normalizeNonEmptyString(value.targetCharacterId);
    if (targetCharacterId == null) {
      return null;
    }

    return {
      intent,
      targetCharacterId,
      confidence,
      ...(normalizeNonEmptyString(value.shortNarration) == null
        ? {}
        : {
            shortNarration: normalizeNonEmptyString(value.shortNarration) ?? "",
          }),
    };
  }

  if (intent === "open-service-action") {
    const actionId = normalizeNonEmptyString(value.actionId);
    if (actionId == null) {
      return null;
    }

    return {
      intent,
      actionId,
      confidence,
      ...(normalizeNonEmptyString(value.shortNarration) == null
        ? {}
        : {
            shortNarration: normalizeNonEmptyString(value.shortNarration) ?? "",
          }),
    };
  }

  if (intent === "negotiate-story-node") {
    const nodeId = normalizeNonEmptyString(value.nodeId);
    const approach = normalizeNonEmptyString(value.approach);
    if (
      nodeId == null ||
      (approach !== "deferential" &&
        approach !== "plea" &&
        approach !== "pragmatic" &&
        approach !== "duty" &&
        approach !== "competence" &&
        approach !== "defiant")
    ) {
      return null;
    }

    return {
      intent,
      nodeId,
      approach,
      confidence,
      ...(normalizeNonEmptyString(value.targetCharacterId) == null
        ? {}
        : {
            targetCharacterId:
              normalizeNonEmptyString(value.targetCharacterId) ?? null,
          }),
      ...(normalizeNonEmptyString(value.shortNarration) == null
        ? {}
        : {
            shortNarration: normalizeNonEmptyString(value.shortNarration) ?? "",
          }),
    };
  }

  if (intent === "clarify") {
    const question = normalizeNonEmptyString(value.question);
    if (question == null) {
      return null;
    }

    return {
      intent,
      question,
      confidence,
    };
  }

  return null;
}

function buildRequestBody(
  request: WorldIntentProviderRequest,
  config: WorldIntentExternalConfig,
  modelOverride?: string
): {
  model: string;
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  temperature?: number;
} {
  return {
    model: modelOverride ?? config.model,
    messages: [
      {
        role: "system",
        content: request.system,
      },
      ...request.messages,
    ],
    ...(config.temperature == null ? {} : { temperature: config.temperature }),
  };
}

export function createExternalWorldIntentProvider(
  input: ExternalProviderFactoryInput
): WorldIntentProvider {
  const activeControllers = new Map<string, AbortController>();
  const fetchImplementation: FetchImplementation | null =
    input.fetchImplementation ?? (typeof fetch === "function" ? fetch : null);

  return {
    async classify(
      request: WorldIntentProviderRequest
    ): Promise<WorldIntentProviderResolution> {
      if (fetchImplementation == null) {
        throw new Error("World-intent fetch implementation is unavailable.");
      }

      const modelAttempts = buildModelAttempts(input.config);
      for (const model of modelAttempts) {
        const controller = new AbortController();
        activeControllers.set(request.requestId, controller);
        const timeoutHandle = setTimeout(() => {
          controller.abort();
        }, resolveTimeoutMs(input.config));

        try {
          const response = await fetchImplementation(
            `${trimTrailingSlashes(input.config.baseUrl)}/v1/chat/completions`,
            {
              method: "POST",
              headers: buildRequestHeaders(input.config),
              body: JSON.stringify(
                buildRequestBody(request, input.config, model)
              ),
              ...(input.config.credentials == null
                ? {}
                : { credentials: input.config.credentials }),
              signal: controller.signal,
            }
          );
          if (!response.ok) {
            throw new Error(
              `World-intent request failed with ${response.status} ${response.statusText}.`
            );
          }

          const payload = (await response.json()) as unknown;
          if (!isRecord(payload)) {
            throw new Error("World-intent provider returned an invalid payload.");
          }

          const errorMessage = extractErrorMessage(payload);
          if (errorMessage != null) {
            throw new Error(errorMessage);
          }

          const responseText = extractResponseText(payload);
          if (responseText == null) {
            throw new Error("World-intent provider returned no message content.");
          }

          const jsonText = extractJsonObject(responseText);
          if (jsonText == null) {
            throw new Error("World-intent provider did not return JSON.");
          }

          const parsedResponse = normalizeIntentResponse(JSON.parse(jsonText));
          if (parsedResponse == null) {
            throw new Error("World-intent provider returned an unsupported intent.");
          }

          return {
            requestId: request.requestId,
            result: parsedResponse,
          };
        } catch (error) {
          if (model !== modelAttempts[modelAttempts.length - 1]) {
            continue;
          }

          throw error;
        } finally {
          clearTimeout(timeoutHandle);
          if (activeControllers.get(request.requestId) === controller) {
            activeControllers.delete(request.requestId);
          }
        }
      }

      throw new Error("World-intent provider did not complete any model attempt.");
    },
    cancel(requestId: string) {
      const controller = activeControllers.get(requestId);
      if (controller == null) {
        return;
      }

      controller.abort();
      activeControllers.delete(requestId);
    },
  };
}

export function createConfiguredWorldIntentProvider(
  input: ConfiguredProviderFactoryInput
): WorldIntentProvider {
  const globalObject =
    input.globalObject ?? (globalThis as WorldIntentProviderGlobal);
  let cachedConfigKey: string | null = null;
  let cachedProvider: WorldIntentProvider | null = null;

  function resolveProvider(): WorldIntentProvider {
    const externalConfig = resolveExternalConfig(globalObject);
    if (externalConfig == null) {
      cachedConfigKey = null;
      cachedProvider = null;
      return input.fallbackProvider;
    }

    const nextConfigKey = JSON.stringify(externalConfig);
    if (
      cachedProvider == null ||
      cachedConfigKey == null ||
      cachedConfigKey !== nextConfigKey
    ) {
      cachedConfigKey = nextConfigKey;
      cachedProvider = createExternalWorldIntentProvider({
        config: externalConfig,
        ...(input.fetchImplementation == null
          ? {}
          : { fetchImplementation: input.fetchImplementation }),
      });
    }

    return cachedProvider;
  }

  return {
    classify(request) {
      return resolveProvider().classify(request);
    },
    cancel(requestId) {
      return resolveProvider().cancel?.(requestId);
    },
  };
}
