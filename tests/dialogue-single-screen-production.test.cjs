const assert = require("node:assert/strict");
const test = require("node:test");

const {
  importScenarioPackToScriptEditorProject,
} = require("../.test-dist/modules/script-editor/application/runtime-pack-import.js");
const {
  createDefaultScriptEditorProjectDefinition,
  removeScriptEditorWorkflowRecord,
} = require("../.test-dist/modules/script-editor/application/minimal-workflow.js");
const {
  parseScriptEditorProject,
} = require("../.test-dist/modules/script-editor/application/editor-project-loader.js");
const {
  materializeScriptEditorCityBuildingRuntimeFamilies,
} = require("../.test-dist/modules/script-editor/application/city-building-runtime-materializer.js");

test("runtime pack import maps single-screen runtime dialogues into script-editor dialogue records", () => {
  const project = importScenarioPackToScriptEditorProject({
    schemaVersion: 1,
    id: "pack.dialogue.import",
    title: "Dialogue Import",
    scenarioProfile: {
      id: "scenario.dialogue.import",
      playerCharacterId: "char.hero",
      chapterId: "chapter.start",
      initialLocation: {
        mapId: "map.test",
        cityId: "city.test",
        houseId: null,
        view: "city",
      },
    },
    characters: [
      { id: "char.hero", name: "Hero" },
      { id: "char.abbot", name: "Abbot" },
    ],
    cities: [{ id: "city.test", name: "Test City", houseIds: [] }],
    dialogues: [
      {
        id: "dialogue.opening",
        name: "Opening",
        screen: {
          mode: "choice",
          textId: "text.dialogue.opening",
          speakerCharacterId: "char.abbot",
          cast: [
            { characterId: "char.abbot", side: "left" },
            { characterId: "char.hero", side: "right" },
          ],
          options: [
            {
              id: "option.accept",
              labelTextId: "text.option.accept",
              nextEventId: "event.accept",
            },
          ],
        },
      },
    ],
    textEntries: {
      "text.dialogue.opening": "开场白",
      "text.option.accept": "应下",
    },
    events: [],
  });

  assert.deepEqual(project.dialogues, [
    {
      id: "dialogue.opening",
      title: "Opening",
      mode: "choice",
      textId: "text.dialogue.opening",
      speakerPersonId: "char.abbot",
      cast: [
        { personId: "char.abbot", side: "left" },
        { personId: "char.hero", side: "right" },
      ],
      options: [
        {
          id: "option.accept",
          textId: "text.option.accept",
          nextEventId: "event.accept",
        },
      ],
      nextEventId: "",
      storyNodeId: "",
    },
  ]);
});

test("runtime pack import migrates legacy node-based choice dialogues into single-screen options on the main authoring path", () => {
  const project = importScenarioPackToScriptEditorProject({
    schemaVersion: 1,
    id: "pack.dialogue.legacy-import",
    title: "Legacy Dialogue Import",
    scenarioProfile: {
      id: "scenario.dialogue.legacy-import",
      playerCharacterId: "char.hero",
      chapterId: "chapter.start",
      initialLocation: {
        mapId: "map.test",
        cityId: "city.test",
        houseId: null,
        view: "city",
      },
    },
    characters: [
      { id: "char.hero", name: "Hero" },
      { id: "char.abbot", name: "Abbot" },
    ],
    cities: [{ id: "city.test", name: "Test City", houseIds: [] }],
    dialogues: [
      {
        id: "dialogue.legacy.choice",
        name: "Legacy Choice",
        nodes: [
          {
            id: "node.dialogue",
            type: "dialogue",
            characterId: "char.abbot",
            side: "left",
            textId: "text.dialogue.legacy",
          },
          {
            id: "node.choice",
            type: "choice",
            promptTextId: "text.dialogue.prompt",
            options: [
              {
                id: "option.accept",
                labelTextId: "text.option.accept",
                nextEventId: "event.accept",
              },
              {
                id: "option.reject",
                labelTextId: "text.option.reject",
                nextEventId: "event.reject",
              },
            ],
          },
        ],
      },
    ],
    textEntries: {
      "text.dialogue.legacy": "施主可愿相助？",
      "text.dialogue.prompt": "你要如何回应？",
      "text.option.accept": "愿意",
      "text.option.reject": "不愿",
    },
    events: [],
  });

  assert.deepEqual(project.dialogues[0].mode, "choice");
  assert.equal(project.dialogues[0].textId, "text.dialogue.legacy");
  assert.equal(project.dialogues[0].speakerPersonId, "char.abbot");
  assert.deepEqual(project.dialogues[0].options, [
    {
      id: "option.accept",
      textId: "text.option.accept",
      nextEventId: "event.accept",
    },
    {
      id: "option.reject",
      textId: "text.option.reject",
      nextEventId: "event.reject",
    },
  ]);
});

test("default workflow project seeds its sample dialogue with single-screen fields", () => {
  const project = createDefaultScriptEditorProjectDefinition();
  const dialogue = project.dialogues[0];

  assert.equal(dialogue.id, "dialogue.opening");
  assert.equal(dialogue.mode, "linear");
  assert.equal(dialogue.textId, "text.opening");
  assert.equal(dialogue.speakerPersonId, "person.hero");
  assert.deepEqual(dialogue.cast, [{ personId: "person.hero", side: "left" }]);
  assert.equal(dialogue.nodes, undefined);
  assert.equal(dialogue.participantPersonIds, undefined);
});

test("project parsing normalizes single-screen dialogue fields at load time", () => {
  const project = createDefaultScriptEditorProjectDefinition();
  project.dialogues = [
    {
      ...project.dialogues[0],
      title: " 化缘 ",
      mode: "choice",
      textId: " text.dialogue.choice ",
      speakerPersonId: " person.hero ",
      cast: [
        { personId: " person.hero ", side: "left" },
        { personId: " person.patron ", side: "right" },
      ],
      options: [
        {
          id: " option.accept ",
          textId: " text.option.accept ",
          nextEventId: " event.accept ",
        },
      ],
    },
  ];

  const parsed = parseScriptEditorProject(project);
  const dialogue = parsed.dialogues[0];

  assert.equal(dialogue.title, "化缘");
  assert.equal(dialogue.mode, "choice");
  assert.equal(dialogue.textId, "text.dialogue.choice");
  assert.equal(dialogue.speakerPersonId, "person.hero");
  assert.deepEqual(dialogue.cast, [
    { personId: "person.hero", side: "left" },
    { personId: "person.patron", side: "right" },
  ]);
  assert.deepEqual(dialogue.options, [
    {
      id: "option.accept",
      textId: "text.option.accept",
      nextEventId: "event.accept",
    },
  ]);
});

test("removing an event clears single-screen dialogue next-event routes", () => {
  const project = createDefaultScriptEditorProjectDefinition();
  project.dialogues = [
    {
      id: "dialogue.linear",
      title: "Linear",
      mode: "linear",
      textId: "text.linear",
      speakerPersonId: "person.hero",
      cast: [{ personId: "person.hero", side: "left" }],
      nextEventId: "event.remove-me",
      options: [],
    },
    {
      id: "dialogue.choice",
      title: "Choice",
      mode: "choice",
      textId: "text.choice",
      speakerPersonId: "person.hero",
      cast: [{ personId: "person.hero", side: "left" }],
      options: [
        { id: "accept", textId: "text.accept", nextEventId: "event.remove-me" },
        { id: "reject", textId: "text.reject", nextEventId: "event.keep-me" },
      ],
    },
  ];
  project.events = [
    {
      id: "event.remove-me",
      title: "Remove Me",
      description: "",
      triggerTiming: "manual",
      repeatable: false,
      nextEventId: "",
      destination: { family: "dialogue", targetId: "" },
      relations: { storyNodeId: "", personIds: [], cityIds: [], buildingIds: [] },
      previewSummary: { previewNotes: "", validationNotes: "" },
    },
    {
      id: "event.keep-me",
      title: "Keep Me",
      description: "",
      triggerTiming: "manual",
      repeatable: false,
      nextEventId: "",
      destination: { family: "dialogue", targetId: "" },
      relations: { storyNodeId: "", personIds: [], cityIds: [], buildingIds: [] },
      previewSummary: { previewNotes: "", validationNotes: "" },
    },
  ];

  const nextProject = removeScriptEditorWorkflowRecord(
    project,
    "events",
    "event.remove-me"
  );

  assert.equal(nextProject.dialogues[0].nextEventId, "");
  assert.deepEqual(nextProject.dialogues[1].options, [
    { id: "accept", textId: "text.accept", nextEventId: "" },
    { id: "reject", textId: "text.reject", nextEventId: "event.keep-me" },
  ]);
});

test("location access blocked dialogue resolves blockedMessage from single-screen dialogue textId", () => {
  const runtimeFamilies = materializeScriptEditorCityBuildingRuntimeFamilies({
    schemaVersion: 1,
    kind: "script-editor-project",
    id: "project.access",
    title: "Access Project",
    completionState: {
      runtimeReady: false,
      exportReady: false,
      issues: [],
    },
    storyPack: { scenarioProfile: { chapterId: "chapter.start" } },
    maps: [],
    people: [],
    cities: [
      {
        id: "city.test",
        name: "Test City",
        mounts: [],
        access: {
          conditionExpression: {
            type: "literal",
            value: false,
          },
          blockedDialogueId: "dialogue.blocked",
        },
      },
    ],
    buildings: [],
    buildingArrangements: [],
    cityEntries: [],
    settlements: [],
    events: [],
    eventBindings: [],
    progressTracks: [],
    progressTrackBindings: [],
    menuResources: [],
    menuInstances: [],
    dialogues: [
      {
        id: "dialogue.blocked",
        title: "Blocked",
        mode: "linear",
        textId: "text.blocked",
        speakerPersonId: "person.guard",
        cast: [{ personId: "person.guard", side: "left" }],
        nextEventId: "",
        options: [],
      },
    ],
    quests: [],
    activities: [],
    cards: [],
    valuables: [],
    items: [],
    cityNpcPools: [],
    houseModuleDefaults: {},
    portraits: [],
    portraitVariants: [],
    cityPortraits: {},
    historicalCharacters: [],
    historicalCityRosters: [],
    historicalCharacterIdByCharacterId: {},
    minigames: [],
    flows: [],
    storyNodes: [],
    textEntries: [{ id: "text.blocked", text: "闲人止步" }],
    conditionGroups: [],
    effectBundles: [],
  });

  assert.equal(runtimeFamilies.locationAccess[0].blockedMessage, "闲人止步");
});
