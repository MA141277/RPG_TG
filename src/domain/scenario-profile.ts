import type { ViewName } from "./game-state";

export type ScenarioProfileId = string;

export type ScenarioProfileDefinition = {
  id: ScenarioProfileId;
  title: string;
  playerCharacterId: string;
  chapterId: string;
  initialCalendar?: {
    year: number;
    month: number;
    day: number;
  };
  initialLocation: {
    mapId: string;
    cityId: string;
    houseId: string | null;
    view: ViewName;
  };
  initialUi?: {
    reviewDateText?: string;
    mainHouseMissionText?: string;
  };
  initialPlayerCoordinate?: {
    x: number;
    y: number;
  };
  initialRuntime?: {
    flags?: Record<string, boolean>;
    variables?: Record<string, number | string>;
  };
  entryEventId?: string;
  openingFlowId?: string;
  tags?: string[];
};
