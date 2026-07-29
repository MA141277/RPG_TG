# Task 1 Report: Tavern Short Deck, Evaluator, And Pot Helpers

## Scope

- Promoted tavern short gamble into the canonical progress entry before implementation.
- Added `src/domain/tavern-short-gambling.ts` as the public short-gambling entry point.
- Added `src/domain/tavern-short-gambling-evaluator.ts` for pure showdown and pot helpers.
- Added focused Task 1 coverage in `tests/tavern-short-gamble-domain.test.cjs`.
- Synced Task 1 governance state in the tavern short plan and project progress docs.

## Implemented

- `createTavernShortDeck()` builds a unique 52-card deck using `wan / bing / tong / tiao` and ranks `1..13`.
- `shuffleTavernShortDeck()` uses a deterministic seeded Fisher-Yates shuffle.
- `getTavernShortCardLabel()` uses the real suit labels:
  - `wan = 万`
  - `bing = 饼`
  - `tong = 筒`
  - `tiao = 条`
- `evaluateBestTavernShortShowdown()` evaluates all `7 choose 5` combinations and keeps the strongest best five.
- `compareTavernShortBestFives()` compares best hands lexicographically by `scoreKey`.
- `buildTavernShortPots()` reconstructs ordered pots from contribution tiers.
- `splitTavernShortPot()` splits a pot evenly across eligible winners and awards remainder chips by dealer-next seat order.

## TDD Evidence

### RED

Commands:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe node_modules/typescript/bin/tsc -p tsconfig.test.json
Set-Content -LiteralPath .test-dist/package.json -Value '{"type":"commonjs"}'
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-short-gamble-domain.test.cjs
```

Result:

- `tsc` succeeded.
- The focused suite failed because the new module did not exist yet.
- Exact failure basis: `Cannot find module '../.test-dist/domain/tavern-short-gambling.js'`.

### GREEN

Commands:

```powershell
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe node_modules/typescript/bin/tsc -p tsconfig.test.json
Set-Content -LiteralPath .test-dist/package.json -Value '{"type":"commonjs"}'
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/tavern-short-gamble-domain.test.cjs
```

Result:

- PASS
- `3` tests passed
- `0` tests failed
- Coverage included the corrected assertion `getTavernShortCardLabel(wan-1) === "1万"`.

## Notes

- The plan snippet’s mojibake suit-label sample was treated as corrupted text and corrected in the implementation, test, and this report.
- Task 1 stayed within the requested short-gambling foundation scope and did not touch the unrelated temporary tavern-access bypass files.

## Commit Status

- Task 1 is currently in the working tree.
- A clean Task 1-only commit remains possible because the unrelated dirty files are outside the task-file set.
