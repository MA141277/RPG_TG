import type { TxtNarrativePlaceResolution } from "../../domain/txt-narrative";

type KnownTxtNarrativePlace = {
  houseId: string;
  placeName: string;
};

function normalizePlaceName(placeName: string): string {
  return placeName.trim().replace(/\s+/gu, "");
}

function computePlaceSimilarity(requested: string, authored: string): number {
  if (requested === authored) {
    return 1;
  }

  if (requested.includes(authored) || authored.includes(requested)) {
    return Math.min(requested.length, authored.length) / Math.max(requested.length, authored.length);
  }

  const requestedChars = new Set(normalizePlaceName(requested));
  const authoredChars = new Set(normalizePlaceName(authored));
  const overlap = Array.from(requestedChars).filter((character) =>
    authoredChars.has(character)
  ).length;

  if (overlap === 0) {
    return 0;
  }

  return overlap / Math.max(requestedChars.size, authoredChars.size, 1);
}

export function resolveTxtNarrativePlace(
  input: {
    requestedName: string;
    knownPlaces: KnownTxtNarrativePlace[];
  }
): TxtNarrativePlaceResolution {
  const { requestedName, knownPlaces } = input;
  const normalizedRequestedName = normalizePlaceName(requestedName);
  const exactMatch =
    knownPlaces.find(
      (knownPlace) =>
        normalizePlaceName(knownPlace.placeName) === normalizedRequestedName
    ) ?? null;

  if (exactMatch != null) {
    return {
      requestedName,
      resolvedHouseId: exactMatch.houseId,
      resolvedPlaceName: exactMatch.placeName,
      strategy: "exact",
      confidence: 1,
    };
  }

  let bestMatch: KnownTxtNarrativePlace | null = null;
  let bestScore = 0;
  for (const knownPlace of knownPlaces) {
    const score = computePlaceSimilarity(requestedName, knownPlace.placeName);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = knownPlace;
    }
  }

  if (bestMatch != null && bestScore >= 0.34) {
    return {
      requestedName,
      resolvedHouseId: bestMatch.houseId,
      resolvedPlaceName: bestMatch.placeName,
      strategy: "fuzzy_existing",
      confidence: bestScore,
    };
  }

  return {
    requestedName,
    strategy: "temporary_generated",
    confidence: 0,
    note: "no-authored-place-match",
  };
}
