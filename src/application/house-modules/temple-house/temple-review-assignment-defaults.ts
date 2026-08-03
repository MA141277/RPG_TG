import {
  ZHU_YUANZHANG_STORY_STAGES,
  type ZhuYuanzhangStoryStage,
} from "../../../domain/zhu-yuanzhang-story";

export type TempleReviewAssignmentPhase =
  | "default"
  | "third-week"
  | "fourth-week";

export type TempleReviewWorkPlanAssignmentSeed = {
  reviewCountdownDays: number;
  activeMissionId: string | null;
  stage: ZhuYuanzhangStoryStage;
  templeWeek: number;
  dialogueTextIds: [string, string];
  overlayTitleTextId: string;
  overlayBodyTextIds: [string, string];
};

export type TempleReviewTaskAssignmentSeed = {
  reviewCountdownDays: number;
  overlayTitleTextId: string;
  overlaySharedTextId: string;
  orderSummaryTextId: string;
};

type HouseModuleDefaultsRecord = Record<string, unknown>;

type TempleReviewWorkPlanSeedDefaults = {
  reviewCountdownDays: number;
  dialogueTextIds: [string, string];
  overlayTitleTextId: string;
  overlayBodyTextIds: [string, string];
};

type TempleReviewTaskAssignmentSeedDefaults = {
  reviewCountdownDays: number;
  overlayTitleTextId: string;
  overlaySharedTextId: string;
  orderSummaryTextId: string;
};

const TEMPLE_REVIEW_WORK_PLAN_DEFAULTS: Record<
  "temple-help" | "beg-alms-default" | "beg-alms-third-week" | "beg-alms-fourth-week",
  TempleReviewWorkPlanSeedDefaults
> = {
  "temple-help": {
    reviewCountdownDays: 30,
    dialogueTextIds: [
      "runtime.zhu_yuanzhang.temple.review.assignment.indoor.001",
      "runtime.zhu_yuanzhang.temple.review.assignment.indoor.002",
    ],
    overlayTitleTextId:
      "runtime.zhu_yuanzhang.temple.review.assignment.overlay.title",
    overlayBodyTextIds: [
      "runtime.zhu_yuanzhang.temple.review.assignment.overlay.indoor.001",
      "runtime.zhu_yuanzhang.temple.review.assignment.overlay.shared.001",
    ],
  },
  "beg-alms-default": {
    reviewCountdownDays: 30,
    dialogueTextIds: [
      "runtime.zhu_yuanzhang.temple.review.assignment.beg_alms.default.001",
      "runtime.zhu_yuanzhang.temple.review.assignment.beg_alms.default.002",
    ],
    overlayTitleTextId:
      "runtime.zhu_yuanzhang.temple.review.assignment.overlay.title",
    overlayBodyTextIds: [
      "runtime.zhu_yuanzhang.temple.review.assignment.overlay.beg_alms.default.001",
      "runtime.zhu_yuanzhang.temple.review.assignment.overlay.shared.001",
    ],
  },
  "beg-alms-third-week": {
    reviewCountdownDays: 30,
    dialogueTextIds: [
      "runtime.zhu_yuanzhang.temple.review.assignment.beg_alms.third_week.001",
      "runtime.zhu_yuanzhang.temple.review.assignment.beg_alms.third_week.002",
    ],
    overlayTitleTextId:
      "runtime.zhu_yuanzhang.temple.review.assignment.overlay.title",
    overlayBodyTextIds: [
      "runtime.zhu_yuanzhang.temple.review.assignment.overlay.beg_alms.third_week.001",
      "runtime.zhu_yuanzhang.temple.review.assignment.overlay.shared.001",
    ],
  },
  "beg-alms-fourth-week": {
    reviewCountdownDays: 30,
    dialogueTextIds: [
      "runtime.zhu_yuanzhang.temple.review.assignment.beg_alms.fourth_week.001",
      "runtime.zhu_yuanzhang.temple.review.assignment.beg_alms.fourth_week.002",
    ],
    overlayTitleTextId:
      "runtime.zhu_yuanzhang.temple.review.assignment.overlay.title",
    overlayBodyTextIds: [
      "runtime.zhu_yuanzhang.temple.review.assignment.overlay.beg_alms.fourth_week.001",
      "runtime.zhu_yuanzhang.temple.review.assignment.overlay.shared.001",
    ],
  },
};

const TEMPLE_REVIEW_TASK_ASSIGNMENT_DEFAULTS: TempleReviewTaskAssignmentSeedDefaults = {
  reviewCountdownDays: 30,
  overlayTitleTextId:
    "runtime.zhu_yuanzhang.temple.review.task_assignment.overlay.title",
  overlaySharedTextId:
    "runtime.zhu_yuanzhang.temple.review.task_assignment.overlay.shared.001",
  orderSummaryTextId:
    "runtime.zhu_yuanzhang.temple.review.task_assignment.order.001",
};

export function resolveTempleReviewWorkPlanAssignmentSeed(input: {
  workPlan: "temple-help" | "beg-alms";
  assignmentPhase: TempleReviewAssignmentPhase;
  currentStage: ZhuYuanzhangStoryStage;
  currentTempleWeek: number;
}, houseModuleDefaults?: HouseModuleDefaultsRecord): TempleReviewWorkPlanAssignmentSeed {
  if (input.workPlan === "temple-help") {
    const defaults = resolveTempleReviewWorkPlanSeedDefaults(
      "temple-help",
      houseModuleDefaults
    );
    return {
      reviewCountdownDays: defaults.reviewCountdownDays,
      activeMissionId: null,
      stage: input.currentStage,
      templeWeek: input.currentTempleWeek,
      dialogueTextIds: defaults.dialogueTextIds,
      overlayTitleTextId: defaults.overlayTitleTextId,
      overlayBodyTextIds: defaults.overlayBodyTextIds,
    };
  }

  if (input.assignmentPhase === "third-week") {
    const defaults = resolveTempleReviewWorkPlanSeedDefaults(
      "beg-alms-third-week",
      houseModuleDefaults
    );
    return {
      reviewCountdownDays: defaults.reviewCountdownDays,
      activeMissionId: "mission.temple.beg-alms",
      stage: ZHU_YUANZHANG_STORY_STAGES.huangjueBeggingJourney,
      templeWeek: 3,
      dialogueTextIds: defaults.dialogueTextIds,
      overlayTitleTextId: defaults.overlayTitleTextId,
      overlayBodyTextIds: defaults.overlayBodyTextIds,
    };
  }

  if (input.assignmentPhase === "fourth-week") {
    const defaults = resolveTempleReviewWorkPlanSeedDefaults(
      "beg-alms-fourth-week",
      houseModuleDefaults
    );
    return {
      reviewCountdownDays: defaults.reviewCountdownDays,
      activeMissionId: "mission.temple.beg-alms",
      stage: input.currentStage,
      templeWeek: 4,
      dialogueTextIds: defaults.dialogueTextIds,
      overlayTitleTextId: defaults.overlayTitleTextId,
      overlayBodyTextIds: defaults.overlayBodyTextIds,
    };
  }

  const defaults = resolveTempleReviewWorkPlanSeedDefaults(
    "beg-alms-default",
    houseModuleDefaults
  );
  return {
    reviewCountdownDays: defaults.reviewCountdownDays,
    activeMissionId: "mission.temple.beg-alms",
    stage: input.currentStage,
    templeWeek: input.currentTempleWeek,
    dialogueTextIds: defaults.dialogueTextIds,
    overlayTitleTextId: defaults.overlayTitleTextId,
    overlayBodyTextIds: defaults.overlayBodyTextIds,
  };
}

export function resolveTempleReviewTaskAssignmentSeed(
  houseModuleDefaults?: HouseModuleDefaultsRecord
): TempleReviewTaskAssignmentSeed {
  const defaults = resolveTempleReviewTaskAssignmentSeedDefaults(
    houseModuleDefaults
  );
  return { ...defaults };
}

function resolveTempleReviewWorkPlanSeedDefaults(
  seedId: keyof typeof TEMPLE_REVIEW_WORK_PLAN_DEFAULTS,
  houseModuleDefaults?: HouseModuleDefaultsRecord
): TempleReviewWorkPlanSeedDefaults {
  const fallback = TEMPLE_REVIEW_WORK_PLAN_DEFAULTS[seedId];
  const candidate = readTempleReviewWorkPlanSeedOverride(
    houseModuleDefaults,
    seedId
  );
  if (candidate == null) {
    return fallback;
  }

  return {
    reviewCountdownDays:
      typeof candidate.reviewCountdownDays === "number"
        ? candidate.reviewCountdownDays
        : fallback.reviewCountdownDays,
    dialogueTextIds:
      readStringPair(candidate.dialogueTextIds) ?? fallback.dialogueTextIds,
    overlayTitleTextId:
      typeof candidate.overlayTitleTextId === "string"
        ? candidate.overlayTitleTextId
        : fallback.overlayTitleTextId,
    overlayBodyTextIds:
      readStringPair(candidate.overlayBodyTextIds) ?? fallback.overlayBodyTextIds,
  };
}

function resolveTempleReviewTaskAssignmentSeedDefaults(
  houseModuleDefaults?: HouseModuleDefaultsRecord
): TempleReviewTaskAssignmentSeedDefaults {
  const candidate = readTempleReviewTaskAssignmentSeedOverride(
    houseModuleDefaults
  );
  if (candidate == null) {
    return TEMPLE_REVIEW_TASK_ASSIGNMENT_DEFAULTS;
  }

  return {
    reviewCountdownDays:
      typeof candidate.reviewCountdownDays === "number"
        ? candidate.reviewCountdownDays
        : TEMPLE_REVIEW_TASK_ASSIGNMENT_DEFAULTS.reviewCountdownDays,
    overlayTitleTextId:
      typeof candidate.overlayTitleTextId === "string"
        ? candidate.overlayTitleTextId
        : TEMPLE_REVIEW_TASK_ASSIGNMENT_DEFAULTS.overlayTitleTextId,
    overlaySharedTextId:
      typeof candidate.overlaySharedTextId === "string"
        ? candidate.overlaySharedTextId
        : TEMPLE_REVIEW_TASK_ASSIGNMENT_DEFAULTS.overlaySharedTextId,
    orderSummaryTextId:
      typeof candidate.orderSummaryTextId === "string"
        ? candidate.orderSummaryTextId
        : TEMPLE_REVIEW_TASK_ASSIGNMENT_DEFAULTS.orderSummaryTextId,
  };
}

function readTempleReviewWorkPlanSeedOverride(
  houseModuleDefaults: HouseModuleDefaultsRecord | undefined,
  seedId: keyof typeof TEMPLE_REVIEW_WORK_PLAN_DEFAULTS
): Record<string, unknown> | null {
  const templeDefaults = readTempleHouseDefaults(houseModuleDefaults);
  const seedMap = readObjectRecord(templeDefaults?.templeReviewWorkPlanSeeds);
  return readObjectRecord(seedMap?.[seedId]);
}

function readTempleReviewTaskAssignmentSeedOverride(
  houseModuleDefaults: HouseModuleDefaultsRecord | undefined
): Record<string, unknown> | null {
  return readObjectRecord(
    readTempleHouseDefaults(houseModuleDefaults)?.templeReviewTaskAssignmentSeed
  );
}

function readTempleHouseDefaults(
  houseModuleDefaults?: HouseModuleDefaultsRecord
): Record<string, unknown> | null {
  return readObjectRecord(houseModuleDefaults?.["temple-house"]);
}

function readObjectRecord(value: unknown): Record<string, unknown> | null {
  if (value == null || Array.isArray(value) || typeof value !== "object") {
    return null;
  }

  return value as Record<string, unknown>;
}

function readStringPair(value: unknown): [string, string] | null {
  if (!Array.isArray(value) || value.length !== 2) {
    return null;
  }
  if (!value.every((entry) => typeof entry === "string")) {
    return null;
  }

  const [first, second] = value;
  return [first as string, second as string];
}
