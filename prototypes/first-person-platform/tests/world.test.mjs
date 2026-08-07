import assert from "node:assert/strict";
import test from "node:test";

import {
  PLATFORM,
  clampPlayerToPlatform,
  createInitialPlayerState,
  updateLookAngles,
  updatePlayerPosition,
} from "../src/world.js";

test("clamps player position inside the rectangular platform", () => {
  const position = clampPlayerToPlatform({ x: 100, y: 0, z: -100 });

  assert.equal(position.x, PLATFORM.width / 2 - PLATFORM.edgeMargin);
  assert.equal(position.z, -PLATFORM.depth / 2 + PLATFORM.edgeMargin);
});

test("moves forward relative to yaw and keeps eye height fixed", () => {
  const state = createInitialPlayerState();
  const next = updatePlayerPosition(state, { forward: true }, 1);

  assert.equal(next.position.y, PLATFORM.eyeHeight);
  assert.ok(next.position.z < state.position.z);
});

test("normalizes diagonal movement so it is not faster than straight movement", () => {
  const straight = updatePlayerPosition(createInitialPlayerState(), { forward: true }, 1);
  const diagonal = updatePlayerPosition(
    createInitialPlayerState(),
    { forward: true, right: true },
    1
  );

  const straightDistance = Math.hypot(straight.position.x, straight.position.z);
  const diagonalDistance = Math.hypot(diagonal.position.x, diagonal.position.z);

  assert.ok(Math.abs(straightDistance - diagonalDistance) < 0.000001);
});

test("keeps movement bounded after repeated input toward an edge", () => {
  let state = createInitialPlayerState();

  for (let index = 0; index < 100; index += 1) {
    state = updatePlayerPosition(state, { forward: true }, 0.1);
  }

  assert.equal(state.position.z, -PLATFORM.depth / 2 + PLATFORM.edgeMargin);
});

test("updates look angles and clamps vertical pitch", () => {
  const look = updateLookAngles({ yaw: 0, pitch: 0 }, 100, 100000);

  assert.ok(look.yaw < 0);
  assert.equal(look.pitch, -Math.PI / 2 + 0.02);
});
