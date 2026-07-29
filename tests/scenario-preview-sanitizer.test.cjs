const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

assert.equal(
  fs.existsSync(
    path.join(
      process.cwd(),
      "src",
      "application",
      "startup",
      "scenario-preview-sanitizer.ts"
    )
  ),
  true,
  "scenario preview sanitizer source module should exist"
);

const {
  sanitizeScenarioPackForRuntimePreview,
} = require("../.test-dist/application/startup/scenario-preview-sanitizer.js");

function createScenarioPack(launchPolicy, entryEventId = "event.entry") {
  return {
    schemaVersion: 1,
    id: "pack.test",
    title: "Pack",
    scenarioProfile: {
      id: "scenario.test",
      title: "Scenario",
      playerCharacterId: "char.player",
      chapterId: "chapter.test",
      initialLocation: {
        mapId: "map.test",
        cityId: "city.test",
        houseId: null,
        view: "map",
      },
      ...(entryEventId == null ? {} : { entryEventId }),
      ...(launchPolicy == null ? {} : { launchPolicy }),
    },
  };
}

test("runtime preview strips deferred entry event policy from scenario packs", () => {
  const sourcePack = createScenarioPack({
    characterSelection: "select",
    initialView: "map",
    entryEventTiming: "after-map-entry",
  });

  const sanitized = sanitizeScenarioPackForRuntimePreview(sourcePack);

  assert.notEqual(sanitized, sourcePack);
  assert.equal(sanitized.scenarioProfile.entryEventId, undefined);
  assert.deepEqual(sanitized.scenarioProfile.launchPolicy, {
    characterSelection: "select",
    initialView: "map",
  });
  assert.equal(
    sourcePack.scenarioProfile.entryEventId,
    "event.entry",
    "source pack should not be mutated"
  );
});

test("runtime preview leaves immediate entry event scenario packs unchanged", () => {
  const sourcePack = createScenarioPack({
    characterSelection: "fixed",
    entryEventTiming: "immediate",
  });

  assert.equal(sanitizeScenarioPackForRuntimePreview(sourcePack), sourcePack);
});

test("runtime preview removes empty launch policy after stripping deferred timing", () => {
  const sanitized = sanitizeScenarioPackForRuntimePreview(
    createScenarioPack({ entryEventTiming: "after-map-entry" })
  );

  assert.equal(sanitized.scenarioProfile.entryEventId, undefined);
  assert.equal(sanitized.scenarioProfile.launchPolicy, undefined);
});
