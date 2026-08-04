const assert = require("node:assert/strict");
const test = require("node:test");

const {
  resolveTempleReviewTaskAssignmentSeed,
  resolveTempleReviewWorkPlanAssignmentSeed,
} = require("../.test-dist/application/house-modules/temple-house/temple-review-assignment-defaults.js");
const {
  ZHU_YUANZHANG_STORY_STAGES,
} = require("../.test-dist/domain/zhu-yuanzhang-story.js");

test("temple review work-plan assignment seed centralizes indoor defaults", () => {
  assert.deepEqual(
    resolveTempleReviewWorkPlanAssignmentSeed({
      workPlan: "temple-help",
      assignmentPhase: "default",
      currentStage: ZHU_YUANZHANG_STORY_STAGES.huangjueTemple,
      currentTempleWeek: 2,
    }),
    {
      reviewCountdownDays: 30,
      activeMissionId: null,
      stage: ZHU_YUANZHANG_STORY_STAGES.huangjueTemple,
      templeWeek: 2,
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
    }
  );
});

test("temple review work-plan assignment seed centralizes third-week beg-alms defaults", () => {
  assert.deepEqual(
    resolveTempleReviewWorkPlanAssignmentSeed({
      workPlan: "beg-alms",
      assignmentPhase: "third-week",
      currentStage: ZHU_YUANZHANG_STORY_STAGES.huangjueTemple,
      currentTempleWeek: 2,
    }),
    {
      reviewCountdownDays: 30,
      activeMissionId: "mission.temple.beg-alms",
      stage: ZHU_YUANZHANG_STORY_STAGES.huangjueBeggingJourney,
      templeWeek: 3,
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
    }
  );
});

test("temple review task assignment seed centralizes countdown and overlay defaults", () => {
  assert.deepEqual(resolveTempleReviewTaskAssignmentSeed(), {
    reviewCountdownDays: 30,
    overlayTitleTextId:
      "runtime.zhu_yuanzhang.temple.review.task_assignment.overlay.title",
    overlaySharedTextId:
      "runtime.zhu_yuanzhang.temple.review.task_assignment.overlay.shared.001",
    orderSummaryTextId:
      "runtime.zhu_yuanzhang.temple.review.task_assignment.order.001",
  });
});

test("temple review work-plan assignment seed prefers scenario-pack house-module defaults when present", () => {
  assert.deepEqual(
    resolveTempleReviewWorkPlanAssignmentSeed(
      {
        workPlan: "beg-alms",
        assignmentPhase: "third-week",
        currentStage: ZHU_YUANZHANG_STORY_STAGES.huangjueTemple,
        currentTempleWeek: 2,
      },
      {
        "temple-house": {
          templeReviewWorkPlanSeeds: {
            "beg-alms-third-week": {
              reviewCountdownDays: 18,
              dialogueTextIds: ["pack.temple.third.001", "pack.temple.third.002"],
              overlayTitleTextId: "pack.temple.third.title",
              overlayBodyTextIds: ["pack.temple.third.body.001", "pack.temple.third.body.002"],
            },
          },
        },
      }
    ),
    {
      reviewCountdownDays: 18,
      activeMissionId: "mission.temple.beg-alms",
      stage: ZHU_YUANZHANG_STORY_STAGES.huangjueBeggingJourney,
      templeWeek: 3,
      dialogueTextIds: ["pack.temple.third.001", "pack.temple.third.002"],
      overlayTitleTextId: "pack.temple.third.title",
      overlayBodyTextIds: ["pack.temple.third.body.001", "pack.temple.third.body.002"],
    }
  );
});

test("temple review task assignment seed prefers scenario-pack house-module defaults when present", () => {
  assert.deepEqual(
    resolveTempleReviewTaskAssignmentSeed({
      "temple-house": {
        templeReviewTaskAssignmentSeed: {
          reviewCountdownDays: 12,
          overlayTitleTextId: "pack.temple.task.title",
          overlaySharedTextId: "pack.temple.task.shared",
          orderSummaryTextId: "pack.temple.task.order",
        },
      },
    }),
    {
      reviewCountdownDays: 12,
      overlayTitleTextId: "pack.temple.task.title",
      overlaySharedTextId: "pack.temple.task.shared",
      orderSummaryTextId: "pack.temple.task.order",
    }
  );
});
