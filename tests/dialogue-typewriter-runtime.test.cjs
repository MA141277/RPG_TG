const test = require("node:test");
const assert = require("node:assert/strict");

const {
  DIALOGUE_TYPEWRITER_DELAY_DATA_ATTRIBUTE,
  renderDialogueTypewriterHint,
  renderDialogueTypewriterLines,
} = require("../.test-dist/ui/dialogue-typewriter.js");
const {
  syncDialogueTypewriterRuntime,
} = require("../.test-dist/ui/components/dialogue/dialogue-typewriter-runtime.js");

const TYPEWRITER_CHAR_SELECTOR = `.c-dialogue-typewriter__char[${DIALOGUE_TYPEWRITER_DELAY_DATA_ATTRIBUTE}]`;
const TYPEWRITER_HINT_SELECTOR = `.c-dialogue-typewriter-hint[${DIALOGUE_TYPEWRITER_DELAY_DATA_ATTRIBUTE}]`;

class FakeClassList {
  constructor(initialNames = []) {
    this.names = new Set(initialNames.filter(Boolean));
  }

  add(...names) {
    for (const name of names) {
      this.names.add(name);
    }
  }

  remove(...names) {
    for (const name of names) {
      this.names.delete(name);
    }
  }

  contains(name) {
    return this.names.has(name);
  }
}

class FakeElement {
  constructor(classNames, delayMs) {
    this.classList = new FakeClassList(classNames.split(/\s+/));
    this.attributes = new Map([
      [DIALOGUE_TYPEWRITER_DELAY_DATA_ATTRIBUTE, String(delayMs)],
    ]);
    this.isConnected = true;
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }
}

class FakeRoot {
  constructor(characters, hints) {
    this.characters = characters;
    this.hints = hints;
  }

  querySelectorAll(selector) {
    if (selector === TYPEWRITER_CHAR_SELECTOR) {
      return this.characters;
    }

    if (selector === TYPEWRITER_HINT_SELECTOR) {
      return this.hints;
    }

    throw new Error(`Unsupported selector: ${selector}`);
  }
}

function createFakeTimingApi(options = {}) {
  const { reducedMotion = false } = options;
  let nextTimeoutId = 1;
  const tasks = new Map();

  return {
    api: {
      setTimeout(callback, delayMs = 0) {
        const timeoutId = nextTimeoutId;
        nextTimeoutId += 1;
        tasks.set(timeoutId, {
          callback,
          delayMs: Number(delayMs) || 0,
        });
        return timeoutId;
      },
      clearTimeout(timeoutId) {
        tasks.delete(timeoutId);
      },
      matchMedia(query) {
        assert.equal(query, "(prefers-reduced-motion: reduce)");
        return {
          matches: reducedMotion,
        };
      },
    },
    runDue(maxDelayMs) {
      const dueTasks = [...tasks.entries()]
        .filter(([, task]) => task.delayMs <= maxDelayMs)
        .sort((left, right) => left[1].delayMs - right[1].delayMs);

      for (const [timeoutId, task] of dueTasks) {
        if (!tasks.has(timeoutId)) {
          continue;
        }

        tasks.delete(timeoutId);
        task.callback();
      }
    },
    pendingCount() {
      return tasks.size;
    },
  };
}

test("dialogue typewriter markup uses data delay attributes instead of css animation delay", () => {
  const typewriter = renderDialogueTypewriterLines(["粮价消息"]);
  const hintMarkup = renderDialogueTypewriterHint("点击继续", typewriter.totalDurationMs);

  assert.match(
    typewriter.markup,
    new RegExp(`${DIALOGUE_TYPEWRITER_DELAY_DATA_ATTRIBUTE}="0"`)
  );
  assert.match(
    typewriter.markup,
    new RegExp(`${DIALOGUE_TYPEWRITER_DELAY_DATA_ATTRIBUTE}="32"`)
  );
  assert.doesNotMatch(typewriter.markup, /animation-delay:/);
  assert.match(
    hintMarkup,
    new RegExp(`${DIALOGUE_TYPEWRITER_DELAY_DATA_ATTRIBUTE}="\\d+"`)
  );
  assert.doesNotMatch(hintMarkup, /animation-delay:/);
});

test("dialogue typewriter runtime reveals characters and hint by scheduled delays", () => {
  const characters = [
    new FakeElement("c-dialogue-typewriter__char", 0),
    new FakeElement("c-dialogue-typewriter__char", 32),
    new FakeElement("c-dialogue-typewriter__char", 64),
  ];
  const hints = [new FakeElement("c-dialogue-typewriter-hint", 160)];
  const root = new FakeRoot(characters, hints);
  const scheduler = createFakeTimingApi();

  syncDialogueTypewriterRuntime(root, scheduler.api);

  assert.equal(characters[0].classList.contains("is-visible"), true);
  assert.equal(characters[1].classList.contains("is-visible"), false);
  assert.equal(characters[2].classList.contains("is-visible"), false);
  assert.equal(hints[0].classList.contains("is-visible"), false);

  scheduler.runDue(32);
  assert.equal(characters[1].classList.contains("is-visible"), true);
  assert.equal(characters[2].classList.contains("is-visible"), false);
  assert.equal(hints[0].classList.contains("is-visible"), false);

  scheduler.runDue(160);
  assert.equal(characters[2].classList.contains("is-visible"), true);
  assert.equal(hints[0].classList.contains("is-visible"), true);
});

test("dialogue typewriter runtime clears pending timers on destroy", () => {
  const characters = [
    new FakeElement("c-dialogue-typewriter__char", 48),
    new FakeElement("c-dialogue-typewriter__char", 96),
  ];
  const hints = [new FakeElement("c-dialogue-typewriter-hint", 160)];
  const root = new FakeRoot(characters, hints);
  const scheduler = createFakeTimingApi();

  const handle = syncDialogueTypewriterRuntime(root, scheduler.api);
  assert.equal(scheduler.pendingCount(), 3);

  handle.destroy();
  assert.equal(scheduler.pendingCount(), 0);

  scheduler.runDue(1000);
  assert.equal(characters[0].classList.contains("is-visible"), false);
  assert.equal(characters[1].classList.contains("is-visible"), false);
  assert.equal(hints[0].classList.contains("is-visible"), false);
});

test("dialogue typewriter runtime reveals everything immediately for reduced motion", () => {
  const characters = [
    new FakeElement("c-dialogue-typewriter__char", 48),
    new FakeElement("c-dialogue-typewriter__char", 96),
  ];
  const hints = [new FakeElement("c-dialogue-typewriter-hint", 160)];
  const root = new FakeRoot(characters, hints);
  const scheduler = createFakeTimingApi({ reducedMotion: true });

  syncDialogueTypewriterRuntime(root, scheduler.api);

  assert.equal(characters[0].classList.contains("is-visible"), true);
  assert.equal(characters[1].classList.contains("is-visible"), true);
  assert.equal(hints[0].classList.contains("is-visible"), true);
  assert.equal(scheduler.pendingCount(), 0);
});
