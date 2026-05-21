"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInitialState = createInitialState;
function createInitialState(input) {
    return {
        world: {
            currentMapId: input.currentMapId,
            currentCityId: input.currentCityId,
            currentHouseId: input.currentHouseId,
        },
        player: {
            characterId: input.playerCharacterId,
        },
        calendar: {
            chapterId: input.chapterId,
            year: input.year,
            month: input.month,
            day: input.day,
        },
        scene: {
            activeEventId: input.activeEventId ?? null,
            activeSceneId: input.activeSceneId ?? null,
            cursor: 0,
            status: input.activeSceneId == null ? "idle" : "playing",
        },
        ui: {
            visiblePanels: ["player-card", "main-mission", "notifications"],
            pinnedCharacterId: input.pinnedCharacterId,
            activeMissionId: null,
            reviewDateText: input.reviewDateText,
            mainHouseMissionText: input.mainHouseMissionText,
            overlayView: null,
            cardLibraryFilter: "all",
            valuableLibraryFilter: "all",
            valuableLibrarySortKey: "name",
            valuableLibrarySortDirection: "asc",
            houseSession: null,
            currentView: input.currentView ?? "map",
        },
        missions: {
            activeMissionId: null,
            completedMissionIds: [],
        },
        cards: input.cards,
        valuables: input.valuables,
        runtime: {
            flags: {},
            variables: {},
            cityNpcPools: {},
            eventHistory: {},
        },
    };
}
