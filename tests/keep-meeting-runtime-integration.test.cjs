const assert = require("node:assert/strict");
const test = require("node:test");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  keepHouseHouseModule,
} = require("../.test-dist/application/house-modules/keep-house/keep-house-house-module.js");
const {
  KEEP_HOUSE_VARIABLE_KEYS,
} = require("../.test-dist/domain/keep-house.js");

function createKeepHouseDefinition() {
  return {
    id: "house.kulan.keep",
    cityId: "city.kulan",
    name: "帅府",
    type: "castle",
    moduleId: "keep-house",
    characterIds: [
      "char.kulan_lord",
      "char.kulan_xu_da",
      "char.kulan_tang_he",
    ],
    defaultCharacterId: "char.kulan_lord",
  };
}

function createKeepCharacters() {
  return [
    {
      id: "char.player",
      name: "朱元璋",
      birthYear: 1540,
      deathYear: null,
      age: 27,
      cityId: "city.kulan",
      portraitId: "char.player.portrait",
      clanId: "clan.red-turban",
      stats: {
        leadership: 10,
        martial: 10,
        intelligence: 10,
        politics: 10,
        charm: 10,
        fame: 0,
        gold: 120,
      },
      stamina: 100,
      availableFunctions: [],
    },
    {
      id: "char.kulan_lord",
      name: "郭子兴",
      birthYear: 1520,
      deathYear: null,
      age: 47,
      cityId: "city.kulan",
      portraitId: "char.kulan_lord.portrait",
      clanId: "clan.red-turban",
      stats: {
        leadership: 10,
        martial: 10,
        intelligence: 10,
        politics: 10,
        charm: 10,
        fame: 0,
        gold: 0,
      },
      stamina: 100,
      availableFunctions: [],
      houseId: "house.kulan.keep",
      title: "主帅",
    },
    {
      id: "char.kulan_xu_da",
      name: "徐达",
      birthYear: 1530,
      deathYear: null,
      age: 37,
      cityId: "city.kulan",
      portraitId: "char.kulan_xu_da.portrait",
      clanId: "clan.red-turban",
      stats: {
        leadership: 10,
        martial: 10,
        intelligence: 10,
        politics: 10,
        charm: 10,
        fame: 0,
        gold: 0,
      },
      stamina: 100,
      availableFunctions: [],
      houseId: "house.kulan.keep",
      title: "将领",
    },
    {
      id: "char.kulan_tang_he",
      name: "汤和",
      birthYear: 1530,
      deathYear: null,
      age: 37,
      cityId: "city.kulan",
      portraitId: "char.kulan_tang_he.portrait",
      clanId: "clan.red-turban",
      stats: {
        leadership: 10,
        martial: 10,
        intelligence: 10,
        politics: 10,
        charm: 10,
        fame: 0,
        gold: 0,
      },
      stamina: 100,
      availableFunctions: [],
      houseId: "house.kulan.keep",
      title: "将领",
    },
  ];
}

function createKeepReviewDueState() {
  const baseState = createInitialState({
    currentMapId: "map.test",
    currentCityId: "city.kulan",
    currentHouseId: "house.kulan.keep",
    playerCharacterId: "char.player",
    chapterId: "chapter.test",
    year: 1567,
    month: 1,
    day: 1,
    pinnedCharacterId: "char.player",
    reviewDateText: "test",
    mainHouseMissionText: "test",
    currentView: "house",
  });

  return {
    ...baseState,
    runtime: {
      ...baseState.runtime,
      variables: {
        ...baseState.runtime.variables,
        [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 0,
      },
    },
  };
}

function createKeepMeetingContent() {
  return {
    meetingDefinitionsById: {
      "meeting.keep.review": {
        id: "meeting.keep.review",
        hostScope: {
          family: "building",
          templateId: "house.template.keep",
        },
        initialStageId: "intro",
        stageIds: ["intro", "assignment-table", "advice"],
        stagesById: {
          intro: {
            id: "intro",
            type: "dialogue",
            textLineIds: ["自定义帅府评议开场一。", "自定义帅府评议开场二。"],
            nextStageId: "assignment-table",
          },
          "assignment-table": {
            id: "assignment-table",
            type: "assignment-table",
            panelId: "panel.keep.review.assignment",
            nextStageId: "advice",
          },
          advice: {
            id: "advice",
            type: "choice",
            choiceSetId: "choices.keep.review.advice",
          },
        },
        completion: {
          type: "return-to-host",
        },
      },
    },
    meetingBindings: [
      {
        id: "binding.keep.review",
        meetingId: "meeting.keep.review",
        owner: {
          family: "building",
          id: "house.kulan.keep",
        },
        trigger: {
          action: "building-container-item-action",
          itemId: "review",
        },
      },
    ],
    meetingPanelsById: {
      "panel.keep.review.assignment": {
        id: "panel.keep.review.assignment",
        title: "委任",
        type: "assignment-table",
        sections: [],
      },
    },
    meetingChoiceSetsById: {
      "choices.keep.review.advice": {
        id: "choices.keep.review.advice",
        title: "进言",
        choices: [
          {
            id: "keep-review-give-advice",
            label: "发表意见",
          },
        ],
      },
    },
    meetingActionSetsById: {},
  };
}

function createKeepAssignmentMeetingContent() {
  return {
    meetingDefinitionsById: {
      "meeting.keep.review": {
        id: "meeting.keep.review",
        hostScope: {
          family: "building",
          templateId: "house.template.keep",
        },
        initialStageId: "assign-task",
        stageIds: ["assign-task"],
        stagesById: {
          "assign-task": {
            id: "assign-task",
            type: "choice",
            choiceSetId: "choices.keep.review.assignment",
          },
        },
        completion: {
          type: "return-to-host",
        },
      },
    },
    meetingBindings: [
      {
        id: "binding.keep.review",
        meetingId: "meeting.keep.review",
        owner: {
          family: "building",
          id: "house.kulan.keep",
        },
        trigger: {
          action: "building-container-item-action",
          itemId: "review",
        },
      },
    ],
    meetingPanelsById: {},
    meetingChoiceSetsById: {
      "choices.keep.review.assignment": {
        id: "choices.keep.review.assignment",
        title: "委任",
        choices: [
          {
            id: "assign-keep-task:grain-procurement",
            label: "采办军粮",
          },
        ],
      },
    },
    meetingActionSetsById: {},
  };
}

function createKeepSummaryMeetingContent() {
  return {
    meetingDefinitionsById: {
      "meeting.keep.review": {
        id: "meeting.keep.review",
        hostScope: {
          family: "building",
          templateId: "house.template.keep",
        },
        initialStageId: "advice",
        stageIds: ["advice", "assign-task", "assigned", "complete"],
        stagesById: {
          advice: {
            id: "advice",
            type: "choice",
            choiceSetId: "choices.keep.review.advice",
          },
          "assign-task": {
            id: "assign-task",
            type: "choice",
            choiceSetId: "choices.keep.review.assignment",
          },
          assigned: {
            id: "assigned",
            type: "summary",
            panelId: "panel.keep.review.assigned",
            nextStageId: "complete",
          },
          complete: {
            id: "complete",
            type: "action",
            actionSetId: "actions.keep.review.complete",
          },
        },
        completion: {
          type: "return-to-host",
        },
      },
    },
    meetingBindings: [
      {
        id: "binding.keep.review",
        meetingId: "meeting.keep.review",
        owner: {
          family: "building",
          id: "house.kulan.keep",
        },
        trigger: {
          action: "building-container-item-action",
          itemId: "review",
        },
      },
    ],
    meetingPanelsById: {
      "panel.keep.review.assigned": {
        id: "panel.keep.review.assigned",
        title: "军令下达",
        type: "summary",
        sections: [
          {
            title: "军令",
            value: "本次评定结束，下一次评定倒计时已重置为 60 天。",
          },
        ],
      },
    },
    meetingChoiceSetsById: {
      "choices.keep.review.advice": {
        id: "choices.keep.review.advice",
        title: "进言",
        choices: [
          {
            id: "keep-review-give-advice",
            label: "发表意见",
            nextStageId: "assign-task",
          },
        ],
      },
      "choices.keep.review.assignment": {
        id: "choices.keep.review.assignment",
        title: "委任",
        choices: [
          {
            id: "choice.keep.review.summary",
            label: "征粮",
            nextStageId: "assigned",
          },
        ],
      },
    },
    meetingActionSetsById: {
      "actions.keep.review.complete": {
        id: "actions.keep.review.complete",
        actions: [
          {
            id: "action.keep.review.complete.variable.countdown",
            type: "set-variable",
            variableId: "var.keep.review_countdown",
            value: 60,
          },
        ],
      },
    },
  };
}

test("keep review entry should launch the shared meeting session owner when meeting content is available", () => {
  const meetingContent = createKeepMeetingContent();
  const result = keepHouseHouseModule.enter({
    gameState: createKeepReviewDueState(),
    characterDefinitions: createKeepCharacters(),
    houseDefinition: createKeepHouseDefinition(),
    playerCharacterId: "char.player",
    sharedSessionState: null,
    meetingDefinitionsById: meetingContent.meetingDefinitionsById,
    meetingBindings: meetingContent.meetingBindings,
    meetingPanelsById: meetingContent.meetingPanelsById,
    meetingChoiceSetsById: meetingContent.meetingChoiceSetsById,
    meetingActionSetsById: meetingContent.meetingActionSetsById,
  });

  assert.equal(
    result.sharedSessionState?.hostedMeeting?.meetingId,
    "meeting.keep.review"
  );
});

test("keep review shared meeting should drive the existing keep shell view model", () => {
  const meetingContent = createKeepMeetingContent();
  const entered = keepHouseHouseModule.enter({
    gameState: createKeepReviewDueState(),
    characterDefinitions: createKeepCharacters(),
    houseDefinition: createKeepHouseDefinition(),
    playerCharacterId: "char.player",
    sharedSessionState: null,
    meetingDefinitionsById: meetingContent.meetingDefinitionsById,
    meetingBindings: meetingContent.meetingBindings,
    meetingPanelsById: meetingContent.meetingPanelsById,
    meetingChoiceSetsById: meetingContent.meetingChoiceSetsById,
    meetingActionSetsById: meetingContent.meetingActionSetsById,
  });

  const viewModel = keepHouseHouseModule.selectViewModel({
    gameState: entered.gameState,
    characterDefinitions: entered.characterDefinitions,
    houseDefinition: createKeepHouseDefinition(),
    playerCharacterId: "char.player",
    sessionState: entered.sessionState,
    sharedSessionState: entered.sharedSessionState,
    meetingDefinitionsById: meetingContent.meetingDefinitionsById,
    meetingBindings: meetingContent.meetingBindings,
    meetingPanelsById: meetingContent.meetingPanelsById,
    meetingChoiceSetsById: meetingContent.meetingChoiceSetsById,
    meetingActionSetsById: meetingContent.meetingActionSetsById,
  });

  assert.deepEqual(viewModel.dialogue?.textLines, [
    "自定义帅府评议开场一。",
    "自定义帅府评议开场二。",
  ]);
  assert.equal(viewModel.dialogue?.advanceActionId, "advance-meeting-stage");
});

test("keep review shared meeting should not keep a local keep-review session owner active", () => {
  const meetingContent = createKeepMeetingContent();
  const entered = keepHouseHouseModule.enter({
    gameState: createKeepReviewDueState(),
    characterDefinitions: createKeepCharacters(),
    houseDefinition: createKeepHouseDefinition(),
    playerCharacterId: "char.player",
    sharedSessionState: null,
    meetingDefinitionsById: meetingContent.meetingDefinitionsById,
    meetingBindings: meetingContent.meetingBindings,
    meetingPanelsById: meetingContent.meetingPanelsById,
    meetingChoiceSetsById: meetingContent.meetingChoiceSetsById,
    meetingActionSetsById: meetingContent.meetingActionSetsById,
  });

  assert.equal(entered.sharedSessionState?.hostedMeeting?.meetingId, "meeting.keep.review");
  assert.equal(entered.sessionState?.mode, "audience");
  assert.equal(entered.sessionState?.meetingStage, "finished");

  const ignoredLegacyAdvance = keepHouseHouseModule.dispatch({
    gameState: entered.gameState,
    characterDefinitions: entered.characterDefinitions,
    houseDefinition: createKeepHouseDefinition(),
    playerCharacterId: "char.player",
    sessionState: entered.sessionState,
    sharedSessionState: entered.sharedSessionState,
    meetingDefinitionsById: meetingContent.meetingDefinitionsById,
    meetingBindings: meetingContent.meetingBindings,
    meetingPanelsById: meetingContent.meetingPanelsById,
    meetingChoiceSetsById: meetingContent.meetingChoiceSetsById,
    meetingActionSetsById: meetingContent.meetingActionSetsById,
    request: {
      type: "action",
      actionId: "advance-keep-dialogue",
    },
  });

  assert.equal(
    ignoredLegacyAdvance.sharedSessionState?.hostedMeeting?.sessionState.currentStageId,
    "intro"
  );
  assert.equal(ignoredLegacyAdvance.sessionState?.dialoguePhase, "greeting");
});

test("keep review shared meeting should advance through keep dispatch actions", () => {
  const meetingContent = createKeepMeetingContent();
  const entered = keepHouseHouseModule.enter({
    gameState: createKeepReviewDueState(),
    characterDefinitions: createKeepCharacters(),
    houseDefinition: createKeepHouseDefinition(),
    playerCharacterId: "char.player",
    sharedSessionState: null,
    meetingDefinitionsById: meetingContent.meetingDefinitionsById,
    meetingBindings: meetingContent.meetingBindings,
    meetingPanelsById: meetingContent.meetingPanelsById,
    meetingChoiceSetsById: meetingContent.meetingChoiceSetsById,
    meetingActionSetsById: meetingContent.meetingActionSetsById,
  });

  const advanced = keepHouseHouseModule.dispatch({
    gameState: entered.gameState,
    characterDefinitions: entered.characterDefinitions,
    houseDefinition: createKeepHouseDefinition(),
    playerCharacterId: "char.player",
    sessionState: entered.sessionState,
    sharedSessionState: entered.sharedSessionState,
    meetingDefinitionsById: meetingContent.meetingDefinitionsById,
    meetingBindings: meetingContent.meetingBindings,
    meetingPanelsById: meetingContent.meetingPanelsById,
    meetingChoiceSetsById: meetingContent.meetingChoiceSetsById,
    meetingActionSetsById: meetingContent.meetingActionSetsById,
    request: {
      type: "action",
      actionId: "advance-meeting-stage",
    },
  });

  assert.equal(
    advanced.sharedSessionState?.hostedMeeting?.sessionState.currentStageId,
    "assignment-table"
  );
});

test("keep review summary stage should stay on hosted meeting UI instead of falling back to legacy intro dialogue", () => {
  const meetingContent = createKeepSummaryMeetingContent();
  const entered = keepHouseHouseModule.enter({
    gameState: createKeepReviewDueState(),
    characterDefinitions: createKeepCharacters(),
    houseDefinition: createKeepHouseDefinition(),
    playerCharacterId: "char.player",
    sharedSessionState: null,
    meetingDefinitionsById: meetingContent.meetingDefinitionsById,
    meetingBindings: meetingContent.meetingBindings,
    meetingPanelsById: meetingContent.meetingPanelsById,
    meetingChoiceSetsById: meetingContent.meetingChoiceSetsById,
    meetingActionSetsById: meetingContent.meetingActionSetsById,
  });

  const afterAdvice = keepHouseHouseModule.dispatch({
    gameState: entered.gameState,
    characterDefinitions: entered.characterDefinitions,
    houseDefinition: createKeepHouseDefinition(),
    playerCharacterId: "char.player",
    sessionState: entered.sessionState,
    sharedSessionState: entered.sharedSessionState,
    meetingDefinitionsById: meetingContent.meetingDefinitionsById,
    meetingBindings: meetingContent.meetingBindings,
    meetingPanelsById: meetingContent.meetingPanelsById,
    meetingChoiceSetsById: meetingContent.meetingChoiceSetsById,
    meetingActionSetsById: meetingContent.meetingActionSetsById,
    request: {
      type: "action",
      actionId: "keep-review-give-advice",
    },
  });

  const afterAssignment = keepHouseHouseModule.dispatch({
    gameState: afterAdvice.gameState,
    characterDefinitions: afterAdvice.characterDefinitions,
    houseDefinition: createKeepHouseDefinition(),
    playerCharacterId: "char.player",
    sessionState: afterAdvice.sessionState,
    sharedSessionState: afterAdvice.sharedSessionState,
    meetingDefinitionsById: meetingContent.meetingDefinitionsById,
    meetingBindings: meetingContent.meetingBindings,
    meetingPanelsById: meetingContent.meetingPanelsById,
    meetingChoiceSetsById: meetingContent.meetingChoiceSetsById,
    meetingActionSetsById: meetingContent.meetingActionSetsById,
    request: {
      type: "action",
      actionId: "choice.keep.review.summary",
    },
  });

  const viewModel = keepHouseHouseModule.selectViewModel({
    gameState: afterAssignment.gameState,
    characterDefinitions: afterAssignment.characterDefinitions,
    houseDefinition: createKeepHouseDefinition(),
    playerCharacterId: "char.player",
    sessionState: afterAssignment.sessionState,
    sharedSessionState: afterAssignment.sharedSessionState,
    meetingDefinitionsById: meetingContent.meetingDefinitionsById,
    meetingBindings: meetingContent.meetingBindings,
    meetingPanelsById: meetingContent.meetingPanelsById,
    meetingChoiceSetsById: meetingContent.meetingChoiceSetsById,
    meetingActionSetsById: meetingContent.meetingActionSetsById,
  });

  assert.equal(
    afterAssignment.sharedSessionState?.hostedMeeting?.sessionState.currentStageId,
    "assigned"
  );
  assert.equal(viewModel.dialogue, null);
  assert.equal(viewModel.overlay?.title, "军令下达");
});

test("keep review hosted assignment choice should hand off to the existing task settlement flow", () => {
  const meetingContent = createKeepAssignmentMeetingContent();
  const entered = keepHouseHouseModule.enter({
    gameState: createKeepReviewDueState(),
    characterDefinitions: createKeepCharacters(),
    houseDefinition: createKeepHouseDefinition(),
    playerCharacterId: "char.player",
    sharedSessionState: null,
    meetingDefinitionsById: meetingContent.meetingDefinitionsById,
    meetingBindings: meetingContent.meetingBindings,
    meetingPanelsById: meetingContent.meetingPanelsById,
    meetingChoiceSetsById: meetingContent.meetingChoiceSetsById,
    meetingActionSetsById: meetingContent.meetingActionSetsById,
    activityDefinitionsById: {
      "activity.keep.grain-procurement": {
        id: "activity.keep.grain-procurement",
        label: "采办军粮",
        handlerId: "generic.qte",
        houseModuleId: "keep-house",
        taskId: "grain-procurement",
        missionId: "mission.keep.grain-procurement",
        titleTextId: "text.keep.task.grain.title",
        briefingTextId: "text.keep.task.grain.briefing",
        orderLineTextIds: ["text.keep.task.grain.order.001"],
        keepMinTier: "runner",
      },
    },
    textEntriesById: {
      "text.keep.task.grain.title": "采办军粮",
      "text.keep.task.grain.briefing": "立刻去筹措军粮。",
      "text.keep.task.grain.order.001": "此事即刻去办。",
    },
  });

  const assigned = keepHouseHouseModule.dispatch({
    gameState: entered.gameState,
    characterDefinitions: entered.characterDefinitions,
    houseDefinition: createKeepHouseDefinition(),
    playerCharacterId: "char.player",
    sessionState: entered.sessionState,
    sharedSessionState: entered.sharedSessionState,
    meetingDefinitionsById: meetingContent.meetingDefinitionsById,
    meetingBindings: meetingContent.meetingBindings,
    meetingPanelsById: meetingContent.meetingPanelsById,
    meetingChoiceSetsById: meetingContent.meetingChoiceSetsById,
    meetingActionSetsById: meetingContent.meetingActionSetsById,
    activityDefinitionsById: {
      "activity.keep.grain-procurement": {
        id: "activity.keep.grain-procurement",
        label: "采办军粮",
        handlerId: "generic.qte",
        houseModuleId: "keep-house",
        taskId: "grain-procurement",
        missionId: "mission.keep.grain-procurement",
        titleTextId: "text.keep.task.grain.title",
        briefingTextId: "text.keep.task.grain.briefing",
        orderLineTextIds: ["text.keep.task.grain.order.001"],
        keepMinTier: "runner",
      },
    },
    textEntriesById: {
      "text.keep.task.grain.title": "采办军粮",
      "text.keep.task.grain.briefing": "立刻去筹措军粮。",
      "text.keep.task.grain.order.001": "此事即刻去办。",
    },
    request: {
      type: "action",
      actionId: "assign-keep-task:grain-procurement",
    },
  });

  assert.equal(assigned.sharedSessionState, null);
  assert.equal(assigned.gameState.missions.activeMissionId, "mission.keep.grain-procurement");
  assert.equal(assigned.gameState.ui.activeMissionId, "mission.keep.grain-procurement");
  assert.equal(
    assigned.gameState.runtime.variables[KEEP_HOUSE_VARIABLE_KEYS.lastAssignedTaskId],
    "grain-procurement"
  );
  assert.equal(assigned.sessionState?.meetingStage, "assigned");
});
