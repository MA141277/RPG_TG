const CITY_NAME_SPLIT_MARKERS = ["★", "※", "●"] as const;

function unwrapBracketedCityName(name: string): string {
  return name.replace(/^\u3010(.+)\u3011$/u, "$1");
}

function findLastCityNameSplitMarkerIndex(name: string): number {
  return CITY_NAME_SPLIT_MARKERS.reduce((lastIndex, marker) => {
    return Math.max(lastIndex, name.lastIndexOf(marker));
  }, -1);
}

export function getCompactCityDisplayName(name: string): string {
  const normalizedName = unwrapBracketedCityName(name.trim());
  const splitMarkerIndex = findLastCityNameSplitMarkerIndex(normalizedName);

  if (splitMarkerIndex >= 0) {
    const compactName = normalizedName.slice(splitMarkerIndex + 1).trim();
    if (compactName.length > 0) {
      return compactName;
    }
  }

  const strippedLegacySuffixName = normalizedName.replace(/[路府]$/u, "").trim();
  if (strippedLegacySuffixName.length > 0) {
    return strippedLegacySuffixName;
  }

  return normalizedName;
}
