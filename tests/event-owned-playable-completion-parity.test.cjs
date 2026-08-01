const assert = require("node:assert/strict");
const test = require("node:test");

const {
  triggerBuildingContainerItemAction,
} = require("../.test-dist/application/building/building-container-event-runtime.js");
const {
  applyEventOwnedPlayableCompletion,
} = require("../.test-dist/application/events/event-playable-runtime.js");
const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  startStoryEventById,
  continueStoryFromSourceEvent,
  triggerStoryEvents,
} = require("../.test-dist/application/story/story-runtime.js");
const {
  createPlayableActionRequest,
  configureDefaultPlayableRuntimeRegistriesFromActivatedMod,
  resetDefaultPlayableRuntimeRegistries,
  runPlayableRuntime,
} = require("../.test-dist/core/runtime/playable-runtime.js");
const {
  createEmptyModRuntimeState,
  createLoadedModFromManifest,
  runModRuntime,
} = require("../.test-dist/core/mods/mod-runtime.js");
const {
  stateSyncCoreSeam,
} = require("../.test-dist/core/runtime/state-sync-core-seam.js");
const {
  prototypeCharacters,
  prototypeMap,
} = require("../.test-dist/content/prototype-world.js");

const PLAYER_CHARACTER_ID = "char.player";

function createBaseState() {
  return createInitialState({
    currentMapId: prototypeMap.id,
    currentCityId: "city.kulan",
    currentHouseId: null,
    playerCharacterId: PLAYER_CHARACTER_ID,
    chapterId: "chapter.prototype",
    year: 1567,
    month: 1,
    day: 1,
    pinnedCharacterId: PLAYER_CHARACTER_ID,
    reviewDateText: "test",
    mainHouseMissionText: "test",
    currentView: "city",
  });
}

function createRuntimeState(gameState) {
  return stateSyncCoreSeam.createRuntimeStateFromAppState({
    gameState,
    beggingMiniGameState: null,
    autoAdvanceState: null,
    campaignTravelState: null,
    cityDirectoryState: null,
    cityMenuState: null,
    locationDialogueState: null,
    modalState: null,
  });
}

test(
  "routed playable completion starts the authored target event before any follow-up continuation",
  () => {
    const state = createBaseState();
    const storyContent = {
      eventDefinitionsById: {
        "event.route.source": {
          id: "event.route.source",
          chapterId: "chapter.prototype",
          name: "Route Source",
          occurrence: "repeatable",
          dialogueId: "",
        },
        "event.route.settlement": {
          id: "event.route.settlement",
          chapterId: "chapter.prototype",
          name: "Route Settlement",
          occurrence: "repeatable",
          type: "settlement",
          dialogueId: "",
          settlementId: "settlement.route.reward",
          nextEventId: "event.route.after",
        },
        "event.route.after": {
          id: "event.route.after",
          chapterId: "chapter.prototype",
          name: "After Route Settlement",
          occurrence: "repeatable",
          dialogueId: "",
        },
      },
      dialogueDefinitionsById: {},
      settlementDefinitionsById: {
        "settlement.route.reward": {
          id: "settlement.route.reward",
          title: "Route Reward",
          contents: [
            {
              targetFamily: "person",
              targetId: PLAYER_CHARACTER_ID,
              attributeKey: "stamina",
              attributeType: "number",
              operation: "add",
              value: 7,
            },
          ],
        },
      },
    };
    const previousPlayableSession = {
      sessionId: "session.route",
      playableId: "flow.route",
      integrationId: "playable.flow.route",
      ownerContext: {
        ownerKind: "house",
        ownerId: "building.temple",
        returnPolicy: "resume-owner",
        sessionToken: "event.route.source",
      },
      status: "completed",
    };

    const continued = applyEventOwnedPlayableCompletion({
      state,
      characterDefinitions: prototypeCharacters,
      previousPlayableSession,
      settlement: {
        integrationId: "playable.flow.route",
        outcome: "success",
        factResult: { status: "completed" },
        followUpEventId: "event.route.settlement",
        handoff: {
          type: "resume-owner",
          ownerKind: "house",
          ownerId: "building.temple",
          sessionToken: "event.route.source",
        },
        effects: [],
      },
      startFromEventId: ({ eventId, state: currentState, characterDefinitions }) =>
        startStoryEventById(
          {
            state: currentState,
            characterDefinitions,
          },
          storyContent,
          eventId
        ),
      continueFromSourceEvent: ({ sourceEventId, state: currentState, characterDefinitions }) =>
        continueStoryFromSourceEvent(
          {
            state: currentState,
            characterDefinitions,
          },
          storyContent,
          sourceEventId
        ),
    });

    assert.equal(continued.handled, true);
    assert.equal(
      continued.state.runtime.eventHistory["event.route.settlement"]?.firedCount,
      1
    );
    assert.equal(
      continued.state.runtime.eventHistory["event.route.after"]?.firedCount,
      1
    );
    const player = continued.characterDefinitions.find(
      (character) => character.id === PLAYER_CHARACTER_ID
    );
    assert.equal(player?.stamina, 107);
  }
);

test(
  "story-triggered event-owned playable completion continues through the authored follow-up event",
  () => {
    assert.equal(
      typeof continueStoryFromSourceEvent,
      "function",
      "story runtime should expose event-owned playable completion continuation"
    );
    assert.equal(
      typeof applyEventOwnedPlayableCompletion,
      "function",
      "event playable runtime should expose a shared completion consumer"
    );

    const state = createBaseState();
    state.world.currentCityId = "city.kulan";
    state.world.currentHouseId = "building.temple";
    state.ui.currentView = "house";

    const storyContent = {
      eventDefinitionsById: {
        "event.story.battle": {
          id: "event.story.battle",
          chapterId: "chapter.prototype",
          name: "Story Battle",
          occurrence: "repeatable",
          dialogueId: "",
          nextEventId: "event.story.after-battle",
          actions: [
            {
              type: "launchPlayable",
              playableId: "story-battle",
              integrationId: "playable.story-battle.dialogue.default",
              ownerContext: {
                ownerKind: "house",
                ownerId: "building.temple",
                returnPolicy: "reenter-owner",
              },
              payload: {
                completedFlagKey: "battle.completed",
                winFlagKey: "battle.won",
                battleIdVariableKey: "battle.id",
                resultVariableKey: "battle.result",
                enterHouseId: "building.temple",
              },
            },
          ],
        },
        "event.story.after-battle": {
          id: "event.story.after-battle",
          chapterId: "chapter.prototype",
          name: "After Battle",
          occurrence: "repeatable",
          dialogueId: "dialogue.story.after-battle",
        },
      },
      eventBindingsById: {
        "binding.story.battle": {
          id: "binding.story.battle",
          eventId: "event.story.battle",
          owner: { family: "building", id: "building.temple" },
          trigger: { timing: "after", action: "building-enter" },
          enabled: true,
        },
      },
      dialogueDefinitionsById: {
        "dialogue.story.after-battle": {
          id: "dialogue.story.after-battle",
          name: "After Battle",
          nodes: [
            {
              type: "narration",
              text: "The aftermath begins.",
            },
          ],
        },
      },
      textEntriesById: {},
    };

    const launched = triggerStoryEvents(
      {
        state,
        characterDefinitions: prototypeCharacters,
      },
      storyContent,
      {
        timing: "house-enter",
        cityId: "city.kulan",
        houseId: "building.temple",
      }
    );

    assert.equal(
      launched.state.runtime.playableSession?.ownerContext.sessionToken,
      "event.story.battle"
    );

    const completed = runPlayableRuntime({
      state: createRuntimeState(launched.state),
      request: createPlayableActionRequest("story-battle", "battle-action", {
        battleActionId: "embedded-victory",
      }),
      characterDefinitions: launched.characterDefinitions,
      textEntriesById: storyContent.textEntriesById,
    });

    const continued = applyEventOwnedPlayableCompletion({
      state: completed.state.core,
      characterDefinitions:
        completed.characterDefinitions ?? launched.characterDefinitions,
      previousPlayableSession: launched.state.runtime.playableSession,
      settlement: completed.settlement,
      followUp: completed.followUp,
      continueFromSourceEvent: ({ sourceEventId, state: currentState, characterDefinitions }) =>
        continueStoryFromSourceEvent(
          {
            state: currentState,
            characterDefinitions,
          },
          storyContent,
          sourceEventId
        ),
    });

    assert.equal(continued.handled, true);
    assert.equal(
      continued.state.runtime.eventHistory["event.story.after-battle"]?.firedCount,
      1
    );
    assert.equal(continued.state.dialogue.activeEventId, "event.story.after-battle");
    assert.equal(
      continued.state.dialogue.activeDialogueId,
      "dialogue.story.after-battle"
    );
    assert.equal(continued.state.ui.currentView, "dialogue");
  }
);

test(
  "story-triggered playable launch preserves the authored integration id instead of collapsing to the builtin default",
  async () => {
    const state = createBaseState();
    state.world.currentCityId = "city.kulan";
    state.world.currentHouseId = "building.temple";
    state.ui.currentView = "house";

    const integrationId = "playable.story-battle.instance.training.battle";
    const activationResult = await runModRuntime({
      state: createEmptyModRuntimeState(),
      request: {
        type: "mod.activate-loaded",
        requestId: "test:story-battle-instance-launch",
        loadedMod: createLoadedModFromManifest({
          source: { kind: "builtin", modId: "mod.test.story-battle-instance-launch" },
          manifest: {
            id: "mod.test.story-battle-instance-launch",
            schemaVersion: "1",
            version: "1.0.0",
            title: "Story Battle Instance Launch Test",
            entryContentPackIds: ["pack.test.story-battle-instance-launch"],
            gameplayContributions: {
              playableIntegrations: [integrationId],
            },
          },
          rawContent: {
            id: "pack.test.story-battle-instance-launch",
            title: "Story Battle Instance Launch Test Pack",
            playableIntegrations: [
              {
                integrationId,
                playableId: "story-battle",
                ownerDefaults: {
                  ownerKind: "house",
                  ownerId: "building.temple",
                  returnPolicy: "reenter-owner",
                },
                trigger: {
                  triggerId: "trigger.playable.story-battle.instance.training.battle",
                  ownerKind: "dialogue",
                  trigger: "event-destination",
                },
                outcomeConfig: {},
              },
            ],
          },
        }),
      },
      context: {
        allowedCapabilities: [],
      },
    });
    assert.equal(activationResult.ok, true);
    if (!activationResult.ok) {
      return;
    }

    configureDefaultPlayableRuntimeRegistriesFromActivatedMod(
      activationResult.activatedMod
    );

    try {
    const storyContent = {
      eventDefinitionsById: {
        "event.story.battle": {
          id: "event.story.battle",
          chapterId: "chapter.prototype",
          name: "Story Battle",
          occurrence: "repeatable",
          dialogueId: "",
          actions: [
            {
              type: "launchPlayable",
              playableId: "story-battle",
              integrationId,
              ownerContext: {
                ownerKind: "house",
                ownerId: "building.temple",
                returnPolicy: "reenter-owner",
              },
              payload: {
                completedFlagKey: "battle.completed",
                winFlagKey: "battle.won",
                battleIdVariableKey: "battle.id",
                resultVariableKey: "battle.result",
                enterHouseId: "building.temple",
              },
            },
          ],
        },
      },
      eventBindingsById: {
        "binding.story.battle": {
          id: "binding.story.battle",
          eventId: "event.story.battle",
          owner: { family: "building", id: "building.temple" },
          trigger: { timing: "after", action: "building-enter" },
          enabled: true,
        },
      },
      dialogueDefinitionsById: {},
      textEntriesById: {},
    };

    const launched = triggerStoryEvents(
      {
        state,
        characterDefinitions: prototypeCharacters,
      },
      storyContent,
      {
        timing: "house-enter",
        cityId: "city.kulan",
        houseId: "building.temple",
      }
    );

    assert.equal(
      launched.state.runtime.playableSession?.integrationId,
      integrationId
    );
    } finally {
      resetDefaultPlayableRuntimeRegistries();
    }
  }
);

test(
  "story-battle runtime preserves the authored integration id when a non-terminal action keeps the battle open",
  async () => {
    const state = createBaseState();
    state.world.currentCityId = "city.kulan";
    state.world.currentHouseId = "building.temple";
    state.ui.currentView = "house";

    const integrationId = "playable.story-battle.instance.training.battle";
    const activationResult = await runModRuntime({
      state: createEmptyModRuntimeState(),
      request: {
        type: "mod.activate-loaded",
        requestId: "test:story-battle-instance-runtime",
        loadedMod: createLoadedModFromManifest({
          source: { kind: "builtin", modId: "mod.test.story-battle-instance-runtime" },
          manifest: {
            id: "mod.test.story-battle-instance-runtime",
            schemaVersion: "1",
            version: "1.0.0",
            title: "Story Battle Instance Runtime Test",
            entryContentPackIds: ["pack.test.story-battle-instance-runtime"],
            gameplayContributions: {
              playableIntegrations: [integrationId],
            },
          },
          rawContent: {
            id: "pack.test.story-battle-instance-runtime",
            title: "Story Battle Instance Runtime Test Pack",
            playableIntegrations: [
              {
                integrationId,
                playableId: "story-battle",
                ownerDefaults: {
                  ownerKind: "house",
                  ownerId: "building.temple",
                  returnPolicy: "reenter-owner",
                },
                trigger: {
                  triggerId: "trigger.playable.story-battle.instance.training.battle",
                  ownerKind: "dialogue",
                  trigger: "event-destination",
                },
                outcomeConfig: {},
              },
            ],
          },
        }),
      },
      context: {
        allowedCapabilities: [],
      },
    });
    assert.equal(activationResult.ok, true);
    if (!activationResult.ok) {
      return;
    }

    configureDefaultPlayableRuntimeRegistriesFromActivatedMod(
      activationResult.activatedMod
    );

    try {
    const storyContent = {
      eventDefinitionsById: {
        "event.story.battle": {
          id: "event.story.battle",
          chapterId: "chapter.prototype",
          name: "Story Battle",
          occurrence: "repeatable",
          dialogueId: "",
          actions: [
            {
              type: "launchPlayable",
              playableId: "story-battle",
              integrationId,
              ownerContext: {
                ownerKind: "house",
                ownerId: "building.temple",
                returnPolicy: "reenter-owner",
              },
              payload: {
                completedFlagKey: "battle.completed",
                winFlagKey: "battle.won",
                battleIdVariableKey: "battle.id",
                resultVariableKey: "battle.result",
                enterHouseId: "building.temple",
              },
            },
          ],
        },
      },
      eventBindingsById: {
        "binding.story.battle": {
          id: "binding.story.battle",
          eventId: "event.story.battle",
          owner: { family: "building", id: "building.temple" },
          trigger: { timing: "after", action: "building-enter" },
          enabled: true,
        },
      },
      dialogueDefinitionsById: {},
      textEntriesById: {},
    };

    const launched = triggerStoryEvents(
      {
        state,
        characterDefinitions: prototypeCharacters,
      },
      storyContent,
      {
        timing: "house-enter",
        cityId: "city.kulan",
        houseId: "building.temple",
      }
    );

    const runtimeResult = runPlayableRuntime({
      state: createRuntimeState(launched.state),
      request: createPlayableActionRequest("story-battle", "battle-action", {
        battleActionId: "ignored-action",
      }),
      characterDefinitions: launched.characterDefinitions,
      textEntriesById: storyContent.textEntriesById,
    });

    assert.equal(
      runtimeResult.state.core.runtime.playableSession?.integrationId,
      integrationId
    );
    } finally {
      resetDefaultPlayableRuntimeRegistries();
    }
  }
);

test(
  "building-triggered event-owned flow completion continues through settlement follow-up",
  () => {
    assert.equal(
      typeof continueStoryFromSourceEvent,
      "function",
      "story runtime should expose event-owned playable completion continuation"
    );
    assert.equal(
      typeof applyEventOwnedPlayableCompletion,
      "function",
      "event playable runtime should expose a shared completion consumer"
    );

    const state = createBaseState();
    state.world.currentCityId = "city.kulan";
    state.world.currentHouseId = "building.temple";
    state.ui.currentView = "house";

    const characterDefinitions = prototypeCharacters.map((character) =>
      character.id === PLAYER_CHARACTER_ID
        ? {
            ...character,
            stamina: 100,
          }
        : character
    );

    const storyContent = {
      eventDefinitionsById: {
        "event.temple.rest": {
          id: "event.temple.rest",
          chapterId: "chapter.prototype",
          name: "Temple Rest",
          occurrence: "repeatable",
          dialogueId: "",
          nextEventId: "event.temple.after-rest",
          actions: [
            {
              type: "launchFlow",
              flowId: "flow-temple-rest",
              ownerContext: {
                ownerKind: "house",
                ownerId: "building.temple",
                returnPolicy: "resume-owner",
              },
            },
          ],
        },
        "event.temple.after-rest": {
          id: "event.temple.after-rest",
          chapterId: "chapter.prototype",
          name: "After Rest",
          occurrence: "repeatable",
          type: "settlement",
          dialogueId: "",
          settlementId: "settlement.temple.after-rest",
        },
      },
      eventBindingsById: {
        "binding.temple.rest": {
          id: "binding.temple.rest",
          eventId: "event.temple.rest",
          owner: { family: "building", id: "building.temple" },
          trigger: {
            timing: "after",
            action: "building-container-item-action",
            extra: {
              arrangementId: "arrangement.temple",
              containerId: "container.temple.actions",
              itemId: "item.temple.rest",
            },
          },
          enabled: true,
        },
      },
      dialogueDefinitionsById: {},
      settlementDefinitionsById: {
        "settlement.temple.after-rest": {
          id: "settlement.temple.after-rest",
          title: "After Rest",
          contents: [
            {
              targetFamily: "person",
              targetId: PLAYER_CHARACTER_ID,
              attributeKey: "stamina",
              attributeType: "number",
              operation: "add",
              value: 10,
            },
          ],
        },
      },
      flowPlayablesById: {
        "flow-temple-rest": {
          id: "flow-temple-rest",
          title: "Temple Rest",
          initialNodeId: "node.start",
          nodes: [
            {
              id: "node.start",
              type: "text",
              text: "Rest here.",
              nextNodeId: "node.finish",
            },
            {
              id: "node.finish",
              type: "complete",
              outcome: "success",
              metrics: { rested: true },
            },
          ],
        },
      },
      textEntriesById: {},
    };

    const launched = triggerBuildingContainerItemAction({
      state,
      characterDefinitions,
      storyContent,
      action: {
        arrangementId: "arrangement.temple",
        containerId: "container.temple.actions",
        itemId: "item.temple.rest",
      },
    });

    assert.equal(
      launched.state.runtime.playableSession?.ownerContext.sessionToken,
      "event.temple.rest"
    );

    const completed = runPlayableRuntime({
      state: createRuntimeState(launched.state),
      request: createPlayableActionRequest("flow-temple-rest", "confirm"),
      characterDefinitions: launched.characterDefinitions,
      flowPlayablesById: storyContent.flowPlayablesById,
    });

    const continued = applyEventOwnedPlayableCompletion({
      state: completed.state.core,
      characterDefinitions:
        completed.characterDefinitions ?? launched.characterDefinitions,
      previousPlayableSession: launched.state.runtime.playableSession,
      settlement: completed.settlement,
      followUp: completed.followUp,
      continueFromSourceEvent: ({ sourceEventId, state: currentState, characterDefinitions: currentCharacters }) =>
        continueStoryFromSourceEvent(
          {
            state: currentState,
            characterDefinitions: currentCharacters,
          },
          storyContent,
          sourceEventId
        ),
    });

    assert.equal(continued.handled, true);
    assert.equal(
      continued.state.runtime.eventHistory["event.temple.after-rest"]?.firedCount,
      1
    );
    const player = continued.characterDefinitions.find(
      (character) => character.id === PLAYER_CHARACTER_ID
    );
    assert.equal(player?.stamina, 110);
    assert.equal(continued.state.dialogue.activeEventId, null);
    assert.equal(continued.state.dialogue.activeDialogueId, null);
    assert.equal(continued.state.dialogue.status, "idle");
  }
);
