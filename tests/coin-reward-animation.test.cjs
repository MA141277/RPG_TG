const test = require("node:test");
const assert = require("node:assert/strict");

function createFakeLayer() {
  return {
    children: [],
    style: {},
    clientWidth: 400,
    clientHeight: 240,
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 400, height: 240 }),
    appendChild(child) {
      child.parentNode = this;
      this.children.push(child);
      return child;
    },
    removeChild(child) {
      child.parentNode = null;
      this.children = this.children.filter((entry) => entry !== child);
      return child;
    },
    ownerDocument: {
      createElement(tagName) {
        return {
          tagName,
          style: {},
          className: "",
          dataset: {},
          src: "",
          parentNode: null,
          children: [],
          setAttribute(name, value) {
            this[name] = value;
          },
          appendChild(child) {
            child.parentNode = this;
            this.children.push(child);
            return child;
          },
          remove() {
            if (this.parentNode) {
              this.parentNode.removeChild(this);
            }
          },
        };
      },
    },
  };
}

function createDeterministicRandom(values) {
  let index = 0;
  return () => {
    const nextValue = values[index % values.length];
    index += 1;
    return nextValue;
  };
}

function parsePx(value) {
  return Number.parseFloat(String(value ?? "0").replace("px", ""));
}

function captureNodePositions(layer) {
  return layer.children.map((node) => ({
    x: parsePx(node.style.left),
    y: parsePx(node.style.top),
  }));
}

function findIngotNodes(layer) {
  return layer.children.filter((node) => node?.dataset?.uiCoinRewardAnchorDebug !== "true");
}

function getDistance(from, to) {
  return Math.hypot(to.x - from.x, to.y - from.y);
}

test("coin reward animator waits until gather starts before rolling the display value", async () => {
  const { createCoinRewardAnimator } = await import("../src/ui/animations/coin-reward-animation.ts");
  const originalRandom = Math.random;
  const fakeLayer = createFakeLayer();
  const fakeSource = {
    getBoundingClientRect: () => ({ left: 10, top: 10, width: 20, height: 20 }),
  };
  const fakeTarget = {
    getBoundingClientRect: () => ({ left: 100, top: 20, width: 40, height: 20 }),
  };
  const seenValues = [];

  Math.random = createDeterministicRandom([0.13, 0.62, 0.29, 0.84, 0.41, 0.57]);

  try {
    const animator = createCoinRewardAnimator({
      layer: fakeLayer,
      onDisplayValueChange(value) {
        seenValues.push(value);
      },
    });

    animator.setGoldTargetElement(fakeTarget);
    animator.play({
      sourceElement: fakeSource,
      startValue: 10,
      targetValue: 20,
      amount: 10,
    });

    assert.deepEqual(seenValues, []);

    await new Promise((resolve) => setTimeout(resolve, 400));
    assert.deepEqual(seenValues, []);

    await new Promise((resolve) => setTimeout(resolve, 2200));
    assert.ok(seenValues.length > 0);
    assert.ok(seenValues.some((value) => typeof value === "number" && value > 10));
  } finally {
    Math.random = originalRandom;
  }
});

test("coin reward animator emits burst immediately and collect once right before the gold number starts rising", async () => {
  const { createCoinRewardAnimator } = await import("../src/ui/animations/coin-reward-animation.ts");
  const originalRandom = Math.random;
  const fakeLayer = createFakeLayer();
  const fakeSource = {
    getBoundingClientRect: () => ({ left: 340, top: 200, width: 20, height: 20 }),
  };
  const fakeTarget = {
    getBoundingClientRect: () => ({ left: 20, top: 20, width: 20, height: 20 }),
  };
  const timeline = [];

  Math.random = createDeterministicRandom([0.13, 0.62, 0.29, 0.84, 0.41, 0.57]);

  try {
    const animator = createCoinRewardAnimator({
      layer: fakeLayer,
      onDisplayValueChange(value) {
        if (typeof value === "number" && value > 10) {
          timeline.push(`display:${value}`);
        }
      },
      soundPlayer: {
        play(event) {
          timeline.push(`sound:${event}`);
        },
      },
    });

    animator.setGoldTargetElement(fakeTarget);
    animator.play({
      sourceElement: fakeSource,
      startValue: 10,
      targetValue: 20,
      amount: 10,
    });

    assert.deepEqual(timeline, ["sound:burst"]);

    await new Promise((resolve) => setTimeout(resolve, 2200));

    const collectEvents = timeline.filter((entry) => entry === "sound:collect");
    const collectIndex = timeline.indexOf("sound:collect");
    const firstDisplayIndex = timeline.findIndex((entry) =>
      entry.startsWith("display:")
    );

    assert.equal(collectEvents.length, 1);
    assert.ok(collectIndex > 0);
    assert.ok(firstDisplayIndex > collectIndex);
  } finally {
    Math.random = originalRandom;
  }
});

test("coin reward animator changes burst scatter when random input changes", async () => {
  const { createCoinRewardAnimator } = await import("../src/ui/animations/coin-reward-animation.ts");
  const originalRandom = Math.random;
  const fakeSource = {
    getBoundingClientRect: () => ({ left: 10, top: 10, width: 20, height: 20 }),
  };
  const fakeTarget = {
    getBoundingClientRect: () => ({ left: 100, top: 20, width: 40, height: 20 }),
  };

  const collectBurstPositions = async (sequence) => {
    Math.random = createDeterministicRandom(sequence);
    const fakeLayer = createFakeLayer();
    const animator = createCoinRewardAnimator({
      layer: fakeLayer,
      onDisplayValueChange() {},
    });

    animator.setGoldTargetElement(fakeTarget);
    animator.play({
      sourceElement: fakeSource,
      startValue: 10,
      targetValue: 20,
      amount: 10,
    });

    await new Promise((resolve) => setTimeout(resolve, 32));
    return fakeLayer.children.map((node) => `${node.style.left}|${node.style.top}`);
  };

  try {
    const burstPositionsA = await collectBurstPositions([0.1, 0.2, 0.3, 0.4, 0.5, 0.6]);
    const burstPositionsB = await collectBurstPositions([0.9, 0.8, 0.7, 0.6, 0.5, 0.4]);

    assert.notDeepEqual(burstPositionsA, burstPositionsB);
  } finally {
    Math.random = originalRandom;
  }
});

test("coin reward animator points straight-flight velocity along the button-center-to-anchor line", async () => {
  const { __coinRewardTestUtils } = await import("../src/ui/animations/coin-reward-animation.ts");
  const sourceCenter = { x: 310, y: 190 };
  const targetCenter = { x: 10, y: 230 };
  const baselineAngle = Math.atan2(
    targetCenter.y - sourceCenter.y,
    targetCenter.x - sourceCenter.x
  );
  const velocity = __coinRewardTestUtils.createStraightFlightVelocity(sourceCenter, targetCenter);
  const velocityAngle = Math.atan2(velocity.y, velocity.x);
  const angleDelta = Math.abs(
    Math.atan2(Math.sin(velocityAngle - baselineAngle), Math.cos(velocityAngle - baselineAngle))
  );

  assert.ok(angleDelta < 0.000001);
  assert.equal(Math.round(Math.hypot(velocity.x, velocity.y) * 1000) / 1000, 1.5);
});

test("coin reward animator renders simulated ingot nodes without texture assets", async () => {
  const { createCoinRewardAnimator } = await import("../src/ui/animations/coin-reward-animation.ts");
  const fakeLayer = createFakeLayer();
  const fakeSource = {
    getBoundingClientRect: () => ({ left: 10, top: 10, width: 20, height: 20 }),
  };

  const animator = createCoinRewardAnimator({
    layer: fakeLayer,
    onDisplayValueChange() {},
  });

  animator.play({
    sourceElement: fakeSource,
    startValue: 10,
    targetValue: 20,
    amount: 10,
  });

  const firstIngot = findIngotNodes(fakeLayer)[0];
  assert.equal(firstIngot?.tagName, "div");
  assert.match(firstIngot?.style.backgroundImage ?? "", /\.png/i);
  assert.equal(firstIngot?.style.backgroundRepeat, "no-repeat");
  assert.equal(firstIngot?.style.backgroundSize, "contain");
});

test("coin reward animator keeps the anchor debug marker hidden while still resolving the configured anchor point", async () => {
  const { createCoinRewardAnimator } = await import("../src/ui/animations/coin-reward-animation.ts");
  const fakeLayer = createFakeLayer();
  const fakeTarget = {
    getBoundingClientRect: () => ({ left: 20, top: 20, width: 20, height: 20 }),
  };

  const animator = createCoinRewardAnimator({
    layer: fakeLayer,
    onDisplayValueChange() {},
  });

  animator.setGoldTargetElement(fakeTarget);

  const anchorNode = fakeLayer.children.find(
    (node) => node?.dataset?.uiCoinRewardAnchorDebug === "true"
  );
  assert.ok(anchorNode);
  assert.equal(anchorNode?.style.left, "-121px");
  assert.equal(anchorNode?.style.top, "55px");
  assert.equal(anchorNode?.style.display, "none");
});

test("coin reward animator removes individual ingots as soon as their centers reach the convergence point", async () => {
  const { createCoinRewardAnimator } = await import("../src/ui/animations/coin-reward-animation.ts");
  const originalRandom = Math.random;
  const fakeLayer = createFakeLayer();
  const fakeSource = {
    getBoundingClientRect: () => ({ left: 300, top: 180, width: 20, height: 20 }),
  };
  const fakeTarget = {
    getBoundingClientRect: () => ({ left: 20, top: 20, width: 20, height: 20 }),
  };

  Math.random = createDeterministicRandom([0.13, 0.62, 0.29, 0.84, 0.41, 0.57]);

  try {
    const animator = createCoinRewardAnimator({
      layer: fakeLayer,
      onDisplayValueChange() {},
    });

    animator.setGoldTargetElement(fakeTarget);
    animator.play({
      sourceElement: fakeSource,
      startValue: 10,
      targetValue: 20,
      amount: 10,
    });

    const initialCount = findIngotNodes(fakeLayer).length;
    assert.equal(initialCount, 10);

    await new Promise((resolve) => setTimeout(resolve, 600));
    const remainingIngots = findIngotNodes(fakeLayer).length;
    assert.ok(remainingIngots < initialCount);
    assert.ok(remainingIngots > 0);

    await new Promise((resolve) => setTimeout(resolve, 400));
    assert.equal(findIngotNodes(fakeLayer).length, 0);
  } finally {
    Math.random = originalRandom;
  }
});

test("coin reward animator converges in a straight line toward the anchor after entering gather range", async () => {
  const { __coinRewardTestUtils } = await import("../src/ui/animations/coin-reward-animation.ts");
  const nextPoint = __coinRewardTestUtils.advanceDirectConvergencePoint(
    { x: 0, y: 0 },
    { x: 30, y: 40 },
    20
  );

  assert.equal(Math.round(nextPoint.x * 1000) / 1000, 18);
  assert.equal(Math.round(nextPoint.y * 1000) / 1000, 24);
});

test("coin reward animator applies critical inline visibility styles to layer and ingots", async () => {
  const { createCoinRewardAnimator } = await import("../src/ui/animations/coin-reward-animation.ts");
  const fakeLayer = createFakeLayer();
  const fakeSource = {
    getBoundingClientRect: () => ({ left: 10, top: 10, width: 20, height: 20 }),
  };

  const animator = createCoinRewardAnimator({
    layer: fakeLayer,
    onDisplayValueChange() {},
  });

  animator.play({
    sourceElement: fakeSource,
    startValue: 10,
    targetValue: 20,
    amount: 10,
  });

  const firstIngot = findIngotNodes(fakeLayer)[0];
  assert.equal(fakeLayer.style.position, "absolute");
  assert.equal(fakeLayer.style.inset, "0");
  assert.equal(fakeLayer.style.pointerEvents, "none");
  assert.equal(firstIngot?.style.position, "absolute");
  assert.equal(firstIngot?.style.width, "84px");
  assert.equal(firstIngot?.style.height, "48px");
  assert.equal(firstIngot?.style.display, "block");
  assert.equal(firstIngot?.style.boxShadow, "");
});

test("coin reward animator snaps direct convergence to the anchor once positions overlap", async () => {
  const { __coinRewardTestUtils } = await import("../src/ui/animations/coin-reward-animation.ts");
  const step = __coinRewardTestUtils.advanceDirectConvergencePoint(
    { x: 25, y: 25 },
    { x: 30, y: 30 },
    20
  );

  assert.equal(step.x, 30);
  assert.equal(step.y, 30);
});

test("coin reward animator uses 1500 px/s straight-flight speed before convergence", async () => {
  const { __coinRewardTestUtils } = await import("../src/ui/animations/coin-reward-animation.ts");
  const velocity = __coinRewardTestUtils.createStraightFlightVelocity(
    { x: 10, y: 20 },
    { x: 110, y: 20 }
  );

  assert.equal(velocity.x, 1.5);
  assert.equal(velocity.y, 0);
});

test("coin reward animator forces the final display value to target before hiding when animation ends short", async () => {
  const { __coinRewardTestUtils } = await import("../src/ui/animations/coin-reward-animation.ts");
  const events = __coinRewardTestUtils.getFinalDisplayEvents({
    latestDisplayedNumericValue: 19,
    lastEmittedValue: 19,
    hasShownAnyNumericValue: true,
    targetValue: 20,
  });

  assert.deepEqual(events, [20, null]);
});
