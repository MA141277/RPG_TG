export type UiAssetCatalog = {
  id: string;
  version: number;
  aliases: Record<string, string>;
};

export function isUiAssetCatalog(value: unknown): value is UiAssetCatalog {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.version === "number" &&
    candidate.aliases != null &&
    typeof candidate.aliases === "object" &&
    !Array.isArray(candidate.aliases)
  );
}
