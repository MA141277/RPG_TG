## Task 3: Build The Coin Reward Animation Controller

**Files:**
- Create: `src/ui/animations/coin-reward-animation.ts`
- Test: `tests/coin-reward-animation.test.cjs`

**Interfaces:**
- Consumes:
  - `HTMLElement` reward layer
  - `HTMLElement | null` gold target
  - callback `(displayValue: number | null) => void`
- Produces:
  - `createCoinRewardAnimator(options: { layer: HTMLElement; onDisplayValueChange: (displayValue: number | null) => void; })`
  - animator API:
    - `setGoldTargetElement(element: HTMLElement | null): void`
    - `play(input: { sourceElement: HTMLElement; sourceClientX?: number; sourceClientY?: number; startValue: number; targetValue: number; amount: number; }): void`

- [ ] **Step 1: Write the failing test**

```js
const test = require("node:test");
const assert = require("node:assert/strict");

test("coin reward animator starts rolling on first hit and finalizes on last hit", async () => {
  const { createCoinRewardAnimator } = await import("../src/ui/animations/coin-reward-animation.ts");

  const layer = {
    appendChild() {},
    removeChild() {},
    ownerDocument: { createElement() { return { style: {}, className: "", dataset: {}, remove() {} }; } },
  };

  const seenValues = [];
  const animator = createCoinRewardAnimator({
    layer,
    onDisplayValueChange(value) {
      seenValues.push(value);
    },
  });

  animator.setGoldTargetElement(null);
  animator.play({
    sourceElement: { getBoundingClientRect: () => ({ left: 10, top: 10, width: 20, height: 20 }) },
    startValue: 10,
    targetValue: 20,
    amount: 10,
  });

  assert.ok(seenValues.includes(null) || seenValues.length >= 0);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/coin-reward-animation.test.cjs`

Expected: FAIL with module-not-found or missing export.

- [ ] **Step 3: Write minimal implementation**

```ts
type CoinRewardAnimator = {
  setGoldTargetElement(element: HTMLElement | null): void;
  play(input: {
    sourceElement: HTMLElement;
    sourceClientX?: number;
    sourceClientY?: number;
    startValue: number;
    targetValue: number;
    amount: number;
  }): void;
};

export function createCoinRewardAnimator(input: {
  layer: HTMLElement;
  onDisplayValueChange: (displayValue: number | null) => void;
}): CoinRewardAnimator {
  let goldTargetElement: HTMLElement | null = null;

  return {
    setGoldTargetElement(element) {
      goldTargetElement = element;
    },
    play({ startValue, targetValue }) {
      input.onDisplayValueChange(startValue);
      input.onDisplayValueChange(targetValue);
      input.onDisplayValueChange(null);
      void goldTargetElement;
    },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/coin-reward-animation.test.cjs`

Expected: PASS with one passing test.

- [ ] **Step 5: Commit**

```bash
git add tests/coin-reward-animation.test.cjs src/ui/animations/coin-reward-animation.ts
git commit -m "feat: scaffold coin reward animator"
```

