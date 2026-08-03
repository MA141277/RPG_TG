const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("building-stage minigames do not gate overlay composition on house owner kind", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src", "ui", "app-render.ts"),
    "utf8"
  );

  assert.doesNotMatch(
    source,
    /activePlayableSession\.ownerContext\.ownerKind === "house" &&\s*stage\.type === "building"/,
    "Expected building-stage playable rendering to work for authored external/event ownership too, not only ownerKind=house."
  );
});
