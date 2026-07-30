import type { CharacterDefinition } from "../../domain/character";
import type { CityDefinition } from "../../domain/city";
import type { EventDefinition } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import type { HouseDefinition } from "../../domain/house";
import {
  applySettlementDefinitionById,
  type ExportedSettlement,
} from "../../core/runtime/runtime-settlement";

export type StorySettlementDefinition = ExportedSettlement & {
  id: string;
  nextEventId?: string | undefined;
};

export type StorySettlementRuntimeContext = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  cityDefinitions?: CityDefinition[] | undefined;
  houseDefinitions?: HouseDefinition[] | undefined;
};

export type StorySettlementContent = {
  settlementDefinitionsById?:
    | Record<string, StorySettlementDefinition | undefined>
    | undefined;
};

export function applyStorySettlementEvent(
  runtime: StorySettlementRuntimeContext,
  content: StorySettlementContent,
  eventDefinition: EventDefinition,
  options: {
    settlementId?: string | null;
  } = {}
): StorySettlementRuntimeContext {
  if (eventDefinition.type !== "settlement") {
    return runtime;
  }

  const settlementId =
    typeof options.settlementId === "string" && options.settlementId.trim().length > 0
      ? options.settlementId.trim()
      : typeof eventDefinition.settlementId === "string"
        ? eventDefinition.settlementId.trim()
      : "";
  if (settlementId.length === 0) {
    return runtime;
  }

  const people = Object.fromEntries(
    runtime.characterDefinitions.map((character) => [
      character.id,
      character as unknown as Record<string, unknown>,
    ])
  );
  const cities =
    runtime.cityDefinitions == null
      ? undefined
      : Object.fromEntries(
          runtime.cityDefinitions.map((city) => [
            city.id,
            city as unknown as Record<string, unknown>,
          ])
        );
  const buildings =
    runtime.houseDefinitions == null
      ? undefined
      : Object.fromEntries(
          runtime.houseDefinitions.map((house) => [
            house.id,
            house as unknown as Record<string, unknown>,
          ])
        );
  const settlementState = applySettlementDefinitionById(
    {
      people,
      ...(cities == null ? {} : { cities }),
      ...(buildings == null ? {} : { buildings }),
    },
    {
      settlementId,
      ...(content.settlementDefinitionsById == null
        ? {}
        : { settlementDefinitionsById: content.settlementDefinitionsById }),
      context: {
        people,
        ...(cities == null ? {} : { cities }),
        ...(buildings == null ? {} : { buildings }),
      },
    }
  );
  if (settlementState.warnings.length > 0) {
    return runtime;
  }

  return {
    ...runtime,
    characterDefinitions: runtime.characterDefinitions.map(
      (character) =>
        (settlementState.state.people?.[character.id] as
          | CharacterDefinition
          | undefined) ?? character
    ),
    ...(runtime.cityDefinitions == null
      ? {}
      : {
          cityDefinitions: runtime.cityDefinitions.map(
            (city) =>
              (settlementState.state.cities?.[city.id] as
                | CityDefinition
                | undefined) ?? city
          ),
        }),
    ...(runtime.houseDefinitions == null
      ? {}
      : {
          houseDefinitions: runtime.houseDefinitions.map(
            (house) =>
              (settlementState.state.buildings?.[house.id] as
                | HouseDefinition
                | undefined) ?? house
          ),
        }),
  };
}
