import type { SceneDefinition } from "./action";
import type { ActivityDefinition } from "./activity";
import type { CardDefinition } from "./card";
import type { CharacterDefinition } from "./character";
import type { CityDefinition } from "./city";
import type { CityEntryDefinition } from "./city-entry";
import type { CityNpcPoolDefinition } from "./city-npc";
import type { BuildingArrangementDefinition } from "./building-arrangement";
import type { EventBinding, EventDefinition } from "./event";
import type {
  HistoricalCharacterRecord,
  HistoricalCityRoster,
} from "./historical-character";
import type { HouseDefinition } from "./house";
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
import type { FlowPlayableDefinition } from "./playables/flow";

export type ContentPackDefinition = {
  schemaVersion: 1;
  id: string;
  title: string;
  description?: string;
  textEntries?: Record<string, string>;
  maps?: MapDefinition[];
  cities?: CityDefinition[];
  houses?: HouseDefinition[];
  buildingArrangements?: BuildingArrangementDefinition[];
  cityEntries?: CityEntryDefinition[];
  characters?: CharacterDefinition[];
  events?: EventDefinition[];
  eventBindings?: EventBinding[];
  scenes?: SceneDefinition[];
  tasks?: TaskDefinition[];
  playables?: PlayableDefinition[];
  playableIntegrations?: PlayableIntegrationDefinition[];
  flowDefinitions?: FlowPlayableDefinition[];
  activities?: ActivityDefinition[];
  cards?: CardDefinition[];
  valuables?: ValuableItemDefinition[];
  cityNpcPools?: CityNpcPoolDefinition[];
  locationAccess?: LocationAccessDefinition[];
  houseModuleDefaults?: Record<string, Record<string, unknown>>;
  cityPortraits?: Record<string, string>;
  historicalCharacterIdByCharacterId?: Record<string, string>;
  historicalCharacters?: HistoricalCharacterRecord[];
  historicalCityRosters?: HistoricalCityRoster[];
  uiScreenSchemas?: ScreenSchema[];
  uiLayouts?: ScreenLayoutPreset[];
  uiSkins?: ScreenSkinPreset[];
  uiAssetCatalogs?: UiAssetCatalog[];
};
