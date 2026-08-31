import {
  NPC_AI_DIALOGUE_PROVIDER_STORAGE_KEY,
  type NpcAiDialogueExternalConfig,
} from "./external-npc-ai-dialogue-provider";

type NpcAiDialogueProviderBootstrapGlobal = {
  __RPG_TG_NPC_AI_CONFIG__?: unknown;
  localStorage?: {
    getItem(key: string): string | null;
  };
};

export type NpcAiDialogueProviderBootstrapEnv = {
  mode?: string;
  baseUrl?: string;
  model?: string;
  fallbackModels?: string | string[];
  authToken?: string;
  stream?: string | boolean;
  temperature?: string | number;
};

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

export function buildNpcAiDialogueExternalConfigFromEnv(
  env: NpcAiDialogueProviderBootstrapEnv
): NpcAiDialogueExternalConfig | null {
  if (env.mode !== "openai-compatible") {
    return null;
  }

  const baseUrl = normalizeNonEmptyString(env.baseUrl);
  const model = normalizeNonEmptyString(env.model);
  const authToken = normalizeNonEmptyString(env.authToken);
  if (baseUrl == null || model == null || authToken == null) {
    return null;
  }

  const stream = normalizeBoolean(env.stream);
  const temperature = normalizeFiniteNumber(env.temperature);
  const fallbackModels = normalizeStringList(env.fallbackModels);

  return {
    mode: "openai-compatible",
    baseUrl,
    model,
    ...(fallbackModels == null ? {} : { fallbackModels }),
    authToken,
    ...(stream == null ? {} : { stream }),
    ...(temperature == null ? {} : { temperature }),
  };
}

export function primeNpcAiDialogueConfigFromEnv(input: {
  env: NpcAiDialogueProviderBootstrapEnv;
  globalObject?: NpcAiDialogueProviderBootstrapGlobal;
}): void {
  const globalObject =
    input.globalObject ?? (globalThis as NpcAiDialogueProviderBootstrapGlobal);

  if (globalObject.__RPG_TG_NPC_AI_CONFIG__ != null) {
    return;
  }

  const rawStorageValue = globalObject.localStorage?.getItem(
    NPC_AI_DIALOGUE_PROVIDER_STORAGE_KEY
  );
  if (rawStorageValue != null && rawStorageValue.trim().length > 0) {
    return;
  }

  const envConfig = buildNpcAiDialogueExternalConfigFromEnv(input.env);
  if (envConfig == null) {
    return;
  }

  globalObject.__RPG_TG_NPC_AI_CONFIG__ = envConfig;
}
