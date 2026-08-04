const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("main wires the city market ambient controller through the shared audio seam", () => {
  const mainSource = fs.readFileSync(path.join(process.cwd(), "src/main.ts"), "utf8");

  assert.match(
    mainSource,
    /import cityMarketAmbientAudioUrl from "\.\/assets\/audio\/ambient\/city-market\.mp3\?url";/
  );
  assert.match(
    mainSource,
    /import \{ ScopedAmbientLoopController \} from "\.\/application\/audio\/scoped-ambient-loop-controller";/
  );
  assert.match(
    mainSource,
    /"audio\/ambient\/city-market\.mp3": cityMarketAmbientAudioUrl/
  );
  assert.match(
    mainSource,
    /createAmbientLoopHandle\(\{[\s\S]*cueId: BUILTIN_AUDIO_CUE_IDS\.ambienceCityMarket,[\s\S]*fadeInMs: 3000,[\s\S]*fadeOutMs: 3000,[\s\S]*crossfadeMs: 1000/
  );
  assert.match(
    mainSource,
    /isActive: \(snapshot\) => snapshot\.isGameVisible && snapshot\.currentView === "city"/
  );
  assert.match(
    mainSource,
    /cityMarketAmbientController\.sync\(\{[\s\S]*isGameVisible,[\s\S]*currentView: appState\.gameState\.ui\.currentView,[\s\S]*\}\);/
  );
  assert.doesNotMatch(mainSource, /new Audio\(/);
});
