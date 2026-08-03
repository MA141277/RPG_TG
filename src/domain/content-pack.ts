import type { SceneDefinition } from "./action";
import type { ActivityDefinition } from "./activity";
import type { BuildingArrangementDefinition } from "./building-arrangement";
import type { CardDefinition } from "./card";
import type { CharacterDefinition } from "./character";
import type { CityDefinition } from "./city";
import type { CityEntryDefinition } from "./city-entry";
import type { CityNpcPoolDefinition } from "./city-npc";
import type { EventDefinition } from "./event";
import type {
  HistoricalCharacterRecord,
  HistoricalCityRoster,
} from "./historical-character";
import type { HouseDefinition, HouseAccessRefusalRule } from "./house";
import type { MapDefinition } from "./map";
import type { RuntimeDialogueDefinition } from "./dialogue";
import type { EventBinding } from "./event";
import type { LocationAccessDefinition } from "./location-access";
import type { MenuInstanceDefinition, MenuResourceDefinition } from "./menu";
import type { FlowPlayableDefinition } from "./playables/flow";
import type { SettlementDefinition } from "../core/contracts/settlement-runtime";
import type {
  PlayableDefinition,
  PlayableIntegrationDefinition,
} from "../core/contracts/playable-runtime";
import type {
  ProgressTrackBinding,
  ProgressTrackDefinition,
} from "../core/contracts/progression-runtime";
import type { UiAssetCatalog } from "./ui/asset-catalog";
import type { ScreenLayoutPreset } from "./ui/screen-layout";
import type { ScreenSchema } from "./ui/screen-schema";
import type { ScreenSkinPreset } from "./ui/screen-skin";
import type { ValuableItemDefinition } from "./valuable-item";
import type { TaskDefinition } from "../core/contracts/task-runtime";

export type ItemDisplayDefinition = {
  title?: string;
  iconId?: string;
  imageId?: string;
};

export type ItemStackRule = {
  stackable: boolean;
  maxStack?: number;
  unit?: string;
};

export type ItemDefinition = {
  id: string;
  name: string;
  description?: string;
  internalNote?: string;
  display?: ItemDisplayDefinition;
  stack?: ItemStackRule;
  menuInstanceIds?: string[];
};

export type ContentPackAudioSettings = {
  muted?: boolean;
};

export type ContentPackDefinition = {
  schemaVersion: 1;
  id: string;
  title: string;
  description?: string;
  audioSettings?: ContentPackAudioSettings;
  textEntries?: Record<string, string>;
  maps?: MapDefinition[];
  cities?: CityDefinition[];
  houses?: HouseDefinition[];
  buildingArrangements?: BuildingArrangementDefinition[];
  cityEntries?: CityEntryDefinition[];
  characters?: CharacterDefinition[];
  events?: EventDefinition[];
  scenes?: SceneDefinition[];
  tasks?: TaskDefinition[];
  activities?: ActivityDefinition[];
  cards?: CardDefinition[];
  valuables?: ValuableItemDefinition[];
  items?: ItemDefinition[];
  cityNpcPools?: CityNpcPoolDefinition[];
  houseAccessRefusalRules?: HouseAccessRefusalRule[];
  locationAccess?: LocationAccessDefinition[];
  menuResources?: MenuResourceDefinition[];
  menuInstances?: MenuInstanceDefinition[];
  dialogues?: RuntimeDialogueDefinition[];
  playables?: PlayableDefinition[];
  playableIntegrations?: PlayableIntegrationDefinition[];
  playableShells?: FlowPlayableDefinition[];
  flowPlayables?: FlowPlayableDefinition[];
  flows?: FlowPlayableDefinition[];
  eventBindings?: EventBinding[];
  settlements?: (SettlementDefinition & { id: string; title?: string; nextEventId?: string })[];
  settlementContents?: unknown[];
  progressTracks?: ProgressTrackDefinition[];
  progressTrackBindings?: ProgressTrackBinding[];
  houseModuleDefaults?: Record<string, unknown>;
  cityPortraits?: Record<string, string>;
  historicalCharacterIdByCharacterId?: Record<string, string>;
  historicalCharacters?: HistoricalCharacterRecord[];
  historicalCityRosters?: HistoricalCityRoster[];
  uiScreenSchemas?: ScreenSchema[];
  uiLayouts?: ScreenLayoutPreset[];
  uiSkins?: ScreenSkinPreset[];
  uiAssetCatalogs?: UiAssetCatalog[];
};
