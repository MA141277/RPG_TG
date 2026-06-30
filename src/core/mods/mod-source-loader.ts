import type { GameModManifest } from "../contracts/mod-manifest";
import type {
  LoadedMod,
  ModSourceDescriptor,
} from "../contracts/mod-runtime";
import { parseModManifest } from "./mod-parser";
import { normalizeModSource } from "./mod-source-registry";

export type BuiltinModSourceRecord = {
  manifest: GameModManifest;
  rawContent: unknown;
};

export type ModSourceLoaderContext = {
  builtinModsById?: Record<string, BuiltinModSourceRecord>;
  readFileText?: (filePath: string) => Promise<string>;
  fetchJson?: (url: string) => Promise<unknown>;
};

export async function loadModSource(
  source: ModSourceDescriptor,
  context: ModSourceLoaderContext = {}
): Promise<LoadedMod> {
  const normalizedSource = normalizeModSource(source);

  if (normalizedSource.kind === "builtin") {
    const builtinMod = context.builtinModsById?.[normalizedSource.modId];
    if (builtinMod == null) {
      throw new Error(`Unsupported builtin mod source: ${normalizedSource.modId}`);
    }

    return {
      source: normalizedSource,
      manifest: parseModManifest(builtinMod.manifest),
      rawContent: builtinMod.rawContent,
    };
  }

  if (normalizedSource.kind === "file") {
    if (context.readFileText == null) {
      throw new Error(`Unsupported mod source loader: ${normalizedSource.kind}`);
    }

    const rawPayload = JSON.parse(
      await context.readFileText(normalizedSource.filePath)
    );
    return {
      source: normalizedSource,
      manifest: parseModManifest(rawPayload),
      rawContent: rawPayload,
    };
  }

  const rawPayload =
    context.fetchJson == null
      ? await fetchJsonFromUrl(normalizedSource.url)
      : await context.fetchJson(normalizedSource.url);
  return {
    source: normalizedSource,
    manifest: parseModManifest(rawPayload),
    rawContent: rawPayload,
  };
}

async function fetchJsonFromUrl(url: string): Promise<unknown> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load mod source: ${response.status}`);
  }

  return response.json();
}
