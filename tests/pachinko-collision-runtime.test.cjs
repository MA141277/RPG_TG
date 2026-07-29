const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createActivityQteSession,
  tickActivityPachinkoBoard,
} = require("../.test-dist/application/activity/activity-qte-runtime.js");

test("pachinko side-wall rebound emits one collision pulse", () => {
  const activityDefinition = {
    id: "activity.test.pachinko.collision.side",
    label: "Side",
    outcome: {},
  };
  const baseSession = createActivityQteSession(activityDefinition, "generic.qte");

  const result = tickActivityPachinkoBoard(
    {
      runtime: {
        activitySession: {
          ...baseSession,
          phase: "dropping",
          remainingBalls: 0,
          activeBall: {
            x: 8,
            y: 240,
            previousX: 20,
            previousY: 236,
            vx: -18,
            vy: 4,
            radius: 17,
          },
          activeBalls: [
            {
              x: 8,
              y: 240,
              previousX: 20,
              previousY: 236,
              vx: -18,
              vy: 4,
              radius: 17,
            },
          ],
        },
        flags: {},
        variables: {},
      },
    },
    activityDefinition,
    []
  );

  const session = result.state.runtime.activitySession;
  assert.equal(session?.type, "pachinko-board");
  assert.deepEqual(session.audioPulse, {
    token: 1,
    collisionCount: 1,
    settleCount: 0,
  });
});

test("pachinko clean moving-gate pass does not emit a collision pulse", () => {
  const activityDefinition = {
    id: "activity.test.pachinko.collision.gate-pass",
    label: "Gate pass",
    outcome: {},
  };
  const baseSession = createActivityQteSession(activityDefinition, "generic.qte");
  const result = tickActivityPachinkoBoard(
    {
      runtime: {
        activitySession: {
          ...baseSession,
          phase: "dropping",
          remainingBalls: 0,
          activeBall: {
            x: baseSession.boardWidth / 2,
            y: 660,
            previousX: baseSession.boardWidth / 2,
            previousY: 650,
            vx: 0,
            vy: 18,
            radius: 17,
          },
          activeBalls: [
            {
              x: baseSession.boardWidth / 2,
              y: 660,
              previousX: baseSession.boardWidth / 2,
              previousY: 650,
              vx: 0,
              vy: 18,
              radius: 17,
            },
          ],
        },
        flags: {},
        variables: {},
      },
    },
    activityDefinition,
    []
  );

  const session = result.state.runtime.activitySession;
  assert.equal(session?.type, "pachinko-board");
  assert.equal(session.audioPulse, null);
});

test("pachinko slot settlement emits one settle pulse", () => {
  const activityDefinition = {
    id: "activity.test.pachinko.collision.settle",
    label: "Settle",
    outcome: {},
  };
  const baseSession = createActivityQteSession(activityDefinition, "generic.qte");
  const result = tickActivityPachinkoBoard(
    {
      runtime: {
        activitySession: {
          ...baseSession,
          phase: "dropping",
          remainingBalls: 0,
          activeBall: {
            x: baseSession.boardWidth / 2,
            y: baseSession.boardHeight - 6,
            previousX: baseSession.boardWidth / 2,
            previousY: baseSession.boardHeight - 18,
            vx: 0,
            vy: 5,
            radius: 17,
          },
          activeBalls: [
            {
              x: baseSession.boardWidth / 2,
              y: baseSession.boardHeight - 6,
              previousX: baseSession.boardWidth / 2,
              previousY: baseSession.boardHeight - 18,
              vx: 0,
              vy: 5,
              radius: 17,
            },
          ],
        },
        flags: {},
        variables: {},
      },
    },
    activityDefinition,
    []
  );

  const session = result.state.runtime.activitySession;
  assert.equal(session?.type, "pachinko-board");
  assert.deepEqual(session.audioPulse, {
    token: 1,
    collisionCount: 0,
    settleCount: 1,
  });
});
