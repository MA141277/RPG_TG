const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function readSource(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("pointer-dispatched pachinko actions queue shared click audio before dispatch and skip duplicate click playback", () => {
  const source = readSource("src/main.ts");

  assert.match(
    source,
    /function queuePointerDispatchedUiClickCue\(targetElement: HTMLElement\): void \{[\s\S]*resolveUiClickCueIdFromTarget\(\{[\s\S]*allowFallbackUiClick: shouldQueueUiClickCue\(targetElement\),[\s\S]*queueAppAudioCueById\(clickSoundCueId\);[\s\S]*syncAppAudio\(\);[\s\S]*\}/
  );
  assert.match(
    source,
    /function shouldSkipPointerDispatchedClickAudio\(targetElement: HTMLElement\): boolean \{[\s\S]*data-activity-action[\s\S]*data-house-action[\s\S]*\}/
  );
  assert.match(
    source,
    /appElement\.addEventListener\(\s*"click",[\s\S]*if \(shouldSkipPointerDispatchedClickAudio\(targetElement\)\) \{[\s\S]*return;[\s\S]*\}[\s\S]*resolveUiClickCueIdFromTarget/
  );
  assert.match(
    source,
    /pointerActivityActionButton != null[\s\S]*shouldDispatchActivityActionOnPointerDown\(pointerActivityAction\)[\s\S]*queuePointerDispatchedUiClickCue\(pointerActivityActionButton\);[\s\S]*dispatchActivityActionButton\(pointerActivityActionButton\);/
  );
  assert.match(
    source,
    /pointerHouseActionId != null[\s\S]*shouldDispatchHouseActionOnPointerDown\(pointerHouseActionId\)[\s\S]*queuePointerDispatchedUiClickCue\(pointerHouseActionButton\);[\s\S]*dispatchHouseRuntimeRequest\(houseRuntime, \{/
  );
});
