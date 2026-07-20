const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { test } = require("node:test");

test(
  "script editor city authoring normalizes mounted buildings with npc and primary npc selection",
  () => {
    const {
      normalizeScriptEditorCityRecord,
    } = require("../.test-dist/application/script-editor/city-building-authoring.js");

    const city = normalizeScriptEditorCityRecord({
      id: "city.start",
      name: "Start City",
      mountedBuildings: [
        {
          buildingId: "building.market",
          npcIds: ["person.host", "", "person.guard"],
          primaryNpcId: "person.host",
        },
      ],
    });

    assert.deepEqual(city.mountedBuildings, [
      {
        buildingId: "building.market",
        npcIds: ["person.host", "person.guard"],
        primaryNpcId: "person.host",
      },
    ]);
  }
);

test(
  "script editor city authoring keeps a newly added mounted npc row selectable",
  () => {
    const {
      appendScriptEditorCityMountedBuildingNpc,
    } = require("../.test-dist/application/script-editor/city-building-authoring.js");

    const city = appendScriptEditorCityMountedBuildingNpc(
      {
        id: "city.start",
        name: "Start City",
        mountedBuildings: [
          {
            buildingId: "building.market",
            npcIds: [],
            primaryNpcId: null,
          },
        ],
      },
      0
    );

    assert.deepEqual(city.mountedBuildings[0].npcIds, [""]);
  }
);

test(
  "script editor city authoring can add a concrete mounted npc that survives normalization",
  () => {
    const {
      appendScriptEditorCityMountedBuildingNpc,
      normalizeScriptEditorCityRecord,
    } = require("../.test-dist/application/script-editor/city-building-authoring.js");

    const city = normalizeScriptEditorCityRecord(
      appendScriptEditorCityMountedBuildingNpc(
        {
          id: "city.start",
          name: "Start City",
          mountedBuildings: [
            {
              buildingId: "building.market",
              npcIds: [],
              primaryNpcId: null,
            },
          ],
        },
        0,
        "person.host"
      )
    );

    assert.deepEqual(city.mountedBuildings[0].npcIds, ["person.host"]);
  }
);

test(
  "script editor city authoring removes a mounted building entry",
  () => {
    const {
      removeScriptEditorCityMountedBuilding,
    } = require("../.test-dist/application/script-editor/city-building-authoring.js");

    const city = removeScriptEditorCityMountedBuilding(
      {
        id: "city.start",
        name: "Start City",
        mountedBuildings: [
          {
            buildingId: "building.market",
            npcIds: ["person.host"],
            primaryNpcId: "person.host",
          },
          {
            buildingId: "building.inn",
            npcIds: ["person.owner"],
            primaryNpcId: "person.owner",
          },
        ],
      },
      0
    );

    assert.deepEqual(city.mountedBuildings, [
      {
        buildingId: "building.inn",
        npcIds: ["person.owner"],
        primaryNpcId: "person.owner",
      },
    ]);
  }
);

test(
  "script editor city profile UI exposes mounted building and npc controls",
  () => {
    const mainUiSource = fs.readFileSync(
      path.join(process.cwd(), "src/ui/main-ui/main-ui-flow.js"),
      "utf8"
    );

    assert.match(mainUiSource, /data-script-editor-city-mounted-building/);
    assert.match(mainUiSource, /data-script-editor-city-mounted-building-npc/);
    assert.match(mainUiSource, /data-script-editor-city-primary-npc/);
    assert.match(mainUiSource, /findNextScriptEditorCityMountedNpcId/);
    assert.match(
      mainUiSource,
      /appendScriptEditorCityMountedBuildingNpc\(city, buildingIndex, nextNpcId\)/
    );
    const actionHandlerBlock = mainUiSource.match(
      /async handleScriptEditorAction\(action, actionElement = null\) \{[\s\S]*?\n  selectScriptEditorFamily/
    )?.[0] ?? "";
    assert.doesNotMatch(actionHandlerBlock, /target\.dataset\.scriptEditorCityMountedBuildingIndex/);
    assert.doesNotMatch(actionHandlerBlock, /target\.dataset\.scriptEditorCityMountedBuildingNpcIndex/);
  }
);

test("script editor building arrangement authoring updates project-level arrangements", () => {
  const {
    appendScriptEditorBuildingArrangement,
    appendScriptEditorBuildingArrangementNpc,
    appendScriptEditorBuildingArrangementContainer,
    appendScriptEditorBuildingArrangementContainerActionItem,
    updateScriptEditorBuildingArrangementContainerField,
    updateScriptEditorBuildingArrangementNpc,
    updateScriptEditorBuildingArrangementPrimaryNpc,
  } = require("../.test-dist/application/script-editor/city-building-authoring.js");

  const baseProject = {
    schemaVersion: 1,
    id: "project.arrangement",
    title: "Arrangement Project",
    scenarioProfile: {},
    maps: [],
    cities: [{ id: "city.start", name: "Start City" }],
    buildings: [{ id: "building.temple", cityId: "city.start", name: "Temple" }],
    buildingArrangements: [],
    people: [
      { id: "person.host", name: "Host", personType: "NPC" },
      { id: "person.other", name: "Other", personType: "NPC" },
    ],
    factions: [],
    chapters: [],
    storyNodes: [],
    dialogues: [],
    events: [],
    eventBindings: [],
    scenes: [],
    activities: [],
    items: [],
    skills: [],
    relationships: [],
    endingRules: [],
    minigames: [],
    cityEntries: [],
    cityNpcPools: [],
    locationAccess: [],
    playableIntegrations: [],
    workflow: { currentStepId: "draft", completedSteps: [], records: {} },
  };

  let project = appendScriptEditorBuildingArrangement(baseProject, "city.start");
  const arrangementId = project.buildingArrangements[0].id;
  assert.equal(project.buildingArrangements[0].buildingId, "building.temple");
  assert.equal(project.buildingArrangements[0].displayName, "Temple");
  project = appendScriptEditorBuildingArrangementNpc(project, arrangementId, "person.host");
  project = updateScriptEditorBuildingArrangementPrimaryNpc(
    project,
    arrangementId,
    "person.host"
  );
  project = updateScriptEditorBuildingArrangementNpc(
    project,
    arrangementId,
    0,
    "person.other"
  );
  project = appendScriptEditorBuildingArrangementContainer(
    project,
    arrangementId,
    "action-menu"
  );
  project = appendScriptEditorBuildingArrangementContainerActionItem(
    project,
    arrangementId,
    0
  );
  project = updateScriptEditorBuildingArrangementContainerField(
    project,
    arrangementId,
    0,
    "type",
    "resource-panel"
  );

  assert.deepEqual(project.buildingArrangements[0].mountedNpcIds, ["person.other"]);
  assert.equal(project.buildingArrangements[0].primaryNpcId, null);
  assert.equal(project.buildingArrangements[0].containers[0].type, "resource-panel");
  assert.equal(project.buildingArrangements[0].containers[0].items, undefined);
  assert.deepEqual(baseProject.buildingArrangements, []);
});

test("script editor city profile UI exposes building arrangement and generic container controls", () => {
  const mainUiSource = fs.readFileSync(
    path.join(process.cwd(), "src/ui/main-ui/main-ui-flow.js"),
    "utf8"
  );
  const authoringSource = fs.readFileSync(
    path.join(process.cwd(), "src/application/script-editor/city-building-authoring.ts"),
    "utf8"
  );

  assert.match(mainUiSource, /renderScriptEditorBuildingArrangementPanel\(location\)/);
  assert.match(mainUiSource, /data-script-editor-building-arrangement-field/);
  assert.match(mainUiSource, /data-script-editor-building-arrangement-npc/);
  assert.match(mainUiSource, /data-script-editor-building-container-field/);
  assert.match(mainUiSource, /data-script-editor-building-container-action-field/);
  assert.match(mainUiSource, /SCRIPT_EDITOR_BUILDING_CONTAINER_TYPES/);
  for (const containerType of [
    "character-seats",
    "action-menu",
    "status-panel",
    "text-panel",
    "image-panel",
    "resource-panel",
  ]) {
    assert.match(authoringSource, new RegExp(containerType));
  }
});

test(
  "script editor runtime pack import does not infer mounted authoring rows from runtime families",
  () => {
    const {
      importScenarioPackToScriptEditorProject,
    } = require("../.test-dist/application/script-editor/runtime-pack-import.js");

    const importedProject = importScenarioPackToScriptEditorProject({
      schemaVersion: 1,
      id: "scenario.imported",
      title: "Imported Scenario",
      scenarioProfile: {
        id: "scenario-profile.imported",
        playerCharacterId: "person.player",
        chapterId: "chapter.imported",
        initialLocation: {
          mapId: "map.imported",
          cityId: "city.start",
          houseId: null,
          view: "city",
        },
      },
      characters: [{ id: "person.player", name: "Player", personType: "角色" }],
      cities: [{ id: "city.start", name: "Start City" }],
      houses: [
        {
          id: "building.market",
          cityId: "city.start",
          name: "Market",
          type: "merchant",
          characterIds: ["city-npc.start.merchant"],
          defaultCharacterId: "city-npc.start.merchant",
        },
      ],
      cityEntries: [
        {
          id: "city-entry.start.market",
          cityId: "city.start",
          name: "Market",
          directoryType: "building",
          targetHouseId: "building.market",
        },
      ],
      cityNpcPools: [
        {
          cityId: "city.start",
          residents: [
            {
              id: "city-npc.start.merchant",
              cityId: "city.start",
              name: "Merchant Zhou",
              title: "Merchant",
              personality: "Sharp",
              specialty: "Trade",
              favorability: 0,
              activityWeight: { market: 60 },
              dialoguePool: [],
              intelPool: [],
            },
          ],
        },
      ],
      events: [],
      scenes: [],
    });

    assert.deepEqual(importedProject.cities[0].mountedBuildings, []);
    assert.equal(
      importedProject.people.some(
        (person) =>
          person.id === "city-npc.start.merchant" &&
          person.personType === "NPC" &&
          person.name === "Merchant Zhou"
      ),
      true
    );
  }
);

test(
  "script editor projects expose first-class flow authoring records and preserve them through runtime pack export/import",
  async () => {
    const {
      createDefaultScriptEditorProjectDefinition,
    } = require("../.test-dist/application/script-editor/minimal-workflow.js");
    const {
      parseScriptEditorProject,
    } = require("../.test-dist/application/script-editor/editor-project-loader.js");
    const {
      exportScriptEditorProjectToScenarioPackFiles,
    } = require("../.test-dist/application/script-editor/runtime-pack-export.js");
    const {
      loadScriptEditorProjectFromScenarioPackFiles,
    } = require("../.test-dist/application/script-editor/runtime-pack-import.js");

    const emptyProject = createDefaultScriptEditorProjectDefinition();
    assert.deepEqual(emptyProject.flows, []);

    const project = parseScriptEditorProject({
      ...emptyProject,
      flows: [
        {
          id: "flow.temple.rest",
          title: "Rest",
          description: "A creator-authored building flow.",
          playableId: "flow.temple.rest",
          integrationId: "playable.flow.temple.rest",
          ownerKind: "building",
          ownerId: "arrangement.city.haozhou.temple",
          returnPolicy: "resume-owner",
          triggerId: "trigger.flow.temple.rest",
          triggerSource: "event-destination",
          triggerEvent: "event.temple.rest",
          eventStartTarget: {
            eventId: "event.temple.rest",
            bindingId: "binding.temple.rest",
          },
          launchPayload: [{ key: "hours", value: "2" }],
          initialNodeId: "node.start",
          nodes: [
            {
              id: "node.start",
              type: "text",
              text: "Rest.",
              nextNodeId: "node.done",
            },
            {
              id: "node.done",
              type: "complete",
              outcome: "success",
              detail: { action: "rest" },
            },
          ],
          outcomeRoutes: [
            {
              id: "route.success",
              outcome: "success",
              handoffPolicy: "resume-owner",
              summary: "Return to the building.",
              effectHint: "",
            },
          ],
          notes: "",
        },
      ],
    });

    const files = exportScriptEditorProjectToScenarioPackFiles(project);
    const exportedFlows = JSON.parse(files["flow-definitions.json"]);
    assert.equal(exportedFlows[0].id, "flow.temple.rest");
    assert.equal(exportedFlows[0].nodes[1].type, "complete");

    const importedProject = await loadScriptEditorProjectFromScenarioPackFiles(
      Object.entries(files).map(([name, content]) => ({
        name,
        webkitRelativePath: name,
        async text() {
          return content;
        },
      }))
    );
    assert.equal(importedProject.flows[0].eventStartTarget.eventId, "event.temple.rest");
    assert.equal(importedProject.flows[0].ownerKind, "building");
  }
);

test(
  "script editor exposes flows as an independent authoring family",
  () => {
    const mainUiSource = fs.readFileSync(
      path.join(process.cwd(), "src/ui/main-ui/main-ui-flow.js"),
      "utf8"
    );
    const workflowSource = fs.readFileSync(
      path.join(process.cwd(), "src/application/script-editor/minimal-workflow.ts"),
      "utf8"
    );

    assert.match(workflowSource, /"flows"/);
    assert.match(mainUiSource, /data-script-editor-record-search-family="flows"/);
    assert.match(mainUiSource, /renderScriptEditorFlowEditor/);
    assert.match(mainUiSource, /不复用 minigame 绑定/);
  }
);

test(
  "script editor exported flow data becomes active runtime content for preview launch",
  () => {
    const {
      createDefaultScriptEditorProjectDefinition,
    } = require("../.test-dist/application/script-editor/minimal-workflow.js");
    const {
      createActiveGameContent,
    } = require("../.test-dist/application/content/active-game-content.js");
    const {
      exportScriptEditorProjectToScenarioPackFiles,
    } = require("../.test-dist/application/script-editor/runtime-pack-export.js");

    const project = createDefaultScriptEditorProjectDefinition();
    project.flows = [
      {
        id: "flow.preview.rest",
        title: "Preview Rest",
        playableId: "flow.preview.rest",
        integrationId: "playable.flow.preview.rest",
        ownerKind: "building",
        ownerId: "arrangement.preview.rest",
        returnPolicy: "resume-owner",
        triggerId: "trigger.preview.rest",
        triggerSource: "container-item",
        triggerEvent: "event.preview.rest",
        launchPayload: [],
        initialNodeId: "node.start",
        nodes: [
          { id: "node.start", type: "text", text: "Rest.", nextNodeId: null },
        ],
        outcomeRoutes: [
          {
            id: "route.success",
            outcome: "success",
            handoffPolicy: "resume-owner",
            summary: "",
            effectHint: "",
          },
        ],
      },
    ];

    const files = exportScriptEditorProjectToScenarioPackFiles(project);
    const activeContent = createActiveGameContent({
      schemaVersion: 1,
      id: project.storyPack.id,
      title: project.storyPack.title,
      scenarioProfile: project.storyPack.scenarioProfile,
      characters: JSON.parse(files["characters.json"]),
      cities: JSON.parse(files["cities.json"]),
      houses: JSON.parse(files["houses.json"]),
      buildingArrangements: JSON.parse(files["building-arrangements.json"]),
      events: JSON.parse(files["events.json"]),
      eventBindings: JSON.parse(files["event-bindings.json"]),
      scenes: JSON.parse(files["scenes.json"]),
      playables: JSON.parse(files["playables.json"]),
      playableIntegrations: JSON.parse(files["playable-integrations.json"]),
      flowDefinitions: JSON.parse(files["flow-definitions.json"]),
    });

    assert.equal(
      activeContent.flowDefinitionsById["flow.preview.rest"].initialNodeId,
      "node.start"
    );
  }
);
