const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  PACHINKO_COLLISION_SOUND,
} = require("../.test-dist/application/audio/pachinko-collision-sound.js");
const {
  PACHINKO_SETTLE_BURST_DELAY_MS,
  consumePachinkoCollisionAudioPulse,
} = require("../.test-dist/application/audio/pachinko-collision-playback.js");

test("pachinko collision playback consumes each pulse token once and staggers slot bursts by 80ms", () => {
  const played = [];
  const scheduled = [];
  const nextToken = consumePachinkoCollisionAudioPulse({
    session: {
      type: "pachinko-board",
      audioPulse: { token: 3, collisionCount: 2, settleCount: 1 },
    },
    lastConsumedToken: 2,
    sound: PACHINKO_COLLISION_SOUND,
    target: {
      playCue(cueId) {
        played.push(cueId);
      },
    },
    scheduleTask(callback, delayMs) {
      scheduled.push({ callback, delayMs });
      return scheduled.length;
    },
    random: () => 0,
  });

  assert.equal(PACHINKO_SETTLE_BURST_DELAY_MS, 80);
  assert.equal(nextToken, 3);
  assert.equal(played.length, 3);
  assert.deepEqual(scheduled.map((task) => task.delayMs), [80]);
  scheduled[0].callback();
  assert.equal(played.length, 4);

  const repeatedToken = consumePachinkoCollisionAudioPulse({
    session: {
      type: "pachinko-board",
      audioPulse: { token: 3, collisionCount: 2, settleCount: 1 },
    },
    lastConsumedToken: nextToken,
    sound: PACHINKO_COLLISION_SOUND,
    target: {
      playCue(cueId) {
        played.push(cueId);
      },
    },
    scheduleTask(callback, delayMs) {
      scheduled.push({ callback, delayMs });
      return scheduled.length;
    },
    random: () => 0,
  });

  assert.equal(repeatedToken, 3);
  assert.equal(played.length, 4);
  assert.equal(scheduled.length, 1);
});

test("main routes pachinko collision pulse playback through the shared helper", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );

  assert.match(
    source,
    /from "\.\/application\/audio\/pachinko-collision-playback"/
  );
  assert.match(source, /let lastPachinkoCollisionAudioToken: number \| null = null;/);
  assert.match(
    source,
    /lastPachinkoCollisionAudioToken = consumePachinkoCollisionAudioPulse\(\{/
  );
});
