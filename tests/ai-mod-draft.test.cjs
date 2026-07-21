const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

function createSchoolDraft() {
  return {
    schemaVersion: 1,
    kind: "ai-mod-draft",
    id: "draft.school-comeback",
    title: "学渣在二中逆袭",
    generationScope: {
      mode: "first-stage-only",
      currentStageId: "stage.001.bottom-student",
    },
    themeFrame: {
      genreKernel: "taiko_progression",
      premise: "一个长期成绩垫底的学生，在二中通过学习、关系和评定循环逐步逆袭。",
      coreGoal: "从学渣成长为班级前列学生。",
      longArc: ["学渣", "班级中游", "班级前列", "年级前列", "高考名校"],
    },
    statMapping: {
      intelligence: { label: "学力", meaning: "考试分数、理解速度、排名上限" },
      leadership: { label: "毅力", meaning: "坚持学习、抗疲劳、抗诱惑" },
      charm: { label: "心态", meaning: "自信、抗压、老师好感、同学关系" },
      force: { label: "体能", meaning: "早起、熬夜、运动与长时间刷题" },
      politics: { label: "自律", meaning: "规划时间、执行计划、远离手机游戏" },
    },
    skillMapping: [
      { id: "skill.exam-technique", label: "技巧", mapsTo: "算术" },
      { id: "skill.relationship", label: "人脉", mapsTo: "礼法" },
      { id: "skill.luck", label: "气运", hidden: true },
    ],
    worldScale: {
      city: { id: "city.no2-school", name: "二中" },
      buildings: [
        { id: "building.classroom", name: "高三二班教室", role: "review_and_daily_study" },
        { id: "building.library", name: "图书馆", role: "study_training" },
        { id: "building.playground", name: "操场", role: "stamina_recovery" },
      ],
    },
    stages: [
      {
        id: "stage.001.bottom-student",
        title: "倒数起步",
        goal: "从班级倒数进入中游",
        reviewCycle: {
          reviewerPersonId: "person.teacher.li",
          reviewBuildingId: "building.classroom",
          cadence: "monthly",
        },
      },
    ],
    entities: {
      player: {
        id: "player",
        name: "周明",
        role: "主角",
        initialStats: {
          intelligence: 18,
          leadership: 25,
          charm: 30,
          force: 28,
          politics: 20,
        },
      },
      people: [
        { id: "person.teacher.li", name: "李老师", role: "班主任", buildingId: "building.classroom" },
        { id: "person.top-student.chen", name: "陈雨", role: "学霸", buildingId: "building.library" },
        { id: "person.rival.zhao", name: "赵强", role: "竞争者", buildingId: "building.classroom" },
      ],
    },
    actionLoops: [
      {
        id: "loop.study.library",
        label: "图书馆刷题",
        buildingId: "building.library",
        effects: [{ type: "add-stat", target: "player", stat: "intelligence", amount: 2 }],
      },
    ],
    dialogues: [
      {
        id: "dialogue.teacher.first-review",
        title: "班主任的第一次评定",
        nodes: [
          {
            id: "n1",
            speaker: "person.teacher.li",
            text: "周明，你最近的状态我看在眼里。",
          },
          { id: "n2", speaker: "player", text: "老师，我想试一次。" },
        ],
      },
    ],
    events: [
      {
        id: "event.teacher.first-review",
        title: "班主任的第一次评定",
        stageId: "stage.001.bottom-student",
        content: { type: "dialogue", dialogueId: "dialogue.teacher.first-review" },
        effects: [{ type: "set-flag", key: "review.teacher.first", value: true }],
      },
    ],
    bindings: [
      {
        id: "binding.classroom.teacher.first-review",
        eventId: "event.teacher.first-review",
        owner: { family: "building", id: "building.classroom" },
        trigger: { timing: "building-enter", action: "enter" },
        conditions: {
          operator: "all",
          conditions: [{ type: "flag", key: "review.teacher.first", expected: false }],
        },
        priority: 100,
        enabled: true,
      },
    ],
    draftResidue: [
      {
        id: "residue.exam-ranking-simulation",
        type: "system-design",
        summary: "班级排名和考试模拟需要后续专门机制支持。",
      },
    ],
  };
}

function createFilesFromRecord(record) {
  return Object.entries(record).map(([name, text]) => {
    const file = new File([text], name, { type: "application/json" });
    Object.defineProperty(file, "webkitRelativePath", {
      configurable: true,
      value: name,
    });
    return file;
  });
}

test("normalizer reports deterministic diagnostics for invalid AI mod draft", () => {
  const { normalizeAiModDraft } = require("../.test-dist/application/ai-mod-draft/ai-mod-draft-normalizer.js");

  const result = normalizeAiModDraft({
    schemaVersion: 1,
    kind: "ai-mod-draft",
    generationScope: { mode: "first-stage-only" },
  });

  assert.equal(result.draft, null);
  assert.deepEqual(
    result.diagnostics.map((diagnostic) => ({
      severity: diagnostic.severity,
      path: diagnostic.path,
    })),
    [
      { severity: "error", path: "id" },
      { severity: "error", path: "title" },
    ]
  );
});

test("normalizer rejects AI mod drafts that would create an empty editor project", () => {
  const { normalizeAiModDraft } = require("../.test-dist/application/ai-mod-draft/ai-mod-draft-normalizer.js");

  const result = normalizeAiModDraft({
    schemaVersion: 1,
    kind: "ai-mod-draft",
    id: "draft.empty-shell",
    title: "Empty Shell",
    generationScope: { mode: "first-stage-only" },
    worldScale: { city: { id: "city.empty", name: "Empty City" }, buildings: [] },
    entities: { people: [] },
    stages: [],
    dialogues: [],
    events: [],
    bindings: [],
  });

  assert.equal(result.draft, null);
  assert.deepEqual(
    result.diagnostics.map((diagnostic) => ({
      severity: diagnostic.severity,
      path: diagnostic.path,
    })),
    [
      { severity: "error", path: "worldScale.buildings" },
      { severity: "error", path: "entities.player" },
      { severity: "error", path: "entities.people" },
      { severity: "error", path: "stages" },
      { severity: "error", path: "dialogues" },
      { severity: "error", path: "events" },
      { severity: "error", path: "bindings" },
    ]
  );
});

test("normalizer accepts common model aliases for editable world and entity fields", () => {
  const { normalizeAiModDraft } = require("../.test-dist/application/ai-mod-draft/ai-mod-draft-normalizer.js");

  const draft = createSchoolDraft();
  draft.worldScale.locations = draft.worldScale.buildings;
  delete draft.worldScale.buildings;
  draft.entities.protagonist = draft.entities.player;
  draft.entities.npcs = draft.entities.people;
  delete draft.entities.player;
  delete draft.entities.people;

  const result = normalizeAiModDraft(draft);

  assert.equal(result.diagnostics.filter((diagnostic) => diagnostic.severity === "error").length, 0);
  assert.equal(result.draft.worldScale.buildings.length, 3);
  assert.equal(result.draft.entities.player.id, "player");
  assert.equal(result.draft.entities.people.length, 3);
});

test("normalizer accepts a minimal first-stage AI mod draft", () => {
  const { normalizeAiModDraft } = require("../.test-dist/application/ai-mod-draft/ai-mod-draft-normalizer.js");

  const result = normalizeAiModDraft(createSchoolDraft());

  assert.equal(result.diagnostics.filter((diagnostic) => diagnostic.severity === "error").length, 0);
  assert.equal(result.draft.id, "draft.school-comeback");
  assert.equal(result.draft.generationScope.mode, "first-stage-only");
  assert.equal(Array.isArray(result.draft.actionLoops), true);
});

test("converter maps a school comeback draft into a complete Script Editor project", () => {
  const { normalizeAiModDraft } = require("../.test-dist/application/ai-mod-draft/ai-mod-draft-normalizer.js");
  const {
    convertAiModDraftToScriptEditorProject,
  } = require("../.test-dist/application/ai-mod-draft/ai-draft-to-script-editor-project.js");

  const normalized = normalizeAiModDraft(createSchoolDraft());
  const result = convertAiModDraftToScriptEditorProject(normalized.draft);

  assert.equal(result.project.kind, "script-editor-project");
  assert.equal(result.project.storyPack.id, "story-pack.school-comeback");
  assert.equal(result.project.people.some((person) => person.id === "player" && person.name === "周明"), true);
  assert.equal(result.project.cities[0].id, "city.no2-school");
  assert.deepEqual(
    result.project.buildings.map((building) => building.id),
    ["building.classroom", "building.library", "building.playground"]
  );
  assert.equal(result.project.dialogues[0].id, "dialogue.teacher.first-review");
  assert.equal(result.project.events[0].destination.family, "dialogue");
  assert.equal(result.project.events[0].destination.targetId, "dialogue.teacher.first-review");
  assert.equal(result.project.eventBindings[0].owner.family, "building");
  assert.equal(Array.isArray(result.project.storyPack.aiDraftResidue), true);
  assert.equal(result.project.storyPack.aiDraftResidue[0].id, "residue.exam-ranking-simulation");
});

test("converter creates AI projects that can enter runtime preview", () => {
  const { normalizeAiModDraft } = require("../.test-dist/application/ai-mod-draft/ai-mod-draft-normalizer.js");
  const {
    convertAiModDraftToScriptEditorProject,
  } = require("../.test-dist/application/ai-mod-draft/ai-draft-to-script-editor-project.js");
  const {
    exportScriptEditorProjectToScenarioPackFiles,
    validateScriptEditorProjectForRuntimeExport,
  } = require("../.test-dist/application/script-editor/runtime-pack-export.js");

  const normalized = normalizeAiModDraft(createSchoolDraft());
  const result = convertAiModDraftToScriptEditorProject(normalized.draft);
  const diagnostics = validateScriptEditorProjectForRuntimeExport(result.project);

  assert.deepEqual(diagnostics, []);
  const files = exportScriptEditorProjectToScenarioPackFiles(result.project);
  assert.equal(Object.hasOwn(files, "pack.json"), true);
  assert.equal(JSON.parse(files["events.json"]).length, 1);
  assert.equal(JSON.parse(files["event-bindings.json"]).length, 1);
});

test("converter sanitizes nested AI draft fields before editor rendering", () => {
  const { normalizeAiModDraft } = require("../.test-dist/application/ai-mod-draft/ai-mod-draft-normalizer.js");
  const {
    convertAiModDraftToScriptEditorProject,
  } = require("../.test-dist/application/ai-mod-draft/ai-draft-to-script-editor-project.js");
  const dirtyDraft = createSchoolDraft();
  dirtyDraft.themeFrame.premise = { bad: true };
  dirtyDraft.worldScale.city = { id: 404, name: { bad: true } };
  dirtyDraft.worldScale.buildings = [{ id: 7, name: false, role: { bad: true } }];
  dirtyDraft.entities.player = {
    id: 1,
    name: { bad: true },
    role: false,
    initialStats: { intelligence: 18 },
  };
  dirtyDraft.entities.people = [{ id: 2, name: true, role: { bad: true }, buildingId: 7 }];
  dirtyDraft.stages = [{ id: 3, title: { bad: true }, goal: false }];
  dirtyDraft.dialogues = [
    {
      id: 4,
      title: { bad: true },
      nodes: [{ id: 5, speaker: 2, text: { bad: true } }],
    },
  ];
  dirtyDraft.events = [
    {
      id: 6,
      title: false,
      stageId: 3,
      content: { type: "dialogue", dialogueId: 4 },
      effects: [{ type: "set-flag" }],
    },
  ];
  dirtyDraft.bindings = [
    {
      id: 8,
      eventId: 6,
      owner: { family: "building", id: 7 },
      trigger: null,
      conditions: null,
    },
  ];

  const normalized = normalizeAiModDraft(dirtyDraft);
  const result = convertAiModDraftToScriptEditorProject(normalized.draft);

  assert.equal(result.project.people[0].id, "1");
  assert.equal(result.project.storyPack.scenarioProfile.playerCharacterId, "1");
  assert.equal(result.project.storyPack.scenarioProfile.initialLocation.houseId, "7");
  assert.equal(result.project.people[0].name, "Player");
  assert.equal(result.project.storyPack.description, dirtyDraft.title);
  assert.equal(result.project.cities[0].id, "city.generated");
  assert.equal(result.project.cities[0].name, "Generated City");
  assert.equal(result.project.buildings[0].id, "7");
  assert.equal(result.project.dialogues[0].id, "4");
  assert.equal(result.project.dialogues[0].title, "Dialogue 1");
  assert.equal(result.project.dialogues[0].nodes[0].speakerPersonId, "2");
  assert.equal(result.project.textEntries[0].text, "");
  assert.equal(result.project.events[0].id, "6");
  assert.equal(result.project.events[0].title, "false");
  assert.equal(result.project.eventBindings[0].id, "8");
  assert.equal(result.project.eventBindings[0].owner.id, "7");
});

test("convert CLI writes a loadable Script Editor project package", async () => {
  const { loadScriptEditorProjectFromFiles } = require("../.test-dist/application/script-editor/editor-project-loader.js");

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ai-mod-draft-"));
  const inputPath = path.join(tempRoot, "draft.json");
  const outDir = path.join(tempRoot, "project");
  fs.writeFileSync(inputPath, JSON.stringify(createSchoolDraft(), null, 2), "utf8");

  const result = spawnSync(
    process.execPath,
    ["tools/convert-ai-mod-draft.mjs", "--input", inputPath, "--out", outDir],
    { cwd: path.resolve(__dirname, ".."), encoding: "utf8" }
  );

  assert.equal(result.status, 0, result.stderr || result.stdout);
  for (const fileName of [
    "project.json",
    "story-pack.json",
    "people.json",
    "events.json",
    "event-bindings.json",
    "dialogues.json",
    "text-entries.json",
  ]) {
    assert.equal(fs.existsSync(path.join(outDir, fileName)), true, `${fileName} should exist`);
  }

  const files = Object.fromEntries(
    fs.readdirSync(outDir).map((fileName) => [
      fileName,
      fs.readFileSync(path.join(outDir, fileName), "utf8"),
    ])
  );
  const loaded = await loadScriptEditorProjectFromFiles(createFilesFromRecord(files));
  assert.equal(loaded.id, "project.school-comeback");
  assert.equal(loaded.dialogues[0].title, "班主任的第一次评定");
});

test("AI draft prompt and generation CLI keep API configuration out of arguments", () => {
  const { buildAiModDraftPrompt } = require("../.test-dist/application/ai-mod-draft/ai-mod-draft-prompts.js");
  const prompt = buildAiModDraftPrompt("学渣在二中逆袭");

  assert.match(prompt, /schemaVersion/);
  assert.match(prompt, /ai-mod-draft/);
  assert.match(prompt, /first-stage-only/);
  assert.match(prompt, /Do not generate JavaScript/);
  assert.match(prompt, /Minimum editable content/);
  assert.match(prompt, /at least 3 buildings/);
  assert.match(prompt, /at least 3 non-player people/);
  assert.match(prompt, /at least 2 dialogues/);
  assert.match(prompt, /at least 2 events/);

  const result = spawnSync(
    process.execPath,
    ["tools/generate-ai-mod-draft.mjs", "--topic", "学渣在二中逆袭", "--out", "unused.json"],
    {
      cwd: path.resolve(__dirname, ".."),
      encoding: "utf8",
      env: {
        ...process.env,
        AI_MOD_DRAFT_API_KEY: "",
        AI_MOD_DRAFT_BASE_URL: "",
        AI_MOD_DRAFT_MODEL: "",
      },
    }
  );

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /AI_MOD_DRAFT_API_KEY/);
  assert.doesNotMatch(result.stderr, /sk-/);
});

test("AI topic project generation helper converts model output without persisting API config", async () => {
  const {
    generateScriptEditorProjectFromAiTopic,
  } = require("../.test-dist/application/ai-mod-draft/ai-mod-draft-ui-flow.js");

  let observedRequest = null;
  const result = await generateScriptEditorProjectFromAiTopic({
    topic: "学渣在二中逆袭的故事",
    config: {
      apiKey: "sk-local-secret",
      baseUrl: "https://example.test/",
      model: "gpt-test",
    },
    generateDraft: async (request) => {
      observedRequest = request;
      return createSchoolDraft();
    },
  });

  assert.equal(observedRequest.topic, "学渣在二中逆袭的故事");
  assert.equal(observedRequest.config.apiKey, "sk-local-secret");
  assert.equal(result.project.kind, "script-editor-project");
  assert.equal(result.project.id, "project.school-comeback");
  assert.equal(JSON.stringify(result.project).includes("sk-local-secret"), false);
});

test("AI topic project generation helper accepts wrapped draft responses", async () => {
  const {
    generateScriptEditorProjectFromAiTopic,
  } = require("../.test-dist/application/ai-mod-draft/ai-mod-draft-ui-flow.js");

  const result = await generateScriptEditorProjectFromAiTopic({
    topic: "wrapped response topic",
    config: {
      apiKey: "sk-local-secret",
      baseUrl: "https://example.test/",
      model: "gpt-test",
    },
    generateDraft: async () => {
      const draft = createSchoolDraft();
      delete draft.schemaVersion;
      delete draft.kind;
      delete draft.generationScope;
      return {
        schemaVersion: 1,
        kind: "ai-mod-draft",
        generationScope: {
          mode: "first-stage-only",
          currentStageId: "stage.001.bottom-student",
        },
        draft,
        notes: "model wrapped the requested JSON object",
      };
    },
  });

  assert.equal(result.project.kind, "script-editor-project");
  assert.equal(result.project.id, "project.school-comeback");
});

test("AI topic project generation helper defaults missing draft id and title from topic", async () => {
  const {
    generateScriptEditorProjectFromAiTopic,
  } = require("../.test-dist/application/ai-mod-draft/ai-mod-draft-ui-flow.js");

  const draft = createSchoolDraft();
  delete draft.id;
  delete draft.title;

  const result = await generateScriptEditorProjectFromAiTopic({
    topic: "学渣在二中逆袭的故事",
    config: {
      apiKey: "sk-local-secret",
      baseUrl: "https://example.test/",
      model: "gpt-test",
    },
    generateDraft: async () => draft,
  });

  assert.match(result.project.id, /^project\.topic-[a-z0-9-]+$/);
  assert.equal(result.project.title, "学渣在二中逆袭的故事");
});

test("script editor landing exposes AI project generation without persistent API key storage", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/ui/main-ui/main-ui-flow.js"),
    "utf8"
  );

  assert.match(source, /generateScriptEditorProjectFromAiTopic/);
  assert.match(source, /data-script-editor-ai-topic/);
  assert.match(source, /data-script-editor-ai-api-key/);
  assert.match(source, /type="password"/);
  assert.match(source, /data-script-editor-ai-base-url/);
  assert.match(source, /data-script-editor-ai-model/);
  assert.match(source, /data-script-editor-action="generate-ai-project"/);
  assert.match(source, /handleScriptEditorAiProjectGeneration/);
  assert.doesNotMatch(source, /localStorage\.setItem\([^)]*AI_MOD_DRAFT_API_KEY/);
  assert.doesNotMatch(source, /serializeScriptEditorProjectToFiles\([^)]*apiKey/);
});
