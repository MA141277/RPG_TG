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
          └─ scene/action hooks

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

Scene
  └─ ActionNode[]
      ├─ background
      ├─ music
      ├─ dialogue
      ├─ choice
      ├─ jump
      ├─ effect
      └─ callback

GlobalUI
  ├─ playerCard
  ├─ activeMission
  └─ quickPanels
```

新增一层事件封装后，建议关系改成：

```text
Trigger/Event
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
      ├─ effect
      ├─ jump
      ├─ start-event
      └─ callback
```

## 3. 你这套玩法对应的数据拆法

### House

`House` 只描述“可进入的地点”和它的默认交互状态：

- `backAction`：返回上一级
- `characterIds`：房屋中可交互角色
- `defaultCharacterId`：默认打开主角色
- `onEnterSceneId`：进入房屋时触发的剧情

不要把人物详细数据直接塞进 `House`，只保留 ID 引用，避免多人编辑时互相冲突。

### Action 列表

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
- `market`, `lordHouse`, `inn` 等标签

### Map

地图层只处理：

- 当前所在城市
- 相邻城市
- 移动消耗
- 点击城池进入

地图不要直接知道某个角色说什么，这属于 scene 层。

### 全局栏目

常驻 UI 独立建模，不挂在某个页面组件下面：

- 左上角角色卡
- 主任务追踪
- 通用资源条
- 通知/提示

这样地图、城市、房屋、剧情页都能共享同一套全局面板。

## 4. 推荐状态结构

```ts
type GameState = {
  world: {
    currentMapId: MapId;
    currentCityId: CityId;
    currentHouseId: HouseId | null;
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
    openPanels: string[];
  };
  missions: {
    activeMissionId: MissionId | null;
  };
  runtime: {
    flags: Record<string, boolean>;
    variables: Record<string, number | string>;
    eventHistory: Record<
      EventId,
      { firedCount: number; lastTriggeredOn: string | null }
    >;
  };
};
```

其中 `calendar` 和 `runtime.eventHistory` 是事件系统必须的基础字段。没有这两个字段，就很难表达：

- 某事件只能在某章节之后触发
- 某事件距离上一次发生已过 X 个月
- 某事件已经发生过，不能再触发
- 某连锁事件必须在前置事件发生后才开放

## 5. 事件触发规则设计

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

官方事件设计天然很依赖前置事件和一次性属性，所以你的 HTML 版也要把这两类规则放进领域模型，而不是交给页面层偷偷处理：

- `occurrence: "once" | "repeatable" | "once-per-chapter"`
- `nextEventId`
- `eventHistory`

## 6. 对齐官方模组工具后的约束

如果你后面想保留“可导出为类似官方事件脚本”的可能性，当前工程应提前遵守这些约束：

- 所有事件必须有稳定字符串 ID
- 事件入口和演出内容要分离
- 事件脚本必须能串联其他事件，而不是只能跳 scene
- 文本内容、资源调用、数据修改都要声明式记录
- 事件触发不能依赖组件生命周期副作用
- 内容层必须可序列化，不能塞函数闭包

换句话说，浏览器版不要直接模仿官方脚本语法，但要模仿它的“结构化约束”。

## 7. 模组化要求

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

## 8. CSS 拆分原则

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

## 9. 并行开发切分建议

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
