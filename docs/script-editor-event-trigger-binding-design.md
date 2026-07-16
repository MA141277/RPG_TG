# 剧本编辑器事件触发绑定设计

## 目标

剧本编辑器里的事件应从“触发规则 + 条件 + 内容”混合体，调整为可复用的内容单元。事件本体只描述被触发后发生什么；人物、城市、建筑、对话、小游戏、剧情、时间、菜单等入口负责定义什么时候触发、在什么条件下触发、触发哪个事件。

```text
触发点 / 绑定关系 = 何时检查 + 在哪里检查 + 条件 + 优先级 + eventId
事件本体 = 事件内容 + 参与者 + 场景入口 + 效果/任务输入 + 后续事件
```

同一个事件可以被多个入口复用。例如“朱元璋遇见汤和”可以由人物对话触发，也可以由城市进入触发，两者使用同一个事件内容，但绑定条件不同。

## 数据分层

### `events.json`

事件本体表。只保存事件执行内容，不保存触发条件。

推荐字段：

```ts
type EventDefinition = {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  chapterId?: string;
  participants?: string[];
  entrySceneId?: string;
  actions?: EventAction[];
  effects?: EventEffect[];
  nextEventId?: string;
  occurrence?: EventOccurrence;
};
```

事件本体不应保存：

- `triggerTiming`
- `conditionGroups`
- 城市/建筑/人物等触发来源字段
- 只有某个入口才成立的条件

### `event-bindings.json`

新增事件绑定表。每条绑定表达“某个入口在某个时机满足条件后触发某个事件”。

```ts
type EventBinding = {
  id: string;
  eventId: string;
  owner: EventBindingOwner;
  trigger: EventBindingTrigger;
  conditions?: EventBindingConditionGroup;
  priority?: number;
  enabled?: boolean;
  meta?: Record<string, unknown>;
};

type EventBindingOwner = {
  family: EventBindingOwnerFamily;
  id?: string;
  extra?: Record<string, unknown>;
};

type EventBindingTrigger = {
  timing: string;
  action: string;
  payloadSchemaId?: string;
  extra?: Record<string, unknown>;
};
```

第一阶段核心 owner family：

- `person`
- `city`
- `building`
- `dialogue`
- `minigame`
- `storyNode`
- `time`
- `menuEntry`

### 绑定字段分层与扩展性

`EventBinding` 不应把未来所有业务字段一次性堆进固定结构。绑定字段需要像人物扩展属性一样分层：

1. 核心必选字段
   - `id`
   - `eventId`
   - `owner.family`
   - `trigger.timing`
   - `trigger.action`
   - `enabled`
   - `priority`

2. 可注册扩展字段
   - `owner.id`
   - `owner.extra`
   - `trigger.payloadSchemaId`
   - `trigger.extra`
   - `conditions`
   - `payload` 中可被 resolver 读取的字段

3. 编辑器草稿扩展字段
   - `meta`
   - 未注册的 `extra` 字段
   - 暂未能 lowering 到 runtime 的 UI 草稿字段

扩展规则：

- `owner.family`、`trigger.timing`、`trigger.action` 是可注册枚举，不是无限自由文本。
- UI 默认只展示注册表中已知字段。
- 未注册字段可以在编辑器草稿中保留，但导出可运行包时必须 fail closed 或明确 lowering 到已注册字段。
- runtime 只能消费注册表、payload schema 与 resolver 明确支持的字段。
- 新增事件入口能力时，优先注册 owner family、trigger timing/action、payload schema、字段 resolver，而不是修改事件本体结构。

## 下拉选择与条件表达式导出

所有涉及选择事件的位置，都必须使用下拉选择器或可搜索选择器，不允许把手写 `eventId` 作为主要编辑方式。

适用位置：

- 人物事件绑定
- 城市事件绑定
- 建筑事件绑定
- 对话事件绑定
- 小游戏事件绑定
- 剧情节点事件绑定
- 时间事件绑定
- 菜单事件绑定
- 后续事件 `nextEventId`
- 对话 `followUps` 中跳转到事件的目标
- 迁移工具中选择目标事件

事件下拉项至少显示：

```text
事件标题
eventId
所属章节
标签
是否有入口场景
校验状态
```

所有条件判断中的对象、字段、操作符和值，也必须尽量使用下拉或级联下拉。作者不应凭空填写运行时字段路径。

条件编辑器推荐使用级联选择：

```text
条件类型 -> 对象来源 -> 属性来源 -> 属性字段 -> 操作符 -> 值
```

例如人物条件：

```text
条件类型：人物属性
角色来源：主角 / 当前 NPC / 触发者 / 指定人物
属性来源：基础属性 / 扩展属性 / 身份字段 / 状态字段
属性字段：武力 / 智谋 / 政务 / reputation.local.kulan / occupation
操作符：>= / == / != / contains
值：输入或下拉
```

城市条件：

```text
条件类型：城市属性
城市来源：当前城市 / 指定城市
属性来源：基础属性 / 扩展属性 / 状态字段
属性字段：prosperity / danger / ownerFactionId / 自定义 key
操作符：>= / == / !=
值：输入或下拉
```

建筑、对话、小游戏、剧情节点、时间、菜单项和后续扩展系统也按同一模式处理：先选对象类型和对象来源，再选可判断字段。

编辑器需要维护可选字段注册表：

```ts
type ConditionFieldOption = {
  label: string;
  path: string;
  valueType: "string" | "number" | "boolean" | "enum" | "date";
  enumOptions?: Array<{ label: string; value: string }>;
  sourceFamily:
    | "character"
    | "city"
    | "building"
    | "dialogue"
    | "minigame"
    | "storyNode"
    | "time"
    | "menuEntry"
    | "payload"
    | "custom";
};
```

人物字段注册示例：

```text
baseAttributes.force
baseAttributes.intelligence
baseAttributes.politics
profile.occupation
profile.cityId
extendedAttributes.reputation.local.kulan
runtime.status.available
```

UI 可以按业务类型展示为“人物属性条件”“城市状态条件”等模板，但导出的剧本包必须是统一条件表达式，不能导出 runtime 需要写死识别的专用条件类型。

推荐导出结构：

```json
{
  "type": "expression",
  "left": {
    "source": "character",
    "characterRef": "player",
    "path": "baseAttributes.force"
  },
  "operator": ">=",
  "right": 70
}
```

或在需要更紧凑表达时使用统一路径：

```json
{
  "type": "expression",
  "left": "$characters.player.baseAttributes.force",
  "operator": ">=",
  "right": 70
}
```

runtime 只解释条件表达式：

```text
expression path -> runtime context resolver -> value
operator -> compare
```

runtime 不应写死某个业务属性：

```ts
// 不推荐
if (condition.type === "character-base-attribute") {
  readCharacterForce();
}
```

新增人物扩展属性、城市扩展属性、建筑扩展属性、物品字段、势力字段、任务字段或小游戏 payload 字段时，只需要注册字段元数据和 resolver，不应修改事件运行时核心。

## 条件模型

绑定层条件统一保存为条件树：

```ts
type EventBindingConditionGroup = {
  operator: "all" | "any" | "not";
  conditions: EventBindingConditionNode[];
};

type EventBindingConditionNode =
  | EventBindingConditionGroup
  | EventBindingExpressionCondition
  | EventBindingContextCondition
  | EventBindingCustomCondition;
```

建议新增 `binding-context` 条件，用来判断当前触发上下文中的字段：

```json
{
  "type": "binding-context",
  "key": "payload.itemId",
  "operator": "==",
  "value": "item.herb"
}
```

长期应把可导出的普通判断都降为 `expression` 条件；`binding-context` 和 `custom` 可以作为编辑器草稿或兼容形态，导出时也需要能转换为 runtime 可解释的表达式或明确报 unsupported。

## TriggerContext

运行时触发上下文需要保留扩展 payload：

```ts
type TriggerContext = {
  timing: string;
  action: string;
  owner: EventBindingOwner;
  actorCharacterId?: string;
  currentCityId?: string;
  currentHouseId?: string;
  payload?: Record<string, unknown>;
};
```

这可以支撑任务、物品、战斗、政策等系统的专用字段，而不需要为每个系统新增一套事件条件模型。

## 后续扩展预留能力

`owner.family` 不应被事件本体写死，也不应只允许当前 UI 已实现的类型。推荐定义为可扩展枚举：

```ts
type EventBindingOwnerFamily =
  | "person"
  | "city"
  | "building"
  | "dialogue"
  | "minigame"
  | "storyNode"
  | "time"
  | "menuEntry"
  | "task"
  | "item"
  | "card"
  | "valuable"
  | "faction"
  | "battle"
  | "policy"
  | "custom";
```

第一阶段 UI 只开放核心八类。保留值用于后续扩展，不代表当前 runtime 必须支持。

后续新增触发时机示例：

- `task-started`
- `task-completed`
- `item-used`
- `valuable-equipped`
- `city-owner-changed`
- `faction-relation-changed`
- `battle-ended`
- `policy-announced`

新增系统只需要注册新的 owner family、trigger timing/action、payload schema、字段注册表和 resolver。

## custom condition

条件模型需要保留 `custom` 条件：

```json
{
  "type": "custom",
  "handlerId": "condition.faction.relation",
  "payload": {
    "leftFactionId": "faction.zhu",
    "rightFactionId": "faction.yuan",
    "relation": "hostile"
  }
}
```

第一阶段可以保存但不导出，或者导出时 fail closed。长期通过条件 handler 注册表扩展。

规则：

- 已支持 handler：正常导出并运行。
- 已知但暂未支持 handler：可保存草稿，runtime 导出报 unsupported。
- 未知 handler：可保留在草稿 residue 中，但不能导出为可运行包。

## 导出校验策略

导出器需要区分保存能力和可运行能力：

```text
编辑器保存：尽量保留作者数据，不丢失未知扩展字段。
runtime 导出：只允许导出当前 runtime 明确支持的 owner family / trigger / condition / expression resolver。
```

建议策略：

- 核心八类 owner family：按当前实现校验并导出。
- 已知保留 family：允许保存，导出时报明确 unsupported。
- 未知 family：保存为草稿 residue，导出 fail closed。
- 未知 trigger timing/action：保存为草稿 residue，导出 fail closed。
- 条件字段不在字段注册表中：导出 fail closed。
- 条件表达式无法被 runtime resolver 解析：导出 fail closed。
- 未知 condition type 或 custom handler：保存为草稿 residue，导出 fail closed。

## 现有事件资料归并

现有架构文档已经强调事件入口和演出内容要分离：

```text
事件入口 = 什么时候检查、谁能触发、触发几次
场景脚本 = 触发后播什么内容
ActionNode = 每一步具体演什么、改什么
```

本设计进一步调整为：

```text
事件绑定 = 什么时候检查、谁能触发、触发条件、优先级
事件本体 = 触发后发生什么、入口场景、参与者、任务输入、后续事件
场景脚本 = 具体演出和 action 流
```

这种调整保留原本“事件入口和演出内容分离”的核心原则，但把触发入口从事件本体移动到 `event-bindings.json`。这样模组或创作者可以覆盖、追加、禁用某个触发入口，而不必复制整段事件演出。

需要归并进新模型的旧概念：

- `trigger.timing`：迁移到 `EventBinding.trigger.timing`。
- `trigger.scope`：迁移到 `EventBinding.owner` 和表达式条件。
- `trigger.priority`：迁移到 `EventBinding.priority`。
- `conditions`：迁移到 `EventBinding.conditions`，导出为统一表达式。
- `participants`：保留在事件本体，因为它描述事件演出需要的人物。
- `occurrence`：默认保留在事件本体；如未来需要同一事件在不同绑定下有不同重复策略，可由绑定层 `repeatPolicy` 覆盖。
- `nextEventId`：保留在事件本体，用于事件内部串联。
- `eventHistory`：继续作为事件是否已发生、发生次数、最后触发时间的 runtime 记录。

## 剧本编辑器 UI 改动清单

### 全局导航

剧本编辑器需要新增一个一级作者对象：`事件绑定`。

推荐导航结构：

```text
项目
人物
城市
建筑
对话
剧情节点
事件
事件绑定
小游戏
时间触发
条件组
效果包
```

`事件` 页面只编辑事件内容。`事件绑定` 页面统一管理所有触发入口。人物、城市、建筑、对话、小游戏、剧情节点、时间触发、菜单项等对象详情页也要提供局部事件绑定编辑区。

### 事件页面

事件页面需要删除或隐藏：

- `triggerTiming`
- `conditionGroups`
- 城市、建筑、人物等触发来源字段
- “何时触发 / 满足什么条件触发”的配置区

事件页面需要保留或新增：

- 事件 ID
- 标题
- 描述
- 所属章节 `chapterId`
- 发生策略 `occurrence`
- 入口场景 `entrySceneId`
- 参与者 `participants`
- 后续事件 `nextEventId`
- 任务输入 `taskInputs`
- 标签 `tags`
- 预览说明 / 校验说明

事件页面的定位是：这个事件发生后演什么、影响什么、接到哪里。事件页面不再回答谁触发它、什么时候触发它、什么条件下触发它。

### 事件绑定页面

新增完整列表页，统一显示所有绑定。

列表字段：

- 绑定 ID
- 启用状态
- 触发对象类型
- 触发对象名称
- 触发时机
- 触发动作
- 事件标题
- 条件数量
- 优先级
- 重复策略
- 校验状态

筛选功能：

- 按触发对象类型筛选
- 按事件筛选
- 按启用 / 禁用筛选
- 按触发时机筛选
- 只看有错误的绑定
- 搜索绑定 ID / 事件 ID / 对象 ID

绑定详情编辑区：

- 绑定 ID
- 启用开关
- 事件选择器
- 触发对象类型选择器
- 触发对象选择器
- 触发时机选择器
- 触发动作选择器
- 条件编辑器
- 优先级输入
- 重复策略选择
- 备注

### 事件绑定辅助 UI

事件绑定页面需要提供创作者可直接使用的辅助能力，避免作者只能面对底层字段。

推荐新增：

- 绑定模板库：按人物、城市、建筑、对话、小游戏、剧情、时间、菜单分组，快速创建常见绑定。
- 条件预设：如“首次进入城市”“前置事件完成”“主角属性达到”“某 NPC 在场”“小游戏成功后”。
- 绑定复制：允许复制一条绑定并替换 owner 或 event，用于批量制作相似入口。
- 绑定禁用原因：禁用绑定时可以填写说明，方便后续维护。
- 绑定来源标记：区分手工创建、迁移生成、模板生成、导入生成。
- 反向引用面板：在事件详情中显示“哪些绑定会触发该事件”，但不允许在事件页直接编辑触发条件。

绑定模板不应生成专用 runtime 条件类型。模板只负责帮助 UI 填好 owner、trigger、condition expression 和 priority。

### 校验、预览与调试 UI

事件绑定系统需要提供运行前可检查的调试能力。

事件绑定详情页需要显示：

- 当前绑定是否可导出。
- eventId 是否存在。
- owner 是否存在。
- trigger timing/action 是否被当前 runtime 支持。
- 条件字段是否存在于字段注册表。
- expression 是否能被 resolver 解析。
- custom handler 是否被支持。
- repeatPolicy / occurrence 是否存在冲突。

需要新增“触发模拟器”或“为什么触发 / 为什么不触发”面板。作者可以选择一个触发上下文，查看：

```text
匹配 owner/timing/action 的绑定
每条绑定的条件树评估结果
失败的具体条件
最终排序后的候选事件
被 occurrence/eventHistory 拦截的事件
真正会启动的事件
```

导出前需要提供导出预览：

- 即将导出的 `events.json` 数量。
- 即将导出的 `event-bindings.json` 数量。
- 不可导出的绑定列表。
- 被保留为草稿 residue 的扩展字段。
- 从旧数据迁移出的绑定和需要人工确认的绑定。

调试 UI 只读取当前编辑器数据和模拟上下文，不应改写运行时状态。

### 人物详情页

新增“事件绑定”区域。

支持触发：

- 点击人物
- 与人物交谈
- 人物动作
- 人物出现
- 人物离开
- 人物状态变化

UI 控件：

- 新增绑定按钮
- 事件下拉选择
- 触发动作选择：交谈 / 点击 / 状态变化 / 出现 / 离开
- 条件编辑入口
- 优先级
- 启用开关

`person.eventIds` 不应再作为真实触发配置。如果保留，只能命名为“相关事件”，不能命名为“触发事件”。

### 城市详情页

新增“事件绑定”区域。

支持触发：

- 进入城市后
- 离开城市后
- 城市菜单点击
- 城市状态变化
- 城市首次发现
- 城市刷新 / 每日检查

UI 控件：

- 触发动作：进入 / 离开 / 菜单点击 / 状态变化 / 日期刷新
- 事件选择器
- 条件编辑器
- 优先级
- 启用开关

城市进入权限仍归 LocationAccessRuntime，不归事件绑定。城市事件绑定只处理进入成功后是否触发事件。

### 建筑详情页

新增“事件绑定”区域。

支持触发：

- 进入建筑后
- 离开建筑后
- 建筑菜单点击
- 建筑内 NPC 点击
- 建筑状态变化
- 建筑服务完成后

UI 控件：

- 触发动作：进入 / 离开 / 菜单点击 / NPC 点击 / 服务完成
- 事件选择器
- 条件编辑器
- 优先级
- 启用开关

长期应迁移为事件绑定的旧字段：

- `onEnterEventId`
- `onLeaveEventId`
- `entryBinding.onEnterEventId`
- `entryBinding.onLeaveEventId`

### 对话详情页

新增“事件绑定”区域。

支持触发：

- 对话开始
- 对话结束
- 节点播放完成
- 选项被选择
- 分支进入
- 对话中断

UI 控件：

- 触发动作选择
- 节点选择器
- 选项选择器
- 事件选择器
- 条件编辑器
- 优先级
- 启用开关

`followUps` 可以保留用于简单跳转。需要条件、优先级或复用事件时，应迁移为事件绑定。

### 小游戏详情页

新增“事件绑定”区域。

支持触发：

- 小游戏开始前
- 小游戏完成
- 成功
- 失败
- 取消
- 达成特定评分
- 超时

UI 控件：

- 触发动作：开始 / 完成 / 成功 / 失败 / 取消 / 超时
- outcome 选择
- 事件选择器
- 条件编辑器
- 优先级
- 启用开关

小游戏 `outcomeRoutes` 继续负责玩法回到哪里、怎么结算。outcome 后续剧情使用事件绑定。

### 剧情节点详情页

新增“事件绑定”区域。

支持触发：

- 剧情节点激活
- 剧情节点完成
- 主线阶段推进
- 阶段阻塞
- 阶段解锁

UI 控件：

- 触发动作：激活 / 完成 / 推进 / 阻塞 / 解锁
- 事件选择器
- 条件编辑器
- 优先级
- 启用开关

`relatedEventIds` 只能表示关联事件，不能表示触发规则。

### 时间触发页面

新增独立页面：`时间触发`。它可以是 `事件绑定` 页面的一个预设视图，也可以作为一级导航项。

支持触发：

- 日期变化
- 每日开始
- 月初
- 季初
- 年初
- 回合结束
- 旅行完成
- 等待完成
- 距某事件若干天 / 月后

UI 控件：

- 时间触发类型
- 日期条件
- 周期规则
- 起始日期
- 截止日期
- 事件选择器
- 条件编辑器
- 优先级
- 启用开关

时间触发不能散落在某个 UI 页面里，应统一可检索。

### 菜单项编辑 UI

城市、建筑、人物、对话等菜单项需要调整。

如果菜单项当前有：

```text
targetFamily = event
targetId = eventId
```

建议迁移为：

```text
targetFamily = eventBinding
targetId = eventBindingId
```

也可以让菜单项只保留展示信息，事件触发由绑定表引用 `owner.family = menuEntry`。

菜单项 UI 需要：

- 是否显示
- 是否启用
- 禁用提示
- 选择触发绑定
- 查看该菜单项关联的事件绑定

菜单显示条件和事件触发条件可以共享条件模型，但不能混成一个字段。

## 各类事件绑定条件模板

### 人物绑定条件

人物条件要区分两类：

```text
人物作为触发对象 NPC
  判断该 NPC 是否存在、是否在场、是否可交互、是否位于某城市/建筑

人物作为角色数据
  判断该角色的基础属性、身份字段、状态字段、可扩展属性
```

人物绑定常用条件：

- 当前章节
- 当前地点
- NPC 是否存在
- NPC 是否可交互
- NPC 是否在某城市
- 前置事件是否发生
- 任务状态
- 玩家与 NPC 关系值
- 角色基础属性
- 角色身份字段
- 角色可扩展属性

需要新增角色属性条件，并由 UI 下拉配置后导出为 expression：

```ts
type CharacterRef = "player" | "owner" | "triggerActor" | { characterId: string };
```

人物条件 UI 建议分组：

- NPC 条件
- 角色属性条件
- 关系 / 状态条件
- 剧情条件
- 地点条件

角色属性条件 UI：

- 选择角色：主角 / 当前 NPC / 触发者 / 指定角色
- 选择字段：基础属性 / 身份字段 / 扩展属性
- 选择操作符
- 填写值

扩展属性 key 应支持从该角色已有 `extendedAttributes` 下拉选择，也允许手写草稿 key；运行时导出必须校验该 key 是否能被 resolver 支持。

### 城市绑定条件

城市绑定常用条件：

- 当前城市是该城市
- 进入城市成功后
- 章节匹配
- 日期达到
- 城市状态值满足
- 某人物在该城市
- 前置事件是否发生
- 任务状态
- 玩家来自某城市
- 旅行完成后到达该城市
- 主角基础属性 / 扩展属性满足

城市 UI 快捷模板：

- 首次进入城市
- 进入城市且前置事件完成
- 进入城市且某人物在城中
- 城市状态达到
- 日期达到后进入城市
- 城市菜单点击后
- 主角名声 / 属性达到后

城市绑定条件不承担进入权限判断。访问条件属于 LocationAccessRuntime。

### 建筑绑定条件

建筑绑定常用条件：

- 当前建筑是该建筑
- 当前城市是该城市
- 建筑进入成功
- 建筑内有某人物
- 默认 NPC 是某人物
- 建筑服务完成
- 菜单项是某项
- 前置事件完成
- 任务状态满足
- 建筑状态满足
- 主角基础属性 / 扩展属性满足

建筑 UI 快捷模板：

- 首次进入建筑
- 离开建筑时
- 点击建筑菜单
- 点击建筑内 NPC
- 服务完成后
- 建筑状态达到
- 主角技能 / 属性达到后

建筑绑定条件不承担建筑访问权限判断。访问条件仍属于 building/location access。

### 对话绑定条件

对话绑定常用条件：

- 当前对话是某对话
- 当前节点是某节点
- 当前选项是某选项
- 某参与者存在 / 可用
- 前置事件是否发生
- 变量值满足
- 任务状态满足
- 当前地点满足
- 对话完成次数 / 选择次数满足
- 主角或对话对象属性满足

对话需要支持这些上下文字段：

- `dialogueId`
- `nodeId`
- `choiceId`
- `speakerPersonId`
- `selectedChoiceId`

对话 UI 快捷模板：

- 对话开始
- 对话结束
- 节点播放后
- 选择某选项后
- 进入某分支时
- 某任务进行中才触发

### 小游戏绑定条件

小游戏绑定常用条件：

- 小游戏 ID 是某个
- outcome 是 success / failure / cancelled
- 分数达到阈值
- 等级 / 评价达到
- 所属建筑 / 场景 / 任务匹配
- 玩家资源满足
- 前置事件 / 任务满足
- 小游戏运行 payload 字段满足
- 主角基础属性 / 扩展属性满足

小游戏上下文字段：

- `minigameId`
- `playableId`
- `integrationId`
- `ownerKind`
- `ownerId`
- `outcome`
- `score`
- `grade`
- `elapsedSeconds`

小游戏 UI 快捷模板：

- 成功后
- 失败后
- 取消后
- 分数达到
- 评级达到
- 在某建筑小游戏完成后
- 主角属性达到时追加奖励事件

### 剧情节点绑定条件

剧情节点绑定常用条件：

- 当前剧情节点是某节点
- 当前章节是某章节
- 节点状态 active / completed / blocked
- 前置任务完成
- 前置事件发生
- 某人物存在 / 可用
- 当前地点满足
- 主线变量达到某值
- 主角基础属性 / 扩展属性满足

剧情上下文字段：

- `storyNodeId`
- `storyNodeStatus`
- `fromStoryNodeId`
- `toStoryNodeId`
- `progressMode`

剧情 UI 快捷模板：

- 节点激活时
- 节点完成时
- 主线推进到这里
- 任务完成后推进
- 前置事件完成后解锁

### 时间绑定条件

时间绑定常用条件：

- 日期等于 / 大于某日期
- 当前月份 / 季节 / 年份
- 距某事件至少 N 天 / 月
- 某事件发生次数
- 某任务状态
- 当前地点
- 某人物是否存在 / 可用
- 周期规则
- 时间窗口
- 主角基础属性 / 扩展属性满足

时间上下文字段：

- `year`
- `month`
- `day`
- `turnIndex`
- `elapsedDays`
- `travelFromCityId`
- `travelToCityId`

时间 UI 快捷模板：

- 某日期后
- 每月开始
- 每年开始
- 回合结束
- 旅行完成
- 等待完成
- 距离某事件 N 天 / 月后

### 菜单项绑定条件

菜单项绑定常用条件：

- 菜单项 ID
- 父对象是某城市 / 建筑 / 人物
- 当前地点
- 当前章节
- 前置事件
- 任务状态
- 菜单项启用
- 菜单项所属功能类型
- 主角基础属性 / 扩展属性满足

菜单上下文字段：

- `menuEntryId`
- `parentFamily`
- `parentId`
- `targetFamily`
- `targetId`

菜单 UI 快捷模板：

- 点击该菜单项
- 仅在某章节显示
- 任务完成后可用
- 前置事件完成后触发
- 主角属性达到后触发

## Runtime 检查流程

统一流程：

```text
runtime action 发生
  -> 生成 TriggerContext
  -> EventBindingRuntime 查询匹配 timing / owner / action 的绑定
  -> 逐条评估 binding.conditions
  -> 按 priority 和稳定 id 排序
  -> 检查 event occurrence / eventHistory
  -> 启动 event.entrySceneId
  -> 记录 eventHistory
```

每条绑定 runtime 都应自动检查：

- `binding.enabled === true`
- `binding.owner` 与当前 `TriggerContext.owner` 匹配
- `binding.trigger.timing` 与当前 timing 匹配
- `binding.trigger.action` 与当前 action 匹配
- `eventId` 存在
- `occurrence` 没有被 eventHistory 拦截

作者只需要在 `conditions` 中填写额外条件，不需要重复写 owner/timing/action 匹配条件。

### 新事件运行时边界

需要设计新的事件运行时来消费 `event-bindings.json`，并最终替换旧事件触发路径。

新运行时的职责：

- 接收各系统发出的 `TriggerContext`。
- 按 owner、timing、action 找到候选绑定。
- 使用统一条件表达式 evaluator 评估绑定条件。
- 使用字段 resolver 读取人物、城市、建筑、对话、小游戏、剧情、时间、菜单和 payload 字段。
- 按 priority、稳定 id 和重复策略决定最终事件。
- 启动事件本体定义的入口场景、效果或 action 流。
- 写入 eventHistory。
- 产出调试报告，供编辑器模拟器和运行时日志使用。
- 与 scene、task、house、navigation、playable、location-access 等子 runtime 通过 `TriggerContext`、payload/resolver 和既有 runtime-result handoff 边界适配。

新运行时不应负责：

- 判断城市或建筑是否可进入。
- 判断菜单项是否显示。
- 写死某个业务字段的读取逻辑。
- 解析旧 `events[].trigger/conditions` 作为长期路径。
- 在事件本体里查找触发条件。
- 接管 house、scene、task、playable、navigation、location-access 等子 runtime 的生命周期或内部状态机。

### 子 runtime 适配边界

`EventBindingRuntime` 必须作为事件触发选择器与激活器，而不是新的总控 runtime。

适配原则：

- 各子 runtime 保持自己的生命周期、状态机和结算边界。
- 子 runtime 只在关键动作发生时发出标准 `TriggerContext`。
- `EventBindingRuntime` 不直接读取子 runtime 私有状态；需要读取的字段必须通过 payload、字段 resolver、active-content 或既有 runtime-result contract 暴露。
- `EventBindingRuntime` 可以返回事件激活、scene/task/effect handoff 数据，但不得把这些子 runtime 的执行细节内联到事件触发选择逻辑里。
- 涉及子 runtime 边界的队列 closeout 必须记录：边界是否仍由原子 runtime 拥有，以及使用了哪个 `TriggerContext` payload、resolver 或 handoff contract。

### 编辑器双表读取与 UI 呈现

剧本编辑器读取剧本包时，必须同时读取 `events.json` 与 `event-bindings.json`，并把两者作为两个独立表展示。

编辑器加载要求：

- `events.json` 只作为事件本体表读取。
- `event-bindings.json` 只作为触发入口表读取。
- `pack.json.files` 必须同时声明 `events` 与 `eventBindings`。
- 导入时不得把绑定信息回写进事件本体作为长期数据源。

UI 呈现要求：

- 事件列表与事件详情展示事件本体内容。
- 绑定列表与绑定详情展示 owner、trigger、conditions、priority、enabled。
- 事件详情应能跳转查看引用它的绑定。
- 绑定详情应能跳转回对应事件。
- 新包优先按双表渲染；旧包仅作为迁移输入，不作为日常编辑主路径。

### 内置剧本包迁移时机

内置 `zhuyuanzhang` 剧本包也必须迁移到双表结构。

迁移顺序建议：

1. 先让编辑器与 loader 支持双表读取与展示。
2. 再为内置 `zhuyuanzhang` 包补齐 `event-bindings.json`。
3. 然后切换 runtime 到新事件系统。
4. 最后删除旧事件系统与旧字段。

不建议把内置包迁移延后到旧事件系统移除之后；否则 runtime 切换后内置包会失去可运行性。

### 实施顺序与受控回补

新事件运行时替换旧系统时，必须按依赖顺序推进：

1. 定义 `EventBinding` contract、`eventBindings` pack 字段、loader 读取。
2. 剧本编辑器项目模型增加 `eventBindings`，UI 能显示事件本体与事件绑定。
3. 执行字段缺口复查。
4. 导出器输出双表：`events.json` 不含 `trigger/conditions`，`event-bindings.json` 包含触发入口。
5. 迁移内置 `zhuyuanzhang` 包到双表结构。
6. 新增 `EventBindingRuntime`，让业务系统发出 `TriggerContext`。
7. 切主 runtime 调用到新 runtime。
8. 验证内置包和编辑器导出包都能触发事件。
9. 删除旧 `events[].trigger/conditions`、旧 evaluator、旧兼容 shim。
10. 加 guard 测试，禁止旧路径回流。

第 9 步只能在第 8 步验证通过后执行。

第 1 步与第 2 步之间允许一次受控回补：

```text
1 contract/loader baseline
2 editor UI integration
2a field gap review
2b controlled contract backfill if required
1 re-verify contract/loader
3 export double-table
```

字段缺口复查规则：

- 如果字段属于运行时触发必需语义，回补到第 1 步的 shared/runtime contract。
- 如果字段只属于编辑器展示、筛选、草稿备注，放入 editor-only 字段，不进入 runtime contract。
- 如果字段属于将来能力但当前 runtime 不支持，放入 draft/residue，导出时 fail closed。
- 回补后必须重新验证 contract 与 loader。
- 第 3 步之后不允许继续随意新增 runtime 字段；确需新增时必须开新的 contract revision。

各业务系统只需要在关键动作发生时发出标准上下文。例如：

```ts
emitEventTrigger({
  owner: { family: "city", id: cityId },
  timing: "after-enter",
  action: "enter",
  currentCityId: cityId,
  actorCharacterId: playerId
});
```

表达式 evaluator 只依赖 resolver 注册表：

```text
source + ref + path -> resolver -> value
operator + left + right -> boolean
```

这保证新增人物扩展属性、城市扩展字段、小游戏 payload 或后续任务/物品/势力字段时，主要改动集中在字段注册表和 resolver，不需要改事件运行时核心。

## 导出结构与迁移策略

剧本包需要增加：

- `event-bindings.json`

`pack.json.files` 增加：

```json
{
  "events": "./events.json",
  "eventBindings": "./event-bindings.json"
}
```

脚本编辑器项目也需要增加：

- `eventBindings`
- `event-bindings.json`

迁移阶段：

1. 编辑器模型先分离：事件页隐藏/移除触发条件，新增事件绑定表。
2. 导出兼容旧 runtime：必要时由 `event + binding` 临时生成旧形态 runtime event。
3. runtime 原生消费绑定表：新增 `EventBindingRuntime`，旧 `events[].trigger/conditions` 扫描路径退役。
4. 完全删除旧事件功能：删除旧编辑 UI、旧 lowering、旧 trigger evaluator 入口和兼容 shim。

迁移工具 UI 需要支持：

- 从事件 `triggerTiming + conditionGroups + relations` 生成事件绑定。
- 从建筑 `onEnterEventId/onLeaveEventId` 生成建筑绑定。
- 从建筑 `entryBinding.onEnterEventId/onLeaveEventId` 生成建筑绑定。
- 从人物 `eventIds` 生成“相关事件”，不自动生成触发绑定，除非用户选择触发动作。
- 从对话 `followUps` 中的 event 目标生成对话完成 / 选项绑定。
- 从菜单项 `targetFamily=event` 生成菜单绑定。

迁移后 UI 应显示：

```text
已迁移
需要人工确认
无法自动迁移
```

### 旧事件功能删除计划

旧事件相关功能不能在新模型稳定后继续双轨存在。建议按四个阶段推进：

1. 编辑器分离阶段：事件页不再新增 trigger/conditions；旧字段只读显示或迁移提示。
2. 导出兼容阶段：编辑器内部使用 `eventBindings`，导出时可临时 lowering 到旧 runtime 结构。
3. runtime 切换阶段：新增 `EventBindingRuntime` 并让各系统发出 `TriggerContext`；旧 trigger evaluator 只保留兼容入口。
4. 删除阶段：移除旧事件条件 UI、旧 `events[].trigger/conditions` 导出、旧 trigger evaluator 扫描路径、旧 condition 专用类型和兼容 shim。

删除阶段完成后，事件本体中不应再出现触发条件字段；如果导入旧包，应通过迁移工具转换为绑定或明确报需要人工迁移。

### 剧本包清单与兼容策略

剧本包 manifest 需要把事件本体和事件绑定列为两个独立文件：

```json
{
  "files": {
    "events": "./events.json",
    "eventBindings": "./event-bindings.json"
  }
}
```

兼容读取策略：

- 新包包含 `eventBindings`：按新模型读取。
- 旧包只有 `events[].trigger/conditions`：进入迁移流程，不作为长期运行时路径。
- 同时存在新旧字段：以 `eventBindings` 为准，旧字段只作为迁移来源或诊断信息。
- 导出可运行包时，不导出无法解析的旧触发规则。

### 访问权限与事件触发的边界

地点、城市、建筑是否允许进入，仍由访问权限系统负责。事件绑定只能在某个动作已经发生或某个检查点到达后决定是否启动事件。

边界示例：

```text
能不能进入城市 = LocationAccessRuntime / access rule
进入城市成功后要不要触发剧情 = event binding

能不能进入建筑 = building/location access
进入建筑成功后要不要播放事件 = event binding

菜单项是否显示 / 是否禁用 = menu visibility / enable rule
点击菜单项后是否触发事件 = event binding
```

访问条件和事件条件可以共享同一套表达式编辑器和字段注册表，但保存字段、运行时入口和责任边界必须分开。

## 设计约束

- 事件不能再拥有“谁触发我”的条件。
- 事件可以保留内部执行分支，但那属于场景/action 内部逻辑，不属于触发条件。
- 所有事件引用都必须优先使用下拉或可搜索选择器。
- 所有条件字段都必须来自字段注册表或明确标记为自定义草稿字段。
- 导出的可运行剧本包必须使用统一条件表达式。
- runtime 只解释表达式和 resolver，不写死某个业务属性。
- 地点访问权限不能用事件代替。
- 菜单显示/禁用条件和事件触发条件可以共享条件模型，但字段职责要分开。
- 人物、城市、建筑等对象上的 `relatedEventIds` 只能表示关联，不应表示运行时触发。
- 同一事件允许多个绑定触发；同一绑定只触发一个事件。

## 验收标准

- 人物、城市、建筑、对话、小游戏、剧情节点、时间和菜单项都能创建事件绑定。
- 所有事件选择位置都使用事件下拉或可搜索选择器。
- 条件编辑器使用级联下拉选择对象、字段、操作符和值。
- 条件字段来自字段注册表，并能显示字段标签、类型和可选值。
- 导出的剧本包包含 `events.json` 和 `event-bindings.json`。
- 导出的绑定条件为统一条件表达式。
- runtime 不需要针对“人物武力”“城市繁荣度”等具体属性写死判断逻辑。
- 不支持的 owner、trigger、condition 或 resolver 在导出时 fail closed，并给出明确错误。
