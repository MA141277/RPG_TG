import type {
  HomeHouseMode,
  HomeHouseSessionState,
} from "../../../domain/house-modules/home-house-session";

export function createInitialHomeHouseSessionState(
  mode: HomeHouseMode,
  descriptionLines: string[]
): HomeHouseSessionState {
  return {
    mode,
    descriptionLines,
    overlay: null,
  };
}
