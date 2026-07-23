## Task 2: Add The City Button And HUD/Overlay Contracts

**Files:**
- Modify: `src/ui/views/city/city-view.ts`
- Modify: `src/ui/panels/global-player-panel.ts`
- Modify: `src/ui/app-render.ts`
- Test: `tests/haozhou-city-coin-reward-source.test.cjs`

**Interfaces:**
- Consumes:
  - `renderCityView(...)` existing city-page template
  - `renderGlobalPlayerPanel(model, layout)` existing HUD template
- Produces:
  - `data-action="grant-haozhou-test-coin"` button in city page
  - `data-ui-gold-target` anchor on HUD target node
  - `data-ui-gold-value` anchor on HUD numeric text node
  - `data-ui-coin-reward-layer` container in app shell render output
  - optional `goldTextOverride?: string | null` in the HUD render path

- [ ] **Step 1: Write the failing test**

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

test("city view and hud expose the coin reward animation anchors", () => {
  const cityViewSource = fs.readFileSync("src/ui/views/city/city-view.ts", "utf8");
  const panelSource = fs.readFileSync("src/ui/panels/global-player-panel.ts", "utf8");
  const appRenderSource = fs.readFileSync("src/ui/app-render.ts", "utf8");

  assert.match(cityViewSource, /data-action="grant-haozhou-test-coin"/);
  assert.match(panelSource, /data-ui-gold-target/);
  assert.match(panelSource, /data-ui-gold-value/);
  assert.match(appRenderSource, /data-ui-coin-reward-layer/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/haozhou-city-coin-reward-source.test.cjs`

Expected: FAIL because one or more anchor attributes are missing.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/ui/views/city/city-view.ts
const haozhouCoinTestButton = `
  <button
    type="button"
    class="c-kulan-city__coin-test-action"
    data-action="grant-haozhou-test-coin"
  >
    测试 +10�?  </button>
`;
```

```ts
// src/ui/panels/global-player-panel.ts
export type GlobalPlayerPanelModel = {
  // ...
  goldTextOverride?: string | null;
};

const resolvedGoldText = model.goldTextOverride ?? `银两 ${model.goldText}`;
```

```ts
// inside HUD markup
<div class="p-global-status-compact__gold-wrap" data-ui-gold-target>
  <strong class="p-global-status-compact__gold" data-ui-gold-value>${resolvedGoldText}</strong>
</div>
```

```ts
// src/ui/app-render.ts
${renderGlobalPlayerPanel(globalPlayerPanelModel, layout)}
<div class="p-ui-coin-reward-layer" data-ui-coin-reward-layer aria-hidden="true"></div>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/haozhou-city-coin-reward-source.test.cjs`

Expected: PASS with all four source assertions green.

- [ ] **Step 5: Commit**

```bash
git add tests/haozhou-city-coin-reward-source.test.cjs src/ui/views/city/city-view.ts src/ui/panels/global-player-panel.ts src/ui/app-render.ts
git commit -m "feat: add coin reward ui anchors"
```

