const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");

const {
  loadScriptEditorProjectFromScenarioPackFiles,
} = require("../.test-dist/modules/script-editor/application/runtime-pack-import.js");
const {
  validateScriptEditorProjectForRuntimeExport,
  exportScriptEditorProjectToScenarioPackFiles,
} = require("../.test-dist/modules/script-editor/application/runtime-pack-export.js");
const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  startEvent,
} = require("../.test-dist/application/events/event-runner.js");
const {
  runSceneUntilPause,
} = require("../.test-dist/application/scene/scene-runner.js");
const {
  configureDefaultPlayableRuntimeRegistriesFromActivatedMod,
  resetDefaultPlayableRuntimeRegistries,
} = require("../.test-dist/core/runtime/playable-runtime-registries.js");

async function createScenarioPackFilesFromTemplateDirectory(root) {
  const files = [];

  async function walk(dir) {
    for (const name of await fsp.readdir(dir)) {
      const fullPath = path.join(dir, name);
      const stat = await fsp.stat(fullPath);
      if (stat.isDirectory()) {
        await walk(fullPath);
        continue;
      }

      const bytes = await fsp.readFile(fullPath);
      const relativePath = path.relative(root, fullPath).split(path.sep).join("/");
      files.push(new File([bytes], relativePath));
    }
  }

  await walk(root);
  return files;
}

function createBaseState() {
  return createInitialState({
    currentMapId: "map.test",
    currentCityId: "city.test",
    currentHouseId: "house.test",
    playerCharacterId: "char.player",
    chapterId: "chapter.test",
    year: 1351,
    month: 1,
    day: 2,
    pinnedCharacterId: "char.player",
    reviewDateText: "test",
    mainHouseMissionText: "test",
    currentView: "house",
  });
}

function configureFlowRuntimeRegistries() {
  configureDefaultPlayableRuntimeRegistriesFromActivatedMod({
    modId: "mod.test.script-editor-runtime-preview",
    manifest: {
      id: "mod.test.script-editor-runtime-preview",
      schemaVersion: "1",
      version: "1.0.0",
      title: "Script Editor Runtime Preview Compat Test",
      entryContentPackIds: ["pack.test.script-editor-runtime-preview"],
    },
    normalizedContentSources: [
      {
        playables: [
          {
            id: "flow.test.runtime-preview",
            commandPrefix: "playable.flow.test.runtime-preview.",
          },
        ],
        playableIntegrations: [
          {
            integrationId: "playable.flow.test.runtime-preview.house.default",
            playableId: "flow.test.runtime-preview",
            ownerDefaults: {
              ownerKind: "house",
              ownerId: "house.test",
              returnPolicy: "reenter-owner",
            },
            trigger: {
              triggerId: "trigger.playable.flow.test.runtime-preview.house.default",
              ownerKind: "house",
              trigger: "manual-launch",
            },
            outcomeConfig: {},
          },
        ],
      },
    ],
    registeredDefinitionIds: ["pack.test.script-editor-runtime-preview"],
    gameplayContributions: {
      contentPackIds: ["pack.test.script-editor-runtime-preview"],
      navigation: [],
      events: [],
      scenes: [],
      dialogues: [],
      tasks: [],
      houses: [],
      houseModules: [],
      playables: ["flow.test.runtime-preview"],
      playableIntegrations: ["playable.flow.test.runtime-preview.house.default"],
    },
    startupProfile: {},
  });
}

test("imported zhuyuanzhang script-editor template stays exportable for runtime preview", async () => {
  const templateRoot = path.join(
    process.cwd(),
    "public",
    "script-editor-templates",
    "zhuyuanzhang"
  );
  assert.equal(fs.existsSync(templateRoot), true);

  const files = await createScenarioPackFilesFromTemplateDirectory(templateRoot);
  const project = await loadScriptEditorProjectFromScenarioPackFiles(files);
  const diagnostics = validateScriptEditorProjectForRuntimeExport(project);

  assert.deepEqual(diagnostics, []);
});

test("runtime-pack round trip preserves menu destinations for retained template events", async () => {
  const templateRoot = path.join(
    process.cwd(),
    "public",
    "script-editor-templates",
    "zhuyuanzhang"
  );
  assert.equal(fs.existsSync(templateRoot), true);

  const files = await createScenarioPackFilesFromTemplateDirectory(templateRoot);
  const project = await loadScriptEditorProjectFromScenarioPackFiles(files);
  const exportedFiles = exportScriptEditorProjectToScenarioPackFiles(project);
  const roundTripProject = await loadScriptEditorProjectFromScenarioPackFiles(
    Object.entries(exportedFiles).map(
      ([relativePath, content]) => new File([content], relativePath)
    )
  );

  const roundTripEvent = roundTripProject.events.find((event) => event.id === "460001");
  assert.deepEqual(roundTripEvent?.destination, {
    family: "menu",
    targetId: "overview",
  });
  assert.equal(
    roundTripEvent?.actions?.some((action) => action.type === "openCityMenuPanel"),
    false
  );
  assert.deepEqual(validateScriptEditorProjectForRuntimeExport(roundTripProject), []);
});

test("scene runner launches flow-backed event actions through runtime preview", () => {
  configureFlowRuntimeRegistries();

  try {
    const eventDefinition = {
      id: "event.playable.flow-preview",
      chapterId: "chapter.test",
      name: "Flow Preview",
      occurrence: "repeatable",
      trigger: { timing: "manual" },
      conditions: [],
      entrySceneId: "scene.playable.flow-preview",
      actions: [
        {
          type: "launchPlayable",
          playableId: "flow.test.runtime-preview",
          integrationId: "playable.flow.test.runtime-preview.house.default",
          ownerContext: {
            ownerKind: "house",
            ownerId: "house.test",
            returnPolicy: "reenter-owner",
          },
        },
      ],
    };

    const flowPlayablesById = {
      "flow.test.runtime-preview": {
        id: "flow.test.runtime-preview",
        title: "Flow Preview",
        initialNodeId: "node.start",
        nodes: [
          {
            id: "node.start",
            type: "text",
            text: "Flow preview start",
            nextNodeId: "node.complete",
          },
          {
            id: "node.complete",
            type: "complete",
            outcome: "success",
            detail: { source: "runtime-preview" },
          },
        ],
      },
    };

    const result = runSceneUntilPause(startEvent(createBaseState(), eventDefinition), {
      sceneDefinitionsById: {},
      eventDefinitionsById: {
        [eventDefinition.id]: eventDefinition,
      },
      characterDefinitions: [{ id: "char.player", name: "Player" }],
      flowPlayablesById,
    });

    assert.equal(result.state.ui.currentView, "minigame");
    assert.equal(
      result.state.runtime.playableSession?.playableId,
      "flow.test.runtime-preview"
    );
    assert.equal(
      result.state.runtime.playableSession?.ownerContext.sessionToken,
      "event.playable.flow-preview"
    );
  } finally {
    resetDefaultPlayableRuntimeRegistries();
  }
});
