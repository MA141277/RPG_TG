import type { SceneDefinition } from "../../domain/action";
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
  {
    id: "event.story.zhu_yuanzhang.runing_broadcast",
    chapterId: zhuYuanzhangMainStoryArc.chapterId,
    name: "颍州街头风声",
    occurrence: "once",
    trigger: {
      timing: "city-enter",
      scope: {
        cityId: "city.runing",
      },
      priority: 160,
    },
    conditions: [
      {
        type: "flag",
        key: ZHU_YUANZHANG_STORY_FLAG_KEYS.beggingUnlocked,
        expected: true,
      },
      {
        type: "variable",
        key: ZHU_YUANZHANG_STORY_VARIABLE_KEYS.stage,
        operator: "==",
        value: ZHU_YUANZHANG_STORY_STAGES.huangjueBeggingJourney,
      },
    ],
    entrySceneId: "scene.story.zhu_yuanzhang.runing_broadcast",
    tags: ["main-story", "city-enter", "foreshadowing"],
  },
  {
    id: "event.story.zhu_yuanzhang.haozhou_return_encounter",
    chapterId: zhuYuanzhangMainStoryArc.chapterId,
    name: "归濠州遇盗与入郭",
    occurrence: "once",
    trigger: {
      timing: "city-enter",
      scope: {
        cityId: "city.kulan",
      },
      priority: 155,
    },
    conditions: [
      {
        type: "variable",
        key: ZHU_YUANZHANG_STORY_VARIABLE_KEYS.stage,
        operator: "==",
        value: ZHU_YUANZHANG_STORY_STAGES.huangjueBeggingJourney,
      },
      {
        type: "variable",
        key: ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeWeek,
        operator: "==",
        value: 4,
      },
    ],
    entrySceneId: "scene.story.zhu_yuanzhang.haozhou_return_encounter",
    tags: ["main-story", "city-enter", "battle-hook", "join-guo-zixing"],
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
  {
    id: "scene.story.zhu_yuanzhang.runing_broadcast",
    name: "颍州街头风声",
    actions: [
      {
        type: "narration",
        text: "你背着旧布袋踏进颍州城门，只见街上行人挤得发闷，粮铺门前和施粥棚下都排着长队，叫卖声、哭喊声、议论声混成一片。",
      },
      {
        type: "narration",
        text: "有人在街口高声招呼，说汝颍之间近来聚众愈多，红巾号子一传十、十传百；也有人低声提起韩林儿的名字，说北路还有施粮活民的地方。",
      },
      {
        type: "narration",
        text: "茶棚边又有商旅压低嗓子议论：濠州近来也起了兵气，郭子兴已经聚起一股人马，城门盘查只会越来越紧。",
      },
      {
        type: "narration",
        text: "你把这些风声都听进耳里，却没忘住持交代的本分。此行先求粮，先把能带回寺里的活路背稳。",
      },
    ],
  },
  {
    id: "scene.story.zhu_yuanzhang.haozhou_return_encounter",
    name: "归濠州遇盗与入郭",
    actions: [
      {
        type: "narration",
        text: "你自外路折返，布袋里压着几把零碎米粮。离濠州尚有一程时，路旁枯林里忽然窜出数名持棍短刃的盗伙，见你背袋鼓起，便喝骂着扑了上来。",
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
        text: "你贴着土路边石连退两步，趁那带头贼扑空的当口夺棍回扫，几下便把人打散。余众见势不对，骂了两句，拖着伤者钻回荒草深处。",
      },
      {
        type: "narration",
        text: "再往前走，城门方向已尽是红巾号衣与临时木栅。濠州显然已不是你离寺前的濠州，巡哨比商旅还多，问路的人个个先看你包里背的是什么。",
      },
      {
        type: "dialogue",
        characterId: "char.kulan_soldier",
        side: "left",
        text: "站住。你这和尚是从哪一路回来的？北边口音杂、行装也杂，莫不是替人探路的？",
      },
      {
        type: "dialogue",
        characterId: "char.player",
        side: "right",
        text: "我自外路化缘回来，只想入城换口热汤，再寻处歇脚。袋里不过几把米，没替谁探什么路。",
      },
      {
        type: "dialogue",
        characterId: "char.kulan_soldier",
        side: "left",
        text: "外路才乱成这样，你一个挂单僧偏能从那边全身回来，还带着粮？先押去见元帅，是真是假，自有人断。",
      },
      {
        type: "narration",
        text: "几名军卒把你连人带袋押进营前。帐下火光映得兵器发白，众人七嘴八舌，都说北路近来探子最多，这和尚来得太巧，宁可信其有，不可信其无。",
      },
      {
        type: "dialogue",
        characterId: "char.kulan_lord",
        side: "left",
        text: "你自哪来？门下军士说你像个谍子。可我看你一路风尘未定，倒不像专替元军递话的人。",
      },
      {
        type: "dialogue",
        characterId: "char.player",
        side: "right",
        text: "我是钟离人，早年在皇觉寺挂单。如今世道逼人，只得四处化缘求活。若真是谍子，先前路上也不必为几把米和盗伙拼命。",
      },
      {
        type: "dialogue",
        characterId: "char.kulan_lord",
        side: "left",
        text: "门者疑你为谍，本也不算无由。可你人既敢回濠州，话又说得直，倒像个肯担事的。",
      },
      {
        type: "dialogue",
        characterId: "char.kulan_lord",
        side: "left",
        text: "这样罢，先不放你走，也不杀你。把人留在我左右，从亲兵和粮道杂务做起。若真有别心，迟早露出来；若没有，便算我帐下多一个能用的人。",
      },
      {
        type: "callback",
        handlerId: "story.zhu_yuanzhang.join-guo-zixing-camp",
      },
      {
        type: "narration",
        text: "你低头应下，心里却明白，自此再不能只把自己当作寺中挂单的和尚。濠州兵气扑面而来，你已被卷进郭子兴军中，再退不得了。",
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
