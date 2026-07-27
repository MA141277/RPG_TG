const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  renderHouseReviewAssignmentTableOverlay,
  renderHouseReviewPolicyPanelOverlay,
} = require("../.test-dist/ui/views/house/house-shared-view.js");

const repoRoot = path.resolve(__dirname, "..");

function readSource(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("review assignment table renders requested title, columns, and grade labels", () => {
  const html = renderHouseReviewAssignmentTableOverlay({
    type: "review-assignment-table",
    title: "委任",
    rows: [
      {
        characterId: "char.player",
        characterName: "朱重八",
        assignmentTitle: "筹粮",
        contribution: 90,
        grade: "outstanding",
      },
    ],
    confirmActionId: "close-review-assignment-table",
    confirmLabel: "继续",
  });
  assert.match(html, />委任</);
  for (const header of ["人物", "委任", "完成情况"]) {
    assert.match(html, new RegExp(`<th>${header}</th>`));
  }
  assert.match(html, />朱重八</);
  assert.match(html, />筹粮</);
  assert.match(html, />赫赫之功</);
});

test("review policy panel renders all policy fields and can remain visible during advice prompt", () => {
  const html = renderHouseReviewPolicyPanelOverlay({
    type: "review-policy-panel",
    title: "方略",
    policy: {
      overallGoal: "保全寺众",
      phaseGoal: "筹足粮米",
      executionPlan: "分派众人外出化缘",
    },
  });
  for (const label of ["总目标", "阶段目标", "执行计划"]) {
    assert.match(html, new RegExp(`<dt>${label}</dt>`));
  }
  assert.match(html, />保全寺众</);
  assert.match(html, />筹足粮米</);
  assert.match(html, />分派众人外出化缘</);
});

test("main entry does not gain review business imports or hardcoded review branches", () => {
  const mainSource = readSource("src/main.ts");
  assert.doesNotMatch(mainSource, /application\/review\/faction-review/);
  assert.doesNotMatch(mainSource, /review-assignment-table/);
  assert.doesNotMatch(
    mainSource,
    /赫赫之功|尽职尽责|差强人意|不尽人意|碌碌无为/
  );
});

test("keep review source uses normalized Chinese review copy and advice choices", () => {
  const source = readSource(
    "src/application/house-modules/keep-house/keep-house-house-module.ts"
  );
  for (const text of [
    "这段时间大家辛苦了",
    "看看大家这期间的进展吧",
    "有谁要进言吗",
    "发表意见",
    "一言不发",
  ]) {
    assert.match(source, new RegExp(text));
  }
  assert.doesNotMatch(source, /Contribution Report|Current Orders|Continue|Dismiss/);
});

test("temple review source uses normalized review table, policy panel, and advice choices", () => {
  const source = readSource(
    "src/application/house-modules/temple-house/temple-house-house-module.ts"
  );
  for (const text of [
    "\u8fd9\u6bb5\u65f6\u95f4\u5927\u5bb6\u8f9b\u82e6\u4e86",
    "\u770b\u770b\u5927\u5bb6\u8fd9\u671f\u95f4\u7684\u8fdb\u5c55\u5427",
    "\u6709\u8c01\u8981\u8fdb\u8a00\u5417",
    "\u53d1\u8868\u610f\u89c1",
    "\u4e00\u8a00\u4e0d\u53d1",
    "review-assignment-table",
    "review-policy-panel",
  ]) {
    assert.match(source, new RegExp(text));
  }
  assert.doesNotMatch(source, /\u4e0a\u671f\u5bfa\u4e2d\u8d21\u732e/);
});

test("review assignment table uses compact review popup and nine-slice action button", () => {
  const html = renderHouseReviewAssignmentTableOverlay({
    type: "review-assignment-table",
    title: "委任",
    rows: [],
    confirmActionId: "close-review-assignment-table",
    confirmLabel: "继续",
  });

  assert.match(html, /c-house-review-popup c-house-review-popup--table/);
  assert.match(html, /c-house-review-actions/);
  assert.match(html, /c-house-review-button/);
  assert.match(html, /c-grain-shop-button--gold/);
});

test("review policy panel uses review popup formatting and provides a close action", () => {
  const html = renderHouseReviewPolicyPanelOverlay({
    type: "review-policy-panel",
    title: "方略",
    policy: {
      overallGoal: "保全寺众",
      phaseGoal: "筹足粮米",
      executionPlan: "分派僧人外出化缘",
    },
    closeActionId: "close-review-policy-panel",
    closeLabel: "关闭",
  });

  assert.match(html, /c-house-review-popup c-house-review-popup--policy/);
  assert.match(html, /c-house-review-actions/);
  assert.match(html, /data-house-action="close-review-policy-panel"/);
  assert.match(html, />\s*关闭\s*</);
});
