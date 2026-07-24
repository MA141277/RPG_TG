# Faction Review Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a shared faction review cadence for temple and keep reviews with structured assignment tables, faction merit ranks, policy panels, and rank-gated assignment choices.

**Architecture:** Add a reusable review domain/application layer for contribution grades, assignment rows, policy panels, faction merit ranks, and task choice gating. Keep temple and keep house modules responsible for committing their own assignment effects, but make both consume the shared review semantics and typed UI view models. Use the `origin/dev` review-cycle policy as the reference for schedule compatibility consolidation without adding new `main.ts` review branches.

**Tech Stack:** TypeScript, Vite, Node test runner, `npm run build:test`, `npm run typecheck`, `npm test`, `npm run build`, `npm run lint:plans`.

## Global Constraints

- Do not add review-flow business branches to `src/main.ts`.
- Do not make `src/main.ts` import concrete review business modules.
- Do not return HTML strings from `application/*` modules.
- Do not store persistent review or faction-rank data in ad hoc top-level globals.
- Do not reset player base stats, money, skills, inventory, or unrelated character fields during review entry.
- Persistent gameplay changes must flow through `GameState.runtime` or existing unified state structures.
- Assignment table title must be `委任`.
- Assignment table columns must be `人物`, `委任`, `完成情况`.
- Completion labels must be exactly `赫赫之功`, `尽职尽责`, `差强人意`, `不尽人意`, `碌碌无为`.
- Policy panel fields must be `总目标`, `阶段目标`, `执行计划`.
- Ordinary task choice labels must append `（最低身份：身份名）`.
- Temple and Red Turban faction merit are tracked separately per faction.
- `发表意见` remains an extension point in this slice and may route to a placeholder response before ordinary assignment selection.
- Special story task support is an interface only in this slice; no story-specific special task content is required.
- If shared review interfaces, runtime session structure, registry shape, or cross-module wiring changes, update `docs/change-log.md`.

## Execution State

- Status: `running`
- Last Updated: `2026-07-24`
- Current Focus: `Task 2 complete; Task 3 next`
- Next Step: `Execute Task 3 with failing keep flow and rank-gate tests first.`
- Verification: `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/faction-review-ui-contract.test.cjs }`
- Notes: `Plan created after approval of docs/superpowers/specs/2026-07-24-faction-review-flow-design.md.`

## Progress Log

- 2026-07-24
  - Summary: `Created the implementation plan for normalized faction review flow after spec approval.`
  - Verification: `npm run lint:plans`
  - Next: `Run npm run lint:plans, then start Task 1 with TDD.`
- 2026-07-24
  - Summary: `Completed Task 1 shared review domain helpers, faction merit runtime storage, and focused domain coverage.`
  - Verification: `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/faction-review-domain.test.cjs }`; `npm run typecheck`
  - Next: `Execute Task 2 with failing UI contract tests first.`
- 2026-07-24
  - Summary: `Completed Task 2 structured review assignment table and policy panel overlay contracts with shared UI renderers.`
  - Verification: `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/faction-review-ui-contract.test.cjs }`
  - Next: `Execute Task 3 with failing keep flow and rank-gate tests first.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-24-faction-review-flow-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `narrowed`
- Notes:
  - `origin/dev` has `src/application/review/review-cycle.ts` and `src/application/review/review-cycle-provider.ts`; current branch does not. Reintroduce the useful schedule policy seam only if it helps avoid new house-local countdown logic.`
  - `Current temple and keep modules already have meeting stages; this plan normalizes their review semantics without replacing the entire house lifecycle.`
  - `The first implementation should keep task content in existing activity definitions and add rank metadata only where needed.`

## Implementation Scope

### In Scope

- Shared review domain contracts and pure helpers.
- Temple and Red Turban faction merit rank tables.
- Shared assignment-row completion grade labels.
- Shared ordinary task choice gating by faction merit rank.
- Structured assignment-table and policy-panel overlay/view models.
- Keep review flow normalized to leader opening, assignment table, praise, situation, policy, advice prompt, and task selection.
- Temple review flow normalized to the same cadence while preserving existing temple story gates for begging and week-specific work.
- Special task hook interface with empty default behavior.
- Focused regression tests, typecheck, build, and changelog.

### Still Out Of Scope

- Full advice/debate/minigame implementation for `发表意见`.
- Story-specific special task content.
- Full review definition mod contribution registry.
- Full visual redesign of non-review house screens.
- Closing the older unified backpack inventory governance child.

## File Map

### Existing files to modify

- `src/domain/game-state.ts`
  - Add faction merit runtime storage if no suitable runtime structure already exists.
- `src/domain/house-module.ts`
  - Add typed review assignment table and policy panel overlay variants.
- `src/domain/house-modules/keep-house-session.ts`
  - Align keep meeting stages and overlay state with shared review flow.
- `src/domain/house-modules/temple-house-session.ts`
  - Align temple meeting stages and overlay state with shared review flow.
- `src/domain/keep-house.ts`
  - Replace generic keep task tier semantics with rank-aware minimum identity metadata or bridge old metadata to rank IDs.
- `src/domain/activity.ts`
  - Add optional rank-gate metadata for keep/temple review task choices.
- `src/application/house-modules/keep-house/keep-house-house-module.ts`
  - Consume shared review helpers, normalize review flow copy, use faction merit rank gates, and keep task assignment commit logic local.
- `src/application/house-modules/temple-house/temple-house-house-module.ts`
  - Consume shared review helpers, normalize review flow copy, preserve temple story-specific assignment gates, and keep work-plan commit logic local.
- `src/application/house-modules/keep-house/keep-house-session-state.ts`
  - Initialize any new keep session fields.
- `src/ui/views/house/house-shared-view.ts`
  - Render structured review assignment table and policy panel overlays.
- `src/ui/views/house/keep-house-view.ts`
  - Render keep review overlays and Chinese action labels through shared house rendering.
- `src/ui/views/house/temple-house-view.ts`
  - Render temple review overlays and policy panel through shared house rendering.
- `src/content/scenario-packs/zhuyuanzhang/activities.json`
  - Add minimum rank ids to ordinary review task definitions.
- `src/content/scenario-packs/zhuyuanzhang/house-content/keep-house-content.json`
  - Add normalized policy panel fields if keep strategy content needs structured values.
- `docs/change-log.md`
  - Record shared review flow, rank-gate, and UI contract changes.
- `docs/superpowers/project-progress.md`
  - Point current execution state to this plan while work is active.
- `docs/superpowers/plans/2026-07-24-faction-review-flow-plan.md`
  - Track checkboxes, execution state, progress log, and verification.

### Existing files expected to be deleted

- None.

### New files to create

- `src/domain/review.ts`
  - Shared review domain types for completion grades, assignment rows, policy panels, faction ranks, task choices, and special task hooks.
- `src/application/review/faction-review.ts`
  - Pure helpers for grade mapping, rank lookup, merit read/write, task-choice labels, ranking, and default special-task behavior.
- `src/application/review/review-cycle.ts`
  - Adapt the `origin/dev` schedule compatibility helper if needed by implementation.
- `src/application/review/review-cycle-provider.ts`
  - Adapt the `origin/dev` policy provider if needed by implementation.
- `tests/faction-review-domain.test.cjs`
  - Node tests for grade labels, rank lookup, faction merit, and task choice gating.
- `tests/faction-review-ui-contract.test.cjs`
  - Node tests for structured overlay rendering and source-level `main.ts` boundary checks.

## Verification Plan

- Targeted verification:
  - `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/faction-review-domain.test.cjs tests/faction-review-ui-contract.test.cjs }`
- Required commands:
  - `npm run lint:plans`
  - `npm run typecheck`
  - `npm test`
  - `npm run build`

## Task 1: Shared Review Domain And Faction Merit

**Files:**
- Create: `src/domain/review.ts`
- Create: `src/application/review/faction-review.ts`
- Modify: `src/domain/game-state.ts`
- Create: `tests/faction-review-domain.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-24-faction-review-flow-plan.md`

**Interfaces:**
- Produces: `ReviewCompletionGrade`, `ReviewAssignmentRow`, `ReviewPolicyPanel`, `FactionMeritRank`, `ReviewTaskChoice`, `ReviewSpecialTaskHookResult`, `REVIEW_COMPLETION_GRADE_LABELS`, `TEMPLE_FACTION_RANKS`, `RED_TURBAN_FACTION_RANKS`, `getReviewCompletionGradeLabel()`, `resolveReviewCompletionGrade()`, `resolveFactionMeritRank()`, `readFactionMerit()`, `writeFactionMerit()`, `clearFactionMerit()`, `createReviewTaskChoiceViewModels()`, `getDefaultReviewSpecialTaskHookResult()`.
- Consumes: `GameState.runtime` and existing character/task IDs.

- [x] **Step 1: Write the failing domain tests**

Create `tests/faction-review-domain.test.cjs` with tests that require the not-yet-created compiled module:

```js
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
```

- [x] **Step 2: Run the targeted tests and verify RED**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/faction-review-domain.test.cjs }
```

Expected:

- Fails because `../.test-dist/application/review/faction-review.js` does not exist.

- [x] **Step 3: Add shared review domain types**

Create `src/domain/review.ts` with exported types matching the spec:

```ts
export type ReviewCompletionGrade =
  | "outstanding"
  | "fulfilled"
  | "acceptable"
  | "poor"
  | "idle";

export type ReviewAssignmentRow = {
  characterId: string;
  characterName: string;
  assignmentTitle: string;
  contribution: number;
  grade: ReviewCompletionGrade;
};

export type ReviewPolicyPanel = {
  overallGoal: string;
  phaseGoal: string;
  executionPlan: string;
};

export type FactionMeritRank = {
  id: string;
  label: string;
  minMerit: number;
  stipendLabel?: string;
};

export type ReviewTaskGate = {
  id: string;
  label: string;
  minRankId: string;
};

export type ReviewTaskChoice = {
  id: string;
  label: string;
  minRankId: string;
  minRankLabel: string;
  disabled: boolean;
};

export type ReviewSpecialTaskHookResult =
  | { type: "none" }
  | {
      type: "available";
      descriptionLines: string[];
      acceptActionId: string;
      declineActionId: string;
    };
```

- [x] **Step 4: Add faction merit runtime storage**

Modify `src/domain/game-state.ts` so `GameState.runtime` includes:

```ts
factionMerit: Record<string, Record<CharacterId, number>>;
```

Then update initial state creation if TypeScript reports missing `factionMerit`; initialize it as `{}`.

- [x] **Step 5: Implement pure review helpers**

Create `src/application/review/faction-review.ts` exporting the functions used in Step 1. Use these exact rank ids:

```ts
export const TEMPLE_FACTION_RANKS: FactionMeritRank[] = [
  { id: "temple.laborer", label: "杂役", minMerit: 0, stipendLabel: "0（管饭）" },
  { id: "temple.novice", label: "沙弥", minMerit: 80, stipendLabel: "1 斗米" },
  { id: "temple.itinerant", label: "云游僧", minMerit: 200, stipendLabel: "化缘所得" },
  { id: "temple.monk", label: "比丘", minMerit: 500, stipendLabel: "3 斗米" },
  { id: "temple.guest_master", label: "知客僧", minMerit: 1000, stipendLabel: "5 斗米" },
  { id: "temple.prior", label: "监院", minMerit: 1800, stipendLabel: "8 斗米" },
];

export const RED_TURBAN_FACTION_RANKS: FactionMeritRank[] = [
  { id: "red_turban.bodyguard", label: "亲兵", minMerit: 0 },
  { id: "red_turban.guard_captain", label: "亲兵队长", minMerit: 200 },
  { id: "red_turban.zhenfu", label: "镇抚", minMerit: 600 },
  { id: "red_turban.military_governor", label: "管军总管", minMerit: 1400 },
  { id: "red_turban.commander_general", label: "总兵官", minMerit: 3000 },
  { id: "red_turban.deputy_marshal", label: "（左副）元帅", minMerit: 4500 },
  { id: "red_turban.duke_or_usurper", label: "自立·吴国公 / 下克上", minMerit: 10000 },
];
```

Use thresholds `>= 90` outstanding, `>= 60` fulfilled, `>= 25` acceptable, `> 0` poor, otherwise idle.

- [x] **Step 6: Verify GREEN**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/faction-review-domain.test.cjs }
```

Expected:

- `faction-review-domain.test.cjs` passes.

- [x] **Step 7: Update plan progress**

Update this plan:

- mark Task 1 steps complete
- set `Execution State.Current Focus` to `Task 1 complete; Task 2 next`
- append a `Progress Log` entry with the targeted verification command

## Task 2: Structured Review Overlays And UI Contracts

**Files:**
- Modify: `src/domain/house-module.ts`
- Modify: `src/ui/views/house/house-shared-view.ts`
- Create: `tests/faction-review-ui-contract.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-24-faction-review-flow-plan.md`

**Interfaces:**
- Consumes: `ReviewAssignmentRow`, `ReviewPolicyPanel`.
- Produces: `HouseOverlayViewModel` variants `review-assignment-table` and `review-policy-panel`, rendered by `renderHouseReviewAssignmentTableOverlay()` and `renderHouseReviewPolicyPanelOverlay()` inside `renderHouseOverlay` or equivalent shared renderer.

- [x] **Step 1: Write failing UI contract tests**

Create `tests/faction-review-ui-contract.test.cjs`:

```js
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
    title: "方针",
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
  assert.doesNotMatch(mainSource, /application\\/review\\/faction-review/);
  assert.doesNotMatch(mainSource, /review-assignment-table/);
  assert.doesNotMatch(mainSource, /赫赫之功|尽职尽责|差强人意|不尽人意|碌碌无为/);
});
```

- [x] **Step 2: Run the targeted UI tests and verify RED**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/faction-review-ui-contract.test.cjs }
```

Expected:

- Fails because the shared overlay renderers are not exported.

- [x] **Step 3: Extend `HouseOverlayViewModel`**

Modify `src/domain/house-module.ts` to add:

```ts
import type {
  ReviewAssignmentRow,
  ReviewPolicyPanel,
} from "./review";
```

Add union members:

```ts
| {
    type: "review-assignment-table";
    title: string;
    rows: ReviewAssignmentRow[];
    confirmActionId: string;
    confirmLabel: string;
  }
| {
    type: "review-policy-panel";
    title: string;
    policy: ReviewPolicyPanel;
  }
```

- [x] **Step 4: Render assignment table and policy panel in shared view**

Modify `src/ui/views/house/house-shared-view.ts`:

- export `renderHouseReviewAssignmentTableOverlay`
- export `renderHouseReviewPolicyPanelOverlay`
- render grade labels via `getReviewCompletionGradeLabel`
- escape all table cell text with existing `escapeHtml`

The table must use:

```html
<table class="c-house-review-table">
  <thead><tr><th>人物</th><th>委任</th><th>完成情况</th></tr></thead>
</table>
```

The policy panel must use:

```html
<dl class="c-house-review-policy">
  <dt>总目标</dt>
  <dd>...</dd>
  <dt>阶段目标</dt>
  <dd>...</dd>
  <dt>执行计划</dt>
  <dd>...</dd>
</dl>
```

- [x] **Step 5: Verify GREEN**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/faction-review-ui-contract.test.cjs }
```

Expected:

- UI contract tests pass.

- [x] **Step 6: Update plan progress**

Update this plan:

- mark Task 2 steps complete
- set `Execution State.Current Focus` to `Task 2 complete; Task 3 next`
- append a `Progress Log` entry with the targeted verification command

## Task 3: Keep Review Flow Normalization

**Files:**
- Modify: `src/domain/activity.ts`
- Modify: `src/domain/keep-house.ts`
- Modify: `src/domain/house-modules/keep-house-session.ts`
- Modify: `src/application/house-modules/keep-house/keep-house-session-state.ts`
- Modify: `src/application/house-modules/keep-house/keep-house-house-module.ts`
- Modify: `src/ui/views/house/keep-house-view.ts`
- Modify: `src/content/scenario-packs/zhuyuanzhang/activities.json`
- Modify: `src/content/scenario-packs/zhuyuanzhang/house-content/keep-house-content.json`
- Modify: `tests/faction-review-domain.test.cjs`
- Modify: `tests/faction-review-ui-contract.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-24-faction-review-flow-plan.md`

**Interfaces:**
- Consumes: Task 1 helpers and Task 2 overlay variants.
- Produces: keep review sequence `intro -> assignment-table -> praise -> situation -> policy -> advice -> assign-task -> assigned`, rank-gated ordinary tasks, Chinese labels, and no fame-based task filtering.

- [ ] **Step 1: Add failing keep flow and rank-gate tests**

Append tests to `tests/faction-review-domain.test.cjs` that import keep module helpers only if they are exported; if no helper is practical, assert source-level removal:

```js
test("keep review task access is not derived from player fame", () => {
  const source = require("node:fs").readFileSync(
    require("node:path").join(__dirname, "..", "src/application/house-modules/keep-house/keep-house-house-module.ts"),
    "utf8"
  );
  assert.doesNotMatch(source, /stats\\.fame\\s*>=/);
  assert.doesNotMatch(source, /function getTaskTier/);
  assert.match(source, /readFactionMerit/);
  assert.match(source, /createReviewTaskChoiceViewModels/);
});
```

Append tests to `tests/faction-review-ui-contract.test.cjs`:

```js
test("keep review source uses normalized Chinese review copy and advice choices", () => {
  const source = readSource("src/application/house-modules/keep-house/keep-house-house-module.ts");
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
```

- [ ] **Step 2: Run targeted tests and verify RED**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/faction-review-domain.test.cjs tests/faction-review-ui-contract.test.cjs }
```

Expected:

- Fails because keep still uses fame-derived tiers or English review copy.

- [ ] **Step 3: Add rank metadata to keep activities**

Modify keep task definitions in `src/content/scenario-packs/zhuyuanzhang/activities.json`:

- `grain-procurement`: `reviewMinRankId: "red_turban.bodyguard"`
- `market-inspection`: `reviewMinRankId: "red_turban.guard_captain"`
- `militia-drill`: `reviewMinRankId: "red_turban.zhenfu"`

Keep `keepMinTier` only as a backward-compatible field if removing it would affect unrelated code.

- [ ] **Step 4: Update keep task parsing**

Modify `src/domain/activity.ts` to add optional:

```ts
reviewMinRankId?: string;
```

Modify keep task definition parsing so `KeepHouseTaskDefinition` includes:

```ts
minRankId: string;
```

Use `activityDefinition.reviewMinRankId ?? "red_turban.bodyguard"` while bridging old content.

- [ ] **Step 5: Replace fame gate with faction merit gate**

Remove `getTaskTier()` from `keep-house-house-module.ts`.

Compute:

```ts
const playerMerit = readFactionMerit(gameState, "red_turban", playerCharacter.id);
const playerRank = resolveFactionMeritRank(RED_TURBAN_FACTION_RANKS, playerMerit);
```

Use `createReviewTaskChoiceViewModels()` to produce available actions. Keep disabled tasks visible only during task selection if the UI can show disabled buttons; otherwise filter disabled entries before rendering but keep labels in tests through view-model helper coverage.

- [ ] **Step 6: Normalize keep meeting stages and overlays**

Update keep meeting progression:

- intro dialogue: leader opening
- next advance opens `review-assignment-table` overlay titled `委任`
- closing table moves to praise
- next advance moves to situation
- next advance moves to policy panel with `所以接下来的计划如下`
- next advance keeps policy panel visible and asks `有谁要进言吗`
- action container shows `发表意见` and `一言不发`
- `发表意见` shows a short placeholder response and proceeds to assignment selection
- `一言不发` proceeds to assignment selection
- assignment choices append `（最低身份：...）`

- [ ] **Step 7: Keep assignment commit behavior local**

Do not move `assignTaskToPlayer()` effects out of keep module. Ensure task acceptance still sets:

- next council date
- `missions.activeMissionId`
- `ui.activeMissionId`
- `ui.mainHouseMissionText`
- `KEEP_HOUSE_VARIABLE_KEYS.lastAssignedTaskId`

- [ ] **Step 8: Verify GREEN**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/faction-review-domain.test.cjs tests/faction-review-ui-contract.test.cjs }
```

Expected:

- Targeted review tests pass.

- [ ] **Step 9: Update plan progress**

Update this plan:

- mark Task 3 steps complete
- set `Execution State.Current Focus` to `Task 3 complete; Task 4 next`
- append a `Progress Log` entry with the targeted verification command

## Task 4: Temple Review Flow Normalization And Closeout Verification

**Files:**
- Modify: `src/domain/house-modules/temple-house-session.ts`
- Modify: `src/application/house-modules/temple-house/temple-house-house-module.ts`
- Modify: `src/ui/views/house/temple-house-view.ts`
- Modify: `src/content/scenario-packs/zhuyuanzhang/activities.json`
- Modify: `tests/faction-review-domain.test.cjs`
- Modify: `tests/faction-review-ui-contract.test.cjs`
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/project-progress.md`
- Modify: `docs/superpowers/plans/2026-07-24-faction-review-flow-plan.md`

**Interfaces:**
- Consumes: Task 1 helpers and Task 2 overlays.
- Produces: temple review sequence matching the shared flow, with existing temple story gates preserved.

- [ ] **Step 1: Add failing temple source and flow contract tests**

Append to `tests/faction-review-ui-contract.test.cjs`:

```js
test("temple review source uses normalized review table, policy panel, and advice choices", () => {
  const source = readSource("src/application/house-modules/temple-house/temple-house-house-module.ts");
  for (const text of [
    "这段时间大家辛苦了",
    "看看大家这期间的进展吧",
    "有谁要进言吗",
    "发表意见",
    "一言不发",
    "review-assignment-table",
    "review-policy-panel",
  ]) {
    assert.match(source, new RegExp(text));
  }
  assert.doesNotMatch(source, /上期寺中贡献/);
});
```

- [ ] **Step 2: Run targeted tests and verify RED**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/faction-review-domain.test.cjs tests/faction-review-ui-contract.test.cjs }
```

Expected:

- Fails because temple still uses old contribution alert flow or lacks normalized advice choices.

- [ ] **Step 3: Add rank metadata to temple activities**

Modify temple task definitions in `src/content/scenario-packs/zhuyuanzhang/activities.json`:

- ordinary first-week temple help tasks: `reviewMinRankId: "temple.laborer"`
- `beg-alms`: `reviewMinRankId: "temple.novice"` unless story-specific week logic forces it
- later relief/refugee-style tasks: use `temple.itinerant` or higher only if currently exposed by review choices

- [ ] **Step 4: Normalize temple contribution rows**

Use shared `ReviewAssignmentRow[]` for temple contribution entries:

- `characterName` from player and senior monk
- `assignmentTitle` from current or previous work plan label
- `contribution` from existing temple contribution values
- `grade` from `resolveReviewCompletionGrade`

Do not replace existing temple story flags or current work-plan commit behavior.

- [ ] **Step 5: Normalize temple meeting flow**

Update temple meeting progression to match the shared sequence:

- leader opening
- `review-assignment-table`
- praise
- situation
- policy panel
- advice prompt with `发表意见` and `一言不发`
- special-task hook default `none`
- ordinary work choices with minimum identity labels

Preserve existing special week behavior:

- third week and fourth week forced `beg-alms` choices still force the same work plan
- locked begging still blocks as before
- existing mission and review-date updates still happen in `submitReviewWorkPlan()`

- [ ] **Step 6: Ensure policy panel remains visible during advice prompt**

Keep `sessionState.overlay` or an equivalent typed visible panel as `review-policy-panel` while dialogue text is `有谁要进言吗`.

- [ ] **Step 7: Update changelog and governance state**

Append to `docs/change-log.md`:

```md
## 2026-07-24 Faction Review Flow

- Normalized temple and keep review cadence into shared review semantics for assignment tables, contribution grades, praise, policy panels, advice prompt, and rank-gated task choices.
- Added faction-internal merit rank tables for temple and Red Turban identities, with task choices displaying minimum identity requirements.
- Added structured review assignment and policy panel view models so application modules no longer pass table-like HTML or paragraph-only reports.
```

Update `docs/superpowers/project-progress.md` so the current task points to this plan as `completed-but-open` only after verification passes; otherwise keep status `running` and record the next concrete step.

- [ ] **Step 8: Run targeted verification**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/faction-review-domain.test.cjs tests/faction-review-ui-contract.test.cjs }
```

Expected:

- Targeted review tests pass.

- [ ] **Step 9: Run full verification**

Run:

```powershell
npm run lint:plans
npm run typecheck
npm test
npm run build
```

Expected:

- Each command exits 0.

- [ ] **Step 10: Update plan progress and close implementation state**

Update this plan:

- mark Task 4 steps complete
- set `Execution State.Status` to `completed-but-open`
- set `Execution State.Current Focus` to `Implementation complete; waiting for review/sync/push before closeout`
- set `Execution State.Verification` to the exact commands that passed
- append a `Progress Log` entry with targeted and full verification
- check the `Exit Check` items that are satisfied

## Exit Check

- [ ] `Temple and keep review flows share the same review semantics for table rows, grades, ranking, policy, and task-rank gating.`
- [ ] `The visible flow follows leader opening, assignment table, praise, situation, policy, advice, and assignment selection.`
- [ ] `Assignment table and policy panel are typed view models rendered in UI code.`
- [ ] `Temple and Red Turban rank tables are implemented and tested.`
- [ ] `Ordinary task choices show minimum identity labels.`
- [ ] `Special task hook exists and cleanly falls back to ordinary task choices when empty.`
- [ ] `No new review business logic is added to src/main.ts.`
- [ ] `Required tests and verification commands pass.`
- [ ] `docs/change-log.md is updated.`
- [ ] `Project progress sync is updated if the child state changed.`

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded

## Child Closeout

- Closed Child: `Faction Review Flow`
- Parent Task: `Normalize faction review cadence`
- Parent Stage: `Faction Review Flow Implementation`
- Closeout Status: `not-closed`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `complete-implementation-and-verify`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-24-faction-review-flow-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, then continue docs/superpowers/plans/2026-07-24-faction-review-flow-plan.md from the first unchecked task.`
