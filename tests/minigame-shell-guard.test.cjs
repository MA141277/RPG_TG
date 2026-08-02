const assert = require("node:assert/strict");
const test = require("node:test");

const {
  createDefaultScriptEditorProjectDefinition,
} = require("../.test-dist/modules/script-editor/application/minimal-workflow.js");
const {
  createDefaultScriptEditorMinigameRecord,
  listScriptEditorBuiltinMinigamePlayableOptions,
} = require("../.test-dist/modules/script-editor/application/minigame-binding-authoring.js");
const {
  exportScriptEditorProjectToScenarioPackFiles,
} = require("../.test-dist/modules/script-editor/application/runtime-pack-export.js");
const {
  loadScriptEditorProjectFromScenarioPackFiles,
} = require("../.test-dist/modules/script-editor/application/runtime-pack-import.js");
const {
  loadScenarioPackFromFiles,
} = require("../.test-dist/application/scenario/scenario-pack-loader.js");

function createImportedFilesFromSerializedJsonRecord(fileMap, folderName) {
  return Object.entries(fileMap).map(([fileName, contents]) => {
    const file = new File([contents], fileName, {
      type: "application/json",
    });

    Object.defineProperty(file, "webkitRelativePath", {
      configurable: true,
      value: `${folderName}/${fileName.replaceAll("\\", "/")}`,
    });

    return file;
  });
}

function createExportableProject() {
  return createDefaultScriptEditorProjectDefinition({
    idBase: "minigame-shell-guard",
    title: "Minigame Shell Guard",
  });
}

function createProjectWithMinigame(playableId) {
  const project = createExportableProject();
  project.minigames = [
    {
      ...createDefaultScriptEditorMinigameRecord("minigame.shell.guard"),
      title: "Shell Guard Minigame",
      playableId,
    },
  ];
  return project;
}

test("script editor minigame options only expose shell-backed playables", () => {
  const options = listScriptEditorBuiltinMinigamePlayableOptions();
  const optionIds = options.map((option) => option.id);

  assert.equal(optionIds.includes("story-battle"), false);
  assert.equal(optionIds.includes("activity-qte"), true);
  assert.equal(optionIds.includes("city-begging"), true);
  assert.equal(optionIds.includes("grain-accounting"), true);
  assert.equal(optionIds.includes("medicine-compounding"), true);
});

test("runtime export rejects shell-less minigame playable bindings", () => {
  const project = createProjectWithMinigame("story-battle");

  assert.throws(
    () => exportScriptEditorProjectToScenarioPackFiles(project),
    /requires a registered playable shell and cannot be exported as a minigame binding/i
  );
});

test("scenario pack loader rejects shell-less playables", async () => {
  const serializedFiles = exportScriptEditorProjectToScenarioPackFiles(
    createExportableProject()
  );
  const importedFiles = createImportedFilesFromSerializedJsonRecord(
    {
      ...serializedFiles,
      "playables.json": JSON.stringify(
        [
          {
            id: "story-battle",
            commandPrefix: "interactive.story-battle.",
          },
        ],
        null,
        2
      ),
    },
    "scenario-pack-shell-less-playable"
  );

  await assert.rejects(
    () => loadScenarioPackFromFiles(importedFiles),
    /playables\[0\] declares shell-less playable "story-battle"/i
  );
});

test("script editor runtime-pack import rejects shell-less playable integrations", async () => {
  const serializedFiles = exportScriptEditorProjectToScenarioPackFiles(
    createProjectWithMinigame("activity-qte")
  );
  const importedFiles = createImportedFilesFromSerializedJsonRecord(
    {
      ...serializedFiles,
      "playable-integrations.json": JSON.stringify(
        [
          {
            integrationId: "playable.story-battle.dialogue.default",
            playableId: "story-battle",
            ownerDefaults: {
              ownerKind: "dialogue",
              returnPolicy: "resume-owner",
            },
            trigger: {
              ownerKind: "dialogue",
              triggerId: "dialogue.test.story-battle",
              trigger: "manual-launch",
            },
            launchConfig: {},
            outcomeConfig: {
              settlementRoutes: [],
            },
          },
        ],
        null,
        2
      ),
    },
    "scenario-pack-shell-less-integration"
  );

  await assert.rejects(
    () => loadScriptEditorProjectFromScenarioPackFiles(importedFiles),
    /playableIntegrations\[0\] declares shell-less playable "story-battle"/i
  );
});
