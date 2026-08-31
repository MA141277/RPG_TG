import {
  createInitialAppWorldIntentState,
  type AppLocationDialogueState,
  type AppState,
} from "../app-shell";
import type { AppPresenterStageOutput } from "../presenter/presenter-output";
import { selectHouseEntryAccess } from "../story/story-stage-access";
import { selectWorldIntentCapabilitySnapshot } from "../world-intent/select-world-intent-capability-snapshot";
import type { CityDefinition } from "../../domain/city";
import type { HouseAccessRefusalRule, HouseDefinition } from "../../domain/house";
import type {
  HouseActionViewModel,
  HouseModuleViewModel,
} from "../../domain/house-module";
import type { NpcInteractionContext } from "../../domain/npc-interaction";
import type {
  WorldAiIntentResponse,
  WorldCapabilitySnapshot,
  WorldNegotiationApproach,
  WorldObservedEvent,
  WorldStoryNegotiationCapability,
} from "../../domain/world-intent";
import { readZhuYuanzhangStoryStage } from "../../domain/zhu-yuanzhang-story";
import type { WorldIntentRuntimeBridge } from "../../core/runtime/world-intent-runtime";

type WorldIntentNegotiationSelectionInput = {
  appState: AppState;
  stageOutput: AppPresenterStageOutput;
};

export type WorldIntentCapabilitySelectionInput = {
  appState: AppState;
  stageOutput: AppPresenterStageOutput;
  cityDefinitions: CityDefinition[];
  houseDefinitions: HouseDefinition[];
  houseAccessRefusalRules: HouseAccessRefusalRule[];
  selectNegotiableStoryNodes?:
    | ((
        input: WorldIntentNegotiationSelectionInput
      ) => WorldStoryNegotiationCapability[])
    | undefined;
};

type FeedbackDescriptor = {
  speakerCharacterId: string;
  text: string;
  advanceHintText: string;
  intentStatus: "narration" | "clarify" | "refusal";
};

type ValidatedIntentAction =
  | {
      kind: "go-to-house";
      houseId: string;
      houseName: string;
    }
  | {
      kind: "leave-house";
      label: string;
    }
  | {
      kind: "talk-to-npc";
      targetCharacterId: string;
      targetCharacterName: string;
      context: NpcInteractionContext;
    }
  | {
      kind: "open-service-action";
      actionId: string;
      label: string;
    }
  | {
      kind: "negotiate-story-node";
      nodeId: string;
      label: string;
      targetCharacterId?: string | null;
      approach: WorldNegotiationApproach;
    };

type IntentValidationResult =
  | {
      ok: true;
      action: ValidatedIntentAction;
    }
  | {
      ok: false;
      feedback: FeedbackDescriptor;
    };

export type WorldIntentActionCoordinatorDependencies = {
  getAppState(): AppState;
  setAppState(appState: AppState): void;
  renderApp(): void;
  getStageOutput(): AppPresenterStageOutput;
  cityDefinitions: CityDefinition[];
  houseDefinitions: HouseDefinition[];
  houseAccessRefusalRules: HouseAccessRefusalRule[];
  worldIntentRuntime: Pick<WorldIntentRuntimeBridge, "dispatch" | "cancelActiveRequest">;
  enterHouse(houseId: string): void;
  leaveHouse(): void;
  dispatchHouseAction(actionId: string): void;
  openNpcTalk(input: {
    targetCharacterId: string;
    context: NpcInteractionContext;
  }): void;
  selectNegotiableStoryNodes?:
    | ((
        input: WorldIntentNegotiationSelectionInput
      ) => WorldStoryNegotiationCapability[])
    | undefined;
  negotiateStoryNode?:
    | ((
        input: {
          nodeId: string;
          targetCharacterId?: string | null;
          approach: WorldNegotiationApproach;
        }
      ) => void)
    | undefined;
};

export type WorldIntentActionCoordinator = {
  selectCapabilitySnapshot(): WorldCapabilitySnapshot;
  handleDraftInput(text: string): void;
  handleSubmit(): void;
  handleClear(): void;
  handleResolvedIntent(input: {
    requestId: string;
    result: WorldAiIntentResponse;
  }): void;
  handleLocationDialogueAdvance(): boolean;
};

const DEFAULT_FEEDBACK_HINT = "点击继续";

function resolveWorldIntentState(
  appState: AppState
): NonNullable<AppState["worldIntentState"]> {
  return appState.worldIntentState ?? createInitialAppWorldIntentState();
}

function updateWorldIntentState(
  appState: AppState,
  updater: (
    state: NonNullable<AppState["worldIntentState"]>
  ) => NonNullable<AppState["worldIntentState"]>
): AppState {
  return {
    ...appState,
    worldIntentState: updater(resolveWorldIntentState(appState)),
  };
}

function clearResolvedWorldIntentState(
  appState: AppState,
  options: {
    clearDraft: boolean;
  }
): AppState {
  return updateWorldIntentState(appState, (state) => ({
    ...state,
    draftText: options.clearDraft ? "" : state.draftText,
    status: "idle",
    currentRequestId: null,
    pendingResolution: null,
    lastError: null,
  }));
}

function setWorldIntentFeedback(
  appState: AppState,
  feedback: FeedbackDescriptor
): AppState {
  return {
    ...appState,
    locationDialogueState: {
      type: "world-intent-feedback",
      speakerCharacterId: feedback.speakerCharacterId,
      textLines: [feedback.text],
      advanceHintText: feedback.advanceHintText,
      intentStatus: feedback.intentStatus,
    },
  };
}

function selectCurrentCityDefinition(
  cityDefinitions: CityDefinition[],
  appState: AppState
): CityDefinition | null {
  return (
    cityDefinitions.find(
      (cityDefinition) =>
        cityDefinition.id === appState.gameState.world.currentCityId
    ) ?? cityDefinitions[0] ?? null
  );
}

function isDismissLikeHouseAction(
  action: HouseActionViewModel,
  leaveActionId: string | null
): boolean {
  const normalizedId = action.id.toLowerCase();
  if (leaveActionId != null && action.id === leaveActionId) {
    return true;
  }

  return (
    normalizedId === "dismiss-dialogue" ||
    normalizedId === "close" ||
    normalizedId.endsWith(":close") ||
    action.label === "关闭" ||
    action.label.includes("退下") ||
    action.label.includes("离开")
  );
}

function selectCityHouseDefinitions(
  appState: AppState,
  cityDefinitions: CityDefinition[],
  houseDefinitions: HouseDefinition[],
  houseAccessRefusalRules: HouseAccessRefusalRule[]
) {
  const currentCityId = appState.gameState.world.currentCityId;
  const currentView = appState.gameState.ui.currentView;
  const currentHouseId = appState.gameState.world.currentHouseId;
  const currentCityDefinition =
    selectCurrentCityDefinition(cityDefinitions, appState);
  const currentCityHouseIds = new Set(currentCityDefinition?.houseIds ?? []);

  return houseDefinitions
    .filter(
      (houseDefinition) =>
        houseDefinition.cityId === currentCityId ||
        currentCityHouseIds.has(houseDefinition.id)
    )
    .map((houseDefinition) => {
      const accessResult = selectHouseEntryAccess(
        appState.gameState,
        appState.characterDefinitions,
        houseDefinition,
        houseAccessRefusalRules
      );
      const forceAvailable =
        currentView === "house" && currentHouseId === houseDefinition.id;

      return {
        houseId: houseDefinition.id,
        houseName: houseDefinition.name,
        moduleId: houseDefinition.moduleId ?? null,
        available: forceAvailable || accessResult.canEnter,
        refusalText: accessResult.refusal?.text ?? null,
      };
    });
}

function selectTalkTargetsForHouseStage(
  stageOutput: Extract<AppPresenterStageOutput, { type: "house" }>
) {
  if (stageOutput.moduleViewModel != null) {
    return stageOutput.moduleViewModel.standbyRoster.map((actor) => ({
      characterId: actor.characterId,
      characterName: actor.name,
      available: actor.disabled !== true,
    }));
  }

  return stageOutput.cityNpcSummaries.map((summary) => ({
    characterId: summary.id,
    characterName: summary.name,
    available: true,
  }));
}

function selectServiceActionsForHouseStage(
  stageOutput: Extract<AppPresenterStageOutput, { type: "house" }>
) {
  const moduleViewModel = stageOutput.moduleViewModel;
  if (moduleViewModel?.actionContainer == null) {
    return [];
  }

  const leaveActionId = moduleViewModel.leaveAction.id;
  return moduleViewModel.actionContainer.actions.map((action) => ({
    actionId: action.id,
    label: action.label,
    available:
      action.disabled !== true &&
      !isDismissLikeHouseAction(action, leaveActionId),
  }));
}

function selectLeaveActionForHouseStage(
  stageOutput: Extract<AppPresenterStageOutput, { type: "house" }>
) {
  if (stageOutput.moduleViewModel != null) {
    return {
      actionId: stageOutput.moduleViewModel.leaveAction.id,
      label: stageOutput.moduleViewModel.leaveAction.label,
      available: stageOutput.moduleViewModel.leaveAction.disabled !== true,
    };
  }

  return {
    actionId: "leave-house",
    label: `离开${stageOutput.activeHouse.name}`,
    available: true,
  };
}

export function selectWorldIntentCapabilitySnapshotForApp(
  input: WorldIntentCapabilitySelectionInput
): WorldCapabilitySnapshot {
  const currentHouseId = input.appState.gameState.world.currentHouseId;
  const storyStage = readZhuYuanzhangStoryStage(input.appState.gameState);

  if (input.stageOutput.type !== "city" && input.stageOutput.type !== "house") {
    return {
      cityId: input.appState.gameState.world.currentCityId,
      currentHouseId,
      currentHouseModuleId: null,
      storyStage,
      reachableHouses: [],
      talkTargets: [],
      serviceActions: [],
      negotiableStoryNodes: [],
      leaveAction: null,
    };
  }

  const reachableHouses = selectCityHouseDefinitions(
    input.appState,
    input.cityDefinitions,
    input.houseDefinitions,
    input.houseAccessRefusalRules
  );

  if (input.stageOutput.type !== "house") {
    return selectWorldIntentCapabilitySnapshot({
      cityId: input.appState.gameState.world.currentCityId,
      currentHouseId,
      currentHouseModuleId: null,
      storyStage,
      houses: reachableHouses,
      talkTargets: [],
      serviceActions: [],
      negotiableStoryNodes:
        input.selectNegotiableStoryNodes?.({
          appState: input.appState,
          stageOutput: input.stageOutput,
        }) ?? [],
      leaveAction: null,
    });
  }

  const currentHouseModuleId =
    input.stageOutput.moduleViewModel?.moduleId ??
    input.stageOutput.activeHouse.moduleId ??
    null;

  return selectWorldIntentCapabilitySnapshot({
    cityId: input.appState.gameState.world.currentCityId,
    currentHouseId,
    currentHouseModuleId,
    storyStage,
    houses: reachableHouses,
    talkTargets: selectTalkTargetsForHouseStage(input.stageOutput),
    serviceActions: selectServiceActionsForHouseStage(input.stageOutput),
    negotiableStoryNodes:
      input.selectNegotiableStoryNodes?.({
        appState: input.appState,
        stageOutput: input.stageOutput,
      }) ?? [],
    leaveAction: selectLeaveActionForHouseStage(input.stageOutput),
  });
}

function createGenericFeedback(
  appState: AppState,
  text: string,
  intentStatus: FeedbackDescriptor["intentStatus"] = "refusal"
): FeedbackDescriptor {
  return {
    speakerCharacterId: appState.gameState.player.characterId,
    text,
    advanceHintText: DEFAULT_FEEDBACK_HINT,
    intentStatus,
  };
}

function createHouseAccessFeedback(
  accessResult: ReturnType<typeof selectHouseEntryAccess>,
  appState: AppState
): FeedbackDescriptor {
  if (accessResult.refusal == null) {
    return createGenericFeedback(appState, "现在还不能去那里。");
  }

  return {
    speakerCharacterId: accessResult.refusal.speakerCharacterId,
    text: accessResult.refusal.text,
    advanceHintText: accessResult.refusal.confirmLabel,
    intentStatus: "refusal",
  };
}

function validateResolvedIntent(input: {
  appState: AppState;
  stageOutput: AppPresenterStageOutput;
  capabilitySnapshot: WorldCapabilitySnapshot;
  houseDefinitions: HouseDefinition[];
  houseAccessRefusalRules: HouseAccessRefusalRule[];
  result: WorldAiIntentResponse;
  negotiateStoryNode?: WorldIntentActionCoordinatorDependencies["negotiateStoryNode"];
}): IntentValidationResult {
  const result = input.result;

  if (result.intent === "clarify") {
    return {
      ok: false,
      feedback: createGenericFeedback(
        input.appState,
        result.question,
        "clarify"
      ),
    };
  }

  if (result.intent === "go-to-house") {
    if (
      input.appState.gameState.ui.currentView === "house" &&
      input.appState.gameState.world.currentHouseId === result.targetHouseId
    ) {
      return {
        ok: false,
        feedback: createGenericFeedback(input.appState, "你已经在这里了。"),
      };
    }

    const targetHouse = input.capabilitySnapshot.reachableHouses.find(
      (house) => house.houseId === result.targetHouseId
    );
    if (targetHouse != null) {
      return {
        ok: true,
        action: {
          kind: "go-to-house",
          houseId: targetHouse.houseId,
          houseName: targetHouse.houseName,
        },
      };
    }

    const targetHouseDefinition = input.houseDefinitions.find(
      (houseDefinition) => houseDefinition.id === result.targetHouseId
    );
    if (targetHouseDefinition != null) {
      const accessResult = selectHouseEntryAccess(
        input.appState.gameState,
        input.appState.characterDefinitions,
        targetHouseDefinition,
        input.houseAccessRefusalRules
      );
      return {
        ok: false,
        feedback: createHouseAccessFeedback(accessResult, input.appState),
      };
    }

    return {
      ok: false,
      feedback: createGenericFeedback(input.appState, "现在还不能去那里。"),
    };
  }

  if (result.intent === "leave-house") {
    if (input.capabilitySnapshot.leaveAction == null) {
      return {
        ok: false,
        feedback: createGenericFeedback(input.appState, "现在还不能离开这里。"),
      };
    }

    return {
      ok: true,
      action: {
        kind: "leave-house",
        label: input.capabilitySnapshot.leaveAction.label,
      },
    };
  }

  if (result.intent === "talk-to-npc") {
    if (input.stageOutput.type !== "house") {
      return {
        ok: false,
        feedback: createGenericFeedback(input.appState, "现在没人能接这句话。"),
      };
    }

    const talkTarget = input.capabilitySnapshot.talkTargets.find(
      (target) => target.characterId === result.targetCharacterId
    );
    if (talkTarget == null) {
      return {
        ok: false,
        feedback: createGenericFeedback(input.appState, "现在没法和这个人搭话。"),
      };
    }

    return {
      ok: true,
      action: {
        kind: "talk-to-npc",
        targetCharacterId: talkTarget.characterId,
        targetCharacterName: talkTarget.characterName,
        context: {
          type: "house",
          houseId: input.stageOutput.activeHouse.id,
          ...(input.stageOutput.activeHouse.moduleId == null
            ? {}
            : { moduleId: input.stageOutput.activeHouse.moduleId }),
        },
      },
    };
  }

  if (result.intent === "open-service-action") {
    const serviceAction = input.capabilitySnapshot.serviceActions.find(
      (action) => action.actionId === result.actionId
    );
    if (serviceAction == null) {
      return {
        ok: false,
        feedback: createGenericFeedback(input.appState, "现在还不能这样做。"),
      };
    }

    return {
      ok: true,
      action: {
        kind: "open-service-action",
        actionId: serviceAction.actionId,
        label: serviceAction.label,
      },
    };
  }

  if (result.intent !== "negotiate-story-node") {
    return {
      ok: false,
      feedback: createGenericFeedback(input.appState, "现在还不能这样做。"),
    };
  }

  const storyNode = input.capabilitySnapshot.negotiableStoryNodes.find(
    (node) => node.nodeId === result.nodeId
  );
  if (storyNode == null || input.negotiateStoryNode == null) {
    return {
      ok: false,
        feedback: createGenericFeedback(input.appState, "这段剧情交涉现在还接不上。"),
      };
  }

  if (
    storyNode.allowedApproaches != null &&
    !storyNode.allowedApproaches.includes(result.approach)
  ) {
    return {
      ok: false,
      feedback: createGenericFeedback(
        input.appState,
        "现在还不能这样推进这段交涉。"
      ),
    };
  }

  return {
    ok: true,
    action: {
      kind: "negotiate-story-node",
      nodeId: storyNode.nodeId,
      label: storyNode.label,
      ...(result.targetCharacterId != null || storyNode.targetCharacterId != null
        ? {
            targetCharacterId:
              result.targetCharacterId ?? storyNode.targetCharacterId ?? null,
          }
        : {}),
      approach: result.approach,
    },
  };
}

function buildObservedEvent(
  appState: AppState,
  action: ValidatedIntentAction
): WorldObservedEvent {
  if (action.kind === "go-to-house") {
    return {
      type: "world-intent:go-to-house",
      cityId: appState.gameState.world.currentCityId,
      houseId: action.houseId,
      summary: `玩家前往了${action.houseName}。`,
    };
  }

  if (action.kind === "leave-house") {
    return {
      type: "world-intent:leave-house",
      cityId: appState.gameState.world.currentCityId,
      houseId: null,
      summary: `玩家离开了当前地点。`,
    };
  }

  if (action.kind === "talk-to-npc") {
    return {
      type: "world-intent:talk-to-npc",
      cityId: appState.gameState.world.currentCityId,
      houseId:
        action.context.type === "house" ? action.context.houseId : null,
      summary: `玩家开始与${action.targetCharacterName}交谈。`,
    };
  }

  if (action.kind === "open-service-action") {
    return {
      type: "world-intent:open-service-action",
      cityId: appState.gameState.world.currentCityId,
      houseId: appState.gameState.world.currentHouseId,
      summary: `玩家尝试执行${action.label}。`,
    };
  }

  return {
    type: "world-intent:negotiate-story-node",
    cityId: appState.gameState.world.currentCityId,
    houseId: appState.gameState.world.currentHouseId,
    summary: `玩家尝试推进剧情：${action.label}。`,
  };
}

export function createWorldIntentActionCoordinator(
  dependencies: WorldIntentActionCoordinatorDependencies
): WorldIntentActionCoordinator {
  function selectCapabilitySnapshot(): WorldCapabilitySnapshot {
    return selectWorldIntentCapabilitySnapshotForApp({
      appState: dependencies.getAppState(),
      stageOutput: dependencies.getStageOutput(),
      cityDefinitions: dependencies.cityDefinitions,
      houseDefinitions: dependencies.houseDefinitions,
      houseAccessRefusalRules: dependencies.houseAccessRefusalRules,
      ...(dependencies.selectNegotiableStoryNodes == null
        ? {}
        : {
            selectNegotiableStoryNodes:
              dependencies.selectNegotiableStoryNodes,
          }),
    });
  }

  function commitFeedback(
    feedback: FeedbackDescriptor,
    options: {
      requestId?: string;
      result?: WorldAiIntentResponse;
      keepPending: boolean;
    }
  ): void {
    let appState = dependencies.getAppState();
    appState = updateWorldIntentState(appState, (state) => ({
      ...state,
      status: options.keepPending ? "awaiting-follow-up" : "idle",
      currentRequestId: null,
      pendingResolution:
        options.keepPending && options.requestId != null && options.result != null
          ? {
              requestId: options.requestId,
              result: options.result,
            }
          : null,
      lastError: null,
    }));
    appState = setWorldIntentFeedback(appState, feedback);
    dependencies.setAppState(appState);
    dependencies.renderApp();
  }

  function applyResolvedAction(action: ValidatedIntentAction): void {
    let appState = dependencies.getAppState();
    appState = clearResolvedWorldIntentState(appState, {
      clearDraft: true,
    });
    appState = {
      ...appState,
      locationDialogueState: null,
    };
    dependencies.setAppState(appState);

    dependencies.worldIntentRuntime.dispatch({
      type: "observe-event",
      event: buildObservedEvent(appState, action),
    });

    if (action.kind === "go-to-house") {
      dependencies.enterHouse(action.houseId);
      return;
    }

    if (action.kind === "leave-house") {
      dependencies.leaveHouse();
      return;
    }

    if (action.kind === "talk-to-npc") {
      dependencies.openNpcTalk({
        targetCharacterId: action.targetCharacterId,
        context: action.context,
      });
      return;
    }

    if (action.kind === "open-service-action") {
      dependencies.dispatchHouseAction(action.actionId);
      return;
    }

    dependencies.negotiateStoryNode?.({
      nodeId: action.nodeId,
      ...(action.targetCharacterId == null
        ? {}
        : { targetCharacterId: action.targetCharacterId }),
      approach: action.approach,
    });
  }

  function handleDraftInput(text: string): void {
    const nextAppState = updateWorldIntentState(
      dependencies.getAppState(),
      (state) => ({
        ...state,
        draftText: text,
        ...(state.status === "error"
          ? {
              status: "idle",
              lastError: null,
            }
          : {}),
      })
    );
    dependencies.setAppState(nextAppState);
    dependencies.renderApp();
  }

  function handleSubmit(): void {
    const appState = dependencies.getAppState();
    const draftText = resolveWorldIntentState(appState).draftText;
    dependencies.worldIntentRuntime.dispatch({
      type: "submit-text-intent",
      text: draftText,
    });
  }

  function handleClear(): void {
    dependencies.worldIntentRuntime.cancelActiveRequest();
    const nextAppState: AppState = {
      ...dependencies.getAppState(),
      locationDialogueState:
        dependencies.getAppState().locationDialogueState?.type ===
        "world-intent-feedback"
          ? null
          : dependencies.getAppState().locationDialogueState,
      worldIntentState: createInitialAppWorldIntentState(),
    };
    dependencies.setAppState(nextAppState);
    dependencies.renderApp();
  }

  function handleResolvedIntent(input: {
    requestId: string;
    result: WorldAiIntentResponse;
  }): void {
    const appState = dependencies.getAppState();
    const result = input.result;
    const capabilitySnapshot = selectCapabilitySnapshot();
    const validation = validateResolvedIntent({
      appState,
      stageOutput: dependencies.getStageOutput(),
      capabilitySnapshot,
      houseDefinitions: dependencies.houseDefinitions,
      houseAccessRefusalRules: dependencies.houseAccessRefusalRules,
      result,
      negotiateStoryNode: dependencies.negotiateStoryNode,
    });

    if (!validation.ok) {
      commitFeedback(validation.feedback, {
        keepPending: false,
      });
      return;
    }

    const shortNarration =
      "shortNarration" in result ? result.shortNarration : null;
    if (shortNarration != null && shortNarration.trim().length > 0) {
      commitFeedback(
        {
          speakerCharacterId: appState.gameState.player.characterId,
          text: shortNarration.trim(),
          advanceHintText: DEFAULT_FEEDBACK_HINT,
          intentStatus: "narration",
        },
        {
          requestId: input.requestId,
          result,
          keepPending: true,
        }
      );
      return;
    }

    applyResolvedAction(validation.action);
  }

  function handleLocationDialogueAdvance(): boolean {
    const appState = dependencies.getAppState();
    const locationDialogueState = appState.locationDialogueState;
    if (locationDialogueState?.type !== "world-intent-feedback") {
      return false;
    }

    const pendingResolution = resolveWorldIntentState(appState).pendingResolution;
    if (pendingResolution == null) {
      dependencies.setAppState({
        ...clearResolvedWorldIntentState(appState, {
          clearDraft: false,
        }),
        locationDialogueState: null,
      });
      dependencies.renderApp();
      return true;
    }

    const validation = validateResolvedIntent({
      appState,
      stageOutput: dependencies.getStageOutput(),
      capabilitySnapshot: selectCapabilitySnapshot(),
      houseDefinitions: dependencies.houseDefinitions,
      houseAccessRefusalRules: dependencies.houseAccessRefusalRules,
      result: pendingResolution.result,
      negotiateStoryNode: dependencies.negotiateStoryNode,
    });

    if (!validation.ok) {
      commitFeedback(validation.feedback, {
        keepPending: false,
      });
      return true;
    }

    applyResolvedAction(validation.action);
    return true;
  }

  return {
    selectCapabilitySnapshot,
    handleDraftInput,
    handleSubmit,
    handleClear,
    handleResolvedIntent,
    handleLocationDialogueAdvance,
  };
}
