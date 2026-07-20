const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");

test("battle renderer replays saved cleanup metadata from the Spine project before drawing custom images", () => {
  assert.match(source, /if \(!item\?\.cleanup\) return;/);
  assert.match(source, /const currentSrc = String\(item\?\.src \|\| ''\)\.trim\(\);/);
  assert.match(source, /const sourceSrc = String\(/);
  assert.match(source, /if \(currentSrc && sourceSrc && currentSrc !== sourceSrc\) return;/);
  assert.match(source, /const sourceImage = await BattleSpineRenderer\.resolveCleanupSourceImage\(images,\s*imageSources,\s*key,\s*item\);/);
  assert.match(source, /images\[key\] = await BattleSpineRenderer\.applySavedImageCleanup\(\s*sourceImage,\s*item\.cleanup\?\.options \|\| item\.cleanup,/);
  assert.match(source, /static normalizedImageCleanupOptions\(overrides = \{\}\) \{/);
  assert.match(source, /static preprocessImportedImageData\(sourceImageData,\s*options = \{\}\) \{/);
  assert.match(source, /static async applySavedImageCleanup\(image,\s*options = \{\}\) \{/);
  assert.match(source, /static async resolveCleanupSourceImage\(images,\s*imageSources,\s*key,\s*item\) \{/);
  assert.match(source, /imageData\.data\[offset\] = Math\.round\(color\[0\] \* 0\.18 \+ sampled\[0\] \* 0\.82\);/);
  assert.match(source, /const averageAlpha = alphaSum \/ Math\.max\(1,\s*sampleCount\);/);
  assert.match(source, /const resampledAlpha = Math\.round\(\(coverage \/ Math\.max\(1,\s*sampleCount\)\) \* 255\);/);
  assert.match(source, /if \(imageData\.data\[index \* 4 \+ 3\] < 6\) \{\s*BattleSpineRenderer\.clearImageDataPixel\(imageData,\s*index\);/);
});
