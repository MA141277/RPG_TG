import type { GameState } from "../../domain/game-state";
import {
  resolveScenarioProfileStartupPresentation,
  type ScenarioProfileDefinition,
} from "../../domain/scenario-profile";

export type ScenarioStartupTarget = {
  currentMapId: string;
  currentCityId: string;
  currentHouseId: string | null;
  currentView: GameState["ui"]["currentView"];
  activeDialogueId: string | null;
};

export function resolveScenarioStartupTarget(
  profile: ScenarioProfileDefinition
): ScenarioStartupTarget {
  const presentation = resolveScenarioProfileStartupPresentation(profile);

  return {
    currentMapId: profile.initialLocation.mapId,
    currentCityId: profile.initialLocation.cityId,
    currentHouseId: presentation.currentHouseId,
    currentView: presentation.currentView,
    activeDialogueId: presentation.activeDialogueId,
  };
}
