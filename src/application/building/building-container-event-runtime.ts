import type { SceneDefinition } from "../../domain/action";
import type { ActivityDefinition } from "../../domain/activity";
import type { CharacterDefinition } from "../../domain/character";
import type { EventBinding, EventDefinition } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import type { FlowPlayableDefinition } from "../../domain/playables/flow";
import { runEventBindingRuntime } from "../../core/runtime/event-binding-runtime";
import { runSceneUntilPause } from "../scene/scene-runner";
import { launchFlowPlayable } from "../playables/flow/flow-playable-definition";

export type BuildingContainerItemAction = {
  arrangementId: string;
  containerId: string;
  itemId: string;
};

export type BuildingContainerEventStoryContent = {
  eventDefinitionsById: Record<string, EventDefinition>;
  eventBindingsById?: Record<string, EventBinding> | undefined;
  sceneDefinitionsById: Record<string, SceneDefinition>;
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
    triggerContext: {
      owner: { family: "building", id: currentHouseId },
      timing: "after",
      action: "building-container-item-action",
      currentCityId: input.state.world.currentCityId,
      currentHouseId,
      payload: {
        arrangementId: input.action.arrangementId,
        containerId: input.action.containerId,
        itemId: input.action.itemId,
      },
    },
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
      scene: {
        ...bindingResult.state.scene,
        activeEventId: null,
        activeSceneId: null,
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

  const activeSceneId = bindingResult.state.scene.activeSceneId;
  const activeScene =
    activeSceneId == null
      ? null
      : input.storyContent.sceneDefinitionsById[activeSceneId] ?? null;
  if (activeScene == null || activeScene.actions.length === 0) {
    return {
      state: bindingResult.state,
      characterDefinitions: input.characterDefinitions,
    };
  }

  const sceneResult = runSceneUntilPause(bindingResult.state, {
    sceneDefinitionsById: input.storyContent.sceneDefinitionsById,
    eventDefinitionsById: input.storyContent.eventDefinitionsById,
    activityDefinitionsById: input.storyContent.activityDefinitionsById,
    characterDefinitions: input.characterDefinitions,
    textEntriesById: input.storyContent.textEntriesById,
  });

  return {
    state: sceneResult.state,
    characterDefinitions: sceneResult.characterDefinitions,
  };
}
