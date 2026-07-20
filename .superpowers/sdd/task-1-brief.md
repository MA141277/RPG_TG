## Task 1: Shared Primary Actor Roster Helper

**Files:**
- Create: `src/application/house/house-primary-actor-roster.ts`
- Modify: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes: `HouseStandbyActorViewModel` from `src/domain/house-module.ts`.
- Produces: `orderHouseStandbyRoster(input: { primaryCharacterId: string | null; actors: HouseStandbyActorViewModel[] }): HouseStandbyActorViewModel[]`.

- [ ] **Step 1: Write the failing helper tests**

Add this import near the other `.test-dist` imports in `tests/robustness.test.cjs`:

```js
const {
  orderHouseStandbyRoster,
} = require("../.test-dist/application/house/house-primary-actor-roster.js");
```

Add these tests near other house tests in `tests/robustness.test.cjs`:

```js
test("primary house actor roster helper places the default actor first", () => {
  const roster = orderHouseStandbyRoster({
    primaryCharacterId: "char.owner",
    actors: [
      { characterId: "char.guest", name: "Guest" },
      { characterId: "char.owner", name: "Owner", actionId: "open-owner-dialogue" },
      { characterId: "char.extra", name: "Extra" },
    ],
  });

  assert.deepEqual(
    roster.map((actor) => actor.characterId),
    ["char.owner", "char.guest", "char.extra"]
  );
  assert.equal(roster[0].actionId, "open-owner-dialogue");
});

test("primary house actor roster helper deduplicates actors without losing the first primary model", () => {
  const roster = orderHouseStandbyRoster({
    primaryCharacterId: "char.owner",
    actors: [
      { characterId: "char.owner", name: "Owner", actionId: "open-owner-dialogue" },
      { characterId: "char.guest", name: "Guest" },
      { characterId: "char.owner", name: "Owner Duplicate" },
      { characterId: "char.guest", name: "Guest Duplicate" },
    ],
  });

  assert.deepEqual(
    roster.map((actor) => actor.name),
    ["Owner", "Guest"]
  );
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "primary house actor roster helper"
```

Expected:

- `npm run build:test` fails because `src/application/house/house-primary-actor-roster.ts` does not exist, or the focused node test fails because `orderHouseStandbyRoster` is not exported.

- [ ] **Step 3: Implement the helper**

Create `src/application/house/house-primary-actor-roster.ts`:

```ts
import type { HouseStandbyActorViewModel } from "../../domain/house-module";

export function orderHouseStandbyRoster(input: {
  primaryCharacterId: string | null;
  actors: HouseStandbyActorViewModel[];
}): HouseStandbyActorViewModel[] {
  const seenCharacterIds = new Set<string>();
  const dedupedActors: HouseStandbyActorViewModel[] = [];

  for (const actor of input.actors) {
    if (seenCharacterIds.has(actor.characterId)) {
      continue;
    }
    seenCharacterIds.add(actor.characterId);
    dedupedActors.push(actor);
  }

  if (input.primaryCharacterId == null) {
    return dedupedActors;
  }

  const primaryActor = dedupedActors.find(
    (actor) => actor.characterId === input.primaryCharacterId
  );
  if (primaryActor == null) {
    return dedupedActors;
  }

  return [
    primaryActor,
    ...dedupedActors.filter(
      (actor) => actor.characterId !== input.primaryCharacterId
    ),
  ];
}
```

- [ ] **Step 4: Run the focused helper tests**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "primary house actor roster helper"
```

Expected:

- `npm run build:test` exits with code 0.
- Both focused helper tests pass.

- [ ] **Step 5: Commit Task 1**

Run:

```bash
git add src/application/house/house-primary-actor-roster.ts tests/robustness.test.cjs
git commit -m "test: add house primary actor roster helper"
```

Expected:

- Commit succeeds and contains only Task 1 files.

