const assert = require("node:assert/strict");
const test = require("node:test");

const {
  resolveKeepReviewExpulsionSeed,
  resolveKeepReviewTaskAssignmentSeed,
} = require("../.test-dist/application/house-modules/keep-house/keep-review-assignment-defaults.js");

test("keep review task assignment seed centralizes countdown and overlay defaults", () => {
  assert.deepEqual(resolveKeepReviewTaskAssignmentSeed(), {
    reviewCountdownDays: 60,
    orderSummaryTextId:
      "runtime.zhu_yuanzhang.keep.review.assignment.order.001",
    overlayTitleTextId:
      "runtime.zhu_yuanzhang.keep.review.assignment.overlay.title",
    overlayBodyTemplateTextId:
      "runtime.zhu_yuanzhang.keep.review.assignment.overlay.001",
    overlaySharedTextId:
      "runtime.zhu_yuanzhang.keep.review.assignment.overlay.002",
  });
});

test("keep review expulsion seed centralizes reset countdown and fallback mission", () => {
  assert.deepEqual(resolveKeepReviewExpulsionSeed(), {
    reviewCountdownDays: 60,
    fallbackMissionText: "grain-procurement",
  });
});
