const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

test("battle demo routes jump_slash and jump_thrust jump and landing cues through the move phase", () => {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  assert.match(
    source,
    /function triggerBattleJumpLandingCues\(info,\s*jumpLandingSoundPlan,\s*jumpLandingAudioState\)\s*\{/,
  );
  assert.match(
    source,
    /const moveJumpLandingSoundPlan\s*=\s*jumpLandingSoundPlan\s*&&\s*infantryAttackPlan\?\.moveAction\s*\?\s*jumpLandingSoundPlan\s*:\s*null;/,
  );
  assert.match(
    source,
    /const moveJumpLandingAudioState\s*=\s*moveJumpLandingSoundPlan\s*\?\s*\{\s*jumpAudioTriggered:\s*false,\s*landingAudioTriggered:\s*false\s*\}\s*:\s*null;/,
  );
  const moveCueMatch = source.match(
    /triggerBattleJumpLandingCues\(\s*info,\s*moveJumpLandingSoundPlan,\s*moveJumpLandingAudioState,\s*\);/,
  );
  assert.ok(moveCueMatch);
  const movePlanMatch = source.match(
    /const moveJumpLandingSoundPlan\s*=\s*jumpLandingSoundPlan\s*&&\s*infantryAttackPlan\?\.moveAction\s*\?\s*jumpLandingSoundPlan\s*:\s*null;/,
  );
  const moveAudioStateMatch = source.match(
    /const moveJumpLandingAudioState\s*=\s*moveJumpLandingSoundPlan\s*\?\s*\{\s*jumpAudioTriggered:\s*false,\s*landingAudioTriggered:\s*false\s*\}\s*:\s*null;/,
  );
  assert.ok(movePlanMatch);
  assert.ok(moveAudioStateMatch);
  const moveCueIndex = moveCueMatch.index ?? -1;
  const movePlanIndex = movePlanMatch.index ?? -1;
  const moveAudioStateIndex = moveAudioStateMatch.index ?? -1;
  assert.ok(
    movePlanIndex < moveCueIndex,
    "Expected move jump/landing sound plan to be declared before the move-phase onFrame callback uses it.",
  );
  assert.ok(
    moveAudioStateIndex < moveCueIndex,
    "Expected move jump/landing audio state to be declared before the move-phase onFrame callback uses it.",
  );
  const moveWindow = source.slice(Math.max(0, moveCueIndex - 1400), moveCueIndex + 200);
  assert.match(
    moveWindow,
    /if\s*\(!troopAsset\.stationaryAttack\s*&&\s*infantryAttackPlan\?\.moveAction\)/,
  );
  assert.match(moveWindow, /await animateBattleSpineProxy\(/);
  assert.match(moveWindow, /infantryAttackPlan\.moveAction/);
});

test("battle demo routes jump_chop jump and landing cues through the attack phase", () => {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  assert.match(
    source,
    /const attackJumpLandingSoundPlan\s*=\s*jumpLandingSoundPlan\s*&&\s*!infantryAttackPlan\?\.moveAction\s*\?\s*jumpLandingSoundPlan\s*:\s*null;/,
  );
  assert.match(
    source,
    /const attackJumpLandingAudioState\s*=\s*attackJumpLandingSoundPlan\s*\?\s*\{\s*jumpAudioTriggered:\s*false,\s*landingAudioTriggered:\s*false\s*\}\s*:\s*null;/,
  );
  const attackCueMatch = source.match(
    /triggerBattleJumpLandingCues\(\s*info,\s*attackJumpLandingSoundPlan,\s*attackJumpLandingAudioState,\s*\);/,
  );
  assert.ok(attackCueMatch);
  const attackCueIndex = attackCueMatch.index ?? -1;
  const attackAnimationIndex = source.lastIndexOf("await animateBattleSpineProxy(", attackCueIndex);
  assert.notEqual(attackAnimationIndex, -1);
  const attackWindow = source.slice(attackAnimationIndex, attackCueIndex + 200);
  assert.match(attackWindow, /attackActionId/);
});
