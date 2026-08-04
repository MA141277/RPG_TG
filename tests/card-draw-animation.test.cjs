const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

function createFakeStyle() {
  return {
    setProperty(name, value) {
      this[name] = String(value);
    },
  };
}

function toDatasetKey(name) {
  return name
    .replace(/^data-/, "")
    .split("-")
    .map((segment, index) =>
      index === 0 ? segment : `${segment.slice(0, 1).toUpperCase()}${segment.slice(1)}`
    )
    .join("");
}

function syncClassName(element, nextClasses) {
  element.className = Array.from(nextClasses).join(" ");
}

function createFakeClassList(element) {
  const classes = new Set();

  return {
    add(...tokens) {
      tokens.forEach((token) => classes.add(token));
      syncClassName(element, classes);
    },
    remove(...tokens) {
      tokens.forEach((token) => classes.delete(token));
      syncClassName(element, classes);
    },
    toggle(token, force) {
      const shouldAdd = force ?? !classes.has(token);
      if (shouldAdd) {
        classes.add(token);
      } else {
        classes.delete(token);
      }
      syncClassName(element, classes);
      return shouldAdd;
    },
    contains(token) {
      return classes.has(token);
    },
  };
}

function createFakeElement(tagName, ownerDocument) {
  const listeners = new Map();
  const element = {
    tagName: String(tagName).toUpperCase(),
    ownerDocument,
    parentNode: null,
    children: [],
    className: "",
    classList: null,
    dataset: {},
    style: createFakeStyle(),
    textContent: "",
    disabled: false,
    type: "",
    attributes: {},
    appendChild(child) {
      child.parentNode = this;
      this.children.push(child);
      return child;
    },
    removeChild(child) {
      this.children = this.children.filter((entry) => entry !== child);
      child.parentNode = null;
      return child;
    },
    remove() {
      if (this.parentNode != null) {
        this.parentNode.removeChild(this);
      }
    },
    setAttribute(name, value) {
      this.attributes[name] = String(value);
      if (name === "class") {
        this.className = String(value);
      } else if (name === "type") {
        this.type = String(value);
      } else if (name.startsWith("data-")) {
        this.dataset[toDatasetKey(name)] = String(value);
      } else {
        this[name] = String(value);
      }
    },
    addEventListener(type, listener) {
      const current = listeners.get(type) ?? [];
      current.push(listener);
      listeners.set(type, current);
    },
    dispatchEvent(event) {
      const current = listeners.get(event.type) ?? [];
      current.forEach((listener) => listener.call(this, event));
      return true;
    },
    click() {
      this.dispatchEvent({
        type: "click",
        preventDefault() {},
        stopPropagation() {},
      });
    },
  };
  element.classList = createFakeClassList(element);
  return element;
}

function createFakeHost() {
  const ownerDocument = {
    createElement(tagName) {
      return createFakeElement(tagName, ownerDocument);
    },
  };
  return createFakeElement("div", ownerDocument);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getAnimatorNodes(host) {
  const root = host.children[0];
  const button = root.children[0];
  const deck = button.children[0];
  const topCard = deck.children[deck.children.length - 1];
  const hint = root.children[1];
  return {
    root,
    button,
    deck,
    topCard,
    frontFace: topCard.children[0],
    backFace: topCard.children[1],
    hint,
  };
}

test("card draw animator waits for trigger before resolving and settles on the revealed value", async () => {
  const { CardDrawAnimator } = await import("../src/ui/animations/card-draw-animation.ts");
  const host = createFakeHost();
  const animator = new CardDrawAnimator({
    host,
    timings: {
      shakeMs: 6,
      pauseAfterShakeMs: 0,
      liftMs: 6,
      pauseAfterLiftMs: 0,
      flipMs: 6,
      pauseAfterFlipMs: 0,
      settleMs: 6,
    },
    resultFormatter(value) {
      return `值${value}`;
    },
  });
  let resolvedValue = null;

  const playPromise = animator
    .play({
      resolveValue() {
        return 4;
      },
      clickHintText: "点击抽取",
    })
    .then((value) => {
      resolvedValue = value;
      return value;
    });

  await wait(10);
  const nodesBeforeTrigger = getAnimatorNodes(host);
  assert.equal(resolvedValue, null);
  assert.equal(nodesBeforeTrigger.root.dataset.cardDrawPhase, "idle");
  assert.equal(nodesBeforeTrigger.frontFace.textContent, "?");
  assert.equal(nodesBeforeTrigger.backFace.textContent, "值4");
  assert.equal(nodesBeforeTrigger.hint.textContent, "点击抽取");

  animator.trigger();
  const value = await playPromise;
  const nodesAfterTrigger = getAnimatorNodes(host);

  assert.equal(value, 4);
  assert.equal(nodesAfterTrigger.root.dataset.cardDrawPhase, "done");
  assert.equal(nodesAfterTrigger.button.disabled, true);
  assert.equal(nodesAfterTrigger.hint.textContent, "已抽到 值4 (4)");
});

test("card draw animator reacts to stack button click and uses random fallback inside the candidate list", async () => {
  const {
    CardDrawAnimator,
    formatCardDrawResultLabel,
  } = await import("../src/ui/animations/card-draw-animation.ts");
  const host = createFakeHost();
  const animator = new CardDrawAnimator({
    host,
    random() {
      return 0.72;
    },
    timings: {
      shakeMs: 5,
      pauseAfterShakeMs: 0,
      liftMs: 5,
      pauseAfterLiftMs: 0,
      flipMs: 5,
      pauseAfterFlipMs: 0,
      settleMs: 5,
    },
  });

  const playPromise = animator.play({
    values: [2, 4, 6],
  });
  const { button, backFace } = getAnimatorNodes(host);
  button.click();
  const resolvedValue = await playPromise;

  assert.equal(resolvedValue, 6);
  assert.equal(backFace.textContent, formatCardDrawResultLabel(6));
});

test("card draw animator rejects overlapping play requests and rejects pending play on destroy", async () => {
  const { CardDrawAnimator } = await import("../src/ui/animations/card-draw-animation.ts");
  const host = createFakeHost();
  const animator = new CardDrawAnimator({
    host,
    timings: {
      shakeMs: 5,
      pauseAfterShakeMs: 0,
      liftMs: 5,
      pauseAfterLiftMs: 0,
      flipMs: 5,
      pauseAfterFlipMs: 0,
      settleMs: 5,
    },
  });

  const pendingPlay = animator.play({
    resolveValue() {
      return 1;
    },
  });

  await assert.rejects(
    () =>
      animator.play({
        resolveValue() {
          return 2;
        },
      }),
    /already waiting or animating/
  );

  animator.destroy();

  await assert.rejects(pendingPlay, /destroyed before completion/);
  assert.equal(host.children.length, 0);
});

test("card draw animator emits semantic audio events for shuffle pull flip and return", async () => {
  const { CardDrawAnimator } = await import("../src/ui/animations/card-draw-animation.ts");
  const host = createFakeHost();
  const playedEvents = [];
  const animator = new CardDrawAnimator({
    host,
    timings: {
      shakeMs: 5,
      pauseAfterShakeMs: 0,
      liftMs: 5,
      pauseAfterLiftMs: 0,
      flipMs: 5,
      pauseAfterFlipMs: 0,
      settleMs: 5,
    },
    soundPlayer: {
      play(event) {
        playedEvents.push(event);
      },
    },
  });

  const playPromise = animator.play({
    resolveValue() {
      return 3;
    },
  });

  animator.trigger();
  const resolvedValue = await playPromise;

  assert.equal(resolvedValue, 3);
  assert.deepEqual(playedEvents, ["shuffle", "pull", "flip", "return"]);
});

test("card draw animator pauses between shake lift flip and settle phases", async () => {
  const { CardDrawAnimator } = await import("../src/ui/animations/card-draw-animation.ts");
  const host = createFakeHost();
  const animator = new CardDrawAnimator({
    host,
    timings: {
      shakeMs: 10,
      pauseAfterShakeMs: 60,
      liftMs: 10,
      pauseAfterLiftMs: 60,
      flipMs: 10,
      pauseAfterFlipMs: 60,
      settleMs: 40,
    },
  });

  const playPromise = animator.play({
    resolveValue() {
      return 5;
    },
  });
  const { root } = getAnimatorNodes(host);

  animator.trigger();
  assert.equal(root.dataset.cardDrawPhase, "shake");

  await wait(20);
  assert.equal(root.dataset.cardDrawPhase, "shake");

  await wait(60);
  assert.equal(root.dataset.cardDrawPhase, "lift");

  await wait(20);
  assert.equal(root.dataset.cardDrawPhase, "lift");

  await wait(60);
  assert.equal(root.dataset.cardDrawPhase, "flip");

  await wait(20);
  assert.equal(root.dataset.cardDrawPhase, "flip");

  await wait(40);
  assert.equal(root.dataset.cardDrawPhase, "settle");

  const resolvedValue = await playPromise;
  assert.equal(resolvedValue, 5);
  assert.equal(root.dataset.cardDrawPhase, "done");
});

test("stacked card layers stay opaque instead of fading by depth", () => {
  const source = fs.readFileSync("src/styles/card-draw.css", "utf8");
  const stackRuleMatch = source.match(
    /\.c-card-draw__card--stack\s*\{([\s\S]*?)\n\}/
  );

  assert.ok(stackRuleMatch, "Expected stacked card CSS rule.");
  assert.doesNotMatch(stackRuleMatch[1], /\bopacity\s*:/);
});
