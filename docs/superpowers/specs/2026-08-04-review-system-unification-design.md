# Review System Unification Design

## 1. 目标

把当前项目里的“评定/评议”统一成一套可复用、可 author、可经由 mod/runtime 执行的共享系统。

这套系统从第一天就要满足下面几点：

- 任何建筑都可以挂接评定流程，不只限于皇觉寺或帅府。
- 评定机制 owner 不再放在具体 house module 里各写一套。
- 评定内容由剧本包 author，运行时通过共享 meeting runtime 执行。
- 当前 UI 壳、交互方式、可见顺序、主线内容顺序保持不变。
- builtin runtime 源、script-editor builtin template 源、public template mirror 源都要保持一致。

这不是“把 temple 特判搬一下”或“再补一个兼容层”，而是把评定系统正式收口成共享机制。

## 2. 当前现状

当前仓库里，评定链已经分成了三层，但 owner 还没完全统一：

### 2.1 已完成的共享层

- `src/application/review/faction-review.ts`
  - 已拥有贡献评级、阵营功绩、阵营身份、人事结算、奖励结算、任务门槛等共享业务 helper。
- `src/application/meeting/*`
  - 已拥有 generic meeting runtime、meeting host bridge、meeting presenter。
- `src/core/runtime/house-runtime.ts`
  - 已支持 `sharedSessionState.hostedMeeting` 跨 house runtime 边界保存 meeting 会话。
- `src/domain/house-module.ts`
  - 已支持 host session 与 shared meeting session 共存。

### 2.2 已迁移到 shared meeting 的宿主

- `temple-house`
  - 评定入口、共享会话显示、共享会话推进，已经走 shared meeting。
  - 宿主仍保留少量非评定路径 session 字段，但评定 covered path 的正式 owner 已切到 shared meeting。
- `keep-house`
  - 评定入口、共享会话显示、共享会话推进，已经走 shared meeting。
  - `story battle -> keep review` 的回流链也已经能回到 shared meeting 宿主路径。

### 2.3 当前剩余的兼容清理点

- `temple-house`
  - 本地 `meetingStage` 字段和部分 review fallback 代码还在，虽不再是 covered path 正式 owner，但还需要继续清理。
- `keep-house`
  - 本地 review 状态字段仍存在，主要用于宿主壳和迁移期兜底，不应继续扩散为正式 owner。
- `src/application/meeting/meeting-presenter.ts`
  - 共享展示层已经补上 `summary` stage 呈现，防止 hosted meeting 在摘要阶段回退到本地旧台词。
  - 后续如果要支持更多评定 stage 类型，也应继续在共享 presenter 补，不要把 fallback 分散回 house module。

### 2.4 已 author 的内容层

- 当前 runtime pack / builtin template / public mirror 三处都已经 author 了：
  - `meeting.temple.review`
  - `binding.temple.review`
  - `meeting.keep.review`
  - `binding.keep.review`
  - keep 对应的 panel / choice / action authored 内容

## 3. 要解决的核心问题

当前真正的设计问题不是“有没有评定功能”，而是 owner 仍然分裂：

1. 宿主 owner
   - 建筑是谁
   - 角色 roster 怎么显示
   - 评定结束后回到哪里

2. 评定机制 owner
   - 阶段推进
   - 选择校验
   - overlay / dialogue / action container 投影
   - completion return-to-host

3. 评定内容 owner
   - 开场文案
   - 阶段顺序
   - choice label
   - policy panel 文案
   - assignment rows 的 authored 外壳
   - 完成动作配置

现在 temple/keep 还分别把 1、2、3 混写在各自 house module 里，所以：

- 不能稳定扩展到第三个建筑
- 不能保证模板与 runtime 的评定内容同步
- 不能保证后续删 fallback 时不丢功能

## 4. 最终目标结构

统一后的评定系统必须分成三层。

### 4.1 宿主层

宿主层继续留在具体 house module。

宿主层负责：

- 判断当前是否应该触发评定
- 提供 host context
- 把 shared meeting presenter 投影进当前 house shell
- 处理非评定路径，例如 temple 的 work/donate/rest，keep 的 audience 日常

宿主层不再负责：

- 自己推进评定 stage
- 自己保存另一套 meetingStage 状态机
- 自己 hardcode 评定文案和阶段图

### 4.2 共享评定运行时层

共享评定运行时由 `src/application/meeting/*` 和共享 review helper 共同承接。

它负责：

- 从 binding 启动会议
- 按 authored stage 推进
- 解析 choice / panel / action
- 调用共享 faction-review helper 做奖励、人事、门槛、贡献结算
- 结束后 return-to-host

### 4.3 剧本包内容层

剧本包负责 author：

- meeting definitions
- binding definitions
- panels
- choice sets
- action sets
- text entries / strategy 文案 / assignment 相关外壳文案

剧本包不负责：

- DOM
- application shell 行为
- runtime 全局状态机

## 5. 统一后的 owner 规则

### 5.1 哪些内容属于共享机制

下面这些必须放在共享机制里：

- 评定阶段推进模型
- assignment-table / policy-panel / choice / action 等 stage type 语义
- contribution grade 计算
- faction merit 写回
- faction membership / personnel 结算
- reward 发放
- task gate 判定
- return-to-host 完成协议

### 5.2 哪些内容属于剧本包

下面这些属于剧本包 author 内容：

- temple review 的开场、方略、进言、委任文案
- keep review 的开场、方略、进言、委任文案
- 各阶段的显示顺序
- choice label
- 会议绑定关系
- 会议完成时调用哪些共享 action

### 5.3 哪些内容属于宿主

下面这些继续属于宿主：

- 当前 house shell 的视觉结构
- 当前角色 roster、status card 的框架
- 非评定路径 action
- 当前建筑自己的 daily/session 业务

## 6. 统一后的数据流

### 6.1 启动

1. house module 判断当前是否应进入评定
2. host 用 `launchMeetingFromHostAction(...)` 按 binding 启动 meeting
3. `sharedSessionState.hostedMeeting` 挂到 house session 边界
4. house shell 用 hosted meeting presenter 渲染当前评定画面

### 6.2 推进

1. 用户点击当前 house shell 上的 action
2. host 判断该 action 是否属于 hosted meeting
3. 若属于，则转成：
   - `advance`
   - `select-choice`
4. `resumeMeetingFromHostSession(...)` 推进 shared meeting
5. presenter 产出下一阶段的 dialogue / overlay / actions
6. 当前 house shell 继续显示，但 owner 已经是 shared meeting

### 6.3 完成

1. authored action stage 或结尾 stage 到达 completion
2. `completeMeetingToHost(...)` 清理 `sharedSessionState.hostedMeeting`
3. 控制权回到 host
4. host 恢复 house 的非评定态 session

## 7. 当前一次性迁移的落地结果

这次一次性迁移，已经落地了下面两部分。

### 7.1 keep review 已完成迁移

- 给 keep review author meeting family
- keep review 入口改走 shared meeting
- keep review 显示改走 shared meeting presenter
- keep review 推进改走 shared meeting owner
- keep review 完成后回到 keep host

当前要求变成：

- keep 本地 `meetingStage` 不能再作为 covered path 的正式 owner
- 后续只允许继续删除兼容，不允许再往 keep 本地状态机叠新评定逻辑

### 7.2 temple / keep 评议 fallback 已收口到单入口 helper

- 保留 temple / keep 非评议路径
- temple / keep 的评议 covered path 都已经由 shared meeting owner 驱动
- 宿主侧残留的 review fallback 已分别收口到单入口 helper，不能再作为第二套正式 owner 扩张

当前允许暂时保留的仅限：

- 少量过渡 helper
- 委任/结算仍借宿主现有 helper 的回流 seam
- 仅服务于迁移完成前测试和回归的 adapter

下一阶段目标不再是“把 hosted path 接上”，而是继续删除这些单入口 fallback，或把剩余 settlement / authored gap 下放到 shared meeting / 剧本包。

## 8. authored 内容统一要求

后续评定内容在源上必须满足：

- runtime 源：`src/content/scenario-packs/zhuyuanzhang/**`
- builtin template 源：`src/modules/script-editor/builtin-templates/zhuyuanzhang/**`
- public mirror：`public/script-editor-templates/zhuyuanzhang/**`

对于评定 meeting family：

- temple 与 keep 都要在 runtime 源里有 canonical authored 内容
- builtin template 与 public mirror 必须与 canonical 同步
- 同步规则继续走已有同步工具，不允许三处手工漂移

长期目标仍然是减少源头数量，但在当前阶段，这三处必须内容一致。

## 9. 对现有主线和 UI 的硬约束

这次迁移必须满足 3 个硬约束：

1. 不改当前 UI
   - 不重做寺庙界面
   - 不重做帅府界面
   - 不引入新的评定专用外层页面

2. 不改当前功能
   - temple 的 work/donate/leave/rest/begging 不受影响
   - keep 的 audience / story-battle 回流不受影响

3. 不改合并前主线顺序和内容
   - temple review 仍按当前主线节奏触发
   - keep review 仍按当前主线和战后回流节奏触发
   - 现有 visible order 不变

## 10. 一次性迁移的实施顺序

推荐按下面顺序做一次性迁移。

### 10.1 已补 keep authored meeting family

原因：

- keep 需要先有 shared meeting 内容源
- 没有 authored meeting，就不可能清掉 keep 本地 owner

### 10.2 已迁 keep host

让 keep 从：

- 本地 `meetingStage`

切到：

- `sharedSessionState.hostedMeeting`

并让 keep shell 渲染 shared presenter。

### 10.3 下一步继续删 temple / keep review 单入口 fallback

因为 temple / keep 的 shared hosted path 和最终委任 handoff 都已经打通，这时继续删剩余 fallback 风险最低。

### 10.4 已补关键回归，后续继续扩大

至少覆盖：

- temple hosted review integration
- keep hosted review integration
- authored family contract
- robustness 里的 temple/keep review 行为
- story battle 回帅府评议回流

## 11. 验收标准

迁移完成后，下面这些条件必须同时成立：

1. temple review 和 keep review 都通过 shared meeting owner 执行
2. temple/keep 不再各自保留 covered path 的正式评定状态机 owner
3. 当前 UI、交互、主线顺序、文案顺序保持不变
4. runtime 源、builtin template 源、public mirror 源中的评定 meeting family 保持一致
5. story battle 回帅府评议、迟到赴会、评定优先 house 等外围链路不回退

## 12. 本次迁移后的剩余工作

本次一次性迁移完成后，剩余工作不再是“评定 owner 迁移”，而是：

- 继续把 authored 内容做细
- 决定 temple/keep 某些特殊 stage 是否进一步数据化
- 决定后续是否把评定编辑能力暴露进剧本编辑器

那已经属于“评定内容 authoring 能力扩展”，不再属于这次“统一评定系统 owner”的问题。
