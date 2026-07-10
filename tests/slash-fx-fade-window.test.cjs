const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

function extractFunctionBody(source, signature) {
  const start = source.indexOf(signature);
  if (start === -1) {
    throw new Error(`Missing signature: ${signature}`);
  }
  const bodyStart = source.indexOf("{", start);
  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return source.slice(bodyStart + 1, index);
      }
    }
  }
  throw new Error(`Unclosed function body for: ${signature}`);
}

function loadEditorSlashFxFns() {
  const source = fs.readFileSync("tools/spine-node-timeline-editor.html", "utf8");
  const visibilityBody = extractFunctionBody(source, "function slashFxVisibilityAtFrame(piece, frame = state.currentFrame)");
  const alphaBody = extractFunctionBody(source, "function slashFxAlphaAtFrame(piece, frame = state.currentFrame)");
  const state = { currentFrame: 0, slashFxActionHiddenMap: {} };
  const slashFxVisibilityTrackForPiece = (piece) => piece.track;
  const isSlashFxHiddenForCurrentAction = (piece) => Boolean(piece?.id && state.slashFxActionHiddenMap?.[piece.id]);
  const lastTrackEntryAtOrBefore = (track, frame) => {
    for (let index = track.length - 1; index >= 0; index -= 1) {
      if (track[index].frame <= frame) return track[index];
    }
    return null;
  };
  const firstTrackEntryAfter = (track, frame) => {
    for (let index = 0; index < track.length; index += 1) {
      if (track[index].frame > frame) return track[index];
    }
    return null;
  };
  const slashFxVisibilityAtFrame = new Function(
    "state",
    "slashFxVisibilityTrackForPiece",
    "isSlashFxHiddenForCurrentAction",
    "lastTrackEntryAtOrBefore",
    `return function slashFxVisibilityAtFrame(piece, frame = state.currentFrame) {${visibilityBody}};`,
  )(state, slashFxVisibilityTrackForPiece, isSlashFxHiddenForCurrentAction, lastTrackEntryAtOrBefore);
  const slashFxAlphaAtFrame = new Function(
    "state",
    "slashFxVisibilityTrackForPiece",
    "isSlashFxHiddenForCurrentAction",
    "lastTrackEntryAtOrBefore",
    "firstTrackEntryAfter",
    "slashFxVisibilityAtFrame",
    `return function slashFxAlphaAtFrame(piece, frame = state.currentFrame) {${alphaBody}};`,
  )(
    state,
    slashFxVisibilityTrackForPiece,
    isSlashFxHiddenForCurrentAction,
    lastTrackEntryAtOrBefore,
    firstTrackEntryAfter,
    slashFxVisibilityAtFrame,
  );
  return { state, slashFxVisibilityAtFrame, slashFxAlphaAtFrame };
}

function loadBattleSlashFxFns() {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  const hiddenBody = extractFunctionBody(source, "isSlashFxHiddenForAction(piece, action)");
  const visibilityBody = extractFunctionBody(source, "slashFxVisibilityAtFrame(piece, action, frame)");
  const alphaBody = extractFunctionBody(source, "slashFxAlphaAtFrame(piece, action, frame)");
  function isSlashFxHiddenForAction(piece, action) {
    return new Function(`return function isSlashFxHiddenForAction(piece, action) {${hiddenBody}};`)().call(
      this,
      piece,
      action,
    );
  }
  function slashFxVisibilityAtFrame(piece, action, frame) {
    return new Function(`return function slashFxVisibilityAtFrame(piece, action, frame) {${visibilityBody}};`)().call(
      this,
      piece,
      action,
      frame,
    );
  }
  function slashFxAlphaAtFrame(piece, action, frame) {
    return new Function(`return function slashFxAlphaAtFrame(piece, action, frame) {${alphaBody}};`)().call(
      this,
      piece,
      action,
      frame,
    );
  }
  return { isSlashFxHiddenForAction, slashFxVisibilityAtFrame, slashFxAlphaAtFrame };
}

function assertFadeEnvelope(runFns) {
  const assertAlpha = (frame, expected) => {
    assert.ok(Math.abs(runFns.alpha(piece, frame) - expected) < 1e-9);
  };
  const piece = {
    id: "slash-piece",
    track: [
      { frame: 22, visible: true },
      { frame: 24, visible: false },
    ],
  };
  assert.equal(runFns.visibility(piece, 18), false);
  assert.equal(runFns.visibility(piece, 21), false);
  assert.equal(runFns.visibility(piece, 22), true);
  assert.equal(runFns.visibility(piece, 23), true);
  assert.equal(runFns.visibility(piece, 24), false);
  assertAlpha(18, 0);
  assertAlpha(19, 0);
  assertAlpha(20, 0);
  assertAlpha(21, 0.5);
  assertAlpha(22, 1);
  assertAlpha(23, 1);
  assertAlpha(24, 1);
  assertAlpha(25, 4 / 5);
  assertAlpha(27, 2 / 5);
  assertAlpha(28, 1 / 5);
  assertAlpha(29, 0);
}

test("editor slash fx alpha uses two-frame appear and five-frame disappear envelope", () => {
  const { slashFxVisibilityAtFrame, slashFxAlphaAtFrame } = loadEditorSlashFxFns();
  assertFadeEnvelope({
    visibility: (piece, frame) => slashFxVisibilityAtFrame(piece, frame),
    alpha: (piece, frame) => slashFxAlphaAtFrame(piece, frame),
  });
});

test("editor action-level slash fx hidden override suppresses all slash fx visibility", () => {
  const { state, slashFxVisibilityAtFrame, slashFxAlphaAtFrame } = loadEditorSlashFxFns();
  const piece = {
    id: "slash-piece",
    track: [{ frame: 22, visible: true }],
  };
  state.slashFxActionHiddenMap[piece.id] = true;
  assert.equal(slashFxVisibilityAtFrame(piece, 22), false);
  assert.equal(slashFxAlphaAtFrame(piece, 22), 0);
});

test("battle demo slash fx alpha matches two-frame appear and five-frame disappear envelope", () => {
  const { isSlashFxHiddenForAction, slashFxVisibilityAtFrame, slashFxAlphaAtFrame } = loadBattleSlashFxFns();
  const runtime = {
    project: { duration: 29 },
    getSlashFxVisibilityTrackMap() {
      return {
        "slash-piece": [
          { frame: 22, visible: true },
          { frame: 24, visible: false },
        ],
      };
    },
    normalizeSlashFxVisibilityTrack(track) {
      return track || [];
    },
    getSlashFxActionHiddenMap() {
      return {};
    },
  };
  runtime.isSlashFxHiddenForAction = function isSlashFxHiddenForActionProxy(piece, action) {
    return isSlashFxHiddenForAction.call(runtime, piece, action);
  };
  runtime.slashFxVisibilityAtFrame = function slashFxVisibilityAtFrameProxy(piece, action, frame) {
    return slashFxVisibilityAtFrame.call(runtime, piece, action, frame);
  };
  assertFadeEnvelope({
    visibility: (piece, frame) => slashFxVisibilityAtFrame.call(runtime, piece, null, frame),
    alpha: (piece, frame) => slashFxAlphaAtFrame.call(runtime, piece, null, frame),
  });
});

test("battle demo action-level slash fx hidden override suppresses all slash fx visibility", () => {
  const { isSlashFxHiddenForAction, slashFxVisibilityAtFrame, slashFxAlphaAtFrame } = loadBattleSlashFxFns();
  const action = { slashFxActionHiddenMap: { "slash-piece": true } };
  const runtime = {
    project: { duration: 29 },
    getSlashFxVisibilityTrackMap() {
      return {
        "slash-piece": [{ frame: 22, visible: true }],
      };
    },
    getSlashFxActionHiddenMap(currentAction) {
      return currentAction?.slashFxActionHiddenMap || {};
    },
    normalizeSlashFxVisibilityTrack(track) {
      return track || [];
    },
  };
  runtime.isSlashFxHiddenForAction = function isSlashFxHiddenForActionProxy(piece, currentAction) {
    return isSlashFxHiddenForAction.call(runtime, piece, currentAction);
  };
  runtime.slashFxVisibilityAtFrame = function slashFxVisibilityAtFrameProxy(piece, currentAction, frame) {
    return slashFxVisibilityAtFrame.call(runtime, piece, currentAction, frame);
  };
  const piece = { id: "slash-piece" };
  assert.equal(slashFxVisibilityAtFrame.call(runtime, piece, action, 22), false);
  assert.equal(slashFxAlphaAtFrame.call(runtime, piece, action, 22), 0);
});
