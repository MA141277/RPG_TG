const assert = require("node:assert/strict");
const test = require("node:test");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  prototypeCharacters,
  prototypeHouses,
  prototypeMap,
} = require("../.test-dist/content/prototype-world.js");
const {
  createLaunchPlayableRequest,
  runPlayableRuntime,
} = require("../.test-dist/core/runtime/playable-runtime.js");
const {
  configureDefaultPlayableRuntimeRegistriesFromActivatedMod,
  resetDefaultPlayableRuntimeRegistries,
} = require("../.test-dist/core/runtime/playable-runtime-registries.js");
const {
  createEmptyModRuntimeState,
  createLoadedModFromManifest,
  runModRuntime,
} = require("../.test-dist/core/mods/mod-runtime.js");

const playerCharacterId = "char.player";
const medicineHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "medicine-house"
);

assert.ok(medicineHouse, "Expected prototype medicine house to exist.");

function createRuntimeState(coreState) {
  return {
    core: coreState,
    app: {
      beggingMiniGameState: null,
      autoAdvanceState: null,
      campaignTravelState: null,
      cityDirectoryState: null,
      cityMenuState: null,
      locationDialogueState: null,
      modalState: null,
    },
    view: {},
  };
}

function createBaseState() {
  return createInitialState({
    currentMapId: prototypeMap.id,
    currentCityId: "city.kulan",
    currentHouseId: medicineHouse.id,
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

test(
  "medicine-compounding instance launch preserves exported integration id and owner context",
  { concurrency: false },
  async () => {
    const integrationId = "playable.medicine-compounding.instance.training.medicine";
    const activationResult = await runModRuntime({
      state: createEmptyModRuntimeState(),
      request: {
        type: "mod.activate-loaded",
        requestId: "test:medicine-compounding-instance",
        loadedMod: createLoadedModFromManifest({
          source: { kind: "builtin", modId: "mod.test.medicine-compounding-instance" },
          manifest: {
            id: "mod.test.medicine-compounding-instance",
            schemaVersion: "1",
            version: "1.0.0",
            title: "Medicine Compounding Instance Test",
            entryContentPackIds: ["pack.test.medicine-compounding-instance"],
            gameplayContributions: {
              playableIntegrations: [integrationId],
            },
          },
          rawContent: {
            id: "pack.test.medicine-compounding-instance",
            title: "Medicine Compounding Instance Test Pack",
            playableIntegrations: [
              {
                integrationId,
                playableId: "medicine-compounding",
                ownerDefaults: {
                  ownerKind: "external",
                  ownerId: null,
                  returnPolicy: "close-only",
                },
                trigger: {
                  triggerId:
                    "trigger.playable.medicine-compounding.instance.training.medicine",
                  ownerKind: "external",
                  trigger: "manual-launch",
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
      const launched = runPlayableRuntime({
        state: createRuntimeState(createBaseState()),
        request: createLaunchPlayableRequest("medicine-compounding", {
          integrationId,
        }),
        characterDefinitions: prototypeCharacters,
        playerCharacterId,
      });

      assert.equal(launched.handled, true);
      assert.equal(
        launched.state.core.runtime.playableSession?.integrationId,
        integrationId
      );
      assert.deepEqual(
        launched.state.core.runtime.playableSession?.ownerContext,
        {
          ownerKind: "external",
          ownerId: null,
          returnPolicy: "close-only",
        }
      );
    } finally {
      resetDefaultPlayableRuntimeRegistries();
    }
  }
);
