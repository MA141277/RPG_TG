import type { CharacterDefinition } from "../../domain/character";
import type { CityEntryDefinition } from "../../domain/city-entry";
import type { GameState } from "../../domain/game-state";
import type { HouseDefinition } from "../../domain/house";
import { readZhuYuanzhangStoryStage } from "../../domain/zhu-yuanzhang-story";
import { assertExists } from "../../shared/assert";

function isStageAllowed(
  currentStage: string,
  allowedStages: string[] | undefined
): boolean {
  return allowedStages == null || allowedStages.length === 0
    ? true
    : allowedStages.includes(currentStage);
}

function getPlayerCharacter(
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string
): CharacterDefinition {
  const playerCharacter = characterDefinitions.find(
    (characterDefinition) => characterDefinition.id === playerCharacterId
  );
  assertExists(
    playerCharacter,
    `Player character not found for id "${playerCharacterId}" in story-stage access selector.`
  );
  return playerCharacter;
}

export function isHouseVisibleForStoryStage(
  gameState: GameState,
  characterDefinitions: CharacterDefinition[],
  houseDefinition: HouseDefinition
): boolean {
  const currentStage = readZhuYuanzhangStoryStage(gameState);
  if (!isStageAllowed(currentStage, houseDefinition.visibleStoryStages)) {
    return false;
  }

  if (!houseDefinition.requiresPlayerCurrentCityMatch) {
    return true;
  }

  const playerCharacter = getPlayerCharacter(
    characterDefinitions,
    gameState.player.characterId
  );
  return playerCharacter.cityId === gameState.world.currentCityId;
}

export function canEnterHouseForStoryStage(
  gameState: GameState,
  characterDefinitions: CharacterDefinition[],
  houseDefinition: HouseDefinition
): boolean {
  if (
    !isHouseVisibleForStoryStage(gameState, characterDefinitions, houseDefinition)
  ) {
    return false;
  }

  const currentStage = readZhuYuanzhangStoryStage(gameState);
  return isStageAllowed(currentStage, houseDefinition.enterableStoryStages);
}

export function isCityEntryVisibleForStoryStage(
  gameState: GameState,
  cityEntryDefinition: CityEntryDefinition
): boolean {
  return isStageAllowed(
    readZhuYuanzhangStoryStage(gameState),
    cityEntryDefinition.visibleStoryStages
  );
}
