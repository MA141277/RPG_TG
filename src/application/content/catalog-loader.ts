import type { ScenarioPackSummary } from "../../domain/scenario-pack";
import { resolvePackRelativeUrl } from "./content-pack-loader";

export const SCENARIO_PACK_CATALOG_PUBLIC_URL = "/scenario-packs/catalog.json";

export type ScenarioPackCatalogEntry = {
  id: string;
  title: string;
  manifestPath: string;
  description?: string;
  sort?: number;
  isDefault?: boolean;
};

export type ResolvedScenarioPackCatalogEntry = ScenarioPackCatalogEntry & {
  manifestUrl: string;
  sort: number;
  isDefault: boolean;
};

export async function loadScenarioPackCatalogFromUrl(
  url: string
): Promise<ResolvedScenarioPackCatalogEntry[]> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load scenario pack catalog: ${response.status}`);
  }

  return resolveScenarioPackCatalogEntries(
    parseScenarioPackCatalogText(await response.text()),
    url
  );
}

export function parseScenarioPackCatalogText(
  text: string
): ScenarioPackCatalogEntry[] {
  return parseScenarioPackCatalog(JSON.parse(text));
}

export function parseScenarioPackCatalog(
  value: unknown
): ScenarioPackCatalogEntry[] {
  assertArray(value, "scenario pack catalog");

  return value.map((entry, index) => parseScenarioPackCatalogEntry(entry, index));
}

export function resolveScenarioPackCatalogEntries(
  entries: ScenarioPackCatalogEntry[],
  catalogUrl: string
): ResolvedScenarioPackCatalogEntry[] {
  return sortScenarioPackCatalogEntries(entries).map((entry) => ({
    ...entry,
    manifestUrl: resolveCatalogManifestUrl(catalogUrl, entry.manifestPath),
    sort: entry.sort ?? 0,
    isDefault: entry.isDefault ?? false,
  }));
}

export function resolveScenarioPackSummaries(
  entries: ScenarioPackCatalogEntry[],
  catalogUrl: string
): ScenarioPackSummary[] {
  return resolveScenarioPackCatalogEntries(entries, catalogUrl).map((entry) => ({
    id: entry.id,
    title: entry.title,
    ...(entry.description == null ? {} : { description: entry.description }),
    url: entry.manifestUrl,
  }));
}

export function getDefaultScenarioPackCatalogEntry(
  entries: ScenarioPackCatalogEntry[]
): ScenarioPackCatalogEntry {
  const sortedEntries = sortScenarioPackCatalogEntries(entries);
  const defaultEntry = sortedEntries.find((entry) => entry.isDefault);
  if (defaultEntry != null) {
    return defaultEntry;
  }
  if (sortedEntries[0] == null) {
    throw new Error("Scenario pack catalog must contain at least one entry.");
  }

  return sortedEntries[0];
}

export function resolveCatalogManifestUrl(
  catalogUrl: string,
  manifestPath: string
): string {
  if (/^(https?:|file:|\/)/.test(manifestPath)) {
    return manifestPath;
  }

  if (catalogUrl.startsWith("/")) {
    const resolvedUrl = new URL(
      manifestPath,
      `https://scenario-packs.local${catalogUrl}`
    );

    return `${resolvedUrl.pathname}${resolvedUrl.search}${resolvedUrl.hash}`;
  }

  return resolvePackRelativeUrl(catalogUrl, manifestPath) ?? manifestPath;
}

function sortScenarioPackCatalogEntries(
  entries: ScenarioPackCatalogEntry[]
): ScenarioPackCatalogEntry[] {
  return [...entries].sort(
    (left, right) =>
      (left.sort ?? 0) - (right.sort ?? 0) || left.title.localeCompare(right.title)
  );
}

function parseScenarioPackCatalogEntry(
  value: unknown,
  index: number
): ScenarioPackCatalogEntry {
  const label = `scenario pack catalog entry ${index}`;
  assertObject(value, label);
  assertString(value.id, `${label} id`);
  assertString(value.title, `${label} title`);
  assertString(value.manifestPath, `${label} manifestPath`);

  if (value.description != null) {
    assertString(value.description, `${label} description`);
  }
  if (value.sort != null) {
    assertNumber(value.sort, `${label} sort`);
  }
  if (value.isDefault != null) {
    assertBoolean(value.isDefault, `${label} isDefault`);
  }

  return value as ScenarioPackCatalogEntry;
}

function assertObject(
  value: unknown,
  label: string
): asserts value is Record<string, any> {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object.`);
  }
}

function assertArray(value: unknown, label: string): asserts value is unknown[] {
  if (!Array.isArray(value)) {
    throw new Error(`${label} must be an array.`);
  }
}

function assertString(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${label} must be a non-empty string.`);
  }
}

function assertNumber(value: unknown, label: string): asserts value is number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`${label} must be a number.`);
  }
}

function assertBoolean(value: unknown, label: string): asserts value is boolean {
  if (typeof value !== "boolean") {
    throw new Error(`${label} must be a boolean.`);
  }
}
