# Final Fix Service Houses Report

## Scope

Fixed final whole-branch review finding for House Primary Actor Flow:

- Grain shop, tea house, market house, and medicine house now keep the house `defaultCharacterId` actor first in `standbyRoster` while greeting/open dialogue is active.
- Existing action containers, dialogue text, status cards, overlays, and selected actor semantics were preserved.
- No `src/main.ts` branches were added.
- Application modules still return structured view models only.

## RED Evidence

Command:

```powershell
npm run build:test
```

Result:

```text
exit 0
> rpg-tg@0.1.0 build:test
> tsc -p tsconfig.test.json && node -e "require('node:fs').writeFileSync('.test-dist/package.json', '{\"type\":\"commonjs\"}')"
```

Command:

```powershell
node --test tests\robustness.test.cjs --test-name-pattern "primary house actor"
```

Result:

```text
exit 1
tests 305
pass 301
fail 4

Failing tests:
- primary house actor appears first in grain shop roster during greeting
  actual undefined, expected char.kulan_grain_shopkeeper
- primary house actor appears first in tea house roster during greeting
  actual undefined, expected char.kulan_tea_boss
- primary house actor appears first in market house roster during greeting
  actual undefined, expected char.kulan_merchant
- primary house actor appears first in medicine house roster during greeting
  actual undefined, expected char.kulan_medicine_doctor
```

## Implementation

Changed files:

- `src/application/house-modules/grain-shop/grain-shop-house-module.ts`
- `src/application/house-modules/tea-house/tea-house-house-module.ts`
- `src/application/house-modules/market-house/market-house-house-module.ts`
- `src/application/house-modules/medicine-house/medicine-house-house-module.ts`
- `tests/robustness.test.cjs`

Details:

- Imported `orderHouseStandbyRoster()` into all four service house modules.
- Grain shop and medicine house now build their primary NPC roster regardless of dialogue phase.
- Tea house now always exposes the existing boss/guest actor roster, ordered with the primary actor first.
- Market house now prepends the `HouseDefinition.defaultCharacterId` character to the existing market actor roster, then orders/dedupes via the shared helper. The existing selected market actor remains unchanged for dialogue/trade behavior.
- Added focused regression tests for all four service houses proving active greeting dialogue has `standbyRoster[0].characterId === house.defaultCharacterId`.

## GREEN Evidence

Command:

```powershell
npm run build:test
```

Result:

```text
exit 0
> rpg-tg@0.1.0 build:test
> tsc -p tsconfig.test.json && node -e "require('node:fs').writeFileSync('.test-dist/package.json', '{\"type\":\"commonjs\"}')"
```

Command:

```powershell
node --test tests\robustness.test.cjs --test-name-pattern "primary house actor"
```

Result:

```text
exit 0
tests 305
pass 305
fail 0

New service-house tests passing:
- primary house actor appears first in grain shop roster during greeting
- primary house actor appears first in tea house roster during greeting
- primary house actor appears first in market house roster during greeting
- primary house actor appears first in medicine house roster during greeting
```

Command:

```powershell
npm run typecheck
```

Result:

```text
exit 0
> rpg-tg@0.1.0 typecheck
> tsc --noEmit -p tsconfig.json
```

## Commit

```text
45e54311 fix: apply primary actor roster to service houses
```

## Concerns

- The repository still has unrelated uncommitted changes outside this fix. They were not edited, staged, or committed.
- The generated report file is intentionally uncommitted because the requested commit was limited to the allowed code/test/optional plan files.

## Final Review Critical Follow-up: Market Primary Actor Identity

Fixed the remaining market-house split identity:

- `house.kulan.market.defaultCharacterId` now resolves the fixed host actor id for market greeting/open dialogue, session `selectedActorId`, roster first entry, and fixed-host action semantics.
- `shopkeeper_qian` remains only the fixed-host content lookup fallback/id for houses without `defaultCharacterId` and fixed-host content tables.
- The prototype market standby roster no longer includes a separate `shopkeeper_qian` actor.

RED evidence:

```text
node --test tests/robustness.test.cjs --test-name-pattern "primary house actor"
exit 1
failures:
- primary house actor appears first in market house roster during greeting
  actual dialogue characterId shopkeeper_qian, expected char.kulan_merchant
- market house follows greeting open idle rhythm with fixed boss and guest roster
  actual selectedActorId shopkeeper_qian, expected char.kulan_merchant
```

GREEN evidence:

```text
npm run build:test
exit 0

node --test tests/robustness.test.cjs --test-name-pattern "market.*primary house actor|primary house actor.*market"
exit 0
tests 305
pass 305
fail 0

npm run typecheck
exit 0
```
