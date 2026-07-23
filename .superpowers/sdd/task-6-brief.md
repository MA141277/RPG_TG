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

- [ ] **Step 1: Run the focused automated tests**

```bash
node --test tests/coin-reward-state.test.cjs
node --test tests/haozhou-city-coin-reward-source.test.cjs
node --test tests/coin-reward-animation.test.cjs
node --test tests/robustness.test.cjs --test-name-pattern "haozhou test button grants 10 gold and starts reward animation"
```

Expected: PASS for all focused tests.

- [ ] **Step 2: Run a quick source sanity check**

```bash
rg -n "grant-haozhou-test-coin|data-ui-gold-target|data-ui-coin-reward-layer|applyCoinReward|createCoinRewardAnimator" src tests -S
```

Expected: all required hooks appear exactly in the intended files.

- [ ] **Step 3: Manual verification**

```text
1. 进入濠州城市地图�?2. 点击“测�?+10文”按钮�?3. 确认左上角银两最终增�?10 文�?4. 确认元宝从按钮中心喷发，停顿�?0.5s，再飞向左上角银�?HUD�?5. 确认第一个元宝命中后数字开始滚动，最后一个元宝命中后定格�?6. 快速连�?2-3 次，确认真实银两仍然累加正确�?```

- [ ] **Step 4: Commit**

```bash
git add tests/coin-reward-state.test.cjs tests/haozhou-city-coin-reward-source.test.cjs tests/coin-reward-animation.test.cjs tests/robustness.test.cjs src/application/rewards/coin-reward.ts src/ui/views/city/city-view.ts src/ui/panels/global-player-panel.ts src/ui/app-render.ts src/ui/animations/coin-reward-animation.ts src/main.ts
git commit -m "feat: add haozhou coin reward animation test hook"
```

## Self-Review

### Spec coverage

- 全局银两获得动画层：Task 2、Task 3、Task 5�?- 起点元素/点击坐标、目�?HUD 元素：Task 3、Task 4�?- `10~20` 元宝、散开、停�?`0.5s`、贝塞尔归拢：Task 5�?- 第一个命中开始滚动、最后一个命中定格：Task 3、Task 5�?- 濠州地图测试按钮 `+10 文`：Task 2、Task 4�?- 动画失败不影响真实加钱：Task 1、Task 3、Task 4�?- 对象池：Task 5�?
### Placeholder scan

- 没有 `TBD`、`TODO`、`implement later`�?- 每个任务都给了明确文件路径、测试命令、最小代码块和提交命令�?
### Type consistency

- 状态更新接口固定为 `applyCoinReward(state, playerCharacterId, delta): AppState`�?- 动画接口固定�?`createCoinRewardAnimator(...).play({...})`�?- DOM 锚点命名统一�?`data-ui-gold-target`、`data-ui-gold-value`、`data-ui-coin-reward-layer`�?
