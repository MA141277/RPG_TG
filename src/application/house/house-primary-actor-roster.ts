import type { HouseStandbyActorViewModel } from "../../domain/house-module";

export function orderHouseStandbyRoster(input: {
  primaryCharacterId: string | null;
  actors: HouseStandbyActorViewModel[];
}): HouseStandbyActorViewModel[] {
  const seenCharacterIds = new Set<string>();
  const dedupedActors: HouseStandbyActorViewModel[] = [];

  for (const actor of input.actors) {
    if (seenCharacterIds.has(actor.characterId)) {
      continue;
    }
    seenCharacterIds.add(actor.characterId);
    dedupedActors.push(actor);
  }

  if (input.primaryCharacterId == null) {
    return dedupedActors;
  }

  const primaryActor = dedupedActors.find(
    (actor) => actor.characterId === input.primaryCharacterId
  );
  if (primaryActor == null) {
    return dedupedActors;
  }

  return [
    primaryActor,
    ...dedupedActors.filter(
      (actor) => actor.characterId !== input.primaryCharacterId
    ),
  ];
}
