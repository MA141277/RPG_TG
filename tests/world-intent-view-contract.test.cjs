const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

function requireSource(path) {
  assert.equal(
    fs.existsSync(path),
    true,
    `Expected source file to exist: ${path}`
  );
  return fs.readFileSync(path, "utf8");
}

test("world-intent shell contracts expose inline input state and bottom-dialogue feedback ownership", () => {
  const appShellSource = requireSource("src/application/app-shell.ts");
  const presenterSource = requireSource(
    "src/application/presenter/presenter-output.ts"
  );
  const appRenderSource = requireSource("src/ui/app-render.ts");
  const cityViewSource = requireSource("src/ui/views/city/city-view.ts");
  const houseSharedViewSource = requireSource(
    "src/ui/views/house/house-shared-view.ts"
  );

  assert.match(appShellSource, /worldIntentState/u);
  assert.match(appShellSource, /type:\s*"world-intent-feedback"/u);
  assert.match(appShellSource, /pendingResolution/u);
  assert.match(presenterSource, /worldIntent/u);
  assert.match(appRenderSource, /renderWorldIntentBar/u);
  assert.match(cityViewSource, /world-intent/u);
  assert.match(houseSharedViewSource, /world-intent/u);
});

test("world-intent bar renders as an inline city-or-house shell control with pending status text", () => {
  const {
    renderWorldIntentBar,
  } = require("../.test-dist/ui/components/world-intent/world-intent-bar.js");

  const markup = renderWorldIntentBar({
    surface: "house",
    draftText: "我要去商铺",
    status: "classifying",
    placeholder: "输入你想做的事",
    disabled: false,
  });

  assert.match(markup, /data-world-intent-bar="house"/u);
  assert.match(markup, /data-world-intent-input/u);
  assert.match(markup, /value="我要去商铺"/u);
  assert.match(markup, /data-world-intent-action="submit"/u);
  assert.match(markup, /正在分辨|正在理解|正在组织/u);
});
