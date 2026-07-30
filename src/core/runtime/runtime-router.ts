import type { RuntimeRequest } from "../contracts/runtime-request";
import type { RuntimeEventRouteResult } from "../contracts/event-router";
import type {
  RuntimeFollowUp,
  RuntimeFollowUpOutcome,
  RuntimeInteractiveSignal,
} from "../contracts/runtime-result";
import type { RuntimeResult } from "../contracts/runtime-result";
import type { RuntimeState } from "../contracts/runtime-state";
import type { BuildingStatusById } from "../../domain/building-status";
import type { CharacterDefinition } from "../../domain/character";
import type { CityStatusById } from "../../domain/city-status";

export type RuntimeRouteInput = {
  state: RuntimeState;
  request: RuntimeRequest;
};

export type RuntimeRouteResult = RuntimeResult;
export type CanonicalRuntimeEventRouteResult = RuntimeEventRouteResult;

export type RuntimeInteractiveFollowUpInput = {
  state: RuntimeState;
  interactive: Exclude<NonNullable<RuntimeInteractiveSignal>, { type: "none" }>;
};

export type RuntimeFollowUpInput = {
  state: RuntimeState;
  followUp: Exclude<NonNullable<RuntimeFollowUp>, { type: "none" }>;
};

export type RuntimeOutcomeFollowUpInput = {
  state: RuntimeState;
  outcome: RuntimeFollowUpOutcome;
};

export type RuntimeFollowUpResult = {
  state: RuntimeState;
  characterDefinitions?: CharacterDefinition[];
};

export type RuntimeOutcomeFollowUpResult = {
  state: RuntimeState;
  characterDefinitions?: CharacterDefinition[];
  cityStatusById?: CityStatusById;
  buildingStatusById?: BuildingStatusById;
};

export type RuntimeFollowUpContext = {
  handleFollowUp?(input: RuntimeFollowUpInput): RuntimeFollowUpResult;
  handleInteractive?(input: RuntimeInteractiveFollowUpInput): RuntimeState;
  handleOutcome?(input: RuntimeOutcomeFollowUpInput): RuntimeOutcomeFollowUpResult;
};

export interface RuntimeRouter {
  route(input: RuntimeRouteInput): RuntimeRouteResult;
}
