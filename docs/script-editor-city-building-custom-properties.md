# 剧本编辑器城市与建筑可自定义属性设计

## 1. 文档目的

本文定义剧本编辑器中城市与建筑的可自定义属性方向，以及创作者如何通过属性、条件、效果、表达式、触发器和操作入口组合小型玩法。

目标不是不断给城市或建筑增加固定业务字段，例如 `cityLevel`、`taxIncome` 或 `isOccupied`，而是提供一套通用、可验证、可导出、可存档的组合机制。

创作者应当能够在不修改引擎代码的情况下，通过数据组合实现：

- 管理城市
- 占领城市
- 城市税收
- 城市产出
- 城市治安与繁荣
- 建筑升级
- 店铺收益
- 阵营控制
- 特殊城市事件
- 其他基于城市或建筑状态的小型功能

## 2. 核心原则

### 2.1 字段是数据，不是玩法

自定义字段只负责描述和保存数据。

例如：

- 城市等级
- 城市所有者
- 城市繁荣度
- 税率
- 人口
- 粮食产量
- 建筑等级
- 建筑是否损坏

单独增加这些字段不会自动产生管理、税收或占领玩法。玩法必须由通用条件、效果、表达式、触发器和操作入口共同组成。

### 2.2 不为每个玩法增加专用字段和专用分支

引擎不应为了“城市税收”增加一套硬编码税收流程，也不应为了“占领城市”在主流程中增加城市专用业务分支。

引擎只提供通用能力：

- 注册字段
- 读取字段
- 比较字段
- 设置字段
- 增加或减少字段
- 对字段执行乘算或表达式计算
- 响应时间、事件、任务、战斗等触发器
- 将操作挂载到城市、建筑、菜单、对话或任务入口
- 将可变字段写入存档

具体玩法由剧本包数据组合完成。

### 2.3 创作定义与运行时状态分离

城市与建筑的创作定义负责描述初始数据和规则配置。

运行过程中发生变化的数据必须进入状态层，而不是直接修改创作定义。

示例：

- 城市初始等级属于创作定义。
- 游戏中的当前城市等级属于运行时状态。
- 城市默认所有者属于创作定义。
- 城市被占领后的当前所有者属于运行时状态。
- 建筑基础产出属于创作定义。
- 建筑受损后的当前产出倍率属于运行时状态。

字段定义应通过 `storageScope`、`mutable` 和 `persistent` 等元数据声明其存储与变更规则。

## 3. 通用字段定义协议

城市与建筑应消费同一套字段定义协议，而不是分别维护两套不兼容的扩展属性系统。

概念结构如下：

```ts
interface CustomFieldDefinition {
  fieldId: string;
  ownerTypes: Array<"city" | "building" | "character" | "scenario">;
  canonicalKey: string;
  label: string;
  group?: string;
  valueType:
    | "number"
    | "string"
    | "boolean"
    | "enum"
    | "reference"
    | "list";
  defaultValue?: unknown;
  storageScope: "definition" | "status";
  editable: boolean;
  mutable: boolean;
  persistent: boolean;
  runtimeReadable: boolean;
  validation?: FieldValidationDefinition;
  enumOptions?: Array<FieldEnumOption>;
  referenceTarget?: "city" | "building" | "character" | "faction" | "resource";
  order?: number;
}
```

字段定义表负责：

- 字段身份和稳定 ID
- 字段所属对象类型
- 编辑器显示名称
- 编辑器分组和排序
- 控件类型
- 默认值
- 值类型和校验规则
- 是否可编辑
- 是否允许运行时修改
- 是否进入存档
- 引用字段的目标类型

## 4. 城市与建筑的字段值容器

城市和建筑不需要为每个玩法增加固定属性。它们只需要提供统一的字段值容器。

概念结构如下：

```ts
interface CityDefinition {
  id: string;
  name: string;
  fieldValues: Record<string, unknown>;
}

interface BuildingDefinition {
  id: string;
  cityId: string;
  name: string;
  fieldValues: Record<string, unknown>;
}

interface CityStatus {
  cityId: string;
  fieldValues: Record<string, unknown>;
}

interface BuildingStatus {
  buildingId: string;
  fieldValues: Record<string, unknown>;
}
```

字段值必须通过字段定义表解析和验证。

不允许正常创作模式随意写入未注册字段。未知字段只能：

- 被明确迁移
- 被登记为受支持的自定义字段
- 被校验拒绝

## 5. 玩法组合机制

要让自定义字段真正产生玩法，至少需要以下通用机制。

### 5.1 条件

条件用于判断字段是否满足要求。

示例：

```json
{
  "type": "field-compare",
  "subject": "targetCity",
  "fieldId": "city.ownerId",
  "operator": "equals",
  "valueFrom": "player.factionId"
}
```

常用操作包括：

- 等于或不等于
- 大于或小于
- 包含
- 是否为空
- 引用是否存在
- 多条件组合

### 5.2 效果

效果用于修改允许变更的字段。

示例：

```json
{
  "type": "field-add",
  "subject": "targetCity",
  "fieldId": "city.prosperity",
  "value": 5
}
```

通用效果至少包括：

- `field-set`
- `field-add`
- `field-subtract`
- `field-multiply`
- `field-list-add`
- `field-list-remove`

### 5.3 表达式

表达式用于根据多个字段计算结果。

例如城市税收可以由人口、税率、繁荣度和建筑加成共同计算：

```json
{
  "multiply": [
    { "field": "city.population" },
    { "field": "city.taxRate" },
    { "field": "city.prosperityMultiplier" },
    { "field": "city.buildingTaxMultiplier" }
  ]
}
```

表达式必须是受支持的结构化表达式，不允许剧本包直接执行任意脚本代码。

### 5.4 触发器

触发器决定规则何时执行。

可复用触发器可以包括：

- 进入城市
- 进入建筑
- 离开城市或建筑
- 日开始
- 月开始
- 任务完成
- 事件完成
- 战斗结算
- 对话选项结算
- 管理操作提交
- 字段达到阈值

### 5.5 操作入口

操作入口决定创作者定义的功能从哪里被玩家调用。

第一阶段建议允许绑定到已有入口：

- 城市菜单
- 建筑菜单
- 对话选项
- 事件选项
- 任务操作
- 城市或建筑详情面板

不建议第一阶段允许剧本包运行任意 UI 脚本。

## 6. 可组合玩法示例

### 6.1 管理城市

创作者可以定义：

- `city.ownerId`
- `city.prosperity`
- `city.security`
- `city.managementCount`
- `character.stamina`

再创建一个城市操作：

```json
{
  "id": "action.manage-city",
  "targetType": "city",
  "conditions": [
    {
      "type": "field-compare",
      "subject": "targetCity",
      "fieldId": "city.ownerId",
      "operator": "equals",
      "valueFrom": "player.factionId"
    }
  ],
  "effects": [
    {
      "type": "field-add",
      "subject": "targetCity",
      "fieldId": "city.prosperity",
      "value": 5
    },
    {
      "type": "field-add",
      "subject": "targetCity",
      "fieldId": "city.security",
      "value": 3
    },
    {
      "type": "field-add",
      "subject": "player",
      "fieldId": "character.stamina",
      "value": -10
    }
  ]
}
```

不同创作者可以使用不同字段和效果组合出完全不同的管理玩法。

### 6.2 占领城市

占领不需要引擎内置专用城市占领分支。

战斗结算后可以执行：

```json
{
  "trigger": "battle-settled",
  "conditions": [
    {
      "type": "result-compare",
      "path": "winnerFactionId",
      "operator": "equals",
      "valueFrom": "player.factionId"
    }
  ],
  "effects": [
    {
      "type": "field-set",
      "subject": "relatedCity",
      "fieldId": "city.ownerId",
      "valueFrom": "player.factionId"
    },
    {
      "type": "field-set",
      "subject": "relatedCity",
      "fieldId": "city.occupied",
      "value": true
    }
  ]
}
```

后续事件、任务、对话和建筑访问规则都可以读取这些字段。

### 6.3 城市税收

创作者可以注册：

- `city.population`
- `city.taxRate`
- `city.prosperityMultiplier`
- `city.ownerId`
- `character.gold`

在月初触发税收规则：

```json
{
  "trigger": "month-start",
  "effects": [
    {
      "type": "field-add",
      "subject": "cityOwner",
      "fieldId": "character.gold",
      "valueExpression": {
        "multiply": [
          { "field": "city.population" },
          { "field": "city.taxRate" },
          { "field": "city.prosperityMultiplier" }
        ]
      }
    }
  ]
}
```

创作者还可以增加治安、民心、政策或建筑字段作为税收条件和修正值。

### 6.4 城市产出

城市产出可以通过资源引用字段和周期规则组合：

- 产出资源类型
- 基础产出数量
- 城市等级倍率
- 建筑倍率
- 事件倍率
- 所有者收益目标

同一套机制可以组合粮食、银两、木材、兵员、声望或创作者自定义资源。

### 6.5 建筑升级

创作者可以定义：

- `building.level`
- `building.levelCap`
- `building.upgradeCost`
- `building.outputMultiplier`
- `building.damaged`

通过条件限制升级，通过效果增加等级、扣除资源、修改产出倍率。

### 6.6 城市或建筑特殊事件

字段达到阈值后可以触发：

- 城市繁荣事件
- 城市叛乱
- 建筑损坏
- 市场开放
- 特殊人物出现
- 新任务解锁
- 新对话分支

这些功能不需要成为城市或建筑结构里的固定业务字段。

## 7. 剧本编辑器创作流程

推荐创作流程如下：

1. 创作者创建字段定义。
2. 选择字段所属对象类型。
3. 设置字段类型、默认值、存储范围和校验规则。
4. 将字段添加到城市或建筑实例。
5. 创建条件、效果或表达式。
6. 选择触发器或操作入口。
7. 绑定城市、建筑、事件、任务、对话或战斗结果。
8. 编辑器执行引用、类型和循环依赖校验。
9. 预览从保存后的剧本包重新加载规则。
10. 导出时将字段定义、字段值、规则和引用一起写入运行时剧本包。

## 8. 编辑器应提供的创作控件

字段定义界面应提供：

- 字段名称
- 稳定字段 ID
- 所属对象类型
- 值类型
- 默认值
- definition/status 存储范围
- 是否可编辑
- 是否允许运行时修改
- 是否进入存档
- 最小值和最大值
- 枚举选项
- 引用目标类型
- 分组
- 排序

规则创作界面应提供：

- 条件类型下拉选择
- 对象和字段选择
- 类型匹配的值输入控件
- 效果类型选择
- 目标对象选择
- 表达式组合
- 触发器选择
- 操作入口选择
- 引用关系预览
- 校验错误定位

## 9. 校验规则

编辑器和导出器必须 fail closed。

至少拒绝：

- 重复字段 ID
- 不支持的字段类型
- 未注册字段引用
- owner type 不匹配
- 对只读字段执行写操作
- definition 字段被运行时效果修改
- 非持久字段被错误写入存档
- 引用字段指向错误对象类型
- 表达式操作数类型不匹配
- 条件和值类型不匹配
- 触发器缺少必要上下文
- 操作入口引用不存在的城市、建筑或规则

## 10. 存档与运行时规则

运行时读取字段时，应按以下顺序解析：

1. 如果字段属于 status 范围且存档中存在当前值，读取状态值。
2. 否则读取创作定义中的初始值。
3. 如果实例中没有显式值，读取字段定义默认值。
4. 如果字段未注册或类型不合法，返回结构化诊断，不使用静默回退。

运行时效果只能修改：

- `mutable = true`
- `storageScope = status`

的字段。

## 11. 与现有 Blueprint 队列的关系

本设计建议由以下队列分阶段承接：

- `queue.script-editor-unified-field-mapping-table-freeze`
  - 冻结字段定义协议、字段 ID、值类型、UI 元数据和基础校验。
- `queue.script-editor-city-building-structure-convergence`
  - 让城市和建筑正式消费统一字段值容器。
- `queue.script-editor-condition-authoring-contract-freeze`
  - 提供类型化字段条件创作协议。
- `queue.script-editor-condition-runtime-evaluation-convergence`
  - 在运行时解析对象、字段和条件上下文。
- `queue.script-editor-event-effect-activation-convergence`
  - 提供通用字段修改效果和执行回执。
- `queue.script-editor-branching-event-task-chain-convergence`
  - 让字段驱动分支、事件链和长期任务进度。
- `queue.script-editor-end-to-end-authoring-runtime-flow-validation`
  - 验证创作、保存、预览、导出、运行、存档和恢复闭环。

如果后续需要更完整的城市经营循环，应新增独立玩法队列，但玩法队列应消费本文定义的通用字段和规则机制，而不是再次增加城市专用硬编码字段。

## 12. 最终目标

最终系统应达到：

> 创作者通过注册可验证的自定义字段，并组合条件、效果、表达式、触发器和操作入口，构建城市管理、城市占领、税收、产出、建筑升级等小型玩法；引擎负责通用执行、校验、导出和存档，不需要为每个玩法增加专用业务字段或主流程分支。
