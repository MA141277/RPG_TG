const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  BUILTIN_AUDIO_CUE_IDS,
  createAppAudioSession,
} = require("../.test-dist/application/audio/audio-manager.js");
const {
  TroopMutationSoundEffect,
  TROOP_MUTATION_SOUND,
} = require("../.test-dist/application/audio/troop-mutation-sound.js");

test("troop mutation sound object queues the shared cue id", () => {
  let session = createAppAudioSession();
  session = TROOP_MUTATION_SOUND.queue(session);

  assert.ok(TROOP_MUTATION_SOUND instanceof TroopMutationSoundEffect);
  assert.equal(TROOP_MUTATION_SOUND.cueId, BUILTIN_AUDIO_CUE_IDS.uiTroopMutation);
  assert.deepEqual(
    session.pendingCommands.map((command) => command.cueId),
    [BUILTIN_AUDIO_CUE_IDS.uiTroopMutation]
  );
});

test("main routes troop-editor and troop-management mutations through the shared troop mutation sound commit helper", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );

  assert.match(
    source,
    /import \{\s*TROOP_MUTATION_SOUND,\s*type TroopMutationSoundEffect,\s*\} from "\.\/application\/audio\/troop-mutation-sound";/
  );
  assert.match(
    source,
    /function queueTroopMutationSoundEffect\(effect: TroopMutationSoundEffect\): void \{[\s\S]*effect\.queue\(appAudioSession\)[\s\S]*syncAppAudio\(\);[\s\S]*\}/
  );
  assert.match(
    source,
    /function playTroopMutationSoundBurst\([\s\S]*queueTroopMutationSoundEffect\(effect\);[\s\S]*window\.setTimeout\(\(\) => \{[\s\S]*appAudioController\.playCue\(effect\.cueId\);[\s\S]*\}, repeatDelayMs \* index\);[\s\S]*\}/
  );
  assert.match(
    source,
    /function commitTroopRuntimeMutation\([\s\S]*const didMutateTroops =[\s\S]*nextAppState\.gameState\.runtime\.troops !== appState\.gameState\.runtime\.troops;[\s\S]*playTroopMutationSoundBurst\(TROOP_MUTATION_SOUND, \{[\s\S]*repeatCount: options\.mutationSoundRepeatCount,[\s\S]*repeatDelayMs: options\.mutationSoundRepeatDelayMs,[\s\S]*\}\);/
  );
  assert.match(
    source,
    /onDisbandTroop: \(input\) => \{[\s\S]*commitTroopRuntimeMutation\(disbandTroopManagementUnit\(appState, input\)\);[\s\S]*\},[\s\S]*onCreateTeam: \(input\) => \{[\s\S]*commitTroopRuntimeMutation\(createTroopEditorTeam\(appState, input\)\);[\s\S]*\},[\s\S]*onSwapTeams: \(input\) => \{[\s\S]*commitTroopRuntimeMutation\(swapTroopEditorTeams\(appState, input\)\);[\s\S]*\},[\s\S]*onDismissReserveUnit: \(input\) => \{[\s\S]*commitTroopRuntimeMutation\(dismissTroopEditorReserveUnit\(appState, input\)\);[\s\S]*\},[\s\S]*onPurchaseShopOffer: \(input\) => \{[\s\S]*commitTroopRuntimeMutation\(purchaseTroopEditorShopOffer\(appState, input\)\);/
  );
  assert.match(
    source,
    /onMoveUnit: \(input\) => \{[\s\S]*commitTroopRuntimeMutation\(moveTroopManagementUnit\(appState, input\)\);[\s\S]*\},[\s\S]*onAddUnit: \(input\) => \{[\s\S]*commitTroopRuntimeMutation\(addTroopManagementUnitFromReserve\(appState, input\)\);[\s\S]*\},[\s\S]*onRemoveUnit: \(input\) => \{[\s\S]*commitTroopRuntimeMutation\(removeTroopManagementUnit\(appState, input\)\);[\s\S]*\},[\s\S]*onClearTroop: \(input\) => \{[\s\S]*commitTroopRuntimeMutation\(clearTroopManagementUnit\(appState, input\), \{[\s\S]*mutationSoundRepeatCount: 4,[\s\S]*mutationSoundRepeatDelayMs: 100,[\s\S]*\}\);[\s\S]*\},[\s\S]*onDisbandTroop: \(input\) => \{[\s\S]*commitTroopRuntimeMutation\(disbandTroopManagementUnit\(appState, input\), \{\s*closeTroopManagementAfter: true,\s*\}\);/
  );
});
