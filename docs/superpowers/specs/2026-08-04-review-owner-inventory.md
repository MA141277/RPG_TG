# Review Owner Inventory

## 1. 目标

冻结当前评议系统的 owner 范围，避免后续继续边做边扩散。

这份清单只回答 3 件事：

1. 当前每一类 owner 在哪里。
2. 最终应该归谁。
3. 这一类是可以直接删除、必须先补 shared runtime，还是必须暂时保留过渡 seam。

硬约束保持不变：

- 不改当前 UI
- 不改当前功能
- 不改当前主线顺序和内容

## 2. 冻结范围

本次冻结范围只包含下面这些文件与源：

- `src/application/house-modules/temple-house/temple-house-house-module.ts`
- `src/application/house-modules/keep-house/keep-house-house-module.ts`
- `src/application/meeting/**`
- `src/content/scenario-packs/zhuyuanzhang/meetings.json`
- `src/content/scenario-packs/zhuyuanzhang/meeting-panels.json`
- `src/content/scenario-packs/zhuyuanzhang/meeting-choice-sets.json`
- `src/content/scenario-packs/zhuyuanzhang/meeting-action-sets.json`
- `src/modules/script-editor/builtin-templates/zhuyuanzhang/meetings.json`
- `src/modules/script-editor/builtin-templates/zhuyuanzhang/meeting-panels.json`
- `src/modules/script-editor/builtin-templates/zhuyuanzhang/meeting-choice-sets.json`
- `src/modules/script-editor/builtin-templates/zhuyuanzhang/meeting-action-sets.json`
- `public/script-editor-templates/zhuyuanzhang/meetings.json`
- `public/script-editor-templates/zhuyuanzhang/meeting-panels.json`
- `public/script-editor-templates/zhuyuanzhang/meeting-choice-sets.json`
- `public/script-editor-templates/zhuyuanzhang/meeting-action-sets.json`

不在本次冻结范围内：

- temple / keep 的日常非评议逻辑
- 其他 house 的普通工作、捐献、休息、剧情入口
- 评议之外的小游戏 runtime

## 3. 总体结论

当前已经不是“是否接 shared meeting”的阶段，而是：

- `keep review` 的 covered path 已基本收口为 shared meeting owner
- `temple review` 的 covered path 已打通 shared meeting，但长链中仍有一部分依赖宿主结算回流与本地 fallback
- 剧本包三处源都已经 author 了 `meeting.temple.review` 和 `meeting.keep.review`

接下来真正要解决的是 3 类残留：

1. `keep` 已经可以直接继续删本地 legacy owner。
2. `temple` 需要先把 `reward / personnel / praise` 之后的阶段能力继续补进 shared meeting，再删本地 fallback。
3. 结算 owner 仍分散在 `temple-house` / `keep-house` / `faction-review` / `meeting-action-runtime` 之间，需要统一边界。

## 4. Owner 清单

### 4.1 入口 owner

| 类别 | 当前 owner | 最终 owner | 当前判断 |
| --- | --- | --- | --- |
| temple review 触发资格 | `temple-house-house-module.ts` 的 `enter()` 与 `tryLaunchTempleReviewMeeting(...)` | 宿主 house | 保留 |
| keep review 触发资格 | `keep-house-house-module.ts` 的 `enter()` 与 `tryLaunchKeepReviewMeeting(...)` | 宿主 house | 保留 |
| review binding 命中 | `src/application/meeting/meeting-host-bridge.ts` | shared meeting runtime | 已到位 |
| host context / return target | `createTempleMeetingHostContext(...)` / `createKeepMeetingHostContext(...)` | 宿主 house | 保留 |

结论：

- 入口资格与返回目标本来就属于宿主，不需要再下放。
- 这部分不是 legacy，后续不应继续改成 `main.ts` 或本地状态机分支。

### 4.2 阶段 owner

| 阶段 | temple 当前 owner | keep 当前 owner | 最终 owner | 当前判断 |
| --- | --- | --- | --- | --- |
| intro | hosted meeting advance | hosted meeting advance | shared meeting | 已到位 |
| assignment-table 显示 | shared presenter + host 初始派生态注入 | shared presenter + host 初始派生态注入 | shared meeting | 已到位 |
| assignment-table 关闭后跳转 | `temple` 走 hosted stage handoff + 宿主结算 helper | hosted meeting advance | shared meeting | `temple` 仍属过渡 seam |
| reward | `temple` 走 hosted stage handoff + 本地 reward overlay 生成 | keep 无此阶段 | shared meeting | 必须继续下放 |
| personnel | `temple` 走 hosted stage handoff + 本地 personnel overlay 生成 | keep 无此阶段 | shared meeting | 必须继续下放 |
| praise | `temple` 仍可由本地 fallback helper 生成文案；keep 已主要由 authored meeting 驱动 | keep authored meeting | shared meeting | `temple` 需继续下放 |
| situation | `temple` 仍有本地 fallback；keep authored meeting | shared meeting | `temple` 需继续下放 |
| policy | presenter 已共享，但 `temple` 仍有本地 fallback close 兼容 | keep authored meeting | shared meeting | `temple` 需继续下放 |
| advice | presenter 已共享；`temple` covered path 已可在 shared meeting owner 下进入 assign-duty | shared meeting | `temple` covered path 已到位，fallback 仍在 |
| assign-duty / assign-task | 两边都通过 hosted choice + settlement handoff 回流现有宿主结算；`temple` covered path 已在 shared presenter 下显示动态差事列表 | shared meeting + clear seam | 过渡 seam，暂保留 |
| assigned / summary | keep 已走 shared summary stage；temple 仍回到宿主 `assigned` | keep 归 shared meeting；temple 归宿主 settlement seam | keep 已到位；temple 正式保留 seam |
| complete / return-to-host | `completeMeetingToHost(...)` | `completeMeetingToHost(...)` | shared meeting | 已到位 |

结论：

- `keep` 已接近“阶段只认 shared meeting”。
- `temple` 当前最大缺口不是入口，而是 `reward / personnel / praise / situation / policy / advice / assign-duty / assigned` 还没有完全共享化。

### 4.3 结算 owner

| 结算项 | 当前 owner | 最终 owner | 当前判断 |
| --- | --- | --- | --- |
| keep 委任结果写回 | `matchHostedMeetingSettlementHandoff(...)` -> `assignTaskToPlayer(...)` | shared review / hosted settlement seam | 暂保留 seam |
| temple 工作计划写回 | `matchHostedMeetingSettlementHandoff(...)` -> `submitReviewWorkPlan(...)` | 宿主 settlement seam | 正式保留 seam |
| temple 贡献表结算 | `settleTempleReviewAssignmentTable(...)` | shared review / meeting runtime | 必须继续下放 |
| temple 奖励发放 | `settleTempleReviewAssignmentTable(...)` + `applyReviewItemReward(...)` | shared review | 机制已共享，owner 仍分散 |
| temple 人事变动 | `settleTemplePersonnelChanges(...)` / `applyTemplePersonnelChanges(...)` | shared review | 必须继续收口 |
| keep 倒计时重置 | authored `actions.keep.review.complete` + shared meeting action runtime | shared meeting action runtime | 已到位 |
| temple 首次评议 flag / 倒计时重置 | authored `actions.temple.review.complete` + shared meeting action runtime | shared meeting action runtime | 已到位 |

结论：

- 通用写变量/写 flag 已经进入 shared meeting action runtime。
- temple/keep 的“选择后如何变成宿主任务或工作计划”仍是必要 seam。
- temple 的 reward / personnel 仍不是统一 owner，属于 Task D 的核心工作。

### 4.4 Authored content owner

| 内容 | 当前 owner | 最终 owner | 当前判断 |
| --- | --- | --- | --- |
| meeting stage 图 | `meetings.json` 三处源 | runtime 剧本包 canonical | 已 author，需继续同步 |
| panel 文案 | `meeting-panels.json` 三处源 | runtime 剧本包 canonical | 已 author，需继续同步 |
| advice / assignment choice | `meeting-choice-sets.json` 三处源 | runtime 剧本包 canonical | 已 author，需继续同步 |
| complete / assign action set | `meeting-action-sets.json` 三处源 | runtime 剧本包 canonical | 已 author，需继续同步 |
| keep summary authored 内容 | `panel.keep.review.assigned` | runtime 剧本包 canonical | 已到位 |
| temple reward / personnel 文案外壳 | 仍大量来自 `temple-house-house-module.ts` 本地 helper + `text-entries.json` | runtime 剧本包 canonical + shared runtime 机制 | 还未完全下放 |
| keep / temple praise / strategy 具体文案 | 仍部分经本地 helper 拼装 + `text-entries.json` | 剧本包内容 + shared runtime | `temple` 更缺，`keep` 残留较少 |

结论：

- “有没有 authored meeting”这个问题已经解决了。
- 现在的问题是：仍有一批阶段内容虽然用了 `text-entries.json`，但正式 owner 还在 house helper，不在 meeting family。

### 4.5 Legacy fallback owner

| 文件 | 当前 legacy owner | 最终状态 | 当前判断 |
| --- | --- | --- | --- |
| `keep-house-house-module.ts` | 原本本地 review fallback helper；现在主状态机已去掉，只剩少量宿主普通对话与 post-assigned close | 删除评议 legacy，只保留普通帅府会见 | 可以继续直接删除 |
| `temple-house-house-module.ts` | `handleLegacyTempleReviewFallback(...)` 仍持有 no-meeting 场景下的 praise / situation / policy / advice / assign-duty / assigned 等 fallback；shared meeting 激活时已不再允许重新接管 | 压缩到最小，最终删除 | 不能直接整段删，先补 shared runtime |
| `meeting-host-settlement-handoff.ts` | 选择结果回流宿主 helper | 过渡 seam | 暂保留并列清单 |
| `meeting-host-stage-handoff.ts` | temple `assignment-table / reward / personnel` 阶段回流后再投影回 hosted meeting | 过渡 seam | 暂保留，后续应被更正式的 shared stage capability 取代 |

结论：

- `keep` 的 legacy 删除条件已经成熟。
- `temple` 不能直接一刀切删掉 `handleLegacyTempleReviewFallback(...)`，否则会丢失 no-meeting 长链能力。
- 但 shared meeting 激活后，宿主 fallback 已不再允许作为第二 owner 重新接管评议推进。

## 5. 可直接删除 / 必须先补 / 必须保留 seam

### 5.1 可直接删除

- `keep-house-house-module.ts` 内已经失效的本地评议 UI helper
- `keep-house-house-module.ts` 内已不再承担正式 owner 的 review-only fallback 分支
- keep 侧任何再次把 `advice / assign-task / review close` 拉回宿主 owner 的代码

当前已经确认可删或已删的具体项：

| 文件 | 函数 / 类型 | 类别 | 处理 |
| --- | --- | --- | --- |
| `src/domain/house-modules/keep-house-session.ts` | `KeepHouseReviewAssignmentTableOverlayState` | legacy | 已删除 |
| `src/domain/house-modules/keep-house-session.ts` | `KeepHouseReviewPolicyPanelOverlayState` | legacy | 已删除 |
| `src/domain/house-modules/keep-house-session.ts` | `KeepHouseMeetingStage` 中 `assignment-table / praise / situation / policy / advice / assign-task` | legacy | 已删除 |
| `src/application/house-modules/keep-house/keep-house-house-module.ts` | `selectOverlayViewModel(...)` 内 `review-assignment-table / review-policy-panel` 本地分支 | legacy | 已删除 |

### 5.2 必须先补 shared runtime

- temple `reward` 阶段的正式共享承接
- temple `personnel` 阶段的正式共享承接
- temple `praise / situation / policy / advice` 的正式 authored/shared owner
- temple `assign-duty -> assigned -> complete` 的完整 shared path
- 统一的 reward/personnel/summary stage capability，而不是继续由宿主 helper 投影

### 5.3 必须暂时保留的过渡 seam

- `meeting-host-settlement-handoff.ts`
- `meeting-host-stage-handoff.ts`
- `assignTaskToPlayer(...)` / `submitReviewWorkPlan(...)` 这种“宿主任务/工作计划写回”回流点

这些 seam 不是长期目标，但在当前阶段不能删除，否则会破坏现有功能。

## 6. 最终归属规则

后续判断 owner 归属时，统一按下面规则执行：

1. 宿主 house 只拥有：
   - 入口资格
   - host context
   - 当前 house shell 投影
   - 返回目标
   - 暂时无法共享的结算回流 seam
2. shared meeting runtime 拥有：
   - 阶段推进
   - 关闭动作推进
   - choice 选择
   - panel / overlay / summary 投影
   - completion return-to-host
3. shared review / meeting action runtime 拥有：
   - reward
   - personnel
   - merit / membership / rank
   - shared countdown / flag / variable 写回
4. 剧本包拥有：
   - stage 图
   - panel
   - choice set
   - action set
   - 可 author 的评议文案与标题

## 7. 对应到后续任务

## 8. 冻结后的逐项 owner 清单

### 8.1 keep review

| 文件 | 函数 / 常量 | 类别 | 当前归属 | 建议动作 |
| --- | --- | --- | --- | --- |
| `src/application/house-modules/keep-house/keep-house-house-module.ts` | `enter()` | 入口 | 宿主 | 保留 |
| `src/application/house-modules/keep-house/keep-house-house-module.ts` | `tryLaunchKeepReviewMeeting(...)` | 入口 | 宿主发起 shared meeting | 保留 |
| `src/application/house-modules/keep-house/keep-house-house-module.ts` | `resumeKeepHostedMeeting(...)` | 阶段 | shared meeting 恢复桥 | 保留 |
| `src/application/house-modules/keep-house/keep-house-house-module.ts` | `resolveKeepHostedMeetingRequest(...)` | 阶段 | 宿主把壳动作翻译成 shared request | 保留 |
| `src/application/house-modules/keep-house/keep-house-house-module.ts` | `assignTaskToPlayer(...)` | 结算 seam | 宿主任务写回 | 暂保留 seam |
| `src/application/house-modules/keep-house/keep-house-house-module.ts` | `handleAction(...)` 中 `matchHostedMeetingSettlementHandoff(...)` | 结算 seam | shared meeting -> 宿主回流 | 暂保留 seam |
| `src/application/house-modules/keep-house/keep-house-house-module.ts` | `close-alert` 针对 `meetingStage === "assigned"` | 结算后收尾 | 宿主壳收尾 | 暂保留，后续可评估是否并入 shared summary/complete |
| `src/application/house-modules/keep-house/keep-house-house-module.ts` | `getMeetingIntroLines(...)` / `getLateMeetingIntroLines(...)` / `getLateExpulsionLines(...)` | 内容 fallback | 宿主开场/迟到处罚壳 | 暂保留，不属于 shared meeting 主链 |
| `src/content/scenario-packs/zhuyuanzhang/meetings.json` | `meeting.keep.review` | authored 内容 | 剧本包 canonical | 保留 |
| `src/content/scenario-packs/zhuyuanzhang/meeting-panels.json` | `panel.keep.review.assignment` / `panel.keep.review.policy` / `panel.keep.review.assigned` | authored 内容 | 剧本包 canonical | 保留 |
| `src/content/scenario-packs/zhuyuanzhang/meeting-choice-sets.json` | `choices.keep.review.advice` / `choices.keep.review.assignment` | authored 内容 | 剧本包 canonical | 保留 |
| `src/content/scenario-packs/zhuyuanzhang/meeting-action-sets.json` | `actions.keep.review.complete` | authored 内容 / 通用写回 | shared meeting action runtime | 保留 |

结论：

- keep 的本地评议主状态机已经不再存在。
- 当前 keep 剩下的正式宿主 owner 主要只剩“任务写回”和“assigned 后本地结果壳收尾”。
- Task B 最安全的下一删对象，不是入口或 shared request 翻译，而是继续检查 `assigned` 收尾是否能并入 shared summary/complete。

### 8.2 temple review

| 文件 | 函数 / 常量 | 类别 | 当前归属 | 建议动作 |
| --- | --- | --- | --- | --- |
| `src/application/house-modules/temple-house/temple-house-house-module.ts` | `enter()` | 入口 | 宿主 | 保留 |
| `src/application/house-modules/temple-house/temple-house-house-module.ts` | `tryLaunchTempleReviewMeeting(...)` | 入口 | 宿主发起 shared meeting | 保留 |
| `src/application/house-modules/temple-house/temple-house-house-module.ts` | `resumeTempleHostedMeeting(...)` | 阶段 | shared meeting 恢复桥 | 保留 |
| `src/application/house-modules/temple-house/temple-house-house-module.ts` | `resolveTempleHostedMeetingRequest(...)` | 阶段 | 宿主把壳动作翻译成 shared request | 保留 |
| `src/application/house-modules/temple-house/temple-house-house-module.ts` | `projectTempleHostedReviewStage(...)` | 阶段 seam | 宿主结算结果投影回 shared meeting | 暂保留 seam，已不再依赖本地评议 session 转场 |
| `src/application/house-modules/temple-house/temple-house-house-module.ts` | `settleTempleReviewAssignmentTable(...)` | 结算 | 宿主持有 assignment/reward/personnel 起点 | 仍需下放，但已改为返回 shared 投影结果 |
| `src/application/house-modules/temple-house/temple-house-house-module.ts` | `createTemplePersonnelOrPraiseProjection(...)` | 结算 / 阶段 | 宿主人事/奖励后续投影 | 暂保留 seam，已不再返回本地评议 session |
| `src/application/house-modules/temple-house/temple-house-house-module.ts` | `createTemplePraiseProjection(...)` | 阶段 / 内容 | 宿主 praise 投影 | 暂保留 seam，已不再返回本地评议 session |
| `src/application/house-modules/temple-house/temple-house-house-module.ts` | `handleLegacyTempleReviewFallback(...)` | legacy 总入口 | 宿主本地评议 fallback | 不能直接删除，但现在只服务于 no-meeting fallback；shared meeting 激活时不再进入这条链 |
| `src/application/house-modules/temple-house/temple-house-house-module.ts` | `getTempleMeetingPolicyLines(...)` | 内容 owner | 宿主拼 policy 文案 | 需迁到 meeting family / shared review 数据 |
| `src/application/house-modules/temple-house/temple-house-house-module.ts` | `getTempleAssignDutyLines(...)` | 内容 owner | 宿主拼 assign-duty 文案 | 需迁到 meeting family / shared review 数据 |
| `src/application/house-modules/temple-house/temple-house-house-module.ts` | `submitReviewWorkPlan(...)` | 结算 seam | 宿主工作计划写回 + assigned 结果壳 | 正式保留为宿主 settlement seam |
| `src/application/house-modules/temple-house/temple-house-house-module.ts` | `projectTempleHostedReviewStage(...)` | 阶段投影 seam | 宿主生成动态台词/弹层/差事列表后再投影回 shared meeting | 暂保留，后续可考虑下沉为更正式的 shared stage capability |
| `src/application/meeting/meeting-host-stage-handoff.ts` | `matchHostedMeetingStageHandoff(...)` | 过渡 seam | shared meeting 到宿主再回 shared meeting | 暂保留，后续替换 |
| `src/application/meeting/meeting-host-settlement-handoff.ts` | `matchHostedMeetingSettlementHandoff(...)` | 结算 seam | shared meeting 到宿主回流 | 暂保留 |
| `src/content/scenario-packs/zhuyuanzhang/meetings.json` | `meeting.temple.review` | authored 内容骨架 | 剧本包 canonical | 保留，但仍需补足真正 owner |
| `src/content/scenario-packs/zhuyuanzhang/meeting-panels.json` | `panel.temple.review.assignment` / `panel.temple.review.policy` | authored 内容 | 剧本包 canonical | 保留 |
| `src/content/scenario-packs/zhuyuanzhang/meeting-choice-sets.json` | `choices.temple.review.advice` / `choices.temple.review.assignment` | authored 内容 | 剧本包 canonical | 保留 |
| `src/content/scenario-packs/zhuyuanzhang/meeting-action-sets.json` | `actions.temple.review.complete` / `actions.temple.review.assign.*` | authored 内容 / 通用写回 | shared meeting action runtime | 保留 |

结论：

- temple 当前的主要问题已经不是入口；covered path 现在已经能在 shared meeting owner 下贯穿到 `assign-duty`。
- `submitReviewWorkPlan(...)` 与紧随其后的 `assigned` 结果壳已经正式定性为宿主 settlement seam，不再作为默认继续共享化目标。
- `shared meeting 已激活时不再回落到 handleLegacyTempleReviewFallback(...)`，因此宿主 fallback 不再与 hosted covered path 并存为双 owner。
- Task C 下一批最该接的，已经进一步收窄为：`settleTempleReviewAssignmentTable(...)`、`createTemplePersonnelOrPraiseProjection(...)`、`createTemplePraiseProjection(...)` 这些 stage/settlement seam 的最终共享边界，而不是再动 `assigned`。

### Task B：keep 样板

目标非常明确：

- `keep review` 做成第一个完整“只认 shared meeting”的样板
- 继续删掉 keep 剩余 review-only legacy
- 保留普通帅府会见，不动 UI 壳

### Task C：temple 长链

目标不是再接入口，而是：

- 让 `reward / personnel / praise / situation / policy / advice / assign-duty / assigned` 这条长链继续从宿主 fallback 下放到 shared owner

### Task D：统一结算 owner

优先收口：

- reward
- personnel
- merit / membership / rank
- 委任结果回流 seam 的边界

### Task E：统一 authored owner

优先收口：

- temple reward / personnel / praise 相关 authored 内容
- 让 runtime pack 成为 canonical，builtin template / public mirror 持续同步

### Task F：legacy 清理

只在前面几项完成后做一次性集中清理，不再长期挂着第二套 owner。
