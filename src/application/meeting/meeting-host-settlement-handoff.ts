import type {
  HouseModuleDispatchInput,
  HouseModuleId,
  HouseModuleTransitionResult,
  HouseModuleSessionState,
} from "../../domain/house-module";

type MatchHostedSettlementInput<ModuleId extends HouseModuleId, Payload> = {
  input: HouseModuleDispatchInput<ModuleId>;
  sessionState: HouseModuleSessionState<ModuleId>;
  hostedMeetingId: string;
  resolvePayload: (actionId: string) => Payload | null;
  settle: (payload: Payload) => HouseModuleTransitionResult<ModuleId>;
};

export function matchHostedMeetingSettlementHandoff<
  ModuleId extends HouseModuleId,
  Payload,
>(
  input: MatchHostedSettlementInput<ModuleId, Payload>
): HouseModuleTransitionResult<ModuleId> | null {
  if (
    input.sessionState == null ||
    input.input.request.type !== "action" ||
    input.input.sharedSessionState?.hostedMeeting?.meetingId !== input.hostedMeetingId
  ) {
    return null;
  }

  const payload = input.resolvePayload(input.input.request.actionId);
  if (payload == null) {
    return null;
  }

  return {
    ...input.settle(payload),
    sharedSessionState: null,
  };
}
