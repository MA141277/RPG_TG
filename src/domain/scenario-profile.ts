import type { CharacterId } from "./character";
import type { CityId } from "./city";
import type { ChapterId, EventId } from "./event";
import type { ViewName, CalendarDate, GameState } from "./game-state";
import type { HouseId } from "./house";
import type { MapId } from "./map";

export type ScenarioRuntimeBootstrap = {
  flags?: Record<string, boolean>;
  variables?: Record<string, string | number>;
};

export type ScenarioLaunchPolicy = {
  characterSelection?: "shell" | "fixed";
  initialView?: ViewName;
  entryEventTiming?: "immediate" | "after-map-entry";
};

export type ScenarioProfileDefinition = {
  id: string;
  title: string;
  playerCharacterId: CharacterId;
  chapterId: ChapterId;
  initialCalendar?: CalendarDate;
  initialLocation: {
    mapId: MapId;
    cityId: CityId;
    houseId: HouseId | null;
    view: ViewName;
  };
  initialPlayerCoordinate?: {
    x: number;
    y: number;
  };
  initialUi?: {
    reviewDateText?: string;
    mainHouseMissionText?: string;
  };
  initialRuntime?: ScenarioRuntimeBootstrap;
  launchPolicy?: ScenarioLaunchPolicy;
  entryEventId?: EventId;
  openingFlowId?: string;
  tags?: string[];
};

export type ScenarioProfileId = ScenarioProfileDefinition["id"];
export type ScenarioProfileRuntimeFlags = GameState["runtime"]["flags"];
export type ScenarioProfileRuntimeVariables = GameState["runtime"]["variables"];
