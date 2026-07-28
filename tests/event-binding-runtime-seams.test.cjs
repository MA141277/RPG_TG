const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("event binding runtime seam modules exist in source", () => {
  assert.equal(
    fs.existsSync(
      path.join(process.cwd(), "src/core/runtime/event-binding-runtime.ts")
    ),
    true
  );
  assert.equal(
    fs.existsSync(
      path.join(
        process.cwd(),
        "src/core/runtime/building-owner-canonicalization.ts"
      )
    ),
    true
  );
});

test("matchesCanonicalBuildingOwnerId accepts template and source house owners", () => {
  const {
    matchesCanonicalBuildingOwnerId,
  } = require("../.test-dist/core/runtime/building-owner-canonicalization.js");

  assert.equal(
    matchesCanonicalBuildingOwnerId(
      "house.template.temple",
      "house.haozhou.temple"
    ),
    true
  );
  assert.equal(
    matchesCanonicalBuildingOwnerId("home.template", "home_1"),
    true
  );
  assert.equal(
    matchesCanonicalBuildingOwnerId(
      "house.template.temple",
      "house.haozhou.market"
    ),
    false
  );
});

test("event-binding-runtime re-exports the mod-first runtime shell", () => {
  const {
    runModFirstEventBindingRuntime,
  } = require("../.test-dist/core/runtime/event-binding-runtime.js");

  const state = {
    calendar: { chapterId: "chapter-1" },
    runtime: {
      flags: {},
      variables: {},
      eventHistory: {},
    },
  };
  const result = runModFirstEventBindingRuntime({
    state,
    eventDefinitionsById: {
      eventA: {
        id: "eventA",
        chapterId: "chapter-1",
        name: "Event A",
        occurrence: "repeatable",
        trigger: { timing: "manual" },
        conditions: [],
        entrySceneId: "scene.eventA",
      },
    },
    eventBindings: [
      {
        id: "binding-a",
        eventId: "eventA",
        owner: { family: "city", id: "haozhou" },
        trigger: { timing: "after", action: "city-enter" },
      },
    ],
    triggerContext: {
      timing: "after",
      action: "city-enter",
      owner: { family: "city", id: "haozhou" },
    },
  });

  assert.equal(result.activation.activeEventId, "eventA");
  assert.equal(result.state, state);
});
