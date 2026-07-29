const assert = require("node:assert/strict");
const test = require("node:test");

const {
  dispatchRuntimeRequest,
} = require("../.test-dist/core/runtime/runtime-dispatch.js");
const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");

function createBaseRuntimeState() {
  return {
    core: createInitialState({
      currentMapId: "map.test",
      currentCityId: "city.test",
      currentHouseId: null,
      playerCharacterId: "hero",
      chapterId: "chapter.test",
      year: 1560,
      month: 1,
      day: 1,
      pinnedCharacterId: "hero",
      reviewDateText: "",
      mainHouseMissionText: "",
      cards: { ownedCardIds: [] },
      valuables: { ownedItemIds: [] },
    }),
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

function createCharacterDefinition() {
  return {
    id: "hero",
    name: "Hero",
    birthYear: 1540,
    age: 20,
    cityId: "city.test",
    portraitId: "portrait.hero",
    stats: {
      leadership: 10,
      martial: 20,
      intelligence: 30,
      politics: 40,
      charm: 50,
      fame: 0,
      gold: 100,
    },
    stamina: 100,
    availableFunctions: [],
  };
}

test("dispatchRuntimeRequest carries routed character definitions through effect settlement", () => {
  const characterDefinitions = [createCharacterDefinition()];

  const result = dispatchRuntimeRequest({
    state: createBaseRuntimeState(),
    request: { family: "action", type: "action", actionId: "test.character" },
    context: {
      router: {
        route: ({ state }) => ({
          state,
          effects: [
            {
              type: "mutateCharacterNumericProperty",
              characterId: "hero",
              propertyId: "stats.martial",
              operation: "add",
              value: 6,
            },
          ],
          characterDefinitions,
        }),
      },
    },
  });

  assert.equal(result.characterDefinitions[0].stats.martial, 26);
  assert.deepEqual(result.characterStatusById.hero.statPatch, {
    martial: 26,
  });
});

test("dispatchRuntimeRequest settles routed taskInputs without requiring split task action and signal fields", () => {
  const result = dispatchRuntimeRequest({
    state: createBaseRuntimeState(),
    request: { family: "action", type: "action", actionId: "test.task-inputs" },
    context: {
      router: {
        route: ({ state }) => ({
          state,
          effects: [],
          taskInputs: [
            {
              type: "start",
              taskId: "task.dispatch.input",
              occurredAt: "2026-07-29T08:00:00.000Z",
              source: "event-runtime",
            },
            {
              type: "scene.reported",
              source: "scene-runtime",
              occurredAt: "2026-07-29T08:05:00.000Z",
            },
          ],
        }),
      },
      taskDefinitionsById: {
        "task.dispatch.input": {
          id: "task.dispatch.input",
          title: "Dispatch Input Task",
          objectives: [
            { id: "report", target: 1, signalType: "scene.reported" },
          ],
          onCompleteEffects: [
            {
              type: "setFlag",
              key: "task.dispatch.input.completed",
              value: true,
            },
          ],
        },
      },
    },
  });

  assert.equal(
    result.state.core.runtime.tasks.instancesByTaskId["task.dispatch.input"]
      .status,
    "completed"
  );
  assert.equal(
    result.state.core.runtime.flags["task.dispatch.input.completed"],
    true
  );
  assert.deepEqual(
    result.taskUpdates.map((update) => update.type),
    ["started", "completed"]
  );
});
