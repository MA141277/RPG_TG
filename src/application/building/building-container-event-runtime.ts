import type { ActivityDefinition } from "../../domain/activity";
import type { BuildingArrangementDefinition } from "../../domain/building-arrangement";
import type { CharacterDefinition } from "../../domain/character";
import type { CityDefinition } from "../../domain/city";
import type { RuntimeDialogueDefinition } from "../../domain/dialogue";
import type { EventBinding, EventDefinition } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import type { HouseDefinition } from "../../domain/house";
import type { LocationAccessDefinition } from "../../domain/location-access";
import { createRuntimeTriggerContext } from "../../core/runtime/event-binding-contract";
import { runEventBindingRuntime } from "../../core/runtime/event-binding-runtime";
import {
  createNavigateRequest,
  runNavigationRuntime,
} from "../../core/runtime/navigation-runtime";
import { resolveActiveEventPresentationDialogueId } from "../dialogue/dialogue-presentation";
import { runDialogueUntilPause } from "../dialogue/dialogue-runner";
import { runEventPlayableRuntime } from "../events/event-playable-runtime";

export type BuildingContainerItemAction = {
  arrangementId: string;
  containerId: string;
  itemId: string;
  eventId?: string;
};

export type BuildingContainerEventStoryContent = {
  eventDefinitionsById: Record<string, EventDefinition>;
  eventBindingsById?: Record<string, EventBinding> | undefined;
  dialogueDefinitionsById: Record<string, RuntimeDialogueDefinition>;
  activityDefinitionsById?: Record<string, ActivityDefinition> | undefined;
  textEntriesById?: Record<string, string> | undefined;
  cityDefinitionsById?: Record<string, CityDefinition> | undefined;
  houseDefinitionsById?: Record<string, HouseDefinition> | undefined;
  buildingArrangements?: readonly BuildingArrangementDefinition[] | undefined;
  locationAccessDefinitions?: readonly LocationAccessDefinition[] | undefined;
};

export type BuildingContainerEventRuntimeInput = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  storyContent: BuildingContainerEventStoryContent;
  action: BuildingContainerItemAction;
};

export type BuildingContainerEventRuntimeResult = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
};

export function triggerBuildingContainerItemAction(
  input: BuildingContainerEventRuntimeInput
): BuildingContainerEventRuntimeResult {
  const currentHouseId = input.state.world.currentHouseId;
  if (currentHouseId == null) {
    return {
      state: input.state,
      characterDefinitions: input.characterDefinitions,
    };
  }

  const eventBindings = Object.values(input.storyContent.eventBindingsById ?? {});
  const matchingBindings =
    typeof input.action.eventId === "string" && input.action.eventId.length > 0
      ? eventBindings.filter((binding) => binding.eventId === input.action.eventId)
      : eventBindings;
  const bindingResult = runEventBindingRuntime({
    state: input.state,
    eventDefinitionsById: input.storyContent.eventDefinitionsById,
    eventBindings: matchingBindings,
    triggerContext: createRuntimeTriggerContext({
      state: input.state,
      owner: { family: "building", id: currentHouseId },
      action: "building-container-item-action",
      payload: {
        arrangementId: input.action.arrangementId,
        containerId: input.action.containerId,
        itemId: input.action.itemId,
      },
    }),
  });

  if (bindingResult.activation == null) {
    return {
      state: input.state,
      characterDefinitions: input.characterDefinitions,
    };
  }
  const activeEvent =
    input.storyContent.eventDefinitionsById[bindingResult.activation.activeEventId] ?? null;
  const playableResult = runEventPlayableRuntime({
    state: bindingResult.state,
    characterDefinitions: input.characterDefinitions,
    eventDefinition: activeEvent,
    activityDefinitionsById: input.storyContent.activityDefinitionsById,
    textEntriesById: input.storyContent.textEntriesById,
  });
  if (playableResult?.handled) {
    return {
      state: playableResult.state,
      characterDefinitions: playableResult.characterDefinitions,
    };
  }
  if (activeEvent == null) {
    return {
      state: bindingResult.state,
      characterDefinitions: input.characterDefinitions,
    };
  }

  const navigationResult = runActiveEventNavigation({
    state: bindingResult.state,
    characterDefinitions: input.characterDefinitions,
    storyContent: input.storyContent,
    eventDefinition: activeEvent,
  });
  if (navigationResult != null) {
    return navigationResult;
  }

  const activeDialogueId = resolveActiveEventPresentationDialogueId(
    bindingResult.state,
    input.storyContent.eventDefinitionsById
  );
  const activeDialogue =
    activeDialogueId == null
      ? null
      : input.storyContent.dialogueDefinitionsById[activeDialogueId] ?? null;
  if (activeDialogue == null || (activeDialogue.nodes?.length ?? 0) === 0) {
    return {
      state: bindingResult.state,
      characterDefinitions: input.characterDefinitions,
    };
  }

  const dialogueResult = runDialogueUntilPause(bindingResult.state, {
    dialogueDefinitionsById: input.storyContent.dialogueDefinitionsById,
    eventDefinitionsById: input.storyContent.eventDefinitionsById,
    activityDefinitionsById: input.storyContent.activityDefinitionsById,
    characterDefinitions: input.characterDefinitions,
    textEntriesById: input.storyContent.textEntriesById,
  });

  return {
    state: dialogueResult.state,
    characterDefinitions: dialogueResult.characterDefinitions,
  };
}

function runActiveEventNavigation(input: {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  storyContent: BuildingContainerEventStoryContent;
  eventDefinition: EventDefinition;
}): BuildingContainerEventRuntimeResult | null {
  for (const action of input.eventDefinition.actions ?? []) {
    if (action.type !== "navigate") {
      continue;
    }

    const houseDefinition =
      action.target.kind === "building"
        ? input.storyContent.houseDefinitionsById?.[action.target.houseId] ?? null
        : null;
    const result = runNavigationRuntime({
      state: input.state,
      request: createNavigateRequest(action.target),
      ...(houseDefinition == null ? {} : { houseDefinition }),
      ...(input.storyContent.cityDefinitionsById == null
        ? {}
        : { cityDefinitionsById: input.storyContent.cityDefinitionsById }),
      ...(input.storyContent.buildingArrangements == null
        ? {}
        : { buildingArrangements: input.storyContent.buildingArrangements }),
      characterDefinitions: input.characterDefinitions,
      ...(input.storyContent.locationAccessDefinitions == null
        ? {}
        : {
            locationAccessDefinitions:
              input.storyContent.locationAccessDefinitions,
          }),
    });
    if (result.navigation != null) {
      return {
        state: result.state,
        characterDefinitions: input.characterDefinitions,
      };
    }
  }

  return null;
}
