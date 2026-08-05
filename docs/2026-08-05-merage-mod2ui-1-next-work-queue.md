# merage-mod2ui-1 下一批执行队列

记录时间：2026-08-05

> 说明：这是一份 branch-local execution queue。
> 它用于把当前分支剩余主线拆成可直接接手的批次，不替代 `docs/superpowers/project-progress.md`，也不把多个独立子系统伪装成一个新的 canonical child。

## 当前判断

当前分支剩余工作跨三个独立子线：

1. `D` 评议系统收口
2. `B` 启动链统一收尾
3. `C` 剧本包源统一收尾

这三条线在 2026-08-05 后半段已经重新排序：

- `B` 已冻结观察
- `C` 已进入 closeout / 文档同步
- `D` 已明确恢复，并在当前分支继续推进

原因：

- `B` 审计已经确认 covered startup path 未复现新的 runtime drift，当前不应继续默认开刀。
- `C` 代码和合同已基本收口，剩余主要是 closeout 和记账，不再是默认 runtime 主线。
- `D` 已恢复并连续推进多批 temple review seam convergence，当前离“只剩宿主 closeout 边界”最近。

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
- 已把生产代码里的默认模板 public URL 死引用也清掉：`main-ui-script-editor-module.js` 不再解构 `DEFAULT_SCRIPT_EDITOR_TEMPLATE_SCENARIO_PACK_URL`，当前只保留 `config.ts` 导出的打包入口常量和对应兼容测试。
- 已把 publication replacement 推到最终态：默认模板 URL 现只保留 `"/builtin-script-editor-templates/zhuyuanzhang/pack.json"`；legacy `"/script-editor-templates/zhuyuanzhang/pack.json"` URL seam 与对应兼容回归均已退役，不再作为当前仓库入口。
- 已把 asset/publication outlet 也推进到下一层：registered builtin publication 解析出的地图资产 URL 已切到 `"/builtin-script-editor-templates/zhuyuanzhang/assets/maps/**"`，且 sync tool 会自动同步这 10 个资产文件到对应 public outlet。
- 已把新的 replacement package 也真正落地：`public/builtin-script-editor-templates/zhuyuanzhang/**` 现在已补齐完整 manifest 文件族与 maps 资产，不再只是 registered manifest + outlet；对应目录导入 / runtime preview / temple meeting skeleton 合同回归也都已迁到这个新根。
- 已把同步语义与 physical root 一并收口：旧 `public/script-editor-templates/zhuyuanzhang/**` 不再作为 direct sync target，也不再作为 mirror target；sync tool 现在会把这个 legacy physical root 视为脏状态并在 `--write` 时递归删除。
- 因此当前 retirement audit 已经完成这一路 public 兼容退场：问题已经不再是“缺少替代自包含包”、也不再是 legacy URL alias 何时退场；现在剩余的是 `C4/C6/C7` 的双源共享规则、最终文档和 contract wording 收口。
- 当前 `C4` 的真实边界也已经从工具常量层明确下来：已冻结的共享同步现有 10 类
  `scenario-profile.json`、`characters.json`、`text-entries.json`、`activities.json`、`pack.json`、`cities.json`、`maps.json`、`events.json`、`city-entries.json`、`houses.json`。
- 这一轮又把最后 6 类 deferred/generic mapping family 全部推进成 shared projection sync
  `pack.json`、`cities.json`、`maps.json`、`events.json`、`city-entries.json`、`houses.json` 现在都已由 sync tool 执行 projection，而不再只是 deferred 记账项。
- 当前 deferred family 已清空，不再需要靠口头记忆
  当前 source-unification 已不存在仍停留在 deferred state 的 pack family。
- `pack.json` 当前已落实 shared/runtime-only/template-only file-key 边界；
  `cities.json` 当前已落实 shared fields、template-only editor fields 与 `houseIds` generic-template <-> runtime-concrete 映射边界；
  `maps.json` 当前已落实 runtime-canonical 2 条 shared map ids、3 条 runtime-only campaign 扩展字段，以及 3 条 template-preserved asset surface 字段；builtin template / public maps 已改为 runtime-first node/stats 内容 + template/public 自包含 asset surface；
  `events.json` 当前已落实 runtime-canonical 11 条 shared ids、38 条 template-only active event surface、以及 5 条 story event 的 template-format gap 边界；
  `city-entries.json` 当前已落实 template-only `kulan` building entries 与 leader-residence targetHouseId 映射边界。
- 最新审计确认 `houses.json` 不能按小范围 drift 处理，但也不需要默认和 `cities.json` 绑成同一刀：
  `houses.json` 自己就是 generic template houses / `home.template`
  对 runtime concrete houses / `home.<city>` / `home_001` 的独立映射问题。
- 这层独立边界现在已经写进 contract：
  generic template house ids、
  `house.kulan.temple` 这条 template concrete scenario house、
  runtime `home.` 前缀 / `home_001` 特例、
  以及 city-scoped house suffix 集都已固定。
- 这一轮已经把 `houses.json` 的双向 helper 一次补齐：
  `projectTemplateHousesForSync(...)` 会把 runtime concrete houses 折回 template houses，
  `projectRuntimeHousesForSync(...)` 会把 template generic houses 展开覆盖回现有 runtime concrete houses。
- 这两条 helper 都只覆盖 shared fields，并分别保留 template-only / runtime-only / pack-specific 字段；
  双向 `--check` 也已证明当前真实 `houses.json` 两侧都能被 projection 原样重建。
- 已顺手清掉一组真正无 owner 的 public 旧镜像：`house-content/home-house-content.json` 与 `house-content/keep-house-content.json` 不在 manifest、也没有消费方，现已从 public 发布层删除。
- 已继续按同类型清理 builtin template 侧同类残留：`src/modules/script-editor/builtin-templates/zhuyuanzhang/house-content/home-house-content.json` 与 `keep-house-content.json` 也不在 manifest、无消费方，现已删除。
- 已把这类清理升级成通用约束：public 与 builtin template 现在都由测试锁定为“只允许 manifest 文件 + maps 引用资产”，因此后续不会再悄悄长回同类历史垃圾文件。
- 当前显式 residual boundary 已清空。
- `maps.json` 这一刀也已经收口：
  template/public 的 `map.yuanmo_campaign` 不再继续保留 950 条 editor fort/resource/settlement surface，而是只承接 runtime 的 96 条 canonical node 集与 0 fort / 0 resource 统计；
  共享 settlement 节点仍优先落到 template 现有坐标锚点，运行时专属新增节点则保留 runtime 坐标，因此“内容以 runtime 为主、格式沿 template asset surface”已经真正落地。
- 当前这类问题已不再需要继续按单个 building、单个 binding、单个 support-data 文件，或单个 maps family 切片；source-unification 代码面当前只剩 closeout，不再有新的 family owner/mapping 待判。

### Batch 3: D 线恢复入口

**目标**

继续把 temple review 剩余 shared/host seam 压到只剩明确的宿主 closeout / settlement 边界，然后决定是否结束 generic meeting 收敛，切到下一个 runtime/event 迁移计划。

**入口文档**

- `docs/superpowers/plans/2026-08-04-generic-meeting-review-module-plan.md`
- `docs/superpowers/specs/2026-08-04-review-owner-inventory.md`

**当前进展**

- `已恢复并连续推进`
- 已完成的新增收口：
  - `advice -> assign-duty` follow-up projection helper
  - `assign-duty` action container helper
  - fallback `intro -> assignment-table` projection helper
  - 宿主 `assigned` settlement shell helper
  - fallback `praise / situation / policy / close-policy-panel` projection helper
- 当前边界：
  - `assigned` 宿主 settlement seam 仍保留为宿主 owner
  - 当前看起来只剩单路径 `finished/idle/root` closeout 需要确认是否仍值得继续抽

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

如果下一步只做一件事，优先决定“把当前 branch-local owner 状态切到 canonical progress”还是“正式打开下一条 runtime/event 迁移计划”。

原因：

- `Batch 1` 已完成，startup 线当前没有复现新的 runtime drift。
- `Batch 2` 当前也已完成到“代码与合同已收口”的状态。
- `Batch 3` 已恢复并推进到 temple review 仅剩少量宿主 closeout 判断。
- source-unification plan、generic meeting plan、主线状态快照与 change-log 当前都已经多次 checkpoint commit / push。
- 因此当前最合理的下一步，不再是继续开新的 startup/source-unification family，而是把已恢复的 `D` 线进展同步到更稳定的 owner 文档，或者直接衔接下一个 runtime/event 主线。
