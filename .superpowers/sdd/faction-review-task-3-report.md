# Task 3: Keep Review Flow Normalization Report

## What I Implemented

- Normalized keep-house review cadence to `intro -> assignment-table -> praise -> situation -> policy -> advice -> assign-task -> assigned`.
- Replaced keep task access derived from player fame with Red Turban faction merit rank lookup via shared review helpers.
- Added `reviewMinRankId` support on activity definitions and keep task parsing, while preserving `keepMinTier` as a compatibility field.
- Added keep activity rank metadata:
  - `grain-procurement`: `red_turban.bodyguard`
  - `market-inspection`: `red_turban.guard_captain`
  - `militia-drill`: `red_turban.zhenfu`
- Added structured keep session overlay states for `review-assignment-table` and `review-policy-panel`.
- Kept disabled higher-rank ordinary tasks visible during assignment selection with labels that append minimum identity text.
- Preserved keep assignment commit effects in `assignTaskToPlayer()`:
  - next council date
  - `missions.activeMissionId`
  - `ui.activeMissionId`
  - `ui.mainHouseMissionText`
  - `KEEP_HOUSE_VARIABLE_KEYS.lastAssignedTaskId`
- Updated keep robustness tests to follow the normalized review cadence.
- Updated `docs/change-log.md` and the governed faction review plan.

## Tests And Results

- `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/faction-review-domain.test.cjs tests/faction-review-ui-contract.test.cjs }`
  - GREEN result: passed, 10/10 tests.
- `node --test --test-name-pattern "keep house" tests/robustness.test.cjs`
  - Passed, 7/7 tests.
- `npm run typecheck`
  - Passed.

## TDD Evidence

### RED Command

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/faction-review-domain.test.cjs tests/faction-review-ui-contract.test.cjs }
```

### RED Output

```text
✔ review completion grades use the requested five Chinese labels
✔ faction rank lookup resolves temple and red turban threshold boundaries
✔ faction merit is stored separately and can be cleared by faction
✔ review task choices include minimum identity labels and rank gating
✔ default special task hook is empty and falls back to ordinary choices
✖ keep review task access is not derived from player fame
✔ review assignment table renders requested title, columns, and grade labels
✔ review policy panel renders all policy fields and can remain visible during advice prompt
✔ main entry does not gain review business imports or hardcoded review branches
✖ keep review source uses normalized Chinese review copy and advice choices
ℹ tests 10
ℹ pass 8
ℹ fail 2
```

Expected failure reasons:
- keep module still contained `character.stats.fame >=` and `getTaskTier`.
- keep review source still used old English review labels and lacked normalized advice-copy/action labels.

### GREEN Command

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/faction-review-domain.test.cjs tests/faction-review-ui-contract.test.cjs }
```

### GREEN Output

```text
✔ review completion grades use the requested five Chinese labels
✔ faction rank lookup resolves temple and red turban threshold boundaries
✔ faction merit is stored separately and can be cleared by faction
✔ review task choices include minimum identity labels and rank gating
✔ default special task hook is empty and falls back to ordinary choices
✔ keep review task access is not derived from player fame
✔ review assignment table renders requested title, columns, and grade labels
✔ review policy panel renders all policy fields and can remain visible during advice prompt
✔ main entry does not gain review business imports or hardcoded review branches
✔ keep review source uses normalized Chinese review copy and advice choices
ℹ tests 10
ℹ pass 10
ℹ fail 0
```

## Files Changed

- `src/domain/activity.ts`
- `src/domain/keep-house.ts`
- `src/domain/house-modules/keep-house-session.ts`
- `src/application/house-modules/keep-house/keep-house-house-module.ts`
- `src/content/scenario-packs/zhuyuanzhang/activities.json`
- `tests/faction-review-domain.test.cjs`
- `tests/faction-review-ui-contract.test.cjs`
- `tests/robustness.test.cjs`
- `docs/change-log.md`
- `docs/superpowers/plans/2026-07-24-faction-review-flow-plan.md`

## Self-Review Findings Or Concerns

- No `src/main.ts` review-flow business branch or concrete review import was added.
- Temple-house flow was not modified.
- Application code returns structured overlays instead of HTML strings.
- Persistent assignment effects remain in unified game state structures and the existing keep assignment commit path.
- Concern: keep policy panel values are bridged from the existing keep strategy content rather than a new dedicated keep policy content shape. This keeps the task scoped and avoids broader content migration, but Task 4 or a later content pass may want to formalize keep policy fields in content.
