import type { AppState } from "../../application/app-shell";
import { createInitialAppWorldIntentState } from "../../application/app-shell";
import {
  buildWorldIntentRequest,
} from "../../application/world-intent/world-intent-request-builder";
import {
  createLocalPlaceholderWorldIntentProvider,
} from "../../application/world-intent/local-placeholder-world-intent-provider";
import type {
  WorldAiContextRuntimeState,
  WorldAiIntentResponse,
  WorldCapabilitySnapshot,
  WorldObservedEventRecord,
  WorldIntentProvider,
  WorldObservedEvent,
} from "../../domain/world-intent";
import {
  createInitialWorldIntentRuntimeState,
} from "../../domain/world-intent";
import { createInitialNpcAiDialogueRuntimeState } from "../../domain/npc-ai-dialogue";

export type WorldIntentRuntimeDependencies = {
  getAppState(): AppState;
  setAppState(appState: AppState): void;
  renderApp(): void;
  selectCapabilitySnapshot(): WorldCapabilitySnapshot;
  worldIntentProvider?: WorldIntentProvider | undefined;
  onResolution?:
    | ((
        input: {
          requestId: string;
          result: WorldAiIntentResponse;
        }
      ) => void)
    | undefined;
};

export type WorldIntentRuntimeRequest =
  | {
      type: "set-draft";
      text: string;
    }
  | {
      type: "clear-draft";
    }
  | {
      type: "observe-event";
      event: WorldObservedEvent;
    }
  | {
      type: "submit-text-intent";
      text: string;
    }
  | {
      type: "cancel-request";
    }
  | {
      type: "provider-complete";
      requestId: string;
      result: WorldAiIntentResponse;
    }
  | {
      type: "provider-error";
      requestId: string;
      message: string;
    };

export type WorldIntentRuntimeBridge = {
  dispatch(request: WorldIntentRuntimeRequest): void;
  cancelActiveRequest(): void;
};

const WORLD_INTENT_REQUEST_ID_PREFIX = "world-intent-request-";
const MAX_OBSERVED_EVENTS = 12;
const MAX_NPC_REACTION_MEMORIES = 5;
const WORLD_OBSERVED_EVENT_ID_PREFIX = "world-observed-event-";

function ensureWorldIntentAppState(appState: AppState): AppState {
  if (appState.worldIntentState != null) {
    return appState;
  }

  return {
    ...appState,
    worldIntentState: createInitialAppWorldIntentState(),
  };
}

function getWorldIntentRuntimeState(
  appState: AppState
): WorldAiContextRuntimeState {
  return (
    appState.gameState.runtime.worldIntent ?? createInitialWorldIntentRuntimeState()
  );
}

function ensureWorldIntentRuntimeState(appState: AppState): AppState {
  if (appState.gameState.runtime.worldIntent != null) {
    return appState;
  }

  return {
    ...appState,
    gameState: {
      ...appState.gameState,
      runtime: {
        ...appState.gameState.runtime,
        worldIntent: createInitialWorldIntentRuntimeState(),
      },
    },
  };
}

function ensureNpcDialogueRuntimeState(appState: AppState): AppState {
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

function appendNpcReactionMemories(
  appState: AppState,
  eventRecord: WorldObservedEventRecord
): AppState {
  const reactionHints =
    eventRecord.reactionHints?.filter(
      (reactionHint) => reactionHint.summary.trim().length > 0
    ) ?? [];
  if (reactionHints.length === 0) {
    return appState;
  }

  const nextAppState = ensureNpcDialogueRuntimeState(appState);
  const runtimeState =
    nextAppState.gameState.runtime.npcDialogue ??
    createInitialNpcAiDialogueRuntimeState();
  const nextReactionMemoriesByCharacterId = {
    ...runtimeState.reactionMemoriesByCharacterId,
  };

  reactionHints.forEach((reactionHint, index) => {
    const currentRecord =
      nextReactionMemoriesByCharacterId[reactionHint.characterId] ?? {
        characterId: reactionHint.characterId,
        entries: [],
        updatedAtEventId: null,
      };

    nextReactionMemoriesByCharacterId[reactionHint.characterId] = {
      ...currentRecord,
      entries: [
        ...currentRecord.entries,
        {
          id: `${eventRecord.eventId}:reaction:${index}`,
          eventId: eventRecord.eventId,
          eventType: eventRecord.type,
          ...(eventRecord.cityId == null ? {} : { cityId: eventRecord.cityId }),
          ...(eventRecord.houseId === undefined
            ? {}
            : { houseId: eventRecord.houseId }),
          ...(eventRecord.houseActionMemory == null
            ? {}
            : { houseActionMemory: eventRecord.houseActionMemory }),
          summary: reactionHint.summary.trim(),
        },
      ].slice(-MAX_NPC_REACTION_MEMORIES),
      updatedAtEventId: eventRecord.eventId,
    };
  });

  return {
    ...nextAppState,
    gameState: {
      ...nextAppState.gameState,
      runtime: {
        ...nextAppState.gameState.runtime,
        npcDialogue: {
          ...runtimeState,
          reactionMemoriesByCharacterId: nextReactionMemoriesByCharacterId,
        },
      },
    },
  };
}

function updateWorldIntentState(
  appState: AppState,
  updater: (
    state: NonNullable<AppState["worldIntentState"]>
  ) => NonNullable<AppState["worldIntentState"]>
): AppState {
  const nextAppState = ensureWorldIntentAppState(appState);
  return {
    ...nextAppState,
    worldIntentState: updater(
      nextAppState.worldIntentState ?? createInitialAppWorldIntentState()
    ),
  };
}

function appendObservedEvent(
  appState: AppState,
  event: WorldObservedEvent
): AppState {
  const nextAppState = ensureWorldIntentRuntimeState(appState);
  const runtimeState = getWorldIntentRuntimeState(nextAppState);
  const recordedEvent = {
    ...event,
    eventId: `${WORLD_OBSERVED_EVENT_ID_PREFIX}${runtimeState.eventSequence + 1}`,
    ...(event.timestampMs == null ? { timestampMs: Date.now() } : {}),
  } satisfies WorldObservedEventRecord;
  const nextRecentEvents = [
    ...runtimeState.recentEvents,
    {
      ...event,
      ...(event.timestampMs == null ? { timestampMs: Date.now() } : {}),
    },
  ].slice(-MAX_OBSERVED_EVENTS);

  const updatedAppState = {
    ...nextAppState,
    gameState: {
      ...nextAppState.gameState,
      runtime: {
        ...nextAppState.gameState.runtime,
        worldIntent: {
          recentEvents: nextRecentEvents,
          eventLedger: [...runtimeState.eventLedger, recordedEvent],
          eventSequence: runtimeState.eventSequence + 1,
          lastKnownCityId: event.cityId ?? runtimeState.lastKnownCityId,
          lastKnownHouseId:
            event.houseId === undefined
              ? runtimeState.lastKnownHouseId
              : event.houseId,
        },
      },
    },
  };

  return appendNpcReactionMemories(updatedAppState, recordedEvent);
}

export function createWorldIntentRuntimeBridge(
  dependencies: WorldIntentRuntimeDependencies
): WorldIntentRuntimeBridge {
  let activeRequestId: string | null = null;
  let requestSequence = 0;

  function cancelActiveRequest(): void {
    if (activeRequestId == null) {
      return;
    }

    void dependencies.worldIntentProvider?.cancel?.(activeRequestId);
    activeRequestId = null;
  }

  function isCurrentRequest(requestId: string): boolean {
    const appState = dependencies.getAppState();
    return (
      activeRequestId === requestId &&
      (appState.worldIntentState?.currentRequestId ?? null) === requestId
    );
  }

  function beginClassification(input: {
    text: string;
  }): void {
    let appState = ensureWorldIntentRuntimeState(
      ensureWorldIntentAppState(dependencies.getAppState())
    );
    const trimmedText = input.text.trim();
    if (trimmedText.length === 0) {
      dependencies.setAppState(
        updateWorldIntentState(appState, (state) => ({
          ...state,
          draftText: "",
          status: "error",
          lastError: "请先输入你想做的事。",
          currentRequestId: null,
          pendingResolution: null,
        }))
      );
      dependencies.renderApp();
      return;
    }

    cancelActiveRequest();
    requestSequence += 1;
    const requestId = `${WORLD_INTENT_REQUEST_ID_PREFIX}${requestSequence}`;
    const capabilitySnapshot = dependencies.selectCapabilitySnapshot();
    const runtimeState = getWorldIntentRuntimeState(appState);
    const providerRequest = buildWorldIntentRequest({
      requestId,
      text: trimmedText,
      capabilitySnapshot,
      recentEvents: runtimeState.recentEvents,
    });
    const provider =
      dependencies.worldIntentProvider ??
      createLocalPlaceholderWorldIntentProvider();

    activeRequestId = requestId;
    appState = updateWorldIntentState(appState, (state) => ({
      ...state,
      draftText: trimmedText,
      status: "classifying",
      currentRequestId: requestId,
      pendingResolution: null,
      lastError: null,
    }));
    dependencies.setAppState(appState);
    dependencies.renderApp();

    void Promise.resolve(provider.classify(providerRequest))
      .then((resolution) => {
        dispatch({
          type: "provider-complete",
          requestId: resolution.requestId,
          result: resolution.result,
        });
      })
      .catch((error: unknown) => {
        dispatch({
          type: "provider-error",
          requestId,
          message:
            error instanceof Error
              ? error.message
              : "World-intent request failed.",
        });
      });
  }

  function dispatch(request: WorldIntentRuntimeRequest): void {
    if (request.type === "observe-event") {
      dependencies.setAppState(
        appendObservedEvent(dependencies.getAppState(), request.event)
      );
      return;
    }

    if (request.type === "set-draft") {
      dependencies.setAppState(
        updateWorldIntentState(
          ensureWorldIntentAppState(dependencies.getAppState()),
          (state) => ({
            ...state,
            draftText: request.text,
          })
        )
      );
      return;
    }

    if (request.type === "clear-draft") {
      dependencies.setAppState(
        updateWorldIntentState(
          ensureWorldIntentAppState(dependencies.getAppState()),
          (state) => ({
            ...state,
            draftText: "",
          })
        )
      );
      return;
    }

    if (request.type === "submit-text-intent") {
      beginClassification({
        text: request.text,
      });
      return;
    }

    if (request.type === "cancel-request") {
      cancelActiveRequest();
      dependencies.setAppState(
        updateWorldIntentState(
          ensureWorldIntentAppState(dependencies.getAppState()),
          (state) => ({
            ...state,
            status: "idle",
            currentRequestId: null,
            pendingResolution: null,
            lastError: null,
          })
        )
      );
      dependencies.renderApp();
      return;
    }

    if (request.type === "provider-complete") {
      if (!isCurrentRequest(request.requestId)) {
        return;
      }

      activeRequestId = null;
      dependencies.setAppState(
        updateWorldIntentState(
          ensureWorldIntentAppState(dependencies.getAppState()),
          (state) => ({
            ...state,
            status: "awaiting-follow-up",
            currentRequestId: null,
            pendingResolution: {
              requestId: request.requestId,
              result: request.result,
            },
            lastError: null,
          })
        )
      );
      if (dependencies.onResolution != null) {
        dependencies.onResolution({
          requestId: request.requestId,
          result: request.result,
        });
      } else {
        dependencies.renderApp();
      }
      return;
    }

    if (!isCurrentRequest(request.requestId)) {
      return;
    }

    activeRequestId = null;
    dependencies.setAppState(
      updateWorldIntentState(
        ensureWorldIntentAppState(dependencies.getAppState()),
        (state) => ({
          ...state,
          status: "error",
          currentRequestId: null,
          pendingResolution: null,
          lastError: request.message,
        })
      )
    );
    dependencies.renderApp();
  }

  return {
    dispatch,
    cancelActiveRequest,
  };
}
