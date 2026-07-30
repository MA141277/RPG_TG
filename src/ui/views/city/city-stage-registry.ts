import type {
  CityStageLayoutSource,
  CityStagePrefabLibrary,
} from "./city-stage-layout-data";
import {
  CITY_STAGE_AMBIENT_NPC_SPRITE_SET_IDS,
  isAmbientNpcSpriteSetId,
} from "./city-stage-ambient-npc-sprites";
import type { CityStageAmbientNpcDescriptor } from "./city-stage-geometry";

export type CityStageNpcPoolSource = {
  descriptors: unknown[];
};

export type CityStageBundle = {
  citySlug: string;
  layoutSource: CityStageLayoutSource;
  prefabLibrary: CityStagePrefabLibrary;
  npcPoolSource: null | CityStageNpcPoolSource;
};

const cityStageLayoutModuleGroups = [
  import.meta.glob(
    "../../../../src/content/scenario-packs/**/city-stage/*-city-layout*.json",
    {
      eager: true,
    }
  ),
  import.meta.glob(
    "../../../../src/content/scenario-packs/**/city-stages/*-city-layout*.json",
    {
      eager: true,
    }
  ),
  import.meta.glob(
    "../../../../tools/city-map-building-editor/examples/*-city-layout*.json",
    {
      eager: true,
    }
  ),
];

const cityStagePrefabModuleGroups = [
  import.meta.glob(
    "../../../../src/content/scenario-packs/**/city-stage/*-city-prefabs*.json",
    {
      eager: true,
    }
  ),
  import.meta.glob(
    "../../../../src/content/scenario-packs/**/city-stages/*-city-prefabs*.json",
    {
      eager: true,
    }
  ),
  import.meta.glob(
    "../../../../tools/city-map-building-editor/examples/*-city-prefabs*.json",
    {
      eager: true,
    }
  ),
];

const cityStageNpcPoolModuleGroups = [
  import.meta.glob(
    "../../../../src/content/scenario-packs/**/city-stage/*-city-npc-pool*.json",
    {
      eager: true,
    }
  ),
  import.meta.glob(
    "../../../../src/content/scenario-packs/**/city-stages/*-city-npc-pool*.json",
    {
      eager: true,
    }
  ),
  import.meta.glob(
    "../../../../tools/city-map-building-editor/examples/*-city-npc-pool*.json",
    {
      eager: true,
    }
  ),
];

function unwrapJsonModule<T>(moduleValue: unknown): T {
  if (
    moduleValue != null &&
    typeof moduleValue === "object" &&
    "default" in moduleValue
  ) {
    return (moduleValue as { default: T }).default;
  }

  return moduleValue as T;
}

function getCitySlugFromModulePath(
  modulePath: string,
  kind: "layout" | "prefabs" | "npc-pool"
): string | null {
  const normalizedPath = modulePath.replace(/\\/g, "/");
  const patternByKind = {
    layout: /\/([^/]+)-city-layout(?:\.example)?\.json$/,
    prefabs: /\/([^/]+)-city-prefabs(?:\.example)?\.json$/,
    "npc-pool": /\/([^/]+)-city-npc-pool(?:\.example)?\.json$/,
  } as const;
  const match = normalizedPath.match(patternByKind[kind]);

  return match?.[1] ?? null;
}

function normalizeCityLookupKey(value: string): string {
  return value.trim().toLowerCase().replace(/[_\s.]+/g, "-");
}

const cityStageSlugByCityId: Record<string, string> = {
  "city.kulan": "haozhou",
};

function collectCityStageModules<T>(
  moduleGroups: Array<Record<string, unknown>>,
  kind: "layout" | "prefabs" | "npc-pool"
): Map<string, T> {
  const modulesBySlug = new Map<string, T>();

  for (const moduleGroup of moduleGroups) {
    for (const [modulePath, moduleValue] of Object.entries(moduleGroup)) {
      const citySlug = getCitySlugFromModulePath(modulePath, kind);
      if (citySlug == null || modulesBySlug.has(citySlug)) {
        continue;
      }

      modulesBySlug.set(citySlug, unwrapJsonModule<T>(moduleValue));
    }
  }

  return modulesBySlug;
}

function buildCityStageBundleMap(): Map<string, CityStageBundle> {
  const layoutBySlug = collectCityStageModules<CityStageLayoutSource>(
    cityStageLayoutModuleGroups,
    "layout"
  );
  const prefabsBySlug = collectCityStageModules<CityStagePrefabLibrary>(
    cityStagePrefabModuleGroups,
    "prefabs"
  );
  const npcPoolBySlug = collectCityStageModules<CityStageNpcPoolSource>(
    cityStageNpcPoolModuleGroups,
    "npc-pool"
  );

  const bundles = new Map<string, CityStageBundle>();
  for (const [citySlug, layoutSource] of layoutBySlug.entries()) {
    const prefabLibrary = prefabsBySlug.get(citySlug);
    if (prefabLibrary == null) {
      continue;
    }
    bundles.set(citySlug, {
      citySlug,
      layoutSource,
      prefabLibrary,
      npcPoolSource: npcPoolBySlug.get(citySlug) ?? null,
    });
  }

  return bundles;
}

const discoveredCityStageBundles = buildCityStageBundleMap();

export function discoverCityStageBundles(): Map<string, CityStageBundle> {
  return new Map(discoveredCityStageBundles);
}

function findBundleByNormalizedKey(normalizedKey: string): CityStageBundle | null {
  for (const bundle of discoveredCityStageBundles.values()) {
    const candidateKeys = new Set<string>([
      normalizeCityLookupKey(bundle.citySlug),
      normalizeCityLookupKey(bundle.layoutSource.map.id),
    ]);

    if (candidateKeys.has(normalizedKey)) {
      return bundle;
    }
  }

  return null;
}

export function getCityStageBundleForCity(cityId: string): CityStageBundle | null {
  if (discoveredCityStageBundles.size === 0) {
    return null;
  }

  const mappedCitySlug = cityStageSlugByCityId[cityId];
  if (mappedCitySlug != null) {
    const mappedMatch = findBundleByNormalizedKey(
      normalizeCityLookupKey(mappedCitySlug)
    );
    if (mappedMatch != null) {
      return mappedMatch;
    }
  }

  const normalizedCityId = normalizeCityLookupKey(cityId);
  const directMatch = findBundleByNormalizedKey(normalizedCityId);
  if (directMatch != null) {
    return directMatch;
  }

  const cityIdSuffix = cityId.includes(".") ? cityId.split(".").at(-1) : cityId;
  if (cityIdSuffix != null) {
    const suffixMatch = findBundleByNormalizedKey(
      normalizeCityLookupKey(cityIdSuffix)
    );
    if (suffixMatch != null) {
      return suffixMatch;
    }
  }

  if (discoveredCityStageBundles.size === 1) {
    return discoveredCityStageBundles.values().next().value ?? null;
  }

  return null;
}

const defaultAmbientNpcDescriptorSeeds = [
  { id: "ambient-commoner-1", label: "Commoner", palette: "neutral", speed: 0.82 },
  { id: "ambient-commoner-2", label: "Commoner", palette: "neutral", speed: 0.8 },
  { id: "ambient-monk-1", label: "Monk", palette: "warm", speed: 0.76 },
  { id: "ambient-priest-1", label: "Priest", palette: "warm", speed: 0.78 },
  { id: "ambient-scholar-1", label: "Scholar", palette: "cool", speed: 0.8 },
  { id: "ambient-official-1", label: "Official", palette: "cool", speed: 0.86 },
  { id: "ambient-noble-1", label: "Noble", palette: "warm", speed: 0.74 },
  { id: "ambient-noble-2", label: "Noble", palette: "warm", speed: 0.72 },
] as const;

function createDefaultAmbientNpcDescriptors(): CityStageAmbientNpcDescriptor[] {
  return defaultAmbientNpcDescriptorSeeds.map((seed, index) => ({
    ...seed,
    spriteSetId:
      CITY_STAGE_AMBIENT_NPC_SPRITE_SET_IDS[
        index % CITY_STAGE_AMBIENT_NPC_SPRITE_SET_IDS.length
      ] ?? "平民1",
  }));
}

function isPalette(
  value: unknown
): value is CityStageAmbientNpcDescriptor["palette"] {
  return value === "warm" || value === "cool" || value === "neutral";
}

export function getAmbientNpcDescriptors(
  bundle: CityStageBundle
): CityStageAmbientNpcDescriptor[] {
  const rawDescriptors = bundle.npcPoolSource?.descriptors;
  if (!Array.isArray(rawDescriptors) || rawDescriptors.length === 0) {
    return createDefaultAmbientNpcDescriptors().map((descriptor) => ({ ...descriptor }));
  }

  const normalizedDescriptors = rawDescriptors
    .map((descriptor, index) => {
      if (descriptor == null || typeof descriptor !== "object") {
        return null;
      }

      const candidate = descriptor as Record<string, unknown>;
      const palette = isPalette(candidate.palette) ? candidate.palette : "neutral";
      const speed =
        typeof candidate.speed === "number" && Number.isFinite(candidate.speed)
          ? candidate.speed
          : 0.82;
      const fallbackSpriteSetId =
        CITY_STAGE_AMBIENT_NPC_SPRITE_SET_IDS[
          index % CITY_STAGE_AMBIENT_NPC_SPRITE_SET_IDS.length
        ] ?? "平民1";
      const spriteSetId = isAmbientNpcSpriteSetId(candidate.spriteSetId)
        ? candidate.spriteSetId.trim()
        : fallbackSpriteSetId;

      return {
        id:
          typeof candidate.id === "string" && candidate.id.trim().length > 0
            ? candidate.id
            : `ambient-${bundle.citySlug}-${index}`,
        label:
          typeof candidate.label === "string" && candidate.label.trim().length > 0
            ? candidate.label
            : `Ambient ${index + 1}`,
        palette,
        speed,
        spriteSetId,
      } satisfies CityStageAmbientNpcDescriptor;
    })
    .filter((descriptor): descriptor is CityStageAmbientNpcDescriptor => descriptor != null);

  if (normalizedDescriptors.length > 0) {
    return normalizedDescriptors;
  }

  return createDefaultAmbientNpcDescriptors().map((descriptor) => ({ ...descriptor }));
}
