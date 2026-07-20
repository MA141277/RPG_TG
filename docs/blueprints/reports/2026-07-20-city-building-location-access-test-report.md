# 城市/建筑进入条件测试记录

日期：2026-07-20

## 测试用例

1. 事件条件单独判定。
2. 人物条件单独判定。
3. 时间条件单独判定。
4. 进入城市失败时应弹出拒绝提示对话。

## 遇到的问题

1. 进入城市的运行时提交链路没有消费 `runtimeResult.access`。
2. `routeNavigationRuntime` 已经算出拒绝结果，但 `main.ts` 没有把它转换成 `locationDialogueState`。

## 修复情况

1. 已修复。
2. 在 [main.ts](../../src/main.ts) 的进入城市提交后，改为检查 `runtimeCommit.runtimeResult.access?.refusal`，并调用 `cityHouseTransitionCoordinator.handleHouseAccessRefusal(...)`。
3. 在 [runtime-result.ts](../../src/core/contracts/runtime-result.ts) 中补充了 `access` 字段类型。

## 执行结果

- `npm run build:test`：通过。
- `node --test tests/robustness.test.cjs`：通过。
- `npm run typecheck`：通过。
- `npm run lint:blueprints`：通过。
- `npm test`：通过。
- 真人模拟浏览器复核：已在本机浏览器中进入剧本编辑器模板项目并打开城市页。

## 是否执行完

- 自动化测试：已执行完。
- 浏览器真人模拟验收：已执行部分；未完整覆盖城市/建筑下事件、人物、时间三类条件的全部矩阵，不能作为完整 ACC-007 通过证据。
