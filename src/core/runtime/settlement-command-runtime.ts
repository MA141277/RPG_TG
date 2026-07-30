import { HOUSE_ACTIVITY_SEGMENTS_PER_DAY } from "../../application/house/house-activity-costs";
import { mutateCharacterNumericProperty } from "../../application/character/runtime-property-mutation";
import { advanceGameStateTimeSegments } from "../../application/time/time-progression";
import type {
  SettlementCommand,
  SettlementCommandRuntimeInput,
  SettlementCommandRuntimeResult,
} from "../contracts/settlement-command";

export function applySettlementCommands(
  input: SettlementCommandRuntimeInput
): SettlementCommandRuntimeResult {
  let nextState = input.state;
  let nextCharacterDefinitions = input.characterDefinitions;
  let nextCharacterStatusById = input.characterStatusById;
  const settledCommands: SettlementCommand[] = [];
  const unsupportedCommands: SettlementCommand[] = [];
  const warnings: string[] = [];

  for (const command of input.commands) {
    if (command.type === "flag.set") {
      nextState = {
        ...nextState,
        core: {
          ...nextState.core,
          runtime: {
            ...nextState.core.runtime,
            flags: {
              ...nextState.core.runtime.flags,
              [command.key]: command.value,
            },
          },
        },
      };
      settledCommands.push(command);
      continue;
    }

    if (command.type === "variable.set") {
      nextState = {
        ...nextState,
        core: {
          ...nextState.core,
          runtime: {
            ...nextState.core.runtime,
            variables: {
              ...nextState.core.runtime.variables,
              [command.key]: command.value,
            },
          },
        },
      };
      settledCommands.push(command);
      continue;
    }

    if (command.type === "player.money.change") {
      if (nextCharacterDefinitions == null) {
        unsupportedCommands.push(command);
        warnings.push(
          "unsupported-command:player.money.change:missing-character-definitions"
        );
        continue;
      }

      const playerCharacterId = nextState.core.player.characterId;
      if (typeof playerCharacterId !== "string" || playerCharacterId.length === 0) {
        unsupportedCommands.push(command);
        warnings.push(
          "unsupported-command:player.money.change:missing-player-character-id"
        );
        continue;
      }

      try {
        const mutation = mutateCharacterNumericProperty({
          state: nextState.core,
          characterDefinitions: nextCharacterDefinitions,
          characterId: playerCharacterId,
          propertyId: "stats.gold",
          operation: "add",
          value: command.amount,
          ...(nextCharacterStatusById == null
            ? {}
            : { characterStatusById: nextCharacterStatusById }),
        });
        nextState = {
          ...nextState,
          core: mutation.state,
        };
        nextCharacterDefinitions = mutation.characterDefinitions;
        nextCharacterStatusById = mutation.characterStatusById;
        settledCommands.push(command);
      } catch (error) {
        unsupportedCommands.push(command);
        warnings.push(
          `unsupported-command:player.money.change:${
            error instanceof Error ? error.message : "unknown-error"
          }`
        );
      }
      continue;
    }

    if (command.type === "time.advance") {
      const totalSegments =
        Math.max(0, Math.floor(command.days ?? 0)) *
          HOUSE_ACTIVITY_SEGMENTS_PER_DAY +
        Math.max(0, Math.floor(command.hours ?? 0));
      nextState = {
        ...nextState,
        core: advanceGameStateTimeSegments(nextState.core, totalSegments),
      };
      settledCommands.push(command);
      continue;
    }

    if (command.type === "character.numeric-property.mutate") {
      if (nextCharacterDefinitions == null) {
        unsupportedCommands.push(command);
        warnings.push(
          "unsupported-command:character.numeric-property.mutate:missing-character-definitions"
        );
        continue;
      }

      try {
        const mutation = mutateCharacterNumericProperty({
          state: nextState.core,
          characterDefinitions: nextCharacterDefinitions,
          characterId: command.characterId,
          propertyId: command.propertyId,
          operation: command.operation,
          value: command.value,
          ...(nextCharacterStatusById == null
            ? {}
            : { characterStatusById: nextCharacterStatusById }),
        });
        nextState = {
          ...nextState,
          core: mutation.state,
        };
        nextCharacterDefinitions = mutation.characterDefinitions;
        nextCharacterStatusById = mutation.characterStatusById;
        settledCommands.push(command);
      } catch (error) {
        unsupportedCommands.push(command);
        warnings.push(
          `unsupported-command:character.numeric-property.mutate:${
            error instanceof Error ? error.message : "unknown-error"
          }`
        );
      }
      continue;
    }
  }

  return {
    state: nextState,
    ...(nextCharacterDefinitions == null
      ? {}
      : { characterDefinitions: nextCharacterDefinitions }),
    ...(nextCharacterStatusById == null
      ? {}
      : { characterStatusById: nextCharacterStatusById }),
    settledCommands,
    unsupportedCommands,
    warnings,
  };
}
