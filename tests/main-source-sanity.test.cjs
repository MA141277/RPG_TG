const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("src/main.ts has no unresolved merge conflict markers", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src", "main.ts"),
    "utf8"
  );

  assert.doesNotMatch(source, /^<<<<<<< /m);
  assert.doesNotMatch(source, /^=======$/m);
  assert.doesNotMatch(source, /^>>>>>>> /m);
});
