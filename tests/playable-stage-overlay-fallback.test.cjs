const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("playable stage session prefers shell overlay before presenter fallback", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src", "ui", "app-render.ts"),
    "utf8"
  );

  assert.match(
    source,
    /if \(shell\.renderOverlay != null\) \{[\s\S]*const overlayMarkup = shell\.renderOverlay\(session\);[\s\S]*if \(overlayMarkup\.length > 0\) \{[\s\S]*return overlayMarkup;[\s\S]*\}[\s\S]*\}/,
    "Expected playable stage rendering to use shell overlay markup before the generic presenter panel."
  );
});
