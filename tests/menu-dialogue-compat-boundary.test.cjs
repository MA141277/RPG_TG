const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("legacy city menu dialogue launch is isolated behind a dedicated compat seam", () => {
  const compatPath = path.join(
    process.cwd(),
    "src/application/city-menu/city-menu-dialogue-compat.ts"
  );
  const compatSource = fs.readFileSync(compatPath, "utf8");
  const mainSource = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );
  const coordinatorSource = fs.readFileSync(
    path.join(process.cwd(), "src/application/ui/app-click-coordinator.ts"),
    "utf8"
  );

  assert.match(compatSource, /export function launchLegacyCityMenuDialogue/);
  assert.match(compatSource, /openDialogueFromMenuTarget/);
  assert.doesNotMatch(mainSource, /openDialogueFromMenuTarget/);
  assert.doesNotMatch(coordinatorSource, /openDialogueFromMenuTarget/);
  assert.match(mainSource, /launchLegacyCityMenuDialogue/);
  assert.match(coordinatorSource, /launchLegacyCityMenuDialogue/);
});
