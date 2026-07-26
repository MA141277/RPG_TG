## Task 2: Structured Review Overlays And UI Contracts

**Files:**
- Modify: `src/domain/house-module.ts`
- Modify: `src/ui/views/house/house-shared-view.ts`
- Create: `tests/faction-review-ui-contract.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-24-faction-review-flow-plan.md`

**Interfaces:**
- Consumes: `ReviewAssignmentRow`, `ReviewPolicyPanel`.
- Produces: `HouseOverlayViewModel` variants `review-assignment-table` and `review-policy-panel`, rendered by `renderHouseReviewAssignmentTableOverlay()` and `renderHouseReviewPolicyPanelOverlay()` inside `renderHouseOverlay` or equivalent shared renderer.

- [ ] **Step 1: Write failing UI contract tests**

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
    title: "濮斾换",
    rows: [
      {
        characterId: "char.player",
        characterName: "鏈遍噸鍏?,
        assignmentTitle: "绛圭伯",
        contribution: 90,
        grade: "outstanding",
      },
    ],
    confirmActionId: "close-review-assignment-table",
    confirmLabel: "缁х画",
  });
  assert.match(html, />濮斾换</);
  for (const header of ["浜虹墿", "濮斾换", "瀹屾垚鎯呭喌"]) {
    assert.match(html, new RegExp(`<th>${header}</th>`));
  }
  assert.match(html, />鏈遍噸鍏?/);
  assert.match(html, />绛圭伯</);
  assert.match(html, />璧但涔嬪姛</);
});

test("review policy panel renders all policy fields and can remain visible during advice prompt", () => {
  const html = renderHouseReviewPolicyPanelOverlay({
    type: "review-policy-panel",
    title: "鏂归拡",
    policy: {
      overallGoal: "淇濆叏瀵轰紬",
      phaseGoal: "绛硅冻绮背",
      executionPlan: "鍒嗘淳浼椾汉澶栧嚭鍖栫紭",
    },
  });
  for (const label of ["鎬荤洰鏍?, "闃舵鐩爣", "鎵ц璁″垝"]) {
    assert.match(html, new RegExp(`<dt>${label}</dt>`));
  }
  assert.match(html, />淇濆叏瀵轰紬</);
  assert.match(html, />绛硅冻绮背</);
  assert.match(html, />鍒嗘淳浼椾汉澶栧嚭鍖栫紭</);
});

test("main entry does not gain review business imports or hardcoded review branches", () => {
  const mainSource = readSource("src/main.ts");
  assert.doesNotMatch(mainSource, /application\\/review\\/faction-review/);
  assert.doesNotMatch(mainSource, /review-assignment-table/);
  assert.doesNotMatch(mainSource, /璧但涔嬪姛|灏借亴灏借矗|宸己浜烘剰|涓嶅敖浜烘剰|纰岀鏃犱负/);
});
```

- [ ] **Step 2: Run the targeted UI tests and verify RED**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/faction-review-ui-contract.test.cjs }
```

Expected:

- Fails because the shared overlay renderers are not exported.

- [ ] **Step 3: Extend `HouseOverlayViewModel`**

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

- [ ] **Step 4: Render assignment table and policy panel in shared view**

Modify `src/ui/views/house/house-shared-view.ts`:

- export `renderHouseReviewAssignmentTableOverlay`
- export `renderHouseReviewPolicyPanelOverlay`
- render grade labels via `getReviewCompletionGradeLabel`
- escape all table cell text with existing `escapeHtml`

The table must use:

```html
<table class="c-house-review-table">
  <thead><tr><th>浜虹墿</th><th>濮斾换</th><th>瀹屾垚鎯呭喌</th></tr></thead>
</table>
```

The policy panel must use:

```html
<dl class="c-house-review-policy">
  <dt>鎬荤洰鏍?/dt>
  <dd>...</dd>
  <dt>闃舵鐩爣</dt>
  <dd>...</dd>
  <dt>鎵ц璁″垝</dt>
  <dd>...</dd>
</dl>
```

- [ ] **Step 5: Verify GREEN**

Run:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/faction-review-ui-contract.test.cjs }
```

Expected:

- UI contract tests pass.

- [ ] **Step 6: Update plan progress**

Update this plan:

- mark Task 2 steps complete
- set `Execution State.Current Focus` to `Task 2 complete; Task 3 next`
- append a `Progress Log` entry with the targeted verification command

