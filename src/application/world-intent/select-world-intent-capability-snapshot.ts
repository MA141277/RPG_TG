import type {
  WorldCapabilitySnapshot,
  WorldLeaveCapability,
  WorldReachableHouseCapability,
  WorldServiceActionCapability,
  WorldStoryNegotiationCapability,
  WorldTalkTargetCapability,
} from "../../domain/world-intent";

type WorldCapabilityCandidate<T> = T & {
  available?: boolean;
};

export type SelectWorldIntentCapabilitySnapshotInput = {
  cityId: string;
  currentHouseId: string | null;
  currentHouseModuleId?: string | null;
  storyStage?: string | null;
  houses: Array<WorldCapabilityCandidate<WorldReachableHouseCapability>>;
  talkTargets: Array<WorldCapabilityCandidate<WorldTalkTargetCapability>>;
  serviceActions: Array<WorldCapabilityCandidate<WorldServiceActionCapability>>;
  negotiableStoryNodes: Array<
    WorldCapabilityCandidate<WorldStoryNegotiationCapability>
  >;
  leaveAction?: WorldCapabilityCandidate<WorldLeaveCapability> | null;
};

function isAvailable(value: { available?: boolean }): boolean {
  return value.available !== false;
}

function stripAvailability<T extends { available?: boolean }>(
  value: T
): Omit<T, "available"> {
  const { available: _available, ...rest } = value;
  return rest;
}

export function selectWorldIntentCapabilitySnapshot(
  input: SelectWorldIntentCapabilitySnapshotInput
): WorldCapabilitySnapshot {
  return {
    cityId: input.cityId,
    currentHouseId: input.currentHouseId,
    ...(input.currentHouseModuleId == null
      ? {}
      : { currentHouseModuleId: input.currentHouseModuleId }),
    ...(input.storyStage == null ? {} : { storyStage: input.storyStage }),
    reachableHouses: input.houses
      .filter(isAvailable)
      .map((house) => stripAvailability(house)),
    talkTargets: input.talkTargets
      .filter(isAvailable)
      .map((target) => stripAvailability(target)),
    serviceActions: input.serviceActions
      .filter(isAvailable)
      .map((action) => stripAvailability(action)),
    negotiableStoryNodes: input.negotiableStoryNodes
      .filter(isAvailable)
      .map((node) => stripAvailability(node)),
    ...(input.leaveAction == null || !isAvailable(input.leaveAction)
      ? { leaveAction: null }
      : { leaveAction: stripAvailability(input.leaveAction) }),
  };
}
