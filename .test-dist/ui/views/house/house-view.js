"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHouseViewModel = createHouseViewModel;
function createHouseViewModel(houseDefinition, characterDefinitions, cityNpcSummaries = []) {
    const fixedCharacterSummaries = characterDefinitions
        .filter((characterDefinition) => houseDefinition.characterIds.includes(characterDefinition.id))
        .map((characterDefinition) => ({
        id: characterDefinition.id,
        name: characterDefinition.name,
        ...(characterDefinition.title == null
            ? {}
            : { title: characterDefinition.title }),
    }));
    return {
        title: houseDefinition.name,
        defaultCharacterId: houseDefinition.defaultCharacterId,
        characterSummaries: [...fixedCharacterSummaries, ...cityNpcSummaries],
        backButtonLabel: houseDefinition.backAction.label,
    };
}
