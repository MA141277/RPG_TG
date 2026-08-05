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
- C4. 共享文件白名单、共享字段 / 专属覆盖规则：`已完成当前阶段收口`
- C5. 删除 public 旧镜像中的多余旧文件：`当前阶段已完成`
- C6. 最终只保留两个剧本包并保持双向同步：`双源 + 单发布包模型已落地，后续仅剩文档关账`
- C7. runtime 源 / builtin 源 / template 源 最终收口：`代码与合同已基本收口，后续仅剩文档同步`

判断：

- C 线已经完成“识别、建模、第一批合同落地”。
- 当前 `C4` 已不再是“模糊的部分完成”：sync contract 已明确冻结 10 条共享同步规则
  `scenario-profile.json` = 全文件替换，`characters.json` = 启动期角色投影，`text-entries.json` = shared-key overlay，`activities.json` = shared-id overlay，`pack.json` = pack-manifest-projection，`cities.json` = city-projection，`maps.json` = map-projection，`events.json` = event-projection，`city-entries.json` = city-entry-projection，`houses.json` = house-projection。
- 最新一轮已把 6 类 deferred/generic mapping family 正式转成 shared projection sync
  `pack.json` = pack-manifest-projection，`cities.json` = city-projection，`maps.json` = map-projection，`events.json` = event-projection，`city-entries.json` = city-entry-projection，`houses.json` = house-projection。
- 当前 remaining deferred 文件规则已清空
  当前 source-unification 已不存在仍停留在 deferred state 的 pack family。
- 其中 `pack.json` 已明确拆成 shared file keys、runtime-only file keys、template-only file keys，并已进入 sync tool 的 runtime/template/public projection；
  `cities.json` 已明确拆成 shared fields、template-only editor fields，以及 `houseIds` 的 generic-template <-> runtime-concrete 映射，并已进入 sync tool 的 runtime/template projection；
  `maps.json` 当前已明确拆成 2 条 runtime-canonical map ids、3 条 runtime-only campaign 扩展字段（`campaignHexGridUrl`、`campaignVegetationRulesUrl`、`campaignStructureProfileId`），以及 3 条 template-preserved asset surface 字段（`layers`、`primaryImageUrl`、`regionOverlayImageUrl`）；builtin template / public maps 现都按 runtime-first node/stats 内容投影，同时保留 template/public 自包含 asset surface；
  `events.json` 当前也已明确拆成 runtime-canonical 的 11 条 shared 事件、仍被 template `event-bindings` / runtime `menu-resources` 消费的 38 条 template-only 事件，以及仅存在于 5 条 story 事件上的 template-format gap，并已进入 runtime -> template projection；
  `city-entries.json` 也已明确拆成 template-only 的 `kulan` building entries，以及 leader-residence 的 generic-template -> runtime-city-specific targetHouseId 映射，并已进入 sync tool 的 runtime/template projection。
- `maps.json` 这一轮又把最后一类重对象 family 收口掉了：
  template/public 的 `map.yuanmo_campaign` 不再保留 950 条 editor fort/resource/settlement surface，而是改为只承接 runtime 的 96 条 canonical node 集与 0 fort / 0 resource 统计；
  共享 settlement 节点仍优先落到 template 现有坐标锚点，运行时专属新增节点则保留 runtime 坐标，因此“内容以 runtime 为主、格式沿 template asset surface”已经真正落地。
- 新一轮审计还进一步确认：`houses.json` 不能再被当作单文件小 drift 处理。
  模板包是少量 generic template houses + `home.template`，
  runtime 包是按城市展开的 concrete houses + `home.<city>` / `home_001`。
  因此后续应先把 `houses.json` 自己的 generic-template -> runtime-concrete 映射合同单独收口，而不是默认并入 `cities.json` 同一刀。
- 这条独立边界现已下沉到 source contract：generic template house ids、唯一的 template concrete scenario house、runtime `home.` 前缀 / `home_001` 特例、以及 city-scoped house suffix 集都已经有机器可读常量锁住。
- 在此基础上，`houses.json` 现已具备双向 asymmetric projection helper：
  `projectTemplateHousesForSync(...)` 会按 house id 映射把 runtime concrete houses 折回 template houses，只覆盖 shared fields，并保留 template-only 的 `menuInstanceIds` 与 pack-specific 字段；
  `projectRuntimeHousesForSync(...)` 则会把 template generic houses 展开覆盖回现有 runtime concrete houses，只覆盖 shared fields，并保留 runtime-only 的 `onEnterEventId` 与 pack-specific 字段。
- 双向 `--check` 已证明当前真实 runtime/template/public 文件全部处于已对齐状态；
  这意味着 `houses.json` 已不再是 deferred family，而是已经进入 sync tool 的可执行 projection 合同。
- public authored event / dialogue / event-binding 这一整类 residual surface 已按同类型批处理方式整组收回 builtin template，第三套手维护树在这类文件上基本退出。
- public `menu-resources.json` / `house-module-defaults.json` 这组 support-data 也已整组收回 builtin template；此前 `menu-resource.city.default` 下对 2 个 minigame 入口的 public 过滤也已收掉，当前 public menu-resources 已与 builtin template 对齐。
- public manifest 也已进一步收口到安全子集：`playables.json`、`playable-shells.json`、`settlements.json`、`playable-integrations.json` 现都已对外发布并由 builtin template 派生；其中 `temple-copy-scripture` 原先的单条 omitted integration 已通过 Script Editor importer/exporter 合同升级收口，不再需要 public 特判过滤。
- Script Editor 的默认模板导入入口也已从 public URL owner 脱离，当前“使用模板”直接走 builtin template asset loader；public `pack.json` 现主要保留为发布层和兼容入口。
- 继续向上审计后，Script Editor 主 UI 模块里对 `DEFAULT_SCRIPT_EDITOR_TEMPLATE_SCENARIO_PACK_URL` 的最后一条生产代码死引用也已清掉；当前这个常量只再停留在 `config.ts` 的导出和对应兼容测试中。
- publication replacement 第一阶段已进一步收口到最终态：默认模板 URL 现只保留 `"/builtin-script-editor-templates/zhuyuanzhang/pack.json"`；legacy public manifest URL `"/script-editor-templates/zhuyuanzhang/pack.json"` 的 registered seam 与兼容回归都已退役，不再作为当前仓库支持入口。
- publication replacement 第二阶段也已落地：registered builtin publication 当前解析出的地图资产 URL 已切到 `"/builtin-script-editor-templates/zhuyuanzhang/assets/maps/**"`，并由 sync tool 自动同步 10 个资产文件到新的 public outlet；这条 registered seam 已不再借旧 `script-editor-templates/zhuyuanzhang/assets/maps/**`。
- publication replacement 第三阶段也已落地：`public/builtin-script-editor-templates/zhuyuanzhang/**` 现在已由 sync tool 补齐成完整自包含发布包，不再只是 registered manifest + maps outlet；`maps.json`、`meetings.json`、`meeting-*`、`cities.json`、`houses.json`、`city-entries.json`、`menu-instances.json`、`cards.json`、`valuables.json`、`historical-*`、`portraits*.json` 等整套 manifest 文件族都已随同新根生成。
- 对应地，Script Editor 目录导入 / runtime preview / temple meeting skeleton / source-unification 这批回归现在都已迁到 `public/builtin-script-editor-templates/zhuyuanzhang/**` 验证，说明新根已经具备替代旧目录导入包的技术形态。
- 最新 contract/sync 收口又前进了一层：旧 `public/script-editor-templates/zhuyuanzhang/**` physical root 已从仓库中删除，不再是 direct sync target，也不再保留实体镜像；对应 legacy `"/script-editor-templates/zhuyuanzhang/pack.json"` 入口也已随同退役。
- 因此这轮 retirement audit 的结论已经推进到最终态：仓库里只剩 `public/builtin-script-editor-templates/zhuyuanzhang/**` 这一棵真实 public self-contained package；旧 public 树和旧 manifest URL 都不再承担运行中的 compatibility 职责。
- 同时，public 目录里两份未进入 manifest、也没有任何消费方的 `house-content/*.json` 历史镜像已删除，说明 `C5` 当前剩余问题更多是 publication policy，而不是这类无 owner 垃圾文件。
- 进一步同类审计后，builtin template 侧两份同样未进入 manifest、也没有任何 Script Editor / sync / preview 消费方的 `house-content/*.json` 旧镜像也已删除；当前 maintained packs 里这类无 owner house-content 残留已清空。
- 当前 `public/script-editor-templates/zhuyuanzhang/**` 与 `src/modules/script-editor/builtin-templates/zhuyuanzhang/**` 都已达到“只剩 manifest 文件 + maps 引用资产”的干净态，并已有通用回归锁住；同类问题下一步只可能再出现在 runtime pack 的 intentional extra asset / pack-content owner 上，而不是 public / builtin template 的历史垃圾文件上。
- 当前显式 residual boundary 已清空；卡点已不再是任何未合同化 JSON family，也不再是 legacy public URL 的保留策略。
- `C4` 代码面当前已完成，`C6/C7` 也已经进入“文档与治理关账”阶段；如果继续推进 source-unification，下一步应主要落在 owner 文档同步、阶段性提交与最终 closeout，而不是再开新的数据 family 切片。

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
- F4. 文档同步：`当前批次已同步到 source-unification closeout / startup freeze / branch-local queue`

判断：

- F 线当前已把 source-unification / startup 冻结 / branch-local queue 同步到最新状态。
- 当前剩余的治理差异主要只剩 canonical `project-progress` 仍停留在历史 child，以及这一批未形成正式 checkpoint commit/push。

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
5. 当前更合理的下一步是先把这批 branch-local closeout review / commit / push；只有在恢复 `D` 线或决定切换 canonical child 时，才再处理 `project-progress`。

## 对应执行队列

- 详见 `docs/2026-08-05-merage-mod2ui-1-next-work-queue.md`
