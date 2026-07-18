import type { SceneId } from "../../domain/action";
import type { GameState } from "../../domain/game-state";
import type { ScenarioProfileDefinition } from "../../domain/scenario-profile";

export type ScenarioStartupTarget = {
  currentMapId: string;
  currentCityId: string;
  currentHouseId: string | null;
  currentView: GameState["ui"]["currentView"];
  activeSceneId: SceneId | null;
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
    activeSceneId:
      currentView === "scene"
        ? profile.initialLocation.sceneId ?? null
        : null,
  };
}
