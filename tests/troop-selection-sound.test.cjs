const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  BUILTIN_AUDIO_CUE_IDS,
  createAppAudioSession,
} = require("../.test-dist/application/audio/audio-manager.js");
const {
  TroopSelectionSoundEffect,
  TROOP_SELECTION_SOUND,
} = require("../.test-dist/application/audio/troop-selection-sound.js");

test("troop selection sound object queues the shared cue id", () => {
  let session = createAppAudioSession();
  session = TROOP_SELECTION_SOUND.queue(session);

  assert.ok(TROOP_SELECTION_SOUND instanceof TroopSelectionSoundEffect);
  assert.equal(TROOP_SELECTION_SOUND.cueId, BUILTIN_AUDIO_CUE_IDS.uiTroopSelection);
  assert.deepEqual(
    session.pendingCommands.map((command) => command.cueId),
    [BUILTIN_AUDIO_CUE_IDS.uiTroopSelection]
  );
});

test("main and troop-management interactions route occupied-slot selection through the shared troop selection sound callback", () => {
  const mainSource = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );
  const interactionsSource = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/ui/views/troop-editor/troop-management-move-interactions.ts"
    ),
    "utf8"
  );

  assert.match(
    mainSource,
    /import \{\s*TROOP_SELECTION_SOUND,\s*type TroopSelectionSoundEffect,\s*\} from "\.\/application\/audio\/troop-selection-sound";/
  );
  assert.match(
    mainSource,
    /function queueTroopSelectionSoundEffect\(effect: TroopSelectionSoundEffect\): void \{[\s\S]*effect\.queue\(appAudioSession\)[\s\S]*syncAppAudio\(\);[\s\S]*\}/
  );
  assert.match(
    mainSource,
    /syncTroopManagementMoveInteractions\(appRoot, \{[\s\S]*onSelectUnit: \(\) => \{[\s\S]*queueTroopSelectionSoundEffect\(TROOP_SELECTION_SOUND\);[\s\S]*\},/
  );
  assert.match(
    interactionsSource,
    /type SyncTroopManagementMoveInteractionsInput = \{[\s\S]*onSelectUnit: \(\) => void;/
  );
  assert.match(
    interactionsSource,
    /if \(state\.mode === "move-select"\) \{[\s\S]*if \(slotKey != null && !isEmptySlot\) \{[\s\S]*input\.onSelectUnit\(\);[\s\S]*selectMoveSourceSlot\(slotKey\);/
  );
  assert.match(
    interactionsSource,
    /if \(state\.mode === "remove-select"\) \{[\s\S]*if \(slotKey != null && !isEmptySlot\) \{[\s\S]*if \(readReserveCount\(root\) >= readReserveCapacity\(root\)\) \{[\s\S]*\}[\s\S]*input\.onSelectUnit\(\);[\s\S]*openConfirm\(\{ kind: "remove", slotKey \}\);/
  );
});

test("main routes successful campaign hex travel starts through the shared troop selection sound callback", () => {
  const mainSource = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );
  const startCampaignTravelBlock = mainSource.match(
    /function startCampaignTravel\([\s\S]*?\r?\n}\r?\n\r?\nfunction animateCampaignMove/
  )?.[0] ?? "";

  assert.match(
    startCampaignTravelBlock,
    /const travelPath = createCampaignTravelPath\(targetCoordinate\);[\s\S]*?if \(travelPath == null\) \{[\s\S]*?return;[\s\S]*?\}[\s\S]*?queueTroopSelectionSoundEffect\(TROOP_SELECTION_SOUND\);[\s\S]*?const nextCoordinate = getLastTravelPathCoordinate\(travelPath\);/
  );
});
