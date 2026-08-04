# merage-mod2ui-1 下一批执行队列

记录时间：2026-08-05

> 说明：这是一份 branch-local execution queue。
> 它用于把当前分支剩余主线拆成可直接接手的批次，不替代 `docs/superpowers/project-progress.md`，也不把多个独立子系统伪装成一个新的 canonical child。

## 当前判断

当前分支剩余工作跨三个独立子线：

1. `D` 评议系统收口
2. `B` 启动链统一收尾
3. `C` 剧本包源统一收尾

这三条线应按顺序推进，而不是混做：

- 先审计 `B`
- 再收 `C`
- `D` 按用户要求暂缓

原因：

- `B` 当前功能风险较低，但仍有 `B4/B5` 的完整链路闭环问题。
- `C` 已经进入 publication/sync 边界清点阶段，适合在前两条线收稳后集中收口。
- `D` 虽然 owner 文档最完整，但当前已被明确延后，不应再作为默认下一批。

## 执行顺序

### Batch 1: B 线 startup `B4/B5` 审计

**目标**

确认 startup 线到底还剩什么“真实 runtime drift”，把 `B4/B5` 从“主观未收口”变成“具体残留清单”。

**入口文档**

- `docs/superpowers/plans/2026-08-03-builtin-startup-scenario-pack-unification-plan.md`
- `docs/2026-08-05-merage-mod2ui-1-mainline-status.md`

**执行批次**

1. 逐条核对 plan 里 Phase 2 的 remaining problems。
2. 区分：
   - 已通过先前切片实质解决但未正式关账的项
   - 仍然存在真实 drift 的项
   - 已决定冻结、不再继续深入的项
3. 产出一份简短审计结论：继续开 startup 子切片，还是正式冻结 startup 行为。

**完成判据**

- `B4/B5` 不再停留在笼统状态。
- 明确是继续开工，还是可以把 startup 行为视为冻结。

**当前结果**

- `已完成`
- 结论：covered startup path 未复现新的 runtime drift；唯一暴露问题是一条仍指向旧 `main.ts` owner 形状的结构回归测试，已修正到 `startup-app-state-factory`。
- 后续动作：startup 线转为冻结观察，只有出现新的 runtime drift 再重开。

### Batch 2: C 线 source-unification 收尾清点

**目标**

继续只在 runtime/builtin/public/sync-tool 这一条线上清点 public publication drift，避免再把 temple/keep house runtime 改动混进 source-unification。

**入口文档**

- `docs/superpowers/plans/2026-08-03-scenario-pack-source-unification-plan.md`
- `docs/change-log.md`

**执行批次**

1. 盘点 public 默认模板里还存在的 publication-only authored 记录。
2. 区分：
   - 应继续做 projection contract 的 canonical 记录
   - 应保留为 publication layer 外层兼容的记录
   - 可以直接删除的旧镜像文件或键
3. 如果需要，再开一刀小的 projection/sync slice，但不回到 temple/keep runtime 逻辑。

**完成判据**

- public layer 的剩余差异变成明确清单，而不是隐性第三套 maintained pack。
- 下一步是“继续 projection”还是“冻结 publication layer”有清楚判断。

**当前进展**

- `已完成同类型批处理`
- 已把整组剩余 public-only authored event surface 一次性收回 builtin template：包括 26 条 template/home/temple.work events、对应 enter events，以及整份 public `event-bindings.json`。
- 已把同类型 support-data residual 也一并收回 builtin template：`menu-resources.json` 与 `house-module-defaults.json` 现都由 builtin template canonical 持有，grain-accounting / medicine-compounding 两条 city minigame 菜单入口也已重新纳入 public publication。
- 已把 pack manifest/public family 再往前收了一层：public 现发布 `playables.json`、`playable-shells.json`、`settlements.json`、`playable-integrations.json`，且 `temple-copy-scripture` 这条 integration 已通过 Script Editor importer/exporter 合同升级纳入 round-trip 闭环，不再需要 public omitted 特判。
- 已把 default template loader owner 也收了一层：Script Editor 的“使用模板”不再直接依赖 public `pack.json`，而是直接从 builtin template 资产构造默认项目；public URL 现主要服务发布层和兼容入口。
- 当前显式 residual boundary 已缩到 1 组：2 条 builtin-only failure_reward settlement 事件。
- 当前这类问题已不再需要继续按单个 building、单个 binding 或单个 support-data 文件切片；下一步应转去更高层的 publication-layer 保留策略，并判断这 2 条 builtin-only failure_reward settlement 事件是否还值得继续保留在 runtime/template-only 边界。

### Batch 3: D 线恢复入口

**目标**

评议系统当前按用户要求暂缓；只有在你明确恢复这条线时，才重新回到 temple review 剩余 seam。

**入口文档**

- `docs/superpowers/plans/2026-08-04-generic-meeting-review-module-plan.md`
- `docs/superpowers/specs/2026-08-04-review-owner-inventory.md`

**恢复位置**

- 从 temple 剩余 `reward / personnel / praise` seam 继续
- 不把 `assigned` 宿主 settlement seam 重新纳入 shared 化目标
- 恢复后再补定向测试与 plan 记账

## 交接规则

任何继续执行的人，先做下面三件事：

1. 先读 [docs/2026-08-05-merage-mod2ui-1-mainline-status.md](/Users/ms/Desktop/workspace/RPG_TG/docs/2026-08-05-merage-mod2ui-1-mainline-status.md:1)
2. 再按本队列选择当前批次
3. 最后打开对应 owner plan，而不是直接从 `project-progress.md` 开始误入旧 child

## 不要做的事

- 不要把 `D/B/C` 三条线混成一个新的 canonical child。
- 不要为了“顺手清理”把逻辑塞回 `src/main.ts`。
- 不要把 temple `assigned` 结果壳重新定义成 shared meeting 目标。
- 不要在 source-unification 批次里顺手改 temple/keep 的业务逻辑。
- 不要在 startup 审计批次里顺手重做 UI 或剧情顺序。
- 不要在未明确恢复前重新启动 `D` 线评议系统收口。

## 当前建议

如果下一步只做一件事，优先做 `Batch 2`。

原因：

- `Batch 1` 已完成，startup 线当前没有复现新的 runtime drift。
- 你已经明确要求先不处理评议系统。
- 因此最合理的下一步就是继续 source-unification 收尾，而不是重复进入 startup 审计。
