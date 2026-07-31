const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

assert.equal(
  fs.existsSync(
    path.join(process.cwd(), "src/application/events/event-playable-runtime.ts")
  ),
  true,
  "event playable runtime source module should exist"
);

const {
  applyEventOwnedPlayableCompletion,
} = require("../.test-dist/application/events/event-playable-runtime.js");
const {
  prototypeCities,
  prototypeHouses,
} = require("../.test-dist/content/prototype-world.js");

function createSession(sourceEventId) {
  return {
    sessionId: "playable.story-battle",
    playableId: "story-battle",
    integrationId: "playable.story-battle.dialogue.default",
    status: "active",
    ownerContext: {
      ownerKind: "dialogue",
      ownerId: "dialogue.opening",
      returnPolicy: "reenter-owner",
      sessionToken: sourceEventId,
    },
  };
}

test("event-owned playable completion delegates to the source event continuation", () => {
  const state = {
    runtime: { marker: "before" },
  };
  const characterDefinitions = [{ id: "char.player", stamina: 100 }];

  const result = applyEventOwnedPlayableCompletion({
    state,
    characterDefinitions,
    previousPlayableSession: createSession("event.opening.battle"),
    settlement: { outcome: "success" },
    continueFromSourceEvent: ({ sourceEventId, state: currentState, characterDefinitions: currentCharacters }) => {
      assert.equal(sourceEventId, "event.opening.battle");
      assert.equal(currentState, state);
      assert.equal(currentCharacters, characterDefinitions);
      return {
        state: {
          ...currentState,
          runtime: { marker: "continued" },
        },
        characterDefinitions: currentCharacters.map((character) => ({
          ...character,
          stamina: character.stamina + 1,
        })),
      };
    },
  });

  assert.equal(result.handled, true);
  assert.deepEqual(result.state, {
    runtime: { marker: "continued" },
  });
  assert.equal(result.characterDefinitions[0].stamina, 101);
});

test("event-owned playable completion applies a runtime follow-up when no continuation handles it", () => {
  const state = {
    world: { currentHouseId: "building.temple" },
  };
  const characterDefinitions = [{ id: "char.player" }];

  const result = applyEventOwnedPlayableCompletion({
    state,
    characterDefinitions,
    previousPlayableSession: createSession("event.temple.flow"),
    followUp: { type: "reenter-house", houseId: "building.temple" },
    continueFromSourceEvent: () => null,
    applyFollowUp: ({ sourceEventId, followUp }) => {
      assert.equal(sourceEventId, "event.temple.flow");
      assert.deepEqual(followUp, {
        type: "reenter-house",
        houseId: "building.temple",
      });
      return {
        state: {
          world: { currentHouseId: followUp.houseId },
          ui: { currentView: "house" },
        },
      };
    },
  });

  assert.equal(result.handled, true);
  assert.deepEqual(result.state, {
    world: { currentHouseId: "building.temple" },
    ui: { currentView: "house" },
  });
  assert.equal(result.characterDefinitions, characterDefinitions);
});

test("event-owned playable completion passes world definitions into source event continuation", () => {
  const state = {
    runtime: { marker: "before" },
  };
  const characterDefinitions = [{ id: "char.player" }];
  const cityDefinitions = prototypeCities.slice(0, 1);
  const houseDefinitions = prototypeHouses.slice(0, 1);

  const result = applyEventOwnedPlayableCompletion({
    state,
    characterDefinitions,
    cityDefinitions,
    houseDefinitions,
    previousPlayableSession: createSession("event.world.settlement"),
    settlement: { outcome: "success" },
    continueFromSourceEvent: ({
      sourceEventId,
      cityDefinitions: continuedCities,
      houseDefinitions: continuedHouses,
    }) => {
      assert.equal(sourceEventId, "event.world.settlement");
      assert.equal(continuedCities, cityDefinitions);
      assert.equal(continuedHouses, houseDefinitions);
      return {
        state: {
          runtime: { marker: "continued" },
        },
        characterDefinitions,
        cityDefinitions: continuedCities,
        houseDefinitions: continuedHouses,
      };
    },
  });

  assert.equal(result.handled, true);
  assert.deepEqual(result.state, {
    runtime: { marker: "continued" },
  });
  assert.equal(result.cityDefinitions, cityDefinitions);
  assert.equal(result.houseDefinitions, houseDefinitions);
});

test("event-owned playable completion ignores sessions without a source event token", () => {
  const result = applyEventOwnedPlayableCompletion({
    state: {},
    characterDefinitions: [],
    previousPlayableSession: createSession("  "),
    settlement: { outcome: "success" },
  });

  assert.equal(result.handled, false);
  assert.deepEqual(result.state, {});
  assert.deepEqual(result.characterDefinitions, []);
});
