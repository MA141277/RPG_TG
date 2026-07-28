const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function readSource(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("temple house pachinko play button routes launch audio through the shared phase-aware marker", () => {
  const houseSource = readSource("src/ui/views/house/temple-house-view.ts");

  assert.match(
    houseSource,
    /const playButtonSoundAttribute =[\s\S]*'data-pachinko-sound="launch"'/
  );
  assert.match(
    houseSource,
    /c-pachinko-board__play[\s\S]*data-house-action="\$\{overlay\.playActionId\}"[\s\S]*\$\{playButtonSoundAttribute\}/
  );
});

test("scene pachinko play button routes launch audio through the shared phase-aware marker", () => {
  const sceneSource = readSource("src/ui/views/scene/scene-view.ts");

  assert.match(
    sceneSource,
    /const playButtonSoundAttribute =[\s\S]*'data-pachinko-sound="launch"'/
  );
  assert.match(
    sceneSource,
    /c-pachinko-board__play[\s\S]*\$\{playButtonSoundAttribute\}/
  );
});

test("temple house pachinko settling state swaps the play button to the shared heavy confirmation tone", () => {
  const houseSource = readSource("src/ui/views/house/temple-house-view.ts");

  assert.match(
    houseSource,
    /const playButtonSoundAttribute =\s*overlay\.phase === "settling"\s*\?\s*'data-button-sound="heavy"'\s*:\s*'data-pachinko-sound="launch"';/
  );
  assert.match(
    houseSource,
    /c-pachinko-board__play[\s\S]*\$\{playButtonSoundAttribute\}/
  );
});

test("scene pachinko settling state swaps the play button to the shared heavy confirmation tone", () => {
  const sceneSource = readSource("src/ui/views/scene/scene-view.ts");

  assert.match(
    sceneSource,
    /const playButtonSoundAttribute =\s*input\.phase === "settling"\s*\?\s*'data-button-sound="heavy"'\s*:\s*'data-pachinko-sound="launch"';/
  );
  assert.match(
    sceneSource,
    /c-pachinko-board__play[\s\S]*\$\{playButtonSoundAttribute\}/
  );
});
