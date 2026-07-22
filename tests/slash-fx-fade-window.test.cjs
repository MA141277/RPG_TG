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

function loadEditorSlashFxEditorVisibilityFns() {
  const source = fs.readFileSync("tools/spine-node-timeline-editor.html", "utf8");
  const visibilityBody = extractFunctionBody(source, "function slashFxVisibilityAtFrame(piece, frame = state.currentFrame)");
  const alphaBody = extractFunctionBody(source, "function slashFxAlphaAtFrame(piece, frame = state.currentFrame)");
  const effectiveAttachmentAlphaBody = extractFunctionBody(
    source,
    "function effectiveAttachmentAlpha(node, frame = state.currentFrame)",
  );
  const isNodeVisibleAtFrameBody = extractFunctionBody(source, "function isNodeVisibleAtFrame(node, frame = state.currentFrame)");
  const state = {
    currentFrame: 0,
    selectedNodeId: "slash-node",
    selectedPieceNodeId: "slash-piece",
    slashFxActionHiddenMap: {},
  };
  const slashFxPiece = { id: "slash-piece", attachment: { alpha: 1 }, role: "slash-fx-piece" };
  const slashFxBone = { id: "slash-node", role: "slash-fx" };
  const slashFxVisibilityTrackForPiece = (piece) => piece.track || [];
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
  const slashFxPieceForNode = (node) => {
    if (!node) return null;
    if (node.id === slashFxPiece.id || node.id === slashFxBone.id) return slashFxPiece;
    return null;
  };
  const arrowPieceForNode = () => null;
  const arrowVisibilityAtFrame = () => false;
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
  const effectiveAttachmentAlpha = new Function(
    "state",
    "isBindingMode",
    "slashFxPieceForNode",
    "slashFxAlphaAtFrame",
    `return function effectiveAttachmentAlpha(node, frame = state.currentFrame) {${effectiveAttachmentAlphaBody}};`,
  )(state, () => false, slashFxPieceForNode, slashFxAlphaAtFrame);
  const effectiveAttachmentAlphaInBinding = new Function(
    "state",
    "isBindingMode",
    "slashFxPieceForNode",
    "slashFxAlphaAtFrame",
    `return function effectiveAttachmentAlpha(node, frame = state.currentFrame) {${effectiveAttachmentAlphaBody}};`,
  )(state, () => true, slashFxPieceForNode, slashFxAlphaAtFrame);
  const isNodeVisibleAtFrame = new Function(
    "state",
    "isBindingMode",
    "arrowPieceForNode",
    "arrowVisibilityAtFrame",
    "slashFxPieceForNode",
    "slashFxAlphaAtFrame",
    `return function isNodeVisibleAtFrame(node, frame = state.currentFrame) {${isNodeVisibleAtFrameBody}};`,
  )(state, () => false, arrowPieceForNode, arrowVisibilityAtFrame, slashFxPieceForNode, slashFxAlphaAtFrame);
  return {
    state,
    slashFxPiece,
    slashFxBone,
    effectiveAttachmentAlpha,
    effectiveAttachmentAlphaInBinding,
    isNodeVisibleAtFrame,
  };
}

function loadEditorSlashFxWriteFns() {
  const source = fs.readFileSync("tools/spine-node-timeline-editor.html", "utf8");
  const normalizeBody = extractFunctionBody(source, "function normalizeSlashFxVisibilityTrack(track, duration = state.duration)");
  const slashEffectContextBody = extractFunctionBody(source, "function slashEffectContext()");
  const setBody = extractFunctionBody(source, "function setSelectedSlashFxVisibilityAtCurrentFrame(visible)");
  const resetBody = extractFunctionBody(source, "function resetSelectedSlashFxVisibilityForCurrentAction()");
  const state = {
    currentFrame: 0,
    duration: 95,
    currentUnitType: "swordsman",
    selectedNodeId: null,
    selectedPieceNodeId: null,
    selectedKey: null,
    slashFxVisibilityTracks: {},
    slashFxActionHiddenMap: {},
  };
  const clampFrameToDuration = (frame, duration = state.duration) => {
    const numericFrame = Number.isFinite(Number(frame)) ? Math.round(Number(frame)) : 0;
    return Math.max(0, Math.min(duration, numericFrame));
  };
  const normalizeSlashFxVisibilityTrack = new Function(
    "state",
    "clampFrameToDuration",
    `return function normalizeSlashFxVisibilityTrack(track, duration = state.duration) {${normalizeBody}};`,
  )(state, clampFrameToDuration);
  const slashEffectContext = new Function(
    "state",
    `return function slashEffectContext() {${slashEffectContextBody}};`,
  )(state);
  const piece = { id: "slash-piece" };
  const selectedSlashFxPiece = () => piece;
  const slashFxRigNodesForPiece = () => [{ id: "slash-node" }];
  const setSelectedSlashFxVisibilityAtCurrentFrame = new Function(
    "state",
    "isBindingMode",
    "selectedSlashFxPiece",
    "slashFxRigNodesForPiece",
    "normalizeSlashFxVisibilityTrack",
    "slashEffectContext",
    "renderAll",
    "toast",
    `return function setSelectedSlashFxVisibilityAtCurrentFrame(visible) {${setBody}};`,
  )(
    state,
    () => false,
    selectedSlashFxPiece,
    slashFxRigNodesForPiece,
    normalizeSlashFxVisibilityTrack,
    slashEffectContext,
    () => {},
    () => {},
  );
  const resetSelectedSlashFxVisibilityForCurrentAction = new Function(
    "state",
    "isBindingMode",
    "selectedSlashFxPiece",
    "slashFxRigNodesForPiece",
    "normalizeSlashFxVisibilityTrack",
    "slashEffectContext",
    "renderAll",
    "toast",
    `return function resetSelectedSlashFxVisibilityForCurrentAction() {${resetBody}};`,
  )(
    state,
    () => false,
    selectedSlashFxPiece,
    slashFxRigNodesForPiece,
    normalizeSlashFxVisibilityTrack,
    slashEffectContext,
    () => {},
    () => {},
  );
  return { state, piece, setSelectedSlashFxVisibilityAtCurrentFrame, resetSelectedSlashFxVisibilityForCurrentAction };
}

function loadEditorApplyProjectDataFn() {
  const source = fs.readFileSync("tools/spine-node-timeline-editor.html", "utf8");
  const signature = "function applyProjectData(data, options = {})";
  const start = source.indexOf(signature);
  if (start === -1) {
    throw new Error(`Missing signature: ${signature}`);
  }
  const bodyStart = source.indexOf("{", start + signature.length);
  let depth = 0;
  let bodyEnd = -1;
  for (let index = bodyStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        bodyEnd = index;
        break;
      }
    }
  }
  if (bodyStart === -1 || bodyEnd === -1) {
    throw new Error(`Unclosed function body for: ${signature}`);
  }
  const applyProjectDataBody = source.slice(bodyStart + 1, bodyEnd);
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const state = {
    name: "",
    fps: 24,
    duration: 0,
    currentFrame: 0,
    currentUnitType: "swordsman",
    selectedNodeId: null,
    selectedKey: null,
    selectedPieceNodeId: null,
    bindingBoneTool: null,
    pendingFreeBoneStart: null,
    playing: false,
    arrowVisibilityTracks: {},
    arrowParentTracks: {},
    slashFxVisibilityTracks: {},
    slashFxParentTracks: {},
    slashFxActionHiddenMap: {},
    nodes: [],
    timelines: {},
    actions: [],
    selectedActionId: null,
  };
  const applyProjectData = new Function(
    "state",
    "uid",
    "dynamicScarves",
    "cloneArrowVisibilityTracks",
    "cloneArrowParentTracks",
    "cloneSlashFxVisibilityTracks",
    "cloneSlashFxParentTracks",
    "cloneSlashFxActionHiddenMap",
    "restoreCustomImages",
    "normalizeBindPose",
    "normalizeBowRig",
    "normalizeAttachment",
    "restoreLegAssetImages",
    "normalizeTimelineMap",
    "normalizeActions",
    "cloneTimelines",
    "createActionSnapshot",
    "migrateLegacySwordAttachments",
    "hydrateBowRigSerializedKeys",
    "hydrateBowRigTimelineMap",
    `return function applyProjectData(data, options = {}) {${applyProjectDataBody}};`,
  )(
    state,
    () => "node_uid",
    { clear() {} },
    (tracks) => clone(tracks || {}),
    (tracks) => clone(tracks || {}),
    (tracks) => clone(tracks || {}),
    (tracks) => clone(tracks || {}),
    (map) => clone(map || {}),
    () => {},
    (pose) => pose,
    (bowRig) => bowRig || null,
    (attachment) => attachment || null,
    () => {},
    (timelines) => clone(timelines || {}),
    (actions) => clone(actions || []),
    (timelines) => clone(timelines || {}),
    () => ({ id: "fallback-action" }),
    () => {},
    () => {},
    () => {},
  );
  return { state, applyProjectData };
}

function loadEditorActionNormalizationFns() {
  const source = fs.readFileSync("tools/spine-node-timeline-editor.html", "utf8");
  const normalizeSlashFxVisibilityTrackBody = extractFunctionBody(
    source,
    "function normalizeSlashFxVisibilityTrack(track, duration = state.duration)",
  );
  const cloneSlashFxVisibilityTracksSignature =
    source.includes("function cloneSlashFxVisibilityTracks(tracks, duration = state.duration)")
      ? "function cloneSlashFxVisibilityTracks(tracks, duration = state.duration)"
      : "function cloneSlashFxVisibilityTracks(tracks)";
  const cloneSlashFxVisibilityTracksBody = extractFunctionBody(source, cloneSlashFxVisibilityTracksSignature);
  const normalizeActionsBody = extractFunctionBody(source, "function normalizeActions(actions)");
  const state = { duration: 29 };
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const clampFrameToDuration = (frame, duration = state.duration) => {
    const numericFrame = Number.isFinite(Number(frame)) ? Math.round(Number(frame)) : 0;
    return Math.max(0, Math.min(duration, numericFrame));
  };
  const normalizeSlashFxVisibilityTrack = new Function(
    "state",
    "clampFrameToDuration",
    `return function normalizeSlashFxVisibilityTrack(track, duration = state.duration) {${normalizeSlashFxVisibilityTrackBody}};`,
  )(state, clampFrameToDuration);
  const cloneSlashFxVisibilityTracks = new Function(
    "state",
    "normalizeSlashFxVisibilityTrack",
    `return function cloneSlashFxVisibilityTracks(tracks, duration = state.duration) {${cloneSlashFxVisibilityTracksBody}};`,
  )(state, normalizeSlashFxVisibilityTrack);
  const normalizeActions = new Function(
    "state",
    "uid",
    "normalizeTimelineMap",
    "cloneArrowVisibilityTracks",
    "cloneArrowParentTracks",
    "cloneSlashFxVisibilityTracks",
    "cloneSlashFxParentTracks",
    "cloneSlashFxActionHiddenMap",
    `return function normalizeActions(actions) {${normalizeActionsBody}};`,
  )(
    state,
    () => "action_uid",
    (timelines) => clone(timelines || {}),
    (tracks) => clone(tracks || {}),
    (tracks) => clone(tracks || {}),
    cloneSlashFxVisibilityTracks,
    (tracks) => clone(tracks || {}),
    (map) => clone(map || {}),
  );
  return { state, normalizeActions };
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

test("editor slash fx defaults to hidden when an action has no visibility track", () => {
  const { slashFxVisibilityAtFrame, slashFxAlphaAtFrame } = loadEditorSlashFxFns();
  const piece = { id: "slash-piece", track: [] };
  assert.equal(slashFxVisibilityAtFrame(piece, 0), false);
  assert.equal(slashFxVisibilityAtFrame(piece, 12), false);
  assert.equal(slashFxAlphaAtFrame(piece, 0), 0);
  assert.equal(slashFxAlphaAtFrame(piece, 12), 0);
});

test("editor slash fx show key after reset seeds a hidden baseline before the first explicit appear", () => {
  const { state, piece, setSelectedSlashFxVisibilityAtCurrentFrame, resetSelectedSlashFxVisibilityForCurrentAction } = loadEditorSlashFxWriteFns();
  const { slashFxVisibilityAtFrame, slashFxAlphaAtFrame } = loadEditorSlashFxFns();
  resetSelectedSlashFxVisibilityForCurrentAction();

  state.currentFrame = 24;
  setSelectedSlashFxVisibilityAtCurrentFrame(false);
  state.currentFrame = 22;
  setSelectedSlashFxVisibilityAtCurrentFrame(true);

  assert.deepEqual(state.slashFxVisibilityTracks[piece.id], [
    { frame: 0, visible: false },
    { frame: 22, visible: true },
    { frame: 24, visible: false },
  ]);

  const trackedPiece = { id: piece.id, track: state.slashFxVisibilityTracks[piece.id] };
  assert.equal(slashFxVisibilityAtFrame(trackedPiece, 19), false);
  assert.equal(slashFxVisibilityAtFrame(trackedPiece, 21), false);
  assert.equal(slashFxVisibilityAtFrame(trackedPiece, 22), true);
  assert.equal(slashFxAlphaAtFrame(trackedPiece, 20), 0);
  assert.equal(slashFxAlphaAtFrame(trackedPiece, 21), 0.5);
  assert.equal(slashFxAlphaAtFrame(trackedPiece, 22), 1);
});

test("editor slash fx reset defaults the action baseline to hidden", () => {
  const { state, piece, resetSelectedSlashFxVisibilityForCurrentAction } = loadEditorSlashFxWriteFns();
  const { slashFxVisibilityAtFrame, slashFxAlphaAtFrame } = loadEditorSlashFxFns();
  state.slashFxVisibilityTracks[piece.id] = [{ frame: 0, visible: true }, { frame: 10, visible: false }];

  resetSelectedSlashFxVisibilityForCurrentAction();

  assert.deepEqual(state.slashFxVisibilityTracks[piece.id], [{ frame: 0, visible: false }]);
  const trackedPiece = { id: piece.id, track: state.slashFxVisibilityTracks[piece.id] };
  assert.equal(slashFxVisibilityAtFrame(trackedPiece, 0), false);
  assert.equal(slashFxAlphaAtFrame(trackedPiece, 0), 0);
});

test("editor project load hydrates the selected action slash fx track into the live stage state", () => {
  const { state, applyProjectData } = loadEditorApplyProjectDataFn();
  const selectedTrack = [
    { frame: 0, visible: false },
    { frame: 22, visible: true },
    { frame: 24, visible: false },
  ];

  applyProjectData({
    name: "test",
    fps: 24,
    duration: 95,
    nodes: [{ id: "root", name: "root", x: 0, y: 0, rotation: 0, length: 80, scaleX: 1, scaleY: 1 }],
    timelines: { root: [{ frame: 0, x: 0, y: 0, rotation: 0, length: 80, scaleX: 1, scaleY: 1 }] },
    slashFxVisibilityTracks: {
      "slash-piece": [{ frame: 0, visible: true }],
    },
    actions: [
      {
        id: "jump",
        name: "jump",
        duration: 95,
        timelines: { root: [{ frame: 0, x: 10, y: 0, rotation: 0, length: 80, scaleX: 1, scaleY: 1 }] },
        slashFxVisibilityTracks: {
          "slash-piece": selectedTrack,
        },
      },
    ],
    selectedActionId: "jump",
  });

  assert.equal(state.selectedActionId, "jump");
  assert.deepEqual(state.slashFxVisibilityTracks["slash-piece"], selectedTrack);
  assert.deepEqual(state.timelines.root, [{ frame: 0, x: 10, y: 0, rotation: 0, length: 80, scaleX: 1, scaleY: 1 }]);
});

test("editor action normalization preserves long-duration slash fx frames instead of clamping them to the top-level duration", () => {
  const { normalizeActions } = loadEditorActionNormalizationFns();
  const track = [
    { frame: 0, visible: false },
    { frame: 41, visible: true },
    { frame: 43, visible: false },
  ];

  const [action] = normalizeActions([
    {
      id: "action-cq1nlp",
      name: "跳劈",
      duration: 69,
      timelines: {},
      slashFxVisibilityTracks: {
        "slash-piece": track,
      },
      slashFxParentTracks: {},
      slashFxActionHiddenMap: {},
    },
  ]);

  assert.equal(action.duration, 69);
  assert.deepEqual(action.slashFxVisibilityTracks["slash-piece"], track);
});

test("editor binding mode keeps slash fx attachments visible even before any visibility keyframes exist", () => {
  const { slashFxPiece, effectiveAttachmentAlphaInBinding } = loadEditorSlashFxEditorVisibilityFns();
  slashFxPiece.track = [];

  assert.equal(effectiveAttachmentAlphaInBinding(slashFxPiece, 0), 1);
});

test("editor animation mode keeps the currently selected slash fx rig visible for editing even when the action track is still empty", () => {
  const { slashFxPiece, slashFxBone, isNodeVisibleAtFrame } = loadEditorSlashFxEditorVisibilityFns();
  slashFxPiece.track = [];

  assert.equal(isNodeVisibleAtFrame(slashFxBone, 0), true);
  assert.equal(isNodeVisibleAtFrame(slashFxPiece, 0), true);
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

test("battle demo slash fx defaults to hidden when an action has no visibility track", () => {
  const { isSlashFxHiddenForAction, slashFxVisibilityAtFrame, slashFxAlphaAtFrame } = loadBattleSlashFxFns();
  const runtime = {
    project: { duration: 29 },
    getSlashFxVisibilityTrackMap() {
      return {};
    },
    getSlashFxActionHiddenMap() {
      return {};
    },
    normalizeSlashFxVisibilityTrack(track) {
      return track || [];
    },
  };
  runtime.isSlashFxHiddenForAction = function isSlashFxHiddenForActionProxy(piece, action) {
    return isSlashFxHiddenForAction.call(runtime, piece, action);
  };
  runtime.slashFxVisibilityAtFrame = function slashFxVisibilityAtFrameProxy(piece, action, frame) {
    return slashFxVisibilityAtFrame.call(runtime, piece, action, frame);
  };
  const piece = { id: "slash-piece" };
  assert.equal(slashFxVisibilityAtFrame.call(runtime, piece, null, 0), false);
  assert.equal(slashFxVisibilityAtFrame.call(runtime, piece, null, 12), false);
  assert.equal(slashFxAlphaAtFrame.call(runtime, piece, null, 0), 0);
  assert.equal(slashFxAlphaAtFrame.call(runtime, piece, null, 12), 0);
});
