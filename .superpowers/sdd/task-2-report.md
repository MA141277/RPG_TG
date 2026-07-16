# Task 2 Report: Temple And Tavern View Models

## Status

DONE

## Scope

Modified only the Task 2 implementation files:

- `src/application/house-modules/temple-house/temple-house-house-module.ts`
- `src/application/house-modules/tavern/tavern-house-module.ts`
- `tests/robustness.test.cjs`

The report file was created as requested and was not included in the original Task 2 implementation commit.

## TDD Evidence

Added the requested failing tests to `tests/robustness.test.cjs`:

- `primary house actor appears first in temple daily roster during greeting`
- `primary house actor appears first in tavern roster during greeting`

Red run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "primary house actor appears first"
```

Result: build succeeded; focused test run failed as expected on Tavern because the greeting roster was empty and `viewModel.standbyRoster[0]?.characterId` was `undefined` instead of `char.kulan_innkeeper`.

Green run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "primary house actor appears first"
```

Result: build succeeded; focused test run passed with 298 passing tests and 0 failures under the name pattern.

## Implementation Notes

Tavern `selectViewModel()` now imports and uses `orderHouseStandbyRoster()`, creates a stable boss actor from `defaultCharacterId ?? tavernBossProfile.actorId`, and returns that actor in `standbyRoster` during greeting/open dialogue as well as idle.

Temple `selectViewModel()` now builds the standby actor list before returning, preserves meeting participant order, and applies `orderHouseStandbyRoster()` for non-meeting daily view models so the default abbot actor is first.

No `main.ts` house-specific branch was added, no application HTML strings were introduced, and no persistent gameplay state was changed.

## Commit

Created commit:

- `6a0900ee feat: keep house primary actors in roster`

## Concerns

None.

## Reviewer Fix: Temple Meeting Primary Actor

Reviewer finding addressed:

- Temple meeting view models omitted the abbot/default primary actor because `getTempleMeetingParticipantIds()` filtered the abbot out and meeting mode bypassed `orderHouseStandbyRoster()`.

Test coverage added:

- `primary house actor appears first in temple meeting roster with player still selected`

Red run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "primary house actor"
```

Result: build succeeded; focused test run failed as expected because the meeting roster started with `char.player` instead of `char.kulan_temple_abbot`.

Fix:

- Temple meeting participant ids now include the abbot/default primary actor.
- Temple `selectViewModel()` now applies `orderHouseStandbyRoster()` to meeting and daily rosters.
- The existing meeting player selected state remains on the player actor, and non-primary meeting participants remain in the roster.

Green run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "primary house actor"
```

Result: build succeeded; focused test run passed with 299 passing tests and 0 failures under the name pattern.
