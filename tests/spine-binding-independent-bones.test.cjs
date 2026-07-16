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

function loadEditorSource() {
  return fs.readFileSync("tools/spine-node-timeline-editor.html", "utf8");
}

test("binding mode exposes only editable detached bones in the independent-bone picker", () => {
  const source = loadEditorSource();
  const body = extractFunctionBody(source, "function independentEditableBones()");
  const independentEditableBones = new Function(
    "state",
    "isTransformLockedNode",
    `return function independentEditableBones() {${body}};`,
  )(
    {
      nodes: [
        { id: "detached-1", name: "独立骨骼 1", parentId: null },
        { id: "child", name: "子骨骼", parentId: "detached-1" },
        { id: "piece", name: "贴图", parentId: null, attachment: {} },
        { id: "locked", name: "锁定骨骼", parentId: null, lockedTransform: true },
      ],
    },
    (node) => Boolean(node?.lockedTransform),
  );

  assert.deepEqual(independentEditableBones().map((node) => node.id), ["detached-1"]);
});

test("binding mode renders an independent-bone picker that can target detached bones for property editing", () => {
  const source = loadEditorSource();
  const body = extractFunctionBody(source, "function renderIndependentBonePicker()");
  const documentStub = {
    createElement() {
      return { value: "", textContent: "", selected: false };
    },
  };
  const row = { hidden: true };
  const select = {
    innerHTML: "",
    disabled: true,
    value: "",
    options: [],
    appendChild(option) {
      this.options.push(option);
    },
  };
  const renderIndependentBonePicker = new Function(
    "el",
    "document",
    "isBindingMode",
    "independentEditableBones",
    "selectedNode",
    `return function renderIndependentBonePicker() {${body}};`,
  )(
    { independentBoneRow: row, independentBoneSelect: select },
    documentStub,
    () => true,
    () => [
      { id: "detached-1", name: "独立骨骼 1" },
      { id: "detached-2", name: "独立骨骼 2" },
    ],
    () => ({ id: "detached-2" }),
  );

  renderIndependentBonePicker();

  assert.equal(row.hidden, false);
  assert.equal(select.disabled, false);
  assert.equal(select.options.length, 2);
  assert.equal(select.options[1].selected, true);
});
