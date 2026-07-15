# Task 3 Report: House Renderer Cleanup

Status: DONE

## Scope

Modified only the Task 3 implementation files:

- `src/ui/views/house/house-shared-view.ts`
- `src/ui/views/house/temple-house-view.ts`
- `tests/robustness.test.cjs`

## TDD Evidence

Added the focused renderer regression tests in `tests/robustness.test.cjs`:

- `primary house actor dialogue does not render separate right-side portrait`
- `temple daily view keeps abbot in left roster instead of right owner slot`

Red run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "primary house actor dialogue|temple daily view"
```

Result: exit 1, 299 pass / 2 fail.

- Tavern failed as expected because `renderHouseDialogue()` emitted `c-grain-shop-dialogue__npc` and `c-grain-shop-portrait`.
- Temple failed before the expected `c-grain-shop-idle-owner` assertion because the current daily idle view model keeps the abbot marked `isSelected: true`, so the renderer classified the idle daily roster as a meeting roster. This exposed a branch mismatch in the renderer's meeting heuristic.

Green run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "primary house actor dialogue|temple daily view"
```

Result: exit 0, 301 pass / 0 fail.

Additional check:

```bash
git diff --check -- src/ui/views/house/house-shared-view.ts src/ui/views/house/temple-house-view.ts tests/robustness.test.cjs
```

Result: exit 0. Git printed CRLF conversion warnings only.

## Implementation Notes

- Removed the ordinary right-side dialogue portrait block from shared house dialogue rendering.
- Kept character speaker names inside the dialogue text block.
- Removed temple idle owner splitting and right-side idle owner rendering.
- Kept the non-meeting temple roster rendering against `viewModel.standbyRoster`.
- Adjusted temple meeting detection so idle daily view models with a selected primary actor still render as daily idle roster, not meeting roster.

## Concerns

None after the reviewer follow-up fix. The earlier concern about daily selected primary actors has been resolved by requiring meeting-style selection state across the full roster.

## Reviewer Follow-Up Fix

Reviewer finding addressed:

- Daily temple `open` view models still have dialogue and a selected primary actor, so the previous `!isIdle && isSelected != null` heuristic still routed them through `renderMeetingRoster()`.

Implementation:

- Updated `tests/robustness.test.cjs` so the temple renderer coverage uses a non-idle daily `open` view model.
- Added an assertion that daily temple markup does not include `c-keep-house-meeting`.
- Updated `src/ui/views/house/temple-house-view.ts` so meeting rendering requires meeting-style roster selection data: every roster actor must carry `isSelected` state and at least one actor must be selected. Daily dialogue rosters only mark the active speaker, so they now stay on `renderHouseStandbyRoster()`.

Red run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "primary house actor dialogue|temple daily view"
```

Result: build exited 0; focused test exited 1, 300 pass / 1 fail. The non-idle daily temple test failed because markup rendered `c-keep-house-meeting` and omitted `c-grain-shop-npc-idle`.

Green run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "primary house actor dialogue|temple daily view"
```

Result: build exited 0; focused test exited 0, 301 pass / 0 fail.

Additional check:

```bash
git diff --check -- src/ui/views/house/temple-house-view.ts tests/robustness.test.cjs .superpowers/sdd/task-3-report.md
```

Result: exit 0. Git printed CRLF conversion warnings for the touched source/test files only.
