const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

test("troop-management move interactions keep captain removal warning in readable Chinese", () => {
  const source = fs.readFileSync(
    "src/ui/views/troop-editor/troop-management-move-interactions.ts",
    "utf8"
  );

  assert.match(source, /captainRemoveForbidden:\s*"当前队长不可直接移出队伍"/);
  assert.doesNotMatch(source, /captainRemoveForbidden:\s*"褰撳墠闃熼暱/);
});
