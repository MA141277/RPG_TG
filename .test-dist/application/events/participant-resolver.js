"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasRequiredParticipants = hasRequiredParticipants;
function hasRequiredParticipants(participants, context) {
    if (participants == null || participants.length === 0) {
        return true;
    }
    return participants
        .filter((participant) => participant.required)
        .every((participant) => context.isCharacterAvailable(participant.characterId));
}
