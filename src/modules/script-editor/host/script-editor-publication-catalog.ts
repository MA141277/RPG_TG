import type { ScenarioPackDefinition } from "../../../domain/scenario-pack";
import * as activitiesJson from "../builtin-templates/zhuyuanzhang/activities.json";
import * as buildingArrangementsJson from "../builtin-templates/zhuyuanzhang/building-arrangements.json";
import * as cardsJson from "../builtin-templates/zhuyuanzhang/cards.json";
import * as charactersJson from "../builtin-templates/zhuyuanzhang/characters.json";
import * as citiesJson from "../builtin-templates/zhuyuanzhang/cities.json";
import * as cityEntriesJson from "../builtin-templates/zhuyuanzhang/city-entries.json";
import * as cityNpcPoolsJson from "../builtin-templates/zhuyuanzhang/city-npc-pools.json";
import * as cityPortraitsJson from "../builtin-templates/zhuyuanzhang/city-portraits.json";
import * as dialoguesJson from "../builtin-templates/zhuyuanzhang/dialogues.json";
import * as eventBindingsJson from "../builtin-templates/zhuyuanzhang/event-bindings.json";
import * as eventsJson from "../builtin-templates/zhuyuanzhang/events.json";
import * as historicalCharacterIdMapJson from "../builtin-templates/zhuyuanzhang/historical-character-id-map.json";
import * as historicalCharactersJson from "../builtin-templates/zhuyuanzhang/historical-characters.json";
import * as historicalCityRostersJson from "../builtin-templates/zhuyuanzhang/historical-city-rosters.json";
import * as houseModuleDefaultsJson from "../builtin-templates/zhuyuanzhang/house-module-defaults.json";
import * as housesJson from "../builtin-templates/zhuyuanzhang/houses.json";
import * as locationAccessJson from "../builtin-templates/zhuyuanzhang/location-access.json";
import * as mapsJson from "../builtin-templates/zhuyuanzhang/maps.json";
import * as meetingActionSetsJson from "../builtin-templates/zhuyuanzhang/meeting-action-sets.json";
import * as meetingBindingsJson from "../builtin-templates/zhuyuanzhang/meeting-bindings.json";
import * as meetingChoiceSetsJson from "../builtin-templates/zhuyuanzhang/meeting-choice-sets.json";
import * as meetingPanelsJson from "../builtin-templates/zhuyuanzhang/meeting-panels.json";
import * as meetingsJson from "../builtin-templates/zhuyuanzhang/meetings.json";
import * as menuInstancesJson from "../builtin-templates/zhuyuanzhang/menu-instances.json";
import * as menuResourcesJson from "../builtin-templates/zhuyuanzhang/menu-resources.json";
import * as packManifestJson from "../builtin-templates/zhuyuanzhang/pack.json";
import * as playableIntegrationsJson from "../builtin-templates/zhuyuanzhang/playable-integrations.json";
import * as playableShellsJson from "../builtin-templates/zhuyuanzhang/playable-shells.json";
import * as playablesJson from "../builtin-templates/zhuyuanzhang/playables.json";
import * as portraitVariantsJson from "../builtin-templates/zhuyuanzhang/portrait-variants.json";
import * as portraitsJson from "../builtin-templates/zhuyuanzhang/portraits.json";
import * as scenarioProfileJson from "../builtin-templates/zhuyuanzhang/scenario-profile.json";
import * as settlementsJson from "../builtin-templates/zhuyuanzhang/settlements.json";
import * as textEntriesJson from "../builtin-templates/zhuyuanzhang/text-entries.json";
import * as valuablesJson from "../builtin-templates/zhuyuanzhang/valuables.json";

type RegisteredScenarioPackManifest = {
  schemaVersion: 1;
  id: string;
  title: string;
  description?: string;
  files?: Record<string, string>;
};

type RegisteredBuiltinTemplateMapLayer = Record<string, unknown> & {
  imageUrl?: string;
};

type RegisteredBuiltinTemplateMapRecord = Record<string, unknown> & {
  primaryImageUrl?: string;
  regionOverlayImageUrl?: string;
  layers?: RegisteredBuiltinTemplateMapLayer[];
};

export type ScriptEditorPublicationCatalog = {
  loadScenarioPackFromUrl(url: string): ScenarioPackDefinition | null;
  getBuiltinTemplateManifestUrl(): string;
};

const BUILTIN_TEMPLATE_REGISTERED_MANIFEST_URL =
  "/builtin-script-editor-templates/zhuyuanzhang/pack.json";
const REGISTERED_BUILTIN_TEMPLATE_ASSET_ROOT =
  "/builtin-script-editor-templates/zhuyuanzhang";

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

function isRegisteredBuiltinTemplateManifestUrl(url: string): boolean {
  if (url === BUILTIN_TEMPLATE_REGISTERED_MANIFEST_URL) {
    return true;
  }

  try {
    const { pathname } = new URL(url);
    return pathname === BUILTIN_TEMPLATE_REGISTERED_MANIFEST_URL;
  } catch {
    return false;
  }
}

function resolveRegisteredBuiltinTemplateAssetUrl(value: string | undefined) {
  if (typeof value !== "string" || value.length === 0) {
    return value;
  }
  if (/^(https?:|data:|blob:|\/)/.test(value)) {
    return value;
  }

  return `${REGISTERED_BUILTIN_TEMPLATE_ASSET_ROOT}/${value.replace(
    /^\.\//,
    ""
  )}`;
}

function resolveRegisteredBuiltinTemplateMaps() {
  const sourceMaps = unwrapJsonModule<RegisteredBuiltinTemplateMapRecord[]>(
    mapsJson
  );
  return (Array.isArray(sourceMaps) ? sourceMaps : []).map((mapRecord) => ({
    ...mapRecord,
    ...(mapRecord?.primaryImageUrl == null
      ? {}
      : {
          primaryImageUrl: resolveRegisteredBuiltinTemplateAssetUrl(
            mapRecord.primaryImageUrl
          ),
        }),
    ...(mapRecord?.regionOverlayImageUrl == null
      ? {}
      : {
          regionOverlayImageUrl: resolveRegisteredBuiltinTemplateAssetUrl(
            mapRecord.regionOverlayImageUrl
          ),
        }),
    ...(Array.isArray(mapRecord?.layers)
      ? {
          layers: mapRecord.layers.map((layer) => ({
            ...layer,
            imageUrl:
              resolveRegisteredBuiltinTemplateAssetUrl(layer?.imageUrl) ?? "",
          })),
        }
      : {}),
  }));
}

export function createBuiltinScriptEditorPublicationCatalog(): ScriptEditorPublicationCatalog {
  return {
    loadScenarioPackFromUrl(url) {
      if (!isRegisteredBuiltinTemplateManifestUrl(url)) {
        return null;
      }

      const sourceManifest = unwrapJsonModule<RegisteredScenarioPackManifest>(
        packManifestJson
      );
      const hydratedFields = Object.fromEntries(
        Object.entries(sourceManifest.files ?? {}).map(([key, relativePath]) => {
          if (relativePath === "maps.json") {
            return [key, resolveRegisteredBuiltinTemplateMaps()];
          }

          const fileValue = unwrapJsonModule(
            builtinTemplateJsonFileContentsByRelativePath[
              relativePath as keyof typeof builtinTemplateJsonFileContentsByRelativePath
            ]
          );
          if (fileValue === undefined) {
            throw new Error(
              `Unsupported registered builtin template file: ${relativePath}`
            );
          }

          return [key, fileValue];
        })
      );

      return {
        schemaVersion: sourceManifest.schemaVersion,
        id: sourceManifest.id,
        title: sourceManifest.title,
        ...(sourceManifest.description == null
          ? {}
          : { description: sourceManifest.description }),
        ...hydratedFields,
      } as ScenarioPackDefinition;
    },
    getBuiltinTemplateManifestUrl() {
      return BUILTIN_TEMPLATE_REGISTERED_MANIFEST_URL;
    },
  };
}
