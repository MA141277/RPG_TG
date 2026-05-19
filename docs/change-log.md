# 变更记录

## 2026-05-19

- 粮铺算账小游戏：累计答错 3 次立即结束并进入结算，HUD 显示剩余可错次数。
- 粮铺 UI：去掉顶部状态条；底部左对话框、右大立绘分开展示（无整体外框），左下角场景名称卡片。
- 将粮铺原型按四层架构接入主项目：`content` 配置、`domain/grain-shop` 类型、`application/grain-shop` 流程、`ui/views/house/grain-shop-house-view` 视图。
- 在库兰城新增房屋 `house.kulan.grain_shop`（粮铺）与掌柜角色 `char.kulan_grain_shopkeeper`。
- 主循环：地图 → 库兰城 → 粮铺 → 买卖/调查/算账小游戏 → 属性变化 → 返回城市。

用于持续记录项目结构、公共契约、功能能力和开发规则的变化。

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
