import type { HouseEntryAccessResult } from "../story/story-stage-access";
import type { HouseRuntimeEntry } from "../../core/contracts/house-runtime";
import {
  resolveCityBuildingView,
  type CityBuildingPlacementRuntimeInput,
} from "./city-building-placement-resolver";

export type CityBuildingHouseRuntimeEntryResult =
  | {
      canEnter: true;
      entry: HouseRuntimeEntry;
    }
  | {
      canEnter: false;
      refusal: HouseEntryAccessResult["refusal"];
    }
  | null;

export function resolveCityBuildingHouseRuntimeEntry(
  input: CityBuildingPlacementRuntimeInput
): CityBuildingHouseRuntimeEntryResult {
  const view = resolveCityBuildingView(input);
  if (view == null) {
    return null;
  }

  if (!view.access.canEnter) {
    return {
      canEnter: false,
      refusal: view.access.refusal,
    };
  }

  return {
    canEnter: true,
    entry: {
      source: "city-building-placement",
      houseId: view.house.id,
      houseDefinition: view.house,
      cityId: view.cityId,
      placementId: view.placementId,
      label: view.label,
    },
  };
}
