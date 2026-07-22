import type { RuntimeDialogueDefinition } from "../../domain/dialogue";
import type { EventDefinition } from "../../domain/event";
import type { StoryArcDefinition, StoryBeatDefinition } from "../../domain/story";
import { createStoryBeatFlagKey } from "../../domain/story";
import {
  ZHU_YUANZHANG_STORY_FLAG_KEYS,
  ZHU_YUANZHANG_STORY_STAGES,
  ZHU_YUANZHANG_STORY_VARIABLE_KEYS,
} from "../../domain/zhu-yuanzhang-story";

const ARC_ID = "zhu-yuanzhang";

export const zhuYuanzhangMainStoryArc: StoryArcDefinition = {
  id: ARC_ID,
  chapterId: "chapter.zhu-yuanzhang-rise",
  title: "朱元璋主线",
  summary:
    "以皇觉寺开场、寺中评定、寺内劳作、化缘解锁、远途化缘以及卷入郭子兴部为起点的早期主线草案。",
  entryEventId: "event.story.zhu_yuanzhang.ordination",
  stageVariableKey: ZHU_YUANZHANG_STORY_VARIABLE_KEYS.stage,
  defaultStage: "huangjue-temple",
  beatIds: [
    "ordination-and-stay",
    "first-temple-review",
    "earn-trust-in-temple",
    "far-alms-journey",
    "captured-and-enlisted",
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
  {
    id: "far-alms-journey",
    arcId: ARC_ID,
    title: "远途化缘",
    summary:
      "第三周目被方丈定为远途化缘，玩家初到颍州时第一次真正听见汝颍红巾与濠州兵气的风声。",
    eventIds: ["event.story.zhu_yuanzhang.runing_broadcast"],
    completionFlagKey: createStoryBeatFlagKey(ARC_ID, "far-alms-journey"),
    tags: ["loop", "foreshadowing", "city-enter"],
  },
  {
    id: "captured-and-enlisted",
    arcId: ARC_ID,
    title: "归路遇变",
    summary:
      "第四周自外地折返时，朱重八在路上遇盗取胜，入濠州后又被郭子兴部守军疑为谍者，最终被留置左右，自此脱离和尚期。",
    eventIds: ["event.story.zhu_yuanzhang.haozhou_return_encounter"],
    completionFlagKey: createStoryBeatFlagKey(ARC_ID, "captured-and-enlisted"),
    tags: ["battle-hook", "city-enter", "historical-core", "fictionalized-bridge"],
  },
];

export const zhuYuanzhangMainStoryEvents: EventDefinition[] = [
  {
    id: "event.story.zhu_yuanzhang.ordination",
    chapterId: zhuYuanzhangMainStoryArc.chapterId,
    name: "皇觉寺剃度",
    occurrence: "once",
    dialogueId: "scene.story.zhu_yuanzhang.ordination",
    tags: ["main-story", "temple-opening", "fictionalized-bridge"],
  },
  {
    id: "event.story.zhu_yuanzhang.first_temple_review",
    chapterId: zhuYuanzhangMainStoryArc.chapterId,
    name: "皇觉寺首轮评定",
    occurrence: "once-per-chapter",
    dialogueId: "scene.story.zhu_yuanzhang.first_temple_review",
    tags: ["main-story", "temple-review"],
  },
  {
    id: "event.story.zhu_yuanzhang.unlock_begging",
    chapterId: zhuYuanzhangMainStoryArc.chapterId,
    name: "方丈准其外出化缘",
    occurrence: "once",
    dialogueId: "scene.story.zhu_yuanzhang.unlock_begging",
    tags: ["main-story", "unlock", "temple-loop"],
  },
  {
    id: "event.story.zhu_yuanzhang.runing_broadcast",
    chapterId: zhuYuanzhangMainStoryArc.chapterId,
    name: "颍州街头风声",
    occurrence: "once",
    dialogueId: "scene.story.zhu_yuanzhang.runing_broadcast",
    tags: ["main-story", "city-enter", "foreshadowing"],
  },
  {
    id: "event.story.zhu_yuanzhang.haozhou_return_encounter",
    chapterId: zhuYuanzhangMainStoryArc.chapterId,
    name: "归濠州遇盗与入郭",
    occurrence: "once",
    dialogueId: "scene.story.zhu_yuanzhang.haozhou_return_encounter",
    tags: ["main-story", "city-enter", "battle-hook", "join-guo-zixing"],
  },
];

export const zhuYuanzhangMainStoryDialogues: RuntimeDialogueDefinition[] = [
  {
    id: "scene.story.zhu_yuanzhang.ordination",
    name: "皇觉寺剃度",
    nodes: [
      {
        type: "background",
        backgroundId: "bg.temple.courtyard",
      },
      {
        type: "narration",
        textId: "scene.story.zhu_yuanzhang.ordination.001",
      },
      {
        type: "dialogue",
        characterId: "char.kulan_temple_senior_monk",
        side: "left",
        textId: "scene.story.zhu_yuanzhang.ordination.002",
      },
      {
        type: "narration",
        textId: "scene.story.zhu_yuanzhang.ordination.003",
      },
      {
        type: "dialogue",
        characterId: "char.kulan_temple_senior_monk",
        side: "left",
        textId: "scene.story.zhu_yuanzhang.ordination.004",
      },
      {
        type: "dialogue",
        characterId: "char.kulan_temple_senior_monk",
        side: "left",
        textId: "scene.story.zhu_yuanzhang.ordination.005",
      },
      {
        type: "dialogue",
        characterId: "char.kulan_temple_senior_monk",
        side: "left",
        textId: "scene.story.zhu_yuanzhang.ordination.006",
      },
      {
        type: "dialogue",
        characterId: "char.kulan_temple_abbot",
        side: "right",
        textId: "scene.story.zhu_yuanzhang.ordination.007",
      },
      {
        type: "effect",
        effects: [
          {
            type: "patch-character",
            characterId: "char.player",
            changes: {
              title: "挂单僧",
              occupation: "皇觉寺僧人",
              biography:
                "寺中饥荒未歇，你暂在皇觉寺挂单度日，一边听候住持训示，一边思量乱世中的出路。",
              houseId: "house.kulan.temple",
              clanId: null,
              affiliationLabel: null,
            },
          },
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
          {
            type: "set-flag",
            key: ZHU_YUANZHANG_STORY_FLAG_KEYS.beggingTransitionAssigned,
            value: false,
          },
          {
            type: "set-flag",
            key: ZHU_YUANZHANG_STORY_FLAG_KEYS.banditBattleCompleted,
            value: false,
          },
          {
            type: "set-flag",
            key: ZHU_YUANZHANG_STORY_FLAG_KEYS.banditBattleWon,
            value: false,
          },
          {
            type: "set-variable",
            key: ZHU_YUANZHANG_STORY_VARIABLE_KEYS.lastBattleId,
            value: "",
          },
          {
            type: "set-variable",
            key: ZHU_YUANZHANG_STORY_VARIABLE_KEYS.lastBattleResult,
            value: "",
          },
        ],
      },
    ],
  },
  {
    id: "scene.story.zhu_yuanzhang.first_temple_review",
    name: "皇觉寺首轮评定",
    nodes: [
      {
        type: "background",
        backgroundId: "bg.temple.hall",
      },
      {
        type: "dialogue",
        characterId: "char.kulan_temple_abbot",
        side: "left",
        textId: "scene.story.zhu_yuanzhang.first_temple_review.001",
      },
      {
        type: "dialogue",
        characterId: "char.kulan_temple_abbot",
        side: "left",
        textId: "scene.story.zhu_yuanzhang.first_temple_review.002",
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
    nodes: [
      {
        type: "background",
        backgroundId: "bg.temple.hall",
      },
      {
        type: "dialogue",
        characterId: "char.kulan_temple_abbot",
        side: "left",
        textId: "scene.story.zhu_yuanzhang.unlock_begging.001",
      },
      {
        type: "dialogue",
        characterId: "char.kulan_temple_abbot",
        side: "left",
        textId: "scene.story.zhu_yuanzhang.unlock_begging.002",
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
  {
    id: "scene.story.zhu_yuanzhang.runing_broadcast",
    name: "颍州街头风声",
    nodes: [
      {
        type: "narration",
        textId: "scene.story.zhu_yuanzhang.runing_broadcast.001",
      },
      {
        type: "narration",
        textId: "scene.story.zhu_yuanzhang.runing_broadcast.002",
      },
      {
        type: "narration",
        textId: "scene.story.zhu_yuanzhang.runing_broadcast.003",
      },
      {
        type: "narration",
        textId: "scene.story.zhu_yuanzhang.runing_broadcast.004",
      },
    ],
  },
  {
    id: "scene.story.zhu_yuanzhang.haozhou_return_encounter",
    name: "归濠州遇盗与入郭",
    nodes: [
      {
        type: "narration",
        textId: "scene.story.zhu_yuanzhang.haozhou_return_encounter.001",
      },
      {
        type: "callback",
        handlerId: "story.placeholder-battle",
        payload: {
          battleId: "story.zhu_yuanzhang.week4.roadside-bandits",
          result: "victory",
          completedFlagKey:
            ZHU_YUANZHANG_STORY_FLAG_KEYS.banditBattleCompleted,
          winFlagKey: ZHU_YUANZHANG_STORY_FLAG_KEYS.banditBattleWon,
          battleIdVariableKey: ZHU_YUANZHANG_STORY_VARIABLE_KEYS.lastBattleId,
          resultVariableKey:
            ZHU_YUANZHANG_STORY_VARIABLE_KEYS.lastBattleResult,
        },
      },
      {
        type: "narration",
        textId: "scene.story.zhu_yuanzhang.haozhou_return_encounter.002",
      },
      {
        type: "narration",
        textId: "scene.story.zhu_yuanzhang.haozhou_return_encounter.003",
      },
      {
        type: "dialogue",
        characterId: "char.kulan_soldier",
        side: "left",
        textId: "scene.story.zhu_yuanzhang.haozhou_return_encounter.004",
      },
      {
        type: "dialogue",
        characterId: "char.player",
        side: "right",
        textId: "scene.story.zhu_yuanzhang.haozhou_return_encounter.005",
      },
      {
        type: "dialogue",
        characterId: "char.kulan_soldier",
        side: "left",
        textId: "scene.story.zhu_yuanzhang.haozhou_return_encounter.006",
      },
      {
        type: "narration",
        textId: "scene.story.zhu_yuanzhang.haozhou_return_encounter.007",
      },
      {
        type: "dialogue",
        characterId: "char.kulan_lord",
        side: "left",
        textId: "scene.story.zhu_yuanzhang.haozhou_return_encounter.008",
      },
      {
        type: "dialogue",
        characterId: "char.player",
        side: "right",
        textId: "scene.story.zhu_yuanzhang.haozhou_return_encounter.009",
      },
      {
        type: "dialogue",
        characterId: "char.kulan_lord",
        side: "left",
        textId: "scene.story.zhu_yuanzhang.haozhou_return_encounter.010",
      },
      {
        type: "dialogue",
        characterId: "char.kulan_lord",
        side: "left",
        textId: "scene.story.zhu_yuanzhang.haozhou_return_encounter.011",
      },
      {
        type: "callback",
        handlerId: "story.zhu_yuanzhang.join-guo-zixing-camp",
      },
      {
        type: "dialogue",
        characterId: "char.kulan_lord",
        side: "left",
        textId: "scene.story.zhu_yuanzhang.haozhou_return_encounter.012",
      },
      {
        type: "dialogue",
        characterId: "char.player",
        side: "right",
        textId: "scene.story.zhu_yuanzhang.haozhou_return_encounter.013",
      },
      {
        type: "dialogue",
        characterId: "char.kulan_lord",
        side: "left",
        textId: "scene.story.zhu_yuanzhang.haozhou_return_encounter.014",
      },
      {
        type: "callback",
        handlerId: "story.zhu_yuanzhang.start-sundeya-rescue-battle",
        payload: {
          completedFlagKey:
            ZHU_YUANZHANG_STORY_FLAG_KEYS.sundeyaRescueBattleCompleted,
          winFlagKey: ZHU_YUANZHANG_STORY_FLAG_KEYS.sundeyaRescueBattleWon,
          battleIdVariableKey: ZHU_YUANZHANG_STORY_VARIABLE_KEYS.lastBattleId,
          resultVariableKey:
            ZHU_YUANZHANG_STORY_VARIABLE_KEYS.lastBattleResult,
        },
      },
      {
        type: "narration",
        textId: "scene.story.zhu_yuanzhang.haozhou_return_encounter.015",
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

export const zhuYuanzhangMainStoryDialoguesById: Record<
  string,
  RuntimeDialogueDefinition
> =
  Object.fromEntries(
    zhuYuanzhangMainStoryDialogues.map((sceneDefinition) => [
      sceneDefinition.id,
      sceneDefinition,
    ])
  );
