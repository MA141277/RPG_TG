const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("temple utility overlays use the usual-ui settlement popup skin", () => {
  const source = fs.readFileSync(
    path.join(
      __dirname,
      "..",
      "src/ui/views/house/temple-house-view.ts"
    ),
    "utf8"
  );

  assert.match(source, /data-house-overlay-variant="temple-utility-popup"/);
  assert.match(source, /c-house-contribution-settlement c-house-temple-utility-popup/);
  assert.match(source, /data-house-overlay-variant="temple-task-confirm"/);
  assert.match(source, /c-house-contribution-settlement c-house-temple-task-confirm/);
  assert.match(source, /renderHouseAlertOverlay\(overlay,\s*\{\s*overlayAttribute: templePopupOverlayAttribute,\s*modalClassName: templePopupModalClassName,\s*\}\)/s);
  assert.match(source, /renderHouseQuantityConfirmOverlay\(overlay,\s*\{\s*overlayAttribute: templePopupOverlayAttribute,\s*modalClassName: templePopupModalClassName,\s*\}\)/s);
  assert.match(source, /data-house-overlay="rest-days"\$\{templePopupOverlayAttribute\}/);
  assert.match(source, /data-house-overlay="result"\$\{templePopupOverlayAttribute\}/);
  assert.match(source, /c-temple-house-modal\$\{templePopupModalClassName\}/);
});
