import * as THREE from "three";

import "./style.css";
import {
  PLATFORM,
  clampPlayerToPlatform,
  createInitialPlayerState,
  updateLookAngles,
  updatePlayerPosition,
} from "./world.js";

const canvas = document.querySelector("#scene");
const startButton = document.querySelector("#start");
const hud = document.querySelector("#hud");

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  preserveDrawingBuffer: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x9fc7e6, 0.006);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.rotation.order = "YXZ";

const playerState = createInitialPlayerState();
let lookState = {
  yaw: playerState.yaw,
  pitch: -0.08,
};
camera.position.set(playerState.position.x, playerState.position.y, playerState.position.z);
applyCameraLook();

scene.add(createSkybox());
scene.add(createPlatform());
scene.add(createPlatformEdgeMarkers());

const sunlight = new THREE.DirectionalLight(0xfff1c9, 2.2);
sunlight.position.set(-18, 38, 22);
scene.add(sunlight);
scene.add(new THREE.HemisphereLight(0xddeeff, 0x5a4838, 1.2));

const movement = {
  forward: false,
  backward: false,
  left: false,
  right: false,
};
let controlsActive = false;
let usingPointerLock = false;

startButton.addEventListener("click", () => {
  enterControlMode();
});

window.addEventListener("mousemove", (event) => {
  if (!controlsActive) {
    return;
  }

  lookState = updateLookAngles(lookState, event.movementX, event.movementY);
  applyCameraLook();
});

document.addEventListener("pointerlockchange", () => {
  if (document.pointerLockElement === canvas) {
    usingPointerLock = true;
    setControlMode(true);
    return;
  }

  if (usingPointerLock) {
    usingPointerLock = false;
    setControlMode(false);
  }
});

window.addEventListener("keydown", (event) => {
  if (event.code === "Escape") {
    exitControlMode();
    return;
  }

  setMovementKey(event.code, true);
});

window.addEventListener("keyup", (event) => {
  setMovementKey(event.code, false);
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const deltaSeconds = Math.min(clock.getDelta(), 0.05);
  const nextState = updatePlayerPosition(
    {
      yaw: lookState.yaw,
      position: {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
      },
    },
    movement,
    deltaSeconds
  );

  const clampedPosition = clampPlayerToPlatform(nextState.position);
  camera.position.set(clampedPosition.x, clampedPosition.y, clampedPosition.z);

  renderer.render(scene, camera);
}

animate();

function setMovementKey(code, isPressed) {
  switch (code) {
    case "KeyW":
    case "ArrowUp":
      movement.forward = isPressed;
      break;
    case "KeyS":
    case "ArrowDown":
      movement.backward = isPressed;
      break;
    case "KeyA":
    case "ArrowLeft":
      movement.left = isPressed;
      break;
    case "KeyD":
    case "ArrowRight":
      movement.right = isPressed;
      break;
    default:
      return;
  }
}

function enterControlMode() {
  setControlMode(true);

  if (typeof canvas.requestPointerLock !== "function") {
    return;
  }

  const lockRequest = canvas.requestPointerLock();

  if (lockRequest && typeof lockRequest.catch === "function") {
    lockRequest.catch(() => {
      usingPointerLock = false;
    });
  }
}

function exitControlMode() {
  if (document.pointerLockElement === canvas && typeof document.exitPointerLock === "function") {
    document.exitPointerLock();
    return;
  }

  setControlMode(false);
}

function setControlMode(isActive) {
  controlsActive = isActive;
  startButton.classList.toggle("is-hidden", isActive);
  hud.classList.toggle("is-active", isActive);
}

function applyCameraLook() {
  camera.rotation.x = lookState.pitch;
  camera.rotation.y = lookState.yaw;
}

function createPlatform() {
  const platformTexture = createPlatformTexture();
  platformTexture.wrapS = THREE.RepeatWrapping;
  platformTexture.wrapT = THREE.RepeatWrapping;
  platformTexture.repeat.set(6, 20);

  const topMaterial = new THREE.MeshStandardMaterial({
    map: platformTexture,
    roughness: 0.82,
    metalness: 0.04,
  });
  const sideMaterial = new THREE.MeshStandardMaterial({
    color: 0x5f6a62,
    roughness: 0.9,
  });

  const platform = new THREE.Mesh(
    new THREE.BoxGeometry(PLATFORM.width, PLATFORM.height, PLATFORM.depth),
    [sideMaterial, sideMaterial, topMaterial, sideMaterial, sideMaterial, sideMaterial]
  );
  platform.position.y = -PLATFORM.height / 2;
  platform.receiveShadow = true;
  return platform;
}

function createPlatformEdgeMarkers() {
  const group = new THREE.Group();
  const material = new THREE.MeshBasicMaterial({ color: 0xf2cf7b });
  const markerGeometry = new THREE.BoxGeometry(0.18, 0.18, PLATFORM.depth);

  const left = new THREE.Mesh(markerGeometry, material);
  left.position.set(-PLATFORM.width / 2, 0.12, 0);
  group.add(left);

  const right = new THREE.Mesh(markerGeometry, material);
  right.position.set(PLATFORM.width / 2, 0.12, 0);
  group.add(right);

  const endGeometry = new THREE.BoxGeometry(PLATFORM.width, 0.18, 0.18);
  const near = new THREE.Mesh(endGeometry, material);
  near.position.set(0, 0.12, PLATFORM.depth / 2);
  group.add(near);

  const far = new THREE.Mesh(endGeometry, material);
  far.position.set(0, 0.12, -PLATFORM.depth / 2);
  group.add(far);

  return group;
}

function createSkybox() {
  const geometry = new THREE.BoxGeometry(900, 900, 900);
  const materials = [
    createSkyMaterial("right"),
    createSkyMaterial("left"),
    createSkyMaterial("top"),
    createSkyMaterial("bottom"),
    createSkyMaterial("front"),
    createSkyMaterial("back"),
  ];
  const skybox = new THREE.Mesh(geometry, materials);
  skybox.renderOrder = -1;
  return skybox;
}

function createSkyMaterial(label) {
  const texture = createSkyTexture(label);
  return new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.BackSide,
    depthWrite: false,
  });
}

function createSkyTexture(label) {
  const size = 512;
  const skyCanvas = document.createElement("canvas");
  skyCanvas.width = size;
  skyCanvas.height = size;

  const context = skyCanvas.getContext("2d");
  const gradient = context.createLinearGradient(0, 0, 0, size);
  gradient.addColorStop(0, label === "top" ? "#4b85c9" : "#7bb6e4");
  gradient.addColorStop(0.55, "#c8e5f4");
  gradient.addColorStop(1, label === "bottom" ? "#d7cba7" : "#edf6fb");
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  context.globalAlpha = label === "top" ? 0.18 : 0.12;
  for (let index = 0; index < 70; index += 1) {
    const x = (index * 97) % size;
    const y = (index * 53) % Math.floor(size * 0.55);
    const radius = 18 + ((index * 11) % 42);
    context.beginPath();
    context.ellipse(x, y + 48, radius * 1.8, radius * 0.45, 0, 0, Math.PI * 2);
    context.fillStyle = "#ffffff";
    context.fill();
  }

  const texture = new THREE.CanvasTexture(skyCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createPlatformTexture() {
  const size = 256;
  const platformCanvas = document.createElement("canvas");
  platformCanvas.width = size;
  platformCanvas.height = size;

  const context = platformCanvas.getContext("2d");
  context.fillStyle = "#66746c";
  context.fillRect(0, 0, size, size);

  context.strokeStyle = "#8c9a91";
  context.lineWidth = 2;
  for (let value = 0; value <= size; value += 32) {
    context.beginPath();
    context.moveTo(value, 0);
    context.lineTo(value, size);
    context.moveTo(0, value);
    context.lineTo(size, value);
    context.stroke();
  }

  context.globalAlpha = 0.28;
  context.fillStyle = "#d5c07f";
  for (let index = 0; index < 24; index += 1) {
    context.fillRect((index * 41) % size, (index * 67) % size, 3, 3);
  }

  const texture = new THREE.CanvasTexture(platformCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
