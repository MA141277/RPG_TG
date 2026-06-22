import type { FlowDefinition } from "../../domain/activity";
import type { ScenarioProfileDefinition } from "../../domain/scenario-profile";
import {
  ZHU_YUANZHANG_STORY_STAGES,
  ZHU_YUANZHANG_STORY_VARIABLE_KEYS,
} from "../../domain/zhu-yuanzhang-story";

export const scenarioProfiles: ScenarioProfileDefinition[] = [
  {
    id: "scenario.zhu_yuanzhang.monk_opening",
    title: "Zhu Yuanzhang monk opening",
    playerCharacterId: "char.player",
    chapterId: "chapter.zhu-yuanzhang-rise",
    initialLocation: {
      mapId: "map.prototype_frontier",
      cityId: "city.kulan",
      houseId: "house.kulan.temple",
      view: "house",
    },
    initialRuntime: {
      variables: {
        [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.stage]:
          ZHU_YUANZHANG_STORY_STAGES.huangjueTemple,
      },
    },
    entryEventId: "event.story.zhu_yuanzhang.ordination",
    openingFlowId: "flow.zhu_yuanzhang.monk_opening",
    tags: ["built-in", "main-story", "temple"],
  },
  {
    id: "scenario.qin_shihuang.palace_opening",
    title: "Qin Shihuang palace opening",
    playerCharacterId: "char.qin_yingzheng",
    chapterId: "chapter.qin-unification",
    initialLocation: {
      mapId: "map.qin",
      cityId: "city.xianyang",
      houseId: "house.xianyang.palace",
      view: "house",
    },
    entryEventId: "event.story.qin_shihuang.palace_opening",
    openingFlowId: "flow.qin_shihuang.palace_opening",
    tags: ["example", "palace"],
  },
];

export const scenarioFlows: FlowDefinition[] = [
  {
    id: "flow.zhu_yuanzhang.monk_opening",
    ownerScenarioId: "scenario.zhu_yuanzhang.monk_opening",
    slots: [
      {
        slotId: "opening",
        trigger: {
          timing: "game-start",
          houseId: "house.kulan.temple",
        },
        steps: [
          {
            type: "start-event",
            eventId: "event.story.zhu_yuanzhang.ordination",
          },
        ],
      },
      {
        slotId: "default-temple-chore",
        trigger: {
          timing: "manual",
          houseId: "house.kulan.temple",
        },
        steps: [
          {
            type: "start-activity",
            activityId: "activity.zhu_yuanzhang.temple.default_chore",
          },
        ],
      },
    ],
  },
  {
    id: "flow.qin_shihuang.palace_opening",
    ownerScenarioId: "scenario.qin_shihuang.palace_opening",
    slots: [
      {
        slotId: "opening",
        trigger: {
          timing: "game-start",
          houseId: "house.xianyang.palace",
        },
        steps: [
          {
            type: "start-event",
            eventId: "event.story.qin_shihuang.palace_opening",
          },
        ],
      },
      {
        slotId: "default-palace-affair",
        trigger: {
          timing: "manual",
          houseId: "house.xianyang.palace",
        },
        steps: [
          {
            type: "start-activity",
            activityId: "activity.qin_shihuang.palace.default_affair",
          },
        ],
      },
    ],
  },
];
