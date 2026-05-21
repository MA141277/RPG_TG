"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPlayerCardPanelModel = createPlayerCardPanelModel;
function createPlayerCardPanelModel(playerCharacter, activeMission) {
    return {
        playerName: playerCharacter.name,
        activeMissionTitle: activeMission?.title ?? null,
        stats: playerCharacter.stats,
        ...(playerCharacter.title == null ? {} : { playerTitle: playerCharacter.title }),
    };
}
