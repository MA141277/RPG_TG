const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const appRenderPath = path.join(root, "src", "ui", "app-render.ts");

test("enter-city confirm modal config assigns heavy confirm and light cancel button sounds", () => {
  const source = fs.readFileSync(appRenderPath, "utf8");

  assert.match(source, /confirmButtonSound:\s*"heavy"/);
  assert.match(source, /cancelButtonSound:\s*"light"/);
});
