const test = require("node:test");
const assert = require("node:assert/strict");

const {
  launchMeetingFromHostAction,
  resumeMeetingFromHostSession,
  completeMeetingToHost,
} = require("../.test-dist/application/meeting/meeting-host-bridge.js");
const {
  createHouseRuntimeBridge,
  enterHouseThroughRuntime,
  dispatchHouseRuntimeRequest,
} = require("../.test-dist/core/runtime/house-runtime.js");
const {
  createHouseModuleRegistry,
} = require("../.test-dist/core/registry/house-module-registry.js");
const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  prototypeCharacters,
  prototypeCities,
  prototypeMap,
} = require("../.test-dist/content/prototype-world.js");

const playerCharacterId = "char.player";
const targetCity = prototypeCities.find((city) => city.id === "city.kulan");

assert.ok(targetCity, "Expected prototype city.kulan.");

function createHostContext(overrides = {}) {
  return {
    hostFamily: "building",
    hostId: "house.test.runtime",
    returnTarget: {
      type: "building",
      id: "house.test.runtime",
    },
    participantCharacterIds: [playerCharacterId, "char.senior"],
    ...(overrides ?? {}),
  };
}

function createMeetingContent(overrides = {}) {
  const meetingDefinition = {
    id: "meeting.temple.review",
    hostScope: {
      family: "building",
      templateId: "house.template.temple",
    },
    initialStageId: "intro",
    stageIds: ["intro"],
    stagesById: {
      intro: {
        id: "intro",
        type: "dialogue",
        dialogueId: "dialogue.temple.review.intro",
      },
    },
    completion: {
      type: "return-to-host",
    },
    ...(overrides.meetingDefinition ?? {}),
  };
  const binding = {
    id: "binding.temple.review",
    meetingId: meetingDefinition.id,
    owner: {
      family: "building",
      id: "house.test.runtime",
    },
    trigger: {
      action: "building-container-item-action",
      itemId: "review",
    },
    ...(overrides.binding ?? {}),
  };

  return {
    meetingsById: {
      [meetingDefinition.id]: meetingDefinition,
    },
    meetingBindings: [binding],
    meetingPanelsById: {},
    meetingChoiceSetsById: {},
    meetingActionSetsById: {},
  };
}

function createGameState() {
  return createInitialState({
    currentMapId: prototypeMap.id,
    currentCityId: targetCity.id,
    currentHouseId: null,
    playerCharacterId,
    chapterId: "chapter.prototype",
    year: 1567,
    month: 1,
    day: 1,
    pinnedCharacterId: playerCharacterId,
    reviewDateText: "test",
    mainHouseMissionText: "test",
    currentView: "city",
  });
}

function createAppState() {
  return {
    gameState: createGameState(),
    characterDefinitions: prototypeCharacters,
    playerCoordinate: { x: 0, y: 0 },
    campaignActorState: {
      facingDegrees: 0,
      isMoving: false,
    },
    campaignTravelState: null,
    modalState: null,
    locationDialogueState: null,
    beggingMiniGameState: null,
    cityMenuState: null,
    cityDirectoryState: null,
    autoAdvanceState: null,
    uiLayouts: {},
    layoutEditor: {},
  };
}

function createRuntimeHouse() {
  return {
    id: "house.test.runtime",
    cityId: targetCity.id,
    name: "Runtime House",
    type: "custom",
    moduleId: "tea-house",
    characterIds: [],
    outputMultiplier: 1,
    backAction: {
      label: "Back",
      targetView: "city",
    },
  };
}

function createIdleViewModel() {
  return {
    moduleId: "tea-house",
    houseId: "house.test.runtime",
    sceneTitle: "Runtime House",
    standbyRoster: [],
    dialogue: null,
    actionContainer: null,
    statusCard: null,
    overlay: null,
    leaveAction: {
      id: "leave-house",
      label: "离开",
    },
  };
}

function createBridgeInput(overrides = {}) {
  const content = createMeetingContent(overrides.content ?? {});

  return {
    hostContext: createHostContext(overrides.hostContext),
    trigger: {
      action: "building-container-item-action",
      itemId: "review",
      ...(overrides.trigger ?? {}),
    },
    hostSessionState: overrides.hostSessionState ?? {
      mode: "idle",
      resumedMeetingIds: [],
    },
    sharedSessionState: overrides.sharedSessionState ?? null,
    gameState: overrides.gameState ?? createGameState(),
    characterDefinitions: overrides.characterDefinitions ?? prototypeCharacters,
    meetingsById: content.meetingsById,
    meetingBindings: content.meetingBindings,
    meetingPanelsById: content.meetingPanelsById,
    meetingChoiceSetsById: content.meetingChoiceSetsById,
    meetingActionSetsById: content.meetingActionSetsById,
  };
}

function createRuntimeHostModule() {
  const content = createMeetingContent();

  const passThroughResult = (input, sessionState) => ({
    gameState: input.gameState,
    characterDefinitions: input.characterDefinitions,
    sessionState,
    sharedSessionState: input.sharedSessionState ?? null,
  });

  return {
    moduleId: "tea-house",
    enter(input) {
      return {
        gameState: input.gameState,
        characterDefinitions: input.characterDefinitions,
        sessionState: {
          mode: "idle",
          resumedMeetingIds: [],
        },
        sharedSessionState: input.sharedSessionState ?? null,
      };
    },
    dispatch(input) {
      const sessionState =
        input.sessionState ?? {
          mode: "idle",
          resumedMeetingIds: [],
        };
      if (input.request.type !== "action") {
        return passThroughResult(input, sessionState);
      }

      if (input.request.actionId === "review") {
        const result = launchMeetingFromHostAction({
          hostContext: createHostContext({
            hostId: input.houseDefinition.id,
            returnTarget: {
              type: "building",
              id: input.houseDefinition.id,
            },
          }),
          trigger: {
            action: "building-container-item-action",
            itemId: "review",
          },
          hostSessionState: sessionState,
          sharedSessionState: input.sharedSessionState ?? null,
          gameState: input.gameState,
          characterDefinitions: input.characterDefinitions,
          meetingsById: content.meetingsById,
          meetingBindings: content.meetingBindings,
          meetingPanelsById: content.meetingPanelsById,
          meetingChoiceSetsById: content.meetingChoiceSetsById,
          meetingActionSetsById: content.meetingActionSetsById,
        });

        return {
          gameState: result.gameState,
          characterDefinitions: result.characterDefinitions,
          sessionState: result.hostSessionState,
          sharedSessionState: result.sharedSessionState,
        };
      }

      if (input.request.actionId === "ping-shared-session") {
        return {
          gameState: input.gameState,
          characterDefinitions: input.characterDefinitions,
          sessionState: {
            ...sessionState,
            resumedMeetingIds: [
              ...sessionState.resumedMeetingIds,
              input.sharedSessionState?.hostedMeeting?.meetingId ?? "none",
            ],
          },
          sharedSessionState: input.sharedSessionState ?? null,
        };
      }

      return passThroughResult(input, sessionState);
    },
    leave(input) {
      return passThroughResult(input, input.sessionState ?? null);
    },
    selectViewModel() {
      return createIdleViewModel();
    },
  };
}

test("launchMeetingFromHostAction starts a meeting from the review binding", () => {
  const result = launchMeetingFromHostAction(createBridgeInput());

  assert.equal(result.handled, true);
  assert.equal(
    result.sharedSessionState?.hostedMeeting?.bindingId,
    "binding.temple.review"
  );
  assert.equal(
    result.sharedSessionState?.hostedMeeting?.meetingId,
    "meeting.temple.review"
  );
  assert.equal(
    result.sharedSessionState?.hostedMeeting?.sessionState.currentStageId,
    "intro"
  );
  assert.equal(
    result.presenterModel?.dialogue?.advanceActionId,
    "advance-meeting-stage"
  );
});

test("house runtime preserves shared meeting session state across host dispatch boundaries", () => {
  const runtimeHouse = createRuntimeHouse();
  const houseModuleRegistry = createHouseModuleRegistry([
    {
      moduleId: "tea-house",
      module: createRuntimeHostModule(),
    },
  ]);
  let appState = createAppState();

  const runtime = createHouseRuntimeBridge({
    getAppState: () => appState,
    setAppState: (nextAppState) => {
      appState = nextAppState;
    },
    renderApp: () => {},
    startMapAutoAdvance: () => {},
    stopMapAutoAdvance: () => {},
    houseDefinitions: [runtimeHouse],
    playerCharacterId,
    eventDefinitionsById: {},
    sceneDefinitionsById: {},
    cityDefinitionsById: {
      [targetCity.id]: targetCity,
    },
    houseDefinitionsById: {
      [runtimeHouse.id]: runtimeHouse,
    },
    houseModuleRegistry,
    syncCouncilPriorityAfterGameStateChange: () => false,
  });

  enterHouseThroughRuntime(runtime, runtimeHouse.id);
  dispatchHouseRuntimeRequest(runtime, {
    type: "action",
    actionId: "review",
  });

  assert.equal(
    appState.gameState.ui.houseSession?.sharedSessionState?.hostedMeeting
      ?.meetingId,
    "meeting.temple.review"
  );

  dispatchHouseRuntimeRequest(runtime, {
    type: "action",
    actionId: "ping-shared-session",
  });

  assert.deepEqual(appState.gameState.ui.houseSession?.state?.resumedMeetingIds, [
    "meeting.temple.review",
  ]);
});

test("completeMeetingToHost returns the meeting flow to the correct host target", () => {
  const launched = launchMeetingFromHostAction(
    createBridgeInput({
      content: {
        meetingDefinition: {
          stageIds: ["intro"],
          stagesById: {
            intro: {
              id: "intro",
              type: "dialogue",
              dialogueId: "dialogue.temple.review.intro",
            },
          },
        },
      },
    })
  );

  const resumed = resumeMeetingFromHostSession({
    ...createBridgeInput({
      hostSessionState: launched.hostSessionState,
      sharedSessionState: launched.sharedSessionState,
      gameState: launched.gameState,
      characterDefinitions: launched.characterDefinitions,
    }),
    request: {
      type: "advance",
    },
  });

  assert.equal(resumed.completion?.type, "return-to-host");

  const completed = completeMeetingToHost(resumed);

  assert.equal(completed.sharedSessionState, null);
  assert.deepEqual(completed.returnTarget, {
    type: "building",
    id: "house.test.runtime",
  });
});
