import type { CharacterDefinition } from "../../domain/character";
import type { GameState } from "../../domain/game-state";
import type {
  HouseSharedMeetingSessionState,
  HouseSharedSessionState,
} from "../../domain/house-module";
import type { MeetingActionSetDefinition } from "../../domain/meeting/meeting-action-set";
import type {
  MeetingBindingDefinition,
  MeetingBindingTriggerDefinition,
} from "../../domain/meeting/meeting-binding";
import type { MeetingChoiceSetDefinition } from "../../domain/meeting/meeting-choice-set";
import type { MeetingDefinition } from "../../domain/meeting/meeting-definition";
import type { MeetingPanelDefinition } from "../../domain/meeting/meeting-panel";
import type {
  MeetingHostContext,
  MeetingReturnTargetDefinition,
  MeetingRuntimeCompletion,
} from "../../domain/meeting/meeting-session";
import {
  advanceMeetingSession,
  startMeetingSession,
  type MeetingAdvanceRequest,
} from "./meeting-runtime";
import {
  createMeetingPresenterModel,
  type MeetingPresenterModel,
} from "./meeting-presenter";

type MeetingBridgeContentInput = {
  meetingsById: Record<string, MeetingDefinition>;
  meetingBindings: MeetingBindingDefinition[];
  meetingPanelsById?: Record<string, MeetingPanelDefinition> | undefined;
  meetingChoiceSetsById?: Record<string, MeetingChoiceSetDefinition> | undefined;
  meetingActionSetsById?: Record<string, MeetingActionSetDefinition> | undefined;
};

type MeetingBridgeBaseInput<HostSessionState> = MeetingBridgeContentInput & {
  hostContext: MeetingHostContext;
  hostSessionState: HostSessionState;
  sharedSessionState: HouseSharedSessionState | null;
  gameState: GameState;
  characterDefinitions: CharacterDefinition[];
};

export type LaunchMeetingFromHostActionInput<HostSessionState> =
  MeetingBridgeBaseInput<HostSessionState> & {
    trigger: MeetingBindingTriggerDefinition;
    initialDerivedState?: Record<string, unknown> | undefined;
  };

export type ResumeMeetingFromHostSessionInput<HostSessionState> =
  MeetingBridgeBaseInput<HostSessionState> & {
    request?: MeetingAdvanceRequest | undefined;
  };

export type MeetingHostBridgeResult<HostSessionState> = {
  handled: boolean;
  hostSessionState: HostSessionState;
  sharedSessionState: HouseSharedSessionState | null;
  gameState: GameState;
  characterDefinitions: CharacterDefinition[];
  presenterModel: MeetingPresenterModel | null;
  completion?: MeetingRuntimeCompletion | undefined;
  returnTarget?: MeetingReturnTargetDefinition | undefined;
  diagnostics?: string[] | undefined;
};

function createMeetingSharedSessionState(
  binding: MeetingBindingDefinition,
  meetingId: string,
  sessionState: HouseSharedMeetingSessionState["sessionState"]
): HouseSharedSessionState {
  return {
    hostedMeeting: {
      kind: "meeting",
      bindingId: binding.id,
      meetingId,
      sessionState,
    },
  };
}

function readHostedMeeting(
  sharedSessionState: HouseSharedSessionState | null
): HouseSharedMeetingSessionState | null {
  return sharedSessionState?.hostedMeeting ?? null;
}

function matchBindingTrigger(
  bindingTrigger: MeetingBindingTriggerDefinition,
  trigger: MeetingBindingTriggerDefinition
): boolean {
  if (bindingTrigger.action !== trigger.action) {
    return false;
  }
  if (bindingTrigger.itemId != null && bindingTrigger.itemId !== trigger.itemId) {
    return false;
  }
  if (bindingTrigger.targetId != null && bindingTrigger.targetId !== trigger.targetId) {
    return false;
  }
  if (bindingTrigger.view != null && bindingTrigger.view !== trigger.view) {
    return false;
  }

  return true;
}

function findMatchingMeetingBinding(
  input: Pick<
    LaunchMeetingFromHostActionInput<unknown>,
    "hostContext" | "meetingBindings" | "trigger"
  >
): MeetingBindingDefinition | null {
  return (
    input.meetingBindings.find(
      (binding) =>
        binding.owner.family === input.hostContext.hostFamily &&
        binding.owner.id === input.hostContext.hostId &&
        matchBindingTrigger(binding.trigger, input.trigger)
    ) ?? null
  );
}

function createPresenterModel(input: {
  meetingDefinition: MeetingDefinition;
  hostedMeeting: HouseSharedMeetingSessionState;
  gameState: GameState;
  meetingPanelsById?: Record<string, MeetingPanelDefinition> | undefined;
  meetingChoiceSetsById?: Record<string, MeetingChoiceSetDefinition> | undefined;
}): MeetingPresenterModel | null {
  return createMeetingPresenterModel({
    meetingDefinition: input.meetingDefinition,
    sessionState: input.hostedMeeting.sessionState,
    gameState: input.gameState,
    meetingPanelsById: input.meetingPanelsById,
    meetingChoiceSetsById: input.meetingChoiceSetsById,
  });
}

export function launchMeetingFromHostAction<HostSessionState>(
  input: LaunchMeetingFromHostActionInput<HostSessionState>
): MeetingHostBridgeResult<HostSessionState> {
  if (readHostedMeeting(input.sharedSessionState) != null) {
    return {
      handled: false,
      hostSessionState: input.hostSessionState,
      sharedSessionState: input.sharedSessionState,
      gameState: input.gameState,
      characterDefinitions: input.characterDefinitions,
      presenterModel: null,
      diagnostics: [
        "Cannot launch a host meeting while another hosted meeting is active.",
      ],
    };
  }

  const binding = findMatchingMeetingBinding(input);
  if (binding == null) {
    return {
      handled: false,
      hostSessionState: input.hostSessionState,
      sharedSessionState: input.sharedSessionState,
      gameState: input.gameState,
      characterDefinitions: input.characterDefinitions,
      presenterModel: null,
    };
  }

  const meetingDefinition = input.meetingsById[binding.meetingId];
  if (meetingDefinition == null) {
    return {
      handled: true,
      hostSessionState: input.hostSessionState,
      sharedSessionState: input.sharedSessionState,
      gameState: input.gameState,
      characterDefinitions: input.characterDefinitions,
      presenterModel: null,
      diagnostics: [
        `Unknown meeting definition for binding ${binding.id}: ${binding.meetingId}`,
      ],
    };
  }

  const result = startMeetingSession({
    meetingDefinition,
    hostContext: input.hostContext,
    gameState: input.gameState,
    characterDefinitions: input.characterDefinitions,
    ...(input.initialDerivedState == null
      ? {}
      : { initialDerivedState: input.initialDerivedState }),
    meetingPanelsById: input.meetingPanelsById,
    meetingChoiceSetsById: input.meetingChoiceSetsById,
    meetingActionSetsById: input.meetingActionSetsById,
  });
  const sharedSessionState =
    result.sessionState == null
      ? input.sharedSessionState
      : createMeetingSharedSessionState(
          binding,
          meetingDefinition.id,
          result.sessionState
        );

  return {
    handled: true,
    hostSessionState: input.hostSessionState,
    sharedSessionState,
    gameState: result.gameState,
    characterDefinitions: result.characterDefinitions,
    presenterModel: result.presenterModel,
    ...(result.completion == null ? {} : { completion: result.completion }),
    ...(result.diagnostics == null ? {} : { diagnostics: result.diagnostics }),
  };
}

export function resumeMeetingFromHostSession<HostSessionState>(
  input: ResumeMeetingFromHostSessionInput<HostSessionState>
): MeetingHostBridgeResult<HostSessionState> {
  const hostedMeeting = readHostedMeeting(input.sharedSessionState);
  if (hostedMeeting == null) {
    return {
      handled: false,
      hostSessionState: input.hostSessionState,
      sharedSessionState: input.sharedSessionState,
      gameState: input.gameState,
      characterDefinitions: input.characterDefinitions,
      presenterModel: null,
    };
  }

  const meetingDefinition = input.meetingsById[hostedMeeting.meetingId];
  if (meetingDefinition == null) {
    return {
      handled: true,
      hostSessionState: input.hostSessionState,
      sharedSessionState: input.sharedSessionState,
      gameState: input.gameState,
      characterDefinitions: input.characterDefinitions,
      presenterModel: null,
      diagnostics: [`Unknown hosted meeting id: ${hostedMeeting.meetingId}`],
    };
  }

  if (input.request == null) {
    return {
      handled: true,
      hostSessionState: input.hostSessionState,
      sharedSessionState: input.sharedSessionState,
      gameState: input.gameState,
      characterDefinitions: input.characterDefinitions,
      presenterModel: createPresenterModel({
        meetingDefinition,
        hostedMeeting,
        gameState: input.gameState,
        meetingPanelsById: input.meetingPanelsById,
        meetingChoiceSetsById: input.meetingChoiceSetsById,
      }),
    };
  }

  const result = advanceMeetingSession({
    meetingDefinition,
    sessionState: hostedMeeting.sessionState,
    request: input.request,
    gameState: input.gameState,
    characterDefinitions: input.characterDefinitions,
    meetingPanelsById: input.meetingPanelsById,
    meetingChoiceSetsById: input.meetingChoiceSetsById,
    meetingActionSetsById: input.meetingActionSetsById,
  });
  const sharedSessionState =
    result.sessionState == null
      ? null
      : createMeetingSharedSessionState(
          {
            id: hostedMeeting.bindingId,
            meetingId: hostedMeeting.meetingId,
            owner: {
              family: input.hostContext.hostFamily,
              id: input.hostContext.hostId,
            },
            trigger: {
              action: "building-container-item-action",
            },
          },
          hostedMeeting.meetingId,
          result.sessionState
        );

  return {
    handled: true,
    hostSessionState: input.hostSessionState,
    sharedSessionState,
    gameState: result.gameState,
    characterDefinitions: result.characterDefinitions,
    presenterModel: result.presenterModel,
    ...(result.completion == null ? {} : { completion: result.completion }),
    ...(result.diagnostics == null ? {} : { diagnostics: result.diagnostics }),
  };
}

export function completeMeetingToHost<HostSessionState>(
  input: MeetingHostBridgeResult<HostSessionState>
): MeetingHostBridgeResult<HostSessionState> {
  const hostedMeeting = readHostedMeeting(input.sharedSessionState);
  const completion = input.completion;
  if (
    hostedMeeting == null ||
    completion == null ||
    completion.type !== "return-to-host"
  ) {
    return input;
  }

  return {
    ...input,
    sharedSessionState: null,
    returnTarget: hostedMeeting.sessionState.hostContext.returnTarget,
  };
}
