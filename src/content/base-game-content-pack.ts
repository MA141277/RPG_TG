import type { ContentPackDefinition } from "../domain/content-pack";
import { loadContentPackFromManifestUrl } from "../application/content/content-pack-loader";
import * as scenarioPackCatalogJsonModule from "./scenario-packs/catalog.json";
import {
  getDefaultScenarioPackCatalogEntry,
  parseScenarioPackCatalog,
  resolveCatalogManifestUrl,
  SCENARIO_PACK_CATALOG_PUBLIC_URL,
} from "../application/content/catalog-loader";

declare const process:
  | {
      cwd?: () => string;
    }
  | undefined;

const DEFAULT_BASE_GAME_CATALOG_PATH = "src/content/scenario-packs/catalog.json";
const defaultBaseGameScenarioPackCatalogEntry = getDefaultScenarioPackCatalogEntry(
  parseScenarioPackCatalog(
    (scenarioPackCatalogJsonModule as { default?: unknown }).default ??
      scenarioPackCatalogJsonModule
  )
);

let baseGameContentPackPromise: Promise<ContentPackDefinition> | null = null;

export function createBaseGameContentPack(): Promise<ContentPackDefinition> {
  if (baseGameContentPackPromise == null) {
    baseGameContentPackPromise = loadContentPackFromManifestUrl(
      resolveDefaultBaseGameManifestUrl()
    );
  }

  return baseGameContentPackPromise;
}

function resolveDefaultBaseGameManifestUrl(): string {
  if (
    typeof process !== "undefined" &&
    typeof process.cwd === "function"
  ) {
    return resolveCatalogManifestUrl(
      toFileUrl(`${process.cwd()}\\${DEFAULT_BASE_GAME_CATALOG_PATH}`),
      defaultBaseGameScenarioPackCatalogEntry.manifestPath
    );
  }

  if (typeof window !== "undefined") {
    return resolveCatalogManifestUrl(
      SCENARIO_PACK_CATALOG_PUBLIC_URL,
      defaultBaseGameScenarioPackCatalogEntry.manifestPath
    );
  }

  return resolveDefaultManifestPathWithoutRuntime();
}

function toFileUrl(path: string): string {
  const normalizedPath = path.replaceAll("\\", "/");
  return normalizedPath.startsWith("/")
    ? `file://${normalizedPath}`
    : `file:///${normalizedPath}`;
}

function resolveDefaultManifestPathWithoutRuntime(): string {
  const manifestPath = defaultBaseGameScenarioPackCatalogEntry.manifestPath;
  if (/^(https?:|file:|\/)/.test(manifestPath)) {
    return manifestPath;
  }

  return `${DEFAULT_BASE_GAME_CATALOG_PATH.replace(/\/catalog\.json$/, "")}/${manifestPath.replace(/^\.?\//, "")}`;
}
