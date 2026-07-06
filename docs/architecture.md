# 架构设计

## 1. 分层原则

整个项目按四层拆开：

1. `content`：纯数据内容层  
   城市、人物、房屋、事件脚本、任务、物品、音乐、背景图配置都放这里。
2. `domain`：领域模型层  
   定义类型、规则、状态结构，不写页面框架耦合代码。
3. `application`：流程编排层  
   负责点击、切场景、执行 action、改属性、发任务、进小游戏。
4. `ui`：界面呈现层  
   只根据状态渲染，不直接写业务规则。

核心要求：

- 内容和逻辑分离
- 页面和数据分离
- 小游戏和主流程分离
- 模组和本体分离

## 2. 核心对象关系

```text
Map
  └─ City[]
      └─ House[]
          ├─ defaultCharacterId
          ├─ Character[]
          └─ module / event hooks

Character
  ├─ portrait / stats / flags
  ├─ availableFunctions[]
  └─ interaction scripts

FunctionEntry
  ├─ trade
  ├─ minigame
  ├─ modify-stats
  ├─ open-scene
  └─ custom

Event
  ├─ metadata(id / chapter / once or repeatable)
  ├─ trigger(timing / scope / priority)
  ├─ conditions(all / any / not)
  ├─ participants(required characters)
  └─ entrySceneId

Scene
  └─ ActionNode[]
      ├─ background
      ├─ music
      ├─ dialogue
      ├─ choice
      ├─ jump
      ├─ effect
      ├─ start-event
      └─ callback

GlobalUI
  ├─ playerCard
  ├─ activeMission
  ├─ overlayView
  └─ houseSession
```

## 3. 玩法对应的数据拆法

### House

`House` 只描述“可进入的地点”和它的默认交互状态：

- `backAction`：返回上一级
- `characterIds`：房屋中可交互角色
- `defaultCharacterId`：默认打开主角色
- `activityLocationId`：可选的城市级流动 NPC 槽位
- `moduleId`：可选的特殊 house 行为绑定
- `onEnterEventId`：进入房屋时触发的事件入口
- `onLeaveEventId`：离开房屋时触发的事件入口

不要把人物详细数据直接塞进 `House`，只保留 ID 引用，避免多人编辑时互相冲突。

对特殊 house，有额外硬约束：

- 不从 `house.id` 做业务特判
- 不在 `main.ts` 写具体 house 分支
- 统一走 `moduleId -> registry -> runtime`

详见 [special-house-interface.md](D:/RPG_TG/docs/special-house-interface.md)。

### Event / Scene / Action

你给出的：

```text
背景(评定间)
音乐(盛夏的决斗)
对话(木下藤吉郎, 右, "主公，请把这个任务交给我吧！")
对话(织田信长, 左, "噢？那你就试试看吧，猴子。")
选择肢("接受任务", "拒绝并推荐他人")
```

适合做成声明式 action 流，而不是散落在组件里的 if/else。

好处：

- 编剧和程序能分工
- 后续方便模组覆盖
- 可做回放、存档、调试
- 可插入条件跳转

但只做 `Scene -> Action[]` 还不够。更接近《太阁立志传 V DX》官方事件编辑器的做法，是把“事件入口”和“场景脚本”拆开：

- `EventDefinition`：回答“什么时候触发、谁能触发、触发几次”
- `SceneDefinition`：回答“触发后播什么内容”
- `ActionNode`：回答“每一步具体演什么、改什么”

这样后续才能稳定支持：

- 事件排查
- 剧情串联
- 一次性事件与可重复事件
- 章节差异
- 模组覆盖触发条件而不重写整段演出

### Character

角色至少拆成四块：

- 基础资料：姓名、头像、立绘、阵营、所在城市
- 属性数值：统率、武力、政务、魅力、财富、亲密度等
- 状态标签：身份、是否可招募、是否在场、是否出仕
- 交互功能：交易、小游戏、属性变化、触发剧情

### City

`City` 负责组织房屋，不直接处理角色行为：

- `houseIds`
- `travelCost`
- `neighbourCityIds`
- `tags`
- `prosperity`
- `danger`
- `specialDemand`

### Map

地图层只处理：

- 当前所在城市
- 相邻城市
- 移动消耗
- 大地图连续坐标到六边形路径的转换
- 点击城池进入

地图不要直接知道某个角色说什么，这属于 scene 层。

大地图移动必须由 `src/application/navigation/travel-to-coordinate.ts` 生成路径。UI 点击层只提供目标坐标，主运行时按路径分段播放；不要在视图层或 `main.ts` 临时改回起点到终点的直线插值。

Campaign 地图的水域/陆地通行性来自当前地图的地形资产。`campaign-terrain-webgl.ts` 从 `map_heights` 图层采样出 passable hex 网格，navigation 层只消费这份网格做寻路；不要在 gameplay 代码里手写某张地图的水格坐标。

Campaign 地图的水体视觉来自可选 `map_water_noise` 图层。该图层是纯表现资产：`map-view.ts` 只把它作为 terrain canvas 的 `data-map-water-texture-url` 传给 WebGL renderer，`campaign-terrain-webgl.ts` 只加载一次并在 fragment shader 中用 `uTimeSeconds` 滚动采样。近岸浅绿效果由 shader 对 `map_ground_types` 的相邻 hex 材质采样得出，不改变点击、投影、通行性或 navigation 路径模型。

Campaign 地图 WebGL shader 源码必须放在 `src/ui/views/map/shaders/*.glsl` 中，并由 renderer 通过 raw import 加载。`campaign-terrain-webgl.ts` 可以替换少量与 TypeScript 常量共享的占位符，但不要再把完整 vertex/fragment shader 作为大型模板字符串内嵌在 renderer 文件里。

### 全局栏目

常驻 UI 独立建模，不挂在某个页面组件下面：

- 左上角角色卡
- 主任务追踪
- 通用资源条
- 通知/提示
- 全屏浮层
- house 会话态

这样地图、城市、房屋、剧情页都能共享同一套全局面板。

## 4. 当前推荐状态结构

```ts
type GameState = {
  world: {
    currentMapId: MapId;
    currentCityId: CityId;
    currentHouseId: HouseId | null;
    timeOfDay: "morning" | "afternoon" | "night";
    schedule: {
      councilDate: {
        year: number;
        month: number;
        day: number;
      };
    };
  };
  player: {
    characterId: CharacterId;
  };
  calendar: {
    chapterId: string;
    year: number;
    month: number;
    day: number;
  };
  scene: {
    activeEventId: EventId | null;
    activeSceneId: SceneId | null;
    cursor: number;
    status: "idle" | "playing" | "waiting-choice";
  };
  ui: {
    currentView: "map" | "city" | "house" | "scene" | "minigame";
    visiblePanels: GlobalPanelType[];
    pinnedCharacterId: CharacterId;
    activeMissionId: MissionId | null;
    reviewDateText: string;
    mainHouseMissionText: string;
    overlayView: "detail" | "cards" | "valuables" | null;
    cardLibraryFilter: CardLibraryFilter;
    valuableLibraryFilter: ValuableLibraryFilter;
    valuableLibrarySortKey: ValuableLibrarySortKey;
    valuableLibrarySortDirection: "asc" | "desc";
    houseSession: ActiveHouseModuleSession;
  };
  missions: {
    activeMissionId: MissionId | null;
    completedMissionIds: MissionId[];
  };
  cards: CardInventory;
  valuables: ValuableItemInventory;
  runtime: {
    flags: Record<string, boolean>;
    variables: Record<string, number | string>;
    cityNpcPools: Record<CityId, CityNpcPoolRuntimeState>;
    cityMarkets: Record<CityId, CityMarketData>;
    eventHistory: Record<
      EventId,
      { firedCount: number; lastTriggeredOn: string | null }
    >;
  };
};
```

关键边界：

- `calendar` 和 `runtime.eventHistory` 是事件系统必须的基础字段
- `runtime.cityNpcPools` 是城市共享流动 NPC 的统一运行态
- `runtime.cityMarkets` 是跨 city 的统一市场运行态
- `ui.houseSession` 是特殊 house 的统一临时会话态
- `cards` / `valuables` 属于统一玩家运行态，不允许 house 私自重置

## 5. 特殊 House 运行规则

特殊 house 不属于普通静态房屋展示，它们是挂在统一 house runtime 上的业务模块。

当前约束：

- `HouseDefinition.moduleId` 负责行为绑定
- `src/application/house-modules/house-module-registry.ts` 负责模块注册
- `src/ui/views/house/house-module-view-registry.ts` 负责视图注册
- `src/application/house/house-runtime.ts` 负责统一 enter / dispatch / leave 调度

禁止：

- 在 `main.ts` 写 `if (isGrainShopHouse(...))`
- 在 `application` 返回 HTML 字符串
- 在 house 模块外写顶层会话全局变量
- 在进入 house 时覆盖玩家金钱、技能、库存等基础数据

## 6. 事件触发规则设计

推荐把触发规则分成三段，不要把所有判断都塞进一个 `if`：

1. `trigger`  
   定义检查时机，例如 `house-enter`、`talk`、`travel-complete`、`indoor-screen-shown`。
2. `conditions`  
   定义必须满足的世界状态，例如章节、日期、人物存在、家势关系、城池归属、事件前置。
3. `participants`  
   定义本事件要求谁必须可参加。

### 触发时机

建议首批内建这些时机：

- `manual`
- `game-start`
- `date-change`
- `turn-end`
- `travel-complete`
- `city-enter`
- `house-enter`
- `indoor-screen-shown`
- `talk`

注意：`trigger` 只负责“何时检查”，不负责“能否通过”。

### 条件表达

条件不要只做扁平数组，必须支持组合逻辑：

- `all`
- `any`
- `not`

否则后面做历史事件、势力事件、分支剧情时会迅速爆炸。

建议内建条件：

- `flag`
- `variable`
- `event-fired`
- `event-fired-count`
- `months-since-event`
- `chapter`
- `date`
- `location`
- `character-exists`
- `character-available`
- `character-in-clan`
- `character-in-city`
- `clan-exists`
- `clan-relation`
- `city-owner`
- `mission-status`
- `custom`

### 事件优先级

同一时机可能满足多个事件，所以 `trigger.priority` 必须存在。否则：

- 同地点多个事件会抢触发
- 模组追加事件时顺序不可控
- 调试时无法解释“为什么触发的是 B 不是 A”

### 一次性与连锁

官方事件设计天然很依赖前置事件和一次性属性，所以 HTML 版也要把这两类规则放进领域模型，而不是交给页面层偷偷处理：

- `occurrence: "once" | "repeatable" | "once-per-chapter"`
- `nextEventId`
- `eventHistory`

## 7. 对齐官方模组工具后的约束

如果后面想保留“可导出为类似官方事件脚本”的可能性，当前工程应提前遵守这些约束：

- 所有事件必须有稳定字符串 ID
- 事件入口和演出内容要分离
- 事件脚本必须能串联其他事件，而不是只能跳 scene
- 文本内容、资源调用、数据修改都要声明式记录
- 事件触发不能依赖组件生命周期副作用
- 内容层必须可序列化，不能塞函数闭包

换句话说，浏览器版不要直接模仿官方脚本语法，但要模仿它的“结构化约束”。

## 8. 模组化要求

后续一开始就按可模组覆盖来设计：

- 所有核心内容对象都必须有稳定 ID
- 内容文件只做追加或覆盖，不依赖硬编码数组顺序
- 场景脚本引用对象统一走 ID
- 资源路径统一走资源注册表
- 自定义行为统一走 `custom` action / function handler 扩展点

建议约束：

- 本体数据：`src/content/base`
- 模组数据：`mods/<mod-id>/content`
- 加载顺序：本体 -> DLC/官方扩展 -> 用户模组
- 同 ID 后加载覆盖前加载

## 9. CSS 拆分原则

CSS 不按页面随便堆，按责任拆：

- `tokens.css`：颜色、字号、间距、层级、阴影、动画时长
- `base.css`：reset、元素默认样式、排版基线
- `layout.css`：页面骨架、全局栏位、主舞台布局
- `components.css`：按钮、面板、头像卡、对话框、选项框
- `views.css`：地图页、城市页、房屋页、剧情页的专属布局

命名规则：

- `l-`：layout，如 `l-shell`
- `c-`：component，如 `c-dialog`
- `view-`：页面，如 `view-map`
- `u-`：utility，如 `u-hidden`
- `is-` / `has-`：状态，如 `is-active`

不要这样写：

- `left-box`
- `big-button`
- `page2-panel`

因为多人协作时这些名字很快会失控。

## 10. 并行开发切分建议

适合拆给不同成员同时开发的模块：

1. 地图与移动系统
2. 城市与房屋导航
3. 角色资料与角色功能系统
4. 剧情 action 执行器
5. 全局 UI 面板
6. 交易系统
7. 小游戏接入层

公共约束：

- `domain` 类型改动必须先更新文档
- 内容配置不得直接调用 DOM
- UI 组件不得写死剧情台词和人物属性逻辑
- 小游戏只通过标准输入输出接口接入主流程
## 0. 开发原则补充

### 机制优先，不写一次性流程

项目中的玩法开发优先提炼为可复用机制，而不是把当前需求写成一次性剧情插片、一次性 house 特判或一次性 UI 流程。

遇到以下需求时，应先判断是否已经存在可抽象的共享骨架：

- 评定 / 议事 / 周期推进
- 贡献统计、排名、嘉奖
- 方针宣布、任务分派
- 时间快进、等待截止日、自动回场
- 通用小游戏外壳

如果当前实现方式看起来像：

- 某个 house 的临时专属分支
- 剧情推进中的手工拼接节点
- 另一套已有机制的复制版本

则优先回退一步，先抽取共享状态机、共享 runtime contract 或共享组件，再落回具体内容数据。

### 内容变化放数据，流程骨架做共享

同类玩法的差异优先放在 `content` / 配置层，不要把流程差异硬编码在 `application` 分支里。

例如：

- 第一次寺庙评定和第二次寺庙评定，可以共用同一评定流程骨架，只替换贡献榜、嘉奖词、方针文本和可选工作列表。
- 帅府评定、寺庙评定、未来其他阵营评定，应优先共用同类阶段推进机制，而不是各写一套“看起来差不多”的逻辑。

### 参考成熟历史模拟设计，不从零编造概念

本项目是太阁类历史模拟玩法，不应在已有成熟范式存在时从头发明核心玩法概念。

开发新系统前，优先按以下顺序思考：

1. 仓内是否已经有类似机制。
2. 太阁系与其他经典历史模拟游戏是否已有成熟节奏和结构。
3. 是否可以在既有 genre 设计上做本项目语义化落地。

只有在“仓内没有、经典范式也不适配”的情况下，才考虑新增完全原创机制。
