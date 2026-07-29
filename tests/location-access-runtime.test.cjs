const assert = require("node:assert/strict");
const test = require("node:test");

const {
  evaluateLocationAccess,
} = require("../.test-dist/application/location-access/location-access-runtime.js");
const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");

function createBaseState() {
  return createInitialState({
    currentMapId: "map.test",
    currentCityId: "city.kulan",
    currentHouseId: "house.temple",
    playerCharacterId: "char.player",
    chapterId: "chapter.prototype",
    year: 1567,
    month: 2,
    day: 3,
    pinnedCharacterId: "char.player",
    reviewDateText: "test",
    mainHouseMissionText: "test",
    cards: {},
    valuables: {},
    activeEventId: "event.active",
    activeSceneId: "scene.active",
    currentView: "scene",
  });
}

test("location access allows targets without a matching rule", () => {
  const result = evaluateLocationAccess({
    state: createBaseState(),
    targetFamily: "building",
    targetId: "house.temple",
    locationAccessDefinitions: [],
  });

  assert.deepEqual(result, { canEnter: true, refusal: null });
});

test("location access evaluates event person time world and story condition refs", () => {
  const state = {
    ...createBaseState(),
    runtime: {
      ...createBaseState().runtime,
      eventHistory: {
        "event.completed": { firedCount: 2, lastTriggeredOn: "1567-02-03" },
      },
      flags: { "access.allowed": true },
    },
  };
  const rule = {
    id: "access.house.temple",
    targetFamily: "building",
    targetId: "house.temple",
    conditionExpression: {
      type: "all",
      conditions: [
        {
          type: "compare",
          left: { type: "field", subject: "event", entityId: "event.completed", fieldId: "completed" },
          operator: "equals",
          right: { type: "literal", value: true },
        },
        {
          type: "compare",
          left: { type: "field", subject: "event", entityId: "event.completed", fieldId: "firedCount" },
          operator: "greater-than-or-equal",
          right: { type: "literal", value: 2 },
        },
        {
          type: "compare",
          left: { type: "field", subject: "person", entityId: "char.player", fieldId: "stats.gold" },
          operator: "greater-than",
          right: { type: "literal", value: 99 },
        },
        {
          type: "compare",
          left: { type: "field", subject: "time", fieldId: "month" },
          operator: "equals",
          right: { type: "literal", value: 2 },
        },
        {
          type: "compare",
          left: { type: "field", subject: "world", fieldId: "currentCityId" },
          operator: "equals",
          right: { type: "literal", value: "city.kulan" },
        },
        {
          type: "compare",
          left: { type: "field", subject: "story", fieldId: "activeEventId" },
          operator: "equals",
          right: { type: "literal", value: "event.active" },
        },
        {
          type: "compare",
          left: { type: "field", subject: "story", fieldId: "flag:access.allowed" },
          operator: "equals",
          right: { type: "literal", value: true },
        },
      ],
    },
  };

  const result = evaluateLocationAccess({
    state,
    targetFamily: "building",
    targetId: "house.temple",
    characterDefinitions: [
      {
        id: "char.player",
        name: "Player",
        birthYear: 1540,
        age: 27,
        cityId: "city.kulan",
        portraitId: "portrait.player",
        stats: {
          leadership: 1,
          martial: 1,
          intelligence: 1,
          politics: 1,
          charm: 1,
          fame: 1,
          gold: 100,
        },
        stamina: 50,
        availableFunctions: [],
      },
    ],
    locationAccessDefinitions: [rule],
  });

  assert.deepEqual(result, { canEnter: true, refusal: null });
});

test("location access returns structured refusal for blocked enter and leave rules", () => {
  const state = createBaseState();
  const locationAccessDefinitions = [
    {
      id: "access.enter.keep",
      targetFamily: "building",
      targetId: "house.keep",
      conditionExpression: { type: "literal", value: false },
      blockedTitle: "Keep Closed",
      blockedMessage: "The guard blocks the gate.",
      blockedSpeakerId: "char.guard",
      guidance: "Return",
    },
    {
      id: "access.leave.temple",
      targetFamily: "building",
      targetId: "house.temple",
      purpose: "leave",
      conditionExpression: { type: "literal", value: false },
      blockedReason: "You still have temple duties.",
    },
  ];

  const blockedEnter = evaluateLocationAccess({
    state,
    targetFamily: "building",
    targetId: "house.keep",
    targetBuilding: { id: "house.keep", cityId: "city.kulan", name: "Keep" },
    locationAccessDefinitions,
  });
  const blockedLeave = evaluateLocationAccess({
    state,
    purpose: "leave",
    targetFamily: "building",
    targetId: "house.temple",
    targetBuilding: { id: "house.temple", cityId: "city.kulan", name: "Temple" },
    locationAccessDefinitions,
  });

  assert.deepEqual(blockedEnter, {
    canEnter: false,
    refusal: {
      ruleId: "access.enter.keep",
      speakerCharacterId: "char.guard",
      title: "Keep Closed",
      text: "The guard blocks the gate.",
      confirmLabel: "Return",
    },
  });
  assert.deepEqual(blockedLeave, {
    canEnter: false,
    refusal: {
      ruleId: "access.leave.temple",
      speakerCharacterId: "char.player",
      title: "Temple",
      text: "You still have temple duties.",
      confirmLabel: "Return",
    },
  });
});
