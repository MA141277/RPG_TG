import type { SceneDefinition } from "../../domain/action";
import type { EventDefinition } from "../../domain/event";
import type { StoryArcDefinition, StoryBeatDefinition } from "../../domain/story";
import {
  createStoryBeatFlagKey,
  createStoryStageVariableKey,
} from "../../domain/story";
import {
  ZHU_YUANZHANG_STORY_STAGES,
  ZHU_YUANZHANG_STORY_VARIABLE_KEYS,
} from "../../domain/zhu-yuanzhang-story";

const ARC_ID = "zhu-yuanzhang";

export const zhuYuanzhangMainStoryArc: StoryArcDefinition = {
  id: ARC_ID,
  chapterId: "chapter.zhu-yuanzhang-rise",
  title: "朱元璋主线",
  summary: "以阶段变量和事件链驱动的主线索引样例。",
  entryEventId: "event.story.zhu_yuanzhang.temple_departure",
  stageVariableKey: ZHU_YUANZHANG_STORY_VARIABLE_KEYS.stage,
  defaultStage: ZHU_YUANZHANG_STORY_STAGES.huangjueTemple,
  beatIds: ["temple-departure", "join-guo-zixing"],
  tags: ["main-story", "template"],
};

export const zhuYuanzhangMainStoryBeats: StoryBeatDefinition[] = [
  {
    id: "temple-departure",
    arcId: ARC_ID,
    title: "离寺下山",
    summary: "用一次入寺剧情交代转折，并把阶段推进到投奔郭子兴前。",
    eventIds: ["event.story.zhu_yuanzhang.temple_departure"],
    completionFlagKey: createStoryBeatFlagKey(ARC_ID, "temple-departure"),
    nextBeatId: "join-guo-zixing",
    tags: ["opening"],
  },
  {
    id: "join-guo-zixing",
    arcId: ARC_ID,
    title: "投奔郭子兴",
    summary: "在指定城池触发会面，把阶段推进到郭子兴军中。",
    eventIds: ["event.story.zhu_yuanzhang.join_guo_zixing"],
    completionFlagKey: createStoryBeatFlagKey(ARC_ID, "join-guo-zixing"),
    tags: ["camp"],
  },
];

export const zhuYuanzhangMainStoryEvents: EventDefinition[] = [
  {
    id: "event.story.zhu_yuanzhang.temple_departure",
    chapterId: zhuYuanzhangMainStoryArc.chapterId,
    name: "离寺下山",
    occurrence: "once",
    trigger: {
      timing: "house-enter",
      scope: {
        houseId: "house.huangjue.temple",
      },
      priority: 200,
    },
    conditions: [
      {
        type: "variable",
        key: ZHU_YUANZHANG_STORY_VARIABLE_KEYS.stage,
        operator: "==",
        value: ZHU_YUANZHANG_STORY_STAGES.huangjueTemple,
      },
      {
        type: "flag",
        key: createStoryBeatFlagKey(ARC_ID, "temple-departure"),
        expected: false,
      },
    ],
    entrySceneId: "scene.story.zhu_yuanzhang.temple_departure",
    tags: ["main-story", "opening"],
  },
  {
    id: "event.story.zhu_yuanzhang.join_guo_zixing",
    chapterId: zhuYuanzhangMainStoryArc.chapterId,
    name: "投奔郭子兴",
    occurrence: "once",
    trigger: {
      timing: "city-enter",
      scope: {
        cityId: "city.haozhou",
      },
      priority: 180,
    },
    conditions: [
      {
        type: "variable",
        key: ZHU_YUANZHANG_STORY_VARIABLE_KEYS.stage,
        operator: "==",
        value: "seeking-guo-zixing",
      },
      {
        type: "flag",
        key: createStoryBeatFlagKey(ARC_ID, "join-guo-zixing"),
        expected: false,
      },
    ],
    entrySceneId: "scene.story.zhu_yuanzhang.join_guo_zixing",
    tags: ["main-story", "camp"],
  },
];

export const zhuYuanzhangMainStoryScenes: SceneDefinition[] = [
  {
    id: "scene.story.zhu_yuanzhang.temple_departure",
    name: "离寺下山",
    actions: [
      {
        type: "background",
        backgroundId: "bg.temple.courtyard",
      },
      {
        type: "dialogue",
        characterId: "char.temple.abbot",
        side: "left",
        text: "世道乱了，留在寺里也保不住你。下山去吧。",
      },
      {
        type: "effect",
        effects: [
          {
            type: "set-variable",
            key: createStoryStageVariableKey(ARC_ID),
            value: "seeking-guo-zixing",
          },
          {
            type: "set-flag",
            key: createStoryBeatFlagKey(ARC_ID, "temple-departure"),
            value: true,
          },
        ],
      },
    ],
  },
  {
    id: "scene.story.zhu_yuanzhang.join_guo_zixing",
    name: "投奔郭子兴",
    actions: [
      {
        type: "background",
        backgroundId: "bg.haozhou.camp",
      },
      {
        type: "dialogue",
        characterId: "char.guo_zixing",
        side: "left",
        text: "你既敢来投军，总得让我看看你能担什么事。",
      },
      {
        type: "effect",
        effects: [
          {
            type: "set-variable",
            key: createStoryStageVariableKey(ARC_ID),
            value: ZHU_YUANZHANG_STORY_STAGES.guoZixingCamp,
          },
          {
            type: "set-flag",
            key: createStoryBeatFlagKey(ARC_ID, "join-guo-zixing"),
            value: true,
          },
        ],
      },
    ],
  },
];

export const zhuYuanzhangMainStoryEventsById: Record<string, EventDefinition> =
  Object.fromEntries(
    zhuYuanzhangMainStoryEvents.map((eventDefinition) => [
      eventDefinition.id,
      eventDefinition,
    ])
  );

export const zhuYuanzhangMainStoryScenesById: Record<string, SceneDefinition> =
  Object.fromEntries(
    zhuYuanzhangMainStoryScenes.map((sceneDefinition) => [
      sceneDefinition.id,
      sceneDefinition,
    ])
  );
