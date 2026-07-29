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
  REVIEW_DEFAULT_TOP_RANK_REWARD,
  TEMPLE_TOP_RANK_REWARD,
  getRuntimeItemQuantityKey,
  readRuntimeItemQuantity,
  applyReviewItemReward,
  isReviewTopRankRewardEligible,
  createFactionRankPersonnelChanges,
  readFactionMembership,
  settleFactionReviewPersonnel,
  formatReviewPersonnelChangeLines,
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
  assert.equal(resolveFactionMeritRank(TEMPLE_FACTION_RANKS, 29).label, "杂役");
  assert.equal(resolveFactionMeritRank(TEMPLE_FACTION_RANKS, 30).label, "沙弥");
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
      {
        id: "secret",
        label: "密令",
        minRankId: "red_turban.bodyguard",
        disabled: true,
      },
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
    {
      id: "secret",
      label: "密令（最低身份：亲兵）",
      minRankId: "red_turban.bodyguard",
      minRankLabel: "亲兵",
      disabled: true,
    },
  ]);
});

test("default special task hook is empty and falls back to ordinary choices", () => {
  assert.deepEqual(getDefaultReviewSpecialTaskHookResult(), { type: "none" });
});

test("top two review ranking rewards default to two dou grain and temple overrides to scripture copy", () => {
  assert.deepEqual(REVIEW_DEFAULT_TOP_RANK_REWARD, {
    itemId: "item.grain",
    label: "斗米",
    quantity: 2,
  });
  assert.deepEqual(TEMPLE_TOP_RANK_REWARD, {
    itemId: "item.temple.scripture_copy",
    label: "经书抄本",
    quantity: 1,
  });

  const rows = [
    {
      characterId: "char.senior",
      characterName: "师兄",
      assignmentTitle: "寺中执事",
      contribution: 25,
      grade: "acceptable",
    },
    {
      characterId: "char.player",
      characterName: "朱元璋",
      assignmentTitle: "寺中执事",
      contribution: 90,
      grade: "outstanding",
    },
    {
      characterId: "char.idle",
      characterName: "闲僧",
      assignmentTitle: "寺中执事",
      contribution: 1,
      grade: "poor",
    },
  ];

  assert.equal(isReviewTopRankRewardEligible(rows, "char.player"), true);
  assert.equal(isReviewTopRankRewardEligible(rows, "char.idle"), false);
  assert.equal(
    isReviewTopRankRewardEligible(
      [{ ...rows[0], characterId: "char.player", contribution: 0, grade: "idle" }],
      "char.player"
    ),
    false
  );
});

test("review item rewards enter unified runtime inventory", () => {
  const baseState = {
    runtime: {
      variables: {
        "var.player_inventory.grain_dou": 3,
      },
    },
  };

  const withGrain = applyReviewItemReward(baseState, REVIEW_DEFAULT_TOP_RANK_REWARD);
  assert.equal(withGrain.runtime.variables["var.player_inventory.grain_dou"], 5);

  const withScripture = applyReviewItemReward(withGrain, TEMPLE_TOP_RANK_REWARD);
  assert.equal(
    readRuntimeItemQuantity(withScripture, TEMPLE_TOP_RANK_REWARD.itemId),
    1
  );
  assert.equal(
    getRuntimeItemQuantityKey(TEMPLE_TOP_RANK_REWARD.itemId),
    "var.player_inventory.item.item.temple.scripture_copy"
  );
});

test("faction rank personnel changes promote player identity from current title", () => {
  const changes = createFactionRankPersonnelChanges({
    characterDefinitions: [
      { id: "char.player", name: "朱元璋", title: "杂役" },
      { id: "char.senior", name: "师兄", title: "知客僧" },
    ],
    playerCharacterId: "char.player",
    previousRankLabel: "杂役",
    nextRankLabel: "沙弥",
  });

  assert.deepEqual(changes, [
    {
      type: "rank-changed",
      characterId: "char.player",
      characterName: "朱元璋",
      previousTitle: "杂役",
      nextTitle: "沙弥",
    },
  ]);
  assert.deepEqual(formatReviewPersonnelChangeLines(changes), [
    "朱元璋由杂役晋为沙弥。",
  ]);
  assert.deepEqual(formatReviewPersonnelChangeLines([]), [
    "本轮我方没有人事变化。",
  ]);
});

test("faction review personnel settlement records first entry before promotion", () => {
  const baseState = {
    runtime: {
      factionMemberships: {},
    },
  };

  const result = settleFactionReviewPersonnel({
    state: baseState,
    factionId: "temple",
    factionLabel: "皇觉寺",
    characterId: "char.player",
    characterName: "朱元璋",
    reviewId: "temple:1352-1-1",
    entryRankId: "temple.laborer",
    previousMerit: 0,
    nextMerit: 90,
    ranks: TEMPLE_FACTION_RANKS,
    formatRankLabel: (rank) =>
      rank.id === "temple.laborer"
        ? "杂役"
        : rank.id === "temple.novice"
          ? "沙弥"
          : rank.label,
  });

  assert.deepEqual(result.changes, [
    {
      type: "joined",
      characterId: "char.player",
      characterName: "朱元璋",
      factionLabel: "皇觉寺",
      nextTitle: "杂役",
    },
    {
      type: "rank-changed",
      characterId: "char.player",
      characterName: "朱元璋",
      previousTitle: "杂役",
      nextTitle: "沙弥",
    },
  ]);
  assert.deepEqual(formatReviewPersonnelChangeLines(result.changes), [
    "朱元璋初次加入皇觉寺，列为杂役。",
    "朱元璋由杂役晋为沙弥。",
  ]);
  assert.deepEqual(readFactionMembership(result.state, "temple", "char.player"), {
    status: "active",
    rankId: "temple.novice",
    joinedReviewId: "temple:1352-1-1",
    lastReviewId: "temple:1352-1-1",
  });
});

test("keep review task access is not derived from player fame", () => {
  const source = require("node:fs").readFileSync(
    require("node:path").join(
      __dirname,
      "..",
      "src/application/house-modules/keep-house/keep-house-house-module.ts"
    ),
    "utf8"
  );
  assert.doesNotMatch(source, /stats\.fame\s*>=/);
  assert.doesNotMatch(source, /function getTaskTier/);
  assert.match(source, /readFactionMerit/);
  assert.match(source, /createReviewTaskChoiceViewModels/);
});
