const test = require("node:test");
const assert = require("node:assert/strict");

const {
  listScriptEditorBuiltinMinigamePlayableOptions,
} = require("../.test-dist/modules/script-editor/application/minigame-binding-authoring.js");
const {
  launchFlowPlayable,
} = require("../.test-dist/application/playables/flow/flow-playable-definition.js");
const {
  presentFlowPlayable,
} = require("../.test-dist/application/playables/flow/flow-playable-presenter.js");
const {
  createLaunchPlayableRequest,
  resolvePlayableLaunchRequest,
} = require("../.test-dist/core/runtime/playable-runtime.js");

test("script editor playable instance options include story-battle with the rest of the builtin playables", () => {
  const options = listScriptEditorBuiltinMinigamePlayableOptions();

  assert.ok(options.some((option) => option.id === "activity-qte"));
  assert.ok(options.some((option) => option.id === "story-battle"));
});

test("playable launch resolution no longer exposes a family field", () => {
  const launch = resolvePlayableLaunchRequest({
    request: createLaunchPlayableRequest("activity-qte", {
      integrationId: "playable.activity-qte.dialogue.default",
      ownerContext: {
        ownerKind: "dialogue",
        ownerId: "dialogue.test.activity",
        returnPolicy: "resume-owner",
      },
      payload: {
        activityId: "activity.test",
      },
    }),
  });

  assert.equal(launch?.ok, true);
  assert.equal("family" in launch.launch, false);
});

test("flow playable session and presenter no longer expose a family field", () => {
  const session = launchFlowPlayable({
    definition: {
      id: "playable.test.flow",
      title: "Test Flow",
      initialNodeId: "intro",
      nodes: [
        {
          id: "intro",
          type: "text",
          text: "Intro text",
          nextNodeId: null,
        },
      ],
    },
    integrationId: "playable.test.flow.dialogue",
    ownerContext: {
      ownerKind: "dialogue",
      ownerId: "dialogue.test.flow",
      returnPolicy: "resume-owner",
    },
  });

  const presenter = presentFlowPlayable({
    definition: {
      id: "playable.test.flow",
      title: "Test Flow",
      initialNodeId: "intro",
      nodes: [
        {
          id: "intro",
          type: "text",
          text: "Intro text",
          nextNodeId: null,
        },
      ],
    },
    session,
  });

  assert.equal("family" in session, false);
  assert.equal("family" in presenter, false);
});
