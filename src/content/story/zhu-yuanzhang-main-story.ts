import type { SceneDefinition } from "../../domain/action";
import type { EventDefinition } from "../../domain/event";
import type { StoryArcDefinition, StoryBeatDefinition } from "../../domain/story";
import { createStoryBeatFlagKey } from "../../domain/story";
import {
  ZHU_YUANZHANG_STORY_FLAG_KEYS,
  ZHU_YUANZHANG_STORY_VARIABLE_KEYS,
} from "../../domain/zhu-yuanzhang-story";

const ARC_ID = "zhu-yuanzhang";

export const zhuYuanzhangMainStoryArc: StoryArcDefinition = {
  id: ARC_ID,
  chapterId: "chapter.zhu-yuanzhang-rise",
  title: "朱元璋主线",
  summary:
    "以皇觉寺开场、寺中评定、寺内劳作与化缘解锁为起点的早期主线草案。",
  entryEventId: "event.story.zhu_yuanzhang.ordination",
  stageVariableKey: ZHU_YUANZHANG_STORY_VARIABLE_KEYS.stage,
  defaultStage: "huangjue-temple",
  beatIds: [
    "ordination-and-stay",
    "first-temple-review",
    "earn-trust-in-temple",
  ],
  tags: ["main-story", "temple-opening"],
};

export const zhuYuanzhangMainStoryBeats: StoryBeatDefinition[] = [
  {
    id: "ordination-and-stay",
    arcId: ARC_ID,
    title: "剃度与收留",
    summary:
      "进入皇觉寺后触发剃度桥段，建立朱重八被收留帮工、暂居寺中的起点。",
    eventIds: ["event.story.zhu_yuanzhang.ordination"],
    completionFlagKey: createStoryBeatFlagKey(ARC_ID, "ordination-and-stay"),
    nextBeatId: "first-temple-review",
    tags: ["opening", "fictionalized-bridge"],
  },
  {
    id: "first-temple-review",
    arcId: ARC_ID,
    title: "寺中首轮评定",
    summary:
      "方丈给出维持寺院的方针，第一周只开放寺内帮忙，作为和尚期的系统教学。",
    eventIds: ["event.story.zhu_yuanzhang.first_temple_review"],
    completionFlagKey: createStoryBeatFlagKey(ARC_ID, "first-temple-review"),
    nextBeatId: "earn-trust-in-temple",
    tags: ["teaching", "temple-management"],
  },
  {
    id: "earn-trust-in-temple",
    arcId: ARC_ID,
    title: "积功得准",
    summary:
      "通过寺内帮忙累计贡献值，达到阈值后触发方丈认可剧情并解锁外出化缘。",
    eventIds: ["event.story.zhu_yuanzhang.unlock_begging"],
    completionFlagKey: createStoryBeatFlagKey(ARC_ID, "earn-trust-in-temple"),
    tags: ["loop", "unlock"],
  },
];

export const zhuYuanzhangMainStoryEvents: EventDefinition[] = [
  {
    id: "event.story.zhu_yuanzhang.ordination",
    chapterId: zhuYuanzhangMainStoryArc.chapterId,
    name: "皇觉寺剃度",
    occurrence: "once",
    trigger: {
      timing: "house-enter",
      scope: {
        houseId: "house.kulan.temple",
      },
      priority: 200,
    },
    conditions: [
      {
        type: "flag",
        key: ZHU_YUANZHANG_STORY_FLAG_KEYS.ordinationCompleted,
        expected: false,
      },
    ],
    entrySceneId: "scene.story.zhu_yuanzhang.ordination",
    tags: ["main-story", "temple-opening", "fictionalized-bridge"],
  },
  {
    id: "event.story.zhu_yuanzhang.first_temple_review",
    chapterId: zhuYuanzhangMainStoryArc.chapterId,
    name: "皇觉寺首轮评定",
    occurrence: "once-per-chapter",
    trigger: {
      timing: "manual",
      priority: 190,
    },
    conditions: [
      {
        type: "flag",
        key: ZHU_YUANZHANG_STORY_FLAG_KEYS.ordinationCompleted,
        expected: true,
      },
      {
        type: "flag",
        key: ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleReviewCompleted,
        expected: false,
      },
    ],
    entrySceneId: "scene.story.zhu_yuanzhang.first_temple_review",
    tags: ["main-story", "temple-review"],
  },
  {
    id: "event.story.zhu_yuanzhang.unlock_begging",
    chapterId: zhuYuanzhangMainStoryArc.chapterId,
    name: "方丈准其外出化缘",
    occurrence: "once",
    trigger: {
      timing: "indoor-screen-shown",
      scope: {
        houseId: "house.kulan.temple",
      },
      priority: 170,
    },
    conditions: [
      {
        type: "flag",
        key: ZHU_YUANZHANG_STORY_FLAG_KEYS.templeWorkUnlocked,
        expected: true,
      },
      {
        type: "flag",
        key: ZHU_YUANZHANG_STORY_FLAG_KEYS.beggingUnlocked,
        expected: false,
      },
      {
        type: "variable",
        key: ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeContribution,
        operator: ">=",
        value: 30,
      },
    ],
    entrySceneId: "scene.story.zhu_yuanzhang.unlock_begging",
    tags: ["main-story", "unlock", "temple-loop"],
  },
];

export const zhuYuanzhangMainStoryScenes: SceneDefinition[] = [
  {
    id: "scene.story.zhu_yuanzhang.ordination",
    name: "皇觉寺剃度",
    actions: [
      {
        type: "background",
        backgroundId: "bg.temple.courtyard",
      },
      {
        type: "narration",
        text: "濠州城外荒烟未散，皇觉寺山门前却还留着一线香火。朱重八被领进院中，站在石阶下，听着木鱼声一下一下敲进暮色里。",
      },
      {
        type: "dialogue",
        characterId: "char.kulan_temple_senior_monk",
        side: "left",
        text: "低头些。剃了发，入了门，从今往后便算佛门里的人。",
      },
      {
        type: "narration",
        text: "刀锋贴着头皮走过，断发簌簌落地。待师兄持香轻轻触到朱重八头顶，那一点火星竟倏地熄了。",
      },
      {
        type: "dialogue",
        characterId: "char.kulan_temple_senior_monk",
        side: "left",
        text: "怪了，香才碰到你头顶，竟自己灭了。",
      },
      {
        type: "dialogue",
        characterId: "char.kulan_temple_senior_monk",
        side: "left",
        text: "此人定是孽缘深重，不应久留寺中。",
      },
      {
        type: "dialogue",
        characterId: "char.kulan_temple_senior_monk",
        side: "left",
        text: "若真留下来，寺里本就不多的口粮，怕是又要分出去一份……",
      },
      {
        type: "dialogue",
        characterId: "char.kulan_temple_abbot",
        side: "right",
        text: "乱年逐人出门，也是罪过。罢了，你就先留在寺里帮工，能活一日是一日。",
      },
      {
        type: "effect",
        effects: [
          {
            type: "set-variable",
            key: ZHU_YUANZHANG_STORY_VARIABLE_KEYS.stage,
            value: "huangjue-temple",
          },
          {
            type: "set-variable",
            key: ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeContribution,
            value: 0,
          },
          {
            type: "set-variable",
            key: ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeWeek,
            value: 1,
          },
          {
            type: "set-flag",
            key: ZHU_YUANZHANG_STORY_FLAG_KEYS.ordinationCompleted,
            value: true,
          },
          {
            type: "set-flag",
            key: ZHU_YUANZHANG_STORY_FLAG_KEYS.templeWorkUnlocked,
            value: false,
          },
          {
            type: "set-flag",
            key: ZHU_YUANZHANG_STORY_FLAG_KEYS.beggingUnlocked,
            value: false,
          },
        ],
      },
    ],
  },
  {
    id: "scene.story.zhu_yuanzhang.first_temple_review",
    name: "皇觉寺首轮评定",
    actions: [
      {
        type: "background",
        backgroundId: "bg.temple.hall",
      },
      {
        type: "dialogue",
        characterId: "char.kulan_temple_abbot",
        side: "left",
        text: "往后这段时日，寺里的方针只有一条，先维持住寺院。",
      },
      {
        type: "dialogue",
        characterId: "char.kulan_temple_abbot",
        side: "left",
        text: "你初来乍到，第一周不许乱走，只准在寺内帮忙。",
      },
      {
        type: "effect",
        effects: [
          {
            type: "set-flag",
            key: ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleReviewCompleted,
            value: true,
          },
          {
            type: "set-flag",
            key: ZHU_YUANZHANG_STORY_FLAG_KEYS.templeWorkUnlocked,
            value: true,
          },
        ],
      },
    ],
  },
  {
    id: "scene.story.zhu_yuanzhang.unlock_begging",
    name: "方丈准其外出化缘",
    actions: [
      {
        type: "background",
        backgroundId: "bg.temple.hall",
      },
      {
        type: "dialogue",
        characterId: "char.kulan_temple_abbot",
        side: "left",
        text: "你这一个月来倒算踏实，杂活虽苦，竟也都做下来了。",
      },
      {
        type: "dialogue",
        characterId: "char.kulan_temple_abbot",
        side: "left",
        text: "再下一轮评定，不必只困在院中。准你外出化缘，也替寺里，替自己寻口活路。",
      },
      {
        type: "effect",
        effects: [
          {
            type: "set-variable",
            key: ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeWeek,
            value: 2,
          },
          {
            type: "set-flag",
            key: ZHU_YUANZHANG_STORY_FLAG_KEYS.beggingUnlocked,
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
