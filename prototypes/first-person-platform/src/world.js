export const PLATFORM = Object.freeze({
  width: 24,
  depth: 80,
  height: 2,
  eyeHeight: 1.7,
  edgeMargin: 0.6,
});

export const PLAYER = Object.freeze({
  movementSpeed: 9,
  lookSensitivity: 0.002,
  pitchLimit: Math.PI / 2 - 0.02,
});

export function createInitialPlayerState() {
  return {
    yaw: 0,
    position: {
      x: 0,
      y: PLATFORM.eyeHeight,
      z: 0,
    },
  };
}

export function clampPlayerToPlatform(position) {
  const minX = -PLATFORM.width / 2 + PLATFORM.edgeMargin;
  const maxX = PLATFORM.width / 2 - PLATFORM.edgeMargin;
  const minZ = -PLATFORM.depth / 2 + PLATFORM.edgeMargin;
  const maxZ = PLATFORM.depth / 2 - PLATFORM.edgeMargin;

  return {
    x: Math.min(maxX, Math.max(minX, position.x)),
    y: PLATFORM.eyeHeight,
    z: Math.min(maxZ, Math.max(minZ, position.z)),
  };
}

export function updatePlayerPosition(state, movement, deltaSeconds) {
  const forwardIntent = Number(Boolean(movement.forward)) - Number(Boolean(movement.backward));
  const rightIntent = Number(Boolean(movement.right)) - Number(Boolean(movement.left));
  const intentLength = Math.hypot(forwardIntent, rightIntent);

  if (intentLength === 0 || deltaSeconds <= 0) {
    return {
      ...state,
      position: clampPlayerToPlatform(state.position),
    };
  }

  const forward = forwardIntent / intentLength;
  const right = rightIntent / intentLength;
  const distance = PLAYER.movementSpeed * deltaSeconds;
  const sinYaw = Math.sin(state.yaw);
  const cosYaw = Math.cos(state.yaw);

  const nextPosition = {
    x: state.position.x + (right * cosYaw + forward * sinYaw) * distance,
    y: PLATFORM.eyeHeight,
    z: state.position.z + (right * -sinYaw + forward * -cosYaw) * distance,
  };

  return {
    ...state,
    position: clampPlayerToPlatform(nextPosition),
  };
}

export function updateLookAngles(look, movementX, movementY) {
  const nextPitch = look.pitch - movementY * PLAYER.lookSensitivity;

  return {
    yaw: look.yaw - movementX * PLAYER.lookSensitivity,
    pitch: Math.min(PLAYER.pitchLimit, Math.max(-PLAYER.pitchLimit, nextPitch)),
  };
}
