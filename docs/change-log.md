# 变更记录

## 2026-05-19

- 粮铺算账小游戏：累计答错 3 次立即结束并进入结算，HUD 显示剩余可错次数。
- 粮铺 UI：去掉顶部状态条；底部左对话框、右大立绘分开展示（无整体外框），左下角场景名称卡片。
- 将粮铺原型按四层架构接入主项目：`content` 配置、`domain/grain-shop` 类型、`application/grain-shop` 流程、`ui/views/house/grain-shop-house-view` 视图。
- 在库兰城新增房屋 `house.kulan.grain_shop`（粮铺）与掌柜角色 `char.kulan_grain_shopkeeper`。
- 主循环：地图 → 库兰城 → 粮铺 → 买卖/调查/算账小游戏 → 属性变化 → 返回城市。

用于持续记录项目结构、公共契约、功能能力和开发规则的变化。

## 2026-05-21 City NPC Pool Template

### Added
- 新建城市级 NPC 池领域模型：`src/domain/city-npc.ts`
- 新建城市 NPC 每日刷新与 House 选择器骨架：`src/application/city-npcs/*`
- 为库兰城补充城市共享 NPC 池样例，以及可承接流动 NPC 的茶馆模板
- 新建茶馆特殊 house 模块：`domain/tea-house`、`domain/house-modules/tea-house-session`、`application/house-modules/tea-house/*`、`ui/views/house/tea-house-house-view`
- 新建全局商品池与动态市场系统骨架：`content/markets/global-goods-pool.ts`、`domain/trade-good.ts`、`domain/market.ts`、`application/markets/*`

### Changed
- `GameState.runtime` 新增 `cityNpcPools`，用于统一保存“按城市共享、按日期刷新”的 NPC 位置与好感度运行态
- `GameState.runtime` 新增 `cityMarkets`，用于统一保存按城池、按商店类型刷新的商品库存与价格运行态
- `HouseDefinition` 新增可选 `activityLocationId`，用于声明某个 House 对应的城市活动地点槽位，而不是各自维护独立 NPC 池
- 普通 House 视图改为可叠加显示“固定驻场角色 + 当日流动城市 NPC”
- `HouseModuleId` 扩展为支持 `tea-house`，库兰城茶馆改为通过统一 registry 接入，而不是普通 House 静态展示
- 茶馆进入逻辑改为“固定老板 + 当日茶馆地点中至多 2 名城市流动 NPC”，并在模块内实现闲谈、请喝茶、打听消息、舌战四类交互
- `CityDefinition` 扩展为包含 `tags`、`prosperity`、`danger`、`specialDemand`，为市场权重与价格生成提供统一输入

### Impact
- 同一座城的流动 NPC 不再绑定到单个 House，而是通过城市共享池按日刷新，后续茶馆、酒馆、集市等地点都可复用同一模板
- NPC 位置在同一天内保持稳定，只会在日期变化后重新刷新，能更自然地营造“城里的人在流动”的感觉
- 茶馆现在成为第一个基于“城市共享 NPC 池 + 特殊 house 合同”实现的社交型屋舍，后续酒馆、道场、情报点可以沿同样模式扩展
- 后续粮铺、药铺、绸缎铺、铁匠铺、马市都可以通过同一市场系统获取“按城池特性与事件动态变化”的商品池与价格，而不必各自维护独立随机逻辑

## 记录规则

以下改动必须记录：

- 新增功能
- 删除功能
- 修改 `src/domain` 公共类型
- 修改 `src/application` / `src/ui` 的模块边界
- 修改内容配置格式
- 修改存档结构
- 修改事件触发规则
- 新增或调整样式分层规范
- 新建跨容器目录
- 修改“容器之外”的结构

这里的“容器之外”指：

- 新建或修改 `src` 一级目录
- 新建或修改 `docs` 一级规则文档
- 新增公共运行入口
- 新增跨模块共享服务

不强制记录的改动：

- 纯文案错字修正
- 不影响契约的小样式微调
- 局部实现细节重构且外部接口不变

## 模板

```md
## YYYY-MM-DD

### Added
- 新增了什么

### Changed
- 改了什么边界或结构

### Impact
- 对协作、配置、运行流程的影响
```

## 2026-05-19

### Added
- 新建项目基线文档：`architecture.md`、`collaboration.md`
- 新建领域模型骨架：地图、城市、房屋、角色、任务、事件、场景、全局 UI、游戏状态
- 新建样式分层骨架：`tokens.css`、`base.css`、`layout.css`、`components.css`、`views.css`
- 新建前端命名与拆分规范：`frontend-conventions.md`
- 新建游戏组件缺口清单：`game-component-inventory.md`
- 新建 lint / typecheck 规则：ESLint、Stylelint、TypeScript

### Changed
- 项目从空目录演进为按 `content / domain / application / ui / shared / styles` 分层的结构
- 事件系统从单纯 `scene -> action[]` 调整为 `event -> scene -> action[]`
- 房屋入口从 `onEnterSceneId` 改为 `onEnterEventId`
- 示例内容改为以事件为入口，而不是直接用场景驱动

### Impact
- 后续剧情、系统和 UI 开发开始围绕统一领域模型推进
- 模组覆盖和多人协作有了稳定 ID、边界和样式规范
- 事件触发和演出开始具备可持续扩展的结构

## 2026-05-19 Main Loop

### Added
- 新建 `effect-applier`，统一处理 flag、变量、任务、角色属性变化
- 新建 `scene-runner`，用于推进场景 action 执行
- 新建 `choice-resolver`，用于处理选择肢结果
- 新建 `game-store`，用于统一保存与推进 `GameState`
- 新建 `create-initial-state`，用于生成运行时初始状态
- 新建 `game-store-example`，用于跑通示例事件流程

### Changed
- 示例运行状态从内容文件内联假数据，改为通过状态工厂函数生成
- 项目从“可定义事件”推进到“可执行事件主循环”

### Impact
- 事件现在不只可声明，还能暂停、推进、选择、改状态
- UI 接入时可以直接读取 store 快照，不需要再从零设计执行模型

## 2026-05-19 Prototype Map

### Added
- 新建 Vite 前端运行入口：`index.html`、`src/main.ts`
- 新建地图移动原型内容：`prototype-world.ts`
- 新建地图移动命令：`travel-to-coordinate.ts`
- 新建城市进入命令：`enter-city.ts`
- 新建二次确认弹窗组件：`confirm-modal.ts`
- 新建地图视图与城市视图：`map-view.ts`、`city-view.ts`
- 新建原型样式文件：`prototype.css`
- 新建全局主角栏组件：`global-player-panel.ts`
- 新建角色详情全屏页：`character-detail-view.ts`
- 扩展人物数据结构：立绘差分、姓名年龄职位、人物简介、生卒年、体力、技能表
- 扩展全局 UI 状态：距离评定日期、主家任务

### Changed
- 项目从纯架构骨架推进到可交互页面原型
- 新增地图 -> 二次确认 -> 移动 -> 城市进入 -> house 展开的基础流程
- CSS 规则从单前缀模式调整为兼容 BEM 的命名，适配原型层的元素与修饰符

### Impact
- 现在可以直接在浏览器里验证网格移动与城市进入逻辑
- 后续地图、城市、house、事件 UI 可以在同一前端入口上继续迭代
- 原型层可以在不破坏规范的前提下使用 `block__element--modifier`
- 左上角主角栏已按目标布局接入原型
- 点击主角栏可进入全屏角色详情

## 2026-05-19 Character Detail Layout

### Changed
- 重构 `character-detail-view.ts`，将人物详情页整理为头部信息、左侧立绘与简介、右侧属性/装备/技能的全屏布局
- 调整 `prototype.css` 中的人物详情页样式，使其更接近目标原型，并补上关闭按钮样式
- 更新 `main.ts` 与 `game-store-example.ts` 的初始化数据，补齐 `cards` / `valuables` 输入，为人物详情提供据点、上司、装备等展示文本
- 修正 `create-initial-state.ts` 的类型输入方式，保证 lint 与 typecheck 正常运行

### Impact
- 人物详情页现在具备稳定的全屏展示结构，后续继续补按钮、贵重物、卡片时不需要再推翻页面骨架
- 项目当前 `typecheck`、`build`、`lint` 可以作为后续扩展前的基础校验线

## 2026-05-19 Inventory Overlay

### Added
- 新建卡库全屏视图：`src/ui/views/cards/card-library-view.ts`
- 新建贵重物全屏视图：`src/ui/views/valuables/valuable-library-view.ts`
- 新增卡库筛选状态、贵重物筛选/排序状态，以及武具装备槽位展示逻辑

### Changed
- `src/main.ts` 从独立的 `characterDetailOpen` 分支改为统一使用 `ui.overlayView` 驱动人物详情、卡库、贵重物三个浮层
- `src/domain/global-ui.ts` 扩展了卡库和贵重物列表的筛选/排序 UI 状态
- `src/domain/valuable-item.ts` 扩展了贵重物详情字段，为后续装备/业务逻辑保留余量
- `src/application/state/create-initial-state.ts` 补齐库存相关默认状态
- `src/application/navigation/enter-city.ts` 在进入城市时清理 overlay，避免地图浮层残留
- `src/ui/views/character/character-detail-view.ts` 的“卡 / 贵重品”按钮改为真实跳转库存页
- `src/styles/prototype.css` 新增统一的全屏藏品页布局样式

### Impact
- 角色详情、卡库、贵重物现在共用一套全屏浮层切换规则，后续新增日志页、任务页、背包页时可以直接复用
- 贵重物列表已经具备筛选、排序、详情展示和单槽装备的基础交互，后续只需继续补业务规则
- 全局主角栏到库存系统的用户路径已经打通，可直接在浏览器里验证交互

## 2026-05-20 Special House Contract

### Added
- 新建仓库级代理约束文件：`AGENTS.md`
- 新建特殊 `house` 接口规范：`docs/special-house-interface.md`

### Changed
- 将“新增 house 实例”明确设为一个强触发场景：任何代理在实现前都必须先展示并遵守特殊 house 接口合同
- 把特殊 house 的硬约束从分散的分层原则，收紧为可执行的架构规则：禁止在 `main.ts` 写具体 house 分支、禁止在 `application` 返回 HTML、禁止用全局变量保存 house 会话态、禁止在进入 house 时重置玩家基础属性

### Impact
- 以后任何人或代理再提“开发一个新的 house 实例”，都会先看到接口规范，而不是直接开始写特例代码
- 特殊 house 的接入方式从“约定俗成”升级为仓库级合同，便于多人协作和代码审查

## 2026-05-20 Demo Follow-up Plan

### Added
- 新建 2026-05-25 开发计划文档：`docs/development-plan-2026-05-25.md`

### Changed
- 明确 demo 阶段暂不做大规模拆分，但将 2026-05-25 设为结构收口节点
- 将后续工作聚焦为三项基础建设：特殊 `house` 接口、玩家运行态边界、存档结构

### Impact
- 后续开发从“继续堆 demo 功能”转为“先稳住接口，再扩功能”
- 团队可以按同一时间表准备 5 月 25 日之后的架构收口工作

## 2026-05-20 Grain Shop Refactor

### Added
- 新建特殊 house 共享领域契约：`src/domain/house-module.ts`
- 新建特殊 house 注册表：`src/application/house-modules/house-module-registry.ts`
- 新建粮行模块会话态与生命周期实现：`src/application/house-modules/grain-shop/*`

### Changed
- `src/domain/house.ts` 为 `HouseDefinition` 增加 `moduleId`，明确 house 的行为绑定不再依赖 `id` 字符串特判
- `src/domain/global-ui.ts` 与 `src/application/state/create-initial-state.ts` 增加统一 `ui.houseSession`，替代入口层游离的 house 会话全局变量
- `src/main.ts` 改为通用 `moduleId + registry` 分发，不再直接导入或分支处理粮行业务
- `src/ui/views/house/grain-shop-house-view.ts` 改为消费结构化 `HouseModuleViewModel`，保留全局 UI 覆盖层，场景切换不再重绘全局组件容器
- `src/application/grain-shop/init-grain-shop-session.ts` 停止在进入粮行时重置玩家金钱和算术
- 删除旧的粮行专用入口控制与旧会话 UI 类型：`src/application/grain-shop/grain-shop-interactions.ts`、`src/application/grain-shop/accounting-timer.ts`、`src/application/grain-shop/grain-shop-session-ui.ts`、`src/ui/views/house/grain-shop-ui-state.ts`

### Impact
- 粮行成为第一个严格走仓库 house 合同的特殊 house，实现了统一状态传递、统一会话存放、统一副作用调度
- 以后新增茶屋、道场、锻冶屋时可以直接按 `moduleId + registry + sessionState + viewModel` 方式接入
- `main.ts` 从“原型特例堆叠”收口为稳定入口，后续继续扩 house 时冲突会小很多

## 2026-05-20 Robustness Baseline

### Added
- 新建库存纯逻辑模块：`src/application/inventory/inventory-selection.ts`
- 新建最小纯逻辑测试基线：`tests/robustness.test.mjs`
- 新增测试构建配置与脚本：`tsconfig.test.json`、`npm test`

### Changed
- `src/domain/house-module.ts` 将 `houseSession` 从宽泛 `unknown` 收紧为按 `moduleId` 区分的联合类型
- 粮行 house 模块、主入口与粮行纯逻辑中的关键查找从静默兜底改为显式断言失败
- `eslint` 排除旧 `prototypes/**` 原型目录与 `.test-dist/**`，避免历史演示代码干扰主工程校验线

### Impact
- 后续 house 模块可以沿着 `moduleId -> sessionState` 的稳定契约扩展，不需要再在入口层做裸转型
- 内容配置缺失会更早暴露，避免运行时静默落到错误角色或错误房屋
- 项目现在具备最小可执行的纯逻辑回归线，可先守住粮行交易、算账结算、house session 和库存选择一致性
