type HouseModuleDefaultsRecord = Record<string, unknown>;

export type TempleStaticTextDefaults = {
  greetingTextIds: [string, string];
  openTextIds: [string, string];
  restMenuTextIds: [string, string];
  meetingIntroTextIds: [string, string];
  leaveRefusalTextIds: string[];
  workPlanTextIds: {
    templeHelp: string;
    begAlmsDefault: string;
    begAlmsLocked: string;
    begAlmsThirdWeek: string;
    begAlmsFourthWeek: string;
  };
  donationTextIds: {
    confirmTitle: string;
    confirmBodyTemplate: string;
    confirmBodyFollowup: string;
    insufficientTitle: string;
    insufficientBodyTemplate: string;
    insufficientBodyFollowup: string;
    resultTitle: string;
    resultFameTemplate: string;
    resultFameFollowup: string;
    resultNormalTemplate: string;
    resultNormalFollowup: string;
  };
  reviewAssignmentTextIds: {
    thirdWeek: [string, string, string];
    fourthWeek: [string, string, string];
    defaultIntro: string;
    defaultAvailableTemplate: string;
    defaultEmpty: string;
    defaultOutro: string;
    locked: [string, string];
  };
  begAlmsStartOverlayTextIds: {
    defaultTitle: string;
    defaultFollowup: string;
    thirdWeekTitle: string;
    thirdWeekLines: [string, string];
    fourthWeekTitle: string;
    fourthWeekLines: [string, string];
  };
  statusCardTextIds: {
    eyebrow: string;
    titleMonk: string;
    titleDaily: string;
    subtitleMeeting: string;
    subtitleDaily: string;
    metricAbbot: string;
  };
  restSummaryTextIds: {
    interruptedCouncilTitle: string;
    interruptedCouncilBody: string;
    none: string;
    days: string;
    current: string;
    normal: string;
    autoAdvanceTitleTemplate: string;
  };
  restDaysOverlayTextIds: {
    title: string;
    body: string;
    confirmLabel: string;
    cancelLabel: string;
  };
  lateReviewTextIds: {
    choiceLines: [string, string, string];
    heavyLines: [string, string];
    lightLines: [string, string];
  };
  qteOverlayTextIds: {
    title: string;
    helperLines: [string, string];
  };
  beggingFoodTextIds: {
    emptyTitle: string;
    emptyLines: [string, string];
    submitTitle: string;
    submitLines: [string, string];
    quantityLabel: string;
    confirmLabel: string;
    cancelLabel: string;
    submittedMissionLabel: string;
  };
  uiTextIds: {
    activityConfirmLabel: string;
    activityCancelLabel: string;
    activityRelatedAbilityPending: string;
    activityQuickCompleteLabel: string;
    alertConfirmLabel: string;
    donateConfirmLabelTemplate: string;
    donateCancelLabel: string;
    resultConfirmLabel: string;
    leaveRefusalAdvanceHint: string;
    dialogueAdvanceHint: string;
    reviewAssignmentDefaultTitle: string;
    reviewPolicyOverallGoal: string;
    reviewAssignmentOverlayTitle: string;
    reviewAssignmentOverlayConfirmLabel: string;
    reviewPolicyOverlayTitle: string;
    reviewPolicyOverlayCloseLabel: string;
    reviewRewardTitle: string;
    reviewPersonnelNarration: string;
    reviewPersonnelOverlayTitle: string;
    reviewAssignmentSettledLine: string;
    reviewProgressLead: string;
    reviewPraiseLead: string;
    reviewPolicyLead: string;
    reviewAdvicePrompt: string;
    reviewAdviceAcknowledge: string;
    rootActionRest: string;
    rootActionDonate: string;
    rootActionDismiss: string;
    rootActionWorkPending: string;
    rootActionWorkReady: string;
    rootActionSubmitFoodTemplate: string;
    submitFoodActionLabel: string;
    restMenuOneDay: string;
    restMenuCustomDays: string;
    restMenuUntilCouncil: string;
    restMenuUntilRecovered: string;
    menuBack: string;
    workMenuUnavailablePending: string;
    workMenuUnavailableIdle: string;
    actionPanelTitleMeetingMonk: string;
    actionPanelTitleMeetingDaily: string;
    actionPanelTitleAdvice: string;
    adviceActionGive: string;
    adviceActionSilent: string;
    actionPanelTitleRest: string;
    actionPanelTitleWork: string;
    actionPanelTitleTempleDaily: string;
    statusCountdown: string;
    statusCountdownValueTemplate: string;
    statusContribution: string;
    statusContributionValueTemplate: string;
    statusWeek: string;
    statusWeekValueTemplate: string;
    statusDonationTotal: string;
    statusDonationTotalValueTemplate: string;
    statusCurrentTask: string;
    statusCurrentTaskNone: string;
    statusPlayerStamina: string;
    statusPlayerFood: string;
    statusSubmittedFood: string;
    statusPlayerGold: string;
    statusPlayerGoldValueTemplate: string;
    leaveActionLabel: string;
  };
  alertTextIds: {
    lowStaminaTitle: string;
    lowStaminaBody: string;
    lowStaminaFollowup: string;
    insufficientTimeTitle: string;
    insufficientTimeReached: string;
    insufficientTimeRemaining: string;
    insufficientTimeFollowup: string;
    invalidRestDaysTitle: string;
    invalidRestDaysBody: string;
    insufficientRankTitle: string;
    insufficientRankLines: [string, string];
    noBestScoreTitle: string;
    noBestScoreBody: string;
  };
  workResultTextIds: {
    lazyGrade: string;
    lazyLines: [string, string];
    passGrade: string;
    passLines: [string, string];
    diligentGrade: string;
    diligentLines: [string, string];
    unlockTitle: string;
    normalTitle: string;
  };
};

const TEMPLE_STATIC_TEXT_DEFAULTS: TempleStaticTextDefaults = {
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
    begAlmsFourthWeek:
      "runtime.zhu_yuanzhang.temple.work_plan.beg_alms.fourth_week.label",
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
    autoAdvanceTitleTemplate:
      "runtime.zhu_yuanzhang.temple.rest.summary.auto_advance.title",
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
    quantityLabel:
      "runtime.zhu_yuanzhang.temple.begging_food.submit.quantity.label",
    confirmLabel:
      "runtime.zhu_yuanzhang.temple.begging_food.submit.confirm.label",
    cancelLabel:
      "runtime.zhu_yuanzhang.temple.begging_food.submit.cancel.label",
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
    donateConfirmLabelTemplate:
      "runtime.zhu_yuanzhang.temple.ui.donate.confirm.label",
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
    adviceActionGive: "runtime.zhu_yuanzhang.temple.ui.action_panel.advice.give",
    adviceActionSilent:
      "runtime.zhu_yuanzhang.temple.ui.action_panel.advice.silent",
    actionPanelTitleRest: "runtime.zhu_yuanzhang.temple.ui.action_panel.rest",
    actionPanelTitleWork: "runtime.zhu_yuanzhang.temple.ui.action_panel.work",
    actionPanelTitleTempleDaily:
      "runtime.zhu_yuanzhang.temple.ui.action_panel.temple_daily",
    statusCountdown: "runtime.zhu_yuanzhang.temple.ui.status.countdown",
    statusCountdownValueTemplate:
      "runtime.zhu_yuanzhang.temple.ui.status.countdown.value",
    statusContribution: "runtime.zhu_yuanzhang.temple.ui.status.contribution",
    statusContributionValueTemplate:
      "runtime.zhu_yuanzhang.temple.ui.status.contribution.value",
    statusWeek: "runtime.zhu_yuanzhang.temple.ui.status.week",
    statusWeekValueTemplate: "runtime.zhu_yuanzhang.temple.ui.status.week.value",
    statusDonationTotal: "runtime.zhu_yuanzhang.temple.ui.status.donation_total",
    statusDonationTotalValueTemplate:
      "runtime.zhu_yuanzhang.temple.ui.status.donation_total.value",
    statusCurrentTask: "runtime.zhu_yuanzhang.temple.ui.status.current_task",
    statusCurrentTaskNone:
      "runtime.zhu_yuanzhang.temple.ui.status.current_task.none",
    statusPlayerStamina: "runtime.zhu_yuanzhang.temple.ui.status.player_stamina",
    statusPlayerFood: "runtime.zhu_yuanzhang.temple.ui.status.player_food",
    statusSubmittedFood:
      "runtime.zhu_yuanzhang.temple.ui.status.submitted_food",
    statusPlayerGold: "runtime.zhu_yuanzhang.temple.ui.status.player_gold",
    statusPlayerGoldValueTemplate:
      "runtime.zhu_yuanzhang.temple.ui.status.player_gold.value",
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
};

export function resolveTempleStaticTextDefaults(
  houseModuleDefaults?: HouseModuleDefaultsRecord
): TempleStaticTextDefaults {
  const templeDefaults = readObjectRecord(houseModuleDefaults?.["temple-house"]);

  return {
    greetingTextIds:
      readStringPair(templeDefaults?.templeGreetingTextIds) ??
      TEMPLE_STATIC_TEXT_DEFAULTS.greetingTextIds,
    openTextIds:
      readStringPair(templeDefaults?.templeOpenTextIds) ??
      TEMPLE_STATIC_TEXT_DEFAULTS.openTextIds,
    restMenuTextIds:
      readStringPair(templeDefaults?.templeRestMenuTextIds) ??
      TEMPLE_STATIC_TEXT_DEFAULTS.restMenuTextIds,
    meetingIntroTextIds:
      readStringPair(templeDefaults?.templeMeetingIntroTextIds) ??
      TEMPLE_STATIC_TEXT_DEFAULTS.meetingIntroTextIds,
    leaveRefusalTextIds:
      readStringArray(templeDefaults?.templeLeaveRefusalTextIds) ??
      TEMPLE_STATIC_TEXT_DEFAULTS.leaveRefusalTextIds,
    workPlanTextIds: {
      templeHelp:
        readTempleStaticTextId(
          templeDefaults?.templeWorkPlanTextIds,
          "templeHelp"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.workPlanTextIds.templeHelp,
      begAlmsDefault:
        readTempleStaticTextId(
          templeDefaults?.templeWorkPlanTextIds,
          "begAlmsDefault"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.workPlanTextIds.begAlmsDefault,
      begAlmsLocked:
        readTempleStaticTextId(
          templeDefaults?.templeWorkPlanTextIds,
          "begAlmsLocked"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.workPlanTextIds.begAlmsLocked,
      begAlmsThirdWeek:
        readTempleStaticTextId(
          templeDefaults?.templeWorkPlanTextIds,
          "begAlmsThirdWeek"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.workPlanTextIds.begAlmsThirdWeek,
      begAlmsFourthWeek:
        readTempleStaticTextId(
          templeDefaults?.templeWorkPlanTextIds,
          "begAlmsFourthWeek"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.workPlanTextIds.begAlmsFourthWeek,
    },
    donationTextIds: {
      confirmTitle:
        readTempleStaticTextId(
          templeDefaults?.templeDonationTextIds,
          "confirmTitle"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.donationTextIds.confirmTitle,
      confirmBodyTemplate:
        readTempleStaticTextId(
          templeDefaults?.templeDonationTextIds,
          "confirmBodyTemplate"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.donationTextIds.confirmBodyTemplate,
      confirmBodyFollowup:
        readTempleStaticTextId(
          templeDefaults?.templeDonationTextIds,
          "confirmBodyFollowup"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.donationTextIds.confirmBodyFollowup,
      insufficientTitle:
        readTempleStaticTextId(
          templeDefaults?.templeDonationTextIds,
          "insufficientTitle"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.donationTextIds.insufficientTitle,
      insufficientBodyTemplate:
        readTempleStaticTextId(
          templeDefaults?.templeDonationTextIds,
          "insufficientBodyTemplate"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.donationTextIds.insufficientBodyTemplate,
      insufficientBodyFollowup:
        readTempleStaticTextId(
          templeDefaults?.templeDonationTextIds,
          "insufficientBodyFollowup"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.donationTextIds.insufficientBodyFollowup,
      resultTitle:
        readTempleStaticTextId(
          templeDefaults?.templeDonationTextIds,
          "resultTitle"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.donationTextIds.resultTitle,
      resultFameTemplate:
        readTempleStaticTextId(
          templeDefaults?.templeDonationTextIds,
          "resultFameTemplate"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.donationTextIds.resultFameTemplate,
      resultFameFollowup:
        readTempleStaticTextId(
          templeDefaults?.templeDonationTextIds,
          "resultFameFollowup"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.donationTextIds.resultFameFollowup,
      resultNormalTemplate:
        readTempleStaticTextId(
          templeDefaults?.templeDonationTextIds,
          "resultNormalTemplate"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.donationTextIds.resultNormalTemplate,
      resultNormalFollowup:
        readTempleStaticTextId(
          templeDefaults?.templeDonationTextIds,
          "resultNormalFollowup"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.donationTextIds.resultNormalFollowup,
    },
    reviewAssignmentTextIds: {
      thirdWeek:
        readStringTriple(templeDefaults?.templeReviewAssignmentTextIds, "thirdWeek") ??
        TEMPLE_STATIC_TEXT_DEFAULTS.reviewAssignmentTextIds.thirdWeek,
      fourthWeek:
        readStringTriple(templeDefaults?.templeReviewAssignmentTextIds, "fourthWeek") ??
        TEMPLE_STATIC_TEXT_DEFAULTS.reviewAssignmentTextIds.fourthWeek,
      defaultIntro:
        readTempleStaticTextId(
          templeDefaults?.templeReviewAssignmentTextIds,
          "defaultIntro"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.reviewAssignmentTextIds.defaultIntro,
      defaultAvailableTemplate:
        readTempleStaticTextId(
          templeDefaults?.templeReviewAssignmentTextIds,
          "defaultAvailableTemplate"
        ) ??
        TEMPLE_STATIC_TEXT_DEFAULTS.reviewAssignmentTextIds.defaultAvailableTemplate,
      defaultEmpty:
        readTempleStaticTextId(
          templeDefaults?.templeReviewAssignmentTextIds,
          "defaultEmpty"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.reviewAssignmentTextIds.defaultEmpty,
      defaultOutro:
        readTempleStaticTextId(
          templeDefaults?.templeReviewAssignmentTextIds,
          "defaultOutro"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.reviewAssignmentTextIds.defaultOutro,
      locked:
        readStringPairFromRecord(
          templeDefaults?.templeReviewAssignmentTextIds,
          "locked"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.reviewAssignmentTextIds.locked,
    },
    begAlmsStartOverlayTextIds: {
      defaultTitle:
        readTempleStaticTextId(
          templeDefaults?.templeBegAlmsStartOverlayTextIds,
          "defaultTitle"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.begAlmsStartOverlayTextIds.defaultTitle,
      defaultFollowup:
        readTempleStaticTextId(
          templeDefaults?.templeBegAlmsStartOverlayTextIds,
          "defaultFollowup"
        ) ??
        TEMPLE_STATIC_TEXT_DEFAULTS.begAlmsStartOverlayTextIds.defaultFollowup,
      thirdWeekTitle:
        readTempleStaticTextId(
          templeDefaults?.templeBegAlmsStartOverlayTextIds,
          "thirdWeekTitle"
        ) ??
        TEMPLE_STATIC_TEXT_DEFAULTS.begAlmsStartOverlayTextIds.thirdWeekTitle,
      thirdWeekLines:
        readStringPairFromRecord(
          templeDefaults?.templeBegAlmsStartOverlayTextIds,
          "thirdWeekLines"
        ) ??
        TEMPLE_STATIC_TEXT_DEFAULTS.begAlmsStartOverlayTextIds.thirdWeekLines,
      fourthWeekTitle:
        readTempleStaticTextId(
          templeDefaults?.templeBegAlmsStartOverlayTextIds,
          "fourthWeekTitle"
        ) ??
        TEMPLE_STATIC_TEXT_DEFAULTS.begAlmsStartOverlayTextIds.fourthWeekTitle,
      fourthWeekLines:
        readStringPairFromRecord(
          templeDefaults?.templeBegAlmsStartOverlayTextIds,
          "fourthWeekLines"
        ) ??
        TEMPLE_STATIC_TEXT_DEFAULTS.begAlmsStartOverlayTextIds.fourthWeekLines,
    },
    statusCardTextIds: {
      eyebrow:
        readTempleStaticTextId(
          templeDefaults?.templeStatusCardTextIds,
          "eyebrow"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.statusCardTextIds.eyebrow,
      titleMonk:
        readTempleStaticTextId(
          templeDefaults?.templeStatusCardTextIds,
          "titleMonk"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.statusCardTextIds.titleMonk,
      titleDaily:
        readTempleStaticTextId(
          templeDefaults?.templeStatusCardTextIds,
          "titleDaily"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.statusCardTextIds.titleDaily,
      subtitleMeeting:
        readTempleStaticTextId(
          templeDefaults?.templeStatusCardTextIds,
          "subtitleMeeting"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.statusCardTextIds.subtitleMeeting,
      subtitleDaily:
        readTempleStaticTextId(
          templeDefaults?.templeStatusCardTextIds,
          "subtitleDaily"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.statusCardTextIds.subtitleDaily,
      metricAbbot:
        readTempleStaticTextId(
          templeDefaults?.templeStatusCardTextIds,
          "metricAbbot"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.statusCardTextIds.metricAbbot,
    },
    restSummaryTextIds: {
      interruptedCouncilTitle:
        readTempleStaticTextId(
          templeDefaults?.templeRestSummaryTextIds,
          "interruptedCouncilTitle"
        ) ??
        TEMPLE_STATIC_TEXT_DEFAULTS.restSummaryTextIds.interruptedCouncilTitle,
      interruptedCouncilBody:
        readTempleStaticTextId(
          templeDefaults?.templeRestSummaryTextIds,
          "interruptedCouncilBody"
        ) ??
        TEMPLE_STATIC_TEXT_DEFAULTS.restSummaryTextIds.interruptedCouncilBody,
      none:
        readTempleStaticTextId(
          templeDefaults?.templeRestSummaryTextIds,
          "none"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.restSummaryTextIds.none,
      days:
        readTempleStaticTextId(
          templeDefaults?.templeRestSummaryTextIds,
          "days"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.restSummaryTextIds.days,
      current:
        readTempleStaticTextId(
          templeDefaults?.templeRestSummaryTextIds,
          "current"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.restSummaryTextIds.current,
      normal:
        readTempleStaticTextId(
          templeDefaults?.templeRestSummaryTextIds,
          "normal"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.restSummaryTextIds.normal,
      autoAdvanceTitleTemplate:
        readTempleStaticTextId(
          templeDefaults?.templeRestSummaryTextIds,
          "autoAdvanceTitleTemplate"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.restSummaryTextIds.autoAdvanceTitleTemplate,
    },
    restDaysOverlayTextIds: {
      title:
        readTempleStaticTextId(
          templeDefaults?.templeRestDaysOverlayTextIds,
          "title"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.restDaysOverlayTextIds.title,
      body:
        readTempleStaticTextId(
          templeDefaults?.templeRestDaysOverlayTextIds,
          "body"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.restDaysOverlayTextIds.body,
      confirmLabel:
        readTempleStaticTextId(
          templeDefaults?.templeRestDaysOverlayTextIds,
          "confirmLabel"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.restDaysOverlayTextIds.confirmLabel,
      cancelLabel:
        readTempleStaticTextId(
          templeDefaults?.templeRestDaysOverlayTextIds,
          "cancelLabel"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.restDaysOverlayTextIds.cancelLabel,
    },
    lateReviewTextIds: {
      choiceLines:
        readStringTriple(templeDefaults?.templeLateReviewTextIds, "choiceLines") ??
        TEMPLE_STATIC_TEXT_DEFAULTS.lateReviewTextIds.choiceLines,
      heavyLines:
        readStringPairFromRecord(
          templeDefaults?.templeLateReviewTextIds,
          "heavyLines"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.lateReviewTextIds.heavyLines,
      lightLines:
        readStringPairFromRecord(
          templeDefaults?.templeLateReviewTextIds,
          "lightLines"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.lateReviewTextIds.lightLines,
    },
    qteOverlayTextIds: {
      title:
        readTempleStaticTextId(
          templeDefaults?.templeQteOverlayTextIds,
          "title"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.qteOverlayTextIds.title,
      helperLines:
        readStringPairFromRecord(
          templeDefaults?.templeQteOverlayTextIds,
          "helperLines"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.qteOverlayTextIds.helperLines,
    },
    beggingFoodTextIds: {
      emptyTitle:
        readTempleStaticTextId(
          templeDefaults?.templeBeggingFoodTextIds,
          "emptyTitle"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.beggingFoodTextIds.emptyTitle,
      emptyLines:
        readStringPairFromRecord(
          templeDefaults?.templeBeggingFoodTextIds,
          "emptyLines"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.beggingFoodTextIds.emptyLines,
      submitTitle:
        readTempleStaticTextId(
          templeDefaults?.templeBeggingFoodTextIds,
          "submitTitle"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.beggingFoodTextIds.submitTitle,
      submitLines:
        readStringPairFromRecord(
          templeDefaults?.templeBeggingFoodTextIds,
          "submitLines"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.beggingFoodTextIds.submitLines,
      quantityLabel:
        readTempleStaticTextId(
          templeDefaults?.templeBeggingFoodTextIds,
          "quantityLabel"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.beggingFoodTextIds.quantityLabel,
      confirmLabel:
        readTempleStaticTextId(
          templeDefaults?.templeBeggingFoodTextIds,
          "confirmLabel"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.beggingFoodTextIds.confirmLabel,
      cancelLabel:
        readTempleStaticTextId(
          templeDefaults?.templeBeggingFoodTextIds,
          "cancelLabel"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.beggingFoodTextIds.cancelLabel,
      submittedMissionLabel:
        readTempleStaticTextId(
          templeDefaults?.templeBeggingFoodTextIds,
          "submittedMissionLabel"
        ) ??
        TEMPLE_STATIC_TEXT_DEFAULTS.beggingFoodTextIds.submittedMissionLabel,
    },
    uiTextIds: {
      activityConfirmLabel:
        readTempleStaticTextId(
          templeDefaults?.templeUiTextIds,
          "activityConfirmLabel"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.activityConfirmLabel,
      activityCancelLabel:
        readTempleStaticTextId(
          templeDefaults?.templeUiTextIds,
          "activityCancelLabel"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.activityCancelLabel,
      activityRelatedAbilityPending:
        readTempleStaticTextId(
          templeDefaults?.templeUiTextIds,
          "activityRelatedAbilityPending"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.activityRelatedAbilityPending,
      activityQuickCompleteLabel:
        readTempleStaticTextId(
          templeDefaults?.templeUiTextIds,
          "activityQuickCompleteLabel"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.activityQuickCompleteLabel,
      alertConfirmLabel:
        readTempleStaticTextId(templeDefaults?.templeUiTextIds, "alertConfirmLabel") ??
        TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.alertConfirmLabel,
      donateConfirmLabelTemplate:
        readTempleStaticTextId(
          templeDefaults?.templeUiTextIds,
          "donateConfirmLabelTemplate"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.donateConfirmLabelTemplate,
      donateCancelLabel:
        readTempleStaticTextId(templeDefaults?.templeUiTextIds, "donateCancelLabel") ??
        TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.donateCancelLabel,
      resultConfirmLabel:
        readTempleStaticTextId(templeDefaults?.templeUiTextIds, "resultConfirmLabel") ??
        TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.resultConfirmLabel,
      leaveRefusalAdvanceHint:
        readTempleStaticTextId(
          templeDefaults?.templeUiTextIds,
          "leaveRefusalAdvanceHint"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.leaveRefusalAdvanceHint,
      dialogueAdvanceHint:
        readTempleStaticTextId(templeDefaults?.templeUiTextIds, "dialogueAdvanceHint") ??
        TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.dialogueAdvanceHint,
      reviewAssignmentDefaultTitle:
        readTempleStaticTextId(
          templeDefaults?.templeUiTextIds,
          "reviewAssignmentDefaultTitle"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.reviewAssignmentDefaultTitle,
      reviewPolicyOverallGoal:
        readTempleStaticTextId(
          templeDefaults?.templeUiTextIds,
          "reviewPolicyOverallGoal"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.reviewPolicyOverallGoal,
      reviewAssignmentOverlayTitle:
        readTempleStaticTextId(
          templeDefaults?.templeUiTextIds,
          "reviewAssignmentOverlayTitle"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.reviewAssignmentOverlayTitle,
      reviewAssignmentOverlayConfirmLabel:
        readTempleStaticTextId(
          templeDefaults?.templeUiTextIds,
          "reviewAssignmentOverlayConfirmLabel"
        ) ??
        TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.reviewAssignmentOverlayConfirmLabel,
      reviewPolicyOverlayTitle:
        readTempleStaticTextId(
          templeDefaults?.templeUiTextIds,
          "reviewPolicyOverlayTitle"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.reviewPolicyOverlayTitle,
      reviewPolicyOverlayCloseLabel:
        readTempleStaticTextId(
          templeDefaults?.templeUiTextIds,
          "reviewPolicyOverlayCloseLabel"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.reviewPolicyOverlayCloseLabel,
      reviewRewardTitle:
        readTempleStaticTextId(templeDefaults?.templeUiTextIds, "reviewRewardTitle") ??
        TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.reviewRewardTitle,
      reviewPersonnelNarration:
        readTempleStaticTextId(
          templeDefaults?.templeUiTextIds,
          "reviewPersonnelNarration"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.reviewPersonnelNarration,
      reviewPersonnelOverlayTitle:
        readTempleStaticTextId(
          templeDefaults?.templeUiTextIds,
          "reviewPersonnelOverlayTitle"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.reviewPersonnelOverlayTitle,
      reviewAssignmentSettledLine:
        readTempleStaticTextId(
          templeDefaults?.templeUiTextIds,
          "reviewAssignmentSettledLine"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.reviewAssignmentSettledLine,
      reviewProgressLead:
        readTempleStaticTextId(templeDefaults?.templeUiTextIds, "reviewProgressLead") ??
        TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.reviewProgressLead,
      reviewPraiseLead:
        readTempleStaticTextId(templeDefaults?.templeUiTextIds, "reviewPraiseLead") ??
        TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.reviewPraiseLead,
      reviewPolicyLead:
        readTempleStaticTextId(templeDefaults?.templeUiTextIds, "reviewPolicyLead") ??
        TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.reviewPolicyLead,
      reviewAdvicePrompt:
        readTempleStaticTextId(templeDefaults?.templeUiTextIds, "reviewAdvicePrompt") ??
        TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.reviewAdvicePrompt,
      reviewAdviceAcknowledge:
        readTempleStaticTextId(
          templeDefaults?.templeUiTextIds,
          "reviewAdviceAcknowledge"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.reviewAdviceAcknowledge,
      rootActionRest:
        readTempleStaticTextId(templeDefaults?.templeUiTextIds, "rootActionRest") ??
        TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.rootActionRest,
      rootActionDonate:
        readTempleStaticTextId(templeDefaults?.templeUiTextIds, "rootActionDonate") ??
        TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.rootActionDonate,
      rootActionDismiss:
        readTempleStaticTextId(templeDefaults?.templeUiTextIds, "rootActionDismiss") ??
        TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.rootActionDismiss,
      rootActionWorkPending:
        readTempleStaticTextId(
          templeDefaults?.templeUiTextIds,
          "rootActionWorkPending"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.rootActionWorkPending,
      rootActionWorkReady:
        readTempleStaticTextId(
          templeDefaults?.templeUiTextIds,
          "rootActionWorkReady"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.rootActionWorkReady,
      rootActionSubmitFoodTemplate:
        readTempleStaticTextId(
          templeDefaults?.templeUiTextIds,
          "rootActionSubmitFoodTemplate"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.rootActionSubmitFoodTemplate,
      submitFoodActionLabel:
        readTempleStaticTextId(templeDefaults?.templeUiTextIds, "submitFoodActionLabel") ??
        TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.submitFoodActionLabel,
      restMenuOneDay:
        readTempleStaticTextId(templeDefaults?.templeUiTextIds, "restMenuOneDay") ??
        TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.restMenuOneDay,
      restMenuCustomDays:
        readTempleStaticTextId(templeDefaults?.templeUiTextIds, "restMenuCustomDays") ??
        TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.restMenuCustomDays,
      restMenuUntilCouncil:
        readTempleStaticTextId(
          templeDefaults?.templeUiTextIds,
          "restMenuUntilCouncil"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.restMenuUntilCouncil,
      restMenuUntilRecovered:
        readTempleStaticTextId(
          templeDefaults?.templeUiTextIds,
          "restMenuUntilRecovered"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.restMenuUntilRecovered,
      menuBack:
        readTempleStaticTextId(templeDefaults?.templeUiTextIds, "menuBack") ??
        TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.menuBack,
      workMenuUnavailablePending:
        readTempleStaticTextId(
          templeDefaults?.templeUiTextIds,
          "workMenuUnavailablePending"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.workMenuUnavailablePending,
      workMenuUnavailableIdle:
        readTempleStaticTextId(
          templeDefaults?.templeUiTextIds,
          "workMenuUnavailableIdle"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.workMenuUnavailableIdle,
      actionPanelTitleMeetingMonk:
        readTempleStaticTextId(
          templeDefaults?.templeUiTextIds,
          "actionPanelTitleMeetingMonk"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.actionPanelTitleMeetingMonk,
      actionPanelTitleMeetingDaily:
        readTempleStaticTextId(
          templeDefaults?.templeUiTextIds,
          "actionPanelTitleMeetingDaily"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.actionPanelTitleMeetingDaily,
      actionPanelTitleAdvice:
        readTempleStaticTextId(
          templeDefaults?.templeUiTextIds,
          "actionPanelTitleAdvice"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.actionPanelTitleAdvice,
      adviceActionGive:
        readTempleStaticTextId(templeDefaults?.templeUiTextIds, "adviceActionGive") ??
        TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.adviceActionGive,
      adviceActionSilent:
        readTempleStaticTextId(
          templeDefaults?.templeUiTextIds,
          "adviceActionSilent"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.adviceActionSilent,
      actionPanelTitleRest:
        readTempleStaticTextId(
          templeDefaults?.templeUiTextIds,
          "actionPanelTitleRest"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.actionPanelTitleRest,
      actionPanelTitleWork:
        readTempleStaticTextId(
          templeDefaults?.templeUiTextIds,
          "actionPanelTitleWork"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.actionPanelTitleWork,
      actionPanelTitleTempleDaily:
        readTempleStaticTextId(
          templeDefaults?.templeUiTextIds,
          "actionPanelTitleTempleDaily"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.actionPanelTitleTempleDaily,
      statusCountdown:
        readTempleStaticTextId(templeDefaults?.templeUiTextIds, "statusCountdown") ??
        TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.statusCountdown,
      statusCountdownValueTemplate:
        readTempleStaticTextId(
          templeDefaults?.templeUiTextIds,
          "statusCountdownValueTemplate"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.statusCountdownValueTemplate,
      statusContribution:
        readTempleStaticTextId(templeDefaults?.templeUiTextIds, "statusContribution") ??
        TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.statusContribution,
      statusContributionValueTemplate:
        readTempleStaticTextId(
          templeDefaults?.templeUiTextIds,
          "statusContributionValueTemplate"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.statusContributionValueTemplate,
      statusWeek:
        readTempleStaticTextId(templeDefaults?.templeUiTextIds, "statusWeek") ??
        TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.statusWeek,
      statusWeekValueTemplate:
        readTempleStaticTextId(
          templeDefaults?.templeUiTextIds,
          "statusWeekValueTemplate"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.statusWeekValueTemplate,
      statusDonationTotal:
        readTempleStaticTextId(
          templeDefaults?.templeUiTextIds,
          "statusDonationTotal"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.statusDonationTotal,
      statusDonationTotalValueTemplate:
        readTempleStaticTextId(
          templeDefaults?.templeUiTextIds,
          "statusDonationTotalValueTemplate"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.statusDonationTotalValueTemplate,
      statusCurrentTask:
        readTempleStaticTextId(
          templeDefaults?.templeUiTextIds,
          "statusCurrentTask"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.statusCurrentTask,
      statusCurrentTaskNone:
        readTempleStaticTextId(
          templeDefaults?.templeUiTextIds,
          "statusCurrentTaskNone"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.statusCurrentTaskNone,
      statusPlayerStamina:
        readTempleStaticTextId(
          templeDefaults?.templeUiTextIds,
          "statusPlayerStamina"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.statusPlayerStamina,
      statusPlayerFood:
        readTempleStaticTextId(templeDefaults?.templeUiTextIds, "statusPlayerFood") ??
        TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.statusPlayerFood,
      statusSubmittedFood:
        readTempleStaticTextId(
          templeDefaults?.templeUiTextIds,
          "statusSubmittedFood"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.statusSubmittedFood,
      statusPlayerGold:
        readTempleStaticTextId(templeDefaults?.templeUiTextIds, "statusPlayerGold") ??
        TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.statusPlayerGold,
      statusPlayerGoldValueTemplate:
        readTempleStaticTextId(
          templeDefaults?.templeUiTextIds,
          "statusPlayerGoldValueTemplate"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.statusPlayerGoldValueTemplate,
      leaveActionLabel:
        readTempleStaticTextId(templeDefaults?.templeUiTextIds, "leaveActionLabel") ??
        TEMPLE_STATIC_TEXT_DEFAULTS.uiTextIds.leaveActionLabel,
    },
    alertTextIds: {
      lowStaminaTitle:
        readTempleStaticTextId(templeDefaults?.templeAlertTextIds, "lowStaminaTitle") ??
        TEMPLE_STATIC_TEXT_DEFAULTS.alertTextIds.lowStaminaTitle,
      lowStaminaBody:
        readTempleStaticTextId(templeDefaults?.templeAlertTextIds, "lowStaminaBody") ??
        TEMPLE_STATIC_TEXT_DEFAULTS.alertTextIds.lowStaminaBody,
      lowStaminaFollowup:
        readTempleStaticTextId(
          templeDefaults?.templeAlertTextIds,
          "lowStaminaFollowup"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.alertTextIds.lowStaminaFollowup,
      insufficientTimeTitle:
        readTempleStaticTextId(
          templeDefaults?.templeAlertTextIds,
          "insufficientTimeTitle"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.alertTextIds.insufficientTimeTitle,
      insufficientTimeReached:
        readTempleStaticTextId(
          templeDefaults?.templeAlertTextIds,
          "insufficientTimeReached"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.alertTextIds.insufficientTimeReached,
      insufficientTimeRemaining:
        readTempleStaticTextId(
          templeDefaults?.templeAlertTextIds,
          "insufficientTimeRemaining"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.alertTextIds.insufficientTimeRemaining,
      insufficientTimeFollowup:
        readTempleStaticTextId(
          templeDefaults?.templeAlertTextIds,
          "insufficientTimeFollowup"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.alertTextIds.insufficientTimeFollowup,
      invalidRestDaysTitle:
        readTempleStaticTextId(
          templeDefaults?.templeAlertTextIds,
          "invalidRestDaysTitle"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.alertTextIds.invalidRestDaysTitle,
      invalidRestDaysBody:
        readTempleStaticTextId(
          templeDefaults?.templeAlertTextIds,
          "invalidRestDaysBody"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.alertTextIds.invalidRestDaysBody,
      insufficientRankTitle:
        readTempleStaticTextId(
          templeDefaults?.templeAlertTextIds,
          "insufficientRankTitle"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.alertTextIds.insufficientRankTitle,
      insufficientRankLines:
        readStringPairFromRecord(
          templeDefaults?.templeAlertTextIds,
          "insufficientRankLines"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.alertTextIds.insufficientRankLines,
      noBestScoreTitle:
        readTempleStaticTextId(
          templeDefaults?.templeAlertTextIds,
          "noBestScoreTitle"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.alertTextIds.noBestScoreTitle,
      noBestScoreBody:
        readTempleStaticTextId(
          templeDefaults?.templeAlertTextIds,
          "noBestScoreBody"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.alertTextIds.noBestScoreBody,
    },
    workResultTextIds: {
      lazyGrade:
        readTempleStaticTextId(templeDefaults?.templeWorkResultTextIds, "lazyGrade") ??
        TEMPLE_STATIC_TEXT_DEFAULTS.workResultTextIds.lazyGrade,
      lazyLines:
        readStringPairFromRecord(
          templeDefaults?.templeWorkResultTextIds,
          "lazyLines"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.workResultTextIds.lazyLines,
      passGrade:
        readTempleStaticTextId(templeDefaults?.templeWorkResultTextIds, "passGrade") ??
        TEMPLE_STATIC_TEXT_DEFAULTS.workResultTextIds.passGrade,
      passLines:
        readStringPairFromRecord(
          templeDefaults?.templeWorkResultTextIds,
          "passLines"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.workResultTextIds.passLines,
      diligentGrade:
        readTempleStaticTextId(
          templeDefaults?.templeWorkResultTextIds,
          "diligentGrade"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.workResultTextIds.diligentGrade,
      diligentLines:
        readStringPairFromRecord(
          templeDefaults?.templeWorkResultTextIds,
          "diligentLines"
        ) ?? TEMPLE_STATIC_TEXT_DEFAULTS.workResultTextIds.diligentLines,
      unlockTitle:
        readTempleStaticTextId(templeDefaults?.templeWorkResultTextIds, "unlockTitle") ??
        TEMPLE_STATIC_TEXT_DEFAULTS.workResultTextIds.unlockTitle,
      normalTitle:
        readTempleStaticTextId(templeDefaults?.templeWorkResultTextIds, "normalTitle") ??
        TEMPLE_STATIC_TEXT_DEFAULTS.workResultTextIds.normalTitle,
    },
  };
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

function readStringArray(value: unknown): string[] | null {
  if (!Array.isArray(value) || value.length === 0) {
    return null;
  }
  if (!value.every((entry) => typeof entry === "string")) {
    return null;
  }

  return value as string[];
}

function readTempleStaticTextId(
  value: unknown,
  key: string
): string | null {
  const record = readObjectRecord(value);
  return typeof record?.[key] === "string" ? (record[key] as string) : null;
}

function readStringPairFromRecord(
  value: unknown,
  key: string
): [string, string] | null {
  const record = readObjectRecord(value);
  return readStringPair(record?.[key]);
}

function readStringTriple(
  value: unknown,
  key: string
): [string, string, string] | null {
  const record = readObjectRecord(value);
  const candidate = record?.[key];
  if (!Array.isArray(candidate) || candidate.length !== 3) {
    return null;
  }
  if (!candidate.every((entry) => typeof entry === "string")) {
    return null;
  }
  const [first, second, third] = candidate;
  return [first as string, second as string, third as string];
}
