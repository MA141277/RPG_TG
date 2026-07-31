const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const {
  createDefaultScriptEditorDialogueRecord,
  normalizeScriptEditorDialogueRecord,
} = require("../.test-dist/modules/script-editor/application/story-dialogue-event-authoring.js");
const {
  materializeScriptEditorDialogueStoryRuntime,
} = require("../.test-dist/modules/script-editor/application/dialogue-story-runtime-materializer.js");
const {
  createCompatibleSceneDefinitions,
} = require("../.test-dist/core/runtime/mod-first-compatibility.js");

test("default dialogue record uses single-screen authoring fields on the main path", () => {
  const record = createDefaultScriptEditorDialogueRecord(0);

  assert.equal(typeof record.id, "string");
  assert.ok(record.id.length > 0);
  assert.equal(record.title, "对话 1");
  assert.equal(record.mode, "linear");
  assert.equal(record.textId, "");
  assert.equal(record.speakerPersonId, "");
  assert.equal(record.nextEventId, "");
  assert.deepEqual(record.cast, []);
  assert.deepEqual(record.options, []);
  assert.equal(record.nodes, undefined);
  assert.equal(record.participantPersonIds, undefined);
  assert.equal(record.storyNodeId, undefined);
});

test("dialogue normalization keeps single-screen fields trimmed and normalized", () => {
  const record = normalizeScriptEditorDialogueRecord({
    id: "dialogue.test.single-screen",
    title: "  单屏对话  ",
    mode: "choice",
    textId: " text.dialogue.001 ",
    speakerPersonId: " char.speaker ",
    nextEventId: " event.ignore.linear ",
    cast: [
      { personId: " char.speaker ", side: "left" },
      { personId: " char.listener ", side: "right" },
    ],
    options: [
      {
        id: " option.accept ",
        textId: " text.option.accept ",
        nextEventId: " event.accept ",
      },
    ],
  });

  assert.equal(record.title, "单屏对话");
  assert.equal(record.mode, "choice");
  assert.equal(record.textId, "text.dialogue.001");
  assert.equal(record.speakerPersonId, "char.speaker");
  assert.equal(record.nextEventId, "event.ignore.linear");
  assert.deepEqual(record.cast, [
    { personId: "char.speaker", side: "left" },
    { personId: "char.listener", side: "right" },
  ]);
  assert.deepEqual(record.options, [
    {
      id: "option.accept",
      textId: "text.option.accept",
      nextEventId: "event.accept",
    },
  ]);
});

test("dialogue materializer lowers single-screen dialogue records into runtime screen definitions", () => {
  const result = materializeScriptEditorDialogueStoryRuntime({
    people: [
      { id: "char.monk", title: "方丈" },
      { id: "char.patron", title: "施主" },
    ],
    events: [
      { id: "event.accept", title: "接受后续" },
      { id: "event.reject", title: "拒绝后续" },
    ],
    storyNodes: [],
    textEntries: [
      { id: "text.dialogue.001", text: "善人施舍" },
      { id: "text.option.accept", text: "应下" },
      { id: "text.option.reject", text: "拒绝" },
    ],
    dialogues: [
      {
        id: "dialogue.begging",
        title: "化缘",
        mode: "choice",
        textId: "text.dialogue.001",
        speakerPersonId: "char.monk",
        cast: [
          { personId: "char.monk", side: "left" },
          { personId: "char.patron", side: "right" },
        ],
        options: [
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
        ],
      },
    ],
  });

  assert.deepEqual(result.diagnostics, []);
  assert.deepEqual(result.textEntries, {
    "text.dialogue.001": "善人施舍",
    "text.option.accept": "应下",
    "text.option.reject": "拒绝",
  });
  assert.equal(result.dialogues?.length, 1);
  assert.deepEqual(result.dialogues?.[0], {
    id: "dialogue.begging",
    name: "化缘",
    screen: {
      mode: "choice",
      textId: "text.dialogue.001",
      speakerCharacterId: "char.monk",
      cast: [
        { characterId: "char.monk", side: "left" },
        { characterId: "char.patron", side: "right" },
      ],
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
  });
});

test("dialogue materializer reports field-specific diagnostics for missing title and invalid single-screen references", () => {
  const result = materializeScriptEditorDialogueStoryRuntime({
    people: [{ id: "char.hero", title: "主角" }],
    events: [{ id: "event.valid", title: "有效事件" }],
    storyNodes: [],
    textEntries: [{ id: "text.dialogue.001", text: "是否继续？" }],
    dialogues: [
      {
        id: "dialogue.invalid",
        title: " ",
        mode: "choice",
        textId: "text.dialogue.001",
        speakerPersonId: "char.missing",
        cast: [{ personId: "char.hero", side: "left" }],
        options: [
          {
            id: "option.invalid",
            textId: "text.dialogue.001",
            nextEventId: "event.missing",
          },
        ],
      },
    ],
  });

  assert.equal(result.dialogues, null);
  assert.equal(result.textEntries, null);
  assert.deepEqual(
    result.diagnostics.map((diagnostic) => [
      diagnostic.code,
      diagnostic.fieldPath,
    ]),
    [
      ["missing-field", "project.dialogues[0].title"],
      ["missing-reference", "project.dialogues[0].speakerPersonId"],
      ["missing-reference", "project.dialogues[0].options[0].nextEventId"],
    ]
  );
});

test("dialogue materializer safely migrates a single legacy event follow-up into linear nextEventId", () => {
  const result = materializeScriptEditorDialogueStoryRuntime({
    people: [{ id: "char.hero", title: "主角" }],
    events: [{ id: "event.followup", title: "后续事件" }],
    storyNodes: [],
    textEntries: [{ id: "text.dialogue.legacy", text: "继续前进。" }],
    dialogues: [
      {
        id: "dialogue.legacy.followup",
        title: "旧后续对话",
        mode: "linear",
        textId: "text.dialogue.legacy",
        speakerPersonId: "char.hero",
        cast: [{ personId: "char.hero", side: "left" }],
        nextEventId: "",
        options: [],
        followUps: [{ targetFamily: "event", targetId: "event.followup" }],
      },
    ],
  });

  assert.deepEqual(result.diagnostics, []);
  assert.equal(result.dialogues?.[0]?.screen?.mode, "linear");
  if (result.dialogues?.[0]?.screen?.mode !== "linear") {
    throw new Error("Expected linear screen dialogue.");
  }
  assert.equal(result.dialogues[0].screen.nextEventId, "event.followup");
});

test("dialogue materializer reports a compatibility diagnostic when legacy follow-ups cannot be safely migrated", () => {
  const result = materializeScriptEditorDialogueStoryRuntime({
    people: [{ id: "char.hero", title: "主角" }],
    events: [{ id: "event.followup", title: "后续事件" }],
    storyNodes: [],
    textEntries: [{ id: "text.dialogue.choice", text: "你要如何回应？" }],
    dialogues: [
      {
        id: "dialogue.legacy.ambiguous",
        title: "歧义后续对话",
        mode: "choice",
        textId: "text.dialogue.choice",
        speakerPersonId: "char.hero",
        cast: [{ personId: "char.hero", side: "left" }],
        options: [
          {
            id: "option.accept",
            textId: "text.dialogue.choice",
            nextEventId: "event.followup",
          },
        ],
        followUps: [{ targetFamily: "event", targetId: "event.followup" }],
      },
    ],
  });

  assert.equal(result.dialogues, null);
  assert.equal(result.textEntries, null);
  assert.deepEqual(result.diagnostics, [
    {
      code: "unsupported-lowering",
      fieldPath: "project.dialogues[0].followUps",
      message:
        'Dialogue "dialogue.legacy.ambiguous" uses legacy followUps that cannot be safely migrated onto the single-screen main path.',
    },
  ]);
});

test("compatible scene lowering converts single-screen dialogue runtime definitions into one-screen scenes", () => {
  const scenes = createCompatibleSceneDefinitions({
    dialogueDefinitions: [
      {
        id: "dialogue.linear",
        name: "线性对话",
        screen: {
          mode: "linear",
          textId: "text.dialogue.linear",
          speakerCharacterId: "char.speaker",
          cast: [{ characterId: "char.speaker", side: "right" }],
          nextEventId: "event.followup",
        },
      },
      {
        id: "dialogue.choice",
        name: "分支对话",
        screen: {
          mode: "choice",
          textId: "text.dialogue.choice",
          speakerCharacterId: "char.speaker",
          cast: [{ characterId: "char.speaker", side: "left" }],
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
  });

  assert.deepEqual(scenes, [
    {
      id: "dialogue.linear",
      name: "线性对话",
      actions: [
        {
          type: "dialogue",
          characterId: "char.speaker",
          side: "right",
          textId: "text.dialogue.linear",
        },
        {
          type: "start-event",
          eventId: "event.followup",
        },
      ],
    },
    {
      id: "dialogue.choice",
      name: "分支对话",
      actions: [
        {
          type: "dialogue",
          characterId: "char.speaker",
          side: "left",
          textId: "text.dialogue.choice",
        },
        {
          type: "choice",
          promptTextId: "text.dialogue.choice",
          options: [
            {
              id: "option.accept",
              labelTextId: "text.option.accept",
              nextEventId: "event.accept",
            },
          ],
        },
      ],
    },
  ]);
});

test("dialogue editor source collapses the main path to the basic single-screen form", () => {
  const source = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/modules/script-editor/ui/main-ui-script-editor-module.js"
    ),
    "utf8"
  );
  const editorBlock =
    source.match(
      /renderScriptEditorDialogueEditor\(records, selectedRecord\) \{[\s\S]*?\n  }\n\n  renderScriptEditorEventEditor/
    )?.[0] ?? "";
  const panelBlock =
    source.match(
      /renderScriptEditorDialogueTabPanel\(dialogue\) \{[\s\S]*?\n  }\n\n  renderScriptEditorDialogueCastPanel/
    )?.[0] ?? "";

  assert.match(editorBlock, /renderScriptEditorNarrativeTabButton\("profile", "基础"\)/);
  assert.doesNotMatch(editorBlock, /renderScriptEditorNarrativeTabButton\("nodes"/);
  assert.doesNotMatch(editorBlock, /renderScriptEditorNarrativeTabButton\("summary"/);
  assert.doesNotMatch(editorBlock, /renderScriptEditorNarrativeTabButton\("events"/);

  assert.match(panelBlock, /对话类型/);
  assert.match(panelBlock, /对话文本/);
  assert.match(panelBlock, /当前发言人物/);
  assert.match(panelBlock, /出场人物/);
  assert.match(panelBlock, /后续路由/);
  assert.doesNotMatch(panelBlock, /新增节点/);
  assert.doesNotMatch(panelBlock, /对话节点/);
  assert.doesNotMatch(panelBlock, /renderScriptEditorOwnerLocalEventBindingsPanel/);
  assert.doesNotMatch(source, /data-script-editor-dialogue-node-field/);
  assert.doesNotMatch(source, /add-dialogue-node/);
  assert.doesNotMatch(source, /remove-dialogue-node/);
});

test("dialogue is no longer exposed as a primary event-binding owner or trigger route in authoring UI", () => {
  const uiSource = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/modules/script-editor/ui/main-ui-script-editor-module.js"
    ),
    "utf8"
  );
  const authoringSource = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/modules/script-editor/application/story-dialogue-event-authoring.ts"
    ),
    "utf8"
  );
  const uiOwnerBlock =
    uiSource.match(
      /const SCRIPT_EDITOR_EVENT_BINDING_OWNER_FAMILY_OPTIONS = \[[\s\S]*?\];/
    )?.[0] ?? "";
  const uiTriggerBlock =
    uiSource.match(
      /const SCRIPT_EDITOR_EVENT_BINDING_TRIGGER_OPTIONS_BY_OWNER = \{[\s\S]*?\n\};/
    )?.[0] ?? "";
  const authoringTriggerEnumBlock =
    authoringSource.match(
      /path: "trigger\.action"[\s\S]*?enumOptions: \[[\s\S]*?\],/
    )?.[0] ?? "";
  const authoringOwnerEnumBlock =
    authoringSource.match(
      /path: "owner\.family"[\s\S]*?enumOptions: \[[\s\S]*?\],/
    )?.[0] ?? "";

  assert.doesNotMatch(uiOwnerBlock, /\{ value: "dialogue", label: "对话" \}/);
  assert.doesNotMatch(uiTriggerBlock, /dialogue-finished/);
  assert.doesNotMatch(authoringOwnerEnumBlock, /\{ value: "dialogue", label: "对话" \}/);
  assert.doesNotMatch(
    authoringTriggerEnumBlock,
    /\{ value: "dialogue-finished", label: "对话结束" \}/
  );
});
