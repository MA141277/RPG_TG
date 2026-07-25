import type { Effect } from "../contracts/effect";
import type {
  EffectSettlementInput,
  EffectSettlementResult,
} from "../contracts/effect-settlement";
import type { RuntimeState } from "../contracts/runtime-state";
import { HOUSE_ACTIVITY_SEGMENTS_PER_DAY } from "../../application/house/house-activity-costs";
import { mutateCharacterNumericProperty } from "../../application/character/runtime-property-mutation";
import { advanceGameStateTimeSegments } from "../../application/time/time-progression";

export type ExportedSettlementContent = {
  targetFamily: "person" | "city" | "building";
  targetId: string;
  attributeKey: string;
  attributeType: "number" | "boolean" | "enum";
  operation: "add" | "subtract" | "set";
  value: string | number | boolean;
};

export type ExportedSettlement = {
  contents?: readonly ExportedSettlementContent[];
};

type SettlementTargetRecord = Record<string, unknown>;
type SettlementTargetCollection = Record<string, SettlementTargetRecord | undefined>;

export type SettlementRuntimeTargetState = {
  people?: SettlementTargetCollection;
  cities?: SettlementTargetCollection;
  buildings?: SettlementTargetCollection;
};

export type SettlementRuntimeContext = SettlementRuntimeTargetState;

const SETTLEMENT_TARGET_COLLECTION_BY_FAMILY = {
  person: "people",
  city: "cities",
  building: "buildings",
} as const satisfies Record<
  ExportedSettlementContent["targetFamily"],
  keyof SettlementRuntimeTargetState
>;

export function applyEffects(
  state: RuntimeState,
  effects: Effect[]
): RuntimeState {
  return settleRuntimeEffects({
    state,
    effects,
    emittedBy: "runtime-router",
    appliedBy: "runtime-settlement",
  }).state;
}

export function applySettlementContents<TState extends SettlementRuntimeTargetState>(
  gameState: TState,
  settlement: ExportedSettlement,
  context: SettlementRuntimeContext = {}
): TState {
  let nextState: SettlementRuntimeTargetState = gameState;

  for (const content of settlement.contents ?? []) {
    nextState = applySettlementContent(nextState, content, context);
  }

  return nextState as TState;
}

function applySettlementContent(
  state: SettlementRuntimeTargetState,
  content: ExportedSettlementContent,
  context: SettlementRuntimeContext
): SettlementRuntimeTargetState {
  if (
    (content.attributeType === "boolean" || content.attributeType === "enum") &&
    content.operation !== "set"
  ) {
    return state;
  }
  if (content.attributeType === "number" && content.operation === "add") {
    return applyNumericDelta(state, content, context, Number(content.value));
  }
  if (content.attributeType === "number" && content.operation === "subtract") {
    return applyNumericDelta(state, content, context, -Number(content.value));
  }
  return applyTypedSet(state, content, context);
}

function applyNumericDelta(
  state: SettlementRuntimeTargetState,
  content: ExportedSettlementContent,
  context: SettlementRuntimeContext,
  delta: number
): SettlementRuntimeTargetState {
  if (!Number.isFinite(delta)) {
    return state;
  }

  const currentValue = readSettlementTargetValue(state, content, context);
  if (typeof currentValue !== "number" || !Number.isFinite(currentValue)) {
    return state;
  }

  return patchSettlementTargetValue(state, content, context, currentValue + delta);
}

function applyTypedSet(
  state: SettlementRuntimeTargetState,
  content: ExportedSettlementContent,
  context: SettlementRuntimeContext
): SettlementRuntimeTargetState {
  if (content.attributeType === "number") {
    const numericValue = Number(content.value);
    return Number.isFinite(numericValue)
      ? patchSettlementTargetValue(state, content, context, numericValue)
      : state;
  }
  if (content.attributeType === "boolean") {
    return typeof content.value === "boolean"
      ? patchSettlementTargetValue(state, content, context, content.value)
      : state;
  }
  if (content.attributeType === "enum") {
    return typeof content.value === "string"
      ? patchSettlementTargetValue(state, content, context, content.value)
      : state;
  }
  return state;
}

function readSettlementTargetValue(
  state: SettlementRuntimeTargetState,
  content: ExportedSettlementContent,
  context: SettlementRuntimeContext
): unknown {
  const target = readSettlementTarget(state, content, context);
  if (target == null) {
    return undefined;
  }

  const pathValue = readRecordPath(target, content.attributeKey);
  return pathValue;
}

function patchSettlementTargetValue(
  state: SettlementRuntimeTargetState,
  content: ExportedSettlementContent,
  context: SettlementRuntimeContext,
  value: string | number | boolean
): SettlementRuntimeTargetState {
  const collectionKey =
    SETTLEMENT_TARGET_COLLECTION_BY_FAMILY[content.targetFamily];
  const collection = state[collectionKey] ?? context[collectionKey];
  const target = collection?.[content.targetId];
  if (collection == null || target == null) {
    return state;
  }
  const nextTarget = patchRecordPath(target, content.attributeKey, value);

  return {
    ...state,
    [collectionKey]: {
      ...collection,
      [content.targetId]: nextTarget,
    },
  };
}

function readRecordPath(target: SettlementTargetRecord, attributeKey: string): unknown {
  const parts = attributeKey.split(".").filter((part) => part.length > 0);
  if (parts.length === 0) {
    return undefined;
  }

  let current: unknown = target;
  for (const part of parts) {
    if (current == null || typeof current !== "object" || Array.isArray(current)) {
      return undefined;
    }
    current = (current as SettlementTargetRecord)[part];
  }
  return current;
}

function hasRecordPath(target: SettlementTargetRecord, attributeKey: string): boolean {
  return readRecordPath(target, attributeKey) !== undefined;
}

function patchRecordPath(
  target: SettlementTargetRecord,
  attributeKey: string,
  value: string | number | boolean
): SettlementTargetRecord {
  const parts = attributeKey.split(".").filter((part) => part.length > 0);
  if (parts.length === 0) {
    return target;
  }
  return patchRecordPathParts(target, parts, value);
}

function patchRecordPathParts(
  target: SettlementTargetRecord,
  parts: string[],
  value: string | number | boolean
): SettlementTargetRecord {
  const [head, ...tail] = parts;
  if (head == null) {
    return target;
  }
  if (tail.length === 0) {
    return {
      ...target,
      [head]: value,
    };
  }

  const current = target[head];
  const currentRecord =
    current != null && typeof current === "object" && !Array.isArray(current)
      ? (current as SettlementTargetRecord)
      : {};
  return {
    ...target,
    [head]: patchRecordPathParts(currentRecord, tail, value),
  };
}

function hasOwn(target: SettlementTargetRecord, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(target, key);
}

function readSettlementTarget(
  state: SettlementRuntimeTargetState,
  content: ExportedSettlementContent,
  context: SettlementRuntimeContext
): SettlementTargetRecord | undefined {
  const collectionKey =
    SETTLEMENT_TARGET_COLLECTION_BY_FAMILY[content.targetFamily];
  return (state[collectionKey] ?? context[collectionKey])?.[content.targetId];
}

export function settleRuntimeEffects(
  input: EffectSettlementInput
): EffectSettlementResult {
  let nextState = input.state;
  let nextCharacterDefinitions = input.characterDefinitions;
  let nextCharacterStatusById = input.characterStatusById;
  const settledEffects: Effect[] = [];
  const unsupportedEffects: Effect[] = [];
  const warnings: string[] = [];

  if ((input.settlementInstances?.length ?? 0) > 0) {
    // Progression settlement instances now converge through the shared settlement seam.
  }

  for (const effect of input.effects) {
    if (effect.type === "setFlag") {
      nextState = {
        ...nextState,
        core: {
          ...nextState.core,
          runtime: {
            ...nextState.core.runtime,
            flags: {
              ...nextState.core.runtime.flags,
              [effect.key]: effect.value,
            },
          },
        },
      };
      settledEffects.push(effect);
      continue;
    }

    if (effect.type === "setVariable") {
      nextState = {
        ...nextState,
        core: {
          ...nextState.core,
          runtime: {
            ...nextState.core.runtime,
            variables: {
              ...nextState.core.runtime.variables,
              [effect.key]: effect.value,
            },
          },
        },
      };
      settledEffects.push(effect);
      continue;
    }

    if (effect.type === "advanceTime") {
      const totalSegments =
        Math.max(0, Math.floor(effect.days ?? 0)) *
          HOUSE_ACTIVITY_SEGMENTS_PER_DAY +
        Math.max(0, Math.floor(effect.hours ?? 0));
      nextState = {
        ...nextState,
        core: advanceGameStateTimeSegments(nextState.core, totalSegments),
      };
      settledEffects.push(effect);
      continue;
    }

    if (effect.type === "mutateCharacterNumericProperty") {
      if (nextCharacterDefinitions == null) {
        unsupportedEffects.push(effect);
        warnings.push(
          `unsupported-effect:${effect.type}:missing-character-definitions:emitted-by:${input.emittedBy}`
        );
        continue;
      }

      try {
        const mutation = mutateCharacterNumericProperty({
          state: nextState.core,
          characterDefinitions: nextCharacterDefinitions,
          characterId: effect.characterId,
          propertyId: effect.propertyId,
          operation: effect.operation,
          value: effect.value,
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
        settledEffects.push(effect);
      } catch (error) {
        unsupportedEffects.push(effect);
        warnings.push(
          `unsupported-effect:${effect.type}:${error instanceof Error ? error.message : "unknown-error"}:emitted-by:${input.emittedBy}`
        );
      }
      continue;
    }

    unsupportedEffects.push(effect);
    warnings.push(
      `unsupported-effect:${effect.type}:emitted-by:${input.emittedBy}`
    );
  }

  return {
    state: nextState,
    ...(nextCharacterDefinitions == null
      ? {}
      : { characterDefinitions: nextCharacterDefinitions }),
    ...(nextCharacterStatusById == null
      ? {}
      : { characterStatusById: nextCharacterStatusById }),
    settledEffects,
    unsupportedEffects,
    warnings,
  };
}
