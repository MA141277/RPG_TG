# 设施系统设计记录（像素wf）

目标：在现有 `house`、`container`、`sign` 的涌现式设计基础上，定义一套可渐进落地的 **facility（设施）** 模型。设施不是“大建筑分类”本身，而是“可承载物品交互、能让输入产生玩法结果的交互节点”。

## 先复用现有设计共识

当前项目里，`house`、`container`、`sign` 并不是通过一套厚重继承体系实现的，而是通过下面这条链路自然长出来的：

1. **语义识别**
   - `house / facility / container / resource / decoration` 先决定对象在世界逻辑中的大类。
   - `item:*` 标签补充可交互特征，例如 `item:container`、`item:sign`、`item:crafting`。

2. **默认数据补全**
   - `house` 自动补全 `interior` 与 `interiorRef`。
   - `container` 自动补全容器槽位存储。
   - `sign` 通过 `properties.sign.text` 或资源元数据提供可读文本。

3. **动作入口注册**
   - `house` 暴露“进入”。
   - `container` 暴露“打开”。
   - `sign` 暴露“阅读”。

4. **状态挂载到对象或场景**
   - 世界对象状态挂在 `scene object` 上。
   - 室内布局状态挂在 `interior` 上。
   - 持久化只保存必要快照，不强制要求复杂运行时类实例存在。

设施类应该沿用这条路径，而不是另起一套 OOP 框架。

## 设施与其他类型的边界

### `house`

- 核心语义是“可进入、可切换到内部场景”。
- 重点是空间切换与内部布局。
- 它可以包含设施，但自身不等于设施。

### `container`

- 核心语义是“能装东西”。
- 重点是盛装、槽位、内容物状态。
- 容器可以兼具设施语义，例如“带储物格的工作台”。

### `sign`

- 核心语义是“读取信息”。
- 重点是单向展示，不处理输入物品与加工结果。
- 它更像极简 feature，而不是完整系统。

### `facility`

- 核心语义是“玩家或后续 NPC 可拿着物品与之交互，从而产生状态变化或产出结果”。
- 典型例子：熔炉、水井、工作台、磨盘、酿造桶、火堆。
- 它关注的是 **输入、约束、处理、输出**，而不是单纯存储或展示。

一句话区分：

- `house` 解决“进入哪里”
- `container` 解决“装了什么”
- `sign` 解决“读到什么”
- `facility` 解决“拿什么去做什么，得到什么变化”

## 设施设计原则

### 1. 先做“交互节点”，不先做“生产系统”

第一阶段的设施不需要完整任务系统、时间推进、燃料网络。先支持：

- 判断玩家是否可与设施交互
- 判断手上/背包是否有合适物品
- 执行一次动作
- 写回输入物、输出物、设施内部状态

也就是说，先把 `facility` 做成统一的交互外壳，再逐步生长配方、加工时长、温度、污染等机制。

### 2. 设施实例优先，设施类型次之

先区分：

- **facility type**：设施类型模板，例如 `well`、`workbench`、`furnace`
- **facility instance**：场景里的具体设施对象，例如“村口井 01”

当前项目保存和交互的最小单位应是 `instance`，因为交互发生在具体对象上。

### 3. 世界设施与室内设施共用一套 schema

当前代码里已经有 `interior.facilities[]`，说明室内设施未来会是常规能力。建议不要为“房屋内设施”和“世界对象设施”设计两套完全不同的数据结构，而是统一为同一套设施实例快照，只是挂载位置不同：

- 世界中的大设施：挂在 `scene object.properties.facility`
- 室内布局中的设施块：挂在 `interior.facilities[]`

两者都共享同一类字段：`type`、`slots`、`state`、`actions`、`block`、`footprint`

## 建议的数据模型

### A. 世界对象上的设施

```js
{
  id: 123,
  tags: ["facility"],
  interactionTags: ["item:crafting"],
  properties: {
    facility: {
      version: 1,
      type: "workbench",
      state: {},
      slots: {},
      actions: ["craft"],
      footprint: { w: 2, d: 1, h: 1, block: true }
    }
  }
}
```

适合：井、熔炉、工作台、火堆、路边研磨台。

### B. 室内布局中的设施

建议把当前较薄的几何结构扩成：

```js
{
  id: "facility_bed_01",
  type: "bed",
  x: 4,
  y: 6,
  w: 2,
  d: 1,
  h: 1,
  block: true,
  top: "#6b4f2a",
  sideColor: "#3e2d18",
  state: {},
  slots: {},
  actions: ["rest"]
}
```

这能兼容当前的碰撞/绘制字段，同时把行为能力塞进去。

### C. 通用字段建议

- `version`
- `type`
- `state`
  - 设施自身状态，例如 `lit`、`waterLevel`、`progress`、`recipeId`
- `slots`
  - 设施内部输入/输出/燃料槽
- `actions`
  - 当前设施支持的动作列表
- `requirements`
  - 可选，描述前置条件，例如必须手持桶、必须有燃料
- `footprint`
  - 仅世界对象使用；室内设施可继续沿用 `x/y/w/d/h/block`

## 最小动作协议

建议不要直接为每种设施硬编码一整套 UI，而是先统一成动作协议。

### 通用动作

- `use`
  - 最宽泛的默认交互，适合先跑通。
- `craft`
  - 工作台、锻造台、灶台。
- `fill`
  - 井、水缸、液体源。
- `pour`
  - 桶、锅、盆、发酵容器。
- `ignite`
  - 火堆、炉子、窑。
- `rest`
  - 床、长椅。
- `read`
  - 这个现在已经由 `sign` 独立承担，不建议合并回 facility。

### 交互结果建议统一返回

```js
{
  ok: true,
  consumedHeld: null,
  nextHeld: { name: "装满的水桶", count: 1 },
  spawnDrops: [],
  statePatch: { waterLevel: 19 },
  message: "你打满了一桶水。"
}
```

这样前端菜单、背包、设施状态都能复用同一个处理流程。

## 第一阶段建议支持的设施类型

不要一开始做十几种。建议只做三类，足够把体系跑通：

### 1. `well`

- 目的：验证 `fill` 动作
- 输入：空桶 / 空容器
- 输出：装水容器
- 状态：可选 `waterLevel`，也可以先视作无限水源

### 2. `workbench`

- 目的：验证 `craft` 动作
- 输入：背包或手持里的离散材料
- 输出：一个合成结果
- 状态：第一阶段可以无内部状态

### 3. `furnace`

- 目的：验证“设施内部状态 + 输入槽位”能力
- 输入：矿石、燃料
- 输出：金属锭
- 状态：`lit`、`fuel`、`progress`

这三类分别覆盖：

- 无状态环境源
- 即时加工台
- 有内部状态的处理器

## 与现有代码的接入方式

### 1. 增加设施判定函数

与 `isHouseObject`、`isContainerObject` 平行增加：

```js
function isFacilityObject(o) {}
```

判定来源：

- 语义标签包含 `facility`
- 或交互标签命中设施型标签，如 `item:crafting`
- 或 `properties.facility.type` 存在

### 2. 扩展交互菜单

在 `getObjectInteractionActions(o)` 中新增设施入口：

- 如果对象是设施，则加入 `facility-use`
- label 先统一叫“交互”或按类型映射成“打水 / 合成 / 使用”

注意顺序建议：

- `house-enter`
- `container-open`
- `facility-use`
- `sign-read`

原因：容器和设施可能并存，容器的“打开”与设施的“交互”应并列出现。

### 3. 增加设施运行入口

建议新增：

```js
function runFacilityAction(target, actionId, context) {}
```

`target` 可以是：

- 世界对象
- 室内设施实例

`context` 可以先只包含：

- 当前玩家手持物
- hotbar / 背包访问器
- 当前 scene / interior

### 4. UI 先做最小形态

第一阶段不要为每种设施做复杂窗口。可按类型分两种：

- 无槽位设施：直接执行动作，弹一句反馈
- 有槽位设施：复用 container modal 的网格思想，做成简化版设施面板

这与容器系统的演进方式一致：先可用，再增加深度。

## 与涌现式设计的关系

设施类真正的价值不是“多一个按钮”，而是把世界里的加工关系从脚本特例变成组合系统。

一旦设施拥有：

- 输入槽
- 输出槽
- 内部状态
- 通用动作协议
- 与容器系统共享物品 schema

后面自然就能长出：

- 井 + 桶 + 水源 + 倒入
- 炉子 + 燃料 + 矿石 + 温度
- 酿造桶 + 液体 contents + 时间推进
- 室内家具 + house interior + NPC 使用

也就是说，设施系统是把“容器里能装什么”继续推进到“物品在节点里如何变化”。

## 不建议现在做的事

- 不要先做抽象基类 `BaseFacility extends BaseBuilding`
- 不要先做完整配方编辑器
- 不要把 NPC 任务调度、时间推进、燃料扩散一次性并入
- 不要把所有设施都建成独立大 UI

这些都会让设施类失去“从现有系统自然生长”的优势。

## 推荐的实现顺序

1. 增加 `isFacilityObject` 与 `facility-use` 动作入口
2. 定义 `properties.facility` / `interior.facilities[]` 的统一快照结构
3. 实现 `well` 的 `fill` 交互
4. 实现 `workbench` 的即时 `craft`
5. 实现 `furnace` 的带状态加工
6. 再把容器的 `liquid` / `contents` 能力接到设施动作上

## 当前结论

设施类不应被设计成新的“建筑大类框架”，而应该被设计成现有对象系统中的 **交互型状态节点**：

- 对外通过标签被识别
- 对内通过 `state/slots/actions` 承载行为
- 在世界对象与室内布局中共用 schema
- 先以 `well / workbench / furnace` 三类把动作协议跑通

这样它既能兼容现在的 `house/container/sign`，又能自然接到后续 DF 风格的 contents、pour/fill、温度、污染这些涌现机制上。
