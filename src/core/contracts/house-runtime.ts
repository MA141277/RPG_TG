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

export type EnterHouseRuntimeRequest = {
  type: "enter";
  houseId: string;
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
  | LeaveHouseRuntimeRequest
  | DispatchHouseRuntimeRequest;
