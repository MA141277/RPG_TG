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
    "杩欐鏃堕棿澶у杈涜嫤浜?,
    "鐪嬬湅澶у杩欐湡闂寸殑杩涘睍鍚?,
    "鏈夎皝瑕佽繘瑷€鍚?,
    "鍙戣〃鎰忚",
    "涓€瑷€涓嶅彂",
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
- next advance opens `review-assignment-table` overlay titled `濮斾换`
- closing table moves to praise
- next advance moves to situation
- next advance moves to policy panel with `鎵€浠ユ帴涓嬫潵鐨勮鍒掑涓媊
- next advance keeps policy panel visible and asks `鏈夎皝瑕佽繘瑷€鍚梎
- action container shows `鍙戣〃鎰忚` and `涓€瑷€涓嶅彂`
- `鍙戣〃鎰忚` shows a short placeholder response and proceeds to assignment selection
- `涓€瑷€涓嶅彂` proceeds to assignment selection
- assignment choices append `锛堟渶浣庤韩浠斤細...锛塦

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

