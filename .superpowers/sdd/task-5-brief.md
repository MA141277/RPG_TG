## Task 5: Replace The Animator Scaffold With The Full Four-Stage Effect

**Files:**
- Modify: `src/ui/animations/coin-reward-animation.ts`
- Modify: `src/ui/views/city/city-view.ts`
- Modify: `src/ui/panels/global-player-panel.ts`
- Test: `tests/coin-reward-animation.test.cjs`

**Interfaces:**
- Consumes:
  - `createCoinRewardAnimator(...)` scaffold from Task 3
  - DOM anchors from Task 2
  - runtime integration from Task 4
- Produces:
  - pooled ingot nodes
  - 10~20 ingot burst
  - 0.5s pause
  - bezier gather flight to HUD target
  - first-hit start and last-hit finalize behavior

- [ ] **Step 1: Write the failing test**

```js
test("coin reward animator finalizes display value on the last ingot hit", async () => {
  const { createCoinRewardAnimator } = await import("../src/ui/animations/coin-reward-animation.ts");

  const seenValues = [];
  const animator = createCoinRewardAnimator({
    layer: fakeLayer,
    onDisplayValueChange(value) {
      seenValues.push(value);
    },
  });

  animator.setGoldTargetElement(fakeTarget);
  animator.play({
    sourceElement: fakeSource,
    startValue: 10,
    targetValue: 20,
    amount: 10,
  });

  await new Promise((resolve) => setTimeout(resolve, 1200));

  assert.equal(seenValues.at(-2), 20);
  assert.equal(seenValues.at(-1), null);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/coin-reward-animation.test.cjs`

Expected: FAIL because the scaffold animator does not model staged timing.

- [ ] **Step 3: Write minimal implementation**

```ts
const INGOT_MIN_COUNT = 10;
const INGOT_MAX_COUNT = 20;
const INGOT_PAUSE_MS = 500;

function createIngotNode(document: Document): HTMLSpanElement {
  const node = document.createElement("span");
  node.className = "p-ui-coin-reward-layer__ingot";
  return node;
}

function quadraticBezier(from: number, control: number, to: number, t: number): number {
  return (1 - t) * (1 - t) * from + 2 * (1 - t) * t * control + t * t * to;
}
```

```ts
// in play(...)
const ingotCount = Math.max(INGOT_MIN_COUNT, Math.min(INGOT_MAX_COUNT, amount));
const hitValues = buildRollingDisplayValues(startValue, targetValue, ingotCount);
scheduleBurst();
schedulePause(INGOT_PAUSE_MS);
scheduleGather({
  onFirstHit() {
    input.onDisplayValueChange(hitValues[0] ?? startValue);
  },
  onEachHit(hitIndex) {
    input.onDisplayValueChange(hitValues[hitIndex] ?? targetValue);
  },
  onLastHit() {
    input.onDisplayValueChange(targetValue);
    input.onDisplayValueChange(null);
  },
});
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/coin-reward-animation.test.cjs`

Expected: PASS with staged-timing assertions green.

- [ ] **Step 5: Commit**

```bash
git add src/ui/animations/coin-reward-animation.ts src/ui/views/city/city-view.ts src/ui/panels/global-player-panel.ts tests/coin-reward-animation.test.cjs
git commit -m "feat: complete coin reward ingot flight effect"
```

