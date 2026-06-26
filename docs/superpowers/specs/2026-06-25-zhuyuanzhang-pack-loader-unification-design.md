# `zhuyuanzhang` Pack 纯数据化与共享 Loader 统一设计

## 1. 背景

当前仓库中的 scenario pack 已出现两种形态：

- `liu-bang-pei-county-opening`
  - 仅包含 `pack.json` 与分表 JSON
  - 运行时通过通用 manifest hydrate 读取
- `zhuyuanzhang`
  - 目录结构已经接近标准 pack
  - 但仍依赖 `src/content/scenario-packs/zhuyuanzhang/base-content-pack.ts`
  - 该文件承担 JSON 装配、地图资源 hydration、scenario profile 导出三类职责

这会导致仓库长期处于“双轨制”：

- 标准 pack 走通用 loader
- 默认主剧本 pack 走专用 TypeScript 装配器

这与项目的 mod 化方向冲突。后续如果编辑器、导出器、团队规范都以“pack.json + 分表”作为标准输出，`zhuyuanzhang` 继续依赖 TS 装配器会成为例外，并迫使运行时持续保留特殊分支。

## 2. 目标

本次设计的目标是把 `zhuyuanzhang` 收敛为与 `liu-bang-pei-county-opening` 完全同构的纯数据 pack。

完成后必须满足以下约束：

- `src/content/scenario-packs/zhuyuanzhang/` 不再包含任何 `.ts` 装配文件
- 业务代码不再从 `src/content/scenario-packs/zhuyuanzhang/*.ts` 直接导入内容
- 默认主剧本内容与可切换 scenario pack 内容共用同一条加载链
- pack 内地图资源也作为数据描述的一部分，由共享 loader 解析
- scenario 列表不再通过 TS import 某个 pack 的 profile 常量来注册

## 3. 非目标

本次不处理以下内容：

- 不重写现有 `main.ts` 的整体启动流程
- 不重构 house module 生命周期
- 不改动剧情 DSL 设计
- 不重做 UI 层的 scenario 选择交互，只调整其数据来源
- 不要求一次性删空 `prototype-world.ts` 的所有遗留内容，但要让它不再承担 pack 内容装配职责

## 4. 目标形态

### 4.1 Pack 目录标准

`zhuyuanzhang/` 目录最终只允许存在以下类别文件：

- `pack.json`
- 各类分表 JSON
- pack 自己的静态资源文件

建议目录形态如下：

```text
src/content/scenario-packs/zhuyuanzhang/
  pack.json
  scenario-profile.json
  maps.json
  cities.json
  houses.json
  city-entries.json
  characters.json
  events.json
  scenes.json
  text-entries.json
  activities.json
  cards.json
  valuables.json
  city-npc-pools.json
  house-access-refusal-rules.json
  city-portraits.json
  historical-characters.json
  historical-city-rosters.json
  historical-character-id-map.json
  assets/
    maps/
      HD.png
      tie1.png
      yuanmo-map-regions.png
      yuanmo-map-heights.png
      yuanmo-map-ground-types.png
      yuanmo-map-trade-routes.png
      yuanmo-map-climates.png
```

约束：

- 不再保留 `base-content-pack.ts`
- 不再保留 pack 私有的 profile 导出常量
- 不再保留 pack 私有的资源映射表

### 4.2 Pack Manifest 标准

`pack.json` 继续作为 manifest 主表，只负责声明：

- pack 元信息
- 各分表文件路径

不允许在 manifest 中嵌入实际内容对象。

## 5. 共享 Loader 设计

### 5.1 统一目标

需要引入一个共享 `content-pack-loader`，作为所有 pack 内容装配的唯一入口。

输入：

- `pack.json` 的 URL 或可解析路径

输出：

- 完整 `ContentPackDefinition`

该 loader 负责：

- 读取 manifest
- 拉取所有声明的分表
- 组装为 `ContentPackDefinition`
- 解析 pack 相对资源路径
- 对地图资源字段做共享 hydration

### 5.2 统一边界

统一后，系统中不得再出现以下模式：

- 默认 base content 通过 TS 函数手工返回 `ContentPackDefinition`
- 某个 pack 通过私有 TS 装配器注入额外字段
- scenario 注册表直接 import 某个 pack 的 profile 常量

允许的唯一模式：

- 所有 pack 都从 manifest 进入
- 所有扩展字段都通过分表 JSON 声明
- 所有资源路径都通过共享 loader 解释

## 6. 地图资源设计

### 6.1 现状问题

当前 `zhuyuanzhang/base-content-pack.ts` 对 `maps.json` 做了专门 hydration：

- `imageAssetId` -> 真实图片 URL

这是当前最关键的 pack 私有逻辑。如果保留这层逻辑，`zhuyuanzhang` 永远无法和 `liu-bang` 同构。

### 6.2 新格式

`maps.json` 改为直接写相对资源路径，而不是写 `imageAssetId`。

示意：

```json
{
  "id": "map.yuanmo.main",
  "primaryImageUrl": "./assets/maps/HD.png",
  "regionOverlayImageUrl": "./assets/maps/yuanmo-map-regions.png",
  "layers": [
    {
      "id": "map_FE",
      "imageUrl": "./assets/maps/HD.png"
    }
  ]
}
```

### 6.3 Loader 规则

共享 loader 在读取 pack 时需要：

- 识别 `maps[*].primaryImageUrl`
- 识别 `maps[*].regionOverlayImageUrl`
- 识别 `maps[*].layers[*].imageUrl`
- 如果值是相对路径，则以 `pack.json` 所在目录为基准解析成最终 URL

这样地图资源仍是纯数据，不需要 pack 私有 TS。

## 7. Scenario 注册设计

### 7.1 现状问题

当前 `src/content/scenarios/scenario-profiles.ts` 仍直接引用 `zhuyuanzhangScenarioProfile`。

这意味着：

- scenario 列表依赖某个 pack 的 TS 导出
- pack 无法做到真正自描述

### 7.2 新方案

引入共享 catalog，例如：

```text
src/content/scenario-packs/catalog.json
```

catalog 每项只描述：

- `id`
- `title`
- `manifestPath`
- `description`
- `sort`
- `isDefault`

运行时先读取 catalog，再按 `manifestPath` 加载 pack。

### 7.3 约束

scenario 注册表不再维护某个 pack 的对象常量，只维护 catalog 数据或 catalog 加载结果。

## 8. 默认主剧本加载设计

### 8.1 现状问题

当前默认主剧本仍通过 `createBaseGameContentPack()` 返回内容对象，且内部直接拼接：

- `zhuyuanzhang` 各分表
- 历史人物映射
- 历史城市 roster

### 8.2 目标方案

默认主剧本也必须通过 manifest 加载。

推荐形态：

- catalog 中标记一个 `isDefault: true` 的 pack
- 启动时先加载该 default pack
- 得到完整 `ContentPackDefinition`

如果系统仍需要同步入口，可保留一个很薄的适配函数，但该函数只能做：

- “定位默认 manifest”
- “调用共享 loader”

不能再手工导入 pack 分表并自行组装对象。

## 9. 数据迁移要求

为了彻底删除 `base-content-pack.ts`，`zhuyuanzhang` 还需要补齐三类当前仍在外部装配的分表：

- `historical-characters.json`
- `historical-city-rosters.json`
- `historical-character-id-map.json`

迁移完成后，`zhuyuanzhang` pack 本身应能完整表达：

- 当前玩法内容
- 历史人物映射
- 城市历史 roster
- 地图资源链接

即：

- pack 自身可独立装配成完整 `ContentPackDefinition`
- 外层不再需要为它补字段

## 10. 实施顺序

### 阶段 1：补齐 pack 数据

- 将 `historicalCharacters` 下沉到 `zhuyuanzhang/historical-characters.json`
- 将 `historicalCityRosters` 下沉到 `zhuyuanzhang/historical-city-rosters.json`
- 将 `historicalCharacterIdByCharacterId` 下沉到 `zhuyuanzhang/historical-character-id-map.json`
- 更新 `pack.json`，把这三张表加入 manifest

完成标准：

- `zhuyuanzhang` 的 pack 数据不再依赖 `base-game-content-pack.ts` 为其补齐历史字段

### 阶段 2：统一地图资源格式

- 把 `maps.json` 中的 `imageAssetId` 迁移为相对路径 `imageUrl`
- 将 pack 依赖图片放入 `zhuyuanzhang/assets/maps/`
- 删除 pack 私有的图片 ID 映射逻辑

完成标准：

- `maps.json` 自身可被 loader 直接解释

### 阶段 3：提取共享 content pack loader

- 新建共享 loader
- 让 loader 读取 manifest 与所有分表
- 让 loader 在 hydrate 期间解析 map 资源相对路径
- 输出统一的 `ContentPackDefinition`

完成标准：

- `zhuyuanzhang` 与 `liu-bang` 都可经由同一 loader 输出完整内容对象

### 阶段 4：切换默认 base content 入口

- 默认内容装配改为“定位 default manifest -> 调用共享 loader”
- 停止调用 `createZhuyuanzhangBaseContentPackCore()`

完成标准：

- 默认主剧本不再通过 TS 手工拼装 pack 数据

### 阶段 5：切换 scenario 注册方式

- 引入 `catalog.json`
- 用 catalog 驱动 scenario 列表与 pack 选择
- 停止从 `scenario-profiles.ts` 直接 import 某个 pack profile

完成标准：

- scenario 注册层不再与 `zhuyuanzhang` 私有 TS 文件耦合

### 阶段 6：删除 pack 私有装配器

- 删除 `src/content/scenario-packs/zhuyuanzhang/base-content-pack.ts`
- 删除所有引用

完成标准：

- 仓库中不再存在 `zhuyuanzhang` pack 专用装配器

## 11. 验证要求

必须补充以下验证：

- `zhuyuanzhang/pack.json` 包含全部主表、分表、历史表
- `zhuyuanzhang` 不再有 `.ts` 装配入口参与内容加载
- 默认主剧本与 `liu-bang` pack 都能经同一 loader 正常装配
- 地图资源 URL 能从 pack 相对路径正确解析
- scenario 列表可在不 import pack TS 的情况下正常显示
- 全量 `typecheck` 通过
- 全量测试通过

建议新增回归测试：

- 禁止默认 pack 内容装配 import `zhuyuanzhang/base-content-pack`
- 禁止 `scenario-profiles.ts` import 某个 pack 私有 profile 常量
- 禁止 `scenario-packs/zhuyuanzhang/` 目录存在参与装配的 `.ts` 文件

## 12. 风险与处理

### 12.1 风险：默认内容改为异步加载

如果共享 loader 是异步的，而当前默认内容初始化链是同步的，启动链可能需要引入异步边界。

处理：

- 优先允许默认内容入口异步化
- 如果短期必须兼容同步调用，则用极薄的同步资源索引层做过渡，但不能回退到 pack 私有装配器

### 12.2 风险：地图资源路径在测试环境与浏览器环境不一致

处理：

- 共享 loader 统一做路径解析
- 测试只验证路径解析结果的格式和可定位性，不依赖浏览器 DOM

### 12.3 风险：历史人物数据仍被其他旧模块直接消费

处理：

- 迁移前先扫引用
- 允许旧模块继续消费 `ActiveGameContent` 中的历史字段
- 不允许旧模块再直接从 `prototype-world.ts` 或旧表文件读取 pack 语义数据

## 13. 完成定义

满足以下条件即视为本设计完成落地：

- `zhuyuanzhang` 与 `liu-bang-pei-county-opening` 都是纯 manifest + JSON 分表 pack
- 默认主剧本与可切换剧本共用同一内容装配机制
- 地图资源解析由共享 loader 处理
- scenario 注册由 catalog 驱动
- `zhuyuanzhang/base-content-pack.ts` 已删除
- 运行时不再通过 TS import 方式获取 `zhuyuanzhang` pack 内容
