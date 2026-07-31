const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

test("troop-editor interactions keep formation prompts in readable Chinese", () => {
  const source = fs.readFileSync(
    "src/ui/views/troop-editor/troop-editor-interactions.ts",
    "utf8"
  );

  [
    /disbandForbidden:\s*"本队不可解散"/,
    /disbandReserveFull:\s*"预备队空间不足，无法解散队伍"/,
    /recruitReserveFull:\s*"预备队已满，请先解雇士兵"/,
    /recruitGoldInsufficient:\s*"金钱不足"/,
    /recruitFameInsufficient:\s*"声望不足"/,
    /emptyName:\s*"队伍名称不能为空"/,
    /duplicateName:\s*"队伍名称不能重复"/,
    /missingCaptain:\s*"必须先选择队长"/,
    /confirmText\.textContent = "确定要解散队伍吗？被解散的单位将返回预备队。";/,
    /state\.createErrorText = CREATE_ERROR_TEXT\.missingCaptain;/,
  ].forEach((pattern) => assert.match(source, pattern));

  assert.doesNotMatch(source, /\uFFFD/);
  assert.doesNotMatch(source, /disbandForbidden:\s*"���/);
  assert.doesNotMatch(source, /confirmText\.textContent = "ȷ��Ҫ/);
});
