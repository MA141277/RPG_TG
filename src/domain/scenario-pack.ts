import type { ContentPackDefinition } from "./content-pack";
import type { ScenarioProfileDefinition } from "./scenario-profile";

export type ScenarioPackSummary = {
  id: string;
  title: string;
  description?: string;
  url: string;
};

export type ScenarioPackDefinition = ContentPackDefinition & {
  scenarioProfile: ScenarioProfileDefinition;
};
