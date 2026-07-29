const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

assert.equal(
  fs.existsSync(
    path.join(
      process.cwd(),
      "src/application/playables/flow/flow-playable-presenter.ts"
    )
  ),
  true
);

const {
  presentFlowPlayable,
} = require("../.test-dist/application/playables/flow/flow-playable-presenter.js");
const {
  launchFlowPlayable,
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
      prompt: "Choose one",
      options: [
        { id: "success", label: "Success", nextNodeId: "done" },
        { id: "retry", label: "Retry", nextNodeId: "intro" },
      ],
    },
    {
      id: "done",
      type: "complete",
      outcome: "success",
    },
  ],
};

test("flow presenter exposes text node view model and confirm action", () => {
  const session = launchFlowPlayable({
    definition: flowDefinition,
    integrationId: "playable.test.flow.dialogue",
    ownerContext,
  });

  const presenter = presentFlowPlayable({
    definition: flowDefinition,
    session,
  });

  assert.equal(presenter.playableId, flowDefinition.id);
  assert.equal(presenter.family, "flow");
  assert.equal(presenter.layout, "panel");
  assert.equal(presenter.title, "Test Flow");
  assert.deepEqual(presenter.summaryLines, []);
  assert.deepEqual(presenter.actions, [
    { id: "confirm", label: "Continue", commandType: "confirm" },
  ]);
  assert.deepEqual(presenter.viewModel, {
    currentNodeId: "intro",
    nodeType: "text",
    text: "Intro text",
  });
});

test("flow presenter exposes choice options as custom actions", () => {
  const presenter = presentFlowPlayable({
    definition: flowDefinition,
    session: {
      sessionId: "playable.playable.test.flow",
      playableId: flowDefinition.id,
      integrationId: "playable.test.flow.dialogue",
      family: "flow",
      ownerContext,
      status: "active",
      state: { currentNodeId: "choice" },
    },
  });

  assert.deepEqual(presenter.actions, [
    { id: "success", label: "Success", commandType: "custom" },
    { id: "retry", label: "Retry", commandType: "custom" },
  ]);
  assert.deepEqual(presenter.viewModel, {
    currentNodeId: "choice",
    nodeType: "choice",
    prompt: "Choose one",
    options: flowDefinition.nodes[1].options,
  });
});

test("flow presenter fails closed for missing session node", () => {
  const presenter = presentFlowPlayable({
    definition: flowDefinition,
    session: null,
  });

  assert.deepEqual(presenter.actions, []);
  assert.deepEqual(presenter.viewModel, {
    currentNodeId: null,
    nodeType: null,
  });
});
