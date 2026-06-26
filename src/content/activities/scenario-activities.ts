import type { ActivityDefinition } from "../../domain/activity";
import { GENERIC_QTE_ACTIVITY_HANDLER_ID } from "../../domain/activity";

export const scenarioActivityDefinitions: ActivityDefinition[] = [
  {
    id: "activity.zhu_yuanzhang.temple.default_chore",
    label: "Temple chore fallback",
    handlerId: "temple.chore",
    fallbackHandlerId: GENERIC_QTE_ACTIVITY_HANDLER_ID,
    timeAdvanceCost: 1,
    qte: {
      totalRounds: 3,
      requiredSuccesses: 2,
    },
    outcome: {
      completedFlagKey: "flag.story.zhu_yuanzhang.default_chore.completed",
      gradeVariableKey: "var.story.zhu_yuanzhang.default_chore.grade",
      scoreVariableKey: "var.story.zhu_yuanzhang.default_chore.score",
      effects: [
        {
          type: "change-variable",
          key: "var.story.zhu_yuanzhang.temple_contribution",
          delta: 3,
        },
      ],
    },
    tags: ["scenario", "fallback", "qte", "temple"],
  },
  {
    id: "activity.qin_shihuang.palace.default_affair",
    label: "Palace affair fallback",
    handlerId: "palace.court-affair",
    fallbackHandlerId: GENERIC_QTE_ACTIVITY_HANDLER_ID,
    timeAdvanceCost: 1,
    qte: {
      totalRounds: 3,
      requiredSuccesses: 2,
    },
    outcome: {
      completedFlagKey: "flag.story.qin_shihuang.default_affair.completed",
      gradeVariableKey: "var.story.qin_shihuang.default_affair.grade",
      scoreVariableKey: "var.story.qin_shihuang.default_affair.score",
    },
    tags: ["scenario", "fallback", "qte", "palace"],
  },
];

export const scenarioActivityDefinitionsById: Record<string, ActivityDefinition> =
  Object.fromEntries(
    scenarioActivityDefinitions.map((activityDefinition) => [
      activityDefinition.id,
      activityDefinition,
    ])
  );
