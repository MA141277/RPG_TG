export type KeepReviewTaskAssignmentSeed = {
  reviewCountdownDays: number;
  orderSummaryTextId: string;
  overlayTitleTextId: string;
  overlayBodyTemplateTextId: string;
  overlaySharedTextId: string;
};

export type KeepReviewExpulsionSeed = {
  reviewCountdownDays: number;
  fallbackMissionText: string;
};

export function resolveKeepReviewTaskAssignmentSeed(): KeepReviewTaskAssignmentSeed {
  return {
    reviewCountdownDays: 60,
    orderSummaryTextId:
      "runtime.zhu_yuanzhang.keep.review.assignment.order.001",
    overlayTitleTextId:
      "runtime.zhu_yuanzhang.keep.review.assignment.overlay.title",
    overlayBodyTemplateTextId:
      "runtime.zhu_yuanzhang.keep.review.assignment.overlay.001",
    overlaySharedTextId:
      "runtime.zhu_yuanzhang.keep.review.assignment.overlay.002",
  };
}

export function resolveKeepReviewExpulsionSeed(): KeepReviewExpulsionSeed {
  return {
    reviewCountdownDays: 60,
    fallbackMissionText: "grain-procurement",
  };
}
