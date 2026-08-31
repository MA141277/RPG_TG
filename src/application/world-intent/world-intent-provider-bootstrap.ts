import {
  WORLD_INTENT_PROVIDER_STORAGE_KEY,
  type WorldIntentExternalConfig,
} from "./external-world-intent-provider";

type WorldIntentProviderBootstrapGlobal = {
  __RPG_TG_WORLD_INTENT_CONFIG__?: unknown;
  localStorage?: {
    getItem(key: string): string | null;
  };
};

export type WorldIntentProviderBootstrapEnv = {
  mode?: string;
  baseUrl?: string;
  model?: string;
  fallbackModels?: string | string[];
  authToken?: string;
  temperature?: string | number;
};

function normalizeNonEmptyString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
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

export function buildWorldIntentExternalConfigFromEnv(
  env: WorldIntentProviderBootstrapEnv
): WorldIntentExternalConfig | null {
  if (env.mode !== "openai-compatible") {
    return null;
  }

  const baseUrl = normalizeNonEmptyString(env.baseUrl);
  const model = normalizeNonEmptyString(env.model);
  const authToken = normalizeNonEmptyString(env.authToken);
  if (baseUrl == null || model == null || authToken == null) {
    return null;
  }

  const fallbackModels = normalizeStringList(env.fallbackModels);
  const temperature = normalizeFiniteNumber(env.temperature);

  return {
    mode: "openai-compatible",
    baseUrl,
    model,
    authToken,
    ...(fallbackModels == null ? {} : { fallbackModels }),
    ...(temperature == null ? {} : { temperature }),
  };
}

export function primeWorldIntentConfigFromEnv(input: {
  env: WorldIntentProviderBootstrapEnv;
  globalObject?: WorldIntentProviderBootstrapGlobal;
}): void {
  const globalObject =
    input.globalObject ??
    (globalThis as WorldIntentProviderBootstrapGlobal);

  if (globalObject.__RPG_TG_WORLD_INTENT_CONFIG__ != null) {
    return;
  }

  const rawStorageValue = globalObject.localStorage?.getItem(
    WORLD_INTENT_PROVIDER_STORAGE_KEY
  );
  if (rawStorageValue != null && rawStorageValue.trim().length > 0) {
    return;
  }

  const envConfig = buildWorldIntentExternalConfigFromEnv(input.env);
  if (envConfig == null) {
    return;
  }

  globalObject.__RPG_TG_WORLD_INTENT_CONFIG__ = envConfig;
}
