import type { GameState } from "../../domain/game-state";
import type { ScenarioProfileDefinition } from "../../domain/scenario-profile";

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
  const currentView =
    profile.launchPolicy?.initialView ?? profile.initialLocation.view;

  return {
    currentMapId: profile.initialLocation.mapId,
    currentCityId: profile.initialLocation.cityId,
    currentHouseId:
      currentView === "house" ? profile.initialLocation.houseId : null,
    currentView,
    activeDialogueId:
      currentView === "dialogue"
        ? profile.initialLocation.dialogueId ?? null
        : null,
  };
}
