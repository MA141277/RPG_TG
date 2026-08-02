import type { ContentPackDefinition } from "../../domain/content-pack";
import type { MapDefinition } from "../../domain/map";
import { assertHouseModuleDefaults } from "./house-module-defaults";

const CONTENT_PACK_FILE_KEYS = [
  "maps",
  "cities",
  "houses",
  "buildingArrangements",
  "cityEntries",
  "characters",
  "events",
  "eventBindings",
  "menuResources",
  "menuInstances",
  "dialogues",
  "tasks",
  "playableShells",
  "textEntries",
  "activities",
  "cards",
  "valuables",
  "cityNpcPools",
  "locationAccess",
  "houseModuleDefaults",
  "portraits",
  "portraitVariants",
  "cityPortraits",
  "historicalCharacters",
  "historicalCityRosters",
  "historicalCharacterIdByCharacterId",
  "uiScreenSchemas",
  "uiLayouts",
  "uiSkins",
  "uiAssetCatalogs",
] as const;

type ContentPackFileKey = (typeof CONTENT_PACK_FILE_KEYS)[number];

type ContentPackManifest = Pick<
  ContentPackDefinition,
  "schemaVersion" | "id" | "title" | "description" | "audioSettings"
> & {
  files: Partial<Record<ContentPackFileKey, string>> & Record<string, unknown>;
};

export async function loadContentPackFromManifestUrl(
  url: string
): Promise<ContentPackDefinition> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load content pack manifest: ${response.status}`);
  }

  return loadContentPackFromManifestText(await response.text(), url);
}

export async function loadContentPackFromManifestText(
  text: string,
  manifestUrl: string
): Promise<ContentPackDefinition> {
  const manifest = parseContentPackManifest(JSON.parse(text));
  const hydratedFields = await hydrateContentPackManifest(manifest, manifestUrl);
  const resolvedMaps = resolveContentPackMapAssetUrls(
    hydratedFields.maps,
    manifestUrl
  );
  const resolvedPortraits = resolveContentPackPortraitAssetUrls(
    hydratedFields.portraits,
    manifestUrl
  );

  const pack = {
    schemaVersion: manifest.schemaVersion,
    id: manifest.id,
    title: manifest.title,
    ...(manifest.description == null ? {} : { description: manifest.description }),
    ...(manifest.audioSettings == null
      ? {}
      : { audioSettings: manifest.audioSettings }),
    ...hydratedFields,
    ...(resolvedMaps == null ? {} : { maps: resolvedMaps }),
    ...(resolvedPortraits == null ? {} : { portraits: resolvedPortraits }),
  };

  if (pack.houseModuleDefaults != null) {
    assertHouseModuleDefaults(
      pack.houseModuleDefaults,
      "content pack houseModuleDefaults"
    );
  }

  return pack;
}

export function resolvePackRelativeUrl(
  manifestUrl: string,
  value: string | undefined
): string | undefined {
  if (value == null) {
    return undefined;
  }
  if (/^(https?:|file:|\/)/.test(value)) {
    return value;
  }
  return new URL(value, manifestUrl).href;
}

function parseContentPackManifest(value: unknown): ContentPackManifest {
  assertObject(value, "content pack manifest");
  if (value.schemaVersion !== 1) {
    throw new Error("Content pack schemaVersion must be 1.");
  }
  assertString(value.id, "content pack id");
  assertString(value.title, "content pack title");
  assertObject(value.files, "content pack files");
  if (value.audioSettings != null) {
    assertObject(value.audioSettings, "content pack audioSettings");
    assertOptionalBoolean(
      value.audioSettings.muted,
      "content pack audioSettings.muted"
    );
  }
  if (Object.hasOwn(value.files, "flowDefinitions")) {
    throw new Error(
      'content pack files.flowDefinitions is retired; use files.playableShells instead.'
    );
  }

  return value as ContentPackManifest;
}

async function hydrateContentPackManifest(
  manifest: ContentPackManifest,
  manifestUrl: string
): Promise<Partial<ContentPackDefinition>> {
  const hydratedEntries = await Promise.all(
    CONTENT_PACK_FILE_KEYS.flatMap((key) => {
      const relativePath = manifest.files[key];
      if (typeof relativePath !== "string" || relativePath.length === 0) {
        return [];
      }

      return [loadContentPackFile(key, relativePath, manifestUrl)];
    })
  );

  return Object.fromEntries(hydratedEntries) as Partial<ContentPackDefinition>;
}

async function loadContentPackFile(
  key: ContentPackFileKey,
  relativePath: string,
  manifestUrl: string
): Promise<readonly [ContentPackFileKey, unknown]> {
  const response = await fetch(new URL(relativePath, manifestUrl).href);
  if (!response.ok) {
    throw new Error(`Failed to load content pack file "${key}": ${response.status}`);
  }

  return [key, await response.json()] as const;
}

export function resolveContentPackMapAssetUrls(
  maps: Partial<ContentPackDefinition>["maps"],
  manifestUrl: string
): MapDefinition[] | undefined {
  return maps?.map((mapDefinition) => {
    const primaryImageUrl = resolvePackRelativeUrl(
      manifestUrl,
      mapDefinition.primaryImageUrl
    );
    const regionOverlayImageUrl = resolvePackRelativeUrl(
      manifestUrl,
      mapDefinition.regionOverlayImageUrl
    );
    const layers = mapDefinition.layers?.map((layerDefinition) => ({
      ...layerDefinition,
      imageUrl:
        resolvePackRelativeUrl(manifestUrl, layerDefinition.imageUrl) ?? "",
    }));

    return {
      ...mapDefinition,
      ...(primaryImageUrl == null ? {} : { primaryImageUrl }),
      ...(regionOverlayImageUrl == null ? {} : { regionOverlayImageUrl }),
      ...(layers == null ? {} : { layers }),
    };
  });
}

export function resolveContentPackPortraitAssetUrls(
  portraits: Partial<ContentPackDefinition>["portraits"],
  manifestUrl: string
): ContentPackDefinition["portraits"] | undefined {
  return portraits?.map((portrait) => ({
    ...portrait,
    portraitImage:
      resolvePackRelativeUrl(manifestUrl, portrait.portraitImage) ??
      portrait.portraitImage,
    ...(portrait.avatarImage == null
      ? {}
      : {
          avatarImage:
            resolvePackRelativeUrl(manifestUrl, portrait.avatarImage) ??
            portrait.avatarImage,
        }),
  }));
}

function assertObject(
  value: unknown,
  label: string
): asserts value is Record<string, unknown> {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object.`);
  }
}

function assertString(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${label} must be a non-empty string.`);
  }
}

function assertOptionalBoolean(
  value: unknown,
  label: string
): asserts value is boolean | undefined {
  if (value != null && typeof value !== "boolean") {
    throw new Error(`${label} must be boolean when present.`);
  }
}
