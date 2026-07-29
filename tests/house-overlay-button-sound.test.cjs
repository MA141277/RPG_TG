const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("house alert overlay renders configured confirm button sound declaratively", () => {
  const {
    renderHouseAlertOverlay,
  } = require("../.test-dist/ui/views/house/house-shared-view.js");

  const html = renderHouseAlertOverlay({
    type: "alert",
    title: "测试任务",
    paragraphs: ["测试说明"],
    confirmActionId: "close-temple-overlay",
    confirmLabel: "收下",
    confirmButtonSound: "light",
  });

  assert.match(
    html,
    /data-house-action="close-temple-overlay"[\s\S]*data-button-sound="light"/
  );
});

test("temple task accept overlay declares the light confirm button sound centrally", () => {
  const source = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/application/house-modules/temple-house/temple-house-house-module.ts"
    ),
    "utf8"
  );

  assert.match(
    source,
    /confirmLabel: "收下"[\s\S]*confirmButtonSound: "light"/
  );
});
