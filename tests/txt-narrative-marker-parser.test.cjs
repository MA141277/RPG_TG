const test = require("node:test");
const assert = require("node:assert/strict");

function loadParser() {
  return require("../.test-dist/application/txt-narrative/txt-narrative-marker-parser.js");
}

test("TXT narrative marker parser converts reserved marker text into typed narrative steps", () => {
  const { parseTxtNarrativeMarkerScript } = loadParser();

  const steps = parseTxtNarrativeMarkerScript(`
[NARRATION: 山门前尽是饥民与尘土。]
[DIALOGUE: char.kulan_temple_abbot,皇觉寺住持,"寺里已经养不起这么多人了。"]
[SET_FLAG: story.zhu.opening.in_temple]
[CHOICE: 你如何回应？]
[OPTION: option.accept_alms|应下化缘|应下化缘|mainline|true]
[OPTION: option.ask_where|询问该往何处去|询问该往何处去|recommended|true]
[END_CHOICE]
[SCENE_CHANGE: scene.temple_gate|皇觉寺山门外]
`);

  assert.deepEqual(steps, [
    {
      type: "narration",
      text: "山门前尽是饥民与尘土。",
    },
    {
      type: "dialogue",
      speakerId: "char.kulan_temple_abbot",
      speakerName: "皇觉寺住持",
      text: "寺里已经养不起这么多人了。",
    },
    {
      type: "flag",
      op: "set",
      key: "story.zhu.opening.in_temple",
    },
    {
      type: "choice",
      prompt: "你如何回应？",
      options: [
        {
          id: "option.accept_alms",
          label: "应下化缘",
          actionText: "应下化缘",
          kind: "mainline",
          recommended: true,
        },
        {
          id: "option.ask_where",
          label: "询问该往何处去",
          actionText: "询问该往何处去",
          kind: "recommended",
          recommended: true,
        },
      ],
    },
    {
      type: "scene_change",
      sceneId: "scene.temple_gate",
      placeName: "皇觉寺山门外",
    },
  ]);
});

test("TXT narrative marker parser degrades malformed dialogue markers into narration instead of guessing a speaker", () => {
  const { parseTxtNarrativeMarkerScript } = loadParser();

  const steps = parseTxtNarrativeMarkerScript(`
[DIALOGUE: ,,"寺里快要断粮了。"]
`);

  assert.deepEqual(steps, [
    {
      type: "narration",
      text: "寺里快要断粮了。",
    },
  ]);
});

test("TXT narrative marker parser accepts bare narration and choice block markers used by the live NPC AI prompt", () => {
  const { parseTxtNarrativeMarkerScript } = loadParser();

  const steps = parseTxtNarrativeMarkerScript(`
[NARRATION]
茶馆内茶香四溢，茶博士正忙着擦拭茶具。
[DIALOGUE: tea_master,茶博士,"这位客官，快请坐！小店新到的龙井，要不要尝尝？"]
[CHOICE]
[OPTION: 1|热情回应|好啊！正好口渴了，来壶好茶！|benevolent|true]
[OPTION: 2|礼貌询问|这龙井什么价钱？|neutral|false]
[OPTION: 3|冷言拒绝|哼，我朱重八喝不起你们这些富贵茶！|hostile|false]
[END_CHOICE]
`);

  assert.deepEqual(steps, [
    {
      type: "narration",
      text: "茶馆内茶香四溢，茶博士正忙着擦拭茶具。",
    },
    {
      type: "dialogue",
      speakerId: "tea_master",
      speakerName: "茶博士",
      text: "这位客官，快请坐！小店新到的龙井，要不要尝尝？",
    },
    {
      type: "choice",
      prompt: "你想怎么接话？",
      options: [
        {
          id: "1",
          label: "热情回应",
          actionText: "好啊！正好口渴了，来壶好茶！",
          kind: "benevolent",
          recommended: true,
        },
        {
          id: "2",
          label: "礼貌询问",
          actionText: "这龙井什么价钱？",
          kind: "neutral",
          recommended: false,
        },
        {
          id: "3",
          label: "冷言拒绝",
          actionText: "哼，我朱重八喝不起你们这些富贵茶！",
          kind: "hostile",
          recommended: false,
        },
      ],
    },
  ]);
});

test("TXT narrative marker parser strips inline bare narration markers instead of leaking them into displayed text", () => {
  const { parseTxtNarrativeMarkerScript } = loadParser();

  const steps = parseTxtNarrativeMarkerScript(`
[NARRATION] 茶博士先把手里的茶盏放下，朝你看了一眼。
[DIALOGUE: tea_master,茶博士,"客官今日想先问哪一头？"]
`);

  assert.deepEqual(steps, [
    {
      type: "narration",
      text: "茶博士先把手里的茶盏放下，朝你看了一眼。",
    },
    {
      type: "dialogue",
      speakerId: "tea_master",
      speakerName: "茶博士",
      text: "客官今日想先问哪一头？",
    },
  ]);
});

test("TXT narrative marker parser treats bare pipe-delimited choice lines as structured options inside a choice block", () => {
  const { parseTxtNarrativeMarkerScript } = loadParser();

  const steps = parseTxtNarrativeMarkerScript(`
[CHOICE]
1|随便看看|随便看看|neutral
2|问问近况|问问近况|benevolent
3|直接离开|直接离开|hostile
[END_CHOICE]
`);

  assert.deepEqual(steps, [
    {
      type: "choice",
      prompt: "你想怎么接话？",
      options: [
        {
          id: "1",
          label: "随便看看",
          actionText: "随便看看",
          kind: "neutral",
        },
        {
          id: "2",
          label: "问问近况",
          actionText: "问问近况",
          kind: "benevolent",
        },
        {
          id: "3",
          label: "直接离开",
          actionText: "直接离开",
          kind: "hostile",
        },
      ],
    },
  ]);
});
