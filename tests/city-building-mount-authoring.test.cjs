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

test(
  "script editor runtime pack import exposes city npc pool residents as mounted npc candidates",
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

    assert.deepEqual(importedProject.cities[0].mountedBuildings, [
      {
        buildingId: "building.market",
        npcIds: ["city-npc.start.merchant"],
        primaryNpcId: "city-npc.start.merchant",
      },
    ]);
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
