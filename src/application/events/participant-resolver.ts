import type { EventParticipant } from "../../domain/event";

export type ParticipantResolverContext = {
  isCharacterAvailable: (characterId: string) => boolean;
};

export function hasRequiredParticipants(
  participants: EventParticipant[] | undefined,
  context: ParticipantResolverContext
): boolean {
  if (participants == null || participants.length === 0) {
    return true;
  }

  return participants
    .filter((participant) => participant.required)
    .every((participant) => context.isCharacterAvailable(participant.characterId));
}
