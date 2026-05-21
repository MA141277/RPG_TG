"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInitialGrainShopSessionState = createInitialGrainShopSessionState;
function createInitialGrainShopSessionState(npcGreeting, npcDefaultLine) {
    return {
        npcGreeting,
        npcDefaultLine,
        dialoguePhase: "greeting",
        overlay: null,
    };
}
