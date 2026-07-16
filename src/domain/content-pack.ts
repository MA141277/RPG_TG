import type { SceneDefinition } from "./action";
import type { ActivityDefinition } from "./activity";
import type { CardDefinition } from "./card";
import type { CharacterDefinition } from "./character";
import type { CityDefinition } from "./city";
import type { CityEntryDefinition } from "./city-entry";
import type { CityNpcPoolDefinition } from "./city-npc";
import type { EventBinding, EventDefinition } from "./event";
import type {
  HistoricalCharacterRecord,
  HistoricalCityRoster,
} from "./historical-character";
import type { HouseDefinition, HouseAccessRefusalRule } from "./house";
import type { HouseModuleId } from "./house-module";
import type { LocationAccessDefinition } from "./location-access";
import type { MapDefinition } from "./map";
import type { UiAssetCatalog } from "./ui/asset-catalog";
import type { ScreenLayoutPreset } from "./ui/screen-layout";
import type { ScreenSchema } from "./ui/screen-schema";
import type { ScreenSkinPreset } from "./ui/screen-skin";
import type { ValuableItemDefinition } from "./valuable-item";
import type { TaskDefinition } from "../core/contracts/task-runtime";
import type {
  PlayableDefinition,
  PlayableIntegrationDefinition,
} from "../core/contracts/playable-runtime";

export type ContentPackDefinition = {
  schemaVersion: 1;
  id: string;
  title: string;
  description?: string;
  textEntries?: Record<string, string>;
  maps?: MapDefinition[];
  cities?: CityDefinition[];
  houses?: HouseDefinition[];
  cityEntries?: CityEntryDefinition[];
  characters?: CharacterDefinition[];
  events?: EventDefinition[];
  eventBindings?: EventBinding[];
  scenes?: SceneDefinition[];
  tasks?: TaskDefinition[];
  playables?: PlayableDefinition[];
  playableIntegrations?: PlayableIntegrationDefinition[];
  activities?: ActivityDefinition[];
  cards?: CardDefinition[];
  valuables?: ValuableItemDefinition[];
  cityNpcPools?: CityNpcPoolDefinition[];
  houseAccessRefusalRules?: HouseAccessRefusalRule[];
  locationAccess?: LocationAccessDefinition[];
  houseModuleDefaults?: Partial<Record<HouseModuleId, Record<string, unknown>>>;
  cityPortraits?: Record<string, string>;
  historicalCharacterIdByCharacterId?: Record<string, string>;
  historicalCharacters?: HistoricalCharacterRecord[];
  historicalCityRosters?: HistoricalCityRoster[];
  uiScreenSchemas?: ScreenSchema[];
  uiLayouts?: ScreenLayoutPreset[];
  uiSkins?: ScreenSkinPreset[];
  uiAssetCatalogs?: UiAssetCatalog[];
};
