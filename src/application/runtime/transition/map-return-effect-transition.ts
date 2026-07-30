import type { CharacterDefinition } from "../../../domain/character";
import type { GameState } from "../../../domain/game-state";
import { applyEffects } from "../../effects/effect-applier";

type PendingMapReturnEffect = NonNullable<
  GameState["runtime"]["pendingMapReturnEffects"]
>[number];

export type MapReturnEffectTransitionResult = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  nextDelayMs: number | null;
};

export function processMapReturnEffects(input: {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  nowMs: number;
}): MapReturnEffectTransitionResult {
  const pendingEffects = input.state.runtime.pendingMapReturnEffects ?? [];
  if (pendingEffects.length === 0 || input.state.ui.currentView !== "map") {
    return {
      state: input.state,
      characterDefinitions: input.characterDefinitions,
      nextDelayMs: null,
    };
  }

  let didScheduleEffect = false;
  const scheduledEffects = pendingEffects.map((entry) => {
    if (entry.scheduledAtMs != null && entry.readyAtMs != null) {
      return entry;
    }

    didScheduleEffect = true;
    return scheduleMapReturnEffect(entry, input.nowMs);
  });
  const readyEffects = scheduledEffects.filter(
    (entry) => entry.readyAtMs != null && entry.readyAtMs <= input.nowMs
  );
  const waitingEffects = scheduledEffects.filter(
    (entry) => entry.readyAtMs == null || entry.readyAtMs > input.nowMs
  );

  if (!didScheduleEffect && readyEffects.length === 0) {
    return {
      state: input.state,
      characterDefinitions: input.characterDefinitions,
      nextDelayMs: getNextMapReturnEffectDelay(input.state, input.nowMs),
    };
  }

  let nextState: GameState = {
    ...input.state,
    runtime: {
      ...input.state.runtime,
      pendingMapReturnEffects: waitingEffects,
    },
  };
  let nextCharacterDefinitions = input.characterDefinitions;

  for (const entry of readyEffects) {
    const result = applyEffects(nextState, entry.effects, {
      characterDefinitions: nextCharacterDefinitions,
    });
    nextState = result.state;
    nextCharacterDefinitions = result.characterDefinitions;
  }

  return {
    state: nextState,
    characterDefinitions: nextCharacterDefinitions,
    nextDelayMs: getNextMapReturnEffectDelay(nextState, input.nowMs),
  };
}

function scheduleMapReturnEffect(
  entry: PendingMapReturnEffect,
  nowMs: number
): PendingMapReturnEffect {
  return {
    ...entry,
    scheduledAtMs: nowMs,
    readyAtMs: nowMs + Math.max(0, entry.delayMs),
  };
}

function getNextMapReturnEffectDelay(
  state: GameState,
  nowMs: number
): number | null {
  const readyAtValues = (state.runtime.pendingMapReturnEffects ?? [])
    .map((entry) => entry.readyAtMs)
    .filter((readyAtMs): readyAtMs is number => readyAtMs != null);
  if (readyAtValues.length === 0) {
    return null;
  }

  return Math.max(0, Math.min(...readyAtValues) - nowMs);
}
