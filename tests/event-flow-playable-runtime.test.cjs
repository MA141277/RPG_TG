const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  prototypeCharacters,
  prototypeMap,
} = require("../.test-dist/content/prototype-world.js");
const {
  runEventPlayableRuntime,
} = require("../.test-dist/application/events/event-playable-runtime.js");
const {
  configureDefaultPlayableRuntimeRegistriesFromActivatedMod,
  resetDefaultPlayableRuntimeRegistries,
} = require("../.test-dist/core/runtime/playable-runtime-registries.js");
const {
  createLaunchPlayableRequest,
  runPlayableRuntime,
} = require("../.test-dist/core/runtime/playable-runtime.js");

function createBaseState() {
  return createInitialState({
    currentMapId: prototypeMap.id,
    currentCityId: "city.kulan",
    currentHouseId: "house.kulan.temple",
    playerCharacterId: "char.player",
    chapterId: "chapter.prototype",
    year: 1567,
    month: 1,
    day: 1,
    pinnedCharacterId: "char.player",
    reviewDateText: "test",
    mainHouseMissionText: "test",
    currentView: "dialogue",
  });
}

test("event playable runtime launches flow playables through launchPlayable on the shared shell path", () => {
  const flowId = "flow.test.rest";
  const integrationId = `playable.${flowId}.default`;
  try {
    configureDefaultPlayableRuntimeRegistriesFromActivatedMod({
      modId: "mod.test.event-flow-launch",
      manifest: {
        id: "mod.test.event-flow-launch",
        schemaVersion: "1",
        version: "1.0.0",
        title: "Event Flow Launch Test",
        entryContentPackIds: ["pack.test.event-flow-launch"],
      },
      normalizedContentSources: [
        {
          playableShells: [
            {
              id: flowId,
              title: "Rest Flow",
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
                },
              ],
            },
          ],
        },
      ],
      registeredDefinitionIds: ["pack.test.event-flow-launch"],
      gameplayContributions: {
        contentPackIds: ["pack.test.event-flow-launch"],
        navigation: [],
        events: [],
        scenes: [],
        dialogues: [],
        tasks: [],
        houses: [],
        houseModules: [],
        playables: [flowId],
        playableIntegrations: [integrationId],
      },
      startupProfile: {},
    });

    const result = runEventPlayableRuntime({
      state: createBaseState(),
      characterDefinitions: prototypeCharacters,
      eventDefinition: {
        id: "event.test.flow-launch",
        actions: [
          {
            type: "launchPlayable",
            playableId: flowId,
            integrationId,
            ownerContext: {
              ownerKind: "house",
              ownerId: "house.kulan.temple",
              returnPolicy: "resume-owner",
            },
          },
        ],
      },
    });

    assert.equal(result?.handled, true);
    assert.equal(result?.state.ui.currentView, "minigame");
    assert.equal(result?.state.dialogue.status, "idle");
    assert.equal(result?.state.runtime.playableSession?.playableId, flowId);
    assert.equal(
      result?.state.runtime.playableSession?.ownerContext.sessionToken,
      "event.test.flow-launch"
    );
  } finally {
    resetDefaultPlayableRuntimeRegistries();
  }
});

test("building container and event runtime no longer own legacy flow launch branches", () => {
  const source = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/application/building/building-container-event-runtime.ts"
    ),
    "utf8"
  );

  assert.doesNotMatch(source, /launchFlowPlayable/);
  assert.doesNotMatch(source, /const launchFlowAction = activeEvent\?\./);

  const eventRuntimeSource = fs.readFileSync(
    path.join(process.cwd(), "src/application/events/event-playable-runtime.ts"),
    "utf8"
  );
  assert.doesNotMatch(eventRuntimeSource, /launchFlowPlayable/);
  assert.doesNotMatch(eventRuntimeSource, /action\.type === "launchFlow"/);
});

test("playable runtime no longer owns legacy building-flow or direct flow reducer branches", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/playable-runtime.ts"),
    "utf8"
  );

  assert.doesNotMatch(source, /building-flow/);
  assert.doesNotMatch(source, /launchFlowPlayable/);
  assert.doesNotMatch(source, /reduceFlowPlayable/);
  assert.doesNotMatch(source, /playableShellsById/);
});

test("playable runtime registries stay browser-safe for script editor preview", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/playable-runtime-registries.ts"),
    "utf8"
  );

  assert.doesNotMatch(source, /\brequire\s*\(/);
  assert.doesNotMatch(source, /declare const require/);
});

test("builtin playable registries no longer advertise building-flow", () => {
  const definitionRegistrySource = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/core/registry/builtin-playable-definition-registry.ts"
    ),
    "utf8"
  );
  const integrationRegistrySource = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/core/registry/builtin-playable-integration-registry.ts"
    ),
    "utf8"
  );

  assert.doesNotMatch(definitionRegistrySource, /building-flow/);
  assert.doesNotMatch(integrationRegistrySource, /building-flow/);
});

test("app render no longer special-cases flow playables outside the shell contract", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/ui/app-render.ts"),
    "utf8"
  );

  assert.doesNotMatch(source, /renderFlowPlayableView/);
  assert.doesNotMatch(source, /renderFlowPlayableOverlay/);
  assert.doesNotMatch(source, /playableShellsById/);
});

test("authoring templates and export no longer emit launchFlow or building-flow ids", () => {
  const exportSource = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/modules/script-editor/application/runtime-pack-export.ts"
    ),
    "utf8"
  );
  const builtinTemplateEvents = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/modules/script-editor/builtin-templates/zhuyuanzhang/events.json"
    ),
    "utf8"
  );
  const scenarioEvents = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/content/scenario-packs/zhuyuanzhang/events.json"
    ),
    "utf8"
  );
  const scriptEditorUiSource = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/modules/script-editor/ui/main-ui-script-editor-module.js"
    ),
    "utf8"
  );

  assert.doesNotMatch(exportSource, /launchFlow actions require/);
  assert.doesNotMatch(exportSource, /launchFlow runtime actions/);
  assert.doesNotMatch(builtinTemplateEvents, /"type": "launchFlow"/);
  assert.doesNotMatch(scenarioEvents, /"type": "launchFlow"/);
  assert.doesNotMatch(scriptEditorUiSource, /building-flow/);
});
