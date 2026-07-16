const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");

test("battle melee hit flash timing still follows the action effect frame fallback", () => {
  assert.match(
    source,
    /const attackWhiteFlashStartFrame = infantryAttackPlan\?\.effectFrame\s*\n\s*\?\? troopAsset\.attackEffectFrame\s*\n\s*\?\? Math\.max\(0, attackPeakFrame - 1\);/,
  );
  assert.match(source, /effectFrame:\s*step\.hit \? attackWhiteFlashStartFrame : null,/);
});

test("battle white flash envelope uses 2 frame fade in, 4 frame hold, and 2 frame fade out", () => {
  assert.match(source, /startAt:\s*peakTime - frameMs \* 2,/);
  assert.match(source, /holdEndAt:\s*peakTime \+ frameMs \* 4,/);
  assert.match(source, /endAt:\s*peakTime \+ frameMs \* 6,/);
  assert.match(source, /else if \(now <= activeEvent\.holdEndAt\)\s*\{\s*intensity = 1;/);
  assert.doesNotMatch(source, /--hit-white-opacity', String\(intensity \* 0\.68\)/);
  assert.match(source, /--hit-white-opacity', String\(intensity\)/);
});

test("battle white flash uses a dedicated overlay canvas instead of whitening the main character canvas", () => {
  assert.match(source, /const whiteFlashCanvas = document\.createElement\('canvas'\);/);
  assert.match(source, /whiteFlashCanvas\.className = 'formation-spine-white-flash-canvas';/);
  assert.match(source, /const whiteFlashSourceCanvas = document\.createElement\('canvas'\);/);
  assert.match(source, /whiteFlashSourceCanvas\.className = 'formation-spine-white-flash-source-canvas';/);
  assert.match(source, /frame\.appendChild\(whiteFlashSourceCanvas\);/);
  assert.doesNotMatch(source, /\.formation-slot\.hit-white-flash \.formation-spine-canvas\s*\{[\s\S]*?filter:\s*brightness\(0\) saturate\(0\) invert\(1\);/);
});

test("battle white flash overlay syncs only on the target effect frame and seals seams with offset silhouette draws", () => {
  const syncMatch = source.match(/function syncBattleWhiteFlashOverlayCanvas\(canvas\) \{[\s\S]*?\n    \}/);
  assert.ok(syncMatch, 'expected syncBattleWhiteFlashOverlayCanvas function');
  const syncSource = syncMatch[0];
  assert.doesNotMatch(source, /syncBattleWhiteFlashOverlayCanvas\(entry\.canvas\);/);
  assert.doesNotMatch(source, /syncBattleWhiteFlashOverlayCanvas\(canvas\);/);
  assert.match(source, /const targetCanvas = targetSlot\?\.querySelector\('\.formation-spine-canvas'\);/);
  assert.match(source, /onEffect:\s*step\.hit[\s\S]*?syncBattleWhiteFlashOverlayCanvas\(targetCanvas\);[\s\S]*?queueBattleWhiteFlash\(targetSlot,\s*info\?\.peakAt,\s*info\?\.frameDurationMs\)/);
  assert.doesNotMatch(syncSource, /getImageData\(0,\s*0,\s*canvas\.width,\s*canvas\.height\)/);
  assert.doesNotMatch(syncSource, /createImageData\(canvas\.width,\s*canvas\.height\)/);
  assert.doesNotMatch(syncSource, /putImageData\(outputImageData,\s*0,\s*0\)/);
  assert.match(syncSource, /const renderer = canvas\.__battleSpineRenderer;/);
  assert.match(syncSource, /const whiteFlashSourceCanvas = canvas\.__battleWhiteFlashSourceCanvas;/);
  assert.match(syncSource, /renderer\.render\(whiteFlashSourceCanvas,\s*canvas\.__battleLastRenderActionId \|\| canvas\.dataset\.action \|\| 'idle',\s*canvas\.__battleLastRenderElapsedMs \|\| 0,\s*\{/);
  assert.match(syncSource, /imageSet:\s*'whiteSilhouette'/);
  assert.match(syncSource, /const seamFillOffsets = \[/);
  assert.match(syncSource, /seamFillOffsets\.forEach\(\(\[offsetX,\s*offsetY\]\) => \{/);
  assert.match(syncSource, /whiteFlashCtx\.drawImage\(whiteFlashSourceCanvas,\s*offsetX,\s*offsetY\);/);
  assert.doesNotMatch(syncSource, /whiteFlashCtx\.filter = 'blur\(1\.2px\)';/);
});
