## Task 4: Integrate Runtime Action, State Update, And HUD Rolling Value

**Files:**
- Modify: `src/main.ts`
- Modify: `src/ui/app-render.ts`
- Test: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes:
  - `applyCoinReward(state, playerCharacterId, delta): AppState`
  - `createCoinRewardAnimator(...)`
  - `data-action="grant-haozhou-test-coin"`
  - `data-ui-gold-target`, `data-ui-gold-value`, `data-ui-coin-reward-layer`
- Produces:
  - runtime action handling for the city button
  - `coinRewardDisplayValue: number | null` runtime-local UI state in `src/main.ts`
  - render path that passes `goldTextOverride`

- [ ] **Step 1: Write the failing test**

```js
test("haozhou test button grants 10 gold and starts reward animation", () => {
  const mainSource = fs.readFileSync("src/main.ts", "utf8");

  assert.match(mainSource, /\[data-action='grant-haozhou-test-coin'\]/);
  assert.match(mainSource, /applyCoinReward\(appState,\s*currentPlayerCharacterId,\s*10\)/);
  assert.match(mainSource, /coinRewardAnimator\.play\(/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/robustness.test.cjs --test-name-pattern "haozhou test button grants 10 gold and starts reward animation"`

Expected: FAIL because the new action path is absent.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/main.ts
import { applyCoinReward } from "./application/rewards/coin-reward";
import { createCoinRewardAnimator } from "./ui/animations/coin-reward-animation";

let coinRewardDisplayValue: number | null = null;

const coinRewardAnimator = createCoinRewardAnimator({
  layer: assertExists(document.querySelector("[data-ui-coin-reward-layer]")),
  onDisplayValueChange(value) {
    coinRewardDisplayValue = value;
    renderApp();
  },
});
```

```ts
const grantHaozhouTestCoinButton = targetElement.closest<HTMLElement>(
  "[data-action='grant-haozhou-test-coin']"
);
if (grantHaozhouTestCoinButton != null) {
  const playerCharacterBefore = getPlayerCharacter(appState, currentPlayerCharacterId);
  appState = applyCoinReward(appState, currentPlayerCharacterId, 10);
  coinRewardAnimator.play({
    sourceElement: grantHaozhouTestCoinButton,
    sourceClientX: event.clientX,
    sourceClientY: event.clientY,
    startValue: playerCharacterBefore.stats.gold,
    targetValue: playerCharacterBefore.stats.gold + 10,
    amount: 10,
  });
  renderApp();
  return;
}
```

```ts
// src/ui/app-render.ts
const goldTextOverride =
  input.appState.ui.runtime?.coinRewardDisplayValue == null
    ? null
    : `${input.appState.ui.runtime.coinRewardDisplayValue} 文`;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/robustness.test.cjs --test-name-pattern "haozhou test button grants 10 gold and starts reward animation"`

Expected: PASS with the new source/runtime assertion green.

- [ ] **Step 5: Commit**

```bash
git add src/main.ts src/ui/app-render.ts tests/robustness.test.cjs
git commit -m "feat: wire haozhou coin reward action"
```

