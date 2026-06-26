import type { ContentPackDefinition } from "../domain/content-pack";
import { loadContentPackFromManifestUrl } from "../application/content/content-pack-loader";

declare const process:
  | {
      cwd?: () => string;
    }
  | undefined;

const DEFAULT_BASE_GAME_MANIFEST_PATH =
  "src/content/scenario-packs/zhuyuanzhang/pack.json";
const DEFAULT_BASE_GAME_PUBLISHED_MANIFEST_PATH =
  "/scenario-packs/zhuyuanzhang/pack.json";

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
    return toFileUrl(`${process.cwd()}\\${DEFAULT_BASE_GAME_MANIFEST_PATH}`);
  }

  if (typeof window !== "undefined") {
    return new URL(
      DEFAULT_BASE_GAME_PUBLISHED_MANIFEST_PATH,
      window.location.href
    ).href;
  }

  return DEFAULT_BASE_GAME_MANIFEST_PATH;
}

function toFileUrl(path: string): string {
  const normalizedPath = path.replaceAll("\\", "/");
  return normalizedPath.startsWith("/")
    ? `file://${normalizedPath}`
    : `file:///${normalizedPath}`;
}
