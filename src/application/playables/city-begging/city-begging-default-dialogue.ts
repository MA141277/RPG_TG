import {
  getCityBeggingDefaultLocation,
  type CityBeggingDefaultResult,
} from "../../../content/playables/city-begging-default-content";

export type CityBeggingDefaultDialoguePhase =
  | "location-select"
  | "encounter"
  | "fortune-draw"
  | "thinking"
  | "outcome"
  | "completed";

export type CityBeggingDefaultDialogueState = {
  mode: "default-dialogue";
  phase: CityBeggingDefaultDialoguePhase;
  selectedLocationId: string | null;
  selectedOptionId: string | null;
  fixedResult: CityBeggingDefaultResult | null;
  thinkingUntil: number | null;
  settlementApplied: boolean;
};

const DEFAULT_THINKING_DELAY_MS = 2400;

export function createCityBeggingDefaultDialogueState(
  _now: number
): CityBeggingDefaultDialogueState {
  return {
    mode: "default-dialogue",
    phase: "location-select",
    selectedLocationId: null,
    selectedOptionId: null,
    fixedResult: null,
    thinkingUntil: null,
    settlementApplied: false,
  };
}

export function selectCityBeggingDefaultLocation(
  state: CityBeggingDefaultDialogueState,
  locationId: string
): CityBeggingDefaultDialogueState {
  if (
    state.phase !== "location-select" ||
    state.selectedLocationId != null ||
    state.selectedOptionId != null ||
    state.fixedResult != null ||
    getCityBeggingDefaultLocation(locationId) == null
  ) {
    return state;
  }

  return {
    ...state,
    phase: "encounter",
    selectedLocationId: locationId,
    selectedOptionId: null,
    fixedResult: null,
    thinkingUntil: null,
    settlementApplied: false,
  };
}

export function selectCityBeggingDefaultOption(
  state: CityBeggingDefaultDialogueState,
  optionId: string,
  now: number
): CityBeggingDefaultDialogueState {
  if (
    state.phase !== "encounter" ||
    state.selectedLocationId == null ||
    state.selectedOptionId != null ||
    state.fixedResult != null
  ) {
    return state;
  }

  const location =
    getCityBeggingDefaultLocation(state.selectedLocationId);
  const option =
    location?.options.find((candidate) => candidate.optionId === optionId) ??
    null;

  if (location == null || option == null) {
    return state;
  }

  return {
    ...state,
    phase: "fortune-draw",
    selectedOptionId: optionId,
    fixedResult: option.fixedResult,
    thinkingUntil: now + DEFAULT_THINKING_DELAY_MS,
    settlementApplied: false,
  };
}

export function advanceCityBeggingDefaultThinking(
  state: CityBeggingDefaultDialogueState,
  now: number
): CityBeggingDefaultDialogueState {
  if (
    state.thinkingUntil == null ||
    state.phase !== "thinking" ||
    now < state.thinkingUntil
  ) {
    return state;
  }

  return {
    ...state,
    phase: "outcome",
    thinkingUntil: null,
  };
}
