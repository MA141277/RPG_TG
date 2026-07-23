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
  "script editor city rename keeps map label in sync while the label still follows the default city name",
  () => {
    const {
      updateScriptEditorCityField,
    } = require("../.test-dist/application/script-editor/city-building-authoring.js");

    const city = updateScriptEditorCityField(
      {
        id: "city.start",
        name: "Start City",
        mapPlacement: {
          x: 3,
          y: 5,
          label: "Start City",
          summary: "",
          kind: "city",
        },
      },
      "name",
      "Renamed City"
    );

    assert.equal(city.name, "Renamed City");
    assert.equal(city.mapPlacement.label, "Renamed City");
  }
);

test(
  "script editor city rename preserves an explicitly customized map label",
  () => {
    const {
      updateScriptEditorCityField,
    } = require("../.test-dist/application/script-editor/city-building-authoring.js");

    const city = updateScriptEditorCityField(
      {
        id: "city.start",
        name: "Start City",
        mapPlacement: {
          x: 3,
          y: 5,
          label: "Capital District",
          summary: "",
          kind: "city",
        },
      },
      "name",
      "Renamed City"
    );

  assert.equal(city.name, "Renamed City");
  assert.equal(city.mapPlacement.label, "Capital District");
  }
);

test(
  "script editor city authoring updates position label mode index and coordinate fields on map placement",
  () => {
    const {
      updateScriptEditorCityMapPlacementField,
    } = require("../.test-dist/application/script-editor/city-building-authoring.js");

    let city = {
      id: "city.start",
      name: "Start City",
      mapPlacement: {
        placementMode: "coordinate",
        x: 3,
        y: 5,
        label: "Start City",
        summary: "",
        kind: "city",
      },
    };

    city = updateScriptEditorCityMapPlacementField(city, "label", "South Gate");
    city = updateScriptEditorCityMapPlacementField(city, "placementMode", "grid-index");
    city = updateScriptEditorCityMapPlacementField(city, "gridIndex", "27");
    city = updateScriptEditorCityMapPlacementField(city, "x", "12");
    city = updateScriptEditorCityMapPlacementField(city, "y", "34");

    assert.deepEqual(city.mapPlacement, {
      placementMode: "grid-index",
      gridIndex: 27,
      x: 12,
      y: 34,
      label: "South Gate",
      kind: "city",
    });
  }
);

test(
  "script editor new city records default map placement to coordinate mode for future positioning expansion",
  () => {
    const {
      createDefaultScriptEditorCityRecord,
    } = require("../.test-dist/application/script-editor/city-building-authoring.js");

    const city = createDefaultScriptEditorCityRecord(0);

    assert.equal(city.mapPlacement?.placementMode, "coordinate");
    assert.equal(city.mapPlacement?.x, 0);
    assert.equal(city.mapPlacement?.y, 0);
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
    assert.match(mainUiSource, /renderScriptEditorLocationTabButton\("mounted", "挂载"\)/);
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

test("script editor city profile UI exposes position label and coordinate controls", () => {
  const mainUiSource = fs.readFileSync(
    path.join(process.cwd(), "src/ui/main-ui/main-ui-flow.js"),
    "utf8"
  );

  assert.match(mainUiSource, /位置标签/);
  assert.match(mainUiSource, /位置 X/);
  assert.match(mainUiSource, /位置 Y/);
  assert.match(mainUiSource, /位置类型/);
  assert.match(mainUiSource, /位置索引/);
  assert.match(mainUiSource, /data-script-editor-location-field="mapPlacement.label"/);
  assert.match(mainUiSource, /data-script-editor-location-field="mapPlacement.x"/);
  assert.match(mainUiSource, /data-script-editor-location-field="mapPlacement.y"/);
  assert.match(mainUiSource, /data-script-editor-location-field="mapPlacement.placementMode"/);
  assert.match(mainUiSource, /data-script-editor-location-field="mapPlacement.gridIndex"/);
  assert.match(mainUiSource, /updateScriptEditorCityMapPlacementField/);
  const locationFieldHandlerBlock = mainUiSource.match(
    /if \(target\.matches\("\[data-script-editor-location-field\]"\)\) \{[\s\S]*?\n    \}/
  )?.[0] ?? "";
  assert.match(locationFieldHandlerBlock, /this\.applyScriptEditorLocationField\(field, target\.value\);/);
  assert.doesNotMatch(locationFieldHandlerBlock, /field === "backgroundId"/);
});

test("script editor building arrangement authoring updates project-level arrangements", () => {
  const {
    appendScriptEditorBuildingArrangement,
    appendScriptEditorBuildingArrangementNpc,
    appendScriptEditorBuildingArrangementContainer,
    appendScriptEditorBuildingArrangementContainerActionItem,
    appendScriptEditorBuildingArrangementLayoutNode,
    updateScriptEditorBuildingArrangementContainerField,
    updateScriptEditorBuildingArrangementLayoutField,
    updateScriptEditorBuildingArrangementLayoutNodeField,
    updateScriptEditorBuildingArrangementLayoutNodeFlag,
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
  assert.equal(project.buildingArrangements[0].layout.templateId, "default-shell");
  assert.ok(project.buildingArrangements[0].layout.nodes.length > 0);
  assert.equal(project.buildingArrangements[0].layout.nodes[0].id, "node.header");
  project = appendScriptEditorBuildingArrangementNpc(project, arrangementId, "person.host");
  project = updateScriptEditorBuildingArrangementPrimaryNpc(
    project,
    arrangementId,
    "person.host"
  );
  project = updateScriptEditorBuildingArrangementLayoutField(
    project,
    arrangementId,
    "templateId",
    "meeting-stage"
  );
  project = updateScriptEditorBuildingArrangementLayoutField(
    project,
    arrangementId,
    "shellClassNames",
    "view-house-temple, view-house-building-shell"
  );
  project = appendScriptEditorBuildingArrangementLayoutNode(project, arrangementId);
  project = updateScriptEditorBuildingArrangementLayoutNodeField(
    project,
    arrangementId,
    0,
    "kind",
    "character-seats"
  );
  project = updateScriptEditorBuildingArrangementLayoutNodeField(
    project,
    arrangementId,
    0,
    "regionId",
    "focus"
  );
  project = updateScriptEditorBuildingArrangementLayoutNodeFlag(
    project,
    arrangementId,
    0,
    "previewDraggable",
    true
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
  assert.equal(project.buildingArrangements[0].layout.templateId, "meeting-stage");
  assert.deepEqual(project.buildingArrangements[0].layout.shellClassNames, [
    "view-house-temple",
    "view-house-building-shell",
  ]);
  assert.equal(project.buildingArrangements[0].layout.nodes[0].kind, "character-seats");
  assert.equal(project.buildingArrangements[0].layout.nodes[0].regionId, "focus");
  assert.equal(project.buildingArrangements[0].layout.nodes[0].previewDraggable, true);
  assert.equal(project.buildingArrangements[0].containers[0].type, "resource-panel");
  assert.equal(project.buildingArrangements[0].containers[0].items, undefined);
  assert.deepEqual(baseProject.buildingArrangements, []);
});

test("script editor building arrangement authoring avoids duplicate arrangement rows for the same mounted building", () => {
  const {
    appendScriptEditorBuildingArrangement,
  } = require("../.test-dist/application/script-editor/city-building-authoring.js");

  const baseProject = {
    schemaVersion: 1,
    id: "project.arrangement",
    title: "Arrangement Project",
    scenarioProfile: {},
    maps: [],
    cities: [{ id: "city.start", name: "Start City" }],
    buildings: [
      { id: "building.temple", cityId: "city.start", name: "Temple" },
      { id: "building.market", cityId: "city.start", name: "Market" },
    ],
    buildingArrangements: [],
    people: [],
    factions: [],
    chapters: [],
    storyNodes: [],
    dialogues: [],
    events: [],
    eventBindings: [],
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

  const firstPass = appendScriptEditorBuildingArrangement(
    baseProject,
    "city.start",
    "building.temple"
  );
  const secondPass = appendScriptEditorBuildingArrangement(
    firstPass,
    "city.start",
    "building.temple"
  );

  assert.equal(firstPass.buildingArrangements.length, 1);
  assert.equal(secondPass.buildingArrangements.length, 1);
  assert.equal(secondPass.buildingArrangements[0].buildingId, "building.temple");
});

test("script editor runtime families source arrangement npc ownership from city mounted buildings", () => {
  const {
    materializeScriptEditorCityBuildingRuntimeFamilies,
  } = require("../.test-dist/application/script-editor/city-building-runtime-materializer.js");

  const runtimeFamilies = materializeScriptEditorCityBuildingRuntimeFamilies({
    schemaVersion: 1,
    id: "project.runtime",
    title: "Runtime Project",
    scenarioProfile: {},
    maps: [],
    cities: [
      {
        id: "city.start",
        name: "Start City",
        mountedBuildings: [
          {
            buildingId: "building.temple",
            npcIds: ["person.guard", "person.host"],
            primaryNpcId: "person.host",
          },
        ],
      },
    ],
    buildings: [{ id: "building.temple", cityId: "city.start", name: "Temple" }],
    buildingArrangements: [
      {
        id: "building-arrangement.temple",
        cityId: "city.start",
        buildingId: "building.temple",
        displayName: "Temple",
        mountedNpcIds: ["person.legacy"],
        primaryNpcId: "person.legacy",
        containers: [],
      },
    ],
    people: [
      { id: "person.host", name: "Host", personType: "NPC" },
      { id: "person.guard", name: "Guard", personType: "NPC" },
    ],
    factions: [],
    chapters: [],
    storyNodes: [],
    dialogues: [],
    events: [],
    eventBindings: [],
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
  });

  assert.deepEqual(runtimeFamilies.buildingArrangements, [
    {
      id: "building-arrangement.temple",
      cityId: "city.start",
      buildingId: "building.temple",
      displayName: "Temple",
      mountedNpcIds: ["person.guard", "person.host"],
      primaryNpcId: "person.host",
      containers: [],
    },
  ]);
});

test("script editor city tabs separate mounted buildings from building arrangements", () => {
  const mainUiSource = fs.readFileSync(
    path.join(process.cwd(), "src/ui/main-ui/main-ui-flow.js"),
    "utf8"
  );

  assert.match(mainUiSource, /renderScriptEditorLocationTabButton\("arrangements", "建筑编排"\)/);
  assert.match(mainUiSource, /this\.scriptEditorLocationTab === "mounted" && family === "cities"/);
  assert.match(mainUiSource, /this\.scriptEditorLocationTab === "arrangements" && family === "cities"/);
  assert.match(
    mainUiSource,
    /\["profile", "mounted", "arrangements", "menus", "access", "events"\]/
  );
  assert.match(mainUiSource, /城市地点入口由“挂载”分栏负责/);
  assert.match(mainUiSource, /仅添加建筑编排不会自动出现在进城后的地点选择里/);
});

test("script editor city profile UI exposes building arrangement and generic container controls", () => {
  const mainUiSource = fs.readFileSync(
    path.join(process.cwd(), "src/ui/main-ui/main-ui-flow.js"),
    "utf8"
  );
  const normalizedMainUiSource = mainUiSource.replace(/\r\n/g, "\n");
  const authoringSource = fs.readFileSync(
    path.join(process.cwd(), "src/application/script-editor/city-building-authoring.ts"),
    "utf8"
  );
  const plannerBlock =
    normalizedMainUiSource.match(
      /renderScriptEditorCityBuildingArrangementPlanner\(city, project\) \{[\s\S]*?\n  \}\n\n  renderScriptEditorCityMountedBuildingsPanel/
    )?.[0] ?? "";

  assert.match(mainUiSource, /renderScriptEditorBuildingArrangementPanel\(location\)/);
  assert.match(mainUiSource, /renderScriptEditorCityBuildingArrangementPlanner\(city, project\)/);
  assert.match(plannerBlock, /data-script-editor-building-id=/);
  assert.match(plannerBlock, /未挂载的旧编排/);
  assert.match(plannerBlock, /这里只编排已挂载建筑的室内内容/);
  assert.match(plannerBlock, /data-script-editor-building-arrangement-field/);
  assert.match(plannerBlock, /data-script-editor-building-layout-field/);
  assert.match(plannerBlock, /data-script-editor-building-layout-node-field/);
  assert.match(plannerBlock, /data-script-editor-building-layout-node-flag/);
  assert.match(plannerBlock, /data-script-editor-building-container-field/);
  assert.match(plannerBlock, /data-script-editor-building-container-action-field/);
  assert.doesNotMatch(plannerBlock, /data-script-editor-building-arrangement-npc/);
  assert.doesNotMatch(plannerBlock, /data-script-editor-building-arrangement-primary-npc/);
  assert.doesNotMatch(plannerBlock, /data-script-editor-building-arrangement-field="id"/);
  assert.doesNotMatch(plannerBlock, /data-script-editor-building-arrangement-field="buildingId"/);
  assert.doesNotMatch(plannerBlock, /<span>编排 ID<\/span>/);
  assert.match(mainUiSource, /SCRIPT_EDITOR_BUILDING_CONTAINER_TYPES/);
  assert.match(authoringSource, /SCRIPT_EDITOR_BUILDING_LAYOUT_TEMPLATE_IDS/);
  assert.match(authoringSource, /readScriptEditorBuildingLayoutRecord/);
  assert.match(authoringSource, /SCRIPT_EDITOR_BUILDING_LAYOUT_NODE_KINDS/);
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

test("script editor building layout helpers resolve template defaults without inline UI fallback objects", () => {
  const {
    createDefaultScriptEditorBuildingLayoutRecord,
    readScriptEditorBuildingLayoutRecord,
  } = require("../.test-dist/application/script-editor/city-building-authoring.js");

  const defaultLayout = createDefaultScriptEditorBuildingLayoutRecord();
  const meetingLayout = readScriptEditorBuildingLayoutRecord({
    templateId: "meeting-stage",
  });

  assert.equal(defaultLayout.templateId, "default-shell");
  assert.ok(defaultLayout.nodes.length > 0);
  assert.equal(meetingLayout.templateId, "meeting-stage");
  assert.ok(meetingLayout.nodes.some((node) => node.presentation === "meeting-grid"));
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
      dialogues: [],
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
  "script editor projects preserve internal flow content through runtime pack export/import",
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
          description: "An internal flow playable body.",
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
    const exportedFlows = JSON.parse(files["flow-playables.json"]);
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
    assert.equal(importedProject.flows[0].id, "flow.temple.rest");
    assert.equal(importedProject.flows[0].initialNodeId, "node.start");
    assert.deepEqual(importedProject.minigames, []);
  }
);

test(
  "script editor keeps flows out of the visible authoring shell and fail-closes hidden flow selection",
  () => {
    const {
      createDefaultScriptEditorProjectDefinition,
      getScriptEditorWorkflowVisibleFamilies,
    } = require("../.test-dist/application/script-editor/minimal-workflow.js");
    const {
      createScriptEditorWorkspaceShellViewModel,
    } = require("../.test-dist/application/script-editor/workspace-shell.js");
    const mainUiSource = fs.readFileSync(
      path.join(process.cwd(), "src/ui/main-ui/main-ui-flow.js"),
      "utf8"
    );
    const workflowSource = fs.readFileSync(
      path.join(process.cwd(), "src/application/script-editor/minimal-workflow.ts"),
      "utf8"
    );
    const workspaceShellSource = fs.readFileSync(
      path.join(process.cwd(), "src/application/script-editor/workspace-shell.ts"),
      "utf8"
    );
    const project = createDefaultScriptEditorProjectDefinition();
    project.flows = [
      {
        id: "flow.temple.rest",
        title: "Rest",
        initialNodeId: "node.start",
        nodes: [{ id: "node.start", type: "text", text: "Rest.", nextNodeId: "" }],
        outcomeRoutes: [],
      },
    ];
    const workspace = createScriptEditorWorkspaceShellViewModel({
      project,
      selection: {
        family: "flows",
        entityId: "flow.temple.rest",
      },
      visibleFamilies: getScriptEditorWorkflowVisibleFamilies(),
    });

    assert.match(workflowSource, /"flows"/);
    assert.match(workflowSource, /family !== "flows"/);
    assert.doesNotMatch(mainUiSource, /renderScriptEditorFlowEditor/);
    assert.doesNotMatch(
      mainUiSource,
      /data-script-editor-record-search-family="flows"/
    );
    assert.doesNotMatch(workspaceShellSource, /"quests", "minigames", "flows"/);
    assert.doesNotMatch(workspaceShellSource, /FAMILY_LABELS\.flows/);
    assert.equal(workspace.selection.family, "storyPack");
    assert.equal(workspace.selection.entityId, null);
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
      dialogues: JSON.parse(files["dialogues.json"]),
      playables: JSON.parse(files["playables.json"]),
      playableIntegrations: JSON.parse(files["playable-integrations.json"]),
      flowPlayables: JSON.parse(files["flow-playables.json"]),
    });

    assert.equal(
      activeContent.flowPlayablesById["flow.preview.rest"].initialNodeId,
      "node.start"
    );
  }
);
