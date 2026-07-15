# 模组化表单编排闭环规划

## 目标

把“作者输入一段剧情或一组表单配置”落成稳定运行链路：

1. 作者期输入自然语言、表单或 Mod 数据。
2. 生成期/导入期物化为 `ScenarioProfileDefinition`、`EventDefinition`、`SceneDefinition`、`FlowDefinition`、`ActivityDefinition`。
3. 运行时只读取结构化 schema，不靠字符串猜测剧情、身份、house 或功能。
4. 特殊 house 仍走 `moduleId -> registry -> lifecycle`，不在 `main.ts` 写角色或地点特判。

## 当前最小闭环

已建立第一版链路：

- `ScenarioProfileDefinition`：描述开局人物、章节、初始位置、初始 runtime、入口事件和 opening flow。
- `FlowDefinition`：描述更高层级的流程槽位，例如开局事件、默认活动、手动触发活动。
- `ActivityDefinition`：描述活动 id、显示标签、handler id、fallback handler、QTE 调参和完成效果。
- `ActionNode.start-activity`：scene 可以声明启动某个活动。
- `application/activity/activity-runner.ts`：运行时按 `handlerId` 查可执行 handler；专属 handler 不存在时可落到 `generic.qte`。
- `generic.qte`：当前先作为非交互式默认结算 handler，写入统一 `GameState.runtime.flags/variables` 并执行配置化 effects。

这个闭环的边界是：作者/表单决定“是什么活动”，运行时只执行已经物化的 `ActivityDefinition`，不会根据活动名、角色名或文本内容临场猜逻辑。

## 当前限制

- `generic.qte` 目前是自动结算，不是可交互 overlay。
- `FlowDefinition` 已有 schema 和示例，但尚未有通用 flow runner。
- 表单/自然语言导入器尚未实现，当前示例仍是 TS 内容文件。
- 动态 Mod 包加载顺序、覆盖规则和校验器尚未接入。
- 角色持久属性仍有部分系统写在 `characterDefinitions`，长期应逐步收进统一状态结构。

## 后续完整闭环

### 阶段 1：Schema 校验与内容汇总

- 为 `ScenarioProfileDefinition`、`FlowDefinition`、`ActivityDefinition` 增加校验器。
- 增加内容汇总入口：base content -> official expansion -> user mods。
- 校验重复 id、缺失引用、无 fallback 的未知 handler、非法初始 view、无效 house id。

验收：

- 一个 Mod 只要提供 JSON/TS 数据，就能被汇总并报告结构错误。
- 错误报告使用稳定 id，不依赖文件顺序。

### 阶段 2：Flow Runner

- 新增 `application/flow/flow-runner.ts`。
- 支持按 trigger 选择 flow slot：`game-start`、`city-enter`、`house-enter`、`turn-end`、`manual`。
- 支持 step：`start-event`、`enter-house`、`set-stage`、`start-activity`。
- `start-activity` 继续走 activity runner。

验收：

- 朱元璋和尚开局和秦始皇皇宫开局都能只通过 scenario + flow 数据决定入口。
- 没有新增 `main.ts` 的角色/house 特判。

### 阶段 3：可交互 Generic QTE

- 把 `generic.qte` 从自动结算升级为可交互活动会话。
- 复用当前 house 的 `qte-bar` view model 结构，抽成共享 activity overlay 或共享 minigame shell。
- 完成后由 activity runner 写入 outcome effects、时间成本和结果变量。

验收：

- 缺少专属 handler 的活动会进入默认 QTE。
- QTE 结果由结构化 `ActivityDefinition.outcome` 决定，不从按钮文本或活动名推断。

### 阶段 4：表单/自然语言导入器

- 定义作者输入格式：剧情文本、角色台词、选择项、活动槽位、fallback 策略。
- 导入器只在作者期做语义归类，并物化为 scene/event/flow/activity。
- 运行时不重新分析自然语言。

验收：

- 输入一段规范剧情文本，可以产出 `SceneDefinition.actions`。
- 输入一个开局表单，可以产出 `ScenarioProfileDefinition + FlowDefinition`。
- 导入结果可以被保存、校验、回放。

### 阶段 5：Mod 包加载

- 建立 `mods/<mod-id>/content` 目录契约。
- 支持 manifest、依赖、覆盖优先级、禁用/启用。
- 内容对象按稳定 id merge，禁止按数组位置覆盖。

验收：

- 用户 Mod 可以新增 scenario、event、scene、flow、activity。
- 用户 Mod 可以覆盖同 id 的文本或调参，但不能绕过 shared runtime。

### 阶段 6：编辑器 UI

- 做表单化编辑器：开局档案、剧情节点、流程槽位、活动定义、fallback 策略。
- 编辑器写 schema，不直接写运行时代码。
- 提供校验结果、引用跳转、预览运行。

验收：

- 作者能在 UI 中新建“秦始皇皇宫开局”，选择默认活动 fallback 为 QTE。
- 预览时执行同一套 runtime，而不是编辑器专用旁路。
