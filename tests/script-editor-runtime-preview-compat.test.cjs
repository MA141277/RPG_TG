const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const {
  loadScriptEditorProjectFromScenarioPackFiles,
  loadScriptEditorProjectFromScenarioPackUrl,
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

function createJsonResponse(value) {
  return {
    ok: true,
    json: async () => value,
    text: async () => JSON.stringify(value),
  };
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

test("imported zhuyuanzhang public template imports canonical playable-shells during script-editor import", async () => {
  const templateRoot = path.join(
    process.cwd(),
    "public",
    "script-editor-templates",
    "zhuyuanzhang"
  );
  const canonicalPlayableShells = JSON.parse(
    fs.readFileSync(path.join(templateRoot, "playable-shells.json"), "utf8")
  );

  assert.equal(Array.isArray(canonicalPlayableShells), true);
  assert.ok(canonicalPlayableShells.length > 0);

  const files = await createScenarioPackFilesFromTemplateDirectory(templateRoot);
  const project = await loadScriptEditorProjectFromScenarioPackFiles(files);

  assert.equal(project.flows.length, canonicalPlayableShells.length);
  assert.equal(project.flows[0]?.id, canonicalPlayableShells[0]?.id);
});

test("script-editor URL import preserves canonical playable-shells from public template manifest", async () => {
  const templateRoot = path.join(
    process.cwd(),
    "public",
    "script-editor-templates",
    "zhuyuanzhang"
  );
  const manifest = JSON.parse(
    fs.readFileSync(path.join(templateRoot, "pack.json"), "utf8")
  );
  const canonicalPlayableShells = JSON.parse(
    fs.readFileSync(path.join(templateRoot, "playable-shells.json"), "utf8")
  );
  const originalFetch = global.fetch;

  global.fetch = async (input) => {
    const url = typeof input === "string" ? input : input.url;
    const fileName = url.split("/").pop();
    if (fileName == null) {
      return { ok: false, status: 404 };
    }

    if (fileName === "pack.json") {
      return createJsonResponse(manifest);
    }

    const filePath = path.join(templateRoot, fileName);
    if (!fs.existsSync(filePath)) {
      return { ok: false, status: 404 };
    }

    return createJsonResponse(JSON.parse(fs.readFileSync(filePath, "utf8")));
  };

  try {
    const project = await loadScriptEditorProjectFromScenarioPackUrl(
      "https://example.test/script-editor-templates/zhuyuanzhang/pack.json"
    );

    assert.equal(project.flows.length, canonicalPlayableShells.length);
    assert.equal(project.flows[0]?.id, canonicalPlayableShells[0]?.id);
  } finally {
    global.fetch = originalFetch;
  }
});

test("zhuyuanzhang runtime and editor template startup profiles stay aligned", () => {
  const runtimeProfile = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "src",
        "content",
        "scenario-packs",
        "zhuyuanzhang",
        "scenario-profile.json"
      ),
      "utf8"
    )
  );
  const builtinTemplateProfile = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "src",
        "modules",
        "script-editor",
        "builtin-templates",
        "zhuyuanzhang",
        "scenario-profile.json"
      ),
      "utf8"
    )
  );
  const publicTemplateProfile = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "public",
        "script-editor-templates",
        "zhuyuanzhang",
        "scenario-profile.json"
      ),
      "utf8"
    )
  );

  assert.deepEqual(builtinTemplateProfile, runtimeProfile);
  assert.deepEqual(publicTemplateProfile, runtimeProfile);
});

test("zhuyuanzhang default player startup presentation stays aligned across runtime and templates", () => {
  const files = [
    path.join(
      process.cwd(),
      "src",
      "content",
      "scenario-packs",
      "zhuyuanzhang",
      "characters.json"
    ),
    path.join(
      process.cwd(),
      "src",
      "modules",
      "script-editor",
      "builtin-templates",
      "zhuyuanzhang",
      "characters.json"
    ),
    path.join(
      process.cwd(),
      "public",
      "script-editor-templates",
      "zhuyuanzhang",
      "characters.json"
    ),
  ];

  for (const file of files) {
    const record = JSON.parse(fs.readFileSync(file, "utf8")).find(
      (entry) => entry.id === "char.player"
    );
    assert.equal(record?.title, "流民");
    assert.equal("clanId" in (record ?? {}), false);
    assert.equal("affiliationLabel" in (record ?? {}), false);
  }
});

test("zhuyuanzhang startup template sync tool reports canonical startup files are aligned", () => {
  const toolPath = path.join(
    process.cwd(),
    "tools",
    "sync-zhuyuanzhang-startup-templates.mjs"
  );

  assert.equal(fs.existsSync(toolPath), true);

  const output = execFileSync(process.execPath, [toolPath, "--check"], {
    cwd: process.cwd(),
    encoding: "utf8",
  });

  assert.match(output, /already aligned|up to date|no changes/i);
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

test("template runtime-pack export preserves aligned zhuyuanzhang startup profile fields", async () => {
  const templateRoot = path.join(
    process.cwd(),
    "public",
    "script-editor-templates",
    "zhuyuanzhang"
  );
  const files = await createScenarioPackFilesFromTemplateDirectory(templateRoot);
  const project = await loadScriptEditorProjectFromScenarioPackFiles(files);
  const exportedFiles = exportScriptEditorProjectToScenarioPackFiles(project);
  const exportedProfile = JSON.parse(exportedFiles["scenario-profile.json"]);

  assert.deepEqual(exportedProfile.initialCalendar, {
    year: 1567,
    month: 1,
    day: 1,
  });
  assert.deepEqual(exportedProfile.initialUi, {
    reviewDateText: "今日评定",
    mainHouseMissionText: "前往皇觉寺听候住持训示",
  });
  assert.deepEqual(exportedProfile.launchPolicy, {
    characterSelection: "select",
    initialView: "map",
  });
  assert.deepEqual(
    exportedProfile.characterStartups?.map((record) => ({
      characterId: record.characterId,
      initialUi: record.initialUi,
    })),
    [
      {
        characterId: "char.kulan_xu_da",
        initialUi: {
          reviewDateText: "距离评定 40 天",
          mainHouseMissionText: "前往评定会场",
        },
      },
      {
        characterId: "char.kulan_tang_he",
        initialUi: {
          reviewDateText: "距离评定 40 天",
          mainHouseMissionText: "前往评定会场",
        },
      },
      {
        characterId: "char.kulan_chang_yuchun",
        initialUi: {
          reviewDateText: "距离评定 40 天",
          mainHouseMissionText: "前往评定会场",
        },
      },
    ]
  );
});

test("scene runner accepts playableShellsById for flow-backed event actions through runtime preview", () => {
  configureFlowRuntimeRegistries();

  try {
    const eventDefinition = {
      id: "event.playable.flow-preview.canonical",
      chapterId: "chapter.test",
      name: "Flow Preview Canonical",
      occurrence: "repeatable",
      trigger: { timing: "manual" },
      conditions: [],
      entrySceneId: "scene.playable.flow-preview.canonical",
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

    const playableShellsById = {
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
      playableShellsById,
    });

    assert.equal(result.state.ui.currentView, "minigame");
    assert.equal(
      result.state.runtime.playableSession?.playableId,
      "flow.test.runtime-preview"
    );
    assert.equal(
      result.state.runtime.playableSession?.ownerContext.sessionToken,
      "event.playable.flow-preview.canonical"
    );
  } finally {
    resetDefaultPlayableRuntimeRegistries();
  }
});
