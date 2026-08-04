const test = require("node:test");
const assert = require("node:assert/strict");

const {
  startMeetingSession,
  advanceMeetingSession,
} = require("../.test-dist/application/meeting/meeting-runtime.js");
const {
  createMeetingPresenterModel,
} = require("../.test-dist/application/meeting/meeting-presenter.js");

function createHostContext() {
  return {
    hostFamily: "building",
    hostId: "house.temple",
    returnTarget: {
      type: "building",
      id: "house.temple",
    },
    participantCharacterIds: ["char.player", "char.senior"],
  };
}

function createGameState() {
  return {
    runtime: {
      flags: {},
      variables: {
        "var.player_inventory.grain_dou": 1,
      },
      factionMerit: {},
      factionMemberships: {},
    },
  };
}

function createMeetingContext(overrides = {}) {
  const meetingDefinition = {
    id: "meeting.temple.review",
    hostScope: {
      family: "building",
      templateId: "house.template.temple",
    },
    initialStageId: "intro",
    stageIds: ["intro"],
    stagesById: {
      intro: {
        id: "intro",
        type: "dialogue",
        dialogueId: "scene.temple.review.intro",
      },
    },
    completion: {
      type: "return-to-host",
    },
    ...(overrides.meetingDefinition ?? {}),
  };

  return {
    meetingDefinition,
    hostContext: createHostContext(),
    gameState: overrides.gameState ?? createGameState(),
    characterDefinitions: [],
    meetingPanelsById: {
      "panel.assignment": {
        id: "panel.assignment",
        title: "委任",
        type: "assignment-table",
        sections: [],
      },
      "panel.policy": {
        id: "panel.policy",
        title: "方略",
        type: "policy-panel",
        sections: [
          { title: "总目标", value: "保全寺众" },
          { title: "阶段目标", value: "筹足粮米" },
          { title: "执行计划", value: "分派众人外出化缘" },
        ],
      },
    },
    meetingChoiceSetsById: {
      "choice.advice": {
        id: "choice.advice",
        title: "有谁要进言吗",
        choices: [
          {
            id: "choice.speak",
            label: "发表意见",
            nextStageId: "speak",
          },
          {
            id: "choice.silent",
            label: "一言不发",
            nextStageId: "silent",
          },
        ],
      },
    },
    meetingActionSetsById: {
      "action.reward": {
        id: "action.reward",
        actions: [
          {
            id: "reward.grain",
            type: "grant-reward",
            rewardId: "review.reward.default-top-rank",
          },
        ],
      },
    },
    ...(overrides.context ?? {}),
  };
}

test("meeting runtime starts at the authored initial stage", () => {
  const result = startMeetingSession(createMeetingContext());

  assert.equal(result.sessionState?.currentStageId, "intro");
  assert.equal(result.sessionState?.status, "running");
  assert.deepEqual(result.sessionState?.visitedStageIds, ["intro"]);
});

test("meeting runtime advances dialogue stages to the authored next stage", () => {
  const input = createMeetingContext({
    meetingDefinition: {
      stageIds: ["intro", "assignment"],
      stagesById: {
        intro: {
          id: "intro",
          type: "dialogue",
          dialogueId: "scene.temple.review.intro",
          nextStageId: "assignment",
        },
        assignment: {
          id: "assignment",
          type: "assignment-table",
          panelId: "panel.assignment",
        },
      },
    },
  });

  const running = startMeetingSession(input);
  const result = advanceMeetingSession({
    ...input,
    sessionState: running.sessionState,
  });

  assert.equal(result.sessionState?.currentStageId, "assignment");
  assert.deepEqual(result.sessionState?.visitedStageIds, ["intro", "assignment"]);
});

test("meeting presenter maps assignment tables to the existing review assignment overlay family", () => {
  const input = createMeetingContext({
    meetingDefinition: {
      initialStageId: "assignment",
      stageIds: ["assignment"],
      stagesById: {
        assignment: {
          id: "assignment",
          type: "assignment-table",
          panelId: "panel.assignment",
        },
      },
    },
  });

  const result = startMeetingSession({
    ...input,
    initialDerivedState: {
      reviewAssignmentRowsByPanelId: {
        "panel.assignment": [
          {
            characterId: "char.player",
            characterName: "朱元璋",
            assignmentTitle: "筹粮",
            contribution: 90,
            grade: "outstanding",
          },
        ],
      },
    },
  });

  const presenterModel = createMeetingPresenterModel({
    ...input,
    sessionState: result.sessionState,
  });

  assert.equal(presenterModel.overlay?.type, "review-assignment-table");
  assert.equal(presenterModel.overlay?.rows?.[0]?.assignmentTitle, "筹粮");
});

test("meeting runtime keeps the policy panel visible while entering the advice prompt", () => {
  const input = createMeetingContext({
    meetingDefinition: {
      initialStageId: "policy",
      stageIds: ["policy", "advice", "speak", "silent"],
      stagesById: {
        policy: {
          id: "policy",
          type: "policy-panel",
          panelId: "panel.policy",
          nextStageId: "advice",
        },
        advice: {
          id: "advice",
          type: "choice",
          choiceSetId: "choice.advice",
        },
        speak: {
          id: "speak",
          type: "dialogue",
          dialogueId: "scene.temple.review.speak",
        },
        silent: {
          id: "silent",
          type: "dialogue",
          dialogueId: "scene.temple.review.silent",
        },
      },
    },
  });

  const running = startMeetingSession(input);
  const result = advanceMeetingSession({
    ...input,
    sessionState: running.sessionState,
  });

  assert.equal(result.sessionState?.currentStageId, "advice");
  assert.equal(result.presenterModel?.overlay?.type, "review-policy-panel");
});

test("meeting runtime routes choice stages to the selected next stage", () => {
  const input = createMeetingContext({
    meetingDefinition: {
      initialStageId: "advice",
      stageIds: ["advice", "speak", "silent"],
      stagesById: {
        advice: {
          id: "advice",
          type: "choice",
          choiceSetId: "choice.advice",
        },
        speak: {
          id: "speak",
          type: "dialogue",
          dialogueId: "scene.temple.review.speak",
        },
        silent: {
          id: "silent",
          type: "dialogue",
          dialogueId: "scene.temple.review.silent",
        },
      },
    },
  });

  const running = startMeetingSession(input);
  const result = advanceMeetingSession({
    ...input,
    sessionState: running.sessionState,
    request: {
      type: "select-choice",
      choiceId: "choice.speak",
    },
  });

  assert.equal(result.sessionState?.currentStageId, "speak");
  assert.deepEqual(result.sessionState?.selectedChoiceIds, ["choice.speak"]);
});

test("meeting runtime action stages can write back shared review state through shared helpers", () => {
  const input = createMeetingContext({
    meetingDefinition: {
      initialStageId: "reward",
      stageIds: ["reward", "done"],
      stagesById: {
        reward: {
          id: "reward",
          type: "action",
          actionSetId: "action.reward",
          nextStageId: "done",
        },
        done: {
          id: "done",
          type: "dialogue",
          dialogueId: "scene.temple.review.done",
        },
      },
    },
  });

  const running = startMeetingSession(input);
  const result = advanceMeetingSession({
    ...input,
    sessionState: running.sessionState,
  });

  assert.equal(result.sessionState?.currentStageId, "done");
  assert.equal(result.gameState.runtime.variables["var.player_inventory.grain_dou"], 3);
});

test("meeting runtime rejects choice requests whose conditions are not satisfied", () => {
  const input = createMeetingContext({
    meetingDefinition: {
      initialStageId: "advice",
      stageIds: ["advice", "speak", "silent"],
      stagesById: {
        advice: {
          id: "advice",
          type: "choice",
          choiceSetId: "choice.advice",
        },
        speak: {
          id: "speak",
          type: "dialogue",
          dialogueId: "scene.temple.review.speak",
        },
        silent: {
          id: "silent",
          type: "dialogue",
          dialogueId: "scene.temple.review.silent",
        },
      },
    },
    context: {
      meetingChoiceSetsById: {
        "choice.advice": {
          id: "choice.advice",
          title: "有谁要进言吗",
          choices: [
            {
              id: "choice.speak",
              label: "发表意见",
              nextStageId: "speak",
              conditions: [
                {
                  type: "flag-set",
                  flagId: "flag.can_speak",
                },
              ],
            },
            {
              id: "choice.silent",
              label: "一言不发",
              nextStageId: "silent",
            },
          ],
        },
      },
    },
  });

  const running = startMeetingSession(input);
  assert.equal(
    running.presenterModel?.actionContainer?.actions?.[0]?.disabled,
    true
  );

  const result = advanceMeetingSession({
    ...input,
    sessionState: running.sessionState,
    request: {
      type: "select-choice",
      choiceId: "choice.speak",
    },
  });

  assert.equal(result.sessionState?.status, "blocked");
  assert.match(result.diagnostics?.[0] ?? "", /conditions are not satisfied/i);
});

test("meeting action runtime does not partially write state when an unsupported action appears", () => {
  const input = createMeetingContext({
    meetingDefinition: {
      initialStageId: "reward",
      stageIds: ["reward", "done"],
      stagesById: {
        reward: {
          id: "reward",
          type: "action",
          actionSetId: "action.reward",
          nextStageId: "done",
        },
        done: {
          id: "done",
          type: "dialogue",
          dialogueId: "scene.temple.review.done",
        },
      },
    },
    context: {
      meetingActionSetsById: {
        "action.reward": {
          id: "action.reward",
          actions: [
            {
              id: "flag.before-failure",
              type: "set-flag",
              flagId: "flag.before_failure",
              value: true,
            },
            {
              id: "unsupported.assign-task",
              type: "assign-task",
              taskId: "task.review.special",
            },
          ],
        },
      },
    },
  });

  const running = startMeetingSession(input);
  const result = advanceMeetingSession({
    ...input,
    sessionState: running.sessionState,
  });

  assert.equal(result.sessionState?.status, "blocked");
  assert.equal(result.gameState.runtime.flags["flag.before_failure"], undefined);
  assert.match(result.diagnostics?.[0] ?? "", /unsupported meeting action type/i);
});

test("meeting action runtime does not partially write state when reward resolution fails", () => {
  const input = createMeetingContext({
    gameState: {
      runtime: {
        flags: {},
        variables: {
          "var.player_inventory.grain_dou": 1,
          "var.meeting.marker": 0,
        },
        factionMerit: {},
        factionMemberships: {},
      },
    },
    meetingDefinition: {
      initialStageId: "reward",
      stageIds: ["reward"],
      stagesById: {
        reward: {
          id: "reward",
          type: "action",
          actionSetId: "action.reward",
        },
      },
    },
    context: {
      meetingActionSetsById: {
        "action.reward": {
          id: "action.reward",
          actions: [
            {
              id: "variable.before-failure",
              type: "set-variable",
              variableId: "var.meeting.marker",
              value: 1,
            },
            {
              id: "reward.unknown",
              type: "grant-reward",
              rewardId: "review.reward.unknown",
            },
          ],
        },
      },
    },
  });

  const running = startMeetingSession(input);
  const result = advanceMeetingSession({
    ...input,
    sessionState: running.sessionState,
  });

  assert.equal(result.sessionState?.status, "blocked");
  assert.equal(result.gameState.runtime.variables["var.meeting.marker"], 0);
  assert.equal(result.gameState.runtime.variables["var.player_inventory.grain_dou"], 1);
  assert.match(result.diagnostics?.[0] ?? "", /unsupported meeting reward id/i);
});
