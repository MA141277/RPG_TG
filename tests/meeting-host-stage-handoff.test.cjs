const test = require("node:test");
const assert = require("node:assert/strict");

const {
  matchHostedMeetingProjectedStageHandoff,
} = require("../.test-dist/application/meeting/meeting-host-stage-handoff.js");

function createSharedSessionState(overrides = {}) {
  return {
    hostedMeeting: {
      meetingId: "meeting.temple.review",
      hostContext: {
        hostFamily: "building",
        hostId: "house.test.temple",
        returnTarget: {
          type: "building",
          id: "house.test.temple",
        },
        participantCharacterIds: ["char.player", "char.senior"],
      },
      sessionState: {
        meetingId: "meeting.temple.review",
        currentStageId: "reward",
        completedStageIds: ["intro", "assignment-table"],
        visitedStageIds: ["intro", "assignment-table", "reward"],
        status: "active",
        derivedState: {},
      },
      presenterModel: null,
    },
    ...(overrides ?? {}),
  };
}

test("projected hosted stage handoff should update the hosted meeting session through a shared projection callback", () => {
  const result = matchHostedMeetingProjectedStageHandoff({
    sharedSessionState: createSharedSessionState(),
    hostedMeetingId: "meeting.temple.review",
    currentStageId: "reward",
    actionId: "close-temple-overlay",
    expectedActionId: "close-temple-overlay",
    gameState: { id: "game.next.reward" },
    characterDefinitions: [{ id: "char.player" }],
    resolveProjection: () => ({
      gameState: { id: "game.next.personnel" },
      characterDefinitions: [{ id: "char.player" }, { id: "char.senior" }],
      projection: {
        meetingStage: "personnel",
      },
    }),
    projectSessionState: (hostedSessionState, projectionResult) => ({
      ...hostedSessionState,
      currentStageId: projectionResult.projection.meetingStage,
      derivedState: {
        projectedFrom: "reward",
      },
    }),
  });

  assert.equal(
    result?.sharedSessionState?.hostedMeeting?.sessionState.currentStageId,
    "personnel"
  );
  assert.deepEqual(result?.gameState, { id: "game.next.personnel" });
  assert.deepEqual(result?.characterDefinitions, [
    { id: "char.player" },
    { id: "char.senior" },
  ]);
  assert.deepEqual(
    result?.sharedSessionState?.hostedMeeting?.sessionState.derivedState,
    {
      projectedFrom: "reward",
    }
  );
});

test("projected hosted stage handoff should clear the shared hosted session when projection closes it", () => {
  const result = matchHostedMeetingProjectedStageHandoff({
    sharedSessionState: createSharedSessionState(),
    hostedMeetingId: "meeting.temple.review",
    currentStageId: "reward",
    actionId: "close-temple-overlay",
    expectedActionId: "close-temple-overlay",
    gameState: { id: "game.next.reward" },
    characterDefinitions: [{ id: "char.player" }],
    resolveProjection: () => ({
      gameState: { id: "game.closed" },
      characterDefinitions: [{ id: "char.player" }],
      projection: {
        meetingStage: "complete",
      },
    }),
    projectSessionState: () => null,
  });

  assert.equal(result?.sharedSessionState, null);
  assert.deepEqual(result?.gameState, { id: "game.closed" });
});

test("projected hosted stage handoff should ignore unrelated actions and stages", () => {
  let resolveCalls = 0;
  let projectCalls = 0;

  const result = matchHostedMeetingProjectedStageHandoff({
    sharedSessionState: createSharedSessionState(),
    hostedMeetingId: "meeting.temple.review",
    currentStageId: "personnel",
    actionId: "close-review-policy-panel",
    expectedActionId: "close-temple-overlay",
    gameState: { id: "game.next.reward" },
    characterDefinitions: [{ id: "char.player" }],
    resolveProjection: () => {
      resolveCalls += 1;
      return {
        gameState: { id: "should-not-run" },
        characterDefinitions: [{ id: "char.player" }],
        projection: {
          meetingStage: "praise",
        },
      };
    },
    projectSessionState: () => {
      projectCalls += 1;
      return null;
    },
  });

  assert.equal(result, null);
  assert.equal(resolveCalls, 0);
  assert.equal(projectCalls, 0);
});
