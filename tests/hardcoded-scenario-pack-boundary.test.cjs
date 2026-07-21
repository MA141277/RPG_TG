const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");

test("legacy house module text boundary is retired with house module sources", () => {
  assert.equal(
    fs.existsSync(path.join(projectRoot, "src", "application", "house-modules")),
    false
  );
  assert.equal(
    fs.existsSync(path.join(projectRoot, "src", "ui", "views", "house")),
    false
  );
});
