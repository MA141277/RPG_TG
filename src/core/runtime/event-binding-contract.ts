import type { EventBindingTrigger, TriggerContext } from "../../domain/event";
import type { GameState } from "../../domain/game-state";

const SUPPORTED_EVENT_BINDING_OWNER_FAMILIES = new Set([
  "story",
  "city",
  "building",
]);

const SUPPORTED_EVENT_BINDING_TRIGGER_KEYS = new Set([
  "after:story-progress",
  "after:city-enter",
  "after:building-enter",
  "after:indoor-screen-shown",
  "after:building-container-item-action",
]);

export type RuntimeTriggerContextInput = {
  state: Pick<GameState, "world">;
  owner: TriggerContext["owner"];
  timing?: string;
  action: string;
  actorCharacterId?: string;
  payload?: Record<string, unknown>;
};

export function isSupportedEventBindingOwnerFamily(value: string): boolean {
  return SUPPORTED_EVENT_BINDING_OWNER_FAMILIES.has(value);
}

export function isSupportedEventBindingTrigger(
  trigger: Pick<EventBindingTrigger, "timing" | "action">
): boolean {
  return SUPPORTED_EVENT_BINDING_TRIGGER_KEYS.has(
    `${trigger.timing}:${trigger.action}`
  );
}

export function createRuntimeTriggerContext(
  input: RuntimeTriggerContextInput
): TriggerContext {
  return {
    owner: input.owner,
    timing: input.timing ?? "after",
    action: input.action,
    ...(input.actorCharacterId == null
      ? {}
      : { actorCharacterId: input.actorCharacterId }),
    ...(input.state.world.currentCityId == null
      ? {}
      : { currentCityId: input.state.world.currentCityId }),
    ...(input.state.world.currentHouseId == null
      ? {}
      : { currentHouseId: input.state.world.currentHouseId }),
    ...(input.payload == null ? {} : { payload: input.payload }),
  };
}
