import type { CharacterDefinition } from "../../domain/character";
import type { GameState } from "../../domain/game-state";
import type {
  HouseSharedMeetingSessionState,
  HouseSharedSessionState,
} from "../../domain/house-module";
import type { MeetingSessionState } from "../../domain/meeting/meeting-session";

export type HostedMeetingStageHandoffResult = {
  gameState: GameState;
  characterDefinitions: CharacterDefinition[];
  sharedSessionState: HouseSharedSessionState | null;
};

export function matchHostedMeetingStageHandoff(input: {
  sharedSessionState: HouseSharedSessionState | null;
  hostedMeetingId: string;
  currentStageId: string;
  actionId: string;
  expectedActionId?: string;
  matchesAction?: ((actionId: string) => boolean) | undefined;
  gameState: GameState;
  characterDefinitions: CharacterDefinition[];
  handoff: (sessionState: MeetingSessionState) => {
    gameState: GameState;
    characterDefinitions: CharacterDefinition[];
    sessionState: MeetingSessionState | null;
  };
}): HostedMeetingStageHandoffResult | null {
  const hostedMeeting = input.sharedSessionState?.hostedMeeting;
  if (
    hostedMeeting == null ||
    hostedMeeting.meetingId !== input.hostedMeetingId ||
    hostedMeeting.sessionState.currentStageId !== input.currentStageId ||
    !(
      input.matchesAction?.(input.actionId) ??
      (input.expectedActionId != null && input.actionId === input.expectedActionId)
    )
  ) {
    return null;
  }

  const handoffResult = input.handoff(hostedMeeting.sessionState);
  if (handoffResult.sessionState == null) {
    return {
      gameState: handoffResult.gameState,
      characterDefinitions: handoffResult.characterDefinitions,
      sharedSessionState: null,
    };
  }

  const nextHostedMeeting: HouseSharedMeetingSessionState = {
    ...hostedMeeting,
    sessionState: handoffResult.sessionState,
  };

  return {
    gameState: handoffResult.gameState,
    characterDefinitions: handoffResult.characterDefinitions,
    sharedSessionState: {
      hostedMeeting: nextHostedMeeting,
    },
  };
}
