import type { HouseDefinition } from "../../domain/house";

export type HouseRuntimeSessionRequest =
  | {
      type: "action";
      actionId: string;
    }
  | {
      type: "field";
      fieldId: string;
      value: string;
    }
  | {
      type: "tick";
      tickId: string;
    };

export type HouseRuntimeEntry = {
  source: "house-id" | "city-building-placement";
  houseId: string;
  houseDefinition: HouseDefinition;
  cityId?: string;
  placementId?: string;
  label?: string;
};

export type EnterHouseRuntimeRequest = {
  type: "enter";
  houseId: string;
};

export type EnterResolvedHouseRuntimeRequest = {
  type: "enter-resolved";
  entry: HouseRuntimeEntry;
};

export type LeaveHouseRuntimeRequest = {
  type: "leave";
};

export type DispatchHouseRuntimeRequest = {
  type: "dispatch";
  request: HouseRuntimeSessionRequest;
};

export type HouseRuntimeRequest =
  | EnterHouseRuntimeRequest
  | EnterResolvedHouseRuntimeRequest
  | LeaveHouseRuntimeRequest
  | DispatchHouseRuntimeRequest;
