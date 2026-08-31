import type { AppState } from "../../application/app-shell";
import {
  resolveAvailableHouseConversationRoute,
} from "../../application/house-conversation/select-house-conversation-capability-snapshot";
import {
  closeNpcInteraction,
  chooseNpcDefaultTalk,
} from "../../application/app-actions";
import {
  buildNpcAiDialogueProviderRequest,
} from "../../application/npc-interaction/npc-ai-dialogue-request-builder";
import {
  NPC_AI_DIALOGUE_SELECT_OPTION_ACTION_PREFIX,
  NPC_AI_DIALOGUE_REQUEST_ID_PREFIX,
  selectHouseNpcSpecialActions,
} from "../../application/npc-interaction/npc-interaction";
import type { HouseDefinition } from "../../domain/house";
import type {
  HouseConversationCapabilitySnapshot,
  HouseConversationRoute,
} from "../../domain/house-conversation";
import type {
  NpcAiDialogueDisplayPage,
  NpcAiDialogueMemoryEntry,
  NpcAiDialogueOverlayOption,
  NpcAiDialogueProvider,
  NpcAiDialogueProviderEvent,
  NpcAiDialogueSpecialActionMetadata,
  NpcAiDialogueStep,
  NpcAiDialogueTranscriptEntry,
  NpcAiDialogueRuntimeState,
} from "../../domain/npc-ai-dialogue";
import {
  createInitialNpcAiDialogueRuntimeState,
  resolveNpcAiDialogueOptionStance,
  splitNpcAiDialoguePages,
} from "../../domain/npc-ai-dialogue";
import type {
  NpcInteractionOptionViewModel,
  NpcInteractionSession,
} from "../../domain/npc-interaction";
import {
  builtinHouseModuleRegistry,
  type HouseModuleRegistry,
} from "../registry/house-module-registry";

export type NpcInteractionRuntimeDependencies = {
  getAppState(): AppState;
  setAppState(appState: AppState): void;
  renderApp(): void;
  houseDefinitionsById?: Record<string, HouseDefinition> | undefined;
  houseModuleRegistry?: HouseModuleRegistry | undefined;
  textEntriesById?: Record<string, string> | undefined;
  dispatchHouseAction?(actionId: string): void;
  selectHouseConversationCapabilitySnapshot?(input: {
    targetCharacterId: string | null;
  }): HouseConversationCapabilitySnapshot | null;
  dispatchHouseConversationRoute?(route: HouseConversationRoute): boolean;
  npcAiDialogueProvider?: NpcAiDialogueProvider | undefined;
};

export type NpcInteractionRuntimeRequest =
  | {
      type: "start-talk";
    }
  | {
      type: "select-option";
      optionId: string;
    }
  | {
      type: "advance-page";
    }
  | {
      type: "open-custom-input";
    }
  | {
      type: "cancel-custom-input";
    }
  | {
      type: "update-custom-input";
      value: string;
    }
  | {
      type: "submit-custom";
    }
  | {
      type: "close";
    }
  | {
      type: "provider-event";
      requestId: string;
      event: NpcAiDialogueProviderEvent;
    };

export type NpcInteractionRuntimeBridge = {
  dispatch(request: NpcInteractionRuntimeRequest): void;
  closeActiveRequest(): void;
};

function ensureNpcDialogueRuntimeState(
  appState: AppState
): AppState {
  if (appState.gameState.runtime.npcDialogue != null) {
    return appState;
  }

  return {
    ...appState,
    gameState: {
      ...appState.gameState,
      runtime: {
        ...appState.gameState.runtime,
        npcDialogue: createInitialNpcAiDialogueRuntimeState(),
      },
    },
  };
}

function getNpcDialogueRuntimeState(
  appState: AppState
): NpcAiDialogueRuntimeState {
  return (
    appState.gameState.runtime.npcDialogue ??
    createInitialNpcAiDialogueRuntimeState()
  );
}

function getActiveDialogueSession(
  session: NpcInteractionSession
): Extract<NpcInteractionSession, { mode: "ai-dialogue" }> | null {
  if (session == null || session.mode !== "ai-dialogue") {
    return null;
  }

  return session;
}

function resolvePlaceInfo(
  input: {
    session: NonNullable<NpcInteractionSession>;
    houseDefinitionsById?: Record<string, HouseDefinition> | undefined;
  }
): {
  contextType: "house" | "city" | "scene";
  houseId?: string;
  placeName?: string;
} {
  if (input.session.context.type === "house") {
    const houseId = input.session.context.houseId;
    return {
      contextType: "house",
      houseId,
      placeName: input.houseDefinitionsById?.[houseId]?.name ?? houseId,
    };
  }

  if (input.session.context.type === "city") {
    return {
      contextType: "city",
      placeName: input.session.context.locationId ?? input.session.context.cityId,
    };
  }

  return {
    contextType: "scene",
    placeName: input.session.context.sceneId,
  };
}

function findCharacterName(appState: AppState, characterId: string): string {
  return (
    appState.characterDefinitions.find(
      (characterDefinition) => characterDefinition.id === characterId
    )?.name ?? characterId
  );
}

function appendMemoryEntries(
  appState: AppState,
  targetCharacterId: string,
  requestId: string,
  entries: NpcAiDialogueMemoryEntry[]
): AppState {
  if (entries.length === 0) {
    return appState;
  }

  const nextAppState = ensureNpcDialogueRuntimeState(appState);
  const runtimeState = getNpcDialogueRuntimeState(nextAppState);
  const currentRecord =
    runtimeState.memoriesByCharacterId[targetCharacterId] ?? {
      characterId: targetCharacterId,
      entries: [],
      updatedAtRequestId: null,
    };

  return {
    ...nextAppState,
    gameState: {
      ...nextAppState.gameState,
      runtime: {
        ...nextAppState.gameState.runtime,
        npcDialogue: {
          ...runtimeState,
          memoriesByCharacterId: {
            ...runtimeState.memoriesByCharacterId,
            [targetCharacterId]: {
              ...currentRecord,
              entries: [...currentRecord.entries, ...entries],
              updatedAtRequestId: requestId,
            },
          },
        },
      },
    },
  };
}

function createTranscriptEntryId(
  requestId: string,
  type: "narration" | "dialogue",
  index: number
): string {
  return `${requestId}:${type}:${index}`;
}

function buildMemoryContext(
  session: NonNullable<NpcInteractionSession>,
  placeName?: string,
  houseId?: string
) {
  return {
    contextType: session.context.type,
    ...(houseId == null ? {} : { houseId }),
    ...(placeName == null ? {} : { placeName }),
  };
}

function selectCurrentHouseViewModel(input: {
  appState: AppState;
  session: Extract<NpcInteractionSession, { mode: "ai-dialogue" }>;
  dependencies: NpcInteractionRuntimeDependencies;
}) {
  if (input.session.context.type !== "house") {
    return null;
  }

  const houseDefinition =
    input.dependencies.houseDefinitionsById?.[input.session.context.houseId];
  if (houseDefinition?.moduleId == null) {
    return null;
  }

  const houseModuleRegistry =
    input.dependencies.houseModuleRegistry ?? builtinHouseModuleRegistry;
  const houseModule = houseModuleRegistry.getModule(houseDefinition.moduleId);
  if (houseModule == null) {
    return null;
  }

  return houseModule.selectViewModel({
    gameState: input.appState.gameState,
    characterDefinitions: input.appState.characterDefinitions,
    houseDefinition,
    playerCharacterId: input.appState.gameState.player.characterId,
    sessionState: input.appState.gameState.ui.houseSession?.state ?? null,
    ...(input.dependencies.textEntriesById == null
      ? {}
      : { textEntriesById: input.dependencies.textEntriesById }),
  });
}

function selectCurrentNpcSpecialActions(input: {
  appState: AppState;
  session: Extract<NpcInteractionSession, { mode: "ai-dialogue" }>;
  dependencies: NpcInteractionRuntimeDependencies;
}): NpcInteractionOptionViewModel[] {
  const viewModel = selectCurrentHouseViewModel(input);
  if (viewModel == null) {
    return [];
  }

  return selectHouseNpcSpecialActions({
    actors: viewModel.standbyRoster,
    targetCharacterId: input.session.targetCharacterId,
  }).filter((action) => action.disabled !== true);
}

function summarizeCurrentHouseStateForNpcDialogue(input: {
  appState: AppState;
  session: Extract<NpcInteractionSession, { mode: "ai-dialogue" }>;
  dependencies: NpcInteractionRuntimeDependencies;
}): string | null {
  let viewModel = null;
  try {
    viewModel = selectCurrentHouseViewModel(input);
  } catch {
    return null;
  }
  if (viewModel == null) {
    return null;
  }

  const summaryLines: string[] = [];
  const sceneSubtitle = viewModel.sceneSubtitle?.trim() ?? "";
  if (sceneSubtitle.length > 0) {
    summaryLines.push(`场景副题：${sceneSubtitle}`);
  }

  const actionContainerTitle = viewModel.actionContainer?.title?.trim() ?? "";
  if (actionContainerTitle.length > 0) {
    summaryLines.push(`当前面前事务：${actionContainerTitle}`);
  }

  const statusCard = viewModel.statusCard;
  if (statusCard != null) {
    const statusHeader = [
      statusCard.eyebrow,
      statusCard.title,
      statusCard.subtitle,
    ]
      .map((segment) => segment?.trim() ?? "")
      .filter((segment) => segment.length > 0)
      .join(" / ");
    if (statusHeader.length > 0) {
      summaryLines.push(`状态抬头：${statusHeader}`);
    }

    summaryLines.push(
      ...statusCard.metrics
        .map((metric) => {
          const label = metric.label.trim();
          const value = metric.value.trim();
          return label.length > 0 && value.length > 0
            ? `${label}：${value}`
            : null;
        })
        .filter((line): line is string => line != null)
    );
  }

  return summaryLines.length === 0 ? null : summaryLines.join("\n");
}

function toSpecialActionMetadata(
  actions: NpcInteractionOptionViewModel[]
): NpcAiDialogueSpecialActionMetadata[] {
  return actions.map((action) => ({
    id: action.id,
    label: action.label,
  }));
}

function selectHouseConversationCapabilitySnapshot(input: {
  session: Extract<NpcInteractionSession, { mode: "ai-dialogue" }>;
  dependencies: NpcInteractionRuntimeDependencies;
}): HouseConversationCapabilitySnapshot | null {
  return (
    input.dependencies.selectHouseConversationCapabilitySnapshot?.({
      targetCharacterId: input.session.targetCharacterId,
    }) ?? null
  );
}

function resolvePendingHouseConversationRoute(
  session: Extract<NpcInteractionSession, { mode: "ai-dialogue" }>
): HouseConversationRoute | null {
  if (session.dialogue.pendingRoute != null) {
    return session.dialogue.pendingRoute;
  }

  const legacyActionId = session.dialogue.pendingSpecialActionId?.trim() ?? "";
  if (legacyActionId.length === 0) {
    return null;
  }

  return {
    kind: "open-house-action",
    actionId: legacyActionId,
  };
}

function normalizeOptions(
  options: Array<{
    id: string;
    label: string;
    actionText: string;
    recommended?: boolean;
    kind?: string;
  }>
): NpcAiDialogueOverlayOption[] {
  return options.slice(0, 3).map((option, index) => ({
    id: option.id,
    label: option.label,
    actionText: option.actionText.trim().length === 0 ? option.label : option.actionText,
    actionId: `${NPC_AI_DIALOGUE_SELECT_OPTION_ACTION_PREFIX}${option.id}`,
    stance: resolveNpcAiDialogueOptionStance(
      option.kind == null
        ? { index }
        : {
            kind: option.kind,
            index,
          }
    ),
    ...(option.recommended == null ? {} : { recommended: option.recommended }),
    ...(option.kind == null ? {} : { kind: option.kind }),
  }));
}

function areChoiceOptionsEqual(
  left: {
    id: string;
    label: string;
    actionText: string;
    recommended?: boolean;
    kind?: string;
  },
  right: {
    id: string;
    label: string;
    actionText: string;
    recommended?: boolean;
    kind?: string;
  }
): boolean {
  return (
    left.id === right.id &&
    left.label === right.label &&
    left.actionText === right.actionText &&
    left.recommended === right.recommended &&
    left.kind === right.kind
  );
}

function areNpcAiDialogueStepsEqual(
  left: NpcAiDialogueStep,
  right: NpcAiDialogueStep
): boolean {
  if (left.type !== right.type) {
    return false;
  }

  if (left.type === "narration" && right.type === "narration") {
    return left.text === right.text;
  }

  if (left.type === "dialogue" && right.type === "dialogue") {
    return (
      left.speakerId === right.speakerId &&
      left.speakerName === right.speakerName &&
      left.text === right.text
    );
  }

  if (left.type === "choice" && right.type === "choice") {
    if (left.prompt !== right.prompt || left.options.length !== right.options.length) {
      return false;
    }

    return left.options.every((option, index) => {
      const rightOption = right.options[index];
      return rightOption != null && areChoiceOptionsEqual(option, rightOption);
    });
  }

  if (left.type === "action" && right.type === "action") {
    return left.actionId === right.actionId;
  }

  if (left.type === "route" && right.type === "route") {
    return JSON.stringify(left.route) === JSON.stringify(right.route);
  }

  return false;
}

function updateDialogueSession(
  appState: AppState,
  updater: (
    session: Extract<NpcInteractionSession, { mode: "ai-dialogue" }>
  ) => Extract<NpcInteractionSession, { mode: "ai-dialogue" }>
): AppState {
  const activeSession = getActiveDialogueSession(
    appState.gameState.ui.npcInteractionSession
  );
  if (activeSession == null) {
    return appState;
  }

  return {
    ...appState,
    gameState: {
      ...appState.gameState,
      ui: {
        ...appState.gameState.ui,
        npcInteractionSession: updater(activeSession),
      },
    },
  };
}

function createDisplayPagesForStep(input: {
  requestId: string;
  step: Extract<NpcAiDialogueStep, { type: "narration" | "dialogue" }>;
  stepIndex: number;
}): NpcAiDialogueDisplayPage[] {
  return splitNpcAiDialoguePages(input.step.text).map((text, pageIndex) => {
    if (input.step.type === "narration") {
      return {
        id: `${input.requestId}:page:narration:${input.stepIndex}:${pageIndex}`,
        type: "narration",
        text,
      };
    }

    return {
      id: `${input.requestId}:page:dialogue:${input.stepIndex}:${pageIndex}`,
      type: "dialogue",
      text,
      speakerId: input.step.speakerId,
      speakerName: input.step.speakerName,
    };
  });
}

function createPlayerTranscriptEntry(
  appState: AppState,
  text: string
): NpcAiDialogueTranscriptEntry {
  const playerCharacterId = appState.gameState.player.characterId;
  return {
    id: `player:${playerCharacterId}:${text}`,
    type: "dialogue",
    speakerId: playerCharacterId,
    speakerName: findCharacterName(appState, playerCharacterId),
    text,
  };
}

function createPlayerMemoryEntry(input: {
  appState: AppState;
  session: NonNullable<NpcInteractionSession>;
  requestId: string;
  text: string;
  placeName?: string;
  houseId?: string;
}): NpcAiDialogueMemoryEntry {
  return {
    id: `${input.requestId}:player`,
    requestId: input.requestId,
    ...buildMemoryContext(input.session, input.placeName, input.houseId),
    speaker: "player",
    speakerId: input.appState.gameState.player.characterId,
    speakerName: findCharacterName(
      input.appState,
      input.appState.gameState.player.characterId
    ),
    text: input.text,
  };
}

function appendPlayerTurnToDialogueAndMemory(input: {
  appState: AppState;
  session: Extract<NpcInteractionSession, { mode: "ai-dialogue" }>;
  text: string;
  houseDefinitionsById?: Record<string, HouseDefinition> | undefined;
}): AppState {
  const placeInfo = resolvePlaceInfo({
    session: input.session,
    houseDefinitionsById: input.houseDefinitionsById,
  });
  const requestId =
    input.session.dialogue.currentRequestId ??
    createNextRequestId(input.session.dialogue.requestSequence + 1);

  let nextAppState = updateDialogueSession(input.appState, (session) => ({
    ...session,
    dialogue: {
      ...session.dialogue,
      transcript: [
        ...session.dialogue.transcript,
        createPlayerTranscriptEntry(input.appState, input.text),
      ],
    },
  }));
  nextAppState = appendMemoryEntries(
    nextAppState,
    input.session.targetCharacterId,
    requestId,
    [
      createPlayerMemoryEntry({
        appState: input.appState,
        session: input.session,
        requestId,
        text: input.text,
        ...(placeInfo.placeName == null ? {} : { placeName: placeInfo.placeName }),
        ...(placeInfo.houseId == null ? {} : { houseId: placeInfo.houseId }),
      }),
    ]
  );

  return nextAppState;
}

function applyProviderSteps(
  appState: AppState,
  requestId: string,
  steps: NpcAiDialogueStep[]
): AppState {
  const activeSession = getActiveDialogueSession(
    appState.gameState.ui.npcInteractionSession
  );
  if (activeSession == null) {
    return appState;
  }

  const placeInfo = resolvePlaceInfo({
    session: activeSession,
  });
  let transcript = [...activeSession.dialogue.transcript];
  let displayPages = [...activeSession.dialogue.displayPages];
  let options = [...activeSession.dialogue.options];
  let pendingSpecialActionId = activeSession.dialogue.pendingSpecialActionId;
  let pendingRoute = activeSession.dialogue.pendingRoute;
  const memoryEntries: NpcAiDialogueMemoryEntry[] = [];

  steps.forEach((step, index) => {
    if (step.type === "narration") {
      transcript.push({
        id: createTranscriptEntryId(requestId, "narration", index),
        type: "narration",
        text: step.text,
      });
      memoryEntries.push({
        id: `${requestId}:memory:narration:${index}`,
        requestId,
        ...buildMemoryContext(activeSession, placeInfo.placeName, placeInfo.houseId),
        speaker: "narration",
        text: step.text,
      });
      displayPages.push(
        ...createDisplayPagesForStep({
          requestId,
          step,
          stepIndex: index,
        })
      );
      return;
    }

    if (step.type === "dialogue") {
      transcript.push({
        id: createTranscriptEntryId(requestId, "dialogue", index),
        type: "dialogue",
        speakerId: step.speakerId,
        speakerName: step.speakerName,
        text: step.text,
      });
      memoryEntries.push({
        id: `${requestId}:memory:dialogue:${index}`,
        requestId,
        ...buildMemoryContext(activeSession, placeInfo.placeName, placeInfo.houseId),
        speaker: "npc",
        speakerId: step.speakerId,
        speakerName: step.speakerName,
        text: step.text,
      });
      displayPages.push(
        ...createDisplayPagesForStep({
          requestId,
          step,
          stepIndex: index,
        })
      );
      return;
    }

    if (step.type === "action") {
      pendingSpecialActionId = step.actionId;
      pendingRoute = {
        kind: "open-house-action",
        actionId: step.actionId,
      };
      return;
    }

    if (step.type === "route") {
      pendingRoute = step.route;
      pendingSpecialActionId =
        step.route.kind === "open-house-action" ? step.route.actionId : null;
      return;
    }

    options = normalizeOptions(step.options);
  });

  let nextAppState = updateDialogueSession(appState, (session) => ({
    ...session,
    dialogue: {
      ...session.dialogue,
      transcript,
      displayPages,
      options,
      pendingSpecialActionId,
      pendingRoute,
    },
  }));
  nextAppState = appendMemoryEntries(
    nextAppState,
    activeSession.targetCharacterId,
    requestId,
    memoryEntries
  );
  return nextAppState;
}

function createNextRequestId(sequence: number): string {
  return `${NPC_AI_DIALOGUE_REQUEST_ID_PREFIX}${sequence}`;
}

export function createNpcInteractionRuntimeBridge(
  dependencies: NpcInteractionRuntimeDependencies
): NpcInteractionRuntimeBridge {
  let activeRequestId: string | null = null;
  const streamedStepsByRequestId = new Map<string, NpcAiDialogueStep[]>();

  function rememberStreamedStep(
    requestId: string,
    step: NpcAiDialogueStep
  ): void {
    const streamedSteps = streamedStepsByRequestId.get(requestId);
    if (streamedSteps == null) {
      return;
    }

    streamedSteps.push(step);
  }

  function getUnappliedCompleteSteps(
    requestId: string,
    allSteps: NpcAiDialogueStep[]
  ): NpcAiDialogueStep[] {
    const streamedSteps = streamedStepsByRequestId.get(requestId);
    if (streamedSteps == null || streamedSteps.length === 0) {
      return allSteps;
    }

    if (streamedSteps.length > allSteps.length) {
      return allSteps;
    }

    for (let index = 0; index < streamedSteps.length; index += 1) {
      const streamedStep = streamedSteps[index];
      const completeStep = allSteps[index];
      if (
        streamedStep == null ||
        completeStep == null ||
        !areNpcAiDialogueStepsEqual(streamedStep, completeStep)
      ) {
        return allSteps;
      }
    }

    return allSteps.slice(streamedSteps.length);
  }

  function closeActiveRequest(): void {
    if (activeRequestId == null) {
      return;
    }

    streamedStepsByRequestId.delete(activeRequestId);
    void dependencies.npcAiDialogueProvider?.cancel?.(activeRequestId);
    activeRequestId = null;
  }

  function isCurrentRequest(requestId: string): boolean {
    const activeSession = getActiveDialogueSession(
      dependencies.getAppState().gameState.ui.npcInteractionSession
    );
    return (
      activeRequestId === requestId &&
      activeSession != null &&
      activeSession.dialogue.currentRequestId === requestId
    );
  }

  function startProviderRequest(input: {
    appState: AppState;
    requestId: string;
    inputType: "start_talk" | "select_option" | "custom_input";
    selectedOptionId?: string;
    selectedOptionLabel?: string;
    customInputText?: string;
  }): void {
    const activeSession = getActiveDialogueSession(
      input.appState.gameState.ui.npcInteractionSession
    );
    if (activeSession == null) {
      return;
    }

    const placeInfo = resolvePlaceInfo({
      session: activeSession,
      houseDefinitionsById: dependencies.houseDefinitionsById,
    });
    const houseStateSummary = summarizeCurrentHouseStateForNpcDialogue({
      appState: input.appState,
      session: activeSession,
      dependencies,
    });
    const houseConversationCapabilitySnapshot =
      selectHouseConversationCapabilitySnapshot({
        session: activeSession,
        dependencies,
      });
    const availableSpecialActions =
      houseConversationCapabilitySnapshot != null
        ? houseConversationCapabilitySnapshot.houseActions.map((action) => ({
            id: action.actionId,
            label: action.label,
          }))
        : dependencies.dispatchHouseAction == null
          ? []
          : toSpecialActionMetadata(
              selectCurrentNpcSpecialActions({
                appState: input.appState,
                session: activeSession,
                dependencies,
              })
            );
    const memoryState = getNpcDialogueRuntimeState(input.appState);
    const memoryEntries =
      memoryState.memoriesByCharacterId[activeSession.targetCharacterId]?.entries ?? [];
    const reactionMemoryEntries =
      memoryState.reactionMemoriesByCharacterId[activeSession.targetCharacterId]
        ?.entries ?? [];
    const recentObservedEvents =
      input.appState.gameState.runtime.worldIntent?.recentEvents ?? [];
    const providerRequest = buildNpcAiDialogueProviderRequest({
      requestId: input.requestId,
      contextType: placeInfo.contextType,
      npcId: activeSession.targetCharacterId,
      npcName: findCharacterName(input.appState, activeSession.targetCharacterId),
      playerName: findCharacterName(
        input.appState,
        input.appState.gameState.player.characterId
      ),
      inputType: input.inputType,
      transcript: activeSession.dialogue.transcript,
      memoryEntries,
      reactionMemoryEntries,
      recentObservedEvents,
      ...(placeInfo.placeName == null ? {} : { placeName: placeInfo.placeName }),
      ...(placeInfo.houseId == null ? {} : { houseId: placeInfo.houseId }),
      ...(input.selectedOptionId == null
        ? {}
        : { selectedOptionId: input.selectedOptionId }),
      ...(input.selectedOptionLabel == null
        ? {}
        : { selectedOptionLabel: input.selectedOptionLabel }),
      ...(input.customInputText == null
        ? {}
        : { customInputText: input.customInputText }),
      ...(availableSpecialActions.length === 0
        ? {}
        : { availableSpecialActions }),
      ...(houseStateSummary == null ? {} : { houseStateSummary }),
      ...(houseConversationCapabilitySnapshot == null
        ? {}
        : { houseConversationCapabilitySnapshot }),
    });

    activeRequestId = input.requestId;
    streamedStepsByRequestId.set(input.requestId, []);
    const provider = dependencies.npcAiDialogueProvider;
    if (provider == null) {
      dispatch({
        type: "provider-event",
        requestId: input.requestId,
        event: {
          type: "error",
          requestId: input.requestId,
          message: "NPC AI provider unavailable.",
        },
      });
      return;
    }

    void Promise.resolve(
      provider.stream(providerRequest, (event) => {
        if (event.requestId !== input.requestId) {
          return;
        }

        dispatch({
          type: "provider-event",
          requestId: input.requestId,
          event,
        });
      })
    ).catch((error: unknown) => {
      dispatch({
        type: "provider-event",
        requestId: input.requestId,
        event: {
          type: "error",
          requestId: input.requestId,
          message:
            error instanceof Error
              ? error.message
              : "NPC AI dialogue stream failed.",
        },
      });
    });
  }

  function beginStreamingTurn(input: {
    appState: AppState;
    inputType: "start_talk" | "select_option" | "custom_input";
    selectedOptionId?: string;
    selectedOptionLabel?: string;
    customInputText?: string;
  }): void {
    const activeSession = getActiveDialogueSession(
      input.appState.gameState.ui.npcInteractionSession
    );
    if (activeSession == null) {
      return;
    }

    closeActiveRequest();
    const nextSequence = activeSession.dialogue.requestSequence + 1;
    const requestId = createNextRequestId(nextSequence);
    let nextAppState = updateDialogueSession(input.appState, (session) => ({
      ...session,
      dialogue: {
        ...session.dialogue,
        requestSequence: nextSequence,
        currentRequestId: requestId,
        status: "streaming",
        displayPages: [],
        currentDisplayPageIndex: 0,
        options: [],
        pendingSpecialActionId: null,
        pendingRoute: null,
        statusNotice: "正在组织下一句回话……",
        errorNotice: null,
        customInputOpen: false,
        ...(input.inputType === "custom_input" ? { customInputValue: "" } : {}),
      },
    }));

    dependencies.setAppState(nextAppState);
    dependencies.renderApp();
    nextAppState = dependencies.getAppState();
    startProviderRequest({
      ...input,
      appState: nextAppState,
      requestId,
    });
  }

  function dispatchPendingHouseConversationRoute(input: {
    appState: AppState;
    session: Extract<NpcInteractionSession, { mode: "ai-dialogue" }>;
  }): void {
    const pendingRoute = resolvePendingHouseConversationRoute(input.session);
    if (pendingRoute == null) {
      return;
    }

    const houseConversationCapabilitySnapshot =
      selectHouseConversationCapabilitySnapshot({
        session: input.session,
        dependencies,
      });
    const validatedRoute =
      houseConversationCapabilitySnapshot == null
        ? pendingRoute.kind === "open-house-action"
          ? pendingRoute
          : null
        : resolveAvailableHouseConversationRoute({
            snapshot: houseConversationCapabilitySnapshot,
            route: pendingRoute,
          });
    if (validatedRoute == null) {
      dependencies.setAppState(
        updateDialogueSession(input.appState, (session) => ({
          ...session,
          dialogue: {
            ...session.dialogue,
            status: "error",
            statusNotice: null,
            errorNotice: "该跳转当前不可用，未执行跳转。",
          },
        }))
      );
      dependencies.renderApp();
      return;
    }

    if (validatedRoute.kind === "open-house-action") {
      if (dependencies.dispatchHouseAction == null) {
        dependencies.setAppState(
          updateDialogueSession(input.appState, (session) => ({
            ...session,
            dialogue: {
              ...session.dialogue,
              status: "error",
              statusNotice: null,
              errorNotice: "当前无法跳转到该功能。",
            },
          }))
        );
        dependencies.renderApp();
        return;
      }

      const matchedAction =
        houseConversationCapabilitySnapshot == null
          ? selectCurrentNpcSpecialActions({
              appState: input.appState,
              session: input.session,
              dependencies,
            }).find((action) => action.id === validatedRoute.actionId) ?? null
          : houseConversationCapabilitySnapshot.houseActions.find(
              (action) => action.actionId === validatedRoute.actionId
            ) ?? null;
      if (matchedAction == null) {
        dependencies.setAppState(
          updateDialogueSession(input.appState, (session) => ({
            ...session,
            dialogue: {
              ...session.dialogue,
              status: "error",
              statusNotice: null,
              errorNotice: "该功能当前不可用，未执行跳转。",
            },
          }))
        );
        dependencies.renderApp();
        return;
      }

      const nextAppState = closeNpcInteraction(input.appState);
      dependencies.setAppState(nextAppState);
      dependencies.dispatchHouseAction(
        "actionId" in matchedAction ? matchedAction.actionId : matchedAction.id
      );
      return;
    }

    if (dependencies.dispatchHouseConversationRoute == null) {
      dependencies.setAppState(
        updateDialogueSession(input.appState, (session) => ({
          ...session,
          dialogue: {
            ...session.dialogue,
            status: "error",
            statusNotice: null,
            errorNotice: "当前无法执行该对话跳转。",
          },
        }))
      );
      dependencies.renderApp();
      return;
    }

    const handled = dependencies.dispatchHouseConversationRoute(validatedRoute);
    if (!handled) {
      dependencies.setAppState(
        updateDialogueSession(input.appState, (session) => ({
          ...session,
          dialogue: {
            ...session.dialogue,
            status: "error",
            statusNotice: null,
            errorNotice: "该跳转当前不可用，未执行跳转。",
          },
        }))
      );
      dependencies.renderApp();
      return;
    }

    const latestAppState = dependencies.getAppState();
    if (
      latestAppState.gameState.ui.npcInteractionSession ===
      input.appState.gameState.ui.npcInteractionSession
    ) {
      dependencies.setAppState(closeNpcInteraction(latestAppState));
    }
  }

  function dispatch(request: NpcInteractionRuntimeRequest): void {
    if (request.type === "close") {
      closeActiveRequest();
      dependencies.setAppState(closeNpcInteraction(dependencies.getAppState()));
      dependencies.renderApp();
      return;
    }

    if (request.type === "update-custom-input") {
      const appState = updateDialogueSession(dependencies.getAppState(), (session) => ({
        ...session,
        dialogue: {
          ...session.dialogue,
          customInputValue: request.value,
        },
      }));
      dependencies.setAppState(appState);
      return;
    }

    if (request.type === "advance-page") {
      const appState = dependencies.getAppState();
      const activeSession = getActiveDialogueSession(
        appState.gameState.ui.npcInteractionSession
      );
      if (activeSession == null) {
        return;
      }

      if (activeSession.dialogue.status === "awaiting-action-jump") {
        dispatchPendingHouseConversationRoute({
          appState,
          session: activeSession,
        });
        return;
      }

      if (activeSession.dialogue.status !== "awaiting-advance") {
        return;
      }

      const lastPageIndex = activeSession.dialogue.displayPages.length - 1;
      if (lastPageIndex < 0) {
        return;
      }

      const nextPageIndex = Math.min(
        activeSession.dialogue.currentDisplayPageIndex + 1,
        lastPageIndex
      );
      const hasPendingRoute =
        resolvePendingHouseConversationRoute(activeSession) != null;
      const nextStatus =
        nextPageIndex >= lastPageIndex
          ? hasPendingRoute
            ? "awaiting-action-jump"
            : activeSession.dialogue.options.length === 3
              ? "awaiting-choice"
              : "awaiting-advance"
          : "awaiting-advance";
      dependencies.setAppState(
        updateDialogueSession(appState, (session) => ({
          ...session,
          dialogue: {
            ...session.dialogue,
            currentDisplayPageIndex: nextPageIndex,
            status: nextStatus,
            statusNotice: null,
            errorNotice: null,
          },
        }))
      );
      dependencies.renderApp();
      return;
    }

    if (request.type === "open-custom-input") {
      const appState = dependencies.getAppState();
      const activeSession = getActiveDialogueSession(
        appState.gameState.ui.npcInteractionSession
      );
      if (
        activeSession == null ||
        activeSession.dialogue.status !== "awaiting-choice"
      ) {
        return;
      }

      dependencies.setAppState(
        updateDialogueSession(appState, (session) => ({
          ...session,
          dialogue: {
            ...session.dialogue,
            customInputOpen: true,
            statusNotice: null,
          },
        }))
      );
      dependencies.renderApp();
      return;
    }

    if (request.type === "cancel-custom-input") {
      const appState = dependencies.getAppState();
      const activeSession = getActiveDialogueSession(
        appState.gameState.ui.npcInteractionSession
      );
      if (activeSession == null) {
        return;
      }

      dependencies.setAppState(
        updateDialogueSession(appState, (session) => ({
          ...session,
          dialogue: {
            ...session.dialogue,
            customInputOpen: false,
            statusNotice: null,
          },
        }))
      );
      dependencies.renderApp();
      return;
    }

    if (request.type === "start-talk") {
      const initialAppState = dependencies.getAppState();
      const session = initialAppState.gameState.ui.npcInteractionSession;
      if (session == null) {
        return;
      }

      const nextAppState =
        session.mode === "ai-dialogue"
          ? initialAppState
          : chooseNpcDefaultTalk(initialAppState, session.targetCharacterId);
      dependencies.setAppState(nextAppState);
      beginStreamingTurn({
        appState: dependencies.getAppState(),
        inputType: "start_talk",
      });
      return;
    }

    if (request.type === "select-option") {
      const appState = dependencies.getAppState();
      const activeSession = getActiveDialogueSession(
        appState.gameState.ui.npcInteractionSession
      );
      if (activeSession == null) {
        return;
      }

      if (
        activeSession.dialogue.status !== "awaiting-choice" ||
        activeSession.dialogue.customInputOpen === true
      ) {
        return;
      }

      const selectedOption =
        activeSession.dialogue.options.find(
          (option) => option.id === request.optionId
        ) ?? null;
      if (selectedOption == null) {
        return;
      }

      const nextAppState = appendPlayerTurnToDialogueAndMemory({
        appState,
        session: activeSession,
        text: selectedOption.actionText,
        houseDefinitionsById: dependencies.houseDefinitionsById,
      });
      dependencies.setAppState(nextAppState);
      beginStreamingTurn({
        appState: dependencies.getAppState(),
        inputType: "select_option",
        selectedOptionId: selectedOption.id,
        selectedOptionLabel: selectedOption.actionText,
      });
      return;
    }

    if (request.type === "submit-custom") {
      const appState = dependencies.getAppState();
      const activeSession = getActiveDialogueSession(
        appState.gameState.ui.npcInteractionSession
      );
      if (activeSession == null) {
        return;
      }

      if (
        activeSession.dialogue.status !== "awaiting-choice" ||
        activeSession.dialogue.customInputOpen !== true
      ) {
        return;
      }

      const customInputText = activeSession.dialogue.customInputValue.trim();
      if (customInputText.length === 0) {
        dependencies.setAppState(
          updateDialogueSession(appState, (session) => ({
            ...session,
            dialogue: {
              ...session.dialogue,
              statusNotice: "请先输入你想说的话。",
            },
          }))
        );
        dependencies.renderApp();
        return;
      }

      const nextAppState = appendPlayerTurnToDialogueAndMemory({
        appState,
        session: activeSession,
        text: customInputText,
        houseDefinitionsById: dependencies.houseDefinitionsById,
      });
      dependencies.setAppState(nextAppState);
      beginStreamingTurn({
        appState: dependencies.getAppState(),
        inputType: "custom_input",
        customInputText,
      });
      return;
    }

    if (request.type !== "provider-event") {
      return;
    }

    if (!isCurrentRequest(request.requestId)) {
      return;
    }

    const providerEvent = request.event;

    if (providerEvent.type === "start") {
      const appState = updateDialogueSession(
        dependencies.getAppState(),
        (session) => ({
          ...session,
          dialogue: {
            ...session.dialogue,
            status: "streaming",
            statusNotice: "正在组织下一句回话……",
            errorNotice: null,
            customInputOpen: false,
          },
        })
      );
      dependencies.setAppState(appState);
      dependencies.renderApp();
      return;
    }

    if (providerEvent.type === "error") {
      activeRequestId = null;
      streamedStepsByRequestId.delete(request.requestId);
      const appState = updateDialogueSession(
        dependencies.getAppState(),
        (session) => ({
          ...session,
          dialogue: {
            ...session.dialogue,
            currentRequestId: null,
            status: "error",
            statusNotice: null,
            errorNotice: providerEvent.message,
            customInputOpen: false,
          },
        })
      );
      dependencies.setAppState(appState);
      dependencies.renderApp();
      return;
    }

    if (providerEvent.type === "step") {
      rememberStreamedStep(request.requestId, providerEvent.step);
    }

    const steps =
      providerEvent.type === "complete"
        ? getUnappliedCompleteSteps(request.requestId, providerEvent.allSteps)
        : [providerEvent.step];
    let nextAppState = applyProviderSteps(
      dependencies.getAppState(),
      request.requestId,
      steps
    );

    if (providerEvent.type === "complete") {
      activeRequestId = null;
      streamedStepsByRequestId.delete(request.requestId);
      nextAppState = updateDialogueSession(nextAppState, (session) => {
        const hasThreeOptions = session.dialogue.options.length === 3;
        const hasPendingRoute =
          resolvePendingHouseConversationRoute(session) != null;
        const hasMultiplePages = session.dialogue.displayPages.length > 1;
        return {
          ...session,
          dialogue: {
            ...session.dialogue,
            currentRequestId: null,
            status: hasPendingRoute
              ? hasMultiplePages
                ? "awaiting-advance"
                : "awaiting-action-jump"
              : hasThreeOptions
                ? hasMultiplePages
                  ? "awaiting-advance"
                : "awaiting-choice"
                : "error",
            statusNotice: null,
            errorNotice:
              hasPendingRoute || hasThreeOptions
                ? null
                : "AI 返回的接话选项数量不正确。",
            customInputOpen: false,
          },
        };
      });
    }

    dependencies.setAppState(nextAppState);
    dependencies.renderApp();
  }

  return {
    dispatch,
    closeActiveRequest,
  };
}
