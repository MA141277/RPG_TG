import activitiesJson from "../builtin-templates/zhuyuanzhang/activities.json";
import buildingArrangementsJson from "../builtin-templates/zhuyuanzhang/building-arrangements.json";
import cardsJson from "../builtin-templates/zhuyuanzhang/cards.json";
import charactersJson from "../builtin-templates/zhuyuanzhang/characters.json";
import citiesJson from "../builtin-templates/zhuyuanzhang/cities.json";
import cityEntriesJson from "../builtin-templates/zhuyuanzhang/city-entries.json";
import cityNpcPoolsJson from "../builtin-templates/zhuyuanzhang/city-npc-pools.json";
import cityPortraitsJson from "../builtin-templates/zhuyuanzhang/city-portraits.json";
import dialoguesJson from "../builtin-templates/zhuyuanzhang/dialogues.json";
import eventBindingsJson from "../builtin-templates/zhuyuanzhang/event-bindings.json";
import eventsJson from "../builtin-templates/zhuyuanzhang/events.json";
import historicalCharacterIdMapJson from "../builtin-templates/zhuyuanzhang/historical-character-id-map.json";
import historicalCharactersJson from "../builtin-templates/zhuyuanzhang/historical-characters.json";
import historicalCityRostersJson from "../builtin-templates/zhuyuanzhang/historical-city-rosters.json";
import houseModuleDefaultsJson from "../builtin-templates/zhuyuanzhang/house-module-defaults.json";
import housesJson from "../builtin-templates/zhuyuanzhang/houses.json";
import locationAccessJson from "../builtin-templates/zhuyuanzhang/location-access.json";
import mapsJson from "../builtin-templates/zhuyuanzhang/maps.json";
import meetingActionSetsJson from "../builtin-templates/zhuyuanzhang/meeting-action-sets.json";
import meetingBindingsJson from "../builtin-templates/zhuyuanzhang/meeting-bindings.json";
import meetingChoiceSetsJson from "../builtin-templates/zhuyuanzhang/meeting-choice-sets.json";
import meetingPanelsJson from "../builtin-templates/zhuyuanzhang/meeting-panels.json";
import meetingsJson from "../builtin-templates/zhuyuanzhang/meetings.json";
import menuInstancesJson from "../builtin-templates/zhuyuanzhang/menu-instances.json";
import menuResourcesJson from "../builtin-templates/zhuyuanzhang/menu-resources.json";
import packManifestJson from "../builtin-templates/zhuyuanzhang/pack.json";
import playableIntegrationsJson from "../builtin-templates/zhuyuanzhang/playable-integrations.json";
import playableShellsJson from "../builtin-templates/zhuyuanzhang/playable-shells.json";
import playablesJson from "../builtin-templates/zhuyuanzhang/playables.json";
import portraitVariantsJson from "../builtin-templates/zhuyuanzhang/portrait-variants.json";
import portraitsJson from "../builtin-templates/zhuyuanzhang/portraits.json";
import scenarioProfileJson from "../builtin-templates/zhuyuanzhang/scenario-profile.json";
import settlementsJson from "../builtin-templates/zhuyuanzhang/settlements.json";
import textEntriesJson from "../builtin-templates/zhuyuanzhang/text-entries.json";
import valuablesJson from "../builtin-templates/zhuyuanzhang/valuables.json";
import mapHdUrl from "../builtin-templates/zhuyuanzhang/assets/maps/HD.png?url";
import mapTie1Url from "../builtin-templates/zhuyuanzhang/assets/maps/tie1.png?url";
import mapTietuUrl from "../builtin-templates/zhuyuanzhang/assets/maps/tietu.png?url";
import mapFogNoiseUrl from "../builtin-templates/zhuyuanzhang/assets/maps/yuanmo-fog-noise.png?url";
import mapClimatesUrl from "../builtin-templates/zhuyuanzhang/assets/maps/yuanmo-map-climates.png?url";
import mapGroundTypesUrl from "../builtin-templates/zhuyuanzhang/assets/maps/yuanmo-map-ground-types.png?url";
import mapHeightsUrl from "../builtin-templates/zhuyuanzhang/assets/maps/yuanmo-map-heights.png?url";
import mapRegionsUrl from "../builtin-templates/zhuyuanzhang/assets/maps/yuanmo-map-regions.png?url";
import mapTradeRoutesUrl from "../builtin-templates/zhuyuanzhang/assets/maps/yuanmo-map-trade-routes.png?url";
import mapWaterNoiseUrl from "../builtin-templates/zhuyuanzhang/assets/maps/yuanmo-water-noise.png?url";
import { loadScriptEditorProjectFromScenarioPackFiles } from "./runtime-pack-import";
import type { ScriptEditorProjectDefinition } from "../domain/script-editor-project";

type RuntimePackManifestFileMap = {
  files?: Record<string, string>;
};

type BuiltinTemplateMapRecord = {
  primaryImageUrl?: string;
  regionOverlayImageUrl?: string;
  campaignHexGridUrl?: string;
  campaignVegetationRulesUrl?: string;
  layers?: Array<{
    imageUrl?: string;
  }>;
};

const builtinTemplateJsonFileContentsByRelativePath = Object.freeze({
  "activities.json": activitiesJson,
  "building-arrangements.json": buildingArrangementsJson,
  "cards.json": cardsJson,
  "characters.json": charactersJson,
  "cities.json": citiesJson,
  "city-entries.json": cityEntriesJson,
  "city-npc-pools.json": cityNpcPoolsJson,
  "city-portraits.json": cityPortraitsJson,
  "dialogues.json": dialoguesJson,
  "event-bindings.json": eventBindingsJson,
  "events.json": eventsJson,
  "historical-character-id-map.json": historicalCharacterIdMapJson,
  "historical-characters.json": historicalCharactersJson,
  "historical-city-rosters.json": historicalCityRostersJson,
  "house-module-defaults.json": houseModuleDefaultsJson,
  "houses.json": housesJson,
  "location-access.json": locationAccessJson,
  "maps.json": mapsJson,
  "meeting-action-sets.json": meetingActionSetsJson,
  "meeting-bindings.json": meetingBindingsJson,
  "meeting-choice-sets.json": meetingChoiceSetsJson,
  "meeting-panels.json": meetingPanelsJson,
  "meetings.json": meetingsJson,
  "menu-instances.json": menuInstancesJson,
  "menu-resources.json": menuResourcesJson,
  "pack.json": packManifestJson,
  "playable-integrations.json": playableIntegrationsJson,
  "playable-shells.json": playableShellsJson,
  "playables.json": playablesJson,
  "portrait-variants.json": portraitVariantsJson,
  "portraits.json": portraitsJson,
  "scenario-profile.json": scenarioProfileJson,
  "settlements.json": settlementsJson,
  "text-entries.json": textEntriesJson,
  "valuables.json": valuablesJson,
} satisfies Record<string, unknown>);

const builtinTemplateAssetUrlsByRelativePath = Object.freeze({
  "assets/maps/HD.png": mapHdUrl,
  "assets/maps/tie1.png": mapTie1Url,
  "assets/maps/tietu.png": mapTietuUrl,
  "assets/maps/yuanmo-fog-noise.png": mapFogNoiseUrl,
  "assets/maps/yuanmo-map-climates.png": mapClimatesUrl,
  "assets/maps/yuanmo-map-ground-types.png": mapGroundTypesUrl,
  "assets/maps/yuanmo-map-heights.png": mapHeightsUrl,
  "assets/maps/yuanmo-map-regions.png": mapRegionsUrl,
  "assets/maps/yuanmo-map-trade-routes.png": mapTradeRoutesUrl,
  "assets/maps/yuanmo-water-noise.png": mapWaterNoiseUrl,
} satisfies Record<string, string>);

function createBuiltinTemplateManifestRelativePaths(): string[] {
  const manifestFileMap =
    (packManifestJson as RuntimePackManifestFileMap).files ?? {};

  return [
    "pack.json",
    ...new Set(
      [
        ...Object.values(manifestFileMap).filter(
          (relativePath): relativePath is string =>
            typeof relativePath === "string" && relativePath.length > 0
        ),
        ...collectBuiltinTemplateMapAssetRelativePaths(),
      ]
    ),
  ];
}

function collectBuiltinTemplateMapAssetRelativePaths(): string[] {
  const assetPaths = new Set<string>();

  for (const mapRecord of Array.isArray(mapsJson)
    ? (mapsJson as BuiltinTemplateMapRecord[])
    : []) {
    for (const assetPath of [
      mapRecord?.primaryImageUrl,
      mapRecord?.regionOverlayImageUrl,
      mapRecord?.campaignHexGridUrl,
      mapRecord?.campaignVegetationRulesUrl,
      ...(Array.isArray(mapRecord?.layers)
        ? mapRecord.layers.map((layer) => layer?.imageUrl)
        : []),
    ]) {
      if (
        typeof assetPath !== "string" ||
        assetPath.length === 0 ||
        /^(https?:|data:|blob:|\/)/.test(assetPath)
      ) {
        continue;
      }

      assetPaths.add(assetPath.replace(/^\.\//, ""));
    }
  }

  return [...assetPaths];
}

async function createBuiltinTemplateImportFile(
  relativePath: string
): Promise<File> {
  const jsonContent =
    builtinTemplateJsonFileContentsByRelativePath[
      relativePath as keyof typeof builtinTemplateJsonFileContentsByRelativePath
    ];
  if (jsonContent !== undefined) {
    return new File([JSON.stringify(jsonContent)], relativePath, {
      type: "application/json",
    });
  }

  const assetUrl =
    builtinTemplateAssetUrlsByRelativePath[
      relativePath as keyof typeof builtinTemplateAssetUrlsByRelativePath
    ];
  if (typeof assetUrl !== "string" || assetUrl.length === 0) {
    throw new Error(`Unsupported builtin template file: ${relativePath}`);
  }

  const response = await fetch(assetUrl);
  if (!response.ok) {
    throw new Error(
      `Failed to load builtin template asset "${relativePath}": ${response.status}`
    );
  }

  const blob = await response.blob();
  return new File([blob], relativePath, {
    type: blob.type || "application/octet-stream",
  });
}

export async function loadDefaultScriptEditorTemplateProject(): Promise<ScriptEditorProjectDefinition> {
  const files = await Promise.all(
    createBuiltinTemplateManifestRelativePaths().map((relativePath) =>
      createBuiltinTemplateImportFile(relativePath)
    )
  );

  return loadScriptEditorProjectFromScenarioPackFiles(files);
}
