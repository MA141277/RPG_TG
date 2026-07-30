import type { CharacterDefinition } from "../../../domain/character";
import {
  mergeCharacterStatusMaps,
  type CharacterStatusById,
} from "../../../domain/character-status";
import type { RuntimeState } from "../../../core/contracts/runtime-state";
import {
  getCityBeggingDefaultLocation,
  type CityBeggingDefaultEffect,
} from "../../../content/playables/city-begging-default-content";
import { mutatePlayerGrainDou } from "../../inventory/trade-inventory";
import { mutatePlayerStamina } from "../../player/player-stamina";
import type { CityBeggingDefaultDialogueState } from "./city-begging-default-dialogue";

export type CityBeggingDefaultSettlementInput = {
  state: RuntimeState;
  characterDefinitions: CharacterDefinition[];
  playerCharacterId?: string | undefined;
};

export type CityBeggingDefaultSettlementOutput = {
  state: RuntimeState;
  characterDefinitions: CharacterDefinition[];
  characterStatusById: CharacterStatusById;
};

const SHENG_PER_DOU = 10;

function setRuntimeVariable(
  state: RuntimeState,
  key: string,
  value: string | number | boolean
): RuntimeState {
  return {
    ...state,
    core: {
      ...state.core,
      runtime: {
        ...state.core.runtime,
        variables: {
          ...state.core.runtime.variables,
          [key]: value,
        } as typeof state.core.runtime.variables,
      },
    },
  };
}

function addRuntimeNumberVariable(
  state: RuntimeState,
  key: string,
  delta: number
): RuntimeState {
  const currentValue = state.core.runtime.variables[key];
  const currentNumber =
    typeof currentValue === "number" && Number.isFinite(currentValue)
      ? currentValue
      : 0;

  return setRuntimeVariable(state, key, currentNumber + delta);
}

function getSelectedOption(
  dialogueState: CityBeggingDefaultDialogueState
): { effects: readonly CityBeggingDefaultEffect[] } | null {
  if (
    dialogueState.selectedLocationId == null ||
    dialogueState.selectedOptionId == null
  ) {
    return null;
  }

  const location = getCityBeggingDefaultLocation(dialogueState.selectedLocationId);
  return (
    location?.options.find(
      (option) => option.optionId === dialogueState.selectedOptionId
    ) ?? null
  );
}

function applyEffect(input: {
  state: RuntimeState;
  characterDefinitions: CharacterDefinition[];
  characterStatusById: CharacterStatusById;
  playerCharacterId?: string | undefined;
  effect: CityBeggingDefaultEffect;
}): CityBeggingDefaultSettlementOutput {
  const { effect } = input;

  if (effect.type === "set_flag") {
    return {
      state: setRuntimeVariable(input.state, effect.flagId, effect.value),
      characterDefinitions: input.characterDefinitions,
      characterStatusById: input.characterStatusById,
    };
  }

  if (effect.type === "add_grain") {
    const nextCoreState = mutatePlayerGrainDou(
      input.state.core,
      effect.amountSheng / SHENG_PER_DOU
    );
    const nextState = {
      ...input.state,
      core: nextCoreState,
    };

    return {
      state:
        effect.quality == null
          ? nextState
          : setRuntimeVariable(
              nextState,
              `var.city_begging.grain_quality.${effect.grainKind}`,
              effect.quality
            ),
      characterDefinitions: input.characterDefinitions,
      characterStatusById: input.characterStatusById,
    };
  }

  if (effect.type === "injure" || effect.type === "restore_stamina") {
    if (input.playerCharacterId == null) {
      return {
        state: addRuntimeNumberVariable(
          input.state,
          `var.city_begging.stamina.${effect.type}`,
          effect.type === "injure" ? effect.staminaDelta : effect.amount
        ),
        characterDefinitions: input.characterDefinitions,
        characterStatusById: input.characterStatusById,
      };
    }

    const mutation = mutatePlayerStamina(
      input.state.core,
      input.characterDefinitions,
      input.playerCharacterId,
      effect.type === "injure" ? effect.staminaDelta : effect.amount
    );

    return {
      state: {
        ...input.state,
        core: mutation.state,
      },
      characterDefinitions: mutation.characterDefinitions,
      characterStatusById: mergeCharacterStatusMaps(
        input.characterStatusById,
        mutation.characterStatusById ?? {}
      ),
    };
  }

  if (effect.type === "restore_stamina_full") {
    if (input.playerCharacterId == null) {
      return {
        state: setRuntimeVariable(
          input.state,
          "var.city_begging.stamina.restore_full_requested",
          true
        ),
        characterDefinitions: input.characterDefinitions,
        characterStatusById: input.characterStatusById,
      };
    }

    const playerCharacter = input.characterDefinitions.find(
      (characterDefinition) =>
        characterDefinition.id === input.playerCharacterId
    );
    if (playerCharacter == null) {
      return {
        state: input.state,
        characterDefinitions: input.characterDefinitions,
        characterStatusById: input.characterStatusById,
      };
    }

    const mutation = mutatePlayerStamina(
      input.state.core,
      input.characterDefinitions,
      input.playerCharacterId,
      100 - playerCharacter.stamina
    );

    return {
      state: {
        ...input.state,
        core: mutation.state,
      },
      characterDefinitions: mutation.characterDefinitions,
      characterStatusById: mergeCharacterStatusMaps(
        input.characterStatusById,
        mutation.characterStatusById ?? {}
      ),
    };
  }

  if (effect.type === "add_item") {
    return {
      state: addRuntimeNumberVariable(
        input.state,
        `var.city_begging.inventory.item.${effect.itemId}`,
        effect.quantity
      ),
      characterDefinitions: input.characterDefinitions,
      characterStatusById: input.characterStatusById,
    };
  }

  if (effect.type === "add_bond") {
    return {
      state: addRuntimeNumberVariable(
        input.state,
        `var.city_begging.bond.${effect.bondId}`,
        effect.delta
      ),
      characterDefinitions: input.characterDefinitions,
      characterStatusById: input.characterStatusById,
    };
  }

  if (effect.type === "mod_attr") {
    return {
      state: addRuntimeNumberVariable(
        input.state,
        `var.city_begging.attr.${effect.attrId}`,
        effect.delta
      ),
      characterDefinitions: input.characterDefinitions,
      characterStatusById: input.characterStatusById,
    };
  }

  if (effect.type === "mod_weight") {
    return {
      state: addRuntimeNumberVariable(
        input.state,
        `var.city_begging.weight.${effect.key}.${effect.result}`,
        effect.delta
      ),
      characterDefinitions: input.characterDefinitions,
      characterStatusById: input.characterStatusById,
    };
  }

  return {
    state: setRuntimeVariable(
      input.state,
      `var.city_begging.effect.${effect.type}.${effect.key}`,
      true
    ),
    characterDefinitions: input.characterDefinitions,
    characterStatusById: input.characterStatusById,
  };
}

export function applyCityBeggingDefaultSettlement(
  input: CityBeggingDefaultSettlementInput
): CityBeggingDefaultSettlementOutput {
  const dialogueState = input.state.app.beggingMiniGameState;
  if (
    dialogueState == null ||
    !("mode" in dialogueState) ||
    dialogueState.mode !== "default-dialogue" ||
    dialogueState.phase !== "outcome" ||
    dialogueState.settlementApplied
  ) {
    return {
      state: input.state,
      characterDefinitions: input.characterDefinitions,
      characterStatusById: {},
    };
  }

  const selectedOption = getSelectedOption(dialogueState);
  if (selectedOption == null) {
    return {
      state: input.state,
      characterDefinitions: input.characterDefinitions,
      characterStatusById: {},
    };
  }

  const settled = selectedOption.effects.reduce(
    (next, effect) =>
      applyEffect({
        ...next,
        playerCharacterId: input.playerCharacterId,
        effect,
      }),
    {
      state: input.state,
      characterDefinitions: input.characterDefinitions,
      characterStatusById: {},
    } satisfies CityBeggingDefaultSettlementOutput
  );

  return {
    ...settled,
    state: {
      ...settled.state,
      app: {
        ...settled.state.app,
        beggingMiniGameState: {
          ...dialogueState,
          phase: "completed",
          settlementApplied: true,
        },
      },
    },
  };
}
