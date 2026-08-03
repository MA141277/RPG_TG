const assert = require("node:assert/strict");
const test = require("node:test");

const {
  resolveTempleStaticTextDefaults,
} = require("../.test-dist/application/house-modules/temple-house/temple-house-static-defaults.js");

test("temple static text defaults centralize builtin fallback text ids", () => {
  assert.deepEqual(resolveTempleStaticTextDefaults(), {
    greetingTextIds: [
      "runtime.zhu_yuanzhang.temple.greeting.001",
      "runtime.zhu_yuanzhang.temple.greeting.002",
    ],
    openTextIds: [
      "runtime.zhu_yuanzhang.temple.open.001",
      "runtime.zhu_yuanzhang.temple.open.002",
    ],
    restMenuTextIds: [
      "runtime.zhu_yuanzhang.temple.rest_menu.001",
      "runtime.zhu_yuanzhang.temple.rest_menu.002",
    ],
    meetingIntroTextIds: [
      "runtime.zhu_yuanzhang.temple.review.intro.001",
      "runtime.zhu_yuanzhang.temple.review.intro.002",
    ],
    leaveRefusalTextIds: [
      "runtime.zhu_yuanzhang.temple.leave_refusal.001",
    ],
    workPlanTextIds: {
      templeHelp: "runtime.zhu_yuanzhang.temple.work_plan.temple_help.label",
      begAlmsDefault: "runtime.zhu_yuanzhang.temple.work_plan.beg_alms.default.label",
      begAlmsLocked: "runtime.zhu_yuanzhang.temple.work_plan.beg_alms.locked.label",
      begAlmsThirdWeek: "runtime.zhu_yuanzhang.temple.work_plan.beg_alms.third_week.label",
      begAlmsFourthWeek: "runtime.zhu_yuanzhang.temple.work_plan.beg_alms.fourth_week.label",
    },
    donationTextIds: {
      confirmTitle: "runtime.zhu_yuanzhang.temple.donation.confirm.title",
      confirmBodyTemplate: "runtime.zhu_yuanzhang.temple.donation.confirm.001",
      confirmBodyFollowup: "runtime.zhu_yuanzhang.temple.donation.confirm.002",
      insufficientTitle: "runtime.zhu_yuanzhang.temple.donation.insufficient.title",
      insufficientBodyTemplate:
        "runtime.zhu_yuanzhang.temple.donation.insufficient.001",
      insufficientBodyFollowup:
        "runtime.zhu_yuanzhang.temple.donation.insufficient.002",
      resultTitle: "runtime.zhu_yuanzhang.temple.donation.result.title",
      resultFameTemplate: "runtime.zhu_yuanzhang.temple.donation.result.fame.001",
      resultFameFollowup: "runtime.zhu_yuanzhang.temple.donation.result.fame.002",
      resultNormalTemplate:
        "runtime.zhu_yuanzhang.temple.donation.result.normal.001",
      resultNormalFollowup:
        "runtime.zhu_yuanzhang.temple.donation.result.normal.002",
    },
    reviewAssignmentTextIds: {
      thirdWeek: [
        "runtime.zhu_yuanzhang.temple.review.assign.third_week.001",
        "runtime.zhu_yuanzhang.temple.review.assign.third_week.002",
        "runtime.zhu_yuanzhang.temple.review.assign.third_week.003",
      ],
      fourthWeek: [
        "runtime.zhu_yuanzhang.temple.review.assign.fourth_week.001",
        "runtime.zhu_yuanzhang.temple.review.assign.fourth_week.002",
        "runtime.zhu_yuanzhang.temple.review.assign.fourth_week.003",
      ],
      defaultIntro: "runtime.zhu_yuanzhang.temple.review.assign.default.001",
      defaultAvailableTemplate:
        "runtime.zhu_yuanzhang.temple.review.assign.default.002",
      defaultEmpty: "runtime.zhu_yuanzhang.temple.review.assign.default.empty.001",
      defaultOutro: "runtime.zhu_yuanzhang.temple.review.assign.default.003",
      locked: [
        "runtime.zhu_yuanzhang.temple.review.assignment.locked.001",
        "runtime.zhu_yuanzhang.temple.review.assignment.locked.002",
      ],
    },
    begAlmsStartOverlayTextIds: {
      defaultTitle:
        "runtime.zhu_yuanzhang.temple.work.start_beg_alms.overlay.default.title",
      defaultFollowup:
        "runtime.zhu_yuanzhang.temple.work.start_beg_alms.overlay.default.001",
      thirdWeekTitle:
        "runtime.zhu_yuanzhang.temple.work.start_beg_alms.overlay.third_week.title",
      thirdWeekLines: [
        "runtime.zhu_yuanzhang.temple.work.start_beg_alms.overlay.third_week.001",
        "runtime.zhu_yuanzhang.temple.work.start_beg_alms.overlay.third_week.002",
      ],
      fourthWeekTitle:
        "runtime.zhu_yuanzhang.temple.work.start_beg_alms.overlay.fourth_week.title",
      fourthWeekLines: [
        "runtime.zhu_yuanzhang.temple.work.start_beg_alms.overlay.fourth_week.001",
        "runtime.zhu_yuanzhang.temple.work.start_beg_alms.overlay.fourth_week.002",
      ],
    },
    statusCardTextIds: {
      eyebrow: "runtime.zhu_yuanzhang.temple.status.eyebrow",
      titleMonk: "runtime.zhu_yuanzhang.temple.status.title.monk",
      titleDaily: "runtime.zhu_yuanzhang.temple.status.title.daily",
      subtitleMeeting: "runtime.zhu_yuanzhang.temple.status.subtitle.meeting",
      subtitleDaily: "runtime.zhu_yuanzhang.temple.status.subtitle.daily",
      metricAbbot: "runtime.zhu_yuanzhang.temple.status.metric.abbot",
    },
    restSummaryTextIds: {
      interruptedCouncilTitle:
        "runtime.zhu_yuanzhang.temple.rest.interrupted.council.001",
      interruptedCouncilBody:
        "runtime.zhu_yuanzhang.temple.rest.interrupted.council.002",
      none: "runtime.zhu_yuanzhang.temple.rest.summary.none.001",
      days: "runtime.zhu_yuanzhang.temple.rest.summary.days.001",
      current: "runtime.zhu_yuanzhang.temple.rest.summary.current.001",
      normal: "runtime.zhu_yuanzhang.temple.rest.summary.normal.001",
    },
    restDaysOverlayTextIds: {
      title: "runtime.zhu_yuanzhang.temple.rest_days.title",
      body: "runtime.zhu_yuanzhang.temple.rest_days.001",
      confirmLabel: "runtime.zhu_yuanzhang.temple.rest_days.confirm.label",
      cancelLabel: "runtime.zhu_yuanzhang.temple.rest_days.cancel.label",
    },
    lateReviewTextIds: {
      choiceLines: [
        "runtime.zhu_yuanzhang.temple.review.late.choice.001",
        "runtime.zhu_yuanzhang.temple.review.late.choice.002",
        "runtime.zhu_yuanzhang.temple.review.late.choice.003",
      ],
      heavyLines: [
        "runtime.zhu_yuanzhang.temple.review.late.heavy.001",
        "runtime.zhu_yuanzhang.temple.review.late.heavy.002",
      ],
      lightLines: [
        "runtime.zhu_yuanzhang.temple.review.late.light.001",
        "runtime.zhu_yuanzhang.temple.review.late.light.002",
      ],
    },
    qteOverlayTextIds: {
      title: "runtime.zhu_yuanzhang.temple.qte.title",
      helperLines: [
        "runtime.zhu_yuanzhang.temple.qte.001",
        "runtime.zhu_yuanzhang.temple.qte.002",
      ],
    },
    beggingFoodTextIds: {
      emptyTitle: "runtime.zhu_yuanzhang.temple.begging_food.empty.title",
      emptyLines: [
        "runtime.zhu_yuanzhang.temple.begging_food.empty.001",
        "runtime.zhu_yuanzhang.temple.begging_food.empty.002",
      ],
      submitTitle: "runtime.zhu_yuanzhang.temple.begging_food.submit.title",
      submitLines: [
        "runtime.zhu_yuanzhang.temple.begging_food.submit.001",
        "runtime.zhu_yuanzhang.temple.begging_food.submit.002",
      ],
      quantityLabel: "runtime.zhu_yuanzhang.temple.begging_food.submit.quantity.label",
      confirmLabel: "runtime.zhu_yuanzhang.temple.begging_food.submit.confirm.label",
      cancelLabel: "runtime.zhu_yuanzhang.temple.begging_food.submit.cancel.label",
      submittedMissionLabel:
        "runtime.zhu_yuanzhang.temple.main_mission.begging_submitted.label",
    },
    uiTextIds: {
      activityConfirmLabel: "runtime.zhu_yuanzhang.temple.ui.activity_confirm.confirm",
      activityCancelLabel: "runtime.zhu_yuanzhang.temple.ui.activity_confirm.cancel",
      activityRelatedAbilityPending:
        "runtime.zhu_yuanzhang.temple.ui.activity_confirm.related_ability",
      activityQuickCompleteLabel:
        "runtime.zhu_yuanzhang.temple.ui.activity_confirm.quick_complete",
      alertConfirmLabel: "runtime.zhu_yuanzhang.temple.ui.alert.confirm",
      donateCancelLabel: "runtime.zhu_yuanzhang.temple.ui.donate.cancel",
      resultConfirmLabel: "runtime.zhu_yuanzhang.temple.ui.result.confirm",
      leaveRefusalAdvanceHint:
        "runtime.zhu_yuanzhang.temple.ui.leave_refusal.advance",
      dialogueAdvanceHint: "runtime.zhu_yuanzhang.temple.ui.dialogue.advance",
      reviewAssignmentDefaultTitle:
        "runtime.zhu_yuanzhang.temple.ui.review.assignment.default_title",
      reviewPolicyOverallGoal:
        "runtime.zhu_yuanzhang.temple.ui.review.policy.overall_goal",
      reviewAssignmentOverlayTitle:
        "runtime.zhu_yuanzhang.temple.ui.review.assignment.overlay.title",
      reviewAssignmentOverlayConfirmLabel:
        "runtime.zhu_yuanzhang.temple.ui.review.assignment.overlay.confirm",
      reviewPolicyOverlayTitle:
        "runtime.zhu_yuanzhang.temple.ui.review.policy.overlay.title",
      reviewPolicyOverlayCloseLabel:
        "runtime.zhu_yuanzhang.temple.ui.review.policy.overlay.close",
      reviewRewardTitle: "runtime.zhu_yuanzhang.temple.ui.review.reward.title",
      reviewPersonnelNarration:
        "runtime.zhu_yuanzhang.temple.ui.review.personnel.narration",
      reviewPersonnelOverlayTitle:
        "runtime.zhu_yuanzhang.temple.ui.review.personnel.overlay.title",
      reviewAssignmentSettledLine:
        "runtime.zhu_yuanzhang.temple.ui.review.assignment.settled",
      reviewProgressLead: "runtime.zhu_yuanzhang.temple.ui.review.progress.lead",
      reviewPraiseLead: "runtime.zhu_yuanzhang.temple.ui.review.praise.lead",
      reviewPolicyLead: "runtime.zhu_yuanzhang.temple.ui.review.policy.lead",
      reviewAdvicePrompt: "runtime.zhu_yuanzhang.temple.ui.review.advice.prompt",
      reviewAdviceAcknowledge:
        "runtime.zhu_yuanzhang.temple.ui.review.advice.acknowledge",
      rootActionRest: "runtime.zhu_yuanzhang.temple.ui.root_action.rest",
      rootActionDonate: "runtime.zhu_yuanzhang.temple.ui.root_action.donate",
      rootActionDismiss: "runtime.zhu_yuanzhang.temple.ui.root_action.dismiss",
      rootActionWorkPending:
        "runtime.zhu_yuanzhang.temple.ui.root_action.work.pending",
      rootActionWorkReady: "runtime.zhu_yuanzhang.temple.ui.root_action.work.ready",
      rootActionSubmitFoodTemplate:
        "runtime.zhu_yuanzhang.temple.ui.root_action.submit_food",
      submitFoodActionLabel:
        "runtime.zhu_yuanzhang.temple.ui.root_action.submit_food.action_label",
      restMenuOneDay: "runtime.zhu_yuanzhang.temple.ui.rest_menu.one_day",
      restMenuCustomDays: "runtime.zhu_yuanzhang.temple.ui.rest_menu.custom_days",
      restMenuUntilCouncil:
        "runtime.zhu_yuanzhang.temple.ui.rest_menu.until_council",
      restMenuUntilRecovered:
        "runtime.zhu_yuanzhang.temple.ui.rest_menu.until_recovered",
      menuBack: "runtime.zhu_yuanzhang.temple.ui.menu.back",
      workMenuUnavailablePending:
        "runtime.zhu_yuanzhang.temple.ui.work_menu.unavailable.pending",
      workMenuUnavailableIdle:
        "runtime.zhu_yuanzhang.temple.ui.work_menu.unavailable.idle",
      actionPanelTitleMeetingMonk:
        "runtime.zhu_yuanzhang.temple.ui.action_panel.meeting.monk",
      actionPanelTitleMeetingDaily:
        "runtime.zhu_yuanzhang.temple.ui.action_panel.meeting.daily",
      actionPanelTitleAdvice:
        "runtime.zhu_yuanzhang.temple.ui.action_panel.advice.title",
      adviceActionGive:
        "runtime.zhu_yuanzhang.temple.ui.action_panel.advice.give",
      adviceActionSilent:
        "runtime.zhu_yuanzhang.temple.ui.action_panel.advice.silent",
      actionPanelTitleRest: "runtime.zhu_yuanzhang.temple.ui.action_panel.rest",
      actionPanelTitleWork: "runtime.zhu_yuanzhang.temple.ui.action_panel.work",
      actionPanelTitleTempleDaily:
        "runtime.zhu_yuanzhang.temple.ui.action_panel.temple_daily",
      statusCountdown: "runtime.zhu_yuanzhang.temple.ui.status.countdown",
      statusContribution: "runtime.zhu_yuanzhang.temple.ui.status.contribution",
      statusWeek: "runtime.zhu_yuanzhang.temple.ui.status.week",
      statusDonationTotal: "runtime.zhu_yuanzhang.temple.ui.status.donation_total",
      statusCurrentTask: "runtime.zhu_yuanzhang.temple.ui.status.current_task",
      statusCurrentTaskNone:
        "runtime.zhu_yuanzhang.temple.ui.status.current_task.none",
      statusPlayerStamina:
        "runtime.zhu_yuanzhang.temple.ui.status.player_stamina",
      statusPlayerFood: "runtime.zhu_yuanzhang.temple.ui.status.player_food",
      statusSubmittedFood:
        "runtime.zhu_yuanzhang.temple.ui.status.submitted_food",
      statusPlayerGold: "runtime.zhu_yuanzhang.temple.ui.status.player_gold",
      leaveActionLabel: "runtime.zhu_yuanzhang.temple.ui.leave_action.label",
    },
    alertTextIds: {
      lowStaminaTitle: "runtime.zhu_yuanzhang.temple.alert.low_stamina.title",
      lowStaminaBody: "runtime.zhu_yuanzhang.temple.alert.low_stamina.001",
      lowStaminaFollowup: "runtime.zhu_yuanzhang.temple.alert.low_stamina.002",
      insufficientTimeTitle:
        "runtime.zhu_yuanzhang.temple.alert.insufficient_time.title",
      insufficientTimeReached:
        "runtime.zhu_yuanzhang.temple.alert.insufficient_time.reached.001",
      insufficientTimeRemaining:
        "runtime.zhu_yuanzhang.temple.alert.insufficient_time.remaining.001",
      insufficientTimeFollowup:
        "runtime.zhu_yuanzhang.temple.alert.insufficient_time.002",
      invalidRestDaysTitle:
        "runtime.zhu_yuanzhang.temple.alert.invalid_rest_days.title",
      invalidRestDaysBody:
        "runtime.zhu_yuanzhang.temple.alert.invalid_rest_days.001",
      insufficientRankTitle:
        "runtime.zhu_yuanzhang.temple.alert.insufficient_rank.title",
      insufficientRankLines: [
        "runtime.zhu_yuanzhang.temple.alert.insufficient_rank.001",
        "runtime.zhu_yuanzhang.temple.alert.insufficient_rank.002",
      ],
      noBestScoreTitle:
        "runtime.zhu_yuanzhang.temple.alert.no_best_score.title",
      noBestScoreBody: "runtime.zhu_yuanzhang.temple.alert.no_best_score.001",
    },
    workResultTextIds: {
      lazyGrade: "runtime.zhu_yuanzhang.temple.work_result.lazy.grade",
      lazyLines: [
        "runtime.zhu_yuanzhang.temple.work_result.lazy.001",
        "runtime.zhu_yuanzhang.temple.work_result.lazy.002",
      ],
      passGrade: "runtime.zhu_yuanzhang.temple.work_result.pass.grade",
      passLines: [
        "runtime.zhu_yuanzhang.temple.work_result.pass.001",
        "runtime.zhu_yuanzhang.temple.work_result.pass.002",
      ],
      diligentGrade: "runtime.zhu_yuanzhang.temple.work_result.diligent.grade",
      diligentLines: [
        "runtime.zhu_yuanzhang.temple.work_result.diligent.001",
        "runtime.zhu_yuanzhang.temple.work_result.diligent.002",
      ],
      unlockTitle: "runtime.zhu_yuanzhang.temple.work_result.unlock.title",
      normalTitle: "runtime.zhu_yuanzhang.temple.work_result.normal.title",
    },
  });
});

test("temple static text defaults prefer scenario-pack house-module overrides when present", () => {
  assert.deepEqual(
    resolveTempleStaticTextDefaults({
      "temple-house": {
        templeGreetingTextIds: ["pack.temple.greeting.001", "pack.temple.greeting.002"],
        templeOpenTextIds: ["pack.temple.open.001", "pack.temple.open.002"],
        templeRestMenuTextIds: ["pack.temple.rest.001", "pack.temple.rest.002"],
        templeMeetingIntroTextIds: ["pack.temple.meeting.001", "pack.temple.meeting.002"],
        templeLeaveRefusalTextIds: ["pack.temple.leave.001", "pack.temple.leave.002"],
        templeWorkPlanTextIds: {
          templeHelp: "pack.temple.work.temple-help",
          begAlmsDefault: "pack.temple.work.beg-default",
          begAlmsLocked: "pack.temple.work.beg-locked",
          begAlmsThirdWeek: "pack.temple.work.beg-third",
          begAlmsFourthWeek: "pack.temple.work.beg-fourth",
        },
        templeDonationTextIds: {
          confirmTitle: "pack.temple.donation.confirm.title",
          confirmBodyTemplate: "pack.temple.donation.confirm.001",
          confirmBodyFollowup: "pack.temple.donation.confirm.002",
          insufficientTitle: "pack.temple.donation.insufficient.title",
          insufficientBodyTemplate: "pack.temple.donation.insufficient.001",
          insufficientBodyFollowup: "pack.temple.donation.insufficient.002",
          resultTitle: "pack.temple.donation.result.title",
          resultFameTemplate: "pack.temple.donation.result.fame.001",
          resultFameFollowup: "pack.temple.donation.result.fame.002",
          resultNormalTemplate: "pack.temple.donation.result.normal.001",
          resultNormalFollowup: "pack.temple.donation.result.normal.002",
        },
        templeReviewAssignmentTextIds: {
          thirdWeek: [
            "pack.temple.review.third.001",
            "pack.temple.review.third.002",
            "pack.temple.review.third.003",
          ],
          fourthWeek: [
            "pack.temple.review.fourth.001",
            "pack.temple.review.fourth.002",
            "pack.temple.review.fourth.003",
          ],
          defaultIntro: "pack.temple.review.default.001",
          defaultAvailableTemplate: "pack.temple.review.default.002",
          defaultEmpty: "pack.temple.review.default.empty.001",
          defaultOutro: "pack.temple.review.default.003",
          locked: [
            "pack.temple.review.locked.001",
            "pack.temple.review.locked.002",
          ],
        },
        templeBegAlmsStartOverlayTextIds: {
          defaultTitle: "pack.temple.beg.default.title",
          defaultFollowup: "pack.temple.beg.default.001",
          thirdWeekTitle: "pack.temple.beg.third.title",
          thirdWeekLines: [
            "pack.temple.beg.third.001",
            "pack.temple.beg.third.002",
          ],
          fourthWeekTitle: "pack.temple.beg.fourth.title",
          fourthWeekLines: [
            "pack.temple.beg.fourth.001",
            "pack.temple.beg.fourth.002",
          ],
        },
        templeStatusCardTextIds: {
          eyebrow: "pack.temple.status.eyebrow",
          titleMonk: "pack.temple.status.title.monk",
          titleDaily: "pack.temple.status.title.daily",
          subtitleMeeting: "pack.temple.status.subtitle.meeting",
          subtitleDaily: "pack.temple.status.subtitle.daily",
          metricAbbot: "pack.temple.status.metric.abbot",
        },
        templeRestSummaryTextIds: {
          interruptedCouncilTitle: "pack.temple.rest.interrupted.001",
          interruptedCouncilBody: "pack.temple.rest.interrupted.002",
          none: "pack.temple.rest.none.001",
          days: "pack.temple.rest.days.001",
          current: "pack.temple.rest.current.001",
          normal: "pack.temple.rest.normal.001",
        },
        templeRestDaysOverlayTextIds: {
          title: "pack.temple.rest-days.title",
          body: "pack.temple.rest-days.001",
          confirmLabel: "pack.temple.rest-days.confirm",
          cancelLabel: "pack.temple.rest-days.cancel",
        },
        templeLateReviewTextIds: {
          choiceLines: [
            "pack.temple.late.choice.001",
            "pack.temple.late.choice.002",
            "pack.temple.late.choice.003",
          ],
          heavyLines: [
            "pack.temple.late.heavy.001",
            "pack.temple.late.heavy.002",
          ],
          lightLines: [
            "pack.temple.late.light.001",
            "pack.temple.late.light.002",
          ],
        },
        templeQteOverlayTextIds: {
          title: "pack.temple.qte.title",
          helperLines: [
            "pack.temple.qte.001",
            "pack.temple.qte.002",
          ],
        },
        templeBeggingFoodTextIds: {
          emptyTitle: "pack.temple.begging.empty.title",
          emptyLines: [
            "pack.temple.begging.empty.001",
            "pack.temple.begging.empty.002",
          ],
          submitTitle: "pack.temple.begging.submit.title",
          submitLines: [
            "pack.temple.begging.submit.001",
            "pack.temple.begging.submit.002",
          ],
          quantityLabel: "pack.temple.begging.submit.quantity",
          confirmLabel: "pack.temple.begging.submit.confirm",
          cancelLabel: "pack.temple.begging.submit.cancel",
          submittedMissionLabel: "pack.temple.begging.submitted.label",
        },
        templeUiTextIds: {
          activityConfirmLabel: "pack.temple.ui.activity.confirm",
          activityCancelLabel: "pack.temple.ui.activity.cancel",
          activityRelatedAbilityPending: "pack.temple.ui.activity.related",
          activityQuickCompleteLabel: "pack.temple.ui.activity.quick",
          alertConfirmLabel: "pack.temple.ui.alert.confirm",
          donateCancelLabel: "pack.temple.ui.donate.cancel",
          resultConfirmLabel: "pack.temple.ui.result.confirm",
          leaveRefusalAdvanceHint: "pack.temple.ui.leave.advance",
          dialogueAdvanceHint: "pack.temple.ui.dialogue.advance",
          reviewAssignmentDefaultTitle: "pack.temple.ui.review.assignment.default",
          reviewPolicyOverallGoal: "pack.temple.ui.review.policy.goal",
          reviewAssignmentOverlayTitle: "pack.temple.ui.review.assignment.title",
          reviewAssignmentOverlayConfirmLabel: "pack.temple.ui.review.assignment.confirm",
          reviewPolicyOverlayTitle: "pack.temple.ui.review.policy.title",
          reviewPolicyOverlayCloseLabel: "pack.temple.ui.review.policy.close",
          reviewRewardTitle: "pack.temple.ui.review.reward.title",
          reviewPersonnelNarration: "pack.temple.ui.review.personnel.narration",
          reviewPersonnelOverlayTitle: "pack.temple.ui.review.personnel.title",
          reviewAssignmentSettledLine: "pack.temple.ui.review.assignment.settled",
          reviewProgressLead: "pack.temple.ui.review.progress",
          reviewPraiseLead: "pack.temple.ui.review.praise",
          reviewPolicyLead: "pack.temple.ui.review.policy.lead",
          reviewAdvicePrompt: "pack.temple.ui.review.advice.prompt",
          reviewAdviceAcknowledge: "pack.temple.ui.review.advice.ack",
          rootActionRest: "pack.temple.ui.root.rest",
          rootActionDonate: "pack.temple.ui.root.donate",
          rootActionDismiss: "pack.temple.ui.root.dismiss",
          rootActionWorkPending: "pack.temple.ui.root.work.pending",
          rootActionWorkReady: "pack.temple.ui.root.work.ready",
          rootActionSubmitFoodTemplate: "pack.temple.ui.root.submit_food",
          submitFoodActionLabel: "pack.temple.ui.root.submit_food.label",
          restMenuOneDay: "pack.temple.ui.rest.one_day",
          restMenuCustomDays: "pack.temple.ui.rest.custom_days",
          restMenuUntilCouncil: "pack.temple.ui.rest.until_council",
          restMenuUntilRecovered: "pack.temple.ui.rest.until_recovered",
          menuBack: "pack.temple.ui.menu.back",
          workMenuUnavailablePending: "pack.temple.ui.work.pending",
          workMenuUnavailableIdle: "pack.temple.ui.work.idle",
          actionPanelTitleMeetingMonk: "pack.temple.ui.panel.meeting.monk",
          actionPanelTitleMeetingDaily: "pack.temple.ui.panel.meeting.daily",
          actionPanelTitleAdvice: "pack.temple.ui.panel.advice",
          adviceActionGive: "pack.temple.ui.panel.advice.give",
          adviceActionSilent: "pack.temple.ui.panel.advice.silent",
          actionPanelTitleRest: "pack.temple.ui.panel.rest",
          actionPanelTitleWork: "pack.temple.ui.panel.work",
          actionPanelTitleTempleDaily: "pack.temple.ui.panel.daily",
          statusCountdown: "pack.temple.ui.status.countdown",
          statusContribution: "pack.temple.ui.status.contribution",
          statusWeek: "pack.temple.ui.status.week",
          statusDonationTotal: "pack.temple.ui.status.donation",
          statusCurrentTask: "pack.temple.ui.status.current_task",
          statusCurrentTaskNone: "pack.temple.ui.status.current_task.none",
          statusPlayerStamina: "pack.temple.ui.status.stamina",
          statusPlayerFood: "pack.temple.ui.status.food",
          statusSubmittedFood: "pack.temple.ui.status.submitted_food",
          statusPlayerGold: "pack.temple.ui.status.gold",
          leaveActionLabel: "pack.temple.ui.leave.label",
        },
        templeAlertTextIds: {
          lowStaminaTitle: "pack.temple.alert.low.title",
          lowStaminaBody: "pack.temple.alert.low.001",
          lowStaminaFollowup: "pack.temple.alert.low.002",
          insufficientTimeTitle: "pack.temple.alert.time.title",
          insufficientTimeReached: "pack.temple.alert.time.reached",
          insufficientTimeRemaining: "pack.temple.alert.time.remaining",
          insufficientTimeFollowup: "pack.temple.alert.time.002",
          invalidRestDaysTitle: "pack.temple.alert.rest.title",
          invalidRestDaysBody: "pack.temple.alert.rest.001",
          insufficientRankTitle: "pack.temple.alert.rank.title",
          insufficientRankLines: [
            "pack.temple.alert.rank.001",
            "pack.temple.alert.rank.002",
          ],
          noBestScoreTitle: "pack.temple.alert.best.title",
          noBestScoreBody: "pack.temple.alert.best.001",
        },
        templeWorkResultTextIds: {
          lazyGrade: "pack.temple.result.lazy.grade",
          lazyLines: [
            "pack.temple.result.lazy.001",
            "pack.temple.result.lazy.002",
          ],
          passGrade: "pack.temple.result.pass.grade",
          passLines: [
            "pack.temple.result.pass.001",
            "pack.temple.result.pass.002",
          ],
          diligentGrade: "pack.temple.result.diligent.grade",
          diligentLines: [
            "pack.temple.result.diligent.001",
            "pack.temple.result.diligent.002",
          ],
          unlockTitle: "pack.temple.result.unlock.title",
          normalTitle: "pack.temple.result.normal.title",
        },
      },
    }),
    {
      greetingTextIds: ["pack.temple.greeting.001", "pack.temple.greeting.002"],
      openTextIds: ["pack.temple.open.001", "pack.temple.open.002"],
      restMenuTextIds: ["pack.temple.rest.001", "pack.temple.rest.002"],
      meetingIntroTextIds: ["pack.temple.meeting.001", "pack.temple.meeting.002"],
      leaveRefusalTextIds: ["pack.temple.leave.001", "pack.temple.leave.002"],
      workPlanTextIds: {
        templeHelp: "pack.temple.work.temple-help",
        begAlmsDefault: "pack.temple.work.beg-default",
        begAlmsLocked: "pack.temple.work.beg-locked",
        begAlmsThirdWeek: "pack.temple.work.beg-third",
        begAlmsFourthWeek: "pack.temple.work.beg-fourth",
      },
      donationTextIds: {
        confirmTitle: "pack.temple.donation.confirm.title",
        confirmBodyTemplate: "pack.temple.donation.confirm.001",
        confirmBodyFollowup: "pack.temple.donation.confirm.002",
        insufficientTitle: "pack.temple.donation.insufficient.title",
        insufficientBodyTemplate: "pack.temple.donation.insufficient.001",
        insufficientBodyFollowup: "pack.temple.donation.insufficient.002",
        resultTitle: "pack.temple.donation.result.title",
        resultFameTemplate: "pack.temple.donation.result.fame.001",
        resultFameFollowup: "pack.temple.donation.result.fame.002",
        resultNormalTemplate: "pack.temple.donation.result.normal.001",
        resultNormalFollowup: "pack.temple.donation.result.normal.002",
      },
      reviewAssignmentTextIds: {
        thirdWeek: [
          "pack.temple.review.third.001",
          "pack.temple.review.third.002",
          "pack.temple.review.third.003",
        ],
        fourthWeek: [
          "pack.temple.review.fourth.001",
          "pack.temple.review.fourth.002",
          "pack.temple.review.fourth.003",
        ],
        defaultIntro: "pack.temple.review.default.001",
        defaultAvailableTemplate: "pack.temple.review.default.002",
        defaultEmpty: "pack.temple.review.default.empty.001",
        defaultOutro: "pack.temple.review.default.003",
        locked: [
          "pack.temple.review.locked.001",
          "pack.temple.review.locked.002",
        ],
      },
      begAlmsStartOverlayTextIds: {
        defaultTitle: "pack.temple.beg.default.title",
        defaultFollowup: "pack.temple.beg.default.001",
        thirdWeekTitle: "pack.temple.beg.third.title",
        thirdWeekLines: [
          "pack.temple.beg.third.001",
          "pack.temple.beg.third.002",
        ],
        fourthWeekTitle: "pack.temple.beg.fourth.title",
        fourthWeekLines: [
          "pack.temple.beg.fourth.001",
          "pack.temple.beg.fourth.002",
        ],
      },
      statusCardTextIds: {
        eyebrow: "pack.temple.status.eyebrow",
        titleMonk: "pack.temple.status.title.monk",
        titleDaily: "pack.temple.status.title.daily",
        subtitleMeeting: "pack.temple.status.subtitle.meeting",
        subtitleDaily: "pack.temple.status.subtitle.daily",
        metricAbbot: "pack.temple.status.metric.abbot",
      },
      restSummaryTextIds: {
        interruptedCouncilTitle: "pack.temple.rest.interrupted.001",
        interruptedCouncilBody: "pack.temple.rest.interrupted.002",
        none: "pack.temple.rest.none.001",
        days: "pack.temple.rest.days.001",
        current: "pack.temple.rest.current.001",
        normal: "pack.temple.rest.normal.001",
      },
      restDaysOverlayTextIds: {
        title: "pack.temple.rest-days.title",
        body: "pack.temple.rest-days.001",
        confirmLabel: "pack.temple.rest-days.confirm",
        cancelLabel: "pack.temple.rest-days.cancel",
      },
      lateReviewTextIds: {
        choiceLines: [
          "pack.temple.late.choice.001",
          "pack.temple.late.choice.002",
          "pack.temple.late.choice.003",
        ],
        heavyLines: [
          "pack.temple.late.heavy.001",
          "pack.temple.late.heavy.002",
        ],
        lightLines: [
          "pack.temple.late.light.001",
          "pack.temple.late.light.002",
        ],
      },
      qteOverlayTextIds: {
        title: "pack.temple.qte.title",
        helperLines: [
          "pack.temple.qte.001",
          "pack.temple.qte.002",
        ],
      },
      beggingFoodTextIds: {
        emptyTitle: "pack.temple.begging.empty.title",
        emptyLines: [
          "pack.temple.begging.empty.001",
          "pack.temple.begging.empty.002",
        ],
        submitTitle: "pack.temple.begging.submit.title",
        submitLines: [
          "pack.temple.begging.submit.001",
          "pack.temple.begging.submit.002",
        ],
        quantityLabel: "pack.temple.begging.submit.quantity",
        confirmLabel: "pack.temple.begging.submit.confirm",
        cancelLabel: "pack.temple.begging.submit.cancel",
        submittedMissionLabel: "pack.temple.begging.submitted.label",
      },
      uiTextIds: {
        activityConfirmLabel: "pack.temple.ui.activity.confirm",
        activityCancelLabel: "pack.temple.ui.activity.cancel",
        activityRelatedAbilityPending: "pack.temple.ui.activity.related",
        activityQuickCompleteLabel: "pack.temple.ui.activity.quick",
        alertConfirmLabel: "pack.temple.ui.alert.confirm",
        donateCancelLabel: "pack.temple.ui.donate.cancel",
        resultConfirmLabel: "pack.temple.ui.result.confirm",
        leaveRefusalAdvanceHint: "pack.temple.ui.leave.advance",
        dialogueAdvanceHint: "pack.temple.ui.dialogue.advance",
        reviewAssignmentDefaultTitle: "pack.temple.ui.review.assignment.default",
        reviewPolicyOverallGoal: "pack.temple.ui.review.policy.goal",
        reviewAssignmentOverlayTitle: "pack.temple.ui.review.assignment.title",
        reviewAssignmentOverlayConfirmLabel: "pack.temple.ui.review.assignment.confirm",
        reviewPolicyOverlayTitle: "pack.temple.ui.review.policy.title",
        reviewPolicyOverlayCloseLabel: "pack.temple.ui.review.policy.close",
        reviewRewardTitle: "pack.temple.ui.review.reward.title",
        reviewPersonnelNarration: "pack.temple.ui.review.personnel.narration",
        reviewPersonnelOverlayTitle: "pack.temple.ui.review.personnel.title",
        reviewAssignmentSettledLine: "pack.temple.ui.review.assignment.settled",
        reviewProgressLead: "pack.temple.ui.review.progress",
        reviewPraiseLead: "pack.temple.ui.review.praise",
        reviewPolicyLead: "pack.temple.ui.review.policy.lead",
        reviewAdvicePrompt: "pack.temple.ui.review.advice.prompt",
        reviewAdviceAcknowledge: "pack.temple.ui.review.advice.ack",
        rootActionRest: "pack.temple.ui.root.rest",
        rootActionDonate: "pack.temple.ui.root.donate",
        rootActionDismiss: "pack.temple.ui.root.dismiss",
        rootActionWorkPending: "pack.temple.ui.root.work.pending",
        rootActionWorkReady: "pack.temple.ui.root.work.ready",
        rootActionSubmitFoodTemplate: "pack.temple.ui.root.submit_food",
        submitFoodActionLabel: "pack.temple.ui.root.submit_food.label",
        restMenuOneDay: "pack.temple.ui.rest.one_day",
        restMenuCustomDays: "pack.temple.ui.rest.custom_days",
        restMenuUntilCouncil: "pack.temple.ui.rest.until_council",
        restMenuUntilRecovered: "pack.temple.ui.rest.until_recovered",
        menuBack: "pack.temple.ui.menu.back",
        workMenuUnavailablePending: "pack.temple.ui.work.pending",
        workMenuUnavailableIdle: "pack.temple.ui.work.idle",
        actionPanelTitleMeetingMonk: "pack.temple.ui.panel.meeting.monk",
        actionPanelTitleMeetingDaily: "pack.temple.ui.panel.meeting.daily",
        actionPanelTitleAdvice: "pack.temple.ui.panel.advice",
        adviceActionGive: "pack.temple.ui.panel.advice.give",
        adviceActionSilent: "pack.temple.ui.panel.advice.silent",
        actionPanelTitleRest: "pack.temple.ui.panel.rest",
        actionPanelTitleWork: "pack.temple.ui.panel.work",
        actionPanelTitleTempleDaily: "pack.temple.ui.panel.daily",
        statusCountdown: "pack.temple.ui.status.countdown",
        statusContribution: "pack.temple.ui.status.contribution",
        statusWeek: "pack.temple.ui.status.week",
        statusDonationTotal: "pack.temple.ui.status.donation",
        statusCurrentTask: "pack.temple.ui.status.current_task",
        statusCurrentTaskNone: "pack.temple.ui.status.current_task.none",
        statusPlayerStamina: "pack.temple.ui.status.stamina",
        statusPlayerFood: "pack.temple.ui.status.food",
        statusSubmittedFood: "pack.temple.ui.status.submitted_food",
        statusPlayerGold: "pack.temple.ui.status.gold",
        leaveActionLabel: "pack.temple.ui.leave.label",
      },
      alertTextIds: {
        lowStaminaTitle: "pack.temple.alert.low.title",
        lowStaminaBody: "pack.temple.alert.low.001",
        lowStaminaFollowup: "pack.temple.alert.low.002",
        insufficientTimeTitle: "pack.temple.alert.time.title",
        insufficientTimeReached: "pack.temple.alert.time.reached",
        insufficientTimeRemaining: "pack.temple.alert.time.remaining",
        insufficientTimeFollowup: "pack.temple.alert.time.002",
        invalidRestDaysTitle: "pack.temple.alert.rest.title",
        invalidRestDaysBody: "pack.temple.alert.rest.001",
        insufficientRankTitle: "pack.temple.alert.rank.title",
        insufficientRankLines: [
          "pack.temple.alert.rank.001",
          "pack.temple.alert.rank.002",
        ],
        noBestScoreTitle: "pack.temple.alert.best.title",
        noBestScoreBody: "pack.temple.alert.best.001",
      },
      workResultTextIds: {
        lazyGrade: "pack.temple.result.lazy.grade",
        lazyLines: [
          "pack.temple.result.lazy.001",
          "pack.temple.result.lazy.002",
        ],
        passGrade: "pack.temple.result.pass.grade",
        passLines: [
          "pack.temple.result.pass.001",
          "pack.temple.result.pass.002",
        ],
        diligentGrade: "pack.temple.result.diligent.grade",
        diligentLines: [
          "pack.temple.result.diligent.001",
          "pack.temple.result.diligent.002",
        ],
        unlockTitle: "pack.temple.result.unlock.title",
        normalTitle: "pack.temple.result.normal.title",
      },
    }
  );
});
