import type { CharacterDefinition } from "../../domain/character";
import type { CityEntryDefinition } from "../../domain/city-entry";
import type { GameState } from "../../domain/game-state";
import type {
  HouseAccessRefusalRule,
  HouseDefinition,
} from "../../domain/house";
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

export type HouseEntryAccessResult =
  | { canEnter: true; refusal: null }
  | {
      canEnter: false;
      refusal: {
        ruleId: string;
        speakerCharacterId: string;
        title: string;
        text: string;
        confirmLabel: string;
      } | null;
    };

function hasAllFlags(state: GameState, flags: string[] | undefined): boolean {
  return flags == null || flags.every((flagKey) => state.runtime.flags[flagKey]);
}

function isMissingAllFlags(
  state: GameState,
  flags: string[] | undefined
): boolean {
  return flags == null || flags.every((flagKey) => !state.runtime.flags[flagKey]);
}

function isHouseRuleMatch(
  state: GameState,
  houseDefinition: HouseDefinition,
  rule: HouseAccessRefusalRule
): boolean {
  if (!isStageAllowed(readZhuYuanzhangStoryStage(state), rule.storyStages)) {
    return false;
  }

  if (!hasAllFlags(state, rule.requiredFlags)) {
    return false;
  }

  if (!isMissingAllFlags(state, rule.missingFlags)) {
    return false;
  }

  if (rule.excludedHouseIds?.includes(houseDefinition.id) === true) {
    return false;
  }

  if (
    houseDefinition.moduleId != null &&
    rule.excludedHouseModuleIds?.includes(houseDefinition.moduleId) === true
  ) {
    return false;
  }

  const matchesHouse =
    rule.houseIds == null || rule.houseIds.includes(houseDefinition.id);
  const matchesModule =
    rule.houseModuleIds == null ||
    (houseDefinition.moduleId != null &&
      rule.houseModuleIds.includes(houseDefinition.moduleId));

  return matchesHouse && matchesModule;
}

export function selectHouseEntryAccess(
  gameState: GameState,
  characterDefinitions: CharacterDefinition[],
  houseDefinition: HouseDefinition,
  rules: HouseAccessRefusalRule[]
): HouseEntryAccessResult {
  if (
    !canEnterHouseForStoryStage(
      gameState,
      characterDefinitions,
      houseDefinition
    )
  ) {
    return { canEnter: false, refusal: null };
  }

  const matchedRule =
    rules
      .filter((rule) => isHouseRuleMatch(gameState, houseDefinition, rule))
      .sort((left, right) => (right.priority ?? 0) - (left.priority ?? 0))[0] ??
    null;

  if (matchedRule == null) {
    return { canEnter: true, refusal: null };
  }

  return {
    canEnter: false,
    refusal: {
      ruleId: matchedRule.id,
      speakerCharacterId:
        matchedRule.speakerCharacterId === "player"
          ? gameState.player.characterId
          : matchedRule.speakerCharacterId,
      title: matchedRule.title,
      text: matchedRule.text,
      confirmLabel: matchedRule.confirmLabel,
    },
  };
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
