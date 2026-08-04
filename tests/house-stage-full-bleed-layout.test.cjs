const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

test("house stage host removes the global stage gutter so indoor screens fill the viewport", () => {
  const viewStyleSource = fs.readFileSync("src/styles/views.css", "utf8");

  assert.match(
    viewStyleSource,
    /\.l-stage:has\(> \.view-house-grain-shop\)\s*\{[\s\S]*padding:\s*0;/
  );
});
