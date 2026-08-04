# merage-mod2ui-1 主线状态快照

记录时间：2026-08-05

> 说明：这是一份分支本地进度快照，用于汇总当前会话主线、分支真实任务状态与建议优先级。
> 它**不是** `docs/superpowers/project-progress.md` 的替代品，也**不是** canonical resume truth。

## 当前分支事实

- 当前分支：`merage-mod2ui-1`
- 当前本地与远程关系：相对 `origin/merage-mod2ui-1` 为 `ahead 0 / behind 0`
- 当前工作区状态：存在未跟踪文件 `.codex/config.toml`

## 当前真实 owner 文档

当前分支的真实进行中任务，与 canonical `project-progress` 记录并不一致。

- `docs/superpowers/project-progress.md`
  - 当前仍停留在 `2026-07-28 Campaign Hex Runtime Grid Architecture`
  - 这反映的是历史 canonical child，不是当前分支真实主线
- 当前分支最接近真实执行状态的 owner 文档：
  - `docs/superpowers/plans/2026-08-04-generic-meeting-review-module-plan.md`
  - `docs/superpowers/plans/2026-08-03-post-merge-stabilization-plan.md`
  - `docs/superpowers/plans/2026-08-03-builtin-startup-scenario-pack-unification-plan.md`
  - `docs/superpowers/plans/2026-08-03-scenario-pack-source-unification-plan.md`

## 主线汇总

### A. 合并 mod-first-dev 到当前分支

- A1. 创建当前工作分支并切换、推送：`已完成`
- A2. 合入 `mod-first-dev`：`已完成`
- A3. 保留当前 UI / 功能 / 剧情顺序的冲突处理：`首轮已完成`
- A4. merge 冲突点、修改点、后续处理文档：`已完成基础记录，后续持续补充`

判断：

- A 线作为“合并与首轮稳定化”主线，已经基本收口。
- 当前剩余动作主要是文档同步，而不是继续做 merge 本身。

### B. 启动链统一

- B1. “开始游戏”和“运行预览”是两条不同启动链：`已完成`
- B2. “开始游戏”接入 scenario-pack 启动缝：`已完成第一阶段`
- B3. 保持当前 UI、功能、角色选择顺序不变：`已完成当前阶段要求`
- B4. 统一 startup request / startup context / follow-up owner：`经 2026-08-05 审计，covered path 未复现活动 drift；当前冻结观察`
- B5. “开始游戏”和“运行预览”真正走同一条完整启动链：`经 2026-08-05 定向验证，covered path 已基本对齐；如无新 drift，当前按冻结处理`

判断：

- B 线已经做完结构抽离、owner 下沉和一轮 branch-local 审计。
- 当前没有复现新的 startup runtime drift；新增暴露的问题只是一条跟不上 owner 抽离的结构回归测试，而不是行为问题。
- 在没有新 drift 证据前，startup 行为应视为冻结，后续优先级可降到 source-unification 之后。

### C. 剧本包源统一

- C1. 识别三处剧本包源：`已完成`
- C2. 建立源统一计划：`已完成`
- C3. meeting/runtime 相关合同与加载链落地：`已完成`
- C4. 共享文件白名单、共享字段 / 专属覆盖规则：`部分完成`
- C5. 删除 public 旧镜像中的多余旧文件：`部分完成`
- C6. 最终只保留两个剧本包并保持双向同步：`目标明确，未完成`
- C7. runtime 源 / builtin 源 / template 源 最终收口：`未完成`

判断：

- C 线已经完成“识别、建模、第一批合同落地”。
- public authored event / dialogue / event-binding 这一整类 residual surface 已按同类型批处理方式整组收回 builtin template，第三套手维护树在这类文件上基本退出。
- public `menu-resources.json` / `house-module-defaults.json` 这组 support-data 也已整组收回 builtin template；此前 `menu-resource.city.default` 下对 2 个 minigame 入口的 public 过滤也已收掉，当前 public menu-resources 已与 builtin template 对齐。
- public manifest 也已进一步收口到安全子集：`playables.json`、`playable-shells.json`、`settlements.json`、`playable-integrations.json` 现都已对外发布并由 builtin template 派生；其中 `temple-copy-scripture` 原先的单条 omitted integration 已通过 Script Editor importer/exporter 合同升级收口，不再需要 public 特判过滤。
- Script Editor 的默认模板导入入口也已从 public URL owner 脱离，当前“使用模板”直接走 builtin template asset loader；public `pack.json` 现主要保留为发布层和兼容入口。
- 当前显式 residual boundary 已只剩 2 条 builtin-only failure_reward settlement 事件；卡点已不再是单个 JSON authored/support-data 文件，而在三源压缩与 public 发布层长期保留策略的更高层收口。

### D. 评议系统收口

- D1. owner 冻结与范围盘点：`已完成`
- D2. keep review 收口到 shared meeting：`已完成`
- D3. temple review 长链收口：`进行中`
- D4. reward / personnel / praise 等阶段 owner 收口：`未完成`
- D5. 评议 authored 内容继续下放到剧本包 / shared runtime：`未完成`
- D6. legacy fallback 清理与全链路验收：`未完成`

判断：

- D 线仍是当前分支里未收口体量最大的一条历史主线，但本轮执行已按用户要求暂停，不作为当前推进方向。
- 当前已确认 keep hosted review 不再保留第二套正式 owner。
- temple hosted covered path 已推进到 `assign-duty`，但 reward / personnel / praise / no-meeting fallback / authored 下放 / 全链路验收仍未收口。
- temple `assigned` 结果壳已明确归类为宿主 settlement seam，不再作为默认 shared 化目标。

### E. 寺庙相关机制按 mod / 剧本包框架收口

- E1. 地图进入城市无反应修复：`已处理`
- E2. 寺庙评定链与 shared meeting 对接：`并入 D 线持续推进`
- E3. 寺庙长链是否抽通用评定机制的设计讨论：`已讨论，未独立拆模块`
- E4. 寺庙层 legacy 继续移除：`未完成`

判断：

- E 线当前不再是独立主线，实质上已经并入 D 线。
- 后续若继续推进，应按“temple review owner 收口”处理，而不是再单开寺庙特判主线。

### F. 配套任务

- F1. 运行项目、构建、定向测试：`多轮已执行`
- F2. 提交与推送阶段性成果：`已多次执行`
- F3. 子 agent 检查与清理：`已完成`
- F4. 文档同步：`持续进行中`

判断：

- F 线不是阻塞主线，但文档同步明显落后于当前分支真实状态。
- 特别是 canonical `project-progress` 与当前分支真实 owner 已发生偏移。

## 当前优先级

### P1

- C. 剧本包源统一
  - 重点是 default template loader、public publication 边界、旧镜像删除、最终双源收口

### P2

- B. 启动链统一
  - 当前按冻结观察处理
  - 只有在复现新的 runtime drift 时，才再开 startup 子切片

### P3

- D. 评议系统收口
  - 当前按用户要求延后，不作为下一批执行目标
  - 后续恢复时，仍从 temple 剩余 reward / personnel / praise seam 开始

### 持续项

- F4. 文档同步
  - merge ledger
  - startup/source-unification/review 相关计划与变更日志
  - 必要时再决定是否把 canonical `project-progress` 正式切到当前分支真实主线

## 下一批建议执行顺序

1. 回到 startup 统一，专门审计 `B4/B5` 还未统一的 request/context/follow-up owner。
2. startup 审计已完成；在没有新 drift 前，将 startup 行为视为冻结。
3. 进入 scenario-pack source unification，把三源减少到明确的双源模型。
4. 评议系统收口暂缓；只有在你重新恢复这条线时，再回到 temple review 剩余 seam。
5. 在上述任一主线收口到 `completed-but-open` 时，同步治理文档，避免继续出现 canonical 进度与分支真实状态漂移。

## 对应执行队列

- 详见 `docs/2026-08-05-merage-mod2ui-1-next-work-queue.md`
