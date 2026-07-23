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
          setAttribute(name, value) {
            this[name] = value;
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

test("coin reward animator waits for the first visual hit before rolling and finalizes on the last hit", async () => {
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

    await new Promise((resolve) => setTimeout(resolve, 850));
    assert.deepEqual(seenValues, []);

    await new Promise((resolve) => setTimeout(resolve, 950));
    assert.equal(seenValues.at(-2), 20);
    assert.equal(seenValues.at(-1), null);
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

test("coin reward animator uses the HUD gold icon asset for ingot nodes", async () => {
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

  assert.match(fakeLayer.children[0]?.src ?? "", /20260706-152814\.png/);
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

  const firstIngot = fakeLayer.children[0];
  assert.equal(fakeLayer.style.position, "absolute");
  assert.equal(fakeLayer.style.inset, "0");
  assert.equal(fakeLayer.style.pointerEvents, "none");
  assert.equal(firstIngot?.style.position, "absolute");
  assert.equal(firstIngot?.style.width, "32px");
  assert.equal(firstIngot?.style.height, "32px");
  assert.equal(firstIngot?.style.display, "block");
});
