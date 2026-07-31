const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

assert.equal(
  fs.existsSync(
    path.join(
      process.cwd(),
      "src/application/playables/flow/flow-playable-definition.ts"
    )
  ),
  true
);

const {
  launchFlowPlayable,
  reduceFlowPlayable,
} = require("../.test-dist/application/playables/flow/flow-playable-definition.js");

const ownerContext = {
  ownerKind: "dialogue",
  ownerId: "dialogue.test.flow",
  returnPolicy: "resume-owner",
};

const flowDefinition = {
  id: "playable.test.flow",
  title: "Test Flow",
  initialNodeId: "intro",
  nodes: [
    {
      id: "intro",
      type: "text",
      text: "Intro text",
      nextNodeId: "choice",
    },
    {
      id: "choice",
      type: "choice",
      prompt: "Choose",
      options: [
        { id: "success", label: "Success", nextNodeId: "done" },
        { id: "stay", label: "Stay", nextNodeId: "choice" },
      ],
    },
    {
      id: "done",
      type: "complete",
      outcome: "success",
      metrics: { score: 1 },
      detail: { flagKey: "flow.completed" },
    },
  ],
};

test("flow playable launches with initial node state", () => {
  const session = launchFlowPlayable({
    definition: flowDefinition,
    integrationId: "playable.test.flow.dialogue",
    ownerContext,
  });

  assert.equal(session.sessionId, "playable.playable.test.flow");
  assert.equal(session.playableId, flowDefinition.id);
  assert.equal(session.integrationId, "playable.test.flow.dialogue");
  assert.equal("family" in session, false);
  assert.deepEqual(session.ownerContext, ownerContext);
  assert.equal(session.status, "active");
  assert.deepEqual(session.state, { currentNodeId: "intro" });
});

test("flow playable advances text and choice nodes", () => {
  const launched = launchFlowPlayable({
    definition: flowDefinition,
    integrationId: "playable.test.flow.dialogue",
    ownerContext,
  });

  const afterConfirm = reduceFlowPlayable({
    definition: flowDefinition,
    session: launched,
    command: { type: "confirm" },
  });
  assert.deepEqual(afterConfirm.lifecycle, { type: "continue" });
  assert.deepEqual(afterConfirm.session.state, { currentNodeId: "choice" });

  const invalidSelection = reduceFlowPlayable({
    definition: flowDefinition,
    session: afterConfirm.session,
    command: { type: "select", value: "missing" },
  });
  assert.deepEqual(invalidSelection.lifecycle, { type: "continue" });
  assert.deepEqual(invalidSelection.session.state, { currentNodeId: "choice" });

  const completed = reduceFlowPlayable({
    definition: flowDefinition,
    session: invalidSelection.session,
    command: { type: "select", value: "success" },
  });
  assert.equal(completed.session.status, "completed");
  assert.deepEqual(completed.session.state, { currentNodeId: "done" });
  assert.deepEqual(completed.lifecycle, {
    type: "completed",
    result: {
      status: "completed",
      metrics: { score: 1 },
      detail: { flagKey: "flow.completed" },
    },
  });
});

test("flow playable can be cancelled from any node", () => {
  const session = launchFlowPlayable({
    definition: flowDefinition,
    integrationId: "playable.test.flow.dialogue",
    ownerContext,
  });

  const cancelled = reduceFlowPlayable({
    definition: flowDefinition,
    session,
    command: { type: "cancel" },
  });

  assert.equal(cancelled.session.status, "cancelled");
  assert.deepEqual(cancelled.lifecycle, {
    type: "cancelled",
    result: { status: "cancelled" },
  });
});
