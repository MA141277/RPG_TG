const test = require("node:test");
const assert = require("node:assert/strict");

const {
  REVIEW_COMPLETION_GRADE_LABELS,
  TEMPLE_FACTION_RANKS,
  RED_TURBAN_FACTION_RANKS,
  getReviewCompletionGradeLabel,
  resolveReviewCompletionGrade,
  resolveFactionMeritRank,
  readFactionMerit,
  writeFactionMerit,
  clearFactionMerit,
  createReviewTaskChoiceViewModels,
  getDefaultReviewSpecialTaskHookResult,
} = require("../.test-dist/application/review/faction-review.js");

test("review completion grades use the requested five Chinese labels", () => {
  assert.deepEqual(REVIEW_COMPLETION_GRADE_LABELS, {
    outstanding: "赫赫之功",
    fulfilled: "尽职尽责",
    acceptable: "差强人意",
    poor: "不尽人意",
    idle: "碌碌无为",
  });
  assert.equal(resolveReviewCompletionGrade(100), "outstanding");
  assert.equal(resolveReviewCompletionGrade(70), "fulfilled");
  assert.equal(resolveReviewCompletionGrade(35), "acceptable");
  assert.equal(resolveReviewCompletionGrade(1), "poor");
  assert.equal(resolveReviewCompletionGrade(0), "idle");
  assert.equal(getReviewCompletionGradeLabel("poor"), "不尽人意");
});

test("faction rank lookup resolves temple and red turban threshold boundaries", () => {
  assert.equal(resolveFactionMeritRank(TEMPLE_FACTION_RANKS, 0).label, "杂役");
  assert.equal(resolveFactionMeritRank(TEMPLE_FACTION_RANKS, 79).label, "杂役");
  assert.equal(resolveFactionMeritRank(TEMPLE_FACTION_RANKS, 80).label, "沙弥");
  assert.equal(resolveFactionMeritRank(TEMPLE_FACTION_RANKS, 1800).label, "监院");
  assert.equal(resolveFactionMeritRank(RED_TURBAN_FACTION_RANKS, 199).label, "亲兵");
  assert.equal(resolveFactionMeritRank(RED_TURBAN_FACTION_RANKS, 200).label, "亲兵队长");
  assert.equal(resolveFactionMeritRank(RED_TURBAN_FACTION_RANKS, 10000).label, "自立·吴国公 / 下克上");
});

test("faction merit is stored separately and can be cleared by faction", () => {
  const baseState = {
    runtime: {
      factionMerit: {},
    },
  };
  const withTemple = writeFactionMerit(baseState, "temple", "char.player", 90);
  const withKeep = writeFactionMerit(withTemple, "red_turban", "char.player", 220);
  assert.equal(readFactionMerit(withKeep, "temple", "char.player"), 90);
  assert.equal(readFactionMerit(withKeep, "red_turban", "char.player"), 220);
  const clearedTemple = clearFactionMerit(withKeep, "temple", "char.player");
  assert.equal(readFactionMerit(clearedTemple, "temple", "char.player"), 0);
  assert.equal(readFactionMerit(clearedTemple, "red_turban", "char.player"), 220);
});

test("review task choices include minimum identity labels and rank gating", () => {
  const choices = createReviewTaskChoiceViewModels({
    currentRankId: "red_turban.guard_captain",
    ranks: RED_TURBAN_FACTION_RANKS,
    tasks: [
      { id: "grain", label: "筹粮", minRankId: "red_turban.bodyguard" },
      { id: "drill", label: "练兵", minRankId: "red_turban.zhenfu" },
    ],
  });
  assert.deepEqual(choices, [
    {
      id: "grain",
      label: "筹粮（最低身份：亲兵）",
      minRankId: "red_turban.bodyguard",
      minRankLabel: "亲兵",
      disabled: false,
    },
    {
      id: "drill",
      label: "练兵（最低身份：镇抚）",
      minRankId: "red_turban.zhenfu",
      minRankLabel: "镇抚",
      disabled: true,
    },
  ]);
});

test("default special task hook is empty and falls back to ordinary choices", () => {
  assert.deepEqual(getDefaultReviewSpecialTaskHookResult(), { type: "none" });
});
