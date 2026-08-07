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
  loadScenarioPackFromFiles,
} = require("../.test-dist/application/scenario/scenario-pack-loader.js");
const {
  parseScriptEditorProject,
} = require("../.test-dist/modules/script-editor/application/editor-project-loader.js");
const {
  normalizeScriptEditorBuildingRecord,
  normalizeScriptEditorCityRecord,
} = require("../.test-dist/modules/script-editor/application/city-building-authoring.js");
const {
  normalizeScriptEditorPortraitRecord,
  normalizeScriptEditorPortraitVariantRecord,
} = require("../.test-dist/modules/script-editor/application/portrait-authoring.js");
const {
  normalizeScriptEditorFlowRecord,
} = require("../.test-dist/modules/script-editor/application/flow-authoring.js");
const {
  validateScriptEditorProjectForRuntimeExport,
  exportScriptEditorProjectToScenarioPackFiles,
} = require("../.test-dist/modules/script-editor/application/runtime-pack-export.js");
const {
  normalizeScriptEditorMinigameRecord,
} = require("../.test-dist/modules/script-editor/application/minigame-binding-authoring.js");
const {
  normalizeScriptEditorEventBindingRecord,
  normalizeScriptEditorEventRecord,
  normalizeScriptEditorProgressTrackBindingRecord,
  normalizeScriptEditorProgressTrackRecord,
  normalizeScriptEditorSettlementRecord,
  normalizeScriptEditorStoryNodeRecord,
} = require("../.test-dist/modules/script-editor/application/story-dialogue-event-authoring.js");
const workflow = require("../.test-dist/modules/script-editor/application/minimal-workflow.js");
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

test("script editor preview fails closed when no previewHost is injected", () => {
  const source = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/modules/script-editor/kernel/script-editor-workflow-controller.ts"
    ),
    "utf8"
  );

  assert.match(source, /getPreviewHost\(\)/);
  assert.doesNotMatch(source, /setScreen\\("runtime-preview"\\)/);
  assert.doesNotMatch(source, /captureRuntimePreviewReturnContext/);
  assert.doesNotMatch(source, /restoreRuntimePreviewReturnContext/);
  assert.doesNotMatch(source, /startLoadedScenarioPack/);
});

test("embedded script editor session keeps loaded-scenario-pack preview adaptation outside the kernel", () => {
  const sessionSource = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/modules/script-editor/kernel/script-editor-session.ts"
    ),
    "utf8"
  );
  const mainUiSource = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/ui/main-ui/main-ui-flow.js"
    ),
    "utf8"
  );

  assert.doesNotMatch(sessionSource, /loadScenarioPackFromFiles/);
  assert.doesNotMatch(sessionSource, /createTextImportFilesFromRecord/);
  assert.doesNotMatch(sessionSource, /onStartLoadedScenarioPack/);
  assert.doesNotMatch(sessionSource, /loaded-scenario-pack-preview-host/);
  assert.match(mainUiSource, /onStartLoadedScenarioPack/);
  assert.match(mainUiSource, /loaded-scenario-pack-preview-host/);
});

test("loaded-scenario-pack preview host helper keeps scenario-pack loader outside the current project shell", () => {
  const mainUiSource = fs.readFileSync(
    path.join(process.cwd(), "src/ui/main-ui/main-ui-flow.js"),
    "utf8"
  );

  assert.doesNotMatch(mainUiSource, /application\/scenario\/scenario-pack-loader/);
  assert.match(mainUiSource, /loaded-scenario-pack-preview-host/);
  assert.equal(
    fs.existsSync(
      path.join(
        process.cwd(),
        "src/modules/script-editor/host/loaded-scenario-pack-preview-host.ts"
      )
    ),
    true
  );
});

test("script editor package centralizes scenario-pack loader usage behind a local codec file", () => {
  const runtimePackImportSource = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/modules/script-editor/application/runtime-pack-import.ts"
    ),
    "utf8"
  );
  const runtimePackExportSource = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/modules/script-editor/application/runtime-pack-export.ts"
    ),
    "utf8"
  );
  const loadedPreviewHostSource = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/modules/script-editor/host/loaded-scenario-pack-preview-host.ts"
    ),
    "utf8"
  );

  assert.doesNotMatch(
    runtimePackImportSource,
    /application\/scenario\/scenario-pack-loader/
  );
  assert.doesNotMatch(
    runtimePackExportSource,
    /application\/scenario\/scenario-pack-loader/
  );
  assert.doesNotMatch(
    loadedPreviewHostSource,
    /application\/scenario\/scenario-pack-loader/
  );
  assert.match(runtimePackImportSource, /script-editor-scenario-pack-codec/);
  assert.match(runtimePackExportSource, /script-editor-scenario-pack-codec/);
  assert.match(loadedPreviewHostSource, /script-editor-scenario-pack-codec/);
  assert.equal(
    fs.existsSync(
      path.join(
        process.cwd(),
        "src/modules/script-editor/application/script-editor-scenario-pack-codec.ts"
      )
    ),
    true
  );
});

test("imported zhuyuanzhang script-editor template stays exportable for runtime preview", async () => {
  const templateRoot = path.join(
    process.cwd(),
    "public",
    "builtin-script-editor-templates",
    "zhuyuanzhang"
  );
  assert.equal(fs.existsSync(templateRoot), true);

  const files = await createScenarioPackFilesFromTemplateDirectory(templateRoot);
  const project = await loadScriptEditorProjectFromScenarioPackFiles(files);
  const diagnostics = validateScriptEditorProjectForRuntimeExport(project);

  assert.deepEqual(diagnostics, []);
});

test("runtime preview can load exported zhuyuanzhang template packs that inline map assets as data urls", async () => {
  const templateRoot = path.join(
    process.cwd(),
    "public",
    "builtin-script-editor-templates",
    "zhuyuanzhang"
  );
  assert.equal(fs.existsSync(templateRoot), true);

  const files = await createScenarioPackFilesFromTemplateDirectory(templateRoot);
  const project = await loadScriptEditorProjectFromScenarioPackFiles(files);
  const exportedFiles = exportScriptEditorProjectToScenarioPackFiles(project);
  const importedFiles = Object.entries(exportedFiles).map(
    ([relativePath, content]) => new File([content], relativePath)
  );

  const pack = await loadScenarioPackFromFiles(importedFiles);
  const yuanmoCampaignMap = pack.maps.find(
    (mapRecord) => mapRecord.id === "map.yuanmo_campaign"
  );

  assert.equal(pack.id, "scenario-pack.zhu_yuanzhang.monk_opening");
  assert.ok(yuanmoCampaignMap);
  assert.equal(
    typeof yuanmoCampaignMap.primaryImageUrl === "string" &&
      (yuanmoCampaignMap.primaryImageUrl.startsWith("blob:") ||
        yuanmoCampaignMap.primaryImageUrl.startsWith("data:image/")),
    true
  );
});

test("imported zhuyuanzhang registered builtin template imports canonical playable-shells during script-editor import", async () => {
  const templateRoot = path.join(
    process.cwd(),
    "public",
    "builtin-script-editor-templates",
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

test("imported zhuyuanzhang registered builtin template keeps canonical review dialogues and dialogue-backed review events", async () => {
  const templateRoot = path.join(
    process.cwd(),
    "public",
    "builtin-script-editor-templates",
    "zhuyuanzhang"
  );
  const files = await createScenarioPackFilesFromTemplateDirectory(templateRoot);
  const project = await loadScriptEditorProjectFromScenarioPackFiles(files);

  for (const [eventId, dialogueId] of [
    [
      "event.building.template.house.temple.review",
      "scene.building.template.house.temple.review",
    ],
    [
      "event.building.template.house.leader_residence.review",
      "scene.building.template.house.leader_residence.review",
    ],
  ]) {
    const eventRecord = project.events.find((record) => record.id === eventId);
    const dialogueRecord = project.dialogues.find(
      (record) => record.id === dialogueId
    );

    assert.notEqual(eventRecord, undefined);
    assert.notEqual(dialogueRecord, undefined);
    assert.deepEqual(eventRecord.actions, []);
    assert.deepEqual(eventRecord.destination, {
      family: "dialogue",
      targetId: dialogueId,
    });
  }
});

test("imported zhuyuanzhang registered builtin template keeps canonical settlement family", async () => {
  const templateRoot = path.join(
    process.cwd(),
    "public",
    "builtin-script-editor-templates",
    "zhuyuanzhang"
  );
  const files = await createScenarioPackFilesFromTemplateDirectory(templateRoot);
  const project = await loadScriptEditorProjectFromScenarioPackFiles(files);
  const templateSettlements = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "src",
        "modules",
        "script-editor",
        "builtin-templates",
        "zhuyuanzhang",
        "settlements.json"
      ),
      "utf8"
    )
  );

  assert.equal(project.settlements.length, templateSettlements.length);
});

test("imported zhuyuanzhang registered builtin template keeps temple-copy-scripture playable integrations", async () => {
  const templateRoot = path.join(
    process.cwd(),
    "public",
    "builtin-script-editor-templates",
    "zhuyuanzhang"
  );
  const files = await createScenarioPackFilesFromTemplateDirectory(templateRoot);
  const project = await loadScriptEditorProjectFromScenarioPackFiles(files);

  assert.equal(
    project.minigames.some((record) => record.playableId === "temple-copy-scripture"),
    true
  );
  assert.equal(
    project.minigames.some((record) => record.playableId === "grain-accounting"),
    true
  );
  assert.equal(
    project.minigames.some((record) => record.playableId === "medicine-compounding"),
    true
  );
  const cityDefaultMenu = project.menuResources.find(
    (record) => record.id === "menu-resource.city.default"
  );
  assert.equal(
    cityDefaultMenu?.entries.some((entry) => entry.id === "menu-entry.city.default.grain-accounting"),
    true
  );
  assert.equal(
    cityDefaultMenu?.entries.some((entry) => entry.id === "menu-entry.city.default.medicine-compounding"),
    true
  );
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
        "builtin-script-editor-templates",
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
      "builtin-script-editor-templates",
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
    "builtin-script-editor-templates",
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

test("runtime-pack round trip preserves launchFlow event actions as flow-owned payload actions", async () => {
  const project = workflow.createDefaultScriptEditorProjectDefinition();
  const flowRecord = {
    ...workflow.createScriptEditorWorkflowRecordDraft("flows", project),
    id: "flow.runtime.roundtrip",
    title: "Runtime Flow Round Trip",
  };
  project.flows = [...project.flows, flowRecord];
  project.events = project.events.map((eventRecord) =>
    eventRecord.id !== "event.opening"
      ? eventRecord
      : {
          ...eventRecord,
          destination: {
            family: "event",
            targetId: "",
          },
          actions: [
            {
              type: "launchFlow",
              flowId: flowRecord.id,
              ownerContext: {
                ownerKind: "external",
                ownerId: null,
                returnPolicy: "close-only",
              },
            },
          ],
        }
  );

  assert.deepEqual(validateScriptEditorProjectForRuntimeExport(project), []);

  const exportedFiles = exportScriptEditorProjectToScenarioPackFiles(project);
  const roundTripProject = await loadScriptEditorProjectFromScenarioPackFiles(
    Object.entries(exportedFiles).map(
      ([relativePath, content]) => new File([content], relativePath)
    )
  );
  const roundTripEvent = roundTripProject.events.find(
    (eventRecord) => eventRecord.id === "event.opening"
  );

  assert.deepEqual(roundTripEvent?.actions, [
    {
      type: "launchFlow",
      flowId: flowRecord.id,
      ownerContext: {
        ownerKind: "external",
        ownerId: null,
        returnPolicy: "close-only",
      },
    },
  ]);
});

test("runtime-pack round trip keeps explicit launchPlayable actions on the payload seam", async () => {
  const project = workflow.createDefaultScriptEditorProjectDefinition();
  const minigameRecord = {
    ...workflow.createScriptEditorWorkflowRecordDraft("minigames", project),
    id: "minigame.runtime.payload.roundtrip",
    title: "Runtime Payload Minigame",
    playableId: "activity-qte",
  };
  project.minigames = [...project.minigames, minigameRecord];
  project.events = project.events.map((eventRecord) =>
    eventRecord.id !== "event.opening"
      ? eventRecord
      : {
          ...eventRecord,
          destination: {
            family: "event",
            targetId: "",
          },
          actions: [
            {
              type: "launchPlayable",
              playableId: "activity-qte",
              integrationId: `playable.activity-qte.instance.${minigameRecord.id}`,
              ownerContext: {
                ownerKind: "external",
                ownerId: null,
                returnPolicy: "close-only",
              },
              payload: {
                source: "event-action",
              },
            },
          ],
        }
  );

  assert.deepEqual(validateScriptEditorProjectForRuntimeExport(project), []);

  const exportedFiles = exportScriptEditorProjectToScenarioPackFiles(project);
  const roundTripProject = await loadScriptEditorProjectFromScenarioPackFiles(
    Object.entries(exportedFiles).map(
      ([relativePath, content]) => new File([content], relativePath)
    )
  );
  const roundTripEvent = roundTripProject.events.find(
    (eventRecord) => eventRecord.id === "event.opening"
  );

  assert.deepEqual(roundTripEvent?.destination, {
    family: "event",
    targetId: "",
  });
  assert.deepEqual(roundTripEvent?.actions, [
    {
      type: "launchPlayable",
      playableId: "activity-qte",
      integrationId: `playable.activity-qte.instance.${minigameRecord.id}`,
      ownerContext: {
        ownerKind: "external",
        ownerId: null,
        returnPolicy: "close-only",
      },
      payload: {
        source: "event-action",
      },
    },
  ]);
});

test("runtime-pack round trip keeps explicit openCityMenuPanel actions on the payload seam", async () => {
  const project = workflow.createDefaultScriptEditorProjectDefinition();
  project.events = project.events.map((eventRecord) =>
    eventRecord.id !== "event.opening"
      ? eventRecord
      : {
          ...eventRecord,
          destination: {
            family: "event",
            targetId: "",
          },
          actions: [
            {
              type: "openCityMenuPanel",
              panelId: "intel",
            },
          ],
        }
  );

  assert.deepEqual(validateScriptEditorProjectForRuntimeExport(project), []);

  const exportedFiles = exportScriptEditorProjectToScenarioPackFiles(project);
  const roundTripProject = await loadScriptEditorProjectFromScenarioPackFiles(
    Object.entries(exportedFiles).map(
      ([relativePath, content]) => new File([content], relativePath)
    )
  );
  const roundTripEvent = roundTripProject.events.find(
    (eventRecord) => eventRecord.id === "event.opening"
  );

  assert.deepEqual(roundTripEvent?.destination, {
    family: "event",
    targetId: "",
  });
  assert.deepEqual(roundTripEvent?.actions, [
    {
      type: "openCityMenuPanel",
      panelId: "intel",
    },
  ]);
});

test("runtime-pack export rejects mixed menu destination and menu action authoring", () => {
  const project = workflow.createDefaultScriptEditorProjectDefinition();
  project.events = project.events.map((eventRecord) =>
    eventRecord.id !== "event.opening"
      ? eventRecord
      : {
          ...eventRecord,
          destination: {
            family: "menu",
            targetId: "intel",
          },
          actions: [
            {
              type: "openCityMenuPanel",
              panelId: "overview",
            },
          ],
        }
  );

  assert.deepEqual(validateScriptEditorProjectForRuntimeExport(project), [
    {
      code: "invalid-field",
      fieldPath: "project.events[0].actions",
      message:
        'Event "event.opening" cannot combine destination.family="menu" with explicit openCityMenuPanel payload actions.',
    },
  ]);
});

test("runtime-pack export rejects mixed minigame destination and playable action authoring", () => {
  const project = workflow.createDefaultScriptEditorProjectDefinition();
  const minigameRecord = {
    ...workflow.createScriptEditorWorkflowRecordDraft("minigames", project),
    id: "minigame.runtime.destination.conflict",
    title: "Destination Conflict Minigame",
    playableId: "activity-qte",
  };
  project.minigames = [...project.minigames, minigameRecord];
  project.events = project.events.map((eventRecord) =>
    eventRecord.id !== "event.opening"
      ? eventRecord
      : {
          ...eventRecord,
          destination: {
            family: "minigame",
            targetId: minigameRecord.id,
          },
          actions: [
            {
              type: "launchPlayable",
              playableId: "activity-qte",
              integrationId: `playable.activity-qte.instance.${minigameRecord.id}`,
              ownerContext: {
                ownerKind: "external",
                ownerId: null,
                returnPolicy: "close-only",
              },
            },
          ],
        }
  );

  assert.deepEqual(validateScriptEditorProjectForRuntimeExport(project), [
    {
      code: "invalid-field",
      fieldPath: "project.events[0].actions",
      message:
        'Event "event.opening" cannot combine destination.family="minigame" with explicit playable payload actions.',
    },
  ]);
});

test("runtime-pack export rejects mixed dialogue destination and menu action authoring", () => {
  const project = workflow.createDefaultScriptEditorProjectDefinition();
  const dialogueId = project.dialogues[0]?.id ?? "";
  assert.notEqual(dialogueId, "");
  project.events = project.events.map((eventRecord) =>
    eventRecord.id !== "event.opening"
      ? eventRecord
      : {
          ...eventRecord,
          destination: {
            family: "dialogue",
            targetId: dialogueId,
          },
          actions: [
            {
              type: "openCityMenuPanel",
              panelId: "overview",
            },
          ],
        }
  );

  assert.deepEqual(validateScriptEditorProjectForRuntimeExport(project), [
    {
      code: "invalid-field",
      fieldPath: "project.events[0].actions",
      message:
        'Event "event.opening" cannot combine destination.family="dialogue" with route-owning payload actions.',
    },
  ]);
});

test("runtime-pack export rejects mixed dialogue destination and flow action authoring", () => {
  const project = workflow.createDefaultScriptEditorProjectDefinition();
  const dialogueId = project.dialogues[0]?.id ?? "";
  assert.notEqual(dialogueId, "");
  const flowRecord = {
    ...workflow.createScriptEditorWorkflowRecordDraft("flows", project),
    id: "flow.runtime.dialogue-conflict",
    title: "Dialogue Conflict Flow",
  };
  project.flows = [...project.flows, flowRecord];
  project.events = project.events.map((eventRecord) =>
    eventRecord.id !== "event.opening"
      ? eventRecord
      : {
          ...eventRecord,
          destination: {
            family: "dialogue",
            targetId: dialogueId,
          },
          actions: [
            {
              type: "launchFlow",
              flowId: flowRecord.id,
              ownerContext: {
                ownerKind: "external",
                ownerId: null,
                returnPolicy: "close-only",
              },
            },
          ],
        }
  );

  assert.deepEqual(validateScriptEditorProjectForRuntimeExport(project), [
    {
      code: "invalid-field",
      fieldPath: "project.events[0].actions",
      message:
        'Event "event.opening" cannot combine destination.family="dialogue" with route-owning payload actions.',
    },
  ]);
});

test("runtime-pack round trip preserves dialogue destination when actions are non-route-owning", async () => {
  const project = workflow.createDefaultScriptEditorProjectDefinition();
  const dialogueId = project.dialogues[0]?.id ?? "";
  assert.notEqual(dialogueId, "");
  project.events = project.events.map((eventRecord) =>
    eventRecord.id !== "event.opening"
      ? eventRecord
      : {
          ...eventRecord,
          destination: {
            family: "dialogue",
            targetId: dialogueId,
          },
          actions: [
            {
              type: "closeBuilding",
            },
          ],
        }
  );

  assert.deepEqual(validateScriptEditorProjectForRuntimeExport(project), []);

  const exportedFiles = exportScriptEditorProjectToScenarioPackFiles(project);
  const roundTripProject = await loadScriptEditorProjectFromScenarioPackFiles(
    Object.entries(exportedFiles).map(
      ([relativePath, content]) => new File([content], relativePath)
    )
  );
  const roundTripEvent = roundTripProject.events.find(
    (eventRecord) => eventRecord.id === "event.opening"
  );

  assert.deepEqual(roundTripEvent?.destination, {
    family: "dialogue",
    targetId: dialogueId,
  });
  assert.deepEqual(roundTripEvent?.actions, [
    {
      type: "closeBuilding",
    },
  ]);
});

test("runtime-pack export rejects launchFlow actions that reference missing flows", () => {
  const project = workflow.createDefaultScriptEditorProjectDefinition();
  project.events = project.events.map((eventRecord) =>
    eventRecord.id !== "event.opening"
      ? eventRecord
      : {
          ...eventRecord,
          destination: {
            family: "event",
            targetId: "",
          },
          actions: [
            {
              type: "launchFlow",
              flowId: "flow.missing.runtime",
              ownerContext: {
                ownerKind: "external",
                ownerId: null,
                returnPolicy: "close-only",
              },
            },
          ],
        }
  );

  assert.deepEqual(validateScriptEditorProjectForRuntimeExport(project), [
    {
      code: "missing-reference",
      fieldPath: "project.events[0].actions[0].flowId",
      message:
        'Event "event.opening" references missing flow "flow.missing.runtime".',
    },
  ]);
});

test("runtime-pack export rejects openCityMenuPanel actions with unsupported panel ids", () => {
  const project = workflow.createDefaultScriptEditorProjectDefinition();
  project.events = project.events.map((eventRecord) =>
    eventRecord.id !== "event.opening"
      ? eventRecord
      : {
          ...eventRecord,
          destination: {
            family: "event",
            targetId: "",
          },
          actions: [
            {
              type: "openCityMenuPanel",
              panelId: "begging",
            },
          ],
        }
  );

  assert.deepEqual(validateScriptEditorProjectForRuntimeExport(project), [
    {
      code: "invalid-field",
      fieldPath: "project.events[0].actions[0].panelId",
      message:
        'Event "event.opening" carries unsupported city menu panel "begging".',
    },
  ]);
});

test("runtime-pack export rejects launchPlayable actions that reference missing integrations", () => {
  const project = workflow.createDefaultScriptEditorProjectDefinition();
  project.events = project.events.map((eventRecord) =>
    eventRecord.id !== "event.opening"
      ? eventRecord
      : {
          ...eventRecord,
          destination: {
            family: "event",
            targetId: "",
          },
          actions: [
            {
              type: "launchPlayable",
              playableId: "activity-qte",
              integrationId: "playable.activity-qte.instance.missing",
              ownerContext: {
                ownerKind: "external",
                ownerId: null,
                returnPolicy: "close-only",
              },
            },
          ],
        }
  );

  assert.deepEqual(validateScriptEditorProjectForRuntimeExport(project), [
    {
      code: "missing-reference",
      fieldPath: "project.events[0].actions[0].integrationId",
      message:
        'Event "event.opening" references missing playable integration "playable.activity-qte.instance.missing".',
    },
  ]);
});

test("runtime-pack export rejects launchPlayable actions whose integration does not match playableId", () => {
  const project = workflow.createDefaultScriptEditorProjectDefinition();
  const minigameRecord = {
    ...workflow.createScriptEditorWorkflowRecordDraft("minigames", project),
    id: "minigame.runtime.integration.mismatch",
    title: "Integration Mismatch Minigame",
    playableId: "activity-qte",
  };
  project.minigames = [...project.minigames, minigameRecord];
  project.events = project.events.map((eventRecord) =>
    eventRecord.id !== "event.opening"
      ? eventRecord
      : {
          ...eventRecord,
          destination: {
            family: "event",
            targetId: "",
          },
          actions: [
            {
              type: "launchPlayable",
              playableId: "grain-accounting",
              integrationId: `playable.activity-qte.instance.${minigameRecord.id}`,
              ownerContext: {
                ownerKind: "external",
                ownerId: null,
                returnPolicy: "close-only",
              },
            },
          ],
        }
  );

  assert.deepEqual(validateScriptEditorProjectForRuntimeExport(project), [
    {
      code: "invalid-field",
      fieldPath: "project.events[0].actions[0]",
      message:
        'Event "event.opening" uses playable integration "playable.activity-qte.instance.minigame.runtime.integration.mismatch" with mismatched playableId "grain-accounting".',
    },
  ]);
});

test("event authoring normalization preserves runtime payload actions and task inputs", () => {
  const normalized = normalizeScriptEditorEventRecord({
    id: "event.runtime.payload.normalize",
    title: "Runtime Payload Normalize",
    description: "Preserve canonical runtime payload fields.",
    triggerTiming: "manual",
    repeatable: false,
    nextEventId: "event.runtime.payload.followup",
    destination: {
      family: "event",
      targetId: "event.runtime.payload.followup",
    },
    actions: [
      {
        type: " launchPlayable ",
        playableId: " playable.runtime.payload.normalize ",
        integrationId: " playable.runtime.payload.normalize.external.default ",
        ownerContext: {
          ownerKind: " external ",
          ownerId: " ",
          returnPolicy: " close-only ",
        },
        payload: {
          source: "normalize-test",
          retries: 2,
        },
      },
    ],
    taskInputs: [
      {
        type: " task.signal.runtime.normalize ",
        taskId: " task.runtime.normalize ",
        source: " event.runtime.payload.normalize ",
        occurredAt: " runtime.now ",
      },
    ],
  });

  assert.deepEqual(normalized.actions, [
    {
      type: "launchPlayable",
      playableId: "playable.runtime.payload.normalize",
      integrationId: "playable.runtime.payload.normalize.external.default",
      ownerContext: {
        ownerKind: "external",
        ownerId: "",
        returnPolicy: "close-only",
      },
      payload: {
        source: "normalize-test",
        retries: 2,
      },
    },
  ]);
  assert.deepEqual(normalized.taskInputs, [
    {
      type: "task.signal.runtime.normalize",
      taskId: "task.runtime.normalize",
      source: "event.runtime.payload.normalize",
      occurredAt: "runtime.now",
    },
  ]);
});

test("script-editor project parse normalizes routed event payload authoring at the entry seam", () => {
  const project = workflow.createDefaultScriptEditorProjectDefinition();
  project.events = project.events.map((eventRecord) =>
    eventRecord.id !== "event.opening"
      ? eventRecord
      : {
          ...eventRecord,
          nextEventId: " event.followup ",
          destination: {
            family: "event",
            targetId: " event.followup ",
          },
          actions: [
            {
              type: " launchFlow ",
              flowId: " flow.runtime.payload.normalize ",
              ownerContext: {
                ownerKind: " task ",
                ownerId: " task.runtime.payload.normalize ",
                returnPolicy: " resume-owner ",
              },
            },
            {
              type: " openCityMenuPanel ",
              panelId: " overview ",
            },
          ],
          taskInputs: [
            {
              type: " start ",
              taskId: " task.runtime.payload.normalize ",
              occurredAt: " now ",
            },
          ],
        }
  );

  const parsed = parseScriptEditorProject(project);
  const openingEvent = parsed.events.find((eventRecord) => eventRecord.id === "event.opening");

  assert.ok(openingEvent);
  assert.equal(openingEvent.nextEventId, "event.followup");
  assert.deepEqual(openingEvent.destination, {
    family: "event",
    targetId: "event.followup",
  });
  assert.deepEqual(openingEvent.actions, [
    {
      type: "launchFlow",
      flowId: "flow.runtime.payload.normalize",
      ownerContext: {
        ownerKind: "task",
        ownerId: "task.runtime.payload.normalize",
        returnPolicy: "resume-owner",
      },
    },
    {
      type: "openCityMenuPanel",
      panelId: "overview",
    },
  ]);
  assert.deepEqual(openingEvent.taskInputs, [
    {
      type: "start",
      taskId: "task.runtime.payload.normalize",
      occurredAt: "now",
    },
  ]);
});

test("event binding normalization preserves canonical trigger and owner contract fields", () => {
  const normalized = normalizeScriptEditorEventBindingRecord({
    id: "event-binding.runtime.normalize",
    eventId: " event.runtime.normalize ",
    owner: {
      family: " building ",
      id: " building.runtime.normalize ",
    },
    trigger: {
      timing: " city-enter ",
      action: " building-container-item-action ",
      payloadSchemaId: " schema.runtime.normalize ",
    },
    priority: 4,
    enabled: true,
  });

  assert.deepEqual(normalized, {
    id: "event-binding.runtime.normalize",
    eventId: "event.runtime.normalize",
    owner: {
      family: "building",
      id: "building.runtime.normalize",
    },
    trigger: {
      timing: "city-enter",
      action: "building-container-item-action",
      payloadSchemaId: "schema.runtime.normalize",
    },
    priority: 4,
    enabled: true,
  });
});

test("script-editor project parse normalizes event binding authoring at the entry seam", () => {
  const project = workflow.createDefaultScriptEditorProjectDefinition();
  project.eventBindings = [
    {
      id: "event-binding.runtime.parse",
      eventId: " event.opening ",
      owner: {
        family: " building ",
        id: " building.runtime.parse ",
      },
      trigger: {
        timing: " city-enter ",
        action: " building-container-item-action ",
        payloadSchemaId: " payload.runtime.parse ",
      },
      priority: 2,
      enabled: true,
    },
  ];

  const parsed = parseScriptEditorProject(project);

  assert.deepEqual(parsed.eventBindings, [
    {
      id: "event-binding.runtime.parse",
      eventId: "event.opening",
      owner: {
        family: "building",
        id: "building.runtime.parse",
      },
      trigger: {
        timing: "city-enter",
        action: "building-container-item-action",
        payloadSchemaId: "payload.runtime.parse",
      },
      priority: 2,
      enabled: true,
    },
  ]);
});

test("progress track normalization preserves canonical threshold and target fields", () => {
  const normalized = normalizeScriptEditorProgressTrackRecord({
    id: " progress-track.runtime.normalize ",
    title: " 进度轨道 ",
    metricKey: " player.reputation ",
    metricLabel: " 声望 ",
    hostFamily: " city ",
    allowDemotion: true,
    tiers: [
      {
        id: " progress-tier.runtime.normalize ",
        title: " 第一档 ",
        threshold: " 12 ",
        onEnterRepeatPolicy: "once-per-entry",
        targetTierSettlementId: " settlement.runtime.normalize ",
      },
    ],
  });

  assert.deepEqual(normalized, {
    id: "progress-track.runtime.normalize",
    title: "进度轨道",
    metricKey: "player.reputation",
    metricLabel: "声望",
    hostFamily: "city",
    allowDemotion: true,
    tiers: [
      {
        id: "progress-tier.runtime.normalize",
        title: "第一档",
        threshold: 12,
        onEnterRepeatPolicy: "once-per-entry",
        targetTierSettlementId: "settlement.runtime.normalize",
      },
    ],
  });
});

test("progress track binding normalization preserves canonical host fields", () => {
  const normalized = normalizeScriptEditorProgressTrackBindingRecord({
    id: " progress-binding.runtime.normalize ",
    trackId: " progress-track.runtime.normalize ",
    host: {
      family: " person ",
      id: " hero.runtime.normalize ",
    },
    enabled: true,
  });

  assert.deepEqual(normalized, {
    id: "progress-binding.runtime.normalize",
    trackId: "progress-track.runtime.normalize",
    host: {
      family: "person",
      id: "hero.runtime.normalize",
    },
    enabled: true,
  });
});

test("script-editor project parse normalizes progress authoring at the entry seam", () => {
  const project = workflow.createDefaultScriptEditorProjectDefinition();
  project.progressTracks = [
    {
      id: " progress-track.runtime.parse ",
      title: " 进度轨道 ",
      metricKey: " player.reputation ",
      metricLabel: " 声望 ",
      hostFamily: " city ",
      allowDemotion: true,
      tiers: [
        {
          id: " progress-tier.runtime.parse ",
          title: " 第一档 ",
          threshold: " 18 ",
          onEnterRepeatPolicy: "once-per-entry",
          targetTierSettlementId: " settlement.runtime.parse ",
        },
      ],
    },
  ];
  project.progressTrackBindings = [
    {
      id: " progress-binding.runtime.parse ",
      trackId: " progress-track.runtime.parse ",
      host: {
        family: " person ",
        id: " hero.runtime.parse ",
      },
      enabled: true,
    },
  ];

  const parsed = parseScriptEditorProject(project);

  assert.deepEqual(parsed.progressTracks, [
    {
      id: "progress-track.runtime.parse",
      title: "进度轨道",
      metricKey: "player.reputation",
      metricLabel: "声望",
      hostFamily: "city",
      allowDemotion: true,
      tiers: [
        {
          id: "progress-tier.runtime.parse",
          title: "第一档",
          threshold: 18,
          onEnterRepeatPolicy: "once-per-entry",
          targetTierSettlementId: "settlement.runtime.parse",
        },
      ],
    },
  ]);
  assert.deepEqual(parsed.progressTrackBindings, [
    {
      id: "progress-binding.runtime.parse",
      trackId: "progress-track.runtime.parse",
      host: {
        family: "person",
        id: "hero.runtime.parse",
      },
      enabled: true,
    },
  ]);
});

test("settlement normalization preserves canonical next-event and content fields", () => {
  const normalized = normalizeScriptEditorSettlementRecord({
    id: " settlement.runtime.normalize ",
    title: " 结算条目 ",
    nextEventId: " event.runtime.normalize ",
    contents: [
      {
        targetFamily: "person",
        targetId: " hero.runtime.normalize ",
        attributeKey: " stats.gold ",
        attributeType: "number",
        operation: "set",
        value: " 30 ",
      },
    ],
  });

  assert.deepEqual(normalized, {
    id: "settlement.runtime.normalize",
    title: "结算条目",
    nextEventId: "event.runtime.normalize",
    contents: [
      {
        targetFamily: "person",
        targetId: "hero.runtime.normalize",
        attributeKey: "stats.gold",
        attributeType: "number",
        operation: "set",
        value: 30,
      },
    ],
  });
});

test("script-editor project parse normalizes settlement authoring at the entry seam", () => {
  const project = workflow.createDefaultScriptEditorProjectDefinition();
  project.settlements = [
    {
      id: " settlement.runtime.parse ",
      title: " 结算条目 ",
      nextEventId: " event.runtime.parse ",
      contents: [
        {
          targetFamily: "person",
          targetId: " hero.runtime.parse ",
          attributeKey: " stats.gold ",
          attributeType: "number",
          operation: "set",
          value: " 42 ",
        },
      ],
    },
  ];

  const parsed = parseScriptEditorProject(project);

  assert.deepEqual(parsed.settlements, [
    {
      id: "settlement.runtime.parse",
      title: "结算条目",
      nextEventId: "event.runtime.parse",
      contents: [
        {
          targetFamily: "person",
          targetId: "hero.runtime.parse",
          attributeKey: "stats.gold",
          attributeType: "number",
          operation: "set",
          value: 42,
        },
      ],
    },
  ]);
});

test("story node normalization preserves canonical headline fields", () => {
  const normalized = normalizeScriptEditorStoryNodeRecord({
    id: " story-node.runtime.normalize ",
    title: " 故事节点 ",
    chapterId: " chapter.runtime.normalize ",
    summary: " 节点摘要 ",
    progressMode: "wait",
    relatedPersonIds: [" person.keep.raw "],
    relatedDialogueIds: [" dialogue.keep.raw "],
    relatedEventIds: [" event.keep.raw "],
  });

  assert.deepEqual(normalized, {
    id: " story-node.runtime.normalize ",
    title: "故事节点",
    chapterId: " chapter.runtime.normalize ",
    summary: " 节点摘要 ",
    progressMode: "wait",
    relatedPersonIds: [" person.keep.raw "],
    relatedDialogueIds: [" dialogue.keep.raw "],
    relatedEventIds: [" event.keep.raw "],
  });
});

test("script-editor project parse normalizes story-node authoring at the entry seam", () => {
  const project = workflow.createDefaultScriptEditorProjectDefinition();
  project.storyNodes = [
    {
      id: " story-node.runtime.parse ",
      title: " 故事节点 ",
      chapterId: " chapter.runtime.parse ",
      summary: " 节点摘要 ",
      progressMode: "wait",
      relatedPersonIds: [" person.keep.raw "],
      relatedDialogueIds: [" dialogue.keep.raw "],
      relatedEventIds: [" event.keep.raw "],
    },
  ];

  const parsed = parseScriptEditorProject(project);

  assert.deepEqual(parsed.storyNodes, [
    {
      id: " story-node.runtime.parse ",
      title: "故事节点",
      chapterId: " chapter.runtime.parse ",
      summary: " 节点摘要 ",
      progressMode: "wait",
      relatedPersonIds: [" person.keep.raw "],
      relatedDialogueIds: [" dialogue.keep.raw "],
      relatedEventIds: [" event.keep.raw "],
    },
  ]);
});

test("flow normalization preserves canonical launch headline fields", () => {
  const normalized = normalizeScriptEditorFlowRecord({
    id: " flow.runtime.normalize ",
    title: " 玩法流程 ",
    description: " 流程描述 ",
    initialNodeId: " node.opening ",
    nodes: [
      { id: "node.opening", type: "text", text: "", nextNodeId: "node.complete" },
      { id: "node.complete", type: "complete", outcome: "success", detail: {} },
    ],
    outcomeRoutes: [],
    notes: " 流程备注 ",
  });

  assert.equal(normalized.id, "flow.runtime.normalize");
  assert.equal(normalized.title, "玩法流程");
  assert.equal(normalized.description, "流程描述");
  assert.equal(normalized.initialNodeId, "node.opening");
  assert.equal(normalized.notes, "流程备注");
});

test("minigame normalization preserves canonical launch headline fields", () => {
  const normalized = normalizeScriptEditorMinigameRecord({
    id: " minigame.runtime.normalize ",
    title: " 小游戏 ",
    description: " 玩法描述 ",
    playableId: " activity-qte ",
    integrationId: " playable.activity-qte.instance.runtime.normalize ",
    settlementId: " settlement.runtime.normalize ",
    ownerKind: "external",
    ownerId: " runtime.normalize.owner ",
    returnPolicy: "close-only",
    triggerId: " trigger.runtime.normalize ",
    triggerSource: "manual",
    triggerEvent: " manual-launch ",
    launchPayload: [{ key: " source ", value: " event-action " }],
    configEntries: [],
    settlementRoutes: [],
    outcomeRoutes: [
      {
        id: " outcome-route.runtime.normalize ",
        outcome: "success",
        handoffPolicy: "close-only",
        summary: " 成功 ",
        effectHint: " 结果 ",
      },
    ],
    notes: " 玩法备注 ",
  });

  assert.equal(normalized.id, " minigame.runtime.normalize ");
  assert.equal(normalized.title, "小游戏");
  assert.equal(normalized.description, "玩法描述");
  assert.equal(normalized.playableId, "activity-qte");
  assert.equal(
    normalized.integrationId,
    "playable.activity-qte.instance.runtime.normalize"
  );
  assert.equal(normalized.settlementId, "settlement.runtime.normalize");
  assert.equal(normalized.ownerKind, "external");
  assert.equal(normalized.ownerId, "runtime.normalize.owner");
  assert.equal(normalized.returnPolicy, "close-only");
  assert.equal(normalized.triggerId, "trigger.runtime.normalize");
  assert.equal(normalized.triggerSource, "manual");
  assert.equal(normalized.triggerEvent, "manual-launch");
  assert.deepEqual(normalized.launchPayload, [
    { key: "source", value: "event-action" },
  ]);
  assert.deepEqual(normalized.outcomeRoutes, [
    {
      id: "outcome-route.runtime.normalize",
      outcome: "success",
      handoffPolicy: "close-only",
      summary: "成功",
      effectHint: "结果",
    },
  ]);
  assert.equal(normalized.notes, "玩法备注");
});

test("script-editor project parse normalizes minigame and flow authoring at the entry seam", () => {
  const project = workflow.createDefaultScriptEditorProjectDefinition();
  project.flows = [
    {
      id: " flow.runtime.parse ",
      title: " 玩法流程 ",
      description: " 流程描述 ",
      initialNodeId: " node.opening ",
      nodes: [
        { id: "node.opening", type: "text", text: "", nextNodeId: "node.complete" },
        { id: "node.complete", type: "complete", outcome: "success", detail: {} },
      ],
      outcomeRoutes: [],
      notes: " 流程备注 ",
    },
  ];
  project.minigames = [
    {
      id: " minigame.runtime.parse ",
      title: " 小游戏 ",
      description: " 玩法描述 ",
      playableId: " activity-qte ",
      integrationId: " playable.activity-qte.instance.runtime.parse ",
      settlementId: " settlement.runtime.parse ",
      ownerKind: "external",
      ownerId: " runtime.parse.owner ",
      returnPolicy: "close-only",
      triggerId: " trigger.runtime.parse ",
      triggerSource: "manual",
      triggerEvent: " manual-launch ",
      launchPayload: [{ key: " source ", value: " event-action " }],
      configEntries: [],
      settlementRoutes: [],
      outcomeRoutes: [
        {
          id: " outcome-route.runtime.parse ",
          outcome: "success",
          handoffPolicy: "close-only",
          summary: " 成功 ",
          effectHint: " 结果 ",
        },
      ],
      notes: " 玩法备注 ",
    },
  ];

  const parsed = parseScriptEditorProject(project);

  assert.equal(parsed.flows[0]?.id, "flow.runtime.parse");
  assert.equal(parsed.flows[0]?.title, "玩法流程");
  assert.equal(parsed.flows[0]?.description, "流程描述");
  assert.equal(parsed.flows[0]?.initialNodeId, "node.opening");
  assert.equal(parsed.flows[0]?.notes, "流程备注");

  assert.equal(parsed.minigames[0]?.id, " minigame.runtime.parse ");
  assert.equal(parsed.minigames[0]?.title, "小游戏");
  assert.equal(parsed.minigames[0]?.description, "玩法描述");
  assert.equal(parsed.minigames[0]?.playableId, "activity-qte");
  assert.equal(
    parsed.minigames[0]?.integrationId,
    "playable.activity-qte.instance.runtime.parse"
  );
  assert.equal(parsed.minigames[0]?.settlementId, "settlement.runtime.parse");
  assert.equal(parsed.minigames[0]?.ownerKind, "external");
  assert.equal(parsed.minigames[0]?.ownerId, "runtime.parse.owner");
  assert.equal(parsed.minigames[0]?.returnPolicy, "close-only");
  assert.equal(parsed.minigames[0]?.triggerId, "trigger.runtime.parse");
  assert.equal(parsed.minigames[0]?.triggerSource, "manual");
  assert.equal(parsed.minigames[0]?.triggerEvent, "manual-launch");
  assert.deepEqual(parsed.minigames[0]?.launchPayload, [
    { key: "source", value: "event-action" },
  ]);
  assert.deepEqual(parsed.minigames[0]?.outcomeRoutes, [
    {
      id: "outcome-route.runtime.parse",
      outcome: "success",
      handoffPolicy: "close-only",
      summary: "成功",
      effectHint: "结果",
    },
  ]);
  assert.equal(parsed.minigames[0]?.notes, "玩法备注");
});

test("city normalization preserves canonical location headline fields", () => {
  const normalized = normalizeScriptEditorCityRecord({
    id: " city.runtime.normalize ",
    name: " 城池 ",
    regionId: " region.runtime.normalize ",
    mapNodeId: " map-node.runtime.normalize ",
    description: " 城市描述 ",
    backgroundId: " background.runtime.normalize ",
    houseIds: [" house.a ", " house.b "],
    neighbourCityIds: [" city.neighbor "],
    menuInstanceIds: [" menu.instance.runtime.normalize "],
  });

  assert.equal(normalized.id, " city.runtime.normalize ");
  assert.equal(normalized.name, "城池");
  assert.equal(normalized.regionId, "region.runtime.normalize");
  assert.equal(normalized.mapNodeId, "map-node.runtime.normalize");
  assert.equal(normalized.description, "城市描述");
  assert.equal(normalized.backgroundId, "background.runtime.normalize");
  assert.deepEqual(normalized.houseIds, ["house.a", "house.b"]);
  assert.deepEqual(normalized.neighbourCityIds, ["city.neighbor"]);
  assert.deepEqual(normalized.menuInstanceIds, ["menu.instance.runtime.normalize"]);
});

test("building normalization preserves canonical location headline fields", () => {
  const normalized = normalizeScriptEditorBuildingRecord({
    id: " building.runtime.normalize ",
    cityId: " city.runtime.normalize ",
    name: " 建筑 ",
    description: " 建筑描述 ",
    backgroundId: " background.building.normalize ",
    menuInstanceIds: [" menu.instance.building.normalize "],
  });

  assert.equal(normalized.id, " building.runtime.normalize ");
  assert.equal(normalized.cityId, "city.runtime.normalize");
  assert.equal(normalized.name, "建筑");
  assert.equal(normalized.description, "建筑描述");
  assert.equal(normalized.backgroundId, "background.building.normalize");
  assert.deepEqual(normalized.menuInstanceIds, ["menu.instance.building.normalize"]);
});

test("script-editor project parse normalizes city and building authoring at the entry seam", () => {
  const project = workflow.createDefaultScriptEditorProjectDefinition();
  project.cities = [
    {
      id: " city.runtime.parse ",
      name: " 城池 ",
      regionId: " region.runtime.parse ",
      mapNodeId: " map-node.runtime.parse ",
      description: " 城市描述 ",
      backgroundId: " background.runtime.parse ",
      houseIds: [" house.a "],
      neighbourCityIds: [" city.neighbor "],
      menuInstanceIds: [" menu.instance.runtime.parse "],
    },
  ];
  project.buildings = [
    {
      id: " building.runtime.parse ",
      cityId: " city.runtime.parse ",
      name: " 建筑 ",
      description: " 建筑描述 ",
      backgroundId: " background.building.parse ",
      menuInstanceIds: [" menu.instance.building.parse "],
    },
  ];

  const parsed = parseScriptEditorProject(project);

  assert.equal(parsed.cities[0]?.id, " city.runtime.parse ");
  assert.equal(parsed.cities[0]?.name, "城池");
  assert.equal(parsed.cities[0]?.regionId, "region.runtime.parse");
  assert.equal(parsed.cities[0]?.mapNodeId, "map-node.runtime.parse");
  assert.equal(parsed.cities[0]?.description, "城市描述");
  assert.equal(parsed.cities[0]?.backgroundId, "background.runtime.parse");
  assert.deepEqual(parsed.cities[0]?.houseIds, ["house.a"]);
  assert.deepEqual(parsed.cities[0]?.neighbourCityIds, ["city.neighbor"]);
  assert.deepEqual(parsed.cities[0]?.menuInstanceIds, ["menu.instance.runtime.parse"]);

  assert.equal(parsed.buildings[0]?.id, " building.runtime.parse ");
  assert.equal(parsed.buildings[0]?.cityId, "city.runtime.parse");
  assert.equal(parsed.buildings[0]?.name, "建筑");
  assert.equal(parsed.buildings[0]?.description, "建筑描述");
  assert.equal(parsed.buildings[0]?.backgroundId, "background.building.parse");
  assert.deepEqual(parsed.buildings[0]?.menuInstanceIds, [
    "menu.instance.building.parse",
  ]);
});

test("portrait normalization preserves canonical asset headline fields", () => {
  const normalized = normalizeScriptEditorPortraitRecord({
    id: " portrait.runtime.normalize ",
    label: " 立绘资源 ",
    portraitImage: " /assets/portrait.runtime.normalize.png ",
    avatarImage: " /assets/avatar.runtime.normalize.png ",
  });

  assert.equal(normalized.id, " portrait.runtime.normalize ");
  assert.equal(normalized.label, "立绘资源");
  assert.equal(normalized.portraitImage, "/assets/portrait.runtime.normalize.png");
  assert.equal(normalized.avatarImage, "/assets/avatar.runtime.normalize.png");
});

test("portrait variant normalization preserves canonical portrait reference fields", () => {
  const normalized = normalizeScriptEditorPortraitVariantRecord({
    id: " portrait-variant.runtime.normalize ",
    label: " 立绘变体 ",
    parentPortraitId: " portrait.parent.runtime.normalize ",
    portraitId: " portrait.runtime.normalize ",
  });

  assert.equal(normalized.id, " portrait-variant.runtime.normalize ");
  assert.equal(normalized.label, "立绘变体");
  assert.equal(normalized.parentPortraitId, "portrait.parent.runtime.normalize");
  assert.equal(normalized.portraitId, "portrait.runtime.normalize");
});

test("script-editor project parse normalizes portrait authoring at the entry seam", () => {
  const project = workflow.createDefaultScriptEditorProjectDefinition();
  project.portraits = [
    {
      id: " portrait.runtime.parse ",
      label: " 立绘资源 ",
      portraitImage: " /assets/portrait.runtime.parse.png ",
      avatarImage: " /assets/avatar.runtime.parse.png ",
    },
  ];
  project.portraitVariants = [
    {
      id: " portrait-variant.runtime.parse ",
      label: " 立绘变体 ",
      parentPortraitId: " portrait.parent.runtime.parse ",
      portraitId: " portrait.runtime.parse ",
    },
  ];

  const parsed = parseScriptEditorProject(project);

  assert.equal(parsed.portraits[0]?.id, " portrait.runtime.parse ");
  assert.equal(parsed.portraits[0]?.label, "立绘资源");
  assert.equal(parsed.portraits[0]?.portraitImage, "/assets/portrait.runtime.parse.png");
  assert.equal(parsed.portraits[0]?.avatarImage, "/assets/avatar.runtime.parse.png");
  assert.equal(parsed.portraitVariants[0]?.id, " portrait-variant.runtime.parse ");
  assert.equal(parsed.portraitVariants[0]?.label, "立绘变体");
  assert.equal(
    parsed.portraitVariants[0]?.parentPortraitId,
    "portrait.parent.runtime.parse"
  );
  assert.equal(parsed.portraitVariants[0]?.portraitId, "portrait.runtime.parse");
});

test("template runtime-pack export preserves aligned zhuyuanzhang startup profile fields", async () => {
  const templateRoot = path.join(
    process.cwd(),
    "public",
    "builtin-script-editor-templates",
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
