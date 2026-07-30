import type { CharacterDefinition, CharacterId } from "../../domain/character";
import type {
  FactionAffiliationState,
} from "../../domain/faction-affiliation";
import type { GameState } from "../../domain/game-state";

export type JoinFactionInput = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  characterId: CharacterId;
  factionId: string;
  factionName: string;
  joinedBy: string;
  sourceEventId?: string | undefined;
  syncCharacterLabel?: boolean;
};

export type LeaveFactionInput = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  characterId: CharacterId;
  leftBy: string;
  syncCharacterLabel?: boolean;
};

export type FactionAffiliationRuntimeResult = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
};

function syncCharacterAffiliationLabel(input: {
  characterDefinitions: CharacterDefinition[];
  characterId: CharacterId;
  affiliationLabel: string | null;
}): CharacterDefinition[] {
  return input.characterDefinitions.map((characterDefinition) => {
    if (characterDefinition.id !== input.characterId) {
      return characterDefinition;
    }

    if (input.affiliationLabel == null) {
      if (characterDefinition.affiliationLabel === undefined) {
        return characterDefinition;
      }

      const nextCharacterDefinition = {
        ...characterDefinition,
      };
      delete nextCharacterDefinition.affiliationLabel;
      return nextCharacterDefinition;
    }

    return {
      ...characterDefinition,
      affiliationLabel: input.affiliationLabel,
    };
  });
}

export class FactionAffiliationRuntime {
  readActiveFaction(
    state: GameState,
    characterId: CharacterId
  ): FactionAffiliationState | null {
    const record = state.runtime.factionAffiliations[characterId];
    return record?.status === "active" ? record : null;
  }

  joinFaction(input: JoinFactionInput): FactionAffiliationRuntimeResult {
    const joinedOn = {
      year: input.state.calendar.year,
      month: input.state.calendar.month,
      day: input.state.calendar.day,
    };
    const nextAffiliation: FactionAffiliationState = {
      factionId: input.factionId,
      factionName: input.factionName,
      status: "active",
      joinedBy: input.joinedBy,
      joinedOn,
      ...(input.sourceEventId == null
        ? {}
        : { sourceEventId: input.sourceEventId }),
    };

    return {
      state: {
        ...input.state,
        runtime: {
          ...input.state.runtime,
          factionAffiliations: {
            ...input.state.runtime.factionAffiliations,
            [input.characterId]: nextAffiliation,
          },
        },
      },
      characterDefinitions:
        input.syncCharacterLabel === false
          ? input.characterDefinitions
          : syncCharacterAffiliationLabel({
              characterDefinitions: input.characterDefinitions,
              characterId: input.characterId,
              affiliationLabel: input.factionName,
            }),
    };
  }

  leaveFaction(input: LeaveFactionInput): FactionAffiliationRuntimeResult {
    void input.leftBy;

    const currentRecord = input.state.runtime.factionAffiliations[input.characterId];
    if (currentRecord == null) {
      return {
        state: input.state,
        characterDefinitions:
          input.syncCharacterLabel === false
            ? input.characterDefinitions
            : syncCharacterAffiliationLabel({
                characterDefinitions: input.characterDefinitions,
                characterId: input.characterId,
                affiliationLabel: null,
              }),
      };
    }

    return {
      state: {
        ...input.state,
        runtime: {
          ...input.state.runtime,
          factionAffiliations: {
            ...input.state.runtime.factionAffiliations,
            [input.characterId]: {
              ...currentRecord,
              status: "left",
            },
          },
        },
      },
      characterDefinitions:
        input.syncCharacterLabel === false
          ? input.characterDefinitions
          : syncCharacterAffiliationLabel({
              characterDefinitions: input.characterDefinitions,
              characterId: input.characterId,
              affiliationLabel: null,
            }),
    };
  }

  resolveCharacterFactionLabel(input: {
    state: GameState;
    character: CharacterDefinition;
  }): string | null {
    return (
      this.readActiveFaction(input.state, input.character.id)?.factionName ??
      input.character.affiliationLabel ??
      input.character.clanId ??
      null
    );
  }
}

export const factionAffiliationRuntime = new FactionAffiliationRuntime();

export function readActiveFaction(
  state: GameState,
  characterId: CharacterId
): FactionAffiliationState | null {
  return factionAffiliationRuntime.readActiveFaction(state, characterId);
}

export function resolveCharacterFactionLabel(input: {
  state: GameState;
  character: CharacterDefinition;
}): string | null {
  return factionAffiliationRuntime.resolveCharacterFactionLabel(input);
}
