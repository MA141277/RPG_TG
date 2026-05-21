"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTeaHouseBossActor = createTeaHouseBossActor;
exports.createTeaHouseGuestActors = createTeaHouseGuestActors;
const tea_house_content_1 = require("../../content/houses/tea-house-content");
const city_npc_pool_state_1 = require("../city-npcs/city-npc-pool-state");
const tea_house_1 = require("../../domain/tea-house");
function readNumericVariable(state, key, fallback) {
    const value = state.runtime.variables[key];
    return typeof value === "number" ? value : fallback;
}
function createTeaHouseBossActor(state, houseId) {
    return {
        id: tea_house_content_1.teaHouseBossProfile.actorId,
        name: tea_house_content_1.teaHouseBossProfile.name,
        title: tea_house_content_1.teaHouseBossProfile.title,
        personality: tea_house_content_1.teaHouseBossProfile.personality,
        specialty: tea_house_content_1.teaHouseBossProfile.specialty,
        favorability: readNumericVariable(state, (0, tea_house_1.getTeaHouseFixedNpcFavorabilityVariableKey)(houseId, tea_house_content_1.teaHouseBossProfile.actorId), tea_house_content_1.teaHouseBossProfile.favorability),
        dialoguePool: [...tea_house_content_1.teaHouseBossProfile.dialoguePool],
        intelPool: [...tea_house_content_1.teaHouseBossProfile.intelPool],
        isFixedHost: true,
    };
}
function createTeaHouseGuestActors(state, poolDefinitions, cityId, guestNpcIds) {
    return guestNpcIds
        .map((npcId) => {
        const residentDefinition = (0, city_npc_pool_state_1.getCityNpcDefinitionById)(poolDefinitions, cityId, npcId);
        if (residentDefinition == null) {
            return null;
        }
        return {
            id: residentDefinition.id,
            name: residentDefinition.name,
            title: residentDefinition.title,
            personality: residentDefinition.personality,
            specialty: residentDefinition.specialty,
            favorability: (0, city_npc_pool_state_1.readCityNpcFavorability)(state, cityId, residentDefinition.id, residentDefinition.favorability),
            dialoguePool: [...residentDefinition.dialoguePool],
            intelPool: [...residentDefinition.intelPool],
            isFixedHost: false,
        };
    })
        .filter((actor) => actor != null);
}
