const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const domRuntimePath = path.join(
  root,
  "src",
  "ui",
  "views",
  "city",
  "city-stage-dom-runtime.ts"
);
const mainPath = path.join(root, "src", "main.ts");

class FakeStyle {
  constructor() {
    this.values = new Map();
  }

  setProperty(name, value) {
    this.values.set(name, String(value));
  }

  getPropertyValue(name) {
    return this.values.get(name) ?? "";
  }
}

class FakeElement {
  constructor(tagName) {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.parentElement = null;
    this.className = "";
    this.dataset = {};
    this.attributes = new Map();
    this.style = new FakeStyle();
  }

  append(child) {
    child.parentElement = this;
    this.children.push(child);
  }

  remove() {
    if (this.parentElement == null) {
      return;
    }
    const siblings = this.parentElement.children;
    const index = siblings.indexOf(this);
    if (index >= 0) {
      siblings.splice(index, 1);
    }
    this.parentElement = null;
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }

  set innerHTML(value) {
    this.children = [];
    if (!value.includes("c-city-stage-ambient-npc__shadow")) {
      return;
    }

    const shadow = new FakeElement("span");
    shadow.className = "c-city-stage-ambient-npc__shadow";
    shadow.setAttribute("aria-hidden", "true");
    this.append(shadow);

    const sprite = new FakeElement("img");
    sprite.className = "c-city-stage-ambient-npc__sprite";
    sprite.setAttribute("alt", "");
    sprite.setAttribute("aria-hidden", "true");
    this.append(sprite);
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] ?? null;
  }

  querySelectorAll(selector) {
    const results = [];
    const matcher = createSelectorMatcher(selector);

    const visit = (node) => {
      if (matcher(node)) {
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
}

function createSelectorMatcher(selector) {
  if (selector.startsWith(".")) {
    const className = selector.slice(1);
    return (node) =>
      node.className.split(/\s+/).filter(Boolean).includes(className);
  }

  const attributeMatch = selector.match(/^\[([^=\]]+)(?:="([^"]*)")?\]$/);
  if (attributeMatch != null) {
    const [, rawName, expectedValue] = attributeMatch;
    const name = rawName;
    return (node) => {
      if (name.startsWith("data-")) {
        const dataKey = name
          .slice(5)
          .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        const value = node.dataset[dataKey];
        if (expectedValue == null) {
          return value != null;
        }
        return value === expectedValue;
      }
      const value = node.getAttribute(name);
      if (expectedValue == null) {
        return value != null;
      }
      return value === expectedValue;
    };
  }

  throw new Error(`Unsupported selector: ${selector}`);
}

function createFakeDocument() {
  return {
    createElement(tagName) {
      return new FakeElement(tagName);
    },
  };
}

function createStageRoot() {
  const root = new FakeElement("section");
  root.dataset.cityStageRoot = "true";
  const baseSpace = new FakeElement("div");
  baseSpace.dataset.cityStageBaseSpace = "true";
  root.append(baseSpace);
  return { root, baseSpace };
}

function loadCityStageDomRuntime() {
  const source = fs.readFileSync(domRuntimePath, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;

  let createCount = 0;
  let destroyCount = 0;
  const runtimeState = {
    x: 10,
  };
  let frameId = 0;
  const frameCallbacks = new Map();

  const module = { exports: {} };
  const context = {
    module,
    exports: module.exports,
    document: createFakeDocument(),
    window: {
      requestAnimationFrame(callback) {
        frameId += 1;
        frameCallbacks.set(frameId, callback);
        return frameId;
      },
      cancelAnimationFrame(id) {
        frameCallbacks.delete(id);
      },
    },
    require(specifier) {
      if (specifier === "./city-stage-ambient-npc-runtime") {
        return {
          createCityStageAmbientNpcRuntime() {
            createCount += 1;
            return {
              tick(deltaMs) {
                runtimeState.x += deltaMs / 16;
              },
              getRenderables() {
                return [
                  {
                    id: "npc-1",
                    x: runtimeState.x,
                    y: 20,
                    bobOffset: 0,
                    palette: "neutral",
                    sortY: 20,
                    spriteSetId: "npc.test",
                    facing: "left-down",
                  },
                ];
              },
              destroy() {
                destroyCount += 1;
              },
            };
          },
        };
      }
      if (specifier === "./city-stage-ambient-npc-sprites") {
        return {
          getAmbientNpcSpriteUrl() {
            return "/npc.png";
          },
        };
      }
      if (specifier === "./city-stage-geometry") {
        return {
          buildCityStageGeometry() {
            return {
              baseSpaceWidth: 100,
              baseSpaceHeight: 100,
            };
          },
        };
      }
      if (specifier === "./city-stage-layout-data") {
        return {
          composeCityStageLayout() {
            return [];
          },
        };
      }
      if (specifier === "./city-stage-registry") {
        return {
          getAmbientNpcDescriptors() {
            return [{ id: "npc", speed: 1, palette: "neutral", spriteSetId: "npc.test" }];
          },
          getCityStageBundleForCity() {
            return {
              layoutSource: {
                version: "1",
                map: {},
                grid: {},
              },
              prefabLibrary: {},
            };
          },
        };
      }
      throw new Error(`Unexpected require: ${specifier}`);
    },
    console,
    Map,
    Set,
  };
  vm.runInNewContext(compiled, context, { filename: domRuntimePath });

  return {
    ...module.exports,
    driveFrame(timestamp) {
      const [nextId] = frameCallbacks.keys();
      const callback = nextId == null ? null : frameCallbacks.get(nextId);
      if (nextId != null) {
        frameCallbacks.delete(nextId);
      }
      callback?.(timestamp);
    },
    readCounters() {
      return { createCount, destroyCount };
    },
  };
}

test("city stage DOM runtime reattaches same-city stage without recreating NPC runtime", () => {
  const { mountCityStageDomRuntime, driveFrame, readCounters } =
    loadCityStageDomRuntime();
  const firstStage = createStageRoot();
  const handle = mountCityStageDomRuntime(firstStage.root, { cityId: "city.haozhou" });

  driveFrame(32);

  const firstNode = firstStage.root.querySelector('[data-city-ambient-npc-id="npc-1"]');
  assert.ok(firstNode);
  const firstX = firstNode.style.getPropertyValue("--npc-x");
  assert.equal(readCounters().createCount, 1);
  assert.equal(readCounters().destroyCount, 0);

  const secondStage = createStageRoot();
  handle.attach(secondStage.root);

  const secondNode = secondStage.root.querySelector('[data-city-ambient-npc-id="npc-1"]');
  assert.ok(secondNode);
  assert.equal(secondNode.style.getPropertyValue("--npc-x"), firstX);
  assert.equal(readCounters().createCount, 1);
  assert.equal(readCounters().destroyCount, 0);

  driveFrame(48);

  assert.notEqual(
    secondNode.style.getPropertyValue("--npc-x"),
    firstX
  );
  handle.destroy();
  assert.equal(readCounters().destroyCount, 1);
});

test("main render path keeps city stage runtime alive across same-city rerenders", () => {
  const source = fs.readFileSync(mainPath, "utf8");

  assert.doesNotMatch(
    source,
    /function renderAppFrame\([^)]*\)\s*\{[\s\r\n]*cityStageDomRuntimeHandle\?\.destroy\(\);\s*cityStageDomRuntimeHandle = null;/s
  );
  assert.match(source, /cityStageDomRuntimeHandle\.attach\(stageRoot\)/);
});
