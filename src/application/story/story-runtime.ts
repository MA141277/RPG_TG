import type { ChoiceOption, SceneDefinition } from "../../domain/action";
import type { ActivityDefinition } from "../../domain/activity";
import type { CharacterDefinition } from "../../domain/character";
import type { CityDefinition } from "../../domain/city";
import type { EventDefinition, EventTriggerTiming } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import type { HouseDefinition } from "../../domain/house";
import {
  applySettlementContents,
  type ExportedSettlement,
} from "../../core/runtime/runtime-settlement";
import { continueToEvent } from "../events/event-continuation";
import { startEvent } from "../events/event-runner";
import {
  selectTriggeredEvents,
  type TriggerEvaluationInput,
} from "../events/trigger-evaluator";
import { resolveChoiceOption } from "../scene/choice-resolver";
import { advanceScene, runSceneUntilPause } from "../scene/scene-runner";

type StoryContent = {
  eventDefinitionsById: Record<string, EventDefinition>;
  sceneDefinitionsById: Record<string, SceneDefinition>;
  activityDefinitionsById?: Record<string, ActivityDefinition> | undefined;
  settlementDefinitionsById?: Record<string, StorySettlementDefinition> | undefined;
  textEntriesById?: Record<string, string> | undefined;
};

type StoryRuntimeContext = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  cityDefinitions?: CityDefinition[] | undefined;
  houseDefinitions?: HouseDefinition[] | undefined;
};

type StoryRuntimeResult = StoryRuntimeContext;

type StorySettlementDefinition = ExportedSettlement & {
  id: string;
};

function createScopedTriggerContext(
  state: GameState,
  characterDefinitions: CharacterDefinition[]
) {
  return {
    isCharacterAvailable: (characterId: string) =>
      characterDefinitions.some(
        (characterDefinition) => characterDefinition.id === characterId
      ),
    isCharacterInClan: (characterId: string, clanId: string) =>
      characterDefinitions.some(
        (characterDefinition) =>
          characterDefinition.id === characterId &&
          characterDefinition.clanId === clanId
      ),
    isCharacterInCity: (characterId: string, cityId: string) =>
      characterDefinitions.some(
        (characterDefinition) =>
          characterDefinition.id === characterId &&
          characterDefinition.cityId === cityId
      ),
    doesClanExist: (clanId: string) =>
      characterDefinitions.some(
        (characterDefinition) => characterDefinition.clanId === clanId
      ),
    getClanRelation: () => null,
    isCityOwnedByClan: () => false,
    hasEventFired: (eventId: string) =>
      (state.runtime.eventHistory[eventId]?.firedCount ?? 0) > 0,
    getEventFiredCount: (eventId: string) =>
      state.runtime.eventHistory[eventId]?.firedCount ?? 0,
    getMonthsSinceEvent: () => null,
    getMissionStatus: (missionId: string) => {
      if (state.missions.activeMissionId === missionId) {
        return "active";
      }

      if (state.missions.completedMissionIds.includes(missionId)) {
        return "completed";
      }

      return "inactive";
    },
    runCustomCondition: () => false,
  };
}

export function syncStoryScene(
  runtime: StoryRuntimeContext,
  content: StoryContent
): StoryRuntimeResult {
  const result = runSceneUntilPause(runtime.state, {
    sceneDefinitionsById: content.sceneDefinitionsById,
    eventDefinitionsById: content.eventDefinitionsById,
    activityDefinitionsById: content.activityDefinitionsById,
    characterDefinitions: runtime.characterDefinitions,
    textEntriesById: content.textEntriesById,
  });

  return {
    state: result.state,
    characterDefinitions: result.characterDefinitions,
    ...(runtime.cityDefinitions == null
      ? {}
      : { cityDefinitions: runtime.cityDefinitions }),
    ...(runtime.houseDefinitions == null
      ? {}
      : { houseDefinitions: runtime.houseDefinitions }),
  };
}

export function startStoryEventById(
  runtime: StoryRuntimeContext,
  content: StoryContent,
  eventId: string
): StoryRuntimeResult {
  const eventDefinition = content.eventDefinitionsById[eventId];
  if (eventDefinition == null) {
    return runtime;
  }

  return syncStoryScene(
    {
      state: startEvent(runtime.state, eventDefinition),
      characterDefinitions: runtime.characterDefinitions,
    },
    content
  );
}

export function continueStoryFromSourceEvent(
  runtime: StoryRuntimeContext,
  content: StoryContent,
  sourceEventId: string
): StoryRuntimeResult | null {
  const sourceEventDefinition = content.eventDefinitionsById[sourceEventId];
  const continuation = continueToEvent({
    state: runtime.state,
    eventDefinitionsById: content.eventDefinitionsById,
    sourceEventId,
    targetEventId: sourceEventDefinition?.nextEventId,
    visitedEventIds: [sourceEventId],
  });
  if (continuation == null) {
    return null;
  }

  const settledRuntime = applyStorySettlementEvent(
    {
      state: continuation.state,
      characterDefinitions: runtime.characterDefinitions,
      ...(runtime.cityDefinitions == null
        ? {}
        : { cityDefinitions: runtime.cityDefinitions }),
      ...(runtime.houseDefinitions == null
        ? {}
        : { houseDefinitions: runtime.houseDefinitions }),
    },
    content,
    continuation.eventDefinition
  );

  return syncStoryScene(
    settledRuntime,
    content
  );
}

export function triggerStoryEvents(
  runtime: StoryRuntimeContext,
  content: StoryContent,
  input: TriggerEvaluationInput
): StoryRuntimeResult {
  const triggeredEvents = selectTriggeredEvents(
    runtime.state,
    Object.values(content.eventDefinitionsById),
    input,
    createScopedTriggerContext(runtime.state, runtime.characterDefinitions)
  );
  const targetEvent = triggeredEvents[0];
  if (targetEvent == null) {
    return runtime;
  }

  return syncStoryScene(
    {
      state: startEvent(runtime.state, targetEvent),
      characterDefinitions: runtime.characterDefinitions,
    },
    content
  );
}

export function advanceStorySceneStep(
  runtime: StoryRuntimeContext,
  content: StoryContent
): StoryRuntimeResult {
  const result = advanceScene(runtime.state, {
    sceneDefinitionsById: content.sceneDefinitionsById,
    eventDefinitionsById: content.eventDefinitionsById,
    activityDefinitionsById: content.activityDefinitionsById,
    characterDefinitions: runtime.characterDefinitions,
    textEntriesById: content.textEntriesById,
  });

  return {
    state: result.state,
    characterDefinitions: result.characterDefinitions,
  };
}

export function chooseStorySceneOption(
  runtime: StoryRuntimeContext,
  content: StoryContent,
  selectedOption: ChoiceOption
): StoryRuntimeResult {
  const choiceResult = resolveChoiceOption(runtime.state, selectedOption, {
    sceneDefinitionsById: content.sceneDefinitionsById,
    eventDefinitionsById: content.eventDefinitionsById,
    characterDefinitions: runtime.characterDefinitions,
  });

  return syncStoryScene(
    {
      state: choiceResult.state,
      characterDefinitions: choiceResult.characterDefinitions,
    },
    content
  );
}

export function getCurrentSceneAction(
  state: GameState,
  sceneDefinitionsById: Record<string, SceneDefinition>
) {
  if (state.scene.activeSceneId == null) {
    return null;
  }

  const activeScene = sceneDefinitionsById[state.scene.activeSceneId];
  if (activeScene == null) {
    return null;
  }

  return activeScene.actions[state.scene.cursor] ?? null;
}

function applyStorySettlementEvent(
  runtime: StoryRuntimeContext,
  content: StoryContent,
  eventDefinition: EventDefinition
): StoryRuntimeContext {
  if (eventDefinition.type !== "settlement") {
    return runtime;
  }

  const settlementId =
    typeof eventDefinition.settlementId === "string"
      ? eventDefinition.settlementId.trim()
      : "";
  const settlement =
    settlementId.length === 0
      ? undefined
      : content.settlementDefinitionsById?.[settlementId];
  if (settlement == null) {
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
  const settlementState = applySettlementContents(
    {
      people,
      ...(cities == null ? {} : { cities }),
      ...(buildings == null ? {} : { buildings }),
    },
    settlement,
    {
      people,
      ...(cities == null ? {} : { cities }),
      ...(buildings == null ? {} : { buildings }),
    }
  );

  return {
    ...runtime,
    characterDefinitions: runtime.characterDefinitions.map(
      (character) =>
        (settlementState.people?.[character.id] as
          | CharacterDefinition
          | undefined) ?? character
    ),
    ...(runtime.cityDefinitions == null
      ? {}
      : {
          cityDefinitions: runtime.cityDefinitions.map(
            (city) =>
              (settlementState.cities?.[city.id] as
                | CityDefinition
                | undefined) ?? city
          ),
        }),
    ...(runtime.houseDefinitions == null
      ? {}
      : {
          houseDefinitions: runtime.houseDefinitions.map(
            (house) =>
              (settlementState.buildings?.[house.id] as
                | HouseDefinition
                | undefined) ?? house
          ),
        }),
  };
}

export function getCurrentChoiceOptions(
  state: GameState,
  sceneDefinitionsById: Record<string, SceneDefinition>
): ChoiceOption[] {
  const currentAction = getCurrentSceneAction(state, sceneDefinitionsById);
  return currentAction?.type === "choice" ? currentAction.options : [];
}

export function buildStoryTriggerInput(
  timing: EventTriggerTiming,
  state: GameState
): TriggerEvaluationInput {
  return {
    timing,
    cityId: state.world.currentCityId,
    ...(state.world.currentHouseId == null ? {} : { houseId: state.world.currentHouseId }),
  };
}
