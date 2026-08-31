import type { HouseDefinition } from "../../domain/house";
import type {
  HouseActionMemoryContext,
  WorldObservedEvent,
} from "../../domain/world-intent";

type CreateHouseActionMemoryObservedEventInput = {
  houseDefinition: Pick<HouseDefinition, "id" | "cityId" | "defaultCharacterId">;
  type: string;
  summary: string;
  houseActionMemory: HouseActionMemoryContext;
  reactionSummary?: string | undefined;
  reactionCharacterId?: string | null | undefined;
};

export function createHouseActionMemoryObservedEvent(
  input: CreateHouseActionMemoryObservedEventInput
): WorldObservedEvent {
  const reactionCharacterId =
    input.reactionCharacterId ?? input.houseDefinition.defaultCharacterId ?? null;

  return {
    type: input.type,
    cityId: input.houseDefinition.cityId,
    houseId: input.houseDefinition.id,
    summary: input.summary,
    houseActionMemory: input.houseActionMemory,
    ...(input.reactionSummary == null || reactionCharacterId == null
      ? {}
      : {
          reactionHints: [
            {
              characterId: reactionCharacterId,
              summary: input.reactionSummary,
            },
          ],
        }),
  };
}
