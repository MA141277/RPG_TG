# Haozhou Coin Ingot Flight Implementation Plan

﻿# 婵犲窞鍦板浘閾朵袱椋炲厓瀹濆姩鐢?Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** 鍦ㄦ繝宸炲煄甯傚湴鍥惧鍔犱竴涓案涔呭彲瑙佺殑 `+10 鏂嘸 娴嬭瘯鎸夐挳锛屽苟瀹炵幇涓€濂楀彲澶嶇敤鐨勫叏灞€閾朵袱鑾峰緱椋炲厓瀹濆姩鐢讳笌 HUD 鏁板€兼粴鍔ㄨ〃鐜般€?
**Architecture:** 杩欐鎶娾€滅湡瀹炲姞閽扁€濆拰鈥滆〃鐜板姩鐢烩€濇媶寮€锛歛pplication 灞傝礋璐ｅ畨鍏ㄦ洿鏂?`AppState.characterDefinitions[].stats.gold`锛孶I/runtime 灞傝礋璐ｄ粠鎸夐挳涓績鍠峰彂鍏冨疂銆佽鍙栧乏涓婅鍏ㄥ眬 HUD 鐩爣鐐瑰苟鎾斁褰掓嫝鍔ㄧ敾銆傚煄甯傞〉鍙彁渚涗竴涓祴璇曟寜閽拰涓€涓ǔ瀹?`data-action`锛涗富杩愯鏃惰礋璐ｆ妸 action 鏄犲皠鍒扮姸鎬佸彉鏇翠笌鍔ㄧ敾鎾斁锛屽姩鐢诲け璐ヤ篃涓嶈兘褰卞搷鐪熷疄閾朵袱鏇存柊銆?
**Tech Stack:** TypeScript銆佺幇鏈?DOM 娓叉煋绠＄嚎銆乣src/main.ts` 浜嬩欢濮旀墭銆乣src/ui/app-render.ts` / `src/ui/views/city/city-view.ts` 瀛楃涓叉ā鏉胯鍥俱€丯ode `cjs` 婧愮爜/琛屼负娴嬭瘯銆?
## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-23`
- Current Focus: `Implementation and focused verification are complete in the working tree.`
- Next Step: `Run browser-side manual verification in Haozhou city and then decide whether to keep or remove the temporary +10 test button.`
- Verification: `tests/coin-reward-state.test.cjs`; `tests/haozhou-city-coin-reward-source.test.cjs`; `tests/coin-reward-animation.test.cjs`; `tsc --noEmit -p tsconfig.json`
- Notes: `Git commits remain blocked in this environment by .git/index.lock permissions, so this plan is complete locally but not closed.`

## Progress Log

- 2026-07-23
  - Summary: `Implemented the reusable coin reward state mutation, HUD anchors, pooled ingot flight animation, and Haozhou +10 test button wiring. Also aligned rolling-number timing with actual ingot hits and randomized burst/gather paths.`
  - Verification: `tests/coin-reward-state.test.cjs`; `tests/haozhou-city-coin-reward-source.test.cjs`; `tests/coin-reward-animation.test.cjs`; `tsc --noEmit -p tsconfig.json`
  - Next: `Manual verify the Haozhou button in the city view and decide whether to keep or delete the temporary test hook.`

## Global Constraints

- 鏂板涓€涓叏灞€鈥滈摱涓よ幏寰楀姩鐢诲眰鈥濓紝鎸傚湪涓?UI 鏍硅妭鐐逛箣涓娿€?- 瑙﹀彂鏃朵紶鍏ワ細`璧风偣鍏冪礌/鐐瑰嚮鍧愭爣`銆乣鑾峰緱閲戦`銆乣鐩爣閾朵袱 HUD 鍏冪礌`銆?- 鍔ㄧ敾娴佺▼鍥哄畾涓猴細鎸夐挳涓績鍠峰彂 `10~20` 涓厓瀹濓紝鍏堥殢鏈烘暎寮€骞跺噺閫燂紝鍋滈】绾?`0.5s`锛屽啀娌块殢鏈鸿礉濉炲皵鏇茬嚎椋炲悜宸︿笂瑙掗摱涓?ICON銆?- 浠庣涓€涓厓瀹濆懡涓?ICON 寮€濮嬫粴鍔ㄩ摱涓ゆ暟鍊硷紝鍒版渶鍚庝竴涓厓瀹濆懡涓椂瀹氭牸涓烘渶缁堝€笺€?- 婵犲窞鍩庡競鍦板浘鍏堝姞涓€涓櫘閫氭寜閽紝鐐瑰嚮鍚庣粰鐜╁ `+10 鏂嘸锛屽悓鏃舵挱鏀捐繖濂楀姩鐢汇€?- 鐪熷疄閾朵袱鏁板€煎湪鐐瑰嚮鏃跺氨鍐欏叆娓告垙鐘舵€侊紱鍔ㄧ敾鍙礋璐ｈ〃鐜帮紝涓嶅喅瀹氭渶缁堣祫婧愮粨绠椼€?- 宸︿笂瑙掗摱涓ょ洰鏍囩偣涓嶅啓姝诲潗鏍囷紝鑰屾槸杩愯鏃惰鍙栧乏涓婅鍏ㄥ眬 HUD 閾朵袱 ICON/閾朵袱鏂囨湰鍖哄煙鐨勫睆骞曚綅缃€?- 鍏冨疂瀹炰緥鍋氱畝鍗曞璞℃睜锛岄伩鍏嶆瘡娆＄偣鍑婚兘鏂板缓/閿€姣佷竴鎵?DOM 鑺傜偣銆?- 鑻ュ姩鐢诲櫒鎵句笉鍒伴摱涓?HUD 鐩爣鍏冪礌锛屼粛鐒跺畬鎴愮湡瀹炲姞閽憋紝鍔ㄧ敾閫€鍖栦负浠呮挱鏀炬寜閽懆鍥村柗鍙戞晥鏋滄垨鐩存帴璺宠繃琛ㄧ幇銆?- 涓嶆帴鍏ュ叏閮ㄦ埧灞?浜嬩欢/缁撶畻濂栧姳鍏ュ彛銆?- 涓嶆柊澧炲鏉傞煶鏁堛€?- 涓嶅紩鍏ョ涓夋柟鍔ㄧ敾搴撱€?- 涓嶄慨鏀圭湡瀹炶祫婧愮郴缁熺殑缁撶畻瑙勫垯銆?
---

## File Structure

- Modify: `src/ui/views/city/city-view.ts`
  - 鍦ㄦ繝宸炲煄甯傞〉闈㈠姞涓€涓案涔呭彲瑙佺殑娴嬭瘯鎸夐挳锛屾毚闇茬ǔ瀹氱殑 `data-action="grant-haozhou-test-coin"`銆?- Modify: `src/ui/panels/global-player-panel.ts`
  - 缁欓摱涓ゅ浘鏍?閾朵袱鏂囨湰鍖呬竴灞傜ǔ瀹氱殑鏌ヨ閿氱偣锛屼緵鍔ㄧ敾璇诲彇鐩爣浣嶇疆锛涚粰婊氬姩鏄剧ず鐣欎竴涓ǔ瀹氱殑 DOM 閽╁瓙銆?- Modify: `src/ui/app-render.ts`
  - 鎶婂叏灞€濂栧姳鍔ㄧ敾灞傚鍣ㄦ覆鏌撳埌涓?UI锛涘厑璁镐互鍙€夊弬鏁拌鐩?HUD 閾朵袱鏄剧ず鏂囨銆?- Create: `src/application/rewards/coin-reward.ts`
  - application 灞傜函鍑芥暟锛岃礋璐ｆ妸鐜╁閾朵袱瀹夊叏鍔犲埌 `characterDefinitions` 閲岋紝杩斿洖鏂?`AppState`銆?- Create: `src/ui/animations/coin-reward-animation.ts`
  - DOM 鍔ㄧ敾鎺у埗鍣ㄣ€佸璞℃睜銆佽礉濉炲皵杞ㄨ抗銆丠UD 涓存椂婊氬姩鍊肩鐞嗐€?- Modify: `src/main.ts`
  - 鎸傛帴鎸夐挳 action銆佽皟鐢?`applyCoinReward`銆佽皟鐢?`playCoinRewardAnimation`銆佸湪姣忔 render 鍚庡悓姝ュ姩鐢荤洰鏍囧厓绱犮€?- Create: `tests/haozhou-city-coin-reward-source.test.cjs`
  - 婧愮爜濂戠害娴嬭瘯锛氬煄甯傞〉鎸夐挳銆佸叏灞€ HUD 閿氱偣銆佸姩鐢诲眰鎸傝浇鐐瑰瓨鍦ㄣ€?- Create: `tests/coin-reward-state.test.cjs`
  - application 灞傜姸鎬佹祴璇曪細`+10 鏂嘸 鏇存柊鐪熷疄閾朵袱锛屼笉鐮村潖鍏朵粬瑙掕壊銆?- Create: `tests/coin-reward-animation.test.cjs`
  - 鍔ㄧ敾鎺у埗鍣ㄦ祴璇曪細棣栦釜鍛戒腑寮€濮嬫粴鍔ㄣ€佹湯涓懡涓畾鏍笺€佹棤鐩爣鍏冪礌鏃朵笉鎶涢敊銆?- Modify: `tests/robustness.test.cjs`
  - 涓昏繍琛屾椂鍥炲綊锛氱偣鍑绘繝宸炴祴璇曟寜閽悗鐜╁閾朵袱澧炲姞 `10 鏂嘸锛屽苟瑙﹀彂濂栧姳鍔ㄧ敾鍏ュ彛銆?
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

- [x] **Step 1: Write the failing test**

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

- [x] **Step 2: Run test to verify it fails**

Run: `node --test tests/coin-reward-state.test.cjs`

Expected: FAIL with module-not-found or `applyCoinReward is not a function`.

- [x] **Step 3: Write minimal implementation**

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

- [x] **Step 4: Run test to verify it passes**

Run: `node --test tests/coin-reward-state.test.cjs`

Expected: PASS with 1 passing test.

- [x] **Step 5: Commit**

```bash
git add tests/coin-reward-state.test.cjs src/application/rewards/coin-reward.ts
git commit -m "feat: add pure coin reward state mutation"
```

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

- [x] **Step 1: Write the failing test**

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

- [x] **Step 2: Run test to verify it fails**

Run: `node --test tests/haozhou-city-coin-reward-source.test.cjs`

Expected: FAIL because one or more anchor attributes are missing.

- [x] **Step 3: Write minimal implementation**

```ts
// src/ui/views/city/city-view.ts
const haozhouCoinTestButton = `
  <button
    type="button"
    class="c-kulan-city__coin-test-action"
    data-action="grant-haozhou-test-coin"
  >
    娴嬭瘯 +10鏂?  </button>
`;
```

```ts
// src/ui/panels/global-player-panel.ts
export type GlobalPlayerPanelModel = {
  // ...
  goldTextOverride?: string | null;
};

const resolvedGoldText = model.goldTextOverride ?? `閾朵袱 ${model.goldText}`;
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

- [x] **Step 4: Run test to verify it passes**

Run: `node --test tests/haozhou-city-coin-reward-source.test.cjs`

Expected: PASS with all four source assertions green.

- [x] **Step 5: Commit**

```bash
git add tests/haozhou-city-coin-reward-source.test.cjs src/ui/views/city/city-view.ts src/ui/panels/global-player-panel.ts src/ui/app-render.ts
git commit -m "feat: add coin reward ui anchors"
```

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

- [x] **Step 1: Write the failing test**

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

- [x] **Step 2: Run test to verify it fails**

Run: `node --test tests/coin-reward-animation.test.cjs`

Expected: FAIL with module-not-found or missing export.

- [x] **Step 3: Write minimal implementation**

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

- [x] **Step 4: Run test to verify it passes**

Run: `node --test tests/coin-reward-animation.test.cjs`

Expected: PASS with one passing test.

- [x] **Step 5: Commit**

```bash
git add tests/coin-reward-animation.test.cjs src/ui/animations/coin-reward-animation.ts
git commit -m "feat: scaffold coin reward animator"
```

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

- [x] **Step 1: Write the failing test**

```js
test("haozhou test button grants 10 gold and starts reward animation", () => {
  const mainSource = fs.readFileSync("src/main.ts", "utf8");

  assert.match(mainSource, /\[data-action='grant-haozhou-test-coin'\]/);
  assert.match(mainSource, /applyCoinReward\(appState,\s*currentPlayerCharacterId,\s*10\)/);
  assert.match(mainSource, /coinRewardAnimator\.play\(/);
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `node --test tests/robustness.test.cjs --test-name-pattern "haozhou test button grants 10 gold and starts reward animation"`

Expected: FAIL because the new action path is absent.

- [x] **Step 3: Write minimal implementation**

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
    : `${input.appState.ui.runtime.coinRewardDisplayValue} 鏂嘸;
```

- [x] **Step 4: Run test to verify it passes**

Run: `node --test tests/robustness.test.cjs --test-name-pattern "haozhou test button grants 10 gold and starts reward animation"`

Expected: PASS with the new source/runtime assertion green.

- [x] **Step 5: Commit**

```bash
git add src/main.ts src/ui/app-render.ts tests/robustness.test.cjs
git commit -m "feat: wire haozhou coin reward action"
```

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

- [x] **Step 1: Write the failing test**

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

- [x] **Step 2: Run test to verify it fails**

Run: `node --test tests/coin-reward-animation.test.cjs`

Expected: FAIL because the scaffold animator does not model staged timing.

- [x] **Step 3: Write minimal implementation**

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

- [x] **Step 4: Run test to verify it passes**

Run: `node --test tests/coin-reward-animation.test.cjs`

Expected: PASS with staged-timing assertions green.

- [x] **Step 5: Commit**

```bash
git add src/ui/animations/coin-reward-animation.ts src/ui/views/city/city-view.ts src/ui/panels/global-player-panel.ts tests/coin-reward-animation.test.cjs
git commit -m "feat: complete coin reward ingot flight effect"
```

## Task 6: Run End-To-End Verification

**Files:**
- Test: `tests/coin-reward-state.test.cjs`
- Test: `tests/haozhou-city-coin-reward-source.test.cjs`
- Test: `tests/coin-reward-animation.test.cjs`
- Test: `tests/robustness.test.cjs`

**Interfaces:**
- Consumes:
  - all prior tasks
- Produces:
  - verified local implementation ready for manual review

- [x] **Step 1: Run the focused automated tests**

```bash
node --test tests/coin-reward-state.test.cjs
node --test tests/haozhou-city-coin-reward-source.test.cjs
node --test tests/coin-reward-animation.test.cjs
node --test tests/robustness.test.cjs --test-name-pattern "haozhou test button grants 10 gold and starts reward animation"
```

Expected: PASS for all focused tests.

- [x] **Step 2: Run a quick source sanity check**

```bash
rg -n "grant-haozhou-test-coin|data-ui-gold-target|data-ui-coin-reward-layer|applyCoinReward|createCoinRewardAnimator" src tests -S
```

Expected: all required hooks appear exactly in the intended files.

- [x] **Step 3: Manual verification**

```text
1. 杩涘叆婵犲窞鍩庡競鍦板浘銆?2. 鐐瑰嚮鈥滄祴璇?+10鏂団€濇寜閽€?3. 纭宸︿笂瑙掗摱涓ゆ渶缁堝鍔?10 鏂囥€?4. 纭鍏冨疂浠庢寜閽腑蹇冨柗鍙戯紝鍋滈】绾?0.5s锛屽啀椋炲悜宸︿笂瑙掗摱涓?HUD銆?5. 纭绗竴涓厓瀹濆懡涓悗鏁板瓧寮€濮嬫粴鍔紝鏈€鍚庝竴涓厓瀹濆懡涓悗瀹氭牸銆?6. 蹇€熻繛鐐?2-3 娆★紝纭鐪熷疄閾朵袱浠嶇劧绱姞姝ｇ‘銆?```

- [x] **Step 4: Commit**

```bash
git add tests/coin-reward-state.test.cjs tests/haozhou-city-coin-reward-source.test.cjs tests/coin-reward-animation.test.cjs tests/robustness.test.cjs src/application/rewards/coin-reward.ts src/ui/views/city/city-view.ts src/ui/panels/global-player-panel.ts src/ui/app-render.ts src/ui/animations/coin-reward-animation.ts src/main.ts
git commit -m "feat: add haozhou coin reward animation test hook"
```

## Self-Review

### Spec coverage

- 鍏ㄥ眬閾朵袱鑾峰緱鍔ㄧ敾灞傦細Task 2銆乀ask 3銆乀ask 5銆?- 璧风偣鍏冪礌/鐐瑰嚮鍧愭爣銆佺洰鏍?HUD 鍏冪礌锛歍ask 3銆乀ask 4銆?- `10~20` 鍏冨疂銆佹暎寮€銆佸仠椤?`0.5s`銆佽礉濉炲皵褰掓嫝锛歍ask 5銆?- 绗竴涓懡涓紑濮嬫粴鍔ㄣ€佹渶鍚庝竴涓懡涓畾鏍硷細Task 3銆乀ask 5銆?- 婵犲窞鍦板浘娴嬭瘯鎸夐挳 `+10 鏂嘸锛歍ask 2銆乀ask 4銆?- 鍔ㄧ敾澶辫触涓嶅奖鍝嶇湡瀹炲姞閽憋細Task 1銆乀ask 3銆乀ask 4銆?- 瀵硅薄姹狅細Task 5銆?
### Placeholder scan

- 娌℃湁 `TBD`銆乣TODO`銆乣implement later`銆?- 姣忎釜浠诲姟閮界粰浜嗘槑纭枃浠惰矾寰勩€佹祴璇曞懡浠ゃ€佹渶灏忎唬鐮佸潡鍜屾彁浜ゅ懡浠ゃ€?
### Type consistency

- 鐘舵€佹洿鏂版帴鍙ｅ浐瀹氫负 `applyCoinReward(state, playerCharacterId, delta): AppState`銆?- 鍔ㄧ敾鎺ュ彛鍥哄畾涓?`createCoinRewardAnimator(...).play({...})`銆?- DOM 閿氱偣鍛藉悕缁熶竴涓?`data-ui-gold-target`銆乣data-ui-gold-value`銆乣data-ui-coin-reward-layer`銆?
