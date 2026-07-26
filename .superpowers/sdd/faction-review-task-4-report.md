# Task 4 Report: Temple Review Flow Normalization And Closeout Verification

## What I implemented

- Normalized temple review meeting flow to the shared cadence:
  - leader opening
  - structured `review-assignment-table`
  - praise
  - situation
  - structured `review-policy-panel`
  - advice prompt with `发表意见` and `一言不发`
  - ordinary work-plan selection
- Added temple review assignment rows as shared `ReviewAssignmentRow[]`, using player/senior monk names, current work-plan assignment label, existing contribution values, and `resolveReviewCompletionGrade()`.
- Kept `review-policy-panel` visible during the advice prompt.
- Added temple faction-rank gating to ordinary review work choices via shared review helpers while preserving third/fourth week forced `beg-alms` behavior.
- Added temple activity `reviewMinRankId` metadata:
  - first-week temple tasks: `temple.laborer`
  - `beg-alms`: `temple.novice`
  - `relief-refugees`: `temple.itinerant`
- Preserved existing temple story and assignment behavior:
  - `submitReviewWorkPlan()` still performs existing mission, review-date, work-plan, story-stage, and runtime variable updates.
  - locked begging still blocks in `submitReviewWorkPlan()`.
  - no review-flow business branch was added to `src/main.ts`.
- Updated robustness tests that encoded the old temple meeting cadence.
- Updated `docs/change-log.md`, `docs/superpowers/project-progress.md`, and `docs/superpowers/plans/2026-07-24-faction-review-flow-plan.md`.

## Tests and results

- `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/faction-review-domain.test.cjs tests/faction-review-ui-contract.test.cjs }`
  - GREEN result: passed 11/11.
- `node --test --test-name-pattern "temple house review|temple review|global NPC interaction does not append default choices to temple review" tests/robustness.test.cjs`
  - passed 4/4.
- `npm run lint:plans`
  - passed for 66 plan files.
- `npm run typecheck`
  - passed.
- `$env:TEMP='D:\RPG_TG\.tmp'; $env:TMP='D:\RPG_TG\.tmp'; npm test`
  - failed only the known unrelated child 27 startup coordinator test:
    - test: `child 27 startup coordinator exposes bootstrap-complete createAppState for builtin startup`
    - expected: `event.story.zhu_yuanzhang.haozhou_return_encounter`
    - actual: `null`
- `$env:TEMP='D:\RPG_TG\.tmp'; $env:TMP='D:\RPG_TG\.tmp'; $env:npm_config_cache='D:\RPG_TG\.npm-cache'; npm run build`
  - passed.

## TDD Evidence

### RED

Command:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/faction-review-domain.test.cjs tests/faction-review-ui-contract.test.cjs }
```

Expected failure captured:

```text
✖ temple review source uses normalized review table, policy panel, and advice choices
AssertionError [ERR_ASSERTION]: The input did not match the regular expression /这段时间大家辛苦了/.
```

Note: the first attempted RED run exposed a syntax error in the newly added test fixture due copied broken encoded strings. I corrected the test to use Unicode escapes, reran it, and then captured the intended RED failure above.

### GREEN

Command:

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/faction-review-domain.test.cjs tests/faction-review-ui-contract.test.cjs }
```

Output summary:

```text
ℹ tests 11
ℹ pass 11
ℹ fail 0
```

## Full verification results

- `npm run lint:plans`: passed.
- `npm run typecheck`: passed.
- Initial `npm test`: failed with one stale temple test, one disk-space temp copy failure, and the known unrelated child 27 failure.
- After updating the stale temple test and rerunning with `TEMP`/`TMP` redirected to `D:\RPG_TG\.tmp`, `npm test` failed only the known unrelated child 27 failure:

```text
✖ child 27 startup coordinator exposes bootstrap-complete createAppState for builtin startup
actual: null
expected: 'event.story.zhu_yuanzhang.haozhou_return_encounter'
```

- Initial `npm run build`: failed because C: had 0 bytes free and npm could not write cache/log data.
- Rerun with workspace-local temp/cache passed:

```powershell
$env:TEMP='D:\RPG_TG\.tmp'; $env:TMP='D:\RPG_TG\.tmp'; $env:npm_config_cache='D:\RPG_TG\.npm-cache'; npm run build
```

Build passed with existing Vite warnings about non-module prototype scripts, unresolved runtime asset URLs, and chunk size.

## Files changed

- `src/domain/house-modules/temple-house-session.ts`
- `src/domain/temple-house.ts`
- `src/application/house-modules/temple-house/temple-house-house-module.ts`
- `src/content/scenario-packs/zhuyuanzhang/activities.json`
- `tests/faction-review-ui-contract.test.cjs`
- `tests/robustness.test.cjs`
- `docs/change-log.md`
- `docs/superpowers/project-progress.md`
- `docs/superpowers/plans/2026-07-24-faction-review-flow-plan.md`

## Self-review findings or concerns

- Concern: full `npm test` still fails due the known unrelated child 27 startup coordinator baseline failure. I did not fix it.
- Concern: C: has 0 bytes free. `npm test` and `npm run build` require temp/cache redirection to D: in this environment.
- Concern: `.tmp/` and `.npm-cache/` were created as untracked workspace-local temp/cache directories for verification. Local policy blocked deletion commands, so they are intentionally not staged.
- No new review business logic or concrete review imports were added to `src/main.ts`.
- `submitReviewWorkPlan()` remains the commit point for temple mission/review-date/work-plan updates.

## Review Fix Note

- Follow-up commit: `5efc68d6 fix: enforce temple review task gates`.
- Fixed disabled temple review work choices being enforceable through direct dispatch by resolving the selected review work choice before `submitReviewWorkPlan()`.
- Preserved the existing monk-story begging unlock path when the old temple contribution/story flag already permits begging, while still blocking locked begging choices.
- Added robustness coverage for both visible action state and forced dispatch attempts.

Verification after fix:

```powershell
node --test --test-name-pattern "temple review|temple house review|unlocked begging|disabled work choice|global NPC interaction does not append default choices to temple review" tests/robustness.test.cjs
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/faction-review-domain.test.cjs tests/faction-review-ui-contract.test.cjs }
npm run typecheck
npm run lint:plans
```

All four commands passed.
