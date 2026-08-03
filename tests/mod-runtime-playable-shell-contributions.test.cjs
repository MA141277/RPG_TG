const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("mod runtime contribution validation treats playableShells as available playables and default integrations", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src", "core", "mods", "mod-runtime.ts"),
    "utf8"
  );

  assert.match(
    source,
    /const availablePlayables = uniqueStrings\(\[[\s\S]*collectRecordIds\(sources, "playables"\)[\s\S]*collectRecordIds\(sources, "playableShells"\)[\s\S]*]\);/,
    "Expected mod runtime playable contribution validation to include playableShell ids."
  );

  assert.match(
    source,
    /const availablePlayableIntegrations = uniqueStrings\(\[[\s\S]*collectRecordIds\(sources, "playableIntegrations", "integrationId"\)[\s\S]*collectRecordIds\(sources, "playableShells"\)\.map\([\s\S]*`playable\.\$\{playableId\}\.default`[\s\S]*]\);/,
    "Expected mod runtime playable integration validation to synthesize playableShell default integration ids."
  );
});
