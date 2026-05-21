"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInitialTeaHouseSessionState = createInitialTeaHouseSessionState;
function createInitialTeaHouseSessionState(guestNpcIds, selectedActorId, dialogueLines, dialoguePhase = "greeting") {
    return {
        guestNpcIds,
        selectedActorId,
        dialogueLines,
        dialoguePhase,
        overlay: null,
    };
}
