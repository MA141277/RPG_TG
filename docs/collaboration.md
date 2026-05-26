# 协作规范

## 1. 文件职责

- `src/domain/*`：只放类型、枚举、领域辅助函数
- `src/content/*`：只放配置数据和脚本内容
- `src/styles/*`：只放样式，不夹带业务逻辑说明
- `docs/*`：架构、协作和玩法设计

## 2. ID 规范

所有可引用对象都必须使用字符串 ID：

- `map.kyoto`
- `city.gifu`
- `house.gifu.castle`
- `char.oda_nobunaga`
- `scene.gifu.council_001`
- `mission.unify_mino`

禁止依赖数组下标当作业务身份。

## 3. 数据写法

- 配置对象优先显式字段，不省略关键语义
- 能用 ID 引用时，不做深层对象嵌套复制
- 文本脚本、规则参数、跳转目标全部写明字段名

## 4. 代码规范

- 领域层优先纯函数
- 页面层不直接改共享状态，统一走 action / command
- 新增枚举时，同时补默认分支处理
- 每个模块导出单一责任，不做万能工具箱

## 5. 事件脚本规范

Action 脚本按顺序执行，单节点单职责：

- 一个节点只做一件事
- 需要条件时显式写 `condition`
- 需要跳转时显式写 `nextSceneId` 或 `target`
- 需要改数值时走 `effect`

## 6. 事件定义规范

事件必须拆成两层：

- `EventDefinition`：触发元数据
- `SceneDefinition`：演出脚本

每个事件必须明确写出：

- `id`
- `chapterId`
- `occurrence`
- `trigger`
- `conditions`
- `entrySceneId`

禁止在页面组件里私自补这些判断。

### 触发规则约束

- `trigger` 只写“何时检查”
- `conditions` 只写“是否满足”
- `participants` 只写“谁必须到场”
- 同时机多事件必须有 `priority`
- 需要前置事件时，显式写 `event-fired`
- 需要时间间隔时，显式写 `months-since-event`

### 事件命名建议

- `event.gifu.council_001`
- `event.oda.honnouji_001`
- `event.toyotomi.main_010`

`scene` 和 `event` 不混用同一命名空间。

## 7. CSS 规范

- 禁止把页面样式、组件样式、工具类写在同一个文件
- 颜色、边距、字号必须优先复用 token
- 组件内部样式不依赖页面 DOM 层级过深选择器
- 状态类统一 `is-*` / `has-*`

## 8. 官方兼容预留

如果未来要提供“导出成类官方脚本”的工具链，需要遵守：

- 内容配置保持纯数据
- 每个对象都能稳定序列化
- 文本、条件、跳转、效果分字段保存
- 不依赖数组顺序推导业务含义
- 不依赖 JS 闭包保存上下文

## 9. 提交流程建议

建议按功能分支推进：

- `feature/map-navigation`
- `feature/city-house-flow`
- `feature/action-runner`
- `feature/global-ui`

每次合并至少回答三个问题：

1. 改了哪个模块边界？
2. 是否新增了公共类型？
3. 是否影响内容配置格式？

## 10. 变更记录要求

所有重要改动必须同步记录到：

- [change-log.md](D:/RPG_TG/docs/change-log.md)
- [ui-layout-alignment-workflow.md](D:/RPG_TG/docs/ui-layout-alignment-workflow.md)：当改动涉及 UI 布局对齐协作方式、复制参数格式或默认布局回写流程时，先对齐这份文档

必须记录的改动：

- 新增功能
- 修改 `domain` 公共类型
- 修改 `application` / `ui` / `content` 的模块边界
- 修改事件规则
- 修改内容配置格式
- 修改样式分层规范
- 新建一级目录
- 修改容器之外的结构

最低记录内容：

1. 新增了什么
2. 改了什么
3. 影响了什么协作边界或运行流程

如果只是容器内的小实现细节调整，且不影响对外契约，可以不记。
