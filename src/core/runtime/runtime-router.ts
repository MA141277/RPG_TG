import type { RuntimeRequest } from "../contracts/runtime-request";
import type {
  RuntimeFollowUp,
} from "../contracts/runtime-result";
import type { RuntimeResult } from "../contracts/runtime-result";
import type { RuntimeState } from "../contracts/runtime-state";
import type { CharacterDefinition } from "../../domain/character";

export type RuntimeRouteInput = {
  state: RuntimeState;
  request: RuntimeRequest;
};

export type RuntimeFollowUpInput = {
  state: RuntimeState;
  followUp: Exclude<NonNullable<RuntimeFollowUp>, { type: "none" }>;
};

export type RuntimeFollowUpResult = {
  state: RuntimeState;
  characterDefinitions?: CharacterDefinition[];
};

export type RuntimeFollowUpContext = {
  handleFollowUp?(input: RuntimeFollowUpInput): RuntimeFollowUpResult;
};

export type RuntimeRouteResult = RuntimeResult;

export interface RuntimeRouter {
  route(input: RuntimeRouteInput): RuntimeRouteResult;
}
