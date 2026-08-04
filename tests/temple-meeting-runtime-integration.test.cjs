const assert = require("node:assert/strict");
const test = require("node:test");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  templeHouseHouseModule,
} = require("../.test-dist/application/house-modules/temple-house/temple-house-house-module.js");
const {
  ZHU_YUANZHANG_STORY_FLAG_KEYS,
  ZHU_YUANZHANG_STORY_STAGES,
  ZHU_YUANZHANG_STORY_VARIABLE_KEYS,
} = require("../.test-dist/domain/zhu-yuanzhang-story.js");
const {
  KEEP_HOUSE_VARIABLE_KEYS,
} = require("../.test-dist/domain/keep-house.js");
const {
  TEMPLE_TOP_RANK_REWARD,
  getRuntimeItemQuantityKey,
} = require("../.test-dist/application/review/faction-review.js");

function createTempleHouseDefinition() {
  return {
    id: "house.kulan.temple",
    cityId: "city.kulan",
    name: "皇觉寺",
    type: "temple",
    moduleId: "temple-house",
    characterIds: ["char.abbot", "char.senior-monk"],
    defaultCharacterId: "char.abbot",
  };
}

function createTempleCharacters() {
  return [
    {
      id: "char.player",
      name: "Player",
      birthYear: 1540,
      deathYear: null,
      age: 27,
      cityId: "city.kulan",
      portraitId: "char.player.portrait",
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
      id: "char.abbot",
      name: "住持",
      birthYear: 1520,
      deathYear: null,
      age: 47,
      cityId: "city.kulan",
      portraitId: "char.abbot.portrait",
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
      houseId: "house.kulan.temple",
      title: "方丈",
    },
    {
      id: "char.senior-monk",
      name: "师兄",
      birthYear: 1530,
      deathYear: null,
      age: 37,
      cityId: "city.kulan",
      portraitId: "char.senior-monk.portrait",
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
      houseId: "house.kulan.temple",
      title: "师兄",
    },
  ];
}

function createTempleReviewDueState() {
  const baseState = createInitialState({
    currentMapId: "map.test",
    currentCityId: "city.kulan",
    currentHouseId: "house.kulan.temple",
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
      flags: {
        ...baseState.runtime.flags,
        [ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleReviewCompleted]: true,
        [ZHU_YUANZHANG_STORY_FLAG_KEYS.templeWorkUnlocked]: true,
      },
      variables: {
        ...baseState.runtime.variables,
        [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.stage]:
          ZHU_YUANZHANG_STORY_STAGES.huangjueTemple,
      },
    },
  };
}

function createTempleMeetingContent() {
  return {
    meetingDefinitionsById: {
      "meeting.temple.review": {
        id: "meeting.temple.review",
        hostScope: {
          family: "building",
          templateId: "house.template.temple",
        },
        initialStageId: "intro",
        stageIds: ["intro", "assignment", "advice", "complete"],
        stagesById: {
          intro: {
            id: "intro",
            type: "dialogue",
            textLineIds: ["自定义寺评开场一。", "自定义寺评开场二。"],
            nextStageId: "assignment",
          },
          assignment: {
            id: "assignment",
            type: "assignment-table",
            panelId: "panel.temple.assignment",
            nextStageId: "advice",
          },
          advice: {
            id: "advice",
            type: "choice",
            choiceSetId: "choice.temple.advice",
          },
          complete: {
            id: "complete",
            type: "dialogue",
            textLineIds: ["寺评结束。"],
          },
        },
        completion: {
          type: "return-to-host",
        },
      },
    },
    meetingBindings: [
      {
        id: "binding.temple.review",
        meetingId: "meeting.temple.review",
        owner: {
          family: "building",
          id: "house.kulan.temple",
        },
        trigger: {
          action: "building-container-item-action",
          itemId: "review",
        },
      },
    ],
    meetingPanelsById: {
      "panel.temple.assignment": {
        id: "panel.temple.assignment",
        title: "本轮差事已定",
        type: "assignment-table",
        sections: [],
      },
    },
    meetingChoiceSetsById: {
      "choice.temple.advice": {
        id: "choice.temple.advice",
        title: "是否进言",
        choices: [
          {
            id: "choice.temple.speak",
            label: "发表意见",
            nextStageId: "complete",
          },
        ],
      },
    },
    meetingActionSetsById: {},
  };
}

function createTempleAssignmentMeetingContent() {
  return {
    meetingDefinitionsById: {
      "meeting.temple.review": {
        id: "meeting.temple.review",
        hostScope: {
          family: "building",
          templateId: "house.template.temple",
        },
        initialStageId: "assign-duty",
        stageIds: ["assign-duty"],
        stagesById: {
          "assign-duty": {
            id: "assign-duty",
            type: "choice",
            choiceSetId: "choices.temple.review.assignment",
          },
        },
        completion: {
          type: "return-to-host",
        },
      },
    },
    meetingBindings: [
      {
        id: "binding.temple.review",
        meetingId: "meeting.temple.review",
        owner: {
          family: "building",
          id: "house.kulan.temple",
        },
        trigger: {
          action: "building-container-item-action",
          itemId: "review",
        },
      },
    ],
    meetingPanelsById: {},
    meetingChoiceSetsById: {
      "choices.temple.review.assignment": {
        id: "choices.temple.review.assignment",
        title: "差事分派",
        choices: [
          {
            id: "temple-review-assign-indoor",
            label: "寺内帮忙",
          },
        ],
      },
    },
    meetingActionSetsById: {},
  };
}

function createTempleRewardPersonnelMeetingContent() {
  return {
    meetingDefinitionsById: {
      "meeting.temple.review": {
        id: "meeting.temple.review",
        hostScope: {
          family: "building",
          templateId: "house.template.temple",
        },
        initialStageId: "assignment-table",
        stageIds: [
          "assignment-table",
          "reward",
          "personnel",
          "praise",
          "situation",
          "policy",
          "advice",
          "assign-duty",
        ],
        stagesById: {
          "assignment-table": {
            id: "assignment-table",
            type: "assignment-table",
            panelId: "panel.temple.review.assignment",
            nextStageId: "praise",
          },
          reward: {
            id: "reward",
            type: "reward",
            nextStageId: "personnel",
          },
          personnel: {
            id: "personnel",
            type: "personnel-update",
            nextStageId: "praise",
          },
          praise: {
            id: "praise",
            type: "dialogue",
            textLineIds: ["这段时间大家辛苦了。"],
            nextStageId: "situation",
          },
          situation: {
            id: "situation",
            type: "dialogue",
            textLineIds: ["所以接下来的计划如下："],
            nextStageId: "policy",
          },
          policy: {
            id: "policy",
            type: "policy-panel",
            panelId: "panel.temple.review.policy",
            nextStageId: "advice",
          },
          advice: {
            id: "advice",
            type: "choice",
            choiceSetId: "choices.temple.review.advice",
          },
          "assign-duty": {
            id: "assign-duty",
            type: "choice",
            choiceSetId: "choices.temple.review.assignment",
          },
        },
        completion: {
          type: "return-to-host",
        },
      },
    },
    meetingBindings: [
      {
        id: "binding.temple.review",
        meetingId: "meeting.temple.review",
        owner: {
          family: "building",
          id: "house.kulan.temple",
        },
        trigger: {
          action: "building-container-item-action",
          itemId: "review",
        },
      },
    ],
    meetingPanelsById: {
      "panel.temple.review.assignment": {
        id: "panel.temple.review.assignment",
        title: "本轮差事已定",
        type: "assignment-table",
        sections: [],
      },
      "panel.temple.review.policy": {
        id: "panel.temple.review.policy",
        title: "方略",
        type: "policy-panel",
        sections: [],
      },
    },
    meetingChoiceSetsById: {
      "choices.temple.review.advice": {
        id: "choices.temple.review.advice",
        title: "评定进言",
        choices: [
          {
            id: "temple-review-give-advice",
            label: "进言",
            nextStageId: "assign-duty",
          },
          {
            id: "temple-review-stay-silent",
            label: "不发一言",
            nextStageId: "assign-duty",
          },
        ],
      },
      "choices.temple.review.assignment": {
        id: "choices.temple.review.assignment",
        title: "差事分派",
        choices: [
          {
            id: "temple-review-assign-indoor",
            label: "寺内帮忙",
          },
          {
            id: "temple-review-assign-beg-alms",
            label: "外出化缘",
          },
        ],
      },
    },
    meetingActionSetsById: {},
  };
}

test("temple review entry should launch the shared meeting session owner when meeting content is available", () => {
  const meetingContent = createTempleMeetingContent();
  const result = templeHouseHouseModule.enter({
    gameState: createTempleReviewDueState(),
    characterDefinitions: createTempleCharacters(),
    houseDefinition: createTempleHouseDefinition(),
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
    "meeting.temple.review"
  );
});

test("temple review shared meeting should drive the existing temple shell view model", () => {
  const meetingContent = createTempleMeetingContent();
  const entered = templeHouseHouseModule.enter({
    gameState: createTempleReviewDueState(),
    characterDefinitions: createTempleCharacters(),
    houseDefinition: createTempleHouseDefinition(),
    playerCharacterId: "char.player",
    sharedSessionState: null,
    meetingDefinitionsById: meetingContent.meetingDefinitionsById,
    meetingBindings: meetingContent.meetingBindings,
    meetingPanelsById: meetingContent.meetingPanelsById,
    meetingChoiceSetsById: meetingContent.meetingChoiceSetsById,
    meetingActionSetsById: meetingContent.meetingActionSetsById,
  });

  const viewModel = templeHouseHouseModule.selectViewModel({
    gameState: entered.gameState,
    characterDefinitions: entered.characterDefinitions,
    houseDefinition: createTempleHouseDefinition(),
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
    "自定义寺评开场一。",
    "自定义寺评开场二。",
  ]);
  assert.equal(viewModel.dialogue?.advanceActionId, "advance-meeting-stage");
});

test("temple review shared meeting should not fall back to legacy temple review owner", () => {
  const meetingContent = createTempleMeetingContent();
  const entered = templeHouseHouseModule.enter({
    gameState: createTempleReviewDueState(),
    characterDefinitions: createTempleCharacters(),
    houseDefinition: createTempleHouseDefinition(),
    playerCharacterId: "char.player",
    sharedSessionState: null,
    meetingDefinitionsById: meetingContent.meetingDefinitionsById,
    meetingBindings: meetingContent.meetingBindings,
    meetingPanelsById: meetingContent.meetingPanelsById,
    meetingChoiceSetsById: meetingContent.meetingChoiceSetsById,
    meetingActionSetsById: meetingContent.meetingActionSetsById,
  });

  const result = templeHouseHouseModule.dispatch({
    gameState: entered.gameState,
    characterDefinitions: entered.characterDefinitions,
    houseDefinition: createTempleHouseDefinition(),
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
      actionId: "advance-temple-dialogue",
    },
  });

  assert.equal(
    result.sharedSessionState?.hostedMeeting?.sessionState.currentStageId,
    "intro"
  );
  assert.equal(result.sessionState?.meetingStage, "intro");
  assert.equal(result.sessionState?.overlay, null);
});

test("temple review shared meeting should advance through temple dispatch actions", () => {
  const meetingContent = createTempleMeetingContent();
  const entered = templeHouseHouseModule.enter({
    gameState: createTempleReviewDueState(),
    characterDefinitions: createTempleCharacters(),
    houseDefinition: createTempleHouseDefinition(),
    playerCharacterId: "char.player",
    sharedSessionState: null,
    meetingDefinitionsById: meetingContent.meetingDefinitionsById,
    meetingBindings: meetingContent.meetingBindings,
    meetingPanelsById: meetingContent.meetingPanelsById,
    meetingChoiceSetsById: meetingContent.meetingChoiceSetsById,
    meetingActionSetsById: meetingContent.meetingActionSetsById,
  });

  const advanced = templeHouseHouseModule.dispatch({
    gameState: entered.gameState,
    characterDefinitions: entered.characterDefinitions,
    houseDefinition: createTempleHouseDefinition(),
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
    "assignment"
  );
});

test("temple review hosted assignment choice should hand off to the existing work-plan settlement flow", () => {
  const meetingContent = createTempleAssignmentMeetingContent();
  const entered = templeHouseHouseModule.enter({
    gameState: createTempleReviewDueState(),
    characterDefinitions: createTempleCharacters(),
    houseDefinition: createTempleHouseDefinition(),
    playerCharacterId: "char.player",
    sharedSessionState: null,
    meetingDefinitionsById: meetingContent.meetingDefinitionsById,
    meetingBindings: meetingContent.meetingBindings,
    meetingPanelsById: meetingContent.meetingPanelsById,
    meetingChoiceSetsById: meetingContent.meetingChoiceSetsById,
    meetingActionSetsById: meetingContent.meetingActionSetsById,
  });

  const assigned = templeHouseHouseModule.dispatch({
    gameState: entered.gameState,
    characterDefinitions: entered.characterDefinitions,
    houseDefinition: createTempleHouseDefinition(),
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
      actionId: "temple-review-assign-indoor",
    },
  });

  assert.equal(assigned.sharedSessionState, null);
  assert.equal(
    assigned.gameState.runtime.variables[
      ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeWeek
    ],
    1
  );
  assert.equal(
    assigned.gameState.runtime.flags[
      ZHU_YUANZHANG_STORY_FLAG_KEYS.templeWorkUnlocked
    ],
    true
  );
  assert.equal(assigned.sessionState?.selectedWorkPlan, "temple-help");
  assert.equal(assigned.sessionState?.meetingStage, "assigned");
});

test("temple review hosted assignment-table should continue through reward and personnel stages", () => {
  const meetingContent = createTempleRewardPersonnelMeetingContent();
  const entered = templeHouseHouseModule.enter({
    gameState: {
      ...createTempleReviewDueState(),
      runtime: {
        ...createTempleReviewDueState().runtime,
        variables: {
          ...createTempleReviewDueState().runtime.variables,
          [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 0,
          [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeContribution]: 90,
        },
        factionMerit: {
          ...createTempleReviewDueState().runtime.factionMerit,
          temple: {
            "char.player": 0,
          },
        },
      },
    },
    characterDefinitions: createTempleCharacters(),
    houseDefinition: createTempleHouseDefinition(),
    playerCharacterId: "char.player",
    sharedSessionState: null,
    meetingDefinitionsById: meetingContent.meetingDefinitionsById,
    meetingBindings: meetingContent.meetingBindings,
    meetingPanelsById: meetingContent.meetingPanelsById,
    meetingChoiceSetsById: meetingContent.meetingChoiceSetsById,
    meetingActionSetsById: meetingContent.meetingActionSetsById,
  });

  const reward = templeHouseHouseModule.dispatch({
    gameState: entered.gameState,
    characterDefinitions: entered.characterDefinitions,
    houseDefinition: createTempleHouseDefinition(),
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
      actionId: "close-review-assignment-table",
    },
  });

  const rewardViewModel = templeHouseHouseModule.selectViewModel({
    gameState: reward.gameState,
    characterDefinitions: reward.characterDefinitions,
    houseDefinition: createTempleHouseDefinition(),
    playerCharacterId: "char.player",
    sessionState: reward.sessionState,
    sharedSessionState: reward.sharedSessionState,
    meetingDefinitionsById: meetingContent.meetingDefinitionsById,
    meetingBindings: meetingContent.meetingBindings,
    meetingPanelsById: meetingContent.meetingPanelsById,
    meetingChoiceSetsById: meetingContent.meetingChoiceSetsById,
    meetingActionSetsById: meetingContent.meetingActionSetsById,
  });

  assert.equal(
    reward.sharedSessionState?.hostedMeeting?.sessionState.currentStageId,
    "reward"
  );
  assert.equal(rewardViewModel.overlay?.title, "获得物品");
  assert.deepEqual(rewardViewModel.overlay?.paragraphs, ["经书抄本 x1"]);
  assert.equal(
    reward.gameState.runtime.variables[
      getRuntimeItemQuantityKey(TEMPLE_TOP_RANK_REWARD.itemId)
    ],
    1
  );

  const personnel = templeHouseHouseModule.dispatch({
    gameState: reward.gameState,
    characterDefinitions: reward.characterDefinitions,
    houseDefinition: createTempleHouseDefinition(),
    playerCharacterId: "char.player",
    sessionState: reward.sessionState,
    sharedSessionState: reward.sharedSessionState,
    meetingDefinitionsById: meetingContent.meetingDefinitionsById,
    meetingBindings: meetingContent.meetingBindings,
    meetingPanelsById: meetingContent.meetingPanelsById,
    meetingChoiceSetsById: meetingContent.meetingChoiceSetsById,
    meetingActionSetsById: meetingContent.meetingActionSetsById,
    request: {
      type: "action",
      actionId: "close-temple-overlay",
    },
  });

  const personnelViewModel = templeHouseHouseModule.selectViewModel({
    gameState: personnel.gameState,
    characterDefinitions: personnel.characterDefinitions,
    houseDefinition: createTempleHouseDefinition(),
    playerCharacterId: "char.player",
    sessionState: personnel.sessionState,
    sharedSessionState: personnel.sharedSessionState,
    meetingDefinitionsById: meetingContent.meetingDefinitionsById,
    meetingBindings: meetingContent.meetingBindings,
    meetingPanelsById: meetingContent.meetingPanelsById,
    meetingChoiceSetsById: meetingContent.meetingChoiceSetsById,
    meetingActionSetsById: meetingContent.meetingActionSetsById,
  });

  assert.equal(
    personnel.sharedSessionState?.hostedMeeting?.sessionState.currentStageId,
    "personnel"
  );
  assert.equal(personnelViewModel.overlay?.title, "人事变动");
  assert.deepEqual(personnelViewModel.overlay?.paragraphs, [
    "Player初次加入皇觉寺，列为杂役。",
    "Player由杂役晋为沙弥。",
  ]);

  const praise = templeHouseHouseModule.dispatch({
    gameState: personnel.gameState,
    characterDefinitions: personnel.characterDefinitions,
    houseDefinition: createTempleHouseDefinition(),
    playerCharacterId: "char.player",
    sessionState: personnel.sessionState,
    sharedSessionState: personnel.sharedSessionState,
    meetingDefinitionsById: meetingContent.meetingDefinitionsById,
    meetingBindings: meetingContent.meetingBindings,
    meetingPanelsById: meetingContent.meetingPanelsById,
    meetingChoiceSetsById: meetingContent.meetingChoiceSetsById,
    meetingActionSetsById: meetingContent.meetingActionSetsById,
    request: {
      type: "action",
      actionId: "close-temple-overlay",
    },
  });

  const praiseViewModel = templeHouseHouseModule.selectViewModel({
    gameState: praise.gameState,
    characterDefinitions: praise.characterDefinitions,
    houseDefinition: createTempleHouseDefinition(),
    playerCharacterId: "char.player",
    sessionState: praise.sessionState,
    sharedSessionState: praise.sharedSessionState,
    meetingDefinitionsById: meetingContent.meetingDefinitionsById,
    meetingBindings: meetingContent.meetingBindings,
    meetingPanelsById: meetingContent.meetingPanelsById,
    meetingChoiceSetsById: meetingContent.meetingChoiceSetsById,
    meetingActionSetsById: meetingContent.meetingActionSetsById,
  });

  assert.equal(
    praise.sharedSessionState?.hostedMeeting?.sessionState.currentStageId,
    "praise"
  );
  assert.equal(praiseViewModel.dialogue?.textLines.length, 2);
  assert.notDeepEqual(praiseViewModel.dialogue?.textLines, [
    "这段时间大家辛苦了。",
  ]);

  const situation = templeHouseHouseModule.dispatch({
    gameState: praise.gameState,
    characterDefinitions: praise.characterDefinitions,
    houseDefinition: createTempleHouseDefinition(),
    playerCharacterId: "char.player",
    sessionState: praise.sessionState,
    sharedSessionState: praise.sharedSessionState,
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

  const situationViewModel = templeHouseHouseModule.selectViewModel({
    gameState: situation.gameState,
    characterDefinitions: situation.characterDefinitions,
    houseDefinition: createTempleHouseDefinition(),
    playerCharacterId: "char.player",
    sessionState: situation.sessionState,
    sharedSessionState: situation.sharedSessionState,
    meetingDefinitionsById: meetingContent.meetingDefinitionsById,
    meetingBindings: meetingContent.meetingBindings,
    meetingPanelsById: meetingContent.meetingPanelsById,
    meetingChoiceSetsById: meetingContent.meetingChoiceSetsById,
    meetingActionSetsById: meetingContent.meetingActionSetsById,
  });

  assert.equal(
    situation.sharedSessionState?.hostedMeeting?.sessionState.currentStageId,
    "situation"
  );
  assert.equal((situationViewModel.dialogue?.textLines ?? []).length >= 1, true);
  assert.notDeepEqual(situationViewModel.dialogue?.textLines, [
    "所以接下来的计划如下：",
  ]);

  const policy = templeHouseHouseModule.dispatch({
    gameState: situation.gameState,
    characterDefinitions: situation.characterDefinitions,
    houseDefinition: createTempleHouseDefinition(),
    playerCharacterId: "char.player",
    sessionState: situation.sessionState,
    sharedSessionState: situation.sharedSessionState,
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

  const policyViewModel = templeHouseHouseModule.selectViewModel({
    gameState: policy.gameState,
    characterDefinitions: policy.characterDefinitions,
    houseDefinition: createTempleHouseDefinition(),
    playerCharacterId: "char.player",
    sessionState: policy.sessionState,
    sharedSessionState: policy.sharedSessionState,
    meetingDefinitionsById: meetingContent.meetingDefinitionsById,
    meetingBindings: meetingContent.meetingBindings,
    meetingPanelsById: meetingContent.meetingPanelsById,
    meetingChoiceSetsById: meetingContent.meetingChoiceSetsById,
    meetingActionSetsById: meetingContent.meetingActionSetsById,
  });

  assert.equal(
    policy.sharedSessionState?.hostedMeeting?.sessionState.currentStageId,
    "policy"
  );
  assert.equal((policyViewModel.dialogue?.textLines ?? []).length >= 1, true);
  assert.equal(policyViewModel.overlay?.title, "方略");
  assert.equal(
    (policyViewModel.overlay?.policy?.overallGoal ?? "").length > 0,
    true
  );
  assert.equal(
    (policyViewModel.overlay?.policy?.phaseGoal ?? "").length > 0,
    true
  );
  assert.equal(
    (policyViewModel.overlay?.policy?.executionPlan ?? "").length > 0,
    true
  );

  const advice = templeHouseHouseModule.dispatch({
    gameState: policy.gameState,
    characterDefinitions: policy.characterDefinitions,
    houseDefinition: createTempleHouseDefinition(),
    playerCharacterId: "char.player",
    sessionState: policy.sessionState,
    sharedSessionState: policy.sharedSessionState,
    meetingDefinitionsById: meetingContent.meetingDefinitionsById,
    meetingBindings: meetingContent.meetingBindings,
    meetingPanelsById: meetingContent.meetingPanelsById,
    meetingChoiceSetsById: meetingContent.meetingChoiceSetsById,
    meetingActionSetsById: meetingContent.meetingActionSetsById,
    request: {
      type: "action",
      actionId: "close-review-policy-panel",
    },
  });

  const adviceViewModel = templeHouseHouseModule.selectViewModel({
    gameState: advice.gameState,
    characterDefinitions: advice.characterDefinitions,
    houseDefinition: createTempleHouseDefinition(),
    playerCharacterId: "char.player",
    sessionState: advice.sessionState,
    sharedSessionState: advice.sharedSessionState,
    meetingDefinitionsById: meetingContent.meetingDefinitionsById,
    meetingBindings: meetingContent.meetingBindings,
    meetingPanelsById: meetingContent.meetingPanelsById,
    meetingChoiceSetsById: meetingContent.meetingChoiceSetsById,
    meetingActionSetsById: meetingContent.meetingActionSetsById,
  });

  assert.equal(
    advice.sharedSessionState?.hostedMeeting?.sessionState.currentStageId,
    "advice"
  );
  assert.equal((adviceViewModel.dialogue?.textLines ?? []).length >= 1, true);
  assert.deepEqual(
    adviceViewModel.actionContainer?.actions.map((action) => action.id),
    ["temple-review-give-advice", "temple-review-stay-silent"]
  );

  const assignDuty = templeHouseHouseModule.dispatch({
    gameState: advice.gameState,
    characterDefinitions: advice.characterDefinitions,
    houseDefinition: createTempleHouseDefinition(),
    playerCharacterId: "char.player",
    sessionState: advice.sessionState,
    sharedSessionState: advice.sharedSessionState,
    meetingDefinitionsById: meetingContent.meetingDefinitionsById,
    meetingBindings: meetingContent.meetingBindings,
    meetingPanelsById: meetingContent.meetingPanelsById,
    meetingChoiceSetsById: meetingContent.meetingChoiceSetsById,
    meetingActionSetsById: meetingContent.meetingActionSetsById,
    request: {
      type: "action",
      actionId: "temple-review-give-advice",
    },
  });

  const assignDutyViewModel = templeHouseHouseModule.selectViewModel({
    gameState: assignDuty.gameState,
    characterDefinitions: assignDuty.characterDefinitions,
    houseDefinition: createTempleHouseDefinition(),
    playerCharacterId: "char.player",
    sessionState: assignDuty.sessionState,
    sharedSessionState: assignDuty.sharedSessionState,
    meetingDefinitionsById: meetingContent.meetingDefinitionsById,
    meetingBindings: meetingContent.meetingBindings,
    meetingPanelsById: meetingContent.meetingPanelsById,
    meetingChoiceSetsById: meetingContent.meetingChoiceSetsById,
    meetingActionSetsById: meetingContent.meetingActionSetsById,
  });

  assert.equal(
    assignDuty.sharedSessionState?.hostedMeeting?.sessionState.currentStageId,
    "assign-duty"
  );
  assert.equal((assignDutyViewModel.dialogue?.textLines ?? []).length > 1, true);
  assert.deepEqual(
    assignDutyViewModel.actionContainer?.actions.map((action) => action.id),
    ["temple-review-assign-indoor", "temple-review-assign-beg-alms"]
  );
});
