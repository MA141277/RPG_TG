const test = require("node:test");
const assert = require("node:assert/strict");

function toDatasetKey(name) {
  return name
    .replace(/^data-/, "")
    .split("-")
    .map((segment, index) =>
      index === 0
        ? segment
        : `${segment.slice(0, 1).toUpperCase()}${segment.slice(1)}`
    )
    .join("");
}

class FakeClassList {
  constructor(owner, initialTokens = []) {
    this.owner = owner;
    this.tokens = new Set(initialTokens.filter(Boolean));
    this.#sync();
  }

  add(...tokens) {
    for (const token of tokens) {
      this.tokens.add(token);
    }
    this.#sync();
  }

  remove(...tokens) {
    for (const token of tokens) {
      this.tokens.delete(token);
    }
    this.#sync();
  }

  contains(token) {
    return this.tokens.has(token);
  }

  #sync() {
    this.owner.className = [...this.tokens].join(" ");
  }
}

class FakeElement {
  constructor(tagName, ownerDocument) {
    this.tagName = String(tagName).toUpperCase();
    this.ownerDocument = ownerDocument;
    this.parentElement = null;
    this.children = [];
    this.dataset = {};
    this.attributes = new Map();
    this.className = "";
    this.classList = new FakeClassList(this);
    this.style = {};
    this.textContent = "";
    this.disabled = false;
    this.listeners = new Map();
    this.rect = {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      width: 0,
      height: 0,
    };
  }

  append(...children) {
    for (const child of children) {
      this.appendChild(child);
    }
  }

  appendChild(child) {
    if (child.parentElement != null) {
      child.parentElement.removeChild(child);
    }
    child.parentElement = this;
    this.children.push(child);
    return child;
  }

  insertBefore(child, referenceChild) {
    if (child.parentElement != null) {
      child.parentElement.removeChild(child);
    }
    child.parentElement = this;
    if (referenceChild == null) {
      this.children.push(child);
      return child;
    }
    const index = this.children.indexOf(referenceChild);
    if (index < 0) {
      this.children.push(child);
      return child;
    }
    this.children.splice(index, 0, child);
    return child;
  }

  removeChild(child) {
    const index = this.children.indexOf(child);
    if (index >= 0) {
      this.children.splice(index, 1);
      child.parentElement = null;
    }
    return child;
  }

  remove() {
    if (this.parentElement != null) {
      this.parentElement.removeChild(this);
    }
  }

  setAttribute(name, value) {
    const normalized = String(value);
    this.attributes.set(name, normalized);
    if (name.startsWith("data-")) {
      this.dataset[toDatasetKey(name)] = normalized;
      return;
    }
    if (name === "class") {
      this.classList = new FakeClassList(this, normalized.split(/\s+/));
      return;
    }
    this[name] = normalized;
  }

  removeAttribute(name) {
    this.attributes.delete(name);
    if (name.startsWith("data-")) {
      delete this.dataset[toDatasetKey(name)];
      return;
    }
    if (name === "class") {
      this.classList = new FakeClassList(this);
      return;
    }
    delete this[name];
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }

  addEventListener(type, listener) {
    const current = this.listeners.get(type) ?? [];
    current.push(listener);
    this.listeners.set(type, current);
  }

  removeEventListener(type, listener) {
    const current = this.listeners.get(type) ?? [];
    this.listeners.set(
      type,
      current.filter((entry) => entry !== listener)
    );
  }

  dispatchEvent(event) {
    const listeners = this.listeners.get(event.type) ?? [];
    for (const listener of listeners) {
      listener.call(this, event);
    }
    return true;
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] ?? null;
  }

  querySelectorAll(selector) {
    const results = [];
    const visit = (node) => {
      if (matchesSelector(node, selector)) {
        results.push(node);
      }
      for (const child of node.children) {
        visit(child);
      }
    };
    for (const child of this.children) {
      visit(child);
    }
    return results;
  }

  closest(selector) {
    let current = this;
    while (current != null) {
      if (matchesSelector(current, selector)) {
        return current;
      }
      current = current.parentElement;
    }
    return null;
  }

  contains(candidate) {
    if (candidate == null) {
      return false;
    }
    if (candidate === this) {
      return true;
    }
    return this.children.some((child) => child.contains(candidate));
  }

  cloneNode(deep = false) {
    const clone = new FakeElement(this.tagName, this.ownerDocument);
    clone.textContent = this.textContent;
    clone.disabled = this.disabled;
    clone.classList = new FakeClassList(clone, this.className.split(/\s+/));
    clone.style = { ...this.style };
    clone.rect = { ...this.rect };
    for (const [name, value] of this.attributes.entries()) {
      clone.attributes.set(name, value);
    }
    clone.dataset = { ...this.dataset };
    if (deep) {
      for (const child of this.children) {
        clone.appendChild(child.cloneNode(true));
      }
    }
    return clone;
  }

  getBoundingClientRect() {
    return { ...this.rect };
  }
}

function matchesSelector(element, selector) {
  if (selector.startsWith(".")) {
    return element.classList.contains(selector.slice(1));
  }

  const tokens = selector.match(/(\.[A-Za-z0-9_-]+|\[[^\]]+\])/g) ?? [];
  if (tokens.length === 0) {
    return false;
  }

  return tokens.every((token) => {
    if (token.startsWith(".")) {
      return element.classList.contains(token.slice(1));
    }
    const attributeMatch = token.match(/^\[([^=\]]+)(?:=['"]?([^'"\]]*)['"]?)?\]$/);
    if (attributeMatch == null) {
      return false;
    }
    const [, rawName, expectedValue] = attributeMatch;
    if (rawName.startsWith("data-")) {
      const key = toDatasetKey(rawName);
      const value = element.dataset[key];
      return expectedValue == null ? value != null : value === expectedValue;
    }
    const value = element.getAttribute(rawName);
    return expectedValue == null ? value != null : value === expectedValue;
  });
}

function createFakeDocument() {
  const document = {
    body: null,
    createElement(tagName) {
      return new FakeElement(tagName, document);
    },
  };
  document.body = new FakeElement("body", document);
  return document;
}

function createTimingApi() {
  let nowMs = 0;
  let nextTimeoutId = 1;
  const tasks = new Map();

  return {
    api: {
      setTimeout(callback, delayMs = 0) {
        const timeoutId = nextTimeoutId;
        nextTimeoutId += 1;
        tasks.set(timeoutId, {
          callback,
          dueAtMs: nowMs + Number(delayMs || 0),
        });
        return timeoutId;
      },
      clearTimeout(timeoutId) {
        tasks.delete(timeoutId);
      },
      now() {
        return nowMs;
      },
    },
    advance(ms) {
      nowMs += ms;
      const dueTasks = [...tasks.entries()]
        .filter(([, task]) => task.dueAtMs <= nowMs)
        .sort((left, right) => left[1].dueAtMs - right[1].dueAtMs);
      for (const [timeoutId, task] of dueTasks) {
        if (!tasks.has(timeoutId)) {
          continue;
        }
        tasks.delete(timeoutId);
        task.callback();
      }
    },
  };
}

function createPointerEvent(type, target, overrides = {}) {
  return {
    type,
    target,
    currentTarget: null,
    pointerId: overrides.pointerId ?? 1,
    clientX: overrides.clientX ?? 0,
    clientY: overrides.clientY ?? 0,
    button: overrides.button ?? 0,
    relatedTarget: overrides.relatedTarget ?? null,
    defaultPrevented: false,
    propagationStopped: false,
    preventDefault() {
      this.defaultPrevented = true;
    },
    stopPropagation() {
      this.propagationStopped = true;
    },
  };
}

function createSortableFixture(options = {}) {
  const enabled = options.enabled ?? true;
  const ids = options.ids ?? ["a", "b", "c"];
  const document = createFakeDocument();
  const appElement = document.createElement("div");
  const visualHost = document.createElement("section");
  visualHost.setAttribute("data-house-sort-visual-host", "true");
  const root = document.createElement("div");
  root.setAttribute("data-house-drop-action-prefix", "gamble-reorder:");
  root.setAttribute("data-house-drop-before", "end");
  root.setAttribute(
    "data-house-sort-enabled",
    enabled ? "true" : "false"
  );
  root.rect = {
    left: 0,
    top: 0,
    right: Math.max(ids.length * 30 + 20, 120),
    bottom: 40,
    width: Math.max(ids.length * 30 + 20, 120),
    height: 40,
  };

  const createTile = (id, left) => {
    const tile = document.createElement("button");
    tile.textContent = id.toUpperCase();
    tile.setAttribute(
      "class",
      "c-tavern-gamble__tile c-tavern-gamble__tile--hand c-tavern-gamble__tile--depth-top"
    );
    tile.setAttribute("data-house-sortable-tile", "true");
    tile.setAttribute("data-house-drag-payload", id);
    tile.setAttribute("data-house-drop-before", id);
    tile.setAttribute("data-house-action", `select:${id}`);
    tile.rect = {
      left,
      top: 0,
      right: left + 20,
      bottom: 30,
      width: 20,
      height: 30,
    };
    return tile;
  };

  const tilesById = Object.fromEntries(
    ids.map((id, index) => [id, createTile(id, index * 30)])
  );
  root.append(...ids.map((id) => tilesById[id]));
  visualHost.append(root);
  appElement.append(visualHost);
  document.body.append(appElement);

  const fixture = {
    document,
    appElement,
    visualHost,
    root,
    tilesById,
  };
  for (const id of ids) {
    fixture[`tile${id.toUpperCase()}`] = tilesById[id];
  }
  return fixture;
}

function readVisibleOrder(root) {
  return root.children
    .filter((child) => child.style.display !== "none")
    .map((child) =>
      child.classList.contains("is-house-drop-placeholder")
        ? `placeholder:${child.textContent.toLowerCase()}`
        : child.dataset.houseDragPayload
    );
}

function loadRuntime() {
  return require("../.test-dist/ui/views/house/house-sortable-tile-runtime.js");
}

test("shared house sortable runtime lifts enabled tiles on hover and clears on leave", () => {
  const { mountHouseSortableTileRuntime } = loadRuntime();
  const fixture = createSortableFixture();
  const timing = createTimingApi();
  const actions = [];

  const handle = mountHouseSortableTileRuntime({
    appElement: fixture.appElement,
    dispatchReorderAction(actionId) {
      actions.push(actionId);
    },
    longPressMs: 80,
    timingApi: timing.api,
  });

  fixture.appElement.dispatchEvent(
    createPointerEvent("mouseover", fixture.tileA)
  );
  assert.equal(
    fixture.tileA.classList.contains("is-house-hover-lifted"),
    true
  );

  fixture.appElement.dispatchEvent(
    createPointerEvent("mouseout", fixture.tileA, { relatedTarget: null })
  );
  assert.equal(
    fixture.tileA.classList.contains("is-house-hover-lifted"),
    false
  );
  assert.deepEqual(actions, []);

  handle.destroy();
});

test("shared house sortable runtime ignores quick clicks before the long-press threshold", () => {
  const { mountHouseSortableTileRuntime } = loadRuntime();
  const fixture = createSortableFixture();
  const timing = createTimingApi();
  const actions = [];

  const handle = mountHouseSortableTileRuntime({
    appElement: fixture.appElement,
    dispatchReorderAction(actionId) {
      actions.push(actionId);
    },
    longPressMs: 80,
    timingApi: timing.api,
  });

  fixture.appElement.dispatchEvent(
    createPointerEvent("pointerdown", fixture.tileA, {
      clientX: 10,
      clientY: 10,
    })
  );
  fixture.appElement.dispatchEvent(
    createPointerEvent("pointerup", fixture.tileA, {
      clientX: 10,
      clientY: 10,
    })
  );
  timing.advance(120);

  assert.deepEqual(actions, []);
  assert.equal(
    fixture.root.querySelector(".is-house-drop-placeholder"),
    null
  );

  handle.destroy();
});

test("shared house sortable runtime keeps a long-press pending through small diagonal pointer jitter", () => {
  const { mountHouseSortableTileRuntime } = loadRuntime();
  const fixture = createSortableFixture();
  const timing = createTimingApi();
  const actions = [];

  const handle = mountHouseSortableTileRuntime({
    appElement: fixture.appElement,
    dispatchReorderAction(actionId) {
      actions.push(actionId);
    },
    longPressMs: 80,
    timingApi: timing.api,
  });

  fixture.appElement.dispatchEvent(
    createPointerEvent("pointerdown", fixture.tileA, {
      clientX: 10,
      clientY: 10,
    })
  );
  fixture.appElement.dispatchEvent(
    createPointerEvent("pointermove", fixture.tileA, {
      clientX: 14,
      clientY: 13,
    })
  );
  timing.advance(100);

  fixture.appElement.dispatchEvent(
    createPointerEvent("pointermove", fixture.tileA, {
      clientX: 55,
      clientY: 10,
    })
  );
  fixture.appElement.dispatchEvent(
    createPointerEvent("pointerup", fixture.tileA, {
      clientX: 55,
      clientY: 10,
    })
  );

  assert.deepEqual(actions, []);
  timing.advance(220);
  assert.deepEqual(actions, ["gamble-reorder:a:c"]);

  handle.destroy();
});

test("shared house sortable runtime activates drag after the long-press even when the pointer already started moving", () => {
  const { mountHouseSortableTileRuntime } = loadRuntime();
  const fixture = createSortableFixture();
  const timing = createTimingApi();
  const actions = [];

  const handle = mountHouseSortableTileRuntime({
    appElement: fixture.appElement,
    dispatchReorderAction(actionId) {
      actions.push(actionId);
    },
    longPressMs: 80,
    timingApi: timing.api,
  });

  fixture.appElement.dispatchEvent(
    createPointerEvent("pointerdown", fixture.tileA, {
      clientX: 10,
      clientY: 10,
    })
  );
  fixture.appElement.dispatchEvent(
    createPointerEvent("pointermove", fixture.tileA, {
      clientX: 55,
      clientY: 10,
    })
  );
  timing.advance(100);

  const ghostTile = fixture.visualHost.querySelector(".is-house-drag-ghost");
  assert.notEqual(ghostTile, null);
  assert.equal(ghostTile.style.left, "45px");
  assert.deepEqual(readVisibleOrder(fixture.root), [
    "b",
    "placeholder:a",
    "c",
  ]);

  fixture.appElement.dispatchEvent(
    createPointerEvent("pointerup", fixture.tileA, {
      clientX: 55,
      clientY: 10,
    })
  );

  assert.deepEqual(actions, []);
  timing.advance(220);
  assert.deepEqual(actions, ["gamble-reorder:a:c"]);

  handle.destroy();
});

test("shared house sortable runtime mounts the first placeholder at the current slot without an activation jump", () => {
  const { mountHouseSortableTileRuntime } = loadRuntime();
  const fixture = createSortableFixture({ ids: ["a", "b", "c", "d", "e"] });
  const timing = createTimingApi();
  const originalInsertBefore = fixture.root.insertBefore.bind(fixture.root);
  const originalTileDRect = fixture.tileD.getBoundingClientRect.bind(fixture.tileD);
  const originalTileERect = fixture.tileE.getBoundingClientRect.bind(fixture.tileE);

  fixture.root.insertBefore = (child, referenceChild) => {
    const result = originalInsertBefore(child, referenceChild);
    if (child.classList.contains("is-house-drop-placeholder")) {
      child.rect = {
        left: 60,
        top: fixture.tileA.rect.top,
        right: 80,
        bottom: fixture.tileA.rect.bottom,
        width: fixture.tileA.rect.width,
        height: fixture.tileA.rect.height,
      };
    }
    return result;
  };
  fixture.tileD.getBoundingClientRect = () => {
    const placeholderTile = fixture.root.querySelector(".is-house-drop-placeholder");
    if (fixture.tileC.style.display === "none" && placeholderTile == null) {
      return {
        left: 60,
        top: fixture.tileD.rect.top,
        right: 80,
        bottom: fixture.tileD.rect.bottom,
        width: fixture.tileD.rect.width,
        height: fixture.tileD.rect.height,
      };
    }
    return originalTileDRect();
  };
  fixture.tileE.getBoundingClientRect = () => {
    const placeholderTile = fixture.root.querySelector(".is-house-drop-placeholder");
    if (fixture.tileC.style.display === "none" && placeholderTile == null) {
      return {
        left: 90,
        top: fixture.tileE.rect.top,
        right: 110,
        bottom: fixture.tileE.rect.bottom,
        width: fixture.tileE.rect.width,
        height: fixture.tileE.rect.height,
      };
    }
    return originalTileERect();
  };

  const handle = mountHouseSortableTileRuntime({
    appElement: fixture.appElement,
    dispatchReorderAction() {},
    longPressMs: 80,
    timingApi: timing.api,
  });

  fixture.appElement.dispatchEvent(
    createPointerEvent("pointerdown", fixture.tileC, {
      clientX: 70,
      clientY: 10,
    })
  );
  fixture.appElement.dispatchEvent(
    createPointerEvent("pointermove", fixture.tileC, {
      clientX: 70,
      clientY: 10,
    })
  );
  timing.advance(100);

  const placeholderTile = fixture.root.querySelector(
    ".is-house-drop-placeholder"
  );
  assert.notEqual(placeholderTile, null);
  assert.equal(placeholderTile.style.position ?? "", "");
  assert.equal(placeholderTile.style.left ?? "", "");
  assert.equal(placeholderTile.style.top ?? "", "");
  assert.equal(placeholderTile.style.transition ?? "", "");
  assert.equal(fixture.tileB.style.position ?? "", "");
  assert.equal(fixture.tileB.style.left ?? "", "");
  assert.equal(fixture.tileB.style.top ?? "", "");
  assert.equal(fixture.tileB.style.transition ?? "", "");
  assert.equal(fixture.tileD.style.position ?? "", "");
  assert.equal(fixture.tileD.style.left ?? "", "");
  assert.equal(fixture.tileD.style.top ?? "", "");
  assert.equal(fixture.tileD.style.transition ?? "", "");

  handle.destroy();
});

test("shared house sortable runtime creates a placeholder gap and dispatches a reorder action after a long-press drag", () => {
  const { mountHouseSortableTileRuntime } = loadRuntime();
  const fixture = createSortableFixture();
  const timing = createTimingApi();
  const actions = [];

  const handle = mountHouseSortableTileRuntime({
    appElement: fixture.appElement,
    dispatchReorderAction(actionId) {
      actions.push(actionId);
    },
    longPressMs: 80,
    timingApi: timing.api,
  });

  fixture.appElement.dispatchEvent(
    createPointerEvent("pointerdown", fixture.tileA, {
      clientX: 10,
      clientY: 10,
    })
  );
  timing.advance(100);

  const placeholderBeforeMove = fixture.root.querySelector(
    ".is-house-drop-placeholder"
  );
  assert.notEqual(placeholderBeforeMove, null);
  assert.equal(fixture.tileA.style.display, "none");

  fixture.appElement.dispatchEvent(
    createPointerEvent("pointermove", fixture.tileA, {
      clientX: 55,
      clientY: 10,
    })
  );
  fixture.appElement.dispatchEvent(
    createPointerEvent("pointerup", fixture.tileA, {
      clientX: 55,
      clientY: 10,
    })
  );

  assert.deepEqual(actions, []);
  assert.notEqual(
    fixture.root.querySelector(".is-house-drop-placeholder"),
    null
  );
  timing.advance(220);
  assert.deepEqual(actions, ["gamble-reorder:a:c"]);
  assert.equal(
    fixture.root.querySelector(".is-house-drop-placeholder"),
    null
  );
  assert.equal(fixture.document.body.querySelector(".is-house-drag-ghost"), null);

  handle.destroy();
});

test("shared house sortable runtime styles the placeholder as a semi-transparent visual ghost", () => {
  const { mountHouseSortableTileRuntime } = loadRuntime();
  const fixture = createSortableFixture();
  const timing = createTimingApi();

  const handle = mountHouseSortableTileRuntime({
    appElement: fixture.appElement,
    dispatchReorderAction() {},
    longPressMs: 80,
    timingApi: timing.api,
  });

  fixture.appElement.dispatchEvent(
    createPointerEvent("pointerdown", fixture.tileA, {
      clientX: 10,
      clientY: 10,
    })
  );
  timing.advance(100);

  const placeholderTile = fixture.root.querySelector(
    ".is-house-drop-placeholder"
  );
  assert.notEqual(placeholderTile, null);
  assert.equal(placeholderTile.style.opacity, "0.38");
  assert.equal(
    placeholderTile.classList.contains("c-tavern-gamble__tile--depth-top"),
    true
  );

  handle.destroy();
});

test("shared house sortable runtime mounts the initial placeholder without a fly-in animation", () => {
  const { mountHouseSortableTileRuntime } = loadRuntime();
  const fixture = createSortableFixture();
  const timing = createTimingApi();
  const originalCloneNode = fixture.tileA.cloneNode.bind(fixture.tileA);
  const originalInsertBefore = fixture.root.insertBefore.bind(fixture.root);

  fixture.tileA.cloneNode = (deep = false) => {
    const clone = originalCloneNode(deep);
    clone.rect = {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      width: 0,
      height: 0,
    };
    return clone;
  };
  fixture.root.insertBefore = (child, referenceChild) => {
    const result = originalInsertBefore(child, referenceChild);
    if (child.classList.contains("is-house-drop-placeholder")) {
      child.rect = { ...fixture.tileA.rect };
    }
    return result;
  };

  const handle = mountHouseSortableTileRuntime({
    appElement: fixture.appElement,
    dispatchReorderAction() {},
    longPressMs: 80,
    timingApi: timing.api,
  });

  fixture.appElement.dispatchEvent(
    createPointerEvent("pointerdown", fixture.tileA, {
      clientX: 10,
      clientY: 10,
    })
  );
  timing.advance(100);

  const placeholderTile = fixture.root.querySelector(
    ".is-house-drop-placeholder"
  );
  assert.notEqual(placeholderTile, null);
  assert.equal(placeholderTile.style.position ?? "", "");
  assert.equal(placeholderTile.style.left ?? "", "");
  assert.equal(placeholderTile.style.top ?? "", "");
  assert.equal(placeholderTile.style.transition ?? "", "");

  handle.destroy();
});

test("shared house sortable runtime strips transient animation state from drag clones", () => {
  const { mountHouseSortableTileRuntime } = loadRuntime();
  const fixture = createSortableFixture();
  const timing = createTimingApi();

  fixture.tileA.classList.add("is-entering", "is-dropping");
  fixture.tileA.style.transition = "left 180ms ease, top 180ms ease";
  fixture.tileA.style.animation = "tavern-gamble-public-fly-in 0.52s ease-out both";
  fixture.tileA.style.left = "14px";
  fixture.tileA.style.top = "8px";

  const handle = mountHouseSortableTileRuntime({
    appElement: fixture.appElement,
    dispatchReorderAction() {},
    longPressMs: 80,
    timingApi: timing.api,
  });

  fixture.appElement.dispatchEvent(
    createPointerEvent("pointerdown", fixture.tileA, {
      clientX: 10,
      clientY: 10,
    })
  );
  timing.advance(100);

  const placeholderTile = fixture.root.querySelector(
    ".is-house-drop-placeholder"
  );
  const ghostTile = fixture.visualHost.querySelector(".is-house-drag-ghost");

  assert.notEqual(placeholderTile, null);
  assert.notEqual(ghostTile, null);
  assert.equal(placeholderTile.classList.contains("is-entering"), false);
  assert.equal(placeholderTile.classList.contains("is-dropping"), false);
  assert.equal(ghostTile.classList.contains("is-entering"), false);
  assert.equal(ghostTile.classList.contains("is-dropping"), false);
  assert.equal(placeholderTile.style.transition ?? "", "");
  assert.equal(placeholderTile.style.animation ?? "", "");
  assert.equal(ghostTile.style.transition ?? "", "");
  assert.equal(ghostTile.style.animation ?? "", "");

  handle.destroy();
});

test("shared house sortable runtime keeps the floating ghost in the visual host and preserves the lifted tile styling", () => {
  const { mountHouseSortableTileRuntime } = loadRuntime();
  const fixture = createSortableFixture();
  const timing = createTimingApi();

  const handle = mountHouseSortableTileRuntime({
    appElement: fixture.appElement,
    dispatchReorderAction() {},
    longPressMs: 80,
    timingApi: timing.api,
  });

  fixture.appElement.dispatchEvent(
    createPointerEvent("mouseover", fixture.tileA)
  );
  fixture.appElement.dispatchEvent(
    createPointerEvent("pointerdown", fixture.tileA, {
      clientX: 10,
      clientY: 10,
    })
  );
  timing.advance(100);

  const ghostTile = fixture.visualHost.querySelector(".is-house-drag-ghost");
  assert.notEqual(ghostTile, null);
  assert.equal(ghostTile.parentElement, fixture.visualHost);
  assert.equal(
    ghostTile.classList.contains("is-house-hover-lifted"),
    true
  );
  assert.equal(
    ghostTile.classList.contains("c-tavern-gamble__tile--depth-top"),
    true
  );
  assert.equal(ghostTile.style.opacity ?? "", "");

  handle.destroy();
});

test("shared house sortable runtime keeps the dragged tile aligned when the visual host is offset", () => {
  const { mountHouseSortableTileRuntime } = loadRuntime();
  const fixture = createSortableFixture();
  const timing = createTimingApi();

  fixture.visualHost.rect = {
    left: 100,
    top: 50,
    right: 300,
    bottom: 180,
    width: 200,
    height: 130,
  };
  fixture.root.rect = {
    left: 120,
    top: 60,
    right: 240,
    bottom: 100,
    width: 120,
    height: 40,
  };
  fixture.tileA.rect = {
    left: 120,
    top: 60,
    right: 140,
    bottom: 90,
    width: 20,
    height: 30,
  };

  const handle = mountHouseSortableTileRuntime({
    appElement: fixture.appElement,
    dispatchReorderAction() {},
    longPressMs: 80,
    timingApi: timing.api,
  });

  fixture.appElement.dispatchEvent(
    createPointerEvent("pointerdown", fixture.tileA, {
      clientX: 130,
      clientY: 70,
    })
  );
  timing.advance(100);

  const ghostTile = fixture.visualHost.querySelector(".is-house-drag-ghost");
  assert.notEqual(ghostTile, null);
  assert.equal(ghostTile.style.left, "20px");
  assert.equal(ghostTile.style.top, "10px");

  fixture.appElement.dispatchEvent(
    createPointerEvent("pointermove", fixture.tileA, {
      clientX: 150,
      clientY: 80,
    })
  );

  assert.equal(ghostTile.style.left, "40px");
  assert.equal(ghostTile.style.top, "20px");

  handle.destroy();
});

test("shared house sortable runtime advances the placeholder slot as the drag crosses neighboring tiles", () => {
  const { mountHouseSortableTileRuntime } = loadRuntime();
  const fixture = createSortableFixture({ ids: ["a", "b", "c", "d", "e"] });
  const timing = createTimingApi();
  const actions = [];

  const handle = mountHouseSortableTileRuntime({
    appElement: fixture.appElement,
    dispatchReorderAction(actionId) {
      actions.push(actionId);
    },
    longPressMs: 80,
    timingApi: timing.api,
  });

  fixture.appElement.dispatchEvent(
    createPointerEvent("pointerdown", fixture.tileE, {
      clientX: 130,
      clientY: 10,
    })
  );
  timing.advance(100);

  assert.deepEqual(readVisibleOrder(fixture.root), [
    "a",
    "b",
    "c",
    "d",
    "placeholder:e",
  ]);

  fixture.appElement.dispatchEvent(
    createPointerEvent("pointermove", fixture.tileE, {
      clientX: 85,
      clientY: 10,
    })
  );
  assert.deepEqual(readVisibleOrder(fixture.root), [
    "a",
    "b",
    "c",
    "placeholder:e",
    "d",
  ]);

  fixture.appElement.dispatchEvent(
    createPointerEvent("pointermove", fixture.tileE, {
      clientX: 55,
      clientY: 10,
    })
  );
  assert.deepEqual(readVisibleOrder(fixture.root), [
    "a",
    "b",
    "placeholder:e",
    "c",
    "d",
  ]);
  assert.deepEqual(actions, []);

  handle.destroy();
});

test("shared house sortable runtime locks the placeholder to the hand edges when the drag moves beyond either side", () => {
  const { mountHouseSortableTileRuntime } = loadRuntime();
  const leftFixture = createSortableFixture({ ids: ["a", "b", "c", "d", "e"] });
  const rightFixture = createSortableFixture({ ids: ["a", "b", "c", "d", "e"] });
  const timing = createTimingApi();
  const actions = [];

  const handle = mountHouseSortableTileRuntime({
    appElement: leftFixture.appElement,
    dispatchReorderAction(actionId) {
      actions.push(actionId);
    },
    longPressMs: 80,
    timingApi: timing.api,
  });

  leftFixture.appElement.dispatchEvent(
    createPointerEvent("pointerdown", leftFixture.tileE, {
      clientX: 130,
      clientY: 10,
    })
  );
  timing.advance(100);
  leftFixture.appElement.dispatchEvent(
    createPointerEvent("pointermove", leftFixture.tileE, {
      clientX: -200,
      clientY: 10,
    })
  );

  assert.deepEqual(readVisibleOrder(leftFixture.root), [
    "placeholder:e",
    "a",
    "b",
    "c",
    "d",
  ]);

  handle.destroy();

  const rightTiming = createTimingApi();
  const rightHandle = mountHouseSortableTileRuntime({
    appElement: rightFixture.appElement,
    dispatchReorderAction(actionId) {
      actions.push(actionId);
    },
    longPressMs: 80,
    timingApi: rightTiming.api,
  });

  rightFixture.appElement.dispatchEvent(
    createPointerEvent("pointerdown", rightFixture.tileA, {
      clientX: 10,
      clientY: 10,
    })
  );
  rightTiming.advance(100);
  rightFixture.appElement.dispatchEvent(
    createPointerEvent("pointermove", rightFixture.tileA, {
      clientX: 400,
      clientY: 10,
    })
  );

  assert.deepEqual(readVisibleOrder(rightFixture.root), [
    "b",
    "c",
    "d",
    "e",
    "placeholder:a",
  ]);
  assert.deepEqual(actions, []);

  rightHandle.destroy();
});

test("shared house sortable runtime keeps the dragged ghost alive until the drop settle animation completes", () => {
  const { mountHouseSortableTileRuntime } = loadRuntime();
  const fixture = createSortableFixture({ ids: ["a", "b", "c", "d", "e"] });
  const timing = createTimingApi();
  const actions = [];

  const handle = mountHouseSortableTileRuntime({
    appElement: fixture.appElement,
    dispatchReorderAction(actionId) {
      actions.push(actionId);
    },
    longPressMs: 80,
    timingApi: timing.api,
  });

  fixture.appElement.dispatchEvent(
    createPointerEvent("pointerdown", fixture.tileE, {
      clientX: 130,
      clientY: 10,
    })
  );
  timing.advance(100);
  fixture.appElement.dispatchEvent(
    createPointerEvent("pointermove", fixture.tileE, {
      clientX: 85,
      clientY: 10,
    })
  );
  fixture.appElement.dispatchEvent(
    createPointerEvent("pointerup", fixture.tileE, {
      clientX: 85,
      clientY: 10,
    })
  );

  const ghostTile = fixture.document.body.querySelector(".is-house-drag-ghost");
  assert.notEqual(ghostTile, null);
  assert.equal(
    fixture.root.querySelector(".is-house-drop-placeholder") != null,
    true
  );
  assert.match(ghostTile.style.transition ?? "", /left/u);
  assert.deepEqual(actions, []);

  timing.advance(220);

  assert.deepEqual(actions, ["gamble-reorder:e:d"]);
  assert.equal(
    fixture.root.querySelector(".is-house-drop-placeholder"),
    null
  );
  assert.equal(fixture.document.body.querySelector(".is-house-drag-ghost"), null);
  assert.deepEqual(readVisibleOrder(fixture.root), [
    "a",
    "b",
    "c",
    "e",
    "d",
  ]);

  handle.destroy();
});

test("shared house sortable runtime forwards separator-safe tavern payloads without decoding them", () => {
  const { mountHouseSortableTileRuntime } = loadRuntime();
  const fixture = createSortableFixture({
    ids: ["hand|wan-2", "public-ghost|wan-7", "incoming-draw|tong-9"],
  });
  const timing = createTimingApi();
  const actions = [];

  fixture.root.setAttribute(
    "data-house-drop-action-prefix",
    "gamble-short-reorder:"
  );

  const handle = mountHouseSortableTileRuntime({
    appElement: fixture.appElement,
    dispatchReorderAction(actionId) {
      actions.push(actionId);
    },
    longPressMs: 80,
    timingApi: timing.api,
  });

  fixture.appElement.dispatchEvent(
    createPointerEvent(
      "pointerdown",
      fixture.tilesById["public-ghost|wan-7"],
      {
        clientX: 40,
        clientY: 10,
      }
    )
  );
  timing.advance(100);
  fixture.appElement.dispatchEvent(
    createPointerEvent(
      "pointermove",
      fixture.tilesById["public-ghost|wan-7"],
      {
        clientX: 5,
        clientY: 10,
      }
    )
  );
  fixture.appElement.dispatchEvent(
    createPointerEvent(
      "pointerup",
      fixture.tilesById["public-ghost|wan-7"],
      {
        clientX: 5,
        clientY: 10,
      }
    )
  );
  timing.advance(220);

  assert.deepEqual(actions, [
    "gamble-short-reorder:public-ghost|wan-7:hand|wan-2",
  ]);

  handle.destroy();
});

test("shared house sortable runtime ignores hover and drag when the sortable root is disabled", () => {
  const { mountHouseSortableTileRuntime } = loadRuntime();
  const fixture = createSortableFixture({ enabled: false });
  const timing = createTimingApi();
  const actions = [];

  const handle = mountHouseSortableTileRuntime({
    appElement: fixture.appElement,
    dispatchReorderAction(actionId) {
      actions.push(actionId);
    },
    longPressMs: 80,
    timingApi: timing.api,
  });

  fixture.appElement.dispatchEvent(
    createPointerEvent("mouseover", fixture.tileA)
  );
  fixture.appElement.dispatchEvent(
    createPointerEvent("pointerdown", fixture.tileA, {
      clientX: 10,
      clientY: 10,
    })
  );
  timing.advance(120);

  assert.equal(
    fixture.tileA.classList.contains("is-house-hover-lifted"),
    false
  );
  assert.equal(
    fixture.root.querySelector(".is-house-drop-placeholder"),
    null
  );
  assert.deepEqual(actions, []);

  handle.destroy();
});

test("shared house sortable runtime still lifts tiles on hover when hover override is enabled but sorting stays disabled", () => {
  const { mountHouseSortableTileRuntime } = loadRuntime();
  const fixture = createSortableFixture({ enabled: false });
  const timing = createTimingApi();
  const actions = [];

  fixture.root.setAttribute("data-house-hover-lift-enabled", "true");

  const handle = mountHouseSortableTileRuntime({
    appElement: fixture.appElement,
    dispatchReorderAction(actionId) {
      actions.push(actionId);
    },
    longPressMs: 80,
    timingApi: timing.api,
  });

  fixture.appElement.dispatchEvent(
    createPointerEvent("mouseover", fixture.tileA)
  );
  fixture.appElement.dispatchEvent(
    createPointerEvent("pointerdown", fixture.tileA, {
      clientX: 10,
      clientY: 10,
    })
  );
  timing.advance(120);

  assert.equal(
    fixture.tileA.classList.contains("is-house-hover-lifted"),
    true
  );
  assert.equal(
    fixture.root.querySelector(".is-house-drop-placeholder"),
    null
  );
  assert.deepEqual(actions, []);

  handle.destroy();
});
