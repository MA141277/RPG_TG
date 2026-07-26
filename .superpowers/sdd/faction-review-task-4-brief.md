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
    "杩欐鏃堕棿澶у杈涜嫤浜?,
    "鐪嬬湅澶у杩欐湡闂寸殑杩涘睍鍚?,
    "鏈夎皝瑕佽繘瑷€鍚?,
    "鍙戣〃鎰忚",
    "涓€瑷€涓嶅彂",
    "review-assignment-table",
    "review-policy-panel",
  ]) {
    assert.match(source, new RegExp(text));
  }
  assert.doesNotMatch(source, /涓婃湡瀵轰腑璐＄尞/);
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
- advice prompt with `鍙戣〃鎰忚` and `涓€瑷€涓嶅彂`
- special-task hook default `none`
- ordinary work choices with minimum identity labels

Preserve existing special week behavior:

- third week and fourth week forced `beg-alms` choices still force the same work plan
- locked begging still blocks as before
- existing mission and review-date updates still happen in `submitReviewWorkPlan()`

- [ ] **Step 6: Ensure policy panel remains visible during advice prompt**

Keep `sessionState.overlay` or an equivalent typed visible panel as `review-policy-panel` while dialogue text is `鏈夎皝瑕佽繘瑷€鍚梎.

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

