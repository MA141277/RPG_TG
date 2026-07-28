const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function readSource(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("city location subnav buttons declare the shared enter sound and light hover sound", () => {
  const source = readSource("src/ui/views/city/city-view.ts");

  assert.match(
    source,
    /data-city-location-entry-ref="\$\{cityEntry\.id\}"[\s\S]*data-enter-sound="enter"[\s\S]*data-button-hover-sound="light"/
  );
  assert.match(
    source,
    /data-city-location-house-ref="\$\{houseDefinition\.id\}"[\s\S]*data-enter-sound="enter"[\s\S]*data-button-hover-sound="light"/
  );
});

test("city utility buttons declare the light button sound centrally", () => {
  const cityViewSource = readSource("src/ui/views/city/city-view.ts");
  const city3dViewSource = readSource("src/ui/views/city/city-3d-view.ts");

  assert.match(cityViewSource, /class="c-city-menu__button[\s\S]*data-button-sound="light"/);
  assert.match(cityViewSource, /data-action="leave-city"[\s\S]*data-button-sound="light"/);
  assert.match(cityViewSource, /data-action="enter-city-3d"[\s\S]*data-button-sound="light"/);
  assert.match(
    cityViewSource,
    /data-action="close-city-menu"[\s\S]*data-button-sound="light"/
  );
  assert.match(
    cityViewSource,
    /data-action="close-city-directory"[\s\S]*data-button-sound="light"/
  );
  assert.match(
    cityViewSource,
    /data-city-directory-character-id="\$\{option\.characterId\}"[\s\S]*data-button-sound="light"/
  );
  assert.match(
    cityViewSource,
    /data-action="start-begging-minigame"[\s\S]*data-button-sound="light"/
  );
  assert.match(
    city3dViewSource,
    /data-action="leave-city-3d"[\s\S]*data-button-sound="light"/
  );
});

test("city map building hotspots and labels declare the shared enter sound", () => {
  const source = readSource("src/ui/views/city/city-stage-layout.ts");

  assert.match(
    source,
    /data-city-map-building-id="\$\{metrics\.entity\.id\}"[\s\S]*data-enter-sound="enter"/
  );
  assert.match(
    source,
    /data-city-map-building-label-id="\$\{metrics\.entity\.id\}"[\s\S]*data-enter-sound="enter"/
  );
});

test("main click and hover wiring route configured button and enter sounds before stopped handlers", () => {
  const source = readSource("src/main.ts");

  assert.match(source, /resolveUiClickCueIdFromTarget/);
  assert.match(source, /resolveButtonHoverSoundEffectFromTarget/);
  assert.match(
    source,
    /appElement\.addEventListener\(\s*"click",[\s\S]*resolveUiClickCueIdFromTarget[\s\S]*allowFallbackUiClick: shouldQueueUiClickCue\(targetElement\),[\s\S]*queueAppAudioCueById\(clickSoundCueId\);[\s\S]*syncAppAudio\(\);[\s\S]*true\s*\);/
  );
  assert.match(source, /appElement\.addEventListener\("mouseover", \(event\) => \{/);
  assert.match(source, /queueButtonSoundEffect\(configuredButtonHoverSoundEffect\)/);
});

test("city 3d house entry reuses the shared enter sound effect", () => {
  const source = readSource("src/main.ts");

  assert.match(
    source,
    /function enterMappedCity3dHouseBySceneObjectId[\s\S]*queueEnterSoundEffect\(ENTER_SOUND\)[\s\S]*enterHouseThroughRuntime/
  );
});
