import type { SceneDefinition } from "./action";
import type { ActivityDefinition } from "./activity";
import type { CharacterDefinition } from "./character";
import type { CityDefinition } from "./city";
import type { EventDefinition } from "./event";
import type { HouseDefinition } from "./house";
import type { ScenarioProfileDefinition } from "./scenario-profile";

export type ScenarioPackDefinition = {
  schemaVersion: 1;
  id: string;
  title: string;
  description?: string;
  scenarioProfile: ScenarioProfileDefinition;
  characters: CharacterDefinition[];
  cities?: CityDefinition[];
  houses?: HouseDefinition[];
  events: EventDefinition[];
  scenes: SceneDefinition[];
  activities?: ActivityDefinition[];
};

export type ScenarioPackSummary = {
  id: string;
  title: string;
  description?: string;
  url: string;
};
