import type { ActivityDefinition } from "../../domain/activity";
import type { CharacterDefinition } from "../../domain/character";
import type { RuntimeDialogueDefinition } from "../../domain/dialogue";
import type { EventBinding, EventDefinition } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import type { FlowPlayableDefinition } from "../../domain/playables/flow";
import { createRuntimeTriggerContext } from "../../core/runtime/event-binding-contract";
import { runEventBindingRuntime } from "../../core/runtime/event-binding-runtime";
import { resolveActiveEventPresentationDialogueId } from "../dialogue/dialogue-presentation";
import { runDialogueUntilPause } from "../dialogue/dialogue-runner";
import { launchFlowPlayable } from "../playables/flow/flow-playable-definition";

export type BuildingContainerItemAction = {
  arrangementId: string;
  containerId: string;
  itemId: string;
};

export type BuildingContainerEventStoryContent = {
  eventDefinitionsById: Record<string, EventDefinition>;
  eventBindingsById?: Record<string, EventBinding> | undefined;
  dialogueDefinitionsById: Record<string, RuntimeDialogueDefinition>;
  activityDefinitionsById?: Record<string, ActivityDefinition> | undefined;
  flowDefinitionsById?: Record<string, FlowPlayableDefinition> | undefined;
  textEntriesById?: Record<string, string> | undefined;
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

  const bindingResult = runEventBindingRuntime({
    state: input.state,
    eventDefinitionsById: input.storyContent.eventDefinitionsById,
    eventBindings: Object.values(input.storyContent.eventBindingsById ?? {}),
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

  const activeFlow = Object.values(input.storyContent.flowDefinitionsById ?? {}).find(
    (flowDefinition) =>
      flowDefinition.ownerKind === "building" &&
      flowDefinition.ownerId === currentHouseId &&
      flowDefinition.eventStartTarget?.eventId ===
        bindingResult.activation?.activeEventId
  );
  if (activeFlow != null) {
    const integrationId =
      activeFlow.integrationId ?? `playable.${activeFlow.id}`;
    const nextState = {
      ...bindingResult.state,
      dialogue: {
        ...bindingResult.state.dialogue,
        activeEventId: null,
        activeDialogueId: null,
        cursor: 0,
        status: "idle" as const,
      },
      ui: {
        ...bindingResult.state.ui,
        currentView: "minigame" as const,
      },
      runtime: {
        ...bindingResult.state.runtime,
        playableSession: launchFlowPlayable({
          definition: activeFlow,
          integrationId,
          ownerContext: {
            ownerKind: "house",
            ownerId: currentHouseId,
            returnPolicy: activeFlow.returnPolicy ?? "reenter-owner",
          },
        }),
      },
    };
    return {
      state: nextState,
      characterDefinitions: input.characterDefinitions,
    };
  }

  const activeDialogueId = resolveActiveEventPresentationDialogueId(
    bindingResult.state,
    input.storyContent.eventDefinitionsById
  );
  const activeDialogue =
    activeDialogueId == null
      ? null
      : input.storyContent.dialogueDefinitionsById[activeDialogueId] ?? null;
  if (activeDialogue == null || activeDialogue.nodes.length === 0) {
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
