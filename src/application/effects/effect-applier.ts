import type { Effect } from "../../domain/action";
import type {
  CharacterDefinition,
  CharacterStatKey,
} from "../../domain/character";
import type { GameState } from "../../domain/game-state";

export type EffectApplicationContext = {
  characterDefinitions: CharacterDefinition[];
};

export type EffectApplicationResult = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
};

export function applyEffects(
  state: GameState,
  effects: Effect[],
  context: EffectApplicationContext
): EffectApplicationResult {
  let nextState = state;
  let nextCharacterDefinitions = context.characterDefinitions;

  for (const effect of effects) {
    switch (effect.type) {
      case "set-flag":
        nextState = {
          ...nextState,
          runtime: {
            ...nextState.runtime,
            flags: {
              ...nextState.runtime.flags,
              [effect.key]: effect.value,
            },
          },
        };
        break;
      case "set-variable":
        nextState = {
          ...nextState,
          runtime: {
            ...nextState.runtime,
            variables: {
              ...nextState.runtime.variables,
              [effect.key]: effect.value,
            },
          },
        };
        break;
      case "change-variable": {
        const currentValue = nextState.runtime.variables[effect.key];
        const numericValue = typeof currentValue === "number" ? currentValue : 0;

        nextState = {
          ...nextState,
          runtime: {
            ...nextState.runtime,
            variables: {
              ...nextState.runtime.variables,
              [effect.key]: numericValue + effect.delta,
            },
          },
        };
        break;
      }
      case "patch-character":
        nextCharacterDefinitions = nextCharacterDefinitions.map((characterDefinition) => {
          if (characterDefinition.id !== effect.characterId) {
            return characterDefinition;
          }

          const nextCharacter: CharacterDefinition = {
            ...characterDefinition,
          };

          if (effect.changes.title !== undefined) {
            if (effect.changes.title === null) {
              delete nextCharacter.title;
            } else {
              nextCharacter.title = effect.changes.title;
            }
          }

          if (effect.changes.occupation !== undefined) {
            if (effect.changes.occupation === null) {
              delete nextCharacter.occupation;
            } else {
              nextCharacter.occupation = effect.changes.occupation;
            }
          }

          if (effect.changes.biography !== undefined) {
            if (effect.changes.biography === null) {
              delete nextCharacter.biography;
            } else {
              nextCharacter.biography = effect.changes.biography;
            }
          }

          if (effect.changes.houseId !== undefined) {
            if (effect.changes.houseId === null) {
              delete nextCharacter.houseId;
            } else {
              nextCharacter.houseId = effect.changes.houseId;
            }
          }

          if (effect.changes.clanId !== undefined) {
            if (effect.changes.clanId === null) {
              delete nextCharacter.clanId;
            } else {
              nextCharacter.clanId = effect.changes.clanId;
            }
          }

          if (effect.changes.affiliationLabel !== undefined) {
            if (effect.changes.affiliationLabel === null) {
              delete nextCharacter.affiliationLabel;
            } else {
              nextCharacter.affiliationLabel = effect.changes.affiliationLabel;
            }
          }

          return nextCharacter;
        });
        break;
      case "modify-character-stat":
        nextCharacterDefinitions = nextCharacterDefinitions.map((characterDefinition) => {
          if (characterDefinition.id !== effect.characterId) {
            return characterDefinition;
          }

          const statKey = effect.stat as CharacterStatKey;

          return {
            ...characterDefinition,
            stats: {
              ...characterDefinition.stats,
              [statKey]: characterDefinition.stats[statKey] + effect.delta,
            },
          };
        });
        break;
      case "start-mission":
        nextState = {
          ...nextState,
          missions: {
            ...nextState.missions,
            activeMissionId: effect.missionId,
          },
        };
        break;
      case "finish-mission":
        nextState = {
          ...nextState,
          missions: {
            ...nextState.missions,
            activeMissionId:
              nextState.missions.activeMissionId === effect.missionId
                ? null
                : nextState.missions.activeMissionId,
            completedMissionIds: nextState.missions.completedMissionIds.includes(
              effect.missionId
            )
              ? nextState.missions.completedMissionIds
              : [...nextState.missions.completedMissionIds, effect.missionId],
          },
        };
        break;
      default:
        break;
    }
  }

  return {
    state: nextState,
    characterDefinitions: nextCharacterDefinitions,
  };
}
