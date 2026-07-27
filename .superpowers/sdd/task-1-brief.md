## Task 1: Add The Pure Coin Reward State Mutation

**Files:**
- Create: `src/application/rewards/coin-reward.ts`
- Test: `tests/coin-reward-state.test.cjs`

**Interfaces:**
- Consumes:
  - `AppState` from `src/application/app-shell`
  - `CharacterDefinition` shape with `stats.gold`
- Produces:
  - `applyCoinReward(state: AppState, playerCharacterId: string, delta: number): AppState`

- [ ] **Step 1: Write the failing test**

```js
const test = require("node:test");
const assert = require("node:assert/strict");

test("applyCoinReward adds gold only to the targeted player character", async () => {
  const { applyCoinReward } = await import("../src/application/rewards/coin-reward.ts");

  const state = {
    characterDefinitions: [
      { id: "char.player", stats: { gold: 10, fame: 0 } },
      { id: "char.other", stats: { gold: 99, fame: 0 } },
    ],
  };

  const nextState = applyCoinReward(state, "char.player", 10);

  assert.equal(nextState.characterDefinitions[0].stats.gold, 20);
  assert.equal(nextState.characterDefinitions[1].stats.gold, 99);
  assert.notEqual(nextState, state);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/coin-reward-state.test.cjs`

Expected: FAIL with module-not-found or `applyCoinReward is not a function`.

- [ ] **Step 3: Write minimal implementation**

```ts
import type { AppState } from "../app-shell";

export function applyCoinReward(
  state: AppState,
  playerCharacterId: string,
  delta: number
): AppState {
  return {
    ...state,
    characterDefinitions: state.characterDefinitions.map((characterDefinition) =>
      characterDefinition.id !== playerCharacterId
        ? characterDefinition
        : {
            ...characterDefinition,
            stats: {
              ...characterDefinition.stats,
              gold: characterDefinition.stats.gold + delta,
            },
          }
    ),
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/coin-reward-state.test.cjs`

Expected: PASS with 1 passing test.

- [ ] **Step 5: Commit**

```bash
git add tests/coin-reward-state.test.cjs src/application/rewards/coin-reward.ts
git commit -m "feat: add pure coin reward state mutation"
```

